# Wildcard pattern matching

## Problem Statement

You are given a string **s** and a **pattern**, pattern can contain wildcard characters, i.e. `?` and `*` (definitions given below). Write a function that returns true if the pattern can match the string, return false otherwise.

> -   ? can match to any single character
> -   \* can match any number of characters including zero characters

### Example 1

> -   **Input:** s = abcdef, pattern = abc??f
> -   **Output:** true
> -   **Explanation:** We can replace the two '?' with characters 'd' and 'e' respectively to match the string.

### Example 2

> -   **Input:** s = abcdef, pattern = ab\*
> -   **Output:** true
> -   **Explanation:** We can replace \* with the characters cdef to match the string.

### Example 3

> -   **Input:** s = abcdef, pattern = ab?
> -   **Output:** false
> -   **Explanation:** We cannot create the string as we can only add a single character which will not be enough to match the string.

## Solution

```cpp
using namespace std;

class Solution {
public:
    bool wildcardPatternMatching(string s, string pattern) {
        int n = s.length();
        int m = pattern.length();

        // Create a 2D vector to store the dynamic programming results
        vector<vector<bool>> dp(n + 1, vector<bool>(m + 1, false));

        // Initialize the base case
        dp[0][0] = true;

        // Fill in the first row of dp
        for (int j = 1; j <= m; j++) {

            // If the current character is '*', copy the result from the
            // previous column
            if (pattern[j - 1] == '*') {
                dp[0][j] = dp[0][j - 1];
            }
        }

        // Fill in the remaining cells of dp
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {

                // If the characters at the current positions match or if
                // the pattern has a '?', copy the result from the
                // diagonal element (top-left)
                if (pattern[j - 1] == '?' ||
                    pattern[j - 1] == s[i - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                }

                // If the current character in the pattern is '*', we
                // have two options:
                // 1. Use '*' to match 0 characters, so copy the result
                // from the cell above (dp[i - 1][j]).
                // 2. Use '*' to match 1 or more characters, so copy the
                // result from the cell to the left (dp[i][j - 1]).
                else if (pattern[j - 1] == '*') {
                    dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
                }
            }
        }

        // Return the result stored in the bottom-right cell of dp
        return dp[n][m];
    }
};
```

***

# Interleaving Check

## Problem Statement

Given three strings **s1,** **s2,** and **s3**, write a function that returns `true` if the third string is interleaving the first and second strings, return `false` otherwise.

A string is interleaving two strings if it is formed from all characters of the first and second string, and the order of characters is preserved.

### Example 1

> -   **Input:** s1 = code, s2 = intuition, s3 = cointuitionde
> -   **Output:** true
> -   **Explanation:** The third string is interleaving the first two strings.

### Example 2

> -   **Input:** s1 = abc, s2 = def, s3 = adbecf
> -   **Output:** true
> -   **Explanation:** The third string is interleaving the first two strings.

### Example 3

> -   **Input:** s1 = abc, s2 = def, s3 = adcebf
> -   **Output:** false
> -   **Explanation:** The third string is not interleaving the first two strings as the original order of the first string is not preserved in it.

## Solution

```cpp
using namespace std;

class Solution {
public:
    bool interleavingCheck(string s1, string s2, string s3) {
        int n = s1.length();
        int m = s2.length();

        // base case: length of given strings doesn't match
        if (n + m != s3.length()) {
            return false;
        }

        // Create a 2D matrix to store the intermediate results
        // dp[i][j] will represent whether s3[0...i+j-1] can be formed by
        // interleaving s1[0...i-1] and s2[0...j-1]
        vector<vector<bool>> dp(n + 1, vector<bool>(m + 1, false));

        // Base case: an empty s1 and s2 can form an empty s3
        dp[0][0] = true;

        // Fill the matrix in a bottom-up manner
        for (int i = 0; i <= n; i++) {
            for (int j = 0; j <= m; j++) {

                // Check if s1's current character matches with s3's
                // current character and the previous characters of s1
                // and s2 have already formed s3
                if (i > 0 && s1[i - 1] == s3[i + j - 1])
                    dp[i][j] = dp[i][j] || dp[i - 1][j];

                // Check if s2's current character matches with s3's
                // current character and the previous characters of s1
                // and s2 have already formed s3
                if (j > 0 && s2[j - 1] == s3[i + j - 1])
                    dp[i][j] = dp[i][j] || dp[i][j - 1];
            }
        }

        // The bottom-right element of the matrix represents whether
        // s3 can be formed by interleaving s1 and s2
        return dp[n][m];
    }
};
```
