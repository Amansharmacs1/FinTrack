import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { calculateTotalIncome, calculateTotalExpenses, groupTransactionsByCategory } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { TrendingDown, TrendingUp } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1'];

export const Analytics = () => {
  const { transactions, settings } = useFinance();
  const [timeframe, setTimeframe] = useState('all');

  const filteredTransactions = transactions.filter(t => {
    if (timeframe === 'all') return true;
    const tDate = new Date(t.date);
    const now = new Date();
    if (timeframe === 'month') {
      return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
    }
    if (timeframe === 'year') {
      return tDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const income = calculateTotalIncome(filteredTransactions);
  const expenses = calculateTotalExpenses(filteredTransactions);
  
  const expenseData = groupTransactionsByCategory(filteredTransactions, 'expense');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-finance-text mb-2">Analytics</h1>
          <p className="text-finance-muted">Deep dive into your financial habits.</p>
        </div>
        <select 
          value={timeframe} 
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-finance-bg border border-finance-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-finance-green/50"
        >
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-finance-card p-6 rounded-2xl border border-finance-border shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-finance-muted font-medium mb-1">Total Income</h3>
          <p className="text-3xl font-bold text-finance-text">{formatCurrency(income, settings.currency)}</p>
        </div>
        
        <div className="bg-finance-card p-6 rounded-2xl border border-finance-border shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-full mb-4">
            <TrendingDown className="w-8 h-8" />
          </div>
          <h3 className="text-finance-muted font-medium mb-1">Total Expenses</h3>
          <p className="text-3xl font-bold text-finance-text">{formatCurrency(expenses, settings.currency)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-finance-card p-6 rounded-2xl border border-finance-border shadow-sm">
          <h2 className="text-lg font-semibold text-finance-text mb-6">Expense Breakdown</h2>
          {expenseData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-finance-muted bg-finance-bg rounded-xl border border-dashed border-finance-border">
              No expense data available.
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => formatCurrency(value, settings.currency)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-finance-card p-6 rounded-2xl border border-finance-border shadow-sm">
          <h2 className="text-lg font-semibold text-finance-text mb-4">Top Spending Categories</h2>
          <div className="space-y-4">
            {expenseData.length === 0 ? (
              <p className="text-finance-muted text-sm text-center py-8">No data available.</p>
            ) : (
              expenseData.map((cat, index) => (
                <div key={cat.name} className="flex justify-between items-center py-2 border-b border-finance-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="font-medium text-finance-text">{cat.name}</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="text-finance-muted text-sm">{((cat.value / expenses) * 100).toFixed(1)}%</span>
                    <span className="font-semibold text-finance-text">{formatCurrency(cat.value, settings.currency)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
