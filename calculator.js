// Simple Calculator
function calculate() {
  const a = 15;
  const b = 8;
  
  const sum = a + b;
  const difference = a - b;
  const product = a * b;
  const quotient = a / b;
  const remainder = a % b;
  
  console.log(`Numbers: ${a} and ${b}`);
  console.log(`Sum: ${sum}`);
  console.log(`Difference: ${difference}`);  
  console.log(`Product: ${product}`);
  console.log(`Quotient: ${quotient.toFixed(2)}`);
  console.log(`Remainder: ${remainder}`);
  
  return {
    sum,
    difference,
    product,
    quotient,
    remainder
  };
}

// Run the calculation
const results = calculate();

// Export for use in other modules
module.exports = { calculate, results };
