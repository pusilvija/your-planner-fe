import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import axiosInstance from '../axiosConfig.js';

import './Login.css';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        axiosInstance.post('/users/login/', {
            username,
            password,
        })
        .then(response => {
            console.log('Login Successful');
            localStorage.setItem('token', response.data.token);
            navigate('/taskboard');
        })
        .catch(error => {
            console.error('Error response:', error.response);
            setError(error.response?.data?.detail || 'Invalid username or password. Please try again.');
        });
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Login</h2>
                {error && <p className="login-error">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                />
                <button type="submit" className="login-button">Login</button>
                <p className="login-register-link">
                    Don't have an account? <Link to="/register">Sign up now!</Link>
                    {/* TODO: Add forgot password? */}
                </p>
            </form>
        </div>
    );
};

export default Login;