# 📚 CSS Learning Notes
### MERN Web Development — CSS Folder

> These notes explain every file in this folder in simple, student-friendly language.
> Read them alongside the actual files to understand what each concept does and why it matters.
>
> Update: Inline header comments were added to each example file to make
> it easier for students to see the purpose of the file and suggested edits.
> Expanded notes: I added in-depth explanations and exercises to each example
> file. Below are direct study prompts and deeper explanations you can paste
> into lesson plans or share with students.

### Study prompts (copy into exercises)
- Animation: Explain `@keyframes`, `animation-timing-function`, and why
  transforms are preferred for smooth animations. Exercise: create a hover
  pulse that scales using `transform: scale()`.
- Box Model: Calculate the total size of boxes with padding and border; show
  examples with/without `box-sizing: border-box`.
- Flexbox: Build a responsive navbar with `flex-wrap` and `justify-content: space-between`.
- Grid: Recreate a common blog layout with a header, sidebar, main content, and footer using named areas.
- Positioning: Demonstrate absolute positioning within a positioned parent and how `z-index` affects stacking.
- Units: Convert `rem` to pixels with different root sizes and explain accessibility benefits.
- Filters: Chain filters for creative effects and explain performance tradeoffs.

If you want, I can now:
- Convert these notes into printable handouts per topic.
- Create short interactive exercises (HTML files with prompts + tests).
- Commit changes and open a PR with a descriptive message.

---

## 📁 File Index

| File | Topic |
|------|-------|
| `index.html` + `style3.css` | CSS Basics & Specificity |
| `index2.html` | CSS Selectors & Pseudo-classes |
| `style.css` | CSS Utility Classes (Reference Sheet) |
| `style2.css` | CSS Reset / Base Styles |
| `style3.css` | External Stylesheet Example |
| `Selectors.css` | (Empty — placeholder for selector practice) |
| `box-model.html` | The CSS Box Model |
| `flexbox.html` | Flexbox Layout |
| `positioning.html` | CSS Positioning |
| `units.html` | CSS Units (px, %, rem, vh, vw) |
| `font.html` | Google Fonts |
| `filter.html` | CSS Filters |
| `app.js` | JavaScript — Heavy Task / Main Thread Blocking |

---

---

## 1. 🎨 `index.html` + `style3.css` — CSS Basics & Specificity

### What is CSS?
CSS (Cascading Style Sheets) is used to style HTML elements — colors, fonts, sizes, layouts, etc.

### Three Ways to Add CSS

```html
<!-- 1. Inline CSS — directly on the element -->
<h1 style="color: blue;">Pratyush</h1>

<!-- 2. Internal CSS — inside a <style> tag in <head> -->
<style>
  h1 { color: red; }
</style>

<!-- 3. External CSS — a separate .css file linked with <link> -->
<link rel="stylesheet" href="style3.css">
```

### What the file shows:
In `index.html`, all three methods are used on the same `<h1>`:
- The `<style>` tag sets `color: red`
- The external `style3.css` sets `color: green`
- The inline style sets `color: blue`

**Result: The text appears BLUE** — because inline styles always win.

### 🔑 CSS Specificity (Priority Order)
```
Inline Style  >  ID Selector  >  Class Selector  >  Tag Selector
    (highest)                                           (lowest)
```
Also: styles that come **later** in the file override earlier ones (the "Cascade").

---

---

## 2. 🎯 `index2.html` — CSS Selectors & Pseudo-classes

### What are Selectors?
Selectors tell CSS **which HTML element to style**.

### Types of Selectors (shown in commented code)

```css
/* Tag Selector — targets all <h3> elements */
h3 { color: purple; }

/* Class Selector — targets elements with class="two" */
.two { color: green; }

/* ID Selector — targets the element with id="one" */
#one { color: red; }

/* Group Selector — targets both h3 AND p */
h3, p { color: aqua; }

/* nth-child — targets the 5th <p> inside a <div> */
div p:nth-child(5) { color: red; }
```

### Pseudo-class: `:hover`
```css
#name:hover {
  color: red;
  font-size: 40px;
}
```
`:hover` applies styles **only when the mouse is over the element**. Great for interactive effects.

### Hex Colors
```html
<h1 style="color: #A6A57A;">Pratyush Mishra</h1>
```
`#A6A57A` is a hex color code. Format: `#RRGGBB` (Red, Green, Blue in hexadecimal).

---

---

## 3. 📦 `box-model.html` — The CSS Box Model

### What is the Box Model?
Every HTML element is a rectangular box made of 4 layers:

```
┌─────────────────────────────┐
│           MARGIN            │  ← Space OUTSIDE the border
│  ┌───────────────────────┐  │
│  │        BORDER         │  │  ← The visible border line
│  │  ┌─────────────────┐  │  │
│  │  │     PADDING     │  │  │  ← Space INSIDE the border
│  │  │  ┌───────────┐  │  │  │
│  │  │  │  CONTENT  │  │  │  │  ← Your actual text/image
│  │  │  └───────────┘  │  │  │
│  │  └─────────────────┘  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

### What the file shows:
```css
.parent {
  width: 200px;
  height: 200px;
  background-color: red;
  padding: 20px;   /* adds 20px space inside, pushing the child away from edges */
}
.child {
  width: 100px;
  height: 100px;
  background-color: blue;
}
```
The red parent box has `padding: 20px`, so the blue child sits 20px away from the parent's edges.

### 🔑 `box-sizing: border-box` (commented out but important!)
```css
* {
  box-sizing: border-box; /* padding and border are INCLUDED in the width/height */
}
```
Without this, adding padding makes the element **bigger** than you set.
With `border-box`, the total size stays exactly what you set. **Always use this in real projects.**

---

---

## 4. 📐 `flexbox.html` — Flexbox Layout

### What is Flexbox?
Flexbox is a CSS layout system that makes it easy to **align and distribute items** in a row or column.

### How to activate Flexbox:
```css
.container {
  display: flex;
}
```
Once you do this, all direct children become "flex items".

### Key Properties used in the file:

```css
.container {
  display: flex;
  flex-direction: row;       /* items go left → right (default) */
  justify-content: center;   /* center items along the MAIN axis (horizontal) */
  align-items: center;       /* center items along the CROSS axis (vertical) */
  height: 100vh;             /* full viewport height */
  width: 100vw;              /* full viewport width */
}
```

### Flex Item Properties (on `.child2`):
```css
.child2 {
  flex-shrink: 2;  /* this item shrinks TWICE as fast as others when space is tight */
}
```

### Commented-out properties worth knowing:
```css
/* align-self: flex-end;  — overrides align-items for just this one item */
/* order: -1;             — moves this item before others (default order is 0) */
/* flex-basis: 200px;     — sets the starting size of the item */
/* flex-grow: 2;          — this item grows twice as much as others */
```

### Visual Summary:
```
justify-content → controls LEFT ↔ RIGHT spacing
align-items     → controls UP ↕ DOWN spacing
flex-direction  → row (→) or column (↓)
```

---

---

## 5. 📍 `positioning.html` — CSS Positioning

### The 5 Position Values

```css
position: static;    /* DEFAULT — normal document flow, top/left/etc. have NO effect */
position: relative;  /* moves relative to its NORMAL position, other elements unaffected */
position: absolute;  /* removed from flow, positioned relative to nearest positioned ancestor */
position: fixed;     /* stays fixed on screen even when you scroll */
position: sticky;    /* acts like relative UNTIL you scroll to it, then sticks */
```

### What the file demonstrates:
The file has 5 child divs inside a very tall container (6000px height — so you can scroll).
Each child demonstrates a different position type (most are commented out for you to try one at a time).

**Active example:**
```css
.child5 {
  position: sticky;
  top: 0px;  /* sticks to the top of the viewport when scrolled to */
}
```

### 🔑 Quick Mental Model:
| Position | Stays in flow? | Scrolls with page? | Relative to |
|----------|---------------|-------------------|-------------|
| static | ✅ Yes | ✅ Yes | — |
| relative | ✅ Yes | ✅ Yes | Itself |
| absolute | ❌ No | ✅ Yes | Nearest positioned parent |
| fixed | ❌ No | ❌ No (stays put) | Viewport |
| sticky | ✅ Yes | Partially | Scroll container |

---

---

## 6. 📏 `units.html` — CSS Units

### Absolute vs Relative Units

**Absolute (fixed size):**
```css
font-size: 16px;  /* pixels — always the same size */
```

**Relative (depends on something else):**
```css
/* % — relative to the PARENT element */
.child {
  width: 50%;   /* 50% of parent's width */
  height: 50%;  /* 50% of parent's height */
}

/* vh / vw — relative to the VIEWPORT (browser window) */
.parent {
  height: 100vh;  /* 100% of viewport height */
  width: 100vw;   /* 100% of viewport width */
}

/* rem — relative to the ROOT element's font-size (usually 16px) */
h1 {
  font-size: 4rem;  /* 4 × 16px = 64px */
}

/* em — relative to the PARENT element's font-size */
h2 {
  font-size: 6em;  /* 6 × parent's font-size */
}
```

### 🔑 When to use what:
- `px` → fixed sizes, borders, shadows
- `%` → widths relative to parent
- `rem` → font sizes (consistent across the page)
- `vh/vw` → full-screen sections, hero banners

---

---

## 7. 🔤 `font.html` — Google Fonts

### How to use Google Fonts:
1. Go to [fonts.google.com](https://fonts.google.com)
2. Pick a font, copy the `<link>` tags
3. Use the font-family name in your CSS

```html
<!-- Step 1: Add these in <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playwrite+GB+S+Guides&display=swap" rel="stylesheet">
```

```css
/* Step 2: Use it in CSS */
h1 {
  font-family: "Playwrite GB S Guides", sans-serif;
  /* "sans-serif" is the fallback if the Google Font fails to load */
}
```

### `rel="preconnect"` — What does it do?
It tells the browser to **start connecting to Google's servers early**, so the font loads faster. It's a performance optimization.

---

---

## 8. 🖼️ `filter.html` — CSS Filters

### What are CSS Filters?
Filters apply **visual effects to images** (or any element) — like Instagram filters but in code.

### All filters shown in the file:
```css
img {
  filter: blur(10px);              /* makes the image blurry */
  filter: grayscale(70%);          /* removes color (0% = full color, 100% = black & white) */
  filter: brightness(150%);        /* makes it brighter (100% = normal) */
  filter: contrast(200%);          /* increases contrast */
  filter: drop-shadow(16px 16px 20px blue); /* adds a shadow around the image */
  filter: hue-rotate(180deg);      /* rotates the colors on the color wheel */
  filter: invert(75%);             /* inverts colors (like a photo negative) */
  filter: opacity(25%);            /* makes it transparent (same as opacity property) */
  filter: saturate(30%);           /* reduces color intensity */
  filter: sepia(60%);              /* gives a warm brownish vintage tone */
}
```

### 🔑 Combining Filters:
You can chain multiple filters together:
```css
filter: grayscale(50%) blur(2px) brightness(120%);
```

---

---

## 9. 🎨 `style.css` — CSS Utility Classes (Reference Sheet)

This is a large reference file with **utility classes** — small, single-purpose CSS classes you can mix and match on HTML elements. Think of it like a mini version of Bootstrap or Tailwind CSS.

### Categories covered:

**Layout:**
```css
.flex        { display: flex; }
.grid        { display: grid; grid-template-columns: repeat(3, 1fr); }
.flex-center { display: flex; justify-content: center; align-items: center; }
```

**Spacing:**
```css
.mt-1 { margin-top: 10px; }
.p-2  { padding: 20px; }
```

**Colors:**
```css
.bg-dark   { background: #222; color: white; }
.text-red  { color: red; }
.bg-gradient { background: linear-gradient(to right, #0077ff, #00c6ff); }
```

**Typography:**
```css
.uppercase    { text-transform: uppercase; }
.font-bold    { font-weight: bold; }
.text-shadow  { text-shadow: 1px 1px 2px black; }
```

**Transforms & Animations:**
```css
.rotate       { transform: rotate(45deg); }
.hover-scale:hover { transform: scale(1.05); }
.animation    { animation: fade 2s infinite; }

@keyframes fade {
  0%   { opacity: 0; }
  50%  { opacity: 1; }
  100% { opacity: 0; }
}
```

**Filters:**
```css
.grayscale  { filter: grayscale(100%); }
.blur       { filter: blur(5px); }
.invert     { filter: invert(1); }
```

### 🔑 How to use utility classes:
```html
<!-- Instead of writing custom CSS, combine utility classes -->
<div class="flex flex-center bg-dark p-2 rounded shadow">
  Hello World
</div>
```

---

---

## 10. 🔄 `style2.css` — CSS Reset / Base Styles

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: #f4f4f4;
  color: #333;
  line-height: 1.6;
}
```

### Why do we reset CSS?
Browsers have **default styles** (margins, paddings, font sizes) that differ between Chrome, Firefox, Safari, etc. Resetting them gives you a **clean, consistent starting point**.

- `margin: 0; padding: 0` → removes all default spacing
- `box-sizing: border-box` → makes sizing predictable (padding included in width)
- `line-height: 1.6` → improves text readability

---

---

## 11. ⚡ `app.js` — JavaScript Heavy Task (Main Thread Blocking)

```javascript
console.time("Heavy Task");

let total = 0;
for (let i = 0; i < 1_000_000_000; i++) {  // 1 BILLION iterations!
  total += Math.sqrt(i) * Math.random();
}

console.log("Total:", total);
console.timeEnd("Heavy Task");
```

### What does this demonstrate?
This is a **deliberately slow** JavaScript loop (1 billion iterations). It's used to show:

1. **Main Thread Blocking** — JavaScript runs on a single thread. While this loop runs, the browser **freezes** — you can't click, scroll, or interact with the page.
2. **`console.time()` / `console.timeEnd()`** — measures how long a block of code takes to run.

### 🔑 Why is this important?
In real apps, you should **never** run heavy computations on the main thread. Solutions include:
- **Web Workers** — run heavy code in a background thread
- **Breaking up work** — use `setTimeout` to split work into smaller chunks
- **Async/Await** — for I/O tasks (network, file reading), not CPU tasks

---

---

## 🧠 Quick Revision Summary

| Concept | Key Takeaway |
|---------|-------------|
| CSS Specificity | Inline > ID > Class > Tag |
| Box Model | Content → Padding → Border → Margin |
| Flexbox | `display: flex` + `justify-content` + `align-items` |
| Positioning | static → relative → absolute → fixed → sticky |
| Units | px (fixed), % (parent), rem (root), vh/vw (viewport) |
| Filters | Visual effects on images: blur, grayscale, brightness... |
| Google Fonts | Link in `<head>`, use `font-family` in CSS |
| CSS Reset | Remove browser defaults for consistency |
| JS Blocking | Heavy loops freeze the browser — avoid on main thread |

---

> 💡 **Tip:** Open each HTML file in your browser, then open DevTools (F12) and experiment with changing CSS values in the Elements panel. That's the fastest way to learn!
