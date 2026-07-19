import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './components/Notifications/NotificationProvider';
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
import NotificationsPage from './pages/Modules/Notifications/NotificationsPage';
import './styles/global.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function DashboardRoute() {
  return (
    <AppLayout
      title="Dashboard"
      subtitle="Overview of your HR activities"
    >
      <DashboardPage />
    </AppLayout>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardRoute /></PrivateRoute>} />
      <Route path="/modules/profile" element={<PrivateRoute><AppLayout title="My Profile" subtitle="Personal & employment details"><ProfilePage /></AppLayout></PrivateRoute>} />
      <Route path="/modules/likizo" element={<PrivateRoute><AppLayout title="Leave Management" subtitle="Apply and track leave requests"><LikizoPage /></AppLayout></PrivateRoute>} />
      <Route path="/modules/training" element={<PrivateRoute><AppLayout title="Training" subtitle="Professional development programs"><TrainingPage /></AppLayout></PrivateRoute>} />
      <Route path="/modules/announcements" element={<PrivateRoute><AppLayout title="Announcements" subtitle="HR news and updates"><AnnouncementsPage /></AppLayout></PrivateRoute>} />
      <Route path="/modules/documents" element={<PrivateRoute><AppLayout title="Documents" subtitle="Your official documents"><DocumentsPage /></AppLayout></PrivateRoute>} />
      <Route path="/modules/salary" element={<PrivateRoute><AppLayout title="Salary" subtitle="View payslips and earnings"><SalaryPage /></AppLayout></PrivateRoute>} />
      <Route path="/modules/staff-id" element={<PrivateRoute><AppLayout title="Staff ID" subtitle="Your official identification"><StaffIdPage /></AppLayout></PrivateRoute>} />
      <Route path="/modules/transfer" element={<PrivateRoute><AppLayout title="Transfer" subtitle="Transfer requests and history"><TransferPage /></AppLayout></PrivateRoute>} />
      <Route path="/modules/loan" element={<PrivateRoute><AppLayout title="Loan" subtitle="Loan applications and status"><LoanPage /></AppLayout></PrivateRoute>} />
      <Route path="/modules/notifications" element={<PrivateRoute><AppLayout title="Notifications" subtitle="View your notifications and activities"><NotificationsPage /></AppLayout></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
