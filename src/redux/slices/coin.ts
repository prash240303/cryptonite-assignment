// slices/coin.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import { CoinTypes } from './types/CoinTypes';
interface CoinProps extends CoinTypes { }

interface CoinDetails extends CoinProps { }

interface CoinsState {
  coins: CoinProps[];
  coinDetails: Record<string, CoinDetails>;
  recentlyViewed: CoinProps[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  trendingCoins: CoinProps[];
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

export const fetchCoins = createAsyncThunk<CoinProps[], number>(
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

export const fetchCoinDetails = createAsyncThunk<CoinProps, string>(
  'coins/fetchCoinDetails',
  async (id) => {
    const response = await api.get(`https://api.coingecko.com/api/v3/coins/${id}`);
    const coinData = response.data;
    
    // Transform the API response to match CoinProps
    return {
      id: coinData.id,
      name: coinData.name,
      symbol: coinData.symbol,
      large: coinData.image.large,
      data: {
        price: coinData.market_data.current_price.usd,
        price_change_percentage_24h: {
          usd: coinData.market_data.price_change_percentage_24h
        },
        market_cap: coinData.market_data.market_cap.usd
      },
      image: coinData.image.thumb,
      market_cap_rank: coinData.market_cap_rank,
      genesis_date: coinData.genesis_date
    };
  }
);

export const addToRecentlyViewed = createAsyncThunk<CoinProps[], CoinProps, { state: { coins: CoinsState } }>(
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

export const fetchTrendingCoins = createAsyncThunk<CoinProps[], void>(
  'coins/fetchTrendingCoins',
  async () => {
    const response = await api.get('https://api.coingecko.com/api/v3/search/trending');
    return response.data.coins.map((item: { item: CoinProps }) => item.item);
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
      .addCase(fetchCoins.fulfilled, (state, action: PayloadAction<CoinProps[]>) => {
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
      .addCase(addToRecentlyViewed.fulfilled, (state, action: PayloadAction<CoinProps[]>) => {
        state.recentlyViewed = action.payload;
      })
      .addCase(fetchTrendingCoins.pending, (state) => {
        state.trendingStatus = 'loading';
      })
      .addCase(fetchTrendingCoins.fulfilled, (state, action: PayloadAction<CoinProps[]>) => {
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
