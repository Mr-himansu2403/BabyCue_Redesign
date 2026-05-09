
// Test the regex substitution logic
const originalText = "15-20min";
const match = originalText.match(/[0-9]+/);
const endValue = parseInt(match[0]);
let startValue = 0;
const endValueFixed = 15;

function step(val) {
    console.log(originalText.replace(/[0-9]+/, Math.floor(val)));
}

step(5);
step(10);
step(15);
