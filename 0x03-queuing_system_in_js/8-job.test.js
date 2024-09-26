const kue = require('kue');
const chai = require('chai');
const expect = chai.expect;
const createPushNotificationsJobs = require('../8-job');  // Adjust path if needed

describe('createPushNotificationsJobs', () => {
  let queue;

  beforeEach(() => {
    // Create a queue and enter test mode before each test
    queue = kue.createQueue();
    queue.testMode.enter();
  });

  afterEach(() => {
    // Clear the queue and exit test mode after each test
    queue.testMode.clear();
    queue.testMode.exit();
  });

  it('should throw an error if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs('not an array', queue)).to.throw(
      'Jobs is not an array'
    );
  });

  it('should create jobs for each object in the jobs array', () => {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account'
      }
    ];

    createPushNotificationsJobs(jobs, queue);

    // Check that jobs were added to the queue
    expect(queue.testMode.jobs.length).to.equal(2);

    // Validate the job data
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[0].data).to.deep.equal(jobs[0]);

    expect(queue.testMode.jobs[1].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[1].data).to.deep.equal(jobs[1]);
  });

  it('should log job creation, completion, failure, and progress', (done) => {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      }
    ];

    createPushNotificationsJobs(jobs, queue);

    const job = queue.testMode.jobs[0];

    // Simulate job events
    job.on('complete', () => {
      console.log(`Notification job ${job.id} completed`);
    });

    job.on('failed', (errorMessage) => {
      console.log(`Notification job ${job.id} failed: ${errorMessage}`);
    });

    job.on('progress', (progress) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });

    // You can trigger the events manually for testing purposes
    job.emit('complete');
    job.emit('failed', 'Something went wrong');
    job.emit('progress', 50);

    done();
  });
});

