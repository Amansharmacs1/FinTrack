import React, { useState } from 'react';
import { Plus, X, TrendingUp, TrendingDown } from 'lucide-react';
import { TransactionModal } from '../Transactions/TransactionModal';
import { cn } from '../Layout/Sidebar';

export const QuickAdd = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'income' or 'expense'

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay for quick options */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end justify-center pb-24 md:pb-8 md:items-end md:justify-end md:pr-8 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div className="flex flex-col gap-4 items-center md:items-end mb-4 animate-in slide-in-from-bottom-8 duration-300" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => handleOpenModal('income')}
              className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-100 hover:scale-105 transition-transform"
            >
              <span className="text-xl font-bold text-emerald-600">💰 Add Income</span>
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                <TrendingUp className="w-5 h-5" />
              </div>
            </button>
            <button 
              onClick={() => handleOpenModal('expense')}
              className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-100 hover:scale-105 transition-transform"
            >
              <span className="text-xl font-bold text-rose-600">💸 Add Expense</span>
              <div className="p-2 bg-rose-100 text-rose-600 rounded-full">
                <TrendingDown className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed z-[70] bottom-20 md:bottom-8 right-4 md:right-8 w-14 h-14 bg-finance-text text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-300",
          isOpen && "rotate-45 bg-gray-200 text-finance-text shadow-none border border-gray-300"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>

      {/* Actual Form Modal */}
      {modalType && (
        <TransactionModal 
          isOpen={true} 
          onClose={() => setModalType(null)} 
          initialType={modalType}
        />
      )}
    </>
  );
};
