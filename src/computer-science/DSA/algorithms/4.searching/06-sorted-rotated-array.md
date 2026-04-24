# Understanding finding the minimum in a sorted rotated array

Binary search exponentially speeds up the search for values in a sequence by exploiting the order of items in it. There are many problems that may not be solvable by direct application of binary search, but by algorithms that use the same principle to reduce the size of the problem space by half in each iteration. One such problem is to find the minimum in a sorted rotated array.

A sorted rotated array is one where a sorted array is rotated in either direction by a certain number of times. The minimum item in a sorted rotated array is called the pivot item. Finding the minimum (pivot) item in a sorted rotated array is a classical problem that can be solved by exploiting the semi-sorted nature of the sequence. 

// Diagram: The minimum in a sorted rotated array.

### Finding the minimum in a sorted rotated array

It is easy to see that a sorted rotated array is made up of two sorted sequences that come one after the other. The minimum value in a sorted rotated array is also called its pivot item, and it is the first item in the second sorted sequence.

// Diagram: A sorted rotated array is made up of two sorted sequences, one after the other.

Given below is how the sorted rotated array from the example looks when its values are plotted on a Cartesian plane.

// Diagram: The array, when plotted on a Cartesian plane.

Since all the sorted rotated arrays have two sorted sequences arranged in the same way, we can leverage this information to devise an algorithm to find the minimum. Consider the example of a generic sorted rotated array mapped on a Cartesian plane, given below. We will use this generic example to devise the minimum-finding algorithm.

// Diagram: Representation of a generic sorted rotated array on a Cartesian plane.

We start by creating two variables `low` and `high` and initializing them with the two ends of the array, and maintaining the following invariant:

// Diagram: Invariant: The minimum value is always between low and high and low <= high

Note that the initial values of `low` and `high` satisfies the invariant.

// Diagram: Start by setting low and high to the boundaries of the array.

We then iterate until `low < high`, and in each iteration, we find the midpoint of the search space in `mid` and use it to reduce the size of the search space in a way that the invariant is maintained. Every time we find `mid`, it can fall in either the first or the second sorted sequence of the array. And so, there are two cases that we need to consider in each iteration:

#### 1\. arr\[mid\] > arr\[high\]

This can only happen if `mid` is in the first sorted sequence and `high` is in the second sorted sequence, respectively. Because for all other cases, `arr[mid]` will be less than or equal to `arr[high]`.

// Diagram: This case is only possible if mid is in the first sequence and high is in the second sequence.

Since we know the minimum is in between `mid` and `high` (second sorted sequence), we discard the left half of the search (between `low` and `mid`) by setting `low = mid + 1` and preserve the invariant for the next iteration.

// Diagram: We set low to mid + 1 to discard the half including and before mid.

#### 2\. arr\[mid\] <= arr\[high\]

This can only happen if both `mid` and `high` either fall in the first or the second sorted sequence.

// Diagram: This can happen when both mid and high fall in the same sorted sequence.

However, since we maintain the invariant that the minimum will always be between `low` and `high`, and we know that the minimum is the first item in the **second** sorted sequence. This means `high` can never be in the first sorted sequence, as it will invalidate the invariant. And so, we can only hit this case, if `mid` is in the second sorted sequence.

// Diagram: We will only hit this case if both mid and high are in the second sorted sequence.

In this case, the array between `mid` and `high` is guaranteed to be sorted, and so, the minimum is guaranteed **not** to be after `mid`. We discard the right half of the search space (between `mid` and `high`) by setting `high` to `mid`. We set `high` to `mid` as `mid` Itself could be the minimum. This way, we preserve the invariant for the next iteration.

// Diagram: We set high to mid to discard the half after mid.

At the end of all iterations, when `low` becomes equal to `high`, the item at low is the minimum in the sorted rotated array.

Since the invariant holds true at the beginning and is preserved through all iterations, we are guaranteed to find the minimum item at the end of all iterations.

## Algorithm

The steps below combine all the cases using conditional statements and outline the algorithm to find the minimum in a sorted rotated array.

> **minimumInRotatedSortedArray(arr, target)**
>
> -   **Step 1:** Set \`low\` = 0
> -   **Step 2:** Set \`high\` = size of \`arr\` - 1
> -   **Step 3:** Iterate while \`low\` < \`high\` and do the following:
>     -   **Step 3.1:** Set \`mid\` = \`low\` + (\`high\` - \`low\`) / 2
>     -   **Step 3.2:** If \`arr\[mid\]\` > \`arr\[high\]\`, set \`low\` = \`mid\` + 1
>     -   **Step 3.3:** Otherwise, set \`high\` = \`mid\`
> -   **Step 4:** Return \`low\`

Given below is the execution of the algorithm to find the minimum in a sorted rotated array.

// Diagram: Find the minimum in a sorted rotated array

## Implementation

Given below is the implementation to find the minimum in a sorted rotated array.

C++

```cpp
using namespace std;

class Solution {
public:
    int rotatedArrayMinimum(vector<int> &arr) {
        int low = 0;
        int high = arr.size() - 1;

        // Perform binary search until low becomes equal to high
        while (low < high) {
            int mid = low + (high - low) / 2;

            // If the middle element is greater than the element at high
            // index, it means the minimum element lies in the right part
            // of the array.
            if (arr[mid] > arr[high]) {
                low = mid + 1;
            }

            // Otherwise, the minimum element lies in the left part of
            // the array.
            else {
                high = mid;
            }

        // Return the index of the minimum element
        return low;
    }
};
```

Java

```java
class Solution {
    public int rotatedArrayMinimum(int[] arr) {
        int low = 0;
        int high = arr.length - 1;

        // Perform binary search until low becomes equal to high
        while (low < high) {
            int mid = low + (high - low) / 2;

            // If the middle element is greater than the element at high
            // index, it means the minimum element lies in the right part
            // of the array.
            if (arr[mid] > arr[high]) {
                low = mid + 1;
            }

            // Otherwise, the minimum element lies in the left part of
            // the array.
            else {
                high = mid;
            }

        // Return the index of the minimum element
        return low;
    }
```

Typescript

```typescript
export class Solution {
    rotatedArrayMinimum(arr: number[]): number {
        let low: number = 0;
        let high: number = arr.length - 1;

        // Perform binary search until low becomes equal to high
        while (low < high) {
            const mid: number = low + Math.floor((high - low) / 2);

            // If the middle element is greater than the element at high
            // index, it means the minimum element lies in the right part
            // of the array.
            if (arr[mid] > arr[high]) {
                low = mid + 1;
            }

            // Otherwise, the minimum element lies in the left part of
            // the array.
            else {
                high = mid;
            }

        // Return the index of the minimum element
        return low;
    }
```

Javascript

```javascript
export class Solution {
    rotatedArrayMinimum(arr) {
        let low = 0;
        let high = arr.length - 1;

        // Perform binary search until low becomes equal to high
        while (low < high) {
            const mid = low + Math.floor((high - low) / 2);

            // If the middle element is greater than the element at high
            // index, it means the minimum element lies in the right part
            // of the array.
            if (arr[mid] > arr[high]) {
                low = mid + 1;
            }

            // Otherwise, the minimum element lies in the left part of
            // the array.
            else {
                high = mid;
            }

        // Return the index of the minimum element
        return low;
    }
```

Python

```python
from typing import List

class Solution:
    def rotated_array_minimum(self, arr: List[int]) -> int:
        low: int = 0
        high: int = len(arr) - 1

        # Perform binary search until low becomes equal to high
        while low < high:
            mid: int = low + (high - low) // 2

            # If the middle element is greater than the element at high
            # index, it means the minimum element lies in the right part
            # of the array.
            if arr[mid] > arr[high]:
                low = mid + 1

            # Otherwise, the minimum element lies in the left part of the
            # array.
            else:
                high = mid

        # Return the index of the minimum element
        return low
```

## Complexity Analysis

The algorithm's time and space complexity are easy to understand. We have the two variables `low` and `high` that hold the start and end of the current search space, respectively, and in each iteration, we reduce the size of the search space by half. If we assume that the initial size of the problem space is **N**, the time complexity in any case is **O(log(N))**.

Since we don't create only a fixed number of extra variables during the execution of the algorithm, the space complexity **O(1)** is constant in any case.

> **Any case -**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(log(N))**

***

# Rotated array minimum

## Problem Statement

Given an integer array **arr** that **contains distinct elements** and is sorted in ascending order, write a function to find the index of the minimum element in the array. 

The array, however, has been rotated along an unknown pivot k, such that it has now become `[arr[k], arr[k+1], ..., arr[n-1], arr[0], arr[1], ..., arr[k-1]`. For e.g an array `[1, 2, 3, 4, 5]` when rotated at a pivot index 2 becomes `[3, 4, 5, 1, 2]`.

You must do this in a time complexity of `O(logN)`.

### Example 1

> -   **Input:** arr = \[4, 5, 6, 1, 2, 3\]
> -   **Output:** 3
> -   **Explanation:** The minimum element is 1, which is at index 3.

### Example 2

> -   **Input:** arr = \[5, 6, 1, 2, 3, 4\]
> -   **Output:** 2
> -   **Explanation:** The minimum element is 1, which is at index 2.

### Example 3

> -   **Input:** arr = \[6, 7, 2, 3, 4, 5\]
> -   **Output:** 2
> -   **Explanation:** The minimum element is 2, which is at index 2.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int rotatedArrayMinimum(vector<int> &arr) {
        int low = 0;
        int high = arr.size() - 1;

        // Perform binary search until low becomes equal to high
        while (low < high) {
            int mid = low + (high - low) / 2;

            // If the middle element is greater than the element at high
            // index, it means the minimum element lies in the right part
            // of the array.
            if (arr[mid] > arr[high]) {
                low = mid + 1;
            }

            // Otherwise, the minimum element lies in the left part of
            // the array.
            else {
                high = mid;
            }
        }

        // Return the index of the minimum element
        return low;
    }
};
```

***

# Understanding searching in a sorted rotated array

Binary search to find a target value in a sorted array is an exponentially fast algorithm that only works on sorted arrays. However, we can also search for a target item in a sorted rotated array using the same underlying principle as binary search, exploiting its semi-sorted nature. As we will see later, this semi-sorted structure allows us to discard one half of the search space in each iteration until we find the target value.

A sorted rotated array is one where a sorted array is rotated in either direction by a certain number of times. While the array is no longer sorted, we can still efficiently search for items in such arrays using the sorted rotated search algorithm.

// Diagram: Find if the given target exists in the sorted rotated array.

## The sorted rotated search algorithm

Consider a sorted array `arr` that is rotated an unknown number of times in either (left or right) direction, and we need to find if a value `target` exits in the array.

// Diagram: Find if the given target exists in the sorted rotated array.

Every sorted rotated array of size `n` has a pivot index `p` where `arr[p]` is  the **minimum** item in the array.

// Diagram: The pivot index is the index in the array that has the minimum value item.

// Diagram: Every sorted rotated array has the following properties

1.  1`arr[0] <= arr[1] <= . . . . <= arr[p-1]`
2.  2`arr[p] <= arr[p+1] <= . . . . <= arr[n-1]`
3.  3`arr[j] < arr[i]` for all `i < p` and `j >=p`

Thus, the array consists of two sorted non-decreasing intervals, starting with the interval where all values are greater than the next interval.

// Diagram: A sorted rotated array contains two sorted sequences, one after the other, starting with the higher value sequence.

Consider the example of a generic sorted rotated array mapped on a Cartesian plane, given below. We will use this generic example to devise the search algorithm.

// Diagram: Representation of a generic sorted rotated array on a Cartesian plane.

It is important to note that if we take any two points `low` and `high` in the array and find a midpoint `mid`, at least one side of the midpoint is always sorted, i.e. either `arr[low] <=. . . <= arr[mid]` or `arr[mid] <= . . . <=arr[high]`.

This is because if low and high fall in the same sorted sequence, then the interval between low and high will be sorted, including the intervals between `low` and `mid` and `mid` and `high`. On the other hand, if `low` falls in the first sequence and `high` in the second sequence, `mid` will fall either in the first or second sequence, making the interval between `low` and `mid` sorted, or the interval between `mid` and `high` sorted, respectively.

Although the sequence is not monotonically increasing, we can devise an algorithm similar to binary search that reduces the search space in half in each iteration by leveraging this essential property of a sorted rotated array.

We start by creating two variables `low` and `high` and initializing them with the two ends of the array, and maintaining the following invariant:

**Invariant**

// Diagram: If the target exists in the array, it is always between low and high and low <= high

Note that the initial values of `low` and `high` satisfies the invariant.

// Diagram: Start by setting low and high to the boundaries of the array.

We then iterate until `low < high`, and in each iteration, we find the midpoint of the search space in `mid` and use it to reduce the size of the search space in a way that the invariant is maintained. Every time we find `mid`, we could hit one of the three cases as given below.

### 1\. The target is found at arr\[mid\]

If the item at `mid`is the target value, we can terminate further search as we have found the target item and return the index`mid`.

// Diagram: If the item at mid is the target value, return mid.

### 2\. The left half is sorted arr\[low\] <= arr\[mid\]

In this case, the sequence between `low` and `mid` is guaranteed to be non-decreasing, while the sequence between `mid` and `high` may or may not be.

// Diagram: In this case, the sequence between low and mid is guaranteed to be sorted.

There can be three further subcases in this case, as given below.

#### 2.1 arr\[low\] <= target < arr\[mid\]

Since the sequence between `low` and `mid` is sorted, if `arr[low]  <= target < arr[mid]`, it means `target`, if it exists, is somewhere in the left half of the search space defined by `low` and `high` i.e. between `low` and `mid` and so, the right half can be discarded.

// Diagram: If arr\[low\] <= target < arr\[mid\] it means that target is before mid.

And so, we set `high = mid - 1` to discard the right half, including `mid` and preserve the invariant for the next iteration.

// Diagram: We set high to mid - 1 to discard the half including and after mid.

#### 2.2 target > arr\[mid\]

Since the sequence between `low` and `mid` is sorted, if `target > arr[mid]` it means `target` is **not** in the left half of the search space defined by `low` and `high` i.e. between `low` and `mid`, and so, if it exists at all, it must be in the right half.

// Diagram: If target > arr\[mid\], it means it is after mid in the search space.

We set `low = mid + 1` to discard the left half and preserve the invariant for the next iteration.

// Diagram: We set low to mid + 1 to discard the half including and before mid.

#### 2.3 target < arr\[low\]

Since the sequence between `low` and `mid` is sorted, if `target < arr[low]` it means `target` is must be before `low`. However, since our invariant states, `target`, if it exists is always between `low` and `high`, and since we maintain the invariant at all times, this can only happen if both `low` and `mid` are in the first sorted sequence, and `high` is in the second sorted sequence. This is because all items in the second sorted sequence are less than the items in the first sorted sequence, and they can still be within the search space defined by `low` and `high` without breaking the invariant if `low` is in the first sorted sequence, and `high` is in the second sorted sequence.

We set `low = mid + 1` to discard the left half defined by the search space between `low` and `high`, i.e. between `low` and `mid`, and preserve the invariant for the next iteration.

// Diagram: We set low to mid + 1 to discard the half including and before mid.

### 3\. The right half is sorted arr\[mid\] <= arr\[high\]

In this case, the sequence between `mid` and `high` is guaranteed to be non-decreasing, while the sequence between `low` and `mid` may or may not be.

// Diagram: In this case, the sequence between mid and high is guaranteed to be sorted.

There can be three further subcases in this case, as given below.

#### 3.1 arr\[mid\] < target <=  arr\[high\]

Since the sequence between `mid` and `high` is sorted, if `arr[mid]  < target <= arr[high]`, it means `target`, if it exists, is somewhere in the right half of the search space defined by `low` and `high` i.e. between `mid` and `high`, and so, the left half can be discarded.

// Diagram: If arr\[mid\] <= target < arr\[high\] it means that target is after mid.

And so, we set `low = mid + 1` to discard the left half, including `mid` and preserve the invariant for the next iteration.

// Diagram: We set low to mid + 1 to discard the half, including and before mid.

#### 3.2 target < arr\[mid\]

Since the sequence between `mid` and `high` is sorted, if `target < arr[mid]` it means `target` is **not** in the right half of the search space defined by `low` and `high`, i.e. between `mid` and `high`, and so, if it exists at all, it must be in the left half.

// Diagram: If target < arr\[mid\], it means it is before mid in the search space.

We set `high = mid - 1` to discard the right half and preserve the invariant for the next iteration.

// Diagram: We set high to mid - 1 to discard the half including and after mid.

#### 3.3 target > arr\[high\]

Since the sequence between `mid` and `high` is sorted, if `target > arr[high]` it means `target` must be after `high`. However, since our invariant states, `target`, if it exists is always between `low` and `high`, and since we maintain the invariant at all times, this can only happen if both `mid` and `high` are in the second sorted sequence, and `low` is in the first sorted sequence. This is because all items in the first sorted sequence are greater than the items in the second sorted sequence, and they can still be within the search space defined by `low` and `high` without breaking the invariant if `low` is in the first sorted sequence, and `high` is in the second sorted sequence.

We set `high = mid - 1` to discard the right half defined by the search space between `low` and `high`, i.e. between `mid` and `high`, and preserve the invariant for the next iteration.

// Diagram: We set high to mid - 1 to discard the half including and after mid.

At the end of all iterations `low` becomes greater than or equal to `high` and we cannot iterate any further. If we couldn't find the target by this time, it means the target does not exist in the array.

It is important to note that in each iteration, the algorithm discards half of the search space that is guaranteed not to contain the target. And so, the invariant that the array between `low` and `high` will always contain `target`, if it exists, is maintained throughout.

## Algorithm

We can combine all the cases above using conditional statements to discard half of the search space in each iteration. The steps below outline the sorted rotated search algorithm in a sorted rotated array.

> **rotatedSortedSearch(arr, target)**
>
> -   **Step 1:** Set \`low\` = 0
> -   **Step 2:** Set \`high\` = size of \`arr\` - 1
> -   **Step 3:** Iterate while \`low\` <= \`high\` and do the following:
>     -   **Step 3.1:** Set \`mid\` = \`low\` + (\`high\` - \`low\`) / 2
>     -   **Step 3.2:** If \`arr\[mid\]\` == \`target\` return \`mid\`
>     -   **Step 3.3:** Otherwise, If \`arr\[mid\]\` > \`arr\[low\]\`, it means the left half is sorted, do the following
>         -   **Step 3.3.1:** If \`arr\[low\]\` <= \`target\` < \`arr\[mid\]\` set \`high\` = \`mid\` - 1
>         -   **Step 3.3.2:** Otherwise set \`low\` = \`mid\` + 1
>     -   **Step 3.4:** Otherwise, it means the right half is sorted, do the following
>         -   **Step 3.4.1:** If \`arr\[mid\]\` < \`target\` <= \`arr\[high\]\` set \`low\` = \`mid\` + 1
>         -   **Step 3.4.2:** Otherwise set \`high\` = \`mid\` - 1
> -   **Step 4:** The \`target\` is not found, return -1

Given below is the execution of the algorithm to find a target value in a sorted rotated array.

// Diagram: Search for target (8) in a sorted rotated array

## Implementation

Given below is the implementation to find the given target value in a sorted rotated array using the sorted rotated search algorithm.

C++

```cpp
using namespace std;

class Solution {
public:
    int rotatedArraySearch(vector<int> &arr, int target) {
        int low = 0;
        int high = arr.size() - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;

            // If the middle element is the target, return its index
            if (arr[mid] == target) {
                return mid;
            }

            // If the left half is sorted
            if (arr[mid] >= arr[low]) {

                // If the target is within the range of the left half
                // Update the high index to search in the left half
                if (arr[low] <= target && target < arr[mid]) {
                    high = mid - 1;
                }

                // Ohterwise, update the low index to search in the right
                // half
                else {
                    low = mid + 1;
                }

            // Otherwise, if the right half is sorted
            else {

                // If the target is within the range of the right
                // half Update the low index to search in the right
                // half
                if (arr[mid] < target && target <= arr[high]) {
                    low = mid + 1;
                }

                // Otherwise, update the high index to search in the left
                // half
                else {
                    high = mid - 1;
                }

        // Target not found
        return -1;
    }
};
```

Java

```java
class Solution {
    public int rotatedArraySearch(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;

            // If the middle element is the target, return its index
            if (arr[mid] == target) {
                return mid;
            }

            // If the left half is sorted
            if (arr[mid] >= arr[low]) {

                // If the target is within the range of the left half
                // Update the high index to search in the left half
                if (arr[low] <= target && target < arr[mid]) {
                    high = mid - 1;
                }

                // Otherwise, update the low index to search in the right
                // half
                else {
                    low = mid + 1;
                }

            // Otherwise, if the right half is sorted
            else {

                // If the target is within the range of the right half
                // Update the low index to search in the right half
                if (arr[mid] < target && target <= arr[high]) {
                    low = mid + 1;
                }

                // Otherwise, update the high index to search in the left
                // half
                else {
                    high = mid - 1;
                }

        // Target not found
        return -1;
    }
```

Typescript

```typescript
export class Solution {
    rotatedArraySearch(arr: number[], target: number): number {
        let low = 0;
        let high = arr.length - 1;

        while (low <= high) {
            const mid: number = low + Math.floor((high - low) / 2);

            // If the middle element is the target, return its index
            if (arr[mid] === target) {
                return mid;
            }

            // If the left half is sorted
            if (arr[mid] >= arr[low]) {

                // If the target is within the range of the left half
                // Update the high index to search in the left half
                if (arr[low] <= target && target < arr[mid]) {
                    high = mid - 1;
                }

                // Otherwise, update the low index to search in the right
                // half
                else {
                    low = mid + 1;
                }

            // Otherwise, if the right half is sorted
            else {

                // If the target is within the range of the right half
                // Update the low index to search in the right half
                if (arr[mid] < target && target <= arr[high]) {
                    low = mid + 1;
                }

                // Otherwise, update the high index to search in the left
                // half
                else {
                    high = mid - 1;
                }

        // Target not found
        return -1;
    }
```

Javascript

```javascript
export class Solution {
    rotatedArraySearch(arr, target) {
        let low = 0;
        let high = arr.length - 1;

        while (low <= high) {
            const mid = low + Math.floor((high - low) / 2);

            // If the middle element is the target, return its index
            if (arr[mid] === target) {
                return mid;
            }

            // If the left half is sorted
            if (arr[mid] >= arr[low]) {

                // If the target is within the range of the left half
                // Update the high index to search in the left half
                if (arr[low] <= target && target < arr[mid]) {
                    high = mid - 1;
                }

                // Otherwise, update the low index to search in the right
                // half
                else {
                    low = mid + 1;
                }

            // Otherwise, if the right half is sorted
            else {

                // If the target is within the range of the right half
                // Update the low index to search in the right half
                if (arr[mid] < target && target <= arr[high]) {
                    low = mid + 1;
                }

                // Otherwise, update the high index to search in the left
                // half
                else {
                    high = mid - 1;
                }

        // Target not found
        return -1;
    }
```

Python

```python
from typing import List

class Solution:
    def rotated_array_search(self, arr: List[int], target: int) -> int:
        low = 0
        high = len(arr) - 1

        while low <= high:
            mid = low + (high - low) // 2

            # If the middle element is the target, return its index
            if arr[mid] == target:
                return mid

            # If the left half is sorted
            if arr[mid] >= arr[low]:

                # If the target is within the range of the left half
                # Update the high index to search in the left half
                if arr[low] <= target and target < arr[mid]:
                    high = mid - 1

                # Otherwise, update the low index to search in the right
                # half
                else:
                    low = mid + 1

            # Otherwise, if the right half is sorted
            else:

                # If the target is within the range of the right half
                # Update the low index to search in the right half
                if arr[mid] < target and target <= arr[high]:
                    low = mid + 1

                # Otherwise, update the high index to search in the left
                # half
                else:
                    high = mid - 1

        # Target not found
        return -1
```

## Complexity Analysis

The algorithm's time and space complexity are easy to understand. We have the two variables `low` and `high` that hold the start and end of the current search space, respectively, and in each iteration, we reduce the size of the search space by half. If we assume that the initial size of the problem space is **N**, the time complexity in any case is **O(log(N))**.

Since we don't create only a fixed number of extra variables during the execution of the algorithm, the space complexity **O(1)** is constant in any case.

> **Any case -**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(log(N))**

***

# Rotated array search

## Problem Statement

Given an integer array **arr** that contains distinct elements and is sorted in ascending order, you are also given an integer **target**, write a function to search the target in the array. If the target exists, return its index. Otherwise, return `-1`. 

The array, however, has been rotated along an unknown pivot k, such that it has now become `[arr[k], arr[k+1], ..., arr[n-1], arr[0], arr[1], ..., arr[k-1]`. For e.g an array `[1, 2, 3, 4, 5]` when rotated at a pivot index 2 becomes `[3, 4, 5, 1, 2]`. 

You must do this in a time complexity of `O(logN)`.

### Example 1

> -   **Input:** arr = \[4, 5, 6, 1, 2, 3\], target = 3
> -   **Output:** 5
> -   **Explanation:** The integer 3 is at index 5 in the array.

### Example 2

> -   **Input:** arr = \[5, 6, 1, 2, 3, 4\], target = 6
> -   **Output:** 1
> -   **Explanation:** The integer 6 is at index 1 in the array.

### Example 3

> -   **Input:** arr = \[6, 1, 2, 3, 4, 5\], target = 10
> -   **Output:** -1
> -   **Explanation:** The integer 10 does not exist in the array.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int rotatedArraySearch(vector<int> &arr, int target) {
        int low = 0;
        int high = arr.size() - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;

            // If the middle element is the target, return its index
            if (arr[mid] == target) {
                return mid;
            }

            // If the left half is sorted
            if (arr[mid] >= arr[low]) {

                // If the target is within the range of the left half
                // Update the high index to search in the left half
                if (arr[low] <= target && target < arr[mid]) {
                    high = mid - 1;
                }

                // Ohterwise, update the low index to search in the right
                // half
                else {
                    low = mid + 1;
                }

            }

            // Otherwise, if the right half is sorted
            else {

                // If the target is within the range of the right
                // half Update the low index to search in the right
                // half
                if (arr[mid] < target && target <= arr[high]) {
                    low = mid + 1;
                }

                // Otherwise, update the high index to search in the left
                // half
                else {
                    high = mid - 1;
                }
            }
        }

        // Target not found
        return -1;
    }
};
```
