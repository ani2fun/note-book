# Pairwise bits swap

## Problem Statement

Given a number **num** that represents a 32-bit signed integer, write a function to swap adjacent bits in that number and return the new number formed.

You must do this in `O(1)` time and use bitwise operators.

### Example 1

> -   **Input:** num = 31568
> -   **Output:** 47008
> -   **Explanation:** The binary representation of 24 is (00000000 00000000 01111011 01010000) when the adjacent bits are swapped we ge (00000000 00000000 10110111 10100000) which is the binary representation of 47008.

### Example 2

> -   **Input:** num = 5419430
> -   **Output:** 10580569
> -   **Explanation:** The binary representation of 5419430 is (00000000 01010010 10110001 10100110) when the adjacent bits are swapped we get (00000000 10100001 01110010 01011001) which is the binary representation of 10580569.

### Example 3

> -   **Input:** num = 1
> -   **Output:** 2
> -   **Explanation:** The binary representation of 1 is (00000000 00000000 00000000 00000001) when the adjacent bits are swapped we get (00000000 00000000 00000000 00000010) which is the binary representation of 2.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int pairwiseBitsSwap(int num) {

        // Mask for even-positioned bits
        // (10101010101010101010101010101010 in binary) This mask selects
        // the bits at positions 0, 2, 4, 6, ...
        int evenMask = 0xAAAAAAAA;

        // Mask for odd-positioned bits (01010101010101010101010101010101
        // in binary) This mask selects the bits at positions 1, 3, 5, 7,
        // ...
        int oddMask = 0x55555555;

        // Extract the even-positioned bits and shift them to the right
        // by 1 position
        int evenBits = (num & evenMask) >> 1;

        // Extract the odd-positioned bits and shift them to the left by
        // 1 position
        int oddBits = (num & oddMask) << 1;

        // Combine the shifted even and odd bits using bitwise OR
        return (evenBits | oddBits);
    }
};
```

***

# Unique subsets

## Problem Statement

Given an integer array **arr** containing unique elements, write a function that returns all possible subsets (the power set) of the elements in **arr**. The solution set must not contain duplicate subsets. You can return the subsets in **any order**.

You must do this using bitmasking.

### Example 1

> -   **Input:** arr = \[1, 2, 3\]
> -   **Output:** \[\[\], \[1\], \[2\], \[1, 2\], \[3\], \[1, 3\], \[2, 3\], \[1, 2, 3\]\]
> -   **Explanation:** Above is the list of all the subsets for \[1, 2, 3\].

### Example 2

> -   **Input:** arr = \[1\]
> -   **Output:** \[\[\], \[1\]\]
> -   **Explanation:** Above is the list of all the subsets for \[1\].

### Example 3

> -   **Input:** arr = \[\]
> -   **Output:** \[\[\]\]
> -   **Explanation:** Above is the list of all the subsets for \[\].

## Solution

```cpp
using namespace std;

class Solution {
public:
    vector<vector<int>> uniqueSubsets(vector<int> &arr) {
        int n = arr.size();

        // Total number of uniqueSubsets will be 2^n
        int powerSetSize = 1 << n;

        // Vector to store all uniqueSubsets
        vector<vector<int>> uniqueSubsets(powerSetSize);

        // Generate uniqueSubsets using bitmasking
        for (int i = 0; i < powerSetSize; i++) {
            for (int j = 0; j < n; j++) {

                // Check if j-th bit is set in i
                if ((i >> j) & 1) {

                    // Add arr[j] to the current subset
                    uniqueSubsets[i].push_back(arr[j]);
                }
            }
        }

        return uniqueSubsets;
    }
};
```
