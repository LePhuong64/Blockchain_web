const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    questionId: { type: Number, required: true },
    selectedAnswer: { type: Number, required: true }
  }],
  score: { type: Number, required: true },
  blockchainTxHash: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExamResult', examResultSchema); 