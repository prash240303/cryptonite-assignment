'use client';
import React, { useEffect, useState, DragEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { fetchCoins } from '@/redux/slices/coinFunctionSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { CoinTypes } from '@/redux/slices/types/CoinTypes';
import Image from 'next/image';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface ExtendedCoinTypes extends CoinTypes {
  market_cap?: number;
  current_price?: number;
  price_change_percentage_24h?: number;
}

const ExplorePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { coins, status, error } = useSelector((state: RootState) => state.coins);
  const [page, setPage] = useState<number>(1);
  const totalPages = 100; // Replace with actual total pages

  useEffect(() => {
    dispatch(fetchCoins(page));
  }, [dispatch, page]);

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
    return <div className="p-3 border-[2px] max-w-6xl mx-auto mt-12 rounded-lg border-gray-400 bg-gray-100 dark:border-gray-800 dark:bg-neutral-950">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="p-3 border-[2px] max-w-6xl mx-auto mt-12 rounded-lg border-gray-400 bg-gray-100 dark:border-gray-600 dark:bg-neutral-950">Error: {error}</div>;
  }

  const getPageNumbers = () => {
    let pages: (number | string)[] = [];
    if (totalPages <= 5) {
      pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    } else {
      const start = Math.max(1, page - 2);
      const end = Math.min(totalPages, page + 2);

      if (start > 1) pages.push(1);
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      if (end < totalPages) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="p-3 text-xs max-w-5xl mx-auto mt-12 border-[2px] rounded-lg border-gray-400 bg-gray-100 text-gray-900 dark:border-gray-600 dark:bg-neutral-950 dark:text-gray-200">
      <h1 className="text-xl font-bold md:text-left text-center mb-4">Explore</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-500 uppercase leading-normal border-b-[1px] border-gray-800 dark:border-gray-600">
              <th className="py-2 px-3 text-left">Token</th>
              <th className="py-2 px-3 text-right">Market Cap</th>
              <th className="py-2 px-3 text-right">Price</th>
              <th className="py-2 px-3 text-right">Today</th>
            </tr>
          </thead>
          <tbody className="font-light text-gray-500 dark:text-gray-200">
            {coins && coins.map((coin: ExtendedCoinTypes) => (
              <tr key={coin.id} draggable onDragStart={(e) => handleDragStart(e, coin)} className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                <td className="py-2 px-3 text-left whitespace-nowrap">
                  <Link href={`/coin/${coin.id}`} className="flex items-center group">
                    <Image width={24} height={24} className="w-6 h-6 rounded-full mr-2" src={coin.large || '/placeholder.png'} alt={coin.name} />
                    <span className="font-medium text-blue-600 group-hover:text-blue-500 dark:text-blue-400 dark:group-hover:text-blue-300">
                      {coin.symbol?.toUpperCase() || 'N/A'}
                    </span>
                  </Link>
                </td>
                <td className="py-2 px-3 text-right">{formatMarketCap(coin.market_cap)}</td>
                <td className="py-2 px-3 text-right">{formatPrice(coin.current_price)}</td>
                <td className={`py-2 px-3 text-right ${coin.price_change_percentage_24h && coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercentage(coin.price_change_percentage_24h)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) {
                    setPage((prev) => Math.max(prev - 1, 1));
                  }
                }}
                className={page === 1 ? 'cursor-not-allowed opacity-50' : ''}
              />
            </PaginationItem>
            {getPageNumbers().map((pageNumber, index) => (
              <PaginationItem key={index}>
                {pageNumber === '...' ? (
                  <PaginationLink href="#" className="cursor-default">
                    {pageNumber}
                  </PaginationLink>
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={page === pageNumber}
                    onClick={(e) => {
                      e.preventDefault();
                      // Ensure pageNumber is a number before setting it
                      if (typeof pageNumber === 'number') {
                        setPage(pageNumber);
                      }
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) {
                    setPage((prev) => Math.min(prev + 1, totalPages));
                  }
                }}
                className={page === totalPages ? 'cursor-not-allowed opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ExplorePage;
