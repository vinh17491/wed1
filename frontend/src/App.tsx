import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, AuthProvider, useAuth } from './contexts';
import CustomCursor from './components/CustomCursor';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages
const PublicPage = lazy(() => import('./pages/PublicPage'));
const MemePage = lazy(() => import('./pages/MemePage'));
const LoveJourneyPage = lazy(() => import('./pages/LoveJourneyPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Feedback = lazy(() => import('./pages/Feedback'));
const ShopHome = lazy(() => import('./pages/ShopHome'));

// Admin pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageProfile = lazy(() => import('./pages/admin/ManageProfile'));
const ManageSkills = lazy(() => import('./pages/admin/ManageSkills'));
const ManageProjects = lazy(() => import('./pages/admin/ManageProjects'));
const ManageExperience = lazy(() => import('./pages/admin/ManageExperience'));
const ActivityLogs = lazy(() => import('./pages/admin/ActivityLogs'));
const AnalyticsDashboard = lazy(() => import('./pages/admin/AnalyticsDashboard'));
const FeedbackManager = lazy(() => import('./pages/admin/FeedbackManager'));

// Optimized Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#020617]">
    <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
  </div>
);

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  return isAdmin ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
        <CustomCursor />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<PublicPage />} />
              <Route path="/memes" element={<MemePage />} />
              <Route path="/love-journey" element={<LoveJourneyPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/shop" element={<ShopHome />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="/admin/profile" element={<AdminRoute><ManageProfile /></AdminRoute>} />
              <Route path="/admin/skills" element={<AdminRoute><ManageSkills /></AdminRoute>} />
              <Route path="/admin/projects" element={<AdminRoute><ManageProjects /></AdminRoute>} />
              <Route path="/admin/experience" element={<AdminRoute><ManageExperience /></AdminRoute>} />
              <Route path="/admin/logs" element={<AdminRoute><ActivityLogs /></AdminRoute>} />
              <Route path="/admin/analytics" element={<AdminRoute><AnalyticsDashboard /></AdminRoute>} />
              <Route path="/admin/feedback" element={<AdminRoute><FeedbackManager /></AdminRoute>} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}