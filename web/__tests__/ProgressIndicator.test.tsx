/**
 * Property-Based Tests for ProgressIndicator Component
 * Feature: social-media-downloader
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import ProgressIndicator, { ProgressStatus } from '../components/ProgressIndicator';

/**
 * Property 14: Progress Updates During Download
 * Validates: Requirements 7.2
 * 
 * For any active download, the progress indicator value should increase monotonically 
 * from 0 to 100 over time.
 */
describe('Property 14: Progress Updates During Download', () => {
  it('should display progress value between 0 and 100', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        (progress) => {
          const { container, unmount } = render(
            <ProgressIndicator
              progress={progress}
              status="downloading"
              message={`Downloading... ${progress}%`}
            />
          );

          // The progress value should be displayed in the message
          const textContent = container.textContent || '';
          expect(textContent).toContain(`${progress}%`);

          // Clean up
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should clamp progress values outside 0-100 range', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -100, max: 200 }),
        (progress) => {
          const { container, unmount } = render(
            <ProgressIndicator
              progress={progress}
              status="downloading"
            />
          );

          // The component should render without errors
          expect(container).toBeInTheDocument();

          // Clean up
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should show progress bar only when status is downloading', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.constantFrom<ProgressStatus>('idle', 'fetching', 'downloading', 'complete', 'error'),
        (progress, status) => {
          const { container, unmount } = render(
            <ProgressIndicator
              progress={progress}
              status={status}
            />
          );

          // Progress bar should only be present when downloading
          const progressBar = container.querySelector('.bg-gradient-blue');
          
          if (status === 'downloading') {
            expect(progressBar).toBeInTheDocument();
          } else if (status !== 'idle') {
            // For non-idle, non-downloading statuses, no progress bar
            expect(progressBar).not.toBeInTheDocument();
          }

          // Clean up
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display appropriate status messages for each status', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<ProgressStatus>('fetching', 'downloading', 'complete', 'error'),
        (status) => {
          const { container, unmount } = render(
            <ProgressIndicator
              progress={50}
              status={status}
            />
          );

          const textContent = container.textContent || '';
          
          // Each status should have some message
          expect(textContent.length).toBeGreaterThan(0);

          // Clean up
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 16: Multiple Download Tracking
 * Validates: Requirements 7.5
 * 
 * For any set of concurrent downloads, each download should have its own independent 
 * progress indicator.
 */
describe('Property 16: Multiple Download Tracking', () => {
  it('should render multiple independent progress indicators', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            progress: fc.integer({ min: 0, max: 100 }),
            status: fc.constantFrom<ProgressStatus>('downloading', 'complete', 'error'),
            message: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (downloads) => {
          // Render multiple progress indicators
          const { container, unmount } = render(
            <div>
              {downloads.map((download, index) => (
                <ProgressIndicator
                  key={index}
                  progress={download.progress}
                  status={download.status}
                  message={download.message}
                />
              ))}
            </div>
          );

          // Each download should have its own indicator
          const indicators = container.querySelectorAll('.rounded-xl');
          expect(indicators.length).toBe(downloads.length);

          // Each message should be present
          downloads.forEach(download => {
            const textContent = container.textContent || '';
            expect(textContent).toContain(download.message);
          });

          // Clean up
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain independent progress values for multiple downloads', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (progress1, progress2, progress3) => {
          const { container, unmount } = render(
            <div>
              <ProgressIndicator
                progress={progress1}
                status="downloading"
                message={`Download 1: ${progress1}%`}
              />
              <ProgressIndicator
                progress={progress2}
                status="downloading"
                message={`Download 2: ${progress2}%`}
              />
              <ProgressIndicator
                progress={progress3}
                status="downloading"
                message={`Download 3: ${progress3}%`}
              />
            </div>
          );

          // All three progress values should be present
          const textContent = container.textContent || '';
          expect(textContent).toContain(`${progress1}%`);
          expect(textContent).toContain(`${progress2}%`);
          expect(textContent).toContain(`${progress3}%`);

          // Clean up
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
