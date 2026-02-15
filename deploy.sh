#!/bin/bash
# 🚀 Deployment Script for ARKIVE (Next.js + Prisma + cPanel)
# Usage: ./deploy.sh          (Fast deploy: pull + restart only)
# Usage: ./deploy.sh build    (Full deploy: install + db migrate + build + restart)

set -e # Exit immediately if any command fails
# Ensure correct Node version (adjust path if needed)
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH 

# CONFIGURATION
LIVE_DIR=~/ARKIVE-E-COMMERCE
BRANCH="main"

echo "=================================================="
echo "🚀 Starting Deployment for $LIVE_DIR"
echo "🕒 Date: $(date)"
echo "=================================================="

# 1. Navigate to project directory
cd "$LIVE_DIR" || { echo "❌ Directory not found!"; exit 1; }

# 2. Pull latest code
echo "📥 Pulling latest code from $BRANCH..."
git fetch origin $BRANCH
git reset --hard origin/$BRANCH

# 3. Conditional Build Step
if [ "$1" = "build" ]; then
  echo "📦 Updating dependencies..."
  # Optimized install: No cache clean or rm -rf unless needed.
  # Using --legacy-peer-deps for React 19 compatibility.
  npm install --legacy-peer-deps --no-audit

  echo "🗄️  Syncing Database Schema..."
  npx prisma db push --accept-data-loss

  echo "🔄 Generating Prisma Client..."
  npx prisma generate

  echo "🏗️  Building Next.js application..."
  
  # CRITICAL NPROC PROTECTION: Prevent spawning dozens of worker processes
  # This ensures the build stays within cPanel limits (usually 50 NPROC)
  export NEXT_TELEMETRY_DISABLED=1
  export NEXT_CPU_COUNT=1
  export NEXT_PRIVATE_WORKER_PARALLELISM=0
  export UV_THREADPOOL_SIZE=1
  
  # Increase memory but restrict cores
  export NODE_OPTIONS="--max-old-space-size=4096"
  
  # Kill any stray next-server processes from previous failed runs to free up NPROC
  pkill -u $(whoami) -f "next-server" || true
  pkill -u $(whoami) -f "next-render" || true
  
  npm run build

  echo "🧹 Cleaning up..."
  npm prune --production --legacy-peer-deps
else
  echo "⏭️  Skipping build/migration (Fast Deploy Mode)"
  echo "⚠️  NOTE: If you changed package.json or schema.prisma, run './deploy.sh build' instead!"
fi

# 4. Restart Application
echo "♻️  Restarting Passenger..."
mkdir -p tmp
touch tmp/restart.txt

echo "⏳ Waiting 10 seconds for Passenger restart..."
sleep 10

echo "📊 Process check:"
ps -eo pid,comm --no-headers | grep -c "node" || true

echo "=================================================="
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "🌐 Site is live at https://arkivee.com"
echo "=================================================="
