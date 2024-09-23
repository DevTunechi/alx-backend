import kue from 'kue';
import { createClient } from 'redis';

// Create Redis client
const redisClient = createClient();

// Create a queue
const queue = kue.createQueue({
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

// Job data
const jobData = {
  phoneNumber: '1234567890',
  message: 'This is a notification message',
};

// Create a job named push_notification_code
const job = queue.create('push_notification_code', jobData).save((err) => {
  if (!err) {
    console.log(`Notification job created: ${job.id}`);
  } else {
    console.error('Error creating job:', err);
  }
});

// Listen for job completion
job.on('complete', () => {
  console.log('Notification job completed');
});

// Listen for job failure
job.on('failed', (errorMessage) => {
  console.log('Notification job failed:', errorMessage);
});
