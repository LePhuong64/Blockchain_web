const express = require('express');
const { approveExam, rejectExam } = require('../controllers/examController');
const router = express.Router();

router.put('/exams/:examId/approve', approveExam);
router.put('/exams/:examId/reject', rejectExam);

module.exports = router;