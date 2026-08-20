import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { TransactionModal } from '../components/Transactions/TransactionModal';
import { TrendingUp, TrendingDown, Search, Filter, Edit2, Trash2, Plus } from 'lucide-react';

export const Transactions = () => {
  const { transactions, settings, deleteTransaction } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = transactions
    .filter(t => filterType === 'all' || t.type === filterType)
    .filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.amount.toString().includes(searchTerm)
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleEdit = (t) => {
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-finance-text mb-2">Transactions</h1>
          <p className="text-finance-muted">Track every rupee coming in and going out.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-finance-text text-white px-5 py-2.5 rounded-xl hover:bg-black transition-colors shadow-sm w-fit"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </header>

      <div className="bg-finance-card p-4 sm:p-6 rounded-2xl border border-finance-border shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-finance-muted" />
            <input 
              type="text" 
              placeholder="Search description, category, amount..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-finance-bg border border-finance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-finance-green/50"
            />
          </div>
          <div className="relative shrink-0">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-finance-muted" />
            <select 
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 bg-finance-bg border border-finance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-finance-green/50 appearance-none min-w-[140px]"
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-finance-muted">
              No transactions found matching your criteria.
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <table className="hidden md:table w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-finance-border text-sm text-finance-muted">
                    <th className="py-3 font-medium">Date</th>
                    <th className="py-3 font-medium">Description</th>
                    <th className="py-3 font-medium">Category</th>
                    <th className="py-3 font-medium">Method</th>
                    <th className="py-3 font-medium text-right">Amount</th>
                    <th className="py-3 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(t => (
                    <tr key={t.id} className="border-b border-finance-border last:border-0 hover:bg-finance-bg/50 transition-colors">
                      <td className="py-4 text-sm whitespace-nowrap">{formatDate(t.date)}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full shrink-0 ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            {t.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          </div>
                          <span className="font-medium text-finance-text line-clamp-1">{t.description || 'No description'}</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-finance-muted">
                        <span className="bg-gray-100 px-2.5 py-1 rounded-full">{t.category}</span>
                      </td>
                      <td className="py-4 text-sm text-finance-muted">{t.paymentMethod}</td>
                      <td className={`py-4 text-right font-semibold whitespace-nowrap ${t.type === 'income' ? 'text-finance-green' : 'text-finance-text'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, settings.currency)}
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(t)} className="p-1.5 text-finance-muted hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => { if(window.confirm('Delete transaction?')) deleteTransaction(t.id) }} className="p-1.5 text-finance-muted hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredTransactions.map(t => (
                  <div key={t.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full shrink-0 ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                          {t.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-finance-text line-clamp-1">{t.description || 'No description'}</p>
                          <p className="text-xs text-finance-muted">{formatDate(t.date)}</p>
                        </div>
                      </div>
                      <div className={`font-semibold shrink-0 ${t.type === 'income' ? 'text-finance-green' : 'text-finance-text'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, settings.currency)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                      <div className="flex gap-2">
                         <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">{t.category}</span>
                         <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">{t.paymentMethod}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(t)} className="p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 rounded">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { if(window.confirm('Delete transaction?')) deleteTransaction(t.id) }} className="p-1.5 text-gray-400 hover:text-rose-600 bg-gray-50 rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        transaction={editingTransaction} 
      />
    </div>
  );
};
