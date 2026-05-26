import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';

/**
 * Register Page
 * Container page for the registration form
 */
function RegisterPage() {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate('/dashboard');
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <RegisterForm
        onSuccess={handleRegisterSuccess}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
}

export default RegisterPage;
