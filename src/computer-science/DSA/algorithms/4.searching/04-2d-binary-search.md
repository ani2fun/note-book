# Understanding the problem

Searching a one-dimensional sorted list at a large scale is already challenging, which is why binary search is so valuable. But in many real-world situations, data is not stored in a simple linear structure. It often appears in a 2D grid, such as a table of student scores, a matrix of measurements, or a spreadsheet of sorted data.

## Example

Imagine a school teacher who maintains a sorted table of student marks, where:

> -   Each row is sorted in ascending order
> -   The first element of each row is greater than the last element of the previous row.

// Diagram: Sorted score table of 10 students

Now, suppose you want to quickly find out whether a specific score, say `85`, exists anywhere in this table. A simple approach is to scan the grid row by row, examining each element sequentially until the target is found. This method follows a natural, left-to-right, top-to-bottom pattern, making it easy to understand and implement.

// Diagram: Linear search to find the student with a score of 85

This works for small datasets, but it quickly becomes impractical when the table contains thousands, or even millions of cells. 

// Diagram: Sorted score table of thousands of students

As the dataset grows, manually checking each cell becomes time-consuming, underscoring the need for a more efficient strategy.

## Limitations of binary search

You could also attempt binary search on each row individually, but that would still require checking every row unless you get lucky. You lose the true power of binary search, which is the ability to discard large portions of the search space.

// Diagram: Searching in a table becomes difficult at a large scale

To solve this, we need a method that leverages the table's sorted structure to quickly reduce the search space, just like binary search does for arrays.

***

# Exploring a possible solution

Now that we understand how time-consuming it is to scan a large 2D table cell by cell, we need a smarter way to search for a score like `85`. The key to improving performance lies in understanding how the table is structured.

Each row is sorted from left to right, and every row starts with a score that is greater than the last score of the previous row. This means the entire table behaves like a single, continuous, increasing sequence, just laid out in two dimensions.

## 2D binary search

2D binary search is an extension of the classic binary search algorithm for two-dimensional grids. Similar to standard binary search, it leverages the sorted order to efficiently locate a target value. Instead of examining each cell individually, 2D binary search repeatedly partitions the search space, eliminating regions where the target cannot possibly exist. By doing so, it reduces the number of comparisons dramatically, just like binary search halves the search space in a one-dimensional space.

Looking at the problem of finding a student who scored `85` marks in a large, sorted 2D table of results, instead of checking each score individually, you begin by examining the score at the center of the table the element roughly in the middle row and middle column.

// Diagram: Examine the score of the student at the centre(middle) of the table

If the **middle** score is **less** than `85`, the target **must be located after this point** in the table, so you discard all cells above and to the left of the middle element, as none of them can contain the target.

// Diagram: Discard the cells above and to the left of the middle score (including the middle score)

Similarly, if the **middle** score is **greater** than `85`, the target must be located **before this point** in the table, so you can discard all cells below and to the right of the middle element, as none of them can contain the target.

// Diagram: Discard the cells below and to the right of the middle score (including the middle score)

You repeat this process, halving the remaining region of the table at each step, until the score `85` is found at the midpoint of the narrowed section.

// Diagram: Target found when only one cell remains in the search space

By leveraging the sorted structure of the rows and columns, this method eliminates large sections of the table at every step, requiring far fewer comparisons and making the search significantly faster than checking each cell individually.

> -   **Step 1**: Start with the full 2D table of student scores included in the search.
> -   **Step 2**: Check the score at the midpoint of the current region of the table (middle row, middle column).
>     -   **Step 2.1**: If the middle score is \`85\`, you’ve found the student, stop the search.
>     -   **Step 2.2**: If the middle score is less than \`85\`, for example, \`78\`, eliminate all cells above and to the left of the middle element, then repeat Step 2 with the remaining lower-right region.
>     -   **Step 2.3**: If the middle score is greater than \`85\`, for example, \`92\`, eliminate all cells below and to the right of the middle element, then repeat Step 2 with the remaining upper-left region.
> -   **Step 3**: If the search space reduces to zero and \`85\` is never found, no student in the table has that score.

## Advantages

2D binary search is highly efficient for finding items in large, sorted grids. By systematically eliminating large sections of the table at each step, it drastically reduces the number of comparisons compared to scanning each cell individually. The key advantages of 2D binary search are outlined below:

> -   **Efficiency:** 2D binary search reduces the search space exponentially at each step, making it far faster than linear scanning of all rows and columns, especially for large grids.
> -   **Leverages structure:** The algorithm takes advantage of the sorted rows and columns to make safe eliminations of entire regions of the grid.
> -   **Predictable performance:** Like binary search, its time complexity is **O(log(M) + log(N))** for an **M x N** grid when applied optimally, giving consistent and scalable performance.

## Limitations

Despite its efficiency, 2D binary search has certain constraints. It relies heavily on the table's sorted structure and cannot be applied to grids that do not meet these ordering conditions. The main limitations are summarised below:

> -   **Requires a sorted grid:** The algorithm only works if each row and column is sorted and the relative ordering of rows is preserved. Unsorted or partially sorted grids break the logic.
> -   **Complex implementation:** Compared to linear scanning, 2D binary search involves more sophisticated calculations to map indices and manage regions, making it slightly harder to implement.
> -   **Limited flexibility:** Changes to the dataset (e.g., inserting or removing rows/columns) may require recomputing the search logic or re-sorting the grid.

***

# Understanding 2D binary search algorithm

The strategy from the earlier example can be extended to create a 2D binary search algorithm. To explain this algorithm, we will use a 2D matrix sorted in ascending order both row-wise and column-wise, and search for a target value. For the algorithm to work, the input array should meet the two conditions below.

> -   The 2D matrix should be **sorted in rows and columns**, meaning each row and each column is sorted in ascending order.
> -   The last number in each row should be **less than or equal to** the first number in the next row.

// Diagram: Valid input for 2D binary search

If either of these conditions is violated, the algorithm may fail to locate the target element. This can be seen in the example below, where the input does not satisfy the required sorting conditions.

// Diagram: Invalid inputs for 2D binary search

For such input, we can tweak the existing binary search algorithm to search the 2D matrix rather than using the poorly performing linear search.

## Flatten the 2D matrix

We already know how to execute a binary search in a sorted array. If we flatten this 2D matrix into a 1D sorted array, we can use binary search to find the target. There are two ways to do it

### 1\. Create a new 1D array

Creating a new 1D array and copying values from the 2D matrix presents two issues. First, allocating an additional **O(N\*M)** memory for the new array is required. Second, iterating over the 2D matrix to copy all values adds an **O(N\*M)** time complexity to the algorithm. Even if the binary search algorithm is applied to the new 1D array, the time complexity will always be **O(N\*M)** due to the sequential copy operation. This contradicts the idea that binary search is expected to maintain a logarithmic time complexity in all cases.

// Diagram: Copy all the values from the 2D matrix to a new 1D array

### 2\. Use a virtual 1D array

A better way to flatten the 2D matrix is to create a virtual 1D array within it, where each index of this virtual array maps to one cell in the 2D matrix.

// Diagram: Each index of the virtual array maps to one cell in the 2D matrix

If we have a 2D matrix with **N** rows and **M** columns. This would give us a total of **(N\*M)** cells. Our virtual 1D array would also be the same size to accommodate all these cells. For a given cell `[row, col]` in the 2D matrix, the corresponding index `i` in the virtual array could be calculated using the following function

> -   \`i = row \* N + col\`

// Diagram: 2D matrix cell to an index in the virtual array

Similarly, for a given index `i` in the virtual array, the corresponding row and column numbers in the 2D matrix could be calculated using the following function

> -   \`row = i / M\`
> -   \`col = i % M\`

// Diagram: Index in the virtual array to a cell in 2D matrix

## Algorithm

The 2D Binary Search algorithm searches for a target value in a sorted 2D matrix with **N** rows and **M** columns, where each row and column is sorted in ascending order. The algorithm treats the matrix as a flattened 1D array of size **N×M** to apply standard binary search efficiently. The algorithm begins by initializing two indices that define the current search range in which the target value may exist.

> -   \`low\` is set to the first index of the virtual array i.e \`0\`.
> -   \`high\` is set to the last index of the virtual array i.e \`(N \* M) - 1\`.

// Diagram: Initialize the low and high indices

The algorithm enters a loop that continues as long as `low <= high`. This condition ensures that there are still elements remaining in the search range that could potentially match the target value.

**Why do we continue while `low <= high`?**

In a 2D binary search mapped to a virtual 1D array, we continue while `low <= high` to ensure that all possible positions in the matrix are examined. When low becomes greater than high, it means the search range is empty and every element has been considered. At this point, the target cannot be present in the matrix.

// Diagram: The loop terminates when the low index exceeds the high index

Inside the loop, the algorithm calculates the middle index using:

> -   \`mid = low + (high - low ) / 2\`
>
> The middle index is mapped to 2D indices using the number of columns M:
>
> -   \`row = mid / M\`
> -   \`col = mid % M\`

// Diagram: Compute the middle index using the formula

Once the `row` and `col` indices are determined, the algorithm applies the standard binary search procedure by comparing the target value with `matrix[row][col]`, the middle element of the current search range. Based on this comparison, it then makes one of three possible decisions to continue the search.

### 1\. matrix\[row\]\[col\] == target

The search is complete when the middle element is **equal** to the target value, indicating that the matrix has been narrowed down to the exact position of the element. In this case, `true` is returned, indicating the target is found.

// Diagram: The target is found at the middle index of the array

### 2\. matrix\[row\]\[col\] < target

If the value at the middle index is **less** than the target, the target cannot be in the left portion of the matrix or at the middle position (i.e the first half of the virtual array). As a result, the algorithm discards this section and continues the search in the right half by updating `low = mid + 1`.

// Diagram: Discard the first half of the array, including the middle element

### 3\. matrix\[row\]\[col\] > target

If the value at the middle index is **greater** than the target, the target cannot be in the right portion of the matrix or at the middle position (i.e the first half of the virtual array). The algorithm therefore discards this section and continues the search in the left half by updating `high = mid - 1`.

// Diagram: Discard the second half of the array, including the middle element

The algorithm repeatedly compares the target with the element at `matrix[row][col]` (mapped from the virtual 1D array) and narrows the search space accordingly. If the loop terminates without finding the target, it indicates that the element does not exist in the matrix, and the algorithm returns `false` to signal an unsuccessful search.

// Diagram: Find an element in a 2D matrix using binary search

> **Algorithm**
>
> -   **Step 1:** Initialize matrix dimensions, set \`rows = matrix.size()\`, \`cols = matrix\[0\].size() \`
> -   **Step 2:** Initialize search boundaries, set \`low = 0\`, \`high = rows \* cols - 1 \`
> -   **Step 3:** Iterate while \`low <= high\`
>     -   **Step 3.1:** Calculate middle index \`mid = low + (high - low) / 2\`
>     -   **Step 3.2:** Map middle index to 2D coordinates, set \`row = mid / cols\`, \`col = mid % cols\`
>     -   **Step 3.3:** If \`matrix\[row\]\[col\] == target\`:
>         -   **Step 3.3.1:** Return \`true\`
>     -   **Step 3.4:** Else If \`matrix\[row\]\[col\] < target\`:
>         -   **Step 3.4.1:** Set \`low = mid + 1\`
>     -   **Step 3.5:** Else if \`matrix\[row\]\[col\] > target\`:
>         -   **Step 3.5.1:** Set \`high = mid - 1\`
> -   **Step 4:** If the loop ends without returning, the target is not in the matrix, return \`false\`

## Implementation

Below is the implementation of 2D binary search. It treats the 2D matrix as a virtual 1D array, mapping 1D indices to 2D row and column positions. This allows us to apply the standard binary search procedure directly, efficiently narrowing down the search space until the target value is found or confirmed absent.

C++

```cpp
using namespace std;

class Solution {
public:
    bool binarySearch2D(vector<vector<int>> &matrix, int target) {

        // Get the number of rows in the matrix
        int rows = matrix.size();

        // Get the number of columns in the matrix
        int cols = matrix[0].size();

        // Initialize the low index
        int low = 0;

        // Initialize the high index
        int high = rows * cols - 1;

        // Perform binary search until low index crosses the high index
        while (low <= high) {

            // Calculate the middle index
            int mid = low + (high - low) / 2;

            // Map the 1D index to 2D coordinates
            int row = mid / cols;
            int col = mid % cols;

            // If the middle value is equal to the target, return
            // true
            if (matrix[row][col] == target) {
                return true;
            }

            // Else if the middle value is less than the target, update
            // the low index
            else if (matrix[row][col] < target) {
                low = mid + 1;
            }

            // Else if the middle value is greater than the target,
            // update the high index
            else {
                high = mid - 1;
            }

        // Return false if the target is not found
        return false;
    }
};
```

Java

```java
class Solution {
    public boolean binarySearch2D(int[][] matrix, int target) {

        // Get the number of rows in the matrix
        int rows = matrix.length;

        // Get the number of columns in the matrix
        int cols = matrix[0].length;

        // Initialize the low index
        int low = 0;

        // Initialize the high index
        int high = rows * cols - 1;

        // Perform binary search until low index crosses the high index
        while (low <= high) {

            // Calculate the middle index
            int mid = low + (high - low) / 2;

            // Map the 1D index to 2D coordinates
            int row = mid / cols;
            int col = mid % cols;

            // If the middle value is equal to the target, return
            // true
            if (matrix[row][col] == target) {
                return true;
            }

            // Else if the middle value is less than the target, update
            // the low index
            else if (matrix[row][col] < target) {
                low = mid + 1;
            }

            // Else if the middle value is greater than the target,
            // update the high index
            else {
                high = mid - 1;
            }

        // Return false if the target is not found
        return false;
    }
```

Typescript

```typescript
export class Solution {
    binarySearch2D(matrix: number[][], target: number): boolean {

        // Get the number of rows in the matrix
        const rows: number = matrix.length;

        // Get the number of columns in the matrix
        const cols: number = matrix[0].length;

        // Initialize the low index
        let low: number = 0;

        // Initialize the high index
        let high: number = rows * cols - 1;

        // Perform binary search until low index crosses the high index
        while (low <= high) {

            // Calculate the middle index
            const mid: number = low + Math.floor((high - low) / 2);

            // Map the 1D index to 2D coordinates
            const row: number = Math.floor(mid / cols);
            const col: number = mid % cols;

            // If the middle value is equal to the target, return
            // true
            if (matrix[row][col] === target) {
                return true;
            }

            // Else if the middle value is less than the target, update
            // the low index
            else if (matrix[row][col] < target) {
                low = mid + 1;
            }

            // Else if the middle value is greater than the target,
            // update the high index
            else {
                high = mid - 1;
            }

        // Return false if the target is not found
        return false;
    }
```

Javascript

```javascript
export class Solution {
    binarySearch2D(matrix, target) {

        // Get the number of rows in the matrix
        const rows = matrix.length;

        // Get the number of columns in the matrix
        const cols = matrix[0].length;

        // Initialize the low index
        let low = 0;

        // Initialize the high index
        let high = rows * cols - 1;

        // Perform binary search until low index crosses the high index
        while (low <= high) {

            // Calculate the middle index
            const mid = low + Math.floor((high - low) / 2);

            // Map the 1D index to 2D coordinates
            const row = Math.floor(mid / cols);
            const col = mid % cols;

            // If the middle value is equal to the target, return
            // true
            if (matrix[row][col] === target) {
                return true;
            }

            // Else if the middle value is less than the target, update
            // the low index
            else if (matrix[row][col] < target) {
                low = mid + 1;
            }

            // Else if the middle value is greater than the target,
            // update the high index
            else {
                high = mid - 1;
            }

        // Return false if the target is not found
        return false;
    }
```

Python

```python
from typing import List

class Solution:
    def binary_search_2d(
        self, matrix: List[List[int]], target: int
    ) -> bool:

        # Get the number of rows in the matrix
        rows: int = len(matrix)

        # Get the number of columns in the matrix
        cols: int = len(matrix[0])

        # Initialize the low index
        low: int = 0

        # Initialize the high index
        high: int = rows * cols - 1

        # Perform binary search until low index crosses the high index
        while low <= high:

            # Calculate the middle index
            mid: int = low + (high - low) // 2

            # Map the 1D index to 2D coordinates
            row, col = mid // cols, mid % cols

            # If the middle value is equal to the target, return
            # true
            if matrix[row][col] == target:
                return True

            # Else if the middle value is less than the target, update
            # the low index
            elif matrix[row][col] < target:
                low = mid + 1

            # Else if the middle value is greater than the target,
            # update the high index
            else:
                high = mid - 1

        # Return False if the target is not found
        return False
```

## Complexity analysis

In all cases, the time complexity of a 2D binary search is **O(log(N\*M))**, where **N** is the number of rows and M is the number of columns in the 2D array. The reason for this time complexity is that binary search repeatedly divides the search space in half at each step.

Since the algorithm does not allocate any new memory to perform the search, the space complexity is constant, i.e. **O(1)**.

> **Best case**
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(log(N\*M))**
>
> **Average case**
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(log(N\*M))**
>
> **Worst case**
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(log(N\*M))**

***

# 2D binary search

## Problem Statement

Given an **N x M** integer **matrix** and an integer **target**, write a function to search the target in the matrix. If the target exists, return `true` otherwise, return `false`. The matrix has the following properties.

> -   Integers in each row in the matrix are sorted in non-descending order.
> -   The first value in each row is greater than the last integer of the previous row.

You must do this in a time complexity of `O(log(N*M))`.

### Example 1

> -   **Input:** matrix = \[\[1, 2, 2, 4\], \[5, 5, 5, 5\], \[9, 10, 11, 12\]\], target = 12
> -   **Output:** true
> -   **Explanation:** 12 is present in the matrix.

### Example 2

> -   **Input:** matrix = \[\[1, 2, 2, 4\], \[5, 5, 5, 5\], \[9, 10, 11, 12\]\], target = 5
> -   **Output:** true
> -   **Explanation:** 5 is present in the matrix.

### Example 3

> -   **Input:** matrix = \[\[1, 2, 2, 4\], \[5, 5, 5, 5\], \[9, 10, 11, 12\]\], target = 13
> -   **Output:** false
> -   **Explanation:** 13 is not present in the matrix.

## Solution

```cpp
using namespace std;

class Solution {
public:
    bool binarySearch2D(vector<vector<int>> &matrix, int target) {

        // Get the number of rows in the matrix
        int rows = matrix.size();

        // Get the number of columns in the matrix
        int cols = matrix[0].size();

        // Initialize the low index
        int low = 0;

        // Initialize the high index
        int high = rows * cols - 1;

        // Perform binary search until low index crosses the high index
        while (low <= high) {

            // Calculate the middle index
            int mid = low + (high - low) / 2;

            // Map the middle index to 2D coordinates
            int row = mid / cols;
            int col = mid % cols;

            // If the middle value is equal to the target, return
            // true
            if (matrix[row][col] == target) {
                return true;
            }

            // Else if the middle value is less than the target, update
            // the low index
            else if (matrix[row][col] < target) {
                low = mid + 1;
            }

            // Else if the middle value is greater than the target,
            // update the high index
            else {
                high = mid - 1;
            }
        }

        // Return false if the target is not found
        return false;
    }
};
```
