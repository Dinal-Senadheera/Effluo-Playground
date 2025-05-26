function calculateTotal(price, quantity, discount) {
  return price * quantity * (1 - discount / 100);
}

module.exports = { calculateTotal };
