import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { cn } from '../Layout/Sidebar';

const CATEGORIES = {
  income: ['Freelance', 'Salary', 'Project Payment', 'Part-time', 'Gift', 'Investment', 'Other'],
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Health', 'Other']
};

const PAYMENT_METHODS = ['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Other'];

export const TransactionModal = ({ isOpen, onClose, transaction = null }) => {
  const { addTransaction, editTransaction } = useFinance();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount);
      setCategory(transaction.category);
      setDescription(transaction.description);
      setDate(transaction.date);
      setPaymentMethod(transaction.paymentMethod);
    } else {
      setType('expense');
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('UPI');
    }
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category || !date || !type) return;

    const tData = {
      type, amount: Number(amount), category, description, date, paymentMethod
    };

    if (transaction) {
      editTransaction({ ...tData, id: transaction.id });
    } else {
      addTransaction(tData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-finance-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center p-6 border-b border-finance-border">
          <h2 className="text-xl font-bold">{transaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button onClick={onClose} className="text-finance-muted hover:text-finance-text transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex bg-finance-bg p-1 rounded-xl">
            <button
              type="button"
              onClick={() => { setType('income'); setCategory(''); }}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
                type === 'income' ? 'bg-white shadow-sm text-emerald-600' : 'text-finance-muted hover:text-finance-text'
              )}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => { setType('expense'); setCategory(''); }}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
                type === 'expense' ? 'bg-white shadow-sm text-rose-600' : 'text-finance-muted hover:text-finance-text'
              )}
            >
              Expense
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-finance-text mb-1">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-finance-muted">₹</span>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-finance-bg border border-finance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-finance-green/50 focus:border-finance-green transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-finance-text mb-1">Category</label>
            <select
              required
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-finance-bg border border-finance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-finance-green/50 focus:border-finance-green transition-all"
            >
              <option value="" disabled>Select category</option>
              {CATEGORIES[type].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-finance-text mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-finance-bg border border-finance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-finance-green/50 focus:border-finance-green transition-all"
              placeholder="e.g. Groceries"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-finance-text mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-2 bg-finance-bg border border-finance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-finance-green/50 focus:border-finance-green transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-finance-text mb-1">Payment</label>
              <select
                required
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 bg-finance-bg border border-finance-border rounded-xl focus:outline-none focus:ring-2 focus:ring-finance-green/50 focus:border-finance-green transition-all"
              >
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-finance-bg hover:bg-gray-200 text-finance-text font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-finance-text hover:bg-black text-white font-medium rounded-xl transition-colors shadow-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
