# JavaScript Folder Notes

## Overview
This folder contains simple JavaScript examples that teach basic concepts for beginners. Each file highlights a different topic:

- `app.js` — functions and return values
- `datatypes.js` — data types and assignment behavior
- `first.js` — asynchronous execution with `setTimeout`
- `variables.js` — variable declarations and scoping
- `index.html` — embedding JavaScript in HTML and hoisting differences

---

## app.js — Functions and Return Values

### What it does
This file defines a function called `double` that takes a number and multiplies it by 2.

```js
var a = 10;
function double(num) {
  return num * 2;
}

var res1 = double(5);
console.log(res1);
var res2 = double(a);
console.log(res2);
```

### Key concepts
- `function double(num) { ... }` creates a reusable block of code.
- `num` is a parameter, a local variable inside the function.
- `return num * 2;` sends a value back to where the function was called.
- `double(5)` passes a literal value.
- `double(a)` passes the value stored in variable `a`.
- `console.log(...)` prints values to the browser console or terminal.

### Student takeaway
Functions let you avoid repeating the same calculation in multiple places. Use parameters to pass data in, and use `return` to get results out.

---

## datatypes.js — Data Types and Assignment

### What it teaches
This file shows how JavaScript handles primitive values, the `typeof` operator, and how variable assignment works.

```js
// let number =123445;
// console.log(typeof number);
// let number = 12345678.9098765432123456789;
// console.log(typeof number);
// let itp="Satya";
// console.log(typeof itp);
// let boolean=true;


// let temp = null;
// console.log(typeof temp);
// let temp = undefined;
// let temp = 0;
let a = 10;

b = a;
b = 30;
console.log(a);
```

### Key concepts
- `typeof` returns the type of a value: `number`, `string`, `boolean`, `object`, `undefined`, etc.
- JavaScript uses a single numeric type for both integers and decimals.
- `null` is a special value that means "no value", but `typeof null` returns `object` due to a historical quirk.
- `undefined` means a variable has been declared but not assigned.
- `let a = 10;` stores the value `10` in `a`.
- `b = a;` copies the primitive value from `a` to `b`.
- Changing `b` after the copy does not change `a` because primitives are copied by value.

### Student takeaway
Use data types consciously. For primitive values like numbers and strings, assigning to another variable copies the value, not the reference.

---

## first.js — Asynchronous Execution with `setTimeout`

### What it does
This file runs four timed callbacks that execute after 5 seconds.

```js
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
```

### Key concepts
- `setTimeout(callback, delay)` schedules code to run after a waiting period.
- `5000` means 5000 milliseconds, or 5 seconds.
- The function inside `setTimeout` is called a callback.
- JavaScript does not block while waiting. The rest of the program can continue running.

### Student takeaway
JavaScript supports asynchronous behavior. `setTimeout` is useful when you want something to happen later without freezing the page.

---

## variables.js — `var`, `let`, and `const`

### Code shown
```js
// let a =10;
// console.log(a);
// var a =10;

// function pratyush(){
//    var a =10;
// }
// console.log(a);

//  function add(){
//    let a =10;
//  }
//  console.log(a);

//  {
//    let a =20;
//  }
//  console.log(a);

// function ram(){
//    const a =30;
// }
// console.log(a);

let a =20;
a =30;
```

### Key concepts
- `var` is older JavaScript syntax and has function scope, which can lead to confusing behavior.
- `let` has block scope, meaning it only exists inside the nearest `{}` block.
- `const` also has block scope but cannot be reassigned after it is set.
- When you write `let a = 20; a = 30;`, you are updating the same variable.
- The commented examples show how variable scope works in functions and blocks.

### Student takeaway
Prefer `let` and `const` in modern JavaScript. Use `let` when a variable may change, and `const` for values that should stay constant.

---

## index.html — Script Loading and Hoisting

### What it does
This HTML file embeds a JavaScript block directly in the page.

```html
<script>
//       var a =10;
// function double(num){
//    return num *2 ;
// }

// var res1 = double(5);
// console.log(res1);
// var res2 = double(a);
// console.log(res2);
console.log(a);
let a =10;
</script>
```

### Key concepts
- JavaScript inside `<script>` tags runs when the browser parses the HTML.
- `console.log(a);` appears before `let a = 10;`.
- Because `let` is block-scoped and uses the Temporal Dead Zone, this code will throw a `ReferenceError` if executed.
- If the code used `var a = 10;` instead, the variable would be hoisted and `console.log(a)` would print `undefined`.

### Student takeaway
Understanding hoisting is important. `var` behaves differently from `let` and `const`, and using `let` helps prevent bugs from accessing variables too early.

---

## Summary for Students

### Main learning points
- Functions let you organize and reuse code.
- Primitive data types are copied by value.
- `setTimeout` shows how JavaScript can delay work asynchronously.
- `let` and `const` are safer than `var` because they enforce clearer scope rules.
- When writing inline scripts, order matters: a variable must be declared before you use it.

### Suggested practice
1. Modify `app.js` to create a `triple` function.
2. Uncomment and run various `typeof` examples in `datatypes.js`.
3. Change the delay in `first.js` and observe when messages appear.
4. Try using `const` in `variables.js` and see how reassignment behaves.
5. In `index.html`, replace `let` with `var` and compare the console result.
