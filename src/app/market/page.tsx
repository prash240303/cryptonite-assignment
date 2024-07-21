'use client';

import React, { useEffect, useState, DragEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { fetchCoins } from '@/redux/slices/coinFunctionSlice';
import { AppDispatch, RootState } from '@/redux/store'; // Adjust the path based on your project structure
import { CoinTypes } from '@/redux/slices/types/CoinTypes';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';

const ExplorePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { coins, status, error } = useSelector((state: RootState) => state.coins);
  const [page, setPage] = useState<number>(1);
  const { theme } = useTheme();

  useEffect(() => {
    dispatch(fetchCoins(page));
  }, [dispatch, page]);

  const handleDragStart = (e: DragEvent<HTMLTableRowElement>, coin: CoinTypes) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(coin));
  };

  const formatMarketCap = (value: number): string => {
    if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
    return value.toLocaleString();
  };

  if (status === 'loading') {
    return <div className={`p-3 border-[2px] rounded-lg theme-transition ${theme === 'dark' ? "bg-gray-950 border-gray-600" : "bg-gray-100 border-gray-400"}`}>Loading...</div>;
  }

  if (status === 'failed') {
    return <div className={`p-3 border-[2px] rounded-lg theme-transition ${theme === 'dark' ? "bg-gray-950 border-gray-600" : "bg-gray-100 border-gray-400"}`}>Error: {error}</div>;
  }

  const formatPercentage = (value: number | null | undefined): string => {
    if (value === undefined || value === null) return 'N/A';
    return value.toFixed(2) + '%';
  };

  const formatPrice = (value: number | null | undefined): string => {
    if (value === undefined || value === null) return 'N/A';
    return '$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className={`p-3 text-xs border-[2px] rounded-lg theme-transition ${theme === 'dark' ? "bg-gray-950 border-gray-600" : "bg-gray-100 border-gray-400"}`}>
      <h1 className="text-xl font-bold md:text-left text-center mb-4">Explore</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-500 uppercase leading-normal border-b-[1px] border-gray-800">
              <th className="py-2 px-3 text-left">Token</th>
              <th className="py-2 px-3 text-right">Market Cap</th>
              <th className="py-2 px-3 text-right">Balance</th>
              <th className="py-2 px-3 text-right">Price</th>
              <th className="py-2 px-3 text-right">Today</th>
            </tr>
          </thead>
          <tbody className="text-gray-500 font-light">
            {coins && coins.map((coin: CoinTypes) => (
              <tr key={coin.id} draggable onDragStart={(e) => handleDragStart(e, coin)} className={`theme-transition ${theme === 'dark' ? "hover:bg-gray-900" : "hover:bg-gray-200"} cursor-pointer`}>
                <td className="py-2 px-3 text-left whitespace-nowrap">
                  <Link href={`/coin/${coin.id}`} className="flex items-center group">
                    <Image width={100} height={100} className="w-6 h-6 rounded-full mr-2" src={coin.large} alt={coin.name} />
                    <span className="font-medium text-blue-400 group-hover:text-blue-300">
                      {coin.symbol.toUpperCase()}
                    </span>
                  </Link>
                </td>
                <td className="py-2 px-3 text-right">{coin.data ? formatMarketCap(coin.data.market_cap) : 'N/A'}</td>
                <td className="py-2 px-3 text-right">{coin.data ? `$${coin.data.market_cap?.toLocaleString() || 'N/A'}` : 'N/A'}</td>
                <td className="py-2 px-3 text-right">{coin.data ? formatPrice(coin.data.price) : 'N/A'}</td>
                <td className={`py-2 px-3 text-right ${coin.data?.price_change_percentage_24h?.usd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {coin.data ? formatPercentage(coin.data.price_change_percentage_24h?.usd) : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pt-2 flex justify-between border-t-[1px] border-gray-800">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="font-bold py-1 px-2 flex items-center rounded text-xs disabled:text-gray-400"
        >
          <ArrowLeft />
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="font-bold flex items-center py-1 px-2 rounded text-xs"
        >
          Next
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ExplorePage;
