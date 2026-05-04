# 17. The 2D-Grid Pattern

When the data lives in a 2D grid — pixels in an image, cells in a board game, characters in a tile map — the DP shape changes. State naturally becomes `(r, c)` over the grid coordinates; transitions move between adjacent cells (up, down, left, right, sometimes diagonal); and the answer is either a single optimum read from one corner or an aggregate over the whole grid. This pattern shows up in image processing, robot pathfinding, terrain analysis, and any "walk a 2D world" problem.

By the end of this lesson you'll have written four canonical 2D-grid DPs: **longest ascending route** (the one with neighbours of higher value), **largest square area of 1s**, **destination path count** (under a cost constraint), and **largest plus of 1s**. Each illustrates a different transition structure — DFS-with-memo, neighbour-min-plus-1, count-aggregator with a budget, and four parallel direction-arrays — covering the breadth of what 2D-grid DP looks like.

## Table of contents

1. [The 2D-Grid Pattern](#the-2d-grid-pattern)
2. [Longest Ascending Route](#longest-ascending-route)
3. [Largest Square Area of 1s](#largest-square-area-of-1s)
4. [Destination Path Count](#destination-path-count)
5. [Largest Plus of 1s](#largest-plus-of-1s)
6. [Final Takeaway](#final-takeaway)

***

# The 2D-Grid Pattern

> **Course:** DSA › Algorithms › Dynamic Programming › 2D-Grid Pattern

The pattern's three flavours:

1. **Origin-to-target** — `dp[r][c]` is the answer for cell `(r, c)`; transitions read from cells "earlier in the traversal." Examples: minimum-sum path, count of paths.
2. **Local optimum at every cell** — `dp[r][c]` measures something *ending at* or *centered at* `(r, c)`. Take the max across all cells. Examples: largest square of 1s, largest plus of 1s.
3. **DFS with memoization** — when transitions can move in *any* direction (not just down/right), iteration order is hard; recursion + memo is cleaner. Example: longest ascending route.

```d2
direction: right
flow: "Three flavours of 2D-grid DP" {
  grid-rows: 1
  grid-columns: 3
  grid-gap: 20
  f1: |md
    **Origin → target**
    Two nested loops
    Read up/left
    Answer at target cell
  |
  f2: |md
    **Local optimum**
    Two nested loops
    Track running max
    Answer is max-over-grid
  |
  f3: |md
    **Free-direction DFS**
    Recursion + cache
    Read in 4 directions
    Answer is max-over-grid
  |
}
```

<p align="center"><strong>Same 2D state, three traversal shapes. Pick the one that matches the transition rule of your problem.</strong></p>

> *Predict before reading on — for "minimum-sum path from top-left to bottom-right with right/down moves only", which flavour applies?*

Origin-to-target. `dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])`. Two nested loops left-to-right, top-to-bottom. Answer is `dp[rows-1][cols-1]`.

---

## Key Takeaway

2D-grid DP states are `(r, c)`. Transition direction selects the traversal: directional → loops; free-direction → DFS+memo; "every cell as candidate" → loops + running max.

***

# Longest Ascending Route

> **Course:** DSA › Algorithms › Dynamic Programming › 2D-Grid Pattern

## The Problem

Given an `n × m` grid of integers, find the length of the longest path along which strictly-increasing values appear. Moves are 4-connected (up/down/left/right). Diagonals don't count.

```
Input:  matrix = [[1, 2, 9],
                  [5, 3, 8],
                  [4, 6, 7]]
Output: 7                 Path: 1 → 2 → 3 → 6 → 7 → 8 → 9 (snakes through the grid)

Input:  matrix = [[1, 2, 3],
                  [4, 5, 6],
                  [7, 8, 9]]
Output: 5                 Multiple longest paths; e.g. 1 → 2 → 3 → 6 → 9
```

## The Recurrence — DFS with Memoization

`dp[r][c]` = length of the longest strictly-ascending path *starting* at `(r, c)`. For each of the 4 neighbours `(r', c')` with `matrix[r'][c'] > matrix[r][c]`, recurse and take 1 plus that:
```
dp[r][c] = 1 + max over up-neighbour ascending of dp[r'][c']
```
If no neighbour is strictly greater, `dp[r][c] = 1` (just the cell itself).

The natural fill order is *anti-topological* — from peaks downward — but the simplest implementation is a DFS with memoization. The memo prevents re-exploring the same `(r, c)` once its value is settled.

> *Pause. Why does the strict-increase rule guarantee no cycles? Predict the consequence.*

Because every edge points to a strictly greater value, no path can revisit a cell — that would require returning to a smaller value somewhere, contradicting monotonicity. The recursion DAG is acyclic, so DFS terminates after each cell is visited at most once.

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def longest_ascending_route(self, matrix: List[List[int]]) -> int:
        if not matrix or not matrix[0]:
            return 0
        rows, cols = len(matrix), len(matrix[0])
        # dp[r][c] = longest ascending path starting at (r, c).
        dp: List[List[int]] = [[-1] * cols for _ in range(rows)]
        directions = ((-1, 0), (1, 0), (0, -1), (0, 1))

        def dfs(r: int, c: int) -> int:
            if dp[r][c] != -1:
                return dp[r][c]
            best = 1                                 # The cell itself counts as length 1
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] > matrix[r][c]:
                    best = max(best, 1 + dfs(nr, nc))
            dp[r][c] = best
            return best

        return max(dfs(r, c) for r in range(rows) for c in range(cols))


if __name__ == "__main__":
    sol = Solution()
    print(sol.longest_ascending_route([[1, 2, 9], [5, 3, 8], [4, 6, 7]]))   # 7
    print(sol.longest_ascending_route([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))   # 5
```

```java,editable
public class Solution {
    private int[][] dp;
    private int[][] mat;
    private int rows, cols;
    private final int[][] DIR = {{-1,0},{1,0},{0,-1},{0,1}};

    private int dfs(int r, int c) {
        if (dp[r][c] != -1) return dp[r][c];
        int best = 1;
        for (int[] d : DIR) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && mat[nr][nc] > mat[r][c]) {
                best = Math.max(best, 1 + dfs(nr, nc));
            }
        }
        dp[r][c] = best;
        return best;
    }

    public int longestAscendingRoute(int[][] matrix) {
        if (matrix.length == 0 || matrix[0].length == 0) return 0;
        rows = matrix.length; cols = matrix[0].length; mat = matrix;
        dp = new int[rows][cols];
        for (int[] row : dp) java.util.Arrays.fill(row, -1);
        int ans = 0;
        for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) ans = Math.max(ans, dfs(r, c));
        return ans;
    }

    public static void main(String[] args) {
        System.out.println(new Solution().longestAscendingRoute(new int[][]{{1,2,9},{5,3,8},{4,6,7}}));   // 7
    }
}
```

```c,editable
#include <stdio.h>

int dp[101][101];
int rows_g, cols_g;
int (*mat_g)[101];
int dx_g[] = {-1, 1, 0, 0};
int dy_g[] = {0, 0, -1, 1};

int dfs(int r, int c) {
    if (dp[r][c] != -1) return dp[r][c];
    int best = 1;
    for (int i = 0; i < 4; i++) {
        int nr = r + dx_g[i], nc = c + dy_g[i];
        if (nr >= 0 && nr < rows_g && nc >= 0 && nc < cols_g && mat_g[nr][nc] > mat_g[r][c]) {
            int cand = 1 + dfs(nr, nc);
            if (cand > best) best = cand;
        }
    }
    dp[r][c] = best;
    return best;
}

int longest_ascending_route(int matrix[][101], int rows, int cols) {
    if (rows == 0 || cols == 0) return 0;
    rows_g = rows; cols_g = cols; mat_g = matrix;
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) dp[r][c] = -1;
    int ans = 0;
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
        int v = dfs(r, c);
        if (v > ans) ans = v;
    }
    return ans;
}

int main(void) {
    int m[101][101] = {{1,2,9},{5,3,8},{4,6,7}};
    printf("%d\n", longest_ascending_route(m, 3, 3));   /* 7 */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <algorithm>

class Solution {
    std::vector<std::vector<int>> dp;
    std::vector<std::vector<int>> mat;
    int rows, cols;
    const int DR[4] = {-1, 1, 0, 0};
    const int DC[4] = {0, 0, -1, 1};

    int dfs(int r, int c) {
        if (dp[r][c] != -1) return dp[r][c];
        int best = 1;
        for (int i = 0; i < 4; i++) {
            int nr = r + DR[i], nc = c + DC[i];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && mat[nr][nc] > mat[r][c]) {
                best = std::max(best, 1 + dfs(nr, nc));
            }
        }
        return dp[r][c] = best;
    }
public:
    int longestAscendingRoute(std::vector<std::vector<int>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) return 0;
        rows = matrix.size(); cols = matrix[0].size(); mat = matrix;
        dp.assign(rows, std::vector<int>(cols, -1));
        int ans = 0;
        for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) ans = std::max(ans, dfs(r, c));
        return ans;
    }
};

int main() {
    std::vector<std::vector<int>> m = {{1,2,9},{5,3,8},{4,6,7}};
    std::cout << Solution().longestAscendingRoute(m) << "\n";   // 7
    return 0;
}
```

```scala,editable
class Solution {
  private var dp: Array[Array[Int]] = _
  private var mat: Array[Array[Int]] = _
  private var rows = 0; private var cols = 0
  private val DR = Array(-1, 1, 0, 0); private val DC = Array(0, 0, -1, 1)

  private def dfs(r: Int, c: Int): Int = {
    if (dp(r)(c) != -1) return dp(r)(c)
    var best = 1
    for (i <- 0 until 4) {
      val nr = r + DR(i); val nc = c + DC(i)
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && mat(nr)(nc) > mat(r)(c)) {
        best = math.max(best, 1 + dfs(nr, nc))
      }
    }
    dp(r)(c) = best; best
  }

  def longestAscendingRoute(matrix: Array[Array[Int]]): Int = {
    if (matrix.isEmpty || matrix(0).isEmpty) return 0
    rows = matrix.length; cols = matrix(0).length; mat = matrix
    dp = Array.fill(rows, cols)(-1)
    var ans = 0
    for (r <- 0 until rows; c <- 0 until cols) ans = math.max(ans, dfs(r, c))
    ans
  }
}

object Main extends App {
  println(new Solution().longestAscendingRoute(Array(Array(1,2,9), Array(5,3,8), Array(4,6,7))))   // 7
}
```

```javascript,editable
class Solution {
    longestAscendingRoute(matrix) {
        if (!matrix.length || !matrix[0].length) return 0;
        const rows = matrix.length, cols = matrix[0].length;
        const dp = Array.from({length: rows}, () => new Array(cols).fill(-1));
        const DR = [-1, 1, 0, 0], DC = [0, 0, -1, 1];
        const dfs = (r, c) => {
            if (dp[r][c] !== -1) return dp[r][c];
            let best = 1;
            for (let i = 0; i < 4; i++) {
                const nr = r + DR[i], nc = c + DC[i];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr][nc] > matrix[r][c]) {
                    best = Math.max(best, 1 + dfs(nr, nc));
                }
            }
            return dp[r][c] = best;
        };
        let ans = 0;
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) ans = Math.max(ans, dfs(r, c));
        return ans;
    }
}

console.log(new Solution().longestAscendingRoute([[1,2,9],[5,3,8],[4,6,7]]));   // 7
```

```typescript,editable
class Solution {
    longestAscendingRoute(matrix: number[][]): number {
        if (!matrix.length || !matrix[0].length) return 0;
        const rows = matrix.length, cols = matrix[0].length;
        const dp: number[][] = Array.from({length: rows}, () => new Array(cols).fill(-1));
        const DR = [-1, 1, 0, 0], DC = [0, 0, -1, 1];
        const dfs = (r: number, c: number): number => {
            if (dp[r][c] !== -1) return dp[r][c];
            let best = 1;
            for (let i = 0; i < 4; i++) {
                const nr = r + DR[i], nc = c + DC[i];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr][nc] > matrix[r][c]) {
                    best = Math.max(best, 1 + dfs(nr, nc));
                }
            }
            return dp[r][c] = best;
        };
        let ans = 0;
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) ans = Math.max(ans, dfs(r, c));
        return ans;
    }
}
```

```go,editable
package main

import "fmt"

func longestAscendingRoute(matrix [][]int) int {
    if len(matrix) == 0 || len(matrix[0]) == 0 { return 0 }
    rows, cols := len(matrix), len(matrix[0])
    dp := make([][]int, rows)
    for i := range dp { dp[i] = make([]int, cols); for j := range dp[i] { dp[i][j] = -1 } }
    dr := []int{-1, 1, 0, 0}; dc := []int{0, 0, -1, 1}
    var dfs func(r, c int) int
    dfs = func(r, c int) int {
        if dp[r][c] != -1 { return dp[r][c] }
        best := 1
        for i := 0; i < 4; i++ {
            nr, nc := r+dr[i], c+dc[i]
            if nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr][nc] > matrix[r][c] {
                cand := 1 + dfs(nr, nc)
                if cand > best { best = cand }
            }
        }
        dp[r][c] = best
        return best
    }
    ans := 0
    for r := 0; r < rows; r++ { for c := 0; c < cols; c++ {
        if v := dfs(r, c); v > ans { ans = v }
    } }
    return ans
}

func main() {
    fmt.Println(longestAscendingRoute([][]int{{1,2,9},{5,3,8},{4,6,7}}))   // 7
}
```

```kotlin,editable
class Solution {
    fun longestAscendingRoute(matrix: Array<IntArray>): Int {
        if (matrix.isEmpty() || matrix[0].isEmpty()) return 0
        val rows = matrix.size; val cols = matrix[0].size
        val dp = Array(rows) { IntArray(cols) { -1 } }
        val DR = intArrayOf(-1, 1, 0, 0); val DC = intArrayOf(0, 0, -1, 1)
        fun dfs(r: Int, c: Int): Int {
            if (dp[r][c] != -1) return dp[r][c]
            var best = 1
            for (i in 0..3) {
                val nr = r + DR[i]; val nc = c + DC[i]
                if (nr in 0 until rows && nc in 0 until cols && matrix[nr][nc] > matrix[r][c]) {
                    best = maxOf(best, 1 + dfs(nr, nc))
                }
            }
            dp[r][c] = best
            return best
        }
        var ans = 0
        for (r in 0 until rows) for (c in 0 until cols) ans = maxOf(ans, dfs(r, c))
        return ans
    }
}

fun main() {
    println(Solution().longestAscendingRoute(arrayOf(intArrayOf(1,2,9), intArrayOf(5,3,8), intArrayOf(4,6,7))))   // 7
}
```

```rust,editable
fn longest_ascending_route(matrix: &Vec<Vec<i32>>) -> i32 {
    if matrix.is_empty() || matrix[0].is_empty() { return 0; }
    let rows = matrix.len(); let cols = matrix[0].len();
    let mut dp = vec![vec![-1i32; cols]; rows];
    fn dfs(r: usize, c: usize, m: &Vec<Vec<i32>>, dp: &mut Vec<Vec<i32>>, rows: usize, cols: usize) -> i32 {
        if dp[r][c] != -1 { return dp[r][c]; }
        let mut best = 1;
        let dr: [i32; 4] = [-1, 1, 0, 0]; let dc: [i32; 4] = [0, 0, -1, 1];
        for i in 0..4 {
            let nr = r as i32 + dr[i]; let nc = c as i32 + dc[i];
            if nr >= 0 && (nr as usize) < rows && nc >= 0 && (nc as usize) < cols
                && m[nr as usize][nc as usize] > m[r][c] {
                best = best.max(1 + dfs(nr as usize, nc as usize, m, dp, rows, cols));
            }
        }
        dp[r][c] = best;
        best
    }
    let mut ans = 0;
    for r in 0..rows { for c in 0..cols { ans = ans.max(dfs(r, c, matrix, &mut dp, rows, cols)); } }
    ans
}

fn main() {
    let m = vec![vec![1,2,9], vec![5,3,8], vec![4,6,7]];
    println!("{}", longest_ascending_route(&m));   // 7
}
```

</div>

## Complexity

| Aspect | Cost |
|---|---|
| Time | `O(rows × cols)` — each cell's DFS is O(1) thanks to memoization |
| Space | `O(rows × cols)` for the memo table + recursion stack |

***

# Largest Square Area of 1s

> **Course:** DSA › Algorithms › Dynamic Programming › 2D-Grid Pattern

## The Problem

Given a binary matrix of 0s and 1s, find the area of the largest *axis-aligned square* of 1s.

```
Input:  grid = [[1, 1, 0, 0],
                [0, 0, 1, 1],
                [1, 0, 1, 1],
                [1, 0, 0, 0]]
Output: 4                       2 × 2 square at rows 1-2, cols 2-3

Input:  grid = [[1, 1, 0, 0],
                [0, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 0, 0, 0]]
Output: 4                       Multiple 2 × 2 squares
```

## The Recurrence — Three-Neighbour Min Plus One

`dp[r][c]` = side length of the largest square *whose bottom-right corner is* `(r, c)`. If `grid[r][c] = 0`, it can't be a corner: `dp[r][c] = 0`. If `grid[r][c] = 1`:
```
dp[r][c] = 1 + min(dp[r-1][c-1], dp[r-1][c], dp[r][c-1])
```

Why three neighbours? A `k × k` square at `(r, c)` requires:
- A `(k-1) × (k-1)` square at `(r-1, c-1)` (the top-left chunk).
- A `(k-1) × (k-1)` square at `(r-1, c)` (covering the top edge).
- A `(k-1) × (k-1)` square at `(r, c-1)` (covering the left edge).

The smallest of these three caps the size of the square that can grow from `(r, c)`. Plus one for the cell itself.

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#777777"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart LR
  CELL["(r, c)"]
  CELL --> NW["dp[r-1][c-1]<br/>top-left chunk"]
  CELL --> N["dp[r-1][c]<br/>top edge"]
  CELL --> W["dp[r][c-1]<br/>left edge"]
  NW --> COMB["1 + min(...)"]
  N --> COMB
  W --> COMB
```

<p align="center"><strong>The square ending at <code>(r, c)</code> can only be as large as the smallest of three predecessor squares — the top-left, top, and left neighbours. Plus one for the current cell.</strong></p>

> *Pause. Why is min the right aggregator here? Predict the consequence of using max.*

Min ensures the square is *fully* filled with 1s. If any of the three neighbours has a smaller largest-square, that's the binding constraint — extending beyond would require 1s in cells that aren't 1. Using max would let one good corner override missing cells elsewhere — wrong.

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def largest_square_area(self, matrix: List[List[int]]) -> int:
        if not matrix or not matrix[0]:
            return 0
        rows, cols = len(matrix), len(matrix[0])
        dp: List[List[int]] = [[0] * cols for _ in range(rows)]
        max_side = 0
        for r in range(rows):
            for c in range(cols):
                if matrix[r][c] == 1:
                    if r == 0 or c == 0:
                        dp[r][c] = 1                        # Edge cells: max square is 1 × 1
                    else:
                        dp[r][c] = 1 + min(dp[r - 1][c - 1], dp[r - 1][c], dp[r][c - 1])
                    if dp[r][c] > max_side:
                        max_side = dp[r][c]
        return max_side * max_side


if __name__ == "__main__":
    sol = Solution()
    print(sol.largest_square_area([[1, 1, 0, 0], [0, 0, 1, 1], [1, 0, 1, 1], [1, 0, 0, 0]]))   # 4
```

```java,editable
public class Solution {
    public int largestSquareArea(int[][] matrix) {
        if (matrix.length == 0 || matrix[0].length == 0) return 0;
        int rows = matrix.length, cols = matrix[0].length;
        int[][] dp = new int[rows][cols];
        int maxSide = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (matrix[r][c] == 1) {
                    dp[r][c] = (r == 0 || c == 0) ? 1
                             : 1 + Math.min(dp[r-1][c-1], Math.min(dp[r-1][c], dp[r][c-1]));
                    if (dp[r][c] > maxSide) maxSide = dp[r][c];
                }
            }
        }
        return maxSide * maxSide;
    }

    public static void main(String[] args) {
        int[][] g = {{1,1,0,0},{0,0,1,1},{1,0,1,1},{1,0,0,0}};
        System.out.println(new Solution().largestSquareArea(g));   // 4
    }
}
```

```c,editable
#include <stdio.h>

int dp[1001][1001];

int largest_square_area(int matrix[][1001], int rows, int cols) {
    if (rows == 0 || cols == 0) return 0;
    int max_side = 0;
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) dp[r][c] = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (matrix[r][c] == 1) {
                if (r == 0 || c == 0) dp[r][c] = 1;
                else {
                    int m = dp[r-1][c-1];
                    if (dp[r-1][c] < m) m = dp[r-1][c];
                    if (dp[r][c-1] < m) m = dp[r][c-1];
                    dp[r][c] = 1 + m;
                }
                if (dp[r][c] > max_side) max_side = dp[r][c];
            }
        }
    }
    return max_side * max_side;
}

int main(void) {
    int g[4][1001] = {{1,1,0,0},{0,0,1,1},{1,0,1,1},{1,0,0,0}};
    printf("%d\n", largest_square_area(g, 4, 4));   /* 4 */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <algorithm>

class Solution {
public:
    int largestSquareArea(std::vector<std::vector<int>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) return 0;
        int rows = matrix.size(), cols = matrix[0].size();
        std::vector<std::vector<int>> dp(rows, std::vector<int>(cols, 0));
        int maxSide = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (matrix[r][c] == 1) {
                    dp[r][c] = (r == 0 || c == 0) ? 1
                             : 1 + std::min({dp[r-1][c-1], dp[r-1][c], dp[r][c-1]});
                    if (dp[r][c] > maxSide) maxSide = dp[r][c];
                }
            }
        }
        return maxSide * maxSide;
    }
};

int main() {
    std::vector<std::vector<int>> g = {{1,1,0,0},{0,0,1,1},{1,0,1,1},{1,0,0,0}};
    std::cout << Solution().largestSquareArea(g) << "\n";   // 4
    return 0;
}
```

```scala,editable
class Solution {
  def largestSquareArea(matrix: Array[Array[Int]]): Int = {
    if (matrix.isEmpty || matrix(0).isEmpty) return 0
    val rows = matrix.length; val cols = matrix(0).length
    val dp = Array.fill(rows, cols)(0)
    var maxSide = 0
    for (r <- 0 until rows; c <- 0 until cols) {
      if (matrix(r)(c) == 1) {
        dp(r)(c) = if (r == 0 || c == 0) 1
                   else 1 + math.min(dp(r-1)(c-1), math.min(dp(r-1)(c), dp(r)(c-1)))
        if (dp(r)(c) > maxSide) maxSide = dp(r)(c)
      }
    }
    maxSide * maxSide
  }
}

object Main extends App {
  println(new Solution().largestSquareArea(Array(Array(1,1,0,0), Array(0,0,1,1), Array(1,0,1,1), Array(1,0,0,0))))   // 4
}
```

```javascript,editable
class Solution {
    largestSquareArea(matrix) {
        if (!matrix.length || !matrix[0].length) return 0;
        const rows = matrix.length, cols = matrix[0].length;
        const dp = Array.from({length: rows}, () => new Array(cols).fill(0));
        let maxSide = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (matrix[r][c] === 1) {
                    dp[r][c] = (r === 0 || c === 0) ? 1
                             : 1 + Math.min(dp[r-1][c-1], dp[r-1][c], dp[r][c-1]);
                    if (dp[r][c] > maxSide) maxSide = dp[r][c];
                }
            }
        }
        return maxSide * maxSide;
    }
}

console.log(new Solution().largestSquareArea([[1,1,0,0],[0,0,1,1],[1,0,1,1],[1,0,0,0]]));   // 4
```

```typescript,editable
class Solution {
    largestSquareArea(matrix: number[][]): number {
        if (!matrix.length || !matrix[0].length) return 0;
        const rows = matrix.length, cols = matrix[0].length;
        const dp: number[][] = Array.from({length: rows}, () => new Array(cols).fill(0));
        let maxSide = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (matrix[r][c] === 1) {
                    dp[r][c] = (r === 0 || c === 0) ? 1
                             : 1 + Math.min(dp[r-1][c-1], dp[r-1][c], dp[r][c-1]);
                    if (dp[r][c] > maxSide) maxSide = dp[r][c];
                }
            }
        }
        return maxSide * maxSide;
    }
}
```

```go,editable
package main

import "fmt"

func min3(a, b, c int) int {
    m := a
    if b < m { m = b }
    if c < m { m = c }
    return m
}

func largestSquareArea(matrix [][]int) int {
    if len(matrix) == 0 || len(matrix[0]) == 0 { return 0 }
    rows, cols := len(matrix), len(matrix[0])
    dp := make([][]int, rows)
    for i := range dp { dp[i] = make([]int, cols) }
    maxSide := 0
    for r := 0; r < rows; r++ {
        for c := 0; c < cols; c++ {
            if matrix[r][c] == 1 {
                if r == 0 || c == 0 { dp[r][c] = 1 } else { dp[r][c] = 1 + min3(dp[r-1][c-1], dp[r-1][c], dp[r][c-1]) }
                if dp[r][c] > maxSide { maxSide = dp[r][c] }
            }
        }
    }
    return maxSide * maxSide
}

func main() {
    fmt.Println(largestSquareArea([][]int{{1,1,0,0},{0,0,1,1},{1,0,1,1},{1,0,0,0}}))   // 4
}
```

```kotlin,editable
class Solution {
    fun largestSquareArea(matrix: Array<IntArray>): Int {
        if (matrix.isEmpty() || matrix[0].isEmpty()) return 0
        val rows = matrix.size; val cols = matrix[0].size
        val dp = Array(rows) { IntArray(cols) }
        var maxSide = 0
        for (r in 0 until rows) {
            for (c in 0 until cols) {
                if (matrix[r][c] == 1) {
                    dp[r][c] = if (r == 0 || c == 0) 1
                               else 1 + minOf(dp[r-1][c-1], dp[r-1][c], dp[r][c-1])
                    if (dp[r][c] > maxSide) maxSide = dp[r][c]
                }
            }
        }
        return maxSide * maxSide
    }
}

fun main() {
    println(Solution().largestSquareArea(arrayOf(intArrayOf(1,1,0,0), intArrayOf(0,0,1,1), intArrayOf(1,0,1,1), intArrayOf(1,0,0,0))))   // 4
}
```

```rust,editable
fn largest_square_area(matrix: &Vec<Vec<i32>>) -> i32 {
    if matrix.is_empty() || matrix[0].is_empty() { return 0; }
    let rows = matrix.len(); let cols = matrix[0].len();
    let mut dp = vec![vec![0i32; cols]; rows];
    let mut max_side = 0;
    for r in 0..rows {
        for c in 0..cols {
            if matrix[r][c] == 1 {
                dp[r][c] = if r == 0 || c == 0 { 1 }
                           else { 1 + dp[r-1][c-1].min(dp[r-1][c]).min(dp[r][c-1]) };
                if dp[r][c] > max_side { max_side = dp[r][c]; }
            }
        }
    }
    max_side * max_side
}

fn main() {
    let g = vec![vec![1,1,0,0], vec![0,0,1,1], vec![1,0,1,1], vec![1,0,0,0]];
    println!("{}", largest_square_area(&g));   // 4
}
```

</div>

## Complexity

| Aspect | Cost |
|---|---|
| Time | `O(rows × cols)` |
| Space | `O(rows × cols)` (reducible to `O(cols)` with rolling rows) |

***

# Destination Path Count

> **Course:** DSA › Algorithms › Dynamic Programming › 2D-Grid Pattern

## The Problem

Given an `n × m` matrix of non-negative cell costs and a target cost, count the number of paths from `(0, 0)` to `(n-1, m-1)` whose summed costs equal the target. Moves are right or down only.

```
Input:  matrix = [[1, 2, 9],
                  [5, 3, 8],
                  [4, 6, 7]],
        cost = 19
Output: 1                          One path summing to 19

Input:  matrix = [[1, 2, 3],
                  [1, 5, 6],
                  [2, 8, 9]],
        cost = 21
Output: 2                          Two paths sum to 21
```

## The Recurrence — 3D State

Add a third dimension to the standard "count paths to `(r, c)`" DP: the remaining budget. `dp[r][c][k]` = number of paths from `(0, 0)` to `(r, c)` whose costs sum to exactly `k`.

```
dp[r][c][k] = dp[r-1][c][k - matrix[r][c]] + dp[r][c-1][k - matrix[r][c]]
              (with appropriate guards for r=0, c=0, k < matrix[r][c])
```

Base case: `dp[0][0][matrix[0][0]] = 1` (the only path of length 1 hits `matrix[0][0]`).

For implementation, recursion + memoization is cleaner than building a giant 3D array. We memoize on the tuple `(r, c, k)`.

> *Pause. Why is the state 3D, not 2D? Predict the answer.*

Because the answer at `(r, c)` depends on the *budget* still available — two different remaining budgets give two different answers, and the budget changes as we walk. 2D `(r, c)` doesn't have enough information.

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List, Dict, Tuple
from functools import lru_cache

class Solution:
    def destination_path_count(self, matrix: List[List[int]], cost: int) -> int:
        if not matrix or not matrix[0]:
            return 0
        rows, cols = len(matrix), len(matrix[0])

        @lru_cache(maxsize=None)
        def helper(r: int, c: int, remaining: int) -> int:
            if remaining < 0:
                return 0                                     # Overshot the budget
            if r == 0 and c == 0:
                return 1 if matrix[0][0] == remaining else 0
            from_top = helper(r - 1, c, remaining - matrix[r][c]) if r > 0 else 0
            from_left = helper(r, c - 1, remaining - matrix[r][c]) if c > 0 else 0
            return from_top + from_left

        return helper(rows - 1, cols - 1, cost)


if __name__ == "__main__":
    sol = Solution()
    print(sol.destination_path_count([[1, 2, 9], [5, 3, 8], [4, 6, 7]], 19))   # 1
    print(sol.destination_path_count([[1, 2, 3], [1, 5, 6], [2, 8, 9]], 21))   # 2
```

```java,editable
import java.util.*;

public class Solution {
    public int destinationPathCount(int[][] matrix, int cost) {
        if (matrix.length == 0 || matrix[0].length == 0) return 0;
        Map<Long, Integer> memo = new HashMap<>();
        return helper(matrix, matrix.length - 1, matrix[0].length - 1, cost, memo);
    }

    private int helper(int[][] m, int r, int c, int rem, Map<Long, Integer> memo) {
        if (rem < 0) return 0;
        if (r == 0 && c == 0) return m[0][0] == rem ? 1 : 0;
        long key = ((long) r * 10001 + c) * 100001L + rem;
        Integer cached = memo.get(key);
        if (cached != null) return cached;
        int top = (r > 0) ? helper(m, r - 1, c, rem - m[r][c], memo) : 0;
        int left = (c > 0) ? helper(m, r, c - 1, rem - m[r][c], memo) : 0;
        int ans = top + left;
        memo.put(key, ans);
        return ans;
    }

    public static void main(String[] args) {
        int[][] m = {{1,2,9},{5,3,8},{4,6,7}};
        System.out.println(new Solution().destinationPathCount(m, 19));   // 1
    }
}
```

```c,editable
#include <stdio.h>
#include <string.h>

#define MAX_R 21
#define MAX_C 21
#define MAX_K 1001

int memo[MAX_R][MAX_C][MAX_K];
int mat_g[MAX_R][MAX_C];

int helper(int r, int c, int rem) {
    if (rem < 0) return 0;
    if (r == 0 && c == 0) return mat_g[0][0] == rem ? 1 : 0;
    if (memo[r][c][rem] != -1) return memo[r][c][rem];
    int top  = (r > 0) ? helper(r - 1, c, rem - mat_g[r][c]) : 0;
    int left = (c > 0) ? helper(r, c - 1, rem - mat_g[r][c]) : 0;
    return memo[r][c][rem] = top + left;
}

int destination_path_count(int rows, int cols, int target) {
    memset(memo, -1, sizeof memo);
    return helper(rows - 1, cols - 1, target);
}

int main(void) {
    int m[3][3] = {{1,2,9},{5,3,8},{4,6,7}};
    for (int r = 0; r < 3; r++) for (int c = 0; c < 3; c++) mat_g[r][c] = m[r][c];
    printf("%d\n", destination_path_count(3, 3, 19));   /* 1 */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <unordered_map>

class Solution {
    std::unordered_map<long long, int> memo;
    std::vector<std::vector<int>> mat;

    int helper(int r, int c, int rem) {
        if (rem < 0) return 0;
        if (r == 0 && c == 0) return mat[0][0] == rem ? 1 : 0;
        long long key = ((long long) r * 10001 + c) * 100001LL + rem;
        auto it = memo.find(key);
        if (it != memo.end()) return it->second;
        int top  = (r > 0) ? helper(r - 1, c, rem - mat[r][c]) : 0;
        int left = (c > 0) ? helper(r, c - 1, rem - mat[r][c]) : 0;
        return memo[key] = top + left;
    }
public:
    int destinationPathCount(std::vector<std::vector<int>>& matrix, int cost) {
        if (matrix.empty() || matrix[0].empty()) return 0;
        mat = matrix; memo.clear();
        return helper(matrix.size() - 1, matrix[0].size() - 1, cost);
    }
};

int main() {
    std::vector<std::vector<int>> m = {{1,2,9},{5,3,8},{4,6,7}};
    std::cout << Solution().destinationPathCount(m, 19) << "\n";   // 1
    return 0;
}
```

```scala,editable
class Solution {
  def destinationPathCount(matrix: Array[Array[Int]], cost: Int): Int = {
    if (matrix.isEmpty || matrix(0).isEmpty) return 0
    val memo = scala.collection.mutable.Map.empty[(Int, Int, Int), Int]
    def helper(r: Int, c: Int, rem: Int): Int = {
      if (rem < 0) return 0
      if (r == 0 && c == 0) return if (matrix(0)(0) == rem) 1 else 0
      memo.getOrElseUpdate((r, c, rem), {
        val top  = if (r > 0) helper(r - 1, c, rem - matrix(r)(c)) else 0
        val left = if (c > 0) helper(r, c - 1, rem - matrix(r)(c)) else 0
        top + left
      })
    }
    helper(matrix.length - 1, matrix(0).length - 1, cost)
  }
}

object Main extends App {
  println(new Solution().destinationPathCount(Array(Array(1,2,9), Array(5,3,8), Array(4,6,7)), 19))   // 1
}
```

```javascript,editable
class Solution {
    destinationPathCount(matrix, cost) {
        if (!matrix.length || !matrix[0].length) return 0;
        const memo = new Map();
        const helper = (r, c, rem) => {
            if (rem < 0) return 0;
            if (r === 0 && c === 0) return matrix[0][0] === rem ? 1 : 0;
            const key = `${r}|${c}|${rem}`;
            if (memo.has(key)) return memo.get(key);
            const top  = r > 0 ? helper(r - 1, c, rem - matrix[r][c]) : 0;
            const left = c > 0 ? helper(r, c - 1, rem - matrix[r][c]) : 0;
            const ans = top + left;
            memo.set(key, ans);
            return ans;
        };
        return helper(matrix.length - 1, matrix[0].length - 1, cost);
    }
}

console.log(new Solution().destinationPathCount([[1,2,9],[5,3,8],[4,6,7]], 19));   // 1
```

```typescript,editable
class Solution {
    destinationPathCount(matrix: number[][], cost: number): number {
        if (!matrix.length || !matrix[0].length) return 0;
        const memo = new Map<string, number>();
        const helper = (r: number, c: number, rem: number): number => {
            if (rem < 0) return 0;
            if (r === 0 && c === 0) return matrix[0][0] === rem ? 1 : 0;
            const key = `${r}|${c}|${rem}`;
            if (memo.has(key)) return memo.get(key)!;
            const top  = r > 0 ? helper(r - 1, c, rem - matrix[r][c]) : 0;
            const left = c > 0 ? helper(r, c - 1, rem - matrix[r][c]) : 0;
            const ans = top + left;
            memo.set(key, ans);
            return ans;
        };
        return helper(matrix.length - 1, matrix[0].length - 1, cost);
    }
}
```

```go,editable
package main

import "fmt"

type key3 struct{ r, c, k int }

func destinationPathCount(matrix [][]int, cost int) int {
    if len(matrix) == 0 || len(matrix[0]) == 0 { return 0 }
    memo := map[key3]int{}
    var helper func(r, c, rem int) int
    helper = func(r, c, rem int) int {
        if rem < 0 { return 0 }
        if r == 0 && c == 0 { if matrix[0][0] == rem { return 1 }; return 0 }
        k := key3{r, c, rem}
        if v, ok := memo[k]; ok { return v }
        top, left := 0, 0
        if r > 0 { top  = helper(r-1, c, rem-matrix[r][c]) }
        if c > 0 { left = helper(r, c-1, rem-matrix[r][c]) }
        memo[k] = top + left
        return memo[k]
    }
    return helper(len(matrix)-1, len(matrix[0])-1, cost)
}

func main() {
    fmt.Println(destinationPathCount([][]int{{1,2,9},{5,3,8},{4,6,7}}, 19))   // 1
}
```

```kotlin,editable
class Solution {
    fun destinationPathCount(matrix: Array<IntArray>, cost: Int): Int {
        if (matrix.isEmpty() || matrix[0].isEmpty()) return 0
        val memo = HashMap<Triple<Int, Int, Int>, Int>()
        fun helper(r: Int, c: Int, rem: Int): Int {
            if (rem < 0) return 0
            if (r == 0 && c == 0) return if (matrix[0][0] == rem) 1 else 0
            val key = Triple(r, c, rem)
            memo[key]?.let { return it }
            val top  = if (r > 0) helper(r - 1, c, rem - matrix[r][c]) else 0
            val left = if (c > 0) helper(r, c - 1, rem - matrix[r][c]) else 0
            val ans = top + left
            memo[key] = ans
            return ans
        }
        return helper(matrix.size - 1, matrix[0].size - 1, cost)
    }
}

fun main() {
    println(Solution().destinationPathCount(arrayOf(intArrayOf(1,2,9), intArrayOf(5,3,8), intArrayOf(4,6,7)), 19))   // 1
}
```

```rust,editable
use std::collections::HashMap;

fn destination_path_count(matrix: &Vec<Vec<i32>>, cost: i32) -> i32 {
    if matrix.is_empty() || matrix[0].is_empty() { return 0; }
    let mut memo: HashMap<(usize, usize, i32), i32> = HashMap::new();
    fn helper(matrix: &Vec<Vec<i32>>, r: usize, c: usize, rem: i32, memo: &mut HashMap<(usize, usize, i32), i32>) -> i32 {
        if rem < 0 { return 0; }
        if r == 0 && c == 0 { return if matrix[0][0] == rem { 1 } else { 0 }; }
        if let Some(&v) = memo.get(&(r, c, rem)) { return v; }
        let top  = if r > 0 { helper(matrix, r - 1, c, rem - matrix[r][c], memo) } else { 0 };
        let left = if c > 0 { helper(matrix, r, c - 1, rem - matrix[r][c], memo) } else { 0 };
        let ans = top + left;
        memo.insert((r, c, rem), ans);
        ans
    }
    helper(matrix, matrix.len() - 1, matrix[0].len() - 1, cost, &mut memo)
}

fn main() {
    let m = vec![vec![1,2,9], vec![5,3,8], vec![4,6,7]];
    println!("{}", destination_path_count(&m, 19));   // 1
}
```

</div>

## Complexity

| Aspect | Cost |
|---|---|
| Time | `O(rows × cols × cost)` — three-dimensional state, each cell `O(1)` work |
| Space | `O(rows × cols × cost)` for the memo |

***

# Largest Plus of 1s

> **Course:** DSA › Algorithms › Dynamic Programming › 2D-Grid Pattern

## The Problem

Given a binary matrix, find the size (number of cells) of the largest plus-shape made entirely of 1s. A plus has a centre and four arms of equal length extending up/down/left/right.

```
Input:  grid = [[1, 1, 1, 0],
                [0, 1, 1, 1],
                [1, 1, 1, 1],
                [1, 0, 1, 0]]
Output: 5                       Plus of arm length 1: centre + 4 arm cells

Input:  grid = [[1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1]]
Output: 9                       Plus of arm length 2: centre + 8 arm cells
```

## The Recurrence — Four Direction Arrays

Build four 2D arrays, one per direction, each measuring how far a contiguous run of 1s extends *to* `(r, c)` from that direction (inclusive of `(r, c)`):
- `left[r][c]` = consecutive 1s ending at `(r, c)` going leftward.
- `right[r][c]` = consecutive 1s ending at `(r, c)` going rightward.
- `up[r][c]` = consecutive 1s ending at `(r, c)` going upward.
- `down[r][c]` = consecutive 1s ending at `(r, c)` going downward.

For a plus centred at `(r, c)`, each arm needs a contiguous run of 1s on that side. The maximum arm length (including the centre) is `min(left, right, up, down)`. The plus has `1 + 4 × (arm − 1)` cells = `4 × arm − 3` total.

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#777777"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart LR
  CENTER["(r, c)<br/>plus centre"]
  CENTER --> L["left run length"]
  CENTER --> R["right run length"]
  CENTER --> U["up run length"]
  CENTER --> D["down run length"]
  L --> MIN["arm = min of all four<br/>plus size = 4 · arm − 3"]
  R --> MIN
  U --> MIN
  D --> MIN
```

<p align="center"><strong>Four direction arrays, each computed in one pass over the grid. The plus centred at any cell is bounded by the shortest arm.</strong></p>

> *Pause. Why is `4 × arm − 3` the cell count, not `4 × arm + 1`?*

Each arm of length `arm` *includes the centre*. If you sum four arms, you count the centre four times — once per arm. To correct, subtract the three over-counted centres: `4 × arm − 3`. (If you used arm length *excluding* the centre, the formula would be `4 × arm + 1` — same answer, different convention.)

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def largest_plus_of_ones(self, matrix: List[List[int]]) -> int:
        if not matrix or not matrix[0]:
            return 0
        rows, cols = len(matrix), len(matrix[0])
        left = [[0] * cols for _ in range(rows)]
        right = [[0] * cols for _ in range(rows)]
        up = [[0] * cols for _ in range(rows)]
        down = [[0] * cols for _ in range(rows)]
        # Forward pass: left and up run lengths (including the cell).
        for r in range(rows):
            for c in range(cols):
                if matrix[r][c] == 1:
                    left[r][c] = 1 + (left[r][c - 1] if c > 0 else 0)
                    up[r][c]   = 1 + (up[r - 1][c]   if r > 0 else 0)
        # Backward pass: right and down run lengths.
        for r in range(rows - 1, -1, -1):
            for c in range(cols - 1, -1, -1):
                if matrix[r][c] == 1:
                    right[r][c] = 1 + (right[r][c + 1] if c < cols - 1 else 0)
                    down[r][c]  = 1 + (down[r + 1][c]  if r < rows - 1 else 0)
        max_size = 0
        for r in range(rows):
            for c in range(cols):
                if matrix[r][c] == 1:
                    arm = min(left[r][c], right[r][c], up[r][c], down[r][c])
                    size = 4 * arm - 3                    # Plus has 1 + 4·(arm-1) cells
                    if size > max_size:
                        max_size = size
        return max_size


if __name__ == "__main__":
    sol = Solution()
    print(sol.largest_plus_of_ones(
        [[1, 1, 1, 0], [0, 1, 1, 1], [1, 1, 1, 1], [1, 0, 1, 0]]))   # 5
    print(sol.largest_plus_of_ones(
        [[1]*5, [1]*5, [1]*5, [1]*5, [1]*5]))                        # 9
```

```java,editable
public class Solution {
    public int largestPlusOfOnes(int[][] matrix) {
        if (matrix.length == 0 || matrix[0].length == 0) return 0;
        int rows = matrix.length, cols = matrix[0].length;
        int[][] left  = new int[rows][cols];
        int[][] right = new int[rows][cols];
        int[][] up    = new int[rows][cols];
        int[][] down  = new int[rows][cols];
        for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
            if (matrix[r][c] == 1) {
                left[r][c] = 1 + (c > 0 ? left[r][c - 1] : 0);
                up[r][c]   = 1 + (r > 0 ? up[r - 1][c]   : 0);
            }
        }
        for (int r = rows - 1; r >= 0; r--) for (int c = cols - 1; c >= 0; c--) {
            if (matrix[r][c] == 1) {
                right[r][c] = 1 + (c < cols - 1 ? right[r][c + 1] : 0);
                down[r][c]  = 1 + (r < rows - 1 ? down[r + 1][c]  : 0);
            }
        }
        int maxSize = 0;
        for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
            if (matrix[r][c] == 1) {
                int arm = Math.min(Math.min(left[r][c], right[r][c]), Math.min(up[r][c], down[r][c]));
                int size = 4 * arm - 3;
                if (size > maxSize) maxSize = size;
            }
        }
        return maxSize;
    }

    public static void main(String[] args) {
        int[][] g = {{1,1,1,0},{0,1,1,1},{1,1,1,1},{1,0,1,0}};
        System.out.println(new Solution().largestPlusOfOnes(g));   // 5
    }
}
```

```c,editable
#include <stdio.h>

int left_a[101][101], right_a[101][101], up_a[101][101], down_a[101][101];

int min4(int a, int b, int c, int d) {
    int m = a; if (b < m) m = b; if (c < m) m = c; if (d < m) m = d; return m;
}

int largest_plus_of_ones(int matrix[][101], int rows, int cols) {
    if (rows == 0 || cols == 0) return 0;
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
        left_a[r][c] = 0; right_a[r][c] = 0; up_a[r][c] = 0; down_a[r][c] = 0;
    }
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
        if (matrix[r][c] == 1) {
            left_a[r][c] = 1 + (c > 0 ? left_a[r][c - 1] : 0);
            up_a[r][c]   = 1 + (r > 0 ? up_a[r - 1][c]   : 0);
        }
    }
    for (int r = rows - 1; r >= 0; r--) for (int c = cols - 1; c >= 0; c--) {
        if (matrix[r][c] == 1) {
            right_a[r][c] = 1 + (c < cols - 1 ? right_a[r][c + 1] : 0);
            down_a[r][c]  = 1 + (r < rows - 1 ? down_a[r + 1][c]  : 0);
        }
    }
    int max_size = 0;
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
        if (matrix[r][c] == 1) {
            int arm = min4(left_a[r][c], right_a[r][c], up_a[r][c], down_a[r][c]);
            int size = 4 * arm - 3;
            if (size > max_size) max_size = size;
        }
    }
    return max_size;
}

int main(void) {
    int g[4][101] = {{1,1,1,0},{0,1,1,1},{1,1,1,1},{1,0,1,0}};
    printf("%d\n", largest_plus_of_ones(g, 4, 4));   /* 5 */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <algorithm>

class Solution {
public:
    int largestPlusOfOnes(std::vector<std::vector<int>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) return 0;
        int rows = matrix.size(), cols = matrix[0].size();
        std::vector<std::vector<int>> left(rows, std::vector<int>(cols, 0));
        auto right = left, up = left, down = left;
        for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
            if (matrix[r][c] == 1) {
                left[r][c] = 1 + (c > 0 ? left[r][c - 1] : 0);
                up[r][c]   = 1 + (r > 0 ? up[r - 1][c]   : 0);
            }
        }
        for (int r = rows - 1; r >= 0; r--) for (int c = cols - 1; c >= 0; c--) {
            if (matrix[r][c] == 1) {
                right[r][c] = 1 + (c < cols - 1 ? right[r][c + 1] : 0);
                down[r][c]  = 1 + (r < rows - 1 ? down[r + 1][c]  : 0);
            }
        }
        int maxSize = 0;
        for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
            if (matrix[r][c] == 1) {
                int arm = std::min({left[r][c], right[r][c], up[r][c], down[r][c]});
                int size = 4 * arm - 3;
                if (size > maxSize) maxSize = size;
            }
        }
        return maxSize;
    }
};

int main() {
    std::vector<std::vector<int>> g = {{1,1,1,0},{0,1,1,1},{1,1,1,1},{1,0,1,0}};
    std::cout << Solution().largestPlusOfOnes(g) << "\n";   // 5
    return 0;
}
```

```scala,editable
class Solution {
  def largestPlusOfOnes(matrix: Array[Array[Int]]): Int = {
    if (matrix.isEmpty || matrix(0).isEmpty) return 0
    val rows = matrix.length; val cols = matrix(0).length
    val left = Array.fill(rows, cols)(0); val right = Array.fill(rows, cols)(0)
    val up = Array.fill(rows, cols)(0); val down = Array.fill(rows, cols)(0)
    for (r <- 0 until rows; c <- 0 until cols) {
      if (matrix(r)(c) == 1) {
        left(r)(c) = 1 + (if (c > 0) left(r)(c - 1) else 0)
        up(r)(c)   = 1 + (if (r > 0) up(r - 1)(c)   else 0)
      }
    }
    for (r <- rows - 1 to 0 by -1; c <- cols - 1 to 0 by -1) {
      if (matrix(r)(c) == 1) {
        right(r)(c) = 1 + (if (c < cols - 1) right(r)(c + 1) else 0)
        down(r)(c)  = 1 + (if (r < rows - 1) down(r + 1)(c)  else 0)
      }
    }
    var maxSize = 0
    for (r <- 0 until rows; c <- 0 until cols) {
      if (matrix(r)(c) == 1) {
        val arm = math.min(math.min(left(r)(c), right(r)(c)), math.min(up(r)(c), down(r)(c)))
        val size = 4 * arm - 3
        if (size > maxSize) maxSize = size
      }
    }
    maxSize
  }
}

object Main extends App {
  println(new Solution().largestPlusOfOnes(Array(Array(1,1,1,0), Array(0,1,1,1), Array(1,1,1,1), Array(1,0,1,0))))   // 5
}
```

```javascript,editable
class Solution {
    largestPlusOfOnes(matrix) {
        if (!matrix.length || !matrix[0].length) return 0;
        const rows = matrix.length, cols = matrix[0].length;
        const make = () => Array.from({length: rows}, () => new Array(cols).fill(0));
        const left = make(), right = make(), up = make(), down = make();
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
            if (matrix[r][c] === 1) {
                left[r][c] = 1 + (c > 0 ? left[r][c - 1] : 0);
                up[r][c]   = 1 + (r > 0 ? up[r - 1][c]   : 0);
            }
        }
        for (let r = rows - 1; r >= 0; r--) for (let c = cols - 1; c >= 0; c--) {
            if (matrix[r][c] === 1) {
                right[r][c] = 1 + (c < cols - 1 ? right[r][c + 1] : 0);
                down[r][c]  = 1 + (r < rows - 1 ? down[r + 1][c]  : 0);
            }
        }
        let maxSize = 0;
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
            if (matrix[r][c] === 1) {
                const arm = Math.min(left[r][c], right[r][c], up[r][c], down[r][c]);
                const size = 4 * arm - 3;
                if (size > maxSize) maxSize = size;
            }
        }
        return maxSize;
    }
}

console.log(new Solution().largestPlusOfOnes([[1,1,1,0],[0,1,1,1],[1,1,1,1],[1,0,1,0]]));   // 5
```

```typescript,editable
class Solution {
    largestPlusOfOnes(matrix: number[][]): number {
        if (!matrix.length || !matrix[0].length) return 0;
        const rows = matrix.length, cols = matrix[0].length;
        const make = (): number[][] => Array.from({length: rows}, () => new Array(cols).fill(0));
        const left = make(), right = make(), up = make(), down = make();
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
            if (matrix[r][c] === 1) {
                left[r][c] = 1 + (c > 0 ? left[r][c - 1] : 0);
                up[r][c]   = 1 + (r > 0 ? up[r - 1][c]   : 0);
            }
        }
        for (let r = rows - 1; r >= 0; r--) for (let c = cols - 1; c >= 0; c--) {
            if (matrix[r][c] === 1) {
                right[r][c] = 1 + (c < cols - 1 ? right[r][c + 1] : 0);
                down[r][c]  = 1 + (r < rows - 1 ? down[r + 1][c]  : 0);
            }
        }
        let maxSize = 0;
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
            if (matrix[r][c] === 1) {
                const arm = Math.min(left[r][c], right[r][c], up[r][c], down[r][c]);
                const size = 4 * arm - 3;
                if (size > maxSize) maxSize = size;
            }
        }
        return maxSize;
    }
}
```

```go,editable
package main

import "fmt"

func min4(a, b, c, d int) int {
    m := a; if b < m { m = b }; if c < m { m = c }; if d < m { m = d }; return m
}

func largestPlusOfOnes(matrix [][]int) int {
    if len(matrix) == 0 || len(matrix[0]) == 0 { return 0 }
    rows, cols := len(matrix), len(matrix[0])
    make2 := func() [][]int {
        a := make([][]int, rows); for i := range a { a[i] = make([]int, cols) }; return a
    }
    left, right, up, down := make2(), make2(), make2(), make2()
    for r := 0; r < rows; r++ { for c := 0; c < cols; c++ {
        if matrix[r][c] == 1 {
            l := 0; u := 0
            if c > 0 { l = left[r][c-1] }
            if r > 0 { u = up[r-1][c] }
            left[r][c] = 1 + l; up[r][c] = 1 + u
        }
    } }
    for r := rows - 1; r >= 0; r-- { for c := cols - 1; c >= 0; c-- {
        if matrix[r][c] == 1 {
            ri := 0; dn := 0
            if c < cols - 1 { ri = right[r][c+1] }
            if r < rows - 1 { dn = down[r+1][c] }
            right[r][c] = 1 + ri; down[r][c] = 1 + dn
        }
    } }
    maxSize := 0
    for r := 0; r < rows; r++ { for c := 0; c < cols; c++ {
        if matrix[r][c] == 1 {
            arm := min4(left[r][c], right[r][c], up[r][c], down[r][c])
            size := 4 * arm - 3
            if size > maxSize { maxSize = size }
        }
    } }
    return maxSize
}

func main() {
    fmt.Println(largestPlusOfOnes([][]int{{1,1,1,0},{0,1,1,1},{1,1,1,1},{1,0,1,0}}))   // 5
}
```

```kotlin,editable
class Solution {
    fun largestPlusOfOnes(matrix: Array<IntArray>): Int {
        if (matrix.isEmpty() || matrix[0].isEmpty()) return 0
        val rows = matrix.size; val cols = matrix[0].size
        val left  = Array(rows) { IntArray(cols) }
        val right = Array(rows) { IntArray(cols) }
        val up    = Array(rows) { IntArray(cols) }
        val down  = Array(rows) { IntArray(cols) }
        for (r in 0 until rows) for (c in 0 until cols) {
            if (matrix[r][c] == 1) {
                left[r][c] = 1 + (if (c > 0) left[r][c - 1] else 0)
                up[r][c]   = 1 + (if (r > 0) up[r - 1][c]   else 0)
            }
        }
        for (r in rows - 1 downTo 0) for (c in cols - 1 downTo 0) {
            if (matrix[r][c] == 1) {
                right[r][c] = 1 + (if (c < cols - 1) right[r][c + 1] else 0)
                down[r][c]  = 1 + (if (r < rows - 1) down[r + 1][c]  else 0)
            }
        }
        var maxSize = 0
        for (r in 0 until rows) for (c in 0 until cols) {
            if (matrix[r][c] == 1) {
                val arm = minOf(left[r][c], right[r][c], up[r][c], down[r][c])
                val size = 4 * arm - 3
                if (size > maxSize) maxSize = size
            }
        }
        return maxSize
    }
}

fun main() {
    println(Solution().largestPlusOfOnes(arrayOf(intArrayOf(1,1,1,0), intArrayOf(0,1,1,1), intArrayOf(1,1,1,1), intArrayOf(1,0,1,0))))   // 5
}
```

```rust,editable
fn largest_plus_of_ones(matrix: &Vec<Vec<i32>>) -> i32 {
    if matrix.is_empty() || matrix[0].is_empty() { return 0; }
    let rows = matrix.len(); let cols = matrix[0].len();
    let mut left  = vec![vec![0i32; cols]; rows];
    let mut right = vec![vec![0i32; cols]; rows];
    let mut up    = vec![vec![0i32; cols]; rows];
    let mut down  = vec![vec![0i32; cols]; rows];
    for r in 0..rows { for c in 0..cols {
        if matrix[r][c] == 1 {
            left[r][c] = 1 + if c > 0 { left[r][c - 1] } else { 0 };
            up[r][c]   = 1 + if r > 0 { up[r - 1][c]   } else { 0 };
        }
    } }
    for r in (0..rows).rev() { for c in (0..cols).rev() {
        if matrix[r][c] == 1 {
            right[r][c] = 1 + if c + 1 < cols { right[r][c + 1] } else { 0 };
            down[r][c]  = 1 + if r + 1 < rows { down[r + 1][c]  } else { 0 };
        }
    } }
    let mut max_size = 0;
    for r in 0..rows { for c in 0..cols {
        if matrix[r][c] == 1 {
            let arm = left[r][c].min(right[r][c]).min(up[r][c]).min(down[r][c]);
            let size = 4 * arm - 3;
            if size > max_size { max_size = size; }
        }
    } }
    max_size
}

fn main() {
    let g = vec![vec![1,1,1,0], vec![0,1,1,1], vec![1,1,1,1], vec![1,0,1,0]];
    println!("{}", largest_plus_of_ones(&g));   // 5
}
```

</div>

## Complexity

| Aspect | Cost |
|---|---|
| Time | `O(rows × cols)` — two passes for the four direction arrays plus one for the answer |
| Space | `O(rows × cols)` for the four arrays |

***

# Final Takeaway

The 2D-grid pattern collapses a wide variety of "walk a 2D world" problems into one shape:

| Problem | Flavour | Aggregator |
|---|---|---|
| Longest ascending route | DFS + memo (free directions) | max |
| Largest square of 1s | Origin-to-target / local optimum | min + 1 |
| Destination path count | Origin-to-target with budget | sum |
| Largest plus of 1s | Local optimum (4 direction arrays) | min |

Each problem differs only in the transition rule and the aggregator. The state is always `(r, c)` (sometimes plus an extra dimension like a budget). Iteration order is dictated by the dependency direction — top-left-to-bottom-right when transitions read up/left, DFS+memo when transitions go in any direction. **You didn't just learn four grid problems. You internalised the *family* of 2D-grid DPs — recognise the transition rule, pick the iteration shape, choose the aggregator, and the recurrence writes itself.**

> *Transfer challenge for the next lesson:* Drop the grid; flatten back to 1D arrays. Now the question is "given an array of integers, what's the maximum sum of a contiguous subarray?" — Kadane's territory. But there's a **prefix-sum** angle: precompute cumulative sums and many subarray-statistics problems become O(1) lookups. Predict the recurrence's shape, and notice it's *not* DP in the table-fill sense.

<details>
<summary><strong>Answer</strong></summary>

`prefix[i]` = sum of `arr[0..i-1]`. Then `sum(arr[l..r]) = prefix[r + 1] - prefix[l]` is `O(1)` after a single linear-time precomputation. Many "find subarray with property X" problems reduce to "find indices `l, r` with `prefix[r] - prefix[l] = target`" — which is a hash-map lookup, not a DP. The next lesson formalises this as the **prefix-sum pattern** — one-pass precompute, then constant-time queries on any subarray.

</details>
