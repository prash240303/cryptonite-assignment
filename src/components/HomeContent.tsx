'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchGlobalMarketCap, fetchPublicCompaniesHoldings } from '@/redux/slices/homePageSlice';

import LineChart from './LineChart';
import TrendingMarket from './TrendingMarket';
import PublicCompaniesHoldings from '@/components/PublicCompaniesHoldings';
import RecentlyViewed from '@/components/RecentlyViewed';
import WatchList from './watchList';

import { useLoading } from '@/components/LoadingProvider';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const HomeContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { publicCompaniesHoldings } = useSelector((state: RootState) => state.home);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          dispatch(fetchGlobalMarketCap()),
          dispatch(fetchPublicCompaniesHoldings())
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, setIsLoading]);
  
  const formattedHoldings = publicCompaniesHoldings.map(holding => ({
    ...holding,
    bitcoin: holding.bitcoin.toString(),
    ethereum: holding.ethereum.toString(),
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-4/6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LineChart />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Public Companies Holdings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <PublicCompaniesHoldings companies={formattedHoldings}/>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trending">
              <Card>
                <CardHeader>
                  <CardTitle>Trending Markets</CardTitle>
                </CardHeader>
                <CardContent>
                  <TrendingMarket />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recently Viewed</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentlyViewed />
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-2/6 mt-20">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Your Watchlist</CardTitle>
            </CardHeader>
            <CardContent>
              <WatchList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default HomeContent;