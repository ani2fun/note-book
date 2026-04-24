# 9. Pattern: Next closest occurrence

## Table of contents

1. [Understanding the next closest occurrence](#understanding-the-next-closest-occurrence-pattern)
2. [Identifying the next closest occurrence pattern](#identifying-the-next-closest-occurrence-pattern)
3. [Succeeding superior element](#succeeding-superior-element)
4. [Succeeding inferior element](#succeeding-inferior-element)
5. [Succeeding superior element II](#succeeding-superior-element-ii)
6. [Succeeding inferior element II](#succeeding-inferior-element-ii)
7. [Succeeding superior nodes](#succeeding-superior-nodes)
8. [Retained rainwater](#retained-rainwater)
9. [Largest rectangle area](#largest-rectangle-area)

***

# Understanding the next closest occurrence pattern

Some problems require us to find, for each item in a sequence, the next closest occurrence of a data item that is greater than or smaller than it. One way to solve this problem would be to use nested loops to traverse forward from each item in the sequence until the required greater or smaller item is found. Consider the example below where we need to find the next greater item for each item in the array.

// Diagram: Finding the next greater item for all items in a sequence.

Even though the solution is correct, it requires expensive nested loops that makes the overall performance poor. We can leverage the LIFO (Last in, first out) property of a stack to solve this problem in a single pass without any nested loops using the closest occurrence technique.

The next closest occurrence pattern is a classification of problems that can be solved using the next closest occurrence technique using a stack.

## Using the previous closest occurrence technique

Consider we are given an array of unique integers `arr` and we need to find the next greater integer for all items in the array. It is important to note that not all items in the array may have a next greater integer.

// Diagram: The previous greater items in the reverse direction of traversal is the same as next greater in the forward direction.

We can traverse the array in the reverse direction (end to start) and use the previous closest occurrence technique to find the previous greater item for each item. The previous greater item in the reverse direction would be the next greater item in the forward direction. 

The technique, algorithm and complexity analysis was explained in detail earlier and so will not be explained here.

// Diagram: Find the previous greater item for all items in an array in reverse

### Implementation

Given below is the generic code implementation to find the next greater item for all items in an integer array.

C++

```cpp
vector<int> nextGreaterElement(vector<int> &arr) {
    // Array to store the next greater elements for arr
    vector<int> nextGreater(arr.size(), -1);

    // Stack to help find the next greater element efficiently
    stack<int> stack;

    // Step 1: Build the next greater elements array for arr (Traverse in reverse order)
    for (int i = arr.size() - 1; i >= 0; i--) {
        int num = arr[i];

        // Remove elements from the stack that are smaller than or equal to the current element
        while (!stack.empty() && stack.top() <= num) {
            stack.pop();
        }

        // If the stack is not empty, set the next greater element
        if (!stack.empty()) {
            nextGreater[i] = stack.top();
        }

        // Push the current element onto the stack for future elements
        stack.push(num);
    }

    return nextGreater;
}
```

Java

```java

class NextGreaterElement {
    public List<Integer> nextGreaterElement(List<Integer> arr) {
        // List to store the next greater elements for arr
        List<Integer> nextGreater = new ArrayList<>();
        for (int i = 0; i < arr.size(); i++) {
            nextGreater.add(-1);
        }

        // Stack to help find the next greater element efficiently
        Stack<Integer> stack = new Stack<>();

        // Step 1: Build the next greater elements list for arr (Traverse in reverse order)
        for (int i = arr.size() - 1; i >= 0; i--) {
            int num = arr.get(i);

            // Remove elements from the stack that are smaller than or equal to the current element
            while (!stack.isEmpty() && stack.peek() <= num) {
                stack.pop();
            }

            // If the stack is not empty, set the next greater element
            if (!stack.isEmpty()) {
                nextGreater.set(i, stack.peek());
            }

            // Push the current element onto the stack for future elements
            stack.push(num);
        }

        return nextGreater;
    }
```

Typescript

```typescript
function nextGreaterElement(arr: number[]): number[] {
  // Array to store the next greater elements for arr
  const nextGreater: number[] = new Array(arr.length).fill(-1);

  // Stack to help find the next greater element efficiently
  const stack: number[] = [];

  // Step 1: Build the next greater elements array for arr (Traverse in reverse order)
  for (let i = arr.length - 1; i >= 0; i--) {
    const num = arr[i];

    // Remove elements from the stack that are smaller than or equal to the current element
    while (stack.length > 0 && stack[stack.length - 1] <= num) {
      stack.pop();
    }

    // If the stack is not empty, set the next greater element
    if (stack.length > 0) {
      nextGreater[i] = stack[stack.length - 1];
    }

    // Push the current element onto the stack for future elements
    stack.push(num);
  }

  return nextGreater;
}
```

Javascript

```javascript
function nextGreaterElement(arr) {
  // Array to store the next greater elements for arr
  const nextGreater = new Array(arr.length).fill(-1);

  // Stack to help find the next greater element efficiently
  const stack = [];

  // Step 1: Build the next greater elements array for arr (Traverse in reverse order)
  for (let i = arr.length - 1; i >= 0; i--) {
    const num = arr[i];

    // Remove elements from the stack that are smaller than or equal to the current element
    while (stack.length > 0 && stack[stack.length - 1] <= num) {
      stack.pop();
    }

    // If the stack is not empty, set the next greater element
    if (stack.length > 0) {
      nextGreater[i] = stack[stack.length - 1];
    }

    // Push the current element onto the stack for future elements
    stack.push(num);
  }

  return nextGreater;
}
```

Python

```python
def next_greater_element(arr: List[int]) -> List[int]:

    # List to store the next greater elements for arr
    next_greater: List[int] = [-1] * len(arr)

    # Stack to help find the next greater element efficiently
    stack: List[int] = []

    # Step 1: Build the next greater elements array for arr (Traverse in reverse order)
    for i in range(len(arr) - 1, -1, -1):
        num = arr[i]

        # Remove elements from the stack that are smaller than or equal to the current element
        while stack and stack[-1] <= num:
            stack.pop()

        # If the stack is not empty, set the next greater element
        if stack:
            next_greater[i] = stack[-1]

        # Push the current element onto the stack for future elements
        stack.append(num)

    return next_greater
```

## The next closest occurrence technique

In case we cannot traverse a sequence in the reverse direction, we can use the next closest occurrence technique to find the next greater item.

Consider we are given an array of unique integers `arr` and we need to find the next greater integer for all items in the array and we cannot traverse the array from end to start.

// Diagram: Find the next greater item for all items in a sequence where reverse traversal is not possible.

We can solve the problem by traversing the array from start to end while maintaining a sorted list of all items seen so far whose next greater item has not been found in the decreasing order of value. We will learn more about the proof of correctness of this technique later in this lesson.

We create a stack `stack` to hold pairs of integers where one integer is the value of the data item and the other integer is its index in the array `arr`. We also create an array `nextGreater` and initialize it with a sentinal value (-1) to store the next greater item for each item in `arr`.

We traverse the array `arr` from start to end, and in each iteration, we repeatedly pop the items from the top of the `stack` until the current item is greater than the value of the item at the top and make the current item their next greater item in `nextGreater` using the index stored in the pair. We then push the current item and its index to the top of the stack and repeat the process for the next item in `arr`. Because we start from an empty stack and remove all items smaller than the current item before adding it to the stack, the values in the stack are always sorted in decreasing order of value from bottom to top as we move to the next item.

At the end of the traversal, the `nextGreater` array will have the next greater item for all items in the array `arr` that have a solution, and for all other items, it will have the sentinal (-1) value.

// Diagram: Find the next greater item for all items in an array

### Algorithm

The algorithm given below outlines the technique to find the next greater item for all items in an array `arr`.

> **Algorithm**
>
> -   **Step 1:** Create ann array \`nextGreater\` to store the closest next greater item for all items in \`arr\` and initialize it with -1 as a sentinal value.
> -   **Step 2:** Initialize a stack \`stack\` to hold pair of integers to store the sorted list of unresolved values and their indices in \`arr\`.
> -   **Step 3:** Iterate in the array \`arr\` from start to end and in each iteration do the following:
>     -   **Step 3.1:** Repeat the following steps till \`stack\` is not empty and current item in \`arr\` is greater than value of item at top of \`stack\`:
>         -   **Step 3.1.1:** Use the index of the item at top of the \`stack\` to store the current item as its next greater item in \`nextGreater\` array.
>         -   **Step 3.1.2:** Pop the top of the stack
>     -   **Step 3.2:** Push the current item and its index to the top of the \`stack\`
> -   **Step 4:** The \`nextGreater\` array has the closest next greater item for items in \`arr\` that have a solution.

### Implementation

Given below is the generic code implementation to find the next greater item for all items in an integer array.

C++

```cpp
vector<int> nextGreaterElement(vector<int> &arr) {
    // Array to store the next greater elements for arr
    vector<int> nextGreater(arr.size(), -1);

    // Stack to help find the next greater element efficiently
    stack<int> stack;

    // Step 1: Build the next greater elements array for arr (Traverse in reverse order)
    for (int i = arr.size() - 1; i >= 0; i--) {
        int num = arr[i];

        // Remove elements from the stack that are smaller than or equal to the current element
        while (!stack.empty() && stack.top() <= num) {
            stack.pop();
        }

        // If the stack is not empty, set the next greater element
        if (!stack.empty()) {
            nextGreater[i] = stack.top();
        }

        // Push the current element onto the stack for future elements
        stack.push(num);
    }

    return nextGreater;
}
```

Java

```java

class NextGreaterElement {
    public List<Integer> nextGreaterElement(List<Integer> arr) {
        // List to store the next greater elements for arr
        List<Integer> nextGreater = new ArrayList<>();
        for (int i = 0; i < arr.size(); i++) {
            nextGreater.add(-1);
        }

        // Stack to help find the next greater element efficiently
        Stack<Integer> stack = new Stack<>();

        // Step 1: Build the next greater elements list for arr (Traverse in reverse order)
        for (int i = arr.size() - 1; i >= 0; i--) {
            int num = arr.get(i);

            // Remove elements from the stack that are smaller than or equal to the current element
            while (!stack.isEmpty() && stack.peek() <= num) {
                stack.pop();
            }

            // If the stack is not empty, set the next greater element
            if (!stack.isEmpty()) {
                nextGreater.set(i, stack.peek());
            }

            // Push the current element onto the stack for future elements
            stack.push(num);
        }

        return nextGreater;
    }
```

Typescript

```typescript
function nextGreaterElement(arr: number[]): number[] {
  // Array to store the next greater elements for arr
  const nextGreater: number[] = new Array(arr.length).fill(-1);

  // Stack to help find the next greater element efficiently
  const stack: number[] = [];

  // Step 1: Build the next greater elements array for arr (Traverse in reverse order)
  for (let i = arr.length - 1; i >= 0; i--) {
    const num = arr[i];

    // Remove elements from the stack that are smaller than or equal to the current element
    while (stack.length > 0 && stack[stack.length - 1] <= num) {
      stack.pop();
    }

    // If the stack is not empty, set the next greater element
    if (stack.length > 0) {
      nextGreater[i] = stack[stack.length - 1];
    }

    // Push the current element onto the stack for future elements
    stack.push(num);
  }

  return nextGreater;
}
```

Javascript

```javascript
function nextGreaterElement(arr) {
  // Array to store the next greater elements for arr
  const nextGreater = new Array(arr.length).fill(-1);

  // Stack to help find the next greater element efficiently
  const stack = [];

  // Step 1: Build the next greater elements array for arr (Traverse in reverse order)
  for (let i = arr.length - 1; i >= 0; i--) {
    const num = arr[i];

    // Remove elements from the stack that are smaller than or equal to the current element
    while (stack.length > 0 && stack[stack.length - 1] <= num) {
      stack.pop();
    }

    // If the stack is not empty, set the next greater element
    if (stack.length > 0) {
      nextGreater[i] = stack[stack.length - 1];
    }

    // Push the current element onto the stack for future elements
    stack.push(num);
  }

  return nextGreater;
}
```

Python

```python
def next_greater_element(arr: List[int]) -> List[int]:

    # List to store the next greater elements for arr
    next_greater: List[int] = [-1] * len(arr)

    # Stack to help find the next greater element efficiently
    stack: List[int] = []

    # Step 1: Build the next greater elements array for arr (Traverse in reverse order)
    for i in range(len(arr) - 1, -1, -1):
        num = arr[i]

        # Remove elements from the stack that are smaller than or equal to the current element
        while stack and stack[-1] <= num:
            stack.pop()

        # If the stack is not empty, set the next greater element
        if stack:
            next_greater[i] = stack[-1]

        # Push the current element onto the stack for future elements
        stack.append(num)

    return next_greater
```

### Complexity Analysis

The algorithm's time and space complexity is easy to understand. We traverse the sequence from start to end once in any case, and in each iteration, pop one or more items from the stack. Since the stack will only hold all items in the array once, a total of **N** push operations and at max **N** pop operations are done throughout the traversal where each operation is constant **O(1)** time. We may update up to **N** items into the solution array where each operation is constant **O(1)** time. This results in an overall linear **O(N)** time complexity.

We create a result array to store the result which is of the same size as the input contributing **O(N)** space. We copy all the data items to the stack as we traverse the array. When the input sequence is ordered in decreasing order of value, all items are accumulated in the stack, leading to **O(N)** space for the stack. In the other case, when the sequence is ordered in the increasing order of value, the stack will only have 1 item at any time, leading to constant **O(1)** space for the stack, but the result array still contributes to linear **O(N)** space.

And so, in any case, the overall space complexity will be linear **O(N)**.

> **Best Case -**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**
>
> **Worst Case -**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

Later in the course, we will examine techniques for identifying problems that can be solved using the next closest occurrence technique and walk through an example to better understand it.

***

# Identifying the next closest occurrence pattern

The next closest occurrence technique can only solve some specific problems. These are generally **medium**or **hard** problems involving linear data structures like arrays, strings, or linked lists where we need to find the next greater or smaller item in the sequence. Most problems under this pattern can be solved by directly applying the next closest occurrence technique, while some may require additional steps.

If the problem statement or its solution follows the generic template below, it can be solved by applying the closest occurrence technique.

**Template:**Given a sequential data structure, find the next closest greater or smaller item in the sequence.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the closest occurrence technique.

> **Problem statement:** Given two arrays \`arr1\` and \`arr2\` such that \`arr2\` is a subset of \`arr1\` and all items in \`arr1\` are unique, for each item in \`arr2\` find the next closest greater item in \`arr1\`. If an items does not have a next greater item, use -1 for it.

// Diagram: Find the next greater items for items in arr2 in arr1.

## Brute force

The brute-force solution to this problem is to use a loop and iterate in `arr2` and for each item we iterate backwards in `arr1` until we find the same item in `arr1`. We initialize a variable `nextGreater` with a sentinal value (-1), and as we iterate through `arr1`, we keep track of the most recent item that is greater than the current item in `arr2` in `nextGreater`. When we find the current value in `arr1`, we use the value `nextGreater` as its next greater value.

// Diagram: Find the next greater item for all items in arr2 in arr1

The implementation of the brute force solution is given as follows.

C++

```cpp
#include <stack>
#include <unordered_map>

// Diagram: using namespace std;

class Solution {
public:
    vector<int> succeedingSuperiorElement(
        vector<int> &arr1,
        vector<int> &arr2
    ) {

        // Array to store the next greater elements for arr1
        vector<int> nextGreater(arr1.size(), -1);

        // Map to store the last index of each element in arr1
        unordered_map<int, int> indexMap;

        // Stack to help find the next greater element efficiently
        stack<int> stack;

        // Step 1: Build the next greater elements array for arr1
        // (Traverse in reverse order)
        for (int i = arr1.size() - 1; i >= 0; i--) {
            int num = arr1[i];

            // Remove elements from the stack that are smaller than or
            // equal to the current element
            while (!stack.empty() && stack.top() <= num) {
                stack.pop();
            }

            // If the stack is not empty, set the next greater element
            if (!stack.empty()) {
                nextGreater[i] = stack.top();
            }

            // Push the current element onto the stack for future
            // elements
            stack.push(num);

            // Store the index of the current element in the index map
            indexMap[num] = i;
        }

        // Step 2: Process arr2 to generate the result
        vector<int> result;
        for (int num : arr2) {

            // Push the next greater element if found, otherwise -1
            result.push_back(
                indexMap.count(num) ? nextGreater[indexMap[num]] : -1
            );
        }

        return result;
    }
};
```

Java

```java
public class SucceedingSuperiorElement {

    public List<Integer> succeedingSuperiorElement(List<Integer> arr1, List<Integer> arr2) {
        // List to store the next greater elements for arr1
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < arr2.size(); i++) {
            result.add(-1);
        }

        for (int i = 0; i < arr2.size(); i++) {
            // Find the index of this item in arr1
            int nextGreater = -1;
            for (int j = arr1.size() - 1; j >= 0; j--) {
                // Always keep the latest value in arr1 greater than
                // current item in arr2
                if (arr1.get(j) > arr2.get(i)) {
                    nextGreater = arr1.get(j);
                }
                // If we find the current item in arr1, use the
                // latest greater value found as the next greater
                else if (arr1.get(j).equals(arr2.get(i))) {
                    result.set(i, nextGreater);
                    break;
                }
        return result;
    }
```

Typescript

```typescript
function succeedingSuperiorElement(arr1: number[], arr2: number[]): number[] {
  // Array to store the next greater elements for arr1
  const result: number[] = new Array(arr2.length).fill(-1);

  for (let i = 0; i < arr2.length; i++) {
    // Find the index of this item in arr1
    let nextGreater = -1;
    for (let j = arr1.length - 1; j >= 0; j--) {
      // Always keep the latest value in arr1 greater than
      // the current item in arr2
      if (arr1[j] > arr2[i]) {
        nextGreater = arr1[j];
      }
      // If we find the current item in arr1, use the
      // latest greater value found as next greater
      else if (arr1[j] === arr2[i]) {
        result[i] = nextGreater;
        break;
      }

  return result;
}
```

Javascript

```javascript
function succeedingSuperiorElement(arr1, arr2) {
  // Array to store the next greater elements for arr1
  const result = new Array(arr2.length).fill(-1);

  for (let i = 0; i < arr2.length; i++) {
    // Find the index of this item in arr1
    let nextGreater = -1;
    for (let j = arr1.length - 1; j >= 0; j--) {
      // Always keep the latest value in arr1 greater than
      // the current item in arr2
      if (arr1[j] > arr2[i]) {
        nextGreater = arr1[j];
      }
      // If we find the current item in arr1, use the
      // latest greater value found as next greater
      else if (arr1[j] === arr2[i]) {
        result[i] = nextGreater;
        break;
      }

  return result;
}
```

Python

```python

def succeeding_superior_element(arr1: List[int], arr2: List[int]) -> List[int]:
    # List to store the next greater elements for arr2
    result: List[int] = [-1] * len(arr2)

    for i in range(len(arr2)):
        # Variable to store the next greater value
        next_greater = -1

        # Traverse arr1 in reverse to find the next greater element for arr2[i]
        for j in range(len(arr1) - 1, -1, -1):
            # Always keep the latest value in arr1 greater than the current item in arr2
            if arr1[j] > arr2[i]:
                next_greater = arr1[j]
            # If we find the current item in arr1, use the latest greater value found
            elif arr1[j] == arr2[i]:
                result[i] = next_greater

    return result
```

Though the solution is correct, it requires nested loops and has a time complexity of **O(N^2)** in the worst case when the array items are arranged in increasing order of value in `arr1`.

## The next closest occurrence technique

We can easily solve this problem by finding the next closest greater item for all items in `arr1` and then only selecting the results for items in `arr2`. The problem description fits the template for the next closest occurrence pattern, as given below.

**Template:**

Given a sequential data structure (`arr1`), find the next closest greater item in the sequence.

We can now directly apply the next closest occurrence technique we learned earlier. We initialize astack of integers `stack` and an array `nextGreater` initialized with a sentinal value (-1) to store the results. We also create a hash map`indexMap`to map values in`arr1`with their indices. We will use this map later to find indices of values in`arr2`in`arr1`.

We traverse the array `arr1` from start to end, and in each iteration, repeatedly pop the items from the`stack`until the value at the top becomes greater than the current item. Each time we pop an item, we take note of the index stored in it and assign the current item as the next greater item for the value at that in index in `arr1` in the `nextGreater` array. We then push the current item and its index to the top of the stack and repeat the process for the next item in arr1.

At the end of the traversal, the `nextGreater` array will have the previous greater item for all items in`arr1`.

// Diagram: Find the next greater item for all items in arr1

We create a`result`array, traverse in`arr2`and use the`indexMap`to fill the next greater items for all items in`arr2`in the`result`array.

// Diagram: Use indexMap to find results for arr2

The implementation of the next closest occurrence technique is given below.

C++

```cpp
#include <stack>
#include <unordered_map>

// Diagram: using namespace std;

class Solution {
public:
    vector<int> succeedingSuperiorElement(
        vector<int> &arr1,
        vector<int> &arr2
    ) {

        // Array to store the next greater elements for arr1
        vector<int> nextGreater(arr1.size(), -1);

        // Map to store the last index of each element in arr1
        unordered_map<int, int> indexMap;

        // Stack to help find the next greater element efficiently
        stack<int> stack;

        // Step 1: Build the next greater elements array for arr1
        // (Traverse in reverse order)
        for (int i = arr1.size() - 1; i >= 0; i--) {
            int num = arr1[i];

            // Remove elements from the stack that are smaller than or
            // equal to the current element
            while (!stack.empty() && stack.top() <= num) {
                stack.pop();
            }

            // If the stack is not empty, set the next greater element
            if (!stack.empty()) {
                nextGreater[i] = stack.top();
            }

            // Push the current element onto the stack for future
            // elements
            stack.push(num);

            // Store the index of the current element in the index map
            indexMap[num] = i;
        }

        // Step 2: Process arr2 to generate the result
        vector<int> result;
        for (int num : arr2) {

            // Push the next greater element if found, otherwise -1
            result.push_back(
                indexMap.count(num) ? nextGreater[indexMap[num]] : -1
            );
        }

        return result;
    }
};
```

Java

```java
import java.util.*;

class Solution {
    public int[] succeedingSuperiorElement(int[] arr1, int[] arr2) {

        // Array to store the next greater elements for arr1
        int[] nextGreater = new int[arr1.length];
        Arrays.fill(nextGreater, -1);

        // Map to store the last index of each element in arr1
        Map<Integer, Integer> indexMap = new HashMap<>();

        // Stack to help find the next greater element efficiently
        Stack<Integer> stack = new Stack<>();

        // Step 1: Build the next greater elements array for arr1
        // (Traverse in reverse order)
        for (int i = arr1.length - 1; i >= 0; i--) {
            int num = arr1[i];

            // Remove elements from the stack that are smaller than or
            // equal to the current element
            while (!stack.isEmpty() && stack.peek() <= num) {
                stack.pop();
            }

            // If the stack is not empty, set the next greater element
            if (!stack.isEmpty()) {
                nextGreater[i] = stack.peek();
            }

            // Push the current element onto the stack for future
            // elements
            stack.push(num);

            // Store the index of the current element in the index map
            indexMap.put(num, i);
        }

        // Step 2: Process arr2 to generate the result
        int[] result = new int[arr2.length];
        for (int i = 0; i < arr2.length; i++) {
            int num = arr2[i];

            // Push the next greater element if found, otherwise -1
            result[i] =
                indexMap.containsKey(num)
                    ? nextGreater[indexMap.get(num)]
                    : -1;
        }

        return result;
    }
```

Typescript

```typescript
export class Solution {
    succeedingSuperiorElement(arr1: number[], arr2: number[]): number[] {

        // Array to store the next greater elements for arr1
        const nextGreater: number[] = Array(arr1.length).fill(-1);

        // Map to store the last index of each element in arr1
        const indexMap: Map<number, number> = new Map();

        // Stack to help find the next greater element efficiently
        const stack: number[] = [];

        // Step 1: Build the next greater elements array for arr1
        // (Traverse in reverse order)
        for (let i = arr1.length - 1; i >= 0; i--) {
            const num = arr1[i];

            // Remove elements from the stack that are smaller than or
            // equal to the current element
            while (stack.length > 0 && stack[stack.length - 1] <= num) {
                stack.pop();
            }

            // If the stack is not empty, set the next greater element
            if (stack.length > 0) {
                nextGreater[i] = stack[stack.length - 1];
            }

            // Push the current element onto the stack for future
            // elements
            stack.push(num);

            // Store the index of the current element in the index map
            indexMap.set(num, i);
        }

        // Step 2: Process arr2 to generate the result
        const result: number[] = [];
        for (const num of arr2) {

            // Push the next greater element if found, otherwise -1
            result.push(
                indexMap.has(num) ? nextGreater[indexMap.get(num)!] : -1
            );
        }

        return result;
    }
```

Javascript

```javascript
export class Solution {
    succeedingSuperiorElement(arr1, arr2) {

        // Array to store the next greater elements for arr1
        const nextGreater = Array(arr1.length).fill(-1);

        // Map to store the last index of each element in arr1
        const indexMap = new Map();

        // Stack to help find the next greater element efficiently
        const stack = [];

        // Step 1: Build the next greater elements array for arr1
        // (Traverse in reverse order)
        for (let i = arr1.length - 1; i >= 0; i--) {
            const num = arr1[i];

            // Remove elements from the stack that are smaller than or
            // equal to the current element
            while (stack.length > 0 && stack[stack.length - 1] <= num) {
                stack.pop();
            }

            // If the stack is not empty, set the next greater element
            if (stack.length > 0) {
                nextGreater[i] = stack[stack.length - 1];
            }

            // Push the current element onto the stack for future
            // elements
            stack.push(num);

            // Store the index of the current element in the index map
            indexMap.set(num, i);
        }

        // Step 2: Process arr2 to generate the result
        const result = [];
        for (const num of arr2) {

            // Push the next greater element if found, otherwise -1
            result.push(
                indexMap.has(num) ? nextGreater[indexMap.get(num)] : -1
            );
        }

        return result;
    }
```

Python

```python
from typing import List

class Solution:
    def succeeding_superior_element(
        self, arr1: List[int], arr2: List[int]
    ) -> List[int]:

        # Array to store the next greater elements for arr1
        next_greater = [-1] * len(arr1)

        # Map to store the last index of each element in arr1
        index_map = {}

        # Stack to help find the next greater element efficiently
        stack = []

        # Step 1: Build the next greater elements array for arr1
        # (Traverse in reverse order)
        for i in range(len(arr1) - 1, -1, -1):
            num = arr1[i]

            # Remove elements from the stack that are smaller than or
            # equal to the current element
            while stack and stack[-1] <= num:
                stack.pop()

            # If the stack is not empty, set the next greater element
            if stack:
                next_greater[i] = stack[-1]

            # Push the current element onto the stack for future elements
            stack.append(num)

            # Store the index of the current element in the index map
            index_map[num] = i

        # Step 2: Process arr2 to generate the result
        result = []
        for num in arr2:

            # Push the next greater element if found, otherwise -1
            result.append(
                next_greater[index_map[num]] if num in index_map else -1
            )

        return result
```

The next closest occurrence technique solves the problem in a single pass and linear **O(N)** time.

## Example problems

Most problems in this category are **medium** or **hard**; a list of a few is given below.

> -   **[Succeeding superior element](https://www.codeintuition.io/courses/stack/oLMmgGj4YiTXIXD7Q2Vj1)**
> -   **[Succeeding inferior element](https://www.codeintuition.io/courses/stack/yTr941Ac-vQCjpXLaXbSa)**
> -   **[Succeeding superior element II](https://www.codeintuition.io/courses/stack/sc-7lvVkdPW7LZgAs014U)**
> -   **[Succeeding inferior element II](https://www.codeintuition.io/courses/stack/qdEbeeDGbzXWNbnQ7-3yM)**
> -   **[Succeeding superior nodes](https://www.codeintuition.io/courses/stack/6XrrKUDk37rN1fevp6zTD)**
> -   **[Retained rainwater](https://www.codeintuition.io/courses/stack/6mcNRniMnQnd70Q3S5eGE)**
> -   **[Largest rectangle area](https://www.codeintuition.io/courses/stack/qlFt6gZkbzWHUfXDHH_tM)**

We will now solve these problems to understand the next closest occurrence technique better.

***

# Succeeding superior element

## Problem Statement

Given two arrays, **arr1**, and **arr2**, such that arr2 is a subset of arr1. Write a function to return a new array containing the succeeding superior element of each element present in arr2 from arr1. If there is no superior element for a value, then the answer to that query is `-1.`

The **succeeding superior element** of some element **X** in an array is the **first greater element to the right of X** in the same array.

It is guaranteed that all elements in the input arrays will be unique.

### Example 1

> -   **Input:** arr1 = \[3, 5, 1, 6, 8, 7\], arr2 = \[3, 1, 8, 7\]
> -   **Output:** \[5, 6, -1, -1\]
> -   **Explanation:** Succeeding superior element for each element of arr1 in arr2 is given below:
> -   arr2\[0\] = 3, superior element for this value in arr1 = 5
> -   arr2\[1\] = 1, superior element for this value in arr1 = 6
> -   arr2\[2\] = 8, there is no superior element for this value in arr1 so the result is -1
> -   arr2\[3\] = 7, there is no superior element for this value in arr1 so the result is -1

### Example 2

> -   **Input:** arr1 = \[5, 9, 7, 8, 1\], arr2 = \[5, 9, 7\]
> -   **Output:** \[9, -1, 8\]
> -   **Explanation:** Succeeding superior element for each element of arr1 in arr2 is given below:
> -   arr2\[0\] = 5, superior element for this value in arr1 = 9
> -   arr2\[1\] = 9, there is no superior element for this value in arr1 so the result is -1
> -   arr2\[2\] = 7, superior element for this value in arr1 = 8

## Solution

```cpp
#include <stack>
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<int> succeedingSuperiorElement(
        vector<int> &arr1,
        vector<int> &arr2
    ) {

        // Array to store the next greater elements for arr1
        vector<int> nextGreater(arr1.size(), -1);

        // Map to store the last index of each element in arr1
        unordered_map<int, int> indexMap;

        // Stack to help find the next greater element efficiently
        stack<int> stack;

        // Step 1: Build the next greater elements array for arr1
        // (Traverse in reverse order)
        for (int i = arr1.size() - 1; i >= 0; i--) {
            int num = arr1[i];

            // Remove elements from the stack that are smaller than or
            // equal to the current element
            while (!stack.empty() && stack.top() <= num) {
                stack.pop();
            }

            // If the stack is not empty, set the next greater element
            if (!stack.empty()) {
                nextGreater[i] = stack.top();
            }

            // Push the current element onto the stack for future
            // elements
            stack.push(num);

            // Store the index of the current element in the index map
            indexMap[num] = i;
        }

        // Step 2: Process arr2 to generate the result
        vector<int> result;
        for (int num : arr2) {

            // Push the next greater element if found, otherwise -1
            result.push_back(
                indexMap.count(num) ? nextGreater[indexMap[num]] : -1
            );
        }

        return result;
    }
};
```

***

# Succeeding inferior element

## Problem Statement

Given two arrays, **arr1**, and **arr2**, such that arr2 is a subset of arr1. Write a function to return a new array containing the succeeding inferior element of each element present in arr2 from arr1. If there is no inferior element for a value, then the answer to that query is `-1.`

The **succeeding inferior element** of some element **X** in an array is the **first smaller element to the right of X** in the same array.

It is guaranteed that all elements in the input arrays will be unique.

### Example 1

> -   **Input:** arr1 = \[3, 5, 1, 6, 8, 9\], arr2 = \[3, 1, 8, 9\]
> -   **Output:** \[1, -1, -1, -1\]
> -   **Explanation:** Succeeding inferior element for each element of arr1 in arr2 is given below:
> -   arr2\[0\] = 3, inferior element for this value in arr1 = 1
> -   arr2\[1\] = 1, there is no inferior element for this value in arr1 so the result is -1
> -   arr2\[2\] = 8, inferior element for this value in arr1 = -1
> -   arr2\[3\] = 9, there is no inferior element for this value in arr1 so the result is -1

### Example 2

> -   **Input:** arr1 = \[5, 9, 7, 8, 1\], arr2 = \[5, 9, 7\]
> -   **Output:** \[1, 7, 1\]
> -   **Explanation:** Succeeding inferior element for each element of arr1 in arr2 is given below:
> -   arr2\[0\] = 5, inferior element for this value in arr1 = 1
> -   arr2\[1\] = 9, inferior element for this value in arr1 = 7
> -   arr2\[2\] = 7, inferior element for this value in arr1 = 1

## Solution

```cpp
#include <stack>
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<int> succeedingInferiorElement(
        vector<int> &arr1,
        vector<int> &arr2
    ) {

        // Array to store the next smaller elements for arr1
        vector<int> nextSmaller(arr1.size(), -1);

        // Map to store the last index of each element in arr1
        unordered_map<int, int> indexMap;

        // Stack to help find the next smaller element efficiently
        stack<int> stack;

        // Step 1: Build the next smaller elements array for arr1
        // (Traverse in reverse order)
        for (int i = arr1.size() - 1; i >= 0; i--) {
            int num = arr1[i];

            // Remove elements from the stack that are greater than or
            // equal to the current element
            while (!stack.empty() && stack.top() >= num) {
                stack.pop();
            }

            // If the stack is not empty, set the next smaller element
            if (!stack.empty()) {
                nextSmaller[i] = stack.top();
            }

            // Push the current element onto the stack for future
            // elements
            stack.push(num);

            // Store the index of the current element in the index map
            indexMap[num] = i;
        }

        // Step 2: Process arr2 to generate the result
        vector<int> result;
        for (int num : arr2) {

            // Push the next smaller element if found, otherwise -1
            result.push_back(
                indexMap.count(num) ? nextSmaller[indexMap[num]] : -1
            );
        }

        return result;
    }
};
```

***

# Succeeding superior element II

## Problem Statement

Given a circular array **arr**, write a function to return a new array containing the succeeding superior element of each element present in arr. Since the array is circular, to find the succeeding superior element, you could look circularly to the right until you find an element or reach the same element. If there is no superior element for a value, then the answer to that query is `-1`.

The **succeeding superior element** of some element **X** in an array is the **first greater element that is to the right of X** in the same array.

### Example 1

> -   **Input:** arr = \[2, 5, 1, 6, 10, 3\]
> -   **Output:** \[5, 6, 6, 10, -1, 5\]
> -   **Explanation:** Succeeding superior element for each element of arr is given below:
> -   arr\[0\] = 2, superior element for this value in arr = 5
> -   arr\[1\] = 5, superior element for this value in arr = 6
> -   arr\[2\] = 1, superior element for this value in arr = 6
> -   arr\[3\] = 6, superior element for this value in arr = 10
> -   arr\[4\] = 10, there is no superior element for this value in arr, even after circularly visiting the array, so the result is -1
> -   arr\[5\] = 3, after visiting the array circularly, we find the superior element for this value in arr = 5

### Example 2

> -   **Input:** arr = \[6, 7, 8, 9, 8\]
> -   **Output:** \[7, 8, 9, -1, 9\]
> -   **Explanation:** Succeeding superior element for each element of arr is given below:
> -   arr\[0\] = 6, superior element for this value in arr = 7
> -   arr\[1\] = 7, superior element for this value in arr = 8
> -   arr\[2\] = 8, superior element for this value in arr = 9
> -   arr\[3\] = 9, there is no superior element for this value in arr, even after circularly visiting the array, so the result is -1
> -   arr\[4\] = 8, after visiting the array circularly, we find the superior element for this value in arr = 9

## Solution

```cpp
#include <stack>

using namespace std;

class Solution {
public:
    vector<int> succeedingSuperiorElementII(vector<int> &arr) {

        int n = arr.size();

        // Initialize result with -1
        vector<int> result(n, -1);

        // Stack to store indices of elements
        stack<int> stack;

        // Iterate twice through the array in reverse order (circularly)
        for (int i = 2 * n - 1; i >= 0; i--) {

            // Circular index
            int index = i % n;
            int num = arr[index];

            // Check if we can pop elements from the stack
            // (i.e., find the succeeding greater element for those
            // elements)
            while (!stack.empty() && stack.top() <= num) {
                stack.pop();
            }

            // If stack is not empty, the top element is the succeeding
            // superior element
            if (!stack.empty()) {
                result[index] = stack.top();
            }

            // Always push the element to the stack
            stack.push(num);
        }

        return result;
    }
};
```

***

# Succeeding inferior element II

## Problem Statement

Given a circular array **arr**, write a function to return a new array containing the succeeding inferior element of each element present in arr. Since the array is circular, to find the succeeding inferior element, you could look circularly to the right until you find an element or reach the same element. If there is no inferior element for a value, then the answer to that query is `-1`.

The **succeeding inferior element** of some element **X** in an array is the **first smaller element to the right of X** in the same array.

### Example 1

> -   **Input:** arr = \[2, 5, 1, 6, 10, 3\]
> -   **Output:** \[1, 1, -1, 3, 3, 2\]
> -   **Explanation:** Succeeding inferior element for each element of arr is given below:
> -   arr\[0\] = 2, inferior element for this value in arr = 1
> -   arr\[1\] = 5, inferior element for this value in arr = 1
> -   arr\[2\] = 1, there is no inferior element for this value in arr, even after circularly visiting the arra,y so the result is -1
> -   arr\[3\] = 6, inferior element for this value in arr = 3
> -   arr\[4\] = 10, inferior element for this value in arr = 3
> -   arr\[5\] = 3, after visiting the array circularly, we find the inferior element for this value in arr = 2

### Example 2

> -   **Input:** arr = \[6, 7, 8, 9, 8\]
> -   **Output:** \[-1, 6, 6, 8, 6\]
> -   **Explanation:** Succeeding inferior element for each element of arr is given below:
> -   arr\[0\] = 6, there is no inferior element for this value in arr, even after circularly visiting the arra,y so the result is -1
> -   arr\[1\] = 7, after visiting the array circularly, we find the inferior element for this value in arr = 6
> -   arr\[2\] = 8, after visiting the array circularly, we find the inferior element for this value in arr = 6
> -   arr\[3\] = 9, inferior element for this value in arr = 8
> -   arr\[4\] = 8, after visiting the array circularly we find the inferior element for this value in arr = 6

## Solution

```cpp
#include <stack>

using namespace std;

class Solution {
public:
    vector<int> succeedingInferiorElementII(vector<int> &arr) {
        int n = arr.size();

        // Initialize result with -1
        vector<int> result(n, -1);

        // Stack to store indices of elements
        stack<int> stack;

        // Iterate twice through the array in reverse order (circularly)
        for (int i = 2 * n - 1; i >= 0; i--) {

            // Circular index
            int index = i % n;
            int num = arr[index];

            // Check if we can pop elements from the stack
            // (i.e., find the succeeding smaller element for those
            // elements)
            while (!stack.empty() && stack.top() >= num) {
                stack.pop();
            }

            // If stack is not empty, the top element is the succeeding
            // inferior element
            if (!stack.empty()) {
                result[index] = stack.top();
            }

            // Always push the element to the stack
            stack.push(num);
        }

        return result;
    }
};
```

***

# Succeeding superior nodes

## Problem Statement

You are given the **head** of a linked list with N nodes. For each node in the list, find the value of the succeding superior node. For a given node, the succeeding superior node is the first node next to it and has a strictly larger value than it. Your function should return an integer array as an answer where the value at the index `i` is the value of the next superior node of the ith node (1-indexed). If the ith node does not have a next superior node, set it to `0`.

### Example 1

> -   **Input:** head = \[2, 1, 5\]
> -   **Output:** \[5, 5, 0\]
> -   **Explanation:** The next superior node for 2 is 5, 1 is 5 and as 5 does not have any next superior node answer will be 0.

### Example 2

> -   **Input:** head = \[2, 7, 4, 3, 5\]
> -   **Output:** \[7, 0, 5, 5, 0\]
> -   **Explanation:** The next superior for 2 is 7, since 7 does not have any next superior its answer will be 0, the next superior for 4 and 3 is 5, and 5 does not have any next superior its answer will be 0.

## Solution

```cpp
#include <stack>

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

// Struct to store index and value of each node
struct NodeInfo {
    int index;
    int value;
};

class Solution {
public:
    vector<int> succeedingSuperiorNodes(ListNode *head) {

        // Stores the next larger elements
        vector<int> result;

        // Stores the elements in a stack along with their indices
        stack<NodeInfo> stack;

        // Keeps track of the current index
        int index = 0;

        while (head != nullptr) {

            // Initialize the result for the current node as 0
            result.push_back(0);

            // While the stack is not empty and the value of the current
            // node is greater than the value of the element at the top
            // of the stack
            while (!stack.empty() && head->val > stack.top().value) {

                // Get the element at the top of the stack
                NodeInfo top = stack.top();

                // Remove the element from the stack
                stack.pop();

                // Set the result at the index of the top element to the
                // value of the current node
                result[top.index] = head->val;
            }

            // Push the current node's index and value to the stack
            stack.push({index++, head->val});

            // Move to the next node
            head = head->next;
        }

        // Return the vector containing the next larger elements
        return result;
    }
};
```

***

# Retained rainwater

## Problem Statement

Given an array **heights** that contains non-negative integers representing an elevation map where the width of each bar is **`1`**, write a function to compute and return how much water it can trap after rain.

### Example

> -   **Input:** heights = \[0, 2, 4, 3, 0, 3, 5, 2, 0, 4, 3, 0, 2\]
> -   **Output:** 14
> -   **Explanation:** In the above elevation map (represented by grey) color, 14 units of rainwater can be trapped (represented by blue).

## Solution

```cpp
#include <algorithm>
#include <stack>

using namespace std;

class Solution {
public:
    int retainedRainwater(vector<int> &heights) {
        int n = heights.size();
        stack<int> stack;
        int waterTrapped = 0;

        for (int i = 0; i < n; ++i) {

            // While the stack is not empty and the current height is
            // greater than the height of the bar at the top of the stack
            while (!stack.empty() && heights[i] > heights[stack.top()]) {
                int top = stack.top();
                stack.pop();

                // No left boundary for trapping water
                if (stack.empty()) {
                    break;
                }

                // Calculate the width of the trapped water
                int width = i - stack.top() - 1;

                // Calculate the height of the trapped water
                // (min of left and right boundary minus the current
                // height)
                int height =
                    min(heights[i], heights[stack.top()]) - heights[top];
                waterTrapped += width * height;
            }

            // Push the current bar index to the stack
            stack.push(i);
        }

        return waterTrapped;
    }
};
```

***

# Largest rectangle area

## Problem Statement

Given an array **histrogram** containing positive integers representing the histogram's bar height where the width of each bar is `1`, write a function to return the area of the largest rectangle formed in the histogram.

### Example

> -   **Input:** histrogram = \[2, 4, 3, 3, 5, 2, 4, 3, 2\]
> -   **Output:** 18
> -   **Explanation:** In the above histogram (represented by grey) colour, the largest rectangle area is 18 (represented by green).

## Solution

```cpp
#include <algorithm>
#include <stack>

using namespace std;

class Solution {
public:
    int largestRectangleArea(vector<int> &histogram) {
        int n = histogram.size();

        // Stack to store indices of bars
        stack<int> stack;

        // To keep track of the maximum area
        int maxArea = 0;

        // Iterate over all the bars in the histogram
        for (int i = 0; i < n; ++i) {

            // While the stack is not empty and the current height is
            // smaller than the height of the bar at the top of the stack
            while (!stack.empty() &&
                   histogram[i] < histogram[stack.top()]) {
                int h = histogram[stack.top()];
                stack.pop();

                // Calculate the width
                int width = stack.empty() ? i : i - stack.top() - 1;

                // Update the maximum area
                maxArea = max(maxArea, h * width);
            }

            // Push the current bar index to the stack
            stack.push(i);
        }

        // After the loop, process any remaining bars in the stack
        while (!stack.empty()) {
            int h = histogram[stack.top()];
            stack.pop();

            // Calculate the width
            int width = stack.empty() ? n : n - stack.top() - 1;

            // Update the maximum area
            maxArea = max(maxArea, h * width);
        }

        return maxArea;
    }
};
```
