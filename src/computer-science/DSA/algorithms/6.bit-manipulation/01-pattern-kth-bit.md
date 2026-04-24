# Kth bit check

## Problem Statement

Given a number **num** that represents a 32-bit signed integer and a non-negative integer **k**, write a function that returns `true` if the kth bit is set, return `false` if it is unset.

You must do this in `O(1)` time and use bitwise operators.

### Example 1

> -   **Input:** num = 1, k = 1
> -   **Output:** true
> -   **Explanation:** The binary representation of 1 is (0000001), as we see the 1st bit (from the right) is set.

### Example 2

> -   **Input:** num = 3, k = 2
> -   **Output:** true
> -   **Explanation:** The binary representation of 3 is (0000011), as we see the 2nd bit (from the right) is set.

### Example 3

> -   **Input:** num = 2, k = 1
> -   **Output:** false
> -   **Explanation:** The binary representation of 2 is (0000010), as we see the 1st bit (from the right) is unset.

## Solution

```cpp
using namespace std;

class Solution {
public:
    bool kthBitCheck(int num, int k) {

        // To check if the Kth bit is set in a number, we can use bitwise
        // AND operation. We create a mask by left-shifting 1 by (k-1)
        // positions. Then, we perform bitwise AND between the given
        // number and the mask. If the result is not zero, it means the
        // Kth bit is set.

        return (num & (1 << (k - 1))) != 0;
    }
};
```

***

# Set kth bit

## Problem Statement

Given a number **num** that represents a 32-bit signed integer and a non-negative integer **k**, write a function to set the kth bit of num. Setting a bit is to change the bit to `1`if it was `0`.

You must do this in `O(1)` time and use bitwise operators.

### Example 1

> -   **Input:** num = 0, k = 1
> -   **Output:** 1
> -   **Explanation:** The binary representation of 0 is (0000000), setting the 1st bit (from the right) gives us (0000001) which is the binary representation of 1.

### Example 2

> -   **Input:** num = 2, k = 2
> -   **Output:** 2
> -   **Explanation:** The binary representation of 2 is (0000010), setting the 2nd bit (from the right) gives us (0000010) as the 2nd bit is already on.

### Example 3

> -   **Input:** num = 2, k = 1
> -   **Output:** 3
> -   **Explanation:** The binary representation of 2 is (0000010), setting the 1st bit (from the right) gives us (0000011) which is the binary representation of 3.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int setKthBit(int num, int k) {

        // To turn on the Kth bit of a number, we can use bitwise OR
        // operation. We create a mask by left-shifting 1 by (k-1)
        // positions. Then, we perform bitwise OR between the given
        // number and the mask to turn on the Kth bit.

        return num | (1 << (k - 1));
    }
};
```

***

# Unset kth bit

## Problem Statement

Given a number **num** that represents a 32-bit signed integerand a non-negative integer **k**, write a function to unset the kth bit of num. Unsetting a bit is to change the bit to `0` if it was `1`.

You must do this in `O(1)` time and use bitwise operators.

### Example 1

> -   **Input:** num = 1, k = 1
> -   **Output:** 0
> -   **Explanation:** The binary representation of 1 is (0000001), unsetting the 1st bit (from the right) gives us (0000000) which is the binary representation of 0.

### Example 2

> -   **Input:** num = 2, k = 1
> -   **Output:** 2
> -   **Explanation:** The binary representation of 2 is (0000010), unsetting the 1st bit (from the right) gives us (0000010) as the 1st bit is already off.

### Example 3

> -   **Input:** num = 3, k = 1
> -   **Output:** 2
> -   **Explanation:** The binary representation of 3 is (0000011), unsetting the 1st bit (from the right) gives us (0000010) which is the binary representation of 2.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int unsetKthBit(int num, int k) {

        // To turn off the Kth bit of a number, we can use bitwise
        // manipulation. We create a mask by left-shifting 1 by (k-1)
        // positions and then taking its bitwise complement. Then, we
        // perform bitwise AND between the given number and the mask to
        // turn off the Kth bit.
        return num & ~(1 << (k - 1));
    }
};
```

***

# Toggle kth bit

## Problem Statement

Given a number **num** that represents a 32-bit signed integer and a non-negative integer **k,** write a function that toggles the kth bit and returns the new number. Toggling a bit means changing it to `1` if it was `0` or changing it to `0` if it was `1`.

You must do this in `O(1)` time and use bitwise operators.

### Example 1

> -   **Input:** num = 1, k = 1
> -   **Output:** 0
> -   **Explanation:** The binary representation of 1 is (0000001), if we toggle the 1st bit (from the right) we get (0000000) which is the binary representation of 0.

### Example 2

> -   **Input:** num = 3, k = 1
> -   **Output:** 2
> -   **Explanation:** The binary representation of 3 is (0000011), if we toggle the 1st bit (from the right) we get (0000010) which is the binary representation of 2.

### Example 3

> -   **Input:** num = 3, k = 2
> -   **Output:** 1
> -   **Explanation:** The binary representation of 3 is (0000011), if we toggle the 2nd bit (from the right) we get (0000001) which is the binary representation of 1.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int toggleKthBit(int num, int k) {

        // To toggle the Kth bit of a number, we can use bitwise XOR
        // operation. We create a mask by left-shifting 1 by (k-1)
        // positions. Then, we perform bitwise XOR between the given
        // number and the mask to toggle the Kth bit.

        return num ^ (1 << (k - 1));
    }
};
```
