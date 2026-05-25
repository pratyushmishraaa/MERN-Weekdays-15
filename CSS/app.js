// Heavy JavaScript Calculation Example
// This will block the main thread and create delay

console.time("Heavy Task");

let total = 0;

for (let i = 0; i < 1000000000; i++) {
    total += Math.sqrt(i) * Math.random();
}

console.log("Total:", total);

console.timeEnd("Heavy Task");