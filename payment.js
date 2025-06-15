class PaymentProcessor {
  constructor() {
    this.fees = {
      creditCard: 0.029,
      debitCard: 0.015,
      bankTransfer: 0.005
    };
  }

  calculateFee(amount, paymentMethod) {
    const feeRate = this.fees[paymentMethod];
    if (!feeRate) {
      throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }
    
    // Refactored: Apply progressive fee structure for higher amounts
    let fee = amount * feeRate;
    if (amount > 5000) {
      // Reduce fee by 20% for amounts over $5000
      fee = fee * 0.8;
    }
    
    return fee;
  }

  processPayment(amount, paymentMethod) {
    const fee = this.calculateFee(amount, paymentMethod);
    const total = amount + fee;
    
    console.log(`Processing ${paymentMethod} payment:`);
    console.log(`Amount: $${amount}`);
    console.log(`Fee: $${fee.toFixed(2)}`);
    console.log(`Total: $${total.toFixed(2)}`);
    
    return {
      success: true,
      amount: amount,
      fee: fee,
      total: total,
      method: paymentMethod
    };
  }
}

module.exports = PaymentProcessor;