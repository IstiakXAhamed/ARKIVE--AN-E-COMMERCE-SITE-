/**
 * Environment Variable Checker
 * Run with: node scripts/check-env.js
 */
require('dotenv').config(); // Load .env if present

console.log("\n🔍 Checking Environment Variables...");
console.log("=====================================");

const VARS = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "GOOGLE_AI_API_KEY",
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "NEXT_PUBLIC_APP_URL"
];

let missingCount = 0;

VARS.forEach(key => {
  const val = process.env[key];
  if (!val) {
    console.log(`❌ ${key}: MISSING`);
    missingCount++;
  } else {
    // Show first 4 chars for security, or full value if not sensitive (like URLs)
    const display = key.includes("KEY") || key.includes("SECRET") || key.includes("URL") && key.includes("DATABASE")
      ? `${val.substring(0, 4)}...****`
      : val;
    console.log(`✅ ${key}: LOADED (${display})`);
  }
});

console.log("\n");

if (process.env.NEXTAUTH_URL) {
  if (!process.env.NEXTAUTH_URL.startsWith("http")) {
    console.warn("⚠️  WARNING: NEXTAUTH_URL should start with http:// or https://");
  }
  console.log(`ℹ️  Based on NEXTAUTH_URL, your Google Redirect URI should be:`);
  console.log(`   ${process.env.NEXTAUTH_URL}/api/auth/callback/google`);
  console.log(`   (Make sure this EXACT value is in Google Cloud Console)`);
}

console.log("=====================================");
if (missingCount > 0) {
  console.log(`❌ Found ${missingCount} missing variables.`);
  console.log("👉 Please make sure your .env file exists on the server and contains these keys.");
} else {
  console.log("✅ All critical variables appear to be set.");
}
console.log("\n");
