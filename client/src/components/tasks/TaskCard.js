import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiCheck, FiCalendar, FiTag, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useTasks } from '../../context/TaskContext';
import { formatDate, isOverdue, isDueSoon, priorityConfig, statusConfig } from '../../utils/helpers';
import Modal from '../ui/Modal';
import TaskForm from './TaskForm';

const TaskCard = ({ task }) => {
  const { updateTask, deleteTask, markComplete } = useTasks();
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const status   = statusConfig[task.status]     || statusConfig.pending;
  const overdue  = isOverdue(task.dueDate, task.status);
  const dueSoon  = isDueSoon(task.dueDate, task.status);

  const handleEdit = async (data) => {
    setEditLoading(true);
    try { await updateTask(task._id, data); toast.success('Task updated!'); setEditOpen(false); }
    catch { toast.error('Failed to update task'); }
    finally { setEditLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    try { await deleteTask(task._id); toast.success('Task deleted'); }
    catch { toast.error('Failed to delete task'); setDeleting(false); }
  };

  const handleComplete = async () => {
    try { await markComplete(task._id); toast.success('Task marked as complete!'); }
    catch { toast.error('Failed to update task'); }
  };

  return (
    <>
      <div className={`group animate-fade-in
                       bg-white dark:bg-slate-800
                       border border-slate-200 dark:border-slate-700
                       rounded-xl p-5
                       shadow-sm hover:shadow-md dark:hover:shadow-slate-900/60
                       hover:border-slate-300 dark:hover:border-slate-600
                       hover:-translate-y-0.5 transition-all duration-300
                       ${task.status === 'completed' ? 'opacity-60' : ''}`}>

        {/* Title + actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className={`font-semibold text-sm leading-tight flex-1
                          text-slate-800 dark:text-white
                          ${task.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
            {task.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {task.status !== 'completed' && (
              <button onClick={handleComplete} title="Mark complete"
                className="p-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-500/20
                           text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                <FiCheck className="w-3.5 h-3.5" />
              </button>
            )}
            <button onClick={() => setEditOpen(true)} title="Edit"
              className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20
                         text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <FiEdit2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleDelete} disabled={deleting} title="Delete"
              className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20
                         text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-3 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`badge ${priority.color}`}><span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />{priority.label}</span>
          <span className={`badge ${status.color}`}><span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />{status.label}</span>
          {overdue  && <span className="badge bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30"><FiClock className="w-3 h-3" /> Overdue</span>}
          {dueSoon && !overdue && <span className="badge bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30"><FiClock className="w-3 h-3" /> Due Soon</span>}
        </div>

        {/* Tags */}
        {task.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
                                          bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                <FiTag className="w-2.5 h-2.5" /> {tag}
              </span>
            ))}
          </div>
        )}

        {/* Due date */}
        <div className={`flex items-center gap-1.5 text-xs ${overdue ? 'text-red-500 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'}`}>
          <FiCalendar className="w-3 h-3" />
          <span>{formatDate(task.dueDate)}</span>
        </div>
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Task">
        <TaskForm onSubmit={handleEdit} initialData={task} loading={editLoading} />
      </Modal>
    </>
  );
};

export default TaskCard;
