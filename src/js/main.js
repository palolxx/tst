/**
 * Abzarbeton Website JavaScript
 * Main functionality for the frontend
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initializeAnimations();
  initializeMobileMenu();
  initializeSearch();
  initializeProductHover();
  initializeContactForm();
  initializeLazyLoading(); // Add lazy loading initialization
});

/**
 * Initialize animations for elements
 */
function initializeAnimations() {
  // Animate elements when they come into view
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0) {
    // Create an observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          // Add appropriate animation class based on data attribute or default
          const element = entry.target;

          // Get animation type from data attribute or use default
          if (element.classList.contains('animate-slideInRight')) {
            element.style.animation = 'slideInRight 1s ease forwards';
          } else if (element.classList.contains('animate-slideInLeft')) {
            element.style.animation = 'slideInLeft 1s ease forwards';
          } else if (element.classList.contains('animate-pulse')) {
            element.style.animation = 'pulse 2s infinite';
          } else {
            element.style.animation = 'fadeIn 1s ease forwards';
          }

          // Stop observing after animation is applied
          observer.unobserve(element);
        }
      }
    }, { threshold: 0.1 });

    // Start observing all animated elements
    for (const element of animatedElements) {
      observer.observe(element);
    }
  }

  // Add hover animations
  const hoverElements = document.querySelectorAll('.hover-grow, .hover-shadow, .hover-rotate');

  for (const element of hoverElements) {
    element.addEventListener('mouseenter', () => {
      element.style.transform = element.classList.contains('hover-grow')
        ? 'scale(1.05)'
        : element.classList.contains('hover-rotate')
          ? 'rotate(5deg)'
          : '';

      if (element.classList.contains('hover-shadow')) {
        element.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
      }
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
      if (element.classList.contains('hover-shadow')) {
        element.style.boxShadow = '';
      }
    });
  }
}

/**
 * Initialize mobile menu toggle functionality
 */
function initializeMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuToggle && mobileMenu) {
    // Toggle mobile menu on button click
    mobileMenuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      mobileMenu.classList.toggle('open');
      mobileMenuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (mobileMenu.classList.contains('open') &&
          !mobileMenu.contains(target) &&
          !mobileMenuToggle.contains(target)) {
        mobileMenu.classList.remove('open');
        mobileMenuToggle.classList.remove('active');
      }
    });

    // Add click event to parent menu items with submenu
    const menuItemsWithSubmenu = document.querySelectorAll('.main-menu-item.has-submenu');
    for (const menuItem of menuItemsWithSubmenu) {
      const submenuToggle = menuItem.querySelector('.submenu-toggle');
      if (submenuToggle) {
        submenuToggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          menuItem.classList.toggle('submenu-open');
        });
      }
    }
  }
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
  const searchBox = document.querySelector('.search-box');
  const searchInput = searchBox ? searchBox.querySelector('input') : null;
  const searchButton = searchBox ? searchBox.querySelector('button') : null;

  if (searchBox && searchInput && searchButton) {
    // Focus search input when clicking on search box
    searchBox.addEventListener('click', () => {
      searchInput.focus();
    });

    // Handle search form submission
    searchButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchInput.value.trim() !== '') {
        // In a real implementation, this would redirect to search results page
        // window.location.href = `/search?q=${encodeURIComponent(searchInput.value.trim())}`;

        // For now, just log the search term
        console.log('Search term:', searchInput.value.trim());
        alert('جستجو برای: ' + searchInput.value.trim());
      }
    });

    // Submit search on Enter key
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchButton.click();
      }
    });
  }
}

/**
 * Initialize product hover effects
 */
function initializeProductHover() {
  const productCards = document.querySelectorAll('.product-card');

  for (const card of productCards) {
    card.addEventListener('mouseenter', () => {
      // Apply hover effect
      card.classList.add('hover');
    });

    card.addEventListener('mouseleave', () => {
      // Remove hover effect
      card.classList.remove('hover');
    });
  }
}

/**
 * Initialize contact form validation and submission
 */
function initializeContactForm() {
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form inputs
      const nameInput = contactForm.querySelector('input[name="name"]');
      const emailInput = contactForm.querySelector('input[name="email"]');
      const messageInput = contactForm.querySelector('textarea[name="message"]');

      // Simple validation
      let isValid = true;

      if (nameInput && !nameInput.value.trim()) {
        showError(nameInput, 'لطفا نام خود را وارد کنید');
        isValid = false;
      } else if (nameInput) {
        hideError(nameInput);
      }

      if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
          showError(emailInput, 'لطفا ایمیل خود را وارد کنید');
          isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
          showError(emailInput, 'لطفا یک ایمیل معتبر وارد کنید');
          isValid = false;
        } else {
          hideError(emailInput);
        }
      }

      if (messageInput && !messageInput.value.trim()) {
        showError(messageInput, 'لطفا پیام خود را وارد کنید');
        isValid = false;
      } else if (messageInput) {
        hideError(messageInput);
      }

      // If form is valid, simulate submission
      if (isValid) {
        // In a real implementation, this would submit the form data
        // For now, just show a success message
        alert('پیام شما با موفقیت ارسال شد');
        contactForm.reset();
      }
    });
  }
}

/**
 * Helper function to show error message for form inputs
 */
function showError(inputElement, message) {
  // Remove any existing error
  hideError(inputElement);

  // Create error message element
  const errorElement = document.createElement('div');
  errorElement.className = 'form-error';
  errorElement.textContent = message;

  // Insert error message after input
  inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);

  // Add error class to input
  inputElement.classList.add('input-error');
}

/**
 * Helper function to hide error message for form inputs
 */
function hideError(inputElement) {
  // Remove error class from input
  inputElement.classList.remove('input-error');

  // Find and remove error message if it exists
  const errorElement = inputElement.parentNode.querySelector('.form-error');
  if (errorElement) {
    errorElement.parentNode.removeChild(errorElement);
  }
}

/**
 * Utility function to safely parse JSON
 * Used for API responses and localStorage data
 */
function safeParseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return null;
  }
}

/**
 * Initialize lazy loading for images
 * This improves page performance by loading images only when they come into view
 */
function initializeLazyLoading() {
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img.lazy');

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          if (lazyImage.dataset.src) {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.add('loaded');
            imageObserver.unobserve(lazyImage);
          }
        }
      });
    });

    lazyImages.forEach((image) => {
      imageObserver.observe(image);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    const lazyImages = document.querySelectorAll('img.lazy');

    // Load all images immediately
    lazyImages.forEach((image) => {
      if (image.dataset.src) {
        image.src = image.dataset.src;
        image.classList.add('loaded');
      }
    });
  }
}
