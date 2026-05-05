# 2. Set-Bit Finder

The previous lesson taught how to *manipulate* a specific bit. This one inverts the question: given a number, can we *locate* its set bits — quickly, without scanning all 32 positions? Two flavours of the question turn out to have elegant single-line answers. **Only-set-bit:** assuming exactly one bit is on, where is it? Equivalent to "is this a power of 2, and if so, which one?" **Rightmost-set-bit:** for an arbitrary number, where is the lowest-position bit that's on? Both rest on the legendary identity `n & (n - 1)`, which clears the rightmost set bit — and once you've internalised that one trick, half of bit-manipulation interview questions feel scripted.

By the end of this lesson you'll know **`n & (n - 1)` clears the rightmost set bit** and `n & -n` *isolates* it — the two complementary operations that let you find, count, and clear set bits in O(set-bit count) instead of O(bit-width).

## Table of contents

1. [The `n & (n - 1)` Identity](#the-n--n--1-identity)
2. [Only Set Bit](#only-set-bit)
3. [Rightmost Set Bit](#rightmost-set-bit)
4. [Final Takeaway](#final-takeaway)

***

# The `n & (n - 1)` Identity

> **Course:** DSA › Algorithms › Bit Manipulation › Set-Bit Finder

Subtracting 1 from a binary number flips its **rightmost set bit** to 0 and sets every bit below it to 1.

```d2
direction: right
flow: "n = 12 → n - 1 = 11" {
  grid-rows: 2
  grid-columns: 2
  grid-gap: 20
  n: |md
    n = 12
    `0000 1100`
    rightmost set bit is bit 3
  |
  n_minus_1: |md
    n − 1 = 11
    `0000 1011`
    bit 3 cleared; bits 1-2 flipped to 1
  |
}
```

<p align="center"><strong>Subtracting 1 from <code>n</code> ripples through the trailing zeros, turning them all to 1, and clears the lowest set bit. AND-ing the two together cancels both the original lowest bit and the freshly-flipped trailing 1s.</strong></p>

So `n & (n - 1)` clears the rightmost set bit but leaves every higher set bit untouched. That single fact powers two complementary tricks:

- **Diagnostic** — `(n & (n - 1)) == 0` exactly when `n` has *zero or one* set bits. For non-zero `n`, this is the one-line "is `n` a power of 2?" test.
- **Iterative bit removal** — repeated `n = n & (n - 1)` strips set bits one at a time. Counting iterations until `n == 0` gives the population count (Brian Kernighan's algorithm — used in lesson 4).

The dual is `n & -n` (using two's complement): instead of *clearing* the rightmost set bit, it **isolates** it, returning a power of 2 marking that bit's position.

```
n = 12        ⇒ n & (n - 1) = 8     (clears bit 3)
n = 12        ⇒ n & -n       = 4    (isolates bit 3)
n = 0b101000  ⇒ n & (n - 1) = 0b100000   (clears bit 4)
n = 0b101000  ⇒ n & -n       = 0b001000  (isolates bit 4)
```

> *Predict before reading on — for <code>n = 7</code> (binary <code>0111</code>), what does <code>n & (n - 1)</code> give? What about <code>n & -n</code>?*

`n & (n - 1) = 6` (binary `0110`) — clears the lowest set bit (bit 1). `n & -n = 1` (binary `0001`) — isolates the lowest set bit.

---

## Key Takeaway

`n & (n - 1)` clears the rightmost set bit. `n & -n` isolates it. Together they're the most-used pair of one-liners in bit manipulation.

***

# Only Set Bit

> **Course:** DSA › Algorithms › Bit Manipulation › Set-Bit Finder

## The Problem

Given a 32-bit integer `num`, find the position (1-indexed) of the only set bit. If `num` has more than one set bit, return `-1`.

```
Input:  num = 16
Output: 5                    Binary 0001 0000 — only bit 5 is set

Input:  num = 2
Output: 2                    Binary 0010

Input:  num = 10
Output: -1                   Binary 1010 — two set bits
```

## The Recurrence

Two steps:

1. **Validate**: `(num & (num - 1)) != 0` ⇒ more than one set bit ⇒ return `-1`.
2. **Find position**: take `log₂(num) + 1`. (For a power of 2, `log₂` is an integer; the +1 converts to 1-indexing.)

> *Pause. Why does step 1 reject zero correctly?*

For `num = 0`, `num - 1` wraps to `-1` (or all-1s in two's-complement), so `num & (num - 1) = 0`. The first test passes — it thinks zero has "≤ 1 set bit" (true). Then `log₂(0)` is undefined. Most implementations either special-case `num == 0` or rely on the platform's `log` returning `-inf` and the conversion landing somewhere harmless. The C++ original assumes `num > 0` per the problem; we'll guard explicitly here.

## The Solution

<div class="lang-tabs">

```python,editable
import math

class Solution:
    def only_set_bit(self, num: int) -> int:
        if num <= 0 or (num & (num - 1)) != 0:
            return -1                              # Zero, negative, or multi-set-bit
        return int(math.log2(num)) + 1             # Power of 2 → integer log; +1 for 1-indexing


if __name__ == "__main__":
    sol = Solution()
    print(sol.only_set_bit(16))   # 5
    print(sol.only_set_bit(2))    # 2
    print(sol.only_set_bit(10))   # -1
```

```java,editable
public class Solution {
    public int onlySetBit(int num) {
        if (num <= 0 || (num & (num - 1)) != 0) return -1;
        return (int) (Math.log(num) / Math.log(2)) + 1;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.onlySetBit(16));   // 5
        System.out.println(sol.onlySetBit(10));   // -1
    }
}
```

```c,editable
#include <stdio.h>
#include <math.h>

int only_set_bit(int num) {
    if (num <= 0 || (num & (num - 1)) != 0) return -1;
    return (int) log2(num) + 1;
}

int main(void) {
    printf("%d\n", only_set_bit(16));   /* 5 */
    printf("%d\n", only_set_bit(10));   /* -1 */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <cmath>

class Solution {
public:
    int onlySetBit(int num) {
        if (num <= 0 || (num & (num - 1)) != 0) return -1;
        return (int) std::log2(num) + 1;
    }
};

int main() {
    std::cout << Solution().onlySetBit(16) << "\n";   // 5
    return 0;
}
```

```scala,editable
class Solution {
  def onlySetBit(num: Int): Int = {
    if (num <= 0 || (num & (num - 1)) != 0) -1
    else (math.log(num) / math.log(2)).toInt + 1
  }
}

object Main extends App {
  println(new Solution().onlySetBit(16))   // 5
}
```

```javascript,editable
class Solution {
    onlySetBit(num) {
        if (num <= 0 || (num & (num - 1)) !== 0) return -1;
        return Math.log2(num) + 1;
    }
}

console.log(new Solution().onlySetBit(16));   // 5
console.log(new Solution().onlySetBit(10));   // -1
```

```typescript,editable
class Solution {
    onlySetBit(num: number): number {
        if (num <= 0 || (num & (num - 1)) !== 0) return -1;
        return Math.log2(num) + 1;
    }
}
```

```go,editable
package main

import (
    "fmt"
    "math"
)

func onlySetBit(num int) int {
    if num <= 0 || (num & (num - 1)) != 0 { return -1 }
    return int(math.Log2(float64(num))) + 1
}

func main() {
    fmt.Println(onlySetBit(16))   // 5
    fmt.Println(onlySetBit(10))   // -1
}
```

```kotlin,editable
class Solution {
    fun onlySetBit(num: Int): Int {
        if (num <= 0 || (num and (num - 1)) != 0) return -1
        return (Math.log(num.toDouble()) / Math.log(2.0)).toInt() + 1
    }
}

fun main() {
    println(Solution().onlySetBit(16))   // 5
}
```

```rust,editable
fn only_set_bit(num: i32) -> i32 {
    if num <= 0 || (num & (num - 1)) != 0 { return -1; }
    // trailing_zeros gives the 0-indexed position of the only set bit; +1 for 1-indexing.
    (num.trailing_zeros() as i32) + 1
}

fn main() {
    println!("{}", only_set_bit(16));   // 5
    println!("{}", only_set_bit(10));   // -1
}
```

</div>

## Complexity

| Aspect | Cost |
|---|---|
| Time | `O(1)` — constant-time bitwise check + log |
| Space | `O(1)` |

***

# Rightmost Set Bit

> **Course:** DSA › Algorithms › Bit Manipulation › Set-Bit Finder

## The Problem

Given a 32-bit integer `num`, find the 1-indexed position of its rightmost (lowest) set bit.

```
Input:  num = 10
Output: 2                   Binary 1010 — lowest set bit is at position 2

Input:  num = 16
Output: 5                   Binary 0001 0000 — bit 5 is the only set bit

Input:  num = 17
Output: 1                   Binary 0001 0001 — bit 1 is the rightmost set bit
```

## The Recurrence

Two clean approaches:

**Approach A — Isolate then log.** `num & -num` isolates the rightmost set bit (a power of 2). Take `log₂` plus 1 to recover the 1-indexed position. Same trick as "only set bit", but applied after isolation — which works for any `num`, not just powers of 2.

**Approach B — Trailing-zero count.** Most languages have `trailing_zeros` / `Integer.numberOfTrailingZeros` / `__builtin_ctz` — these return the 0-indexed position of the lowest set bit, which is what we want minus one.

Either works; both run in O(1) on modern CPUs (the trailing-zero count is a single instruction on x86 and ARM).

> *Pause. Why does <code>num & -num</code> isolate the lowest set bit? Predict the two's-complement reasoning.*

In two's complement, `-num = ~num + 1`. The `~num` flips every bit; adding 1 propagates carries through the trailing zeros until it hits the first 0 bit (which was the original first 1 bit), flipping it back to 1. Result: bits below the lowest set bit are 0, the lowest set bit is 1, bits above are flipped. AND with the original `num`: only the lowest set bit survives (it's 1 in both `num` and `-num`); every other bit has at least one 0.

## The Solution

<div class="lang-tabs">

```python,editable
class Solution:
    def rightmost_set_bit(self, num: int) -> int:
        if num == 0:
            return 0                                # No set bits at all
        # Isolate the lowest set bit, then count trailing zeros to get 1-indexed position.
        isolated = num & -num
        return isolated.bit_length()                # bit_length of a power of 2 is position + 1


if __name__ == "__main__":
    sol = Solution()
    print(sol.rightmost_set_bit(10))   # 2
    print(sol.rightmost_set_bit(16))   # 5
    print(sol.rightmost_set_bit(17))   # 1
```

```java,editable
public class Solution {
    public int rightmostSetBit(int num) {
        if (num == 0) return 0;
        return Integer.numberOfTrailingZeros(num) + 1;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.rightmostSetBit(10));   // 2
    }
}
```

```c,editable
#include <stdio.h>

int rightmost_set_bit(int num) {
    if (num == 0) return 0;
    return __builtin_ctz(num) + 1;       /* count trailing zeros, GCC/Clang built-in */
}

int main(void) {
    printf("%d\n", rightmost_set_bit(10));   /* 2 */
    return 0;
}
```

```cpp,editable
#include <iostream>

class Solution {
public:
    int rightmostSetBit(int num) {
        if (num == 0) return 0;
        return __builtin_ctz(num) + 1;
    }
};

int main() {
    std::cout << Solution().rightmostSetBit(10) << "\n";   // 2
    return 0;
}
```

```scala,editable
class Solution {
  def rightmostSetBit(num: Int): Int = {
    if (num == 0) 0 else Integer.numberOfTrailingZeros(num) + 1
  }
}

object Main extends App {
  println(new Solution().rightmostSetBit(10))   // 2
}
```

```javascript,editable
class Solution {
    rightmostSetBit(num) {
        if (num === 0) return 0;
        // No built-in ctz; use Math.log2 on isolated bit.
        return Math.log2(num & -num) + 1;
    }
}

console.log(new Solution().rightmostSetBit(10));   // 2
```

```typescript,editable
class Solution {
    rightmostSetBit(num: number): number {
        if (num === 0) return 0;
        return Math.log2(num & -num) + 1;
    }
}
```

```go,editable
package main

import (
    "fmt"
    "math/bits"
)

func rightmostSetBit(num int) int {
    if num == 0 { return 0 }
    return bits.TrailingZeros(uint(num)) + 1
}

func main() {
    fmt.Println(rightmostSetBit(10))   // 2
}
```

```kotlin,editable
class Solution {
    fun rightmostSetBit(num: Int): Int =
        if (num == 0) 0 else Integer.numberOfTrailingZeros(num) + 1
}

fun main() {
    println(Solution().rightmostSetBit(10))   // 2
}
```

```rust,editable
fn rightmost_set_bit(num: i32) -> i32 {
    if num == 0 { return 0; }
    (num.trailing_zeros() as i32) + 1
}

fn main() {
    println!("{}", rightmost_set_bit(10));   // 2
}
```

</div>

## Complexity

| Aspect | Cost |
|---|---|
| Time | `O(1)` — single intrinsic instruction on most CPUs |
| Space | `O(1)` |

***

# Final Takeaway

`n & (n - 1)` and `n & -n` are the two most-reused identities in all of bit manipulation:

| Trick | Effect | Use |
|---|---|---|
| `n & (n - 1)` | Clears rightmost set bit | Power-of-2 test, popcount loop, set-bit iteration |
| `n & -n` | Isolates rightmost set bit | Find position of lowest 1, partition by lowest bit |

**You didn't just solve two find-the-bit problems. You learned the two trickiest one-liners in bit manipulation — and the dozens of algorithms built on top of them. From here on, you'll see them used as primitives, not derived: "clear lowest bit" and "isolate lowest bit" become single steps in larger compositions.**

> *Transfer challenge for the next lesson:* Reverse the bits of a 32-bit integer end-to-end (bit 1 becomes bit 32, bit 2 becomes bit 31, …). Predict whether you can do it without an explicit loop. (Hint: yes, but the trick involves divide-and-conquer with magic mask constants.)

<details>
<summary><strong>Answer</strong></summary>

The straightforward solution is a 32-iteration loop: shift result left, OR in the LSB of `num`, shift `num` right. The next lesson uses this approach. There's also a clever divide-and-conquer version using "swap adjacent pairs, then adjacent quads, then bytes" with magic constants like `0xAAAAAAAA` and `0x55555555` — the same magic constants appear in lesson 5 for pairwise swaps. Both are O(1) but the loop is more readable; the divide-and-conquer is faster when bit-reversal is a hot loop.

</details>
