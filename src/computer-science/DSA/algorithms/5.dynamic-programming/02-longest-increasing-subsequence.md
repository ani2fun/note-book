# Understanding the longest increasing subsequence problem

In many software systems, programs must process sequences of data and identify useful patterns within them, like, detecting periods when a metric steadily improves, analyzing trends in stock prices, or tracking the progression of user activity over time. While this may sound simple, the challenge lies in the sheer number of possible subsequences that can be formed from a given sequence, making it surprisingly difficult to determine the optimal one efficiently.

This type of challenge appears frequently in computer science, and a classic formulation of it is the Longest Increasing Subsequence (LIS) problem, where we are given a sequence of numbers, and we need to determine the longest subsequence in which each element is strictly greater than the one before it.

// Diagram: Find the length of the longest increasing subsequence in the array

In this lesson, we will learn about the longest increasing subsequence problem and how it can be solved efficiently using a dynamic programming solution.

## The longest increasing subsequence problem

Consider we are given an array of integers `arr` of length `n`. A subsequence in this array is defined as a sequence of integers from the array that appear in the same order as in the array.

// Diagram: An array of length n = 6.

We need to find the length of the longest subsequence such that all elements in the subsequence are in strictly increasing order.

// Diagram: The longest increasing subsequence is the longest subsequence in the array that is strictly increasing.

## Optimal substructure

It is easy to prove that the optimal solution to the longest increasing subsequence problem can be constructed from optimal solutions to its smaller subproblems.

It is important to observe that for any increasing subsequence that ends at index `i` in the array, the element at index `i` must be greater than the element immediately before it in the subsequence. Therefore, the subsequence ending at `i` must extend an increasing subsequence that ends at some earlier index `j`, where `j < i` and `arr[j] < arr[i]`.

// Diagram: Every item in an increasing subsequence should be greater than the previous item in the sequence.

To find the longest increasing subsequence ending at the index `i`, we must extend the **longest** among all such subsequences by adding `arr[i]` at the end of it. If we don't choose the longest subsequence to extend, we could replace it with a longer subsequence and increase the length of the subsequence ending at `i`, contradicting the optimality of the original solution.

// Diagram: The longest increasing subsequence ending at index i is 1 + the length of longest increasing subsequence ending at index i-1.

To get the solution, we iterate over all indices `j` such that `0 <= j < i`.

// Diagram: We iterate using a variable j from the start of the array to i - 1.

In each iteration, we check whether `arr[j] < arr[i]`. If this condition is satisfied, the element at index `i` can be appended to the increasing subsequence ending at index `j`.

// Diagram: Only the indices j where arr\[j\] < arr\[i\] should be considered.

We add `1` to the longest increasing subsequence at index `j` to account for including `arr[i]` and take the maximum of all such computed values during the iteration.

// Diagram: Calculate the length of the longest increasing subsequence ending at i for every valid index j.

At the end of all iterations, the maximum value obtained represents the length of the longest increasing subsequence ending at index `i`.

**What if no valid `j` exists?** 

If no index `j < i` satisfies `arr[j] < arr[i]`, then `arr[i]` cannot extend any previous increasing subsequence. In this case, the longest increasing subsequence ending at index `i` is just `arr[i]` itself, giving a length of `1`. This is the minimum value `lis(i)` can return for any valid index.

// Diagram: We chose the index j that results in the maximum length of the longest increasing subsequence ending at index i.

The solution to the problem depends on the optimal solution of these smaller subproblems.

// Diagram: The optimal solution to the problem depends on the optimal solution to the smaller subproblems.

Note that the subproblems are uniquely identified by a single dimension: the index `i` in `arr`.

Based on the optimal substructure above, we can define the relationship between the problem and its subproblems. We can define a function `lis(i)` that returns the length of the longest increasing subsequence that ends at index `i` in `arr`.

// Diagram: Define a function lis to find the length of the longest increasing subsequence ending at an index.

When `i` is `0`, no `j` satisfies `0 <= j < 0`, so no previous subsequence can be extended and so, `lis(0)` returns `1`, the element `arr[0]` on its own. This serves as the base case for the problem.

// Diagram: The base cases for the lis function.

To get the solution for `lis(i)`, we iterate over all indices `j` such that `0 <= j < i`. In each iteration, we check whether `arr[j] < arr[i]`. If this condition is satisfied, the element at index `i` can be appended to the increasing subsequence ending at index `j`. We then add `1` to the value returned by `lis(j)` to account for including `arr[i]` and take the maximum of all such computed values during the iteration.

At the end of all iterations, the maximum value obtained represents the length of the longest increasing subsequence ending at index `i`.

// Diagram: The optimal solution to the problem depends on the optimal solution to the smaller subproblems.

The recurrence relation below expresses the solution to the problem as a function of solutions to smaller problems.

// Diagram: The recurrence relation for the longest increasing subsequence problem.

The solution to the problem is the maximum value of  `lis(i)` for `0 <= i < n`.

**Why is the answer not simply `lis(n - 1)`?** 

Unlike some dynamic programming problems where the answer comes from a single subproblem, `lis(i)` only captures the longest increasing subsequence ending at a specific index `i`. The longest increasing subsequence in the entire array could end at any index. The solution to the problem is therefore the **maximum** of `lis(i)` across all `0 <= i < n`.

// Diagram: The solution to the problem is the maximum of lis ending at all positions.

## Overlapping Subproblems

It is easy to see that there are many overlapping subproblems in the recurrence relation to solve the longest increasing subsequence problem. To solve the problem, we need to compute `lis(i)` for all `0 <= i < n` and take the maximum of all values. To compute `lis(i)`, we recursively compute `lis(j)` for all `j < i` where `arr[j] < arr[i]`. For different values of `i`,  `lis(j)` may be called for the same value of `j` under the right constraints, and can be computed multiple times.

// Diagram: There are many overlapping subproblems when finding the solution to a problem state.

Conversely, the subproblem `lis(j)` appears in the computation of `lis(i')` for all `j < i' < n` such that `arr[j] < arr[i']`. We use variables `i1, .. , im` to depict `i'` in the diagram below.

// Diagram: A problem state may appear as a subproblem in many other problem states.

A brute-force recursive backtracking solution repeatedly recomputes the same subproblems when it reaches them from different paths, which makes it highly inefficient. Because these overlapping subproblems exist, the problem can be solved more efficiently either with a top-down dynamic programming approach using memoization or a bottom-up dynamic programming approach starting from the base cases.

***

# Longest increasing subsequence

## Problem Statement

Given an array **arr**, write a function to find the length of the longest increasing subsequence. 

The longest increasing subsequence is the longest possible subsequence in which the elements of the subsequence are sorted in increasing order.

### Example 1

> -   **Input:** arr = \[9, 5, 10, 6, 9, 7, 8\]
> -   **Output:** 4
> -   **Explanation:** \[5, 6, 7, 8\] is the longest increasing subsequence.

### Example 2

> -   **Input:** arr = \[5, 6, 1, 4, 3, 8, 2\]
> -   **Output:** 3
> -   **Explanation:** \[5, 6, 8\] is the longest increasing subsequence.

### Example 3

> -   **Input:** arr = \[9, 5, 4, 3\]
> -   **Output:** 1
> -   **Explanation:** \[9\], \[5\], \[4\] and \[3\] are all the longest increasing subsequences.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int longestIncreasingSubsequence(vector<int> &arr) {
        int n = arr.size();
        if (n == 0) {
            return 0;
        }

        // Create a dynamic programming array to store the lengths of
        // increasing subsequences
        vector<int> dp(n, 1);

        // Compute the lengths of increasing subsequences ending at each
        // position
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {

                // If the current element is greater than the previous
                // element, update the length of the increasing
                // subsequence
                if (arr[i] > arr[j])
                    dp[i] = max(dp[i], dp[j] + 1);
            }
        }

        // Find the maximum length of the increasing subsequence
        int maxLISLength = dp[0];
        for (int i = 1; i < n; i++) {
            if (dp[i] > maxLISLength)
                maxLISLength = dp[i];
        }

        return maxLISLength;
    }
};
```

***

# Largest sum ascending subsequence

## Problem Statement

Given an integer array **arr**, write a function to find and return the largest sum ascending subsequence from the array.

The largest sum ascending subsequence of a sequence is a subsequence such that the subsequence sum is as high as possible and the subsequence’s elements are sorted in ascending order.

### Example 1

> -   **Input:** arr = \[1, 7, 3, 5, 9, 8, 6\]
> -   **Output:** \[1, 3, 5, 9\]
> -   **Explanation:** The sum of this subsequence is 18 which is the largest that we can get.

### Example 2

> -   **Input:** arr = \[9, 8, 7, 6\]
> -   **Output:** \[9\]
> -   **Explanation:** The sum of this subsequence is 9 which is the largest that we can get.

### Example 3

> -   **Input:** arr = \[9, 1, 2, 3\]
> -   **Output:** \[9\]
> -   **Explanation:** The sum of this subsequence is 9 which is the largest that we can get.

## Solution

```cpp
using namespace std;

class Solution {
public:
    vector<int> largestSumAscendingSubsequence(vector<int> &arr) {
        int n = arr.size();

        // Array to store the maximum sum subsequence ending at index i
        vector<int> dp(n, 0);

        // Array to store the previous index of each element in the
        // maximum sum subsequence
        vector<int> prevIndex(n, -1);

        // Variable to track the maximum sum
        int maxSum = 0;

        // Variable to track the index of the last element in the maximum
        // sum subsequence
        int endIndex = 0;

        for (int i = 0; i < n; i++) {

            // Initialize the maximum sum subsequence at index i with the
            // element itself
            dp[i] = arr[i];

            // Initialize the previous index as -1 (indicating no
            // previous element)
            prevIndex[i] = -1;

            for (int j = 0; j < i; j++) {
                if (arr[j] < arr[i] && dp[j] + arr[i] > dp[i]) {

                    // If element at j is less than element at i and
                    // adding element at i with maximum sum subsequence
                    // ending at j gives a larger sum, update the maximum
                    // sum subsequence ending at i and store the previous
                    // index as j
                    dp[i] = dp[j] + arr[i];
                    prevIndex[i] = j;
                }
            }

            if (dp[i] > maxSum) {

                // If the maximum sum subsequence ending at i is greater
                // than the current maximum sum, update the maximum sum
                // and the index of the last element in the subsequence
                maxSum = dp[i];
                endIndex = i;
            }
        }

        vector<int> subsequence;
        while (endIndex != -1) {

            // Reconstruct the maximum sum subsequence by starting from
            // the last element and following the previous index
            subsequence.push_back(arr[endIndex]);
            endIndex = prevIndex[endIndex];
        }

        // Reverse the subsequence to get the correct order
        reverse(subsequence.begin(), subsequence.end());
        return subsequence;
    }
};
```
