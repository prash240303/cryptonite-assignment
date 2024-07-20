'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LineChart from './LineChart';
import TrendingMarket from './TrendingMarket';
import PublicCompaniesHoldings from '@/components/PublicCompaniesHoldings';
import { fetchGlobalMarketCap, fetchPublicCompaniesHoldings } from '@/redux/slices/productPage';
import { setTheme } from '@/redux/slices/theme';
import { AppDispatch, RootState } from '@/redux/store';
import RecentlyViewed from '@/components/RecentlyViewed';
import WatchList from './watchList';

const HomeContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const dm = useSelector((state: RootState) => state.theme.isDarkMode);
  const { publicCompaniesHoldings } = useSelector((state: RootState) => state.home);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('isDarkMode');
      setIsDarkMode(savedTheme !== null ? JSON.parse(savedTheme) : true);
      if (savedTheme !== null) {
        dispatch(setTheme(JSON.parse(savedTheme)));
      }
    }
  }, [dispatch, dm]);

  useEffect(() => {
    dispatch(fetchGlobalMarketCap());
    dispatch(fetchPublicCompaniesHoldings());
  }, [dispatch]);

  return (
    <div className='w-full flex flex-col lg:flex-row gap-5'>
      {/* Main content */}
      <div className='w-full lg:w-3/5 flex flex-col gap-5'>
        <div className={`flex items-center rounded-lg ${isDarkMode ? "bg-gray-950 text-white" : "bg-gray-100 border-gray-400 text-black"}`}>
          <LineChart />
        </div>
        <TrendingMarket />
        <PublicCompaniesHoldings companies={publicCompaniesHoldings} />
      </div>

      {/* Sidebar */}
      <div className='w-full lg:w-2/5 flex flex-col gap-5'>
        <div className={`p-2 lg:p-3 border-2 ${isDarkMode ? "bg-gray-950 border-gray-600 text-white" : "bg-gray-100 border-gray-400 text-black"} rounded-lg`}>
          <h2 className="text-lg lg:text-xl font-semibold mb-4">Watchlist</h2>
          <WatchList />
        </div>
        <div className={`p-2 lg:p-3 border-2 ${isDarkMode ? "bg-gray-950 border-gray-600 text-white" : "bg-gray-100 border-gray-400 text-black"} rounded-lg`}>
          <RecentlyViewed />
        </div>
      </div>
    </div>
  );
}

export default HomeContent;