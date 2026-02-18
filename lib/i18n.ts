/**
 * Creates a path without locale prefix
 * @param path - Path (e.g., '/products')
 * @returns Same path without locale (e.g., '/products')
 */
export function getLocalizedPath(path: string): string {
  // Remove leading slash if present, then add it back
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return cleanPath;
}

/**
 * Removes locale from path (for backward compatibility)
 * @param path - Path (e.g., '/tr/products' or '/products')
 * @returns Path without locale (e.g., '/products')
 */
export function removeLocaleFromPath(path: string): string {
  const match = path.match(/^\/[a-z]{2}(\/.*)?$/);
  if (match) {
    return match[1] || '/';
  }
  return path;
}
