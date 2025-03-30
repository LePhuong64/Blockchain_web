import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { objectIdToUint } from '../../utils/blockchain';
import '../../styles/testresult.css';

function TestResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { submissionData, txHash, questions } = location.state || {};

  if (!submissionData) {
    return (
      <div className="error-container">
        <div className="error-message">
          Không tìm thấy dữ liệu kết quả! Vui lòng quay lại trang làm bài.
        </div>
        <button 
          className="return-btn" 
          onClick={() => navigate('/student/test-history')}
        >
          Quay lại lịch sử bài thi
        </button>
      </div>
    );
  }

  const normalizeCorrectAnswer = (correctAnswer) => {
    if (typeof correctAnswer === 'number') return correctAnswer;
    if (typeof correctAnswer === 'string') return parseInt(correctAnswer, 10);
    if (correctAnswer?.$numberInt) return parseInt(correctAnswer.$numberInt, 10);
    return 0;
  };

  return (
    <div className="test-result-container">
      <div className="result-header">
        <h1>Kết quả bài kiểm tra</h1>
        <h2>{submissionData.examName}</h2>
        <h3>{submissionData.examSubject}</h3>
        {submissionData.description && (
          <p className="exam-description">{submissionData.description}</p>
        )}
      </div>

      <div className="result-summary">
        <div className="score-section">
          <div className="score-display">
            <span className="score-value">{submissionData.score.toFixed(1)}</span>
            <span className="score-label"></span>
            <div className={`pass-status ${submissionData.score >= 5 ? 'pass' : 'fail'}`}>
              {submissionData.score >= 5 ? 'ĐẠT' : 'KHÔNG ĐẠT'}
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-item correct">
            <span className="stat-value">{submissionData.correctCount}</span>
            <span className="stat-label">Câu đúng</span>
          </div>
          <div className="stat-item wrong">
            <span className="stat-value">{submissionData.wrongCount}</span>
            <span className="stat-label">Câu sai</span>
          </div>
          <div className="stat-item total">
            <span className="stat-value">{submissionData.totalQuestions}</span>
            <span className="stat-label">Tổng câu hỏi</span>
          </div>
          <div className="stat-item time">
            <span className="stat-label">Thời gian nộp:</span>
            <span className="stat-value">
              {new Date(submissionData.submittedAt * 1000).toLocaleString('vi-VN')}
            </span>
          </div>
        </div>
      </div>

      {txHash && (
        <div className="transaction-info">
          <h4>Thông tin giao dịch blockchain</h4>
          <p><strong>Mã giao dịch:</strong> <span className="tx-hash">{txHash}</span></p>

        </div>
      )}

      <div className="answers-section">
        <h3>Chi tiết bài làm</h3>
        <div className="answers-list">
          {questions.map((q, index) => {
            const answer = submissionData.answers.find(a => 
              a.questionId.toString() === objectIdToUint(q._id).toString()
            );
            const isCorrect = answer?.isCorrect;
            const chosenOption = answer?.chosenOption;
            const correctAnswerIndex = normalizeCorrectAnswer(q.correctAnswer);
            
            return (
              <div 
                key={q._id} 
                className={`answer-item ${isCorrect ? 'correct' : 'incorrect'}`}
              >
                <div className="question-header">
                  <span className="question-number">Câu {index + 1}</span>
                  <span className={`result-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {isCorrect ? '✓ ĐÚNG' : '✗ SAI'}
                  </span>
                </div>
                
                <div className="question-text">
                  {q.questionText}
                </div>
                
                <div className="answer-details">
                  <div className="answer-detail">
                    <span className="detail-label">Đáp án của bạn:</span>
                    {chosenOption !== undefined && chosenOption !== -1 ? (
                      <span className={`user-answer ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {q.options[chosenOption]}
                      </span>
                    ) : (
                      <span className="no-answer">Không trả lời</span>
                    )}
                  </div>
                  
                  {!isCorrect && (
                    <div className="answer-detail">
                      <span className="detail-label">Đáp án đúng:</span>
                      <span className="correct-answer">{q.options[correctAnswerIndex]}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}

export default TestResult;