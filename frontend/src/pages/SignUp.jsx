import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/SignUp.css";

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Thay đổi từ isTeacher thành role
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', { username, email, password, role });
      navigate('/');
    } catch (error) {
      alert('Đăng ký không thành công');
    }
  };

  return (
    <div className="khung-dang-nhap">
      <div className="hop-dang-nhap">
        <h2 className="tieu-de-dang-nhap">ĐĂNG KÝ</h2>

        <form onSubmit={handleSubmit}>
          <div className="nhom-truong-nhap">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              className="o-nhap-lieu"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="nhom-truong-nhap">
            <input
              type="email"
              placeholder="Email"
              className="o-nhap-lieu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="nhom-truong-nhap">
            <input
              type="password"
              placeholder="Mật khẩu"
              className="o-nhap-lieu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="nhom-truong-nhap">
            <label>
              <input
                type="radio"
                value="student"
                checked={role === 'student'}
                onChange={(e) => setRole(e.target.value)}
              />
              Học sinh
            </label>
            <label>
              <input
                type="radio"
                value="teacher"
                checked={role === 'teacher'}
                onChange={(e) => setRole(e.target.value)}
              />
              Giáo viên
            </label>
            <label>
              <input
                type="radio"
                value="manager"
                checked={role === 'manager'}
                onChange={(e) => setRole(e.target.value)}
              />
              Trưởng phòng
            </label>
          </div>

          <button type="submit" className="nut-dang-nhap">Đăng ký</button>

          <div className="khung-dang-ky">
            <span>Bạn đã có tài khoản? </span>
            <Link to="/" className="lien-ket-dang-ky">
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;