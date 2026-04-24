# 2. Array implementation of stacks

## Table of contents

1. [Structure of an array based stack](#structure-of-an-array-based-stack)
2. [Implementing the stack class using an array](#implementing-the-stack-class-using-an-array)
3. [Determining the size of the stack](#determining-the-size-of-the-stack)
4. [Checking if the stack is empty](#checking-if-the-stack-is-empty)
5. [Accessing the top of the stack](#accessing-the-top-of-the-stack)
6. [Pushing an item onto the stack](#pushing-an-item-onto-the-stack)
7. [Popping an item from the top of the stack](#popping-an-item-from-the-top-of-the-stack)
8. [Design a stack using an array](#design-a-stack-using-an-array)
9. [Design two stacks in an array](#design-two-stacks-in-an-array)

***

# Structure of an array based stack

A stack is a linear data structure that only supports push and pop operations to add and remove data items from one end of the stack. This makes the **array** the perfect candidate to implement stacks. Most use cases can be solved using a **bounded** stack with a fixed capacity and cannot grow beyond that. Since we already know the size of a bounded stack we wish to create, we can use arrays to implement it.

// Diagram: Implementation of a stack using an array

## State information

To implement a stack using an array, we also need to hold and keep up-to-date certain information about the stack alongside the array that holds all the data items. This information is necessary to ensure all stack operations work as desired. Let us look at all the state information we need to maintain.

### Top Index

The index of the data item in the array that holds the top of the stack is the `topIndex`. The value of the `topIndex` changes when data items are pushed onto and popped from the stack. It is important to make sure that the `topIndex` always stores the index of the top of the stack for the proper functioning of all the operations.

// Diagram: It is important to maintain the topIndex and make sure it has the correct value

### Size

It is important to keep track of the number of data items currently held in the stack. This value is also modified whenever data is pushed in or popped from the stack. It is important to ensure that this value is always correct and less than the total capacity of the array to prevent attempts to access memory outside the array, which is a frequent cause of program crashes. We don't need to hold the value of the size of the stack in a separate variable, as it can be derived from the value of `topIndex` in the array implementation of a stack.

// Diagram: The size of the stack is important state information that can be derived from topIndex

### Capacity

Since an array has a fixed size when implementing a stack using an array, the size of the stack is **bounded** by the size of the array. It's very important to ensure we never exceed this capacity, so we must hold this information about the array's capacity somewhere. Just like the `topIndex` variable, we use another variable, `capacity` to hold the size of the array used to implement the stack. 

// Diagram: The capacity of a stack is the size of the array used to implement it

## Representation in memory

We know that data items in an array reside in contiguous memory, so if we implement a stack as an array, all the data items in the stack will reside next to each other.

// Diagram: Stack implemented using arrays in memory

***

# Implementing the stack class using an array

As we learned earlier, when implementing a stack using an array, we always need to keep track of some state information, which is necessary to perform operations on a stack. The state information, the array, and all the operations performed on a stack can be **encapsulated in a class**. This is exactly what classes are designed to do.

// Diagram: Representation of array implementation of a stack encapsulated in a class

## Stack class

The stack class can be implemented by defining a class where all the data members are private to the class, and the operations are exposed to users as functions that manipulate the data members. We also create a parameterized constructor for the stack class to initialize it with a fixed capacity, which we store in the member variable `capacity` and dynamically create an array of the given capacity.

C++

```cpp
using namespace std;

class Stack {
public:

    // Array to store the stack elements
    int *arr;

    // Maximum capacity of the stack
    int capacity;

    // Index of the top element in the stack
    int topIndex;

    Stack(int capacity) {
        this->capacity = capacity;

        // Dynamically allocate memory for the stack array
        arr = new int[capacity];

        // Set initial top index to -1 (indicating an empty stack)
        topIndex = -1;
    }

// Diagram: int size() {}

// Diagram: bool empty() {}

// Diagram: int top() {}

// Diagram: bool push(int val) {}

    int pop() {}
};
```

Java

```java
class Stack {

    // Array to store the stack elements
    public int[] arr;

    // Maximum capacity of the stack
    public int capacity;

    // Index of the top element in the stack
    public int topIndex;

    public Stack(int capacity) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        arr = new int[capacity];

        // Set initial top index to -1 (indicating an empty stack)
        topIndex = -1;
    }

// Diagram: public int size() {}

// Diagram: public boolean empty() {}

// Diagram: public int top() {}

// Diagram: public boolean push(int val) {}

    public int pop() {}
}
```

Typescript

```typescript
export class Stack {

    // Array to store the stack elements
    arr: number[];

    // Maximum capacity of the stack
    capacity: number;

    // Index of the top element in the stack
    topIndex: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        this.arr = new Array<number>(capacity);

        // Set initial top index to -1 (indicating an empty stack)
        this.topIndex = -1;
    }

// Diagram: size(): number {}

// Diagram: empty(): boolean {}

// Diagram: top(): number {}

// Diagram: push(val: number): boolean {}

    pop(): number {}
}
```

Javascript

```javascript
export class Stack {

    // Array to store the stack elements
    arr;

    // Maximum capacity of the stack
    capacity;

    // Index of the top element in the stack
    topIndex;

    constructor(capacity) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        this.arr = new Array(capacity);

        // Set initial top index to -1 (indicating an empty stack)
        this.topIndex = -1;
    }

    size() {}

    empty() {}

    top() {}

// Diagram: push(val) {}

    pop() {}
}
```

Python

```python
from typing import Optional, List, Any

class Stack:
    def __init__(self, capacity: int) -> None:

        # Array to store the stack elements
        self.arr: List[int] = [0] * capacity

        # Maximum capacity of the stack
        self.capacity: int = capacity

        # Index of the top element in the stack
        self.top_index: int = -1

    def size(self) -> int:
        pass

    def empty(self) -> bool:
        pass

    def top(self) -> int:
        pass

    def push(self, val: int) -> bool:
        pass

    def pop(self) -> int:
        pass
```

## Using the stack class

The stack class abstracts away the implementation details in a class. Anyone who wants to use the stack data structure can instantiate an object of the stack class we defined earlier and operate upon it by calling the exposed public functions in the class. 

C++

```cpp
using namespace std;

class Stack {
public:

    // Array to store the stack elements
    int *arr;

    // Maximum capacity of the stack
    int capacity;

    // Index of the top element in the stack
    int topIndex;

    Stack(int capacity) {
        this->capacity = capacity;

        // Dynamically allocate memory for the stack array
        arr = new int[capacity];

        // Set initial top index to -1 (indicating an empty stack)
        topIndex = -1;
    }

// Diagram: int size() {}

// Diagram: bool empty() {}

// Diagram: int top() {}

// Diagram: bool push(int val) {}

    int pop() {}
};
```

Java

```java
class Stack {

    // Array to store the stack elements
    public int[] arr;

    // Maximum capacity of the stack
    public int capacity;

    // Index of the top element in the stack
    public int topIndex;

    public Stack(int capacity) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        arr = new int[capacity];

        // Set initial top index to -1 (indicating an empty stack)
        topIndex = -1;
    }

// Diagram: public int size() {}

// Diagram: public boolean empty() {}

// Diagram: public int top() {}

// Diagram: public boolean push(int val) {}

    public int pop() {}
}
```

Typescript

```typescript
export class Stack {

    // Array to store the stack elements
    arr: number[];

    // Maximum capacity of the stack
    capacity: number;

    // Index of the top element in the stack
    topIndex: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        this.arr = new Array<number>(capacity);

        // Set initial top index to -1 (indicating an empty stack)
        this.topIndex = -1;
    }

// Diagram: size(): number {}

// Diagram: empty(): boolean {}

// Diagram: top(): number {}

// Diagram: push(val: number): boolean {}

    pop(): number {}
}
```

Javascript

```javascript
export class Stack {

    // Array to store the stack elements
    arr;

    // Maximum capacity of the stack
    capacity;

    // Index of the top element in the stack
    topIndex;

    constructor(capacity) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        this.arr = new Array(capacity);

        // Set initial top index to -1 (indicating an empty stack)
        this.topIndex = -1;
    }

    size() {}

    empty() {}

    top() {}

// Diagram: push(val) {}

    pop() {}
}
```

Python

```python
from typing import Optional, List, Any

class Stack:
    def __init__(self, capacity: int) -> None:

        # Array to store the stack elements
        self.arr: List[int] = [0] * capacity

        # Maximum capacity of the stack
        self.capacity: int = capacity

        # Index of the top element in the stack
        self.top_index: int = -1

    def size(self) -> int:
        pass

    def empty(self) -> bool:
        pass

    def top(self) -> int:
        pass

    def push(self, val: int) -> bool:
        pass

    def pop(self) -> int:
        pass
```

Let's examine what happens when the code is executed to understand better how encapsulating all the data and state information needed to implement a stack, along with the array and all the operations in a stack class, is useful.

// Diagram: Execution of code using an instance (object) of the stack class

Now that we know what the array implementation of a stack looks like and how it functions, we will learn more about the implementation of each function in the coming lessons.

***

# Determining the size of the stack

The size operation tells the caller about the current size of the stack. Since **`topIndex`** is the index of the last item inserted in the stack, **`topIndex + 1`** is the current size of the stack.

// Diagram: Size of a stack can be calculated using the topIndex

## Algorithm

// Diagram: The size operation in a stack class implemented using an array can be summarized as the following algorithm

> **Algorithm:**
>
> -   **Step 1:** Return the value of \`topIndex\` + \`1\`.

## Implementation

// Diagram: The implementation is a quite simple one-line statement returning topIndex + 1

C++

```cpp
using namespace std;

class Stack {
public:

    // Array to store the stack elements
    int *arr;

    // Maximum capacity of the stack
    int capacity;

    // Index of the top element in the stack
    int topIndex;

    Stack(int capacity) {
        this->capacity = capacity;

        // Dynamically allocate memory for the stack array
        arr = new int[capacity];

        // Set initial top index to -1 (indicating an empty stack)
        topIndex = -1;
    }

// Diagram: int size() {

        // Size of the stack is the index of the top element plus 1
        return topIndex + 1;
    }
};
```

Java

```java
class Stack {

    // Array to store the stack elements
    public int[] arr;

    // Maximum capacity of the stack
    public int capacity;

    // Index of the top element in the stack
    public int topIndex;

    public Stack(int capacity) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        arr = new int[capacity];

        // Set initial top index to -1 (indicating an empty stack)
        topIndex = -1;
    }

// Diagram: public int size() {

        // Size of the stack is the index of the top element plus 1
        return topIndex + 1;
    }
```

Typescript

```typescript
export class Stack {

    // Array to store the stack elements
    arr: number[];

    // Maximum capacity of the stack
    capacity: number;

    // Index of the top element in the stack
    topIndex: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        this.arr = new Array<number>(capacity);

        // Set initial top index to -1 (indicating an empty stack)
        this.topIndex = -1;
    }

// Diagram: size(): number {

        // Size of the stack is the index of the top element plus 1
        return this.topIndex + 1;
    }
```

Javascript

```javascript
export class Stack {

    // Array to store the stack elements
    arr;

    // Maximum capacity of the stack
    capacity;

    // Index of the top element in the stack
    topIndex;

    constructor(capacity) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        this.arr = new Array(capacity);

        // Set initial top index to -1 (indicating an empty stack)
        this.topIndex = -1;
    }

    size() {

        // Size of the stack is the index of the top element plus 1
        return this.topIndex + 1;
    }
```

Python

```python
from typing import Optional, List, Any

class Stack:
    def __init__(self, capacity: int) -> None:

        # Array to store the stack elements
        self.arr: List[int] = [0] * capacity

        # Maximum capacity of the stack
        self.capacity: int = capacity

        # Index of the top element in the stack
        self.top_index: int = -1

    def size(self) -> int:

        # Size of the stack is the index of the top element plus 1
        return self.top_index + 1
```

## Complexity Analysis

Since we only return the value of  `topIndex + 1`. Both the space and time complexities are constant.

> **Best Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**

***

# Checking if the stack is empty

As the name suggests, this operation tells the caller if the stack is empty or some items are already in it. It will return `true` if the stack is empty and `false` otherwise. We can check if the stack size equals `0` to implement this operation.

// Diagram: Operation to check if the stack is empty

## Algorithm

// Diagram: The empty operation in a stack class implemented using an array can be summarized as the following algorithm

> **Algorithm:**
>
> -   **Step 1:** Return \`true\` if the size of the stack is equal to \`0\`, otherwise, return \`false\`.

## Implementation

// Diagram: The implementation is quite simple line statement returning true if size() == 0, false otherwise

C++

```cpp
using namespace std;

class Stack {
public:

    // Array to store the stack elements
    int *arr;

    // Maximum capacity of the stack
    int capacity;

    // Index of the top element in the stack
    int topIndex;

    Stack(int capacity) {
        this->capacity = capacity;

        // Dynamically allocate memory for the stack array
        arr = new int[capacity];

        // Set initial top index to -1 (indicating an empty stack)
        topIndex = -1;
    }

// Diagram: int size() {

        // Size of the stack is the index of the top element plus 1
        return topIndex + 1;
    }

// Diagram: bool empty() {

        // If top index is -1, the stack is empty
        return topIndex == -1;
    }
};
```

Java

```java
class Stack {

    // Array to store the stack elements
    public int[] arr;

    // Maximum capacity of the stack
    public int capacity;

    // Index of the top element in the stack
    public int topIndex;

    public Stack(int capacity) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        arr = new int[capacity];

        // Set initial top index to -1 (indicating an empty stack)
        topIndex = -1;
    }

// Diagram: public int size() {

        // Size of the stack is the index of the top element plus 1
        return topIndex + 1;
    }

// Diagram: public boolean empty() {

        // If top index is -1, the stack is empty
        return topIndex == -1;
    }
```

Typescript

```typescript
export class Stack {

    // Array to store the stack elements
    arr: number[];

    // Maximum capacity of the stack
    capacity: number;

    // Index of the top element in the stack
    topIndex: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        this.arr = new Array<number>(capacity);

        // Set initial top index to -1 (indicating an empty stack)
        this.topIndex = -1;
    }

// Diagram: size(): number {

        // Size of the stack is the index of the top element plus 1
        return this.topIndex + 1;
    }

// Diagram: empty(): boolean {

        // If top index is -1, the stack is empty
        return this.topIndex === -1;
    }
```

Javascript

```javascript
export class Stack {

    // Array to store the stack elements
    arr;

    // Maximum capacity of the stack
    capacity;

    // Index of the top element in the stack
    topIndex;

    constructor(capacity) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        this.arr = new Array(capacity);

        // Set initial top index to -1 (indicating an empty stack)
        this.topIndex = -1;
    }

    size() {

        // Size of the stack is the index of the top element plus 1
        return this.topIndex + 1;
    }

    empty() {

        // If top index is -1, the stack is empty
        return this.topIndex === -1;
    }
```

Python

```python
from typing import Optional, List, Any

class Stack:
    def __init__(self, capacity: int) -> None:

        # Array to store the stack elements
        self.arr: List[int] = [0] * capacity

        # Maximum capacity of the stack
        self.capacity: int = capacity

        # Index of the top element in the stack
        self.top_index: int = -1

    def size(self) -> int:

        # Size of the stack is the index of the top element plus 1
        return self.top_index + 1

    def empty(self) -> bool:

        # If top index is -1, the stack is empty
        return self.top_index == -1
```

## Complexity Analysis

The function internally calls the `size()` function and returns a value based on the result, so the complexity is the same as that of the `size()` function i.e **O(1)**.

> **Best Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**

***

# Accessing the top of the stack

The **top** operation is one of the most widely used stack operations. It just returns the value stored at the **`topIndex`** of the stack. We always store the index of the top item of the stack in the array implementation, and for this operation, we need to return that index's value to the user. We have two cases to consider here.

## 1\. Stack is empty

We can return `-1` to indicate that there are no items in the stack. Ideally, we should be throwing an error, but for the sake of simplicity here, we return `-1`

// Diagram: Empty stack does not have a top element

> **Algorithm**
>
> -   **Step 1:** If the stack is empty, return \`-1\` to indicate that there is no top element.

## 2\. Stack is not empty

If the stack is not empty, we return the value at the `topIndex`.

// Diagram: The value at the top index in the array is the top of the stack

// Diagram: The top operation in a stack class implemented using an array can be summarized as the following algorithm

> **Algorithm**
>
> -   **Step 1:** If the stack is not empty, return the value stored at \`topIndex\` of the internal array.

## Implementation

The implementation is quite simple. We write all the cases in conditional blocks to implement the **top** operation.

C++

```cpp
using namespace std;

class Stack {
public:

    // Array to store the stack elements
    int *arr;

    // Maximum capacity of the stack
    int capacity;

    // Index of the top element in the stack
    int topIndex;

    Stack(int capacity) {
        this->capacity = capacity;

        // Dynamically allocate memory for the stack array
        arr = new int[capacity];

        // Set initial top index to -1 (indicating an empty stack)
        topIndex = -1;
    }

// Diagram: int size() {

        // Size of the stack is the index of the top element plus 1
        return topIndex + 1;
    }

// Diagram: bool empty() {

        // If top index is -1, the stack is empty
        return topIndex == -1;
    }

    int top() {
        if (empty()) {

            // Return -1 if the stack is empty
            return -1;
        }

        // Return the element at the top index of the stack
        return arr[topIndex];
    }
};
```

Java

```java
class Stack {

    // Array to store the stack elements
    public int[] arr;

    // Maximum capacity of the stack
    public int capacity;

    // Index of the top element in the stack
    public int topIndex;

    public Stack(int capacity) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        arr = new int[capacity];

        // Set initial top index to -1 (indicating an empty stack)
        topIndex = -1;
    }

// Diagram: public int size() {

        // Size of the stack is the index of the top element plus 1
        return topIndex + 1;
    }

// Diagram: public boolean empty() {

        // If top index is -1, the stack is empty
        return topIndex == -1;
    }

    public int top() {
        if (empty()) {

            // Return -1 if the stack is empty
            return -1;
        }

        // Return the element at the top index of the stack
        return arr[topIndex];
    }
```

Typescript

```typescript
export class Stack {

    // Array to store the stack elements
    arr: number[];

    // Maximum capacity of the stack
    capacity: number;

    // Index of the top element in the stack
    topIndex: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        this.arr = new Array<number>(capacity);

        // Set initial top index to -1 (indicating an empty stack)
        this.topIndex = -1;
    }

// Diagram: size(): number {

        // Size of the stack is the index of the top element plus 1
        return this.topIndex + 1;
    }

// Diagram: empty(): boolean {

        // If top index is -1, the stack is empty
        return this.topIndex === -1;
    }

    top(): number {
        if (this.empty()) {

            // Return -1 if the stack is empty
            return -1;
        }

        // Return the element at the top index of the stack
        return this.arr[this.topIndex];
    }
```

Javascript

```javascript
export class Stack {

    // Array to store the stack elements
    arr;

    // Maximum capacity of the stack
    capacity;

    // Index of the top element in the stack
    topIndex;

    constructor(capacity) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        this.arr = new Array(capacity);

        // Set initial top index to -1 (indicating an empty stack)
        this.topIndex = -1;
    }

    size() {

        // Size of the stack is the index of the top element plus 1
        return this.topIndex + 1;
    }

    empty() {

        // If top index is -1, the stack is empty
        return this.topIndex === -1;
    }

    top() {
        if (this.empty()) {

            // Return -1 if the stack is empty
            return -1;
        }

        // Return the element at the top index of the stack
        return this.arr[this.topIndex];
    }
```

Python

```python
from typing import Optional, List, Any

class Stack:
    def __init__(self, capacity: int) -> None:

        # Array to store the stack elements
        self.arr: List[int] = [0] * capacity

        # Maximum capacity of the stack
        self.capacity: int = capacity

        # Index of the top element in the stack
        self.top_index: int = -1

    def size(self) -> int:

        # Size of the stack is the index of the top element plus 1
        return self.top_index + 1

    def empty(self) -> bool:

        # If top index is -1, the stack is empty
        return self.top_index == -1

    def top(self) -> int:
        if self.empty():

            # Return -1 if the stack is empty
            return -1

        # Return the element at the top index of the stack
        return self.arr[self.top_index]
```

## Complexity Analysis

We call the `empty()` function, and based on that, we return a value. If the stack is not empty, we return the value at the `topIndex` of the internal array, and so the complexity will be the same as that of the `empty()` function i.e. **O(1)**.

> **Best Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**

***

# Pushing an item onto the stack

The push operation inserts a data item at the **top** of the stack. Insertion only happens after ensuring that we do not exceed the **capacity** constraint of the stack. The algorithm to push a value at the top of the stack is quite simple. Let us look at the possible cases we need to consider

## 1\. Stack is full

Since the stack is full, we cannot add more items without removing items first. We will return `false` as this operation cannot be done.

// Diagram: Cannot push data onto the stack if it is full

> **Algorithm**
>
> -   **Step 1:** If the stack is full, return \`false\` to indicate that the operation was unsuccessful.

## 2\. Stack is not full

In this case, we first need to increment the `topIndex` by one to move it to the next empty index in the array and add the value to that index. Doing this automatically also updates our `topIndex`. After that, we need to increase the `size` by 1.

// Diagram: Push data onto the stack when stack is not full

The push operation in a stack class implemented using an array can be summarized as the following algorithm.

> **Algorithm**
>
> -   **Step 1:** If the stack is not full, increment the \`topIndex\` by \`1\`.
> -   **Step 2:** Store the new value at the incremented \`topIndex\` of the internal array.
> -   **Step 3:** Return \`true\` to indicate that the operation was successful.

## Implementation

The implementation is quite simple. We write all the cases in conditional blocks to implement the push operation.

C++

```cpp
using namespace std;

class Stack {
public:

    // Array to store the stack elements
    int *arr;

    // Maximum capacity of the stack
    int capacity;

    // Index of the top element in the stack
    int topIndex;

    Stack(int capacity) {
        this->capacity = capacity;

        // Dynamically allocate memory for the stack array
        arr = new int[capacity];

        // Set initial top index to -1 (indicating an empty stack)
        topIndex = -1;
    }

// Diagram: int size() {

        // Size of the stack is the index of the top element plus 1
        return topIndex + 1;
    }

// Diagram: bool empty() {

        // If top index is -1, the stack is empty
        return topIndex == -1;
    }

    int top() {
        if (empty()) {

            // Return -1 if the stack is empty
            return -1;
        }

        // Return the element at the top index of the stack
        return arr[topIndex];
    }

    bool push(int val) {
        if (topIndex == capacity - 1) {

            // Return false if the stack is already full
            return false;
        }

        // Increment top index and add the val to the new top position
        arr[++topIndex] = val;

        // Return true to indicate successful push operation
        return true;
    }
};
```

Java

```java
class Stack {

    // Array to store the stack elements
    public int[] arr;

    // Maximum capacity of the stack
    public int capacity;

    // Index of the top element in the stack
    public int topIndex;

    public Stack(int capacity) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        arr = new int[capacity];

        // Set initial top index to -1 (indicating an empty stack)
        topIndex = -1;
    }

// Diagram: public int size() {

        // Size of the stack is the index of the top element plus 1
        return topIndex + 1;
    }

// Diagram: public boolean empty() {

        // If top index is -1, the stack is empty
        return topIndex == -1;
    }

    public int top() {
        if (empty()) {

            // Return -1 if the stack is empty
            return -1;
        }

        // Return the element at the top index of the stack
        return arr[topIndex];
    }

    public boolean push(int val) {
        if (topIndex == capacity - 1) {

            // Return false if the stack is already full
            return false;
        }

        // Increment top index and add the val to the new top position
        arr[++topIndex] = val;

        // Return true to indicate successful push operation
        return true;
    }
```

Typescript

```typescript
export class Stack {

    // Array to store the stack elements
    arr: number[];

    // Maximum capacity of the stack
    capacity: number;

    // Index of the top element in the stack
    topIndex: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        this.arr = new Array<number>(capacity);

        // Set initial top index to -1 (indicating an empty stack)
        this.topIndex = -1;
    }

// Diagram: size(): number {

        // Size of the stack is the index of the top element plus 1
        return this.topIndex + 1;
    }

// Diagram: empty(): boolean {

        // If top index is -1, the stack is empty
        return this.topIndex === -1;
    }

    top(): number {
        if (this.empty()) {

            // Return -1 if the stack is empty
            return -1;
        }

        // Return the element at the top index of the stack
        return this.arr[this.topIndex];
    }

    push(val: number): boolean {
        if (this.topIndex === this.capacity - 1) {

            // Return false if the stack is already full
            return false;
        }

        // Increment top index and add the val to the new top position
        this.arr[++this.topIndex] = val;

        // Return true to indicate successful push operation
        return true;
    }
```

Javascript

```javascript
export class Stack {

    // Array to store the stack elements
    arr;

    // Maximum capacity of the stack
    capacity;

    // Index of the top element in the stack
    topIndex;

    constructor(capacity) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        this.arr = new Array(capacity);

        // Set initial top index to -1 (indicating an empty stack)
        this.topIndex = -1;
    }

    size() {

        // Size of the stack is the index of the top element plus 1
        return this.topIndex + 1;
    }

    empty() {

        // If top index is -1, the stack is empty
        return this.topIndex === -1;
    }

    top() {
        if (this.empty()) {

            // Return -1 if the stack is empty
            return -1;
        }

        // Return the element at the top index of the stack
        return this.arr[this.topIndex];
    }

    push(val) {
        if (this.topIndex === this.capacity - 1) {

            // Return false if the stack is already full
            return false;
        }

        // Increment top index and add the val to the new top position
        this.arr[++this.topIndex] = val;

        // Return true to indicate successful push operation
        return true;
    }
```

Python

```python
from typing import Optional, List, Any

class Stack:
    def __init__(self, capacity: int) -> None:

        # Array to store the stack elements
        self.arr: List[int] = [0] * capacity

        # Maximum capacity of the stack
        self.capacity: int = capacity

        # Index of the top element in the stack
        self.top_index: int = -1

    def size(self) -> int:

        # Size of the stack is the index of the top element plus 1
        return self.top_index + 1

    def empty(self) -> bool:

        # If top index is -1, the stack is empty
        return self.top_index == -1

    def top(self) -> int:
        if self.empty():

            # Return -1 if the stack is empty
            return -1

        # Return the element at the top index of the stack
        return self.arr[self.top_index]

    def push(self, val: int) -> bool:
        if self.top_index == self.capacity - 1:

            # Return False if the stack is already full
            return False

        # Increment top index and add the val to the new top position
        self.top_index += 1
        self.arr[self.top_index] = val

        # Return True to indicate successful push operation
        return True
```

## Complexity Analysis

We add a new item at a known array index and do not allocate any new memory for this push operation, so its time and space complexity are constant.

> **Best Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**

***

# Popping an item from the top of the stack

The pop operation removes the **top** item from the stack and returns its value. After removing the item from the top, the internal `topIndex` is also updated so that the second last item now becomes the new top of the stack. The algorithm to remove the top of the stack is quite simple. Let us look at the possible cases we need to consider.

## 1\. Stack is empty

We return `-1`here to indicate this is an invalid operation, as no item is at the top of the stack.

// Diagram: Cannot pop data from an empty stack

> **Algorithm**
>
> -   **Step 1:** If the stack is empty, return \`-1\` to indicate that the operation was unsuccessful.

## 2\. Stack is not empty

In this case, we need to get the item stored at the `topIndex` in a variable and then decrease the value of `topIndex` by 1. Finally, we return the value of the old top. 

// Diagram: Pop data from a non empty the stack

> **Algorithm**
>
> -   **Step 1:** If the stack is not empty, store the value of the element at the \`topIndex\` of the internal array in a temporary variable.
> -   **Step 2:** Decrement the \`topIndex\` by \`1\`.
> -   **Step 3**: Return the value stored in the temporary variable.

**Why don't we delete the data in the array and update the value of topIndex?**

We don't need to delete the old top after decrementing the value of `topIndex` because the stack only consists of data between the **0th** index and the `topIndex` in the array. Any data outside it is never accessed and overwritten as the stack grows.

## Implementation

The implementation is quite simple. We write all the cases in conditional blocks to implement the pop operation.

C++

```cpp
using namespace std;

class Stack {
public:

    // Array to store the stack elements
    int *arr;

    // Maximum capacity of the stack
    int capacity;

    // Index of the top element in the stack
    int topIndex;

    Stack(int capacity) {
        this->capacity = capacity;

        // Dynamically allocate memory for the stack array
        arr = new int[capacity];

        // Set initial top index to -1 (indicating an empty stack)
        topIndex = -1;
    }

// Diagram: int size() {

        // Size of the stack is the index of the top element plus 1
        return topIndex + 1;
    }

// Diagram: bool empty() {

        // If top index is -1, the stack is empty
        return topIndex == -1;
    }

    int top() {
        if (empty()) {

            // Return -1 if the stack is empty
            return -1;
        }

        // Return the element at the top index of the stack
        return arr[topIndex];
    }

    bool push(int val) {
        if (topIndex == capacity - 1) {

            // Return false if the stack is already full
            return false;
        }

        // Increment top index and add the val to the new top position
        arr[++topIndex] = val;

        // Return true to indicate successful push operation
        return true;
    }

    int pop() {
        if (empty()) {

            // Return -1 if the stack is empty (nothing to pop)
            return -1;
        }

        // Return the element at the top index and decrement top index
        return arr[topIndex--];
    }
};
```

Java

```java
class Stack {

    // Array to store the stack elements
    public int[] arr;

    // Maximum capacity of the stack
    public int capacity;

    // Index of the top element in the stack
    public int topIndex;

    public Stack(int capacity) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        arr = new int[capacity];

        // Set initial top index to -1 (indicating an empty stack)
        topIndex = -1;
    }

// Diagram: public int size() {

        // Size of the stack is the index of the top element plus 1
        return topIndex + 1;
    }

// Diagram: public boolean empty() {

        // If top index is -1, the stack is empty
        return topIndex == -1;
    }

    public int top() {
        if (empty()) {

            // Return -1 if the stack is empty
            return -1;
        }

        // Return the element at the top index of the stack
        return arr[topIndex];
    }

    public boolean push(int val) {
        if (topIndex == capacity - 1) {

            // Return false if the stack is already full
            return false;
        }

        // Increment top index and add the val to the new top position
        arr[++topIndex] = val;

        // Return true to indicate successful push operation
        return true;
    }

    public int pop() {
        if (empty()) {

            // Return -1 if the stack is empty (nothing to pop)
            return -1;
        }

        // Return the element at the top index and decrement top index
        return arr[topIndex--];
    }
```

Typescript

```typescript
export class Stack {

    // Array to store the stack elements
    arr: number[];

    // Maximum capacity of the stack
    capacity: number;

    // Index of the top element in the stack
    topIndex: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        this.arr = new Array<number>(capacity);

        // Set initial top index to -1 (indicating an empty stack)
        this.topIndex = -1;
    }

// Diagram: size(): number {

        // Size of the stack is the index of the top element plus 1
        return this.topIndex + 1;
    }

// Diagram: empty(): boolean {

        // If top index is -1, the stack is empty
        return this.topIndex === -1;
    }

    top(): number {
        if (this.empty()) {

            // Return -1 if the stack is empty
            return -1;
        }

        // Return the element at the top index of the stack
        return this.arr[this.topIndex];
    }

    push(val: number): boolean {
        if (this.topIndex === this.capacity - 1) {

            // Return false if the stack is already full
            return false;
        }

        // Increment top index and add the val to the new top position
        this.arr[++this.topIndex] = val;

        // Return true to indicate successful push operation
        return true;
    }

    pop(): number {
        if (this.empty()) {

            // Return -1 if the stack is empty (nothing to pop)
            return -1;
        }

        // Return the element at the top index and decrement top index
        return this.arr[this.topIndex--];
    }
```

Javascript

```javascript
export class Stack {

    // Array to store the stack elements
    arr;

    // Maximum capacity of the stack
    capacity;

    // Index of the top element in the stack
    topIndex;

    constructor(capacity) {
        this.capacity = capacity;

        // Dynamically allocate memory for the stack array
        this.arr = new Array(capacity);

        // Set initial top index to -1 (indicating an empty stack)
        this.topIndex = -1;
    }

    size() {

        // Size of the stack is the index of the top element plus 1
        return this.topIndex + 1;
    }

    empty() {

        // If top index is -1, the stack is empty
        return this.topIndex === -1;
    }

    top() {
        if (this.empty()) {

            // Return -1 if the stack is empty
            return -1;
        }

        // Return the element at the top index of the stack
        return this.arr[this.topIndex];
    }

    push(val) {
        if (this.topIndex === this.capacity - 1) {

            // Return false if the stack is already full
            return false;
        }

        // Increment top index and add the val to the new top position
        this.arr[++this.topIndex] = val;

        // Return true to indicate successful push operation
        return true;
    }

    pop() {
        if (this.empty()) {

            // Return -1 if the stack is empty (nothing to pop)
            return -1;
        }

        // Return the element at the top index and decrement top index
        return this.arr[this.topIndex--];
    }
```

Python

```python
from typing import Optional, List, Any

class Stack:
    def __init__(self, capacity: int) -> None:

        # Array to store the stack elements
        self.arr: List[int] = [0] * capacity

        # Maximum capacity of the stack
        self.capacity: int = capacity

        # Index of the top element in the stack
        self.top_index: int = -1

    def size(self) -> int:

        # Size of the stack is the index of the top element plus 1
        return self.top_index + 1

    def empty(self) -> bool:

        # If top index is -1, the stack is empty
        return self.top_index == -1

    def top(self) -> int:
        if self.empty():

            # Return -1 if the stack is empty
            return -1

        # Return the element at the top index of the stack
        return self.arr[self.top_index]

    def push(self, val: int) -> bool:
        if self.top_index == self.capacity - 1:

            # Return False if the stack is already full
            return False

        # Increment top index and add the val to the new top position
        self.top_index += 1
        self.arr[self.top_index] = val

        # Return True to indicate successful push operation
        return True

    def pop(self) -> int:
        if self.empty():

            # Return -1 if the stack is empty (nothing to pop)
            return -1

        # Return the element at the top index and decrement top index
        val = self.arr[self.top_index]
        self.top_index -= 1
        return val
```

## Complexity Analysis

Since we do no other operation other than calling the `empty()` and `top()` functions which are **O(1)** in both time and space, our `pop()` operation is also **O(1)**.

> **Best Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**

***

# Design a stack using an array

## Problem Statement

Given the skeleton of a **Stack class**, complete this class by implementing all the stack operations below.

> -   **Stack(int capacity)** - Initializes the Stack object with the given capacity.
> -   **size()** - Returns the current size of the stack.
> -   **empty()** - Returns \`true\` if the stack is empty, and \`false\` if it is not.
> -   **top()** - Returns the element at the top of the stack. If the stack is empty, returns \`-1\`.
> -   **push(int val)** - Pushes the given value onto the stack and returns \`true\` if the operation was successful. Returns \`false\` if the stack is full.
> -   **pop()** - Pops the top element from the stack and returns its value. If the stack is empty, returns \`-1\`.

You must abide by the following constraints.

1\. Use an **array as the internal data structure** to store data and implement this class.

// Diagram: Implementation of a stack using array

> The input should adhere to the following rules:
>
> 1.  The input should contain two arrays of the same size.
> 2.  The first array should contain the list of operations, while the second should contain the corresponding operands for those operations.
> 3.  The first index in the first array should contain **Stack**, and the first index in the second array should contain a single positive integer representing the capacity of the stack. This value is used to initialise the stack.
> 4.  For each index in the first array that contains the **push** operation, the corresponding index in the second array should contain the value that needs to be pushed.
> 5.  For each index in the first array that contains **pop**, **empty**, **top**, or **size** operations, the corresponding index in the second array should contain an empty array.
>
> **Example:**
>
> -   **Input:** \[Stack, push, push, top, empty, pop, top, push, push, empty\] \[\[2\], \[2\], \[3\], \[\], \[\], \[\], \[\], \[8\], \[9\], \[\]\]
>
> -   **Output:** \[null, true, true, 3, false, 3, 2, true, false, false\]
>
> **Explanation:**
>
> **Operation:** Stack stack = new Stack(2) **Result:** Initializes an empty \`Stack\` with a capacity of 2
>
> **Operation:** stack.push(2) **Result:** \`stack = \[2\]\`, returns \`true\`
>
> **Operation:** stack.push(3) **Result:** \`stack = \[3, 2\]\`, returns \`true\`
>
> **Operation:** stack.top() **Result:** \`stack = \[3, 2\]\`, returns \`3\`
>
> **Operation:** stack.empty() **Result:** \`stack = \[3, 2\]\`, returns \`false\`
>
> **Operation:** stack.pop() **Result:** \`stack = \[2\]\`, returns \`3\`
>
> **Operation:** stack.top() **Result:** \`stack = \[2\]\`, returns \`2\`
>
> **Operation:** stack.push(8) **Result:** \`stack = \[8, 2\]\`, returns \`true\`
>
> **Operation:** stack.push(9) **Result:** \`stack = \[8, 2\]\`, stack is full, returns \`false\`
>
> **Operation:** stack.empty() **Result:** \`stack = \[8, 2\]\`, returns \`false\`

## Solution

```cpp
using namespace std;

class Stack {
public:

    // Array to store the stack elements
    int *arr;

    // Maximum capacity of the stack
    int capacity;

    // Index of the top element in the stack
    int topIndex;

    Stack(int capacity) {
        this->capacity = capacity;

        // Dynamically allocate memory for the stack array
        arr = new int[capacity];

        // Set initial top index to -1 (indicating an empty stack)
        topIndex = -1;
    }

    int size() {

        // Size of the stack is the index of the top element plus 1
        return topIndex + 1;
    }

    bool empty() {

        // If top index is -1, the stack is empty
        return topIndex == -1;
    }

    int top() {
        if (empty()) {

            // Return -1 if the stack is empty
            return -1;
        }

        // Return the element at the top index of the stack
        return arr[topIndex];
    }

    bool push(int val) {
        if (topIndex == capacity - 1) {

            // Return false if the stack is already full
            return false;
        }

        // Increment top index and add the val to the new top position
        arr[++topIndex] = val;

        // Return true to indicate successful push operation
        return true;
    }

    int pop() {
        if (empty()) {

            // Return -1 if the stack is empty (nothing to pop)
            return -1;
        }

        // Return the element at the top index and decrement top index
        return arr[topIndex--];
    }
};
```

***

# Design two stacks in an array

## Problem Statement

Given the skeleton of a **TwoStack class** that supports two stacks internally using a single array, complete this class by implementing all the stack operations below. 

> -   **TwoStack(int capacity)** - Initializes the TwoStack object with the given capacity, which represents the total capacity of both stacks. Both stacks must share the same capacity. If it is not feasible for both internal stacks to be of equal size, the first stack should have a greater capacity than the second stack.
> -   **top1()** - Returns the element at the top of the first stack. If the stack is empty, it returns \`-1\`.
> -   **top2()** - Returns the element at the top of the second stack. If the stack is empty, it returns \`-1\`.
> -   **push1(int val)** - Pushes the given value onto the first stack and returns \`true\` if the operation is successful. It returns \`false\` if the stack is full.
> -   **push2(int val)** - Pushes the given value onto the second stack and returns \`true\` if the operation is successful. It returns \`false\` if the stack is full.
> -   **pop1()** - Pops the top element from the first stack and returns its value. If the stack is empty, it returns \`-1\`.
> -   **pop2()** - Pops the top element from the second stack and returns its value. If the stack is empty, it returns \`-1\`.

// Diagram: You must abide by the following constraints

1\. Use a **single array** to implement both stacks. 

> The input should adhere to the following rules:
>
> 1.  The input should contain two arrays of the same size.
> 2.  The first array should contain the list of operations, while the second should contain the corresponding operands for those operations.
> 3.  The first index in the first array should contain **TwoStack**, and the first index in the second array should contain a single positive integer representing the capacity of the stack. This value is used to initialise the stack.
> 4.  For each index in the first array that contains **push1**, or **push2** operations, the corresponding index in the second array should contain the value that needs to be pushed.
> 5.  For each index in the first array that contains **pop1**, **top1**, **pop2**, or **top2** operations, the corresponding index in the second array should contain an empty array.
>
> **Example:**
>
> -   **Input:** \[TwoStack, push1, push2, pop1, pop2, top1, top2, push1, push1, top1\] \[\[6\], \[2\], \[3\], \[\], \[\], \[\], \[\], \[8\], \[9\], \[\]\]
>
> -   **Output:** \[null, true, true, 2, 3, -1, -1, true, true, 9\]
>
> **Explanation:**
>
> **Operation:** TwoStack twoStack = new TwoStack(6) **Result:** Initializes an empty \`TwoStack\` with a capacity of 6
>
> **Operation:** twoStack.push1(2) **Result:** \`stack1 = \[2\]\`, \`stack2 = \[\]\` returns \`true\`
>
> **Operation:** twoStack.push2(3) **Result:** \`stack1 = \[2\]\`, \`stack2 = \[3\]\` returns \`true\`
>
> **Operation:** twoStack.pop1() **Result:** \`stack1 = \[\]\`, \`stack2 = \[3\]\` returns \`2\`
>
> **Operation:** twoStack.pop2() **Result:** \`stack1 = \[\]\`, \`stack2 = \[\]\` returns \`3\`
>
> **Operation:** twoStack.top1() **Result:** \`stack1 = \[\]\`, \`stack2 = \[\]\` returns \`-1\`
>
> **Operation:** twoStack.top2() **Result:** \`stack1 = \[\]\`, \`stack2 = \[\]\` returns \`-1\`
>
> **Operation:** twoStack.push1(8) **Result:** \`stack1 = \[8\]\`, \`stack2 = \[\]\` returns \`true\`
>
> **Operation:** twoStack.push1(9) **Result:** \`stack1 = \[9, 8\]\`, \`stack2 = \[\]\` returns \`true\`
>
> **Operation:** twoStack.top1() **Result:** \`stack1 = \[9, 8\]\`, \`stack2 = \[\]\` returns \`9\`

## Solution

```cpp
using namespace std;

class TwoStack {
public:

    // Array to store elements
    int *arr;

    // Capacity of the array
    int capacity;

    // Top index of the first stack
    int topIndex1;

    // Top index of the second stack
    int topIndex2;

    TwoStack(int capacity) {
        this->capacity = capacity;
        arr = new int[capacity];

        // Initialize top index of the first stack as -1 (empty)
        topIndex1 = -1;

        // Initialize top index of the second stack as capacity (empty)
        topIndex2 = capacity;
    }

    int top1() {
        if (topIndex1 == -1) {

            // Stack 1 is empty, return -1
            return -1;
        }

        // Return the element at the top of Stack 1
        return arr[topIndex1];
    }

    int top2() {
        if (topIndex2 == capacity) {

            // Stack 2 is empty, return -1
            return -1;
        }

        // Return the element at the top of Stack 2
        return arr[topIndex2];
    }

    bool push1(int val) {
        if (topIndex1 + 1 >= topIndex2) {

            // Stack 1 is full, cannot push more elements
            return false;
        }

        // Increment top index of Stack 1 and assign val to that position
        arr[++topIndex1] = val;

        // Push operation was successful
        return true;
    }

    bool push2(int val) {
        if (topIndex2 - 1 <= topIndex1) {

            // Stack 2 is full, cannot push more elements
            return false;
        }

        // Decrement top index of Stack 2 and assign val to that position
        arr[--topIndex2] = val;

        // Push operation was successful
        return true;
    }

    int pop1() {
        if (topIndex1 == -1) {

            // Stack 1 is empty, cannot pop any element
            return -1;
        }

        // Return the element at the top of Stack 1 and decrement top
        // index
        return arr[topIndex1--];
    }

    int pop2() {
        if (topIndex2 == capacity) {

            // Stack 2 is empty, cannot pop any element
            return -1;
        }

        // Return the element at the top of Stack 2 and increment top
        // index
        return arr[topIndex2++];
    }
};
```
