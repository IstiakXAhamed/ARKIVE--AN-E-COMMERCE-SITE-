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
  # rm -f postcss.config.js  <-- FIX: Keep this! Required for Tailwind v4

  echo "📦 Installing dependencies..."
  # Install ALL dependencies (including devDependencies) so Tailwind/PostCSS work
  npm install --production=false

  echo "🔨 Building app (NPROC-Safe Mode)..."
  # Completely disable any process spawning
  export NEXT_TELEMETRY_DISABLED=1
  export UV_THREADPOOL_SIZE=1
  export NEXT_CPU_COUNT=1
  export PRISMA_CLIENT_ENGINE_TYPE=library
  # Disable Turbopack to use webpack with single thread
  export TURBOPACK=0
  export NEXT_WEBPACK_USEPOLLING=0
  # Disable webpack persistent caching (reduces disk/memory usage)
  export NEXT_WEBPACK_FS_CACHE=0
  # Force single worker for everything
  export NODE_OPTIONS="--max-old-space-size=1024 --no-warnings"
  
  # Build with experimental compile mode to skip static page generation
  # This avoids the EAGAIN error from spawning workers during "Collecting page data"
  # Run compile first, then generate to finalize
  ./node_modules/.bin/next build --experimental-build-mode compile
  ./node_modules/.bin/next build --experimental-build-mode generate

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
