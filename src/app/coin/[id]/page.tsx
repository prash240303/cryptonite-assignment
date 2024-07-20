'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchCoinDetails, addToRecentlyViewed } from '@/redux/slices/coin';
import { fetchHistoricalData } from '@/redux/slices/historyData';
import CoinBarChart from '@/components/CoinBarChart';
import { setTheme } from '@/redux/slices/theme';
import CoinPriceChart from '@/components/CoinPriceChart';
import Store, { RootState } from '@/redux/store';

interface MarketData {
  current_price: { usd: number };
  market_cap: { usd: number };
  total_supply: number;
  max_supply: number;
  total_volume: { usd: number };
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
}

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: { thumb: string };
  market_data: MarketData;
  description: { en: string };
}

interface HistoricalData {
  name: string;
  // Add other properties as needed
}

const CoinPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<typeof Store.dispatch>();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const coinData = useSelector((state: RootState) => state.coins.coinDetails[id as string] as unknown as CoinData | undefined);
  const historicalData = useSelector((state: RootState) =>
    state.historicalData.data.find((data: HistoricalData) => data.name === id)
  );
  const themeMode = useSelector((state: RootState) => state.theme.isDarkMode);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('isDarkMode');
      setIsDarkMode(savedTheme !== null ? JSON.parse(savedTheme) : true);
      if (savedTheme !== null) {
        dispatch(setTheme(JSON.parse(savedTheme)));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchCoinDetails(id))
        .then((action: any) => {
          if (action.payload) {
            dispatch(addToRecentlyViewed(action.payload));
          }
        })
        .catch((err: Error) => {
          setError(`Failed to fetch coin details: ${err.message}`);
        });
      dispatch(fetchHistoricalData()).catch((err: Error) => {
        setError(`Failed to fetch historical data: ${err.message}`);
      });
    }
  }, [dispatch, id]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (coinData && coinData.market_data) {
      const dragData = {
        id: coinData.id,
        name: coinData.name,
        symbol: coinData.symbol,
        image: coinData.image?.thumb,
        current_price: coinData.market_data.current_price?.usd,
        price_change_percentage_24h: coinData.market_data.price_change_percentage_24h,
        market_cap: coinData.market_data.market_cap?.usd,
      };
      e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!coinData || !coinData.market_data) {
    return <div>Loading... (If this persists, there might be an issue with the data)</div>;
  }

  const { market_data } = coinData;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex flex-col gap-5 mx-auto border-gray-400">
      <div className={`p-2 md:p-3 border-2 ${isDarkMode ? "bg-gray-950 border-gray-600 text-white" : "bg-gray-100 border-gray-400 text-black"} rounded-lg`}>
        <h1 className="text-lg md:text-2xl text-center mb-8 font-semibold uppercase">{id}</h1>
        {historicalData ? <CoinPriceChart isDarkMode={isDarkMode} coinId={id} historicalData={historicalData} /> : <div>Loading historical data...</div>}
      </div>
      <div className={`p-2 md:p-3 border-2 ${isDarkMode ? "bg-gray-950 border-gray-600 text-white" : "bg-gray-100 border-gray-400 text-black"} rounded-lg`}>
        <h2 className="text-lg md:text-2xl mb-4 text-center font-semibold">Price Change Percentages</h2>
        <CoinBarChart coinData={coinData} />
      </div>

      <div className='flex md:flex-row flex-col gap-5 justify-between'>
        <div className={`w-full md:w-[48%] p-2 md:p-3 border-2 ${isDarkMode ? "bg-gray-950 border-gray-600 text-white" : "bg-gray-100 border-gray-400 text-black"} rounded-lg text-xs md:text-sm`}>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">Fundamentals</h2>
          <p className='py-1'><strong>Market Cap:</strong> {market_data.market_cap?.usd?.toLocaleString() ?? 'N/A'}</p>
          <p className='py-1'><strong>Total Supply:</strong> {market_data.total_supply?.toLocaleString() ?? 'N/A'}</p>
          <p className='py-1'><strong>Max Supply:</strong> {market_data.max_supply?.toLocaleString() ?? 'N/A'}</p>
        </div>
        <div className={`w-full md:w-[48%] p-2 md:p-3 border-2 ${isDarkMode ? "bg-gray-950 border-gray-600 text-white" : "bg-gray-100 border-gray-400 text-black"} rounded-lg text-xs md:text-sm`}>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">Coin Information</h2>
          <p className='py-1'><strong>Symbol:</strong> {coinData.symbol}</p>
          <p className='py-1'><strong>Current Price:</strong> ${market_data?.current_price?.usd?.toLocaleString() ?? 'N/A'}</p>
          <p className='py-1'><strong>Total Volume:</strong> ${market_data?.total_volume?.usd?.toLocaleString() ?? 'N/A'}</p>
        </div>
      </div>
      <div className={`p-2 md:p-3 border-2 ${isDarkMode ? "bg-gray-950 border-gray-600 text-white" : "bg-gray-100 border-gray-400 text-black"} rounded-lg mb-5`}>
        <h2 className="text-lg md:text-2xl md:text-left text-center font-semibold mb-4">About {coinData.name}</h2>
        <p className='text-xs md:text-sm md:text-left text-center' dangerouslySetInnerHTML={{ __html: coinData.description?.en ?? 'No description available.' }} />
      </div>
    </div>
  );
};

export default CoinPage;