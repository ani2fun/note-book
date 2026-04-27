# 3. Pattern: Two pointers

This section introduces the direct-application version of the two-pointer pattern and walks through representative problems.

## Table of contents

1. [Understanding the two pointer pattern](#understanding-the-two-pointer-pattern)
2. [Identifying direct application](#identifying-direct-application)
3. [Flip characters](#flip-characters)
4. [Palindrome checker](#palindrome-checker)
5. [Vowel exchange](#vowel-exchange)
6. [Reverse words](#reverse-words)
7. [Reverse segments](#reverse-segments)
8. [Reverse word order](#reverse-word-order)

***

# Understanding the Two Pointer Pattern

## Why Single-Direction Traversal Isn't Always Enough

When you work with arrays, a single loop moving left to right is your default tool. It handles most problems cleanly. But some problems have a property that a single direction completely ignores: **both ends of the array matter at the same time**.

Think about checking if a word is a palindrome. You need to compare the first character with the last, the second with the second-to-last — you're always looking at two positions simultaneously, one from each end. A single forward loop forces you to either:
- Use a second nested loop (O(n²) — very slow), or
- Store results and do two passes (extra space)

The **two-pointer technique** solves this elegantly: use two variables, `left` and `right`, as indices that start at opposite ends and march toward each other in a single pass.

---

## The Core Idea

Two pointers (`left` and `right`) start at opposite ends of the array and converge toward the middle. At each step, you do some work using both `arr[left]` and `arr[right]`, then move one or both pointers inward.

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
  L(["left = 0\n→"]) -->|"starts here"| A0

  subgraph ARR["Array"]
    direction LR
    A0["arr[0]"] --- A1["arr[1]"] --- A2["arr[2]"] --- MID["···"] --- An2["arr[n-3]"] --- An1["arr[n-2]"] --- An["arr[n-1]"]
  end

  An -->|"starts here"| R(["← right = n-1"])
  MID -.->|"loop ends when\nleft ≥ right"| STOP(["✓ done"])
```

<p align="center"><strong>The two-pointer traversal — <code>left</code> starts at index 0 and advances right; <code>right</code> starts at index n−1 and retreats left. They meet in the middle.</strong></p>

The loop terminates when `left >= right`. At that point, every pair of equidistant positions has been visited exactly once — which is why the algorithm runs in **O(n) time with O(1) extra space**.

---

## How the Pointers Move

Here is the full picture of a single traversal on an array of size 7:

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
  subgraph S0["Initial state"]
    direction LR
    L0(["left=0"]) --> I0["A"] --- I1["B"] --- I2["C"] --- I3["D"] --- I4["E"] --- I5["F"] --- I6["G"]
    I6 --> R0(["right=6"])
  end
  subgraph S1["After iteration 1  (A & G processed, left++, right--)"]
    direction LR
    L1(["left=1"]) --> J1["B"] --- J2["C"] --- J3["D"] --- J4["E"] --- J5["F"]
    J5 --> R1(["right=5"])
  end
  subgraph S2["After iteration 2  (B & F processed, left++, right--)"]
    direction LR
    L2(["left=2"]) --> K2["C"] --- K3["D"] --- K4["E"]
    K4 --> R2(["right=4"])
  end
  subgraph S3["After iteration 3  (C & E processed, left++, right--)"]
    direction LR
    L3(["left=3"]) --> M3["D"]
    M3 --> R3(["right=3"])
  end
  subgraph S4["left = right = 3  →  loop ends"]
    DONE(["✓ centre element D handled separately if needed"])
  end

  S0 --> S1 --> S2 --> S3 --> S4
```

<p align="center"><strong>Iteration-by-iteration view of the two-pointer traversal on a 7-element array — each step processes one pair of equidistant elements and closes the gap by one on each side.</strong></p>

---

## The Generic Algorithm

The two-pointer pattern follows this skeleton for every problem that uses it directly:

**Step 1.** Initialise `left = 0`, `right = n − 1` (or whatever starting positions the problem requires, as long as `left < right`).

**Step 2.** Loop while `left < right`:
- **Step 2.1** — do some work on `arr[left]` and `arr[right]`
- **Step 2.2** — move `left` forward by some number of steps (if the problem requires it)
- **Step 2.3** — move `right` backward by some number of steps (if the problem requires it)

**Step 3.** Return the result.

The specific "work" and "step size" in steps 2.1–2.3 change per problem. Everything else stays the same.

---

## Generic Implementation

```python,editable
from typing import List

class Solution:
    def two_pointer(self, arr: List[int]) -> None:
        left = 0
        right = len(arr) - 1

        while left < right:
            left_val  = arr[left]
            right_val = arr[right]

            # Problem-specific work goes here
            # e.g. swap, compare, accumulate…

            # Move left forward if the problem calls for it
            if self.should_move_left(left_val, right_val):
                left += self.left_step(left_val, right_val)

            # Move right backward if the problem calls for it
            if self.should_move_right(left_val, right_val):
                right -= self.right_step(left_val, right_val)

    def should_move_left(self, lv: int, rv: int) -> bool:
        return True   # almost always True — move left every step

    def should_move_right(self, lv: int, rv: int) -> bool:
        return True   # almost always True — move right every step

    def left_step(self, lv: int, rv: int) -> int:
        return 1      # most problems step by 1

    def right_step(self, lv: int, rv: int) -> int:
        return 1      # most problems step by 1


# Try it out — replace this body with a real problem later
arr = [1, 2, 3, 4, 5, 6, 7]
Solution().two_pointer(arr)
print("Done — customise the template above to solve a real problem!")
```

---

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(n) | `left` and `right` together visit every index exactly once. No element is processed twice. |
| **Space** | O(1) | Only two integer variables (`left` and `right`) are needed regardless of input size. |

This is true for every problem that directly applies the two-pointer technique — **both best and worst case are O(n) time, O(1) space**.

The power of this pattern is that it reduces problems which naively need O(n²) nested loops to a single O(n) pass.

---

## Three Ways to Apply Two Pointers

Not every two-pointer problem is identical. Problems in this pattern fall into three categories:

```d2
Root: Two-Pointer Pattern Problems

D: |md
  **Direct Application**

  Two pointers applied as-is

  (e.g. reverse, palindrome check)
|

R: |md
  **Reduction**

  Problem reduced to an
  equivalent two-pointer problem
|

S: |md
  **Subproblems**

  One step of the solution
  uses two pointers internally
|

Root -> D
Root -> R
Root -> S
```

<p align="center"><strong>Three categories of two-pointer pattern problems — we start with Direct Application, which is the simplest and most common.</strong></p>

In the next lessons, we work through the **Direct Application** category in depth — problems where the two-pointer template above applies almost verbatim.

***

# Identifying Direct Application

## What Makes a Problem a "Direct Application"?

The two-pointer technique can be applied **directly** when the problem asks you to do something with pairs of elements — one from each end — while moving both pointers inward until they meet. No clever transformation needed. The template fits as-is.

The mental checklist:

> ✅ We need to look at two positions simultaneously
> ✅ One position starts near the beginning, one near the end
> ✅ Both move inward with each iteration
> ✅ The work done at each step is simple (swap, compare, copy…)

If those four boxes are checked, you're looking at a direct application.

---

## The Canonical Example: Reverse an Array In-Place

**Problem statement:** Given an array `arr`, reverse it in-place. Do not create and return a new array — modify the original.

```
Input:  arr = [1, 2, 3, 4, 5]
Output: arr is modified to [5, 4, 3, 2, 1]
```

```d2
before: "Original" {
  grid-columns: 5
  grid-gap: 0
  a: "1"
  b: "2"
  c: "3"
  d: "4"
  e: "5"
}

after: "Reversed (in-place)" {
  grid-columns: 5
  grid-gap: 0
  a: "5"
  b: "4"
  c: "3"
  d: "2"
  e: "1"
}

before -> after
```

<p align="center"><strong>Reverse the array in-place — the original array (top) becomes the reversed array (bottom) without allocating new memory.</strong></p>

---

## Brute Force: Two Passes + Temp Array

The naive approach copies elements in reverse into a temporary array, then copies back:

1. Walk `arr` backwards and fill `temp` forwards
2. Walk `temp` forwards and copy back into `arr`

```d2
ORIG: "Original arr" {
  grid-columns: 5
  grid-gap: 0
  a: "1"
  b: "2"
  c: "3"
  d: "4"
  e: "5"
}

TEMP: "temp (copy arr backwards)" {
  grid-columns: 5
  grid-gap: 0
  a: "5"
  b: "4"
  c: "3"
  d: "2"
  e: "1"
}

BACK: "arr (copy temp back)" {
  grid-columns: 5
  grid-gap: 0
  a: "5"
  b: "4"
  c: "3"
  d: "2"
  e: "1"
}

ORIG -> TEMP: pass 1 — backwards copy
TEMP -> BACK: pass 2 — forwards copy
```

<p align="center"><strong>Brute-force reversal — two full passes and O(n) extra space for the temp array.</strong></p>

```python,editable
from typing import List

class BruteForce:
    def reverse(self, arr: List[int]) -> None:
        n = len(arr)
        temp = [0] * n

        # Pass 1: copy arr backwards into temp
        for i in range(n - 1, -1, -1):
            temp[n - 1 - i] = arr[i]

        # Pass 2: copy temp back into arr
        for i in range(n):
            arr[i] = temp[i]


arr = [1, 2, 3, 4, 5]
BruteForce().reverse(arr)
print(arr)   # [5, 4, 3, 2, 1]
```

This works, but it uses O(n) extra space and touches every element twice. We can do better.

---

## Two-Pointer Solution: One Pass, Zero Extra Space

**Key insight:** to reverse an array, we just need to swap equidistant elements from both ends — `arr[0] ↔ arr[n-1]`, `arr[1] ↔ arr[n-2]`, and so on. Each swap needs exactly two positions: one from the left, one from the right. That's the two-pointer template.

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
  subgraph Step0["Start: left=0, right=4"]
    direction LR
    A0(["left"]) --> S0A["1"] --- S0B["2"] --- S0C["3"] --- S0D["4"] --- S0E["5"]
    S0E --> B0(["right"])
  end
  subgraph Step1["Swap arr[0]↔arr[4], left=1, right=3"]
    direction LR
    A1(["left"]) --> S1A["5"] --- S1B["2"] --- S1C["3"] --- S1D["4"] --- S1E["1"]
    S1D --> B1(["right"])
  end
  subgraph Step2["Swap arr[1]↔arr[3], left=2, right=2"]
    direction LR
    A2(["left"]) --> S2A["5"] --- S2B["4"] --- S2C["3"] --- S2D["2"] --- S2E["1"]
    S2C --> B2(["right"])
  end
  subgraph Step3["left = right = 2  →  loop ends"]
    DONE(["✓  arr = [5, 4, 3, 2, 1]"])
  end

  Step0 -->|"swap + move"| Step1
  Step1 -->|"swap + move"| Step2
  Step2 -->|"left ≥ right"| Step3
```

<p align="center"><strong>Two-pointer reversal on <code>[1, 2, 3, 4, 5]</code> — two swaps close the gap from both ends; the middle element needs no swap.</strong></p>

```python,editable
from typing import List

class Solution:
    def reverse(self, arr: List[int]) -> None:
        left  = 0              # Start at the leftmost element
        right = len(arr) - 1   # Start at the rightmost element

        # Stop when pointers meet or cross:
        #   - Odd-length array: left == right at the middle element — it's already in place, no swap needed
        #   - Even-length array: left > right means all pairs have been swapped
        while left < right:
            # Swap the two ends — these elements are equidistant from center
            # and belong in each other's positions after reversal
            arr[left], arr[right] = arr[right], arr[left]

            left  += 1  # This position is finalized — move inward
            right -= 1  # This position is finalized — move inward
        # Invariant at exit: every pair (0, n-1), (1, n-2), ... has been swapped.
        # The array is fully reversed in-place.


arr = [1, 2, 3, 4, 5]
Solution().reverse(arr)
print(arr)   # [5, 4, 3, 2, 1]

arr2 = [1, 2, 3, 4]
Solution().reverse(arr2)
print(arr2)  # [4, 3, 2, 1]
```

One pass. No extra memory. The two-pointer template applied directly.

<details>
<summary><strong>Trace — arr = [1, 2, 3, 4, 5]</strong></summary>

```
arr = [1, 2, 3, 4, 5]   left = 0,  right = 4

Step 1 │ left=0 (1),  right=4 (5) │ 0 < 4 → swap │ [5, 2, 3, 4, 1] │ left=1, right=3
Step 2 │ left=1 (2),  right=3 (4) │ 1 < 3 → swap │ [5, 4, 3, 2, 1] │ left=2, right=2
Step 3 │ left=2 (3),  right=2 (3) │ 2 == 2 → left < right is false → loop exits

Result: [5, 4, 3, 2, 1] ✓

Note: The middle element (3) never needed a swap — it's equidistant from both ends
      and sits in its correct reversed position automatically.

Even-length check — arr = [1, 2, 3, 4]:
Step 1 │ left=0 (1),  right=3 (4) │ 0 < 3 → swap │ [4, 2, 3, 1] │ left=1, right=2
Step 2 │ left=1 (2),  right=2 (3) │ 1 < 2 → swap │ [4, 3, 2, 1] │ left=2, right=1
Step 3 │ left=2,      right=1     │ 2 > 1 → loop exits (pointers crossed)

Result: [4, 3, 2, 1] ✓

Note: For even-length arrays the pointers cross (left > right) rather than meet —
      all pairs are handled before that happens.
```

</details>

---

## Fitting the Template

Let's verify this problem matches all four checkboxes:

| Checkpoint | This Problem |
|---|---|
| Two positions at once? | ✅ `arr[left]` and `arr[right]` |
| One near start, one near end? | ✅ `left=0`, `right=n-1` |
| Both move inward? | ✅ `left++`, `right--` each iteration |
| Simple work per step? | ✅ One swap |

---

### Checkpoint 1 — Why "two positions at once"?

**WHAT:** A reversal requires swapping pairs of elements. A swap is an inherently two-element operation — you can't swap a single element with nothing.

**WHY it means two pointers fit:** Every step of the algorithm needs `arr[left]` and `arr[right]` simultaneously. One pointer alone can't do the job — it would need to "remember" the element it picked up and go look for where to put it, which is exactly what the brute force does (it stores the whole array in `temp`).

**What breaks with a single pointer:** Walk forward with one pointer and try to reverse in-place — when you overwrite `arr[0]` with `arr[4]`, the original `arr[0]` is gone. You'd need to save it somewhere first. That "somewhere" is the temp array. Two pointers sidestep the need entirely: they swap atomically (`a, b = b, a`), so nothing is lost.

> **Rule of thumb:** If the problem needs to operate on two elements that "belong together" (a pair, a palindrome check, a sum), two simultaneous pointers are the natural fit.

---

### Checkpoint 2 — Why "one near start, one near end"?

**WHAT:** `left` starts at index `0` (the first element), `right` starts at index `n-1` (the last element).

**WHY this specific placement:** After reversal, element at index `0` must land at index `n-1` and vice versa. Element at index `1` must land at `n-2`. The pattern is: **element at distance `d` from the left end swaps with element at distance `d` from the right end**.

Placing one pointer at each end directly aligns with this structure — at every step, `left` and `right` are pointing at exactly the pair that needs to swap next.

**What breaks with a different placement:** If both pointers started from the left (like in many sliding window problems), you'd never naturally reach the element at `n-1` first. You'd be doing something fundamentally different — not a reversal.

**Concrete check:** `[1, 2, 3, 4, 5]`
- `left=0, right=4`: `1` and `5` are the farthest pair — swap first ✓
- `left=1, right=3`: `2` and `4` are next closest pair — swap second ✓
- `left=2, right=2`: single middle element — no swap needed ✓

---

### Checkpoint 3 — Why "both move inward"?

**WHAT:** After each swap, both `left` increments by 1 and `right` decrements by 1.

**WHY inward movement:** After swapping `arr[left]` and `arr[right]`, those two positions are finalized — they now hold the correct values for a reversed array. The unsolved subproblem is the inner portion: `arr[left+1 .. right-1]`. Moving both pointers inward shrinks the problem by 2 each step and focuses attention on exactly what's left to solve.

**Why the stop condition is `left < right` (not `left <= right`):**
- When `left == right` (odd-length arrays): both pointers are at the same middle element. That element is already in the correct position — swapping it with itself is a no-op. We stop before that unnecessary step.
- When `left > right` (even-length arrays): the pointers have crossed, all pairs have been handled. No element remains.

**What breaks if you stop at `left <= right`:** For odd-length arrays like `[1, 2, 3, 4, 5]`, when `left = right = 2`, you'd execute `arr[2], arr[2] = arr[2], arr[2]` — harmless but wasteful. For the stop condition to be correct, `left < right` is sufficient and exact.

---

### Checkpoint 4 — Why "simple work per step"?

**WHAT:** At each step, we do exactly one swap: `arr[left], arr[right] = arr[right], arr[left]`.

**WHY "simple" matters:** The two-pointer direct application template is powerful precisely because the loop body is O(1) — a fixed amount of work per step. Combined with O(n) steps (n/2 swaps), the total is O(n) time. The simplicity of the per-step work is what keeps the whole algorithm lean.

**HOW to recognize "simple work" in other problems:** The work per step should not require nested loops, searching, or recursion. It should be a direct operation on the two elements currently pointed at — compare, swap, copy, check equality. If the per-step work itself requires a loop, you may be looking at a subproblem pattern instead (section 05).

**What this rules out:** If you found yourself needing to scan the entire remaining array on each step, that's O(n²) and the direct-application template no longer applies cleanly.

---

That's a direct application — all four checkboxes confirmed.

---

## Problems in This Category

The following lessons each apply the two-pointer technique in exactly this direct way. Each is a small variation on the same theme:

| Problem | Two-pointer work per step |
|---|---|
| **Flip Characters** | Swap characters from both ends |
| **Palindrome Checker** | Compare characters from both ends |
| **Vowel Exchange** | Find and swap vowels from both ends |
| **Reverse Words** | Reverse each word's characters with inner two pointers |
| **Reverse Segments** | Reverse a sub-range with two pointers |
| **Reverse Word Order** | Reverse entire string, then reverse each word |

Each is a small twist on the same pattern — same skeleton, different work in the loop body.

***

# Flip Characters

## The Problem

Given an array of characters, reverse the array **in-place** — that is, modify the original array so its characters appear in reverse order.

```
Input:  chars = ['h', 'e', 'l', 'l', 'o']
Output: chars is modified to ['o', 'l', 'l', 'e', 'h']
```

This is the character-array equivalent of reversing an integer array — the same two-pointer mechanics, applied to chars.

---

## Examples

**Example 1**
```
Input:  ['h', 'e', 'l', 'l', 'o']
Output: ['o', 'l', 'l', 'e', 'h']
```

**Example 2**
```
Input:  ['A', 'B', 'C', 'D']
Output: ['D', 'C', 'B', 'A']
```

**Example 3 — single character**
```
Input:  ['X']
Output: ['X']   (unchanged)
```

---

## Intuition

To reverse a sequence, the first element must become the last, the second must become the second-to-last, and so on. Every character has a **mirror partner** equidistant from the opposite end. We just need to swap each pair.

Two pointers are perfect for this: `left` starts at index 0 (the first character), `right` starts at index `n-1` (the last character). Swap the pair, then move both inward. Repeat until they meet.

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
  subgraph S0["Start  —  left=0, right=4"]
    direction LR
    P0L(["left"]) --> C0["h"] --- C1["e"] --- C2["l"] --- C3["l"] --- C4["o"]
    C4 --> P0R(["right"])
  end
  subgraph S1["Swap 'h' ↔ 'o'  —  left=1, right=3"]
    direction LR
    P1L(["left"]) --> D0["o"] --- D1["e"] --- D2["l"] --- D3["l"] --- D4["h"]
    D3 --> P1R(["right"])
  end
  subgraph S2["Swap 'e' ↔ 'l'  —  left=2, right=2"]
    direction LR
    P2L(["left"]) --> E0["o"] --- E1["l"] --- E2["l"] --- E3["e"] --- E4["h"]
    E2 --> P2R(["right"])
  end
  subgraph S3["left = right = 2  →  loop ends"]
    DONE(["✓  ['o','l','l','e','h']"])
  end

  S0 -->|"swap + left++ + right--"| S1
  S1 -->|"swap + left++ + right--"| S2
  S2 -->|"left ≥ right"| S3
```

<p align="center"><strong>Flipping <code>['h','e','l','l','o']</code> in-place — two swaps bring the array to its reversed state; the middle character needs no swap.</strong></p>

---

## Applying the Diagnostic Questions

| Check | Answer for Flip Characters |
|---|---|
| ✅ Two positions simultaneously? | Yes — `chars[left]` and `chars[right]` are read and swapped together at every step |
| ✅ One near start, one near end? | Yes — `left = 0`, `right = n-1` |
| ✅ Both move inward? | Yes — `left++`, `right--` after every swap |
| ✅ Simple work at each step? | Yes — one swap per iteration |

Every box is checked with nothing extra needed. This is the purest direct application — the template and the algorithm are identical.

**Why does every element have exactly one partner?** Because reversal is a bijection: element at position `i` maps to position `n-1-i`. Two pointers exploit this directly — `left` tracks "the element at distance 0 from the left" and `right` tracks "the element at distance 0 from the right." Every step, both advance one position inward, so the i-th iteration handles the i-th mirror pair. When `left >= right`, all pairs have been processed.

**What breaks if you use one pointer instead?** A single forward pointer at position `i` can move `chars[i]` to its destination at `n-1-i`, but it has already overwritten whatever was at `n-1-i` — you need a temp variable and a second loop. Two pointers avoid this entirely: the swap is symmetric, so both elements land in their correct positions in one step, no temp array required.

---

## Approach

1. Set `left = 0`, `right = len(chars) - 1`
2. While `left < right`:
   - Swap `chars[left]` and `chars[right]`
   - `left += 1`, `right -= 1`
3. Done — the array is reversed in-place

---

## Solution

```python,editable
from typing import List

class Solution:
    def flip_characters(self, chars: List[str]) -> None:
        left  = 0
        right = len(chars) - 1

        while left < right:
            # Swap the mirror pair
            chars[left], chars[right] = chars[right], chars[left]

            # Move both pointers inward
            left  += 1
            right -= 1


# --- Test ---
c1 = ['h', 'e', 'l', 'l', 'o']
Solution().flip_characters(c1)
print(c1)   # ['o', 'l', 'l', 'e', 'h']

c2 = ['A', 'B', 'C', 'D']
Solution().flip_characters(c2)
print(c2)   # ['D', 'C', 'B', 'A']

c3 = ['X']
Solution().flip_characters(c3)
print(c3)   # ['X']
```

---

## Dry Run — Example 1

`chars = ['h', 'e', 'l', 'l', 'o']`, `n = 5`

| Iteration | `left` | `right` | Swap | Array after swap |
|---|---|---|---|---|
| 1 | 0 | 4 | `'h' ↔ 'o'` | `['o','e','l','l','h']` |
| 2 | 1 | 3 | `'e' ↔ 'l'` | `['o','l','l','e','h']` |
| — | 2 | 2 | `left ≥ right` — stop | `['o','l','l','e','h']` ✓ |

The middle element at index 2 (`'l'`) is its own mirror — no swap needed.

---

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(n) | Each character is visited once; `left` and `right` together make n/2 swaps |
| **Space** | O(1) | Only two pointer variables — no auxiliary array |

---

## Edge Cases

| Scenario | Input | Output | Note |
|---|---|---|---|
| Empty array | `[]` | `[]` | `left = 0 > right = -1` — loop never runs |
| Single character | `['A']` | `['A']` | `left = right = 0` — loop never runs |
| Two characters | `['A','B']` | `['B','A']` | One swap, then `left = right = 1` — stops |
| Even length | `['A','B','C','D']` | `['D','C','B','A']` | All pairs swapped, no middle element |
| Odd length | `['A','B','C']` | `['C','B','A']` | Two pairs swapped, middle `'B'` unchanged |

---

## Key Takeaway

Flip Characters is the two-pointer reversal pattern applied to a character array. The mechanics are identical to reversing integers — the only difference is the element type. Every future problem in this section is a variation on this same core swap-and-converge idea.

***

# Palindrome Checker

## The Problem

Given a string, determine whether it is a **palindrome** — a word or phrase that reads the same forwards and backwards.

```
Input:  s = "racecar"   →   Output: True
Input:  s = "hello"     →   Output: False
```

---

## Examples

**Example 1**
```
Input:  "racecar"
Output: True
Explanation: r-a-c-e-c-a-r reversed is still r-a-c-e-c-a-r
```

**Example 2**
```
Input:  "hello"
Output: False
Explanation: 'h' ≠ 'o' — the first and last characters already disagree
```

**Example 3**
```
Input:  "abcba"
Output: True
```

**Example 4 — single character**
```
Input:  "a"
Output: True   (every single character is trivially a palindrome)
```

---

## Intuition

A string is a palindrome when its first character equals its last, its second equals its second-to-last, and so on all the way to the middle.

That's a mirror-pair relationship — exactly what two pointers are built for. Place `left` at the start and `right` at the end. At each step, compare `s[left]` and `s[right]`:

- If they **match** → the pair is fine, move both inward and continue
- If they **don't match** → it's not a palindrome, return `False` immediately
- If `left >= right` without any mismatch → every pair matched, return `True`

No extra memory needed. One pass.

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
  subgraph S0["Start  —  left=0, right=6"]
    direction LR
    P0L(["left"]) --> R0["r"] --- A0["a"] --- C0["c"] --- E0["e"] --- C1["c"] --- A1["a"] --- R1["r"]
    R1 --> P0R(["right"])
  end
  subgraph S1["'r'='r' ✓  left=1, right=5"]
    direction LR
    P1L(["left"]) --> A2["a"] --- C2["c"] --- E1["e"] --- C3["c"] --- A3["a"]
    A3 --> P1R(["right"])
  end
  subgraph S2["'a'='a' ✓  left=2, right=4"]
    direction LR
    P2L(["left"]) --> C4["c"] --- E2["e"] --- C5["c"]
    C5 --> P2R(["right"])
  end
  subgraph S3["'c'='c' ✓  left=3, right=3"]
    direction LR
    P3L(["left=right"]) --> E3["e"]
    E3 --> P3R(["right=left"])
  end
  subgraph S4["left ≥ right  →  all pairs matched"]
    DONE(["✓  return True"])
  end

  S0 -->|"match → move inward"| S1
  S1 -->|"match → move inward"| S2
  S2 -->|"match → move inward"| S3
  S3 -->|"left ≥ right"| S4
```

<p align="center"><strong>Checking <code>"racecar"</code> for palindrome — every mirror pair matches; when pointers meet at the centre, the check passes.</strong></p>

---

## Applying the Diagnostic Questions

| Check | Answer for Palindrome Checker |
|---|---|
| ✅ Two positions simultaneously? | Yes — `s[left]` and `s[right]` are compared together at every step |
| ✅ One near start, one near end? | Yes — `left = 0`, `right = n-1` |
| ✅ Both move inward? | Yes — `left++`, `right--` after every matching pair |
| ✅ Simple work at each step? | Yes — one comparison per iteration, return immediately on mismatch |

The structure is identical to Flip Characters — the only difference is the loop body: **compare** instead of **swap**.

**Why check from both ends simultaneously?** A palindrome's definition is symmetric: the character at position `i` from the left must equal the character at position `i` from the right, for every `i` from `0` to `n/2`. Two pointers map this requirement directly — `left` and `right` track the pair at distance `i` from each end. Moving both inward covers every required pair in exactly `n/2` steps.

**What breaks if you use only one pointer?** A single pointer could reverse the string and compare — but that costs O(n) extra space for the reversed copy and a second O(n) pass. Two pointers do it in one pass with O(1) space, and gain the early-exit advantage: as soon as any pair mismatches, `False` is returned without inspecting the rest. For a string like `"abcde...xyz" + "XYZ"`, the mismatch at position 0 stops the algorithm immediately.

---

## What Failure Looks Like

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
  subgraph FAIL["Checking 'hello'  —  left=0, right=4"]
    direction LR
    FL(["left"]) --> H["h"] --- E["e"] --- L1["l"] --- L2["l"] --- O["o"]
    O --> FR(["right"])
  end
  CMP{"'h' = 'o' ?"}
  NO(["✗  return False"])

  FAIL --> CMP
  CMP -->|"No"| NO
```

<p align="center"><strong>The check fails immediately on the first pair — <code>'h' ≠ 'o'</code> is enough to return <code>False</code> without looking at the rest.</strong></p>

This early-exit property makes two-pointer palindrome checking efficient in practice — you never process more pairs than necessary.

---

## Solution

```python,editable
class Solution:
    def is_palindrome(self, s: str) -> bool:
        left  = 0
        right = len(s) - 1

        while left < right:
            if s[left] != s[right]:
                return False   # mismatch found — not a palindrome

            left  += 1
            right -= 1

        return True   # all mirror pairs matched


# --- Test ---
sol = Solution()
print(sol.is_palindrome("racecar"))  # True
print(sol.is_palindrome("hello"))    # False
print(sol.is_palindrome("abcba"))    # True
print(sol.is_palindrome("a"))        # True
print(sol.is_palindrome("ab"))       # False
print(sol.is_palindrome("aa"))       # True
```

---

## Dry Run — "racecar"

`s = "racecar"`, `n = 7`

| Iteration | `left` | `right` | `s[left]` | `s[right]` | Match? |
|---|---|---|---|---|---|
| 1 | 0 | 6 | `'r'` | `'r'` | ✅ |
| 2 | 1 | 5 | `'a'` | `'a'` | ✅ |
| 3 | 2 | 4 | `'c'` | `'c'` | ✅ |
| — | 3 | 3 | — | — | `left ≥ right` → stop |

**Return `True`** ✓

---

## Dry Run — "hello"

| Iteration | `left` | `right` | `s[left]` | `s[right]` | Match? |
|---|---|---|---|---|---|
| 1 | 0 | 4 | `'h'` | `'o'` | ❌ → return `False` immediately |

**Return `False`** ✓

---

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(n) worst case | Every mirror pair checked once if all match; exits early on first mismatch |
| **Space** | O(1) | Only two pointer variables |

---

## Edge Cases

| Scenario | Input | Output | Note |
|---|---|---|---|
| Empty string | `""` | `True` | `left = 0 > right = -1` — loop never runs, vacuously true |
| Single character | `"a"` | `True` | `left = right` — loop never runs |
| Two identical chars | `"aa"` | `True` | One comparison, both match |
| Two different chars | `"ab"` | `False` | One comparison, immediate mismatch |
| All same characters | `"aaaa"` | `True` | Every pair matches |

---

## Key Takeaway

Palindrome checking is the comparison variant of the two-pointer pattern. Where "Flip Characters" *swapped* mirror pairs, here we *compare* them. The pointer movement is identical — the work in the loop body is the only difference. This is the pattern: same skeleton, swap the operation.

***

# Vowel Exchange

## The Problem

Given a string, reverse **only the vowels** (`a, e, i, o, u` — both uppercase and lowercase) while leaving all other characters exactly where they are.

```
Input:  "hello"    →   Output: "holle"
Input:  "leetcode" →   Output: "leotcede"
```

---

## Examples

**Example 1**
```
Input:  "hello"
Output: "holle"
Explanation: vowels are 'e' (index 1) and 'o' (index 4) — swap them.
```

**Example 2**
```
Input:  "leetcode"
Output: "leotcede"
Explanation: vowels at indices 1(e), 2(e), 5(o), 7(e)
             Reversed vowel order: e→e→o→e becomes e→o→e→e
```

**Example 3**
```
Input:  "bcdfg"
Output: "bcdfg"   (no vowels — nothing to swap)
```

**Example 4**
```
Input:  "aeiou"
Output: "uoiea"   (all vowels, fully reversed)
```

---

## Intuition

The classic two-pointer reversal swaps every pair. This problem adds a filter: **only swap when both pointers are sitting on vowels**. When a pointer is sitting on a consonant, just skip it — slide inward until you find the next vowel.

Think of the two pointers as scouts. The left scout hunts for the next vowel from the left; the right scout hunts for the next vowel from the right. When both scouts have found a vowel, they swap and then both advance. If either scout hits the middle first, we're done.

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
  subgraph S0["Start  —  'hello',  left=0, right=4"]
    direction LR
    P0L(["left"]) --> H0["h"] --- E0["e"] --- L0["l"] --- L1["l"] --- O0["o"]
    O0 --> P0R(["right"])
  end
  subgraph S1["'h' is not a vowel  →  left++ to find vowel"]
    direction LR
    P1L(["left"]) --> H1["h"] --- E1["e"] --- L2["l"] --- L3["l"] --- O1["o"]
    O1 --> P1R(["right"])
    note1(["left skips 'h'\nstops at 'e'"])
  end
  subgraph S2["'e' vowel found, 'o' vowel found  →  swap!  left=2, right=3"]
    direction LR
    P2L(["left"]) --> H2["h"] --- O2["o"] --- L4["l"] --- L5["l"] --- E2["e"]
    L4 --> P2R(["right"])
  end
  subgraph S3["'l' not a vowel, 'l' not a vowel  →  left ≥ right  →  done"]
    DONE(["✓  'holle'"])
  end

  S0 --> S1 --> S2 --> S3
```

<p align="center"><strong>Vowel exchange on <code>"hello"</code> — left skips the consonant <code>'h'</code>, finds vowel <code>'e'</code>; right is already on vowel <code>'o'</code>; they swap; pointers cross, done.</strong></p>

---

## Applying the Diagnostic Questions

| Check | Answer for Vowel Exchange |
|---|---|
| ✅ Two positions simultaneously? | Yes — `chars[left]` and `chars[right]` are both evaluated and swapped together |
| ✅ One near start, one near end? | Yes — `left = 0`, `right = n-1` |
| ✅ Both move inward? | Yes — both advance inward after each swap, plus inward scans to skip consonants |
| ✅ Simple work at each step? | Yes — scan to the next vowel on each side, then one swap |

This is a direct application with one variation: each pointer doesn't step by exactly 1 per iteration — it **scans** past non-qualifying characters before acting. The template is still the same; the advance is just variable-distance.

**Why scan independently from both ends?** Vowels and consonants are interleaved arbitrarily. The left pointer needs to find the next vowel from the left independently of where the right pointer is, and vice versa. If you advanced both pointers by 1 each step, you'd land on consonants and attempt invalid swaps. The inner `while` loops decouple scanning from swapping — each side walks at its own pace to its next qualifying position.

**What breaks if you use only one pointer?** A single forward pointer can collect vowel positions into a list, but then you need a second pass and a stack (or reverse of that list) to know which vowel to pair each one with. Two pointers eliminate that storage — the right pointer always tracks the vowel that the left's current vowel should swap with. The two-pointer structure implicitly encodes "pair the leftmost unswapped vowel with the rightmost unswapped vowel," which is exactly what reversal of vowels requires.

---

## Approach

1. Convert the string to a list of characters (strings are immutable in Python)
2. `left = 0`, `right = len - 1`, define `VOWELS = set("aeiouAEIOU")`
3. While `left < right`:
   - Advance `left` while `left < right` and `chars[left]` is not a vowel
   - Retreat `right` while `left < right` and `chars[right]` is not a vowel
   - If `left < right`: swap `chars[left]` and `chars[right]`, then `left++`, `right--`
4. Return `"".join(chars)`

---

## Solution

```python,editable
class Solution:
    def vowel_exchange(self, s: str) -> str:
        VOWELS = set("aeiouAEIOU")
        chars  = list(s)   # strings are immutable — work on a list
        left   = 0
        right  = len(chars) - 1

        while left < right:
            # Advance left until it sits on a vowel (or crosses right)
            while left < right and chars[left] not in VOWELS:
                left += 1

            # Retreat right until it sits on a vowel (or crosses left)
            while left < right and chars[right] not in VOWELS:
                right -= 1

            # Both pointers are on vowels — swap them
            if left < right:
                chars[left], chars[right] = chars[right], chars[left]
                left  += 1
                right -= 1

        return "".join(chars)


# --- Test ---
sol = Solution()
print(sol.vowel_exchange("hello"))     # "holle"
print(sol.vowel_exchange("leetcode"))  # "leotcede"
print(sol.vowel_exchange("bcdfg"))     # "bcdfg"
print(sol.vowel_exchange("aeiou"))     # "uoiea"
print(sol.vowel_exchange("a"))         # "a"
```

---

## Dry Run — "leetcode"

`s = "leetcode"`, vowels at indices 1(e), 2(e), 5(o), 7(e)

| Round | `left` scans to | `right` scans to | Swap | String |
|---|---|---|---|---|
| 1 | index 1 `'e'` | index 7 `'e'` | `'e'↔'e'` | `"leetcode"` (same chars) |
| 2 | index 2 `'e'` | index 5 `'o'` | `'e'↔'o'` | `"leotcede"` |
| 3 | left=3, right=4 — no vowels found before crossing | — | — | done |

**Return `"leotcede"`** ✓

---

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(n) | Each character is visited at most once by each pointer — total work is O(n) |
| **Space** | O(n) | The `chars` list copy of the input string |

> If the input were a mutable character array (as in C++/Java), space would drop to O(1). In Python we need the list copy because strings are immutable.

---

## Edge Cases

| Scenario | Input | Output | Note |
|---|---|---|---|
| No vowels | `"bcdfg"` | `"bcdfg"` | Pointers never stop to swap |
| All vowels | `"aeiou"` | `"uoiea"` | Every step swaps |
| Single character | `"a"` | `"a"` | Loop never runs |
| Already reversed vowels | `"uoiea"` | `"aeiou"` | Swap brings original back |
| Mixed case | `"hEllo"` | `"hollE"` | Uppercase vowels counted too |

---

## Key Takeaway

Vowel Exchange introduces a new wrinkle: **not every position deserves a swap**. The two inner `while` loops act as scanners — they fast-forward each pointer past irrelevant characters until a qualifying element is found. This "scan then act" pattern appears in many two-pointer problems where only a subset of elements are candidates for the operation.

***

# Reverse Words

## The Problem

Given a sentence as a list of characters (a character array), reverse every individual word's characters **in-place**, while keeping the words in their original order.

```
Input:  ['t','h','e',' ','s','k','y']
Output: ['e','h','t',' ','y','k','s']
         ↑       ↑       ↑       ↑
         "the" → "eht"   "sky" → "yks"
```

The words stay in place — only the characters inside each word are flipped.

---

## Examples

**Example 1**
```
Input:  "the sky"
Output: "eht yks"
```

**Example 2**
```
Input:  "hello world"
Output: "olleh dlrow"
```

**Example 3 — single word**
```
Input:  "hello"
Output: "olleh"
```

**Example 4 — single character words**
```
Input:  "a b c"
Output: "a b c"   (single characters are palindromes of themselves)
```

---

## Intuition

You already know how to reverse a contiguous block of characters with two pointers — that's exactly what "Flip Characters" did. This problem asks you to apply that same operation **multiple times**, once per word.

The key insight: **spaces act as word boundaries**. Walk through the array character by character. When you find the start of a word, scan forward to find its end (the next space or the array boundary). Now you have a `[word_start, word_end]` range — apply the two-pointer reversal to that range. Then continue scanning for the next word.

```d2
INPUT: "Input:  't h e   s k y'" {
  grid-columns: 7
  grid-gap: 0
  a: "t"
  b: "h"
  c: "e"
  d: " "
  e: "s"
  f: "k"
  g: "y"
}
W1: "Word 1: indices 0-2  →  reverse 't h e'" {
  grid-columns: 7
  grid-gap: 0
  a: "e"
  b: "h"
  c: "t"
  d: " "
  e: "s"
  f: "k"
  g: "y"
}
W2: "Word 2: indices 4-6  →  reverse 's k y'" {
  grid-columns: 7
  grid-gap: 0
  a: "e"
  b: "h"
  c: "t"
  d: " "
  e: "y"
  f: "k"
  g: "s"
}

INPUT -> W1: reverse word 1
W1 -> W2: reverse word 2
```

<p align="center"><strong>Reverse Words on <code>"the sky"</code> — find each word's boundaries using a scan, then apply two-pointer reversal within that range.</strong></p>

---

## Applying the Diagnostic Questions

| Check | Answer for Reverse Words |
|---|---|
| ✅ Two positions simultaneously? | Yes — inside each word's reversal, `chars[left]` and `chars[right]` are swapped together |
| ✅ One near start, one near end? | Yes — for each word, `left = word_start`, `right = word_end` |
| ✅ Both move inward? | Yes — `left++`, `right--` within each word's reversal loop |
| ✅ Simple work at each step? | Yes — one swap per pair within the word |

The outer scan that finds word boundaries is bookkeeping — once a `[word_start, word_end]` range is identified, the inner two-pointer reversal is a textbook direct application on that sub-range.

**Why find word boundaries with a linear scan instead of outer two pointers?** This problem operates on each word independently, not on a single pair of positions across the whole string. The outer scan moves linearly left-to-right, identifying the next word. For each word found, two inner pointers cover it from start to end. Trying to maintain two outer pointers across the full string wouldn't give word-by-word control — you'd lose the ability to identify where each word's characters start and end.

**What connects this to the direct-application pattern?** The `reverse(chars, l, r)` helper is a pure direct application. The outer scan is word-boundary discovery. Reverse Words decomposes as: discover word boundary → directly apply two-pointer reversal on that range → repeat. Composing multiple direct applications, each on a different sub-range, is still the direct-application pattern — the same four checks hold for every inner reversal call.

---

## Approach

1. Convert the string to a mutable character list (if needed)
2. Use an outer pointer `i` to scan from left to right
3. For each position `i`:
   - If `chars[i]` is not a space, it's the **start of a word** — record `word_start = i`
   - Advance `i` until you hit a space or the end of the array — `i - 1` is `word_end`
   - Apply two-pointer reversal on `chars[word_start : word_end]`
4. Return the joined result

---

## Solution

```python,editable
from typing import List

class Solution:
    def reverse_words(self, s: str) -> str:
        chars = list(s)
        n = len(chars)
        i = 0

        while i < n:
            # Skip spaces between words
            if chars[i] == ' ':
                i += 1
                continue

            # Mark the start of the word
            word_start = i

            # Find the end of the word
            while i < n and chars[i] != ' ':
                i += 1
            word_end = i - 1   # last character of this word

            # Two-pointer reverse within [word_start, word_end]
            left, right = word_start, word_end
            while left < right:
                chars[left], chars[right] = chars[right], chars[left]
                left  += 1
                right -= 1

        return "".join(chars)


# --- Test ---
sol = Solution()
print(sol.reverse_words("the sky"))      # "eht yks"
print(sol.reverse_words("hello world"))  # "olleh dlrow"
print(sol.reverse_words("hello"))        # "olleh"
print(sol.reverse_words("a b c"))        # "a b c"
print(sol.reverse_words(""))             # ""
```

---

## Dry Run — "hello world"

`chars = ['h','e','l','l','o',' ','w','o','r','l','d']`

**Word 1:** `word_start = 0`, `word_end = 4`

| Step | `left` | `right` | Swap | Chars |
|---|---|---|---|---|
| 1 | 0 | 4 | `'h'↔'o'` | `['o','e','l','l','h',' ','w','o','r','l','d']` |
| 2 | 1 | 3 | `'e'↔'l'` | `['o','l','l','e','h',' ','w','o','r','l','d']` |
| — | 2 | 2 | stop | — |

**Word 2:** `word_start = 6`, `word_end = 10`

| Step | `left` | `right` | Swap | Chars |
|---|---|---|---|---|
| 1 | 6 | 10 | `'w'↔'d'` | `['o','l','l','e','h',' ','d','o','r','l','w']` |
| 2 | 7 | 9 | `'o'↔'l'` | `['o','l','l','e','h',' ','d','l','r','o','w']` |
| — | 8 | 8 | stop | — |

**Return `"olleh dlrow"`** ✓

---

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(n) | Each character is visited at most twice — once by the outer scan, once by the inner reversal |
| **Space** | O(n) | The `chars` list (O(1) if the input were already mutable) |

---

## Edge Cases

| Scenario | Input | Output | Note |
|---|---|---|---|
| Empty string | `""` | `""` | Outer loop never runs |
| Single word | `"hello"` | `"olleh"` | One reversal |
| All spaces | `"   "` | `"   "` | Every char is a space — no reversals |
| Leading/trailing spaces | `" hi "` | `" ih "` | Spaces skipped; only `"hi"` reversed |
| Single-char words | `"a b"` | `"a b"` | Reversing one character is a no-op |

---

## Key Takeaway

Reverse Words composes two ideas: **scanning to find word boundaries** and **two-pointer reversal within a range**. The outer loop handles discovery; the inner two pointers handle the work. This composition — "find a range, then operate on it with two pointers" — is a pattern that recurs throughout the two-pointer family of problems.

***

# Reverse Segments

## The Problem

Given an array and a list of segment boundaries `[l, r]`, reverse the elements **within each segment** in-place. Elements outside the segments are untouched.

```
Input:  arr = [1, 2, 3, 4, 5, 6, 7, 8],  segments = [(0, 3), (4, 7)]
Output: arr = [4, 3, 2, 1, 8, 7, 6, 5]
              ↑         ↑  ↑         ↑
              segment 0 reversed     segment 1 reversed
```

---

## Examples

**Example 1 — two segments**
```
Input:  arr = [1, 2, 3, 4, 5, 6, 7, 8],  segments = [(0, 3), (4, 7)]
Output: [4, 3, 2, 1, 8, 7, 6, 5]
```

**Example 2 — single segment in the middle**
```
Input:  arr = [1, 2, 3, 4, 5],  segments = [(1, 3)]
Output: [1, 4, 3, 2, 5]
```

**Example 3 — entire array as one segment**
```
Input:  arr = [1, 2, 3, 4, 5],  segments = [(0, 4)]
Output: [5, 4, 3, 2, 1]
```

**Example 4 — single-element segment**
```
Input:  arr = [1, 2, 3],  segments = [(1, 1)]
Output: [1, 2, 3]   (reversing one element is a no-op)
```

---

## Intuition

You already have the exact tool for this: the two-pointer reversal from "Flip Characters". Reversing a segment `[l, r]` is identical to reversing the whole array — just start `left = l` and `right = r` instead of `0` and `n-1`.

For multiple segments, simply apply the two-pointer reversal once per segment. Each reversal is independent — the segments don't overlap, so the order you process them in doesn't matter.

```d2
ORIG: "Original:  [1, 2, 3, 4, 5, 6, 7, 8]" {
  grid-columns: 8
  grid-gap: 0
  a: "1"
  b: "2"
  c: "3"
  d: "4"
  e: "5"
  f: "6"
  g: "7"
  h: "8"
}
SEG0: "After reversing segment (0,3)" {
  grid-columns: 8
  grid-gap: 0
  a: "4"
  b: "3"
  c: "2"
  d: "1"
  e: "5"
  f: "6"
  g: "7"
  h: "8"
}
SEG0.a.style.fill: "#fde68a"
SEG0.b.style.fill: "#fde68a"
SEG0.c.style.fill: "#fde68a"
SEG0.d.style.fill: "#fde68a"
SEG1: "After reversing segment (4,7)" {
  grid-columns: 8
  grid-gap: 0
  a: "4"
  b: "3"
  c: "2"
  d: "1"
  e: "8"
  f: "7"
  g: "6"
  h: "5"
}
SEG1.e.style.fill: "#dcfce7"
SEG1.f.style.fill: "#dcfce7"
SEG1.g.style.fill: "#dcfce7"
SEG1.h.style.fill: "#dcfce7"

ORIG -> SEG0: "reverse [0,3]"
SEG0 -> SEG1: "reverse [4,7]"
```

<p align="center"><strong>Reversing two segments of <code>[1,2,3,4,5,6,7,8]</code> — each segment is reversed independently using the standard two-pointer swap-and-converge.</strong></p>

---

## Applying the Diagnostic Questions

| Check | Answer for Reverse Segments |
|---|---|
| ✅ Two positions simultaneously? | Yes — `arr[left]` and `arr[right]` are swapped together at each step within each segment |
| ✅ One near start, one near end? | Yes — for each segment `(l, r)`, `left = l`, `right = r` |
| ✅ Both move inward? | Yes — `left++`, `right--` within each segment's reversal |
| ✅ Simple work at each step? | Yes — one swap per iteration |

Reverse Segments is structurally identical to Flip Characters — the only difference is that `left` and `right` start from a given `(l, r)` pair instead of `(0, n-1)`. The two-pointer pattern is unchanged; the input just parameterises the range.

**Why is this still "direct application" and not something more complex?** No transformation of the data is needed — the segment boundaries are given directly, and the reversal within each boundary is the same swap-and-converge loop. There's no searching for the right range, no sorting, no condition-based pointer movement. Two pointers enter a segment, march toward each other, and exit. The only outer logic is iterating through the list of segments.

**What makes each segment's reversal independent?** Non-overlapping segments modify distinct array regions — each `reverse_segment(arr, l, r)` call touches only indices `l` through `r`. Because no two calls share an index, processing order is irrelevant: process segment 0 first or last, the result is the same. This independence is what allows the outer loop to be a simple `for l, r in segments` — no coordination between iterations needed.

---

## Approach

1. For each `(l, r)` segment in the `segments` list:
   - Set `left = l`, `right = r`
   - While `left < right`: swap `arr[left]` and `arr[right]`, `left++`, `right--`
2. Done — all segments reversed in-place

---

## Solution

```python,editable
from typing import List, Tuple

class Solution:
    def reverse_segment(self, arr: List[int], l: int, r: int) -> None:
        """Reverse arr[l..r] in-place using two pointers."""
        left, right = l, r
        while left < right:
            arr[left], arr[right] = arr[right], arr[left]
            left  += 1
            right -= 1

    def reverse_segments(
        self,
        arr: List[int],
        segments: List[Tuple[int, int]]
    ) -> None:
        """Reverse each segment in-place."""
        for l, r in segments:
            self.reverse_segment(arr, l, r)


# --- Test ---
sol = Solution()

a1 = [1, 2, 3, 4, 5, 6, 7, 8]
sol.reverse_segments(a1, [(0, 3), (4, 7)])
print(a1)   # [4, 3, 2, 1, 8, 7, 6, 5]

a2 = [1, 2, 3, 4, 5]
sol.reverse_segments(a2, [(1, 3)])
print(a2)   # [1, 4, 3, 2, 5]

a3 = [1, 2, 3, 4, 5]
sol.reverse_segments(a3, [(0, 4)])
print(a3)   # [5, 4, 3, 2, 1]

a4 = [1, 2, 3]
sol.reverse_segments(a4, [(1, 1)])
print(a4)   # [1, 2, 3]
```

---

## Dry Run — Example 1

`arr = [1, 2, 3, 4, 5, 6, 7, 8]`

**Segment (0, 3):** `left=0`, `right=3`

| Step | `left` | `right` | Swap | Array |
|---|---|---|---|---|
| 1 | 0 | 3 | `1 ↔ 4` | `[4, 2, 3, 1, 5, 6, 7, 8]` |
| 2 | 1 | 2 | `2 ↔ 3` | `[4, 3, 2, 1, 5, 6, 7, 8]` |
| — | 2 | 1 | stop | — |

**Segment (4, 7):** `left=4`, `right=7`

| Step | `left` | `right` | Swap | Array |
|---|---|---|---|---|
| 1 | 4 | 7 | `5 ↔ 8` | `[4, 3, 2, 1, 8, 6, 7, 5]` |
| 2 | 5 | 6 | `6 ↔ 7` | `[4, 3, 2, 1, 8, 7, 6, 5]` |
| — | 6 | 5 | stop | — |

**Result: `[4, 3, 2, 1, 8, 7, 6, 5]`** ✓

---

## Complexity Analysis

Let `n` = array length, `k` = number of segments, `s` = total elements covered by all segments.

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(s) | Each reversed element is visited once; O(n) in the worst case (all segments cover the full array) |
| **Space** | O(1) | Only pointer variables — in-place reversal |

---

## Edge Cases

| Scenario | Segment | Effect |
|---|---|---|
| Single element | `(i, i)` | `left = right` — loop never runs, no-op |
| Entire array | `(0, n-1)` | Full reversal |
| Overlapping segments | `(0,4), (2,6)` | **Undefined** — this function assumes non-overlapping. Overlapping produces incorrect results. |
| Out-of-bounds | `(-1, 5)` | Caller's responsibility to validate indices |

---

## Key Takeaway

Reverse Segments shows that the two-pointer reversal is a **reusable utility** — not just a technique for one specific problem. By extracting it into `reverse_segment(arr, l, r)`, you get a building block that can be called on any sub-range of any array. The next problem, Reverse Word Order, uses exactly this building block twice in sequence.

***

# Reverse Word Order

## The Problem

Given a string of words separated by single spaces, reverse the **order of the words** in-place, keeping each word's characters intact.

```
Input:  "the sky is blue"
Output: "blue is sky the"
```

The words flip order; no word's characters change.

---

## Examples

**Example 1**
```
Input:  "the sky is blue"
Output: "blue is sky the"
```

**Example 2**
```
Input:  "hello world"
Output: "world hello"
```

**Example 3 — single word**
```
Input:  "hello"
Output: "hello"
```

**Example 4**
```
Input:  "a good example"
Output: "example good a"
```

---

## Intuition

This is the hardest problem in the section, and it has a beautiful two-step trick.

If you reverse the entire string first, the words appear in reverse order — but each word's own characters are also reversed. So in step two, you reverse each word's characters back to normal. The two operations cancel each other out for the characters inside words, but compound their effect on word order.

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
  ORIG["Original string\n'the sky is blue'"]
  STEP1["Step 1: Reverse the entire string\n'eulb si yks eht'"]
  STEP2["Step 2: Reverse each individual word\n'blue is sky the'"]
  DONE(["✓  Word order reversed, characters intact"])

  ORIG -->|"two-pointer reverse full string"| STEP1
  STEP1 -->|"two-pointer reverse each word"| STEP2
  STEP2 --> DONE
```

<p align="center"><strong>The two-step trick — reversing the whole string flips word order but scrambles each word; reversing each word individually unscrambles the characters while keeping the new word order.</strong></p>

---

## Why This Works — The Intuition

Let's trace exactly what each step does to `"the sky"`:

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
  subgraph A["Original"]
    direction LR
    t["t"] --- h["h"] --- e["e"] --- sp[" "] --- s["s"] --- k["k"] --- y["y"]
  end
  subgraph B["After Step 1: reverse entire string"]
    direction LR
    y2["y"] --- k2["k"] --- s2["s"] --- sp2[" "] --- e2["e"] --- h2["h"] --- t2["t"]
  end
  subgraph C["After Step 2: reverse each word"]
    direction LR
    s3["s"] --- k3["k"] --- y3["y"] --- sp3[" "] --- t3["t"] --- h3["h"] --- e3["e"]
  end

  A -->|"reverse whole"| B
  B -->|"reverse words"| C
```

<p align="center"><strong>Step-by-step on <code>"the sky"</code> — after the full reverse, each word's letters are backwards; reversing each word fixes them while keeping the flipped word order.</strong></p>

Each word is reversed **twice** in total — once by the full-string reversal, once by the per-word reversal. Two reversals cancel out, returning each word's characters to their original order. But the words themselves have moved to their new positions.

---

## Applying the Diagnostic Questions

| Check | Answer for Reverse Word Order |
|---|---|
| ✅ Two positions simultaneously? | Yes — in both Step 1 and Step 2, `chars[left]` and `chars[right]` are swapped together |
| ✅ One near start, one near end? | Yes — Step 1: `left=0`, `right=n-1`; Step 2: per word, `left=word_start`, `right=word_end` |
| ✅ Both move inward? | Yes — `left++`, `right--` in both reversal passes |
| ✅ Simple work at each step? | Yes — one swap per iteration in each pass |

This is a **composed** direct application: two separate two-pointer passes applied in sequence. Step 1 (full reverse) is Flip Characters on the whole string. Step 2 (per-word reverse) is Reverse Words from the previous lesson. Each pass passes all four checks independently.

**Why does composing two reversals give word-order reversal?** Because reversing is its own inverse: reverse a sequence twice and you get back the original. For each word, the full-string reversal scrambles its characters, and the per-word reversal unscrambles them — net effect on the word's characters: zero. But the word's **position** in the string only experiences the full-string reversal (the per-word reversal doesn't change inter-word positions, only intra-word order). So the characters come out intact, but the word slots have been rearranged. See the "Why This Works" section above for the full concrete trace.

**What breaks if you only do Step 1?** After `reverse(0, n-1)`, words are in reverse order — correct — but every word's characters are also reversed — wrong. `"the sky"` → `"yks eht"` instead of `"sky the"`. Step 2 is what restores each word's internal character order without disturbing the newly achieved word-order reversal.

---

## Approach

1. Convert string to a mutable character list
2. **Step 1:** Reverse the entire character array with two pointers (`left=0`, `right=n-1`)
3. **Step 2:** Scan through the array; for each word found at range `[l, r]`, reverse `chars[l..r]` with two pointers
4. Return `"".join(chars)`

This reuses `reverse_segment(arr, l, r)` from the previous lesson twice.

---

## Solution

```python,editable
from typing import List

class Solution:

    def _reverse(self, chars: List[str], l: int, r: int) -> None:
        """Two-pointer reversal of chars[l..r] in-place."""
        while l < r:
            chars[l], chars[r] = chars[r], chars[l]
            l += 1
            r -= 1

    def reverse_word_order(self, s: str) -> str:
        chars = list(s)
        n     = len(chars)

        # Step 1: Reverse the entire string
        self._reverse(chars, 0, n - 1)

        # Step 2: Reverse each word individually
        i = 0
        while i < n:
            if chars[i] == ' ':
                i += 1
                continue

            word_start = i
            while i < n and chars[i] != ' ':
                i += 1
            word_end = i - 1

            self._reverse(chars, word_start, word_end)

        return "".join(chars)


# --- Test ---
sol = Solution()
print(sol.reverse_word_order("the sky is blue"))   # "blue is sky the"
print(sol.reverse_word_order("hello world"))        # "world hello"
print(sol.reverse_word_order("hello"))              # "hello"
print(sol.reverse_word_order("a good example"))     # "example good a"
```

---

## Dry Run — "the sky is blue"

**Step 1: Reverse entire string**

```
"the sky is blue"
       ↓
"eulb si yks eht"
```

(Characters are in exact reverse order — words are backwards, characters within each word are backwards)

**Step 2: Reverse each word**

| Word found | Range | Before | After |
|---|---|---|---|
| `"eulb"` | [0, 3] | `eulb` | `blue` |
| `"si"` | [5, 6] | `si` | `is` |
| `"yks"` | [8, 10] | `yks` | `sky` |
| `"eht"` | [12, 14] | `eht` | `the` |

**Final result: `"blue is sky the"`** ✓

---

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(n) | Step 1 visits every character once (O(n)); Step 2 visits every character once more (O(n)); total = O(2n) = O(n) |
| **Space** | O(n) | The `chars` list (O(1) if working with a mutable char array) |

---

## Edge Cases

| Scenario | Input | Output | Note |
|---|---|---|---|
| Single word | `"hello"` | `"hello"` | Full reverse gives `"olleh"`; reversing single word gives `"hello"` back |
| Two words | `"hi there"` | `"there hi"` | One full reverse + two word reverses |
| Leading space | `" hello"` | `"hello "` | Space moves to end (correct word order reversal) |
| Trailing space | `"hello "` | `" hello"` | Space moves to start |

---

## The Full Picture: All Six Problems

You've now seen every direct-application two-pointer problem in this section. They all share the same skeleton — what changes is the work done inside the loop:

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
  TP["Two-Pointer Direct Application"]
  FC["Flip Characters\nSwap chars from both ends"]
  PC["Palindrome Checker\nCompare chars from both ends"]
  VE["Vowel Exchange\nScan to vowel, then swap"]
  RW["Reverse Words\nApply reversal per word"]
  RS["Reverse Segments\nApply reversal per segment range"]
  RWO["Reverse Word Order\nFull reverse + per-word reverse"]

  TP --> FC
  TP --> PC
  TP --> VE
  TP --> RW
  TP --> RS
  TP --> RWO
```

<p align="center"><strong>All six direct-application problems — one template, six variations in the loop body.</strong></p>

---

## Key Takeaway

Reverse Word Order is the culminating problem of this section — it composes two two-pointer operations in sequence, and it's the first problem where the trick isn't immediately obvious. The insight (reverse-all, then reverse-each) is a pattern worth memorising: it appears in several string manipulation problems and is a favourite in technical interviews. Once you see it, you never forget it.
