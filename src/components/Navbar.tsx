'use client';

import Image from 'next/image';
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useTheme } from "next-themes";
import { ThemeToggle } from './ThemeToggle';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Coin[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchCoins();
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    const searchCoins = async () => {
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/search?query=${searchTerm}`);
        setSearchResults(response.data.coins.slice(0, 5));
        setShowDropdown(true);
      } catch (error) {
        console.error('Error searching coins:', error);
      }
    };

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleCoinSelect = (id: string) => {
    router.push(`/coin/${id}`);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleCoinSelect(searchResults[0].id);
    }
  };

  return (
    <nav className="p-3 py-2 md:py-3 md:px-5 flex items-center border-b justify-between bg-background">
      <Link className='flex font-bold text-2xl uppercase text-green-600 items-center justify-center gap-3' href="/">
        <Image className='h-8 w-8 md:h-10 md:w-10 rounded-full' height={1000} width={1000} src={"/logo.jpg"} alt="Logo" />
        Cryptonite
      </Link>
      <div className="flex items-center gap-4">
        <div className="relative flex items-center w-[12rem] md:w-[30.5rem] gap-1 pl-2 py-1 border-[1px] border-input bg-background rounded-md">
          <span className="text-muted-foreground">
            <Search />
          </span>
          <input
            className="outline-none rounded-r-md p-1.5 w-full text-xs md:text-sm placeholder:text-xs md:placeholder:text-sm bg-background text-foreground"
            placeholder='Search...'
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
          {showDropdown && (
            <div className="absolute text-xs top-full left-0 w-full mt-1 bg-background border border-input rounded-md shadow-lg z-10">
              {searchResults.map((coin) => (
                <div
                  key={coin.id}
                  className="p-2 cursor-pointer font-semibold flex items-center hover:bg-accent"
                  onClick={() => handleCoinSelect(coin.id)}
                >
                  <Image src={coin.thumb} alt={coin.name} width={100} height={100} className="w-6 h-6 mr-2" />
                  <span>{coin.name} ({coin.symbol})</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <Link href="/explore" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
          Explore
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;