#!/bin/bash

# Start dev server in background
npm run dev &
DEV_PID=$!

# Wait for server to be ready
echo "Waiting for server to start..."
sleep 5

# Try different ports (3000 or 3001)
PORT=3000
response=$(curl -s http://localhost:$PORT/api/health 2>/dev/null)
if [ -z "$response" ]; then
  PORT=3001
  response=$(curl -s http://localhost:$PORT/api/health 2>/dev/null)
fi

if [ -n "$response" ]; then
  echo "✓ Health endpoint response:"
  echo "$response" | jq . 2>/dev/null || echo "$response"
else
  echo "✗ No response from health endpoint"
fi

# Kill dev server
kill $DEV_PID 2>/dev/null
