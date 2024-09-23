import { createClient } from 'redis';
import redis from 'redis';

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

// Function to create a hash with values
function createHash() {
  const hashKey = 'HolbertonSchools';
  const schools = {
    Portland: 50,
    Seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2
  };

  for (const [city, value] of Object.entries(schools)) {
    client.hset(hashKey, city, value, redis.print);
  }
}

// Function to display the hash stored in Redis
function displayHash() {
  const hashKey = 'HolbertonSchools';
  client.hgetall(hashKey, (err, result) => {
    if (err) {
      console.error(`Error retrieving hash: ${err.message}`);
    } else {
      console.log(`Hash for ${hashKey}:`, result);
    }
  });
}

// Ready to connect to Redis server
client.connect();

// Create the hash and display it
createHash();
displayHash();
