import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Target, Plus, Edit2, Trash2 } from 'lucide-react';
import { cn } from '../components/Layout/Sidebar';

export const Goals = () => {
  const { goals, settings, addGoal, editGoal, deleteGoal } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const handleEdit = (g) => {
    setEditingGoal(g);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-finance-text mb-2">Savings Goals</h1>
          <p className="text-finance-muted">Track your progress towards big purchases.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-finance-text text-white px-5 py-2.5 rounded-xl hover:bg-black transition-colors shadow-sm w-fit"
        >
          <Plus className="w-5 h-5" />
          Create Goal
        </button>
      </header>

      {goals.length === 0 ? (
        <div className="bg-finance-card p-12 rounded-2xl border border-finance-border text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-finance-text mb-2">No goals set</h3>
          <p className="text-finance-muted max-w-sm mx-auto mb-6">Create a savings goal to track your progress towards a specific target.</p>
          <button onClick={handleAdd} className="text-finance-green font-medium hover:underline">Create your first goal</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(g => {
            const percentage = Math.min((g.current / g.target) * 100, 100);
            return (
              <div key={g.id} className="bg-finance-card p-6 rounded-2xl border border-finance-border shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                        <Target className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-lg text-finance-text">{g.name}</h3>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(g)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => { if(window.confirm('Delete goal?')) deleteGoal(g.id) }} className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-bold">{formatCurrency(g.current, settings.currency)}</span>
                    <span className="text-finance-muted text-sm pb-1">of {formatCurrency(g.target, settings.currency)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-finance-green">{percentage.toFixed(0)}%</span>
                    <span className="text-finance-muted">Target: {formatDate(g.deadline)}</span>
                  </div>
                  <div className="h-2 w-full bg-finance-bg rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-finance-green rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-finance-card w-full max-w-sm rounded-2xl p-6 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-bold mb-4">{editingGoal ? 'Edit Goal' : 'New Goal'}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const name = e.target.name.value;
              const target = Number(e.target.target.value);
              const current = Number(e.target.current.value);
              const deadline = e.target.deadline.value;
              if (editingGoal) {
                editGoal({ ...editingGoal, name, target, current, deadline });
              } else {
                addGoal({ name, target, current, deadline });
              }
              setIsModalOpen(false);
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-finance-text mb-1">Goal Name</label>
                <input type="text" name="name" defaultValue={editingGoal?.name || ''} required className="w-full px-4 py-2 bg-finance-bg border border-finance-border rounded-xl focus:ring-2 focus:ring-finance-green/50 outline-none transition-all" placeholder="e.g. New Laptop" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-finance-text mb-1">Target Amount</label>
                <input type="number" name="target" defaultValue={editingGoal?.target || ''} required min="1" className="w-full px-4 py-2 bg-finance-bg border border-finance-border rounded-xl focus:ring-2 focus:ring-finance-green/50 outline-none transition-all" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-finance-text mb-1">Currently Saved</label>
                <input type="number" name="current" defaultValue={editingGoal?.current || 0} required min="0" className="w-full px-4 py-2 bg-finance-bg border border-finance-border rounded-xl focus:ring-2 focus:ring-finance-green/50 outline-none transition-all" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-finance-text mb-1">Deadline Date</label>
                <input type="date" name="deadline" defaultValue={editingGoal?.deadline || new Date().toISOString().split('T')[0]} required className="w-full px-4 py-2 bg-finance-bg border border-finance-border rounded-xl focus:ring-2 focus:ring-finance-green/50 outline-none transition-all" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-finance-bg hover:bg-gray-200 text-finance-text font-medium rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-finance-text hover:bg-black text-white font-medium rounded-xl transition-colors shadow-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
