# 6. Sorted Rotated Array

A sorted array is rotated by some unknown amount: `[1, 2, 3, 4, 5, 6, 7]` becomes `[4, 5, 6, 7, 1, 2, 3]`. Plain binary search doesn't work — the array isn't sorted globally. But it's *almost* sorted: it consists of two sorted segments, with the second's values smaller than the first's. Can we still binary-search it in `O(log n)`?

Yes — and this lesson covers two related problems:
1. **Find the minimum** — locate the rotation point (the start of the smaller segment).
2. **Search for a target** — find a specific value in the rotated array.

Both run in `O(log n)`. The trick: at any midpoint, *one of the two halves is guaranteed sorted*. Determining which half by comparing `arr[mid]` with `arr[low]` (or `arr[high]`) lets us decide which half could possibly contain the target — same divide-and-conquer logic as binary search, with one extra comparison per iteration.

By the end of this lesson you'll know both algorithms, the "one half is always sorted" insight that makes them work, and the precise per-iteration decision tree.

## Table of contents

1. [The rotated array structure](#the-rotated-array-structure)
2. [Finding the minimum](#finding-the-minimum)
3. [Searching for a target](#searching-for-a-target)
4. [Complexity analysis](#complexity-analysis)
5. [Rotated array minimum problem](#rotated-array-minimum-problem)
6. [Rotated array search problem](#rotated-array-search-problem)

***

# The Rotated Array Structure

> **Course:** DSA › Algorithms › Searching › Sorted Rotated Array

A sorted array `[a₀, a₁, ..., a_{n-1}]` rotated at pivot `k` becomes:

```
[a_k, a_{k+1}, ..., a_{n-1}, a_0, a_1, ..., a_{k-1}]
```

Three properties hold:
1. The first `n - k` elements form a sorted segment (the original suffix).
2. The last `k` elements form another sorted segment (the original prefix).
3. **All elements in the first segment are larger than all elements in the second segment.**

Visually:

```d2
direction: right

input: "Original sorted: [1, 2, 3, 4, 5, 6, 7]" {style.fill: "#dbeafe"; style.stroke: "#3b82f6"}
rotated: "After rotating at k=4:\n[5, 6, 7, 1, 2, 3, 4]\n  ↑       ↑\n  segment 1 (sorted, larger values)\n          segment 2 (sorted, smaller values)" {style.fill: "#fde68a"; style.stroke: "#d97706"}

input -> rotated: rotate left by k=4 (or right by n-k=3)
```

<p align="center"><strong>A sorted-rotated array is two sorted segments stitched together, with all elements of the first larger than all elements of the second.</strong></p>

The minimum of the array is at the start of segment 2 — the rotation point.

---

## The Key Property

For any midpoint `mid` in a sorted-rotated array, *at least one of the two halves `[low, mid]` and `[mid, high]` is fully sorted*. Why?

- If `arr[low] ≤ arr[mid]`, then `low..mid` lies entirely within one segment → that half is sorted.
- Otherwise, `arr[mid] < arr[low]`, meaning `mid` is in segment 2 while `low` is in segment 1 → the right half `mid..high` lies entirely within segment 2 → that half is sorted.

Either way, exactly one half is sorted. We can apply standard binary-search reasoning to that half (compare target with its endpoints), then either find the target there or restrict the search to the other half.

This is the entire algorithmic insight. Now we apply it.

---

## Key Takeaway

A rotated sorted array has two sorted segments with all-bigger followed by all-smaller. At any midpoint, one half is fully sorted. Use that half to decide which half to discard. Now the two algorithms.

***

# Finding the Minimum

> **Course:** DSA › Algorithms › Searching › Sorted Rotated Array

The minimum is at the start of segment 2 — the only place where `arr[i-1] > arr[i]` (the unique "discontinuity"). Find that index.

## Algorithm

Compare `arr[mid]` with `arr[high]`:
- If `arr[mid] > arr[high]`: the discontinuity is in the right half — the minimum is somewhere in `(mid, high]`. Set `low = mid + 1`.
- Otherwise: the right half is sorted from `mid` onward — the minimum is in `[low, mid]`. Set `high = mid` (keeping `mid` as a candidate).

Loop until `low == high`. Return `low`.

```
arr = [4, 5, 6, 1, 2, 3]

low=0, high=5, mid=2, arr[mid]=6, arr[high]=3. 6 > 3 → low = 3
low=3, high=5, mid=4, arr[mid]=2, arr[high]=3. 2 ≤ 3 → high = 4
low=3, high=4, mid=3, arr[mid]=1, arr[high]=2. 1 ≤ 2 → high = 3
low=3, high=3 → loop exits
return 3 (arr[3] = 1, the minimum). ✓
```

## Why Compare with `arr[high]` (Not `arr[low]`)?

Comparing with `arr[high]` is unambiguous. If `arr[mid] > arr[high]`, the second segment must be in `(mid, high]` (because `arr[high]` is in segment 2 and `arr[mid]` is in segment 1, so the boundary is between them). Comparing with `arr[low]` works for distinct elements but breaks if duplicates are allowed (e.g., `arr[mid] == arr[low]` doesn't tell us which segment `mid` is in).

## Implementation

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def rotated_array_minimum(self, arr: List[int]) -> int:
        low, high = 0, len(arr) - 1
        while low < high:
            mid = low + (high - low) // 2
            if arr[mid] > arr[high]:
                low = mid + 1                           # min is in the right half
            else:
                high = mid                              # min is in the left half (incl. mid)
        return low


if __name__ == "__main__":
    print(Solution().rotated_array_minimum([4, 5, 6, 1, 2, 3]))   # 3
    print(Solution().rotated_array_minimum([5, 6, 1, 2, 3, 4]))   # 2
```

```java,editable
public class Solution {
    public int rotatedArrayMinimum(int[] arr) {
        int low = 0, high = arr.length - 1;
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] > arr[high]) low = mid + 1;
            else high = mid;
        }
        return low;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().rotatedArrayMinimum(new int[]{4, 5, 6, 1, 2, 3}));
    }
}
```

```c,editable
#include <stdio.h>

int rotated_array_minimum(int *arr, int n) {
    int low = 0, high = n - 1;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] > arr[high]) low = mid + 1;
        else high = mid;
    }
    return low;
}

int main(void) {
    int arr[] = {4, 5, 6, 1, 2, 3};
    printf("%d\n", rotated_array_minimum(arr, 6));
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

class Solution {
public:
    int rotatedArrayMinimum(const std::vector<int>& arr) {
        int low = 0, high = (int) arr.size() - 1;
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] > arr[high]) low = mid + 1;
            else high = mid;
        }
        return low;
    }
};

int main() {
    std::cout << Solution{}.rotatedArrayMinimum({4, 5, 6, 1, 2, 3}) << '\n';
}
```

```scala,editable
class Solution {
  def rotatedArrayMinimum(arr: Array[Int]): Int = {
    var low = 0; var high = arr.length - 1
    while (low < high) {
      val mid = low + (high - low) / 2
      if (arr(mid) > arr(high)) low = mid + 1 else high = mid
    }
    low
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    println(new Solution().rotatedArrayMinimum(Array(4, 5, 6, 1, 2, 3)))
  }
}
```

```javascript,editable
class Solution {
    rotatedArrayMinimum(arr) {
        let low = 0, high = arr.length - 1;
        while (low < high) {
            const mid = low + ((high - low) >> 1);
            if (arr[mid] > arr[high]) low = mid + 1;
            else high = mid;
        }
        return low;
    }
}

console.log(new Solution().rotatedArrayMinimum([4, 5, 6, 1, 2, 3]));
```

```typescript,editable
class Solution {
    rotatedArrayMinimum(arr: number[]): number {
        let low = 0, high = arr.length - 1;
        while (low < high) {
            const mid = low + ((high - low) >> 1);
            if (arr[mid] > arr[high]) low = mid + 1;
            else high = mid;
        }
        return low;
    }
}

console.log(new Solution().rotatedArrayMinimum([4, 5, 6, 1, 2, 3]));
```

```go,editable
package main

import "fmt"

func rotatedArrayMinimum(arr []int) int {
    low, high := 0, len(arr)-1
    for low < high {
        mid := low + (high-low)/2
        if arr[mid] > arr[high] {
            low = mid + 1
        } else {
            high = mid
        }
    }
    return low
}

func main() {
    fmt.Println(rotatedArrayMinimum([]int{4, 5, 6, 1, 2, 3}))
}
```

```kotlin,editable
class Solution {
    fun rotatedArrayMinimum(arr: IntArray): Int {
        var low = 0; var high = arr.size - 1
        while (low < high) {
            val mid = low + (high - low) / 2
            if (arr[mid] > arr[high]) low = mid + 1 else high = mid
        }
        return low
    }
}

fun main() {
    println(Solution().rotatedArrayMinimum(intArrayOf(4, 5, 6, 1, 2, 3)))
}
```

```rust,editable
fn rotated_array_minimum(arr: &[i32]) -> usize {
    let mut low = 0; let mut high = arr.len() - 1;
    while low < high {
        let mid = low + (high - low) / 2;
        if arr[mid] > arr[high] { low = mid + 1; } else { high = mid; }
    }
    low
}

fn main() {
    println!("{}", rotated_array_minimum(&[4, 5, 6, 1, 2, 3]));
}
```

</div>

***

# Searching for a Target

> **Course:** DSA › Algorithms › Searching › Sorted Rotated Array

Standard binary search structure plus one extra check: identify the sorted half and decide whether the target is in it.

## Algorithm

```
while low <= high:
    mid = (low + high) / 2
    if arr[mid] == target: return mid

    if arr[mid] >= arr[low]:               # left half [low, mid] is sorted
        if arr[low] <= target < arr[mid]: high = mid - 1   # target in left half
        else: low = mid + 1                                 # target in right half
    else:                                  # right half [mid, high] is sorted
        if arr[mid] < target <= arr[high]: low = mid + 1   # target in right half
        else: high = mid - 1                                # target in left half
```

The decision tree at each iteration:
1. Found target? Return.
2. Otherwise, identify the sorted half by checking `arr[mid] >= arr[low]` (left sorted) or `arr[mid] < arr[low]` (right sorted).
3. If target falls within the sorted half's value range → search there. Else → search the other half.

## A Walkthrough

`arr = [4, 5, 6, 1, 2, 3]`, `target = 2`.

```
low=0, high=5, mid=2, arr[mid]=6.
  6 != 2. arr[mid]=6 >= arr[low]=4 → left half [4,5,6] is sorted.
  Is 4 <= 2 < 6? no → target not in left → low = 3.

low=3, high=5, mid=4, arr[mid]=2.
  2 == 2 → return 4.
```

Two iterations to find the target on a 6-element array.

## Implementation

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def rotated_array_search(self, arr: List[int], target: int) -> int:
        low, high = 0, len(arr) - 1
        while low <= high:
            mid = low + (high - low) // 2
            if arr[mid] == target:
                return mid
            if arr[mid] >= arr[low]:                    # left half sorted
                if arr[low] <= target < arr[mid]:
                    high = mid - 1
                else:
                    low = mid + 1
            else:                                       # right half sorted
                if arr[mid] < target <= arr[high]:
                    low = mid + 1
                else:
                    high = mid - 1
        return -1


if __name__ == "__main__":
    print(Solution().rotated_array_search([4, 5, 6, 1, 2, 3], 2))   # 4
    print(Solution().rotated_array_search([4, 5, 6, 1, 2, 3], 10))  # -1
```

```java,editable
public class Solution {
    public int rotatedArraySearch(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] >= arr[low]) {
                if (arr[low] <= target && target < arr[mid]) high = mid - 1;
                else low = mid + 1;
            } else {
                if (arr[mid] < target && target <= arr[high]) low = mid + 1;
                else high = mid - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().rotatedArraySearch(new int[]{4, 5, 6, 1, 2, 3}, 2));
    }
}
```

```c,editable
#include <stdio.h>

int rotated_array_search(int *arr, int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] >= arr[low]) {
            if (arr[low] <= target && target < arr[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            if (arr[mid] < target && target <= arr[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}

int main(void) {
    int arr[] = {4, 5, 6, 1, 2, 3};
    printf("%d\n", rotated_array_search(arr, 6, 2));
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

class Solution {
public:
    int rotatedArraySearch(const std::vector<int>& arr, int target) {
        int low = 0, high = (int) arr.size() - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] >= arr[low]) {
                if (arr[low] <= target && target < arr[mid]) high = mid - 1;
                else low = mid + 1;
            } else {
                if (arr[mid] < target && target <= arr[high]) low = mid + 1;
                else high = mid - 1;
            }
        }
        return -1;
    }
};

int main() {
    std::cout << Solution{}.rotatedArraySearch({4, 5, 6, 1, 2, 3}, 2) << '\n';
}
```

```scala,editable
class Solution {
  def rotatedArraySearch(arr: Array[Int], target: Int): Int = {
    var low = 0; var high = arr.length - 1
    while (low <= high) {
      val mid = low + (high - low) / 2
      if (arr(mid) == target) return mid
      if (arr(mid) >= arr(low)) {
        if (arr(low) <= target && target < arr(mid)) high = mid - 1 else low = mid + 1
      } else {
        if (arr(mid) < target && target <= arr(high)) low = mid + 1 else high = mid - 1
      }
    }
    -1
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    println(new Solution().rotatedArraySearch(Array(4, 5, 6, 1, 2, 3), 2))
  }
}
```

```javascript,editable
class Solution {
    rotatedArraySearch(arr, target) {
        let low = 0, high = arr.length - 1;
        while (low <= high) {
            const mid = low + ((high - low) >> 1);
            if (arr[mid] === target) return mid;
            if (arr[mid] >= arr[low]) {
                if (arr[low] <= target && target < arr[mid]) high = mid - 1;
                else low = mid + 1;
            } else {
                if (arr[mid] < target && target <= arr[high]) low = mid + 1;
                else high = mid - 1;
            }
        }
        return -1;
    }
}

console.log(new Solution().rotatedArraySearch([4, 5, 6, 1, 2, 3], 2));
```

```typescript,editable
class Solution {
    rotatedArraySearch(arr: number[], target: number): number {
        let low = 0, high = arr.length - 1;
        while (low <= high) {
            const mid = low + ((high - low) >> 1);
            if (arr[mid] === target) return mid;
            if (arr[mid] >= arr[low]) {
                if (arr[low] <= target && target < arr[mid]) high = mid - 1;
                else low = mid + 1;
            } else {
                if (arr[mid] < target && target <= arr[high]) low = mid + 1;
                else high = mid - 1;
            }
        }
        return -1;
    }
}

console.log(new Solution().rotatedArraySearch([4, 5, 6, 1, 2, 3], 2));
```

```go,editable
package main

import "fmt"

func rotatedArraySearch(arr []int, target int) int {
    low, high := 0, len(arr)-1
    for low <= high {
        mid := low + (high-low)/2
        if arr[mid] == target {
            return mid
        }
        if arr[mid] >= arr[low] {
            if arr[low] <= target && target < arr[mid] {
                high = mid - 1
            } else {
                low = mid + 1
            }
        } else {
            if arr[mid] < target && target <= arr[high] {
                low = mid + 1
            } else {
                high = mid - 1
            }
        }
    }
    return -1
}

func main() {
    fmt.Println(rotatedArraySearch([]int{4, 5, 6, 1, 2, 3}, 2))
}
```

```kotlin,editable
class Solution {
    fun rotatedArraySearch(arr: IntArray, target: Int): Int {
        var low = 0; var high = arr.size - 1
        while (low <= high) {
            val mid = low + (high - low) / 2
            if (arr[mid] == target) return mid
            if (arr[mid] >= arr[low]) {
                if (arr[low] <= target && target < arr[mid]) high = mid - 1 else low = mid + 1
            } else {
                if (arr[mid] < target && target <= arr[high]) low = mid + 1 else high = mid - 1
            }
        }
        return -1
    }
}

fun main() {
    println(Solution().rotatedArraySearch(intArrayOf(4, 5, 6, 1, 2, 3), 2))
}
```

```rust,editable
fn rotated_array_search(arr: &[i32], target: i32) -> i32 {
    let mut low: i64 = 0;
    let mut high: i64 = arr.len() as i64 - 1;
    while low <= high {
        let mid = low + (high - low) / 2;
        let mid_u = mid as usize;
        if arr[mid_u] == target { return mid as i32; }
        if arr[mid_u] >= arr[low as usize] {
            if arr[low as usize] <= target && target < arr[mid_u] { high = mid - 1; }
            else { low = mid + 1; }
        } else {
            if arr[mid_u] < target && target <= arr[high as usize] { low = mid + 1; }
            else { high = mid - 1; }
        }
    }
    -1
}

fn main() {
    println!("{}", rotated_array_search(&[4, 5, 6, 1, 2, 3], 2));
}
```

</div>

***

# Complexity Analysis

| Algorithm | Time | Space |
|---|---|---|
| **Find minimum** | `O(log n)` | `O(1)` |
| **Search target** | `O(log n)` | `O(1)` |

Both algorithms halve the search range each iteration. The extra check ("which half is sorted?") is `O(1)` per iteration, so the total stays `O(log n)`.

***

# Rotated Array Minimum Problem

> **Course:** DSA › Algorithms › Searching › Sorted Rotated Array

Given a sorted-then-rotated array of *distinct* elements, return the index of the minimum.

```
Input:  arr = [4, 5, 6, 1, 2, 3]
Output: 3

Input:  arr = [5, 6, 1, 2, 3, 4]
Output: 2

Input:  arr = [6, 7, 2, 3, 4, 5]
Output: 2
```

The implementation matches the version above. See [Finding the Minimum](#finding-the-minimum) for all 10 languages.

---

## Edge Cases

| Case | Example | Expected |
|---|---|---|
| Not actually rotated | `[1, 2, 3]` | `0` (minimum at start) |
| Single element | `[5]` | `0` |
| Two elements rotated | `[2, 1]` | `1` |
| Two elements not rotated | `[1, 2]` | `0` |

***

# Rotated Array Search Problem

> **Course:** DSA › Algorithms › Searching › Sorted Rotated Array

Given a sorted-then-rotated array of *distinct* elements and a target, return the index of target, or `-1`.

```
Input:  arr = [4, 5, 6, 1, 2, 3], target = 3
Output: 5

Input:  arr = [5, 6, 1, 2, 3, 4], target = 6
Output: 1

Input:  arr = [6, 1, 2, 3, 4, 5], target = 10
Output: -1
```

The implementation matches the version above. See [Searching for a Target](#searching-for-a-target) for all 10 languages.

---

## Edge Cases

| Case | Example | Expected |
|---|---|---|
| Empty array | `[], target = 5` | `-1` |
| Not rotated, target present | `[1, 2, 3], target = 2` | `1` |
| Single element match | `[5], target = 5` | `0` |
| Target absent in rotated array | `[4, 5, 1, 2], target = 7` | `-1` |
| Target at the rotation boundary | `[4, 5, 1, 2], target = 1` | `2` |

---

## Final Takeaway

Sorted-rotated arrays look broken but are amenable to binary search via one extra check per iteration: which half is sorted? Once you know, the standard binary-search logic applies to the sorted half. `O(log n)` for both finding the minimum and searching for a target.

The next lesson shifts gears entirely — the Binary Search Pattern lesson begins the **pattern lessons** for searching. The five pattern lessons that follow cover four canonical patterns: **binary search pattern** (the Binary Search Pattern lesson), **lower-bound pattern** (the Lower Bound Pattern lesson), **upper-bound pattern** (the Upper Bound Pattern lesson), and the two **predicate-search patterns** (Minimum Predicate Search and Maximum Predicate Search). Each pattern lesson has 4 worked problems showing how to recognise and apply binary-search-style algorithms in scenarios that don't *look* like binary search at first glance.

**Transfer challenge — try before the Binary Search Pattern lesson:** What if the rotated array contains *duplicates*? For example, `[2, 2, 2, 0, 1, 2, 2]`. Does the minimum-finding algorithm still work? Why or why not?

<details>
<summary><strong>Answer — open after you've thought about it</strong></summary>

The algorithm partially breaks. When `arr[mid] == arr[high]`, we can't tell which segment they're in — both could be in segment 1 (so the right half could contain the minimum) or split across (so the right half is sorted from `mid` onward).

Fix: when `arr[mid] == arr[high]`, conservatively decrement `high` by 1. This is the only safe move — we can't make a binary decision.

```python,editable
class Solution:
    def rotated_min_with_dups(self, arr):
        low, high = 0, len(arr) - 1
        while low < high:
            mid = low + (high - low) // 2
            if arr[mid] > arr[high]: low = mid + 1
            elif arr[mid] < arr[high]: high = mid
            else: high -= 1                             # conservative: skip the duplicate
        return low


print(Solution().rotated_min_with_dups([2, 2, 2, 0, 1, 2, 2]))   # 3
```

Time complexity degrades to `O(n)` in the worst case (all elements equal — we decrement `high` `n - 1` times). The average case is still `O(log n)` for typical inputs. **You just discovered why "rotated array with duplicates" is a separate, harder problem (LeetCode #154 vs #153).**

</details>
