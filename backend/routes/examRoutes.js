const express = require('express');
const examController = require('../controllers/examController');
const router = express.Router();

router.put('/exams/:examId/approve', examController.approveExam);
router.put('/exams/:examId/reject', examController.rejectExam);
router.get('/exams', examController.getExams);
router.get('/exams/:id', examController.getExamById);
router.post('/exams', examController.createExam);
router.put('/exams/:examId', examController.updateExam);
router.delete('/exams/:examId', examController.deleteExam);
router.get('/exams/:examId/questions', examController.getAllQuestionsByExamId); 

module.exports = router;