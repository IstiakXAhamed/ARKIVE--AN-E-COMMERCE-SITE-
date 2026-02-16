#!/bin/bash

# ARKIVE REPAIR DEPLOY SCRIPT
# Fixes MIME type errors and ChunkLoadErrors by ensuring clean asset sync

set -e # Exit on error

# Configuration
LIVE_DIR=~/ARKIVE-E-COMMERCE
PUBLIC_ROOT=~/arkivee.com

echo "=================================================="
echo "🛠️  Starting Repair Deployment"
echo "=================================================="

# 1. Navigate to project
cd "$LIVE_DIR" || { echo "❌ Project directory not found!"; exit 1; }

# 2. Clean EVERYTHING
echo "🧹 Cleaning previous build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

# 3. Rebuild (Reduced memory footprint to prevent corruption)
echo "🏗️  Rebuilding Next.js app..."
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# 4. CRITICAL: Aggressive Static Asset Sync
echo "📂 Syncing static assets to $PUBLIC_ROOT..."

# Ensure target directories exist
mkdir -p "$PUBLIC_ROOT/_next/static"

# Remove OLD static assets to prevent conflicts
rm -rf "$PUBLIC_ROOT/_next/static/*"

# Copy NEW static assets
# We copy the CONTENTS of .next/static into public/_next/static
cp -r .next/static/* "$PUBLIC_ROOT/_next/static/"

# 5. Fix Permissions (Crucial for cPanel/Apache)
echo "wx Fixing permissions..."
find "$PUBLIC_ROOT/_next" -type d -exec chmod 755 {} \;
find "$PUBLIC_ROOT/_next" -type f -exec chmod 644 {} \;

# 6. Restart Application
echo "♻️  Restarting Passenger..."
mkdir -p tmp
touch tmp/restart.txt

echo "=================================================="
echo "✅ REPAIR COMPLETE"
echo "👉 Please clear your browser cache and refresh the site."
echo "=================================================="
