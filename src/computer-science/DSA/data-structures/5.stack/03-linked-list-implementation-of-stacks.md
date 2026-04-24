# 3. Linked list implementation of stacks

## Table of contents

1. [Structure of a linked list based stack](#structure-of-a-linked-list-based-stack)
2. [Implementing the stack class using linked list](#implementing-the-stack-class-using-a-linked-list)
3. [Determining the size of the stack](#determining-the-size-of-the-stack)
4. [Checking if the stack is empty](#checking-if-the-stack-is-empty)
5. [Accessing the top of the stack](#accessing-the-top-of-the-stack)
6. [Pushing an item onto the stack](#pushing-an-item-onto-the-stack)
7. [Popping an item from the top of the stack](#popping-an-item-from-the-top-of-the-stack)
8. [Design a stack using a linked list](#design-a-stack-using-a-linked-list)

***

# Structure of a linked list based stack

Going back to the definition of a stack, it is a linear data structure that only supports push and pop operations to add and remove data items from **one** end of the stack. Like an array, a linked list is another data structure that is the perfect candidate for implementing a stack. Unlike arrays, which have a fixed size and are used to implement **bounded** stacks, linked lists can be as big as the computer memory permits, so they can be used to implement an **unbounded** stack. 

// Diagram: Implementation of a stack using a linked list

## State information

Like the array implementation, when implementing a stack using a linked list, we need to hold and keep updated certain **state information** alongside the linked list that holds all the data items to ensure all stack operations work as desired. Let us look at all the state information we need to maintain.

### Top

Unlike in the array implementation, where we had to use the `topIndex` to store the index of the top item in the array, in the linked list implementation, we can use the `head` or `tail` of the list as a reference to the top. If we restrict inserting data items only at the beginning of the list, the `head` of the list is also becomes the top of the stack. On the other hand, if we restrict inserting data items only at the end of the list, the `tail` becomes the top of the stack. In this course, we will use a linked list implementation that only allows insertion at the beginning of the list and hence the `head`  will be at the top of the stack.

// Diagram: The head is also the top of the stack

### Current Size

Unlike the array implementation of a stack, where we derive the stack size using the value stored in the `topIndex` variable, the linked list implementation has no `topIndex` variable. To always know the current size of the stack, we need to store this information in a `currentSize` variable. Every time data is pushed onto or popped from the stack, the value of `currentSize` variable is incremented or decremented by 1.

// Diagram: The current size of the linked list used to implement a stack is stored in a variable

### Capacity

The linked list implementation of a stack can be used to implement both **bounded** and **unbounded** stacks. Since unbounded stacks have unlimited capacity, we don't need to store the maximum limit in any variable. However, when implementing a bounded stack using linked lists, we store that maximum limit in a `capacity`variable similar to the array implementation. Whenever we add a data item to the stack, we must ensure that the queue size doesn't exceed the stack's capacity. 

// Diagram: We will only learn the linked list implementation of a bounded stack in this course

***

# Implementing the stack class using a linked list

Like arrays, a class can **encapsulate** all the state information needed to implement a stack using a linked list, along with the linked list itself and all the operations that can be performed on a stack. The fundamental idea is the same. However, the implementation is different.

// Diagram: Representation of linked list implementation of an bounded stack encapsulated in a class

## Linked list node

Unlike the array implementation of the stack, where the data type of the items in the stack is the data type of the internal array, in the linked list implementation, we also need to define the **node** type for the internal linked list.

As you can see below, the node structure for the internal linked list is the same as that of a generic singly linked list.

// Diagram: Linked list node for implementing a stack

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

class Stack {
public:

    // Pointer to the head of the stack
    ListNode *head;

    // Maximum capacity of the stack
    int capacity;

    // Current number of elements in the stack
    int currentSize;

// Diagram: Stack(int capacity) {

        // Initialize the capacity of the stack
        this->capacity = capacity;

        // Initialize the currentSize to zero
        this->currentSize = 0;

        // Initialize the head pointer to null
        this->head = nullptr;
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

## Stack class

Like in the array implementation of a stack, a stack class can be implemented by defining a class where all the data members are private to the class, and the operations are exposed to users as functions that manipulate the data members. We do not need a parameterized constructor in the linked list implementation of the stack class when implementing an **unbounded** stack. However, since we are implementing a **bounded** stack, we define a parameterized constructor to set the `capacity` of the stack at the time of its creation.

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

class Stack {
public:

    // Pointer to the head of the stack
    ListNode *head;

    // Maximum capacity of the stack
    int capacity;

    // Current number of elements in the stack
    int currentSize;

// Diagram: Stack(int capacity) {

        // Initialize the capacity of the stack
        this->capacity = capacity;

        // Initialize the currentSize to zero
        this->currentSize = 0;

        // Initialize the head pointer to null
        this->head = nullptr;
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
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

// Diagram: class Stack {

    // Reference to the head of the stack
    public ListNode head;

    // Maximum capacity of the stack
    public int capacity;

    // Current number of elements in the stack
    public int currentSize;

// Diagram: public Stack(int capacity) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
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

// Diagram: export class Stack {

    // Reference to the head of the stack
    head: ListNode | null;

    // Maximum capacity of the stack
    capacity: number;

    // Current number of elements in the stack
    currentSize: number;

// Diagram: constructor(capacity: number) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
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
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

// Diagram: export class Stack {

    // Reference to the head of the stack
    head;

    // Maximum capacity of the stack
    capacity;

    // Current number of elements in the stack
    currentSize;

// Diagram: constructor(capacity) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
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
from typing import Optional

"""
Definition for singly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None
"""

class Stack:
    def __init__(self, capacity: int):

        # Reference to the head of the stack
        self.head: Optional[ListNode] = None

        # Maximum capacity of the stack
        self.capacity: int = capacity

        # Current number of elements in the stack
        self.current_size: int = 0

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

class Stack {
public:

    // Pointer to the head of the stack
    ListNode *head;

    // Maximum capacity of the stack
    int capacity;

    // Current number of elements in the stack
    int currentSize;

// Diagram: Stack(int capacity) {

        // Initialize the capacity of the stack
        this->capacity = capacity;

        // Initialize the currentSize to zero
        this->currentSize = 0;

        // Initialize the head pointer to null
        this->head = nullptr;
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
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

// Diagram: class Stack {

    // Reference to the head of the stack
    public ListNode head;

    // Maximum capacity of the stack
    public int capacity;

    // Current number of elements in the stack
    public int currentSize;

// Diagram: public Stack(int capacity) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
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

// Diagram: export class Stack {

    // Reference to the head of the stack
    head: ListNode | null;

    // Maximum capacity of the stack
    capacity: number;

    // Current number of elements in the stack
    currentSize: number;

// Diagram: constructor(capacity: number) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
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
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

// Diagram: export class Stack {

    // Reference to the head of the stack
    head;

    // Maximum capacity of the stack
    capacity;

    // Current number of elements in the stack
    currentSize;

// Diagram: constructor(capacity) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
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
from typing import Optional

"""
Definition for singly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None
"""

class Stack:
    def __init__(self, capacity: int):

        # Reference to the head of the stack
        self.head: Optional[ListNode] = None

        # Maximum capacity of the stack
        self.capacity: int = capacity

        # Current number of elements in the stack
        self.current_size: int = 0

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

Let's examine what happens when the code is executed to better understand how encapsulating all the data and state information needed to implement a stack, along with the linked list and all the operations in a class, is useful.

// Diagram: Execution of code using an instance (object) of the stack class

Now that we know what a stack's linked list implementation looks like and how it functions, we will learn more about the implementation of each function in the coming lessons.

***

# Determining the size of the stack

The size operation tells the caller about the current size of the stack. Unlike in the array implementation, where we have the `topIndex` which we use to get the size of the stack, the linked list implementation does not have a `topIndex`. The only way to calculate the size of a linked list is to traverse it, which is very expensive. For this reason, we store a `currentSize` variable in the stack class, which keeps track of the current size of the stack.

// Diagram: Size of the stack is stored in a member variable of the stack class

## Algorithm

// Diagram: The size operation in a stack class implemented using a linked list can be summarized as the following algorithm

> **Algorithm:**
>
> -   **Step 1:** Return the value of \`currentSize\`.

## Implementation

The implementation is a quite simple one-line statement returning the value of the `currentSize` variable.

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

class Stack {
public:

    // Pointer to the head of the stack
    ListNode *head;

    // Maximum capacity of the stack
    int capacity;

    // Current number of elements in the stack
    int currentSize;

// Diagram: Stack(int capacity) {

        // Initialize the capacity of the stack
        this->capacity = capacity;

        // Initialize the currentSize to zero
        this->currentSize = 0;

        // Initialize the head pointer to null
        this->head = nullptr;
    }

// Diagram: int size() {

        // Return the current number of elements in the stack
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

// Diagram: class Stack {

    // Reference to the head of the stack
    public ListNode head;

    // Maximum capacity of the stack
    public int capacity;

    // Current number of elements in the stack
    public int currentSize;

// Diagram: public Stack(int capacity) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
    }

// Diagram: public int size() {

        // Return the current number of elements in the stack
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

// Diagram: export class Stack {

    // Reference to the head of the stack
    head: ListNode | null;

    // Maximum capacity of the stack
    capacity: number;

    // Current number of elements in the stack
    currentSize: number;

// Diagram: constructor(capacity: number) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
    }

// Diagram: size(): number {

        // Return the current number of elements in the stack
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

// Diagram: export class Stack {

    // Reference to the head of the stack
    head;

    // Maximum capacity of the stack
    capacity;

    // Current number of elements in the stack
    currentSize;

// Diagram: constructor(capacity) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
    }

    size() {

        // Return the current number of elements in the stack
        return this.currentSize;
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

class Stack:
    def __init__(self, capacity: int):

        # Reference to the head of the stack
        self.head: Optional[ListNode] = None

        # Maximum capacity of the stack
        self.capacity: int = capacity

        # Current number of elements in the stack
        self.current_size: int = 0

    def size(self) -> int:

        # Return the current number of elements in the stack
        return self.current_size
```

## Complexity Analysis

Since we only return the value of the variable `currentSize`. Both the space and time complexities are constant.

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

As the name suggests, this operation tells the caller if the stack is empty or if some items are already in it. It will return `true` if the stack is empty and `false` otherwise. The implementation is the same as that in the array implementation of a stack. We check if the stack's size is equal to 0.

// Diagram: Operation to check if the stack is empty

## Algorithm

The empty operation in a stack class implemented using a linked list can be summarized as the following algorithm.

> **Algorithm:**
>
> -   **Step 1:** Return \`true\` if the size of the stack is equal to \`0\`, otherwise, return \`false\`.

## Implementation

// Diagram: The implementation is quite a simple one-line statement returning true if size() == 0, false otherwise

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

class Stack {
public:

    // Pointer to the head of the stack
    ListNode *head;

    // Maximum capacity of the stack
    int capacity;

    // Current number of elements in the stack
    int currentSize;

// Diagram: Stack(int capacity) {

        // Initialize the capacity of the stack
        this->capacity = capacity;

        // Initialize the currentSize to zero
        this->currentSize = 0;

        // Initialize the head pointer to null
        this->head = nullptr;
    }

// Diagram: int size() {

        // Return the current number of elements in the stack
        return currentSize;
    }

// Diagram: bool empty() {

        // Return true if the stack is empty, false otherwise
        return currentSize == 0;
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

// Diagram: class Stack {

    // Reference to the head of the stack
    public ListNode head;

    // Maximum capacity of the stack
    public int capacity;

    // Current number of elements in the stack
    public int currentSize;

// Diagram: public Stack(int capacity) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
    }

// Diagram: public int size() {

        // Return the current number of elements in the stack
        return currentSize;
    }

// Diagram: public boolean empty() {

        // Return true if the stack is empty, false otherwise
        return currentSize == 0;
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

// Diagram: export class Stack {

    // Reference to the head of the stack
    head: ListNode | null;

    // Maximum capacity of the stack
    capacity: number;

    // Current number of elements in the stack
    currentSize: number;

// Diagram: constructor(capacity: number) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
    }

// Diagram: size(): number {

        // Return the current number of elements in the stack
        return this.currentSize;
    }

// Diagram: empty(): boolean {

        // Return true if the stack is empty, false otherwise
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

// Diagram: export class Stack {

    // Reference to the head of the stack
    head;

    // Maximum capacity of the stack
    capacity;

    // Current number of elements in the stack
    currentSize;

// Diagram: constructor(capacity) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
    }

    size() {

        // Return the current number of elements in the stack
        return this.currentSize;
    }

    empty() {

        // Return true if the stack is empty, false otherwise
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

class Stack:
    def __init__(self, capacity: int):

        # Reference to the head of the stack
        self.head: Optional[ListNode] = None

        # Maximum capacity of the stack
        self.capacity: int = capacity

        # Current number of elements in the stack
        self.current_size: int = 0

    def size(self) -> int:

        # Return the current number of elements in the stack
        return self.current_size

    def empty(self) -> bool:

        # Return True if the stack is empty, False otherwise
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

# Accessing the top of the stack

The top operation returns the value stored at the **top** of the stack. In the linked list implementation of a stack, the top item in the stack is the head of the linked list. The algorithm to get to the top of the stack is very simple. We have two cases to consider here.

## 1\. Stack is empty

We can return `-1` to indicate that there are no items in the stack. Ideally, we should be throwing an error, but for the sake of simplicity here, we return `-1`

// Diagram: Empty stack does not have a top element

> **Algorithm**
>
> -   **Step 1:** If the stack is empty, return \`-1\` to indicate that there is no top element.

## 2\. Stack is not empty

If the stack is not empty, we need to return the data value of the **head** node. Since we always insert it at the beginning, it holds the first element in the linked list or the last element added to the list.

// Diagram: The first node in the linked list is the top of the stack

// Diagram: The top operation in a stack class implemented using a linked list can be summarized as the following algorithm

> **Algorithm**
>
> -   **Step 1:** If the stack is not empty, return the value stored in the \`head\` node of the internal linked list.

## Implementation

The implementation is quite simple. We write all the cases in conditional blocks to implement the top operation.

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

class Stack {
public:

    // Pointer to the head of the stack
    ListNode *head;

    // Maximum capacity of the stack
    int capacity;

    // Current number of elements in the stack
    int currentSize;

// Diagram: Stack(int capacity) {

        // Initialize the capacity of the stack
        this->capacity = capacity;

        // Initialize the currentSize to zero
        this->currentSize = 0;

        // Initialize the head pointer to null
        this->head = nullptr;
    }

// Diagram: int size() {

        // Return the current number of elements in the stack
        return currentSize;
    }

// Diagram: bool empty() {

        // Return true if the stack is empty, false otherwise
        return currentSize == 0;
    }

    int top() {
        if (empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Return the value of the element at the top of the stack
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

// Diagram: class Stack {

    // Reference to the head of the stack
    public ListNode head;

    // Maximum capacity of the stack
    public int capacity;

    // Current number of elements in the stack
    public int currentSize;

// Diagram: public Stack(int capacity) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
    }

// Diagram: public int size() {

        // Return the current number of elements in the stack
        return currentSize;
    }

// Diagram: public boolean empty() {

        // Return true if the stack is empty, false otherwise
        return currentSize == 0;
    }

    public int top() {
        if (empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Return the value of the element at the top of the stack
        return head.val;
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

// Diagram: export class Stack {

    // Reference to the head of the stack
    head: ListNode | null;

    // Maximum capacity of the stack
    capacity: number;

    // Current number of elements in the stack
    currentSize: number;

// Diagram: constructor(capacity: number) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
    }

// Diagram: size(): number {

        // Return the current number of elements in the stack
        return this.currentSize;
    }

// Diagram: empty(): boolean {

        // Return true if the stack is empty, false otherwise
        return this.currentSize === 0;
    }

    top(): number {
        if (this.empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Return the value of the element at the top of the stack
        return this.head!.val;
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

// Diagram: export class Stack {

    // Reference to the head of the stack
    head;

    // Maximum capacity of the stack
    capacity;

    // Current number of elements in the stack
    currentSize;

// Diagram: constructor(capacity) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
    }

    size() {

        // Return the current number of elements in the stack
        return this.currentSize;
    }

    empty() {

        // Return true if the stack is empty, false otherwise
        return this.currentSize === 0;
    }

    top() {
        if (this.empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Return the value of the element at the top of the stack
        return this.head.val;
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

class Stack:
    def __init__(self, capacity: int):

        # Reference to the head of the stack
        self.head: Optional[ListNode] = None

        # Maximum capacity of the stack
        self.capacity: int = capacity

        # Current number of elements in the stack
        self.current_size: int = 0

    def size(self) -> int:

        # Return the current number of elements in the stack
        return self.current_size

    def empty(self) -> bool:

        # Return True if the stack is empty, False otherwise
        return self.current_size == 0

    def top(self) -> int:
        if self.empty():

            # If the stack is empty, return -1 (an invalid value)
            return -1

        # Return the value of the element at the top of the stack
        if self.head:
            return self.head.val
        return -1
```

**Why don't we return the entire node?**We only return the actual **data** value and not the node itself. This is because the user of this stack does not want to know the inner implementation details. They are just concerned with the item's value at the top of the stack, and we should expose that information to them. It also allows us to change the implementation to something else, like a doubly linked list or an array, and the calling code will be unaffected.

## Complexity Analysis

The `top()` function returns the data stored in the head node (the first node in the list/the last inserted node). Hence, both the space and time complexities are **O(1)**.

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

The push operation inserts a data item at the `top` of the stack. Insertion only happens after ensuring that we do not exceed the stack's **capacity** constraint. Unlike the array implementation, in the linked list implementation of a stack, we need to take some extra steps to maintain the head reference. Let's look at the possible cases we need to consider.

## 1\. Stack is full

Since the stack is full, we cannot add more data without removing some items. We will return `false` as this operation cannot be done.

// Diagram: Cannot push data onto the stack if it is full

> **Algorithm**
>
> -   **Step 1:** If the stack is full, return \`false\` to indicate that the operation was unsuccessful.

## 2\. Stack is not full

In this case, we must create and initialize a new node with the given value. We update the  section of the newly created node to hold the current head of the internal linked list. The next step is to update the `head` to hold this newly created node. Finally, we increment the value of the `currentSize` variable by 1 and return `true`

// Diagram: Push data onto the stack when stack is not full

// Diagram: The push operation in a stack class implemented using a linked list can be summarized as the following algorithm

> **Algorithm:**
>
> -   **Step 1:** If the stack is not full, create a new node with the given data.
> -   **Step 2:** Set the new node's \`next\` pointer to hold the reference of the current \`head\`.
> -   **Step 3:** Update the head pointer to hold the reference of the new node.
> -   **Step 4:** Increment the \`currentSize\` by \`1\`.
> -   **Step 5:** Return \`true\` to indicate that the operation was successful.

## Implementation

The implementation is quite simple. We write all the cases in conditional blocks to implement the push operation.

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

class Stack {
public:

    // Pointer to the head of the stack
    ListNode *head;

    // Maximum capacity of the stack
    int capacity;

    // Current number of elements in the stack
    int currentSize;

// Diagram: Stack(int capacity) {

        // Initialize the capacity of the stack
        this->capacity = capacity;

        // Initialize the currentSize to zero
        this->currentSize = 0;

        // Initialize the head pointer to null
        this->head = nullptr;
    }

// Diagram: int size() {

        // Return the current number of elements in the stack
        return currentSize;
    }

// Diagram: bool empty() {

        // Return true if the stack is empty, false otherwise
        return currentSize == 0;
    }

    int top() {
        if (empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Return the value of the element at the top of the stack
        return head->val;
    }

    bool push(int val) {
        if (currentSize == capacity) {

            // If the stack is already full, return false
            return false;
        }

        // Create a new node with the given val
        ListNode *newNode = new ListNode(val);

        // Set the next pointer of the new node to the current head
        newNode->next = head;

        // Update the head pointer to the new node
        head = newNode;

        // Increment the count of elements in the stack
        currentSize++;

        // Return true to indicate a successful push operation
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

// Diagram: class Stack {

    // Reference to the head of the stack
    public ListNode head;

    // Maximum capacity of the stack
    public int capacity;

    // Current number of elements in the stack
    public int currentSize;

// Diagram: public Stack(int capacity) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
    }

// Diagram: public int size() {

        // Return the current number of elements in the stack
        return currentSize;
    }

// Diagram: public boolean empty() {

        // Return true if the stack is empty, false otherwise
        return currentSize == 0;
    }

    public int top() {
        if (empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Return the value of the element at the top of the stack
        return head.val;
    }

    public boolean push(int val) {
        if (currentSize == capacity) {

            // If the stack is already full, return false
            return false;
        }

        // Create a new node with the given val
        ListNode newNode = new ListNode(val);

        // Set the next reference of the new node to the current head
        newNode.next = head;

        // Update the head reference to the new node
        head = newNode;

        // Increment the count of elements in the stack
        currentSize++;

        // Return true to indicate a successful push operation
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

// Diagram: export class Stack {

    // Reference to the head of the stack
    head: ListNode | null;

    // Maximum capacity of the stack
    capacity: number;

    // Current number of elements in the stack
    currentSize: number;

// Diagram: constructor(capacity: number) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
    }

// Diagram: size(): number {

        // Return the current number of elements in the stack
        return this.currentSize;
    }

// Diagram: empty(): boolean {

        // Return true if the stack is empty, false otherwise
        return this.currentSize === 0;
    }

    top(): number {
        if (this.empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Return the value of the element at the top of the stack
        return this.head!.val;
    }

    push(val: number): boolean {
        if (this.currentSize === this.capacity) {

            // If the stack is already full, return false
            return false;
        }

        // Create a new node with the given val
        const newNode = new ListNode(val);

        // Set the next reference of the new node to the current head
        newNode.next = this.head;

        // Update the head reference to the new node
        this.head = newNode;

        // Increment the count of elements in the stack
        this.currentSize++;

        // Return true to indicate a successful push operation
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

// Diagram: export class Stack {

    // Reference to the head of the stack
    head;

    // Maximum capacity of the stack
    capacity;

    // Current number of elements in the stack
    currentSize;

// Diagram: constructor(capacity) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
    }

    size() {

        // Return the current number of elements in the stack
        return this.currentSize;
    }

    empty() {

        // Return true if the stack is empty, false otherwise
        return this.currentSize === 0;
    }

    top() {
        if (this.empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Return the value of the element at the top of the stack
        return this.head.val;
    }

    push(val) {
        if (this.currentSize === this.capacity) {

            // If the stack is already full, return false
            return false;
        }

        // Create a new node with the given val
        const newNode = new ListNode(val);

        // Set the next reference of the new node to the current head
        newNode.next = this.head;

        // Update the head reference to the new node
        this.head = newNode;

        // Increment the count of elements in the stack
        this.currentSize++;

        // Return true to indicate a successful push operation
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

class Stack:
    def __init__(self, capacity: int):

        # Reference to the head of the stack
        self.head: Optional[ListNode] = None

        # Maximum capacity of the stack
        self.capacity: int = capacity

        # Current number of elements in the stack
        self.current_size: int = 0

    def size(self) -> int:

        # Return the current number of elements in the stack
        return self.current_size

    def empty(self) -> bool:

        # Return True if the stack is empty, False otherwise
        return self.current_size == 0

    def top(self) -> int:
        if self.empty():

            # If the stack is empty, return -1 (an invalid value)
            return -1

        # Return the value of the element at the top of the stack
        if self.head:
            return self.head.val
        return -1

    def push(self, val: int) -> bool:
        if self.current_size == self.capacity:

            # If the stack is already full, return False
            return False

        # Create a new node with the given val
        new_node = ListNode(val)

        # Set the next reference of the new node to the current head
        new_node.next = self.head

        # Update the head reference to the new node
        self.head = new_node

        # Increment the count of elements in the stack
        self.current_size += 1

        # Return True to indicate a successful push operation
        return True
```

## Complexity Analysis

The time and space complexity for inserting an item at the beginning of a list is **O(1)**.

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

The pop operation removes the **top** item from the stack and returns its value. After removing the item from the top, the internal `currentSize` is also decremented. The algorithm for removing a value from the top of the stack is quite straightforward. Let's look at the possible cases we need to consider.

## 1\. Stack is empty

We return `-1` here to indicate that this is an invalid operation, as there is no item at the top of the stack.

// Diagram: Cannot pop data from an empty stack

> **Algorithm**
>
> -   **Step 1:** If the stack is empty, return \`-1\` to indicate that the operation was unsuccessful.

## 2\. Stack is not empty

In this case, we need to update `head` to hold the second node in our internal linked list and delete the first node. However, before updating `head` to the second node, we must store the current head node in a temporary variable to delete it after modifying the `head` variable. We must also store the data value of that **head** node in a variable so that we can return its value after the node is deleted. The final step is to decrease the `currentSize` by 1.

// Diagram: Pop data from a non empty the stack

The pop operation in a stack class implemented using a linked list can be summarized as the following algorithm.

> **Algorithm**
>
> -   **Step 1:** If the stack is not empty, store the value of the element at the \`head\` node of the internal linked list in a temporary variable.
> -   **Step 2:** Move the head pointer to the next node.
> -   **Step 3:** Delete the original head node to free up memory.
> -   **Step 4:** Decrement the \`currentSize\` by \`1\`.
> -   **Step 5**: Return the value stored in the temporary variable.

## Implementation

The implementation is quite simple. We write all the cases in conditional blocks to implement the pop operation.

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

class Stack {
public:

    // Pointer to the head of the stack
    ListNode *head;

    // Maximum capacity of the stack
    int capacity;

    // Current number of elements in the stack
    int currentSize;

// Diagram: Stack(int capacity) {

        // Initialize the capacity of the stack
        this->capacity = capacity;

        // Initialize the currentSize to zero
        this->currentSize = 0;

        // Initialize the head pointer to null
        this->head = nullptr;
    }

// Diagram: int size() {

        // Return the current number of elements in the stack
        return currentSize;
    }

// Diagram: bool empty() {

        // Return true if the stack is empty, false otherwise
        return currentSize == 0;
    }

    int top() {
        if (empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Return the value of the element at the top of the stack
        return head->val;
    }

    bool push(int val) {
        if (currentSize == capacity) {

            // If the stack is already full, return false
            return false;
        }

        // Create a new node with the given val
        ListNode *newNode = new ListNode(val);

        // Set the next pointer of the new node to the current head
        newNode->next = head;

        // Update the head pointer to the new node
        head = newNode;

        // Increment the count of elements in the stack
        currentSize++;

        // Return true to indicate a successful push operation
        return true;
    }

    int pop() {
        if (empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Store the value of the element at the top of the stack
        int value = head->val;

        // Create a temporary pointer to the current head
        ListNode *temp = head;

        // Update the head pointer to the next node
        head = head->next;

        // Delete the old head node to free memory
        delete temp;

        // Decrement the count of elements in the stack
        currentSize--;

        // Return the value of the popped element
        return value;
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

// Diagram: class Stack {

    // Reference to the head of the stack
    public ListNode head;

    // Maximum capacity of the stack
    public int capacity;

    // Current number of elements in the stack
    public int currentSize;

// Diagram: public Stack(int capacity) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
    }

// Diagram: public int size() {

        // Return the current number of elements in the stack
        return currentSize;
    }

// Diagram: public boolean empty() {

        // Return true if the stack is empty, false otherwise
        return currentSize == 0;
    }

    public int top() {
        if (empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Return the value of the element at the top of the stack
        return head.val;
    }

    public boolean push(int val) {
        if (currentSize == capacity) {

            // If the stack is already full, return false
            return false;
        }

        // Create a new node with the given val
        ListNode newNode = new ListNode(val);

        // Set the next reference of the new node to the current head
        newNode.next = head;

        // Update the head reference to the new node
        head = newNode;

        // Increment the count of elements in the stack
        currentSize++;

        // Return true to indicate a successful push operation
        return true;
    }

    public int pop() {
        if (empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Store the value of the element at the top of the stack
        int value = head.val;

        // Create a temporary reference to the current head
        ListNode temp = head;

        // Update the head reference to the next node
        head = head.next;

        // Delete the old head node to free memory
        temp = null;

        // Decrement the count of elements in the stack
        currentSize--;

        // Return the value of the popped element
        return value;
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

// Diagram: export class Stack {

    // Reference to the head of the stack
    head: ListNode | null;

    // Maximum capacity of the stack
    capacity: number;

    // Current number of elements in the stack
    currentSize: number;

// Diagram: constructor(capacity: number) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
    }

// Diagram: size(): number {

        // Return the current number of elements in the stack
        return this.currentSize;
    }

// Diagram: empty(): boolean {

        // Return true if the stack is empty, false otherwise
        return this.currentSize === 0;
    }

    top(): number {
        if (this.empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Return the value of the element at the top of the stack
        return this.head!.val;
    }

    push(val: number): boolean {
        if (this.currentSize === this.capacity) {

            // If the stack is already full, return false
            return false;
        }

        // Create a new node with the given val
        const newNode = new ListNode(val);

        // Set the next reference of the new node to the current head
        newNode.next = this.head;

        // Update the head reference to the new node
        this.head = newNode;

        // Increment the count of elements in the stack
        this.currentSize++;

        // Return true to indicate a successful push operation
        return true;
    }

    pop(): number {
        if (this.empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Store the value of the element at the top of the stack
        const value = this.head!.val;

        // Create a temporary reference to the current head
        const temp = this.head;

        // Update the head reference to the next node
        this.head = this.head!.next;

        // Delete the old head node to free memory
        if (temp) {
            temp.next = null;
        }

        // Decrement the count of elements in the stack
        this.currentSize--;

        // Return the value of the popped element
        return value;
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

// Diagram: export class Stack {

    // Reference to the head of the stack
    head;

    // Maximum capacity of the stack
    capacity;

    // Current number of elements in the stack
    currentSize;

// Diagram: constructor(capacity) {

        // Initialize the capacity of the stack
        this.capacity = capacity;

        // Initialize the currentSize to zero
        this.currentSize = 0;

        // Initialize the head reference to null
        this.head = null;
    }

    size() {

        // Return the current number of elements in the stack
        return this.currentSize;
    }

    empty() {

        // Return true if the stack is empty, false otherwise
        return this.currentSize === 0;
    }

    top() {
        if (this.empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Return the value of the element at the top of the stack
        return this.head.val;
    }

    push(val) {
        if (this.currentSize === this.capacity) {

            // If the stack is already full, return false
            return false;
        }

        // Create a new node with the given val
        const newNode = new ListNode(val);

        // Set the next reference of the new node to the current head
        newNode.next = this.head;

        // Update the head reference to the new node
        this.head = newNode;

        // Increment the count of elements in the stack
        this.currentSize++;

        // Return true to indicate a successful push operation
        return true;
    }

    pop() {
        if (this.empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Store the value of the element at the top of the stack
        const value = this.head.val;

        // Create a temporary reference to the current head
        const temp = this.head;

        // Update the head reference to the next node
        this.head = this.head.next;

        // Delete the old head node to free memory
        if (temp) {
            temp.next = null;
        }

        // Decrement the count of elements in the stack
        this.currentSize--;

        // Return the value of the popped element
        return value;
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

class Stack:
    def __init__(self, capacity: int):

        # Reference to the head of the stack
        self.head: Optional[ListNode] = None

        # Maximum capacity of the stack
        self.capacity: int = capacity

        # Current number of elements in the stack
        self.current_size: int = 0

    def size(self) -> int:

        # Return the current number of elements in the stack
        return self.current_size

    def empty(self) -> bool:

        # Return True if the stack is empty, False otherwise
        return self.current_size == 0

    def top(self) -> int:
        if self.empty():

            # If the stack is empty, return -1 (an invalid value)
            return -1

        # Return the value of the element at the top of the stack
        if self.head:
            return self.head.val
        return -1

    def push(self, val: int) -> bool:
        if self.current_size == self.capacity:

            # If the stack is already full, return False
            return False

        # Create a new node with the given val
        new_node = ListNode(val)

        # Set the next reference of the new node to the current head
        new_node.next = self.head

        # Update the head reference to the new node
        self.head = new_node

        # Increment the count of elements in the stack
        self.current_size += 1

        # Return True to indicate a successful push operation
        return True

    def pop(self) -> int:
        if self.empty():

            # If the stack is empty, return -1 (an invalid value)
            return -1

        # Store the value of the element at the top of the stack
        if self.head:
            value: int = self.head.val

        # Create a temporary reference to the current head
        temp: Optional[ListNode] = self.head

        # Update the head reference to the next node
        if self.head:
            self.head = self.head.next

        # Delete the old head node to free memory (automatically handled
        # in Python)
        del temp

        # Decrement the count of elements in the stack
        self.current_size -= 1

        # Return the value of the popped element
        return value
```

## Complexity Analysis

Since we only call the `empty()`  function and extract and delete the head of a linked list, which are both constant **O(1)** operations in both time and space, our `pop()` operation is also **O(1)**.

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

# Design a stack using a linked list

## Problem Statement

Given the skeleton of a **Stack class**, complete this class by implementing all the stack operations below.

> -   **Stack(int capacity)** - Initializes the Stack object with the given capacity.
> -   **size()** - Returns the current size of the stack.
> -   **empty()** - Returns \`true\` if the stack is empty, and \`false\` if it is not.
> -   **top()** - Returns the element at the top of the stack. If the stack is empty, returns \`-1\`.
> -   **push(int val)** - Pushes the given value onto the stack and returns \`true\` if the operation was successful. Returns \`false\` if the stack is full.
> -   **pop()** - Pops the top element from the stack and returns its value. If the stack is empty, returns \`-1\`.

// Diagram: You must abide by the following constraints

1\. Use a **linked list as the internal data structure** to store data and implement this class.

// Diagram: Implementation of a stack using a linked list

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

class Stack {
public:

    // Pointer to the head of the stack
    ListNode *head;

    // Maximum capacity of the stack
    int capacity;

    // Current number of elements in the stack
    int currentSize;

    Stack(int capacity) {

        // Initialize the capacity of the stack
        this->capacity = capacity;

        // Initialize the currentSize to zero
        this->currentSize = 0;

        // Initialize the head pointer to null
        this->head = nullptr;
    }

    int size() {

        // Return the current number of elements in the stack
        return currentSize;
    }

    bool empty() {

        // Return true if the stack is empty, false otherwise
        return currentSize == 0;
    }

    int top() {
        if (empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Return the value of the element at the top of the stack
        return head->val;
    }

    bool push(int val) {
        if (currentSize == capacity) {

            // If the stack is already full, return false
            return false;
        }

        // Create a new node with the given val
        ListNode *newNode = new ListNode(val);

        // Set the next pointer of the new node to the current head
        newNode->next = head;

        // Update the head pointer to the new node
        head = newNode;

        // Increment the count of elements in the stack
        currentSize++;

        // Return true to indicate a successful push operation
        return true;
    }

    int pop() {
        if (empty()) {

            // If the stack is empty, return -1 (an invalid value)
            return -1;
        }

        // Store the value of the element at the top of the stack
        int value = head->val;

        // Create a temporary pointer to the current head
        ListNode *temp = head;

        // Update the head pointer to the next node
        head = head->next;

        // Delete the old head node to free memory
        delete temp;

        // Decrement the count of elements in the stack
        currentSize--;

        // Return the value of the popped element
        return value;
    }
};
```
