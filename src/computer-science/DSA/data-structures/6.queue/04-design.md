# 4. Design

## Table of contents

1. [Design a queue using stacks](#design-a-queue-using-stacks)
2. [Design a stack using queues](#design-a-stack-using-queues)
3. [Design a stack using a single queue](#design-a-stack-using-a-single-queue)

***

# Design a queue using stacks

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

1\. Use only a maximum of **two stacks as the internal data structure** to store data and implement this class.

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
#include <stack>

using namespace std;

class Queue {
public:

    // Stack for enqueue operation
    stack<int> inStack;

    // Stack for dequeue operation
    stack<int> outStack;

    // Maximum capacity of the queue
    int maxSize;

    Queue(int capacity) { maxSize = capacity; }

    int size() {

        // Size of the queue is the sum of elements in both stacks
        return inStack.size() + outStack.size();
    }

    bool empty() {

        // Queue is empty if both stacks are empty
        return inStack.empty() && outStack.empty();
    }

    int front() {
        if (empty()) {

            // If the queue is empty, return -1 (indicating no element)
            return -1;
        }

        if (outStack.empty()) {

            // If the outStack is empty, transfer elements from inStack
            // to outStack to reverse their order
            while (!inStack.empty()) {

                // Move the top element from inStack to outStack
                outStack.push(inStack.top());

                // Remove the top element from inStack
                inStack.pop();
            }
        }

        // Return the top element of outStack, which is the front of the
        // queue
        return outStack.top();
    }

    int back() {
        if (empty()) {

            // If the queue is empty, return -1 (indicating no element)
            return -1;
        }

        // The most recently added element is at the top of inStack
        if (!inStack.empty()) {
            return inStack.top();
        }

        // If inStack is empty, we have transferred everything to
        // outStack. The back element is the bottom-most element of
        // outStack
        else {

            while (!outStack.empty()) {
                inStack.push(outStack.top());
                outStack.pop();
            }

            // The last inserted element
            return inStack.top();
        }
    }

    bool enqueue(int val) {
        if (size() == maxSize) {

            // If the queue is already at maximum capacity, return false
            // (enqueue failed)
            return false;
        }

        // Push the new element into inStack
        inStack.push(val);

        // Return true to indicate successful enqueue
        return true;
    }

    int dequeue() {
        if (empty()) {

            // If the queue is empty, return -1 (indicating no element to
            // dequeue)
            return -1;
        }

        if (outStack.empty()) {

            // If the outStack is empty, transfer elements from inStack
            // to outStack to reverse their order
            while (!inStack.empty()) {

                // Move the top element from inStack to outStack
                outStack.push(inStack.top());

                // Remove the top element from inStack
                inStack.pop();
            }
        }

        // Get the top element of outStack, which is the front of the
        // queue
        int frontElement = outStack.top();

        // Remove the front element from outStack
        outStack.pop();

        // Return the front element
        return frontElement;
    }
};
```

***

# Design a stack using queues

## Problem Statement

Given the skeleton of a **Stack class**, complete this class by implementing all the stack operations below.

> -   **Stack(int capacity)** - Initializes the Stack object with the given capacity.
> -   **size()** - Returns the current size of the stack.
> -   **empty()** - Returns \`true\` if the stack is empty, and \`false\` if it is not.
> -   **top()** - Returns the element at the top of the stack. If the stack is empty, returns \`-1\`.
> -   **push(int val)** - Pushes the given value onto the stack and returns \`true\` if the operation was successful. Returns \`false\` if the stack is full.
> -   **pop()** - Pops the top element from the stack and returns its value. If the stack is empty, returns \`-1\`.

// Diagram: You must abide by the following constraints

1. Use only a maximum of **two queues** **as the internal data structure** to store data and implement this class.

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
#include <queue>

using namespace std;

class Stack {
public:

    // Two queues to simulate the stack
    queue<int> queue1, queue2;

    // Maximum capacity of the stack
    int capacity;

    // Current size of the stack
    int currSize;

    Stack(int capacity) {
        this->capacity = capacity;
        currSize = 0;
    }

    int size() {

        // Return the top element
        return currSize;
    }

    bool empty() {

        // Return true if the stack is empty (current size is 0),
        // otherwise false
        return currSize == 0;
    }

    int top() {

        // Stack is empty, return -1 as an error value
        if (empty()) {
            return -1;
        }

        // Return the front element of queue1
        return queue1.front();
    }

    bool push(int val) {

        // Stack is full, cannot push more elements
        if (currSize == capacity) {
            return false;
        }

        // Push the new element to queue2
        queue2.push(val);

        // Move elements from queue1 to queue2
        while (!queue1.empty()) {

            // Push the front element of queue1 to queue2
            queue2.push(queue1.front());

            // Remove the front element from queue1
            queue1.pop();
        }

        // Swap queue1 and queue2, making queue2 empty
        swap(queue1, queue2);

        // Increment the size of the stack
        currSize++;
        return true;
    }

    int pop() {

        // Stack is empty, cannot pop an element
        if (empty()) {
            return -1;
        }

        // Get the front element of queue1 (top of the stack)
        int topElement = queue1.front();

        // Remove the front element from queue1
        queue1.pop();

        // Decrement the size of the stack
        currSize--;

        // Return the top element
        return topElement;
    }
};
```

***

# Design a stack using a single queue

## Problem Statement

Given the skeleton of a **Stack class**, complete this class by implementing all the stack operations below.

> -   **Stack(int capacity)** - Initializes the Stack object with the given capacity.
> -   **size()** - Returns the current size of the stack.
> -   **empty()** - Returns \`true\` if the stack is empty, and \`false\` if it is not.
> -   **top()** - Returns the element at the top of the stack. If the stack is empty, returns \`-1\`.
> -   **push(int val)** - Pushes the given value onto the stack and returns \`true\` if the operation was successful. Returns \`false\` if the stack is full.
> -   **pop()** - Pops the top element from the stack and returns its value. If the stack is empty, returns \`-1\`.

// Diagram: You must abide by the following constraints

1\. **Use only a single queue as the internal data structure** to store data and implement this class.

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
#include <queue>

using namespace std;

class Stack {
public:

    // Queue to store the elements of the stack
    queue<int> queue;

    // Maximum capacity of the stack
    int capacity;
    Stack(int capacity) { this->capacity = capacity; }

    int size() {

        // Returns the number of elements in the stack
        return queue.size();
    }

    bool empty() {

        // Return true if the stack is empty (current size is 0),
        // otherwise false
        return queue.empty();
    }

    int top() {

        // If stack is empty, return -1
        if (queue.empty()) {
            return -1;
        }

        int size = queue.size();
        while (size > 1) {

            // Move the front element to the back of the queue (rotating
            // the elements)
            queue.push(queue.front());
            queue.pop();
            size--;
        }

        // The front element is now the top element
        int top = queue.front();

        // Push it back to maintain the original order
        queue.push(top);

        // Remove the duplicated element from the front
        queue.pop();

        return top;
    }

    bool push(int val) {

        // Stack is full, unable to push
        if (queue.size() == capacity) {
            return false;
        }

        queue.push(val);

        // Element pushed successfully
        return true;
    }

    int pop() {

        // Stack is empty, no element to pop
        if (queue.empty()) {
            return -1;
        }

        int size = queue.size();
        while (size > 1) {

            // Move the front element to the back of the queue (rotating
            // the elements)
            queue.push(queue.front());
            queue.pop();
            size--;
        }

        // The front element is now the top element to be popped
        int poppedElement = queue.front();
        queue.pop();
        return poppedElement;
    }
};
```
