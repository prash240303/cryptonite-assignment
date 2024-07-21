'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToRecentlyViewed, fetchCoinDetails } from '@/redux/slices/coinFunctionSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { CoinTypes, RecentlyViewedCoin, CoinDescription } from '@/redux/slices/types/CoinTypes';
import { useTheme } from 'next-themes';
import Image from 'next/image';

// Type guard to check if the coin is RecentlyViewedCoin
function isRecentlyViewedCoin(coin: CoinTypes | RecentlyViewedCoin): coin is RecentlyViewedCoin {
  return 'image' in coin && 'genesis_date' in coin;
}

const RecentlyViewed: React.FC = () => {
  const dispatch= useDispatch <AppDispatch>();
  const [showAll, setShowAll] = useState(false);
  const { theme } = useTheme();
  const { recentlyViewed, coinDetails } = useSelector((state: RootState) => state.coins);

  useEffect(() => {
    const storedRecentlyViewed: (CoinTypes | RecentlyViewedCoin)[] = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    storedRecentlyViewed.filter(isRecentlyViewedCoin).forEach((coin) => dispatch(addToRecentlyViewed(coin)));
  }, [dispatch]);

  useEffect(() => {
    recentlyViewed.forEach((coin) => {
      if (!coinDetails[coin.id]) {
        dispatch(fetchCoinDetails(coin.id));
      }
    });
  }, [recentlyViewed, dispatch, coinDetails]);

  if (recentlyViewed.length === 0) {
    return <div className="text-gray-900 dark:text-white">No recently viewed cryptocurrencies.</div>;
  }

  const displayedCoins = showAll ? recentlyViewed : recentlyViewed.slice(0, 5);

  return (
    <div>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b dark:border-gray-700">
            <th className="py-2 px-4 text-left w-1/4">Token</th>
            <th className="py-2 px-4 text-left w-1/4">Name</th>
            <th className="py-2 px-4 text-right w-1/4">Current Price</th>
            <th className="py-2 px-4 text-right w-1/4">24h Change</th>
          </tr>
        </thead>
        <tbody className="text-gray-500 dark:text-gray-400 font-light">
          {displayedCoins.map((coin: CoinTypes | RecentlyViewedCoin) => {
            const currentData = coinDetails[coin.id] as CoinDescription | undefined;
            return (
              <tr key={coin.id} className="border-b dark:border-gray-700">
                <td className="py-2 px-4 text-left">
                  <div className="flex items-center">
                    {isRecentlyViewedCoin(coin) && coin.image && (
                      <Image src={coin.image} alt={coin.name} width={24} height={24} className="mr-2" />
                    )}
                    {!isRecentlyViewedCoin(coin) && coin.large && (
                      <Image src={coin.large} alt={coin.name} width={24} height={24} className="mr-2" />
                    )}
                    {coin.symbol.toUpperCase()}
                  </div>
                </td>
                <td className="py-2 px-4 text-left">{coin.name}</td>
                <td className="py-2 px-4 text-right">
                  {currentData && currentData.market_data && currentData.market_data.current_price
                    ? `$${currentData.market_data.current_price.usd.toLocaleString()}`
                    : 'Loading...'}
                </td>
                <td className={`py-2 px-4 text-right ${
                  currentData && currentData.market_data && currentData.market_data.price_change_percentage_24h >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}>
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
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs mt-2"
        >
          {showAll ? 'Show Less' : 'View More'}
        </button>
      )}
    </div>
  );
};

export default RecentlyViewed;