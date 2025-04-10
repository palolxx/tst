/**
 * Admin Panel JavaScript
 * Handles admin functionality for the dashboard and content management
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  checkAdminAuth();

  // Initialize admin UI components
  initializeMobileMenu();
  initializeLogout();
  initializeTableActions();

  // Initialize specific page functionality based on current page
  const currentPage = getCurrentPage();

  if (currentPage === 'dashboard') {
    // Dashboard specific functionality
    initializeDashboard();
  } else if (currentPage === 'products') {
    // Products page specific functionality
    initializeProducts();
  } else if (currentPage === 'categories') {
    // Categories page specific functionality
    initializeCategories();
  } else if (currentPage === 'features') {
    // Features page specific functionality
    initializeFeatures();
  } else if (currentPage === 'slider') {
    // Slider page specific functionality
    initializeSlider();
  } else if (currentPage === 'messages') {
    // Messages page specific functionality
    initializeMessages();
  } else if (currentPage === 'settings') {
    // Settings page specific functionality
    initializeSettings();
  } else if (currentPage === 'articles') {
    // Articles page specific functionality
    initializeArticles();
  }
});

/**
 * Check if admin is authenticated, redirect to login if not
 * Uses secure token-based validation with expiry time
 */
function checkAdminAuth() {
  // Check for auth token in sessionStorage (more secure than localStorage for auth)
  const authToken = sessionStorage.getItem('auth_token');
  const tokenExpiry = sessionStorage.getItem('token_expiry');
  const loginTime = sessionStorage.getItem('login_time');

  // Validation checks
  const isAuthenticated = !!authToken; // Token exists
  const isTokenValid = tokenExpiry && parseInt(tokenExpiry) > Date.now(); // Token not expired
  const isSessionValid = loginTime && (Date.now() - parseInt(loginTime)) < (8 * 60 * 60 * 1000); // Session less than 8 hours

  if (!isAuthenticated || !isTokenValid || !isSessionValid) {
    // Clear any invalid session data for security
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('token_expiry');
    sessionStorage.removeItem('login_time');

    // Also clear any old localStorage auth (from previous versions)
    localStorage.removeItem('admin_logged_in');

    // Redirect to login page
    window.location.href = 'login.html';
    return;
  }

  // Renew token expiry time if more than halfway through session
  const halfwayPoint = parseInt(loginTime) + (4 * 60 * 60 * 1000); // 4 hours
  if (Date.now() > halfwayPoint) {
    // Refresh token expiry (sliding expiration)
    const newExpiryTime = Date.now() + (30 * 60 * 1000); // 30 minutes
    sessionStorage.setItem('token_expiry', newExpiryTime.toString());
  }

  // Add a session activity tracker to auto-logout after inactivity
  setupActivityTracking();
}

/**
 * Set up activity tracking to auto-logout after inactivity
 * This prevents security risks from unattended sessions
 */
function setupActivityTracking() {
  // Reset the inactivity timer on user interaction
  const resetInactivityTimer = function() {
    sessionStorage.setItem('last_activity', Date.now().toString());
  };

  // Set initial activity timestamp
  resetInactivityTimer();

  // Add event listeners to track user activity
  ['mousedown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(eventType => {
    document.addEventListener(eventType, resetInactivityTimer, true);
  });

  // Check inactivity every minute
  setInterval(function() {
    const lastActivity = parseInt(sessionStorage.getItem('last_activity') || '0');
    const inactiveTime = Date.now() - lastActivity;

    // Auto-logout after 30 minutes of inactivity
    if (inactiveTime > (30 * 60 * 1000)) { // 30 minutes
      // Clear session data
      sessionStorage.clear();
      // Redirect to login with message
      window.location.href = 'login.html?reason=inactivity';
    }
  }, 60 * 1000); // Check every minute
}

/**
 * Initialize mobile menu functionality
 */
function initializeMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const adminSidebar = document.querySelector('.admin-sidebar');

  if (mobileMenuToggle && adminSidebar) {
    mobileMenuToggle.addEventListener('click', function() {
      adminSidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
      const isMobile = window.innerWidth <= 768;
      if (isMobile && !adminSidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
        adminSidebar.classList.remove('open');
      }
    });
  }
}

/**
 * Initialize logout functionality with secure token invalidation
 */
function initializeLogout() {
  const logoutBtn = document.getElementById('logout-btn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      // Show confirmation dialog
      if (confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
        // Clear all auth data
        sessionStorage.clear();
        localStorage.removeItem('admin_logged_in');

        // In a production environment, this would make an API call to invalidate the token server-side

        // Redirect to login page
        window.location.href = 'login.html?reason=logout';
      }
    });
  }
}

/**
 * Initialize table action buttons (view, edit, delete)
 */
function initializeTableActions() {
  // View buttons
  const viewButtons = document.querySelectorAll('.admin-btn-view');
  for (const button of viewButtons) {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      const id = row.dataset.id || '1'; // Use data-id attribute if available, otherwise default to 1
      const itemType = getCurrentTableType();

      // Redirect to view page or show in modal
      if (itemType) {
        alert(`مشاهده ${itemType} با شناسه ${id}`);
        // In a real implementation, this would open a view page or modal
        // window.location.href = `${itemType}-view.html?id=${id}`;
      }
    });
  }

  // Edit buttons
  const editButtons = document.querySelectorAll('.admin-btn-edit');
  for (const button of editButtons) {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      const id = row.dataset.id || '1';
      const itemType = getCurrentTableType();

      // Redirect to edit page
      if (itemType) {
        alert(`ویرایش ${itemType} با شناسه ${id}`);
        // In a real implementation, this would redirect to an edit page
        // window.location.href = `${itemType}-edit.html?id=${id}`;
      }
    });
  }

  // Delete buttons
  const deleteButtons = document.querySelectorAll('.admin-btn-delete');
  for (const button of deleteButtons) {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      const id = row.dataset.id || '1';
      const itemType = getCurrentTableType();

      // Show confirmation dialog
      if (itemType && confirm(`آیا از حذف این ${itemType} اطمینان دارید؟ این عمل قابل بازگشت نیست.`)) {
        // In a real implementation, this would make an API call to delete the item
        // deleteItem(itemType, id).then(() => { row.remove(); });

        // For demo, just remove the row
        row.remove();
        alert(`${itemType} با موفقیت حذف شد`);
      }
    });
  }
}

/**
 * Get the current page name from URL
 * @returns {string} The current page name
 */
function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop();

  if (filename === 'dashboard.html') {
    return 'dashboard';
  } else if (filename === 'products.html') {
    return 'products';
  } else if (filename === 'categories.html') {
    return 'categories';
  } else if (filename === 'features.html') {
    return 'features';
  } else if (filename === 'slider.html') {
    return 'slider';
  } else if (filename === 'messages.html') {
    return 'messages';
  } else if (filename === 'settings.html') {
    return 'settings';
  } else if (filename === 'articles.html') {
    return 'articles';
  }

  return '';
}

/**
 * Get the current table type based on the section or page
 * @returns {string} The item type (product, category, etc.)
 */
function getCurrentTableType() {
  const currentPage = getCurrentPage();

  // If we're on a specific page, use that type
  if (currentPage && currentPage !== 'dashboard') {
    // Remove 's' from the end for singular form
    return currentPage.endsWith('s')
      ? currentPage.substring(0, currentPage.length - 1)
      : currentPage;
  }

  // Otherwise, try to determine from table context
  const recentProductsSection = document.querySelector('.admin-section-title');
  if (recentProductsSection) {
    const sectionTitle = recentProductsSection.textContent.trim().toLowerCase();

    if (sectionTitle.includes('محصولات')) {
      return 'محصول';
    } else if (sectionTitle.includes('دسته')) {
      return 'دسته‌بندی';
    } else if (sectionTitle.includes('پیام')) {
      return 'پیام';
    } else if (sectionTitle.includes('مقالات')) {
      return 'مقاله';
    } else if (sectionTitle.includes('اسلایدر')) {
      return 'اسلاید';
    } else if (sectionTitle.includes('ویژگی')) {
      return 'ویژگی';
    }
  }

  return '';
}

/**
 * Initialize dashboard functionality
 */
function initializeDashboard() {
  // In a real implementation, this would fetch dashboard data from API
  console.log('Dashboard initialized');

  // Example of real-time updates for dashboard stats
  setInterval(function() {
    // This would normally fetch updated data from an API
    // In this demo, we'll just simulate random fluctuations

    const statValues = document.querySelectorAll('.admin-stat-value');
    for (const statValue of statValues) {
      // Get current value
      let value = parseInt(statValue.textContent.replace(/,/g, ''), 10);

      // Add random fluctuation (-2 to +5)
      const fluctuation = Math.floor(Math.random() * 8) - 2;
      value += fluctuation;

      // Ensure value doesn't go below 0
      value = Math.max(0, value);

      // Update display with thousands separator
      statValue.textContent = value.toLocaleString('fa-IR');
    }
  }, 60000); // Update every minute
}

/**
 * Initialize products page functionality
 */
function initializeProducts() {
  console.log('Products page initialized');
  // Product-specific functionality would go here
}

/**
 * Initialize categories page functionality
 */
function initializeCategories() {
  console.log('Categories page initialized');
  // Category-specific functionality would go here
}

/**
 * Initialize features page functionality
 */
function initializeFeatures() {
  console.log('Features page initialized');
  // Features-specific functionality would go here
}

/**
 * Initialize slider page functionality
 */
function initializeSlider() {
  console.log('Slider page initialized');
  // Slider-specific functionality would go here
}

/**
 * Initialize messages page functionality
 */
function initializeMessages() {
  console.log('Messages page initialized');
  // Messages-specific functionality would go here
}

/**
 * Initialize settings page functionality
 */
function initializeSettings() {
  console.log('Settings page initialized');
  // Settings-specific functionality would go here
}

/**
 * Initialize articles page functionality
 */
function initializeArticles() {
  console.log('Articles page initialized');
  // Articles-specific functionality would go here
}

/**
 * Utility function to safely parse JSON
 * @param {string} jsonString - The JSON string to parse
 * @returns {object|null} Parsed object or null on error
 */
function safeParseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return null;
  }
}
