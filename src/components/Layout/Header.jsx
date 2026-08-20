import React from 'react';
import { Wallet, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="md:hidden bg-finance-card border-b border-finance-border sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="w-8"></div> {/* Spacer for centering */}
        <h1 className="text-xl font-bold text-finance-green flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          FinTrack
        </h1>
        <Link to="/settings" className="w-8 h-8 flex items-center justify-center text-finance-muted hover:text-finance-text transition-colors">
          <Settings className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
};
