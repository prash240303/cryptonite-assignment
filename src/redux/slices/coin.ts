import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import { CoinDescription, CoinTypes } from './types/CoinTypes';

interface CoinDetails extends CoinDescription {}

interface CoinsState {
  coins: CoinTypes[];
  coinDetails: Record<string, CoinDetails>;
  recentlyViewed: CoinTypes[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  trendingCoins: CoinTypes[];
  trendingStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  trendingError: string | null;
}

const initialState: CoinsState = {
  coins: [],
  coinDetails: {},
  recentlyViewed: [],
  status: 'idle',
  error: null,
  trendingCoins: [],
  trendingStatus: 'idle',
  trendingError: null,
};

export const fetchCoins = createAsyncThunk<CoinTypes[], number>(
  'coins/fetchCoins',
  async (page) => {
    const response = await api.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page,
        sparkline: false,
      },
    });
    return response.data;
  }
);

export const fetchCoinDetails = createAsyncThunk<CoinDetails, string>(
  'coins/fetchCoinDetails',
  async (id) => {
    const response = await api.get(`https://api.coingecko.com/api/v3/coins/${id}`);
    return response.data;
  }
);

export const addToRecentlyViewed = createAsyncThunk<CoinTypes[], CoinTypes, { state: { coins: CoinsState } }>(
  'coins/addToRecentlyViewed',
  async (coin, { getState }) => {
    const { coins } = getState();
    let recentlyViewed = [...coins.recentlyViewed];

    recentlyViewed = recentlyViewed.filter(c => c.id !== coin.id);
    recentlyViewed.unshift(coin);
    recentlyViewed = recentlyViewed.slice(0, 5);

    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));

    return recentlyViewed;
  }
);

export const fetchTrendingCoins = createAsyncThunk<CoinTypes[], void>(
  'coins/fetchTrendingCoins',
  async () => {
    const response = await api.get('https://api.coingecko.com/api/v3/search/trending');
    return response.data.coins.map((item: { item: CoinTypes }) => item.item);
  }
);

const CoinsLogic = createSlice({
  name: 'coins',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCoins.fulfilled, (state, action: PayloadAction<CoinTypes[]>) => {
        state.status = 'succeeded';
        state.coins = action.payload;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchCoinDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCoinDetails.fulfilled, (state, action: PayloadAction<CoinDetails>) => {
        state.status = 'succeeded';
        state.coinDetails[action.payload.id] = action.payload;
      })
      .addCase(fetchCoinDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addToRecentlyViewed.fulfilled, (state, action: PayloadAction<CoinTypes[]>) => {
        state.recentlyViewed = action.payload;
      })
      .addCase(fetchTrendingCoins.pending, (state) => {
        state.trendingStatus = 'loading';
      })
      .addCase(fetchTrendingCoins.fulfilled, (state, action: PayloadAction<CoinTypes[]>) => {
        state.trendingStatus = 'succeeded';
        state.trendingCoins = action.payload;
      })
      .addCase(fetchTrendingCoins.rejected, (state, action) => {
        state.trendingStatus = 'failed';
        state.trendingError = action.error.message || null;
      });
  },
});

export default CoinsLogic.reducer;
