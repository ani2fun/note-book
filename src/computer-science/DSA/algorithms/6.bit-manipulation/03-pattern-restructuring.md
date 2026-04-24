# Reverse bits

## Problem Statement

Given a number **num** that represents a 32-bit **unsigned** integer, write a function to reverse the bits of this number and return the new number formed after doing so. 

You must do this in `O(1)` time and use bitwise operators.

### Example 1

> -   **Input:** num = 28
> -   **Output:** 939524096
> -   **Explanation:** The binary representation of 28 is (00000000 00000000 00000000 00011100) when the bits are reversed we get (00111000 00000000 00000000 00000000) which is the binary representation of 939524096.

### Example 2

> -   **Input:** num = 3415
> -   **Output:** 3937402880
> -   **Explanation:** The binary representation of 3415 is (00000000 00000000 00001101 01010111) when the bits are reversed we get (11101010 10110000 00000000 00000000) which is the binary representation of 3937402880.

### Example 3

> -   **Input:** num = 1
> -   **Output:** 2147483648
> -   **Explanation:** The binary representation of 1 is (00000000 00000000 00000000 00000001) when the bits are reversed we get (10000000 00000000 00000000 00000000) which is the binary representation of 2147483648.

## Solution

```cpp
using namespace std;

class Solution {
public:
    uint32_t reverseBits(uint32_t num) {

        // Initialize the variable to store the reversed bits
        uint32_t result = 0;
        for (int i = 0; i < 32; i++) {

            // Left shift the result by 1 to make room for the next bit
            result = result << 1;

            // Get the least significant bit of num using modulo 2
            uint32_t bit = num % 2;

            // Add the bit to the result
            result = result + bit;

            // Right shift num by 1 to discard the least significant bit
            num = num >> 1;
        }

        // Return the reversed bits
        return result;
    }
};
```

***

# Circular shift bits

## Problem Statement

Given a number **num** that represents a 32-bit **unsigned** integer, a non-negative integer **k** and a boolean flag **rotateLeft**, write a function that circularly shifts all the bits of this number to the left by k bits if the rotateLeft flag is `true`, if it's `false` circularly shifts all the bits to the right by k bits. Return the new number formed after the rotation.

You must do this in `O(1)` time and use bitwise operators.

### Example 1

> -   **Input:** num = 28, k = 2, rotateLeft = true
> -   **Output:** 112
> -   **Explanation:** The binary representation of 28 is (00000000 00000000 00000000 00011100). When the bits are circularly shifted to the left by 2 bits, we get (00000000 00000000 00000000 01110000), which is the binary representation of 112.

### Example 2

> -   **Input:** num = 1234567890, k = 8, rotateLeft = true
> -   **Output:** 2516767305
> -   **Explanation:** The binary representation of 4026531840 is (01001001 10110110 00000011 11001010). When the bits are circularly shifted to the left by 4 bits, we get (10110110 01001001 10110110 00000011), which is the binary representation of 15.

### Example 3

> -   **Input:** num = 1, k = 1, rotateLeft = false
> -   **Output:** 2147483648
> -   **Explanation:** The binary representation of 1 is (00000000 00000000 00000000 00000001). When the bits are circularly shifted to the right by 1 bit, we get (10000000 00000000 00000000 00000000), which is the binary representation of 2147483648.

## Solution

```cpp
using namespace std;

class Solution {
public:

    // Calculate the number of bits in an integer
    int sizeInt = sizeof(int) * 8;
    uint32_t circularShiftBits(uint32_t num, int k, bool rotateLeft) {
        if (rotateLeft) {

            // Perform circular left shift
            return (num << k) | (num >> (sizeInt - k));
        }

        // Perform circular right shift
        return (num >> k) | (num << (sizeInt - k));
    }
};
```
