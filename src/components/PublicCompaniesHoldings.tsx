"use client"

import React from 'react';
import { useTheme } from 'next-themes';

interface PublicCompaniesHoldingsProps {
  companies: {
    name: string;
    bitcoin: string;
    ethereum: string;
  }[];
}

const PublicCompaniesHoldings = ({ companies }: PublicCompaniesHoldingsProps) => {
  const { theme } = useTheme();

  return (
    <div className="p-3 border-2 rounded-lg border-input bg-background">
      <h2 className="text-lg md:text-xl font-bold mb-4 text-center md:text-left">Public Companies Holdings</h2>
      <table className="w-full text-xs">
        <thead>
          <tr className='uppercase leading-normal border-b border-input text-xs'>
            <th className="text-left text-muted-foreground font-semibold py-2">Company</th>
            <th className="text-right text-muted-foreground font-semibold py-2">Bitcoin</th>
            <th className="text-right text-muted-foreground font-semibold py-2">Ethereum</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(company => (
            <tr key={company.name}>
              <td className='text-left py-2 uppercase text-blue-400'>{company.name}</td>
              <td className="text-right py-2 text-muted-foreground">{company.bitcoin}</td>
              <td className="text-right py-2 text-muted-foreground">{company.ethereum}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PublicCompaniesHoldings;