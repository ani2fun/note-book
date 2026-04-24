# Covering distance

## Problem Statement

Given a positive integer **distance**, write a function to count and return the total number of ways to cover this distance if you can only take `1`, `2` or `3` steps.

### Example 1

> -   **Input:** n = 3
> -   **Output:** 4
> -   **Explanation** The possible ways are
> -   1 step + 1 step + 1 step = 3
> -   1 step + 2 step = 3
> -   2 step + 1 step = 3
> -   3 step = 3

### Example 2

> -   **Input:** n = 2
> -   **Output:** 2
> -   **Explanation** The possible ways are to either take a single step of 2 or take two steps of 1

### Example 3

> -   **Input:** n = 1
> -   **Output:** 1
> -   **Explanation** The only possible way is to take 1 step

## Solution

```cpp
using namespace std;

class Solution {
public:
    int coveringDistance(int distance) {

        // Create an array to store the number of ways to reach each
        // distance
        int dp[distance + 1];

        // There is only one way to reach distance 0, which is to not
        // move
        dp[0] = 1;

        // Iterate through each distance from 1 to 'dist'
        for (int i = 1; i <= distance; i++) {

            // The number of ways to reach the current distance is
            // initially the same as the number of ways to reach the
            // previous distance
            dp[i] = dp[i - 1];

            // Check if it is possible to take a step of 2 units
            if (i >= 2) {

                // If it is possible, add the number of ways to reach the
                // distance 'i - 2' to the current number of ways
                dp[i] += dp[i - 2];
            }

            // Check if it is possible to take a step of 3 units
            if (i >= 3) {

                // If it is possible, add the number of ways to reach the
                // distance 'i - 3' to the current number of ways
                dp[i] += dp[i - 3];
            }
        }

        // The final element of the 'dp' array will contain the total
        // number of ways to reach the given distance 'dist'
        return dp[distance];
    }
};
```

***

# Reachability check

## Problem Statement

Given a non-negative integer array **arr** where `arr[i]` denotes the maximum number of steps you can jump forward from that index, write a function that returns `true` if you can reach the last index if you start from the first index, return `false` otherwise.

### Example 1

> -   **Input:** arr = \[1, 5, 8, 9\]
> -   **Output:** true
> -   **Explanation:** We can start from the first index, jump 1 step to reach the second index, and then jump 2 steps to reach the last index.

### Example 2

> -   **Input:** arr = \[2, 0, 1, 1\]
> -   **Output:** true
> -   **Explanation:** We can start from the first index, jump 2 steps to reach the third index, and then jump 1 step to reach the last index.

### Example 3

> -   **Input:** arr = \[2, 0, 0, 1\]
> -   **Output:** false
> -   **Explanation:** We cannot reach the last index.

## Solution

```cpp
using namespace std;

class Solution {
public:
    bool reachabilityCheck(vector<int> &arr) {
        int n = arr.size();
        vector<bool> dp(n, false);
        dp[n - 1] = true;

        // Starting from the second-to-last element and moving towards
        // the first element
        for (int i = n - 2; i >= 0; i--) {

            // Determine the maximum index we can jump to from the
            // current position
            int maxJump = min(i + arr[i], n - 1);

            // Check all possible indices we can reach from the current
            // position
            for (int j = i + 1; j <= maxJump; j++) {

                // If we can reach an index that is marked as true in dp,
                // set dp[i] to true
                if (dp[j]) {
                    dp[i] = true;
                    break;
                }
            }
        }

        // Return whether we can reach the first element (index 0)
        // starting from the last element
        return dp[0];
    }
};
```

***

# Longest bitonic subsequence

## Problem Statement

Given an integer array **arr**, write a function to find and return the length of the longest bitonic subsequence in it.

A bitonic sequence is a sequence in which the elements are first sorted in increasing order, then in decreasing order.

### Example 1

> -   **Input:** arr = \[1, 7, 3, 5, 9, 8, 6\]
> -   **Output:** 6
> -   **Explanation:** The longest bitonic subsequence is \[1, 3, 5, 9, 8, 6\].

### Example 2

> -   **Input:** arr = \[1, 2, 3\]
> -   **Output:** 3
> -   **Explanation:** The longest bitonic subsequence is \[1, 2, 3\]. There are no elements in decreasing order.

### Example 3

> -   **Input:** arr = \[3, 2, 1\]
> -   **Output:** 3
> -   **Explanation:** The longest bitonic subsequence is \[3, 2, 1\]. There are no elements in increasing order.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int longestBitonicSubsequence(vector<int> &arr) {
        int n = arr.size();

        // Array to store the lengths of the longest increasing
        // subsequences
        vector<int> increasing(n, 1);

        // Array to store the lengths of the longest decreasing
        // subsequences
        vector<int> decreasing(n, 1);

        // Calculate the lengths of the longest increasing subsequences
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {

                // If the current element is greater than the previous
                // element and the length of the increasing subsequence
                // ending at the previous element plus one is greater
                // than the current length of the increasing subsequence,
                // update the current length of the increasing
                // subsequence
                if (arr[i] > arr[j] && increasing[i] < increasing[j] + 1)
                    increasing[i] = increasing[j] + 1;
            }
        }

        // Calculate the lengths of the longest decreasing subsequences
        for (int i = n - 2; i >= 0; i--) {
            for (int j = n - 1; j > i; j--) {

                // If the current element is greater than the next
                // element and the length of the decreasing subsequence
                // starting at the next element plus one is greater than
                // the current length of the decreasing subsequence,
                // update the current length of the decreasing
                // subsequence
                if (arr[i] > arr[j] && decreasing[i] < decreasing[j] + 1)
                    decreasing[i] = decreasing[j] + 1;
            }
        }

        int maxBitonicLen = 0;

        // Calculate the length of the bitonic subsequence by adding the
        // lengths of the increasing and decreasing subsequences and
        // subtracting 1 because the peak element is counted twice
        for (int i = 0; i < n; i++) {
            int bitonicLen = increasing[i] + decreasing[i] - 1;

            // Update the maximum bitonic length if a longer bitonic
            // subsequence is found
            if (bitonicLen > maxBitonicLen)
                maxBitonicLen = bitonicLen;
        }

        return maxBitonicLen;
    }
};
```

***

# Longest alternating subsequence

## Problem Statement

Given an integer array **arr**, write a function to find and return the length of the longest alternating subsequence in it.

An alternating sequence is a sequence in which the elements are in alternating order i.e `[low, high, low, high...]` or `[high, low, high, low...]`

### Example 1

> -   **Input:** arr = \[1, 7, 3, 5, 4, 8, 6\]
> -   **Output:** 7
> -   **Explanation:** The longest alternating subsequence is \[1, 7, 3, 5, 4\].

### Example 2

> -   **Input:** arr = \[1, 4, 5, 3\]
> -   **Output:** 3
> -   **Explanation:** There are two longest alternating subsequences which are \[1, 4, 3\] and \[1, 5, 3\].

### Example 3

> -   **Input:** arr = \[3, 2, 1\]
> -   **Output:** 2
> -   **Explanation:** The longest alternating subsequence is \[3, 2\] or \[2, 1\]

## Solution

```cpp
using namespace std;

class Solution {
public:
    int longestAlternatingSubsequence(vector<int> &arr) {
        int n = arr.size();
        if (n <= 1) {

            // If the array has only 0 or 1 element, the length of the
            // longest alternating subsequence is equal to the number of
            // elements in the array.
            return n;
        }

        // dp[i][0] represents the length of the longest alternating
        // subsequence ending at index i, with the last element being
        // smaller than its previous element. dp[i][1] represents the
        // length of the longest alternating subsequence ending at index
        // i, with the last element being greater than its previous
        // element.
        vector<vector<int>> dp(n, vector<int>(2, 1));

        // Initialize the maximum length to 1 since we have at least one
        // element in the array.
        int maxLength = 1;

        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (arr[j] < arr[i]) {

                    // If arr[j] < arr[i], it means we can add arr[i] to
                    // the subsequence ending at index j to form a longer
                    // subsequence ending at index i, with the last
                    // element being greater.
                    dp[i][1] = max(dp[i][1], dp[j][0] + 1);
                } else if (arr[j] > arr[i]) {

                    // If arr[j] > arr[i], it means we can add arr[i] to
                    // the subsequence ending at index j to form a longer
                    // subsequence ending at index i, with the last
                    // element being smaller.
                    dp[i][0] = max(dp[i][0], dp[j][1] + 1);
                }
            }

            // Update the maximum length with the maximum of dp[i][0] and
            // dp[i][1] (the longest alternating subsequences ending at
            // index i).
            maxLength = max(maxLength, max(dp[i][0], dp[i][1]));
        }

        // Return the maximum length of the longest alternating
        // subsequence.
        return maxLength;
    }
};
```

***

# Pattern as subsequence

## Problem Statement

Given a string **s** and a **pattern**, write a function to find and return the number of times this pattern appears as a subsequence in the string.

A subsequence of a string is a sequence that is generated by deleting some characters (possibly 0) from the string without altering the order of the remaining characters. For example, abc, `abg`, `bdf`, `aeg`, `acefg`, etc are subsequences of the string `abcdefg`.

### Example 1

> -   **Input:** s = abacdebgc, pattern = abc
> -   **Output:** 4
> -   **Explanation:** abc appears four times as a subsequence in the string.

### Example 2

> -   **Input:** s = xyzabc, pattern = xzc
> -   **Output:** 1
> -   **Explanation:** xzc appears once as a subsequence in the string.

### Example 3

> -   **Input:** s = abc, pattern = def
> -   **Output:** 0
> -   **Explanation:** The pattern never appears in the string as a subsequence.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int patternAsSubsequence(string s, string pattern) {

        // Length of pattern
        int m = pattern.length();

        // Length of string s
        int n = s.length();

        // Create a 2D vector dp to store the dynamic programming values
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

        // Initialize the base case where pattern is empty (i = 0)
        // If string s is empty (j = 0), there is one subsequence pattern
        // (empty pattern) Otherwise, if string s is not empty, there are
        // no subsequence patterns since pattern is empty
        for (int i = 0; i <= n; i++) {
            dp[0][i] = 1;
        }

        // Fill the dp table using dynamic programming
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (pattern[i - 1] == s[j - 1]) {

                    // If the current characters match, we have two
                    // choices:
                    // 1. Include the current characters in both pattern
                    // and string, so the count is dp[i - 1][j - 1]
                    // 2. Exclude the current character from the pattern,
                    // so the count is dp[i][j - 1]
                    dp[i][j] = dp[i - 1][j - 1] + dp[i][j - 1];
                } else {

                    // If the current characters don't match, we can only
                    // exclude the current character from the string The
                    // count remains the same as the previous count
                    // without considering the current character
                    dp[i][j] = dp[i][j - 1];
                }
            }
        }

        // The final count is stored in dp[m][n], which represents the
        // number of subsequence patterns
        return dp[m][n];
    }
};
```

***

# Shortest common supersequence

## Problem Statement

Given two strings **s1** and **s2**, write a function to find and return the length of the shortest common supersequence of both strings. 

A subsequence of a string is a sequence that is generated by deleting some characters (possibly 0) from the string without altering the order of the remaining characters. For example, abc, `abg`, `bdf`, `aeg`, `acefg`, etc are subsequences of the string `abcdefg`.

A supersequence of two strings s1 and s2 is a string such that both s1 and s2 are subsequences of it.

### Example 1

> -   **Input:** s1 = abc, s2 = abe
> -   **Output:** 4
> -   **Explanation:** There are multiple shortest common supersequences, one of which is abce.

### Example 2

> -   **Input:** s1 = lmn, s2 = opq
> -   **Output:** 6
> -   **Explanation:** There are multiple shortest common supersequences, one of which is abce lmnopq.

### Example 3

> -   **Input:** s1 = aab, s2 = aab
> -   **Output:** 3
> -   **Explanation:** aab is the shortest common subsequence of both the strings.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int shortestCommonSupersequence(string s1, string s2) {
        int n = s1.length(), m = s2.length();

        // Create a 2D array to store the dynamic programming values
        int dp[n + 1][m + 1];

        // Initialize the base cases
        // If one of the strings is empty, the length of the shortest
        // common supersequence is the length of the other string
        for (int i = 0; i <= n; i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= m; j++) {
            dp[0][j] = j;
        }

        // Calculate the lengths of the shortest common supersequences
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {

                // If the characters at the current positions are equal,
                // the length of the supersequence is one more than the
                // length of the supersequence without these characters
                if (s1[i - 1] == s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {

                    // If the characters are different, we have two
                    // choices:
                    // 1. Include the current character from s1 and find
                    // the shortest supersequence for the remaining
                    // characters
                    // 2. Include the current character from s2 and find
                    // the shortest supersequence for the remaining
                    // characters We choose the option that results in
                    // the minimum length
                    dp[i][j] = min(dp[i - 1][j] + 1, dp[i][j - 1] + 1);
                }
            }
        }

        // Return the length of the shortest common supersequence
        return dp[n][m];
    }
};
```

***

# Longest repeated subsequence

## Problem Statement

Given a string **s**, write a function to find and return the longest repeated subsequence present in the string.

A subsequence of a string is a sequence that is generated by deleting some characters (possibly 0) from the string without altering the order of the remaining characters. For example, abc, `abg`, `bdf`, `aeg`, `acefg`, etc are subsequences of the string `abcdefg`.

The longest repeating subsequence must appear at least twice in the string.

### Example 1

> -   **Input:** s = abxcdalbc
> -   **Output:** abc
> -   **Explanation:** abc is the longest repeating subsequence in the string.

### Example 2

> -   **Input:** s = xyzlynkz
> -   **Output:** yz
> -   **Explanation:** yz is the longest repeating subsequence in the string.

### Example 3

> -   **Input:** s = abbcc
> -   **Output:** bc
> -   **Explanation:** bc is the longest repeating subsequence in the string.

## Solution

```cpp
using namespace std;

class Solution {
public:
    string longestRepeatedSubsequence(string s) {
        int n = s.length();

        // Initialize a 2D vector for dynamic programming
        vector<vector<int>> dp(n + 1, vector<int>(n + 1, 0));

        // Iterate over the characters of the string
        for (int i = 1; i <= n; i++) {

            // Iterate over the characters of the string
            for (int j = 1; j <= n; j++) {

                // If the characters at positions i and j are equal
                // (excluding the same position)
                if (s[i - 1] == s[j - 1] && i != j) {

                    // Increment the longest repeating subsequence length
                    // by 1
                    dp[i][j] = 1 + dp[i - 1][j - 1];
                } else {

                    // If the characters are not equal, take the maximum
                    // of the previous subsequence lengths
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        // Initialize an empty string to store the longest repeating
        // subsequence
        string lrs;

        // Start from the bottom right corner of the DP matrix
        int i = n, j = n;

        // Traverse back to reconstruct the longest repeating subsequence
        while (i > 0 && j > 0) {

            // If the current cell value is one more than the diagonal
            // cell
            if (dp[i][j] == dp[i - 1][j - 1] + 1) {

                // Append the character to the front of the subsequence
                // string
                lrs = s[i - 1] + lrs;

                // Move diagonally up-left
                i--;
                j--;

                // If the current cell value is equal to the cell above
            } else if (dp[i][j] == dp[i - 1][j]) {

                // Move up
                i--;

                // If the current cell value is equal to the cell on the
                // left
            } else {

                // Move left
                j--;
            }
        }

        // Return the longest repeating subsequence
        return lrs;
    }
};
```
