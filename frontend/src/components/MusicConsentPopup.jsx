import React, { useState, useEffect } from 'react';
import { useMusic } from './MusicProvider';

const MusicConsentPopup = ({ onConsent }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { handleConsent } = useMusic();

  useEffect(() => {
    // Show the popup after a short delay
    const timer = setTimeout(() => {
      setShowPopup(true);
      // Add a small delay for the entrance animation
      setTimeout(() => setIsVisible(true), 100);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleConsentClick = (consent) => {
    setIsVisible(false);
    // Wait for exit animation before hiding
    setTimeout(() => {
      localStorage.setItem('musicConsent', consent ? 'true' : 'false');
      setShowPopup(false);
      onConsent(consent);
      handleConsent(consent);
    }, 300);
  };

  if (!showPopup) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm">
      <div 
        className={`relative transform transition-all duration-500 ease-out ${
          isVisible 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Floating particles animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float-${i} ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Main popup container */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-white/20 dark:border-gray-700/50 relative overflow-hidden">
          
          {/* Background gradient animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-pulse" />
          
          {/* Content */}
          <div className="relative z-10">
            
            {/* Animated Avatar Section */}
            <div className="mb-6">
              {/* Avatar with headphones */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                {/* Avatar face */}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg relative overflow-hidden">
                  {/* Face gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-full" />
                  
                  {/* Eyes */}
                  <div className="relative z-10 flex space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-blink" />
                    <div className="w-2 h-2 bg-white rounded-full animate-blink" style={{animationDelay: '0.1s'}} />
                  </div>
                  
                  {/* Smile */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-3 h-1.5 border-b-2 border-white rounded-full" />
                  </div>
                </div>
                
                {/* Animated headphones */}
                <div className="absolute -top-2 -left-2 w-24 h-24">
                  {/* Headphone band */}
                  <div className="absolute top-1 left-4 w-12 h-4 border-4 border-gray-700 dark:border-gray-300 rounded-t-full" />
                  
                  {/* Left speaker with sound waves */}
                  <div className="absolute top-6 left-0 w-8 h-8 bg-gray-800 dark:bg-gray-200 rounded-full border-2 border-gray-600 dark:border-gray-400 flex items-center justify-center">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                    {/* Sound waves */}
                    <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 bg-blue-400 rounded-full opacity-60"
                          style={{
                            left: `${i * 4}px`,
                            height: `${8 + i * 4}px`,
                            top: `${-4 - i * 2}px`,
                            animation: `soundWave ${0.8 + i * 0.2}s ease-in-out infinite`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Right speaker with sound waves */}
                  <div className="absolute top-6 right-0 w-8 h-8 bg-gray-800 dark:bg-gray-200 rounded-full border-2 border-gray-600 dark:border-gray-400 flex items-center justify-center">
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
                    {/* Sound waves */}
                    <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 bg-purple-400 rounded-full opacity-60"
                          style={{
                            right: `${i * 4}px`,
                            height: `${8 + i * 4}px`,
                            top: `${-4 - i * 2}px`,
                            animation: `soundWave ${0.8 + i * 0.2}s ease-in-out infinite`,
                            animationDelay: `${i * 0.1 + 0.5}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Animated music note */}
              <div className="relative">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                </div>
                {/* Floating music notes */}
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-blue-500 dark:text-blue-400 opacity-70"
                    style={{
                      fontSize: '12px',
                      left: `${-20 + i * 15}px`,
                      animation: `floatUp ${2 + i * 0.5}s ease-in-out infinite`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  >
                    ♪
                  </div>
                ))}
              </div>
            </div>

            {/* Animated title */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse" 
                  style={{
                    textShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(147, 51, 234, 0.3), 0 0 60px rgba(236, 72, 153, 0.2)',
                    filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.4))'
                  }}>
                Enable Background Music?
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto" 
                   style={{
                     boxShadow: '0 0 15px rgba(59, 130, 246, 0.6), 0 0 25px rgba(147, 51, 234, 0.4)'
                   }} />
            </div>
            
            <p className="mb-8 text-gray-700 dark:text-gray-300 leading-relaxed"
               style={{
                 textShadow: '0 0 15px rgba(59, 130, 246, 0.3), 0 0 25px rgba(147, 51, 234, 0.2)',
                 filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.2))'
               }}>
              Would you like to enable background music while viewing the portfolio? 
              This creates a more immersive experience with ambient sounds.
            </p>
            
            {/* Animated buttons */}
            <div className="flex gap-4 justify-center">
              <button
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl"
                onClick={() => handleConsentClick(true)}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                
                <span className="relative flex items-center">
                  <svg className="w-5 h-5 mr-2 animate-spin-slow" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                  Allow Music
                </span>
              </button>
              
              <button
                className="group relative overflow-hidden bg-gray-200/80 dark:bg-gray-700/80 hover:bg-gray-300/80 dark:hover:bg-gray-600/80 text-gray-800 dark:text-gray-200 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm"
                onClick={() => handleConsentClick(false)}
              >
                <span className="relative flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  No Thanks
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        @keyframes float-0 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(180deg); } }
        @keyframes float-1 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(90deg); } }
        @keyframes float-2 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-8px) rotate(270deg); } }
        @keyframes float-3 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-12px) rotate(45deg); } }
        @keyframes float-4 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-18px) rotate(135deg); } }
        @keyframes float-5 { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-7px) rotate(225deg); } }
        
        @keyframes soundWave {
          0%, 100% { transform: scaleY(0.3); opacity: 0.4; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        
        @keyframes floatUp {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-30px) rotate(360deg); opacity: 0; }
        }
        
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MusicConsentPopup;
