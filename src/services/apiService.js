import { notificationService } from '../components/Notifications/notificationService';

/**
 * Wrap an async operation with loading/success/error notifications.
 * Usage:
 *   await withNotification(someAsyncOperation(), {
 *     loading: 'Submitting leave application...',
 *     success: 'Leave application submitted successfully.',
 *     error: 'Failed to submit leave application.'
 *   });
 */
export function withNotification(promise, { loading, success, error } = {}) {
  return notificationService.promise(promise, { loading, success, error });
}

/**
 * Simulate an async request for demo/mocked APIs.
 */
export function simulateApiCall(data, delay = 800, shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Unable to connect to the server. Please try again later.'));
      } else {
        resolve(data);
      }
    }, delay);
  });
}

export default { withNotification, simulateApiCall };
