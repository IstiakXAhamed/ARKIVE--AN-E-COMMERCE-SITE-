#!/bin/bash
# Database Migration Script for ARKIVE
# This script helps safely migrate existing database to new schema

echo "========================================"
echo "🔄 ARKIVE Database Migration Tool"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running in right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found!${NC}"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "Step 1: Creating backup..."
read -p "Enter MySQL root password: " -s MYSQL_PASS
echo ""

# Create backup
BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
mysqldump -u root -p"$MYSQL_PASS" arkive_store > "$BACKUP_FILE" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup created: $BACKUP_FILE${NC}"
else
    echo -e "${RED}❌ Backup failed! Check MySQL password.${NC}"
    exit 1
fi

echo ""
echo "Step 2: Installing dependencies..."
npm install

echo ""
echo "Step 3: Generating Prisma Client..."
npx prisma generate

echo ""
echo "Step 4: Checking current database..."
echo "Current tables in arkive_store:"
mysql -u root -p"$MYSQL_PASS" -e "USE arkive_store; SHOW TABLES;" 2>/dev/null

echo ""
echo "Step 5: Creating migration..."
echo -e "${YELLOW}⚠️  Review the generated SQL file before proceeding!${NC}"
read -p "Press Enter to create migration..."

npx prisma migrate dev --name upgrade_to_full_schema --create-only

echo ""
echo -e "${GREEN}✅ Migration file created!${NC}"
echo ""
echo "Next steps:"
echo "1. Review: prisma/migrations/[timestamp]_upgrade_to_full_schema/migration.sql"
echo "2. Look for any 'DROP TABLE' statements - there should be NONE for products/categories"
echo "3. If safe, run: npx prisma migrate dev"
echo "4. Verify with: npx prisma studio"
echo ""
echo "If anything goes wrong, restore with:"
echo "mysql -u root -p arkive_store < $BACKUP_FILE"
