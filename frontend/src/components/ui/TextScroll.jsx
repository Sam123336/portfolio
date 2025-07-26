import React, { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';

// Custom hook to detect when element is in view
const useInView = (ref, options = {}) => {
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -10% 0px'
      }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options.threshold, options.rootMargin]);
  
  return isInView;
};

const TextScroll = ({ 
  children, 
  className = "",
  direction = "up", // "up", "down", "left", "right"
  duration = 0.8,
  delay = 0,
  triggerOnce = true,
  threshold = 0.1
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && (!hasAnimated || !triggerOnce)) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated, triggerOnce]);

  const shouldAnimate = triggerOnce ? hasAnimated : isInView;

  const getAnimationClass = () => {
    switch (direction) {
      case "up":
        return shouldAnimate ? "animate-slide-up-in" : "animate-slide-up-out";
      case "down":
        return shouldAnimate ? "animate-slide-down-in" : "animate-slide-down-out";
      case "left":
        return shouldAnimate ? "animate-slide-left-in" : "animate-slide-left-out";
      case "right":
        return shouldAnimate ? "animate-slide-right-in" : "animate-slide-right-out";
      default:
        return shouldAnimate ? "animate-slide-up-in" : "animate-slide-up-out";
    }
  };

  return (
    <div
      ref={ref}
      className={clsx(
        "transition-opacity duration-700",
        getAnimationClass(),
        className
      )}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        animationFillMode: 'both'
      }}
    >
      {children}
      
      <style>{`
        @keyframes slide-up-in {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up-out {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(50px);
          }
        }
        
        @keyframes slide-down-in {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down-out {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-50px);
          }
        }
        
        @keyframes slide-left-in {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-left-out {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(50px);
          }
        }
        
        @keyframes slide-right-in {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-right-out {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-50px);
          }
        }
        
        @keyframes scroll-text {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-slide-up-in {
          animation: slide-up-in ease-out forwards;
        }
        
        .animate-slide-up-out {
          animation: slide-up-out ease-out forwards;
        }
        
        .animate-slide-down-in {
          animation: slide-down-in ease-out forwards;
        }
        
        .animate-slide-down-out {
          animation: slide-down-out ease-out forwards;
        }
        
        .animate-slide-left-in {
          animation: slide-left-in ease-out forwards;
        }
        
        .animate-slide-left-out {
          animation: slide-left-out ease-out forwards;
        }
        
        .animate-slide-right-in {
          animation: slide-right-in ease-out forwards;
        }
        
        .animate-slide-right-out {
          animation: slide-right-out ease-out forwards;
        }
        
        .animate-scroll-text {
          animation: scroll-text linear infinite;
        }
      `}</style>
    </div>
  );
};

// Alternative implementation for continuous scrolling text
const ScrollingText = ({ 
  text, 
  speed = 50, 
  direction = "left",
  className = "",
  pauseOnHover = true
}) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div 
      className={clsx("overflow-hidden whitespace-nowrap", className)}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div
        className="inline-block animate-scroll-text"
        style={{
          animationDirection: direction === "left" ? "normal" : "reverse",
          animationDuration: `${speed}s`,
          animationPlayState: isPaused ? 'paused' : 'running'
        }}
      >
        <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {text} • {text} • {text} • {text} • 
        </span>
      </div>
      
      <style>{`
        .animate-scroll-text {
          animation: scroll-text linear infinite;
        }
      `}</style>
    </div>
  );
};

export { ScrollingText };
export default TextScroll;