import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { scrollToTop } from '../utils/scrollEffects';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    const toggleVisibility = () => {
      // Show button earlier on mobile for better accessibility
      const threshold = isMobile ? 200 : 300;
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Throttle scroll events for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          toggleVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [isMobile]);

  const handleClick = async () => {
    try {
      // Faster scroll on mobile
      const duration = isMobile ? 400 : 800;
      await scrollToTop(duration);
    } catch (error) {
      // Fallback scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      className={`fixed z-40 bg-[#0052CC] hover:bg-[#002357] text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-110 ${
        isMobile 
          ? 'bottom-20 right-4 w-14 h-14' // Larger and better positioned for mobile
          : 'bottom-24 right-6 w-12 h-12'
      } ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      onClick={handleClick}
      aria-label="Back to top"
      style={{
        // Improve touch target for mobile
        touchAction: 'manipulation',
        userSelect: 'none'
      }}
    >
      <ChevronUp className={isMobile ? "h-7 w-7" : "h-6 w-6"} />
    </button>
  );
};

export default BackToTop;
