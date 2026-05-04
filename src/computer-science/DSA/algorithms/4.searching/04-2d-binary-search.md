# 4. 2D Binary Search

A spreadsheet of student scores: rows for students (sorted by ID), columns for assignments. The grader wants to find score `X`. Linear scan: `O(rows × cols)`. We just spent three lessons learning that for sorted *1D* arrays, binary search drops the cost to `O(log n)`. Can we apply binary search to a *2D* matrix and get `O(log(rows × cols))`?

Yes — when the matrix has the right structure. **Row-wise sorted** plus **the first element of each row is greater than the last element of the previous row** = the matrix is conceptually a single sorted list, just laid out in a grid. We can binary-search it as if it were 1D, with one tweak: convert each "1D index" to its `(row, col)` pair using divmod arithmetic.

By the end of this lesson you'll know the index-flattening trick, why it produces a single coherent sorted sequence, and `O(log(N·M))` complexity. The next lesson (the Staircase Search lesson, **staircase search**) tackles the looser case where rows are sorted and columns are sorted *but the row-end-row-start property doesn't hold* — which requires a different algorithm.

## Table of contents

1. [Understanding 2D binary search](#understanding-2d-binary-search)
2. [The index-flattening trick](#the-index-flattening-trick)
3. [Implementation](#implementation)
4. [Complexity analysis](#complexity-analysis)
5. [2D binary search problem](#2d-binary-search-problem)

***

# Understanding 2D Binary Search

> **Course:** DSA › Algorithms › Searching › 2D Binary Search

The matrix structure required:

1. **Each row is sorted** in non-decreasing order.
2. **The first element of each row is greater than the last element of the previous row.**

Together, these mean the matrix is one sorted sequence broken into rows. Reading the matrix row-by-row, left-to-right, you get a single sorted list.

```
matrix = [[1,  2,  2,  4],
          [5,  5,  5,  5],
          [9, 10, 11, 12]]

flattened = [1, 2, 2, 4, 5, 5, 5, 5, 9, 10, 11, 12]
```

The flattened version is sorted. Binary search would find any target in `O(log(N·M))`. The 2D version does the same — without actually flattening — by treating the matrix as if it were the flattened array and computing the `(row, col)` for any "flattened index" on demand.

---

## A Walkthrough

`matrix = [[1, 2, 2, 4], [5, 5, 5, 5], [9, 10, 11, 12]]`, `target = 11`. Total cells = 12.

```
low = 0, high = 11

Iter 1: mid = 5, (row, col) = (1, 1). matrix[1][1] = 5. 5 < 11 → low = 6
Iter 2: mid = 8, (row, col) = (2, 0). matrix[2][0] = 9. 9 < 11 → low = 9
Iter 3: mid = 10, (row, col) = (2, 2). matrix[2][2] = 11. 11 == 11 → return true
```

Three iterations on a 12-cell matrix (`log₂(12) ≈ 3.6`). Same logarithmic behaviour as 1D binary search.

---

## Strengths and Limitations

| Strength | Detail |
|---|---|
| **`O(log(N·M))`** | Logarithmic in the *total* cell count. |
| **`O(1)` space** | Only a few index variables. |
| **Reuses 1D binary search** | The algorithm is identical to the Binary Search lesson's; only the index-to-coordinate mapping is added. |

| Limitation | Detail |
|---|---|
| **Strict input requirements** | Both row-sortedness *and* row-end-row-start property are required. |
| **Doesn't apply to "row sorted + col sorted" matrices** | That looser case is handled by staircase search (the Staircase Search lesson). |

---

## Key Takeaway

A matrix that's "globally sorted by row order" can be binary-searched in `O(log(N·M))` by treating it as a flattened sorted array. Now we'll see the index-flattening trick.

***

# The Index-Flattening Trick

> **Course:** DSA › Algorithms › Searching › 2D Binary Search

The core insight: in a row-major matrix of `N` rows and `M` columns, **the cell at `(row, col)` is at flattened-index `row * M + col`**, and conversely, **the flattened-index `i` maps to `(row, col) = (i / M, i % M)`**.

```d2
direction: down

matrix: "matrix[3][4]" {
  grid-rows: 3
  grid-columns: 4
  grid-gap: 0
  c00: "0,0\n[1]"
  c01: "0,1\n[2]"
  c02: "0,2\n[2]"
  c03: "0,3\n[4]"
  c10: "1,0\n[5]"
  c11: "1,1\n[5]"
  c12: "1,2\n[5]"
  c13: "1,3\n[5]"
  c20: "2,0\n[9]"
  c21: "2,1\n[10]"
  c22: "2,2\n[11]"
  c23: "2,3\n[12]"
}

flattened: "Flattened indices 0..11" {
  grid-rows: 1
  grid-columns: 12
  grid-gap: 0
  i0: "0"
  i1: "1"
  i2: "2"
  i3: "3"
  i4: "4"
  i5: "5"
  i6: "6"
  i7: "7"
  i8: "8"
  i9: "9"
  i10: "10"
  i11: "11"
}
```

<p align="center"><strong>Index <code>i</code> maps to <code>(i / 4, i % 4)</code>: index 5 → (1, 1), index 8 → (2, 0), index 11 → (2, 3). The arithmetic uses the column count <code>M = 4</code>.</strong></p>

---

## The Algorithm

Binary-search the *flattened* index range `[0, N·M - 1]`. Each iteration:
1. Compute `mid` as a flattened index.
2. Convert: `row = mid / cols`, `col = mid % cols`.
3. Compare `matrix[row][col]` with target.
4. Adjust `low` or `high` as in 1D binary search.

The whole algorithm differs from 1D binary search only in step 2 — the divmod conversion.

---

## Why the Strict Input Requirement?

For the algorithm to work, the flattened sequence must be sorted. Both conditions are needed:
- **Row sorted**: ensures each row is internally sorted.
- **First-of-next > last-of-prev**: ensures consecutive rows fit together end-to-start.

Without the second condition, the flattened sequence might not be sorted. For example, `[[1, 5], [3, 7]]` has both rows sorted but flattens to `[1, 5, 3, 7]` — not sorted. Binary search would give wrong answers. That looser structure (row-sorted + column-sorted, but no end-to-start guarantee) is what staircase search (the Staircase Search lesson) handles.

---

## Key Takeaway

The flattened-index trick: `mid → (mid / M, mid % M)`. Binary search the index range `[0, N·M - 1]`; convert on each iteration. `O(log(N·M))`. Now the implementation.

***

# Implementation

> **Course:** DSA › Algorithms › Searching › 2D Binary Search

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def binary_search_2d(self, matrix: List[List[int]], target: int) -> bool:
        if not matrix or not matrix[0]:
            return False
        rows, cols = len(matrix), len(matrix[0])
        low, high = 0, rows * cols - 1
        while low <= high:
            mid = low + (high - low) // 2
            r, c = divmod(mid, cols)                    # flattened → 2D
            if matrix[r][c] == target:
                return True
            if matrix[r][c] < target:
                low = mid + 1
            else:
                high = mid - 1
        return False


if __name__ == "__main__":
    matrix = [[1, 2, 2, 4], [5, 5, 5, 5], [9, 10, 11, 12]]
    print(Solution().binary_search_2d(matrix, 11))   # True
    print(Solution().binary_search_2d(matrix, 13))   # False
```

```java,editable
public class Solution {
    public boolean binarySearch2D(int[][] matrix, int target) {
        if (matrix.length == 0 || matrix[0].length == 0) return false;
        int rows = matrix.length, cols = matrix[0].length;
        int low = 0, high = rows * cols - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            int r = mid / cols, c = mid % cols;
            if (matrix[r][c] == target) return true;
            if (matrix[r][c] < target) low = mid + 1;
            else high = mid - 1;
        }
        return false;
    }

    public static void main(String[] args) {
        int[][] matrix = {{1, 2, 2, 4}, {5, 5, 5, 5}, {9, 10, 11, 12}};
        System.out.println(new Solution().binarySearch2D(matrix, 11));
    }
}
```

```c,editable
#include <stdio.h>
#include <stdbool.h>

bool binary_search_2d(int rows, int cols, int matrix[rows][cols], int target) {
    int low = 0, high = rows * cols - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int r = mid / cols, c = mid % cols;
        if (matrix[r][c] == target) return true;
        if (matrix[r][c] < target) low = mid + 1;
        else high = mid - 1;
    }
    return false;
}

int main(void) {
    int matrix[3][4] = {{1, 2, 2, 4}, {5, 5, 5, 5}, {9, 10, 11, 12}};
    printf("%s\n", binary_search_2d(3, 4, matrix, 11) ? "true" : "false");
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

class Solution {
public:
    bool binarySearch2D(const std::vector<std::vector<int>>& matrix, int target) {
        if (matrix.empty() || matrix[0].empty()) return false;
        int rows = (int) matrix.size(), cols = (int) matrix[0].size();
        int low = 0, high = rows * cols - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            int r = mid / cols, c = mid % cols;
            if (matrix[r][c] == target) return true;
            if (matrix[r][c] < target) low = mid + 1;
            else high = mid - 1;
        }
        return false;
    }
};

int main() {
    std::vector<std::vector<int>> m = {{1, 2, 2, 4}, {5, 5, 5, 5}, {9, 10, 11, 12}};
    std::cout << std::boolalpha << Solution{}.binarySearch2D(m, 11) << '\n';
}
```

```scala,editable
class Solution {
  def binarySearch2D(matrix: Array[Array[Int]], target: Int): Boolean = {
    if (matrix.isEmpty || matrix(0).isEmpty) return false
    val rows = matrix.length; val cols = matrix(0).length
    var low = 0; var high = rows * cols - 1
    while (low <= high) {
      val mid = low + (high - low) / 2
      val r = mid / cols; val c = mid % cols
      if (matrix(r)(c) == target) return true
      if (matrix(r)(c) < target) low = mid + 1 else high = mid - 1
    }
    false
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    val m = Array(Array(1, 2, 2, 4), Array(5, 5, 5, 5), Array(9, 10, 11, 12))
    println(new Solution().binarySearch2D(m, 11))
  }
}
```

```javascript,editable
class Solution {
    binarySearch2D(matrix, target) {
        if (!matrix.length || !matrix[0].length) return false;
        const rows = matrix.length, cols = matrix[0].length;
        let low = 0, high = rows * cols - 1;
        while (low <= high) {
            const mid = low + ((high - low) >> 1);
            const r = Math.floor(mid / cols), c = mid % cols;
            if (matrix[r][c] === target) return true;
            if (matrix[r][c] < target) low = mid + 1;
            else high = mid - 1;
        }
        return false;
    }
}

console.log(new Solution().binarySearch2D([[1, 2, 2, 4], [5, 5, 5, 5], [9, 10, 11, 12]], 11));
```

```typescript,editable
class Solution {
    binarySearch2D(matrix: number[][], target: number): boolean {
        if (!matrix.length || !matrix[0].length) return false;
        const rows = matrix.length, cols = matrix[0].length;
        let low = 0, high = rows * cols - 1;
        while (low <= high) {
            const mid = low + ((high - low) >> 1);
            const r = Math.floor(mid / cols), c = mid % cols;
            if (matrix[r][c] === target) return true;
            if (matrix[r][c] < target) low = mid + 1;
            else high = mid - 1;
        }
        return false;
    }
}

console.log(new Solution().binarySearch2D([[1, 2, 2, 4], [5, 5, 5, 5], [9, 10, 11, 12]], 11));
```

```go,editable
package main

import "fmt"

func binarySearch2D(matrix [][]int, target int) bool {
    if len(matrix) == 0 || len(matrix[0]) == 0 {
        return false
    }
    rows, cols := len(matrix), len(matrix[0])
    low, high := 0, rows*cols-1
    for low <= high {
        mid := low + (high-low)/2
        r, c := mid/cols, mid%cols
        if matrix[r][c] == target {
            return true
        }
        if matrix[r][c] < target {
            low = mid + 1
        } else {
            high = mid - 1
        }
    }
    return false
}

func main() {
    m := [][]int{{1, 2, 2, 4}, {5, 5, 5, 5}, {9, 10, 11, 12}}
    fmt.Println(binarySearch2D(m, 11))
}
```

```kotlin,editable
class Solution {
    fun binarySearch2D(matrix: Array<IntArray>, target: Int): Boolean {
        if (matrix.isEmpty() || matrix[0].isEmpty()) return false
        val rows = matrix.size; val cols = matrix[0].size
        var low = 0; var high = rows * cols - 1
        while (low <= high) {
            val mid = low + (high - low) / 2
            val r = mid / cols; val c = mid % cols
            if (matrix[r][c] == target) return true
            if (matrix[r][c] < target) low = mid + 1 else high = mid - 1
        }
        return false
    }
}

fun main() {
    val m = arrayOf(intArrayOf(1, 2, 2, 4), intArrayOf(5, 5, 5, 5), intArrayOf(9, 10, 11, 12))
    println(Solution().binarySearch2D(m, 11))
}
```

```rust,editable
fn binary_search_2d(matrix: &Vec<Vec<i32>>, target: i32) -> bool {
    if matrix.is_empty() || matrix[0].is_empty() { return false; }
    let rows = matrix.len() as i64;
    let cols = matrix[0].len() as i64;
    let mut low: i64 = 0;
    let mut high: i64 = rows * cols - 1;
    while low <= high {
        let mid = low + (high - low) / 2;
        let r = (mid / cols) as usize;
        let c = (mid % cols) as usize;
        if matrix[r][c] == target { return true; }
        if matrix[r][c] < target { low = mid + 1; } else { high = mid - 1; }
    }
    false
}

fn main() {
    let m = vec![vec![1, 2, 2, 4], vec![5, 5, 5, 5], vec![9, 10, 11, 12]];
    println!("{}", binary_search_2d(&m, 11));
}
```

</div>

***

# Complexity Analysis

| Resource | Cost |
|---|---|
| **Time** | `O(log(N·M))` |
| **Space** | `O(1)` |

The algorithm performs at most `log₂(N·M)` iterations, each `O(1)`. Same as 1D binary search on a flattened array of size `N·M`.

---

## Key Takeaway

2D binary search: `O(log(N·M))`, `O(1)` space, requires a "globally sorted" matrix. Now the canonical exercise.

***

# 2D Binary Search Problem

> **Course:** DSA › Algorithms › Searching › 2D Binary Search

---

## The Problem

Given an `N × M` matrix where each row is sorted and each row's first element is greater than the previous row's last element, return `true` if `target` is in the matrix, else `false`. **Must run in `O(log(N·M))`.**

```
Input:  matrix = [[1,2,2,4],[5,5,5,5],[9,10,11,12]], target = 12
Output: true

Input:  matrix = [[1,2,2,4],[5,5,5,5],[9,10,11,12]], target = 5
Output: true

Input:  matrix = [[1,2,2,4],[5,5,5,5],[9,10,11,12]], target = 13
Output: false
```

---

## The Solution

The implementation matches the version above. See [Implementation](#implementation) for all 10 languages.

---

## Edge Cases

| Case | Example | Expected |
|---|---|---|
| Empty matrix | `[]` | `false` |
| Empty row | `[[]]` | `false` |
| Single cell match | `[[5]], target = 5` | `true` |
| Single cell miss | `[[5]], target = 7` | `false` |
| Target in last cell | `target = matrix[N-1][M-1]` | `true` |

---

## Final Takeaway

2D binary search reuses 1D binary search's exact algorithm by treating the matrix as a flattened sorted array. The index-flattening trick (`r = i / M`, `c = i % M`) is the only addition. `O(log(N·M))` total.

The next lesson handles the looser case: matrices where rows and columns are sorted *individually* but the row-end-row-start property doesn't hold. **Staircase search** finds a target in `O(rows + cols)` by walking diagonally — a fundamentally different attack, with a fundamentally different complexity.

**Transfer challenge — try before the Staircase Search lesson:** What if the matrix is row-sorted and column-sorted but the row-end-row-start property *doesn't* hold? Example: `[[1, 4, 7], [2, 5, 8], [3, 6, 9]]` (sorted by columns, sorted by rows, but the flattened sequence `[1, 4, 7, 2, 5, 8, 3, 6, 9]` is not sorted). Can 2D binary search still find `target = 5`? Why or why not?

<details>
<summary><strong>Answer — open after you've thought about it</strong></summary>

No, 2D binary search doesn't work on this kind of matrix. The flattened sequence isn't sorted, so binary search's invariant (`arr[mid] < target ⟹ target is to the right`) breaks.

For example, with `target = 5`:
- `mid = 4`, position `(1, 1)`, value `5`. Found! (lucky)
- For `target = 4`: `mid = 4`, value `5`. `5 > 4` → search left. But `4` is at index 1 in the flattened sequence, which is in the "left half" only because the matrix's column-sortedness happens to align with row-major flattening here. On a different example, this would fail.

The column-sorted-row-sorted-but-not-row-major-sorted matrix needs a different algorithm: **staircase search**, which we'll see in the Staircase Search lesson. It walks from a corner inward in `O(rows + cols)` — slower than 2D binary search's `O(log(N·M))` but applicable to a broader class of matrices.

**You just identified the structural difference between the two 2D search algorithms.**

</details>
