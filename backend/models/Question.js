const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true }, // Liên kết với Exam
  questionText: { type: String, required: true }, // Nội dung câu hỏi
  options: [{ type: String, required: true }], // Danh sách đáp án
  correctAnswer: { type: Number, required: true }, // Đáp án đúng (index trong `options`)
}, { timestamps: true }); // Tự động tạo createdAt & updatedAt

module.exports = mongoose.model('Question', questionSchema);
