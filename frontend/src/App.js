import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import StudentHome from "./pages/Students/StudentHome";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import ManagerDashboard from "./pages/Manager/ManagerDashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import './App.css';

const PrivateRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (userRole !== allowedRole) {
    switch (userRole) {
      case 'teacher':
        return <Navigate to="/teacher" replace />;
      case 'manager':
        return <Navigate to="/manager" replace />;
      case 'student':
        return <Navigate to="/student/test-list" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/student/*" element={<PrivateRoute allowedRole="student"><StudentHome /></PrivateRoute>} />
        <Route path="/teacher/*" element={<PrivateRoute allowedRole="teacher"><TeacherDashboard /></PrivateRoute>} />
        <Route path="/manager/*" element={<PrivateRoute allowedRole="manager"><ManagerDashboard /></PrivateRoute>} />
        
      </Routes>
    </Router>
  );
}

export default App;