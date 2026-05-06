# 7. Pattern: Binary Search

The first six lessons (Binary Search through Sorted Rotated Array) covered the *direct* applications of binary search and its variants. The five pattern lessons that follow generalise the technique. **Pattern 1 — Binary Search** covers problems where the binary-search algorithm itself is the answer, but spotting that takes practice. The "needle in a haystack" might be a code in a recovery list, a target in a descending array, or a shared element across multiple sorted rows.

By the end of this lesson you'll know the diagnostic checks for "this looks like a binary-search problem," four worked problems showing different ways the algorithm appears, and the canonical strategy: if the data is sorted (in any monotone direction), binary search is your default tool.

## Table of contents

1. [Identifying the binary search pattern](#identifying-the-binary-search-pattern)
2. [Recovery validation](#recovery-validation)
3. [Reverse binary search](#reverse-binary-search)
4. [Minimum shared element](#minimum-shared-element)
5. [Intersecting elements](#intersecting-elements)

***

# Identifying the Binary Search Pattern

> **Course:** DSA › Algorithms › Searching › Binary Search Pattern

Two diagnostic questions decide whether plain binary search applies.

| # | Question | If "yes," binary search fits because... |
|---|---|---|
| **Q1** | Is the data sorted (ascending or descending)? | Binary search needs a monotone sequence to halve the search space. |
| **Q2** | Are we looking up *whether/where* a specific target exists, not transforming it? | Binary search returns position; lookups are its native use case. |

If both are "yes," `O(log n)` per query is the best you can do.

---

## Common Disguises

Binary search problems often *look* like nested loops or hash lookups at first. Watch for:

- **"Sorted" + "search for"** — direct application.
- **"Sorted in descending order"** — reverse the comparison; algorithm is otherwise identical.
- **"Each row is sorted"** — binary search per row turns `O(n)` into `O(log n)` per row.
- **"Find common elements"** — iterate one collection, binary-search each in the other.
- **Multi-key lookup** — binary search on the key field; verify other fields after.

The trade-off: binary search needs sorted input. If the data isn't sorted but is queried many times, sorting once (`O(n log n)`) and then binary-searching (`O(log n)` per query) beats repeated linear scans (`O(n)` per query) after roughly `log n` queries.

---

## Strategy

When you see a search-style problem on sorted data:
1. Identify the sort axis.
2. Identify the target.
3. Apply binary search (or its variants) with the right comparison.

The four worked problems below show this strategy applied in different settings: a single sorted array (recovery), a descending array (reverse search), a sorted-row matrix with column-wise checks (shared element), and the same with multi-result extraction (intersection).

---

# Recovery Validation

> **Course:** DSA › Algorithms › Searching › Binary Search Pattern

A list of valid recovery codes (sorted) and a list of attempts. Did *any* attempt succeed?

## The Problem

Given a sorted array `recoveryCodes` and an array `attempts`, return `true` if any attempt is in the recovery codes list. **Must run in `O(N log N)`** where `N = len(attempts)`, `M = len(recoveryCodes)`.

```
Input:  recoveryCodes = [1, 4, 7], attempts = [2, 4]
Output: true   (4 is in recovery codes)

Input:  recoveryCodes = [5, 9, 11, 12], attempts = [2, 9, 12]
Output: true

Input:  recoveryCodes = [1, 2, 3], attempts = [5, 6]
Output: false
```

## The Solution

Linear scan over `attempts`; binary-search each one against `recoveryCodes`. Total: `O(N log M)`. Stop on first match.

<div class="lang-tabs">

```pseudocode
function recoveryValidation(recoveryCodes, attempts):
    for each attempt in attempts:
        if binarySearch(recoveryCodes, attempt) ≠ −1:
            return true                         # any single match unlocks
    return false

function binarySearch(arr, target):
    low ← 0; high ← length(arr) − 1
    while low ≤ high:
        mid ← low + (high − low) ÷ 2
        if arr[mid] = target: return mid
        if arr[mid] < target: low ← mid + 1
        else: high ← mid − 1
    return −1
```

```python,editable
from typing import List

class Solution:
    def recovery_validation(self, recovery_codes: List[int], attempts: List[int]) -> bool:
        for attempt in attempts:
            if self._binary_search(recovery_codes, attempt) != -1:
                return True
        return False

    def _binary_search(self, arr: List[int], target: int) -> int:
        low, high = 0, len(arr) - 1
        while low <= high:
            mid = low + (high - low) // 2
            if arr[mid] == target: return mid
            if arr[mid] < target: low = mid + 1
            else: high = mid - 1
        return -1


if __name__ == "__main__":
    print(Solution().recovery_validation([1, 4, 7], [2, 4]))   # True
```

```java,editable
public class Solution {
    public boolean recoveryValidation(int[] recoveryCodes, int[] attempts) {
        for (int a : attempts) if (binarySearch(recoveryCodes, a) != -1) return true;
        return false;
    }
    private int binarySearch(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1; else high = mid - 1;
        }
        return -1;
    }
}
```

```c,editable
#include <stdio.h>
#include <stdbool.h>

int binary_search(int *arr, int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1; else high = mid - 1;
    }
    return -1;
}

bool recovery_validation(int *codes, int nc, int *attempts, int na) {
    for (int i = 0; i < na; i++) if (binary_search(codes, nc, attempts[i]) != -1) return true;
    return false;
}
```

```cpp,editable
#include <vector>

class Solution {
public:
    bool recoveryValidation(std::vector<int>& codes, std::vector<int>& attempts) {
        for (int a : attempts) if (binarySearch(codes, a) != -1) return true;
        return false;
    }
    int binarySearch(std::vector<int>& arr, int target) {
        int low = 0, high = (int) arr.size() - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1; else high = mid - 1;
        }
        return -1;
    }
};
```

```scala,editable
class Solution {
  def recoveryValidation(codes: Array[Int], attempts: Array[Int]): Boolean = {
    attempts.exists(a => binarySearch(codes, a) != -1)
  }
  private def binarySearch(arr: Array[Int], target: Int): Int = {
    var low = 0; var high = arr.length - 1
    while (low <= high) {
      val mid = low + (high - low) / 2
      if (arr(mid) == target) return mid
      if (arr(mid) < target) low = mid + 1 else high = mid - 1
    }
    -1
  }
}
```

```typescript,editable
class Solution {
    recoveryValidation(codes: number[], attempts: number[]): boolean {
        return attempts.some(a => this._binarySearch(codes, a) !== -1);
    }
    private _binarySearch(arr: number[], target: number): number {
        let low = 0, high = arr.length - 1;
        while (low <= high) {
            const mid = low + ((high - low) >> 1);
            if (arr[mid] === target) return mid;
            if (arr[mid] < target) low = mid + 1; else high = mid - 1;
        }
        return -1;
    }
}
```

```go,editable
package main

func binarySearch(arr []int, target int) int {
    low, high := 0, len(arr)-1
    for low <= high {
        mid := low + (high-low)/2
        if arr[mid] == target { return mid }
        if arr[mid] < target { low = mid + 1 } else { high = mid - 1 }
    }
    return -1
}

func recoveryValidation(codes, attempts []int) bool {
    for _, a := range attempts { if binarySearch(codes, a) != -1 { return true } }
    return false
}
```

```rust,editable
fn binary_search(arr: &[i32], target: i32) -> i32 {
    let mut low: i64 = 0; let mut high: i64 = arr.len() as i64 - 1;
    while low <= high {
        let mid = low + (high - low) / 2;
        if arr[mid as usize] == target { return mid as i32; }
        if arr[mid as usize] < target { low = mid + 1; } else { high = mid - 1; }
    }
    -1
}

fn recovery_validation(codes: &[i32], attempts: &[i32]) -> bool {
    attempts.iter().any(|&a| binary_search(codes, a) != -1)
}
```

</div>

## Complexity

`O(N log M)` time where `N = len(attempts)`, `M = len(recoveryCodes)`. `O(1)` space.

***

# Reverse Binary Search

> **Course:** DSA › Algorithms › Searching › Binary Search Pattern

Same algorithm with one comparison flipped: works on descending-sorted arrays.

## The Problem

Given a descending-sorted array `arr` and `target`, return target's index, or `-1`.

```
Input:  arr = [6, 5, 4, 3, 2, 1], target = 3
Output: 3

Input:  arr = [6, 5, 4, 3, 2, 1], target = 6
Output: 0

Input:  arr = [6, 5, 4, 3, 2, 1], target = 10
Output: -1
```

## The Solution

The skeleton is identical to plain binary search — only the comparison logic flips. In ascending order: `arr[mid] < target` means "look right." In descending order: `arr[mid] < target` means "look *left*" (because larger values are on the left).

<div class="lang-tabs">

```pseudocode
# Binary search on a descending array — flip the comparisons.
function reverseBinarySearch(arr, target):
    low ← 0; high ← length(arr) − 1
    while low ≤ high:
        mid ← low + (high − low) ÷ 2
        if arr[mid] = target: return mid
        if arr[mid] < target: high ← mid − 1   # smaller value → larger ones lie LEFT
        else: low ← mid + 1                     # larger value → smaller ones lie RIGHT
    return −1
```

```python,editable
from typing import List

class Solution:
    def reverse_binary_search(self, arr: List[int], target: int) -> int:
        low, high = 0, len(arr) - 1
        while low <= high:
            mid = low + (high - low) // 2
            if arr[mid] == target: return mid
            if arr[mid] < target: high = mid - 1            # smaller → larger is to the left
            else: low = mid + 1                              # larger → smaller is to the right
        return -1


if __name__ == "__main__":
    print(Solution().reverse_binary_search([6, 5, 4, 3, 2, 1], 3))   # 3
```

```java,editable
public class Solution {
    public int reverseBinarySearch(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) high = mid - 1;
            else low = mid + 1;
        }
        return -1;
    }
}
```

```c,editable
#include <stdio.h>

int reverse_binary_search(int *arr, int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) high = mid - 1;
        else low = mid + 1;
    }
    return -1;
}
```

```cpp,editable
#include <vector>

class Solution {
public:
    int reverseBinarySearch(std::vector<int>& arr, int target) {
        int low = 0, high = (int) arr.size() - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) high = mid - 1;
            else low = mid + 1;
        }
        return -1;
    }
};
```

```scala,editable
class Solution {
  def reverseBinarySearch(arr: Array[Int], target: Int): Int = {
    var low = 0; var high = arr.length - 1
    while (low <= high) {
      val mid = low + (high - low) / 2
      if (arr(mid) == target) return mid
      if (arr(mid) < target) high = mid - 1 else low = mid + 1
    }
    -1
  }
}
```

```typescript,editable
class Solution {
    reverseBinarySearch(arr: number[], target: number): number {
        let low = 0, high = arr.length - 1;
        while (low <= high) {
            const mid = low + ((high - low) >> 1);
            if (arr[mid] === target) return mid;
            if (arr[mid] < target) high = mid - 1; else low = mid + 1;
        }
        return -1;
    }
}
```

```go,editable
package main

func reverseBinarySearch(arr []int, target int) int {
    low, high := 0, len(arr)-1
    for low <= high {
        mid := low + (high-low)/2
        if arr[mid] == target { return mid }
        if arr[mid] < target { high = mid - 1 } else { low = mid + 1 }
    }
    return -1
}
```

```rust,editable
fn reverse_binary_search(arr: &[i32], target: i32) -> i32 {
    let mut low: i64 = 0; let mut high: i64 = arr.len() as i64 - 1;
    while low <= high {
        let mid = low + (high - low) / 2;
        if arr[mid as usize] == target { return mid as i32; }
        if arr[mid as usize] < target { high = mid - 1; } else { low = mid + 1; }
    }
    -1
}
```

</div>

## Complexity

`O(log n)` time, `O(1)` space.

***

# Minimum Shared Element

> **Course:** DSA › Algorithms › Searching › Binary Search Pattern

Multi-row sorted matrix. Find the smallest element that appears in *every* row.

## The Problem

Given an `N × M` matrix where each row is sorted ascending, return the smallest element present in all rows. Return `-1` if no such element exists. **Must run in `O(N log M)`.**

```
Input:  matrix = [[1, 2, 3]]
Output: 1   (only one row; smallest element is 1)

Input:  matrix = [[2, 3, 4], [1, 3, 5], [1, 2, 3]]
Output: 3   (only 3 is in every row; rows have [2,3,4], [1,3,5], [1,2,3])

Input:  matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
Output: -1   (no shared element)
```

## The Solution

Iterate over the elements of the first row (left to right, ascending). For each, binary-search every other row. The first element that's found in all rows is the answer (smallest because the first row is sorted).

<div class="lang-tabs">

```pseudocode
# For each candidate from the first row (in ascending order), binary-search every other row.
function minimumSharedElement(matrix):
    if matrix is empty:
        return −1
    for each target in matrix[0]:
        if every row in matrix[1..end] contains target (via binarySearch):
            return target                       # first row is sorted → first match is the smallest
    return −1
```

```python,editable
from typing import List

class Solution:
    def minimum_shared_element(self, matrix: List[List[int]]) -> int:
        if not matrix: return -1
        for target in matrix[0]:
            if all(self._binary_search(row, target) != -1 for row in matrix[1:]):
                return target
        return -1

    def _binary_search(self, arr, target):
        low, high = 0, len(arr) - 1
        while low <= high:
            mid = low + (high - low) // 2
            if arr[mid] == target: return mid
            if arr[mid] < target: low = mid + 1
            else: high = mid - 1
        return -1


if __name__ == "__main__":
    print(Solution().minimum_shared_element([[2, 3, 4], [1, 3, 5], [1, 2, 3]]))   # 3
```

```java,editable
public class Solution {
    public int minimumSharedElement(int[][] matrix) {
        if (matrix.length == 0) return -1;
        for (int target : matrix[0]) {
            boolean ok = true;
            for (int r = 1; r < matrix.length; r++) {
                if (binarySearch(matrix[r], target) == -1) { ok = false; break; }
            }
            if (ok) return target;
        }
        return -1;
    }
    private int binarySearch(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1; else high = mid - 1;
        }
        return -1;
    }
}
```

```c,editable
#include <stdio.h>

int binary_search(int *arr, int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1; else high = mid - 1;
    }
    return -1;
}

int minimum_shared_element(int rows, int cols, int matrix[rows][cols]) {
    for (int c = 0; c < cols; c++) {
        int target = matrix[0][c];
        int ok = 1;
        for (int r = 1; r < rows; r++) {
            if (binary_search(matrix[r], cols, target) == -1) { ok = 0; break; }
        }
        if (ok) return target;
    }
    return -1;
}
```

```cpp,editable
#include <vector>

class Solution {
public:
    int minimumSharedElement(std::vector<std::vector<int>>& matrix) {
        if (matrix.empty()) return -1;
        for (int target : matrix[0]) {
            bool ok = true;
            for (size_t r = 1; r < matrix.size(); r++) {
                if (binarySearch(matrix[r], target) == -1) { ok = false; break; }
            }
            if (ok) return target;
        }
        return -1;
    }
    int binarySearch(std::vector<int>& arr, int target) {
        int low = 0, high = (int) arr.size() - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1; else high = mid - 1;
        }
        return -1;
    }
};
```

```scala,editable
class Solution {
  def minimumSharedElement(matrix: Array[Array[Int]]): Int = {
    if (matrix.isEmpty) return -1
    for (target <- matrix(0)) {
      if (matrix.tail.forall(row => binarySearch(row, target) != -1)) return target
    }
    -1
  }
  private def binarySearch(arr: Array[Int], target: Int): Int = {
    var low = 0; var high = arr.length - 1
    while (low <= high) {
      val mid = low + (high - low) / 2
      if (arr(mid) == target) return mid
      if (arr(mid) < target) low = mid + 1 else high = mid - 1
    }
    -1
  }
}
```

```typescript,editable
class Solution {
    minimumSharedElement(matrix: number[][]): number {
        if (!matrix.length) return -1;
        for (const target of matrix[0]) {
            if (matrix.slice(1).every(row => this._binarySearch(row, target) !== -1)) return target;
        }
        return -1;
    }
    private _binarySearch(arr: number[], target: number): number {
        let low = 0, high = arr.length - 1;
        while (low <= high) {
            const mid = low + ((high - low) >> 1);
            if (arr[mid] === target) return mid;
            if (arr[mid] < target) low = mid + 1; else high = mid - 1;
        }
        return -1;
    }
}
```

```go,editable
package main

func binarySearch(arr []int, target int) int {
    low, high := 0, len(arr)-1
    for low <= high {
        mid := low + (high-low)/2
        if arr[mid] == target { return mid }
        if arr[mid] < target { low = mid + 1 } else { high = mid - 1 }
    }
    return -1
}

func minimumSharedElement(matrix [][]int) int {
    if len(matrix) == 0 { return -1 }
    for _, target := range matrix[0] {
        ok := true
        for r := 1; r < len(matrix); r++ {
            if binarySearch(matrix[r], target) == -1 { ok = false; break }
        }
        if ok { return target }
    }
    return -1
}
```

```rust,editable
fn binary_search(arr: &[i32], target: i32) -> i32 {
    let mut low: i64 = 0; let mut high: i64 = arr.len() as i64 - 1;
    while low <= high {
        let mid = low + (high - low) / 2;
        if arr[mid as usize] == target { return mid as i32; }
        if arr[mid as usize] < target { low = mid + 1; } else { high = mid - 1; }
    }
    -1
}

fn minimum_shared_element(matrix: &Vec<Vec<i32>>) -> i32 {
    if matrix.is_empty() { return -1; }
    for &target in &matrix[0] {
        let ok = matrix[1..].iter().all(|row| binary_search(row, target) != -1);
        if ok { return target; }
    }
    -1
}
```

</div>

## Complexity

`O(M · N · log M)` where `N = rows`, `M = cols`. The outer loop iterates over the first row (`M` elements); for each, we binary-search the remaining `N - 1` rows in `O(log M)` each.

***

# Intersecting Elements

> **Course:** DSA › Algorithms › Searching › Binary Search Pattern

Same setup as the previous problem; collect *all* shared elements instead of just the smallest.

## The Problem

Given an `N × M` matrix where each row is sorted ascending, return a sorted list of all elements present in every row.

```
Input:  matrix = [[1, 2, 3, 4], [0, 1, 4, 5]]
Output: [1, 4]

Input:  matrix = [[5, 9, 11], [1, 4, 5], [2, 5, 9]]
Output: [5]

Input:  matrix = [[1, 2, 3, 4], [0, 1, 4, 5], [6, 7, 8]]
Output: []
```

## The Solution

Same as the previous problem but accumulate matches into a result list instead of returning the first.

<div class="lang-tabs">

```pseudocode
function intersectingElements(matrix):
    if matrix is empty:
        return empty list
    result ← empty list
    for each target in matrix[0]:
        if every row in matrix[1..end] contains target (via binarySearch):
            append target to result
    return result
```

```python,editable
from typing import List

class Solution:
    def intersecting_elements(self, matrix: List[List[int]]) -> List[int]:
        if not matrix: return []
        result: List[int] = []
        for target in matrix[0]:
            if all(self._binary_search(row, target) != -1 for row in matrix[1:]):
                result.append(target)
        return result

    def _binary_search(self, arr, target):
        low, high = 0, len(arr) - 1
        while low <= high:
            mid = low + (high - low) // 2
            if arr[mid] == target: return mid
            if arr[mid] < target: low = mid + 1
            else: high = mid - 1
        return -1


if __name__ == "__main__":
    print(Solution().intersecting_elements([[1, 2, 3, 4], [0, 1, 4, 5]]))   # [1, 4]
```

```java,editable
import java.util.*;

public class Solution {
    public List<Integer> intersectingElements(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        if (matrix.length == 0) return result;
        for (int target : matrix[0]) {
            boolean ok = true;
            for (int r = 1; r < matrix.length; r++) {
                if (binarySearch(matrix[r], target) == -1) { ok = false; break; }
            }
            if (ok) result.add(target);
        }
        return result;
    }
    private int binarySearch(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1; else high = mid - 1;
        }
        return -1;
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>

int binary_search(int *arr, int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1; else high = mid - 1;
    }
    return -1;
}

int *intersecting_elements(int rows, int cols, int matrix[rows][cols], int *outLen) {
    int *result = (int *) malloc(cols * sizeof(int));
    int n = 0;
    for (int c = 0; c < cols; c++) {
        int target = matrix[0][c];
        int ok = 1;
        for (int r = 1; r < rows; r++) {
            if (binary_search(matrix[r], cols, target) == -1) { ok = 0; break; }
        }
        if (ok) result[n++] = target;
    }
    *outLen = n;
    return result;
}
```

```cpp,editable
#include <vector>

class Solution {
public:
    std::vector<int> intersectingElements(std::vector<std::vector<int>>& matrix) {
        std::vector<int> result;
        if (matrix.empty()) return result;
        for (int target : matrix[0]) {
            bool ok = true;
            for (size_t r = 1; r < matrix.size(); r++) {
                if (binarySearch(matrix[r], target) == -1) { ok = false; break; }
            }
            if (ok) result.push_back(target);
        }
        return result;
    }
    int binarySearch(std::vector<int>& arr, int target) {
        int low = 0, high = (int) arr.size() - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1; else high = mid - 1;
        }
        return -1;
    }
};
```

```scala,editable
class Solution {
  def intersectingElements(matrix: Array[Array[Int]]): List[Int] = {
    if (matrix.isEmpty) return List.empty
    matrix(0).filter(target => matrix.tail.forall(row => binarySearch(row, target) != -1)).toList
  }
  private def binarySearch(arr: Array[Int], target: Int): Int = {
    var low = 0; var high = arr.length - 1
    while (low <= high) {
      val mid = low + (high - low) / 2
      if (arr(mid) == target) return mid
      if (arr(mid) < target) low = mid + 1 else high = mid - 1
    }
    -1
  }
}
```

```typescript,editable
class Solution {
    intersectingElements(matrix: number[][]): number[] {
        if (!matrix.length) return [];
        return matrix[0].filter(target =>
            matrix.slice(1).every(row => this._binarySearch(row, target) !== -1)
        );
    }
    private _binarySearch(arr: number[], target: number): number {
        let low = 0, high = arr.length - 1;
        while (low <= high) {
            const mid = low + ((high - low) >> 1);
            if (arr[mid] === target) return mid;
            if (arr[mid] < target) low = mid + 1; else high = mid - 1;
        }
        return -1;
    }
}
```

```go,editable
package main

func binarySearch(arr []int, target int) int {
    low, high := 0, len(arr)-1
    for low <= high {
        mid := low + (high-low)/2
        if arr[mid] == target { return mid }
        if arr[mid] < target { low = mid + 1 } else { high = mid - 1 }
    }
    return -1
}

func intersectingElements(matrix [][]int) []int {
    result := []int{}
    if len(matrix) == 0 { return result }
    for _, target := range matrix[0] {
        ok := true
        for r := 1; r < len(matrix); r++ {
            if binarySearch(matrix[r], target) == -1 { ok = false; break }
        }
        if ok { result = append(result, target) }
    }
    return result
}
```

```rust,editable
fn binary_search(arr: &[i32], target: i32) -> i32 {
    let mut low: i64 = 0; let mut high: i64 = arr.len() as i64 - 1;
    while low <= high {
        let mid = low + (high - low) / 2;
        if arr[mid as usize] == target { return mid as i32; }
        if arr[mid as usize] < target { low = mid + 1; } else { high = mid - 1; }
    }
    -1
}

fn intersecting_elements(matrix: &Vec<Vec<i32>>) -> Vec<i32> {
    if matrix.is_empty() { return Vec::new(); }
    matrix[0].iter().filter(|&&target| matrix[1..].iter().all(|row| binary_search(row, target) != -1)).copied().collect()
}
```

</div>

## Complexity

Same as the previous problem: `O(M · N · log M)` time, `O(M)` space for the result.

***

## Final Takeaway

The binary search pattern: when the input is sorted (in any monotone direction), `O(log n)` lookup beats linear scan. Recognise it by the sorted structure plus a "find this thing" question. The four problems show four flavours: single-array lookup, descending sort, multi-row matrix membership, and intersection extraction — all using binary search as the inner primitive.

The next lesson lifts the lookup to **lower bound** problems — same pattern, but the question is "where does this go?" rather than "is it there?" That's the right tool for insertion-position queries, "first occurrence of," and many real-world database operations.

**Transfer challenge — try before the Lower Bound Pattern lesson:** Given two sorted arrays `A` and `B`, return their intersection (elements in both). Use binary search to make it `O(min(N, M) · log max(N, M))`. Hint: iterate over the shorter, binary-search in the longer.
