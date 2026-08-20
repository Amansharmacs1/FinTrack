import React from 'react';
import { Wallet } from 'lucide-react';

export const Header = () => {
  return (
    <header className="md:hidden bg-finance-card border-b border-finance-border sticky top-0 z-50">
      <div className="flex items-center justify-center h-16 px-4">
        <h1 className="text-xl font-bold text-finance-green flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          FinTrack
        </h1>
      </div>
    </header>
  );
};
