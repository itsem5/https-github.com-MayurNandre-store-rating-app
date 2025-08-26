import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/common/Header';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import StoreManagement from './components/admin/StoreManagement';
import StoreListing from './components/user/StoreListing';
import ProfileSettings from './components/user/ProfileSettings';
import OwnerDashboard from './components/store-owner/OwnerDashboard';
import Loading from './components/common/Loading';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen message="Loading application..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Header />}
      
      <main className={user ? 'pt-16' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to={getDashboardRoute(user.role)} />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to={getDashboardRoute(user.role)} />} 
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div className="container mx-auto px-4 py-8">
                  <AdminDashboard />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div className="container mx-auto px-4 py-8">
                  <UserManagement />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div className="container mx-auto px-4 py-8">
                  <StoreManagement />
                </div>
              </ProtectedRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/stores"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <div className="container mx-auto px-4 py-8">
                  <StoreListing />
                </div>
              </ProtectedRoute>
            }
          />
          
          {/* Store Owner Routes */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={['store_owner']}>
                <div className="container mx-auto px-4 py-8">
                  <OwnerDashboard />
                </div>
              </ProtectedRoute>
            }
          />

          {/* Shared Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div className="container mx-auto px-4 py-8">
                  <ProfileSettings />
                </div>
              </ProtectedRoute>
            }
          />

          {/* Unauthorized Route */}
          <Route
            path="/unauthorized"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚫</div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                  <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
                  <button
                    onClick={() => window.history.back()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            }
          />

          {/* Default redirect */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to={getDashboardRoute(user.role)} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* 404 Route */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
                  <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
                  <button
                    onClick={() => window.location.href = user ? getDashboardRoute(user.role) : '/login'}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            } 
          />
        </Routes>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="text-sm"
        bodyClassName="text-sm"
      />
    </div>
  );
};

const getDashboardRoute = (role) => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'user':
      return '/stores';
    case 'store_owner':
      return '/owner';
    default:
      return '/login';
  }
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;