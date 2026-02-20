const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Load .env manually
try {
  const envPath = path.join(__dirname, '.env');
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^"(.*)"$/, '$1');
      process.env[key] = value;
    }
  });
  console.log('Loaded .env file');
} catch (e) {
  console.log('Could not load .env file', e);
}

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Connected successfully.');

    console.log('Checking users table...');
    const userCount = await prisma.users.count();
    console.log(`Found ${userCount} users.`);

    console.log('Checking hero_grid_items table...');
    const match = await prisma.hero_grid_items.findMany();
    console.log('Hero items:', match);

  } catch (e) {
    console.error('Database Verification Failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
