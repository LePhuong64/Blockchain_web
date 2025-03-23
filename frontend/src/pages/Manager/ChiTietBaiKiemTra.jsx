import React from "react";
import "../../App.css";

const ChiTietBaiKiemTra = () => {
  return (
    <div className="modal-container">
      <div className="modal">
        <div className="modal-header">
          <span>Chi tiết bài kiểm tra</span>
          <button className="close-btn">&times;</button>
        </div>
        <div className="modal-body">
          <h2 className="exam-title">Kiểm tra giữa kỳ - Cơ sở dữ liệu</h2>
          <ul className="exam-info">
            <li><strong>Giáo viên:</strong> Nguyễn Văn A</li>
            <li><strong>Môn học:</strong> Cơ sở dữ liệu</li>
            <li><strong>Lớp:</strong> CNTT-K15</li>
            <li><strong>Thời gian:</strong> 60 phút</li>
            <li><strong>Số câu hỏi:</strong> 40 câu</li>
            <li><strong>Loại câu hỏi:</strong> Trắc nghiệm, Tự luận</li>
          </ul>
          <div className="question-section">
            <span>Xem nội dung các câu hỏi:</span>
            <button className="question-btn">Xem danh sách câu hỏi</button>
          </div>
          <div className="reject-section">
            <label>Lý do (nếu từ chối):</label>
            <input type="text" className="reason-input" placeholder="Nhập lý do..." />
          </div>
        </div>
        <div className="modal-footer">
          <button className="approve-btn">Duyệt</button>
          <button className="reject-btn">Từ chối</button>
        </div>
      </div>
    </div>
  );
};

export default ChiTietBaiKiemTra;