# Understanding the quickselect pattern

In many cases, we may need to find the top k elements in a dataset based on a scoring function rather than just comparing raw data. The quickselect algorithm can be generalized it to work with a scoring function `f` instead of simple comparisons. Instead of selecting elements based purely on their numeric value, we use a function `f` that assigns a weight or score to each element, allowing us to find the top k elements according to any custom criterion.

This makes the general form of the quickselect algorithm incredibly flexible, as we reuse the same elegant partitioning approach to only focus on the elements that matter most and rank elements by any metric.

The quickselect pattern is a classification of problems that can be solved using the generic quickselect algorithm.

// Diagram: The elements with the top 6 scores in the array using a scoring function f.

## The generic quickselect algorithm

Consider we are given an array `arr`, and we need to find the top `k` elements in the array according to a score defined by a function `f`. The top `k` elements can be in any order.

// Diagram: Find the top k elements based on their scores using a function f.

To solve the problem, we use the quickselect algorithm with the scoring function `f`. All the steps are exactly the same as the quickselect algorithm, except for the rearrangement logic in the partition function, which now partitions the array based on the score of the elements using the function `f`. Given below are the partition algorithm and the recursive selection components of the generic quickselect algorithm.

### 1\. Partition algorithm

The partition algorithm selects a random element from the array and rearranges the array in-place so that **all elements with a score greater than the score of the selected element appear before it**.

We create a function `partition` that takes as input the array `arr` and two indices, `left` and `right`, representing the subarray within which the data must be partitioned.

We start by choosing a random index `pivot` between `left` and `right`, calculate and store the score of `arr[pivot]` in a variable `pivotScore` using the function `f` and swap `arr[pivot]` with `arr[right]`. This moves the pivot element to the end of the subarray so it does not interfere with the rearrangement of the remaining elements.

// Diagram: Choose a random pivot index and swap the element at that index with the element at the index right.

Next, we initialize a variable `nextGreaterIndex`, which marks the position where the next element with a score greater than `pivotScore` should be placed. It is initialized to `left`, since this is where the first element with a greater score should go.

To rearrange the elements, we iterate over the subarray from `left` to `right − 1` using a variable `i`. In each iteration, we calculate the score of `a[i]` in a variable `elementScore` using the function `f` and compare it with `pivotScore`. If `elementScore` is **greater than** `pivotScore`, it belongs in the left partition. We therefore swap `arr[i]` with `arr[nextGreaterIndex]` and increment `nextGreaterIndex` to use it for the element with a greater score. If `elementScore` is less than or equal to `pivotScore`, no action is needed, and we simply move on.

If we reverse the comparison condition for the rearrangement from **greater than** to **less than**, the same algorithm can find the elements with the bottom k scores instead of the top k.

This way, at the end of all iterations, all elements with a score greater than `pivotScore` appear before `nextGreaterIndex`, and all elements smaller than or equal to it appear after. In the end, we swap `arr[right]` with `arr[nextGreaterIndex]` to place the pivot element into its correct (sorted, descending by score) position. The function then returns `nextGreaterIndex`, which is the final index of the pivot.

// Diagram: Partition the array around a random pivot

### 2\. Recursive selection

The entry point to the generic quickselect algorithm is the `quickselect` function, which repeatedly uses the `partition` function and relies on its randomness to efficiently narrow the search space until the array is partitioned around the k-th largest element. It is identical to the quickselect algorithm we learned earlier.

We define a function `quickselect` that takes as input the array `arr`, two indices `left` and `right` representing the current search boundaries, and an integer `k` .Initially, we call this function with `left = 0`, `right = n − 1`, and the given value of `k`.

If `left == right`, the subarray contains only one element, and no further partitioning is possible, so we return. Otherwise, we call the `partition` function passing it `left` and `right`. The `partition` function places a randomly selected element into its correct (sorted, descending by score) position and returns its index, which we store in a variable `pivot`. At this point, one of the following three cases must occur.

#### 2.1 pivot == k - 1

Since array indices are zero-based, if `pivot == k − 1`, the `pivot` is the element with the kth largest score in the array. All elements before it have a greater score, and all elements after it have a smaller score. In this case, the problem is solved, and we return to the caller.

// Diagram: If the final position of the pivot is at index k-1, all elements including and before it make up the elements with the top k scores.

#### 2.2 pivot > k - 1

If `pivot > k − 1`, `pivot` lies to the right of the element with the kth largest score. This means the element with the k-th largest score must lie in the left subarray. Since all elements to the right of the `pivot` have a smaller score, they can be safely discarded. We therefore recursively call `quickselect` on the range `[left, pivot - 1]` in hopes of partitioning on the element with the kth largest score the next time.

// Diagram: If the final position of the pivot is after the index k-1, it means the elements with the top k scores are to its left.

#### 2.2 pivot < k - 1

If `pivot < k − 1`, `pivot` lies to the left of the element with the kth largest score. Since the `pivot` element is already in its correct sorted position and all elements before it have a score greater than it, the element with the kth largest score must lie in the right subarray. We therefore recursively call quickselect on the range `[pivot + 1, right]` in hopes of partitioning on the element with the kth largest score the next time.

// Diagram: If the final position of the pivot is before the index k-1, it means there are more elements with the top k scores in the right subarray.

By repeatedly discarding half of the remaining search space and recursing only into the side that still contains the element with the kth largest score, quickselect becomes blazingly fast in the average case. Given below is an example execution of the algorithm to find the top `k` elements with the largest score in an array using the function `f`.

// Diagram: Find the top k(6) elements in the array using the scoring function f

## Algorithm

The steps given below summarize the generic quickselect algorithm to find the top `k` elements with the largest score in an array using the function `f`. If we slightly change the partition function to move elements with a smaller score before the randomly selected pivot, keeping everything else the same, we can find the top `k` elements with the smallest scores in the array.

> **partition(\[ref\]arr, left, right)**
>
> -   **Step 1:** Set `pivot` = Randomly select an index between `left` and `right`
> -   **Step 2:** Set `pivotScore` = Call `f(arr\[pivot\])`
> -   **Step 3:** Swap `arr\[pivot\]` with `arr\[right\]`
> -   **Step 4:** Initialize `nextGreaterIndex` = `left`
> -   **Step 5:** Iterate from `left` to `right - 1` using `i` and do the following:
>     -   **Step 5.1:** Set `elementScore` = `f(arr\[i\])`
>     -   **Step 5.2:** If `elementScore` > `pivotScore` do the following:
>         -   **Step 5.2.1:** Swap `arr\[i\]` with `arr\[nextGreaterIndex\]`
>         -   **Step 5.2.2:** Increment `nextGreaterIndex`
> -   **Step 6:** Swap `arr\[nextGreaterIndex\]` with `arr\[right\]` to place pivot in its final position
> -   **Step 6:** Return `nextGreaterIndex`
>
> **quickselect(\[ref\]arr, left, right, k)**
>
> -   **Step 1:** If `left` >= `right`, return
> -   **Step 2:** Call `pivot` = `partition(arr, left, right)`
> -   **Step 3:** If `pivot` == `k - 1`, pivot is correctly positioned; return
> -   **Step 4:** Otherwise, If `pivot` > `k - 1`, recursively call `quickselect(arr, left, pivot - 1, k)`
> -   **Step 5:** Otherwise, recursively call `quickselect(arr, pivot + 1, right, k)`

## Implementaion

Given below is the recursive implementation of the generic quickselect algorithm to find the elements with the top `k` elements in the array with the largest scores using the function `f`.

C++

```cpp
#include <cmath>
#include <cstdlib>
#include <vector>

// Diagram: using namespace std;

class Solution {
public:

    // Function to partition the array based on comparison to pivot
    int partition(vector<int> &arr, int left, int right) {

        // Randomly select a pivot index between left and right
        int pivot = left + rand() % (right - left + 1);

        // 1. Calculate the score of the pivot element
        int pivotScore = f(arr[pivot]);

        // Move the pivot to the end
        swap(arr[pivot], arr[right]);

        // 2. Move elements around the pivot such that larger elements
        // come to the left
        int nextGreaterIndex = left;
        for (int i = left; i < right; i++) {
            int elementScore = f(arr[i]);
            // Elements with score greater than pivot come to left
            if (elementScore > pivotScore) {
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

    int f(int element) {
      // Stub implementation to calculate score
      return element;
    }

    vector<int> elementsWithTopKScores(vector<int> &arr, int k) {
        int n = arr.size();

        // Step 1: Perform Quickselect to position the elements with
        // the top k scores in range [0, k-1]
        quickselect(arr, 0, n - 1, k);

        // Step 2: First k elements are the elements with the top K scores
        return vector<int>(arr.begin(), arr.begin() + k);
    }
};
```

Java

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

// Diagram: class Solution {

// Diagram: private Random rand = new Random();

    // Function to partition the array based on comparison to pivot
    int partition(List<Integer> arr, int left, int right) {

        // Randomly select a pivot index between left and right
        int pivot = left + rand.nextInt(right - left + 1);

        // 1. Calculate the score of the pivot element
        int pivotScore = f(arr.get(pivot));

        // Move the pivot to the end
        Collections.swap(arr, pivot, right);

        // 2. Move elements around the pivot such that larger elements
        // come to the left
        int nextGreaterIndex = left;
        for (int i = left; i < right; i++) {
            int elementScore = f(arr.get(i));

            // Elements with score greater than pivot come to left
            if (elementScore > pivotScore) {
                Collections.swap(arr, nextGreaterIndex, i);
                nextGreaterIndex++;
            }

        // 3. Move pivot to its final position
        Collections.swap(arr, nextGreaterIndex, right);

        // nextGreaterIndex is now the final index of the pivotValue
        return nextGreaterIndex;
    }

    // Quickselect to find the Kth largest element
    void quickselect(List<Integer> arr, int left, int right, int k) {
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

    int f(int element) {
        // Stub implementation to calculate score
        return element;
    }

    List<Integer> elementsWithTopKScores(List<Integer> arr, int k) {
        int n = arr.size();

        // Step 1: Perform Quickselect to position the elements with
        // the top k scores in range [0, k-1]
        quickselect(arr, 0, n - 1, k);

        // Step 2: First k elements are the elements with the top K scores
        return new ArrayList<>(arr.subList(0, k));
    }

```

Typescript

```typescript
class Solution {
  // Function to partition the array based on comparison to pivot
  partition(arr: number[], left: number, right: number): number {

    // Randomly select a pivot index between left and right
    const pivot = left + Math.floor(Math.random() * (right - left + 1));

    // 1. Calculate the score of the pivot element
    const pivotScore = this.f(arr[pivot]);

    // Move the pivot to the end
    [arr[pivot], arr[right]] = [arr[right], arr[pivot]];

    // 2. Move elements around the pivot such that larger elements
    // come to the left
    let nextGreaterIndex = left;
    for (let i = left; i < right; i++) {
      const elementScore = this.f(arr[i]);

      // Elements with score greater than pivot come to left
      if (elementScore > pivotScore) {
        [arr[nextGreaterIndex], arr[i]] = [arr[i], arr[nextGreaterIndex]];
        nextGreaterIndex++;
      }

    // 3. Move pivot to its final position
    [arr[nextGreaterIndex], arr[right]] = [arr[right], arr[nextGreaterIndex]];

    // nextGreaterIndex is now the final index of the pivotValue
    return nextGreaterIndex;
  }

  // Quickselect to find the Kth largest element
  quickselect(arr: number[], left: number, right: number, k: number): void {
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

  f(element: number): number {
    // Stub implementation to calculate score
    return element;
  }

  elementsWithTopKScores(arr: number[], k: number): number[] {
    const n = arr.length;

    // Step 1: Perform Quickselect to position the elements with
    // the top k scores in range [0, k-1]
    this.quickselect(arr, 0, n - 1, k);

    // Step 2: First k elements are the elements with the top K scores
    return arr.slice(0, k);
  }
```

Javascript

```javascript
class Solution {

  // Function to partition the array based on comparison to pivot
  partition(arr, left, right) {

    // Randomly select a pivot index between left and right
    const pivot = left + Math.floor(Math.random() * (right - left + 1));

    // 1. Calculate the score of the pivot element
    const pivotScore = this.f(arr[pivot]);

    // Move the pivot to the end
    [arr[pivot], arr[right]] = [arr[right], arr[pivot]];

    // 2. Move elements around the pivot such that larger elements
    // come to the left
    let nextGreaterIndex = left;
    for (let i = left; i < right; i++) {
      const elementScore = this.f(arr[i]);
      // Elements with score greater than pivot come to left
      if (elementScore > pivotScore) {
        [arr[nextGreaterIndex], arr[i]] = [arr[i], arr[nextGreaterIndex]];
        nextGreaterIndex++;
      }

    // 3. Move pivot to its final position
    [arr[nextGreaterIndex], arr[right]] = [arr[right], arr[nextGreaterIndex]];

    // nextGreaterIndex is now the final index of the pivotValue
    return nextGreaterIndex;
  }

  // Quickselect to find the Kth largest element
  quickselect(arr, left, right, k) {
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

  f(element) {
    // Stub implementation to calculate score
    return element;
  }

  elementsWithTopKScores(arr, k) {
    const n = arr.length;

    // Step 1: Perform Quickselect to position the elements with
    // the top k scores in range [0, k-1]
    this.quickselect(arr, 0, n - 1, k);

    // Step 2: First k elements are the elements with the top K scores
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

        # 1. Calculate the score of the pivot element
        pivot_score: int = self.f(arr[pivot])

        # Move the pivot to the end
        arr[pivot], arr[right] = arr[right], arr[pivot]

        # 2. Move elements around the pivot such that larger elements
        # come to the left
        next_greater_index: int = left
        for i in range(left, right):
            element_score: int = self.f(arr[i])
            # Elements with score greater than pivot come to left
            if element_score > pivot_score:
                arr[next_greater_index], arr[i] = arr[i], arr[next_greater_index]
                next_greater_index += 1

        # 3. Move pivot to its final position
        arr[next_greater_index], arr[right] = arr[right], arr[next_greater_index]

        # next_greater_index is now the final index of the pivotValue
        return next_greater_index

    # Quickselect to find the Kth largest element
    def quickselect(self, arr: List[int], left: int, right: int, k: int) -> None:
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

    def f(self, element: int) -> int:
        # Stub implementation to calculate score
        return element

    def elements_with_top_k_scores(self, arr: List[int], k: int) -> List[int]:
        n: int = len(arr)

        # Step 1: Perform Quickselect to position the elements with
        # the top k scores in range [0, k-1]
        self.quickselect(arr, 0, n - 1, k)

        # Step 2: First k elements are the elements with the top K scores
        return arr[:k]
```

## Complexity Analysis

The generic quickselect algorithm uses the same partition and recursive selection steps as the quickselect algorithm, with the only difference being the use of the function `f` to calculate scores. If we assume the function `f` has a constant **O(1)** space and time complexity, the overall complexity of the generic algorithm will be the same as the quickselect algorithm.

> **Best case** - The first pivot is the element with the kth largest score
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

# Identifying the quickselect pattern

There are many problems where we need to find the top or bottom `k` elements in a dataset based on some complex scoring criteria. These are generally **medium** or **hard** problems where we need to define a scoring function to rank elements in a dataset. The scoring function may be stateless or stateful, depending on the complexity of the problem, and the goal is to find the elements with the top `k` or the bottom `k` scores.

If the problem statement or its solution follows the generic template below, it can be solved using the generic quickselect algorithm.

**Template:**

Given an array of data elements, find the elements with the top `k` or bottom `k` scores, where a function `f` computes the score of every element.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the generic quickselect algorithm.

> **Problem statement:** Given an integer array `arr`, an integer `k` and a `target`. Find the `k` closest elements to the `target`.
>
> And integer `x` is closer to `target` that `y` if:
>
> -   `|x-target|` < `|y-target|` OR
> -   `|x-target|` == `|y-target|` AND `x` < `y`

// Diagram: Find the k(3) closest elements to the target(5)

## The quickselect solution

We observe that the closeness of an element to the `target` is governed by a well-defined rule. If two elements `x` and `y` are different, the smaller of `|x - target | and | y - target |` will be closer to the target. However, if they are equal, the one with the smaller value will be closer to the target. And so, if we define the score of an element `x` as a tuple of `( | x - target| , x )`, we can compare the scores for each element to do the comparison according to the rule. The `k` closest values will be the ones with the **bottom(smallest)** `k` values of these scores.

We create a function `score` that takes as input an `element` in the array and the target, and returns a tuple with the value `( | element - target |, element )`

// Diagram: The score function returns the score of every element in the array.

The solution to the problem fits the template for the quickselect pattern.

**Template:**Given an array of data elements, find the elements with the bottom `k` scores, where a function `f` (returning tuple score) computes the score of every element.

We then run the generic quickselect algorithm on the array using the function `score` to get the score of every element.

We create a function `partition` that takes as input the array `arr` and two indices, `left` and `right`, representing the subarray within which the data must be partitioned and rearranges the array around a randomly chosen element based on the scores of every element using the function `score`. It rearranges the array such that all elements with a score less than the score of a randomly chosen element appear before it.

Next, we initialize a variable `nextSmallerIndex`, which marks the position where the next element with a score less than `pivotScore` should be placed. It is initialized to `left`, since this is where the first element with a lesser score should go.

To rearrange the elements, we iterate over the subarray from `left` to `right − 1` using a variable `i`. In each iteration, we calculate the score of `a[i]` in a variable `elementScore` using the function `score` and compare it with `pivotScore`. If `elementScore` is **less than** `pivotScore`, it belongs in the left partition. We therefore swap `arr[i]` with `arr[nextSmallerIndex]` and increment `nextSmallerIndex` to use it for the element with a greater score. If `elementScore` is greater than or equal to `pivotScore`, no action is needed, and we simply move on.

This way, at the end of all iterations, all elements with a score less than `pivotScore` appear before `nextSmallerIndex`, and all elements greater than or equal to it appear after. In the end, we swap `arr[right]` with `arr[nextSmallerIndex]` to place the pivot element into its correct (sorted, ascending by score) position. The function then returns `nextSmallerIndex`, which is the final index of the pivot.

// Diagram: Partition the array around a random pivot

We define a function `quickselect` that takes as input the array `arr`, two indices `left` and `right` representing the current search boundaries, and an integer `k` . If `left == right`, the subarray contains only one element, and no further partitioning is possible, so we return. Otherwise, we call the `partition` function passing it `left` and `right`. The `partition` function places a randomly selected element into its correct (sorted, ascending by score) position and returns its index, which we store in a variable `pivot`. 

We then check if `pivot == k - 1`, we return to the caller. If `pivot > k - 1`, we recursively call `quickselect` on `[left, pivot - 1]`, otherwise we recursively call `quickselect` on `[pivot + 1, right]`.

We call the `quickselect` function with the initial boundaries as `0` and `n-1`, where `n` is the size of the array, and at the end of all the recursive calls, the elements in the range `[0, k-1]` will be the `k` closest elements to the target.

// Diagram: Find the k(3) closest elements to the target(5)

The implementation of the generic quick select solution to solve the problem is given below.

C++

```cpp
#include <cstdlib>
#include <vector>
#include <cmath>
#include <algorithm>

// Diagram: using namespace std;

class Solution {
public:

    // Function to calculate the "score" of an element
    pair<int, int> score(int val, int target) {
        return { abs(val - target), val };
    }

    // Function to partition the array based on the absolute difference
    // to the target
    int partition(vector<int> &arr, int left, int right, int target) {

        // Randomly select a pivot index between left and right
        int pivot = left + rand() % (right - left + 1);

        // Get the pivot value and its score
        pair<int,int> pivotScore = score(arr[pivot], target);

        // Move the pivot to the end and update the index
        swap(arr[pivot], arr[right]);

        // Move elements around the pivot such that closer elements
        // come to the left
        int index = left;
        for (int i = left; i < right; i++) {

            // If the current element is closer to the target than the
            // pivot element, swap it with the element at index
            auto elementScore = score(arr[i], target);
            if ( elementScore < pivotScore) {
                swap(arr[index], arr[i]);
                index++;
            }

        // Move pivot to its final position
        swap(arr[index], arr[right]);
        return index;
    }

    // Quickselect to find the k closest elements
    void quickselect(
        vector<int> &arr,
        int left,
        int right,
        int k,
        int target
    ) {
        if (left == right) {
            return;
        }

        // Partition the array and get the pivot index
        int pivot = partition(arr, left, right, target);

        // If the pivot is at the k-th position (in 0-indexed)
        if (pivot == k - 1) {
            return;
        }

        // If k is less than the pivot index, search in the left half
        else if (k - 1 < pivot) {
            quickselect(arr, left, pivot - 1, k, target);
        }

        // Else if k is greater than the pivot index, search in the right
        // half
        else {
            quickselect(arr, pivot + 1, right, k, target);
        }

// Diagram: vector<int> kClosestElements(vector<int> &arr, int k, int target) {

        // Step 1: Perform Quickselect to find the k closest elements
        quickselect(arr, 0, arr.size() - 1, k, target);

        // Step 2: The first k elements will be the closest elements
        return vector<int>(arr.begin(), arr.begin() + k);
    }
};
```

Java

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

// Diagram: class Solution {

// Diagram: private Random rand = new Random();

    // Function to calculate the "score" of an element
    private int[] score(int val, int target) {
        return new int[]{Math.abs(val - target), val};
    }

    // Function to partition the array based on the absolute difference to the target
    private int partition(List<Integer> arr, int left, int right, int target) {

        // Randomly select a pivot index between left and right
        int pivot = left + rand.nextInt(right - left + 1);

        // Get the pivot value and its score
        int[] pivotScore = score(arr.get(pivot), target);

        // Move the pivot to the end and update the index
        Collections.swap(arr, pivot, right);

        // Move elements around the pivot such that closer elements come to the left
        int index = left;
        for (int i = left; i < right; i++) {

            // If the current element is closer to the target than the pivot element, swap it
            int[] elementScore = score(arr.get(i), target);
            // Compare the score tuples according to the rule
            if (elementScore[0] < pivotScore[0] || (elementScore[0] == pivotScore[0] && elementScore[1] < pivotScore[1])) {
                Collections.swap(arr, index, i);
                index++;
            }

        // Move pivot to its final position
        Collections.swap(arr, index, right);
        return index;
    }

    // Quickselect to find the k closest elements
    private void quickselect(List<Integer> arr, int left, int right, int k, int target) {
        if (left == right) {
            return;
        }

        // Partition the array and get the pivot index
        int pivot = partition(arr, left, right, target);

        // If the pivot is at the k-th position (in 0-indexed)
        if (pivot == k - 1) {
            return;
        }

        // If k is less than the pivot index, search in the left half
        else if (k - 1 < pivot) {
            quickselect(arr, left, pivot - 1, k, target);
        }

        // Else if k is greater than the pivot index, search in the right half
        else {
            quickselect(arr, pivot + 1, right, k, target);
        }

// Diagram: public List<Integer> kClosestElements(List<Integer> arr, int k, int target) {

        // Step 1: Perform Quickselect to find the k closest elements
        quickselect(arr, 0, arr.size() - 1, k, target);

        // Step 2: The first k elements will be the closest elements
        return new ArrayList<>(arr.subList(0, k));
    }

```

Typescript

```typescript
class Solution {

  // Function to calculate the "score" of an element
  score(val: number, target: number): number[] {
    return [Math.abs(val - target), val];
  }

  // Function to partition the array based on the absolute difference to the target
  partition(arr: number[], left: number, right: number, target: number): number {

    // Randomly select a pivot index between left and right
    const pivot = left + Math.floor(Math.random() * (right - left + 1));

    // Get the pivot value and its score
    const pivotScore = this.score(arr[pivot], target);

    // Move the pivot to the end and update the index
    [arr[pivot], arr[right]] = [arr[right], arr[pivot]];

    // Move elements around the pivot such that closer elements come to the left
    let index = left;
    for (let i = left; i < right; i++) {
```

Javascript

```javascript
class Solution {

  // Function to calculate the "score" of an element
  score(val, target) {
    return [Math.abs(val - target), val];
  }

  // Function to partition the array based on the absolute difference to the target
  partition(arr, left, right, target) {

    // Randomly select a pivot index between left and right
    const pivot = left + Math.floor(Math.random() * (right - left + 1));

    // Get the pivot value and its score
    const pivotScore = this.score(arr[pivot], target);

    // Move the pivot to the end and update the index
    [arr[pivot], arr[right]] = [arr[right], arr[pivot]];

    // Move elements around the pivot such that closer elements come to the left
    let index = left;
    for (let i = left; i < right; i++) {
```

Python

```python
import random
from typing import List, Tuple

class Solution:
    # Function to calculate the "score" of an element
    def score(self, val: int, target: int) -> Tuple[int, int]:
        return (abs(val - target), val)

    # Function to partition the array based on the absolute difference to the target
    def partition(self, arr: List[int], left: int, right: int, target: int) -> int:
        # Randomly select a pivot index between left and right
        pivot = left + random.randint(0, right - left)

        # Get the pivot value and its score
        pivotScore = self.score(arr[pivot], target)

        # Move the pivot to the end
        arr[pivot], arr[right] = arr[right], arr[pivot]

        # Move elements around the pivot such that closer elements come to the left
        index = left
        for i in range(left, right):
            elementScore = self.score(arr[i], target)
            # Compare the score tuple directly
            if elementScore < pivotScore:
                arr[index], arr[i] = arr[i], arr[index]
                index += 1

        # Move pivot to its final position
        arr[index], arr[right] = arr[right], arr[index]
        return index

    # Quickselect to find the k closest elements
    def quickselect(self, arr: List[int], left: int, right: int, k: int, target: int) -> None:
        if left == right:
            return

        # Partition the array and get the pivot index
        pivot = self.partition(arr, left, right, target)

        # If the pivot is at the k-th position (in 0-indexed)
        if pivot == k - 1:
            return

        # If k is less than the pivot index, search in the left half
        elif k - 1 < pivot:
            self.quickselect(arr, left, pivot - 1, k, target)

        # Else if k is greater than the pivot index, search in the right half
        else:
            self.quickselect(arr, pivot + 1, right, k, target)

    def kClosestElements(self, arr: List[int], k: int, target: int) -> List[int]:
        # Step 1: Perform Quickselect to find the k closest elements
        self.quickselect(arr, 0, len(arr) - 1, k, target)

        # Step 2: The first k elements will be the closest elements
        return arr[:k]
```

## Example problems

Most problems that fall under this category are**medium** or **hard**problems; a list of a few is given below.

> -   **[K closest elements](https://www.codeintuition.io/courses/sorting/PYZvDPNTwxquoKTCWlUhv)**
> -   **[K most frequent elements](https://www.codeintuition.io/courses/sorting/S3XXvpyz2gD_8-O0GU5fi)**

We will now solve these problems to gain a deeper understanding of the quickselect pattern.

***

# Kth smallest element

## Problem Statement

Given an array **arr** and a positive integer **k**, write a function to find and return the kth smallest element in this array.

You must use **quickselect algorithm** to solve this problem.

### Example 1

> -   **Input:** arr = \[5, 4, 2, 8\], k = 2
> -   **Output:** 4
> -   **Explanation:** 4 is the 2nd smallest element in the array.

### Example 2

> -   **Input:** arr = \[1, 2, 3, 4, 5\], k = 5
> -   **Output:** 5
> -   **Explanation:** 5 is the 5th smallest element in the array.

### Example 3

> -   **Input:** arr = \[7, 5, 9\], k = 3
> -   **Output:** 9
> -   **Explanation:** 9 is the 3rd smallest element in the array.

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

        // 2. Move elements around the pivot such that smaller elements
        // come to the left
        int nextSmallerIndex = left;
        for (int i = left; i < right; i++) {

            // Elements smaller than pivot come to left
            if (arr[i] < pivotValue) {
                swap(arr[nextSmallerIndex], arr[i]);
                nextSmallerIndex++;
            }
        }

        // 3. Move pivot to its final position
        swap(arr[nextSmallerIndex], arr[right]);

        // nextSmallerIndex is now the final index of the pivotValue
        return nextSmallerIndex;
    }

    // Quickselect to find the Kth smallest element
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

    int kthSmallestElement(vector<int> &arr, int k) {
        int n = arr.size();

        // Step 1: Perform Quickselect to position smallest k elements
        quickselect(arr, 0, n - 1, k);

        // Step 2: Return the k-th smallest element
        return arr[k - 1];
    }
};
```

***

# Median finder

## Problem Statement

Given an unsorted array **arr**, write a function to find and return the median of all the elements from this array.

The median of an array is the **middle** value when sorted, and if the array has an even number of elements, it is the average of the two middle values truncated to an integer.

You must use a **heap** to solve this problem.

### Example 1

> -   **Input:** arr = \[5, 4, 2, 8, 9\]
> -   **Output:** 5
> -   **Explanation:** When the array is sorted \[2, 4, 5, 8, 9\], 5 is the middle value, so it is the median.

### Example 2

> -   **Input:** arr = \[5, 8, 1, 2\]
> -   **Output:** 3
> -   **Explanation:** When the array is sorted \[1, 2, 5, 8\], the middle values are 2 and 5. Their average is 3.5, which is truncated to 3 as the median.

### Example 3

> -   **Input:** arr = \[-3, -4\]
> -   **Output:** -3
> -   **Explanation:** When the array is sorted \[-4, -3\], the middle values are -4 and -3. Their average is -3.5, which is truncated to -3 as the median.

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

        // 2. Move elements around the pivot such that smaller elements
        // come to the left
        int nextSmallerIndex = left;
        for (int i = left; i < right; i++) {

            // Elements smaller than pivot come to left
            if (arr[i] < pivotValue) {
                swap(arr[nextSmallerIndex], arr[i]);
                nextSmallerIndex++;
            }
        }

        // 3. Move pivot to its final position
        swap(arr[nextSmallerIndex], arr[right]);

        // nextSmallerIndex is now the final index of the pivotValue
        return nextSmallerIndex;
    }

    // Quickselect to find the Kth smallest element
    int quickselect(vector<int> &arr, int left, int right, int k) {
        if (left >= right) {
            return arr[left];
        }

        // Partition the array and get the pivot index
        int pivot = partition(arr, left, right);

        // If the pivot is at the k-th position (0-indexed),
        // we've found the k-th smallest element and can return it.
        // Note: We are **not using k-1** here because k is already
        // treated as a 0-based index in this implementation. In other
        // words, k = 0 corresponds to the smallest element, k = 1 to the
        // second smallest, and so on.
        if (pivot == k) {
            return arr[pivot];
        }

        // If the pivot's index is greater than k,
        // the k-th smallest element must be in the left partition
        else if (pivot > k) {
            return quickselect(arr, left, pivot - 1, k);
        }

        // If k is greater than the pivot index, search in the right half
        else {
            return quickselect(arr, pivot + 1, right, k);
        }
    }

    int findMedian(vector<int> &arr) {
        int n = arr.size();

        // If odd, return the middle element
        if (n % 2 == 1) {
            return quickselect(arr, 0, n - 1, n / 2);
        }

        // If even, take the average of the two middle elements and round
        // up
        int leftMid = quickselect(arr, 0, n - 1, n / 2 - 1);
        int rightMid = quickselect(arr, 0, n - 1, n / 2);

        // Round down the average of the two middle elements
        return (leftMid + rightMid) / 2;
    }
};
```

***

# K closest elements

## Problem Statement

Given an integer array **arr** sorted in ascending order, a non-negative integer **k**, and an integer **target**, write a function to find and return the k closest elements to the target. You can return the answer in **any order**.

An integer `x` is closer to the target than an integer `y` if:

// Diagram: |x - target| < |y - target|, or

// Diagram: |x - target| == |y - target| and x < y

You must use **quickselect algorithm** to solve this problem.

### Example 1

> -   **Input:** arr = \[1, 2, 3, 4, 5, 6\], k = 3, target = 4
> -   **Output:** \[4, 3, 5\]
> -   **Explanation:** Above are the three closest elements to 4.

### Example 2

> -   **Input:** arr = \[1, 4, 5, 6, 7, 8\], k = 4, target = 3
> -   **Output:** \[4, 1, 5, 6\]
> -   **Explanation:** Above are the four closest elements to 3.

### Example 3

> -   **Input:** arr = \[1, 5, 8, 10, 12, 13\], k = 3, target = 10
> -   **Output:** \[10, 8, 12\]
> -   **Explanation:** Above are the three closest elements to 10.

## Solution

```cpp
#include <cstdlib>

using namespace std;

class Solution {
public:

    // Function to partition the array based on the absolute difference
    // to the target
    int partition(vector<int> &arr, int left, int right, int target) {

        // Randomly select a pivot index between left and right
        int pivot = left + rand() % (right - left + 1);

        // 1. Get the pivot value and its absolute difference to the
        // target
        int pivotVal = arr[pivot];
        int pivotDiff = abs(pivotVal - target);

        // Move the pivot to the end and update the index
        swap(arr[pivot], arr[right]);

        // 2. Move elements around the pivot such that closer elements
        // come to the left
        int nextClosestIndex = left;
        for (int i = left; i < right; i++) {

            // If the current element is closer to the target than the
            // pivot element, swap it with the element at
            // nextClosestIndex
            if (abs(arr[i] - target) < pivotDiff ||
                (abs(arr[i] - target) == pivotDiff &&
                 arr[i] < pivotVal)) {
                swap(arr[nextClosestIndex], arr[i]);
                nextClosestIndex++;
            }
        }

        // 3. Move pivot to its final position
        swap(arr[nextClosestIndex], arr[right]);
        return nextClosestIndex;
    }

    // Quickselect to find the k closest elements
    void quickselect(
        vector<int> &arr,
        int left,
        int right,
        int k,
        int target
    ) {
        if (left == right) {
            return;
        }

        // Partition the array and get the pivot index
        int pivot = partition(arr, left, right, target);

        // If the pivot is at the k-th position (in 0-indexed)
        if (k - 1 == pivot) {
            return;
        }

        // If pivot is greater than k - 1, search in the left half
        else if (pivot > k - 1) {
            quickselect(arr, left, pivot - 1, k, target);
        }

        // If k is greater than the pivot index, search in the right half
        else {
            quickselect(arr, pivot + 1, right, k, target);
        }
    }

    vector<int> kClosestElements(vector<int> &arr, int k, int target) {

        // Step 1: Perform Quickselect to find the k closest elements
        quickselect(arr, 0, arr.size() - 1, k, target);

        // Step 2: The first k elements will be the closest elements
        return vector<int>(arr.begin(), arr.begin() + k);
    }
};
```

***

# K most frequent elements

## Problem Statement

Given an array **arr** and a non-negative integer **k**, write a function to find and return the top k frequent elements in this array. You can return the answer in **any order**.

You must use **quickselect** **algorithm** to solve this problem.

### Example 1

> -   **Input:** arr = \[1, 2, 2, 3, 3, 3\], k = 2
> -   **Output:** \[2, 3\]
> -   **Explanation:** 3 and 2 are the most frequent and the second most frequent elements respectively.

### Example 2

> -   **Input:** arr = \[1, 5, 6, 6\], k = 1
> -   **Output:** \[6\]
> -   **Explanation:** 6 is the most frequent element.

### Example 3

> -   **Input:** arr = \[1\], k = 1
> -   **Output:** \[1\]
> -   **Explanation:** 1 is the most frequent element.

## Solution

```cpp
#include <algorithm>
#include <cstdlib>
#include <unordered_map>

using namespace std;

class Solution {
public:

    // Partition function to rearrange the elements based on their
    // frequency
    int partition(
        vector<int> &unique,
        int left,
        int right,
        unordered_map<int, int> &frequency
    ) {

        // Random pivot index
        int pivot = left + rand() % (right - left + 1);

        // 1. Get the frequency of the pivot element
        int pivotFreq = frequency[unique[pivot]];

        // Move pivot to the end
        swap(unique[pivot], unique[right]);

        // 2. Move all more frequent elements to the left
        int nextHigherFrequencyIndex = left;
        for (int i = left; i < right; i++) {

            // If the frequency of the current element is greater than
            // the frequency of the pivot element, swap them
            if (frequency[unique[i]] > pivotFreq) {
                swap(unique[nextHigherFrequencyIndex], unique[i]);
                nextHigherFrequencyIndex += 1;
            }
        }

        // 3. Move pivot to its final position
        swap(unique[right], unique[nextHigherFrequencyIndex]);
        return nextHigherFrequencyIndex;
    }

    // Quickselect to find the k-th most frequent element
    void quickselect(
        vector<int> &unique,
        int left,
        int right,
        int k,
        unordered_map<int, int> &frequency
    ) {

        // Only one element left in the range
        if (left == right) {
            return;
        }

        // Partition the array and get the pivot index
        int pivot = partition(unique, left, right, frequency);

        // If the pivot is at the k-th position (in 0-indexed)
        if (k - 1 == pivot) {
            return;
        }

        // If pivot is greater than k - 1, search in the left half
        else if (pivot > k - 1) {
            quickselect(unique, left, pivot - 1, k, frequency);
        }

        // If k is greater than the pivot index, search in the right half
        else {
            quickselect(unique, pivot + 1, right, k, frequency);
        }
    }

    vector<int> kMostFrequentElements(vector<int> &arr, int k) {

        // Hash map to store frequency of each element
        unordered_map<int, int> frequency;

        // Step 1: Count frequency of each element
        for (int n : arr) {
            frequency[n]++;
        }

        // Array to keep track of unique elements
        vector<int> unique;

        // Step 2: Store the unique elements in the vector
        for (auto &element : frequency) {
            unique.push_back(element.first);
        }

        // Step 3: Find the k-th most frequent element
        // We want the k-th largest element by frequency
        quickselect(unique, 0, unique.size() - 1, k, frequency);

        // Step 4: Return the top k frequent elements
        return vector<int>(unique.begin(), unique.begin() + k);
    }
};
```
