import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, PieChart, Target, Settings, Wallet } from 'lucide-react';
import { cn } from './Sidebar'; // re-use cn

const navItems = [
  { name: 'Home', path: '/', icon: LayoutDashboard },
  { name: 'Trans.', path: '/transactions', icon: ReceiptText },
  { name: 'Budgets', path: '/budgets', icon: PieChart },
  { name: 'Goals', path: '/goals', icon: Target },
  { name: 'Stats', path: '/analytics', icon: Wallet },
];

export const BottomNavigation = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-finance-card border-t border-finance-border pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1',
                isActive ? 'text-finance-green' : 'text-finance-muted'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
