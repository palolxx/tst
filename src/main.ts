document.addEventListener('DOMContentLoaded', () => {
  // Main application initialization
  console.log('Abzarbeton website initialized');

  // This will be used for client-side functionality
  initAnimations();
  initNavigation();

  // The #app element shouldn't be needed in our implementation
  // as we'll have a full HTML structure
});

// Initialize animations
function initAnimations() {
  // Add animation classes to elements when they come into view
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.1 });

    // Use Array.from to convert NodeList to Array for TypeScript compatibility
    for (const element of Array.from(animatedElements)) {
      observer.observe(element);
    }
  }

  // Apply hover animations
  const hoverElements = document.querySelectorAll('.hover-animate');
  // Use Array.from to convert NodeList to Array for TypeScript compatibility
  for (const element of Array.from(hoverElements)) {
    element.addEventListener('mouseenter', () => {
      element.classList.add('hovered');
    });

    element.addEventListener('mouseleave', () => {
      element.classList.remove('hovered');
    });
  }
}

// Initialize navigation functionality
function initNavigation() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      mobileMenuToggle.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (event) => {
    if (mobileMenu && mobileMenuToggle) {
      const target = event.target as Node;
      if (!mobileMenu.contains(target) && !mobileMenuToggle.contains(target)) {
        mobileMenu.classList.remove('open');
        mobileMenuToggle.classList.remove('active');
      }
    }
  });
}
