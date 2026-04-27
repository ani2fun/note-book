# Introduction to counting sort

Counting sort is a non-comparison-based sorting algorithm that operates by counting the number of occurrences of each unique element in the input list and using this information to place each element in the correct position in the output list. It is particularly useful when the range of input elements is known and relatively small compared to the number of elements to be sorted.

## Example

Let's say you were a teacher assigned the task of sorting students' answer sheets, with scores out of `100`. However, the catch is that there is a large number of students. You could use some of the sorts we studied earlier, but they would be quite time-consuming, since you would need to make many comparisons.

// Diagram: Answer sheet for all students

Since the score range is relatively small, you could use a different strategy. You could count the times each score appears and stack the sheets with the same score on top of each other. To do so, you would only need one pass over all the answer sheets and no comparison.

// Diagram: Stack of answer sheets with the same scores

Once you have all the stacks, you can arrange the individual answer sheets by unwinding the stacks in order, starting with the stack with the lowest (or highest, depending on the sorting order) score. You keep doing this until the sheets from all the stacks are lined up.

// Diagram: Sorted answer sheets of students

> -   **Step 1:** Stack the answer sheets with the same score on top of each other.
> -   **Step 2:** Unwind the stack with the lowest (or highest, depending on the sorting order) score and start lining the sheets.
> -   **Step 3:** Pick the next stack that fulfills the sorting order and repeat step 2 until all the stacks are unwinded.

// Diagram: Sorting answer sheets using counting sort

## Advantages

Counting sort has several advantages. It is highly efficient for sorting integers or categorical data with a small range of possible values. Being a stable sort that does not rely on element comparisons, it can sort data very quickly when the range of input values is limited.

> -   **Simplicity:** Counting sort is quite simple to understand and implement.
> -   **Efficiency:** With its linear time complexity, counting sort is very efficient when the range of input values is small compared to the number of elements in the input list. It outperforms comparison-based sorting algorithms like quicksort or merge sort in such cases.
> -   **Stable:** Counting sort is stable i.e. it does not change the relative order of equal values in the list.

## Limitations

Counting sort does have some limitations. It becomes impractical for datasets with a very large range of values, as memory requirements increase with the range. 

> -   **Space complexity:** Counting Sort requires additional space to store the count array and the output list, both of which have a size proportional to the range of input values. This can be a limitation when the range of input values is large or when memory is limited.
> -   **Not In-place:** Counting sort is not an in-place algorithm; it needs to write the output to a different list, which could be problematic if memory is limited.

***

# Understanding counting sort algorithm

The strategy from the earlier example could be used to create an algorithm. To explain this algorithm, we will take an array as an input list, but the same algorithm can be applied to any list data structure.

## Algorithm

The array is sorted by counting the frequency of each distinct element and then using this information to determine the correct position of each element in the sorted output. Unlike comparison-based sorting algorithms, counting sort works by directly mapping values to their positions, making it especially efficient when the range of input values is limited.

The algorithm consists of three main steps, each of which is crucial to transforming the input list into a fully sorted output. 

> -   **Step 1:** Calculate the frequency of each element.
> -   **Step 2:** Calculate the cumulative sum of frequencies.
> -   **Step 3:** Build the sorted output.

### Step 1: Calculate the frequency of each element

The first step is to determine how often each unique element appears in the input array. To do so, the algorithm creates a `count` array of size `k + 1`, where `k` represents the maximum value present in the input array. All elements of the count array are initialized to `0`. This array stores the frequency of each value in the input array.

The algorithm then iterates through the input array once. For each element `arr[i]`, the value at index `count[arr[i]]` is incremented by `1`. After this step, the count array contains the total number of times each value appears in the input array.

**Why do we create the count array of size k + 1?**

The count array must be large enough to represent every possible value from `0` to `k`. Using a size of `k + 1` ensures that each value can be used directly as an index into the count array without causing an index-out-of-bounds error.

For example, given the input array `[5, 6, 100]`, the count array would need a size of `101` (maximum element `100 + 1`), where `count[5]` = `1`, `count[6] = 1`, and `count[100] = 1`.

// Diagram: Calculate the frequency of each element

### Step 2: Calculate the cumulative sum of frequencies

In this step, the algorithm modifies the `count` array so that each element stores the cumulative count of values up to that index. Starting from index `1` and continuing to `` `k`, `` each element in the count array is updated as:

> `count\[i\] = count\[i\] + count\[i - 1\]`

After this transformation, `count[i]` represents the total number of elements in the input array that are less than or equal to `i`.

**Why do we convert the count array into a cumulative sum array?**

This step is important because it tells us the position of each element in the output array. Each value in the cumulative sum array indicates how many elements are less than or equal to the corresponding key. Using this information in the next phase, we can place each element from the input array directly into its correct position in the output array.

// Diagram: Calculate the cumulative sum of frequencies

### Step 3: Build the sorted output

In the final step, the algorithm creates an empty `result` array with the same size as the input array. It then iterates over the input array in reverse order and for each element `arr[i]`, the algorithm places it at index `count[arr[i]] - 1` in the `result` array. After placing the element, `count[arr[i]]` is decremented by `1` to update the next available position for that value.

By the end of this process, all elements of the input array will be correctly positioned in the `result` array, producing a fully sorted array.

**Why do we iterate the input array in reverse order in the final phase?**

Iterating in **reverse order** ensures that the relative order of equal elements is preserved, making counting sort a stable algorithm. For example, if two elements have the same value, the one that appears later in the input array will also appear later in the sorted output array, maintaining their original order.

// Diagram: Build the sorted list

> **Algorithm**
>
> -   **Step 1:** Create a count array of size `k + 1` (where `k` is the maximum value in the input array) and initialise all elements to `0`
>     -   **Step 1.1:** Iterate over the input array and increment `count\[arr\[i\]\]` for each element to record its frequency
> -   **Step 2:** Convert the `count` array into a cumulative sum array
>     -   **Step 2.1:** For each `i` from `1` to `k`, update `count\[i\] += count\[i - 1\]`
>     -   **Step 2.2:** The cumulative count now indicates the position of each element in the sorted output array
> -   **Step 3:** Build the sorted output array
>     -   **Step 3.1:** Create an empty result array of the same size as the input array
>     -   **Step 3.2:** Iterate over the input array in reverse order
>         -   **Step 3.2.1:** Place each element `arr\[i\]` at `result\[count\[arr\[i\]\] - 1\]`
>         -   **Step 3.2.2:** Decrement `count\[arr\[i\]\]` by `1`
> -   **Step 4:** Return the `result` array, which now contains the elements in sorted order

## Implementation

This implementation of counting sort sorts integers within a known range by first counting occurrences with a count array, converting it into a cumulative sum array to determine positions, and then building the sorted output. Iterating from the end ensures stability, and the algorithm avoids comparisons, making it efficient for small ranges of values.

C++

```cpp
using namespace std;

class Solution {
public:
    vector<int> countingSort(vector<int> &arr, int k) {
        int n = arr.size();

        // Create a count array to store the frequency of each key
        vector<int> count(k + 1, 0);

        // Store the frequency of each key in the count array
        for (int i = 0; i < n; i++) {
            count[arr[i]]++;
        }

        // Modify the count array to store the actual position of each
        // key in the sorted array
        for (int i = 1; i <= k; i++) {
            count[i] += count[i - 1];
        }

        // Create a temporary array to store the sorted result
        vector<int> result(n);

        // Build the sorted result array
        for (int i = n - 1; i >= 0; i--) {
            result[count[arr[i]] - 1] = arr[i];
            count[arr[i]]--;
        }

        return result;
    }
};
```

Java

```java
class Solution {
    public int[] countingSort(int[] arr, int k) {
        int n = arr.length;

        // Create a count array to store the frequency of each key
        int[] count = new int[k + 1];

        // Store the frequency of each key in the count array
        for (int i = 0; i < n; i++) {
            count[arr[i]]++;
        }

        // Modify the count array to store the actual position of each
        // key in the sorted array
        for (int i = 1; i <= k; i++) {
            count[i] += count[i - 1];
        }

        // Create a temporary array to store the sorted result
        int[] result = new int[n];

        // Build the sorted result array
        for (int i = n - 1; i >= 0; i--) {
            result[count[arr[i]] - 1] = arr[i];
            count[arr[i]]--;
        }

        return result;
    }
```

Typescript

```typescript
export class Solution {
    countingSort(arr: number[], k: number): number[] {
        const n: number = arr.length;

        // Create a count array to store the frequency of each key
        const count: number[] = new Array(k + 1).fill(0);

        // Store the frequency of each key in the count array
        for (let i = 0; i < n; i++) {
            count[arr[i]]++;
        }

        // Modify the count array to store the actual position of each
        // key in the sorted array
        for (let i = 1; i <= k; i++) {
            count[i] += count[i - 1];
        }

        // Create a temporary array to store the sorted result
        const result: number[] = new Array(n);

        // Build the sorted result array
        for (let i = n - 1; i >= 0; i--) {
            result[count[arr[i]] - 1] = arr[i];
            count[arr[i]]--;
        }

        return result;
    }
```

Javascript

```javascript
export class Solution {
    countingSort(arr, k) {
        const n = arr.length;

        // Create a count array to store the frequency of each key
        const count = new Array(k + 1).fill(0);

        // Store the frequency of each key in the count array
        for (let i = 0; i < n; i++) {
            count[arr[i]]++;
        }

        // Modify the count array to store the actual position of each
        // key in the sorted array
        for (let i = 1; i <= k; i++) {
            count[i] += count[i - 1];
        }

        // Create a temporary array to store the sorted result
        const result = new Array(n);

        // Build the sorted result array
        for (let i = n - 1; i >= 0; i--) {
            result[count[arr[i]] - 1] = arr[i];
            count[arr[i]]--;
        }

        return result;
    }
```

Python

```python
from typing import List

class Solution:
    def counting_sort(self, arr: List[int], k: int) -> List[int]:
        n: int = len(arr)

        # Create a count array to store the frequency of each key
        count: List[int] = [0] * (k + 1)

        # Store the frequency of each key in the count array
        for i in range(n):
            count[arr[i]] += 1

        # Modify the count array to store the actual position of each key
        # in the sorted array
        for i in range(1, k + 1):
            count[i] += count[i - 1]

        # Create a temporary array to store the sorted result
        result = [0] * n

        # Build the sorted result array
        for i in range(n - 1, -1, -1):
            result[count[arr[i]] - 1] = arr[i]
            count[arr[i]] -= 1

        return result
```

## Complexity analysis

In terms of time complexity, counting sort outperforms all the sorts we have studied so far. The time complexity of counting sort is **O(N + k)**, where N is the number of elements in the input list and k is the range of input values. This complexity arises from the counting phase, where we iterate through the input list to count the occurrences of each unique element, and the output phase, where we iterate through the input list again to place each element in the correct position in the sorted output list.

The space complexity of counting sort is also **O(N + k)**. This complexity arises from the count array, which stores the counts of each unique element, and the output list, which stores the sorted output.

> **Best case** - The input list is sorted in the desired order.
>
> -   Space complexity - **O(N + K)**
> -   Time complexity - **O(N + K)**
>
> **Average case** - The input list is a mix of sorted and unsorted elements.
>
> -   Space complexity - **O(N + K)**
> -   Time complexity - **O(N + K)**
>
> **Worst case** - The input list is sorted in reverse order.
>
> -   Space complexity - **O(N + K)**
> -   Time complexity - **O(N + K)**

***

# Counting sort

## Problem Statement

You are given an integer array **arr** and a positive integer **k**. The values of the array will be at most k, write a function that sorts the given array in non-decreasing order and returns the sorted array. 

You must use **counting sort algorithm** to sort this array.

### Example 1

> -   **Input:** arr = \[2, 3, 2, 1, 5, 6\], k = 6
> -   **Output:** \[1, 2, 2, 3, 5, 6\]
> -   **Explanation:** Above is the sorted array.

### Example 2

> -   **Input:** arr = \[6, 5, 4, 4, 4, 3, 2, 1\], k = 8
> -   **Output:** \[1, 2, 3, 4, 4, 4, 5, 6\]
> -   **Explanation:** Above is the sorted array.

### Example 3

> -   **Input:** arr = \[1, 2, 3, 4, 5, 6\], k = 7
> -   **Output:** \[1, 2, 3, 4, 5, 6\]
> -   **Explanation:** The array is already sorted.

## Solution

```cpp
using namespace std;

class Solution {
public:
    vector<int> countingSort(vector<int> &arr, int k) {
        int n = arr.size();

        // Create a count array to store the frequency of each key
        vector<int> count(k + 1, 0);

        // Store the frequency of each key in the count array
        for (int i = 0; i < n; i++) {
            count[arr[i]]++;
        }

        // Modify the count array to store the actual position of each
        // key in the sorted array
        for (int i = 1; i <= k; i++) {
            count[i] += count[i - 1];
        }

        // Create a temporary array to store the sorted result
        vector<int> result(n);

        // Build the sorted result array
        for (int i = n - 1; i >= 0; i--) {
            result[count[arr[i]] - 1] = arr[i];
            count[arr[i]]--;
        }

        return result;
    }
};
```
