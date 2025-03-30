import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../App.css";

const Questionlist = () => {
  const { examId } = useParams(); // Lấy examId từ URL
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [examName, setExamName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/exams/${examId}/questions`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setQuestions(response.data.questions);
        setExamName(response.data.examName);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [examId]);

  const handleBack = () => {
    navigate(-1); // Quay lại trang trước
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="header">Danh sách câu hỏi - {examName}</div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Thứ tự</th>
              <th>Nội dung câu hỏi</th>
              <th>Đáp án</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr key={question._id}>
                <td>{index + 1}</td>
                <td>{question.questionText}</td>
                <td>
                  {question.options.map((option, i) => (
                    <div key={i} className={i === question.correctAnswer ? 'approved' : ''}>
                      {i}. {option} {/* Hiển thị số thứ tự bắt đầu từ 0 */}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Questionlist;