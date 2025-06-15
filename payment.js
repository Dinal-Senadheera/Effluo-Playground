class PaymentProcessor {
  constructor() {
    this.fees = {
      creditCard: 0.029,
      debitCard: 0.015,
      bankTransfer: 0.005
    };
  }

  validateAmount(amount) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Amount must be a positive number');
    }
    if (amount > 10000) {
      throw new Error('Amount exceeds maximum limit of $10,000');
    }
  }

  calculateFee(amount, paymentMethod) {
    const feeRate = this.fees[paymentMethod];
    if (!feeRate) {
      throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }
    return amount * feeRate;
  }

  processPayment(amount, paymentMethod) {
    // Add validation before processing
    this.validateAmount(amount);
    
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