# Understanding the word break problem

In many text-processing systems, programs need to take a continuous piece of text and figure out how it can be split into meaningful parts. For example, when dealing with languages or inputs where spaces are missing, the system must decide where one word ends and the next begins using only a known dictionary of valid words.

While this might seem straightforward at first, the difficulty comes from the many possible ways a string can be broken into pieces. This is the classical word break problem, where the objective is to decide if a given string can be fully segmented into words that appear in a provided dictionary.

// Diagram: Find if the entire string can be segmented into words from the given dictionary.

The word break problem is foundational in natural language processing for tasks like tokenization and input segmentation, and finds practical use in spell-checking systems, search query parsing, and domain name decomposition.

In this lesson, we will look at the word break problem and how it can be solved efficiently using a dynamic programming solution.

## The word break problem

Consider we are given a string `s` of length `n` and a list of valid words called `wordDict`.

// Diagram: Given a string of length 6 and a list of words.

Our goal is to determine whether `s` can be segmented into one or more substrings such that:

-   Every substring is a word present in `wordDict`.
-   The substrings, when concatenated in order, form the original string `s`.

If the entire string is itself a word in the word set, then no segmentation is needed. Otherwise, we must decide where to split so that each resulting piece is a valid dictionary word. We need to determine whether it is possible to segment `s` into valid dictionary words.

// Diagram: Find if we can partition the string such that all partitioned substrings are present in the given dictionary.

## Optimal substructure

It is easy to prove that the solution to the word break problem can be constructed from solutions to its smaller subproblems. To see this, consider a substring `s[i...j]` and think about what choices are available to us.

The most important observation is: if `s[i...j]` is itself a word in the word set, we are done. The entire substring is one valid word, and no further splitting is needed.

// Diagram: If the substring s\[i...j\] is in the dictionary, the entire substring is a valid word, and no further splitting is needed.

If `s[i...j]` is not a dictionary word, then we must split it somewhere. For each possible split position `k`, where `i <= k < j`, we look at the left part `s[i...k]` as a candidate for the first word in our segmentation.

// Diagram: My Awesome Creation

However, not every split position is valid. We can only split at position `k` if the left part `s[i...k]` exists in `wordDict`.

// Diagram: Only the positions where the substring s\[i...k\] exists in the dictionary are valid split positions.

If we choose the first valid split, then we need to recursively check whether the remaining right part `s[k+1...j]` can also be segmented into valid dictionary words.

// Diagram: For a valid split, the solution is determined by whether the remaining substring s\[k+1...j\] can be split

However, this may not lead to a successful segmentation, as some other value of `k` may produce a valid segmentation while the first one does not. Since we want to know if any valid segmentation exists, we check all valid split positions `k` where `i <= k < j` and `s[i...k]` is a word in `wordDict`. If any such `k` leads to a successful segmentation of the remaining right part, the answer is `true`.

// Diagram: If any split position results in a right part that can be split as well, it means the entire substring s\[i...j\] can be split.

**Why don't we fix the last word and recurse on the left part?** 

It can be proved that iterating in either direction produces the same answer. Both formulations enumerate exactly the same set of segmentations, just indexed differently. Any valid segmentation of `s[i...j]` into dictionary words has a well-defined **first** word and a well-defined **last** word. Fixing the **left** segment as a dictionary word and recursing right corresponds to choosing the **first** word, while fixing the **right** segment and recursing left corresponds to choosing the **last** word.

Based on the above, it is clear that to determine if `s[i...j]` can be segmented, we have the following cases:

-   If `s[i...j]` is a word in `wordDict`, then the answer is `true`.
-   Otherwise, for each position `k` where `i <= k < j` and `s[i...k]` is a word in `wordDict`, we check if `s[k+1...j]` can be segmented. If any such `k` leads to a successful segmentation, the answer is `true`.
-   If no valid `k` exists, the answer is `false`.

The solution to the problem depends on the solutions to these smaller subproblems.

// Diagram: The optimal solution to the problem depends on the optimal solution to the smaller subproblems.

Note that the subproblems are uniquely identified by two dimensions: the starting index `i` and the ending index `j` of the substring.

Based on the optimal substructure above, we can define the relationship between the problem and its subproblems. We define `inWordDict(i, j)` that returns whether `s[i...j]` is a word in `wordDict`, and `canBreak(i, j)` that returns whether the substring `s[i...j]` can be segmented into valid dictionary words.

// Diagram: Define functions canBreak and inWordDict to find if a substring can be split and if it is in the wordDict.

The base cases are:

-   If `i > j`, we have an empty substring which is trivially segmented, so `canBreak(i, j) = true`.
-   If `inWordDict(i, j) = true`, the entire substring is a dictionary word, so `canBreak(i, j) = true`.

// Diagram: The base cases for the canBreak and inWordDict functions.

**When does the `i > j` base case actually get reached?** 

When a valid first word `s[i...k]` covers the entire substring (i.e. `k == j`), we recurse on `canBreak(k + 1, j) = canBreak(j + 1, j)` where `i > j`. This represents the empty string remaining after the last word, which must return `true` to confirm the segmentation. This is equivalent to the `inWordDict(i, j)` check returning `true`, but the recursion may still reach this state depending on the implementation.

To get the solution for `canBreak(i, j)`, we first check if `inWordDict(i, j)` is `true`. If so, the entire substring is a dictionary word and we return `true`. Otherwise, we scan every split position `k` from `i` to `j - 1`. For each `k` where `inWordDict(i, k)` is `true`, we check `canBreak(k + 1, j)`. If any such call returns `true`, then `canBreak(i, j) = true`.

Note that `inWordDict(i, j)` is a simple word set lookup on the substring `s[i...j]`, and `canBreak` is the recursive function that depends on these lookups.

The recurrence relation below expresses the solution to the problem as a function of solutions to smaller problems. The solution to the original problem is `canBreak(0, n - 1)`.

// Diagram: The recurrence relation for the word break problem.

**How does word break differ from palindrome partitioning?** 

Both problems involve splitting a string so that each piece satisfies a constraint. For the word break problem, it has to be a dictionary word here, versus in the palindrome partitioning problem, it has to be a palindrome. The structure is the same: fix the left segment, recurse on the right. However, palindrome partitioning asks for the **minimum number of cuts**, so it takes the **minimum** over all valid split positions. Word break only asks **whether** a valid segmentation exists, so it takes the logical **OR** over all valid split positions, if any one works, the answer is `true`.

## Overlapping subproblems

It is easy to see that the recurrence produces many overlapping subproblems. To compute `canBreak(i, j)`, we evaluate `canBreak(k + 1, j)` for every `k` where `inWordDict(i, k)` holds `true`. Each of those calls to `canBreak(k + 1, j)` requires its own set of word set lookups and further recursive calls.

// Diagram: The canBreak function calls the inWordDict function on multiple ranges and then recursively calls itself depending on the result.

Conversely, `canBreak(k + 1, j)` appears not only when computing `canBreak(i, j)`, but also when computing `canBreak(i', j)` for any `i' < k + 1` such that `inWordDict(i', k)` is `true`. In other words, every substring whose valid first word ends at position `k` will invoke the same subproblem `canBreak(k + 1, j)`.

// Diagram: A problem state may appear as a subproblem in many other problem states.

A brute-force recursive solution recomputes the same subproblems each time they are reached from different paths, leading to exponential time complexity. Since these overlapping subproblems exist, the problem can be solved efficiently using either a top-down dynamic programming approach with memoization or a bottom-up dynamic programming approach built from the base cases upward.

***

# Word break

## Problem Statement

Given a string **s** and a word dictionary **dict**, write a function that returns `true` if the string can be segmented into a space-separated sequence of one or more dictionary words, return `false` otherwise.

### Example 1

> -   **Input:** s = codeintuition, dict = \[code, intuition\]
> -   **Output:** true
> -   **Explanation:** codeintuition can be segmented as code intuition using the dictionary words.

### Example 2

> -   **Input:** s = phoneisphone, dict = \[is, phone\]
> -   **Output:** true
> -   **Explanation:** phoneisphone can be segmented as phone is phone using the dictionary words.

### Example 3

> -   **Input:** s = phoneisphone, dict = \[phone, and\]
> -   **Output:** false
> -   **Explanation:** phoneisphone cannot be segmented using the dictionary words.

## Solution

```cpp
#include <unordered_set>

using namespace std;

class Solution {
public:
    bool wordBreak(string s, vector<string> &dict) {
        int n = s.length();
        vector<bool> dp(n + 1, false);

        // Base case: an empty string can be segmented
        dp[0] = true;

        // Convert dict to unordered_set for efficient word lookup
        unordered_set<string> dictSet(dict.begin(), dict.end());

        for (int i = 1; i <= n; i++) {

            // Check if the current prefix can be segmented
            for (int j = 0; j < i; j++) {

                // Check if the prefix ending at index j is already
                // segmented and the remaining suffix from j to i is a
                // valid word in the dictionary
                if (dp[j] &&
                    dictSet.find(s.substr(j, i - j)) != dictSet.end()) {

                    // Set dp[i] to true indicating that the current
                    // substring can be segmented
                    dp[i] = true;

                    // No need to check further for this prefix
                    break;
                }
            }
        }

        return dp[n];
    }
};
```
