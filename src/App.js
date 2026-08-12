import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './components/Notifications/NotificationProvider';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AppLayout from './components/layout/AppLayout/AppLayout';
import LoginPage from './pages/Auth/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProfilePage from './pages/Modules/Profile/ProfilePage';
import LikizoPage from './pages/Modules/Likizo/LikizoPage';
import TrainingPage from './pages/Modules/Training/TrainingPage';
import AnnouncementsPage from './pages/Modules/Announcements/AnnouncementsPage';
import DocumentsPage from './pages/Modules/Documents/DocumentsPage';
import SalaryPage from './pages/Modules/Salary/SalaryPage';
import StaffIdPage from './pages/Modules/StaffId/StaffIdPage';
import TransferPage from './pages/Modules/Transfer/TransferPage';
import LoanPage from './pages/Modules/Loan/LoanPage';
import AnuaiPage from './pages/Modules/Anuai/AnuaiPage';
import './styles/global.css';

import { MODULES } from './config/permissions';

const PROTECTED_ROUTES = [
  { path: '/dashboard', module: MODULES.DASHBOARD, title: 'Dashboard', subtitle: 'Overview of your HR activities', element: <DashboardPage /> },
  { path: '/modules/profile', module: MODULES.PROFILE, title: 'My Profile', subtitle: 'Personal & employment details', element: <ProfilePage /> },
  { path: '/modules/staff-id', module: MODULES.STAFF_ID, title: 'Staff ID', subtitle: 'Your official identification', element: <StaffIdPage /> },
  { path: '/modules/transfer', module: MODULES.TRANSFER, title: 'Transfer', subtitle: 'Transfer requests and history', element: <TransferPage /> },
  { path: '/modules/likizo', module: MODULES.LIKIZO, title: 'Leave Management', subtitle: 'Apply and track leave requests', element: <LikizoPage /> },
  { path: '/modules/training', module: MODULES.TRAINING, title: 'Training', subtitle: 'Professional development programs', element: <TrainingPage /> },
  { path: '/modules/announcements', module: MODULES.ANNOUNCEMENTS, title: 'Announcements', subtitle: 'HR news and updates', element: <AnnouncementsPage /> },
  { path: '/modules/anuai-za-jamii', module: MODULES.ANUAI, title: 'Anuai za Jamii', subtitle: 'Social Diversity in Public Service and Institutions in Tanzania', element: <AnuaiPage /> },
  { path: '/modules/documents', module: MODULES.DOCUMENTS, title: 'Documents', subtitle: 'Your official documents', element: <DocumentsPage /> },
  { path: '/modules/salary', module: MODULES.SALARY, title: 'Salary', subtitle: 'View payslips and earnings', element: <SalaryPage /> },
  { path: '/modules/loan', module: MODULES.LOAN, title: 'Loan', subtitle: 'Loan applications and status', element: <LoanPage /> },
];

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      {PROTECTED_ROUTES.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <ProtectedRoute requirePermission={{ module: route.module, action: 'view' }}>
              <AppLayout title={route.title} subtitle={route.subtitle}>
                {route.element}
              </AppLayout>
            </ProtectedRoute>
          }
        />
      ))}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
