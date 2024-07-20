// lib/cache.ts
interface CachedItem<T> {
  data: T;
  expiry: number;
}

const cache: Record<string, CachedItem<any>> = {};
const DEFAULT_EXPIRATION = 15 * 60 * 1000; // 15 minutes

export const getCachedData = <T>(key: string): T | null => {
  const cached = cache[key];
  if (!cached) {
    return null;
  }
  if (Date.now() > cached.expiry) {
    delete cache[key];
    return null;
  }
  return cached.data as T;
};

export const setCachedData = <T>(key: string, data: T, maxAge: number = DEFAULT_EXPIRATION): void => {
  cache[key] = {
    data,
    expiry: Date.now() + maxAge,
  };
};
