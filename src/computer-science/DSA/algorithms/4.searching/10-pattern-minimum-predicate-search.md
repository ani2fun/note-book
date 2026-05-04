# 10. Pattern: Minimum Predicate Search

The previous patterns binary-searched a *sorted array* for a target index. This pattern binary-searches a **range of integer values** for the smallest value `x` that satisfies some predicate `P(x)`. The "search space" isn't an array — it's a numeric range. The "comparison" isn't `arr[mid] vs target` — it's a custom function `P(mid)` returning true or false.

This is **"binary search on the answer."** Many real-world questions fit:
- "Minimum speed needed to arrive on time?" — search speed values; predicate = "can we arrive within `hour` hours?"
- "Minimum cost penalty after k operations?" — search penalty values; predicate = "can we achieve this penalty?"
- "Smallest divisor that fits a budget?" — search divisor values.

The pattern requires *monotonicity*: if `P(x)` is true, then `P(x + 1)` must also be true (and so on). Once the predicate "flips" from false to true, it stays true. Binary search exploits this flip — the answer is the *first true*.

By the end of this lesson you'll know the diagnostic checks, the canonical "minimum-x-with-P-true" template, and four worked problems showing different predicates.

## Table of contents

1. [Identifying the pattern](#identifying-the-pattern)
2. [Punctual arrival speed](#punctual-arrival-speed)
3. [Penalty with balls](#penalty-with-balls)
4. [Minimum shipping capacity](#minimum-shipping-capacity)
5. [Trip completion frenzy](#trip-completion-frenzy)

***

# Identifying the Pattern

Three diagnostic questions:

| # | Question | If "yes," the pattern fits because... |
|---|---|---|
| **Q1** | We're optimizing for the *minimum* value satisfying a constraint? | Binary search finds the flip point. |
| **Q2** | The constraint is *monotonic* — if `x` works, then `x + 1` also works? | Required for the predicate to have a unique flip point. |
| **Q3** | Can we *evaluate* the predicate `P(x)` in `O(f(n))` time? | Each iteration costs `O(f(n))`; total is `O(f(n) · log range)`. |

If all three hold, the pattern applies. The total time is `O(log(range) · f(n))` — much faster than brute-forcing every value.

---

## The Template

```python,editable
def min_predicate_search(low, high, predicate):
    while low < high:
        mid = low + (high - low) // 2
        if predicate(mid):                    # mid works → try smaller
            high = mid
        else:                                  # mid doesn't work → try larger
            low = mid + 1
    return low                                 # smallest x with predicate(x) == true
```

Identical structure to lower bound on an array — the only difference is the predicate replaces `arr[mid] >= target`. The search space is `[low, high]` numeric range; the answer is `low` after the loop.

---

# Punctual Arrival Speed

## The Problem

Given bus distances `distance[]` and time budget `hour`, find the minimum integer speed at which all buses must travel for arrival within `hour`. Each bus departs at the next integer time after the previous bus arrives. Return `-1` if impossible.

```
Input:  distance = [1, 3, 5], hour = 2.5
Output: 10

Input:  distance = [1, 4, 9], hour = 6
Output: 3

Input:  distance = [1, 8, 10], hour = 2
Output: -1
```

## The Solution

Predicate `can_reach(speed)`: simulate the rides; for the last leg, partial time counts; for prior legs, you must round up to the next integer. Binary-search speed in `[1, 10^7]`.

<div class="lang-tabs">

```python,editable
import math
from typing import List

class Solution:
    def punctual_arrival_speed(self, distance: List[int], hour: float) -> int:
        low, high = 1, 10 ** 7
        while low < high:
            mid = low + (high - low) // 2
            if self._can_reach(distance, hour, mid):
                high = mid
            else:
                low = mid + 1
        return low if self._can_reach(distance, hour, low) else -1

    def _can_reach(self, distance, hour, speed):
        total = 0.0
        for i, d in enumerate(distance):
            t = d / speed
            if i < len(distance) - 1:
                total += math.ceil(t)
            else:
                total += t
        return total <= hour


if __name__ == "__main__":
    print(Solution().punctual_arrival_speed([1, 3, 5], 2.5))   # 10
```

```java,editable
public class Solution {
    public int punctualArrivalSpeed(int[] distance, double hour) {
        int low = 1, high = (int) 1e7;
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (canReach(distance, hour, mid)) high = mid;
            else low = mid + 1;
        }
        return canReach(distance, hour, low) ? low : -1;
    }
    private boolean canReach(int[] distance, double hour, int speed) {
        double total = 0;
        for (int i = 0; i < distance.length; i++) {
            double t = (double) distance[i] / speed;
            total += (i < distance.length - 1) ? Math.ceil(t) : t;
        }
        return total <= hour;
    }
}
```

```c,editable
#include <math.h>
#include <stdbool.h>

bool can_reach(int *distance, int n, double hour, int speed) {
    double total = 0;
    for (int i = 0; i < n; i++) {
        double t = (double) distance[i] / speed;
        total += (i < n - 1) ? ceil(t) : t;
    }
    return total <= hour;
}

int punctual_arrival_speed(int *distance, int n, double hour) {
    int low = 1, high = 10000000;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (can_reach(distance, n, hour, mid)) high = mid;
        else low = mid + 1;
    }
    return can_reach(distance, n, hour, low) ? low : -1;
}
```

```cpp,editable
#include <vector>
#include <cmath>

class Solution {
public:
    int punctualArrivalSpeed(std::vector<int>& distance, double hour) {
        int low = 1, high = (int) 1e7;
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (canReach(distance, hour, mid)) high = mid;
            else low = mid + 1;
        }
        return canReach(distance, hour, low) ? low : -1;
    }
    bool canReach(std::vector<int>& distance, double hour, int speed) {
        double total = 0;
        for (size_t i = 0; i < distance.size(); i++) {
            double t = (double) distance[i] / speed;
            total += (i < distance.size() - 1) ? std::ceil(t) : t;
        }
        return total <= hour;
    }
};
```

```scala,editable
class Solution {
  def punctualArrivalSpeed(distance: Array[Int], hour: Double): Int = {
    var low = 1; var high = (1e7).toInt
    while (low < high) {
      val mid = low + (high - low) / 2
      if (canReach(distance, hour, mid)) high = mid else low = mid + 1
    }
    if (canReach(distance, hour, low)) low else -1
  }
  private def canReach(distance: Array[Int], hour: Double, speed: Int): Boolean = {
    var total: Double = 0
    for (i <- distance.indices) {
      val t = distance(i).toDouble / speed
      total += (if (i < distance.length - 1) math.ceil(t) else t)
    }
    total <= hour
  }
}
```

```javascript,editable
class Solution {
    punctualArrivalSpeed(distance, hour) {
        let low = 1, high = 1e7;
        while (low < high) {
            const mid = Math.floor(low + (high - low) / 2);
            if (this._canReach(distance, hour, mid)) high = mid;
            else low = mid + 1;
        }
        return this._canReach(distance, hour, low) ? low : -1;
    }
    _canReach(distance, hour, speed) {
        let total = 0;
        for (let i = 0; i < distance.length; i++) {
            const t = distance[i] / speed;
            total += (i < distance.length - 1) ? Math.ceil(t) : t;
        }
        return total <= hour;
    }
}
```

```typescript,editable
class Solution {
    punctualArrivalSpeed(distance: number[], hour: number): number {
        let low = 1, high = 1e7;
        while (low < high) {
            const mid = Math.floor(low + (high - low) / 2);
            if (this._canReach(distance, hour, mid)) high = mid;
            else low = mid + 1;
        }
        return this._canReach(distance, hour, low) ? low : -1;
    }
    private _canReach(distance: number[], hour: number, speed: number): boolean {
        let total = 0;
        for (let i = 0; i < distance.length; i++) {
            const t = distance[i] / speed;
            total += (i < distance.length - 1) ? Math.ceil(t) : t;
        }
        return total <= hour;
    }
}
```

```go,editable
package main

import "math"

func canReach(distance []int, hour float64, speed int) bool {
    total := 0.0
    for i, d := range distance {
        t := float64(d) / float64(speed)
        if i < len(distance)-1 { total += math.Ceil(t) } else { total += t }
    }
    return total <= hour
}

func punctualArrivalSpeed(distance []int, hour float64) int {
    low, high := 1, 10000000
    for low < high {
        mid := low + (high-low)/2
        if canReach(distance, hour, mid) { high = mid } else { low = mid + 1 }
    }
    if canReach(distance, hour, low) { return low }
    return -1
}
```

```kotlin,editable
import kotlin.math.ceil

class Solution {
    fun punctualArrivalSpeed(distance: IntArray, hour: Double): Int {
        var low = 1; var high = 10_000_000
        while (low < high) {
            val mid = low + (high - low) / 2
            if (canReach(distance, hour, mid)) high = mid else low = mid + 1
        }
        return if (canReach(distance, hour, low)) low else -1
    }
    private fun canReach(distance: IntArray, hour: Double, speed: Int): Boolean {
        var total = 0.0
        for (i in distance.indices) {
            val t = distance[i].toDouble() / speed
            total += if (i < distance.size - 1) ceil(t) else t
        }
        return total <= hour
    }
}
```

```rust,editable
fn can_reach(distance: &[i32], hour: f64, speed: i32) -> bool {
    let mut total = 0.0;
    let n = distance.len();
    for (i, &d) in distance.iter().enumerate() {
        let t = d as f64 / speed as f64;
        total += if i < n - 1 { t.ceil() } else { t };
    }
    total <= hour
}

fn punctual_arrival_speed(distance: &[i32], hour: f64) -> i32 {
    let mut low = 1; let mut high = 10_000_000;
    while low < high {
        let mid = low + (high - low) / 2;
        if can_reach(distance, hour, mid) { high = mid; } else { low = mid + 1; }
    }
    if can_reach(distance, hour, low) { low } else { -1 }
}
```

</div>

***

# Penalty With Balls

## The Problem

Given bag sizes `bags[]` and `maxOperations`, you can split any bag into two non-zero parts (counts as one operation). Minimize the largest bag size after at most `maxOperations` splits.

```
Input:  bags = [9, 7, 6], maxOperations = 3
Output: 5

Input:  bags = [4, 8], maxOperations = 1
Output: 4

Input:  bags = [4, 2], maxOperations = 4
Output: 1
```

## The Solution

Predicate: "can we achieve max-bag-size = penalty?" — a bag of size `b > penalty` needs `(b - 1) // penalty` splits. Sum and check against `maxOperations`. Binary-search penalty in `[1, max(bags)]`.

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def penalty_with_balls(self, bags: List[int], max_operations: int) -> int:
        low, high = 1, max(bags)
        while low < high:
            mid = low + (high - low) // 2
            if self._can_achieve(bags, max_operations, mid):
                high = mid
            else:
                low = mid + 1
        return low

    def _can_achieve(self, bags, max_ops, penalty):
        ops = 0
        for b in bags:
            if b > penalty:
                ops += (b - 1) // penalty
        return ops <= max_ops


if __name__ == "__main__":
    print(Solution().penalty_with_balls([9, 7, 6], 3))   # 5
```

```java,editable
public class Solution {
    public int penaltyWithBalls(int[] bags, int maxOperations) {
        int low = 1, high = 0;
        for (int b : bags) high = Math.max(high, b);
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (canAchieve(bags, maxOperations, mid)) high = mid;
            else low = mid + 1;
        }
        return low;
    }
    private boolean canAchieve(int[] bags, int maxOps, int penalty) {
        int ops = 0;
        for (int b : bags) if (b > penalty) ops += (b - 1) / penalty;
        return ops <= maxOps;
    }
}
```

```c,editable
#include <stdbool.h>

bool can_achieve(int *bags, int n, int max_ops, int penalty) {
    int ops = 0;
    for (int i = 0; i < n; i++) if (bags[i] > penalty) ops += (bags[i] - 1) / penalty;
    return ops <= max_ops;
}

int penalty_with_balls(int *bags, int n, int max_operations) {
    int low = 1, high = 0;
    for (int i = 0; i < n; i++) if (bags[i] > high) high = bags[i];
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (can_achieve(bags, n, max_operations, mid)) high = mid;
        else low = mid + 1;
    }
    return low;
}
```

```cpp,editable
#include <vector>
#include <algorithm>

class Solution {
public:
    int penaltyWithBalls(std::vector<int>& bags, int maxOperations) {
        int low = 1, high = *std::max_element(bags.begin(), bags.end());
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (canAchieve(bags, maxOperations, mid)) high = mid;
            else low = mid + 1;
        }
        return low;
    }
    bool canAchieve(std::vector<int>& bags, int maxOps, int penalty) {
        int ops = 0;
        for (int b : bags) if (b > penalty) ops += (b - 1) / penalty;
        return ops <= maxOps;
    }
};
```

```scala,editable
class Solution {
  def penaltyWithBalls(bags: Array[Int], maxOperations: Int): Int = {
    var low = 1; var high = bags.max
    while (low < high) {
      val mid = low + (high - low) / 2
      if (canAchieve(bags, maxOperations, mid)) high = mid else low = mid + 1
    }
    low
  }
  private def canAchieve(bags: Array[Int], maxOps: Int, penalty: Int): Boolean = {
    var ops = 0
    for (b <- bags) if (b > penalty) ops += (b - 1) / penalty
    ops <= maxOps
  }
}
```

```javascript,editable
class Solution {
    penaltyWithBalls(bags, maxOperations) {
        let low = 1, high = Math.max(...bags);
        while (low < high) {
            const mid = low + ((high - low) >> 1);
            if (this._canAchieve(bags, maxOperations, mid)) high = mid;
            else low = mid + 1;
        }
        return low;
    }
    _canAchieve(bags, maxOps, penalty) {
        let ops = 0;
        for (const b of bags) if (b > penalty) ops += Math.floor((b - 1) / penalty);
        return ops <= maxOps;
    }
}
```

```typescript,editable
class Solution {
    penaltyWithBalls(bags: number[], maxOperations: number): number {
        let low = 1, high = Math.max(...bags);
        while (low < high) {
            const mid = low + ((high - low) >> 1);
            if (this._canAchieve(bags, maxOperations, mid)) high = mid;
            else low = mid + 1;
        }
        return low;
    }
    private _canAchieve(bags: number[], maxOps: number, penalty: number): boolean {
        let ops = 0;
        for (const b of bags) if (b > penalty) ops += Math.floor((b - 1) / penalty);
        return ops <= maxOps;
    }
}
```

```go,editable
package main

func canAchieve(bags []int, maxOps, penalty int) bool {
    ops := 0
    for _, b := range bags { if b > penalty { ops += (b - 1) / penalty } }
    return ops <= maxOps
}

func penaltyWithBalls(bags []int, maxOperations int) int {
    low, high := 1, 0
    for _, b := range bags { if b > high { high = b } }
    for low < high {
        mid := low + (high-low)/2
        if canAchieve(bags, maxOperations, mid) { high = mid } else { low = mid + 1 }
    }
    return low
}
```

```kotlin,editable
class Solution {
    fun penaltyWithBalls(bags: IntArray, maxOperations: Int): Int {
        var low = 1; var high = bags.max()!!
        while (low < high) {
            val mid = low + (high - low) / 2
            if (canAchieve(bags, maxOperations, mid)) high = mid else low = mid + 1
        }
        return low
    }
    private fun canAchieve(bags: IntArray, maxOps: Int, penalty: Int): Boolean {
        var ops = 0
        for (b in bags) if (b > penalty) ops += (b - 1) / penalty
        return ops <= maxOps
    }
}
```

```rust,editable
fn can_achieve(bags: &[i32], max_ops: i32, penalty: i32) -> bool {
    let mut ops = 0;
    for &b in bags { if b > penalty { ops += (b - 1) / penalty; } }
    ops <= max_ops
}

fn penalty_with_balls(bags: &[i32], max_operations: i32) -> i32 {
    let mut low = 1; let mut high = *bags.iter().max().unwrap();
    while low < high {
        let mid = low + (high - low) / 2;
        if can_achieve(bags, max_operations, mid) { high = mid; } else { low = mid + 1; }
    }
    low
}
```

</div>

***

# Minimum Shipping Capacity

## The Problem

Given package weights `weights[]` (in order) and `days`, find the minimum ship capacity that allows all packages to be shipped within `days`. Packages must be shipped in input order.

```
Input:  weights = [20, 10, 25, 35], days = 3
Output: 35

Input:  weights = [20, 10, 40, 30], days = 3
Output: 40

Input:  weights = [6, 3, 9], days = 3
Output: 18
```

## The Solution

Predicate: "can we ship within `days` days at capacity `cap`?" — greedy: sum weights into a bucket; when adding next would exceed `cap`, start a new day. Count days. Binary-search `cap` in `[max(weights), sum(weights)]`.

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def minimum_shipping_capacity(self, weights: List[int], days: int) -> int:
        low, high = max(weights), sum(weights)
        while low < high:
            mid = low + (high - low) // 2
            if self._can_ship(weights, days, mid): high = mid
            else: low = mid + 1
        return low

    def _can_ship(self, weights, days, cap):
        d, current = 1, 0
        for w in weights:
            if current + w > cap:
                d += 1
                current = 0
            current += w
        return d <= days


if __name__ == "__main__":
    print(Solution().minimum_shipping_capacity([20, 10, 25, 35], 3))   # 35
```

```java,editable
public class Solution {
    public int minimumShippingCapacity(int[] weights, int days) {
        int low = 0, high = 0;
        for (int w : weights) { low = Math.max(low, w); high += w; }
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (canShip(weights, days, mid)) high = mid;
            else low = mid + 1;
        }
        return low;
    }
    private boolean canShip(int[] weights, int days, int cap) {
        int d = 1, cur = 0;
        for (int w : weights) {
            if (cur + w > cap) { d++; cur = 0; }
            cur += w;
        }
        return d <= days;
    }
}
```

```c,editable
#include <stdbool.h>

bool can_ship(int *weights, int n, int days, int cap) {
    int d = 1, cur = 0;
    for (int i = 0; i < n; i++) {
        if (cur + weights[i] > cap) { d++; cur = 0; }
        cur += weights[i];
    }
    return d <= days;
}

int minimum_shipping_capacity(int *weights, int n, int days) {
    int low = 0, high = 0;
    for (int i = 0; i < n; i++) { if (weights[i] > low) low = weights[i]; high += weights[i]; }
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (can_ship(weights, n, days, mid)) high = mid;
        else low = mid + 1;
    }
    return low;
}
```

```cpp,editable
#include <vector>
#include <algorithm>
#include <numeric>

class Solution {
public:
    int minimumShippingCapacity(std::vector<int>& weights, int days) {
        int low = *std::max_element(weights.begin(), weights.end());
        int high = std::accumulate(weights.begin(), weights.end(), 0);
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (canShip(weights, days, mid)) high = mid;
            else low = mid + 1;
        }
        return low;
    }
    bool canShip(std::vector<int>& weights, int days, int cap) {
        int d = 1, cur = 0;
        for (int w : weights) {
            if (cur + w > cap) { d++; cur = 0; }
            cur += w;
        }
        return d <= days;
    }
};
```

```scala,editable
class Solution {
  def minimumShippingCapacity(weights: Array[Int], days: Int): Int = {
    var low = weights.max; var high = weights.sum
    while (low < high) {
      val mid = low + (high - low) / 2
      if (canShip(weights, days, mid)) high = mid else low = mid + 1
    }
    low
  }
  private def canShip(weights: Array[Int], days: Int, cap: Int): Boolean = {
    var d = 1; var cur = 0
    for (w <- weights) {
      if (cur + w > cap) { d += 1; cur = 0 }
      cur += w
    }
    d <= days
  }
}
```

```javascript,editable
class Solution {
    minimumShippingCapacity(weights, days) {
        let low = Math.max(...weights), high = weights.reduce((a, b) => a + b, 0);
        while (low < high) {
            const mid = low + ((high - low) >> 1);
            if (this._canShip(weights, days, mid)) high = mid;
            else low = mid + 1;
        }
        return low;
    }
    _canShip(weights, days, cap) {
        let d = 1, cur = 0;
        for (const w of weights) {
            if (cur + w > cap) { d++; cur = 0; }
            cur += w;
        }
        return d <= days;
    }
}
```

```typescript,editable
class Solution {
    minimumShippingCapacity(weights: number[], days: number): number {
        let low = Math.max(...weights), high = weights.reduce((a, b) => a + b, 0);
        while (low < high) {
            const mid = low + ((high - low) >> 1);
            if (this._canShip(weights, days, mid)) high = mid;
            else low = mid + 1;
        }
        return low;
    }
    private _canShip(weights: number[], days: number, cap: number): boolean {
        let d = 1, cur = 0;
        for (const w of weights) {
            if (cur + w > cap) { d++; cur = 0; }
            cur += w;
        }
        return d <= days;
    }
}
```

```go,editable
package main

func canShip(weights []int, days, cap int) bool {
    d, cur := 1, 0
    for _, w := range weights {
        if cur+w > cap { d++; cur = 0 }
        cur += w
    }
    return d <= days
}

func minimumShippingCapacity(weights []int, days int) int {
    low, high := 0, 0
    for _, w := range weights { if w > low { low = w }; high += w }
    for low < high {
        mid := low + (high-low)/2
        if canShip(weights, days, mid) { high = mid } else { low = mid + 1 }
    }
    return low
}
```

```kotlin,editable
class Solution {
    fun minimumShippingCapacity(weights: IntArray, days: Int): Int {
        var low = weights.max()!!; var high = weights.sum()
        while (low < high) {
            val mid = low + (high - low) / 2
            if (canShip(weights, days, mid)) high = mid else low = mid + 1
        }
        return low
    }
    private fun canShip(weights: IntArray, days: Int, cap: Int): Boolean {
        var d = 1; var cur = 0
        for (w in weights) {
            if (cur + w > cap) { d++; cur = 0 }
            cur += w
        }
        return d <= days
    }
}
```

```rust,editable
fn can_ship(weights: &[i32], days: i32, cap: i32) -> bool {
    let mut d = 1; let mut cur = 0;
    for &w in weights {
        if cur + w > cap { d += 1; cur = 0; }
        cur += w;
    }
    d <= days
}

fn minimum_shipping_capacity(weights: &[i32], days: i32) -> i32 {
    let mut low = *weights.iter().max().unwrap();
    let mut high: i32 = weights.iter().sum();
    while low < high {
        let mid = low + (high - low) / 2;
        if can_ship(weights, days, mid) { high = mid; } else { low = mid + 1; }
    }
    low
}
```

</div>

***

# Trip Completion Frenzy

## The Problem

Given an array `times[]` (each plane's per-trip duration) and `totalTrips`, find the minimum time required for the planes (operating independently) to complete `totalTrips` trips total.

```
Input:  times = [3, 4, 5], totalTrips = 4
Output: 6

Input:  times = [1, 2, 3], totalTrips = 5
Output: 3

Input:  times = [1], totalTrips = 5
Output: 5
```

## The Solution

Predicate: "in time `t`, can we complete `totalTrips`?" — each plane finishes `t / times[i]` trips. Sum and check ≥ totalTrips. Binary-search `t` in `[0, min(times) * totalTrips]`.

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def trip_completion_frenzy(self, times: List[int], total_trips: int) -> int:
        low, high = 0, max(times) * total_trips
        while low < high:
            mid = low + (high - low) // 2
            if self._can_complete(times, total_trips, mid): high = mid
            else: low = mid + 1
        return low

    def _can_complete(self, times, total_trips, time):
        return sum(time // t for t in times) >= total_trips


if __name__ == "__main__":
    print(Solution().trip_completion_frenzy([3, 4, 5], 4))   # 6
```

```java,editable
public class Solution {
    public long tripCompletionFrenzy(int[] times, int totalTrips) {
        long low = 0, high = (long) Long.MAX_VALUE / 2;
        long maxT = 0;
        for (int t : times) maxT = Math.max(maxT, t);
        high = maxT * (long) totalTrips;
        while (low < high) {
            long mid = low + (high - low) / 2;
            if (canComplete(times, totalTrips, mid)) high = mid;
            else low = mid + 1;
        }
        return low;
    }
    private boolean canComplete(int[] times, int totalTrips, long time) {
        long completed = 0;
        for (int t : times) completed += time / t;
        return completed >= totalTrips;
    }
}
```

```c,editable
#include <stdbool.h>

bool can_complete(int *times, int n, int total_trips, long long time) {
    long long completed = 0;
    for (int i = 0; i < n; i++) completed += time / times[i];
    return completed >= total_trips;
}

long long trip_completion_frenzy(int *times, int n, int total_trips) {
    long long low = 0, high = 0, maxT = 0;
    for (int i = 0; i < n; i++) if (times[i] > maxT) maxT = times[i];
    high = maxT * (long long) total_trips;
    while (low < high) {
        long long mid = low + (high - low) / 2;
        if (can_complete(times, n, total_trips, mid)) high = mid;
        else low = mid + 1;
    }
    return low;
}
```

```cpp,editable
#include <vector>
#include <algorithm>

class Solution {
public:
    long long tripCompletionFrenzy(std::vector<int>& times, int totalTrips) {
        long long low = 0;
        long long high = (long long) *std::max_element(times.begin(), times.end()) * totalTrips;
        while (low < high) {
            long long mid = low + (high - low) / 2;
            if (canComplete(times, totalTrips, mid)) high = mid;
            else low = mid + 1;
        }
        return low;
    }
    bool canComplete(std::vector<int>& times, int totalTrips, long long time) {
        long long completed = 0;
        for (int t : times) completed += time / t;
        return completed >= totalTrips;
    }
};
```

```scala,editable
class Solution {
  def tripCompletionFrenzy(times: Array[Int], totalTrips: Int): Long = {
    var low = 0L; var high = times.max.toLong * totalTrips
    while (low < high) {
      val mid = low + (high - low) / 2
      if (canComplete(times, totalTrips, mid)) high = mid else low = mid + 1
    }
    low
  }
  private def canComplete(times: Array[Int], totalTrips: Int, time: Long): Boolean = {
    var completed = 0L
    for (t <- times) completed += time / t
    completed >= totalTrips
  }
}
```

```javascript,editable
class Solution {
    tripCompletionFrenzy(times, totalTrips) {
        let low = 0n, high = BigInt(Math.max(...times)) * BigInt(totalTrips);
        while (low < high) {
            const mid = low + (high - low) / 2n;
            if (this._canComplete(times, totalTrips, mid)) high = mid;
            else low = mid + 1n;
        }
        return Number(low);
    }
    _canComplete(times, totalTrips, time) {
        let completed = 0n;
        for (const t of times) completed += time / BigInt(t);
        return completed >= BigInt(totalTrips);
    }
}
```

```typescript,editable
class Solution {
    tripCompletionFrenzy(times: number[], totalTrips: number): number {
        let low = 0n, high = BigInt(Math.max(...times)) * BigInt(totalTrips);
        while (low < high) {
            const mid = low + (high - low) / 2n;
            if (this._canComplete(times, totalTrips, mid)) high = mid;
            else low = mid + 1n;
        }
        return Number(low);
    }
    private _canComplete(times: number[], totalTrips: number, time: bigint): boolean {
        let completed = 0n;
        for (const t of times) completed += time / BigInt(t);
        return completed >= BigInt(totalTrips);
    }
}
```

```go,editable
package main

func canComplete(times []int, totalTrips int, time int64) bool {
    var completed int64 = 0
    for _, t := range times { completed += time / int64(t) }
    return completed >= int64(totalTrips)
}

func tripCompletionFrenzy(times []int, totalTrips int) int64 {
    var low, high int64 = 0, 0
    var maxT int64 = 0
    for _, t := range times { if int64(t) > maxT { maxT = int64(t) } }
    high = maxT * int64(totalTrips)
    for low < high {
        mid := low + (high-low)/2
        if canComplete(times, totalTrips, mid) { high = mid } else { low = mid + 1 }
    }
    return low
}
```

```kotlin,editable
class Solution {
    fun tripCompletionFrenzy(times: IntArray, totalTrips: Int): Long {
        var low = 0L; var high = times.max()!!.toLong() * totalTrips
        while (low < high) {
            val mid = low + (high - low) / 2
            if (canComplete(times, totalTrips, mid)) high = mid else low = mid + 1
        }
        return low
    }
    private fun canComplete(times: IntArray, totalTrips: Int, time: Long): Boolean {
        var completed = 0L
        for (t in times) completed += time / t
        return completed >= totalTrips
    }
}
```

```rust,editable
fn can_complete(times: &[i32], total_trips: i64, time: i64) -> bool {
    let mut completed: i64 = 0;
    for &t in times { completed += time / t as i64; }
    completed >= total_trips
}

fn trip_completion_frenzy(times: &[i32], total_trips: i32) -> i64 {
    let mut low: i64 = 0;
    let mut high: i64 = (*times.iter().max().unwrap() as i64) * total_trips as i64;
    while low < high {
        let mid = low + (high - low) / 2;
        if can_complete(times, total_trips as i64, mid) { high = mid; } else { low = mid + 1; }
    }
    low
}
```

</div>

***

## Final Takeaway

The minimum-predicate-search pattern: when you're optimizing for the smallest value satisfying a monotonic predicate, binary-search the value range. The four problems showed four different predicate functions — "can-reach," "can-achieve-penalty," "can-ship," "can-complete-trips" — each independently a creative greedy/simulation, but all sharing the same outer binary-search shell.

The next lesson (the Maximum Predicate Search Pattern lesson) is the dual: **maximum-predicate-search** — when you're optimizing for the largest value satisfying a predicate that's true-then-false (instead of false-then-true).
