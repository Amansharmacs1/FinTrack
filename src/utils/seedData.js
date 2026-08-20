export const generateSeedData = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  const transactions = [
    { id: '1', type: 'income', amount: 5000, category: 'Freelance', description: 'Web Design Project', date: `${year}-${month}-05`, paymentMethod: 'Bank Transfer' },
    { id: '2', type: 'expense', amount: 450, category: 'Food', description: 'Groceries', date: `${year}-${month}-06`, paymentMethod: 'UPI' },
    { id: '3', type: 'expense', amount: 1200, category: 'Shopping', description: 'Clothes', date: `${year}-${month}-08`, paymentMethod: 'Credit Card' },
    { id: '4', type: 'income', amount: 8000, category: 'Project Payment', description: 'Mobile App Dev', date: `${year}-${month}-12`, paymentMethod: 'Bank Transfer' },
    { id: '5', type: 'expense', amount: 700, category: 'Transport', description: 'Fuel', date: `${year}-${month}-15`, paymentMethod: 'UPI' },
    { id: '6', type: 'income', amount: 3500, category: 'Part-time', description: 'Consulting', date: `${year}-${month}-18`, paymentMethod: 'Bank Transfer' },
    { id: '7', type: 'expense', amount: 2000, category: 'Bills', description: 'Electricity & Internet', date: `${year}-${month}-20`, paymentMethod: 'Debit Card' },
    { id: '8', type: 'income', amount: 2000, category: 'Gift', description: 'Birthday', date: `${year}-${month}-22`, paymentMethod: 'Cash' },
    { id: '9', type: 'expense', amount: 350, category: 'Entertainment', description: 'Movies', date: `${year}-${month}-25`, paymentMethod: 'UPI' },
    { id: '10', type: 'expense', amount: 900, category: 'Education', description: 'Online Course', date: `${year}-${month}-28`, paymentMethod: 'Credit Card' },
  ];

  const budgets = [
    { id: '1', category: 'Food', amount: 5000 },
    { id: '2', category: 'Shopping', amount: 2000 },
    { id: '3', category: 'Transport', amount: 1500 },
    { id: '4', category: 'Bills', amount: 3000 },
  ];

  const goals = [
    { id: '1', name: 'New Laptop', target: 80000, current: 32000, deadline: `${year}-12-31`, icon: 'Laptop' },
    { id: '2', name: 'Emergency Fund', target: 50000, current: 15000, deadline: `${year + 1}-06-30`, icon: 'Shield' }
  ];

  return { transactions, budgets, goals };
};
