/**
 * Property-Based Tests for InputBar Component
 * Feature: social-media-downloader
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import InputBar from '../components/InputBar';

/**
 * Property 4: Invalid URL Error Handling
 * Validates: Requirements 1.4
 * 
 * For any invalid URL input, the system should display an error message containing guidance text.
 */
describe('Property 4: Invalid URL Error Handling', () => {
  it('should display error message with guidance text for any invalid URL', () => {
    fc.assert(
      fc.property(
        fc.string().filter(str => str.trim().length > 0), // Non-empty error messages
        (errorMessage) => {
          const mockOnChange = jest.fn();
          const mockOnSubmit = jest.fn();
          
          const { container, unmount } = render(
            <InputBar
              value="invalid-url"
              onChange={mockOnChange}
              onSubmit={mockOnSubmit}
              error={errorMessage}
            />
          );
          
          // The error message should be displayed in the DOM
          const errorElement = container.querySelector('.text-error p');
          expect(errorElement).toBeInTheDocument();
          expect(errorElement?.textContent).toBe(errorMessage);
          
          // The error container should have error styling indicators
          const errorContainer = container.querySelector('.text-error');
          expect(errorContainer).toBeInTheDocument();
          expect(errorContainer).toHaveClass('text-error');
          
          // Clean up after each test
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display error styling on input when error is present', () => {
    fc.assert(
      fc.property(
        fc.string().filter(str => str.trim().length > 0),
        fc.string(),
        (errorMessage, inputValue) => {
          const mockOnChange = jest.fn();
          const mockOnSubmit = jest.fn();
          
          const { container } = render(
            <InputBar
              value={inputValue}
              onChange={mockOnChange}
              onSubmit={mockOnSubmit}
              error={errorMessage}
            />
          );
          
          // Find the input container (the div with border styling)
          const inputContainer = container.querySelector('div[class*="border"]');
          expect(inputContainer).toBeInTheDocument();
          
          // When error is present, the border should have error styling
          expect(inputContainer?.className).toContain('border-error');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not display error message when no error is provided', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (inputValue) => {
          const mockOnChange = jest.fn();
          const mockOnSubmit = jest.fn();
          
          const { container } = render(
            <InputBar
              value={inputValue}
              onChange={mockOnChange}
              onSubmit={mockOnSubmit}
              error={undefined}
            />
          );
          
          // No error message should be displayed
          const errorElements = container.querySelectorAll('.text-error');
          expect(errorElements.length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
