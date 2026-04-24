# Understanding the problem

Before we explore any advanced searching techniques, it is important to clearly understand the search problem itself. Searching is the process of locating a specific item within a collection. It could be finding a contact in your phone, locating a book on a shelf, or identifying a file on your computer. In every case, you begin with a target, something you want to find, and you examine the available data to locate it.

## Example

Imagine you are a school teacher with 10 students, and you have a sorted list of their exam scores. You want to find the student who scored `85` marks.

// Diagram: Sorted scores of 10 students

One approach is to start at the top of the list and check each score one by one. You examine the first student’s score, and it is not `85`. You move to the second, but it is still not `85`. You continue down the list, checking each score individually, until you eventually find a student with `85`, but only after going through many others.

// Diagram: Linear search to find the student with a score of 85

Now imagine the same situation at a university level, where the student list isn’t just ten names, it’s thousands.

// Diagram: University with thousands of students

The task becomes slower, more effortful, and noticeably inefficient. As the list grows, the time it takes to find what you need increases as well.

## Limitations of linear search

With linear search, as the number of items grows, the time required grows equally. The search is guaranteed to succeed, but may take far too long when the data becomes large. Linear search does not use any helpful structure or shortcuts, making it slow and inefficient at large scale.

The challenge isn't finding the answer, it's finding it quickly when the data is large.

// Diagram: Searching becomes difficult at large scale

It does not take advantage of the fact that the list of scores is already sorted, which could make the search much faster and more efficient. This inefficiency is where the real problem of searching lies, and it sets the stage for exploring better, faster ways to search.

***

# Exploring a possible solution

Now that we understand the limitations of linear search on a sorted dataset, a more intelligent approach is needed. Checking each item individually becomes inefficient as the collection grows. Let’s explore how a more efficient search method, called binary search, solves this problem at scale. 

## Binary search

Binary search is one of computer science's most widely used search algorithms and is used to find the position of a target value in a sorted array by leveraging the array's sorted order. Instead of a linear search, it uses an intelligent strategy by partitioning the search space into two halves and discarding the half where the target cannot be present. 

Looking at the problem of finding a student who scored `85` marks in a sorted list of results containing thousands of students. Instead of checking each student's score individually, you begin by examining the score of the student at the middle of the list. 

// Diagram: Examine the score of the student at the middle of the list

If the **middle** score is **less** than `85`, the target **must be in the second half**, so you discard everything in the first half, including the middle score.

// Diagram: Discard the first half of the list (including the middle score)

Similarly, if the **middle** student scored **greater** than `85`, then the student you’re looking for **must be in the first half**, so you can discard the entire second half.

// Diagram: Discard the second half of the list (including the middle score)

You repeat this process, halving the remaining list each time, until the score `85` appears as the midpoint of the narrowed range.

// Diagram: Target found when only one element remains in the search space

By using the fact that the scores are already sorted, this method eliminates large chunks of data at every step, requiring far fewer comparisons and making the search significantly faster than checking each student sequentially.

> -   **Step 1**: Start with the full list of student scores included in the search.
> -   **Step 2**: Check the score at the midpoint of the list.
>     -   **Step 2.1**: If the middle score is \`85\`, you’ve found the student, stop the search.
>     -   **Step 2.2**: If the middle score is less than \`85\`, for example, \`78\`, eliminate the middle position and all scores below it, then repeat Step 2 with the second half.
>     -   **Step 2.3**: If the middle score is greater than \`85\`, for example, \`92\`, eliminate the middle position and all scores above it, then repeat Step 2 with the first half.
> -   **Step 3**: If the search space reduces to zero and \`85\` is never found, no student on the list has that score.

## Advantages

Binary search is highly efficient for finding items in large, sorted datasets. By repeatedly halving the search space, it drastically reduces the number of comparisons needed compared to linear search. The key advantages of binary search are outlined below:

> -   **Efficiency:** Binary search has a time complexity of **O(logN)**, which makes it significantly faster than linear search for large arrays.
> -   **Versatility:** Binary search can be used to find a target value in a sorted array and to find approximations, closest elements, peaks and valleys, intersection points of curves, and more.
> -   **Simplicity:** Binary search is a relatively simple algorithm to implement, making it accessible to programmers of all skill levels.

## Limitations

Despite its efficiency, binary search has certain constraints. It requires the dataset to be sorted and is less flexible with data that changes frequently. It also involves more complex logic than simple linear search. The main limitations of binary search are summarized below:

> -   **Requires sorted array:** Binary search's biggest limitation is that it only works on sorted arrays. If the array is not sorted, the algorithm will not work.
> -   **Limited to arrays:** Binary search is limited to searching arrays. It cannot be used to search linked lists or other data structures.

***

# Understanding binary search algorithm

The strategy from the earlier example could be used to create an algorithm. To explain this algorithm, we will use an array sorted in ascending order and search for a target number.

## Algorithm

The binary search algorithm searches for a target value in a sorted array by repeatedly dividing the search space in half. It works by comparing the target value with the middle element of the current search range. The algorithm begins by initialising two indices that define the current search range in which the target value may exist.

> -   \`low\` is set to the first index of the array i.e \`0\`.
> -   \`high\` is set to the last index of the array i.e \`arr.size() - 1\`.

// Diagram: Initialize the low and high indices

The algorithm enters a loop that continues as long as `low <= high`. This condition ensures that there are still elements remaining in the search range that could potentially match the target value.

**Why** **do we continue while `low <= high`?**

When `low` becomes greater than `high`, it means the search range is empty, and all possible positions have already been checked. At this point, the target value cannot be present in the array.

// Diagram: The loop terminates when the low index exceeds the high index

Inside the loop, the algorithm calculates the middle index using:

> -   \`mid = low + (high - low ) / 2\`

**Why is the middle index calculated as** `mid = low + (high - low) / 2` **instead of** mid = (low + high) / 2 ?

When calculating the middle of a range, `mid = low + (high - low) / 2` is preferred over `mid = (low + high) / 2` because directly adding `low` and `high` can overflow the integer range when they are large, while computing the difference first keeps the value safe and then adds it back to low without overflow

// Diagram: Compute the middle index using the formula

Based on the value of `arr[mid]`, the algorithm makes one of three possible decisions.

### 1\. arr\[mid\] == target

The search is complete when the middle element is **equal** to the target value, indicating that the list has been narrowed down to the exact position of the element. In this case, `mid` is returned as the index at which the target appears.

// Diagram: The target is found at the middle index of the array

### 2\. arr\[mid\] < target

If the value at the middle index is **less** than the target, the target cannot be in the left half of the array or at the middle position. As a result, the algorithm discards this entire portion and continues the search in the right half by updating `low = mid + 1`.

// Diagram: Discard the first half of the array, including the middle element

### 3\. arr\[mid\] > target

Similarly, if the value at the middle index is **greater** than the target, the target cannot be in the right half of the array or at the middle position. Therefore, the algorithm discards this portion and continues the search in the left half by updating `high = mid - 1`.

// Diagram: Discard the second half of the array, including the middle element

The algorithm repeatedly compares values and narrows the search space until the target element is found or the search range is exhausted. If the loop terminates without locating the target, it confirms that the element does not exist in the array, and the algorithm returns `-1` to indicate an unsuccessful search.

// Diagram: Find an element in an array using binary search

> **Algorithm**
>
> -   **Step 1:** Initialize search boundaries, set \`low = 0\`, \`high = arr.size() - 1\`
> -   **Step 2:** Iterate while \`low <= high\`
>     -   **Step 2.1:** Calculate middle index \`mid = low + (high - low) / 2\`
>     -   **Step 2.2:** If \`arr\[mid\] == target\`:
>         -   **Step 2.2.1:** Return \`mid\`
>     -   **Step 2.3:** Else if \`arr\[mid\] < target\`
>         -   **Step 2.3.1:** Set \`low = mid + 1\`
>     -   **Step 2.4:** Else if \`arr\[mid\] > target\`
>         -   **Step 2.4.1:** Set \`high = mid - 1\`
> -   **Step 3:** If the loop ends without returning, the target is not in the array, return \`-1\`

## Implementation

Binary search can be implemented efficiently using a simple loop or recursion. By repeatedly checking the middle element and narrowing the search space based on comparisons, the algorithm quickly zeroes in on the target.

C++

```cpp
class Solution {
    public int binarySearch(int[] arr, int target) {

        // Starting index of the search range
        int low = 0;

        // Ending index of the search range
        int high = arr.length - 1;

// Diagram: while (low <= high) {

            // Calculate the middle index
            int mid = low + (high - low) / 2;

            // Found the target, return the index
            if (arr[mid] == target) {
                return mid;
            }

            // If the arr[mid] is less than the target, adjust the search
            // range to the right half
            else if (arr[mid] < target) {
                low = mid + 1;
            }

            // Else if the arr[mid] is greater than the target, adjust
            // the search range to the left half
            else {
                high = mid - 1;
            }

        // Target not found in the array
        return -1;
    }
```

Java

```java
class Solution {
    public int binarySearch(int[] arr, int target) {

        // Starting index of the search range
        int low = 0;

        // Ending index of the search range
        int high = arr.length - 1;

// Diagram: while (low <= high) {

            // Calculate the middle index
            int mid = (low + high) / 2;

            // Found the target, return the index
            if (arr[mid] == target) {
                return mid;
            }

            // If the target is greater than the element at mid
            // Adjust the search range to the right half
            else if (arr[mid] < target) {
                low = mid + 1;
            }

            // Else if the target is smaller than the element at mid
            // Adjust the search range to the left half
            else {
                high = mid - 1;
            }

        // Target not found in the array
        return -1;
    }
```

Typescript

```typescript
export class Solution {
    binarySearch(arr: number[], target: number): number {

        // Starting index of the search range
        let low: number = 0;

        // Ending index of the search range
        let high: number = arr.length - 1;

// Diagram: while (low <= high) {

            // Calculate the middle index
            const mid: number = low + Math.floor((high - low) / 2);

            // Found the target, return the index
            if (arr[mid] === target) {
                return mid;
            }

            // If the arr[mid] is less than the target, adjust the search
            // range to the right half
            else if (arr[mid] < target) {
                low = mid + 1;
            }

            // Else if the arr[mid] is greater than the target, adjust
            // the search range to the left half
            else {
                high = mid - 1;
            }

        // Target not found in the array
        return -1;
    }
```

Javascript

```javascript
export class Solution {
    binarySearch(arr, target) {

        // Starting index of the search range
        let low = 0;

        // Ending index of the search range
        let high = arr.length - 1;

// Diagram: while (low <= high) {

            // Calculate the middle index
            const mid = low + Math.floor((high - low) / 2);

            // Found the target, return the index
            if (arr[mid] === target) {
                return mid;
            }

            // If the arr[mid] is less than the target, adjust the search
            // range to the right half
            else if (arr[mid] < target) {
                low = mid + 1;
            }

            // Else if the arr[mid] is greater than the target, adjust
            // the search range to the left half
            else {
                high = mid - 1;
            }

        // Target not found in the array
        return -1;
    }
```

Python

```python
from typing import List

class Solution:
    def binary_search(self, arr: List[int], target: int) -> int:

        # Starting index of the search range
        low: int = 0

        # Ending index of the search range
        high: int = len(arr) - 1

        while low <= high:

            # Calculate the middle index
            mid: int = low + (high - low) // 2

            # Found the target, return the index
            if arr[mid] == target:
                return mid

            # If the arr[mid] is less than the target, adjust the search
            # range to the right half
            if arr[mid] < target:
                low = mid + 1

            # Else if the arr[mid] is greater than the target, adjust
            # the search range to the left half
            else:
                high = mid - 1

        # Target not found in the array
        return -1
```

## Complexity analysis

The time complexity of binary search is **O(logN)** for all cases, where **N** is the number of elements in the array. The time complexity is **O(logN)** because binary search repeatedly divides the search space in half at each step.

Since the algorithm does not allocate any new memory during the search, the space complexity is constant, i.e., **O(1)**.

> **Best case**
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(logN)**
>
> **Average case**
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(logN)**
>
> **Worst case**
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(logN)**

***

# Binary search

## Problem Statement

Given an integer array **arr** that is sorted in ascending order and an integer **target**, write a function to search for the target in the array. If the target exists, return its index otherwise, return `-1`.

You must do this in a time complexity of `O(logN)`.

### Example 1

> -   **Input:** arr = \[1, 2, 3, 4, 5, 6\], target = 3
> -   **Output:** 2
> -   **Explanation:** The integer 3 is at index 2 in the array.

### Example 2

> -   **Input:** arr = \[1, 2, 3, 4, 5, 6\], target = 6
> -   **Output:** 5
> -   **Explanation:** The integer 6 is at index 5 in the array.

### Example 3

> -   **Input:** arr = \[1, 2, 3, 4, 5, 6\], target = 10
> -   **Output:** -1
> -   **Explanation:** The integer 10 does not exist in the array.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int binarySearch(vector<int> &arr, int target) {

        // Starting index of the search range
        int low = 0;

        // Ending index of the search range
        int high = arr.size() - 1;

        while (low <= high) {

            // Calculate the middle index
            int mid = low + (high - low) / 2;

            // Found the target, return the index
            if (arr[mid] == target) {
                return mid;
            }

            // If the arr[mid] is less than the target, adjust the search
            // range to the right half
            else if (arr[mid] < target) {
                low = mid + 1;
            }

            // Else if the arr[mid] is greater than the target, adjust
            // the search range to the left half
            else {
                high = mid - 1;
            }
        }

        // Target not found in the array
        return -1;
    }
};
```
