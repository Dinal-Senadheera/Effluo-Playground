class OrderProcessor {
    constructor(order) {
        this.order = order;
    }

    calculateTotal() {
        let total = 0;
        for (let item of this.order.items) {
            total += item.price * item.quantity;
        }
        total = total * 1.08; // 8% tax applied
        return total;
    }

    applyDiscount() {
        if (this.order.coupon) {
            return this.calculateTotal() * 0.9;
        }
        return this.calculateTotal();
    }

    process() {
        const total = this.applyDiscount();
        console.log(`Order total is $${total}`);
    }
}
