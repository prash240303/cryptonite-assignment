'use client';
import React, { useEffect, useState, DragEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { fetchCoins } from '@/redux/slices/coinFunctionSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { CoinTypes } from '@/redux/slices/types/CoinTypes';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ExtendedCoinTypes extends CoinTypes {
  market_cap?: number;
  current_price?: number;
  price_change_percentage_24h?: number;
}

const ExplorePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { coins, status, error } = useSelector((state: RootState) => state.coins);
  const [page, setPage] = useState<number>(1);
  const { theme } = useTheme();

  useEffect(() => {
    dispatch(fetchCoins(page));
  }, [dispatch, page]);

  useEffect(() => {
    console.log('Coins data:', coins); 
  }, [coins]);

  const handleDragStart = (e: DragEvent<HTMLTableRowElement>, coin: ExtendedCoinTypes) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(coin));
  };

  const formatMarketCap = (value: number | undefined): string => {
    if (value === undefined) return 'N/A';
    if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
    return value.toLocaleString();
  };

  const formatPercentage = (value: number | undefined): string => {
    if (value === undefined) return 'N/A';
    return value.toFixed(2) + '%';
  };

  const formatPrice = (value: number | undefined): string => {
    if (value === undefined) return 'N/A';
    return '$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (status === 'loading') {
    return <div className={`p-3 border-[2px] max-w-6xl mx-auto mt-12 rounded-lg theme-transition ${theme === 'dark' ? "bg-gray-800 border-gray-600" : "bg-gray-100 border-gray-400"}`}>Loading...</div>;
  }

  if (status === 'failed') {
    return <div className={`p-3 border-[2px] max-w-6xl mx-auto mt-12 rounded-lg theme-transition ${theme === 'dark' ? "bg-gray-800 border-gray-600" : "bg-gray-100 border-gray-400"}`}>Error: {error}</div>;
  }

  return (
    <div className={`p-3 text-xs max-w-5xl mx-auto mt-12 border-[2px] rounded-lg theme-transition ${theme === 'dark' ? "bg-gray-800 border-gray-600 text-gray-200" : "bg-gray-100 border-gray-400 text-gray-900"}`}>
      <h1 className="text-xl font-bold md:text-left text-center mb-4">Explore</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`text-gray-500 uppercase leading-normal border-b-[1px] ${theme === 'dark' ? "border-gray-600" : "border-gray-800"}`}>
              <th className="py-2 px-3 text-left">Token</th>
              <th className="py-2 px-3 text-right">Market Cap</th>
              <th className="py-2 px-3 text-right">Price</th>
              <th className="py-2 px-3 text-right">Today</th>
            </tr>
          </thead>
          <tbody className={`font-light ${theme === 'dark' ? "text-gray-200" : "text-gray-500"}`}>
            {coins && coins.map((coin: ExtendedCoinTypes) => (
              <tr key={coin.id} draggable onDragStart={(e) => handleDragStart(e, coin)} className={`theme-transition ${theme === 'dark' ? "hover:bg-gray-700" : "hover:bg-gray-200"} cursor-pointer`}>
                <td className="py-2 px-3 text-left whitespace-nowrap">
                  <Link href={`/coin/${coin.id}`} className="flex items-center group">
                    <Image width={24} height={24} className="w-6 h-6 rounded-full mr-2" src={coin.large || '/placeholder.png'} alt={coin.name} />
                    <span className={`font-medium ${theme === 'dark' ? "text-blue-400 group-hover:text-blue-300" : "text-blue-600 group-hover:text-blue-500"}`}>
                      {coin.symbol?.toUpperCase() || 'N/A'}
                    </span>
                  </Link>
                </td>
                <td className="py-2 px-3 text-right">{formatMarketCap(coin.market_cap)}</td>
                <td className="py-2 px-3 text-right">{formatPrice(coin.current_price)}</td>
                <td className={`py-2 px-3 text-right ${(coin.price_change_percentage_24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercentage(coin.price_change_percentage_24h)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pt-2 flex justify-between border-t-[1px] ${theme === 'dark' ? "border-gray-600" : "border-gray-800"}">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`font-bold py-1 px-2 flex items-center rounded text-xs disabled:text-gray-400 ${theme === 'dark' ? "text-gray-300" : "text-gray-700"}`}
        >
          <ArrowLeft className="mr-1" />
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className={`font-bold flex items-center py-1 px-2 rounded text-xs ${theme === 'dark' ? "text-gray-300" : "text-gray-700"}`}
        >
          Next
          <ArrowRight className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default ExplorePage;
