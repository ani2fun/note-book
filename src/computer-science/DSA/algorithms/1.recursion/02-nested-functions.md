# Understanding nested functions

Now that we know the basic memory layout, let's examine how large computer programs are implemented. Computer programs do not contain just a single function but multiple functions. The functions call each other constantly, making the code modular and easy to understand. We know that the stack memory of a process is dedicated to storing information about a function.

// Diagram: Nested function call

Whenever a program has a function call, all the data associated with that function call, like the local variables, function parameters, return address, etc., gets stored in a **stack frame** structure. Data for each function call has its own stack frame, stored in LIFO order in the stack memory.

// Diagram: Stack frame for function foo()

Let's examine an example program to understand better how nested function calls execute and what they look like in the stack memory.

C++

```cpp
#include <iostream>

void functionC() {
    // Some code
}

void functionB() {
    functionC();
}

void functionA() {
    functionB();
}

void main() {
    functionA();
}
```

Java

```java
class Main {
    static void functionC() {
        // Some code
    }

    static void functionB() {
        functionC();
    }

    static void functionA() {
        functionB();
    }

    public static void main(String[] args) {
        functionA();
    }
```

Typescript

```typescript
function functionC(): void {
    // Some code
}

function functionB(): void {
    functionC();
}

function functionA(): void {
    functionB();
}

function main(): void {
    functionA();
}

main();
```

Javascript

```javascript
function functionC() {
    // Some code
}

function functionB() {
    functionC();
}

function functionA() {
    functionB();
}

function main() {
    functionA();
}

main();
```

Python

```python
def function_c():
    # Some code
    pass

def function_b():
    function_c()

def function_a():
    function_b()

def main():
    function_a()

main()
```

When the program executes, the stack memory is empty until the `main` function is called. When the `main` function is called, a new stack frame for it is created where all the local variables are stored. This stack frame is inserted at the **top** of the stack and will stay there until the `main` function exits. 

// Diagram: Every function call creates its own stack frame in the stack memory

As we continue calling more functions in our program, a new stack frame is created for every function call, which is then pushed to the top of the stack. At any given time, the code being executed from the code segment is guaranteed to be from the function at the top of the stack. When a function exits or returns, the associated stack frame is deleted from the top stack of the stack memory.

***

# Understanding stack overflow

We know that every function call creates a new stack frame, and these frames continue to accumulate as functions call other functions. Since a process is allocated only a limited amount of stack memory, this space can eventually be exhausted.  Stack overflow occurs when the program attempts to use more stack space than the operating system has allocated. 

A stack overflow is one of the most common execution-time failures in programs involving recursion or large automatic variables. Understanding how stack growth works is essential for writing safe and memory-efficient code, especially when designing algorithms that involve deep computation or recursive logic.

Stack overflow can occur in several situations, most commonly due to uncontrolled recursion, deeply nested function calls, or excessive memory allocation within functions. In each of these cases, stack frames accumulate faster than they can be released, eventually pushing the stack past its upper limit.

## Nested function calls

This situation occurs when a large number of nested function calls accumulate on the stack. Each call pushes a new stack frame into memory, containing return addresses, local variables, and function arguments. As long as functions continue calling one another without returning, these frames stack up, causing the memory usage to rise rapidly.

Because the stack has a fixed, limited size, it can hold only a finite number of frames. If the depth of nested calls becomes too large, the stack grows beyond its allocated boundary. When the program tries to create one more stack frame after the limit is reached, no space remains to store it, resulting in a stack overflow error and immediate program termination.

This issue often appears in deeply nested logic, unbounded recursion, or algorithms that require extensive call chaining. As a preventive measure, recursive functions should always have a well-defined base condition, and iterative approaches may be preferred when working with extremely large input sizes to avoid excessive stack growth.

C++

```cpp
#include <iostream>

void functionC() {
    int arr[10000];
    // some code
}

void functionB() {
    int arr[40000];
    functionC();
}

void functionA() {
    int arr[10000];
    functionB();
}

int main() {
    functionA();
}
```

Java

```java
class Main {
    static void functionD() {
        // some logic
    }

    static void functionC() {
        functionD();
    }

    static void functionB() {
        functionC();
    }

    static void functionA() {
        functionB();
    }

    public static void main(String[] args) {
        functionA();
    }
```

Typescript

```typescript
function functionD(): void {
    // some logic
}

function functionC(): void {
    functionD();
}

function functionB(): void {
    functionC();
}

function functionA(): void {
    functionB();
}

function main(): void {
    functionA();
}

main();
```

Javascript

```javascript
function functionD() {
    // some logic
}

function functionC() {
    functionD();
}

function functionB() {
    functionC();
}

function functionA() {
    functionB();
}

function main() {
    functionA();
}

main();
```

Python

```python
def function_d():
    # some logic
    pass

def function_c():
    function_d()

def function_b():
    function_c()

def function_a():
    function_b()

def main():
    function_a()

main()
```

// Diagram: Too many nested function calls leads to stack overflow

## Huge local variables

Stack overflow can also occur when a single function attempts to allocate an excessively large amount of memory for local variables. For example, declaring an array with a size in the billions, or creating multiple large variables within a function, can cause the stack frame to expand beyond the available stack space. In such cases, even a single function call can overflow the stack, as the frame itself becomes too large to fit within the process's stack memory limits.

> The list summarises the types of errors that are likely to occur with the following languages.
>
> -   **C++**: Local arrays are stored on the stack. Allocating a very large array will likely cause a stack overflow.
> -   **Java**: Arrays are objects stored on the heap. A huge allocation may result in an `OutOfMemoryError` rather than a stack overflow.
> -   **Javascript**: Arrays are stored on the heap. Extremely large arrays may lead to memory exhaustion or a `RangeError`.
> -   **Python**: Lists are stored on the heap. Huge lists typically trigger a `MemoryError`. Stack overflow only happens with deep recursion.

C++

```cpp
#include <iostream>

void functionC() {
    int arr[10000];
    // some code
}

void functionB() {
    int arr[40000];
    functionC();
}

void functionA() {
    int arr[10000];
    functionB();
}

int main() {
    functionA();
}
```

Java

```java
class Main {
    static void functionD() {
        // some logic
    }

    static void functionC() {
        functionD();
    }

    static void functionB() {
        functionC();
    }

    static void functionA() {
        functionB();
    }

    public static void main(String[] args) {
        functionA();
    }
```

Typescript

```typescript
function functionD(): void {
    // some logic
}

function functionC(): void {
    functionD();
}

function functionB(): void {
    functionC();
}

function functionA(): void {
    functionB();
}

function main(): void {
    functionA();
}

main();
```

Javascript

```javascript
function functionD() {
    // some logic
}

function functionC() {
    functionD();
}

function functionB() {
    functionC();
}

function functionA() {
    functionB();
}

function main() {
    functionA();
}

main();
```

Python

```python
def function_d():
    # some logic
    pass

def function_c():
    function_d()

def function_b():
    function_c()

def function_a():
    function_b()

def main():
    function_a()

main()
```

// Diagram: Stack overflow due to very large size of local variables

## Other possible cases

Stack overflow may also occur when both factors, deep function nesting and large local variable allocation, combine to exceed the available stack memory. Even if the call depth alone would not cause an overflow, and even if the local variables are moderately sized, the combination of many frames with significant memory usage can push the stack beyond its limit. This cumulative pressure is enough to exhaust stack space and trigger a stack overflow.

In well-designed, properly tested programs, this is the most common cause of stack overflow in the real world. It usually appears not as an immediate crash but only when edge-case inputs or heavy workloads significantly increase the recursion depth or memory usage within functions.

Recognising and accounting for this combined effect is crucial when optimising memory efficiency and ensuring program stability.

C++

```cpp
#include <iostream>

void functionC() {
    int arr[10000];
    // some code
}

void functionB() {
    int arr[40000];
    functionC();
}

void functionA() {
    int arr[10000];
    functionB();
}

int main() {
    functionA();
}
```

Java

```java
class Main {
    static void functionC() {
        int[] arr = new int[10_000];
        // some code
    }

    static void functionB() {
        int[] arr = new int[40_000];
        functionC();
    }

    static void functionA() {
        int[] arr = new int[10_000];
        functionB();
    }

    public static void main(String[] args) {
        functionA();
    }
```

Typescript

```typescript
function functionC(): void {
    let arr = new Array(10_000).fill(0);
    // some code
}

function functionB(): void {
    let arr = new Array(40_000).fill(0);
    functionC();
}

function functionA(): void {
    let arr = new Array(10_000).fill(0);
    functionB();
}

function main(): void {
    functionA();
}

main();
```

Javascript

```javascript
function functionC() {
    let arr = new Array(10_000).fill(0);
    // some code
}

function functionB() {
    let arr = new Array(40_000).fill(0);
    functionC();
}

function functionA() {
    let arr = new Array(10_000).fill(0);
    functionB();
}

function main() {
    functionA();
}

main();
```

Python

```python
def function_c():
    arr = [0] * 10_000
    # some code

def function_b():
    arr = [0] * 40_000
    function_c()

def function_a():
    arr = [0] * 10_000
    function_b()

def main():
    function_a()

main()
```

// Diagram: Every function call creates a stack frame of its own in the stack memory
