import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, AuthProvider, useAuth } from './contexts';
import PublicPage from './pages/PublicPage';
import MemePage from './pages/MemePage';
import CustomCursor from './components/CustomCursor';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import ManageProfile from './pages/admin/ManageProfile';
import ManageSkills from './pages/admin/ManageSkills';
import ManageProjects from './pages/admin/ManageProjects';
import ManageExperience from './pages/admin/ManageExperience';
import ActivityLogs from './pages/admin/ActivityLogs';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import Feedback from './pages/Feedback';
import FeedbackManager from './pages/admin/FeedbackManager';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  return isAdmin ? <>{children}</> : <Navigate to="/login" />;
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/feedback" element={<Feedback />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute><Dashboard /></AdminRoute>
            } />
            <Route path="/admin/profile" element={
              <AdminRoute><ManageProfile /></AdminRoute>
            } />
            <Route path="/admin/skills" element={
              <AdminRoute><ManageSkills /></AdminRoute>
            } />
            <Route path="/admin/projects" element={
              <AdminRoute><ManageProjects /></AdminRoute>
            } />
            <Route path="/admin/experience" element={
              <AdminRoute><ManageExperience /></AdminRoute>
            } />
            <Route path="/admin/logs" element={
              <AdminRoute><ActivityLogs /></AdminRoute>
            } />
            <Route path="/admin/analytics" element={
              <AdminRoute><AnalyticsDashboard /></AdminRoute>
            } />
            <Route path="/admin/feedback" element={
              <AdminRoute><FeedbackManager /></AdminRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}