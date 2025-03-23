import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';

function ManageExam() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/exams', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setExams(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized: Invalid or expired token');
          // Handle token refresh logic here if applicable
        } else {
          console.error('Error fetching exams:', error);
        }
      }
    };

    fetchExams();
  }, []);

  return (
    <div className="card">
      <h2 className="card-title">Quản lý bài kiểm tra</h2>
      {exams.map((exam) => (
        <div key={exam._id} className="exam-card">
          <div className="exam-info">
            <div className="exam-title">{exam.name}</div>
            <div className="exam-meta">Thời gian: {exam.duration} phút</div>
            <div className="exam-meta">Môn học: {exam.subject}</div> 
            <div className="exam-status">Trạng thái: {exam.status === "pending" ? "Chờ duyệt" : exam.status === "approved" ? "Đã duyệt" : "Từ chối"}</div>
            {exam.status === 'rejected' && (
              <div className="exam-reject-reason">Lý do từ chối: {exam.rejectReason}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ManageExam;