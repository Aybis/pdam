import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Bills from './pages/Bills';
import BillForm from './pages/BillForm';
import './App.css';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div className="App">
        {user && <Navigation />}
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bills"
            element={
              <ProtectedRoute>
                <Bills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bills/new"
            element={
              <ProtectedRoute>
                <BillForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bills/edit/:id"
            element={
              <ProtectedRoute>
                <BillForm />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
