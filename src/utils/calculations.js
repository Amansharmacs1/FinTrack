export const calculateTotalIncome = (transactions, filter = null) => {
  return transactions
    .filter(t => t.type === 'income')
    .filter(t => (filter ? filter(t) : true))
    .reduce((sum, t) => sum + Number(t.amount), 0);
};

export const calculateTotalExpenses = (transactions, filter = null) => {
  return transactions
    .filter(t => t.type === 'expense')
    .filter(t => (filter ? filter(t) : true))
    .reduce((sum, t) => sum + Number(t.amount), 0);
};

export const calculateBalance = (transactions) => {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
};

export const calculateSavings = (income, expenses) => {
  return income - expenses;
};

export const calculateSavingsRate = (income, expenses) => {
  if (income === 0) return 0;
  return ((income - expenses) / income) * 100;
};

export const groupTransactionsByCategory = (transactions, type) => {
  const filtered = transactions.filter(t => t.type === type);
  const grouped = filtered.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});
  
  return Object.keys(grouped).map(key => ({
    name: key,
    value: grouped[key]
  })).sort((a, b) => b.value - a.value);
};

// Insights logic for irregular income
export const analyzeIrregularIncome = (transactions) => {
  const incomes = transactions.filter(t => t.type === 'income').sort((a, b) => new Date(a.date) - new Date(b.date));
  const expenses = transactions.filter(t => t.type === 'expense');
  
  if (incomes.length === 0) return null;

  const totalIncome = incomes.reduce((sum, t) => sum + Number(t.amount), 0);
  const avgIncomeEvent = totalIncome / incomes.length;
  
  const amounts = incomes.map(t => Number(t.amount));
  const highestEvent = Math.max(...amounts);
  const lowestEvent = Math.min(...amounts);
  
  // Calculate days between events if more than 1
  let avgDaysBetween = 0;
  if (incomes.length > 1) {
    let totalDays = 0;
    for (let i = 1; i < incomes.length; i++) {
      const diffTime = Math.abs(new Date(incomes[i].date) - new Date(incomes[i-1].date));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      totalDays += diffDays;
    }
    avgDaysBetween = totalDays / (incomes.length - 1);
  }

  const currentBalance = calculateBalance(transactions);
  
  // Simple avg monthly expense (based on available data, simplifying for now to total expenses / months active)
  const totalExpenseAmount = calculateTotalExpenses(transactions);
  const firstTransactionDate = transactions.length > 0 
    ? new Date(Math.min(...transactions.map(t => new Date(t.date))))
    : new Date();
  
  const now = new Date();
  const monthsDiff = Math.max(1, (now.getFullYear() - firstTransactionDate.getFullYear()) * 12 + now.getMonth() - firstTransactionDate.getMonth());
  const avgMonthlyExpense = totalExpenseAmount / monthsDiff;

  const runwayMonths = avgMonthlyExpense > 0 ? currentBalance / avgMonthlyExpense : 0;

  return {
    eventCount: incomes.length,
    avgIncomeEvent,
    avgDaysBetween,
    highestEvent,
    lowestEvent,
    currentBalance,
    avgMonthlyExpense,
    runwayMonths
  };
};
