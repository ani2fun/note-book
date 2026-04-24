# Introduction to heapsort

Heapsort is another efficient sort algorithm that uses the heap data structure under the hood to sort a list. It can be considered an efficient implementation of selection sort using the heap data structure.

**How is heapsort similar to selection sort?**Similar to selection sort, heapsort divides the input list into sorted and unsorted regions. It iteratively shrinks the unsorted region by extracting the largest element from it and inserting it into the sorted region. However, it performs this step more efficiently by using a heap data structure rather than a linear scan-link selection sort. 

## Example

Heapsort itself doesn’t appear directly in everyday scenarios, since a heap is an abstract data structure used in computer memory. However, a real-world situation that closely mirrors how heapsort operates is a telecom customer support system that prioritises incoming calls. Each call is assigned a priority, forming a priority queue maintained using a heap. When a new call arrives, it is positioned in the correct order based on urgency, ensuring the highest-priority issues are handled first.

## Advantages

Heapsort offers several useful characteristics that make it an effective choice in many sorting scenarios. Its structured heap-based approach ensures reliability and strong performance across various input types. The following points highlight the key advantages of using this algorithm.

> -   **Efficiency:** Heapsort is one of the most efficient sorting algorithms, especially for large datasets. Its time complexity for all cases is **O(N\*logN)**, faster than many other sorting algorithms.
> -   **In-place:** Heapsort can sort the input list without allocating new memory for the algorithm.

## Limitations

Despite its strengths, heapsort also comes with certain drawbacks that may affect its practicality in some use cases. The points below outline its primary limitations.

> -   **Unstable:** Heapsort is not stable, i.e., it can change the relative order of equal values in the list.

***

# Understanding heapsort algorithm

Heapsort is mostly used to sort arrays, but it can also be used to sort other list data structures. However, as it relies on the random access provided by arrays, heapsort may reduce the algorithm's efficiency. For the sake of this example, we will take an integer array and apply heapsort to it.

## Algorithm

When applied to an array `arr`, heapsort works in two main steps, as described below.

> -   **Step 1:** Build a max heap from the input array
> -   **Step 2**: Remove the top element and heapify again

### Step 1: Build the heap

To build a max heap, the algorithm starts from the last non-leaf node and moves upward to the root. This is done by iterating i from `n/2 - 1` down to `0` and calling `heapify(arr, n, i)` at each step.

**Why do we start from `n/2 - 1`?**

In a binary heap stored as an array, all elements from index `n/2` to `n-1` are leaf nodes. Leaf nodes already satisfy the heap property, so there is no need to heapify them. Starting from `n/2 - 1`, ensure that every internal node is heapified, resulting in a valid max-heap.

After this phase, the largest element in the array is guaranteed to be at the root index.

// Diagram: Build the max heap

### Step 2: Remove the top element and heapify again

Once the max heap is built, the algorithm repeatedly extracts the largest element and places it at its correct position in the array. The algorithm iterates over `i` from `n-1` down to `1`. In each iteration:

> -   The root element \`arr\[0\]\`, which is the largest element in the heap, is swapped with \`arr\[i\]\`.
> -   The heap size is reduced by one, as the element at index \`i\` is now in its final sorted position.
> -   Call \`heapify(arr, i, 0)\` to restore the max heap property in the remaining unsorted portion of the array.

**Why do we reduce the heap size after each swap?**

After swapping, the largest element is placed at the end of the array and should not be included in further heap operations. Reducing the heap size ensures that the sorted portion of the array is excluded from subsequent heapify calls.

// Diagram: Remove the top element and heapify again

In each iteration, the maximum element is removed from the heap and moved to its correct position in the sorted region via a swap. Similar to selection sort, heapsort maintains a clear separation between an unsorted region (the heap) and a sorted region containing the extracted elements. Once all elements have been removed from the heap and placed in order, the array is fully sorted in ascending order.

### Heapify procedure

The heapify function is responsible for maintaining the **max heap property** for a subtree rooted at a given index. It is called with the array `arr` the size of the heap `n`, and the `index` of the element that needs to be heapified.

The algorithm begins by assuming that the element at `index` is the largest and stores this index in a variable `largest`. It then calculates the indices of the left and right children:

> -   \`left = 2 \* index + 1\`
> -   \`right = 2 \* index + 2\`

// Diagram: Index, left child, right child, and largest indices in the array, and their representation in the heap

The algorithm compares the value at `index` with its `left` and `right` children (if they exist within the heap size `n`). If either child is larger than the current element, `largest` is updated to the index of the larger child.

If the value of element at the index `largest` is no longer equal to element at input `index`, the element at `index` is swapped with the element at `largest`. Since this swap may violate the heap property in the subtree below, the algorithm recursively calls `heapify(arr, n, largest)` to restore the heap property.

**Why is `heapify` called recursively?**

After a swap, the element moved down the tree may still be smaller than its children. The recursive call ensures that the heap property is restored throughout the affected subtree.

// Diagram: Heapify procedure using an example array

Below is the full second step: using the array obtained after building the max heap from the input array in Step 1, the algorithm repeatedly extracts the maximum element (the root of the heap), swaps it with the top node, and then removes the last node from the heap. This process is repeated on the reduced heap until all elements are extracted, resulting in a fully sorted array.

// Diagram: Full second step: Remove the top element and heapify again

> **Algorithm**
>
> **heapify(\[ref\] arr, n, index)**
>
> -   **Step 1:** Set \`largest = index\`
> -   **Step 2:** Compute the child indices
>     -   **Step 2.1:** \`left = 2 \* index + 1\`
>     -   **Step 2.2:** \`right = 2 \* index + 2\`
> -   **Step 3:** If \`left < n\` and \`arr\[left\] > arr\[largest\]\`
>     -   **Step 3.1:** Update \`largest = left\`
> -   **Step 4:** If \`right < n\` and \`arr\[right\] > arr\[largest\]\`
>     -   **Step 4.1:** Update \`largest = right\`
> -   **Step 5:** If \`largest != index\`
>     -   **Step 5.1:** Swap \`arr\[index\]\` and \`arr\[largest\]\`
>     -   **Step 5.2:** Recursively call \`heapify(arr, n, largest)\`
>
> **heapSort(\[ref\] arr)**
>
> -   **Step 1:** Let \`n = arr.size()\`
> -   **Step 2:** For \`i = n/2 - 1\` down to \`0\`
>     -   **Step 2.1:** Call \`heapify(arr, n, i)\`
> -   **Step 4:** For \`i = n - 1\` down to \`1\`
>     -   **Step 4.1:** Swap \`arr\[0\]\` with \`arr\[i\]\`
>     -   **Step 4.2:** Call \`heapify(arr, i, 0)\` to restore heap

## Implementation

The following code provides a straightforward implementation of the heapsort algorithm. It demonstrates how a max heap is constructed and then used to repeatedly extract the largest element, resulting in the array being sorted in ascending order.

C++

```cpp
using namespace std;

class Solution {
public:
    void heapify(vector<int> &arr, int n, int index) {

        // Initialize largest as root
        int largest = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        // If left child is larger than root
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        // If right child is larger than largest so far
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        // If largest is not root
        if (largest != index) {
            swap(arr[index], arr[largest]);

            // Recursively heapify the affected sub-tree
            heapify(arr, n, largest);
        }

    void heapSort(vector<int> &arr) {
        int n = arr.size();

        // Build heap (rearrange array)
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }

        // Extract elements from heap one by one
        for (int i = n - 1; i > 0; i--) {
            swap(arr[0], arr[i]);

            // Heapify the reduced heap
            heapify(arr, i, 0);
        }
};
```

Java

```java
class Solution {
    public void heapify(int[] arr, int n, int index) {

        // Initialize largest as root
        int largest = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        // If left child is larger than root
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        // If right child is larger than largest so far
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        // If largest is not root
        if (largest != index) {
            swap(arr, index, largest);

            // Recursively heapify the affected sub-tree
            heapify(arr, n, largest);
        }

    public void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    public void heapSort(int[] arr) {
        int n = arr.length;

        // Build heap (rearrange array)
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }

        // Extract elements from heap one by one
        for (int i = n - 1; i > 0; i--) {
            swap(arr, 0, i);

            // Heapify the reduced heap
            heapify(arr, i, 0);
        }
```

Typescript

```typescript
export class Solution {
    heapify(arr: number[], n: number, index: number): void {

        // Initialize largest as root
        let largest = index;
        const left = 2 * index + 1;
        const right = 2 * index + 2;

        // If left child is larger than root
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        // If right child is larger than largest so far
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        // If largest is not root
        if (largest !== index) {
            [arr[index], arr[largest]] = [arr[largest], arr[index]];

            // Recursively heapify the affected sub-tree
            this.heapify(arr, n, largest);
        }

    heapSort(arr: number[]): void {
        const n = arr.length;

        // Build heap (rearrange array)
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.heapify(arr, n, i);
        }

        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            [arr[0], arr[i]] = [arr[i], arr[0]];

            // Heapify the reduced heap
            this.heapify(arr, i, 0);
        }
```

Javascript

```javascript
export class Solution {
    heapify(arr, n, index) {

        // Initialize largest as root
        let largest = index;
        const left = 2 * index + 1;
        const right = 2 * index + 2;

        // If left child is larger than root
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        // If right child is larger than largest so far
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        // If largest is not root
        if (largest !== index) {
            [arr[index], arr[largest]] = [arr[largest], arr[index]];

            // Recursively heapify the affected sub-tree
            this.heapify(arr, n, largest);
        }
    heapSort(arr) {
        const n = arr.length;

        // Build heap (rearrange array)
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.heapify(arr, n, i);
        }

        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            [arr[0], arr[i]] = [arr[i], arr[0]];

            // Heapify the reduced heap
            this.heapify(arr, i, 0);
        }
```

Python

```python
from typing import List

class Solution:
    def heapify(self, arr: List[int], n: int, index: int) -> None:

        # Initialize largest as root
        largest: int = index
        left: int = 2 * index + 1
        right: int = 2 * index + 2

        # If left child is larger than root
        if left < n and arr[left] > arr[largest]:
            largest = left

        # If right child is larger than largest so far
        if right < n and arr[right] > arr[largest]:
            largest = right

        # If largest is not root
        if largest != index:
            arr[index], arr[largest] = arr[largest], arr[index]

            # Recursively heapify the affected sub-tree
            self.heapify(arr, n, largest)

    def heap_sort(self, arr: List[int]) -> None:
        n: int = len(arr)

        # Build heap (rearrange array)
        for i in range(n // 2 - 1, -1, -1):
            self.heapify(arr, n, i)

        # Extract elements from heap one by one
        for i in range(n - 1, 0, -1):
            arr[0], arr[i] = arr[i], arr[0]

            # Heapify the reduced heap
            self.heapify(arr, i, 0)
```

## Complexity analysis

The time complexity of heapsort is **O(N\*logN)** in all cases. This is because the algorithm builds a max/min heap from the input array in **O(N)** time, repeatedly extracts the maximum/minimum element from the heap, and "heapifies" the remaining elements in **O(logN)** time. This process is repeated N times, resulting in a total time complexity of **O(N\*log N)**.

The space complexity of heapsort is **O(1)** in all cases. The algorithm sorts the input array in place without requiring additional memory.

> **Best case**
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N\*logN)**
>
> **Average case**
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N\*logN)**
>
> **Worst case**
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N\*logN)**

***

# Heap sort

## Problem Statement

Given an integer array **arr**, write a function that sorts the given array in non-decreasing order. You must do it **in place**.

You must use **heap sort algorithm** to sort this array.

### Example 1

> -   **Input:** arr = \[2, 3, 2, 1, 5, 6\]
> -   **Output:** \[1, 2, 2, 3, 5, 6\]
> -   **Explanation:** Above is the sorted array.

### Example 2

> -   **Input:** arr = \[6, 5, 4, 4, 4, 3, 2, 1\]
> -   **Output:** \[1, 2, 3, 4, 4, 4, 5, 6\]
> -   **Explanation:** Above is the sorted array.

### Example 3

> -   **Input:** arr = \[1, 2, 3, 4, 5, 6\]
> -   **Output:** \[1, 2, 3, 4, 5, 6\]
> -   **Explanation:** The array is already sorted.

## Solution

```cpp
using namespace std;

class Solution {
public:
    void heapify(vector<int> &arr, int n, int index) {

        // Initialize largest as root
        int largest = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        // If left child is larger than root
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        // If right child is larger than largest so far
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        // If largest is not root
        if (largest != index) {
            swap(arr[index], arr[largest]);

            // Recursively heapify the affected sub-tree
            heapify(arr, n, largest);
        }
    }

    void heapSort(vector<int> &arr) {
        int n = arr.size();

        // Build heap (rearrange array)
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }

        // Extract elements from heap one by one
        for (int i = n - 1; i > 0; i--) {
            swap(arr[0], arr[i]);

            // Heapify the reduced heap
            heapify(arr, i, 0);
        }
    }
};
```
