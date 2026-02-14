const { execSync } = require('child_process');

console.log('🚀 Starting NPROC-safe build...');

// Set strict resource limits
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.UV_THREADPOOL_SIZE = '1';
process.env.NEXT_CPU_COUNT = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=1024 --no-warnings';

// Additional flags to reduce spawning
const flags = [
  '--no-lint',      // Skip linting (runs in separate process)
  '--no-mangling',   // Reduce CPU usage
  '--profile'       // sometimes helps tracing
];

try {
  console.log('🔨 Building Next.js application...');
  // Force "experimental-build-mode: compile" to skip static generation phase (which spawns workers)
  // We will let the runtime handle the generation lazily if needed, or run it separately.
  execSync('node_modules/.bin/next build --experimental-build-mode compile ' + flags.join(' '), {
    stdio: 'inherit',
    env: process.env
  });
  
  console.log('✅ Build completed successfully (Compile Mode).');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
