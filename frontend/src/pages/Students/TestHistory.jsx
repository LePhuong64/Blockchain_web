// filepath: d:\BLOCKCHAIN\TL\chamdiem\src\pages\Students\TestHistory.jsx
import React, { useState, useEffect } from "react";
import Web3 from 'web3';
import getBlockchain from '../../utils/blockchain';
import axios from 'axios';
import "../../styles/testlist.css"; 

const TestHistory = () => {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const { web3, contract } = await getBlockchain();
      const accounts = await web3.eth.getAccounts();
      const results = await contract.methods.getResults().call({ from: accounts[0] });
      setResults(results.filter(result => result.student === accounts[0]));
    };

    const fetchExams = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/exams', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setExams(response.data);
    };

    fetchResults();
    fetchExams();
  }, []);

  const getExamName = (examId) => {
    const exam = exams.find(exam => exam._id === examId);
    return exam ? exam.name : 'Unknown Exam';
  };

  return (
    <div>
      <div className="card">
        <h2 className="card-title">Bài kiểm tra đã làm</h2>
        
        {results.map((result) => (
          <div 
            key={result.examId} 
            className="exam-card"
            style={{ cursor: 'pointer' }}
          >
            <div className="exam-info">
              <div className="exam-title">{getExamName(result.examId)}</div>
              <div className="exam-meta">
                Điểm: {result.score.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestHistory;