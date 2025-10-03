#!/bin/bash

# Clean up any existing containers and volumes
docker-compose down -v --remove-orphans

# Start docker containers in detached mode
docker-compose up -d

# Wait for services to be ready
sleep 15

# Run e2e tests
jest --config ./test/jest-e2e.json

# Clean up containers and volumes after tests
docker-compose down -v --remove-orphans