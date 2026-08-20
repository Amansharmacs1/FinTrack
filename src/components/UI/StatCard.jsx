import React from 'react';
import { cn } from '../Layout/Sidebar';

export const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => {
  return (
    <div className="bg-finance-card rounded-2xl p-6 shadow-sm border border-finance-border flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-finance-muted font-medium text-sm">{title}</h3>
        <div className={cn("p-2 rounded-xl", colorClass.bg, colorClass.text)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-finance-text">{value}</p>
        {trend && (
          <p className="text-sm text-finance-muted mt-1">{trend}</p>
        )}
      </div>
    </div>
  );
};
