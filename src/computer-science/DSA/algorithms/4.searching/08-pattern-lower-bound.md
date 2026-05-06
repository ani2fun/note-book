# 8. Pattern: Lower Bound

The binary-search pattern (the Binary Search Pattern lesson) handled "is X in this sorted array?" The lower-bound pattern handles a richer family of questions: "where would X go?", "first occurrence of X", "first element ≥ X", "closest element to X". All of them collapse to a single primitive: **lower bound** — find the first index where `arr[i] >= target`.

By the end of this lesson you'll know the diagnostic checks for "this is a lower-bound problem," four worked problems showing different phrasings of the same primitive (insertion position, first-and-last range, closest element, k-closest window), and the canonical strategy: convert the question into "first index ≥ X" and apply the lower-bound algorithm from the Lower Bound lesson.

## Table of contents

1. [Identifying the lower bound pattern](#identifying-the-lower-bound-pattern)
2. [Search insert position](#search-insert-position)
3. [First and last position](#first-and-last-position)
4. [Closest element](#closest-element)
5. [K closest elements](#k-closest-elements)

***

# Identifying the Lower Bound Pattern

> **Course:** DSA › Algorithms › Searching › Lower Bound Pattern

Three diagnostic questions:

| # | Question | If "yes," lower bound fits because... |
|---|---|---|
| **Q1** | Is the data sorted in ascending order? | Lower bound needs monotone non-decreasing input. |
| **Q2** | Are we looking for a *position* (first occurrence, insertion point, neighbour)? | Lower bound returns position; that's its native output. |
| **Q3** | Could the target be absent? Or appear multiple times? | Plain binary search returns "any" or "none"; lower bound returns a *consistent* position even on edges. |

If all three hold, lower bound is the right primitive.

---

## Common Disguises

- **"Insert in sorted order"** → lower bound directly returns the insertion position.
- **"First occurrence" or "Last occurrence"** → first = `lower_bound(t)`; last = `lower_bound(t+1) - 1`.
- **"Closest element to target"** → lower bound finds the threshold; check it and the previous element.
- **"K elements closest to target"** → lower bound anchors a sliding window that expands outward.

---

# Search Insert Position

> **Course:** DSA › Algorithms › Searching › Lower Bound Pattern

Direct lower-bound application.

## The Problem

Given a sorted array `arr` and `target`, return target's index if present; otherwise return the index where target would be inserted to keep the array sorted.

```
Input:  arr = [1, 2, 3, 4, 5, 6], target = 3
Output: 2

Input:  arr = [1, 2, 7, 8, 9, 10], target = 3
Output: 2   (would insert before 7)

Input:  arr = [1, 2, 7, 9, 10, 11], target = 8
Output: 3
```

## The Solution

Just lower bound.

<div class="lang-tabs">

```pseudocode
# Index where target would be inserted to keep arr sorted = lower bound.
function searchInsertPosition(arr, target):
    low ← 0; high ← length(arr)
    while low < high:
        mid ← low + (high − low) ÷ 2
        if arr[mid] < target:
            low ← mid + 1
        else:
            high ← mid
    return low
```

```python,editable
from typing import List

class Solution:
    def search_insert_position(self, arr: List[int], target: int) -> int:
        low, high = 0, len(arr)
        while low < high:
            mid = low + (high - low) // 2
            if arr[mid] < target: low = mid + 1
            else: high = mid
        return low


if __name__ == "__main__":
    print(Solution().search_insert_position([1, 2, 7, 8, 9, 10], 3))   # 2
```

```java,editable
public class Solution {
    public int searchInsertPosition(int[] arr, int target) {
        int low = 0, high = arr.length;
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] < target) low = mid + 1; else high = mid;
        }
        return low;
    }
}
```

```c,editable
int search_insert_position(int *arr, int n, int target) {
    int low = 0, high = n;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] < target) low = mid + 1; else high = mid;
    }
    return low;
}
```

```cpp,editable
#include <vector>

class Solution {
public:
    int searchInsertPosition(std::vector<int>& arr, int target) {
        int low = 0, high = (int) arr.size();
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] < target) low = mid + 1; else high = mid;
        }
        return low;
    }
};
```

```scala,editable
class Solution {
  def searchInsertPosition(arr: Array[Int], target: Int): Int = {
    var low = 0; var high = arr.length
    while (low < high) {
      val mid = low + (high - low) / 2
      if (arr(mid) < target) low = mid + 1 else high = mid
    }
    low
  }
}
```

```typescript,editable
class Solution {
    searchInsertPosition(arr: number[], target: number): number {
        let low = 0, high = arr.length;
        while (low < high) {
            const mid = low + ((high - low) >> 1);
            if (arr[mid] < target) low = mid + 1; else high = mid;
        }
        return low;
    }
}
```

```go,editable
package main

func searchInsertPosition(arr []int, target int) int {
    low, high := 0, len(arr)
    for low < high {
        mid := low + (high-low)/2
        if arr[mid] < target { low = mid + 1 } else { high = mid }
    }
    return low
}
```

```rust,editable
fn search_insert_position(arr: &[i32], target: i32) -> usize {
    let mut low = 0; let mut high = arr.len();
    while low < high {
        let mid = low + (high - low) / 2;
        if arr[mid] < target { low = mid + 1; } else { high = mid; }
    }
    low
}
```

</div>

`O(log n)` time, `O(1)` space.

***

# First and Last Position

> **Course:** DSA › Algorithms › Searching › Lower Bound Pattern

Two `O(log n)` queries — `lower_bound(target)` for the first index, `lower_bound(target + 1) - 1` for the last.

## The Problem

Given a sorted array and target, return `[first_index, last_index]` of target, or `[-1, -1]` if absent.

```
Input:  arr = [1, 2, 2, 2, 3, 4], target = 2
Output: [1, 3]

Input:  arr = [1, 2, 2, 2, 3, 4], target = 3
Output: [4, 4]

Input:  arr = [1, 2, 2, 2, 3, 4], target = 5
Output: [-1, -1]
```

## The Solution

<div class="lang-tabs">

```pseudocode
# First position = lowerBound(target). Last position = lowerBound(target + 1) − 1.
function firstAndLastPosition(arr, target):
    first ← lowerBound(arr, target)
    if first = length(arr) OR arr[first] ≠ target:
        return [−1, −1]                         # target absent
    last ← lowerBound(arr, target + 1) − 1
    return [first, last]
```

```python,editable
from typing import List

class Solution:
    def first_and_last_position(self, arr: List[int], target: int) -> List[int]:
        first = self._lower_bound(arr, target)
        if first == len(arr) or arr[first] != target:
            return [-1, -1]
        last = self._lower_bound(arr, target + 1) - 1
        return [first, last]

    def _lower_bound(self, arr, target):
        low, high = 0, len(arr)
        while low < high:
            mid = low + (high - low) // 2
            if arr[mid] < target: low = mid + 1
            else: high = mid
        return low


if __name__ == "__main__":
    print(Solution().first_and_last_position([1, 2, 2, 2, 3, 4], 2))   # [1, 3]
```

```java,editable
public class Solution {
    public int[] firstAndLastPosition(int[] arr, int target) {
        int first = lowerBound(arr, target);
        if (first == arr.length || arr[first] != target) return new int[]{-1, -1};
        int last = lowerBound(arr, target + 1) - 1;
        return new int[]{first, last};
    }
    private int lowerBound(int[] arr, int target) {
        int low = 0, high = arr.length;
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] < target) low = mid + 1; else high = mid;
        }
        return low;
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>

int lower_bound(int *arr, int n, int target) {
    int low = 0, high = n;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] < target) low = mid + 1; else high = mid;
    }
    return low;
}

int *first_and_last_position(int *arr, int n, int target) {
    int *result = (int *) malloc(2 * sizeof(int));
    int first = lower_bound(arr, n, target);
    if (first == n || arr[first] != target) { result[0] = result[1] = -1; return result; }
    result[0] = first;
    result[1] = lower_bound(arr, n, target + 1) - 1;
    return result;
}
```

```cpp,editable
#include <vector>

class Solution {
public:
    std::vector<int> firstAndLastPosition(std::vector<int>& arr, int target) {
        int first = lowerBound(arr, target);
        if (first == (int) arr.size() || arr[first] != target) return {-1, -1};
        int last = lowerBound(arr, target + 1) - 1;
        return {first, last};
    }
    int lowerBound(std::vector<int>& arr, int target) {
        int low = 0, high = (int) arr.size();
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] < target) low = mid + 1; else high = mid;
        }
        return low;
    }
};
```

```scala,editable
class Solution {
  def firstAndLastPosition(arr: Array[Int], target: Int): Array[Int] = {
    val first = lowerBound(arr, target)
    if (first == arr.length || arr(first) != target) Array(-1, -1)
    else Array(first, lowerBound(arr, target + 1) - 1)
  }
  private def lowerBound(arr: Array[Int], target: Int): Int = {
    var low = 0; var high = arr.length
    while (low < high) {
      val mid = low + (high - low) / 2
      if (arr(mid) < target) low = mid + 1 else high = mid
    }
    low
  }
}
```

```typescript,editable
class Solution {
    firstAndLastPosition(arr: number[], target: number): number[] {
        const first = this._lowerBound(arr, target);
        if (first === arr.length || arr[first] !== target) return [-1, -1];
        return [first, this._lowerBound(arr, target + 1) - 1];
    }
    private _lowerBound(arr: number[], target: number): number {
        let low = 0, high = arr.length;
        while (low < high) {
            const mid = low + ((high - low) >> 1);
            if (arr[mid] < target) low = mid + 1; else high = mid;
        }
        return low;
    }
}
```

```go,editable
package main

func lowerBound(arr []int, target int) int {
    low, high := 0, len(arr)
    for low < high {
        mid := low + (high-low)/2
        if arr[mid] < target { low = mid + 1 } else { high = mid }
    }
    return low
}

func firstAndLastPosition(arr []int, target int) []int {
    first := lowerBound(arr, target)
    if first == len(arr) || arr[first] != target { return []int{-1, -1} }
    return []int{first, lowerBound(arr, target+1) - 1}
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

fn first_and_last_position(arr: &[i32], target: i32) -> Vec<i32> {
    let first = lower_bound(arr, target);
    if first == arr.len() || arr[first] != target { return vec![-1, -1]; }
    let last = lower_bound(arr, target + 1) - 1;
    vec![first as i32, last as i32]
}
```

</div>

***

# Closest Element

> **Course:** DSA › Algorithms › Searching › Lower Bound Pattern

Use lower bound to find the threshold position; the answer is either at the threshold or just before it.

## The Problem

Given a sorted array and target, return the closest element. Ties broken by smaller value.

```
Input:  arr = [1, 2, 3, 4, 5, 6], target = 4
Output: 4

Input:  arr = [2, 4, 6, 8, 10, 12], target = 5
Output: 4   (4 and 6 are equidistant; smaller wins)

Input:  arr = [1, 10], target = 7
Output: 10
```

## The Solution

`lower_bound(target)` gives the smallest index `i` with `arr[i] >= target`. The closest element is either `arr[i]` or `arr[i - 1]` — compare distances.

<div class="lang-tabs">

```pseudocode
# Closest element to target. The closest must be at lowerBound(target) or just before it.
function closestElement(arr, target):
    if arr is empty: return −1
    idx ← lowerBound(arr, target)
    if idx = 0:               return arr[0]
    if idx = length(arr):     return arr[length(arr) − 1]
    lower ← arr[idx − 1]
    upper ← arr[idx]
    if target − lower ≤ upper − target:         # tie → smaller value wins
        return lower
    return upper
```

```python,editable
from typing import List

class Solution:
    def closest_element(self, arr: List[int], target: int) -> int:
        if not arr: return -1
        idx = self._lower_bound(arr, target)
        if idx == 0: return arr[0]
        if idx == len(arr): return arr[-1]
        lower, upper = arr[idx - 1], arr[idx]
        if target - lower <= upper - target:            # tie → smaller (lower) wins
            return lower
        return upper

    def _lower_bound(self, arr, target):
        low, high = 0, len(arr)
        while low < high:
            mid = low + (high - low) // 2
            if arr[mid] < target: low = mid + 1
            else: high = mid
        return low


if __name__ == "__main__":
    print(Solution().closest_element([2, 4, 6, 8, 10, 12], 5))   # 4
```

```java,editable
public class Solution {
    public int closestElement(int[] arr, int target) {
        if (arr.length == 0) return -1;
        int idx = lowerBound(arr, target);
        if (idx == 0) return arr[0];
        if (idx == arr.length) return arr[arr.length - 1];
        int lower = arr[idx - 1], upper = arr[idx];
        return (target - lower <= upper - target) ? lower : upper;
    }
    private int lowerBound(int[] arr, int target) {
        int low = 0, high = arr.length;
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] < target) low = mid + 1; else high = mid;
        }
        return low;
    }
}
```

```c,editable
int lower_bound_arr(int *arr, int n, int target) {
    int low = 0, high = n;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] < target) low = mid + 1; else high = mid;
    }
    return low;
}

int closest_element(int *arr, int n, int target) {
    if (n == 0) return -1;
    int idx = lower_bound_arr(arr, n, target);
    if (idx == 0) return arr[0];
    if (idx == n) return arr[n - 1];
    int lower = arr[idx - 1], upper = arr[idx];
    return (target - lower <= upper - target) ? lower : upper;
}
```

```cpp,editable
#include <vector>

class Solution {
public:
    int closestElement(std::vector<int>& arr, int target) {
        if (arr.empty()) return -1;
        int idx = lowerBound(arr, target);
        if (idx == 0) return arr[0];
        if (idx == (int) arr.size()) return arr.back();
        int lower = arr[idx - 1], upper = arr[idx];
        return (target - lower <= upper - target) ? lower : upper;
    }
    int lowerBound(std::vector<int>& arr, int target) {
        int low = 0, high = (int) arr.size();
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] < target) low = mid + 1; else high = mid;
        }
        return low;
    }
};
```

```scala,editable
class Solution {
  def closestElement(arr: Array[Int], target: Int): Int = {
    if (arr.isEmpty) return -1
    val idx = lowerBound(arr, target)
    if (idx == 0) return arr(0)
    if (idx == arr.length) return arr.last
    val lower = arr(idx - 1); val upper = arr(idx)
    if (target - lower <= upper - target) lower else upper
  }
  private def lowerBound(arr: Array[Int], target: Int): Int = {
    var low = 0; var high = arr.length
    while (low < high) {
      val mid = low + (high - low) / 2
      if (arr(mid) < target) low = mid + 1 else high = mid
    }
    low
  }
}
```

```typescript,editable
class Solution {
    closestElement(arr: number[], target: number): number {
        if (!arr.length) return -1;
        const idx = this._lowerBound(arr, target);
        if (idx === 0) return arr[0];
        if (idx === arr.length) return arr[arr.length - 1];
        const lower = arr[idx - 1], upper = arr[idx];
        return (target - lower <= upper - target) ? lower : upper;
    }
    private _lowerBound(arr: number[], target: number): number {
        let low = 0, high = arr.length;
        while (low < high) {
            const mid = low + ((high - low) >> 1);
            if (arr[mid] < target) low = mid + 1; else high = mid;
        }
        return low;
    }
}
```

```go,editable
package main

func lowerBound(arr []int, target int) int {
    low, high := 0, len(arr)
    for low < high {
        mid := low + (high-low)/2
        if arr[mid] < target { low = mid + 1 } else { high = mid }
    }
    return low
}

func closestElement(arr []int, target int) int {
    if len(arr) == 0 { return -1 }
    idx := lowerBound(arr, target)
    if idx == 0 { return arr[0] }
    if idx == len(arr) { return arr[len(arr)-1] }
    lower, upper := arr[idx-1], arr[idx]
    if target-lower <= upper-target { return lower }
    return upper
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

fn closest_element(arr: &[i32], target: i32) -> i32 {
    if arr.is_empty() { return -1; }
    let idx = lower_bound(arr, target);
    if idx == 0 { return arr[0]; }
    if idx == arr.len() { return arr[arr.len() - 1]; }
    let lower = arr[idx - 1]; let upper = arr[idx];
    if target - lower <= upper - target { lower } else { upper }
}
```

</div>

***

# K Closest Elements

> **Course:** DSA › Algorithms › Searching › Lower Bound Pattern

Lower bound anchors a sliding window that expands outward.

## The Problem

Given a sorted array, integer `k`, and integer `target`, return the `k` closest elements to target, sorted ascending. Ties broken by smaller value first.

```
Input:  arr = [1, 2, 3, 4, 5, 6], k = 3, target = 4
Output: [3, 4, 5]

Input:  arr = [1, 4, 5, 6, 7, 8], k = 3, target = 4
Output: [4, 5, 6]

Input:  arr = [1, 5, 8, 10, 12, 13], k = 3, target = 10
Output: [8, 10, 12]
```

## The Solution

Find lower bound (call it `right`); set `left = right - 1`. Expand outward k times: each step, take whichever side has the closer element.

<div class="lang-tabs">

```pseudocode
# Two-pointer expansion outward from lowerBound(target).
function kClosestElements(arr, k, target):
    if arr is empty OR k ≤ 0:
        return empty list
    right ← lowerBound(arr, target)             # first index with arr[i] ≥ target
    left  ← right − 1
    repeat k times:
        if left < 0:
            right ← right + 1                   # only the right side has elements left
        else if right ≥ length(arr):
            left ← left − 1                     # only the left side has elements left
        else if target − arr[left] ≤ arr[right] − target:
            left ← left − 1                     # left element is closer (or tied)
        else:
            right ← right + 1
    return arr[left + 1 .. right − 1]           # the k elements just inside the pointers
```

```python,editable
from typing import List

class Solution:
    def k_closest_elements(self, arr: List[int], k: int, target: int) -> List[int]:
        if not arr or k <= 0: return []
        right = self._lower_bound(arr, target)
        left = right - 1
        for _ in range(k):
            if left < 0:
                right += 1
            elif right >= len(arr):
                left -= 1
            elif target - arr[left] <= arr[right] - target:
                left -= 1
            else:
                right += 1
        return arr[left + 1:right]

    def _lower_bound(self, arr, target):
        low, high = 0, len(arr)
        while low < high:
            mid = low + (high - low) // 2
            if arr[mid] < target: low = mid + 1
            else: high = mid
        return low


if __name__ == "__main__":
    print(Solution().k_closest_elements([1, 2, 3, 4, 5, 6], 3, 4))   # [3, 4, 5]
```

```java,editable
import java.util.*;

public class Solution {
    public List<Integer> kClosestElements(int[] arr, int k, int target) {
        if (arr.length == 0 || k <= 0) return new ArrayList<>();
        int right = lowerBound(arr, target);
        int left = right - 1;
        for (int i = 0; i < k; i++) {
            if (left < 0) right++;
            else if (right >= arr.length) left--;
            else if (target - arr[left] <= arr[right] - target) left--;
            else right++;
        }
        List<Integer> result = new ArrayList<>();
        for (int i = left + 1; i < right; i++) result.add(arr[i]);
        return result;
    }
    private int lowerBound(int[] arr, int target) {
        int low = 0, high = arr.length;
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] < target) low = mid + 1; else high = mid;
        }
        return low;
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>

int lb(int *arr, int n, int target) {
    int low = 0, high = n;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] < target) low = mid + 1; else high = mid;
    }
    return low;
}

int *k_closest_elements(int *arr, int n, int k, int target, int *outLen) {
    if (n == 0 || k <= 0) { *outLen = 0; return NULL; }
    int right = lb(arr, n, target);
    int left = right - 1;
    for (int i = 0; i < k; i++) {
        if (left < 0) right++;
        else if (right >= n) left--;
        else if (target - arr[left] <= arr[right] - target) left--;
        else right++;
    }
    int len = right - (left + 1);
    int *result = (int *) malloc(len * sizeof(int));
    for (int i = 0; i < len; i++) result[i] = arr[left + 1 + i];
    *outLen = len;
    return result;
}
```

```cpp,editable
#include <vector>

class Solution {
public:
    std::vector<int> kClosestElements(std::vector<int>& arr, int k, int target) {
        if (arr.empty() || k <= 0) return {};
        int right = lowerBound(arr, target);
        int left = right - 1;
        for (int i = 0; i < k; i++) {
            if (left < 0) right++;
            else if (right >= (int) arr.size()) left--;
            else if (target - arr[left] <= arr[right] - target) left--;
            else right++;
        }
        return std::vector<int>(arr.begin() + left + 1, arr.begin() + right);
    }
    int lowerBound(std::vector<int>& arr, int target) {
        int low = 0, high = (int) arr.size();
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] < target) low = mid + 1; else high = mid;
        }
        return low;
    }
};
```

```scala,editable
class Solution {
  def kClosestElements(arr: Array[Int], k: Int, target: Int): List[Int] = {
    if (arr.isEmpty || k <= 0) return List.empty
    var right = lowerBound(arr, target)
    var left = right - 1
    for (_ <- 0 until k) {
      if (left < 0) right += 1
      else if (right >= arr.length) left -= 1
      else if (target - arr(left) <= arr(right) - target) left -= 1
      else right += 1
    }
    arr.slice(left + 1, right).toList
  }
  private def lowerBound(arr: Array[Int], target: Int): Int = {
    var low = 0; var high = arr.length
    while (low < high) {
      val mid = low + (high - low) / 2
      if (arr(mid) < target) low = mid + 1 else high = mid
    }
    low
  }
}
```

```typescript,editable
class Solution {
    kClosestElements(arr: number[], k: number, target: number): number[] {
        if (!arr.length || k <= 0) return [];
        let right = this._lowerBound(arr, target);
        let left = right - 1;
        for (let i = 0; i < k; i++) {
            if (left < 0) right++;
            else if (right >= arr.length) left--;
            else if (target - arr[left] <= arr[right] - target) left--;
            else right++;
        }
        return arr.slice(left + 1, right);
    }
    private _lowerBound(arr: number[], target: number): number {
        let low = 0, high = arr.length;
        while (low < high) {
            const mid = low + ((high - low) >> 1);
            if (arr[mid] < target) low = mid + 1; else high = mid;
        }
        return low;
    }
}
```

```go,editable
package main

func lb(arr []int, target int) int {
    low, high := 0, len(arr)
    for low < high {
        mid := low + (high-low)/2
        if arr[mid] < target { low = mid + 1 } else { high = mid }
    }
    return low
}

func kClosestElements(arr []int, k, target int) []int {
    if len(arr) == 0 || k <= 0 { return []int{} }
    right := lb(arr, target)
    left := right - 1
    for i := 0; i < k; i++ {
        if left < 0 { right++ } else if right >= len(arr) { left-- } else if target-arr[left] <= arr[right]-target { left-- } else { right++ }
    }
    return append([]int{}, arr[left+1:right]...)
}
```

```rust,editable
fn lb(arr: &[i32], target: i32) -> i64 {
    let mut low: i64 = 0; let mut high: i64 = arr.len() as i64;
    while low < high {
        let mid = low + (high - low) / 2;
        if arr[mid as usize] < target { low = mid + 1; } else { high = mid; }
    }
    low
}

fn k_closest_elements(arr: &[i32], k: i32, target: i32) -> Vec<i32> {
    if arr.is_empty() || k <= 0 { return Vec::new(); }
    let n = arr.len() as i64;
    let mut right: i64 = lb(arr, target);
    let mut left: i64 = right - 1;
    for _ in 0..k {
        if left < 0 { right += 1; }
        else if right >= n { left -= 1; }
        else if target - arr[left as usize] <= arr[right as usize] - target { left -= 1; }
        else { right += 1; }
    }
    arr[(left + 1) as usize..right as usize].to_vec()
}
```

</div>

***

## Final Takeaway

Lower bound is the single primitive behind a family of "where should this go?" queries. The four problems showed insertion position, range queries, closest neighbour, and k-closest. Each adds a small post-processing step to the same `O(log n)` lower bound query.

The next lesson (the Upper Bound Pattern lesson) handles the dual — **upper bound pattern** for problems that require the *first index strictly greater than target*.

**Transfer challenge — try before the Upper Bound Pattern lesson:** Use lower bound to count how many elements in a sorted array are *strictly less than* target. (Hint: that's the lower bound's return value.)
