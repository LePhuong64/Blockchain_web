const express = require('express');
const Question = require('../models/Question');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/questions - Lấy danh sách tất cả câu hỏi với pagination
router.get('/', authMiddleware, async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1; 
    limit = parseInt(limit) || 10; 
    const skip = (page - 1) * limit;


    const questions = await Question.find()
      .populate('examId', 'name subject') 
      .skip(skip)
      .limit(limit)
      .exec();

  
    const total = await Question.countDocuments();

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: questions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
