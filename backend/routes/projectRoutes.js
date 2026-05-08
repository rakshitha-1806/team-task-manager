const express = require('express');
const Project = require('../models/Project');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all projects
router.get('/', protect, async (req, res) => {
  const projects = await Project.find().populate('members', 'name email').populate('createdBy', 'name');
  res.json(projects);
});

// Create project (Admin only)
router.post('/', protect, admin, async (req, res) => {
  const { name, description, members } = req.body;
  const project = await Project.create({
    name,
    description,
    members,
    createdBy: req.user._id
  });
  res.status(201).json(project);
});

// Update project (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(project);
});

// Delete project (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: 'Project removed' });
});

module.exports = router;