import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface MarketCapData {
  date: string;
  marketCap: number;
}

interface CompanyHolding {
  name: string;
  bitcoin: number;
  ethereum: number;
}

interface HomeState {
  globalMarketCap: MarketCapData[];
  publicCompaniesHoldings: CompanyHolding[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: HomeState = {
  globalMarketCap: [],
  publicCompaniesHoldings: [],
  status: 'idle',
  error: null,
};

export const fetchGlobalMarketCap = createAsyncThunk<MarketCapData[], void, { rejectValue: string }>(
  'home/fetchGlobalMarketCap',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/global');
      const marketCapData = response.data.data.total_market_cap;

      const formattedData: MarketCapData[] = Object.entries(marketCapData).map(([date, value]) => ({
        date: new Date(date).toISOString().split('T')[0],
        marketCap: value as number,
      }));

      return formattedData;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || 'An error occurred');
    }
  }
);

export const fetchPublicCompaniesHoldings = createAsyncThunk<CompanyHolding[], void, { rejectValue: string }>(
  'home/fetchPublicCompaniesHoldings',
  async (_, { rejectWithValue }) => {
    try {
      const mockData: CompanyHolding[] = [
        { name: 'MicroStrategy', bitcoin: 129218, ethereum: 0 },
        { name: 'Tesla', bitcoin: 43200, ethereum: 0 },
        { name: 'Galaxy Digital', bitcoin: 16400, ethereum: 140000 },
        { name: 'Square Inc.', bitcoin: 8027, ethereum: 0 },
        { name: 'Marathon Digital', bitcoin: 4813, ethereum: 0 },
      ];

      await new Promise(resolve => setTimeout(resolve, 1000));

      return mockData;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || 'An error occurred');
    }
  }
);

const homePageSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalMarketCap.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGlobalMarketCap.fulfilled, (state, action: PayloadAction<MarketCapData[]>) => {
        state.status = 'succeeded';
        state.globalMarketCap = action.payload;
      })
      .addCase(fetchGlobalMarketCap.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      })
      .addCase(fetchPublicCompaniesHoldings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPublicCompaniesHoldings.fulfilled, (state, action: PayloadAction<CompanyHolding[]>) => {
        state.status = 'succeeded';
        state.publicCompaniesHoldings = action.payload;
      })
      .addCase(fetchPublicCompaniesHoldings.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      });
  }
});

export default homePageSlice.reducer;
