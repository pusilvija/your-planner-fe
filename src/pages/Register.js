import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axiosInstance from '../services/axiosConfig.js';

import './Register.css';


const Register = () => {
    const [username, setUsername] = useState('');
    // const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
        setSuccess(false); // Reset success state

        axiosInstance.post('/users/register/', {
            username,
            // email, // TODO: Make email useful
            password,
        })
        .then(response => {
            console.log('Registration Successful', response.data);
            setSuccess(true);
            setTimeout(() => {
                navigate('/taskboard');
            }, 2000);
        })
        .catch(error => {
            console.error('There was an error registering!', error);
            setError('Registration failed. Please try again.');
        });
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2 className="register-title">Register</h2>
                {error && <p className="register-error">{error}</p>}
                {success && <p className="register-success">Registration successful!</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="register-input"
                />
                {/* <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="register-input"
                /> */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="register-input"
                />
                <button type="submit" className="register-button">Register</button>
            </form>
        </div>
    );
};

export default Register;