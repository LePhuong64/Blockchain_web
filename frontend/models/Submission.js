const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
      selectedOption: { type: Number, required: true } // Chỉ số đáp án mà sinh viên chọn
    }
  ],
  score: { type: Number, default: null }, // Điểm số sẽ được tính sau
});

module.exports = mongoose.model('Submission', submissionSchema);
