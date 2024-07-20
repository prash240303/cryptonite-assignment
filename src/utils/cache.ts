const Duration = 2 * 60 * 1000; // eak ghanta 

interface CachedItem<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CachedItem<any>>();


export const getCachedData = <T>(key: string): T | null => {
  const cachedItem = cache.get(key);
  if (cachedItem && Date.now() - cachedItem.timestamp < Duration) {
    return cachedItem.data as T;
  }
  return null;
};

//set data witha a key and value, and a timestamp
export const setCachedData = <T>(key: string, data: T): void => {
  cache.set(key, { data, timestamp: Date.now() });
};
