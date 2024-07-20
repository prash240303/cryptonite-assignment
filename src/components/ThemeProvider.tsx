"use client"

import { useSelector } from 'react-redux';
// import WatchList from "@/components/WatchList";
// import RecentlyViewed from "@/components/RecentlyViewed";
import { ComponentState, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTheme } from '@/redux/slices/theme';
import Navbar from './Navbar';
import WatchList from './watchList';
import RecentlyViewed from './RecentlyViewed';

interface LayoutProviderProps {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const dm = useSelector((state: ComponentState) => state.theme.isDarkMode);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('isDarkMode');
      setIsDarkMode(savedTheme !== null ? JSON.parse(savedTheme) : true)
      if (savedTheme !== null) {
        dispatch(setTheme(JSON.parse(savedTheme)));
      }
    }
  }, [dispatch, dm]);
  // const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
      }`}>
      <div className="w-full pb-5">
        <Navbar />
      </div>
      <div className="flex flex-col md:flex-row gap-5 w-full px-3 md:px-5">
        <div className="w-full md:w-[65%]">
          {children}
        </div>
        <div className="flex flex-col gap-5 w-full md:max-w-[35%]">
          <WatchList />
          <RecentlyViewed/>
        </div>
      </div>
    </div>
  );
}