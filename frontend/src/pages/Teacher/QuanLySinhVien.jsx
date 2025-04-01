import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBlockchain } from '../../utils/blockchain';
import '../../styles/QuanLySinhVien.css';

function QuanLySinhVien() {
  const { examId } = useParams();
  const [students, setStudents] = useState([]);
  const [examInfo, setExamInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { contract } = await getBlockchain();
        const [studentAddresses, scores, examName, examSubject] = await contract.methods.getExamResultsWithDetails(examId).call();

        const studentData = studentAddresses.map((address, index) => ({
          address,
          score: scores[index]
        }));

        setStudents(studentData);
        setExamInfo({ name: examName, subject: examSubject });
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load student data');
        setLoading(false);
      }
    };

    fetchData();
  }, [examId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
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
    <div className="student-list-container">
      <h1>Danh sách sinh viên</h1>
      <h2>{examInfo.name} - {examInfo.subject}</h2>
      
      <table className="student-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Địa chỉ ví</th>
            <th>Điểm</th>
            <th>Kết quả</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{student.address}</td>
                <td>{student.score.toFixed(1)}/10</td>
                <td className={student.score >= 5 ? 'pass' : 'fail'}>
                  {student.score >= 5 ? 'Đạt' : 'Không đạt'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">Chưa có sinh viên nào làm bài</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default QuanLySinhVien;