// server/routes/history.js - History routes
const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');

const DB_URL = process.env.DB_URL || 'http://localhost:3001';

// Apply auth middleware
router.use(authMiddleware);

// GET /api/history - Get all history items for the authenticated user
router.get('/', async (req, res) => {
  try {
    const { search, action, sort } = req.query;
    let url = `${DB_URL}/history?userId=${req.user.id}`;

    if (action) url += `&action=${action}`;

    if (sort) {
      const sortMap = {
        'newest': '&_sort=deletedAt&_order=desc',
        'oldest': '&_sort=deletedAt&_order=asc',
        'alphabetical': '&_sort=title&_order=asc'
      };
      url += sortMap[sort] || '&_sort=deletedAt&_order=desc';
    } else {
      url += '&_sort=deletedAt&_order=desc';
    }

    const response = await axios.get(url);
    let items = response.data;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter(item =>
        item.title?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower)
      );
    }

    res.json({ history: items, total: items.length });
  } catch (error) {
    console.error('Get history error:', error.message);
    res.status(500).json({ message: 'Error fetching history' });
  }
});

// POST /api/history - Add to history (used when completing a todo)
router.post('/', async (req, res) => {
  try {
    const historyItem = {
      ...req.body,
      deletedAt: new Date().toISOString()
    };

    const response = await axios.post(`${DB_URL}/history`, historyItem);
    res.status(201).json({ message: 'Added to history', item: response.data });
  } catch (error) {
    console.error('Add to history error:', error.message);
    res.status(500).json({ message: 'Error adding to history' });
  }
});

// PUT /api/history/restore/:id - Restore item from history back to todos
router.put('/restore/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get the history item
    const historyResponse = await axios.get(`${DB_URL}/history/${id}`);
    const historyItem = historyResponse.data;

    // Create restored todo
    const restoredTodo = {
      userId: historyItem.userId,
      title: historyItem.title,
      description: historyItem.description,
      priority: historyItem.priority,
      category: historyItem.category,
      status: 'pending',
      favorite: historyItem.favorite || false,
      reminder: historyItem.reminder || null,
      deadline: historyItem.deadline || null,
      createdAt: historyItem.createdAt,
      updatedAt: new Date().toISOString(),
      completedAt: null,
      deletedAt: null
    };

    // Add back to todos
    await axios.post(`${DB_URL}/todos`, restoredTodo);

    // Remove from history
    await axios.delete(`${DB_URL}/history/${id}`);

    res.json({ message: 'Todo restored successfully' });
  } catch (error) {
    console.error('Restore error:', error.message);
    res.status(500).json({ message: 'Error restoring todo' });
  }
});

// DELETE /api/history/:id - Permanently delete from history
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await axios.delete(`${DB_URL}/history/${id}`);
    res.json({ message: 'Permanently deleted' });
  } catch (error) {
    console.error('Permanent delete error:', error.message);
    res.status(500).json({ message: 'Error permanently deleting' });
  }
});

module.exports = router;
