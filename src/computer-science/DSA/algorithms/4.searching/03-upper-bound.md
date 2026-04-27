# Understanding the problem

Even after learning about binary search and lower bound, there are situations where locating the first occurrence of a value is not enough. Sometimes we need to find the last occurrence of a value in a sorted list, which neither standard binary search nor lower-bound directly provides.

## Example

Imagine you are a school teacher with a sorted list of thousands of students. Several students scored `85` marks, and you want to identify the student who scored just higher than `85`, i.e., the first student in the list with a score strictly greater than `85`.

// Diagram: Find the first score strictly greater than 85

Using standard binary search or lower bound, you can quickly locate a student with `85` marks or even the first occurrence of `85`. However, neither method guarantees that you will find the student who scored immediately above `85`.

## Limitations of lower bound

Lower bound is good at finding the first occurrence of the target, which is useful when multiple students have the same score. However, lower bound does not provide the position of the first element strictly greater than the target. In other words, it only guarantees the start of the target’s range, leaving the upper boundary unknown.

// Diagram: Lower bound points to the first 85, not the next greater element

This is where upper bound comes in. The upper bound identifies the first element strictly greater than the target.

***

# Exploring a possible solution

Now that we understand the limitations of standard binary search and the lower bound, we need a slightly refined approach to find the first element strictly greater than a target value. Simply finding a student with a score of `85` or even the first `85` is not enough when we want to determine the next higher score in the sorted list.

## Upper bound

Similar to the lower-bound algorithm, the upper-bound algorithm is another popular variation of binary search. It aims to find the index of the first element in a sorted array that is **strictly greater** than the **target**. 

> -   If no value greater than the target is present, it returns the size of the array

Looking at the problem of finding the first student who scored greater than `85` marks in a sorted list of results containing thousands of students. You begin by examining the middle score in the list.

// Diagram: Examine the score of the student at the middle of the list

If the middle score is **less than or equal** to `85`, the first score strictly greater than `85` must be in the second half, so you discard the first half, including the middle score.

// Diagram: Discard the first half of the list (including the middle score)

If the middle score is **greater** than `85`, this position could be the first element strictly greater than `85`, but there may still be an earlier one in the list. To ensure we find the earliest such score, we continue searching in the first half, keeping the middle position included in the search space, since it could be the correct upper bound.

// Diagram: Discard the second half of the list (excluding the middle score)

This process is repeated, halving the remaining search range each time, until the search space cannot be divided further. At that point, the left boundary of the search range points to the first element strictly greater than `85` in the list.

// Diagram: Left boundary points to the first score greater than the target

By systematically narrowing the search while accounting for the possibility that earlier elements exceed the target, this method efficiently identifies the first score strictly greater than `85`, even in a list of thousands of scores. It combines the speed of binary search with the precision needed to locate the upper bound of the target value.

> -   **Step 1:** Start with the full list of student scores included in the search.
> -   **Step 2:** Check the score at the midpoint of the current search range.
>     -   **Step 2.1:** If the middle score is less than or equal to `85`, for example, `78` or `85`, eliminate the middle position and all scores below it, then continue searching in the second half, since the first element strictly greater than 85 must be higher up.
>     -   **Step 2.2:** If the middle score is greater than `85`, for example, `92`, keep the middle position in the search space and continue searching in the first half, because this could be the first element strictly greater than `85`.
> -   **Step 3:** Repeat Step 2 until the search space cannot be divided further. The left boundary at this point points to the first element strictly greater than `85`, which is the upper bound.

## Advantages

The upper bound extends binary search to efficiently find the first element in a sorted array that is strictly greater than a target. Its main advantages include:

> -   **Efficiency:** By halving the search space at each step, upper bound can locate the first element greater than the target in **O(log N)** time, which is much faster than linear search for large datasets.
> -   **Precision:** Unlike standard binary search, upper bound guarantees the earliest position of an element greater than the target, which is useful when multiple elements exceed the target.
> -   **Versatility:** Upper bound can identify insertion points, boundaries of ranges, or the next higher value in sorted arrays, making it useful in ranking, grade thresholds, or interval computations.

## Limitations

While powerful, the upper bound algorithm has some constraints:

> -   **Requires sorted array:** Upper bound only works correctly on arrays sorted in ascending order.
> -   **Limited to arrays:** It is designed for random-access structures like arrays and cannot be directly applied to linked lists or other non-contiguous data structures.
> -   **Single purpose:** Upper bound specifically finds the first element strictly greater than the target, so it does not directly find the first occurrence of the target itself (for that, lower bound is needed).

***

# Understanding upper bound algorithm

The strategy from the earlier example could be used to create an algorithm. To explain this algorithm, we will use an array sorted in ascending order and find the upper bound of a target number.

## Algorithm

The upper-bound algorithm is used to find the first position in a sorted array where a given target value can be exceeded. In other words, it returns the index of the first element that is strictly greater than the target value. This is useful for insertion, range queries, and counting elements greater than a value. The algorithm begins by initializing two indices that define the current search range in which the upper-bound may exist.

> -   `low` is set to the first index of the array i.e `0`.
> -   `high` is set to the last index of the array i.e `arr.size()` (one position past the last valid index).

These indices define a **half-open** search range `[low, high)`, where `low` is inclusive and `high` is exclusive.

**Why is `high` initialized to the array size?**

Using `high = arr.size()` allows the algorithm to handle cases where the target value is greater than all elements in the array. In such cases, the upper bound is the end of the array, which represents the position immediately after the last occurrence of the target and is a valid insertion point to maintain the sorted order.

// Diagram: Initialize the low and high indices

The algorithm enters a loop that continues as long as `low < high`. This condition ensures that there is still at least one possible position where the lower bound could exist.

**Why** **do we continue while `low < high` and not** `low <= high` **?**

In upper bound, we also use `low < high` because the search range is treated as a **half-open** interval `[low, high)`. The loop continues narrowing the range until `low == high`, which gives the correct position immediately after the last occurrence of the target. Using `low <= high` could overrun the array since high is initially set to `arr.size()`. Unlike standard binary search, upper bound does not need to examine every element, only the position where the target could be inserted to maintain the sorted order.

// Diagram: The loop terminates when the low index equals the high index

Inside the loop, the middle index is calculated as:

> -   `mid = low + (high - low ) / 2`

**Why is the middle index calculated as** `mid = low + (high - low) / 2` **instead of** mid = (low + high) / 2 ?

When calculating the middle of a range, `mid = low + (high - low) / 2` is preferred over `mid = (low + high) / 2` because directly adding `low` and `high` can overflow the integer range when they are large, while computing the difference first keeps the value safe and then adds it back to low without overflow

// Diagram: Compute the middle index using the formula

Based on the value of `arr[mid]`, the algorithm makes one of three possible decisions.

### 1\. arr\[mid\] <= target

If the middle element is **less than or equal** to the target, all elements up to and including `mid` are less than or equal to the target and can be skipped. The algorithm therefore narrows the search to the right half of the array by updating `low = mid + 1`, efficiently eliminating positions that cannot be the upper bound.

// Diagram: Discard the first half of the array, including the middle element

### 2\. arr\[mid\] > target

If the middle element is **greater** than the target, `mid` could be a valid upper bound, but there may be an earlier position that also satisfies this condition. To ensure no potential candidate is skipped, the algorithm narrows the search to the left half by updating `high = mid`, keeping mid in the search range.

// Diagram: Discard the second half of the array, excluding the middle element

The algorithm repeatedly narrows the search space until it identifies the upper bound. The loop terminates when `low == high`, at which point the search range has been reduced to a single position, representing the upper bound. 

## Possbile results of upper bound

The upper-bound search returns the index of the first element in a sorted array that is strictly greater than the target. Depending on the array and the target, there are two main types of outcomes:

### 1\. First greater element

If an element strictly greater than the target exists in the array, the upper bound points to the first occurrence of that element. This ensures that even if multiple elements are greater than the target, the algorithm identifies the earliest position where a value exceeds the target.

// Diagram: The low index points to the first element greater than the target

### 2\. End of the array

If the target is larger than all existing elements in the array, the upper bound will point to the end of the array, which corresponds to an index equal to the array’s size. This indicates that there is no element strictly greater than the target, and the target would effectively be positioned at the very end if inserted while maintaining the sorted order.

// Diagram: The low index points to the end of the array

> **Algorithm**
>
> -   **Step 1:** Initialize search boundaries, set `low = 0`, `high = arr.size() `
> -   **Step 2:** Iterate while `low < high`
>     -   **Step 2.1:** Calculate middle index `mid = low + (high - low) / 2`
>     -   **Step 2.2:** If `arr\[mid\] <= target`:
>         -   **Step 2.2.1:** Set `low = mid + 1`
>     -   **Step 2.3:** Else:
>         -   **Step 2.3.1:** Set `high = mid`
> -   **Step 3:** Return `low`

## Implementation

The upper bound can be implemented by slightly modifying the standard binary search algorithm. By adjusting how the search space is updated, keeping the middle element when it is greater than the target and moving left or right accordingly, we can efficiently locate the first element strictly greater than the target or determine the position where such an element could be inserted.

C++

```cpp
using namespace std;

class Solution {
public:
    int upperBound(vector<int> &arr, int target) {

        // Initialise starting index to 0
        int low = 0;

        // Initialise ending index to arr.size() instead of arr.size() -
        // 1 to cover the entire array as if all elements in the array
        // are less than target, the upper bound index would be equal to
        // arr.size()
        int high = arr.size();

        // 'high' is exclusive (can be arr.size()), so we use 'low <
        // high' instead of 'low <= high'. This loop finds the first
        // index where the element is > the target without going out of
        // bounds.
        while (low < high) {

            // Find the middle index
            int mid = low + (high - low) / 2;

            // If arr[mid] is less than or equal to target, then find
            // in the right subarray
            if (arr[mid] <= target) {
                low = mid + 1;
            }

            // If arr[mid] is greater than the target, then it may be the
            // answer. So, instead of high = mid - 1, we do high = mid to
            // include mid in the next search space
            else {
                high = mid;
            }

        // Return the upper bound index, it could be equal to arr.size()
        // if all elements are less than target
        return low;
    }
};
```

Java

```java
class Solution {
    public int upperBound(int[] arr, int target) {

        // Initialise starting index to 0
        int low = 0;

        // Initialise ending index to arr.length instead of arr.length -
        // 1 to cover the entire array as if all elements in the array
        // are less than target, the upper bound index would be equal to
        // arr.length
        int high = arr.length;

        // 'high' is exclusive (can be arr.length), so we use 'low <
        // high' instead of 'low <= high'. This loop finds the first
        // index where the element is > the target without going out of
        // bounds.
        while (low < high) {

            // Find the middle index
            int mid = low + (high - low) / 2;

            // If arr[mid] is less than or equal to target, then find
            // in the right subarray
            if (arr[mid] <= target) {
                low = mid + 1;
            }

            // If arr[mid] is greater than the target, then it may be the
            // answer. So, instead of high = mid - 1, we do high = mid to
            // include mid in the next search space
            else {
                high = mid;
            }

        // Return the upper bound index, it could be equal to arr.length
        // if all elements are less than target
        return low;
    }
```

Typescript

```typescript
export class Solution {
    upperBound(arr: number[], target: number): number {

        // Initialise starting index to 0
        let low = 0;

        // Initialise ending index to arr.length instead of arr.length -
        // 1 to cover the entire array as if all elements in the array
        // are less than target, the upper bound index would be equal to
        // arr.length
        let high = arr.length;

        // 'high' is exclusive (can be arr.length), so we use 'low <
        // high' instead of 'low <= high'. This loop finds the first
        // index where the element is > the target without going out of
        // bounds.
        while (low < high) {

            // Find the middle index
            const mid: number = low + Math.floor((high - low) / 2);

            // If arr[mid] is less than or equal to target, then find
            // in the right subarray
            if (arr[mid] <= target) {
                low = mid + 1;
            }

            // If arr[mid] is greater than the target, then it may be the
            // answer. So, instead of high = mid - 1, we do high = mid to
            // include mid in the next search space
            else {
                high = mid;
            }

        // Return the upper bound index, it could be equal to arr.length
        // if all elements are less than target
        return low;
    }
```

Javascript

```javascript
export class Solution {
    upperBound(arr, target) {

        // Initialise starting index to 0
        let low = 0;

        // Initialise ending index to arr.length instead of arr.length -
        // 1 to cover the entire array as if all elements in the array
        // are less than target, the upper bound index would be equal to
        // arr.length
        let high = arr.length;

        // 'high' is exclusive (can be arr.length), so we use 'low <
        // high' instead of 'low <= high'. This loop finds the first
        // index where the element is > the target without going out of
        // bounds.
        while (low < high) {

            // Find the middle index
            const mid = low + Math.floor((high - low) / 2);

            // If arr[mid] is less than or equal to target, then find
            // in the right subarray
```

Python

```python
from typing import List

class Solution:
    def upper_bound(self, arr: List[int], target: int) -> int:

        # Initialise starting index to 0
        low: int = 0

        # Initialise ending index to len(arr) instead of len(arr) - 1
        # to cover the entire array as if all elements in the array are less
        # than target, the upper bound index would be equal to len(arr)
        high: int = len(arr)

        # 'high' is exclusive (can be len(arr)), so we use 'low < high' instead
        # of 'low <= high'. This loop finds the first index where the element is
        # > the target without going out of bounds.
        while low < high:

            # Find the middle index
            mid: int = low + (high - low) // 2

            # If arr[mid] is less than or equal to target, then find
            # in the right subarray
            if arr[mid] <= target:
                low = mid + 1

            # If arr[mid] is greater than the target, then it may be the answer.
            # So, instead of high = mid - 1, we do high = mid to include mid in
            # the next search space
            else:
                high = mid

        # Return the upper bound index, it could be equal to arr.length
        # if all elements are less than target
        return low
```

## Complexity analysis

The upper bound of the time complexity is the same as binary search: **O(log N****)**, where **N** is the number of elements in the array. This time complexity arises because the upper-bound algorithm, like binary search, divides the search interval in half at each step.

Since the algorithm does not allocate any new memory to perform the search, the space complexity is constant, i.e. **O(1)**.

> **Best case**
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(logN)**
>
> **Average case**
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(logN)**
>
> **Worst case**
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(logN)**

***

# Upper bound

## Problem Statement

Given an integer array **arr** that is sorted in ascending order and an integer **target**, write a function to search and return the index of the **upper bound** of the target in the array. 

[Upper bound](https://cplusplus.com/reference/algorithm/upper_bound/) returns the index of the first element strictly **\>** target. You must do this in a time complexity of `O(logN)`.

### Example 1

> -   **Input:** arr = \[1, 5, 10, 15, 20, 25\], target = 10
> -   **Output:** 3
> -   **Explanation:** The integer 15 at index 3 is the upper bound of 10 in the array.

### Example 2

> -   **Input:** arr = \[1, 5, 10, 15, 20, 25\], target = 17
> -   **Output:** 4
> -   **Explanation:** The integer 20 at index 4 is the upper bound for 17 in the array.

### Example 3

> -   **Input:** arr = \[1, 5, 10, 15, 20, 25\], target = 25
> -   **Output:** 6
> -   **Explanation:** There is no upper bound for 25 in the array, so we return it to the end of the array.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int upperBound(vector<int> &arr, int target) {

        // Initialise starting index to 0
        int low = 0;

        // Initialise ending index to arr.size() instead of arr.size() -
        // 1 to cover the entire array as if all elements in the array
        // are less than target, the upper bound index would be equal to
        // arr.size()
        int high = arr.size();

        // 'high' is exclusive (can be arr.size()), so we use 'low <
        // high' instead of 'low <= high'. This loop finds the first
        // index where the element is > the target without going out of
        // bounds.
        while (low < high) {

            // Find the middle index
            int mid = low + (high - low) / 2;

            // If arr[mid] is less than or equal to target, then find
            // in the right subarray
            if (arr[mid] <= target) {
                low = mid + 1;
            }

            // If arr[mid] is greater than the target, then it may be the
            // answer. So, instead of high = mid - 1, we do high = mid to
            // include mid in the next search space
            else {
                high = mid;
            }
        }

        // Return the upper bound index, it could be equal to arr.size()
        // if all elements are less than target
        return low;
    }
};
```
