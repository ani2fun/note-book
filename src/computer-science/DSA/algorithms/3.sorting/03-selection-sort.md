# 3. Selection Sort

Bubble sort moves elements *one position at a time*. Every misplaced element does its own slow walk to its correct spot, swap by swap. The result: `O(n²)` swaps in the worst case. **Selection sort fixes this with one observation: instead of bubbling, just scan the whole unsorted region, find the minimum, and put it directly in place.** One swap per pass. Same `O(n²)` comparisons, but `O(n)` swaps total.

This matters more than it sounds. On systems where memory writes are expensive — flash storage with limited write cycles, EEPROMs, network transmissions, anywhere the cost of *changing* data is higher than the cost of *reading* it — selection sort beats bubble sort by an order of magnitude in practice. The comparison cost is the same; the *write* cost is `n` instead of `n²`.

By the end of this lesson you'll know the algorithm, why it's structurally similar to bubble sort but with a fundamentally different swap profile, why it's *not* stable, and the trade-offs that make it a niche but useful tool.

## Table of contents

1. [Understanding selection sort](#understanding-selection-sort)
2. [Why the loop bounds match bubble sort](#why-the-loop-bounds-match-bubble-sort)
3. [Implementation](#implementation)
4. [Complexity analysis](#complexity-analysis)
5. [Why selection sort is not stable](#why-selection-sort-is-not-stable)
6. [Selection sort problem](#selection-sort-problem)

***

# Understanding Selection Sort

> **Course:** DSA › Algorithms › Sorting › Selection Sort

Selection sort divides the array into two regions: a **sorted prefix** at the front and an **unsorted suffix** at the back. Each pass: scan the unsorted suffix to find its minimum, then swap that minimum with the first element of the suffix. The sorted region grows by one; the unsorted region shrinks by one.

Compare this with bubble sort: bubble sort *bubbles* the largest unsorted element to the back via many adjacent swaps. Selection sort *selects* the smallest unsorted element and *teleports* it to the front via one swap.

```d2
direction: down

before: "Before pass" {
  grid-rows: 1
  grid-columns: 5
  grid-gap: 0
  s0: "1 (sorted)" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
  s1: "5"
  s2: "3" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  s3: "8"
  s4: "4"
}

after: "After pass — found min (3), swapped to front of unsorted" {
  grid-rows: 1
  grid-columns: 5
  grid-gap: 0
  s0: "1 (sorted)" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
  s1: "3 (sorted)" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
  s2: "5"
  s3: "8"
  s4: "4"
}

before -> after: scan unsorted, find min (3 at index 2), swap with index 1
```

<p align="center"><strong>One pass of selection sort. The unsorted region's minimum is found in a linear scan and swapped into place. Exactly one swap per pass — vs bubble sort's variable count.</strong></p>

---

## The Queue-of-Students Walkthrough

Same scenario as bubble sort: a queue of students with heights `[5, 3, 8, 1, 4]`. Selection sort's strategy:

**Pass 1 (find the shortest, put first):**
- Scan all 5 students. Shortest is `1` at index 3.
- Swap with index 0 → `[1, 3, 8, 5, 4]`
- The first student (`1`) is now in the correct position.

**Pass 2 (find shortest of remaining 4, put second):**
- Scan indices 1–4. Shortest is `3` at index 1 (no change needed).
- Swap with index 1 (no-op) → `[1, 3, 8, 5, 4]`
- The first two students are now correct.

**Pass 3:**
- Scan indices 2–4. Shortest is `4` at index 4.
- Swap with index 2 → `[1, 3, 4, 5, 8]`

**Pass 4:**
- Scan indices 3–4. Shortest is `5` at index 3 (no change).
- Swap with index 3 (no-op) → `[1, 3, 4, 5, 8]`
- The last element is forced to be correct.

```d2
direction: down

p0: "Initial — [5, 3, 8, 1, 4]"
p1: "After pass 1 — [1, 3, 8, 5, 4]\n(1 in place)"
p2: "After pass 2 — [1, 3, 8, 5, 4]\n(1, 3 in place; 0 effective swap)"
p3: "After pass 3 — [1, 3, 4, 5, 8]\n(1, 3, 4 in place)"
p4: "After pass 4 — [1, 3, 4, 5, 8]\n(fully sorted)" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}

p0 -> p1: pass 1 (1 swap)
p1 -> p2: pass 2 (no change needed, no-op swap)
p2 -> p3: pass 3 (1 swap)
p3 -> p4: pass 4 (no change)
```

<p align="center"><strong>The full sort with selection sort. <code>n - 1 = 4</code> passes, at most <code>n - 1</code> effective swaps total. Compare with bubble sort which made several swaps per pass.</strong></p>

---

## Selection Sort vs Bubble Sort

The two algorithms have the *same time complexity* (`O(n²)`) but *very different write profiles*. Comparison summary:

| Property | Bubble sort | Selection sort |
|---|---|---|
| Comparisons | `O(n²)` | `O(n²)` |
| **Swaps (worst case)** | `O(n²)` | `O(n)` |
| Best case | `O(n)` (with optimisation) | `O(n²)` (always) |
| Adaptive | ✓ (optimised) | ✗ |
| Stable | ✓ | ✗ |
| In-place | ✓ | ✓ |

The key trade-off: **selection sort is faster in environments where writes are expensive; bubble sort can be faster on already-sorted inputs (with optimisation).**

> *Pause and predict — for an already-sorted input <code>[1, 2, 3, 4, 5]</code>, how many comparisons does selection sort make? How many swaps?*

`O(n²)` comparisons (selection sort always scans the entire unsorted region) but `0` effective swaps (each "swap" is the element with itself). Selection sort is *not adaptive* — it does the same comparison work regardless of input order. This is the price of guaranteeing only `n - 1` swaps.

---

## Strengths and Limitations

| Strength | Detail |
|---|---|
| **Minimum swaps** | Exactly `n - 1` swaps in any case. |
| **In-place** | Mutates the input directly; `O(1)` extra memory. |
| **Simple to implement** | Two nested loops, one swap per outer iteration. |

| Limitation | Detail |
|---|---|
| **`O(n²)` always** | Best, average, and worst cases all do the same comparison work. |
| **Not stable** | Long-distance swaps can flip the relative order of equal elements. (See the dedicated section below.) |
| **Not adaptive** | Doesn't benefit from partial sorting. |

In practice, selection sort is used when:
1. Memory writes are expensive (EEPROM, flash with limited write cycles).
2. The input is small (a few dozen elements) and simplicity wins.
3. You need to find the top-K smallest items and you only need K passes (a partial sort).

---

## Key Takeaway

Selection sort: pick the smallest from the unsorted region, swap it into place, repeat. One swap per pass, `O(n)` swaps total. Same `O(n²)` time as bubble sort but a very different memory-write profile. Now we'll look at the loop structure.

***

# Why the Loop Bounds Match Bubble Sort

> **Course:** DSA › Algorithms › Sorting › Selection Sort

The outer loop runs `i` from `0` to `n - 2` — exactly like bubble sort. The reason is the same: after `n - 1` passes, `n - 1` elements are correctly placed, and the remaining one (the largest, since selection sort picks minimums) is forced into the last position.

The inner loop differs from bubble sort. Selection sort's inner loop runs `j` from `i + 1` to `n - 1` — it scans the *entire* unsorted suffix to find the minimum. Bubble sort's inner loop scanned the unsorted suffix to bubble up the maximum, but it stopped one short to avoid out-of-bounds on `arr[j + 1]`.

```d2
direction: down

ss: "Selection sort\nouter: i from 0 to n-2\ninner: j from i+1 to n-1\n— scan entire unsorted suffix\n— compare arr[j] with arr[minIndex]" {style.fill: "#dbeafe"; style.stroke: "#3b82f6"}

bs: "Bubble sort\nouter: i from 0 to n-2\ninner: j from 0 to n-i-2\n— scan unsorted prefix\n— compare arr[j] with arr[j+1]" {style.fill: "#fde68a"; style.stroke: "#d97706"}
```

<p align="center"><strong>Selection sort's inner loop scans the unsorted <em>suffix</em> looking for the global minimum. Bubble sort's inner loop scans pairs in the unsorted <em>prefix</em>. Same <code>n²</code> total comparisons; different access pattern.</strong></p>

---

## A Worked Example — `n = 5`

| Outer `i` | Inner `j` range | Comparisons performed |
|---|---|---|
| 0 | 1 to 4 | 4 |
| 1 | 2 to 4 | 3 |
| 2 | 3 to 4 | 2 |
| 3 | 4 to 4 | 1 |

Total: `4 + 3 + 2 + 1 = 10` — same as bubble sort. The shape of the comparison cost is identical. **What differs is the swap cost.**

---

## Tracking the Minimum

The inner loop maintains a single variable, `minIndex`, that tracks where the smallest element seen so far lives. We start with `minIndex = i` (assume the first unsorted element is the minimum) and update `minIndex = j` whenever we find a smaller candidate. After the inner loop completes, we swap `arr[i]` with `arr[minIndex]`.

```
minIndex = i
for j from i+1 to n-1:
    if arr[j] < arr[minIndex]:
        minIndex = j
swap(arr[i], arr[minIndex])
```

The pseudocode reflects the structure: scan, track the running minimum, swap once at the end. There's exactly one swap per outer iteration.

---

## Key Takeaway

The loop bounds — `i < n - 1` and `j ∈ [i + 1, n - 1]` — are exactly what's needed to scan the unsorted suffix and find its minimum. The structure parallels bubble sort but with a different per-pass strategy. Now we'll write the implementation.

***

# Implementation

> **Course:** DSA › Algorithms › Sorting › Selection Sort

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def selection_sort(self, arr: List[int]) -> None:
        n = len(arr)
        for i in range(n - 1):
            min_index = i                              # assume current is min
            for j in range(i + 1, n):
                if arr[j] < arr[min_index]:           # found a smaller candidate
                    min_index = j
            arr[i], arr[min_index] = arr[min_index], arr[i]   # one swap per pass


if __name__ == "__main__":
    arr = [5, 3, 8, 1, 4]
    Solution().selection_sort(arr)
    print(arr)   # [1, 3, 4, 5, 8]
```

```java,editable
public class Solution {
    public void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIndex = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            int tmp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = tmp;
        }
    }

    public static void main(String[] args) {
        int[] arr = {5, 3, 8, 1, 4};
        new Solution().selectionSort(arr);
        for (int x : arr) System.out.print(x + " ");
        System.out.println();
    }
}
```

```c,editable
#include <stdio.h>

void selection_sort(int *arr, int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_index = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_index]) {
                min_index = j;
            }
        }
        int tmp = arr[i]; arr[i] = arr[min_index]; arr[min_index] = tmp;
    }
}

int main(void) {
    int arr[] = {5, 3, 8, 1, 4};
    int n = 5;
    selection_sort(arr, n);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\n");
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

class Solution {
public:
    void selectionSort(std::vector<int>& arr) {
        int n = (int) arr.size();
        for (int i = 0; i < n - 1; i++) {
            int minIndex = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) minIndex = j;
            }
            std::swap(arr[i], arr[minIndex]);
        }
    }
};

int main() {
    std::vector<int> arr = {5, 3, 8, 1, 4};
    Solution{}.selectionSort(arr);
    for (int x : arr) std::cout << x << ' ';
    std::cout << '\n';
}
```

```scala,editable
class Solution {
  def selectionSort(arr: Array[Int]): Unit = {
    val n = arr.length
    for (i <- 0 until n - 1) {
      var minIndex = i
      for (j <- i + 1 until n) {
        if (arr(j) < arr(minIndex)) minIndex = j
      }
      val tmp = arr(i); arr(i) = arr(minIndex); arr(minIndex) = tmp
    }
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    val arr = Array(5, 3, 8, 1, 4)
    new Solution().selectionSort(arr)
    println(arr.mkString(" "))
  }
}
```

```javascript,editable
class Solution {
    selectionSort(arr) {
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) minIndex = j;
            }
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
}

const arr = [5, 3, 8, 1, 4];
new Solution().selectionSort(arr);
console.log(arr);
```

```typescript,editable
class Solution {
    selectionSort(arr: number[]): void {
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) minIndex = j;
            }
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
}

const arr: number[] = [5, 3, 8, 1, 4];
new Solution().selectionSort(arr);
console.log(arr);
```

```go,editable
package main

import "fmt"

func selectionSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        minIndex := i
        for j := i + 1; j < n; j++ {
            if arr[j] < arr[minIndex] {
                minIndex = j
            }
        }
        arr[i], arr[minIndex] = arr[minIndex], arr[i]
    }
}

func main() {
    arr := []int{5, 3, 8, 1, 4}
    selectionSort(arr)
    fmt.Println(arr)
}
```

```kotlin,editable
class Solution {
    fun selectionSort(arr: IntArray) {
        val n = arr.size
        for (i in 0 until n - 1) {
            var minIndex = i
            for (j in i + 1 until n) {
                if (arr[j] < arr[minIndex]) minIndex = j
            }
            val tmp = arr[i]; arr[i] = arr[minIndex]; arr[minIndex] = tmp
        }
    }
}

fun main() {
    val arr = intArrayOf(5, 3, 8, 1, 4)
    Solution().selectionSort(arr)
    println(arr.toList())
}
```

```rust,editable
fn selection_sort(arr: &mut Vec<i32>) {
    let n = arr.len();
    for i in 0..n.saturating_sub(1) {
        let mut min_index = i;
        for j in (i + 1)..n {
            if arr[j] < arr[min_index] {
                min_index = j;
            }
        }
        arr.swap(i, min_index);
    }
}

fn main() {
    let mut arr: Vec<i32> = vec![5, 3, 8, 1, 4];
    selection_sort(&mut arr);
    println!("{:?}", arr);
}
```

</div>

<details>
<summary><strong>Trace — arr = [5, 3, 8, 1, 4]</strong></summary>

```
Pass i=0  (find min in [5, 3, 8, 1, 4])
  start: minIndex=0, arr[minIndex]=5
  j=1: arr[1]=3 < 5 → minIndex=1
  j=2: arr[2]=8 < 3? no
  j=3: arr[3]=1 < 3 → minIndex=3
  j=4: arr[4]=4 < 1? no
  swap arr[0] ↔ arr[3] → [1, 3, 8, 5, 4]

Pass i=1  (find min in [3, 8, 5, 4])
  start: minIndex=1, arr[minIndex]=3
  j=2: arr[2]=8 < 3? no
  j=3: arr[3]=5 < 3? no
  j=4: arr[4]=4 < 3? no
  swap arr[1] ↔ arr[1] (no-op) → [1, 3, 8, 5, 4]

Pass i=2  (find min in [8, 5, 4])
  start: minIndex=2, arr[minIndex]=8
  j=3: arr[3]=5 < 8 → minIndex=3
  j=4: arr[4]=4 < 5 → minIndex=4
  swap arr[2] ↔ arr[4] → [1, 3, 4, 5, 8]

Pass i=3  (find min in [5, 8])
  start: minIndex=3, arr[minIndex]=5
  j=4: arr[4]=8 < 5? no
  swap arr[3] ↔ arr[3] (no-op) → [1, 3, 4, 5, 8]

Result: [1, 3, 4, 5, 8] ✓ — total of 4 swaps (2 effective + 2 no-ops)
```

For `n = 5`, exactly 4 swap operations executed (some are no-ops where `i == minIndex`). In contrast, bubble sort's worst case for the same array would be 6+ effective swaps.

</details>

***

# Complexity Analysis

> **Course:** DSA › Algorithms › Sorting › Selection Sort

| Resource | Best | Average | Worst |
|---|---|---|---|
| **Time** | `O(n²)` | `O(n²)` | `O(n²)` |
| **Comparisons** | `n(n-1)/2` | `n(n-1)/2` | `n(n-1)/2` |
| **Swaps** | `O(n)` | `O(n)` | `O(n)` |
| **Space** | `O(1)` | `O(1)` | `O(1)` |
| **Stability** | ✗ | ✗ | ✗ |

---

## When Each Case Hits

**Best case (`O(n²)`)** — Already-sorted input. Each inner loop still runs the full `n - i - 1` comparisons (selection sort doesn't detect "I'm already at the min"). Comparisons unchanged; effective swaps still up to `n - 1` (mostly no-ops where `i == minIndex`).

**Worst case (`O(n²)`)** — Reverse-sorted input. Same number of comparisons. Slightly more effective swaps (every pass moves an element).

**Average case (`O(n²)`)** — Random input. Same comparison count.

**Selection sort doesn't have an adaptive optimisation.** Unlike bubble sort, there's no "early exit" possible; every pass *has* to scan the entire unsorted region to know whether it's already sorted. This is what makes selection sort *non-adaptive*.

---

## When to Choose Selection Sort

| Scenario | Why selection sort wins |
|---|---|
| Memory writes are very expensive | Only `O(n)` writes vs `O(n²)` for bubble sort. |
| Need partial sort (top-K minimums) | Stop after K passes — get K smallest elements in `O(n*K)`. |
| Embedded systems with tight code budget | Fits in fewer instructions than even bubble sort. |
| Teaching the "select-and-place" pattern | Clean, easy to grok. |

| Scenario | Why selection sort loses |
|---|---|
| Almost-sorted input | Bubble sort or insertion sort exits quickly; selection sort still does `O(n²)`. |
| Stability matters | Selection sort isn't stable — see next section. |
| Large inputs | Use `O(n log n)` algorithms (the Quicksort lesson+). |

---

## Key Takeaway

Selection sort trades adaptiveness for write-count: same `O(n²)` comparisons but only `O(n)` writes. The trade-off makes it the right choice in narrow contexts where write cost dominates. Now we'll see why it's not stable.

***

# Why Selection Sort Is Not Stable

> **Course:** DSA › Algorithms › Sorting › Selection Sort

Stability matters when sorting records with secondary fields. Bubble sort is stable; selection sort is not. The reason: selection sort uses **long-distance swaps** that can leapfrog over equal elements, flipping their relative order.

---

## A Concrete Counter-Example

Consider the array `[5a, 3, 5b, 1, 4]` where `5a` and `5b` are the two equal elements (subscripts mark their original order; `5a` came first in the input).

```d2
direction: down

before: "Input — 5a originally before 5b" {
  grid-rows: 1
  grid-columns: 5
  grid-gap: 0
  v0: "5a" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  v1: "3"
  v2: "5b" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
  v3: "1"
  v4: "4"
}

p1: "Pass i=0: min is 1 at index 3 → swap arr[0] ↔ arr[3]" {
  grid-rows: 1
  grid-columns: 5
  grid-gap: 0
  v0: "1"
  v1: "3"
  v2: "5b" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
  v3: "5a" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  v4: "4"
}

note: "After pass 1, 5b is now BEFORE 5a — relative order flipped!\nSelection sort is unstable because the long-distance swap leapfrogged 5a over 5b."
```

<p align="center"><strong>Selection sort's instability. The long-distance swap in pass 1 moved <code>5a</code> past <code>5b</code>, flipping their relative order. The final sort would output <code>[1, 3, 4, 5b, 5a]</code> with the duplicates in the wrong order.</strong></p>

This isn't a bug; it's the algorithm's defining feature. The same long-distance swap that minimises total writes is what makes the algorithm unstable.

---

## When Stability Matters in Practice

Sorting by **secondary keys** is the most common use case. Imagine a list of `(name, grade)` tuples that you want to sort by grade *and* keep alphabetical-by-name order within each grade group. With a stable sort, you can:

1. First sort by name (stable).
2. Then sort by grade (stable).

The second sort preserves the relative order from the first. The end result is sorted by grade, with names alphabetical within each grade group.

With an unstable sort, step 2 would scramble the name order — you'd have to use a comparator that handles both fields at once, which is more complex.

---

## Making Selection Sort Stable

There's a stable variant: instead of *swapping* the minimum with `arr[i]`, **shift** all elements between them right by one and place the minimum at index `i`. This preserves relative order but turns each pass from `O(n)` comparisons + 1 swap into `O(n)` comparisons + `O(n)` shifts. Time complexity goes from `O(n²)` to `O(n²)` (same big-O) but with much higher constant factors — at which point insertion sort (the Insertion Sort lesson) is a better choice.

---

## Key Takeaway

Selection sort isn't stable because long-distance swaps can leapfrog equal elements. If stability matters, use bubble sort, insertion sort, or merge sort. If write count matters and stability doesn't, selection sort wins.

***

# Selection Sort Problem

> **Course:** DSA › Algorithms › Sorting › Selection Sort

The canonical exercise: implement selection sort to sort an array.

---

## The Problem

Given an integer array `arr`, sort it in non-decreasing order **in place** using selection sort.

```
Input:  arr = [2, 3, 2, 1, 5, 6]
Output: [1, 2, 2, 3, 5, 6]

Input:  arr = [6, 5, 4, 4, 4, 3, 2, 1]
Output: [1, 2, 3, 4, 4, 4, 5, 6]

Input:  arr = [1, 2, 3, 4, 5, 6]
Output: [1, 2, 3, 4, 5, 6]   (already sorted, but selection sort still runs all passes)
```

---

## The Solution

The implementation is identical to the version above. Reproducing in all 10 languages so this section is self-contained.

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def selection_sort(self, arr: List[int]) -> None:
        n = len(arr)
        for i in range(n - 1):
            min_index = i
            for j in range(i + 1, n):
                if arr[j] < arr[min_index]:
                    min_index = j
            arr[i], arr[min_index] = arr[min_index], arr[i]


if __name__ == "__main__":
    arr = [2, 3, 2, 1, 5, 6]
    Solution().selection_sort(arr)
    print(arr)
```

```java,editable
public class Solution {
    public void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIndex = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) minIndex = j;
            }
            int tmp = arr[i]; arr[i] = arr[minIndex]; arr[minIndex] = tmp;
        }
    }

    public static void main(String[] args) {
        int[] arr = {2, 3, 2, 1, 5, 6};
        new Solution().selectionSort(arr);
        for (int x : arr) System.out.print(x + " ");
        System.out.println();
    }
}
```

```c,editable
#include <stdio.h>

void selection_sort(int *arr, int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_index = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_index]) min_index = j;
        }
        int tmp = arr[i]; arr[i] = arr[min_index]; arr[min_index] = tmp;
    }
}

int main(void) {
    int arr[] = {2, 3, 2, 1, 5, 6};
    int n = 6;
    selection_sort(arr, n);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\n");
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

class Solution {
public:
    void selectionSort(std::vector<int>& arr) {
        int n = (int) arr.size();
        for (int i = 0; i < n - 1; i++) {
            int minIndex = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) minIndex = j;
            }
            std::swap(arr[i], arr[minIndex]);
        }
    }
};

int main() {
    std::vector<int> arr = {2, 3, 2, 1, 5, 6};
    Solution{}.selectionSort(arr);
    for (int x : arr) std::cout << x << ' ';
    std::cout << '\n';
}
```

```scala,editable
class Solution {
  def selectionSort(arr: Array[Int]): Unit = {
    val n = arr.length
    for (i <- 0 until n - 1) {
      var minIndex = i
      for (j <- i + 1 until n) {
        if (arr(j) < arr(minIndex)) minIndex = j
      }
      val tmp = arr(i); arr(i) = arr(minIndex); arr(minIndex) = tmp
    }
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    val arr = Array(2, 3, 2, 1, 5, 6)
    new Solution().selectionSort(arr)
    println(arr.mkString(" "))
  }
}
```

```javascript,editable
class Solution {
    selectionSort(arr) {
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) minIndex = j;
            }
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
}

const arr = [2, 3, 2, 1, 5, 6];
new Solution().selectionSort(arr);
console.log(arr);
```

```typescript,editable
class Solution {
    selectionSort(arr: number[]): void {
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) minIndex = j;
            }
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
}

const arr: number[] = [2, 3, 2, 1, 5, 6];
new Solution().selectionSort(arr);
console.log(arr);
```

```go,editable
package main

import "fmt"

func selectionSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        minIndex := i
        for j := i + 1; j < n; j++ {
            if arr[j] < arr[minIndex] {
                minIndex = j
            }
        }
        arr[i], arr[minIndex] = arr[minIndex], arr[i]
    }
}

func main() {
    arr := []int{2, 3, 2, 1, 5, 6}
    selectionSort(arr)
    fmt.Println(arr)
}
```

```kotlin,editable
class Solution {
    fun selectionSort(arr: IntArray) {
        val n = arr.size
        for (i in 0 until n - 1) {
            var minIndex = i
            for (j in i + 1 until n) {
                if (arr[j] < arr[minIndex]) minIndex = j
            }
            val tmp = arr[i]; arr[i] = arr[minIndex]; arr[minIndex] = tmp
        }
    }
}

fun main() {
    val arr = intArrayOf(2, 3, 2, 1, 5, 6)
    Solution().selectionSort(arr)
    println(arr.toList())
}
```

```rust,editable
fn selection_sort(arr: &mut Vec<i32>) {
    let n = arr.len();
    for i in 0..n.saturating_sub(1) {
        let mut min_index = i;
        for j in (i + 1)..n {
            if arr[j] < arr[min_index] {
                min_index = j;
            }
        }
        arr.swap(i, min_index);
    }
}

fn main() {
    let mut arr: Vec<i32> = vec![2, 3, 2, 1, 5, 6];
    selection_sort(&mut arr);
    println!("{:?}", arr);
}
```

</div>

---

## Edge Cases

| Case | Example | Expected |
|---|---|---|
| Empty | `[]` | `[]` (loops don't execute). |
| Single element | `[7]` | `[7]`. |
| Already sorted | `[1, 2, 3]` | `[1, 2, 3]` (still does `O(n²)` comparisons). |
| Reverse sorted | `[5, 4, 3, 2, 1]` | `[1, 2, 3, 4, 5]`. |
| All equal | `[3, 3, 3]` | `[3, 3, 3]` (no effective swaps; instability invisible). |
| Two elements | `[2, 1]` | `[1, 2]`. |
| Duplicates | `[2, 1, 2]` | `[1, 2, 2]` (correct, but original duplicates' order may flip). |

---

## Final Takeaway

Selection sort is bubble sort's write-conscious cousin. Same `O(n²)` comparisons; `O(n)` swaps. Not stable, not adaptive — but the minimum-swap guarantee makes it the right choice in narrow but real contexts. The next algorithm — insertion sort — improves on both bubble and selection by being adaptive *and* keeping the swap count low when the input is mostly sorted.

You came in with bubble sort as your only sorting tool. You're leaving with two algorithms in your kit, both `O(n²)`, with a clear understanding of when each one wins.

**Transfer challenge — try before the Insertion Sort lesson:** Write a *partial* selection sort that finds the K smallest elements of an array (and leaves the rest unsorted). What's the time complexity? How does this compare with sorting and then taking the first K?

<details>
<summary><strong>Answer — open after you've written it</strong></summary>

```python,editable
class Solution:
    def k_smallest(self, arr, k):
        n = len(arr)
        for i in range(min(k, n - 1)):                # only k passes!
            min_index = i
            for j in range(i + 1, n):
                if arr[j] < arr[min_index]:
                    min_index = j
            arr[i], arr[min_index] = arr[min_index], arr[i]
        return arr[:k]


print(Solution().k_smallest([5, 3, 8, 1, 4, 9, 2], 3))   # [1, 2, 3]
```

The change: stop the outer loop after `k` passes instead of `n - 1`. Time complexity becomes `O(n*k)` instead of `O(n²)`. For `k << n`, this is much faster than fully sorting then taking the first K (`O(n²)` regardless).

This is the seed of the **Quickselect pattern** in the Quickselect lesson — except quickselect achieves `O(n)` on average instead of `O(n*k)`. **You just rediscovered partial sorting.** Real-world libraries (`numpy.partition`, `std::nth_element`) implement fast versions of exactly this.

</details>
