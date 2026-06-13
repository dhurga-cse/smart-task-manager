import { format, isAfter, isBefore, parseISO, isValid } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return 'No due date';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return 'Invalid date';
  return format(d, 'MMM dd, yyyy');
};

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false;
  const d = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return isBefore(d, new Date());
};

export const isDueSoon = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false;
  const d = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  const soon = new Date(); soon.setDate(soon.getDate() + 3);
  return isAfter(d, new Date()) && isBefore(d, soon);
};

// Tailwind classes work in both light & dark via dark: prefix
export const priorityConfig = {
  high:   { label: 'High',   color: 'bg-red-50    dark:bg-red-500/20    text-red-600    dark:text-red-400    border-red-200    dark:border-red-500/30',    dot: 'bg-red-500'    },
  medium: { label: 'Medium', color: 'bg-yellow-50 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30', dot: 'bg-yellow-500' },
  low:    { label: 'Low',    color: 'bg-green-50  dark:bg-green-500/20  text-green-600  dark:text-green-400  border-green-200  dark:border-green-500/30',  dot: 'bg-green-500'  },
};

export const statusConfig = {
  pending:       { label: 'Pending',     color: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600', dot: 'bg-slate-400 dark:bg-slate-400' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-50   dark:bg-blue-500/20  text-blue-600  dark:text-blue-400  border-blue-200  dark:border-blue-500/30',  dot: 'bg-blue-500'  },
  completed:     { label: 'Completed',   color: 'bg-green-50  dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30', dot: 'bg-green-500' },
};
