import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './About.css';

const About = () => {
    const navigate = useNavigate();
    return (
        <div className="about-container">
            <h1 className="about-title">About Your Planner</h1>
            <p className="about-description">
                Your Planner is a personal task management app designed to help you organize your tasks, boost your productivity, and stay on top of your goals. With features like a visual task board, drag-and-drop functionality, and detailed task filtering, Your Planner makes managing your tasks simple and efficient.
            </p>
            <p className="about-features">
                <strong>Key Features:</strong>
                <ul>
                    <li>User authentication and secure data storage</li>
                    <li>Visual task board with drag-and-drop functionality</li>
                    <li>Interactive table view for all tasks</li>
                    <li>Task filtering and sorting</li>
                    <li>Integration with weather data for planning</li>
                </ul>
            </p>

            <p className="about-technology">
            <strong>Tech Stack:</strong>
                <ul>
                    <li><strong>Django</strong>: Python web framework for building secure and scalable web applications.</li>
                    <li><strong>Django REST Framework</strong>,: toolkit for building RESTful APIs with Django.</li>
                    <li><strong>Token Authentication</strong>,: a stateless authentication mechanism using tokens for secure API access.</li>
                    <li><strong>PostgreSQL</strong>: open-source relational database system for storing application data.</li>
                    <li><strong>React</strong>: component-based frontend</li>
                    <li><strong>React Router</strong>,: routing between views</li>
                    <li><strong>Axios</strong>: API requests</li>
                    <li><strong>React</strong> Beautiful DnD: drag & drop functionality</li>
                    <li><strong>Docker</strong>: for deploying in Railway</li>
                    </ul>
            </p>

            <p className="whats-next">
            <strong>What is next?</strong>
            <ul>
                <li>Enhancing mobile usability to make the app more convenient for users on phones.</li>
                <li>Adding more task features, such as created_at and deadline to provide better task tracking.</li>
                <li>Introducing customizable containers, allowing users to create their own task categories and organize their thoughts freely.</li>
                <li>Continuously exploring new possibilities to make Your Planner even more versatile and user-friendly. The world is your oyster!</li>
            </ul>
            </p>

            <p className="github-links">
                <strong>Github:</strong>
                <ul>
                    <li>
                        <a href="https://github.com/pusilvija/your-planner" target="_blank" rel="noopener noreferrer">
                            Backend Repository
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/pusilvija/your-planner-fe" target="_blank" rel="noopener noreferrer">
                            Frontend Repository
                        </a>
                    </li>
                </ul>
            </p>
            <button
                className="taskdetails-buttons"
                id="back-button"
                onClick={() => navigate(-1)}
            >
                Back
            </button>
        </div>
    );
};

export default About;