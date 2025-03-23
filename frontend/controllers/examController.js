const Exam = require('../models/Exam');

exports.createExam = async (req, res) => {
  const { name, date, duration, subject, questions } = req.body; 
  try {
    const exam = new Exam({ name, date, duration, subject, questions, creator: req.user._id }); // Add subject here
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getExams = async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {}; 

  try {
    const exams = await Exam.find(filter); 
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
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