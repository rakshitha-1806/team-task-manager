const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Get tasks (filtered by project or assignedTo)
router.get('/', protect, async (req, res) => {
  const { projectId } = req.query;
  const filter = projectId ? { project: projectId } : {};
  if (req.user.role === 'Member') {
    filter.assignedTo = req.user._id;
  }
  const tasks = await Task.find(filter).populate('assignedTo', 'name').populate('project', 'name');
  res.json(tasks);
});

// Dashboard stats
router.get('/dashboard', protect, async (req, res) => {
  try {
    let taskFilter = {};
    if (req.user && req.user.role === 'Member') {
      taskFilter.assignedTo = req.user._id;
    }
    const tasks = await Task.find(taskFilter);
    const totalProjects = await Project.countDocuments();
    
    const stats = {
      totalProjects,
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      pending: tasks.filter(t => t.status === 'Pending').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard: ' + error.message });
  }
});

// Create task
router.post('/', protect, async (req, res) => {
  const task = await Task.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(task);
});

// Update task status
router.put('/:id', protect, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// Delete task
router.delete('/:id', protect, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task removed' });
});

module.exports = router;