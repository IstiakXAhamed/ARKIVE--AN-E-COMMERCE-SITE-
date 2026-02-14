/**
 * ARKIVE Modern - cPanel Entry Point (NPROC-LOCKED)
 * Inspired by SilkMart Stable Configuration
 */

// 1. Lock environment
process.env.UV_THREADPOOL_SIZE = '1';
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';

// 2. Mock CPUs to 1
const os = require('os');
const _cpus = os.cpus;
os.cpus = function() {
  const c = _cpus.call(os);
  return c.length > 0 ? [c[0]] : [{ model: 'cpu', speed: 2000, times: {} }];
};

// 3. Block child process spawning (The SilkLock)
const child_process = require('child_process');
const originalFork = child_process.fork;
child_process.fork = function(modulePath, args, options) {
  const opts = Object.assign({}, options, {
    env: Object.assign({}, process.env, (options && options.env) || {}),
    detached: false
  });
  opts.env.UV_THREADPOOL_SIZE = '1';
  return originalFork.call(child_process, modulePath, args, opts);
};

const originalSpawn = child_process.spawn;
child_process.spawn = function(command, args, options) {
  const opts = Object.assign({}, options, {
    env: Object.assign({}, process.env, (options && options.env) || {}),
    detached: false
  });
  opts.env.UV_THREADPOOL_SIZE = '1';
  return originalSpawn.call(child_process, command, args, opts);
};

console.log(`[PID ${process.pid}] ARKIVE NPROC Lock Active: UV=1, CPUs=1`);

// 4. Start Next.js server
const next = require('next');
const http = require('http');

const PORT = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res);
  });
  server.listen(PORT, () => {
    console.log(`[PID ${process.pid}] ARKIVE ready on port ${PORT}`);
  });
}).catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
