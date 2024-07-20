import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ProviderWrapper } from '@/redux/providerWrapper';
import Navbar from '@/components/Navbar';
import LayoutProvider from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-background antialiased ${inter.className}`}>
        <ProviderWrapper>
          <LayoutProvider>
            {children}
          </LayoutProvider>
        </ProviderWrapper>
      </body>
    </html>
  );
}
