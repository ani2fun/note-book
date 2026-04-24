# Only set bit

## Problem Statement

Given a number **num** that represents a 32-bit signed integer, write a function to find and return the position of the only set bit in the number. if there are more than one set bit in the number return `-1` instead.

You must do this in `O(1)` time and use bitwise operators.

### Example 1

> -   **Input:** num = 16
> -   **Output:** 5
> -   **Explanation:** The binary representation of 16 is (0010000), as we see the only set bit is bit number 5.

### Example 2

> -   **Input:** num = 2
> -   **Output:** 2
> -   **Explanation:** The binary representation of 2 is (0000010), as we see the rightmost set bit is bit number 2.

### Example 3

> -   **Input:** num = 10
> -   **Output:** -1
> -   **Explanation:** the binary representation of 10 is (0001010), as we see there are more than 1 set bits in the number.

## Solution

```cpp
#include <cmath>

using namespace std;

class Solution {
public:
    int onlySetBit(int num) {

        // Check if num is not a power of 2 (has more than one set bit)
        if (num & (num - 1)) {

            // Return -1 if num is not a power of 2
            return -1;
        }

        // Calculate the position of the set bit by taking the base-2
        // logarithm of num and adding 1
        return log2(num) + 1;
    }
};
```

***

# Rightmost set bit

## Problem Statement

Given a number **num** that represents a 32-bit signed integer, write a function to find and return the position of the rightmost set bit of the number.

You must do this in `O(1)` time and use bitwise operators.

### Example 1

> -   **Input:** num = 10
> -   **Output:** 2
> -   **Explanation:** The binary representation of 10 is (0001010), as we see the rightmost set bit is bit number 2.

### Example 2

> -   **Input:** num = 16
> -   **Output:** 5
> -   **Explanation:** The binary representation of 16 is (0010000), as we see the rightmost set bit is bit number 5.

### Example 3

> -   **Input:** num = 17
> -   **Output:** 1
> -   **Explanation:** The binary representation of 16 is (0010001), as we see the rightmost set bit is bit number 1.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int rightmostSetBit(int num) {

        // Check if the least significant bit is set (num & 1)
        // If it is set, return 1 as the rightmost set bit position
        if (num & 1) {
            return 1;
        }

        // Clear the rightmost set bit using XOR operation
        num = num ^ (num & (num - 1));

        // Variable to store the index of the rightmost set bit
        int index = 0;

        // Iterate until num becomes zero
        while (num) {

            // Right shift num by 1 to check the next bit
            num = num >> 1;

            // Increment the index by 1
            index++;
        }

        // Return the index of the rightmost set bit
        return index;
    }
};
```
