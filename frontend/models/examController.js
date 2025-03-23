const Exam = require('../models/Exam');

exports.createExam = async (req, res) => {
  const { name, date, duration, questions } = req.body;
  try {
    const exam = new Exam({ name, date, duration, questions, creator: req.user._id });
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find({ creator: req.user._id });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};