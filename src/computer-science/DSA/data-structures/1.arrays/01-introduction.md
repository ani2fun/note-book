# 1. Introduction to arrays

This section introduces the core ideas behind arrays and builds the mental model you need before working with array operations and patterns.

## Table of contents

1. [Understanding the memory model](#understanding-the-memory-model)
2. [Understanding the problem](#understanding-the-problem)
3. [Exploring a possible solution](#exploring-a-possible-solution)
4. [Overview of supported operations](#overview-of-supported-operations)
5. [Internal mechanics of arrays](#internal-mechanics-of-arrays)
6. [Working example](#working-example)

***

# Understanding the Memory Model

> **Course:** DSA › Arrays › Introduction

Before diving into data structures like arrays, we need to answer a surprisingly important question: **how does a computer actually store and retrieve data?**

What is computer memory? Why does it exist? How does a program even run? These fundamentals are what make everything else — arrays, pointers, data structures — click into place. In this lesson, we'll build a simple mental model of memory that works across almost all programming languages.

---

## Memory

Let's start with a concrete example. You ask the CPU to compute `10 + 6`. It does the math and produces `16`. Simple enough.

But here's the real question: **where does `16` go?**

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#64748b"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart LR
    A["  10 + 6  "] --> CPU["CPU<br/>ALU + Registers"]
    CPU --> B["  16  "]
```

<p align="center"><strong>The CPU can add two numbers and produce the result — but where is that result stored?</strong></p>

The CPU uses tiny internal slots called **registers** to hold values during computation. But registers are extremely limited in number. For data that needs to persist beyond a single instruction, we need something bigger: **computer memory (RAM)**.

RAM is its own chip on your motherboard. It doesn't compute anything — that's the CPU's job. Its entire purpose is to **store data** so it can be retrieved and updated later.

```d2
direction: right

cpu: CPU chip {
  ALU
  Registers
}

ram: RAM chip {
  grid-columns: 5
  c0: ""
  c1: ""
  c2: ""
  c3: ""
  c4: ""
}

cpu <-> ram: separate chips, different jobs
```

<p align="center"><strong>CPU computes. RAM stores. They are two separate chips on your motherboard.</strong></p>

---

### Everything is Binary

RAM is a chip, and chips work with electrical signals — high voltage (1) and low voltage (0). That means **everything stored in memory must be represented as 0s and 1s**.

Fortunately, this is easier than it sounds:

- **Numbers** → convert to base 2 (binary)
- **Text, images, etc.** → first encoded as numbers, then converted to binary

This is called the **binary form** of data. Every piece of information your program uses — integers, characters, floats, strings — lives in memory as a sequence of bits.

> **Memory trick:** Think of each bit as a light switch. On = 1, Off = 0. RAM is just a huge wall of light switches.

---

## The Memory Model

When writing real software, you don't want to think about voltage levels and transistors. That's where the **memory model** comes in.

A memory model is an abstraction — a simplified way to think about how memory works so you can reason about your code without getting lost in hardware details.

The mental model is dead simple:

> Imagine memory as a **long chain of numbered boxes**, starting at `0` and ending at `n - 1`, where `n` is the total number of boxes. That's it. This picture covers 99% of what you need when writing software.

```d2
mem: Memory {
  grid-columns: 8
  grid-gap: 0
  b0: "0"
  b1: "1"
  b2: "2"
  b3: "3"
  b4: "4"
  b5: "5"
  b6: "6"
  b7: "n-1"
}
```

<p align="center"><strong>Memory can be visualized as a linear sequence of numbered blocks.</strong></p>

---

### Bits and Bytes

Each box in that chain holds exactly **8 bits**. A group of 8 bits is called a **byte** — the basic unit of memory, like a meter is the basic unit of distance.

| Unit | What it is |
|------|------------|
| **Bit** | A single binary digit — either `0` or `1` |
| **Byte** | A group of 8 bits |

So when you hear "this integer takes 4 bytes", it means 4 consecutive boxes in memory, holding 32 bits total.

---

### Addresses

Storing data is easy. But how do you *find* it again?

Each byte has a unique identifier based on its position — its **address**. It's just the index of the box, counting from 0.

```d2
mem: Memory {
  grid-columns: 6
  grid-gap: 0
  b0: "0"
  b1: "1"
  b2: "2"
  b3: "3" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  b4: "4"
  b5: "5"
}
```

<p align="center"><strong>Each cell is 1 byte (8 bits); its position number is its address. Highlighted cell sits at <code>address = 3</code>.</strong></p>

> **Address in memory:** The address of data is the position of the **first byte** where that data starts.

If you store a 4-byte integer starting at address `3`, its address is `3` — even though it occupies boxes `3`, `4`, `5`, and `6`.

The CPU uses these addresses to read and write data with pinpoint precision. No searching required — it jumps straight to the right box.

> **Analogy:** Memory addresses are like house numbers on a street. You don't walk the entire street to find a house — you go directly to the number.

---

## Program Execution

Now let's zoom out and see how memory fits into the bigger picture of running a program.

When you run a program:
1. The compiler translates your source code into **machine code**
2. That machine code is **loaded into memory** in full
3. The CPU reads instructions from memory **sequentially**, starting at the first address
4. As it executes, the CPU reads data from memory, processes it, and writes results back

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#64748b"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart LR
    CPU["CPU<br/>ALU + Registers"]

    subgraph MEM["Memory"]
        direction TB
        m0["01101010"]
        m1["10100101"]
        m2["00110011"]
        m3["11100010"]
    end

    MEM -->|"READ instruction / data"| CPU
    CPU -->|"WRITE result"| MEM
```

<p align="center"><strong>The CPU and memory are in constant conversation during execution.</strong></p>

Think of it like the human brain: one part breaks down complex problems (CPU), another part retains intermediate information (memory). They work together — neither can do much without the other.

Memory stores two kinds of things during a program's lifetime:
- **The program itself** (the machine code instructions)
- **The data** the program creates and manipulates

---

## Why This Matters for Arrays

This memory model is the foundation for understanding arrays — and nearly every other data structure.

- Arrays occupy a **contiguous sequence** of memory addresses
- Every element starts at a **predictable address** (calculable from the base address + element size)
- The CPU can jump to any element instantly because it knows the exact address

Once you have this mental picture — memory as a numbered line of bytes, each accessible by address — arrays become completely intuitive.

But there's still a question we haven't answered: when you write `array[3]`, what *exactly* happens between that source line and the value coming back? We'll trace it byte by byte before this lesson ends.

---

## Key Takeaways

- RAM is a storage chip; the CPU is a computation chip — they're separate and work together
- Everything in memory is stored as **binary (0s and 1s)**
- Memory = a long sequence of numbered **bytes** (each byte = 8 bits)
- Each byte has a unique **address** (its index from 0)
- The **address of data** = the first byte where it starts
- During execution, the CPU constantly reads instructions and data from memory and writes results back

***

# Understanding the Problem

> **Course:** DSA › Arrays › Introduction

To understand arrays and why we need them, let's look at a real problem that programmers run into all the time when designing software systems.

When writing a program, we often need to store a **collection of related data items** that can be accessed sequentially. For example, imagine storing the ages of all the students in a class.

If there are only a few students, storing them in separate variables feels fine:

```d2
vars: {
  grid-columns: 3
  grid-gap: 24
  a: "ageStudent1 = 12"
  b: "ageStudent2 = 13"
  c: "ageStudent3 = 13"
}
```

<p align="center"><strong>Using variables to store the ages of 3 students.</strong></p>

Easy enough. Three students, three variables. Done.

But what happens when the class has **hundreds of students**? Now you need hundreds of variables:

```d2
vars: {
  grid-columns: 4
  grid-gap: 16
  s1: "ageStudent1 = 12"
  s2: "ageStudent2 = 13"
  s3: "ageStudent3 = 13"
  s4: "ageStudent4 = 11"
  s5: "ageStudent5 = 11"
  s6: "ageStudent6 = 12"
  s7: "ageStudent7 = 12"
  s8: "ageStudent8 = 13"
  s9: "......"
  s10: "......"
  s11: "......"
  s12: "......"
  s13: "ageStudent105 = 13"
  s14: "ageStudent106 = 11"
  s15: "ageStudent107 = 13"
  s16: "ageStudent108 = 11"
}
```

<p align="center"><strong>Using variables to store ages of 108 students.</strong></p>

While this technically works, storing and managing hundreds of values across hundreds of individually named variables is **error-prone and not scalable**.

> *Before reading on — picture the code that prints every student's age. With 108 separately-named variables, what would the loop body even look like? You'd need 108 hard-coded `print()` lines. There's no `i` to loop over.*

That last observation is the hidden cost — variables don't just multiply names, they kill loops.

---

## Limitations of Using Variables

Variables are incredibly useful for holding individual pieces of data. But when you try to use them to store a *collection* of related data, they start to break down fast.

Here's why:

- **A variable can store only one value at a time.**
- **Different variables that store the same type of information must have different names.** You can't call two things `ageStudent` — one has to be `ageStudent1`, another `ageStudent2`, and so on forever.
- **Too many variables complicate the source code and the programming logic**, making it error-prone.
- **Using variables to store lots of data is not scalable.** What happens when the class size changes? You'd need to add or remove variable declarations manually.

> **The real problem:** Variables are designed for individual values. They were never meant to handle collections.

---

## Why This Matters

Computers are designed to solve problems **at scale** — managing large amounts of data that would be impossible for humans to handle manually. Problems like these (storing and processing collections) are extremely common, even in the simplest software.

That's why even the **lowest-level programming languages**, such as assembly, inherently support a data structure for storing multiple values together.

That data structure is what we're about to learn: the **array**.

---

## Key Takeaway

| Approach | Works for | Breaks when |
|---|---|---|
| Separate variables | 2–3 values | Data grows, or you need to loop over it |
| Arrays | Any number of values | (Rarely — this is exactly what they're built for) |

The moment you find yourself typing `variable1`, `variable2`, `variable3`... stop. You need an array.

***

# Exploring a Possible Solution

> **Course:** DSA › Arrays › Introduction

Now that we understand the limitations of using variables and how they prevent us from designing solutions at scale, we can look at the data structure designed to address these problems.

---

## Enter the Array

> An array is a **contiguous segment of memory** that can store multiple data items simultaneously. In its simplest form, an array has a **fixed size** and can store only a fixed number of data items. All items in an array must be of the **same type**.

Let's break that definition down:

- **Contiguous** — all elements sit next to each other in memory, no gaps
- **Fixed size** — you decide how many items it holds when you create it
- **Same type** — you can't mix integers and strings in the same array

Visually, an array looks like a row of labelled boxes, all the same size, sitting side by side:

```d2
direction: right

arr: array {
  grid-columns: 7
  grid-gap: 0
  v1: value1
  v2: value2
  v3: value3
  v4: value4
  v5: value5
  v6: value6
  v7: value7
}

size: "◄────── size ──────►" {
  shape: text
}
size -> arr: "" {style.stroke-dash: 3}
```

<p align="center"><strong>An array data structure.</strong></p>

The `size` is fixed at creation time. Every cell holds one value of the same type, and every cell is the same width in memory.

---

## Solving the Student Ages Problem

Remember the problem from last lesson — storing ages for an entire class? With separate variables it fell apart at scale. An array solves this cleanly.

Instead of:
```
ageStudent1 = 12
ageStudent2 = 13
ageStudent3 = 13
... (×108)
```

You create **one** array that holds all the ages:

```d2
ages: ages {
  grid-columns: 7
  grid-gap: 0
  a1: age1
  a2: age2
  a3: age3
  a4: age4
  a5: age5
  a6: age6
  a7: age7
}
```

<p align="center"><strong>Storing the ages of students in a class in an array.</strong></p>

One name. One structure. All the values.

---

## Why This Works

| Problem with variables | How arrays fix it |
|---|---|
| One value per variable | One array holds all values |
| Hundreds of different names | One name, access by index |
| Can't loop over them easily | Loop with `i` from `0` to `n-1` |
| Not scalable | Resize once, logic stays the same |

> **Key insight:** Instead of naming every value, you name the *collection* once and refer to items by their **position (index)**.

---

## Key Takeaway

An array is the simplest, most fundamental solution to the "store a collection of same-type values" problem. It trades flexibility (fixed size, fixed type) for speed and simplicity (instant access by index, compact in memory).

Every data structure you'll learn after this is either built on top of arrays or exists to solve a limitation of arrays.

***

# Overview of Supported Operations

> **Course:** DSA › Arrays › Introduction

Now that we know the logical representation of an array, let's examine how to **create**, **access**, **modify**, and **traverse** one. Almost all major programming languages support arrays in some form.

---

## Creating an Array

The syntax and rules for creating an array depend on the programming language. An array with a fixed size cannot be modified after creation, and all data items in an array must be of the same type.

```d2
arr: array {
  grid-columns: 5
  grid-gap: 0
  v1: value1
  v2: value2
  v3: value3
  v4: value4
  v5: value5
}
```

<p align="center"><strong>Creating an array of fixed size and datatype.</strong></p>

Higher-level languages like Python inherently provide a **list** instead of a raw array. A list behaves like an array but has a dynamic size and can store elements of different types. However, the underlying machine-level implementation still uses basic arrays as the core data structure, which has a fixed size and type.

```python,editable
from typing import List

# Python lists are dynamic and can grow or shrink at runtime

# Declaring an array (list) of fixed size with default values
numbers: List[int] = [0] * 5

# Declaring and initializing an array
numbers2: List[int] = [1, 2, 3, 4, 5]

# Creating an array of size N
size_n: int = 5
numbers3: List[int] = [0] * size_n

# Creating and initializing using list comprehension
numbers4: List[int] = [i for i in range(5)]
```

> **Tip:** In Python, annotating with `List[int]` is just a hint — the runtime won't enforce it. But it's good practice to document your intent, especially for DSA problems.

---

## Accessing Elements in an Array

An array is a collection of data items stored in **contiguous memory**. This layout allows us to access any element directly using its **index** via the subscript operator `[]`.

> **Why do array indices start from 0 instead of 1?**
>
> Array indices represent an element's **relative** position from the array's beginning. The first element is 0 steps away from the start, the second is 1 step away, and so on. This is not a convention — it's a direct reflection of how address arithmetic works in memory.

```d2
arr: array {
  grid-rows: 2
  grid-columns: 5
  grid-gap: 0
  v1: value1
  v2: value2
  v3: value3
  v4: value4
  v5: value5
  i0: "[0]"
  i1: "[1]"
  i2: "[2]"
  i3: "[3]"
  i4: "[4]"
}
```

<p align="center"><strong>Array elements are accessed via their indices.</strong></p>

Different languages have different syntax, but the underlying access mechanism is the same for all.

```python,editable
from typing import List

# Initializing an array (list)
numbers: List[int] = [1, 2, 3, 4, 5]

# Accessing elements using the subscript [] operator
print("1st value:", numbers[0])   # → 1
print("5th value:", numbers[4])   # → 5

# Negative indexing (Python-specific convenience)
print("Last value:", numbers[-1]) # → 5
```

> **Common mistake:** Accessing `numbers[5]` in a 5-element array raises an `IndexError`. Valid indices are `0` to `len(numbers) - 1`.

---

## Modifying Elements in an Array

Elements in an array can be modified in place, just like variables. To update a value, use `array[index]` on the left side of the assignment operator.

```d2
arr: array {
  grid-rows: 2
  grid-columns: 5
  grid-gap: 0
  v1: value1
  v2: value2 {style.fill: "#fde68a"; style.stroke: "#d97706"}
  v3: value3 {style.fill: "#fde68a"; style.stroke: "#d97706"}
  v4: value4
  v5: value5
  i0: "[0]"
  i1: "[1]" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  i2: "[2]" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  i3: "[3]"
  i4: "[4]"
}
```

<p align="center"><strong>Array elements can be modified via their indices (highlighted = being updated).</strong></p>

```python,editable
from typing import List

# Initializing an array
numbers: List[int] = [1, 2, 3, 4, 5]

# Modifying array elements using the subscript [] operator
numbers[0] = 10
numbers[2] = 30
numbers[4] = 50

# Printing modified values
print("1st value:", numbers[0])   # → 10
print("3rd value:", numbers[2])   # → 30
print("5th value:", numbers[4])   # → 50
```

Different languages implement this differently at the syntax level, but the underlying mechanism — overwriting a memory location at a known address — is the same everywhere.

---

## Traversing an Array

Traversal is one of the most common operations on an array. It is the **only** way to search for a value in an array and is implemented using a loop control variable as an index, starting from `0`. To traverse safely, the size of the array must be known.

The pointer starts at index `0` and steps forward one cell at a time until it reaches the end:

<div class="array-stepper" data-values="1, 2, 3, 4, 5" data-label="index"></div>

<p align="center"><strong>Traversing an array using a loop control variable <code>index</code>. Click Next/Prev to step through, or use the ←/→ keys when the widget is focused.</strong></p>

Higher-level languages have built-in functions to get the array's length. For lower-level languages like C/C++, the programmer needs to track the array's size manually.

```python,editable
from typing import List

# Initializing an array (list)
numbers: List[int] = [1, 2, 3, 4, 5]

# 1. Traversal using index-based for loop
for index in range(len(numbers)):
    print(numbers[index])

# 2. Traversal using direct for-each loop
for value in numbers:
    print(value)

# 3. Traversal using enumerate (index + value)
for index, value in enumerate(numbers):
    print(index, value)

# 4. Traversal using while loop
index: int = 0
while index < len(numbers):
    print(numbers[index])
    index += 1
```

> **Which to use?**
> - Use `for value in numbers` when you only need the value
> - Use `for index, value in enumerate(numbers)` when you need both
> - Use `while` when you need finer control (e.g. skip indices, step by 2)

---

## Summary

| Operation | Syntax | Time Complexity |
|---|---|---|
| **Create** | `numbers = [0] * n` | O(n) |
| **Access** | `numbers[i]` | O(1) |
| **Modify** | `numbers[i] = x` | O(1) |
| **Traverse** | `for i in range(len(numbers))` | O(n) |

Access and modify are **O(1)** because the CPU computes the exact memory address directly from the index — no searching required. Traversal is **O(n)** because every element must be visited.

***

# Internal Mechanics of Arrays

> **Course:** DSA › Arrays › Introduction

So far, we learned what an array is and how it solves problems where we need to store and manipulate large-scale data easily. We can now look at **how the array data structure works under the hood** and what makes it so fast and easy to use.

---

## Memory Addresses

Array elements are accessed using indices because arrays are stored **contiguously** in memory. To understand why, let's revisit the memory model.

> **Note:** This is how an array data structure is stored at the lowest level. Higher-level programming languages abstract all this from the user, but at their core, use the same mechanism.

Memory in RAM is logically organized as a sequence of blocks, each **1 byte (8 bits)** long. Every block has a unique identifier — its **address** — which is simply its relative position from the start (starting from 0).

```d2
mem: Memory {
  grid-columns: 8
  grid-gap: 0
  b0: "0"
  b1: "1"
  b2: "2"
  b3: "3" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  b4: "4"
  b5: "5"
  b6: "6"
  b7: "7"
}
```

<p align="center"><strong>Memory is logically organized as a linear sequence of byte-sized cells. Highlighted cell sits at <code>address = 3</code>.</strong></p>

---

## Layout in Memory

An array is just a **continuous** segment of memory that stores data of a single type. Each element in the array has a fixed size equal to the size of its data type. So:

> **Total size of array** = size of datatype × number of elements

The address of the memory block where an array starts is called the array's **base address**.

> **Base address:** The address of the block of memory where an array starts. The base address, along with the index, is used to access data items in an array.

Here's what an array of 5 integers looks like in memory, with a base address of `2` and each `int` occupying **4 bytes**:

```d2
arr: array {
  grid-rows: 3
  grid-columns: 5
  grid-gap: 0
  v0: value1 {style.fill: "#fde68a"; style.stroke: "#d97706"}
  v1: value2
  v2: value3
  v3: value4
  v4: value5
  i0: "[0]"
  i1: "[1]"
  i2: "[2]"
  i3: "[3]"
  i4: "[4]"
  a0: "2→5"
  a1: "6→9"
  a2: "10→13"
  a3: "14→17"
  a4: "18→21"
}
```

<p align="center"><strong>Structure of an array in memory — base address = <code>2</code>, each <code>int</code> spans 4 bytes. The first element starts at the base address (highlighted).</strong></p>

Key observations:
- Elements are laid out **back to back** with no gaps
- Each element spans exactly `size_of_datatype` bytes
- The next element always starts exactly `size_of_datatype` bytes after the previous one

---

## Accessing Data Items

Now that we know how an array maps into continuous memory, we can derive a simple formula to calculate the address of **any element**, given:
- the **base address** (where the array starts)
- the **size of the datatype** (bytes per element)
- the **index** (which element we want)

> *Before reading on — try writing the formula yourself. Given base `2`, int size `4`, and index `3`, where does element 3 live? What arithmetic gets you there from base?*

> $$\text{address}(index) = base\_address + (size\_of\_datatype \times index)$$

Let's verify with our example (base address = `2`, int = `4` bytes):

| Index | Formula | Address |
|-------|---------|---------|
| 0 | 2 + (4 × 0) | **2** |
| 1 | 2 + (4 × 1) | **6** |
| 2 | 2 + (4 × 2) | **10** |
| 3 | 2 + (4 × 3) | **14** |
| 4 | 2 + (4 × 4) | **18** |

This matches the layout exactly.

> **This is why array indices start at 0, not 1.**
>
> Think of the index not as a position number, but as a **how many elements to skip** count.
>
> - To reach the first element — skip **0** elements → index `0`
> - To reach the second element — skip **1** element → index `1`
> - To reach the third element — skip **2** elements → index `2`
>
> The formula makes this concrete. With base address `2` and int size `4`:
>
> - `index 0` → 2 + (4 × **0**) = **2** ✓ lands exactly at the first element
> - `index 1` → 2 + (4 × **1**) = **6** ✓ lands exactly at the second element
>
> If indices started at `1` instead, `index 1` would give address `6` — jumping straight past the first element at address `2`, which would never be reachable. You'd need a messy correction like `base + (size × (index − 1))`. Starting at `0` keeps the formula clean and direct.

The CPU computes this address **instantly** using a single multiplication and addition — no iteration, no searching. That's why array access is O(1).

---

## Key Takeaway

The power of arrays comes from this formula. Once you know the base address and the datatype size, you can jump to any element in constant time. The CPU doesn't need to scan from the beginning — it does one arithmetic operation and lands exactly at the right memory address.

```python,editable
# Simulating the address formula in Python
base_address = 2
size_of_int = 4  # bytes

def address_of(index: int) -> int:
    return base_address + (size_of_int * index)

for i in range(5):
    print(f"value{i+1} at index {i} → address {address_of(i)}")
```

***

# Working Example

> **Course:** DSA › Arrays › Introduction

Now that we know how an array is stored in memory, let's walk through a **complete end-to-end example** — from logical representation all the way down to how the CPU locates and reads a value using the subscript operator `[]`.

Given below is the logical representation of an integer array with 5 data items:

```d2
direction: right

decl: "array[5]" {
  shape: oval
}

arr: array {
  grid-columns: 5
  grid-gap: 0
  v1: value1
  v2: value2
  v3: value3
  v4: value4
  v5: value5
}

decl -> arr: logical representation
```

<p align="center"><strong>Logical representation of an integer array with 5 data items.</strong></p>

---

## Layout in Memory

We map the array into memory starting at **base address 2**. Because this is an integer array, we consider the size of each data item to be **4 bytes** for this example.

```d2
arr: array {
  grid-rows: 3
  grid-columns: 5
  grid-gap: 0
  v0: value1 {style.fill: "#fde68a"; style.stroke: "#d97706"}
  v1: value2
  v2: value3
  v3: value4
  v4: value5
  i0: "[0]"
  i1: "[1]"
  i2: "[2]"
  i3: "[3]"
  i4: "[4]"
  a0: "2→5"
  a1: "6→9"
  a2: "10→13"
  a3: "14→17"
  a4: "18→21"
}
```

<p align="center"><strong>An array of 5 integers mapped into continuous memory starting at address <code>2</code> (highlighted = base).</strong></p>

Each element occupies exactly 4 consecutive bytes. The elements are laid out back to back with no gaps — that's what "contiguous" means.

---

## Calculating the Address of Data Items

When we write `array[2]` or `array[3]`, the program uses the formula we learned to calculate the exact memory address of that element:

> `address(index) = base_address + (size_of_datatype × index)`

The program already knows the base address and the size of the data type — this is all it needs. Let's see it in action for two accesses:

```d2
c2: |md
  **array[2]**<br/>`2 + (2 × 4) = 10`
| {style.fill: "#fef9c3"; style.stroke: "#d97706"}

c3: |md
  **array[3]**<br/>`2 + (3 × 4) = 14`
| {style.fill: "#dcfce7"; style.stroke: "#16a34a"}

arr: array {
  grid-rows: 2
  grid-columns: 5
  grid-gap: 0
  v0: value1
  v1: value2
  v2: value3 {style.fill: "#fef9c3"; style.stroke: "#d97706"}
  v3: value4 {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  v4: value5
  a0: "addr 2"
  a1: "addr 6"
  a2: "addr 10" {style.fill: "#fef9c3"; style.stroke: "#d97706"}
  a3: "addr 14" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  a4: "addr 18"
}

c2 -> arr.v2
c3 -> arr.v3
```

<p align="center"><strong>Calculating the address for <code>array[2]</code> and <code>array[3]</code> using the subscript operator.</strong></p>

The CPU performs one multiplication and one addition — and it's done. No scanning, no searching. That's why access is always **O(1)**, regardless of array size.

---

## Dereferencing the Value

Calculating the address is only **half** the work. The next step is to actually read the value stored there — this is called **dereferencing**.

The program knows the type of data stored in the array (integer, in our case). So starting from the calculated address, it reads exactly `size_of_datatype` bytes (4 bytes for an int) and interprets them as the value.

> **Dereferencing:** Accessing the value stored at the memory address held by a pointer. The pointer's data type determines how many bytes to read and how to interpret them.

```d2
direction: right

a2: "array[2] = 10" {style.fill: "#fef9c3"; style.stroke: "#d97706"}
v3: value3 {style.fill: "#fef9c3"; style.stroke: "#d97706"}
a2 -> v3: read 4 bytes at addr 10

a3: "array[3] = 14" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
v4: value4 {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
a3 -> v4: read 4 bytes at addr 14
```

<p align="center"><strong>Dereferencing: reading the value at the calculated address using the datatype to determine how many bytes to interpret.</strong></p>

> **Note:** Lower-level languages like C and C++ expose this mechanism directly through **pointers** — variables that store memory addresses and let you read or manipulate any part of a contiguous memory segment. In Python and most high-level languages, this all happens invisibly.

---

## Putting It All Together

Here's the full sequence of what happens every time you write `array[i]`:

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#64748b"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart LR
    A["array[i]"] --> B["Calculate address<br/>base + size × i"]
    B --> C["Jump to<br/>that address"]
    C --> D["Read size bytes<br/>interpret as datatype"]
    D --> E["Return value"]
```

<p align="center"><strong>The full pipeline for a single array element access.</strong></p>

> **We used 4-byte integers in this example, but the underlying mechanism is identical for any datatype** — 1-byte chars, 8-byte doubles, or any custom struct. The formula stays the same; only `size_of_datatype` changes.

All of this happens automatically under the hood in modern programming languages. As a programmer, you just write `array[i]` — the language handles the address arithmetic and dereferencing for you.

---

## Key Takeaway

The subscript operator `array[i]` is not magic — it's one multiplication, one addition, and one memory read. The CPU knows exactly where to go, reads exactly the right number of bytes, and hands the value back. That's what makes arrays so fast and so fundamental.

```python,editable
# See the full pipeline in Python
base_address = 2
size_of_int = 4

def access(index: int) -> str:
    addr = base_address + (size_of_int * index)
    return f"array[{index}] → address {addr} → value{index + 1}"

for i in range(5):
    print(access(i))
```
