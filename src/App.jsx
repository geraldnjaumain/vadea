import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SocialProof from './components/SocialProof';
import Features from './components/Features';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Schedule from './pages/Schedule';
import Vault from './pages/Vault';
import AILab from './pages/AILab';
import Settings from './pages/Settings';
import './styles/Home.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProblemSolution from './components/ProblemSolution';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Landing Page Component to keep App.jsx clean
const Home = () => {
  // Cursor Spotlight Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for the spotlight
  const springX = useSpring(mouseX, { stiffness: 500, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 30 });

  useEffect(() => {
    // Spotlight (background)
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      className="home-container"
      style={{ position: 'relative', overflowX: 'hidden' }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Noise Overlay */}
      <div className="noise-overlay"></div>

      {/* Cursor Spotlight */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 255, 0, 0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'screen',
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      />

      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <ProblemSolution />
      <FinalCTA />
      <Footer />
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

import HomeV3 from './components/home/HomeV3';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeV3 />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />

            {/* Protected App Routes */}
            <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/app/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            <Route path="/app/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
            <Route path="/app/vault" element={<ProtectedRoute><Vault /></ProtectedRoute>} />
            <Route path="/app/ai" element={<ProtectedRoute><AILab /></ProtectedRoute>} />
            <Route path="/app/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
