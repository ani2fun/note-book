# Understanding the longest palindromic subsequence problem

When working with strings, we often care not just about contiguous segments but about characters that can be selected from anywhere within the string while preserving their relative order. One such challenge is to determine the longest sequence of characters that reads the same forward and backwards, without requiring those characters to be adjacent.

This is known as the longest palindromic subsequence problem, where the objective is to find the length of the longest subsequence of the input string that reads the same forward and backward.

// Diagram: Find the length of the longest palindromic subsequence in a string.

The longest palindromic subsequence problem is a classic dynamic programming problem with practical applications in computational biology for comparing DNA sequences, diff tools for identifying structural similarities, and data compression.

In this lesson, we will learn about the longest palindromic subsequence problem and how it can be solved efficiently using a dynamic programming solution.

## The longest palindromic subsequence problem

Consider we are given a string `s` of length `n`. A subsequence is a sequence of characters derived from `s` by deleting zero or more characters without changing the relative order of the remaining characters.

// Diagram: A string of length n.

A palindrome is a string that reads the same forwards and backwards, such as "racecar" or "aba". We need to find the length of the longest subsequence of s that is also a palindrome.

// Diagram: The longest palindromic subsequence in the given string

### Optimal substructure

It is easy to prove that the optimal solution to the longest palindromic subsquence problem can be constructed from optimal solutions to its smaller subproblems. It is important to observe that if we consider a substring `s[i...j]`, there are two main cases we need to consider.

If `s[i]` does not equal `s[j]`, we cannot include both boundary characters in the same palindrome. We have two options:

1.  1Skip `s[i]` and look at `s[i+1...j]` to find the longest palindromic subsequence.
2.  2Skip `s[j]` and look at `s[i...j-1]` to find the longest palindromic subsequence.

We can choose whichever gives a **longer** palindromic subsequence. There is no need to consider skipping both, since any subsequence within `s[i+1...j-1]` is already considered within each of those two options.

// Diagram: If s\[i\] and s\[j\] are not equal, they can still be a part of another palindromic subsequence in the range s\[i...j\].

On the other hand, If `s[i]` equals `s[j]`, we have a matching pair of characters at both ends. Since we are looking for a subsequence (not a substring), we can always include both of them and recursively find the longest palindromic subsequence in the interior `s[i+1...j-1]`. It is guaranteed that including both boundary characters here is always **at least** as good as excluding one or both of them, as we gain two characters for free.

// Diagram: If s\[i\] and s\[j\] are equal, we can include them to extend the longest palindromic subsequence in the range s\[i+1...j-1\].

Based on the above, it is clear that to find the longest palindromic subsequence in `s[i...j]`, we have two options to choose from:

-   If `s[i]` equals `s[j]`, the solution is the longest palindromic subsequence in `s[i+1...j-1] + 2`
-   If `s[i]` does not equal `s[j]`, the solution is the **maximum** between the two options:

The solution to the problem depends on the optimal solution of these smaller subproblems.

// Diagram: The solution to the problem depends on the optimal solution of these smaller subproblems.

Note that the subproblems are uniquely identified by two dimensions: the starting index `i` and the ending index `j` of the substring.

Based on the optimal substructure above, we can define the relationship between the problem and its subproblems. We can define a function `lps(i, j)` that returns the length of the longest palindromic subsequence within `s[i...j]`.

// Diagram: Define functions lps to find the length of the longest palindromic subsequence in a range.

The base cases are:

-   Any single character is a palindrome and so `lps(i, i) = 1`.
-   Any substring where `i > j` is empty and so for such cases `lps(i, j) = 0`.

// Diagram: The base cases for the lps function.

To determine `lps(i, j)`, we check whether `s[i]` equals `s[j]`. If they are equal, the solution is `lps(i, j) + 2`. Otherwise, we take the **maximum** of `lps(i+1, j)` and `lps(i, j-1)`.

The recurrence relation below expresses the solution to the problem as a function of solutions to smaller problems. The solution to the original problem is `lps(0, n-1)` where `n` is the length of `s`.

// Diagram: The recurrence relation for the longest palindromic subsequence function.

### Overlapping Subproblems

It is easy to see that the recurrence gives rise to many overlapping subproblems. To compute `lps(i, j)` when `s[i] != s[j]`, we compute both `lps(i+1, j)` and `lps(i, j-1)`.

Each of these in turn, requires `lps(i+1, j-1)` once as a subproblem of `lps(i+1, j)` (when `s[i+1] != s[j]`) and once as a subproblem of `lps(i, j-1)` (when `s[i] != s[j-1]`). Thus `lps(i+1, j-1)` is recomputed twice from `lps(i, j)` alone.

// Diagram: There are many overlapping subproblems when finding the solution to a problem state.

Conversely, the subproblem `lps(i, j)` appears in the computation of `lps(i-1, j)` and `lps(i, j+1)` when their boundary characters do not match, and as `lps(i-1, j+1) + 2` when `s[i-1] = s[j+1]`.

// Diagram: A problem state may appear as a subproblem in many other problem states.

A brute-force recursive solution repeatedly recomputes the same subproblems when reached from different paths, making it highly inefficient. Because these overlapping subproblems exist, the problem can be solved more efficiently either with a top-down dynamic programming approach using memoization or a bottom-up dynamic programming approach building up from the base cases.

***

# Longest palindromic subsequence

## Problem Statement

Given a string **s**, write a function to find and return the length of the longest palindromic subsequence present in the string.

A subsequence of a string is a sequence that is generated by deleting some characters (possibly 0) from the string without altering the order of the remaining characters. For example, abc, `abg`, `bdf`, `aeg`, `acefg`, etc are subsequences of the string `abcdefg`.

### Example 1

> -   **Input:** s = aacbbdaa
> -   **Output:** 6
> -   **Explanation:** aabbaa is the longest palindromic subsequence in the string.

### Example 2

> -   **Input:** s = xyxzlxnx
> -   **Output:** 5
> -   **Explanation:** There are multiple longest palindromic subsequences in the string, one of which is xxzxx.

### Example 3

> -   **Input:** s = abc
> -   **Output:** 1
> -   **Explanation:** There are multiple longest palindromic subsequences in the string, they are 'a', 'b' or 'c'.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int longestPalindromicSubsequence(string s) {
        int n = s.length();

        // Create a 2D vector 'dp' of size n x n and initialize all
        // elements to 0
        vector<vector<int>> dp(n, vector<int>(n, 0));

        // Initialize the diagonal elements of 'dp' to 1 (base case for
        // subsequences of length 1)
        for (int i = 0; i < n; i++) {
            dp[i][i] = 1;
        }

        // Iterate over different lengths of subsequences
        for (int len = 2; len <= n; len++) {

            // Iterate over the starting indices of the subsequences
            for (int i = 0; i < n - len + 1; i++) {
                int j = i + len - 1;

                // If the characters at positions 'i' and 'j' are equal
                // and the length is 2, set the value of 'dp[i][j]' to 2
                // (base case for subsequences of length 2)
                if (s[i] == s[j] && len == 2) {
                    dp[i][j] = 2;
                }

                // If the characters at positions 'i' and 'j' are equal,
                // update the value of 'dp[i][j]' by adding 2 to the
                // length of the palindrome found in the subsequence
                // excluding the first and last characters (i.e., 'dp[i +
                // 1][j - 1]')
                else if (s[i] == s[j]) {
                    dp[i][j] = dp[i + 1][j - 1] + 2;
                }

                // If the characters at positions 'i' and 'j' are not
                // equal, update the value of 'dp[i][j]' by taking the
                // maximum length of palindromic subsequences either by
                // excluding the first character or by excluding the last
                // character
                else {
                    dp[i][j] = max(dp[i + 1][j], dp[i][j - 1]);
                }
            }
        }

        // The length of the longest palindromic subsequence is stored in
        // 'dp[0][n - 1]'
        return dp[0][n - 1];
    }
};
```
