# Introduction to bubble sort

Bubble sort, also known as sinking sort, is one of the simplest sorting algorithms that works by moving an item to its correct position by comparing it against the element that comes after it. If the element after it is smaller, it is swapped with the current element. This process is repeated until no more swaps are needed to be performed in a pass, resulting in a final sorted list.

**Why is this sort called bubble sort?**

This process is similar to how bubbles rise to the surface of water, where the lighter bubbles move upwards while the heavier ones sink. In Bubble sort, the smaller (or lighter) elements "**bubble**" to the front of the list, while the larger (or heavier) elements "**sink**" to the end.

// Diagram: Heavier bubble sinks down

## Example

An example of this sorting process in action would be if you were a teacher tasked with organising a queue of students by their heights.

// Diagram: Queue of students standing in random order

To do this, you would start by comparing the height of the first student with the second student.

// Diagram: Compare the first and second student

If the first student is taller than the one behind him, you swap their positions and continue comparing the next pairs of students.

// Diagram: Swap students if they are out of order

This process continues down the queue until you reach the end, ensuring that by the time you get there, the tallest student has moved to the back of the queue.

// Diagram: The tallest student reaches the end of the queue

You then return to the front and repeat the comparisons. With every pass through the queue, the next tallest student is pushed to their correct position at the back.

// Diagram: Move the second tallest student to the second last position in the queue

By repeating this process until no more swaps are needed, the entire queue becomes sorted from shortest at the front to tallest at the back.

// Diagram: All students are standing in sorted order of their heights

> -   **Step 1.1:** Compare the heights of the first and second students in the queue and swap them if necessary.
> -   **Step 1.2:** Compare the heights of the second and third students in the queue and swap them if necessary.
> -   ...
> -   **Step 1.N-1:** Compare the heights of the (N - 1)th and Nth students in the queue and swap them if necessary.
> -   **Step 2:** Reduce the search space by excluding the last student from the queue, as he is now standing in the correct position.
> -   **Step 3:** Repeat the above process until all students have reached their correct positions.

// Diagram: Sorting students based on their height using bubble sort

## Advantages

Even though bubble sort is not the most efficient sorting algorithm, it presents several advantages. Its simplicity makes it easy to implement and understand, making it a common choice for teaching basic sorting concepts. 

> -   **Simplicity:** Bubble sort is quite simple to understand and implement, making it an ideal choice for learning about sorting.
> -   **Adaptive:** Smart implementations of bubble sort can ensure that if the input list is partially sorted, the time complexity can be reduced to close to **O(N)**.
> -   **Stable:** Bubble sort is stable, i.e., it does not change the list's relative order of equal values.
> -   **In-place:** Bubble sort can sort the input list itself without allocating new memory for the algorithm.

## Limitations

Despite its simplicity, bubble sort has several significant limitations. Its time complexity is relatively high, especially for large datasets, making it inefficient compared to more advanced sorting algorithms like quicksort or mergesort. 

> -   **Inefficient:** Compared to other sorting algorithms bubble sort is not ideal for sorting large data sets as it presents an average time complexity of **O(N^2)**.

***

# Understanding bubble sort algorithm

The strategy from the earlier example could be used to create an algorithm. To explain this algorithm, we will take an array as an input list, but the same algorithm can be applied to any list data structure.

## Algorithm

The bubble sort algorithm conceptually divides the array into two parts: an **unsorted subarray** and a **sorted subarray**. Initially, all elements belong to the unsorted portion, while the sorted portion is empty.

// Diagram: Unsorted and sorted subarrays

In each pass, the algorithm repeatedly compares adjacent elements in the unsorted section and swaps them if they are out of order. 

// Diagram: Swap if the elements are out of order

As these comparisons continue from left to right, the largest value **"bubbles up"** to the end of the unsorted portion.

// Diagram: Keep swapping adjacent elements if they are out of order

Once the largest value reaches the end, it becomes part of the sorted portion. With every pass, the unsorted portion shrinks by one element while the sorted portion grows.

// Diagram: Unsorted subarray shrinks, and the sorted subarray grows

This process continues until no elements remain in the unsorted section, meaning the entire list is fully sorted.

// Diagram: The array is now sorted

When implementing this algorithm based on the above approach, the array is sorted using two nested loops with loop control variables `i` and `j` that manage a series of passes to compare and reorder elements.

The outer loop initialises `i` at `0` and continues until it reaches `n-2`. In each iteration of this loop, the algorithm identifies the largest element in the unsorted subarray and moves it to its final position at the end of the subarray.

**Why do we run the outer loop to `n - 2` and not `n - 1`?**

We run `i` from `0` to `n-2` because once `n-1` elements are in their correct positions, the last element (the smallest) must be in its correct position.

// Diagram: The outer loop iterates from 0 to n - 2

The inner loop begins by initializing `j` at `0` and iterates through the unsorted portion of the array, which is up to `n - i - 2`. During this process, the algorithm compares the current element `arr[j]` with its neighbour `arr[j + 1]`. If `arr[j]` is greater than `arr[j + 1]`, both elements are swapped, moving the larger element one step closer to the end.

**Why do we run the inner loop to `n - i - 2` and not `n - i`?**We run `j` from `0` to `n - i - 2` to avoid two issues: 

// Diagram: 1. Avoid reprocessing already sorted elements

After each outer loop iteration, the last `i` elements of the array are already in their correct sorted positions. Therefore, the unsorted portion of the array ends at index `n - i - 1`, and there is no need to compare elements beyond this point.

// Diagram: 2\. Prevent out-of-bounds comparisons

Since each comparison is between `arr[j]` and `arr[j + 1]`, the index `j + 1` must remain within the unsorted portion of the array. To ensure this, `j` must stop at `n - i - 2`, which is one position before the end of the unsorted segment.

// Diagram: The inner loop iterates from 0 to n - i - 2 to "bubble up" the largest value

As the inner loop finishes for a given value of `i`, the largest value among the unsorted elements would have **"bubbled up"** to the end of the unsorted range. This reduces the number of elements to compare in the next pass, which is why the upper limit of `j` decreases as `i` increases.

// Diagram: The largest element (10) has "bubbled up" to the end

With each iteration of the outer loop, the unsorted portion of the array shrinks by one element from right to left, and the sorted portion grows accordingly. After all iterations from `0` to `n - 2` are complete, the entire array is sorted in ascending order.

// Diagram: The unsorted subarray shrinks and the sorted subarray grows

The full dry run of the algorithm is given below.

// Diagram: Sorting an array in ascending order using bubble sort

## Implementation

This is a basic implementation of bubble sort. However, some smart implementations of bubble sort check whether any swaps were made in an iteration and exit if no swaps were made at the end of an iteration, as this means that the list is in a sorted state.

C++

```cpp
using namespace std;

class Solution {
public:
    void bubbleSort(vector<int> &arr) {
        int n = arr.size();

        // Iterate through each element in the array
        for (int i = 0; i < n - 1; i++) {

            // Compare adjacent elements and swap them if they are in the
            // wrong order
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    swap(arr[j], arr[j + 1]);
                }
};
```

Java

```java
class Solution {
    public void bubbleSort(int[] arr) {
        int n = arr.length;

        // Iterate through each element in the array
        for (int i = 0; i < n - 1; i++) {

            // Compare adjacent elements and swap them if they are in the
            // wrong order
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {

                    // Swap arr[j] and arr[j + 1]
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
```

Typescript

```typescript
export class Solution {
    bubbleSort(arr: number[]): void {
        const n = arr.length;

        // Iterate through each element in the array
        for (let i = 0; i < n - 1; i++) {

            // Compare adjacent elements and swap them if they are in the
            // wrong order
            for (let j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {

                    // Swap arr[j] and arr[j + 1]
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
```

Javascript

```javascript
export class Solution {
    bubbleSort(arr) {
        const n = arr.length;

        // Iterate through each element in the array
        for (let i = 0; i < n - 1; i++) {

            // Compare adjacent elements and swap them if they are in the
            // wrong order
            for (let j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {

                    // Swap arr[j] and arr[j + 1]
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
```

Python

```python
from typing import List

class Solution:
    def bubble_sort(self, arr: List[int]) -> None:
        n: int = len(arr)

        # Iterate through each element in the array
        for i in range(n - 1):

            # Compare adjacent elements and swap them if they are in the
            # wrong order
            for j in range(n - i - 1):
                if arr[j] > arr[j + 1]:

                    # Swap arr[j] and arr[j + 1]
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
```

## Complexity analysis

When bubble sort is applied to a list of size **N**, each iteration scans the unsorted portion of the list to ensure that the largest element moves to its correct position at the end. In the best-case scenario, when the input list is already sorted, the algorithm can detect that no swaps are needed and exit after the first pass, resulting in linear time complexity **O(N)**.

// Diagram: Best case: When the array is already sorted

In the average case, the process must be repeated for most elements until the entire list is sorted. The unsorted portion decreases by one element after each iteration (**N** for the first pass, **N−1** for the second, **N−2** for the third, and so on). Because this reduction is linear, the total number of comparisons grows quadratically, resulting in a time complexity of **O(N^2)**.

// Diagram: Average case: When the array is not sorted

In the worst case (such as when the list is in reverse order), the process must be repeated for all elements in every pass. As with the average case, the unsorted portion shrinks linearly with each iteration, leading to a quadratic growth in the number of comparisons. Therefore, bubble sort also has a worst-case time complexity of **O(N^2)**.

// Diagram: Worst case: When the array is sorted in reverse order

Since bubble sort modifies the input list without creating a new one, the space complexity remains **constant**, i.e., **O(1)**.

> **Best case** - The input list is sorted in the desired order.
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N)**
>
> **Average case** - The input list is a mix of sorted and unsorted elements.
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N^2)**
>
> **Worst case** - The input list is sorted in reverse order.
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N^2)**

***

# Bubble sort

## Problem Statement

Given an integer array **arr**, write a function that sorts the given array in non-decreasing order. You must do it **in place**.

You must use **bubble sort algorithm** to sort this array.

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
    void bubbleSort(vector<int> &arr) {
        int n = arr.size();

        // Iterate through each element in the array
        for (int i = 0; i < n - 1; i++) {

            // Compare adjacent elements and swap them if they are in the
            // wrong order
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    swap(arr[j], arr[j + 1]);
                }
            }
        }
    }
};
```
