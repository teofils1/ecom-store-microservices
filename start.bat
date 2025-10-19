@echo off
echo ========================================
echo E-Commerce Microservices Startup Script
echo ========================================
echo.

echo [1/5] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running!
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo ✓ Docker is installed

echo.
echo [2/5] Checking Docker Compose...
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Compose is not installed!
    pause
    exit /b 1
)
echo ✓ Docker Compose is installed

echo.
echo [3/5] Stopping any running containers...
docker-compose down -v

echo.
echo [4/5] Building and starting services...
echo This may take 3-5 minutes on first run...
echo.
docker-compose up --build -d

echo.
echo [5/5] Waiting for services to start...
timeout /t 30 /nobreak >nul

echo.
echo ========================================
echo Services Status:
echo ========================================
docker-compose ps

echo.
echo ========================================
echo Application URLs:
echo ========================================
echo Frontend:              http://localhost:3000
echo Product Service:       http://localhost:8081/api/products
echo Order Service:         http://localhost:8082/api/orders
echo Payment Service:       http://localhost:8083/api/payments
echo Notification Service:  http://localhost:8084/api/notifications
echo RabbitMQ Management:   http://localhost:15672 (guest/guest)
echo ========================================
echo.
echo ✓ All services are starting up!
echo ✓ Please wait 1-2 minutes for all services to be fully ready
echo.
echo To view logs: docker-compose logs -f
echo To stop services: docker-compose down
echo.
pause
