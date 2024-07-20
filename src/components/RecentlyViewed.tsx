'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToRecentlyViewed, fetchCoinDetails } from '@/redux/slices/coins';
import { AppDispatch, RootState } from '@/redux/store';
import { CoinTypes } from '@/redux/slices/types/CoinTypes';

const RecentlyViewed: React.FC = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const [showAll, setShowAll] = useState(false);
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const { recentlyViewed, coinDetails } = useSelector((state: RootState) => state.coins);

  useEffect(() => {
    const storedRecentlyViewed: CoinTypes[] = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    storedRecentlyViewed.forEach((coin) => dispatch(addToRecentlyViewed(coin)));
  }, [dispatch]);

  useEffect(() => {
    recentlyViewed.forEach((coin) => {
      if (!coinDetails[coin.id]) {
        dispatch(fetchCoinDetails(coin.id));
      }
    });
  }, [recentlyViewed, dispatch, coinDetails]);

  if (recentlyViewed.length === 0) {
    return <div>No recently viewed cryptocurrencies.</div>;
  }

  const displayedCoins = showAll ? recentlyViewed : recentlyViewed.slice(0, 5);

  return (
    <div>
      <h2 className={`font-semibold text-lg ${isDarkMode ? 'text-white bg-gray-950' : 'text-gray-800'} mb-4`}>Recently Viewed</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="py-2 px-4 ">Token</th>
            <th className="py-2 px-4 ">Name</th>
            <th className="py-2 px-4 ">Current Price</th>
            <th className="py-2 px-4 ">24h Change</th>
          </tr>
        </thead>
        <tbody>
          {displayedCoins.map((coin) => {
            const currentData = coinDetails[coin.id] ;
            return (
              <tr key={coin.id}>
                <td className="py-2 px-4 ">{coin.symbol.toUpperCase()}</td>
                <td className="py-2 px-4 ">{coin.name}</td>
                <td className="py-2 px-4 ">
                  {currentData && currentData.market_data && currentData.market_data.current_price
                    ? `$${currentData.market_data.current_price.usd.toLocaleString()}`
                    : 'Loading...'}
                </td>
                <td className="py-2 px-4 ">
                  {currentData && currentData.market_data && currentData.market_data.price_change_percentage_24h !== undefined
                    ? `${currentData.market_data.price_change_percentage_24h.toFixed(2)}%`
                    : 'Loading...'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {recentlyViewed.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs mt-2"
        >
          {showAll ? 'Show Less' : 'View More'}
        </button>
      )}
    </div>
  );
};

export default RecentlyViewed;