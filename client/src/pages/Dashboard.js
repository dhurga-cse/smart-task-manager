import React, { useState } from 'react';
import { FiList, FiCheckCircle, FiClock, FiAlertTriangle, FiPlus, FiTrendingUp } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/ui/StatsCard';
import TaskCard from '../components/tasks/TaskCard';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import TaskForm from '../components/tasks/TaskForm';
import Loader from '../components/ui/Loader';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const { user } = useAuth();
  const { dark } = useTheme();
  const { tasks, stats, loading, createTask } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const recentTasks = tasks.slice(0, 6);
  const tickColor  = dark ? '#94a3b8' : '#64748b';
  const gridColor  = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const legendColor = dark ? '#94a3b8' : '#475569';

  const chartBase = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: legendColor, font: { family: 'Inter', size: 12 } } } },
  };

  const doughnutData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [{
      data: [stats.pending, stats.inProgress, stats.completed],
      backgroundColor: ['rgba(148,163,184,0.6)', 'rgba(59,130,246,0.6)', 'rgba(34,197,94,0.6)'],
      borderColor: ['#94a3b8', '#3b82f6', '#22c55e'],
      borderWidth: 2,
    }],
  };

  const priorityCounts = {
    high:   tasks.filter((t) => t.priority === 'high').length,
    medium: tasks.filter((t) => t.priority === 'medium').length,
    low:    tasks.filter((t) => t.priority === 'low').length,
  };

  const barData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      label: 'Tasks by Priority',
      data: [priorityCounts.high, priorityCounts.medium, priorityCounts.low],
      backgroundColor: ['rgba(239,68,68,0.6)', 'rgba(234,179,8,0.6)', 'rgba(34,197,94,0.6)'],
      borderColor: ['#ef4444', '#eab308', '#22c55e'],
      borderWidth: 2,
      borderRadius: 6,
    }],
  };

  const barOptions = {
    ...chartBase,
    scales: {
      y: { ticks: { color: tickColor }, grid: { color: gridColor } },
      x: { ticks: { color: tickColor }, grid: { display: false } },
    },
  };

  const handleCreate = async (data) => {
    setCreateLoading(true);
    try { await createTask(data); toast.success('Task created!'); setModalOpen(false); }
    catch { toast.error('Failed to create task'); }
    finally { setCreateLoading(false); }
  };

  const greetHour = new Date().getHours();
  const greeting = greetHour < 12 ? 'Good morning' : greetHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Layout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              {greeting}, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {stats.pending > 0
                ? `You have ${stats.pending} pending task${stats.pending > 1 ? 's' : ''} to tackle today.`
                : 'All caught up! Great work 🎉'}
            </p>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2 shrink-0">
            <FiPlus className="w-4 h-4" /> New Task
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard icon={FiList}          label="Total Tasks" value={stats.total}     lightGradient="bg-blue-100"   darkGradient="bg-blue-500/20"   iconColor="text-blue-500 dark:text-blue-400" />
          <StatsCard icon={FiClock}         label="Pending"     value={stats.pending}   lightGradient="bg-slate-100"  darkGradient="bg-slate-500/20"  iconColor="text-slate-500 dark:text-slate-400" />
          <StatsCard icon={FiCheckCircle}   label="Completed"   value={stats.completed} lightGradient="bg-green-100"  darkGradient="bg-green-500/20"  iconColor="text-green-600 dark:text-green-400" />
          <StatsCard icon={FiAlertTriangle} label="Overdue"     value={stats.overdue}   lightGradient="bg-red-100"    darkGradient="bg-red-500/20"    iconColor="text-red-500 dark:text-red-400" />
        </div>

        {/* Charts */}
        {stats.total > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <FiTrendingUp className="w-4 h-4 text-blue-500" /> Task Status
              </h2>
              <div className="flex items-center justify-center h-52">
                <Doughnut data={doughnutData} options={chartBase} />
              </div>
            </div>
            <div className="card">
              <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <FiAlertTriangle className="w-4 h-4 text-yellow-500" /> Priority Breakdown
              </h2>
              <div className="h-52">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>
        )}

        {/* Recent Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">Recent Tasks</h2>
            {tasks.length > 6 && (
              <a href="/tasks" className="text-blue-500 dark:text-blue-400 hover:underline text-sm transition-colors">
                View all →
              </a>
            )}
          </div>
          {loading ? (
            <div className="flex justify-center py-12"><Loader size="lg" /></div>
          ) : recentTasks.length === 0 ? (
            <EmptyState onAdd={() => setModalOpen(true)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {recentTasks.map((task) => <TaskCard key={task._id} task={task} />)}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Task">
        <TaskForm onSubmit={handleCreate} loading={createLoading} />
      </Modal>
    </Layout>
  );
};

export default Dashboard;
