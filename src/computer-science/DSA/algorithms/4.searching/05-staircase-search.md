# Understanding the problem

2D binary search is probably the best algorithm for searching a sorted matrix. However, it only works when the conditions mentioned below are fulfilled for the input.

> -   Each row is sorted in ascending order
> -   The first element of each row is greater than the last element of the previous row.

However, in practice, data is often only partially sorted.

## Example

Imagine a teacher maintaining a table of student scores in which each row and each column is sorted in ascending order, but **the last score in one row** may be **greater than** the **first score in the next row**.

In other words, the second condition required for applying 2D binary search is not satisfied, making the standard algorithm inapplicable.

// Diagram: Sorted score table of 10 students (second codiition is not met)

Now, suppose you want to find out whether a score of `85` exists. A standard 2D binary search relies on a strict global ordering across rows and columns, so it cannot be applied here. The algorithm would assume that all elements after a certain midpoint are larger, which is clearly not true for this table.

// Diagram: Last score in one row is greater than the first score in the next row

In this scenario, the natural approach is still a sequential scan, moving row by row and column by column. While simple, this method is inefficient for large tables. The challenge is understanding the constraints imposed by partial sorting: the data is somewhat structured, but not enough for traditional 2D binary search.

// Diagram: Linear search to find the student with a score of 85

This works for small datasets, but it quickly becomes impractical when the table contains thousands, or even millions of cells. 

// Diagram: Sorted score table of thousands of students

As the dataset grows, manually checking each cell becomes time-consuming, underscoring the need for a more efficient strategy.

## Limitations of 2D binary search

Since the conditions for 2D binary search are not met, the algorithm cannot be applied to such datasets, even if the table is partially sorted.

You could also attempt binary search on each row individually, but that would still require checking every row unless you get lucky. You lose the true power of binary search, which is the ability to discard large portions of the search space.

// Diagram: Searching in a table becomes difficult at a large scale

To address this, we need a method that leverages the table’s partially sorted structure to narrow the search space efficiently, an approach more effective than performing binary search on every row.

***

# Exploring a possible solution

Now that we see how inefficient it can be to scan a large 2D table cell by cell, we need a smarter way to search for a score. The key to improving performance lies in leveraging the table’s partial sorting. It only needs to 

> -   The table should be sorted in rows and columns, meaning each row and each column is sorted in ascending order.

## Staircase search

Staircase search is an efficient technique for searching partially sorted two-dimensional grids, where each row and each column is sorted in ascending order. Still, the matrix does not meet the stricter conditions required for 2D binary search. Instead of relying on global ordering, staircase search leverages local ordering within rows and columns to systematically narrow the search region.

Looking at the problem of finding a student who scored `85` marks in a large table sorted by rows and columns, you might start at the top-right corner.

// Diagram: Examine the score of the student at the top right corner of the table

If the **current score** is **less** than `85`, the target **must be in a region with larger values**, so you move in the direction of increasing scores. From the top-right corner, this means moving downward, which eliminates the entire row above. Every value in that row is smaller than the target and therefore cannot contain it.

// Diagram: Discard the current row and move downwards

Similarly, if the **current score** is **greater** than `85`, the target **must be in a region with smaller values**, so you move toward decreasing scores. From the top-right corner, this means moving left, which eliminates the entire column to the right. Every value in that column is larger than the target and can safely be discarded.

// Diagram: Discard the current column and move toward the left

By repeating this process, stepping down or left depending on the comparison, you progressively **“walk”** through the matrix in a staircase-shaped path, discarding one row or one column at every step until the score `85` is found, or the search space is exhausted.

// Diagram: Target found by repeatedly moving down or left

By leveraging the sorted structure of the rows and columns, staircase search efficiently narrows the search region without examining every cell, making it significantly faster than a full linear scan of the table.

> -   **Step 1:** Start at the top-right corner of the 2D table of student scores.
> -   **Step 2:** Compare the current cell’s score with \`85\`.
>     -   **Step 2.1** If the current score is exactly \`85\`, you’ve found the student, stop the search.
>     -   **Step 2.2:** If the current score is less than \`85\`, for example \`78\`, move down one row because all scores to the left are smaller and cannot contain \`85\`.
>     -   **Step 2.3:** If the current score is greater than \`85\`, for example \`92\`, move left one column because all scores below are larger and cannot contain \`85\`.
> -   **Step 3:** Repeat the comparisons as you move down or left. If you step outside the boundaries of the table without finding \`85\`, then no student in the table has that score.

## Advantages

Staircase search is a highly effective technique for finding a target value in a 2D grid where each row and each column is sorted in ascending order. By intelligently navigating from the top-right corner, the algorithm eliminates an entire row or column with every comparison. The key advantages of staircase search are outlined below:

> -   **Efficiency:** Staircase search runs in **O(M + N)** time for an **M × N** grid, making it significantly faster than scanning all cells. Each step moves either left or down, ensuring steady progress toward the answer.
> -   **Simple logic:** Compared to 2D binary search, staircase search is easier to visualize and implement. You only move in two directions: down or left, based on a simple comparison.
> -   **Uses grid properties directly:** The algorithm leverages the sorted rows and columns without requiring index conversion or virtual flattening, making it intuitive and practical.
> -   **No extra space:** Staircase search operates directly on the grid and requires no additional data structures or preprocessing.

## Limitations

While staircase search is efficient and easy to apply, it also has limitations. Its performance and correctness depend entirely on the grid structure, and it cannot adapt to unsorted or inconsistently sorted data. The primary limitations are:

> -   **Requires row-wise and column-wise sorting:** The algorithm only works if both rows and columns are sorted. If either condition is violated, left/down elimination becomes unsafe, and the search may fail.
> -   **Not optimal for large grids:** For large **N × N** matrices, the worst-case time is **O(2N)**, which is slower than 2D binary search’s logarithmic behaviour. This makes staircase search less suitable for extremely large, fully dense grids.
> -   **Directional constraints:** The algorithm always moves left or down. If the grid is sorted differently (e.g., descending, or only row-sorted), staircase search cannot be applied without modification.

***

# Understanding staircase search algorithm

The strategy from the earlier example could be used to create an algorithm. To explain this algorithm, we will use a 2D matrix sorted by row and column in ascending order and search for a target number. For the algorithm to work, the input matrix should meet the condition below.

> -   The matrix should be sorted in rows and columns, meaning each row and each column is sorted in ascending order.

// Diagram: Valid input for staircase search

If the condition is violated, the algorithm may fail to locate the target element. This can be seen in the example below, where the input does not satisfy the required sorting conditions.

// Diagram: Invalid input as condition 1 is not met

## Algorithm

The Staircase Search algorithm searches for a target value in a 2D matrix with **N** rows and **M** columns where each row and each column is sorted in ascending order. It exploits the sorted property of the matrix by starting at the **top-right corner** and moving only in directions that eliminate impossible positions, achieving efficient linear-time search. The algorithm begins by initializing two indices that define the current search range in which the target value may exist.

> -   \`row = 0\` - (first row)
> -   \`col = M - 1\` - (last column)

// Diagram: Initialize the row and col indices

The algorithm enters a loop that continues as long as `row < N` and `col >= 0`. This condition guarantees that there are still elements in the search range that could potentially match the target value.

// Diagram: The loop terminates if row index equals N or col index becomes negative

At each step, the algorithm compares the target value with `matrix[row][col]`, the current element in the search. It then makes one of three possible decisions to continue the search.

### 1\. matrix\[row\]\[col\] == target

The search is complete when the current element is **equal** to the target value. In this case, the algorithm returns `true`, indicating that the target has been found in the matrix.

// Diagram: The target is found at the current cell

### 2\. matrix\[row\]\[col\] < target

If the current cell’s value is **less** than the target, the algorithm moves **down one row** by performing `row = row + 1`. This operation effectively eliminates the entire current row from consideration, since each row is sorted in ascending order and all elements to the left of the current cell are guaranteed to be smaller than the target.

// Diagram: Discard the current row and move downards

### 3\. matrix\[row\]\[col\] > target

If the current cell’s value is **greater** than the target, the algorithm moves **left one column** by performing `col = col - 1`. This operation effectively eliminates the entire current column from consideration, since each column is sorted in ascending order and all elements below the current cell are guaranteed to be larger than the target.

// Diagram: Discard the current column and move toward the left

The algorithm continues moving **down** or **left** at each step, comparing the current cell’s value with the target. The loop terminates when the target is found or when the indices go out of bounds `(row >= N or col < 0)`. If the search ends without finding the target, the algorithm returns `false`, indicating that the element does not exist in the matrix.

// Diagram: Find an element in a 2D matrix using staircase search

> **Algorithm**
>
> -   **Step 1:** Initialize matrix dimensions, set \`rows = matrix.size()\`, \`cols = matrix\[0\].size() \`
> -   **Step 2:** Initialize starting positions, set \`row = 0\`, \`col = cols - 1 \`
> -   **Step 3:** Iterate while \`row < rows && col >= 0\`
>     -   **Step 3.1:** If \`matrix\[row\]\[col\] == target\`:
>         -   **Step 3.1.1:** Return \`true\`
>     -   **Step 3.2:** Else If \`matrix\[row\]\[col\] < target\`:
>         -   **Step 3.2.1:** Set \`row = row + 1\`
>     -   **Step 3.3:** Else if \`matrix\[row\]\[col\] > target\`:
>         -   **Step 3.3.1:** Set \`col = col - 1\`
> -   **Step 4:** If the loop ends without returning, the target is not in the matrix, return \`false\`

## Implementation

Below is the implementation of the staircase search algorithm. It starts at the top-right corner of the matrix and moves down or left based on comparisons with the target, efficiently narrowing the search space until the target is found or confirmed absent.

C++

```cpp
using namespace std;

class Solution {
public:
    bool sortedMatrixSearch(vector<vector<int>> &matrix, int target) {

        // Get the number of rows in the matrix
        int rows = matrix.size();

        // Get the number of columns in the matrix
        int cols = matrix[0].size();

        // Start from the first row
        int row = 0;

        // Start from the last column
        int col = cols - 1;

// Diagram: while (row < rows && col >= 0) {

            // Continue until we reach the bottom-left or top-right
            // corner of the matrix

            // If the current element is equal to the target, return
            // true
            if (matrix[row][col] == target) {
                return true;
            }

            // Else if the current element is less than the target, move
            // to the next row
            else if (matrix[row][col] < target) {
                row++;
            }

            // Else if the current element is greater than the target,
            // move to the previous column
            else {
                col--;
            }

        // Return false if the target is not found
        return false;
    }
};
```

Java

```java
class Solution {
    public boolean sortedMatrixSearch(int[][] matrix, int target) {

        // Get the number of rows in the matrix
        int rows = matrix.length;

        // Get the number of columns in the matrix
        int cols = matrix[0].length;

        // Start from the first row
        int row = 0;

        // Start from the last column
        int col = cols - 1;

// Diagram: while (row < rows && col >= 0) {

            // Continue until we reach the bottom-left or top-right
            // corner of the matrix

            // If the current element is equal to the target, return
            // true
            if (matrix[row][col] == target) {
```

Typescript

```typescript
export class Solution {
    sortedMatrixSearch(matrix: number[][], target: number): boolean {

        // Get the number of rows in the matrix
        const rows: number = matrix.length;

        // Get the number of columns in the matrix
        const cols: number = matrix[0].length;

        // Start from the first row
        let row: number = 0;

        // Start from the last column
        let col: number = cols - 1;

// Diagram: while (row < rows && col >= 0) {

            // Continue until we reach the bottom-left or top-right
            // corner of the matrix

            // If the current element is equal to the target, return
            // true
            if (matrix[row][col] === target) {
```

Javascript

```javascript
export class Solution {
    sortedMatrixSearch(matrix, target) {

        // Get the number of rows in the matrix
        const rows = matrix.length;

        // Get the number of columns in the matrix
        const cols = matrix[0].length;

        // Start from the first row
        let row = 0;

        // Start from the last column
        let col = cols - 1;

// Diagram: while (row < rows && col >= 0) {

            // Continue until we reach the bottom-left or top-right
            // corner of the matrix

            // If the current element is equal to the target, return
            // true
            if (matrix[row][col] === target) {
```

Python

```python
from typing import List

class Solution:
    def sorted_matrix_search(
        self, matrix: List[List[int]], target: int
    ) -> bool:

        # Get the number of rows in the matrix
        rows: int = len(matrix)

        # Get the number of columns in the matrix
        cols: int = len(matrix[0])

        # Start from the first row
        row: int = 0

        # Start from the last column
        col: int = cols - 1

        while row < rows and col >= 0:

            # Continue until we reach the bottom-left or top-right corner
            # of the matrix
```

## Complexity analysis

The best-case scenario occurs when the target is located at the top-right corner of the matrix. In this case, the algorithm finds the target immediately, resulting in **O(1)** time complexity.

// Diagram: Best case: Element found at the top right corner

The worst-case scenario occurs when the target is at the bottom-left corner of the matrix. Here, the search must traverse all rows and all columns, visiting a total of **N + M** cells in a matrix with **N** rows and Mcolumns. This gives a worst-case time complexity of **O(N + M)**.

// Diagram: Worst case: Element found at the bottom left corner

The average-case complexity falls between these extremes but remains **O(N + M)**, since the algorithm may need to traverse a significant portion of the matrix before locating the target or confirming its absence.

// Diagram: Average case: Element found randomly in the matrix

Since the algorithm does not allocate any new memory to perform the search, the space complexity is constant, i.e. **O(1)**.

> **Best case** - The target book is kept in the last column of the first row.
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(1)**
>
> **Average case**
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N + M)**
>
> **Worst case** - The target book is kept in the first column of the last row.
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N + M)**

***

# Staircase search

## Problem Statement

Given an **N x M** integer **matrix** and an integer **target**, write a function to search the target in the matrix. If the target exists, return `true`. Otherwise, return `false`. The matrix has the following properties.

> -   Integers in each matrix row are sorted in ascending order from left to right.
> -   Integers in each column of the matrix are sorted in ascending order from top to bottom.

You must do this in a time complexity of `O(N + M)`.

### Example 1

> -   **Input:** matrix = \[\[1, 2, 3, 4\], \[5, 6, 7, 8\], \[9, 10, 11, 12\]\], target = 12
> -   **Output:** true
> -   **Explanation:** 12 is present in the matrix.

### Example 2

> -   **Input:** matrix = \[\[1, 2, 3, 4\], \[5, 6, 7, 8\], \[9, 10, 11, 12\]\], target = 7
> -   **Output:** true
> -   **Explanation:** 7 is present in the matrix.

### Example 3

> -   **Input:** matrix = \[\[1, 2, 3, 4\], \[5, 6, 7, 8\], \[9, 10, 11, 12\]\], target = 13
> -   **Output:** false
> -   **Explanation:** 13 is not present in the matrix.

## Solution

```cpp
using namespace std;

class Solution {
public:
    bool staircaseSearch(vector<vector<int>> &matrix, int target) {

        // Get the number of rows in the matrix
        int rows = matrix.size();

        // Get the number of columns in the matrix
        int cols = matrix[0].size();

        // Start from the first row
        int row = 0;

        // Start from the last column
        int col = cols - 1;

        while (row < rows && col >= 0) {

            // Continue until we reach the bottom-left or top-right
            // corner of the matrix

            // If the current element is equal to the target, return
            // true
            if (matrix[row][col] == target) {
                return true;
            }

            // Else if the current element is less than the target, move
            // to the next row
            else if (matrix[row][col] < target) {
                row++;
            }

            // Else if the current element is greater than the target,
            // move to the previous column
            else {
                col--;
            }
        }

        // Return false if the target is not found
        return false;
    }
};
```
