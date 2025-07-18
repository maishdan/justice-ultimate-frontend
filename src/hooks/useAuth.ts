// src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // ✅ Use 'token' for consistency

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
    }
  }, [token, navigate]);
};

export default useAuth;
