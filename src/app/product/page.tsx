"use client"
import React, { useState } from 'react'
import { fetchGlobalMarketCap, fetchPublicCompaniesHoldings } from '@/redux/slices/productPage';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setTheme } from '@/redux/slices/theme';

const ProductPage = () => {

  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(true);
  // const dm = useSelector((state) => state.theme.isDarkMode);
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const savedTheme = localStorage.getItem('isDarkMode');
  //     setIsDarkMode(savedTheme !== null ? JSON.parse(savedTheme) : true)
  //     if (savedTheme !== null) {
  //       dispatch(setTheme(JSON.parse(savedTheme)));
  //     }
  //   }
  // }, [dispatch, dm]);
  // const { publicCompaniesHoldings } = useSelector(state => state.home);

  // useEffect(() => {
  //   dispatch(fetchGlobalMarketCap());
  //   dispatch(fetchPublicCompaniesHoldings());
  // }, [dispatch]);

  return (
    <div className='w-full flex flex-col gap-5 pb-5'>
      hi
    </div>
  )
}

export default ProductPage;