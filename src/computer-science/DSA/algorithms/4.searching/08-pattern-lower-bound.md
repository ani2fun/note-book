# Identifying the upper bound pattern

The lower bound algorithm is a very versatile algorithm that can solve a wide variety of search problems. It is especially useful on non-decreasing arrays where there are repetitions. In most cases, the lower bound algorithm solves subproblems within a larger, more complex problem to make the overall solution more efficient. These are generally easy or medium problems where we must apply the lower bound algorithm one or more times or leverage its constraints to our benefit. 

// Diagram: Search for the first item greater than or equal to the given value in a sorted search space.

If the problem statement or its solution follows the generic template below, it can be solved by applying the lower bound algorithm.

**Template:**

Given a sorted search space and a target value, find the first item greater than or equal to the target value.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the lower bound algorithm.

> **Problem statement:** Given an integer array `arr` that is sorted in non-decreasing order and an integer `target`, find and return the first and last positions of the target in the array. If the target doesn't exist, return `\[-1, -1\]` instead.

// Diagram: Search for the first and last occurrence of target (4) in arr.

### Brute force solution

The brute force solution to this problem is quite simple. We initialize two variables `first` and `last` with `-1` and traverse the array from start to end. In each iteration, we compare the current item with `target`. If it matches `target`, we update `last` with the current index. We then check if `first == -1`, we also update `first` with the current index, otherwise do nothing. On the other hand, if the current item is not equal to `target`, we move to the next iteration.

This way, at the end of traversal, `first` and `last` will hold the first and last index of the item if it exists in the array, otherwise, they will hold `-1`.

// Diagram: Search for the first and last occureence of target (4) in arr

The brute force algorithm takes linear **O(N)** time as it traverses the entire array. While the solution is correct, we can search much faster than this using the lower bound algorithm.

### The lower bound solution

The lower bound algorithm finds the first index in the sorted search space that has a value greater than or equal to the given target. And so, we can find the first index by simply executing the lower bound algorithm on the array with the target value.

// Diagram: Finding the first index of the target by running a lower bound on the array searching for target.

On closer observation, we can see that we can also leverage the lower bound algorithm to find the last index of `target` in `arr`. Since we know `arr` is an array of integers, if we execute the lower bound algorithm on it to find `target + 1` , it will find either find the first index of `target + 1` if it exists or the first index of the first item greater than `target + 1` if it does not exist. This index is guaranteed to be just after the last index of `target`. and so we can just subtract `1` from it to get the last index of `target`.

// Diagram: Finding the last index of the target by running a lower bound on the array searching for target + 1.

The solution to the problem fits the generic template for the lower bound pattern we learned earlier.

**Template:**

Given a sorted search space (`arr`) and a target value (`target` and `target + 1`), find the first item greater than or equal to the target value.

Since we need to execute the lower bound algorithm twice, we create a function `lowerBound` that takes as input a sorted array `arr` and a value `target` and returns the first index with a value greater than or equal to the `target` (lower bound).

We set `low` and `high` to the two ends of the input array `arr` and iterate while `low < high`. In each iteration, we find the midpoint of the search space in `mid` and set `low = mid + 1` if `arr[mid] < target` as it is guaranteed that all items at and before `mid` will be less than `target`. Otherwise, we set `high = mid` as `mid` could either be equal to `target` or greater than it. Since this check also includes the case where `mid == target`, we don't set `high = mid - 1` as this may be the only index where that target value occurs.

At the end of all iterations, when `low` becomes equal to `high`, we return `low`, which will either be the lower bound of `target` in `arr` or the index after the last index of `arr` if all items in `arr` are smaller than `target`.

We then call the `lowerBound` function twice on `arr` from the calling function on `target` and `target + 1` and save the returned indices in two variables `first` and `last`. We then subtract `1` from `last` to get the potential last index of `target`. Since the lower bound algorithm can potentially return an index out of bounds of the array if all items are smaller than `target` or it can return the index of the first item greater than `target` if `target` doesn't exist in the array, we check if `first` is less than the size of the `arr` and `arr[first] == target` to confirm the item is found. If it is found, we return `first` and `last` as the solution; otherwise, we return `-1` and `-1`.

Below is the execution of the lower bound search solution to find the first and last index of a target value in a non-decreasing array.

Search for the first and last occurrence of target (4) in arr.

The implementation of the lower bound search solution is given as follows. 

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

// Diagram: vector<int> firstAndLastPosition(vector<int> &arr, int target) {

        // initialize the result vector with -1 values
        vector<int> result(2, -1);

        // find the lower bound of target
        int first = lowerBound(arr, target);

        // find the lower bound of target+1 and subtract 1
        int last = lowerBound(arr, target + 1) - 1;

        // Check if the lower bound index is within the vector bounds and
        // if the value is the target
        if (first < arr.size() && arr[first] == target) {

            // return the range [first, last]
            return {first, last};
        }

        // return the default result vector
        return result;
    }
};
```

Java

```java
class Solution {
    private int lowerBound(int[] arr, int target) {

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

// Diagram: public int[] firstAndLastPosition(int[] arr, int target) {

        // Initialize the result array with -1 values
        int[] result = new int[] { -1, -1 };

        // Find the lower bound of target
        int first = lowerBound(arr, target);

        // Find the lower bound of target+1 and subtract 1
        int last = lowerBound(arr, target + 1) - 1;

        // Check if the lower bound index is within the array bounds and
        // if the value is the target
        if (first < arr.length && arr[first] == target) {

            // Return the range [first, last]
            return new int[] { first, last };
        }

        // Return the default result array
        return result;
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

// Diagram: firstAndLastPosition(arr: number[], target: number): number[] {

        // Initialize the result array with -1 values
        const result: number[] = [-1, -1];

        // Find the lower bound of target
        const first = this.lowerBound(arr, target);

        // Find the lower bound of target+1 and subtract 1
        const last = this.lowerBound(arr, target + 1) - 1;

        // Check if the lower bound index is within the array bounds and
        // if the value is the target
        if (first < arr.length && arr[first] === target) {

            // Return the range [first, last]
            return [first, last];
        }

        // Return the default result array
        return result;
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

// Diagram: firstAndLastPosition(arr, target) {

        // Initialize the result array with -1 values
        const result = [-1, -1];

        // Find the lower bound of target
        const first = this.lowerBound(arr, target);

        // Find the lower bound of target+1 and subtract 1
        const last = this.lowerBound(arr, target + 1) - 1;

        // Check if the lower bound index is within the array bounds and
        // if the value is the target
        if (first < arr.length && arr[first] === target) {

            // Return the range [first, last]
            return [first, last];
        }

        // Return the default result array
        return result;
    }
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

    def first_and_last_position(
        self, arr: List[int], target: int
    ) -> List[int]:

        # Initialize the result list with -1 values
        result = [-1, -1]

        # Find the lower bound of target
        first: int = self.lower_bound(arr, target)

        # Find the lower bound of target+1 and subtract 1
        last: int = self.lower_bound(arr, target + 1) - 1

        # Check if the lower bound index is within the list bounds and if
        # the value is the target
        if first < len(arr) and arr[first] == target:

            # Return the range [first, last]
            return [first, last]

        # Return the default result list
        return result
```

## Example problems

Most problems in this category are **easy** or **medium**; a list of a few is given below.

> -   **[Search insert position](https://www.codeintuition.io/courses/searching/yV_AnxyZikIxODGrhg0xk)**
> -   **[First and last position](https://www.codeintuition.io/courses/searching/PzJX5QrchqNrHHPXcEvxT/code)**
> -   **[Closest element](https://www.codeintuition.io/courses/searching/ucZF0XQ8r_sTiKL8Mz4KO)**
> -   **[K closest elements](https://www.codeintuition.io/courses/searching/FC2B3-BERAkzGghr4ftC1)**

We will now solve these problems to understand the lower bound search algorithm better.

***

# Search insert position

## Problem Statement

Given an integer array **arr** sorted in ascending order and an integer **target**, write a function to search the target in the array. If the target exists, return its index. Otherwise, return the index where it would be if inserted in order.

You must do this in a time complexity of `O(logN)`.

### Example 1

> -   **Input:** arr = \[1, 2, 3, 4, 5, 6\], target = 3
> -   **Output:** 2
> -   **Explanation:** The integer 3 is at index 2 in the array.

### Example 2

> -   **Input:** arr = \[1, 2, 7, 8, 9, 10\], target = 3
> -   **Output:** 2
> -   **Explanation:** The integer 3 should be inserted at index 2, i.e. after the integer 2.

### Example 3

> -   **Input:** arr = \[1, 2, 7, 9, 10, 11\], target = 8
> -   **Output:** 3
> -   **Explanation:** The integer 8 should be inserted at index 3, i.e. after the integer 7.

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

    int searchInsertPosition(vector<int> &arr, int target) {
        return lowerBound(arr, target);
    }
};
```

***

# First and last position

## Problem Statement

Given an integer array **arr** that is sorted in ascending order and an integer **target**, write a function to find and return the first and last positions of the target in the array. If the target doesn't exist, return `[-1, -1]` instead.

You must do this in a time complexity of `O(logN)`.

### Exampe 1

> -   **Input:** arr = \[1, 2, 2, 2, 3, 4\], target = 2
> -   **Output:** \[1, 3\]
> -   **Explanation:** Above is the first and last index of the array that contains 2.

### Exampe 2

> -   **Input:** arr = \[1, 2, 2, 2, 3, 4\], target = 3
> -   **Output:** \[4, 4\]
> -   **Explanation:** Above is the first and last index of the array that contains 3.

### Exampe 3

> -   **Input:** arr = \[1, 2, 2, 2, 3, 4\], target = 5
> -   **Output:** \[-1, -1\]
> -   **Explanation:** 5 doesn't exist in the array.

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

    vector<int> firstAndLastPosition(vector<int> &arr, int target) {

        // initialize the result vector with -1 values
        vector<int> result(2, -1);

        // find the first occurrence of target
        int first = lowerBound(arr, target);

        // find the lower bound of target+1 and subtract 1 to get the
        // last occurrence of target
        int last = lowerBound(arr, target + 1) - 1;

        // Check if the lower bound index is within the vector bounds and
        // if the value is the target
        if (first < arr.size() && arr[first] == target) {

            // return the range [first, last]
            return {first, last};
        }

        // return the default result vector
        return result;
    }
};
```

***

# Closest element

## Problem Statement

Given an integer array **arr** sorted in ascending order and a **target**, write a function to find and return the closest element to the target. 

An integer `x` is closer to the target than an integer `y` if:

// Diagram: |x - target| < |y - target|, or

// Diagram: |x - target| == |y - target| and x < y

### Example 1

> -   **Input:** arr = \[1, 2, 3, 4, 5, 6\], target = 4
> -   **Output:** 4
> -   **Explanation:** Since 4 is already present in the array, it is the closest element to itself.

### Example 2

> -   **Input:** arr = \[2, 4, 6, 8, 10, 12\], target = 5
> -   **Output:** 4
> -   **Explanation:** 4 and 6 are equally close to 5. However, since 4 is less than 6, it is considered the closest to 5.

### Example 3

> -   **Input:** arr = \[1, 10\], target = 7
> -   **Output:** 10
> -   **Explanation:** 10 is closer to 7 than 1.

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

    int closestElement(vector<int> &arr, int target) {

        // Return -1 if the array is empty
        if (arr.empty()) {
            return -1;
        }

        int lowerBoundIndex = lowerBound(arr, target);

        // If lower bound index is 0, return the first element
        if (lowerBoundIndex == 0) {
            return arr[0];
        }

        // If lower bound index is equal to the size of the array,
        // return the last element
        else if (lowerBoundIndex == arr.size()) {
            return arr[arr.size() - 1];
        }

        // Else, return the element which is closest to the target
        // among the two closest elements
        else {

            // Get the element strictly less than target
            int lowerElement = arr[lowerBoundIndex - 1];

            // Get the element greater than or equal to target
            int upperElement = arr[lowerBoundIndex];

            // Return the closest element
            if (target - lowerElement <= upperElement - target) {
                return lowerElement;
            } else {
                return upperElement;
            }
        }
    }
};
```

***

# K closest elements

## Problem Statement

Given an integer array **arr** sorted in ascending order, a non-negative integer **k**, and an integer **target**, write a function to find and return the k closest elements to the target. The returned output should be sorted.

An integer `x` is closer to the target than an integer `y` if:

// Diagram: |x - target| < |y - target|, or

// Diagram: |x - target| == |y - target| and x < y

You must use **binary search** to solve this problem.

### Example 1

> -   **Input:** arr = \[1, 2, 3, 4, 5, 6\], k = 3, target = 4
> -   **Output:** \[3, 4, 5\]
> -   **Explanation:** Above are the three closest elements to 4.

### Example 2

> -   **Input:** arr = \[1, 4, 5, 6, 7, 8\], k = 3, target = 4
> -   **Output:** \[4, 5, 6\]
> -   **Explanation:** Above are the three closest elements to 4.

### Example 3

> -   **Input:** arr = \[1, 5, 8, 10, 12, 13\], k = 3, target = 10
> -   **Output:** \[8, 10, 12\]
> -   **Explanation:** Above are the three closest elements to 10.

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

    vector<int> kClosestElements(vector<int> &arr, int k, int target) {
        if (arr.empty() || k <= 0) {
            return {};
        }

        int right = lowerBound(arr, target);
        int left = right - 1;

        // Expand the window to the left and right
        while (k-- > 0) {

            // If left pointer is out of bounds,
            // move the right pointer
            if (left < 0) {
                right++;
            }

            // If right pointer is out of bounds,
            // move the left pointer
            else if (right >= arr.size()) {
                left--;
            }

            // If the element at left pointer is closer to target,
            // move the left pointer
            else if (target - arr[left] <= arr[right] - target) {
                left--;
            }

            // Else, if the element at right pointer is closer to target,
            // move the right pointer
            else {
                right++;
            }
        }

        // Return the k closest elements collected between left and right
        // pointers
        return vector<int>(arr.begin() + left + 1, arr.begin() + right);
    }
};
```
