import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../App.css";

const QuanLyBaiKiemTra = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/exams', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setExams(response.data);
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, []);

  const handleApprove = async (examId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/api/exams/${examId}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setExams(exams.map(exam => exam._id === examId ? { ...exam, status: 'approved' } : exam));
    } catch (error) {
      console.error('Error approving exam:', error);
    }
  };

  const handleReject = async (examId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/api/exams/${examId}/reject`, { reason: rejectReason }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setExams(exams.map(exam => exam._id === examId ? { ...exam, status: 'rejected', rejectReason } : exam));
      setIsModalOpen(false);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting exam:', error);
    }
  };

  const handleViewDetails = (exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExam(null);
    setRejectReason('');
  };

  return (
    <div className="container">
      <div className="header">Quản lý Bài kiểm tra</div>
      <div className="stats-container">
        <div className="stat-box">
          <p className="stat-label">Tổng số bài kiểm tra</p>
          <p className="stat-value total">{exams.length}</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">Chờ duyệt</p>
          <p className="stat-value pending">{exams.filter(exam => exam.status === 'pending').length}</p>
        </div>
        <div className="stat-box">
          <p className="stat-label">Đã duyệt</p>
          <p className="stat-value approved">{exams.filter(exam => exam.status === 'approved').length}</p>
        </div>
      </div>
      <div className="sub-header">Tất cả</div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Môn học</th>
              <th>Tiêu đề</th>
              <th>Trạng thái</th>
              <th>Chi tiết</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam, index) => (
              <tr key={index}>
                <td>{exam.subject}</td>
                <td>{exam.name}</td>
                <td className={exam.status === "pending" ? "pending" : exam.status === "approved" ? "approved" : "rejected"}>
                  {exam.status === "pending" ? "Chờ duyệt" : exam.status === "approved" ? "Đã duyệt" : "Từ chối"}
                </td>
                <td className="detail" onClick={() => handleViewDetails(exam)}>Chi tiết</td>
                <td>
                  {exam.status === 'pending' && (
                    <>
                      <button className="approve-btn" onClick={() => handleApprove(exam._id)}>Duyệt</button>
                      <button className="reject-btn" onClick={() => handleReject(exam._id)}>Từ chối</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedExam && (
        <div className="modal-container">
          <div className="modal">
            <div className="modal-header">
              <span>Chi tiết bài kiểm tra</span>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <h2 className="exam-title">{selectedExam.name}</h2>
              <ul className="exam-info">
                {selectedExam.teacher && <li><strong>Giáo viên:</strong> {selectedExam.teacher}</li>}
                {selectedExam.subject && <li><strong>Môn học:</strong> {selectedExam.subject}</li>}
                {selectedExam.class && <li><strong>Lớp:</strong> {selectedExam.class}</li>}
                {selectedExam.duration && <li><strong>Thời gian:</strong> {selectedExam.duration} phút</li>}
                {selectedExam.questions && <li><strong>Số câu hỏi:</strong> {selectedExam.questions.length} câu</li>}
                {selectedExam.questionTypes && <li><strong>Loại câu hỏi:</strong> {selectedExam.questionTypes.join(', ')}</li>}
              </ul>
              <div className="question-section">
                <span>Xem nội dung các câu hỏi:</span>
                <button className="question-btn">Xem danh sách câu hỏi</button>
              </div>
              <div className="reject-section">
                <label>Lý do (nếu từ chối):</label>
                <input 
                  type="text" 
                  className="reason-input" 
                  placeholder="Nhập lý do..." 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="approve-btn" onClick={() => handleApprove(selectedExam._id)}>Duyệt</button>
              <button className="reject-btn" onClick={() => handleReject(selectedExam._id)}>Từ chối</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyBaiKiemTra;