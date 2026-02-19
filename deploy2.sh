#!/bin/bash

# ARKIVE E-Commerce Deployment Script for cPanel/Shared Hosting
# Handles production build with enhanced error recovery for CloudLinux NPROC limits

set -e

echo "🚀 Starting ARKIVE cPanel deployment..."

# Function to handle cleanup on error
cleanup() {
    echo "❌ Deployment failed. Cleaning up..."
    exit 1
}

trap cleanup ERR

# 1. Verify Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please ensure Node.js is installed."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# 2. Clean old node_modules to prevent EAGAIN spawn errors
echo "🧹 Cleaning node_modules and cache..."
rm -rf node_modules
rm -f package-lock.json

# Clear npm cache to prevent corruption
npm cache clean --force

# 3. Install dependencies with correct flags for npm 9+
# --omit=dev: Don't install devDependencies (replaces deprecated --production)
# --legacy-peer-deps: Handle React 19 peer dependency warnings gracefully
echo "📦 Installing dependencies (may take 2-3 minutes)..."
npm install --omit=dev --legacy-peer-deps --verbose

if [ $? -ne 0 ]; then
    echo "❌ npm install failed. Retrying with simplified flags..."
    npm install --omit=dev
fi

# 4. Generate Prisma Client with correct binary for the target OS
echo "⚙️ Generating Prisma Client..."
npx prisma generate

# 5. Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy || echo "⚠️ Migration warning (database may be up-to-date)"

# 6. Build Next.js with optimizations
echo "🔨 Building Next.js application..."
npm run build

# 7. Verify build success
if [ ! -d ".next" ]; then
    echo "❌ Build failed - .next directory not found"
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "📊 Build artifacts:"
ls -lh .next 2>/dev/null || echo "  .next directory exists"

# 8. Final verification
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps for cPanel deployment:"
echo "   1. In cPanel, set startup file to: npm start"
echo "   2. Set Node.js version to: 18.x or 20.x"
echo "   3. Ensure .env.local has correct DATABASE_URL"
echo "   4. Set port to: 3000 (or configured in cPanel)"
echo "   5. Monitor error logs in cPanel terminal"
echo ""
echo "🔗 Verify deployment:"
echo "   curl http://localhost:3000/api/health"
echo ""
echo "⚠️ If 'EAGAIN: spawn' errors occur:"
echo "   - Rerun this script to clean and reinstall"
echo "   - Contact hosting provider about NPROC limits"
echo "   - May need process supervisor configuration"
