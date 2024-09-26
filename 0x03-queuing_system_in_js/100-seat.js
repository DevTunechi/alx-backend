const express = require('express');
const redis = require('redis');
const { promisify } = require('util');
const kue = require('kue');
const app = express();
const port = 1245;

// Initialize Redis client
const client = redis.createClient();

// Promisify Redis methods
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Kue queue setup
const queue = kue.createQueue();

// Initial values
let reservationEnabled = true;

// Function to set the number of available seats in Redis
async function reserveSeat(number) {
  await setAsync('available_seats', number);
}

// Function to get the current number of available seats from Redis
async function getCurrentAvailableSeats() {
  const seats = await getAsync('available_seats');
  return seats ? parseInt(seats, 10) : 0;
}

// Initialize seats to 50 on launch
reserveSeat(50);