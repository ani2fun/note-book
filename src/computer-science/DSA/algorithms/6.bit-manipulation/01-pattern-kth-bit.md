# 1. Kth-Bit Operations

Numbers don't live as decimal digits inside a CPU — they live as bits. A 32-bit integer is just 32 little switches, each on or off. Most algorithms ignore those switches; they treat numbers as opaque values. But sometimes the *individual bits* are exactly what you need to inspect, set, clear, or flip — packed flags in a permission system, an embedded register, a chess-board occupancy bitmap, or the inner loop of a cryptographic primitive. Bit manipulation is the lowest-level toolkit for these jobs, and four operations form its foundation: **check, set, clear, toggle** the bit at position `k`. Each is a one-line bitwise expression. Each runs in O(1) regardless of the integer's size. Once you internalise these four, every other bit trick in this section is a remix.

By the end of this lesson you'll know the **kth-bit primitives** — `n & (1 << (k-1))` to check, `n | (1 << (k-1))` to set, `n & ~(1 << (k-1))` to clear, `n ^ (1 << (k-1))` to toggle — and you'll see why these patterns reappear in every higher-level bit-manipulation algorithm.

## Table of contents

1. [The Bit-Manipulation Toolkit](#the-bit-manipulation-toolkit)
2. [Kth Bit Check](#kth-bit-check)
3. [Set Kth Bit](#set-kth-bit)
4. [Unset Kth Bit](#unset-kth-bit)
5. [Toggle Kth Bit](#toggle-kth-bit)
6. [Final Takeaway](#final-takeaway)

***

# The Bit-Manipulation Toolkit

> **Course:** DSA › Algorithms › Bit Manipulation › Kth-Bit Operations

A 32-bit integer is a row of 32 boolean cells. The bit at *position k* (counting from 1, starting at the least-significant end) is what the operations target. The trick: every kth-bit operation builds a **mask** — `1 << (k - 1)` — and combines it with the integer using a bitwise operator.

```d2
direction: right
mask: "Mask for k = 3:  1 << (k - 1)" {
  grid-rows: 2
  grid-columns: 8
  grid-gap: 0
  b7: "0"
  b6: "0"
  b5: "0"
  b4: "0"
  b3: "0"
  b2: "1" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  b1: "0"
  b0: "0"
  l7: "[8]"
  l6: "[7]"
  l5: "[6]"
  l4: "[5]"
  l3: "[4]"
  l2: "[3]"
  l1: "[2]"
  l0: "[1]"
}
```

<p align="center"><strong>Mask <code>1 &lt;&lt; (k - 1)</code> for <code>k = 3</code> isolates exactly bit 3. Every kth-bit operation combines this mask with the input via AND / OR / NOT-AND / XOR — one operator per intent.</strong></p>

The four operators map onto the four operations:

| Intent | Operator | Why |
|---|---|---|
| **Check** if bit is on | `&` | AND with mask isolates bit k; non-zero ⇒ on |
| **Set** bit to 1 | `\|` | OR with mask forces bit k to 1; other bits unchanged |
| **Unset** bit to 0 | `& ~` | AND with inverted mask clears bit k; other bits unchanged |
| **Toggle** bit | `^` | XOR with mask flips bit k; other bits unchanged |

The mask is the unifying piece. Every kth-bit operation is "build the mask, apply the right operator." Different operator = different operation.

> *Predict before reading on — what does <code>1 &lt;&lt; (k - 1)</code> compute for <code>k = 1, 2, 3, 8</code>?*

`1, 2, 4, 128`. Each shift left by one doubles the value. `1 << 0 = 1`, `1 << 1 = 2`, `1 << 2 = 4`, `1 << 7 = 128`. The shift count is one less than the position because we 1-index positions but 0-index shifts.

## Indexing — 1-based vs 0-based

This section uses **1-based** bit positions throughout (`k = 1` is the least-significant bit). Many APIs and language libraries use **0-based** positions instead (`k = 0` is the LSB). Translation: the `(k - 1)` in our masks becomes plain `k` if you switch conventions. Pick one and stick with it; mixing is how off-by-one bugs sneak in.

---

## Key Takeaway

Every kth-bit primitive is `mask = 1 << (k - 1)` plus one of four operators. Memorise the mask; the rest is operator selection.

***

# Kth Bit Check

> **Course:** DSA › Algorithms › Bit Manipulation › Kth-Bit Operations

## The Problem

Given a 32-bit signed integer `num` and a non-negative integer `k`, return `true` if the kth bit of `num` is set, otherwise `false`.

```
Input:  num = 1, k = 1
Output: true                  Binary 0001 — bit 1 is set

Input:  num = 3, k = 2
Output: true                  Binary 0011 — bit 2 is set

Input:  num = 2, k = 1
Output: false                 Binary 0010 — bit 1 is unset
```

## The Recurrence

Build mask `1 << (k - 1)` (only bit k is 1). AND with `num` zeroes out every bit *except* bit k. The result is non-zero iff bit k was 1.

```
result = (num & (1 << (k - 1))) != 0
```

> *Pause. Why compare to <code>!= 0</code> instead of <code>== 1</code>? Predict the failure case.*

Because `num & mask` keeps bit k *in its original position*, not at bit 1. For `k = 3` the result is either `0` or `4` — never `1`. Comparing against `1` would falsely return `false` whenever bit k > 1. The non-zero check works for every `k`.

## The Solution

<div class="lang-tabs">

```pseudocode
function kthBitCheck(num, k):
    # Build a mask with only bit k set, then AND with num.
    mask ← 1 shifted left by (k − 1)
    return (num bitwise AND mask) ≠ 0
```

```python,editable
class Solution:
    def kth_bit_check(self, num: int, k: int) -> bool:
        # Build a mask with only bit k set, then AND with num.
        # Non-zero result ⇒ bit k was originally 1.
        return (num & (1 << (k - 1))) != 0


if __name__ == "__main__":
    sol = Solution()
    print(sol.kth_bit_check(1, 1))   # True
    print(sol.kth_bit_check(3, 2))   # True
    print(sol.kth_bit_check(2, 1))   # False
```

```java,editable
public class Solution {
    public boolean kthBitCheck(int num, int k) {
        return (num & (1 << (k - 1))) != 0;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.kthBitCheck(1, 1));   // true
        System.out.println(sol.kthBitCheck(3, 2));   // true
        System.out.println(sol.kthBitCheck(2, 1));   // false
    }
}
```

```c,editable
#include <stdio.h>
#include <stdbool.h>

bool kth_bit_check(int num, int k) {
    return (num & (1 << (k - 1))) != 0;
}

int main(void) {
    printf("%d\n", kth_bit_check(1, 1));   /* 1 */
    printf("%d\n", kth_bit_check(3, 2));   /* 1 */
    printf("%d\n", kth_bit_check(2, 1));   /* 0 */
    return 0;
}
```

```cpp,editable
#include <iostream>

class Solution {
public:
    bool kthBitCheck(int num, int k) {
        return (num & (1 << (k - 1))) != 0;
    }
};

int main() {
    Solution sol;
    std::cout << sol.kthBitCheck(1, 1) << "\n";   // 1
    std::cout << sol.kthBitCheck(3, 2) << "\n";   // 1
    std::cout << sol.kthBitCheck(2, 1) << "\n";   // 0
    return 0;
}
```

```scala,editable
class Solution {
  def kthBitCheck(num: Int, k: Int): Boolean = (num & (1 << (k - 1))) != 0
}

object Main extends App {
  val sol = new Solution()
  println(sol.kthBitCheck(1, 1))   // true
  println(sol.kthBitCheck(3, 2))   // true
}
```

```typescript,editable
class Solution {
    kthBitCheck(num: number, k: number): boolean {
        return (num & (1 << (k - 1))) !== 0;
    }
}
```

```go,editable
package main

import "fmt"

func kthBitCheck(num, k int) bool {
    return (num & (1 << (k - 1))) != 0
}

func main() {
    fmt.Println(kthBitCheck(1, 1))   // true
    fmt.Println(kthBitCheck(3, 2))   // true
    fmt.Println(kthBitCheck(2, 1))   // false
}
```

```rust,editable
fn kth_bit_check(num: i32, k: i32) -> bool {
    (num & (1 << (k - 1))) != 0
}

fn main() {
    println!("{}", kth_bit_check(1, 1));   // true
    println!("{}", kth_bit_check(3, 2));   // true
}
```

</div>

## Complexity

| Aspect | Cost |
|---|---|
| Time | `O(1)` — three operations: shift, AND, compare |
| Space | `O(1)` |

***

# Set Kth Bit

> **Course:** DSA › Algorithms › Bit Manipulation › Kth-Bit Operations

## The Problem

Given `num` and `k`, return `num` with its kth bit forced to 1. If the bit was already 1, the value is unchanged.

```
Input:  num = 0, k = 1
Output: 1                        0000 → 0001

Input:  num = 2, k = 2
Output: 2                        0010 — bit 2 already set; no change

Input:  num = 2, k = 1
Output: 3                        0010 → 0011
```

## The Recurrence

Build mask `1 << (k - 1)`. OR with `num`: every bit of `num` is preserved except bit k, which becomes 1 (because `1 OR anything = 1`).

```
result = num | (1 << (k - 1))
```

> *Pause. Why does OR preserve the other bits exactly? Predict.*

OR's truth table: `0 OR 0 = 0`, `1 OR 0 = 1`, `0 OR 1 = 1`, `1 OR 1 = 1`. ORing with 0 (every bit of the mask except bit k) leaves the original bit untouched. ORing with 1 (only bit k of the mask) forces that bit to 1 regardless of its prior value. Surgical edit.

## The Solution

<div class="lang-tabs">

```pseudocode
function setKthBit(num, k):
    # OR with mask forces bit k to 1; other bits unchanged.
    return num bitwise OR (1 shifted left by (k − 1))
```

```python,editable
class Solution:
    def set_kth_bit(self, num: int, k: int) -> int:
        # OR with mask forces bit k to 1; other bits unchanged.
        return num | (1 << (k - 1))


if __name__ == "__main__":
    sol = Solution()
    print(sol.set_kth_bit(0, 1))   # 1
    print(sol.set_kth_bit(2, 2))   # 2
    print(sol.set_kth_bit(2, 1))   # 3
```

```java,editable
public class Solution {
    public int setKthBit(int num, int k) {
        return num | (1 << (k - 1));
    }
}
```

```c,editable
#include <stdio.h>

int set_kth_bit(int num, int k) {
    return num | (1 << (k - 1));
}

int main(void) {
    printf("%d\n", set_kth_bit(0, 1));   /* 1 */
    printf("%d\n", set_kth_bit(2, 1));   /* 3 */
    return 0;
}
```

```cpp,editable
#include <iostream>

class Solution {
public:
    int setKthBit(int num, int k) {
        return num | (1 << (k - 1));
    }
};

int main() {
    std::cout << Solution().setKthBit(2, 1) << "\n";   // 3
    return 0;
}
```

```scala,editable
class Solution {
  def setKthBit(num: Int, k: Int): Int = num | (1 << (k - 1))
}

object Main extends App {
  println(new Solution().setKthBit(2, 1))   // 3
}
```

```typescript,editable
class Solution {
    setKthBit(num: number, k: number): number {
        return num | (1 << (k - 1));
    }
}
```

```go,editable
package main

import "fmt"

func setKthBit(num, k int) int {
    return num | (1 << (k - 1))
}

func main() {
    fmt.Println(setKthBit(2, 1))   // 3
}
```

```rust,editable
fn set_kth_bit(num: i32, k: i32) -> i32 {
    num | (1 << (k - 1))
}

fn main() {
    println!("{}", set_kth_bit(2, 1));   // 3
}
```

</div>

***

# Unset Kth Bit

> **Course:** DSA › Algorithms › Bit Manipulation › Kth-Bit Operations

## The Problem

Given `num` and `k`, return `num` with its kth bit forced to 0. If the bit was already 0, the value is unchanged.

```
Input:  num = 1, k = 1
Output: 0                        0001 → 0000

Input:  num = 2, k = 1
Output: 2                        0010 — bit 1 already 0; no change

Input:  num = 3, k = 1
Output: 2                        0011 → 0010
```

## The Recurrence

Build mask `1 << (k - 1)`. **Invert** it with `~` so every bit is 1 *except* bit k. AND with `num`: every bit of `num` survives except bit k, which is forced to 0 (because `0 AND anything = 0`).

```
result = num & ~(1 << (k - 1))
```

> *Pause. Why invert the mask first? Predict the failure if you skip the <code>~</code>.*

Without the `~`, you'd be ANDing `num` against a mask that's 0 everywhere except bit k. That zeros out *every* bit except bit k — exact opposite of what you want. The `~` flips every bit so the AND now preserves *all* bits except the one you want to clear.

## The Solution

<div class="lang-tabs">

```pseudocode
function unsetKthBit(num, k):
    # ~mask has all 1s except bit k; AND clears bit k, preserves others.
    mask ← 1 shifted left by (k − 1)
    return num bitwise AND (bitwise NOT mask)
```

```python,editable
class Solution:
    def unset_kth_bit(self, num: int, k: int) -> int:
        # ~mask has all 1s except bit k; AND clears bit k, preserves others.
        return num & ~(1 << (k - 1))


if __name__ == "__main__":
    sol = Solution()
    print(sol.unset_kth_bit(1, 1))   # 0
    print(sol.unset_kth_bit(2, 1))   # 2
    print(sol.unset_kth_bit(3, 1))   # 2
```

```java,editable
public class Solution {
    public int unsetKthBit(int num, int k) {
        return num & ~(1 << (k - 1));
    }
}
```

```c,editable
#include <stdio.h>

int unset_kth_bit(int num, int k) {
    return num & ~(1 << (k - 1));
}

int main(void) {
    printf("%d\n", unset_kth_bit(3, 1));   /* 2 */
    return 0;
}
```

```cpp,editable
#include <iostream>

class Solution {
public:
    int unsetKthBit(int num, int k) {
        return num & ~(1 << (k - 1));
    }
};

int main() {
    std::cout << Solution().unsetKthBit(3, 1) << "\n";   // 2
    return 0;
}
```

```scala,editable
class Solution {
  def unsetKthBit(num: Int, k: Int): Int = num & ~(1 << (k - 1))
}

object Main extends App {
  println(new Solution().unsetKthBit(3, 1))   // 2
}
```

```typescript,editable
class Solution {
    unsetKthBit(num: number, k: number): number {
        return num & ~(1 << (k - 1));
    }
}
```

```go,editable
package main

import "fmt"

func unsetKthBit(num, k int) int {
    return num &^ (1 << (k - 1))    // Go's "AND NOT" operator combines & and ~ in one step
}

func main() {
    fmt.Println(unsetKthBit(3, 1))   // 2
}
```

```rust,editable
fn unset_kth_bit(num: i32, k: i32) -> i32 {
    num & !(1 << (k - 1))           // Rust's ! is bitwise NOT on integers
}

fn main() {
    println!("{}", unset_kth_bit(3, 1));   // 2
}
```

</div>

***

# Toggle Kth Bit

> **Course:** DSA › Algorithms › Bit Manipulation › Kth-Bit Operations

## The Problem

Given `num` and `k`, flip the kth bit — 0 becomes 1, 1 becomes 0.

```
Input:  num = 1, k = 1
Output: 0                        0001 → 0000

Input:  num = 3, k = 1
Output: 2                        0011 → 0010

Input:  num = 3, k = 2
Output: 1                        0011 → 0001
```

## The Recurrence

Build mask `1 << (k - 1)`. XOR with `num`: every bit of `num` is preserved except bit k, which is flipped.

```
result = num ^ (1 << (k - 1))
```

> *Pause. Why does XOR flip exactly one bit? Predict the truth-table reason.*

XOR's truth table: `0 ^ 0 = 0`, `1 ^ 0 = 1`, `0 ^ 1 = 1`, `1 ^ 1 = 0`. XORing with 0 (every mask bit except bit k) leaves the original bit untouched. XORing with 1 (only bit k of the mask) flips that bit. The "preserve under XOR with 0, flip under XOR with 1" property is the engine behind every XOR-based algorithm in this section.

## The Solution

<div class="lang-tabs">

```pseudocode
function toggleKthBit(num, k):
    # XOR with mask flips bit k; other bits unchanged.
    return num bitwise XOR (1 shifted left by (k − 1))
```

```python,editable
class Solution:
    def toggle_kth_bit(self, num: int, k: int) -> int:
        # XOR with mask flips bit k; other bits unchanged.
        return num ^ (1 << (k - 1))


if __name__ == "__main__":
    sol = Solution()
    print(sol.toggle_kth_bit(1, 1))   # 0
    print(sol.toggle_kth_bit(3, 1))   # 2
    print(sol.toggle_kth_bit(3, 2))   # 1
```

```java,editable
public class Solution {
    public int toggleKthBit(int num, int k) {
        return num ^ (1 << (k - 1));
    }
}
```

```c,editable
#include <stdio.h>

int toggle_kth_bit(int num, int k) {
    return num ^ (1 << (k - 1));
}

int main(void) {
    printf("%d\n", toggle_kth_bit(3, 2));   /* 1 */
    return 0;
}
```

```cpp,editable
#include <iostream>

class Solution {
public:
    int toggleKthBit(int num, int k) {
        return num ^ (1 << (k - 1));
    }
};

int main() {
    std::cout << Solution().toggleKthBit(3, 2) << "\n";   // 1
    return 0;
}
```

```scala,editable
class Solution {
  def toggleKthBit(num: Int, k: Int): Int = num ^ (1 << (k - 1))
}

object Main extends App {
  println(new Solution().toggleKthBit(3, 2))   // 1
}
```

```typescript,editable
class Solution {
    toggleKthBit(num: number, k: number): number {
        return num ^ (1 << (k - 1));
    }
}
```

```go,editable
package main

import "fmt"

func toggleKthBit(num, k int) int {
    return num ^ (1 << (k - 1))
}

func main() {
    fmt.Println(toggleKthBit(3, 2))   // 1
}
```

```rust,editable
fn toggle_kth_bit(num: i32, k: i32) -> i32 {
    num ^ (1 << (k - 1))
}

fn main() {
    println!("{}", toggle_kth_bit(3, 2));   // 1
}
```

</div>

***

# Final Takeaway

The kth-bit operations are the alphabet of bit manipulation. Four primitives, one mask:

| Operation | Expression | Operator's Magic |
|---|---|---|
| Check | `num & (1 << (k - 1))` | AND isolates the bit |
| Set | `num \| (1 << (k - 1))` | OR forces to 1 |
| Unset | `num & ~(1 << (k - 1))` | NOT-AND forces to 0 |
| Toggle | `num ^ (1 << (k - 1))` | XOR flips |

**You didn't just learn four one-liners. You internalised the "build a mask, apply an operator" pattern that powers every higher-level bit-manipulation algorithm — bitmask DP, packed flag fields, fast subset enumeration, even cryptographic primitives. The next several lessons add more sophisticated mask-building tricks, but the operator selection stays the same.**

> *Transfer challenge for the next lesson:* Given a number, *find* the position of the only set bit (assuming there is exactly one) — without using a loop or the math library. Predict the trick.

<details>
<summary><strong>Answer</strong></summary>

For a number with exactly one bit set (i.e., a power of 2), `n & (n - 1)` equals 0. To find the *position* of that bit, you can either: take `log2(n) + 1` (math-based), or count bit positions by repeatedly right-shifting until the LSB is 1. The next lesson uses `n & (n - 1)` as the diagnostic test for "is there exactly one set bit?" and combines it with position-finding for two related problems.

</details>
