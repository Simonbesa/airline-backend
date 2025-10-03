# ✈️ Airline Backend API

A robust airline management backend built with **NestJS**, **MongoDB**, and **TypeScript**.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and npm
- **MongoDB** (local installation or Docker)
- **Docker & Docker Compose** (optional, recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd airline-backend

# Clean dependencies installation
nvm use
npm ci

# Set up environment variables
cp .env.example local.env
# Edit local.env with your configuration

# Start Nest app and MongoDB
docker-compose up --build

```

The API will be available at `http://localhost:3000`

## 📡 API Endpoints

### Flights

| Method     | Endpoint         | Description                             |
| ---------- | ---------------- | --------------------------------------- |
| `GET`    | `/flights`     | Get all flights with optional filtering |
| `POST`   | `/flights`     | Create a new flight                     |
| `GET`    | `/flights/:id` | Get flight by ID                        |
| `PATCH`  | `/flights/:id` | Update flight by ID                     |
| `DELETE` | `/flights/:id` | Delete flight by ID                     |

### Example Requests

#### Create a Flight

```bash
curl -X POST http://localhost:3000/flights \
  -H "Content-Type: application/json" \
  -d '{
    "flightCode": "AA123",
    "passengers": [
      {
        "id": 1,
        "name": "John Doe",
        "hasConnections": false,
        "age": 30,
        "flightCategory": "Gold",
        "reservationId": "RES001",
        "hasCheckedBaggage": true
      }
    ]
  }'
```

#### Get All Flights

```bash
curl http://localhost:3000/flights
```

#### Search Flights

```bash
# By passenger category
curl "http://localhost:3000/flights?passengerCategory=Gold"

# By passenger name
curl "http://localhost:3000/flights?passengerName=John"
```

## 🛠 Development

### Local Development

```bash
# Build the application
npm run build

# Start in development mode with hot reload
npm run start:dev

# Start in production mode
npm run start:prod

# Format code
npm run format

# Run linting
npm run lint
```

### Development with Docker

```bash
# Start only MongoDB
docker-compose -f docker-compose.mongo-only.yml up -d

# Start full application stack
docker-compose up --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🐳 Docker Setup

The project includes Docker configuration for both development and production:

### Files

- `docker-compose.yml` - Full application stack
- `docker-compose.mongo-only.yml` - MongoDB only
- `Dockerfile` - NestJS application container
- `docker/mongo-init.js` - MongoDB initialization script

### MongoDB Access

- **Host**: `localhost:27017`
- **Username**: `admin`
- **Password**: `password123`
- **Database**: `airline-backend`

### Connection String

```
mongodb://admin:password123@localhost:27017/airline-backend?authSource=admin
```

## 🔧 Environment Variables

Create a `local.env` file based on `.env.example`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URI=mongodb://admin:password123@localhost:27017/airline-backend?authSource=admin
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run test coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 🛠 Troubleshooting

### Common Issues

**Port 3000 already in use**

```bash
# Stop Docker containers
docker-compose down

# Or use different port
PORT=3001 npm run start:dev
```

**MongoDB connection failed**

```bash
# Start MongoDB container
docker-compose -f docker-compose.mongo-only.yml up -d

# Check MongoDB logs
docker-compose logs mongodb
```

**Permission denied (Docker)**

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Restart session or use newgrp
newgrp docker
```
