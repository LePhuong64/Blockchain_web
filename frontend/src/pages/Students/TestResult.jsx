import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import "../../styles/testresult.css";

const TestResult = () => {
  const [score, setScore] = useState(() => localStorage.getItem("score") || 0);
  const [examId, setExamId] = useState(() => localStorage.getItem("examId"));
  const [examName, setExamName] = useState('');

  useEffect(() => {
    console.log('TestResult received:', { score, examId });

    const fetchExamName = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/exams/${examId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setExamName(response.data.name);
      } catch (error) {
        console.error('Error fetching exam name:', error);
      }
    };

    if (examId) {
      fetchExamName();
    }
  }, [examId]);

  return (
    <div className="card">
      <h2 className="card-title">Kết quả bài kiểm tra</h2>
      <div className="exam-card">
        <div className="exam-info">
          <div className="exam-title">{examName}</div>
          <div className="exam-meta">Điểm số: {parseFloat(score).toFixed(2)} / 10</div>
        </div>
      </div>
      <div className="button-container">
        <Link to="/student/test-list" className="btn-primary back-button">Quay lại trang chủ</Link>
      </div>
    </div>
  );
};

export default TestResult;
