import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Coin {
  id: string;
  name: string;
}

type WatchlistState = Coin[];

const initialState: WatchlistState = [];

const WatchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    setWatchlist: (state, action: PayloadAction<Coin[]>) => {
      return action.payload;
    },
    addToWatchlist: (state, action: PayloadAction<Coin>) => {
      if (!state.some(coin => coin.id === action.payload.id)) {
        state.push(action.payload);
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      return state.filter(coin => coin.id !== action.payload);
    },
  },
});

export const { setWatchlist, addToWatchlist, removeFromWatchlist } = WatchlistSlice.actions;
export default WatchlistSlice.reducer;
