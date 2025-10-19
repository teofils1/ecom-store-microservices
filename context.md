# E-Commerce Store Platform

## Team Members
- Marinescu Teodor   
- Balutoiu Ana-Maria
- Radu George-Alexandru

## Project Description

### Overview
This project implements a comprehensive e-commerce store platform that enables customers to browse products, manage shopping carts, place orders, and process payments. The system will support multiple payment methods, real-time inventory management, order tracking, and a notification system to keep customers informed about their order status.

### Core Functionalities

#### 1. Product Catalog Management
- Browse products by categories (Electronics, Clothing, Books, Home & Garden, etc.)
- Search and filter products by price, rating, availability, and attributes
- View detailed product information including images, descriptions, specifications, and customer reviews
- Support for product variants (size, color, configuration options)

#### 2. Shopping Cart System
- Add, remove, and update product quantities in the cart
- Calculate total prices including taxes and shipping costs
- Apply discount codes and promotional offers
- Save cart state for registered users across sessions

#### 3. Order Processing
- Multi-step checkout process (cart review, shipping details, payment, confirmation)
- Support for guest checkout and registered user checkout
- Order validation and inventory verification
- Generate unique order IDs and tracking numbers

#### 4. Payment Processing
- Support multiple payment methods (Credit Card, PayPal, Bank Transfer, Cash on Delivery)
- Secure payment processing with transaction validation
- Handle payment failures and retry mechanisms
- Generate payment receipts and invoices

#### 5. User Management
- User registration and authentication
- Profile management (shipping addresses, payment methods, order history)
- Wishlist functionality
- Customer reviews and ratings

#### 6. Notification System
- Email notifications for order confirmation, shipping updates, and delivery
- Real-time notifications for promotional offers
- Order status change alerts

#### 7. Inventory Management
- Real-time stock tracking
- Automatic inventory updates on order placement
- Low stock alerts
- Product availability management

### Technical Requirements
- **Backend**: Java with Spring Boot framework
- **Architecture**: Microservices-based (to be implemented in later milestones)
- **Database**: Relational database for persistent storage
- **API**: RESTful web services
- **Message Queue**: Asynchronous communication for notifications and order processing
- **Containerization**: Docker for deployment

## Design Patterns

This project will utilize four key design patterns to ensure maintainable, scalable, and flexible code architecture. Each pattern addresses specific challenges in the e-commerce domain.

### 1. Factory Method Pattern (Creational)

**Purpose**: Create payment processor instances based on the selected payment method without coupling the code to specific payment processor classes.

**Problem Solved**: 
In an e-commerce system, customers can choose from multiple payment methods (Credit Card, PayPal, Bank Transfer, Cash on Delivery). Each payment method requires different processing logic, validation rules, and external API integrations. Directly instantiating payment processors throughout the codebase would create tight coupling and make it difficult to add new payment methods or modify existing ones.

**Implementation Context**:
- `PaymentProcessorFactory` will create appropriate payment processor instances
- Each payment method (CreditCardProcessor, PayPalProcessor, BankTransferProcessor, CashOnDeliveryProcessor) implements a common `PaymentProcessor` interface
- The checkout service requests a payment processor from the factory based on user selection

**Advantages over Alternatives**:
- **vs. Direct Instantiation**: Eliminates scattered `new` operators and conditional logic throughout the codebase. Changes to payment processor instantiation logic are centralized in one location.
- **vs. Simple If-Else Chains**: Factory pattern provides better separation of concerns and makes the code more maintainable. Adding a new payment method requires creating a new processor class and updating the factory, rather than modifying multiple if-else blocks across the application.
- **vs. Switch Statements**: More extensible and follows the Open/Closed Principle. New payment methods can be added without modifying existing code, reducing the risk of introducing bugs.

**Specific Benefits**:
- Easy integration of new payment gateways (e.g., cryptocurrency, digital wallets)
- Centralized configuration and initialization of payment processors
- Simplified unit testing through dependency injection
- Clear abstraction that hides complex instantiation logic

---

### 2. Strategy Pattern (Behavioral)

**Purpose**: Define a family of shipping cost calculation algorithms and make them interchangeable based on shipping method, destination, and package characteristics.

**Problem Solved**:
Shipping costs vary significantly based on multiple factors: shipping method (Standard, Express, Same-Day), destination (domestic, international), package weight, dimensions, and special handling requirements. Hardcoding these calculations creates inflexible, difficult-to-maintain code with complex conditional logic.

**Implementation Context**:
- `ShippingStrategy` interface defines a common `calculateShippingCost()` method
- Concrete strategies: `StandardShippingStrategy`, `ExpressShippingStrategy`, `SameDayShippingStrategy`, `InternationalShippingStrategy`
- `ShoppingCart` or `CheckoutService` uses a strategy instance to calculate shipping costs
- Strategies can be selected dynamically based on user choice and order characteristics

**Advantages over Alternatives**:
- **vs. Monolithic Calculation Method**: Avoids massive methods with nested conditionals. Each strategy encapsulates its own algorithm, making the code more readable and maintainable.
- **vs. Inheritance-Based Approach**: Composition over inheritance allows runtime strategy switching. A single cart can potentially evaluate multiple shipping options without creating multiple cart instances.
- **vs. External Configuration Only**: While configuration files can store shipping rates, Strategy pattern provides the flexibility to implement complex algorithms that consider multiple variables, apply business rules, and integrate with external shipping provider APIs.

**Specific Benefits**:
- Compare multiple shipping options in real-time during checkout
- Easy A/B testing of different shipping cost algorithms
- Support for promotional free shipping or discounted rates
- Integration with third-party shipping providers (FedEx, UPS, DHL) as separate strategies

---

### 3. Observer Pattern (Behavioral)

**Purpose**: Establish a one-to-many dependency between the order processing system and various notification/update mechanisms, ensuring automatic notifications when order status changes.

**Problem Solved**:
When an order status changes (placed, confirmed, shipped, delivered, cancelled), multiple systems need to be notified: email notification service, SMS service, inventory management system, analytics service, and customer dashboard. Tightly coupling the order management code to all these systems creates maintenance nightmares and makes it difficult to add or remove notification channels.

**Implementation Context**:
- `Order` class acts as the Subject that maintains a list of observers
- Observer interface defines an `update(Order order)` method
- Concrete observers: `EmailNotificationObserver`, `SMSNotificationObserver`, `InventoryObserver`, `AnalyticsObserver`, `CustomerDashboardObserver`
- When order status changes, the Order notifies all registered observers
- Observers can be dynamically added or removed based on user preferences or system configuration

**Advantages over Alternatives**:
- **vs. Direct Method Calls**: Eliminates tight coupling between order management and notification systems. The Order class doesn't need to know about specific notification implementations.
- **vs. Message Queue Only**: While message queues provide asynchronous communication (and will be used in conjunction with Observer pattern), the Observer pattern provides in-process event handling for immediate, synchronous updates when needed. It also provides better type safety and compile-time checking.
- **vs. Polling Mechanisms**: Push-based notifications are more efficient than having services repeatedly poll for order status changes. Immediate updates improve user experience.

**Specific Benefits**:
- Users can customize notification preferences (email only, email + SMS, etc.)
- New notification channels (push notifications, webhooks) can be added without modifying order management code
- System analytics and logging can observe all order events without impacting core business logic
- Supports event-driven architecture patterns for later microservices migration

---

### 4. Builder Pattern (Creational)

**Purpose**: Construct complex Order objects step-by-step, handling various optional parameters, validation rules, and configuration options without requiring telescoping constructors or complex initialization logic.

**Problem Solved**:
An Order object in an e-commerce system is complex, containing multiple components: order items (each with product, quantity, price, discounts), shipping address, billing address, payment information, applied discount codes, gift wrapping options, special instructions, and calculated totals. Creating orders with constructors would require either many constructor overloads (telescoping constructor anti-pattern) or allowing invalid intermediate states.

**Implementation Context**:
- `OrderBuilder` class provides a fluent interface for constructing Order objects
- Builder methods: `addItem()`, `setShippingAddress()`, `setBillingAddress()`, `setPaymentMethod()`, `applyDiscountCode()`, `setGiftWrap()`, `addSpecialInstructions()`
- `build()` method performs validation and returns an immutable Order object
- Director class (optional) can encapsulate common order building sequences (e.g., guest checkout order, standard user order)

**Advantages over Alternatives**:
- **vs. Telescoping Constructors**: Avoids constructors with 10+ parameters that are difficult to read and error-prone. Builder provides named methods that make the code self-documenting.
- **vs. JavaBeans Pattern (Setters)**: Prevents invalid intermediate states where an Order exists but is missing required fields. Builder ensures that only valid, complete Order objects are created. Also enables immutability of the final Order object.
- **vs. Factory Pattern Alone**: While Factory creates objects, Builder is better suited for objects that require complex, step-by-step construction with many optional parameters. Builder provides more control over the construction process.
- **vs. Multiple Constructors**: Adding new optional fields doesn't require creating new constructor overloads. The Builder can evolve independently without breaking existing code.

**Specific Benefits**:
- Fluent, readable API for order creation: `Order order = new OrderBuilder().addItem(item1).addItem(item2).setShippingAddress(address).build();`
- Centralized validation logic in the `build()` method
- Easy to create Order objects in different configurations for testing
- Supports method chaining for concise, expressive code
- Can create immutable Order objects that cannot be modified after creation, improving thread safety

---

## Pattern Integration Overview

These four patterns work together to create a cohesive, maintainable architecture:

1. **Builder Pattern** constructs complex Order objects during the checkout process
2. **Strategy Pattern** calculates shipping costs for the order being built
3. **Factory Pattern** creates the appropriate payment processor to handle the order's payment
4. **Observer Pattern** notifies all interested parties when the order status changes

This integration demonstrates how design patterns complement each other to solve real-world software engineering challenges in a complex domain like e-commerce.

---

## Milestone 2: Design and Implementation

### UML Class Diagram

The comprehensive UML class diagram below illustrates the complete system architecture, integrating all four design patterns into a cohesive design. The diagram shows how the patterns work together within the e-commerce platform.

![UML Class Diagram](images/class-diagram.png)

#### Design Pattern Annotations in Class Diagram

The class diagram includes the following design pattern implementations:

1. **Factory Method Pattern** (highlighted in diagram):
   - `PaymentProcessorFactory` creates instances of `PaymentProcessor` implementations
   - Concrete classes: `CreditCardProcessor`, `PayPalProcessor`, `BankTransferProcessor`, `CashOnDeliveryProcessor`
   - All processors implement the `PaymentProcessor` interface

2. **Strategy Pattern** (highlighted in diagram):
   - `ShippingStrategy` interface defines the algorithm contract
   - Concrete strategies: `StandardShippingStrategy`, `ExpressShippingStrategy`, `SameDayShippingStrategy`, `InternationalShippingStrategy`
   - `ShoppingCart` and `CheckoutService` use composition to delegate shipping calculations

3. **Observer Pattern** (highlighted in diagram):
   - `Order` class acts as the Subject
   - `OrderObserver` interface defines the observer contract
   - Concrete observers: `EmailNotificationObserver`, `SMSNotificationObserver`, `InventoryObserver`, `AnalyticsObserver`
   - Order maintains a list of observers and notifies them on state changes

4. **Builder Pattern** (highlighted in diagram):
   - `OrderBuilder` provides fluent interface for constructing `Order` objects
   - Separates the complex construction logic from the Order representation
   - Validates and builds immutable Order instances

### UML Sequence Diagrams

#### Sequence Diagram 1: Complete Purchase Flow

This sequence diagram illustrates the main use case of a customer completing a purchase, showing the interaction between all four design patterns.

![Complete Purchase Sequence Diagram](images/sequence-diagram-purchase.png)

**Flow Description**:
1. Customer adds items to shopping cart
2. Customer proceeds to checkout
3. `CheckoutService` uses `OrderBuilder` to construct the order step-by-step
4. `ShippingStrategy` is applied to calculate shipping costs
5. `PaymentProcessorFactory` creates the appropriate payment processor based on selected method
6. Payment is processed and validated
7. Order is finalized and saved
8. `Observer Pattern` triggers: Order notifies all registered observers (Email, SMS, Inventory, Analytics)
9. Confirmation is sent to the customer

**Key Interactions**:
- Builder pattern constructs the complex Order object
- Strategy pattern calculates shipping dynamically
- Factory pattern creates the correct payment processor
- Observer pattern broadcasts order completion to multiple systems

---

#### Sequence Diagram 2: Order Status Update and Notification Flow

This sequence diagram demonstrates how the system handles order status changes and propagates notifications through the Observer pattern.

![Order Status Update Sequence Diagram](images/sequence-diagram-status-update.png)

**Flow Description**:
1. Warehouse/Shipping system updates order status (e.g., "Shipped")
2. `Order` object's `setStatus()` method is called
3. Order state is updated internally
4. `notifyObservers()` is automatically triggered
5. Each registered observer receives the update:
   - `EmailNotificationObserver` sends shipping confirmation email
   - `SMSNotificationObserver` sends SMS notification (if enabled)
   - `InventoryObserver` updates inventory records
   - `AnalyticsObserver` logs the event for reporting
6. Customer receives real-time notification
7. System dashboard is updated with new status

**Key Interactions**:
- Demonstrates loose coupling between Order and notification systems
- Shows how multiple systems react to a single event
- Illustrates the extensibility of adding new observers

---

### Implementation Overview

The proof-of-concept implementation focuses on demonstrating the interaction of all four design patterns in core e-commerce workflows. The implementation is structured as follows:

#### Package Structure
```
com.example.e_com_store/
├── model/
│   ├── Product.java
│   ├── Order.java
│   ├── OrderItem.java
│   ├── ShoppingCart.java
│   ├── Customer.java
│   └── Address.java
├── builder/
│   ├── OrderBuilder.java
│   └── OrderDirector.java (optional)
├── factory/
│   ├── PaymentProcessorFactory.java
│   └── PaymentProcessor.java (interface)
├── payment/
│   ├── CreditCardProcessor.java
│   ├── PayPalProcessor.java
│   ├── BankTransferProcessor.java
│   └── CashOnDeliveryProcessor.java
├── strategy/
│   ├── ShippingStrategy.java (interface)
│   ├── StandardShippingStrategy.java
│   ├── ExpressShippingStrategy.java
│   ├── SameDayShippingStrategy.java
│   └── InternationalShippingStrategy.java
├── observer/
│   ├── OrderObserver.java (interface)
│   ├── EmailNotificationObserver.java
│   ├── SMSNotificationObserver.java
│   ├── InventoryObserver.java
│   └── AnalyticsObserver.java
├── service/
│   ├── CheckoutService.java
│   ├── OrderService.java
│   └── ProductService.java
└── EComStoreApplication.java (main demo class)
```

#### Key Implementation Features

1. **Builder Pattern Implementation**:
   ```java
   Order order = new OrderBuilder()
       .setCustomer(customer)
       .addItem(product1, 2)
       .addItem(product2, 1)
       .setShippingAddress(shippingAddress)
       .setBillingAddress(billingAddress)
       .setShippingStrategy(new ExpressShippingStrategy())
       .applyDiscountCode("SAVE10")
       .build();
   ```

2. **Factory Pattern Implementation**:
   ```java
   PaymentProcessor processor = PaymentProcessorFactory
       .createProcessor("CREDIT_CARD");
   boolean success = processor.processPayment(order.getTotalAmount());
   ```

3. **Strategy Pattern Implementation**:
   ```java
   ShippingStrategy shipping = new ExpressShippingStrategy();
   double shippingCost = shipping.calculateShippingCost(order);
   order.setShippingCost(shippingCost);
   ```

4. **Observer Pattern Implementation**:
   ```java
   // Register observers
   order.registerObserver(new EmailNotificationObserver());
   order.registerObserver(new SMSNotificationObserver());
   order.registerObserver(new InventoryObserver());
   
   // Status change triggers notifications
   order.setStatus(OrderStatus.SHIPPED); // All observers notified
   ```

#### Demo Scenarios

The implementation includes two main demo scenarios:

**Scenario 1: Complete Purchase Workflow**
- Customer browses products
- Adds items to cart
- Proceeds to checkout
- Selects shipping method (Strategy Pattern)
- Order is built using OrderBuilder (Builder Pattern)
- Payment method is selected and processor created (Factory Pattern)
- Payment is processed
- Order is confirmed and observers are notified (Observer Pattern)

**Scenario 2: Order Lifecycle Management**
- Existing order is retrieved
- Warehouse updates status to "Shipped"
- Observer pattern triggers all notifications
- Customer receives email and SMS
- Inventory system updates stock
- Analytics system logs the event

#### Pattern Interaction Demonstration

The implementation showcases how patterns work together:

1. **Builder + Strategy**: OrderBuilder accepts a ShippingStrategy during construction
2. **Builder + Observer**: Built Order comes with pre-registered observers
3. **Factory + Observer**: Payment success/failure triggers observer notifications
4. **Strategy + Factory**: Different shipping strategies might influence payment processing (e.g., COD availability)

#### Testing the Implementation

The `EComStoreApplication.java` main class demonstrates:
- Creating products and shopping cart
- Building orders with different configurations
- Processing payments with different methods
- Calculating shipping with different strategies
- Managing order status changes and notifications
- Edge cases and validation

### Implementation Limitations (Proof-of-Concept Scope)

This implementation focuses on design pattern demonstration rather than production completeness:

- **No Database Integration**: Uses in-memory data structures
- **Simplified Validation**: Basic validation rules only
- **Mock External Services**: Payment gateways and notification services are simulated
- **Limited Error Handling**: Focus on happy path with basic exception handling
- **No User Interface**: Console-based demonstration
- **Simplified Business Logic**: Core calculations only, no complex pricing rules
- **No Security**: Authentication and authorization not implemented
- **Limited Test Coverage**: Focus on pattern interaction tests

### How to Run the Demo

```bash
# Navigate to project directory
cd d:\Labs\SDT\e-com-store

# Clean and compile
mvnw clean compile

# Run the main demo application
mvnw spring-boot:run

# Or run specific test scenarios
mvnw test
```

### Expected Output

The demo application will output:
1. Product catalog display
2. Shopping cart operations
3. Order building process with Builder pattern
4. Shipping cost calculations with different strategies
5. Payment processing with different methods
6. Observer notifications when order status changes
7. Summary of pattern interactions

---

## Milestone 3: Software Architecture Analysis and Selection

### Overview

This milestone explores three different architectural approaches for the e-commerce platform, analyzing their trade-offs, creating deployment diagrams, and selecting the most suitable architecture for our system's requirements.

### Architectures Evaluated

1. **Monolithic Architecture** (Current Implementation)
2. **Microservices Architecture** (Distributed, Service-Oriented)
3. **Event-Driven Architecture** (Distributed, Message-Based)

---

### 1. Monolithic Architecture

#### Description

A monolithic architecture is a traditional unified model where all components of the application are interconnected and interdependent. The entire application is built, deployed, and scaled as a single unit.

![Monolithic Architecture Diagram](images/architecture-monolithic.png)

#### Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    E-Commerce Application                    │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web Layer  │  │  API Layer   │  │  Controllers │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│         └──────────────────┴──────────────────┘              │
│                            │                                  │
│         ┌──────────────────┴──────────────────┐              │
│         │                                      │              │
│  ┌──────▼───────┐  ┌──────────────┐  ┌───────▼──────┐      │
│  │   Product    │  │   Order      │  │   Payment    │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐      │
│  │   Cart       │  │  Checkout    │  │ Notification │      │
│  │   Service    │  │  Service     │  │   Service    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│         └──────────────────┴──────────────────┘              │
│                            │                                  │
│                   ┌────────▼─────────┐                       │
│                   │  Data Access     │                       │
│                   │  Layer (JPA)     │                       │
│                   └────────┬─────────┘                       │
└────────────────────────────┼──────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   PostgreSQL     │
                    │    Database      │
                    └──────────────────┘
```

#### Deployment Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Production Server                     │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │           Application Container                 │    │
│  │                                                 │    │
│  │  ┌──────────────────────────────────────┐     │    │
│  │  │   Spring Boot Application (JAR)      │     │    │
│  │  │   Port: 8080                         │     │    │
│  │  └──────────────────────────────────────┘     │    │
│  │                                                 │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
                         │
                         │ JDBC Connection
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  Database Server                         │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │        PostgreSQL Container                     │    │
│  │        Port: 5432                               │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Advantages

1. **Simplicity**: 
   - Single codebase, easy to understand and navigate
   - Straightforward development workflow
   - Simple debugging and testing
   - Our current implementation demonstrates this simplicity

2. **Easy Deployment**: 
   - Single deployment unit (one JAR/WAR file)
   - No complex orchestration needed
   - Simple rollback procedures
   - Current deployment: `mvnw spring-boot:run`

3. **Performance**: 
   - No network latency between components
   - Direct method calls instead of network calls
   - Efficient data access with single database connection
   - Shared memory space for all components

4. **Development Speed**: 
   - Faster initial development
   - Easy to implement cross-cutting concerns
   - IDE support is excellent
   - Simple build and test pipelines

5. **Transaction Management**: 
   - ACID transactions across all operations
   - Single database transaction manager
   - No distributed transaction complexity
   - Data consistency guaranteed

6. **Cost-Effective**: 
   - Single server for small to medium scale
   - Lower infrastructure costs
   - Minimal DevOps complexity
   - Fewer monitoring tools needed

#### Disadvantages

1. **Scalability Limitations**: 
   - Must scale entire application, not individual components
   - Cannot scale product catalog independently from checkout
   - Vertical scaling only (larger servers)
   - Resource waste on underutilized components

2. **Technology Lock-in**: 
   - Single technology stack for entire application
   - All components must use Java/Spring Boot
   - Difficult to adopt new technologies incrementally
   - Long-term technical debt accumulation

3. **Deployment Risks**: 
   - Any change requires full application redeployment
   - Small bug fix affects entire system
   - Downtime during deployments
   - Higher risk of deployment failures

4. **Team Coordination**: 
   - Single codebase creates merge conflicts
   - Difficult for large teams to work independently
   - Code ownership boundaries are unclear
   - Longer build and test times as code grows

5. **Fault Isolation**: 
   - Bug in one module can crash entire application
   - Memory leak in payment service affects product catalog
   - No failure isolation between components
   - Single point of failure

6. **Limited Flexibility**: 
   - Difficult to use different databases for different needs
   - Cannot optimize individual components separately
   - Hard to implement different caching strategies per module
   - Tight coupling between components

#### Best Use Cases

- **Small to Medium Applications**: Under 50,000 users
- **Rapid Prototyping**: MVP development, startups
- **Simple Domain Logic**: Limited business complexity
- **Small Development Teams**: 5-10 developers
- **Budget Constraints**: Limited infrastructure budget
- **Our Current Application**: Perfect for Milestone 1-2 demonstration

---

### 2. Microservices Architecture

#### Description

Microservices architecture structures the application as a collection of loosely coupled, independently deployable services. Each service is responsible for a specific business capability and can be developed, deployed, and scaled independently.

![Microservices Architecture Diagram](images/architecture-microservices.png)

#### Component Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      API Gateway / BFF                        │
│                    (Load Balancer, Routing)                   │
└────────┬─────────────┬──────────────┬─────────────┬──────────┘
         │             │              │             │
    ┌────▼────┐   ┌───▼─────┐   ┌───▼────┐   ┌────▼─────┐
    │ Product │   │  Cart   │   │ Order  │   │ Payment  │
    │ Service │   │ Service │   │Service │   │ Service  │
    └────┬────┘   └────┬────┘   └───┬────┘   └────┬─────┘
         │             │             │             │
    ┌────▼────┐   ┌───▼─────┐   ┌───▼────┐   ┌────▼─────┐
    │Product  │   │  Cart   │   │ Order  │   │ Payment  │
    │   DB    │   │   DB    │   │   DB   │   │    DB    │
    └─────────┘   └─────────┘   └────────┘   └──────────┘

    ┌─────────┐   ┌──────────┐   ┌─────────────┐
    │Customer │   │Inventory │   │Notification │
    │Service  │   │Service   │   │  Service    │
    └────┬────┘   └────┬─────┘   └──────┬──────┘
         │             │                 │
    ┌────▼────┐   ┌───▼─────┐      ┌────▼──────┐
    │Customer │   │Inventory│      │Message    │
    │   DB    │   │   DB    │      │Queue      │
    └─────────┘   └─────────┘      └───────────┘

              ┌──────────────────────┐
              │  Service Discovery   │
              │    (Eureka/Consul)   │
              └──────────────────────┘

              ┌──────────────────────┐
              │  Config Server       │
              │  (Centralized)       │
              └──────────────────────┘
```

#### Deployment Diagram

```
┌────────────────────── Kubernetes Cluster ──────────────────────┐
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Product    │  │    Cart      │  │    Order     │        │
│  │   Service    │  │   Service    │  │   Service    │        │
│  │  (3 Pods)    │  │  (2 Pods)    │  │  (3 Pods)    │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                  │                  │                 │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐        │
│  │   Product    │  │    Cart      │  │    Order     │        │
│  │ PostgreSQL   │  │  PostgreSQL  │  │  PostgreSQL  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Payment    │  │   Customer   │  │  Inventory   │        │
│  │   Service    │  │   Service    │  │   Service    │        │
│  │  (2 Pods)    │  │  (2 Pods)    │  │  (2 Pods)    │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                  │                  │                 │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐        │
│  │   Payment    │  │   Customer   │  │  Inventory   │        │
│  │ PostgreSQL   │  │  PostgreSQL  │  │  PostgreSQL  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐                           │
│  │Notification  │  │  API Gateway │                           │
│  │  Service     │  │   (Ingress)  │                           │
│  │  (2 Pods)    │  │  (2 Pods)    │                           │
│  └──────┬───────┘  └──────────────┘                           │
│         │                                                       │
│  ┌──────▼───────┐                                              │
│  │   RabbitMQ   │                                              │
│  │ Message Queue│                                              │
│  └──────────────┘                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Service Breakdown for E-Commerce

1. **Product Service**
   - Product catalog management
   - Product search and filtering
   - Product details and reviews
   - Database: Product catalog data

2. **Cart Service**
   - Shopping cart operations
   - Cart item management
   - Cart persistence across sessions
   - Database: Cart data

3. **Order Service**
   - Order creation and management
   - Order status tracking
   - Order history
   - Database: Order data

4. **Payment Service**
   - Payment processing (Factory Pattern)
   - Payment validation
   - Transaction management
   - Database: Payment transactions

5. **Customer Service**
   - User authentication and authorization
   - Profile management
   - Address management
   - Database: Customer data

6. **Inventory Service**
   - Stock management
   - Inventory updates (Observer Pattern)
   - Stock availability checks
   - Database: Inventory data

7. **Notification Service**
   - Email notifications (Observer Pattern)
   - SMS notifications
   - Push notifications
   - Message Queue: RabbitMQ/Kafka

8. **Shipping Service**
   - Shipping cost calculation (Strategy Pattern)
   - Carrier integration
   - Tracking management
   - Database: Shipping data

#### Advantages

1. **Independent Scalability**:
   - Scale product service during high traffic
   - Scale payment service during checkout peaks
   - Scale notification service independently
   - Optimize resources per service needs

2. **Technology Flexibility**:
   - Product Service: Java/Spring Boot
   - Notification Service: Node.js for real-time
   - Analytics Service: Python for ML
   - Choose best tool for each job

3. **Fault Isolation**:
   - Payment service failure doesn't affect product browsing
   - Notification service down doesn't block orders
   - Graceful degradation possible
   - Circuit breakers prevent cascade failures

4. **Team Autonomy**:
   - Independent teams per service
   - Separate deployment schedules
   - Clear ownership boundaries
   - Faster parallel development

5. **Continuous Deployment**:
   - Deploy services independently
   - Smaller, lower-risk deployments
   - Faster time to market
   - A/B testing per service

6. **Easier Maintenance**:
   - Smaller codebases per service
   - Easier to understand and modify
   - Focused testing scope
   - Better code organization

#### Disadvantages

1. **Increased Complexity**:
   - Distributed system challenges
   - Service orchestration needed
   - Complex monitoring requirements
   - More moving parts to manage

2. **Network Latency**:
   - Service-to-service communication overhead
   - Multiple network hops per request
   - Potential performance degradation
   - Increased response times

3. **Data Consistency**:
   - No ACID transactions across services
   - Eventual consistency challenges
   - Distributed transaction complexity (Saga pattern)
   - Data duplication across services

4. **Operational Overhead**:
   - More services to deploy and monitor
   - Container orchestration (Kubernetes)
   - Service discovery and registration
   - Centralized logging and monitoring

5. **Development Complexity**:
   - Debugging across services is harder
   - Testing integration is complex
   - API versioning challenges
   - Contract management between services

6. **Infrastructure Costs**:
   - More servers/containers needed
   - Load balancers, API gateways
   - Message queues, service mesh
   - Monitoring and logging infrastructure

#### Best Use Cases

- **Large-Scale Applications**: 100,000+ users
- **Complex Business Domains**: Multiple bounded contexts
- **Large Development Teams**: 20+ developers
- **Rapid Evolution**: Frequent updates to specific features
- **High Availability Requirements**: 99.99% uptime
- **Our Future Growth**: When scaling beyond monolithic limits

---

### 3. Event-Driven Architecture

#### Description

Event-Driven Architecture (EDA) is a distributed architecture where services communicate through asynchronous events via a message broker. Components produce and consume events without direct knowledge of each other, promoting loose coupling.

![Event-Driven Architecture Diagram](images/architecture-event-driven.png)

#### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Event Bus / Message Broker                │
│                     (Apache Kafka / RabbitMQ)                    │
│                                                                   │
│  Topics/Queues:                                                  │
│  • order.created        • payment.processed                      │
│  • order.confirmed      • inventory.updated                      │
│  • order.shipped        • notification.requested                 │
│  • product.updated      • cart.modified                          │
└────┬─────────┬──────────┬──────────┬──────────┬────────┬────────┘
     │         │          │          │          │        │
     │         │          │          │          │        │
┌────▼────┐┌──▼─────┐┌───▼────┐┌────▼────┐┌───▼───┐┌──▼────────┐
│ Product ││  Cart  ││ Order  ││ Payment ││Invent-││Notification│
│ Service ││Service ││Service ││ Service ││ory    ││  Service   │
│         ││        ││        ││         ││Service││            │
│Publishes││Pub/Sub ││Pub/Sub ││Publishes││Sub    ││ Subscribes │
│Events   ││        ││        ││Events   ││Events ││  Events    │
└────┬────┘└───┬────┘└───┬────┘└────┬────┘└───┬───┘└──┬─────────┘
     │         │         │          │         │       │
┌────▼────┐┌──▼─────┐┌──▼─────┐┌───▼────┐┌──▼───┐┌──▼─────┐
│Product  ││  Cart  ││ Order  ││Payment ││Inven-││Notif   │
│   DB    ││   DB   ││   DB   ││   DB   ││tory  ││Store   │
│         ││        ││        ││        ││DB    ││        │
└─────────┘└────────┘└────────┘└────────┘└──────┘└────────┘

┌─────────────────────────────────────────────────────────────────┐
│              Event Store (Event Sourcing - Optional)             │
│              Stores all events for replay and audit              │
└─────────────────────────────────────────────────────────────────┘
```

#### Deployment Diagram

```
┌────────────────── Cloud Infrastructure ────────────────────┐
│                                                             │
│  ┌─────────────────────────────────────────────────┐      │
│  │       Apache Kafka Cluster (3 Brokers)          │      │
│  │       High Availability, Partitioned Topics      │      │
│  └──────────┬──────────────────────────────────────┘      │
│             │                                               │
│   ┌─────────┴──────────┬─────────────┬──────────┐        │
│   │                    │             │          │        │
│ ┌─▼──────────┐  ┌──────▼───┐  ┌─────▼────┐ ┌──▼─────┐  │
│ │  Product   │  │   Cart   │  │  Order   │ │Payment │  │
│ │  Service   │  │  Service │  │ Service  │ │Service │  │
│ │ (Pub/Sub)  │  │ (Pub/Sub)│  │(Pub/Sub) │ │(Pub)   │  │
│ │  2 Pods    │  │  2 Pods  │  │  3 Pods  │ │ 2 Pods │  │
│ └─────┬──────┘  └────┬─────┘  └────┬─────┘ └───┬────┘  │
│       │              │              │           │        │
│ ┌─────▼──────┐  ┌───▼──────┐  ┌───▼──────┐ ┌──▼────┐  │
│ │  Product   │  │   Cart   │  │  Order   │ │Payment│  │
│ │  Database  │  │ Database │  │ Database │ │  DB   │  │
│ └────────────┘  └──────────┘  └──────────┘ └───────┘  │
│                                                          │
│ ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│ │  Inventory   │  │ Notification │  │   Customer    │ │
│ │   Service    │  │   Service    │  │   Service     │ │
│ │ (Subscribe)  │  │ (Subscribe)  │  │  (Pub/Sub)    │ │
│ │   2 Pods     │  │   2 Pods     │  │   2 Pods      │ │
│ └──────┬───────┘  └──────┬───────┘  └───────┬───────┘ │
│        │                 │                   │         │
│ ┌──────▼───────┐  ┌──────▼───────┐  ┌───────▼───────┐ │
│ │  Inventory   │  │  Email/SMS   │  │   Customer    │ │
│ │   Database   │  │   Queue      │  │   Database    │ │
│ └──────────────┘  └──────────────┘  └───────────────┘ │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │        Event Store (Audit & Replay)              │   │
│ │        Stores all domain events                  │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### Event Flow Example: Order Processing

```
1. User clicks "Place Order"
   │
   └──► Cart Service publishes: "order.created"
        Event: { orderId, items, customerId, total }

2. Order Service subscribes to "order.created"
   │
   ├──► Creates order record
   ├──► Publishes: "order.confirmed"
   └──► Event: { orderId, status: "CONFIRMED" }

3. Multiple Services Subscribe to "order.confirmed":
   │
   ├──► Payment Service
   │    ├──► Processes payment
   │    └──► Publishes: "payment.processed"
   │
   ├──► Inventory Service (Observer Pattern)
   │    ├──► Reserves inventory
   │    └──► Publishes: "inventory.reserved"
   │
   └──► Notification Service (Observer Pattern)
        ├──► Sends confirmation email
        └──► Publishes: "notification.sent"

4. Order Service subscribes to "payment.processed"
   │
   ├──► Updates order status to "PAID"
   └──► Publishes: "order.paid"

5. Shipping Service subscribes to "order.paid"
   │
   ├──► Creates shipping label
   ├──► Updates tracking
   └──► Publishes: "order.shipped"

6. Notification Service subscribes to "order.shipped"
   │
   └──► Sends shipping notification to customer
```

#### Advantages

1. **Loose Coupling**:
   - Services don't need to know about each other
   - Add new consumers without modifying producers
   - Perfect for Observer Pattern implementation
   - Easier to evolve system independently

2. **Scalability**:
   - Asynchronous processing handles load spikes
   - Message queue acts as buffer
   - Scale consumers independently
   - Natural load leveling

3. **Resilience**:
   - Services can be down temporarily
   - Messages are persisted in queue
   - Automatic retry mechanisms
   - No synchronous failure cascade

4. **Flexibility**:
   - Easy to add new event consumers
   - Event replay for debugging/recovery
   - Support for multiple processing patterns
   - Temporal decoupling of services

5. **Audit Trail**:
   - Complete event history
   - Event sourcing for full auditability
   - Easy to track system behavior
   - Compliance and debugging benefits

6. **Real-Time Processing**:
   - Near real-time updates
   - Stream processing capabilities
   - Complex event processing (CEP)
   - Analytics and monitoring

#### Disadvantages

1. **Complexity**:
   - Event schema management
   - Event versioning challenges
   - Debugging is harder (distributed tracing needed)
   - Steep learning curve

2. **Eventual Consistency**:
   - No immediate consistency guarantees
   - Must handle out-of-order events
   - Duplicate event handling needed
   - Complex business logic to manage state

3. **Message Broker Dependency**:
   - Single point of failure (if not clustered)
   - Additional infrastructure to manage
   - Performance bottleneck potential
   - Operational complexity

4. **Testing Challenges**:
   - Integration testing is complex
   - Must test async workflows
   - Event ordering issues
   - Race conditions possible

5. **Operational Overhead**:
   - Monitor message queues
   - Dead letter queue management
   - Event replay mechanisms
   - Message retention policies

6. **Over-Engineering Risk**:
   - Not suitable for simple applications
   - Unnecessary complexity for small systems
   - Higher development time
   - More infrastructure costs

#### Best Use Cases

- **Complex Event Workflows**: Order processing, inventory updates
- **Real-Time Systems**: Live notifications, streaming data
- **High Decoupling Needs**: Independent service evolution
- **Audit Requirements**: Financial systems, compliance
- **Scalability Priority**: Variable load patterns
- **Our Observer Pattern**: Natural fit for order notifications

---

### Architecture Comparison Matrix

| Criteria | Monolithic | Microservices | Event-Driven |
|----------|-----------|---------------|--------------|
| **Complexity** | Low ⭐ | High ⭐⭐⭐ | Very High ⭐⭐⭐⭐ |
| **Scalability** | Limited ⭐⭐ | Excellent ⭐⭐⭐⭐ | Excellent ⭐⭐⭐⭐⭐ |
| **Development Speed** | Fast ⭐⭐⭐⭐ | Moderate ⭐⭐ | Slow ⭐ |
| **Team Size** | Small (5-10) | Large (20+) | Large (20+) |
| **Deployment** | Simple ⭐⭐⭐⭐ | Complex ⭐⭐ | Complex ⭐⭐ |
| **Testing** | Easy ⭐⭐⭐⭐ | Moderate ⭐⭐ | Hard ⭐ |
| **Monitoring** | Simple ⭐⭐⭐⭐ | Complex ⭐⭐ | Complex ⭐⭐ |
| **Cost** | Low ⭐⭐⭐⭐ | High ⭐⭐ | High ⭐⭐ |
| **Fault Isolation** | Poor ⭐ | Good ⭐⭐⭐ | Excellent ⭐⭐⭐⭐ |
| **Data Consistency** | Strong ⭐⭐⭐⭐ | Eventual ⭐⭐ | Eventual ⭐⭐ |
| **Technology Flexibility** | Low ⭐ | High ⭐⭐⭐⭐ | High ⭐⭐⭐⭐ |
| **Performance** | Excellent ⭐⭐⭐⭐ | Good ⭐⭐⭐ | Good ⭐⭐⭐ |

---

### Architecture Selection for E-Commerce Platform

#### Recommendation: **Hybrid Approach - Start Monolithic, Evolve to Microservices**

#### Phase 1: Monolithic (Current - Milestones 1-2) ✅

**Why Start Monolithic:**
- ✅ Current implementation already working
- ✅ Fast development and iteration
- ✅ Perfect for MVP and demonstration
- ✅ All design patterns work well in monolith
- ✅ Low operational overhead
- ✅ Easy to test and debug
- ✅ Cost-effective for initial launch

**Metrics to Track:**
- User growth rate
- Response times
- Database query performance
- Server resource utilization
- Team size growth

#### Phase 2: Modular Monolith (Next 6 months)

**Preparation for Microservices:**
- Refactor into clear module boundaries
- Implement domain-driven design
- Separate database schemas logically
- Use internal event bus (Spring Events)
- Implement API contracts between modules
- Add comprehensive monitoring

**Benefits:**
- Maintain monolithic simplicity
- Clear service boundaries for future split
- Easier transition to microservices
- Team can learn microservices concepts

#### Phase 3: Selective Microservices (12+ months)

**Extract Services Based on Need:**

1. **First Service to Extract: Notification Service**
   - Why: Already loosely coupled (Observer Pattern)
   - Benefits: Independent scaling for email/SMS
   - Low risk: Non-critical for core business
   - Event-driven by nature

2. **Second Service: Payment Service**
   - Why: Security isolation needed
   - Benefits: PCI compliance separation
   - Can scale independently during checkouts
   - Factory Pattern already provides abstraction

3. **Third Service: Product Service**
   - Why: High read traffic
   - Benefits: Cache-heavy, can scale separately
   - Independent search capabilities
   - Can use different database (e.g., Elasticsearch)

**Keep as Monolith:**
- Order Service (core business logic)
- Cart Service (session management)
- Checkout Service (transaction orchestration)

#### Phase 4: Event-Driven Enhancements

**Add Event Bus for Cross-Service Communication:**
- Implement Kafka/RabbitMQ
- Observer Pattern becomes event-driven
- Async processing for notifications
- Event sourcing for order history
- Real-time analytics capabilities

┌────────┐ ┌────────┐ ┌────────┐
│Product │ │Payment │ │ Order  │
│Service │ │Service │ │Service │
└───┬────┘ └───┬────┘ └───┬────┘
    └──────────┴──────────┘
           │
      ┌────▼─────┐
      │  Kafka   │
      │  Event   │
      │   Bus    │
      └────┬─────┘
           │
    ┌──────┴───────┐
    │              │
┌───▼────┐  ┌─────▼─────┐
│Inventory│  │Notification│
│Service  │  │  Service  │
└─────────┘  └───────────┘
```

#### Decision Criteria for Migration

**Migrate to Microservices When:**
- ✅ User base > 50,000 active users
- ✅ Team size > 15 developers
- ✅ Clear service boundaries identified
- ✅ Specific scaling needs identified
- ✅ Budget supports increased infrastructure
- ✅ DevOps team is ready

**Stay Monolithic If:**
- ❌ Small user base (< 10,000 users)
- ❌ Limited team (< 10 developers)
- ❌ Budget constraints
- ❌ Simple business logic
- ❌ Fast iteration priority

### Conclusion

The **Monolithic architecture** is the correct choice for our current implementation (Milestones 1-2) because:

1. ✅ **Simplicity**: Perfect for demonstrating design patterns
2. ✅ **Speed**: Faster development for MVP
3. ✅ **Cost**: Lower infrastructure requirements
4. ✅ **Team Size**: Suitable for small teams
5. ✅ **Learning**: Easier to understand and maintain

**Future Evolution**: We have a clear migration path to **Microservices** when business needs justify the complexity, following industry best practices of "start simple, evolve as needed."

The **Event-Driven Architecture** can be introduced gradually through our Observer Pattern implementation, eventually evolving into a full event-driven system using message queues.

---

*Architecture selection is not a one-time decision but an evolutionary process based on changing requirements, team capabilities, and business growth.*
