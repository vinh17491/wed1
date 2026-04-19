import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, AuthProvider, useAuth } from './contexts';
import PublicPage from './pages/PublicPage';
import MemePage from './pages/MemePage';
import CustomCursor from './components/CustomCursor';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProfile from './pages/admin/ManageProfile';
import ManageSkills from './pages/admin/ManageSkills';
import ManageProjects from './pages/admin/ManageProjects';
import ManageExperience from './pages/admin/ManageExperience';
import ActivityLogs from './pages/admin/ActivityLogs';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import FeedbackPage from './pages/FeedbackPage';
import ManageFeedback from './pages/admin/ManageFeedback';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  return isAdmin ? <>{children}</> : <Navigate to="/admin/login" />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CustomCursor />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicPage />} />
            <Route path="/memes" element={<MemePage />} />
            <Route path="/admin/login" element={<Login />} />
            
            <Route path="/admin" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/admin/profile" element={
              <ProtectedRoute><ManageProfile /></ProtectedRoute>
            } />
            <Route path="/admin/skills" element={
              <ProtectedRoute><ManageSkills /></ProtectedRoute>
            } />
            <Route path="/admin/projects" element={
              <ProtectedRoute><ManageProjects /></ProtectedRoute>
            } />
            <Route path="/admin/experience" element={
              <ProtectedRoute><ManageExperience /></ProtectedRoute>
            } />
            <Route path="/admin/logs" element={
              <ProtectedRoute><ActivityLogs /></ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/feedback" element={
              <ProtectedRoute><ManageFeedback /></ProtectedRoute>
            } />
            <Route path="/feedback" element={<FeedbackPage />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}