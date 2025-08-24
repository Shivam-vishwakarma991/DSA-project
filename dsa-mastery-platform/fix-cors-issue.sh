#!/bin/bash

echo "🔧 Fixing CORS and Port Configuration Issues..."
echo "================================================"

# Stop all containers
echo "🛑 Stopping all containers..."
docker-compose down

# Remove all containers and images
echo "🧹 Removing old containers and images..."
docker-compose rm -f
docker system prune -f

# Clean Next.js build cache
echo "🧹 Cleaning Next.js build cache..."
if [ -d "client/.next" ]; then
    rm -rf client/.next
fi

# Clean node_modules (optional, but recommended)
echo "🧹 Cleaning node_modules..."
if [ -d "client/node_modules" ]; then
    rm -rf client/node_modules
fi

# Rebuild everything from scratch
echo "🏗️  Rebuilding containers with fresh configuration..."
docker-compose build --no-cache

# Start containers
echo "🚀 Starting containers..."
docker-compose up -d

# Wait for containers to be ready
echo "⏳ Waiting for containers to be ready..."
sleep 15

# Check container status
echo "📊 Container status:"
docker-compose ps

# Test the configuration
echo "🧪 Testing configuration..."
echo "Testing backend health..."
curl -s http://13.203.101.91:5001/health || echo "Backend not ready yet"

echo "Testing frontend..."
curl -s http://13.203.101.91:3000 | head -n 5 || echo "Frontend not ready yet"

echo ""
echo "✅ Fix completed!"
echo "🌐 Frontend: http://13.203.101.91:3000"
echo "🔧 Backend: http://13.203.101.91:5001"
echo ""
echo "📋 To check logs:"
echo "   docker-compose logs -f frontend"
echo "   docker-compose logs -f backend"
