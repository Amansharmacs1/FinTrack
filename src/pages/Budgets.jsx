import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { calculateTotalExpenses } from '../utils/calculations';
import { Plus, Edit2, Trash2, AlertTriangle, PieChart } from 'lucide-react';
import { cn } from '../components/Layout/Sidebar';

export const Budgets = () => {
  const { budgets, transactions, settings, deleteBudget, addBudget, editBudget } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const budgetsWithProgress = budgets.map(budget => {
    const spent = calculateTotalExpenses(
      transactions,
      t => t.category === budget.category && 
           new Date(t.date).getMonth() === currentMonth && 
           new Date(t.date).getFullYear() === currentYear
    );
    const percentage = Math.min((spent / budget.amount) * 100, 100);
    const remaining = budget.amount - spent;
    
    let status = 'normal';
    let color = 'bg-emerald-500';
    
    if (percentage >= 100) {
      status = 'exceeded';
      color = 'bg-rose-500';
    } else if (percentage >= 90) {
      status = 'critical';
      color = 'bg-rose-400';
    } else if (percentage >= 75) {
      status = 'warning';
      color = 'bg-amber-400';
    }

    return { ...budget, spent, remaining, percentage, status, color };
  });

  const handleEdit = (b) => {
    setEditingBudget(b);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-finance-text mb-2">Budgets</h1>
          <p className="text-finance-muted">Set monthly spending limits for categories.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-finance-text text-white px-5 py-2.5 rounded-xl hover:bg-black transition-colors shadow-sm w-fit"
        >
          <Plus className="w-5 h-5" />
          Create Budget
        </button>
      </header>

      {budgets.length === 0 ? (
        <div className="bg-finance-card p-12 rounded-2xl border border-finance-border text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <PieChart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-finance-text mb-2">No budgets set</h3>
          <p className="text-finance-muted max-w-sm mx-auto mb-6">Create a budget to monitor your spending in specific categories and stay on track.</p>
          <button onClick={handleAdd} className="text-finance-green font-medium hover:underline">Create your first budget</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {budgetsWithProgress.map(b => (
            <div key={b.id} className="bg-finance-card p-6 rounded-2xl border border-finance-border shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-finance-text">{b.category}</h3>
                  <p className="text-sm text-finance-muted">{formatCurrency(b.amount, settings.currency)} limit</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(b)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => { if(window.confirm('Delete budget?')) deleteBudget(b.id) }} className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="mb-2 flex justify-between text-sm">
                <span className="text-finance-muted">Spent: {formatCurrency(b.spent, settings.currency)}</span>
                <span className={cn("font-medium", b.remaining < 0 ? "text-rose-600" : "text-finance-green")}>
                  {b.remaining < 0 ? 'Over: ' : 'Left: '}{formatCurrency(Math.abs(b.remaining), settings.currency)}
                </span>
              </div>

              <div className="h-3 w-full bg-finance-bg rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-500", b.color)}
                  style={{ width: `${b.percentage}%` }}
                />
              </div>

              {b.status === 'exceeded' && (
                <div className="mt-4 flex items-center gap-2 text-rose-600 bg-rose-50 p-2.5 rounded-lg text-sm font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Budget exceeded by {formatCurrency(Math.abs(b.remaining), settings.currency)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Basic Modal Implementation inline for speed, ideally this is a separate component */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-finance-card w-full max-w-sm rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">{editingBudget ? 'Edit Budget' : 'New Budget'}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const category = e.target.category.value;
              const amount = Number(e.target.amount.value);
              if (editingBudget) {
                editBudget({ ...editingBudget, category, amount });
              } else {
                addBudget({ category, amount });
              }
              setIsModalOpen(false);
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-finance-text mb-1">Category</label>
                <select name="category" defaultValue={editingBudget?.category || ''} required className="w-full px-4 py-2 bg-finance-bg border border-finance-border rounded-xl">
                  <option value="" disabled>Select category</option>
                  {/* Reuse categories from earlier */}
                  {['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Health', 'Other'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-finance-text mb-1">Amount Limit</label>
                <input type="number" name="amount" defaultValue={editingBudget?.amount || ''} required min="1" className="w-full px-4 py-2 bg-finance-bg border border-finance-border rounded-xl" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-finance-bg text-finance-text font-medium rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-finance-text text-white font-medium rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
