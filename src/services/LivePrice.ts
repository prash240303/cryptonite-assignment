// services/LivePriceService.ts
import PubSub from './PubSub';

interface PriceUpdate {
  coinId: string;
  price: number;
}

class LivePriceService {
  private prices: { [coinId: string]: number };
  private intervals: { [coinId: string]: NodeJS.Timeout };

  constructor() {
    this.prices = {};
    this.intervals = {};
  }

  startUpdates(coinId: string, initialPrice: number): void {
    this.prices[coinId] = initialPrice;

    const updatePrice = () => {
      const changePercent = (Math.random() - 0.5) * 0.02; // Random change between -1% and 1%
      this.prices[coinId] *= (1 + changePercent);
      const priceUpdate: PriceUpdate = { coinId, price: this.prices[coinId] };
      PubSub.publish('priceUpdate', priceUpdate);
    };

    updatePrice(); // Initial update
    this.intervals[coinId] = setInterval(updatePrice, 60000); // Update every minute
  }

  stopUpdates(coinId: string): void {
    if (this.intervals[coinId]) {
      clearInterval(this.intervals[coinId]);
      delete this.intervals[coinId];
    }
  }

  getCurrentPrice(coinId: string): number | undefined {
    return this.prices[coinId];
  }
}

export default new LivePriceService();
