# Introduction to three way quicksort

Three-way quicksort is an enhanced version of the traditional quicksort algorithm, designed specifically to handle datasets containing many duplicate values.

In the classic quicksort algorithm, the list is partitioned into two parts: one with elements less than the pivot and the other with elements greater than the pivot. However, if the list contains many duplicates, this approach can be inefficient because it may lead to unbalanced partitions. Three-way quicksort addresses this issue by partitioning the list into three parts:

> -   Elements **less than** the pivot
> -   Elements **equal to** the pivot
> -   Elements **greater than** the pivot

It only applies the algorithm to the first and last parts, ignoring the middle part. This allows the algorithm to handle lists with many duplicate elements more efficiently.

## Example

A practical example of this idea is sorting currency coins by denomination. Imagine you have thousands of coins and 5–10 different values.

// Diagram: Large number of coins with only a few denominations

If you use traditional quicksort, you may repeatedly compare the same denominations, which wastes time, especially when many coins share the same value.

// Diagram: Traditional quicksort repeatedly recompares duplicate values

With the three-way quicksort approach, you select a pivot element and divide the coins into three groups instead:

> -   Coins with denominations **less than** the pivot value
> -   Coins with denominations **equal to** the pivot value
> -   Coins with denominations **greater than** the pivot value

// Diagram: Three way partition: Less, Equal, and Greater than the pivot

Once partitioned, you only sort the first and third groups further, while the middle group is already in the correct position relative to the pivot and does not require additional work.

This strategy drastically reduces the number of comparisons required as the dataset shrinks more efficiently at each step, making it far more scalable when duplicates are common.

// Diagram: Repeat the process on the first and last partitions

By continuing this way, all the coins will eventually be sorted in the correct order.

// Diagram: All coins are now sorted

> -   **Step 1:** Choose a random denomination from the leftover coins and make it the pivot.
> -   **Step 2:** Create three partitions: first for notes with denominations less than the pivot, second for coins with denominations equal to the pivot, and third for coins with denominations greater than the pivot.
> -   **Step 3:** Apply steps 1 and 2 to the first and third partitions.

// Diagram: Sort coins in ascending using three-way quicksort

## Advantages

Three-way quicksort is highly efficient when the dataset contains many duplicates. By grouping elements into less-than, equal-to, and greater-than comparisons with the pivot, it reduces unnecessary comparisons and improves performance compared to traditional quicksort.

> -   **Efficient for input with many duplicates:** Compared to the traditional quicksort, the three-way quicksort is particularly efficient for lists with many duplicate elements.
> -   **Stable:** Unlike the traditional quicksort, the three-wat quicksort is stable, i.e., it does not change the relative order of equal values in the list.
> -   **In-place:** Three-way quicksort can sort the input list itself without needing to allocate new memory for the algorithm.

## Limitations

While Three way quicksort has many advantages, it comes with certain limiations as well:

> -   **Inefficient:** Three-way quicksort is not as efficient for small datasets, as the partitioning step's overhead can outweigh the algorithm's efficiency benefits.

***

# Understanding three way quicksort algorithm

Now that we understand the importance of the three-way quicksort and its advantages and limitations, let's delve into the algorithm used to implement it.

**Why is this algorithm also called the Dutch national flag quicksort?**The algorithm is called Dutch national flag quicksort because its partitioning step is similar to the Dutch National Flag Sort. Elements less than the pivot are tracked by the left pointer, elements equal to the pivot by the mid pointer, and elements greater than the pivot by the right pointer. This three-way division mirrors how the Dutch National Flag sort separates values into small, mid, and large regions.

## Algorithm

The three-way quicksort algorithm operates on an input array containing at least two elements, similar to the standard quicksort. The process begins by selecting a pivot element from the array, which serves as a reference for partitioning the other elements.

// Diagram: Select a random element as the pivot

During the partitioning step, three-way quicksort divides the array into three consecutive segments rather than two. It returns three indices: the **first segment** contains elements **smaller than the pivot**, the **middle segment** contains elements **equal to the pivot**, and the **last segment** contains elements **greater than the pivot**. The middle segment can be ignored in further recursive calls since these elements are already in their correct positions.

// Diagram: Smaller elements go left, equal element to the mid, larger elements go right

After partitioning, the algorithm recursively applies the same procedure only to the subarrays containing elements smaller than and greater than the pivot. This process continues until all subarrays contain either a single element or are empty.

// Diagram: Repeat the process on the first and last partitions with new pivots

Once all recursive calls are complete, the array becomes fully sorted.

// Diagram: The array is now sorted

Following the approach described above, the algorithm sorts the array using a divide-and-conquer strategy, optimized to handle arrays with many duplicate elements. The sorting process divides the array into three regions: elements smaller than the pivot, elements equal to the pivot, and elements greater than the pivot. The algorithm has three components

### Entry point

The `threeWayQuickSort` function serves as the entry point for the three-way quicksort algorithm. It initiates the sorting process by calling the recursive procedure `quicksort(arr, 0, arr.size() - 1)`, where `0` corresponds to the index of the first element and `arr.size() - 1` corresponds to the index of the last element in the array. These values are passed to the `left` and `right` variables of the recursive procedure, establishing the initial boundaries of the array to be sorted.

// Diagram: Left and right boundaries of the array

### Recursive procedure

The recursive procedure receives the array along with its start and end boundaries, specified by the variables `left` and `right`, respectively. It begins by checking whether `left < right` to ensure that the subarray contains at least two elements. If not, the subarray is already sorted and the function returns.

If `left < right`, the procedure calls `partition(arr, left, right, i, j)`, which rearranges the elements around a pivot into three regions and returns two indices, `i` and `j`. These indices mark the starting and ending boundaries of the pivot element, such that all elements between `i` and `j` are equal to the pivot. More formally:

> -   Elements from \`left\` to \`i\` are **smaller than** the pivot.
> -   Elements from \`i + 1\` to \`j - 1\` are **equal** to the pivot.
> -   Elements from \`j\` to \`right\` are **greater than** the pivot.

// Diagram: The smaller, middle, unsorted and largest sections in the array

After partitioning, the algorithm recursively sorts the subarrays to the left and right of the pivot.

> -   \`quicksort(arr, left, i)\` - sort elements smaller than the pivot
> -   \`quicksort(arr, j, right)\` - sort elements greater than the pivot

**Why are the recursive calls split around the pivot region?**

The partitioning ensures that all elements equal to the `pivot` are already in their correct positions. By recursively sorting only the regions smaller and larger than the pivot, the algorithm avoids unnecessary comparisons and swaps for duplicate values, improving efficiency, especially when the array contains many repeated elements.

// Diagram: Recursively apply the algorithm to the subarrays on each side of the pivot

As the recursive calls continue and reach their base cases, all subarrays are sorted. Once the initial recursive call completes, the entire array is sorted in ascending order.

### Partition procedure with dutch national flag sort 

The partition function is responsible for reorganizing the subarray into three sections: less than, equal to, and greater than the `pivot`. This procedure is **directly inspired by the Dutch National Flag (DNF) algorithm**, which also maintains three sections using three pointers.

The algorithm begins by handling small subarrays with `0` or `1` element. For larger subarrays, it initializes `mid = left` and selects the `pivot` as the last element `arr[right]`. The three pointers have the same roles as in DNF:

> -   \`left\` - Marks the end of the smaller-than-pivot section.
> -   \`mid\` - Traverses the array to evaluate elements.
> -   \`right\` - Marks the beginning of the greater-than-pivot section.

// Diagram: The smaller, equal, unsorted and larger sections in the array

Similar to the **DNF sort**, the main loop runs while `mid <= right`, and depending on the value of `arr[mid]`, it makes one of three decisions.

### 1\. arr\[mid\] < pivot

When the element at `mid` index is less then the pivot element, it needs to be moved to the front section of the array. This is done by swapping it with the element at the `left` pointer, which marks the boundary of the already sorted smallest section. 

> Take the following steps:
>
> -   Swap \`arr\[mid\]\` with \`arr\[left\]\` to place the smallest value into its correct section.
> -   The \`mid\` pointer is incremented to continue scanning the next element.
> -   The \`left\` pointer is also incremented by one, expanding the sorted section of smallest elements

Corresponds to the **0-region** handling in **DNF**, expanding the smaller section.

// Diagram: The element is in the smallest category (less than the pivot)

### 2\. arr\[mid\] == pivot

When the element at `mid` index is equal to the pivot element, it belongs to the middle section. It is already in its correct section relative to the `left` and `right` pointers. Therefore, no swap is needed.

> Take the following steps:
>
> -   The \`mid\` pointer is incremented to continue scanning the next element.

Corresponds to the **1-region** handling in **DNF**, leaving the equal section in place.

**Why do we handle elements equal to the pivot differently?**

Elements equal to the pivot do not need to be moved, just like in DNF, which keeps the middle region intact. This reduces unnecessary swaps and preserves stability within the pivot region.

// Diagram: The element is in the middle category (equal to the pivot)

### 3\. arr\[mid\] > pivot

When the element at `mid` index is greater than the pivot,  it belongs to the largest section. It must be moved to the end section of the array. This is achieved by swapping it with the element at the `right` pointer, which marks the boundary of the already sorted largest section. 

> Take the following steps:
>
> -   Swap \`arr\[mid\]\` with the element at the \`arr\[right\]\` to move the largest value toward its correct section.
> -   The \`right\` pointer is decremented by one, shrinking the unsorted section from the end.

Corresponds to the **2-region** handling in **DNF**, expanding the larger section.

// Diagram: The element is in the largest category (larger than the pivot)

After the loop, the indices `i = left - 1` (last element smaller than the pivot) and `j = mid` (first element greater than the pivot) are set. These indices define the boundaries of the pivot region for the recursive calls.

// Diagram: Sorting an array in ascending order using three-way quicksort

> **Algorithm**
>
> **partition(\[ref\] arr, left, right, \[ref\] i, \[ref\] j)**
>
> -   **Step 1:** If the subarray has 0 or 1 element, optionally swap the two elements if out of order
> -   **Step 2:** Initialise \`mid = left\`
> -   **Step 3:** Choose the last element \`arr\[right\]\` as the pivot
> -   **Step 4:** While \`mid <= right\`, do the following:
>     -   **Step 4.1:** If \`arr\[mid\] < pivot\`
>         -   **Step 4.1.1:** Swap \`arr\[mid\]\` with \`arr\[left\]\`
>         -   **Step 4.1.2:** Increment \`mid\` to move to the next element
>         -   **Step 4.1.3:** Increment \`left\` to move to the next element
>     -   **Step 4.2:** If \`arr\[mid\] == pivot\`
>         -   **Step 4.2.1:** Increment \`mid\` to move to the next element
>     -   **Step 4.3:** If \`arr\[mid\] > pivot\`
>         -   **Step 4.3.1:** Swap \`arr\[mid\]\` with \`arr\[right\]\`
>         -   **Step 4.3.2:** Decrement \`right\` to move to the previous element
> -   **Step 5:** Set \`i = left - 1\` (last element smaller than pivot)
> -   **Step 6:** Set \`j = mid\` (first element greater than pivot)
>
> **quicksort(\[ref\] arr, left, right)**
>
> -   **Step 1:** If \`left < right\`, do the following
>     -   **Step 1.1:** Call \`partition(arr, left, right, i, j)\` to partition the array
>     -   **Step 1.2:** Recursively call \`quicksort(arr, left, i)\` on the left subarray
>     -   **Step 1.3:** Recursively call \`quicksort(arr, j, right)\` on the right subarray
>
> **threeWayQuickSort(\[ref\] arr)**
>
> -   **Step 1:** Call \`quicksort(arr, 0, arr.size() - 1)\` to sort the entire array

## Implementation

The three-way quicksort algorithm is similar to quicksort, with only a subtle difference. During the partitioning step, the three-way quicksort returns not only the index of the pivot element but also two other indices: `i` and `j`. 

C++

```cpp
using namespace std;

class Solution {
public:
    void partition(
        vector<int> &arr,
        int left,
        int right,
        int &i,
        int &j
    ) {

        // If the subarray has 0 or 1 element, no need to partition
        if (right - left <= 1) {

            // If the last element is smaller than the first element,
            // swap them
            if (arr[right] < arr[left]) {
                swap(arr[right], arr[left]);
            }

            i = left;
            j = right;
            return;
        }

// Diagram: int mid = left;

        // Choosing the last element as the pivot
        int pivot = arr[right];
        while (mid <= right) {

            // If the current element is smaller than the pivot, move
            // elements smaller than pivot to the left side
            if (arr[mid] < pivot) {
                swap(arr[left], arr[mid]);

                // Move mid to the next element
                mid++;

                // Move left to the next element
                left++;
            }

            // If the current element is equal to the pivot, move to the
            // next element
            else if (arr[mid] == pivot) {
                mid++;
            }

            // If the current element is greater than the pivot, move
            // elements greater than pivot to the right side
            else if (arr[mid] > pivot) {
                swap(arr[mid], arr[right]);

                // Move right to the previous element
                right--;
            }

        // Index of the last element smaller than pivot
        i = left - 1;

        // Index of the first element greater than pivot
        j = mid;
    }

    void quicksort(vector<int> &arr, int left, int right) {
        if (left >= right) {
            return;
        }

        int i, j;
        partition(arr, left, right, i, j);

        // Recursively sort the subarrays
        quicksort(arr, left, i);
        quicksort(arr, j, right);
    }

    void threeWayQuickSort(vector<int> &arr) {
        int n = arr.size();
        quicksort(arr, 0, n - 1);
    }
};
```

Java

```java
class Solution {
    private void partition(
        int[] arr,
        int left,
        int right,
        int[] i,
        int[] j
    ) {

        // If the subarray has 0 or 1 element, no need to partition
        if (right - left <= 1) {

            // If the last element is smaller than the first element,
            // swap them
            if (arr[right] < arr[left]) {
                int temp = arr[right];
                arr[right] = arr[left];
                arr[left] = temp;
            }

            i[0] = left;
            j[0] = right;
            return;
        }

// Diagram: int mid = left;

        // Choosing the last element as the pivot
        int pivot = arr[right];
        while (mid <= right) {

            // If the current element is smaller than the pivot, move
            // elements smaller than pivot to the left side
            if (arr[mid] < pivot) {
                int temp = arr[mid];
                arr[mid] = arr[left];
                arr[left] = temp;

                // Move mid to the next element
                mid++;

                // Move left to the next element
                left++;
            }

            // If the current element is equal to the pivot, move to the
            // next element
            else if (arr[mid] == pivot) {
                mid++;
            }

            // If the current element is greater than the pivot, move
            // elements greater than pivot to the right side
            else if (arr[mid] > pivot) {
                int temp = arr[mid];
                arr[mid] = arr[right];
                arr[right--] = temp;

                // Move right to the previous element
                right--;
            }

        // Index of the last element smaller than pivot
        i[0] = left - 1;

        // Index of the first element greater than pivot
        j[0] = mid;
    }

    private void quicksort(int[] arr, int left, int right) {
        if (left >= right) {
            return;
        }

        int[] i = new int[1];
        int[] j = new int[1];
        partition(arr, left, right, i, j);

        // Recursively sort the subarrays
        quicksort(arr, left, i[0]);
        quicksort(arr, j[0], right);
    }

    public void threeWayQuickSort(int[] arr) {
        int n = arr.length;
        quicksort(arr, 0, n - 1);
    }
```

Typescript

```typescript
export class Solution {
    partition(
        arr: number[],
        left: number,
        right: number
    ): [number, number] {

        // If the subarray has 0 or 1 element, no need to partition
        if (right - left <= 1) {

            // If the last element is smaller than the first element,
            // swap them
            if (arr[right] < arr[left]) {
                [arr[right], arr[left]] = [arr[left], arr[right]];
            }
            return [left, right];
        }

// Diagram: let mid: number = left;

        // Choosing the last element as the pivot
        const pivot: number = arr[right];
        while (mid <= right) {

            // If the current element is smaller than the pivot, move
            // elements smaller than pivot to the left side
            if (arr[mid] < pivot) {
                [arr[mid], arr[left]] = [arr[left], arr[mid]];

                // Move mid to the next element
                mid++;

                // Move left to the next element
                left++;
            }

            // If the current element is equal to the pivot, move to the
            // next element
            else if (arr[mid] === pivot) {
                mid++;
            }

            // If the current element is greater than the pivot, move
            // elements greater than pivot to the right side
            else if (arr[mid] > pivot) {
                [arr[mid], arr[right]] = [arr[right], arr[mid]];

                // Move right to the previous element
                right--;
            }

        // Index of the last element smaller than pivot
        const i: number = left - 1;

        // Index of the first element greater than pivot
        const j: number = mid;
        return [i, j];
    }

    quicksort(arr: number[], left: number, right: number): void {
        if (left >= right) {
            return;
        }

// Diagram: const [i, j] = this.partition(arr, left, right);

        // Recursively sort the subarrays
        this.quicksort(arr, left, i);
        this.quicksort(arr, j, right);
    }

    threeWayQuickSort(arr: number[]): void {
        const n: number = arr.length;
        this.quicksort(arr, 0, n - 1);
    }
```

Javascript

```javascript
export class Solution {
    partition(arr, left, right) {

        // If the subarray has 0 or 1 element, no need to partition
        if (right - left <= 1) {

            // If the last element is smaller than the first element,
            // swap them
            if (arr[right] < arr[left]) {
                [arr[right], arr[left]] = [arr[left], arr[right]];
            }

            return [left, right];
        }
        let mid = left;

        // Choosing the last element as the pivot
        const pivot = arr[right];
        while (mid <= right) {

            // If the current element is smaller than the pivot, move
            // elements smaller than pivot to the left side
            if (arr[mid] < pivot) {
                [arr[mid], arr[left]] = [arr[left], arr[mid]];

                // Move mid to the next element
                mid++;

                // Move left to the next element
                left++;
            }

            // If the current element is equal to the pivot, move to the
            // next element
            else if (arr[mid] === pivot) {
                mid++;
            }

            // If the current element is greater than the pivot, move
            // elements greater than pivot to the right side
            else if (arr[mid] > pivot) {
                [arr[mid], arr[right]] = [arr[right], arr[mid]];

                // Move right to the previous element
                right--;
            }

        // Index of the last element smaller than pivot
        const i = left - 1;

        // Index of the first element greater than pivot
        const j = mid;
        return [i, j];
    }
    quicksort(arr, left, right) {
        if (left >= right) {
            return;
        }
        const [i, j] = this.partition(arr, left, right);

        // Recursively sort the subarrays
        this.quicksort(arr, left, i);
        this.quicksort(arr, j, right);
    }
    threeWayQuickSort(arr) {
        const n = arr.length;
        this.quicksort(arr, 0, n - 1);
    }
```

Python

```python
from typing import List, Tuple

class Solution:
    def partition(
        self, arr: List[int], left: int, right: int
    ) -> Tuple[int, int]:

        # If the subarray has 0 or 1 element, no need to partition
        if right - left <= 1:

            # If the last element is smaller than the first element, swap
            # them
            if arr[right] < arr[left]:
                arr[right], arr[left] = arr[left], arr[right]
            return left, right

// Diagram: mid: int = left

        # Choosing the last element as the pivot
        pivot: int = arr[right]
        while mid <= right:

            # If the current element is smaller than the pivot, move
            # elements smaller than pivot to the left side
            if arr[mid] < pivot:
                arr[mid], arr[left] = arr[left], arr[mid]

                # Move mid to the next element
                mid += 1

                # Move left to the next element
                left += 1

            # If the current element is equal to the pivot, move to the
            # next element
            elif arr[mid] == pivot:
                mid += 1

            # If the current element is greater than the pivot, move
            # elements greater than pivot to the right side
            elif arr[mid] > pivot:
                arr[mid], arr[right] = arr[right], arr[mid]

                # Move right to the previous element
                right -= 1

        # Index of the last element smaller than pivot
        i: int = left - 1

        # Index of the first element greater than pivot
        j: int = mid
        return i, j

    def quicksort(self, arr: List[int], left: int, right: int) -> None:
        if left >= right:
            return

// Diagram: i, j = self.partition(arr, left, right)

        # Recursively sort the subarrays
        self.quicksort(arr, left, i)
        self.quicksort(arr, j, right)

    def three_way_quick_sort(self, arr: List[int]) -> None:
        n: int = len(arr)
        self.quicksort(arr, 0, n - 1)
```

## Complexity analysis

The three-way quicksort algorithm generally shares the same runtime characteristics as classic quicksort, but it performs more efficiently when the input contains many duplicate values. By grouping elements equal to the pivot into a middle section and skipping them in further recursion, it reduces unnecessary comparisons.

In the best case, the pivot divides the array into nearly equal-sized subarrays, and a large number of elements are equal to the pivot. Three-way partitioning groups these equal elements together in a single step, significantly reducing the number of recursive calls. As a result, the recursion remains balanced, and the time complexity is **O(N\*****log N)**.

// Diagram: Best case: Many elements equal the pivot, with the rest evenly split

In the average case, when the pivot is chosen randomly, three-way quick sort typically produces fairly balanced partitions while efficiently handling duplicate elements by placing them in the middle partition. This reduces unnecessary comparisons and recursive calls, leading to an average time complexity close to **O(N\*log N)**.

// Diagram: Average case: The pivot splits the array into fairly balanced parts

In the worst case, if the pivot is consistently chosen poorly and most elements are either smaller or larger than the pivot (with very few or no duplicates), the partitions become highly unbalanced. In this scenario, three-way quick sort behaves similarly to standard quick sort, and the time complexity can degrade to **O(N^2)**.

// Diagram: Worst case: The pivot creates highly unbalanced partitions

The space complexity of three-way quicksort is **O(logN)** due to the recursive calls on the sublists. Each recursive call requires a constant amount of space for the function call stack, and the depth of the call stack is **O(logN)** in the average and worst cases.

> **Best case** - The list is always partitioned into nearly equal-sized sublists.
>
> -   Space complexity - **O(logN)**
> -   Time complexity - **O(N\*logN)**
>
> **Average case** - The pivot is randomly chosen, which often partitions the input list into nearly equal-sized sublists.
>
> -   Space complexity - **O(logN)**
> -   Time complexity - **O(N\*logN)**
>
> **Worst case** - The input list is completely or nearly sorted in the reverse order.
>
> -   Space complexity - **O(logN)**
> -   Time complexity - **O(N^2)**

***

# Three way quicksort

## Problem Statement

Given an integer array **arr**, write a function that sorts the given array in non-decreasing order. You must do it **in place**.

You must use **three way** **quicksort algorithm** to sort this array.

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
    void partition(
        vector<int> &arr,
        int left,
        int right,
        int &i,
        int &j
    ) {

        // If the subarray has 0 or 1 element, no need to partition
        if (right - left <= 1) {

            // If the last element is smaller than the first element,
            // swap them
            if (arr[right] < arr[left]) {
                swap(arr[right], arr[left]);
            }

            i = left;
            j = right;
            return;
        }

        int mid = left;

        // Choosing the last element as the pivot
        int pivot = arr[right];
        while (mid <= right) {

            // If the current element is smaller than the pivot, move
            // elements smaller than pivot to the left side
            if (arr[mid] < pivot) {
                swap(arr[left], arr[mid]);

                // Move mid to the next element
                mid++;

                // Move left to the next element
                left++;
            }

            // If the current element is equal to the pivot, move to the
            // next element
            else if (arr[mid] == pivot) {
                mid++;
            }

            // If the current element is greater than the pivot, move
            // elements greater than pivot to the right side
            else if (arr[mid] > pivot) {
                swap(arr[mid], arr[right]);

                // Move right to the previous element
                right--;
            }
        }

        // Index of the last element smaller than pivot
        i = left - 1;

        // Index of the first element greater than pivot
        j = mid;
    }

    void quicksort(vector<int> &arr, int left, int right) {
        if (left >= right) {
            return;
        }

        int i, j;
        partition(arr, left, right, i, j);

        // Recursively sort the subarrays
        quicksort(arr, left, i);
        quicksort(arr, j, right);
    }

    void threeWayQuickSort(vector<int> &arr) {
        int n = arr.size();
        quicksort(arr, 0, n - 1);
    }
};
```
