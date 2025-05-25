//testing build failures
class Calculator {
    constructor() {
        this.result = 0;
    }

    add(a, b) {
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error('Both arguments must be numbers');
        }
        return a + b;
    }

    subtract(a, b) {
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error('Both arguments must be numbers');
        }
        return a - b;
    }

    //multiply
    multiply(a, b) {
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error('Both arguments must be numbers');
        }
        return a * b;
    }

    divide(a, b) {
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error('Both arguments must be numbers');
        }
        if (b === 0) {
            throw new Error('Division by zero is not allowed');
        }
        return a / b;
    }

    power(base, exponent) {
        if (typeof base !== 'number' || typeof exponent !== 'number') {
            throw new Error('Both arguments must be numbers');
        }
        return Math.pow(base, exponent);
    }

    sqrt(number) {
        if (typeof number !== 'number') {
            throw new Error('Argument must be a number');
        }
        if (number < 0) {
            throw new Error('Cannot calculate square root of negative number');
        }
        return Math.sqrt(number);
    }

    percentage(number, percent) {
        if (typeof number !== 'number' || typeof percent !== 'number') {
            throw new Error('Both arguments must be numbers');
        }
        return (number * percent) / 100;
    }

    // Intentional bug for testing - will cause build failure in strict mode
    problematicFunction() {
        // This will cause linting errors
        var unusedVariable = "test";
        console.log("Debug statement left in code");
        return undefined;
    }
}

module.exports = Calculator;

//end
