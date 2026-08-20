import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { StatCard } from '../components/UI/StatCard';
import { CashFlowChart } from '../components/Charts/CashFlowChart';
import { InsightCard } from '../components/Insights/InsightCard';
import { formatCurrency, formatDate } from '../utils/formatters';
import { 
  calculateBalance, 
  calculateTotalIncome, 
  calculateTotalExpenses, 
  calculateSavingsRate,
  analyzeIrregularIncome 
} from '../utils/calculations';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

export const Dashboard = () => {
  const { transactions, settings } = useFinance();
  
  const balance = calculateBalance(transactions);
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  const savingsRate = calculateSavingsRate(income, expenses);
  const insight = analyzeIrregularIncome(transactions);

  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-finance-text mb-2">Good morning 👋</h1>
        <p className="text-finance-muted">Here's your financial overview.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Available Balance" 
          value={formatCurrency(balance, settings.currency)} 
          icon={Wallet}
          colorClass={{ bg: 'bg-blue-100', text: 'text-blue-600' }}
        />
        <StatCard 
          title="Total Income" 
          value={formatCurrency(income, settings.currency)} 
          icon={TrendingUp}
          colorClass={{ bg: 'bg-emerald-100', text: 'text-emerald-600' }}
        />
        <StatCard 
          title="Total Expenses" 
          value={formatCurrency(expenses, settings.currency)} 
          icon={TrendingDown}
          colorClass={{ bg: 'bg-rose-100', text: 'text-rose-600' }}
        />
        <StatCard 
          title="Savings" 
          value={formatCurrency(income - expenses, settings.currency)} 
          trend={`${savingsRate.toFixed(1)}% saved`}
          icon={PiggyBank}
          colorClass={{ bg: 'bg-purple-100', text: 'text-purple-600' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-finance-card p-6 rounded-2xl border border-finance-border shadow-sm">
          <h2 className="text-lg font-semibold text-finance-text mb-4">Cash Flow</h2>
          <CashFlowChart transactions={transactions} />
        </div>

        <div className="bg-finance-card p-6 rounded-2xl border border-finance-border shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-finance-text">Recent Transactions</h2>
            <button className="text-sm text-finance-green font-medium hover:underline">View All</button>
          </div>
          <div className="flex-1 space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-finance-muted text-sm text-center py-8">No recent transactions.</p>
            ) : (
              recentTransactions.map(t => (
                <div key={t.id} className="flex justify-between items-center py-2 border-b border-finance-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      {t.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-finance-text">{t.description}</p>
                      <p className="text-xs text-finance-muted">{t.category} • {formatDate(t.date)}</p>
                    </div>
                  </div>
                  <div className={`font-semibold ${t.type === 'income' ? 'text-finance-green' : 'text-finance-text'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, settings.currency)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <InsightCard insight={insight} settings={settings} />
    </div>
  );
};
