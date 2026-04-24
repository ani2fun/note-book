# Subset sum

## Problem Statement

Given an integer array **arr** and an integer **target**, write a function that returns `true` if there exists a subset that sums up to the target. Return `false` if no such subset exists.

### Example 1

> -   **Input:** arr = \[1, 5, 3, 10\], target = 15
> -   **Output:** true
> -   **Explanation:** The subset \[5, 10\] sum up to 15.

### Example 2

> -   **Input:** arr = \[1, 2, 3, 4, 5\], target = 6
> -   **Output:** true
> -   **Explanation:** There exist multiple subsets that sum up to 5, one of which is \[2, 4\].

### Example 3

> -   **Input:** arr = \[1, 2, 3, 4, 5\], target = 40
> -   **Output:** false
> -   **Explanation:** There is no subset that sums up to 40.

## Solution

```cpp
using namespace std;

class Solution {
public:
    bool subsetSum(vector<int> &arr, int target) {
        int n = arr.size();
        vector<vector<bool>> dp(n + 1, vector<bool>(target + 1, false));

        // Initializing the base case: If the target is 0, then any
        // subset can form it.
        for (int i = 0; i <= n; i++)
            dp[i][0] = true;

        // Building the bottom-up DP table
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= target; j++) {

                // If the current element is less than or equal to the
                // current target
                if (arr[i - 1] <= j) {

                    // Two possibilities:
                    // 1. Include the current element and check if the
                    // remaining target can be formed
                    // 2. Exclude the current element and check if the
                    // target can be formed
                    dp[i][j] = dp[i - 1][j - arr[i - 1]] || dp[i - 1][j];
                } else {

                    // If the current element is greater than the target,
                    // it cannot be included So, the current target can
                    // be formed only if the target without the current
                    // element can be formed
                    dp[i][j] = dp[i - 1][j];
                }
            }
        }

        // Return the result for the given target and all the elements
        return dp[n][target];
    }
};
```

***

# Rod cutting

## Problem Statement

Given the **length** of a rod and an integer array **prices** of size length where `prices[i]` denotes the price of the rod of length `i`, write a function to find and return the maximum profit you can make by cutting the rod and selling the pieces.

### Example 1

> -   **Input:** prices = \[1, 5, 8, 9\], length = 4
> -   **Output:** 10
> -   **Explanation:** We can cut the rod into two pieces of length 2 each to attain a maximum profit of 10.

### Example 2

> -   **Input:** prices = \[1, 4, 8, 5\], length = 4
> -   **Output:** 9
> -   **Explanation:** We can cut the rod into two pieces of length 1 and 3 to attain a maximum profit of 9.

### Example 3

> -   **Input:** prices = \[1, 2, 3, 6\], length = 4
> -   **Output:** 6
> -   **Explanation:** We do not need to cut the rod as we can sell the entire rod for maximum profit of 6.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int rodCutting(vector<int> &prices, int length) {

        // Create a dynamic programming table to store the maximum profit
        // for each length
        vector<int> dp(length + 1, 0);

        // Iterate through all possible lengths
        for (int i = 1; i <= length; i++) {

            // Initialize the maximum profit with the price of the
            // current length
            int maxProfit = prices[i - 1];

            // Iterate through all possible cuts within the current
            // length
            for (int j = 1; j < i; j++) {

                // Calculate the maximum profit by considering different
                // cut positions prices[j - 1] represents the price of
                // the cut at position j dp[i - j] represents the maximum
                // profit for the remaining length (i - j)
                maxProfit = max(maxProfit, prices[j - 1] + dp[i - j]);
            }

            // Store the maximum profit for the current length in the dp
            // table
            dp[i] = maxProfit;
        }

        // Return the maximum profit for the given length
        return dp[length];
    }
};
```

***

# Coin change

## Problem Statement

Given a non-negative array **coins** representing coins of different denominations and an **amount**, write a function to find and return the minimum number of coins you need to make up the amount. if there is no possible way, return `-1` instead.

You can assume that you have unlimited supply of coins of each denomination.

### Example 1

> -   **Input:** coins = \[1, 5, 8, 9\], amount = 4
> -   **Output:** 4
> -   **Explanation:** We need 4 coins of denomination 1 to make up the amount.

### Example 2

> -   **Input:** coins = \[1, 4, 8, 9\], amount = 13
> -   **Output:** 2
> -   **Explanation:** We can use one coin each of denominations 4 and 9 to make up the amount.

### Example 3

> -   **Input:** coins = \[2, 3, 4, 9\], amount = 1
> -   **Output:** -1
> -   **Explanation:** There is no possible way to make up the amount.

## Solution

```cpp
#include <climits>

using namespace std;

class Solution {
public:
    int coinChange(vector<int> &coins, int amount) {

        // Create a vector to store the minimum number of coins needed
        // for each amount from 0 to 'amount'
        vector<int> dp(amount + 1, INT_MAX);

        // For amount 0, no coins are needed, so the minimum number of
        // coins is 0
        dp[0] = 0;

        // Iterate over each amount from 1 to 'amount'
        for (int i = 1; i <= amount; i++) {

            // Iterate over each coin in the 'coins' vector
            for (int coin : coins) {

                // Check if the current coin is smaller than or equal to
                // the current amount
                if (coin <= i) {

                    // Calculate the remaining amount after using the
                    // current coin
                    int subproblem = dp[i - coin];

                    // Check if the subproblem has a valid solution
                    // (i.e., not INT_MAX)
                    if (subproblem != INT_MAX)

                        // Update the minimum number of coins needed for
                        // the current amount
                        dp[i] = min(dp[i], subproblem + 1);
                }
            }
        }

        // Check if a valid solution exists for the given amount
        // If so, return the minimum number of coins needed; otherwise,
        // return -1
        return dp[amount] != INT_MAX ? dp[amount] : -1;
    }
};
```

***

# Coin change II

## Problem Statement

Given a non-negative array **coins** representing coins of different denominations and an **amount**, write a function to find and return the total number of distinct ways to make up the amount.

You can assume that you have unlimited supply of coins of each denomination.

### Example 1

> -   **Input:** coins = \[1, 5, 8, 9\], amount = 4
> -   **Output:** 1
> -   **Explanation:** There is only one way to make up the amount 4, which is to you 4 coins of denomination 1.

### Example 2

> -   **Input:** coins = \[3, 4, 8, 9\], amount = 13
> -   **Output:** 2
> -   **Explanation:** There are two ways to make up the amount 13. They are (3 + 9), (3 + 3 + 3 + 4).

### Example 3

> -   **Input:** coins = \[3, 4, 5, 9\], amount = 1
> -   **Output:** 0
> -   **Explanation:** There are no possible ways to make the amount 1.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int coinChangeII(vector<int> &coins, int amount) {

        // Create a dynamic programming array with size (amount + 1) and
        // initialize all elements to 0
        vector<int> dp(amount + 1, 0);

        // Set the base case: there is one way to make an amount of 0 (by
        // not selecting any coin)
        dp[0] = 1;

        // Iterate over each coin in the coins vector
        for (int coin : coins) {

            // Iterate from the value of the current coin up to the
            // target amount and update the dp array with the number of
            // ways to make each amount
            for (int i = coin; i <= amount; i++) {

                // Add the number of ways to make the current amount (i)
                // using the current coin (coin) by adding the number of
                // ways to make the remaining amount (i - coin) using any
                // combination of coins
                dp[i] += dp[i - coin];
            }
        }

        // Return the number of ways to make the target amount
        return dp[amount];
    }
};
```
