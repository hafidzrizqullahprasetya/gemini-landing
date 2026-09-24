#!/usr/bin/env python3
import json
import sys
import os
from datetime import datetime

DATA_PATH = os.path.expanduser("~/Project/gemini-landing/data/links.json")

def load_links():
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_links(links):
    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(links, f, indent=2, ensure_ascii=False)

def add_link(url_or_code):
    links = load_links()
    url = url_or_code.strip()
    if not url.startswith("http"):
        url = f"https://serviceactivation.google.com/redeem?promocode={url}"
    
    # Check if duplicate
    for item in links:
        if item.get("url") == url:
            print(f"[!] Link sudah ada di database (ID: {item['id']})")
            return

    new_id = max([x.get("id", 0) for x in links], default=0) + 1
    new_entry = {
        "id": new_id,
        "code": url.split("promocode=")[-1] if "promocode=" in url else f"OCTANE-{new_id:03d}",
        "url": url,
        "status": "available",
        "created_at": datetime.utcnow().isoformat() + "Z",
        "claimed_at": None,
        "order_id": None
    }
    links.append(new_entry)
    save_links(links)
    print(f"[✓] Berhasil menambahkan link (ID: {new_id}): {url}")

def list_links():
    links = load_links()
    available = [x for x in links if x.get("status") == "available"]
    claimed = [x for x in links if x.get("status") == "claimed"]
    print(f"Total Link: {len(links)} | Tersedia: {len(available)} | Terklaim: {len(claimed)}\n")
    for x in links:
        status_sym = "🟢" if x.get("status") == "available" else "🔴"
        print(f"[{status_sym}] #{x.get('id')} [{x.get('status').upper()}] {x.get('url')} (Claimed: {x.get('claimed_at') or '-'})")

def get_stock():
    links = load_links()
    available = [x for x in links if x.get("status") == "available"]
    print(len(available))

def pop_link(order_id="MANUAL"):
    links = load_links()
    for item in links:
        if item.get("status") == "available":
            item["status"] = "claimed"
            item["claimed_at"] = datetime.utcnow().isoformat() + "Z"
            item["order_id"] = order_id
            save_links(links)
            print(item["url"])
            return
    print("[!] Stok link aktivasi habis!")
    sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 manage-links.py [add <url> | list | stock | pop <order_id>]")
        sys.exit(0)
    
    cmd = sys.argv[1].lower()
    if cmd == "add" and len(sys.argv) >= 3:
        add_link(sys.argv[2])
    elif cmd == "list":
        list_links()
    elif cmd == "stock":
        get_stock()
    elif cmd == "pop":
        oid = sys.argv[2] if len(sys.argv) >= 3 else "MANUAL"
        pop_link(oid)
    else:
        print("Command tidak dikenal.")
