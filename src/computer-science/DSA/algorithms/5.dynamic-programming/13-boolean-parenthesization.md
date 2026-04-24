# Boolean parenthesization

## Problem Statement

// Diagram: Given a string s that contains a boolean expression with the following characters

> -   T = True
> -   F = False
> -   & = The logical AND operator
> -   | = The logical OR operator
> -   ^ = The logical XOR operator

Write a function to find and return the number of ways we can parenthesize the expression so that the value of the expression evaluates to true. 

### Example 1

> -   **Input:** s = T^F&T
> -   **Output:** 2
> -   **Explanation:** There ways are ((T ^ F) & T) and (T ^ (F & T)).

### Example 2

> -   **Input:** s = T^F|F
> -   **Output:** 2
> -   **Explanation:** There ways are ((T ^ F) | F) and ( T ^ (F | F)).

### Example 3

> -   **Input:** s = T|F
> -   **Output:** 1
> -   **Explanation:** There is only one way (T | F).

## Solution

```cpp
using namespace std;

class Solution {
public:
    int booleanParenthesization(string s) {
        int n = s.length();

        // dp table for true values
        vector<vector<int>> dpTrue(n, vector<int>(n, 0));

        // dp table for false values
        vector<vector<int>> dpFalse(n, vector<int>(n, 0));

        for (int i = 0; i < n; i++) {
            if (s[i] == 'T') {

                // setting true value for single character 'T'
                dpTrue[i][i] = 1;

                // setting false value for single character 'T'
                dpFalse[i][i] = 0;
            } else {

                // setting true value for single character 'F'
                dpTrue[i][i] = 0;

                // setting false value for single character 'F'
                dpFalse[i][i] = 1;
            }
        }

        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;

                // initializing true and false values for current
                // substring
                dpTrue[i][j] = dpFalse[i][j] = 0;
                for (int k = i; k < j; k += 2) {

                    // if the operator is '&'
                    if (s[k + 1] == '&') {

                        // true if both sides are true
                        dpTrue[i][j] += dpTrue[i][k] * dpTrue[k + 2][j];

                        // false if any side is false
                        dpFalse[i][j] +=
                            dpTrue[i][k] * dpFalse[k + 2][j] +
                            dpFalse[i][k] * dpTrue[k + 2][j] +
                            dpFalse[i][k] * dpFalse[k + 2][j];

                        // if the operator is '|'
                    } else if (s[k + 1] == '|') {

                        // true if any side is true
                        dpTrue[i][j] +=
                            dpTrue[i][k] * dpTrue[k + 2][j] +
                            dpTrue[i][k] * dpFalse[k + 2][j] +
                            dpFalse[i][k] * dpTrue[k + 2][j];

                        // false if both sides are false
                        dpFalse[i][j] +=
                            dpFalse[i][k] * dpFalse[k + 2][j];

                        // if the operator is '^'
                    } else if (s[k + 1] == '^') {

                        // true if one side is true and the other is
                        // false
                        dpTrue[i][j] +=
                            dpTrue[i][k] * dpFalse[k + 2][j] +
                            dpFalse[i][k] * dpTrue[k + 2][j];

                        // false if both sides are true or both sides are
                        // false
                        dpFalse[i][j] +=
                            dpTrue[i][k] * dpTrue[k + 2][j] +
                            dpFalse[i][k] * dpFalse[k + 2][j];
                    }
                }
            }
        }

        // return the number of ways to evaluate the expression to true
        return dpTrue[0][n - 1];
    }
};
```
