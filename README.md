# E-Commerce Microservices Platform

[![CI/CD Pipeline](https://github.com/yourusername/ecom-store-microservices/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/yourusername/ecom-store-microservices/actions/workflows/ci-cd.yml)

A comprehensive e-commerce platform built using **microservices architecture**, demonstrating industry best practices including design patterns, message queues, Docker containerization, and CI/CD pipelines.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Design Patterns](#design-patterns)
- [Tech Stack](#tech-stack)
- [Microservices](#microservices)
- [Message Queue Integration](#message-queue-integration)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Testing with Postman](#testing-with-postman)
- [CI/CD Pipeline](#cicd-pipeline)
- [API Documentation](#api-documentation)
- [Team Members](#team-members)

---

## 🏗️ Architecture Overview

This project implements a **microservices-based e-commerce platform** with the following components:

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                       │
│                      http://localhost:3000                    │
└───────────────────┬────────────┬────────────┬────────────────┘
                    │            │            │
        ┌───────────▼───┐  ┌─────▼────┐  ┌───▼─────────┐
        │  Product      │  │  Order   │  │  Payment    │
        │  Service      │  │  Service │  │  Service    │
        │  :8081        │  │  :8082   │  │  :8083      │
        └───────┬───────┘  └─────┬────┘  └───┬─────────┘
                │                 │            │
                │        ┌────────▼────────────▼─────┐
                │        │   RabbitMQ Message Queue  │
                │        │      :5672 / :15672       │
                │        └────────┬──────────────────┘
                │                 │
        ┌───────▼─────────────────▼──────────┐
        │      Notification Service          │
        │           :8084                    │
        └────────────────────────────────────┘
```

### Key Features

✅ **4 Independent Microservices** with clear responsibilities  
✅ **RabbitMQ** for asynchronous inter-service communication  
✅ **PostgreSQL** databases (one per service) for data isolation  
✅ **Docker** & **Docker Compose** for containerization  
✅ **React Frontend** with modern UI/UX  
✅ **RESTful APIs** with comprehensive Postman collection  
✅ **GitHub Actions** CI/CD pipeline  
✅ **Design Patterns**: Factory, Observer (via Message Queue), Strategy, Builder

---

## 🎯 Design Patterns

### 1. **Factory Pattern** (Payment Service)
**Location**: `payment-service/src/main/java/com/ecommerce/paymentservice/factory/`

The `PaymentProcessorFactory` creates appropriate payment processor instances based on payment method:

```java
PaymentProcessor processor = processorFactory.createProcessor("CREDIT_CARD");
String transactionId = processor.processPayment(amount, orderId, details);
```

**Implementations**:
- `CreditCardProcessor`
- `PayPalProcessor`
- `BankTransferProcessor`
- `CashOnDeliveryProcessor`

**Benefits**:
- Easy to add new payment methods without modifying existing code
- Encapsulates complex instantiation logic
- Follows Open/Closed Principle

### 2. **Observer Pattern** (via RabbitMQ)
**Location**: `notification-service/src/main/java/com/ecommerce/notificationservice/listener/`

The Notification Service observes order events via message queue:

```java
@RabbitListener(queues = "order.created.queue")
public void handleOrderCreated(OrderEvent event) {
    // Send notification when order is created
}
```

**Event Types**:
- `order.created` → Email: "Order Created"
- `order.confirmed` → Email: "Order Confirmed"
- `order.paid` → Email: "Payment Received"
- `order.shipped` → Email: "Order Shipped"

**Benefits**:
- Loose coupling between services
- Asynchronous processing improves scalability
- Easy to add new observers (SMS, Push Notifications, etc.)

### 3. **Builder Pattern** (Order Creation)
**Location**: `order-service` - Order entity construction

Complex order objects are built step-by-step:

```java
Order order = new Order();
order.setCustomerEmail(email);
order.setShippingAddress(address);
order.addItem(item1);
order.addItem(item2);
```

**Benefits**:
- Handles complex object creation with many optional parameters
- Ensures immutability and validation before object creation

### 4. **Strategy Pattern** (Shipping Calculation - Conceptual)
While not fully implemented in this milestone, the architecture supports different shipping strategies that can calculate costs dynamically based on order characteristics.

---

## 💻 Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.2.0**
- **Spring Data JPA** for database operations
- **Spring AMQP** for RabbitMQ integration
- **PostgreSQL 15** for data persistence
- **Maven** for dependency management

### Message Queue
- **RabbitMQ 3.12** with Management UI

### Frontend
- **React 18** with functional components and hooks
- **Axios** for HTTP requests
- **React Router** for navigation

### DevOps
- **Docker** & **Docker Compose** for containerization
- **GitHub Actions** for CI/CD
- **Nginx** as reverse proxy for frontend

---

## 🔧 Microservices

### 1. Product Service (Port 8081)
**Responsibility**: Product catalog management

**Features**:
- CRUD operations for products
- Category-based filtering
- Product search functionality
- Stock management

**Database**: `productdb`

**API Endpoints**:
```
GET    /api/products              - Get all products
GET    /api/products/{id}         - Get product by ID
GET    /api/products/category/{category} - Get by category
GET    /api/products/search?keyword={keyword} - Search products
POST   /api/products              - Create product
PUT    /api/products/{id}         - Update product
DELETE /api/products/{id}         - Delete product
PUT    /api/products/{id}/stock   - Update stock
```

### 2. Order Service (Port 8082)
**Responsibility**: Order management and orchestration

**Features**:
- Create and manage orders
- Track order status
- Publish order events to RabbitMQ
- Inter-service communication with Product & Payment services

**Database**: `orderdb`

**API Endpoints**:
```
GET  /api/orders                    - Get all orders
GET  /api/orders/{id}               - Get order by ID
GET  /api/orders/customer/{email}   - Get orders by customer
POST /api/orders                    - Create order
PUT  /api/orders/{id}/status        - Update order status
PUT  /api/orders/{id}/payment       - Update payment info
```

### 3. Payment Service (Port 8083)
**Responsibility**: Payment processing with Factory Pattern

**Features**:
- Process payments via multiple methods
- Factory Pattern for payment processor selection
- Transaction tracking

**Database**: `paymentdb`

**Payment Methods**:
- Credit Card
- PayPal
- Bank Transfer
- Cash on Delivery

**API Endpoints**:
```
GET  /api/payments                - Get all payments
GET  /api/payments/{id}           - Get payment by ID
GET  /api/payments/order/{orderId} - Get payment by order
POST /api/payments/process        - Process payment
```

### 4. Notification Service (Port 8084)
**Responsibility**: Send notifications via email/SMS (Observer Pattern)

**Features**:
- Listens to order events via RabbitMQ
- Sends email notifications automatically
- Tracks notification history

**Database**: `notificationdb`

**API Endpoints**:
```
GET /api/notifications                     - Get all notifications
GET /api/notifications/{id}                - Get notification by ID
GET /api/notifications/order/{orderId}     - Get by order
GET /api/notifications/customer/{email}    - Get by customer
```

---

## 📨 Message Queue Integration

### RabbitMQ Architecture

**Exchange**: `order.exchange` (Topic Exchange)

**Queues and Routing Keys**:
```
order.created.queue    ← order.created
order.confirmed.queue  ← order.confirmed
order.paid.queue       ← order.paid
order.shipped.queue    ← order.shipped
```

### Message Flow Example

1. **User creates an order** → Order Service
2. Order Service publishes `order.created` event to RabbitMQ
3. Notification Service consumes event and sends "Order Created" email
4. User proceeds to payment → Payment Service
5. Payment Service completes → Order Service updates status
6. Order Service publishes `order.paid` event
7. Notification Service sends "Payment Received" email

**Benefits**:
- ✅ **Scalability**: Services can be scaled independently
- ✅ **Fault Tolerance**: Messages are persisted if a service is down
- ✅ **Decoupling**: Services don't need direct knowledge of each other
- ✅ **Asynchronous Processing**: Non-blocking operations improve performance

### RabbitMQ Management UI

Access at: **http://localhost:15672**
- Username: `guest`
- Password: `guest`

---

## 📦 Prerequisites

Before running the application, ensure you have:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git**
- **Postman** (for API testing)

Optional for local development:
- **Java 17** or higher
- **Maven 3.8** or higher
- **Node.js 18** or higher

---

## 🚀 Quick Start

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/ecom-store-microservices.git
cd ecom-store-microservices
```

### Step 2: Start All Services with Docker Compose

```bash
docker-compose up --build
```

This command will:
1. Build Docker images for all 4 microservices + frontend
2. Start 4 PostgreSQL databases
3. Start RabbitMQ message queue
4. Start all microservices
5. Start the React frontend

**⏱️ Startup Time**: ~3-5 minutes (first time)

### Step 3: Verify Services are Running

```bash
docker-compose ps
```

You should see all services with status "Up":

```
NAME                      STATUS
postgres-product          Up (healthy)
postgres-order            Up (healthy)
postgres-payment          Up (healthy)
postgres-notification     Up (healthy)
rabbitmq                  Up (healthy)
product-service           Up
order-service             Up
payment-service           Up
notification-service      Up
frontend                  Up
```

### Step 4: Access the Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | React web application |
| **Product Service** | http://localhost:8081 | Product API |
| **Order Service** | http://localhost:8082 | Order API |
| **Payment Service** | http://localhost:8083 | Payment API |
| **Notification Service** | http://localhost:8084 | Notification API |
| **RabbitMQ Management** | http://localhost:15672 | Queue monitoring (guest/guest) |

### Step 5: Create Sample Data

Use Postman or curl to create some products:

```bash
curl -X POST http://localhost:8081/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Pro 15",
    "description": "High-performance laptop",
    "price": 1299.99,
    "category": "Electronics",
    "stockQuantity": 50,
    "available": true
  }'
```

### Step 6: Test the Complete Flow

1. Open frontend: http://localhost:3000
2. Browse products
3. Add items to cart
4. Proceed to checkout
5. Fill in customer details and select payment method
6. Complete the order
7. View your orders
8. Check RabbitMQ Management UI for message flow
9. Check Notification Service for sent emails

### Stop All Services

```bash
docker-compose down
```

Remove all data and volumes:

```bash
docker-compose down -v
```

---

## 🧪 Testing with Postman

### Import Postman Collection

1. Open Postman
2. Click **Import**
3. Select file: `postman/E-Commerce-Microservices-API.postman_collection.json`
4. Collection will appear in your workspace

### Collection Structure

The collection includes **30+ requests** organized into:

1. **Product Service** (8 requests)
   - CRUD operations
   - Category filtering
   - Search functionality
   - Stock management

2. **Order Service** (5 requests)
   - Create orders
   - View orders
   - Update order status
   - Customer order history

3. **Payment Service** (7 requests)
   - Process payments with all 4 payment methods
   - View payment history
   - Payment by order

4. **Notification Service** (4 requests)
   - View all notifications
   - Notifications by order
   - Notifications by customer

5. **Complete Order Flow** (5 requests)
   - End-to-end order creation and fulfillment
   - Demonstrates inter-service communication

### Environment Variables

Set these variables in Postman:

```
product_service_url = http://localhost:8081
order_service_url = http://localhost:8082
payment_service_url = http://localhost:8083
notification_service_url = http://localhost:8084
```

### Test Scenarios

#### Scenario 1: Happy Path Order Flow
1. **Create Product** → Save product ID
2. **Create Order** → Save order ID
3. **Process Payment** → Payment successful
4. **Update Order Status** → SHIPPED
5. **View Notifications** → 4 notifications sent

#### Scenario 2: Payment Methods Testing
Test all 4 payment processors (Factory Pattern):
1. Credit Card: `"paymentDetails": "1234567890123456"`
2. PayPal: `"paymentDetails": "user@paypal.com"`
3. Bank Transfer: `"paymentDetails": "12345678901234"`
4. Cash on Delivery: `"paymentDetails": ""`

#### Scenario 3: Edge Cases
- Try to create order with out-of-stock product
- Invalid payment details
- Update non-existent order

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**Location**: `.github/workflows/ci-cd.yml`

The CI/CD pipeline automatically:

1. **Build & Test** (on push/PR)
   - Compiles all 4 microservices
   - Runs unit tests
   - Uploads build artifacts

2. **Build Docker Images**
   - Creates Docker images for all services
   - Saves images as artifacts

3. **Deploy to Local Docker Environment**
   - Loads Docker images
   - Starts services with `docker-compose`
   - Performs health checks on all services
   - Runs integration tests

### Running CI/CD Locally

You can simulate the CI/CD pipeline locally:

#### Option 1: Using GitHub Actions Locally with `act`

```bash
# Install act (https://github.com/nektos/act)
# Windows (using Chocolatey)
choco install act-cli

# Run the workflow
act push
```

#### Option 2: Manual Execution

```bash
# Build all services
cd product-service && mvn clean package && cd ..
cd order-service && mvn clean package && cd ..
cd payment-service && mvn clean package && cd ..
cd notification-service && mvn clean package && cd ..

# Build Docker images
docker-compose build

# Deploy
docker-compose up -d

# Health checks
curl http://localhost:8081/api/products
curl http://localhost:8082/api/orders
curl http://localhost:8083/api/payments
curl http://localhost:8084/api/notifications
```

### CI/CD Pipeline Benefits

✅ **Automated Testing**: Every push triggers tests  
✅ **Continuous Integration**: Ensures code quality  
✅ **Automated Deployment**: Deploys to local Docker environment  
✅ **Health Monitoring**: Validates all services are healthy  
✅ **Fast Feedback**: Developers know immediately if builds fail

---

## 📚 API Documentation

### Product Service API

#### Create Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "Electronics",
  "stockQuantity": 100,
  "imageUrl": "https://example.com/image.jpg",
  "available": true
}
```

**Response**: `201 Created`
```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "Electronics",
  "stockQuantity": 100,
  "imageUrl": "https://example.com/image.jpg",
  "available": true
}
```

### Order Service API

#### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "customerEmail": "john@example.com",
  "customerName": "John Doe",
  "shippingAddress": "123 Main St, City, State 12345",
  "paymentMethod": "CREDIT_CARD",
  "items": [
    {
      "productId": 1,
      "productName": "Product Name",
      "quantity": 2,
      "price": 99.99
    }
  ]
}
```

**Response**: `201 Created`
```json
{
  "id": 1,
  "customerEmail": "john@example.com",
  "customerName": "John Doe",
  "status": "CONFIRMED",
  "totalAmount": 199.98,
  "items": [...],
  "shippingAddress": "123 Main St, City, State 12345",
  "paymentMethod": "CREDIT_CARD",
  "createdAt": "2024-10-18T10:30:00",
  "updatedAt": "2024-10-18T10:30:00"
}
```

### Payment Service API (Factory Pattern)

#### Process Payment
```http
POST /api/payments/process
Content-Type: application/json

{
  "orderId": 1,
  "amount": 199.98,
  "paymentMethod": "CREDIT_CARD",
  "paymentDetails": "1234567890123456"
}
```

**Response**: `201 Created`
```json
{
  "id": 1,
  "orderId": 1,
  "amount": 199.98,
  "method": "CREDIT_CARD",
  "status": "COMPLETED",
  "transactionId": "CC-A1B2C3D4",
  "cardLastFourDigits": "3456",
  "createdAt": "2024-10-18T10:31:00"
}
```

### Notification Service API (Observer Pattern)

#### Get Notifications by Order
```http
GET /api/notifications/order/1
```

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "orderId": 1,
    "customerEmail": "john@example.com",
    "type": "ORDER_CREATED",
    "subject": "Order Created - Order #1",
    "message": "Dear John Doe,\n\nYour order #1 has been created successfully...",
    "status": "SENT",
    "sentAt": "2024-10-18T10:30:05",
    "createdAt": "2024-10-18T10:30:00"
  },
  {
    "id": 2,
    "orderId": 1,
    "customerEmail": "john@example.com",
    "type": "ORDER_CONFIRMED",
    "subject": "Order Confirmed - Order #1",
    "message": "Dear John Doe,\n\nYour order #1 has been confirmed...",
    "status": "SENT",
    "sentAt": "2024-10-18T10:30:10",
    "createdAt": "2024-10-18T10:30:05"
  }
]
```

---

## 🛠️ Troubleshooting

### Services won't start

```bash
# Check if ports are already in use
netstat -an | findstr "8081 8082 8083 8084 3000 5432 5672"

# Remove all containers and volumes
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up
```

### Database connection errors

```bash
# Wait for databases to be healthy
docker-compose up -d postgres-product postgres-order postgres-payment postgres-notification
sleep 20
docker-compose up -d
```

### RabbitMQ not connecting

```bash
# Restart RabbitMQ
docker-compose restart rabbitmq

# Check RabbitMQ logs
docker-compose logs rabbitmq
```

### View service logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f product-service
docker-compose logs -f order-service
docker-compose logs -f payment-service
docker-compose logs -f notification-service
```

---

## 👥 Team Members

- **Marinescu Teodor**
- **Balutoiu Ana-Maria**
- **Radu George-Alexandru**

---

## 📄 License

This project is developed as part of an academic assignment for Software Design Techniques course.

---

## 🎓 Academic Context

### Milestone 4: Microservices Implementation ✅
- ✅ 4 independent microservices with clear responsibilities
- ✅ Inter-service communication via REST APIs and RabbitMQ
- ✅ Comprehensive Postman collection with 30+ requests
- ✅ Docker containerization with clear setup instructions
- ✅ Complete working application with frontend and backend

### Milestone 5: Advanced Features ✅
- ✅ RabbitMQ message queue for asynchronous communication
- ✅ Observer Pattern implementation via message queue
- ✅ GitHub Actions CI/CD pipeline (local execution)
- ✅ Comprehensive documentation with architecture diagrams
- ✅ Demonstrates scalability, fault tolerance, and decoupling benefits

---

## 🌟 Key Highlights

1. **Production-Ready Architecture**: Follows industry best practices
2. **Design Patterns**: Factory, Observer, Builder patterns implemented
3. **Message-Driven**: RabbitMQ enables scalable, decoupled services
4. **Full Stack**: React frontend + Spring Boot microservices
5. **DevOps**: Docker, Docker Compose, CI/CD pipeline
6. **Complete Testing**: Postman collection covers all endpoints
7. **Documentation**: Comprehensive README with clear instructions

---

**Built with ❤️ by Team [Your Team Name]**
