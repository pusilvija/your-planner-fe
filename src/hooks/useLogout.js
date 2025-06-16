import { useNavigate } from 'react-router-dom';

import axiosInstance from '../services/axiosConfig.js';

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await axiosInstance.post('/logout/');
      localStorage.removeItem('token');
      console.log('Logout successful. Redirecting to login page.');
      navigate('/login');
    } catch (error) {
      console.error(
        'Error logging out:',
        error.response?.data || error.message
      );
    }
  };

  return { handleLogout };
};

export default useLogout;
