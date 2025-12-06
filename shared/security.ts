/**
 * Security utilities for input sanitization and validation
 */

const DANGEROUS_PROTOCOLS = ['file:', 'javascript:', 'data:', 'vbscript:'];
const MAX_URL_LENGTH = 2048;
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB in bytes

const ALLOWED_FILE_TYPES = {
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
};

/**
 * Sanitize URL input to prevent XSS and other attacks
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    throw new Error('URL must be a string');
  }

  // Trim whitespace
  let sanitized = url.trim();

  // Check length
  if (sanitized.length === 0) {
    throw new Error('URL cannot be empty');
  }

  if (sanitized.length > MAX_URL_LENGTH) {
    throw new Error(`URL exceeds maximum length of ${MAX_URL_LENGTH} characters`);
  }

  // Check for dangerous protocols
  const lowerUrl = sanitized.toLowerCase();
  for (const protocol of DANGEROUS_PROTOCOLS) {
    if (lowerUrl.startsWith(protocol)) {
      throw new Error(`Dangerous protocol detected: ${protocol}`);
    }
  }

  // Ensure URL starts with http:// or https://
  if (!lowerUrl.startsWith('http://') && !lowerUrl.startsWith('https://')) {
    throw new Error('URL must start with http:// or https://');
  }

  // Remove any HTML tags and angle brackets (basic XSS prevention)
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  sanitized = sanitized.replace(/[<>]/g, '');

  // Remove any null bytes
  sanitized = sanitized.replace(/\0/g, '');

  return sanitized;
}

/**
 * Validate file type against allowed types
 */
export function validateFileType(
  mimeType: string,
  expectedType: 'video' | 'audio' | 'image'
): boolean {
  const allowedTypes = ALLOWED_FILE_TYPES[expectedType];
  return allowedTypes.includes(mimeType.toLowerCase());
}

/**
 * Validate file size
 */
export function validateFileSize(sizeInBytes: number): boolean {
  return sizeInBytes > 0 && sizeInBytes <= MAX_FILE_SIZE;
}

/**
 * Get maximum allowed file size
 */
export function getMaxFileSize(): number {
  return MAX_FILE_SIZE;
}

/**
 * Sanitize filename to prevent directory traversal
 */
export function sanitizeFilename(filename: string): string {
  if (typeof filename !== 'string') {
    throw new Error('Filename must be a string');
  }

  // Remove path separators and parent directory references
  let sanitized = filename
    .replace(/\.\./g, '')
    .replace(/[/\\]/g, '')
    .replace(/^\.+/, '');

  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*\x00-\x1f]/g, '');

  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.split('.').pop() || '';
    const nameWithoutExt = sanitized.substring(0, sanitized.length - ext.length - 1);
    sanitized = nameWithoutExt.substring(0, 250 - ext.length) + '.' + ext;
  }

  // Ensure filename is not empty after sanitization
  if (sanitized.length === 0) {
    sanitized = 'download';
  }

  return sanitized;
}

/**
 * Validate that URL is from a public endpoint (no authentication required)
 */
export function isPublicUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);

    // Check for authentication in URL (username or password)
    if (urlObj.username || urlObj.password) {
      return false;
    }

    // Check if @ appears before the first slash (indicates auth in hostname)
    const urlWithoutProtocol = url.replace(/^https?:\/\//, '');
    const firstSlashIndex = urlWithoutProtocol.indexOf('/');
    const hostPart = firstSlashIndex === -1 
      ? urlWithoutProtocol 
      : urlWithoutProtocol.substring(0, firstSlashIndex);
    
    if (hostPart.includes('@')) {
      return false;
    }

    // Check for localhost or private IP ranges
    const hostname = urlObj.hostname.toLowerCase();

    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname === '[::1]'
    ) {
      return false;
    }

    // Check for private IP ranges (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    if (
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.')
    ) {
      return false;
    }

    // Check 172.16.0.0 - 172.31.255.255 range
    const parts = hostname.split('.');
    if (parts.length === 4 && parts[0] === '172') {
      const secondOctet = parseInt(parts[1], 10);
      if (secondOctet >= 16 && secondOctet <= 31) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Comprehensive security validation for URLs
 */
export function validateSecureUrl(url: string): {
  valid: boolean;
  error?: string;
  sanitized?: string;
} {
  try {
    // Sanitize URL
    const sanitized = sanitizeUrl(url);

    // Check if public
    if (!isPublicUrl(sanitized)) {
      return {
        valid: false,
        error: 'URL must be a public endpoint without authentication',
      };
    }

    return {
      valid: true,
      sanitized,
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid URL',
    };
  }
}

/**
 * Security configuration
 */
export const SECURITY_CONFIG = {
  MAX_URL_LENGTH,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  DANGEROUS_PROTOCOLS,
} as const;
