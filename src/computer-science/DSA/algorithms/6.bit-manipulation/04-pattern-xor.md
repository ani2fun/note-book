# Have opposite signs

## Problem Statement

Given two numbers **num1** and **num2** that represents 32-bit signed integers, write a function that returns a string `true` if the numbers have opposite signs, and return `false` if they have the same signs.

You must do this in `O(1)` time and use bitwise operators.

### Example 1

> -   **Input:** num1 = 10, num2 = -1
> -   **Output:** true
> -   **Explanation:** The numbers have opposite signs.

### Example 2

> -   **Input:** num1 = 2, num2 = -3
> -   **Output:** true
> -   **Explanation:** The numbers have opposite signs.

### Example 3

> -   **Input:** num1 = 9, num2 = 1
> -   **Output:** false
> -   **Explanation:** The numbers have the same signs.

## Solution

```cpp
using namespace std;

class Solution {
public:
    bool haveOppositeSigns(int num1, int num2) {

        // XOR operation (^) will result in a negative number
        // only if the signs of x and y are different.
        return ((num1 ^ num2) < 0);
    }
};
```

***

# Swap numbers

## Problem Statement

Given two numbers **num1** and **num2** that represents 32-bit signed integers, write a function to swap these two numbers without using a third variable and **print** them separated by a comma.

You must do this in `O(1)` time and use bitwise operators.

### Example 1

> -   **Input:** num1 = 10, num2 = 1
> -   **Output:** 1, 10

### Example 2

> -   **Input:** num1 = 2, num2 = 3
> -   **Output:** 3, 2

### Example 3

> -   **Input:** num1 = 9, num2 = 1
> -   **Output:** 1, 9

## Solution

```cpp
using namespace std;

class Solution {
public:
    void swapNumbers(int num1, int num2) {

        // Check if the numbers are already equal
        if (num1 != num2) {

            // Perform XOR swapNumbers algorithm
            // Step 1: Perform XOR operation to store the XOR of num1 and
            // num2 in num1
            num1 = num1 ^ num2;

            // Step 2: Perform XOR operation to store the XOR of updated
            // num1 and original num2 in num2
            num2 = num1 ^ num2;

            // Step 3: Perform XOR operation to store the XOR of updated
            // num1 and updated num2 in num1
            num1 = num1 ^ num2;
        }

        // Print the swapNumbersped values
        cout << num1 << ", " << num2 << endl;
    }
};
```

***

# Toggle count

## Problem Statement

Given two numbers **num1** and **num2**  that represents 32-bit signed integers, write a function to find and return the total number of bits that needs to be toggled to convert num1 to num2.

You must do this in `O(1)` time and use bitwise operators.

### Example 1

> -   **Input:** num1 = 10, num2 = 1
> -   **Output:** 3
> -   **Explanation:** The binary representation of 10 is (0001010) and the binary representation of 1 is (0000001). We need to toggle the two 1's in 10 to 0 and the bit at 1st position to 1 to make it equal to 1.

### Example 2

> -   **Input:** num1 = 2, num2 = 3
> -   **Output:** 1
> -   **Explanation:** The binary representation of 2 is (0000010) and the binary representation of 3 is (0000011). We need to toggle the rightmost 0 in 2 to make it equal to 3.

### Example 3

> -   **Input:** num1 = 9, num2 = 1
> -   **Output:** 1
> -   **Explanation:** The binary representation of 9 is (0001001) and the binary representation of 1 is (0000001). We need to toggle the bit position 4 in 9 to make it equal to 1.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int toggleCount(int num1, int num2) {

        // take XOR of num1 and num2 and store in num
        int num = num1 ^ num2;

        // Using Brian Kernighan's algorithm to count set bits

        // count stores the total bits set in num
        int count = 0;
        while (num) {

            // clear the least significant bit set
            num = num & (num - 1);
            count++;
        }

        return count;
    }
};
```

***

# Odd occurring element

## Problem Statement

Given an integer array **arr** where every element appears an even number of times except one element that appears an odd number of times, write a function to find the element that appears an odd number of times. 

You must do this in a time complexity of `O(N)` and space complexity of `O(1)`.

### Example 1

> -   **Input:** arr = \[2, 2, 2, 1, 3, 1, 4, 3, 1, 4, 1\]
> -   **Output:** 2
> -   **Explanation:** The element that appears an odd number of times 2.

### Example 2

> -   **Input:** arr = \[1, 2, 1, 1, 2, 1, 1\]
> -   **Output:** 1
> -   **Explanation:** The element that appears an odd number of times 1.

### Example 3

> -   **Input:** arr = \[6, 7, 6, 7, 6, 7, 6\]
> -   **Output:** 7
> -   **Explanation:** The element that appears an odd number of times 7.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int oddOccurringElement(vector<int> &arr) {
        int result = 0;
        for (int val : arr) {

            // Perform bitwise XOR operation with each element
            result = result ^ val;
        }

        // Return the result (element with odd occurrences)
        return result;
    }
};
```

***

# Odd occurring element II

## Problem Statement

Given an integer array **arr** where every element appears an even number of times except two elements that appears an odd number of times, write a function to find the elements that appear an odd number of times. You can return the answer in **any order**.

You must do this in a time complexity of `O(N)` and space complexity of `O(1)`.

### Example 1

> -   **Input:** arr = \[2, 2, 2, 1, 3, 1, 4, 3, 1, 4, 1, 5\]
> -   **Output:** \[2, 5\]
> -   **Explanation:** The elements that appear an odd number of times are 2 and 5.

### Example 2

> -   **Input:** arr = \[1, 2, 1, 1, 2, 3, 1, 3, 1, 3\]
> -   **Output:** \[1, 3\]
> -   **Explanation:** The elements that appear an odd number of times are 1 and 3.

### Example 3

> -   **Input:** arr = \[1, 2\]
> -   **Output:** \[1, 2\]
> -   **Explanation:** The elements that appear an odd number of times are 1 and 2.

## Solution

```cpp
#include <cmath>

using namespace std;

class Solution {
public:
    vector<int> oddOccurringElementII(vector<int> &arr) {
        int result = 0;

        // Finding the XOR of all elements in the array
        for (int val : arr) {
            result = result ^ val;
        }

        // Finding the position of the rightmost set bit in the result
        int rightMostSetBitPos = log2(result & -result);

        int num1 = 0, num2 = 0;

        // Splitting the array into two subarrays based on the rightmost
        // set bit
        for (int num : arr) {

            // If the rightmost set bit is set in the number
            if (num & (1 << rightMostSetBitPos)) {

                // XOR the number with num1 to find the first odd
                // occurring element
                num1 = num1 ^ num;
            } else {

                // XOR the number with num2 to find the second odd
                // occurring element
                num2 = num2 ^ num;
            }
        }

        // Return the two odd occurring elements
        return {num1, num2};
    }
};
```

***

# Duplicate element

## Problem Statement

You are given an array **arr** of size **n** that contains elements from `1` to `n-1`, where one of the elements appears twice in the array. Write a function to find and return this number.

You must do this in a time complexity of `O(N)` and space complexity of `O(1)`.

### Example 1

> -   **Input:** arr = \[1, 4, 3, 2, 2\]
> -   **Output:** 2
> -   **Explanation:** The element that appears twice is 2.

### Example 2

> -   **Input:** arr = \[4, 1, 5, 3, 2, 5\]
> -   **Output:** 5
> -   **Explanation:** The element that appears twice is 5.

### Example 3

> -   **Input:** arr = \[1, 1\]
> -   **Output:** 1
> -   **Explanation:** The element that appears twice is 1.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int duplicateElement(vector<int> &arr) {
        int n = arr.size();
        int num = 0;

        // take xor of all array elements
        for (int i = 0; i < n; i++) {
            num ^= arr[i];
        }

        // take xor of numbers from 1 to `n-1`
        for (int i = 1; i <= n - 1; i++) {
            num ^= i;
        }

        // same elements will cancel each other as a ^ a = 0,
        // 0 ^ 0 = 0 and a ^ 0 = a

        // num will contain the missing number
        return num;
    }
};
```

***

# Missing and duplicated elements

## Problem Statement

You are given an array **arr** of size **n** that contains elements from `1` to `n`. One element in this array is missing and is replaced by another that now appears two times in the array. Write a function to find and return the missing as well as the duplicated number. You can return the answer in **any order**.

You must do this in a time complexity of `O(N)` and space complexity of `O(1)`.

### Example 1

> -   **Input:** arr = \[1, 5, 2, 4, 2\]
> -   **Output:** \[2, 3\]
> -   **Explanation:** The element that appears twice is 2 and the element that's missing is 5.

### Example 2

> -   **Input:** arr = \[2, 4, 1, 3, 6, 6\]
> -   **Output:** \[5, 6\]
> -   **Explanation:** The element that appears twice is 6 and the element that's missing is 5.

### Example 3

> -   **Input:** arr = \[1, 1\]
> -   **Output:** \[1, 2\]
> -   **Explanation:** The element that appears twice is 1 and the element that's missing is 2.

## Solution

```cpp
#include <cmath>

using namespace std;

class Solution {
public:
    vector<int> missingAndDuplicatedElements(vector<int> &arr) {
        int n = arr.size();

        int result = n;

        // XOR all the elements of the array with their indices and n
        // The result will be the XOR of the missing and duplicate
        // numbers
        for (int i = 0; i < n; i++) {
            result = result ^ arr[i] ^ i;
        }

        int num1 = 0, num2 = 0;

        // Find the rightmost set bit position in the result
        int rightMostSetBitPos = log2(result & -result);

        // XOR all the elements of the array based on the rightmost set
        // bit position
        for (int num : arr) {

            // The numbers with the rightmost set bit as 1 will XOR with
            // num1
            if (num & (1 << rightMostSetBitPos)) {
                num1 = num1 ^ num;
            }

            // The numbers with the rightmost set bit as 0 will XOR with
            // num2
            else {
                num2 = num2 ^ num;
            }
        }

        // XOR all the numbers from 1 to n based on the rightmost set bit
        // position
        for (int i = 1; i <= n; i++) {

            // The numbers with the rightmost set bit as 1 will XOR with
            // num1
            if (i & (1 << rightMostSetBitPos)) {
                num1 = num1 ^ i;
            }

            // The numbers with the rightmost set bit as 0 will XOR with
            // num2
            else {
                num2 = num2 ^ i;
            }
        }

        // Check if num1 is missing in the array
        // If it is missing, return {num2, num1}, else return {num1,
        // num2}
        if (find(arr.begin(), arr.end(), num1) == arr.end()) {
            return vector<int>{num2, num1};
        }

        return vector<int>{num1, num2};
    }
};
```
