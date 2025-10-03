// MongoDB initialization script
db = db.getSiblingDB('airline-backend');

// Create a user for the airline-backend database
db.createUser({
  user: 'airline_user',
  pwd: 'airline_password',
  roles: [
    {
      role: 'readWrite',
      db: 'airline-backend'
    }
  ]
});

// Create indexes for the flights collection
db.flights.createIndex({ "flightCode": 1 }, { unique: true });
db.flights.createIndex({ "origin": 1, "destination": 1 });
db.flights.createIndex({ "departureTime": 1 });

print('Database initialization completed successfully!');