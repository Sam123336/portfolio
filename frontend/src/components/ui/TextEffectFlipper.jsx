import React, { useState } from 'react';
import clsx from 'clsx';

const FlipLink = ({ 
  children, 
  href = "#", 
  className = "", 
  target = "_blank",
  rel = "noopener noreferrer"
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const letters = children.split('');

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={clsx(
        "relative inline-block overflow-hidden font-semibold transition-colors duration-300",
        "text-gray-300 dark:text-white hover:text-blue-400 dark:hover:text-blue-400",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative inline-block">
        {letters.map((letter, index) => (
          <span
            key={index}
            className={clsx(
              "inline-block transition-transform duration-300 ease-out",
              isHovered ? "animate-flip-out" : ""
            )}
            style={{
              transitionDelay: `${index * 50}ms`,
              animationDelay: `${index * 50}ms`
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </span>
      
      <span className="absolute inset-0 inline-block">
        {letters.map((letter, index) => (
          <span
            key={`flip-${index}`}
            className={clsx(
              "inline-block transition-transform duration-300 ease-out",
              isHovered ? "animate-flip-in" : "animate-flip-hidden"
            )}
            style={{
              transitionDelay: `${index * 50}ms`,
              animationDelay: `${index * 50}ms`
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </span>
      
      <style>{`
        @keyframes flip-out {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
        
        @keyframes flip-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes flip-hidden {
          0%, 100% {
            opacity: 0;
            transform: translateY(20px);
          }
        }
        
        .animate-flip-out {
          animation: flip-out 0.3s ease-out forwards;
        }
        
        .animate-flip-in {
          animation: flip-in 0.3s ease-out forwards;
        }
        
        .animate-flip-hidden {
          animation: flip-hidden 0.3s ease-out forwards;
        }
      `}</style>
    </a>
  );
};

const TextEffectFlipper = ({ 
  text, 
  href = "#", 
  className = "",
  ...props 
}) => {
  return (
    <FlipLink href={href} className={className} {...props}>
      {text}
    </FlipLink>
  );
};

export { FlipLink };
export default TextEffectFlipper;