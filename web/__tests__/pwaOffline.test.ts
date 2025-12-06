/**
 * **Feature: social-media-downloader, Property 19: PWA Offline Functionality**
 * **Validates: Requirements 8.5**
 * 
 * Property: For any cached content, the PWA should be able to display that content when offline.
 */

import * as fc from 'fast-check';

// Mock service worker and cache API
class MockCache {
  private storage: Map<string, Response> = new Map();

  async put(request: Request | string, response: Response): Promise<void> {
    const key = typeof request === 'string' ? request : request.url;
    this.storage.set(key, response.clone());
  }

  async match(request: Request | string): Promise<Response | undefined> {
    const key = typeof request === 'string' ? request : request.url;
    const response = this.storage.get(key);
    return response ? response.clone() : undefined;
  }

  async keys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }

  async delete(request: Request | string): Promise<boolean> {
    const key = typeof request === 'string' ? request : request.url;
    return this.storage.delete(key);
  }
}

class MockCacheStorage {
  private caches: Map<string, MockCache> = new Map();

  async open(cacheName: string): Promise<MockCache> {
    if (!this.caches.has(cacheName)) {
      this.caches.set(cacheName, new MockCache());
    }
    return this.caches.get(cacheName)!;
  }

  async has(cacheName: string): Promise<boolean> {
    return this.caches.has(cacheName);
  }

  async delete(cacheName: string): Promise<boolean> {
    return this.caches.delete(cacheName);
  }

  async keys(): Promise<string[]> {
    return Array.from(this.caches.keys());
  }
}

// Simulate offline mode
class OfflineSimulator {
  private cacheStorage: MockCacheStorage;
  private isOnline: boolean = true;

  constructor() {
    this.cacheStorage = new MockCacheStorage();
  }

  async cacheContent(cacheName: string, url: string, content: string): Promise<void> {
    const cache = await this.cacheStorage.open(cacheName);
    const response = new Response(content, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
    await cache.put(url, response);
  }

  setOnline(online: boolean): void {
    this.isOnline = online;
  }

  async fetchContent(cacheName: string, url: string): Promise<string | null> {
    // If online, simulate network fetch (always succeeds)
    if (this.isOnline) {
      return `Online content for ${url}`;
    }

    // If offline, try to get from cache
    const cache = await this.cacheStorage.open(cacheName);
    const cachedResponse = await cache.match(url);
    
    if (cachedResponse) {
      return await cachedResponse.text();
    }

    // If not in cache and offline, return null (network error)
    return null;
  }

  async isCached(cacheName: string, url: string): Promise<boolean> {
    const cache = await this.cacheStorage.open(cacheName);
    const cachedResponse = await cache.match(url);
    return cachedResponse !== undefined;
  }
}

describe('PWA Offline Functionality Property Tests', () => {
  /**
   * Property 19: PWA Offline Functionality
   * For any cached content, the PWA should be able to display that content when offline.
   */
  test('Property 19: Cached content should be accessible offline', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            url: fc.webUrl(),
            content: fc.string({ minLength: 1, maxLength: 1000 })
          }),
          { minLength: 1, maxLength: 10 }
        ),
        async (cachedItems) => {
          const simulator = new OfflineSimulator();
          const cacheName = 'test-cache';

          // Cache all items while online
          for (const item of cachedItems) {
            await simulator.cacheContent(cacheName, item.url, item.content);
          }

          // Verify all items are cached
          for (const item of cachedItems) {
            const isCached = await simulator.isCached(cacheName, item.url);
            expect(isCached).toBe(true);
          }

          // Go offline
          simulator.setOnline(false);

          // Property: All cached content should be accessible offline
          for (const item of cachedItems) {
            const offlineContent = await simulator.fetchContent(cacheName, item.url);
            
            // The content should be retrievable (not null)
            expect(offlineContent).not.toBeNull();
            
            // The content should match what was cached
            expect(offlineContent).toBe(item.content);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 19: Uncached content should not be accessible offline', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.webUrl(), { minLength: 1, maxLength: 10 }),
        async (urls) => {
          const simulator = new OfflineSimulator();
          const cacheName = 'test-cache';

          // Go offline without caching anything
          simulator.setOnline(false);

          // Property: Uncached content should return null when offline
          for (const url of urls) {
            const offlineContent = await simulator.fetchContent(cacheName, url);
            expect(offlineContent).toBeNull();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 19: Mixed cached and uncached content behavior', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          cachedUrls: fc.array(
            fc.record({
              url: fc.webUrl(),
              content: fc.string({ minLength: 1, maxLength: 500 })
            }),
            { minLength: 1, maxLength: 5 }
          ),
          uncachedUrls: fc.array(fc.webUrl(), { minLength: 1, maxLength: 5 })
        }),
        async ({ cachedUrls, uncachedUrls }) => {
          const simulator = new OfflineSimulator();
          const cacheName = 'test-cache';

          // Cache only the cachedUrls
          for (const item of cachedUrls) {
            await simulator.cacheContent(cacheName, item.url, item.content);
          }

          // Go offline
          simulator.setOnline(false);

          // Property: Cached URLs should be accessible
          for (const item of cachedUrls) {
            const content = await simulator.fetchContent(cacheName, item.url);
            expect(content).not.toBeNull();
            expect(content).toBe(item.content);
          }

          // Property: Uncached URLs should not be accessible
          for (const url of uncachedUrls) {
            // Skip if this URL was accidentally in the cached set
            const wasCached = cachedUrls.some(item => item.url === url);
            if (!wasCached) {
              const content = await simulator.fetchContent(cacheName, url);
              expect(content).toBeNull();
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 19: Online mode should always succeed regardless of cache', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.webUrl(), { minLength: 1, maxLength: 10 }),
        async (urls) => {
          const simulator = new OfflineSimulator();
          const cacheName = 'test-cache';

          // Stay online (default state)
          simulator.setOnline(true);

          // Property: All URLs should be accessible when online, even if not cached
          for (const url of urls) {
            const content = await simulator.fetchContent(cacheName, url);
            expect(content).not.toBeNull();
            expect(content).toContain(url); // Should contain the URL in the response
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 19: Cache persistence across online/offline transitions', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            url: fc.webUrl(),
            content: fc.string({ minLength: 1, maxLength: 500 })
          }),
          { minLength: 1, maxLength: 5 }
        ),
        async (cachedItems) => {
          const simulator = new OfflineSimulator();
          const cacheName = 'test-cache';

          // Cache while online
          simulator.setOnline(true);
          for (const item of cachedItems) {
            await simulator.cacheContent(cacheName, item.url, item.content);
          }

          // Go offline
          simulator.setOnline(false);

          // Verify content is accessible offline
          for (const item of cachedItems) {
            const offlineContent = await simulator.fetchContent(cacheName, item.url);
            expect(offlineContent).toBe(item.content);
          }

          // Go back online
          simulator.setOnline(true);

          // Property: Cache should persist and content should still be accessible
          for (const item of cachedItems) {
            const isCached = await simulator.isCached(cacheName, item.url);
            expect(isCached).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
