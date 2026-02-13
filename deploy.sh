#!/bin/bash
set -e


# 0. Set project directory
LIVE_DIR=~/ARKIVE-E-COMMERCE
cd $LIVE_DIR

# Load environment variables
source .env

echo "🚀 Starting ARKIVE deployment..."

# 1. Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# 2. Clean install dependencies
echo "📦 Installing dependencies..."
# Use npm install to update package-lock.json for downgraded Prisma
npm install --prefer-offline --no-audit

# 3. Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# 4. Build application with strict resource limits
echo "hammer_and_wrench Building app (NPROC-Safe Mode)..."

# Limit libuv threadpool (default is 4)
export UV_THREADPOOL_SIZE=1

# Limit Next.js build workers
export NEXT_CPU_COUNT=1

# Disable Source Maps (redundant if in next.config.ts but safe to add)
export GENERATE_SOURCEMAP=false

# Node memory limit (conservative for shared hosting)
# Use direct binary to bypass npm process overhead
NODE_OPTIONS="--max-old-space-size=1024 --no-warnings" ./node_modules/.bin/next build

# 5. Prune dev dependencies
echo "🧹 Pruning dev dependencies..."
npm prune --production

# 6. Restart Application via Passenger
echo "♻️ Restarting app via Passenger..."
mkdir -p tmp
touch tmp/restart.txt

# Wait for restart
echo "⏳ Waiting 5 seconds for restart..."
sleep 5

echo "📊 Active Node processes:"
pgrep -a node || echo "No node processes found (Passenger might be starting)"

echo "✅ Deployment complete! Site is live at https://arkivee.com"
