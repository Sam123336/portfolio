import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

const CardSwipe = ({
  images = [],
  autoplayDelay = 2000,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('CardSwipe - Images:', images);
    console.log('CardSwipe - Images length:', images.length);
    console.log('CardSwipe - Current index:', currentIndex);
  }, [images, currentIndex]);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [images.length, autoplayDelay, currentIndex]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-80 bg-gray-800/80 dark:bg-gray-900/80 rounded-xl flex items-center justify-center border border-gray-700/50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700/50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-400 font-medium">No gallery images</p>
          <p className="text-gray-500 text-sm mt-1">Images will appear here when available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("relative w-full max-w-sm mx-auto", className)}>
      <div className="relative w-full h-80">
        {/* Card stack container */}
        <div className="absolute inset-0">
          {images.map((image, index) => {
            const offset = index - currentIndex;
            const isActive = index === currentIndex;
            const isNext = index === (currentIndex + 1) % images.length;
            const isPrev = index === (currentIndex - 1 + images.length) % images.length;
            
            // Clean z-index calculation
            let zIndex = 10;
            if (isActive) zIndex = 30;
            else if (isNext || isPrev) zIndex = 20;
            else zIndex = 10 - Math.abs(offset);
            
            return (
              <div
                key={`slide-${index}`}
                className={clsx(
                  "absolute w-full h-full transition-all duration-500 ease-out cursor-pointer",
                  !isActive && !isNext && !isPrev && "opacity-20 scale-75"
                )}
                onClick={nextSlide}
                style={{
                  transform: `
                    translateX(${offset * 15}px) 
                    translateY(${Math.abs(offset) * 5}px) 
                    scale(${isActive ? 1 : 0.92 - Math.abs(offset) * 0.05}) 
                    rotateY(${offset * 10}deg)
                  `,
                  zIndex: zIndex,
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                <div className="relative w-full h-full bg-gray-900/90 rounded-2xl overflow-hidden shadow-2xl border border-gray-600/30 backdrop-blur-sm">
                  {/* Image container with better error handling */}
                  <div className="relative w-full h-full">
                    <img
                      src={typeof image === 'string' ? image : image.src}
                      alt={typeof image === 'string' ? `Gallery image ${index + 1}` : image.alt || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      draggable={false}
                      onError={(e) => {
                        console.error('Image failed to load:', e.target.src);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', typeof image === 'string' ? image : image.src);
                      }}
                    />
                    
                    {/* Fallback for failed images */}
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center hidden">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-400 text-sm">Image unavailable</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtle overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
                  
                  {/* Card number indicator with better visibility */}
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold text-white shadow-lg border border-white/20">
                    {index + 1}
                  </div>
                  
                  {/* Active card indicator */}
                  {isActive && (
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-emerald-500/90 backdrop-blur-sm rounded-full text-xs font-bold text-white shadow-lg">
                      Active
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Enhanced navigation controls */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="p-3 rounded-full bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 group border border-gray-600/50 hover:border-emerald-500/50 hover:bg-gray-700/80"
        >
          <svg className="w-5 h-5 text-gray-300 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Enhanced dots indicator */}
        <div className="flex space-x-3">
          {images.map((_, index) => (
            <button
              key={`dot-${index}`}
              className={clsx(
                "rounded-full transition-all duration-300 border",
                index === currentIndex 
                  ? "bg-emerald-500 w-8 h-3 border-emerald-400" 
                  : "bg-gray-600 w-3 h-3 border-gray-500 hover:bg-gray-500 hover:border-gray-400"
              )}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="p-3 rounded-full bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 group border border-gray-600/50 hover:border-emerald-500/50 hover:bg-gray-700/80"
        >
          <svg className="w-5 h-5 text-gray-300 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Enhanced usage hint */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-400">
          {images.length > 1 ? `${currentIndex + 1} of ${images.length} • Click to navigate` : 'Gallery image'}
        </p>
      </div>
    </div>
  );
};

export default CardSwipe;