# Understanding divide and conquer algorithms

In computer science, divide-and-conquer is an algorithmic paradigm that recursively breaks a larger problem into smaller subproblems of the same type until they are small enough to be solved directly. These smaller problems are solved, and their solutions are combined to formulate the solution to the original problem. It follows three phases:

> -   **Divide**: Divide the bigger problem into smaller subproblems.
> -   **Apply**: Solve the smaller subproblems.
> -   **Combine**: Combine the solutions from the smaller subproblems to create the bigger solution.

## Example

We use this approach more often than we realise in everyday life. Imagine preparing for a history exam with a huge syllabus. Rather than attempting to memorise everything at once, you break the chapters into smaller sections, study each one separately, and then connect the ideas later. This is essentially how the divide-and-conquer strategy works, and it can be understood in three main phases:

### Step 1: Divide

The first step is to break the large task into smaller, manageable parts. In the context of studying, this means breaking the entire syllabus into chapters, topics, or concepts rather than trying to learn everything at once. For instance, when preparing for a history exam, you might separate the syllabus into time periods, major events, or key themes. By dividing the content this way, the workload becomes much easier to approach and understand.

// Diagram: Divide history into multiple topics

### Step 2: Apply

After breaking the material into smaller sections, the next phase is to study each part individually. Instead of trying to absorb everything together, you focus on a single topic, read through it carefully, take notes, highlight key points, or watch related videos. You might even attend classes or discussions to deepen your understanding. By mastering each section individually, the overall content becomes much less overwhelming and far easier to retain.

// Diagram: Read the independent chapters

### Step 3: Combine

Once each section has been studied and understood individually, the final step is to bring everything together. This involves revisiting all topics collectively, reviewing notes, linking concepts across chapters, or using tools like flashcards and mind maps to reinforce memory. Taking practice tests or solving past papers can also help identify weak areas and strengthen connections between topics. By merging the knowledge from each sub-section, the entire subject becomes clear and easier to recall during the exam.

// Diagram: Combine the knowledge from independent chapters

## Advantages

Divide and conquer offers several powerful benefits that make it a preferred approach in algorithm design, especially for large or complex problems. By breaking tasks into smaller pieces and solving them independently, this method often leads to faster execution, cleaner logic, and better scalability. It presents the following advantages

> -   **Efficiency:** Divide-and-conquer algorithms drastically improve performance by breaking down problems into smaller subproblems.
> -   **Parallelism:** Divide-and-conquer algorithms can be easily parallelized, allowing multiple processors or cores to work on different subproblems simultaneously.
> -   **Scalability:** Divide-and-conquer algorithms can easily be scaled to handle larger input sizes. By breaking down a problem into smaller subproblems, they can handle larger input sizes without sacrificing performance.

## Limitations

Despite its benefits, the divide-and-conquer approach also has limitations that must be considered.

> -   **Memory usage**: Divide-and-conquer algorithms are recursive by definition, which could make them more prone to stack overflow errors.

***

# Introduction to quicksort

Quicksort is a popular comparison-based sorting algorithm that uses the divide-and-conquer approach. It selects a pivot element, partitions the list into smaller and larger elements, and recursively sorts the sublists. Its efficiency and simplicity make it one of the fastest algorithms for large or randomly ordered datasets.

**Why is quicksort also called partition-exchange sort?**

Quicksort is also called a partition-exchange sort because it works by partitioning the array around a pivot element and then exchanging elements to ensure that all values smaller than the pivot are on one side and all larger values are on the other.

## Example

An example of quicksort in action can be seen if you were a librarian tasked with arranging books alphabetically by title.

// Diagram: Books to sort

Start by selecting a book at random as the pivot.

// Diagram: The book "Dracula" is chosen as the pivot

Then, place all books whose titles come before the pivot to its left, and all books whose titles come after the pivot to its right. This ensures the pivot is in its correct position.

// Diagram: "Dracula" is now in its correct position

Next, repeat the same process on the left and right groups of books.

// Diagram: Repeat the process on the left and right groups with new pivots

By continuing this way, all the books will eventually be sorted in the correct alphabetical order.

// Diagram: All books are now sorted

> -   **Step 1:** Chose a random book from all the leftover books and make it a pivot
> -   **Step 2:** Place the books with the titles before the pivot to the left and those with the titles after the pivot to the right.
> -   **Step 3:** Repeat steps 1-2 for the left and right partitions produced in step 2.

// Diagram: Sorting books in alphabetical order using quicksort

## Advantages

Quicksort is highly efficient for large datasets and sorts in place, requiring minimal additional memory. It is generally faster than many other sorting algorithms due to its partition-based approach.

> -   **Efficiency:** Quicksort is very efficient, especially for large datasets. The average case's time complexity is **O(N\*logN)**, faster than many other sorting algorithms.
> -   **Adaptive:** Quicksort is adaptive, meaning its performance improves when the input list is partially or nearly sorted. The partitioning step becomes more efficient when the list is partially sorted.
> -   **Parallelization:** Quicksort can be easily parallelized, allowing it to take advantage of multi-core processors and parallel computing environments
> -   **In-place:** Quicksort can sort the input list itself without allocating new memory for the algorithm to run.

## Limitations

While Quicksort is a highly efficient and widely used sorting algorithm, it does come with a few important limitations that should be considered.

> -   **Unstable:** Quicksort is unstable; it can change the list's relative order of equal values.
> -   **Inefficient:** Quicksort is not as efficient for small datasets, as the partitioning step's overhead can outweigh the algorithm's efficiency benefits.

***

# Quicksort

## Problem Statement

Given an integer array **arr**, write a function that sorts the given array in non-decreasing order. You must do it **in place**.

You must use **quicksort algorithm** to sort this array.

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
    int partition(vector<int> &arr, int left, int right) {

        // Randomly select a pivot index between left and right
        int pivot = left + rand() % (right - left + 1);

        // Get the pivot value
        int pivotVal = arr[pivot];

        // Move the pivot to the end
        swap(arr[pivot], arr[right]);

        // Index of smaller element
        int nextSmallerIndex = left;

        for (int i = left; i < right; i++) {
            if (arr[i] < pivotVal) {

                // Swap elements
                swap(arr[nextSmallerIndex], arr[i]);
                nextSmallerIndex++;
            }
        }

        // Swap pivot to its correct position
        swap(arr[nextSmallerIndex], arr[right]);

        // Return the pivot index
        return nextSmallerIndex;
    }

    void quicksort(vector<int> &arr, int left, int right) {
        if (left < right) {

            // Partition the array
            int pivot = partition(arr, left, right);

            // Recursively sort the left subarray
            quicksort(arr, left, pivot - 1);

            // Recursively sort the right subarray
            quicksort(arr, pivot + 1, right);
        }
    }

    void quickSort(vector<int> &arr) {
        int n = arr.size();

        // Call Quicksort function
        quicksort(arr, 0, n - 1);
    }
};
```

***

# Understanding the quickselect algorithm

When designing large-scale software systems that process large volumes of data, software engineers often need to balance efficiency and scalability. These systems may process millions of records to rank search results, surface top recommendations, or find the kth-best item. In most of these cases, a perfectly ordered dataset isn’t required, and only some partial ordering of a subset of the dataset can solve the problem. However, sorting-based solutions sort the entire dataset, which becomes a bottleneck.

The quickselect is an algorithm designed to efficiently solve them at scale. It finds the top k or bottom k items in an unsorted dataset without sorting the dataset, where the definition of top or bottom is problem dependent.

// Diagram: The 6 largest (top) elements in the array.

## Algorithm

The quickselect algorithm is a variation of quicksort that sorts only one partitioned half of the array instead of both halves. Consider we are given an integer array `arr`, and we need to find the top `k` elements in the array without fully sorting the array. The top `k` elements are the `k` largest elements in the array, and they can be returned in any order.

Note that the same algorithm can be slightly modified to find the bottom `k` elements in an array.

// Diagram: Find the k(6) largest elements in the array.

Like the quicksort algorithm, the quickselect algorithm also has two main components: a partitioning step and a recursive selection step. The partitioning step rearranges the array around a pivot value, while the recursive step repeatedly applies partitioning to progressively narrow down the search space until the array is partitioned around the k-th largest element. We will examine both these components separately to understand better how the algorithm works.

### 1\. Partition algorithm

The partition algorithm selects a random element from the array and rearranges the array in-place so that **all elements greater than that element appear before it**.

We create a function `partition` that takes as input the array `arr` and two indices, `left` and `right`, representing the subarray within which the data must be partitioned.

We start by choosing a random index `pivot` between `left` and `right`, store the value of `arr[pivot]` in a variable `pivotValue`, and swap `arr[pivot]` with `arr[right]`. This moves the pivot element to the end of the subarray so it does not interfere with the rearrangement of the remaining elements.

// Diagram: Choose a random pivot index and swap the element at that index with the element at the index right.

Next, we initialize a variable `nextGreaterIndex`, which marks the position where the next element greater than `pivotValue` should be placed. It is initialized to `left`, since this is where the first element greater than the pivot should go.

To rearrange the elements, we iterate over the subarray from `left` to `right − 1` using a variable `i`. In each iteration, we compare `arr[i]` with `pivotValue`. If `arr[i]` is **greater than** `pivotValue`, it belongs in the left partition. We therefore swap `arr[i]` with `arr[nextGreaterIndex]` and increment `nextGreaterIndex` to use it for the next seen larger element. If `arr[i]` is less than or equal to `pivotValue`, no action is needed, and we simply move on.

If we reverse the comparison condition for the rearrangement from **greater than** to **less than**, the same algorithm can find the elements with the bottom k scores instead of the top k.

// Diagram: Partition the array around a random pivot

This way, at the end of all iterations, all elements greater than `pivotValue` appear before `nextGreaterIndex`, and all elements smaller than or equal to it appear after. In the end, we swap `arr[right]` with `arr[nextGreaterIndex]` to place the pivot element into its correct (sorted, descending) position. The function then returns `nextGreaterIndex`, which is the final index of the pivot.

### 2\. Recursive selection

The entry point to the quickselect algorithm is the `quickselect` function, which repeatedly uses the `partition` function and relies on its randomness to efficiently narrow the search space until the array is partitioned around the k-th largest element.

We define a function `quickselect` that takes as input the array `arr`, two indices `left` and `right` representing the current search boundaries, and an integer `k`, which denotes the k-th largest element to be found. Initially, we call this function with `left = 0`, `right = n − 1`, and the given value of `k`.

If `left == right`, the subarray contains only one element, and no further partitioning is possible, so we return. Otherwise, we call the `partition` function passing it `left` and `right`. The `partition` function places a randomly selected element into its correct (sorted, descending) position and returns its index, which we store in a variable `pivot`. At this point, one of the following three cases must occur.

#### 2.1 pivot == k - 1

Since array indices are zero-based, if `pivot == k − 1`, the `pivot` element is exactly the k-th largest element in the array. All elements before it are larger, and all elements after it are smaller. In this case, the problem is solved, and we return to the caller.

// Diagram: If the final position of the pivot is at index k-1, all elements including and before it make up the k largest elements.

#### 2.2 pivot > k - 1

If `pivot > k − 1`, `pivot` lies to the right of the kth largest element. This means the k-th largest element must lie in the left subarray. Since all elements to the right of the `pivot` are smaller, they can be safely discarded. We therefore recursively call `quickselect` on the range `[left, pivot - 1]` in hopes of partitioning on the kth largest element the next time.

// Diagram: If the final position of the pivot is after the index k-1, it means the k largest elements are to its left.

#### 2.2 pivot < k - 1

If `pivot < k − 1`, `pivot` lies to the left of the kth largest element. Since the `pivot` The element is now in its correct sorted position; all elements before it are larger than it. The elements including and before it make a subset of the k largest elements in the array that are greater than `arr[pivot]` while the remaining subset of smaller elements is between `[pivot + 1, right]`.

And so, we recursively call quickselect on the range `[pivot + 1, right]` in hopes of partitioning on the kth largest element the next time, so that the remaining top `k` elements also move to the left of the new `pivot`.

// Diagram: If the final position of the pivot is before the index k-1, it means there are more of the k largest elements in the right subarray.

By repeatedly discarding half of the remaining search space and recursing only into the side that still contains the k-th largest element, quickselect becomes blazingly fast in the average case. Given below is an example execution of the algorithm to find the top k elements in an array.

// Diagram: Find the k(6) largest elements in the array

## Algorithm

The steps given below summarize the quickselect algorithm to find the top `k` elements in an array. If we slightly change the partition function to move smaller elements before the randomly selected pivot, keeping everything else the same, we can find the bottom `k` elements in the array.

> **partition(\[ref\]arr, left, right)**
>
> -   **Step 1:** Set \`pivot\` = Randomly select an index between \`left\` and \`right\`
> -   **Step 2:** Set \`pivotValue\` = \`arr\[pivot\]\`
> -   **Step 3:** Swap \`arr\[pivot\]\` with \`arr\[right\]\`
> -   **Step 4:** Initialize \`nextGreaterIndex\` = \`left\`
> -   **Step 5:** Iterate from \`left\` to \`right - 1\` using \`i\` and do the following:
>     -   **Step 5.1:** If \`arr\[i\]\` > \`pivotValue\` do the following:
>         -   **Step 5.1.1:** Swap \`arr\[i\]\` with \`arr\[nextGreaterIndex\]\`
>         -   **Step 5.1.2:** Increment \`nextGreaterIndex\`
> -   **Step 6:** Swap \`arr\[nextGreaterIndex\]\` with \`arr\[right\]\` to place pivot in its final position
> -   **Step 6:** Return \`nextGreaterIndex\`
>
> **quickselect(\[ref\]arr, left, right, k)**
>
> -   **Step 1:** If \`left\` >= \`right\`, return
> -   **Step 2:** Call \`pivot\` = \`partition(arr, left, right)\`
> -   **Step 3:** If \`pivot\` == \`k - 1\`, pivot is correctly positioned; return
> -   **Step 4:** Otherwise, If \`pivot\` > \`k - 1\`, recursively call \`quickselect(arr, left, pivot - 1, k)\`
> -   **Step 5:** Otherwise, recursively call \`quickselect(arr, pivot + 1, right, k)\`

## Implementaion

Given below is the recursive implementation of the quickselect algorithm to find the top `k` elements in an array.

C++

```cpp
#include <cmath>
#include <cstdlib>

// Diagram: using namespace std;

class Solution {
public:

    // Function to partition the array based on comparison to pivot
    int partition(vector<int> &arr, int left, int right) {

        // Randomly select a pivot index between left and right
        int pivot = left + rand() % (right - left + 1);

        // 1. Get the pivot value
        int pivotValue = arr[pivot];

        // Move the pivot to the end
        swap(arr[pivot], arr[right]);

        // 2. Move elements around the pivot such that larger elements
        // come to the left
        int nextGreaterIndex = left;
        for (int i = left; i < right; i++) {

            // Elements greater than pivot come to left
            if (arr[i] > pivotValue) {
                swap(arr[nextGreaterIndex], arr[i]);
                nextGreaterIndex++;
            }

        // 3. Move pivot to its final position
        swap(arr[nextGreaterIndex], arr[right]);

        // nextGreaterIndex is now the final index of the pivotValue
        return nextGreaterIndex;
    }

    // Quickselect to find the Kth largest element
    void quickselect(vector<int> &arr, int left, int right, int k) {
        if (left >= right) {
            return;
        }

        // Partition the array and get the pivot index
        int pivot = partition(arr, left, right);

        // If the pivot is at the k-1th position (in 0-indexed from the
        // right)
        if (pivot == k - 1) {
            return;
        }

        // If pivot is greater than k - 1, search in the left half
        else if (pivot > k - 1) {
            quickselect(arr, left, pivot - 1, k);
        }

        // If k is greater than the pivot index, search in the right half
        else {
            quickselect(arr, pivot + 1, right, k);
        }

    vector<int> topKElements(vector<int> &arr, int k) {
        int n = arr.size();

        // Step 1: Perform Quickselect to position top k elements
        quickselect(arr, 0, n - 1, k);

        // Step 2: First k elements are the top k largest elements
        return vector<int>(arr.begin(), arr.begin() + k);
    }
};
```

Java

```java
import java.util.*;

class Solution {
    private Random rand = new Random();

    // Helper method to swap elements in the array
    private void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    // Function to partition the array based on comparison to pivot
    private int partition(int[] arr, int left, int right) {

        // Randomly select a pivot index between left and right
        int pivot = left + rand.nextInt(right - left + 1);

        // 1. Get the pivot value
        int pivotValue = arr[pivot];

        // Move the pivot to the end
        swap(arr, pivot, right);

        // 2. Move elements around the pivot such that larger elements
        // come to the left
        int nextGreaterIndex = left;
        for (int i = left; i < right; i++) {

            // Elements greater than pivot come to left
            if (arr[i] > pivotValue) {
                swap(arr, nextGreaterIndex, i);
                nextGreaterIndex++;
            }

        // 3. Move pivot to its final position
        swap(arr, nextGreaterIndex, right);

        // nextGreaterIndex is now the final index of the pivotValue
        return nextGreaterIndex;
    }

    // Quickselect to find the Kth largest element
    private void quickselect(int[] arr, int left, int right, int k) {
        if (left >= right) {
            return;
        }

        // Partition the array and get the pivot index
        int pivot = partition(arr, left, right);

        // If the pivot is at the k-1th position (in 0-indexed from the
        // right)
        if (pivot == k - 1) {
            return;
        }

        // If pivot is greater than k - 1, search in the left half
        else if (pivot > k - 1) {
            quickselect(arr, left, pivot - 1, k);
        }

        // If k is greater than the pivot index, search in the right half
        else {
            quickselect(arr, pivot + 1, right, k);
        }

    public int[] topKElements(int[] arr, int k) {
        int n = arr.length;

        // Step 1: Perform Quickselect to position top k elements
        quickselect(arr, 0, n - 1, k);

        // Step 2: First k elements are the top k largest elements
        return Arrays.copyOfRange(arr, 0, k);
    }
```

Typescript

```typescript
export class Solution {

    // Function to partition the array based on comparison to pivot
    partition(arr: number[], left: number, right: number): number {

        // Randomly select a pivot index between left and right
        const pivot =
            left + Math.floor(Math.random() * (right - left + 1));

        // 1. Get the pivot value
        const pivotValue = arr[pivot];

        // Move the pivot to the end
        [arr[pivot], arr[right]] = [arr[right], arr[pivot]];

        // 2. Move elements around the pivot such that larger elements
        // come to the left
        let nextGreaterIndex = left;
        for (let i = left; i < right; i++) {

            // Elements greater than pivot come to left
            if (arr[i] > pivotValue) {
                [arr[nextGreaterIndex], arr[i]] = [
                    arr[i],
                    arr[nextGreaterIndex]
                ];
                nextGreaterIndex++;
            }

        // 3. Move pivot to its final position
        [arr[nextGreaterIndex], arr[right]] = [
            arr[right],
            arr[nextGreaterIndex]
        ];

        // nextGreaterIndex is now the final index of the pivotValue
        return nextGreaterIndex;
    }

    // Quickselect to find the Kth largest element
    quickselect(
        arr: number[],
        left: number,
        right: number,
        k: number
    ): void {
        if (left >= right) {
            return;
        }

        // Partition the array and get the pivot index
        const pivot = this.partition(arr, left, right);

        // If the pivot is at the k-1th position (in 0-indexed from the
        // right)
        if (pivot === k - 1) {
            return;
        }

        // If pivot is greater than k - 1, search in the left half
        else if (pivot > k - 1) {
            this.quickselect(arr, left, pivot - 1, k);
        }

        // If k is greater than the pivot index, search in the right half
        else {
            this.quickselect(arr, pivot + 1, right, k);
        }

    topKElements(arr: number[], k: number): number[] {
        const n = arr.length;

        // Step 1: Perform Quickselect to position top k elements
        this.quickselect(arr, 0, n - 1, k);

        // Step 2: First k elements are the top k largest elements
        return arr.slice(0, k);
    }
```

Javascript

```javascript
export class Solution {

    // Function to partition the array based on comparison to pivot
    partition(arr, left, right) {

        // Randomly select a pivot index between left and right
        const pivot =
            left + Math.floor(Math.random() * (right - left + 1));

        // 1. Get the pivot value
        const pivotValue = arr[pivot];

        // Move the pivot to the end
        [arr[pivot], arr[right]] = [arr[right], arr[pivot]];

        // 2. Move elements around the pivot such that larger elements
        // come to the left
        let nextGreaterIndex = left;
        for (let i = left; i < right; i++) {

            // Elements greater than pivot come to left
            if (arr[i] > pivotValue) {
                [arr[nextGreaterIndex], arr[i]] = [
                    arr[i],
                    arr[nextGreaterIndex]
                ];
                nextGreaterIndex++;
            }

        // 3. Move pivot to its final position
        [arr[nextGreaterIndex], arr[right]] = [
            arr[right],
            arr[nextGreaterIndex]
        ];

        // nextGreaterIndex is now the final index of the pivotValue
        return nextGreaterIndex;
    }

    // Quickselect to find the Kth largest element
    quickselect(arr, left, right, k) {
        if (left >= right) return;

        // Partition the array and get the pivot index
        const pivot = this.partition(arr, left, right);

        // If the pivot is at the k-1th position (0-indexed from the
        // right)
        if (pivot === k - 1) {
            return;
        }

        // If pivot is greater than k - 1, search in the left half
        else if (pivot > k - 1) {
            this.quickselect(arr, left, pivot - 1, k);
        }

        // If k - 1 is greater than the pivot index, search in the right
        // half
        else {
            this.quickselect(arr, pivot + 1, right, k);
        }

    topKElements(arr, k) {
        const n = arr.length;

        // Step 1: Perform Quickselect to position top k elements
        this.quickselect(arr, 0, n - 1, k);

        // Step 2: First k elements are the top k largest elements
        return arr.slice(0, k);
    }
```

Python

```python
import random
from typing import List

class Solution:

    # Function to partition the array based on comparison to pivot
    def partition(self, arr: List[int], left: int, right: int) -> int:

        # Randomly select a pivot index between left and right
        pivot: int = left + random.randint(0, right - left)

        # 1. Get the pivot value
        pivot_value: int = arr[pivot]

        # Move the pivot to the end
        arr[pivot], arr[right] = arr[right], arr[pivot]

        # 2. Move elements around the pivot such that larger elements
        # come to the left
        next_greater_index: int = left
        for i in range(left, right):

            # Elements greater than pivot come to left
            if arr[i] > pivot_value:
                arr[next_greater_index], arr[i] = (
                    arr[i],
                    arr[next_greater_index],
                )
                next_greater_index += 1

        # 3. Move pivot to its final position
        arr[next_greater_index], arr[right] = (
            arr[right],
            arr[next_greater_index],
        )

        # next_greater_index is now the final index of the pivot_value
        return next_greater_index

    # Quickselect to find the Kth largest element
    def quickselect(
        self, arr: List[int], left: int, right: int, k: int
    ) -> None:
        if left >= right:
            return

        # Partition the array and get the pivot index
        pivot: int = self.partition(arr, left, right)

        # If the pivot is at the k-1th position (in 0-indexed from the
        # right)
        if pivot == k - 1:
            return

        # If pivot is greater than k - 1, search in the left half
        elif pivot > k - 1:
            self.quickselect(arr, left, pivot - 1, k)

        # If k is greater than the pivot index, search in the right half
        else:
            self.quickselect(arr, pivot + 1, right, k)

    def top_k_elements(self, arr: List[int], k: int) -> List[int]:
        n: int = len(arr)

        # Step 1: Perform Quickselect to position top k elements
        self.quickselect(arr, 0, n - 1, k)

        # Step 2: First k elements are the top k largest elements
        return arr[:k]
```

## Complexity Analysis

The quickselect algorithm repeatedly partitions the input array around a pivot, but unlike quicksort, it only recursively processes one side of the partition; the side that contains the k-th largest (or smallest) element. This targeted recursion reduces the total number of elements processed compared to full sorting.

It is easy to see that the partition function takes linear **O(N)** time, where **N** is the size of the array, in the worst case, as we loop through the array between `left` and `right`. For the quickselect algorithm, in the best case, when the `quickselect` function is called, the first call to the `partition` may partition the array around the kth largest element, and finish the algorithm, resulting in a linear **O(N)** time complexity.

// Diagram: The best case is when the first call to partition pivots the array around the index k-1.

In the average case, when the pivot is chosen at random, the partitions are reasonably balanced. On average, the recursive calls to the `quickselect` function only examine half of the remaining elements at each step, i.e, the boundary `[left, right]` is reduced in successive recursive calls. This results in an average case time complexity of **O(N + N/2 + . . + 1)** ~ **O(N)**. 

// Diagram: The average case is when every call to the partition function pivots the range around the middle index.

In the worst case, successive recursive calls to `quickselect` may always get the smallest or the largest element as the pivot from call to the `partition` function. This will result in only one element being discarded at a time until the kth-largest element is reached. 

In this case, the time complexity of the algorithm would to **O(N \* k)** ~ **O(N^2)** if `k` is very large and the smallest value is chosen as the pivot every time. On the other hand, if `k` is very small, the worst case would be when the largest value is always chosen as the pivot. This will result in a time complexity of **O(N \* (N - k)** ~ **O(N^2)** as `k` is very small.

We only create constant-sized local variables in all functions and modify the input array in place. However, the maximum depth of recursion may be **O(N)** in the worst case when only one element is discarded at a time due to a poor choice of pivot (smallest or largest value). In the average case, when the pivot is randomly chosen and the partitions are balanced, the number of elements is reduced by half in every recursive call, leading to a recursive depth of **O(logN)** and a space complexity of **O(logN)**. In the best case, the depth of recursion would be 1, leading to a constant **O(1)** space complexity.

// Diagram: The worst case is when every call to the partition function pivots the array around the end

> **Best case** - The first pivot is the k-th largest element.
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N)**
>
> **Average case** - The pivot is randomly chosen, discarding half of the elements in every recursive call
>
> -   Space complexity - **O(logN)**
> -   Time complexity - **O(N)**
>
> **Worst case** - The worst pivot is chosen every time discarding only 1 element in every recursive call
>
> -   Space complexity - **O(N)**
> -   Time complexity - **O(N^2)**

***

# Top k elements

## Problem Statement

Given an array **arr** and a positive integer **k**, write a function to find and return the top k elements in this array. You can return the answer in **any order**.

The top element is defined as the **largest element** in the array.

You must use a **quickselect algorithm** to solve this problem.

### Example 1

> -   **Input:** arr = \[5, 4, 2, 8\], k = 2
> -   **Output:** \[8, 5\]
> -   **Explanation:** 8 is the largest and 5 is the second largest element in the array.

### Example 2

> -   **Input:** arr = \[1, 2, 3, 4, 5\], k = 5
> -   **Output:** \[5, 4, 3, 2, 1\]
> -   **Explanation:** Above are the top five elements in the array.

### Example 3

> -   **Input:** arr = \[7, 5, 9\], k = 1
> -   **Output:** \[9\]
> -   **Explanation:** 9 is the largest element in the array.

## Solution

```cpp
#include <cmath>
#include <cstdlib>

using namespace std;

class Solution {
public:

    // Function to partition the array based on comparison to pivot
    int partition(vector<int> &arr, int left, int right) {

        // Randomly select a pivot index between left and right
        int pivot = left + rand() % (right - left + 1);

        // 1. Get the pivot value
        int pivotValue = arr[pivot];

        // Move the pivot to the end
        swap(arr[pivot], arr[right]);

        // 2. Move elements around the pivot such that larger elements
        // come to the left
        int nextGreaterIndex = left;
        for (int i = left; i < right; i++) {

            // Elements greater than pivot come to left
            if (arr[i] > pivotValue) {
                swap(arr[nextGreaterIndex], arr[i]);
                nextGreaterIndex++;
            }
        }

        // 3. Move pivot to its final position
        swap(arr[nextGreaterIndex], arr[right]);

        // nextGreaterIndex is now the final index of the pivotValue
        return nextGreaterIndex;
    }

    // Quickselect to find the Kth largest element
    void quickselect(vector<int> &arr, int left, int right, int k) {
        if (left >= right) {
            return;
        }

        // Partition the array and get the pivot index
        int pivot = partition(arr, left, right);

        // If the pivot is at the k-1th position (in 0-indexed from the
        // right)
        if (pivot == k - 1) {
            return;
        }

        // If pivot is greater than k - 1, search in the left half
        else if (pivot > k - 1) {
            quickselect(arr, left, pivot - 1, k);
        }

        // If k is greater than the pivot index, search in the right half
        else {
            quickselect(arr, pivot + 1, right, k);
        }
    }

    vector<int> topKElements(vector<int> &arr, int k) {
        int n = arr.size();

        // Step 1: Perform Quickselect to position top k elements
        quickselect(arr, 0, n - 1, k);

        // Step 2: First k elements are the top k largest elements
        return vector<int>(arr.begin(), arr.begin() + k);
    }
};
```
