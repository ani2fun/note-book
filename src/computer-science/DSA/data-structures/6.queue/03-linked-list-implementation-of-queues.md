# 3. Linked list implementation of queues

## Table of contents

1. [Structure of a linked list based queue](#structure-of-a-linked-list-based-queue)
2. [Implementing a queue class using a linked list](#implementing-a-queue-class-using-a-linked-list)
3. [Determining the size of the queue](#determining-the-size-of-the-queue)
4. [Checking of the queue is empty](#checking-of-the-queue-is-empty)
5. [Accessing the front of the queue](#accessing-the-front-of-the-queue)
6. [Accessing the back of the queue](#accessing-the-back-of-the-queue)
7. [Enqueuing an item in the queue](#enqueuing-an-item-in-the-queue)
8. [Dequeuing an item from the queue](#dequeuing-an-item-from-the-queue)
9. [Design a queue using linked list](#design-a-queue-using-linked-list)

***

# Structure of a linked list based queue

Going back to the definition of a queue, it is a linear data structure that only supports enqueue and dequeue operations to add and remove data items from the back and front of the end of the queue, respectively. Like an array, a linked list is another data structure that is the perfect candidate for implementing a queue. Unlike arrays, which have a fixed size and are used to implement **bounded**queues, linked lists can be as big as the computer memory permits, so they can be used to implement an **unbounded**queue. 

// Diagram: Implementation of a queue using a linked list

## State information

Like the array implementation, when implementing a queue using a linked list, we need to hold and keep updated certain **state information** alongside the linked list that holds all the data items to ensure all queue operations work as desired. Let us look at all the state information we need to maintain

### Front

Unlike in the array implementation, where we had to use the `frontIndex` variable to store this information, in a linked list implementation, we can use the `head` of the list. If we restrict inserting data items only at the **end** of the list, the `head` becomes the **front** of the queue.

// Diagram: The head is also the front of the queue

### Back

Unlike in the array implementation where we had to use the `backIndex` variable to store this information, in a linked list implementation, we can use the `tail` of the list. If we restrict removing data items only from the **beginning** of the list, the `tail` becomes the **back** of the queue.

// Diagram: The tail pointer is also the pointer to the back of the queue

### Size

Similar to the array implementation of the queue, we need to store the size information in a variable to know the current size. Every time data is enqueued or dequeued from the queue, the value of `currentSize` is incremented or decremented by 1.

// Diagram: The current size of the linked list used to implement a queue is stored in a variable

### Capacity

The linked list implementation of a queue can be used to implement both **bounded** and **unbounded**queues. Since unbounded queues have unlimited capacity, we don't need to store the maximum limit in any variable. However, when implementing a bounded queue using linked lists, we store that maximum limit in a `capacity`variable similar to the array implementation. Whenever we add a data item to the queue, we must ensure that the queue size doesn't exceed the queue's capacity. 

// Diagram: We will only learn the linked list implementation of a bounded queue in this course

***

# Implementing a queue class using a linked list

Like arrays, a class can **encapsulate** all the state information needed to implement a queue using a linked list, along with the linked list itself and all the operations that can be performed on a queue. The fundamental idea is the same. However, the implementation is different.

// Diagram: Representation of linked list implementation of a bounded queue encapsulated in a class

## Linked list node

Unlike the array implementation of the queue, where the data type of the items in the queue is the data type of the internal array, in the linked list implementation, we also need to define the **node** type for the internal linked list.

As you can see below, the node structure for the internal linked list is the same as that of a generic singly linked list.

// Diagram: Linked list node for implementing a queue

C++

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

// Diagram: using namespace std;

class Queue {
public:

    // Capacity of the queue (maximum number of elements it can hold)
    int capacity;

    // Current number of elements in the queue
    int currentSize;

    // Pointer to the front of the queue
    ListNode *head;

    // Pointer to the rear of the queue
    ListNode *tail;

    Queue(int capacity) {
        this->capacity = capacity;
        currentSize = 0;
        head = nullptr;
        tail = nullptr;
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
// Definition for singly-linked list.
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
};
```

Typescript

```typescript
// Definition for singly-linked list.
class ListNode {
    val: number
    next: ListNode | null
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val===undefined ? 0 : val)
        this.next = (next===undefined ? null : next)
    }
```

Javascript

```javascript
// Definition for singly-linked list.
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}
```

Python

```python
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None
```

## Queue class

Like in the array implementation of a queue, a queue class can be implemented by defining a class where all the data members are private to the class, and the operations are exposed to users as functions that manipulate the data members. We do not need a parameterized constructor in the linked list implementation of the queue class when implementing an **unbounded**queue. However, since we are implementing a **bounded**queue, we define a parameterized constructor to set the `capacity` of the queue at the time of its creation.

C++

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

// Diagram: using namespace std;

class Queue {
public:

    // Capacity of the queue (maximum number of elements it can hold)
    int capacity;

    // Current number of elements in the queue
    int currentSize;

    // Pointer to the front of the queue
    ListNode *head;

    // Pointer to the rear of the queue
    ListNode *tail;

    Queue(int capacity) {
        this->capacity = capacity;
        currentSize = 0;
        head = nullptr;
        tail = nullptr;
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
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

// Diagram: class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    public int capacity;

    // Current number of elements in the queue
    public int currentSize;

    // Reference to the front of the queue
    public ListNode head;

    // Reference to the rear of the queue
    public ListNode tail;

    public Queue(int capacity) {
        this.capacity = capacity;
        currentSize = 0;
        head = null;
        tail = null;
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
/**
```

Javascript

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

// Diagram: export class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    capacity;

    // Current number of elements in the queue
    currentSize;

    // Reference to the front of the queue
    head;

    // Reference to the rear of the queue
    tail;

    constructor(capacity) {
        this.capacity = capacity;
        this.currentSize = 0;
        this.head = null;
        this.tail = null;
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
from typing import Optional

"""
Definition for singly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None
"""

class Queue:
    def __init__(self, capacity: int):

        # Capacity of the queue (maximum number of elements it can hold)
        self.capacity: int = capacity

        # Current number of elements in the queue
        self.current_size: int = 0

        # Reference to the front of the queue
        self.head: Optional[ListNode] = None

        # Reference to the rear of the queue
        self.tail: Optional[ListNode] = None

    def size(self):
        pass

    def empty(self):
        pass

    def front(self):
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
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

// Diagram: using namespace std;

class Queue {
public:

    // Capacity of the queue (maximum number of elements it can hold)
    int capacity;

    // Current number of elements in the queue
    int currentSize;

    // Pointer to the front of the queue
    ListNode *head;

    // Pointer to the rear of the queue
    ListNode *tail;

    Queue(int capacity) {
        this->capacity = capacity;
        currentSize = 0;
        head = nullptr;
        tail = nullptr;
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
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

// Diagram: class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    public int capacity;

    // Current number of elements in the queue
    public int currentSize;

    // Reference to the front of the queue
    public ListNode head;

    // Reference to the rear of the queue
    public ListNode tail;

    public Queue(int capacity) {
        this.capacity = capacity;
        currentSize = 0;
        head = null;
        tail = null;
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
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

// Diagram: export class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    capacity: number;

    // Current number of elements in the queue
    currentSize: number;

    // Reference to the front of the queue
    head: ListNode | null;

    // Reference to the rear of the queue
    tail: ListNode | null;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.currentSize = 0;
        this.head = null;
        this.tail = null;
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
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

// Diagram: export class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    capacity;

    // Current number of elements in the queue
    currentSize;

    // Reference to the front of the queue
    head;

    // Reference to the rear of the queue
    tail;

    constructor(capacity) {
        this.capacity = capacity;
        this.currentSize = 0;
        this.head = null;
        this.tail = null;
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
from typing import Optional

"""
Definition for singly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None
"""

class Queue:
    def __init__(self, capacity: int):

        # Capacity of the queue (maximum number of elements it can hold)
        self.capacity: int = capacity

        # Current number of elements in the queue
        self.current_size: int = 0

        # Reference to the front of the queue
        self.head: Optional[ListNode] = None

        # Reference to the rear of the queue
        self.tail: Optional[ListNode] = None

    def size(self):
        pass

    def empty(self):
        pass

    def front(self):
        pass

    def enqueue(self, val):
        pass

    def dequeue(self):
        pass
```

Let's examine what happens when the code is executed to understand better how encapsulating all the data and state information needed to implement a queue, along with the linked list and all the operations in a class, is useful.

// Diagram: Execution of code using an instance (object) of the queue class

Now that we know what a queue's linked list implementation looks like and how it functions, we will learn more about the implementation of each function in the coming lessons.

***

# Determining the size of the queue

The size operation informs the caller of the current size of the queue. Similar to the array implementation, we utilize the `currentSize` variable that we maintain. Without storing that, the only method to determine the size of a linked list is to traverse it, which is very costly. For this reason, we keep the `currentSize` variable in the queue class that tracks the current size of the queue.

// Diagram: Size of the queue is stored in a member variable of the queue class

## Algorithm

// Diagram: The size operation in a queue class implemented using a linked list can be summarized as the following algorithm

> **Algorithm**
>
> -   **Step 1:** Return the value of \`currentSize\`.

## Implementation

The implementation is a quite simple one-line statement returning the value of the `currentSize` variable.

C++

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

// Diagram: using namespace std;

class Queue {
public:

    // Capacity of the queue (maximum number of elements it can hold)
    int capacity;

    // Current number of elements in the queue
    int currentSize;

    // Pointer to the front of the queue
    ListNode *head;

    // Pointer to the rear of the queue
    ListNode *tail;

    Queue(int capacity) {
        this->capacity = capacity;
        currentSize = 0;
        head = nullptr;
        tail = nullptr;
    }

// Diagram: int size() {

        // Returns the current number of elements in the queue
        return currentSize;
    }
};
```

Java

```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

// Diagram: class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    public int capacity;

    // Current number of elements in the queue
    public int currentSize;

    // Reference to the front of the queue
    public ListNode head;

    // Reference to the rear of the queue
    public ListNode tail;

    public Queue(int capacity) {
        this.capacity = capacity;
        currentSize = 0;
        head = null;
        tail = null;
    }

// Diagram: public int size() {

        // Returns the current number of elements in the queue
        return currentSize;
    }
```

Typescript

```typescript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

// Diagram: export class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    capacity: number;

    // Current number of elements in the queue
    currentSize: number;

    // Reference to the front of the queue
    head: ListNode | null;

    // Reference to the rear of the queue
    tail: ListNode | null;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.currentSize = 0;
        this.head = null;
        this.tail = null;
    }

// Diagram: size(): number {

        // Returns the current number of elements in the queue
        return this.currentSize;
    }
```

Javascript

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

// Diagram: export class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    capacity;

    // Current number of elements in the queue
    currentSize;

    // Reference to the front of the queue
    head;

    // Reference to the rear of the queue
    tail;

    constructor(capacity) {
        this.capacity = capacity;
        this.currentSize = 0;
        this.head = null;
        this.tail = null;
    }

    size() {

        // Returns the current number of elements in the queue
        return this.currentSize;
    }
```

Python

```python
/**
```

## Complexity Analysis

Since we only return the value of the variable `currentSize`. Both the space and time complexities are constant.

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

# Checking of the queue is empty

As the name suggests, this operation tells the caller if the queue is empty or if some items are already in it. It will return `true` if the queue is empty and `false` otherwise. The implementation is the same as that of the array implementation of a queue. We check if the size of the queue is equal to 0.

// Diagram: Check if the size of the internal linked list is 0 or not

## Algorithm

The empty operation in a queue class implemented using a linked list can be summarized as the following algorithm.

> **Algorithm**
>
> -   **Step 1:** Return \`true\` is the size of the queue is equal to \`0\`, otherwise, return \`false\`.

## Implementation

// Diagram: The implementation is quite simple one-line statement returning true if size() == 0, false otherwise

C++

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

// Diagram: using namespace std;

class Queue {
public:

    // Capacity of the queue (maximum number of elements it can hold)
    int capacity;

    // Current number of elements in the queue
    int currentSize;

    // Pointer to the front of the queue
    ListNode *head;

    // Pointer to the rear of the queue
    ListNode *tail;

    Queue(int capacity) {
        this->capacity = capacity;
        currentSize = 0;
        head = nullptr;
        tail = nullptr;
    }

// Diagram: int size() {

        // Returns the current number of elements in the queue
        return currentSize;
    }

// Diagram: bool empty() {

        // Returns true if the queue is empty, false otherwise
        return currentSize == 0;
    }
};
```

Java

```java
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

// Diagram: using namespace std;

class Queue {
public:

    // Capacity of the queue (maximum number of elements it can hold)
    int capacity;

    // Current number of elements in the queue
    int currentSize;

    // Pointer to the front of the queue
    ListNode *head;
```

Typescript

```typescript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

// Diagram: export class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    capacity: number;

    // Current number of elements in the queue
    currentSize: number;

    // Reference to the front of the queue
    head: ListNode | null;

    // Reference to the rear of the queue
    tail: ListNode | null;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.currentSize = 0;
        this.head = null;
        this.tail = null;
    }

// Diagram: size(): number {

        // Returns the current number of elements in the queue
        return this.currentSize;
    }

// Diagram: empty(): boolean {

        // Returns true if the queue is empty, false otherwise
        return this.currentSize === 0;
    }
```

Javascript

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

// Diagram: export class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    capacity;

    // Current number of elements in the queue
    currentSize;

    // Reference to the front of the queue
    head;

    // Reference to the rear of the queue
    tail;

    constructor(capacity) {
        this.capacity = capacity;
        this.currentSize = 0;
        this.head = null;
        this.tail = null;
    }

    size() {

        // Returns the current number of elements in the queue
        return this.currentSize;
    }

    empty() {

        // Returns true if the queue is empty, false otherwise
        return this.currentSize === 0;
    }
```

Python

```python
from typing import Optional

"""
Definition for singly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None
"""

class Queue:
    def __init__(self, capacity: int):

        # Capacity of the queue (maximum number of elements it can hold)
        self.capacity: int = capacity

        # Current number of elements in the queue
        self.current_size: int = 0

        # Reference to the front of the queue
        self.head: Optional[ListNode] = None

        # Reference to the rear of the queue
        self.tail: Optional[ListNode] = None

    def size(self) -> int:

        # Returns the current number of elements in the queue
        return self.current_size

    def empty(self) -> bool:

        # Returns True if the queue is empty, False otherwise
        return self.current_size == 0
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

The front operation returns the value stored at the **front** of the queue. In the linked list implementation of a queue, the **front** of the queue is the `head` node of the linked list. We have two cases to consider here.

## 1\. Queue is empty

We can return `-1` to indicate that there are no items in the queue. Ideally, we should be throwing an error, but for the sake of simplicity here, we return `-1`

// Diagram: Empty queue does not have a front

> **Algorithm**
>
> -   **Step 1:** If the queue is empty, return \`-1\` to indicate that there is no front element.

## 2\. Queue is not empty

If the queue is not empty, we return the data value of the `head` node is the first item in the internal linked list, representing the **front** of the queue.

// Diagram: The first node in the linked list is the front of the queue

> **Algorithm**
>
> -   **Step 1:** If the queue is not empty, return the value stored in the \`head\` node of the internal linked list.

## Implementation

The implementation is quite simple. We write all the cases in conditional blocks to implement the front operation.

C++

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

// Diagram: using namespace std;

class Queue {
public:

    // Capacity of the queue (maximum number of elements it can hold)
    int capacity;

    // Current number of elements in the queue
    int currentSize;

    // Pointer to the front of the queue
    ListNode *head;

    // Pointer to the rear of the queue
    ListNode *tail;

    Queue(int capacity) {
        this->capacity = capacity;
        currentSize = 0;
        head = nullptr;
        tail = nullptr;
    }

// Diagram: int size() {

        // Returns the current number of elements in the queue
        return currentSize;
    }

// Diagram: bool empty() {

        // Returns true if the queue is empty, false otherwise
        return currentSize == 0;
    }

// Diagram: int front() {

        // Returns -1 if the queue is empty
        if (empty()) {
            return -1;
        }

        // Returns the value of the element at the front of the queue
        return head->val;
    }
};
```

Java

```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

// Diagram: class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    public int capacity;

    // Current number of elements in the queue
    public int currentSize;

    // Reference to the front of the queue
    public ListNode head;

    // Reference to the rear of the queue
    public ListNode tail;

    public Queue(int capacity) {
        this.capacity = capacity;
        currentSize = 0;
        head = null;
        tail = null;
    }

// Diagram: public int size() {

        // Returns the current number of elements in the queue
        return currentSize;
    }

// Diagram: public boolean empty() {

        // Returns true if the queue is empty, false otherwise
        return currentSize == 0;
    }

// Diagram: public int front() {

        // Returns -1 if the queue is empty
        if (empty()) {
            return -1;
        }

        // Returns the value of the element at the front of the queue
        return head.val;
    }
```

Typescript

```typescript
/**
```

Javascript

```javascript
/**
```

Python

```python
from typing import Optional

"""
Definition for singly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None
"""

class Queue:
    def __init__(self, capacity: int):

        # Capacity of the queue (maximum number of elements it can hold)
        self.capacity: int = capacity

        # Current number of elements in the queue
        self.current_size: int = 0

        # Reference to the front of the queue
        self.head: Optional[ListNode] = None

        # Reference to the rear of the queue
        self.tail: Optional[ListNode] = None

    def size(self) -> int:

        # Returns the current number of elements in the queue
        return self.current_size

    def empty(self) -> bool:

        # Returns True if the queue is empty, False otherwise
        return self.current_size == 0

    def front(self) -> int:

        # Returns -1 if the queue is empty
        if self.empty():
            return -1

        # Returns the value of the element at the front of the queue
        if self.head:
            return self.head.val

        return -1
```

## Complexity Analysis

The `front()` function returns the data stored in the head node (the first node in the list). Hence, both the space and time complexities are **O(1)**.

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

The back operation returns the value stored at the **back** of the queue. In the linked list implementation of a queue, the **back** of the queue is the `tail` node of the linked list. We have two cases to consider here.

## 1\. Queue is empty

We can return `-1` to indicate that there are no items in the queue. Ideally, we should be throwing an error, but for the sake of simplicity here, we return `-1`

// Diagram: Empty queue does not have a back

> **Algorithm**
>
> -   **Step 1:** If the queue is empty, return \`-1\` to indicate that there is no back element.

## 2\. Queue is not empty

If the queue is not empty, we return the data value of the `tail` node is the first item in the internal linked list, representing the **back** of the queue.

// Diagram: The last node in the linked list is the front of the queue

> **Algorithm**
>
> -   **Step 1:** If the queue is not empty, return the value stored in the \`tail\` node of the internal linked list.

## Implementation

The implementation is quite simple. We write all the cases in conditional blocks to implement the front operation.

C++

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

// Diagram: using namespace std;

class Queue {
public:

    // Capacity of the queue (maximum number of elements it can hold)
    int capacity;

    // Current number of elements in the queue
    int currentSize;

    // Pointer to the front of the queue
    ListNode *head;

    // Pointer to the rear of the queue
    ListNode *tail;

    Queue(int capacity) {
        this->capacity = capacity;
        currentSize = 0;
        head = nullptr;
        tail = nullptr;
    }

// Diagram: int size() {

        // Returns the current number of elements in the queue
        return currentSize;
    }

// Diagram: bool empty() {

        // Returns true if the queue is empty, false otherwise
        return currentSize == 0;
    }

// Diagram: int front() {

        // Returns -1 if the queue is empty
        if (empty()) {
            return -1;
        }

        // Returns the value of the element at the front of the queue
        return head->val;
    }

// Diagram: int back() {

        // Returns -1 if the queue is empty
        if (empty()) {
            return -1;
        }

        // Returns the value of the element at the back of the queue
        return tail->val;
    }
};
```

Java

```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

// Diagram: class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    public int capacity;

    // Current number of elements in the queue
    public int currentSize;

    // Reference to the front of the queue
    public ListNode head;

    // Reference to the rear of the queue
    public ListNode tail;

    public Queue(int capacity) {
        this.capacity = capacity;
        currentSize = 0;
        head = null;
        tail = null;
    }

// Diagram: public int size() {

        // Returns the current number of elements in the queue
        return currentSize;
    }

// Diagram: public boolean empty() {

        // Returns true if the queue is empty, false otherwise
        return currentSize == 0;
    }

// Diagram: public int front() {

        // Returns -1 if the queue is empty
        if (empty()) {
            return -1;
        }

        // Returns the value of the element at the front of the queue
        return head.val;
    }

// Diagram: public int back() {

        // Returns -1 if the queue is empty
        if (empty()) {
            return -1;
        }

        // Returns the value of the element at the back of the queue
        return tail.val;
    }
```

Typescript

```typescript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

// Diagram: export class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    capacity: number;

    // Current number of elements in the queue
    currentSize: number;

    // Reference to the front of the queue
    head: ListNode | null;

    // Reference to the rear of the queue
    tail: ListNode | null;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.currentSize = 0;
        this.head = null;
        this.tail = null;
    }

// Diagram: size(): number {

        // Returns the current number of elements in the queue
        return this.currentSize;
    }

// Diagram: empty(): boolean {

        // Returns true if the queue is empty, false otherwise
        return this.currentSize === 0;
    }

// Diagram: front(): number {

        // Returns -1 if the queue is empty
        if (this.empty()) {
            return -1;
        }

        // Returns the value of the element at the front of the queue
        return this.head!.val;
    }

// Diagram: back(): number {

        // Returns -1 if the queue is empty
        if (this.empty()) {
            return -1;
        }

        // Returns the value of the element at the back of the queue
        return this.tail!.val;
    }
```

Javascript

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

// Diagram: export class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    capacity;

    // Current number of elements in the queue
    currentSize;

    // Reference to the front of the queue
    head;

    // Reference to the rear of the queue
    tail;

    constructor(capacity) {
        this.capacity = capacity;
        this.currentSize = 0;
        this.head = null;
        this.tail = null;
    }

    size() {

        // Returns the current number of elements in the queue
        return this.currentSize;
    }

    empty() {

        // Returns true if the queue is empty, false otherwise
        return this.currentSize === 0;
    }

    front() {

        // Returns -1 if the queue is empty
        if (this.empty()) {
            return -1;
        }

        // Returns the value of the element at the front of the queue
        return this.head.val;
    }

    back() {

        // Returns -1 if the queue is empty
        if (this.empty()) {
            return -1;
        }

        // Returns the value of the element at the back of the queue
        return this.tail.val;
    }
```

Python

```python
from typing import Optional

"""
Definition for singly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None
"""

class Queue:
    def __init__(self, capacity: int):

        # Capacity of the queue (maximum number of elements it can hold)
        self.capacity: int = capacity

        # Current number of elements in the queue
        self.current_size: int = 0

        # Reference to the front of the queue
        self.head: Optional[ListNode] = None

        # Reference to the rear of the queue
        self.tail: Optional[ListNode] = None

    def size(self) -> int:

        # Returns the current number of elements in the queue
        return self.current_size

    def empty(self) -> bool:

        # Returns True if the queue is empty, False otherwise
        return self.current_size == 0

    def front(self) -> int:

        # Returns -1 if the queue is empty
        if self.empty():
            return -1

        # Returns the value of the element at the front of the queue
        if self.head:
            return self.head.val

        return -1

    def back(self) -> int:

        # Returns -1 if the queue is empty
        if self.empty():
            return -1

        # Returns the value of the element at the back of the queue
        if self.head:
            return self.tail.val

        return -1
```

## Complexity Analysis

The `back()` function returns the data stored in the tail node (the last node in the list). Hence, both the space and time complexities are **O(1)**.

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

# Enqueuing an item in the queue

The enqueue operation in a queue is implemented using a linked list by adding the data item at the end of the internal linked list using the `tail` node. Addition only happens after ensuring that we do not exceed the `capacity` of the queue after this operation. The implementation is quite straightforward, though there are certain cases that we need to consider.

## 1\. Queue is full

Since the queue is full, we cannot add more data without removing some items. We will return `false` as this operation cannot be done.

// Diagram: Cannot enqueue data to the queue if it is full

> **Algorithm**
>
> -   **Step 1:** If the queue is full, return \`false\` to indicate that the operation was unsuccessful.

## 2\. Queue is empty

In this case, both the `head` and `tail` would be `null`. We need to create a new node and update both `head` and `tail` to hold it. Finally, we increment the value of the internal `currentSize` variable by 1 and return `true`.

// Diagram: Enqueue data to an empty queue

> **Algorithm**
>
> -   **Step 1:** If the queue is empty, create a new node with the given data.
> -   **Step 2:** Set the new node's \`next\` pointer to \`null\` since it's the only node.
> -   **Step 3:** Update the head pointer to hold the reference of the new node.
> -   **Step 4:** Update the tail pointer to hold the reference of the new node.
> -   **Step 5:** Increment the \`currentSize\` by \`1\`.
> -   **Step 6:** Return \`true\` to indicate that the operation was successful.

## 3\. Queue is not empty

In this case, we must add a new node with the given data value at the end of the internal linked list. We create the new node with the given value and update the  section of the current `tail` node to hold the newly created node. Finally, we increment the value of the `currentSize` variable by 1 and return `true`.

// Diagram: Enqueue data to a non empty queue

> **Algorithm**
>
> -   **Step 1:** If the queue is not empty, create a new node with the given data.
> -   **Step 2:** Set the new node's \`next\` pointer to \`null\` since it's the new tail node.
> -   **Step 3:** Set the tail node's \`next\` pointer to hold the reference of the new node.
> -   **Step 4:** Update the tail pointer to hold the reference of the new node.
> -   **Step 5:** Increment the \`currentSize\` by \`1\`.
> -   **Step 6:** Return \`true\` to indicate that the operation was successful.

## Implementation

The implementation is quite simple. We write all the cases in conditional blocks to implement the enqueue operation.

C++

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

// Diagram: using namespace std;

class Queue {
public:

    // Capacity of the queue (maximum number of elements it can hold)
    int capacity;

    // Current number of elements in the queue
    int currentSize;

    // Pointer to the front of the queue
    ListNode *head;

    // Pointer to the rear of the queue
    ListNode *tail;

    Queue(int capacity) {
        this->capacity = capacity;
        currentSize = 0;
        head = nullptr;
        tail = nullptr;
    }

// Diagram: int size() {

        // Returns the current number of elements in the queue
        return currentSize;
    }

// Diagram: bool empty() {

        // Returns true if the queue is empty, false otherwise
        return currentSize == 0;
    }

// Diagram: int front() {

        // Returns -1 if the queue is empty
        if (empty()) {
            return -1;
        }

        // Returns the value of the element at the front of the queue
        return head->val;
    }

// Diagram: int back() {

        // Returns -1 if the queue is empty
        if (empty()) {
            return -1;
        }

        // Returns the value of the element at the back of the queue
        return tail->val;
    }

// Diagram: bool enqueue(int val) {

        // Returns false if the queue is full and cannot enqueue more
        // elements
        if (currentSize == capacity) {
            return false;
        }

        // Create a new node with the given val
        ListNode *newNode = new ListNode(val);

        // If the queue is empty, the new node becomes both the front
        // and rear node
        if (empty()) {
            head = newNode;
            tail = newNode;
        }

        // Otherwise, add the new node to the end of the queue
        // and update the tail pointer
        else {

            // Add the new node to the end of the queue
            tail->next = newNode;

            // Update the tail pointer to the new node
            tail = newNode;
        }

        // Increase the current size of the queue
        currentSize++;

        // Return true to indicate successful enqueue operation
        return true;
    }
};
```

Java

```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

// Diagram: class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    public int capacity;

    // Current number of elements in the queue
    public int currentSize;

    // Reference to the front of the queue
    public ListNode head;

    // Reference to the rear of the queue
    public ListNode tail;

    public Queue(int capacity) {
        this.capacity = capacity;
        currentSize = 0;
        head = null;
        tail = null;
    }

// Diagram: public int size() {

        // Returns the current number of elements in the queue
        return currentSize;
    }

// Diagram: public boolean empty() {

        // Returns true if the queue is empty, false otherwise
        return currentSize == 0;
    }

// Diagram: public int front() {

        // Returns -1 if the queue is empty
        if (empty()) {
            return -1;
        }

        // Returns the value of the element at the front of the queue
        return head.val;
    }

// Diagram: public int back() {

        // Returns -1 if the queue is empty
        if (empty()) {
            return -1;
        }

        // Returns the value of the element at the back of the queue
        return tail.val;
    }

// Diagram: public boolean enqueue(int val) {

        // Returns false if the queue is full and cannot enqueue more
        // elements
        if (currentSize == capacity) {
            return false;
        }

        // Create a new node with the given val
        ListNode newNode = new ListNode(val);

        // If the queue is empty, the new node becomes both the front
        // and rear node
        if (empty()) {
            head = newNode;
            tail = newNode;
        }

        // Otherwise, add the new node to the end of the queue and update
        // the tail reference
        else {

            // Add the new node to the end of the queue
            tail.next = newNode;

            // Update the tail reference to the new node
            tail = newNode;
        }

        // Increase the current size of the queue
        currentSize++;

        // Return true to indicate successful enqueue operation
        return true;
    }
```

Typescript

```typescript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

// Diagram: export class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    capacity: number;

    // Current number of elements in the queue
    currentSize: number;

    // Reference to the front of the queue
    head: ListNode | null;

    // Reference to the rear of the queue
    tail: ListNode | null;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.currentSize = 0;
        this.head = null;
        this.tail = null;
    }

// Diagram: size(): number {

        // Returns the current number of elements in the queue
        return this.currentSize;
    }

// Diagram: empty(): boolean {

        // Returns true if the queue is empty, false otherwise
        return this.currentSize === 0;
    }

// Diagram: front(): number {

        // Returns -1 if the queue is empty
        if (this.empty()) {
            return -1;
        }

        // Returns the value of the element at the front of the queue
        return this.head!.val;
    }

// Diagram: back(): number {

        // Returns -1 if the queue is empty
        if (this.empty()) {
            return -1;
        }

        // Returns the value of the element at the back of the queue
        return this.tail!.val;
    }

// Diagram: enqueue(val: number): boolean {

        // Returns false if the queue is full and cannot enqueue more
        // elements
        if (this.currentSize === this.capacity) {
            return false;
        }

        // Create a new node with the given val
        const newNode = new ListNode(val);

        // If the queue is empty, the new node becomes both the front
        // and rear node
        if (this.empty()) {
            this.head = newNode;
            this.tail = newNode;
        }

        // Otherwise, add the new node to the end of the queue and update
        // the rear reference
        else {

            // Add the new node to the end of the queue
            this.tail!.next = newNode;

            // Update the rear reference to the new node
            this.tail = newNode;
        }

        // Increase the current size of the queue
        this.currentSize++;

        // Return true to indicate successful enqueue operation
        return true;
    }
```

Javascript

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

// Diagram: export class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    capacity;

    // Current number of elements in the queue
    currentSize;

    // Reference to the front of the queue
    head;

    // Reference to the rear of the queue
    tail;

    constructor(capacity) {
        this.capacity = capacity;
        this.currentSize = 0;
        this.head = null;
        this.tail = null;
    }

    size() {

        // Returns the current number of elements in the queue
        return this.currentSize;
    }

    empty() {

        // Returns true if the queue is empty, false otherwise
        return this.currentSize === 0;
    }

    front() {

        // Returns -1 if the queue is empty
        if (this.empty()) {
            return -1;
        }

        // Returns the value of the element at the front of the queue
        return this.head.val;
    }

    back() {

        // Returns -1 if the queue is empty
        if (this.empty()) {
            return -1;
        }

        // Returns the value of the element at the back of the queue
        return this.tail.val;
    }

// Diagram: enqueue(val) {

        // Returns false if the queue is full and cannot enqueue more
        // elements
        if (this.currentSize === this.capacity) {
            return false;
        }

        // Create a new node with the given val
        const newNode = new ListNode(val);

        // If the queue is empty, the new node becomes both the front
        // and rear node
        if (this.empty()) {
            this.head = newNode;
            this.tail = newNode;
        }

        // Otherwise, add the new node to the end of the queue and update
        // the tail reference
        else {

            // Add the new node to the end of the queue
            this.tail.next = newNode;

            // Update the tail reference to the new node
            this.tail = newNode;
        }

        // Increase the current size of the queue
        this.currentSize++;

        // Return true to indicate successful enqueue operation
        return true;
    }
```

Python

```python
from typing import Optional

"""
Definition for singly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None
"""

class Queue:
    def __init__(self, capacity: int):

        # Capacity of the queue (maximum number of elements it can hold)
        self.capacity: int = capacity

        # Current number of elements in the queue
        self.current_size: int = 0

        # Reference to the front of the queue
        self.head: Optional[ListNode] = None

        # Reference to the rear of the queue
        self.tail: Optional[ListNode] = None

    def size(self) -> int:

        # Returns the current number of elements in the queue
        return self.current_size

    def empty(self) -> bool:

        # Returns True if the queue is empty, False otherwise
        return self.current_size == 0

    def front(self) -> int:

        # Returns -1 if the queue is empty
        if self.empty():
            return -1

        # Returns the value of the element at the front of the queue
        if self.head:
            return self.head.val

        return -1

    def back(self) -> int:

        # Returns -1 if the queue is empty
        if self.empty():
            return -1

        # Returns the value of the element at the back of the queue
        if self.head:
            return self.tail.val

        return -1

    def enqueue(self, val: int) -> bool:

        # Returns False if the queue is full and cannot enqueue more
        # elements
        if self.current_size == self.capacity:
            return False

        # Create a new node with the given val
        new_node: ListNode = ListNode(val)

        # If the queue is empty, the new node becomes both the front
        # and rear node
        if self.empty():
            self.head = new_node
            self.tail = new_node

        # Otherwise, add the new node to the end of the queue and update
        # the rear reference
        else:

            # Add the new node to the end of the queue
            if self.tail:
                self.tail.next = new_node

                # Update the rear reference to the new node
                self.tail = new_node

        # Increase the current size of the queue
        self.current_size += 1

        # Return True to indicate successful enqueue operation
        return True
```

## Complexity Analysis

In any case, we create a single new node and update the `tail` which takes constant time and space.

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

The dequeue operation is the only way to remove a data item from the queue. It is implemented by removing the data item at the **front** of the internal linked list using the `head`. The implementation is quite straightforward, though there are certain cases that we need to consider.

## 1\. Queue is empty

We return `-1`here to indicate this is an invalid operation, as no item is at the front of the queue.

// Diagram: Dequeue operation when queue is empty

> **Algorithm**
>
> -   **Step 1:** If the queue is empty, return \`-1\` to indicate that the operation was unsuccessful.

## 2\. Queue is not empty

In this case, we need to update `head` to hold the second node in our internal linked list and delete the first node. However, before updating `head` we must hold the current **head** node in a temporary variable so that we can delete it after modifying `head`. We must also store the data value of that **head** node in a variable so that we can return its value after the node is deleted. The final step is to decrease the `currentSize` by 1.

// Diagram: Dequeue operation when the queue is not empty

> **Algorithm**
>
> -   **Step 1:** If the queue is not empty, store the value of the element at the \`head\` node of the internal linked list in a temporary variable.
> -   **Step 2:** Move the \`head\` pointer to the next node.
> -   **Step 3:** Delete the original \`head\` node to free up memory.
> -   **Step 4:** Decrement the \`currentSize\` by \`1\`.
> -   **Step 5**: Return the value stored in the temporary variable.

## Implementation

The implementation is quite simple. We write all the cases in conditional blocks to implement the dequeue operation.

C++

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

// Diagram: using namespace std;

class Queue {
public:

    // Capacity of the queue (maximum number of elements it can hold)
    int capacity;

    // Current number of elements in the queue
    int currentSize;

    // Pointer to the front of the queue
    ListNode *head;

    // Pointer to the rear of the queue
    ListNode *tail;

    Queue(int capacity) {
        this->capacity = capacity;
        currentSize = 0;
        head = nullptr;
        tail = nullptr;
    }

// Diagram: int size() {

        // Returns the current number of elements in the queue
        return currentSize;
    }

// Diagram: bool empty() {

        // Returns true if the queue is empty, false otherwise
        return currentSize == 0;
    }

// Diagram: int front() {

        // Returns -1 if the queue is empty
        if (empty()) {
            return -1;
        }

        // Returns the value of the element at the front of the queue
        return head->val;
    }

// Diagram: int back() {

        // Returns -1 if the queue is empty
        if (empty()) {
            return -1;
        }

        // Returns the value of the element at the back of the queue
        return tail->val;
    }

// Diagram: bool enqueue(int val) {

        // Returns false if the queue is full and cannot enqueue more
        // elements
        if (currentSize == capacity) {
            return false;
        }

        // Create a new node with the given val
        ListNode *newNode = new ListNode(val);

        // If the queue is empty, the new node becomes both the front
        // and rear node
        if (empty()) {
            head = newNode;
            tail = newNode;
        }

        // Otherwise, add the new node to the end of the queue
        // and update the tail pointer
        else {

            // Add the new node to the end of the queue
            tail->next = newNode;

            // Update the tail pointer to the new node
            tail = newNode;
        }

        // Increase the current size of the queue
        currentSize++;

        // Return true to indicate successful enqueue operation
        return true;
    }

// Diagram: int dequeue() {

        // Returns -1 if the queue is empty and cannot dequeue any
        // elements
        if (empty()) {
            return -1;
        }

        // Create a temporary pointer to the front node
        ListNode *frontNode = head;

        // Get the value of the front node
        int dequeuedData = frontNode->val;

        // Update the front pointer to the next node in the queue
        head = head->next;

        // Delete the previous front node
        delete frontNode;

        // If the front pointer is nullptr after dequeue, the queue
        // becomes empty, so update the tail pointer as well
        if (head == nullptr) {
            tail = nullptr;
        }

        // Decrease the current size of the queue
        currentSize--;

        // Return the dequeued value
        return dequeuedData;
    }
};
```

Java

```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

// Diagram: class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    public int capacity;

    // Current number of elements in the queue
    public int currentSize;

    // Reference to the front of the queue
    public ListNode head;

    // Reference to the rear of the queue
    public ListNode tail;

    public Queue(int capacity) {
        this.capacity = capacity;
        currentSize = 0;
        head = null;
        tail = null;
    }

// Diagram: public int size() {

        // Returns the current number of elements in the queue
        return currentSize;
    }

// Diagram: public boolean empty() {

        // Returns true if the queue is empty, false otherwise
        return currentSize == 0;
    }

// Diagram: public int front() {

        // Returns -1 if the queue is empty
        if (empty()) {
            return -1;
        }

        // Returns the value of the element at the front of the queue
        return head.val;
    }

// Diagram: public int back() {

        // Returns -1 if the queue is empty
        if (empty()) {
            return -1;
        }

        // Returns the value of the element at the back of the queue
        return tail.val;
    }

// Diagram: public boolean enqueue(int val) {

        // Returns false if the queue is full and cannot enqueue more
        // elements
        if (currentSize == capacity) {
            return false;
        }

        // Create a new node with the given val
        ListNode newNode = new ListNode(val);

        // If the queue is empty, the new node becomes both the front
        // and rear node
        if (empty()) {
            head = newNode;
            tail = newNode;
        }

        // Otherwise, add the new node to the end of the queue and update
        // the tail reference
        else {

            // Add the new node to the end of the queue
            tail.next = newNode;

            // Update the tail reference to the new node
            tail = newNode;
        }

        // Increase the current size of the queue
        currentSize++;

        // Return true to indicate successful enqueue operation
        return true;
    }

// Diagram: public int dequeue() {

        // Returns -1 if the queue is empty and cannot dequeue any
        // elements
        if (empty()) {
            return -1;
        }

        // Create a temporary reference to the front node
        ListNode frontNode = head;

        // Get the value of the front node
        int dequeuedData = frontNode.val;

        // Update the front reference to the next node in the queue
        head = head.next;

        // Delete the previous front node
        frontNode = null;

        // If the front reference is null after dequeue, the queue
        // becomes empty, so update the tail reference as well
        if (head == null) {
            tail = null;
        }

        // Decrease the current size of the queue
        currentSize--;

        // Return the dequeued value
        return dequeuedData;
    }
```

Typescript

```typescript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

// Diagram: export class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    capacity: number;

    // Current number of elements in the queue
    currentSize: number;

    // Reference to the front of the queue
    head: ListNode | null;

    // Reference to the rear of the queue
    tail: ListNode | null;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.currentSize = 0;
        this.head = null;
        this.tail = null;
    }

// Diagram: size(): number {

        // Returns the current number of elements in the queue
        return this.currentSize;
    }

// Diagram: empty(): boolean {

        // Returns true if the queue is empty, false otherwise
        return this.currentSize === 0;
    }

// Diagram: front(): number {

        // Returns -1 if the queue is empty
        if (this.empty()) {
            return -1;
        }

        // Returns the value of the element at the front of the queue
        return this.head!.val;
    }

// Diagram: back(): number {

        // Returns -1 if the queue is empty
        if (this.empty()) {
            return -1;
        }

        // Returns the value of the element at the back of the queue
        return this.tail!.val;
    }

// Diagram: enqueue(val: number): boolean {

        // Returns false if the queue is full and cannot enqueue more
        // elements
        if (this.currentSize === this.capacity) {
            return false;
        }

        // Create a new node with the given val
        const newNode = new ListNode(val);

        // If the queue is empty, the new node becomes both the front
        // and rear node
        if (this.empty()) {
            this.head = newNode;
            this.tail = newNode;
        }

        // Otherwise, add the new node to the end of the queue and update
        // the rear reference
        else {

            // Add the new node to the end of the queue
            this.tail!.next = newNode;

            // Update the rear reference to the new node
            this.tail = newNode;
        }

        // Increase the current size of the queue
        this.currentSize++;

        // Return true to indicate successful enqueue operation
        return true;
    }

// Diagram: dequeue(): number {

        // Returns -1 if the queue is empty and cannot dequeue any
        // elements
        if (this.empty()) {
            return -1;
        }

        // Create a temporary reference to the front node
        const frontNode = this.head!;

        // Get the value of the front node
        const dequeuedData = frontNode.val;

        // Update the front reference to the next node in the queue
        this.head = this.head!.next;

        // Delete the previous front node
        frontNode.next = null;

        // If the front reference is null after dequeue, the queue
        // becomes empty, so update the rear reference as well
        if (this.head === null) {
            this.tail = null;
        }

        // Decrease the current size of the queue
        this.currentSize--;

        // Return the dequeued value
        return dequeuedData;
    }
```

Javascript

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

// Diagram: export class Queue {

    // Capacity of the queue (maximum number of elements it can hold)
    capacity;

    // Current number of elements in the queue
    currentSize;

    // Reference to the front of the queue
    head;

    // Reference to the rear of the queue
    tail;

    constructor(capacity) {
        this.capacity = capacity;
        this.currentSize = 0;
        this.head = null;
        this.tail = null;
    }

    size() {

        // Returns the current number of elements in the queue
        return this.currentSize;
    }

    empty() {

        // Returns true if the queue is empty, false otherwise
        return this.currentSize === 0;
    }

    front() {

        // Returns -1 if the queue is empty
        if (this.empty()) {
            return -1;
        }

        // Returns the value of the element at the front of the queue
        return this.head.val;
    }

    back() {

        // Returns -1 if the queue is empty
        if (this.empty()) {
            return -1;
        }

        // Returns the value of the element at the back of the queue
        return this.tail.val;
    }

// Diagram: enqueue(val) {

        // Returns false if the queue is full and cannot enqueue more
        // elements
        if (this.currentSize === this.capacity) {
            return false;
        }

        // Create a new node with the given val
        const newNode = new ListNode(val);

        // If the queue is empty, the new node becomes both the front
        // and rear node
        if (this.empty()) {
            this.head = newNode;
            this.tail = newNode;
        }

        // Otherwise, add the new node to the end of the queue and update
        // the tail reference
        else {

            // Add the new node to the end of the queue
            this.tail.next = newNode;

            // Update the tail reference to the new node
            this.tail = newNode;
        }

        // Increase the current size of the queue
        this.currentSize++;

        // Return true to indicate successful enqueue operation
        return true;
    }

    dequeue() {

        // Returns -1 if the queue is empty and cannot dequeue any
        // elements
        if (this.empty()) {
            return -1;
        }

        // Create a temporary reference to the front node
        const frontNode = this.head;

        // Get the value of the front node
        const dequeuedData = frontNode.val;

        // Update the front reference to the next node in the queue
        this.head = this.head.next;

        // Delete the previous front node
        frontNode.next = null;

        // If the front reference is null after dequeue, the queue
        // becomes empty, so update the tail reference as well
        if (this.head === null) {
            this.tail = null;
        }

        // Decrease the current size of the queue
        this.currentSize--;

        // Return the dequeued value
        return dequeuedData;
    }
```

Python

```python
from typing import Optional

"""
Definition for singly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None
"""

class Queue:
    def __init__(self, capacity: int):

        # Capacity of the queue (maximum number of elements it can hold)
        self.capacity: int = capacity

        # Current number of elements in the queue
        self.current_size: int = 0

        # Reference to the front of the queue
        self.head: Optional[ListNode] = None

        # Reference to the rear of the queue
        self.tail: Optional[ListNode] = None

    def size(self) -> int:

        # Returns the current number of elements in the queue
        return self.current_size

    def empty(self) -> bool:

        # Returns True if the queue is empty, False otherwise
        return self.current_size == 0

    def front(self) -> int:

        # Returns -1 if the queue is empty
        if self.empty():
            return -1

        # Returns the value of the element at the front of the queue
        if self.head:
            return self.head.val

        return -1

    def back(self) -> int:

        # Returns -1 if the queue is empty
        if self.empty():
            return -1

        # Returns the value of the element at the back of the queue
        if self.head:
            return self.tail.val

        return -1

    def enqueue(self, val: int) -> bool:

        # Returns False if the queue is full and cannot enqueue more
        # elements
        if self.current_size == self.capacity:
            return False

        # Create a new node with the given val
        new_node: ListNode = ListNode(val)

        # If the queue is empty, the new node becomes both the front
        # and rear node
        if self.empty():
            self.head = new_node
            self.tail = new_node

        # Otherwise, add the new node to the end of the queue and update
        # the rear reference
        else:

            # Add the new node to the end of the queue
            if self.tail:
                self.tail.next = new_node

                # Update the rear reference to the new node
                self.tail = new_node

        # Increase the current size of the queue
        self.current_size += 1

        # Return True to indicate successful enqueue operation
        return True

    def dequeue(self) -> int:

        # Returns -1 if the queue is empty and cannot dequeue any
        # elements
        if self.empty():
            return -1

        # Create a temporary reference to the front node
        front_node: Optional[ListNode] = self.head

        # Get the value of the front node
        if front_node:
            dequeued_val: int = front_node.val

        # Update the front reference to the next node in the queue
        if self.head:
            self.head = self.head.next

        # Delete the previous front node
        del front_node

        # If the front reference is None after dequeue, the queue
        # becomes empty, so update the rear reference as well
        if self.head is None:
            self.tail = None

        # Decrease the current size of the queue
        self.current_size -= 1

        # Return the dequeued value
        return dequeued_val
```

## Complexity Analysis

Since we do no other operation other than calling the `empty()` and `front()` functions which are **O(1)** in both time and space, our `dequeue()` function is also **O(1)**.

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

# Design a queue using linked list

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

1. Use a **linked list as the internal data structure** to store data and implement this class.

// Diagram: Implementation of a queue using a linked list

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
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

using namespace std;

class Queue {
public:

    // Capacity of the queue (maximum number of elements it can hold)
    int capacity;

    // Current number of elements in the queue
    int currentSize;

    // Pointer to the front of the queue
    ListNode *head;

    // Pointer to the rear of the queue
    ListNode *tail;

    Queue(int capacity) {
        this->capacity = capacity;
        currentSize = 0;
        head = nullptr;
        tail = nullptr;
    }

    int size() {

        // Returns the current number of elements in the queue
        return currentSize;
    }

    bool empty() {

        // Returns true if the queue is empty, false otherwise
        return currentSize == 0;
    }

    int front() {

        // Returns -1 if the queue is empty
        if (empty()) {
            return -1;
        }

        // Returns the value of the element at the front of the queue
        return head->val;
    }

    int back() {

        // Returns -1 if the queue is empty
        if (empty()) {
            return -1;
        }

        // Returns the value of the element at the back of the queue
        return tail->val;
    }

    bool enqueue(int val) {

        // Returns false if the queue is full and cannot enqueue more
        // elements
        if (currentSize == capacity) {
            return false;
        }

        // Create a new node with the given val
        ListNode *newNode = new ListNode(val);

        // If the queue is empty, the new node becomes both the front
        // and rear node
        if (empty()) {
            head = newNode;
            tail = newNode;
        }

        // Otherwise, add the new node to the end of the queue
        // and update the tail pointer
        else {

            // Add the new node to the end of the queue
            tail->next = newNode;

            // Update the tail pointer to the new node
            tail = newNode;
        }

        // Increase the current size of the queue
        currentSize++;

        // Return true to indicate successful enqueue operation
        return true;
    }

    int dequeue() {

        // Returns -1 if the queue is empty and cannot dequeue any
        // elements
        if (empty()) {
            return -1;
        }

        // Create a temporary pointer to the front node
        ListNode *frontNode = head;

        // Get the value of the front node
        int dequeuedData = frontNode->val;

        // Update the front pointer to the next node in the queue
        head = head->next;

        // Delete the previous front node
        delete frontNode;

        // If the front pointer is nullptr after dequeue, the queue
        // becomes empty, so update the tail pointer as well
        if (head == nullptr) {
            tail = nullptr;
        }

        // Decrease the current size of the queue
        currentSize--;

        // Return the dequeued value
        return dequeuedData;
    }
};
```
