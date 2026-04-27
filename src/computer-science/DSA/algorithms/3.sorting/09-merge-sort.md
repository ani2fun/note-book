# Introduction to merge sort

Merge sort is one of the most efficient and widely used sorting algorithms. It is a general-purpose comparison-based sort that uses a divide-and-conquer approach under the hood. It works by recursively dividing the input list into smaller sublists, sorting each, and merging them to produce a single list.

## Example

Continuing from the quicksort example, imagine you are a librarian tasked with organising a large collection of books in alphabetical order by title.

// Diagram: Books to sort

Instead of using quicksort, you could use merge sort, which breaks the problem into smaller, more manageable steps. First, divide the books into smaller groups that are easier to sort independently.

// Diagram: Divide the books into pairs to sort individually

Next, sort each of these smaller groups individually. Because the groups are smaller, this step is more manageable and efficient.

// Diagram: All pairs of books are individually sorted

Finally, merge the sorted groups back together to form larger sorted sections. 

// Diagram: Merge the sorted pairs to create a larger, fully sorted group

Repeat this process of merging until all the groups are combined into a single, fully sorted list of books.

// Diagram: All books are now sorted

> -   **Step 1:** Divide the books into smaller groups of manageable size.
> -   **Step 2:** Sort each group of books alphabetically by title.
> -   **Step 3:** Merge the groups to create larger sorted groups.
> -   **Step 4:** Repeat steps 1-3 until all books are sorted into one large group.

// Diagram: Sort books in alphabetical order using merge sort

## Advantages

Merge sort is a reliable and efficient sorting algorithm, particularly suited for large datasets. Its divide-and-conquer strategy ensures that even very large or complex inputs can be systematically broken down and sorted. The following points highlight some of the key advantages that make merge sort a robust choice for various applications.

> -   **Efficiency:** Merge sort is one of the most efficient, especially for large datasets. Its time complexity for all cases is **O(N\*logN)**, faster than many other sorting algorithms.
> -   **Stable:** Merge sort is stable, i.e., it does not change the list's relative order of equal values.
> -   **Parallelization:** Merge sort can be easily parallelized, allowing it to use multi-core processors and parallel computing environments.

## Limitations

While merge sort offers consistent performance and stability, it does have some drawbacks. The following points summarize the main limitations to keep in mind when using merge sort.

> -   **Space complexity:** Merge sort requires additional space to store the sorted subarrays during the merge phase. This can be a limitation when memory is limited.
> -   **Not In-place:** Merge sort is not an in-place algorithm; it needs to write the output to a different list, which could be problematic if memory is limited.

***

# Understanding merge sort algorithm

The strategy from the earlier example could be used to create an algorithm. To explain this algorithm, we will take an array as an input list, but the same algorithm can be applied to any list data structure.

## Algorithm

The merge sort algorithm begins by dividing the input array into two roughly equal-sized subarrays. This division continues recursively, breaking the array into smaller and smaller segments, until each subarray contains only a single element. At this stage, each subarray is trivially sorted, as a single element is inherently in order.

// Diagram: Recursively divide the array until all subarrays have one element

Once the array has been divided into individual elements, the algorithm starts the merging process. It combines pairs of subarrays by comparing elements and arranging them in sorted order. This step ensures that each merged array maintains the correct order.

// Diagram: Merge individual elements to form sorted subarrays

The merging continues recursively, gradually combining these sorted subarrays into increasingly larger sections, until the entire array is merged into a single, fully sorted array.

// Diagram: Merge sorted subarrays to form larger sorted subarrays

By systematically dividing and merging, merge sort efficiently sorts the entire dataset while maintaining stability and predictable performance.

// Diagram: The array is now sorted

Following the approach described above, the algorithm sorts the array using a divide-and-conquer strategy. Merge sort works by repeatedly dividing the array into subarrays until each contains a single element, then merging them in sorted order. The algorithm has two components

### Recursive Procedure

The sorting process begins with a call to `mergeSort(arr)`. The recursive procedure first checks whether the size of the array is less than or equal to `1`. If `arr.size() <= 1`, the array contains either zero or one element, which is already sorted by definition. In this case, the function returns the array.

**Why is `arr.size() <= 1` the base case?**

A single element (or an empty array) does not require any sorting. This condition acts as the base case for the recursion and prevents further unnecessary recursive calls.

// Diagram: A single element is already sorted

If the array contains more than one element, the algorithm proceeds by finding the middle index `mid = arr.size() / 2` and splitting the array into two halves:

// Diagram: The middle index of the array

> -   `leftArr` = `arr\[0 … mid - 1\]`
> -   `rightArr` = `arr\[mid … end\]`

The algorithm then recursively calls `mergeSort(leftArr)` to sort the left half and `mergeSort(rightArr)` to sort the right half. At this point, both halves are guaranteed to be sorted when the recursive calls return.

// Diagram: Call merge sort on the left and right subarrays

**Why do we divide the array into two halves?**

Dividing the array reduces the problem size at each recursive step. By repeatedly partitioning the array into smaller subarrays, the algorithm makes sorting simpler and manageable, eventually reaching the base case.

Once both halves, `leftArr` and `rightArr`, are sorted, the merge function combines them into a single sorted array. As the recursive calls unwind, progressively larger sorted subarrays are merged until the entire array is sorted in ascending order.

### Merge procedure

The merge function is responsible for combining two **already sorted arrays** into one sorted array. The algorithm begins by creating an empty array, `mergedArr`, to store the merged result. Two pointers are then initialised:

> -   `i = 0` to track the current index in `leftArr`
> -   `j = 0` to track the current index in `rightArr`

// Diagram: Initialise i and j pointers to 0 to track leftArr and rightArr respectively

The algorithm enters a loop that continues while both `i < leftArr.size()` and `j < rightArr.size()`. During each iteration, the elements `leftArr[i]` and `rightArr[j]` are compared.

> -   If `leftArr\[i\] <= rightArr\[j\]`, `leftArr\[i\]` is added to `mergedArr`, and `i` is incremented.
> -   Otherwise, `rightArr\[j\]` is added to `mergedArr`, and `j` is incremented.

**Why do we compare using `` `<=` ``?**

Using `` `<=` `` ensures that Merge sort is stable, meaning that elements with equal values preserve their original relative order from the input array.

Once one of the arrays has been fully processed, the loop terminates.

// Diagram: Compare leftArr\[i\] and rightArr\[j\], and insert the smaller element into mergedArr

Any remaining elements in `leftArr` or `rightArr` are then appended to `mergedArr`.

**Why can we add the remaining elements directly?**

Because both `leftArr` and `rightArr` are already sorted, any remaining elements are guaranteed to be larger than all elements already placed in `mergedArr`. Therefore, they can be added directly without further comparisons.

// Diagram: Add any remaining elements from leftArr or rightArr to mergedArr

After all elements have been merged, the merge function returns `mergedArr`. This merged array is the sorted result of the two halves.

// Diagram: Sorting an array in ascending order using merge sort

> **Algorithm**
>
> **merge(\[ref\] leftArr, \[ref\] rightArr)**
>
> -   **Step 1:** Create an empty array `mergedArr` to store the merged result
> -   **Step 2:** Initialise two pointers: `i = 0` for `leftArr` and `j = 0` for `rightArr`
> -   **Step 3:** While both `i < leftArr.size()` and `j < rightArr.size()`:
>     -   **Step 3.1:** If `leftArr\[i\] <= rightArr\[j\]`
>         -   **Step 3.1.1:** Add `leftArr\[i\]` to `mergedArr`
>         -   **Step 3.1.2:** Increment `i`
>     -   **Step 3.2:** Else if `leftArr\[i\] > rightArr\[j\]`
>         -   **Step 3.2.1:** Add `rightArr\[j\]` to `mergedArr`
>         -   **Step 3.2.2:** Increment `j`
> -   **Step 4:** Add any remaining elements from `leftArr` to `mergedArr`
> -   **Step 5:** Add any remaining elements from `rightArr` to `mergedArr`
> -   **Step 6:** Return `mergedArr`
>
> **mergeSort(\[ref\] arr)**
>
> -   **Step 1:** If `arr.size() <= 1`
>     -   **Step 1.1:** return `arr`
> -   **Step 2:** Find the middle index: `mid = arr.size() / 2`
> -   **Step 3:** Split the array into two halves
>     -   **Step 3.1:** `leftArr = arr\[0…mid-1\]`
>     -   **Step 3.2:** `rightArr = arr\[mid…end\]`
> -   **Step 4:** Recursively call `mergeSort(leftArr)` to sort the left half
> -   **Step 5:** Recursively call `mergeSort(rightArr)` to sort the right half
> -   **Step 6:** Return the merged and fully sorted array

## Implementation

The following implementation demonstrates how merge sort works using a divide-and-conquer approach. The array is repeatedly split into smaller halves until only single-element subarrays remain, and these subarrays are then merged back together in sorted order. This ensures an efficient and structured sorting process from bottom to top.

C++

```cpp
using namespace std;

class Solution {
public:
    vector<int> merge(vector<int> leftArr, vector<int> rightArr) {

        // Create an empty vector to store the merged array
        vector<int> mergedArr;

        // Initialize two pointers, i for leftArr and j for rightArr
        int i = 0, j = 0;

        // Compare elements from both arrays and add the smaller one to
        // the mergedArr
        while (i < leftArr.size() && j < rightArr.size()) {

            // If the element in leftArr is smaller or equal to the
            // element in rightArr add the element from leftArr to
            // mergedArr
            if (leftArr[i] <= rightArr[j]) {

                // Add element from leftArr to mergedArr
                mergedArr.push_back(leftArr[i]);

                // Move the pointer for leftArr to the next element
                ++i;
            }

            // Else if the element in rightArr is smaller than the
            // element in leftArr add the element from rightArr to
            // mergedArr
            else {

                // Add element from rightArr to mergedArr
                mergedArr.push_back(rightArr[j]);

                // Move the pointer for rightArr to the next element
                ++j;
            }

        // Add any remaining elements from leftArr (if any) to the
        // mergedArr
        while (i < leftArr.size()) {
            mergedArr.push_back(leftArr[i]);
            ++i;
        }

        // Add any remaining elements from rightArr (if any) to the
        // mergedArr
        while (j < rightArr.size()) {
            mergedArr.push_back(rightArr[j]);
            ++j;
        }

        // Return the sorted and merged array
        return mergedArr;
    }

// Diagram: vector<int> mergeSort(vector<int> arr) {

        // Base case: if the array has 1 or fewer elements, it is
        // already sorted
        if (arr.size() <= 1) {
            return arr;
        }

        // Find the middle index of the array
        int mid = arr.size() / 2;

        // Split the array into two halves
        vector<int> leftArr(arr.begin(), arr.begin() + mid);
        vector<int> rightArr(arr.begin() + mid, arr.end());

        // Recursively sort the left half
        leftArr = mergeSort(leftArr);

        // Recursively sort the right half
        rightArr = mergeSort(rightArr);

        // Merge the sorted halves and return the result
        return merge(leftArr, rightArr);
    }
};
```

Java

```java
import java.util.*;

class Solution {
    public int[] merge(int[] leftArr, int[] rightArr) {

        // Create an empty array to store the merged array
        int[] mergedArr = new int[leftArr.length + rightArr.length];

        // Initialize two pointers, i for leftArr and j for rightArr
        int i = 0, j = 0, k = 0;

        // Compare elements from both arrays and add the smaller one to
        // the mergedArr
        while (i < leftArr.length && j < rightArr.length) {

            // If the element in leftArr is smaller or equal to the
            // element in rightArr add the element from leftArr to
            // mergedArr
            if (leftArr[i] <= rightArr[j]) {

                // Add element from leftArr to mergedArr
                mergedArr[k] = leftArr[i];

                // Move the pointer for leftArr to the next element
                i++;
            }

            // Else if the element in rightArr is smaller than the
            // element in leftArr add the element from rightArr to
            // mergedArr
            else {

                // Add element from rightArr to mergedArr
                mergedArr[k] = rightArr[j];

                // Move the pointer for rightArr to the next element
                j++;
            }
            k++;
        }

        // Add any remaining elements from leftArr (if any) to the
        // mergedArr
        while (i < leftArr.length) {
            mergedArr[k] = leftArr[i];
            i++;
            k++;
        }

        // Add any remaining elements from rightArr (if any) to the
        // mergedArr
        while (j < rightArr.length) {
            mergedArr[k] = rightArr[j];
            j++;
            k++;
        }

        // Return the sorted and merged array
        return mergedArr;
    }

// Diagram: public int[] mergeSort(int[] arr) {

        // Base case: if the array has 1 or fewer elements, it is
        // already sorted
        if (arr.length <= 1) {
            return arr;
        }

        // Find the middle index of the array
        int mid = arr.length / 2;

        // Split the array into two halves
        int[] leftArr = Arrays.copyOfRange(arr, 0, mid);
        int[] rightArr = Arrays.copyOfRange(arr, mid, arr.length);

        // Recursively sort the left half
        leftArr = mergeSort(leftArr);

        // Recursively sort the right half
        rightArr = mergeSort(rightArr);

        // Merge the sorted halves and return the result
        return merge(leftArr, rightArr);
    }
```

Typescript

```typescript
export class Solution {
    merge(leftArr: number[], rightArr: number[]): number[] {

        // Create an empty array to store the merged array
        const mergedArr: number[] = [];

        // Initialize two pointers, i for leftArr and j for rightArr
        let i = 0;
        let j = 0;

        // Compare elements from both arrays and add the smaller one to
        // the mergedArr
        while (i < leftArr.length && j < rightArr.length) {

            // If the element in leftArr is smaller or equal to the
            // element in rightArr add the element from leftArr to
            // mergedArr
            if (leftArr[i] <= rightArr[j]) {

                // Add element from leftArr to mergedArr
                mergedArr.push(leftArr[i]);

                // Move the pointer for leftArr to the next element
                i++;
            }

            // Else if the element in rightArr is smaller than the
            // element in leftArr add the element from rightArr to
            // mergedArr
            else {

                // Add element from rightArr to mergedArr
                mergedArr.push(rightArr[j]);

                // Move the pointer for rightArr to the next element
                j++;
            }

        // Add any remaining elements from leftArr (if any) to the
        // mergedArr
        while (i < leftArr.length) {
            mergedArr.push(leftArr[i]);
            i++;
        }

        // Add any remaining elements from rightArr (if any) to the
        // mergedArr
        while (j < rightArr.length) {
            mergedArr.push(rightArr[j]);
            j++;
        }

        // Return the sorted and merged array
        return mergedArr;
    }

// Diagram: mergeSort(arr: number[]): number[] {

        // Base case: if the array has 1 or fewer elements, it is
        // already sorted
        if (arr.length <= 1) {
            return arr;
        }

        // Find the middle index of the array
        const mid = Math.floor(arr.length / 2);

        // Split the array into two halves
        const leftArr = arr.slice(0, mid);
        const rightArr = arr.slice(mid);

        // Recursively sort the left half
        const sortedLeftArr = this.mergeSort(leftArr);

        // Recursively sort the right half
        const sortedRightArr = this.mergeSort(rightArr);

        // Merge the sorted halves and return the result
        return this.merge(sortedLeftArr, sortedRightArr);
    }
```

Javascript

```javascript
export class Solution {
    merge(leftArr, rightArr) {

        // Create an empty array to store the merged array
        const mergedArr = [];

        // Initialize two pointers, i for leftArr and j for rightArr
        let i = 0;
        let j = 0;

        // Compare elements from both arrays and add the smaller one to
        // the mergedArr
        while (i < leftArr.length && j < rightArr.length) {

            // If the element in leftArr is smaller or equal to the
            // element in rightArr add the element from leftArr to
            // mergedArr
            if (leftArr[i] <= rightArr[j]) {

                // Add element from leftArr to mergedArr
                mergedArr.push(leftArr[i]);

                // Move the pointer for leftArr to the next element
                i++;
            }

            // Else if the element in rightArr is smaller than the
            // element in leftArr add the element from rightArr to
            // mergedArr
            else {

                // Add element from rightArr to mergedArr
                mergedArr.push(rightArr[j]);

                // Move the pointer for rightArr to the next element
                j++;
            }

        // Add any remaining elements from leftArr (if any) to the
        // mergedArr
        while (i < leftArr.length) {
            mergedArr.push(leftArr[i]);
            i++;
        }

        // Add any remaining elements from rightArr (if any) to the
        // mergedArr
        while (j < rightArr.length) {
            mergedArr.push(rightArr[j]);
            j++;
        }

        // Return the sorted and merged array
        return mergedArr;
    }

    mergeSort(arr) {
        // Base case: if the array has 1 or fewer elements, it is
        // already sorted
        if (arr.length <= 1) {
            return arr;
        }

        // Find the middle index of the array
        const mid = Math.floor(arr.length / 2);

        // Split the array into two halves
        const leftArr = arr.slice(0, mid);
        const rightArr = arr.slice(mid);

        // Recursively sort the left half
        const sortedLeftArr = this.mergeSort(leftArr);

        // Recursively sort the right half
        const sortedRightArr = this.mergeSort(rightArr);

        // Merge the sorted halves and return the result
        return this.merge(sortedLeftArr, sortedRightArr);
    }
```

Python

```python
from typing import List

class Solution:
    def merge(
        self, left_arr: List[int], right_arr: List[int]
    ) -> List[int]:

        # Create an empty list to store the merged array
        merged_arr: List[int] = []

        # Initialize two pointers, i for left arr and j for right arr
        i, j = 0, 0

        # Compare elements from both arrays and add the smaller one to
        # the merged_arr
        while i < len(left_arr) and j < len(right_arr):

            # If the element in leftArr is smaller or equal to the
            # element in rightArr add the element from leftArr to
            # mergedArr
            if left_arr[i] <= right_arr[j]:

                # Add element from left arr to merged arr
                merged_arr.append(left_arr[i])

                # Move the pointer for left arr to the next element
                i += 1

            # Else if the element in rightArr is smaller than the
            # element in leftArr add the element from rightArr to
            # mergedArr
            else:

                # Add element from right arr to merged arr
                merged_arr.append(right_arr[j])

                # Move the pointer for right arr to the next element
                j += 1

        # Add any remaining elements from left arr (if any) to the merged
        # arr
        while i < len(left_arr):
            merged_arr.append(left_arr[i])
            i += 1

        # Add any remaining elements from right arr (if any) to the
        # merged arr
        while j < len(right_arr):
            merged_arr.append(right_arr[j])
            j += 1

        # Return the sorted and merged list
        return merged_arr

    def merge_sort(self, arr: List[int]) -> List[int]:
        # Base case: if the list has 1 or fewer elements, it is
        # already sorted
        if len(arr) <= 1:
            return arr

        # Find the middle index of the list
        mid: int = len(arr) // 2

        # Split the list into two halves
        left_arr = arr[:mid]
        right_arr = arr[mid:]

        # Recursively sort the left half
        left_arr = self.merge_sort(left_arr)

        # Recursively sort the right half
        right_arr = self.merge_sort(right_arr)

        # Merge the sorted halves and return the result
        return self.merge(left_arr, right_arr)
```

## Complexity analysis

The time complexity of merge sort is **O(N\*logN)** in all cases. This is because the algorithm divides the input array into halves recursively until each subarray contains only one element (logN levels of recursion), then merges the subarrays back together in a way that takes linear time (N comparisons and swaps).

The space complexity of merge sort is **O(N)** for all cases because the algorithm requires additional space to store the sorted subarrays during the merge phase. Specifically, it requires space proportional to the size of the input array N to store the sorted subarrays.

> **Best case**
>
> -   Space complexity - **O(N)**
> -   Time complexity - **O(N\*logN)**
>
> **Average case**
>
> -   Space complexity - **O(N)**
> -   Time complexity - **O(N\*logN)**
>
> **Worst case**
>
> -   Space complexity - **O(N)**
> -   Time complexity - **O(N\*logN)**

***

# Merge sort

## Problem Statement

Given an integer array **arr**, write a function that sorts the given array in non-decreasing order and returns the sorted array. 

You must use **merge sort algorithm** to sort this array.

### Example 1

> -   **Input:** arr = \[2, 3, 2, 1, 5, 6\]
> -   **Output:** \[1, 2, 2, 3, 5, 6\]
> -   **Explanation:** Above is the sorted array.

### Example 2

> -   **Input:** arr = \[6, 5, 4, 4, 4, 3, 2, 1\]
> -   **Output:** \[1, 2, 3, 4, 4, 4, 5, 6\]
> -   **Explanation:** Above is the sorted array.

### Example 3

> -   **Input:** arr = \[1, 2, 3, 4, 5, 6\]
> -   **Output:** \[1, 2, 3, 4, 5, 6\]
> -   **Explanation:** The array is already sorted.

## Solution

```cpp
using namespace std;

class Solution {
public:
    vector<int> merge(vector<int> &leftArr, vector<int> &rightArr) {

        // Create an empty vector to store the merged array
        vector<int> mergedArr;

        // Initialize two pointers, i for leftArr and j for rightArr
        int i = 0, j = 0;

        // Compare elements from both arrays and add the smaller one to
        // the mergedArr
        while (i < leftArr.size() && j < rightArr.size()) {

            // If the element in leftArr is smaller or equal to the
            // element in rightArr add the element from leftArr to
            // mergedArr
            if (leftArr[i] <= rightArr[j]) {

                // Add element from leftArr to mergedArr
                mergedArr.push_back(leftArr[i]);

                // Move the pointer for leftArr to the next element
                ++i;
            }

            // Else if the element in rightArr is smaller than the
            // element in leftArr add the element from rightArr to
            // mergedArr
            else {

                // Add element from rightArr to mergedArr
                mergedArr.push_back(rightArr[j]);

                // Move the pointer for rightArr to the next element
                ++j;
            }
        }

        // Add any remaining elements from leftArr (if any) to the
        // mergedArr
        while (i < leftArr.size()) {
            mergedArr.push_back(leftArr[i]);
            ++i;
        }

        // Add any remaining elements from rightArr (if any) to the
        // mergedArr
        while (j < rightArr.size()) {
            mergedArr.push_back(rightArr[j]);
            ++j;
        }

        // Return the sorted and merged array
        return mergedArr;
    }

    vector<int> mergeSort(vector<int> &arr) {

        // Base case: if the array has 1 or fewer elements, it is
        // already sorted
        if (arr.size() <= 1) {
            return arr;
        }

        // Find the middle index of the array
        int mid = arr.size() / 2;

        // Split the array into two halves
        vector<int> leftArr(arr.begin(), arr.begin() + mid);
        vector<int> rightArr(arr.begin() + mid, arr.end());

        // Recursively sort the left half
        leftArr = mergeSort(leftArr);

        // Recursively sort the right half
        rightArr = mergeSort(rightArr);

        // Merge the sorted halves and return the result
        return merge(leftArr, rightArr);
    }
};
```

***

# Count inversions

## Problem Statement

Given an integer array **arr**, write a function that finds and returns the total number of inversions in it.

In an array if `(i < j)` and `(arr[i] > arr[j])`, then the pair `(i, j)` is called an inversion of an array. You must do this in a time complexity of `O(NlogN)`.

### Example 1

> -   **Input:** arr = \[1, 10, 5, 3, 4\]
> -   **Output:** 5
> -   **Explanation:** There are five inversions in the given array - (10, 5), (10, 3), (10, 4), (5, 3), (5, 4).

### Example 2

> -   **Input:** arr = \[1, 3, 2, 4, 5\]
> -   **Output:** 1
> -   **Explanation:** This array has a single inversion - (3, 2).

### Example 3

> -   **Input:** arr = \[1, 2, 3, 4, 5\]
> -   **Output:** 0
> -   **Explanation:** There are no inversions in the array.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int mergeAndCountInversions(
        vector<int> &arr,
        vector<int> &temp,
        int left,
        int mid,
        int right
    ) {

        // Index for left subarray
        int index1 = left;

        // Index for right subarray
        int index2 = mid + 1;

        // Index for merged subarray
        int index3 = left;

        // Count of inversions
        int inversions = 0;

        while (index1 <= mid && index2 <= right) {
            if (arr[index1] <= arr[index2]) {
                temp[index3++] = arr[index1++];
            } else {
                temp[index3++] = arr[index2++];

                // Count inversions
                inversions += mid - index1 + 1;
            }
        }

        // Copy the remaining elements of left subarray
        while (index1 <= mid) {
            temp[index3++] = arr[index1++];
        }

        // Copy the remaining elements of right subarray
        while (index2 <= right) {
            temp[index3++] = arr[index2++];
        }

        // Copy back the merged elements to the original array
        for (int i = left; i <= right; i++) {
            arr[i] = temp[i];
        }

        return inversions;
    }

    int mergeSortAndCountInversions(
        vector<int> &arr,
        vector<int> &temp,
        int left,
        int right
    ) {

        // Count of inversions
        int inversions = 0;

        if (left < right) {
            int mid = left + (right - left) / 2;

            // Recursive calls to divide the array into subarrays
            inversions +=
                mergeSortAndCountInversions(arr, temp, left, mid);
            inversions +=
                mergeSortAndCountInversions(arr, temp, mid + 1, right);

            // Merge the sorted subarrays and count inversions
            inversions +=
                mergeAndCountInversions(arr, temp, left, mid, right);
        }

        return inversions;
    }

    int countInversions(vector<int> &arr) {
        int n = arr.size();

        // Temporary array to store merged subarrays
        vector<int> temp(n);

        return mergeSortAndCountInversions(arr, temp, 0, n - 1);
    }
};
```
