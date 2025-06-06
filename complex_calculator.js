<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Complex Calculator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f0f0f0;
        }
        .calculator {
            background: #fff;
            border-radius: 8px;
            padding: 20px;
            max-width: 400px;
            margin: auto;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }
        input[type="text"] {
            width: 100%;
            font-size: 20px;
            padding: 10px;
            margin-bottom: 10px;
        }
        .buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }
        button {
            padding: 15px;
            font-size: 16px;
            cursor: pointer;
        }
        .output {
            margin-top: 15px;
            font-weight: bold;
        }
    </style>
</head>
<body>

<div class="calculator">
    <input type="text" id="expression" placeholder="Enter expression..." />
    <div class="buttons">
        <button onclick="insert('1')">1</button>
        <button onclick="insert('2')">2</button>
        <button onclick="insert('3')">3</button>
        <button onclick="insert('+')">+</button>
        <button onclick="insert('4')">4</button>
        <button onclick="insert('5')">5</button>
        <button onclick="insert('6')">6</button>
        <button onclick="insert('-')">-</button>
        <button onclick="insert('7')">7</button>
        <button onclick="insert('8')">8</button>
        <button onclick="insert('9')">9</button>
        <button onclick="insert('*')">*</button>
        <button onclick="insert('0')">0</button>
        <button onclick="insert('.')">.</button>
        <button onclick="insert('/')">/</button>
        <button onclick="clearExpression()">C</button>
        <button onclick="insert('sin(')">sin</button>
        <button onclick="insert('cos(')">cos</button>
        <button onclick="insert('tan(')">tan</button>
        <button onclick="insert('log(')">log</button>
        <button onclick="insert('sqrt(')">sqrt</button>
        <button onclick="insert('pow(')">pow</button>
        <button onclick="insert('PI')">π</button>
        <button onclick="insert('E')">e</button>
        <button onclick="insert('(')">(</button>
        <button onclick="insert(')')">)</button>
        <button onclick="calculate()" style="grid-column: span 4; background: #28a745; color: white;">=</button>
    </div>
    <div class="output" id="result"></div>
</div>

<script>
    function insert(value) {
        document.getElementById('expression').value += value;
    }

    function clearExpression() {
        document.getElementById('expression').value = '';
        document.getElementById('result').innerText = '';
    }

    function calculate() {
        const input = document.getElementById('expression').value;
        try {
            let expr = input;

            // Replace constants
            expr = expr.replace(/\bPI\b/g, Math.PI);
            expr = expr.replace(/\bE\b/g, Math.E);

            // Replace functions
            const functions = ['sin', 'cos', 'tan', 'log', 'sqrt', 'pow'];
            functions.forEach(fn => {
                expr = expr.replace(new RegExp(`\\b${fn}\\b`, 'g'), `Math.${fn}`);
            });

            // Validate allowed characters
            if (!/^[0-9+\-*/()., MathPIE\s]+$/.test(expr)) {
                throw new Error("Invalid characters in expression.");
            }

            const result = Function(`'use strict'; return (${expr})`)();
            document.getElementById('result').innerText = `Result: ${result}`;
        } catch (e) {
            document.getElementById('result').innerText = `Error: ${e.message}`;
        }
    }
</script>

</body>
</html>
