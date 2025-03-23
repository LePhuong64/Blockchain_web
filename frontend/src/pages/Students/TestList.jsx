import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/testlist.css';

function TestList() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      try {
        const response = await axios.get('http://localhost:5000/api/exams?status=approved', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('API Response:', response.data); // Log the API response
        setExams(response.data);
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, []);

  const handleTakeTest = (id) => {
    navigate(`/student/take-test/${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="card">
        <h2 className="card-title">Danh sách bài kiểm tra</h2>
        
        {exams.length > 0 ? (
          exams.map((exam) => (
            <div key={exam._id} className="exam-card">
              <div className="exam-info">
                <div className="exam-title">{exam.name}</div>
                <div className="exam-meta">
                  <div>Thời gian làm bài: {exam.duration} phút</div>
                  <div>Giáo viên: {exam.teacher?.name || 'Chưa có thông tin'}</div>
                  <div>Ngày tạo: {formatDate(exam.createdAt)}</div>
                </div>
              </div>
              <div className="exam-actions">
                <button className="btn-primary" onClick={() => handleTakeTest(exam._id)}>Làm bài</button>
              </div>
            </div>
          ))
        ) : (
          <p>Không có bài kiểm tra nào.</p>
        )}
      </div>
    </div>
  );
}

export default TestList;