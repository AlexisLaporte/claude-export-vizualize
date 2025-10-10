// Compress and encode data for URL sharing
export function encodeForUrl(text: string): string {
  // Use base64 encoding (could add compression later with pako if needed)
  return btoa(encodeURIComponent(text));
}

// Decode data from URL
export function decodeFromUrl(encoded: string): string {
  return decodeURIComponent(atob(encoded));
}

// Generate shareable URL
export function generateShareUrl(text: string): string {
  const encoded = encodeForUrl(text);
  const url = new URL(window.location.href);
  url.searchParams.set('data', encoded);
  return url.toString();
}
