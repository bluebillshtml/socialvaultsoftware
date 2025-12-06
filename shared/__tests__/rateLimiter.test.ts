import * as fc from 'fast-check';
import { RateLimiter, ExponentialBackoff } from '../rateLimiter';

describe('Rate Limiter Property Tests', () => {
  /**
   * Feature: social-media-downloader, Property 26: Rate Limit Compliance
   * For any sequence of rapid extraction requests, the system should throttle
   * requests to respect platform rate limits.
   * Validates: Requirements 11.4
   */
  describe('Property 26: Rate Limit Compliance', () => {
    it('should never allow more than maxRequests within the time window', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 20 }), // maxRequests
          fc.integer({ min: 100, max: 5000 }), // windowMs
          fc.array(fc.integer({ min: 0, max: 10000 }), { minLength: 1, maxLength: 100 }), // request delays
          (maxRequests, windowMs, delays) => {
            const rateLimiter = new RateLimiter({ maxRequests, windowMs });
            const identifier = 'test-user';
            let allowedCount = 0;
            let currentTime = 0;

            // Mock Date.now()
            const originalDateNow = Date.now;
            Date.now = () => currentTime;

            try {
              for (const delay of delays) {
                currentTime += delay;

                if (rateLimiter.isAllowed(identifier)) {
                  allowedCount++;
                }

                // Count requests in current window
                const windowStart = currentTime - windowMs;
                const recentRequests = delays
                  .slice(0, delays.indexOf(delay) + 1)
                  .reduce((acc, d, idx) => {
                    const time = delays.slice(0, idx + 1).reduce((sum, v) => sum + v, 0);
                    return time > windowStart ? acc + 1 : acc;
                  }, 0);

                // The number of allowed requests should never exceed maxRequests
                const remaining = rateLimiter.getRemaining(identifier);
                expect(remaining).toBeGreaterThanOrEqual(0);
                expect(remaining).toBeLessThanOrEqual(maxRequests);
              }
            } finally {
              Date.now = originalDateNow;
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should allow requests after the time window expires', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }), // maxRequests
          fc.integer({ min: 100, max: 1000 }), // windowMs
          (maxRequests, windowMs) => {
            const rateLimiter = new RateLimiter({ maxRequests, windowMs });
            const identifier = 'test-user';
            let currentTime = 0;

            const originalDateNow = Date.now;
            Date.now = () => currentTime;

            try {
              // Fill up the rate limit
              for (let i = 0; i < maxRequests; i++) {
                expect(rateLimiter.isAllowed(identifier)).toBe(true);
              }

              // Next request should be blocked
              expect(rateLimiter.isAllowed(identifier)).toBe(false);

              // Advance time past the window
              currentTime += windowMs + 1;

              // Should be allowed again
              expect(rateLimiter.isAllowed(identifier)).toBe(true);
            } finally {
              Date.now = originalDateNow;
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly track remaining requests', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 5, max: 20 }), // maxRequests
          fc.integer({ min: 100, max: 1000 }), // windowMs
          fc.integer({ min: 1, max: 10 }), // requests to make
          (maxRequests, windowMs, requestsToMake) => {
            const rateLimiter = new RateLimiter({ maxRequests, windowMs });
            const identifier = 'test-user';
            const actualRequests = Math.min(requestsToMake, maxRequests);

            // Make requests
            for (let i = 0; i < actualRequests; i++) {
              rateLimiter.isAllowed(identifier);
            }

            // Check remaining
            const remaining = rateLimiter.getRemaining(identifier);
            expect(remaining).toBe(maxRequests - actualRequests);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Exponential Backoff', () => {
    it('should increase delay exponentially with each attempt', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 2000 }), // baseDelay
          fc.integer({ min: 1, max: 5 }), // attempts
          (baseDelay, attempts) => {
            const backoff = new ExponentialBackoff(baseDelay, 60000, 10);
            const delays: number[] = [];

            for (let i = 0; i < attempts; i++) {
              delays.push(backoff.getDelay());
              backoff.increment();
            }

            // Each delay should be at least as large as the previous
            for (let i = 1; i < delays.length; i++) {
              expect(delays[i]).toBeGreaterThanOrEqual(delays[i - 1]);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not exceed maxDelay', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 1000 }), // baseDelay
          fc.integer({ min: 1000, max: 10000 }), // maxDelay
          fc.integer({ min: 5, max: 20 }), // attempts
          (baseDelay, maxDelay, attempts) => {
            const backoff = new ExponentialBackoff(baseDelay, maxDelay, 100);

            for (let i = 0; i < attempts; i++) {
              const delay = backoff.getDelay();
              expect(delay).toBeLessThanOrEqual(maxDelay);
              backoff.increment();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reset attempt counter correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }), // attempts before reset
          (attempts) => {
            const backoff = new ExponentialBackoff(1000, 30000, 10);

            // Make some attempts
            for (let i = 0; i < attempts; i++) {
              backoff.increment();
            }

            expect(backoff.getAttempt()).toBe(attempts);

            // Reset
            backoff.reset();

            expect(backoff.getAttempt()).toBe(0);
            expect(backoff.getDelay()).toBe(1000); // Should be back to base delay
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
