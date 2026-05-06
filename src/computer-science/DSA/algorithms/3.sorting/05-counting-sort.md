# 5. Counting Sort

You're a teacher with thousands of answer sheets, each scored from 0 to 100, that need sorting by score. You could use insertion sort, selection sort, or any of the comparison-based sorts from the previous lessons — but they'd all do millions of comparisons. **There's a faster way that doesn't compare any two scores against each other.** Just count how many sheets got each score (0, 1, 2, ..., 100), then walk through the score range in order and pull out the right number of sheets at each score. The total work is proportional to *the number of sheets plus the range of scores* — not `n log n`, not `n²`. **Linear time when the range is small.**

This is counting sort. It breaks the `Ω(n log n)` lower bound that limits all comparison-based sorts because it doesn't *compare* — it *counts*. The price: you need to know the range of values upfront, and the algorithm uses `O(n + k)` extra memory where `k` is the range. For small `k` (small integer ranges, characters in an alphabet, dates within a year), counting sort is unbeatable.

By the end of this lesson you'll know the three-phase counting sort algorithm, why the cumulative-sum step is the load-bearing trick that makes it stable, why it can't be in-place, and the precise conditions under which counting sort beats every comparison-based algorithm in this section.

## Table of contents

1. [Understanding counting sort](#understanding-counting-sort)
2. [The three phases — count, accumulate, place](#the-three-phases--count-accumulate-place)
3. [Why counting sort is stable](#why-counting-sort-is-stable)
4. [Implementation](#implementation)
5. [Complexity analysis](#complexity-analysis)
6. [Counting sort problem](#counting-sort-problem)

***

# Understanding Counting Sort

> **Course:** DSA › Algorithms › Sorting › Counting Sort

Counting sort exploits a single fact: **if you know how many elements have each possible value, you know the position of every element in the sorted output.** It avoids comparisons entirely; it just counts and places.

The algorithm works in three phases:

1. **Count** — for each possible value `v` in the input range, count how many elements equal `v`.
2. **Accumulate** — turn the count array into a *cumulative count* array, so `count[v]` tells you how many elements are `≤ v` (i.e., the position where the last element of value `v` should go in the sorted output).
3. **Place** — walk the input array from the back, looking up each element's position in the cumulative count array, and place it in the output.

```d2
direction: right

input: "Input\narr = [2, 5, 3, 0, 2, 3, 0, 3]" {style.fill: "#dbeafe"; style.stroke: "#3b82f6"}
count: "Count phase\ncount = [2, 0, 2, 3, 0, 1]\n(indices 0..5)" {style.fill: "#fde68a"; style.stroke: "#d97706"}
cumul: "Cumulative phase\ncount = [2, 2, 4, 7, 7, 8]\n(positions in output)" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
output: "Place phase\nresult = [0, 0, 2, 2, 3, 3, 3, 5]" {style.fill: "#ede9fe"; style.stroke: "#7c3aed"}

input -> count: count occurrences
count -> cumul: prefix sum
cumul -> output: walk input back-to-front, place each element
```

<p align="center"><strong>The three phases of counting sort. Phase 1 counts; phase 2 turns counts into positions; phase 3 places elements directly. No comparisons, no swaps.</strong></p>

---

## The Answer-Sheet Walkthrough

Imagine sorting 8 answer sheets with scores `[2, 5, 3, 0, 2, 3, 0, 3]` where scores range from 0 to 5.

**Phase 1 — Count.** Walk the input once and tally each score:
- score 0: 2 sheets
- score 1: 0 sheets
- score 2: 2 sheets
- score 3: 3 sheets
- score 4: 0 sheets
- score 5: 1 sheet

`count = [2, 0, 2, 3, 0, 1]`.

**Phase 2 — Accumulate.** Convert counts to cumulative positions. After this transformation, `count[v]` represents the number of elements `≤ v` — i.e., where the *last* element with score `v` should be placed (well, one past it, but we'll handle that with the decrement in phase 3).

| Index | Original count | After accumulation |
|---|---|---|
| 0 | 2 | 2 |
| 1 | 0 | 2 + 0 = 2 |
| 2 | 2 | 2 + 2 = 4 |
| 3 | 3 | 4 + 3 = 7 |
| 4 | 0 | 7 + 0 = 7 |
| 5 | 1 | 7 + 1 = 8 |

`count = [2, 2, 4, 7, 7, 8]`. Reading off: 2 elements are `≤ 0`, so they occupy output positions 0 and 1. 4 elements are `≤ 2`, so position 3 is the last spot for a `2`. And so on.

**Phase 3 — Place.** Walk the input *in reverse*. For each element `v`, its target position in the output is `count[v] - 1`. After placing, decrement `count[v]` so the next instance of `v` (which we encounter earlier in the reverse walk) goes one slot to the left.

```
Input (reverse): 3 0 3 2 0 3 5 2

For each element, look up count[v] - 1, place, then decrement count[v]:

  3 → count[3] = 7 → place at index 6, count[3] = 6
  0 → count[0] = 2 → place at index 1, count[0] = 1
  3 → count[3] = 6 → place at index 5, count[3] = 5
  2 → count[2] = 4 → place at index 3, count[2] = 3
  0 → count[0] = 1 → place at index 0, count[0] = 0
  3 → count[3] = 5 → place at index 4, count[3] = 4
  5 → count[5] = 8 → place at index 7, count[5] = 7
  2 → count[2] = 3 → place at index 2, count[2] = 2

Result: [0, 0, 2, 2, 3, 3, 3, 5] ✓
```

---

## What Makes Counting Sort Different

Every sort we've seen so far compares pairs of elements: bubble compares adjacent, insertion compares `key` with sorted prefix, selection compares to find the minimum. Counting sort never compares two input elements. It compares each element against the count array's index — but that's an array lookup, not a comparison. **The comparison-sort lower bound of `Ω(n log n)` doesn't apply.**

The trade-off: counting sort needs `O(k)` extra memory where `k` is the value range, and it needs to know `k` upfront. For unbounded inputs (arbitrary integers, floats, strings), counting sort doesn't apply directly — though it's used as a building block in algorithms like radix sort that do.

> *Pause and predict — for an array of 1,000,000 integers, would you use counting sort if the values are in <code>[0, 100]</code>? What about <code>[0, 1,000,000,000]</code>?*

For `[0, 100]`: counting sort wins by orders of magnitude. `O(n + k) = O(1,000,000 + 100) = O(n)`. For `[0, 1,000,000,000]`: counting sort would allocate a billion-cell array — almost certainly out of memory. `O(n + k) = O(n + 10⁹)` is dominated by `k`. Use a comparison sort instead.

---

## Strengths and Limitations

| Strength | Detail |
|---|---|
| **Linear time when k is small** | `O(n + k)` total. For `k = O(n)`, this is `O(n)`. |
| **Stable** | Phase 3's reverse walk + post-decrement preserves relative order of equal elements. |
| **No comparisons** | Avoids the `Ω(n log n)` lower bound for comparison-based sorts. |

| Limitation | Detail |
|---|---|
| **Not in-place** | Needs `O(n + k)` extra memory. |
| **Range-dependent** | Memory grows with `k`. Impractical for large value ranges. |
| **Integer-only (in pure form)** | Works on integers (or anything that maps to a small integer range). Doesn't directly handle floats or arbitrary objects. |
| **Not adaptive** | Always does the same `O(n + k)` work. |

In practice, counting sort is used:
1. As a standalone sort when values are small integers (counts, ages, scores, days of year).
2. As a sub-routine in radix sort, which handles larger integer ranges by sorting digit-by-digit with counting sort as the inner loop.
3. In histograms, frequency tables, and data summary operations where the count array is itself the desired output.

---

## Key Takeaway

Counting sort: count occurrences → cumulative sum → place by lookup. No comparisons. Linear time when the value range is small. The trade-off is `O(k)` extra memory. Now we'll formalise the three phases.

***

# The Three Phases — Count, Accumulate, Place

> **Course:** DSA › Algorithms › Sorting › Counting Sort

The algorithm has three nested but conceptually distinct phases. Each one does something specific; getting any one of them wrong (especially phase 2) breaks the whole sort.

---

## Phase 1 — Count

Allocate a `count` array of size `k + 1` (where `k` is the maximum value in the input). Initialise to `0`. Walk the input once, incrementing `count[arr[i]]` for each element.

After this phase: `count[v]` = number of times `v` appears in the input.

```d2
direction: down

before: "count[] starts at zero" {
  grid-rows: 1
  grid-columns: 6
  grid-gap: 0
  c0: "0"
  c1: "0"
  c2: "0"
  c3: "0"
  c4: "0"
  c5: "0"
}

after: "After phase 1 (input was [2, 5, 3, 0, 2, 3, 0, 3])" {
  grid-rows: 1
  grid-columns: 6
  grid-gap: 0
  c0: "2"
  c1: "0"
  c2: "2"
  c3: "3"
  c4: "0"
  c5: "1"
}

before -> after: O(n) walk over input, increment count[arr[i]]
```

<p align="center"><strong>Phase 1: count occurrences. <code>count[v]</code> stores the frequency of <code>v</code> in the input.</strong></p>

**Why allocate size `k + 1`?** We use values `0..k` as direct indices into the count array. To safely access `count[k]`, the array must have size at least `k + 1`.

---

## Phase 2 — Accumulate (Prefix Sum)

Convert the count array into a *cumulative sum*. For each `i` from `1` to `k`:

```
count[i] = count[i] + count[i - 1]
```

After this phase: `count[v]` = number of elements `≤ v` = the position (one past the last) in the sorted output where elements with value `v` end.

```d2
direction: down

before: "After phase 1 — frequencies" {
  grid-rows: 1
  grid-columns: 6
  grid-gap: 0
  c0: "2"
  c1: "0"
  c2: "2"
  c3: "3"
  c4: "0"
  c5: "1"
}

after: "After phase 2 — cumulative" {
  grid-rows: 1
  grid-columns: 6
  grid-gap: 0
  c0: "2"
  c1: "2"
  c2: "4"
  c3: "7"
  c4: "7"
  c5: "8"
}

before -> after: prefix sum, O(k) walk
```

<p align="center"><strong>Phase 2: prefix sum. Now <code>count[v]</code> tells us where the last element with value <code>v</code> goes in the output.</strong></p>

**Why is this the load-bearing step?** Without it, we'd know how many of each value we have but not *where* to put them. The cumulative sum turns the count array into a *position index* — the bridge between counting and placement.

---

## Phase 3 — Place

Walk the input *in reverse*. For each element `v`:
1. Look up `count[v]`.
2. Place the element at output index `count[v] - 1`.
3. Decrement `count[v]`.

After this phase: the output array holds the sorted elements.

```d2
direction: down

step1: "step 1 — process arr[7]=2 (going right-to-left)\ncount[2] = 4 → place at index 3, count[2] becomes 3" {style.fill: "#dbeafe"; style.stroke: "#3b82f6"}
step2: "step 2 — process arr[6]=0\ncount[0] = 2 → place at index 1, count[0] becomes 1" {style.fill: "#fde68a"; style.stroke: "#d97706"}
step3: "...continue for all 8 elements..."
final: "Final result = [0, 0, 2, 2, 3, 3, 3, 5]" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}

step1 -> step2 -> step3 -> final
```

<p align="center"><strong>Phase 3: place by lookup. Each element finds its slot in <code>O(1)</code> via the cumulative count.</strong></p>

**Why walk in reverse?** This is what makes counting sort *stable*. We'll explain this in the next section.

---

## Putting the Phases Together

```
function counting_sort(arr, k):
    # Phase 1: count
    count = array of size k+1, all zeros
    for v in arr:
        count[v] += 1

    # Phase 2: accumulate
    for i from 1 to k:
        count[i] += count[i - 1]

    # Phase 3: place
    result = array of size n
    for i from n-1 down to 0:
        result[count[arr[i]] - 1] = arr[i]
        count[arr[i]] -= 1

    return result
```

Three loops, total work `O(n + k)`. No comparisons. Done.

---

## Key Takeaway

Three phases: count → accumulate → place. The cumulative sum in phase 2 is the magic that turns a frequency table into a position index. Now we'll see why phase 3's reverse walk is what makes the algorithm stable.

***

# Why Counting Sort Is Stable

> **Course:** DSA › Algorithms › Sorting › Counting Sort

Stability matters when the elements are *records* with multiple fields (e.g., `(score, name)` tuples). Counting sort is stable — and the *reason* is the deliberate reverse walk in phase 3 combined with the post-decrement.

---

## A Concrete Example with Records

Suppose we sort student records by score, where two students share a score:

```
Input:  [(85, Alice), (80, Bob), (85, Carol)]
        ──────────────────────────────────────
        Indices:    0         1         2
```

For stability, we want Alice (score 85, originally at index 0) to come *before* Carol (also score 85, originally at index 2) in the output.

**Phase 1** — count[85] = 2, count[80] = 1.
**Phase 2** — count[80] = 1, count[85] = 1 + 2 = 3.

**Phase 3 — reverse walk:**

```
i=2: arr[2] = (85, Carol)
  count[85] = 3 → place at index 2, count[85] = 2
  result = [_, _, (85, Carol)]

i=1: arr[1] = (80, Bob)
  count[80] = 1 → place at index 0, count[80] = 0
  result = [(80, Bob), _, (85, Carol)]

i=0: arr[0] = (85, Alice)
  count[85] = 2 → place at index 1, count[85] = 1
  result = [(80, Bob), (85, Alice), (85, Carol)]
```

Alice ended up before Carol in the output, **preserving their input order**. ✓

---

## What Goes Wrong with a Forward Walk?

If we walked the input in forward order (`i = 0, 1, ..., n-1`), the *first* element with each value would be placed at the *highest* available slot for that value. Subsequent elements with the same value would be placed at progressively lower slots — flipping their order.

```
Forward walk on the same input:

i=0: arr[0] = (85, Alice) → count[85] = 3 → place at index 2, count[85] = 2
i=1: arr[1] = (80, Bob)   → count[80] = 1 → place at index 0, count[80] = 0
i=2: arr[2] = (85, Carol) → count[85] = 2 → place at index 1, count[85] = 1

result = [(80, Bob), (85, Carol), (85, Alice)]
```

Alice ends up *after* Carol — **instability**. The reverse walk avoids this by ensuring earlier-indexed elements get lower slots. *That's* why phase 3 walks the input from the back.

---

## When Stability Matters

Stability is essential when sorting by *multiple keys*. For example:

1. Sort by name (stable).
2. Sort by score (stable).

If both sorts are stable, the final output is sorted by score with ties broken alphabetically by name — *automatically*, without writing any custom comparator. With an unstable sort in step 2, you'd have to combine the keys explicitly.

This makes stable sorts (counting sort, merge sort, insertion sort, optimised bubble sort) the natural choice for multi-key sorting pipelines.

---

## Key Takeaway

Counting sort is stable because phase 3 walks the input in reverse and uses post-decrement on the cumulative count. The reverse walk is *deliberate*; flipping it to forward breaks stability. Now we'll write the implementation in all 10 languages.

***

# Implementation

> **Course:** DSA › Algorithms › Sorting › Counting Sort

<div class="lang-tabs">

```pseudocode
function countingSort(arr, k):                # k is the max value (range 0..k)
    n ← length(arr)

    # Phase 1 — count occurrences of each value.
    count ← list of (k + 1) zeros
    for each v in arr:
        count[v] ← count[v] + 1

    # Phase 2 — cumulative sum: count[v] = number of elements ≤ v.
    for i from 1 to k:
        count[i] ← count[i] + count[i − 1]

    # Phase 3 — place elements into result, scanning arr right-to-left for stability.
    result ← list of n zeros
    for i from n − 1 down to 0:
        count[arr[i]] ← count[arr[i]] − 1
        result[count[arr[i]]] ← arr[i]
    return result
```

```python,editable
from typing import List

class Solution:
    def counting_sort(self, arr: List[int], k: int) -> List[int]:
        n = len(arr)

        # Phase 1: count occurrences of each value
        count = [0] * (k + 1)
        for v in arr:
            count[v] += 1

        # Phase 2: cumulative sum — count[v] = number of elements ≤ v
        for i in range(1, k + 1):
            count[i] += count[i - 1]

        # Phase 3: place elements in reverse for stability
        result = [0] * n
        for i in range(n - 1, -1, -1):
            count[arr[i]] -= 1                   # equivalent to "decrement after lookup"
            result[count[arr[i]]] = arr[i]
        return result


if __name__ == "__main__":
    print(Solution().counting_sort([2, 5, 3, 0, 2, 3, 0, 3], 5))   # [0, 0, 2, 2, 3, 3, 3, 5]
```

```java,editable
public class Solution {
    public int[] countingSort(int[] arr, int k) {
        int n = arr.length;
        int[] count = new int[k + 1];
        for (int v : arr) count[v]++;
        for (int i = 1; i <= k; i++) count[i] += count[i - 1];

        int[] result = new int[n];
        for (int i = n - 1; i >= 0; i--) {
            count[arr[i]]--;
            result[count[arr[i]]] = arr[i];
        }
        return result;
    }

    public static void main(String[] args) {
        int[] r = new Solution().countingSort(new int[]{2, 5, 3, 0, 2, 3, 0, 3}, 5);
        for (int x : r) System.out.print(x + " ");
        System.out.println();
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int *counting_sort(int *arr, int n, int k) {
    int *count = (int *) calloc(k + 1, sizeof(int));
    for (int i = 0; i < n; i++) count[arr[i]]++;
    for (int i = 1; i <= k; i++) count[i] += count[i - 1];

    int *result = (int *) malloc(n * sizeof(int));
    for (int i = n - 1; i >= 0; i--) {
        count[arr[i]]--;
        result[count[arr[i]]] = arr[i];
    }
    free(count);
    return result;
}

int main(void) {
    int arr[] = {2, 5, 3, 0, 2, 3, 0, 3};
    int n = 8;
    int *r = counting_sort(arr, n, 5);
    for (int i = 0; i < n; i++) printf("%d ", r[i]);
    printf("\n");
    free(r);
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

class Solution {
public:
    std::vector<int> countingSort(std::vector<int>& arr, int k) {
        int n = (int) arr.size();
        std::vector<int> count(k + 1, 0);
        for (int v : arr) count[v]++;
        for (int i = 1; i <= k; i++) count[i] += count[i - 1];

        std::vector<int> result(n);
        for (int i = n - 1; i >= 0; i--) {
            count[arr[i]]--;
            result[count[arr[i]]] = arr[i];
        }
        return result;
    }
};

int main() {
    std::vector<int> arr = {2, 5, 3, 0, 2, 3, 0, 3};
    auto r = Solution{}.countingSort(arr, 5);
    for (int x : r) std::cout << x << ' ';
    std::cout << '\n';
}
```

```scala,editable
class Solution {
  def countingSort(arr: Array[Int], k: Int): Array[Int] = {
    val n = arr.length
    val count = Array.fill(k + 1)(0)
    for (v <- arr) count(v) += 1
    for (i <- 1 to k) count(i) += count(i - 1)

    val result = new Array[Int](n)
    for (i <- (n - 1) to 0 by -1) {
      count(arr(i)) -= 1
      result(count(arr(i))) = arr(i)
    }
    result
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    println(new Solution().countingSort(Array(2, 5, 3, 0, 2, 3, 0, 3), 5).mkString(" "))
  }
}
```

```typescript,editable
class Solution {
    countingSort(arr: number[], k: number): number[] {
        const n = arr.length;
        const count: number[] = new Array(k + 1).fill(0);
        for (const v of arr) count[v]++;
        for (let i = 1; i <= k; i++) count[i] += count[i - 1];

        const result: number[] = new Array(n);
        for (let i = n - 1; i >= 0; i--) {
            count[arr[i]]--;
            result[count[arr[i]]] = arr[i];
        }
        return result;
    }
}

console.log(new Solution().countingSort([2, 5, 3, 0, 2, 3, 0, 3], 5));
```

```go,editable
package main

import "fmt"

func countingSort(arr []int, k int) []int {
    n := len(arr)
    count := make([]int, k+1)
    for _, v := range arr {
        count[v]++
    }
    for i := 1; i <= k; i++ {
        count[i] += count[i-1]
    }
    result := make([]int, n)
    for i := n - 1; i >= 0; i-- {
        count[arr[i]]--
        result[count[arr[i]]] = arr[i]
    }
    return result
}

func main() {
    fmt.Println(countingSort([]int{2, 5, 3, 0, 2, 3, 0, 3}, 5))
}
```

```rust,editable
fn counting_sort(arr: &[i32], k: usize) -> Vec<i32> {
    let n = arr.len();
    let mut count = vec![0usize; k + 1];
    for &v in arr {
        count[v as usize] += 1;
    }
    for i in 1..=k {
        count[i] += count[i - 1];
    }
    let mut result = vec![0i32; n];
    for i in (0..n).rev() {
        count[arr[i] as usize] -= 1;
        result[count[arr[i] as usize]] = arr[i];
    }
    result
}

fn main() {
    println!("{:?}", counting_sort(&[2, 5, 3, 0, 2, 3, 0, 3], 5));
}
```

</div>

<details>
<summary><strong>Trace — arr = [2, 5, 3, 0, 2, 3, 0, 3], k = 5</strong></summary>

```
Phase 1 — count occurrences
  Initial: count = [0, 0, 0, 0, 0, 0]
  After: count = [2, 0, 2, 3, 0, 1]

Phase 2 — cumulative sum
  count = [2, 2, 4, 7, 7, 8]

Phase 3 — place in reverse
  result = [_, _, _, _, _, _, _, _]   (n = 8)

  i=7: arr[7]=3, count[3]=7 → count[3]=6, result[6]=3
  i=6: arr[6]=0, count[0]=2 → count[0]=1, result[1]=0
  i=5: arr[5]=3, count[3]=6 → count[3]=5, result[5]=3
  i=4: arr[4]=2, count[2]=4 → count[2]=3, result[3]=2
  i=3: arr[3]=0, count[0]=1 → count[0]=0, result[0]=0
  i=2: arr[2]=3, count[3]=5 → count[3]=4, result[4]=3
  i=1: arr[1]=5, count[5]=8 → count[5]=7, result[7]=5
  i=0: arr[0]=2, count[2]=3 → count[2]=2, result[2]=2

  result = [0, 0, 2, 2, 3, 3, 3, 5] ✓
```

</details>

***

# Complexity Analysis

> **Course:** DSA › Algorithms › Sorting › Counting Sort

| Resource | Best | Average | Worst |
|---|---|---|---|
| **Time** | `O(n + k)` | `O(n + k)` | `O(n + k)` |
| **Space** | `O(n + k)` | `O(n + k)` | `O(n + k)` |
| **Stability** | ✓ | ✓ | ✓ |
| **In-place** | ✗ | ✗ | ✗ |

---

## Why `O(n + k)` and Not Just `O(n)`?

Three loops:
1. Count loop: walks the `n`-element input → `O(n)`.
2. Accumulate loop: walks the `k+1`-element count array → `O(k)`.
3. Place loop: walks the `n`-element input → `O(n)`.

Total: `O(n) + O(k) + O(n) = O(n + k)`.

When `k = O(n)` (e.g., `k = 100` and `n = 100,000`), this collapses to `O(n)`. When `k >> n` (e.g., `k = 10⁹`, `n = 1000`), the algorithm becomes `O(k)` — and almost certainly out of memory.

---

## When Counting Sort Wins

| Scenario | Why counting sort wins |
|---|---|
| Small integer range | `O(n + k)` beats `O(n log n)` when `k ≤ n log n`. |
| Histograms / frequency tables | The count array *is* the desired output. |
| Radix sort sub-routine | Counting sort is the inner loop of radix sort, which extends counting sort to large integer ranges. |
| Stable sort with known integer keys | One of the few linear-time stable sorts. |

| Scenario | Why counting sort loses |
|---|---|
| Large value range | `O(k)` memory blows up. |
| Floats or arbitrary objects | Counting sort needs integer indices. |
| Memory-constrained systems | Out-of-place: needs `O(n + k)` extra memory. |

---

## Key Takeaway

Counting sort: `O(n + k)` time and space, stable, not in-place. The fastest sort when the value range is small. The first non-comparison sort in this section. Now we'll apply it to the canonical problem.

***

# Counting Sort Problem

> **Course:** DSA › Algorithms › Sorting › Counting Sort

---

## The Problem

Given an integer array `arr` and a positive integer `k` (the maximum value in `arr`), return a new array containing the elements of `arr` sorted in non-decreasing order.

```
Input:  arr = [2, 3, 2, 1, 5, 6], k = 6
Output: [1, 2, 2, 3, 5, 6]

Input:  arr = [6, 5, 4, 4, 4, 3, 2, 1], k = 8
Output: [1, 2, 3, 4, 4, 4, 5, 6]

Input:  arr = [1, 2, 3, 4, 5, 6], k = 7
Output: [1, 2, 3, 4, 5, 6]
```

---

## The Solution

Implementation matches the version above (10 languages already shown in the [Implementation](#implementation) section).

---

## Edge Cases

| Case | Example | Expected |
|---|---|---|
| Empty | `[]` | `[]` |
| All same | `[3, 3, 3]` | `[3, 3, 3]` |
| Includes zero | `[0, 0, 2]` | `[0, 0, 2]` |
| Already sorted | `[1, 2, 3]` | `[1, 2, 3]` (still does full `O(n + k)` work) |
| `k` much larger than `n` | `arr = [0, 1, 2], k = 1000000` | `[0, 1, 2]` (works but wastes memory on a 1M-cell count array) |

---

## Final Takeaway

Counting sort is the first algorithm in this section that breaks the `O(n log n)` lower bound. By trading memory for speed and limiting itself to small integer ranges, it achieves linear time. The price: `O(k)` extra memory, integers only, not in-place.

The next algorithm — quicksort — returns to the comparison-sort family but goes faster than `O(n²)` by using a fundamentally different strategy: **divide and conquer**. Instead of one big sort, quicksort partitions the array into two halves and sorts each half recursively. The result: `O(n log n)` average, the gold standard for general-purpose sorting.

**Transfer challenge — try before the Quicksort lesson:** Modify counting sort to handle arrays with negative integers in a known range `[min_val, max_val]`. (Hint: shift all values to be non-negative, sort, then shift back.) What happens to the time and space complexity?

<details>
<summary><strong>Answer — open after you've thought about it</strong></summary>

```python,editable
class Solution:
    def counting_sort_general(self, arr):
        if not arr: return []
        mn, mx = min(arr), max(arr)
        offset = -mn                                       # shift to non-negative
        k = mx - mn                                         # range size
        count = [0] * (k + 1)
        for v in arr:
            count[v + offset] += 1
        for i in range(1, k + 1):
            count[i] += count[i - 1]
        result = [0] * len(arr)
        for i in range(len(arr) - 1, -1, -1):
            count[arr[i] + offset] -= 1
            result[count[arr[i] + offset]] = arr[i]
        return result


print(Solution().counting_sort_general([3, -2, 7, -1, 0, 3]))   # [-2, -1, 0, 3, 3, 7]
```

Time: still `O(n + k)` where `k = max - min`. Space: `O(n + k)`. Same big-O, but `k` is now the *range size*, not the maximum value. **You just generalised counting sort to any bounded integer range.** The same offset trick is used inside radix sort to handle signed integers.

</details>
