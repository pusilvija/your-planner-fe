import React, { useState } from 'react';
import axiosInstance from './axiosConfig.js';
import './Login.css'; // Import the CSS file for styling

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
        axiosInstance.post('/api/users/login/', {
            username,
            password,
        })
        .then(response => {
            console.log('Login Successful', response.data);
            localStorage.setItem('token', response.data.token);
            window.location.href = '/'; // Redirect to the TaskBoard
        })
        .catch(error => {
            console.error('There was an error logging in!', error);
            setError('Invalid username or password. Please try again.');
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
            </form>
        </div>
    );
};

export default Login;