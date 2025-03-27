
const Question = require('../models/Question');
const Exam = require('../models/Exam');
const Submission = require('../models/Submission');

exports.submitExam = async (req, res) => {
    try {
        const { examId, answers } = req.body;
        const studentId = req.user._id;

        // Kiểm tra xem bài kiểm tra có tồn tại không
        const exam = await Exam.findById(examId).populate('questionIds');
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Kiểm tra xem sinh viên đã nộp bài chưa
        const existingSubmission = await Submission.findOne({ examId, studentId });
        if (existingSubmission) {
            return res.status(400).json({ message: 'You have already submitted this exam' });
        }

        // Lấy danh sách câu hỏi của bài kiểm tra
        const questions = await Question.find({ _id: { $in: exam.questionIds } });

        // So sánh câu trả lời và tính điểm
        let score = 0;
        const totalQuestions = questions.length;

        const updatedAnswers = answers.map(answer => {
            const question = questions.find(q => q._id.toString() === answer.questionId);
            if (question && question.correctAnswer === answer.selectedOption) {
                score += 1; // Nếu đúng thì cộng điểm
            }
            return {
                questionId: answer.questionId,
                selectedOption: answer.selectedOption
            };
        });

        // Tạo submission mới
        const submission = new Submission({
            examId,
            studentId,
            answers: updatedAnswers,
            score: (score / totalQuestions) * 10 // Tính theo thang điểm 10
        });

        await submission.save();

        res.status(201).json({
            message: 'Exam submitted successfully',
            submission,
            totalQuestions,
            correctAnswers: score,
            finalScore: submission.score
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
