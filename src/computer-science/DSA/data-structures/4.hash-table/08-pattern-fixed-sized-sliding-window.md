# 8. Pattern: Fixed sized sliding Window

## Table of contents

1. [Understanding the fixed sized sliding window pattern](#understanding-the-fixed-sized-sliding-window-pattern)
2. [Identifying the fixed sized sliding window pattern](#identifying-the-fixed-sized-sliding-window-pattern)
3. [Duplicate detection](#duplicate-detection)
4. [Subarray distinctness](#subarray-distinctness)
5. [Contains variation](#contains-variation)
6. [Anagram finder](#anagram-finder)

***

# Understanding the fixed sized sliding window pattern

Some problems require us to remember the occurrences of data items in a sequence of data for all windows of a **fixed size**. While we can use nested loops to generate a window of size k from each index, using the sliding window technique and a hash table to map data items in a window to some value can efficiently solve such problems. The value to which the data items of a window are mapped is defined by the problem, which, in most cases, is the frequency of data items in the window, but it could also be something else.

We maintain a fixed-sized window and move it through the sequence, adding the contributions of new items that get added and removing the contributions of the old items that get removed when the window moves.

The fixed sized sliding window pattern is a classification of problems that can be solved using the fixed sized sliding window technique.

// Diagram: A window of size k in the between start and end

The fixed-sized sliding window technique falls under a broader category of **sliding window pattern**. In this lesson, we will only learn about the fixed-sized sliding window technique; however, later in the course, we will also learn the variable-sized sliding window technique, another category under the sliding window pattern. 

## Fixed sized sliding window technique

The fixed-sized sliding window technique uses two variables `start` and `end`, to maintain a fixed-sized **window** in a sequential data structure. We also maintain a hash map to map data items in the window to some value defined by the problem.

For this example, consider an array of characters `arr` and a window of size `k` where we need to find the frequency characters in **all** windows of size `k` in the array. In this case, the value to be mapped with each data item in a window is its frequency(count) in the window. We initialize a hash map `frequency` to map a character to an integer.

// Diagram: Create a frequency map

For a fixed-sized widow of size `k`, we initialize `start` and `end` with 0 and iterate until `end` reaches the end of the array. In each iteration, we add the contribution of `arr[end]` to the `frequency` map by incrementing the mapped value of the character `arr[end]` in the `frequency` map.

We then check if the window size `end - start + 1` is greater than `k`. If the window size is greater than `k`, we remove the contribution of the item at `arr[start]` from the `frequency` map by decrementing the mapped value of character `arr[start]` in the `frequency` map and then contract the current window from the start by incrementing `start` by 1.

Next, we check if the size of the current window equals `k`. If size equals `k`, we use the `frequency` map to find a solution for the current window as dictated by the problem. Finally, we increment `end` by 1 to expand the window from the end.

Below is an example execution of the fixed-sized sliding window technique using a `frequency` map on an array of characters where `k = 4`.

// Diagram: Fixed sized sliding window technique

The fixed-sized sliding window technique avoids the inner loop by removing the contribution of the removed items and adding the contribution of the newly added item to the hash map as the window slides. This way, we do not need to recompute the contributions of the common (middle) items to the hash map in the moving window.

The example above illustrates the fixed-sized sliding window technique to map the frequency of items in all windows of size `k`. However, the same technique can be used to map other values.

## Algorithm

The algorithm given below outlines the generic fixed-sized sliding window technique for a window of size `k`.

> -   **Step 1:** Initialize two variables, \`start\` and \`end\` to 0.
> -   **Step 2:** Initialize a hash map \`map\` to map data items to some value dictated by the problem.
> -   **Step 3:** Loop while \`end\` < \`arr.size()\` and do the following
>     -   **Step 3.1:** Add contribution of \`arr\[end\]\` to \`map\`
>     -   **Step 3.2:** If the size of the current window (\`end\` - \`start\` + 1) is **greater** than \`k\` remove the contribution of \`arr\[start\]\` from \`map\` and increment \`start\` by 1
>     -   **Step 3.2:** If the size of the current window (\`end\` - \`start\` + 1) is **equals** \`k\`, process \`map\` to solve the problem.
>     -   **Step 3.3:** Increment \`end\` by 1

## Implementation

Given below is the generic code implementation of the fixed-size sliding window technique on an array of characters `arr` with window size `k` using variables `start` and `end` as the boundaries of the window. We use a character to integer map `frequency` to map data items in a window to their frequency in the window.

C++

```cpp
void fixedSizeSlidingWindow(vector<char> &arr, int k)
{
  // Initialize start and end to 0
  int start, end = 0;

  // Initialize hash map to map characters to integer values
  unordered_map<char, int> frequency;

  // Move the window one step to the right util
  // it reaches the end of the array
  while (end < arr.size())
  {
    // Add contribution of arr[end] to the frequency map
    frequency[arr[end]] += 1;

    // Check if window size is greater than k
    if (end - start + 1 > k)
    {
      // Remove contribution of arr[start] from frequency map
      frequency[arr[start]] -= 1;
      // Increment start to contract the window from start
      start++;
    }

    // Check if window size equals k
    if (end - start + 1 == k)
    {
      // Process the values in frequency map
    }

    // Increment end to expand the window from end
    end++;
  }

  return;
}
```

Java

```java
public class FixedSizeSlidingWindow {

    public void fixedSizeSlidingWindow(char[] arr, int k) {
        // Initialize start and end to 0
        int start = 0, end = 0;

        // Initialize hash map to map characters to integer values
        HashMap<Character, Integer> frequency = new HashMap<>();

        // Move the window one step to the right until
        // it reaches the end of the array
        while (end < arr.length) {
            // Add contribution of arr[end] to the frequency map
            frequency.put(arr[end], frequency.getOrDefault(arr[end], 0) + 1);

            // Check if window size is greater than k
            if (end - start + 1 > k) {
                // Remove contribution of arr[start] from frequency map
                frequency.put(arr[start], frequency.get(arr[start]) - 1);
                if (frequency.get(arr[start]) == 0) {
                    frequency.remove(arr[start]); // Remove key if count is 0
                }
                // Increment start to contract the window from start
                start++;
            }

            // Check if window size equals k
            if (end - start + 1 == k) {
                // Process the values in frequency map
            }

            // Increment end to expand the window from end
            end++;
        }

        return;
    }
```

Typescript

```typescript
function fixedSizeSlidingWindow(arr: string[], k: number): void {
  // Initialize start and end to 0
  let start = 0;
  let end = 0;

  // Initialize a frequency map to track occurrences of characters
  const frequency: { [key: string]: number } = {};

  // Move the window one step to the right until
  // it reaches the end of the array
  while (end < arr.length) {
    // Add contribution of arr[end] to the frequency map
    frequency[arr[end]] = (frequency[arr[end]] || 0) + 1;

    // Check if window size is greater than k
    if (end - start + 1 > k) {
      // Remove contribution of arr[start] from the frequency map
      frequency[arr[start]] -= 1;
      // If frequency of arr[start] becomes zero, remove it from the map
      if (frequency[arr[start]] === 0) {
        delete frequency[arr[start]];
      }
      // Increment start to contract the window from start
      start++;
    }

    // Check if window size equals k
    if (end - start + 1 === k) {
      // Process the values in the frequency map
    }

    // Increment end to expand the window from the end
    end++;
  }

  return;
}
```

Javascript

```javascript
function fixedSizeSlidingWindow(arr, k) {
  // Initialize start and end to 0
  let start = 0;
  let end = 0;

  // Initialize a frequency map to track occurrences of characters
  const frequency = {};

  // Move the window one step to the right until
  // it reaches the end of the array
  while (end < arr.length) {
    // Add contribution of arr[end] to the frequency map
    frequency[arr[end]] = (frequency[arr[end]] || 0) + 1;

    // Check if window size is greater than k
    if (end - start + 1 > k) {
      // Remove contribution of arr[start] from the frequency map
      frequency[arr[start]] -= 1;
      // If frequency of arr[start] becomes zero, remove it from the map
      if (frequency[arr[start]] === 0) {
        delete frequency[arr[start]];
      }
      // Increment start to contract the window from start
      start++;
    }

    // Check if window size equals k
    if (end - start + 1 === k) {
      // Process the values in the frequency map
    }

    // Increment end to expand the window from the end
    end++;
  }

  return;
}
```

Python

```python
def fixed_size_sliding_window(arr: List[str], k: int) -> None:
    # Initialize start and end to 0
    start, end = 0, 0

    # Initialize frequency dictionary to count character occurrences
    frequency: dict[str, int] = defaultdict(int)

    # Move the window one step to the right until
    # it reaches the end of the array
    while end < len(arr):
        # Add contribution of arr[end] to the frequency map
        frequency[arr[end]] = frequency.get(arr[end], 0) + 1

        # Check if window size is greater than k
        if end - start + 1 > k:
            # Remove contribution of arr[start] from frequency map
            frequency[arr[start]] -= 1
            # Remove arr[start] from frequency if its count is 0
            if frequency[arr[start]] == 0:
                del frequency[arr[start]]
            # Increment start to contract the window from start
            start += 1

        # Check if window size equals k
        if end - start + 1 == k:
            # Process the values in frequency map
            # (Additional processing logic would go here)
            pass

        # Increment end to expand the window from end
        end += 1

    return
```

## Complexity Analysis

The algorithm's time and space complexity is easy to understand. We create a sliding window of size `k` and move it one step at a time until it reaches the end. The variable `end` iterates from 0 to N-1, where **N** is the size of the array. Since adding a new mapping to a hash map and updating the mapped value have a constant **O(1)** amortized time complexity, the runtime complexity for the algorithm linear **O(N)**.

Since we create a hash map to map data items in a window of size `k` to some value, the space complexity is **O(k)**.

> **Best Case**
>
> -   Space Complexity - **O(K)**
> -   Time Complexity - **O(N)**
>
> **Worst Case**
>
> -   Space Complexity - **O(K)**
> -   Time Complexity - **O(N)**

Later in the course, we will examine techniques for identifying problems that can be solved using the fixed-sized sliding window technique and walk through an example to better understand it.

***

# Identifying the fixed sized sliding window pattern

The fixed-size sliding window technique can only be applied to some specific problems. These are generally **easy** or **medium** problems where we must remember some or all occurrences of data items in **all** windows a fixed size. Once we map all data items in a window to some values, we use the hash map to solve the problem partially or completely.

If the problem statement or its solution follows the generic template below, it can be solved by applying the fixed-sized sliding window technique.

**Template:**

Given an iterable sequence of data, for all windows of size `k`, map all the data items in the window to some values and use them to solve the problem.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the fixed-sized sliding window technique.

> **Problem statement:** Given an array of integers \`arr\` and an integer \`k\`, return \`true\` if there are any duplicates in any subarray of size \`k\`

// Diagram: Find duplicates in any subarray of size k.

### Brute force solution

The brute-force solution to this problem is to use a loop to traverse the array from start to N-k (where N is the size of the array) using a variable `start`. In each iteration, we initialize `end` with `start + k-  1` to get a window of size `k` from `start`. We then use another loop to pick one item at a time from the window and use a third inner loop to search for it in the current window. We return `true` if a duplicate is found; otherwise, repeat the process for the window starting at `start + 1`.

If no duplicate is found in any window at the end of all iterations, we return `false`.

// Diagram: Find duplicates in any window of size k

The implementation of the brute force solution is given as follows.

C++

```cpp
#include <unordered_map>

// Diagram: using namespace std;

class Solution {
public:
    bool duplicateDetection(vector<int> &arr, int k) {

        // Map to store elements within the window and their counts
        unordered_map<int, int> frequency;

        // The start and end pointers for the window
        int start = 0;
        int end = 0;

// Diagram: while (end < arr.size()) {

            // Add the current element to the window
            int endElement = arr[end];
            frequency[endElement]++;

            // Adjust the window size if it exceeds k
            if (end - start >= k) {
                int startElement = arr[start];
                frequency[startElement]--;

                // Erase the current element from the window if it's
                // frequency becomes 0
                if (frequency[startElement] == 0) {
                    frequency.erase(startElement);
                }
                start++;
            }

            // Check if there's a duplicate in the window
            if (frequency[endElement] > 1) {
                return true;
            }

            // Move the end pointer to expand the window
            end++;
        }

        return false;
    }
};
```

Java

```java
class DuplicateDetection {

    public boolean duplicateDetection(List<Integer> arr, int k) {
        int n = arr.size();

        // Loop to find the starting index of a window
        for (int start = 0; start <= n - k; start++) {

            // Compute the end index for the window
            int end = start + k - 1;

            // Iterate in the window to pick one item at a time
            for (int i = start; i <= end; i++) {
                // Compare the current value with all values ahead of it
                // This will compare all pairs in this window
                for (int j = i + 1; j <= end; j++) {
                    if (arr.get(i).equals(arr.get(j))) return true;
                }
        return false;
    }

```

Typescript

```typescript
function duplicateDetection(arr: number[], k: number): boolean {
  const n = arr.length;

  // Loop to find the starting index of a window
  for (let start = 0; start <= n - k; start++) {

    // Compute the end index for the window
    const end = start + k - 1;

    // Iterate in the window to pick one item at a time
    for (let i = start; i <= end; i++) {
      // Compare the current value with all values ahead of it
      // This will compare all pairs in this window
      for (let j = i + 1; j <= end; j++) {
        if (arr[i] === arr[j]) return true;
      }

  return false;
}
```

Javascript

```javascript
function duplicateDetection(arr, k) {
  const n = arr.length;

  // Loop to find the starting index of a window
  for (let start = 0; start <= n - k; start++) {

    // Compute the end index for the window
    const end = start + k - 1;

    // Iterate in the window to pick one item at a time
    for (let i = start; i <= end; i++) {
      // Compare the current value with all values ahead of it
      // This will compare all pairs in this window
      for (let j = i + 1; j <= end; j++) {
        if (arr[i] === arr[j]) return true;
      }

  return false;
}
```

Python

```python
def duplicate_detection(arr: List[int], k: int) -> bool:
    n = len(arr)

    # Loop to find the starting index of a window
    for start in range(n - k + 1):
        # Compute the end index for the window
        end = start + k - 1

        # Iterate in the window to pick one item at a time
        for i in range(start, end + 1):
            # Compare the current value with all values ahead of it
            # This will compare all pairs in this window
            for j in range(i + 1, end + 1):
                if arr[i] == arr[j]:
                    return True

    return False
```

Though the solution is correct, it requires three nested loops and has a worst-case time complexity of **O((N-k) \* K^2) ~ O(N^2)** when **k = N-1** where **N** is the size of the array.

### Fixed sized sliding window solution

We can use the fixed-sized sliding window technique along with a hash map to map all the data items in a window of size `k` to their frequency in the window. We update the frequency map as the window moves through the array and use it to detect duplicates. The solution to the problem fits the generic template for problems that can be solved using the fixed-sized sliding window technique.

**Template**

Given an iterable sequence of data, (`arr`) for all windows of size `k`, map all the data items in the window to their frequency (some value) in the window and use them to detect duplicates.

We create a hash map `frequency` to map integer data items to their frequency in a `k` sized window. We then create a window by initalizing `start` and `end` to 0 and iterate until `end` reaches the end of the array. In each iteration, we increment the frequency of `arr[end]` in the `frequency` map.

We then check if the window size `end - start + 1` is greater than `k`. If the window size is greater than `k`, we decrement the frequency of `arr[start]` in the `frequency` map and contract the window by incrementing `start` by 1.

If the size of the window is less than or equal to `k` we check the `frequency` map for frequency of `arr[end]` , and if it is greater than 1, it means a duplicate exists in a window of size `k`, so we return `true`. Otherwise, we increment the frequency of `arr[end]` in the `frequency` map and increment `end` by 1. At the end of all iterations, we return false as it means no duplicates were found in any window of size `k`.

// Diagram: Find duplicates in any window of size k

The implementation of the sliding window solution is given as follows.

C++

```cpp
#include <unordered_map>

// Diagram: using namespace std;

class Solution {
public:
    bool duplicateDetection(vector<int> &arr, int k) {

        // Map to store elements within the window and their counts
        unordered_map<int, int> frequency;

        // The start and end pointers for the window
        int start = 0;
        int end = 0;

// Diagram: while (end < arr.size()) {

            // Add the current element to the window
            int endElement = arr[end];
            frequency[endElement]++;

            // Adjust the window size if it exceeds k
            if (end - start >= k) {
                int startElement = arr[start];
                frequency[startElement]--;

                // Erase the current element from the window if it's
                // frequency becomes 0
                if (frequency[startElement] == 0) {
                    frequency.erase(startElement);
                }
                start++;
            }

            // Check if there's a duplicate in the window
            if (frequency[endElement] > 1) {
                return true;
            }

            // Move the end pointer to expand the window
            end++;
        }

        return false;
    }
};
```

Java

```java
import java.util.*;

class Solution {
    public boolean duplicateDetection(int[] arr, int k) {

        // Map to store elements within the window and their counts
        Map<Integer, Integer> frequency = new HashMap<>();

        // The start and end pointers for the window
        int start = 0;
        int end = 0;

// Diagram: while (end < arr.length) {

            // Add the current element to the window
            int endElement = arr[end];
            frequency.put(
                endElement,
                frequency.getOrDefault(endElement, 0) + 1
            );

            // Adjust the window size if it exceeds k
            if (end - start >= k) {
                int startElement = arr[start];
                frequency.put(
                    startElement,
                    frequency.get(startElement) - 1
                );

                // Erase the current element from the window if its
                // frequency becomes 0
                if (frequency.get(startElement) == 0) {
                    frequency.remove(startElement);
                }
                start++;
            }

            // Check if there's a duplicate in the window
            if (frequency.get(endElement) > 1) {
                return true;
            }

            // Move the end pointer to expand the window
            end++;
        }

        return false;
    }
```

Typescript

```typescript
export class Solution {
    duplicateDetection(arr: number[], k: number): boolean {

        // Map to store elements within the window and their counts
        const frequency = new Map<number, number>();

        // The start and end pointers for the window
        let start = 0;
        let end = 0;

// Diagram: while (end < arr.length) {

            // Add the current element to the window
            const endElement = arr[end];
            frequency.set(
                endElement,
                (frequency.get(endElement) || 0) + 1
            );

            // Adjust the window size if it exceeds k
            if (end - start >= k) {
                const startElement = arr[start];
                frequency.set(
                    startElement,
                    (frequency.get(startElement) || 0) - 1
                );

                // Erase the current element from the window if its
                // frequency becomes 0
                if (frequency.get(startElement) === 0) {
                    frequency.delete(startElement);
                }
                start++;
            }

            // Check if there's a duplicate in the window
            if (frequency.get(endElement)! > 1) {
                return true;
            }

            // Move the end pointer to expand the window
            end++;
        }

        return false;
    }
```

Javascript

```javascript
export class Solution {
    duplicateDetection(arr, k) {

        // Map to store elements within the window and their counts
        const frequency = new Map();

        // The start and end pointers for the window
        let start = 0;
        let end = 0;

// Diagram: while (end < arr.length) {

            // Add the current element to the window
            const endElement = arr[end];
            frequency.set(
                endElement,
                (frequency.get(endElement) || 0) + 1
            );

            // Adjust the window size if it exceeds k
            if (end - start >= k) {
                const startElement = arr[start];
                frequency.set(
                    startElement,
                    (frequency.get(startElement) || 0) - 1
                );

                // Erase the current element from the window if its
                // frequency becomes 0
                if (frequency.get(startElement) === 0) {
                    frequency.delete(startElement);
                }
                start++;
            }

            // Check if there's a duplicate in the window
            if (frequency.get(endElement) > 1) {
                return true;
            }

            // Move the end pointer to expand the window
            end++;
        }

        return false;
    }
```

Python

```python
from collections import defaultdict
from typing import List

class Solution:
    def duplicate_detection(self, arr: List[int], k: int) -> bool:

        # Map to store elements within the window and their counts
        frequency = defaultdict(int)

        # The start and end pointers for the window
        start, end = 0, 0

        while end < len(arr):

            # Add the current element to the window
            end_element = arr[end]
            frequency[end_element] += 1

            # Adjust the window size if it exceeds k
            if end - start >= k:
                start_element = arr[start]
                frequency[start_element] -= 1

                # Erase the current element from the window if its
                # frequency becomes 0
                if frequency[start_element] == 0:
                    del frequency[start_element]
                start += 1

            # Check if there's a duplicate in the window
            if frequency[end_element] > 1:
                return True

            # Move the end pointer to expand the window
            end += 1

        return False
```

As the code above demonstrates, using the fixed-sized sliding window technique, we solve the problem in a single pass in linear **O(N)** time.

## Example problems

Most problems that fall under this category are **easy** or **medium** problems; a list of a few is given below.

> -   **[Duplicate detection](https://www.codeintuition.io/courses/hash-table/UQlapcrCbXG4lVyQrIKK8)**
> -   **[Subarray distinctness](https://www.codeintuition.io/courses/hash-table/4DWGkO5PJ-O7v2Af3xFX5)**
> -   **[Contains variation](https://www.codeintuition.io/courses/hash-table/n_C8eG6t2yZvSwkIurVlU)**
> -   **[Anagram finder](https://www.codeintuition.io/courses/hash-table/Z_gETGeRhLeEdIZCgSf1M)**

We will now solve these problems to understand the fixed-size sliding window technique better.

***

# Duplicate detection

## Problem Statement

Given an array of integer **arr** and a positive integer **k**, write a function that returns `true` if the array contains any duplicates in the subarray of size k. Return `false` otherwise.

### Example 1

> -   **Input:** arr = \[2, 1, 2, 3, 2, 1, 4, 5\], k = 5
> -   **Output:** true
> -   **Explanation:** The array contains duplicates in subarrays of size 5.

### Example 2

> -   **Input:** arr = \[1, 1, 2, 4\], k = 3
> -   **Output:** true
> -   **Explanation:** The array contains duplicates in subarrays of size 3.

### Example 3

> -   **Input:** arr = \[1, 2, 3, 4\], k = 2
> -   **Output:** false
> -   **Explanation:** The array does not contain any duplicates in subarrays of size 2.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    bool duplicateDetection(vector<int> &arr, int k) {

        // Map to store elements within the window and their counts
        unordered_map<int, int> frequency;

        // The start and end pointers for the window
        int start = 0;
        int end = 0;

        while (end < arr.size()) {

            // Add the current element to the window
            int endElement = arr[end];
            frequency[endElement]++;

            // Adjust the window size if it exceeds k
            if (end - start >= k) {
                int startElement = arr[start];
                frequency[startElement]--;

                // Erase the current element from the window if it's
                // frequency becomes 0
                if (frequency[startElement] == 0) {
                    frequency.erase(startElement);
                }
                start++;
            }

            // Check if there's a duplicate in the window
            if (frequency[endElement] > 1) {
                return true;
            }

            // Move the end pointer to expand the window
            end++;
        }

        return false;
    }
};
```

***

# Subarray distinctness

## Problem Statement

Given an array of integer **arr** and a positive integer **k**, write a function to find and return the number of distinct elements in every contiguous subarray of size k.

### Example 1

> -   **Input:** arr = \[2, 1, 2, 3, 2, 1, 4, 5\], k = 5
> -   **Output:** \[3, 3, 4, 5\]
> -   **Explanation:** The number of distinct elements in every subarray of size k is given above.

### Example 2

> -   **Input:** arr = \[1, 1, 2, 4\], k = 3
> -   **Output:** \[2, 3\]
> -   **Explanation:** The number of distinct elements in every subarray of size k is given above.

### Example 3

> -   **Input:** arr = \[1, 2, 3, 4\], k = 1
> -   **Output:** \[1, 1, 1, 1\]
> -   **Explanation:** The number of distinct elements in every subarray of size k is given above.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<int> subarrayDistinctness(vector<int> &arr, int k) {

        // Initialize a dictionary to keep track of the count of elements
        // in the current window
        unordered_map<int, int> frequency;

        // Initialize the start and end indices of the window
        int start = 0;
        int end = 0;

        // Initialize the result array to hold the count of distinct
        // elements in every subarray
        vector<int> result;

        // Loop through the array
        while (end < arr.size()) {

            // Add the current element to the count dictionary
            frequency[arr[end]]++;

            // If the current window size is equal to k, calculate the
            // count of distinct elements in the window
            if (end - start + 1 == k) {
                result.push_back(frequency.size());

                // Remove the leftmost element from the count dictionary
                frequency[arr[start]]--;
                if (frequency[arr[start]] == 0) {
                    frequency.erase(arr[start]);
                }

                // Contract the window
                start++;
            }

            // Expand the window to the right
            end++;
        }

        return result;
    }
};
```

***

# Contains variation

## Problem Statement

Given two strings, **s1** and **s2**, write a function that returns `true` if s2 contains a permutation of s1, or `false` otherwise.

### Example 1

> -   **Input:** s1 = abc, s2 = edbaclm
> -   **Output:** true
> -   **Explanation:** s2 contains permutation of s1 as "bac".

### Example 2

> -   **Input:** s1 = cod, s2 = intdoce
> -   **Output:** true
> -   **Explanation:** s2 contains permutation of s1 as "doc".

### Example 3

> -   **Input:** s1 = abc, s2 = defghiab
> -   **Output:** false
> -   **Explanation:** s2 does not contains permutation of s1.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    unordered_map<char, int> countFrequency(string s) {
        unordered_map<char, int> frequency;
        for (char ch : s) {
            frequency[ch]++;
        }

        return frequency;
    }

    bool containsVariation(string s1, string s2) {

        // Frequency map for s1
        unordered_map<char, int> s1Frequency = countFrequency(s1);

        // Frequency maps for characters in sliding window in s2
        unordered_map<char, int> frequency;

        // The start and end pointers for the window
        int start = 0;
        int end = 0;

        while (end < s2.size()) {

            // Add the current character to the window
            char endChar = s2[end];
            frequency[endChar]++;

            // If the window size matches s1's length, check for a match
            if (end - start + 1 == s1.size()) {
                if (frequency == s1Frequency) {
                    return true;
                }

                // Shrink the window from the left
                char startChar = s2[start];
                frequency[startChar]--;
                if (frequency[startChar] == 0) {
                    frequency.erase(startChar);
                }
                start++;
            }

            // Expand the window to the right
            end++;
        }

        return false;
    }
};
```

***

# Anagram finder

## Problem Statement

Given two strings, **s**, and **p**, write a function to find and return an array of all the start indices of p's anagrams in s. You can return the answer in **any order**.

An anagram is a word or phrase formed by rearranging the letters of another word or phrase.

### Example 1

> -   **Input:** s = bacdefecab, p = abc
> -   **Output:** \[0, 7\]
> -   **Explanation:** The substring with start index = 0 is bac, which is an anagram of abc. The substring with start index = 7 is cab, which is an anagram of abc.

### Example 2

> -   **Input:** s = fdef, p = def
> -   **Output:** \[0, 1\]
> -   **Explanation:** The substring with start index = 0 is fde, which is an anagram of def. The substring with start index = 1 is def, which is an anagram of def.

### Example 3

> -   **Input:** s = abcdef, p = gh
> -   **Output:** \[\]
> -   **Explanation:** There are no anagrams of string p in string s.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    unordered_map<char, int> countFrequency(string &s) {
        unordered_map<char, int> frequency;
        for (char ch : s) {
            frequency[ch]++;
        }
        return frequency;
    }

    vector<int> anagramFinder(string s, string p) {
        if (s.empty() || p.empty() || s.size() < p.size()) {
            return {};
        }

        // To store the starting indices of anagrams
        vector<int> result;

        // Create a frequency map for characters in the pattern
        unordered_map<char, int> pFrequency = countFrequency(p);

        // Frequency maps for characters in p and the sliding window in s
        unordered_map<char, int> frequency;

        int start = 0,

            // Start and end pointers for the sliding window
            end = 0;
        while (end < s.size()) {

            // Add the current character to the window map
            frequency[s[end]]++;

            // If the window is too large, remove the start character
            if (end - start + 1 > p.size()) {

                // Decrease the count of the start character and remove
                // it if it hits 0
                frequency[s[start]]--;
                if (frequency[s[start]] == 0) {
                    frequency.erase(s[start]);
                }

                // Slide the window to the right
                start++;
            }

            // If the window size is equal to p's size, check if it's an
            // anagram
            if (end - start + 1 == p.size()) {
                if (frequency == pFrequency) {
                    result.push_back(
                        start

                        // If it's an anagram, add the start index
                    );
                }
            }

            // Move the end pointer to expand the window
            end++;
        }

        return result;
    }
};
```
