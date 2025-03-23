import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import getBlockchain from '../../utils/blockchain';
import '../../styles/taketest.css';

function TakeTest() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/exams/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setQuestions(response.data.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [id]);

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called');

    const { web3, contract } = await getBlockchain();
    const accounts = await web3.eth.getAccounts();
    console.log('Connected to blockchain:', { web3, contract, accounts });

    let score = 0;
    questions.forEach((question) => {
      if (answers[question._id] === question.correctAnswer) {
        score += 10 / questions.length;
      }
    });

    console.log('Calculated score:', score);
    localStorage.setItem("score", score);
    localStorage.setItem("examId", id);

    try {
      await contract.methods.submitResult(id, score).send({ from: accounts[0] });
      console.log('Result submitted successfully:', { score, examId: id });
      navigate('/student/result');
    } catch (error) {
      console.error('Error submitting result:', error);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Bài kiểm tra</h2>
      {questions.map((q, index) => (
        <div key={q._id} className="exam-card">
          <div className="exam-info">
            <div className="exam-title">{`${index + 1}. ${q.questionText}`}</div>
            <div className="exam-meta">
              {q.options.map((opt, index) => (
                <div key={index} className="option">
                  <input 
                    type="radio" 
                    name={`question-${q._id}`} 
                    onChange={() => handleOptionChange(q._id, index)} 
                  /> {opt}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <button className="btn-primary submit-button" onClick={handleSubmit}>Nộp bài</button>
    </div>
  );
}

export default TakeTest;
