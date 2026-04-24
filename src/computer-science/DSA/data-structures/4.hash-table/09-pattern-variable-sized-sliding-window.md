# 9. Pattern: Variable sized sliding window

## Table of contents

1. [Understanding the variable sized sliding window pattern](#understanding-the-variable-sized-sliding-window-pattern)
2. [Identifying the variable sized sliding window pattern](#understanding-the-variable-sized-sliding-window-pattern)
3. [Unique character span](#unique-character-span)
4. [K characters span](#k-characters-span)
5. [Maximal character swap](#maximal-character-swap)
6. [Subarray sum equals k](#subarray-sum-equals-k)
7. [Twin in proximity](#twin-in-proximity)

***

# Understanding the variable sized sliding window pattern

***

# Identifying variable sized sliding window pattern

Some specific problems where we need to remember the occurrences of data items in **all** windows in a sequence can be solved using the variable sized sliding window technique. These are generally **medium** or **hard** problems where we need to make some critical observations to prove that skipping some windows does not affect the correctness of the solution. We then create a sliding window and identify when to expand, contract, or move it through the sequence while updating the associated hash map to always map all the data items in the current window to some values.

If the problem statement or its solution follows the generic template below, it can be solved by applying the variable-sized sliding window technique.

**Template:**

Given an iterable sequence of data, for all windows of all sizes, map all the data items in a window to some values and use them to solve the problem.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the variable-sized sliding window technique.

> **Problem statement:** Given a string \`s\`, find the length of the longest substring without any repeating characters

// Diagram: Find the maximum sum of a subarray in the given array.

### Brute force solution

The brute-force solution to this problem is to find, for each index in the string, the length of the longest substring without any duplicates starting at that index. We use an outer loop to iterate the starting position of the substring using `start` and an inner loop using `end` to iterate the ending index of the substring. For each `start` index we create a hash map `frequency` to detect any duplicates as we iterate in the inner loop using `end`. We also keep a `maxLength` variable to keep track of the maximum length of the substring with distinct items seen so far and update it any time we see a longer substring. At the end of all iterations, we return `maxLength` as the solution.

// Diagram: Find the longest substring with unique characters

The implementation of the brute force solution is given as follows.

C++

```cpp
#include <unordered_map>

// Diagram: using namespace std;

class Solution {
public:
    int uniqueCharacterSpan(string s) {

        // Map to store character frequencies
        unordered_map<char, int> frequency;

        // To store the maximum length of substring
        int maxLength = 0;

        // Sliding window pointers
        int start = 0;
        int end = 0;

// Diagram: while (end < s.size()) {

            // Add the end character to the map
            char endChar = s[end];
            frequency[endChar]++;

            // If a character appears more than once, shrink the window
            while (frequency[endChar] > 1) {
                char startChar = s[start];
                frequency[startChar]--;

                // Remove character if count is 0
                if (frequency[startChar] == 0) {
                    frequency.erase(startChar);
                }

                // Move the start pointer to shrink the window
                start++;
            }

            // Update the maximum length of the valid substring
            maxLength = max(maxLength, end - start + 1);

            // Expand the window
            end++;
        }

        return maxLength;
    }
};
```

Java

```java

class LongestDistinctSubarray {
    public int longestDistinctSubarray(List<Character> arr) {
        // Initialize maxLength to 0
        int maxLength = 0;

        // Iterate using start to get starting index of a subarray
        for (int start = 0; start < arr.size(); start++) {

            // Create a frequency map for subarray starting at `start`
            HashMap<Character, Integer> frequency = new HashMap<>();

            // Iterate using end to find the longest subarray without duplicates
            // starting at `start`
            for (int end = start; end < arr.size(); end++) {

                // If a duplicate is found, terminate further search
                if (frequency.getOrDefault(arr.get(end), 0) == 1) {
                    break;
                }

                // Increment the frequency of arr[end]
                frequency.put(arr.get(end), frequency.getOrDefault(arr.get(end), 0) + 1);

                // Update maxLength if current subarray is longer
                maxLength = Math.max(maxLength, end - start + 1);
            }
        return maxLength;
    }

```

Typescript

```typescript
function longestDistinctSubarray(arr: string[]): number {
    // Initialize maxLength to 0
    let maxLength = 0;

    // Iterate using start to get starting index of a subarray
    for (let start = 0; start < arr.length; start++) {

        // Create a frequency map for subarray starting at `start`
        const frequency: { [key: string]: number } = {};

        // Iterate using end to find the longest subarray without duplicates
        // starting at `start`
        for (let end = start; end < arr.length; end++) {

            // If a duplicate is found, terminate further search
            if (frequency[arr[end]] === 1) {
                break;
            }
            // Increment the frequency of arr[end]
            frequency[arr[end]] = (frequency[arr[end]] || 0) + 1;

            // Update maxLength if current subarray is longer
            maxLength = Math.max(maxLength, end - start + 1);
        }
    return maxLength;
}
```

Javascript

```javascript
function longestDistinctSubarray(arr) {
    // Initialize maxLength to 0
    let maxLength = 0;

    // Iterate using start to get starting index of a subarray
    for (let start = 0; start < arr.length; start++) {

        // Create a frequency map for subarray starting at `start`
        const frequency = {};

        // Iterate using end to find the longest subarray without duplicates
        // starting at `start`
        for (let end = start; end < arr.length; end++) {

            // If a duplicate is found, terminate further search
            if (frequency[arr[end]] === 1) {
                break;
            }
            // Increment the frequency of arr[end]
            frequency[arr[end]] = (frequency[arr[end]] || 0) + 1;

            // Update maxLength if current subarray is longer
            maxLength = Math.max(maxLength, end - start + 1);
        }
    return maxLength;
}
```

Python

```python
def longest_distinct_subarray(arr: List[str]) -> int:
    # Initialize maxLength to 0
    max_length = 0

    # Iterate using `start` to get starting index of a subarray
    for start in range(len(arr)):

        # Create a frequency map for subarray starting at `start`
        frequency: dict[str, int] = {}

        # Iterate using `end` to find the longest subarray without duplicates
        # starting at `start`
        for end in range(start, len(arr)):

            # If a duplicate is found, terminate further search
            if frequency.get(arr[end], 0) == 1:
                break

            # Increment the frequency of arr[end]
            frequency[arr[end]] = frequency.get(arr[end], 0) + 1

            # Update maxLength if current subarray is longer
            max_length = max(max_length, end - start + 1)

    return max_length
```

Though the solution is correct, it requires nested loops and has a time complexity of **O(N^2)** in the worst case when all characters in the array are distinct.

### Variable sized sliding window solution

By closely observing the problem, we can see that we don't need to check all the subarrays for distinct characters. Consider we have a subarray denoted by `start` and `end` such that all items from `start` to `end-1` are distinct but`s[start]` is the same as `s[end]`. In this case, we can skip all subarrays starting at `start` and ending at and beyond `end` as they will have duplicates at `s[start]` and `s[end]`.

// Diagram: Can skip all substrings starting at start and ending at or beyond end

The problem description fits the template for variable-sized sliding window problems as given below. 

Given an iterable sequence of data (`arr`), for all windows of all sizes, map all the data items in a window to some values (frequency) and use them to solve the problem.

Based on the above observation, we can use the variable sized sliding window technique with a hash map to store the frequency of all characters in the window to calculate the length of the longest substring (window) with distinct characters. We initialize a variable `maxLength` to 0 to keep track of the maximum length of a substring with distinct characters seen so far. We create a hash map `frequency` to map characters to integers and initialize `start` and `end` to 0 to create a sliding window of size 0.

// Diagram: Find the longest substring with unique characters

We then iterate using `end` until we reach the end of the string, and in each iteration, we check if `s[end]` has frequency 0 in the `frequency` map, which means the window from `start` to `end` only as one occurrence of `s[end]`. In this case, we expand the window by incrementing the frequency of `s[end]` in the frequency map and incrementing `end`. We then update `maxLength` with the size of the current window (`end - start`) if it is greater than the maximum seen so far.

On the other hand, if `s[end]` has a frequency greater than 0 in the `frequency` map, it means the window from `start` to `end` already has the character `s[end]` somewhere before `end`. In this case, we don't need to expand the window any further, as all substrings starting at `start` and ending beyond `end` all will have duplicates, so we skip them by removing the contribution of `s[start]` from the `frequency` map and incrementing `start` to contract the window. We move to the next iteration, where the window may be similarly contracted until `start` reaches the index that has the duplicate of `s[end]` and it is evicted from the window.

At the end of all iterations, `maxLength` will have the length of the longest substring without any repeating characters. Below is an example of the complete execution of the variable-sized sliding window solution on a string `s`.

// Diagram: Find the longest substring with unique characters

The implementation of the variable-sized sliding window solution is given below.

C++

```cpp
#include <unordered_map>

// Diagram: using namespace std;

class Solution {
public:
    int uniqueCharacterSpan(string s) {

        // Map to store character frequencies
        unordered_map<char, int> frequency;

        // To store the maximum length of substring
        int maxLength = 0;

        // Sliding window pointers
        int start = 0;
        int end = 0;

// Diagram: while (end < s.size()) {

            // Add the end character to the map
            char endChar = s[end];
            frequency[endChar]++;

            // If a character appears more than once, shrink the window
            while (frequency[endChar] > 1) {
                char startChar = s[start];
                frequency[startChar]--;

                // Remove character if count is 0
                if (frequency[startChar] == 0) {
                    frequency.erase(startChar);
                }

                // Move the start pointer to shrink the window
                start++;
            }

            // Update the maximum length of the valid substring
            maxLength = max(maxLength, end - start + 1);

            // Expand the window
            end++;
        }

        return maxLength;
    }
};
```

Java

```java
import java.util.*;

class Solution {
    public int uniqueCharacterSpan(String s) {

        // Map to store character frequencies
        Map<Character, Integer> frequency = new HashMap<>();

        // To store the maximum length of the substring
        int maxLength = 0;

        // Sliding window pointers
        int start = 0;
        int end = 0;

// Diagram: while (end < s.length()) {

            // Add the end character to the map
            char endChar = s.charAt(end);
            frequency.put(
                endChar,
                frequency.getOrDefault(endChar, 0) + 1
            );

            // If a character appears more than once, shrink the window
            while (frequency.get(endChar) > 1) {
                char startChar = s.charAt(start);
                frequency.put(startChar, frequency.get(startChar) - 1);

                // Remove character if count is 0
                if (frequency.get(startChar) == 0) {
                    frequency.remove(startChar);
                }

                // Move the start pointer to shrink the window
                start++;
            }

            // Update the maximum length of the valid substring
            maxLength = Math.max(maxLength, end - start + 1);

            // Expand the window
            end++;
        }

        return maxLength;
    }
```

Typescript

```typescript
export class Solution {
    uniqueCharacterSpan(s: string): number {

        // Map to store character frequencies
        const frequency = new Map<string, number>();

        // To store the maximum length of the substring
        let maxLength = 0;

        // Sliding window pointers
        let start = 0;
        let end = 0;

// Diagram: while (end < s.length) {

            // Add the end character to the map
            const endChar = s[end];
            frequency.set(endChar, (frequency.get(endChar) || 0) + 1);

            // If a character appears more than once, shrink the window
            while (frequency.get(endChar)! > 1) {
                const startChar = s[start];
                frequency.set(
                    startChar,
                    (frequency.get(startChar) || 0) - 1
                );

                // Remove character if count is 0
                if (frequency.get(startChar) === 0) {
                    frequency.delete(startChar);
                }

                // Move the start pointer to shrink the window
                start++;
            }

            // Update the maximum length of the valid substring
            maxLength = Math.max(maxLength, end - start + 1);

            // Expand the window
            end++;
        }

        return maxLength;
    }
```

Javascript

```javascript
export class Solution {
    uniqueCharacterSpan(s) {

        // Map to store character frequencies
        const frequency = new Map();

        // To store the maximum length of the substring
        let maxLength = 0;

        // Sliding window pointers
        let start = 0;
        let end = 0;

// Diagram: while (end < s.length) {

            // Add the end character to the map
            const endChar = s[end];
            frequency.set(endChar, (frequency.get(endChar) || 0) + 1);

            // If a character appears more than once, shrink the window
            while (frequency.get(endChar) > 1) {
                const startChar = s[start];
                frequency.set(
                    startChar,
                    (frequency.get(startChar) || 0) - 1
                );

                // Remove character if count is 0
                if (frequency.get(startChar) === 0) {
                    frequency.delete(startChar);
                }

                // Move the start pointer to shrink the window
                start++;
            }

            // Update the maximum length of the valid substring
            maxLength = Math.max(maxLength, end - start + 1);

            // Expand the window
            end++;
        }

        return maxLength;
    }
```

Python

```python
class Solution:
    def unique_character_span(self, s: str) -> int:

        # Dictionary to store character frequencies
        frequency = {}

        # To store the maximum length of the substring
        max_length = 0

        # Sliding window pointers
        start, end = 0, 0

        while end < len(s):

            # Add the end character to the map
            end_char = s[end]
            frequency[end_char] = frequency.get(end_char, 0) + 1

            # If a character appears more than once, shrink the window
            while frequency.get(end_char, 0) > 1:
                start_char = s[start]
                frequency[start_char] -= 1

                # Remove character if count is 0
                if frequency[start_char] == 0:
                    del frequency[start_char]

                # Move the start pointer to shrink the window
                start += 1

            # Update the maximum length of the valid substring
            max_length = max(max_length, end - start + 1)

            # Expand the window
            end += 1

        return max_length
```

As the code above demonstrates, using the variable-sized sliding window technique, we solve the problem in a single pass in linear **O(N)** time.

## Example problems

Most problems in this category are **medium** or **hard**; a list of a few is given below.

> -   **[Unique character span](https://www.codeintuition.io/courses/hash-table/LDiaYVyUlFuuABgmjGJ95)**
> -   **[Two characters span](https://www.codeintuition.io/courses/hash-table/0XGWHAoifm1giMA_Zmyqa)**
> -   **[K characters span](https://www.codeintuition.io/courses/hash-table/LiPC29OElQUEYIAo1zazO)**
> -   **[Maximal character swap](https://www.codeintuition.io/courses/hash-table/Nn5w74L_DkPd4UaIZWktp)**
> -   **[Subarray sum equals k](https://www.codeintuition.io/courses/hash-table/JGa-t9NkzI6vdx7q2xE-c)**
> -   **[Twin in proximity](https://www.codeintuition.io/courses/hash-table/_ewSXw78yiam27uRsxJsS)**

We will now solve these problems to understand the variable-size sliding window technique better.

***

# Unique character span

## Problem Statement

Given a string **s**, write a function to find and return the length of the longest substring withdistinct characters.

### Example 1

> -   **Input:** s = abcbed
> -   **Output:** 4
> -   **Explanation:** The longest substring with distinct characters is "cbed" with length 4.

### Example 2

> -   **Input:** s = aaaaabc
> -   **Output:** 3
> -   **Explanation:** The longest substring with distinct characters is "abc" with length 3.

### Example 3

> -   **Input:** s = abcdefgh
> -   **Output:** 8
> -   **Explanation:** The longest substring with distinct characters is "abcdefgh" with length 8.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    int uniqueCharacterSpan(string s) {

        // Map to store character frequencies
        unordered_map<char, int> frequency;

        // To store the maximum length of substring
        int maxLength = 0;

        // Sliding window pointers
        int start = 0;
        int end = 0;

        while (end < s.size()) {

            // Add the end character to the map
            char endChar = s[end];
            frequency[endChar]++;

            // If a character appears more than once, shrink the window
            while (frequency[endChar] > 1) {
                char startChar = s[start];
                frequency[startChar]--;

                // Remove character if count is 0
                if (frequency[startChar] == 0) {
                    frequency.erase(startChar);
                }

                // Move the start pointer to shrink the window
                start++;
            }

            // Update the maximum length of the valid substring
            maxLength = max(maxLength, end - start + 1);

            // Expand the window
            end++;
        }

        return maxLength;
    }
};
```

***

# K characters span

## Problem Statement

Given a string **s** and a non-negative integer **k**, write a function to find and return the length of the longest substring with **at most k** distinct characters.

### Example 1

> -   **Input:** s = abcbed, k = 2
> -   **Output:** 3
> -   **Explanation:** The longest substring with at most 2 distinct characters is "bcb" with length 3.

### Example 2

> -   **Input:** s = aaaaabc, k = 3
> -   **Output:** 7
> -   **Explanation:** The longest substring with at most 3 distinct characters is "aaaaabc" with length 7.

### Example 3

> -   **Input:** s = abcdefgh, k = 3
> -   **Output:** 3
> -   **Explanation:** The longest substring with at most 3 distinct characters is "abc" with length 3. (There are other answers as well).

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    int kCharactersSpan(string s, int k) {

        // Map to store character frequencies
        unordered_map<char, int> frequency;

        // To store the maximum length of substring
        int maxLength = 0;

        // Sliding window pointers
        int start = 0;
        int end = 0;

        while (end < s.size()) {

            // Add the end character to the map
            char endChar = s[end];
            frequency[endChar]++;

            // If the number of distinct characters exceeds k, shrink the
            // window
            while (frequency.size() > k) {
                char startChar = s[start];
                frequency[startChar]--;

                // Remove character if count is 0
                if (frequency[startChar] == 0) {
                    frequency.erase(startChar);
                }

                // Move the start pointer to shrink the window
                start++;
            }

            // Update the maximum length of the valid substring
            maxLength = max(maxLength, end - start + 1);

            // Expand the window
            end++;
        }

        return maxLength;
    }
};
```

***

# Maximal character swap

## Problem Statement

Given a string **s** containing uppercase English alphabets and an integer k, you can modify any character in the string by replacing it with any uppercase English character at most k times. Write a function to find and return the length of the longest substring containing the same letter after performing the above operations.

### Example 1

> -   **Input:** s = ABAB, k = 2
> -   **Output:** 4
> -   **Explanation:** Replace the two 'A's with two 'B's or vice versa.

### Example 2

> -   **Input:** s = ABCDEF, k = 4
> -   **Output:** 5
> -   **Explanation:** Choose any one letter and replace the other four letters with it.

### Example 3

> -   **Input:** s = A, k = 5
> -   **Output:** 1
> -   **Explanation:** The length of the longest substring will always be 1.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    int maximalCharacterSwap(string s, int k) {

        // Initialize the frequency map to track the count of characters
        // in the window
        unordered_map<char, int> frequency;

        // The start and end pointers for the window
        int start = 0;
        int end = 0;

        // Tracks the frequency and length of the most common character
        // in the window
        int maxFreq = 0;
        int maxLength = 0;

        // Traverse the string using the while loop
        while (end < s.size()) {

            // Add the current character to the frequency map
            char endChar = s[end];
            frequency[endChar]++;

            // Update maxFreq, the frequency of the most frequent
            // character in the window
            maxFreq = max(maxFreq, frequency[endChar]);

            // If the current window size minus the frequency of the most
            // frequent character is greater than k It means we have more
            // than k characters to replace, so we shrink the window
            while (end - start + 1 - maxFreq > k) {
                char startChar = s[start];
                frequency[startChar]--;

                // Shrink the window from the left
                start++;
            }

            // Update maxLength to the current window size
            maxLength = max(maxLength, end - start + 1);

            // Move the end pointer to expand the window
            end++;
        }

        return maxLength;
    }
};
```

***

# Subarray sum equals k

## Problem Statement

Given an integer array **arr** and a target value **k**, write a function to find and return the maximum length of a subarray that sums to k. If there is no such subarray return `0`. 

### Example 1

> -   **Input:** arr = \[4, 4, 2, 6, 4\], k = 10
> -   **Output:** 3
> -   **Explanation:** The subarray \[4, 4, 2\] has a maximum length of 3 and a sum of 10.

### Example 2

> -   **Input:** arr = \[2, 2, 1, 2, 4, 3\], target = 7
> -   **Output:** 4
> -   **Explanation:** The subarray \[2, 2, 1, 2\] has a maximum length of 4 and a sum of 7.

### Example 3

> -   **Input:** arr = \[2, 3, 1, 2, 4, 3\], target = 100
> -   **Output:** 0
> -   **Explanation:** There is no subarray whose sum is equal to 100.

## Solution

```cpp
#include <algorithm>
#include <unordered_map>

using namespace std;

class Solution {
public:
    int subarraySumEqualsK(vector<int> &arr, int k) {

        // Create a map to store the sum of elements up to each index
        unordered_map<int, int> sumIndexMap;

        // Initialize the sum to zero and the maximum length to zero
        int sum = 0;
        int maxLen = 0;

        // Initialize start and end to 0
        int start = 0;
        int end = 0;

        // Move the window one step to the right until it reaches the end
        // of the array
        while (end < arr.size()) {

            // Add contribution of arr[end]
            sum += arr[end];

            // Check if the current sum equals the target value k
            if (sum == k) {

                // Update the maximum length
                maxLen = end + 1;
            }

            // Check if sum - k exists in the map
            if (sumIndexMap.count(sum - k)) {

                // Update the maximum length if the current length is
                // greater
                maxLen = max(maxLen, end - sumIndexMap[sum - k]);
            }

            // Store the current sum with the current index if not
            // already present
            if (!sumIndexMap.count(sum)) {
                sumIndexMap[sum] = end;
            }

            // Move the end index
            end++;
        }

        // Return the maximum length
        return maxLen;
    }
};
```

***

# Twin in proximity

## Problem Statement

Given an array **arr** and an integer **k**, write a function that returns `true` if there are two **distinct indices** `i` and `j`in the array suchthat`arr[i] == arr[j]`and`abs(i - j) <= k`.

### Example 1

> -   **Input:** arr = \[1, 2, 3, 4, 1\], k = 5
> -   **Output:** true
> -   **Explanation:** Index 0 and 4 have the value 1 and have an absolute difference of 4, which is less than k.

### Example 2

> -   **Input:** arr = \[1, 2, 3, 4, 5, 6, 1\], k = 5
> -   **Output:** false
> -   **Explanation:** There is no such pair that follows the constraints.

### Example 3

> -   **Input:** arr = \[1, 7\], k = 5
> -   **Output:** false
> -   **Explanation:** There is no such pair that follows the constraints.

## Solution

```cpp
#include <unordered_set>

using namespace std;

class Solution {
public:
    bool twinInProximity(vector<int> &arr, int k) {

        // Map to store the most recent index of each element
        unordered_map<int, int> elementIndex;

        // Sliding window pointers
        int start = 0;
        int end = 0;

        while (end < arr.size()) {

            // Check if the current element exists in the map and is
            // within range
            if (elementIndex.find(arr[end]) != elementIndex.end() &&
                end - elementIndex[arr[end]] <= k) {

                // Found a duplicate within the required range
                return true;
            }

            // Update the map with the current element's index
            elementIndex[arr[end]] = end;

            // Maintain the window size by removing elements out of range
            if (end - start >= k) {
                elementIndex.erase(arr[start]);

                // Shrink the window
                start++;
            }

            // Expand the window
            end++;
        }

        // No duplicates found within the range
        return false;
    }
};
```
