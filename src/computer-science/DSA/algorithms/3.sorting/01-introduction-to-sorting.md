# 1. Introduction to Sorting

Your phone has ten contacts. Finding "Sarah" takes a second; you scan the list and there she is. Now imagine your phone has *ten thousand* contacts, dropped in randomly, no order at all. The same act of finding Sarah just turned into "scroll past nine hundred and ninety-nine other names hoping you don't miss her." The list got 1,000 times bigger; the work got 1,000 times worse. **The cost of disorder grows in lockstep with the size of the data.**

Sorting is the fix. By imposing one simple rule — *every element comes before the next when ordered by some criterion* — we collapse a problem that scales linearly with `n` (find one item by scanning all of them) into one that scales logarithmically with `n` (binary search a sorted list). At interview scale, that's a 30× speed-up. At Google scale, it's the difference between "search returns in milliseconds" and "search times out."

By the end of this lesson you'll know what sorting is, why it's the silent foundation under most algorithms in this course, the six dimensions sorting algorithms get classified along (and the trade-offs they expose), and how to write the simplest sorting-related function: a verifier that checks if an array is already sorted.

## Table of contents

1. [Why disorder gets worse with scale](#why-disorder-gets-worse-with-scale)
2. [Sorting as a universal fix](#sorting-as-a-universal-fix)
3. [Classification of sorting algorithms](#classification-of-sorting-algorithms)
4. [Order check](#order-check)

***

# Why Disorder Gets Worse With Scale

> **Course:** DSA › Algorithms › Sorting › Introduction

Disorganised information feels harmless when there's a little of it. When there's a lot, it becomes the bottleneck. Three concrete examples show why.

---

## Finding a Contact in Your Phone

Imagine your phone has only ten contacts. Finding "Sarah" takes seconds — you scan, she's there, done. Even if the names are stored in random order, there aren't many places for her to hide. At this scale, the absence of order is invisible.

```d2
direction: right

phone_small: "Phone — 10 contacts" {
  grid-rows: 5
  grid-columns: 2
  grid-gap: 0
  c1: "Mike"
  c2: "Aaron"
  c3: "Sarah" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  c4: "Tom"
  c5: "Lisa"
  c6: "Kevin"
  c7: "Bob"
  c8: "Emma"
  c9: "Alex"
  c10: "Cara"
}
```

<p align="center"><strong>Ten random contacts. Sarah is highlighted. Scanning is fast — there are only nine other places to check.</strong></p>

Now imagine your phone has *ten thousand* contacts, all saved randomly. Suddenly the same task — *find Sarah* — is overwhelming. You're scrolling through page after page; even if Sarah is on page 47, you've scrolled through pages 1–46 to confirm she's not there.

```d2
direction: right

phone_big: "Phone — 10,000 contacts (random order)" {
  page: "page 1\n— Mike, Aaron, Tom, Bob..."
  dots: "...500 pages..."
  here: "page 47\n— ...Sarah..." {style.fill: "#fde68a"; style.stroke: "#d97706"}
  more: "...pages 48-1000"
}
```

<p align="center"><strong>The same task with 10,000 random entries. Finding Sarah requires scanning, on average, half the list — about 5,000 names.</strong></p>

That's a *thousand-fold* increase in work for a hundred-fold increase in data. The blow-up is *super-linear* because we have to do more work *per element* on top of having more elements. Sorting fixes this.

---

## Online Stores Showing Products

A small store with ten products lets a shopper compare every option at a glance. A massive marketplace with millions of products forces tools — filters, search, sort by price — onto the user just to make the inventory navigable.

```d2
direction: right

small: "Store — 10 products" {
  shape: oval
  label: "every item visible\nat a glance"
  style.fill: "#bbf7d0"
  style.stroke: "#16a34a"
}

big: "Store — 10 million products" {
  shape: oval
  label: "without filters / sort,\nthe inventory is unusable"
  style.fill: "#fecaca"
  style.stroke: "#dc2626"
}
```

<p align="center"><strong>The qualitative jump from "browse-able" to "unusable" happens somewhere around the scale where you can no longer hold the inventory in working memory. Sorting + filtering is the workaround.</strong></p>

For the store *owner*, the gap is even larger. Updating inventory, tracking trends, identifying dead stock — all of these become exponentially harder if the underlying data isn't ordered.

---

## Organising Student Grades

A class of ten students lets a teacher manually identify top performers and stragglers. A university with hundreds of thousands of students requires *systems* — and those systems lean entirely on sort-based algorithms (rank, top-K, distribution analysis) to surface the relevant subset.

```d2
direction: right

class_small: "Class — 10 students" {
  grid-rows: 1
  grid-columns: 5
  grid-gap: 0
  s1: "84"
  s2: "76"
  s3: "92" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  s4: "68"
  s5: "(...5 more)"
}

uni_big: "University — 200,000 students\n(without sorting, top-100 is impossible)" {style.fill: "#fecaca"; style.stroke: "#dc2626"}
```

<p align="center"><strong>The same task — "show me the top performers" — collapses from "look at the list" to "run a sort over a database" as scale grows. The algorithm doesn't change; the cost of doing it manually does.</strong></p>

> *Pause and predict — for each of the three scenarios, sketch what the work looks like with sorted data instead of random. How does the per-query cost change?*

With sorted contacts: jump straight to the "S" section — Sarah is among ~400 names, scannable in seconds. With sorted products by price: skip directly to the price range you care about, ignore the rest. With sorted grades: top performers are at the top of the list, no scanning required.

The pattern is the same in all three cases. **Sorting changes the per-query cost from linear to logarithmic** — the difference between "look at every item" and "binary-search to the right spot."

---

## Key Takeaway

The cost of disorder scales worse than linearly with data size. Sorting fixes this once, ahead of time, so every later query pays a much smaller price. Next, we'll formalise what sorting *is* and why it's hiding inside almost every other algorithm in this course.

***

# Sorting as a Universal Fix

> **Course:** DSA › Algorithms › Sorting › Introduction

> **Sorting** is the arrangement of items in a specific order — typically ascending or descending — based on some comparison criterion (numeric value, alphabetical order, custom rule, etc.).

That's the definition. The leverage comes from what *follows* sorting. A sorted list is the foundation for:

- **Binary search** — `O(log n)` lookups instead of `O(n)`. We saw this in the Searching chapter's Binary Search lesson.
- **Median, percentiles, top-K** — `O(1)` after sorting; otherwise `O(n)` per query.
- **Merging multiple datasets** — sorted inputs merge in a single pass; unsorted inputs need a second sort or a hash join.
- **Detecting duplicates / running uniqueness checks** — adjacent equal elements after sorting; constant-space scan.
- **Range queries** — sorted indices let you answer "all items between X and Y" in `O(log n + k)` where k is the count.

Most non-trivial software has *something* sorted somewhere. Database indexes, search engines, file systems, query optimisers, machine-learning preprocessing pipelines — all rely on sort-based primitives.

---

## What Comes Out of This Section

The next 11 lessons cover the canonical sorting algorithms, in roughly this order:

| File | Algorithm | Family | When to use |
|---|---|---|---|
| 02 | Bubble sort | Comparison-based, in-place | Teaching, very small inputs |
| 03 | Selection sort | Comparison-based, in-place | When swap count is the bottleneck (memory writes are expensive) |
| 04 | Insertion sort | Comparison-based, in-place, adaptive | Almost-sorted inputs, small inputs |
| 05 | Counting sort | Counting-based, out-of-place | Small integer ranges |
| 06–08 | Quicksort variants | Comparison-based, in-place, divide-and-conquer | General-purpose, average `O(n log n)` |
| 09 | Merge sort | Comparison-based, out-of-place, divide-and-conquer | When stability is required, external sorting |
| 10 | Heap sort | Comparison-based, in-place | When worst-case `O(n log n)` matters |
| 11 | Quickselect (pattern) | Quicksort variant for top-K | Finding `k`-th element in `O(n)` average |
| 12 | Custom compare (pattern) | Adapter for any sort | Sorting by composite or custom criteria |

Each algorithm makes specific trade-offs across **time complexity**, **space complexity**, **stability**, and **adaptiveness**. The next section names those trade-offs precisely so you can talk about them with the right vocabulary.

---

## Key Takeaway

Sorting is the universal pre-processing step that turns expensive per-query work into a one-time cost. The next 11 lessons are 11 different ways to do the same thing — each optimised for a different set of trade-offs. Before we look at any of them, we need a vocabulary for the trade-offs.

***

# Classification of Sorting Algorithms

> **Course:** DSA › Algorithms › Sorting › Introduction

Sorting algorithms differ along **six axes**. Knowing all six lets you read any algorithm's complexity table at a glance and predict whether it's the right tool for a given input. We'll re-encounter every one of these properties when we discuss specific algorithms in the upcoming files.

---

## Axis 1 — Comparison-Based vs Counting-Based

A **comparison-based** algorithm decides ordering by *comparing pairs of elements* (less-than, greater-than, equal). The output is a permutation of the input that satisfies the comparison rule.

A **counting-based** algorithm doesn't compare elements — it counts how many elements have each possible value, then reconstructs the sorted list from the counts. This works only when the value range is small (e.g., integers in `[0, 1000]`).

```d2
direction: right

comp: "Comparison sort" {
  shape: oval
  label: "uses < / > / ==\nworks on any orderable type\nO(n log n) lower bound"
  style.fill: "#dbeafe"
  style.stroke: "#3b82f6"
}

count: "Counting sort" {
  shape: oval
  label: "counts values, reconstructs\nworks on bounded integer ranges\nO(n + k) where k = range size"
  style.fill: "#fde68a"
  style.stroke: "#d97706"
}
```

<p align="center"><strong>Comparison sort vs counting sort. Comparison sort is universal but bounded by <code>O(n log n)</code>; counting sort beats this bound when the value range is bounded.</strong></p>

**Examples** — Bubble, Selection, Insertion, Quicksort, Merge sort, Heapsort are all comparison-based. Counting sort (the Counting Sort lesson) is the canonical counting-based example.

---

## Axis 2 — Stable vs Unstable

A **stable** sort preserves the relative order of equal elements. If two records have equal keys and one came first in the input, that one comes first in the output too.

An **unstable** sort makes no such guarantee. Equal elements may end up in any order relative to each other.

```d2
direction: down

input: "Input (sort by grade)" {
  grid-rows: 1
  grid-columns: 3
  grid-gap: 0
  a: "(Alice, 85)"
  b: "(Bob, 85)"
  c: "(Carol, 80)"
}

stable: "Stable sort output" {
  grid-rows: 1
  grid-columns: 3
  grid-gap: 0
  a: "(Carol, 80)"
  b: "(Alice, 85)"
  c: "(Bob, 85)"
}

unstable: "Unstable sort output" {
  grid-rows: 1
  grid-columns: 3
  grid-gap: 0
  a: "(Carol, 80)"
  b: "(Bob, 85)"
  c: "(Alice, 85)"
}

input -> stable: stable sort (Alice before Bob, as in input)
input -> unstable: unstable sort (order of equal-key elements can flip)
```

<p align="center"><strong>Stability matters when sorting by multiple keys in sequence. Stable sort preserves the relative order of equal elements; unstable sort does not.</strong></p>

**Why stability matters.** When you sort by *two* keys (say, first by grade, then by name), stability preserves the secondary order. With an unstable sort you'd have to sort by name first then grade, and even then it's not always reliable.

**Examples** — Bubble, Insertion, Merge sort are stable. Selection, Quicksort, Heapsort are unstable.

---

## Axis 3 — In-Place vs Out-of-Place

An **in-place** algorithm sorts the input array directly, using only `O(1)` (or `O(log n)` for recursive variants) extra memory.

An **out-of-place** algorithm allocates auxiliary memory proportional to the input size — typically `O(n)`.

```d2
direction: right

in_place: "In-place" {
  shape: oval
  label: "mutates input directly\nO(1) extra memory"
  style.fill: "#bbf7d0"
  style.stroke: "#16a34a"
}

out_of_place: "Out-of-place" {
  shape: oval
  label: "allocates auxiliary array\nO(n) extra memory"
  style.fill: "#fecaca"
  style.stroke: "#dc2626"
}
```

<p align="center"><strong>In-place vs out-of-place. The trade-off is between memory cost and algorithmic flexibility — out-of-place often allows simpler / cleaner divide-and-conquer.</strong></p>

**Why it matters.** On embedded systems, in-place algorithms are non-negotiable — there isn't memory to spare. On modern systems with abundant RAM, the trade-off is often won by out-of-place algorithms because their cleaner structure makes them easier to parallelise.

**Examples** — Bubble, Selection, Insertion, Heapsort, Quicksort are in-place. Merge sort and Counting sort are out-of-place.

---

## Axis 4 — Adaptive vs Non-Adaptive

An **adaptive** algorithm runs faster on inputs that are partially or fully sorted. Some adaptive algorithms recognise sorted prefixes and skip work; others detect "no swaps needed" and exit early.

A **non-adaptive** algorithm runs in the same time regardless of input order — sorted or random or reverse-sorted, the work is identical.

**Why it matters.** Real-world data is often *almost* sorted (a stream that's mostly chronological with a few latencies, a list with one element out of place). Adaptive algorithms exploit this for big speed-ups in practice.

**Examples** — Bubble (with the early-exit optimisation), Insertion sort are adaptive. Selection sort, Merge sort, Heapsort are non-adaptive.

---

## Axis 5 — Internal vs External

An **internal** sort assumes the entire dataset fits in main memory.

An **external** sort handles datasets too large for memory, streaming through disk or cloud storage in chunks.

We won't focus on external sorting in this section, but mention it because it's a major engineering concern at scale (think log analysis, batch ETL pipelines). External sort is typically a variant of merge sort.

---

## Axis 6 — Recursive vs Iterative

A **recursive** algorithm uses divide-and-conquer or self-similar reduction (mergesort, quicksort). Stack depth is `O(log n)` typically.

An **iterative** algorithm uses simple loops. Stack depth is `O(1)`.

The line is blurry — most recursive algorithms have iterative equivalents (often using an explicit stack) and vice versa. The choice is usually about clarity vs. constant-factor performance.

---

## Putting It All Together

Below is the full classification table for the algorithms covered in this section. Use it as a reference when choosing a sort.

| Algorithm | Comparison? | Stable? | In-place? | Adaptive? | Best | Avg | Worst |
|---|---|---|---|---|---|---|---|
| Bubble sort | ✓ | ✓ | ✓ | ✓ | `O(n)` | `O(n²)` | `O(n²)` |
| Selection sort | ✓ | ✗ | ✓ | ✗ | `O(n²)` | `O(n²)` | `O(n²)` |
| Insertion sort | ✓ | ✓ | ✓ | ✓ | `O(n)` | `O(n²)` | `O(n²)` |
| Counting sort | ✗ | ✓ | ✗ | ✗ | `O(n+k)` | `O(n+k)` | `O(n+k)` |
| Quicksort | ✓ | ✗ | ✓ | ✗ | `O(n log n)` | `O(n log n)` | `O(n²)` |
| Merge sort | ✓ | ✓ | ✗ | ✗ | `O(n log n)` | `O(n log n)` | `O(n log n)` |
| Heapsort | ✓ | ✗ | ✓ | ✗ | `O(n log n)` | `O(n log n)` | `O(n log n)` |

There's no "best" algorithm — only the right choice for a given combination of input size, value range, stability requirements, memory constraints, and worst-case guarantees. The next 11 files unpack each algorithm and the conditions under which it wins.

---

## Key Takeaway

Six axes — comparison-vs-counting, stable-vs-unstable, in-place-vs-out-of-place, adaptive-vs-non-adaptive, internal-vs-external, recursive-vs-iterative — describe every sorting algorithm. Knowing the axis values is enough to predict whether a given algorithm fits a given problem. Now we'll write the simplest sort-adjacent function: a verifier.

***

# Order Check

> **Course:** DSA › Algorithms › Sorting › Introduction

A warm-up that sets up the rest of the section. Before we sort, we need a way to *verify* that an array is sorted — both as a building block (some algorithms terminate when the input is detected as sorted) and as a sanity check (we'll use this to validate every sort we write later).

---

## The Problem

Given an integer array `arr`, return `true` if it's sorted in non-decreasing order, else `false`. ("Non-decreasing" means duplicates are allowed; `[1, 1, 2]` is non-decreasing.)

```
Input:  arr = [1, 2, 3, 4, 5]
Output: true

Input:  arr = [1, 1, 1, 4, 5]
Output: true

Input:  arr = [1, 3, 1, 4, 5]
Output: false
```

---

## What Does "Sorted" Mean Operationally?

Non-decreasing order means every adjacent pair `(arr[i-1], arr[i])` satisfies `arr[i-1] ≤ arr[i]`. Equivalently: there's no pair where the left element is *strictly larger* than the right.

```d2
direction: right

ok: "Sorted" {
  grid-rows: 2
  grid-columns: 5
  grid-gap: 0
  a0: "1"
  a1: "2"
  a2: "3"
  a3: "4"
  a4: "5"
  c0: "✓"
  c1: "✓"
  c2: "✓"
  c3: "✓"
  c4: ""
}

bad: "Not sorted" {
  grid-rows: 2
  grid-columns: 5
  grid-gap: 0
  a0: "1"
  a1: "3"
  a2: "1" {style.fill: "#fecaca"; style.stroke: "#dc2626"}
  a3: "4"
  a4: "5"
  c0: "✓"
  c1: "✗" {style.fill: "#fecaca"; style.stroke: "#dc2626"}
  c2: "✓"
  c3: "✓"
  c4: ""
}
```

<p align="center"><strong>The check: every adjacent pair must satisfy <code>a[i-1] ≤ a[i]</code>. The first violation lets us return <code>false</code> immediately.</strong></p>

---

## The Algorithm

A single linear scan. For each `i` from `1` to `n-1`, compare `arr[i]` with `arr[i-1]`. If we ever see `arr[i] < arr[i-1]`, return `false`. If the loop completes without finding a violation, the array is sorted.

> *Predict before reading on — what should the algorithm return for an empty array? An array of length 1?*

Both are vacuously sorted — there are no pairs to compare, so the loop body never executes and the function returns `true`. (This is the right convention; many sorts implicitly rely on it.)

---

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def order_check(self, arr: List[int]) -> bool:
        # Empty or single-element arrays are vacuously sorted
        for i in range(1, len(arr)):
            if arr[i] < arr[i - 1]:           # first violation → not sorted
                return False
        return True


if __name__ == "__main__":
    print(Solution().order_check([1, 2, 3, 4, 5]))   # True
    print(Solution().order_check([1, 1, 1, 4, 5]))   # True
    print(Solution().order_check([1, 3, 1, 4, 5]))   # False
```

```java,editable
public class Solution {
    public boolean orderCheck(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().orderCheck(new int[]{1, 2, 3, 4, 5}));   // true
    }
}
```

```c,editable
#include <stdio.h>
#include <stdbool.h>

bool order_check(int *arr, int n) {
    for (int i = 1; i < n; i++) {
        if (arr[i] < arr[i - 1]) return false;
    }
    return true;
}

int main(void) {
    int a[] = {1, 2, 3, 4, 5};
    printf("%s\n", order_check(a, 5) ? "true" : "false");
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

class Solution {
public:
    bool orderCheck(const std::vector<int>& arr) {
        for (int i = 1; i < (int) arr.size(); i++) {
            if (arr[i] < arr[i - 1]) return false;
        }
        return true;
    }
};

int main() {
    std::cout << std::boolalpha << Solution{}.orderCheck({1, 2, 3, 4, 5}) << '\n';   // true
}
```

```scala,editable
class Solution {
  def orderCheck(arr: Array[Int]): Boolean = {
    for (i <- 1 until arr.length) {
      if (arr(i) < arr(i - 1)) return false
    }
    true
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    println(new Solution().orderCheck(Array(1, 2, 3, 4, 5)))   // true
  }
}
```

```javascript,editable
class Solution {
    orderCheck(arr) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) return false;
        }
        return true;
    }
}

console.log(new Solution().orderCheck([1, 2, 3, 4, 5]));   // true
```

```typescript,editable
class Solution {
    orderCheck(arr: number[]): boolean {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) return false;
        }
        return true;
    }
}

console.log(new Solution().orderCheck([1, 2, 3, 4, 5]));   // true
```

```go,editable
package main

import "fmt"

func orderCheck(arr []int) bool {
    for i := 1; i < len(arr); i++ {
        if arr[i] < arr[i-1] {
            return false
        }
    }
    return true
}

func main() {
    fmt.Println(orderCheck([]int{1, 2, 3, 4, 5}))   // true
}
```

```kotlin,editable
class Solution {
    fun orderCheck(arr: IntArray): Boolean {
        for (i in 1 until arr.size) {
            if (arr[i] < arr[i - 1]) return false
        }
        return true
    }
}

fun main() {
    println(Solution().orderCheck(intArrayOf(1, 2, 3, 4, 5)))   // true
}
```

```rust,editable
fn order_check(arr: &[i32]) -> bool {
    for i in 1..arr.len() {
        if arr[i] < arr[i - 1] { return false; }
    }
    true
}

fn main() {
    println!("{}", order_check(&[1, 2, 3, 4, 5]));   // true
}
```

</div>

<details>
<summary><strong>Trace — arr = [1, 3, 1, 4, 5]</strong></summary>

```
i=1: arr[1]=3, arr[0]=1 → 3 < 1? no, continue
i=2: arr[2]=1, arr[1]=3 → 1 < 3? YES → return false

Result: false (violation found at index 2)
```

</details>

---

## Complexity Analysis

| Resource | Cost | Why |
|---|---|---|
| **Time** | `O(n)` worst case | Single linear scan. |
| **Space** | `O(1)` | No auxiliary data structures. |
| **Time (best case)** | `O(1)` | If the very first pair violates, we return immediately. |

This is as efficient as any verifier can be — you fundamentally have to look at every adjacent pair (or detect a violation early) to know whether the array is sorted.

---

## Edge Cases

| Case | Example | Expected | Reasoning |
|---|---|---|---|
| Empty | `[]` | `true` | No pairs to check; vacuously sorted. |
| Single element | `[5]` | `true` | No pairs; vacuously sorted. |
| Two equal | `[3, 3]` | `true` | `3 < 3` is false; non-decreasing allows duplicates. |
| Two reversed | `[3, 1]` | `false` | First and only pair violates. |
| All equal | `[5, 5, 5, 5]` | `true` | Every adjacent pair satisfies `≤`. |
| Strictly descending | `[5, 4, 3, 2, 1]` | `false` | First pair already violates. |

---

## Final Takeaway

Order check is a single linear scan — the simplest sort-adjacent function. We'll use this as the validator for every sorting algorithm in the next 11 files, and several adaptive sorts (like the optimised bubble sort in the Bubble Sort lesson) use this idea internally to detect "the array is now sorted, exit early."

You came in suspecting sorting was a single algorithm. You're leaving with the vocabulary for six classification axes, an understanding of why sorting is the silent foundation under most algorithms in this course, and a working verifier you'll use to validate every sort that follows.

**Transfer challenge — try before the Bubble Sort lesson:** Write a function that returns the index of the *first* violation in a non-decreasing array, or `-1` if the array is sorted. (Same algorithm, different return value.) Then think about how this fits into an "early-exit" optimisation for bubble sort.

<details>
<summary><strong>Answer — open after you've written it</strong></summary>

```python,editable
class Solution:
    def first_violation(self, arr):
        for i in range(1, len(arr)):
            if arr[i] < arr[i - 1]:
                return i
        return -1


print(Solution().first_violation([1, 3, 1, 4, 5]))   # 2
print(Solution().first_violation([1, 2, 3, 4, 5]))   # -1
```

The change: instead of `return False`, return the index `i`. Same time and space.

This generalises the verifier into a tool that can be used by adaptive sorts. Bubble sort, for instance, can use a variant of this to detect when no swaps were needed in a pass and exit early — the optimisation introduced in the Bubble Sort lesson. The sorted-prefix-detection that adaptive sorts rely on is *exactly* this kind of incremental check.

</details>
