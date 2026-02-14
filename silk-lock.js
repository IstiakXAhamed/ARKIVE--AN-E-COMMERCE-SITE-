/**
 * SilkLock Preload Script
 * Forces NPROC limits on every child process spawned by Node.js
 */
const child_process = require('child_process');
const os = require('os');

// Force environment limits
process.env.UV_THREADPOOL_SIZE = '1';
process.env.NEXT_CPU_COUNT = '1';
process.env.NEXT_TELEMETRY_DISABLED = '1';

// Mock CPU count to 1
os.cpus = function() {
  return [{ model: 'cpu', speed: 2000, times: {} }];
};

// Intercept and patch all child process spawning
const originalSpawn = child_process.spawn;
child_process.spawn = function(command, args, options) {
  const opts = Object.assign({}, options || {}, {
    env: Object.assign({}, process.env, (options && options.env) || {}),
    detached: false
  });
  opts.env.UV_THREADPOOL_SIZE = '1';
  opts.env.NEXT_CPU_COUNT = '1';
  return originalSpawn.call(child_process, command, args, opts);
};

const originalFork = child_process.fork;
child_process.fork = function(modulePath, args, options) {
  const opts = Object.assign({}, options || {}, {
    env: Object.assign({}, process.env, (options && options.env) || {}),
    detached: false
  });
  opts.env.UV_THREADPOOL_SIZE = '1';
  opts.env.NEXT_CPU_COUNT = '1';
  return originalFork.call(child_process, modulePath, args, opts);
};

console.log(`[SilkLock] Applied to PID ${process.pid}`);
