/**
 * Admin Login JavaScript
 * Handles admin login authentication and security
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize admin login functionality
  initializeAdminLogin();
  initializePasswordToggle();
});

/**
 * Initialize admin login functionality
 */
function initializeAdminLogin() {
  const loginForm = document.getElementById('admin-login-form');
  const loginError = document.getElementById('login-error');

  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form inputs
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      const rememberMe = document.getElementById('remember-me');

      // Validate inputs
      let isValid = true;

      // Username validation
      if (!usernameInput.value.trim()) {
        showValidationError(usernameInput, 'نام کاربری را وارد کنید');
        isValid = false;
      } else {
        clearValidationError(usernameInput);
      }

      // Password validation
      if (!passwordInput.value) {
        showValidationError(passwordInput, 'رمز عبور را وارد کنید');
        isValid = false;
      } else if (passwordInput.value.length < 8) {
        showValidationError(passwordInput, 'رمز عبور باید حداقل ۸ کاراکتر باشد');
        isValid = false;
      } else {
        clearValidationError(passwordInput);
      }

      // If valid attempt login
      if (isValid) {
        // Clear any previous errors
        hideLoginError();

        // Show loading state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = 'درحال ورود...';

        // In a production environment, this would be a secure API call using HTTPS
        // This is a simulated server-side authentication
        const formData = new FormData();
        formData.append('username', usernameInput.value.trim());
        formData.append('password', passwordInput.value);
        formData.append('remember', rememberMe.checked ? '1' : '0');

        // Generate a CSRF token (in production this would come from the server)
        const csrfToken = generateSecureToken();
        formData.append('csrf_token', csrfToken);

        // Simulating a fetch request with proper security headers
        setTimeout(function() {
          // This is a simulation of a server response
          // In production, this would be an actual fetch request to a secure API endpoint

          // Simulate server authentication (in production, this would be server-side)
          // For demonstration purposes only - never do authentication this way in production
          const simulateServerAuth = () => {
            // Access users from db/users.json (in production, this would be secure server-side code)
            // Here we're simulating reading from the server
            return { success: true, token: generateSecureToken() };
          };

          const response = simulateServerAuth();

          if (response.success) {
            // In production, we would receive and store a secure HttpOnly cookie from the server
            // For this demo, we're using sessionStorage (less secure, but better than localStorage for auth)
            sessionStorage.setItem('auth_token', response.token);
            sessionStorage.setItem('login_time', Date.now());

            // Set a short expiry time (30 minutes)
            const expiryTime = Date.now() + (30 * 60 * 1000);
            sessionStorage.setItem('token_expiry', expiryTime);

            // Redirect to dashboard
            window.location.href = 'dashboard.html';
          } else {
            // Failed login
            submitButton.disabled = false;
            submitButton.innerHTML = 'ورود';

            // Show error message
            showLoginError('نام کاربری یا رمز عبور اشتباه است');

            // For security, don't specify which field is wrong
            // Clear password field
            passwordInput.value = '';

            // Apply rate limiting for failed attempts (in production this would be server-side)
            applyRateLimiting();
          }
        }, 1000); // Simulate network delay
      }
    });
  }
}

/**
 * Apply rate limiting for failed login attempts
 * In production, this would be implemented server-side
 */
function applyRateLimiting() {
  // Get failed attempts count from sessionStorage
  let failedAttempts = parseInt(sessionStorage.getItem('failed_login_attempts') || '0');
  failedAttempts++;

  // Store updated count
  sessionStorage.setItem('failed_login_attempts', failedAttempts.toString());

  // If too many failed attempts, implement exponential backoff
  if (failedAttempts >= 3) {
    const backoffTime = Math.min(Math.pow(2, failedAttempts - 3) * 1000, 30000); // Max 30 seconds

    const loginForm = document.getElementById('admin-login-form');
    const submitButton = loginForm.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    showLoginError(`تعداد تلاش های ناموفق زیاد است. لطفا ${Math.round(backoffTime/1000)} ثانیه صبر کنید.`);

    setTimeout(() => {
      submitButton.disabled = false;
      hideLoginError();
    }, backoffTime);
  }
}

/**
 * Generate a secure token
 * In production, tokens would be generated server-side
 */
function generateSecureToken() {
  // In production, tokens should be generated on the server
  // This is just a simplified client-side demonstration
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
}

/**
 * Initialize password toggle functionality
 */
function initializePasswordToggle() {
  const togglePasswordBtn = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');

  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);

      // Toggle icon
      const icon = togglePasswordBtn.querySelector('i');
      if (type === 'password') {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      } else {
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      }
    });
  }
}

/**
 * Show validation error for an input field
 * @param {HTMLElement} inputElement - The input element with error
 * @param {string} message - Error message to display
 */
function showValidationError(inputElement, message) {
  // Add error class to input
  inputElement.classList.add('is-invalid');

  // Check if error message element already exists
  let errorElement = inputElement.parentElement.querySelector('.error-message');

  // Create error message if it doesn't exist
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';

    // Position the error element after the input
    if (inputElement.parentElement.classList.contains('password-input-wrapper')) {
      inputElement.parentElement.parentElement.appendChild(errorElement);
    } else {
      inputElement.parentElement.appendChild(errorElement);
    }
  }

  // Set error message
  errorElement.textContent = message;
}

/**
 * Clear validation error for an input field
 * @param {HTMLElement} inputElement - The input element to clear errors from
 */
function clearValidationError(inputElement) {
  // Remove error class
  inputElement.classList.remove('is-invalid');

  // Find and remove error message if it exists
  const container = inputElement.parentElement.classList.contains('password-input-wrapper')
    ? inputElement.parentElement.parentElement
    : inputElement.parentElement;

  const errorElement = container.querySelector('.error-message');
  if (errorElement) {
    container.removeChild(errorElement);
  }
}

/**
 * Show login error message
 * @param {string} message - Error message to display
 */
function showLoginError(message) {
  const loginError = document.getElementById('login-error');
  if (loginError) {
    loginError.textContent = message;
    loginError.style.display = 'block';
  }
}

/**
 * Hide login error message
 */
function hideLoginError() {
  const loginError = document.getElementById('login-error');
  if (loginError) {
    loginError.textContent = '';
    loginError.style.display = 'none';
  }
}

/**
 * Check if user is already logged in
 * Redirect to dashboard if they are
 */
function checkLoginStatus() {
  // Check if user is already logged in (via localStorage or sessionStorage)
  const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true' ||
                     sessionStorage.getItem('admin_logged_in') === 'true';

  if (isLoggedIn) {
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
  }
}

// Check login status when page loads
checkLoginStatus();
