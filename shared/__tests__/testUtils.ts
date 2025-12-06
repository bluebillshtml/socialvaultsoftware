/**
 * Test Utilities Index
 * 
 * Central export point for all testing utilities, generators, and configurations.
 * Import from this file to access fast-check generators and configurations.
 * 
 * @example
 * ```typescript
 * import { 
 *   PBT_CONFIG, 
 *   platformArbitrary, 
 *   youtubeUrlArbitrary 
 * } from './testUtils';
 * 
 * fc.assert(
 *   fc.property(youtubeUrlArbitrary, (url) => {
 *     // test logic
 *   }),
 *   PBT_CONFIG
 * );
 * ```
 */

// Export all generators
export * from './testGenerators';

// Export all configurations
export * from './fastCheckConfig';

// Re-export fast-check for convenience
export * as fc from 'fast-check';
