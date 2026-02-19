#!/bin/bash
# ============================================================
# SAFE Deployment Script for ARKIVE
# ============================================================
# Usage:
#   ./arkive.sh              Fast deploy (pull + restart only)
#   ./arkive.sh build        Full deploy (install + build + restart)
#   ./arkive.sh build seed   Full deploy + re-seed database
# ============================================================

set -e
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

LIVE_DIR=~/ARKIVE-E-COMMERCE
BRANCH="main"
BACKUP_DIR=~/backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "=================================================="
echo "ARKIVE Safe Deploy"
echo "$(date)"
echo "=================================================="

# Ensure we are in the right directory
if [ -d "$LIVE_DIR" ]; then
  cd "$LIVE_DIR"
else
  echo "WARNING: $LIVE_DIR not found, assuming current directory"
fi

# ── STEP 1: Pull latest code ──
echo ""
echo "Pulling latest code from $BRANCH..."
git fetch origin $BRANCH
git reset --hard origin/$BRANCH
echo "Code updated"

# ── STEP 2: Full build (only if requested) ──
if [ "$1" = "build" ]; then

  # ── AUTO BACKUP DATABASE BEFORE BUILD ──
  echo ""
  echo "Backing up database before build..."
  mkdir -p "$BACKUP_DIR"
  mysqldump silkmart_Arkive_DB > "$BACKUP_DIR/arkive_$TIMESTAMP.sql" 2>/dev/null && \
    echo "Database backed up to ~/backups/arkive_$TIMESTAMP.sql" || \
    echo "WARNING: Database backup failed or skipped (check ~/.my.cnf and DB credentials)"

  # Keep only last 5 backups to save disk space
  ls -t "$BACKUP_DIR"/arkive_*.sql 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null

  echo ""
  echo "Installing dependencies..."
  rm -rf node_modules package-lock.json .next
  npm install --legacy-peer-deps --no-audit

  echo ""
  echo "🔍 Diagnosing Environment Variables..."
  node scripts/check-env.js || echo "Checking environment failed (script error)"

  echo ""
  echo "Generating Prisma Client..."
  rm -rf node_modules/.prisma
  npx prisma generate

  echo ""
  echo "Syncing database schema (SAFE mode)..."
  # Using simple db push but checking output for data loss warning handled by user awareness
  # Support recommended: npx prisma db push 2>&1 | tee /tmp/prisma_push.log
  # But we will use the improved version support sent
  npx prisma db push 2>&1 | tee /tmp/prisma_push.log

  # Safety check: stop if Prisma warns about data loss
  if grep -qi "data loss" /tmp/prisma_push.log 2>/dev/null; then
    echo ""
    echo "!!! STOPPED: Prisma detected potential data loss!"
    echo "!!! Your data is SAFE. Nothing was changed."
    echo "!!! Contact support before proceeding."
    echo ""
    echo "To restore from backup if needed:"
    echo "  mysql silkmart_Arkive_DB < ~/backups/arkive_$TIMESTAMP.sql"
    exit 1
  fi
  echo "Schema synced safely"

  # ── SEED (only if explicitly requested) ──
  if [ "$2" = "seed" ]; then
    echo ""
    echo "Seeding database..."
    node prisma/seed.js || echo "Seed skipped (already seeded)"
  fi

  echo ""
  echo "Building Next.js..."
  export NEXT_TELEMETRY_DISABLED=1
  export NEXT_CPU_COUNT=1
  export NEXT_PRIVATE_WORKER_PARALLELISM=0
  export UV_THREADPOOL_SIZE=1
  export NODE_OPTIONS="--max-old-space-size=4096"

  # Kill existing processes carefully
  pkill -u $(whoami) -f "next-server" 2>/dev/null || true
  pkill -u $(whoami) -f "next-render" 2>/dev/null || true

  npm run build
  echo "Build complete"

  echo ""
  echo "Removing dev dependencies..."
  npm install --omit=dev --legacy-peer-deps --no-audit

else
  echo ""
  echo "Fast deploy mode (code + restart only)"
  echo "TIP: Run './arkive.sh build' if you changed package.json or schema.prisma"
fi

# ── STEP 3: Update Static Files (Apache/Public Root) ──
echo ""
echo "Updating static files in ~/arkivee.com/_next..."
mkdir -p ~/arkivee.com/_next
# First remove old to prevent buildup, then copy new
rm -rf ~/arkivee.com/_next/*
cp -r .next/static ~/arkivee.com/_next/
echo "Static files updated in ~/arkivee.com/_next"

# ── STEP 4: Restart ──
echo ""
echo "Restarting application..."
mkdir -p tmp
touch tmp/restart.txt
sleep 5

echo ""
echo "=================================================="
echo "DEPLOY SUCCESSFUL!"
echo "Site: https://arkivee.com"
echo "=================================================="
