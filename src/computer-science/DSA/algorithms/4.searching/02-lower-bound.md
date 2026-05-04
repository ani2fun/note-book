# 2. Lower Bound

Plain binary search returns *any* index where the target appears. For an array `[1, 2, 2, 2, 3]` with `target = 2`, it might return index 1, 2, or 3 — whichever happens to be where it lands. That's fine if you just want to know *whether* the target exists. But often you want to know **where the target *first* appears** — for inserting a new value while keeping the array sorted, for finding the start of a run of duplicates, for "first record on or after this date" queries.

Worse, what if the target *isn't* in the array? Plain binary search returns `-1` — but you might want **the position where the target *would* go** if inserted. For `[1, 5, 10, 15]` and `target = 7`, plain binary search returns `-1`; lower bound returns `2` (the index where `7` would slot in to keep the array sorted).

This is **lower bound** — the index of the *first element `≥ target`*, or `n` if no such element exists. It's binary search with two surgical changes: a different loop condition and a different "found it" branch. Same `O(log n)` time, same `O(1)` space. By the end of this lesson you'll know the modifications and exactly why they work.

## Table of contents

1. [Understanding lower bound](#understanding-lower-bound)
2. [Why the loop bounds change](#why-the-loop-bounds-change)
3. [Implementation](#implementation)
4. [Complexity analysis](#complexity-analysis)
5. [Lower bound problem](#lower-bound-problem)

***

# Understanding Lower Bound

> **Course:** DSA › Algorithms › Searching › Lower Bound

The **lower bound** of a target `t` in a sorted array is the **smallest index `i` such that `arr[i] >= t`**. If no such index exists (i.e., every element is less than `t`), the lower bound is `n` — one past the last index, which is exactly where `t` would be inserted to keep the array sorted.

Three cases:

```
arr = [1, 5, 10, 15, 20, 25]

target = 10  →  lower_bound = 2  (arr[2] = 10, the first element ≥ 10)
target = 17  →  lower_bound = 4  (arr[4] = 20, the first element ≥ 17)
target = 22  →  lower_bound = 5  (arr[5] = 25, the first element ≥ 22)
target = 30  →  lower_bound = 6  (no element ≥ 30; n = 6 is the insertion point)
target = 0   →  lower_bound = 0  (arr[0] = 1, the first element ≥ 0)
```

Two equivalent ways to think about it:
- **Search-flavour**: "find the first index whose value is ≥ target."
- **Insertion-flavour**: "find the index where you'd insert target to keep the array sorted, putting target *before* any existing equal values."

Both views agree. We'll use the search-flavour for the algorithm and the insertion-flavour for sanity-checking edge cases.

---

## How It Differs from Binary Search

| Feature | Plain binary search | Lower bound |
|---|---|---|
| Returns | Any index where `arr[i] == target`, or `-1` | Smallest index where `arr[i] >= target`, or `n` |
| Equality | "Found it" — return immediately | "Maybe found it" — record and keep searching left |
| Absent target | `-1` | The insertion position |

The behaviour difference comes from two small changes in the algorithm:

1. **Loop condition**: `low < high` instead of `low <= high`.
2. **Equality branch**: when `arr[mid] >= target`, set `high = mid` (not `high = mid - 1` and not `return mid`).
3. **`high` initial value**: `n` instead of `n - 1`.

These three changes work together. Changing only one breaks the algorithm; changing all three gives lower bound. Let's see why.

---

## A Walkthrough

`arr = [1, 5, 10, 15, 20, 25]`, `target = 17`.

```
Initial: low = 0, high = 6     (n = 6, not n - 1)
Iter 1: mid = 3, arr[3] = 15. 15 < 17? yes → low = mid + 1 = 4
Iter 2: low = 4, high = 6, mid = 5, arr[5] = 25. 25 < 17? no → high = mid = 5
Iter 3: low = 4, high = 5, mid = 4, arr[4] = 20. 20 < 17? no → high = mid = 4
Loop exits: low = 4, high = 4 → low < high false

Return low = 4. arr[4] = 20, the first element ≥ 17. ✓
```

Three iterations on a 6-element array. The algorithm narrows the range to a single position — the lower bound — and returns it.

---

## Strengths and Limitations

| Strength | Detail |
|---|---|
| **`O(log n)`** | Same complexity as binary search. |
| **Always returns** | Never returns `-1`. The result is always a valid insertion index in `[0, n]`. |
| **Handles duplicates** | Returns the *first* occurrence when duplicates exist. |
| **Foundation for `bisect`-style libraries** | Python's `bisect.bisect_left`, C++'s `std::lower_bound`, Rust's `partition_point` are all this algorithm. |

| Limitation | Detail |
|---|---|
| **Subtle off-by-one** | The three modifications must be consistent; mixing with binary search's conventions produces bugs. |
| **Returns `n` for "not found"** | Caller must check whether `result == n` or `arr[result] != target` to distinguish "found exactly" from "would be inserted here." |

---

## Key Takeaway

Lower bound = "first index where the value is at least target." Three changes from plain binary search: `high = n` initial, `low < high` loop, equality goes to the left half. Now we'll see why each change is necessary.

***

# Why the Loop Bounds Change

> **Course:** DSA › Algorithms › Searching › Lower Bound

The three changes look minor but each is load-bearing. Get any one wrong and the algorithm misbehaves on edge cases.

---

## Change 1 — `high = n` (Not `n - 1`)

In binary search, the answer is always an index in `[0, n - 1]`. We never need to consider position `n` — it's outside the array.

In lower bound, the answer might be **`n`** — meaning "all elements are less than target; the insertion point is one past the end." If we initialise `high = n - 1`, we exclude this possibility, and the algorithm returns the wrong answer for `target` larger than every element.

**Fix:** initialise `high = n` (one past the end). The valid answer space is now `[0, n]`.

---

## Change 2 — Loop Condition `low < high`

In binary search, we stop when the range is empty (`low > high`). In lower bound, we stop when the range *converges to a single index* — that single index is the answer.

If we used `low <= high`:
- When `low == high`, we'd run one more iteration. `mid = low`. If `arr[mid] >= target`, we'd set `high = mid = low`. Now `low == high == mid`, condition still true, infinite loop.

**Fix:** stop when `low == high`. Condition: `low < high`.

---

## Change 3 — Equality Goes Left

In binary search, `arr[mid] == target` returns `mid`. In lower bound, `arr[mid] == target` doesn't immediately return — there might be an earlier occurrence. We narrow the search to the left half *including `mid`* (since `mid` itself is a valid candidate).

```
if arr[mid] >= target:
    high = mid          # mid stays in the search range — could still be the answer
else:
    low = mid + 1       # arr[mid] is < target, definitely not the answer
```

The crucial detail: `high = mid`, not `high = mid - 1`. We want to *keep* `mid` as a candidate. The exclusive upper bound (we never look at index `high` directly) makes this work.

---

## Why The Three Changes Are Coupled

Each change relies on the others:

- **`high = n` exclusive bound** allows the answer to be `n`.
- **`low < high` loop** stops cleanly when range converges (no off-by-one when `high = n`).
- **`high = mid` in equality branch** narrows by including the current candidate as a possibility.

If you mix this with binary search's conventions (e.g., `high = n - 1` with `high = mid` in the equality branch), the search range becomes `(low, high]` semi-open in a way the loop condition can't handle, and the algorithm either skips the answer or loops infinitely on edge cases.

```d2
direction: down

bsearch: "Binary search\nlow <= high\nhigh = n - 1\nhigh = mid - 1 on equality" {style.fill: "#dbeafe"; style.stroke: "#3b82f6"}
lbound: "Lower bound\nlow < high\nhigh = n\nhigh = mid on >= target" {style.fill: "#fde68a"; style.stroke: "#d97706"}
```

<p align="center"><strong>Two consistent algorithm conventions. Don't mix them.</strong></p>

---

## Key Takeaway

Three changes — `high = n`, `low < high`, `high = mid` on equality — convert binary search into lower bound. They're a package; mix them with binary search's conventions and you get bugs. Now the implementation.

***

# Implementation

> **Course:** DSA › Algorithms › Searching › Lower Bound

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def lower_bound(self, arr: List[int], target: int) -> int:
        low, high = 0, len(arr)                         # high = n (exclusive)
        while low < high:                               # converges when low == high
            mid = low + (high - low) // 2
            if arr[mid] < target:
                low = mid + 1                           # mid not a candidate
            else:                                       # arr[mid] >= target
                high = mid                              # mid stays as candidate
        return low                                      # the lower bound index


if __name__ == "__main__":
    print(Solution().lower_bound([1, 5, 10, 15, 20, 25], 10))   # 2
    print(Solution().lower_bound([1, 5, 10, 15, 20, 25], 17))   # 4
    print(Solution().lower_bound([1, 5, 10, 15, 20, 25], 30))   # 6 (insertion at end)
```

```java,editable
public class Solution {
    public int lowerBound(int[] arr, int target) {
        int low = 0, high = arr.length;
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] < target) low = mid + 1;
            else high = mid;
        }
        return low;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().lowerBound(new int[]{1, 5, 10, 15, 20, 25}, 17));
    }
}
```

```c,editable
#include <stdio.h>

int lower_bound(int *arr, int n, int target) {
    int low = 0, high = n;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] < target) low = mid + 1;
        else high = mid;
    }
    return low;
}

int main(void) {
    int arr[] = {1, 5, 10, 15, 20, 25};
    printf("%d\n", lower_bound(arr, 6, 17));
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

class Solution {
public:
    int lowerBound(const std::vector<int>& arr, int target) {
        int low = 0, high = (int) arr.size();
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] < target) low = mid + 1;
            else high = mid;
        }
        return low;
    }
};

int main() {
    std::cout << Solution{}.lowerBound({1, 5, 10, 15, 20, 25}, 17) << '\n';
}
```

```scala,editable
class Solution {
  def lowerBound(arr: Array[Int], target: Int): Int = {
    var low = 0; var high = arr.length
    while (low < high) {
      val mid = low + (high - low) / 2
      if (arr(mid) < target) low = mid + 1 else high = mid
    }
    low
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    println(new Solution().lowerBound(Array(1, 5, 10, 15, 20, 25), 17))
  }
}
```

```javascript,editable
class Solution {
    lowerBound(arr, target) {
        let low = 0, high = arr.length;
        while (low < high) {
            const mid = low + ((high - low) >> 1);
            if (arr[mid] < target) low = mid + 1;
            else high = mid;
        }
        return low;
    }
}

console.log(new Solution().lowerBound([1, 5, 10, 15, 20, 25], 17));
```

```typescript,editable
class Solution {
    lowerBound(arr: number[], target: number): number {
        let low = 0, high = arr.length;
        while (low < high) {
            const mid = low + ((high - low) >> 1);
            if (arr[mid] < target) low = mid + 1;
            else high = mid;
        }
        return low;
    }
}

console.log(new Solution().lowerBound([1, 5, 10, 15, 20, 25], 17));
```

```go,editable
package main

import "fmt"

func lowerBound(arr []int, target int) int {
    low, high := 0, len(arr)
    for low < high {
        mid := low + (high-low)/2
        if arr[mid] < target {
            low = mid + 1
        } else {
            high = mid
        }
    }
    return low
}

func main() {
    fmt.Println(lowerBound([]int{1, 5, 10, 15, 20, 25}, 17))
}
```

```kotlin,editable
class Solution {
    fun lowerBound(arr: IntArray, target: Int): Int {
        var low = 0; var high = arr.size
        while (low < high) {
            val mid = low + (high - low) / 2
            if (arr[mid] < target) low = mid + 1 else high = mid
        }
        return low
    }
}

fun main() {
    println(Solution().lowerBound(intArrayOf(1, 5, 10, 15, 20, 25), 17))
}
```

```rust,editable
fn lower_bound(arr: &[i32], target: i32) -> usize {
    let mut low = 0; let mut high = arr.len();
    while low < high {
        let mid = low + (high - low) / 2;
        if arr[mid] < target { low = mid + 1; } else { high = mid; }
    }
    low
}

fn main() {
    println!("{}", lower_bound(&[1, 5, 10, 15, 20, 25], 17));
}
```

</div>

***

# Complexity Analysis

| Resource | Cost |
|---|---|
| **Time** | `O(log n)` |
| **Space** | `O(1)` |

Same as binary search — each iteration halves the range.

---

## Key Takeaway

Lower bound is `O(log n)` time, `O(1)` space, and never returns "not found." It returns either a valid match or the insertion position. Now the canonical exercise.

***

# Lower Bound Problem

> **Course:** DSA › Algorithms › Searching › Lower Bound

---

## The Problem

Given a sorted array `arr` and `target`, return the index of the first element `>= target`.

```
Input:  arr = [1, 5, 10, 15, 20, 25], target = 10
Output: 2

Input:  arr = [1, 5, 10, 15, 20, 25], target = 17
Output: 4

Input:  arr = [1, 5, 10, 15, 20, 25], target = 22
Output: 5
```

---

## The Solution

The implementation matches the version above. See [Implementation](#implementation) for all 10 languages.

---

## Edge Cases

| Case | Example | Expected |
|---|---|---|
| Empty | `[], target = 5` | `0` |
| Smaller than all | `[10, 20], target = 5` | `0` |
| Larger than all | `[10, 20], target = 25` | `2` (= n) |
| Exact match at start | `[10, 20], target = 10` | `0` |
| Duplicates | `[1, 2, 2, 2, 3], target = 2` | `1` (first occurrence) |

---

## Final Takeaway

Lower bound = first index ≥ target. Three changes from binary search; same `O(log n)` complexity. Foundation of `bisect.bisect_left`, `std::lower_bound`, and the "where would I insert this?" primitive that powers ordered-set implementations.

The next lesson flips the comparison: **upper bound** returns the first index *strictly greater than* target. Same algorithm, one operator changed.

**Transfer challenge — try before the Upper Bound lesson:** Use lower bound to *count* the number of occurrences of a target in a sorted array. Hint: the count is the difference between two well-chosen lower-bound queries.

<details>
<summary><strong>Answer — open after you've thought about it</strong></summary>

```python,editable
class Solution:
    def count_occurrences(self, arr, target):
        first = self.lower_bound(arr, target)
        last_plus_one = self.lower_bound(arr, target + 1)
        return last_plus_one - first

    def lower_bound(self, arr, target):
        low, high = 0, len(arr)
        while low < high:
            mid = low + (high - low) // 2
            if arr[mid] < target: low = mid + 1
            else: high = mid
        return low


print(Solution().count_occurrences([1, 2, 2, 2, 3, 4], 2))   # 3
```

`lower_bound(target)` finds the first occurrence; `lower_bound(target + 1)` finds the first position strictly greater than target — equivalently, one past the last occurrence. The difference is the count.

This is the same trick as **upper bound minus lower bound** that we'll formalise in the next lesson. **You just rediscovered range-count via two binary searches.**

</details>
