# 8. Three-Way Quicksort

You ended the Quicksort lesson with a haunting demonstration: quicksort on `[5, 5, 5, 5, ..., 5]` runs in `O(n²)` time. Lomuto's two-way partition can't handle duplicates — the comparison `arr[i] < pivot` is never true for equal elements, so the partition becomes maximally unbalanced.

You ended the Dutch National Flag Sort lesson with the antidote: a three-way partition that classifies each element as `< pivot`, `== pivot`, or `> pivot`, putting equal-to-pivot elements in a contiguous middle region that's already in its final sorted position.

**This file marries the two.** Three-way quicksort uses Dutch National Flag's partition as quicksort's partition step. The result: an algorithm that handles arrays with many duplicates in *linear* time while preserving quicksort's `O(n log n)` average for unique-element inputs.

By the end of this lesson you'll know how to compose the two algorithms, why the recursion only needs to descend into the outer two regions (`<` and `>`), why the middle region is "free" sorting, and the precise conditions under which three-way quicksort dramatically beats two-way quicksort.

## Table of contents

1. [Why two-way quicksort fails on duplicates](#why-two-way-quicksort-fails-on-duplicates)
2. [Understanding three-way quicksort](#understanding-three-way-quicksort)
3. [The partition returns two boundaries](#the-partition-returns-two-boundaries)
4. [Implementation](#implementation)
5. [Complexity analysis](#complexity-analysis)
6. [Three-way quicksort problem](#three-way-quicksort-problem)

***

# Why Two-Way Quicksort Fails on Duplicates

> **Course:** DSA › Algorithms › Sorting › Three-Way Quicksort

Recall Lomuto's partition from the Quicksort lesson:

```
boundary = left
for i in [left, right):
    if arr[i] < pivot_val:        # ← strict less-than
        swap(arr[boundary], arr[i])
        boundary++
swap(arr[boundary], arr[right])    # park pivot
return boundary
```

The condition `arr[i] < pivot_val` is *strictly* less than. Equal elements skip the swap — they stay in the right region. After the partition, the `boundary` index ends up at `left`, the partition is `[empty | pivot | rest]`, and the recursive call sorts a problem of size `n - 1`.

Now imagine an array of `n` identical elements. Every partition reduces the problem by exactly one element. **Recursion depth: `n`. Time complexity: `O(n²)`.** Stack overflow on large inputs.

```d2
direction: down

input: "Input: [5, 5, 5, 5, 5, 5]" {style.fill: "#fecaca"; style.stroke: "#dc2626"}
p1: "Lomuto pivot=5: partition → [empty | 5 | 5, 5, 5, 5, 5]"
p2: "Recurse on [5, 5, 5, 5, 5] → [empty | 5 | 5, 5, 5, 5]"
p3: "Recurse on [5, 5, 5, 5] → ..."
end: "...n levels of recursion → O(n²) time, O(n) stack" {style.fill: "#fecaca"; style.stroke: "#dc2626"}

input -> p1 -> p2 -> p3 -> end
```

<p align="center"><strong>Two-way quicksort's pathology on all-duplicates input. Each partition reduces by 1; recursion goes <code>n</code> levels deep.</strong></p>

This isn't a contrived edge case. Any real-world dataset with even moderate duplication suffers — sorting an array of categorical data (1000 unique categories among 1,000,000 records), sorting strings with common prefixes, sorting a column of mostly-zero values. Two-way quicksort doesn't *fail* on these inputs (it produces the correct answer), but its performance collapses.

---

## The Fix in One Sentence

**Use a three-way partition (Dutch flag) instead of a two-way partition.** The middle region (equal-to-pivot elements) is already in its final sorted position; recurse only on the outer two regions.

For all-duplicates input: the entire array goes into the middle region in *one* partition. No recursion needed. `O(n)` total.

For mixed input with some duplicates: the middle region absorbs the duplicates; recursion only sees unique-or-different elements. Performance improves proportionally to how many duplicates exist.

For unique-element input: the middle region has exactly one element (the pivot); behaviour is identical to two-way quicksort.

---

## Key Takeaway

Two-way quicksort wastes work on duplicate-heavy input because equal-to-pivot elements end up in one of the recursive calls. Three-way quicksort fixes this by making the equal region its own non-recursive group. Now we'll see exactly how it works.

***

# Understanding Three-Way Quicksort

> **Course:** DSA › Algorithms › Sorting › Three-Way Quicksort

Three-way quicksort is two-way quicksort with one change: the partition step splits into *three* regions instead of two.

After the partition, the array looks like:

```
[ < pivot | == pivot | > pivot ]
   left      mid        right
```

The `< pivot` region needs further sorting. The `> pivot` region needs further sorting. The `== pivot` region is already sorted (all elements are equal; their order doesn't matter). Recurse only on the outer two.

```d2
direction: down

before: "Before partition" {
  grid-rows: 1
  grid-columns: 8
  grid-gap: 0
  a0: "7"
  a1: "5"
  a2: "5"
  a3: "1"
  a4: "5"
  a5: "8"
  a6: "5"
  a7: "3"
}

after: "After 3-way partition (pivot=5)" {
  grid-rows: 1
  grid-columns: 8
  grid-gap: 0
  a0: "1" {style.fill: "#fecaca"; style.stroke: "#dc2626"}
  a1: "3" {style.fill: "#fecaca"; style.stroke: "#dc2626"}
  a2: "5" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a3: "5" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a4: "5" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a5: "5" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a6: "7" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
  a7: "8" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
}

before -> after: 3-way partition
recurse: "Recurse on [<] and [>]; skip [==]"
after -> recurse
```

<p align="center"><strong>Three-way partition lays out the array in three regions. The middle region is already sorted (all equal). Recursion descends into the outer two only.</strong></p>

---

## The Recursive Driver

```
function quicksort(arr, left, right):
    if left >= right:
        return                                 # base case: 0 or 1 element

    i, j = three_way_partition(arr, left, right)   # i = end of <, j = start of >

    quicksort(arr, left, i)                    # sort the < region
    quicksort(arr, j, right)                   # sort the > region
    # the == region [i+1..j-1] needs no further work
```

The partition returns *two* boundaries — `i` and `j` — defining the three regions. The middle region `[i+1..j-1]` is skipped by the recursion.

---

## What Changes vs Two-Way Quicksort?

Three changes:
1. **Partition is three-way** (Dutch flag style) instead of two-way (Lomuto).
2. **Partition returns two indices** instead of one.
3. **Recursion has two calls** but neither one descends into the equal region.

Everything else — random pivot selection, base case, in-place mutation — is identical to two-way quicksort. The complexity changes are explained below.

> *Predict before reading on — for an array of <code>n</code> identical elements, what's three-way quicksort's time complexity?*

`O(n)`. The first partition puts every element in the middle region; both recursive calls hit the base case (`left >= right`) immediately. One pass of the partition, total work `O(n)`. Compared to two-way's `O(n²)` on the same input — a quadratic-to-linear speedup.

---

## Strengths and Limitations

| Strength | Detail |
|---|---|
| **Linear on duplicate-heavy input** | `O(n)` when many elements equal the pivot. |
| **Same average as two-way quicksort** | `O(n log n)` on unique-element input. |
| **In-place** | `O(log n)` recursion stack only. |
| **Robust pivot handling** | Works correctly on all-equal arrays, mostly-equal arrays, etc. |

| Limitation | Detail |
|---|---|
| **Not stable** | Long-distance swaps in the partition flip equal elements' order — though equal elements are indistinguishable, so this rarely matters. |
| **`O(n²)` worst case still possible** | If the pivot is always the smallest or largest element on truly unique input. Random pivot selection mitigates this. |
| **More complex than two-way** | Slightly larger constant factor on inputs with no duplicates. |

In practice, three-way quicksort is what most modern libraries actually implement (often called "dual-pivot" quicksort, which is a refinement of three-way). Java's `Arrays.sort(int[])` is dual-pivot quicksort. Rust's `slice::sort_unstable` is PDQsort, which uses three-way partitioning when duplicates are detected.

---

## Key Takeaway

Three-way quicksort: same recursive driver as two-way, but with a three-way partition. Linear time on duplicate-heavy input; same `O(n log n)` average for unique inputs. The standard production sort. Now we'll formalise the partition.

***

# The Partition Returns Two Boundaries

> **Course:** DSA › Algorithms › Sorting › Three-Way Quicksort

The partition step is structurally identical to Dutch National Flag (the Dutch National Flag Sort lesson), with one twist: instead of comparing against the constants `0`, `1`, `2`, we compare against the *pivot value*. Let's walk through it.

---

## The Partition Algorithm

Pick a pivot (typically the rightmost element, `arr[right]`). Maintain three pointers:
- `left` — boundary of the `< pivot` region (everything before `left` is `< pivot`).
- `mid` — current element under inspection.
- `right` — boundary of the `> pivot` region (everything after `right` is `> pivot`).

Run the loop while `mid <= right`. For each `arr[mid]`:
- If `arr[mid] < pivot`: swap with `arr[left]`, advance both `left` and `mid`.
- If `arr[mid] == pivot`: just advance `mid`.
- If `arr[mid] > pivot`: swap with `arr[right]`, decrement `right` (don't advance `mid`).

When the loop terminates, the array's three regions are laid out:
- `[start..left-1]` contains `< pivot`.
- `[left..mid-1]` contains `== pivot`.
- `[mid..end]` contains `> pivot`.

The partition returns two boundaries: `i = left - 1` (last index of `<`) and `j = mid` (first index of `>`).

---

## A Walkthrough

`arr = [7, 5, 5, 1, 5, 8, 5, 3]` (n = 8). Pivot is `arr[right] = 3` (last element). Let's trace.

Wait — using `arr[right]` directly as the pivot complicates things because the rightmost element gets swapped during partitioning. The cleaner approach is to **read the pivot value first**, then partition.

Let's choose `pivot = 5` (a randomly-selected pivot, just for demonstration).

```
Initial: arr = [7, 5, 5, 1, 5, 8, 5, 3]
left = 0, mid = 0, right = 7

mid=0, arr[0]=7. 7 > 5 → swap with arr[7], right--
  arr = [3, 5, 5, 1, 5, 8, 5, 7]
  left = 0, mid = 0, right = 6

mid=0, arr[0]=3. 3 < 5 → swap with arr[0] (self), left++, mid++
  arr = [3, 5, 5, 1, 5, 8, 5, 7]
  left = 1, mid = 1, right = 6

mid=1, arr[1]=5. == 5 → mid++
  left = 1, mid = 2, right = 6

mid=2, arr[2]=5. == 5 → mid++
  left = 1, mid = 3, right = 6

mid=3, arr[3]=1. 1 < 5 → swap with arr[1], left++, mid++
  arr = [3, 1, 5, 5, 5, 8, 5, 7]
  left = 2, mid = 4, right = 6

mid=4, arr[4]=5. == 5 → mid++
  left = 2, mid = 5, right = 6

mid=5, arr[5]=8. 8 > 5 → swap with arr[6], right--
  arr = [3, 1, 5, 5, 5, 5, 8, 7]
  left = 2, mid = 5, right = 5

mid=5, arr[5]=5. == 5 → mid++
  left = 2, mid = 6, right = 5

mid (6) > right (5) → loop exits
```

Final: `arr = [3, 1, 5, 5, 5, 5, 8, 7]`. Regions: `[3, 1]` < 5 | `[5, 5, 5, 5]` == 5 | `[8, 7]` > 5. The middle region is sorted (all duplicates collapsed). Recursion descends only into `[3, 1]` and `[8, 7]`.

```d2
direction: down

result: "Result of three-way partition" {
  grid-rows: 1
  grid-columns: 8
  grid-gap: 0
  a0: "3" {style.fill: "#fecaca"; style.stroke: "#dc2626"}
  a1: "1" {style.fill: "#fecaca"; style.stroke: "#dc2626"}
  a2: "5" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a3: "5" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a4: "5" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a5: "5" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a6: "8" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
  a7: "7" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
}

label: "Recurse on [3, 1] (red, indices 0-1) and [8, 7] (green, indices 6-7).\nSkip [5, 5, 5, 5] (yellow, already sorted)."
```

<p align="center"><strong>The partition's output. Four duplicate <code>5</code>s collapse into one un-recursed region; the recursive driver only descends into the smaller red and green parts.</strong></p>

---

## Key Takeaway

Three-way partition is Dutch National Flag with `pivot` instead of `1` as the middle category. It returns two boundaries; the recursion descends into the outer two regions and skips the middle. Now the implementation.

***

# Implementation

> **Course:** DSA › Algorithms › Sorting › Three-Way Quicksort

We implement two functions: `partition` (three-way, returning two boundary indices) and `quicksort` (the recursive driver).

<div class="lang-tabs">

```pseudocode
function threeWayQuickSort(arr):
    sort(arr, 0, length(arr) − 1)

function sort(arr, left, right):
    if left ≥ right:
        return
    (lt, gt) ← partition3(arr, left, right)   # arr[lt..gt] = pivot region (locked)
    sort(arr, left, lt − 1)                    # < pivot
    sort(arr, gt + 1, right)                   # > pivot

function partition3(arr, left, right):
    pivot ← arr[random integer in [left, right]]
    lt ← left                                  # arr[left..lt−1] < pivot
    gt ← right                                 # arr[gt+1..right] > pivot
    i ← left                                   # arr[lt..i−1] = pivot
    while i ≤ gt:
        if arr[i] < pivot:
            swap arr[lt] and arr[i]
            lt ← lt + 1
            i ← i + 1
        else if arr[i] > pivot:
            swap arr[i] and arr[gt]
            gt ← gt − 1
        else:                                  # arr[i] = pivot
            i ← i + 1
    return (lt, gt)
```

```python,editable
import random
from typing import List, Tuple

class Solution:
    def three_way_quick_sort(self, arr: List[int]) -> None:
        self._sort(arr, 0, len(arr) - 1)

    def _sort(self, arr: List[int], left: int, right: int) -> None:
        if left >= right:
            return
        i, j = self._partition(arr, left, right)
        self._sort(arr, left, i)
        self._sort(arr, j, right)

    def _partition(self, arr: List[int], left: int, right: int) -> Tuple[int, int]:
        pivot_idx = random.randint(left, right)
        pivot = arr[pivot_idx]
        l, mid, r = left, left, right                # work-pointers
        while mid <= r:
            if arr[mid] < pivot:
                arr[l], arr[mid] = arr[mid], arr[l]
                l += 1
                mid += 1
            elif arr[mid] == pivot:
                mid += 1
            else:                                    # arr[mid] > pivot
                arr[mid], arr[r] = arr[r], arr[mid]
                r -= 1
        return l - 1, mid                            # last index of <, first index of >


if __name__ == "__main__":
    arr = [7, 5, 5, 1, 5, 8, 5, 3]
    Solution().three_way_quick_sort(arr)
    print(arr)   # [1, 3, 5, 5, 5, 5, 7, 8]
```

```java,editable
import java.util.Random;

public class Solution {
    private final Random rand = new Random();

    public void threeWayQuickSort(int[] arr) {
        sort(arr, 0, arr.length - 1);
    }

    private void sort(int[] arr, int left, int right) {
        if (left >= right) return;
        int[] bounds = partition(arr, left, right);
        sort(arr, left, bounds[0]);
        sort(arr, bounds[1], right);
    }

    private int[] partition(int[] arr, int left, int right) {
        int pivotIdx = left + rand.nextInt(right - left + 1);
        int pivot = arr[pivotIdx];
        int l = left, mid = left, r = right;
        while (mid <= r) {
            if (arr[mid] < pivot) {
                swap(arr, l, mid);
                l++; mid++;
            } else if (arr[mid] == pivot) {
                mid++;
            } else {
                swap(arr, mid, r);
                r--;
            }
        }
        return new int[]{l - 1, mid};
    }

    private void swap(int[] arr, int i, int j) {
        int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }

    public static void main(String[] args) {
        int[] arr = {7, 5, 5, 1, 5, 8, 5, 3};
        new Solution().threeWayQuickSort(arr);
        for (int x : arr) System.out.print(x + " ");
        System.out.println();
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

void partition3(int *arr, int left, int right, int *outI, int *outJ) {
    int pivot = arr[left + rand() % (right - left + 1)];
    int l = left, mid = left, r = right;
    while (mid <= r) {
        if (arr[mid] < pivot) {
            swap(&arr[l], &arr[mid]); l++; mid++;
        } else if (arr[mid] == pivot) {
            mid++;
        } else {
            swap(&arr[mid], &arr[r]); r--;
        }
    }
    *outI = l - 1;
    *outJ = mid;
}

void sort3(int *arr, int left, int right) {
    if (left >= right) return;
    int i, j;
    partition3(arr, left, right, &i, &j);
    sort3(arr, left, i);
    sort3(arr, j, right);
}

void three_way_quick_sort(int *arr, int n) {
    sort3(arr, 0, n - 1);
}

int main(void) {
    int arr[] = {7, 5, 5, 1, 5, 8, 5, 3};
    int n = 8;
    three_way_quick_sort(arr, n);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\n");
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <cstdlib>

class Solution {
public:
    void threeWayQuickSort(std::vector<int>& arr) {
        sort(arr, 0, (int) arr.size() - 1);
    }

    void sort(std::vector<int>& arr, int left, int right) {
        if (left >= right) return;
        auto [i, j] = partition3(arr, left, right);
        sort(arr, left, i);
        sort(arr, j, right);
    }

    std::pair<int, int> partition3(std::vector<int>& arr, int left, int right) {
        int pivot = arr[left + rand() % (right - left + 1)];
        int l = left, mid = left, r = right;
        while (mid <= r) {
            if (arr[mid] < pivot) {
                std::swap(arr[l], arr[mid]); l++; mid++;
            } else if (arr[mid] == pivot) {
                mid++;
            } else {
                std::swap(arr[mid], arr[r]); r--;
            }
        }
        return {l - 1, mid};
    }
};

int main() {
    std::vector<int> arr = {7, 5, 5, 1, 5, 8, 5, 3};
    Solution{}.threeWayQuickSort(arr);
    for (int x : arr) std::cout << x << ' ';
    std::cout << '\n';
}
```

```scala,editable
import scala.util.Random

class Solution {
  def threeWayQuickSort(arr: Array[Int]): Unit = {
    sort(arr, 0, arr.length - 1)
  }

  private def sort(arr: Array[Int], left: Int, right: Int): Unit = {
    if (left >= right) return
    val (i, j) = partition3(arr, left, right)
    sort(arr, left, i)
    sort(arr, j, right)
  }

  private def partition3(arr: Array[Int], left: Int, right: Int): (Int, Int) = {
    val pivot = arr(left + Random.nextInt(right - left + 1))
    var l = left; var mid = left; var r = right
    while (mid <= r) {
      if (arr(mid) < pivot) {
        val t = arr(l); arr(l) = arr(mid); arr(mid) = t
        l += 1; mid += 1
      } else if (arr(mid) == pivot) {
        mid += 1
      } else {
        val t = arr(mid); arr(mid) = arr(r); arr(r) = t
        r -= 1
      }
    }
    (l - 1, mid)
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    val arr = Array(7, 5, 5, 1, 5, 8, 5, 3)
    new Solution().threeWayQuickSort(arr)
    println(arr.mkString(" "))
  }
}
```

```typescript,editable
class Solution {
    threeWayQuickSort(arr: number[]): void {
        this._sort(arr, 0, arr.length - 1);
    }

    private _sort(arr: number[], left: number, right: number): void {
        if (left >= right) return;
        const [i, j] = this._partition(arr, left, right);
        this._sort(arr, left, i);
        this._sort(arr, j, right);
    }

    private _partition(arr: number[], left: number, right: number): [number, number] {
        const pivotIdx = left + Math.floor(Math.random() * (right - left + 1));
        const pivot = arr[pivotIdx];
        let l = left, mid = left, r = right;
        while (mid <= r) {
            if (arr[mid] < pivot) {
                [arr[l], arr[mid]] = [arr[mid], arr[l]]; l++; mid++;
            } else if (arr[mid] === pivot) {
                mid++;
            } else {
                [arr[mid], arr[r]] = [arr[r], arr[mid]]; r--;
            }
        }
        return [l - 1, mid];
    }
}

const arr: number[] = [7, 5, 5, 1, 5, 8, 5, 3];
new Solution().threeWayQuickSort(arr);
console.log(arr);
```

```go,editable
package main

import (
    "fmt"
    "math/rand"
)

func partition3(arr []int, left, right int) (int, int) {
    pivot := arr[left+rand.Intn(right-left+1)]
    l, mid, r := left, left, right
    for mid <= r {
        switch {
        case arr[mid] < pivot:
            arr[l], arr[mid] = arr[mid], arr[l]
            l++
            mid++
        case arr[mid] == pivot:
            mid++
        default:
            arr[mid], arr[r] = arr[r], arr[mid]
            r--
        }
    }
    return l - 1, mid
}

func sort3(arr []int, left, right int) {
    if left >= right {
        return
    }
    i, j := partition3(arr, left, right)
    sort3(arr, left, i)
    sort3(arr, j, right)
}

func threeWayQuickSort(arr []int) {
    sort3(arr, 0, len(arr)-1)
}

func main() {
    arr := []int{7, 5, 5, 1, 5, 8, 5, 3}
    threeWayQuickSort(arr)
    fmt.Println(arr)
}
```

```rust,editable
use rand::Rng;

fn partition3(arr: &mut Vec<i32>, left: i64, right: i64) -> (i64, i64) {
    let pivot = arr[(left + rand::thread_rng().gen_range(0..=(right - left))) as usize];
    let mut l = left; let mut mid = left; let mut r = right;
    while mid <= r {
        if arr[mid as usize] < pivot {
            arr.swap(l as usize, mid as usize);
            l += 1; mid += 1;
        } else if arr[mid as usize] == pivot {
            mid += 1;
        } else {
            arr.swap(mid as usize, r as usize);
            r -= 1;
        }
    }
    (l - 1, mid)
}

fn sort3(arr: &mut Vec<i32>, left: i64, right: i64) {
    if left >= right { return; }
    let (i, j) = partition3(arr, left, right);
    sort3(arr, left, i);
    sort3(arr, j, right);
}

fn three_way_quick_sort(arr: &mut Vec<i32>) {
    let n = arr.len() as i64;
    if n > 1 { sort3(arr, 0, n - 1); }
}

fn main() {
    let mut arr: Vec<i32> = vec![7, 5, 5, 1, 5, 8, 5, 3];
    three_way_quick_sort(&mut arr);
    println!("{:?}", arr);
}
```

</div>

***

# Complexity Analysis

> **Course:** DSA › Algorithms › Sorting › Three-Way Quicksort

| Resource | Best (many duplicates) | Average | Worst |
|---|---|---|---|
| **Time** | `O(n)` | `O(n log n)` | `O(n²)` |
| **Space (stack)** | `O(log n)` | `O(log n)` | `O(n)` |
| **Stability** | ✗ | ✗ | ✗ |
| **In-place** | ✓ | ✓ | ✓ |

---

## When Each Case Hits

**Best case (`O(n)`)** — All elements equal. The first partition puts everything in the middle region; both recursive calls hit the base case. One pass, linear time.

**Best case (`O(n log n)`)** — Mixed input with many duplicates and balanced partitions. The duplicates collapse into the middle; recursion handles the unique elements in `O(log n)` levels.

**Average case (`O(n log n)`)** — Random input with random pivots. Same as two-way quicksort.

**Worst case (`O(n²)`)** — Pivot is always smallest or largest on truly unique input. Random pivot selection makes this practically unreachable.

---

## When Three-Way Beats Two-Way

| Input shape | Two-way | Three-way |
|---|---|---|
| All unique | `O(n log n)` | `O(n log n)` (slight overhead from extra comparisons) |
| ~50% duplicates | `O(n log n)` | `O(n log n)` but with smaller constant |
| ~90% duplicates | `O(n log n)` (weakly) | `O(n)` |
| All duplicates | `O(n²)` ⚠️ | `O(n)` ✓ |

The crossover point depends on duplicate density. Three-way wins when the input has *many* repeats; two-way wins when the input is all-unique (because three-way pays for the extra comparison `== pivot` even when it never triggers).

This is why production sorts (Java's dual-pivot quicksort, Rust's PDQsort) use three-way partitioning *adaptively* — they detect duplicates and switch to three-way only when it pays off. For small or random inputs, they use two-way.

---

## Why the Stack Stays `O(log n)` on Average

Each partition splits the array into three regions. Even though the recursion descends into two of them (and skips the middle), the depth is bounded by `log n` on average — same as two-way quicksort. Random pivot selection keeps the partitions balanced.

In the worst case (smallest/largest pivot on unique input), depth is `O(n)` — same as two-way. Tail-call elimination and depth-limit fallbacks (used in production sorts) guarantee `O(log n)` worst-case stack.

---

## Key Takeaway

Three-way quicksort: linear time on duplicate-heavy input, same `O(n log n)` average for unique inputs, `O(log n)` stack on average. The technique is what makes modern hybrid sorts robust on real-world data. Now the canonical exercise.

***

# Three-Way Quicksort Problem

> **Course:** DSA › Algorithms › Sorting › Three-Way Quicksort

---

## The Problem

Given an integer array `arr`, sort it in non-decreasing order **in place** using three-way quicksort.

```
Input:  arr = [2, 3, 2, 1, 5, 6]
Output: [1, 2, 2, 3, 5, 6]

Input:  arr = [6, 5, 4, 4, 4, 3, 2, 1]
Output: [1, 2, 3, 4, 4, 4, 5, 6]   (the three 4s collapse into one partition)

Input:  arr = [1, 2, 3, 4, 5, 6]
Output: [1, 2, 3, 4, 5, 6]   (no duplicates; behaves like two-way quicksort)
```

---

## The Solution

The implementation matches the version above. See the [Implementation](#implementation) section for all 10 languages.

---

## Edge Cases

| Case | Example | Expected |
|---|---|---|
| Empty | `[]` | `[]` (recursion doesn't enter). |
| Single element | `[7]` | `[7]`. |
| All equal | `[3, 3, 3, 3, 3]` | `[3, 3, 3, 3, 3]` — `O(n)` time! |
| Already sorted | `[1, 2, 3, 4]` | `[1, 2, 3, 4]`. |
| Reverse sorted | `[4, 3, 2, 1]` | `[1, 2, 3, 4]`. |
| Two distinct values | `[1, 2, 1, 2, 1]` | `[1, 1, 1, 2, 2]` — middle region absorbs the majority value efficiently. |

---

## Final Takeaway

Three-way quicksort marries quicksort's recursive divide-and-conquer with Dutch National Flag's three-way partition. The result: linear time on duplicate-heavy input, `O(n log n)` average on unique inputs, in-place, with `O(log n)` stack. This is the algorithm production sorts actually use.

The next algorithm — **merge sort** — takes a fundamentally different approach. Instead of partitioning around a pivot, it splits the array in *half* by index, recursively sorts each half, and *merges* the two sorted halves. The result: a stable `O(n log n)` worst-case sort that's the algorithm of choice when stability matters and when sorting linked lists or external (disk-based) data.

**Transfer challenge — try before the Merge Sort lesson:** Three-way quicksort uses *one* pivot. **Dual-pivot quicksort** (Java's default) uses *two* pivots, splitting the array into four regions: `< p1`, `[p1, p2]`, `> p2`, and `== p1 or p2`. What's the recurrence and what's the speed-up over single-pivot? Don't write the code — just sketch the partition shape on paper.

<details>
<summary><strong>Answer — open after you've sketched it</strong></summary>

Dual-pivot quicksort (Yaroslavskiy's algorithm, used in Java since 7) picks two pivots `p1 < p2` and partitions into three regions: `< p1`, `p1 <= x <= p2`, `> p2`. Recurses on all three. The middle region is *not* skipped (unlike three-way's equal-region) but is on average smaller than either of two-way's halves, giving better balance.

Empirically, dual-pivot is ~10–15% faster than single-pivot quicksort on random inputs. The reason: fewer comparisons per partition, better cache behaviour, and slightly better balance on average. The recurrence is `T(n) = T(a) + T(b) + T(c) + O(n)` where `a + b + c = n - 2` (the two pivots are placed); on average all three are `~n/3`.

**You just understood why Java uses dual-pivot by default.** The natural next question is: would *triple*-pivot help? Empirical research says no — the per-partition cost grows faster than the balance benefit. Two pivots is the sweet spot, and the trick generalises only to the Dutch-flag-style three-way partition we've seen here.

</details>
