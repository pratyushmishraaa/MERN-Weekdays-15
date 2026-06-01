// first.js
// Example: using setTimeout to schedule asynchronous callbacks.

// Each setTimeout schedules a function to run after 5000 milliseconds (5 seconds).
// JavaScript does not block while waiting; the code continues and the callback runs later.
setTimeout(function timeout() {
    console.log("Click the button 1!");
}, 5000);
setTimeout(function timeout() {
    console.log("Click the button 2!");
}, 5000);
setTimeout(function timeout() {
    console.log("Click the button 3!");
}, 5000);
setTimeout(function timeout() {
    console.log("Click the button 4!");
}, 5000);
