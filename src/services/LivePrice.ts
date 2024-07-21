import { useState, useEffect, useCallback } from 'react';
import PubSub from './PubSub';

interface PriceUpdate {
  coinId: string;
  price: number;
}

interface Prices {
  [coinId: string]: number;
}

interface Intervals {
  [coinId: string]: NodeJS.Timeout;
}

export function useLivePriceService() {
  const [prices, setPrices] = useState<Prices>({});
  const [intervals, setIntervals] = useState<Intervals>({});

  const startUpdates = useCallback((coinId: string, initialPrice: number) => {
    setPrices(prevPrices => ({ ...prevPrices, [coinId]: initialPrice }));

    const updatePrice = () => {
      const changePercent = (Math.random() - 0.5) * 0.02; // Random change between -1% and 1%
      setPrices(prevPrices => {
        const newPrice = prevPrices[coinId] * (1 + changePercent);
        const priceUpdate: PriceUpdate = { coinId, price: newPrice };
        PubSub.publish('priceUpdate', priceUpdate);
        return { ...prevPrices, [coinId]: newPrice };
      });
    };

    updatePrice(); // Initial update
    const interval = setInterval(updatePrice, 60000); // Update every minute
    setIntervals(prevIntervals => ({ ...prevIntervals, [coinId]: interval }));
  }, []);

  const stopUpdates = useCallback((coinId: string) => {
    setIntervals(prevIntervals => {
      if (prevIntervals[coinId]) {
        clearInterval(prevIntervals[coinId]);
        const { [coinId]: _, ...rest } = prevIntervals;
        return rest;
      }
      return prevIntervals;
    });
  }, []);

  const getCurrentPrice = useCallback((coinId: string): number | undefined => {
    return prices[coinId];
  }, [prices]);

  useEffect(() => {
    // Cleanup function to clear all intervals when the component unmounts
    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [intervals]);

  return {
    startUpdates,
    stopUpdates,
    getCurrentPrice,
  };
}

export default useLivePriceService;