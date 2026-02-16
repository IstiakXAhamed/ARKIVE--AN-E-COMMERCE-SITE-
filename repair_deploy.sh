#!/bin/bash

# ARKIVE REPAIR DEPLOY SCRIPT
# Fixes MIME type / 400 errors caused by Apache rejecting (parentheses) in chunk paths
# Solution: Remove static files from Apache's reach; let Node.js serve them directly.

set -e

LIVE_DIR=~/ARKIVE-E-COMMERCE
PUBLIC_ROOT=~/arkivee.com

echo "=================================================="
echo "🛠️  Starting Repair Deployment"
echo "=================================================="

cd "$LIVE_DIR" || { echo "❌ Project directory not found!"; exit 1; }

# 1. Clean old build + stale static files from Apache's document root
echo "🧹 Cleaning previous build artifacts..."
rm -rf .next
rm -rf node_modules/.cache
# CRITICAL: Remove _next from Apache's document root so Apache stops 400-ing
rm -rf "$PUBLIC_ROOT/_next"

# 2. Rebuild
echo "🏗️  Rebuilding Next.js app..."
export NEXT_TELEMETRY_DISABLED=1
export NEXT_CPU_COUNT=1
export NEXT_PRIVATE_WORKER_PARALLELISM=0
export UV_THREADPOOL_SIZE=1
export NODE_OPTIONS="--max-old-space-size=4096"

pkill -u $(whoami) -f "next-server" || true
pkill -u $(whoami) -f "next-render" || true

npm run build

# 3. DO NOT sync static files to Apache - Node.js serves them directly
# Apache returns 400 on paths containing (shop) due to parentheses
echo "✅ Build complete. Node.js will serve _next/static directly."

# 4. Restart Application
echo "♻️  Restarting Passenger..."
mkdir -p tmp
touch tmp/restart.txt

echo "⏳ Waiting 10 seconds for Passenger restart..."
sleep 10

echo "=================================================="
echo "✅ REPAIR COMPLETE"
echo "👉 Hard refresh (Ctrl+Shift+R) the site to verify."
echo "=================================================="
