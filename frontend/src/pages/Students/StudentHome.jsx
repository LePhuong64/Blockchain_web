import React from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import TestList from './TestList';
import TestHistory from './TestHistory';
import TakeTest from './TakeTest';
import TestResult from './TestResult';
import '../../styles/studenthome.css'; 

function StudentHome() {
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
          Hệ thống chấm điểm tự động bài kiểm tra
        </div>
        
        <div className="user-profile">
          <div className="user-avatar">HS</div>
          <div className="user-name">Học sinh</div>
        </div>
        
        <div className="menu">
          <Link 
            to="/student/test-list" 
            className={`menu-item ${path.includes('test-list') ? 'active' : ''}`}
          >
            Danh sách bài kiểm tra
          </Link>
          <Link 
            to="/student/test-history" 
            className={`menu-item ${path.includes('test-history') ? 'active' : ''}`}
          >
            Lịch sử bài kiểm tra
          </Link>
          <button onClick={handleLogout} className="menu-item logout-button">
            Đăng xuất
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/student/test-list" />} />
          <Route path="/test-list" element={<TestList />} />
          <Route path="/test-history" element={<TestHistory />} />
          <Route path="/take-test" element={<TakeTest />} />
          <Route path="/test-result" element={<TestResult />} />
        </Routes>
      </div>
    </div>
  );
}

export default StudentHome;