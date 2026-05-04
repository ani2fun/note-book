# 11. Pattern: Maximum Predicate Search

The dual of the Minimum Predicate Search Pattern lesson. Where the previous pattern found the *minimum* value satisfying a predicate (false-then-true), this pattern finds the *maximum* value satisfying one (true-then-false). The algorithm is the mirror image — same binary search shell, flipped predicate direction.

By the end of this lesson you'll know the diagnostic checks, the canonical "maximum-x-with-P-true" template, and four worked problems: integer square root, staircase building, ribbon cutting, and water equalisation.

## Table of contents

1. [Identifying the pattern](#identifying-the-pattern)
2. [Calculate square root](#calculate-square-root)
3. [Build staircase](#build-staircase)
4. [K ribbons](#k-ribbons)
5. [Equalise water](#equalise-water)

***

# Identifying the Pattern

| # | Question | If "yes," the pattern fits because... |
|---|---|---|
| **Q1** | We're optimizing for the *maximum* value satisfying a constraint? | Binary search finds the flip point. |
| **Q2** | The constraint is *monotonic* — if `x` works, then `x − 1` also works? | Required for predicate to have a unique flip. |
| **Q3** | Predicate evaluable in `O(f(n))`? | Total cost: `O(f(n) · log range)`. |

---

## The Template

The *upper* form differs from minimum-predicate-search in two ways:
1. The mid calculation uses `low + (high - low + 1) / 2` to avoid infinite loops when `low` and `high` are adjacent.
2. The successful predicate moves `low = mid` (not `high = mid`); the failure moves `high = mid - 1`.

```python,editable
def max_predicate_search(low, high, predicate):
    while low < high:
        mid = low + (high - low + 1) // 2          # +1 ensures mid != low when adjacent
        if predicate(mid):                          # mid works → try larger
            low = mid
        else:                                        # mid doesn't work → try smaller
            high = mid - 1
    return low
```

The `+ 1` in the mid calculation is the key fix. Without it, when `low = high - 1` and the predicate is true at `mid = low`, we'd set `low = low` and loop forever.

---

# Calculate Square Root

## The Problem

Given a non-negative integer `num`, return its integer square root (floor).

```
Input:  num = 4
Output: 2

Input:  num = 5
Output: 2

Input:  num = 50
Output: 7
```

## The Solution

Binary-search `x` in `[1, num]`. Predicate: `x * x <= num` (use `x <= num / x` to avoid overflow).

<div class="lang-tabs">

```python,editable
class Solution:
    def calculate_square_root(self, num: int) -> int:
        if num == 0: return 0
        low, high = 1, num
        while low < high:
            mid = low + (high - low + 1) // 2
            if mid <= num // mid:
                low = mid
            else:
                high = mid - 1
        return low


if __name__ == "__main__":
    print(Solution().calculate_square_root(50))   # 7
```

```java,editable
public class Solution {
    public int calculateSquareRoot(int num) {
        if (num == 0) return 0;
        int low = 1, high = num;
        while (low < high) {
            int mid = low + (high - low + 1) / 2;
            if (mid <= num / mid) low = mid;
            else high = mid - 1;
        }
        return low;
    }
}
```

```c,editable
int calculate_square_root(int num) {
    if (num == 0) return 0;
    int low = 1, high = num;
    while (low < high) {
        int mid = low + (high - low + 1) / 2;
        if (mid <= num / mid) low = mid;
        else high = mid - 1;
    }
    return low;
}
```

```cpp,editable
class Solution {
public:
    int calculateSquareRoot(int num) {
        if (num == 0) return 0;
        int low = 1, high = num;
        while (low < high) {
            int mid = low + (high - low + 1) / 2;
            if (mid <= num / mid) low = mid;
            else high = mid - 1;
        }
        return low;
    }
};
```

```scala,editable
class Solution {
  def calculateSquareRoot(num: Int): Int = {
    if (num == 0) return 0
    var low = 1; var high = num
    while (low < high) {
      val mid = low + (high - low + 1) / 2
      if (mid <= num / mid) low = mid else high = mid - 1
    }
    low
  }
}
```

```javascript,editable
class Solution {
    calculateSquareRoot(num) {
        if (num === 0) return 0;
        let low = 1, high = num;
        while (low < high) {
            const mid = Math.floor(low + (high - low + 1) / 2);
            if (mid <= Math.floor(num / mid)) low = mid;
            else high = mid - 1;
        }
        return low;
    }
}
```

```typescript,editable
class Solution {
    calculateSquareRoot(num: number): number {
        if (num === 0) return 0;
        let low = 1, high = num;
        while (low < high) {
            const mid = Math.floor(low + (high - low + 1) / 2);
            if (mid <= Math.floor(num / mid)) low = mid;
            else high = mid - 1;
        }
        return low;
    }
}
```

```go,editable
package main

func calculateSquareRoot(num int) int {
    if num == 0 { return 0 }
    low, high := 1, num
    for low < high {
        mid := low + (high-low+1)/2
        if mid <= num/mid { low = mid } else { high = mid - 1 }
    }
    return low
}
```

```kotlin,editable
class Solution {
    fun calculateSquareRoot(num: Int): Int {
        if (num == 0) return 0
        var low = 1; var high = num
        while (low < high) {
            val mid = low + (high - low + 1) / 2
            if (mid <= num / mid) low = mid else high = mid - 1
        }
        return low
    }
}
```

```rust,editable
fn calculate_square_root(num: i64) -> i64 {
    if num == 0 { return 0; }
    let mut low: i64 = 1; let mut high: i64 = num;
    while low < high {
        let mid = low + (high - low + 1) / 2;
        if mid <= num / mid { low = mid; } else { high = mid - 1; }
    }
    low
}
```

</div>

***

# Build Staircase

## The Problem

Given `n` coins, build a staircase where the `i`th stair needs `i` coins. Return the number of complete stairs.

```
Input:  n = 6
Output: 3   (1 + 2 + 3 = 6)

Input:  n = 5
Output: 2   (1 + 2 = 3; can't build 3rd stair)

Input:  n = 7
Output: 3   (1 + 2 + 3 = 6; 1 coin left over, not enough for 4th)
```

## The Solution

Binary-search `k` in `[0, n]`. Predicate: `k(k+1)/2 <= n`.

<div class="lang-tabs">

```python,editable
class Solution:
    def build_staircase(self, n: int) -> int:
        low, high = 0, n
        while low < high:
            mid = low + (high - low + 1) // 2
            if mid * (mid + 1) // 2 <= n:
                low = mid
            else:
                high = mid - 1
        return low


if __name__ == "__main__":
    print(Solution().build_staircase(7))   # 3
```

```java,editable
public class Solution {
    public int buildStaircase(int n) {
        int low = 0, high = n;
        while (low < high) {
            int mid = low + (high - low + 1) / 2;
            if ((long) mid * (mid + 1) / 2 <= n) low = mid;
            else high = mid - 1;
        }
        return low;
    }
}
```

```c,editable
int build_staircase(int n) {
    int low = 0, high = n;
    while (low < high) {
        int mid = low + (high - low + 1) / 2;
        if ((long long) mid * (mid + 1) / 2 <= n) low = mid;
        else high = mid - 1;
    }
    return low;
}
```

```cpp,editable
class Solution {
public:
    int buildStaircase(int n) {
        int low = 0, high = n;
        while (low < high) {
            int mid = low + (high - low + 1) / 2;
            if ((long long) mid * (mid + 1) / 2 <= n) low = mid;
            else high = mid - 1;
        }
        return low;
    }
};
```

```scala,editable
class Solution {
  def buildStaircase(n: Int): Int = {
    var low = 0; var high = n
    while (low < high) {
      val mid = low + (high - low + 1) / 2
      if (mid.toLong * (mid + 1) / 2 <= n) low = mid else high = mid - 1
    }
    low
  }
}
```

```javascript,editable
class Solution {
    buildStaircase(n) {
        let low = 0, high = n;
        while (low < high) {
            const mid = Math.floor(low + (high - low + 1) / 2);
            if (mid * (mid + 1) / 2 <= n) low = mid;
            else high = mid - 1;
        }
        return low;
    }
}
```

```typescript,editable
class Solution {
    buildStaircase(n: number): number {
        let low = 0, high = n;
        while (low < high) {
            const mid = Math.floor(low + (high - low + 1) / 2);
            if (mid * (mid + 1) / 2 <= n) low = mid;
            else high = mid - 1;
        }
        return low;
    }
}
```

```go,editable
package main

func buildStaircase(n int) int {
    low, high := 0, n
    for low < high {
        mid := low + (high-low+1)/2
        if mid*(mid+1)/2 <= n { low = mid } else { high = mid - 1 }
    }
    return low
}
```

```kotlin,editable
class Solution {
    fun buildStaircase(n: Int): Int {
        var low = 0; var high = n
        while (low < high) {
            val mid = low + (high - low + 1) / 2
            if (mid.toLong() * (mid + 1) / 2 <= n) low = mid else high = mid - 1
        }
        return low
    }
}
```

```rust,editable
fn build_staircase(n: i64) -> i64 {
    let mut low: i64 = 0; let mut high: i64 = n;
    while low < high {
        let mid = low + (high - low + 1) / 2;
        if mid * (mid + 1) / 2 <= n { low = mid; } else { high = mid - 1; }
    }
    low
}
```

</div>

***

# K Ribbons

## The Problem

Array of ribbons. Cut them to produce at least `k` pieces of equal length. Return the *maximum* such length, or `0` if impossible.

```
Input:  ribbons = [9, 7, 5], k = 3
Output: 5

Input:  ribbons = [9, 7, 5], k = 4
Output: 4

Input:  ribbons = [9, 7, 5], k = 30
Output: 0
```

## The Solution

Predicate: "can we cut at least `k` ribbons of length `length`?" — sum of `r // length` for each ribbon. Binary-search `length` in `[1, max(ribbons)]`.

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def k_ribbons(self, ribbons: List[int], k: int) -> int:
        low, high = 1, max(ribbons)
        while low < high:
            mid = low + (high - low + 1) // 2
            if self._can_cut(ribbons, mid, k):
                low = mid
            else:
                high = mid - 1
        return low if self._can_cut(ribbons, low, k) else 0

    def _can_cut(self, ribbons, length, k):
        return sum(r // length for r in ribbons) >= k


if __name__ == "__main__":
    print(Solution().k_ribbons([9, 7, 5], 3))   # 5
```

```java,editable
public class Solution {
    public int kRibbons(int[] ribbons, int k) {
        int low = 1, high = 0;
        for (int r : ribbons) high = Math.max(high, r);
        while (low < high) {
            int mid = low + (high - low + 1) / 2;
            if (canCut(ribbons, mid, k)) low = mid;
            else high = mid - 1;
        }
        return canCut(ribbons, low, k) ? low : 0;
    }
    private boolean canCut(int[] ribbons, int length, int k) {
        long count = 0;
        for (int r : ribbons) count += r / length;
        return count >= k;
    }
}
```

```c,editable
#include <stdbool.h>

bool can_cut(int *ribbons, int n, int length, int k) {
    long long count = 0;
    for (int i = 0; i < n; i++) count += ribbons[i] / length;
    return count >= k;
}

int k_ribbons(int *ribbons, int n, int k) {
    int low = 1, high = 0;
    for (int i = 0; i < n; i++) if (ribbons[i] > high) high = ribbons[i];
    while (low < high) {
        int mid = low + (high - low + 1) / 2;
        if (can_cut(ribbons, n, mid, k)) low = mid;
        else high = mid - 1;
    }
    return can_cut(ribbons, n, low, k) ? low : 0;
}
```

```cpp,editable
#include <vector>
#include <algorithm>

class Solution {
public:
    int kRibbons(std::vector<int>& ribbons, int k) {
        int low = 1, high = *std::max_element(ribbons.begin(), ribbons.end());
        while (low < high) {
            int mid = low + (high - low + 1) / 2;
            if (canCut(ribbons, mid, k)) low = mid;
            else high = mid - 1;
        }
        return canCut(ribbons, low, k) ? low : 0;
    }
    bool canCut(std::vector<int>& ribbons, int length, int k) {
        long long count = 0;
        for (int r : ribbons) count += r / length;
        return count >= k;
    }
};
```

```scala,editable
class Solution {
  def kRibbons(ribbons: Array[Int], k: Int): Int = {
    var low = 1; var high = ribbons.max
    while (low < high) {
      val mid = low + (high - low + 1) / 2
      if (canCut(ribbons, mid, k)) low = mid else high = mid - 1
    }
    if (canCut(ribbons, low, k)) low else 0
  }
  private def canCut(ribbons: Array[Int], length: Int, k: Int): Boolean = {
    var count = 0L
    for (r <- ribbons) count += r / length
    count >= k
  }
}
```

```javascript,editable
class Solution {
    kRibbons(ribbons, k) {
        let low = 1, high = Math.max(...ribbons);
        while (low < high) {
            const mid = Math.floor(low + (high - low + 1) / 2);
            if (this._canCut(ribbons, mid, k)) low = mid;
            else high = mid - 1;
        }
        return this._canCut(ribbons, low, k) ? low : 0;
    }
    _canCut(ribbons, length, k) {
        let count = 0;
        for (const r of ribbons) count += Math.floor(r / length);
        return count >= k;
    }
}
```

```typescript,editable
class Solution {
    kRibbons(ribbons: number[], k: number): number {
        let low = 1, high = Math.max(...ribbons);
        while (low < high) {
            const mid = Math.floor(low + (high - low + 1) / 2);
            if (this._canCut(ribbons, mid, k)) low = mid;
            else high = mid - 1;
        }
        return this._canCut(ribbons, low, k) ? low : 0;
    }
    private _canCut(ribbons: number[], length: number, k: number): boolean {
        let count = 0;
        for (const r of ribbons) count += Math.floor(r / length);
        return count >= k;
    }
}
```

```go,editable
package main

func canCut(ribbons []int, length, k int) bool {
    count := 0
    for _, r := range ribbons { count += r / length }
    return count >= k
}

func kRibbons(ribbons []int, k int) int {
    low, high := 1, 0
    for _, r := range ribbons { if r > high { high = r } }
    for low < high {
        mid := low + (high-low+1)/2
        if canCut(ribbons, mid, k) { low = mid } else { high = mid - 1 }
    }
    if canCut(ribbons, low, k) { return low }
    return 0
}
```

```kotlin,editable
class Solution {
    fun kRibbons(ribbons: IntArray, k: Int): Int {
        var low = 1; var high = ribbons.max()!!
        while (low < high) {
            val mid = low + (high - low + 1) / 2
            if (canCut(ribbons, mid, k)) low = mid else high = mid - 1
        }
        return if (canCut(ribbons, low, k)) low else 0
    }
    private fun canCut(ribbons: IntArray, length: Int, k: Int): Boolean {
        var count = 0L
        for (r in ribbons) count += r / length
        return count >= k
    }
}
```

```rust,editable
fn can_cut(ribbons: &[i32], length: i32, k: i64) -> bool {
    let mut count: i64 = 0;
    for &r in ribbons { count += (r / length) as i64; }
    count >= k
}

fn k_ribbons(ribbons: &[i32], k: i32) -> i32 {
    let mut low = 1; let mut high = *ribbons.iter().max().unwrap();
    while low < high {
        let mid = low + (high - low + 1) / 2;
        if can_cut(ribbons, mid, k as i64) { low = mid; } else { high = mid - 1; }
    }
    if can_cut(ribbons, low, k as i64) { low } else { 0 }
}
```

</div>

***

# Equalise Water

## The Problem

Given an array of bucket water amounts and a `loss%` for transfers, find the maximum equal-water level achievable across all buckets.

```
Input:  buckets = [1, 5, 10], loss = 20
Output: 5.00000

Input:  buckets = [2, 4, 6], loss = 50
Output: 3.50000

Input:  buckets = [10, 10, 10, 10], loss = 40
Output: 10.00000
```

## The Solution

Binary-search the target water level (scaled to avoid floating-point precision). Predicate: total available excess (after loss) ≥ total deficit. Use integer arithmetic with a scale factor of `1e5`.

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    SCALE = 10 ** 5

    def equalise_water(self, buckets: List[int], loss: float) -> float:
        loss_int = int(loss)
        low, high = 0, max(buckets) * self.SCALE
        while low < high:
            mid = low + (high - low + 1) // 2
            if self._can_achieve(buckets, loss_int, mid):
                low = mid
            else:
                high = mid - 1
        return low / self.SCALE

    def _can_achieve(self, buckets, loss, target):
        excess = deficit = 0
        for w in buckets:
            water = w * self.SCALE
            if water > target:
                excess += (water - target) * (100 - loss) // 100
            else:
                deficit += target - water
        return excess >= deficit


if __name__ == "__main__":
    print(Solution().equalise_water([1, 5, 10], 20))   # 5.0
```

```java,editable
public class Solution {
    private static final long SCALE = 100000L;

    public double equaliseWater(int[] buckets, double loss) {
        long lossInt = (long) loss;
        long low = 0, high = 0;
        for (int b : buckets) high = Math.max(high, (long) b * SCALE);
        while (low < high) {
            long mid = low + (high - low + 1) / 2;
            if (canAchieve(buckets, lossInt, mid)) low = mid;
            else high = mid - 1;
        }
        return (double) low / SCALE;
    }

    private boolean canAchieve(int[] buckets, long loss, long target) {
        long excess = 0, deficit = 0;
        for (int b : buckets) {
            long water = (long) b * SCALE;
            if (water > target) excess += (water - target) * (100 - loss) / 100;
            else deficit += target - water;
        }
        return excess >= deficit;
    }
}
```

```c,editable
#include <stdbool.h>

#define SCALE 100000LL

bool can_achieve(int *buckets, int n, long long loss, long long target) {
    long long excess = 0, deficit = 0;
    for (int i = 0; i < n; i++) {
        long long water = (long long) buckets[i] * SCALE;
        if (water > target) excess += (water - target) * (100 - loss) / 100;
        else deficit += target - water;
    }
    return excess >= deficit;
}

double equalise_water(int *buckets, int n, double loss) {
    long long loss_int = (long long) loss;
    long long low = 0, high = 0;
    for (int i = 0; i < n; i++) if ((long long) buckets[i] * SCALE > high) high = (long long) buckets[i] * SCALE;
    while (low < high) {
        long long mid = low + (high - low + 1) / 2;
        if (can_achieve(buckets, n, loss_int, mid)) low = mid;
        else high = mid - 1;
    }
    return (double) low / SCALE;
}
```

```cpp,editable
#include <vector>
#include <algorithm>

class Solution {
public:
    static constexpr long long SCALE = 100000LL;

    double equaliseWater(std::vector<int>& buckets, double loss) {
        long long lossInt = (long long) loss;
        long long low = 0, high = 0;
        for (int b : buckets) high = std::max(high, (long long) b * SCALE);
        while (low < high) {
            long long mid = low + (high - low + 1) / 2;
            if (canAchieve(buckets, lossInt, mid)) low = mid;
            else high = mid - 1;
        }
        return (double) low / SCALE;
    }

    bool canAchieve(std::vector<int>& buckets, long long loss, long long target) {
        long long excess = 0, deficit = 0;
        for (int b : buckets) {
            long long water = (long long) b * SCALE;
            if (water > target) excess += (water - target) * (100 - loss) / 100;
            else deficit += target - water;
        }
        return excess >= deficit;
    }
};
```

```scala,editable
class Solution {
  private val SCALE = 100000L

  def equaliseWater(buckets: Array[Int], loss: Double): Double = {
    val lossInt = loss.toLong
    var low = 0L; var high = buckets.map(_.toLong * SCALE).max
    while (low < high) {
      val mid = low + (high - low + 1) / 2
      if (canAchieve(buckets, lossInt, mid)) low = mid else high = mid - 1
    }
    low.toDouble / SCALE
  }

  private def canAchieve(buckets: Array[Int], loss: Long, target: Long): Boolean = {
    var excess = 0L; var deficit = 0L
    for (b <- buckets) {
      val water = b.toLong * SCALE
      if (water > target) excess += (water - target) * (100 - loss) / 100
      else deficit += target - water
    }
    excess >= deficit
  }
}
```

```javascript,editable
class Solution {
    constructor() { this.SCALE = 100000n; }

    equaliseWater(buckets, loss) {
        const lossInt = BigInt(Math.floor(loss));
        let low = 0n, high = 0n;
        for (const b of buckets) {
            const v = BigInt(b) * this.SCALE;
            if (v > high) high = v;
        }
        while (low < high) {
            const mid = low + (high - low + 1n) / 2n;
            if (this._canAchieve(buckets, lossInt, mid)) low = mid;
            else high = mid - 1n;
        }
        return Number(low) / 100000;
    }

    _canAchieve(buckets, loss, target) {
        let excess = 0n, deficit = 0n;
        for (const b of buckets) {
            const water = BigInt(b) * this.SCALE;
            if (water > target) excess += (water - target) * (100n - loss) / 100n;
            else deficit += target - water;
        }
        return excess >= deficit;
    }
}
```

```typescript,editable
class Solution {
    private SCALE = 100000n;

    equaliseWater(buckets: number[], loss: number): number {
        const lossInt = BigInt(Math.floor(loss));
        let low = 0n, high = 0n;
        for (const b of buckets) {
            const v = BigInt(b) * this.SCALE;
            if (v > high) high = v;
        }
        while (low < high) {
            const mid = low + (high - low + 1n) / 2n;
            if (this._canAchieve(buckets, lossInt, mid)) low = mid;
            else high = mid - 1n;
        }
        return Number(low) / 100000;
    }

    private _canAchieve(buckets: number[], loss: bigint, target: bigint): boolean {
        let excess = 0n, deficit = 0n;
        for (const b of buckets) {
            const water = BigInt(b) * this.SCALE;
            if (water > target) excess += (water - target) * (100n - loss) / 100n;
            else deficit += target - water;
        }
        return excess >= deficit;
    }
}
```

```go,editable
package main

const SCALE = int64(100000)

func canAchieve(buckets []int, loss, target int64) bool {
    var excess, deficit int64 = 0, 0
    for _, b := range buckets {
        water := int64(b) * SCALE
        if water > target { excess += (water - target) * (100 - loss) / 100 }
        else { deficit += target - water }
    }
    return excess >= deficit
}

func equaliseWater(buckets []int, loss float64) float64 {
    lossInt := int64(loss)
    var low, high int64 = 0, 0
    for _, b := range buckets {
        v := int64(b) * SCALE
        if v > high { high = v }
    }
    for low < high {
        mid := low + (high-low+1)/2
        if canAchieve(buckets, lossInt, mid) { low = mid } else { high = mid - 1 }
    }
    return float64(low) / float64(SCALE)
}
```

```kotlin,editable
class Solution {
    private val SCALE = 100000L

    fun equaliseWater(buckets: IntArray, loss: Double): Double {
        val lossInt = loss.toLong()
        var low = 0L; var high = buckets.map { it.toLong() * SCALE }.max()!!
        while (low < high) {
            val mid = low + (high - low + 1) / 2
            if (canAchieve(buckets, lossInt, mid)) low = mid else high = mid - 1
        }
        return low.toDouble() / SCALE
    }

    private fun canAchieve(buckets: IntArray, loss: Long, target: Long): Boolean {
        var excess = 0L; var deficit = 0L
        for (b in buckets) {
            val water = b.toLong() * SCALE
            if (water > target) excess += (water - target) * (100 - loss) / 100
            else deficit += target - water
        }
        return excess >= deficit
    }
}
```

```rust,editable
const SCALE: i64 = 100000;

fn can_achieve(buckets: &[i32], loss: i64, target: i64) -> bool {
    let mut excess: i64 = 0; let mut deficit: i64 = 0;
    for &b in buckets {
        let water = (b as i64) * SCALE;
        if water > target { excess += (water - target) * (100 - loss) / 100; }
        else { deficit += target - water; }
    }
    excess >= deficit
}

fn equalise_water(buckets: &[i32], loss: f64) -> f64 {
    let loss_int = loss as i64;
    let mut low: i64 = 0;
    let mut high: i64 = buckets.iter().map(|&b| b as i64 * SCALE).max().unwrap();
    while low < high {
        let mid = low + (high - low + 1) / 2;
        if can_achieve(buckets, loss_int, mid) { low = mid; } else { high = mid - 1; }
    }
    low as f64 / SCALE as f64
}
```

</div>

***

## Final Takeaway

Maximum-predicate-search is the dual of the Minimum Predicate Search Pattern lesson. Same algorithm shell, mirrored direction; the `+ 1` in the mid calculation prevents the infinite-loop pitfall when `low` and `high` become adjacent. The four problems showed integer square root (predicate: `mid² ≤ num`), staircase building (`k(k+1)/2 ≤ n`), ribbon cutting, and water equalisation.

This closes the searching section. You came in with linear scan; you leave with binary search and its variants (lower bound, upper bound), 2D extensions (matrix search, staircase), broken-input handling (rotated array), and the binary-search-on-the-answer family (predicate search) — covering practically every searching problem you'll encounter.

The next major topic is **dynamic programming**. DP builds on memoization (introduced in the Recursion section) and on this section's "binary search on the answer" mindset: many DP problems can be reformulated as predicate searches, and many predicate searches benefit from DP-style state caching inside their predicate.
