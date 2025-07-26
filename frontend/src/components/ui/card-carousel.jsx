import React, { useState, useEffect } from 'react';

export const CardCarousel = ({ 
  images = [], 
  autoplayDelay = 3000, 
  showPagination = true, 
  showNavigation = true,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality that pauses on hover
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [images.length, autoplayDelay, isHovered]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`relative w-full h-96 bg-gradient-to-br from-gray-900/90 via-slate-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border border-gray-700/50 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-emerald-500/30 shadow-2xl">
            <svg className="w-10 h-10 text-emerald-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-300 text-lg font-medium">Gallery Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full max-w-lg mx-auto ${className}`}>
      {/* Main card container with modern glassmorphism design */}
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card stack effect - background cards */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-red-600/20 rounded-3xl transform rotate-1 scale-[0.98] blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-cyan-600/20 to-teal-600/20 rounded-3xl transform -rotate-1 scale-[0.99] blur-sm"></div>
        
        {/* Main card */}
        <div className="relative h-96 overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/95 via-slate-800/95 to-gray-900/95 backdrop-blur-2xl border-2 border-gray-700/50 shadow-2xl shadow-black/50 transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-3xl group-hover:shadow-emerald-500/20">
          
          {/* Animated gradient border on hover */}
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 via-blue-500/30 to-purple-500/30 p-[2px] animate-pulse">
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"></div>
            </div>
          </div>

          {/* Images container with 3D effect */}
          <div className="relative h-full overflow-hidden rounded-3xl">
            <div 
              className="flex transition-all duration-1000 ease-out h-full"
              style={{ 
                transform: `translateX(-${currentIndex * 100}%) rotateY(${currentIndex * 2}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {images.map((image, index) => {
                const isActive = index === currentIndex;
                const offset = index - currentIndex;
                
                return (
                  <div 
                    key={index} 
                    className="min-w-full h-full relative transform transition-all duration-1000"
                    style={{
                      transform: `translateZ(${isActive ? '0px' : '-100px'}) rotateY(${offset * 15}deg)`,
                      filter: isActive ? 'brightness(1)' : 'brightness(0.7)',
                    }}
                  >
                    <img
                      src={image.src || image}
                      alt={image.alt || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=400&fit=crop`;
                      }}
                    />
                    
                    {/* Holographic overlay effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent via-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                    
                    {/* Modern info card overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-bold text-lg mb-1">
                              {image.alt || `Gallery Image ${index + 1}`}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                              <span className="text-emerald-300 text-sm font-medium">Live Preview</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </div>
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Futuristic Navigation arrows */}
          {showNavigation && images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white hover:from-emerald-600/80 hover:to-cyan-600/80 transition-all duration-300 border border-white/10 hover:border-emerald-400/50 hover:scale-110 shadow-2xl group/btn opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6 group-hover/btn:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white hover:from-emerald-600/80 hover:to-cyan-600/80 transition-all duration-300 border border-white/10 hover:border-emerald-400/50 hover:scale-110 shadow-2xl group/btn opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <svg className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              </button>
            </>
          )}

          {/* Modern counter with progress ring */}
          <div className="absolute top-6 right-6">
            <div className="relative w-16 h-16">
              {/* Progress ring */}
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="url(#progressGradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - (currentIndex + 1) / images.length)}`}
                  className="transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Counter text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 backdrop-blur-xl rounded-full w-10 h-10 flex items-center justify-center border border-white/20">
                  <span className="text-white text-xs font-bold">
                    {currentIndex + 1}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-play indicator */}
          <div className="absolute top-6 left-6">
            <div className="flex items-center space-x-2 px-3 py-2 bg-black/60 backdrop-blur-xl rounded-full border border-white/20">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-bold tracking-wider">AUTO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern pagination with morphing dots */}
      {showPagination && images.length > 1 && (
        <div className="flex justify-center mt-8 space-x-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative transition-all duration-500 ${
                index === currentIndex
                  ? 'w-12 h-4'
                  : 'w-4 h-4 hover:w-6'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className={`w-full h-full rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 shadow-lg shadow-emerald-400/50'
                  : 'bg-gray-600/80 hover:bg-gray-500/80'
              }`}></div>
              
              {index === currentIndex && (
                <>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 animate-pulse opacity-30"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                </>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Interactive guide */}
      <div className="text-center mt-6 opacity-60 hover:opacity-100 transition-opacity duration-300">
        <div className="inline-flex items-center space-x-3 px-4 py-2 bg-gray-900/50 backdrop-blur-xl rounded-full border border-gray-700/50">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span className="text-gray-300 text-sm font-medium">Hover to explore</span>
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
};