import React from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import CreateExam from './CreateExam';
import ManageExam from "./ManageExam";
import '../../App.css';

function TeacherDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="header">
          Hệ thống chấm điểm tự động
        </div>
        
        <div className="user-profile">
          <div className="user-avatar">GV</div>
          <div className="user-name">Giáo viên</div>
        </div>
        
        <div className="menu">
          <Link 
            to="/teacher/manage-exams" 
            className={`menu-item ${path.includes('/manage-exams') ? 'active' : ''}`}
          >
            <i className="icon-exam"></i>
            <span>Quản lý bài kiểm tra</span>
          </Link>
          <Link 
            to="/teacher/student-list" 
            className={`menu-item ${path.includes('/student-list') ? 'active' : ''}`}
          >
            <i className="icon-student"></i>
            <span>Danh sách sinh viên</span>
          </Link>
          <Link 
            to="/teacher/create-exam" 
            className={`menu-item ${path.includes('/create-exam') ? 'active' : ''}`}
          >
            <i className="icon-create"></i>
            <span>Tạo bài kiểm tra</span>
          </Link>
          <button onClick={handleLogout} className="menu-item logout-button">
            <i className="icon-logout"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="content shared-container">
        <Routes>
          <Route path="/" element={<Navigate to="/teacher/manage-exams" />} />
          <Route path="/create-exam" element={<CreateExam />} />
          <Route path="/manage-exams" element={<ManageExam />} />
          <Route path="/student-list" element={
            <div className="card">
              <h2 className="card-title">Danh sách sinh viên</h2>
              <div className="coming-soon">Tính năng đang phát triển</div>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default TeacherDashboard;