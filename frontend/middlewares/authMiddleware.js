const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import model User
const dotenv = require('dotenv');

dotenv.config(); // Load biến môi trường từ .env

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');
  if (token) {
    try {
      const decoded = jwt.verify(token.split(' ')[1], 'your_jwt_secret');
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
        next();
      } else {
        console.log('User not found');
        return res.status(401).json({ error: 'Unauthorized: User not found' });
      }
    } catch (error) {
      console.log('Invalid token:', error.message);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  } else {
    console.log('No token provided');
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
};

module.exports = authMiddleware;
