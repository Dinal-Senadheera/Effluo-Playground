// payment.js - Base Version
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
    return amount * feeRate;
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