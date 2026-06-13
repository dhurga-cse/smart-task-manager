import React, { useState } from 'react';
import { FiEdit2, FiCheck, FiX, FiMail, FiCheckCircle, FiList, FiClock, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import Layout from '../components/layout/Layout';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { stats } = useTasks();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [loading, setLoading] = useState(false);

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Name is required');
    setLoading(true);
    try { updateUser(form); toast.success('Profile updated!'); setEditing(false); }
    catch { toast.error('Failed to update profile'); }
    finally { setLoading(false); }
  };

  const statItems = [
    { icon: FiList,          label: 'Total Tasks', value: stats.total,     lightCls: 'bg-blue-100 text-blue-600',   darkCls: 'dark:bg-blue-500/20 dark:text-blue-400' },
    { icon: FiCheckCircle,   label: 'Completed',   value: stats.completed, lightCls: 'bg-green-100 text-green-600', darkCls: 'dark:bg-green-500/20 dark:text-green-400' },
    { icon: FiClock,         label: 'Pending',     value: stats.pending,   lightCls: 'bg-slate-100 text-slate-600', darkCls: 'dark:bg-slate-700 dark:text-slate-300' },
    { icon: FiAlertTriangle, label: 'Overdue',     value: stats.overdue,   lightCls: 'bg-red-100 text-red-600',     darkCls: 'dark:bg-red-500/20 dark:text-red-400' },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Profile</h1>

        {/* Profile Card */}
        <div className="card">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
              <span className="text-white font-bold text-2xl">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-3">
                  <input className="input-field" placeholder="Your name"
                    value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                  <textarea className="input-field resize-none" rows={2} placeholder="Bio (optional)"
                    value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} />
                  <div className="flex gap-2">
                    <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-1.5 text-sm">
                      <FiCheck className="w-4 h-4" /> Save
                    </button>
                    <button onClick={() => setEditing(false)} className="btn-secondary flex items-center gap-1.5 text-sm">
                      <FiX className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{user?.name}</h2>
                    <button onClick={() => setEditing(true)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-2">
                    <FiMail className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                  {user?.bio && <p className="text-slate-500 dark:text-slate-400 text-sm">{user.bio}</p>}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Task Completion Rate</h3>
            <span className="text-2xl font-bold text-slate-800 dark:text-white">{completionRate}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-700"
              style={{ width: `${completionRate}%` }} />
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{stats.completed} of {stats.total} tasks completed</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {statItems.map(({ icon: Icon, label, value, lightCls, darkCls }) => (
            <div key={label} className="card flex items-center gap-4 card-hover">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${lightCls} ${darkCls}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-xs">{label}</p>
                <p className="text-slate-800 dark:text-white font-bold text-xl">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
