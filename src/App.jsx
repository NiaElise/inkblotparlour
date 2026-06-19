import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import CirclesPage from './pages/CirclesPage';
import MethodPage from './pages/MethodPage';
import TiersPage from './pages/TiersPage';
import FeedPage from './pages/FeedPage';
import SignupPage from './pages/SignupPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import SanctuaryLayout from './components/sanctuary/SanctuaryLayout';
import SanctuaryDashboard from './components/sanctuary/SanctuaryDashboard';
import SanctuaryStudio from './components/sanctuary/SanctuaryStudio';
import SanctuaryCabinet from './components/sanctuary/SanctuaryCabinet';
import SanctuaryJournal from './components/sanctuary/SanctuaryJournal';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';
import LibrarianChat from './components/moderation/ModerationUI';
import { fetchMe } from './api';

function ProtectedRoute({ children, adminOnly = false }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function checkAuth() {
      try {
        const me = await fetchMe();
        setUser(me);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [location]);

  if (loading) return <div className="min-h-screen bg-void flex items-center justify-center text-sepia font-serif italic">Verifying identity...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/sanctuary" replace />;
  }

  return children;
}

import UserProfile from './components/UserProfile';

export default function App() {
  return (
    <div className="min-h-screen selection:bg-sepia/30 selection:text-parchment-light">
      <LibrarianChat />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/circles" element={<CirclesPage />} />
        <Route path="/method" element={<MethodPage />} />
        <Route path="/tiers" element={<TiersPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        
        <Route 
          path="/sanctuary" 
          element={
            <ProtectedRoute>
              <SanctuaryLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SanctuaryDashboard />} />
          <Route path="studio/:worldId" element={<SanctuaryStudio />} />
          <Route path="cabinet" element={<SanctuaryCabinet />} />
          <Route path="cabinet/:characterId" element={<SanctuaryCabinet />} />
          <Route path="journal" element={<SanctuaryJournal />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
