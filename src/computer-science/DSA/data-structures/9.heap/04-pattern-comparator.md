# Pattern: Comparator

## Table of Contents

1. [Understanding comparators](#understanding-comparators)
2. [Understanding the comparator pattern](#understanding-the-comparator-pattern)
3. [Identifying the comparator pattern](#identifying-the-comparator-pattern)
4. [K most frequent elements](#k-most-frequent-elements)
5. [K smallest sum pairs](#k-smallest-sum-pairs)
6. [K closest values](#k-closest-values)
7. [K arrays smallest range](#k-arrays-smallest-range)
8. [K-way list merge](#k-way-list-merge)

***

# Understanding comparators

A heap data structure is a binary tree that follows the heap property such that the parent node is either greater (max-heap) or smaller (min heap) than its children. Instances of primitive data types like integers, characters, etc, can be compared to each other using the relational operators `<` and `>` to establish the greater and smaller relationships.

However, some problems require us to store more complex data structures like arrays, lists, maps and class objects in a heap. To store anything other than the primitive data types in a heap, we need to define a comparison rule that defines ordering between two items using a **comparator**.

// Diagram: A comparator is used to compare user-defined types.

## Working of a comparator

A comparator is a custom function or an object that defines the ordering of items, particularly when there is no natural or default order or we want to override the ordering. In priority queues implemented as heaps, a comparator determines the item with the higher priority between two items.

To solve any problem that involves storing user-defined datatypes into a heap, we need to pass a comparator to order items instead of relying on `<` and `>` operators. Whenever two nodes in the heap need to be compared, they are passed as arguments to the comparator, which defines the ordering between them.

Consider an example where we have an array of instances of the class `Entry` with values `e1, e2 ... en` such that `ei < ei+1` and we need to store them in a **max-heap**. We can create a max-heap with a comparator that defines ordering between these instances and ensures all nodes in the max-heap are greater than their child nodes.

// Diagram: A comparator orders user defined types in a heap

## Implementation

Most library implementations of a priority queue (heap) have ways to pass a comparator as an argument when instantiating the heap. Some programming languages also provide ways to override the behaviour of the `<` and `>` operators by defining a special member function in the user-defined class.

Given below are different ways to use a comparator to store instances of a class `Entry` in a priority queue in different languages.

// Diagram: Loading code editor

## Example

Let's consider an example where the class `Entry` has two data members `x` and `y`.

// Diagram: A user-defined type Entry has two data members x and y.

An instance will be considered greater than the other if the value of the data member `x` in it is greater than the value of `x` in the other instance. If both instances have the same value of `x` the one with greater value of `y` will be considered greater. If both `x` and `y` in the instances are equal, the instances will be considered equal.

// Diagram: The comparator compares the data member x before comparing the data member y.

Now, let's look at different comparator implementations to use a priority queue as either a min-heap or a max-heap for the class `Entry` defined above.

### min-heap

Given below is the comparator implementation for creating min-priority queue that behaves as a min-heap, i.e. it keeps the **smallest** item at the top. 

// Diagram: Loading code editor

### max-heap

Given below is the comparator implementation for creating max-priority queue that behaves as a max-heap, i.e. it keeps the **largest** item at the top. 

// Diagram: Loading code editor

***

# Understanding the comparator pattern

A heap data structure can store primitive data types in their natural order defined by the `<` and `>` operators. However, there are some problems that require ordering user-defined datatypes. In most cases, we first need to define the new datatype and then define a comparator to be able to store this datatype in a heap.

// Diagram: The comparator pattern is a classification of problems that can be solved using a heap and a custom comparator

In this lesson, we will learn more about using the custom comparator technique to solve problems and how to identify a problem as a comparator pattern problem.

## The custom compare technique

Consider we are given a set of values in an array, an integer `k` , a user-defined type, a transformation function `t` and a function `f`. The transformation function `t` that transforms the values in the original array to instances of the user-defined type. The goal is to find the aggregate value of `f` over the **top**`k` Items from the transformed array.

For this example, consider the generic array of values given below.

// Diagram: A generic array of values.

For this example, we will consider a user-defined type `Entry` that has two data members `x` and `y`.  An instance of `Entry` is considered greater than the other if the value of `x` in it is greater than the other. If the value of `x` is the same in both, then the one with the greater value of `y` is considered greater.

// Diagram: A user-defined type Entry.

To solve the problem, the first step is to transform the input array into an array of instances of `Entry` using the function `t`. The transformation function is generally defined by the problem.

For this example, consider the transformation function below that converts the array into an array of instances of `Entry` where we have generic values `xi` and `yi` of `x` and `y` such that `xi < xi+1` and `yi < yi+1` for all `1 < i < N`.

// Diagram: Transform the array of values into an array of instances of user defined type using the function t.

Once we have the transformed array, the problem is reduced to finding the top `k` items in an array.

We can find the top `k` items using a heap as a sliding window, using a min-heap if top `k` means the `k` largest or a max-heap if the top `k` means the `k` smallest items. However, since we have a user-defined datatype`Entry`, we need to create a comparator defining the ordering logic between items in any of the two cases.

// Diagram: The comparator for the user-defined type Entry.

For this example, we will consider top `k` means the `k` **largest** entries. We can use the same technique for the k smallest entries.

Since the top `k` means the `k` **largest**, we create a comparator to be used with a min-heap, and create a min-heap `minHeap` using it.

We then iterate in the transformed array from start to end, and in each iteration, add the current item to `minHeap`. We also check if the size of `minHeap` becomes greater than `k`. If its size becomes greater than `k`, we remove the item from the top of `minHeap` which will be the smallest (as defined by the comparator) item in the heap. This way, at the end of all iterations, the heap will only have the top k items.

// Diagram: Find the k largest items in the transformed array

Finally, we initialize a variable `aggregate` with a default value, extract all items from the heap and add the contribution of each of them in `aggregate` using the function `f`.

// Diagram: Find the aggregated value of function f over the items in minHeap

## Algorithm

The algorithm given below outlines the generic algorithm to transform the given array into an array of user-defined type and find the aggregated value of a function `f` over the top (**largest**) `k` Items in the transformed array.

> -   **Step 1:** Transform the given array into an array of user defined type using the function `t`
> -   **Step 2:** Create a comparator to stor user define type in a min-heap and initialize `minHeap` using it.
> -   **Step 3:** Iterate in the transformed array and do the following:
>     -   **Step 3.1:** Add the current item to `minHeap`
>     -   **Step 3.2:** If the size of `minHeap` becomes greater than `k`, remove the item at the top
> -   **Step 4:** Initialize a variable `aggregate` with a default value
> -   **Step 5:** Do the following until `minHeap` is empty:
>     -   **Step 5.1:** Pop the item at the top of `minHeap`
>     -   **Step 5.2:** Add the contribution of the popped item to `aggregate` using function `f`
> -   **Step 6:** Return `aggregate`

## Implementation

Given below is the generic code implementation to transform the given array into an array of user-defined type and find the aggregated value of a function `f` over the top (**largest**) `k` Items in the transformed array. We use a function `t` to transform the original array into an array of instances of Entry. It uses the library implementation of a heap for every language instead of creating one from scratch.

C++

```cpp
#include <queue>

// Diagram: using namespace std;

// User defined type Entry
struct Entry {
  int x;
  int y;
};

// Comparator to use priority queue as min-heap
struct MinComparator {

  // Return true if `a` should be placed BELOW `b` in the heap
  bool operator()(const Entry &a, const Entry &b) {
      if (a.x == b.x) {
        return a.y < b.y;
      }
      return a.x < b.x;
  }
};

class Solution {
public:
    int topKCustomCompare(vector<int> &arr, int k) {

        // Transform the array into an array of Entry objects
        // using the function t
        vector<Entry> entries = t(arr);

        // Create a min heap to store the k largest elements
        priority_queue<Entry, vector<Entry>, MinComparator> minHeap;

        // Add the elements to the min heap
        for (auto &entry : entries) {
          minHeap.push(entry);

          // If the heap size exceeds k, remove the item at the top
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
import java.util.*;

// User defined type Entry
class Entry {
    public:
        int x;
        int y;

        Entry(int x, int y) {
            this.x = x;
            this.y = y;
        }

// Comparator to use priority queue as min-heap
class MinComparator implements Comparator<Entry> {

    // Return true if `a` should be placed BELOW `b` in the heap
    @Override
    public int compare(Entry a, Entry b) {
        if (a.x == b.x) {
            return a.y > b.y;
        }
        return a.x > b.x;
    }

// Diagram: class Solution {

// Diagram: public int topKCustomCompare(List<Integer> arr, int k) {

        // Transform the array into an array of Entry objects
        // using the function t
        List<Entry> entries = t(arr);

        // Create a min heap to store the k largest elements
        PriorityQueue<Entry> minHeap = new PriorityQueue<>(new MinComparator());

        // Add the elements to the min heap
        for (Entry entry : entries) {
            minHeap.offer(entry);

            // If the heap size exceeds k, remove the item at the top
            if (minHeap.size() > k) {
                minHeap.poll();
            }

        // Initialize an aggregate variable to a default value
        int aggregate = 0;

        // Extract all values from the heap and aggregate them over
        // the function f
        while (!minHeap.isEmpty()) {
            aggregate = f(aggregate, minHeap.poll());
        }

        return aggregate;
    }

```

Typescript

```typescript
import { PriorityQueue } from '@datastructures-js';

// User defined type Entry
type Entry = {
  x: number;
  y: number;
};

// Comparator to use priority queue as min-heap
function minComparator(a: Entry, b: Entry): number {
  if (a.x == b.x) {
      if (a.y == b.y) {
        return 0;
      }
      return a.y < b.y ? 1 : -1
    }
    return a.x < b.x ? 1 : -1
}

class Solution {
  topKCustomCompare(arr: number[], k: number): number {
    // Transform the array into an array of Entry objects
    // using the function t
    const entries: Entry[] = t(arr);

    // Create a min heap to store the k largest elements
    const minHeap = new PriorityQueue<Entry>(minComparator);

    // Add the elements to the min heap
    for (const entry of entries) {
      minHeap.enqueue(entry);

      // If the heap size exceeds k, remove the item at the top
      if (minHeap.size() > k) {
        minHeap.dequeue();
      }

    // Initialize an aggregate variable to a default value
    let aggregate = 0;

    // Extract all values from the heap and aggregate them over
    // the function f
    while (!minHeap.isEmpty()) {
      const top = minHeap.dequeue();
      aggregate = f(aggregate, top);
    }
    return aggregate;
  }

```

Javascript

```javascript
import { PriorityQueue } from '@datastructures-js';

// User defined type Entry
class Entry {
  // Data members here
  x;
  y;
};

// Comparator to use priority queue as min-heap
function minComparator(a, b) {
  if (a.x == b.x) {
      if (a.y == b.y) {
        return 0;
      }
      return a.y < b.y ? 1 : -1
    }
    return a.x < b.x ? 1 : -1
}

class Solution {
  topKCustomCompare(arr, k) {
    // Transform the array into an array of Entry objects
    // using the function t
    const entries = t(arr);

    // Create a min heap to store the k largest elements
    const minHeap = new PriorityQueue(minComparator);

    // Add the elements to the min heap
    for (const entry of entries) {
      minHeap.enqueue(entry);

      // If the heap size exceeds k, remove the item at the top
      if (minHeap.size() > k) {
        minHeap.dequeue();
      }

    // Initialize an aggregate variable to a default value
    let aggregate = 0;

    // Extract all values from the heap and aggregate them over
    // the function f
    while (!minHeap.isEmpty()) {
      const top = minHeap.dequeue();
      aggregate = f(aggregate, top);
    }
    return aggregate;
  }

```

Python

```python
import heapq
from typing import List, Tuple

# User defined type Entry
class Entry:
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y
    def __gt__(self, other):
        if self.x == other.x:
            return self.y > other.y
        return self.x > other.x

class Solution:
    def topKCustomCompare(self, arr: List[int], k: int) -> int:

        # Transform the array into an array of Entry objects
        # using the function t
        entries: List[Entry] = t(arr)

        # Create a min heap to store the k largest elements
        minHeap: List[Entry] = []

        # Add the elements to the min heap
        for entry in entries:
            heapq.heappush(minHeap, entry)

            # If the heap size exceeds k, remove the item at the top
            if len(minHeap) > k:
                heapq.heappop(minHeap)

        # Initialize an aggregate variable to a default value
        aggregate = 0

        # Extract all values from the heap and aggregate them over
        # the function f
        while minHeap:
            entry = heapq.heappop(minHeap)
            aggregate = f(aggregate, entry)

        return aggregate
```

## Complexity Analysis

It is quite easy to figure out the time and space complexity of the custom compare technique. We create a transformed array from the input array and add all entries into a heap using the comparator, which results in **M** insertions, where **M** is the size of the transformed array. Since we fix the size of the heap to **k**, we performed **M-k** remove operations to remove the item at the top.

Assuming the comparator takes constant **O(1)** time to compare two items, and the transformation function takes **O(M)** time to transform the entire input array. The time complexity in any case is **O(M) + O(Mlog(k)) + O((M-k)log(k))** ~ **O(Mlog(k))**.

In the worst case, we may have to store the transformed array, which may be of size M, leading to **O(M)** extra space. We also create a heap data structure of a fixed size **k**,in any case resulting in **O(k)** extra space. And so the worst-case space complexity will be **O(M+k)**. In the best case, we may be able to iterate in the transformed array without storing by simply transforming items on demand as we iterate the original array. And so the best case complexity will be **O(k)**.

> **Best Case:** The Input array is transformed on demand
>
> -   Space Complexity - **O(k)**
> -   Time Complexity - **O(Mlog(k))**
>
> **Worst Case:** Transformed array stored in memory
>
> -   Space Complexity - **O(M+k)**
> -   Time Complexity - **O(Mlog(k))**

***

# Identifying the comparator pattern

The custom compare technique can be used to solve some specific types of problems. There are generally medium or hard problems where we need to find the aggregated value of a function over the top k items in a dataset, where each item is of a user-defined type. Most problems solved using this technique require transforming a dataset where items are of primitive types to a dataset of items of a user-defined type. The transformation logic is often defined in the problem or is part of the solution. We also create a comparator to order data items in the heap that is used to find the top k items. 

If the problem statement or its solution follows the generic template below, it can be solved by applying the k-largest-items finding technique.

**Template:**

Transform the given dataset into one with user defined types and find the aggregated value of a function `f` over the top `k` items in the transformed dataset.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the custom compare technique.

> **Problem statement:** Given an array of integers and an integer `k`, find the `k` most frequent intergers.

// Diagram: Find the k most frequent values in the array

## The custom compare technique

To find the `k` most frequent items, we need to transform the given array into one which has all unique items from the input array, together with their frequencies. The problem description fits the generic template for the comparator pattern we learned earlier.

**Template:**

Transform the given dataset into one with user defined types (pair of item and frequency) and find the aggregated value of a function `f` (list) over the top (largest frequency) `k` items in the transformed dataset.

We create a user-defined type `Entry` that has two data members, `value` and `frequency`. The member `value` will store the integer value of an item, and `frequency` will store its frequency in the array.

// Diagram: A user-defined type Entry.

We create a map `frequency` to store the frequency for every item in the array and iterate the array from start to end. In each iteration, we increment the count of the current item in the `frequency` map. At the end of all iterations,`frequency` map has the frequency of all items in the array.

// Diagram: Find the frequency of all unique items in the array

To find the `k` most items in the array we need to convert items in the `frequency` map to instances of `Entry` and add these instances into a min-heap. An instance is considered greater than the other if its data member `frequency` is greater than the other's. And so we create a comparator to be used with a **min-heap** (as top `k` means `k` largest) to order instances of `Entry` by looking at the data member `frequency`. We then create a min-heap `minHeap` using the comparator.

// Diagram: A comparator to compare instances of Entry by looking at their frequency values.

We then iterate in `frequency` map and in each iteration, create an instance of `Entry` using the current key (value from original array) and value (frequency), add it to `minHeap` and remove the top of `minHeap` if its size exceeds `k`. This way `minHeap` serves as a `k` sized sliding window as we iterate through the `frequency` map, always holding the `k` most frequent items seen so far. At the end of all iterations, `minHeap` will have entries of the `k` most frequent items in the original array.

The example below shows the heap nodes with a pair of values where the first value is the frequency of an item and the second value is the value of item

// Diagram: Find the k most frequent items using a min heap

We create an array `result` and repeatedly pop items from the top of `minHeap` until it is empty, and add the `value` data member from every popped item to `result`. At the end of all iterations, `result` will have the `k` most frequent items from the original array.

// Diagram: Add values of all items in the heap to a result array

The implementation of the custom compare technique to solve the problem is given below.

C++

```cpp
#include <queue>
#include <unordered_map>

// Diagram: using namespace std;

// Define a struct to store the element and its frequency
struct Entry {
    int value;
    int frequency;
};

// Comparator for the min heap
struct CompareMinHeap {
    bool operator()(const Entry &a, const Entry &b) {

        // min heap based on frequency
        return a.frequency > b.frequency;
    }
};

class Solution {
public:
    vector<int> kMostFrequentElements(vector<int> &arr, int k) {

        // Count the frequency of each element in arr
        unordered_map<int, int> frequency;
        for (int num : arr) {
            frequency[num]++;
        }

        // Create a min heap with custom struct and comparator
        priority_queue<Entry, vector<Entry>, CompareMinHeap> minHeap;

        // Add the elements to the min heap
        for (auto &entry : frequency) {
            minHeap.push({entry.first, entry.second});

            // If the heap size exceeds k, remove the element with the
            // lowest frequency
            if (minHeap.size() > k) {
                minHeap.pop();
            }

        // Extract the elements from the heap and return as a vector
        vector<int> result;
        while (!minHeap.empty()) {
            result.push_back(minHeap.top().value);
            minHeap.pop();
        }

        // Return the result
        return result;
    }
};
```

Java

```java
import java.util.*;

// Define a class to store the element and its frequency
class Entry {

    int value;
    int frequency;

    Entry(int value, int frequency) {
        this.value = value;
        this.frequency = frequency;
    }

// Comparator for the min heap
class CompareMinHeap implements Comparator<Entry> {
    public int compare(Entry a, Entry b) {

        // min heap based on frequency
        return a.frequency - b.frequency;
    }

class Solution {
    public List<Integer> kMostFrequentElements(int[] arr, int k) {

        // Count the frequency of each element in arr
        Map<Integer, Integer> frequency = new HashMap<>();
        for (int num : arr) {
            frequency.put(num, frequency.getOrDefault(num, 0) + 1);
        }

        // Create a min heap with custom comparator
        PriorityQueue<Entry> minHeap = new PriorityQueue<>(
            new CompareMinHeap()
        );

        // Add elements to the min heap, maintaining only the top k
        frequency.forEach((key, value) -> {
            minHeap.add(new Entry(key, value));

            // If the heap size exceeds k, remove the element with the
            // lowest frequency
            if (minHeap.size() > k) {
                minHeap.poll();
            }
        });

        // Extract the elements from the heap and return as a list
        List<Integer> result = new ArrayList<>();
        while (!minHeap.isEmpty()) {
            result.add(minHeap.poll().value);
        }

        // Return the result
        return result;
    }
```

Typescript

```typescript
import { PriorityQueue } from "datastructures-js";

// Define a class to store the element and its frequency
class Entry {
    value: number;
    frequency: number;

    constructor(value: number, frequency: number) {
        this.value = value;
        this.frequency = frequency;
    }

// Diagram: function compareMinHeap(a: Entry, b: Entry): number {

    // In min heap, the smallest number should come first
    return a.frequency - b.frequency;
}

export class Solution {
    kMostFrequentElements(arr: number[], k: number): number[] {

        // Count the frequency of each element in arr
        const frequency = new Map<number, number>();
        for (const num of arr) {
            frequency.set(num, (frequency.get(num) || 0) + 1);
        }

        // Create a min heap with custom comparator
        const minHeap = new PriorityQueue<Entry>(compareMinHeap);

        // Add the elements to the min heap
        for (const [value, freq] of frequency.entries()) {
            minHeap.enqueue(new Entry(value, freq));

            // If the heap size exceeds k, remove the element with the
            // lowest frequency
            if (minHeap.size() > k) {
                minHeap.dequeue();
            }

        // Extract the elements from the heap and return as an array
        const result: number[] = [];
        while (!minHeap.isEmpty()) {
            result.push(minHeap.dequeue().value);
        }

        // Return the result
        return result;
    }
```

Javascript

```javascript
import { PriorityQueue } from "datastructures-js";

// Define a class to store the element and its frequency
class Entry {
    constructor(value, frequency) {
        this.value = value;
        this.frequency = frequency;
    }

// Diagram: function compareMinHeap(a, b) {

    // In min heap, the smallest number should come first
    return a.frequency - b.frequency;
}

export class Solution {
    kMostFrequentElements(arr, k) {

        // Count the frequency of each element in arr
        const frequency = new Map();
        for (const num of arr) {
            frequency.set(num, (frequency.get(num) || 0) + 1);
        }

        // Create a min heap with custom comparator
        const minHeap = new PriorityQueue(compareMinHeap);

        // Add the elements to the min heap
        for (const [value, freq] of frequency.entries()) {
            minHeap.enqueue(new Entry(value, freq));

            // If the heap size exceeds k, remove the element with the
            // lowest frequency
            if (minHeap.size() > k) {
                minHeap.dequeue();
            }

        // Extract the elements from the heap and return as an array
        const result = [];
        while (!minHeap.isEmpty()) {
            result.push(minHeap.dequeue().value);
        }

        // Return the result
        return result;
    }
```

Python

```python
from typing import List
import heapq
from collections import Counter

class Entry:
    def __init__(self, value: int, frequency: int):
        self.value = value
        self.frequency = frequency

    def __lt__(self, other):

        # min heap based on frequency
        return self.frequency < other.frequency

class Solution:
    def k_most_frequent_elements(
        self, arr: List[int], k: int
    ) -> List[int]:

        # Count the frequency of each element in arr
        frequency = Counter(arr)

        # Create a min heap with custom objects
        min_heap: List[Entry] = []

        # Add the elements to the min heap
        for value, freq in frequency.items():
            heapq.heappush(min_heap, Entry(value, freq))

            # If the heap size exceeds k, remove the element with the
            # lowest frequency
            if len(min_heap) > k:
                heapq.heappop(min_heap)

        # Extract the elements from the heap and return as a list
        result: List[int] = []
        while min_heap:
            result.append(heapq.heappop(min_heap).value)

        # Return the result
        return result
```

The custome compare technique can solve this problem in **O(Nlog(k))** time by using a fixed-sized min-heap.

## Example problems

Most problems that fall under this category are **medium** or **hard**problems; a list of a few is given below.

> -   **[K most frequent elements](https://www.codeintuition.io/courses/heap/cD-XgXSyNYSmN2IJjD6Pl)**
> -   **[K smallest sum pairs](https://www.codeintuition.io/courses/heap/xfNz2iXJYJN7WQAcDMvTP)**
> -   **[K closest values](https://www.codeintuition.io/courses/heap/Ka69_LQ5Or9B5pjg2uLzz)**
> -   **[K arrays smallest range](https://www.codeintuition.io/courses/heap/nU135-Grjo9K9HC2MMuy1)**
> -   **[K-way list merge](https://www.codeintuition.io/courses/heap/H0kGqCN1NkxZm0WG5bw3T)**

***

# K most frequent elements

## Problem Statement

Given an array **arr** and a positive integer **k**, write a function to find and return the k most frequent elements in this array. You can return the answer in **any order**.

You must use a **heap** to solve this problem.

### Example 1

> -   **Input:** arr = \[1, 2, 2, 3, 3, 3\], k = 2
> -   **Output:** \[3, 2\]
> -   **Explanation:** 3 and 2 are the most frequent and the second most frequent elements respectively.

### Example 2

> -   **Input:** arr = \[1, 5, 6, 6\], k = 1
> -   **Output:** \[6\]
> -   **Explanation:** 6 is the most frequent element.

### Example 3

> -   **Input:** arr = \[1\], k = 1
> -   **Output:** \[1\]
> -   **Explanation:** 1 is the most frequent element.

## Solution

```cpp
#include <queue>
#include <unordered_map>

using namespace std;

// Define a struct to store the element and its frequency
struct Entry {
    int value;
    int frequency;
};

// Comparator for the min heap
struct CompareMinHeap {
    bool operator()(const Entry &a, const Entry &b) {

        // min heap based on frequency
        return a.frequency > b.frequency;
    }
};

class Solution {
public:
    vector<int> kMostFrequentElements(vector<int> &arr, int k) {

        // Count the frequency of each element in arr
        unordered_map<int, int> frequency;
        for (int num : arr) {
            frequency[num]++;
        }

        // Create a min heap with custom struct and comparator
        priority_queue<Entry, vector<Entry>, CompareMinHeap> minHeap;

        // Add the elements to the min heap
        for (auto &entry : frequency) {
            minHeap.push({entry.first, entry.second});

            // If the heap size exceeds k, remove the element with the
            // lowest frequency
            if (minHeap.size() > k) {
                minHeap.pop();
            }
        }

        // Extract the elements from the heap and return as a vector
        vector<int> result;
        while (!minHeap.empty()) {
            result.push_back(minHeap.top().value);
            minHeap.pop();
        }

        // Return the result
        return result;
    }
};
```

***

# K smallest sum pairs

## Problem Statement

Given two arrays, **arr1** and **arr2**,that are sorted in ascending orderand a non-negative integer **k**, write a function that finds and returns k pairs from these arrays with the smallest sum. A pair must contain one element from the first array and another element from the second array.

### Example 1

> -   **Input:** arr1 = \[1, 7, 1\], arr2 = \[2, 4, 6\], k = 3
> -   **Output:** \[\[1, 2\], \[1, 4\], \[1, 6\]\]
> -   **Explanation:** The first three pairs i.e. \[1, 2\], \[1, 4\], and \[1, 6\] are selected from the full sequence of possible pairs: \[1, 2\], \[1, 4\], \[1, 6\], \[7, 2\], \[7, 4\], \[7, 6\], \[1, 2\], \[1, 4\], and \[1, 6\], as they have the smallest sums.

### Example 2

> -   **Input:** arr1 = \[1, 1, 2\], arr2 = \[1, 2, 3\], k = 2
> -   **Output:** \[\[1, 1\], \[1, 1\]\]
> -   **Explanation:** The first and fourth pairs i.e. \[1, 1\] and \[1, 1\] are selected from the full sequence of possible pairs: \[1, 1\], \[1, 2\], \[1, 3\], \[1, 1\], \[1, 2\], \[1, 3\], \[2, 1\], \[2, 2\], \[2, 3\], as they have the smallest sums.

### Example 3

> -   **Input:** arr1 = \[1, 3, 4\], arr2 = \[4\], k = 2
> -   **Output:** \[\[1, 4\], \[3, 4\]\]
> -   **Explanation:** The first two pairs are returned from the sequence: \[1, 4\], \[3, 4\], \[4, 4\] as they have the smallest sums.

## Solution

```cpp
#include <functional>
#include <queue>
#include <set>

using namespace std;

// Define a struct to store the sum and the indices of the pair
struct PairWithSum {
    int sum;
    int index1;
    int index2;
};

struct CompareMinHeap {
    bool operator()(const PairWithSum &a, const PairWithSum &b) const {

        // For the priority queue to be a min-heap
        return a.sum > b.sum;
    }
};

class Solution {
public:
    vector<vector<int>> kSmallestSumPairs(
        vector<int> &arr1,
        vector<int> &arr2,
        int k
    ) {
        int n = arr1.size();
        int m = arr2.size();

        // Result vector to store the k smallest pairs
        vector<vector<int>> result;

        // Set to keep track of visited pairs
        set<pair<int, int>> visited;

        // Create a min heap using the Compare struct to order the pairs
        // by their sum
        priority_queue<PairWithSum, vector<PairWithSum>, CompareMinHeap>
            minHeap;

        // Push the first pair with its sum into the min heap
        minHeap.push({arr1[0] + arr2[0], 0, 0});

        // Mark the first pair as visited
        visited.insert({0, 0});

        // Process the pairs until k pairs have been found or the min
        // heap is empty
        while (k-- && !minHeap.empty()) {

            // Get the top pair from the min heap
            PairWithSum top = minHeap.top();

            // Remove the top pair from the min heap
            minHeap.pop();

            // Retrieve the indices of the pair
            int i = top.index1;
            int j = top.index2;

            // Add the pair to the answer vector
            result.push_back({arr1[i], arr2[j]});

            // Check the adjacent pairs and add them to the min heap if
            // not visited
            if (i + 1 < n && visited.find({i + 1, j}) == visited.end()) {
                minHeap.push({arr1[i + 1] + arr2[j], i + 1, j});
                visited.insert({i + 1, j});
            }

            if (j + 1 < m && visited.find({i, j + 1}) == visited.end()) {
                minHeap.push({arr1[i] + arr2[j + 1], i, j + 1});
                visited.insert({i, j + 1});
            }
        }

        // Return the k smallest pairs
        return result;
    }
};
```

***

# K closest values

## Problem Statement

Given the **root** of a binary search tree, a **target** value, and a non-negative integer **k**, write a function to find and return k values in the BST that are closest to the target. You can return the answer in **any order**.

### Example 1

> -   **Input:** root = \[4, 2, 6, 1, null, null, 7\], target = 4.63, k = 3
> -   **Output:** \[4, 6, 7\]
> -   **Explanation:** The closest values in the tree to 4.63 are 4, 6, and 7, respectively.

### Example 2

> -   **Input:** root = \[2, 1, 4, null, null, 3, 7\], target = 7.49, k = 2
> -   **Output:** \[4, 7\]
> -   **Explanation:** The closest values in the tree to 7.49 are 4 and 7.

## Solution

```cpp
#include <algorithm>
#include <cmath>
#include <queue>

/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int val) : val(val), left(nullptr), right(nullptr) {}
 * };
 */

using namespace std;

// Struct to store the value and its distance from the target
struct ValueDiff {
    double diff;
    int value;
};

// Comparator to create a max heap based on the difference
struct CompareMaxHeap {
    bool operator()(const ValueDiff &a, const ValueDiff &b) {

        // Max heap: larger diff has higher priority
        return a.diff < b.diff;
    }
};

class Solution {
public:

    // Max heap to store the closest k values
    priority_queue<ValueDiff, vector<ValueDiff>, CompareMaxHeap> maxHeap;

    void inorder(TreeNode *root, double target, int k) {
        if (!root) {
            return;
        }

        inorder(root->left, target, k);

        // Compute the absolute difference between node value and target
        double diff = fabs(root->val - target);

        // Push the current value and its difference to the max heap
        maxHeap.push({diff, root->val});

        // Ensure the heap only contains k elements
        if (maxHeap.size() > k) {

            // Remove the farthest element
            maxHeap.pop();
        }

        inorder(root->right, target, k);
    }

    vector<int> kClosestValues(TreeNode *root, double target, int k) {

        vector<int> result;

        // Perform inorder traversal and fill the max heap with the
        // closest k values
        inorder(root, target, k);

        // Extract k closest values from the max heap
        while (!maxHeap.empty()) {
            result.push_back(maxHeap.top().value);
            maxHeap.pop();
        }

        // The result is in reverse order, so reverse it
        reverse(result.begin(), result.end());

        return result;
    }
};
```

***

# K arrays smallest range

## Problem Statement

Given an array of arrays **arr** that contains k sorted arrays, write a function that finds and returns the **smallest** **range** that includes at least one number from each of the k arrays.

// Diagram: We define the range [a, b] is smaller than range [c, d] if b - a < d - c or a < c if b - a == d - c

### Example 1

> -   **Input:** arr = \[\[4, 8\], \[3, 6\], \[4, 5\]\]
> -   **Output:** \[3, 4\]
> -   **Explanation:** \[3, 4\] is the smallest range that contains elements from all the arrays.

### Example 2

> -   **Input:** arr = \[\[1, 2, 5\], \[6, 7, 9\], \[3, 4\]\]
> -   **Output:** \[4, 6\]
> -   **Explanation:** \[4, 6\] is the smallest range that contains elements from all the arrays.

### Example 3

> -   **Input:** arr = \[\[1, 5, 9\], \[3, 7, 12\]\]
> -   **Output:** \[1, 3\]
> -   **Explanation:** \[1, 3\] is the smallest range that contains elements from all the arrays.

## Solution

```cpp
#include <climits>
#include <queue>

using namespace std;

// Define a struct to store the value, list index, and element index
struct Element {
    int value;
    int listIdx;
    int elementIdx;
};

// Define a comparator struct to compare the elements based on their
// value
struct CompareMinHeap {
    bool operator()(const Element &a, const Element &b) const {

        // Min-heap based on the value
        return a.value > b.value;
    }
};

class Solution {
public:
    vector<int> kArraysSmallestRange(vector<vector<int>> &arr) {
        int k = arr.size();

        // Define a min heap to store the elements from each list
        // The key of the heap is the value of the element
        // The value is a pair representing the list index and the
        // element index within the list
        priority_queue<Element, vector<Element>, CompareMinHeap> minHeap;

        // Initialize the maximum value seen so far
        int maxValue = INT_MIN;

        // Initialize the heap with the first element from each list
        for (int i = 0; i < k; i++) {
            if (!arr[i].empty()) {
                minHeap.push({arr[i][0], i, 0});
                maxValue = max(maxValue, arr[i][0]);
            }
        }

        // Initialize variables to track the smallest range
        int rangeStart = -1;
        int rangeEnd = -1;
        int rangeLength = INT_MAX;

        // Process the elements in the min heap until at least one
        // element from each list is included
        while (minHeap.size() == k) {

            // Extract the minimum element from the heap
            Element current = minHeap.top();
            minHeap.pop();

            int value = current.value;
            int listIdx = current.listIdx;
            int idx = current.elementIdx;

            // Update the smallest range if the current range is smaller
            if (maxValue - value < rangeLength) {
                rangeStart = value;
                rangeEnd = maxValue;
                rangeLength = rangeEnd - rangeStart;
            }

            // Move to the next element in the list and update the
            // maximum value seen so far
            if (idx + 1 < arr[listIdx].size()) {
                minHeap.push({arr[listIdx][idx + 1], listIdx, idx + 1});
                maxValue = max(maxValue, arr[listIdx][idx + 1]);
            }
        }

        // Return the smallest range as a vector
        return {rangeStart, rangeEnd};
    }
};
```

***

# K-way list merge

## Problem Statement

You are given an array of singly linked list head nodes called **lists**, the size of this array is k where each index contains a linked list that is sorted in ascending order. Write a function to merge all these k-linked lists into one sorted list and return its head.

### Example 1

> -   **Input:** lists = \[\[1, 4, 5\], \[1, 3, 4\], \[2, 6\]\]
> -   **Output:** \[1, 1, 2, 3, 4, 4, 5, 6\]
> -   **Explanation:** After merging the lists in sorted order, the resulting list will be \[1, 1, 2, 3, 4, 4, 5, 6\].

### Example 2

> -   **Input:** lists = \[\]
> -   **Output:** \[\]
> -   **Explanation:** Since the input list is empty, the output will also be an empty list.

## Solution

```cpp
#include <queue>

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

struct CompareMinHeap {
    bool operator()(ListNode *nodeA, ListNode *nodeB) {

        // Custom comparison function used by the priority_queue.
        // It compares the values of the nodes and returns true if
        // nodeA's value is greater than nodeB's value.
        return nodeA->val > nodeB->val;
    }
};

class Solution {
public:
    ListNode *kWayListMerge(vector<ListNode *> &lists) {

        // Create a priority queue with ListNode* as the type and use the
        // CompareNodes struct as the comparison function.
        priority_queue<ListNode *, vector<ListNode *>, CompareMinHeap>
            minHeap;

        // Push all non-null heads of the input lists into the priority
        // queue.
        for (ListNode *head : lists) {
            if (head)
                minHeap.push(head);
        }

        // Create a dummy and tail pointers for building the merged list.
        ListNode *dummy = new ListNode(0);
        ListNode *tail = dummy;

        // Continue until the priority queue is empty.
        while (!minHeap.empty()) {

            // Get the node with the smallest value from the priority
            // queue.
            ListNode *node = minHeap.top();
            minHeap.pop();

            // Add the node to the merged list.
            tail->next = node;
            tail = tail->next;

            // If the current node has a next node, push the next node
            // into the priority queue for further processing.
            if (node->next) {
                minHeap.push(node->next);
            }
        }

        // Return the head of the merged list (excluding the dummy node).
        return dummy->next;
    }
};
```
