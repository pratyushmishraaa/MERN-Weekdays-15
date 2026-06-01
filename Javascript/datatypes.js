// datatypes.js
// Example: exploring primitive values, type detection, and assignment behavior.

// Uncomment each block to run the examples and see the type printed in the console.
// let number = 123445;
// console.log(typeof number); // number
// let number = 12345678.9098765432123456789;
// console.log(typeof number); // number
// let itp = "Satya";
// console.log(typeof itp); // string
// let boolean = true;
// console.log(typeof boolean); // boolean

// let temp = null;
// console.log(typeof temp); // object (this is a JavaScript quirk)
// let temp = undefined;
// console.log(typeof temp); // undefined
// let temp = 0;
// console.log(typeof temp); // number

let a = 10;

// Copy the primitive value from a into b. This is a value copy, not a reference copy.
b = a;

// Change b after the copy. This does not affect the original variable a.
b = 30;
console.log(a); // Output: 10

