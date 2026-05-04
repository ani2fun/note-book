# 19. Practice — Mixed DP Problems

You've seen 18 lessons covering an array of DP shapes — linear DP, longest-subsequence variants, palindrome problems, partition problems, the knapsack family, game-theoretic adversarial DP, split-point interval DP, and three meta-patterns (edit-distance, subset-sum, 2D-grid, prefix-sum). The patterns reappear in disguise across hundreds of competitive-programming and interview problems. The goal of this final lesson is mileage: seven problems, each from a different family, with full implementations.

Each problem in this set was chosen to test pattern recognition. Before reading the solution, see if you can identify which pattern it is — that recognition is the meta-skill the entire section was building toward. **You won't always get the recurrence right on the first try, but you should *always* be able to name the family it belongs to within seconds.** That's the bar.

## Table of contents

1. [Covering Distance](#covering-distance)
2. [Reachability Check](#reachability-check)
3. [Longest Bitonic Subsequence](#longest-bitonic-subsequence)
4. [Longest Alternating Subsequence](#longest-alternating-subsequence)
5. [Pattern as Subsequence](#pattern-as-subsequence)
6. [Shortest Common Supersequence](#shortest-common-supersequence)
7. [Longest Repeated Subsequence](#longest-repeated-subsequence)
8. [Final Takeaway](#final-takeaway)

***

# Covering Distance

> **Pattern:** Linear DP, count-aggregator

## The Problem

Given a positive integer `distance`, count the ways to cover it using steps of size 1, 2, or 3.

```
Input:  distance = 3
Output: 4               (1+1+1), (1+2), (2+1), (3)

Input:  distance = 2
Output: 2               (1+1), (2)

Input:  distance = 1
Output: 1               (1)
```

## The Recurrence

`dp[i]` = ways to reach distance `i`. The last step is 1, 2, or 3 — sum the ways from each predecessor:
```
dp[i] = dp[i - 1] + dp[i - 2] + dp[i - 3]
```
With `dp[0] = 1` (one way to "stand still") and missing predecessors treated as 0. (Note this is a Tribonacci-flavoured recurrence — same shape as Fibonacci with one extra step.)

## The Solution

<div class="lang-tabs">

```python,editable
class Solution:
    def covering_distance(self, distance: int) -> int:
        dp = [0] * (distance + 1)
        dp[0] = 1                              # One way to stand still — the empty path
        for i in range(1, distance + 1):
            dp[i] = dp[i - 1]
            if i >= 2: dp[i] += dp[i - 2]
            if i >= 3: dp[i] += dp[i - 3]
        return dp[distance]


if __name__ == "__main__":
    print(Solution().covering_distance(3))   # 4
    print(Solution().covering_distance(5))   # 13
```

```java,editable
public class Solution {
    public int coveringDistance(int distance) {
        int[] dp = new int[distance + 1];
        dp[0] = 1;
        for (int i = 1; i <= distance; i++) {
            dp[i] = dp[i - 1];
            if (i >= 2) dp[i] += dp[i - 2];
            if (i >= 3) dp[i] += dp[i - 3];
        }
        return dp[distance];
    }

    public static void main(String[] args) {
        System.out.println(new Solution().coveringDistance(3));   // 4
    }
}
```

```c,editable
#include <stdio.h>

int covering_distance(int distance) {
    int dp[1001] = {0};
    dp[0] = 1;
    for (int i = 1; i <= distance; i++) {
        dp[i] = dp[i - 1];
        if (i >= 2) dp[i] += dp[i - 2];
        if (i >= 3) dp[i] += dp[i - 3];
    }
    return dp[distance];
}

int main(void) {
    printf("%d\n", covering_distance(3));    /* 4 */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

class Solution {
public:
    int coveringDistance(int distance) {
        std::vector<int> dp(distance + 1, 0);
        dp[0] = 1;
        for (int i = 1; i <= distance; i++) {
            dp[i] = dp[i - 1];
            if (i >= 2) dp[i] += dp[i - 2];
            if (i >= 3) dp[i] += dp[i - 3];
        }
        return dp[distance];
    }
};

int main() {
    std::cout << Solution().coveringDistance(3) << "\n";   // 4
    return 0;
}
```

```scala,editable
class Solution {
  def coveringDistance(distance: Int): Int = {
    val dp = Array.fill(distance + 1)(0)
    dp(0) = 1
    for (i <- 1 to distance) {
      dp(i) = dp(i - 1)
      if (i >= 2) dp(i) += dp(i - 2)
      if (i >= 3) dp(i) += dp(i - 3)
    }
    dp(distance)
  }
}

object Main extends App {
  println(new Solution().coveringDistance(3))   // 4
}
```

```javascript,editable
class Solution {
    coveringDistance(distance) {
        const dp = new Array(distance + 1).fill(0);
        dp[0] = 1;
        for (let i = 1; i <= distance; i++) {
            dp[i] = dp[i - 1];
            if (i >= 2) dp[i] += dp[i - 2];
            if (i >= 3) dp[i] += dp[i - 3];
        }
        return dp[distance];
    }
}

console.log(new Solution().coveringDistance(3));   // 4
```

```typescript,editable
class Solution {
    coveringDistance(distance: number): number {
        const dp = new Array(distance + 1).fill(0);
        dp[0] = 1;
        for (let i = 1; i <= distance; i++) {
            dp[i] = dp[i - 1];
            if (i >= 2) dp[i] += dp[i - 2];
            if (i >= 3) dp[i] += dp[i - 3];
        }
        return dp[distance];
    }
}
```

```go,editable
package main

import "fmt"

func coveringDistance(distance int) int {
    dp := make([]int, distance+1)
    dp[0] = 1
    for i := 1; i <= distance; i++ {
        dp[i] = dp[i-1]
        if i >= 2 { dp[i] += dp[i-2] }
        if i >= 3 { dp[i] += dp[i-3] }
    }
    return dp[distance]
}

func main() {
    fmt.Println(coveringDistance(3))   // 4
}
```

```kotlin,editable
class Solution {
    fun coveringDistance(distance: Int): Int {
        val dp = IntArray(distance + 1)
        dp[0] = 1
        for (i in 1..distance) {
            dp[i] = dp[i - 1]
            if (i >= 2) dp[i] += dp[i - 2]
            if (i >= 3) dp[i] += dp[i - 3]
        }
        return dp[distance]
    }
}

fun main() {
    println(Solution().coveringDistance(3))   // 4
}
```

```rust,editable
fn covering_distance(distance: i32) -> i32 {
    let n = distance as usize;
    let mut dp = vec![0i32; n + 1];
    dp[0] = 1;
    for i in 1..=n {
        dp[i] = dp[i - 1];
        if i >= 2 { dp[i] += dp[i - 2]; }
        if i >= 3 { dp[i] += dp[i - 3]; }
    }
    dp[n]
}

fn main() {
    println!("{}", covering_distance(3));   // 4
}
```

</div>

***

# Reachability Check

> **Pattern:** Linear DP, boolean

## The Problem

Given an array `arr` where `arr[i]` is the maximum forward jump from index `i`, return `true` if the last index is reachable from index 0.

```
Input:  arr = [1, 5, 8, 9]
Output: true               0 → 1 → 3

Input:  arr = [2, 0, 1, 1]
Output: true               0 → 2 → 3

Input:  arr = [2, 0, 0, 1]
Output: false              Stuck at index 1 with arr[1] = 0
```

## The Recurrence

`dp[i]` = whether the end is reachable from index `i`. Working backward, `dp[n - 1] = true`. For `i < n - 1`, `dp[i] = OR over j ∈ [i+1, i + arr[i]] of dp[j]`.

(There's a slick O(n) greedy alternative — track the farthest reachable index — but the DP form generalises better.)

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def reachability_check(self, arr: List[int]) -> bool:
        n = len(arr)
        dp = [False] * n
        dp[n - 1] = True                           # The last index trivially reaches itself
        for i in range(n - 2, -1, -1):
            max_jump = min(i + arr[i], n - 1)
            for j in range(i + 1, max_jump + 1):
                if dp[j]:
                    dp[i] = True
                    break
        return dp[0]


if __name__ == "__main__":
    print(Solution().reachability_check([1, 5, 8, 9]))   # True
    print(Solution().reachability_check([2, 0, 0, 1]))   # False
```

```java,editable
public class Solution {
    public boolean reachabilityCheck(int[] arr) {
        int n = arr.length;
        boolean[] dp = new boolean[n];
        dp[n - 1] = true;
        for (int i = n - 2; i >= 0; i--) {
            int maxJump = Math.min(i + arr[i], n - 1);
            for (int j = i + 1; j <= maxJump; j++) {
                if (dp[j]) { dp[i] = true; break; }
            }
        }
        return dp[0];
    }
}
```

```c,editable
#include <stdio.h>
#include <stdbool.h>

bool reachability_check(const int *arr, int n) {
    bool dp[1001] = {false};
    dp[n - 1] = true;
    for (int i = n - 2; i >= 0; i--) {
        int max_jump = i + arr[i] < n - 1 ? i + arr[i] : n - 1;
        for (int j = i + 1; j <= max_jump; j++) {
            if (dp[j]) { dp[i] = true; break; }
        }
    }
    return dp[0];
}

int main(void) {
    int a[] = {1, 5, 8, 9};
    printf("%d\n", reachability_check(a, 4));    /* 1 */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

class Solution {
public:
    bool reachabilityCheck(std::vector<int>& arr) {
        int n = arr.size();
        std::vector<bool> dp(n, false);
        dp[n - 1] = true;
        for (int i = n - 2; i >= 0; i--) {
            int maxJump = std::min(i + arr[i], n - 1);
            for (int j = i + 1; j <= maxJump; j++) {
                if (dp[j]) { dp[i] = true; break; }
            }
        }
        return dp[0];
    }
};

int main() {
    std::vector<int> a = {1, 5, 8, 9};
    std::cout << Solution().reachabilityCheck(a) << "\n";   // 1
    return 0;
}
```

```scala,editable
class Solution {
  def reachabilityCheck(arr: Array[Int]): Boolean = {
    val n = arr.length
    val dp = Array.fill(n)(false)
    dp(n - 1) = true
    for (i <- n - 2 to 0 by -1) {
      val maxJump = math.min(i + arr(i), n - 1)
      var j = i + 1
      while (j <= maxJump && !dp(i)) {
        if (dp(j)) dp(i) = true
        j += 1
      }
    }
    dp(0)
  }
}

object Main extends App {
  println(new Solution().reachabilityCheck(Array(1, 5, 8, 9)))   // true
}
```

```javascript,editable
class Solution {
    reachabilityCheck(arr) {
        const n = arr.length;
        const dp = new Array(n).fill(false);
        dp[n - 1] = true;
        for (let i = n - 2; i >= 0; i--) {
            const maxJump = Math.min(i + arr[i], n - 1);
            for (let j = i + 1; j <= maxJump; j++) {
                if (dp[j]) { dp[i] = true; break; }
            }
        }
        return dp[0];
    }
}

console.log(new Solution().reachabilityCheck([1, 5, 8, 9]));   // true
```

```typescript,editable
class Solution {
    reachabilityCheck(arr: number[]): boolean {
        const n = arr.length;
        const dp = new Array(n).fill(false);
        dp[n - 1] = true;
        for (let i = n - 2; i >= 0; i--) {
            const maxJump = Math.min(i + arr[i], n - 1);
            for (let j = i + 1; j <= maxJump; j++) {
                if (dp[j]) { dp[i] = true; break; }
            }
        }
        return dp[0];
    }
}
```

```go,editable
package main

import "fmt"

func reachabilityCheck(arr []int) bool {
    n := len(arr)
    dp := make([]bool, n)
    dp[n-1] = true
    for i := n - 2; i >= 0; i-- {
        maxJump := i + arr[i]
        if maxJump > n-1 { maxJump = n - 1 }
        for j := i + 1; j <= maxJump; j++ {
            if dp[j] { dp[i] = true; break }
        }
    }
    return dp[0]
}

func main() {
    fmt.Println(reachabilityCheck([]int{1, 5, 8, 9}))   // true
}
```

```kotlin,editable
class Solution {
    fun reachabilityCheck(arr: IntArray): Boolean {
        val n = arr.size
        val dp = BooleanArray(n)
        dp[n - 1] = true
        for (i in n - 2 downTo 0) {
            val maxJump = minOf(i + arr[i], n - 1)
            for (j in i + 1..maxJump) {
                if (dp[j]) { dp[i] = true; break }
            }
        }
        return dp[0]
    }
}

fun main() {
    println(Solution().reachabilityCheck(intArrayOf(1, 5, 8, 9)))   // true
}
```

```rust,editable
fn reachability_check(arr: &[i32]) -> bool {
    let n = arr.len();
    let mut dp = vec![false; n];
    dp[n - 1] = true;
    for i in (0..n - 1).rev() {
        let max_jump = std::cmp::min(i + arr[i] as usize, n - 1);
        for j in i + 1..=max_jump {
            if dp[j] { dp[i] = true; break; }
        }
    }
    dp[0]
}

fn main() {
    println!("{}", reachability_check(&[1, 5, 8, 9]));   // true
}
```

</div>

***

# Longest Bitonic Subsequence

> **Pattern:** LIS variant — two passes (LIS + LDS)

## The Problem

A *bitonic* subsequence rises then falls (e.g. `1, 3, 5, 9, 8, 6`). Find the length of the longest bitonic subsequence in `arr`.

```
Input:  arr = [1, 7, 3, 5, 9, 8, 6]
Output: 6                            [1, 3, 5, 9, 8, 6]

Input:  arr = [1, 2, 3]
Output: 3                            Already increasing — bitonic with empty descent

Input:  arr = [3, 2, 1]
Output: 3                            Already decreasing — bitonic with empty ascent
```

## The Recurrence

For each peak candidate `i`, the bitonic length through `i` = `LIS_ending_at(i) + LDS_starting_at(i) - 1` (the peak is counted twice). Compute LIS forward and LDS backward; max over all `i`.

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def longest_bitonic_subsequence(self, arr: List[int]) -> int:
        n = len(arr)
        inc = [1] * n                              # Longest increasing subseq ending at i
        dec = [1] * n                              # Longest decreasing subseq starting at i
        for i in range(1, n):
            for j in range(i):
                if arr[i] > arr[j] and inc[j] + 1 > inc[i]:
                    inc[i] = inc[j] + 1
        for i in range(n - 2, -1, -1):
            for j in range(n - 1, i, -1):
                if arr[i] > arr[j] and dec[j] + 1 > dec[i]:
                    dec[i] = dec[j] + 1
        # Peak at i contributes inc[i] + dec[i] - 1 (peak counted twice).
        return max(inc[i] + dec[i] - 1 for i in range(n))


if __name__ == "__main__":
    print(Solution().longest_bitonic_subsequence([1, 7, 3, 5, 9, 8, 6]))   # 6
```

```java,editable
public class Solution {
    public int longestBitonicSubsequence(int[] arr) {
        int n = arr.length;
        int[] inc = new int[n], dec = new int[n];
        java.util.Arrays.fill(inc, 1); java.util.Arrays.fill(dec, 1);
        for (int i = 1; i < n; i++) for (int j = 0; j < i; j++) {
            if (arr[i] > arr[j] && inc[j] + 1 > inc[i]) inc[i] = inc[j] + 1;
        }
        for (int i = n - 2; i >= 0; i--) for (int j = n - 1; j > i; j--) {
            if (arr[i] > arr[j] && dec[j] + 1 > dec[i]) dec[i] = dec[j] + 1;
        }
        int max = 0;
        for (int i = 0; i < n; i++) if (inc[i] + dec[i] - 1 > max) max = inc[i] + dec[i] - 1;
        return max;
    }
}
```

```c,editable
#include <stdio.h>

int inc_arr[1001], dec_arr[1001];

int longest_bitonic_subsequence(const int *arr, int n) {
    for (int i = 0; i < n; i++) { inc_arr[i] = 1; dec_arr[i] = 1; }
    for (int i = 1; i < n; i++) for (int j = 0; j < i; j++) {
        if (arr[i] > arr[j] && inc_arr[j] + 1 > inc_arr[i]) inc_arr[i] = inc_arr[j] + 1;
    }
    for (int i = n - 2; i >= 0; i--) for (int j = n - 1; j > i; j--) {
        if (arr[i] > arr[j] && dec_arr[j] + 1 > dec_arr[i]) dec_arr[i] = dec_arr[j] + 1;
    }
    int best = 0;
    for (int i = 0; i < n; i++) if (inc_arr[i] + dec_arr[i] - 1 > best) best = inc_arr[i] + dec_arr[i] - 1;
    return best;
}

int main(void) {
    int a[] = {1, 7, 3, 5, 9, 8, 6};
    printf("%d\n", longest_bitonic_subsequence(a, 7));   /* 6 */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

class Solution {
public:
    int longestBitonicSubsequence(std::vector<int>& arr) {
        int n = arr.size();
        std::vector<int> inc(n, 1), dec(n, 1);
        for (int i = 1; i < n; i++) for (int j = 0; j < i; j++) {
            if (arr[i] > arr[j] && inc[j] + 1 > inc[i]) inc[i] = inc[j] + 1;
        }
        for (int i = n - 2; i >= 0; i--) for (int j = n - 1; j > i; j--) {
            if (arr[i] > arr[j] && dec[j] + 1 > dec[i]) dec[i] = dec[j] + 1;
        }
        int best = 0;
        for (int i = 0; i < n; i++) if (inc[i] + dec[i] - 1 > best) best = inc[i] + dec[i] - 1;
        return best;
    }
};

int main() {
    std::vector<int> a = {1, 7, 3, 5, 9, 8, 6};
    std::cout << Solution().longestBitonicSubsequence(a) << "\n";   // 6
    return 0;
}
```

```scala,editable
class Solution {
  def longestBitonicSubsequence(arr: Array[Int]): Int = {
    val n = arr.length
    val inc = Array.fill(n)(1); val dec = Array.fill(n)(1)
    for (i <- 1 until n; j <- 0 until i if arr(i) > arr(j) && inc(j) + 1 > inc(i)) inc(i) = inc(j) + 1
    for (i <- n - 2 to 0 by -1; j <- n - 1 to i + 1 by -1 if arr(i) > arr(j) && dec(j) + 1 > dec(i)) dec(i) = dec(j) + 1
    (0 until n).map(i => inc(i) + dec(i) - 1).max
  }
}

object Main extends App {
  println(new Solution().longestBitonicSubsequence(Array(1, 7, 3, 5, 9, 8, 6)))   // 6
}
```

```javascript,editable
class Solution {
    longestBitonicSubsequence(arr) {
        const n = arr.length;
        const inc = new Array(n).fill(1), dec = new Array(n).fill(1);
        for (let i = 1; i < n; i++) for (let j = 0; j < i; j++) {
            if (arr[i] > arr[j] && inc[j] + 1 > inc[i]) inc[i] = inc[j] + 1;
        }
        for (let i = n - 2; i >= 0; i--) for (let j = n - 1; j > i; j--) {
            if (arr[i] > arr[j] && dec[j] + 1 > dec[i]) dec[i] = dec[j] + 1;
        }
        let best = 0;
        for (let i = 0; i < n; i++) if (inc[i] + dec[i] - 1 > best) best = inc[i] + dec[i] - 1;
        return best;
    }
}

console.log(new Solution().longestBitonicSubsequence([1, 7, 3, 5, 9, 8, 6]));   // 6
```

```typescript,editable
class Solution {
    longestBitonicSubsequence(arr: number[]): number {
        const n = arr.length;
        const inc = new Array(n).fill(1), dec = new Array(n).fill(1);
        for (let i = 1; i < n; i++) for (let j = 0; j < i; j++) {
            if (arr[i] > arr[j] && inc[j] + 1 > inc[i]) inc[i] = inc[j] + 1;
        }
        for (let i = n - 2; i >= 0; i--) for (let j = n - 1; j > i; j--) {
            if (arr[i] > arr[j] && dec[j] + 1 > dec[i]) dec[i] = dec[j] + 1;
        }
        let best = 0;
        for (let i = 0; i < n; i++) if (inc[i] + dec[i] - 1 > best) best = inc[i] + dec[i] - 1;
        return best;
    }
}
```

```go,editable
package main

import "fmt"

func longestBitonicSubsequence(arr []int) int {
    n := len(arr)
    inc := make([]int, n); dec := make([]int, n)
    for i := range inc { inc[i] = 1; dec[i] = 1 }
    for i := 1; i < n; i++ { for j := 0; j < i; j++ {
        if arr[i] > arr[j] && inc[j]+1 > inc[i] { inc[i] = inc[j] + 1 }
    } }
    for i := n - 2; i >= 0; i-- { for j := n - 1; j > i; j-- {
        if arr[i] > arr[j] && dec[j]+1 > dec[i] { dec[i] = dec[j] + 1 }
    } }
    best := 0
    for i := 0; i < n; i++ { if inc[i]+dec[i]-1 > best { best = inc[i] + dec[i] - 1 } }
    return best
}

func main() {
    fmt.Println(longestBitonicSubsequence([]int{1, 7, 3, 5, 9, 8, 6}))   // 6
}
```

```kotlin,editable
class Solution {
    fun longestBitonicSubsequence(arr: IntArray): Int {
        val n = arr.size
        val inc = IntArray(n) { 1 }; val dec = IntArray(n) { 1 }
        for (i in 1 until n) for (j in 0 until i) {
            if (arr[i] > arr[j] && inc[j] + 1 > inc[i]) inc[i] = inc[j] + 1
        }
        for (i in n - 2 downTo 0) for (j in n - 1 downTo i + 1) {
            if (arr[i] > arr[j] && dec[j] + 1 > dec[i]) dec[i] = dec[j] + 1
        }
        var best = 0
        for (i in 0 until n) if (inc[i] + dec[i] - 1 > best) best = inc[i] + dec[i] - 1
        return best
    }
}

fun main() {
    println(Solution().longestBitonicSubsequence(intArrayOf(1, 7, 3, 5, 9, 8, 6)))   // 6
}
```

```rust,editable
fn longest_bitonic_subsequence(arr: &[i32]) -> i32 {
    let n = arr.len();
    let mut inc = vec![1i32; n]; let mut dec = vec![1i32; n];
    for i in 1..n { for j in 0..i {
        if arr[i] > arr[j] && inc[j] + 1 > inc[i] { inc[i] = inc[j] + 1; }
    } }
    for i in (0..n - 1).rev() { for j in (i + 1..n).rev() {
        if arr[i] > arr[j] && dec[j] + 1 > dec[i] { dec[i] = dec[j] + 1; }
    } }
    let mut best = 0;
    for i in 0..n { if inc[i] + dec[i] - 1 > best { best = inc[i] + dec[i] - 1; } }
    best
}

fn main() {
    println!("{}", longest_bitonic_subsequence(&[1, 7, 3, 5, 9, 8, 6]));   // 6
}
```

</div>

***

# Longest Alternating Subsequence

> **Pattern:** LIS-style 2D DP — track parity of last move

## The Problem

An *alternating* subsequence has neighbours that strictly alternate up/down (`a < b > c < d`, etc.). Find the length of the longest alternating subsequence in `arr`.

```
Input:  arr = [1, 7, 3, 5, 4, 8, 6]
Output: 7                          The whole array is alternating

Input:  arr = [1, 4, 5, 3]
Output: 3                          [1, 4, 3] or [1, 5, 3]

Input:  arr = [3, 2, 1]
Output: 2                          Just [3, 2] or [2, 1]
```

## The Recurrence

`dp[i][0]` = longest alternating subseq ending at `i` with the last move being a *decrease*. `dp[i][1]` = ending at `i` with last move *increase*. Both initialise to 1.

For each `i`, scan all `j < i`:
- `arr[j] < arr[i]` → extending an "ending in decrease" subseq with an increase: `dp[i][1] = max(dp[i][1], dp[j][0] + 1)`.
- `arr[j] > arr[i]` → extending an "ending in increase" subseq with a decrease: `dp[i][0] = max(dp[i][0], dp[j][1] + 1)`.

Answer: max over `i` of `max(dp[i][0], dp[i][1])`.

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def longest_alternating_subsequence(self, arr: List[int]) -> int:
        n = len(arr)
        if n <= 1:
            return n
        # dp[i][0]: ending at i, last move was a decrease.
        # dp[i][1]: ending at i, last move was an increase.
        dp = [[1, 1] for _ in range(n)]
        best = 1
        for i in range(1, n):
            for j in range(i):
                if arr[j] < arr[i]:
                    dp[i][1] = max(dp[i][1], dp[j][0] + 1)
                elif arr[j] > arr[i]:
                    dp[i][0] = max(dp[i][0], dp[j][1] + 1)
            best = max(best, dp[i][0], dp[i][1])
        return best


if __name__ == "__main__":
    print(Solution().longest_alternating_subsequence([1, 7, 3, 5, 4, 8, 6]))   # 7
```

```java,editable
public class Solution {
    public int longestAlternatingSubsequence(int[] arr) {
        int n = arr.length;
        if (n <= 1) return n;
        int[][] dp = new int[n][2];
        for (int i = 0; i < n; i++) { dp[i][0] = 1; dp[i][1] = 1; }
        int best = 1;
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (arr[j] < arr[i]) dp[i][1] = Math.max(dp[i][1], dp[j][0] + 1);
                else if (arr[j] > arr[i]) dp[i][0] = Math.max(dp[i][0], dp[j][1] + 1);
            }
            best = Math.max(best, Math.max(dp[i][0], dp[i][1]));
        }
        return best;
    }
}
```

```c,editable
#include <stdio.h>

int dp[1001][2];

int longest_alternating_subsequence(const int *arr, int n) {
    if (n <= 1) return n;
    for (int i = 0; i < n; i++) { dp[i][0] = 1; dp[i][1] = 1; }
    int best = 1;
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (arr[j] < arr[i] && dp[j][0] + 1 > dp[i][1]) dp[i][1] = dp[j][0] + 1;
            else if (arr[j] > arr[i] && dp[j][1] + 1 > dp[i][0]) dp[i][0] = dp[j][1] + 1;
        }
        if (dp[i][0] > best) best = dp[i][0];
        if (dp[i][1] > best) best = dp[i][1];
    }
    return best;
}

int main(void) {
    int a[] = {1, 7, 3, 5, 4, 8, 6};
    printf("%d\n", longest_alternating_subsequence(a, 7));   /* 7 */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <algorithm>

class Solution {
public:
    int longestAlternatingSubsequence(std::vector<int>& arr) {
        int n = arr.size();
        if (n <= 1) return n;
        std::vector<std::vector<int>> dp(n, std::vector<int>(2, 1));
        int best = 1;
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (arr[j] < arr[i]) dp[i][1] = std::max(dp[i][1], dp[j][0] + 1);
                else if (arr[j] > arr[i]) dp[i][0] = std::max(dp[i][0], dp[j][1] + 1);
            }
            best = std::max(best, std::max(dp[i][0], dp[i][1]));
        }
        return best;
    }
};

int main() {
    std::vector<int> a = {1, 7, 3, 5, 4, 8, 6};
    std::cout << Solution().longestAlternatingSubsequence(a) << "\n";   // 7
    return 0;
}
```

```scala,editable
class Solution {
  def longestAlternatingSubsequence(arr: Array[Int]): Int = {
    val n = arr.length
    if (n <= 1) return n
    val dp = Array.fill(n, 2)(1)
    var best = 1
    for (i <- 1 until n) {
      for (j <- 0 until i) {
        if (arr(j) < arr(i)) dp(i)(1) = math.max(dp(i)(1), dp(j)(0) + 1)
        else if (arr(j) > arr(i)) dp(i)(0) = math.max(dp(i)(0), dp(j)(1) + 1)
      }
      best = math.max(best, math.max(dp(i)(0), dp(i)(1)))
    }
    best
  }
}

object Main extends App {
  println(new Solution().longestAlternatingSubsequence(Array(1, 7, 3, 5, 4, 8, 6)))   // 7
}
```

```javascript,editable
class Solution {
    longestAlternatingSubsequence(arr) {
        const n = arr.length;
        if (n <= 1) return n;
        const dp = Array.from({length: n}, () => [1, 1]);
        let best = 1;
        for (let i = 1; i < n; i++) {
            for (let j = 0; j < i; j++) {
                if (arr[j] < arr[i]) dp[i][1] = Math.max(dp[i][1], dp[j][0] + 1);
                else if (arr[j] > arr[i]) dp[i][0] = Math.max(dp[i][0], dp[j][1] + 1);
            }
            best = Math.max(best, dp[i][0], dp[i][1]);
        }
        return best;
    }
}

console.log(new Solution().longestAlternatingSubsequence([1, 7, 3, 5, 4, 8, 6]));   // 7
```

```typescript,editable
class Solution {
    longestAlternatingSubsequence(arr: number[]): number {
        const n = arr.length;
        if (n <= 1) return n;
        const dp: number[][] = Array.from({length: n}, () => [1, 1]);
        let best = 1;
        for (let i = 1; i < n; i++) {
            for (let j = 0; j < i; j++) {
                if (arr[j] < arr[i]) dp[i][1] = Math.max(dp[i][1], dp[j][0] + 1);
                else if (arr[j] > arr[i]) dp[i][0] = Math.max(dp[i][0], dp[j][1] + 1);
            }
            best = Math.max(best, dp[i][0], dp[i][1]);
        }
        return best;
    }
}
```

```go,editable
package main

import "fmt"

func longestAlternatingSubsequence(arr []int) int {
    n := len(arr)
    if n <= 1 { return n }
    dp := make([][2]int, n)
    for i := range dp { dp[i] = [2]int{1, 1} }
    best := 1
    for i := 1; i < n; i++ {
        for j := 0; j < i; j++ {
            if arr[j] < arr[i] && dp[j][0]+1 > dp[i][1] { dp[i][1] = dp[j][0] + 1 }
            if arr[j] > arr[i] && dp[j][1]+1 > dp[i][0] { dp[i][0] = dp[j][1] + 1 }
        }
        if dp[i][0] > best { best = dp[i][0] }
        if dp[i][1] > best { best = dp[i][1] }
    }
    return best
}

func main() {
    fmt.Println(longestAlternatingSubsequence([]int{1, 7, 3, 5, 4, 8, 6}))   // 7
}
```

```kotlin,editable
class Solution {
    fun longestAlternatingSubsequence(arr: IntArray): Int {
        val n = arr.size
        if (n <= 1) return n
        val dp = Array(n) { IntArray(2) { 1 } }
        var best = 1
        for (i in 1 until n) {
            for (j in 0 until i) {
                if (arr[j] < arr[i]) dp[i][1] = maxOf(dp[i][1], dp[j][0] + 1)
                else if (arr[j] > arr[i]) dp[i][0] = maxOf(dp[i][0], dp[j][1] + 1)
            }
            best = maxOf(best, dp[i][0], dp[i][1])
        }
        return best
    }
}

fun main() {
    println(Solution().longestAlternatingSubsequence(intArrayOf(1, 7, 3, 5, 4, 8, 6)))   // 7
}
```

```rust,editable
fn longest_alternating_subsequence(arr: &[i32]) -> i32 {
    let n = arr.len();
    if n <= 1 { return n as i32; }
    let mut dp = vec![[1i32, 1]; n];
    let mut best = 1;
    for i in 1..n {
        for j in 0..i {
            if arr[j] < arr[i] && dp[j][0] + 1 > dp[i][1] { dp[i][1] = dp[j][0] + 1; }
            else if arr[j] > arr[i] && dp[j][1] + 1 > dp[i][0] { dp[i][0] = dp[j][1] + 1; }
        }
        if dp[i][0] > best { best = dp[i][0]; }
        if dp[i][1] > best { best = dp[i][1]; }
    }
    best
}

fn main() {
    println!("{}", longest_alternating_subsequence(&[1, 7, 3, 5, 4, 8, 6]));   // 7
}
```

</div>

***

# Pattern as Subsequence

> **Pattern:** Edit-distance pattern — count of subsequence matches

## The Problem

Given strings `s` and `pattern`, count the number of *distinct* subsequences of `s` that equal `pattern`.

```
Input:  s = "abacdebgc", pattern = "abc"
Output: 4

Input:  s = "xyzabc", pattern = "xzc"
Output: 1

Input:  s = "abc", pattern = "def"
Output: 0
```

## The Recurrence

`dp[i][j]` = ways to form `pattern[0..i-1]` as a subsequence of `s[0..j-1]`. Two cases:
- `pattern[i-1] == s[j-1]`: include the match (`dp[i-1][j-1]`) or skip `s[j-1]` (`dp[i][j-1]`). Sum.
- Else: `dp[i][j] = dp[i][j-1]`.

Base case: `dp[0][j] = 1` for all `j` — there's exactly one way to form the empty pattern (pick nothing).

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def pattern_as_subsequence(self, s: str, pattern: str) -> int:
        n, m = len(s), len(pattern)
        dp: List[List[int]] = [[0] * (n + 1) for _ in range(m + 1)]
        for j in range(n + 1):
            dp[0][j] = 1                            # Empty pattern: one way (pick nothing)
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if pattern[i - 1] == s[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + dp[i][j - 1]
                else:
                    dp[i][j] = dp[i][j - 1]
        return dp[m][n]


if __name__ == "__main__":
    print(Solution().pattern_as_subsequence("abacdebgc", "abc"))   # 4
```

```java,editable
public class Solution {
    public int patternAsSubsequence(String s, String pattern) {
        int n = s.length(), m = pattern.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int j = 0; j <= n; j++) dp[0][j] = 1;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (pattern.charAt(i - 1) == s.charAt(j - 1))
                    dp[i][j] = dp[i - 1][j - 1] + dp[i][j - 1];
                else
                    dp[i][j] = dp[i][j - 1];
            }
        }
        return dp[m][n];
    }
}
```

```c,editable
#include <stdio.h>
#include <string.h>

int dp[1001][1001];

int pattern_as_subsequence(const char *s, const char *pattern) {
    int n = strlen(s), m = strlen(pattern);
    for (int i = 0; i <= m; i++) for (int j = 0; j <= n; j++) dp[i][j] = 0;
    for (int j = 0; j <= n; j++) dp[0][j] = 1;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (pattern[i - 1] == s[j - 1]) dp[i][j] = dp[i - 1][j - 1] + dp[i][j - 1];
            else dp[i][j] = dp[i][j - 1];
        }
    }
    return dp[m][n];
}

int main(void) {
    printf("%d\n", pattern_as_subsequence("abacdebgc", "abc"));   /* 4 */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <string>
#include <vector>

class Solution {
public:
    int patternAsSubsequence(std::string s, std::string pattern) {
        int n = s.size(), m = pattern.size();
        std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));
        for (int j = 0; j <= n; j++) dp[0][j] = 1;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (pattern[i - 1] == s[j - 1]) dp[i][j] = dp[i - 1][j - 1] + dp[i][j - 1];
                else dp[i][j] = dp[i][j - 1];
            }
        }
        return dp[m][n];
    }
};

int main() {
    std::cout << Solution().patternAsSubsequence("abacdebgc", "abc") << "\n";   // 4
    return 0;
}
```

```scala,editable
class Solution {
  def patternAsSubsequence(s: String, pattern: String): Int = {
    val n = s.length; val m = pattern.length
    val dp = Array.fill(m + 1, n + 1)(0)
    for (j <- 0 to n) dp(0)(j) = 1
    for (i <- 1 to m; j <- 1 to n) {
      dp(i)(j) = if (pattern(i - 1) == s(j - 1)) dp(i - 1)(j - 1) + dp(i)(j - 1) else dp(i)(j - 1)
    }
    dp(m)(n)
  }
}

object Main extends App {
  println(new Solution().patternAsSubsequence("abacdebgc", "abc"))   // 4
}
```

```javascript,editable
class Solution {
    patternAsSubsequence(s, pattern) {
        const n = s.length, m = pattern.length;
        const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));
        for (let j = 0; j <= n; j++) dp[0][j] = 1;
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                dp[i][j] = pattern[i - 1] === s[j - 1] ? dp[i - 1][j - 1] + dp[i][j - 1] : dp[i][j - 1];
            }
        }
        return dp[m][n];
    }
}

console.log(new Solution().patternAsSubsequence("abacdebgc", "abc"));   // 4
```

```typescript,editable
class Solution {
    patternAsSubsequence(s: string, pattern: string): number {
        const n = s.length, m = pattern.length;
        const dp: number[][] = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));
        for (let j = 0; j <= n; j++) dp[0][j] = 1;
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                dp[i][j] = pattern[i - 1] === s[j - 1] ? dp[i - 1][j - 1] + dp[i][j - 1] : dp[i][j - 1];
            }
        }
        return dp[m][n];
    }
}
```

```go,editable
package main

import "fmt"

func patternAsSubsequence(s, pattern string) int {
    n := len(s); m := len(pattern)
    dp := make([][]int, m+1)
    for i := range dp { dp[i] = make([]int, n+1) }
    for j := 0; j <= n; j++ { dp[0][j] = 1 }
    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if pattern[i-1] == s[j-1] { dp[i][j] = dp[i-1][j-1] + dp[i][j-1] } else { dp[i][j] = dp[i][j-1] }
        }
    }
    return dp[m][n]
}

func main() {
    fmt.Println(patternAsSubsequence("abacdebgc", "abc"))   // 4
}
```

```kotlin,editable
class Solution {
    fun patternAsSubsequence(s: String, pattern: String): Int {
        val n = s.length; val m = pattern.length
        val dp = Array(m + 1) { IntArray(n + 1) }
        for (j in 0..n) dp[0][j] = 1
        for (i in 1..m) {
            for (j in 1..n) {
                dp[i][j] = if (pattern[i - 1] == s[j - 1]) dp[i - 1][j - 1] + dp[i][j - 1] else dp[i][j - 1]
            }
        }
        return dp[m][n]
    }
}

fun main() {
    println(Solution().patternAsSubsequence("abacdebgc", "abc"))   // 4
}
```

```rust,editable
fn pattern_as_subsequence(s: &str, pattern: &str) -> i64 {
    let s = s.as_bytes(); let p = pattern.as_bytes();
    let n = s.len(); let m = p.len();
    let mut dp = vec![vec![0i64; n + 1]; m + 1];
    for j in 0..=n { dp[0][j] = 1; }
    for i in 1..=m {
        for j in 1..=n {
            dp[i][j] = if p[i - 1] == s[j - 1] { dp[i - 1][j - 1] + dp[i][j - 1] } else { dp[i][j - 1] };
        }
    }
    dp[m][n]
}

fn main() {
    println!("{}", pattern_as_subsequence("abacdebgc", "abc"));   // 4
}
```

</div>

***

# Shortest Common Supersequence

> **Pattern:** Edit-distance pattern — minimum-length supersequence

## The Problem

Given two strings, return the *length* of the shortest string that contains both as subsequences.

```
Input:  s1 = "abc", s2 = "abe"
Output: 4                          E.g. "abce"

Input:  s1 = "lmn", s2 = "opq"
Output: 6                          No shared chars; concat works

Input:  s1 = "aab", s2 = "aab"
Output: 3                          They're identical
```

## The Recurrence

`dp[i][j]` = length of the shortest common supersequence of `s1[0..i-1]` and `s2[0..j-1]`. Match keeps both characters once; mismatch grows by one (forced to take one or the other):
```
dp[i][j] = dp[i-1][j-1] + 1                     if s1[i-1] == s2[j-1]
         = min(dp[i-1][j], dp[i][j-1]) + 1      otherwise
```
Base cases: `dp[i][0] = i`, `dp[0][j] = j` (an empty side forces taking everything from the other).

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def shortest_common_supersequence(self, s1: str, s2: str) -> int:
        n, m = len(s1), len(s2)
        dp: List[List[int]] = [[0] * (m + 1) for _ in range(n + 1)]
        for i in range(n + 1): dp[i][0] = i
        for j in range(m + 1): dp[0][j] = j
        for i in range(1, n + 1):
            for j in range(1, m + 1):
                if s1[i - 1] == s2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = min(dp[i - 1][j], dp[i][j - 1]) + 1
        return dp[n][m]


if __name__ == "__main__":
    print(Solution().shortest_common_supersequence("abc", "abe"))   # 4
```

```java,editable
public class Solution {
    public int shortestCommonSupersequence(String s1, String s2) {
        int n = s1.length(), m = s2.length();
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 0; i <= n; i++) dp[i][0] = i;
        for (int j = 0; j <= m; j++) dp[0][j] = j;
        for (int i = 1; i <= n; i++) for (int j = 1; j <= m; j++) {
            if (s1.charAt(i - 1) == s2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + 1;
        }
        return dp[n][m];
    }
}
```

```c,editable
#include <stdio.h>
#include <string.h>

int dp[1001][1001];

int shortest_common_supersequence(const char *s1, const char *s2) {
    int n = strlen(s1), m = strlen(s2);
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++) for (int j = 1; j <= m; j++) {
        if (s1[i - 1] == s2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
        else { int a = dp[i - 1][j], b = dp[i][j - 1]; dp[i][j] = (a < b ? a : b) + 1; }
    }
    return dp[n][m];
}

int main(void) {
    printf("%d\n", shortest_common_supersequence("abc", "abe"));   /* 4 */
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
    int shortestCommonSupersequence(std::string s1, std::string s2) {
        int n = s1.size(), m = s2.size();
        std::vector<std::vector<int>> dp(n + 1, std::vector<int>(m + 1, 0));
        for (int i = 0; i <= n; i++) dp[i][0] = i;
        for (int j = 0; j <= m; j++) dp[0][j] = j;
        for (int i = 1; i <= n; i++) for (int j = 1; j <= m; j++) {
            if (s1[i - 1] == s2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = std::min(dp[i - 1][j], dp[i][j - 1]) + 1;
        }
        return dp[n][m];
    }
};

int main() {
    std::cout << Solution().shortestCommonSupersequence("abc", "abe") << "\n";   // 4
    return 0;
}
```

```scala,editable
class Solution {
  def shortestCommonSupersequence(s1: String, s2: String): Int = {
    val n = s1.length; val m = s2.length
    val dp = Array.fill(n + 1, m + 1)(0)
    for (i <- 0 to n) dp(i)(0) = i
    for (j <- 0 to m) dp(0)(j) = j
    for (i <- 1 to n; j <- 1 to m) {
      dp(i)(j) = if (s1(i - 1) == s2(j - 1)) dp(i - 1)(j - 1) + 1
                 else math.min(dp(i - 1)(j), dp(i)(j - 1)) + 1
    }
    dp(n)(m)
  }
}

object Main extends App {
  println(new Solution().shortestCommonSupersequence("abc", "abe"))   // 4
}
```

```javascript,editable
class Solution {
    shortestCommonSupersequence(s1, s2) {
        const n = s1.length, m = s2.length;
        const dp = Array.from({length: n + 1}, () => new Array(m + 1).fill(0));
        for (let i = 0; i <= n; i++) dp[i][0] = i;
        for (let j = 0; j <= m; j++) dp[0][j] = j;
        for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
            dp[i][j] = s1[i - 1] === s2[j - 1] ? dp[i - 1][j - 1] + 1 : Math.min(dp[i - 1][j], dp[i][j - 1]) + 1;
        }
        return dp[n][m];
    }
}

console.log(new Solution().shortestCommonSupersequence("abc", "abe"));   // 4
```

```typescript,editable
class Solution {
    shortestCommonSupersequence(s1: string, s2: string): number {
        const n = s1.length, m = s2.length;
        const dp: number[][] = Array.from({length: n + 1}, () => new Array(m + 1).fill(0));
        for (let i = 0; i <= n; i++) dp[i][0] = i;
        for (let j = 0; j <= m; j++) dp[0][j] = j;
        for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
            dp[i][j] = s1[i - 1] === s2[j - 1] ? dp[i - 1][j - 1] + 1 : Math.min(dp[i - 1][j], dp[i][j - 1]) + 1;
        }
        return dp[n][m];
    }
}
```

```go,editable
package main

import "fmt"

func shortestCommonSupersequence(s1, s2 string) int {
    n, m := len(s1), len(s2)
    dp := make([][]int, n+1)
    for i := range dp { dp[i] = make([]int, m+1) }
    for i := 0; i <= n; i++ { dp[i][0] = i }
    for j := 0; j <= m; j++ { dp[0][j] = j }
    for i := 1; i <= n; i++ { for j := 1; j <= m; j++ {
        if s1[i-1] == s2[j-1] { dp[i][j] = dp[i-1][j-1] + 1
        } else { a, b := dp[i-1][j], dp[i][j-1]; if a < b { dp[i][j] = a + 1 } else { dp[i][j] = b + 1 } }
    } }
    return dp[n][m]
}

func main() {
    fmt.Println(shortestCommonSupersequence("abc", "abe"))   // 4
}
```

```kotlin,editable
class Solution {
    fun shortestCommonSupersequence(s1: String, s2: String): Int {
        val n = s1.length; val m = s2.length
        val dp = Array(n + 1) { IntArray(m + 1) }
        for (i in 0..n) dp[i][0] = i
        for (j in 0..m) dp[0][j] = j
        for (i in 1..n) for (j in 1..m) {
            dp[i][j] = if (s1[i - 1] == s2[j - 1]) dp[i - 1][j - 1] + 1
                       else minOf(dp[i - 1][j], dp[i][j - 1]) + 1
        }
        return dp[n][m]
    }
}

fun main() {
    println(Solution().shortestCommonSupersequence("abc", "abe"))   // 4
}
```

```rust,editable
fn shortest_common_supersequence(s1: &str, s2: &str) -> i32 {
    let s1 = s1.as_bytes(); let s2 = s2.as_bytes();
    let n = s1.len(); let m = s2.len();
    let mut dp = vec![vec![0i32; m + 1]; n + 1];
    for i in 0..=n { dp[i][0] = i as i32; }
    for j in 0..=m { dp[0][j] = j as i32; }
    for i in 1..=n {
        for j in 1..=m {
            dp[i][j] = if s1[i - 1] == s2[j - 1] { dp[i - 1][j - 1] + 1 }
                       else { dp[i - 1][j].min(dp[i][j - 1]) + 1 };
        }
    }
    dp[n][m]
}

fn main() {
    println!("{}", shortest_common_supersequence("abc", "abe"));   // 4
}
```

</div>

***

# Longest Repeated Subsequence

> **Pattern:** LCS variant — string compared with itself, off-diagonal

## The Problem

Find the longest subsequence of `s` that appears at least *twice* using disjoint indices (the two occurrences must use different positions in `s`).

```
Input:  s = "abxcdalbc"
Output: "abc"                The "abc" appears as positions [0, 1, 4] AND [0, 1, 8] — wait, those overlap.
                             Actually: position [0, 1, 4] for first, [5, 6, 8] for second — disjoint indices.

Input:  s = "xyzlynkz"
Output: "yz"

Input:  s = "abbcc"
Output: "bc"
```

## The Recurrence

Compute LCS of `s` with itself, but require `i != j` to enforce disjoint positions:
```
dp[i][j] = dp[i-1][j-1] + 1               if s[i-1] == s[j-1] AND i != j
         = max(dp[i-1][j], dp[i][j-1])    otherwise
```
Then backtrack to reconstruct the subsequence string.

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def longest_repeated_subsequence(self, s: str) -> str:
        n = len(s)
        dp: List[List[int]] = [[0] * (n + 1) for _ in range(n + 1)]
        for i in range(1, n + 1):
            for j in range(1, n + 1):
                if s[i - 1] == s[j - 1] and i != j:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        # Backtrack to reconstruct the subsequence.
        i, j = n, n
        chars: List[str] = []
        while i > 0 and j > 0:
            if dp[i][j] == dp[i - 1][j - 1] + 1 and s[i - 1] == s[j - 1] and i != j:
                chars.append(s[i - 1])
                i -= 1; j -= 1
            elif dp[i - 1][j] >= dp[i][j - 1]:
                i -= 1
            else:
                j -= 1
        return ''.join(reversed(chars))


if __name__ == "__main__":
    print(Solution().longest_repeated_subsequence("abxcdalbc"))   # "abc"
```

```java,editable
public class Solution {
    public String longestRepeatedSubsequence(String s) {
        int n = s.length();
        int[][] dp = new int[n + 1][n + 1];
        for (int i = 1; i <= n; i++) for (int j = 1; j <= n; j++) {
            if (s.charAt(i - 1) == s.charAt(j - 1) && i != j) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
        StringBuilder sb = new StringBuilder();
        int i = n, j = n;
        while (i > 0 && j > 0) {
            if (s.charAt(i - 1) == s.charAt(j - 1) && i != j && dp[i][j] == dp[i - 1][j - 1] + 1) {
                sb.append(s.charAt(i - 1)); i--; j--;
            } else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
            else j--;
        }
        return sb.reverse().toString();
    }
}
```

```c,editable
#include <stdio.h>
#include <string.h>

int dp[501][501];
char out[501];

const char *longest_repeated_subsequence(const char *s) {
    int n = strlen(s);
    for (int i = 0; i <= n; i++) for (int j = 0; j <= n; j++) dp[i][j] = 0;
    for (int i = 1; i <= n; i++) for (int j = 1; j <= n; j++) {
        if (s[i - 1] == s[j - 1] && i != j) dp[i][j] = dp[i - 1][j - 1] + 1;
        else { int a = dp[i - 1][j], b = dp[i][j - 1]; dp[i][j] = a > b ? a : b; }
    }
    int i = n, j = n, k = 0;
    while (i > 0 && j > 0) {
        if (s[i - 1] == s[j - 1] && i != j && dp[i][j] == dp[i - 1][j - 1] + 1) {
            out[k++] = s[i - 1]; i--; j--;
        } else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
        else j--;
    }
    out[k] = 0;
    /* reverse */
    for (int a = 0, b = k - 1; a < b; a++, b--) { char t = out[a]; out[a] = out[b]; out[b] = t; }
    return out;
}

int main(void) {
    printf("%s\n", longest_repeated_subsequence("abxcdalbc"));   /* abc */
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
    std::string longestRepeatedSubsequence(std::string s) {
        int n = s.size();
        std::vector<std::vector<int>> dp(n + 1, std::vector<int>(n + 1, 0));
        for (int i = 1; i <= n; i++) for (int j = 1; j <= n; j++) {
            if (s[i - 1] == s[j - 1] && i != j) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);
        }
        std::string lrs;
        int i = n, j = n;
        while (i > 0 && j > 0) {
            if (s[i - 1] == s[j - 1] && i != j && dp[i][j] == dp[i - 1][j - 1] + 1) {
                lrs.push_back(s[i - 1]); i--; j--;
            } else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
            else j--;
        }
        std::reverse(lrs.begin(), lrs.end());
        return lrs;
    }
};

int main() {
    std::cout << Solution().longestRepeatedSubsequence("abxcdalbc") << "\n";   // abc
    return 0;
}
```

```scala,editable
class Solution {
  def longestRepeatedSubsequence(s: String): String = {
    val n = s.length
    val dp = Array.fill(n + 1, n + 1)(0)
    for (i <- 1 to n; j <- 1 to n) {
      dp(i)(j) = if (s(i - 1) == s(j - 1) && i != j) dp(i - 1)(j - 1) + 1
                 else math.max(dp(i - 1)(j), dp(i)(j - 1))
    }
    val sb = new StringBuilder
    var i = n; var j = n
    while (i > 0 && j > 0) {
      if (s(i - 1) == s(j - 1) && i != j && dp(i)(j) == dp(i - 1)(j - 1) + 1) {
        sb.append(s(i - 1)); i -= 1; j -= 1
      } else if (dp(i - 1)(j) >= dp(i)(j - 1)) i -= 1
      else j -= 1
    }
    sb.reverse.toString
  }
}

object Main extends App {
  println(new Solution().longestRepeatedSubsequence("abxcdalbc"))   // abc
}
```

```javascript,editable
class Solution {
    longestRepeatedSubsequence(s) {
        const n = s.length;
        const dp = Array.from({length: n + 1}, () => new Array(n + 1).fill(0));
        for (let i = 1; i <= n; i++) for (let j = 1; j <= n; j++) {
            if (s[i - 1] === s[j - 1] && i !== j) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
        let i = n, j = n;
        const chars = [];
        while (i > 0 && j > 0) {
            if (s[i - 1] === s[j - 1] && i !== j && dp[i][j] === dp[i - 1][j - 1] + 1) {
                chars.push(s[i - 1]); i--; j--;
            } else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
            else j--;
        }
        return chars.reverse().join('');
    }
}

console.log(new Solution().longestRepeatedSubsequence("abxcdalbc"));   // abc
```

```typescript,editable
class Solution {
    longestRepeatedSubsequence(s: string): string {
        const n = s.length;
        const dp: number[][] = Array.from({length: n + 1}, () => new Array(n + 1).fill(0));
        for (let i = 1; i <= n; i++) for (let j = 1; j <= n; j++) {
            if (s[i - 1] === s[j - 1] && i !== j) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
        let i = n, j = n;
        const chars: string[] = [];
        while (i > 0 && j > 0) {
            if (s[i - 1] === s[j - 1] && i !== j && dp[i][j] === dp[i - 1][j - 1] + 1) {
                chars.push(s[i - 1]); i--; j--;
            } else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
            else j--;
        }
        return chars.reverse().join('');
    }
}
```

```go,editable
package main

import "fmt"

func longestRepeatedSubsequence(s string) string {
    n := len(s)
    dp := make([][]int, n+1)
    for i := range dp { dp[i] = make([]int, n+1) }
    for i := 1; i <= n; i++ { for j := 1; j <= n; j++ {
        if s[i-1] == s[j-1] && i != j { dp[i][j] = dp[i-1][j-1] + 1
        } else { a, b := dp[i-1][j], dp[i][j-1]; if a > b { dp[i][j] = a } else { dp[i][j] = b } }
    } }
    var chars []byte
    i, j := n, n
    for i > 0 && j > 0 {
        if s[i-1] == s[j-1] && i != j && dp[i][j] == dp[i-1][j-1]+1 {
            chars = append(chars, s[i-1]); i--; j--
        } else if dp[i-1][j] >= dp[i][j-1] { i-- } else { j-- }
    }
    for l, r := 0, len(chars)-1; l < r; l, r = l+1, r-1 { chars[l], chars[r] = chars[r], chars[l] }
    return string(chars)
}

func main() {
    fmt.Println(longestRepeatedSubsequence("abxcdalbc"))   // abc
}
```

```kotlin,editable
class Solution {
    fun longestRepeatedSubsequence(s: String): String {
        val n = s.length
        val dp = Array(n + 1) { IntArray(n + 1) }
        for (i in 1..n) for (j in 1..n) {
            dp[i][j] = if (s[i - 1] == s[j - 1] && i != j) dp[i - 1][j - 1] + 1
                       else maxOf(dp[i - 1][j], dp[i][j - 1])
        }
        val sb = StringBuilder()
        var i = n; var j = n
        while (i > 0 && j > 0) {
            if (s[i - 1] == s[j - 1] && i != j && dp[i][j] == dp[i - 1][j - 1] + 1) {
                sb.append(s[i - 1]); i--; j--
            } else if (dp[i - 1][j] >= dp[i][j - 1]) i--
            else j--
        }
        return sb.reverse().toString()
    }
}

fun main() {
    println(Solution().longestRepeatedSubsequence("abxcdalbc"))   // abc
}
```

```rust,editable
fn longest_repeated_subsequence(s: &str) -> String {
    let bytes = s.as_bytes();
    let n = bytes.len();
    let mut dp = vec![vec![0i32; n + 1]; n + 1];
    for i in 1..=n {
        for j in 1..=n {
            dp[i][j] = if bytes[i - 1] == bytes[j - 1] && i != j { dp[i - 1][j - 1] + 1 }
                       else { dp[i - 1][j].max(dp[i][j - 1]) };
        }
    }
    let mut chars: Vec<u8> = Vec::new();
    let (mut i, mut j) = (n, n);
    while i > 0 && j > 0 {
        if bytes[i - 1] == bytes[j - 1] && i != j && dp[i][j] == dp[i - 1][j - 1] + 1 {
            chars.push(bytes[i - 1]); i -= 1; j -= 1;
        } else if dp[i - 1][j] >= dp[i][j - 1] { i -= 1; }
        else { j -= 1; }
    }
    chars.reverse();
    String::from_utf8(chars).unwrap()
}

fn main() {
    println!("{}", longest_repeated_subsequence("abxcdalbc"));   // abc
}
```

</div>

***

# Final Takeaway

These seven problems map onto the patterns the entire section built:

| Problem | Pattern |
|---|---|
| Covering distance | Linear DP, count-aggregator |
| Reachability check | Linear DP, boolean |
| Longest bitonic subsequence | LIS twice (forward + backward) |
| Longest alternating subsequence | LIS-style 2D state on parity |
| Pattern as subsequence | Edit-distance pattern, count |
| Shortest common supersequence | Edit-distance pattern, min-length |
| Longest repeated subsequence | LCS variant on `s` vs `s`, off-diagonal |

If you wrote even five of these correctly without looking at the solution, you've internalised what this section was teaching. The rest is pattern-matching practice — and the more problems you see, the faster the recognition becomes. The DP archetypes don't expand much past what we've covered: linear, interval, prefix-keyed, knapsack, grid, prefix-sum, and adversarial-game DP cover the vast majority of polynomial-time decision and optimisation problems on sequences and grids.

**You didn't just complete a chapter on dynamic programming. You learned that DP is a *toolkit*, not a single technique — half a dozen recurrence shapes that recombine endlessly. Every new DP problem you'll encounter is a remix of these primitives, with one or two twists. Spot the family, identify the state, choose the aggregator, and the recurrence assembles itself. That recognition reflex — built one lesson at a time — is the skill that makes someone a strong dynamic-programming thinker for life.**

The next sections in this DSA series move beyond DP — bit manipulation, advanced graph algorithms, string matching automata. Bring the same pattern-recognition habit there, and the learning curve flattens dramatically.
