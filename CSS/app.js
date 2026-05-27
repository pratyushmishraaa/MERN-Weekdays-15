// IN-DEPTH: app.js — Main thread blocking & alternatives
// Purpose: Demonstrates a blocking computation to teach why long synchronous
// JavaScript tasks should be avoided in UI code.

// Why this is a problem:
// - JavaScript runs on a single main thread in the browser. Long synchronous
//   tasks block rendering, user input, and other scripts, causing the page to freeze.

// Alternatives to avoid blocking the main thread:
// 1) Web Workers: run CPU-heavy work in a background thread and communicate
//    via `postMessage`.
// 2) Chunking / batching: break work into smaller steps and run via
//    `requestIdleCallback` or `setTimeout(..., 0)` between chunks.
// 3) Use optimized native APIs when possible (e.g., WebGL, GPU-based processing).

// Example blocking code (for demonstration only):
console.time("Heavy Task");
let total = 0;
for (let i = 0; i < 1000000000; i++) {
    total += Math.sqrt(i) * Math.random();
}
console.log("Total:", total);
console.timeEnd("Heavy Task");

// Exercise: Replace the loop with a Web Worker to observe non-blocking behavior.