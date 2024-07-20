'use client';

import { useSelector } from 'react-redux';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTheme } from '@/redux/slices/theme';
import Navbar from './Navbar';
import { RootState } from '@/redux/store';

interface LayoutProviderProps {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('isDarkMode');
      if (savedTheme !== null) {
        dispatch(setTheme(JSON.parse(savedTheme)));
      }
    }
  }, [dispatch]);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="w-full">
        <Navbar />
      </div>
      <div className="flex-grow w-full flex justify-center">
        <div className="w-full max-w-8xl px-3 md:px-5">
          {children}
        </div>
      </div>
    </div>
  );
}
