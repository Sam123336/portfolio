import React, { useState, useRef, useCallback, useEffect } from 'react';

const ImageRipple = ({ 
  images = [],
  className = '',
  rippleColor = 'rgba(59, 130, 246, 0.4)',
  rippleSize = 150,
  rippleDuration = 2000,
  maxRipples = 8,
  backgroundImage = null,
  children,
  waterEffect = true,
  perturbance = 0.03,
  resolution = 512,
  cursorSensitivity = 0.15
}) => {
  const [ripples, setRipples] = useState([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef(null);
  const rippleIdRef = useRef(0);
  const lastMoveTime = useRef(0);
  const animationFrameRef = useRef(null);

  const createAdvancedRipple = useCallback((x, y, intensity = 1) => {
    if (!containerRef.current) return;

    const newRipple = {
      id: rippleIdRef.current++,
      x: x,
      y: y,
      size: rippleSize * intensity,
      duration: rippleDuration * (0.8 + intensity * 0.4),
      intensity: intensity,
      timestamp: Date.now(),
      type: intensity > 1.2 ? 'strong' : 'normal'
    };

    setRipples(prev => {
      const updatedRipples = [...prev, newRipple];
      if (updatedRipples.length > maxRipples) {
        return updatedRipples.slice(-maxRipples);
      }
      return updatedRipples;
    });

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, newRipple.duration);
  }, [rippleSize, rippleDuration, maxRipples]);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = Date.now();
    
    setCursorPos({ x, y });
    
    // Create ripples based on cursor movement speed
    if (now - lastMoveTime.current > 50) { // Throttle to 20fps
      const movementSpeed = Math.sqrt(
        Math.pow(e.movementX || 0, 2) + Math.pow(e.movementY || 0, 2)
      );
      
      const intensity = Math.min(1 + (movementSpeed * cursorSensitivity), 2);
      
      if (Math.random() < 0.3 + (intensity * 0.2)) {
        createAdvancedRipple(x, y, intensity);
      }
      
      lastMoveTime.current = now;
    }
  }, [createAdvancedRipple, cursorSensitivity]);

  const handleMouseEnter = useCallback((e) => {
    setIsActive(true);
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createAdvancedRipple(x, y, 1.5);
  }, [createAdvancedRipple]);

  const handleMouseLeave = useCallback(() => {
    setIsActive(false);
    setCursorPos({ x: 0, y: 0 });
  }, []);

  const handleClick = useCallback((e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createAdvancedRipple(x, y, 2);
  }, [createAdvancedRipple]);

  // Ambient ripples for natural water movement
  useEffect(() => {
    if (!waterEffect) return;

    const interval = setInterval(() => {
      if (containerRef.current && Math.random() > 0.8) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        createAdvancedRipple(x, y, 0.3 + Math.random() * 0.4);
      }
    }, 4000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [createAdvancedRipple, waterEffect]);

  // Cursor trail effect
  useEffect(() => {
    if (!isActive) return;

    const animate = () => {
      // Additional cursor-based effects can be added here
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive]);

  return (
    <div 
      ref={containerRef}
      className={`water-ripple-container relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        '--cursor-x': `${cursorPos.x}px`,
        '--cursor-y': `${cursorPos.y}px`,
        '--perturbance': perturbance,
        '--resolution': resolution,
        cursor: 'none'
      }}
    >
      {/* Water Background */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 water-background"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
      )}

      {/* Advanced Water Surface */}
      <div className={`absolute inset-0 water-surface ${isActive ? 'active' : ''}`} />

      {/* Cursor Indicator */}
      {isActive && (
        <div 
          className="absolute pointer-events-none cursor-indicator"
          style={{
            left: cursorPos.x - 10,
            top: cursorPos.y - 10,
          }}
        />
      )}

      {/* Floating Images */}
      {images.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {images.slice(0, 6).map((image, index) => (
            <div
              key={index}
              className="absolute opacity-10 transition-all duration-500 floating-image"
              style={{
                left: `${15 + (index * 12)}%`,
                top: `${20 + (index % 2 * 30)}%`,
                transform: `rotate(${-10 + (index * 4)}deg)`,
                animationDelay: `${index * 0.5}s`,
              }}
            >
              <img
                src={typeof image === 'string' ? image : image.src}
                alt={typeof image === 'string' ? `Floating image ${index + 1}` : image.alt}
                className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shadow-lg"
              />
            </div>
          ))}
        </div>
      )}

      {/* Advanced Water Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className={`absolute pointer-events-none water-ripple ${ripple.type}`}
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            '--intensity': ripple.intensity,
            '--duration': `${ripple.duration}ms`,
            animation: `advanced-ripple ${ripple.duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>

      {/* Advanced Water Ripple Styles */}
      <style jsx>{`
        .water-ripple-container {
          width: 100%;
          min-height: 400px;
          position: relative;
        }

        .water-background {
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          filter: brightness(0.85) contrast(1.15) saturate(1.1);
          transition: filter 0.3s ease;
        }

        .water-surface {
          background: 
            radial-gradient(
              circle at var(--cursor-x, 50%) var(--cursor-y, 50%),
              rgba(59, 130, 246, 0.15) 0%,
              rgba(147, 197, 253, 0.08) 30%,
              rgba(30, 58, 138, 0.05) 60%,
              transparent 100%
            ),
            linear-gradient(
              135deg,
              rgba(59, 130, 246, 0.03) 0%,
              rgba(147, 197, 253, 0.06) 25%,
              rgba(199, 210, 254, 0.04) 50%,
              rgba(147, 197, 253, 0.06) 75%,
              rgba(59, 130, 246, 0.03) 100%
            );
          background-size: 200% 200%, 400% 400%;
          animation: surface-flow 8s ease-in-out infinite;
          transition: all 0.3s ease;
        }

        .water-surface.active {
          background: 
            radial-gradient(
              circle at var(--cursor-x, 50%) var(--cursor-y, 50%),
              rgba(59, 130, 246, 0.25) 0%,
              rgba(147, 197, 253, 0.15) 30%,
              rgba(30, 58, 138, 0.08) 60%,
              transparent 100%
            ),
            linear-gradient(
              135deg,
              rgba(59, 130, 246, 0.05) 0%,
              rgba(147, 197, 253, 0.1) 25%,
              rgba(199, 210, 254, 0.07) 50%,
              rgba(147, 197, 253, 0.1) 75%,
              rgba(59, 130, 246, 0.05) 100%
            );
          animation-duration: 4s;
        }

        .cursor-indicator {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(59, 130, 246, 0.6);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.2) 0%,
            rgba(30, 58, 138, 0.1) 40%,
            transparent 70%
          );
          animation: cursor-pulse 1.5s ease-in-out infinite;
          z-index: 30;
        }

        .water-ripple {
          border-radius: 50%;
          transform: scale(0);
          opacity: 1;
          mix-blend-mode: overlay;
        }

        .water-ripple.normal {
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, calc(0.4 * var(--intensity))) 0%,
            rgba(147, 197, 253, calc(0.25 * var(--intensity))) 25%,
            rgba(199, 210, 254, calc(0.15 * var(--intensity))) 50%,
            rgba(147, 197, 253, calc(0.1 * var(--intensity))) 75%,
            transparent 100%
          );
        }

        .water-ripple.strong {
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, calc(0.6 * var(--intensity))) 0%,
            rgba(147, 197, 253, calc(0.4 * var(--intensity))) 20%,
            rgba(199, 210, 254, calc(0.25 * var(--intensity))) 40%,
            rgba(147, 197, 253, calc(0.15 * var(--intensity))) 60%,
            rgba(59, 130, 246, calc(0.08 * var(--intensity))) 80%,
            transparent 100%
          );
        }

        .floating-image {
          animation: advanced-float 12s ease-in-out infinite;
          filter: blur(0.5px) brightness(0.9);
        }

        .floating-image:hover {
          opacity: 0.3 !important;
          filter: blur(0px) brightness(1.1);
        }

        @keyframes advanced-ripple {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
            box-shadow: 
              0 0 0 0 rgba(59, 130, 246, calc(0.3 * var(--intensity)));
          }
          15% {
            transform: scale(0.3) rotate(5deg);
            opacity: 0.9;
            box-shadow: 
              0 0 0 10px rgba(147, 197, 253, calc(0.25 * var(--intensity)));
          }
          35% {
            transform: scale(1) rotate(10deg);
            opacity: 0.7;
            box-shadow: 
              0 0 0 25px rgba(199, 210, 254, calc(0.2 * var(--intensity)));
          }
          65% {
            transform: scale(2.5) rotate(15deg);
            opacity: 0.4;
            box-shadow: 
              0 0 0 40px rgba(147, 197, 253, calc(0.1 * var(--intensity)));
          }
          85% {
            transform: scale(4) rotate(20deg);
            opacity: 0.15;
            box-shadow: 
              0 0 0 55px rgba(59, 130, 246, calc(0.05 * var(--intensity)));
          }
          100% {
            transform: scale(6) rotate(25deg);
            opacity: 0;
            box-shadow: 
              0 0 0 70px transparent;
          }
        }

        @keyframes surface-flow {
          0%, 100% {
            background-position: 0% 0%, 0% 50%;
          }
          25% {
            background-position: 50% 25%, 25% 25%;
          }
          50% {
            background-position: 100% 50%, 100% 50%;
          }
          75% {
            background-position: 50% 75%, 75% 75%;
          }
        }

        @keyframes cursor-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.4;
          }
        }

        @keyframes advanced-float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(var(--rotation, 0deg));
          }
          25% {
            transform: translateY(-8px) translateX(4px) rotate(calc(var(--rotation, 0deg) + 2deg));
          }
          50% {
            transform: translateY(-4px) translateX(-2px) rotate(calc(var(--rotation, 0deg) - 1deg));
          }
          75% {
            transform: translateY(-12px) translateX(6px) rotate(calc(var(--rotation, 0deg) + 3deg));
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .water-ripple-container {
            min-height: 300px;
          }
          .cursor-indicator {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageRipple;