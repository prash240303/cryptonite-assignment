import { configureStore } from '@reduxjs/toolkit';
import coinsReducer from './slices/coins';
import historicalDataReducer from './slices/historyData';
import homeReducer from './slices/productPage';
import watchlistReducer from './slices/watchList';
import themeReducer, { setTheme } from './slices/theme'

const Store = configureStore({
  reducer: {
    coins: coinsReducer,
    home: homeReducer,
    historicalData: historicalDataReducer,
    watchlist: watchlistReducer,
    theme: themeReducer,
  },
});

export default Store;


export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
