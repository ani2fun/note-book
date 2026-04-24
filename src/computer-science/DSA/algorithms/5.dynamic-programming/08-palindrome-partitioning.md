# Understanding the palindrome partitioning problem

In many string processing softwares, the program must divide a string into smaller components while preserving certain structural properties. One such property is symmetry, and an interesting variation is when we want every piece to read the same forward and backwards. In such cases, instead of searching for a single large palindromic substring, we may want to partition the entire string into smaller palindromic pieces

This is known as the palindrome partitioning problem, where the objective is to determine the fewest cuts needed to ensure every resulting substring reads the same forwards and backwards.

// Diagram: Find the minimum number of cuts in a string to make every partition a palindrome.

The palindrome partitioning problem serves as a cornerstone for sequence segmentation and has significant utility in bioinformatics for RNA structure prediction, data scrubbing in text processing, and optimizing storage in specialized compression formats.

In this lesson, we will learn about the palindrome partitioning problem and how it can be solved efficiently using a dynamic programming solution.

## The palindrom partitioning problem

Consider we are given a string `s` of length `n`. A substring is a contiguous sequence of characters, and a palindrome is a string that reads the same in both directions, such as "aa", "racecar", etc.

// Diagram: A string of size 6.

Our goal is to partition `s` into substrings such that:

-   Every substring is a palindrome.
-   The number of cuts used is minimized.

If a string is already a palindrome, then no cuts are required. Otherwise, we must decide where to cut so that each resulting piece satisfies the palindrome condition. We need to find the **minimum** number of cuts needed to partition the `s` into palindromic substrings.

// Diagram: Find the minimum number of cuts to make every partition a palindrome.

### Optimal substructure

It is easy to prove that the optimal solution to the palindrome partitioning problem can be constructed from optimal solutions to its smaller subproblems. To see this, consider a substring `s[i...j]` and think about what choices are available to us.

The most important observation is: if `s[i...j]` is already a palindrome, no cuts are needed at all. We are done for this range.

// Diagram: If the substring s\[i...j\] is a palindrome, no cuts are needed to partition it into palindromic substrings.

If `s[i...j]` is not a palindrome, then we must make at least one cut somewhere within it. For each possible cut position `k`, where `i ≤ k < j`, we split the substring into a left part `s[i...k]` and a right part `s[k+1...j]`.

// Diagram: Split the substring s\[i...j\] into left and right parts for all values of k such that i <= k < j.

However, not every cut position is valid, as we can only cut the substring at the index `k` if the left part `s[i...k]` is a palindrome.

// Diagram: Only the positions where the substring s\[i...k\] is a palindrome are valid cut positions.

If we choose the first valid cut, then the **minimum** number of cuts we need to make to partition the entire substring `s[i...j]` into palindromes would be `1` +  the **minimum** number of cuts needed to partition `s[k+1...j]` into palindromes.

// Diagram: For a valid cut, the solution is 1 + the minimum number of cuts for the substring s\[k+1...j\].

However, this may not be the most optimal solution of `s[i...j]` as some other value of `k` greater than the previous value may result in an overall lesser number of cuts. Since we want the **minimum** number of cuts, we take the **minimum** value of total cuts needed for `s[i...j]` over all valid cut positions `k` where `i<= k < j` and `s[i...k]` is a palindrome.

// Diagram: We chose the cut that has the minimum number of cuts needed for partitioning the right substring.

**Why don't we start cutting from the right and recurse in the left part?**

It can be proved that iterating using `k` in any direction (left to right or right to left) will result in the same solution. Both formulations enumerate exactly the same set of partitions, just indexed differently. Any optimal partition of `s[i...j]` into palindromic pieces has a well-defined **first** cut and a well-defined **last** cut. Fixing the **left** segment as a palindrome and recursing right corresponds to choosing where the **first** cut falls, while fixing the **right** segment as a palindrome and recursing left corresponds to choosing where the **last** cut falls.

Based on the above, it is clear that to find the minimum cuts for `s[i...j]`, we have the following cases:

-   If `s[i...j]` is a palindrome, no cut is needed and so the minimum cuts is `0`.
-   Otherwise, for each position `k` where `i <= k < j` and `s[i...k]` is a palindrome, the cost of cutting at position `k` is `1` + minimum cuts for `s[k+1][j]`. We take the minimum over all such valid `k`.

The solution to the problem depends on the optimal solution of these smaller subproblems.

// Diagram: The optimal solution to the problem depends on the optimal solution to the smaller subproblems.

Note that the subproblems are uniquely identified by two dimensions: the starting index `i` and the ending index `j` of the substring.

Based on the optimal substructure above, we can define the relationship between the problem and its subproblems. We define `isPalindrome(i, j)` that returns whether `s[i...j]` is a palindrome, and `minCuts(i, j)` that returns the minimum number of cuts to palindrome-partition `s[i...j]`.

// Diagram: Define functions minCuts and isPalindrome to find the minimum partitions and check if a substring is a palindrome.

The base cases are:

-   Any single character is a palindrome and requires no cuts, so `isPalindrome(i, i) = true` and `minCuts(i, i) = 0` if `i == j`.
-   If `i > j` then `isPalindrome(i, j) = false`, then `minCuts(i, j) = 0`.

// Diagram: The base cases for the minCuts and isPalindrome functions.

To determine `isPalindrome(i, j)`, we check whether `s[i]` equals `s[j]` and whether `isPalindrome(i+1, j-1)` is `true`.

// Diagram: The recurrence relation for the isPalindrome function.

To get the solution for `minCuts(i, j)`, we scan every cut position `k` from `i` to `j-1`. For each `k` where `isPalindrome(i, k)` is true, we evaluate `1 + minCuts(k+1, j)` and take the **minimum** across all such `k`.

Note that there are two recursive functions `isPalindrome` and `minCuts`, where the `minCuts` depends on results from `isPalindrome`.

The recurrence relation below expresses the solution to the problem as a function of solutions to smaller problems. The solution to the original problem is `minCuts(0, n-1)` where n is the length of `s`.

// Diagram: The recurrence relation for the palindrome partitioning problem.

### Overlapping Subproblems

It is easy to see that the recurrence produces many overlapping subproblems. To compute `minCuts(i, j)`, we evaluate `minCuts(k+1, j)` for every `k` where `isPalindrome(i, k)` holds `true`. Each of those calls to `minCuts(k+1, j)` requires its own set of palindrome checks and further recursive calls.

// Diagram: The minCuts function calls the isPalindrome function on multiple ranges and then recursively calls itself depending on the result.

The converse of it is easy to visualize and understand. Conversely, `minCuts(k+1, j)` appears not only when computing `minCuts(i, j)`, but also when computing `minCuts(i', j)` for any `i' < k+1` such that `isPalindrome(i', k)` is `true`. We use `i1, ... , im` to depict the different values of such `i'`.

// Diagram: A problem state may appear as a subproblem in many other problem states.

A brute-force recursive solution recomputes the same subproblems each time they are reached from different paths, leading to exponential time complexity. Since these overlapping subproblems exist, the problem can be solved efficiently using either a top-down dynamic programming approach with memoization or a bottom-up dynamic programming approach built from the base cases upward.

***

# Minimum partitioning

## Problem Statement

Given a string **s**, write a function to find and return the minimum number of cuts needed to partition it such that each partition of the string is a palindrome.

### Example 1

> -   **Input:** s = abbbc
> -   **Output:** 2
> -   **Explanation:** We can make two cuts to get the strings \[a, bbb, c\], each of which is a palindrome.

### Example 2

> -   **Input:** s = abcdef
> -   **Output:** 5
> -   **Explanation:** We can make five cuts to get the strings \[a, b, c, d, e\], each of which is a palindrome.

### Example 3

> -   **Input:** s = aaa
> -   **Output:** 0
> -   **Explanation:** The given string is already a palindrome so we do not need to make a cut.

## Solution

```cpp
#include <climits>

using namespace std;

class Solution {
public:
    int minimumPartitioning(string s) {
        int n = s.length();

        // Create a 2D table to store the minimum cuts needed
        vector<vector<int>> dp(n, vector<int>(n, 0));

        // Create a 1D table to store the minimum cuts from each index
        vector<int> cuts(n, 0);

        // Calculate the minimum cuts for all substrings
        for (int end = 0; end < n; end++) {
            int minimumPartitionings = INT_MAX;
            for (int start = 0; start <= end; start++) {
                if (s[start] == s[end] &&
                    (end - start <= 2 || dp[start + 1][end - 1])) {
                    dp[start][end] = true;

                    // If the current substring is a palindrome, update
                    // the minimum cuts
                    if (start > 0) {
                        minimumPartitionings =
                            min(minimumPartitionings,
                                cuts[start - 1] + 1);
                    } else {

                        // No cuts needed if the whole string is a
                        // palindrome
                        minimumPartitionings = 0;
                    }
                }
            }
            cuts[end] = minimumPartitionings;
        }

        // Return the minimum cuts needed for palindrome partitioning
        return cuts[n - 1];
    }
};
```
