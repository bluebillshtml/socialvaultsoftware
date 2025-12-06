/**
 * Rate Limiter
 * Implements client-side and server-side rate limiting with exponential backoff
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RequestRecord {
  timestamp: number;
  count: number;
}

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if a request is allowed for a given identifier (IP or user ID)
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get existing requests for this identifier
    let timestamps = this.requests.get(identifier) || [];

    // Filter out requests outside the current window
    timestamps = timestamps.filter(ts => ts > windowStart);

    // Check if under limit
    if (timestamps.length >= this.config.maxRequests) {
      return false;
    }

    // Add current request
    timestamps.push(now);
    this.requests.set(identifier, timestamps);

    return true;
  }

  /**
   * Get remaining requests for an identifier
   */
  getRemaining(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    const timestamps = this.requests.get(identifier) || [];
    const validTimestamps = timestamps.filter(ts => ts > windowStart);

    return Math.max(0, this.config.maxRequests - validTimestamps.length);
  }

  /**
   * Get time until next request is allowed (in ms)
   */
  getRetryAfter(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    const timestamps = this.requests.get(identifier) || [];
    const validTimestamps = timestamps.filter(ts => ts > windowStart);

    if (validTimestamps.length < this.config.maxRequests) {
      return 0;
    }

    // Return time until oldest request expires
    const oldestTimestamp = validTimestamps[0];
    return Math.max(0, oldestTimestamp + this.config.windowMs - now);
  }

  /**
   * Reset rate limit for an identifier
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Clean up old entries (call periodically)
   */
  cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    for (const [identifier, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter(ts => ts > windowStart);
      
      if (validTimestamps.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validTimestamps);
      }
    }
  }
}

/**
 * Client-side rate limiter (10 requests per minute)
 */
export const clientRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
});

/**
 * Server-side rate limiter (100 requests per hour per IP)
 */
export const serverRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
});

/**
 * Exponential backoff utility
 */
export class ExponentialBackoff {
  private attempt: number = 0;
  private readonly baseDelay: number;
  private readonly maxDelay: number;
  private readonly maxAttempts: number;

  constructor(
    baseDelay: number = 1000,
    maxDelay: number = 30000,
    maxAttempts: number = 5
  ) {
    this.baseDelay = baseDelay;
    this.maxDelay = maxDelay;
    this.maxAttempts = maxAttempts;
  }

  /**
   * Get delay for current attempt
   */
  getDelay(): number {
    const delay = Math.min(
      this.baseDelay * Math.pow(2, this.attempt),
      this.maxDelay
    );
    return delay;
  }

  /**
   * Increment attempt counter
   */
  increment(): void {
    this.attempt++;
  }

  /**
   * Check if max attempts reached
   */
  isMaxed(): boolean {
    return this.attempt >= this.maxAttempts;
  }

  /**
   * Reset attempt counter
   */
  reset(): void {
    this.attempt = 0;
  }

  /**
   * Get current attempt number
   */
  getAttempt(): number {
    return this.attempt;
  }

  /**
   * Execute a function with exponential backoff retry logic
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    while (true) {
      try {
        const result = await fn();
        this.reset();
        return result;
      } catch (error) {
        this.increment();

        if (this.isMaxed()) {
          throw new Error(
            `Max retry attempts (${this.maxAttempts}) reached: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
        }

        const delay = this.getDelay();
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}
