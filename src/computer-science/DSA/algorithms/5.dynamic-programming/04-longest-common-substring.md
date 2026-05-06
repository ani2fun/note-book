# 4. Longest Common Substring

The previous lesson found the longest common *subsequence* — characters in order, with arbitrary skipping allowed. **Substring** is the contiguous version: matched characters must be adjacent in both original strings, no gaps. The change sounds tiny ("the matched characters must touch"). The recurrence change is one operator. But the *consequences* — where the answer lives in the DP table, what a mismatch does, why the answer might be in any cell — flip the whole shape of the algorithm.

By the end of this lesson you'll know the **Longest Common Substring** recurrence (`dp[i][j] = dp[i-1][j-1] + 1` if match, else **0**), why mismatches reset rather than fall back to a max, why the answer is `max(dp[i][j])` over the entire table (not just `dp[m][n]`), and how to extract the actual substring once you've computed its length.

## Table of contents

1. [Substring vs Subsequence — The One-Operator Difference](#substring-vs-subsequence--the-one-operator-difference)
2. [The Recurrence](#the-recurrence)
3. [Top-Down Solution (Memoization)](#top-down-solution-memoization)
4. [Bottom-Up Solution (Tabulation)](#bottom-up-solution-tabulation)
5. [Longest Common Substring](#longest-common-substring)

***

# Substring vs Subsequence — The One-Operator Difference

> **Course:** DSA › Algorithms › Dynamic Programming › LCSubstr

A **substring** is a contiguous slice of a string — every character is adjacent to its neighbour in the original. A **subsequence** allows skipping. Same character set; different rule on skips.

```d2
direction: right
ss: "Substring vs Subsequence in 'abcdef'" {
  grid-rows: 3
  grid-columns: 7
  grid-gap: 0
  l1: "substring 'cde'"
  v1a: "a"
  v1b: "b"
  v1c: "c" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  v1d: "d" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  v1e: "e" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  v1f: "f"
  l2: "subsequence 'ace'"
  v2a: "a" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  v2b: "b"
  v2c: "c" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  v2d: "d"
  v2e: "e" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  v2f: "f"
  l3: "indices 0..5"
  i0: "[0]"
  i1: "[1]"
  i2: "[2]"
  i3: "[3]"
  i4: "[4]"
  i5: "[5]"
}
```

<p align="center"><strong>The substring "cde" picks consecutive indices 2-3-4. The subsequence "ace" picks 0, 2, 4 — gaps allowed. Both preserve order; only the substring requires adjacency.</strong></p>

The longest common *substring* of `s1` and `s2` is the longest contiguous slice that appears in both. The longest common *subsequence* is the longest non-contiguous selection. The latter is always at least as long as the former (every substring is a subsequence; not every subsequence is a substring).

> *Predict before reading on — for <code>s1 = "abcdef"</code>, <code>s2 = "axcyef"</code>, what's the LCSubstr? What's the LCS?</em>

LCSubstr: `"ef"` (length 2). LCS: `"acef"` (length 4). The contiguity requirement strictly reduces what counts.

---

## Why a Mismatch Resets, Not Falls Back

In LCS, when characters don't match, we drop one side and try the other (`max(dp[i-1][j], dp[i][j-1])`). That's because in a *sub*sequence, dropping a character is allowed — we can keep building the subsequence using the remaining characters.

In LCSubstr, a mismatch breaks the *running adjacency*. Once you've broken contiguity, the substring ending at this position is dead. You can't recover; you have to start a new substring. So `dp[i][j] = 0` on mismatch — not `max`, just zero.

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
  CASE["s1[i] vs s2[j]"]
  CASE -->|"=="| EXTEND["dp[i][j] = dp[i-1][j-1] + 1<br/>extend the running match"]
  CASE -->|"!="| RESET["dp[i][j] = 0<br/>contiguity broken — restart"]
```

<p align="center"><strong>The two-case recurrence for LCSubstr. Match extends the diagonal predecessor exactly like LCS. Mismatch resets to 0 — the substring ending at this position has length 0.</strong></p>

---

## Why the Answer Is Not `dp[m][n]`

`dp[i][j]` is the length of the LCSubstr that **ends exactly at indices `i` and `j`**. The actual longest common substring could end *anywhere* in either string. The final answer is `max(dp[i][j])` over the entire table.

In LCS, the recurrence at `dp[m][n]` covers every smaller subproblem because mismatch carries forward via `max`. In LCSubstr, mismatches reset, so each cell is independent of mismatched ancestors. The table's last cell only knows about the substring ending right at the end — which usually isn't the longest.

> *Pause. For <code>s1 = "abcde"</code>, <code>s2 = "xyzcde"</code>, the LCSubstr is "cde" — but neither string ends at "cde". Which cell of the table holds the answer?</em>

For `s1[2..4] = "cde"` and `s2[3..5] = "cde"`, the match accumulates at `dp[3][4] = 1` ('c' matches 'c'), `dp[4][5] = 2` (extends with 'd'), `dp[5][6] = 3` (extends with 'e'). The answer is `dp[5][6] = 3` — but `dp[5][6]` happens to be `dp[m][n]` here only by accident. For other inputs the maximum lives mid-table.

---

## Key Takeaway

LCSubstr's recurrence is LCS's with mismatch's `max(...)` swapped for `0`. The answer is `max(dp[i][j])` because the substring can end anywhere. Every later difference flows from those two changes.

***

# The Recurrence

> **Course:** DSA › Algorithms › Dynamic Programming › LCSubstr

`dp(i, j)` = length of the longest common substring **ending at indices `i` in `s1` and `j` in `s2`**.

```
dp(i, j) = 0                           if i < 0 or j < 0
dp(i, j) = 0                           if s1[i] != s2[j]
dp(i, j) = 1 + dp(i - 1, j - 1)        if s1[i] == s2[j]

answer   = max( dp(i, j) ) over all (i, j)
```

State is 2D, so the table is 2D. Same shape as LCS, different transitions.

---

## Key Takeaway

Match → extend the diagonal predecessor. Mismatch → reset to 0. Answer = max over the table.

***

# Top-Down Solution (Memoization)

> **Course:** DSA › Algorithms › Dynamic Programming › LCSubstr

The recursive function returns the LCSubstr ending at `(i, j)`. Because the answer might end anywhere, the caller iterates over all `(i, j)` and takes the max.

## Algorithm

> **lcs(i, j, s1, s2, memo):**
>
> 1. If `i < 0` or `j < 0`, return 0.
> 2. If `memo[i][j] != -1`, return cached.
> 3. If `s1[i] != s2[j]`: set `memo[i][j] = 0`; return 0.
> 4. Else: `memo[i][j] = 1 + lcs(i-1, j-1, ...)`; return `memo[i][j]`.
>
> **caller(s1, s2):**
>
> 1. If either string is empty, return 0.
> 2. Init `memo` as `m × n` of `-1`. Init `result = 0`.
> 3. For each `(i, j)`: `result = max(result, lcs(i, j, ...))`.
> 4. Return `result`.

## The Solution

<div class="lang-tabs">

```pseudocode
# Top-down memoized. lcs(i, j) = length of common SUFFIX of s1[..i] and s2[..j].
# A common substring is any matching suffix → answer is the max over all (i, j).
function longestCommonSubstringLength(s1, s2):
    m ← length(s1); n ← length(s2)
    if m = 0 OR n = 0: return 0
    memo ← m × n grid filled with −1
    result ← 0
    for i from 0 to m − 1:
        for j from 0 to n − 1:
            result ← max(result, lcs(i, j, s1, s2, memo))
    return result

function lcs(i, j, s1, s2, memo):
    if i < 0 OR j < 0:
        return 0
    if memo[i][j] ≠ −1:
        return memo[i][j]
    if s1[i] ≠ s2[j]:
        memo[i][j] ← 0                          # mismatch resets — no fallback to max!
    else:
        memo[i][j] ← 1 + lcs(i − 1, j − 1, s1, s2, memo)
    return memo[i][j]
```

```python,editable
from typing import List

class Solution:
    def longest_common_substring_length(self, s1: str, s2: str) -> int:
        m, n = len(s1), len(s2)
        if m == 0 or n == 0:
            return 0
        memo: List[List[int]] = [[-1] * n for _ in range(m)]
        result = 0
        for i in range(m):
            for j in range(n):
                result = max(result, self._lcs(i, j, s1, s2, memo))
        return result

    def _lcs(self, i: int, j: int, s1: str, s2: str, memo: List[List[int]]) -> int:
        if i < 0 or j < 0:
            return 0
        if memo[i][j] != -1:
            return memo[i][j]
        if s1[i] != s2[j]:                       # Mismatch resets — no fallback to max
            memo[i][j] = 0
        else:
            memo[i][j] = 1 + self._lcs(i - 1, j - 1, s1, s2, memo)
        return memo[i][j]


if __name__ == "__main__":
    print(Solution().longest_common_substring_length("abcdefgh", "bxcdelx"))   # 3 ("cde")
```

```java,editable
import java.util.Arrays;

public class Solution {
    public int longestCommonSubstringLength(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        if (m == 0 || n == 0) return 0;
        int[][] memo = new int[m][n];
        for (int[] row : memo) Arrays.fill(row, -1);
        int best = 0;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                best = Math.max(best, lcs(i, j, s1, s2, memo));
        return best;
    }

    private int lcs(int i, int j, String s1, String s2, int[][] memo) {
        if (i < 0 || j < 0) return 0;
        if (memo[i][j] != -1) return memo[i][j];
        memo[i][j] = (s1.charAt(i) != s2.charAt(j)) ? 0 : 1 + lcs(i - 1, j - 1, s1, s2, memo);
        return memo[i][j];
    }
}
```

```c,editable
#include <stdio.h>
#include <string.h>

int memo[1001][1001];

int lcs_top(int i, int j, const char *s1, const char *s2) {
    if (i < 0 || j < 0) return 0;
    if (memo[i][j] != -1) return memo[i][j];
    memo[i][j] = (s1[i] != s2[j]) ? 0 : 1 + lcs_top(i - 1, j - 1, s1, s2);
    return memo[i][j];
}

int longest_common_substring_length(const char *s1, const char *s2) {
    int m = (int) strlen(s1), n = (int) strlen(s2);
    if (m == 0 || n == 0) return 0;
    for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) memo[i][j] = -1;
    int best = 0;
    for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) {
        int v = lcs_top(i, j, s1, s2);
        if (v > best) best = v;
    }
    return best;
}

int main(void) {
    printf("%d\n", longest_common_substring_length("abcdefgh", "bxcdelx"));   // 3
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

class Solution {
public:
    int longestCommonSubstringLength(std::string& s1, std::string& s2) {
        int m = (int) s1.size(), n = (int) s2.size();
        if (m == 0 || n == 0) return 0;
        std::vector<std::vector<int>> memo(m, std::vector<int>(n, -1));
        int best = 0;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                best = std::max(best, lcs(i, j, s1, s2, memo));
        return best;
    }
private:
    int lcs(int i, int j, std::string& s1, std::string& s2, std::vector<std::vector<int>>& memo) {
        if (i < 0 || j < 0) return 0;
        if (memo[i][j] != -1) return memo[i][j];
        memo[i][j] = (s1[i] != s2[j]) ? 0 : 1 + lcs(i - 1, j - 1, s1, s2, memo);
        return memo[i][j];
    }
};
```

```scala,editable
class Solution {
  def longestCommonSubstringLength(s1: String, s2: String): Int = {
    val (m, n) = (s1.length, s2.length)
    if (m == 0 || n == 0) return 0
    val memo = Array.fill(m, n)(-1)
    def lcs(i: Int, j: Int): Int = {
      if (i < 0 || j < 0) return 0
      if (memo(i)(j) != -1) return memo(i)(j)
      memo(i)(j) = if (s1(i) != s2(j)) 0 else 1 + lcs(i - 1, j - 1)
      memo(i)(j)
    }
    var best = 0
    for (i <- 0 until m; j <- 0 until n) best = math.max(best, lcs(i, j))
    best
  }
}
```

```typescript,editable
class Solution {
    longestCommonSubstringLength(s1: string, s2: string): number {
        const m = s1.length, n = s2.length;
        if (m === 0 || n === 0) return 0;
        const memo: number[][] = Array.from({length: m}, () => new Array(n).fill(-1));
        const lcs = (i: number, j: number): number => {
            if (i < 0 || j < 0) return 0;
            if (memo[i][j] !== -1) return memo[i][j];
            memo[i][j] = (s1[i] !== s2[j]) ? 0 : 1 + lcs(i - 1, j - 1);
            return memo[i][j];
        };
        let best = 0;
        for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) best = Math.max(best, lcs(i, j));
        return best;
    }
}
```

```go,editable
package main

import "fmt"

func longestCommonSubstringLength(s1, s2 string) int {
    m, n := len(s1), len(s2)
    if m == 0 || n == 0 { return 0 }
    memo := make([][]int, m)
    for i := range memo {
        memo[i] = make([]int, n)
        for j := range memo[i] { memo[i][j] = -1 }
    }
    var lcs func(i, j int) int
    lcs = func(i, j int) int {
        if i < 0 || j < 0 { return 0 }
        if memo[i][j] != -1 { return memo[i][j] }
        if s1[i] != s2[j] { memo[i][j] = 0 } else { memo[i][j] = 1 + lcs(i-1, j-1) }
        return memo[i][j]
    }
    best := 0
    for i := 0; i < m; i++ {
        for j := 0; j < n; j++ {
            if v := lcs(i, j); v > best { best = v }
        }
    }
    return best
}

func main() {
    fmt.Println(longestCommonSubstringLength("abcdefgh", "bxcdelx"))   // 3
}
```

```rust,editable
fn longest_common_substring_length(s1: &str, s2: &str) -> i32 {
    let s1 = s1.as_bytes(); let s2 = s2.as_bytes();
    let m = s1.len(); let n = s2.len();
    if m == 0 || n == 0 { return 0; }
    let mut memo = vec![vec![-1i32; n]; m];
    fn lcs(i: i32, j: i32, s1: &[u8], s2: &[u8], memo: &mut Vec<Vec<i32>>) -> i32 {
        if i < 0 || j < 0 { return 0; }
        let (ui, uj) = (i as usize, j as usize);
        if memo[ui][uj] != -1 { return memo[ui][uj]; }
        memo[ui][uj] = if s1[ui] != s2[uj] { 0 } else { 1 + lcs(i - 1, j - 1, s1, s2, memo) };
        memo[ui][uj]
    }
    let mut best = 0;
    for i in 0..m { for j in 0..n {
        let v = lcs(i as i32, j as i32, s1, s2, &mut memo);
        if v > best { best = v; }
    }}
    best
}

fn main() {
    println!("{}", longest_common_substring_length("abcdefgh", "bxcdelx"));   // 3
}
```

</div>

## Complexity

| Aspect | Cost | Why |
|---|---|---|
| Time | `O(m × n)` | Each cell computed once. |
| Space | `O(m × n)` | Memo table + recursion stack. |

***

# Bottom-Up Solution (Tabulation)

> **Course:** DSA › Algorithms › Dynamic Programming › LCSubstr

The same `(m+1) × (n+1)` shift as LCS — `i` and `j` count characters, not index them. The recurrence becomes `dp[i][j] = dp[i-1][j-1] + 1` when `s1[i-1] == s2[j-1]`, else 0. Track the running max.

```d2
direction: right
table: "dp for s1 = 'aba', s2 = 'adab'" {
  grid-rows: 5
  grid-columns: 5
  grid-gap: 0
  h0: ""
  h1: "j=0<br/>(empty)"
  h2: "j=1<br/>'a'"
  h3: "j=2<br/>'d'"
  h4: "j=3<br/>'a'"
  r0: "i=0 (empty)"
  v00: "0"
  v01: "0"
  v02: "0"
  v03: "0"
  r1: "i=1 'a'"
  v10: "0"
  v11: "1"
  v12: "0"
  v13: "1"
  r2: "i=2 'b'"
  v20: "0"
  v21: "0"
  v22: "0"
  v23: "0"
  r3: "i=3 'a'"
  v30: "0"
  v31: "1"
  v32: "0"
  v33: "1" {style.fill: "#fde68a"; style.stroke: "#d97706"}
}
```

<p align="center"><strong>The DP table for <code>s1 = "aba"</code>, <code>s2 = "ada"</code>. Note how mismatches reset cells to 0 — values don't propagate downward or rightward through them. Multiple cells reach the maximum value 1 (single-character matches "a"); the answer is <code>max = 1</code>.</strong></p>

## The Solution

<div class="lang-tabs">

```pseudocode
# Bottom-up. dp[i][j] = length of longest common suffix ending at (i−1, j−1).
function longestCommonSubstringLength(s1, s2):
    m ← length(s1); n ← length(s2)
    if m = 0 OR n = 0: return 0
    dp ← (m + 1) × (n + 1) grid of zeros
    result ← 0
    for i from 1 to m:
        for j from 1 to n:
            if s1[i − 1] = s2[j − 1]:
                dp[i][j] ← dp[i − 1][j − 1] + 1
                result ← max(result, dp[i][j])
            # else: dp[i][j] remains 0 (mismatch resets)
    return result
```

```python,editable
from typing import List

class Solution:
    def longest_common_substring_length(self, s1: str, s2: str) -> int:
        m, n = len(s1), len(s2)
        if m == 0 or n == 0:
            return 0
        dp: List[List[int]] = [[0] * (n + 1) for _ in range(m + 1)]
        result = 0
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if s1[i - 1] == s2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                    if dp[i][j] > result:
                        result = dp[i][j]                    # No need for max(...) helper — direct compare
                # else: dp[i][j] stays 0 (default)
        return result


if __name__ == "__main__":
    print(Solution().longest_common_substring_length("abcdefgh", "bxcdelx"))   # 3
```

```java,editable
public class Solution {
    public int longestCommonSubstringLength(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        if (m == 0 || n == 0) return 0;
        int[][] dp = new int[m + 1][n + 1];
        int best = 0;
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    if (dp[i][j] > best) best = dp[i][j];
                }
        return best;
    }
}
```

```c,editable
#include <stdio.h>
#include <string.h>

int dp[1001][1001];

int longest_common_substring_length(const char *s1, const char *s2) {
    int m = (int) strlen(s1), n = (int) strlen(s2);
    if (m == 0 || n == 0) return 0;
    for (int i = 0; i <= m; i++) for (int j = 0; j <= n; j++) dp[i][j] = 0;
    int best = 0;
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (s1[i - 1] == s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                if (dp[i][j] > best) best = dp[i][j];
            }
    return best;
}
```

```cpp,editable
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

class Solution {
public:
    int longestCommonSubstringLength(std::string& s1, std::string& s2) {
        int m = (int) s1.size(), n = (int) s2.size();
        if (m == 0 || n == 0) return 0;
        std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));
        int best = 0;
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                if (s1[i - 1] == s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    best = std::max(best, dp[i][j]);
                }
        return best;
    }
};
```

```scala,editable
class Solution {
  def longestCommonSubstringLength(s1: String, s2: String): Int = {
    val (m, n) = (s1.length, s2.length)
    if (m == 0 || n == 0) return 0
    val dp = Array.fill(m + 1, n + 1)(0)
    var best = 0
    for (i <- 1 to m; j <- 1 to n) {
      if (s1(i - 1) == s2(j - 1)) {
        dp(i)(j) = dp(i - 1)(j - 1) + 1
        if (dp(i)(j) > best) best = dp(i)(j)
      }
    }
    best
  }
}
```

```typescript,editable
class Solution {
    longestCommonSubstringLength(s1: string, s2: string): number {
        const m = s1.length, n = s2.length;
        if (m === 0 || n === 0) return 0;
        const dp: number[][] = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));
        let best = 0;
        for (let i = 1; i <= m; i++)
            for (let j = 1; j <= n; j++)
                if (s1[i - 1] === s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    if (dp[i][j] > best) best = dp[i][j];
                }
        return best;
    }
}
```

```go,editable
package main

import "fmt"

func longestCommonSubstringLength(s1, s2 string) int {
    m, n := len(s1), len(s2)
    if m == 0 || n == 0 { return 0 }
    dp := make([][]int, m+1)
    for i := range dp { dp[i] = make([]int, n+1) }
    best := 0
    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if s1[i-1] == s2[j-1] {
                dp[i][j] = dp[i-1][j-1] + 1
                if dp[i][j] > best { best = dp[i][j] }
            }
        }
    }
    return best
}

func main() {
    fmt.Println(longestCommonSubstringLength("abcdefgh", "bxcdelx"))
}
```

```rust,editable
fn longest_common_substring_length(s1: &str, s2: &str) -> i32 {
    let s1 = s1.as_bytes(); let s2 = s2.as_bytes();
    let m = s1.len(); let n = s2.len();
    if m == 0 || n == 0 { return 0; }
    let mut dp = vec![vec![0i32; n + 1]; m + 1];
    let mut best = 0;
    for i in 1..=m { for j in 1..=n {
        if s1[i - 1] == s2[j - 1] {
            dp[i][j] = dp[i - 1][j - 1] + 1;
            if dp[i][j] > best { best = dp[i][j]; }
        }
    }}
    best
}
```

</div>

***

# Longest Common Substring

> **Course:** DSA › Algorithms › Dynamic Programming › LCSubstr

The actual problem: return the *substring*, not just its length. Two extra trackers — the maximum length seen and the index where it ends — let us slice the result out of `s1` after the table is built.

## The Problem

Given two strings `s1` and `s2`, return their longest common substring. If there's a tie, returning any of them is acceptable.

```
Input:  s1 = "abcdefgh", s2 = "bxcdelx"
Output: "cde"

Input:  s1 = "xyzabc", s2 = "xzalfbc"
Output: "za"  (or "bc" — both are length 2)

Input:  s1 = "lx", s2 = "lx"
Output: "lx"
```

---

## Applying the Diagnostic Questions

| # | Question | Answer |
|---|---|---|
| **Q1** | Optimal substructure on prefixes? | **Yes** — match extends the diagonal predecessor; mismatch resets. |
| **Q2** | Overlapping subproblems? | **Yes** — `(i, j)` is reachable from `(i-1, j-1)` for matched chains; without caching the recursion is exponential. |
| **Q3** | 2D state? | **Yes** — `(i, j)` indexed by both prefix lengths. |
| **Q4** | Where does the answer live in the table? | **Anywhere** — track the running max + end-index, not just `dp[m][n]`. |

### Q4 — Why "Anywhere"?

**Mental model.** The substring's "ending position" is wherever the last matching character of the longest run lands — and that depends on where the longest run of consecutive matches happens. It's a property of the input, not of the table's geometry.

**Concrete numbers.** For `s1 = "xxxabc"`, `s2 = "abc"`, the LCSubstr is `"abc"`, ending at `dp[6][3]` = `dp[m][n]`. For `s1 = "abcxxx"`, `s2 = "abc"`, the LCSubstr is also `"abc"`, but it ends at `dp[3][3]`, not `dp[m][n] = dp[6][3]`.

**What breaks otherwise.** Reading just `dp[m][n]` gives the LCSubstr ending at *the very end of both strings*, not the global longest. Wrong answer for any input where the match doesn't extend to both ends.

---

## The Solution

We add two trackers: `best_length` and `best_end_index` (an index in `s1`). After the table is full, slice `s1[best_end_index - best_length + 1 .. best_end_index + 1]`.

<div class="lang-tabs">

```pseudocode
# Same DP as above, plus tracking where the longest run ended in s1 so we can slice it out.
function longestCommonSubstring(s1, s2):
    m ← length(s1); n ← length(s2)
    if m = 0 OR n = 0: return ""
    dp ← (m + 1) × (n + 1) grid of zeros
    bestLength ← 0
    bestEndInS1 ← 0                              # 0-indexed end of the best run in s1
    for i from 1 to m:
        for j from 1 to n:
            if s1[i − 1] = s2[j − 1]:
                dp[i][j] ← dp[i − 1][j − 1] + 1
                if dp[i][j] > bestLength:
                    bestLength ← dp[i][j]
                    bestEndInS1 ← i − 1
    if bestLength = 0:
        return ""
    return substring of s1 from (bestEndInS1 − bestLength + 1) to bestEndInS1
```

```python,editable
from typing import List

class Solution:
    def longest_common_substring(self, s1: str, s2: str) -> str:
        m, n = len(s1), len(s2)
        if m == 0 or n == 0:
            return ""
        dp: List[List[int]] = [[0] * (n + 1) for _ in range(m + 1)]
        best_length = 0
        best_end_in_s1 = 0                       # 0-indexed position in s1 where the best run ended
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if s1[i - 1] == s2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                    if dp[i][j] > best_length:
                        best_length = dp[i][j]
                        best_end_in_s1 = i - 1   # The matched char is at index i-1 in s1
        if best_length == 0:
            return ""
        return s1[best_end_in_s1 - best_length + 1 : best_end_in_s1 + 1]


if __name__ == "__main__":
    print(Solution().longest_common_substring("abcdefgh", "bxcdelx"))   # "cde"
```

```java,editable
public class Solution {
    public String longestCommonSubstring(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        if (m == 0 || n == 0) return "";
        int[][] dp = new int[m + 1][n + 1];
        int bestLen = 0, bestEnd = 0;
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    if (dp[i][j] > bestLen) { bestLen = dp[i][j]; bestEnd = i - 1; }
                }
        if (bestLen == 0) return "";
        return s1.substring(bestEnd - bestLen + 1, bestEnd + 1);
    }

    public static void main(String[] args) {
        System.out.println(new Solution().longestCommonSubstring("abcdefgh", "bxcdelx"));   // cde
    }
}
```

```c,editable
#include <stdio.h>
#include <string.h>

int dp[1001][1001];
char out_buf[1001];

const char *longest_common_substring(const char *s1, const char *s2) {
    int m = (int) strlen(s1), n = (int) strlen(s2);
    if (m == 0 || n == 0) return "";
    for (int i = 0; i <= m; i++) for (int j = 0; j <= n; j++) dp[i][j] = 0;
    int best_len = 0, best_end = 0;
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (s1[i - 1] == s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                if (dp[i][j] > best_len) { best_len = dp[i][j]; best_end = i - 1; }
            }
    if (best_len == 0) return "";
    int start = best_end - best_len + 1;
    memcpy(out_buf, s1 + start, best_len);
    out_buf[best_len] = 0;
    return out_buf;
}

int main(void) {
    printf("%s\n", longest_common_substring("abcdefgh", "bxcdelx"));   // cde
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <string>
#include <vector>

class Solution {
public:
    std::string longestCommonSubstring(std::string s1, std::string s2) {
        int m = (int) s1.size(), n = (int) s2.size();
        if (m == 0 || n == 0) return "";
        std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));
        int bestLen = 0, bestEnd = 0;
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                if (s1[i - 1] == s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    if (dp[i][j] > bestLen) { bestLen = dp[i][j]; bestEnd = i - 1; }
                }
        if (bestLen == 0) return "";
        return s1.substr(bestEnd - bestLen + 1, bestLen);
    }
};

int main() {
    std::cout << Solution().longestCommonSubstring("abcdefgh", "bxcdelx") << "\n";
    return 0;
}
```

```scala,editable
class Solution {
  def longestCommonSubstring(s1: String, s2: String): String = {
    val (m, n) = (s1.length, s2.length)
    if (m == 0 || n == 0) return ""
    val dp = Array.fill(m + 1, n + 1)(0)
    var bestLen = 0; var bestEnd = 0
    for (i <- 1 to m; j <- 1 to n) {
      if (s1(i - 1) == s2(j - 1)) {
        dp(i)(j) = dp(i - 1)(j - 1) + 1
        if (dp(i)(j) > bestLen) { bestLen = dp(i)(j); bestEnd = i - 1 }
      }
    }
    if (bestLen == 0) "" else s1.substring(bestEnd - bestLen + 1, bestEnd + 1)
  }
}
```

```typescript,editable
class Solution {
    longestCommonSubstring(s1: string, s2: string): string {
        const m = s1.length, n = s2.length;
        if (m === 0 || n === 0) return "";
        const dp: number[][] = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));
        let bestLen = 0, bestEnd = 0;
        for (let i = 1; i <= m; i++)
            for (let j = 1; j <= n; j++)
                if (s1[i - 1] === s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    if (dp[i][j] > bestLen) { bestLen = dp[i][j]; bestEnd = i - 1; }
                }
        if (bestLen === 0) return "";
        return s1.slice(bestEnd - bestLen + 1, bestEnd + 1);
    }
}
```

```go,editable
package main

import "fmt"

func longestCommonSubstring(s1, s2 string) string {
    m, n := len(s1), len(s2)
    if m == 0 || n == 0 { return "" }
    dp := make([][]int, m+1)
    for i := range dp { dp[i] = make([]int, n+1) }
    bestLen, bestEnd := 0, 0
    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if s1[i-1] == s2[j-1] {
                dp[i][j] = dp[i-1][j-1] + 1
                if dp[i][j] > bestLen { bestLen = dp[i][j]; bestEnd = i - 1 }
            }
        }
    }
    if bestLen == 0 { return "" }
    return s1[bestEnd-bestLen+1 : bestEnd+1]
}

func main() {
    fmt.Println(longestCommonSubstring("abcdefgh", "bxcdelx"))   // cde
}
```

```rust,editable
fn longest_common_substring(s1: &str, s2: &str) -> String {
    let s1b = s1.as_bytes(); let s2b = s2.as_bytes();
    let m = s1b.len(); let n = s2b.len();
    if m == 0 || n == 0 { return String::new(); }
    let mut dp = vec![vec![0i32; n + 1]; m + 1];
    let mut best_len = 0i32; let mut best_end = 0usize;
    for i in 1..=m { for j in 1..=n {
        if s1b[i - 1] == s2b[j - 1] {
            dp[i][j] = dp[i - 1][j - 1] + 1;
            if dp[i][j] > best_len { best_len = dp[i][j]; best_end = i - 1; }
        }
    }}
    if best_len == 0 { return String::new(); }
    s1[best_end + 1 - best_len as usize..=best_end].to_string()
}

fn main() {
    println!("{}", longest_common_substring("abcdefgh", "bxcdelx"));   // cde
}
```

</div>

<details>
<summary><strong>Trace — s1 = "abcdefgh", s2 = "bxcdelx"</strong></summary>

```
Build dp (9 × 8). Highlighted cells = matching characters; non-highlighted = 0.
dp[2][1] = 1 ('b' = 'b')
dp[3][3] = 1 ('c' = 'c')                              best_len=1, best_end=2
dp[4][4] = 2 (extends [3][3]: 'd' = 'd')              best_len=2, best_end=3
dp[5][5] = 3 (extends [4][4]: 'e' = 'e')              best_len=3, best_end=4
... mismatches set the rest to 0 ...

best_len=3, best_end=4 → s1[2..4] = "cde" ✓
```

</details>

---

## Complexity Analysis

| Aspect | Cost | Why |
|---|---|---|
| Time | `O(m × n)` | Fill the table; constant work per cell. |
| Space | `O(m × n)` | DP table. Reducible to `O(min(m, n))` (rolling row), but reconstruction needs the index trackers. |

---

## Edge Cases

| Case | Example | Expected | Reasoning |
|---|---|---|---|
| Either empty | `s1 = ""` | `""` | Guard returns empty. |
| No shared character | `"abc", "xyz"` | `""` | Every cell stays 0; `best_len = 0` triggers the empty-result branch. |
| Identical strings | `"abc", "abc"` | `"abc"` | Diagonal matches every step; `dp[m][n] = m`. |
| Substring at start | `"abcXY", "abcZZ"` | `"abc"` | Match accumulates at top-left of table; ends mid-table. |
| Substring at end | `"YYabc", "ZZabc"` | `"abc"` | Match accumulates at bottom-right; ends at `dp[m][n]`. |
| Multiple LCSubstrs of equal length | `"xyzabc", "xzalfbc"` | `"za"` or `"bc"` | First-found wins because `>` is strict; `>=` would prefer later matches. |

---

## Final Takeaway

LCSubstr is LCS with one structural change: mismatches reset to 0, and the answer is the global table maximum, not the corner. The code change is two characters and a tracker variable — **but the conceptual change (contiguity vs gap-allowed) is everything**.

> *Transfer challenge for the next lesson:* Edit Distance asks: how many *edits* (insert, delete, substitute) does it take to transform `s1` into `s2`? The recurrence has *three* cases on mismatch (one per edit). Predict what they look like before reading on.

<details>
<summary><strong>Answer</strong></summary>

The three cases all decrement the cost by 1 from a different predecessor: `dp[i-1][j-1] + 1` (substitute), `dp[i-1][j] + 1` (delete from `s1`), `dp[i][j-1] + 1` (insert into `s1`). On match the cost stays the same: `dp[i][j] = dp[i-1][j-1]`. The next lesson formalises this.

</details>
