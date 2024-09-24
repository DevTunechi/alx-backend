import { createClient } from 'redis';

// Redis client
const client = createClient();

// This is the Event listener for successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// This is the Event listener for connection errors
client.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});

// Ready to Connect to Redis server
client.connect();
