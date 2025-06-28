import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
  const isAuthenticated = localStorage.getItem('authToken'); // or check from context/store

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
=======

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
>>>>>>> 8202cd886166243aae7d13ab04e8ede3607ebf1c
};

export default useAuth;
