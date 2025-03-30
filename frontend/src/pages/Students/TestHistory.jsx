import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlockchain } from '../../utils/blockchain';
// import '../../styles/testhistory.css';

function TestHistory() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamHistory = async () => {
      try {
        const { contract, accounts } = await getBlockchain();
        
        const examIds = await contract.methods.getSubmittedExamIds(accounts[0]).call();
        
        const examsData = await Promise.all(
          examIds.map(async (examId) => {
            const result = await contract.methods.getSubmission(examId, accounts[0]).call();
            const submission = result[0]; // SubmissionData
            const answers = result[1]; // StudentAnswer[]
            
            return {
              examId,
              examName: submission.examName, // Tên bài kiểm tra
              subject: submission.subject, // Môn học
              score: submission.score, // Điểm số
              submittedAt: new Date(submission.submittedAt * 1000), // Thời gian nộp
              examHash: submission.examHash, // Hash bài kiểm tra
              answers: answers.map(ans => ({
                questionId: ans.questionId.toString(),
                chosenOption: ans.chosenOption,
                isCorrect: ans.isCorrect
              }))
            };
          })
        );
    
        setExams(examsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching exam history:', err);
        setError('Không thể tải lịch sử bài thi. Vui lòng thử lại.');
        setLoading(false);
      }
    };

    fetchExamHistory();
  }, []);

  const viewExamDetails = (exam) => {
    navigate('/student/test-result', {
      state: {
        submissionData: {
          examName: exam.examName,
          examSubject: exam.subject,
          score: exam.score,
          examHash: exam.examHash,
          submittedAt: Math.floor(exam.submittedAt.getTime() / 1000),
          answers: exam.answers,
          totalQuestions: exam.answers.length,
          correctCount: exam.answers.filter(a => a.isCorrect).length,
          wrongCount: exam.answers.filter(a => !a.isCorrect).length
        },
        questions: exam.answers.map(ans => ({
          _id: ans.questionId,
          questionText: `Question ${ans.questionId}`,
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          correctAnswer: 0
        })),
        txHash: 'N/A'
      },
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải lịch sử bài thi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="test-history-container">
      <h1>Lịch sử bài kiểm tra</h1>

      {exams.length === 0 ? (
        <div className="no-exams">
          <p>Bạn chưa hoàn thành bài kiểm tra nào.</p>
        </div>
      ) : (
        <div className="exam-list">
          {exams.map((exam) => (
            <div key={exam.examId} className="exam-card">
              <div className="exam-header">
                <h3>{exam.examName}</h3>
                <span className="subject-badge">{exam.subject}</span>
              </div>

              <div className="exam-details">
                <div className="detail-row">
                  <span className="detail-label">Ngày làm bài:</span>
                  <span className="detail-value">
                    {exam.submittedAt.toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Điểm số:</span>
                  <span className={`score-value ${exam.score >= 5 ? 'pass' : 'fail'}`}>
                    {exam.score.toFixed(1)}/10
                  </span>
                </div>
              </div>

              <div className="exam-actions">
                <button className="btn-details" onClick={() => viewExamDetails(exam)}>
                  Xem lại bài làm
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TestHistory;