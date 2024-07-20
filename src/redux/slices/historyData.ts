import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import { getCachedData, setCachedData } from '@/utils/cache'; // Adjust the import path as needed

const API_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = 'CG-Lr8jUWFFKeHA2kYui3e8Bkhh';

interface HistoricalDataState {
  data: { name: string; prices: number[][] }[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: HistoricalDataState = {
  data: [],
  status: 'idle',
  error: null,
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchHistoricalData = createAsyncThunk(
  'historicalData/fetchHistoricalData',
  async (_, { rejectWithValue }) => {
    const coins = ['bitcoin', 'ethereum', 'binancecoin'];
    const days = '30';
    const cacheKey = `historicalData-${days}`;

    // Check cache first
    const cachedData = getCachedData<{ name: string; prices: number[][] }[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const fetchCoinData = async (coin: string, retries = 3): Promise<{ name: string; prices: number[][] }> => {
      try {
        const response = await api.get(`${API_URL}/coins/${coin}/market_chart`, {
          params: {
            vs_currency: 'usd',
            days: days,
            api_key: API_KEY,
          },
        });
        return { name: coin, prices: response.data.prices };
      } catch (error: any) {
        if (error.response && error.response.status === 429 && retries > 0) {
          const delay = 2 ** (3 - retries) * 1000; // 1s, 2s, 4s
          console.log(`Rate limited for ${coin}. Retrying in ${delay}ms...`);
          await wait(delay);
          return fetchCoinData(coin, retries - 1);
        }
        throw error;
      }
    };

    try {
      const data = await Promise.all(coins.map(coin => fetchCoinData(coin)));
      setCachedData(cacheKey, data);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch historical data');
    }
  }
);

const HistoryDataSlice = createSlice({
  name: 'historicalData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistoricalData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHistoricalData.fulfilled, (state, action: PayloadAction<{ name: string; prices: number[][] }[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchHistoricalData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Unknown error occurred';
      });
  },
});

export default HistoryDataSlice.reducer;