# 🔄 Database Migration Guide: Safe Upgrade Without Data Loss

## ⚠️ **IMPORTANT: BACKUP FIRST!**

Before making ANY changes, create a backup:

```bash
# Via MySQL command line
mysqldump -u root -p arkive_store > arkive_store_backup_$(date +%Y%m%d_%H%M%S).sql

# Via XAMPP phpMyAdmin
# 1. Open http://localhost/phpmyadmin
# 2. Select 'arkive_store' database
# 3. Click 'Export' → 'Quick' → 'Go'
```

---

## 📋 **Migration Strategy Overview**

Your current database has existing product data. The new schema has **22 models** with relationships. We'll:

1. **Introspect** current database structure
2. **Compare** with new schema
3. **Create baseline migration** (if needed)
4. **Apply new schema** safely
5. **Verify** data integrity

---

## 🔍 **Step 1: Check Current Database Structure**

### **Option A: Introspect Existing Database**

```bash
# First, pull current schema from database
npx prisma db pull

# This will update schema.prisma to match your current database
# Review what tables already exist
```

### **Option B: Manual Check via MySQL**

```bash
# Connect to MySQL
mysql -u root -p

# Use your database
USE arkive_store;

# See all tables
SHOW TABLES;

# Describe a specific table (e.g., products)
DESCRIBE products;

# Exit
EXIT;
```

---

## 🛠️ **Step 2: Safe Migration Approaches**

### **Approach A: Prisma Migrate (Recommended if no existing migrations)**

Use this if your database was created WITHOUT Prisma migrations:

```bash
# 1. Create a baseline migration (marks current state)
npx prisma migrate resolve --applied 000000000000_squash_migrations

# 2. Generate new migration for the new schema
npx prisma migrate dev --name add_full_schema

# 3. If prompted about data loss, review carefully!
#    - It will create new tables (safe)
#    - It will add columns to existing tables (usually safe)
#    - It will NOT delete existing data
```

### **Approach B: Prisma db Push (Quick but less controlled)**

```bash
# Directly push schema changes to database
npx prisma db push

# ⚠️ WARNING: This can drop columns/data in some cases
# Only use if Approach A fails
```

### **Approach C: Manual Migration (Safest for Production)**

Create custom SQL migration file:

```bash
# 1. Generate SQL diff
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma \
  --script > migration.sql

# 2. Review migration.sql manually

# 3. Apply manually in MySQL
mysql -u root -p arkive_store < migration.sql
```

---

## 📊 **Step 3: What Will Be Added (SAFE - No Data Loss)**

### **New Tables (No Conflict):**
- ✅ `Cart`, `CartItem` - New feature
- ✅ `Order`, `OrderItem`, `Payment` - New feature
- ✅ `Review` - New feature
- ✅ `Wishlist` - New feature
- ✅ `Coupon` - New feature
- ✅ `FlashSale`, `FlashSaleProduct` - New feature
- ✅ `ChatSession`, `ChatMessage` - New feature
- ✅ `InternalMessage` - New feature
- ✅ `Notification` - New feature
- ✅ `ContactMessage` - New feature
- ✅ `SiteSettings` - New feature
- ✅ `InventoryLog` - New feature
- ✅ `NewsletterSubscriber` - New feature
- ✅ `ProductVariant` - New feature
- ✅ `Address` - New feature

### **Existing Tables (Will Be Modified):**
- ⚠️ `Product` - May add columns (safe if NULLable)
- ⚠️ `Category` - May add columns (safe if NULLable)
- ⚠️ `User` - May add columns (safe if NULLable)

---

## 🔒 **Step 4: Data Preservation Strategy**

### **Before Migration:**

```bash
# Create comprehensive backup
mysqldump -u root -p arkive_store > backup_before_migration.sql

# Backup specific tables with data
mysqldump -u root -p arkive_store products categories users > critical_tables_backup.sql
```

### **Migration Commands:**

```bash
cd "C:\Users\samia\Desktop\Learning Journey\HostNin\ARKIVE Website\arkive-modern"

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Option 1: Safe Migration (RECOMMENDED)
npx prisma migrate dev --name upgrade_to_full_schema --create-only

# Review the generated migration file in:
# prisma/migrations/YYYYMMDDHHMMSS_upgrade_to_full_schema/migration.sql

# If it looks safe (no DROP TABLE for products/categories), apply it:
npx prisma migrate dev

# Option 2: Direct Push (if migration fails)
# npx prisma db push
```

---

## ✅ **Step 5: Verify Migration**

```bash
# Check database structure
npx prisma studio

# Or via MySQL
mysql -u root -p -e "USE arkive_store; SHOW TABLES;"

# Count products (should match before)
mysql -u root -p -e "USE arkive_store; SELECT COUNT(*) FROM products;"

# Count categories (should match before)
mysql -u root -p -e "USE arkive_store; SELECT COUNT(*) FROM categories;"
```

---

## 🆘 **Emergency Recovery**

If something goes wrong:

```bash
# Restore from backup
mysql -u root -p arkive_store < backup_before_migration.sql

# Verify restoration
mysql -u root -p -e "USE arkive_store; SHOW TABLES;"
```

---

## 🎯 **QUICK START (Safe Path)**

### **1. Backup (DO THIS FIRST!)**
```bash
# Via XAMPP Shell or Command Prompt
mysqldump -u root -p arkive_store > "C:\Users\samia\Desktop\arkive_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.sql"
```

### **2. Install & Prepare**
```bash
cd "C:\Users\samia\Desktop\Learning Journey\HostNin\ARKIVE Website\arkive-modern"
npm install
npx prisma generate
```

### **3. Introspect Current Database**
```bash
# See what's currently in your database
npx prisma db pull
```

### **4. Create Migration**
```bash
# Create migration without applying (review first!)
npx prisma migrate dev --name upgrade_to_full_schema --create-only

# Review the SQL file created at:
# prisma/migrations/[timestamp]_upgrade_to_full_schema/migration.sql
```

### **5. Review Migration SQL**
Open the migration.sql file and check:
- ✅ Should see `CREATE TABLE` for new tables
- ✅ Should see `ALTER TABLE ADD COLUMN` for existing tables
- ❌ Should NOT see `DROP TABLE products` or `DROP TABLE categories`
- ❌ Should NOT see `DELETE FROM products`

### **6. Apply Migration**
```bash
# If review looks safe:
npx prisma migrate dev

# Or apply specific migration:
npx prisma migrate deploy
```

### **7. Verify**
```bash
# Open Prisma Studio to verify data
npx prisma studio

# Navigate to http://localhost:5555
# Check that your products and categories are still there
```

---

## 📁 **Migration Checklist**

- [ ] Created full database backup
- [ ] Generated Prisma client
- [ ] Created migration (reviewed SQL)
- [ ] Applied migration
- [ ] Verified products table data
- [ ] Verified categories table data
- [ ] Verified users table data
- [ ] Ran seed script for default data
- [ ] Tested application locally

---

## 🔧 **Common Issues & Solutions**

### **Issue 1: "Drift detected"**
```bash
# Reset and reapply
npx prisma migrate reset
# Or mark as resolved
npx prisma migrate resolve --applied [migration_name]
```

### **Issue 2: "Column already exists"**
```bash
# Database has column that schema also defines
# Solution: Remove column from schema or drop from DB
```

### **Issue 3: Foreign key constraints fail**
```bash
# Temporarily disable foreign key checks
mysql -u root -p -e "SET FOREIGN_KEY_CHECKS=0;"
# Apply migration
# Re-enable: SET FOREIGN_KEY_CHECKS=1;
```

### **Issue 4: Data type mismatch**
```bash
# If existing column has different type than schema
# Option 1: Alter column manually
# Option 2: Update schema to match existing type
```

---

## 🎓 **Alternative: Parallel Database Strategy**

If worried about existing data:

```bash
# 1. Create new database for testing
mysql -u root -p -e "CREATE DATABASE arkive_store_new;"

# 2. Copy existing data
mysqldump -u root -p arkive_store | mysql -u root -p arkive_store_new

# 3. Test migration on new database
# Update .env.local temporarily:
DATABASE_URL="mysql://root:@localhost:3306/arkive_store_new"

# 4. Run migration
npx prisma migrate dev

# 5. If successful, migrate original database
# Update .env.local back:
DATABASE_URL="mysql://root:@localhost:3306/arkive_store"
npx prisma migrate dev
```

---

## 📝 **What the Schema Includes**

Your existing `arkive_store` database will be upgraded to include:

**Existing Tables (Preserved):**
- `products` - Your product catalog
- `categories` - Your categories
- `users` - Your users

**New Tables (Added):**
- E-commerce: Orders, Cart, Wishlist, Reviews
- Marketing: Coupons, Flash Sales, Newsletter
- Communication: Chat, Notifications, Messages
- System: Settings, Inventory Logs

**All your existing product data will remain intact!**

---

## 🚀 **Next Steps**

1. **BACKUP YOUR DATABASE NOW!**
2. Run the migration commands above
3. Verify your products are still there
4. Start the application: `npm run dev`
5. Access admin panel and check everything works

**Need help?** Check the migration SQL file before applying - if you see any `DROP TABLE` statements for products/categories, STOP and ask for help!
