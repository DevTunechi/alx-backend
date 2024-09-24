const kue = require('kue');
const queue = kue.createQueue();

// Array containing blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

/**
 * Function to send notification
 * @param {string} phoneNumber - The phone number to send notification to
 * @param {string} message - The message to send
 * @param {object} job - The job object
 * @param {function} done - Callback function to signal completion
 */
function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, 100); // Initial progress tracking

  // Check if phoneNumber is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }

  // Simulate some work
  job.progress(50, 100); // Progress tracking at 50%
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  // Finalize the job
  done();
}

// Process the queue "push_notification_code_2", handling 2 jobs at a time
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});
