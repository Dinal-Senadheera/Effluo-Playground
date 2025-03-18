const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Product Service
 * Handles product management, inventory, and pricing operations
 */
class ProductService {
  constructor() {
    this.apiUrl = config.API_URL;
    this.products = [];
    this.initialized = false;
    this.taxRate = 0.08; // 8% tax rate
  }

  /**
   * Initialize the product service
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.initialized) return;
    
    try {
      const response = await axios.get(`${this.apiUrl}/products`);
      this.products = response.data;
      this.initialized = true;
      logger.info(`Product service initialized with ${this.products.length} products`);
    } catch (error) {
      logger.error(`Failed to initialize product service: ${error.message}`);
      throw new Error('Product service initialization failed');
    }
  }

  /**
   * Get all products
   * @returns {Promise<Array>} List of products
   */
  async getAllProducts() {
    await this.initialize();
    return this.products;
  }

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Product data
   */
  async getProductById(productId) {
    await this.initialize();
    
    const product = this.products.find(p => p.id === productId);
    
    if (!product) {
      logger.warn(`Product not found: ${productId}`);
      return null;
    }
    
    return product;
  }

  /**
   * Calculate final price including tax
   * @param {number} basePrice - Base price before tax
   * @returns {number} - Final price with tax
   */
  calculatePrice(basePrice) {
    return basePrice * (1 + this.taxRate);
  }

  /**
   * Get product price details
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Price details
   */
  async getProductPrice(productId) {
    const product = await this.getProductById(productId);
    
    if (!product) {
      return null;
    }
    
    const basePrice = product.price;
    const finalPrice = this.calculatePrice(basePrice);
    
    return {
      productId: product.id,
      name: product.name,
      basePrice,
      tax: basePrice * this.taxRate,
      finalPrice
    };
  }

  /**
   * Check if product is in stock
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to check
   * @returns {Promise<boolean>} Whether product is in stock
   */
  async isInStock(productId, quantity = 1) {
    const product = await this.getProductById(productId);
    
    if (!product) {
      return false;
    }
    
    return product.stockQuantity >= quantity;
  }

  /**
   * Calculate shipping cost
   * @param {Array} products - List of products
   * @param {string} destination - Shipping destination
   * @returns {number} Shipping cost
   */
  calculateShipping(products, destination) {
    // Base shipping cost
    let shippingCost = 10;
    
    // Add cost based on number of products
    shippingCost += products.length * 2;
    
    // Add cost based on destination
    if (destination === 'international') {
      shippingCost += 25;
    }
    
    return shippingCost;
  }

  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product
   */
  async createProduct(productData) {
    try {
      const response = await axios.post(`${this.apiUrl}/products`, productData);
      const newProduct = response.data;
      
      // Update local cache
      this.products.push(newProduct);
      
      logger.info(`Product created: ${newProduct.id}`);
      return newProduct;
    } catch (error) {
      logger.error(`Failed to create product: ${error.message}`);
      throw new Error('Failed to create product');
    }
  }

  /**
   * Update product information
   * @param {string} productId - Product ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated product
   */
  async updateProduct(productId, updates) {
    try {
      const response = await axios.patch(
        `${this.apiUrl}/products/${productId}`,
        updates
      );
      
      const updatedProduct = response.data;
      
      // Update local cache
      const index = this.products.findIndex(p => p.id === productId);
      if (index !== -1) {
        this.products[index] = updatedProduct;
      }
      
      logger.info(`Product updated: ${productId}`);
      return updatedProduct;
    } catch (error) {
      logger.error(`Failed to update product: ${error.message}`);
      throw new Error('Failed to update product');
    }
  }
}

module.exports = new ProductService();