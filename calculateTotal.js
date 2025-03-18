function calculateTotal(items, taxRate) {
    let subtotal = items.reduce((sum, item) => sum + item.price, 0);
    let tax = subtotal * taxRate;
    return subtotal + tax;
}

let items = [{ name: "Book", price: 20 }, { name: "Pen", price: 5 }];
let taxRate = 0.1;

console.log(calculateTotal(items, taxRate)); 