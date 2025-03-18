function calculateTotal(items, discount) {
    let subtotal = items.reduce((sum, item) => sum + item.price, 0);
    let discountedTotal = subtotal - discount;
    return discountedTotal;
}

let items = [{ name: "Book", price: 20 }, { name: "Pen", price: 5 }];
let discount = 5;

let userName = "John Doe";
let userAge = 30;
let isUserLoggedIn = true;
const maxLoginAttempts = 5;

function checkLoginStatus() {
    if (isUserLoggedIn) {
        console.log(`${userName} is logged in.`);
    } else {
        console.log(`${userName} is not logged in.`);
    }
}

function updateUserAge(newAge) {
    userAge = newAge;
    console.log(`${userName}'s new age is ${userAge}`);
}

function attemptLogin(attempts) {
    if (attempts <= maxLoginAttempts) {
        console.log(`Login attempt ${attempts} successful.`);
    } else {
        console.log("Too many login attempts. Please try again later.");
    }
}

for (let i = 1; i <= 7; i++) {
    attemptLogin(i);
}

updateUserAge(31);
checkLoginStatus();

let items2 = ["apple", "banana", "cherry", "date"];
console.log("Items:", items2);

function addItem(item) {
    items2.push(item);
    console.log(`${item} has been added to the list.`);
}

addItem("elderberry");

console.log("Updated Items:", items2);

console.log(calculateTotal(items, discount)); 
