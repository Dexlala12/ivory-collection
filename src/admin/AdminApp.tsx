import { Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';
import Login from './Login';
import Layout from './Layout';
import Dashboard from './sections/Dashboard';
import Products from './sections/Products';
import CategoriesActivities from './sections/CategoriesActivities';
import HomeContent from './sections/HomeContent';
import HeaderFooter from './sections/HeaderFooter';
import Pages from './sections/Pages';
import SettingsSection from './sections/SettingsSection';
import Orders from './sections/Orders';
import Staff from './sections/Staff';

function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAdminAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-mono text-xs uppercase tracking-widest text-black/40">
        Loading...
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<CategoriesActivities />} />
          <Route path="home" element={<HomeContent />} />
          <Route path="header-footer" element={<HeaderFooter />} />
          <Route path="pages" element={<Pages />} />
          <Route path="settings" element={<SettingsSection />} />
          <Route path="orders" element={<Orders />} />
          <Route path="staff" element={<Staff />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}
