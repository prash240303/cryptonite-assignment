import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, RawAxiosRequestHeaders, AxiosHeaders } from 'axios';
import { getCachedData, setCachedData } from './cache';

const API_KEY = process.env.API_KEY;

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  } as RawAxiosRequestHeaders,
});

// Request interceptor
api.interceptors.request.use(async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  if (config.url) {
    const cachedResponse = getCachedData(config.url);
    if (cachedResponse) {
      const newConfig: InternalAxiosRequestConfig = {
        ...config,
        headers: new AxiosHeaders({
          ...config.headers?.toJSON(),
          'X-Cache': 'HIT',
        }),
      };
      return Promise.resolve(newConfig);
    }
    // Append API key to the query parameters
    if (!config.params) {
      config.params = {};
    }
    config.params.x_cg_demo_api_key = API_KEY;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use((response: AxiosResponse) => {
  if (response.config.url) {
    setCachedData(response.config.url, response);
  }
  return response;
}, (error) => {
  return Promise.reject(error);
});

export default api;
