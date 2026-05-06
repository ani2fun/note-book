# 7. Dutch National Flag Sort

You're sorting balls into three colour groups: red, white, blue. Or characters into three categories: lowercase, digit, uppercase. Or array elements into three buckets: smaller-than-pivot, equal-to-pivot, larger-than-pivot. Whatever the *meaning*, the *structure* of the problem is the same — three categories, one array, one pass. Counting sort would work here in `O(n + k) = O(n + 3) = O(n)` time, but it needs `O(k)` extra memory and a second array. Quicksort would work too in `O(n log n)`, but that's overkill for three categories.

The **Dutch National Flag** algorithm does this in `O(n)` time and `O(1)` space, in place, in a single pass. It maintains three pointers — `left`, `mid`, `right` — that grow three regions: smallest at the front, middle in the middle, largest at the back. Each scan step looks at one element, decides which region it belongs to, and swaps it into place. After one pass, all three regions are correctly sized and the array is sorted.

This algorithm matters more than its specific use case. It's the technique that **fixes quicksort's duplicate-element problem** (the Quicksort lesson's transfer challenge): three-way partitioning instead of two-way. The next lesson, Three-Way Quicksort, will marry this idea to quicksort's recursive driver, producing the algorithm that sorts arrays with many duplicates in linear time. The Dutch flag is the building block.

By the end of this lesson you'll know the algorithm, the invariants that the three pointers maintain, why the loop termination is `mid > right` (not `mid > n - 1`), and the subtle reason the `mid` pointer doesn't increment when swapping with `right`.

## Table of contents

1. [Understanding Dutch National Flag](#understanding-dutch-national-flag)
2. [The four-region invariant](#the-four-region-invariant)
3. [Implementation](#implementation)
4. [Complexity analysis](#complexity-analysis)
5. [Dutch National Flag problem](#dutch-national-flag-problem)

***

# Understanding Dutch National Flag

> **Course:** DSA › Algorithms › Sorting › Dutch National Flag

The Dutch National Flag (DNF) algorithm sorts an array with **at most 3 distinct values** in a single pass. The values are conventionally `0`, `1`, `2` — but the algorithm generalises to any three categories you can order (e.g., `< pivot`, `== pivot`, `> pivot` for quicksort).

The algorithm runs three pointers along the array:

- `left` — boundary of the "0s region" (everything before `left` is `0`).
- `mid` — current element under inspection.
- `right` — boundary of the "2s region" (everything after `right` is `2`).

The loop runs while `mid ≤ right`. On each iteration, look at `arr[mid]`:

- If `arr[mid] == 0`: swap with `arr[left]`, advance both `left` and `mid`.
- If `arr[mid] == 1`: just advance `mid` — the element is already in the middle region.
- If `arr[mid] == 2`: swap with `arr[right]`, decrement `right` — *don't* advance `mid` yet.

When `mid > right`, the array is fully sorted.

```d2
direction: down

phase: "Three regions during the scan" {
  grid-rows: 1
  grid-columns: 4
  grid-gap: 0
  zeros: "0s region\n[0..left-1]" {style.fill: "#fecaca"; style.stroke: "#dc2626"}
  ones: "1s region\n[left..mid-1]" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  unknown: "Unknown\n[mid..right]" {style.fill: "#dbeafe"; style.stroke: "#3b82f6"}
  twos: "2s region\n[right+1..n-1]" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
}
```

<p align="center"><strong>The four regions during the scan. Three are growing (0s, 1s, 2s), one is shrinking (unknown). The algorithm terminates when the unknown region is empty.</strong></p>

The algorithm name comes from the Dutch flag's three horizontal stripes — red, white, blue — which match the conceptual three-region layout the algorithm produces.

---

## The Three Cases in Detail

### Case 1 — `arr[mid] == 0`

The element belongs in the 0s region. Swap it with whatever's at `arr[left]` (which is the first element of the 1s region, since the 0s region ends at `left - 1`). After the swap, `arr[left]` holds a `0` and `arr[mid]` holds a `1` (which we already knew was in the 1s region). Advance both `left` and `mid` by 1.

Why advance `mid`? Because the new `arr[mid]` (after the swap) is a `1`, which we already classified — we know it goes in the 1s region. No need to re-inspect.

### Case 2 — `arr[mid] == 1`

The element is already in the right region (the 1s extend from `left` to `mid - 1`, and now `arr[mid] == 1` extends them to `mid`). Just advance `mid`. No swap needed.

### Case 3 — `arr[mid] == 2`

The element belongs in the 2s region. Swap it with `arr[right]` (which is the last unclassified element). After the swap, `arr[right]` holds a `2` and `arr[mid]` holds the previous `arr[right]` value — *which we haven't inspected yet*. Decrement `right`. **Don't advance `mid`.**

Why don't we advance `mid`? Because the value now at `arr[mid]` came from the unknown region — we don't know if it's a `0`, `1`, or `2` yet. We need to inspect it on the next iteration.

This asymmetry between cases 1 and 3 is the most error-prone part of the algorithm. We advance `mid` in case 1 because we *do* know what's at `arr[mid]` after the swap (a `1`); we don't advance `mid` in case 3 because we *don't* know what's at `arr[mid]` after the swap.

---

## A Walkthrough

`arr = [2, 0, 1, 0, 2, 1, 0]` (n = 7).

Initial: `left = 0, mid = 0, right = 6`.

```
[2, 0, 1, 0, 2, 1, 0]   left=0, mid=0, right=6
 ^

arr[mid]=2 → swap mid↔right, right--
[0, 0, 1, 0, 2, 1, 2]   left=0, mid=0, right=5
 ^

arr[mid]=0 → swap mid↔left, left++, mid++
[0, 0, 1, 0, 2, 1, 2]   left=1, mid=1, right=5
    ^

arr[mid]=0 → swap mid↔left, left++, mid++
[0, 0, 1, 0, 2, 1, 2]   left=2, mid=2, right=5
       ^

arr[mid]=1 → mid++
[0, 0, 1, 0, 2, 1, 2]   left=2, mid=3, right=5
          ^

arr[mid]=0 → swap mid↔left, left++, mid++
[0, 0, 0, 1, 2, 1, 2]   left=3, mid=4, right=5
             ^

arr[mid]=2 → swap mid↔right, right--
[0, 0, 0, 1, 1, 2, 2]   left=3, mid=4, right=4
             ^

arr[mid]=1 → mid++
[0, 0, 0, 1, 1, 2, 2]   left=3, mid=5, right=4

mid (5) > right (4) → loop exits
Result: [0, 0, 0, 1, 1, 2, 2] ✓
```

Single pass, exactly `n` element inspections (some with swaps). `O(n)` time, `O(1)` space.

---

## Why Counting Sort and Quicksort Don't Beat This

| Algorithm | Time | Space | Pass count | Stable |
|---|---|---|---|---|
| **DNF** | `O(n)` | `O(1)` | 1 | No (technically, but for 0/1/2 sorts it doesn't matter) |
| Counting sort | `O(n + k)` | `O(n + k)` | 2 (count + place) | Yes |
| Quicksort | `O(n log n)` avg | `O(log n)` stack | log n levels | No |

DNF's strength is simultaneously: linear time + constant space + single pass. Counting sort matches the time but uses extra memory. Quicksort uses extra stack but has worse big-O. **For 3-category sorting, DNF wins on every axis except stability — and even there, equal elements within a category aren't distinguishable, so stability is moot.**

---

## Strengths and Limitations

| Strength | Detail |
|---|---|
| **`O(n)` time** | Single pass; each element inspected once. |
| **`O(1)` space** | Three integer pointers; no auxiliary array. |
| **In-place** | Mutates the input directly. |
| **Single pass** | One sweep through the array; very cache-friendly. |

| Limitation | Detail |
|---|---|
| **Limited to 3 categories** | Generalising to k categories requires a different algorithm (k-way partitioning, used in the Three-Way Quicksort lesson). |
| **Not stable** | Long-distance swaps with `right` can flip the relative order of equal elements (though this is invisible for 0/1/2 inputs since duplicates are indistinguishable). |

---

## Key Takeaway

DNF: three pointers, three cases, one pass. Linear time, constant space. The technique generalises to "partition the array around any three-way classification" — the foundation of three-way quicksort. Now we'll formalise the invariants.

***

# The Four-Region Invariant

> **Course:** DSA › Algorithms › Sorting › Dutch National Flag

The DNF algorithm maintains a **loop invariant** that's the easiest way to convince yourself it's correct. At the start of every iteration:

- `arr[0..left-1]` contains only `0`s.
- `arr[left..mid-1]` contains only `1`s.
- `arr[mid..right]` is unclassified (could be `0`, `1`, or `2`).
- `arr[right+1..n-1]` contains only `2`s.

Each iteration preserves the invariant by extending one of the three "known" regions and shrinking the unknown region.

```d2
direction: down

before: "Before iteration" {
  grid-rows: 1
  grid-columns: 7
  grid-gap: 0
  i0: "0" {style.fill: "#fecaca"; style.stroke: "#dc2626"}
  i1: "0" {style.fill: "#fecaca"; style.stroke: "#dc2626"}
  i2: "1" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  i3: "?" {style.fill: "#dbeafe"; style.stroke: "#3b82f6"}
  i4: "?" {style.fill: "#dbeafe"; style.stroke: "#3b82f6"}
  i5: "2" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
  i6: "2" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
}

label: "left=2, mid=3, right=4 → unknown range is [3..4]"
```

<p align="center"><strong>The invariant in pictures. Three "settled" regions (red, yellow, green) and one "unknown" region (blue). Each iteration shrinks the unknown by 1 by swapping its first element into the right region.</strong></p>

When the loop terminates (`mid > right`), the unknown region is empty, and the four-region invariant collapses to three sorted regions: 0s, 1s, 2s.

---

## Why the Loop Condition Is `mid ≤ right`

The unknown region is `[mid..right]`. It's non-empty iff `mid ≤ right`. The loop runs as long as there's at least one element to inspect.

When `mid > right`, every element has been classified and placed. The array is sorted; the loop exits. **This is the correct termination — `mid > right`, not `mid >= n` or `mid == right`.** The invariant guarantees that as long as `mid ≤ right`, there's still work to do.

> *Predict before reading on — if the loop condition were <code>mid &lt; n</code> instead of <code>mid ≤ right</code>, would the algorithm still be correct? Why or why not?*

It would still be correct (every element gets inspected), but **it would do unnecessary work**. After `right` decrements past `mid`, the elements at `[mid..n-1]` are already classified as `2`s. Continuing to inspect them doesn't change the result, but it costs `O(n)` extra inspections. The tighter `mid ≤ right` bound terminates as soon as the unknown region is empty.

---

## Why `mid` Doesn't Advance in Case 3

This is the algorithm's most subtle detail. When we swap `arr[mid]` with `arr[right]` (because `arr[mid] == 2`), the element that *was* at `arr[right]` moves to `arr[mid]`. We've inspected the original `arr[mid]` (it was a `2`), but we haven't inspected what was at `arr[right]`. So `mid` stays put — we'll re-inspect that position on the next iteration.

In contrast, when `arr[mid] == 0`, we swap with `arr[left]`. The element that *was* at `arr[left]` is necessarily a `1` (because the 1s region is `[left..mid-1]`, and `left` is the first index of that region). So we *do* know what `arr[mid]` becomes after the swap — a `1` — and we can safely advance `mid` past it.

```d2
direction: right

case1: "Case 1 (==0): swap with left\nwhat moves to mid: a 1 (already classified)\n→ advance mid" {style.fill: "#fde68a"; style.stroke: "#d97706"}
case3: "Case 3 (==2): swap with right\nwhat moves to mid: unknown\n→ DO NOT advance mid" {style.fill: "#fecaca"; style.stroke: "#dc2626"}
```

<p align="center"><strong>The asymmetry. Case 1's swap brings in a known value; case 3's swap brings in an unknown value. The advance-or-not decision follows from "do I know what just landed at <code>arr[mid]</code>?"</strong></p>

---

## Key Takeaway

The four-region invariant gives the algorithm its correctness proof. The loop condition `mid ≤ right` terminates exactly when the unknown region is empty. The asymmetric handling of cases 1 and 3 (advance mid vs not) is the consequence of which side of the array is shrinking. Now the implementation.

***

# Implementation

> **Course:** DSA › Algorithms › Sorting › Dutch National Flag

<div class="lang-tabs">

```pseudocode
# Three-way partition over values {0, 1, 2}.
# Invariant during the loop:
#   arr[0..low−1]    = 0s (locked)
#   arr[low..mid−1]  = 1s
#   arr[mid..high]   = unprocessed
#   arr[high+1..n−1] = 2s (locked)
function dutchFlagSort(arr):
    low ← 0
    mid ← 0
    high ← length(arr) − 1
    while mid ≤ high:
        if arr[mid] = 0:
            swap arr[low] and arr[mid]
            low ← low + 1
            mid ← mid + 1
        else if arr[mid] = 2:
            swap arr[mid] and arr[high]
            high ← high − 1                  # don't advance mid — swapped value is unprocessed
        else:                                # arr[mid] = 1 — already in place
            mid ← mid + 1
```

```python,editable
from typing import List

class Solution:
    def dutch_national_flag_sort(self, arr: List[int]) -> None:
        left, mid, right = 0, 0, len(arr) - 1
        while mid <= right:
            if arr[mid] == 0:
                arr[left], arr[mid] = arr[mid], arr[left]
                left += 1
                mid += 1
            elif arr[mid] == 1:
                mid += 1
            else:                                       # arr[mid] == 2
                arr[mid], arr[right] = arr[right], arr[mid]
                right -= 1


if __name__ == "__main__":
    arr = [2, 0, 1, 0, 2, 1, 0]
    Solution().dutch_national_flag_sort(arr)
    print(arr)   # [0, 0, 0, 1, 1, 2, 2]
```

```java,editable
public class Solution {
    public void dutchNationalFlagSort(int[] arr) {
        int left = 0, mid = 0, right = arr.length - 1;
        while (mid <= right) {
            if (arr[mid] == 0) {
                int t = arr[left]; arr[left] = arr[mid]; arr[mid] = t;
                left++; mid++;
            } else if (arr[mid] == 1) {
                mid++;
            } else {
                int t = arr[mid]; arr[mid] = arr[right]; arr[right] = t;
                right--;
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = {2, 0, 1, 0, 2, 1, 0};
        new Solution().dutchNationalFlagSort(arr);
        for (int x : arr) System.out.print(x + " ");
        System.out.println();
    }
}
```

```c,editable
#include <stdio.h>

void dutch_national_flag_sort(int *arr, int n) {
    int left = 0, mid = 0, right = n - 1;
    while (mid <= right) {
        if (arr[mid] == 0) {
            int t = arr[left]; arr[left] = arr[mid]; arr[mid] = t;
            left++; mid++;
        } else if (arr[mid] == 1) {
            mid++;
        } else {
            int t = arr[mid]; arr[mid] = arr[right]; arr[right] = t;
            right--;
        }
    }
}

int main(void) {
    int arr[] = {2, 0, 1, 0, 2, 1, 0};
    int n = 7;
    dutch_national_flag_sort(arr, n);
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
    void dutchNationalFlagSort(std::vector<int>& arr) {
        int left = 0, mid = 0, right = (int) arr.size() - 1;
        while (mid <= right) {
            if (arr[mid] == 0) {
                std::swap(arr[left], arr[mid]);
                left++; mid++;
            } else if (arr[mid] == 1) {
                mid++;
            } else {
                std::swap(arr[mid], arr[right]);
                right--;
            }
        }
    }
};

int main() {
    std::vector<int> arr = {2, 0, 1, 0, 2, 1, 0};
    Solution{}.dutchNationalFlagSort(arr);
    for (int x : arr) std::cout << x << ' ';
    std::cout << '\n';
}
```

```scala,editable
class Solution {
  def dutchNationalFlagSort(arr: Array[Int]): Unit = {
    var left = 0; var mid = 0; var right = arr.length - 1
    while (mid <= right) {
      if (arr(mid) == 0) {
        val t = arr(left); arr(left) = arr(mid); arr(mid) = t
        left += 1; mid += 1
      } else if (arr(mid) == 1) {
        mid += 1
      } else {
        val t = arr(mid); arr(mid) = arr(right); arr(right) = t
        right -= 1
      }
    }
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    val arr = Array(2, 0, 1, 0, 2, 1, 0)
    new Solution().dutchNationalFlagSort(arr)
    println(arr.mkString(" "))
  }
}
```

```typescript,editable
class Solution {
    dutchNationalFlagSort(arr: number[]): void {
        let left = 0, mid = 0, right = arr.length - 1;
        while (mid <= right) {
            if (arr[mid] === 0) {
                [arr[left], arr[mid]] = [arr[mid], arr[left]];
                left++; mid++;
            } else if (arr[mid] === 1) {
                mid++;
            } else {
                [arr[mid], arr[right]] = [arr[right], arr[mid]];
                right--;
            }
        }
    }
}

const arr: number[] = [2, 0, 1, 0, 2, 1, 0];
new Solution().dutchNationalFlagSort(arr);
console.log(arr);
```

```go,editable
package main

import "fmt"

func dutchNationalFlagSort(arr []int) {
    left, mid, right := 0, 0, len(arr)-1
    for mid <= right {
        switch arr[mid] {
        case 0:
            arr[left], arr[mid] = arr[mid], arr[left]
            left++
            mid++
        case 1:
            mid++
        default:
            arr[mid], arr[right] = arr[right], arr[mid]
            right--
        }
    }
}

func main() {
    arr := []int{2, 0, 1, 0, 2, 1, 0}
    dutchNationalFlagSort(arr)
    fmt.Println(arr)
}
```

```rust,editable
fn dutch_national_flag_sort(arr: &mut Vec<i32>) {
    let mut left: i64 = 0;
    let mut mid: i64 = 0;
    let mut right: i64 = arr.len() as i64 - 1;
    while mid <= right {
        match arr[mid as usize] {
            0 => {
                arr.swap(left as usize, mid as usize);
                left += 1;
                mid += 1;
            }
            1 => mid += 1,
            _ => {
                arr.swap(mid as usize, right as usize);
                right -= 1;
            }
        }
    }
}

fn main() {
    let mut arr: Vec<i32> = vec![2, 0, 1, 0, 2, 1, 0];
    dutch_national_flag_sort(&mut arr);
    println!("{:?}", arr);
}
```

</div>

***

# Complexity Analysis

> **Course:** DSA › Algorithms › Sorting › Dutch National Flag

| Resource | Best | Average | Worst |
|---|---|---|---|
| **Time** | `O(n)` | `O(n)` | `O(n)` |
| **Space** | `O(1)` | `O(1)` | `O(1)` |

A single pass; each element inspected at most once (the `mid` pointer increments or the `right` pointer decrements on every iteration, so the unknown region shrinks by 1 each step). `n` iterations total, regardless of input.

The algorithm doesn't have a "best/worst" distinction the way comparison sorts do — it's deterministic on size, not on input.

---

## Generalising Beyond {0, 1, 2}

The values `0`, `1`, `2` are conventional. The algorithm works for any 3-way partition:
- **Lowercase / digit / uppercase** characters in a string.
- **Negative / zero / positive** numbers in an array.
- **Less than pivot / equal to pivot / greater than pivot** — this generalisation is the foundation of **three-way quicksort** (the Three-Way Quicksort lesson).

Replace the `== 0`, `== 1`, `== 2` comparisons with the appropriate three-way classification function. Everything else stays the same.

---

## Key Takeaway

DNF is `O(n)` time, `O(1)` space, single pass. The three-way partition technique generalises beyond the strict `{0, 1, 2}` setting and becomes the heart of three-way quicksort. Now the canonical exercise.

***

# Dutch National Flag Problem

> **Course:** DSA › Algorithms › Sorting › Dutch National Flag

---

## The Problem

Given an integer array `arr` containing only `0`s, `1`s, and `2`s (representing red, white, and blue balls), sort it in place so that all `0`s come first, then all `1`s, then all `2`s. **You must use the Dutch National Flag algorithm.**

```
Input:  arr = [0, 1, 1, 2, 0]
Output: [0, 0, 1, 1, 2]

Input:  arr = [2, 1, 1, 0]
Output: [0, 1, 1, 2]

Input:  arr = [0, 0, 1, 1, 1, 2, 2]
Output: [0, 0, 1, 1, 1, 2, 2]   (already sorted)
```

---

## The Solution

The implementation matches the version above. See the [Implementation](#implementation) section for all 10 languages.

---

## Edge Cases

| Case | Example | Expected |
|---|---|---|
| Empty | `[]` | `[]` (loop doesn't enter). |
| Single element | `[0]` | `[0]`. |
| All zeros | `[0, 0, 0]` | `[0, 0, 0]` (case 1 fires for each; left and mid both advance). |
| All twos | `[2, 2, 2]` | `[2, 2, 2]` (case 3 fires for each; right decrements; mid stays). |
| Already sorted | `[0, 0, 1, 1, 2, 2]` | unchanged. |
| Reverse sorted | `[2, 2, 1, 1, 0, 0]` | `[0, 0, 1, 1, 2, 2]`. |
| Just twos and zeros | `[2, 0, 2, 0]` | `[0, 0, 2, 2]`. |

---

## Final Takeaway

Dutch National Flag is the simplest non-trivial three-way partition: three pointers, three cases, one pass. `O(n)` time, `O(1)` space. The technique generalises to "any three-way classification" and is the missing piece that fixes quicksort's duplicate-element problem.

The next algorithm — **three-way quicksort** — bolts the Dutch flag's three-way partition onto quicksort's recursive driver. The result: a sort that handles arrays with many duplicates in linear time *while* preserving quicksort's `O(n log n)` average for unique elements. The two algorithms compose perfectly.

**Transfer challenge — try before the Three-Way Quicksort lesson:** Generalise the DNF algorithm to handle a comparison against an arbitrary pivot value `p`. Instead of `== 0`, `== 1`, `== 2`, classify each element as `< p`, `== p`, or `> p`. The algorithm structure stays identical. What's the time complexity? What problem does this solve?

<details>
<summary><strong>Answer — open after you've thought about it</strong></summary>

```python,editable
class Solution:
    def three_way_partition(self, arr, pivot):
        left, mid, right = 0, 0, len(arr) - 1
        while mid <= right:
            if arr[mid] < pivot:
                arr[left], arr[mid] = arr[mid], arr[left]
                left += 1
                mid += 1
            elif arr[mid] == pivot:
                mid += 1
            else:                                  # arr[mid] > pivot
                arr[mid], arr[right] = arr[right], arr[mid]
                right -= 1
        return left, right                          # boundaries of the equal region


arr = [3, 5, 1, 5, 4, 5, 2, 5]
l, r = Solution().three_way_partition(arr, 5)
print(arr, l, r)   # [3, 1, 4, 2, 5, 5, 5, 5] (or similar) with l=4, r=7
```

Time: `O(n)`, single pass. Space: `O(1)`.

This is **the partition step of three-way quicksort** (the Three-Way Quicksort lesson). It collapses all equal-to-pivot elements into one contiguous middle region — those elements are *already in their final sorted positions*, so the recursive sort never has to revisit them. Compared with two-way (Lomuto) partition, this avoids the `O(n²)` blow-up on arrays with many duplicates. **You just rediscovered the partition that makes three-way quicksort linear-time on duplicate-heavy inputs.**

</details>
