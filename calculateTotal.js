function calculateTotal(price, tax, discount = 0) {
  price = price - discount;
  return price + (price * tax);
}
