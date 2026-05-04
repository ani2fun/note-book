# 18. The Prefix-Sum Pattern

A friend asks "what's the sum of items 5 through 12 in this array?" — you sum 8 values, no big deal. But what if they ask 100 times? Or 100,000? Or what if the array has a million entries and someone asks "what's the sum of every contiguous slice"? Naively each query is `O(slice length)`, and 1M queries on a 1M-element array crawls toward `O(N²)` — minutes when seconds were the budget. The fix is one of the simplest, most-reused tricks in algorithmics: precompute a **prefix sum** array, where `prefix[i] = arr[0] + arr[1] + ... + arr[i-1]`. After that single linear-time pass, *any* contiguous slice sum is `arr[l..r] = prefix[r+1] - prefix[l]` — O(1) per query.

By the end of this lesson you'll know the **prefix-sum pattern** in 1D and 2D. You'll have written three problems that all rest on the same precompute-then-query trick: **k-limited submatrix sum** (find the largest sum of a fixed-size window), **maximum submatrix sum** (find the largest sum of *any* submatrix), and **range-sum finder** (a class supporting `O(1)` rectangle-sum queries after `O(N²)` setup). The pattern isn't quite DP in the table-fill sense — it's a *precompute* that makes downstream queries instant.

## Table of contents

1. [The Prefix-Sum Pattern](#the-prefix-sum-pattern)
2. [K-Limited Submatrix Sum](#k-limited-submatrix-sum)
3. [Maximum Submatrix Sum](#maximum-submatrix-sum)
4. [Range Sum Finder](#range-sum-finder)
5. [Final Takeaway](#final-takeaway)

***

# The Prefix-Sum Pattern

> **Course:** DSA › Algorithms › Dynamic Programming › Prefix-Sum Pattern

The 1D pattern:

```
prefix[0] = 0
prefix[i] = prefix[i - 1] + arr[i - 1]    for i = 1..n

sum(arr[l..r]) = prefix[r + 1] - prefix[l]    O(1)
```

Construction is `O(n)`. Each query is `O(1)`. After construction, you can answer arbitrarily many sum queries on different `(l, r)` ranges in constant time per query.

The 2D extension is the same idea on a matrix:

```
prefix[i][j] = sum of matrix[0..i-1][0..j-1]
prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1]

sum of rectangle (r1, c1) to (r2, c2) inclusive
  = prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1]
```

The "subtract twice, add back once" formula is **inclusion-exclusion** — when you compute the prefix to the right edge and the prefix to the bottom edge, the top-left corner gets *subtracted twice*, so you add it back.

```d2
direction: right
incex: "Inclusion-exclusion in 2D" {
  grid-rows: 4
  grid-columns: 4
  grid-gap: 0
  c00: "+TL"
  c01: ""
  c02: ""
  c03: "−"
  c10: ""
  c11: ""
  c12: ""
  c13: ""
  c20: ""
  c21: ""
  c22: ""
  c23: ""
  c30: "−"
  c31: ""
  c32: ""
  c33: "+BR"
}
```

<p align="center"><strong>Inclusion-exclusion for a rectangle: <code>+BR − TR − BL + TL</code>. The top-left contributes +1 because subtracting both top-row and left-column subtracts it twice; we add it back once.</strong></p>

> *Pause. Why is the formula NOT just `prefix[r2+1][c2+1] - prefix[r1][c1]`? Predict the failure case.*

Because that subtraction would overshoot. `prefix[r1][c1]` is the sum of cells *above-left* of `(r1, c1)`. Removing it from `prefix[r2+1][c2+1]` doesn't surgically excise the rectangle's "above" and "left" strips — it removes only the corner. We need to remove the whole *strip above* (`prefix[r1][c2+1]`) and the whole *strip left* (`prefix[r2+1][c1]`), then add back the corner that got subtracted twice (`prefix[r1][c1]`).

## Where this shows up

Image processing (integral images for fast convolution / Haar features in face detection), data analytics (group-by sums on time-series, sliding-window aggregates over OHLCV bars), competitive programming (any "sum over a range" query, with extensions to count, max, GCD via more sophisticated structures), and bioinformatics (counting matches in genome windows).

---

## Key Takeaway

Prefix sums precompute "all sums up to here" so every later range-sum query becomes `O(1)`. 1D uses subtraction; 2D uses inclusion-exclusion (subtract twice, add back once).

***

# K-Limited Submatrix Sum

> **Course:** DSA › Algorithms › Dynamic Programming › Prefix-Sum Pattern

## The Problem

Given an `n × m` matrix and an integer `k`, find the maximum sum among all `k × k` submatrices.

```
Input:  matrix = [[1, 2, 9],
                  [5, 3, 8],
                  [4, 6, 7]],
        k = 2
Output: 24                         Submatrix at (1,1)-(2,2): 3 + 8 + 6 + 7 = 24

Input:  matrix = [[1, 2, 3],
                  [4, 5, 6],
                  [7, 8, 9]],
        k = 3
Output: 45                         The whole matrix is the only k × k submatrix
```

## The Approach

Naively: enumerate every `k × k` submatrix (there are `(n-k+1) × (m-k+1)` of them), and sum each in `O(k²)` — total `O(n × m × k²)`. With prefix sums precomputed in `O(n × m)`, each submatrix sum is `O(1)` — total drops to `O(n × m)`.

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def k_limited_submatrix_sum(self, matrix: List[List[int]], k: int) -> int:
        rows, cols = len(matrix), len(matrix[0])
        # prefix[i][j] = sum of matrix[0..i-1][0..j-1].
        prefix: List[List[int]] = [[0] * (cols + 1) for _ in range(rows + 1)]
        for i in range(1, rows + 1):
            for j in range(1, cols + 1):
                prefix[i][j] = (
                    prefix[i - 1][j] + prefix[i][j - 1] - prefix[i - 1][j - 1] + matrix[i - 1][j - 1]
                )
        max_sum = float('-inf')
        for i in range(rows - k + 1):
            for j in range(cols - k + 1):
                # k × k submatrix at (i, j) → bottom-right at (i+k-1, j+k-1).
                # In prefix coords: corners (i, j) and (i+k, j+k).
                s = (
                    prefix[i + k][j + k]
                    - prefix[i][j + k]
                    - prefix[i + k][j]
                    + prefix[i][j]
                )
                if s > max_sum:
                    max_sum = s
        return max_sum


if __name__ == "__main__":
    sol = Solution()
    print(sol.k_limited_submatrix_sum([[1, 2, 9], [5, 3, 8], [4, 6, 7]], 2))   # 24
    print(sol.k_limited_submatrix_sum([[1, 2, 3], [4, 5, 6], [7, 8, 9]], 3))   # 45
```

```java,editable
public class Solution {
    public int kLimitedSubmatrixSum(int[][] matrix, int k) {
        int rows = matrix.length, cols = matrix[0].length;
        int[][] prefix = new int[rows + 1][cols + 1];
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= cols; j++) {
                prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1];
            }
        }
        int maxSum = Integer.MIN_VALUE;
        for (int i = 0; i + k <= rows; i++) {
            for (int j = 0; j + k <= cols; j++) {
                int s = prefix[i+k][j+k] - prefix[i][j+k] - prefix[i+k][j] + prefix[i][j];
                if (s > maxSum) maxSum = s;
            }
        }
        return maxSum;
    }

    public static void main(String[] args) {
        int[][] m = {{1,2,9},{5,3,8},{4,6,7}};
        System.out.println(new Solution().kLimitedSubmatrixSum(m, 2));   // 24
    }
}
```

```c,editable
#include <stdio.h>
#include <limits.h>

int prefix[101][101];

int k_limited_submatrix_sum(int matrix[][101], int rows, int cols, int k) {
    for (int i = 0; i <= rows; i++) for (int j = 0; j <= cols; j++) prefix[i][j] = 0;
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= cols; j++) {
            prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1];
        }
    }
    int max_sum = INT_MIN;
    for (int i = 0; i + k <= rows; i++) {
        for (int j = 0; j + k <= cols; j++) {
            int s = prefix[i+k][j+k] - prefix[i][j+k] - prefix[i+k][j] + prefix[i][j];
            if (s > max_sum) max_sum = s;
        }
    }
    return max_sum;
}

int main(void) {
    int m[3][101] = {{1,2,9},{5,3,8},{4,6,7}};
    printf("%d\n", k_limited_submatrix_sum(m, 3, 3, 2));   /* 24 */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <climits>

class Solution {
public:
    int kLimitedSubmatrixSum(std::vector<std::vector<int>>& matrix, int k) {
        int rows = matrix.size(), cols = matrix[0].size();
        std::vector<std::vector<int>> prefix(rows + 1, std::vector<int>(cols + 1, 0));
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= cols; j++) {
                prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1];
            }
        }
        int maxSum = INT_MIN;
        for (int i = 0; i + k <= rows; i++) {
            for (int j = 0; j + k <= cols; j++) {
                int s = prefix[i+k][j+k] - prefix[i][j+k] - prefix[i+k][j] + prefix[i][j];
                if (s > maxSum) maxSum = s;
            }
        }
        return maxSum;
    }
};

int main() {
    std::vector<std::vector<int>> m = {{1,2,9},{5,3,8},{4,6,7}};
    std::cout << Solution().kLimitedSubmatrixSum(m, 2) << "\n";   // 24
    return 0;
}
```

```scala,editable
class Solution {
  def kLimitedSubmatrixSum(matrix: Array[Array[Int]], k: Int): Int = {
    val rows = matrix.length; val cols = matrix(0).length
    val prefix = Array.fill(rows + 1, cols + 1)(0)
    for (i <- 1 to rows; j <- 1 to cols) {
      prefix(i)(j) = prefix(i-1)(j) + prefix(i)(j-1) - prefix(i-1)(j-1) + matrix(i-1)(j-1)
    }
    var maxSum = Int.MinValue
    for (i <- 0 to rows - k; j <- 0 to cols - k) {
      val s = prefix(i+k)(j+k) - prefix(i)(j+k) - prefix(i+k)(j) + prefix(i)(j)
      if (s > maxSum) maxSum = s
    }
    maxSum
  }
}

object Main extends App {
  println(new Solution().kLimitedSubmatrixSum(Array(Array(1,2,9), Array(5,3,8), Array(4,6,7)), 2))   // 24
}
```

```javascript,editable
class Solution {
    kLimitedSubmatrixSum(matrix, k) {
        const rows = matrix.length, cols = matrix[0].length;
        const prefix = Array.from({length: rows + 1}, () => new Array(cols + 1).fill(0));
        for (let i = 1; i <= rows; i++) {
            for (let j = 1; j <= cols; j++) {
                prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1];
            }
        }
        let maxSum = -Infinity;
        for (let i = 0; i + k <= rows; i++) {
            for (let j = 0; j + k <= cols; j++) {
                const s = prefix[i+k][j+k] - prefix[i][j+k] - prefix[i+k][j] + prefix[i][j];
                if (s > maxSum) maxSum = s;
            }
        }
        return maxSum;
    }
}

console.log(new Solution().kLimitedSubmatrixSum([[1,2,9],[5,3,8],[4,6,7]], 2));   // 24
```

```typescript,editable
class Solution {
    kLimitedSubmatrixSum(matrix: number[][], k: number): number {
        const rows = matrix.length, cols = matrix[0].length;
        const prefix: number[][] = Array.from({length: rows + 1}, () => new Array(cols + 1).fill(0));
        for (let i = 1; i <= rows; i++) {
            for (let j = 1; j <= cols; j++) {
                prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1];
            }
        }
        let maxSum = -Infinity;
        for (let i = 0; i + k <= rows; i++) {
            for (let j = 0; j + k <= cols; j++) {
                const s = prefix[i+k][j+k] - prefix[i][j+k] - prefix[i+k][j] + prefix[i][j];
                if (s > maxSum) maxSum = s;
            }
        }
        return maxSum;
    }
}
```

```go,editable
package main

import (
    "fmt"
    "math"
)

func kLimitedSubmatrixSum(matrix [][]int, k int) int {
    rows, cols := len(matrix), len(matrix[0])
    prefix := make([][]int, rows+1)
    for i := range prefix { prefix[i] = make([]int, cols+1) }
    for i := 1; i <= rows; i++ {
        for j := 1; j <= cols; j++ {
            prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1]
        }
    }
    maxSum := math.MinInt32
    for i := 0; i+k <= rows; i++ {
        for j := 0; j+k <= cols; j++ {
            s := prefix[i+k][j+k] - prefix[i][j+k] - prefix[i+k][j] + prefix[i][j]
            if s > maxSum { maxSum = s }
        }
    }
    return maxSum
}

func main() {
    fmt.Println(kLimitedSubmatrixSum([][]int{{1,2,9},{5,3,8},{4,6,7}}, 2))   // 24
}
```

```kotlin,editable
class Solution {
    fun kLimitedSubmatrixSum(matrix: Array<IntArray>, k: Int): Int {
        val rows = matrix.size; val cols = matrix[0].size
        val prefix = Array(rows + 1) { IntArray(cols + 1) }
        for (i in 1..rows) {
            for (j in 1..cols) {
                prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1]
            }
        }
        var maxSum = Int.MIN_VALUE
        for (i in 0..rows - k) {
            for (j in 0..cols - k) {
                val s = prefix[i+k][j+k] - prefix[i][j+k] - prefix[i+k][j] + prefix[i][j]
                if (s > maxSum) maxSum = s
            }
        }
        return maxSum
    }
}

fun main() {
    println(Solution().kLimitedSubmatrixSum(arrayOf(intArrayOf(1,2,9), intArrayOf(5,3,8), intArrayOf(4,6,7)), 2))   // 24
}
```

```rust,editable
fn k_limited_submatrix_sum(matrix: &Vec<Vec<i32>>, k: i32) -> i32 {
    let rows = matrix.len(); let cols = matrix[0].len(); let k = k as usize;
    let mut prefix = vec![vec![0i32; cols + 1]; rows + 1];
    for i in 1..=rows {
        for j in 1..=cols {
            prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1];
        }
    }
    let mut max_sum = i32::MIN;
    for i in 0..=rows - k {
        for j in 0..=cols - k {
            let s = prefix[i+k][j+k] - prefix[i][j+k] - prefix[i+k][j] + prefix[i][j];
            if s > max_sum { max_sum = s; }
        }
    }
    max_sum
}

fn main() {
    let m = vec![vec![1,2,9], vec![5,3,8], vec![4,6,7]];
    println!("{}", k_limited_submatrix_sum(&m, 2));   // 24
}
```

</div>

## Complexity

| Aspect | Cost |
|---|---|
| Time | `O(n × m)` — `O(n × m)` precompute + `O((n-k+1) × (m-k+1))` queries |
| Space | `O(n × m)` for the prefix table |

***

# Maximum Submatrix Sum

> **Course:** DSA › Algorithms › Dynamic Programming › Prefix-Sum Pattern

## The Problem

Given an `n × n` matrix (with possibly negative values), find the maximum sum among **all** submatrices (any size, any position).

```
Input:  matrix = [[1, 2, 9],
                  [-5, 3, 8],
                  [4, 6, -7]]
Output: 22                         Submatrix excluding the negatives optimally

Input:  matrix = [[1, -2, -3],
                  [-4, -5, -6],
                  [-7, -8, -9]]
Output: 1                          Single cell (0, 0)
```

## The Approach

There are `O(n²)` choices of top-left corner and `O(n²)` choices of bottom-right corner — `O(n⁴)` submatrices total. With prefix sums, each is `O(1)` to evaluate. Total: `O(n⁴)`.

(There's a faster `O(n³)` algorithm using Kadane's-on-collapsed-rows, but this lesson sticks to the straightforward prefix-sum quadruple-loop, which makes the pattern's structure transparent.)

> *Pause. Why is `O(n⁴)` already a major win over the naive baseline?*

Without prefix sums, computing each submatrix's sum requires scanning all its cells — up to `O(n²)` per submatrix, total `O(n⁶)`. Prefix sums kill the inner sum loop, dropping the total by a factor of `n²`.

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def maximum_submatrix_sum(self, matrix: List[List[int]]) -> int:
        n = len(matrix)
        m = len(matrix[0])
        prefix: List[List[int]] = [[0] * (m + 1) for _ in range(n + 1)]
        for i in range(1, n + 1):
            for j in range(1, m + 1):
                prefix[i][j] = (
                    prefix[i - 1][j] + prefix[i][j - 1] - prefix[i - 1][j - 1] + matrix[i - 1][j - 1]
                )
        max_sum = float('-inf')
        # Enumerate every (top-left, bottom-right) corner pair.
        for r1 in range(1, n + 1):
            for c1 in range(1, m + 1):
                for r2 in range(r1, n + 1):
                    for c2 in range(c1, m + 1):
                        s = (
                            prefix[r2][c2] - prefix[r1 - 1][c2]
                            - prefix[r2][c1 - 1] + prefix[r1 - 1][c1 - 1]
                        )
                        if s > max_sum:
                            max_sum = s
        return max_sum


if __name__ == "__main__":
    sol = Solution()
    print(sol.maximum_submatrix_sum([[1, 2, 9], [-5, 3, 8], [4, 6, -7]]))     # 22
    print(sol.maximum_submatrix_sum([[1, -2, -3], [-4, -5, -6], [-7, -8, -9]]))  # 1
```

```java,editable
public class Solution {
    public int maximumSubmatrixSum(int[][] matrix) {
        int n = matrix.length, m = matrix[0].length;
        int[][] prefix = new int[n + 1][m + 1];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1];
            }
        }
        int maxSum = Integer.MIN_VALUE;
        for (int r1 = 1; r1 <= n; r1++)
            for (int c1 = 1; c1 <= m; c1++)
                for (int r2 = r1; r2 <= n; r2++)
                    for (int c2 = c1; c2 <= m; c2++) {
                        int s = prefix[r2][c2] - prefix[r1-1][c2] - prefix[r2][c1-1] + prefix[r1-1][c1-1];
                        if (s > maxSum) maxSum = s;
                    }
        return maxSum;
    }

    public static void main(String[] args) {
        int[][] m = {{1,2,9},{-5,3,8},{4,6,-7}};
        System.out.println(new Solution().maximumSubmatrixSum(m));   // 22
    }
}
```

```c,editable
#include <stdio.h>
#include <limits.h>

int prefix[101][101];

int maximum_submatrix_sum(int matrix[][101], int n, int m) {
    for (int i = 0; i <= n; i++) for (int j = 0; j <= m; j++) prefix[i][j] = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1];
        }
    }
    int max_sum = INT_MIN;
    for (int r1 = 1; r1 <= n; r1++)
        for (int c1 = 1; c1 <= m; c1++)
            for (int r2 = r1; r2 <= n; r2++)
                for (int c2 = c1; c2 <= m; c2++) {
                    int s = prefix[r2][c2] - prefix[r1-1][c2] - prefix[r2][c1-1] + prefix[r1-1][c1-1];
                    if (s > max_sum) max_sum = s;
                }
    return max_sum;
}

int main(void) {
    int m[3][101] = {{1,2,9},{-5,3,8},{4,6,-7}};
    printf("%d\n", maximum_submatrix_sum(m, 3, 3));   /* 22 */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <climits>

class Solution {
public:
    int maximumSubmatrixSum(std::vector<std::vector<int>>& matrix) {
        int n = matrix.size(), m = matrix[0].size();
        std::vector<std::vector<int>> prefix(n + 1, std::vector<int>(m + 1, 0));
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= m; j++)
                prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1];
        int maxSum = INT_MIN;
        for (int r1 = 1; r1 <= n; r1++)
            for (int c1 = 1; c1 <= m; c1++)
                for (int r2 = r1; r2 <= n; r2++)
                    for (int c2 = c1; c2 <= m; c2++) {
                        int s = prefix[r2][c2] - prefix[r1-1][c2] - prefix[r2][c1-1] + prefix[r1-1][c1-1];
                        if (s > maxSum) maxSum = s;
                    }
        return maxSum;
    }
};

int main() {
    std::vector<std::vector<int>> m = {{1,2,9},{-5,3,8},{4,6,-7}};
    std::cout << Solution().maximumSubmatrixSum(m) << "\n";   // 22
    return 0;
}
```

```scala,editable
class Solution {
  def maximumSubmatrixSum(matrix: Array[Array[Int]]): Int = {
    val n = matrix.length; val m = matrix(0).length
    val prefix = Array.fill(n + 1, m + 1)(0)
    for (i <- 1 to n; j <- 1 to m) {
      prefix(i)(j) = prefix(i-1)(j) + prefix(i)(j-1) - prefix(i-1)(j-1) + matrix(i-1)(j-1)
    }
    var maxSum = Int.MinValue
    for (r1 <- 1 to n; c1 <- 1 to m; r2 <- r1 to n; c2 <- c1 to m) {
      val s = prefix(r2)(c2) - prefix(r1-1)(c2) - prefix(r2)(c1-1) + prefix(r1-1)(c1-1)
      if (s > maxSum) maxSum = s
    }
    maxSum
  }
}

object Main extends App {
  println(new Solution().maximumSubmatrixSum(Array(Array(1,2,9), Array(-5,3,8), Array(4,6,-7))))   // 22
}
```

```javascript,editable
class Solution {
    maximumSubmatrixSum(matrix) {
        const n = matrix.length, m = matrix[0].length;
        const prefix = Array.from({length: n + 1}, () => new Array(m + 1).fill(0));
        for (let i = 1; i <= n; i++)
            for (let j = 1; j <= m; j++)
                prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1];
        let maxSum = -Infinity;
        for (let r1 = 1; r1 <= n; r1++)
            for (let c1 = 1; c1 <= m; c1++)
                for (let r2 = r1; r2 <= n; r2++)
                    for (let c2 = c1; c2 <= m; c2++) {
                        const s = prefix[r2][c2] - prefix[r1-1][c2] - prefix[r2][c1-1] + prefix[r1-1][c1-1];
                        if (s > maxSum) maxSum = s;
                    }
        return maxSum;
    }
}

console.log(new Solution().maximumSubmatrixSum([[1,2,9],[-5,3,8],[4,6,-7]]));   // 22
```

```typescript,editable
class Solution {
    maximumSubmatrixSum(matrix: number[][]): number {
        const n = matrix.length, m = matrix[0].length;
        const prefix: number[][] = Array.from({length: n + 1}, () => new Array(m + 1).fill(0));
        for (let i = 1; i <= n; i++)
            for (let j = 1; j <= m; j++)
                prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1];
        let maxSum = -Infinity;
        for (let r1 = 1; r1 <= n; r1++)
            for (let c1 = 1; c1 <= m; c1++)
                for (let r2 = r1; r2 <= n; r2++)
                    for (let c2 = c1; c2 <= m; c2++) {
                        const s = prefix[r2][c2] - prefix[r1-1][c2] - prefix[r2][c1-1] + prefix[r1-1][c1-1];
                        if (s > maxSum) maxSum = s;
                    }
        return maxSum;
    }
}
```

```go,editable
package main

import (
    "fmt"
    "math"
)

func maximumSubmatrixSum(matrix [][]int) int {
    n := len(matrix); m := len(matrix[0])
    prefix := make([][]int, n+1)
    for i := range prefix { prefix[i] = make([]int, m+1) }
    for i := 1; i <= n; i++ {
        for j := 1; j <= m; j++ {
            prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1]
        }
    }
    maxSum := math.MinInt32
    for r1 := 1; r1 <= n; r1++ {
        for c1 := 1; c1 <= m; c1++ {
            for r2 := r1; r2 <= n; r2++ {
                for c2 := c1; c2 <= m; c2++ {
                    s := prefix[r2][c2] - prefix[r1-1][c2] - prefix[r2][c1-1] + prefix[r1-1][c1-1]
                    if s > maxSum { maxSum = s }
                }
            }
        }
    }
    return maxSum
}

func main() {
    fmt.Println(maximumSubmatrixSum([][]int{{1,2,9},{-5,3,8},{4,6,-7}}))   // 22
}
```

```kotlin,editable
class Solution {
    fun maximumSubmatrixSum(matrix: Array<IntArray>): Int {
        val n = matrix.size; val m = matrix[0].size
        val prefix = Array(n + 1) { IntArray(m + 1) }
        for (i in 1..n) for (j in 1..m) {
            prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1]
        }
        var maxSum = Int.MIN_VALUE
        for (r1 in 1..n) for (c1 in 1..m) for (r2 in r1..n) for (c2 in c1..m) {
            val s = prefix[r2][c2] - prefix[r1-1][c2] - prefix[r2][c1-1] + prefix[r1-1][c1-1]
            if (s > maxSum) maxSum = s
        }
        return maxSum
    }
}

fun main() {
    println(Solution().maximumSubmatrixSum(arrayOf(intArrayOf(1,2,9), intArrayOf(-5,3,8), intArrayOf(4,6,-7))))   // 22
}
```

```rust,editable
fn maximum_submatrix_sum(matrix: &Vec<Vec<i32>>) -> i32 {
    let n = matrix.len(); let m = matrix[0].len();
    let mut prefix = vec![vec![0i32; m + 1]; n + 1];
    for i in 1..=n {
        for j in 1..=m {
            prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1];
        }
    }
    let mut max_sum = i32::MIN;
    for r1 in 1..=n {
        for c1 in 1..=m {
            for r2 in r1..=n {
                for c2 in c1..=m {
                    let s = prefix[r2][c2] - prefix[r1-1][c2] - prefix[r2][c1-1] + prefix[r1-1][c1-1];
                    if s > max_sum { max_sum = s; }
                }
            }
        }
    }
    max_sum
}

fn main() {
    let m = vec![vec![1,2,9], vec![-5,3,8], vec![4,6,-7]];
    println!("{}", maximum_submatrix_sum(&m));   // 22
}
```

</div>

## Complexity

| Aspect | Cost |
|---|---|
| Time | `O(n⁴)` for the brute-force enumeration (`O(n³)` possible with Kadane variant) |
| Space | `O(n²)` for prefix table |

***

# Range Sum Finder

> **Course:** DSA › Algorithms › Dynamic Programming › Prefix-Sum Pattern

## The Problem

Build a class `RangeSumFinder` that takes a 2D matrix in its constructor and supports `O(1)` rectangle-sum queries afterward.

```
Operations: [RangeSumFinder, sumRegion, sumRegion, sumRegion]
Matrix:     [[1, 2, 3],
             [4, 5, 6],
             [7, 8, 9]]
Queries:    [[], [1, 1, 1, 1], [0, 0, 2, 2], [1, 1, 2, 2]]

Output:     [null, 5, 45, 28]
```

The interface is the standard `(row1, col1, row2, col2)` rectangle. The contract: each query *must* be `O(1)` after construction.

## The Approach

Build a prefix-sum table once in `O(n × m)`. Each `sumRegion` is then a four-term inclusion-exclusion subtraction — `O(1)`.

> *Pause. Why is this important? Why not just compute each query on the fly?*

Because the query rate dominates the cost. If `k` queries each take `O(n × m)` work, total is `O(k × n × m)`. With prefix sums, `O(n × m + k)` — almost `n × m` cheaper for large `k`. Many real systems answer billions of range queries per day; the constant-time per-query is critical.

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

class RangeSumFinder:
    def __init__(self, matrix: List[List[int]]):
        rows = len(matrix)
        cols = len(matrix[0]) if rows else 0
        # prefix[i][j] = sum of matrix[0..i-1][0..j-1].
        self.prefix: List[List[int]] = [[0] * (cols + 1) for _ in range(rows + 1)]
        for i in range(1, rows + 1):
            for j in range(1, cols + 1):
                self.prefix[i][j] = (
                    self.prefix[i - 1][j] + self.prefix[i][j - 1] - self.prefix[i - 1][j - 1] + matrix[i - 1][j - 1]
                )

    def sumRegion(self, row1: int, col1: int, row2: int, col2: int) -> int:
        # Inclusion-exclusion to extract the rectangle's sum in O(1).
        return (
            self.prefix[row2 + 1][col2 + 1]
            - self.prefix[row1][col2 + 1]
            - self.prefix[row2 + 1][col1]
            + self.prefix[row1][col1]
        )


if __name__ == "__main__":
    rsf = RangeSumFinder([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
    print(rsf.sumRegion(1, 1, 1, 1))   # 5
    print(rsf.sumRegion(0, 0, 2, 2))   # 45
    print(rsf.sumRegion(1, 1, 2, 2))   # 28
```

```java,editable
public class RangeSumFinder {
    private final int[][] prefix;

    public RangeSumFinder(int[][] matrix) {
        int rows = matrix.length;
        int cols = (rows == 0) ? 0 : matrix[0].length;
        prefix = new int[rows + 1][cols + 1];
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= cols; j++) {
                prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1];
            }
        }
    }

    public int sumRegion(int row1, int col1, int row2, int col2) {
        return prefix[row2+1][col2+1] - prefix[row1][col2+1] - prefix[row2+1][col1] + prefix[row1][col1];
    }

    public static void main(String[] args) {
        int[][] m = {{1,2,3},{4,5,6},{7,8,9}};
        RangeSumFinder rsf = new RangeSumFinder(m);
        System.out.println(rsf.sumRegion(1, 1, 1, 1));   // 5
        System.out.println(rsf.sumRegion(0, 0, 2, 2));   // 45
    }
}
```

```c,editable
#include <stdio.h>

int prefix[1001][1001];
int rows_g, cols_g;

void rsf_init(int matrix[][1001], int rows, int cols) {
    rows_g = rows; cols_g = cols;
    for (int i = 0; i <= rows; i++) for (int j = 0; j <= cols; j++) prefix[i][j] = 0;
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= cols; j++) {
            prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1];
        }
    }
}

int rsf_sum_region(int r1, int c1, int r2, int c2) {
    return prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1];
}

int main(void) {
    int m[3][1001] = {{1,2,3},{4,5,6},{7,8,9}};
    rsf_init(m, 3, 3);
    printf("%d\n", rsf_sum_region(1, 1, 1, 1));   /* 5 */
    printf("%d\n", rsf_sum_region(0, 0, 2, 2));   /* 45 */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

class RangeSumFinder {
public:
    std::vector<std::vector<int>> prefix;

    RangeSumFinder(std::vector<std::vector<int>>& matrix) {
        int rows = matrix.size(), cols = matrix.empty() ? 0 : matrix[0].size();
        prefix.assign(rows + 1, std::vector<int>(cols + 1, 0));
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= cols; j++) {
                prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1];
            }
        }
    }

    int sumRegion(int r1, int c1, int r2, int c2) {
        return prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1];
    }
};

int main() {
    std::vector<std::vector<int>> m = {{1,2,3},{4,5,6},{7,8,9}};
    RangeSumFinder rsf(m);
    std::cout << rsf.sumRegion(1, 1, 1, 1) << "\n";  // 5
    std::cout << rsf.sumRegion(0, 0, 2, 2) << "\n";  // 45
    return 0;
}
```

```scala,editable
class RangeSumFinder(matrix: Array[Array[Int]]) {
  private val rows = matrix.length
  private val cols = if (rows == 0) 0 else matrix(0).length
  private val prefix = Array.fill(rows + 1, cols + 1)(0)
  for (i <- 1 to rows; j <- 1 to cols) {
    prefix(i)(j) = prefix(i-1)(j) + prefix(i)(j-1) - prefix(i-1)(j-1) + matrix(i-1)(j-1)
  }

  def sumRegion(r1: Int, c1: Int, r2: Int, c2: Int): Int = {
    prefix(r2+1)(c2+1) - prefix(r1)(c2+1) - prefix(r2+1)(c1) + prefix(r1)(c1)
  }
}

object Main extends App {
  val rsf = new RangeSumFinder(Array(Array(1,2,3), Array(4,5,6), Array(7,8,9)))
  println(rsf.sumRegion(1, 1, 1, 1))   // 5
}
```

```javascript,editable
class RangeSumFinder {
    constructor(matrix) {
        const rows = matrix.length;
        const cols = rows === 0 ? 0 : matrix[0].length;
        this.prefix = Array.from({length: rows + 1}, () => new Array(cols + 1).fill(0));
        for (let i = 1; i <= rows; i++) {
            for (let j = 1; j <= cols; j++) {
                this.prefix[i][j] = this.prefix[i-1][j] + this.prefix[i][j-1] - this.prefix[i-1][j-1] + matrix[i-1][j-1];
            }
        }
    }

    sumRegion(r1, c1, r2, c2) {
        return this.prefix[r2+1][c2+1] - this.prefix[r1][c2+1] - this.prefix[r2+1][c1] + this.prefix[r1][c1];
    }
}

const rsf = new RangeSumFinder([[1,2,3],[4,5,6],[7,8,9]]);
console.log(rsf.sumRegion(1, 1, 1, 1));   // 5
console.log(rsf.sumRegion(0, 0, 2, 2));   // 45
```

```typescript,editable
class RangeSumFinder {
    private prefix: number[][];

    constructor(matrix: number[][]) {
        const rows = matrix.length;
        const cols = rows === 0 ? 0 : matrix[0].length;
        this.prefix = Array.from({length: rows + 1}, () => new Array(cols + 1).fill(0));
        for (let i = 1; i <= rows; i++) {
            for (let j = 1; j <= cols; j++) {
                this.prefix[i][j] = this.prefix[i-1][j] + this.prefix[i][j-1] - this.prefix[i-1][j-1] + matrix[i-1][j-1];
            }
        }
    }

    sumRegion(r1: number, c1: number, r2: number, c2: number): number {
        return this.prefix[r2+1][c2+1] - this.prefix[r1][c2+1] - this.prefix[r2+1][c1] + this.prefix[r1][c1];
    }
}
```

```go,editable
package main

import "fmt"

type RangeSumFinder struct { prefix [][]int }

func NewRangeSumFinder(matrix [][]int) *RangeSumFinder {
    rows := len(matrix)
    cols := 0
    if rows > 0 { cols = len(matrix[0]) }
    prefix := make([][]int, rows+1)
    for i := range prefix { prefix[i] = make([]int, cols+1) }
    for i := 1; i <= rows; i++ {
        for j := 1; j <= cols; j++ {
            prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1]
        }
    }
    return &RangeSumFinder{prefix: prefix}
}

func (r *RangeSumFinder) SumRegion(r1, c1, r2, c2 int) int {
    return r.prefix[r2+1][c2+1] - r.prefix[r1][c2+1] - r.prefix[r2+1][c1] + r.prefix[r1][c1]
}

func main() {
    rsf := NewRangeSumFinder([][]int{{1,2,3},{4,5,6},{7,8,9}})
    fmt.Println(rsf.SumRegion(1, 1, 1, 1))   // 5
    fmt.Println(rsf.SumRegion(0, 0, 2, 2))   // 45
}
```

```kotlin,editable
class RangeSumFinder(matrix: Array<IntArray>) {
    private val prefix: Array<IntArray>
    init {
        val rows = matrix.size
        val cols = if (rows == 0) 0 else matrix[0].size
        prefix = Array(rows + 1) { IntArray(cols + 1) }
        for (i in 1..rows) {
            for (j in 1..cols) {
                prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1]
            }
        }
    }

    fun sumRegion(r1: Int, c1: Int, r2: Int, c2: Int): Int {
        return prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1]
    }
}

fun main() {
    val rsf = RangeSumFinder(arrayOf(intArrayOf(1,2,3), intArrayOf(4,5,6), intArrayOf(7,8,9)))
    println(rsf.sumRegion(1, 1, 1, 1))   // 5
}
```

```rust,editable
struct RangeSumFinder {
    prefix: Vec<Vec<i32>>,
}

impl RangeSumFinder {
    fn new(matrix: Vec<Vec<i32>>) -> Self {
        let rows = matrix.len();
        let cols = if rows == 0 { 0 } else { matrix[0].len() };
        let mut prefix = vec![vec![0i32; cols + 1]; rows + 1];
        for i in 1..=rows {
            for j in 1..=cols {
                prefix[i][j] = prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1] + matrix[i-1][j-1];
            }
        }
        RangeSumFinder { prefix }
    }

    fn sum_region(&self, r1: usize, c1: usize, r2: usize, c2: usize) -> i32 {
        self.prefix[r2+1][c2+1] - self.prefix[r1][c2+1] - self.prefix[r2+1][c1] + self.prefix[r1][c1]
    }
}

fn main() {
    let rsf = RangeSumFinder::new(vec![vec![1,2,3], vec![4,5,6], vec![7,8,9]]);
    println!("{}", rsf.sum_region(1, 1, 1, 1));   // 5
}
```

</div>

## Complexity

| Aspect | Cost |
|---|---|
| Construction | `O(n × m)` |
| Each query | `O(1)` |
| Space | `O(n × m)` |

***

# Final Takeaway

The prefix-sum pattern is the simplest precompute-then-query trick in algorithmics — and one of the most reused. Three problems, three readings of the same table:

| Problem | Read |
|---|---|
| K-limited submatrix sum | One sweep over fixed-size windows |
| Maximum submatrix sum | Quadruple loop over all corner pairs |
| Range sum finder | One inclusion-exclusion per query |

The pattern stretches further with creative state choices: prefix counts (for "how many elements satisfy P in this range"), prefix XORs (for "find subarray with XOR = target"), or prefix mod-counts (for "how many subarrays have sum divisible by k"). Each variant trades the sum operator for another aggregation — so long as the operator is associative *and* invertible (i.e. has an inverse, like subtraction undoes addition), the prefix trick works.

**You didn't just learn three matrix problems. You learned that any operator that supports cheap "extend by one" *and* "subtract" can power a precompute-then-query data structure with `O(1)` queries. That insight unlocks Fenwick trees, segment trees, sparse tables, and a small library of advanced range-query structures you'll meet later — all variations on this same theme.**

> *Transfer challenge for the next lesson:* Now that you've seen 11 distinct DP shapes (linear DP, LIS, LCS, LCSubstr, edit distance, palindromic substring/subsequence, palindrome partitioning, word break, knapsack family, knapsack applications, optimal strategy, boolean parenthesisation, matrix chain, edit-distance pattern, subset-sum pattern, 2D-grid pattern, prefix-sum pattern), the next lesson is a **practice set** — a curated mixed bag of problems across all the patterns. Predict which one shape will appear most often.

<details>
<summary><strong>Answer</strong></summary>

The edit-distance pattern (2D prefix DP) and the knapsack family appear most often — they're the bread-and-butter of interview DP problems. The next lesson presents a practice set covering one problem per pattern, so you can self-test before moving on.

</details>
