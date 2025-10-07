import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './stores/appStore';
import LoginPage from './components/pages/LoginPage';
import DashboardPage from './components/pages/DashboardPage';
import AddReadingPage from './components/pages/AddReadingPage';
import AdminPage from './components/pages/AdminPage';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAppStore();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  useEffect(() => {
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="bg-gray-900 text-white min-h-screen">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-reading"
            element={
              <ProtectedRoute>
                <AddReadingPage />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
