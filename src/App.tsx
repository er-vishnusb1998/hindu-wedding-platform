import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WeddingProvider } from './context/WeddingContext';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Route-based code splitting for optimal mobile bundle size
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const GuestInvitationPage = lazy(() => import('./pages/public/GuestInvitationPage').then(m => ({ default: m.GuestInvitationPage })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <WeddingProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner message="Loading application..." />}>
            <Routes>
              {/* Home Landing */}
              <Route path="/" element={<LandingPage />} />

              {/* Guest Public Loginless Invitation Links */}
              <Route path="/w/:slug" element={<GuestInvitationPage />} />
              <Route path="/invite/:slug" element={<GuestInvitationPage />} />

              {/* Admin Portal */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />

              {/* Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </WeddingProvider>
    </AuthProvider>
  );
};

export default App;
