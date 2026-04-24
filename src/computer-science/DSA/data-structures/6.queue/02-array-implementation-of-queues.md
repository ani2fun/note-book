# 2. Array implementation of queues

## Table of contents

1. [Structure of an array based queue](#structure-of-an-array-based-queue)
2. [Cyclic nature of array based queues](#cyclic-nature-of-array-based-queues)
3. [Implementing the queue class using an array](#implementing-the-queue-class-using-an-array)
4. [Determining the size of the queue](#determining-the-size-of-the-queue)
5. [Checking if the queue is empty](#checking-if-the-queue-is-empty)
6. [Accessing the front of the queue](#accessing-the-front-of-the-queue)
7. [Accessing the back of the queue](#accessing-the-back-of-the-queue)
8. [Enqueuing an item in the queue](#enqueuing-an-item-in-the-queue)
9. [Dequeuing an item from the queue](#dequeuing-an-item-from-the-queue)
10. [Design a queue using circular array](#design-a-queue-using-circular-array)

***

# Structure of an array based queue

A queue is a linear data structure that only supports enqueue and dequeue operations to add and remove data items from the **ends** of the queue. This makes the array the perfect candidate to implement a queue. Most use cases can be solved using a **bounded** queue with a fixed size and cannot grow beyond that. Since we already know the queue size when creating it, we can use arrays to implement it.

// Diagram: Implementation of a queue using an array

## State information

To implement a queue using an array, we must keep current information about the queue alongside the array that holds all the data items. This information is necessary to ensure all queue operations work as desired. Let us look at all the state information we need to maintain.

### Front index

The index of the data item in the array that holds the **front** of the queue is the `frontIndex`. The value of the `frontIndex` changes when data items are **dequeued** from the queue. It is important to ensure that the `frontIndex` always store the index of the front of the queue for the proper functioning of all the operations.

// Diagram: It is important to maintain the frontIndex and make sure it has the correct value

### Back index

The index of the data item in the array that holds the **back** of the queue is the `backIndex`. The value of the `backIndex` changes when data items are **enqueued** into the queue. Just like the `frontIndex`, it is important to ensure that the `backIndex` always stores the index at the back of the queue for the proper functioning of all the operations.

// Diagram: It is important to maintain the backIndex and make sure it has the correct value

### Size

It is important to keep track of the number of data items currently held in the queue. It is important to ensure that this value is always correct and less than the total capacity of the array to prevent attempts to access memory outside the array, which is a frequent cause of program crashes. To always know the current size of the queue, we need to store this information in a `currentSize` variable. Every time data is enqueued or dequeued from the queue, the value of `currentSize` is incremented or decremented by 1.

// Diagram: The size of the queue is important state information that can be derived from front and back index

### Capacity

Since an array has a fixed size, the queue size is **bounded** by the array size when implementing a queue using an array. It's very important to ensure we never exceed this capacity, so we must hold this information about the array's capacity somewhere. We use another variable, `capacity` to hold the size of the array used to implement the queue. 

// Diagram: The capacity of a queue is the size of the array used to implement it

## Representation in memory

We know that data items in an array reside in contiguous memory, so if we implement a queue as an array, all the data items in the queue will reside next to each other.

// Diagram: Queue implemented using arrays in memory

***

# Cyclic nature of array based queues

Unlike stacks, data is inserted into and removed from the queue from **two ends**. The front end only removes data items from the queue, and the back end only adds data items to the queue. This helps the queue achieve a **First-in-First-out** **(FIFO)** ordering.

// Diagram: Data in queue is added to and removed from different ends

## Array implementation

However, when implementing queues in an array using indexes to represent the front and the back of the queue, any addition to the queue is done at the `backIndex` and any removal is done at the `frontIndex`. Since the size of an array is fixed, every enqueue and dequeue operation moves the front or the back of the queue **forward** in the array that holds them. To understand this better, let us look at an example of a queue(capacity 6) implemented as an array that tries to perform the same operations as in the generic queue above.

// Diagram: Adding and removing data moves the queue forward in the array

As we can see from the example, the front and the back of the queue move **forward** in the array that holds them, and eventually, the `backIndex` hits the end of the array. At this point, no more data can be added **after** the `backIndex`.

However, the queue size is still less than the capacity(6), and there is room for more data. There are empty spaces before the `frontIndex` in the queue created by the data items that were dequeued from the queue. As we can see from the example, the front and the back of the queue always move in the array that holds them.

// Diagram: Empty spaces at the start of the array

## Cyclic movement

To get over this problem, the moment the `backIndex` reaches the end of the array, the next data item is added to the **start** of the array if it is empty. This becomes the new `backIndex` for the queue in the array, and any subsequent data items are added **after** it.

// Diagram: The start of the array becomes the new back index of the queue

This makes the queue array implementation cyclic, going around in circles from start to end and then back to the start of the array.

***

# Implementing the queue class using an array

As we learned earlier, when implementing a queue using an array, we always need to keep track of some state information, which is necessary to perform operations on a queue. The state information, the array, and all the operations performed on a queue can be **encapsulated in a class**. This is exactly what classes are designed to do.

// Diagram: Representation of array implementation of a queue encapsulated in a class

## Queue class

The queue class can be implemented by defining a class where all the data members are private to the class, and the operations are exposed to users as functions that manipulate the data members. We also create a parameterized constructor for the queue class to initialize it with a fixed capacity, which we store in the member variable `capacity` and dynamically create an array of the given capacity.

C++

```cpp
using namespace std;

class Queue {
public:

    // Pointer to the dynamic array representing the queue
    int *arr;

    // Maximum capacity of the queue
    int capacity;

    // Index of the front element in the queue
    int frontIndex;

    // Index of the back element in the queue
    int backIndex;

    // Current number of elements in the queue
    int currentSize;

    Queue(int capacity) {
        this->capacity = capacity;

        // Allocating memory for the queue
        this->arr = new int[capacity];

        // Initializing front index to 0
        this->frontIndex = 0;

        // Initializing back index to -1
        this->backIndex = -1;

        // Initializing current size to 0
        this->currentSize = 0;
    }

// Diagram: int size() {}

// Diagram: bool empty() {}

// Diagram: int front() {}

// Diagram: int back() {}

// Diagram: bool enqueue(int val) {}

    int dequeue() {}
};
```

Java

```java
class Queue {

    // Pointer to the dynamic array representing the queue
    public int[] arr;

    // Maximum capacity of the queue
    public int capacity;

    // Index of the front element in the queue
    public int frontIndex;

    // Index of the back element in the queue
    public int backIndex;

    // Current number of elements in the queue
    public int currentSize;

    public Queue(int capacity) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new int[capacity];

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

// Diagram: public int size() {}

// Diagram: public boolean empty() {}

// Diagram: public int front() {}

// Diagram: public int back() {}

// Diagram: public boolean enqueue(int val) {}

    public int dequeue() {}
}
```

Typescript

```typescript
export class Queue {

    // Pointer to the dynamic array representing the queue
    arr: number[];

    // Maximum capacity of the queue
    capacity: number;

    // Index of the front element in the queue
    frontIndex: number;

    // Index of the back element in the queue
    backIndex: number;

    // Current number of elements in the queue
    currentSize: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new Array<number>(capacity);

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

// Diagram: size(): number {}

// Diagram: empty(): boolean {}

// Diagram: front(): number {}

// Diagram: back(): number {}

// Diagram: enqueue(val: number): boolean {}

    dequeue(): number {}
}
```

Javascript

```javascript
export class Queue {

    // Pointer to the dynamic array representing the queue
    arr;

    // Maximum capacity of the queue
    capacity;

    // Index of the front element in the queue
    frontIndex;

    // Index of the back element in the queue
    backIndex;

    // Current number of elements in the queue
    currentSize;

    constructor(capacity) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new Array(capacity);

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

    size() {}

    empty() {}

    front() {}

    back() {}

// Diagram: enqueue(val) {}

    dequeue() {}
}
```

Python

```python
from typing import List

class Queue:
    def __init__(self, capacity):

        # Pointer to the dynamic array representing the queue
        self.arr: List[int] = [None] * capacity

        # Maximum capacity of the queue
        self.capacity: int = capacity

        # Index of the front element in the queue
        self.front_index: int = 0

        # Index of the back element in the queue
        self.back_index: int = -1

        # Current number of elements in the queue
        self.current_size: int = 0

    def size(self):
        pass

    def empty(self):
        pass

    def front(self):
        pass

    def back(self):
        pass

    def enqueue(self, val):
        pass

    def dequeue(self):
        pass
```

## Using the queue class

The queue class abstracts away the implementation details in a class. Anyone who wants to use the queue data structure can instantiate an object of the queue class we defined earlier and operate upon it by calling the exposed public functions in the class. 

C++

```cpp
using namespace std;

class Queue {
public:

    // Pointer to the dynamic array representing the queue
    int *arr;

    // Maximum capacity of the queue
    int capacity;

    // Index of the front element in the queue
    int frontIndex;

    // Index of the back element in the queue
    int backIndex;

    // Current number of elements in the queue
    int currentSize;

    Queue(int capacity) {
        this->capacity = capacity;

        // Allocating memory for the queue
        this->arr = new int[capacity];

        // Initializing front index to 0
        this->frontIndex = 0;

        // Initializing back index to -1
        this->backIndex = -1;

        // Initializing current size to 0
        this->currentSize = 0;
    }

// Diagram: int size() {}

// Diagram: bool empty() {}

// Diagram: int front() {}

// Diagram: int back() {}

// Diagram: bool enqueue(int val) {}

    int dequeue() {}
};
```

Java

```java
class Queue {

    // Pointer to the dynamic array representing the queue
    public int[] arr;

    // Maximum capacity of the queue
    public int capacity;

    // Index of the front element in the queue
    public int frontIndex;

    // Index of the back element in the queue
    public int backIndex;

    // Current number of elements in the queue
    public int currentSize;

    public Queue(int capacity) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new int[capacity];

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

// Diagram: public int size() {}

// Diagram: public boolean empty() {}

// Diagram: public int front() {}

// Diagram: public int back() {}

// Diagram: public boolean enqueue(int val) {}

    public int dequeue() {}
}
```

Typescript

```typescript
export class Queue {

    // Pointer to the dynamic array representing the queue
    arr: number[];

    // Maximum capacity of the queue
    capacity: number;

    // Index of the front element in the queue
    frontIndex: number;

    // Index of the back element in the queue
    backIndex: number;

    // Current number of elements in the queue
    currentSize: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new Array<number>(capacity);

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

// Diagram: size(): number {}

// Diagram: empty(): boolean {}

// Diagram: front(): number {}

// Diagram: back(): number {}

// Diagram: enqueue(val: number): boolean {}

    dequeue(): number {}
}
```

Javascript

```javascript
export class Queue {

    // Pointer to the dynamic array representing the queue
    arr;

    // Maximum capacity of the queue
    capacity;

    // Index of the front element in the queue
    frontIndex;

    // Index of the back element in the queue
    backIndex;

    // Current number of elements in the queue
    currentSize;

    constructor(capacity) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new Array(capacity);

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

    size() {}

    empty() {}

    front() {}

    back() {}

// Diagram: enqueue(val) {}

    dequeue() {}
}
```

Python

```python
from typing import List

class Queue:
    def __init__(self, capacity):

        # Pointer to the dynamic array representing the queue
        self.arr: List[int] = [None] * capacity

        # Maximum capacity of the queue
        self.capacity: int = capacity

        # Index of the front element in the queue
        self.front_index: int = 0

        # Index of the back element in the queue
        self.back_index: int = -1

        # Current number of elements in the queue
        self.current_size: int = 0

    def size(self):
        pass

    def empty(self):
        pass

    def front(self):
        pass

    def back(self):
        pass

    def enqueue(self, val):
        pass

    def dequeue(self):
        pass
```

Let's examine what happens when the code is executed to understand better how encapsulating all the data and state information needed to implement a queue, along with the array and all the operations in a queue class, is useful.

// Diagram: Execution of code using an instance (object) of the queue class

Now that we know what the array implementation of a queue looks like and how it functions, we will learn more about the implementation of each function in the coming lessons.

***

# Determining the size of the queue

The size operation tells the caller about the current size of the queue. The operation becomes quite simple since we store the `currentSize` variable in the queue class, tracking the current queue size. We need to return this value.

// Diagram: Size of the queue is stored in a member variable of the queue class

> **Algorithm**
>
> -   **Step 1:** Return the value of \`currentSize\`.

## Implementation

We combine all the cases and write all of them in conditional blocks to implement the size operation.

C++

```cpp
using namespace std;

class Queue {
public:

    // Pointer to the dynamic array representing the queue
    int *arr;

    // Maximum capacity of the queue
    int capacity;

    // Index of the front element in the queue
    int frontIndex;

    // Index of the back element in the queue
    int backIndex;

    // Current number of elements in the queue
    int currentSize;

    Queue(int capacity) {
        this->capacity = capacity;

        // Allocating memory for the queue
        this->arr = new int[capacity];

        // Initializing front index to 0
        this->frontIndex = 0;

        // Initializing back index to -1
        this->backIndex = -1;

        // Initializing current size to 0
        this->currentSize = 0;
    }

// Diagram: int size() {

        // Returns the current size of the queue
        return currentSize;
    }
};
```

Java

```java
class Queue {

    // Pointer to the dynamic array representing the queue
    public int[] arr;

    // Maximum capacity of the queue
    public int capacity;

    // Index of the front element in the queue
    public int frontIndex;

    // Index of the back element in the queue
    public int backIndex;

    // Current number of elements in the queue
    public int currentSize;

    public Queue(int capacity) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new int[capacity];

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

// Diagram: public int size() {

        // Returns the current size of the queue
        return currentSize;
    }
```

Typescript

```typescript
export class Queue {

    // Pointer to the dynamic array representing the queue
    arr: number[];

    // Maximum capacity of the queue
    capacity: number;

    // Index of the front element in the queue
    frontIndex: number;

    // Index of the back element in the queue
    backIndex: number;

    // Current number of elements in the queue
    currentSize: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new Array<number>(capacity);

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

// Diagram: size(): number {

        // Returns the current size of the queue
        return this.currentSize;
    }
```

Javascript

```javascript
export class Queue {

    // Pointer to the dynamic array representing the queue
    arr;

    // Maximum capacity of the queue
    capacity;

    // Index of the front element in the queue
    frontIndex;

    // Index of the back element in the queue
    backIndex;

    // Current number of elements in the queue
    currentSize;

    constructor(capacity) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new Array(capacity);

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

    size() {

        // Returns the current size of the queue
        return this.currentSize;
    }
```

Python

```python
using namespace std;
```

## Complexity Analysis

The implementation is a quite simple one-line statement returning the value of the `currentSize` variable.

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

# Checking if the queue is empty

As the name suggests, this operation tells the caller if the queue is empty or if some items are already in it. It will return `true` if the queue is empty and `false` otherwise. We can check if the queue size equals 0 to implement this operation.

// Diagram: Operation to check if the queue is empty

## Algorithm

The empty operation in a queue class implemented using an array can be summarized as the following algorithm.

> **Algorithm**
>
> -   **Step 1:** Return \`true\` is the size of the queue is equal to \`0\`, otherwise, return \`false\`.

## Implementation

// Diagram: The implementation is quite simple one line statement returning true if size() == 0, false otherwise

C++

```cpp
using namespace std;

class Queue {
public:

    // Pointer to the dynamic array representing the queue
    int *arr;

    // Maximum capacity of the queue
    int capacity;

    // Index of the front element in the queue
    int frontIndex;

    // Index of the back element in the queue
    int backIndex;

    // Current number of elements in the queue
    int currentSize;

    Queue(int capacity) {
        this->capacity = capacity;

        // Allocating memory for the queue
        this->arr = new int[capacity];

        // Initializing front index to 0
        this->frontIndex = 0;

        // Initializing back index to -1
        this->backIndex = -1;

        // Initializing current size to 0
        this->currentSize = 0;
    }

// Diagram: int size() {

        // Returns the current size of the queue
        return currentSize;
    }

// Diagram: bool empty() {

        // Returns true if the queue is empty, false otherwise
        return size() == 0;
    }
};
```

Java

```java
class Queue {

    // Pointer to the dynamic array representing the queue
    public int[] arr;

    // Maximum capacity of the queue
    public int capacity;

    // Index of the front element in the queue
    public int frontIndex;

    // Index of the back element in the queue
    public int backIndex;

    // Current number of elements in the queue
    public int currentSize;

    public Queue(int capacity) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new int[capacity];

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

// Diagram: public int size() {

        // Returns the current size of the queue
        return currentSize;
    }

// Diagram: public boolean empty() {

        // Returns true if the queue is empty, false otherwise
        return size() == 0;
    }
```

Typescript

```typescript
export class Queue {

    // Pointer to the dynamic array representing the queue
    arr: number[];

    // Maximum capacity of the queue
    capacity: number;

    // Index of the front element in the queue
    frontIndex: number;

    // Index of the back element in the queue
    backIndex: number;

    // Current number of elements in the queue
    currentSize: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new Array<number>(capacity);

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

// Diagram: size(): number {

        // Returns the current size of the queue
        return this.currentSize;
    }

// Diagram: empty(): boolean {

        // Returns true if the queue is empty, false otherwise
        return this.size() === 0;
    }
```

Javascript

```javascript
export class Queue {

    // Pointer to the dynamic array representing the queue
    arr;

    // Maximum capacity of the queue
    capacity;

    // Index of the front element in the queue
    frontIndex;

    // Index of the back element in the queue
    backIndex;

    // Current number of elements in the queue
    currentSize;

    constructor(capacity) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new Array(capacity);

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

    size() {

        // Returns the current size of the queue
        return this.currentSize;
    }

    empty() {

        // Returns true if the queue is empty, false otherwise
        return this.size() === 0;
    }
```

Python

```python
using namespace std;
```

## Complexity Analysis

The function internally calls the `size()` function and returns a value based on the result, so the complexity is the same as that of the `size()` function i.e **O(1)**.

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

# Accessing the front of the queue

This front operation returns the value at the **front** of the queue. Since we always store the index of the data item at the front of the queue in the array implementation, we need to return the value at that index to the user. We have two cases to consider here.

## 1\. Queue is empty

We can return `-1` to indicate that there are no items in the queue. Ideally, we should be throwing an error, but for the sake of simplicity here, we return `-1`

// Diagram: Front function when queue is empty

> **Algorithm**
>
> -   **Step 1:** If the queue is empty, return \`-1\` to indicate that there is no front element.

## 2\. Queue is not empty

If the queue is not empty, we return the value at the `frontIndex`.

// Diagram: Front operation when queue is not empty

> **Algorithm**
>
> -   **Step 1:** If the queue is not empty, return the value stored at \`frontIndex\` of the internal array.

## Implementation

The implementation is quite simple. We write all the cases in conditional blocks to implement the **front** operation.

C++

```cpp
using namespace std;

class Queue {
public:

    // Pointer to the dynamic array representing the queue
    int *arr;

    // Maximum capacity of the queue
    int capacity;

    // Index of the front element in the queue
    int frontIndex;

    // Index of the back element in the queue
    int backIndex;

    // Current number of elements in the queue
    int currentSize;

    Queue(int capacity) {
        this->capacity = capacity;

        // Allocating memory for the queue
        this->arr = new int[capacity];

        // Initializing front index to 0
        this->frontIndex = 0;

        // Initializing back index to -1
        this->backIndex = -1;

        // Initializing current size to 0
        this->currentSize = 0;
    }

// Diagram: int size() {

        // Returns the current size of the queue
        return currentSize;
    }

// Diagram: bool empty() {

        // Returns true if the queue is empty, false otherwise
        return size() == 0;
    }

    int front() {
        if (empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the front of the queue
        return arr[frontIndex];
    }
};
```

Java

```java
class Queue {

    // Pointer to the dynamic array representing the queue
    public int[] arr;

    // Maximum capacity of the queue
    public int capacity;

    // Index of the front element in the queue
    public int frontIndex;

    // Index of the back element in the queue
    public int backIndex;

    // Current number of elements in the queue
    public int currentSize;

    public Queue(int capacity) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new int[capacity];

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

// Diagram: public int size() {

        // Returns the current size of the queue
        return currentSize;
    }

// Diagram: public boolean empty() {

        // Returns true if the queue is empty, false otherwise
        return size() == 0;
    }

    public int front() {
        if (empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the front of the queue
        return arr[frontIndex];
    }
```

Typescript

```typescript
using namespace std;
```

Javascript

```javascript
export class Queue {

    // Pointer to the dynamic array representing the queue
    arr;

    // Maximum capacity of the queue
    capacity;

    // Index of the front element in the queue
    frontIndex;

    // Index of the back element in the queue
    backIndex;

    // Current number of elements in the queue
    currentSize;

    constructor(capacity) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new Array(capacity);

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

    size() {

        // Returns the current size of the queue
        return this.currentSize;
    }

    empty() {

        // Returns true if the queue is empty, false otherwise
        return this.size() === 0;
    }

    front() {
        if (this.empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the front of the queue
        return this.arr[this.frontIndex];
    }
```

Python

```python
from typing import List

class Queue:
    def __init__(self, capacity):

        # Pointer to the dynamic array representing the queue
        self.arr: List[int] = [None] * capacity

        # Maximum capacity of the queue
        self.capacity: int = capacity

        # Index of the front element in the queue
        self.front_index: int = 0

        # Index of the back element in the queue
        self.back_index: int = -1

        # Current number of elements in the queue
        self.current_size: int = 0

    def size(self):

        # Returns the current size of the queue
        return self.current_size

    def empty(self):

        # Returns True if the queue is empty, False otherwise
        return self.size() == 0

    def front(self):
        if self.empty():

            # Returns -1 if the queue is empty
            return -1

        # Returns the element at the front of the queue
        return self.arr[self.front_index]
```

## Complexity Analysis

We call the `empty()` function, and based on that, we return a value. If the queue is not empty, we return the value at `frontIndex` the internal array, so the complexity will be the same as that of the `empty()` function i.e. **O(1)**.

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

# Accessing the back of the queue

This **back** operation returns the value at the **back** of the queue. Since we always store the index of the data item at the back of the queue in the array implementation, we need to return the value at that index to the user. We have two cases to consider here.

## 1\. Queue is empty

We can return `-1` to indicate that there are no items in the queue. Ideally, we should be throwing an error, but for the sake of simplicity here, we return `-1`

// Diagram: Back operation when queue is empty

> **Algorithm**
>
> -   **Step 1:** If the queue is empty, return \`-1\` to indicate that there is no back element.

## 2\. Queue is not empty

// Diagram: If the queue is not empty, we return the value at the backIndex

// Diagram: Back operation when queue is not empty

> **Algorithm**
>
> -   **Step 1:** If the queue is not empty, return the value stored at \`backIndex\` of the internal array.

## Implementation

The implementation is quite simple. We write all the cases in conditional blocks to implement the **back** operation.

C++

```cpp
using namespace std;

class Queue {
public:

    // Pointer to the dynamic array representing the queue
    int *arr;

    // Maximum capacity of the queue
    int capacity;

    // Index of the front element in the queue
    int frontIndex;

    // Index of the back element in the queue
    int backIndex;

    // Current number of elements in the queue
    int currentSize;

    Queue(int capacity) {
        this->capacity = capacity;

        // Allocating memory for the queue
        this->arr = new int[capacity];

        // Initializing front index to 0
        this->frontIndex = 0;

        // Initializing back index to -1
        this->backIndex = -1;

        // Initializing current size to 0
        this->currentSize = 0;
    }

// Diagram: int size() {

        // Returns the current size of the queue
        return currentSize;
    }

// Diagram: bool empty() {

        // Returns true if the queue is empty, false otherwise
        return size() == 0;
    }

    int front() {
        if (empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the front of the queue
        return arr[frontIndex];
    }

    int back() {
        if (empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the back of the queue
        return arr[backIndex];
    }
};
```

Java

```java
class Queue {

    // Pointer to the dynamic array representing the queue
    public int[] arr;

    // Maximum capacity of the queue
    public int capacity;

    // Index of the front element in the queue
    public int frontIndex;

    // Index of the back element in the queue
    public int backIndex;

    // Current number of elements in the queue
    public int currentSize;

    public Queue(int capacity) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new int[capacity];

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

// Diagram: public int size() {

        // Returns the current size of the queue
        return currentSize;
    }

// Diagram: public boolean empty() {

        // Returns true if the queue is empty, false otherwise
        return size() == 0;
    }

    public int front() {
        if (empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the front of the queue
        return arr[frontIndex];
    }

    public int back() {
        if (empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the back of the queue
        return arr[backIndex];
    }
```

Typescript

```typescript
export class Queue {

    // Pointer to the dynamic array representing the queue
    arr: number[];

    // Maximum capacity of the queue
    capacity: number;

    // Index of the front element in the queue
    frontIndex: number;

    // Index of the back element in the queue
    backIndex: number;

    // Current number of elements in the queue
    currentSize: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new Array<number>(capacity);

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

// Diagram: size(): number {

        // Returns the current size of the queue
        return this.currentSize;
    }

// Diagram: empty(): boolean {

        // Returns true if the queue is empty, false otherwise
        return this.size() === 0;
    }

    front(): number {
        if (this.empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the front of the queue
        return this.arr[this.frontIndex];
    }

    back(): number {
        if (this.empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the back of the queue
        return this.arr[this.backIndex];
    }
```

Javascript

```javascript
export class Queue {

    // Pointer to the dynamic array representing the queue
    arr;

    // Maximum capacity of the queue
    capacity;

    // Index of the front element in the queue
    frontIndex;

    // Index of the back element in the queue
    backIndex;

    // Current number of elements in the queue
    currentSize;

    constructor(capacity) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new Array(capacity);

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

    size() {

        // Returns the current size of the queue
        return this.currentSize;
    }

    empty() {

        // Returns true if the queue is empty, false otherwise
        return this.size() === 0;
    }

    front() {
        if (this.empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the front of the queue
        return this.arr[this.frontIndex];
    }

    back() {
        if (this.empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the back of the queue
        return this.arr[this.backIndex];
    }
```

Python

```python
from typing import List

class Queue:
    def __init__(self, capacity):

        # Pointer to the dynamic array representing the queue
        self.arr: List[int] = [None] * capacity

        # Maximum capacity of the queue
        self.capacity: int = capacity

        # Index of the front element in the queue
        self.front_index: int = 0

        # Index of the back element in the queue
        self.back_index: int = -1

        # Current number of elements in the queue
        self.current_size: int = 0

    def size(self):

        # Returns the current size of the queue
        return self.current_size

    def empty(self):

        # Returns True if the queue is empty, False otherwise
        return self.size() == 0

    def front(self):
        if self.empty():

            # Returns -1 if the queue is empty
            return -1

        # Returns the element at the front of the queue
        return self.arr[self.front_index]

    def back(self):
        if self.empty():

            # Returns -1 if the queue is empty
            return -1

        # Returns the element at the back of the queue
        return self.arr[self.back_index]
```

## Complexity Analysis

We call the `empty()` function, and based on that, we return a value. If the queue is not empty, we return the value at `backIndex` the internal array, so the complexity will be the same as that of the `empty()` function i.e. **O(1)**.

> **Best Case**
>
> -   Space Complexity -**\`O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**

***

# Enqueuing an item in the queue

The enqueue operation adds a data item to the end of the queue and is implemented by adding the data item at the end of the internal array using the `backIndex`. Addition only happens after ensuring that we do not exceed the `capacity` of the queue after this operation. The implementation is quite straightforward, though there are certain cases that we need to consider.

## 1\. Queue is full

Since the queue is full, we cannot add more data without removing some items. We will return `false` as this operation cannot be done

// Diagram: Cannot enqueue data when the queue is full

> **Algorithm**
>
> -   **Step 1:** If the queue is full, return \`false\` to indicate that the operation was unsuccessful.

## 2\. Queue is not full

Enqueuing data to the queue when not full is very simple using the queue's array implementation. However, since the array is limited in size and the implementation is **cyclic**, we can further divide the implementation into three cases.

### 2.1 backIndex < lastIndex

In this case, we first need to increment the `backIndex` index by one to move it to the next empty index in the array and add the value to that index.

// Diagram: Enqueue operation when the back != last index

> **Algorithm**
>
> -   **Step 1:** If \`backIndex\` is not the last index, increment it by \`1\`.
> -   **Step 2:** Store the new value at the incremented \`backIndex\` of the internal array.
> -   **Step 3:** Increment the \`currentSize\` variable by \`1\`.
> -   **Step 4:** Return \`true\` to indicate that the operation was successful.

### 2.2 backIndex == lastIndex

This is a special case as in this case the `backIndex` is the last index of the internal array, and adding 1 will result in an index that is out of the array. Remember, the array implementation of a queue is **cyclic**. Moving around in a circle, the index to which we want to add our data item is the 0th index of the internal array. This can be easily done by using the mod operator on  `backIndex + 1`. The expression `(backIndex + 1) % capacity` keeps into account this cyclic nature and makes sure that the result is always in the range `[0, capacity -1]`.

// Diagram: Enqueue operation when the back index is the last index of the array

> **Algorithm**
>
> -   **Step 1:** If \`backIndex\` is the last index, cyclically increment it by \`1\` so that it becomes the 0th index.
> -   **Step 2:** Store the new value at the incremented \`backIndex\` of the internal array.
> -   **Step 3:** Increment the \`currentSize\` variable by \`1\`.
> -   **Step 4:** Return \`true\` to indicate that the operation was successful.

## Implementation

The implementation is quite simple. We write all the cases in conditional blocks to implement the enqueue operation.

C++

```cpp
using namespace std;

class Queue {
public:

    // Pointer to the dynamic array representing the queue
    int *arr;

    // Maximum capacity of the queue
    int capacity;

    // Index of the front element in the queue
    int frontIndex;

    // Index of the back element in the queue
    int backIndex;

    // Current number of elements in the queue
    int currentSize;

    Queue(int capacity) {
        this->capacity = capacity;

        // Allocating memory for the queue
        this->arr = new int[capacity];

        // Initializing front index to 0
        this->frontIndex = 0;

        // Initializing back index to -1
        this->backIndex = -1;

        // Initializing current size to 0
        this->currentSize = 0;
    }

// Diagram: int size() {

        // Returns the current size of the queue
        return currentSize;
    }

// Diagram: bool empty() {

        // Returns true if the queue is empty, false otherwise
        return size() == 0;
    }

    int front() {
        if (empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the front of the queue
        return arr[frontIndex];
    }

    int back() {
        if (empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the back of the queue
        return arr[backIndex];
    }

    bool enqueue(int val) {
        if (currentSize == capacity) {

            // Returns false if the queue is full and cannot enqueue more
            // elements
            return false;
        }

        // Calculates the next back index in a circular manner
        backIndex = (backIndex + 1) % capacity;

        // Inserts the new element at the back of the queue
        arr[backIndex] = val;

        // Increments the current size
        currentSize++;

        // Returns true to indicate successful enqueue operation
        return true;
    }
};
```

Java

```java
class Queue {

    // Pointer to the dynamic array representing the queue
    public int[] arr;

    // Maximum capacity of the queue
    public int capacity;

    // Index of the front element in the queue
    public int frontIndex;

    // Index of the back element in the queue
    public int backIndex;

    // Current number of elements in the queue
    public int currentSize;

    public Queue(int capacity) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new int[capacity];

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

// Diagram: public int size() {

        // Returns the current size of the queue
        return currentSize;
    }

// Diagram: public boolean empty() {

        // Returns true if the queue is empty, false otherwise
        return size() == 0;
    }

    public int front() {
        if (empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the front of the queue
        return arr[frontIndex];
    }

    public int back() {
        if (empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the back of the queue
        return arr[backIndex];
    }

    public boolean enqueue(int val) {
        if (currentSize == capacity) {

            // Returns false if the queue is full and cannot enqueue more
            // elements
            return false;
        }

        // Calculates the next back index in a circular manner
        backIndex = (backIndex + 1) % capacity;

        // Inserts the new element at the back of the queue
        arr[backIndex] = val;

        // Increments the current size
        currentSize++;

        // Returns true to indicate a successful enqueue operation
        return true;
    }
```

Typescript

```typescript
export class Queue {

    // Pointer to the dynamic array representing the queue
    arr: number[];

    // Maximum capacity of the queue
    capacity: number;

    // Index of the front element in the queue
    frontIndex: number;

    // Index of the back element in the queue
    backIndex: number;

    // Current number of elements in the queue
    currentSize: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new Array<number>(capacity);

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

// Diagram: size(): number {

        // Returns the current size of the queue
        return this.currentSize;
    }

// Diagram: empty(): boolean {

        // Returns true if the queue is empty, false otherwise
        return this.size() === 0;
    }

    front(): number {
        if (this.empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the front of the queue
        return this.arr[this.frontIndex];
    }

    back(): number {
        if (this.empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the back of the queue
        return this.arr[this.backIndex];
    }

    enqueue(val: number): boolean {
        if (this.currentSize === this.capacity) {

            // Returns false if the queue is full and cannot enqueue more
            // elements
            return false;
        }

        // Calculates the next back index in a circular manner
        this.backIndex = (this.backIndex + 1) % this.capacity;

        // Inserts the new element at the back of the queue
        this.arr[this.backIndex] = val;

        // Increments the current size
        this.currentSize++;

        // Returns true to indicate a successful enqueue operation
        return true;
    }
```

Javascript

```javascript
export class Queue {

    // Pointer to the dynamic array representing the queue
    arr;

    // Maximum capacity of the queue
    capacity;

    // Index of the front element in the queue
    frontIndex;

    // Index of the back element in the queue
    backIndex;

    // Current number of elements in the queue
    currentSize;

    constructor(capacity) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new Array(capacity);

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

    size() {

        // Returns the current size of the queue
        return this.currentSize;
    }

    empty() {

        // Returns true if the queue is empty, false otherwise
        return this.size() === 0;
    }

    front() {
        if (this.empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the front of the queue
        return this.arr[this.frontIndex];
    }

    back() {
        if (this.empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the back of the queue
        return this.arr[this.backIndex];
    }

    enqueue(val) {
        if (this.currentSize === this.capacity) {

            // Returns false if the queue is full and cannot enqueue more
            // elements
            return false;
        }

        // Calculates the next back index in a circular manner
        this.backIndex = (this.backIndex + 1) % this.capacity;

        // Inserts the new element at the back of the queue
        this.arr[this.backIndex] = val;

        // Increments the current size
        this.currentSize++;

        // Returns true to indicate a successful enqueue operation
        return true;
    }
```

Python

```python
from typing import List

class Queue:
    def __init__(self, capacity):

        # Pointer to the dynamic array representing the queue
        self.arr: List[int] = [None] * capacity

        # Maximum capacity of the queue
        self.capacity: int = capacity

        # Index of the front element in the queue
        self.front_index: int = 0

        # Index of the back element in the queue
        self.back_index: int = -1

        # Current number of elements in the queue
        self.current_size: int = 0

    def size(self):

        # Returns the current size of the queue
        return self.current_size

    def empty(self):

        # Returns True if the queue is empty, False otherwise
        return self.size() == 0

    def front(self):
        if self.empty():

            # Returns -1 if the queue is empty
            return -1

        # Returns the element at the front of the queue
        return self.arr[self.front_index]

    def back(self):
        if self.empty():

            # Returns -1 if the queue is empty
            return -1

        # Returns the element at the back of the queue
        return self.arr[self.back_index]

    def enqueue(self, val):
        if self.current_size == self.capacity:

            # Returns False if the queue is full and cannot enqueue more
            # elements
            return False

        # Calculates the next back index in a circular manner
        self.back_index = (self.back_index + 1) % self.capacity

        # Inserts the new element at the back of the queue
        self.arr[self.back_index] = val

        # Increments the current size
        self.current_size += 1

        # Returns True to indicate a successful enqueue operation
        return True
```

## Complexity Analysis

We just add a new item at a known array index and do not allocate any new memory for the enqueue operation and so the complexity is constant in time as well as space

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

# Dequeuing an item from the queue

The dequeue operation is as important as the enqueue as it is the only way to remove a data item from the queue. It is implemented by removing the data item at the **front** of the internal array using the `frontIndex` and returning its value. The implementation is quite straightforward, though there are certain cases that we need to consider.

## 1\. Queue is empty

We return `-1`here to indicate this is an invalid operation, as no item is at the front of the queue.

// Diagram: Dequeue operation when queue is empty

> **Algorithm**
>
> -   **Step 1:** If the queue is empty, return \`-1\` to indicate that the operation was unsuccessful.

## 2\. Queue is not empty

Due to the **cyclic** nature of the array implementation of a queue, just like the enqueue operation, we can further divide the implementation of the dequeue operation into three cases. We must check for these cases in the given order to implement the dequeue operation correctly.

### 2.1 frontIndex < lastIndex

This is the generic case, and its implementation is quite logical. We first store the value at the `frontIndex` of the internal array in a temporary variable and then increment the `frontIndex` by one. Finally, we return the value stored in the temporary variable.

// Diagram: Dequeue operation when front != last index

> **Algorithm**
>
> -   **Step 1:** If the queue is not empty, store the value of the element at the \`frontIndex\` of the internal array in a temporary variable.
> -   **Step 2:** If \`frontIndex\` is not the last index, increment it by \`1\`.
> -   **Step 3:** Decrement the \`currentSize\` variable by \`1\`.
> -   **Step 4:** Return the value stored in the temporary variable.

### 2.2 frontIndex == lastIndex

This is a special case as, in this case, the `frontIndex` is the last index of the internal array, and adding `1` to it will result in an index that is out of the array. Remember, the array implementation of a queue is **cyclic**. Moving around in a circle, the next front of the queue should now be at the **0th index** of the internal array. This can be easily done by using the mod operator on `frontIndex + 1`. The expression `(frontIndex + 1) % capacity` keeps into account this cyclic nature and makes sure that the result is always in the range `[0, capacity -1]`.

// Diagram: Dequeue operation when front == last index

> **Algorithm**
>
> -   **Step 1:** If the queue is not empty, store the value of the element at the \`frontIndex\` of the internal array in a temporary variable.
> -   **Step 2:** If \`frontIndex\` is the last index, cyclically increment it by \`1\` so that it becomes the 0th index.
> -   **Step 3:** Decrement the \`currentSize\` variable by \`1\`.
> -   **Step 4:** Return the value stored in the temporary variable.

**Why don't we delete the data in the array and update the value of the frontIndex?**

We don't need to delete the old **front** after incrementing the value of the `frontIndex` by one because the queue only consists of data between the `frontIndex` and `backIndex` in the array. Any data outside it is never accessed and overwritten as the queue grows.

## Implementation

The implementation is quite simple. We write all the cases in conditional blocks to implement the dequeue operation.

C++

```cpp
using namespace std;

class Queue {
public:

    // Pointer to the dynamic array representing the queue
    int *arr;

    // Maximum capacity of the queue
    int capacity;

    // Index of the front element in the queue
    int frontIndex;

    // Index of the back element in the queue
    int backIndex;

    // Current number of elements in the queue
    int currentSize;

    Queue(int capacity) {
        this->capacity = capacity;

        // Allocating memory for the queue
        this->arr = new int[capacity];

        // Initializing front index to 0
        this->frontIndex = 0;

        // Initializing back index to -1
        this->backIndex = -1;

        // Initializing current size to 0
        this->currentSize = 0;
    }

// Diagram: int size() {

        // Returns the current size of the queue
        return currentSize;
    }

// Diagram: bool empty() {

        // Returns true if the queue is empty, false otherwise
        return size() == 0;
    }

    int front() {
        if (empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the front of the queue
        return arr[frontIndex];
    }

    int back() {
        if (empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the back of the queue
        return arr[backIndex];
    }

    bool enqueue(int val) {
        if (currentSize == capacity) {

            // Returns false if the queue is full and cannot enqueue more
            // elements
            return false;
        }

        // Calculates the next back index in a circular manner
        backIndex = (backIndex + 1) % capacity;

        // Inserts the new element at the back of the queue
        arr[backIndex] = val;

        // Increments the current size
        currentSize++;

        // Returns true to indicate successful enqueue operation
        return true;
    }

    int dequeue() {
        if (empty()) {

            // Returns -1 if the queue is empty and cannot dequeue
            // elements
            return -1;
        }

        // Stores the element to be dequeued
        int dequeuedElement = arr[frontIndex];

        // Calculates the next front index in a circular manner
        frontIndex = (frontIndex + 1) % capacity;

        // Decrements the current size
        currentSize--;

        // Returns the dequeued element
        return dequeuedElement;
    }
};
```

Java

```java
class Queue {

    // Pointer to the dynamic array representing the queue
    public int[] arr;

    // Maximum capacity of the queue
    public int capacity;

    // Index of the front element in the queue
    public int frontIndex;

    // Index of the back element in the queue
    public int backIndex;

    // Current number of elements in the queue
    public int currentSize;

    public Queue(int capacity) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new int[capacity];

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

// Diagram: public int size() {

        // Returns the current size of the queue
        return currentSize;
    }

// Diagram: public boolean empty() {

        // Returns true if the queue is empty, false otherwise
        return size() == 0;
    }

    public int front() {
        if (empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the front of the queue
        return arr[frontIndex];
    }

    public int back() {
        if (empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the back of the queue
        return arr[backIndex];
    }

    public boolean enqueue(int val) {
        if (currentSize == capacity) {

            // Returns false if the queue is full and cannot enqueue more
            // elements
            return false;
        }

        // Calculates the next back index in a circular manner
        backIndex = (backIndex + 1) % capacity;

        // Inserts the new element at the back of the queue
        arr[backIndex] = val;

        // Increments the current size
        currentSize++;

        // Returns true to indicate a successful enqueue operation
        return true;
    }

    public int dequeue() {
        if (empty()) {

            // Returns -1 if the queue is empty and cannot dequeue
            // elements
            return -1;
        }

        // Stores the element to be dequeued
        int dequeuedElement = arr[frontIndex];

        // Calculates the next front index in a circular manner
        frontIndex = (frontIndex + 1) % capacity;

        // Decrements the current size
        currentSize--;

        // Returns the dequeued element
        return dequeuedElement;
    }
```

Typescript

```typescript
export class Queue {

    // Pointer to the dynamic array representing the queue
    arr: number[];

    // Maximum capacity of the queue
    capacity: number;

    // Index of the front element in the queue
    frontIndex: number;

    // Index of the back element in the queue
    backIndex: number;

    // Current number of elements in the queue
    currentSize: number;

    constructor(capacity: number) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new Array<number>(capacity);

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

// Diagram: size(): number {

        // Returns the current size of the queue
        return this.currentSize;
    }

// Diagram: empty(): boolean {

        // Returns true if the queue is empty, false otherwise
        return this.size() === 0;
    }

    front(): number {
        if (this.empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the front of the queue
        return this.arr[this.frontIndex];
    }

    back(): number {
        if (this.empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the back of the queue
        return this.arr[this.backIndex];
    }

    enqueue(val: number): boolean {
        if (this.currentSize === this.capacity) {

            // Returns false if the queue is full and cannot enqueue more
            // elements
            return false;
        }

        // Calculates the next back index in a circular manner
        this.backIndex = (this.backIndex + 1) % this.capacity;

        // Inserts the new element at the back of the queue
        this.arr[this.backIndex] = val;

        // Increments the current size
        this.currentSize++;

        // Returns true to indicate a successful enqueue operation
        return true;
    }

    dequeue(): number {
        if (this.empty()) {

            // Returns -1 if the queue is empty and cannot dequeue
            // elements
            return -1;
        }

        // Stores the element to be dequeued
        const dequeuedElement = this.arr[this.frontIndex];

        // Calculates the next front index in a circular manner
        this.frontIndex = (this.frontIndex + 1) % this.capacity;

        // Decrements the current size
        this.currentSize--;

        // Returns the dequeued element
        return dequeuedElement;
    }
```

Javascript

```javascript
export class Queue {

    // Pointer to the dynamic array representing the queue
    arr;

    // Maximum capacity of the queue
    capacity;

    // Index of the front element in the queue
    frontIndex;

    // Index of the back element in the queue
    backIndex;

    // Current number of elements in the queue
    currentSize;

    constructor(capacity) {
        this.capacity = capacity;

        // Allocating memory for the queue
        this.arr = new Array(capacity);

        // Initializing front index to 0
        this.frontIndex = 0;

        // Initializing back index to -1
        this.backIndex = -1;

        // Initializing current size to 0
        this.currentSize = 0;
    }

    size() {

        // Returns the current size of the queue
        return this.currentSize;
    }

    empty() {

        // Returns true if the queue is empty, false otherwise
        return this.size() === 0;
    }

    front() {
        if (this.empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the front of the queue
        return this.arr[this.frontIndex];
    }

    back() {
        if (this.empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the back of the queue
        return this.arr[this.backIndex];
    }

    enqueue(val) {
        if (this.currentSize === this.capacity) {

            // Returns false if the queue is full and cannot enqueue more
            // elements
            return false;
        }

        // Calculates the next back index in a circular manner
        this.backIndex = (this.backIndex + 1) % this.capacity;

        // Inserts the new element at the back of the queue
        this.arr[this.backIndex] = val;

        // Increments the current size
        this.currentSize++;

        // Returns true to indicate a successful enqueue operation
        return true;
    }

    dequeue() {
        if (this.empty()) {

            // Returns -1 if the queue is empty and cannot dequeue
            // elements
            return -1;
        }

        // Stores the element to be dequeued
        const dequeuedElement = this.arr[this.frontIndex];

        // Calculates the next front index in a circular manner
        this.frontIndex = (this.frontIndex + 1) % this.capacity;

        // Decrements the current size
        this.currentSize--;

        // Returns the dequeued element
        return dequeuedElement;
    }
```

Python

```python
using namespace std;
```

## Complexity Analysis

We access the data item at a known array index and increment the value of a variable in the implementation of the dequeue operation. So, the complexity is constant in time and space.

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

# Design a queue using circular array

## Problem Statement

Given the skeleton of a **Queue class**, complete this class by implementing all the queue operations below.

> -   **Queue(int capacity)** - Initializes the Queue object with the given capacity.
> -   **size()** - Returns the current size of the queue.
> -   **empty()** - Returns \`true\` if the queue is empty and \`false\` if not.
> -   **front()** - Returns the element at the front of the queue. If the queue is empty, it returns \`-1\`.
> -   **back()** - Returns the element at the back of the queue. If the queue is empty, it returns \`-1\`.
> -   **enqueue(int val)** - Adds the given value to the queue and returns \`true\` if the operation is successful. Returns \`false\` if the queue is full.
> -   **dequeue()** - Removes the front element from the queue and returns its value. If the queue is empty, it returns \`-1\`.

// Diagram: You must abide by the following constraints

1. Use an **array as the internal data structure** to store data and implement this class.

2\. The implementation **should be circular in nature**, i.e., all the vacant positions of the internal array must be filled before declaring the queue empty.

// Diagram: Implementation of a circular queue using an array

> The input should adhere to the following rules:
>
> 1.  The input should contain two arrays of the same size.
> 2.  The first array should contain the list of operations, while the second should contain the corresponding operands for those operations.
> 3.  The first index in the first array should contain **Queue**, and the first index in the second array should contain a single positive integer representing the capacity of the queue. This value is used to initialise the queue.
> 4.  For each index in the first array that contains the **enqueue** operation, the corresponding index in the second array should contain the value that needs to be pushed.
> 5.  For each index in the first array that contains **size**, **empty**, **front**, **back**, or **dequeue** operations, the corresponding index in the second array should contain an empty array.
>
> **Example:**
>
> -   **Input:** \[Queue, enqueue, back, enqueue, front, empty, dequeue, front, enqueue, enqueue, empty\] \[\[2\], \[2\], \[\], \[3\], \[\], \[\], \[\], \[\], \[8\], \[9\], \[\]\]
>
> -   **Output:** \[null, true, 2, true, 2, false, 2, 3, true, false, false\]
>
> **Explanation:**
>
> **Operation:** Queue queue = new Queue(2) **Result:** Initializes an empty \`Queue\` with a capacity of 2
>
> **Operation:** queue.enqueue(2) **Result:** \`queue = \[2\]\`, returns \`true\`
>
> **Operation:** queue.back() **Result:** \`queue = \[2\]\`, returns \`2\`
>
> **Operation:** queue.enqueue(3) **Result:** \`queue = \[2, 3\]\`, returns \`true\`
>
> **Operation:** queue.front() **Result:** \`queue = \[2, 3\]\`, returns \`2\`
>
> **Operation:** queue.empty() **Result:** \`queue = \[2, 3\]\`, returns \`false\`
>
> **Operation:** queue.dequeue() **Result:** \`queue = \[3\]\`, returns \`2\`
>
> **Operation:** queue.front() **Result:** \`queue = \[3\]\`, returns \`3\`
>
> **Operation:** queue.enqueue(8) **Result:** \`queue = \[3, 8\]\`, returns \`true\`
>
> **Operation:** queue.enqueue(9) **Result:** \`queue = \[3, 8\]\`, queue is full, returns \`false\`
>
> **Operation:** queue.empty() **Result:** \`queue = \[3, 8\]\`, returns \`false\`

## Solution

```cpp
using namespace std;

class Queue {
public:

    // Pointer to the dynamic array representing the queue
    int *arr;

    // Maximum capacity of the queue
    int capacity;

    // Index of the front element in the queue
    int frontIndex;

    // Index of the back element in the queue
    int backIndex;

    // Current number of elements in the queue
    int currentSize;

    Queue(int capacity) {
        this->capacity = capacity;

        // Allocating memory for the queue
        this->arr = new int[capacity];

        // Initializing front index to 0
        this->frontIndex = 0;

        // Initializing back index to -1
        this->backIndex = -1;

        // Initializing current size to 0
        this->currentSize = 0;
    }

    int size() {

        // Returns the current size of the queue
        return currentSize;
    }

    bool empty() {

        // Returns true if the queue is empty, false otherwise
        return size() == 0;
    }

    int front() {
        if (empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the front of the queue
        return arr[frontIndex];
    }

    int back() {
        if (empty()) {

            // Returns -1 if the queue is empty
            return -1;
        }

        // Returns the element at the back of the queue
        return arr[backIndex];
    }

    bool enqueue(int val) {
        if (currentSize == capacity) {

            // Returns false if the queue is full and cannot enqueue more
            // elements
            return false;
        }

        // Calculates the next back index in a circular manner
        backIndex = (backIndex + 1) % capacity;

        // Inserts the new element at the back of the queue
        arr[backIndex] = val;

        // Increments the current size
        currentSize++;

        // Returns true to indicate successful enqueue operation
        return true;
    }

    int dequeue() {
        if (empty()) {

            // Returns -1 if the queue is empty and cannot dequeue
            // elements
            return -1;
        }

        // Stores the element to be dequeued
        int dequeuedElement = arr[frontIndex];

        // Calculates the next front index in a circular manner
        frontIndex = (frontIndex + 1) % capacity;

        // Decrements the current size
        currentSize--;

        // Returns the dequeued element
        return dequeuedElement;
    }
};
```
