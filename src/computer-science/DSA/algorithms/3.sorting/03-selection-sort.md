# Introduction to selection sort

Selection sort is another simple sorting algorithm that builds the final sorted list by dividing the input list into two sublists, one sorted and the other unsorted. At each iteration, it picks the smallest element from the unsorted list and moves it to the end of the sorted list. It is not the most efficient, but it is widely studied as a straightforward sort for beginners.

**Is selection sort faster than bubble sort?**Selection sort almost consistently outperforms bubble sort in real-world applications as it uses a single swap instead of multiple swaps used by bubble sort to place an item in its sorted position.

## Example

Let's consider the bubble sort example. Imagine you are a teacher and need to sort a queue of students by height.

// Diagram: Queue of students standing in random order

The most intuitive approach would be to select the shortest student from the queue and swap their position with the first student.

// Diagram: Swap the shortest student with the first student

Then, find the second shortest student among the remaining students and swap their positions with the second student in the queue.

// Diagram: Swap the second shortest student with the second student

This would put the first two students in the correct order.

// Diagram: The first two students are in sorted order of their heights

You would then repeat this process until you have swapped the last student in the queue. This ensures that the entire queue becomes sorted from shortest at the front to tallest at the back. 

// Diagram: All students are standing in sorted order of their heights

> -   **Step 1:** Find the shortest student from the unsorted part of the line.
> -   **Step 2:** Swap this student with the student standing at the start of the unsorted part of the line.
> -   **Step 3:** Reduce the search space by excluding the first student from the unsorted part of the line as they are now stating at the correct position.
> -   **Step 3:** Repeat the above process until no more students are in the unsorted part of the line.

// Diagram: Sorting students based on their height using selection sort

## Advantages

Even though selection sort is not the most efficient sorting algorithm, it offers several advantages. Its simple and intuitive process makes it easy to understand and implement, which is particularly useful for teaching the fundamentals of sorting. 

> -   **Simplicity:** Selection sort is quite simple to understand and implement, making it an ideal choice for learning about sorting.
> -   **In-place:** Selection sort can sort the input list without allocating new memory for the algorithm.

## Limitations

Despite its simplicity, selection sort has notable limitations. Its time complexity is relatively high, which makes it inefficient for large datasets.

> -   **Inefficient:** Compared to other sorting algorithms selection sort is not ideal for sorting large data sets as it presents an average time complexity of **O(N^2)**.
> -   **Unstable:** Selection sort is not stable i.e. it can change the relative order of equal values in the list.

***

# Understanding selection sort algorithm

The strategy from the earlier example could be used to create an algorithm. To explain this algorithm, we will take an array as an input list, but the same algorithm can be applied to any list data structure.

## Algorithm

Similar to bubble sort, selection sort algorithm conceptually divides the array into two parts: a **sorted subarray** and an **unsorted subarray**. Initially, all elements belong to the unsorted portion, while the sorted portion is empty.

// Diagram: Sorted and unsorted subarrays

During each iteration, it identifies the smallest element in the unsorted subarray and swaps it with the first element of that subarray.

// Diagram: Swap the smallest element with the first element in the unsorted subarray

This allows the sorted subarray to grow while the unsorted subarray shrinks.

// Diagram: Sorted subarray grows, and unsorted subarray shrinks

The algorithm repeats this process until the size of the unsorted subarray becomes zero.

// Diagram: The array is now sorted

When implementing this algorithm based on the above approach, the array is sorted by repeatedly selecting the smallest element from the unsorted portion and placing it in its correct position. The algorithm uses two nested loops controlled by variables `i` and `j`.

The outer loop initializes `i` at `0` and continues until `n - 2`. In each iteration, the algorithm assumes that the element at index `i` is the smallest in the unsorted portion of the array and assigns `i` to a new variable, `minIndex`. The goal of each pass is to find the actual smallest element from the remaining unsorted elements and swap it with the element at index `i`, which represents the boundary between the sorted and unsorted parts of the array.

**Why do we run the outer loop to `n - 2` and not `n - 1`?**

We run `i` from `0` to `n-2` because once `n-1` elements are in their correct positions, the last element (the largest) must be in its correct position.i

// Diagram: The outer loop iterates from 0 to n - 2

The inner loop begins by initializing `j` at `i + 1` and iterates through the unsorted portion of the array up to index `n - 1`. During this process, the algorithm compares each element `arr[j]` with the current smallest element `arr[minIndex]`. If `arr[j]` is smaller than `arr[minIndex]`, the value of `minIndex` is updated to `j`. This allows the algorithm to keep track of the smallest element found during the scan of the unsorted portion.

**Why do we run the inner loop from `i + 1` to `n - 1`?**

We start `j` at `i + 1` because the element at index `i` is already assumed to be the smallest at the beginning of the pass. Comparing it with itself would be unnecessary. The loop continues until `n-1` because all remaining elements to the right of `i` belong to the unsorted portion and must be checked to find the smallest value.

// Diagram: The inner loop iterates from i + 1 to n - 1 to find the smallest value

Once the inner loop completes for a given value of `i`, the smallest element in the unsorted portion of the array is known, and its index is stored in `minIndex`. The algorithm then swaps `arr[i]` with `arr[minIndex]`. This places the smallest element into its correct sorted position at index `i`.

// Diagram: Swap the value at minIndex and index i

With each iteration of the outer loop, the sorted portion of the array grows by one element from left to right, and the unsorted portion shrinks accordingly. After all iterations from `0` to `n - 2` are complete, the entire array is sorted in ascending order.

// Diagram: The sorted subarray grows and the unsorted subarray shrinks

The full dry run of the algorithm is given below.

// Diagram: Sorting an array in ascending order using selection sort

> **Algorithm**
>
> -   **Step 1:** Iterate through the array using \`i\` from \`0\` to \`n-2\`
>     -   **Step 1.1:** Assume \`arr\[i\]\` is the smallest element, store its index in \`minIndex\`
>     -   **Step 1.2:** Iterate through the unsorted portion of the array using \`j\` from \`i+1\` to \`n-1\`
>         -   **Step 1.2.1:** If \`arr\[j\]\` < \`arr\[minIndex\]\`
>             -   **Step 1.2.1.1:** Update \`minIndex\` to \`j\`
>     -   **Step 1.3:** Swap \`arr\[i\]\` with \`arr\[minIndex\]\`

## Implementation

This implementation of selection sort iterates through the array, assuming each element in turn is the smallest in the unsorted portion. It then scans the remaining unsorted elements to find the true minimum, updating the index as needed. Once the smallest element is identified, it is swapped with the current element.

C++

```cpp
using namespace std;

class Solution {
public:
    void selectionSort(vector<int> &arr) {
        int n = arr.size();

        // Iterate over each element except the last one
        for (int i = 0; i < n - 1; i++) {

            // Assume the current element is the smallest
            int minIndex = i;

            // Find the index of the smallest element in the remaining
            // unsorted portion
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {

                    // Update the index of the smallest element
                    minIndex = j;
                }

            // Swap the current element with the smallest element found
            swap(arr[i], arr[minIndex]);
        }
};
```

Java

```java
class Solution {
    public void selectionSort(int[] arr) {
        int n = arr.length;

        // Iterate over each element except the last one
        for (int i = 0; i < n - 1; i++) {

            // Assume the current element is the smallest
            int minIndex = i;

            // Find the index of the smallest element in the remaining
            // unsorted portion
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {

                    // Update the index of the smallest element
                    minIndex = j;
                }

            // Swap the current element with the smallest element found
            int temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
```

Typescript

```typescript
export class SelectionSort {
    selectionSort(arr: number[]): void {
        const n = arr.length;

        // Iterate over each element except the last one
        for (let i = 0; i < n - 1; i++) {
            // Assume the current element is the smallest
            let minIndex = i;

            // Find the index of the smallest element in the remaining unsorted portion
            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {
                    // Update the index of the smallest element
                    minIndex = j;
                }

            // Swap the current element with the smallest element found
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
```

Javascript

```javascript
export class Solution {
    selectionSort(arr: number[]): void {
        const n = arr.length;

        // Iterate over each element except the last one
        for (let i = 0; i < n - 1; i++) {

            // Assume the current element is the smallest
            let minIndex = i;

            // Find the index of the smallest element in the remaining
            // unsorted portion
            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {

                    // Update the index of the smallest element
                    minIndex = j;
                }

            // Swap the current element with the smallest element found
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
```

Python

```python
from typing import List

class Solution:
    def selection_sort(self, arr: List[int]) -> None:
        n: int = len(arr)

        # Iterate over each element except the last one
        for i in range(n - 1):

            # Assume the current element is the smallest
            min_index: int = i

            # Find the index of the smallest element in the remaining
            # unsorted portion
            for j in range(i + 1, n):
                if arr[j] < arr[min_index]:

                    # Update the index of the smallest element
                    min_index = j

            # Swap the current element with the smallest element found
            arr[i], arr[min_index] = arr[min_index], arr[i]
```

## Complexity analysis

When selection sort is applied to a list of size **N**, the algorithm repeatedly scans the unsorted portion of the list to find the smallest element and swaps it with the first element of that subarray.

In the best-case scenario, even if the list is already sorted, selection sort still needs to scan the entire unsorted portion to identify the minimum element in each iteration. Therefore, the time complexity remains **O(N^2)**.

// Diagram: Best case: When the array is already sorted

In the average case, for each of the **N** positions, the algorithm scans the remaining unsorted elements to find the minimum. The number of elements examined decreases linearly with each iteration (**N** for the first pass, **N−1** for the second, **N−2** for the third, and so on). This leads to a quadratic total number of comparisons, resulting in a time complexity of **O(N^2)**.

// Diagram: Average case: When the array is not sorted

In the worst case, the behavior of selection sort remains the same as in the average case. For each of the **N** positions, the algorithm still scans all remaining unsorted elements to find the minimum. The linear reduction in the unsorted portion again produces a quadratic number of comparisons, so the worst-case time complexity is also **O(N^2)**.

An additional advantage is that selection sort performs at most **N-1** swaps, which can be useful when memory writes are costly.

// Diagram: Worst case: When the array is sorted in reverse order

Since selection sort modifies the input list without creating a new one, the space complexity remains **constant**, i.e., **O(1)**.

> **Best case** - The input list is sorted in the desired order.
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N^2)**
>
> **Average case -** The input list is a mix of sorted and unsorted elements.
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N^2)**
>
> **Worst case** - The input list is sorted in reverse order.
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N^2)**

***

# Selection sort

## Problem Statement

Given an integer array **arr**, write a function that sorts the given array in non-decreasing order. You must do it **in place**.

You must use **selection sort algorithm** to sort this array.

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
    void selectionSort(vector<int> &arr) {
        int n = arr.size();

        // Iterate over each element except the last one
        for (int i = 0; i < n - 1; i++) {

            // Assume the current element is the smallest
            int minIndex = i;

            // Find the index of the smallest element in the remaining
            // unsorted portion
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {

                    // Update the index of the smallest element
                    minIndex = j;
                }
            }

            // Swap the current element with the smallest element found
            swap(arr[i], arr[minIndex]);
        }
    }
};
```
