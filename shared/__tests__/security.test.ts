import * as fc from 'fast-check';
import {
  sanitizeUrl,
  validateFileType,
  validateFileSize,
  sanitizeFilename,
  isPublicUrl,
  validateSecureUrl,
  getMaxFileSize,
} from '../security';

describe('Security Property Tests', () => {
  /**
   * Feature: social-media-downloader, Property 25: Public Endpoint Access Only
   * For any content extraction request, the download engine should not use
   * authentication tokens or credentials.
   * Validates: Requirements 11.1, 11.2, 11.3
   */
  describe('Property 25: Public Endpoint Access Only', () => {
    it('should reject URLs with authentication credentials', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          fc.string({ minLength: 1, maxLength: 20 }).filter(s => 
            // Filter out characters that would make the URL invalid
            !s.includes('@') && !s.includes('/') && !s.includes(':') && 
            !s.includes('?') && !s.includes('#') && !s.includes(' ')
          ),
          fc.string({ minLength: 1, maxLength: 20 }).filter(s => 
            // Filter out characters that would make the URL invalid
            !s.includes('@') && !s.includes('/') && !s.includes(':') && 
            !s.includes('?') && !s.includes('#') && !s.includes(' ')
          ),
          (baseUrl, username, password) => {
            // Create URL with credentials
            const urlWithAuth = baseUrl.replace('://', `://${encodeURIComponent(username)}:${encodeURIComponent(password)}@`);

            // Should not be considered public
            expect(isPublicUrl(urlWithAuth)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject localhost and private IP addresses', () => {
      const privateUrls = [
        'http://localhost/test',
        'http://127.0.0.1/test',
        'http://192.168.1.1/test',
        'http://10.0.0.1/test',
        'http://172.16.0.1/test',
        'http://[::1]/test',
      ];

      for (const url of privateUrls) {
        expect(isPublicUrl(url)).toBe(false);
      }
    });

    it('should accept valid public URLs', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            'youtube.com',
            'instagram.com',
            'tiktok.com',
            'twitter.com',
            'facebook.com',
            'reddit.com',
            'pinterest.com',
            'linkedin.com'
          ),
          fc.string({ minLength: 1, maxLength: 50 }),
          (domain, path) => {
            const url = `https://${domain}/${path}`;
            expect(isPublicUrl(url)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject dangerous protocols', () => {
      const dangerousProtocols = ['file:', 'javascript:', 'data:', 'vbscript:'];

      fc.assert(
        fc.property(
          fc.constantFrom(...dangerousProtocols),
          fc.string({ minLength: 1, maxLength: 50 }),
          (protocol, content) => {
            const url = `${protocol}${content}`;

            expect(() => sanitizeUrl(url)).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should require http or https protocol', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => 
            !s.toLowerCase().startsWith('http://') && 
            !s.toLowerCase().startsWith('https://')
          ),
          (url) => {
            expect(() => sanitizeUrl(url)).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should sanitize URLs by removing HTML tags', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          fc.string({ minLength: 1, maxLength: 20 }),
          (baseUrl, tag) => {
            const urlWithTag = `${baseUrl}<${tag}>`;
            const sanitized = sanitizeUrl(urlWithTag);

            // Should not contain angle brackets
            expect(sanitized).not.toContain('<');
            expect(sanitized).not.toContain('>');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject URLs exceeding maximum length', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(3000);

      expect(() => sanitizeUrl(longUrl)).toThrow();
    });

    it('should validate secure URLs comprehensively', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          (url) => {
            const result = validateSecureUrl(url);

            if (result.valid) {
              // If valid, should have sanitized URL
              expect(result.sanitized).toBeDefined();
              expect(typeof result.sanitized).toBe('string');
              expect(result.error).toBeUndefined();
            } else {
              // If invalid, should have error message
              expect(result.error).toBeDefined();
              expect(typeof result.error).toBe('string');
              expect(result.sanitized).toBeUndefined();
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('File Security', () => {
    it('should validate file types correctly', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('video', 'audio', 'image'),
          (type) => {
            const validMimeTypes = {
              video: ['video/mp4', 'video/webm'],
              audio: ['audio/mpeg', 'audio/mp3'],
              image: ['image/jpeg', 'image/png'],
            };

            const invalidMimeTypes = {
              video: ['audio/mp3', 'image/png', 'application/pdf'],
              audio: ['video/mp4', 'image/png', 'application/pdf'],
              image: ['video/mp4', 'audio/mp3', 'application/pdf'],
            };

            // Valid types should pass
            for (const mimeType of validMimeTypes[type as keyof typeof validMimeTypes]) {
              expect(validateFileType(mimeType, type as any)).toBe(true);
            }

            // Invalid types should fail
            for (const mimeType of invalidMimeTypes[type as keyof typeof invalidMimeTypes]) {
              expect(validateFileType(mimeType, type as any)).toBe(false);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should enforce maximum file size limit', () => {
      const maxSize = getMaxFileSize();

      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: maxSize }),
          (size) => {
            expect(validateFileSize(size)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );

      fc.assert(
        fc.property(
          fc.integer({ min: maxSize + 1, max: maxSize * 2 }),
          (size) => {
            expect(validateFileSize(size)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should sanitize filenames to prevent directory traversal', () => {
      const dangerousFilenames = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32',
        './../../secret.txt',
        'normal/../../../etc/passwd',
      ];

      for (const filename of dangerousFilenames) {
        const sanitized = sanitizeFilename(filename);

        // Should not contain path separators or parent directory references
        expect(sanitized).not.toContain('..');
        expect(sanitized).not.toContain('/');
        expect(sanitized).not.toContain('\\');
      }
    });

    it('should remove dangerous characters from filenames', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (filename) => {
            const sanitized = sanitizeFilename(filename);

            // Should not contain dangerous characters
            expect(sanitized).not.toContain('<');
            expect(sanitized).not.toContain('>');
            expect(sanitized).not.toContain(':');
            expect(sanitized).not.toContain('"');
            expect(sanitized).not.toContain('|');
            expect(sanitized).not.toContain('?');
            expect(sanitized).not.toContain('*');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should limit filename length', () => {
      const longFilename = 'a'.repeat(500) + '.txt';
      const sanitized = sanitizeFilename(longFilename);

      expect(sanitized.length).toBeLessThanOrEqual(255);
    });

    it('should provide default filename for empty input', () => {
      const emptyInputs = ['', '...', '///'];

      for (const input of emptyInputs) {
        const sanitized = sanitizeFilename(input);
        expect(sanitized.length).toBeGreaterThan(0);
      }
    });
  });
});
