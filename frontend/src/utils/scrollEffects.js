// Enhanced scroll effects utility with mobile optimization
export class SmoothScrollManager {
  constructor() {
    this.isScrolling = false;
    this.lastScrollTime = 0;
    this.observers = new Map();
    this.isMobile = this.detectMobile();
    this.isTouch = 'ontouchstart' in window;
    this.initGlobalScrollBehavior();
  }

  // Detect mobile devices
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
           || window.innerWidth <= 768;
  }

  // Initialize global smooth scroll behavior with mobile optimizations
  initGlobalScrollBehavior() {
    // Ensure CSS smooth scrolling is enabled
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Enhanced momentum scrolling for iOS and mobile
    document.body.style.webkitOverflowScrolling = 'touch';
    document.body.style.overscrollBehavior = 'contain';
    
    // Prevent rubber band scrolling on iOS
    if (this.isMobile) {
      document.body.style.position = 'relative';
      document.body.style.overflowX = 'hidden';
    }
    
    // Add touch-action for better touch handling
    document.documentElement.style.touchAction = 'pan-y';
  }

  // Enhanced smooth scroll to element with mobile optimization
  scrollToElement(elementId, options = {}) {
    const now = Date.now();
    
    // Adjust debounce for mobile devices (longer for touch)
    const debounceTime = this.isMobile ? 150 : 100;
    if (now - this.lastScrollTime < debounceTime) {
      return Promise.resolve();
    }
    
    this.lastScrollTime = now;

    const defaultOptions = {
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
      offset: this.isMobile ? 60 : 80, // Smaller offset for mobile
      duration: this.isMobile ? 600 : 800, // Faster on mobile
      easing: 'ease-in-out'
    };

    const config = { ...defaultOptions, ...options };
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.warn(`Element with ID "${elementId}" not found`);
      return Promise.reject(new Error(`Element not found: ${elementId}`));
    }

    return this.performEnhancedScroll(element, config);
  }

  // Custom smooth scroll implementation with better control
  performEnhancedScroll(element, config) {
    return new Promise((resolve) => {
      if (this.isScrolling) return resolve();
      
      this.isScrolling = true;
      
      const elementRect = element.getBoundingClientRect();
      const currentScrollY = window.pageYOffset;
      const targetScrollY = currentScrollY + elementRect.top - config.offset;
      
      // Use native scrollIntoView for better browser compatibility
      if ('scrollBehavior' in document.documentElement.style) {
        element.scrollIntoView({
          behavior: config.behavior,
          block: config.block,
          inline: config.inline
        });
        
        // Wait for scroll to complete
        setTimeout(() => {
          this.isScrolling = false;
          resolve();
        }, config.duration);
      } else {
        // Fallback for browsers without smooth scroll support
        this.animateScroll(targetScrollY, config.duration, resolve);
      }
    });
  }

  // Fallback animation for browsers without native smooth scroll
  animateScroll(targetY, duration, callback) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const startTime = performance.now();

    const animateStep = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-in-out)
      const easeInOut = progress < 0.5 
        ? 2 * progress * progress 
        : -1 + (4 - 2 * progress) * progress;
      
      window.scrollTo(0, startY + distance * easeInOut);
      
      if (progress < 1) {
        requestAnimationFrame(animateStep);
      } else {
        this.isScrolling = false;
        callback && callback();
      }
    };

    requestAnimationFrame(animateStep);
  }

  // Scroll to top with smooth animation and mobile optimization
  scrollToTop(duration = 600) {
    const now = Date.now();
    
    // Adjust debounce for mobile
    const debounceTime = this.isMobile ? 150 : 100;
    if (now - this.lastScrollTime < debounceTime) {
      return Promise.resolve();
    }
    
    this.lastScrollTime = now;

    // Faster scrolling on mobile for better UX
    const adjustedDuration = this.isMobile ? Math.min(duration, 400) : duration;

    return new Promise((resolve) => {
      const startY = window.pageYOffset;
      
      if (startY === 0) {
        resolve();
        return;
      }

      if (this.isScrolling) {
        resolve();
        return;
      }

      this.animateScroll(0, adjustedDuration, resolve);
    });
  }

  // Handle navigation with scroll
  navigateWithScroll(path, elementId = null, delay = 100) {
    // Prevent navigation conflicts
    if (this.isScrolling) {
      // If already scrolling, wait for it to finish
      setTimeout(() => this.navigateWithScroll(path, elementId, delay), 200);
      return;
    }

    if (window.location.pathname === path) {
      // Same page, just scroll
      if (elementId) {
        setTimeout(() => {
          this.scrollToElement(elementId);
        }, delay);
      }
    } else {
      // Different page, navigate then scroll
      if (elementId) {
        // Use hash navigation for better user experience
        window.location.href = `${path}#${elementId}`;
      } else {
        window.location.href = path;
      }
    }
  }

  // Enhanced hash navigation handling
  handleHashNavigation() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      // Small delay to ensure page is loaded
      setTimeout(() => {
        this.scrollToElement(hash, { offset: 100 });
      }, 150);
    }
  }

  // Intersection Observer for scroll-triggered animations with mobile optimization
  observeElements(selector, callback, options = {}) {
    const defaultOptions = {
      threshold: this.isMobile ? 0.05 : 0.1, // Lower threshold for mobile
      rootMargin: this.isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px' // Smaller margin for mobile
    };

    const config = { ...defaultOptions, ...options };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target, entry);
        }
      });
    }, config);

    const elements = document.querySelectorAll(selector);
    elements.forEach(el => observer.observe(el));
    
    this.observers.set(selector, observer);
    return observer;
  }

  // Parallax scroll effect
  initParallaxElements(selector = '[data-parallax]') {
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) return;

    const handleScroll = () => {
      const scrollY = window.pageYOffset;
      
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const speed = element.dataset.parallax || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    };

    // Throttle scroll events for performance
    let ticking = false;
    const optimizedScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScroll, { passive: true });
  }

  // Cleanup observers
  disconnect(selector = null) {
    if (selector && this.observers.has(selector)) {
      this.observers.get(selector).disconnect();
      this.observers.delete(selector);
    } else {
      // Disconnect all observers
      this.observers.forEach(observer => observer.disconnect());
      this.observers.clear();
    }
  }
}

// Create global instance
export const scrollManager = new SmoothScrollManager();

// Utility functions for common scroll operations
export const scrollToElement = (elementId, options) => {
  return scrollManager.scrollToElement(elementId, options);
};

export const scrollToTop = (duration) => {
  return scrollManager.scrollToTop(duration);
};

export const navigateWithScroll = (path, elementId, delay) => {
  return scrollManager.navigateWithScroll(path, elementId, delay);
};

// Initialize scroll effects when DOM is ready
export const initScrollEffects = () => {
  // Handle hash navigation on page load
  scrollManager.handleHashNavigation();
  
  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    scrollManager.handleHashNavigation();
  });

  // Add fade-in animations for elements
  scrollManager.observeElements('.fade-in-on-scroll', (element) => {
    element.classList.add('animate-fade-in');
  });

  // Add slide-up animations
  scrollManager.observeElements('.slide-up-on-scroll', (element) => {
    element.classList.add('animate-slide-up');
  });

  // Initialize parallax if elements exist
  scrollManager.initParallaxElements();
};

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollEffects);
  } else {
    initScrollEffects();
  }
}
