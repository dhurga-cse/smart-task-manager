import React, { useState } from 'react';
import { FiPlus, FiSearch, FiGrid, FiClock, FiZap, FiCheckCircle, FiColumns } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTasks } from '../context/TaskContext';
import Layout from '../components/layout/Layout';
import TaskCard from '../components/tasks/TaskCard';
import Modal from '../components/ui/Modal';
import TaskForm from '../components/tasks/TaskForm';
import EmptyState from '../components/ui/EmptyState';
import Loader from '../components/ui/Loader';

const COLUMNS = [
  {
    key: 'pending',
    label: 'Pending',
    icon: FiClock,
    topBar:     'bg-slate-400',
    headerLight: 'bg-slate-50  border-slate-200',
    headerDark:  'dark:bg-slate-800/60 dark:border-slate-700',
    iconLight:   'text-slate-500',
    iconDark:    'dark:text-slate-400',
    countLight:  'bg-slate-200  text-slate-600',
    countDark:   'dark:bg-slate-700 dark:text-slate-300',
    dropLight:   'bg-slate-100/60',
    dropDark:    'dark:bg-slate-700/20',
    colLight:    'bg-slate-50/50  border-slate-200',
    colDark:     'dark:bg-slate-800/30 dark:border-slate-700',
  },
  {
    key: 'in-progress',
    label: 'In Progress',
    icon: FiZap,
    topBar:      'bg-blue-500',
    headerLight: 'bg-blue-50  border-blue-200',
    headerDark:  'dark:bg-blue-500/10 dark:border-blue-500/30',
    iconLight:   'text-blue-500',
    iconDark:    'dark:text-blue-400',
    countLight:  'bg-blue-100  text-blue-700',
    countDark:   'dark:bg-blue-500/20 dark:text-blue-300',
    dropLight:   'bg-blue-50/60',
    dropDark:    'dark:bg-blue-500/10',
    colLight:    'bg-blue-50/30  border-blue-200',
    colDark:     'dark:bg-blue-900/10 dark:border-blue-500/20',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: FiCheckCircle,
    topBar:      'bg-green-500',
    headerLight: 'bg-green-50  border-green-200',
    headerDark:  'dark:bg-green-500/10 dark:border-green-500/30',
    iconLight:   'text-green-600',
    iconDark:    'dark:text-green-400',
    countLight:  'bg-green-100  text-green-700',
    countDark:   'dark:bg-green-500/20 dark:text-green-300',
    dropLight:   'bg-green-50/60',
    dropDark:    'dark:bg-green-500/10',
    colLight:    'bg-green-50/30  border-green-200',
    colDark:     'dark:bg-green-900/10 dark:border-green-500/20',
  },
];

const Tasks = () => {
  const { tasks, loading, createTask, updateTask, filters, setFilters } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [viewMode, setViewMode] = useState('kanban'); // kanban is default
  const [presetStatus, setPresetStatus] = useState('pending');

  const openModalWithStatus = (status) => {
    setPresetStatus(status);
    setModalOpen(true);
  };

  const handleCreate = async (data) => {
    setCreateLoading(true);
    try {
      await createTask(data);
      toast.success('Task created!');
      setModalOpen(false);
    } catch {
      toast.error('Failed to create task');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination || destination.droppableId === source.droppableId) return;
    try {
      await updateTask(draggableId, { status: destination.droppableId });
      toast.success('Task moved!');
    } catch {
      toast.error('Failed to move task');
    }
  };

  return (
    <Layout>
      <div className="space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tasks</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-sm">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} &nbsp;·&nbsp;
              {tasks.filter(t => t.status === 'completed').length} completed
            </p>
          </div>
          <button onClick={() => openModalWithStatus('pending')} className="btn-primary flex items-center gap-2 shrink-0">
            <FiPlus className="w-4 h-4" /> New Task
          </button>
        </div>

        {/* ── Filters Bar ── */}
        <div className="card flex flex-col md:flex-row gap-3 py-3">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className="input-field pl-9" placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} />
          </div>

          {/* Sort */}
          <select className="input-field text-sm md:w-36" value={filters.sort}
            onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}>
            <option value="createdAt">Latest</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>

          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
            {[
              { val: 'kanban', icon: FiColumns, title: 'Kanban View' },
              { val: 'grid',   icon: FiGrid,    title: 'Grid View'   },
            ].map(({ val, icon: Icon, title }) => (
              <button key={val} title={title} onClick={() => setViewMode(val)}
                className={`px-3 py-2.5 flex items-center gap-1.5 text-sm font-medium transition-colors
                  ${viewMode === val
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white'}`}>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{val === 'kanban' ? 'Board' : 'Grid'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader size="lg" /></div>
        ) : tasks.length === 0 && !filters.search ? (
          <EmptyState onAdd={() => openModalWithStatus('pending')} />
        ) : viewMode === 'grid' ? (
          /* ── Grid View ── */
          tasks.length === 0 ? (
            <EmptyState message="No tasks found" sub="Try adjusting your search." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {tasks.map((task) => <TaskCard key={task._id} task={task} />)}
            </div>
          )
        ) : (
          /* ── Kanban Board ── */
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {COLUMNS.map(({ key, label, icon: Icon, topBar, headerLight, headerDark,
                              iconLight, iconDark, countLight, countDark,
                              dropLight, dropDark, colLight, colDark }) => {
                const colTasks = tasks.filter((t) => t.status === key);
                return (
                  <div key={key}
                    className={`rounded-2xl border flex flex-col transition-colors duration-300 overflow-hidden
                                ${colLight} ${colDark}`}>

                    {/* Colored top accent bar */}
                    <div className={`h-1 w-full ${topBar}`} />

                    {/* Column header */}
                    <div className={`flex items-center justify-between px-4 py-3 border-b ${headerLight} ${headerDark}`}>
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${iconLight} ${iconDark}`} />
                        <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${countLight} ${countDark}`}>
                          {colTasks.length}
                        </span>
                        {/* Quick-add per column */}
                        <button
                          onClick={() => openModalWithStatus(key)}
                          title={`Add to ${label}`}
                          className={`w-6 h-6 rounded-full flex items-center justify-center
                                      ${iconLight} ${iconDark}
                                      hover:bg-black/10 dark:hover:bg-white/10 transition-colors`}>
                          <FiPlus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Droppable area */}
                    <Droppable droppableId={key}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 p-3 space-y-3 min-h-[200px] transition-colors duration-200
                                      ${snapshot.isDraggingOver ? `${dropLight} ${dropDark}` : ''}`}>

                          {colTasks.map((task, index) => (
                            <Draggable key={task._id} draggableId={task._id} index={index}>
                              {(prov, snap) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  {...prov.dragHandleProps}
                                  className={`transition-all duration-200 cursor-grab active:cursor-grabbing
                                              ${snap.isDragging ? 'shadow-2xl rotate-1 scale-[1.02] z-50' : ''}`}>
                                  <TaskCard task={task} />
                                </div>
                              )}
                            </Draggable>
                          ))}

                          {provided.placeholder}

                          {/* Empty column state */}
                          {colTasks.length === 0 && (
                            <div
                              onClick={() => openModalWithStatus(key)}
                              className="flex flex-col items-center justify-center py-10 rounded-xl border-2 border-dashed
                                         border-slate-200 dark:border-slate-700
                                         text-slate-300 dark:text-slate-600
                                         hover:border-slate-300 dark:hover:border-slate-600
                                         hover:text-slate-400 dark:hover:text-slate-500
                                         transition-all duration-200 cursor-pointer group">
                              <FiPlus className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-medium">Add task</span>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Task">
        <TaskForm
          onSubmit={handleCreate}
          loading={createLoading}
          initialData={{ status: presetStatus }}
        />
      </Modal>
    </Layout>
  );
};

export default Tasks;
