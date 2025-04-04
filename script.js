document.addEventListener('DOMContentLoaded', () => {
    const displayElement = document.getElementById('display');
    const buttonsContainer = document.querySelector('.buttons');

    let currentInput = '0';
    let previousInput = '';
    let operator = null;
    let shouldResetDisplay = false; // Flag to clear display after operator or equals

    // --- Helper Functions ---

    function updateDisplay() {
        // Limit display length slightly to prevent overflow visually
        let displayValue = currentInput;
        if (displayValue.length > 12) {
             // Use scientific notation for very long numbers if needed, or truncate
             // For simplicity, let's just indicate it's too long maybe?
             // Or just let it potentially overflow the input design slightly
             // Or use scientific notation:
             if (parseFloat(displayValue) > 999999999999 || parseFloat(displayValue) < -99999999999) {
                displayValue = parseFloat(displayValue).toExponential(6);
             }
             // Or basic truncation:
             // displayValue = displayValue.substring(0, 12) + '...';
        }
        displayElement.value = displayValue;
    }

    function clearAll() {
        currentInput = '0';
        previousInput = '';
        operator = null;
        shouldResetDisplay = false;
        updateDisplay();
    }

    function calculate() {
        if (!operator || previousInput === '') return; // Nothing to calculate

        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) {
            // Handle potential errors if inputs aren't valid numbers (shouldn't happen with current logic, but good practice)
            clearAll();
            displayElement.value = 'Error';
            return;
        }

        let result;
        switch (operator) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    clearAll();
                    displayElement.value = 'Error'; // Division by zero
                    return;
                }
                result = prev / current;
                break;
            default:
                return; // Should not happen
        }

        // Handle floating point inaccuracies (optional but good)
        result = parseFloat(result.toPrecision(12));

        currentInput = String(result);
        operator = null; // Calculation done, ready for next operation or number
        previousInput = ''; // Clear previous input after calculation
        shouldResetDisplay = true; // Next number input should clear the result
        updateDisplay();
    }

    function handleOperator(nextOperator) {
        // If there's already an operator and previous input, calculate first
        if (operator && previousInput !== '' && !shouldResetDisplay) {
            calculate();
            // After calculate, currentInput holds the result
        }

        // If shouldResetDisplay is true, it means we just calculated or pressed an operator
        // If we press another operator right away, just update the operator
        if (!shouldResetDisplay) {
             previousInput = currentInput;
        }
        // If previousInput is empty (like at the start), set it
        else if (previousInput === ''){
             previousInput = currentInput;
        }


        operator = nextOperator;
        shouldResetDisplay = true; // Prepare for the next number input
        // Don't reset currentInput here, keep it until next number is pressed
    }


    function inputNumber(number) {
        if (shouldResetDisplay) {
            currentInput = '';
            shouldResetDisplay = false;
        }

        // Prevent multiple leading zeros unless it's the only digit
        if (currentInput === '0' && number !== '.') {
            currentInput = number;
        } else {
             // Limit input length
             if (currentInput.length >= 15) return;
            currentInput += number;
        }
        updateDisplay();
    }

    function inputDecimal() {
         if (shouldResetDisplay) { // If starting new number after op/equals
            currentInput = '0.';
            shouldResetDisplay = false;
         } else if (!currentInput.includes('.')) { // Add decimal only if not present
            currentInput += '.';
        }
        updateDisplay();
    }


    // --- Event Listener ---

    buttonsContainer.addEventListener('click', (event) => {
        const button = event.target;
        const action = button.dataset.action;
        const number = button.dataset.number;
        const operatorType = button.dataset.operator;

        if (!button.matches('button')) return; // Ignore clicks not on buttons

        if (number !== undefined) {
            inputNumber(number);
        } else if (operatorType !== undefined) {
            handleOperator(operatorType);
        } else if (action === 'decimal') {
            inputDecimal();
        } else if (action === 'clear') {
            clearAll();
        } else if (action === 'calculate') {
            calculate();
        }
    });

    // Initialize display
    updateDisplay();
});