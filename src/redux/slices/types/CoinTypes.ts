// @/redux/slices/types/CoinTypes.ts

export interface CoinTypes {
  id: string;
  name: string;
  symbol: string;
  large: string;
  data: {
    price: number;
    price_change_percentage_24h: {
      usd: number;
    };
    market_cap: number;
  };
  market_cap_rank: number;
}
// @/redux/slices/types/CoinTypes.ts
export interface CoinDescription {
  id: string;
  name: string;
  symbol: string;
  image: {
    thumb: string;
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    market_cap: {
      usd: number;
    };
    total_supply: number | null;
    max_supply: number | null;
    total_volume: {
      usd: number;
    };
    price_change_percentage_7d?: number;
    price_change_percentage_30d?: number;
  };
  description: {
    en: string;
  };
  market_cap_rank: number;
  genesis_date: string | null;
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    subreddit_url: string;
    repos_url: {
      github: string[];
    };
  };
}

export interface HistoricalData {
  name: string;
  prices: [number, number][];
}



export interface CoinDetailsPayload {
  id: string;
  name: string;
  symbol: string;
  image: { thumb: string };
  market_cap_rank: number;
  genesis_date: string;
  market_data: {
    current_price: { usd: number };
    price_change_percentage_24h: number;
    market_cap: { usd: number };
    max_supply: number;
    total_volume: { usd: number };
  };
  description: { en: string };
}


export interface RecentlyViewedCoin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  market_cap_rank: number;
  genesis_date: string | null;
}
export interface CoinData {
  market_data: {
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
  };
}

