# 8. Pattern: Variable sized sliding window

This section covers window problems where the window expands and shrinks dynamically based on the condition being tracked.

## Table of contents

1. [Understanding the variable sized sliding window pattern](#understanding-the-variable-sized-sliding-window-pattern)
2. [Identifying the variable sized sliding window pattern](#identifying-the-variable-sized-sliding-window-pattern)
3. [Consecutive ones](#consecutive-ones)
4. [Product conundrum](#product-conundrum)
5. [Maximum subarray sum](#maximum-subarray-sum)
6. [Consecutive ones with K flips](#consecutive-ones-with-k-flips)

***

# Understanding the Variable Sized Sliding Window Pattern

## The Train Car Grew Elastic

The fixed sliding window was satisfying — a train car with exactly `k` seats, sliding smoothly down the track, processing every window of precisely `k` elements. Elegant and predictable.

But what if the problem doesn't give you `k`?

What if you need the *longest* subarray whose sum stays below a threshold? Or the *shortest* subarray whose product exceeds some limit? Or the subarray with the maximum possible sum — where the optimal length could be 1, 3, or N, depending entirely on the values?

The fixed window fails immediately. You'd have to run it for every possible window size from 1 to N — that's O(N²) total work, exactly as bad as the naive nested loops you were trying to escape.

There has to be a better way. And there is — but it demands a harder question: *can we skip most subarrays entirely without missing the answer?*

---

## The Rubber Band Window

Forget the train car with fixed seats. Picture a **rubber band** stretched across the array. The left end is pinned at index `start`. The right end is held at index `end`. As you move through the array, the band can **stretch** (moving `end` forward to include more elements) or **compress** (moving `start` forward to shrink from the left).

```d2
direction: right

stretch_before: "Before: arr[1..2]" {
  grid-columns: 6
  grid-gap: 0
  a0: "2"
  a1: "5" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a2: "1" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a3: "3"
  a4: "7"
  a5: "4"
}

stretch_op: |md
  **`end += 1`**

  `end`: 2 → 3, window grows right
|

stretch_after: "After: arr[1..3]" {
  grid-columns: 6
  grid-gap: 0
  b0: "2"
  b1: "5" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  b2: "1" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  b3: "3" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  b4: "7"
  b5: "4"
}

stretch_before -> stretch_op
stretch_op -> stretch_after
```

```d2
direction: right

compress_before: "Before: arr[1..3]" {
  grid-columns: 6
  grid-gap: 0
  a0: "2"
  a1: "5" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a2: "1" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a3: "3" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a4: "7"
  a5: "4"
}

compress_op: |md
  **`start += 1`**

  `start`: 1 → 2, window shrinks left
|

compress_after: "After: arr[2..3]" {
  grid-columns: 6
  grid-gap: 0
  b0: "2"
  b1: "5"
  b2: "1" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  b3: "3" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  b4: "7"
  b5: "4"
}

compress_before -> compress_op
compress_op -> compress_after
```

<p align="center"><strong>The variable-sized window breathes — <code>end</code> stretches it right, <code>start</code> compresses it from the left. At any moment the window covers exactly <code>arr[start..end]</code>.</strong></p>

This is the variable-sized sliding window. Unlike the fixed window, its size isn't predetermined — it breathes, expanding and contracting in response to the values inside it. Two pointer variables mark its boundaries, and a variable called `aggregate` always holds the current value of some function `f` computed over every element in the window `arr[start..end]`.

The window always starts with `start = 0` and `end = 0`, representing a zero-sized window. Then it grows, processes, and shrinks as it moves through the array, guided by a decision the problem defines: when to expand, when to contract, and when to process.

---

## What You Are Trying to Avoid

Some problems require computing the output of an aggregate function over **all** subarrays of an array and then aggregating those results into a single value. To solve these naively, you would need to run fixed-sized sliding windows of every size from 1 to N through the array — one pass per size. That is O(N²) total work.

| Starts at | Subarrays                               | Count |
|----------:|-----------------------------------------|------:|
| `i = 0`   | `[2]`, `[2,5]`, `[2,5,1]`, `[2,5,1,3]`  | 4     |
| `i = 1`   | `[5]`, `[5,1]`, `[5,1,3]`               | 3     |
| `i = 2`   | `[1]`, `[1,3]`                          | 2     |
| `i = 3`   | `[3]`                                   | 1     |
| **Total** |                                         | **10** |

<p align="center"><strong>All 10 distinct subarrays of <code>[2, 5, 1, 3]</code>. An array of size N has N(N+1)/2 subarrays — for N=1000 that is 500,500; for N=10,000 that is over 50 million.</strong></p>

However, for some problems we may only need to find results for **some** subarrays and can safely skip the remaining ones. These problems can be solved by the variable-sized sliding window technique, which contracts or expands the window in each iteration as it slides through the array. It is a powerful technique that solves many problems in a single pass that would otherwise need nested loops.

```d2
direction: right

arr: "Variable-sized window: arr[start..end]" {
  grid-columns: 6
  grid-gap: 0
  a0: "2"
  a1: "5" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a2: "1" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a3: "3" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a4: "7"
  a5: "4"
}

s: "▲ start" {shape: oval; style.fill: "#fde68a"; style.stroke: "#d97706"}
e: "▲ end" {shape: oval; style.fill: "#fde68a"; style.stroke: "#d97706"}
agg: "aggregate = f(arr[1..3])"

s -> arr.a1
e -> arr.a3
arr -> agg: "" {style.stroke-dash: 3}
```

<p align="center"><strong>At any point in time the window spans <code>arr[start..end]</code> and <code>aggregate</code> holds the value of function <code>f</code> computed over exactly those elements.</strong></p>

Two prerequisites make variable window possible:
1. You can **add** an element's contribution to `aggregate` in O(1) — so you can grow the window cheaply
2. You can **remove** an element's contribution from `aggregate` in O(1) — so you can shrink the window cheaply
3. You can **prove** that skipping certain subarrays never misses the optimal answer — this is the hard part

If all three hold, you get O(N). If any fails, nested loops are unavoidable.

---

## The Four Operations

The variable-sized sliding window uses `start` and `end` for boundaries and `aggregate` for the running result of `f` over `arr[start..end]`. We initialize `aggregate` with some default value dictated by the problem and start with `start = 0` and `end = 0` (a zero-sized window). We iterate until `end` reaches the end of the array, and in each iteration perform some or all of the following four operations.

### Operation 1 — Update Aggregate with Item at `end`

We update `aggregate` by adding the contribution of `arr[end]` to it so that `aggregate` always reflects the function `f` computed over all elements in the current window, including the one at `end`.

```d2
direction: right

before: "Before: arr[1..2], aggregate = 6" {
  grid-columns: 6
  grid-gap: 0
  a0: "2"
  a1: "5" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a2: "1" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a3: "3"
  a4: "7"
  a5: "4"
}

op: |md
  `aggregate = f(aggregate, arr[end])`

  `= f(6, arr[3]) = f(6, 3) = 9`
|

after_note: "aggregate now reflects arr[1..3]"

before -> op
op -> after_note
```

<p align="center"><strong>Operation 1: add <code>arr[end]</code>'s contribution to <code>aggregate</code>. After this step, <code>aggregate</code> holds the value of <code>f</code> over the entire current window <code>arr[start..end]</code>.</strong></p>

The function `f` must support an O(1) add operation. Common examples: `aggregate += arr[end]` for sum, `aggregate *= arr[end]` for product, `freq[arr[end]] += 1` for frequency counts.

### Operation 2 — Process the Aggregate

The value stored in `aggregate` is the aggregated value of the function `f` over the subarray from `start` to `end`. We process it as dictated by the problem — update a running maximum, check a validity condition, record a window length, count a match, or anything else the problem asks.

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#64748b"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart LR
    Agg["aggregate = f(arr[start..end])"]
    Proc{"Process as problem dictates:<br/>• result = max(result, aggregate)<br/>• or count valid windows<br/>• or check a condition<br/>• or record window length"}
    Res["result updated"]
    Agg --> Proc --> Res
```

<p align="center"><strong>Operation 2: use the current aggregate. This is the step where the problem's output logic lives — every window evaluated here is a candidate for the final answer.</strong></p>

### Operation 3 — Contract the Window by Incrementing `start`

If we can skip all remaining subarrays starting at `start` — specifically the ones that would end beyond `end` — we increment `start` by 1, which contracts the window from the left. We also update `aggregate` to remove the contribution of `arr[start]` (the item being removed from the window).

```d2
direction: right

before: "Before: arr[1..3], invariant violated" {
  grid-columns: 6
  grid-gap: 0
  a0: "2"
  a1: "5" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a2: "1" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a3: "3" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a4: "7"
  a5: "4"
}

op: |md
  `aggregate = f_inverse(aggregate, arr[start])`

  `start += 1`

  Subarrays starting at old `start` are skipped.
|

after: "After: arr[2..3], invariant restored" {
  grid-columns: 6
  grid-gap: 0
  b0: "2"
  b1: "5"
  b2: "1" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  b3: "3" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  b4: "7"
  b5: "4"
}

before -> op
op -> after
```

<p align="center"><strong>Operation 3: remove <code>arr[start]</code>'s contribution from <code>aggregate</code> and advance <code>start</code>. This permanently discards all subarrays beginning at the old <code>start</code> that extend beyond <code>end</code>.</strong></p>

```
aggregate = f_inverse(aggregate, arr[start])  # Remove arr[start]'s contribution
start += 1                                     # Contract window from the left
```

Critical: one contraction isn't always enough. Many problems require a **while loop** on the contraction condition — keep shrinking until the invariant is fully restored before moving on. The choice between `if` and `while` here is one of the most important decisions when adapting the template to a specific problem.

### Operation 4 — Expand the Window by Incrementing `end`

If we want to consider the next subarray starting at `start` — that is, the subarray from `start` to `end+1` — in the next iteration, we increment `end` by 1, which expands the window to the right. We do **not** add the contribution of the newly added item to `aggregate` yet — that will be done in the next iteration's Operation 1.

```d2
direction: right

before: "Current: arr[1..3]" {
  grid-columns: 6
  grid-gap: 0
  a0: "2"
  a1: "5" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a2: "1" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a3: "3" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a4: "7"
  a5: "4"
}

op: |md
  `end += 1`

  `arr[end] = 7` is added in the next iteration.
|

after: "After: arr[1..4] next iteration" {
  grid-columns: 6
  grid-gap: 0
  b0: "2"
  b1: "5" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  b2: "1" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  b3: "3" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  b4: "7" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  b5: "4"
}

before -> op
op -> after
```

<p align="center"><strong>Operation 4: advance <code>end</code> to expand the window. The element at the new <code>end</code> position is NOT added to <code>aggregate</code> yet — that happens in the very next iteration's Operation 1.</strong></p>

```
end += 1  # arr[end]'s contribution will be added in the next iteration
```

---

## The Variable Sized Sliding Window Technique

The variable-sized sliding window technique uses two variables `start` and `end` to maintain a window in the array and a variable `aggregate` that always holds the aggregated value of `f` over the current window. We initialize `aggregate` with some default value dictated by the problem, and start with `start = 0` and `end = 0` denoting a zero-sized window. We iterate until `end` reaches the end of the array and in each iteration do some or all of the operations described above.

> **Step 1:** Initialize two variables, `start` and `end` to 0.
>
> **Step 2:** Initialize `aggregate` to some initial value dictated by the problem.
>
> **Step 3:** Loop while `end` < `arr.size()` and do the following:
>
> - **Step 3.1:** Check if we should compute `aggregate`:
>   - **Step 3.1.1:** Add the contribution of `arr[end]` to `aggregate`
>
> - **Step 3.2:** Process `aggregate` as dictated by the problem
>
> - **Step 3.3:** Check if we should contract the window:
>   - **Step 3.3.1:** Remove the contribution of `arr[start]` from `aggregate` using the inverse function
>   - **Step 3.3.2:** Increment `start` by 1
>
> - **Step 3.4:** Check if we should expand the window:
>   - **Step 3.4.1:** Increment `end` by 1

The four adaptations you make when solving a specific problem:
- **What is `aggregate`?** Sum, product, frequency map, distinct element count, or something else
- **When do you compute the aggregate (Step 3.1)?** Always, or only under certain conditions
- **When and how many times do you contract (Step 3.3)?** `if` for at most one contraction per iteration, `while` for as many as needed
- **What does "process" do (Step 3.2)?** Update a max, count valid windows, record a length, check a condition

---

## Implementation

Given below is the generic code implementation of the variable-sized sliding window technique on an array `arr`, using `start` and `end` as the boundaries of the window.

<div class="lang-tabs">

```pseudocode
# Generic variable-window template. Predicates `shouldContract` / `shouldExpand` are
# problem-specific. Often `shouldContract` is a `while` loop, not just an `if`.
function variableSlidingWindow(arr):
    start ← 0; end ← 0
    aggregate ← 0
    while end < length(arr):
        aggregate ← fAdd(aggregate, arr[end])         # 1. add arr[end]
        process(aggregate)                            # 2. record this window's answer
        if shouldContract():                          # 3. shrink (use `while` if needed)
            aggregate ← fRemove(aggregate, arr[start])
            start ← start + 1
        if shouldExpand():                            # 4. extend right
            end ← end + 1
```

```python,editable
from typing import List

def f_add(agg, x): return agg + x
def f_remove(agg, x): return agg - x
def process(agg): pass

# Stand-in flags — replace with the real problem-specific predicates.
should_contract = False
should_expand   = True

def variable_sliding_window(arr: List[int]) -> None:
    start = end = 0
    aggregate = 0
    while end < len(arr):
        aggregate = f_add(aggregate, arr[end])         # Step 3.1: add arr[end].
        process(aggregate)                              # Step 3.2: process current window.

        if should_contract:                             # Step 3.3: shrink (use while if needed).
            aggregate = f_remove(aggregate, arr[start])
            start += 1

        if should_expand:                               # Step 3.4: extend right.
            end += 1
```

```java,editable
public class Main {
    static int fAdd(int agg, int x)    { return agg + x; }
    static int fRemove(int agg, int x) { return agg - x; }
    static void process(int agg)       { /* problem-specific */ }

    static boolean shouldContract = false;
    static boolean shouldExpand   = true;

    static void variableSlidingWindow(int[] arr) {
        int start = 0, end = 0, aggregate = 0;
        while (end < arr.length) {
            aggregate = fAdd(aggregate, arr[end]);
            process(aggregate);

            if (shouldContract) {
                aggregate = fRemove(aggregate, arr[start]);
                start++;
            }
            if (shouldExpand) {
                end++;
            }
        }
    }

    public static void main(String[] args) {
        variableSlidingWindow(new int[]{1, 2, 3, 4});
        System.out.println("Template ran.");
    }
}
```

```c,editable
#include <stdio.h>
#include <stdbool.h>

int  f_add(int agg, int x)    { return agg + x; }
int  f_remove(int agg, int x) { return agg - x; }
void process(int agg)         { (void)agg; }

bool should_contract = false;
bool should_expand   = true;

void variable_sliding_window(int* arr, int n) {
    int start = 0, end = 0, aggregate = 0;
    while (end < n) {
        aggregate = f_add(aggregate, arr[end]);
        process(aggregate);
        if (should_contract) {
            aggregate = f_remove(aggregate, arr[start]);
            start++;
        }
        if (should_expand) end++;
    }
}

int main() {
    int arr[] = {1, 2, 3, 4};
    variable_sliding_window(arr, 4);
    printf("Template ran.\n");
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

int  fAdd(int agg, int x)    { return agg + x; }
int  fRemove(int agg, int x) { return agg - x; }
void process(int)            { /* problem-specific */ }

bool shouldContract = false;
bool shouldExpand   = true;

void variableSlidingWindow(const std::vector<int>& arr) {
    int start = 0, end = 0, aggregate = 0;
    while (end < (int)arr.size()) {
        aggregate = fAdd(aggregate, arr[end]);
        process(aggregate);
        if (shouldContract) {
            aggregate = fRemove(aggregate, arr[start]);
            start++;
        }
        if (shouldExpand) end++;
    }
}

int main() {
    variableSlidingWindow({1, 2, 3, 4});
    std::cout << "Template ran.\n";
}
```

```scala,editable
object Main extends App {
  def fAdd(agg: Int, x: Int): Int    = agg + x
  def fRemove(agg: Int, x: Int): Int = agg - x
  def process(agg: Int): Unit = ()

  val shouldContract = false
  val shouldExpand   = true

  def variableSlidingWindow(arr: Array[Int]): Unit = {
    var start = 0
    var end = 0
    var aggregate = 0
    while (end < arr.length) {
      aggregate = fAdd(aggregate, arr(end))
      process(aggregate)
      if (shouldContract) {
        aggregate = fRemove(aggregate, arr(start))
        start += 1
      }
      if (shouldExpand) end += 1
    }
  }

  variableSlidingWindow(Array(1, 2, 3, 4))
  println("Template ran.")
}
```

```typescript,editable
const fAdd    = (agg: number, x: number): number => agg + x;
const fRemove = (agg: number, x: number): number => agg - x;
const process = (_: number): void => { /* problem-specific */ };

const shouldContract: boolean = false;
const shouldExpand:   boolean = true;

function variableSlidingWindow(arr: number[]): void {
    let start = 0, end = 0, aggregate = 0;
    while (end < arr.length) {
        aggregate = fAdd(aggregate, arr[end]);
        process(aggregate);
        if (shouldContract) {
            aggregate = fRemove(aggregate, arr[start]);
            start++;
        }
        if (shouldExpand) end++;
    }
}

variableSlidingWindow([1, 2, 3, 4]);
console.log("Template ran.");
```

```go,editable
package main

import "fmt"

func fAdd(agg, x int) int    { return agg + x }
func fRemove(agg, x int) int { return agg - x }
func process(agg int)        { _ = agg }

const shouldContract = false
const shouldExpand   = true

func variableSlidingWindow(arr []int) {
    start, end, aggregate := 0, 0, 0
    for end < len(arr) {
        aggregate = fAdd(aggregate, arr[end])
        process(aggregate)
        if shouldContract {
            aggregate = fRemove(aggregate, arr[start])
            start++
        }
        if shouldExpand {
            end++
        }
    }
}

func main() {
    variableSlidingWindow([]int{1, 2, 3, 4})
    fmt.Println("Template ran.")
}
```

```rust,editable
fn f_add(agg: i32, x: i32) -> i32    { agg + x }
fn f_remove(agg: i32, x: i32) -> i32 { agg - x }
fn process(_agg: i32)                {}

const SHOULD_CONTRACT: bool = false;
const SHOULD_EXPAND:   bool = true;

fn variable_sliding_window(arr: &[i32]) {
    let mut start = 0usize;
    let mut end = 0usize;
    let mut aggregate = 0i32;
    while end < arr.len() {
        aggregate = f_add(aggregate, arr[end]);
        process(aggregate);
        if SHOULD_CONTRACT {
            aggregate = f_remove(aggregate, arr[start]);
            start += 1;
        }
        if SHOULD_EXPAND { end += 1; }
    }
}

fn main() {
    variable_sliding_window(&[1, 2, 3, 4]);
    println!("Template ran.");
}
```

</div>

Notice how this template mirrors the fixed window structurally — the same `start`, `end`, `aggregate` trio — but the contraction and expansion decisions are now **conditional** rather than triggered mechanically by the window size crossing `k`. That conditionality is where all the problem-specific logic lives.

---

## Complexity Analysis

The algorithm's time and space complexity is straightforward to reason about.

We create a sliding window using `start` and `end`, and with each iteration we either move, expand, or contract it. Both `start` and `end` are initialized to 0, and at least one of them moves forward in each iteration. This means there can be a maximum of **2×N** iterations of the outer while loop before both pointers reach the end of the array.

In the worst case, both `start` and `end` iterate the entire array — leading to O(2×N) ≈ **O(N)** time complexity, assuming that both `f_add` and `f_remove` have constant O(1) time complexity. In the best case, `end` reaches the end of the array after N iterations, which also gives linear **O(N)** time.

Since we do not create any new data structure that grows with the input, the space complexity is constant **O(1)** in any case.

| | Time | Space |
|---|---|---|
| Best case | **O(N)** | **O(1)** |
| Worst case | **O(N)** | **O(1)** |

**Compared to brute force:** A naive nested loop evaluates all N(N+1)/2 subarrays at O(f) per subarray — total O(N² × f). Variable window achieves O(N × f). For f = O(1) and N = 10,000: brute force performs ~50 million operations; variable window performs 10,000. That is not a minor improvement — it is the difference between milliseconds and seconds.

---

Later in the course, we will examine techniques for identifying problems that can be solved using the variable-sized sliding window technique and walk through a complete example to better understand it.

***

# Identifying the Variable Sized Sliding Window Pattern

## The Honesty Test

You now know what a variable-sized sliding window does. But knowing the technique isn't enough — you need to know *when it applies*. Walk into any problem about subarrays and naively reach for this pattern, and you might spend an hour implementing something that is provably wrong.

There is a checklist. Every box must be checked before the variable window is safe to use.

---

## The Identification Template

Some specific problems where we need to return a single result after aggregating the results from all subarrays in an array can be solved using the variable-sized sliding window technique. In these problems, we can often skip calculating results for some subarrays by identifying when to expand, contract, or move the window. These are generally medium or hard problems, as we need to make some critical observations and prove that skipping some subarrays does not affect the correctness of the solution.

If the problem statement or its solution follows the generic template below, it can be solved by applying the variable-sized sliding window technique:

> Given an array, compute the value of an aggregate function `f` for all subarrays. Apply another aggregate function `g` on the results and return the output. We should be able to add and remove the contribution of an item from the aggregate computed by `f`.

Breaking the template down:
- **`f`** is the per-subarray aggregate — the function you compute over every element in a window (sum, product, count of distinct elements, etc.)
- **`g`** is the cross-subarray aggregate — the function you apply across all subarray results to get the final answer (maximum, minimum, count of valid windows, etc.)
- **Add/remove in O(1)** — the critical mechanical requirement. If you cannot undo an element's contribution to `f` in constant time, the variable window gains you nothing.
- **Provable skipping** — the critical mathematical requirement. You must establish a **window invariant**: a condition about the current window that lets you prove entire families of subarrays are suboptimal and can be ignored without missing the answer. This is what makes these problems hard.

---

## A Worked Example — Maximum Subarray Sum

Let's walk through the complete identification, solution, and proof process on a concrete problem.

**Problem statement:** Given an integer array `arr`, find the subarray with the largest sum and return the sum.

```d2
direction: right

array: "arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]" {
  grid-columns: 9
  grid-gap: 0
  a0: "-2"
  a1: "1"
  a2: "-3"
  a3: "4" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  a4: "-1" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  a5: "2" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  a6: "1" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  a7: "-5"
  a8: "4"
}

best: "Maximum sum subarray: [4, -1, 2, 1] → sum = 6" {
  grid-columns: 4
  grid-gap: 0
  b0: "4" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  b1: "-1" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  b2: "2" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  b3: "1" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
}
```

<p align="center"><strong>Find the subarray with the maximum sum. The answer is not always the whole array — negative elements can drag it down, making a shorter subarray better.</strong></p>

### Does It Fit the Template?

The problem description fits the template for variable-sized sliding window problems as described below:

- **`f` = sum:** Compute the sum of all elements in the current window
- **`g` = maximum:** Find the maximum sum across all subarrays
- **O(1) add?** Yes — `aggregate += arr[end]`
- **O(1) remove?** Yes — `aggregate -= arr[start]`
- **Can we skip subarrays?** We need to make a key observation and prove it — that is what makes this problem non-trivial

Three boxes check immediately. The fourth — provable skipping — is the hard part, and we will look at the proof after the solution.

---

## The Brute Force Solution

The brute-force solution is to use nested loops to find the sum of all possible subarrays. If the sum of any subarray is greater than the maximum seen so far, we update the maximum sum value. Below is an execution of the brute force solution on the array.

```d2
direction: right

i0: "Outer loop i=0: all subarrays starting at index 0" {
  grid-columns: 4
  grid-gap: 16
  j0a: |md
    `[-2]`

    sum=-2
  |
  j0b: |md
    `[-2,1]`

    sum=-1
  |
  j0c: |md
    `[-2,1,-3]`

    sum=-4
  |
  j0d: "..."
}

i1: "Outer loop i=1: all subarrays starting at index 1" {
  grid-columns: 4
  grid-gap: 16
  j1a: |md
    `[1]`

    sum=1
  |
  j1b: |md
    `[1,-3]`

    sum=-2
  |
  j1c: |md
    `[1,-3,4]`

    sum=2
  |
  j1d: "..."
}

i3: "Outer loop i=3: all subarrays starting at index 3" {
  grid-columns: 4
  grid-gap: 16
  j3a: |md
    `[4]`

    sum=4
  |
  j3b: |md
    `[4,-1]`

    sum=3
  |
  j3c: |md
    `[4,-1,2]`

    sum=5
  |
  j3d: |md
    `[4,-1,2,1]`

    sum=6 ← new max
  | {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
}
```

<p align="center"><strong>Brute force checks every subarray — N(N+1)/2 total. For each outer position <code>i</code>, the inner loop extends <code>j</code> rightward accumulating the sum. Every subarray is evaluated explicitly.</strong></p>

<div class="lang-tabs">

```pseudocode
# Brute force — every subarray (i, j). O(n²).
function maxSubarraySumBrute(arr):
    maxSum ← −∞
    for i from 0 to length(arr) − 1:
        currentSum ← 0
        for j from i to length(arr) − 1:
            currentSum ← currentSum + arr[j]
            maxSum ← max(maxSum, currentSum)
    return maxSum
```

```python,editable
from typing import List

def max_subarray_sum_brute(arr: List[int]) -> int:
    max_sum = float('-inf')                          # -∞ handles all-negative arrays.
    for i in range(len(arr)):
        current_sum = 0
        for j in range(i, len(arr)):
            current_sum += arr[j]
            max_sum = max(current_sum, max_sum)
    return max_sum

print(max_subarray_sum_brute([-2, 1, -3, 4, -1, 2, 1, -5, 4]))   # 6
```

```java,editable
public class Main {
    static int maxSubarraySumBrute(int[] arr) {
        int maxSum = Integer.MIN_VALUE;
        for (int i = 0; i < arr.length; i++) {
            int currentSum = 0;
            for (int j = i; j < arr.length; j++) {
                currentSum += arr[j];
                if (currentSum > maxSum) maxSum = currentSum;
            }
        }
        return maxSum;
    }

    public static void main(String[] args) {
        System.out.println(maxSubarraySumBrute(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4}));
    }
}
```

```c,editable
#include <stdio.h>
#include <limits.h>

int max_subarray_sum_brute(int* arr, int n) {
    int max_sum = INT_MIN;
    for (int i = 0; i < n; i++) {
        int current = 0;
        for (int j = i; j < n; j++) {
            current += arr[j];
            if (current > max_sum) max_sum = current;
        }
    }
    return max_sum;
}

int main() {
    int arr[] = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    printf("%d\n", max_subarray_sum_brute(arr, 9));
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <climits>
#include <algorithm>

int maxSubarraySumBrute(const std::vector<int>& arr) {
    int maxSum = INT_MIN;
    int n = (int)arr.size();
    for (int i = 0; i < n; i++) {
        int current = 0;
        for (int j = i; j < n; j++) {
            current += arr[j];
            maxSum = std::max(maxSum, current);
        }
    }
    return maxSum;
}

int main() {
    std::cout << maxSubarraySumBrute({-2, 1, -3, 4, -1, 2, 1, -5, 4}) << "\n";
}
```

```scala,editable
object Main extends App {
  def maxSubarraySumBrute(arr: Array[Int]): Int = {
    var maxSum = Int.MinValue
    for (i <- arr.indices) {
      var current = 0
      for (j <- i until arr.length) {
        current += arr(j)
        maxSum = math.max(maxSum, current)
      }
    }
    maxSum
  }

  println(maxSubarraySumBrute(Array(-2, 1, -3, 4, -1, 2, 1, -5, 4)))
}
```

```typescript,editable
function maxSubarraySumBrute(arr: number[]): number {
    let maxSum = -Infinity;
    for (let i = 0; i < arr.length; i++) {
        let current = 0;
        for (let j = i; j < arr.length; j++) {
            current += arr[j];
            maxSum = Math.max(maxSum, current);
        }
    }
    return maxSum;
}

console.log(maxSubarraySumBrute([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
```

```go,editable
package main

import (
    "fmt"
    "math"
)

func maxSubarraySumBrute(arr []int) int {
    maxSum := math.MinInt32
    for i := 0; i < len(arr); i++ {
        current := 0
        for j := i; j < len(arr); j++ {
            current += arr[j]
            if current > maxSum {
                maxSum = current
            }
        }
    }
    return maxSum
}

func main() {
    fmt.Println(maxSubarraySumBrute([]int{-2, 1, -3, 4, -1, 2, 1, -5, 4}))
}
```

```rust,editable
fn max_subarray_sum_brute(arr: &[i32]) -> i32 {
    let mut max_sum = i32::MIN;
    for i in 0..arr.len() {
        let mut current = 0;
        for j in i..arr.len() {
            current += arr[j];
            if current > max_sum { max_sum = current; }
        }
    }
    max_sum
}

fn main() {
    println!("{}", max_subarray_sum_brute(&[-2, 1, -3, 4, -1, 2, 1, -5, 4]));
}
```

</div>

Though the solution is correct, it requires nested loops and has a time complexity of **O(N²)** in any case. For N = 100,000, this runs approximately 5 billion operations — completely impractical.

---

## The Variable Sized Sliding Window Solution

By closely observing the problem, we can see that we don't need to calculate the sum of all subarrays to find the subarray with the maximum sum. Here is the key insight:

**If the running sum of a window turns negative, then every subarray extending that window will be beaten by a fresh start from the next element.** Adding more elements to a subarray that is already negative can only make things worse. Any subarray that starts fresh from the very next index will have a strictly better sum.

This is the **window invariant** that we maintain:

> For all indices `i` such that `start ≤ i < end`, the sum `arr[start..i]` is non-negative.

We initialize `start` and `end` to 0 to create a sliding window and iterate using `end` until we reach the end of the array. We create variables `sum` and `max_sum` to aggregate the sum of all items in the current window and keep track of the maximum sum seen so far.

In each iteration, we add the item at `end` to `sum` and update `max_sum` if `sum` is greater than the maximum seen so far. If `sum` turns negative at any point, we set `start = end + 1` to effectively contract the window size back to 0 when the window expands at the end of the iteration. We also set `sum = 0` to reset the aggregate as the window size is now 0.

Below is the execution of the variable-sized sliding window technique on the example array:

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#64748b"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart TB
    Init(["start=0, end=1<br/>current=arr[0]=-2, max_sum=-2"])
    Step1["end=1: current=-2 < 0<br/>→ reset: current=arr[1]=1, start=2<br/>max_sum = max(-2, 1) = 1"]
    Step2["end=2: current=1 ≥ 0<br/>→ extend: current = 1 + (-3) = -2<br/>max_sum = max(1, -2) = 1"]
    Step3["end=3: current=-2 < 0<br/>→ reset: current=arr[3]=4, start=4<br/>max_sum = max(1, 4) = 4"]
    Step4["end=4: current=4 ≥ 0<br/>→ extend: current = 4 + (-1) = 3<br/>max_sum = max(4, 3) = 4"]
    Step5["end=5: current=3 ≥ 0<br/>→ extend: current = 3 + 2 = 5<br/>max_sum = max(4, 5) = 5"]
    Step6["end=6: current=5 ≥ 0<br/>→ extend: current = 5 + 1 = 6<br/>max_sum = max(5, 6) = 6"]
    Step7["end=7: current=6 ≥ 0<br/>→ extend: current = 6 + (-5) = 1<br/>max_sum = max(6, 1) = 6"]
    Step8["end=8: current=1 ≥ 0<br/>→ extend: current = 1 + 4 = 5<br/>max_sum = max(6, 5) = 6"]
    Done(["return max_sum = 6 ✓"])

    Init --> Step1 --> Step2 --> Step3 --> Step4 --> Step5 --> Step6 --> Step7 --> Step8 --> Done
```

<p align="center"><strong>The variable-sized sliding window skips all subarrays starting between <code>start+1</code> and <code>end</code>, and all subarrays starting at <code>start</code> and ending beyond <code>end</code>. Two resets occur — at <code>end=1</code> and <code>end=3</code> — discarding all subarrays rooted in those negative prefixes.</strong></p>

<div class="lang-tabs">

```pseudocode
# Kadane's algorithm — sliding-window form. O(n).
# If the running sum goes negative, restart fresh at the next element.
function maxSubarraySum(arr):
    n ← length(arr)
    if n = 0: return 0
    current ← arr[0]                              # seed with arr[0] for all-negative inputs
    maxSum  ← arr[0]
    end ← 1
    while end < n:
        if current < 0:
            current ← arr[end]                    # negative prefix only hurts — restart
        else:
            current ← current + arr[end]
        maxSum ← max(maxSum, current)
        end ← end + 1
    return maxSum
```

```python,editable
from typing import List

def max_subarray_sum(arr: List[int]) -> int:
    n = len(arr)
    if n == 0:
        return 0

    # Seed with arr[0] — using 0 would break all-negative inputs like [-3, -1, -2].
    current = max_sum = arr[0]
    start = 0
    end = 1

    while end < n:
        if current < 0:
            # Negative prefix can only hurt — restart fresh at end.
            current = arr[end]
            start   = end
        else:
            current += arr[end]
        max_sum = max(max_sum, current)
        end += 1
    return max_sum


print(max_subarray_sum([-2, 1, -3, 4, -1, 2, 1, -5, 4]))   # 6
print(max_subarray_sum([-3, -1, -2]))                       # -1
print(max_subarray_sum([1]))                                 # 1
```

```java,editable
public class Main {
    static int maxSubarraySum(int[] arr) {
        int n = arr.length;
        if (n == 0) return 0;
        int current = arr[0], maxSum = arr[0];
        for (int end = 1; end < n; end++) {
            if (current < 0) current = arr[end];
            else             current += arr[end];
            if (current > maxSum) maxSum = current;
        }
        return maxSum;
    }

    public static void main(String[] args) {
        System.out.println(maxSubarraySum(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4}));
        System.out.println(maxSubarraySum(new int[]{-3, -1, -2}));
        System.out.println(maxSubarraySum(new int[]{1}));
    }
}
```

```c,editable
#include <stdio.h>

int max_subarray_sum(int* arr, int n) {
    if (n == 0) return 0;
    int current = arr[0], max_sum = arr[0];
    for (int end = 1; end < n; end++) {
        if (current < 0) current = arr[end];
        else             current += arr[end];
        if (current > max_sum) max_sum = current;
    }
    return max_sum;
}

int main() {
    int a1[] = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    int a2[] = {-3, -1, -2};
    int a3[] = {1};
    printf("%d\n", max_subarray_sum(a1, 9));
    printf("%d\n", max_subarray_sum(a2, 3));
    printf("%d\n", max_subarray_sum(a3, 1));
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <algorithm>

int maxSubarraySum(const std::vector<int>& arr) {
    if (arr.empty()) return 0;
    int current = arr[0], maxSum = arr[0];
    for (size_t end = 1; end < arr.size(); end++) {
        current = (current < 0) ? arr[end] : current + arr[end];
        maxSum = std::max(maxSum, current);
    }
    return maxSum;
}

int main() {
    std::cout << maxSubarraySum({-2, 1, -3, 4, -1, 2, 1, -5, 4}) << "\n";
    std::cout << maxSubarraySum({-3, -1, -2})                    << "\n";
    std::cout << maxSubarraySum({1})                              << "\n";
}
```

```scala,editable
object Main extends App {
  def maxSubarraySum(arr: Array[Int]): Int = {
    if (arr.isEmpty) return 0
    var current = arr(0)
    var maxSum = arr(0)
    for (end <- 1 until arr.length) {
      current = if (current < 0) arr(end) else current + arr(end)
      maxSum = math.max(maxSum, current)
    }
    maxSum
  }

  println(maxSubarraySum(Array(-2, 1, -3, 4, -1, 2, 1, -5, 4)))
  println(maxSubarraySum(Array(-3, -1, -2)))
  println(maxSubarraySum(Array(1)))
}
```

```typescript,editable
function maxSubarraySum(arr: number[]): number {
    if (arr.length === 0) return 0;
    let current = arr[0], maxSum = arr[0];
    for (let end = 1; end < arr.length; end++) {
        current = (current < 0) ? arr[end] : current + arr[end];
        maxSum = Math.max(maxSum, current);
    }
    return maxSum;
}

console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
console.log(maxSubarraySum([-3, -1, -2]));
console.log(maxSubarraySum([1]));
```

```go,editable
package main

import "fmt"

func maxSubarraySum(arr []int) int {
    if len(arr) == 0 {
        return 0
    }
    current := arr[0]
    maxSum := arr[0]
    for end := 1; end < len(arr); end++ {
        if current < 0 {
            current = arr[end]
        } else {
            current += arr[end]
        }
        if current > maxSum {
            maxSum = current
        }
    }
    return maxSum
}

func main() {
    fmt.Println(maxSubarraySum([]int{-2, 1, -3, 4, -1, 2, 1, -5, 4}))
    fmt.Println(maxSubarraySum([]int{-3, -1, -2}))
    fmt.Println(maxSubarraySum([]int{1}))
}
```

```rust,editable
fn max_subarray_sum(arr: &[i32]) -> i32 {
    if arr.is_empty() { return 0; }
    let mut current = arr[0];
    let mut max_sum = arr[0];
    for end in 1..arr.len() {
        current = if current < 0 { arr[end] } else { current + arr[end] };
        if current > max_sum { max_sum = current; }
    }
    max_sum
}

fn main() {
    println!("{}", max_subarray_sum(&[-2, 1, -3, 4, -1, 2, 1, -5, 4]));
    println!("{}", max_subarray_sum(&[-3, -1, -2]));
    println!("{}", max_subarray_sum(&[1]));
}
```

</div>

<details>
<summary><strong>Trace — arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]</strong></summary>

```
arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Initial: current = arr[0] = -2, max_sum = -2, end → 1

end=1: current=-2 < 0 → reset  | current=arr[1]=1, start=2     | max_sum=max(-2,1)=1
end=2: current=1 ≥ 0  → extend | current=1+(-3)=-2             | max_sum=max(1,-2)=1
end=3: current=-2 < 0 → reset  | current=arr[3]=4, start=4     | max_sum=max(1,4)=4
end=4: current=4 ≥ 0  → extend | current=4+(-1)=3              | max_sum=max(4,3)=4
end=5: current=3 ≥ 0  → extend | current=3+2=5                 | max_sum=max(4,5)=5
end=6: current=5 ≥ 0  → extend | current=5+1=6                 | max_sum=max(5,6)=6
end=7: current=6 ≥ 0  → extend | current=6+(-5)=1              | max_sum=max(6,1)=6
end=8: current=1 ≥ 0  → extend | current=1+4=5                 | max_sum=max(6,5)=6

Result: 6 ✓  (subarray [4, -1, 2, 1], indices 3..6)
The two resets (at end=1 and end=3) skipped all subarrays rooted at negative prefixes.
```

</details>

As the code above demonstrates, using the variable-sized sliding window technique we solve the problem in a **single pass in O(N) time**. But how do we know this is safe? We need to prove that resetting when the sum goes negative never causes us to miss the actual maximum subarray.

---

## Proof of Correctness

Consider we have an array `arr` and a window denoted by `start` and `end` (including `start`, including `end`) somewhere in the array such that `sum(start, i)` is non-negative for all `i` such that `start ≤ i < end`. This will be the **invariant** that we maintain throughout the execution.

```d2
invariant: "Invariant: sum(start, i) ≥ 0 for all i in [start, end)" {
  grid-columns: 6
  grid-gap: 0
  s_node: "start"
  i1: "arr[start]" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  i2: "arr[start+1]" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  i3: "..."
  ie: "arr[end-1]" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  e_node: "end"
}

note: |md
  Every prefix sum

  `arr[start..i] ≥ 0`
| {style.fill: "#dcfce7"; style.stroke: "#16a34a"}

invariant -> note: "" {style.stroke-dash: 3}
```

<p align="center"><strong>The invariant states that every partial sum from <code>start</code> to any index before <code>end</code> is non-negative. The window has been "clean" up to this point.</strong></p>

Now consider that adding the item at index `end` turns the sum negative — that is, `sum(start, end)` is negative:

```d2
direction: right

brk: "sum(start, end) < 0 — invariant broken" {
  grid-columns: 5
  grid-gap: 0
  s_node: "start"
  i1: "arr[start]"
  i2: "..."
  ie: "arr[end-1]"
  endn: |md
    `arr[end]`

    ← this broke it
  | {style.fill: "#fecaca"; style.stroke: "#dc2626"}
}

note: "sum(start, end) < 0" {style.fill: "#fecaca"; style.stroke: "#dc2626"}

brk -> note: "" {style.stroke-dash: 3}
```

<p align="center"><strong>Adding <code>arr[end]</code> pushed the total sum below zero. We now prove that every subarray touching this region can be safely discarded as a candidate for the maximum sum.</strong></p>

If the invariant holds, we can prove that all of the following subarrays can never have the maximum sum and can be ignored.

---

### 1. Subarrays Starting at `start` and Ending Beyond `end`

Consider a subarray starting at `start` and ending beyond `end` at some index `b`. We can prove that `sum(start, b)` can never be the maximum sum. This is because `sum(end+1, b)` will always be greater, since `sum(start, end)` is negative.

Decompose: `sum(start, b) = sum(start, end) + sum(end+1, b)`

Since `sum(start, end) < 0`: `sum(start, b) < sum(end+1, b)`

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#64748b"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart LR
    subgraph Full["Subarray arr[start..b] where b > end"]
        direction LR
        A["start"] --- B["..."] --- C["end"] --- D["end+1"] --- E["..."] --- F["b"]
    end
    Neg["sum(start, end) < 0"]
    Comp["sum(start, b) = sum(start, end) + sum(end+1, b)<br/>< sum(end+1, b)"]
    Conc["arr[start..b] can never beat arr[end+1..b]<br/>→ safely skipped"]
    Full --> Neg --> Comp --> Conc
```

<p align="center"><strong>Case 1: a negative prefix drags down any extension beyond it. Starting fresh at <code>end+1</code> always produces a higher sum.</strong></p>

**Conclusion:** We can skip all subarrays starting at `start` and ending beyond `end`.

---

### 2. Subarrays Starting Between `start+1` and `end` and Ending Beyond `end`

Consider a subarray starting between `start + 1` and `end` (including both) at some index `a`, and ending beyond `end` at some index `b`. We can see that `sum(a, b)` can never be the maximum sum, because it will always be less than `sum(end+1, b)`.

The argument: `sum(a, end)` is negative. This is because `sum(start, end)` is negative and, per our invariant, `sum(start, a-1)` is non-negative — which means `sum(a, end)` must be negative (a non-negative prefix cannot be responsible for a negative total; the remainder must be).

Once we know `sum(a, end) < 0`, the same argument from Case 1 applies: `sum(a, b) = sum(a, end) + sum(end+1, b) < sum(end+1, b)`.

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#64748b"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart LR
    subgraph Structure["Subarray arr[a..b] where start < a ≤ end, b > end"]
        direction LR
        S["start"] --- Dots1["..."] --- A["a"] --- Dots2["..."] --- EN["end"] --- Dots3["..."] --- B["b"]
    end
    Inv["Invariant: sum(start, a-1) ≥ 0"]
    Neg["sum(start, end) < 0 and sum(start, a-1) ≥ 0<br/>⟹ sum(a, end) < 0"]
    Comp["sum(a, b) = sum(a, end) + sum(end+1, b)<br/>< sum(end+1, b)"]
    Conc["arr[a..b] can never beat arr[end+1..b]<br/>→ safely skipped"]
    Structure --> Inv --> Neg --> Comp --> Conc
```

<p align="center"><strong>Case 2: any subarray rooted between <code>start+1</code> and <code>end</code> that extends beyond <code>end</code> is beaten by starting fresh at <code>end+1</code>.</strong></p>

**Conclusion:** We can skip all subarrays starting between `start+1` and `end` (including both) and ending beyond `end`.

---

### 3. Subarrays Starting Between `start+1` and `end` and Ending At or Before `end`

Consider a subarray starting between `start + 1` and `end` (including both) at index `a`, and ending at or before `end` at index `b`. We can see that `sum(a, b)` can never be the maximum sum, because it will always be less than `sum(start, b)`.

The argument: per our invariant, `sum(start, a-1) ≥ 0`. Therefore:

`sum(start, b) = sum(start, a-1) + sum(a, b) ≥ sum(a, b)`

Any subarray starting later than `start` and ending at the same point `b` is always beaten by the subarray starting at `start`, because prepending a non-negative prefix to any subarray never reduces its sum.

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#64748b"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart LR
    subgraph Structure["Subarray arr[a..b] where start < a ≤ end, b ≤ end"]
        direction LR
        S["start"] --- Dots1["..."] --- A["a"] --- Dots2["..."] --- B["b"] --- Dots3["..."] --- EN["end"]
    end
    Inv["Invariant: sum(start, a-1) ≥ 0"]
    Dom["sum(start, b) = sum(start, a-1) + sum(a, b)<br/>≥ sum(a, b)<br/>Prepending a non-negative prefix never hurts"]
    Conc["arr[start..b] always beats or ties arr[a..b]<br/>arr[a..b] → safely skipped"]
    Structure --> Inv --> Dom --> Conc
```

<p align="center"><strong>Case 3: any subarray starting strictly after <code>start</code> and ending before <code>end</code> is dominated by the corresponding subarray starting at <code>start</code> — which was already evaluated in a previous iteration.</strong></p>

**Conclusion:** We can skip all subarrays starting between `start+1` and `end` (including both) and ending at or before `end`.

---

### The Full Conclusion — What Is Skipped and What Is Kept

We can conclude from the three cases above that if the invariant holds, the following subarrays can be skipped entirely:

1. All subarrays starting at `start` and ending beyond `end` (from Case 1)
2. All subarrays starting between `start+1` and `end`, including both, ending anywhere (from Cases 2 and 3)

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#64748b"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart LR
    subgraph Skip["All skippable subarrays when sum(start,end) < 0"]
        direction LR
        C1["Case 1: arr[start..b] for b > end"]
        C2["Case 2: arr[a..b] for start < a ≤ end, b > end"]
        C3["Case 3: arr[a..b] for start < a ≤ end, b ≤ end"]
    end
    Conc["All subarrays touching the current window<br/>starting at start or between start+1..end<br/>ending anywhere at or beyond start+1<br/>are provably suboptimal"]
    Skip --> Conc
```

<p align="center"><strong>Three cases together cover every possible subarray that touches the current window. All are safely skippable once the prefix sum turns negative.</strong></p>

Conversely, this means that only the following subarrays still need to be checked for the maximum sum:

1. Subarrays starting at `start` and ending **before** `end` — but these were already evaluated in previous iterations
2. Subarrays starting **after** `end` — which will be evaluated in future iterations

```d2
keep: "Subarrays still worth checking" {
  grid-columns: 2
  grid-gap: 24
  k1: |md
    **1.** `arr[start..i]` for `i < end`

    ← already evaluated in prior iterations
  | {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  k2: |md
    **2.** `arr[j..b]` for `j > end`

    ← will be evaluated in future iterations
  | {style.fill: "#dbeafe"; style.stroke: "#3b82f6"}
}
```

<p align="center"><strong>Nothing is ever missed. Category 1 was evaluated as <code>end</code> grew from <code>start</code> to <code>end-1</code>. Category 2 is handled by setting <code>start = end + 1</code> and continuing forward.</strong></p>

The variable-sized sliding window technique does precisely this: it sets `start = 0` and `end = 0` to initialize a window of zero size for which the invariant holds trivially. It then expands the window using `end` and maintains the invariant as it iterates. In each iteration it considers `sum(start, end)` as a candidate for the maximum sum. At any point if `sum(start, end)` turns negative, it sets `start = end + 1` to skip all subarrays starting between `start+1` and `end` and all subarrays starting at `start` and ending beyond `end`.

Since the invariant is maintained throughout the run, and we consider `sum(start, end)` for the maximum sum in each iteration, we are guaranteed to find the maximum sum while only skipping subarrays that can never have the maximum sum.

---

## Example Problems

Most problems in this category are medium or hard — the difficulty lies not in the template itself, but in identifying the right invariant and proving the skipping is safe. The following problems in this section are solved using the variable-sized sliding window:

- **Consecutive Ones** — find the length of the longest run of 1s (no flips allowed)
- **Product Conundrum** — find the length of the longest subarray with product strictly less than K
- **Maximum Subarray Sum** — find the maximum sum over any subarray (the problem we just proved)
- **Consecutive Ones with K Flips** — find the longest run of 1s with at most K zeros flipped

We will now solve these problems to understand the variable-size sliding window technique better.

***

# Consecutive Ones

## The Hook

You're parsing the uptime log of a production service — `1` means the second was healthy, `0` means it crashed. Your SLA promises the **longest unbroken green streak** each day. A nested loop solves it in O(N²). But this is the simplest possible variable window, and it runs in a single linear pass. Get this right, and every future window problem feels familiar — because they are all variations of this.

## The Problem

> Given a binary array `arr` containing only `0`s and `1`s, return the length of the longest contiguous subarray consisting entirely of `1`s.

```
Input:  arr = [1, 1, 0, 1, 1, 1, 0, 1]
Output: 3            (the run of three 1s at indices 3..5)

Input:  arr = [0, 0, 0]
Output: 0            (no 1s at all)

Input:  arr = [1, 1, 1, 1]
Output: 4            (the entire array is one run)
```

---

## Intuition

The window **invariant** is the simplest possible: *every element in the window is a `1`*. As long as the invariant holds, the window is a valid candidate.

What happens the instant `arr[end] == 0`? Every subarray that includes that `0` is automatically invalid. Contracting `start` by one step doesn't help — the `0` is still inside the window. Two steps? Still inside. You would have to drag `start` *all the way past* `end` to restore the invariant.

So don't drag. **Leap.** Set `start = end + 1` in one move and skip every dead window at once.

> *Before you read on — which family of skipped subarrays does this remind you of?*

If you guessed Kadane's algorithm from the identification section, you've already internalised the pattern. Kadane leaps past a negative prefix; Consecutive Ones leaps past a zero. Same shape, different invariant.

---

## The Solution

<div class="lang-tabs">

```pseudocode
# Longest run of consecutive 1s. On a 0, leap `start` past it in one move.
function findMaxConsecutiveOnes(arr):
    n ← length(arr)
    if n = 0: return 0
    start ← 0; end ← 0; maxLen ← 0
    while end < n:
        if arr[end] = 0:
            start ← end + 1                       # window resets to position past the 0
        else:
            maxLen ← max(maxLen, end − start + 1)
        end ← end + 1
    return maxLen
```

```python,editable
from typing import List

def find_max_consecutive_ones(arr: List[int]) -> int:
    n = len(arr)
    if n == 0:
        return 0

    start = end = max_len = 0
    while end < n:
        if arr[end] == 0:
            start = end + 1                             # Leap past the 0 in one move.
        else:
            max_len = max(max_len, end - start + 1)
        end += 1
    return max_len


print(find_max_consecutive_ones([1, 1, 0, 1, 1, 1, 0, 1]))  # 3
print(find_max_consecutive_ones([0, 0, 0]))                  # 0
print(find_max_consecutive_ones([1, 1, 1, 1]))               # 4
print(find_max_consecutive_ones([1]))                         # 1
print(find_max_consecutive_ones([]))                          # 0
```

```java,editable
public class Main {
    static int findMaxConsecutiveOnes(int[] arr) {
        int n = arr.length;
        if (n == 0) return 0;
        int start = 0, end = 0, maxLen = 0;
        while (end < n) {
            if (arr[end] == 0) start = end + 1;
            else               maxLen = Math.max(maxLen, end - start + 1);
            end++;
        }
        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println(findMaxConsecutiveOnes(new int[]{1, 1, 0, 1, 1, 1, 0, 1}));
        System.out.println(findMaxConsecutiveOnes(new int[]{0, 0, 0}));
        System.out.println(findMaxConsecutiveOnes(new int[]{1, 1, 1, 1}));
        System.out.println(findMaxConsecutiveOnes(new int[]{1}));
        System.out.println(findMaxConsecutiveOnes(new int[]{}));
    }
}
```

```c,editable
#include <stdio.h>

int find_max_consecutive_ones(int* arr, int n) {
    if (n == 0) return 0;
    int start = 0, end = 0, max_len = 0;
    while (end < n) {
        if (arr[end] == 0) start = end + 1;
        else if (end - start + 1 > max_len) max_len = end - start + 1;
        end++;
    }
    return max_len;
}

int main() {
    int a1[] = {1, 1, 0, 1, 1, 1, 0, 1}; printf("%d\n", find_max_consecutive_ones(a1, 8));
    int a2[] = {0, 0, 0};                printf("%d\n", find_max_consecutive_ones(a2, 3));
    int a3[] = {1, 1, 1, 1};             printf("%d\n", find_max_consecutive_ones(a3, 4));
    int a4[] = {1};                      printf("%d\n", find_max_consecutive_ones(a4, 1));
    printf("%d\n", find_max_consecutive_ones(NULL, 0));
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <algorithm>

int findMaxConsecutiveOnes(const std::vector<int>& arr) {
    int n = (int)arr.size();
    if (n == 0) return 0;
    int start = 0, end = 0, maxLen = 0;
    while (end < n) {
        if (arr[end] == 0) start = end + 1;
        else               maxLen = std::max(maxLen, end - start + 1);
        end++;
    }
    return maxLen;
}

int main() {
    std::cout << findMaxConsecutiveOnes({1, 1, 0, 1, 1, 1, 0, 1}) << "\n";
    std::cout << findMaxConsecutiveOnes({0, 0, 0})                << "\n";
    std::cout << findMaxConsecutiveOnes({1, 1, 1, 1})             << "\n";
    std::cout << findMaxConsecutiveOnes({1})                       << "\n";
    std::cout << findMaxConsecutiveOnes({})                        << "\n";
}
```

```scala,editable
object Main extends App {
  def findMaxConsecutiveOnes(arr: Array[Int]): Int = {
    if (arr.isEmpty) return 0
    var start = 0
    var end = 0
    var maxLen = 0
    while (end < arr.length) {
      if (arr(end) == 0) start = end + 1
      else               maxLen = math.max(maxLen, end - start + 1)
      end += 1
    }
    maxLen
  }

  println(findMaxConsecutiveOnes(Array(1, 1, 0, 1, 1, 1, 0, 1)))
  println(findMaxConsecutiveOnes(Array(0, 0, 0)))
  println(findMaxConsecutiveOnes(Array(1, 1, 1, 1)))
  println(findMaxConsecutiveOnes(Array(1)))
  println(findMaxConsecutiveOnes(Array.empty[Int]))
}
```

```typescript,editable
function findMaxConsecutiveOnes(arr: number[]): number {
    const n = arr.length;
    if (n === 0) return 0;
    let start = 0, end = 0, maxLen = 0;
    while (end < n) {
        if (arr[end] === 0) start = end + 1;
        else                maxLen = Math.max(maxLen, end - start + 1);
        end++;
    }
    return maxLen;
}

console.log(findMaxConsecutiveOnes([1, 1, 0, 1, 1, 1, 0, 1]));
console.log(findMaxConsecutiveOnes([0, 0, 0]));
console.log(findMaxConsecutiveOnes([1, 1, 1, 1]));
console.log(findMaxConsecutiveOnes([1]));
console.log(findMaxConsecutiveOnes([]));
```

```go,editable
package main

import "fmt"

func findMaxConsecutiveOnes(arr []int) int {
    n := len(arr)
    if n == 0 {
        return 0
    }
    start, end, maxLen := 0, 0, 0
    for end < n {
        if arr[end] == 0 {
            start = end + 1
        } else if end-start+1 > maxLen {
            maxLen = end - start + 1
        }
        end++
    }
    return maxLen
}

func main() {
    fmt.Println(findMaxConsecutiveOnes([]int{1, 1, 0, 1, 1, 1, 0, 1}))
    fmt.Println(findMaxConsecutiveOnes([]int{0, 0, 0}))
    fmt.Println(findMaxConsecutiveOnes([]int{1, 1, 1, 1}))
    fmt.Println(findMaxConsecutiveOnes([]int{1}))
    fmt.Println(findMaxConsecutiveOnes([]int{}))
}
```

```rust,editable
fn find_max_consecutive_ones(arr: &[i32]) -> usize {
    if arr.is_empty() { return 0; }
    let mut start = 0usize;
    let mut end = 0usize;
    let mut max_len = 0usize;
    while end < arr.len() {
        if arr[end] == 0 { start = end + 1; }
        else {
            let len = end - start + 1;
            if len > max_len { max_len = len; }
        }
        end += 1;
    }
    max_len
}

fn main() {
    println!("{}", find_max_consecutive_ones(&[1, 1, 0, 1, 1, 1, 0, 1]));
    println!("{}", find_max_consecutive_ones(&[0, 0, 0]));
    println!("{}", find_max_consecutive_ones(&[1, 1, 1, 1]));
    println!("{}", find_max_consecutive_ones(&[1]));
    println!("{}", find_max_consecutive_ones(&[]));
}
```

</div>

<details>
<summary><strong>Trace — arr = [1, 1, 0, 1, 1, 1, 0, 1]</strong></summary>

```
start=0, end=0, max_len=0

end=0: arr[0]=1 → invariant holds | window=[0..0] len=1  | max_len=1
end=1: arr[1]=1 → invariant holds | window=[0..1] len=2  | max_len=2
end=2: arr[2]=0 → LEAP start=3    | window broken        | max_len=2
end=3: arr[3]=1 → invariant holds | window=[3..3] len=1  | max_len=2
end=4: arr[4]=1 → invariant holds | window=[3..4] len=2  | max_len=2
end=5: arr[5]=1 → invariant holds | window=[3..5] len=3  | max_len=3
end=6: arr[6]=0 → LEAP start=7    | window broken        | max_len=3
end=7: arr[7]=1 → invariant holds | window=[7..7] len=1  | max_len=3

Return: 3 ✓  (the run at indices 3..5)
```

</details>

---

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(N) | `end` advances once per iteration; `start` either stays or leaps forward — never moves backward |
| **Space** | O(1) | Three integers: `start`, `end`, `max_len` |

---

## Edge Cases

| Case | Example | Expected | Reasoning |
|---|---|---|---|
| Empty array | `[]` | `0` | The early guard returns before the loop runs |
| All zeros | `[0, 0, 0]` | `0` | Every iteration leaps `start` past `end`; `max_len` never updates |
| All ones | `[1, 1, 1, 1]` | `4` | `start` stays at `0`; `max_len` grows each iteration |
| Single one | `[1]` | `1` | One iteration, invariant holds, `max_len = 1` |
| Trailing zero | `[1, 1, 0]` | `2` | Best run already recorded before the final leap |

---

## Final Takeaway

Consecutive Ones is the **Hello, World** of the variable window — one invariant, one leap rule, one line of bookkeeping. Every pattern in this section descends from its shape. When you see a problem where a single "bad" element invalidates every window touching it, reach for the leap, not the shrink.

> **Transfer Challenge:** Modify the code to return the *starting index* of the longest run, not just its length. What changes? Solve it before peeking.
>
> <details><summary><strong>Solution hint</strong></summary>
>
> Track `best_start` alongside `max_len`. When `end - start + 1 > max_len`, update both: `max_len = end - start + 1` and `best_start = start`. That's it — two extra lines.
>
> </details>

***

# Product Conundrum

## The Hook

Consecutive Ones had it easy — one `0` kills a window instantly. But what if adding one element kicks out **many** elements at once, like dropping a boulder onto a seesaw? Welcome to the world where contraction is a *loop*, not an `if`. This is the first problem that demands `while` on the shrink, and understanding when to switch from `if` to `while` is a survival skill for every window problem ahead.

## The Problem

> Given an array `arr` of **positive integers** and a positive integer `k`, return the length of the longest contiguous subarray whose **product** is strictly less than `k`.

```
Input:  arr = [1, 2, 3, 4],  k = 10
Output: 3            (the subarray [1, 2, 3] has product 6 < 10; longer extensions hit product ≥ 10)

Input:  arr = [10, 5, 2, 6],  k = 100
Output: 3            (the subarray [5, 2, 6] has product 60 < 100)

Input:  arr = [1, 2, 3],  k = 1
Output: 0            (no subarray of positive integers has product < 1)
```

---

## Intuition

The invariant: `product(arr[start..end]) < k`. When we expand `end`, the product can only grow (all elements are ≥ 1). When it crosses or equals `k`, we contract.

**Why `while` and not `if`?** Suppose the window is `[2, 3, 4]` with product `24`, and we add a `50`. Now the product is `1200`, and `k = 100`. Contracting once drops the `2` — new product `600`. Still too big. Again → `200`. Again → `50`. It took **three** contractions to restore the invariant. One big new element can dethrone several old ones in a single iteration.

> *Pause and predict — if the array were `[100, 100, 100, 100]` and `k = 50`, what would the loop do at every `end`?*

It would contract immediately, leaving the window empty (`start = end + 1`), record a length of `0`, then expand and repeat. Four iterations, four contractions, final answer `0`. The algorithm handles degenerate inputs gracefully because the invariant is *always* restored before the length is recorded.

---

## The Solution

<div class="lang-tabs">

```pseudocode
# Longest subarray of positive ints whose product is strictly less than k.
# `while` because one expansion may force several contractions.
function longestSubarrayWithProductLessThanK(arr, k):
    n ← length(arr)
    if n = 0 OR k ≤ 1: return 0                   # positives can't make a product < 1
    start ← 0; end ← 0
    product ← 1; maxLen ← 0
    while end < n:
        product ← product × arr[end]
        while product ≥ k AND start ≤ end:
            product ← product ÷ arr[start]
            start ← start + 1
        maxLen ← max(maxLen, end − start + 1)
        end ← end + 1
    return maxLen
```

```python,editable
from typing import List

def longest_subarray_with_product_less_than_k(arr: List[int], k: int) -> int:
    n = len(arr)
    if n == 0 or k <= 1:
        return 0                                       # k ≤ 1 unsatisfiable for positives.

    start = end = 0
    product = 1
    max_len = 0
    while end < n:
        product *= arr[end]
        # `while` because one expansion may force several contractions.
        while product >= k and start <= end:
            product //= arr[start]
            start += 1
        max_len = max(max_len, end - start + 1)
        end += 1
    return max_len


print(longest_subarray_with_product_less_than_k([1, 2, 3, 4], 10))      # 3
print(longest_subarray_with_product_less_than_k([10, 5, 2, 6], 100))    # 3
print(longest_subarray_with_product_less_than_k([1, 2, 3], 1))          # 0
print(longest_subarray_with_product_less_than_k([1, 1, 1], 2))          # 3
print(longest_subarray_with_product_less_than_k([100, 100, 100], 50))   # 0
```

```java,editable
public class Main {
    static int longestSubarrayWithProductLessThanK(int[] arr, int k) {
        int n = arr.length;
        if (n == 0 || k <= 1) return 0;
        int start = 0, end = 0, maxLen = 0;
        long product = 1;
        while (end < n) {
            product *= arr[end];
            while (product >= k && start <= end) {
                product /= arr[start];
                start++;
            }
            maxLen = Math.max(maxLen, end - start + 1);
            end++;
        }
        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println(longestSubarrayWithProductLessThanK(new int[]{1, 2, 3, 4}, 10));
        System.out.println(longestSubarrayWithProductLessThanK(new int[]{10, 5, 2, 6}, 100));
        System.out.println(longestSubarrayWithProductLessThanK(new int[]{1, 2, 3}, 1));
        System.out.println(longestSubarrayWithProductLessThanK(new int[]{1, 1, 1}, 2));
        System.out.println(longestSubarrayWithProductLessThanK(new int[]{100, 100, 100}, 50));
    }
}
```

```c,editable
#include <stdio.h>

int longest_subarray_with_product_less_than_k(int* arr, int n, int k) {
    if (n == 0 || k <= 1) return 0;
    int start = 0, end = 0, max_len = 0;
    long long product = 1;
    while (end < n) {
        product *= arr[end];
        while (product >= k && start <= end) {
            product /= arr[start];
            start++;
        }
        if (end - start + 1 > max_len) max_len = end - start + 1;
        end++;
    }
    return max_len;
}

int main() {
    int a1[] = {1, 2, 3, 4};      printf("%d\n", longest_subarray_with_product_less_than_k(a1, 4, 10));
    int a2[] = {10, 5, 2, 6};     printf("%d\n", longest_subarray_with_product_less_than_k(a2, 4, 100));
    int a3[] = {1, 2, 3};         printf("%d\n", longest_subarray_with_product_less_than_k(a3, 3, 1));
    int a4[] = {1, 1, 1};         printf("%d\n", longest_subarray_with_product_less_than_k(a4, 3, 2));
    int a5[] = {100, 100, 100};   printf("%d\n", longest_subarray_with_product_less_than_k(a5, 3, 50));
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <algorithm>

int longestSubarrayWithProductLessThanK(const std::vector<int>& arr, int k) {
    int n = (int)arr.size();
    if (n == 0 || k <= 1) return 0;
    int start = 0, end = 0, maxLen = 0;
    long long product = 1;
    while (end < n) {
        product *= arr[end];
        while (product >= k && start <= end) {
            product /= arr[start];
            start++;
        }
        maxLen = std::max(maxLen, end - start + 1);
        end++;
    }
    return maxLen;
}

int main() {
    std::cout << longestSubarrayWithProductLessThanK({1, 2, 3, 4}, 10)      << "\n";
    std::cout << longestSubarrayWithProductLessThanK({10, 5, 2, 6}, 100)    << "\n";
    std::cout << longestSubarrayWithProductLessThanK({1, 2, 3}, 1)          << "\n";
    std::cout << longestSubarrayWithProductLessThanK({1, 1, 1}, 2)          << "\n";
    std::cout << longestSubarrayWithProductLessThanK({100, 100, 100}, 50)   << "\n";
}
```

```scala,editable
object Main extends App {
  def longestSubarrayWithProductLessThanK(arr: Array[Int], k: Int): Int = {
    val n = arr.length
    if (n == 0 || k <= 1) return 0
    var start = 0
    var end = 0
    var product = 1L
    var maxLen = 0
    while (end < n) {
      product *= arr(end)
      while (product >= k && start <= end) {
        product /= arr(start)
        start += 1
      }
      maxLen = math.max(maxLen, end - start + 1)
      end += 1
    }
    maxLen
  }

  println(longestSubarrayWithProductLessThanK(Array(1, 2, 3, 4), 10))
  println(longestSubarrayWithProductLessThanK(Array(10, 5, 2, 6), 100))
  println(longestSubarrayWithProductLessThanK(Array(1, 2, 3), 1))
  println(longestSubarrayWithProductLessThanK(Array(1, 1, 1), 2))
  println(longestSubarrayWithProductLessThanK(Array(100, 100, 100), 50))
}
```

```typescript,editable
function longestSubarrayWithProductLessThanK(arr: number[], k: number): number {
    const n = arr.length;
    if (n === 0 || k <= 1) return 0;
    let start = 0, end = 0, maxLen = 0;
    let product = 1;
    while (end < n) {
        product *= arr[end];
        while (product >= k && start <= end) {
            product = Math.floor(product / arr[start]);
            start++;
        }
        maxLen = Math.max(maxLen, end - start + 1);
        end++;
    }
    return maxLen;
}

console.log(longestSubarrayWithProductLessThanK([1, 2, 3, 4], 10));
console.log(longestSubarrayWithProductLessThanK([10, 5, 2, 6], 100));
console.log(longestSubarrayWithProductLessThanK([1, 2, 3], 1));
console.log(longestSubarrayWithProductLessThanK([1, 1, 1], 2));
console.log(longestSubarrayWithProductLessThanK([100, 100, 100], 50));
```

```go,editable
package main

import "fmt"

func longestSubarrayWithProductLessThanK(arr []int, k int) int {
    n := len(arr)
    if n == 0 || k <= 1 {
        return 0
    }
    start, end, maxLen := 0, 0, 0
    product := int64(1)
    K := int64(k)
    for end < n {
        product *= int64(arr[end])
        for product >= K && start <= end {
            product /= int64(arr[start])
            start++
        }
        if end-start+1 > maxLen {
            maxLen = end - start + 1
        }
        end++
    }
    return maxLen
}

func main() {
    fmt.Println(longestSubarrayWithProductLessThanK([]int{1, 2, 3, 4}, 10))
    fmt.Println(longestSubarrayWithProductLessThanK([]int{10, 5, 2, 6}, 100))
    fmt.Println(longestSubarrayWithProductLessThanK([]int{1, 2, 3}, 1))
    fmt.Println(longestSubarrayWithProductLessThanK([]int{1, 1, 1}, 2))
    fmt.Println(longestSubarrayWithProductLessThanK([]int{100, 100, 100}, 50))
}
```

```rust,editable
fn longest_subarray_with_product_less_than_k(arr: &[i32], k: i32) -> usize {
    let n = arr.len();
    if n == 0 || k <= 1 { return 0; }
    let mut start = 0usize;
    let mut end = 0usize;
    let mut product: i64 = 1;
    let mut max_len = 0usize;
    let k64 = k as i64;
    while end < n {
        product *= arr[end] as i64;
        while product >= k64 && start <= end {
            product /= arr[start] as i64;
            start += 1;
        }
        if end - start + 1 > max_len { max_len = end - start + 1; }
        end += 1;
    }
    max_len
}

fn main() {
    println!("{}", longest_subarray_with_product_less_than_k(&[1, 2, 3, 4], 10));
    println!("{}", longest_subarray_with_product_less_than_k(&[10, 5, 2, 6], 100));
    println!("{}", longest_subarray_with_product_less_than_k(&[1, 2, 3], 1));
    println!("{}", longest_subarray_with_product_less_than_k(&[1, 1, 1], 2));
    println!("{}", longest_subarray_with_product_less_than_k(&[100, 100, 100], 50));
}
```

</div>

<details>
<summary><strong>Trace — arr = [10, 5, 2, 6], k = 100</strong></summary>

```
start=0, end=0, product=1, max_len=0

end=0: product *= 10 → 10.  10 < 100 — no contract.  window=[0..0] len=1 | max_len=1
end=1: product *= 5  → 50.  50 < 100 — no contract.  window=[0..1] len=2 | max_len=2
end=2: product *= 2  → 100. 100 ≥ 100 — contract:
         product //= 10 → 10, start=1.  10 < 100 — stop.
       window=[1..2] len=2                                              | max_len=2
end=3: product *= 6  → 60.  60 < 100 — no contract. window=[1..3] len=3 | max_len=3

Return: 3 ✓   (subarray [5, 2, 6])

The contraction at end=2 demonstrates why 'while' matters: without it,
start would still be 0, product would still be 100, and the invariant
would be silently violated.
```

</details>

---

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(N) | Each index is visited at most twice overall — once by `end`, once by `start`. The inner `while` is amortised |
| **Space** | O(1) | Four integers: `start`, `end`, `product`, `max_len` |

The amortised argument matters: the inner `while` looks quadratic, but across the *whole* run, `start` moves forward at most `N` times total, so the sum of all inner iterations is bounded by `N`.

---

## Edge Cases

| Case | Example | Expected | Reasoning |
|---|---|---|---|
| `k ≤ 1` | `arr=[1,2,3]`, `k=1` | `0` | No product of positives can be strictly less than 1 |
| Empty array | `arr=[]`, `k=10` | `0` | Loop never executes |
| Single big element | `arr=[100]`, `k=50` | `0` | `end=0` expands, contraction empties window, no length recorded ≥ 1 |
| All elements `< k` | `arr=[1,1,1]`, `k=2` | `3` | Product stays ≤ 1 throughout; window is the entire array |
| Product exactly equals `k` | `arr=[2,5]`, `k=10` | `1` | `2*5 = 10` is *not* strictly less, so the window contracts |

---

## Final Takeaway

Product Conundrum is where the variable window grows teeth. The jump from `if` to `while` on contraction is what separates toy windows from industrial ones — and the amortised O(N) analysis is what reassures you the loop is still linear. When you see a problem where one new element can invalidate several previous ones, reach for `while`.

> **Transfer Challenge:** Change the problem to *count the number of subarrays* whose product is strictly less than `k` (not just the longest). Hint: when the invariant holds for window `arr[start..end]`, how many valid subarrays *ending at `end`* exist?
>
> <details><summary><strong>Solution hint</strong></summary>
>
> Every window `arr[start..end]` that satisfies the invariant contains `end - start + 1` valid subarrays ending at `end` (from length 1 up to the full window). Accumulate `count += end - start + 1` instead of taking the max — everything else stays the same.
>
> </details>

***

# Maximum Subarray Sum

## The Hook

You already proved this one. Back in the identification section, we walked through the three-case proof that skipping every subarray rooted in a negative prefix never costs us the answer. Now the proof becomes code — five lines of pure Kadane's algorithm. The mathematical heavy lifting is already done; this section is the victory lap, and the fact that it is *only* a victory lap is itself a measure of how far you've come.

## The Problem

> Given an integer array `arr` (which may contain negative values), return the largest possible sum of a contiguous non-empty subarray.

```
Input:  arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6            (subarray [4, -1, 2, 1])

Input:  arr = [1]
Output: 1            (single element)

Input:  arr = [-3, -1, -2]
Output: -1           (all negative — best we can do is the single largest element)

Input:  arr = [5, 4, -1, 7, 8]
Output: 23           (the entire array)
```

---

## Intuition

Re-read the proof in the identification section above if it has faded. The short version:

- **Invariant:** `sum(arr[start..i]) ≥ 0` for every `i` in `[start, end)`.
- **Decision rule:** if adding `arr[end]` pushes the running sum below zero, every subarray rooted at or between `start` and `end` is provably beaten by one that starts at `end + 1`. Reset and move on.

The elegance is that we never *shrink* the window one element at a time. When the invariant breaks, we **leap** past the entire negative prefix — just like Consecutive Ones, just like every "skip the bad region entirely" pattern.

> *Before looking at the code — what should the initial value of `current` and `max_sum` be, and why not just `0`?*

If you said "the first element", you already caught the edge case. Using `0` would cause an all-negative array like `[-3, -1, -2]` to return `0` — a sum that corresponds to *no subarray at all*, which violates the non-empty constraint.

---

## The Solution

<div class="lang-tabs">

```pseudocode
# Kadane in compact for-loop form.
function maxSubarraySum(arr):
    n ← length(arr)
    if n = 0: return 0
    current ← arr[0]; maxSum ← arr[0]
    for end from 1 to n − 1:
        if current < 0:
            current ← arr[end]
        else:
            current ← current + arr[end]
        maxSum ← max(maxSum, current)
    return maxSum
```

```python,editable
from typing import List

def max_subarray_sum(arr: List[int]) -> int:
    n = len(arr)
    if n == 0:
        return 0
    current = max_sum = arr[0]
    for end in range(1, n):
        current = arr[end] if current < 0 else current + arr[end]
        max_sum = max(max_sum, current)
    return max_sum


print(max_subarray_sum([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # 6
print(max_subarray_sum([1]))                               # 1
print(max_subarray_sum([-3, -1, -2]))                      # -1
print(max_subarray_sum([5, 4, -1, 7, 8]))                  # 23
print(max_subarray_sum([-1]))                              # -1
```

```java,editable
public class Main {
    static int maxSubarraySum(int[] arr) {
        if (arr.length == 0) return 0;
        int current = arr[0], maxSum = arr[0];
        for (int end = 1; end < arr.length; end++) {
            current = (current < 0) ? arr[end] : current + arr[end];
            if (current > maxSum) maxSum = current;
        }
        return maxSum;
    }

    public static void main(String[] args) {
        System.out.println(maxSubarraySum(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4}));
        System.out.println(maxSubarraySum(new int[]{1}));
        System.out.println(maxSubarraySum(new int[]{-3, -1, -2}));
        System.out.println(maxSubarraySum(new int[]{5, 4, -1, 7, 8}));
        System.out.println(maxSubarraySum(new int[]{-1}));
    }
}
```

```c,editable
#include <stdio.h>

int max_subarray_sum(int* arr, int n) {
    if (n == 0) return 0;
    int current = arr[0], max_sum = arr[0];
    for (int end = 1; end < n; end++) {
        current = (current < 0) ? arr[end] : current + arr[end];
        if (current > max_sum) max_sum = current;
    }
    return max_sum;
}

int main() {
    int a1[] = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    int a2[] = {1};
    int a3[] = {-3, -1, -2};
    int a4[] = {5, 4, -1, 7, 8};
    int a5[] = {-1};
    printf("%d\n", max_subarray_sum(a1, 9));
    printf("%d\n", max_subarray_sum(a2, 1));
    printf("%d\n", max_subarray_sum(a3, 3));
    printf("%d\n", max_subarray_sum(a4, 5));
    printf("%d\n", max_subarray_sum(a5, 1));
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <algorithm>

int maxSubarraySum(const std::vector<int>& arr) {
    if (arr.empty()) return 0;
    int current = arr[0], maxSum = arr[0];
    for (size_t end = 1; end < arr.size(); end++) {
        current = (current < 0) ? arr[end] : current + arr[end];
        maxSum = std::max(maxSum, current);
    }
    return maxSum;
}

int main() {
    std::cout << maxSubarraySum({-2, 1, -3, 4, -1, 2, 1, -5, 4}) << "\n";
    std::cout << maxSubarraySum({1})                              << "\n";
    std::cout << maxSubarraySum({-3, -1, -2})                     << "\n";
    std::cout << maxSubarraySum({5, 4, -1, 7, 8})                 << "\n";
    std::cout << maxSubarraySum({-1})                             << "\n";
}
```

```scala,editable
object Main extends App {
  def maxSubarraySum(arr: Array[Int]): Int = {
    if (arr.isEmpty) return 0
    var current = arr(0)
    var maxSum = arr(0)
    for (end <- 1 until arr.length) {
      current = if (current < 0) arr(end) else current + arr(end)
      maxSum = math.max(maxSum, current)
    }
    maxSum
  }

  println(maxSubarraySum(Array(-2, 1, -3, 4, -1, 2, 1, -5, 4)))
  println(maxSubarraySum(Array(1)))
  println(maxSubarraySum(Array(-3, -1, -2)))
  println(maxSubarraySum(Array(5, 4, -1, 7, 8)))
  println(maxSubarraySum(Array(-1)))
}
```

```typescript,editable
function maxSubarraySum(arr: number[]): number {
    if (arr.length === 0) return 0;
    let current = arr[0], maxSum = arr[0];
    for (let end = 1; end < arr.length; end++) {
        current = (current < 0) ? arr[end] : current + arr[end];
        maxSum = Math.max(maxSum, current);
    }
    return maxSum;
}

console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
console.log(maxSubarraySum([1]));
console.log(maxSubarraySum([-3, -1, -2]));
console.log(maxSubarraySum([5, 4, -1, 7, 8]));
console.log(maxSubarraySum([-1]));
```

```go,editable
package main

import "fmt"

func maxSubarraySum(arr []int) int {
    if len(arr) == 0 {
        return 0
    }
    current := arr[0]
    maxSum := arr[0]
    for end := 1; end < len(arr); end++ {
        if current < 0 {
            current = arr[end]
        } else {
            current += arr[end]
        }
        if current > maxSum {
            maxSum = current
        }
    }
    return maxSum
}

func main() {
    fmt.Println(maxSubarraySum([]int{-2, 1, -3, 4, -1, 2, 1, -5, 4}))
    fmt.Println(maxSubarraySum([]int{1}))
    fmt.Println(maxSubarraySum([]int{-3, -1, -2}))
    fmt.Println(maxSubarraySum([]int{5, 4, -1, 7, 8}))
    fmt.Println(maxSubarraySum([]int{-1}))
}
```

```rust,editable
fn max_subarray_sum(arr: &[i32]) -> i32 {
    if arr.is_empty() { return 0; }
    let mut current = arr[0];
    let mut max_sum = arr[0];
    for end in 1..arr.len() {
        current = if current < 0 { arr[end] } else { current + arr[end] };
        if current > max_sum { max_sum = current; }
    }
    max_sum
}

fn main() {
    println!("{}", max_subarray_sum(&[-2, 1, -3, 4, -1, 2, 1, -5, 4]));
    println!("{}", max_subarray_sum(&[1]));
    println!("{}", max_subarray_sum(&[-3, -1, -2]));
    println!("{}", max_subarray_sum(&[5, 4, -1, 7, 8]));
    println!("{}", max_subarray_sum(&[-1]));
}
```

</div>

<details>
<summary><strong>Trace — arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]</strong></summary>

```
Initial: current = arr[0] = -2, max_sum = -2

end=1: current=-2 < 0 → LEAP  | current = arr[1] = 1  | max_sum = max(-2, 1) = 1
end=2: current=1  ≥ 0 → extend| current = 1 + (-3) = -2| max_sum = max(1, -2) = 1
end=3: current=-2 < 0 → LEAP  | current = arr[3] = 4  | max_sum = max(1, 4) = 4
end=4: current=4  ≥ 0 → extend| current = 4 + (-1) = 3 | max_sum = max(4, 3) = 4
end=5: current=3  ≥ 0 → extend| current = 3 + 2 = 5    | max_sum = max(4, 5) = 5
end=6: current=5  ≥ 0 → extend| current = 5 + 1 = 6    | max_sum = max(5, 6) = 6
end=7: current=6  ≥ 0 → extend| current = 6 + (-5) = 1 | max_sum = max(6, 1) = 6
end=8: current=1  ≥ 0 → extend| current = 1 + 4 = 5    | max_sum = max(6, 5) = 6

Return: 6 ✓   (the subarray [4, -1, 2, 1], indices 3..6)
```

</details>

---

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(N) | Single pass; every element visited exactly once |
| **Space** | O(1) | Two integers: `current`, `max_sum` |

---

## Edge Cases

| Case | Example | Expected | Reasoning |
|---|---|---|---|
| All negative | `[-3, -1, -2]` | `-1` | Seed from `arr[0]` and record every iteration — the single largest element wins |
| Single element | `[5]` | `5` | Loop never runs; seed values are the answer |
| Entire array positive | `[5, 4, -1, 7, 8]` | `23` | Invariant never breaks; `current` just keeps accumulating |
| Starts with huge negative | `[-100, 1, 2, 3]` | `6` | One leap at `end=1`, then pure accumulation |
| Zero prefix | `[0, 0, -1, 5]` | `5` | Zeros are non-negative — invariant holds until the `-1`; code still correct |

---

## Final Takeaway

Maximum Subarray Sum is the archetype for "skip the bad region" variable window problems. The invariant (non-negative prefix) is stronger than Consecutive Ones's (all ones) because it allows negatives *inside* the window — only the prefix matters. This is Kadane's algorithm, and once you've internalised its skip-rather-than-shrink shape, you'll see it in half a dozen disguises: "maximum product subarray", "longest alternating subarray", "largest sum circular subarray" — all the same move with a different invariant.

> **Transfer Challenge:** Return the subarray itself (its start and end indices), not just the sum.
>
> <details><summary><strong>Solution hint</strong></summary>
>
> Track `cur_start` (resets to `end` on every leap) alongside `current`. When `current > max_sum`, also record `best_start = cur_start` and `best_end = end`. Three extra variables, same O(N) runtime.
>
> </details>

***

# Consecutive Ones with K Flips

## The Hook

You are building a feature flag rollout. Your uptime log is mostly `1`s (healthy) with scattered `0`s (hiccups). Your product manager asks: *"If we're allowed to 'forgive' up to `k` hiccups and smooth them over, what is the longest continuous success streak we could claim?"* This problem is the grand finale of the section — it generalises **both** Consecutive Ones (the `k=0` case) and demonstrates why `while` on contraction is essential. If you understand this, you own the variable sliding window.

## The Problem

> Given a binary array `arr` and a non-negative integer `k`, return the length of the longest contiguous subarray containing only `1`s **after flipping at most `k` of its `0`s to `1`s**.

```
Input:  arr = [1, 1, 0, 0, 1, 1, 1, 0, 1],  k = 2
Output: 7            (flip the two 0s at indices 2,3 → run [1,1,1,1,1,1,1] of length 7)

Input:  arr = [1, 0, 1, 1, 0, 1],  k = 1
Output: 4            (flip either 0 → a run of 4)

Input:  arr = [0, 0, 0],  k = 0
Output: 0            (no flips allowed, no 1s present — equals Consecutive Ones on [0,0,0])

Input:  arr = [1, 1, 1],  k = 5
Output: 3            (already all 1s; extra flips unused)
```

---

## Intuition

The invariant: **the window contains at most `k` zeros**. As long as we can fit all the zeros we've seen into our flip budget, the whole window is a valid candidate — we'd just flip every zero in it.

When the invariant breaks (`zeros > k`), we contract from the left *until it holds again*. How many contractions? Exactly enough to drop one zero out of the window — which could take anywhere from one step (if `arr[start]` is the zero) to many (if `arr[start]` is a `1` and the offending zero is deep inside).

> *Predict: with `arr = [1, 1, 1, 1, 0, 1, 1, 1, 1, 0]` and `k = 1`, how many contractions happen when `end` reaches the second zero at index 9?*

Answer: five. `start` must walk from `0` past the first zero at index `4`, so `start` becomes `5`. Each of those four `1`s and one `0` is ejected one at a time — five contractions, all amortised into the total O(N) bound.

And here is the payoff: set `k = 0`, and this code becomes **identical in behaviour** to Consecutive Ones. Same invariant ("at most 0 zeros" = "all ones"), same outcome. Consecutive Ones was a special case all along.

---

## The Solution

<div class="lang-tabs">

```pseudocode
# Longest run of 1s achievable by flipping at most k zeros.
# Window invariant: at most k zeros inside [start, end].
function longestOnesWithKFlips(arr, k):
    n ← length(arr)
    if n = 0: return 0
    start ← 0; zeros ← 0; maxLen ← 0
    for end from 0 to n − 1:
        if arr[end] = 0: zeros ← zeros + 1        # 0 costs one flip
        while zeros > k:                           # over budget — shrink from the left
            if arr[start] = 0: zeros ← zeros − 1
            start ← start + 1
        maxLen ← max(maxLen, end − start + 1)
    return maxLen
```

```python,editable
from typing import List

def longest_ones_with_k_flips(arr: List[int], k: int) -> int:
    n = len(arr)
    if n == 0:
        return 0
    start = zeros = max_len = 0
    for end in range(n):
        if arr[end] == 0:
            zeros += 1                                  # 0 costs one flip.
        while zeros > k:                                # Over budget — shrink.
            if arr[start] == 0:
                zeros -= 1
            start += 1
        max_len = max(max_len, end - start + 1)
    return max_len


print(longest_ones_with_k_flips([1, 1, 0, 0, 1, 1, 1, 0, 1], 2))   # 7
print(longest_ones_with_k_flips([1, 0, 1, 1, 0, 1], 1))             # 4
print(longest_ones_with_k_flips([0, 0, 0], 0))                      # 0
print(longest_ones_with_k_flips([1, 1, 1], 5))                      # 3
print(longest_ones_with_k_flips([0, 0, 1, 1, 0, 0, 1, 1, 1], 3))    # 9
```

```java,editable
public class Main {
    static int longestOnesWithKFlips(int[] arr, int k) {
        int n = arr.length;
        if (n == 0) return 0;
        int start = 0, zeros = 0, maxLen = 0;
        for (int end = 0; end < n; end++) {
            if (arr[end] == 0) zeros++;
            while (zeros > k) {
                if (arr[start] == 0) zeros--;
                start++;
            }
            if (end - start + 1 > maxLen) maxLen = end - start + 1;
        }
        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println(longestOnesWithKFlips(new int[]{1, 1, 0, 0, 1, 1, 1, 0, 1}, 2));
        System.out.println(longestOnesWithKFlips(new int[]{1, 0, 1, 1, 0, 1}, 1));
        System.out.println(longestOnesWithKFlips(new int[]{0, 0, 0}, 0));
        System.out.println(longestOnesWithKFlips(new int[]{1, 1, 1}, 5));
        System.out.println(longestOnesWithKFlips(new int[]{0, 0, 1, 1, 0, 0, 1, 1, 1}, 3));
    }
}
```

```c,editable
#include <stdio.h>

int longest_ones_with_k_flips(int* arr, int n, int k) {
    if (n == 0) return 0;
    int start = 0, zeros = 0, max_len = 0;
    for (int end = 0; end < n; end++) {
        if (arr[end] == 0) zeros++;
        while (zeros > k) {
            if (arr[start] == 0) zeros--;
            start++;
        }
        if (end - start + 1 > max_len) max_len = end - start + 1;
    }
    return max_len;
}

int main() {
    int a1[] = {1, 1, 0, 0, 1, 1, 1, 0, 1}; printf("%d\n", longest_ones_with_k_flips(a1, 9, 2));
    int a2[] = {1, 0, 1, 1, 0, 1};          printf("%d\n", longest_ones_with_k_flips(a2, 6, 1));
    int a3[] = {0, 0, 0};                   printf("%d\n", longest_ones_with_k_flips(a3, 3, 0));
    int a4[] = {1, 1, 1};                   printf("%d\n", longest_ones_with_k_flips(a4, 3, 5));
    int a5[] = {0, 0, 1, 1, 0, 0, 1, 1, 1}; printf("%d\n", longest_ones_with_k_flips(a5, 9, 3));
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <algorithm>

int longestOnesWithKFlips(const std::vector<int>& arr, int k) {
    int n = (int)arr.size();
    if (n == 0) return 0;
    int start = 0, zeros = 0, maxLen = 0;
    for (int end = 0; end < n; end++) {
        if (arr[end] == 0) zeros++;
        while (zeros > k) {
            if (arr[start] == 0) zeros--;
            start++;
        }
        maxLen = std::max(maxLen, end - start + 1);
    }
    return maxLen;
}

int main() {
    std::cout << longestOnesWithKFlips({1, 1, 0, 0, 1, 1, 1, 0, 1}, 2) << "\n";
    std::cout << longestOnesWithKFlips({1, 0, 1, 1, 0, 1}, 1)          << "\n";
    std::cout << longestOnesWithKFlips({0, 0, 0}, 0)                   << "\n";
    std::cout << longestOnesWithKFlips({1, 1, 1}, 5)                   << "\n";
    std::cout << longestOnesWithKFlips({0, 0, 1, 1, 0, 0, 1, 1, 1}, 3) << "\n";
}
```

```scala,editable
object Main extends App {
  def longestOnesWithKFlips(arr: Array[Int], k: Int): Int = {
    if (arr.isEmpty) return 0
    var start = 0
    var zeros = 0
    var maxLen = 0
    for (end <- arr.indices) {
      if (arr(end) == 0) zeros += 1
      while (zeros > k) {
        if (arr(start) == 0) zeros -= 1
        start += 1
      }
      maxLen = math.max(maxLen, end - start + 1)
    }
    maxLen
  }

  println(longestOnesWithKFlips(Array(1, 1, 0, 0, 1, 1, 1, 0, 1), 2))
  println(longestOnesWithKFlips(Array(1, 0, 1, 1, 0, 1), 1))
  println(longestOnesWithKFlips(Array(0, 0, 0), 0))
  println(longestOnesWithKFlips(Array(1, 1, 1), 5))
  println(longestOnesWithKFlips(Array(0, 0, 1, 1, 0, 0, 1, 1, 1), 3))
}
```

```typescript,editable
function longestOnesWithKFlips(arr: number[], k: number): number {
    const n = arr.length;
    if (n === 0) return 0;
    let start = 0, zeros = 0, maxLen = 0;
    for (let end = 0; end < n; end++) {
        if (arr[end] === 0) zeros++;
        while (zeros > k) {
            if (arr[start] === 0) zeros--;
            start++;
        }
        maxLen = Math.max(maxLen, end - start + 1);
    }
    return maxLen;
}

console.log(longestOnesWithKFlips([1, 1, 0, 0, 1, 1, 1, 0, 1], 2));
console.log(longestOnesWithKFlips([1, 0, 1, 1, 0, 1], 1));
console.log(longestOnesWithKFlips([0, 0, 0], 0));
console.log(longestOnesWithKFlips([1, 1, 1], 5));
console.log(longestOnesWithKFlips([0, 0, 1, 1, 0, 0, 1, 1, 1], 3));
```

```go,editable
package main

import "fmt"

func longestOnesWithKFlips(arr []int, k int) int {
    n := len(arr)
    if n == 0 {
        return 0
    }
    start, zeros, maxLen := 0, 0, 0
    for end := 0; end < n; end++ {
        if arr[end] == 0 {
            zeros++
        }
        for zeros > k {
            if arr[start] == 0 {
                zeros--
            }
            start++
        }
        if end-start+1 > maxLen {
            maxLen = end - start + 1
        }
    }
    return maxLen
}

func main() {
    fmt.Println(longestOnesWithKFlips([]int{1, 1, 0, 0, 1, 1, 1, 0, 1}, 2))
    fmt.Println(longestOnesWithKFlips([]int{1, 0, 1, 1, 0, 1}, 1))
    fmt.Println(longestOnesWithKFlips([]int{0, 0, 0}, 0))
    fmt.Println(longestOnesWithKFlips([]int{1, 1, 1}, 5))
    fmt.Println(longestOnesWithKFlips([]int{0, 0, 1, 1, 0, 0, 1, 1, 1}, 3))
}
```

```rust,editable
fn longest_ones_with_k_flips(arr: &[i32], k: i32) -> usize {
    if arr.is_empty() { return 0; }
    let mut start = 0usize;
    let mut zeros = 0i32;
    let mut max_len = 0usize;
    for end in 0..arr.len() {
        if arr[end] == 0 { zeros += 1; }
        while zeros > k {
            if arr[start] == 0 { zeros -= 1; }
            start += 1;
        }
        let len = end - start + 1;
        if len > max_len { max_len = len; }
    }
    max_len
}

fn main() {
    println!("{}", longest_ones_with_k_flips(&[1, 1, 0, 0, 1, 1, 1, 0, 1], 2));
    println!("{}", longest_ones_with_k_flips(&[1, 0, 1, 1, 0, 1], 1));
    println!("{}", longest_ones_with_k_flips(&[0, 0, 0], 0));
    println!("{}", longest_ones_with_k_flips(&[1, 1, 1], 5));
    println!("{}", longest_ones_with_k_flips(&[0, 0, 1, 1, 0, 0, 1, 1, 1], 3));
}
```

</div>

<details>
<summary><strong>Trace — arr = [1, 1, 0, 0, 1, 1, 1, 0, 1], k = 2</strong></summary>

```
start=0, zeros=0, max_len=0

end=0: arr[0]=1 | zeros=0 ≤ 2 ✓ | window=[0..0] len=1 | max_len=1
end=1: arr[1]=1 | zeros=0 ≤ 2 ✓ | window=[0..1] len=2 | max_len=2
end=2: arr[2]=0 → zeros=1 | 1 ≤ 2 ✓ | window=[0..2] len=3 | max_len=3
end=3: arr[3]=0 → zeros=2 | 2 ≤ 2 ✓ | window=[0..3] len=4 | max_len=4
end=4: arr[4]=1 | zeros=2 ≤ 2 ✓ | window=[0..4] len=5 | max_len=5
end=5: arr[5]=1 | zeros=2 ≤ 2 ✓ | window=[0..5] len=6 | max_len=6
end=6: arr[6]=1 | zeros=2 ≤ 2 ✓ | window=[0..6] len=7 | max_len=7
end=7: arr[7]=0 → zeros=3 | 3 > 2 → contract:
         arr[0]=1 → start=1 (zeros still 3)
         arr[1]=1 → start=2 (zeros still 3)
         arr[2]=0 → zeros=2, start=3 (stop — invariant restored)
       window=[3..7] len=5                              | max_len=7
end=8: arr[8]=1 | zeros=2 ≤ 2 ✓ | window=[3..8] len=6 | max_len=7

Return: 7 ✓   (flipping the two 0s at indices 2,3 gives a run of 7)

The multi-step contraction at end=7 is the 'while' in action — three
shrinks needed to eject one troublesome 0.
```

</details>

---

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(N) | `end` advances `N` times; `start` also advances at most `N` times in total (amortised) |
| **Space** | O(1) | Three integers: `start`, `zeros`, `max_len` |

---

## Edge Cases

| Case | Example | Expected | Reasoning |
|---|---|---|---|
| `k = 0` | `arr=[1,0,1]`, `k=0` | `1` | Reduces to Consecutive Ones — any `0` forces a leap |
| `k ≥ number of zeros` | `arr=[0,1,0]`, `k=10` | `3` | Every zero fits within budget; window = entire array |
| All ones | `arr=[1,1,1]`, `k=2` | `3` | `zeros` never grows; `start` never moves |
| All zeros, `k=0` | `arr=[0,0,0]`, `k=0` | `0` | Every expansion breaks the invariant; `start` chases `end` forever |
| All zeros, `k ≥ n` | `arr=[0,0,0]`, `k=3` | `3` | Every zero fits; entire array is a valid window |

---

## Comparison: The Four Problems at a Glance

| Problem | Invariant | Contract with | Key insight |
|---|---|---|---|
| Consecutive Ones | Window has zero `0`s | Leap (`start = end + 1`) | One bad element voids every window touching it |
| Product Conundrum | Product `< k` | `while` loop | One big element can eject several small ones |
| Maximum Subarray Sum | Prefix sum `≥ 0` | Leap (`current = arr[end]`) | A negative prefix can never help — skip it whole |
| Consecutive Ones with K flips | Zero count `≤ k` | `while` loop | Budget-bounded tolerance — generalises Consecutive Ones |

The leap variants trade a potential slow shrink for a single jump; the `while` variants earn their amortised O(N) by only ever moving `start` forward. Every problem in this section is one of these two shapes.

---

## Final Takeaway

Consecutive Ones with K flips is the capstone — a window that tolerates a bounded amount of "badness" and uses that tolerance to find a longer run. The `while`-loop contraction is the general-purpose tool; the single leap (seen in problems 1 and 3) is an optimised special case. If you can answer **"what is my invariant?"** and **"how do I restore it after a bad element enters?"**, every variable-window problem on the rest of this course — and most on any interview whiteboard — will yield to the same two-pointer dance.

> **Transfer Challenge:** Extend the solution to return the **actual flipped array** (the original with up to `k` zeros replaced by `1`s inside the best window). Can you do it without a second pass?
>
> <details><summary><strong>Solution hint</strong></summary>
>
> Track `best_start` and `best_end` alongside `max_len`. After the main loop, copy `arr`, then iterate `i` from `best_start` to `best_end` and set every `0` in that range to `1`. It is *technically* a second pass over the window, but not over the full array — the total work is still O(N).
>
> </details>

---

With the four problems complete, you have every move the variable-sized sliding window knows. The next section — **pattern interval merging** — takes the sliding idea off the raw array and applies it to a sorted list of intervals. The window gets replaced by a sweeping line, but the two-pointer shape you have internalised here stays exactly the same.
