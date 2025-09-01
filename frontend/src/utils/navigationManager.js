// Enhanced navigation utility for footer links with mobile optimization
export class NavigationManager {
  constructor() {
    this.isNavigating = false;
    this.isMobile = this.detectMobile();
  }

  // Detect mobile devices
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
           || window.innerWidth <= 768;
  }

  // Handle footer navigation without conflicts - mobile optimized
  handleFooterLink(path, linkName, element = null) {
    if (this.isNavigating) {
      return; // Prevent multiple rapid clicks
    }

    this.isNavigating = true;

    // Add visual feedback with mobile-specific styling
    if (element) {
      element.classList.add('nav-loading');
      // Add touch feedback for mobile
      if (this.isMobile) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
          element.style.transform = '';
        }, 150);
      }
    }

    if (linkName === 'Contact') {
      // Contact link - special handling
      this.navigateToContact();
    } else {
      // Regular navigation
      this.navigateToPage(path);
    }

    // Reset navigation flag and remove loading state - faster on mobile
    const resetTime = this.isMobile ? 800 : 1000;
    setTimeout(() => {
      this.isNavigating = false;
      if (element) {
        element.classList.remove('nav-loading');
      }
    }, 1000);
  }

  navigateToContact() {
    if (window.location.pathname === '/') {
      // Already on home page, just scroll to contact
      import('./scrollEffects').then(({ scrollToElement }) => {
        scrollToElement('inquiry-form', { offset: 100, duration: 800 });
      }).catch(() => {
        // Fallback scroll
        const element = document.getElementById('inquiry-form');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    } else {
      // Navigate to home with hash
      window.location.href = '/#inquiry-form';
    }
  }

  navigateToPage(path) {
    if (path === window.location.pathname) {
      // Same page, smooth scroll to top with shorter duration
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Different page, direct navigation
      setTimeout(() => {
        window.location.href = path;
      }, 150); // Small delay for visual feedback
    }
  }
}

// Create and export singleton instance
export const navigationManager = new NavigationManager();
