/**
 * URL Validation Utility
 * Validates URLs and handles edge cases like empty strings, malformed URLs, and special protocols
 */

/**
 * Validates if a given string is a valid URL
 * @param url - The URL string to validate
 * @returns true if the URL is valid, false otherwise
 */
export function validateURL(url: string): boolean {
  // Handle empty strings
  if (!url || url.trim() === '') {
    return false;
  }

  // Trim whitespace
  const trimmedUrl = url.trim();

  // Block dangerous protocols
  const dangerousProtocols = ['file:', 'javascript:', 'data:', 'vbscript:'];
  const lowerUrl = trimmedUrl.toLowerCase();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return false;
    }
  }

  // URL regex pattern that matches standard HTTP/HTTPS URLs
  // This pattern checks for:
  // - Optional protocol (http:// or https://)
  // - Domain name with at least one dot
  // - Optional port
  // - Optional path (including special chars like @), query, and fragment
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.\-@]*)*\/?(\?[^\s]*)?(#[^\s]*)?$/i;

  // Check if URL matches the pattern
  if (!urlPattern.test(trimmedUrl)) {
    return false;
  }

  // Additional validation using URL constructor
  try {
    // Add protocol if missing for URL constructor
    const urlWithProtocol = trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')
      ? trimmedUrl
      : `https://${trimmedUrl}`;
    
    const urlObject = new URL(urlWithProtocol);
    
    // Ensure protocol is http or https
    if (urlObject.protocol !== 'http:' && urlObject.protocol !== 'https:') {
      return false;
    }

    // Ensure hostname is not empty and contains at least one dot
    if (!urlObject.hostname || !urlObject.hostname.includes('.')) {
      return false;
    }

    return true;
  } catch (error) {
    // URL constructor throws for invalid URLs
    return false;
  }
}
