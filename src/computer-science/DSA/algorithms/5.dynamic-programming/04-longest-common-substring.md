# Understanding the longest common substring problem

Many problems that involve strings are really about finding patterns that appear in more than one input. Sometimes those patterns can have gaps (subsequences) or allow characters to appear in a different order (subsets). Other times, the pattern has to stay completely continuous (substrings). That difference might seem small, but it can change the way a problem behaves and how we solve it. A classic example is the longest common substring problem, where the goal is to find the longest sequence of characters that appears continuously in both strings.

// Diagram: The longest common substring between two strings.

At first glance, comparing all substrings of two strings feels straightforward, but the number of possible substrings grows quickly as the strings get longer. Naively checking all possibilities becomes impractical. This problem has practical applications in fields such as bioinformatics for DNA sequence analysis, plagiarism detection, file comparison tools, and data compression algorithms.

In this lesson, we will explore the longest common substring problem and see how dynamic programming helps us solve it in a structured and efficient way.

## The longest common substring problem

Consider we are given two strings `s1` and `s2` of lengths `m` and `n` respectively. A substring is a contiguous sequence of characters within a string. Unlike a subsequence, the characters must appear in the exact same consecutive order as they do in the original string.

// Diagram: A substring is a contiguous sequence of characters within a string.

The goal is to find the length of the longest substring that appears in both `s1` and `s2` without breaking character order or continuity.

// Diagram: The longest common substring between two strings.

## Optimal substructure

It is easy to prove that the optimal solution to the longest common substring problem can be constructed from optimal solutions to its smaller subproblems.

It is important to observe that for any common substring that ends at a certain position in both strings, the characters at those positions must be equal. Furthermore, if we remove these matching end characters, the remaining portions must also be common substrings ending one position earlier in both strings.

// Diagram: The common substring ending at some indices in the two strings should have a common prefix.

Consider the characters at index `i` in `s1` and index `j` in `s2`. We need to consider the following cases to find the common substrings ending at these indices.

1.  1If `s1[i] == s2[j]`, then the longest common substring ending at these positions is `1` + the longest common substring ending at index `i - 1` in `s1` and index `j - 1` in `s2`. The matching characters extend whatever common substring was building up from the previous positions.
2.  2If `s1[i] != s2[j]`, then no common substring can end at these positions simultaneously. The continuity required by a substring is broken, and the length becomes `0`.

The solution to the problem depends on the optimal solution of these smaller subproblems.

// Diagram: The solution to the problem depends on the optimal solution of these smaller subproblems.

**How does this differ from the longest common subsequence?**

In the longest common subsequence problem, when characters don't match, we try excluding one character at a time and take the maximum of both options. Here, a mismatch immediately terminates the common substring at these positions; there is no option to skip characters because a substring must be contiguous.

Based on the optimal substructure above, we can define the relationship between the problem and its subproblems. We can define a function `lcs(i, j)` that returns the length of the longest common substring that ends at index `i` in `s1` and index `j` in `s2`. If `s1[i]` does not equal `s2[j]`, then `lcs(i, j)` returns `0` since no common substring can end at these positions.

Note that the subproblems are uniquely identified by two dimensions: the index `i` in `s1` and the index `j` in `s2`.

// Diagram: Define a function lcs to find the longest common substring in the strings.

**Why does the base case use `i < 0` or `j < 0` instead of `i == 0` or `j == 0`?** 

Since `i` is an index into `s1`, the value `i == 0` represents the state where we are considering the character `s1[0]`, which is still a valid position. Only when `i` drops below `0` have we truly exhausted all characters. The same applies to `j` and `s2`.

// Diagram: The base case in finding the longest common substring.

The recurrence relation below expresses the solution to the problem as a function of solutions to smaller problems.

// Diagram: The recurrence relation for the longest common substring problem.

The solution to the problem is the **maximum** value of `lcs(i , j)` for `0 < = i < m` and `0 <= j < n`.

**Why is the answer not simply `lcs(m - 1, n - 1)`?**

Unlike the longest common subsequence where `lcs(m - 1, n - 1)` directly gives the answer, `lcs(i, j)` only captures the longest common substring ending at specific positions. The longest common substring in the entire strings could end anywhere. The solution to the problem is therefore the **maximum** of `lcs(i, j)` across all `0 <= i < m` and `0 <= j < n`.

// Diagram: The solution to the problem is the maximum of lcs ending at all positions.

## Overlapping Subproblems

It is easy to see that there are many overlapping subproblems in the recurrence relation to solve the longest common substring problem.

To solve the problem, we need to compute `lcs(i, j)` for all `0 <= i < m` and `0 <= j < n` and take the maximum of all values. When doing that, the subproblem `lcs(i - 2, j - 2)` is computed for both `lcs(i - 1, j - 1)` and `lcs(i, j)` if `s1[i] == s2[j]` and `s1[i-1] == s2[j-1]`. This pattern continues for all the subsequent matching positions.

// Diagram: There are many overlapping subproblems when finding the solution for all lcs(i, j) for 0 <= i < m and 0 < =j < n.

Conversely, the subproblem `lcs(i, j)` appears in the computation of `lcs(i + 1, j + 1)` when `s1[i + 1]` equals `s2[j + 1]`, and this pattern continues for all subsequent matching positions.

// Diagram: The same problem state may appear as a subproblem when solving many different problems.

A brute-force recursive backtracking solution repeatedly recomputes the same subproblems when it reaches them from different paths, which makes it highly inefficient. Because these overlapping subproblems exist, the problem can be solved more efficiently either with a top-down dynamic programming approach using memoization or a bottom-up dynamic programming approach starting from the base cases.

***

# Understanding the top-down solution to the longest common substring problem

To solve the longest common substring problem using a top-down dynamic programming approach, we directly implement the recurrence relation using recursion and store previously computed results in a memoization table to avoid redundant work.

## The top down solution

As with any top-down solution, there is a recursive function that solves subproblems and a calling function that initializes the required data structures and triggers the computation. For the longest common substring, we define a single recursive function `lcs` and a calling function that iterates over all positions to find the global maximum.

### The lcs function

The function `lcs` takes as input an index `i` into `s1`, an index `j` into `s2`, references to both strings `s1` and `s2`, and a reference to the memoization array `memo`. The function returns the length of the longest common substring that ends at index `i` in `s1` and index `j` in `s2`.

// Diagram: Create a function lcs to return the longest common substring for two prefixes of string s1 and s2.

The `memo` array has dimensions `m × n` where `m` is the length of `s1` and `n` is the length of `s2`, and is initialized with `-1` in the calling function, where `-1` indicates that the state has not yet been computed. Any non-negative value represents the computed length of the longest common substring ending at that pair of positions.

// Diagram: The memo array has a size m x n and is initialized with -1.

When `lcs` is called, we first handle the base case. If `i` is less than `0` or `j` is less than `0`, we have exhausted one of the strings, so no common substring can exist and we return `0`.

**Why is the base case `i < 0` or `j < 0` instead of `i == 0` or `j == 0`?** 

Since `i` is an index into `s1`, the value `i == 0` represents the state where we are considering the character `s1[0]`, which is still a valid position. Only when `i` drops below `0` have we truly exhausted all characters. The same applies to `j` and `s2`.

// Diagram: If i < 0 or j < 0, the solution is 0, and this serves as the base case.

Before making any recursive calls, we check the `memo` array to see if the solution to the current problem state has already been computed. If `memo[i][j]` is not `-1`, it means the result for this state has already been computed, and we return it directly.

// Diagram: If memo\[i\]\[j\] is not -1, it means the solution to that subproblem is already computed and can be returned to the caller.

If the state `(i, j)` has not been computed, we evaluate the recurrence relation. We first check if `s1[i]` equals `s2[j]`. If the characters match, we set `memo[i][j]` to `1 + lcs(i - 1, j - 1)`, since this matching character extends the common substring that was building up from the previous positions. We return `memo[i][j]`.

// Diagram: If the characters match, we can extend the longest common substring ending at the previous indices.

If the characters do not match, we set `memo[i][j]` to `0` since no common substring can end at these positions when the characters differ. We return `memo[i][j]`.

**Why don't we recurse into smaller subproblems when characters don't match?** 

Unlike the longest common subsequence, where a mismatch leads to two recursive calls (excluding one character at a time), a substring requires contiguity. When `s1[i] != s2[j]`, any common substring ending at these positions is immediately broken, so the answer is `0` with no further exploration needed.

// Diagram: If the characters don't match, the solution for the state (i, j) is 0.

### The calling function

In the calling function, we first handle the edge case where either string is empty, returning `0` immediately. We then create a memoization array `memo` of dimensions `m × n` where `m` is the length of `s1` and `n` is the length of `s2`, initialized with all entries set to `-1`.

We then initialize a variable `result` to `0` to keep track of the longest common substring found so far.

// Diagram: We create a 2D memo array of size m x n and initialize it with -1 and a result variable initialized to 0.

Since the longest common substring can end at any pair of positions, we iterate through all positions using two nested loops: the outer loop iterates from `0` to `m - 1` using variable `i`, and the inner loop iterates from `0` to `n - 1` using variable `j`. In each iteration, we update `result` with the maximum of `lcs(i, j)` and the current value of `result`.

**Why do we need to iterate over all `(i, j)` pairs in the calling function?** 

Unlike the longest common subsequence where a single call `lcs(m - 1, n - 1)` gives the final answer, `lcs(i, j)` only captures the longest common substring ending at specific positions. The longest common substring in the entire strings could end anywhere, so we must check every pair and take the overall maximum.

At the end of all iterations, `result` has the length of the longest common substring between the two strings.

Find the length of the longest common substring of "ab" and "acb".

## Algorithm

The steps below summarize the algorithm to find the longest common substring between two strings using top-down dynamic programming.

> **lcs(i, j, \[ref\] s1, \[ref\] s2, \[ref\] memo):**
>
> -   **Step 1:** If \`i < 0\` or \`j < 0\`, return \`0\`
> -   **Step 2:** If \`memo\[i\]\[j\] != -1\`, return \`memo\[i\]\[j\]\`
> -   **Step 3:** If \`s1\[i\] != s2\[j\]\`, set \`memo\[i\]\[j\]\` to \`0\` and return \`0\`
> -   **Step 4:** Set \`memo\[i\]\[j\]\` to \`1 + lcs(i - 1, j - 1, s1, s2, memo)\`
> -   **Step 5:** Return \`memo\[i\]\[j\]\`
>
> **callingFunction(\[ref\] s1, \[ref\] s2):**
>
> -   **Step 1:** Initialize \`m\` and \`n\` with the lengths of \`s1\` and \`s2\`
> -   **Step 2:** If \`m == 0\` or \`n == 0\`, return \`0\`
> -   **Step 3:** Create a 2D array \`memo\` of size \`m x n\` and initialize it to \`-1\`
> -   **Step 4:** Initialize \`result\` to \`0\`
> -   **Step 5:** Iterate from \`0\` to \`m - 1\` using a variable \`i\` and do the following:
>     -   **Step 5.1:** Iterate from \`0\` to \`n - 1\` using a variable \`j\` and do the following:
>         -   **Step 5.1.1:** Set \`result\` to the maximum of \`result\` and \`lcs(i, j, s1, s2, memo)\`
> -   **Step 6:** Return \`result\`

## Implementation

The top-down dynamic programming solution to the problem using memoization is given below.

C++

```cpp
#include <vector>
#include <string>
#include <algorithm>

// Diagram: using namespace std;

class Solution {
private:
    // Returns the length of the longest common substring
    // ending at s1[i] and s2[j]
    int lcs(int i, int j, string& s1, string& s2, vector<vector<int>>& memo) {

        // If either index goes out of bounds,
        // no substring can exist
        if (i < 0 || j < 0) return 0;

        // Return cached result if already computed
        if (memo[i][j] != -1) {
            return memo[i][j];
        }

        // If characters don't match, the common substring
        // ending at these indices breaks
        if (s1[i] != s2[j]) {
            memo[i][j] = 0;
            return 0;
        }

        // If characters match, extend the substring
        // by checking the previous characters
        memo[i][j] = 1 + lcs(i - 1, j - 1, s1, s2, memo);
        return memo[i][j];
    }

public:
    int longestCommonSubstring(string& s1, string& s2) {

        int m = s1.size();
        int n = s2.size();

        // If either string is empty, result is 0
        if (m == 0 || n == 0) return 0;

        // memo[i][j] stores the length of the longest common substring
        // ending at s1[i] and s2[j]
        vector<vector<int>> memo(m, vector<int>(n, -1));

// Diagram: int result = 0;

        // Try every pair of indices as potential substring endings
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                result = max(result, lcs(i, j, s1, s2, memo));
            }

        // Return the maximum substring length found
        return result;
    }
};
```

Java

```java
import java.util.Arrays;

class Solution {
    // Returns the length of the longest common substring
    // ending at s1[i] and s2[j]
    private int lcs(int i, int j, String s1, String s2, int[][] memo) {

        // If either index goes out of bounds,
        // no substring can exist
        if (i < 0 || j < 0) return 0;

        // Return cached result if already computed
        if (memo[i][j] != -1) {
            return memo[i][j];
        }

        // If characters don't match, the common substring
        // ending at these indices breaks
        if (s1.charAt(i) != s2.charAt(j)) {
            memo[i][j] = 0;
            return 0;
        }

        // If characters match, extend the substring
        // by checking the previous characters
        memo[i][j] = 1 + lcs(i - 1, j - 1, s1, s2, memo);
        return memo[i][j];
    }

// Diagram: public int longestCommonSubstring(String s1, String s2) {

        int m = s1.length();
        int n = s2.length();

        // If either string is empty, result is 0
        if (m == 0 || n == 0) return 0;

        // memo[i][j] stores the length of the longest common substring
        // ending at s1[i] and s2[j]
        int[][] memo = new int[m][n];
        for (int[] row : memo) {
            Arrays.fill(row, -1);
        }

// Diagram: int result = 0;

        // Try every pair of indices as potential substring endings
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                result = Math.max(result, lcs(i, j, s1, s2, memo));
            }

        // Return the maximum substring length found
        return result;
    }
```

Python

```python
from typing import List

class Solution:
    def lcs(self, i: int, j: int, s1: str, s2: str, memo: List[List[int]],
    ) -> int:
        # Returns the length of the longest common substring
        # ending at s1[i] and s2[j]

        # If either index goes out of bounds,
        # no substring can exist
        if i < 0 or j < 0:
            return 0

        # Return cached result if already computed
        if memo[i][j] != -1:
            return memo[i][j]

        # If characters don't match, the common substring
        # ending at these indices breaks
        if s1[i] != s2[j]:
            memo[i][j] = 0
            return 0

        # If characters match, extend the substring
        # by checking the previous characters
        memo[i][j] = 1 + self.lcs(i - 1, j - 1, s1, s2, memo)
        return memo[i][j]

    def longest_common_substring(self, s1: str, s2: str) -> int:
        m: int = len(s1)
        n: int = len(s2)

        # If either string is empty, result is 0
        if m == 0 or n == 0:
            return 0

        # memo[i][j] stores the length of the longest common substring
        # ending at s1[i] and s2[j]
        memo: List[List[int]] = [[-1] * n for _ in range(m)]

// Diagram: result: int = 0

        # Try every pair of indices as potential substring endings
        for i in range(m):
            for j in range(n):
                result = max(result, self.lcs(i, j, s1, s2, memo))

        # Return the maximum substring length found
        return result
```

## Complexity analysis

In the worst case, the two strings have many matching characters distributed throughout, and the recursive function must explore many positions before memoization ensures that every subproblem is solved once. However, once the subproblem at a pair of positions is solved, it is never solved again, as the function reuses the value in the memo array the next time.

// Diagram: A subproblem (i, j) is solved only once.

For every pair `(i, j)`, the work done consists of a constant-time character comparison and possibly one recursive call exactly one time. All subsequent visits to the same state simply return precomputed values in constant time. Therefore, the total amount of work performed across all recursive calls is proportional to the number of unique states which is `m × n`, leading to a worst-case time complexity of **O(M × N)**.

// Diagram: In the worst case, all the subproblems are computed.

In the best case, the two strings share no common characters. For each pair of positions, the function performs only a character comparison before setting the result to `0`.

However, the calling function still iterates through all `m × n` pairs and calls `lcs(i, j)` for each to confirm that no characters match. Although no meaningful recursive calls extend the substring length, all comparisons are still executed. The time complexity in this case is also **O(M × N)**, leading to a time complexity of **O(M × N)** in any case.

// Diagram: If no characters match, the calling function still iterates across all problem states to get the maximum value.

Since we create the memoization array `memo` of size `m × n`, the space complexity in any case is **O(M × N)**.

// Diagram: The space complexity is O(M x N).

> **Any case:**
>
> -   Time Complexity - **O(M × N)**
> -   Space Complexity - **O(M × N)**

***

# Understanding the bottom-up solution to the longest common substring problem

To solve the longest common substring problem using a bottom-up dynamic programming approach, we build solutions iteratively starting from the smallest subproblems and working up to the final answer, storing results in a table as we progress. As with any bottom-up solution, we process subproblems in an order that guarantees every result we depend on has already been computed and stored before we need it.

## The bottom up solution

When implementing the recurrence relation using a top-down algorithm, `i` and `j` are indices into `s1` and `s2`, and the base case occurs when either index drops below `0`.

// Diagram: For the recurrence relations, if i < 0 or j < 0, the solution is 0, and this serves as the base case.

However, arrays cannot have negative indices. To handle this cleanly in the bottom-up table, we shift the meaning of `i` and `j` so that they represent the number of characters considered from each string rather than indices. This way, the base case becomes `i == 0` or `j == 0`, which maps naturally to row `0` and column `0` of the table.

**How does this shift change the recurrence?** 

The recurrence relation itself does not change — we still check if the last characters match and either extend or terminate. The only difference is that when `i` represents the number of characters considered, the last character of the prefix is at index `i - 1` in the string (instead of index `i`). This is purely a shift in how we index into the table and the strings, not a change in logic.

// Diagram: We can use i and j to denote the number of items considered from the start, instead of the index of the last item.

We create a 2D array `lcs` of dimensions `(m + 1) × (n + 1)`, where `lcs[i][j]` stores the length of the longest common substring that ends at the `ith` character of `s1` and the `j`th character of `s2`. All entries are initialized to `0`.

We also initialize a variable `result` to `0` to keep track of the longest common substring found so far.

**Why is the table `(m + 1) × (n + 1)` and not `m × n`?** 

Since `i` now represents the number of characters considered from `s1`, it ranges from `0` to `m`, giving `m + 1` possible values. Similarly, `j` ranges from `0` to `n`. The states where `i == 0` or `j == 0` represent the base cases where zero characters are taken from one string, and these need to be stored in the table. An `m × n` table would have no room for these base case entries, forcing us to handle the first row and first column as special cases inside the loop.

// Diagram: The lcs array has a size (m+1) x (n+1) and is initialized with 0.

The entire first row `lcs[0][j]` and first column `lcs[i][0]` remain `0` since when either string contributes zero characters, no common substring can exist. These serve as the base cases for the problem.

// Diagram: The base case is when i == 0 or j == 0.

We then iterate through the table using a variable `i` starting from `1` up to `m`. For each `i`, we iterate through all positions using a variable `j` from `1` to `n`. In each iteration, we compare `s1[i - 1]` with `s2[j - 1]`. If the characters match, we set `lcs[i][j]` to `lcs[i - 1][j - 1] + 1`, since this matching character extends the common substring that was building up from the previous positions.

**Why do we compare `s1[i - 1]` and `s2[j - 1]` instead of `s1[i]` and `s2[j]`?** 

This is a direct consequence of the shift described above. In the original recurrence relation, `i` is an index and we compare `s1[i]` with `s2[j]` directly. In the bottom-up table, `i` represents the number of characters considered, so the first `i` characters occupy indices `0` through `i - 1`. The last character in this prefix is therefore at index `i - 1`, not `i`. The same applies to `j` and `s2`.

// Diagram: If the characters match, we use lcs\[i-1\]\[j-1\] to calculate lcs\[i\]\[j\].

If the characters do not match, `lcs[i][j]` remains `0` since no common substring can end at these positions when the characters differ. The contiguity required by a substring is broken.

**Why don't we take the maximum of `lcs[i - 1][j]` and `lcs[i][j - 1]` when characters don't match?** 

Unlike the longest common subsequence where a mismatch leads to taking the better of two options (excluding one character at a time), a substring requires contiguity. When `s1[i - 1] != s2[j - 1]`, no common substring can end at these positions, so the value is simply `0`. There is no option to skip characters and continue building a substring.

// Diagram: If the characters don't match, the solution for the state (i, j) is 0.

After computing `lcs[i][j]`, we update `result` with the maximum of `result` and `lcs[i][j]`.

// Diagram: Update result in every iteration to keep track of the maximum value computed across all problem states.

**Why do we iterate row by row?** 

By processing the table row by row from top to bottom and left to right within each row, we ensure that when computing `lcs[i][j]`, the value `lcs[i - 1][j - 1]` has already been computed. This guarantees that every subproblem we depend on is available when we need it.

// Diagram: Traversing by row and then by column ensures all subproblems required to calculate lcs\[i\]\[j\] are already solved

This way, at the end of all iterations, every entry `lcs[i][j]` correctly stores the length of the longest common substring ending at the `i`th character of `s1` and the `j`th character of `s2`. The value of `result` at the end of all iterations is the length of the longest common substring between `s1` and `s2`.

**Why do we track `result` separately instead of just reading `lcs[m][n]`?** 

Unlike the longest common subsequence where `lcs[m][n]` directly gives the final answer, `lcs[i][j]` only captures the longest common substring ending at specific positions. The longest common substring could end anywhere in the two strings, so we must track the maximum across all entries as we fill the table.

Find the length of the longest common substring of "aba" and "adab".

## Algorithm

The steps below summarize the algorithm to find the longest common substring between two strings using bottom-up dynamic programming.

> -   **Step 1:** If \`s1\` or \`s2\` is empty, return \`0\`
> -   **Step 2:** Create a 2D array \`lcs\` of size \`(m + 1) x (n + 1)\` where \`m\` is the length of \`s1\` and \`n\` is the length of \`s2\`, and initialize all entries to \`0\`
> -   **Step 3:** Initialize \`result\` to \`0\`
> -   **Step 4:** Iterate from \`1\` to \`m\` using a variable \`i\` and do the following:
>     -   **Step 4.1:** Iterate from \`1\` to \`n\` using a variable \`j\` and do the following:
>         -   **Step 4.1.1:** If \`s1\[i - 1\] == s2\[j - 1\]\`, set \`lcs\[i\]\[j\]\` to \`lcs\[i - 1\]\[j - 1\] + 1\`
>         -   **Step 4.1.2:** Set \`result\` to the maximum of \`result\` and \`lcs\[i\]\[j\]\`
> -   **Step 5:** Return \`result\`

## Implementation

The bottom-up dynamic programming solution to the problem is given below.

C++

```cpp
#include <vector>
#include <string>
#include <algorithm>

// Diagram: using namespace std;

class Solution {
public:
    int longestCommonSubstring(string& s1, string& s2) {

        int m = s1.size();
        int n = s2.size();
        if (m == 0 || n == 0) return 0;

        // lcs[i][j] stores the length of the longest common substring
        // ending at the i-th char of s1 and the j-th char of s2
        vector<vector<int>> lcs(m + 1, vector<int>(n + 1, 0));

// Diagram: int result = 0;

        // Fill the table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1[i - 1] == s2[j - 1]) {
                    lcs[i][j] = lcs[i - 1][j - 1] + 1;
                }

                result = max(result, lcs[i][j]);
            }

        return result;
    }
};
```

Java

```java
class Solution {
    public int longestCommonSubstring(String s1, String s2) {

        int m = s1.length();
        int n = s2.length();
        if (m == 0 || n == 0) return 0;

        // lcs[i][j] stores the length of the longest common substring
        // ending at the i-th char of s1 and the j-th char of s2
        int[][] lcs = new int[m + 1][n + 1];

        // Initialize the result variable to track
        // the length of the longest common substring
        int result = 0;

        // Fill the table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    lcs[i][j] = lcs[i - 1][j - 1] + 1;
                }

                result = Math.max(result, lcs[i][j]);
            }

        return result;
    }
```

Python

```python
from typing import List

class Solution:
    def longest_common_substring(self, s1: str, s2: str) -> int:

        m: int = len(s1)
        n: int = len(s2)
        if m == 0 or n == 0:
            return 0

        # lcs[i][j] stores the length of the longest common substring
        # ending at the i-th char of s1 and the j-th char of s2
        lcs: List[List[int]] = [[0] * (n + 1) for _ in range(m + 1)]

        # Initialize the result variable to track
        # the length of the longest common substring
        result: int = 0

        # Fill the table
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if s1[i - 1] == s2[j - 1]:
                    lcs[i][j] = lcs[i - 1][j - 1] + 1

// Diagram: result = max(result, lcs[i][j])

        return result
```

## Complexity analysis

The time complexity of the algorithm is straightforward. We have a nested loop where the outer loop iterates `m+1` times and the inner loop iterates `n+1` times for each outer iteration in any case, where `m` and `n` are the lengths of `s1` and `s2` respectively. The total number of iterations is `(m+1) × (n+1)`, leading to a time complexity of **O(M × N)** in any case.

// Diagram: The results for all subproblems are computed once, leading to a time complexity of O(MxN).

Since we create a 2D array `lcs` of size `(m + 1) × (n + 1)` to store the results for all pairs of positions, the space complexity in any case is **O(M × N)**.

// Diagram: We create a 2D array of size (m+1) x (n+1), leading to a space complexity of O(MxN).

> **Any case:**
>
> -   Time Complexity - **O(M × N)**
> -   Space Complexity - **O(M × N)**

***

# Longest common substring

## Problem Statement

Given two strings **s1** and **s2**, write a function to find and return the longest common substring in both strings.

A substring is a subset or part of another string, or it is a contiguous sequence of characters within a string. For example, abc, `abc`, `bcd`, `def`, `cde`, etc are substrings of the string `abcdefg`.

### Example 1

> -   **Input:** s1 = abcdefgh, s2 = bxcdelx
> -   **Output:** cde
> -   **Explanation:** cde is the longest common substring between the two strings.

### Example 2

> -   **Input:** s1 = xyzabc, s2 = xzalfbc
> -   **Output:** za
> -   **Explanation:** za and bc are both the longest common substrings between the two strings.

### Example 3

> -   **Input:** s1 = lx, s2 = lx
> -   **Output:** lx
> -   **Explanation:** lx is the longest common substring between the two strings.

## Solution

```cpp
using namespace std;

class Solution {
public:
    string longestCommonSubstring(string s1, string s2) {
        int n = s1.length();
        int m = s2.length();

        // Create a 2D vector to store the lengths of common substrings
        vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));

        // Initialize variables to store the maximum length and end index
        // of the common substring
        int maxLength = 0;
        int endIndex = 0;

        // Iterate through each character of s1
        for (int i = 1; i <= n; i++) {

            // Iterate through each character of s2
            for (int j = 1; j <= m; j++) {

                // If the characters at the current positions match
                if (s1[i - 1] == s2[j - 1]) {

                    // Update the length of the common substring by
                    // adding 1 to the length of the substring ending at
                    // the previous positions
                    dp[i][j] = dp[i - 1][j - 1] + 1;

                    // Check if the current substring length is greater
                    // than the maximum length seen so far
                    if (dp[i][j] > maxLength) {

                        // Update the maximum length and the end index of
                        // the common substring
                        maxLength = dp[i][j];
                        endIndex = i - 1;
                    }
                }
            }
        }

        // If no common substring is found, return an empty string
        if (maxLength == 0) {
            return "";
        }

        // Extract the longest common substring from s1 using the end
        // index and the maximum length
        return s1.substr(endIndex - maxLength + 1, maxLength);
    }
};
```
