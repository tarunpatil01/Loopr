import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PersonalPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/profile', { replace: true });
  }, [navigate]);
  return null;
};

export default PersonalPage;
