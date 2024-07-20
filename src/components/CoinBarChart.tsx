'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface MarketData {
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
}

interface CoinData {
  market_data: MarketData;
}

interface CoinBarChartProps {
  coinData: CoinData;
}

const CoinBarChart: React.FC<CoinBarChartProps> = ({ coinData }) => {
  const chartData = [
    { period: '24h', change: coinData.market_data.price_change_percentage_24h },
    { period: '7d', change: coinData.market_data.price_change_percentage_7d },
    { period: '30d', change: coinData.market_data.price_change_percentage_30d },
  ];

  const chartConfig = {
    change: {
      label: 'Price Change (%)',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coin Price Change</CardTitle>
        <CardDescription>Price change over different periods</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="change" fill="var(--color-change)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Showing price change percentages for different periods <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Data is for the last 24 hours, 7 days, and 30 days
        </div>
      </CardFooter>
    </Card>
  );
};

export default CoinBarChart;
