import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Suspense, lazy } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Signup = lazy(() => import('./pages/Signup'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const SchoolAdminDashboard = lazy(() => import('./pages/SchoolAdminDashboard'));
const SuperAdminDashboard = lazy(() => import('./pages/SuperAdminDashboard'));
const GuardianDashboard = lazy(() => import('./pages/GuardianDashboard'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/student/*"
              element={<ProtectedRoute role="student" element={<MainLayout><StudentDashboard /></MainLayout>} />}
            />
            <Route
              path="/teacher/*"
              element={<ProtectedRoute role="teacher" element={<MainLayout><TeacherDashboard /></MainLayout>} />}
            />
            <Route
              path="/school-admin/*"
              element={<ProtectedRoute role="school_admin" element={<MainLayout><SchoolAdminDashboard /></MainLayout>} />}
            />
            <Route
              path="/super-admin/*"
              element={<ProtectedRoute role="super_admin" element={<MainLayout><SuperAdminDashboard /></MainLayout>} />}
            />
            <Route
              path="/guardian/*"
              element={<ProtectedRoute role="guardian" element={<MainLayout><GuardianDashboard /></MainLayout>} />}
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
