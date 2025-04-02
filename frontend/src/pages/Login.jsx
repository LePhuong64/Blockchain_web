import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      const { token, role } = response.data;
      
     
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      
  
      switch (role) {
        case 'student':
          navigate('/student/test-list');
          break;
        case 'teacher':
          navigate('/teacher/manage-exams');
          break;
        case 'manager':
          navigate('/manager/quan-ly-bai-kiem-tra');
          break;
        default:
          setError('Vai trò người dùng không hợp lệ');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || 'Thông tin đăng nhập không chính xác');
      } else {
        setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
      }
    }
  };

  return (
    <div className="khung-dang-nhap">
      <div className="hop-dang-nhap">
        <h2 className="tieu-de-dang-nhap">ĐĂNG NHẬP</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="nhom-truong-nhap">
            <input
              type="email"
              placeholder="Email"
              className="o-nhap-lieu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="nhom-truong-nhap">
            <input
              type="password"
              placeholder="Mật khẩu"
              className="o-nhap-lieu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="nut-dang-nhap">Đăng nhập</button>

          <div className="khung-dang-ky">
            <span>Bạn chưa có tài khoản? </span>
            <Link to="/signup" className="lien-ket-dang-ky">
              Đăng ký
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;