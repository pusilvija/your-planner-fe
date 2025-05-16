import { useNavigate } from 'react-router-dom';

import axiosInstance from '../axiosConfig.js';


const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await axiosInstance.post('/logout/');
      localStorage.removeItem('token');
      console.log('Logout successful. Redirecting to login page.');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.response?.data || error.message);
    }
  };

  return { handleLogout };
};

export default Logout;
