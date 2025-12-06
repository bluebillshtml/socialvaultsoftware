/**
 * Fast-Check Configuration
 * 
 * Centralized configuration for property-based testing across the application.
 * All property-based tests MUST use these configurations to ensure consistency
 * and meet the minimum iteration requirements specified in the design document.
 */

import * as fc from 'fast-check';

/**
 * Default parameters for all property-based tests
 * 
 * Configuration:
 * - numRuns: Minimum 100 iterations as specified in design document
 * - verbose: Set to true for detailed output during test failures
 * - seed: Can be set for reproducible test runs
 * - path: Recorded for debugging failed test cases
 * - endOnFailure: Stop on first failure for faster feedback
 */
export const DEFAULT_PBT_PARAMS: fc.Parameters<unknown> = {
  numRuns: 100,
  verbose: false,
  endOnFailure: true,
};

/**
 * Extended parameters for thorough testing
 * Use for critical components or when investigating edge cases
 */
export const THOROUGH_PBT_PARAMS: fc.Parameters<unknown> = {
  numRuns: 500,
  verbose: true,
  endOnFailure: false,
};

/**
 * Quick parameters for development/debugging
 * Use during development for faster feedback loops
 */
export const QUICK_PBT_PARAMS: fc.Parameters<unknown> = {
  numRuns: 20,
  verbose: true,
  endOnFailure: true,
};

/**
 * Helper function to run property-based tests with default configuration
 * 
 * @example
 * ```typescript
 * runProperty(
 *   fc.property(fc.string(), (str) => {
 *     return str.length >= 0;
 *   })
 * );
 * ```
 */
export function runProperty<Ts>(
  property: fc.IProperty<Ts>,
  params: fc.Parameters<Ts> = DEFAULT_PBT_PARAMS as fc.Parameters<Ts>
): void {
  fc.assert(property, params);
}

/**
 * Helper function to run async property-based tests with default configuration
 * 
 * @example
 * ```typescript
 * await runAsyncProperty(
 *   fc.asyncProperty(fc.string(), async (str) => {
 *     const result = await processString(str);
 *     return result !== null;
 *   })
 * );
 * ```
 */
export async function runAsyncProperty<Ts>(
  property: fc.IAsyncProperty<Ts>,
  params: fc.Parameters<Ts> = DEFAULT_PBT_PARAMS as fc.Parameters<Ts>
): Promise<void> {
  await fc.assert(property, params);
}

/**
 * Configuration for specific test scenarios
 */
export const TEST_SCENARIOS = {
  /**
   * URL validation tests - ensure comprehensive coverage of URL patterns
   */
  urlValidation: {
    ...DEFAULT_PBT_PARAMS,
    numRuns: 150,
  },

  /**
   * Platform detection tests - test all platform URL variations
   */
  platformDetection: {
    ...DEFAULT_PBT_PARAMS,
    numRuns: 200,
  },

  /**
   * Metadata extraction tests - verify data completeness
   */
  metadataExtraction: {
    ...DEFAULT_PBT_PARAMS,
    numRuns: 100,
  },

  /**
   * UI component tests - test responsive behavior
   */
  uiComponents: {
    ...DEFAULT_PBT_PARAMS,
    numRuns: 100,
  },

  /**
   * Security tests - thorough testing of security measures
   */
  security: {
    ...THOROUGH_PBT_PARAMS,
    numRuns: 300,
  },

  /**
   * Performance tests - test under various load conditions
   */
  performance: {
    ...DEFAULT_PBT_PARAMS,
    numRuns: 100,
  },
} as const;

/**
 * Seed management for reproducible tests
 * Set a seed to reproduce a specific test failure
 */
export function withSeed(seed: number, params: fc.Parameters<unknown> = DEFAULT_PBT_PARAMS): fc.Parameters<unknown> {
  return {
    ...params,
    seed,
  };
}

/**
 * Enable verbose output for debugging
 */
export function withVerbose(params: fc.Parameters<unknown> = DEFAULT_PBT_PARAMS): fc.Parameters<unknown> {
  return {
    ...params,
    verbose: true,
  };
}

/**
 * Custom reporter for property-based test failures
 * Provides detailed information about failing test cases
 */
export function formatPropertyFailure(error: unknown): string {
  if (error instanceof Error) {
    const lines = [
      '❌ Property-Based Test Failure',
      '================================',
      '',
      'Error Message:',
      error.message,
      '',
    ];

    // Extract counterexample if available
    const counterexampleMatch = error.message.match(/Counterexample: (.*)/);
    if (counterexampleMatch) {
      lines.push('Counterexample:', counterexampleMatch[1], '');
    }

    // Extract seed if available
    const seedMatch = error.message.match(/seed: (\d+)/);
    if (seedMatch) {
      lines.push(`Reproduce with seed: ${seedMatch[1]}`, '');
    }

    lines.push('Stack Trace:', error.stack || 'No stack trace available');

    return lines.join('\n');
  }

  return String(error);
}

/**
 * Type guard to check if a value is a fast-check error
 */
export function isFastCheckError(error: unknown): error is Error & { counterexample?: unknown } {
  return error instanceof Error && 'counterexample' in error;
}
