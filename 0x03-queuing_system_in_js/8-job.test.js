// createPushNotificationsJobs.test.js
const createPushNotificationsJobs = require('./createPushNotificationsJobs');
const kue = require('kue');
const { expect } = require('chai');

describe('createPushNotificationsJobs', () => {
  let queue;

  beforeEach(() => {
    queue = kue.createQueue();
    queue.testMode.enter();  // Enter test mode without processing jobs
  });

  afterEach(() => {
    queue.testMode.clear();  // Clear the queue after each test
    queue.testMode.exit();   // Exit test mode after all tests
  });

  it('should throw an error if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs('invalid', queue)).to.throw(Error, 'Jobs is not an array');
  });

  it('should create jobs for each job data item in the array', () => {
    const jobs = [
      { phoneNumber: '1234567890', message: 'Test message 1' },
      { phoneNumber: '0987654321', message: 'Test message 2' }
    ];

    createPushNotificationsJobs(jobs, queue);

    expect(queue.testMode.jobs.length).to.equal(2);  // Check if two jobs were added
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[0].data).to.eql(jobs[0]);  // Check if job data matches
    expect(queue.testMode.jobs[1].data).to.eql(jobs[1]);
  });

  it('should not process jobs while in test mode', () => {
    const jobs = [
      { phoneNumber: '1234567890', message: 'Test message' }
    ];

    createPushNotificationsJobs(jobs, queue);
    
    expect(queue.testMode.jobs[0]._state).to.equal('inactive');  // Jobs should not be processed
  });
});