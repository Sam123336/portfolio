import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './hooks/useAuth';
import { MusicProvider } from './components/MusicProvider';

import PortfolioViewer from './pages/PortfolioViewer';
import Projects from './pages/Projects';
import Images from './pages/Images';
import Contact from './pages/Contact';
import Skills from './pages/Skills';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import MusicConsentPopup from './components/MusicConsentPopup';

const App = () => {
  const [musicConsent, setMusicConsent] = React.useState(false);

  return (
    <AuthProvider>
      <MusicProvider>
        <Router>
          {/* Always dark theme background */}
          <div className="min-h-screen bg-black transition-colors duration-300">
            {/* Dark mode pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900/30 via-black to-black"></div>
            
            {/* Animated accent elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-1/3 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>
            
            <div className="relative z-10">
              <Navbar />
              <MusicConsentPopup onConsent={setMusicConsent} />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<PortfolioViewer />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/images" element={<Images />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/skills" element={<Skills />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </MusicProvider>
    </AuthProvider>
  );
};

export default App;