# Identifying the binary search pattern

The binary search algorithm is one of the most powerful search algorithms that is used to solve many types of search and optimisation problems involving a sorted search space. These are generally easy or medium problems where we need to search for a value in a sorted sequence. Most of the time, searching is often a subproblem within a larger, more complex problem.

// Diagram: Binary search is used to search for a value in a sorted search space.

If the problem statement or its solution follows the generic template below, it can be solved by applying the upper bound algorithm.

**Template:**

Given a sorted search space and a target value, find the target value.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the binary search algorithm.

> **Problem statement:** Given an integer array \`recoveryCodes\` sorted in ascending order, which represents the recovery codes for a locked account, and an integer array \`attempts\` containing codes entered to unlock the account, write a function that returns \`true\` if any of the attempts successfully unlock the account. If the account cannot be unlocked, return \`false\`.

// Diagram: Find if any code from the attempts array can unlock the account.

### Brute force solution

The brute force solution to this problem is quite simple. We iterate in the `attempts` array from start to end using a variable `code` to store the current code. We then iterate in the `recoveryCodes` array and try to match the `code` with the codes in the `recoverCodes` array. If we find a match, we return `true`; otherwise, we continue to the next iteration.

This way, at the end of all iterations, we would have searched all the codes in the `attempts` array in the `recoveryCodes` array. If no code was matched, we return `false` in the end.

// Diagram: Search for codes in the attempts array in the recoveryCodes array

The brute force algorithm takes linear O(M\*N) time in the worst case, where M is the size of the `attempts` array, and **N** is the size of the `recoveryCodes` array. This is because we traverse the entire `recoveryCodes` array for all items in the `attempts` array. While the solution is correct, we can search much faster than this using the binary search algorithm.

### The binary search solution

The binary search algorithm finds the first index of a target value in a sorted array. Since the `recoveryCodes` array is already sorted in ascending order, we can use binary search to search for a code in it from the `attempts` array.

// Diagram: Search for the codes in the attempts array in the recoveryCodes array.

The solution to the problem fits the generic template for the binary search pattern we learned earlier.

**Template:**

Given a sorted search space (`recoveryCodes`) and a target value (a code from `attempts`), find the target value.

Since we need to execute binary search multiple times, we create a function `binarySearch` that takes as input a sorted array `arr` and a value `target` and returns the index of the `target` value if found; otherwise, returns `-1`.

We set `low` and `high` to the two ends of the input array `arr` and iterate while `low <= high`. In each iteration, we find the midpoint of the search space in `mid` and check if `arr[mid] == target`. If it is, return `mid` as a result to the caller. Otherwise, we set `low = mid + 1` if `arr[mid] < target` as it is guaranteed that all items at and before `mid` will be less than `target`. Otherwise, we set `high = mid - 1` as it is guaranteed that all items at or after `mid` will be greater than `target`.

At the end of all iterations, when `low` becomes greater than `high`, it means the `target` does not exist in `arr`, and we return `-1` to the caller.

We then loop in the `attempts` array using a variable `code` to store the current code, and in each iteration call `binarySearch` passing `recoveryCodes` and `code` as input. If it returns a valid index (not `-1`), we return `true`. Otherwise, we continue to the next iteration. If all the iterations end, it means we couldn't find any code in the `attempts` array in `recoveryCodes`, and so we return `false`.

Below is the execution of the binary search solution to the problem.

Search for codes in the attempts array in the recoveryCodes array.

The implementation of the binary search solution is given as follows. 

C++

```cpp
using namespace std;

class Solution {
public:
    int binarySearch(vector<int> &arr, int target) {

        // Starting index of the search range
        int low = 0;

        // Ending index of the search range
        int high = arr.size() - 1;

// Diagram: while (low <= high) {

            // Calculate the middle index
            int mid = (low + high) / 2;

            // Found the target, return the index
            if (arr[mid] == target) {
                return mid;
            }

            // If the arr[mid] is less than the target, adjust the search
            // range to the right half
            else if (arr[mid] < target) {
                low = mid + 1;
            }

            // Else if the arr[mid] is greater than the target, adjust
            // the search range to the left half
            else {
                high = mid - 1;
            }

        // Target not found in the array
        return -1;
    }

    bool recoveryValidation(
        vector<int> &recoveryCodes,
        vector<int> &attempts
    ) {

        // Iterate through each attempt code
        for (const auto &code : attempts) {

            // If the recovery code is acceptable, return true
            if (binarySearch(recoveryCodes, code) != -1) {
                return true;
            }

        // No acceptable recovery code found, return false
        return false;
    }
};
```

Java

```java
class Solution {
    private int binarySearch(int[] arr, int target) {

        // Starting index of the search range
        int low = 0;

        // Ending index of the search range
        int high = arr.length - 1;

// Diagram: while (low <= high) {

            // Calculate the middle index
            int mid = (low + high) / 2;

            // Found the target, return the index
            if (arr[mid] == target) {
                return mid;
            }

            // If the arr[mid] is less than the target, adjust the search
            // range to the right half
            else if (arr[mid] < target) {
                low = mid + 1;
            }

            // Else if the arr[mid] is greater than the target, adjust
            // the search range to the left half
            else {
                high = mid - 1;
            }

        // Target not found in the array
        return -1;
    }

    public boolean recoveryValidation(
        int[] recoveryCodes,
        int[] attempts
    ) {

        // Iterate through each attempts
        for (int code : attempts) {

            // If the recovery code is acceptable, return true
            if (binarySearch(recoveryCodes, code) != -1) {
                return true;
            }

        // No acceptable recovery code found, return false
        return false;
    }
```

Typescript

```typescript
export class Solution {
    binarySearch(arr: number[], target: number): number {

        // Starting index of the search range
        let low: number = 0;

        // Ending index of the search range
        let high: number = arr.length - 1;

// Diagram: while (low <= high) {

            // Calculate the middle index
            const mid: number = Math.floor((low + high) / 2);

            // Found the target, return the index
            if (arr[mid] === target) {
                return mid;
            }

            // If the arr[mid] is less than the target, adjust the search
            // range to the right half
            else if (arr[mid] < target) {
                low = mid + 1;
            }

            // Else if the arr[mid] is greater than the target, adjust
            // the search range to the left half
            else {
                high = mid - 1;
            }

        // Target not found in the array
        return -1;
    }

    recoveryValidation(
        recoveryCodes: number[],
        attempts: number[]
    ): boolean {

        // Iterate through each attempts
        for (const code of attempts) {

            // If the recovery code is acceptable, return true
            if (this.binarySearch(recoveryCodes, code) !== -1) {
                return true;
            }

        // No acceptable recovery code found, return false
        return false;
    }
```

Javascript

```javascript
export class Solution {
    binarySearch(arr, target) {

        // Starting index of the search range
        let low = 0;

        // Ending index of the search range
        let high = arr.length - 1;

// Diagram: while (low <= high) {

            // Calculate the middle index
            const mid = Math.floor((low + high) / 2);

            // Found the target, return the index
            if (arr[mid] === target) {
                return mid;
            }

            // If the arr[mid] is less than the target, adjust the search
            // range to the right half
            else if (arr[mid] < target) {
                low = mid + 1;
            }

            // Else if the arr[mid] is greater than the target, adjust
            // the search range to the left half
            else {
                high = mid - 1;
            }

        // Target not found in the array
        return -1;
    }

// Diagram: recoveryValidation(recoveryCodes, attempts) {

        // Iterate through each attempts
        for (const code of attempts) {

            // If the recovery code is acceptable, return true
            if (this.binarySearch(recoveryCodes, code) !== -1) {
                return true;
            }

        // No acceptable recovery code found, return false
        return false;
    }
```

Python

```python
from typing import List

class Solution:
    def binary_search(self, arr: List[int], target: int) -> int:

        # Starting index of the search range
        low: int = 0

        # Ending index of the search range
        high: int = len(arr) - 1

        while low <= high:

            # Calculate the middle index
            mid: int = (low + high) // 2

            # Found the target, return the index
            if arr[mid] == target:
                return mid

            # If the arr[mid] is less than the target, adjust the search
            # range to the right half
            if arr[mid] < target:
                low = mid + 1

            # Else if the arr[mid] is greater than the target, adjust
            # the search range to the left half
            else:
                high = mid - 1

        # Target not found in the array
        return -1

    def recovery_validation(
        self, recovery_codes: List[int], attempts: List[int]
    ) -> bool:

        # Iterate through each attempts
        for code in attempts:

            # If the recovery code is acceptable, return true
            if self.binary_search(recovery_codes, code) != -1:
                return True

        # No acceptable recovery code found, return false
        return False
```

## Example problems

Most problems in this category are **easy** or **medium**; a list of a few is given below.

> -   **[Recovery validation](https://www.codeintuition.io/courses/searching/BJC8iQgPSsJurHM3g1xlR)**
> -   **[Reverse binary search](https://www.codeintuition.io/courses/searching/cs7NigQ74SEQomA_vBsUD)**
> -   **[Minimum shared element](https://www.codeintuition.io/courses/searching/5nnFpTWqtJMEcRHWAvohn)**
> -   **[Intersecting elements](https://www.codeintuition.io/courses/searching/VoFsTSZTPnA-p171Mvacn)**

We will now solve these problems to understand the binary search algorithm better.

***

# Recovery validation

## Problem Statement

Given an integer array **recoveryCodes** sorted in ascending order, which represents the recovery codes for a locked account, and an integer array **attempts** containing codes entered to unlock the account, write a function that returns `true` if any of the attempts successfully unlock the account. If the account cannot be unlocked, return `false`.

You must do this in a time complexity of `O(N*logN)`.

### Example 1

> -   **Input:** recoveryCodes = \[1, 4, 7\], attempts = \[2, 4\]
> -   **Output:** true
> -   **Explanation:** The attempt with code 4 will successfully unlock the account.

### Example 2

> -   **Input:** recoveryCodes = \[5, 9, 11, 12\], attempts = \[2, 9, 12\]
> -   **Output:** true
> -   **Explanation:** Any attempt with codes 9 or 12 will successfully unlock the account.

### Example 3

> -   **Input:** recoveryCodes = \[1, 2, 3\], attempts = \[5, 6\]
> -   **Output:** false
> -   **Explanation:** None of the attempts will unlock the account.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int binarySearch(vector<int> &arr, int target) {

        // Starting index of the search range
        int low = 0;

        // Ending index of the search range
        int high = arr.size() - 1;

        while (low <= high) {

            // Calculate the middle index
            int mid = (low + high) / 2;

            // Found the target, return the index
            if (arr[mid] == target) {
                return mid;
            }

            // If the arr[mid] is less than the target, adjust the search
            // range to the right half
            else if (arr[mid] < target) {
                low = mid + 1;
            }

            // Else if the arr[mid] is greater than the target, adjust
            // the search range to the left half
            else {
                high = mid - 1;
            }
        }

        // Target not found in the array
        return -1;
    }

    bool recoveryValidation(
        vector<int> &recoveryCodes,
        vector<int> &attempts
    ) {

        // Iterate through each attempted recovery code
        for (const auto &attempt : attempts) {

            // If the recovery code is acceptable, return true
            if (binarySearch(recoveryCodes, attempt) != -1) {
                return true;
            }
        }

        // No acceptable recovery code found, return false
        return false;
    }
};
```

***

# Reverse binary search

## Problem Statement

Given an integer array arr that is sorted in descending order and an integer target, write a function to search for the target in the array. If the target exists, return its index otherwise, return `-1`.

You must do this in a time complexity of `O(logN)`.

### Example 1

> -   **Input:** arr = \[6, 5, 4, 3, 2, 1\], target = 3
> -   **Output:** 3
> -   **Explanation:** The integer 3 is at index 3 in the array.

### Example 2

> -   **Input:** arr = \[6, 5, 4, 3, 2, 1\], target = 6
> -   **Output:** 0
> -   **Explanation:** The integer 6 is at index 0 in the array.

### Example 3

> -   **Input:** arr = \[6, 5, 4, 3, 2, 1\], target = 10
> -   **Output:** -1
> -   **Explanation:** The integer 10 does not exist in the array.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int reverseBinarySearch(vector<int> &arr, int target) {

        // Starting index of the search range (leftmost element)
        int low = 0;

        // Ending index of the search range (rightmost element)
        int high = arr.size() - 1;

        while (low <= high) {

            // Calculate the middle index to avoid potential overflow
            int mid = low + (high - low) / 2;

            // Found the target, return the index
            if (arr[mid] == target) {
                return mid;
            }

            // Since the array is sorted in descending order:
            // If arr[mid] is smaller than the target,
            // move to the left half (where larger elements are)
            else if (arr[mid] < target) {
                high = mid - 1;
            }

            // Else if arr[mid] is greater than the target,
            // move to the right half (where smaller elements are)
            else {
                low = mid + 1;
            }
        }

        // Target not found in the array
        return -1;
    }
};
```

***

# Minimum shared element

## Problem Statement

Given an **N x M** integer **matrix** where every row is sorted in ascending order, write a function to find and return the minimum shared element in all rows. If there is no such element, return `-1` instead.

You must do this in a time complexity of `O(N*logM)`.

### Example 1

> -   **Input:** matrix = \[\[1, 2, 3\]\]
> -   **Output:** 1
> -   **Explanation:** Only one row with the smallest element as 1.

### Example 2

> -   **Input:** matrix = \[\[2, 3, 4\], \[1, 3, 5\], \[1, 2, 3\]\]
> -   **Output:** 3
> -   **Explanation:** The smallest common element from all the rows is 3.

### Example 3

> -   **Input:** matrix = \[\[1, 2, 3\], \[4, 5, 6\], \[7, 8, 9\]\]
> -   **Output:** -1
> -   **Explanation:** The rows have no common element.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int binarySearch(vector<int> &arr, int target) {

        // Starting index of the search range
        int low = 0;

        // Ending index of the search range
        int high = arr.size() - 1;

        while (low <= high) {

            // Calculate the middle index
            int mid = (low + high) / 2;

            // Found the target, return the index
            if (arr[mid] == target) {
                return mid;
            }

            // If the arr[mid] is less than the target, adjust the search
            // range to the right half
            else if (arr[mid] < target) {
                low = mid + 1;
            }

            // Else if the arr[mid] is greater than the target, adjust
            // the search range to the left half
            else {
                high = mid - 1;
            }
        }

        // Target not found in the array
        return -1;
    }

    int minimumSharedElement(vector<vector<int>> &matrix) {
        int rows = matrix.size();

        // If the matrix has no rows, return -1
        if (rows == 0) {
            return -1;
        }

        int cols = matrix[0].size();

        // Iterate through the columns of the matrix
        for (int col = 0; col < cols; col++) {
            int target = matrix[0][col];
            bool found = true;

            // Check if the target element is present in all rows
            for (int row = 1; row < rows; row++) {

                // Use binary search to check if target is present in
                // this row
                if (binarySearch(matrix[row], target) == -1) {

                    // Target not found in this row, break out of the
                    // loop
                    found = false;
                    break;
                }
            }

            // If target is found in all rows, it is the smallest common
            // element
            if (found) {
                return target;
            }
        }

        // No common element found in all rows
        return -1;
    }
};
```

***

# Intersecting elements

## Problem Statement

Given an **N x M** integer **matrix** where every row is sorted in ascending order, write a function to find and return a sorted list of all intersecting elements in this matrix.

An intersecting element is an element that is present in all the rows of the matrix.

You must do this in a time complexity of `O(N*logM)`.

### Example 1

> -   **Input:** matrix = \[\[1, 2, 3, 4\], \[0, 1, 4, 5\]\]
> -   **Output:** \[1, 4\]
> -   **Explanation:** 1 and 4 are the only intersecting elements in the matrix.

### Example 2

> -   **Input:** matrix = \[\[5, 9, 11\], \[1, 4, 5\], \[2, 5, 9\]\]
> -   **Output:** \[5\]
> -   **Explanation:** 5 is the only intersecting element in the matrix.

### Example 3

> -   **Input:** matrix = \[\[1, 2, 3, 4\], \[0, 1, 4, 5\], \[6, 7, 8\]\]
> -   **Output:** \[\]
> -   **Explanation:** There are no intersecting elements in the matrix.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int binarySearch(vector<int> &arr, int target) {

        // Starting index of the search range
        int low = 0;

        // Ending index of the search range
        int high = arr.size() - 1;

        while (low <= high) {

            // Calculate the middle index
            int mid = (low + high) / 2;

            // Found the target, return the index
            if (arr[mid] == target) {
                return mid;
            }

            // If the arr[mid] is less than the target, adjust the search
            // range to the right half
            else if (arr[mid] < target) {
                low = mid + 1;
            }

            // Else if the arr[mid] is greater than the target, adjust
            // the search range to the left half
            else {
                high = mid - 1;
            }
        }

        // Target not found in the array
        return -1;
    }

    vector<int> intersectingElements(vector<vector<int>> &matrix) {
        int rows = matrix.size();

        // If the matrix has no rows, return an empty result
        if (rows == 0) {
            return {};
        }

        int cols = matrix[0].size();
        vector<int> result;

        // Iterate through the columns of the matrix
        for (int col = 0; col < cols; col++) {
            int target = matrix[0][col];
            bool found = true;

            // Check if the target element is present in all rows
            for (int row = 1; row < rows; row++) {

                // Use binary search to check if target is present in
                // this row
                if (binarySearch(matrix[row], target) == -1) {

                    // Target not found in this row, break out of the
                    // loop
                    found = false;
                    break;
                }
            }

            // If target is found in all rows, add it to the result
            if (found) {
                result.push_back(target);
            }
        }

        // Return the intersection of elements present in all rows
        return result;
    }
};
```
