#!/bin/bash

echo "🚀 Starting Shade Services..."

# Kill any existing services on these ports
pkill -f "node.*3001" 2>/dev/null || true
pkill -f "node.*3002" 2>/dev/null || true

echo "3. Waiting for services to start..."
sleep 3

echo "✅ Services started:"
echo "   - Poseidon: http://localhost:3001"
echo "   - Merkle:   http://localhost:3002"
echo ""

