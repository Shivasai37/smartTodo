// server/middleware/auth.js - Simple token-based auth middleware
const axios = require('axios');
const DB_URL = process.env.DB_URL || 'http://localhost:3001';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided. Please login.' });
    }

    // Verify token exists in users collection
    const response = await axios.get(`${DB_URL}/users`);
    const user = response.data.find(u => u.token === token);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token. Please login again.' });
    }

    req.user = { id: user.id, name: user.name, email: user.email };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(500).json({ message: 'Authentication error' });
  }
};

module.exports = authMiddleware;
