# Understanding the edit distance problem

In many string processing tasks, we often need to measure how similar two sequences are. At first glance, comparing two strings character by character may feel straightforward, but when insertions, deletions, and replacements are allowed, the number of possible transformation paths grows rapidly. One fundamental problem that captures this challenge is the edit distance problem (also Levenshtein distance), where the goal is to determine the minimum number of supported operations (insert, update, and delete) required to transform one string into another.

// Diagram: Convert string s1 to s2 with minimum edits.

The edit distance problem is a classic example that highlights the strength of dynamic programming. It demonstrates how solving smaller transformation problems and remembering intermediate results allows us to efficiently solve what would otherwise be an exponential search problem. This problem appears in spell checkers, DNA computational biology, pattern recognition and version control systems.

In this lesson, we will learn more about the edit distance problem and see how dynamic programming allows us to solve it efficiently.

## The edit distance problem

Consider we are given two strings `s1` of length `m` and `s2` of length `n`.

// Diagram: Two strings s1 and s2 of length m and n.

// Diagram: An edit operation is defined as one of the following three transformations on a string

-   Inserting a character at any position
-   Deleting a character from any position
-   Updating a character at any position to some other character

// Diagram: An edit operation is either updating, inserting or deleting a character.

The edit distance between `s1` and `s2` is the **minimum** number of edit operations required to transform `s1` into `s2`.

// Diagram: The minimum edit distance is the minimum number of edit operations needed to convert s1 to s2.

## Optimal substructure

It is easy to prove that the optimal solution to the edit distance problem can be constructed from optimal solutions to its smaller subproblems. It is important to observe that if we consider two prefixes `s1[0...i]` and `s2[0...j]`, and try to find the edit distance only for these prefixes, there are two main cases to consider.

// Diagram: If s1[i] does not equal s2[j], then we must perform an edit operation to align these characters. We have three choices

-   Insert `s2[j]` at the end of the current prefix of `s1[0...i]`, matching `s2[j]`, and use the edit distance from `s1[0...i]` to `s2[0...j-1]`.
-   Delete `s1[i]` and use the edit distance from `s1[0...i-1]` to `s2[0...j]`.
-   Update `s1[i]` to match `s2[j]` and use the edit distance from `s1[0...i-1]` to `s2[0...j-1]`.

Each of these operations has a **cost of 1**, so we must choose the option that **minimizes** the total edit distance.

// Diagram: If the characters s1\[i\] and s2\[j\] don't match, the optimal solution can be made from three options.

Similarly, if `s1[i]` equals `s2[j]`, then these matching characters require **no operation**, and we can simply use the solution from transforming `s1[0...i-1]` into `s2[0...j-1]`. Alternatively, we could still perform one of the three operations above, but not doing anything is guaranteed to be the cheapest option, as shown below.

// Diagram: If the characters s1\[i\] and s2\[j\] match, the optimal solution is the same as the solution for s1\[i-1\] and s2\[j-1\].

Based on the above, it is clear that to find the edit distance between prefixes `s1[0...i]` and `s2[0...j]`, we have the following options to choose from:

-   If `s1[i]` equals `s2[j]`, no operation is needed, and the edit distance is the same as the edit distance from `s1[0...i-1]` to `s2[0...j-1]`.
-   If `s1[i]` does not equal `s2[j]`, we must take the minimum of the three options: inserting `s2[j]` after `s1[i]`, deleting `s1[i]`, or updating `s1[i]` with `s2[j]`, each adding **1** to the respective subproblem's solution.

The solution to the problem depends on the **optimal** solution of these smaller subproblems.

Note that the subproblems are uniquely identified by two dimensions: the index `i` in `s1` and the index `j` in `s2`.

// Diagram: The optimal solution to the problem depends on the optimal solution to the smaller subproblems.

Based on the optimal substructure above, we can define the relationship between the problem and its subproblems. We can define a function `editDistance(i, j)` that returns the **minimum** edit distance to transform `s1[0...i]` into `s2[0...j]`.

// Diagram: Define a function editDistance to find the minimum edit distance between the strings.

When `i` is negative, we need `j+1` insertions to create `s2[0...j]`, so `editDistance` returns `j+1`. When `j` is negative, we need `i+1` deletions to remove all characters from `s1[0...i]`, so `editDistance` returns `i+1`. These cases serve as the base case for the problem.

// Diagram: The base case in finding the minimum edit distance.

To get the solution for `editDistance(i, j)`, we check whether `s1[i]` equals `s2[j]`. If the characters match, we take the value returned by `editDistance(i-1, j-1)`, representing no operation needed. If the characters don't match, we take the **minimum** of `editDistance(i, j-1) + 1`,  `editDistance(i-1, j) + 1` , and `editDistance(i-1, j-1) + 1` accounting for insertion, deletion and update, respectively. 

The recurrence relation below expresses the solution to the problem as a function of solutions to smaller problems. The solution to the original problem is `editDistance(m-1, n-1)` where `m` and `n` are the lengths of `s1` and `s2`.

// Diagram: The recurrence relation for the edit distance problem.

### Overlapping Subproblems

It is easy to see that there are many overlapping subproblems in the recurrence relation to solve the edit distance problem. To compute `editDistance(i, j)`, we may recursively compute `editDistance(i−1, j−1)` when characters match, or all three of `editDistance(i−1, j)`, `editDistance(i, j−1)`, and `editDistance(i−1, j−1)` when they don't match.

// Diagram: There are many overlapping subproblems when finding the solution to a problem state.

Conversely, the subproblem `editDistance(i, j)` appears in the computation of `editDistance(i+1, j)`, `editDistance(i, j+1)`, and `editDistance(i+1, j+1)`.

// Diagram: A problem state may appear as a subproblem in many other problem states.

A naive recursive solution encounters the same subproblems multiple times through different recursive paths, leading to redundant computation and poor performance. Since these subproblems overlap, we can solve the problem more efficiently using dynamic programming either through a top-down approach with memoization or a bottom-up approach that builds solutions from the base cases.

***

# Edit distance

## Problem Statement

Given two strings **s1** and **s2**, and below operations that can be performed on s1. Write a function to find the minimum number of edits (operations) required to convert s1 into s2.  

> All the below operations cost the same
>
> -   Insert a character
> -   Remove a character
> -   Replace a character

### Example 1

> -   **Input:** s1 = sunday, s2 = saturday
> -   **Output:** 3
> -   **Explanation:** Last three and first characters are the same. We basically need to convert "un" to "atur". This can be done using below three operations. Replace 'n' with 'r', insert 't', insert 'a'.

### Example 2

> -   **Input:** s1 = abc, s2 = abcd
> -   **Output:** 1
> -   **Explanation:** We need to insert the character 'd' at the end of s1.

### Example 3

> -   **Input:** s1 = abc, s2 = abc
> -   **Output:** 0
> -   **Explanation:** We don't need any operations as both the strings are identical.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int editDistance(string s1, string s2) {
        int n = s1.length();
        int m = s2.length();

        // Create a 2D vector to store the dynamic programming table
        vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));

        // Initialize the base cases
        for (int i = 0; i <= n; i++)
            dp[i][0] = i;
        for (int j = 0; j <= m; j++)
            dp[0][j] = j;

        // Fill in the dynamic programming table
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {

                // If the current characters are the same, no edit is
                // needed
                if (s1[i - 1] == s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                }

                // If the characters are different, choose the
                // minimum of the three operations:
                // 1. Deletion: dp[i-1][j] represents the minimum
                // edit distance without the current character of s1
                // 2. Insertion: dp[i][j-1] represents the minimum
                // edit distance without the current character of s2
                // 3. Substitution: dp[i-1][j-1] represents the
                // minimum edit distance without both the current
                // characters
                else {
                    dp[i][j] = 1 + min(
                                       {dp[i - 1][j],
                                        dp[i][j - 1],
                                        dp[i - 1][j - 1]}
                                   );
                }
            }
        }

        // Return the minimum edit distance
        return dp[n][m];
    }
};
```
