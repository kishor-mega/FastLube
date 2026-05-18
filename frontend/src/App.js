import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import RetailerDashboard from './pages/retailer/Dashboard';
import RetailerProducts from './pages/retailer/Products';
import AddProduct from './pages/retailer/AddProduct';
import EditProduct from './pages/retailer/EditProduct';
import CustomerProfile from './pages/customer/Profile';
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Retailer Routes */}
          <Route 
            path="/retailer/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['retailer']}>
                <RetailerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/retailer/products" 
            element={
              <ProtectedRoute allowedRoles={['retailer']}>
                <RetailerProducts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/retailer/products/add" 
            element={
              <ProtectedRoute allowedRoles={['retailer']}>
                <AddProduct />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/retailer/products/edit/:id" 
            element={
              <ProtectedRoute allowedRoles={['retailer']}>
                <EditProduct />
              </ProtectedRoute>
            } 
          />
          
          {/* Customer Routes */}
          <Route 
            path="/customer/profile" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 