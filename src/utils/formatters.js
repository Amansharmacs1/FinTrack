import { format } from 'date-fns';

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  return format(new Date(dateString), 'dd MMM yyyy');
};

export const formatMonthYear = (dateString) => {
  return format(new Date(dateString), 'MMM yyyy');
};
