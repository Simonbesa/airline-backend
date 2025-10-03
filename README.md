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
sudo docker-compose up --build

```

The API will be available at `http://localhost:3000`

## 📡 API Endpoints

### Flights

| Method     | Endpoint         | Description                             |
| ---------- | ---------------- | --------------------------------------- |
| `POST`   | `/flights`     | Create a new flight                     |
| `GET`    | `/flights`     | Get all flights with optional filtering |
| `GET`    | `/flights/:flightCode` | Get flight by flightCode  |
| `PATCH`  | `/flights/add-passengers/:flightCode` | Add passengers to a flight |
| `PATCH`  | `/flights/update-passengers/:flightCode` | Update flight passengers |
| `PATCH`  | `/flights/delete-passengers/:flightCode` | Delete passengers from a flight |
| `DELETE` | `/flights/:flightCode` | Delete flight by ID |

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

For the next requests, to be useful, one or more flights should have been created first

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

Use a .env file with the required environment variables, use this variables to start:

PORT=3000
DATABASE_URI=mongodb://admin:password123@localhost:27017/airline?authSource=admin
NODE_ENV=development

Then you need to run the services stack:

```bash
# Before starting it is important to have the database running
docker-compose -f docker-compose.mongo-only.yml up -d

# Start in development mode with hot reload
npm run start:dev
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
- **Database**: `airline`

### Connection String

```
mongodb://admin:password123@localhost:27017/airline?authSource=admin
```

## 🔧 Environment Variables

Create a `local.env` file based on `.env.example`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URI=mongodb://admin:password123@localhost:27017/airline?authSource=admin
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run test coverage
npm run test:cov
```

### e2e tests

There are two suggested ways of running e2e tests:

#### full containerized

```bash
npm run test:e2e:docker
```

#### Separated on different contexts

Open a terminal to start up the services

```bash
# Mongodb in a docker container
npm run start:docker:database

# Then serve the app
npm run start:dev
```

Open a new terminal to run the tests

```bash
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

**Permission denied (dist)**

case:
npm run start:dev

airline-backend-api@0.0.1 start:dev
nest start --watch

Error EACCES: permission denied, unlink '/path/to/repo/dist/app.controller.d.ts'

Solution:

```bash
sudo chown -R $USER:$USER dist/
```