function computeTotal(items, discount) { 
    let subtotal = items.reduce((sum, item) => sum + item.price, 0);
    let discountedTotal = subtotal - discount;
    return discountedTotal;
}

let items = [{ name: "Book", price: 20 }, { name: "Pen", price: 5 }];
let discount = 5;

console.log(computeTotal(items, discount)); 