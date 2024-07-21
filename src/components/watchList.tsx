'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { addToWatchlist, setWatchlist } from '@/redux/slices/watchListSlice';
import { addToRecentlyViewed } from '@/redux/slices/coinFunctionSlice';
import { AppDispatch, RootState } from '@/redux/store';
import Image from 'next/image';

interface WatchlistCoin {
  coin_id: number;
  id: string;
  name: string;
  symbol: string;
  large: string;
  market_cap_rank: number;
  data: {
    price: number;
    price_change_percentage_24h: {
      usd: number;
    };
    market_cap: number ;
  };
}

const WatchList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const watchlist = useSelector((state: RootState) => state.watchlist) as WatchlistCoin[];
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]') as WatchlistCoin[];
    dispatch(setWatchlist(storedWatchlist));
  }, [dispatch]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const coinData = JSON.parse(e.dataTransfer.getData('text/plain')) as WatchlistCoin;
    if (
      !watchlist.some((coin) => coin.id === coinData.id) &&
      coinData.id &&
      coinData.name &&
      coinData.symbol &&
      coinData.large &&
      coinData.data?.price &&
      coinData.data?.price_change_percentage_24h?.usd &&
      coinData.data?.market_cap
    ) {
      dispatch(addToWatchlist(coinData));
      dispatch(addToRecentlyViewed(coinData));
      const newWatchlist = [...watchlist, coinData];
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));

      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]') as WatchlistCoin[];
      const updatedRecentlyViewed = [coinData, ...recentlyViewed.filter((coin) => coin.id !== coinData.id)].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
    }
  };

  const formatNumber = (value: number | string | undefined): { formatted: string; full: string } => {
    if (value === undefined || value === null) return { formatted: 'N/A', full: 'N/A' };
    
    // If the value is a string (e.g., "$18,440,103,251"), remove the "$" and "," characters
    const num = typeof value === 'string' ? parseFloat(value.replace(/[$,]/g, '')) : value;
    
    if (isNaN(num)) return { formatted: 'N/A', full: 'N/A' };
    
    const full = `$${num.toFixed(6)}`;
    
    let formatted: string;
    if (num >= 1e9) formatted = `$${(num / 1e9).toFixed(2)}B`;
    else if (num >= 1e6) formatted = `$${(num / 1e6).toFixed(2)}M`;
    else if (num >= 1e3) formatted = `$${(num / 1e3).toFixed(2)}K`;
    else formatted = `$${num.toFixed(2)}`;
    
    return { formatted, full };
  };

  if (watchlist.length === 0) {
    return (
      <div
        className={`p-3 text-xs border-2 rounded-lg min-h-[200px] flex items-center justify-center`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        Drag and drop coins here to add to your watchlist
      </div>
    );
  }

  const displayedCoins = showAll ? watchlist : watchlist.slice(0, 5);
  console.log('market cap', displayedCoins[0]?.data?.market_cap);
  console.log('price', displayedCoins[0]?.data?.price);

  return (
    <div
      className="p-3 text-xs border-2 rounded-lg"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-500 uppercase leading-normal border-b-[1px] border-gray-800">
              <th className="py-2 md:px-3 px-6 text-left">Token</th>
              <th className="py-2 px-3 text-right">Last Price</th>
              <th className="py-2 px-3 text-right">24h Change</th>
              <th className="py-2 px-3 text-right">Market Cap</th>
            </tr>
          </thead>
          <tbody className="text-gray-500 font-light">
            {displayedCoins.map((coin) => {
              const price = formatNumber(coin.data?.price);
              const marketCap = formatNumber(coin.data?.market_cap);
              return (
                <tr key={coin.id} className="cursor-pointer">
                  <td className="py-2 px-3 text-left whitespace-nowrap">
                    <Link href={`/coin/${coin.id}`} className="flex items-center group">
                      {coin.large && (
                        <Image
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded-full border border-red-400 mr-2"
                          src={coin.large}
                          alt={coin.name || 'Coin image'}
                        />
                      )}
                      <span className="font-medium text-blue-400 group-hover:text-blue-300">
                        {coin.symbol?.toUpperCase() || 'N/A'}
                      </span>
                    </Link>
                  </td>
                  <td className="py-2 px-3 text-right" title={price.full}>
                    {price.formatted}
                  </td>
                  <td className={`py-2 px-3 text-right ${coin.data?.price_change_percentage_24h?.usd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {coin.data?.price_change_percentage_24h?.usd !== undefined ? `${coin.data.price_change_percentage_24h.usd.toFixed(2)}%` : 'N/A'}
                  </td>
                  <td className="py-2 px-3 text-right" title={marketCap.full}>
                    {marketCap.formatted}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {watchlist.length > 5 && (
        <div className="text-center mt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs"
          >
            {showAll ? 'Show Less' : 'View More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default WatchList;