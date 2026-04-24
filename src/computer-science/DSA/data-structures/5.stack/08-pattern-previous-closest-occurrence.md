# 8. Pattern: Previous closest occurrence

## Table of contents

1. [Understanding the previous closest occurrence pattern](#understanding-the-previous-closest-occurrence-pattern)
2. [Identifying the previous closest occurrence pattern](#identifying-the-previous-closest-occurrence-pattern)
3. [Preceding superior element](#preceding-superior-element)
4. [Preceding inferior element](#preceding-inferior-element)
5. [Preceding superior element II](#preceding-superior-element-ii)
6. [Preceding inferior element II](#preceding-inferior-element-ii)

***

# Understanding the previous closest occurrence pattern

Some problems require us to find, for each item in a sequence, the closest occurrence of a greater or smaller item. One way to solve this problem would be to use nested loops to traverse backward from each item in the sequence until the required greater or smaller item is found. Consider the example below, where we must find the previous greater item for each item in the array.

// Diagram: Finding the previous greater item for all items in a sequence.

Even though the solution is correct, it requires expensive nested loops that makes the overall performance poor. We can leverage the LIFO (Last in, first out) property of a stack to solve this problem in a single pass without any nested loops using the closest occurrence technique.

The previous closest occurrence pattern is a classification of problems that can be solved using the previous closest occurrence technique using a stack.

## The previous closest occurrence technique

Consider we have an array of **unique** integers `arr` and we need to find the previous greater integer for all items in the array. It is important to note that not all items in the array may have a previous greater integer.

// Diagram: Find the previous greater item for all items in an array arr.

We can solve the problem by traversing the array from start to end and maintaining a chain of previous greater items starting from the previous item. We will learn more about the proof of correctness of this technique later in this lesson.

We create a stack of integers `stack` to hold this chain and an array `result` that is initialized with a sentinal value (-1) to store the closest previous greater item for each item in the array `arr`. We traverse the array `arr` from start to end, and in each iteration, repeatedly pop the items from the `stack` until the value at the top becomes greater than the current item.

We then assign the value at the top of the stack as the closest previous greater item for the current item in the `result` array and push the current item at the top of the `stack`. This process is then repeated for the next item in `arr`. Because we only remove items smaller than the current item from the stack before adding the current item, the chain of previous greater items is always maintained. 

At the end of the traversal, the `result` array will have the previous greater item for all items in the array `arr` that have a solution, and for all other items, it will have the sentinal (-1) value.

// Diagram: Find the previous greater item for all items in an array

## Proof of Correctness

Now consider for any item `arr[j]` in a sequence `arr`, its closest previous greater item is `arr[in]`, whose closest previous greater item is `arr[in-1]`, and so on till `arr[i]` where `arr[i]` does not have any previous greater item such that `i1 < i2 ... < in-1 < in < j`. We maintain this chain of previous greater items as a list `chain`.

We can prove that if we correctly maintain the list `chain` at all steps, as we traverse the sequence, we can use it to find the closest previous greater item for all items in the sequence.

// Diagram: We maintain a chain of previous greater items for the item at index j in chain.

Now, to find the closest previous greater item for `arr[j+1]` there can be two cases.

### 1\. arr\[j+1\] < arr\[j\]

In this case, we simply assign `arr[j]` as the closest previous item for `arr[j+1].` We also add `arr[j+1]` to the list `chain` to ensure it is correct for the next iteration considering `arr[j+2]`.

// Diagram: We can mark the item at index j as the previous greater item for item at index j+1.

### 2\. arr\[j+1\] > arr\[j\]

In this case, we need to look at all items before `arr[j+1]` to find the previous greater item for `arr[j]`. However, since we know looking at `chain` that the closest previous greater item for `arr[j+1]` is `arr[in],` we can ignore all items between indices `in` and `j`.

// Diagram: We can ignore all items in the array between index in and j.

We can similarly continue going back following the closest previous greater item successively in `chain` skipping all array items in between until we find an item that is greater than `arr[j+1].` Consider for this example that `arr[i1] > arr[j+1];` once we reach `arr[i1],` we can mark it as the closest previous greater item for `arr[j+1]`.

// Diagram: We can ignore all items in the array until the index i1.

Finally, we remove all the items from the `chain` until `arr[i1]` and add `arr[j+1]` to ensure the chain of closest previous greater items is correct and start from the previous item as we move to `arr[j+2]` in the next iteration.

// Diagram: We remove all items until arr\[i1\] from the chain for the next iteration.

When we start with the first item in the sequence, the chain `l` is empty as the first item does not have any previous closest greater item. We proved we can find the solution for the `j+1` item if the list `l` holds the chain of the closest previous greater items starting from `j` by following the steps above. Hence it is proved by induction that the solution is correct.

## Algorithm

The algorithm given below outlines the technique to find the previous greater item for all items in an array `arr`.

> **Algorithm**
>
> -   **Step 1:** Create an array \`previousGreater\` to store the closest previous greater items for all items in array and initialize it with -1 as a sentinal value
> -   **Step 2:** Initialize a stack \`stack\` to store the chain of closest previous greater items
> -   **Step 3:** Iterate in \`arr\` from start to end and in each iteration do the following:
>     -   **Step 3.1:** Pop the items from the top of the \`stack\` while the stack is not empty and the current item is greater than the item at the top of the \`stack\`
>     -   **Step 3.2:** If \`stack\` is not empty, store the item at the top of the \`stack\` as closest previous greater item of the current item in \`previousGreater\` array.
>     -   **Step 3.3:** Push the current item in \`arr\` to the top of the stack \`stack\`
> -   **Step 4:** The \`previousGreater\` array has the closest previous greater item for items in \`arr\` that have a solution

## Implementation

Given below is the generic code implementation to find the previous greater item for all items in an integer array.

C++

```cpp
vector<int> previousGreaterOccurrence(vector<int> &arr)
{
    // Array to store the previous greater elements for arr
    vector<int> previousGreater(arr.size(), -1);

    // Stack to hold the chain of previous greater items
    stack<int> stack;

    // Iterate over the array
    for (int i=0; i<arr.size(); i++) {
        // Keep popping elements from the stack
        // until we find an item greater than the current item
        while (!stack.empty() && stack.top() < arr[i]) {
            stack.pop();
        }

        // If the stack is not empty, the top item is the previous greater item
        if (!stack.empty()) {
            previousGreater[i] = stack.top();
        }

        // Push the current element onto the stack
        stack.push(arr[i]);
    }

    return previousGreater;
}
```

Java

```java
class previousGreaterOccurrence {
    public List<Integer> previousGreaterOccurrence(List<Integer> arr) {

        // Array to store the previous greater elements for arr
        List<Integer> previousGreater = new ArrayList<>();
        for (int i = 0; i < arr.size(); i++) {
            previousGreater.add(-1);
        }

        // Stack to hold the chain of previous greater items
        Stack<Integer> stack = new Stack<>();

        // Iterate over the array
        for (int i = 0; i < arr.size(); i++) {
            // Keep popping elements from the stack
            // until we find an item greater than the current item
            while (!stack.isEmpty() && stack.peek() < arr.get(i)) {
                stack.pop();
            }

            // If the stack is not empty, the top item is the previous greater item
            if (!stack.isEmpty()) {
                previousGreater.set(i, stack.peek());
            }

            // Push the current element onto the stack
            stack.push(arr.get(i));
        }

        return previousGreater;
    }
```

Typescript

```typescript
function previousGreaterOccurrence(arr: number[]): number[] {
  // Array to store the previous greater elements for arr
  const previousGreater: number[] = new Array(arr.length).fill(-1);

  // Stack to hold the chain of previous greater items
  const stack: number[] = [];

  // Iterate over the array
  for (let i = 0; i < arr.length; i++) {
    // Keep popping elements from the stack
    // until we find an item greater than the current item
    while (stack.length > 0 && stack[stack.length - 1] < arr[i]) {
      stack.pop();
    }

    // If the stack is not empty, the top item is the previous greater item
    if (stack.length > 0) {
      previousGreater[i] = stack[stack.length - 1];
    }

    // Push the current element onto the stack
    stack.push(arr[i]);
  }

  return previousGreater;
}
```

Javascript

```javascript
function previousGreaterOccurrence(arr) {
  // Array to store the previous greater elements for arr
  const previousGreater = new Array(arr.length).fill(-1);

  // Stack to hold the chain of previous greater items
  const stack = [];

  // Iterate over the array
  for (let i = 0; i < arr.length; i++) {
    // Keep popping elements from the stack
    // until we find an item greater than the current item
    while (stack.length > 0 && stack[stack.length - 1] < arr[i]) {
      stack.pop();
    }

    // If the stack is not empty, the top item is the previous greater item
    if (stack.length > 0) {
      previousGreater[i] = stack[stack.length - 1];
    }

    // Push the current element onto the stack
    stack.push(arr[i]);
  }

  return previousGreater;
}
```

Python

```python
def previous_greater_occurrence(arr: List[int]) -> List[int]:
    """
    Find the previous smaller occurrence for each element in the array.

    :param arr: A list of integers.
    :return: A list of integers where each element represents the previous smaller element
             in the input array, or -1 if no such element exists.
    """
    # List to store the previous greater elements for arr
    previous_greater: List[int] = [-1] * len(arr)

    # Stack to hold the chain of previous greater items
    stack: List[int] = []

    # Iterate over the array
    for i in range(len(arr)):
        # Keep popping elements from the stack
        # until we find an item greater than the current item
        while stack and stack[-1] < arr[i]:
            stack.pop()

        # If the stack is not empty, the top item is the previous greater item
        if stack:
            previous_greater[i] = stack[-1]

        # Push the current element onto the stack
        stack.append(arr[i])

    return previous_greater
```

## Complexity Analysis

The algorithm's time and space complexity is easy to understand. We traverse the sequence from start to end once in any case, and in each iteration, pop one or more items from the stack. Since the stack will only hold all items in the array once, a total of **N** push operations and at max **N** pop operations are done throughout the traversal where each operation is constant **O(1)** time. We may update up to **N** items into the solution array where each operation is constant **O(1)** time. This results in an overall linear **O(N)** time complexity.

We create a result array to store the result which is of the same size as the input contributing **O(N)** space. We copy all the data items to the stack as we traverse the array. When the input sequence is ordered in increasing order of value, all items are accumulated in the stack, leading to **O(N)** space for the stack. In the other case, when the sequence is ordered in the decreasing order of value, the stack will only have 1 item at any time, leading to constant **O(1)** space for the stack, but the result array still contributes to linear **O(N)** space.

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

Later in the course, we will examine techniques for identifying problems that can be solved using the previous closest occurrence technique and walk through an example to better understand it.

***

# Identifying the previous closest occurrence pattern

The previous closest occurrence technique can only solve some specific problems. These are generally **medium**or **hard** problems involving linear data structures like arrays, strings, or linked lists where we need to find the previous greater or smaller item in the sequence. Most problems under this pattern can be solved by directly applying the previous closest occurrence technique, while some may require additional steps.

If the problem statement or its solution follows the generic template below, it can be solved by applying the closest occurrence technique.

**Template:**Given a sequential data structure, find the  closest greater or smaller item in the sequence.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the closest occurrence technique.

> **Problem statement:** Given two arrays \`arr1\` and \`arr2\` such that \`arr2\` is a subset of \`arr1\` and all items in \`arr1\` are unique, for each item in \`arr2\` find the previous closest greater item in \`arr1\`. If an item does not have a previous greater value, use -1 for it.

// Diagram: Find the previous greater items for items in arr2 in arr1.

## Brute force

The brute-force solution to this problem is to use a loop and iterate in `arr2` and for each item we iterate forward in `arr1` until we find the same item in `arr1`. We initialize a variable `previousGreater` with a sentinal value (-1), and as we iterate through `arr1`, we keep track of the most recent item that is greater than the current item in `arr2` in `previousGreater`. When we find the current value in `arr1`, we use the value `previousGreater` as its previous greater value.

// Diagram: Find the previous greater item for all items in arr2 in arr1

The implementation of the brute force solution is given as follows.

C++

```cpp
#include <stack>
#include <unordered_map>

// Diagram: using namespace std;

class Solution {
public:
    vector<int> precedingSuperiorElement(
        vector<int> &arr1,
        vector<int> &arr2
    ) {

        // Array to store the previous greater elements for arr1
        vector<int> previousGreater(arr1.size(), -1);

        // Map to store the last index of each element in arr1
        unordered_map<int, int> indexMap;

        // Stack to help find the previous greater element efficiently
        stack<int> stack;

        // Step 1: Build the previous greater elements array for arr1
        for (int i = 0; i < arr1.size(); i++) {
            int num = arr1[i];

            // Remove elements from the stack that are smaller than or
            // equal to the current element
            while (!stack.empty() && stack.top() <= num) {
                stack.pop();
            }

            // If the stack is not empty, set the previous greater
            // element
            if (!stack.empty()) {
                previousGreater[i] = stack.top();
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

            // Push the previous greater element if found, otherwise -1
            result.push_back(
                indexMap.count(num) ? previousGreater[indexMap[num]] : -1
            );
        }

        return result;
    }
};
```

Java

```java
public class PrecedingSuperiorElement {

    public List<Integer> precedingSuperiorElement(
        List<Integer> arr1,
        List<Integer> arr2) {

        // List to store the previous greater elements for arr2
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < arr2.size(); i++) {
            result.add(-1);
        }

        // Iterate through each element in arr2
        for (int i = 0; i < arr2.size(); i++) {
            // Variable to store the latest greater value in arr1
            int previousGreater = -1;

            // Iterate through arr1 to find the preceding superior element
            for (int j = 0; j < arr1.size(); j++) {
                // Update previousGreater with the latest value in arr1
                // greater than the current item in arr2
                if (arr1.get(j) > arr2.get(i)) {
                    previousGreater = arr1.get(j);
                }
                // If we find the current item in arr1, use the latest
                // greater value found as the preceding superior element
                else if (arr1.get(j).equals(arr2.get(i))) {
                    result.set(i, previousGreater);
                }
        return result;
    }
```

Typescript

```typescript
function precedingSuperiorElement(arr1: number[], arr2: number[]): number[] {
  // Array to store the previous greater elements for arr2
  const result: number[] = new Array(arr2.length).fill(-1);

  for (let i = 0; i < arr2.length; i++) {
    // Find the index of this item in arr1
    let previousGreater = -1;
    for (let j = 0; j < arr1.length; j++) {
      // Always keep the latest value in arr1 greater than
      // current item in arr2
      if (arr1[j] > arr2[i]) {
        previousGreater = arr1[j];
      }
      // If we find the current item in arr1, use the
      // latest greater value found as previous greater
      else if (arr1[j] === arr2[i]) {
        result[i] = previousGreater;
      }
  return result;
}
```

Javascript

```javascript
function precedingSuperiorElement(arr1, arr2) {
  // Array to store the previous greater elements for arr2
  const result = new Array(arr2.length).fill(-1);

  for (let i = 0; i < arr2.length; i++) {
    // Find the index of this item in arr1
    let previousGreater = -1;
    for (let j = 0; j < arr1.length; j++) {
      // Always keep the latest value in arr1 greater than
      // current item in arr2
      if (arr1[j] > arr2[i]) {
        previousGreater = arr1[j];
      }
      // If we find the current item in arr1, use the
      // latest greater value found as previous greater
      else if (arr1[j] === arr2[i]) {
        result[i] = previousGreater;
      }
  return result;
}
```

Python

```python
def preceding_superior_element(arr1: List[int], arr2: List[int]) -> List[int]:
    # List to store the previous greater elements for arr2
    result: List[int] = [-1] * len(arr2)

    for i in range(len(arr2)):
        # Find the index of this item in arr1
        previous_greater = -1
        for j in range(len(arr1)):
            # Always keep the latest value in arr1 greater than
            # current item in arr2
            if arr1[j] > arr2[i]:
                previous_greater = arr1[j]
            # If we find the current item in arr1, use the
            # latest greater value found as previous greater
            elif arr1[j] == arr2[i]:
                result[i] = previous_greater

    return result
```

Though the solution is correct, it requires nested loops and has a time complexity of **O(N^2)** in the worst case when the array items are arranged in increasing order of value in `arr1`.

## The previous closest occurrence technique

We can easily solve this problem by finding the  closest greater item for all items in `arr1` and then only selecting the results for items in `arr2`. The problem description fits the template for the  closest occurrence pattern, as given below.

**Template:**

Given a sequential data structure (`arr1`), find the previous closest greater item in the sequence.

We can now directly apply the previous closest occurrence technique we learned earlier. We initialize astack of integers `stack` and an array `previousGreater` initialized with a sentinal value (-1) to store the results. We also create a hash map `indexMap` to map values in `arr1` with their indices. We will use this map later to find indices of values in `arr2` in `arr1`.

We traverse the array `arr1` from start to end, and in each iteration, repeatedly pop the items from the `stack` until the value at the top becomes greater than the current item. We then assign the value at the top of the stack as the previous greater item for the current item in the `greaterElements` array and push the current item at the top of the `stack`. Finally we map the current value with its index `arr1` in `indexMap` to be used later. This process is then repeated for the next item in `arr1`.

At the end of the traversal, the `greaterElements` will have the previous greater item for all items in `arr1` that have a solution.

// Diagram: Find the previous greater item for all items in arr1

We create a `result` array, traverse in `arr2` and use the `indexMap` to fill the previous greater items for all items in `arr2` in the `result` array.

// Diagram: Use indexMap to find results for arr2

The implementation of the previous closest occurrence technique is given below.

C++

```cpp
#include <stack>
#include <unordered_map>

// Diagram: using namespace std;

class Solution {
public:
    vector<int> precedingSuperiorElement(
        vector<int> &arr1,
        vector<int> &arr2
    ) {

        // Array to store the previous greater elements for arr1
        vector<int> previousGreater(arr1.size(), -1);

        // Map to store the last index of each element in arr1
        unordered_map<int, int> indexMap;

        // Stack to help find the previous greater element efficiently
        stack<int> stack;

        // Step 1: Build the previous greater elements array for arr1
        for (int i = 0; i < arr1.size(); i++) {
            int num = arr1[i];

            // Remove elements from the stack that are smaller than or
            // equal to the current element
            while (!stack.empty() && stack.top() <= num) {
                stack.pop();
            }

            // If the stack is not empty, set the previous greater
            // element
            if (!stack.empty()) {
                previousGreater[i] = stack.top();
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

            // Push the previous greater element if found, otherwise -1
            result.push_back(
                indexMap.count(num) ? previousGreater[indexMap[num]] : -1
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
    public int[] precedingSuperiorElement(int[] arr1, int[] arr2) {

        // Array to store the previous greater elements for arr1
        int[] previousGreater = new int[arr1.length];
        Arrays.fill(previousGreater, -1);

        // Map to store the last index of each element in arr1
        Map<Integer, Integer> indexMap = new HashMap<>();

        // Stack to help find the previous greater element efficiently
        Stack<Integer> stack = new Stack<>();

        // Step 1: Build the previous greater elements array for arr1
        for (int i = 0; i < arr1.length; i++) {
            int num = arr1[i];

            // Remove elements from the stack that are smaller than or
            // equal to the current element
            while (!stack.isEmpty() && stack.peek() <= num) {
                stack.pop();
            }

            // If the stack is not empty, set the previous greater
            // element
            if (!stack.isEmpty()) {
                previousGreater[i] = stack.peek();
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

            // Push the previous greater element if found, otherwise -1
            result[i] =
                indexMap.containsKey(num)
                    ? previousGreater[indexMap.get(num)]
                    : -1;
        }

        return result;
    }
```

Typescript

```typescript
export class Solution {
    precedingSuperiorElement(arr1: number[], arr2: number[]): number[] {

        // Array to store the previous greater elements for arr1
        const previousGreater: number[] = Array(arr1.length).fill(-1);

        // Map to store the last index of each element in arr1
        const indexMap: Map<number, number> = new Map();

        // Stack to help find the previous greater element efficiently
        const stack: number[] = [];

        // Step 1: Build the previous greater elements array for arr1
        for (let i = 0; i < arr1.length; i++) {
            const num = arr1[i];

            // Remove elements from the stack that are smaller than or
            // equal to the current element
            while (stack.length > 0 && stack[stack.length - 1] <= num) {
                stack.pop();
            }

            // If the stack is not empty, set the previous greater
            // element
            if (stack.length > 0) {
                previousGreater[i] = stack[stack.length - 1];
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

            // Push the previous greater element if found, otherwise -1
            result.push(
                indexMap.has(num)
                    ? previousGreater[indexMap.get(num)!]
                    : -1
            );
        }

        return result;
    }
```

Javascript

```javascript
export class Solution {
    precedingSuperiorElement(arr1, arr2) {

        // Array to store the previous greater elements for arr1
        const previousGreater = Array(arr1.length).fill(-1);

        // Map to store the last index of each element in arr1
        const indexMap = new Map();

        // Stack to help find the previous greater element efficiently
        const stack = [];

        // Step 1: Build the previous greater elements array for arr1
        for (let i = 0; i < arr1.length; i++) {
            const num = arr1[i];

            // Remove elements from the stack that are smaller than or
            // equal to the current element
            while (stack.length > 0 && stack[stack.length - 1] <= num) {
                stack.pop();
            }

            // If the stack is not empty, set the previous greater
            // element
            if (stack.length > 0) {
                previousGreater[i] = stack[stack.length - 1];
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

            // Push the previous greater element if found, otherwise -1
            result.push(
                indexMap.has(num)
                    ? previousGreater[indexMap.get(num)]
                    : -1
            );
        }

        return result;
    }
```

Python

```python
from typing import List

class Solution:
    def preceding_superior_element(
        self, arr1: List[int], arr2: List[int]
    ) -> List[int]:

        # Array to store the previous greater elements for arr1
        previous_greater = [-1] * len(arr1)

        # Map to store the last index of each element in arr1
        index_map = {}

        # Stack to help find the previous greater element efficiently
        stack = []

        # Step 1: Build the previous greater elements array for arr1
        for i, num in enumerate(arr1):

            # Remove elements from the stack that are smaller than or
            # equal to the current element
            while stack and stack[-1] <= num:
                stack.pop()

            # If the stack is not empty, set the previous greater element
            if stack:
                previous_greater[i] = stack[-1]

            # Push the current element onto the stack for future elements
            stack.append(num)

            # Store the index of the current element in the index map
            index_map[num] = i

        # Step 2: Process arr2 to generate the result
        result = []
        for num in arr2:

            # Push the previous greater element if found, otherwise -1
            result.append(
                previous_greater[index_map[num]]
                if num in index_map
                else -1
            )

        return result
```

The previous closest occurrence technique solves the problem in a single pass and linear **O(N)** time.

## Example problems

Most problems in this category are **medium** or **hard**; a list of a few is given below.

> -   **[Preceding superior element](https://www.codeintuition.io/courses/stack/TInEND-V_9_upubzDQwk2)**
> -   **[Preceding inferior element](https://www.codeintuition.io/courses/stack/wg19uEWxcOAUB8Msutu06)**
> -   **[Preceding superior element II](https://www.codeintuition.io/courses/stack/uV1EYrYYf8JyrU7TE5Mmj)**
> -   **[Preceding inferior element II](https://www.codeintuition.io/courses/stack/B8FHC7X4w6OVIfmONnT_S)**

We will now solve these problems to understand the previous closest occurrence technique better.

***

# Preceding superior element

## Problem Statement

Given two arrays, **arr1**, and **arr2**, such that arr2 is a subset of arr1. Write a function to return a new array containing the preceding superior element of each element present in arr2 from arr1. If there is no superior element for a value, then the answer to that query is `-1.`

The **preceding superior element** of some element **X** in an array is the **first greater element to the left of X** in the same array.

It is guaranteed that all elements in the input arrays will be unique.

### Example 1

> -   **Input:** arr1 = \[3, 5, 1, 6, 8, 7\], arr2 = \[3, 1, 8, 7\]
> -   **Output:** \[-1, 5, -1, 8\]
> -   **Explanation:** Preceding superior element for each element of arr1 in arr2 is given below:
> -   arr2\[0\] = 3, there is no superior element for this value in arr1, so the result is -1
> -   arr2\[1\] = 1, superior element for this value in arr1 = 5
> -   arr2\[2\] = 8, there is no superior element for this value in arr1, so the result is -1
> -   arr2\[3\] = 7, there is no superior element for this value in arr1, so the result = 8

### Example 2

> -   **Input:** arr1 = \[5, 9, 7, 8, 1\], arr2 = \[5, 9, 7\]
> -   **Output:** \[-1, -1, 9\]
> -   **Explanation:** Preceding superior element for each element of arr1 in arr2 is given below:
> -   arr2\[0\] = 5, there is no superior element for this value in arr1, so the result is -1
> -   arr2\[1\] = 9, there is no superior element for this value in arr1, so the result is -1
> -   arr2\[2\] = 7, superior element for this value in arr1 = 9

## Solution

```cpp
#include <stack>
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<int> precedingSuperiorElement(
        vector<int> &arr1,
        vector<int> &arr2
    ) {

        // Array to store the previous greater elements for arr1
        vector<int> previousGreater(arr1.size(), -1);

        // Map to store the last index of each element in arr1
        unordered_map<int, int> indexMap;

        // Stack to help find the previous greater element efficiently
        stack<int> stack;

        // Step 1: Build the previous greater elements array for arr1
        for (int i = 0; i < arr1.size(); i++) {
            int num = arr1[i];

            // Remove elements from the stack that are smaller than or
            // equal to the current element
            while (!stack.empty() && stack.top() <= num) {
                stack.pop();
            }

            // If the stack is not empty, set the previous greater
            // element
            if (!stack.empty()) {
                previousGreater[i] = stack.top();
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

            // Push the previous greater element if found, otherwise -1
            result.push_back(
                indexMap.count(num) ? previousGreater[indexMap[num]] : -1
            );
        }

        return result;
    }
};
```

***

# Preceding inferior element

## Problem Statement

Given two arrays, **arr1**, and **arr1**, such that arr2 is a subset of arr1. Write a function to return a new array containing the preceding inferior element of each element present in arr2 from arr1. If there is no inferior element for a value, then the answer to that query is `-1.`

The **preceding** inferior **element** of some element **X** in an array is the **first smaller element to the left of X** in the same array.

It is guaranteed that all elements in the input array are unique.

### Example 1

> -   **Input:** arr1 = \[3, 5, 1, 6, 8, 2\], arr2 = \[3, 1, 8, 2\]
> -   **Output:** \[-1, -1, 6, 1\]
> -   **Explanation:** Preceding inferior element for each element of arr1 in arr2 is given below:
> -   arr2\[0\] = 3, there is no inferior element for this value in arr1, so the result is -1
> -   arr2\[1\] = 1, there is no inferior element for this value in arr1, so the result is -1
> -   arr2\[2\] = 8, inferior element for this value in arr1 = 6
> -   arr2\[3\] = 2, inferior element for this value in arr1 = 1

### Example 2

> -   **Input:** arr1 = \[5, 9, 7, 8, 1\], arr2 = \[5, 9, 7\]
> -   **Output:** \[-1, 5, 5\]
> -   **Explanation:** Preceding inferior element for each element of arr1 in arr2 is given below:
> -   arr2\[0\] = 5, there is no inferior element for this value in arr1 so, the result is -1
> -   arr2\[1\] = 9, inferior element for this value in arr1 = 5
> -   arr2\[2\] = 7, inferior element for this value in arr1 = 5

## Solution

```cpp
#include <stack>
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<int> precedingInferiorElement(
        vector<int> &arr1,
        vector<int> &arr2
    ) {

        // Array to store the previous smaller elements for arr1
        vector<int> previousSmaller(arr1.size(), -1);

        // Map to store the last index of each element in arr1
        unordered_map<int, int> indexMap;

        // Stack to help find the previous smaller element efficiently
        stack<int> stack;

        // Step 1: Build the previous smaller elements array for arr1
        for (int i = 0; i < arr1.size(); i++) {
            int num = arr1[i];

            // Remove elements from the stack that are greater than or
            // equal to the current element
            while (!stack.empty() && stack.top() >= num) {
                stack.pop();
            }

            // If the stack is not empty, set the previous smaller
            // element
            if (!stack.empty()) {
                previousSmaller[i] = stack.top();
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

            // Push the previous smaller element if found, otherwise -1
            result.push_back(
                indexMap.count(num) ? previousSmaller[indexMap[num]] : -1
            );
        }

        return result;
    }
};
```

***

# Preceding superior element II

## Problem Statement

Given a circular array **arr**, write a function to return a new array containing the precedingsuperior element of each element present in arr. Since the array is circular, to find the preceding superior element, you could look circularly to the right until you find an element or reach the same element. If there is no superior element for a value, then the answer to that query is `-1`.

The **preceding superior element** of some element **X** in an array is the **first greater element to the left of X** in the same array.

### Example 1

> -   **Input:** arr = \[2, 5, 1, 6, 10, 3\]
> -   **Output:** \[3, 10, 5, 10, -1, 10\]
> -   **Explanation:** Preceding superior element for each element of arr is given below:
> -   arr\[0\] = 2, after visiting the array circularly, we find the superior element for this value in arr = 3
> -   arr\[1\] = 5, after visiting the array circularly, we find the superior element for this value in arr = 10
> -   arr\[2\] = 1, superior element for this value in arr = 5
> -   arr\[3\] = 6, after visiting the array circularly, we find the superior element for this value in arr = 10
> -   arr\[4\] = 10, there is no superior element for this value in arr, even after circularly visiting the array, so the result is -1
> -   arr\[5\] = 3, superior element for this value in arr = 10

### Example 2

> -   **Input:** arr = \[6, 7, 8, 9, 8\]
> -   **Output:** \[8, 8, 9, -1, 9\]
> -   **Explanation:** Preceding superior element for each element of arr is given below:
> -   arr\[0\] = 6, after visiting the array circularly, we find the superior element for this value in arr = 8
> -   arr\[1\] = 7, after visiting the array circularly, we find the superior element for this value in arr = 8
> -   arr\[2\] = 8, after visiting the array circularly, we find the superior element for this value in arr = 9
> -   arr\[3\] = 9, there is no superior element for this value in arr, even after circularly visiting the array, so the result is -1
> -   arr\[4\] = 8, superior element for this value in arr = 9

## Solution

```cpp
#include <stack>

using namespace std;

class Solution {
public:
    vector<int> precedingSuperiorElementII(vector<int> &arr) {
        int n = arr.size();

        // Initialize result with -1
        vector<int> result(n, -1);

        // Stack to store indices of elements
        stack<int> stack;

        // Iterate twice through the array (circularly)
        for (int i = 0; i < 2 * n; i++) {

            // Circular index
            int index = i % n;
            int num = arr[index];

            // Check if we can pop elements from the stack
            // (i.e., find the preceding greater element)
            while (!stack.empty() && stack.top() <= num) {
                stack.pop();
            }

            // If stack is not empty, the top element is the preceding
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

# Preceding inferior element II

## Problem Statement

Given a circular array **arr**, write a function to return a new array containing the preceding inferior element of each element present in arr. Since the array is circular, to find the preceding inferior element, you could look circularly to the right until you find an element or reach the same element. If there is no inferior element for a value, then the answer to that query is `-1`.

The **preceding inferior element** of some element **X** in an array is the **first smaller element that is to the left of X** in the same array.

### Example 1

> -   **Input:** arr = \[2, 5, 1, 6, 10, 3\]
> -   **Output:** \[1, 2, -1, 1, 6, 1\]
> -   **Explanation:** Preceding inferior element for each element of arr is given below:
> -   arr\[0\] = 2, after visiting the array circularly, we find the inferior element for this value in arr = 1
> -   arr\[1\] = 5, after visiting the array circularly, we find the inferior element for this value in arr = 2
> -   arr\[2\] = 1, there is no inferior element for this value in arr even after circularly visiting the array, so the result is -1
> -   arr\[3\] = 6, inferior element for this value in arr = 1
> -   arr\[4\] = 10, inferior element for this value in arr = 6
> -   arr\[5\] = 3, inferior element for this value in arr = 1

### Example 2

> -   **Input:** arr = \[6, 7, 8, 9, 8\]
> -   **Output:** \[-1, 6, 7, 8, 7\]
> -   **Explanation:** Preceding inferior element for each element of arr is given below:
> -   arr\[0\] = 6, there is no inferior element for this value in arr, even after circularly visiting the array, so the result is -1
> -   arr\[1\] = 7, inferior element for this value in arr = 6
> -   arr\[2\] = 8, inferior element for this value in arr = 7
> -   arr\[3\] = 9, inferior element for this value in arr = 8
> -   arr\[4\] = 8, inferior element for this value in arr = 7

## Solution

```cpp
#include <stack>

using namespace std;

class Solution {
public:
    vector<int> precedingInferiorElementII(vector<int> &arr) {
        int n = arr.size();

        // Initialize result with -1
        vector<int> result(n, -1);

        // Stack to store indices of elements
        stack<int> stack;

        // Iterate twice through the array (circularly)
        for (int i = 0; i < 2 * n; i++) {

            // Circular index
            int index = i % n;
            int num = arr[index];

            // Check if we can pop elements from the stack
            // (i.e., find the preceding smaller element)
            while (!stack.empty() && stack.top() >= num) {
                stack.pop();
            }

            // If stack is not empty, the top element is the preceding
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
