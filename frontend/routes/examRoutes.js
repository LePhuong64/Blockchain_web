const express = require('express');
const { approveExam, rejectExam, getExams, getExamById } = require('../controllers/examController');
const router = express.Router();

router.put('/exams/:examId/approve', approveExam);
router.put('/exams/:examId/reject', rejectExam);
router.get('/exams', getExams);
router.get('/exams/:id', getExamById);

module.exports = router;