# Partition with equal sum

## Problem Statement

Given an integer array **arr**, write a function that returns `true` if this array can be divided into two sets such that the sum of both these sets is equal, return `false` otherwise.

### Example 1

> -   **Input:** arr = \[1, 5, 4, 10\]
> -   **Output:** true
> -   **Explanation:** The two subsets are \[1, 5, 4\] and \[10\].

### Example 2

> -   **Input:** arr = \[1, 2, 3, 4, 6\]
> -   **Output:** true
> -   **Explanation:** The two subsets are \[1, 3, 4\] and \[2, 6\].

### Example 3

> -   **Input:** arr = \[1, 2\]
> -   **Output:** false
> -   **Explanation:** Two subsets with equal sums are not possible.

## Solution

```cpp
using namespace std;

class Solution {
public:
    bool partitionWithEqualSum(vector<int> &arr) {
        int totalSum = 0;
        for (int num : arr) {
            totalSum += num;
        }

        // If total sum is odd, it can't be divided into two equal
        // subsets
        if (totalSum % 2 != 0) {
            return false;
        }

        int target = totalSum / 2;
        int n = arr.size();

        // Create a 2D DP array to store the subset sum results
        vector<vector<bool>> dp(n + 1, vector<bool>(target + 1, false));

        // Base cases
        for (int i = 0; i <= n; i++) {

            // An empty subset can always have a sum of 0
            dp[i][0] = true;
        }

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= target; j++) {
                if (j >= arr[i - 1]) {

                    // If the current element can be included, check if
                    // there is a subset in the previous elements that
                    // has a sum equal to j or j minus the current
                    // element's value
                    dp[i][j] = dp[i - 1][j] || dp[i - 1][j - arr[i - 1]];
                } else {

                    // If the current element is too large to be
                    // included, inherit the value from the previous
                    // elements without including it
                    dp[i][j] = dp[i - 1][j];
                }
            }
        }

        return dp[n][target];
    }
};
```

***

# Sets with smallest discrepancy

## Problem Statement

Given an integer array **arr**, write a function to divide this array into two sets S1 and S2 such that the absolute **difference of sums in the subsets is minimum**. Your function should return this minimum difference.

### Example 1

> -   **Input:** arr = \[1, 5, 3, 10\]
> -   **Output:** 1
> -   **Explanation:** The two subsets are \[1, 5, 3\] and \[10\]. The absolute difference between the sums of these subsets is 1.

### Example 2

> -   **Input:** arr = \[1, 2, 3, 4, 5\]
> -   **Output:** 1
> -   **Explanation:** One of the possible divisions into two subsets is \[5, 3\] and \[1, 2, 4\]. The absolute difference between the sums of these subsets is 1.

### Example 3

> -   **Input:** arr = \[1, 1\]
> -   **Output:** 0
> -   **Explanation:** The two subsets are \[1\] and \[1\]. The absolute difference between the sums of these subsets is 0.

## Solution

```cpp
#include <climits>

using namespace std;

class Solution {
public:
    int setsWithSmallestDiscrepancy(vector<int> &arr) {
        int n = arr.size();
        int totalSum = 0;

        // Calculating the total sum of all elements in the array
        for (int i = 0; i < n; i++) {
            totalSum += arr[i];
        }

        // Initialize the dp array
        vector<vector<bool>> dp(
            n + 1, vector<bool>(totalSum + 1, false)
        );

        // Base cases
        // If the sum is 0, we can always achieve it by not selecting any
        // element
        for (int i = 0; i <= n; i++) {
            dp[i][0] = true;
        }

        // Fill the dp array
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= totalSum; j++) {

                // If we can achieve the sum without including the
                // current element
                dp[i][j] = dp[i - 1][j];

                // If the current element is smaller than or equal to the
                // required sum, we can either include it or exclude it
                if (arr[i - 1] <= j) {
                    dp[i][j] = dp[i][j] || dp[i - 1][j - arr[i - 1]];
                }
            }
        }

        int minDiff = INT_MAX;

        // Find the minimum difference between two subsets
        // Start from totalSum/2 and go downwards to find the maximum
        // possible sum that can be achieved by one subset
        for (int j = totalSum / 2; j >= 0; j--) {
            if (dp[n][j]) {

                // If the current sum is achievable, calculate the
                // difference between the total sum and the sum of the
                // current subset
                minDiff = totalSum - 2 * j;
                break;
            }
        }

        return minDiff;
    }
};
```
