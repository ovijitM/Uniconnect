
import { useEffect, useState } from 'react';

// Custom hook for delayed animations
export const useDelayedAnimation = (delay: number = 0) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return shouldAnimate;
};

// Custom hook for lazy loading images with blur effect
export const useLazyImage = (src: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');

  useEffect(() => {
    setIsLoaded(false);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return { isLoaded, currentSrc };
};

// Function to create staggered animation delays for lists
export const createStaggeredDelay = (
  index: number, 
  baseDelay: number = 100, 
  staggerAmount: number = 50
): number => {
  return baseDelay + (index * staggerAmount);
};
