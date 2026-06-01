// variables.js
// Example: showing variable declaration types, scope, and reassignment in JavaScript.

// var has function scope and is hoisted differently than let/const.
// let has block scope and cannot be accessed before declaration.
// const also has block scope and cannot be reassigned after initialization.

// let a = 10;
// console.log(a);
// var a = 10;

// function pratyush() {
//    var a = 10;
// }
// console.log(a); // a is not defined here if the function is never called

// function add() {
//    let a = 10;
// }
// console.log(a); // a is not defined outside the function

// {
//    let a = 20;
// }
// console.log(a); // a is not defined outside the block

// function ram() {
//    const a = 30;
// }
// console.log(a); // a is not defined outside the function

let a = 20;
a = 30; // Updating the value stored in a is allowed with let.
