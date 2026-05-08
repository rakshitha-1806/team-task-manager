import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './Dashboard';
import Projects from './Projects';
import Tasks from './Tasks';

function App() {
  const savedToken = localStorage.getItem('token');
  const initialToken = (savedToken && savedToken !== 'null' && savedToken !== 'undefined') ? savedToken : '';
  const [token, setToken] = useState(initialToken);
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'Member');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Member');

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setToken('');
          localStorage.removeItem('token');
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const login = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      setToken(res.data.token);
      setUserRole(res.data.role);
      setUserName(res.data.name);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userName', res.data.name);
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const signup = async () => {
    try {
      const res = await axios.post(`${API}/auth/signup`, { name, email, password, role });
      setToken(res.data.token);
      setUserRole(res.data.role);
      setUserName(res.data.name);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userName', res.data.name);
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  const logout = () => {
    setToken('');
    setUserRole('Member');
    setUserName('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
  };

  if (!token) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: '#4e73df', marginBottom: '20px' }}>Team Task Manager</h2>
          <h3 style={{ color: '#333', marginBottom: '20px' }}>{isLogin ? 'Welcome Back!' : 'Create an Account'}</h3>
          
          {!isLogin && (
            <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          )}
          <input placeholder="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          
          {!isLogin && (
            <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          )}
          
          <button onClick={isLogin ? login : signup} style={btnStyle}>{isLogin ? 'Login' : 'Sign Up'}</button>
          
          <p style={{ cursor: 'pointer', color: '#4e73df', marginTop: '20px', fontWeight: 'bold' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
        <nav style={{ background: 'linear-gradient(90deg, #4e73df 0%, #224abe 100%)', padding: '15px 30px', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: 'white', margin: 0, marginRight: '20px' }}>Task Manager</h2>
          <Link to="/" style={navLinkStyle}>Dashboard</Link>
          <Link to="/projects" style={navLinkStyle}>Projects</Link>
          <Link to="/tasks" style={navLinkStyle}>Tasks</Link>
          <div style={{ marginLeft: 'auto', color: 'white', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>Hello, <b>{userName}</b> ({userRole})</span>
            <button onClick={logout} style={{ padding: '8px 15px', background: '#e74a3b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
          </div>
        </nav>
        
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard token={token} API={API} />} />
            <Route path="/projects" element={<Projects token={token} API={API} userRole={userRole} />} />
            <Route path="/tasks" element={<Tasks token={token} API={API} userRole={userRole} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px' };
const btnStyle = { width: '100%', padding: '12px', background: '#4e73df', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.3s' };
const navLinkStyle = { textDecoration: 'none', color: '#f8f9fc', fontWeight: 'bold', padding: '5px 10px', borderRadius: '4px', transition: 'background 0.3s' };

export default App;
