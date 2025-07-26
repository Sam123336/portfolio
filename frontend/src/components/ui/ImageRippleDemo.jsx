import React from 'react';
import ImageRipple from './image-ripple';

export function ImageRippleDemo({ images = [], className = "", children, ...props }) {
  return (
    <ImageRipple 
      images={images}
      className={`min-h-[400px] ${className}`}
      rippleColor="rgba(96, 165, 250, 0.7)"
      rippleSize={120}
      rippleDuration={1200}
      maxRipples={8}
      {...props}
    >
      {children}
    </ImageRipple>
  );
}