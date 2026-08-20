import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { format } from 'date-fns';

export const CashFlowChart = ({ transactions }) => {
  // Aggregate data by date
  const dataMap = transactions.reduce((acc, t) => {
    const dateStr = format(new Date(t.date), 'MMM dd');
    if (!acc[dateStr]) acc[dateStr] = { date: dateStr, Income: 0, Expense: 0 };
    if (t.type === 'income') acc[dateStr].Income += Number(t.amount);
    if (t.type === 'expense') acc[dateStr].Expense += Number(t.amount);
    return acc;
  }, {});

  const data = Object.values(dataMap).sort((a, b) => new Date(a.date + ' ' + new Date().getFullYear()) - new Date(b.date + ' ' + new Date().getFullYear()));

  if (data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-finance-muted bg-finance-bg rounded-xl border border-dashed border-finance-border">
        No transaction data available.
      </div>
    );
  }

  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }} 
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip 
            cursor={{ fill: '#f9fafb' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
          <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
