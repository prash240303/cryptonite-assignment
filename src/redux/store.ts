import { configureStore } from '@reduxjs/toolkit';
import coinsReducer from './slices/coinFunctionSlice';
import historicalDataReducer from './slices/historyDataSlice';
import homeReducer from './slices/homePageSlice';
import watchlistReducer from './slices/watchListSlice';
import themeReducer, { setTheme } from './slices/themeSlice'

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
