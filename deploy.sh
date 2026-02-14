#!/bin/bash
set -e

# 0. Core Configuration (SilkMart Style)
LIVE_DIR=~/ARKIVE-E-COMMERCE
NODE_BIN=/opt/alt/alt-nodejs20/root/usr/bin
export PATH=$NODE_BIN:$PATH

echo "🚀 Starting ARKIVE deployment..."

# 1. Navigate to Project Directory
cd "$LIVE_DIR"

# 2. Force Sync with Repository (Fixes "local changes" errors)
echo "📥 pulling latest code..."
git fetch origin main
git reset --hard origin/main

# 3. Load Environment (after pull to get latest .env.example if needed, though .env is local)
if [ -f .env ]; then
  source .env
fi

# 4. Install Dependencies
echo "📦 Installing dependencies..."
# Use npm install to ensure package-lock.json is in sync with Prisma 5.20.0
npm install --production=false

# 5. Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# 6. Build Application (NPROC-Safe Mode)
echo "hammer_and_wrench Building app..."

# Export Critical Resource Limits
export NEXT_TELEMETRY_DISABLED=1
export UV_THREADPOOL_SIZE=1
export NEXT_CPU_COUNT=1
export NODE_OPTIONS="--max-old-space-size=1024 --no-warnings"

# Run Build
./node_modules/.bin/next build

# 7. Cleanup
echo "🧹 Pruning dev dependencies..."
npm prune --production

# 8. Restart Application
echo "♻️ Restarting app via Passenger..."
mkdir -p tmp
touch tmp/restart.txt

echo "✅ Deployment complete! Site is live at https://arkivee.com"
