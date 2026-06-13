import React from 'react';
import { FiCheckSquare, FiPlus } from 'react-icons/fi';

const EmptyState = ({ onAdd, message = 'No tasks found', sub = 'Create your first task to get started!' }) => (
  <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
    <div className="w-24 h-24 rounded-full
                    bg-gradient-to-br from-blue-100 to-purple-100
                    dark:from-blue-500/20 dark:to-purple-500/20
                    flex items-center justify-center mb-6
                    border border-blue-200 dark:border-blue-500/30 shadow-sm">
      <FiCheckSquare className="w-10 h-10 text-blue-500 dark:text-blue-400" />
    </div>
    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">{message}</h3>
    <p className="text-slate-400 dark:text-slate-500 text-sm mb-6 text-center max-w-xs">{sub}</p>
    {onAdd && (
      <button onClick={onAdd} className="btn-primary flex items-center gap-2">
        <FiPlus className="w-4 h-4" /> Create Task
      </button>
    )}
  </div>
);

export default EmptyState;
