import http from "node:http";
import https from "node:https";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPaths = [
    path.resolve(__dirname, "../.env"),
    path.resolve(__dirname, ".env"),
    path.resolve(process.cwd(), ".env"),
  ];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, "utf-8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const [k, ...v] = trimmed.split("=");
        if (k && !process.env[k.trim()]) {
          process.env[k.trim()] = v.join("=").trim();
        }
      }
      break;
    }
  }
}
loadEnv();

const PORT = process.env.PORT || 3001;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const MIDTRANS_API_HOST = "api.midtrans.com";
const AUTH_HEADER = "Basic " + Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64");
// Look for data/links.json in current directory or parent
let DATA_PATH = path.resolve(__dirname, "../data/links.json");
if (!fs.existsSync(DATA_PATH)) {
  DATA_PATH = path.resolve(__dirname, "data/links.json");
}

function getAvailableLink(orderId) {
  try {
    if (!fs.existsSync(DATA_PATH)) return null;
    const content = fs.readFileSync(DATA_PATH, "utf-8");
    const links = JSON.parse(content);

    // Find already claimed link for this order
    const existing = links.find((l) => l.order_id === orderId);
    if (existing) return existing.url;

    // Find first available link
    const item = links.find((l) => l.status === "available");
    if (!item) return null;

    // Mark as claimed
    item.status = "claimed";
    item.claimed_at = new Date().toISOString();
    item.order_id = orderId;

    fs.writeFileSync(DATA_PATH, JSON.stringify(links, null, 2), "utf-8");
    return item.url;
  } catch (err) {
    console.error("[getAvailableLink error]:", err);
    return null;
  }
}

function callMidtrans(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        host: MIDTRANS_API_HOST,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: AUTH_HEADER,
        },
        ...options,
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({ statusCode: res.statusCode, data: JSON.parse(body) });
          } catch {
            resolve({ statusCode: res.statusCode, data: body });
          }
        });
      }
    );

    req.on("error", (e) => reject(e));
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // Endpoint: Health check
  if (url.pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
    return;
  }

  // Endpoint: Create QRIS Charge
  if (url.pathname === "/api/charge" && req.method === "POST") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      try {
        let gross_amount = 1; // Default Rp 1 untuk test produksi
        if (body) {
          try {
            const parsed = JSON.parse(body);
            if (parsed.gross_amount) gross_amount = parsed.gross_amount;
          } catch { }
        }

        const orderId = `OCT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

        const midtransRes = await callMidtrans(
          { path: "/v2/charge", method: "POST" },
          {
            payment_type: "qris",
            transaction_details: {
              order_id: orderId,
              gross_amount: gross_amount,
            },
            qris: {
              acquirer: "gopay",
            },
          }
        );

        if (midtransRes.statusCode === 200 || midtransRes.statusCode === 201) {
          const mData = midtransRes.data;
          const qrAction = mData.actions?.find((a) => a.name === "generate-qr-code");
          const qrUrl = qrAction?.url || "";

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: true,
              order_id: orderId,
              transaction_id: mData.transaction_id,
              gross_amount: mData.gross_amount,
              qr_url: qrUrl,
              qr_string: mData.qr_string,
              expiry_time: mData.expiry_time,
              transaction_status: mData.transaction_status,
            })
          );
        } else {
          res.writeHead(midtransRes.statusCode || 500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              message: midtransRes.data?.status_message || "Gagal membuat transaksi QRIS Midtrans",
              error: midtransRes.data,
            })
          );
        }
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: err.message }));
      }
    });
    return;
  }

  // Endpoint: Check Status
  if (url.pathname === "/api/status" && req.method === "GET") {
    const orderId = url.searchParams.get("order_id");
    if (!orderId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "order_id diperlukan" }));
      return;
    }

    try {
      const midtransRes = await callMidtrans(
        { path: `/v2/${encodeURIComponent(orderId)}/status`, method: "GET" }
      );

      if (midtransRes.statusCode === 200) {
        const mData = midtransRes.data;
        const status = mData.transaction_status;
        const isPaid = status === "settlement" || status === "capture";

        let activationLink = null;
        if (isPaid) {
          activationLink = getAvailableLink(orderId);
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: true,
            order_id: orderId,
            transaction_status: status,
            is_paid: isPaid,
            activation_link: activationLink,
            expiry_time: mData.expiry_time,
          })
        );
      } else {
        res.writeHead(midtransRes.statusCode || 404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message: midtransRes.data?.status_message || "Transaksi tidak ditemukan",
          })
        );
      }
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: err.message }));
    }
    return;
  }

  // Endpoint: Midtrans Webhook Notification with SHA-512 Security Verification
  if (url.pathname === "/api/notification" && req.method === "POST") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      try {
        const notification = JSON.parse(body);
        const orderId = notification.order_id;
        const statusCode = notification.status_code;
        const grossAmount = notification.gross_amount;
        const incomingSignature = notification.signature_key;

        // 1. Verifikasi Kriptografi SHA-512 Signature Key resmi Midtrans
        const expectedSignature = crypto
          .createHash("sha512")
          .update(`${orderId}${statusCode}${grossAmount}${MIDTRANS_SERVER_KEY}`)
          .digest("hex");

        if (!incomingSignature || incomingSignature !== expectedSignature) {
          console.warn(`[Security Alert] Fake/Invalid webhook signature detected for order: ${orderId}`);
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "error", message: "Invalid signature key" }));
          return;
        }

        // 2. Double-Check Verifikasi Langsung Server-to-Server ke Midtrans API
        // Mencegah replay attack atau pemalsuan payload
        const midtransRes = await callMidtrans(
          { path: `/v2/${encodeURIComponent(orderId)}/status`, method: "GET" }
        );

        if (midtransRes.statusCode === 200) {
          const verifiedStatus = midtransRes.data?.transaction_status;
          if (verifiedStatus === "settlement" || verifiedStatus === "capture") {
            getAvailableLink(orderId);
            console.log(`[Webhook Success] Verified genuine payment for order ${orderId}`);
          }
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok" }));
      } catch (err) {
        console.error("[Webhook Error]:", err);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "error", message: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(PORT, () => {
  console.log(`[Midtrans API Server] listening on port ${PORT}`);
});
