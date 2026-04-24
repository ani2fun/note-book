# 12. Design

## Table of contents

1. [Design a min stack](#design-a-min-stack)
2. [Design a max stack](#design-a-max-stack)

***

# Design a min stack

## Problem Statement

Given the skeleton of a **MinStack class**, complete this class by implementing all the stack operations below.

> -   **MinStack()** - Initializes the MinStack object.
> -   **top()** - Returns the element at the top of the stack.
> -   **push(int val)** - Pushes the given value onto the stack.
> -   **pop()** - Removes the top element from the stack.
> -   **getMin()** - Returns the minimum value in the stack.

// Diagram: You must abide by the following constraints

1\. The **getMin** operation should return the minimum value in the stack in `O(1)` time.

2\. You **can use only one stack** in the internal implementation.

3\. You **can assume** that there are no duplicates in the stack.

## Example

> The input should adhere to the following rules:
>
> 1.  The input should contain two arrays of the same size.
> 2.  The first array should contain the list of operations, while the second should contain the corresponding operands for those operations.
> 3.  The first index in the first array should contain **MinStack**, and the first index in the second array should contain an empty array. This value is used to initialise the min stack.
> 4.  For each index in the first array that contains the **push** operation, the corresponding index in the second array should contain the value that needs to be pushed.
> 5.  For each index in the first array that contains **top**, **pop**, or **getMin** operations, the corresponding index in the second array should contain an empty array.
>
> **Example:**
>
> -   **Input:** \[MinStack, push, push, top, getMin, pop, getMin, push, getMin\] \[\[\], \[2\], \[3\], \[\], \[\], \[\], \[\], \[-1\], \[\]\]
>
> -   **Output:** \[null, null, null, 3, 2, null, 2, null, -1\]
>
> **Explanation:**
>
> **Operation:** MinStack minStack = new MinStack() **Result:** Initializes an empty \`MinStack\`
>
> **Operation:** minStack.push(2) **Result:** \`minStack = \[2\]\`
>
> **Operation:** minStack.push(3) **Result:** \`minStack = \[3, 2\]\`
>
> **Operation:** minStack.top() **Result:** \`minStack = \[3, 2\]\`, returns \`3\`
>
> **Operation:** minStack.getMin() **Result:** \`minStack = \[3, 2\]\`, returns \`2\`
>
> **Operation:** minStack.pop() **Result:** \`minStack = \[2\]\`
>
> **Operation:** minStack.getMin() **Result:** \`minStack = \[2\]\`, returns \`2\`
>
> **Operation:** minStack.push(-1) **Result:** \`minStack = \[-1, 2\]\`
>
> **Operation:** minStack.getMin() **Result:** \`minStack = \[-1, 2\]\`, returns \`-1\`

## Solution

```cpp
#include <climits>
#include <stack>

using namespace std;

class MinStack {
public:

    // Variable to track the minimum element
    int min = INT_MAX;

    // Stack to store the elements
    stack<int> storageStack;

    void push(int val) {

        // If the new element is smaller or equal to the current
        // minimum, push the current minimum onto the stack and
        // update the minimum
        if (val <= min) {
            storageStack.push(min);
            min = val;
        }

        // Push the element onto the stack
        storageStack.push(val);
    }

    void pop() {

        // If the top element is equal to the current minimum,
        // update the minimum by popping another element from the
        // stack
        if (storageStack.top() == min) {
            storageStack.pop();
            min = storageStack.top();
            storageStack.pop();
        }

        // Otherwise, simply pop the top element
        else {
            storageStack.pop();
        }
    }

    int top() {

        // Return the top element of the stack
        return storageStack.top();
    }

    int getMin() {

        // Return the current minimum element
        return min;
    }
};
```

***

# Design a max stack

## Problem Statement

Given the skeleton of a **MaxStack class**, complete this class by implementing all the stack operations below.

> -   **MaxStack()** - Initializes the MaxStack object.
> -   **top()** - Returns the element at the top of the stack.
> -   **push(int val)** - Pushes the given value onto the stack.
> -   **pop()** - Removes the top element from the stack.
> -   **getMax()** - Returns the maximum value in the stack.

// Diagram: Your solution must abide by the following constraints

1\. The **getMax** operation should return the maximum value in the stack in `O(1)` time. 

2\. You **can use only one stack** in the internal implementation.

3. You **can assume** that there are no duplicates in the stack.

## Example

> The input should adhere to the following rules:
>
> 1.  The input should contain two arrays of the same size.
> 2.  The first array should contain the list of operations, while the second should contain the corresponding operands for those operations.
> 3.  The first index in the first array should contain **MaxStack**, and the first index in the second array should contain an empty array. This value is used to initialise the max stack.
> 4.  For each index in the first array that contains the **push** operation, the corresponding index in the second array should contain the value that needs to be pushed.
> 5.  For each index in the first array that contains **top**, **pop**, or **getMax** operations, the corresponding index in the second array should contain an empty array.
>
> **Example:**
>
> -   **Input:** \[MaxStack, push, push, top, getMax, pop, getMax, push, getMax\] \[\[\], \[3\], \[2\], \[\], \[\], \[\], \[\], \[5\], \[\]\]
>
> -   **Output:** \[null, null, null, 2, 3, null, 3, null, 5\]
>
> **Explanation:**
>
> **Operation:** MaxStack maxStack = new MaxStack() **Result:** Initializes an empty \`MaxStack\`
>
> **Operation:** maxStack.push(3) **Result:** \`maxStack = \[3\]\`
>
> **Operation:** maxStack.push(3) **Result:** \`maxStack = \[2, 3\]\`
>
> **Operation:** maxStack.top() **Result:** \`maxStack = \[2, 3\]\`, returns \`2\`
>
> **Operation:** maxStack.getMax() **Result:** \`maxStack = \[2, 3\]\`, returns \`3\`
>
> **Operation:** maxStack.pop() **Result:** \`maxStack = \[3\]\`
>
> **Operation:** maxStack.getMax() **Result:** \`maxStack = \[3\]\`, returns \`3\`
>
> **Operation:** maxStack.push(5) **Result:** \`maxStack = \[5, 3\]\`
>
> **Operation:** maxStack.getMax() **Result:** \`maxStack = \[5, 3\]\`, returns \`5\`

## Solution

```cpp
#include <climits>
#include <stack>

using namespace std;

class MaxStack {
public:

    // Variable to track the maximum element
    int max = INT_MIN;

    // Stack to store the elements
    stack<int> storageStack;

    void push(int val) {

        // If the new element is greater or equal to the current
        // maximum, push the current maximum onto the stack and
        // update the maximum
        if (val >= max) {
            storageStack.push(max);
            max = val;
        }

        // Push the element onto the stack
        storageStack.push(val);
    }

    void pop() {

        // If the top element is equal to the current maximum,
        // update the maximum by popping another element from the
        // stack
        if (storageStack.top() == max) {
            storageStack.pop();
            max = storageStack.top();
            storageStack.pop();
        }

        // Otherwise, simply pop the top element
        else {
            storageStack.pop();
        }
    }

    int top() {

        // Get the top element of the stack
        return storageStack.top();
    }

    int getMax() {

        // Get the current maximum element
        return max;
    }
};
```
