# 🔄 Environment Switching Guide

## 📁 Environment Files Overview

```
arkive-modern/
├── .env                    # Production environment (for cPanel)
├── .env.local              # Local development (this file)
├── .env.example            # Template (no sensitive data)
└── .gitignore              # Ignores .env.local
```

---

## 🎯 **How Environment Files Work**

### **Next.js Loading Order (Highest Priority First):**

1. `.env.local` ← **Local development (HIGHEST priority)**
2. `.env.production` ← Production builds
3. `.env.development` ← Development builds
4. `.env` ← Default fallback

**Key Point:** `.env.local` **OVERRIDES** values in `.env`

---

## 🚀 **Quick Switch Guide**

### **Option 1: Automatic (RECOMMENDED)**

Next.js automatically picks the right file based on `NODE_ENV`:

```bash
# Development (uses .env.local automatically)
npm run dev

# Production build (uses .env.production or .env)
npm run build
```

### **Option 2: Manual Switch (When You Need Control)**

#### **🔧 LOCAL DEVELOPMENT MODE**

**File Status:**
- ✅ `.env.local` - PRESENT (with local values)
- ✅ `.env` - Keep as backup (don't delete!)

**Commands:**
```bash
# Start development server
npm run dev

# Or explicitly
NODE_ENV=development npm run dev
```

**What Happens:**
- App runs on `http://localhost:3000`
- Uses local MySQL database
- Google OAuth redirects to localhost
- Cloudinary in sandbox mode

---

#### **🌐 PRODUCTION MODE**

**Method A: Rename Files (Simple)**
```bash
# Temporarily disable local config
mv .env.local .env.local.backup

# Now .env will be used
npm run build

# Restore local config after
mv .env.local.backup .env.local
```

**Method B: Use Production File**
```bash
# Create production-specific file
cp .env .env.production.local

# Build (Next.js will use .env.production.local)
npm run build
```

**Method C: Command Line Override**
```bash
# Override specific values inline
NEXTAUTH_URL=https://arkivee.com npm run build

# Or set all at once
export NEXTAUTH_URL=https://arkivee.com
export DATABASE_URL="mysql://silkmart_arkive_user:..."
npm run build
```

---

## 📊 **Environment Comparison**

| Setting | Local (.env.local) | Production (.env) |
|---------|-------------------|-------------------|
| **URL** | http://localhost:3000 | https://arkivee.com |
| **Database** | Local MySQL (root@localhost) | cPanel MySQL (silkmart_arkive_user) |
| **Auth** | Local sessions | Production sessions |
| **Cloudinary** | Same account | Same account |
| **Google OAuth** | http://localhost:3000 redirect | https://arkivee.com redirect |
| **Debug Mode** | Enabled | Disabled |

---

## 🔧 **Step-by-Step: Setting Up Local Dev**

### **1. Database Setup (One-time)**

```bash
# Install XAMPP/WAMP/MAMP
# Start Apache and MySQL

# Create database
mysql -u root -p
CREATE DATABASE arkive_store;
exit;

# Your .env.local already has:
# DATABASE_URL="mysql://root:@localhost:3306/arkive_store"
```

### **2. Google OAuth Setup**

1. Go to: https://console.cloud.google.com/apis/credentials
2. Edit your OAuth 2.0 Client ID
3. Add these **Authorized Redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://arkivee.com/api/auth/callback/google
   ```
4. Add these **Authorized JavaScript Origins**:
   ```
   http://localhost:3000
   https://arkivee.com
   ```

### **3. Run Development Server**

```bash
# All commands from project root
cd "C:\Users\samia\Desktop\Learning Journey\HostNin\ARKIVE Website\arkive-modern"

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed

# Start development (automatically uses .env.local)
npm run dev

# Access at:
# http://localhost:3000 - Storefront
# http://localhost:3000/admin - Admin Panel
```

---

## 🔄 **Common Switching Scenarios**

### **Scenario 1: Test Production Build Locally**

```bash
# Temporarily rename local config
mv .env.local .env.local.dev

# Build with production settings
npm run build

# Start production server
npm start

# Restore local config when done
mv .env.local.dev .env.local
```

### **Scenario 2: Deploy to cPanel**

```bash
# 1. Build locally first (optional test)
npm run build

# 2. Upload files to cPanel
# - Upload everything EXCEPT:
#   - node_modules/
#   - .env.local (keep this local only!)
#   - .next/ (if rebuilding on server)

# 3. On cPanel, create .env file with production values:
#    DATABASE_URL="mysql://silkmart_arkive_user:..."
#    NEXTAUTH_URL="https://arkivee.com"
#    etc...

# 4. Install dependencies on server
npm install

# 5. Generate Prisma client
npx prisma generate

# 6. Build on server (or upload pre-built .next/)
npm run build

# 7. Start application
npm start
```

### **Scenario 3: Switch Database Only**

```bash
# Use local env but connect to production DB (testing)
# Edit .env.local temporarily:
DATABASE_URL="mysql://silkmart_arkive_user:..."

# After testing, restore:
DATABASE_URL="mysql://root:@localhost:3306/arkive_store"
```

---

## 🛠️ **Handy Commands**

```bash
# Check which env file is being used
cat .env.local | grep NEXTAUTH_URL

# Quick local start
npm run dev

# Quick production build test
NODE_ENV=production npm run build

# View environment in Next.js
# Add this to any page.tsx:
# console.log(process.env.NEXTAUTH_URL)

# Verify database connection
npx prisma db pull

# Reset local database
npx prisma migrate reset
npm run db:seed
```

---

## ⚠️ **Important Reminders**

1. **Never commit `.env.local`** - It's already in `.gitignore` ✅

2. **Never commit `.env`** - Production secrets stay local

3. **Keep `.env.example`** - Template without real values for new developers

4. **When in doubt:**
   ```bash
   # Clear Next.js cache if env vars seem wrong
   rm -rf .next
   npm run dev
   ```

5. **Restart server after editing .env files**
   - Next.js only reads env files at startup

---

## 🎓 **Pro Tips**

### **Tip 1: Use Different Databases**
```bash
# .env.local (development)
DATABASE_URL="mysql://root:@localhost:3306/arkive_store_dev"

# .env (production)
DATABASE_URL="mysql://silkmart_arkive_user:...@.../silkmart_Arkive_DB"
```

### **Tip 2: Use `.env.development` and `.env.production`**
```bash
# Instead of switching, create dedicated files:
.env.development    # For npm run dev
.env.production     # For npm run build

# .env.local still overrides both for your machine
```

### **Tip 3: Quick Environment Check Page**
Create `src/app/debug/env/page.tsx`:
```typescript
export default function EnvDebug() {
  return (
    <div>
      <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL}</p>
      <p>NODE_ENV: {process.env.NODE_ENV}</p>
      <p>Database: {process.env.DATABASE_URL?.split('@')[1]}</p>
    </div>
  )
}
```

---

## 📞 **Troubleshooting**

**Problem:** App still using production URLs  
**Solution:** 
```bash
rm -rf .next
npm run dev
```

**Problem:** Database connection failed  
**Solution:** Check if MySQL is running in XAMPP

**Problem:** Google OAuth not working locally  
**Solution:** Add `http://localhost:3000` to Google Console redirect URIs

**Problem:** `.env.local` not loading  
**Solution:** Make sure file is in project root (same level as package.json)

---

## ✅ **Current Setup Status**

You now have:
- ✅ `.env` - Production config (with cPanel values commented out)
- ✅ `.env.local` - Local dev config (active for `npm run dev`)
- ✅ Ready to run locally with `npm run dev`
- ✅ Ready to deploy with `.env` on cPanel

**Next Step:** Run `npm run dev` to start local development! 🚀
