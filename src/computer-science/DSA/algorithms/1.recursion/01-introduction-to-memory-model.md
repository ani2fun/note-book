# Understanding memory partitions

Now that we know that computer programs, no matter what language/framework they are written in, become processes in the computer memory when executed, the next step is to understand the structure of these processes when loaded into memory for execution.

As shown in the diagram below, the memory (RAM) associated with a process is partitioned into several sections when it is loaded for execution. 

// Diagram: The structure of a process in memory

Each section has its purpose and is responsible for storing different types of information related to a program when it is executing. The memory of a process is organised into the following key sections:

## Heap memory

Heap memory is a region of a process’s memory used for dynamic allocation, where data can be created and sized at runtime rather than at compile time. It is a large pool of memory that allows variables, objects, and data structures to persist beyond the scope of the function in which they were created, making it ideal for dynamically sized or long-lived data. Depending on the type of language, heap memory is managed differently.

### Low level languages

In low-level languages like `C` and `C++`, heap memory is manually managed i.e, programmers must explicitly allocate it using functions like `malloc` or `new` and release it with `free` or `delete`. Failure to free memory after use results in a **memory leak**, where the OS treats the memory as still in use, making it unavailable for other tasks. Data items created on the heap are accessible anywhere in the program.

C++

```cpp
void main() {

    // Dynamically allocated array
    int *arr = new int [5];

    // Dynamically allocated integer
    int *x = new int();

    // Assign value
    *x = 6;

    // Free memory for the array to avoid memory leaks
    delete[] arr;

    // Free memory for the integer to avoid memory leaks
    delete x;
}
```

// Diagram: Heap memory usage in low level languages

### High level languages

In contrast, high-level languages such as `Java`, `JavaScript`, and `Python` provide automatic memory management via garbage collection. The runtime automatically tracks which objects are no longer referenced and reclaims their memory, reducing the risk of memory leaks and simplifying memory handling for the programmer. 

Java

```java
class HeapExample {
    public static void main(String[] args) {
        // Dynamically allocate an array on the heap
        int[] arr = new int[5];

        // Dynamically allocate an Integer object on the heap
        Integer x = new Integer(6);

        // No need to free memory manually.
        // Garbage collector handles it
    }
```

Typescript

```typescript
// Dynamically allocate an array on the heap
let arr: number[] = new Array(5);

// Dynamically allocate a number variable
let x: number = 6;

// Memory is automatically managed by TypeScript
// runtime (Garbage Collector)
```

Javascript

```javascript
// Dynamically allocate an array on the heap
let arr = new Array(5);

// Dynamically allocate a number variable
let x = 6;

// Memory is automatically managed by Javascript
// runtime (Garbage Collector)
```

Python

```python
# Dynamically allocate a list on the heap
arr = [0] * 5

# Dynamically allocate an integer
x = 6

# Memory is automatically managed by Python's
# garbage collector
```

// Diagram: Heap memory usage in high level languages

## Stack memory

The stack memory is a section of a process that stores variables created inside a function, including the main function. It follows a **LIFO** (**L**ast **I**n, **F**irst **O**ut) structure. Each time a function declares a new variable, a stack frame is created, and the variable is “**pushed**” onto the stack. When the function finishes execution and returns, its stack frame is automatically deallocated, freeing the memory used by its local variables. This mechanism enforces local scope, ensuring that variables exist only during the lifetime of the function call.  Depending on the type of language, stack memory is utilised differently.

### Low level languages

In low-level languages like `C` and `C++`, variables declared inside a function are stored on the stack by default. This includes primitive values, structs, and even fixed-size arrays. Memory for these stack variables is allocated when the function is called and automatically freed when the function returns.

C++

```cpp
void main() {

    // Dynamically allocated array
    int *arr = new int [5];

    // Dynamically allocated integer
    int *x = new int();

    // Assign value
    *x = 6;

    // Free memory for the array to avoid memory leaks
    delete[] arr;

    // Free memory for the integer to avoid memory leaks
    delete x;
}
```

// Diagram: Stack memory usage in low level languages

### High level languages

In high-level languages such as `Java`, `JavaScript`, and `TypeScript`, local primitive values declared within a function are stored directly on the stack. In contrast, objects, arrays, and other complex data structures are allocated on the heap, while the stack holds only a reference to them. This allows heap objects to persist beyond the lifetime of the function in which they were created, while the stack automatically manages the lifetimes of local variables.

In `Python`, the behavior is different. All values, including numbers, strings, and other so-called “primitive” types, are implemented as objects on the heap. The stack only stores references to these objects. This means even simple variables in `Python` behave like heap objects, and memory is automatically managed by Python’s garbage collector.

Java

```java
class HeapExample {
    public static void main(String[] args) {
        // Dynamically allocate an array on the heap
        int[] arr = new int[5];

        // Dynamically allocate an Integer object on the heap
        Integer x = new Integer(6);

        // No need to free memory manually.
        // Garbage collector handles it
    }
```

Typescript

```typescript
// Dynamically allocate an array on the heap
let arr: number[] = new Array(5);

// Dynamically allocate a number variable
let x: number = 6;

// Memory is automatically managed by TypeScript
// runtime (Garbage Collector)
```

Javascript

```javascript
// Dynamically allocate an array on the heap
let arr = new Array(5);

// Dynamically allocate a number variable
let x = 6;

// Memory is automatically managed by Javascript
// runtime (Garbage Collector)
```

Python

```python
# Dynamically allocate a list on the heap
arr = [0] * 5

# Dynamically allocate an integer
x = 6

# Memory is automatically managed by Python's
# garbage collector
```

// Diagram: Stack memory usage in high level languages

## Static memory

Static memory refers to the portion of a program’s memory that is allocated for variables that persist for the entire lifetime of the program. Unlike local variables, which exist only while a function is executing, static variables are created when the program starts and remain in memory until the program terminates. On many systems, a typical static variable occupies 4 bytes of memory, though this can vary depending on the type and system architecture.

Static memory is fixed at compile time and persists throughout the program’s lifetime, providing fast, predictable access. Heap memory, on the other hand, is dynamically allocated at runtime, allowing flexible, temporary storage but requiring manual management and generally slower access.

There are generally two ways to store data in static memory:

### Global variables

If a variable is declared outside any function, it is a global variable, meaning it can be accessed and modified from anywhere in the program. Global variables are stored in static memory, so there is only one copy of the variable for the entire duration of the program, regardless of how many functions access it.

Because they persist throughout the program’s execution, global variables retain their values between function calls, unlike local variables, which are recreated each time a function is invoked. This makes global variables useful for storing information that needs to be shared across multiple parts of a program, such as configuration settings, counters, or flags. 

However, excessive use of global variables can make programs harder to debug and maintain, as changes in one part of the code can inadvertently affect other parts.

C++

```cpp
void main() {

    // Dynamically allocated array
    int *arr = new int [5];

    // Dynamically allocated integer
    int *x = new int();

    // Assign value
    *x = 6;

    // Free memory for the array to avoid memory leaks
    delete[] arr;

    // Free memory for the integer to avoid memory leaks
    delete x;
}
```

Java

```java
class HeapExample {
    public static void main(String[] args) {
        // Dynamically allocate an array on the heap
        int[] arr = new int[5];

        // Dynamically allocate an Integer object on the heap
        Integer x = new Integer(6);

        // No need to free memory manually.
        // Garbage collector handles it
    }
```

Typescript

```typescript
// Dynamically allocate an array on the heap
let arr: number[] = new Array(5);

// Dynamically allocate a number variable
let x: number = 6;

// Memory is automatically managed by TypeScript
// runtime (Garbage Collector)
```

Javascript

```javascript
// Dynamically allocate an array on the heap
let arr = new Array(5);

// Dynamically allocate a number variable
let x = 6;

// Memory is automatically managed by Javascript
// runtime (Garbage Collector)
```

Python

```python
# Dynamically allocate a list on the heap
arr = [0] * 5

# Dynamically allocate an integer
x = 6

# Memory is automatically managed by Python's
# garbage collector
```

// Diagram: Global variables

### Static variables

In languages like `C++` and `Java`, a variable can be declared `static` using the static keyword. When a variable inside a function is declared static, it is stored in static memory, meaning it retains its value throughout the program's lifetime rather than being recreated each time the function is called. Unlike ordinary local variables, static variables preserve their state across multiple function calls, allowing a function to maintain information between executions.

In `Python` and `JavaScript`, there is no concept of true `static` variables like in `C++` or `Java`. We cannot declare a variable inside a function that persists across multiple calls using a static keyword. Rather, we should use global variables to achieve similar persistence.

C++

```cpp
void main() {

    // Dynamically allocated array
    int *arr = new int [5];

    // Dynamically allocated integer
    int *x = new int();

    // Assign value
    *x = 6;

    // Free memory for the array to avoid memory leaks
    delete[] arr;

    // Free memory for the integer to avoid memory leaks
    delete x;
}
```

Java

```java
class HeapExample {
    public static void main(String[] args) {
        // Dynamically allocate an array on the heap
        int[] arr = new int[5];

        // Dynamically allocate an Integer object on the heap
        Integer x = new Integer(6);

        // No need to free memory manually.
        // Garbage collector handles it
    }
```

// Diagram: Static variables

## Code segment

The code segment, also known as the text segment or simply text, is the portion of a process’s memory that contains the executable instructions of a program. It is typically placed at a fixed location, often below the heap or stack, to reduce the risk of being overwritten as the heap or stack grows.

The code segment is usually sharable between processes, meaning that only a single copy needs to reside in memory even if multiple instances of the program are running. This is especially useful for frequently executed programs, such as text editors, compilers, and system shells, as it conserves memory. Additionally, the code segment is generally read-only, which protects the program from accidentally modifying its own instructions and helps maintain program stability and security.

In compiled languages like `C` or `C++`, it contains native **machine code** that the CPU executes directly. In interpreted languages like `Python` or `JavaScript`, **bytecode** or interpreter instructions are executed at runtime. In JVM-based languages like `Java`, it stores **bytecode** that the JVM executes.

C++

```cpp
void main() {

    // Dynamically allocated array
    int *arr = new int [5];

    // Dynamically allocated integer
    int *x = new int();

    // Assign value
    *x = 6;

    // Free memory for the array to avoid memory leaks
    delete[] arr;

    // Free memory for the integer to avoid memory leaks
    delete x;
}
```

Java

```java
class HeapExample {
    public static void main(String[] args) {
        // Dynamically allocate an array on the heap
        int[] arr = new int[5];

        // Dynamically allocate an Integer object on the heap
        Integer x = new Integer(6);

        // No need to free memory manually.
        // Garbage collector handles it
    }
```

Typescript

```typescript
// Dynamically allocate an array on the heap
let arr: number[] = new Array(5);

// Dynamically allocate a number variable
let x: number = 6;

// Memory is automatically managed by TypeScript
// runtime (Garbage Collector)
```

Javascript

```javascript
// Dynamically allocate an array on the heap
let arr = new Array(5);

// Dynamically allocate a number variable
let x = 6;

// Memory is automatically managed by Javascript
// runtime (Garbage Collector)
```

Python

```python
# Dynamically allocate a list on the heap
arr = [0] * 5

# Dynamically allocate an integer
x = 6

# Memory is automatically managed by Python's
# garbage collector
```

// Diagram: Code segment
