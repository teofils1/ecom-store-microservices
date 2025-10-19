#!/bin/bash

echo "========================================"
echo "Seeding Sample Data"
echo "========================================"
echo ""

echo "Creating sample products..."

curl -X POST http://localhost:8081/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop Pro 15","description":"High-performance laptop with Intel i7 processor, 16GB RAM, 512GB SSD","price":1299.99,"category":"Electronics","stockQuantity":50,"imageUrl":"https://via.placeholder.com/300x200?text=Laptop","available":true}'

curl -X POST http://localhost:8081/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Wireless Mouse","description":"Ergonomic wireless mouse with precision tracking","price":29.99,"category":"Electronics","stockQuantity":200,"imageUrl":"https://via.placeholder.com/300x200?text=Mouse","available":true}'

curl -X POST http://localhost:8081/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Mechanical Keyboard","description":"RGB mechanical keyboard with blue switches","price":89.99,"category":"Electronics","stockQuantity":100,"imageUrl":"https://via.placeholder.com/300x200?text=Keyboard","available":true}'

curl -X POST http://localhost:8081/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"4K Monitor","description":"27-inch 4K UHD monitor with HDR support","price":399.99,"category":"Electronics","stockQuantity":75,"imageUrl":"https://via.placeholder.com/300x200?text=Monitor","available":true}'

curl -X POST http://localhost:8081/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Smartphone X","description":"Latest smartphone with 5G, 128GB storage, triple camera","price":799.99,"category":"Electronics","stockQuantity":150,"imageUrl":"https://via.placeholder.com/300x200?text=Smartphone","available":true}'

curl -X POST http://localhost:8081/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Wireless Headphones","description":"Noise-cancelling over-ear wireless headphones","price":249.99,"category":"Electronics","stockQuantity":80,"imageUrl":"https://via.placeholder.com/300x200?text=Headphones","available":true}'

curl -X POST http://localhost:8081/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"USB-C Hub","description":"7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader","price":39.99,"category":"Electronics","stockQuantity":300,"imageUrl":"https://via.placeholder.com/300x200?text=USB-Hub","available":true}'

curl -X POST http://localhost:8081/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"External SSD 1TB","description":"Portable external SSD with 1TB storage, USB 3.2 Gen 2","price":129.99,"category":"Electronics","stockQuantity":120,"imageUrl":"https://via.placeholder.com/300x200?text=SSD","available":true}'

curl -X POST http://localhost:8081/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Webcam HD","description":"1080p HD webcam with built-in microphone","price":59.99,"category":"Electronics","stockQuantity":90,"imageUrl":"https://via.placeholder.com/300x200?text=Webcam","available":true}'

curl -X POST http://localhost:8081/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Desk Lamp LED","description":"Adjustable LED desk lamp with touch control","price":34.99,"category":"Home & Office","stockQuantity":150,"imageUrl":"https://via.placeholder.com/300x200?text=Lamp","available":true}'

echo ""
echo "✓ Sample products created!"
echo ""
echo "Visit http://localhost:3000 to see the products"
echo ""
