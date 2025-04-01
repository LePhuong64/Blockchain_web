const Exam = require('../models/Exam');
const Question = require('../models/Question');

exports.createExam = async (req, res) => {
  try {
    const { name, date, duration, subject, questions } = req.body;
    console.log(name)

    if (!name || !date || !duration || !subject || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Missing required fields or invalid question format' });
    }

    // 1️⃣ Tạo Exam trước, nhưng chưa có questionIds
    const exam = new Exam({ name, date, duration, subject, questionIds: [] });
    await exam.save();

    // 2️⃣ Tạo từng Question, liên kết với Exam
    const createdQuestions = await Promise.all(
      questions.map(async (q) => {
        const newQuestion = new Question({
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          examId: exam._id
        });
        return await newQuestion.save();
      })
    );

    // 3️⃣ Cập nhật danh sách questionIds vào Exam
    exam.questionIds = createdQuestions.map(q => q._id);
    await exam.save();

    res.status(201).json({ message: 'Exam created successfully', exam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExams = async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  try {
    const exams = await Exam.find(filter).populate('questionIds');
    const examsWithQuestionCount = exams.map(exam => ({
      ...exam.toObject(),
      questionCount: exam.questionIds.length // Thêm số lượng câu hỏi
    }));
    res.json(examsWithQuestionCount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('questionIds');
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateExam = async (req, res) => {
  const { examId } = req.params;
  const { name, date, duration, subject, questions } = req.body; 

  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    exam.name = name;
    exam.date = date;
    exam.duration = duration;
    exam.subject = subject; 
    exam.questions = questions;
    await exam.save();

    res.status(200).json({ message: 'Exam updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteExam = async (req, res) => {
  const { examId } = req.params;

  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    await exam.remove();
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveExam = async (req, res) => {
  const { examId } = req.params;
  const userId = req.user._id;

  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    exam.approvedBy = userId;
    exam.status = 'approved';
    await exam.save();

    res.status(200).json({ message: 'Exam approved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectExam = async (req, res) => {
  const { examId } = req.params;
  const { reason } = req.body;

  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    exam.status = 'rejected';
    exam.rejectReason = reason;
    await exam.save();

    res.status(200).json({ message: 'Exam rejected successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllQuestionsByExamId = async (req, res) => {
  try {
    const { examId } = req.params;
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    // Kiểm tra xem bài kiểm tra có tồn tại không
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    

    // Tìm tất cả câu hỏi thuộc về bài kiểm tra đó
    const questions = await Question.find({ examId })
      .select('-correctAnswer')
      .skip(skip)
      .limit(limit)
      .exec();

    // Đếm tổng số câu hỏi trong bài kiểm tra
    const total = await Question.countDocuments({ examId });

    res.json({
      examId,
      examName: exam.name,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      questions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}