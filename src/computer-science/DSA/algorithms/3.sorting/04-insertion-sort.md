# 4. Insertion Sort

You're holding a hand of playing cards, picked up one at a time. After grabbing the third card, you don't sort the whole hand — you just slide that one card into its right spot among the two you already had sorted. Pick up the fourth card; slide it in. Pick up the fifth; slide it in. By the time you've picked up all the cards, your hand is sorted, and you never did a "full sort" — you just inserted each new card where it belonged.

This is insertion sort. It's the algorithm humans naturally use when sorting cards, papers, books — anything where the items arrive one at a time. In code, it builds the sorted array left-to-right by *inserting* each new element into its correct position within the already-sorted prefix. Like bubble and selection sort, it's `O(n²)` in the worst case. Unlike them, **it's the fastest `O(n²)` sort in practice** — its inner loop terminates early when the input is partially sorted, and on truly small arrays it beats even `O(n log n)` algorithms because of its tiny constant factor.

By the end of this lesson you'll know the algorithm, why it's fundamentally different from bubble and selection sort despite the same asymptotic complexity, why it's the canonical "best of the quadratic sorts," and why every modern sorting library (TimSort, IntroSort) falls back to insertion sort for small subarrays.

## Table of contents

1. [Understanding insertion sort](#understanding-insertion-sort)
2. [Why insertion sort beats its quadratic cousins](#why-insertion-sort-beats-its-quadratic-cousins)
3. [Implementation](#implementation)
4. [Complexity analysis](#complexity-analysis)
5. [Insertion sort problem](#insertion-sort-problem)

***

# Understanding Insertion Sort

> **Course:** DSA › Algorithms › Sorting › Insertion Sort

Insertion sort divides the array into a **sorted prefix** at the front and an **unsorted suffix** at the back — exactly like selection sort. The difference is in how each pass works:

- **Selection sort** scans the unsorted suffix to find its minimum, then swaps it to the front of the suffix. One swap per pass; `O(n)` linear scan inside.
- **Insertion sort** takes the *first* element of the unsorted suffix and inserts it into its correct position within the sorted prefix by shifting larger elements one step right. Up to `O(i)` shifts per pass, but the loop *exits early* the moment the correct position is found.

```d2
direction: down

before: "Before pass" {
  grid-rows: 1
  grid-columns: 5
  grid-gap: 0
  s0: "1 (sorted)" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
  s1: "3 (sorted)" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
  s2: "5 (sorted)" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
  s3: "2 (key)" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  s4: "8"
}

after: "After pass — 2 inserted at index 1, others shifted right" {
  grid-rows: 1
  grid-columns: 5
  grid-gap: 0
  s0: "1 (sorted)" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
  s1: "2 (sorted)" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
  s2: "3 (sorted)" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
  s3: "5 (sorted)" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
  s4: "8"
}

before -> after: pull key (2), shift 5 and 3 right, insert 2 at position where prefix is still sorted
```

<p align="center"><strong>One pass of insertion sort. The key (<code>2</code>) is pulled out, larger elements (<code>5</code>, <code>3</code>) shift right one at a time, and the key drops into the gap. The sorted prefix grows by one.</strong></p>

---

## The Card-Sorting Walkthrough

Imagine being dealt cards one at a time. After receiving each card, you slide it into its correct position in your already-sorted hand.

Hand starts empty. You pick up `[5, 3, 8, 1, 4]` one card at a time:

**After card `5`:** hand is `[5]` — trivially sorted.

**After card `3`:** compare with `5`. `3 < 5`, so shift `5` right and put `3` at the front. Hand is `[3, 5]`.

**After card `8`:** compare with `5`. `8 > 5`, so it stays at the end. Hand is `[3, 5, 8]`.

**After card `1`:** compare with `8`, `5`, `3` — each greater, each shifts right. Drop `1` at the front. Hand is `[1, 3, 5, 8]`.

**After card `4`:** compare with `8` (shift), then `5` (shift), then `3` (stop). Drop `4` at index 2. Hand is `[1, 3, 4, 5, 8]`.

```d2
direction: down

p0: "Initial — hand = []"
p1: "After card 5 — hand = [5]"
p2: "After card 3 — hand = [3, 5]\n(1 shift)"
p3: "After card 8 — hand = [3, 5, 8]\n(0 shifts)"
p4: "After card 1 — hand = [1, 3, 5, 8]\n(3 shifts)"
p5: "After card 4 — hand = [1, 3, 4, 5, 8]\n(2 shifts)" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}

p0 -> p1: insert 5
p1 -> p2: insert 3
p2 -> p3: insert 8 (no shift; 8 ≥ all)
p3 -> p4: insert 1 (worst case for this card)
p4 -> p5: insert 4
```

<p align="center"><strong>The full sort. Each pass extends the sorted prefix by one. The number of shifts per pass varies — from <code>0</code> when the new element is already in the right place to <code>i</code> when it has to travel the full sorted prefix.</strong></p>

---

## The Two Halves Look the Same — But Mean Different Things

Both selection sort and insertion sort have a "sorted prefix" and "unsorted suffix." The difference: **selection sort's sorted prefix is permanent** (each pass guarantees the next correct element), while **insertion sort's sorted prefix is provisional** (each pass slides the new element somewhere into the prefix, possibly displacing a lot of already-placed elements).

This is the key insight that makes insertion sort *adaptive*. If a new element happens to be larger than everything in the sorted prefix, the inner loop exits immediately — `0` shifts. Selection sort never gets that benefit; it always scans the full unsorted suffix even if everything is in order.

> *Pause and predict — for an already-sorted input <code>[1, 2, 3, 4, 5]</code>, how many comparisons does insertion sort make? How many shifts?*

`n - 1` comparisons (one per pass, each exits the inner loop after the first comparison). Zero shifts. Total time: `O(n)`. **Insertion sort is the only `O(n²)` sort that's also `O(n)` in the best case.** Selection sort can't do this because it always has to find the minimum, which requires scanning everything.

---

## Strengths and Limitations

| Strength | Detail |
|---|---|
| **Adaptive** | `O(n)` on already-sorted input; `O(k·n)` if every element is at most `k` positions away from its sorted spot. |
| **In-place** | `O(1)` extra memory. |
| **Stable** | Equal elements keep their relative order. |
| **Online** | Can sort a stream as elements arrive — no need to know the full input upfront. |
| **Fast on small inputs** | Lower constant factor than `O(n log n)` algorithms; libraries fall back to insertion sort for `n ≤ 10–20`. |

| Limitation | Detail |
|---|---|
| **Quadratic on random input** | `O(n²)` average and worst case. |

In practice, insertion sort is the algorithm of choice for:
1. Small inputs (under ~20 elements).
2. Almost-sorted data.
3. Streaming / online sorting.
4. The "last mile" of hybrid sorts like TimSort (Python's default) and IntroSort (C++ STL).

---

## Key Takeaway

Insertion sort: take each new element, slide it into the sorted prefix by shifting larger elements right, repeat. Adaptive, stable, in-place. The fastest of the `O(n²)` sorts and the canonical "small-input" sort used inside every major library. Now we'll see exactly *why* it beats bubble and selection sort.

***

# Why Insertion Sort Beats Its Quadratic Cousins

> **Course:** DSA › Algorithms › Sorting › Insertion Sort

All three of bubble sort, selection sort, and insertion sort are `O(n²)` in the worst case. But "same big-O" hides huge differences in **average performance** and **adaptiveness**. Insertion sort wins on both axes.

---

## Comparison Across the Three Sorts

| Property | Bubble (basic) | Bubble (optimised) | Selection | Insertion |
|---|---|---|---|---|
| Best | `O(n²)` | `O(n)` | `O(n²)` | `O(n)` |
| Average | `O(n²)` | `O(n²)` | `O(n²)` | `O(n²)` |
| Worst | `O(n²)` | `O(n²)` | `O(n²)` | `O(n²)` |
| Comparisons (random) | ≈ `n²/2` | ≈ `n²/2` | `n(n-1)/2` | ≈ `n²/4` average |
| Swaps (random) | ≈ `n²/4` | ≈ `n²/4` | `n - 1` | ≈ `n²/4` (as shifts) |
| Stable | ✓ | ✓ | ✗ | ✓ |
| Adaptive | ✗ | ✓ | ✗ | ✓ |
| Online | ✗ | ✗ | ✗ | ✓ |

The insight: **insertion sort makes about half the comparisons of bubble sort on random input** because the inner loop exits early. And the `O(n)` best case + adaptiveness mean it dominates on almost-sorted data.

---

## The "Online" Advantage

Insertion sort is the only one of the three that can be used as an *online* algorithm — sorting elements as they arrive without seeing the full input upfront. After receiving the `i`-th element, the array `[0..i]` is fully sorted. Both bubble and selection sort require the full input before starting.

This matters in real-world applications where data streams in:
- A leaderboard updating live.
- Sorting log lines as they arrive.
- Maintaining a sorted database index as records are inserted.

Most production "online sorting" implementations are insertion sort variants on top of skip lists or balanced trees.

---

## Why Hybrid Sorts Use Insertion Sort

Look at the source of any modern sorting library and you'll find a special case for small arrays:

```python,editable
# (paraphrased; actual TimSort source is more complex)
if n < 32:
    insertion_sort(arr)
else:
    merge_sort(arr)
```

The reason: `O(n log n)` algorithms have higher constant factors. For `n = 10`, insertion sort's ~50 operations (~`n²/2`) beats merge sort's ~30 operations × overhead per recursive call. The crossover point is somewhere around `n = 16–32` depending on the implementation.

This isn't a hack — it's literally the strategy used by:
- **Python** — TimSort (since Python 2.3).
- **Java** — `Arrays.sort()` for objects (TimSort).
- **C++** — `std::sort` (IntroSort, which is quicksort + heapsort + insertion sort).
- **Rust** — `slice::sort` (TimSort variant).

> *Predict before reading on — for a 1,000,000-element array, would insertion sort or merge sort win? What about for a 20-element array?*

For a million elements, merge sort wins by orders of magnitude (`O(n log n)` vs `O(n²)`). For 20 elements, insertion sort wins because of the lower constant factor. Real-world sorts use *both* — merge sort for the big picture, insertion sort for the small tail.

---

## Key Takeaway

Insertion sort is `O(n²)` in the worst case but wins on best case (`O(n)`), adaptiveness (linear on partially sorted), and constant factor (fastest `O(n²)` algorithm). The combination makes it the foundation layer of every modern hybrid sort. Now we'll write the implementation.

***

# Implementation

> **Course:** DSA › Algorithms › Sorting › Insertion Sort

The algorithm uses two nested loops: an outer loop that picks the next "key" from the unsorted suffix, and an inner loop that shifts larger elements right until the key's correct position is found.

<div class="lang-tabs">

```pseudocode
function insertionSort(arr):
    n ← length(arr)
    for i from 1 to n − 1:                  # arr[0] is trivially sorted
        key ← arr[i]                         # take the next element from the unsorted suffix
        j ← i − 1
        while j ≥ 0 AND arr[j] > key:        # shift larger elements one slot right
            arr[j + 1] ← arr[j]
            j ← j − 1
        arr[j + 1] ← key                     # drop key into the gap
```

```python,editable
from typing import List

class Solution:
    def insertion_sort(self, arr: List[int]) -> None:
        n = len(arr)
        for i in range(1, n):                       # i = 1 because arr[0] is trivially sorted
            key = arr[i]                             # take the next element from the unsorted suffix
            j = i - 1
            while j >= 0 and arr[j] > key:          # shift larger elements right
                arr[j + 1] = arr[j]
                j -= 1
            arr[j + 1] = key                         # insert key at the gap


if __name__ == "__main__":
    arr = [5, 3, 8, 1, 4]
    Solution().insertion_sort(arr)
    print(arr)   # [1, 3, 4, 5, 8]
```

```java,editable
public class Solution {
    public void insertionSort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    public static void main(String[] args) {
        int[] arr = {5, 3, 8, 1, 4};
        new Solution().insertionSort(arr);
        for (int x : arr) System.out.print(x + " ");
        System.out.println();
    }
}
```

```c,editable
#include <stdio.h>

void insertion_sort(int *arr, int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

int main(void) {
    int arr[] = {5, 3, 8, 1, 4};
    int n = 5;
    insertion_sort(arr, n);
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
    void insertionSort(std::vector<int>& arr) {
        int n = (int) arr.size();
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
};

int main() {
    std::vector<int> arr = {5, 3, 8, 1, 4};
    Solution{}.insertionSort(arr);
    for (int x : arr) std::cout << x << ' ';
    std::cout << '\n';
}
```

```scala,editable
class Solution {
  def insertionSort(arr: Array[Int]): Unit = {
    val n = arr.length
    for (i <- 1 until n) {
      val key = arr(i)
      var j = i - 1
      while (j >= 0 && arr(j) > key) {
        arr(j + 1) = arr(j)
        j -= 1
      }
      arr(j + 1) = key
    }
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    val arr = Array(5, 3, 8, 1, 4)
    new Solution().insertionSort(arr)
    println(arr.mkString(" "))
  }
}
```

```typescript,editable
class Solution {
    insertionSort(arr: number[]): void {
        const n = arr.length;
        for (let i = 1; i < n; i++) {
            const key = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
}

const arr: number[] = [5, 3, 8, 1, 4];
new Solution().insertionSort(arr);
console.log(arr);
```

```go,editable
package main

import "fmt"

func insertionSort(arr []int) {
    n := len(arr)
    for i := 1; i < n; i++ {
        key := arr[i]
        j := i - 1
        for j >= 0 && arr[j] > key {
            arr[j+1] = arr[j]
            j--
        }
        arr[j+1] = key
    }
}

func main() {
    arr := []int{5, 3, 8, 1, 4}
    insertionSort(arr)
    fmt.Println(arr)
}
```

```rust,editable
fn insertion_sort(arr: &mut Vec<i32>) {
    let n = arr.len();
    for i in 1..n {
        let key = arr[i];
        let mut j = i as i32 - 1;
        while j >= 0 && arr[j as usize] > key {
            arr[(j + 1) as usize] = arr[j as usize];
            j -= 1;
        }
        arr[(j + 1) as usize] = key;
    }
}

fn main() {
    let mut arr: Vec<i32> = vec![5, 3, 8, 1, 4];
    insertion_sort(&mut arr);
    println!("{:?}", arr);
}
```

</div>

<details>
<summary><strong>Trace — arr = [5, 3, 8, 1, 4]</strong></summary>

```
i=1: key=3, compare with arr[0]=5
  5 > 3 → shift: arr=[5, 5, 8, 1, 4], j=-1
  loop exits (j < 0)
  insert key at j+1=0: arr=[3, 5, 8, 1, 4]   (1 shift)

i=2: key=8, compare with arr[1]=5
  5 > 8? no, exit loop immediately
  insert key at j+1=2 (already there): arr=[3, 5, 8, 1, 4]   (0 shifts)

i=3: key=1, compare with arr[2]=8
  8 > 1 → shift: arr=[3, 5, 8, 8, 4], j=1
  arr[1]=5 > 1 → shift: arr=[3, 5, 5, 8, 4], j=0
  arr[0]=3 > 1 → shift: arr=[3, 3, 5, 8, 4], j=-1
  loop exits
  insert key at 0: arr=[1, 3, 5, 8, 4]   (3 shifts)

i=4: key=4, compare with arr[3]=8
  8 > 4 → shift: arr=[1, 3, 5, 8, 8], j=2
  arr[2]=5 > 4 → shift: arr=[1, 3, 5, 5, 8], j=1
  arr[1]=3 > 4? no, exit loop
  insert key at j+1=2: arr=[1, 3, 4, 5, 8]   (2 shifts)

Result: [1, 3, 4, 5, 8] ✓ — total shifts: 1+0+3+2 = 6
```

</details>

***

# Complexity Analysis

> **Course:** DSA › Algorithms › Sorting › Insertion Sort

| Resource | Best | Average | Worst |
|---|---|---|---|
| **Time** | `O(n)` | `O(n²)` | `O(n²)` |
| **Space** | `O(1)` | `O(1)` | `O(1)` |
| **Stability** | ✓ | ✓ | ✓ |

---

## When Each Case Hits

**Best case (`O(n)`)** — Already-sorted input. Each new key is `≥` all previous elements, so the inner loop exits after the first comparison. Total: `n - 1` comparisons, `0` shifts.

**Worst case (`O(n²)`)** — Reverse-sorted input. Each new key is smaller than every element in the sorted prefix, so the inner loop has to shift the entire prefix. Total: `n(n-1)/2` shifts.

**Average case (`O(n²)`)** — Random input. On average, each key is shifted halfway through the sorted prefix. Total: `n(n-1)/4` shifts — same big-O, smaller constant than the worst case.

---

## The Adaptive Sweet Spot — `O(k·n)`

A particularly useful sub-case: if every element is at most `k` positions away from its final sorted position, insertion sort runs in `O(k·n)` time. For `k = O(1)` (constant displacement), this is `O(n)` — *linear time*.

This is why insertion sort dominates on almost-sorted data. Examples:
- A sorted log file with one entry out of order.
- A sorted database index where one record was just inserted.
- A leaderboard after a single user's score changed.

In each case, `k` is tiny (often 1) and insertion sort's `O(k·n)` is dramatically better than `O(n log n)`'s `n log n`.

---

## Why Insertion Sort Has the Lowest Constant Factor of the `O(n²)` Sorts

The inner loop is structurally simple: compare, shift, decrement. No branch on swap-or-skip; no auxiliary indexing variable like selection sort's `min_index`. Modern CPUs love this:
- The shift pattern is cache-friendly (linear memory access).
- The branch predictor handles the inner loop well (most iterations either keep going or exit).
- The compiler can sometimes vectorise the shift loop.

Bubble sort, by contrast, branches on every comparison (swap or skip) and writes more often. Selection sort spends most of its time finding the minimum (which doesn't reduce the comparison count).

---

## Key Takeaway

Insertion sort: `O(n)` best, `O(n²)` worst, `O(k·n)` for almost-sorted data, plus the lowest constant factor of any quadratic sort. This combination makes it the dominant choice for small or partially sorted inputs. Now we'll apply it to a problem.

***

# Insertion Sort Problem

> **Course:** DSA › Algorithms › Sorting › Insertion Sort

The canonical exercise.

---

## The Problem

Given an integer array `arr`, sort it in non-decreasing order **in place** using insertion sort.

```
Input:  arr = [2, 3, 2, 1, 5, 6]
Output: [1, 2, 2, 3, 5, 6]

Input:  arr = [6, 5, 4, 4, 4, 3, 2, 1]
Output: [1, 2, 3, 4, 4, 4, 5, 6]

Input:  arr = [1, 2, 3, 4, 5, 6]
Output: [1, 2, 3, 4, 5, 6]   (already sorted, runs in O(n))
```

---

## The Solution

The implementation matches the version above; reproduced below for completeness.

<div class="lang-tabs">

```pseudocode
function insertionSort(arr):
    n ← length(arr)
    for i from 1 to n − 1:
        key ← arr[i]
        j ← i − 1
        while j ≥ 0 AND arr[j] > key:
            arr[j + 1] ← arr[j]
            j ← j − 1
        arr[j + 1] ← key
```

```python,editable
from typing import List

class Solution:
    def insertion_sort(self, arr: List[int]) -> None:
        n = len(arr)
        for i in range(1, n):
            key = arr[i]
            j = i - 1
            while j >= 0 and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j + 1] = key


if __name__ == "__main__":
    arr = [2, 3, 2, 1, 5, 6]
    Solution().insertion_sort(arr)
    print(arr)
```

```java,editable
public class Solution {
    public void insertionSort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
}
```

```c,editable
#include <stdio.h>

void insertion_sort(int *arr, int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
```

```cpp,editable
#include <vector>

class Solution {
public:
    void insertionSort(std::vector<int>& arr) {
        int n = (int) arr.size();
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
};
```

```scala,editable
class Solution {
  def insertionSort(arr: Array[Int]): Unit = {
    for (i <- 1 until arr.length) {
      val key = arr(i)
      var j = i - 1
      while (j >= 0 && arr(j) > key) {
        arr(j + 1) = arr(j)
        j -= 1
      }
      arr(j + 1) = key
    }
  }
}
```

```typescript,editable
class Solution {
    insertionSort(arr: number[]): void {
        for (let i = 1; i < arr.length; i++) {
            const key = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
}
```

```go,editable
package main

func insertionSort(arr []int) {
    for i := 1; i < len(arr); i++ {
        key := arr[i]
        j := i - 1
        for j >= 0 && arr[j] > key {
            arr[j+1] = arr[j]
            j--
        }
        arr[j+1] = key
    }
}
```

```rust,editable
fn insertion_sort(arr: &mut Vec<i32>) {
    for i in 1..arr.len() {
        let key = arr[i];
        let mut j = i as i32 - 1;
        while j >= 0 && arr[j as usize] > key {
            arr[(j + 1) as usize] = arr[j as usize];
            j -= 1;
        }
        arr[(j + 1) as usize] = key;
    }
}
```

</div>

---

## Edge Cases

| Case | Example | Expected |
|---|---|---|
| Empty | `[]` | `[]` (loop doesn't execute). |
| Single element | `[7]` | `[7]`. |
| Already sorted | `[1, 2, 3]` | `[1, 2, 3]` (best case, `O(n)`). |
| Reverse sorted | `[5, 4, 3, 2, 1]` | `[1, 2, 3, 4, 5]` (worst case, `O(n²)`). |
| All equal | `[3, 3, 3]` | `[3, 3, 3]` (best case — equality doesn't trigger shift). |
| Two elements | `[2, 1]` | `[1, 2]`. |

---

## Final Takeaway

Insertion sort is the best of the `O(n²)` sorts and the small-input workhorse of every modern sorting library. Adaptive (`O(n)` best case), stable, in-place, online — and unlike bubble or selection sort, you'll *actually use* it in production code (as the small-array fallback inside hybrid sorts).

The next algorithm — counting sort — breaks the comparison-sort family entirely. Instead of comparing pairs, it counts occurrences. The result: `O(n + k)` time where `k` is the value range. For small `k`, that's linear-time sorting.

**Transfer challenge — try before the Counting Sort lesson:** Write a *binary insertion sort* — instead of linearly scanning the sorted prefix to find the insertion point, use binary search. What's the new complexity? Why doesn't this make insertion sort `O(n log n)`?

<details>
<summary><strong>Answer — open after you've thought about it</strong></summary>

Binary insertion sort uses binary search to find the insertion point in `O(log i)` instead of `O(i)`. Total comparisons: `O(n log n)`.

But the *shifts* are still `O(n²)` — finding the insertion point doesn't help you avoid moving all the larger elements one position right. Total time stays `O(n²)`.

```python,editable
import bisect
class Solution:
    def binary_insertion_sort(self, arr):
        for i in range(1, len(arr)):
            key = arr[i]
            pos = bisect.bisect_left(arr, key, 0, i)   # O(log i)
            arr[pos+1:i+1] = arr[pos:i]                 # O(i) shifts — still quadratic
            arr[pos] = key
```

This is the small but real reason `O(n log n)` algorithms (merge sort, quicksort) win for large inputs: they avoid the `O(n²)` shift cost by structurally rearranging the data, not by linear shuffling. **You just hit the wall that motivates divide-and-conquer.**

</details>
