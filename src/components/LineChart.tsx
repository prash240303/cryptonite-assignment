import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistoricalData } from '../redux/slices/historyDataSlice';
import { Chart, ChartOptions, LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, CategoryScale, ChartData } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { AppDispatch, RootState } from '@/redux/store';
import { useTheme } from 'next-themes';

Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend, CategoryScale);

interface CoinData {
  name: string;
  prices: number[][];
}

type TimeRange = '24h' | '7d' | '30d';

const LineChart=() => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const { data, status, error } = useSelector((state: RootState) => state.historicalData);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart<'line', { x: number; y: number }[], unknown> | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchHistoricalData());
    }
  }, [status, dispatch]);

  const filterDataByTimeRange = (data: CoinData[], range: TimeRange): CoinData[] => {
    const now = new Date();
    const pastDate = new Date(now.getTime());

    switch (range) {
      case '24h':
        pastDate.setDate(pastDate.getDate() - 1);
        break;
      case '7d':
        pastDate.setDate(pastDate.getDate() - 7);
        break;
      case '30d':
        pastDate.setMonth(pastDate.getMonth() - 1);
        break;
    }

    return data.map(coin => ({
      ...coin,
      prices: coin.prices.filter(price => new Date(price[0]) >= pastDate)
    }));
  };

  useEffect(() => {
    if (status === 'succeeded' && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      const filteredData = filterDataByTimeRange(data, timeRange);

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: timeRange === '24h' ? 'hour' : 'day'
            },
            title: {
              display: true,
              text: 'Date',
              color: theme === 'dark' ? '#fff' : '#666'
            },
            ticks: {
              color: theme === 'dark' ? '#fff' : '#666'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Price (USD)',
              color: theme === 'dark' ? '#fff' : '#666'
            },
            beginAtZero: false,
            ticks: {
              color: theme === 'dark' ? '#fff' : '#666'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: `Cryptocurrency Prices - ${timeRange}`,
            color: theme === 'dark' ? '#fff' : '#333'
          },
          legend: {
            display: true,
            labels: {
              color: theme === 'dark' ? '#fff' : '#666'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        }
      };

      const chartData: ChartData<'line', { x: number; y: number }[]> = {
        datasets: filteredData.map((coin) => ({
          label: coin.name,
          data: coin.prices.map((price) => ({ x: price[0], y: price[1] })),
          fill: false,
          borderColor: coin.name === 'bitcoin' ? 'rgb(255, 99, 132)' :
                       coin.name === 'ethereum' ? 'rgb(54, 162, 235)' :
                       'rgb(75, 192, 192)',
          tension: 0.1,
          borderWidth: 1.5,
          pointRadius: 0,
        }))
      };

      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, status, timeRange, theme]);

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  if (status === 'loading') {
    return <div className="text-gray-900 dark:text-white">Loading chart...</div>;
  }

  if (status === 'failed') {
    return <div className="text-red-500">Error loading chart: {error}</div>;
  }

  return (
    <div className='w-full h-[400px] flex flex-col'>
      <div className='flex-grow relative'>
        <canvas ref={chartRef} className='absolute top-0 left-0 w-full h-full' />
      </div>
      <div className="flex justify-center gap-2 text-xs py-2">
        {['24h', '7d', '30d'].map((range) => (
          <button
            key={range}
            onClick={() => handleTimeRangeChange(range as TimeRange)}
            className={`py-1 px-2 rounded-md transition-colors duration-200 ${
              timeRange === range
                ? 'bg-green-600 text-white'
                : 'bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LineChart;