import React, { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';

const ImageCursorTrail = ({ 
  children, 
  items = [], 
  maxNumberOfImages = 5, 
  distance = 25, 
  imgClass = "w-32 h-40",
  className = "" 
}) => {
  const containerRef = useRef(null);
  const [trailImages, setTrailImages] = useState([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;
    let moveTimeout;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      
      if (!isMoving) {
        isMoving = true;
        addTrailImage(mouseX, mouseY);
      }

      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false;
      }, 100);
    };

    const addTrailImage = (x, y) => {
      if (items.length === 0) return;
      
      const randomImage = items[Math.floor(Math.random() * items.length)];
      const newImage = {
        id: Date.now() + Math.random(),
        src: randomImage,
        x: x - distance,
        y: y - distance,
        timestamp: Date.now()
      };

      setTrailImages(prev => {
        const newTrail = [newImage, ...prev.slice(0, maxNumberOfImages - 1)];
        return newTrail;
      });

      // Remove image after animation
      setTimeout(() => {
        setTrailImages(prev => prev.filter(img => img.id !== newImage.id));
      }, 1500);
    };

    const handleMouseLeave = () => {
      setTrailImages([]);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(moveTimeout);
    };
  }, [items, maxNumberOfImages, distance]);

  return (
    <div
      ref={containerRef}
      className={clsx("relative overflow-hidden cursor-none", className)}
      style={{ minHeight: '400px' }}
    >
      {children}
      
      {/* Animated trail images */}
      {trailImages.map((image, index) => (
        <div
          key={image.id}
          className="absolute pointer-events-none z-10 animate-cursor-trail"
          style={{
            left: image.x,
            top: image.y,
            transform: `rotate(${Math.random() * 20 - 10}deg)`,
            animationDelay: `${index * 0.1}s`,
            animationDuration: '1.5s'
          }}
        >
          <img
            src={image.src}
            alt=""
            className={clsx(
              "object-cover rounded-xl shadow-2xl border-2 border-white/20 animate-fade-scale",
              imgClass
            )}
            draggable={false}
            style={{
              animationDelay: `${index * 0.05}s`
            }}
          />
        </div>
      ))}
      
      <style>{`
        @keyframes cursor-trail {
          0% {
            opacity: 0;
            transform: scale(0.5) rotate(${Math.random() * 20 - 10}deg);
          }
          20% {
            opacity: 1;
            transform: scale(1) rotate(${Math.random() * 20 - 10}deg);
          }
          100% {
            opacity: 0;
            transform: scale(0.3) rotate(${Math.random() * 40 - 20}deg);
          }
        }
        
        @keyframes fade-scale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          100% {
            opacity: 0.8;
            transform: scale(1);
          }
        }
        
        .animate-cursor-trail {
          animation: cursor-trail 1.5s ease-out forwards;
        }
        
        .animate-fade-scale {
          animation: fade-scale 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ImageCursorTrail;