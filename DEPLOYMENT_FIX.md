# 🚀 ARKIVE Deployment Guide - npm Error Fix

## ✅ Issue Fixed: `npm warn config production` Error

### Problem
```
npm warn config production Use --omit=dev instead. npm error
```

This error occurs because:
1. **npm 9+** deprecated the `--production` flag
2. Old scripts using `npm install --production` now throw warnings/errors
3. Prisma binaries may not regenerate, causing build failures

### ✅ Solution Implemented

#### 1. **New Deploy Scripts Created**

**`deploy.sh`** - Standard production deployment
```bash
#!/bin/bash
set -e

# Clean node_modules for Prisma binary regeneration
rm -rf node_modules package-lock.json

# Install with npm 9+ correct syntax
npm install --omit=dev --legacy-peer-deps

# Generate Prisma Client
npx prisma generate

# Run migrations & build
npx prisma migrate deploy
npm run build
```

**`deploy2.sh`** - Enhanced cPanel deployment
- Includes error recovery for CloudLinux NPROC limits
- Verbose logging for troubleshooting
- Cache clearing before install
- Automatic retry with simplified flags
- Deployment verification steps

#### 2. **Key Flags Explained**

| Flag | Purpose | Why Used |
|------|---------|----------|
| `--omit=dev` | Skip devDependencies | Replaces deprecated `--production` |
| `--legacy-peer-deps` | Allow peer dependency warnings | React 19 compatibility (no breaking conflicts) |
| `--force` (npm cache) | Clear corrupted cache | Prevents EAGAIN errors on shared hosting |

#### 3. **package.json Analysis**

✅ **No conflicting peer dependencies detected**
- React 19.0.0 compatible with all @radix-ui packages
- @auth/prisma-adapter supports React 19
- No forced overrides needed

## 🔧 How to Use These Scripts

### Local Machine
```bash
chmod +x deploy.sh
./deploy.sh
```

### cPanel Shared Hosting
```bash
chmod +x deploy2.sh
./deploy2.sh
```

### Manual Execution (if scripts fail)
```bash
# Step 1: Clean
rm -rf node_modules package-lock.json
npm cache clean --force

# Step 2: Install
npm install --omit=dev --legacy-peer-deps

# Step 3: Build
npx prisma generate
npx prisma migrate deploy
npm run build

# Step 4: Verify
test -d .next && echo "✅ Build successful" || echo "❌ Build failed"
```

## ⚠️ Common Issues & Solutions

### Issue: `EAGAIN: spawn` error on cPanel
**Root Cause**: Process limit (NPROC) exceeded on shared hosting  
**Solution**: Use `deploy2.sh` which cleans before installing

```bash
# Or manually:
rm -rf node_modules
npm cache clean --force
npm install --omit=dev --legacy-peer-deps
```

### Issue: `Prisma Client could not locate Query Engine`
**Root Cause**: Binary not regenerated for target OS  
**Solution**: Run after npm install
```bash
npx prisma generate
```

### Issue: Peer dependency warnings during install
**Expected**: React 19 may show "some peer dependencies not met" warnings  
**Safe to ignore**: No breaking conflicts exist  
**If needed**: Use `--legacy-peer-deps` (already in scripts)

## 📋 Deployment Checklist

Before deploying:
- [ ] Environment variables configured (`.env.local`)
- [ ] Database URL points to production
- [ ] NODE_ENV=production set
- [ ] NEXTAUTH_URL matches domain

After deploying:
- [ ] Run health check: `curl https://yourdomain.com/api/health`
- [ ] Check logs for errors
- [ ] Test login/registration
- [ ] Verify admin panel access
- [ ] Test checkout flow

## 📚 Related Files

- `.env.local` - Environment configuration
- `prisma/schema.prisma` - Database schema
- `.gitignore` - Excludes node_modules
- `next.config.ts` - Next.js configuration

## 🆘 If Deployment Still Fails

1. **Check Node.js version**: `node --version` (needs 18+)
2. **Clear all caches**: `npm cache clean --force && rm -rf .next`
3. **Verify database**: `npx prisma db execute --stdin < /dev/null`
4. **Check logs**: `npm start 2>&1 | head -50`
5. **Contact hosting**: If NPROC limit errors, request increase

## ✅ Verification

### Health Endpoint
```bash
curl http://localhost:3000/api/health | jq .
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-02-20T...",
  "uptime": 123.456,
  "environment": "production"
}
```

### Database Connection
```bash
npx prisma db execute --stdin < /dev/null && echo "✅ Connected"
```

### Build Verification
```bash
test -d .next && echo "✅ Build exists" && \
ls .next/server/app/api/health/route.* && echo "✅ API routes compiled"
```

---

**Last Updated**: February 20, 2026  
**Status**: ✅ Production Ready  
**Deployment Scripts**: `deploy.sh`, `deploy2.sh`
