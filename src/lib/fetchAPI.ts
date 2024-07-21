// lib/api.ts
import axios, { AxiosRequestConfig } from 'axios';
import { apiLimiter } from '@/utils/rateLimiter';
import { getCachedData, setCachedData } from './cache';

const API_KEY =  process.env.API_KEY;
const BASE_URL = 'https://api.coingecko.com/api/v3';

const api = axios.create({
  baseURL: BASE_URL,
  params: { x_cg_demo_api_key: API_KEY },
});

export const fetchWithCache = async <T>(
  endpoint: string,
  params: Record<string, any> = {},
  ttl: number = 60000
): Promise<T> => {
  const cacheKey = `${endpoint}${JSON.stringify(params)}`;
  const cachedData = getCachedData<T>(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  await apiLimiter.getToken();

  const response = await api.get<T>(endpoint, { params });
  setCachedData(cacheKey, response.data, ttl);

  return response.data;
};
