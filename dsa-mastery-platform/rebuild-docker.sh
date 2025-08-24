#!/bin/bash

echo "🔄 Stopping existing containers..."
docker-compose down

echo "🧹 Removing old images..."
docker-compose rm -f

echo "🏗️  Rebuilding containers..."
docker-compose build --no-cache

echo "🚀 Starting containers..."
docker-compose up -d

echo "✅ Containers are starting up!"
echo "📊 Check container status with: docker-compose ps"
echo "📋 View logs with: docker-compose logs -f"
