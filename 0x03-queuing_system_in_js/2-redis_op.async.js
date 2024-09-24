mport { createClient } from 'redis';
import { promisify } from 'util';

// Redis client
const client = createClient();

// This is the Event listener for successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// This is the Event listener for connection errors
client.on('error', (err) => {
  console.log('Redis client connected to the server');
});

// This is the Event listener for connection errors
client.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});

// Function to set a new school in Redis
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, (err, reply) => {
    if (err) {
      console.error(`Error setting value for ${schoolName}: ${err.message}`);
    } else {
      console.log(`Set ${schoolName} to ${value}: ${reply}`);
    }
  });
}

// Promisified function to display the value of a school in Redis
const getSchoolValue =
promisify(client.get).bind(client);

async function displaySchoolValue(schoolName) {
  try {
    const value = await getSchoolValue(schoolName);
    console.log(`Value for ${schoolName}: ${value}`);
    } catch (err) {
      console.error(`Error retrieving value for ${schoolName}: ${err.message}`);
  }
}

// Ready to connect to Redis server
client.connect();

// Required callbacks
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
