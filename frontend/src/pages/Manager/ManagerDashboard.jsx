import React from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import ChiTietBaiKiemTra from './ChiTietBaiKiemTra';
import QuanLyBaiKiemTra from "./QuanLyBaiKiemTra";
import '../../App.css'; 

function ManagerDashboard() {
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
          <div className="user-avatar">TP</div>
          <div className="user-name">Trưởng phòng</div>
        </div>
        
        <div className="menu">
          <Link 
            to="/manager/quan-ly-bai-kiem-tra" 
            className={`menu-item ${path.includes('quan-ly-bai-kiem-tra') ? 'active' : ''}`}
          >
            Quản lý bài kiểm tra
          </Link>
          {/* <Link 
            to="/manager/chi-tiet-bai-kiem-tra" 
            className={`menu-item ${path.includes('chi-tiet-bai-kiem-tra') ? 'active' : ''}`}
          >
            Chi tiết bài kiểm tra
          </Link> */}
          <button onClick={handleLogout} className="menu-item logout-button">
            Đăng xuất
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/manager/quan-ly-bai-kiem-tra" />} />
          <Route path="/chi-tiet-bai-kiem-tra" element={<ChiTietBaiKiemTra />} />
          <Route path="/quan-ly-bai-kiem-tra" element={<QuanLyBaiKiemTra />} />
        </Routes>
      </div>
    </div>
  );
}

export default ManagerDashboard;