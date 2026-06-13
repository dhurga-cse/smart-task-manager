import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiAlertCircle } from 'react-icons/fi';
import Loader from '../ui/Loader';

const defaultForm = { title: '', description: '', priority: 'medium', status: 'pending', dueDate: null, tags: '' };

const TaskForm = ({ onSubmit, initialData, loading }) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'medium',
        status: initialData.status || 'pending',
        dueDate: initialData.dueDate ? new Date(initialData.dueDate) : null,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [] });
  };

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title *</label>
        <input
          className={`input-field ${errors.title ? 'border-red-400 focus:ring-red-300' : ''}`}
          placeholder="Enter task title..."
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
        />
        {errors.title && (
          <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
            <FiAlertCircle className="w-3 h-3" /> {errors.title}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
        <textarea className="input-field resize-none" rows={3} placeholder="Describe the task..."
          value={form.description} onChange={(e) => set('description', e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
          <select className="input-field" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
          <select className="input-field" value={form.status} onChange={(e) => set('status', e.target.value)}>
            <option value="pending">⏳ Pending</option>
            <option value="in-progress">🔵 In Progress</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Due Date</label>
        <DatePicker selected={form.dueDate} onChange={(date) => set('dueDate', date)}
          placeholderText="Select due date..." minDate={new Date()} dateFormat="MMM dd, yyyy" isClearable />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tags (comma separated)</label>
        <input className="input-field" placeholder="design, backend, urgent..."
          value={form.tags} onChange={(e) => set('tags', e.target.value)} />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
        {loading ? <><Loader size="sm" /> Saving...</> : (initialData?._id ? 'Update Task' : 'Create Task')}
      </button>
    </form>
  );
};

export default TaskForm;
