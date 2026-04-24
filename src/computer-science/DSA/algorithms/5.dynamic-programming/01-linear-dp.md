# Calculate factorial

## Problem Statement

Given a positive integer **n**, write a function to find and return the factorial of n.

The factorial of a positive integer n is the product of all positive integers less than or equal to n. You must do it in a time complexity of `O(N)`.

### Example 1

> -   **Input:** n = 7
> -   **Output:** 5040
> -   **Explanation** 7 \* 6 \* 5 \* 4 \* 3 \* 2 \* 1 = 5040

### Example 2

> -   **Input:** n = 5
> -   **Output:** 120
> -   **Explanation** 5 \* 4 \* 3 \* 2 \* 1 = 120

### Example 3

> -   **Input:** n = 0
> -   **Output:** 1
> -   **Explanation** Factorial of 0 is 1

## Solution

```cpp
using namespace std;

class Solution {
public:
    int calculateFactorial(int n) {

        // Create a vector to store intermediate results of
        // calculateFactorial calculation
        vector<int> dp(n + 1, 0);

        // Initialize the first element of the vector as 1, since 0! is 1
        dp[0] = 1;
        for (int i = 1; i <= n; i++) {

            // Calculate calculateFactorial of i by multiplying i with
            // calculateFactorial of (i-1)
            dp[i] = i * dp[i - 1];
        }

        // Return the calculateFactorial of n
        return dp[n];
    }
};
```

***

# Nth fibonnaci number

## Problem Statement

Given a non-negative integer **n**, write a recursive function to return the nth Fibonacci number. Since the answer can overflow integer limits, return the answer modulo `1000000007`.

The Fibonacci numbers commonly denoted by **F(n)** form a sequence, called the Fibonacci sequence. In this sequence, each number is the sum of the two numbers preceding itself in the sequence. The first two numbers of this sequence are  from `0` and `1`. You must do this in a time complexity of `O(N)`.

> -   F(0) = 0, F(1) = 1
> -   F(n) = F(n - 1) + F(n - 2), for n > 1.

### Example 1

> -   **Input:** n = 3
> -   **Output:** 2
> -   **Explanation:** F(3) = F(2) + F(1) = 1 + 1 = 2.

### Example 2

> -   **Input:** n = 2
> -   **Output:** 1
> -   **Explanation:** F(2) = F(1) + F(0) = 1 + 0 = 1.

### Example 3

> -   **Input:** n = 0
> -   **Output:** 0
> -   **Explanation:** F(0) = 0.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int nthFibonnaciNumber(int n) {

        // Create a vector to store Fibonacci numbers
        vector<int> dp(n + 1, 0);

        // Base cases
        dp[0] = 0;
        dp[1] = 1;

        // Fill in the vector with Fibonacci numbers
        for (int i = 2; i <= n; i++) {

            // Calculate the Fibonacci number using the formula:
            // F(n) = F(n-1) + F(n-2)
            // Take modulo 1000000007 to prevent overflow
            dp[i] = (dp[i - 1] + dp[i - 2]) % 1000000007;
        }

        // Return the Fibonacci number at position n
        return dp[n];
    }
};
```
