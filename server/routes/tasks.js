const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

const emitUpdate = (req, event, data) => {
  if (req.io) req.io.to(req.user._id.toString()).emit(event, data);
};

router.get('/', async (req, res) => {
  try {
    const { status, priority, search, sort } = req.query;
    const filter = { userId: req.user._id };
    if (status && status !== 'all') filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: 'i' };

    let sortObj = { createdAt: -1 };
    if (sort === 'priority') sortObj = { priority: 1, createdAt: -1 };
    if (sort === 'dueDate') sortObj = { dueDate: 1, createdAt: -1 };

    const tasks = await Task.find(filter).sort(sortObj);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, tags } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const task = await Task.create({
      userId: req.user._id,
      title, description, priority, status, dueDate, tags,
    });
    emitUpdate(req, 'task:created', task);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    emitUpdate(req, 'task:updated', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    emitUpdate(req, 'task:deleted', { _id: req.params.id });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;
    const [total, pending, inProgress, completed] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: 'pending' }),
      Task.countDocuments({ userId, status: 'in-progress' }),
      Task.countDocuments({ userId, status: 'completed' }),
    ]);
    const overdue = await Task.countDocuments({
      userId, status: { $ne: 'completed' }, dueDate: { $lt: new Date() },
    });
    res.json({ total, pending, inProgress, completed, overdue });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
