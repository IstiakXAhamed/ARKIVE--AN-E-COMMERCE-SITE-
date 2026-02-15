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
  echo "📦 Installing dependencies (with legacy-peer-deps to fix React 19 issues)..."
  
  # Clean install to ensure stability
  rm -rf node_modules package-lock.json
  npm cache clean --force
  
  # CRITICAL: Always use --legacy-peer-deps for React 19 compatibility
  # We install ALL dependencies first because we need them to BUILD the app.
  npm install --legacy-peer-deps --no-audit

  echo "🗄️  Syncing Database Schema..."
  # Use db push because there are no migration files in the project.
  # --accept-data-loss is used because it's a non-interactive shell.
  npx prisma db push --accept-data-loss

  echo "🔄 Generating Prisma Client..."
  # Explicitly generate client to be safe
  npx prisma generate

  echo "🏗️  Building Next.js application..."
  
  # Resource Limits for Shared Hosting
  export NEXT_TELEMETRY_DISABLED=1
  export UV_THREADPOOL_SIZE=1
  export NEXT_CPU_COUNT=1
  
  # Increase memory for build process (4GB)
  # Keeping silk-lock reference if you have it, otherwise just use standard options
  if [ -f "./silk-lock.js" ]; then
      export NODE_OPTIONS="-r ./silk-lock.js --max-old-space-size=4096 --no-warnings"
  else
      export NODE_OPTIONS="--max-old-space-size=4096"
  fi
  
  npm run build

  echo "🧹 Cleaning up..."
  # Remove devDependencies to save space/memory in production
  # Note: Be careful with pruning if you have peer deps issues
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
