// app.js
// Example: defining a function, passing data into it, and using the returned value.

// Declare a variable with a numeric value.
var a = 10;

// Define a function named "double" that accepts one parameter.
function double(num) {
   // Multiply the input value by 2 and send the result back.
   return num * 2;
}

// Call the function with a literal number.
var res1 = double(5);
console.log(res1); // Output: 10

// Call the function with a variable.
var res2 = double(a);
console.log(res2); // Output: 20
