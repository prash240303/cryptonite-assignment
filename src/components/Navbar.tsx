'use client';

import Image from 'next/image';
import React, { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme, toggleTheme } from '@/redux/slices/theme';
import { Moon, Search, SunIcon } from 'lucide-react';
import { RootState } from '@/redux/store';

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
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

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

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <nav className={`p-3 py-2 md:py-3 md:px-5 flex items-center justify-between ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900'}`}>
      <Link className='flex font-bold text-2xl uppercase text-green-600 items-center justify-center gap-3' href="/"><Image className='h-8 w-8 md:h-10 md:w-10 rounded-full' height={1000} width={1000} src={"/logo.jpg"} alt="Logo" />Cryptonite</Link>
      <div className={`relative flex items-center w-[12rem] md:w-[30.5rem] gap-1 pl-2 py-1 border-[1px] ${isDarkMode ? 'border-gray-600  bg-gray-800' : 'bg-white border-gray-300'} rounded-md`}>
        <span className={isDarkMode ? 'text-gray-400 ' : 'text-gray-600'}><Search /></span>
        <input
          className={`outline-none rounded-r-md p-1.5 w-full text-xs md:text-sm placeholder:text-xs md:placeholder:text-sm ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          placeholder='Search...'
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {showDropdown && (
          <div className={`absolute text-xs top-full left-0 w-full mt-1 ${isDarkMode ? 'bg-gray-700 border-gray-700' : 'bg-white border-gray-300'} border rounded-md shadow-lg z-10`}>
            {searchResults.map((coin) => (
              <div
                key={coin.id}
                className={`p-2 cursor-pointer font-semibold flex items-center ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                onClick={() => handleCoinSelect(coin.id)}
              >
                <Image src={coin.thumb} alt={coin.name} width={100} height={100} className="w-6 h-6 mr-2" />
                <span>{coin.name} ({coin.symbol})</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={`p-2 cursor-pointer rounded-md border border-gray-400 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
        onClick={handleThemeToggle}>
        {isDarkMode ? <SunIcon /> : <Moon />}
      </div>
    </nav>
  );
};

export default Navbar;
