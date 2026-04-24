# K limited submatrix sum

## Problem Statement

Given an **NxM** integer **matrix** and a positive integer **k** such that `0 < k < N <= M`, write a function to find and return the maximum sum of all the submatrices of size `kxk`.

You must do this in a time complexity of `O(N*M)`.

### Example 1

> -   **Input:** matrix = \[\[1, 2, 9\], \[5, 3, 8\], \[4, 6, 7\]\], k = 2
> -   **Output:** 24
> -   **Explanation:** All the possible submatrices are shown above, the one with largest sum is indicated by orange color.

### Example 2

> -   **Input:** matrix = \[\[1, 2, 3\], \[4, 5, 6\], \[7, 8, 9\]\], k = 3
> -   **Output:** 45
> -   **Explanation:** There is only one submatrix possible as shown in the above diagram.

## Solution

```cpp
#include <climits>

using namespace std;

class Solution {
public:
    int kLimitedSubmatrixSum(vector<vector<int>> &matrix, int k) {
        int rows = matrix.size();
        int cols = matrix[0].size();

        // Precompute the prefix sum matrix
        vector<vector<int>> prefixSum(
            rows + 1, vector<int>(cols + 1, 0)
        );
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= cols; j++) {

                // Calculate the sum of values in the submatrix (0,0) to
                // (i-1,j-1) and store it in prefixSum[i][j]
                prefixSum[i][j] =
                    prefixSum[i - 1][j] + prefixSum[i][j - 1] -
                    prefixSum[i - 1][j - 1] + matrix[i - 1][j - 1];
            }
        }

        int maxSum = INT_MIN;
        vector<vector<int>> maxSumSubmatrix(k, vector<int>(k, 0));

        // Find the maximum sum submatrix
        for (int i = 0; i <= rows - k; i++) {
            for (int j = 0; j <= cols - k; j++) {

                // Calculate the sum of values in the submatrix (i,j) to
                // (i+k-1,j+k-1)
                int sum = prefixSum[i + k][j + k] - prefixSum[i][j + k] -
                          prefixSum[i + k][j] + prefixSum[i][j];

                if (sum > maxSum) {
                    maxSum = sum;
                }
            }
        }

        return maxSum;
    }
};
```

***

# Maximum submatrix sum

## Problem Statement

Given an **NXM** integer **matrix**, write a function to find and return the maximum sum of all the submatrices in it.

### Example 1

> -   **Input:** matrix = \[\[1, 2, 9\], \[-5, 3, 8\], \[4, 6, -7\]\]
> -   **Output:** 22
> -   **Explanation:** The maximum sum submatrix is shown in the above diagram.

### Example 2

> -   **Input:** matrix = \[\[1, -2, -3\], \[-4, -5, -6\], \[-7, -8, -9\]\]
> -   **Output:** 1
> -   **Explanation:** The maximum sum submatrix is shown in the above diagram.

## Solution

```cpp
#include <climits>

using namespace std;

class Solution {
public:
    int maximumSubmatrixSum(vector<vector<int>> &matrix) {
        int n = matrix.size();

        // Create a prefix sum matrix with size (n+1) x (n+1)
        vector<vector<int>> prefixSum(n + 1, vector<int>(n + 1, 0));

        // Compute the prefix sum matrix
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {

                // Each cell in the prefix sum matrix is the sum of the
                // corresponding submatrix in the original matrix
                prefixSum[i][j] =
                    prefixSum[i - 1][j] + prefixSum[i][j - 1] -
                    prefixSum[i - 1][j - 1] + matrix[i - 1][j - 1];
            }
        }

        int maxSum = INT_MIN;

        // Iterate over all possible submatrices
        for (int r1 = 1; r1 <= n; r1++) {
            for (int c1 = 1; c1 <= n; c1++) {
                for (int r2 = r1; r2 <= n; r2++) {
                    for (int c2 = c1; c2 <= n; c2++) {

                        // Compute the sum of the submatrix using the
                        // prefix sum matrix
                        int sum = prefixSum[r2][c2] -
                                  prefixSum[r1 - 1][c2] -
                                  prefixSum[r2][c1 - 1] +
                                  prefixSum[r1 - 1][c1 - 1];

                        // Update the maximum sum if the current sum is
                        // greater
                        maxSum = max(maxSum, sum);
                    }
                }
            }
        }

        return maxSum;
    }
};
```

***

# Design a range sum finder

## Problem Statement

Given the skeleton of a **RangeSumFinder class**, complete this class by implementing all the operations below.

> -   **RangeSumFinder(int\[\]\[\]matrix)** - Initialize the RangeSumFinder object with the matrix.
> -   **sumRegion(int row1, int col1, int row2, int col2)** - Returns the sum of a rectangle formed by the upper left corner (row1, col1) and lower right corner (row2, col2)

// Diagram: You must abide by the following constraints

1\. Each query sumRegion(row1, col1, row2, col2) should be answered in `O(1)` time.

> The input should follow the below rules:
>
> 1.  The input array should contain three lines
> 2.  The first line should contain an array that represents the list of operations, the second line of input should contain the matrix that is used to initialize the object and the third line should contain an array that represents the queries
> 3.  The first index in the first array should contain **RangeSumFinder** and the first index in the third array should contain an empty array. This is used to initialize the range sum finder.
> 4.  For every index in the first array that contains the **sumRegion** operation, the index in the third array should contain a query.
>
> **Example:**
>
> -   **Input:** \[RangeSumFinder, sumRegion, sumRegion, sumRegion\] \[\[1, 2, 3\], \[4, 5, 6\], \[7, 8, 9\]\] \[\[\], \[1, 1, 1, 1\], \[0, 0, 2, 2\], \[1, 1, 2, 2\]\]
>
> -   **Output:** \[null, 5, 45, 28\]
>
> -   **Explanation:** RangeSumFinder rangeSumFinder = new RangeSumFinder(matrix); rangeSumFinder.sumRegion(1, 1, 1, 1); // returns 5 rangeSumFinder.sumRegion(0, 0, 2, 2); // returns 45 rangeSumFinder.sumRegion(1, 1, 2, 2); // returns 28
>

## Solution

```cpp
using namespace std;

class RangeSumFinder {
public:
    vector<vector<int>> prefixSum;

    // Constructor
    RangeSumFinder(vector<vector<int>> &matrix) {

        // Number of rows in the matrix
        int rows = matrix.size();

        // Number of columns in the matrix
        int cols = matrix[0].size();

        // Create a new matrix with dimensions (rows+1) x (cols+1) and
        // initialize all elements to 0
        prefixSum =
            vector<vector<int>>(rows + 1, vector<int>(cols + 1, 0));

        // Fill in the values of the new matrix using dynamic programming
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= cols; j++) {

                // The value at prefixSum[i][j] is the sum of the current
                // element in matrix, the value above it, the value to
                // its left, and the value in the top-left corner, all
                // subtracted by the value in the top-left corner (to
                // avoid double counting)
                prefixSum[i][j] =
                    matrix[i - 1][j - 1] + prefixSum[i - 1][j] +
                    prefixSum[i][j - 1] - prefixSum[i - 1][j - 1];
            }
        }
    }

    // Method to calculate the sum of elements within a given rectangle
    int sumRegion(int row1, int col1, int row2, int col2) {

        // The sum of the rectangle is calculated using the values in the
        // new matrix prefixSum The formula is: sum =
        // prefixSum[row2+1][col2+1] - prefixSum[row1][col2 + 1] -
        // prefixSum[row2 + 1][col1] + prefixSum[row1][col1] It subtracts
        // the sum of elements above and to the left of the rectangle,
        // and adds back the sum of the elements above and to the left of
        // the rectangle, to avoid double subtraction
        return prefixSum[row2 + 1][col2 + 1] -
               prefixSum[row1][col2 + 1] - prefixSum[row2 + 1][col1] +
               prefixSum[row1][col1];
    }
};
```
