// server/routes/todos.js - Todo CRUD routes
const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');

const DB_URL = process.env.DB_URL || 'http://localhost:3001';

// Apply auth middleware to all todo routes
router.use(authMiddleware);

// GET /api/todos - Get all todos for the authenticated user
router.get('/', async (req, res) => {
  try {
    const { search, status, priority, category, favorite, sort, page = 1, limit = 10 } = req.query;
    let url = `${DB_URL}/todos?userId=${req.user.id}`;

    // Filters
    if (status) url += `&status=${status}`;
    if (priority) url += `&priority=${priority}`;
    if (category) url += `&category=${category}`;
    if (favorite === 'true') url += `&favorite=true`;

    // Sorting
    if (sort) {
      const sortMap = {
        'newest': '&_sort=createdAt&_order=desc',
        'oldest': '&_sort=createdAt&_order=asc',
        'priority-high': '&_sort=priority&_order=desc',
        'priority-low': '&_sort=priority&_order=asc',
        'alphabetical': '&_sort=title&_order=asc',
        'deadline': '&_sort=deadline&_order=asc'
      };
      url += sortMap[sort] || '&_sort=createdAt&_order=desc';
    } else {
      url += '&_sort=createdAt&_order=desc';
    }

    const response = await axios.get(url);
    let todos = response.data;

    // Search filter (client-side since json-server has limited search)
    if (search) {
      const searchLower = search.toLowerCase();
      todos = todos.filter(todo =>
        todo.title?.toLowerCase().includes(searchLower) ||
        todo.description?.toLowerCase().includes(searchLower) ||
        todo.category?.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const total = todos.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedTodos = todos.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      todos: paginatedTodos,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get todos error:', error.message);
    res.status(500).json({ message: 'Error fetching todos' });
  }
});

// POST /api/todos - Create a new todo
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, category, deadline, reminder } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTodo = {
      userId: req.user.id,
      title,
      description: description || '',
      priority: priority || 'medium',
      category: category || 'general',
      status: 'pending',
      favorite: false,
      reminder: reminder || null,
      deadline: deadline || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
      deletedAt: null
    };

    const response = await axios.post(`${DB_URL}/todos`, newTodo);
    res.status(201).json({ message: 'Todo created successfully', todo: response.data });
  } catch (error) {
    console.error('Create todo error:', error.message);
    res.status(500).json({ message: 'Error creating todo' });
  }
});

// PUT /api/todos/:id - Update a todo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date().toISOString() };

    // If marking as completed, set completedAt
    if (updates.status === 'completed' && !updates.completedAt) {
      updates.completedAt = new Date().toISOString();
    }

    // If undoing completion, clear completedAt
    if (updates.status === 'pending') {
      updates.completedAt = null;
    }

    const response = await axios.patch(`${DB_URL}/todos/${id}`, updates);
    res.json({ message: 'Todo updated successfully', todo: response.data });
  } catch (error) {
    console.error('Update todo error:', error.message);
    res.status(500).json({ message: 'Error updating todo' });
  }
});

// DELETE /api/todos/:id - Soft delete a todo (move to history)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get the todo first
    const todoResponse = await axios.get(`${DB_URL}/todos/${id}`);
    const todo = todoResponse.data;

    // Move to history
    const historyItem = {
      ...todo,
      originalId: todo.id,
      deletedAt: new Date().toISOString(),
      action: 'deleted'
    };
    delete historyItem.id;
    await axios.post(`${DB_URL}/history`, historyItem);

    // Delete from todos
    await axios.delete(`${DB_URL}/todos/${id}`);

    res.json({ message: 'Todo moved to history' });
  } catch (error) {
    console.error('Delete todo error:', error.message);
    res.status(500).json({ message: 'Error deleting todo' });
  }
});

module.exports = router;
