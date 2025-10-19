#!/bin/bash

echo "========================================"
echo "Stopping E-Commerce Microservices"
echo "========================================"
echo ""

echo "Stopping all containers..."
docker-compose down

echo ""
echo "✓ All services stopped!"
echo ""
echo "To remove all data (databases, volumes): docker-compose down -v"
echo ""
