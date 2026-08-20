import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, PieChart, Target, Settings, Wallet } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: ReceiptText },
  { name: 'Budgets', path: '/budgets', icon: PieChart },
  { name: 'Goals', path: '/goals', icon: Target },
  { name: 'Analytics', path: '/analytics', icon: Wallet },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-finance-card border-r border-finance-border sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-finance-green flex items-center gap-2">
          <Wallet className="w-8 h-8" />
          FinTrack
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium',
                isActive 
                  ? 'bg-finance-green/10 text-finance-green' 
                  : 'text-finance-muted hover:bg-finance-bg hover:text-finance-text'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-6 text-sm text-finance-muted text-center border-t border-finance-border">
        Made for Irregular Income
      </div>
    </aside>
  );
};
