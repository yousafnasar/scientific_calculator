/* Global refs */
const display = document.getElementById('display');
const submenu = document.getElementById('submenu');
const menuBtn = document.getElementById('menuBtn');

let currentInput = "";

/* --- Helper math wrappers (degrees) --- */
function sinDeg(x) { return Math.sin((+x) * Math.PI / 180); }
function cosDeg(x) { return Math.cos((+x) * Math.PI / 180); }
function tanDeg(x) { return Math.tan((+x) * Math.PI / 180); }

/* --- Submenu toggle --- */
menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    submenu.classList.toggle('show');
});
document.addEventListener('click', () => submenu.classList.remove('show'));

/* --- Append / update functions (global for onclick) --- */
function updateDisplay() {
    display.textContent = currentInput || '0';
}

function appendNumber(n) {
    // avoid leading multiple zeros
    if (currentInput === '0' && n === '0') return;
    currentInput += n;
    updateDisplay();
}

function appendOperator(op) {
    if (!currentInput) return;
    const last = currentInput.slice(-1);
    if ('+-*/%'.includes(last)) return;
    currentInput += op;
    updateDisplay();
}

function appendScientific(text) {
    // add function name and keep '(' so user can enter value then ')'
    currentInput += text;
    updateDisplay();
}

function clearAll() {
    currentInput = "";
    updateDisplay();
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

/* --- calculate safely (using eval but with limited allowed chars) --- */
function calculateResult() {
    if (!currentInput) return;
    // basic sanitization: only allow digits, operators, parentheses, dot, percent and letters for our math functions
    if (!/^[0-9+\-*/().,%\sA-Za-z]+$/.test(currentInput)) {
        display.textContent = "Error";
        return;
    }
    try {
        // handle percentage: convert n% to (n/100)
        const expr = currentInput.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
        const result = Function('"use strict";return (' + expr + ')')();
        currentInput = String(result);
        updateDisplay();
    } catch (err) {
        display.textContent = "Error";
    }
}

/* --- Panels for scientific, unit, currency --- */
const scientificPanel = document.getElementById('scientificPanel');
const unitPanel = document.getElementById('unitPanel');
const currencyPanel = document.getElementById('currencyPanel');

document.getElementById('sciModeBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    scientificPanel.classList.toggle('hidden');
    unitPanel.classList.add('hidden');
    currencyPanel.classList.add('hidden');
    submenu.classList.remove('show');
});

document.getElementById('unitConvBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    unitPanel.classList.toggle('hidden');
    scientificPanel.classList.add('hidden');
    currencyPanel.classList.add('hidden');
    submenu.classList.remove('show');
});

document.getElementById('currConvBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    currencyPanel.classList.toggle('hidden');
    unitPanel.classList.add('hidden');
    scientificPanel.classList.add('hidden');
    submenu.classList.remove('show');
});

/* --- Unit conversion logic --- */
function convertUnit() {
    const val = parseFloat(document.getElementById('unitValue').value);
    const type = document.getElementById('unitType').value;
    const out = document.getElementById('unitResult');
    if (isNaN(val)) { out.textContent = 'Enter a valid number'; return; }
    let res = 0;
    switch (type) {
        case 'cmToIn': res = val / 2.54; out.textContent = `${res.toFixed(4)} in`; break;
        case 'inToCm': res = val * 2.54; out.textContent = `${res.toFixed(4)} cm`; break;
        case 'kgToLb': res = val * 2.20462262; out.textContent = `${res.toFixed(4)} lb`; break;
        case 'lbToKg': res = val / 2.20462262; out.textContent = `${res.toFixed(4)} kg`; break;
        case 'cToF': res = (val * 9 / 5) + 32; out.textContent = `${res.toFixed(2)} °F`; break;
        case 'fToC': res = (val - 32) * 5 / 9; out.textContent = `${res.toFixed(2)} °C`; break;
        default: out.textContent = 'Unknown conversion';
    }
}

/* --- Currency conversion (static demo rates) --- */
function convertCurrency() {
    const val = parseFloat(document.getElementById('currencyValue').value);
    const type = document.getElementById('currencyType').value;
    const out = document.getElementById('currencyResult');
    if (isNaN(val)) { out.textContent = 'Enter a valid number'; return; }
    const rates = {
        usdToPkr: 278,
        pkrToUsd: 1 / 278,
        usdToEur: 0.92,
        eurToUsd: 1 / 0.92
    };
    const rate = rates[type] || 1;
    out.textContent = `${(val * rate).toFixed(2)}`;
}

/* --- expose some functions globally for inline onclicks (safety) --- */
window.appendNumber = appendNumber;
window.appendOperator = appendOperator;
window.appendScientific = appendScientific;
window.clearAll = clearAll;
window.deleteLast = deleteLast;
window.calculateResult = calculateResult;
window.sinDeg = sinDeg;
window.cosDeg = cosDeg;
window.tanDeg = tanDeg;
window.convertUnit = convertUnit;
window.convertCurrency = convertCurrency;
