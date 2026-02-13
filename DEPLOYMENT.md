# ARKIVE Modern — cPanel Deployment Guide

This guide details exactly how to deploy the ARKIVE Next.js application to cPanel while strictly adhering to NPROC (process) limits.

## 1. Prerequisites (Local Preparation)

Ensure you have the following files created/updated in your local project before uploading.

### A. Custom Server (`app.js`)
Ensure `app.js` is present in the root. This file is critical for handling NPROC limits on cPanel.

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// The port is automatically assigned by Phusion Passenger
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
```

### B. Package.json Update
Update the `scripts` section in `package.json` to use the custom server for production start.

```json
"scripts": {
  "build": "next build",
  "start": "NODE_ENV=production node app.js"
}
```

### C. .htaccess Configuration
Create or update the `.htaccess` file in `arkive-modern/` (and ensure it's uploaded to `public_html`).

```apache
# Turn on the Passenger Node.js application server
PassengerAppRoot "/home/yourusername/public_html"
PassengerBaseURI "/"
PassengerNodejs "/home/yourusername/nodevenv/public_html/20/bin/node"
PassengerAppType node
PassengerStartupFile app.js

# CRITICAL: Prevent NPROC limit violations
PassengerMinInstances 1
PassengerMaxInstances 1
PassengerPoolIdleTime 0

# Rewrite rules for static assets (optional optimization)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.php$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /prod-server.js [L]
</IfModule>
```
*Note: Adjust `/home/yourusername/` to your actual cPanel home path.*

## 2. cPanel Setup Steps

1.  **Node.js App Setup**:
    *   Go to **Setup Node.js App** in cPanel.
    *   Create Application.
    *   **Node.js Version**: 20.x (Recommended).
    *   **Application Mode**: Production.
    *   **Application Root**: `public_html` (or your subdomain folder).
    *   **Application URL**: Your domain.
    *   **Application Startup File**: `prod-server.js`.
    *   Click **Create**.

2.  **Upload Files**:
    *   Upload the contents of `arkive-modern` to the Application Root folder (e.g., `public_html`).
    *   **Exclude**: `node_modules`, `.git`, `.next`.
    *   **Include**: `.next/standalone` contents (see below), `public`, `app.js`, `package.json`, `.htaccess`, `.env`.

3.  **Standalone Build (Optimization)**:
    *   Locally run: `npm run build`.
    *   This creates a `.next/standalone` folder.
    *   Copy critical files *from* `.next/standalone` *to* your project root, OR upload the entire project normally and let cPanel install dependencies.
    *   *Recommendation*: Upload the full source (minus `node_modules`), then run `npm install --production` in cPanel terminal.

4.  **Database Configuration**:
    *   Create a MySQL Database & User in cPanel.
    *   Edit `.env` file in the root:
        ```env
        DATABASE_URL="mysql://db_user:db_pass@127.0.0.1:3306/db_name"
        NEXTAUTH_SECRET="your-secret-key"
        NEXTAUTH_URL="https://yourdomain.com"
        ```

5.  **Install Dependencies**:
    *   In cPanel, click **Run NPM Install** (or run `npm install` in terminal).
    *   This will automatically run `prisma generate` due to the `postinstall` script.
    *   Run Prisma migrations: `npx prisma migrate deploy`.

6.  **Restart**:
    *   Click **Restart Application** in Node.js selector.
    *   Or run `touch tmp/restart.txt` in terminal.

## 3. Verification

*   Check Process Count via Terminal: `ps aux | grep node` (Should be 1 or 2 max).
*   Check Logs: `stderr.log` in your app root if errors occur.

