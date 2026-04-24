# Introduction to dutch national flag sort

The Dutch National Flag problem, also known as the Dutch National Flag Sort or the 3-way partitioning problem, is a classic computer science problem that tries to solve a rather general problem. Given a list of items that can have at most three distinct values, it sorts them in linear time and constant space.

**Why is this sort called the Dutch national flag sort?**

It is because it is named after the Dutch flag, which consists of three horizontal stripes of red, white, and blue.

When faced with sorting a list of three distinct values, such as `0`, `1`, and `2`, one might consider using well-known sorting algorithms, such as counting sort or quicksort. While these algorithms are effective in general, they are not always the most efficient choice for this specific problem.

### Counting sort

Counting sort works by counting the occurrences of each distinct element and then reconstructing the sorted array based on these counts. For three distinct values, counting sort has a time complexity of **O(N + k)**, where **N** is the number of elements in the list, and **k** is the range of values (in this case, 3). It also requires **O(k)** extra space to store the counts.

While counting sort is linear-time, its additional memory usage may not be ideal for memory-constrained environments, especially when the array is large.

// Diagram: Counting sort requires O(k) space

### Quicksort

Quicksort is a general-purpose comparison-based sorting algorithm. In its best-case scenario, it has a time complexity of **O(N\*logN)** and requires O(logN) space for recursive calls.

Although quicksort is very efficient for large datasets, it is overkill for sorting a list with only three distinct elements. The extra recursive calls and comparisons make it less optimal than algorithms tailored to this problem.

// Diagram: Best case, average case and worst case for quicksort

### Dutch national flag sort

The Dutch National Flag algorithm guarantees that a list containing three distinct elements can be sorted in a single pass, achieving a time complexity of **O(N)**, where **N** is the number of elements.

Unlike many other sorting algorithms, it requires no additional memory, making it an in-place, highly efficient solution. By maintaining three pointers to partition the array into sections for low, middle, and high values, the algorithm ensures that each element is inspected and moved at most once, providing both speed and minimal memory usage.

// Diagram: Dutch national flag sort requires constant space

## Advantages

The Dutch national flag algorithm is particularly well-suited for sorting problems with three distinct categories. Some key advantages include:

> -   **Efficiency:** The Dutch National Flag algorithm has a time complexity of **O(N)**, making it the most efficient algorithm for a list of objects that can take at most 3 distinct values.
> -   **Stable:** The Dutch national flag sort is stable, i.e., it does not change the list's relative order of equal values.
> -   **In-place:** The Dutch national flag sort can sort the input list without allocating new memory for the algorithm.

## Limitations

Despite its efficiency, the Dutch national flag algorithm has some limitations:

> -   **Limited to three values:** The Dutch National Flag algorithm is limited to sorting a list of objects that can take on one of three values. This makes it less versatile than other sorting algorithms that can sort lists of objects with a larger number of distinct values.
> -   **Complexity:** While the Dutch National Flag algorithm is quite efficient, it can be more complex to implement than other sorting algorithms.

***

# Understanding dutch national flag sort algorithm

Now that we have explored the significance, advantages, and limitations of the Dutch National Flag sort, we can turn our attention to understanding the algorithm behind it. In the following section, we will examine how the algorithm works step by step and see how it efficiently organizes elements into their respective partitions.

## Algorithm

The Dutch National Flag algorithm is designed to sort an array containing only three distinct values (commonly `0`, `1`, and `2`) by partitioning the array into three sections and expanding them as the algorithm progresses. The algorithm uses three pointers to keep track of the boundaries between the sections.

> -   The \`left\` pointer is set to \`0\` and marks the boundary of the section containing elements equal to \`0\`.
> -   The \`mid\` pointer is set to \`0\` and is used to traverse the array.
> -   The \`right\` pointer is set to \`n - 1\` and marks the boundary of the section containing the elements equal to \`2\`.

// Diagram: Set the left, mid and right pointers

At any point during execution, the array maintains the following structure:

> -   Elements from index \`0\` to \`left - 1\` are all \`0s\` (sorted smallest section).
> -   Elements from index \`left\` to \`mid - 1\` are all \`1s\` (sorted middle section).
> -   Elements from index \`mid\` to \`right\` are unsorted.
> -   Elements from index \`right + 1\` to \`n - 1\` are all \`2s\` (sorted largest section).

// Diagram: The smallest, middle, unsorted and largest sections in the array

The algorithm continues to run while `mid <= right`. This condition ensures that there are still elements in the unsorted section that need to be examined.

**Why do we iterate while `mid <= right`?**

When `mid` becomes greater than `right`, all elements have been processed and placed into their correct sections. At this point, the unsorted section is empty, and the array is fully sorted.

In each iteration, the algorithm examines `arr[mid]`and then makes one of three decisions based on the result.

### 1\. arr\[mid\] == 0

When the element at `mid` index is `0`, it needs to be moved to the front section of the array. This is done by swapping it with the element at the `left` pointer, which marks the boundary of the already sorted smallest section. 

> Take the following steps:
>
> -   Swap \`arr\[mid\]\` with \`arr\[left\]\` to place the smallest value into its correct section.
> -   The \`mid\` pointer is incremented to continue scanning the next element.
> -   The \`left\` pointer is also incremented by one, expanding the sorted section of smallest elements

This ensures that the `0` is placed in its correct region while preserving the sorted structure of previously processed elements.

// Diagram: The element is in the smallest category

### 2\. arr\[mid\] == 1

When the element at `mid` index is `1`, it belongs to the middle section. It is already in its correct section relative to the `left` and `right` pointers. Therefore, no swap is needed.

> Take the following steps:
>
> -   The \`mid\` pointer is incremented to continue scanning the next element.

This step makes the Dutch National Flag algorithm more efficient: middle elements do not require unnecessary swaps, keeping it fast and simple.

// Diagram: The element is in the middle category

### 3\. arr\[mid\] == 2

When the element at `mid` index is `2`,  it belongs to the largest section. It must be moved to the end section of the array. This is achieved by swapping it with the element at the `right` pointer, which marks the boundary of the already sorted largest section. 

> Take the following steps:
>
> -   Swap \`arr\[mid\]\` with the element at the \`arr\[right\]\` to move the largest value toward its correct section.
> -   The \`right\` pointer is decremented by one, shrinking the unsorted section from the end.

**Why do we not increment `mid` in this case?**

After swapping, the element brought into position `mid` from the `right` side has not yet been evaluated. Incrementing `mid` immediately could cause the algorithm to skip processing this element. Therefore, `mid` remains unchanged so that the swapped element can be examined in the next iteration.

// Diagram: The element is in the largest category

This process continues until the `mid` pointer surpasses the `right` pointer, at which point all elements are in their correct sections and the array is fully sorted.

// Diagram: Sorting an array in ascending order using dutch national flag sort

> **Algorithm**
>
> -   **Step 1:** Initialize the three pointers \`left = 0\`, \`mid = 0\`, and \`right = n - 1\`.
> -   **Step 2:** Iterate while \`mid <= right\`:
>     -   **Step 2.1:** If \`arr\[mid\] == 0\`.
>         -   **Step 2.1.2:** Swap \`arr\[mid\]\` with \`arr\[left\]\`
>         -   **Step 2.1.3:** Increment \`mid\` to evaluate the next element
>         -   **Step 2.1.4:** Increment \`left\` to extend the sorted smallest region
>     -   **Step 2.2:** If \`arr\[mid\] == 1\`.
>         -   **Step 2.2.1:** Increment \`mid\` to evaluate the next element
>     -   **Step 2.3:** If \`arr\[mid\] == 2\`.
>         -   **Step 2.3.1:** Swap \`arr\[mid\]\` with \`arr\[right\]\`
>         -   **Step 2.3.2:** Decrement \`right\` to shrink the sorted largest region

## Implementation

For this implementation, we will take an integer array as input consisting of values `0`, `1`, and `2` and apply the Dutch national flag algorithm to sort it in ascending order.

C++

```cpp
using namespace std;

class Solution {
public:
    void dutchNationalFlagSort(vector<int> &arr) {

        // Pointer for the boundary where smallest values should be placed
        int left = 0;

        // Pointer for the current element being evaluated
        int mid = 0;

        // Pointer for the boundary where largest values should be placed
        int right = arr.size() - 1;

// Diagram: while (mid <= right) {

            // If the current element belongs to the smallest category
            if (arr[mid] == 0) {

                // Swap it with the element at the left boundary
                swap(arr[mid], arr[left]);

                // Expand mid forward
                mid++;

                // Expand left forward
                left++;
            }

            // If the current element belongs to the middle category
            else if (arr[mid] == 1) {

                // No swap needed — just move mid forward
                mid++;
            }

            // If the current element belongs to the largest category
            else {

                // Swap it with the element at the right boundary
                swap(arr[mid], arr[right]);

                // Shrink the right boundary — do NOT move mid yet
                right--;
            }
};
```

Java

```java
class Solution {
    public void dutchNationalFlagSort(int[] arr) {

        // Pointer for the boundary where smallest values should be placed
        int left = 0;

        // Pointer for the current element being evaluated
        int mid = 0;

        // Pointer for the boundary where largest values should be placed
        int right = arr.length - 1;

// Diagram: while (mid <= right) {

            // If the current element belongs to the smallest category
            if (arr[mid] == 0) {

                // Swap it with the element at the left boundary
                int temp = arr[mid];
                arr[mid] = arr[left];
                arr[left] = temp;

                // Expand mid forward
                mid++;

                // Expand left forward
                left++;
            }

            // If the current element belongs to the middle category
            else if (arr[mid] == 1) {

                // No swap needed — just move mid forward
                mid++;
            }

            // If the current element belongs to the largest category
            else {

                // Swap it with the element at the right boundary
                int temp = arr[mid];
                arr[mid] = arr[right];
                arr[right] = temp;

                // Shrink the right boundary — do NOT move mid yet
                right--;
            }
```

Typescript

```typescript
export class Solution {
    dutchNationalFlagSort(arr: number[]): void {

        // Pointer for the boundary where smallest values should be placed
        let left = 0;

        // Pointer for the current element being evaluated
        let mid = 0;

        // Pointer for the boundary where largest values should be placed
        let right = arr.length - 1;

// Diagram: while (mid <= right) {

            // If the current element belongs to the smallest category
            if (arr[mid] === 0) {

                // Swap it with the element at the left boundary
                [arr[mid], arr[left]] = [arr[left], arr[mid]];

                // Expand mid forward
                mid++;

                // Expand left forward
                left++;
            }

            // If the current element belongs to the middle category
            else if (arr[mid] === 1) {

                // No swap needed — just move mid forward
                mid++;
            }

            // If the current element belongs to the largest category
            else {

                // Swap it with the element at the right boundary
                [arr[mid], arr[right]] = [arr[right], arr[mid]];

                // Shrink the right boundary — do NOT move mid yet
                right--;
            }
```

Javascript

```javascript
export class Solution {
    dutchNationalFlagSort(arr) {

        // Pointer for the boundary where smallest values should be placed
        let left = 0;

        // Pointer for the current element being evaluated
        let mid = 0;

        // Pointer for the boundary where largest values should be placed
        let right = arr.length - 1;

// Diagram: while (mid <= right) {

            // If the current element belongs to the smallest category
            if (arr[mid] === 0) {

                // Swap it with the element at the left boundary
                [arr[mid], arr[left]] = [arr[left], arr[mid]];

                // Expand mid forward
                mid++;

                // Expand left forward
                left++;
            }

            // If the current element belongs to the middle category
            else if (arr[mid] === 1) {

                // No swap needed — just move mid forward
                mid++;
            }

            // If the current element belongs to the largest category
            else {

                // Swap it with the element at the right boundary
                [arr[mid], arr[right]] = [arr[right], arr[mid]];

                // Shrink the right boundary — do NOT move mid yet
                right--;
            }
```

Python

```python
from typing import List

class Solution:
    def dutch_national_flag_sort(self, arr: List[int]) -> None:

        # Pointer for the boundary where smallest values should be placed
        left: int = 0

        # Pointer for the current element being evaluated
        mid: int = 0

        # Pointer for the boundary where largest values should be placed
        right: int = len(arr) - 1

        while mid <= right:

            # If the current element belongs to the smallest category
            if arr[mid] == 0:

                # Swap it with the element at the left boundary
                arr[mid], arr[left] = arr[left], arr[mid]

                # Expand mid forward
                mid += 1

                # Expand left forward
                left += 1

            # If the current element belongs to the middle category
            elif arr[mid] == 1:

                # No swap needed — just move mid forward
                mid += 1

            # If the current element belongs to the largest category
            else:

                # Swap it with the element at the right boundary
                arr[mid], arr[right] = arr[right], arr[mid]

                # Shrink the right boundary — do NOT move mid yet
                right -= 1
```

## Complexity analysis

The Dutch national flag algorithm is a single-pass algorithm that swaps the values of the list as and when needed so the time complexity is always **linear**, i.e., **O(N),** where **N** is the size of the input list.

The algorithm does not need additional space and only creates three-pointers to swap the data, so the space complexity is always **constant**, i.e., **O(1)**.

> **Best case**
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N)**
>
> **Average case**
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N)**
>
> **Worst case**
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N)**

***

# Dutch national flag sort

## Problem Statement

You are given an integer array **arr** that contains balls of three colors, red, white, or blue, denoted by `0`, `1`, and `2`, respectively. Write a function to sort the balls so that all the red balls come first, followed by all the white and blue balls, respectively. You must do it **in place**.

You must use the **dutch national flag algorithm** to solve this problem.

### Example 1

> -   **Input:** arr = \[0, 1, 1, 2, 0\]
> -   **Output:** \[0, 0, 1, 1, 2\]
> -   **Explanation:** Above is the sorted order of balls.

### Example 2

> -   **Input:** arr = \[2, 1, 1, 0\]
> -   **Output:** \[0, 1, 1, 2\]
> -   **Explanation:** Above is the sorted order of balls.

### Example 3

> -   **Input:** arr = \[0, 0, 1, 1, 1, 2, 2\]
> -   **Output:** \[0, 0, 1, 1, 1, 2, 2\]
> -   **Explanation:** The balls are already sorted in the correct order.

## Solution

```cpp
using namespace std;

class Solution {
public:
    void dutchNationalFlagSort(vector<int> &arr) {

        // Pointer for the boundary where smallest values should be placed
        int left = 0;

        // Pointer for the current element being evaluated
        int mid = 0;

        // Pointer for the boundary where largest values should be placed
        int right = arr.size() - 1;

        while (mid <= right) {

            // If the current element belongs to the smallest category
            if (arr[mid] == 0) {

                // Swap it with the element at the left boundary
                swap(arr[mid], arr[left]);

                // Expand mid forward
                mid++;

                // Expand left forward
                left++;
            }
            
            // If the current element belongs to the middle category
            else if (arr[mid] == 1) {

                // No swap needed — just move mid forward
                mid++;
            }
            
            // If the current element belongs to the largest category
            else {

                // Swap it with the element at the right boundary
                swap(arr[mid], arr[right]);

                // Shrink the right boundary — do NOT move mid yet
                right--;
            }
        }
    }
};
```
