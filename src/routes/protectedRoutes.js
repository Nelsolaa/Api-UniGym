const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');


const router = express.Router();

router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Acesso autorizado!', userId: req.userId });
});

module.exports = { protectedRoutes: router };
