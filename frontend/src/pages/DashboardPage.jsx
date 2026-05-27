import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Receipt,
  TrendingUp,
  PiggyBank,
  Repeat,
  DollarSign,
  ArrowRight
} from 'lucide-react';

/**
 * Dashboard Page
 * Main page after login - shows user info and quick access to features
 */
function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const features = [
    {
      title: 'Expenses',
      description: 'Track and categorize your expenses',
      icon: Receipt,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      path: '/expenses',
    },
    {
      title: 'Income',
      description: 'Manage your income sources',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      path: '/income',
    },
    {
      title: 'Budgets',
      description: 'Set and track spending budgets',
      icon: PiggyBank,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: '/budgets',
    },
    {
      title: 'Recurring Expenses',
      description: 'Automate recurring expense tracking',
      icon: Repeat,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/recurring',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">SmartExpense Tracker</h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome back, {user?.name}!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Currency</p>
              <p className="text-lg font-semibold text-gray-900">{user?.currency}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Access Features */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.path}
                  onClick={() => navigate(feature.path)}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left group"
                >
                  <div className={`${feature.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Open
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
