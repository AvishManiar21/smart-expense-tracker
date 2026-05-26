import api, { tokenManager } from './api';

/**
 * Authentication service
 * Handles all auth-related API calls
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.name - User name
   * @param {string} [userData.currency] - User currency (default: USD)
   * @returns {Promise<Object>} User data and access token
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      // Save access token in memory
      tokenManager.setToken(response.data.data.accessToken);
    }
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} User data and access token
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      // Save access token in memory
      tokenManager.setToken(response.data.data.accessToken);
    }
    return response.data;
  },

  /**
   * Logout user
   * @returns {Promise<Object>} Logout confirmation
   */
  async logout() {
    const response = await api.post('/auth/logout');
    // Clear access token from memory
    tokenManager.clearToken();
    return response.data;
  },

  /**
   * Get current user
   * @returns {Promise<Object>} Current user data
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has access token
   */
  isAuthenticated() {
    return !!tokenManager.getToken();
  },
};

export default authService;
