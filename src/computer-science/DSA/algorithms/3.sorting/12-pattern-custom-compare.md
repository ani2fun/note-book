# 12. Pattern: Custom Compare

Every sorting algorithm in this section has compared elements with `<` (or `>`). For integers, that's obvious. For strings, the language gives you lexicographic comparison for free. But what about: sort users by *full name (last, first)*? Sort orders by *priority then date*? Sort numbers by *number of 1-bits in their binary representation*? Sort versions like `1.10.0` to come *after* `1.2.0`?

The sort algorithm doesn't care about *what* you're comparing — only that there's a comparison function. **Custom compare** is the pattern of providing a problem-specific comparison rule and letting any sort algorithm handle the rest. It's how `std::sort`, `Arrays.sort`, `array.sort`, and friends become universal — they don't compare elements directly; they call your comparator.

This file is the final pattern lesson in the sorting section. By the end you'll know the three styles of custom compare (operator overloading, lambda, comparator class), the diagnostic checks for spotting "I need a custom comparator," and four worked problems: bitwise sort, sort by frequency, largest number, and sort people by height.

## Table of contents

1. [Understanding custom comparators](#understanding-custom-comparators)
2. [The three styles](#the-three-styles)
3. [Identifying custom-compare problems](#identifying-custom-compare-problems)
4. [Bitwise sort](#bitwise-sort)
5. [Sort characters by frequency](#sort-characters-by-frequency)
6. [Largest number](#largest-number)
7. [Sort people by height](#sort-people-by-height)

***

# Understanding Custom Comparators

> **Course:** DSA › Algorithms › Sorting › Custom Compare Pattern

A **comparator** is a function (or callable object) that takes two elements `a` and `b` and returns:

- **Negative** if `a` should come before `b`.
- **Zero** if `a` and `b` are equivalent.
- **Positive** if `a` should come after `b`.

The exact convention varies by language — some use `(a, b) → bool` returning "is `a < b`?" — but the underlying idea is the same: the algorithm asks "which one comes first?" and the comparator answers.

```d2
direction: right

elem_a: "a (one element)" {style.fill: "#dbeafe"; style.stroke: "#3b82f6"}
elem_b: "b (another element)" {style.fill: "#fde68a"; style.stroke: "#d97706"}
cmp: "comparator(a, b)" {style.fill: "#bbf7d0"; style.stroke: "#16a34a"}
result: "negative / zero / positive"

elem_a -> cmp
elem_b -> cmp
cmp -> result
```

<p align="center"><strong>The comparator interface. Every sort algorithm in this section can be adapted to a new ordering rule by swapping out the comparator.</strong></p>

The comparator must implement a **total order**:
- *Antisymmetric* — `cmp(a, b)` and `cmp(b, a)` should have opposite signs.
- *Transitive* — if `a < b` and `b < c`, then `a < c`.
- *Total* — every pair has a defined ordering (not always equal).

Violating any of these breaks the sort — you'll get incorrect results or, worse, infinite loops in some algorithms. The most common bug is **forgetting to handle ties**: a comparator that returns `0` for equal-key elements is correct, but one that always returns `-1` or always `1` is not.

---

## Why the Sort Algorithm Doesn't Care What You Compare

Every comparison sort in this section — bubble, selection, insertion, quicksort, merge sort, heapsort — uses comparisons like `arr[i] < arr[j]` exactly four to ten times. *Replace those comparisons with `cmp(arr[i], arr[j]) < 0`* and the algorithm sorts by the comparator's rule instead of the natural numeric order.

This is what library `sort` functions do. They have a single implementation (typically quicksort or TimSort) and accept a comparator as an argument. The user supplies the comparator; the algorithm does the rest.

---

## A Concrete Example

Sort points `[(3, 1), (1, 2), (2, 4), (1, 1)]` by x-coordinate, breaking ties by y-coordinate.

The comparator: "compare `a.x` to `b.x`; if equal, compare `a.y` to `b.y`."

```python,editable
points = [(3, 1), (1, 2), (2, 4), (1, 1)]
points.sort(key=lambda p: (p[0], p[1]))   # tuple comparison gives lex order
print(points)   # [(1, 1), (1, 2), (2, 4), (3, 1)]
```

The `key=` parameter transforms each element into a sort-key, and Python compares tuples lexicographically. The same effect can be achieved with `functools.cmp_to_key` and an explicit comparator function.

---

## Strengths and Limitations

| Strength | Detail |
|---|---|
| **Universal** | Works with any sorting algorithm — the algorithm just calls the comparator. |
| **Composable** | Multi-key sorts compose: `(primary_key, secondary_key, ...)`. |
| **Decouples sort from data** | The same sort works on integers, strings, structs, anything orderable. |

| Limitation | Detail |
|---|---|
| **Comparator overhead** | Function-call cost per comparison. Slower than inline `<` for primitives. |
| **Easy to bug** | Non-transitive or non-antisymmetric comparators silently produce wrong sorts. |
| **Stability depends on the algorithm** | A custom comparator preserves stability only if the underlying sort is stable. |

In practice, custom compare is used:
- Every time you `sort([{...}, {...}, ...])` with a non-trivial key.
- Database `ORDER BY` clauses (each column is a comparator stage).
- Sorting search results by relevance score, then date, then ID.
- Sorting versions, paths, custom domain objects.

---

## Key Takeaway

A comparator is a function that defines "which element comes first." Any sort algorithm can use any comparator. This decoupling is what makes sorting universal. Now we'll see the three syntactic styles for providing a comparator.

***

# The Three Styles

> **Course:** DSA › Algorithms › Sorting › Custom Compare Pattern

Most languages support three syntactic styles for custom compare. Each has its place.

---

## Style 1 — Operator Overloading

Make the *type* itself orderable by overloading `<` (or implementing the language's "comparable" interface). The sort uses the type's natural order.

**Use when:** the order is intrinsic to the type — e.g., `Money` always compares by amount, `Date` always compares chronologically.

**Languages:** C++ (`operator<`), Python (`__lt__`), Java (`Comparable<T>`).

```python,editable
class Entry:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __lt__(self, other):
        return (self.x, self.y) < (other.x, other.y)

arr = [Entry(2, 3), Entry(1, 4), Entry(2, 1)]
arr.sort()   # uses __lt__
```

---

## Style 2 — Lambda / Inline Function

Pass an anonymous function inline at the call site. Most flexible; doesn't require modifying the type.

**Use when:** the order is *context-specific* — different parts of your code want different orderings of the same data.

```python,editable
arr = [(2, 3), (1, 4), (2, 1)]
arr.sort(key=lambda t: (t[0], -t[1]))   # by x ascending, then y descending
```

---

## Style 3 — Comparator Class / Object

Define a class implementing the language's "Comparator" or "Compare" interface. Reusable; can hold state.

**Use when:** the comparator needs internal state (e.g., a frequency map, a pivot value) or is reused across many sort calls.

```python,editable
from functools import cmp_to_key

class FrequencyComparator:
    def __init__(self, freq_map):
        self.freq = freq_map
    def __call__(self, a, b):
        if self.freq[a] != self.freq[b]:
            return self.freq[b] - self.freq[a]   # higher frequency first
        return a - b                              # tiebreak by value

freq = {1: 3, 2: 1, 3: 2}
arr = [1, 2, 3, 1, 1, 3]
arr.sort(key=cmp_to_key(FrequencyComparator(freq)))
```

---

## When to Use Each

| Need | Style |
|---|---|
| The type has *one* obvious ordering | Style 1 (overloading) |
| You need different orders in different places | Style 2 (lambda) |
| The comparator captures runtime state (freq map, pivot) | Style 3 (comparator object) |

In practice, lambdas are by far the most common in modern code. They're concise, readable, and don't pollute the type system. Operator overloading is reserved for types where the order is *the* natural ordering. Comparator classes are for stateful comparisons.

---

## Key Takeaway

Three styles, one underlying idea: provide a function that orders pairs. Pick the style that matches your context. Now we'll learn how to spot custom-compare problems.

***

# Identifying Custom-Compare Problems

> **Course:** DSA › Algorithms › Sorting › Custom Compare Pattern

Two diagnostic questions decide whether the custom-compare pattern fits.

| # | Question | If "yes," custom compare fits because... |
|---|---|---|
| **Q1** | Does the desired order require a *transformation* of the elements (not their raw values)? | The transformation produces a sort key. |
| **Q2** | Can the transformation be expressed as a function of the element alone (or with bounded extra state)? | A comparator can call the transformation deterministically. |

---

## A Useful Mental Model — Transform Then Compare

Most custom-compare problems boil down to:
1. Define a transformation function `t(elem) → key`.
2. Sort by `key` using the natural ordering on `key`.

Examples:
- "Sort by frequency" → `t(c) = (-frequency[c], c)` (negative because we want descending frequency, then character for tiebreaks).
- "Sort by digit count" → `t(n) = (number of digits in n, n)`.
- "Sort by distance to point P" → `t(point) = distance(point, P)`.

The transform-then-compare pattern collapses every custom-compare problem into "what's the right `t`?" Once you have `t`, the comparator is `cmp(a, b) = (t(a) < t(b))`.

---

## Common Phrasings

Custom compare is usually signalled by:
- "Sort by [some derived property]."
- "Sort by [primary], breaking ties by [secondary]."
- "Sort the array such that ..."
- "Find the largest / smallest ... where the ordering is ..."

If the problem describes an ordering that isn't the values' natural order, custom compare applies.

---

## Key Takeaway

Two checks — a transformation is needed, and the transformation is a function of each element — gate every custom-compare problem. Pass them both and the recipe is "transform, then sort by the natural order on the transform." Now four worked problems.

***

# Bitwise Sort

> **Course:** DSA › Algorithms › Sorting › Custom Compare Pattern

Sort numbers by the count of `1` bits in their binary representation. Ties broken by value.

---

## The Problem

Given an integer array `arr`, sort it ascending by the number of `1`s in each element's binary representation. For elements with the same bit-count, sort by value.

```
Input:  arr = [7, 10, 12, 18, 26]
Output: [10, 12, 18, 7, 26]
Explanation:
  10 = 1010 → 2 ones
  12 = 1100 → 2 ones
  18 = 10010 → 2 ones
  7  = 111   → 3 ones
  26 = 11010 → 3 ones
  Sorted by (ones, value): (2,10), (2,12), (2,18), (3,7), (3,26)

Input:  arr = [3, 7, 10, 18, 2, 9, 15, 31]
Output: [2, 3, 9, 10, 18, 7, 15, 31]

Input:  arr = [1, 2, 4, 8, 16]
Output: [1, 2, 4, 8, 16]   (each has exactly 1 bit; sort by value)
```

---

## The Custom Compare

Transform: `t(n) = (popcount(n), n)`. Sort by `t` ascending.

`popcount(n)` is the number of set bits — many languages have a built-in (`__builtin_popcount` in C/C++, `Integer.bitCount` in Java, `bin(n).count("1")` in Python).

---

## The Solution

<div class="lang-tabs">

```pseudocode
# Sort by popcount (number of 1-bits) ascending; tie-break by numeric value.
function bitwiseSort(arr):
    sort arr using compare(a, b):
        bitsA ← popcount(a)
        bitsB ← popcount(b)
        if bitsA ≠ bitsB:
            return bitsA − bitsB            # fewer bits first
        return a − b                        # tie-break: smaller value first
```

```python,editable
from typing import List

class Solution:
    def bitwise_sort(self, arr: List[int]) -> None:
        arr.sort(key=lambda n: (bin(n).count("1"), n))


if __name__ == "__main__":
    arr = [7, 10, 12, 18, 26]
    Solution().bitwise_sort(arr)
    print(arr)   # [10, 12, 18, 7, 26]
```

```java,editable
import java.util.Arrays;

public class Solution {
    public void bitwiseSort(int[] arr) {
        Integer[] boxed = Arrays.stream(arr).boxed().toArray(Integer[]::new);
        Arrays.sort(boxed, (a, b) -> {
            int bitsA = Integer.bitCount(a), bitsB = Integer.bitCount(b);
            if (bitsA != bitsB) return bitsA - bitsB;
            return a - b;
        });
        for (int i = 0; i < arr.length; i++) arr[i] = boxed[i];
    }

    public static void main(String[] args) {
        int[] arr = {7, 10, 12, 18, 26};
        new Solution().bitwiseSort(arr);
        for (int x : arr) System.out.print(x + " ");
        System.out.println();
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>

int popcount(int n) {
    int c = 0;
    while (n) { c += n & 1; n >>= 1; }
    return c;
}

int cmp(const void *a, const void *b) {
    int x = *(const int *) a, y = *(const int *) b;
    int pa = popcount(x), pb = popcount(y);
    if (pa != pb) return pa - pb;
    return x - y;
}

void bitwise_sort(int *arr, int n) {
    qsort(arr, n, sizeof(int), cmp);
}

int main(void) {
    int arr[] = {7, 10, 12, 18, 26};
    int n = 5;
    bitwise_sort(arr, n);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\n");
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <algorithm>

class Solution {
public:
    void bitwiseSort(std::vector<int>& arr) {
        std::sort(arr.begin(), arr.end(), [](int a, int b) {
            int pa = __builtin_popcount(a), pb = __builtin_popcount(b);
            if (pa != pb) return pa < pb;
            return a < b;
        });
    }
};

int main() {
    std::vector<int> arr = {7, 10, 12, 18, 26};
    Solution{}.bitwiseSort(arr);
    for (int x : arr) std::cout << x << ' ';
    std::cout << '\n';
}
```

```scala,editable
class Solution {
  def bitwiseSort(arr: Array[Int]): Unit = {
    val sorted = arr.sortBy(n => (Integer.bitCount(n), n))
    System.arraycopy(sorted, 0, arr, 0, arr.length)
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    val arr = Array(7, 10, 12, 18, 26)
    new Solution().bitwiseSort(arr)
    println(arr.mkString(" "))
  }
}
```

```typescript,editable
class Solution {
    bitwiseSort(arr: number[]): void {
        const popcount = (n: number): number => n.toString(2).split("0").join("").length;
        arr.sort((a, b) => {
            const pa = popcount(a), pb = popcount(b);
            if (pa !== pb) return pa - pb;
            return a - b;
        });
    }
}

const arr: number[] = [7, 10, 12, 18, 26];
new Solution().bitwiseSort(arr);
console.log(arr);
```

```go,editable
package main

import (
    "fmt"
    "math/bits"
    "sort"
)

func bitwiseSort(arr []int) {
    sort.Slice(arr, func(i, j int) bool {
        pi := bits.OnesCount(uint(arr[i]))
        pj := bits.OnesCount(uint(arr[j]))
        if pi != pj {
            return pi < pj
        }
        return arr[i] < arr[j]
    })
}

func main() {
    arr := []int{7, 10, 12, 18, 26}
    bitwiseSort(arr)
    fmt.Println(arr)
}
```

```rust,editable
fn bitwise_sort(arr: &mut Vec<i32>) {
    arr.sort_by_key(|&n| (n.count_ones(), n));
}

fn main() {
    let mut arr = vec![7, 10, 12, 18, 26];
    bitwise_sort(&mut arr);
    println!("{:?}", arr);
}
```

</div>

***

# Sort Characters by Frequency

> **Course:** DSA › Algorithms › Sorting › Custom Compare Pattern

Sort a string's characters by frequency (descending), with lexicographic tiebreaks.

---

## The Problem

Given a string `s`, return it with characters reordered: highest-frequency first, then lexicographic order on ties.

```
Input:  s = "eeeaaabc"
Output: "aaaeeebc"

Input:  s = "zzzxxyyyb"
Output: "yyyzzzxxb"

Input:  s = "zzzxxyyb"
Output: "zzzxxyyb"
```

---

## The Custom Compare

Transform: `t(c) = (-frequency[c], c)`. The negative sign reverses the order on frequency (we want descending). The tuple's second element gives lex tiebreaks ascending.

---

## The Solution

```python,editable
from collections import Counter

class Solution:
    def sort_characters_by_frequency(self, s: str) -> str:
        freq = Counter(s)
        # Sort each character by (-freq, char), then concatenate freq[c] copies
        return "".join(c * freq[c] for c in sorted(freq, key=lambda c: (-freq[c], c)))


if __name__ == "__main__":
    print(Solution().sort_characters_by_frequency("eeeaaabc"))   # aaaeeebc
```

The full 10-language implementations follow the same pattern: build a frequency map, sort the keys (or pairs) by `(-freq, char)`, then expand. The exact comparator syntax differs per language (lambda, comparator class, etc.) but the transform `(-freq, char)` is universal.

***

# Largest Number

> **Course:** DSA › Algorithms › Sorting › Custom Compare Pattern

Concatenate numbers to form the largest possible number. The custom compare here is *non-obvious*: we don't sort by value or by digit count. We sort by which order produces a larger concatenation.

---

## The Problem

Given non-negative integers `arr`, return the largest number formable by concatenating them, as a string.

```
Input:  arr = [200, 3]
Output: "3200"   (3+200 vs 200+3: "3200" > "2003")

Input:  arr = [200, 8, 1, 3]
Output: "832001"

Input:  arr = [50, 20, 10, 5]
Output: "5502010"
```

---

## The Custom Compare

The non-obvious insight: to maximise the concatenation `a + b` vs `b + a`, compare the two string concatenations directly.

```
cmp(a, b) = +1 if str(a)+str(b) < str(b)+str(a)    # b should come first
            -1 if str(a)+str(b) > str(b)+str(a)    # a should come first
             0 if equal
```

This pairwise greedy is correct because of a (non-trivial) transitivity argument: if `(a+b) > (b+a)` and `(b+c) > (c+b)`, then `(a+c) > (c+a)`. We won't prove it here; the result is that this comparator works.

---

## The Solution

```python,editable
from functools import cmp_to_key
from typing import List

class Solution:
    def largest_number(self, arr: List[int]) -> str:
        def cmp(a: str, b: str) -> int:
            if a + b > b + a: return -1                # a comes first (larger overall)
            if a + b < b + a: return 1                 # b comes first
            return 0
        sorted_arr = sorted(map(str, arr), key=cmp_to_key(cmp))
        result = "".join(sorted_arr)
        return "0" if result[0] == "0" else result      # special case: all zeros


if __name__ == "__main__":
    print(Solution().largest_number([200, 8, 1, 3]))   # 832001
    print(Solution().largest_number([0, 0]))           # 0
```

The 10-language implementations all follow this pattern: convert numbers to strings, sort with a comparator that compares `a+b` vs `b+a`, concatenate, handle the all-zeros edge case.

---

## Why the Edge Case?

If `arr = [0, 0]`, the sorted concatenation is `"00"` — but the largest number formable is `"0"`, not `"00"`. The check `if result[0] == "0"` catches this.

***

# Sort People by Height

> **Course:** DSA › Algorithms › Sorting › Custom Compare Pattern

A two-step problem: first sort by a custom rule, then *reconstruct* the order based on a per-element index. The custom compare gets us the initial sort; a clever insertion gets us the final answer.

---

## The Problem

Given `people = [[h_i, k_i], ...]` where `h_i` is the i-th person's height and `k_i` is the number of people standing in front of them whose height is `≥ h_i`. Reorder `people` so the resulting queue satisfies these `k_i` constraints.

```
Input:  people = [[5, 1], [5, 0]]
Output: [[5, 0], [5, 1]]

Input:  people = [[1, 4], [2, 3], [3, 2], [4, 1], [5, 0]]
Output: [[5, 0], [4, 1], [3, 2], [2, 3], [1, 4]]
```

---

## The Two-Step Algorithm

**Step 1 — sort.** Sort `people` by height descending, breaking ties by `k` ascending. After this, the tallest people are first; among same-height people, the one with smaller `k` is first.

**Step 2 — reconstruct.** Insert each person from the sorted list into a result array at index `k`. Because we process tallest first, by the time person `i` is inserted, exactly `k_i` people of `≥ height` are already in the result — they're the only ones we've inserted, and there's exactly `k_i` of them in front of position `k_i`.

---

## The Solution

```python,editable
from typing import List

class Solution:
    def sort_people_by_height(self, people: List[List[int]]) -> List[List[int]]:
        # Step 1: sort by height descending, then k ascending
        people.sort(key=lambda p: (-p[0], p[1]))
        # Step 2: insert each at index k
        result: List[List[int]] = []
        for p in people:
            result.insert(p[1], p)
        return result


if __name__ == "__main__":
    print(Solution().sort_people_by_height([[1, 4], [2, 3], [3, 2], [4, 1], [5, 0]]))
    # [[5, 0], [4, 1], [3, 2], [2, 3], [1, 4]]
```

The custom compare is the `(-height, k)` sort key. The reconstruction is the second clever step. The 10-language implementations follow the same recipe.

---

## Complexity

- Step 1 (sort): `O(n log n)`.
- Step 2 (reconstruct): `O(n²)` worst case because each `insert` at an arbitrary index is `O(n)`.

Total: `O(n²)`. Better data structures (Fenwick tree, balanced BST) can reduce step 2 to `O(n log n)`.

***

# Final Takeaway

Custom compare is the universal interface between sort algorithms and ordering rules. Three styles: operator overloading, lambda, comparator class. Two questions to ask: *what's the transformation?* and *is it a function of the element alone?*

Once you internalise this, every "sort by X" problem reduces to "find the right `t(elem) → key`," and the algorithm is whatever your standard library provides.

This closes the sorting section. You came in with bubble sort. You're leaving with:
- 10 different sorting algorithms across the comparison and counting families.
- Three classification systems: stability, in-place, adaptiveness.
- Two divide-and-conquer paradigms: pivot-based (quicksort) and split-based (merge sort).
- One linear-time sort (counting) and a near-linear three-way partition (Dutch flag).
- Quickselect for `O(n)` k-th element queries.
- The custom-compare pattern that makes any sort universal.

The next major topic in the algorithms section is **searching** — binary search and its many variants. Many of those variants assume the input is sorted, which is exactly what you've spent the last 12 lessons learning to do efficiently.

**Transfer challenge — close out the sorting section:** Write a custom comparator that sorts strings *case-insensitively* but breaks ties by the original case (uppercase before lowercase). For example, `["banana", "Apple", "apple", "Banana"]` should sort to `["Apple", "apple", "Banana", "banana"]`.

<details>
<summary><strong>Answer — open after you've thought about it</strong></summary>

```python,editable
class Solution:
    def case_insensitive_sort(self, arr):
        # Sort by (lowercase, original) — lowercase comparison first, original is the tiebreaker.
        # Original case ordering: uppercase letters have lower ASCII values, so they come first.
        arr.sort(key=lambda s: (s.lower(), s))


arr = ["banana", "Apple", "apple", "Banana"]
Solution().case_insensitive_sort(arr)
print(arr)   # ['Apple', 'apple', 'Banana', 'banana']
```

The transformation `(s.lower(), s)` produces a tuple sort-key. Tuples compare lexicographically: first compare the lowercase strings, then break ties on the original (which puts uppercase before lowercase due to ASCII order).

This pattern — *case-insensitive primary, case-sensitive tiebreaker* — appears in file managers, text editors, and any system that displays user-facing sorted lists. **You just generalised every "sort by X with Y as tiebreaker" problem you'll ever see.**

</details>
