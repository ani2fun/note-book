# Understanding the problem

Even after learning about binary search, there are situations where simply finding a target value is not enough. Sometimes, we need to locate a specific position, for example, the first occurrence of a value in a sorted list, which binary search alone does not directly provide. To see why this can be a problem, let’s look at an example.

## Example

Imagine you are a school teacher with a sorted list of thousands of students. Several students scored `85` marks, and you want to identify the student who appears **first in the list** with that score.

// Diagram: Find the first occurrence of score 85

Using a standard binary search, you can quickly locate a student with `85` marks, but there is no guarantee it will be the first. Binary search stops when it finds the target value. You could land somewhere in the middle of all the `85s`, missing the student at the beginning of that range.

## Limitations of binary search

While binary search is highly efficient at finding a target value, it does not guarantee that the returned position is the first occurrence in a sorted list. In our student scores example, using binary search might quickly find a student with a score of 85, but that student could be anywhere in the group of students with the same score. If you need to identify the first student for ranking, reporting, or awarding purposes, standard binary search alone is insufficient.

// Diagram: Binary search may return any 85, not necessarily the first

To address these situations, we need an approach that efficiently locates the boundaries of a target value in a sorted dataset. This is where the lower bound comes into play. This technique extends binary search to find the first occurrence of a target value, making it an essential tool for handling repeated values in sorted collections.

***

# Exploring a possible solution

Now that we understand the limitations of standard binary search for locating the first occurrence of a value, we need a slightly refined approach. Simply finding any student with a score of `85` is not enough. We need to identify the first student with that score in the sorted list.

## Lower bound

The lower-bound algorithm is a popular variant of binary search. It aims to find the index of the first element in a sorted array **greater than or equal** to the **target**.

> -   If multiple values equal the target, it returns the index of the first occurrence
> -   If the target is not present, it returns the index of the smallest element greater than the target
> -   If no such element exists, it returns the size of the array.

Looking at the problem of finding the first student who scored `85` marks in a sorted list of results containing thousands of students. You begin by examining the middle score in the list.

// Diagram: Examine the score of the student at the middle of the list

If the middle score is **less** than `85`, the first `85` must be in the second half, so you discard the first half, including the middle score.

// Diagram: Discard the first half of the list (including the middle score)

If the middle score is **greater than or equal** to `85`, this position could be the first occurrence, but there may still be an earlier `85` in the list. To ensure we find the earliest position, we continue searching in the first half, keeping the middle position included in the search space, since it could be the first occurrence.

// Diagram: Discard the second half of the list (excluding the middle score)

This process is repeated, halving the remaining search range each time, until the search space cannot be divided further. At that point, the left boundary of the search range points to the first occurrence of `85` in the list.

// Diagram: Left boundary points to the first occurrence of the target score

By systematically narrowing the search while considering the possibility of earlier occurrences, this method finds the first `85` efficiently, even in a list of thousands of scores. It combines the speed of binary search with the precision needed to locate the lower bound of the target value.

> -   **Step 1**: Start with the full list of student scores included in the search.
> -   **Step 2**: Check the score at the midpoint of the list.
>     -   **Step 2.1**: If the middle score is less than `85`, for example, `78`, eliminate the middle position and all scores below it, then repeat Step 2 with the second half.
>     -   **Step 2.2**: If the middle score is greater than or equal to `85`, for example, `85` or `92`, keep the middle position in the search space and continue searching in the first half, since the first occurrence could be earlier in the list.
> -   **Step 3**: Repeat Step 2 until the search space cannot be divided further. The left boundary at this point points to the first element greater than or equal to `85`, which is the lower bound.

## Advantages

The lower bound algorithm builds on binary search to efficiently locate the first occurrence of a target value in a sorted array. Its advantages include:

> -   **Efficiency:** By halving the search space at each step, lower bound finds the first occurrence in **O(log N)** time, making it far faster than linear search for large datasets.
> -   **Precision:** Unlike standard binary search, lower bound guarantees the earliest position of the target, which is useful when multiple elements have the same value.
> -   **Versatility:** Lower bound can be used to identify insertion points, ranges of repeated elements, or boundaries in sorted arrays.

## Limitations

While powerful, the lower bound algorithm has some constraints:

> -   **Requires sorted array:** Lower bound only works correctly on arrays that are sorted in ascending order.
> -   **Limited to arrays:** It is designed for random-access structures like arrays and cannot be directly applied to linked lists or other non-contiguous data structures.
> -   **Single purpose:** Lower bound specifically finds the first occurrence or insertion point, so it does not directly identify the last occurrence or elements strictly greater than the target (for that, upper bound is needed).

***

# Understanding lower bound algorithm

The strategy from the earlier example could be used to create an algorithm. To explain this algorithm, we will take an array sorted in ascending order and try to find the lower bound for a target number.

## Algorithm

The lower-bound algorithm finds the first position in a sorted array where a given target value can be inserted without violating the sorted order. In other words, it returns the index of the first element that is greater than or equal to the target value. The algorithm begins by initialising two indices that define the current search range in which the lower-bound may exist.

> -   `low` is set to the first index of the array i.e `0`.
> -   `high` is set to the last index of the array i.e `arr.size()` (one position past the last valid index).

These indices define a **half-open** search range `[low, high)`, where `low` is inclusive and `high` is exclusive.

**Why is `high` initialized to the array size?**

Using `high = arr.size()` allows the algorithm to naturally handle cases where the target value is larger than all elements in the array. In such cases, the lower bound is the end of the array, which is a valid insertion position.

// Diagram: Initialize the low and high indices

The algorithm enters a loop that continues as long as `low < high`. This condition ensures that there is still at least one possible position where the lower bound could exist.

**Why** **do we continue while `low < high` and not** `low <= high` **?**

In lower bound, we use `low < high` because the search range is treated as a half-open interval `[low, high)`. The loop continues narrowing the range until `low == high`, which directly gives the correct insertion index for the target. Using `low <= high` could overrun the array since `high` can initially be `arr.size()`. In contrast, standard binary search uses `low <= high` because it needs to examine every element to find an exact match.

// Diagram: The loop terminates when the low index equals the high index

Inside the loop, the middle index is calculated as:

> -   `mid = low + (high - low ) / 2`

**Why is the middle index calculated as** `mid = low + (high - low) / 2` **instead of** mid = (low + high) / 2 ?

When calculating the middle of a range, `mid = low + (high - low) / 2` is preferred over `mid = (low + high) / 2` because directly adding `low` and `high` can overflow the integer range when they are large, while computing the difference first keeps the value safe and then adds it back to low without overflow

// Diagram: Compute the middle index using the formula

Based on the value of `arr[mid]`, the algorithm makes one of three possible decisions.

### 1\. arr\[mid\] < target

If the middle element is **less** than the target, all elements up to and including `mid` are smaller than the target and can be skipped. The algorithm therefore narrows the search to the right half of the array by updating `low = mid + 1`, efficiently eliminating elements that cannot contain the target.

// Diagram: Discard the first half of the array, including the middle element

### 2\. arr\[mid\] >= target

If the middle element is **greater than or equal** to the target, `mid` could be a valid lower bound, but there may be an earlier occurrence of the target. To ensure no potential candidate is skipped, the algorithm narrows the search to the left half by updating `high = mid`, keeping mid in the search range.

// Diagram: Discard the second half of the array, excluding the middle element

The algorithm repeatedly narrows the search space until it identifies the lower bound. The loop terminates when `low == high`, at which point the search range has been reduced to a single position, representing the lower bound. 

## Possbile results of lower bound

The lower bound search returns the first position in a sorted array where the target could be inserted without violating the order. Depending on the array and the target, there are three main types of outcomes:

### 1\. First occurance of target

If the target is present in the array, the lower bound points to the first occurrence of that element. This ensures that even if multiple elements in the array have the same value, the algorithm identifies the earliest position where the target appears

// Diagram: The low index points to the first occurrence of the target element

### 2\. First element larger than target

If the target is not present in the array but is smaller than some of the existing elements, the lower bound will point to the first element that is greater than the target. This provides the position where the target could be inserted while maintaining the array’s sorted order.

// Diagram: The low index points to the first element greater than the target

### 3\. End of the array

If the target is larger than all existing elements in the array, the lower bound will point to the end of the array, which corresponds to an index equal to the array’s size. This indicates that the target would be inserted at the very end to maintain the sorted order.

// Diagram: The low index points to the end of the array

> **Algorithm**
>
> -   **Step 1:** Initialize search boundaries, set `low = 0`, `high = arr.size() `
> -   **Step 2:** Iterate while `low < high`
>     -   **Step 2.1:** Calculate middle index `mid = low + (high - low) / 2`
>     -   **Step 2.2:** If `arr\[mid\] < target`:
>         -   **Step 2.2.1:** Set `low = mid + 1`
>     -   **Step 2.3:** Else:
>         -   **Step 2.3.1:** Set `high = mid`
> -   **Step 3:** Return `low`

## Implementation

The lower bound can be implemented by slightly modifying the standard binary search algorithm. By adjusting how the search space is updated, keeping the middle element when it is greater than or equal to the target and moving left or right accordingly, we can efficiently locate the first occurrence of a target value or the position where it could be inserted.

C++

```cpp
using namespace std;

class Solution {
public:
    int lowerBound(vector<int> &arr, int target) {

        // Initialise starting index to 0
        int low = 0;

        // Initialise ending index to arr.size() instead of arr.size() -
        // 1 to cover the entire array as if all elements in the array
        // are less than target, the lower bound index would be equal to
        // arr.size()
        int high = arr.size();

        // 'high' is exclusive (can be arr.size()), so we use 'low <
        // high' instead of 'low <= high'. This loop finds the first
        // index where the element is
        // >= the target without going out of bounds.
        while (low < high) {

            // Find the middle index
            int mid = low + (high - low) / 2;

            // If arr[mid] is less than arr[target], then find in
            // right subarray
            if (arr[mid] < target) {
                low = mid + 1;
            }

            // If arr[mid] is greater than or equal to target, then it
            // may be the answer. So, instead of high = mid - 1, we do
            // high = mid to include mid in the next search space
            else {
                high = mid;
            }

        // Return the lower bound index, it could be equal to arr.size()
        // if all elements are less than target
        return low;
    }
};
```

Java

```java
class Solution {
    public int lowerBound(int[] arr, int target) {

        // Initialise starting index to 0
        int low = 0;

        // Initialise ending index to arr.length instead of arr.length -
        // 1 to cover the entire array as if all elements in the array
        // are less than target, the lower bound index would be equal to
        // arr.length
        int high = arr.length;

        // 'high' is exclusive (can be arr.length), so we use 'low <
        // high' instead of 'low <= high'. This loop finds the first
        // index where the element is
        // >= the target without going out of bounds.
        while (low < high) {

            // Find the middle index
            int mid = low + (high - low) / 2;

            // If arr[mid] is less than arr[target], then find in
            // right subarray
            if (arr[mid] < target) {
                low = mid + 1;
            }

            // If arr[mid] is greater than or equal to target, then it
            // may be the answer. So, instead of high = mid - 1, we do
            // high = mid to include mid in the next search space
            else {
                high = mid;
            }

        // Return the lower bound index, it could be equal to arr.length
        // if all elements are less than target
        return low;
    }
```

Typescript

```typescript
export class Solution {
    lowerBound(arr: number[], target: number): number {

        // Initialise starting index to 0
        let low = 0;

        // Initialise ending index to arr.length instead of arr.length -
        // 1 to cover the entire array as if all elements in the array
        // are less than target, the lower bound index would be equal to
        // arr.length
        let high = arr.length;

        // 'high' is exclusive (can be arr.length), so we use 'low <
        // high' instead of 'low <= high'. This loop finds the first
        // index where the element is
        // >= the target without going out of bounds.
        while (low < high) {

            // Find the middle index
            const mid: number = low + Math.floor((high - low) / 2);

            // If arr[mid] is less than arr[target], then find in
            // right subarray
            if (arr[mid] < target) {
                low = mid + 1;
            }

            // If arr[mid] is greater than or equal to target, then it
            // may be the answer. So, instead of high = mid - 1, we do
            // high = mid to include mid in the next search space
            else {
                high = mid;
            }

        // Return the lower bound index, it could be equal to arr.length
        // if all elements are less than target
        return low;
    }
```

Javascript

```javascript
export class Solution {
    lowerBound(arr, target) {

        // Initialise starting index to 0
        let low = 0;

        // Initialise ending index to arr.length instead of arr.length -
        // 1 to cover the entire array as if all elements in the array
        // are less than target, the lower bound index would be equal to
        // arr.length
        let high = arr.length;

        // 'high' is exclusive (can be arr.length), so we use 'low <
        // high' instead of 'low <= high'. This loop finds the first
        // index where the element is
        // >= the target without going out of bounds.
        while (low < high) {

            // Find the middle index
            const mid = low + Math.floor((high - low) / 2);

            // If arr[mid] is less than arr[target], then find in
            // right subarray
```

Python

```python
from typing import List

class Solution:
    def lower_bound(self, arr: List[int], target: int) -> int:

        # Initialise starting index to 0
        low: int = 0

        # Initialise ending index to len(arr) instead of len(arr) - 1
        # to cover the entire array as if all elements in the array are less
        # than target, the lower bound index would be equal to len(arr)
        high: int = len(arr)

        # 'high' is exclusive (can be len(arr)), so we use 'low < high' instead
        # of 'low <= high'. This loop finds the first index where the element is
        # >= the target without going out of bounds.
        while low < high:

            # Find the middle index
            mid: int = low + (high - low) // 2

            # If arr[mid] is less than arr[target], then find in
            # right subarray
            if arr[mid] < target:
                low = mid + 1

            # If arr[mid] is greater than or equal to target, then it may
            # be the answer. So, instead of high = mid - 1, we do high = mid
            # to include mid in the next search space
            else:
                high = mid

        # Return the lower bound index, it could be equal to len(arr)
        # if all elements are less than target
        return low
```

## Complexity analysis

The lower bound's time complexity is the same as binary search: **O(logN)**, where **N** is the number of elements in the array. This time complexity arises because the lower-bound algorithm, like binary search, divides the search interval in half at each step.

Since the algorithm does not allocate any new memory during the search, the space complexity is constant, i.e., **O(1)**.

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
> **Worst case -**
>
> -   Space complexity - **O(1)**
> -   Time complexity: **O(logN)**

***

# Lower bound

## Problem Statement

Given an integer array **arr** that is sorted in ascending order and an integer **target**, write a function to search and return the index of the **lower bound** of the target in the array. 

[Lower bound](https://cplusplus.com/reference/algorithm/lower_bound/) returns the index of the first element **≥** target. If multiple values are equal to the target, the lower bound returns the index of the first such value. You must do this in a time complexity of `O(logN)`.

### Example 1

> -   **Input:** arr = \[1, 5, 10, 15, 20, 25\], target = 10
> -   **Output:** 2
> -   **Explanation:** The integer 10 is at index 2 in the array and is the lower bound.

### Example 2

> -   **Input:** arr = \[1, 5, 10, 15, 20, 25\], target = 17
> -   **Output:** 4
> -   **Explanation:** The integer 20 at index 4 is the lower bound for 17 in the array.

### Example 3

> -   **Input:** arr = \[1, 5, 10, 15, 20, 25\], target = 22
> -   **Output:** 5
> -   **Explanation:** The integer 25 at index 5 is the lower bound for 22 in the array.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int lowerBound(vector<int> &arr, int target) {

        // Initialise starting index to 0
        int low = 0;

        // Initialise ending index to arr.size() instead of arr.size() -
        // 1 to cover the entire array as if all elements in the array
        // are less than target, the lower bound index would be equal to
        // arr.size()
        int high = arr.size();

        // 'high' is exclusive (can be arr.size()), so we use 'low <
        // high' instead of 'low <= high'. This loop finds the first
        // index where the element is
        // >= the target without going out of bounds.
        while (low < high) {

            // Find the middle index
            int mid = low + (high - low) / 2;

            // If arr[mid] is less than arr[target], then find in
            // right subarray
            if (arr[mid] < target) {
                low = mid + 1;
            }

            // If arr[mid] is greater than or equal to target, then it
            // may be the answer. So, instead of high = mid - 1, we do
            // high = mid to include mid in the next search space
            else {
                high = mid;
            }
        }

        // Return the lower bound index, it could be equal to arr.size()
        // if all elements are less than target
        return low;
    }
};
```
