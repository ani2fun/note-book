# Understanding the longest common subsequence problem

Many times when building software, the problem we're really solving is comparison. A diff tool shows a developer what changed between two versions of a file, and a spell checker figures out the closest match to a misspelt word, while a plagiarism detector finds overlapping passages between two documents.

In all these cases, the core challenge is the same: given two sequences, find out what they share. A fundamental problem in this space is the longest common subsequence problem, where the goal is to find the longest sequence of elements that appears in the same relative order in both input sequences.

// Diagram: The longest common subsequence between two strings.

The longest common subsequence problem is a foundational problem in dynamic programming and appears frequently in applications such as version control systems for detecting changes in files, computational biology for DNA sequence alignment, plagiarism detection, and data synchronization.

In this lesson, we will learn about the longest common subsequence problem and how it can be solved efficiently using a dynamic programming solution.

## The longest common subsequence problem

Consider we are given two strings `s1` and `s2` of lengths `m` and `n` respectively. A subsequence is defined as a sequence of characters that appear in the same relative order as in the original string, but not necessarily contiguously. Unlike in a substring, the characters in a subsequence do not need to be adjacent in the original strings.

We need to find the length of the longest subsequence that is common to both `s1` and `s2`.

// Diagram: The longest common subsequence between two strings.

## Optimal substructure

It is easy to prove that the optimal solution to the longest common subsequence problem can be constructed from optimal solutions to its smaller subproblems. It is important to observe that if we consider the prefixes `s1[0...i]` and `s2[0...j]`, there are two main cases to consider.

If the last characters under consideration **do not match**, that is, `s1[i]` does not equal `s2[j]`, then we can either decide to exclude `s1[i]` or `s2[j]` or both of them to find the longest common subsequence from `s1[0...i]` and `s2[0...j]`. And so the solution for `(i, j)` could be the longest common subsequence that can be made from either of the following:

1.  1`s1[0...i-1]` and `s2[0...j]`.
2.  2`s1[0...i]` and `s2[0...j-1]`.
3.  3`s1[0...i-1]` and `s2[0...j-1]`.

// Diagram: If the characters s1\[i\] and s2\[j\] don't match, the optimal solution can be made from three options.

However, the longest common subsequence that can be formed from the first two options can never be less than option 3. This is because the longest common subsequence of `s1[0...i-1]` and `s2[0...j-1]` is also a valid subsequence when considering `s1[0...i-1]` with `s2[0...j]`, and `s1[0...i]` with `s2[0...j-1]`.

// Diagram: The solution for lcs(i-1, j) and lcs(i, j-1) already considers lcs(i -1, j-1) as it is completely included in both the options.

Similarly, if `s1[i]` equals `s2[j]`, then these matching characters can extend the longest common subsequence of `s1[0...i-1]` and `s2[0...j-1]`.

// Diagram: If the characters s1\[i\] and s2\[j\] match, the optimal is to extend the lcs(i-1, j-1) with this character.

Based on the above, it is clear that to find the longest common subsequence of `s1[0...i]` and `s2[0...j]`, we have two options to choose from

1.  1If `s1[i]` equals `s2[j]`, including these characters and extending the longest common subsequence of `s1[0...i-1]` and `s2[0...j-1]` gives us the optimal solution.
2.  2If `s1[i]` does not equal `s2[j]`, we must take the better (**maximum**) of the two options: the longest common subsequence of `s1[0...i-1]` and `s2[0...j]`, or the longest common subsequence of `s1[0...i]` and `s2[0...j-1]`.

The solution to the problem depends on the optimal solution of these smaller subproblems.

// Diagram: The optimal solution to the problem depends on the optimal solution to the smaller subproblems.

Note that the subproblems are uniquely identified by two dimensions: the index `i` in `s1` and the index `j` in `s2`.

Based on the optimal substructure above, we can define the relationship between the problem and its subproblems. We can define a function `lcs(i, j)` that returns the length of the longest common subsequence of the prefixes `s1[0...i]` and `s2[0...j]`.

// Diagram: Define a function lcs to find the longest common subsequence in the strings.

When `i` is less than `0`, we have no characters left in `s1`, so no common subsequence is possible regardless of how many characters remain in `s2`. Similarly, when `j` is less than `0`, no common subsequence can exist regardless of `i`. In both cases, `lcs` returns `0`. This serves as the base case of the recurrence relation, terminating the recursion.

**Why does the base case use `i < 0` or `j < 0` instead of `i == 0` or `j == 0`?** 

Since `i` is an index into `s1`, the value `i == 0` represents the state where we are considering the prefix `s1[0...0]`, which still contains one character. Only when `i` drops below `0` have we truly exhausted all characters. The same applies to `j` and `s2`.

// Diagram: The base case in finding the longest common subsequence.

To get the solution for `lcs(i, j)`, we check whether `s1[i]` equals `s2[j]`. If the characters match, we add `1` to the value returned by `lcs(i - 1, j - 1)`, representing the inclusion of this matching character in the subsequence. If the characters don't match, we take the maximum of `lcs(i - 1, j)` and `lcs(i, j - 1)`, representing the choice of excluding `s1[i]` or `s2[j]` from consideration.

The recurrence relation below expresses the solution to the problem as a function of solutions to smaller problems. The solution to the original problem is `lcs(m - 1, n - 1)` where `m` and `n` are the lengths of `s1` and `s2`.

// Diagram: The recurrence relation for the longest common subsequence problem.

## Overlapping Subproblems

It is easy to see that there are many overlapping subproblems in the recurrence relation to solve the longest common subsequence problem. To compute `lcs(i, j)`, we may recursively compute `lcs(i − 1, j − 1)` when characters match, or both `lcs(i − 1, j)` and `lcs(i, j − 1)` when they don't match.

// Diagram: There are many overlapping subproblems when finding the solution to a problem state.

Conversely, the subproblem `lcs(i, j)` appears in the computation of `lcs(i + 1, j)`, `lcs(i, j + 1)`, and possibly `lcs(i + 1, j + 1)` depending on whether characters match.

// Diagram: A problem state may appear as a subproblem in many other problem states.

A brute-force recursive backtracking solution repeatedly recomputes the same subproblems when it reaches them from different paths, which makes it highly inefficient. Because these overlapping subproblems exist, the problem can be solved more efficiently either with a top-down dynamic programming approach using memoization or a bottom-up dynamic programming approach starting from the base cases.

***

# Understanding the top down solution to the longest common subsequence problem

To find the longest common subsequence using a top-down dynamic programming approach, we translate the recurrence relation into a recursive function and use a memoization table to store results of subproblems that have already been solved.

## The top down solution

As with any top-down solution, there is a recursive function that solves subproblems and a calling function that initializes the required data structures and triggers the computation. For the longest common subsequence, we define a single recursive function `lcs` and a calling function that invokes it for the full lengths of both strings.

### The lcs function

The function `lcs` takes as input an index `i` into `s1`, an index `j` into `s2`, references to both strings `s1` and `s2`, and a reference to the memoization array `memo`. The function returns the length of the longest common subsequence of the prefixes `s1[0...i]` and `s2[0...j]`.

// Diagram: Create a function lcs to return the longest common subsequence for two prefixes of string s1 and s2.

The `memo` array has dimensions `m × n` where `m` is the length of `s1` and `n` is the length of `s2`, and is initialized with `-1` in the calling function, where `-1` indicates that the state has not yet been computed. Any non-negative value represents the computed length of the longest common subsequence for that pair of prefixes.

// Diagram: The memo array has a size m x n and is initalized with -1.

When `lcs` is called, we first handle the base case. If `i` is less than `0` or `j` is less than `0`, we have exhausted one of the strings, so we return `0`.

**Why is the base case `i < 0` or `j < 0` instead of `i == 0` or `j == 0`?** 

Since `i` is an index into `s1`, the value `i == 0` represents the state where we are considering the prefix `s1[0...0]`, which still contains one character. Only when `i` drops below `0` have we truly exhausted all characters. The same applies to `j` and `s2`.

// Diagram: If i < 0 or j < 0, the solution is 0, and this serves as the base case.

Before making any recursive calls, we check the `memo` array to see if the solution to the current problem state has already been computed. If `memo[i][j]` is not `-1`, it means the result for this state has already been computed, and we return it directly.

// Diagram: If memo\[i\]\[j\] is not -1, it means the solution to that subproblem is already computed and can be returned to the caller.

If the state `(i, j)` has not been computed, we evaluate the recurrence relation. We first check if `s1[i]` equals `s2[j]`. If the characters match, we set `memo[i][j]` to `1 + lcs(i - 1, j - 1)`, since this matching character extends the longest common subsequence of the remaining prefixes by one. We return `memo[i][j]`.

// Diagram: If the characters match, we can extend the previous longest common subsequence.

If the characters do not match, we need to try both options of excluding one character at a time. We recursively call `lcs(i - 1, j)` to get the result when excluding `s1[i]`, and `lcs(i, j - 1)` to get the result when excluding `s2[j]`, and set `memo[i][j]` to the **maximum** of these two values and return it.

// Diagram: If the characters don't match, we chose the one that has the longest common subsequence for the next smallest problem.

The execution of the `lcs` function on an example is given below.

Find the length of the longest common subsequence of "ab" and "acb".

### The calling function

In the calling function, we first create a memoization array `memo` of dimensions `m × n` where `m` is the length of `s1` and `n` is the length of `s2`, initialized with all entries set to `-1`.

// Diagram: We create a 2D memo array of size m x n and initialize it with -1.

We then call the recursive function `lcs` with `i = m - 1` and `j = n - 1` to solve for the full strings. The value returned by this call is the length of the longest common subsequence.

// Diagram: We call the lcs function passing it, m-1, n-1, s1, s2 and memo to get the solution to the problem.

## Algorithm

The steps below summarise the dynamic programming algorithm to solve the longest common subsequence problem using a top-down approach.

> **lcs(i, j, \[ref\] s1, \[ref\] s2, \[ref\] memo):**
>
> -   **Step 1:** If `i < 0` or `j < 0`, return `0`
> -   **Step 2:** If `memo\[i\]\[j\] != -1`, return `memo\[i\]\[j\]`
> -   **Step 3:** If `s1\[i\] == s2\[j\]`:
>     -   **Step 3.1:** Set `memo\[i\]\[j\]` to `1 + lcs(i - 1, j - 1, s1, s2, memo)` and return `memo\[i\]\[j\]`
> -   **Step 4:** Set `memo\[i\]\[j\]` = `max( lcs(i - 1, j, s1, s2, memo) , lcs(i, j - 1, s1, s2, memo) )`

> -   **Step 5:** Return `memo\[i\]\[j\]`
>
> **callingFunction(\[ref\] s1, \[ref\] s2):**
>
> -   **Step 1:** Initialize a variable `m` with the length of `s1`
> -   **Step 2:** Initialize a variable `n` with the length of `s2`
> -   **Step 3:** Create a 2D array `memo` of size `m x n` and initialize it to `-1`
> -   **Step 4:** Return the return value of call to `lcs(m - 1, n - 1, s1, s2, memo)`

## Implementation

The top-down dynamic programming solution to the problem using memoization is given below.

C++

```cpp
#include <string>
#include <vector>
#include <algorithm>

// Diagram: using namespace std;

class Solution {
private:
    // Recursive helper to compute LCS length for prefixes:
    // s1[0..i] and s2[0..j]
    int lcs(int i,
            int j,
            string& s1,
            string& s2,
            vector<vector<int>>& memo) {

        // Base case: if either index goes out of bounds,
        // one string is empty → LCS length = 0
        if (i < 0 || j < 0) return 0;

        // Return cached result if already computed
        if (memo[i][j] != -1) {
            return memo[i][j];
        }

        // If current characters match,
        // include this character in the LCS
        if (s1[i] == s2[j]) {
            memo[i][j] = 1 + lcs(i - 1, j - 1, s1, s2, memo);
            return memo[i][j];
        };

        // Otherwise, skip one character from either string
        // and take the best possible LCS
        memo[i][j] = max(
            lcs(i - 1, j, s1, s2, memo), // skip character from s1
            lcs(i, j - 1, s1, s2, memo)  // skip character from s2
        );

        return memo[i][j];
    }

public:
    int longestCommonSubsequence(string& s1, string& s2) {

        int m = s1.length();
        int n = s2.length();

        // memo[i][j] stores the LCS length for s1[0..i] and s2[0..j]
        // initialized to -1 to indicate "not yet computed"
        vector<vector<int>> memo(m, vector<int>(n, -1));

        // Start recursion from the last characters of both strings
        return lcs(m - 1, n - 1, s1, s2, memo);
    }
};
```

Java

```java
import java.util.Arrays;

// Diagram: class Solution {

    // Recursive helper to compute LCS length for prefixes:
    // s1[0..i] and s2[0..j]
    private int lcs(int i,
                    int j,
                    String s1,
                    String s2,
                    int[][] memo) {

        // Base case: if either index goes out of bounds,
        // one string is empty → LCS length = 0
        if (i < 0 || j < 0) return 0;

        // Return cached result if already computed
        if (memo[i][j] != -1) {
            return memo[i][j];
        }

        // If current characters match,
        // include this character in the LCS
        if (s1.charAt(i) == s2.charAt(j)) {
            memo[i][j] = 1 + lcs(i - 1, j - 1, s1, s2, memo);
            return memo[i][j];
        }

        // Otherwise, skip one character from either string
        // and take the best possible LCS
        memo[i][j] = Math.max(
            lcs(i - 1, j, s1, s2, memo), // skip character from s1
            lcs(i, j - 1, s1, s2, memo)  // skip character from s2
        );

        return memo[i][j];
    }

// Diagram: public int longestCommonSubsequence(String s1, String s2) {

        int m = s1.length();
        int n = s2.length();

        // memo[i][j] stores the LCS length for s1[0..i] and s2[0..j]
        // initialized to -1 to indicate "not yet computed"
        int[][] memo = new int[m][n];
        for (int[] row : memo) {
            Arrays.fill(row, -1);
        }

        // Start recursion from the last characters of both strings
        return lcs(m - 1, n - 1, s1, s2, memo);
    }
```

Python

```python
from typing import List

class Solution:
    # Recursive helper to compute LCS length for prefixes:
    # s1[0..i] and s2[0..j]
    def lcs(
        self,
        i: int,
        j: int,
        s1: str,
        s2: str,
        memo: List[List[int]]
    ) -> int:

        # Base case: if either index goes out of bounds,
        # one string is empty → LCS length = 0
        if i < 0 or j < 0:
            return 0

        # Return cached result if already computed
        if memo[i][j] != -1:
            return memo[i][j]

        # If current characters match,
        # include this character in the LCS
        if s1[i] == s2[j]:
            memo[i][j] = 1 + self.lcs(i - 1, j - 1, s1, s2, memo)
            return memo[i][j]

        # Otherwise, skip one character from either string
        # and take the best possible LCS
        memo[i][j] = max(
            self.lcs(i - 1, j, s1, s2, memo),  # skip character from s1
            self.lcs(i, j - 1, s1, s2, memo)   # skip character from s2
        )

// Diagram: return memo[i][j]

    def longestCommonSubsequence(self, s1: str, s2: str) -> int:
        m: int = len(s1)
        n: int = len(s2)

        # memo[i][j] stores the LCS length for s1[0..i] and s2[0..j]
        # initialized to -1 to indicate "not yet computed"
        memo: List[List[int]] = [[-1] * n for _ in range(m)]

        # Start recursion from the last characters of both strings
        return self.lcs(m - 1, n - 1, s1, s2, memo)
```

## Complexity analysis

The total number of distinct subproblems in the top-down solution is determined by the number of valid `(i, j)` pairs where `i` ranges from `0` to `m - 1` and `j` ranges from `0` to `n - 1`. This gives us at most `m × n` unique subproblems, each computed at most once due to memoization.

In the worst case, every valid state `(i, j)` must be computed exactly once. This happens when the two strings share no common characters at all, such as `s1 = "abc"` and `s2 = "xyz"`. In this case, when we call `lcs(m - 1, n - 1)`, the characters never match, so every call branches into two recursive calls: one excluding from `s1` and one excluding from `s2`. This way `lcs` is called for all unique pairs `(i, j)`, leading to a time complexity of **O(M × N)**.

// Diagram: In the worst case, all the subproblems are computed.

In the best case, every character matches at the corresponding position, such as `s1 = "abc"` and `s2 = "abc"`. When we call `lcs(m - 1, n - 1)`, the characters match immediately, so we make a single recursive call to `lcs(m - 2, n - 2)`, which again matches and calls `lcs(m - 3, n - 3)`, and so on. Each call produces only one further call, and we traverse the diagonal of the memo table until one index drops below `0`. This leads to an overall **O(min(M, N))** time complexity.

// Diagram: In the best case, only the subproblems on the diagonal are computed.

However, since we create and initialize the memoization array of size `m × n` in the calling function, the overall time complexity is **O(M × N)** in any case.

// Diagram: The time complexity is O(M x N) in any case.

Since we create one memoization array `memo` of size `m × n` where `m` and `n` are the lengths of the two strings, the space complexity in any case is **O(M × N)**.

// Diagram: The space complexity is O(M x N) in any case.

> **Any Case:**
>
> -   Space Complexity - **O(M × N)**
> -   Time Complexity - **O(M × N)**

***

# Understanding the bottom up solution to the longest common subsequence problem

To find the longest common subsequence using a bottom-up dynamic programming approach, we fill a table iteratively beginning from the smallest subproblems and building towards the final answer. As with any bottom-up solution, we process subproblems in an order that guarantees every result we depend on has already been computed and stored before we need it.

## The bottom up solution

When implementing the recurrence relation using a top-down algorithm, `i` and `j` are indices into `s1` and `s2`, and the base case occurs when either index drops below `0`.

// Diagram: For the recurrence relations, if i < 0 or j < 0, the solution is 0, and this serves as the base case.

However, arrays cannot have negative indices. To handle this cleanly in the bottom-up table, we shift the meaning of `i` and `j` so that they represent the number of characters considered from each string rather than indices. This way, the base case becomes `i == 0` or `j == 0`, which maps naturally to row `0` and column `0` of the table.

**How does this shift change the recurrence?** 

The recurrence relation itself does not change, we still check if the **last** characters match and either extend or exclude. The only difference is that when `i` represents the number of characters considered, the last character of the prefix is at index `i - 1` in the string (instead of index `i`). This is purely a shift in how we index into the table and the strings, not a change in logic.

// Diagram: We can use i and j to denote the number of items considered from the start, instead of the index of the last item.

We create a 2D array `lcs` of dimensions `(m + 1) × (n + 1)`, where `lcs[i][j]` stores the length of the longest common subsequence of the first `i` characters of `s1` and the first `j` characters of `s2`. All entries are initialized to `0`.

// Diagram: The lcs array has a size (m+1) x (n+1) and is initialized with 0.

The entire first row `lcs[0][j]` and first column `lcs[i][0]` remain `0` since when either string contributes zero characters, no common subsequence is possible. These serve as the base cases for the problem.

**Why is the table `(m + 1) × (n + 1)` and not `m × n`?** 

Since `i` now represents the number of characters considered from `s1`, it ranges from `0` to `m`, giving `m + 1` possible values. Similarly, `j` ranges from `0` to `n`. The states where `i == 0` or `j == 0` represent the base cases where zero characters are taken from one string, and these need to be stored in the table. An `m × n` table would have no room for these base case entries.

// Diagram: The base case is when i == 0 or j == 0.

We then iterate through the table using a variable `i` starting from `1` up to `m`. For each `i`, we iterate through all positions using a variable `j` from `1` to `n`. In each iteration, we compare `s1[i - 1]` with `s2[j - 1]`.

If the characters match, we set `lcs[i][j]` to `lcs[i - 1][j - 1] + 1`, since this matching character extends the longest common subsequence of the prefixes that are each one character shorter.

**Why do we compare `s1[i - 1]` and `s2[j - 1]` instead of `s1[i]` and `s2[j]`?** 

This is a direct consequence of the shift described above. In the original recurrence relation, `i` is an index and we compare `s1[i]` with `s2[j]` directly. In the bottom-up table, `i` represents the number of characters considered, so the first `i` characters occupy indices `0` through `i - 1`. The last character in this prefix is therefore at index `i - 1`, not `i`. The same applies to `j` and `s2`.

// Diagram: If the characters match, we use lcs\[i-1\]\[j-1\] to calculate lcs\[i\]\[j\].

If the characters do not match, we set `lcs[i][j]` to the maximum of `lcs[i - 1][j]` and `lcs[i][j - 1]`. This reflects the two choices: either we exclude the current character of `s1` and take the result from the first `i - 1` characters of `s1` with the first `j` characters of `s2`, or we exclude the current character of `s2` and take the result from the first `i` characters of `s1` with the first `j - 1` characters of `s2`.

// Diagram: If the characters don't match, we use the maximum between lcs\[i\]\[j-1\] and lcs\[i-1\]\[j\] to calculate lcs\[i\]\[j\].

**Why do we iterate row by row?** 

By processing the table row by row from top to bottom and left to right within each row, we ensure that when computing `lcs[i][j]`, the values `lcs[i - 1][j - 1]`, `lcs[i - 1][j]`, and `lcs[i][j - 1]` have all already been computed. This guarantees that every subproblem we depend on is available when we need it.

// Diagram: Traversing by row and then by column ensures all subproblems required to calculate lcs\[i\]\[j\] are already solved

This way, at the end of all iterations, every entry `lcs[i][j]` correctly stores the length of the longest common subsequence of the first `i` characters of `s1` and the first `j` characters of `s2`. The value at `lcs[m][n]` is the length of the longest common subsequence of the full strings `s1` and `s2`.

Find the length of the longest common subsequence of "ab" and "acb".

## Algorithm

The steps below summarise the dynamic programming algorithm to find the longest common subsequence using a bottom-up approach.

> -   **Step 1:** If `s1` or `s2` is empty, return `0`
> -   **Step 2:** Create a 2D array `lcs` of size `(m + 1) x (n + 1)` where `m` is the length of `s1` and `n` is the length of `s2`, and initialize all entries to `0`
> -   **Step 3:** Iterate from `1` to `m` using a variable `i` and do the following:
>     -   **Step 3.1:** Iterate from `1` to `n` using a variable `j` and do the following:
>         -   **Step 3.1.1:** If `s1\[i - 1\] == s2\[j - 1\]`, set `lcs\[i\]\[j\]` to `lcs\[i - 1\]\[j - 1\] + 1`
>         -   **Step 3.1.2:** Otherwise, set `lcs\[i\]\[j\]` to the maximum of `lcs\[i - 1\]\[j\]` and `lcs\[i\]\[j - 1\]`
> -   **Step 4:** Return `lcs\[m\]\[n\]`

## Implementation

The bottom-up dynamic programming solution to the problem is given below.

C++

```cpp
#include <string>
#include <vector>
#include <algorithm>

// Diagram: using namespace std;

class Solution {
public:
    int longestCommonSubsequence(string& s1, string& s2) {

        int m = s1.size();
        int n = s2.size();

        // If either string is empty, LCS length is 0
        if (m == 0 || n == 0) return 0;

        // lcs[i][j] represents the LCS length of:
        // first i characters of s1 (s1[0..i-1])
        // first j characters of s2 (s2[0..j-1])
        vector<vector<int>> lcs(m + 1, vector<int>(n + 1, 0));

        // Build the DP table row by row
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {

                // If the current characters match,
                // extend the LCS from the previous prefixes
                if (s1[i - 1] == s2[j - 1]) {
                    lcs[i][j] = lcs[i - 1][j - 1] + 1;
                }
                // Otherwise, skip one character from either string
                // and take the best possible result
                else {
                    lcs[i][j] = max(lcs[i - 1][j],  // skip char from s1
                                    lcs[i][j - 1]); // skip char from s2
                }

        // The final cell contains the LCS length of the full strings
        return lcs[m][n];
    }
};
```

Java

```java
class Solution {

// Diagram: public int longestCommonSubsequence(String s1, String s2) {

        int m = s1.length();
        int n = s2.length();

        // If either string is empty, LCS length is 0
        if (m == 0 || n == 0) return 0;

        // lcs[i][j] represents the LCS length of:
        // first i characters of s1 (s1[0..i-1])
        // first j characters of s2 (s2[0..j-1])
        int[][] lcs = new int[m + 1][n + 1];

        // Build the DP table row by row
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {

                // If the current characters match,
                // extend the LCS from the previous prefixes
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    lcs[i][j] = lcs[i - 1][j - 1] + 1;
                }
                // Otherwise, skip one character from either string
                // and take the best possible result
                else {
                    lcs[i][j] = Math.max(
                        lcs[i - 1][j],  // skip char from s1
                        lcs[i][j - 1]   // skip char from s2
                    );
                }

        // The final cell contains the LCS length of the full strings
        return lcs[m][n];
    }
```

Python

```python
from typing import List

class Solution:
    def longestCommonSubsequence(self, s1: str, s2: str) -> int:

        m: int = len(s1)
        n: int = len(s2)

        # If either string is empty, LCS length is 0
        if m == 0 or n == 0:
            return 0

        # lcs[i][j] represents the LCS length of:
        # first i characters of s1 (s1[0..i-1])
        # first j characters of s2 (s2[0..j-1])
        lcs: List[List[int]] = [[0] * (n + 1) for _ in range(m + 1)]

        # Build the DP table row by row
        for i in range(1, m + 1):
            for j in range(1, n + 1):

                # If the current characters match,
                # extend the LCS from the previous prefixes
                if s1[i - 1] == s2[j - 1]:
                    lcs[i][j] = lcs[i - 1][j - 1] + 1

                # Otherwise, skip one character from either string
                # and take the best possible result
                else:
                    lcs[i][j] = max(
                        lcs[i - 1][j],  # skip char from s1
                        lcs[i][j - 1]   # skip char from s2
                    )

        # The final cell contains the LCS length of the full strings
        return lcs[m][n]
```

## Complexity analysis

The total number of distinct subproblems in the bottom-up solution is determined by the number of valid `(i, j)` pairs where `i` ranges from `0` to `m` and `j` ranges from `0` to `n`. Since the algorithm always fills the entire table regardless of the input, the time complexity in any case is **O(M × N)**.

// Diagram: The results for all subproblems are computed once, leading to a time complexity of O(MxN).

Since we create a 2D array `lcs` of size `(m + 1) × (n + 1)` where `m` and `n` are the lengths of the two strings, the space complexity in any case is **O(M × N)**.

// Diagram: We create a 2D array of size (m+1) x (n+1), leading to a space complexity of O(MxN).

> **Any Case:**
>
> -   Space Complexity - **O(M × N)**
> -   Time Complexity - **O(M × N)**

***

# Longest common subsequence

## Problem Statement

Given two strings **s1** and **s2**, write a function to find and return the length of the longest common subsequence present in both strings.

A subsequence of a string is a sequence that is generated by deleting some characters (possibly 0) from the string without altering the order of the remaining characters. For example, abc, `abg`, `bdf`, `aeg`, `acefg`, etc are subsequences of the string `abcdefg`.

### Example 1

> -   **Input:** s1 = abcdefgh, s2 = bxclf
> -   **Output:** 3
> -   **Explanation:** bcf is the longest common subsequence between the two strings.

### Example 2

> -   **Input:** s1 = xyzabc, s2 = xzlfcb
> -   **Output:** 3
> -   **Explanation:** xzc and xzb are both the longest common subsequences between the two strings.

### Example 3

> -   **Input:** s1 = abc, s2 = def
> -   **Output:** 0
> -   **Explanation:** There is no common subsequence between the two strings.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int longestCommonSubsequence(string s1, string s2) {
        int n = s1.length();
        int m = s2.length();

        // Create a 2D vector to store the dynamic programming table
        vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));

        // Fill in the dp table
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (s1[i - 1] == s2[j - 1]) {

                    // If the characters at current indices match, add 1
                    // to the previous diagonal cell value
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {

                    // If the characters at current indices don't match,
                    // take the maximum of the previous row or previous
                    // column cell
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        // Return the length of the longest common subsequence
        return dp[n][m];
    }
};
```

***

# Longest common subsequence II

## Problem Statement

Given two strings **s1** and **s2**, write a function to find and return all the longest common subsequences present in both strings. You can return the result in **any order**.

A subsequence of a string is a sequence that is generated by deleting some characters (possibly 0) from the string without altering the order of the remaining characters. For example, abc, `abg`, `bdf`, `aeg`, `acefg`, etc are subsequences of the string `abcdefg`.

### Example 1

> -   **Input:** s1 = abcdefgh, s2 = bxclf
> -   **Output:** \[bcf\]
> -   **Explanation:** bcf is the longest common subsequence between the two strings.

### Example 2

> -   **Input:** s1 = xyzabc, s2 = xzlfcb
> -   **Output:** \[xzc, xzb\]
> -   **Explanation:** xzc and xzb are both the longest common subsequences between the two strings.

### Example 3

> -   **Input:** s1 = abc, s2 = def
> -   **Output:** \[\]
> -   **Explanation:** There is no common subsequences between the two strings.

## Solution

```cpp
#include <algorithm>
#include <unordered_set>

using namespace std;

class Solution {
public:
    void backtrack(
        vector<vector<int>> &dp,
        string &s1,
        string &s2,
        int i,
        int j,
        string &current,
        unordered_set<string> &result
    ) {

        // Reached the end of one of the strings, add the current LCS
        // to the result Reverse the current LCS
        if (i == 0 || j == 0) {
            reverse(current.begin(), current.end());

            // Add the current LCS to the result
            result.insert(current);

            // Reverse the current LCS back to its original order
            reverse(current.begin(), current.end());
            return;
        }

        // Characters match, include it in the current LCS and move
        // diagonally
        if (s1[i - 1] == s2[j - 1]) {
            current.push_back(s1[i - 1]);
            backtrack(dp, s1, s2, i - 1, j - 1, current, result);

            // Remove the last character for backtracking
            current.pop_back();
        }

        // Characters don't match, move in the direction of the
        // larger LCS
        else {
            bool movedUp = false, movedLeft = false;

            // Move upwards
            if (dp[i - 1][j] > dp[i][j - 1]) {
                movedUp = true;
                backtrack(dp, s1, s2, i - 1, j, current, result);
            }

            // Move to the left
            if (dp[i][j - 1] > dp[i - 1][j]) {
                movedLeft = true;
                backtrack(dp, s1, s2, i, j - 1, current, result);
            }

            // If both paths are the same, only move once per state
            if (!movedUp && !movedLeft) {
                backtrack(dp, s1, s2, i - 1, j, current, result);
                backtrack(dp, s1, s2, i, j - 1, current, result);
            }
        }
    }

    vector<string> longestCommonSubsequenceII(string s1, string s2) {
        int n = s1.length();
        int m = s2.length();

        // Create a 2D DP table
        vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {

                // Characters match, increment the LCS length
                if (s1[i - 1] == s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                }

                // Characters don't match, take the maximum LCS
                // length
                else {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        // Store all possible LCSs, using set to avoid duplicates
        unordered_set<string> uniqueResults;

        // Store the current LCS
        string current;

        // Call the backtrack function to find all LCSs
        backtrack(dp, s1, s2, n, m, current, uniqueResults);

        // Convert set to vector and return
        return vector<string>(
            uniqueResults.begin(), uniqueResults.end()
        );
    }
};
```
