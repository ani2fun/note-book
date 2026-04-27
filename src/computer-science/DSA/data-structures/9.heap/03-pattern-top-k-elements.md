# Pattern: Top K elements

## Table of Contents

1. [Understanding the top k elements pattern](#understanding-the-top-k-elements-pattern)
2. [Identifying the top k elements pattern](#identifying-the-top-k-elements-pattern)
3. [Kth largest element](#kth-largest-element)
4. [Kth smallest element](#kth-smallest-element)
5. [K range sum](#k-range-sum)
6. [K sorted array sorting](#k-sorted-array-sorting)

***

# Understanding the top K elements pattern

The heap data structure implemented as a binary tree follows the special heap property, which guarantees an order among extracted values. Data stored in a min-heap is extracted in the increasing order of its values, while for a max-heap, it is extracted in the decreasing order of values. Some problems require us to find and process the top k items in a dataset. While there are other ways, like sorting, to solve such problems, we can use a heap to solve them more efficiently and in a single pass using the top k technique.

The top k pattern is a classification of problems that can be solved using the top k technique.

In this lesson, we will learn more about using the top k technique to solve problems and how to identify a problem as a top k pattern problem.

## The top K technique

Consider we are given a set of values in an array and an integer `k`, and we need to aggregate the value of a function `f` over the top `k` values in the array. The function `f` can be any aggregating function like sum, average, last, add to list, etc.

The meaning of **top** `k` is often inferred from the problem and could be the `k` **largest** or `k` **smallest** values. For this example, top `k` means the `k` largest. As we will see shortly, the same technique can also be used to find the `k` smallest items.

// Diagram: Find the aggregated value of the function f over the top k items in the array

We can find the `k` largest items using a min-heap as a sliding window in the array. The idea is simple: we create a **min-heap** `minHeap` that will always store the `k` largest items in the array **seen so far**.

We iterate in the array from start to end and in each iteration add the current element to `minHeap`,. If the size of minHeap exceeds `k`, we remove the smallest element from `minHeap` which is at the top (since it is a min-heap). This way, the invariant that `minHeap` always stores the `k` largest items seen so far is always maintained. And so, at the end of all iterations `minHeap` has the `k` largest items in the array with the smallest (the kth largest item) at the top.

If the top k means the k smallest values, we would use a maxHeap instead of a minHeap.

// Diagram: Find the aggregated value of the function f over the top k items in the array

We then initialize a variable `aggregate` with a default value. Finally, we extract all items from `minHeap` and aggregate them in `aggregate` using the function `f`.

// Diagram: Find the aggregated value of function f over the items in minHeap

## Algorithm

The algorithm given below outlines the generic algorithm to find the aggregated value of a function `f` over the `k` largest items in an array using a min-heap. The same algorithm can be used for the `k` smallest items by using a max-heap in place of a min-heap.

> -   **Step 1:** Create a min heap `minHeap`
> -   **Step 2:** Iterate in the array and do the following:
>     -   **Step 2.1:** Add the current item to `minHeap`
>     -   **Step 2.2:** If the size of `minHeap` becomes greater than `k`, remove the item at the top
> -   **Step 3:** Initialize a variable `aggregate` with a default value
> -   **Step 4:** Do the following until `minHeap` is empty:
>     -   **Step 4.1:** Pop the item at the top of `minHeap`
>     -   **Step 4.2:** Add the contribution of the popped item to `aggregate` using function `f`
> -   **Step 5:** Return `aggregate`

## Implementation

Given below is the generic code implementation to find the aggregated value of a function `f` over the `k` largest items in an array using a min-heap. It uses the library implementation of a min heap for every language instead of creating one from scratch. The same implementation can be used for the `k` smallest items by using a max-heap instead of a min-heap.

C++

```cpp
#include <queue>

// Diagram: using namespace std;

class Solution {
public:
    int kLargest(vector<int> &arr, int k) {

        // Create a min heap to store the k largest elements
        priority_queue<int, vector<int>, greater<int>> minHeap;

        // Add all items to minHeap
        for (int i = 0; i < arr.size(); i++) {
            minHeap.push(arr[i]);
            // Pop an item from the top if the size > k
            if (minHeap.size() > k) {
              minHeap.pop();
            }

        // Initialize an aggregate variable to a default value
        int aggregate = 0;

        // Extract all values from the heap and aggregate them over
        // the function f
        while (!minHeap.empty()) {
            aggregate = f(aggregate, minHeap.top());
            minHeap.pop();
        }

        return aggregate;
    }
};
```

Java

```java
import java.util.PriorityQueue;
import java.util.List;

class Solution {
    public int kLargest(List<Integer> arr, int k) {

        // Create a min heap to store the k largest elements
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();

        // Add all items to minHeap
        for (int i = 0; i < arr.size(); i++) {
            minHeap.add(arr.get(i));
            // Pop an item from the top if the size > k
            if (minHeap.size() > k) {
                minHeap.poll();
            }

        // Initialize an aggregate variable to a default value
        int aggregate = 0;

        // Extract all values from the heap and aggregate them over
        // the function f
        while (!minHeap.isEmpty()) {
            aggregate = f(aggregate, minHeap.peek());
            minHeap.poll();
        }

        return aggregate;
    }

```

Typescript

```typescript
import { PriorityQueue } from "datastructures-js";

// Diagram: function compareMinHeap(a: number, b: number): number {

    // In min heap, the smallest number should come first
    return a - b;
}

class Solution {
  kLargest(arr: number[], k: number): number {
    // Create a min heap to store the k largest elements
    const minHeap = new PriorityQueue<number>(compareMinHeap);

    // Add all items to minHeap
    for (let i = 0; i < arr.length; i++) {
      minHeap.enqueue(arr[i]);
      // Pop an item from the top if the size > k
      if (minHeap.size() > k) {
        minHeap.dequeue();
      }

    // Initialize an aggregate variable to a default value
    let aggregate = 0;

    // Extract all values from the heap and aggregate them over
    // the function f
    while (!minHeap.isEmpty()) {
      aggregate = f(aggregate, minHeap.dequeue().element);
    }

    return aggregate;
  }
```

Javascript

```javascript
import { PriorityQueue } from "datastructures-js";

// Diagram: function compareMinHeap(a, b) {

    // In min heap, the smallest number should come first
    return a - b;
}

class Solution {
  kLargest(arr, k) {
    // Create a min heap to store the k largest elements
    const minHeap = new PriorityQueue(compareMinHeap);

    // Add all items to minHeap
    for (let i = 0; i < arr.length; i++) {
      minHeap.enqueue(arr[i]);
      // Pop an item from the top if the size > k
      if (minHeap.size() > k) {
        minHeap.dequeue();
      }

    // Initialize an aggregate variable to a default value
    let aggregate = 0;

    // Extract all values from the heap and aggregate them over
    // the function f
    while (!minHeap.isEmpty()) {
      aggregate = f(aggregate, minHeap.dequeue().element);
    }

    return aggregate;
  }
```

Python

```python
import heapq
from typing import List

class Solution:
    def kLargest(self, arr: List[int], k: int) -> int:

        # Create a min heap to store the k largest elements
        minHeap: List[int] = []

        # Add all items to minHeap
        for num in arr:
            heapq.heappush(minHeap, num)
            # Pop an item from the top if the size > k
            if len(minHeap) > k:
                heapq.heappop(minHeap)

        # Initialize an aggregate variable to a default value
        aggregate: int = 0

        # Extract all values from the heap and aggregate them over
        # the function f
        while minHeap:
            aggregate = f(aggregate, heapq.heappop(minHeap))

        return aggregate
```

## Complexity Analysis

It is quite straightforward to determine the time and space complexity of the top `k` technique. We iterate through all **N** items in the array and insert each element into the heap. Since the size of the heap is limited to `k`, each insertion (and possible removal when the size exceeds `k`) takes **O(log(k))** time. Therefore, processing all **N** elements requires **O(Nlog(k))** time.

After processing the array, we extract the `k` elements from the heap and aggregate them using the function `f`. Extracting each element takes **O(log (k))** time, so this step takes **O(klog(k))** time. If the function `f` is a constant time **O(1)** function, these steps take a total of **O(Nlog(k) + klog(k))** which simplifies to **O(Nlog(k))** since `k <= N`.

Since we create a heap and limit its size to **k** the space complexity is **O(k)** in any case.

> **Best Case:**
>
> -   Space Complexity - **O(Nlog(k))**
> -   Time Complexity - **O(k)**
>
> **Worst Case:**
>
> -   Space Complexity - **O(Nlog(k))**
> -   Time Complexity - **O(k)**

***

# Identifying the top k elements pattern

Many problems where we need to find and process the top `k` items in a fixed-sized dataset or a stream can be solved using the top k technique. These are generally **medium** or **hard**problems where we are given a dataset and a function, `f` and we need to find the aggregated the value of the function `f` over the top `k` items in the dataset. While there may be other ways to solve such problems, the technique using a k-sized heap is generally the most efficient.

If the problem statement or its solution follows the generic template below, it can be solved by applying the k-largest-items finding technique.

**Template:**

Find the aggregated value of a function `f` over the top `k` items in a dataset.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the top k technique.

> **Problem statement:** Given an array of integers and an integer k, find the average of the k largest items in the array.

// Diagram: Find the average of the k largest items in the array

## The top k technique

The problem description fits the generic template for the top k elements pattern we learned earlier.

**Template:**

Find the aggregated value of a function `f` (average) over the top (largest) `k` items in a dataset (array).

We create a min-heap `minHeap` to use it as a sliding window in the array to find the `k` largest items. We then iterate in the array from start to, and in each iteration, add the current item to `minHeap`. If the size of `minHeap` exceeds `k`, we remove the item at the top. This way, at the end of all iterations `minHeap` will have the `k` largest items from the array.

// Diagram: Find the average of the k largest items in the array

We then create a variable `sum` and initialize it with 0 to compute the sum of the `k` largest values. Next, we extract all items from the heap until it is empty and add them to `sum`. Finally, we compute and return the average by dividing `sum` by `k`.

// Diagram: Find the average of all items in the minHeap

The implementation of the top k technique to solve the problem is given below.

The top k technique can solve this problem in **O(Nlog(k))** time by using a fixed-sized min-heap.

## Example problems

Most problems that fall under this category are **easy** or**medium**problems; a list of a few is given below.

> -   **[Kth largest element](https://www.codeintuition.io/courses/heap/D9-vFkQiq9Kv9iI4fzYVq)**
> -   **[Kth smallest element](https://www.codeintuition.io/courses/heap/oESYIwsluhO_Xtx-yYjNE)**
> -   **[K range sum](https://www.codeintuition.io/courses/heap/6DAvVPmH4tS6OJr97YEd-)**
> -   **[K sorted array sorting](https://www.codeintuition.io/courses/heap/I8ynVbs5r819jYdI6o11v)**

***

# Kth largest element

## Problem Statement

Given an array **arr** and a positive integer **k**, write a function to find and return the kth largest element in this array.

You must use a **heap** to solve this problem.

### Example 1

> -   **Input:** arr = \[5, 4, 2, 8\], k = 2
> -   **Output:** 5
> -   **Explanation:** 5 is the 2nd largest element in the array.

### Example 2

> -   **Input:** arr = \[1, 2, 3, 4, 5\], k = 5
> -   **Output:** 1
> -   **Explanation:** 1 is the 5th largest element in the array.

### Example 3

> -   **Input:** arr = \[7, 5, 9\], k = 3
> -   **Output:** 5
> -   **Explanation:** 5 is the 3rd largest element in the array.

## Solution

```cpp
#include <queue>

using namespace std;

class Solution {
public:
    int kthLargestElement(vector<int> &arr, int k) {

        // Create a min heap to store the k largest elements
        priority_queue<int, vector<int>, greater<int>> minHeap;

        // Populate the min heap with the first k elements
        for (int i = 0; i < k; i++) {
            minHeap.push(arr[i]);
        }

        // Compare the remaining elements with the top of the min heap
        for (int i = k; i < arr.size(); i++) {

            // Add the current element to the min heap
            minHeap.push(arr[i]);

            // If the heap size exceeds k, remove the smallest element
            if (minHeap.size() > k) {
                minHeap.pop();
            }
        }

        // The top of the min heap will be the kth largest element
        return minHeap.top();
    }
};
```

***

# Kth smallest element

## Problem Statement

Given an array **arr** and a positive integer **k**, write a function to find and return the kth smallest element in this array.

You must use a **heap** to solve this problem.

### Example 1

> -   **Input:** arr = \[5, 4, 2, 8\], k = 2
> -   **Output:** 4
> -   **Explanation:** 4 is the 2nd smallest element in the array.

### Example 2

> -   **Input:** arr = \[1, 2, 3, 4, 5\], k = 5
> -   **Output:** 5
> -   **Explanation:** 5 is the 5th smallest element in the array.

### Example 3

> -   **Input:** arr = \[7, 5, 9\], k = 3
> -   **Output:** 9
> -   **Explanation:** 9 is the 3rd smallest element in the array.

## Solution

```cpp
#include <queue>

using namespace std;

class Solution {
public:
    int kthSmallestElement(vector<int> &arr, int k) {

        // Create a max heap to store the k smallest elements
        priority_queue<int> maxHeap;

        // Populate the max heap with the first k elements
        for (int i = 0; i < k; ++i) {
            maxHeap.push(arr[i]);
        }

        // Compare the remaining elements with the top of the max heap
        for (int i = k; i < arr.size(); i++) {

            // Add the current element to the max heap
            maxHeap.push(arr[i]);

            // If the heap size exceeds k, remove the largest element
            if (maxHeap.size() > k) {
                maxHeap.pop();
            }
        }

        // The top of the max heap will be the kth smallest element
        return maxHeap.top();
    }
};
```

***

# K range sum

## Problem Statement

Given an array **arr** and two positive integers **k1** and **k2**, write a function to find and return the sum of all elements that lie within the inclusive range between the k1-th largest element and the k2-th smallest element in the array.

### Example 1

> -   **Input:** arr = \[4, 2, 5, 1, 3, 6\], k1 = 4, k2 = 5
> -   **Output:** 12
> -   **Explanation:** The 4th largest element in the array is 3, and the 5th smallest element in the array is 5. The sum of all values within this range is 12.

### Example 2

> -   **Input:** arr = \[1, 2, 6, 4, 5\], k1 = 3, k2 = 4
> -   **Output:** 9
> -   **Explanation:** The 3rd largest element in the array is 4, and the 4th smallest element in the array is 5. The sum of all values within this range is 9.

### Example 3

> -   **Input:** arr = \[1, 2, 3, 4, 5\], k1 = 1, k2 = 1
> -   **Output:** 15
> -   **Explanation:** The largest element in the array is 5, and the smallest element in the array is 1. The sum of all values within this range is 15.

## Solution

```cpp
#include <queue>

using namespace std;

class Solution {
public:
    int kthLargestElement(vector<int> &arr, int k) {

        // Create a min heap to store the k largest elements
        priority_queue<int, vector<int>, greater<int>> minHeap;

        // Populate the min heap with the first k elements
        for (int i = 0; i < k; i++) {
            minHeap.push(arr[i]);
        }

        // Compare the remaining elements with the top of the min heap
        for (int i = k; i < arr.size(); i++) {

            // Add the current element to the min heap
            minHeap.push(arr[i]);

            // If the heap size exceeds k, remove the smallest element
            if (minHeap.size() > k) {
                minHeap.pop();
            }
        }

        // The top of the min heap will be the kth largest element
        return minHeap.top();
    }

    int kthSmallestElement(vector<int> &arr, int k) {

        // Create a max heap to store the k smallest elements
        priority_queue<int> maxHeap;

        // Populate the max heap with the first k elements
        for (int i = 0; i < k; ++i) {
            maxHeap.push(arr[i]);
        }

        // Compare the remaining elements with the top of the max heap
        for (int i = k; i < arr.size(); i++) {

            // Add the current element to the max heap
            maxHeap.push(arr[i]);

            // If the heap size exceeds k, remove the largest element
            if (maxHeap.size() > k) {
                maxHeap.pop();
            }
        }

        // The top of the max heap will be the kth smallest element
        return maxHeap.top();
    }

    int kRangeSum(vector<int> &arr, int k1, int k2) {

        // Edge case: if the array is empty or k1 is greater than k2
        if (arr.empty() || k1 > arr.size() || k2 > arr.size()) {
            return 0;
        }

        // Find the k1-th largest element
        int k1thLargest = kthLargestElement(arr, k1);

        // Find the k2-th smallest element
        int k2thSmallest = kthSmallestElement(arr, k2);

        // Variable to store the sum of elements between the
        // two bounds
        int sum = 0;

        // Iterate through the array to calculate the sum of elements
        for (int num : arr) {

            // Sum elements that are strictly between the two bounds
            if (num >= min(k1thLargest, k2thSmallest) &&
                num <= max(k1thLargest, k2thSmallest)) {
                sum += num;
            }
        }

        // Return the sum of elements between the k1-th and k2-th
        // smallest elements
        return sum;
    }
};
```

***

# K range sum

***

# K sorted array sorting

## Problem Statement

Given an array **arr** and a non-negative integer **k**. In this array, each element is almost K positions away from its target position (when sorted). Write a function that sorts this array in place.

You must do this in a time complexity of `O(N*logK)` or better.

### Example 1

> -   **Input:** arr = \[6, 5, 3, 2, 8, 10, 9\], k = 3
> -   **Output:** \[2, 3, 5, 6, 8, 9, 10\]
> -   **Explanation:** Above is the sorted array.

### Example 2

> -   **Input:** arr = \[10, 9, 8, 7, 4, 70, 60, 50\], k = 4
> -   **Output:** \[4, 7, 8, 9, 10, 50, 60, 70\]
> -   **Explanation:** Above is the sorted array.

### Example 3

> -   **Input:** arr = \[1, 2, 3\], k = 0
> -   **Output:** \[1, 2, 3\]
> -   **Explanation:** The array is already sorted.

## Solution

```cpp
#include <queue>

using namespace std;

class Solution {
public:
    void kSortedArraySorting(vector<int> &arr, int k) {
        int n = arr.size();

        // Create a min heap
        priority_queue<int, vector<int>, greater<int>> minHeap;

        // Build a min heap of size k+1 with elements from the first
        // k+1 elements of the array
        for (int i = 0; i <= k; i++) {
            minHeap.push(arr[i]);
        }

        // Process the remaining elements of the array
        for (int i = k + 1; i < n; i++) {

            // Replace the current element with the minimum element from
            // the min heap
            arr[i - k - 1] = minHeap.top();

            // Remove the minimum element from the min heap
            minHeap.pop();

            // Push the current element to the min heap
            minHeap.push(arr[i]);
        }

        // Replace the remaining elements with the minimum elements from
        // the min heap
        int idx = n - k - 1;
        while (!minHeap.empty()) {
            arr[idx++] = minHeap.top();
            minHeap.pop();
        }
    }
};
```
