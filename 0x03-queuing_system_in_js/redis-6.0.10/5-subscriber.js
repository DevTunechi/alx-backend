import { createClient } from 'redis';

// Redis client
const subscriber = createClient();

// Event listener for successful connection
subscriber.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Event listener for connection errors
subscriber.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});

// Subscribe to the channel
subscriber.subscribe('holberton school channel');

// Handle messages received on the channel
subscriber.on('message', (channel, message) => {
  console.log(`Received message from ${channel}: ${message}`);
  
  if (message === 'KILL_SERVER') {
    subscriber.unsubscribe();
    subscriber.quit();
  }
});
