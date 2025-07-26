import React, { useState, useEffect } from 'react';
import { useMusic } from './MusicProvider';

const MusicConsentPopup = ({ onConsent }) => {
  const [showPopup, setShowPopup] = useState(false);
  const { handleConsent } = useMusic();

  useEffect(() => {
    // Always show the popup after a short delay, regardless of localStorage
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleConsentClick = (consent) => {
    localStorage.setItem('musicConsent', consent ? 'true' : 'false');
    setShowPopup(false);
    onConsent(consent);
    handleConsent(consent);
  };

  if (!showPopup) {
    return null;
  }

  // Popup UI for music consent with dark mode support
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-sm w-full text-center animate-fade-in border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Enable Background Music?</h2>
        </div>
        
        <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          Would you like to enable background music while viewing the portfolio? 
          This creates a more immersive experience.
        </p>
        
        <div className="flex gap-3 justify-center">
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={() => handleConsentClick(true)}
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
              Allow
            </span>
          </button>
          <button
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            onClick={() => handleConsentClick(false)}
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Deny
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicConsentPopup;
