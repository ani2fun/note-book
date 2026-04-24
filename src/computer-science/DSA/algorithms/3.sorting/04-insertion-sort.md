# Introduction to insertion sort

Insertion sort is a sorting algorithm that builds the final sorted list by simply moving the items to their correct positions one at a time. It's not the most efficient algorithm and follows a brute-force approach, but it's simple to understand and implement.

**Is insertion sort faster than bubble and selection sorts?**

In practical application, insertion sort is a better performer than bubble or selection sorts, as, on average, it makes fewer comparisons to sort data

## Example

An intuitive example of insertion sort can be seen when arranging a hand of cards in ascending order.

// Diagram: Random deck of cards

When holding a set of cards, you typically pick one card at a time and compare it with the cards already in your hand. If the card is smaller than the ones before it, you reposition it to the correct spot among the sorted cards.

// Diagram: Move the card to its correct position

While placing the card in its proper position, you shift all larger cards one position to the right to make space. This ensures that the sorted portion of the hand remains in order as you insert each new card.

// Diagram: The card moved to its correct position

Thereafter, repeat the process for the next out-of-order card, inserting it into the correct position within the sorted portion by comparing it with the cards to its left.

// Diagram: Move the next card to its correct position

You continue this process, picking and inserting each card in turn, until all the cards are arranged in ascending order.

// Diagram: The next card moved to the correct position

By gradually building a sorted portion at the front of the hand, insertion sort efficiently organises the entire set.

// Diagram: All cards are sorted

> -   **Step 1:** Find the card that is out of order relative to the cards around it.
> -   **Step 2:** Remove the card from the deck.
> -   **Step 3:** Find where this card belongs.
> -   **Step 4:** Shift all the cards from that spot to one place to the right.
> -   **Step 5:** Insert the removed card on the new spot.
> -   **Step 6:** Repeat the above until all the cards are in their correct positions.

// Diagram: Sorting a deck of cards using insertion sort

## Advantages

Even though insertion sort is not the most efficient algorithm, it has several advantages. It is simple to understand and implement. It works well for small or nearly sorted datasets and requires only a small amount of extra memory.

> -   **Simplicity:** Insertion sort is quite simple to understand and implement, making it an ideal choice for learning about sorting.
> -   **Efficiency:** In practice, insertion sort is more efficient than other quadratic sorting algorithms, such as selection sort and bubble sort, when the data set is small.
> -   **Adaptive:** The efficiency of insertion sort increases if the input list is partially sorted. The time complexity of the sort reduces to **O(k\*N)** from **O(N^2)** when each element in the list is no more than k places away from its sorted position.
> -   **Stable:** Insertion sort is stable i.e. it does not change the relative order of equal values in the list
> -   **In-place:** Insertion sort can sort the input list without allocating new memory for the algorithm.

## Limitations

Insertion sort has significant limitations for large or randomly ordered datasets.

> -   **Inefficient:** Compared to other sorting algorithms insertion sort is not ideal for sorting large data sets as it presents an average time complexity of **O(N^2)**.

***

# Understanding insertion sort algorithm

The strategy from the earlier example could be used to create an algorithm. To explain this algorithm, we will take an array as an input list, but the same algorithm can be applied to any list data structure.

## Algorithm

Like bubble and selection sorts, insertion sort conceptually divides the input array into two subarrays: a **sorted subarray** and an **unsorted subarray**. Initially, the first element of the array is considered sorted.

// Diagram: Sorted and unsorted subarrays

During each iteration, the algorithm takes the first element from the unsorted subarray and inserts it into its correct position within the sorted subarray. To do this, it compares the element with the elements in the sorted subarray, moving from right to left.

// Diagram: Compare the first unsorted element with the last sorted element

If the unsorted element is smaller than a sorted element, the sorted element is shifted one position to the right. This shifting continues until the correct position for the unsorted element is found, at which point it is inserted.

// Diagram: Move the first unsorted element to the correct position

At this point, the first element from the unsorted subarray has reached its correct position in the sorted subarray.

// Diagram: Unsorted element reached the correct position in the sorted subarray

By repeating this process, the sorted subarray grows, and the unsorted subarray shrinks, until the entire array is sorted.

// Diagram: The array is now sorted

When implementing this algorithm based on the above approach, the array is sorted by gradually building a sorted portion from left to right. At each step, an element from the unsorted section is inserted into its correct position within the sorted subarray. The algorithm uses two nested loops controlled by variables `i` and `j`.

The outer loop initializes `i` at `1` and continues until `n - 1`. At the start of each iteration, the element at index `i` is selected as the `key`. The subarray to the left of index `i` (from `0` to `i - 1`) is already sorted, and the goal of the current iteration is to insert the key into its correct position within this sorted portion.

**Why do we start the outer loop from 1 and not 0?**

We start `i` from `1` because a single element at index `0` is already considered sorted by definition. There is no need to insert the first element into a sorted portion, so the algorithm begins with the second element.

// Diagram: The outer loop iterates from 1 to n - 1

The inner loop begins by initializing `j` to `i - 1`. This allows the algorithm to compare the `key` with elements in the sorted portion of the array. While `j >= 0`  and `arr[j] > key`, the algorithm shifts `arr[j]` one position to the right by assigning it to `arr[j + 1]`. This shifting process creates space for the `key` to be inserted into the correct position. After each shift, `j` is decremented by `1` so that the algorithm can continue comparing the `key` with the next element to the left.

**Why do we use a loop with the condition `j >= 0` and `arr[j] > key`?**

The condition `j >= 0` ensures that comparisons stay within the bounds of the array, preventing access to invalid indices. The condition `arr[j] > key` ensures that only elements larger than the `key` are shifted. As soon as an element smaller than or equal to the `key` is encountered, the correct position for the `key` has been found.

// Diagram: The inner loop shifts arr\[j\] while j ≥ 0 and arr\[j\] > key

Once the inner loop ends, the algorithm inserts the `key` at index `j + 1`, which is the correct position in the sorted portion of the array. At this point, all elements to the left of `j + 1` are less than or equal to the `key`, and all elements to the right have already been shifted accordingly.

// Diagram: At the end of the inner loop, the key is placed in its correct position

With each iteration of the outer loop, the sorted portion of the array grows by one element from the left to right, and the unsorted portion shrinks accordingly. After all iterations from`1` to `n - 1`are complete, the entire array is sorted in ascending order.

// Diagram: The sorted subarray grows and the unsorted subarray shrinks

The full dry run of the algorithm is given below.

// Diagram: Sorting an array in ascending order using insertion sort

> **Algorithm**
>
> -   **Step 1:** Iterate through the array using \`i\` from \`1\` to \`n-1\`
>     -   **Step 1.1:** Select \`arr\[i\]\` as the \`key\`
>     -   **Step 1.2:** Initialize \`j = i - 1\` to compare the \`key\` with the sorted portion
>     -   **Step 1.3:** While \`j >= 0\` and \`arr\[j\] > key\`
>         -   **Step 1.3.1:** Shift \`arr\[j\]\` one position to the right \`arr\[j + 1\] = arr\[j\]\`
>         -   **Step 1.3.2:** Decrement \`j\` by \`1\`
>     -   **Step 1.4:** Insert the key at its correct position \`arr\[j + 1\] = key\`

## Implementation

This implementation of insertion sort iterates through the array, treating the first element as a sorted portion. For each subsequent element (the "key"), it compares with elements in the sorted portion and shifts larger elements to the right to make space. The key is then inserted into its correct position. This process repeats until the entire array is sorted. The algorithm is simple, stable, and works efficiently for small or nearly sorted arrays.

C++

```cpp
using namespace std;

class Solution {
public:
    void insertionSort(vector<int> &arr) {

        // Get the size of the array
        int n = arr.size();

// Diagram: for (int i = 1; i < n; i++) {

            // Select the current element as the key
            int key = arr[i];

            // Start comparing with the previous element
            int j = i - 1;

            // Move elements of arr[0..i-1], that are greater than the
            // key, to one position ahead of their current position
            while (j >= 0 && arr[j] > key) {

                // Shift the elements one position to the right
                arr[j + 1] = arr[j];
                j--;
            }

            // Insert the key in its correct position
            arr[j + 1] = key;
        }
};
```

Java

```java
class Solution {
    public void insertionSort(int[] arr) {

        // Get the length of the array
        int n = arr.length;

// Diagram: for (int i = 1; i < n; i++) {

            // Select the current element as the key
            int key = arr[i];

            // Start comparing with the previous element
            int j = i - 1;

            // Move elements of arr[0..i-1], that are greater than the
            // key, to one position ahead of their current position
            while (j >= 0 && arr[j] > key) {

                // Shift the elements one position to the right
                arr[j + 1] = arr[j];
                j--;
            }

            // Insert the key in its correct position
            arr[j + 1] = key;
        }
```

Typescript

```typescript
export class Solution {
    insertionSort(arr: number[]): void {

        // Get the length of the array
        const n = arr.length;

// Diagram: for (let i = 1; i < n; i++) {

            // Select the current element as the key
            const key = arr[i];

            // Start comparing with the previous element
            let j = i - 1;

            // Move elements of arr[0..i-1], that are greater than the
            // key, to one position ahead of their current position
            while (j >= 0 && arr[j] > key) {

                // Shift the elements one position to the right
                arr[j + 1] = arr[j];
                j--;
            }

            // Insert the key in its correct position
            arr[j + 1] = key;
        }
```

Javascript

```javascript
export class Solution {
    insertionSort(arr) {

        // Get the length of the array
        const n = arr.length;
        for (let i = 1; i < n; i++) {

            // Select the current element as the key
            const key = arr[i];

            // Start comparing with the previous element
            let j = i - 1;

            // Move elements of arr[0..i-1], that are greater than the
            // key, to one position ahead of their current position
            while (j >= 0 && arr[j] > key) {

                // Shift the elements one position to the right
                arr[j + 1] = arr[j];
                j--;
            }

            // Insert the key in its correct position
            arr[j + 1] = key;
        }
```

Python

```python
from typing import List

class Solution:
    def insertion_sort(self, arr: List[int]) -> None:

        # Get the length of the array
        n: int = len(arr)

        for i in range(1, n):

            # Select the current element as the key
            key: int = arr[i]

            # Start comparing with the previous element
            j: int = i - 1

            # Move elements of arr[0..i-1], that are greater than the
            # key, to one position ahead of their current position
            while j >= 0 and arr[j] > key:

                # Shift the elements one position to the right
                arr[j + 1] = arr[j]
                j -= 1

            # Insert the key in its correct position
            arr[j + 1] = key
```

## Complexity analysis

When insertion sort is applied to a list of size **N**, each iteration compares the current element with elements in the sorted portion of the list and shifts elements as needed to insert the key into its correct position.

The best-case scenario occurs when the list is already sorted. In this case, each key only needs to be compared with the last element of the sorted sublist, and no shifts are required. As a result, the algorithm performs only **N-1** comparisons and no swaps, giving a linear time complexity of **O(N)**.

// Diagram: Best case: When the array is already sorted

The average-case scenario occurs when the elements are in random order. On average, each key may need to be compared with half of the sorted sublist, and elements may be shifted accordingly. This results in quadratic time complexity **O(N^2)**. Despite this, for small lists (typically ten or fewer), insertion sort can be faster than more complex algorithms like quicksort due to its lower overhead. The exact threshold for “small” depends on the system and implementation.

// Diagram: Average case: When the array is not sorted

The worst-case scenario occurs when the list is sorted in reverse order. Here, each key must be compared with all elements in the sorted sublist, requiring the maximum number of shifts in each iteration. This also results in quadratic time complexity, **O(N^2)**.

// Diagram: Worst case: When the array is sorted in reverse order

Since insertion sort modifies the input list without creating a new one, the space complexity remains **constant**, i.e., **O(1)**.

> **Best case** - The input list is sorted in the desired order.
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N)**
>
> **Average case** - The input list is a mix of sorted and unsorted elements.
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N^2)**
>
> **Worst case** - The input list is sorted in reverse order.
>
> -   Space complexity - **O(1)**
> -   Time complexity - **O(N^2)**

***

# Insertion sort

## Problem Statement

Given an integer array **arr**, write a function that sorts the given array in non-decreasing order. You must do it **in place**.

You must use **insertion sort algorithm** to sort this array.

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
    void insertionSort(vector<int> &arr) {

        // Get the size of the array
        int n = arr.size();

        for (int i = 1; i < n; i++) {

            // Select the current element as the key
            int key = arr[i];

            // Start comparing with the previous element
            int j = i - 1;

            // Move elements of arr[0..i-1], that are greater than the
            // key, to one position ahead of their current position
            while (j >= 0 && arr[j] > key) {

                // Shift the elements one position to the right
                arr[j + 1] = arr[j];
                j--;
            }

            // Insert the key in its correct position
            arr[j + 1] = key;
        }
    }
};
```
