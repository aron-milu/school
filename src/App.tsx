import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Suspense, lazy } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';

const Login = lazy(() => import('./pages/Login'));
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

            <Route
              path="/student/*"
              element={<ProtectedRoute role="student" element={<StudentDashboard />} />}
            />
            <Route
              path="/teacher/*"
              element={<ProtectedRoute role="teacher" element={<TeacherDashboard />} />}
            />
            <Route
              path="/school-admin/*"
              element={<ProtectedRoute role="school_admin" element={<SchoolAdminDashboard />} />}
            />
            <Route
              path="/super-admin/*"
              element={<ProtectedRoute role="super_admin" element={<SuperAdminDashboard />} />}
            />
            <Route
              path="/guardian/*"
              element={<ProtectedRoute role="guardian" element={<GuardianDashboard />} />}
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
