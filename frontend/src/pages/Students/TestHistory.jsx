import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  getBlockchain,
  getSubmittedExamIds,
  getStudentSubmission,
  getExamInfo,
  objectIdToUint
} from '../../utils/blockchain';
// import '../../styles/testhistory.css';

function TestHistory() {
  const [exams, setExams] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExamHistory = async () => {
      try {
        const { accounts, contract } = await getBlockchain();
        setAccounts(accounts);

 
        const examIds = await contract.methods
          .getSubmittedExamIds(accounts[0])
          .call();


        const examsData = await Promise.all(
          examIds.map(async (examId) => {
            const submission = await contract.methods
              .getSubmission(examId, accounts[0])
              .call();

        
            const examResponse = await axios.get(
              `http://localhost:5000/api/exams/${examId}/questions`
            );

            return {
              examId,
              examName: examResponse.data.examName,
              subject: examResponse.data.subject,
              score: parseInt(submission.score) / 100,
              submittedAt: new Date(parseInt(submission.submittedAt) * 1000),
              examHash: submission.examHash,
              answers: submission.answers.map(ans => ({
                questionId: ans.questionId.toString(),
                chosenOption: parseInt(ans.chosenOption),
                isCorrect: ans.isCorrect
              })),
              questions: examResponse.data.questions || []
            };
          })
        );

        setExams(examsData);
      } catch (error) {
        console.error('Error fetching exam history:', error);
        setError('Failed to load exam history');
      } finally {
        setLoading(false);
      }
    };

    fetchExamHistory();
  }, []);
  const navigate = useNavigate();

  const viewExamDetails = (exam) => {
    navigate(`/student/test-result/${exam.examId}`);
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
                <button 
                  className="btn-details" 
                  onClick={() => viewExamDetails(exam)}
                >
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