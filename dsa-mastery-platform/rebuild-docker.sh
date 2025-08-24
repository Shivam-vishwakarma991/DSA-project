#!/bin/bash

echo "🔄 Stopping existing containers..."
docker-compose down

echo "🧹 Removing old images..."
docker-compose rm -f

echo "🏗️  Rebuilding containers..."
docker-compose build --no-cache

echo "🚀 Starting containers..."
docker-compose up -d

echo "⏳ Waiting for containers to be ready..."
sleep 10

echo "✅ Containers are starting up!"
echo "📊 Check container status with: docker-compose ps"
echo "📋 View logs with: docker-compose logs -f"

echo "🧪 Testing CORS configuration..."
if command -v node &> /dev/null; then
  node test-cors.js
else
  echo "⚠️  Node.js not available for CORS testing"
fi
