#!/bin/bash
# 🔧 ARKIVE Clean Rebuild Script
# Rebuilds without npm install --omit=dev to prevent chunk corruption

set -e
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

cd ~/ARKIVE-E-COMMERCE || exit 1

echo "=================================================="
echo "🔧 ARKIVE Clean Rebuild"
echo "🕒 $(date)"
echo "=================================================="

# 1. Pull latest
echo "📥 Pulling latest code..."
git fetch origin main
git reset --hard origin/main

# 2. Clean everything
echo "🧹 Cleaning ALL build artifacts..."
rm -rf .next node_modules package-lock.json

# 3. Fresh install
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps --no-audit

# 4. Generate Prisma
echo "🔄 Generating Prisma Client..."
npx prisma generate

# 5. Build with NPROC protection
echo "🏗️  Building Next.js..."
export NEXT_TELEMETRY_DISABLED=1
export NEXT_CPU_COUNT=1
export NEXT_PRIVATE_WORKER_PARALLELISM=0
export UV_THREADPOOL_SIZE=1
export NODE_OPTIONS="--max-old-space-size=4096"

pkill -u $(whoami) -f "next-server" || true
pkill -u $(whoami) -f "next-render" || true

npm run build

# 6. VERIFY build integrity (DO NOT run npm install --omit=dev)
echo ""
echo "📋 BUILD VERIFICATION:"
echo "======================"

BUILD_ID=$(cat .next/BUILD_ID)
echo "Build ID: $BUILD_ID"

CHUNK_COUNT=$(ls .next/static/chunks/ | wc -l)
echo "Total chunks: $CHUNK_COUNT"

# Check if build manifest exists and has content
if [ -f ".next/static/$BUILD_ID/_buildManifest.js" ]; then
  echo "✅ _buildManifest.js exists"
else
  echo "❌ _buildManifest.js MISSING!"
fi

# List all chunks
echo ""
echo "Chunk files:"
ls .next/static/chunks/
echo ""
echo "App chunks:"
ls -R .next/static/chunks/app/ 2>/dev/null || echo "No app chunks"

# 7. Remove _next from Apache document root
echo ""
echo "🧹 Removing _next from Apache (Node.js serves static files)..."
rm -rf ~/arkivee.com/_next

# 8. Restart
echo "♻️  Restarting Passenger..."
mkdir -p tmp
touch tmp/restart.txt

echo ""
echo "⏳ Waiting 10 seconds..."
sleep 10

# 9. Verify the HTML references match actual chunks
echo ""
echo "🔍 CHUNK CROSS-CHECK:"
echo "HTML references these chunks:"
curl -s https://arkivee.com/ 2>/dev/null | grep -oE '[a-zA-Z0-9]+-[a-f0-9]+\.js' | sort -u | head -20
echo ""
echo "Actual chunk files on disk:"
ls .next/static/chunks/*.js | sed 's|.*/||' | head -20

echo ""
echo "=================================================="
echo "✅ REBUILD COMPLETE!"
echo "=================================================="
