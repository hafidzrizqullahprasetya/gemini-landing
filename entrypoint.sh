#!/bin/sh
set -e

# Start Node.js Midtrans API backend in background
echo "[Entrypoint] Starting Midtrans API backend on port 3001..."
node /app/api-server/index.js &

# Start Nginx in foreground
echo "[Entrypoint] Starting Nginx on port 80..."
exec nginx -g "daemon off;"
