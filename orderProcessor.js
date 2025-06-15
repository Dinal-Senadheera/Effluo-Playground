class OrderProcessor {
    constructor(order) {
        this.order = order;
    }

    calculateTotal() {
        let total = 0;
        for (let item of this.order.items) {
            total += item.price * item.quantity;
        }
        return total;
    }

    applyDiscount() {
        if (this.order.coupon) {
            return this.calculateTotal() * 0.9; // 10% discount
        }
        return this.calculateTotal();
    }

    process() {
        const total = this.applyDiscount();
        console.log(`Order total is $${total}`);
    }
}

// Example usage:
const order = {
    items: [
        { price: 10, quantity: 2 },
        { price: 5, quantity: 4 }
    ],
    coupon: true
};

const processor = new OrderProcessor(order);
processor.process();
