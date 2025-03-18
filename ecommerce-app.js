// === Product Catalog ===
const products = [
  { id: 1, name: 'Laptop', price: 999, stock: 5 },
  { id: 2, name: 'Phone', price: 699, stock: 10 }
];

// === User Database ===
const users = [
  { id: 101, name: 'John', status: 'regular' },
  { id: 102, name: 'Sarah', status: 'vip' }
];

// === Order Calculation ===
function calculateTotal(items) {
  return items.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    return total + (product.price * item.quantity);
  }, 0);
}

function applyDiscount(total, discount) {
  if (discount < 0 || discount > 0.3) {
    throw new Error('Invalid discount rate');
  }
  return total * (1 - discount);
}

// === Order Processing ===
function processOrder(userId, items, discount = 0) {
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error('User not found');

  const subtotal = calculateTotal(items);
  const total = applyDiscount(subtotal, discount);

  items.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    product.stock -= item.quantity;
    if (product.stock < 0) throw new Error('Out of stock');
  });

  console.log(`Order complete for ${user.name}`);
  console.log(`Total: $${total.toFixed(2)}`);
  return total;
}

module.exports = { processOrder };