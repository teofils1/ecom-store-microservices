# 🚀 Quick Setup Guide

## Prerequisites

- **Docker Desktop** installed and running
- **Postman** (optional, for API testing)

## Step-by-Step Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd ecom-store-microservices
```

### 2. Start All Services (Easiest Method)

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

This will:
- Build all Docker images
- Start 4 microservices
- Start 4 PostgreSQL databases
- Start RabbitMQ
- Start React frontend

**Wait 2-3 minutes** for all services to fully start.

### 3. Seed Sample Data

**Windows:**
```bash
seed-data.bat
```

**Linux/Mac:**
```bash
chmod +x seed-data.sh
./seed-data.sh
```

This creates 10 sample products.

### 4. Access the Application

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Product API** | http://localhost:8081/api/products |
| **Order API** | http://localhost:8082/api/orders |
| **Payment API** | http://localhost:8083/api/payments |
| **Notification API** | http://localhost:8084/api/notifications |
| **RabbitMQ UI** | http://localhost:15672 (guest/guest) |

### 5. Test Complete Flow

1. Open http://localhost:3000
2. Browse products
3. Add items to cart
4. Click "Cart" and review items
5. Click "Proceed to Checkout"
6. Fill in:
   - Email: `test@example.com`
   - Name: `Test User`
   - Address: `123 Test St, Test City, TC 12345`
   - Payment Method: `Credit Card`
7. Click "Place Order"
8. View RabbitMQ Management UI to see messages flowing
9. Check Notification Service for sent emails
10. View your order in "My Orders" (enter your email)

### 6. Stop Services

**Windows:**
```bash
stop.bat
```

**Linux/Mac:**
```bash
./stop.sh
```

## Manual Docker Commands

### Build and Start
```bash
docker-compose up --build -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f product-service
docker-compose logs -f order-service
docker-compose logs -f payment-service
docker-compose logs -f notification-service
```

### Check Status
```bash
docker-compose ps
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove All Data
```bash
docker-compose down -v
```

## Testing with Postman

1. Open Postman
2. Import collection: `postman/E-Commerce-Microservices-API.postman_collection.json`
3. Set environment variables:
   - `product_service_url = http://localhost:8081`
   - `order_service_url = http://localhost:8082`
   - `payment_service_url = http://localhost:8083`
   - `notification_service_url = http://localhost:8084`
4. Run the "Complete Order Flow" folder to test end-to-end

## Troubleshooting

### Ports Already in Use

Stop other applications using these ports:
- 3000 (Frontend)
- 8081-8084 (Microservices)
- 5432-5435 (PostgreSQL)
- 5672, 15672 (RabbitMQ)

### Services Not Starting

```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up
```

### Database Connection Errors

```bash
# Restart databases
docker-compose restart postgres-product postgres-order postgres-payment postgres-notification
```

### View Service Logs

```bash
docker-compose logs -f [service-name]
```

## Architecture Overview

```
Frontend (React) → Product Service (8081)
                 → Order Service (8082) → RabbitMQ → Notification Service (8084)
                 → Payment Service (8083)
```

## Design Patterns Demonstrated

1. **Factory Pattern**: Payment Service creates different payment processors
2. **Observer Pattern**: Notification Service observes order events via RabbitMQ
3. **Builder Pattern**: Order construction with complex parameters
4. **Strategy Pattern**: Potential for different shipping calculations

## Key Features

✅ 4 independent microservices  
✅ RabbitMQ message queue for async communication  
✅ PostgreSQL database per service  
✅ React frontend with cart and checkout  
✅ Docker containerization  
✅ CI/CD pipeline with GitHub Actions  
✅ Comprehensive Postman collection  

## Need Help?

See full documentation in [README.md](README.md)
