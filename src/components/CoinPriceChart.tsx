'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';

Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, CategoryScale);

interface HistoricalData {
  date: string;
  price: number;
}

interface CoinPriceChartProps {
  isDarkMode: boolean;
  coinId: string;
  historicalData: { date: string; price: number; }[] | undefined;
}

const CoinPriceChart: React.FC<CoinPriceChartProps> = ({ isDarkMode, coinId, historicalData }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [timeRange, setTimeRange] = useState<string>('24h');
  const chartInstanceRef = useRef<Chart | null>(null);
  const filterDataByTimeRange = (data: HistoricalData[], range: string): HistoricalData[] => {
    const now = new Date();
    const pastDate = new Date();
    switch (range) {
      case '24h':
        pastDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        pastDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        pastDate.setMonth(now.getMonth() - 1);
        break;
      default:
        pastDate.setHours(now.getHours() - 24);
    }
    return data.filter(d => new Date(d.date) >= pastDate && new Date(d.date) <= now);
  };

  useEffect(() => {
    const createChart = () => {
      if (chartRef.current && historicalData && historicalData.length > 0) {
        const filteredData = filterDataByTimeRange(historicalData, timeRange);
    
        if (filteredData.length === 0) {
          console.log('No data available for the selected time range');
          return;
        }
        
        const ctx = chartRef.current.getContext('2d');
        if (ctx) {
          chartInstanceRef.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: filteredData.map(d => d.date),
              datasets: [{
                label: 'Price',
                data: filteredData.map(d => d.price),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.4,
                borderWidth: 1.5,
                pointRadius: 0,
              }]
            },
            options: {
              responsive: true,
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: timeRange === '24h' ? 'hour' : 'day',
                    displayFormats: {
                      hour: 'HH:mm',
                      day: 'MMM d',
                    },
                  },
                  adapters: {
                    date: {
                      locale: enUS,
                    },
                  },
                  title: {
                    display: true,
                    text: 'Date'
                  }
                },
                y: {
                  beginAtZero: false,
                  title: {
                    display: true,
                    text: 'Price (USD)'
                  }
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: `${coinId.toUpperCase()} Price - ${timeRange}`
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                  position: 'nearest'
                }
              }
            }
          });
        }
      }
    };

    createChart();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [historicalData, timeRange, coinId]);

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  return (
    <div className='w-full'>
      <canvas ref={chartRef} />
      <div className={`${isDarkMode ? "text-white" : "text-black"} flex justify-center gap-2 text-xs py-2`}>
        <button onClick={() => handleTimeRangeChange('24h')} className={`${isDarkMode ? "bg-gray-800" : "bg-gray-300"} py-1 px-2 rounded-md`}>24h</button>
        <button onClick={() => handleTimeRangeChange('7d')} className={`${isDarkMode ? "bg-gray-800" : "bg-gray-300"} py-1 px-2 rounded-md`}>7d</button>
        <button onClick={() => handleTimeRangeChange('30d')} className={`${isDarkMode ? "bg-gray-800" : "bg-gray-300"} py-1 px-2 rounded-md`}>30d</button>
      </div>
    </div>
  );
};

export default CoinPriceChart;
