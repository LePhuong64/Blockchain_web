const express = require('express');
const Question = require('../models/Question');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/questions - Lấy danh sách tất cả câu hỏi với pagination
router.get('/', authMiddleware, async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1; // Mặc định trang 1
    limit = parseInt(limit) || 10; // Mặc định 10 câu hỏi mỗi trang
    const skip = (page - 1) * limit;

    // Lấy danh sách câu hỏi có phân trang
    const questions = await Question.find()
      .populate('examId', 'name subject') // Lấy thêm thông tin bài kiểm tra
      .skip(skip)
      .limit(limit)
      .exec();

    // Đếm tổng số câu hỏi
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
