// === USER MANAGEMENT ===
const users = [
    { id: 1, name: 'Alice', tier: 'basic' },
    { id: 2, name: 'Bob', tier: 'premium' }
  ];
  
  function getUser(userId) {
    return users.find(u => u.id === userId);
  }
  
  // === INVENTORY SYSTEM ===
  const inventory = [
    { id: 101, name: 'Widget', price: 50, stock: 10 },
    { id: 102, name: 'Gadget', price: 150, stock: 5 },
    { id: 103, name: 'Thingy', price: 25, stock: 20 }
  ];
  
  function getProduct(productId) {
    return inventory.find(p => p.id === productId);
  }
  
  // === PRICING ENGINE ===
  function calculateSubtotal(items) {
    return items.reduce((sum, item) => {
      const product = getProduct(item.id);
      return sum + (product.price * item.quantity);
    }, 0);
  }
  
  function applyDiscount(total, discountRate) {
    if (discountRate < 0 || discountRate > 0.5) {
      throw new Error('Invalid discount rate');
    }
    return total * (1 - discountRate);
  }
  
  // === ORDER PROCESSING ===
  function validateStock(items) {
    items.forEach(item => {
      const product = getProduct(item.id);
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
    });
  }
  
  function processOrder(userId, items, discountRate = 0) {
    const user = getUser(userId);
    if (!user) throw new Error('User not found');
    
    validateStock(items);
    const subtotal = calculateSubtotal(items);
    const total = applyDiscount(subtotal, discountRate);
    
    items.forEach(item => {
      const product = getProduct(item.id);
      product.stock -= item.quantity;
    });
  
    console.log(`Processed order for ${user.name}`);
    console.log(`Total: $${total.toFixed(2)}`);
    return total;
  }
  
  // === UTILITIES ===
  function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
  }
  
  module.exports = { processOrder, getUser };