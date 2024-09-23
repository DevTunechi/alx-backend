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

// Function to set new school in Redis
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, (err, reply) => {
    if (err) {
      console.error(`Error setting value for ${schoolName}: ${err.message}`);
    } else {
      console.log(`Set ${schoolName} to ${value}: ${reply}`);
    }
  });
}

// Function to display value of a school in Redis
function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, value) => {
    if (err) {
      console.error(`Error retrieving value for ${schoolName}: ${err.message}`);
    } else {
      console.log(`Value for ${schoolName}: ${value}`);
    }
  });
}

// Ready to connect to Redis server
client.connect();

// Required Callbacks
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
