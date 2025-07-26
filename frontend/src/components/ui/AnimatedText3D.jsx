// filepath: /home/sambit/Documents/portfolio-main/frontend/src/components/ui/AnimatedText3D.jsx
import React from 'react';

const AnimatedText3D = ({ 
  words = ['CREATIVE', 'DEVELOPER', 'DESIGNER', 'INNOVATOR', 'BUILDER', 'ARTIST', 'CODER', 'DREAMER'],
  fontSize = '3.5rem',
  primaryColor = '#5c5fc4',
  secondColor = '#c4c15c',
  className = ''
}) => {
  return (
    <div className={`animated-text-3d-container ${className}`}>
      <div className="animated-text-3d-box">
        {words.map((word, index) => (
          <span 
            key={index}
            className="animated-text-3d-span"
            style={{ 
              '--i': index,
              fontSize: fontSize,
              '--primary-color': primaryColor,
              '--second-color': secondColor
            }}
          >
            {word.split('').map((char, charIndex) => (
              <i key={charIndex} className={charIndex % 2 === 0 ? 'primary-char' : 'second-char'}>
                {char}
              </i>
            ))}
          </span>
        ))}
      </div>

      <style jsx>{`
        .animated-text-3d-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
          perspective: 1000px;
        }

        .animated-text-3d-box {
          transform-style: preserve-3d;
          animation: animate3D 8s ease-in-out infinite alternate;
          position: relative;
        }

        .animated-text-3d-span {
          background: linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5) 90%, transparent);
          text-transform: uppercase;
          line-height: 0.76em;
          position: absolute;
          color: white;
          white-space: nowrap;
          font-weight: 900;
          padding: 0px 10px;
          transform-style: preserve-3d;
          text-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
          transform: translate(-50%, -50%) rotateX(calc(var(--i) * 22.5deg)) translateZ(120px);
          font-family: 'Poppins', sans-serif;
          letter-spacing: 2px;
        }

        .primary-char {
          font-style: normal;
          color: var(--primary-color);
          text-shadow: 0 0 20px var(--primary-color), 0 0 40px var(--primary-color);
        }

        .second-char {
          font-style: normal;
          color: var(--second-color);
          text-shadow: 0 0 20px var(--second-color), 0 0 40px var(--second-color);
        }

        @keyframes animate3D {
          0% {
            transform: perspective(500px) rotateX(0deg) rotateY(5deg);
          }
          50% {
            transform: perspective(500px) rotateX(180deg) rotateY(5deg);
          }
          100% {
            transform: perspective(500px) rotateX(360deg) rotateY(5deg);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .animated-text-3d-container {
            height: 200px;
          }
          
          .animated-text-3d-span {
            font-size: 2rem !important;
            transform: translate(-50%, -50%) rotateX(calc(var(--i) * 22.5deg)) translateZ(80px);
          }
        }

        @media (max-width: 480px) {
          .animated-text-3d-container {
            height: 150px;
          }
          
          .animated-text-3d-span {
            font-size: 1.5rem !important;
            transform: translate(-50%, -50%) rotateX(calc(var(--i) * 22.5deg)) translateZ(60px);
            letter-spacing: 1px;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedText3D;