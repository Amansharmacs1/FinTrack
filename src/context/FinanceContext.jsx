import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/storage';
import { generateSeedData } from '../utils/seedData';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [settings, setSettings] = useState({ currency: 'INR', theme: 'light' });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const isFirstLaunch = getFromStorage('first_launch', true);
    
    if (isFirstLaunch) {
      const seed = generateSeedData();
      setTransactions(seed.transactions);
      setBudgets(seed.budgets);
      setGoals(seed.goals);
      saveToStorage('transactions', seed.transactions);
      saveToStorage('budgets', seed.budgets);
      saveToStorage('goals', seed.goals);
      saveToStorage('first_launch', false);
    } else {
      setTransactions(getFromStorage('transactions', []));
      setBudgets(getFromStorage('budgets', []));
      setGoals(getFromStorage('goals', []));
      setSettings(getFromStorage('settings', { currency: 'INR', theme: 'light' }));
    }
    setIsLoaded(true);
  }, []);

  // Sync to storage on change
  useEffect(() => { if (isLoaded) saveToStorage('transactions', transactions); }, [transactions, isLoaded]);
  useEffect(() => { if (isLoaded) saveToStorage('budgets', budgets); }, [budgets, isLoaded]);
  useEffect(() => { if (isLoaded) saveToStorage('goals', goals); }, [goals, isLoaded]);
  useEffect(() => { if (isLoaded) saveToStorage('settings', settings); }, [settings, isLoaded]);

  const addTransaction = (t) => setTransactions(prev => [...prev, { ...t, id: Date.now().toString() }]);
  const editTransaction = (t) => setTransactions(prev => prev.map(item => item.id === t.id ? t : item));
  const deleteTransaction = (id) => setTransactions(prev => prev.filter(t => t.id !== id));

  const addBudget = (b) => setBudgets(prev => [...prev, { ...b, id: Date.now().toString() }]);
  const editBudget = (b) => setBudgets(prev => prev.map(item => item.id === b.id ? b : item));
  const deleteBudget = (id) => setBudgets(prev => prev.filter(b => b.id !== id));

  const addGoal = (g) => setGoals(prev => [...prev, { ...g, id: Date.now().toString() }]);
  const editGoal = (g) => setGoals(prev => prev.map(item => item.id === g.id ? g : item));
  const deleteGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id));

  const updateSettings = (newSettings) => setSettings(prev => ({ ...prev, ...newSettings }));

  const value = {
    transactions, addTransaction, editTransaction, deleteTransaction,
    budgets, addBudget, editBudget, deleteBudget,
    goals, addGoal, editGoal, deleteGoal,
    settings, updateSettings
  };

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
