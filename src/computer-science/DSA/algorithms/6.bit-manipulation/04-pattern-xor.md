# 4. The XOR Pattern

XOR is the most underrated operator in programming. It looks like just-another-bitwise op until you notice three properties most operators don't have: it's **commutative** (`a ^ b = b ^ a`), **associative** (`(a ^ b) ^ c = a ^ (b ^ c)`), and **self-inverse** (`a ^ a = 0`, `a ^ 0 = a`). Combined, those three give XOR a magical talent: **applied twice, it cancels**. Apply XOR to a sequence of numbers in any order; each duplicate vanishes; only the singleton survivors remain. That single insight powers an entire family of algorithms — finding odd-occurring elements, swapping without a temporary, counting differing bits, recovering missing-and-duplicated values from a single pass — all in O(n) time and O(1) space.

By the end of this lesson you'll have written seven XOR-based algorithms, ranging from simple sign-comparison to recovering both a missing *and* duplicated number from one array. The throughline: **XOR cancels pairs**.

## Table of contents

1. [Why XOR Cancels](#why-xor-cancels)
2. [Have Opposite Signs](#have-opposite-signs)
3. [Swap Numbers Without a Temporary](#swap-numbers-without-a-temporary)
4. [Toggle Count](#toggle-count)
5. [Odd-Occurring Element](#odd-occurring-element)
6. [Odd-Occurring Element II](#odd-occurring-element-ii)
7. [Duplicate Element](#duplicate-element)
8. [Missing and Duplicated Elements](#missing-and-duplicated-elements)
9. [Final Takeaway](#final-takeaway)

***

# Why XOR Cancels

> **Course:** DSA › Algorithms › Bit Manipulation › XOR Pattern

Three identities form the algebraic foundation for everything in this lesson:

| Identity | Why it matters |
|---|---|
| `a ^ a = 0` | Same-with-same cancels |
| `a ^ 0 = a` | Identity element |
| `(a ^ b) ^ c = a ^ (b ^ c)` and `a ^ b = b ^ a` | Order doesn't matter |

The combination means that XORing a sequence in *any* order, with arbitrary regrouping, gives the same answer. So if numbers come in pairs (each appearing twice), the pairs cancel pairwise — regardless of how they're interleaved. Whatever's left after all the cancellation is the XOR of the *unpaired* elements.

```d2
direction: right
ex: "XOR cancels pairs across an array" {
  grid-rows: 2
  grid-columns: 7
  grid-gap: 0
  v0: "2"
  v1: "2"
  v2: "2"
  v3: "1" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  v4: "3"
  v5: "1" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  v6: "3"
  l0: ""
  l1: "cancels"
  l2: ""
  l3: ""
  l4: ""
  l5: "cancels"
  l6: ""
}
```

<p align="center"><strong>For <code>arr = [2, 2, 2, 1, 3, 1, 3]</code>, the XOR of all elements collapses pairs (the two 1s cancel, both 3s cancel, two of the three 2s cancel) — leaving just the unpaired <code>2</code>. Order doesn't matter because XOR is commutative and associative.</strong></p>

> *Predict before reading on — for <code>[5, 5, 5, 5, 7]</code>, what's the XOR of all elements?*

`7`. Four 5s pair off and cancel completely (`5 ^ 5 ^ 5 ^ 5 = 0`); then `0 ^ 7 = 7`. The number of times each value appears determines whether it cancels (even count) or survives (odd count).

---

## Key Takeaway

XOR + commutative + associative + self-inverse = pairs cancel regardless of order. The XOR of an array is the XOR of its *odd-occurring* values.

***

# Have Opposite Signs

> **Course:** DSA › Algorithms › Bit Manipulation › XOR Pattern

## The Problem

Given two 32-bit signed integers `num1` and `num2`, return `true` if they have opposite signs (one positive, one negative), `false` otherwise. Treat `0` as positive.

```
Input:  num1 = 10, num2 = -1     →  true
Input:  num1 = 2, num2 = -3      →  true
Input:  num1 = 9, num2 = 1       →  false
```

## The Recurrence

In two's complement, the highest bit is the sign bit (1 ⇒ negative, 0 ⇒ non-negative). XORing two numbers gives a result with sign-bit set iff the two original sign-bits differ. A negative result therefore signals opposite signs.

```
opposite = (num1 ^ num2) < 0
```

> *Pause. Why does <code>(num1 ^ num2) < 0</code> work despite ignoring the lower 31 bits?*

Because in two's complement, "less than zero" is determined by the sign bit alone. Lower bits could be anything — the comparison only inspects the top bit. The XOR's top bit equals 1 iff the inputs' top bits differ. So this becomes a pure sign-bit XOR, expressed as a comparison.

## The Solution

<div class="lang-tabs">

```python,editable
class Solution:
    def have_opposite_signs(self, num1: int, num2: int) -> bool:
        # XOR's sign bit is 1 iff the two operands' sign bits differ.
        return (num1 ^ num2) < 0


if __name__ == "__main__":
    sol = Solution()
    print(sol.have_opposite_signs(10, -1))   # True
    print(sol.have_opposite_signs(2, -3))    # True
    print(sol.have_opposite_signs(9, 1))     # False
```

```java,editable
public class Solution {
    public boolean haveOppositeSigns(int num1, int num2) {
        return (num1 ^ num2) < 0;
    }
}
```

```c,editable
#include <stdio.h>
#include <stdbool.h>

bool have_opposite_signs(int num1, int num2) {
    return (num1 ^ num2) < 0;
}

int main(void) {
    printf("%d\n", have_opposite_signs(10, -1));   /* 1 */
    return 0;
}
```

```cpp,editable
#include <iostream>

class Solution {
public:
    bool haveOppositeSigns(int num1, int num2) { return (num1 ^ num2) < 0; }
};

int main() {
    std::cout << Solution().haveOppositeSigns(10, -1) << "\n";   // 1
    return 0;
}
```

```scala,editable
class Solution {
  def haveOppositeSigns(num1: Int, num2: Int): Boolean = (num1 ^ num2) < 0
}

object Main extends App {
  println(new Solution().haveOppositeSigns(10, -1))   // true
}
```

```javascript,editable
class Solution {
    haveOppositeSigns(num1, num2) {
        return (num1 ^ num2) < 0;
    }
}

console.log(new Solution().haveOppositeSigns(10, -1));   // true
```

```typescript,editable
class Solution {
    haveOppositeSigns(num1: number, num2: number): boolean {
        return (num1 ^ num2) < 0;
    }
}
```

```go,editable
package main

import "fmt"

func haveOppositeSigns(num1, num2 int32) bool {
    return (num1 ^ num2) < 0
}

func main() {
    fmt.Println(haveOppositeSigns(10, -1))   // true
}
```

```kotlin,editable
class Solution {
    fun haveOppositeSigns(num1: Int, num2: Int): Boolean = (num1 xor num2) < 0
}

fun main() {
    println(Solution().haveOppositeSigns(10, -1))   // true
}
```

```rust,editable
fn have_opposite_signs(num1: i32, num2: i32) -> bool {
    (num1 ^ num2) < 0
}

fn main() {
    println!("{}", have_opposite_signs(10, -1));   // true
}
```

</div>

***

# Swap Numbers Without a Temporary

> **Course:** DSA › Algorithms › Bit Manipulation › XOR Pattern

## The Problem

Given two integers, swap their values *in place* without using a third (temporary) variable.

```
Input:  num1 = 10, num2 = 1   →  num1 = 1, num2 = 10
Input:  num1 = 9, num2 = 1    →  num1 = 1, num2 = 9
```

## The Recurrence — Three XORs

```
num1 = num1 ^ num2          (now num1 holds num1 ^ num2)
num2 = num1 ^ num2          (= num1 ^ num2 ^ num2 = num1, the original)
num1 = num1 ^ num2          (= (num1 ^ num2) ^ original_num1 = original_num2)
```

Each step relies on the self-inverse property: applying the same XOR twice cancels back to the input.

> *Pause. What happens if <code>num1</code> and <code>num2</code> are at the same memory location? Predict.*

Disaster. Step 1 sets the location to `x ^ x = 0`. Step 2 sets it to `0 ^ 0 = 0`. Step 3 same. You get `0, 0` instead of the original values. So XOR-swap is *only* safe when the two operands are guaranteed distinct memory locations. Add a guard `if num1 != num2` (or by-pointer-equality) when in doubt — the original C++ code does this.

## The Solution

<div class="lang-tabs">

```python,editable
class Solution:
    def swap_numbers(self, num1: int, num2: int) -> tuple[int, int]:
        if num1 != num2:
            num1 ^= num2
            num2 ^= num1                            # = num2 ^ original_num1 ^ num2 = original_num1
            num1 ^= num2                            # = (num1 ^ num2) ^ original_num1 = original_num2
        return num1, num2


if __name__ == "__main__":
    sol = Solution()
    print(sol.swap_numbers(10, 1))    # (1, 10)
    print(sol.swap_numbers(2, 3))     # (3, 2)
```

```java,editable
public class Solution {
    public int[] swapNumbers(int num1, int num2) {
        if (num1 != num2) {
            num1 ^= num2;
            num2 ^= num1;
            num1 ^= num2;
        }
        return new int[]{num1, num2};
    }
}
```

```c,editable
#include <stdio.h>

void swap_numbers(int *num1, int *num2) {
    if (*num1 != *num2) {
        *num1 ^= *num2;
        *num2 ^= *num1;
        *num1 ^= *num2;
    }
}

int main(void) {
    int a = 10, b = 1;
    swap_numbers(&a, &b);
    printf("%d, %d\n", a, b);   /* 1, 10 */
    return 0;
}
```

```cpp,editable
#include <iostream>

class Solution {
public:
    void swapNumbers(int& num1, int& num2) {
        if (&num1 == &num2) return;
        if (num1 != num2) { num1 ^= num2; num2 ^= num1; num1 ^= num2; }
    }
};

int main() {
    int a = 10, b = 1;
    Solution().swapNumbers(a, b);
    std::cout << a << ", " << b << "\n";   // 1, 10
    return 0;
}
```

```scala,editable
class Solution {
  def swapNumbers(num1: Int, num2: Int): (Int, Int) = {
    if (num1 == num2) (num1, num2)
    else {
      val a = num1 ^ num2
      val b = a ^ num2
      val c = a ^ b
      (c, b)
    }
  }
}

object Main extends App {
  println(new Solution().swapNumbers(10, 1))   // (1,10)
}
```

```javascript,editable
class Solution {
    swapNumbers(num1, num2) {
        if (num1 !== num2) {
            num1 ^= num2;
            num2 ^= num1;
            num1 ^= num2;
        }
        return [num1, num2];
    }
}

console.log(new Solution().swapNumbers(10, 1));   // [1, 10]
```

```typescript,editable
class Solution {
    swapNumbers(num1: number, num2: number): [number, number] {
        if (num1 !== num2) {
            num1 ^= num2;
            num2 ^= num1;
            num1 ^= num2;
        }
        return [num1, num2];
    }
}
```

```go,editable
package main

import "fmt"

func swapNumbers(num1, num2 int) (int, int) {
    if num1 != num2 {
        num1 ^= num2
        num2 ^= num1
        num1 ^= num2
    }
    return num1, num2
}

func main() {
    fmt.Println(swapNumbers(10, 1))   // 1 10
}
```

```kotlin,editable
class Solution {
    fun swapNumbers(num1: Int, num2: Int): Pair<Int, Int> {
        var a = num1; var b = num2
        if (a != b) { a = a xor b; b = a xor b; a = a xor b }
        return Pair(a, b)
    }
}

fun main() {
    println(Solution().swapNumbers(10, 1))   // (1, 10)
}
```

```rust,editable
fn swap_numbers(num1: i32, num2: i32) -> (i32, i32) {
    let (mut a, mut b) = (num1, num2);
    if a != b { a ^= b; b ^= a; a ^= b; }
    (a, b)
}

fn main() {
    println!("{:?}", swap_numbers(10, 1));   // (1, 10)
}
```

</div>

***

# Toggle Count

> **Course:** DSA › Algorithms › Bit Manipulation › XOR Pattern

## The Problem

Given two integers `num1` and `num2`, return the number of bits that need to be flipped to convert one into the other.

```
Input:  num1 = 10, num2 = 1   →  3       Binary 1010 vs 0001 — 3 differing positions
Input:  num1 = 2, num2 = 3    →  1       Binary 10 vs 11 — only LSB differs
```

## The Recurrence — XOR Then Popcount

`num1 ^ num2` has a 1 in every position where `num1` and `num2` *differ*. Counting set bits in the XOR gives the number of differing positions — exactly the toggle count.

The set-bit count uses **Brian Kernighan's algorithm**: repeatedly clear the lowest set bit (`n & (n - 1)`) until zero, counting iterations. Faster than scanning all 32 positions when the bit count is small.

> *Pause. Why is Brian Kernighan's algorithm faster than a 32-position scan?*

It runs in **O(set-bit count)** rather than O(bit-width). For sparse integers (few bits set), this is much faster — `n = 1` runs one iteration vs. 32. For dense integers it's about the same. CPUs also have a `popcount` instruction that's faster still; we use the manual version here for clarity.

## The Solution

<div class="lang-tabs">

```python,editable
class Solution:
    def toggle_count(self, num1: int, num2: int) -> int:
        diff = num1 ^ num2                          # 1s where bits differ
        count = 0
        while diff:
            diff &= diff - 1                        # Clear lowest set bit (Kernighan)
            count += 1
        return count


if __name__ == "__main__":
    sol = Solution()
    print(sol.toggle_count(10, 1))   # 3
    print(sol.toggle_count(2, 3))    # 1
```

```java,editable
public class Solution {
    public int toggleCount(int num1, int num2) {
        int diff = num1 ^ num2;
        int count = 0;
        while (diff != 0) { diff &= diff - 1; count++; }
        return count;
    }
}
```

```c,editable
#include <stdio.h>

int toggle_count(int num1, int num2) {
    int diff = num1 ^ num2, count = 0;
    while (diff) { diff &= diff - 1; count++; }
    return count;
}

int main(void) {
    printf("%d\n", toggle_count(10, 1));   /* 3 */
    return 0;
}
```

```cpp,editable
#include <iostream>

class Solution {
public:
    int toggleCount(int num1, int num2) {
        int diff = num1 ^ num2, count = 0;
        while (diff) { diff &= diff - 1; count++; }
        return count;
    }
};

int main() {
    std::cout << Solution().toggleCount(10, 1) << "\n";   // 3
    return 0;
}
```

```scala,editable
class Solution {
  def toggleCount(num1: Int, num2: Int): Int = Integer.bitCount(num1 ^ num2)
}

object Main extends App {
  println(new Solution().toggleCount(10, 1))   // 3
}
```

```javascript,editable
class Solution {
    toggleCount(num1, num2) {
        let diff = num1 ^ num2, count = 0;
        while (diff) { diff &= diff - 1; count++; }
        return count;
    }
}

console.log(new Solution().toggleCount(10, 1));   // 3
```

```typescript,editable
class Solution {
    toggleCount(num1: number, num2: number): number {
        let diff = num1 ^ num2, count = 0;
        while (diff) { diff &= diff - 1; count++; }
        return count;
    }
}
```

```go,editable
package main

import (
    "fmt"
    "math/bits"
)

func toggleCount(num1, num2 uint32) int {
    return bits.OnesCount32(num1 ^ num2)            // Standard library popcount
}

func main() {
    fmt.Println(toggleCount(10, 1))   // 3
}
```

```kotlin,editable
class Solution {
    fun toggleCount(num1: Int, num2: Int): Int = Integer.bitCount(num1 xor num2)
}

fun main() {
    println(Solution().toggleCount(10, 1))   // 3
}
```

```rust,editable
fn toggle_count(num1: i32, num2: i32) -> u32 {
    (num1 ^ num2).count_ones()                      // Built-in popcount
}

fn main() {
    println!("{}", toggle_count(10, 1));   // 3
}
```

</div>

***

# Odd-Occurring Element

> **Course:** DSA › Algorithms › Bit Manipulation › XOR Pattern

## The Problem

Given an array where every element appears an even number of times *except one* that appears an odd number of times, find the odd-occurring element. Required: O(n) time, O(1) space.

```
Input:  [2, 2, 2, 1, 3, 1, 4, 3, 1, 4, 1]   →  2     (the 2 appears 3 times — odd)
Input:  [1, 2, 1, 1, 2, 1, 1]                →  1
Input:  [6, 7, 6, 7, 6, 7, 6]                →  7
```

## The Recurrence — XOR All

XOR every element. Pairs cancel; the odd-out survives. One linear pass; one accumulator variable.

```
result = arr[0] ^ arr[1] ^ ... ^ arr[n-1]
```

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List
from functools import reduce
from operator import xor

class Solution:
    def odd_occurring_element(self, arr: List[int]) -> int:
        return reduce(xor, arr, 0)


if __name__ == "__main__":
    sol = Solution()
    print(sol.odd_occurring_element([2, 2, 2, 1, 3, 1, 4, 3, 1, 4, 1]))   # 2
```

```java,editable
public class Solution {
    public int oddOccurringElement(int[] arr) {
        int result = 0;
        for (int v : arr) result ^= v;
        return result;
    }
}
```

```c,editable
#include <stdio.h>

int odd_occurring_element(const int *arr, int n) {
    int result = 0;
    for (int i = 0; i < n; i++) result ^= arr[i];
    return result;
}

int main(void) {
    int a[] = {2, 2, 2, 1, 3, 1, 4, 3, 1, 4, 1};
    printf("%d\n", odd_occurring_element(a, 11));   /* 2 */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

class Solution {
public:
    int oddOccurringElement(std::vector<int>& arr) {
        int result = 0;
        for (int v : arr) result ^= v;
        return result;
    }
};

int main() {
    std::vector<int> a = {2, 2, 2, 1, 3, 1, 4, 3, 1, 4, 1};
    std::cout << Solution().oddOccurringElement(a) << "\n";   // 2
    return 0;
}
```

```scala,editable
class Solution {
  def oddOccurringElement(arr: Array[Int]): Int = arr.foldLeft(0)(_ ^ _)
}

object Main extends App {
  println(new Solution().oddOccurringElement(Array(2,2,2,1,3,1,4,3,1,4,1)))   // 2
}
```

```javascript,editable
class Solution {
    oddOccurringElement(arr) {
        return arr.reduce((acc, v) => acc ^ v, 0);
    }
}

console.log(new Solution().oddOccurringElement([2,2,2,1,3,1,4,3,1,4,1]));   // 2
```

```typescript,editable
class Solution {
    oddOccurringElement(arr: number[]): number {
        return arr.reduce((acc, v) => acc ^ v, 0);
    }
}
```

```go,editable
package main

import "fmt"

func oddOccurringElement(arr []int) int {
    result := 0
    for _, v := range arr { result ^= v }
    return result
}

func main() {
    fmt.Println(oddOccurringElement([]int{2,2,2,1,3,1,4,3,1,4,1}))   // 2
}
```

```kotlin,editable
class Solution {
    fun oddOccurringElement(arr: IntArray): Int = arr.fold(0) { a, b -> a xor b }
}

fun main() {
    println(Solution().oddOccurringElement(intArrayOf(2,2,2,1,3,1,4,3,1,4,1)))   // 2
}
```

```rust,editable
fn odd_occurring_element(arr: &[i32]) -> i32 {
    arr.iter().fold(0, |acc, &v| acc ^ v)
}

fn main() {
    println!("{}", odd_occurring_element(&[2,2,2,1,3,1,4,3,1,4,1]));   // 2
}
```

</div>

***

# Odd-Occurring Element II

> **Course:** DSA › Algorithms › Bit Manipulation › XOR Pattern

## The Problem

Same setup, but **two** elements occur an odd number of times. Return both, in any order.

```
Input:  [2, 2, 2, 1, 3, 1, 4, 3, 1, 4, 1, 5]   →  [2, 5]
Input:  [1, 2, 1, 1, 2, 3, 1, 3, 1, 3]          →  [1, 3]
Input:  [1, 2]                                  →  [1, 2]
```

## The Recurrence — Partition by a Differing Bit

XOR everything: result = `a ^ b`, where `a, b` are the two odd-occurring elements.

But `a ^ b` is a single number; we need to *separate* them. Find any bit where `a` and `b` differ — that bit must be set in `a ^ b`. The lowest such bit is `(a ^ b) & -(a ^ b)`.

Now partition the array by that bit: elements with the bit set XOR to `a`; elements without XOR to `b`. (Inside each partition, all even-count elements still cancel pairwise — they're either entirely in one bucket or the other.)

```d2
direction: right
flow: "Partition the array by the lowest bit where a and b differ" {
  grid-rows: 1
  grid-columns: 3
  grid-gap: 20
  s1: |md
    **Step 1**
    XOR all → `a ^ b`
  |
  s2: |md
    **Step 2**
    Isolate lowest set bit of `a ^ b`
  |
  s3: |md
    **Step 3**
    Partition; XOR each bucket → `a` and `b`
  |
}
```

<p align="center"><strong>Two passes total. The lowest differing bit cleanly splits <code>a</code> from <code>b</code>; even-count elements stay paired inside their bucket.</strong></p>

> *Pause. Why is the lowest differing bit guaranteed to exist?*

Because `a != b` (otherwise they'd be the same element). At least one bit must differ; the *lowest* such bit is just the lowest set bit of `a ^ b`. If `a == b` had been allowed, `a ^ b = 0` and isolation would fail — but the problem rules out that case.

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def odd_occurring_element_ii(self, arr: List[int]) -> List[int]:
        xor_all = 0
        for v in arr:
            xor_all ^= v                            # = a ^ b
        diff_bit = xor_all & -xor_all               # Isolate lowest differing bit
        a = b = 0
        for v in arr:
            if v & diff_bit:
                a ^= v                              # Bucket 1 — bit set
            else:
                b ^= v                              # Bucket 2 — bit unset
        return [a, b]


if __name__ == "__main__":
    sol = Solution()
    print(sol.odd_occurring_element_ii([2,2,2,1,3,1,4,3,1,4,1,5]))   # [2, 5] (order may vary)
```

```java,editable
public class Solution {
    public int[] oddOccurringElementII(int[] arr) {
        int xorAll = 0;
        for (int v : arr) xorAll ^= v;
        int diffBit = xorAll & -xorAll;
        int a = 0, b = 0;
        for (int v : arr) {
            if ((v & diffBit) != 0) a ^= v;
            else b ^= v;
        }
        return new int[]{a, b};
    }
}
```

```c,editable
#include <stdio.h>

void odd_occurring_element_ii(const int *arr, int n, int *out_a, int *out_b) {
    int xor_all = 0;
    for (int i = 0; i < n; i++) xor_all ^= arr[i];
    int diff_bit = xor_all & -xor_all;
    int a = 0, b = 0;
    for (int i = 0; i < n; i++) {
        if (arr[i] & diff_bit) a ^= arr[i];
        else b ^= arr[i];
    }
    *out_a = a; *out_b = b;
}

int main(void) {
    int a[] = {2,2,2,1,3,1,4,3,1,4,1,5};
    int x, y;
    odd_occurring_element_ii(a, 12, &x, &y);
    printf("%d, %d\n", x, y);   /* 2, 5 (order may vary) */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

class Solution {
public:
    std::vector<int> oddOccurringElementII(std::vector<int>& arr) {
        int xorAll = 0;
        for (int v : arr) xorAll ^= v;
        int diffBit = xorAll & -xorAll;
        int a = 0, b = 0;
        for (int v : arr) {
            if (v & diffBit) a ^= v;
            else b ^= v;
        }
        return {a, b};
    }
};

int main() {
    std::vector<int> a = {2,2,2,1,3,1,4,3,1,4,1,5};
    auto out = Solution().oddOccurringElementII(a);
    std::cout << out[0] << ", " << out[1] << "\n";
    return 0;
}
```

```scala,editable
class Solution {
  def oddOccurringElementII(arr: Array[Int]): Array[Int] = {
    val xorAll = arr.foldLeft(0)(_ ^ _)
    val diffBit = xorAll & -xorAll
    var a = 0; var b = 0
    for (v <- arr) {
      if ((v & diffBit) != 0) a ^= v else b ^= v
    }
    Array(a, b)
  }
}

object Main extends App {
  println(new Solution().oddOccurringElementII(Array(2,2,2,1,3,1,4,3,1,4,1,5)).mkString(","))
}
```

```javascript,editable
class Solution {
    oddOccurringElementII(arr) {
        let xorAll = 0;
        for (const v of arr) xorAll ^= v;
        const diffBit = xorAll & -xorAll;
        let a = 0, b = 0;
        for (const v of arr) {
            if (v & diffBit) a ^= v; else b ^= v;
        }
        return [a, b];
    }
}

console.log(new Solution().oddOccurringElementII([2,2,2,1,3,1,4,3,1,4,1,5]));
```

```typescript,editable
class Solution {
    oddOccurringElementII(arr: number[]): [number, number] {
        let xorAll = 0;
        for (const v of arr) xorAll ^= v;
        const diffBit = xorAll & -xorAll;
        let a = 0, b = 0;
        for (const v of arr) {
            if (v & diffBit) a ^= v; else b ^= v;
        }
        return [a, b];
    }
}
```

```go,editable
package main

import "fmt"

func oddOccurringElementII(arr []int) [2]int {
    xorAll := 0
    for _, v := range arr { xorAll ^= v }
    diffBit := xorAll & -xorAll
    a, b := 0, 0
    for _, v := range arr {
        if v & diffBit != 0 { a ^= v } else { b ^= v }
    }
    return [2]int{a, b}
}

func main() {
    fmt.Println(oddOccurringElementII([]int{2,2,2,1,3,1,4,3,1,4,1,5}))
}
```

```kotlin,editable
class Solution {
    fun oddOccurringElementII(arr: IntArray): IntArray {
        val xorAll = arr.fold(0) { a, b -> a xor b }
        val diffBit = xorAll and -xorAll
        var a = 0; var b = 0
        for (v in arr) {
            if ((v and diffBit) != 0) a = a xor v else b = b xor v
        }
        return intArrayOf(a, b)
    }
}

fun main() {
    println(Solution().oddOccurringElementII(intArrayOf(2,2,2,1,3,1,4,3,1,4,1,5)).toList())
}
```

```rust,editable
fn odd_occurring_element_ii(arr: &[i32]) -> [i32; 2] {
    let xor_all = arr.iter().fold(0, |acc, &v| acc ^ v);
    let diff_bit = xor_all & xor_all.wrapping_neg();
    let mut a = 0; let mut b = 0;
    for &v in arr {
        if v & diff_bit != 0 { a ^= v; } else { b ^= v; }
    }
    [a, b]
}

fn main() {
    println!("{:?}", odd_occurring_element_ii(&[2,2,2,1,3,1,4,3,1,4,1,5]));
}
```

</div>

***

# Duplicate Element

> **Course:** DSA › Algorithms › Bit Manipulation › XOR Pattern

## The Problem

You're given an array of size `n` containing elements from `1` to `n - 1`. Exactly one element appears twice; everyone else appears once. Find the duplicate.

```
Input:  [1, 4, 3, 2, 2]    →  2
Input:  [4, 1, 5, 3, 2, 5] →  5
Input:  [1, 1]             →  1
```

## The Recurrence — XOR Array Against XOR of `1..n-1`

XOR all array elements together; XOR `1, 2, …, n-1` together; XOR those two results.

- The unique elements appear once in the array and once in `1..n-1`, so they cancel.
- The duplicate appears *twice* in the array and once in `1..n-1` — three appearances total → it survives (odd count).

```
result = (arr[0] ^ arr[1] ^ ... ^ arr[n-1]) ^ (1 ^ 2 ^ ... ^ (n-1))
       = duplicate
```

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def duplicate_element(self, arr: List[int]) -> int:
        n = len(arr)
        result = 0
        for v in arr:
            result ^= v                             # XOR array contents
        for i in range(1, n):
            result ^= i                             # XOR 1..n-1
        return result


if __name__ == "__main__":
    sol = Solution()
    print(sol.duplicate_element([1, 4, 3, 2, 2]))     # 2
    print(sol.duplicate_element([4, 1, 5, 3, 2, 5]))  # 5
```

```java,editable
public class Solution {
    public int duplicateElement(int[] arr) {
        int n = arr.length, result = 0;
        for (int v : arr) result ^= v;
        for (int i = 1; i < n; i++) result ^= i;
        return result;
    }
}
```

```c,editable
#include <stdio.h>

int duplicate_element(const int *arr, int n) {
    int result = 0;
    for (int i = 0; i < n; i++) result ^= arr[i];
    for (int i = 1; i < n; i++) result ^= i;
    return result;
}

int main(void) {
    int a[] = {1, 4, 3, 2, 2};
    printf("%d\n", duplicate_element(a, 5));   /* 2 */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

class Solution {
public:
    int duplicateElement(std::vector<int>& arr) {
        int n = arr.size(), result = 0;
        for (int v : arr) result ^= v;
        for (int i = 1; i < n; i++) result ^= i;
        return result;
    }
};

int main() {
    std::vector<int> a = {1, 4, 3, 2, 2};
    std::cout << Solution().duplicateElement(a) << "\n";   // 2
    return 0;
}
```

```scala,editable
class Solution {
  def duplicateElement(arr: Array[Int]): Int = {
    val n = arr.length
    var result = arr.foldLeft(0)(_ ^ _)
    for (i <- 1 until n) result ^= i
    result
  }
}

object Main extends App {
  println(new Solution().duplicateElement(Array(1, 4, 3, 2, 2)))   // 2
}
```

```javascript,editable
class Solution {
    duplicateElement(arr) {
        const n = arr.length;
        let result = 0;
        for (const v of arr) result ^= v;
        for (let i = 1; i < n; i++) result ^= i;
        return result;
    }
}

console.log(new Solution().duplicateElement([1, 4, 3, 2, 2]));   // 2
```

```typescript,editable
class Solution {
    duplicateElement(arr: number[]): number {
        const n = arr.length;
        let result = 0;
        for (const v of arr) result ^= v;
        for (let i = 1; i < n; i++) result ^= i;
        return result;
    }
}
```

```go,editable
package main

import "fmt"

func duplicateElement(arr []int) int {
    n := len(arr)
    result := 0
    for _, v := range arr { result ^= v }
    for i := 1; i < n; i++ { result ^= i }
    return result
}

func main() {
    fmt.Println(duplicateElement([]int{1, 4, 3, 2, 2}))   // 2
}
```

```kotlin,editable
class Solution {
    fun duplicateElement(arr: IntArray): Int {
        var result = arr.fold(0) { a, b -> a xor b }
        for (i in 1 until arr.size) result = result xor i
        return result
    }
}

fun main() {
    println(Solution().duplicateElement(intArrayOf(1, 4, 3, 2, 2)))   // 2
}
```

```rust,editable
fn duplicate_element(arr: &[i32]) -> i32 {
    let n = arr.len();
    let mut result = arr.iter().fold(0, |acc, &v| acc ^ v);
    for i in 1..n as i32 { result ^= i; }
    result
}

fn main() {
    println!("{}", duplicate_element(&[1, 4, 3, 2, 2]));   // 2
}
```

</div>

***

# Missing and Duplicated Elements

> **Course:** DSA › Algorithms › Bit Manipulation › XOR Pattern

## The Problem

An array of size `n` should contain elements from `1` to `n`, but one element is missing and another is duplicated (appears twice). Return both — in any order.

```
Input:  [1, 5, 2, 4, 2]    →  [2, 3]   (2 is duplicated, 3 is missing)
Input:  [2, 4, 1, 3, 6, 6] →  [5, 6]   (6 is duplicated, 5 is missing)
Input:  [1, 1]             →  [1, 2]
```

## The Recurrence — Same Trick as "Two Odd Elements"

XOR the array together with `1..n`. Most elements cancel; only the missing and the duplicated survive — with the duplicated appearing 2× in the array and 1× in `1..n` (3 total → survives), and the missing appearing 0× in the array and 1× in `1..n` (1 total → survives). Result is `missing ^ duplicated`.

Now we have two unknowns and one equation — not enough. Apply the **odd-occurring-element II partition trick**: isolate any differing bit, split into two buckets, XOR each bucket against the array *and* against `1..n`. Each bucket isolates exactly one of the two values.

Final step: figure out which value is the missing one (it's *not* in the array) and which is the duplicate. Linear scan to disambiguate.

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

class Solution:
    def missing_and_duplicated(self, arr: List[int]) -> List[int]:
        n = len(arr)
        # Step 1: XOR array against 1..n.  Result = missing ^ duplicated.
        x = n                                         # Start with n so we cover 1..n via XOR with i
        for i, v in enumerate(arr):
            x ^= v ^ i                                # i covers 0..n-1; combined with starting n we get 1..n
        # Step 2: pick a differing bit and partition.
        diff_bit = x & -x
        a = b = 0
        for v in arr:
            if v & diff_bit:
                a ^= v
            else:
                b ^= v
        for i in range(1, n + 1):
            if i & diff_bit:
                a ^= i
            else:
                b ^= i
        # Step 3: identify which of a, b is the missing one.
        if a not in arr:
            return [b, a]                             # [duplicated, missing]
        return [a, b]


if __name__ == "__main__":
    sol = Solution()
    print(sol.missing_and_duplicated([1, 5, 2, 4, 2]))   # [2, 3]
```

```java,editable
import java.util.*;

public class Solution {
    public int[] missingAndDuplicated(int[] arr) {
        int n = arr.length;
        int x = n;
        for (int i = 0; i < n; i++) x ^= arr[i] ^ i;
        int diffBit = x & -x;
        int a = 0, b = 0;
        for (int v : arr) {
            if ((v & diffBit) != 0) a ^= v; else b ^= v;
        }
        for (int i = 1; i <= n; i++) {
            if ((i & diffBit) != 0) a ^= i; else b ^= i;
        }
        for (int v : arr) if (v == a) return new int[]{a, b};
        return new int[]{b, a};
    }
}
```

```c,editable
#include <stdio.h>
#include <stdbool.h>

void missing_and_duplicated(const int *arr, int n, int *out_dup, int *out_miss) {
    int x = n;
    for (int i = 0; i < n; i++) x ^= arr[i] ^ i;
    int diff_bit = x & -x;
    int a = 0, b = 0;
    for (int i = 0; i < n; i++) {
        if (arr[i] & diff_bit) a ^= arr[i]; else b ^= arr[i];
    }
    for (int i = 1; i <= n; i++) {
        if (i & diff_bit) a ^= i; else b ^= i;
    }
    bool a_in_arr = false;
    for (int i = 0; i < n; i++) if (arr[i] == a) { a_in_arr = true; break; }
    if (a_in_arr) { *out_dup = a; *out_miss = b; }
    else          { *out_dup = b; *out_miss = a; }
}

int main(void) {
    int a[] = {1, 5, 2, 4, 2};
    int dup, miss;
    missing_and_duplicated(a, 5, &dup, &miss);
    printf("dup=%d miss=%d\n", dup, miss);   /* dup=2 miss=3 */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<int> missingAndDuplicated(std::vector<int>& arr) {
        int n = arr.size(), x = n;
        for (int i = 0; i < n; i++) x ^= arr[i] ^ i;
        int diffBit = x & -x;
        int a = 0, b = 0;
        for (int v : arr) { if (v & diffBit) a ^= v; else b ^= v; }
        for (int i = 1; i <= n; i++) { if (i & diffBit) a ^= i; else b ^= i; }
        if (std::find(arr.begin(), arr.end(), a) == arr.end()) return {b, a};
        return {a, b};
    }
};

int main() {
    std::vector<int> a = {1, 5, 2, 4, 2};
    auto out = Solution().missingAndDuplicated(a);
    std::cout << out[0] << ", " << out[1] << "\n";
    return 0;
}
```

```scala,editable
class Solution {
  def missingAndDuplicated(arr: Array[Int]): Array[Int] = {
    val n = arr.length
    var x = n
    for (i <- 0 until n) x ^= arr(i) ^ i
    val diffBit = x & -x
    var a = 0; var b = 0
    for (v <- arr) { if ((v & diffBit) != 0) a ^= v else b ^= v }
    for (i <- 1 to n) { if ((i & diffBit) != 0) a ^= i else b ^= i }
    if (!arr.contains(a)) Array(b, a) else Array(a, b)
  }
}

object Main extends App {
  println(new Solution().missingAndDuplicated(Array(1, 5, 2, 4, 2)).mkString(","))
}
```

```javascript,editable
class Solution {
    missingAndDuplicated(arr) {
        const n = arr.length;
        let x = n;
        for (let i = 0; i < n; i++) x ^= arr[i] ^ i;
        const diffBit = x & -x;
        let a = 0, b = 0;
        for (const v of arr) { if (v & diffBit) a ^= v; else b ^= v; }
        for (let i = 1; i <= n; i++) { if (i & diffBit) a ^= i; else b ^= i; }
        return arr.includes(a) ? [a, b] : [b, a];
    }
}

console.log(new Solution().missingAndDuplicated([1, 5, 2, 4, 2]));
```

```typescript,editable
class Solution {
    missingAndDuplicated(arr: number[]): [number, number] {
        const n = arr.length;
        let x = n;
        for (let i = 0; i < n; i++) x ^= arr[i] ^ i;
        const diffBit = x & -x;
        let a = 0, b = 0;
        for (const v of arr) { if (v & diffBit) a ^= v; else b ^= v; }
        for (let i = 1; i <= n; i++) { if (i & diffBit) a ^= i; else b ^= i; }
        return arr.includes(a) ? [a, b] : [b, a];
    }
}
```

```go,editable
package main

import "fmt"

func missingAndDuplicated(arr []int) [2]int {
    n := len(arr)
    x := n
    for i := 0; i < n; i++ { x ^= arr[i] ^ i }
    diffBit := x & -x
    a, b := 0, 0
    for _, v := range arr { if v & diffBit != 0 { a ^= v } else { b ^= v } }
    for i := 1; i <= n; i++ { if i & diffBit != 0 { a ^= i } else { b ^= i } }
    for _, v := range arr { if v == a { return [2]int{a, b} } }
    return [2]int{b, a}
}

func main() {
    fmt.Println(missingAndDuplicated([]int{1, 5, 2, 4, 2}))
}
```

```kotlin,editable
class Solution {
    fun missingAndDuplicated(arr: IntArray): IntArray {
        val n = arr.size
        var x = n
        for (i in 0 until n) x = x xor arr[i] xor i
        val diffBit = x and -x
        var a = 0; var b = 0
        for (v in arr) { if ((v and diffBit) != 0) a = a xor v else b = b xor v }
        for (i in 1..n) { if ((i and diffBit) != 0) a = a xor i else b = b xor i }
        return if (arr.contains(a)) intArrayOf(a, b) else intArrayOf(b, a)
    }
}

fun main() {
    println(Solution().missingAndDuplicated(intArrayOf(1, 5, 2, 4, 2)).toList())
}
```

```rust,editable
fn missing_and_duplicated(arr: &[i32]) -> [i32; 2] {
    let n = arr.len();
    let mut x = n as i32;
    for i in 0..n { x ^= arr[i] ^ (i as i32); }
    let diff_bit = x & x.wrapping_neg();
    let mut a = 0; let mut b = 0;
    for &v in arr { if v & diff_bit != 0 { a ^= v; } else { b ^= v; } }
    for i in 1..=(n as i32) { if i & diff_bit != 0 { a ^= i; } else { b ^= i; } }
    if arr.contains(&a) { [a, b] } else { [b, a] }
}

fn main() {
    println!("{:?}", missing_and_duplicated(&[1, 5, 2, 4, 2]));
}
```

</div>

***

# Final Takeaway

Seven problems, one operator. The XOR pattern's recipe:

| Problem | What XOR cancels | What survives |
|---|---|---|
| Opposite signs | (none — direct sign-bit comparison) | sign-difference flag |
| Swap | self-inversion | the swapped values |
| Toggle count | matching bits | a value whose popcount = differences |
| Odd-occurring | even-count pairs | the odd-count value |
| Two odd-occurring | even-count pairs | partition into two singletons |
| Duplicate | unique values | the doubled-and-once-more = three-times value |
| Missing + duplicated | matched values | partition into missing + duplicated |

**You didn't just learn seven tricks. You internalised the most algebraically elegant operator in computing — XOR — and saw how its three properties (commutative, associative, self-inverse) collapse seemingly hard problems into linear scans. From here on, "XOR everything together" is a tool in your toolkit, and `xor & -xor` to isolate a differing bit is the partition primitive that handles the two-unknown case.**

> *Transfer challenge for the next lesson:* You have a 32-bit integer and want to swap *every adjacent pair* of bits — bit 1 with bit 2, bit 3 with bit 4, etc. — without an explicit loop. Predict how the magic constants `0x55555555` and `0xAAAAAAAA` come into play.

<details>
<summary><strong>Answer</strong></summary>

`0x55555555` masks the odd-positioned bits (1, 3, 5, …); `0xAAAAAAAA` masks the even-positioned bits. Take `(num & 0x55555555) << 1` to slide odd-positioned bits up by one, and `(num & 0xAAAAAAAA) >> 1` to slide even-positioned bits down by one. OR them together — adjacent pairs are now swapped. The next lesson formalises this as the **bitmasking pattern** and uses similar ideas to enumerate every subset of an array.

</details>
