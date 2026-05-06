# 2. Bubble Sort

You're a teacher with a queue of students lined up in some random order. You need them sorted by height — shortest at the front, tallest at the back. With no clipboard, no sorting helper, just yourself and a "swap these two" move, what's the simplest algorithm? **Walk down the line; whenever you find two adjacent students out of order, swap them. Repeat the walk until you make a full pass with zero swaps.** That's it. The tallest student bubbles up to the back on the first pass; the second-tallest bubbles up to the second-to-last on the next pass; and so on.

This is bubble sort. It's the simplest sorting algorithm to *describe*, the easiest to *implement*, and almost always the wrong one to *use* — its `O(n²)` time makes it impractical for any real-world dataset. But it's the perfect first sort to learn because every step is intuitive: compare-and-swap pairs, sink the largest values, watch the sorted region grow from the back.

By the end of this lesson you'll know the algorithm, why the loop bounds are `i < n-1` and `j < n-i-1`, what makes bubble sort *adaptive*, and the complexity trade-offs that determine when (rarely) bubble sort is the right tool.

## Table of contents

1. [Understanding bubble sort](#understanding-bubble-sort)
2. [Why the loop bounds are what they are](#why-the-loop-bounds-are-what-they-are)
3. [Implementation](#implementation)
4. [Complexity analysis](#complexity-analysis)
5. [Bubble sort problem](#bubble-sort-problem)

***

# Understanding Bubble Sort

> **Course:** DSA › Algorithms › Sorting › Bubble Sort

Bubble sort works by repeatedly **comparing adjacent pairs** and swapping them if they're out of order. Each full pass through the array bubbles the largest unsorted element to its correct position at the end.

The name comes from the visual analogy: **lighter elements rise to the top** like bubbles in water, while **heavier elements sink to the bottom**. In code terms: smaller values move toward the front, larger values toward the back.

```d2
direction: down

before: "Before pass" {
  grid-rows: 1
  grid-columns: 5
  grid-gap: 0
  a0: "5"
  a1: "1"
  a2: "4"
  a3: "2"
  a4: "8" {style.fill: "#fde68a"; style.stroke: "#d97706"}
}

after: "After pass — 8 sunk to last position" {
  grid-rows: 1
  grid-columns: 5
  grid-gap: 0
  a0: "1"
  a1: "4"
  a2: "2"
  a3: "5"
  a4: "8" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
}

before -> after: one pass of compare-and-swap
```

<p align="center"><strong>One pass of bubble sort. The largest element (8) "sinks" to the last position. After <code>n-1</code> passes, every element is in place.</strong></p>

---

## The Queue-of-Students Walkthrough

Imagine a queue of five students with heights `[5, 3, 8, 1, 4]` (in feet, for the analogy). The teacher wants them sorted shortest-front to tallest-back.

**Pass 1:** walk left-to-right, comparing and swapping:
- Compare `5` and `3` — swap → `[3, 5, 8, 1, 4]`
- Compare `5` and `8` — in order → no swap
- Compare `8` and `1` — swap → `[3, 5, 1, 8, 4]`
- Compare `8` and `4` — swap → `[3, 5, 1, 4, 8]`

After pass 1, the tallest student (`8`) is in the correct final position. The first 4 elements are still unsorted.

**Pass 2:** walk again, but now we can stop one position earlier (the last element is already correct):
- Compare `3` and `5` — in order
- Compare `5` and `1` — swap → `[3, 1, 5, 4, 8]`
- Compare `5` and `4` — swap → `[3, 1, 4, 5, 8]`

After pass 2, the second-tallest (`5`) is in place.

```d2
direction: down

p0: "Initial — [5, 3, 8, 1, 4]"
p1: "After pass 1 — [3, 5, 1, 4, 8]\n(8 in place)"
p2: "After pass 2 — [3, 1, 4, 5, 8]\n(5, 8 in place)"
p3: "After pass 3 — [1, 3, 4, 5, 8]\n(4, 5, 8 in place)"
p4: "After pass 4 — [1, 3, 4, 5, 8]\n(fully sorted)" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}

p0 -> p1: pass 1 (3 swaps)
p1 -> p2: pass 2 (2 swaps)
p2 -> p3: pass 3 (1 swap)
p3 -> p4: pass 4 (0 swaps)
```

<p align="center"><strong>The full sort of <code>[5, 3, 8, 1, 4]</code>. Each pass places one more element in its final position. After 4 passes, the array is fully sorted.</strong></p>

A useful optimisation: after pass 4, no swaps were needed — the algorithm could detect this and exit one pass early. We'll see this in the implementation below.

---

## Why It's Called "Bubble" Sort

In water, lighter bubbles rise; heavier ones sink. In bubble sort, the *largest* element of any sub-window quickly sinks to the bottom of that window — so the array is built bottom-up from the back. (Some sources call it "sinking sort" for this reason; both names are accurate.)

> *Pause and predict — for an already-sorted array <code>[1, 2, 3, 4, 5]</code>, how many swaps does pass 1 perform? How does this enable an "early-exit" optimisation?*

Zero swaps. Every adjacent pair is already in order. If we track *whether any swap happened* in a pass, we can exit the algorithm as soon as a pass completes without swaps — the array is fully sorted, and any further passes would also produce zero swaps. This is the optimisation that makes bubble sort *adaptive* (classification axis 4 from the Introduction to Sorting lesson).

---

## Strengths and Limitations

| Strength | Detail |
|---|---|
| **Simplicity** | Two nested loops, one swap. The algorithm fits in five lines. |
| **In-place** | Mutates the input directly; no auxiliary array. |
| **Stable** | Swaps only happen on strict `>`, so equal elements keep their relative order. |
| **Adaptive (with optimisation)** | Best case `O(n)` on already-sorted input. |

| Limitation | Detail |
|---|---|
| **Quadratic time** | Worst and average case `O(n²)`. Doubling the input size *quadruples* the work. |
| **Many writes** | `O(n²)` swaps in the worst case. Slow on systems where memory writes are expensive (SSDs, embedded). |

In practice, bubble sort is used as a teaching example or for very small arrays (where `O(n²)` is genuinely fine). For everything else, insertion sort beats it on the same complexity class with smaller constants, and the `O(n log n)` sorts (Quicksort, Dutch National Flag Sort, Three-Way Quicksort, Merge Sort, Heapsort) beat both for any reasonably large input.

---

## Key Takeaway

Bubble sort: walk the array, swap adjacent pairs if out of order, repeat until no swaps are needed. Every full pass anchors one more element at the end. Simple to write; quadratic to run; rarely the right tool, but always the right starting point. Now we'll formalise the loop bounds.

***

# Why the Loop Bounds Are What They Are

> **Course:** DSA › Algorithms › Sorting › Bubble Sort

Bubble sort uses two nested loops. The bounds — `i < n - 1` for the outer loop and `j < n - i - 1` for the inner loop — look arbitrary at first. They're not. Both come from one observation: **after pass `i`, the last `i` elements are already in their final positions, so we don't need to compare them again.**

---

## The Outer Loop — Why `i < n - 1`

We need `n - 1` passes, not `n`. Reason: each pass places *one* element correctly. After `n - 1` passes, `n - 1` elements are correctly placed. The remaining one element — the smallest — is necessarily in its correct position (the front), since every other element has already been sorted around it.

```d2
direction: down

note: "Why n-1 passes (not n)?\n\nAfter n-1 passes, n-1 elements are correctly placed.\nThe remaining one is forced into its correct position\n(it's the only spot left)."
```

<p align="center"><strong>The last element doesn't need its own pass. After <code>n-1</code> elements are correctly placed, the remaining one has nowhere else to go.</strong></p>

If you ran `n` passes, the extra pass would do zero swaps but waste `O(n)` work. The early-exit optimisation later in the chapter handles this case more elegantly.

---

## The Inner Loop — Why `j < n - i - 1`

The inner loop walks from `j = 0` to `j = n - i - 2` (so the loop test is `j < n - i - 1`). Two reasons:

**Reason 1: Already-sorted suffix.** After `i` outer-loop iterations, the last `i` elements are in their final positions. Comparisons in that range are wasted work — they'll never swap. So we stop at `n - i - 1`.

**Reason 2: Out-of-bounds protection.** The inner loop accesses `arr[j]` and `arr[j + 1]`. The latter must stay within bounds, so `j + 1 ≤ n - 1`, i.e., `j ≤ n - 2`. Combined with reason 1, the upper bound becomes `j ≤ n - i - 2`, or equivalently `j < n - i - 1`.

```d2
direction: down

before: "After 2 outer iterations (i=2)" {
  grid-rows: 1
  grid-columns: 6
  grid-gap: 0
  a0: "?" {style.fill: "#dbeafe"; style.stroke: "#3b82f6"}
  a1: "?" {style.fill: "#dbeafe"; style.stroke: "#3b82f6"}
  a2: "?" {style.fill: "#dbeafe"; style.stroke: "#3b82f6"}
  a3: "?" {style.fill: "#dbeafe"; style.stroke: "#3b82f6"}
  a4: "second-largest" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
  a5: "largest" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
}

label: "Unsorted (blue) — process up to index n-i-2 = 6-2-2 = 2 in inner loop\nSorted (green) — last 2 elements already correct, skip"
```

<p align="center"><strong>The inner loop's upper bound shrinks by 1 each outer iteration. After <code>i</code> passes, the last <code>i</code> elements are sorted, so we only loop over the unsorted prefix.</strong></p>

---

## A Worked Example — `n = 5`, Tracking Both Loop Bounds

| Outer `i` | Inner `j` range | Comparisons performed |
|---|---|---|
| 0 | 0 to 3 (n-0-1=4 stops) | 4 (covers all adjacent pairs) |
| 1 | 0 to 2 | 3 |
| 2 | 0 to 1 | 2 |
| 3 | 0 to 0 | 1 |

Total: `4 + 3 + 2 + 1 = 10` comparisons for `n = 5`. In general, `(n-1) + (n-2) + ... + 1 = n(n-1)/2 = O(n²)` — confirming the worst-case time complexity we'll formalise in the next section.

---

## Key Takeaway

Both loop bounds — `i < n - 1` and `j < n - i - 1` — come from "the last `i` elements are already sorted." This is a *standard pattern* for sorting algorithms that build up a sorted suffix; we'll see the same pattern in selection sort (the Selection Sort lesson). Now we'll write the implementation.

***

# Implementation

> **Course:** DSA › Algorithms › Sorting › Bubble Sort

Two versions: the basic implementation (always runs `n - 1` passes) and the optimised version with an early-exit flag.

---

## Basic Implementation

<div class="lang-tabs">

```pseudocode
function bubbleSort(arr):
    n ← length(arr)
    for i from 0 to n − 2:                  # n − 1 passes
        for j from 0 to n − i − 2:          # walk the unsorted prefix
            if arr[j] > arr[j + 1]:         # strict > keeps it stable
                swap arr[j] and arr[j + 1]
```

```python,editable
from typing import List

class Solution:
    def bubble_sort(self, arr: List[int]) -> None:
        n = len(arr)
        for i in range(n - 1):                     # n-1 passes
            for j in range(n - i - 1):             # walk unsorted prefix
                if arr[j] > arr[j + 1]:            # strict > keeps it stable
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]


if __name__ == "__main__":
    arr = [5, 3, 8, 1, 4]
    Solution().bubble_sort(arr)
    print(arr)   # [1, 3, 4, 5, 8]
```

```java,editable
public class Solution {
    public void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = {5, 3, 8, 1, 4};
        new Solution().bubbleSort(arr);
        for (int x : arr) System.out.print(x + " ");
        System.out.println();
    }
}
```

```c,editable
#include <stdio.h>

void bubble_sort(int *arr, int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
            }
        }
    }
}

int main(void) {
    int arr[] = {5, 3, 8, 1, 4};
    int n = 5;
    bubble_sort(arr, n);
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
    void bubbleSort(std::vector<int>& arr) {
        int n = (int) arr.size();
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    std::swap(arr[j], arr[j + 1]);
                }
            }
        }
    }
};

int main() {
    std::vector<int> arr = {5, 3, 8, 1, 4};
    Solution{}.bubbleSort(arr);
    for (int x : arr) std::cout << x << ' ';
    std::cout << '\n';
}
```

```scala,editable
class Solution {
  def bubbleSort(arr: Array[Int]): Unit = {
    val n = arr.length
    for (i <- 0 until n - 1) {
      for (j <- 0 until n - i - 1) {
        if (arr(j) > arr(j + 1)) {
          val tmp = arr(j); arr(j) = arr(j + 1); arr(j + 1) = tmp
        }
      }
    }
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    val arr = Array(5, 3, 8, 1, 4)
    new Solution().bubbleSort(arr)
    println(arr.mkString(" "))
  }
}
```

```typescript,editable
class Solution {
    bubbleSort(arr: number[]): void {
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
        }
    }
}

const arr: number[] = [5, 3, 8, 1, 4];
new Solution().bubbleSort(arr);
console.log(arr);
```

```go,editable
package main

import "fmt"

func bubbleSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        for j := 0; j < n-i-1; j++ {
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
            }
        }
    }
}

func main() {
    arr := []int{5, 3, 8, 1, 4}
    bubbleSort(arr)
    fmt.Println(arr)
}
```

```rust,editable
fn bubble_sort(arr: &mut Vec<i32>) {
    let n = arr.len();
    for i in 0..n.saturating_sub(1) {
        for j in 0..(n - i - 1) {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
            }
        }
    }
}

fn main() {
    let mut arr: Vec<i32> = vec![5, 3, 8, 1, 4];
    bubble_sort(&mut arr);
    println!("{:?}", arr);
}
```

</div>

<details>
<summary><strong>Trace — arr = [5, 3, 8, 1, 4]</strong></summary>

```
Pass i=0  (j: 0..3, 4 comparisons)
  j=0: 5 > 3 → swap → [3, 5, 8, 1, 4]
  j=1: 5 > 8 → no
  j=2: 8 > 1 → swap → [3, 5, 1, 8, 4]
  j=3: 8 > 4 → swap → [3, 5, 1, 4, 8]

Pass i=1  (j: 0..2, 3 comparisons)
  j=0: 3 > 5 → no
  j=1: 5 > 1 → swap → [3, 1, 5, 4, 8]
  j=2: 5 > 4 → swap → [3, 1, 4, 5, 8]

Pass i=2  (j: 0..1, 2 comparisons)
  j=0: 3 > 1 → swap → [1, 3, 4, 5, 8]
  j=1: 3 > 4 → no

Pass i=3  (j: 0..0, 1 comparison)
  j=0: 1 > 3 → no

Result: [1, 3, 4, 5, 8] ✓
```

Notice: pass `i=3` did zero swaps. The early-exit optimisation below would catch this at the end of pass `i=2` and exit one pass earlier.

</details>

---

## Optimised Implementation (Adaptive)

The optimisation: track whether *any swap* happened in a pass. If a full pass completes with zero swaps, the array is sorted — exit immediately.

This makes bubble sort *adaptive* (the Introduction to Sorting lesson, classification axis 4). On already-sorted input, the algorithm completes in one `O(n)` pass instead of `O(n²)` total work.

```python,editable
class Solution:
    def bubble_sort(self, arr):
        n = len(arr)
        for i in range(n - 1):
            swapped = False
            for j in range(n - i - 1):
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
                    swapped = True
            if not swapped:                    # no swaps → sorted, exit early
                break


if __name__ == "__main__":
    sorted_arr = [1, 2, 3, 4, 5]
    Solution().bubble_sort(sorted_arr)         # exits after 1 pass — O(n)
    print(sorted_arr)
```

The same `swapped` flag pattern translates one-to-one to all 10 languages above; we omit the repetition.

***

# Complexity Analysis

> **Course:** DSA › Algorithms › Sorting › Bubble Sort

| Resource | Best | Average | Worst |
|---|---|---|---|
| **Time (basic)** | `O(n²)` | `O(n²)` | `O(n²)` |
| **Time (optimised)** | `O(n)` | `O(n²)` | `O(n²)` |
| **Space** | `O(1)` | `O(1)` | `O(1)` |
| **Stability** | ✓ | ✓ | ✓ |

The basic version always runs `n(n-1)/2 ≈ n²/2` comparisons regardless of input. The optimised version exits on the first pass with zero swaps, giving `O(n)` on already-sorted input.

---

## When Each Case Hits

**Best case (optimised, `O(n)`)** — Input is already sorted. The first pass finds zero swaps and exits.

**Worst case (`O(n²)`)** — Input is sorted in *reverse* order. Every comparison triggers a swap; every element bubbles all the way to the end. `n(n-1)/2` swaps total.

**Average case (`O(n²)`)** — Random input. Approximately half the comparisons trigger swaps; total work is still quadratic.

---

## Why Bubble Sort Is Slow

The fundamental problem: each swap moves an element *one position* at a time. To move the smallest element from the end of the array to the front, you'd need `n - 1` swaps. Compare with insertion sort (the Insertion Sort lesson) which can move an element `k` positions with `k+1` comparisons but only `1` swap (using shifts). Or merge sort (the Merge Sort lesson) which moves elements logarithmically further per pass.

```d2
direction: right

bubble: "Bubble sort\n→ swap-only, 1 step per swap\n→ O(n²) for arbitrary input" {style.fill: "#fecaca"; style.stroke: "#dc2626"}
insertion: "Insertion sort\n→ shift-based, k steps per insert\n→ better constants, same O(n²)" {style.fill: "#fde68a"; style.stroke: "#d97706"}
merge: "Merge sort / Quicksort\n→ divide-and-conquer\n→ O(n log n)" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
```

<p align="center"><strong>Bubble sort's swap-only nature is the bottleneck. Better algorithms move elements faster per operation.</strong></p>

---

## Key Takeaway

Bubble sort's `O(n²)` time is determined by *how slowly each element moves* — one position per swap. The optimised variant becomes `O(n)` only when the input is already sorted. Now we'll apply the algorithm to a problem.

***

# Bubble Sort Problem

> **Course:** DSA › Algorithms › Sorting › Bubble Sort

The canonical exercise: implement bubble sort to sort an array.

---

## The Problem

Given an integer array `arr`, sort it in non-decreasing order **in place** using bubble sort.

```
Input:  arr = [2, 3, 2, 1, 5, 6]
Output: [1, 2, 2, 3, 5, 6]

Input:  arr = [6, 5, 4, 4, 4, 3, 2, 1]
Output: [1, 2, 3, 4, 4, 4, 5, 6]

Input:  arr = [1, 2, 3, 4, 5, 6]
Output: [1, 2, 3, 4, 5, 6]   (already sorted)
```

---

## The Solution

The implementation is identical to the optimised version above. Including all 10 languages here so the file is self-contained.

<div class="lang-tabs">

```pseudocode
function bubbleSort(arr):
    n ← length(arr)
    for i from 0 to n − 2:
        swapped ← false
        for j from 0 to n − i − 2:
            if arr[j] > arr[j + 1]:
                swap arr[j] and arr[j + 1]
                swapped ← true
        if NOT swapped:                     # already sorted — exit early (best case O(n))
            break
```

```python,editable
from typing import List

class Solution:
    def bubble_sort(self, arr: List[int]) -> None:
        n = len(arr)
        for i in range(n - 1):
            swapped = False
            for j in range(n - i - 1):
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
                    swapped = True
            if not swapped:
                break


if __name__ == "__main__":
    arr = [2, 3, 2, 1, 5, 6]
    Solution().bubble_sort(arr)
    print(arr)
```

```java,editable
public class Solution {
    public void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }

    public static void main(String[] args) {
        int[] arr = {2, 3, 2, 1, 5, 6};
        new Solution().bubbleSort(arr);
        for (int x : arr) System.out.print(x + " ");
        System.out.println();
    }
}
```

```c,editable
#include <stdio.h>
#include <stdbool.h>

void bubble_sort(int *arr, int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = tmp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

int main(void) {
    int arr[] = {2, 3, 2, 1, 5, 6};
    int n = 6;
    bubble_sort(arr, n);
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
    void bubbleSort(std::vector<int>& arr) {
        int n = (int) arr.size();
        for (int i = 0; i < n - 1; i++) {
            bool swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    std::swap(arr[j], arr[j + 1]);
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
};

int main() {
    std::vector<int> arr = {2, 3, 2, 1, 5, 6};
    Solution{}.bubbleSort(arr);
    for (int x : arr) std::cout << x << ' ';
    std::cout << '\n';
}
```

```scala,editable
class Solution {
  def bubbleSort(arr: Array[Int]): Unit = {
    val n = arr.length
    var i = 0
    while (i < n - 1) {
      var swapped = false
      for (j <- 0 until n - i - 1) {
        if (arr(j) > arr(j + 1)) {
          val tmp = arr(j); arr(j) = arr(j + 1); arr(j + 1) = tmp
          swapped = true
        }
      }
      if (!swapped) return
      i += 1
    }
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    val arr = Array(2, 3, 2, 1, 5, 6)
    new Solution().bubbleSort(arr)
    println(arr.mkString(" "))
  }
}
```

```typescript,editable
class Solution {
    bubbleSort(arr: number[]): void {
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
}

const arr: number[] = [2, 3, 2, 1, 5, 6];
new Solution().bubbleSort(arr);
console.log(arr);
```

```go,editable
package main

import "fmt"

func bubbleSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        swapped := false
        for j := 0; j < n-i-1; j++ {
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = true
            }
        }
        if !swapped {
            break
        }
    }
}

func main() {
    arr := []int{2, 3, 2, 1, 5, 6}
    bubbleSort(arr)
    fmt.Println(arr)
}
```

```rust,editable
fn bubble_sort(arr: &mut Vec<i32>) {
    let n = arr.len();
    for i in 0..n.saturating_sub(1) {
        let mut swapped = false;
        for j in 0..(n - i - 1) {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
                swapped = true;
            }
        }
        if !swapped { break; }
    }
}

fn main() {
    let mut arr: Vec<i32> = vec![2, 3, 2, 1, 5, 6];
    bubble_sort(&mut arr);
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
| Already sorted | `[1, 2, 3]` | `[1, 2, 3]` (one pass with optimisation). |
| Reverse sorted | `[5, 4, 3, 2, 1]` | `[1, 2, 3, 4, 5]` (worst case, full quadratic work). |
| All equal | `[3, 3, 3]` | `[3, 3, 3]` (no swaps; one pass with optimisation). |
| Two elements | `[2, 1]` | `[1, 2]`. |

---

## Final Takeaway

Bubble sort is the simplest sort and the slowest. It's the algorithm you write to verify you understand the *idea* of sorting; you don't ship it. Stable, in-place, adaptive (with the swap flag), but `O(n²)` makes it impractical past a few thousand elements.

The next algorithm — selection sort — fixes one specific weakness of bubble sort (excessive swaps) by performing exactly `n - 1` swaps total instead of up to `n²`. Same time complexity, very different memory-write profile.

**Transfer challenge — try before the Selection Sort lesson:** Modify bubble sort to sort in *descending* order. (Hint: only one character of the algorithm changes.) Then think: is the descending sort still stable?

<details>
<summary><strong>Answer — open after you've written it</strong></summary>

```python,editable
class Solution:
    def bubble_sort_desc(self, arr):
        n = len(arr)
        for i in range(n - 1):
            swapped = False
            for j in range(n - i - 1):
                if arr[j] < arr[j + 1]:                # only change: < instead of >
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
                    swapped = True
            if not swapped:
                break


arr = [2, 3, 2, 1, 5, 6]
Solution().bubble_sort_desc(arr)
print(arr)   # [6, 5, 3, 2, 2, 1]
```

The change is the comparison: `>` becomes `<`. The algorithm is still stable (we still only swap on strict inequality), so duplicates keep their original relative order even in descending sort.

**Generalising:** the same one-character change — `<` vs `>` — flips the sort order of *any* comparison-based algorithm. We'll abstract this into a "custom compare function" pattern in the Custom Compare lesson. **You just discovered the foundation of how `sorted(arr, reverse=True)` works internally.**

</details>
