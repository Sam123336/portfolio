import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = !!user;
  const isLoggedIn = !!user;

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Public navigation links visible to all users
  const publicNavLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/cv', label: 'CV', icon: '📄' },
    { path: '/projects', label: 'Projects', icon: '💼' },
    { path: '/contact', label: 'Contact', icon: '📧' },
    { path: '/portfolios', label: 'Browse Portfolios', icon: '👥' },
  ];

  // Admin-only navigation links
  const adminNavLinks = [
    { path: '/skills', label: 'Skills', icon: '⚡' },
    { path: '/images', label: 'Gallery', icon: '🖼️' },
    { path: '/admin', label: 'Dashboard', icon: '⚙️' },
  ];

  // Always visible admin setup link
  const adminSetupLinks = [
    { path: '/admin/register', label: 'Admin Setup', icon: '👤' },
  ];

  // Combine nav links based on user role
  const navLinks = isAdmin 
    ? [...publicNavLinks, ...adminNavLinks] 
    : [...publicNavLinks, ...adminSetupLinks];

  // Add login link for non-authenticated users
  if (!isLoggedIn) {
    navLinks.push({ path: '/login', label: 'Login', icon: '🔑' });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>
      
      <nav 
        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out"
        style={{
          filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25))',
        }}
      >
        {/* Main Navigation Container */}
        <div 
          className="relative bg-black/20 backdrop-blur-3xl border border-white/10 rounded-3xl px-6 py-3 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(20, 20, 20, 0.6) 50%, rgba(0, 0, 0, 0.8) 100%)',
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -1px 0 rgba(255, 255, 255, 0.05),
              0 0 100px rgba(59, 130, 246, 0.1)
            `,
          }}
        >
          {/* Animated border gradient */}
          <div 
            className="absolute inset-0 rounded-3xl opacity-50"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
              animation: 'borderGlow 3s ease-in-out infinite',
            }}
          />
          
          <div className="flex items-center justify-between relative z-10">
            {/* Logo */}
            <Link 
              to="/" 
              className="group flex items-center space-x-3 font-bold text-xl hover:scale-105 transition-all duration-300"
              aria-label="Portfolio Home"
            >
              <div 
                className="relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/40 transition-all duration-300 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                }}
              >
                <svg className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                
                {/* Animated shine effect */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"
                />
              </div>
              <span 
                className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent font-extrabold tracking-wide"
                style={{ textShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
              >
                Portfolio
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`group relative px-4 py-2.5 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-black/20 ${
                    isActive(link.path)
                      ? 'text-white shadow-lg'
                      : 'text-white hover:text-white'
                  }`}
                  style={isActive(link.path) ? {
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.2) 100%)',
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  } : {}}
                  aria-label={`Navigate to ${link.label}`}
                >
                  <span className="flex items-center space-x-2 relative z-10">
                    <span className="text-sm">{link.icon}</span>
                    <span>{link.label}</span>
                  </span>
                  
                  {/* Hover effect */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.1) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                </Link>
              ))}

              {/* Login Button - only show when not logged in */}
              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="group relative px-4 py-2.5 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-black/20 text-white hover:text-white ml-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(22, 163, 74, 0.2) 100%)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                  }}
                  aria-label="Login"
                >
                  <span className="flex items-center space-x-2 relative z-10">
                    <span className="text-sm">🔑</span>
                    <span>Login</span>
                  </span>
                  
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                </Link>
              )}

              {/* Logout Button - only show when logged in */}
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="group relative px-4 py-2.5 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-black/20 text-white hover:text-white ml-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                  }}
                  aria-label="Logout"
                >
                  <span className="flex items-center space-x-2 relative z-10">
                    <span className="text-sm">🚪</span>
                    <span>Logout</span>
                  </span>
                  
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.4) 0%, rgba(220, 38, 38, 0.3) 100%)',
                    }}
                  />
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 rounded-2xl text-white hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-black/20"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
              >
                <svg 
                  className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div 
            className="lg:hidden absolute top-full left-0 right-0 mt-4 py-4 space-y-2 rounded-3xl border border-white/10 shadow-2xl animate-fadeIn"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(20, 20, 20, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
            }}
          >
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth Actions */}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                <span className="mr-2">🚪</span>
                Logout
              </button>
            ) : null}
          </div>
        )}
      </nav>

      {/* Custom styles */}
      <style jsx={true}>{`
        @keyframes borderGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;
