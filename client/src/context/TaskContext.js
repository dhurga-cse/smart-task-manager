import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', search: '', sort: 'createdAt' });

  const socketRef = useRef(null);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;
      const { data } = await api.get('/tasks', { params });
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/tasks/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  useEffect(() => { fetchStats(); }, [fetchStats, tasks]);

  // Socket.io — only apply events from OTHER tabs (not self)
  useEffect(() => {
    if (!user) return;
    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
    socketRef.current = socket;
    socket.emit('join', user._id);

    // Events only fire for other tabs — self-tab uses direct state updates below
    socket.on('task:created', (task) => {
      setTasks((prev) => {
        if (prev.find((t) => t._id === task._id)) return prev; // already exists, skip
        return [task, ...prev];
      });
    });

    socket.on('task:updated', (task) => {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    });

    socket.on('task:deleted', ({ _id }) => {
      setTasks((prev) => prev.filter((t) => t._id !== _id));
    });

    return () => { socket.disconnect(); socketRef.current = null; };
  }, [user]);

  const createTask = async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    // Directly update state — socket event deduplicates via ID check
    setTasks((prev) => (prev.find((t) => t._id === data._id) ? prev : [data, ...prev]));
    fetchStats();
    return data;
  };

  const updateTask = async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    fetchStats();
    return data;
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    fetchStats();
  };

  const markComplete = (id) => updateTask(id, { status: 'completed' });

  return (
    <TaskContext.Provider value={{
      tasks, stats, loading, filters, setFilters,
      fetchTasks, createTask, updateTask, deleteTask, markComplete,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
