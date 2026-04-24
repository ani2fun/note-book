# Matrix chain multiplication

## Problem Statement

Given an array **dimensions**, write a function to find and return the minimum cost to multiply these matrices. The cost of matrix multiplication is defined by the scalar multiplication of the two matrices.

A chain of matrices is represented in a dimensions array such that the dimensions of the 1st matrix is equal to dimensions\[0\]\*dimensions\[1\], the 2nd matrix is equal to dimensions\[1\]\*dimensions\[2\], and so on.

// Diagram: For e.g., a dimensions array of \[10, 20, 30\] represents two matrices with dimensions 10\20 and 20\30

### Example 1

> -   **Input:** dimensions = \[4, 5, 3, 2\]
> -   **Output:** 70
> -   **Explanation:** We have three matrices A = \[4x5\], B = \[5x3\] and C = \[3x2\]. The most optimum way to multiply them is in the order (A\*(B\*C)). The cost of multiplications is given below:
> -   (B\*C) = \[5\*3\] \* \[3\*2\] = 5\*3\*2 = 30, result matrix size = \[5\*2\]
> -   A\*(B\*C) = \[4\*5\] \* \[5\*2\] = 4\*5\*2 = 40, result matrix = \[4\*2\] Total cost = 30 + 40 = 70

### Example 2

> -   **Input:** dimensions = \[10, 30, 5, 60\]
> -   **Output:** 4500
> -   **Explanation:** We have three matrices A = \[10x30\], B = \[30x5\] and C = \[5x60\]. The most optimum way to multiply them is in the order ((A\*B)\*C). The cost of multiplications is given below:
> -   (A\*B) = \[10\*30\] \* \[30\*5\] = 10\*30\*5 = 1500, result matrix size = \[10\*5\]
> -   ((A\*B)\*C) = \[10\*5\] \* \[5\*60\] = 10\*5\*60 = 3000, result matrix = \[10\*50\] Total cost = 1500 + 3000 = 4500

### Example 3

> -   **Input:** dimensions = \[10, 30, 40\]
> -   **Output:** 12000
> -   **Explanation:** We have two matrices A = \[10x30\], B = \[30x40\] and C = \[5x60\]. The most optimum way to multiply them is in the order (A\*B) which gives us. The cost of multiplications is given below:
> -   (A\*B) = \[10\*30\] \* \[30\*40\] = 10\*30\*40 = 12000, result matrix size = \[10\*40\] Total cost = 12000

## Solution

```cpp
#include <climits>

using namespace std;

class Solution {
public:
    int matrixChainMultiplication(vector<int> &dimensions) {
        int n = dimensions.size() - 1;

        // Create a 2D vector `dp` to store the minimum costs of
        // multiplying matrices
        vector<vector<int>> dp(n + 1, vector<int>(n + 1, 0));

        // Loop over the chain length `l` (number of matrices in the
        // chain)
        for (int l = 2; l <= n; ++l) {

            // Loop over the starting index `i` of the chain
            for (int i = 1; i <= n - l + 1; i++) {

                // Calculate the ending index `j` of the chain
                int j = i + l - 1;

                // Set the initial value of `dp[i][j]` to infinity
                dp[i][j] = INT_MAX;

                // Loop over the possible partition positions `k` within
                // the chain
                for (int k = i; k <= j - 1; k++) {

                    // Calculate the cost of multiplying matrices from
                    // `i` to `k` and from `k+1` to `j`, as well as the
                    // cost of multiplying the resulting matrices
                    int cost = dp[i][k] + dp[k + 1][j] +
                               dimensions[i - 1] * dimensions[k] *
                                   dimensions[j];

                    // Update the minimum cost if the calculated cost is
                    // smaller
                    if (cost < dp[i][j])
                        dp[i][j] = cost;
                }
            }
        }

        // Return the minimum cost of multiplying the matrices from the
        // first to the last
        return dp[1][n];
    }
};
```
