const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  subject: { type: String, required: true },
  questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], // Liên kết với bảng Question
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectReason: { type: String, default: '' }
});

module.exports = mongoose.model('Exam', examSchema);