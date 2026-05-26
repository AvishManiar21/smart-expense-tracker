import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Dashboard Page
 * Main page after login - shows user info and logout button
 */
function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">SmartExpense Tracker</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome, {user?.name}!
          </h2>

          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Currency:</span> {user?.currency}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Account created:</span>{' '}
              {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Phase 2: Authentication Complete! ✅
            </h3>
            <p className="text-blue-700">
              Authentication system is working. The dashboard and expense management features
              will be implemented in Phase 3.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
