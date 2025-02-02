'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchCoinDetails, addToRecentlyViewed } from '@/redux/slices/coinFunctionSlice';
import { fetchHistoricalData } from '@/redux/slices/historyDataSlice';
import CoinPriceChart from '@/components/CoinPriceChart';
import CoinBarChart from '@/components/CoinBarChart';
import { AppDispatch, RootState } from '@/redux/store';
import { HistoricalData, CoinTypes, CoinDetailsPayload, RecentlyViewedCoin } from '@/redux/slices/types/CoinTypes';
import Image from 'next/image';
import LivePriceService from '@/services/LivePrice';
import PubSub from '@/services/PubSub';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";

const kMB = (value: number): string => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2) + 'B';
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(2) + 'k';
  } else {
    return value.toString();
  }
};

const formatValue = (value: number): string => {
  if (value === undefined || value === null) return 'N/A';
  const numValue = Number(value);
  return numValue.toLocaleString();
};

const LivePriceDisplay: React.FC<{ price: number }> = React.memo(({ price }) => (
  <div className='flex gap-2 items-center'>
    <Badge variant="secondary" className="animate-pulse">Live</Badge>
    <p className='font-semibold md:text-lg'>${price.toLocaleString()}</p>
  </div>
));
LivePriceDisplay.displayName = 'LivePriceDisplay';
const CoinPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const { theme } = useTheme();
  const coinData = useSelector((state: RootState) => state.coins.coinDetails[id]);
  const historicalData = useSelector((state: RootState) => state.historicalData.data.find((data) => data.name === id)) as HistoricalData | undefined;

  const livePriceRef = useRef<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (coinData) {
      const dragData = {
        id: coinData.id,
        name: coinData.name,
        symbol: coinData.symbol,
        image: coinData.image.thumb,
        current_price: livePriceRef.current || coinData.market_data.current_price.usd,
        price_change_percentage_24h: coinData.market_data.price_change_percentage_24h,
        market_cap: coinData.market_data.market_cap.usd,
      };
      e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    }
  }, [coinData]);

  useEffect(() => {
    let unsubscribe: () => void;

    if (id) {
      dispatch(fetchCoinDetails(id)).then((action) => {
        const payload = action.payload as CoinDetailsPayload;

        if (payload) {
          const coinForRecentlyViewed: RecentlyViewedCoin = {
            id: payload.id,
            name: payload.name,
            symbol: payload.symbol,
            image: payload.image.thumb,
            market_cap_rank: payload.market_cap_rank,
            genesis_date: payload.genesis_date,
          };
          dispatch(addToRecentlyViewed(coinForRecentlyViewed));

          const initialPrice = payload.market_data.current_price.usd;
          setLivePrice(initialPrice);
          livePriceRef.current = initialPrice;

          LivePriceService().startUpdates(id, initialPrice);
          unsubscribe = PubSub.subscribe('priceUpdate', ({ coinId, price }) => {
            if (coinId === id) {
              livePriceRef.current = price;
              setLivePrice(price);
            }
          });
        }
      });
      dispatch(fetchHistoricalData());
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (id) LivePriceService().stopUpdates(id);
    };
  }, [dispatch, id]);

  const formattedHistoricalData = useMemo(() =>
    historicalData?.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp),
      price: price
    })) || [], [historicalData]);

  const displayedPrice = livePrice || (coinData && coinData.market_data.current_price.usd);

  const variant = coinData?.market_data?.price_change_percentage_24h >= 0 ? "secondary" : "default"; // Update here
  return (
    <div className="flex flex-col gap-8 max-w-6xl mt-12 mx-auto p-4">
      <Card>
        <CardHeader>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div
              draggable={coinData ? true : false}
              onDragStart={handleDragStart}
              className='flex gap-4 items-center'>
              {coinData?.image?.thumb && (
                <Image
                  className='h-12 w-12 rounded-full object-cover'
                  height={48}
                  width={48}
                  src={coinData?.image?.thumb}
                  alt={coinData?.name}
                />
              )}
              <div className='flex flex-col items-start'>
                <CardTitle className="text-2xl">{id}</CardTitle>
                <span className='text-sm text-muted-foreground'>{coinData?.symbol}</span>
              </div>
            </div>
            {displayedPrice !== undefined && (
              <LivePriceDisplay price={displayedPrice} />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {coinData && (
            <div className='mt-4 flex flex-col gap-4'>
              <div className='flex justify-between text-sm'>
                <p><strong>Market Cap:</strong> ${formatValue(coinData.market_data.market_cap.usd)}</p>
                <Badge variant={variant}>
                  {coinData.market_data.price_change_percentage_24h >= 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {(coinData.market_data.price_change_percentage_24h).toFixed(2)}%
                </Badge>
              </div>
              <div className='flex justify-between text-sm'>
                <p><strong>Max Supply:</strong> ${formatValue(coinData.market_data.max_supply || 0)}</p>
                <p><strong>Total Volume:</strong> ${formatValue(coinData.market_data.total_volume.usd)}</p>
              </div>
            </div>
          )}
          {historicalData ? (
            <CoinPriceChart coinId={id} historicalData={formattedHistoricalData} />
          ) : (
            <div className="text-center text-muted-foreground">Loading...</div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="price-changes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="price-changes">Price Changes</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
        </TabsList>
        <TabsContent value="price-changes">
          <Card>
            <CardHeader>
              <CardTitle>Price Change Percentages</CardTitle>
            </CardHeader>
            <CardContent>
              {coinData ? (
                <CoinBarChart isDarkMode={theme === 'dark'} coinData={coinData} />
              ) : (
                <div className="text-center text-muted-foreground">Loading...</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="description">
          <Card>
            <CardHeader>
              <CardTitle>About {coinData?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="text-sm prose dark:prose-invert description-content"
                dangerouslySetInnerHTML={{ __html: coinData?.description.en || 'No description available.' }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};


export default CoinPage;
