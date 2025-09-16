import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 text-white text-xl font-bold">
              PDAM Bills
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/dashboard')
                      ? 'bg-indigo-700 text-white'
                      : 'text-indigo-200 hover:bg-indigo-500 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/bills"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/bills') || location.pathname.startsWith('/bills')
                      ? 'bg-indigo-700 text-white'
                      : 'text-indigo-200 hover:bg-indigo-500 hover:text-white'
                  }`}
                >
                  Bills
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <span className="text-indigo-200 text-sm mr-4">
                Welcome, {user?.full_name || user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800"
              >
                Logout
              </button>
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={handleLogout}
              className="bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/dashboard"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/dashboard')
                ? 'bg-indigo-700 text-white'
                : 'text-indigo-200 hover:bg-indigo-500 hover:text-white'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/bills"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/bills') || location.pathname.startsWith('/bills')
                ? 'bg-indigo-700 text-white'
                : 'text-indigo-200 hover:bg-indigo-500 hover:text-white'
            }`}
          >
            Bills
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;