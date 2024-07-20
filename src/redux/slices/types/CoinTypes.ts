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

export interface CoinDetails extends CoinTypes {
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    market_cap: {
      usd: number;
    };
  };
  description: {
    en: string;
  };
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