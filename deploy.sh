#!/bin/bash
# ARKIVE — NPROC-Safe Deployment Script
# Usage: ./deploy.sh          (pull + restart only)
# Usage: ./deploy.sh build    (pull + clean NPROC-safe rebuild)

set -e

# Core Paths
LIVE_DIR=~/ARKIVE-E-COMMERCE
NODE_BIN=/opt/alt/alt-nodejs20/root/usr/bin
export PATH=$NODE_BIN:$PATH

echo "🚀 Starting ARKIVE deployment..."
cd "$LIVE_DIR"

echo "📥 Pulling latest code..."
git pull origin main 

if [ "$1" = "build" ]; then
  echo "🧹 Cleaning redundant configs..."
  rm -f postcss.config.js

  echo "📦 Installing dependencies..."
  # Full install to ensure all build tools (Tailwind/PostCSS) are available
  npm install


  echo "🔨 Building app (NPROC-Safe Mode)..."
  # Disable parallelism to prevent server crash (EAGAIN)
  # Forces Webpack over Turbopack style worker usage via config
  NODE_OPTIONS="--max-old-space-size=2048" \
  NEXT_PRIVATE_WORKER_PARALLELISM=0 \
  UV_THREADPOOL_SIZE=1 \
  npx next build

  echo "🧹 Pruning dev dependencies..."
  npm prune --production
else
  echo "⏭️ Skipping build (run './deploy.sh build' for full update)"
fi

echo "♻️ Restarting app via Passenger..."
mkdir -p "$LIVE_DIR/tmp"
touch "$LIVE_DIR/tmp/restart.txt"

echo "⏳ Waiting 5 seconds for restart..."
sleep 5

echo "📊 Active Node processes:"
ps -eo pid,comm --no-headers | grep -c "node" || true

echo "✅ Deployment complete! Site is live at https://arkivee.com"
