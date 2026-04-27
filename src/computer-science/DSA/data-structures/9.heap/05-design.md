# Design

## Table of Contents

1. [Design a max heap](#design-a-max-heap)
2. [Design a min heap](#design-a-min-heap)
3. [Design a median finder](#design-a-median-finder)

***

# Design a max heap

## Problem Statement

Given the skeleton of a **MaxHeap class**, complete this class by implementing all the MaxHeap operations below. 

> -   **MaxHeap()** - Initializes the MaxHeap object.
> -   **insert(int val)** - Inserts the given value into the heap.
> -   **remove(int index)** - Removes the value at the given index from the heap.
> -   **getMax()** - Retrieves the maximum element in the heap.
> -   **extractMax()** - Removes and returns the maximum element from the heap.

// Diagram: You must abide by the following constraints

1\. You must implement this class **without using any in-built heap libraries**. 

> The input should adhere to the following rules:
>
> 1.  The input should contain two arrays of the same size.
> 2.  The first array should contain the list of operations, while the second should contain the corresponding operands for those operations.
> 3.  The first index in the first array should contain **MaxHeap**, and the first index in the second array should contain an empty array. This is used for initialising the MaxHeap.
> 4.  For each index in the first array that contains the **insert** operation, the corresponding index in the second array should contain the value that needs to be inserted.
> 5.  For each index in the first array that contains the **remove** operation, the corresponding index in the second array should contain the index of the value that needs to be removed.
> 6.  For each index in the first array that contains **getMax** or **extractMax** operations, the corresponding index in the second array should contain an empty array.
>
> **Example:**
>
> -   **Input:** \[MaxHeap, insert, insert, remove, getMax, extractMax\] \[\[\], \[5\], \[3\], \[1\], \[\], \[\]\]
>
> -   **Output:** \[null, null, null, null, 5, 5\]
>
> **Explanation:**
>
> **Operation:** MaxHeap maxHeap = new MaxHeap() **Result:** Initializes an empty `MaxHeap` object
>
> **Operation:** maxHeap.insert(5) **Result:** `maxHeap = \[5\]`
>
> **Operation:** maxHeap.insert(3) **Result:** `maxHeap = \[5, 3\]`
>
> **Operation:** maxHeap.remove(1) **Result:** `maxHeap = \[5\]`
>
> **Operation:** maxHeap.getMax() **Result:** `maxHeap = \[5\]`, returns `5`
>
> **Operation:** maxHeap.extractMax() **Result:** `maxHeap = \[\]`, returns `5`

## Solution

```cpp
using namespace std;

class MaxHeap {
public:
    vector<int> heap;

    // Helper function to restore heap property upwards (used in insert)
    void upHeapify(int index) {
        int parent = (index - 1) / 2;
        while (index > 0 && heap[parent] < heap[index]) {
            swap(heap[index], heap[parent]);
            index = parent;
            parent = (index - 1) / 2;
        }
    }

    // Helper function to maintain the max heap property downwards
    void downHeapify(int index) {
        int largest = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        // Find the largest among the node and its left child
        if (left < heap.size() && heap[left] > heap[largest]) {
            largest = left;
        }

        // Find the largest among the node and its right child
        if (right < heap.size() && heap[right] > heap[largest]) {
            largest = right;
        }

        // If the largest is not the current node, swap and continue
        // heapify
        if (largest != index) {
            swap(heap[index], heap[largest]);
            downHeapify(largest);
        }
    }

    void insert(int val) {

        // Insert the new value at the end of the heap
        heap.push_back(val);

        // Get the index of the new value
        int index = heap.size() - 1;

        // Restore the max heap property by comparing with parent nodes
        upHeapify(index);
    }

    void remove(int index) {

        // Replace the value with the largest possible value and heapify
        heap[index] = heap.back();

        // Remove the last node
        heap.pop_back();

        // Restore the max heap property
        downHeapify(index);
    }

    int getMax() {
        if (heap.empty()) {
            return -1;
        }

        // Return the root node
        return heap[0];
    }

    int extractMax() {
        if (heap.empty()) {
            return -1;
        }

        // Extract the root node
        int root = heap[0];

        // Delete the root node
        remove(0);

        // Return the extracted root node
        return root;
    }
};
```

***

# Design a min heap

## Problem Statement

Given the skeleton of a **MinHeap class**, complete this class by implementing all the below MinHeap operations. 

> -   **MinHeap()** - Initializes the MinHeap object.
> -   **insert(int val)** - Inserts the given value into the heap.
> -   **remove(int index)** - Removes the value at the given index from the heap.
> -   **getMin()** - Retrieves the minimum element in the heap.
> -   **extractMin()** - Removes and returns the minimum element from the heap.

// Diagram: You must abide by the following constraints

1\. You must implement this class **without using any in-built heap libraries**. 

> The input should adhere to the following rules:
>
> 1.  The input should contain two arrays of the same size.
> 2.  The first array should contain the list of operations, while the second should contain the corresponding operands for those operations.
> 3.  The first index in the first array should contain **MinHeap**, and the first index in the second array should contain an empty array. This is used for initialising the MinHeap.
> 4.  For each index in the first array that contains the **insert** operation, the corresponding index in the second array should contain the value that needs to be inserted.
> 5.  For each index in the first array that contains the **remove** operation, the corresponding index in the second array should contain the index of the value that needs to be removed.
> 6.  For each index in the first array that contains **getMin** or **extractMin** operations, the corresponding index in the second array should contain an empty array.
>
> **Example:**
>
> -   **Input:** \[MinHeap, insert, insert, remove, getMin, extractMin\] \[\[\], \[5\], \[3\], \[1\], \[\], \[\]\]
>
> -   **Output:** \[null, null, null, null, 3, 3\]
>
> **Explanation:**
>
> **Operation:** MinHeap minHeap = new MinHeap() **Result:** Initializes an empty `MinHeap` object
>
> **Operation:** minHeap.insert(5) **Result:** `minHeap = \[5\]`
>
> **Operation:** minHeap.insert(3) **Result:** `minHeap = \[3, 5\]`
>
> **Operation:** minHeap.remove(1) **Result:** `minHeap = \[3\]`
>
> **Operation:** minHeap.getMin() **Result:** `minHeap = \[3\]`, returns `3`
>
> **Operation:** minHeap.extractMin() **Result:** `minHeap = \[\]`, returns `3`

## Solution

```cpp
using namespace std;

class MinHeap {
public:
    vector<int> heap;

    // Helper function to restore heap property upwards (used in insert)
    void upHeapify(int index) {
        int parent = (index - 1) / 2;
        while (index > 0 && heap[parent] > heap[index]) {
            swap(heap[index], heap[parent]);
            index = parent;
            parent = (index - 1) / 2;
        }
    }

    // Helper function to maintain the min heap property downwards
    void downHeapify(int index) {
        int smallest = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        // Find the smallest among the node and its left child
        if (left < heap.size() && heap[left] < heap[smallest]) {
            smallest = left;
        }

        // Find the smallest among the node and its right child
        if (right < heap.size() && heap[right] < heap[smallest]) {
            smallest = right;
        }

        // If the smallest is not the current node, swap and continue
        // heapify
        if (smallest != index) {
            swap(heap[index], heap[smallest]);
            downHeapify(smallest);
        }
    }

    void insert(int val) {

        // Insert the new value at the end of the heap
        heap.push_back(val);

        // Get the index of the new value
        int index = heap.size() - 1;

        // Restore the min heap property by comparing with parent nodes
        upHeapify(index);
    }

    void remove(int index) {

        // Replace the value with the largest possible value and heapify
        heap[index] = heap.back();

        // Remove the last node
        heap.pop_back();

        // Restore the min heap property
        downHeapify(index);
    }

    int getMin() {
        if (heap.empty()) {
            return -1;
        }

        // Return the root node
        return heap[0];
    }

    int extractMin() {
        if (heap.empty()) {
            return -1;
        }

        // Extract the root node
        int root = heap[0];

        // Delete the root node
        remove(0);

        // Return the extracted root node
        return root;
    }
};
```

***

# Design a median finder

## Problem Statement

Given the skeleton of a **MedianFinder class** that is supposed to find the median from a running stream, complete this class by implementing all the MedianFinder operations below.

> -   **MedianFinder()** - Initializes the MedianFinder object.
> -   **addNum(int num)** - Inserts the integer num from the data stream into the data structure.
> -   **findMedian()** - Returns the median of all elements so far.

> The input should adhere to the following rules:
>
> 1.  The input should contain two arrays of the same size.
> 2.  The first array should contain the list of operations, while the second should contain the corresponding operands for those operations.
> 3.  The first index in the first array should contain **MedianFinder**, and the first index in the second array should contain an empty array. This is used for initialising the MedianFinder.
> 4.  For each index in the first array that contains the **addNum** operation, the corresponding index in the second array should contain an integer that needs to be inserted.
> 5.  For each index in the first array that contains the **findMedian** operation, the corresponding index in the second array should contain an empty array.
>
> **Example:**
>
> -   **Input:** \[MedianFinder, addNum, addNum, addNum, findMedian\] \[\[\], \[1\], \[2\], \[4\], \[\]\]
>
> -   **Output:** \[null, null, null, null, 3.50000\]
>
> **Explanation:**
>
> **Operation:** MedianFinder medianFinder = new MedianFinder() **Result:** Initializes a new `MedianFinder` object
>
> **Operation:** medianFinder.addNum(1) **Result:** `list = \[1\]`
>
> **Operation:** medianFinder.addNum(2) **Result:** `list = \[1, 2\]`
>
> **Operation:** medianFinder.addNum(4) **Result:** `list = \[1, 2, 4\]`
>
> **Operation:** medianFinder.findMedian() **Result:** `list = \[1, 2, 4\]`, returns `2`

## Solution

```cpp
#include <functional>
#include <queue>

using namespace std;

class MedianFinder {
public:

    // Stores the smaller half of the numbers
    priority_queue<int> maxHeap;

    // Stores the larger half of the numbers
    priority_queue<int, vector<int>, greater<int>> minHeap;

    MedianFinder() {}

    void addNum(int num) {

        // Add the number to the max heap
        maxHeap.push(num);

        // Balance the heaps to maintain the property:
        // maxHeap.size() >= minHeap.size()
        // or
        // maxHeap.size() == minHeap.size() + 1
        if (maxHeap.size() > minHeap.size() + 1) {

            // The max heap has more elements, so we extract the largest
            // element from it
            int largest = maxHeap.top();
            maxHeap.pop();

            // Add the largest element to the min heap
            minHeap.push(largest);
        }

        // Balance the heaps to maintain the property:
        // maxHeap.top() <= minHeap.top()
        if (!minHeap.empty() && maxHeap.top() > minHeap.top()) {

            // The max heap's top element is larger than the min heap's
            // top element. Swap the elements to maintain the property

            // Fetch the smallest element from the max heap
            int smallest = maxHeap.top();
            maxHeap.pop();

            // Fetch the largest element from the min heap
            int largest = minHeap.top();
            minHeap.pop();

            // Swap the elements
            maxHeap.push(largest);
            minHeap.push(smallest);
        }
    }

    double findMedian() {
        if (maxHeap.size() > minHeap.size()) {

            // The max heap has more elements, so the median is the top
            // element of the max heap
            return maxHeap.top();
        }

        // The max heap and min heap have the same number of elements
        // Calculate the median as the average of the top elements of
        // both heaps
        return (maxHeap.top() + minHeap.top()) / 2.0;
    }
};
```
