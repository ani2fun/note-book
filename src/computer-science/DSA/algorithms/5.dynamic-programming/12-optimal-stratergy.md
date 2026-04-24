# Optimal game strategy

## Problem Statement

You are given an array of **coins** where `coins[i]` denote the number of coins at the index `i`. We are playing a game against an opponent by alternating turns. In each turn, a player picks the coins from either the first or last index, removes the index permanently, and receives the number of coins at that index. Write a function to find and return the maximum possible amount of coins we can definitely get if we move first.

The opponent is playing optimally as well.

### Example 1

> -   **Input:** coins = \[10, 17, 5, 9\]
> -   **Output:** 26
> -   **Explanation:** Below is the sequence of moves:
> -   We pick 9 coins
> -   The opponent picks 10 coins
> -   We pick 17 coins
> -   The opponent picks 5 coins In the end we have 26 coins

### Example 2

> -   **Input:** coins = \[7, 5, 9, 12\]
> -   **Output:** 19
> -   **Explanation:** Below is the sequence of moves:
> -   We pick 12 coins
> -   The opponent picks 9 coins
> -   We pick 7 coins
> -   The opponent picks 5 coins In the end we have 19 coins

### Example 3

> -   **Input:** coins = \[8, 5\]
> -   **Output:** 8
> -   **Explanation:** Below is the sequence of moves:
> -   We pick 8 coins
> -   The opponent picks 5 coins In the end we have 8 coins

## Solution

```cpp
using namespace std;

class Solution {
public:
    int optimalGameStrategy(vector<int> &coins) {
        int n = coins.size();
        vector<vector<int>> dp(n, vector<int>(n, 0));

        // Fill the dp table from bottom-up
        for (int i = n - 1; i >= 0; i--) {
            for (int j = i; j < n; j++) {
                if (i == j) {

                    // Base case: If there is only one coin, the maximum
                    // money that can be obtained is the value of that
                    // coin
                    dp[i][j] = coins[i];
                } else {

                    // Compare the options of choosing the left coin or
                    // the right coin, and take the maximum value
                    int left = (i + 2 <= j) ? dp[i + 2][j] : 0;
                    int right = (i + 1 <= j - 1) ? dp[i + 1][j - 1] : 0;

                    // If the left coin is chosen, the next player can
                    // choose either dp[i+2][j] or dp[i+1][j-1] coins
                    // from the remaining options
                    int leftChoose = coins[i] + min(left, right);

                    // If the right coin is chosen, the next player can
                    // choose either dp[i+1][j-1] or dp[i][j-2] coins
                    // from the remaining options
                    int rightChoose =
                        coins[j] +
                        min(right, (i <= j - 2) ? dp[i][j - 2] : 0);

                    // Store the maximum value among the two options in
                    // the dp table
                    dp[i][j] = max(leftChoose, rightChoose);
                }
            }
        }

        // The maximum money that can be obtained by the first player is
        // stored at dp[0][n-1]
        return dp[0][n - 1];
    }
};
```
