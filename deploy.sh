#!/bin/bash

# ARKIVE E-Commerce Deployment Script
# Handles production build and deployment with Prisma binary regeneration

set -e

echo "🚀 Starting ARKIVE deployment..."

# 1. Clean node_modules to force Prisma binary regeneration
echo "🧹 Cleaning node_modules..."
rm -rf node_modules package-lock.json

# 2. Install dependencies with correct npm 9+ syntax
# Using --omit=dev instead of deprecated --production flag
# Using --legacy-peer-deps to handle React 19 peer dependency warnings
echo "📦 Installing dependencies..."
npm install --omit=dev --legacy-peer-deps

# 3. Generate Prisma Client (ensures correct binary for target OS)
echo "⚙️ Generating Prisma Client..."
npx prisma generate

# 4. Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# 5. Build Next.js application
echo "🔨 Building Next.js application..."
npm run build

# 6. Verify build success
if [ -d ".next" ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed - .next directory not found"
    exit 1
fi

echo "✅ Deployment complete! Ready for production."
echo "📝 Next steps:"
echo "   1. Verify database connection: npx prisma db execute --stdin < /dev/null"
echo "   2. Start application: npm start"
echo "   3. Monitor logs"
