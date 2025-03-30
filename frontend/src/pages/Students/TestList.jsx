import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/testlist.css';

function TestList() {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
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
        console.log('API Response:', response.data);
        setTests(response.data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchTests();
  }, []);

  const handleTakeTest = (id) => {
    navigate(`/student/take-test/${id}`);
  };

  return (
    <div>
      <div className="card">
        <h2 className="card-title">Ngân hàng đề </h2>
        
        {tests.length > 0 ? (
          tests.map((test) => (
            <div key={test._id} className="test-card">
              <div className="test-info">
                <div className="test-title">{test.name}</div>
                <div className="test-meta">
                  <div className="test-meta-row">
                    <div>Môn học: {test.subject}</div>
                    <div>Số câu hỏi: {test.questionIds ? test.questionIds.length : 0}</div>
                  </div>
                  <div className="test-meta-row">
                    <div>Thời gian làm bài: {test.duration} phút</div>
                  </div>
                </div>
              </div>
              <div className="test-actions">
                <button className="btn-primary" onClick={() => handleTakeTest(test._id)}>Làm bài</button>
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