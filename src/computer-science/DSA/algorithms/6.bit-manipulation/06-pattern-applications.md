# Parity checker

## Problem Statement

Given a number **num** that represents a 32-bit signed integer, write a function that returns a string `"odd"` or `"even"` depending on whether the number is odd or even respectively.

You must do this in `O(1)` time and use bitwise operators.

### Example 1

> -   **Input:** num = 10
> -   **Output:** even
> -   **Explanation:** The number is even.

### Example 2

> -   **Input:** num = 9
> -   **Output:** odd
> -   **Explanation:** The number is odd.

### Example 3

> -   **Input:** num = 1
> -   **Output:** odd
> -   **Explanation:** The number is odd.

## Solution

```cpp
using namespace std;

class Solution {
public:
    string parityChecker(int num) {

        // bitwise AND operation with 1 to check if num is odd
        if (num & 1) {

            // if num is odd, return "odd"
            return "odd";
        } else {

            // if num is even, return "even"
            return "even";
        }
    }
};
```

***

# Power of 2

## Problem Statement

Given a number **num** that represents a 32-bit signed integer, write a function that returns `true` if it is a power of `2`, return `false` if it is not.

You must do this in `O(1)` time and use bitwise operators.

### Example 1

> -   **Input:** num = 1
> -   **Output:** true
> -   **Explanation:** 2 raised to the power 0 is 1.

### Example 2

> -   **Input:** num = 8
> -   **Output:** true
> -   **Explanation:** 2 raised to the power 3 is 8.

### Example 3

> -   **Input:** num = 3
> -   **Output:** false
> -   **Explanation:** 3 is not a power of 2.

## Solution

```cpp
using namespace std;

class Solution {
public:
    bool powerOf2(int num) {

        // Check if the number is positive
        // and if the bitwise AND of num and (num - 1) is zero
        // If both conditions are true, return true, otherwise false
        return num > 0 && !(num & (num - 1));
    }
};
```

***

# Parity checker II

## Problem Statement

Given a number **num** that represents a 32-bit signed integer, write a function that returns a string `"odd"` or `"even"` depending on whether the number has an odd or even parity respectively. The parity of a number is the number of set bits in its binary representation.

You must do this in `O(1)` time and use bitwise operators.

### Example 1

> -   **Input:** num = 10
> -   **Output:** even
> -   **Explanation:** The binary representation of 10 is (0001010) which has 2 sets bits which is an even number so 10 has an even parity.

### Example 2

> -   **Input:** num = 13
> -   **Output:** odd
> -   **Explanation:** The binary representation of 13 is (0001101) which has 3 sets bits which is an even number so 13 has an even parity.

### Example 3

> -   **Input:** num = 1
> -   **Output:** odd
> -   **Explanation:** The binary representation of 1 is (0000001) which has 1 sets bit which is an odd number so 1 has an even parity.

## Solution

```cpp
using namespace std;

class Solution {
public:
    string parityCheckerII(int num) {

        // Initialize the parity flag as false (even).
        bool parity = false;

        while (num) {

            // Toggle the parity flag for every 1 encountered.
            parity = !parity;

            // Clear the least significant bit (LSB) of num.
            num = num & (num - 1);
        }

        // If the parity flag is true, return "odd".
        if (parity) {
            return "odd";

            // If the parity flag is false, return "even".
        } else {
            return "even";
        }
    }
};
```

***

# Power function

## Problem Statement

Given an integer number **num** and a non-negative number **n**, write a function to find and return the value of num raised to the power of n.

You must do this in a time complexity of `O(logN)` and space complexity of `O(1)`.

### Example 1

> -   **Input:** num = 4, n = 2
> -   **Output:** 16
> -   **Explanation:** 4 raised to the power 2 is 16.

### Example 2

> -   **Input:** num = 10, n = 3
> -   **Output:** 1000
> -   **Explanation:** 10 raised to the power 3 is 1000.

### Example 3

> -   **Input:** num = 2, n = 8
> -   **Output:** 256
> -   **Explanation:** 2 raised to the power 8 is 256.

## Solution

```cpp
using namespace std;

class Solution {
public:
    long powerFunction(int num, unsigned n) {

        // initialize result by 1
        long pow = 1L;

        // loop till n become 0
        while (n) {

            // if n is odd, multiply the result by num
            if (n & 1) {
                pow *= num;
            }

            // divide n by 2
            n = n >> 1;

            // multiply num by itself
            num = num * num;
        }

        // return result
        return pow;
    }
};
```
