# Identifying the upper bound pattern

The upper bound algorithm is another very versatile algorithm that can solve a wide variety of search problems and is especially useful on non-decreasing arrays where there are repetitions. In most cases, the upper bound algorithm solves subproblems within a larger, more complex problem to make the overall solution more efficient. These are generally easy or medium problems where we must apply the upper bound algorithm one or more times or leverage its constraints to our benefit. 

// Diagram: Search for the first item greater than the given value in a sorted search space.

If the problem statement or its solution follows the generic template below, it can be solved by applying the upper bound algorithm.

**Template:**

Given a sorted search space and a target value, find the first item greater than the target value.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the upper bound algorithm.

> **Problem statement:** Given an integer array `arr` that is sorted in ascending order, write a function to find and return the index of the first positive element in the array. If there are no positive elements, return -1 instead.

// Diagram: Find the index of the first positive integer.

### Brute force solution

The brute force solution to this problem is quite simple. We iterate in the array from start to end, and in each iteration, we check if the current item is positive. If it is positive, we terminate further iterations and return its index; otherwise, we continue to the next iteration.

If all the iterations finish, it means there was no positive item in the array, and we return `-1`.

// Diagram: Find the index of the first positive integer

The brute force algorithm takes linear **O(N)** time as it traverses the entire array in the worst case. While the solution is correct, we can search much faster than this using the upper bound algorithm.

### The upper bound search solution

The upper bound algorithm finds the first index in the sorted search space that has a value greater than the given target. And so, we can find the first positive value by finding the upper bound for `0` in the given array.

// Diagram: Finding the index of the first positive integer by running the upper bound algorithm on the array for 0.

The solution to the problem fits the generic template for the upper bound pattern we learned earlier.

**Template:**

Given a sorted search space (`arr`) and a target value (`0`), find the first item greater than the target value.

We create a function `upperBound` that takes as input a sorted array `arr` and a value `target` and returns the first index with a value greater than `target` (upper bound).

We set `low` and `high` to the two ends of the input array `arr` and iterate while `low < high`. In each iteration, we find the midpoint of the search space in `mid` and set `low = mid + 1` if `arr[mid] <= target` as it is guaranteed that all items at and before `mid` will be less than or equal to `target`. Otherwise, we set `high = mid` as `mid` could be the first item greater than `target`.

At the end of all iterations, when `low` becomes equal to `high`, we return `low`, which will either be the upper bound of `target` in `arr` or the index after the last index of `arr` if all items in `arr` are smaller than `target`.

We then call the `upperBound` function on `arr` from the calling function, setting the value of `target` to `0`. and save the returned index in a variable `uppoerBoundIndex`. Since the upper bound algorithm can potentially return an index out of bounds of the array if all items are smaller than `target`, we check if `upperBoundIndex` is less than the size of the `arr` before returning it as the solution; otherwise, we return -1.

Below is the execution of the upper bound search solution to find the index of the first positive integer in an array.

// Diagram: Find the index of the first positive integer

The implementation of the upper bound search solution is given as follows. 

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

// Diagram: int positiveIndex(vector<int> &arr) {

        // Find the upper bound index for 0 i.e first index where arr[i]
        // > 0
        int upperBoundIndex = upperBound(arr, 0);

        // If upperBoundIndex == arr.size(), no positive element exists
        if (upperBoundIndex == arr.size()) {
            return -1;
        }

        // Return the first positive index
        return upperBoundIndex;
    }
};
```

Java

```java
class Solution {
    private int upperBound(int[] arr, int target) {

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

// Diagram: public int positiveIndex(int[] arr) {

        // Find the upper bound index for 0 i.e first index where arr[i]
        // > 0
        int upperBoundIndex = upperBound(arr, 0);

        // If upperBoundIndex == arr.length, no positive element exists
        if (upperBoundIndex == arr.length) {
            return -1;
        }

        // Return the first positive index
        return upperBoundIndex;
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

// Diagram: positiveIndex(arr: number[]): number {

        // Find the upper bound index for 0 i.e first index where arr[i]
        // > 0
        const upperBoundIndex = this.upperBound(arr, 0);

        // If upperBoundIndex == arr.length, no positive element exists
        if (upperBoundIndex === arr.length) {
            return -1;
        }

        // Return the first positive index
        return upperBoundIndex;
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

// Diagram: positiveIndex(arr) {

        // Find the upper bound index for 0 i.e first index where arr[i]
        // > 0
        let upperBoundIndex = this.upperBound(arr, 0);

        // If upperBoundIndex == arr.length, no positive element exists
        if (upperBoundIndex === arr.length) {
            return -1;
        }

        // Return the first positive index
        return upperBoundIndex;
    }
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

    def positive_index(self, arr: List[int]) -> int:

        # Find the upper bound index for 0 i.e first index where arr[i] >
        # 0
        upper_bound_index: int = self.upper_bound(arr, 0)

        # If upper_bound_index == len(arr), no positive element exists
        if upper_bound_index == len(arr):
            return -1

        # Return the first positive index
        return upper_bound_index
```

## Example problems

Most problems in this category are **easy** or **medium**; a list of a few is given below.

> -   **[Limit count](https://www.codeintuition.io/courses/searching/mjKxw-6evdyjRaa-1QLgI)**
> -   **[Positive index](https://www.codeintuition.io/courses/searching/2C1bTVU4LazyaauGWHk1v)**
> -   **[Ceiling index](https://www.codeintuition.io/courses/searching/Cqbi1t_vWwChHs_QPYz0a)**
> -   **[Breaking index](https://www.codeintuition.io/courses/searching/drilNuAauBSCaxrXpPKOt)**

We will now solve these problems to understand the upper bound search algorithm better.

***

# Limit count

## Problem Statement

Given an integer array **arr** that is sorted in ascending order and an integer **k**, write a function to find and return the number of elements in the array that are smaller than or equal to k. 

You must do this in a time complexity of `O(logN)`.

### Exampe 1

> -   **Input:** arr = \[1, 3, 5, 8, 9\], k = 7
> -   **Output:** 3
> -   **Explanation:** Three elements in the array are less than or equal to 7.

### Exampe 2

> -   **Input:** arr = \[1, 2, 2, 2, 3, 4\], k = 3
> -   **Output:** 5
> -   **Explanation:** Five elements in the array are less than or equal to 3.

### Exampe 3

> -   **Input:** arr = \[1, 2, 2, 2, 3, 4\], k = 8
> -   **Output:** 6
> -   **Explanation:** All the elements in the array are less than or equal to 8.

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

    int limitCount(vector<int> &arr, int k) {

        // The number of elements <= k is given by the
        // upper bound index of k
        return upperBound(arr, k);
    }
};
```

***

# Positive index

## Problem Statement

Given an integer array **arr** that is sorted in ascending order, write a function to find and return the index of the first positive element in the array. If there are no positive elements, return `-1` instead.

You must do this in a time complexity of `O(logN)`.

### Exampe 1

> -   **Input:** arr = \[-5, -3, -1, 0, 2, 4, 6\]
> -   **Output:** 4
> -   **Explanation:** The first positive element (2) is at index 4.

### Exampe 2

> -   **Input:** arr = \[-1, 2, 2, 2, 3, 4\]
> -   **Output:** 1
> -   **Explanation:** The first positive element (2) is at index 1.

### Exampe 3

> -   **Input:** arr = \[-1, -2\]
> -   **Output:** -1
> -   **Explanation:** There are no positive elements in the array.

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

    int positiveIndex(vector<int> &arr) {

        // Find the upper bound index for 0 i.e first index where arr[i]
        // > 0
        int upperBoundIndex = upperBound(arr, 0);

        // If upperBoundIndex == arr.size(), no positive element exists
        if (upperBoundIndex == arr.size()) {
            return -1;
        }

        // Return the first positive index
        return upperBoundIndex;
    }
};
```

***

# Ceiling index

## Problem Statement

Given an integer array **arr** sorted in ascending order, and a list of **queries**, write a function to find and return a list containing the ceiling index of each query in the list. If no such index exists for a query, return `-1` for that query.

// Diagram: Ceiling index of a query is the smallest index i such that arr[i] is greater than the query

You must do this in a time complexity of `O(N*logN)`.

### Example 1

> -   **Input:** arr = \[1, 4, 7\], queries = \[2, 4\]
> -   **Output:** \[1, 2\]
> -   **Explanation:** The ceiling index of 2 is 1 because the element at index 1 is 4, which is the smallest index greater than 2. Similarly, the ceiling index of 4 is 2 because the element at index 2 is 7, the smallest element greater than 4.

### Example 2

> -   **Input:** arr = \[5\], queries = \[2\]
> -   **Output:** \[0\]
> -   **Explanation:** The ceiling index of 2 is 0 because the element at index 0 is 5, which is the smallest index greater than 2.

### Example 3

> -   **Input:** arr = \[5\], queries = \[6\]
> -   **Output:** \[-1\]
> -   **Explanation:** There is no element greater than 6 in the array.

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

    vector<int> ceilingIndex(vector<int> &arr, vector<int> &queries) {

        // Result vector to store ceiling index for each query
        vector<int> result;

        // Iterate through each query
        for (const auto &query : queries) {

            // Find the upper bound index for the current query
            int upperBoundIndex = upperBound(arr, query);

            // If upperBoundIndex is equal to arr.size(), it means there
            // is no element greater than or equal to query, so we append
            // -1
            if (upperBoundIndex == arr.size()) {
                result.push_back(-1);
            }

            // Otherwise, upperBoundIndex is the ceiling index
            else {
                result.push_back(upperBoundIndex);
            }
        }

        // Return the result vector containing ceiling indices for all
        // queries
        return result;
    }
};
```

***

# Breaking index

## Problem Statement

Given an integer array **arr** that is sorted in ascending order and an integer **delta**, write a function to find and return the first index `i` such that `arr[i] - arr[0] > delta`. If no such index exists, return `-1` instead.

You must do this in a time complexity of `O(logN)`.

### Exampe 1

> -   **Input:** arr = \[1, 5, 10, 15, 20, 25\], delta = 6
> -   **Output:** 2
> -   **Explanation:** The first index satisfying the condition is 2, because arr\[2\] - arr\[0\] = 10 - 1 = 9, which is greater than the given delta of 6.

### Exampe 2

> -   **Input:** arr = \[1, 2, 4, 5\], delta = 2
> -   **Output:** 2
> -   **Explanation:** The first index satisfying the condition is 2, because arr\[2\] - arr\[0\] = 4 - 1 = 3, which is greater than the given delta of 2.

### Exampe 3

> -   **Input:** arr = \[1, 5\], delta = 6
> -   **Output:** -1
> -   **Explanation:** No index satisfies the condition.

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

    int breakingIndex(vector<int> &arr, int delta) {

        // If the array is empty, return -1
        if (arr.size() == 0) {
            return -1;
        }

        // Calculate the target value which is arr[0] + delta
        int target = arr[0] + delta;

        // Find the upper bound index for the target value
        int upperBoundIndex = upperBound(arr, target);

        // If upperBoundIndex is equal to arr.size(), it means no
        // element is greater than target, so return -1
        if (upperBoundIndex == arr.size()) {
            return -1;
        }

        // Otherwise, return the upper bound index
        else {
            return upperBoundIndex;
        }
    }
};
```
