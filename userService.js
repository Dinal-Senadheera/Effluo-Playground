const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * User Service
 * Handles all user-related operations including authentication,
 * profile management, and role-based permissions.
 */
class UserService {
  constructor() {
    this.apiUrl = config.API_URL;
    this.saltRounds = 10;
    this.tokenExpiry = '24h';
    this.userCache = new Map();
  }

  /**
   * Authenticates a user with username and password
   * @param {string} username - The user's username
   * @param {string} password - The user's password
   * @returns {Promise<Object>} - User data with auth token
   */
  async authenticate(username, password) {
    try {
      // Fetch user from database
      const user = await this.getUserByUsername(username);
      
      if (!user) {
        logger.warn(`Authentication failed: User ${username} not found`);
        return { success: false, message: 'User not found' };
      }
      
      // Compare password hash
      const isValid = await bcrypt.compare(password, user.passwordHash);
      
      if (!isValid) {
        logger.warn(`Authentication failed: Invalid password for ${username}`);
        return { success: false, message: 'Invalid credentials' };
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        config.JWT_SECRET,
        { expiresIn: this.tokenExpiry }
      );
      
      logger.info(`User ${username} authenticated successfully`);
      
      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      };
    } catch (error) {
      logger.error(`Authentication error: ${error.message}`);
      throw new Error('Authentication failed');
    }
  }

  /**
   * Get user by username
   * @param {string} username - The username to look up
   * @returns {Promise<Object>} - User data
   */
  async getUserByUsername(username) {
    try {
      // Check cache first
      if (this.userCache.has(username)) {
        return this.userCache.get(username);
      }
      
      // Fetch from API
      const response = await axios.get(`${this.apiUrl}/users`, {
        params: { username }
      });
      
      const user = response.data.find(u => u.username === username);
      
      // Cache the result
      if (user) {
        this.userCache.set(username, user);
      }
      
      return user;
    } catch (error) {
      logger.error(`Error fetching user by username: ${error.message}`);
      throw new Error('Failed to retrieve user');
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data to create
   * @returns {Promise<Object>} - Created user data
   */
  async createUser(userData) {
    try {
      // Feature B: Added validation
      this.validateUserData(userData);
      
      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, this.saltRounds);
      
      // Create user object
      const user = {
        username: userData.username,
        email: userData.email,
        passwordHash,
        role: userData.role || 'user',
        createdAt: new Date().toISOString()
      };
      
      // Send to API
      const response = await axios.post(`${this.apiUrl}/users`, user);
      
      logger.info(`User ${userData.username} created successfully`);
      
      // Cache the new user
      this.userCache.set(user.username, response.data);
      
      return {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role
      };
    } catch (error) {
      logger.error(`Error creating user: ${error.message}`);
      throw new Error('Failed to create user');
    }
  }
  
  /**
   * Feature B: Added validation method
   * Validates user data before creation
   * @param {Object} userData - User data to validate
   * @throws {Error} If validation fails
   */
  validateUserData(userData) {
    if (!userData.username || userData.username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
    
    if (!userData.email || !userData.email.includes('@')) {
      throw new Error('Valid email is required');
    }
    
    if (!userData.password || userData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    // Check for allowed roles
    const allowedRoles = ['user', 'admin', 'moderator'];
    if (userData.role && !allowedRoles.includes(userData.role)) {
      throw new Error(`Role must be one of: ${allowedRoles.join(', ')}`);
    }
  }
  
  /**
   * Update user profile
   * @param {string} userId - User ID 
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} - Updated user data
   */
  async updateUserProfile(userId, updates) {
    try {
      // Get current user data
      const response = await axios.get(`${this.apiUrl}/users/${userId}`);
      const currentUser = response.data;
      
      // Prepare update data
      const updateData = {};
      
      if (updates.email) {
        updateData.email = updates.email;
      }
      
      if (updates.password) {
        updateData.passwordHash = await bcrypt.hash(
          updates.password, 
          this.saltRounds
        );
      }
      
      // Send update to API
      const updateResponse = await axios.patch(
        `${this.apiUrl}/users/${userId}`,
        updateData
      );
      
      // Invalidate cache
      this.userCache.delete(currentUser.username);
      
      logger.info(`User ${currentUser.username} updated successfully`);
      
      return {
        id: updateResponse.data.id,
        username: updateResponse.data.username,
        email: updateResponse.data.email,
        role: updateResponse.data.role
      };
    } catch (error) {
      logger.error(`Error updating user: ${error.message}`);
      throw new Error('Failed to update user profile');
    }
  }
}

module.exports = new UserService();