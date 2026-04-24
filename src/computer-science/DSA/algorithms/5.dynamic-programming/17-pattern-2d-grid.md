# Longest ascending route

## Problem Statement

Given an **NxM** integer **matrix**, write a function to find and return the length of the longest increasing path in the matrix. You can only move in the four cardinal directions i.e. (left, right, up, and down).

### Example 1

> -   **Input:** matrix = \[\[1, 2, 9\], \[5, 3, 8\], \[4, 6, 7\]\]
> -   **Output:** 7
> -   **Explanation:** The longest increasing path is \[1, 2, 3, 6, 7, 8, 9\].

### Example 2

> -   **Input:** matrix = \[\[1, 2, 3\], \[4, 5, 6\], \[7, 8, 9\]\]
> -   **Output:** 5
> -   **Explanation:** There are multiple longest increasing paths, one of which is \[1, 2, 3, 6, 9\].

## Solution

```cpp
using namespace std;

class Solution {
public:
    int dfs(
        vector<vector<int>> &matrix,
        int row,
        int col,
        vector<vector<int>> &dp
    ) {
        int rows = matrix.size();
        int cols = matrix[0].size();

        if (dp[row][col] != -1) {
            return dp[row][col];
        }

        int maxLength = 1;

        // Array for row directions: up, right, down, left
        int dx[] = {-1, 0, 1, 0};

        // Array for column directions: up, right, down, left
        int dy[] = {0, 1, 0, -1};

        // Explore all four directions
        for (int i = 0; i < 4; i++) {

            // Get the new row index
            int newRow = row + dx[i];

            // Get the new column index
            int newCol = col + dy[i];

            // Check if the new position is within bounds and the value
            // is greater than the current position
            if (newRow >= 0 && newRow < rows && newCol >= 0 &&
                newCol < cols &&
                matrix[newRow][newCol] > matrix[row][col]) {

                // Recursively call dfs and update maxLength
                maxLength =
                    max(maxLength, 1 + dfs(matrix, newRow, newCol, dp));
            }
        }

        // Store the computed maxLength for current position in the dp
        // matrix
        dp[row][col] = maxLength;
        return maxLength;
    }

    int longestAscendingRoute(vector<vector<int>> &matrix) {
        int rows = matrix.size();
        int cols = matrix[0].size();

        // Initialize dp matrix with -1s
        vector<vector<int>> dp(rows, vector<int>(cols, -1));
        int maxLength = 0;

        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {

                // Call dfs for each position and update maxLength
                maxLength = max(maxLength, dfs(matrix, row, col, dp));
            }
        }

        // Return the final maxLength
        return maxLength;
    }
};
```

***

# Largest square area

## Problem Statement

Given a **matrix** filled with values that are either `0`, or `1`, write a function to find and return the area of the largest square containing only `1s`.

### Example 1

> -   **Input:** grid = \[\[1, 1, 0, 0\], \[0, 0, 1, 1\], \[1, 0, 1, 1\], \[1, 0, 0, 0\]\]
> -   **Output:** 4
> -   **Explanation:** The largest area is shown in the diagram above.

### Example 2

> -   **Input:** grid = \[\[1, 1, 0, 0\], \[0, 1, 1, 1\], \[1, 1, 1, 1\], \[1, 0, 0, 0\]\]
> -   **Output:** 4
> -   **Explanation:** There are two squares with largest area s shown in the diagram above.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int largestSquareArea(vector<vector<int>> &matrix) {
        int rows = matrix.size();
        int cols = matrix[0].size();
        int maxSize = 0;

        // Create a 2D dynamic programming table
        vector<vector<int>> dp(rows, vector<int>(cols, 0));

        // Fill the first row and column of the dp table
        for (int row = 0; row < rows; row++) {
            dp[row][0] = matrix[row][0];
            maxSize = max(maxSize, dp[row][0]);
        }

        for (int col = 0; col < cols; col++) {
            dp[0][col] = matrix[0][col];
            maxSize = max(maxSize, dp[0][col]);
        }

        // Fill the remaining dp table using the recurrence relation
        for (int row = 1; row < rows; row++) {
            for (int col = 1; col < cols; col++) {
                if (matrix[row][col] == 1) {

                    // Calculate the size of the square submatrix ending
                    // at (row, col) based on the sizes of the
                    // submatrices ending at (row-1, col-1), (row-1,
                    // col), and (row, col-1)
                    dp[row][col] =
                        min(dp[row - 1][col - 1],
                            min(dp[row - 1][col], dp[row][col - 1])) +
                        1;
                    maxSize = max(maxSize, dp[row][col]);
                }
            }
        }

        return maxSize * maxSize;
    }
};
```

***

# Destination path count

## Problem Statement

You are given a **NXM** integer **matrix** where each cell has a non-negative cost associated with it, you are also given a non-negative integer **cost**. Write a function to find and return the number of paths to reach the cell `(N-1, M-1)` from the cell `(0,0)`such that the cost of the path is equal to the given cost. You can only move one unit down or one unit right from a given cell.

### Example 1

> -   **Input:** matrix = \[\[1, 2, 9\], \[5, 3, 8\], \[4, 6, 7\]\], cost = 19
> -   **Output:** 1
> -   **Explanation:** The possible path is shown in the diagram above.

### Example 2

> -   **Input:** matrix = \[\[1, 2, 3\], \[1, 5, 6\], \[2, 8, 9\]\], cost = 21
> -   **Output:** 2
> -   **Explanation:** The possible paths are shown in the diagram above.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    int destinationPathCountHelper(
        vector<vector<int>> &matrix,
        int row,
        int col,
        int cost,
        unordered_map<string, int> &dp
    ) {

        // base case
        if (cost < 0) {
            return 0;
        }

        // if we are at the first cell (0, 0)
        if (row == 0 && col == 0) {
            if (matrix[0][0] - cost == 0) {
                return 1;
            } else {
                return 0;
            }
        }

        // construct a unique map key from dynamic elements of the input
        string key = to_string(row) + "|" + to_string(col) + "|" +
                     to_string(cost);

        // if the subproblem is seen for the first time, solve it and
        // store its result in a map
        if (dp.find(key) == dp.end()) {

            // if we are at the first row, we can only go left
            if (row == 0) {
                dp[key] = destinationPathCountHelper(
                    matrix, 0, col - 1, cost - matrix[row][col], dp
                );
            }

            // if we are at the first column, we can only go up
            else if (col == 0) {
                dp[key] = destinationPathCountHelper(
                    matrix, row - 1, 0, cost - matrix[row][col], dp
                );
            }

            // recur to count total paths by going both left and top
            else {
                dp[key] =
                    destinationPathCountHelper(
                        matrix, row - 1, col, cost - matrix[row][col], dp
                    ) +
                    destinationPathCountHelper(
                        matrix, row, col - 1, cost - matrix[row][col], dp
                    );
            }
        }

        // return the total number of paths to reach cell (m, n)
        return dp[key];
    }

    int destinationPathCount(vector<vector<int>> &matrix, int cost) {

        // base case
        if (matrix.size() == 0) {
            return 0;
        }

        int row = matrix.size();
        int col = matrix[0].size();

        // create a map to store solutions to subproblems
        unordered_map<string, int> dp;

        return destinationPathCountHelper(
            matrix, row - 1, col - 1, cost, dp
        );
    }
};
```

***

# Largest plus of 1’s

## Problem Statement

Given a **matrix** filled with values that are either `0`, or `1`, write a function to find and return the size of the largest plus formed by `1s`.

The length and breadth of the plus sign should be the same.

### Example 1

> -   **Input:** grid = \[\[1, 1, 1, 0\], \[0, 1, 1, 1\], \[1, 1, 1, 1\], \[1, 0, 1, 0\]\]
> -   **Output:** 5
> -   **Explanation:** The largest plus sign is shown in the image above.

### Example 2

> -   **Input:** grid = \[\[1, 1, 1, 1, 1\], \[1, 1, 1, 1, 1\], \[1, 1, 1, 1, 1\], \[1, 1, 1, 1, 1\], \[1, 1, 1, 1, 1\]\]
> -   **Output:** 9
> -   **Explanation:** The largest plus sign is shown in the image above.

### Example 3

> -   **Input:** grid = \[\[1, 1, 1, 0\], \[0, 1, 0, 1\], \[1, 1, 1, 1\], \[1, 0, 1, 0\]\]
> -   **Output:** 5
> -   **Explanation:** The largest plus sign is shown in the image above.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int largestPlusOf1s(vector<vector<int>> &matrix) {
        int rows = matrix.size();
        if (rows == 0) {
            return 0;
        }
        int cols = matrix[0].size();
        if (cols == 0) {
            return 0;
        }

        // Create matrices to store the lengths of continuous 1's in each
        // direction
        vector<vector<int>> left(rows, vector<int>(cols, 0));
        vector<vector<int>> right(rows, vector<int>(cols, 0));
        vector<vector<int>> top(rows, vector<int>(cols, 0));
        vector<vector<int>> bottom(rows, vector<int>(cols, 0));

        // Calculate the lengths of continuous 1's in the left and right
        // directions for each row
        for (int row = 0; row < rows; row++) {
            top[row][0] = matrix[row][0];
            bottom[row][cols - 1] = matrix[row][cols - 1];
            for (int col = 1; col < cols; col++) {
                if (matrix[row][col] == 1) {

                    // Increment the length of continuous 1's from the
                    // left
                    left[row][col] = left[row][col - 1] + 1;
                }
                if (matrix[row][cols - 1 - col] == 1) {

                    // Increment the length of continuous 1's from the
                    // right
                    right[row][cols - 1 - col] = right[row][cols - col] + 1;
                }
            }
        }

        // Calculate the lengths of continuous 1's in the top and bottom
        // directions for each column
        for (int col = 0; col < cols; col++) {
            left[0][col] = matrix[0][col];
            right[rows - 1][col] = matrix[rows - 1][col];
            for (int row = 1; row < rows; row++) {
                if (matrix[row][col] == 1) {

                    // Increment the length of continuous 1's from the
                    // top
                    top[row][col] = top[row - 1][col] + 1;
                }
                if (matrix[rows - 1 - row][col] == 1) {

                    // Increment the length of continuous 1's from the
                    // bottom
                    bottom[rows - 1 - row][col] = bottom[rows - row][col] + 1;
                }
            }
        }

        int maxSize = 0;

        // Find the maximum size of the plus-shaped region
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {

                // Calculate the size of the plus-shaped region at each
                // position as the minimum length of continuous 1's in
                // all directions
                int size =
                    min(min(left[row][col], right[row][col]),
                        min(top[row][col], bottom[row][col]));

                // Update the maximum size if a larger size is found
                maxSize = max(maxSize, size);
            }
        }

        // Return the area of the largest plus-shaped region
        return maxSize * 4 + 1;
    }
};
```
