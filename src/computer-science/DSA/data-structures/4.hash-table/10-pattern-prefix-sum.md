# 10. Pattern: Prefix Sum

## Table of contents

1. [Understanding the prefix sum pattern](#understanding-the-prefix-sum-pattern)
2. [Identifying the prefix sum pattern](#identifying-the-prefix-sum-pattern)
3. [First equilibrium point](#first-equilibrium-point)
4. [Self excluded array product](#self-excluded-array-product)
5. [Balanced binary subarray](#balanced-binary-subarray)
6. [Zero sum subarrays](#zero-sum-subarrays)

***

# Understanding the prefix sum pattern

Some problems involving sequential data structures (like arrays) require us to know the aggregated value of some function `f` over all subarrays. For some functions `f` like the **sum** function, these values can be easily derived from a corresponding prefix sum data structure. A prefix sum data structure stores the aggregated value of `f` for all prefixes for the given sequence. 

Consider we have an array `arr` and a function `f` where `agg[i]` is the aggregated value of `f` over `arr[0] .. arr[i]`. A prefix sum data structure is one where we map the index `i` to `agg[i]`. In most cases, we can use an array as a prefix sum data structure by storing `agg[i]` at the index `i` as we can easily access aggregated values of prefixes using indices.

// Diagram: Use array as prefix sum data structure

However, there are cases where we need to store the reverse mapping i.e., mapping `agg[i]` to `i`. We cannot use an array for this as the aggregated values themselves can be arbitrary and not be used as indices of an array. In such cases, we use a hash table to map `agg[i]` to `i` where `agg[i]` is the key and `i` is the mapped value since hash tables can map arbitrary values together.

// Diagram: Use hash map to map prefix sum values to indices

When mapping indices to aggregated values where each index is unique, there is no collision. However, when mapping aggregate values to indices, there can be multiple prefixes (indices) that can have the same aggregated values. When we use these aggregated values as keys of the hash map, there is a chance that a given aggregated value maps to multiple indices. To make sure we don't lose overwrite indices, the hash map, in this case, maps aggregated values to a list of indices. Consider a case below where `agg[1]` and `agg[n-2]` is the same and `agg[1]` is mapped to two indices 1 and n-1.

// Diagram: Prefix aggregated values are mapped to a list of indices.

The mapping prefix aggregated values to their indices in a sequence can efficiently solve many problems. Since, in most cases, the aggregate function `f` is the sum function, we call this technique the **prefix sum technique.**

The prefix sum pattern is a classification of problems that can be solved using hash tables to store the mapping of aggregate values to indices.

## Prefix sum technique

The prefix sum technique is a precomputation method where we calculate the aggregated value of the function `f` over all prefixes of a sequential data structure. Consider we have an array of items `arr` and a function `f` such that we can add and remove contributions of items from the aggregated value. Examples of such functions are sum, product, etc.

To store the reverse mapping, i.e., for mapping `agg[i]` to `i`, we create a hash map `prefixSumIndices` and initialize a variable `aggregate` with some default value. We traverse the array from start to end using `i`, and in each iteration, we compute the `agg[i]` in aggregate using the function `f` and aggregate itself, which should have the value of `agg[i-1].` We then map the value of `aggregate` to `i` in the `prefixSumIndices` map.

Consider the below example where `agg[1]` and `agg[n-2]` is the same.

// Diagram: Prefix sum technique to map aggregated values of f over all prefixes to their indices

### Algorithm

The algorithm given below outlines the generic hash assignment technique on any container.

> -   **Step 1:** Create a hash map \`prefixSumIndices\` to map aggregated values of function \`f\` over all prefixes to a list of indices
> -   **Step 2:** Initialize a variable \`aggregate\` with default value to compute prefix aggregates
> -   **Step 3:** Iterate in the container from start to end and using index variable \`i\`:
>     -   **Step 3.1:** Compute aggregate value of \`f\` over the current prefix using the current value of \`aggregate\` and function \`f\` in \`aggregate\`
>     -   **Step 3.2:** Map the current value of \`aggregate\` to index \`i\` in \`prefixSumIndices\`

### Implementation

Given below is the generic code implementation of the prefix sum technique on an array of integers `arr` using a function `f`. We use an integer to list of intergers map to map prefix aggregated values to a list of indices. We use dynamic arrays to make sure insertion to the list is a constant time operation.

C++

```cpp
unordered_map<int, vector<int> prefixSumTechnique(vector<int> &arr)
{
  // Initialize hash map to map prefix aggregated values
  // to a list of indices
  unordered_map<int, vector<int>> prefixSumIndices;

  // Initialize an aggregate with a default value
  int aggregate = 0;

  // Traverse the array from start to end
  for(int i=0; i<arr.size(); i++) {

    // Compute the prefix sum from 0 to i
    aggregate = f(aggregate, arr[i]);

    // Map aggregated value to current index
    if (prefixSumIndices.find(aggregate) != prefixSumIndices.end()) {
        prefixSumIndices[aggregate].push_back(i);
    }
    else {
      prefixSumIndices[aggregate] = {i};
    }

  return prefixSumIndices;
}
```

Java

```java
public class prefixSum {

    public HashMap<Integer, List<Integer>> prefixSumTechnique(List<Integer> arr) {
        // Initialize a hash map to map prefix aggregated values
        // to a list of indices
        HashMap<Integer, List<Integer>> prefixSumIndices = new HashMap<>();

        // Initialize an aggregate with a default value
        int aggregate = 0;

        // Traverse the array from start to end
        for (int i = 0; i < arr.size(); i++) {

            // Compute the prefix sum from 0 to i
            aggregate = f(aggregate, arr.get(i)); // Replace `f` with the appropriate function

            // Map aggregated value to current index
            if (prefixSumIndices.containsKey(aggregate)) {
                prefixSumIndices.get(aggregate).add(i);
            } else {
                List<Integer> indices = new ArrayList<>();
                indices.add(i);
                prefixSumIndices.put(aggregate, indices);
            }
        return prefixSumIndices;
    }
```

Typescript

```typescript
function prefixSumTechnique(arr: number[]): { [key: number]: number[] } {
  // Initialize hash map to map prefix aggregated values to a list of indices
  const prefixSumIndices: { [key: number]: number[] } = {};

  // Initialize an aggregate with a default value
  let aggregate = 0;

  // Traverse the array from start to end
  for (let i = 0; i < arr.length; i++) {
    // Compute the prefix sum from 0 to i
    aggregate = f(aggregate, arr[i]);

    // Map aggregated value to current index
    if (prefixSumIndices[aggregate]) {
      prefixSumIndices[aggregate].push(i);
    } else {
      prefixSumIndices[aggregate] = [i];
    }
  return prefixSumIndices;
}
```

Javascript

```javascript
function prefixSumTechnique(arr) {
  // Initialize hash map to map prefix aggregated values to a list of indices
  const prefixSumIndices = {};

  // Initialize an aggregate with a default value
  let aggregate = 0;

  // Traverse the array from start to end
  for (let i = 0; i < arr.length; i++) {
    // Compute the prefix sum from 0 to i
    aggregate = f(aggregate, arr[i]);

    // Map aggregated value to current index
    if (prefixSumIndices[aggregate]) {
      prefixSumIndices[aggregate].push(i);
    } else {
      prefixSumIndices[aggregate] = [i];
    }
  return prefixSumIndices;
}
```

Python

```python
def prefix_sum_technique(arr: List[int], f) -> Dict[int, List[int]]:

    # Initialize a dictionary to map aggregated values to a list of indices
    prefix_sum_indices: Dict[int, List[int]] = {}

    # Initialize an aggregate with a default value
    aggregate = 0

    # Traverse the array from start to end
    for i in range(len(arr)):
        # Compute the prefix sum (or custom aggregation) from 0 to i
        aggregate = f(aggregate, arr[i])

        # Map the aggregated value to the current index
        if aggregate in prefix_sum_indices:
            prefix_sum_indices[aggregate].append(i)
        else:
            prefix_sum_indices[aggregate] = [i]

    return prefix_sum_indices
```

### Complexity Analysis

The algorithm's time and space complexity is easy to understand. We iterate through the container from start to end and add items to a hash map. Adding items to a hash map has constant **O(1)** amortized time complexity, and assuming computation of `agg[i]` from `agg[i-1]` and `arr[i]` using function `f`, and appending to the list stored in the hash map is a constant time operation; the overall time complexity is the same as the time complexity of traversing the container, which is **O(N)** in most cases. 

We create a hash map to map data items to hash values. If all prefix aggregated values are distinct, the hash map would have N keys, each mapped to a list containing only one item, leading to a linear **O(N)** space complexity. On the other hand, if all aggregated values are the same, the hash map will have only one key mapped to a list containing N items, also leading to a linear **O(N)** space complexity.

> **Best Case -**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**
>
> **Worst Case -**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

Later in the course, we will examine techniques for identifying problems that can be solved using the prefix sum technique and walk through an example to better understand it.

***

# Identifying the prefix sum pattern

The prefix sum technique can only be used to solve some specific problems. These are generally **easy** or **medium** problems involving arrays or strings, where we must map the aggregate value of a function over all prefixes of the sequence to the indices where the prefix ends. The aggregate values mapped to indices are then used along with other problem contexts to solve the problem partially or completely. If the problem statement or its solution follows the generic template below, it can be solved by applying the counting technique.

**Template:**

Given a sequence of data, map the aggregate values of a function over all prefixes to their indices.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the hash assignment technique.

> **Problem statement:** Given an array of integers \`arr\`, find the number of subarrays with 0 sum.

// Diagram: Find the number zero sum subarrays

### Prefix sum technique

On closer observation, we can see that if we have the prefix sum for all prefixes of the array, if two indices `index1` and `index2`, have the same prefix sum, it means the subarray between `index1` and `index2` has zero-sum.

// Diagram: Two indices with same prefix sum make a zero sum subarray

We can use a hash map to map the prefix sum for all prefixes of the array to their indices and use it while traversing the array to find the longest subarray with zero-sum. The solution to the problem follows the template for the counting pattern we learned earlier.

**Template:**

Given a sequence of data (`arr`), map the aggregate values of a function (sum) over all prefixes to their indices.

We create a hash map `prefixSumIndices` to map prefix sum values to a list of indices in the array. We initialize variables `sum` and `count` with 0 and traverse the array from start to end.

In each iteration, we add the current item to `sum` to calculate the prefix sum till the current index. The number of prefixes seen so far with the same sum is the length of list mapped to the current value of `sum` in the `prefixSumIndices` map. If the `prefixSumIndices` map has a list of indices mapped to the current value of `sum`, we add its size (say `n`) to `count`. This is because if we consider the current index as an end, each index in the list can be treated as a start for a unique zero-sum subarray. On the other hand, if `prefixSumIndices` does not have any list mapped to the current value of `sum`, we create a list, add the current index to it, and map it to the current value of `sum` in `prefixSumIndices`.

At the end of all iterations, `count` will have the number of subarrays with zero-sum.

// Diagram: Find the number zero sum subarrays

The implementation of the prefix sum solution is given as follows.

C++

```cpp
#include <unordered_map>

// Diagram: using namespace std;

class Solution {
public:
    int zeroSumSubarrays(const vector<int>& arr) {
        // Create a map to store prefix sums and their frequency
        unordered_map<int, vector<int>> prefixSumIndices;

        // Initialize sum and count to 0
        int sum = 0;
        int count = 0;

        // Add a base case for prefixSum = 0
        prefixSumIndices[0].push_back(-1);

        // Iterate through the array using index `i`
        for (int i = 0; i < arr.size(); i++) {
            sum += arr[i];

            // Check if the prefix sum exists in the map
            if (prefixSumIndices.find(sum) != prefixSumIndices.end()) {
                // If there are other indices with the same sum, add them to count
                count += prefixSumIndices[sum].size();

                // Add the current index to the list
                prefixSumIndices[sum].push_back(i);
            } else {
                // Initialize a new list with the current index
                prefixSumIndices[sum] = {i};
            }

        return count;
    }
};
```

Java

```java
class ZeroSumSubarrays {
    public int zeroSumSubarrays(List<Integer> arr) {

        // Create a map to map prefix sum to a list of indices
        HashMap<Integer, List<Integer>> prefixSumIndices = new HashMap<>();

        // Initialize sum and count with 0
        int sum = 0;
        int count = 0;

        // Add a base case for prefixSum = 0
        prefixSumIndices.put(0, new ArrayList<>());
        prefixSumIndices.get(0).add(-1);

        // Iterate through the array using `i`
        for (int i = 0; i < arr.size(); i++) {
            sum += arr.get(i);

            if (prefixSumIndices.containsKey(sum)) {
                // If there are other indices with the same sum, add them to count
                count += prefixSumIndices.get(sum).size();

                // Add the current index to the list
                prefixSumIndices.get(sum).add(i);
            } else {
                // Create a new list and add the current index to the list
                List<Integer> indices = new ArrayList<>();
                indices.add(i);
                prefixSumIndices.put(sum, indices);
            }

        return count;
    }
```

Typescript

```typescript
export class Solution {
    zeroSumSubarrays(arr: number[]): number {
        // Create a map to map prefix sum to list of indices
        const prefixSumIndices: { [key: number]: number[] } = {};

        // Initialize sum and count with 0
        let sum = 0;
        let count = 0;

        // Add a base case for prefixSum = 0
        prefixSumIndices.set(0, [-1]);

        // Iterate through the array using `i`
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];

            if (prefixSumIndices[sum]) {
                // If there are other indices with the same sum, add them to count
                count += prefixSumIndices[sum].length;

                // Add the current index to the list
                prefixSumIndices[sum].push(i);
            } else {
                // Initialize the list with the current index
                prefixSumIndices[sum] = [i];
            }

        return count;
    }
```

Javascript

```javascript
export class Solution {
    zeroSumSubarrays(arr) {
        // Create a map to map prefix sum to list of indices
        const prefixSumIndices = {};

        // Initialize sum and count with 0
        let sum = 0;
        let count = 0;

        // Add a base case for prefixSum = 0
        prefixSumIndices.set(0, [-1]);

        // Iterate through the array using `i`
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];

            if (prefixSumIndices[sum]) {
                // If there are other indices with the same sum, add them to count
                count += prefixSumIndices[sum].length;

                // Add the current index to the list
                prefixSumIndices[sum].push(i);
            } else {
                // Initialize the list with the current index
                prefixSumIndices[sum] = [i];
            }

        return count;
    }
```

Python

```python
from typing import List

class Solution:
    def zero_sum_subarrays(arr: List[int]) -> int:
        # Create a dictionary to map prefix sums to a list of indices
        prefix_sum_indices: Dict[int, List[int]] = {}

        # Initialize sum and count with 0
        current_sum = 0
        count = 0

        # Add a base case for prefix_sum = 0
        prefix_sum_indices[0] = [-1]

        # Iterate through the array using index `i`
        for i in range(len(arr)):
            current_sum += arr[i]

            # Check if the prefix sum exists in the map
            if current_sum in prefix_sum_indices:
                # If there are other indices with the same sum, add them to count
                count += len(prefix_sum_indices[current_sum])

                # Add the current index to the list
                prefix_sum_indices[current_sum].append(i)
            else:
                # Initialize a new list with the current index
                prefix_sum_indices[current_sum] = [i]

        return count
```

The prefix sum technique solves the problem in a single pass and linear **O(N)** time.

## Example problems

Most problems that fall under this category are **easy** or **medium** problems; a list of a few is given below.

> -   **[First equilibrium point](https://www.codeintuition.io/courses/hash-table/KyhDQaca7IiMC0RpsEYWu)**
> -   **[Self excluded array product](https://www.codeintuition.io/courses/hash-table/Eh4Oii0rCoETeDv8ZChd5)**
> -   **[Balanced binary subarray](https://www.codeintuition.io/courses/hash-table/AteQzZ-lAOGM0w-QNekgz)**
> -   **[Zero sum subarrays](https://www.codeintuition.io/courses/hash-table/s5oH7wJoftisBw2xsbqmB)**

We will now solve these problems to understand the prefix sum technique better.

***

# First equilibrium point

## Problem Statement

Given an array of integers **arr**, write a function to find and return the first equilibrium point in an array. If there is no such point, return `-1` instead.

The equilibrium Point in an array is a position such that the sum of elements before it is equal to the sum of elements after it.

### Example 1

> -   **Input:** arr = \[1, 3, 5, 2, 2\]
> -   **Output:** 2
> -   **Explanation:** The sum before and after index 2 is 4.

### Example 2

> -   **Input:** arr = \[5, 5, 5, 5, 5\]
> -   **Output:** 2
> -   **Explanation:** The sum before and after index 2 is 10.

### Example 3

> -   **Input:** arr = \[1, 3, 5, 10\]
> -   **Output:** -1
> -   **Explanation:** There are no equilibrium points in the array.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int firstEquilibriumPoint(vector<int> &arr) {

        // calculate the prefix sum of the array
        vector<int> prefixSum(arr.size() + 1);
        prefixSum[0] = 0;
        for (int i = 1; i <= arr.size(); i++) {
            prefixSum[i] = prefixSum[i - 1] + arr[i - 1];
        }

        // check for equilibrium point
        for (int i = 1; i <= arr.size(); i++) {

            // calculate sum of elements before and after the current
            // index
            int leftSum = prefixSum[i] - arr[i - 1];
            int rightSum = prefixSum[arr.size()] - prefixSum[i];

            // if both sums are equal, return the current index as
            // equilibrium point
            if (leftSum == rightSum) {
                return i - 1;
            }
        }

        // no equilibrium point found
        return -1;
    }
};
```

***

# Self excluded array product

## Problem Statement

Given an integer array **arr**, write a function that returns an array **product** such that `product[i]`is equal to the product of all the elements of arr except `arr[i]`.

You must write an algorithm that runs in `O(n)` time and without using the division operation.

### Example 1

> -   **Input:** arr = \[1, 2, 3, 4\]
> -   **Output:** \[24, 12, 8, 6\]
> -   **Explanation:** product\[0\] = 2 \* 3 \* 4 = 24 product\[1\] = 1 \* 3 \* 4 = 12 product\[2\] = 1 \* 2 \* 4 = 8 product\[3\] = 1 \* 2 \* 3 = 6

### Example 2

> -   **Input:** arr = \[2, 3, 0\]
> -   **Output:** \[0, 0, 6\]
> -   **Explanation:** product\[0\] = 3 \* 0 = 0 product\[1\] = 2 \* 0 = 0 product\[2\] = 2 \* 3 = 6

### Example 3

> -   **Input:** arr = \[3, 4\]
> -   **Output:** \[4, 3\]
> -   **Explanation:** product\[0\] = 4 product\[1\] = 3

## Solution

```cpp
using namespace std;

class Solution {
public:
    vector<int> selfExcludedArrayProduct(vector<int> &arr) {
        int n = arr.size();
        vector<int> prefixProduct(n), suffixProduct(n), result(n);

        // prefix product
        prefixProduct[0] = arr[0];
        for (int i = 1; i < n; i++) {
            prefixProduct[i] = prefixProduct[i - 1] * arr[i];
        }

        // suffix product
        suffixProduct[n - 1] = arr[n - 1];
        for (int i = n - 2; i >= 0; i--) {
            suffixProduct[i] = suffixProduct[i + 1] * arr[i];
        }

        // answer
        result[0] = suffixProduct[1];
        result[n - 1] = prefixProduct[n - 2];
        for (int i = 1; i < n - 1; i++) {
            result[i] = prefixProduct[i - 1] * suffixProduct[i + 1];
        }

        return result;
    }
};
```

***

# Balanced binary subarray

## Problem Statement

Given an array arr containing only `0s` and `1s`, write a function to find the largest subarray which contains an equal number of `0s` and `1s`. 

You must do this in `O(n)` time complexity.

### Example 1

> -   **Input:** arr = \[1, 0, 1, 1, 1, 0, 0\]
> -   **Output:** 6
> -   **Explanation:** The subarray from index 1 to 6 contains three 0s and three 1s.

### Example 2

> -   **Input:** arr = \[0, 0, 1, 1, 0\]
> -   **Output:** 4
> -   **Explanation:** The subarrays from index 0 to 3 or from 1 to 4 contain two 0s and two 1s.

### Example 3

> -   **Input:** arr = \[1, 1, 1, 1\]
> -   **Output:** 0
> -   **Explanation:** There is no subarray with equal number of 0s and 1s.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    int balancedBinarySubarray(vector<int> &arr) {

        // Map to store the first occurrence of each prefix sum
        unordered_map<int, int> prefixSumIndex;

        // To store the maximum length of the subarray
        int maxLength = 0;

        // Initialize the prefix sum
        int prefixSum = 0;

        // Add a base case for prefixSum = 0
        prefixSumIndex[0] = -1;

        for (int i = 0; i < arr.size(); i++) {

            // Treat 0 as -1 for the prefix sum calculation
            prefixSum += (arr[i] == 0 ? -1 : 1);

            // If the prefix sum has been seen before
            if (prefixSumIndex.find(prefixSum) != prefixSumIndex.end()) {

                // Calculate the length of the subarray
                int length = i - prefixSumIndex[prefixSum];
                maxLength = max(maxLength, length);
            }

            // Otherwise, store the first occurrence of this prefix
            // sum
            else {
                prefixSumIndex[prefixSum] = i;
            }
        }

        return maxLength;
    }
};
```

***

# Zero sum subarrays

## Problem Statement

Given an array **arr**, write a function to find and return the starting and ending indexes of all subarrays in the array that sum to `0`. You can return the answer in **any order**.

### Example 1

> -   **Input:** arr = \[6, 3, -1, -3, 4, -2, 2, 4, 6, -12, -7\]
> -   **Output:** \[\[2, 4\], \[2, 6\], \[5, 6\], \[6, 9\], \[0, 10\]\]
> -   **Explanation:** All the subarrays above sum up to 0.

### Example 2

> -   **Input:** arr = \[1, 2, 3, 4, 0\]
> -   **Output:** \[\[4, 4\]\]
> -   **Explanation:** All the subarrays above sum up to 0.

### Example 3

> -   **Input:** arr = \[1, 2, 3\]
> -   **Output:** \[\]
> -   **Explanation:** No subarray sum up to 0.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<vector<int>> zeroSumSubarrays(vector<int> &arr) {

        // Map to store prefix sums and their indices
        unordered_map<int, vector<int>> prefixSumIndices;

        // To store the actual start and end indices of all subarrays
        vector<vector<int>> result;
        int prefixSum = 0;

        // Add a base case for prefixSum = 0
        prefixSumIndices[0].push_back(-1);

        for (int i = 0; i < arr.size(); i++) {
            prefixSum += arr[i];

            // If the prefixSum exists in the map, it means we found
            // subarrays summing to 0
            if (prefixSumIndices.find(prefixSum) !=
                prefixSumIndices.end()) {
                for (int prevIndex : prefixSumIndices[prefixSum]) {

                    // Add (prevIndex + 1) as the correct start index
                    result.push_back({prevIndex + 1, i});
                }
            }

            // Add the current index to the list of indices for this
            // prefixSum
            prefixSumIndices[prefixSum].push_back(i);
        }

        return result;
    }
};
```
