# 6. Pattern: Simultaneous traversal

This section explains how to move through two ordered collections together to compare, merge, or intersect them efficiently.

## Table of contents

1. [Understanding the simultaneous traversal pattern](#understanding-the-simultaneous-traversal-pattern)
2. [Identifying the simultaneous traversal pattern](#identifying-the-simultaneous-traversal-pattern)
3. [Subsequence checker](#subsequence-checker)
4. [Merge sorted arrays](#merge-sorted-arrays)
5. [Unique intersections](#unique-intersections)
6. [Repeated intersections](#repeated-intersections)

***

# Understanding the Simultaneous Traversal Pattern

## When One Array Isn't Enough

Every pattern we've covered so far works on a single array. But some problems give you **two arrays** and ask you to do something that requires looking at both at the same time.

Merging two sorted lists. Checking if one sequence appears inside another. Finding common elements between two arrays. These problems can't be solved by finishing one array and then starting the other — the answer depends on how items in both arrays relate to each other at each step.

The simultaneous traversal pattern handles exactly this: traverse two arrays in a single pass using two index variables, where a condition at each step decides which index moves forward.

---

## The Mental Model

Think of two conveyor belts running side by side. Each belt carries items in order. You have one hand on each belt. At every moment:
- You compare the items both hands are holding.
- Based on the comparison, you pick from the left belt, the right belt, or both.
- You advance whichever belt(s) you took from.

Neither belt ever rewinds. You just decide, at each step, which hand moves forward.

```d2
arr1: "arr1  (size N)" {
  grid-columns: 5
  grid-gap: 0
  a0: "a₀" {style.fill: "#fde68a"; style.stroke: "#d97706"}
  a1: "a₁"
  a2: "a₂"
  a3: "a₃"
  a4: "..."
}

arr2: "arr2  (size M)" {
  grid-columns: 4
  grid-gap: 0
  b0: "b₀" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  b1: "b₁"
  b2: "b₂"
  b3: "..."
}

i1: "index1" {shape: oval; style.fill: "#fde68a"; style.stroke: "#d97706"}
i2: "index2" {shape: oval; style.fill: "#dcfce7"; style.stroke: "#16a34a"}

i1 -> arr1.a0
i2 -> arr2.b0
```

<p align="center"><strong>Two index variables — one per array — start at position 0 and move independently based on a condition evaluated at each step.</strong></p>

---

## Two Index Variables, One Loop

The implementation has a fixed shape regardless of the problem:

- `index1` tracks the current position in `arr1`
- `index2` tracks the current position in `arr2`
- The main loop runs while **both** arrays have unprocessed elements
- After the main loop, two cleanup loops handle whatever remains in either array

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
  Start(["index1=0, index2=0"])
  Check{"index1 < len(arr1)<br/>AND<br/>index2 < len(arr2)"}
  Cond{"condition"}
  Adv1["advance index1"]
  Adv2["advance index2"]
  AdvBoth["advance both"]
  Tail1{"index1 < len(arr1)?"}
  Tail2{"index2 < len(arr2)?"}
  Finish1["process remaining arr1"]
  Finish2["process remaining arr2"]
  Done(["done"])

  Start --> Check
  Check -->|"yes"| Cond
  Check -->|"no"| Tail1
  Cond -->|"only arr1"| Adv1 --> Check
  Cond -->|"only arr2"| Adv2 --> Check
  Cond -->|"both"| AdvBoth --> Check
  Tail1 -->|"yes"| Finish1 --> Tail2
  Tail1 -->|"no"| Tail2
  Tail2 -->|"yes"| Finish2 --> Done
  Tail2 -->|"no"| Done
```

<p align="center"><strong>Simultaneous traversal flow — the main loop runs while both arrays have items; two cleanup loops drain whichever array still has leftover elements.</strong></p>

The cleanup loops are what separate simultaneous traversal from the two-pointer pattern. Two pointers stop when the pointers converge on a single array. Simultaneous traversal continues until **both** arrays are fully processed.

---

## The Template

```python,editable
from typing import List

def simultaneous_traversal(arr1: List[int], arr2: List[int]) -> None:
    index1 = 0  # Current position in arr1
    index2 = 0  # Current position in arr2

    # Main loop: run while both arrays have unprocessed elements.
    # At each step, the condition decides which index advances.
    while index1 < len(arr1) and index2 < len(arr2):

        if should_advance_arr1(arr1[index1], arr2[index2]):
            # process arr1[index1]
            index1 += 1  # Move arr1 forward

        if should_advance_arr2(arr1[index1], arr2[index2]):
            # process arr2[index2]
            index2 += 1  # Move arr2 forward

    # arr2 exhausted first — process any remaining elements in arr1
    while index1 < len(arr1):
        # process arr1[index1]
        index1 += 1

    # arr1 exhausted first — process any remaining elements in arr2
    while index2 < len(arr2):
        # process arr2[index2]
        index2 += 1
```

---

## How Pointer Movement Works

At each step, exactly one of three outcomes happens, driven by the condition:

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
  C{"Compare<br/>arr1[index1]<br/>vs<br/>arr2[index2]"}
  C -->|"arr1[i1] < arr2[i2]"| R1["index1++<br/>(process arr1[i1])"]
  C -->|"arr1[i1] > arr2[i2]"| R2["index2++<br/>(process arr2[i2])"]
  C -->|"arr1[i1] == arr2[i2]"| R3["index1++ AND index2++<br/>(process both)"]
```

<p align="center"><strong>The condition evaluated each step determines which pointer advances — one, the other, or both. No pointer ever moves backwards.</strong></p>

The condition is problem-specific. Some examples:

| Problem | Condition to advance `index1` | Condition to advance `index2` |
|---|---|---|
| Merge sorted arrays | `arr1[i1] <= arr2[i2]` | `arr2[i2] < arr1[i1]` (or equal → advance both) |
| Subsequence check | `arr1[i1] == arr2[i2]` (match found) | always |
| Intersection | `arr1[i1] == arr2[i2]` (match found) | `arr1[i1] == arr2[i2]` (advance both on match) |

---

## Why Cleanup Loops Are Needed

When the main loop exits, exactly one of these is true:
- `index1 == len(arr1)` — `arr1` is exhausted, but `arr2` may still have items
- `index2 == len(arr2)` — `arr2` is exhausted, but `arr1` may still have items

Those remaining items are often meaningful. In a merge, they need to be appended to the result. In a subsequence check, if `s` still has characters left when `t` runs out, the answer is false.

The cleanup loops guarantee that no element in either array is silently skipped.

---

## Complexity

Every element in both arrays is processed exactly once — each index moves forward and never backwards. If `arr1` has N elements and `arr2` has M:

| | Time | Space |
|---|---|---|
| Best and worst case | O(N + M) | O(1) |

**Why brute force is O(N × M):** A naive nested loop resets `index2` to 0 for each element in `arr1`. That means every element of `arr1` triggers a full scan of `arr2`. Simultaneous traversal eliminates the reset — `index2` only ever moves forward.

***

# Identifying the Simultaneous Traversal Pattern

## The Diagnostic Questions

Before deciding this pattern applies, run through these three questions:

| Question | What it tests |
|---|---|
| **Q1.** Does the problem involve two sequences that must be compared or processed together? | Checks if two simultaneous cursors are structurally required |
| **Q2.** Does advancing in one sequence depend on a comparison between the two sequences? | Confirms that pointer movement is conditional, not independent |
| **Q3.** Is each pointer's advance condition simple and deterministic at every step? | Confirms the O(N + M) linear solution is achievable without backtracking |

If yes to all three, you have a simultaneous traversal problem.

---

## The Example: Subsequence Checker

**Problem:** Given two strings `s` and `t`, return `True` if `s` is a subsequence of `t`.

A string `s` is a subsequence of `t` if every character of `s` appears in `t` in the **same relative order** — but not necessarily consecutively.

```
s = "ace",   t = "abcde"  →  True   (a..c..e all appear in order)
s = "aec",   t = "abcde"  →  False  (e appears before c in t, not after)
```

```d2
tt: "t = a b c d e" {
  grid-columns: 5
  grid-gap: 0
  t0: "a" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  t1: "b"
  t2: "c" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  t3: "d"
  t4: "e" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
}

ss: "s = a · c · e" {
  grid-columns: 3
  grid-gap: 0
  s0: "a" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  s1: "c" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  s2: "e" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
}

ss.s0 -> tt.t0: "matched at t[0]"
ss.s1 -> tt.t2: "matched at t[2]"
ss.s2 -> tt.t4: "matched at t[4]"
```

<p align="center"><strong>s = "ace" is a subsequence of t = "abcde" — each character of s maps to a later position in t, maintaining order.</strong></p>

---

## Applying the Diagnostic Questions

| Question | Answer |
|---|---|
| **Q1.** Two sequences processed together? | **Yes** — every character of `s` must be located inside `t` in order |
| **Q2.** Advancing one depends on comparing both? | **Yes** — `index1` (for `s`) only advances when `s[index1] == t[index2]`; `index2` (for `t`) always advances |
| **Q3.** Condition is simple and deterministic? | **Yes** — a single equality check at each step, no sorting or preprocessing needed |

---

### Q1 — Why "two sequences processed together"?

**WHAT:** The problem asks whether every character of `s` appears in `t` in the same order. You must match characters across both strings simultaneously — you can't answer this by scanning just `s` or just `t` alone.

**WHY two cursors are required:** `index1` tracks "which character of `s` are we currently trying to find?", and `index2` tracks "where in `t` are we currently looking?". Losing track of either position breaks the ordering guarantee.

**What breaks with a single pointer:** If you had one pointer scanning `t` for each character of `s` independently, you'd find 'a', 'c', 'e' correctly — but you'd also incorrectly accept `s = "aec"` because 'a', 'e', 'c' can each be found in `t` individually. The single pointer would restart from the beginning of `t` each time, losing the positional constraint.

---

### Q2 — Why "advancing index1 depends on a comparison"?

**WHAT:** At every step, `index2` always advances (we always move through `t`). But `index1` only advances when `s[index1] == t[index2]` — when we've found the current target character.

**WHY this conditional movement is the pattern:** The key insight is that `t` might have many characters that aren't in `s`. We skip over them by advancing `index2` without touching `index1`. Only a match triggers progress in `s`.

**Concrete check with s="ace", t="abcde":**
- `index1=0 ('a'), index2=0 ('a')`: match → advance both
- `index1=1 ('c'), index2=1 ('b')`: no match → advance only `index2`
- `index1=1 ('c'), index2=2 ('c')`: match → advance both
- `index1=2 ('e'), index2=3 ('d')`: no match → advance only `index2`
- `index1=2 ('e'), index2=4 ('e')`: match → advance both
- `index1=3 == len(s)=3` → all of `s` was matched → return `True`

**What breaks without conditional movement:** If you advanced `index1` regardless of whether there was a match, you'd move through `s` at the same speed as `t`, comparing `s[0]` with `t[0]`, `s[1]` with `t[1]`, etc. That checks if `s` is a prefix of `t`, not a subsequence.

---

### Q3 — Why "simple and deterministic at every step"?

**WHAT:** The condition is just `s[index1] == t[index2]` — a single character comparison. No sorting needed, no auxiliary data structure, no lookahead.

**WHY this guarantees O(N + M):** Because the condition takes O(1) time and each pointer only moves forward, the total number of steps is at most `len(s) + len(t)`. The algorithm never needs to revisit a position in either string.

**What would break this guarantee:** If the condition required scanning ahead — "does `s[index1]` appear *anywhere* in the remaining `t`?" — you'd need an inner loop, pushing complexity to O(N × M). The simultaneous traversal only works efficiently when the advance decision is local (based on current positions only).

---

## Brute Force: Nested Scan, O(N × M)

For each character in `s`, scan `t` from where we left off to find its first occurrence:

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
  Start(["j = 0"])
  ForI["for i in range(len(s))"]
  CheckJ{"j == len(t)?"}
  RetFalse(["return False"])
  WhileJ{"j < len(t)"}
  Match{"s[i] == t[j]?"}
  AdvBoth["j += 1<br/>break"]
  AdvJ["j += 1"]
  RetTrue(["return True"])

  Start --> ForI --> CheckJ
  CheckJ -->|"yes"| RetFalse
  CheckJ -->|"no"| WhileJ
  WhileJ -->|"yes"| Match
  WhileJ -->|"no"| ForI
  Match -->|"yes"| AdvBoth --> ForI
  Match -->|"no"| AdvJ --> WhileJ
  ForI -->|"i exhausted"| RetTrue
```

<p align="center"><strong>Brute force — for each character of s, scan forward in t until found or t is exhausted. Correct, but the nested structure is error-prone.</strong></p>

```python,editable
from typing import List

def is_subsequence_brute(s: str, t: str) -> bool:
    j = 0  # Tracks current position in t across iterations of the outer loop

    # For each character in s, search for it in t starting from where we left off
    for i in range(len(s)):
        if j == len(t):
            # t is exhausted but s still has characters left — can't be a subsequence
            return False

        # Scan t forward until we find s[i] or exhaust t
        while j < len(t):
            if s[i] == t[j]:
                j += 1  # Found s[i] at t[j] — advance t past this match
                break   # Move to the next character in s
            j += 1      # t[j] doesn't match — skip it

    return True  # All characters of s were found in t in order

print(is_subsequence_brute("ace", "abcde"))  # True
print(is_subsequence_brute("aec", "abcde"))  # False
```

<details>
<summary><strong>Trace — s = "ace", t = "abcde"  (brute force)</strong></summary>

```
j = 0

i=0, s[0]='a':
  j=0, t[0]='a': 'a'=='a' → j=1, break
i=1, s[1]='c':
  j=1, t[1]='b': 'c'≠'b' → j=2
  j=2, t[2]='c': 'c'=='c' → j=3, break
i=2, s[2]='e':
  j=3, t[3]='d': 'e'≠'d' → j=4
  j=4, t[4]='e': 'e'=='e' → j=5, break

i exhausted → return True ✓

Note: j never resets to 0 — this version actually behaves like simultaneous traversal
      under the hood. The nested while loop is what makes it hard to read and reason about.
```

</details>

---

## Simultaneous Traversal Solution: One Loop, O(N + M)

The same logic, expressed cleanly with two explicit index variables:

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
  subgraph Step0["Start: index1=0 ('a'), index2=0 ('a')"]
    direction LR
    SA0["a"] --- SA1["c"] --- SA2["e"]
    TA0["a"] --- TA1["b"] --- TA2["c"] --- TA3["d"] --- TA4["e"]
    P1A(["i1=0"]) --> SA0
    P2A(["i2=0"]) --> TA0
  end
  subgraph Step1["Match 'a': advance both → index1=1, index2=1"]
    direction LR
    SB0["✓a"] --- SB1["c"] --- SB2["e"]
    TB0["✓a"] --- TB1["b"] --- TB2["c"] --- TB3["d"] --- TB4["e"]
    P1B(["i1=1"]) --> SB1
    P2B(["i2=1"]) --> TB1
  end
  subgraph Step2["No match 'c'≠'b': advance index2 only → index2=2"]
    direction LR
    SC0["✓a"] --- SC1["c"] --- SC2["e"]
    TC0["✓a"] --- TC1["b"] --- TC2["c"] --- TC3["d"] --- TC4["e"]
    P1C(["i1=1"]) --> SC1
    P2C(["i2=2"]) --> TC2
  end
  Step0 -->|"'a'=='a' match"| Step1
  Step1 -->|"'c'≠'b' no match"| Step2
```

<p align="center"><strong>Simultaneous traversal — <code>index2</code> always advances; <code>index1</code> only advances on a match. The two-pointer structure makes the logic explicit and easy to follow.</strong></p>

```python,editable
from typing import List

class Solution:
    def subsequence_checker(self, s: str, t: str) -> bool:
        index1 = 0  # Points at the current character in s we're trying to find in t
        index2 = 0  # Points at the current character in t we're examining

        # Run while both strings have unexamined characters
        while index1 < len(s) and index2 < len(t):
            if s[index1] == t[index2]:
                # Found the current target character from s — move s's pointer forward
                index1 += 1
            # Always advance t's pointer — we examine every character of t exactly once
            index2 += 1

        # If index1 reached the end of s, all characters were matched in order
        # If index1 < len(s), t ran out before all of s was matched
        return index1 == len(s)


print(Solution().subsequence_checker("ace", "abcde"))  # True
print(Solution().subsequence_checker("aec", "abcde"))  # False
print(Solution().subsequence_checker("", "abcde"))     # True  (empty string is always a subsequence)
print(Solution().subsequence_checker("abc", ""))       # False (non-empty s can't match empty t)
```

<details>
<summary><strong>Trace — s = "ace", t = "abcde"  (simultaneous traversal)</strong></summary>

```
index1 = 0,  index2 = 0

Step 1 │ index1=0 ('a'), index2=0 ('a') │ 'a'=='a' match  │ index1=1, index2=1
Step 2 │ index1=1 ('c'), index2=1 ('b') │ 'c'≠'b' no match│ index1=1, index2=2
Step 3 │ index1=1 ('c'), index2=2 ('c') │ 'c'=='c' match  │ index1=2, index2=3
Step 4 │ index1=2 ('e'), index2=3 ('d') │ 'e'≠'d' no match│ index1=2, index2=4
Step 5 │ index1=2 ('e'), index2=4 ('e') │ 'e'=='e' match  │ index1=3, index2=5
Step 6 │ index1=3 == len(s)=3 → loop exits

Return: index1 == len(s) → 3 == 3 → True ✓

Failure case — s = "aec", t = "abcde":
Step 1 │ index1=0 ('a'), index2=0 ('a') │ match   │ index1=1, index2=1
Step 2 │ index1=1 ('e'), index2=1 ('b') │ no match│ index1=1, index2=2
Step 3 │ index1=1 ('e'), index2=2 ('c') │ no match│ index1=1, index2=3
Step 4 │ index1=1 ('e'), index2=3 ('d') │ no match│ index1=1, index2=4
Step 5 │ index1=1 ('e'), index2=4 ('e') │ match   │ index1=2, index2=5
Step 6 │ index2=5 == len(t)=5 → loop exits

Return: index1 == len(s) → 2 == 3 → False ✓
Note: 'e' was found before 'c', so s[2]='c' was never matched — index1 stopped at 2.
```

</details>

---

## Problems in This Category

| Problem | Both sequences needed? | Advance condition |
|---|---|---|
| **Subsequence Checker** | Yes — match chars of s inside t | match → both; no match → t only |
| **Merge Sorted Arrays** | Yes — merge arr1 and arr2 into sorted result | pick smaller → advance that one; equal → advance both |
| **Unique Intersections** | Yes — find elements in both arrays | match → record and advance both; mismatch → advance the smaller |
| **Repeated Intersections** | Yes — find all common elements including duplicates | same as intersections but don't skip duplicates |

The difficulty varies by how complex the advance condition is — but the template stays the same.

***

# Subsequence Checker

## Problem

Given two strings `s` and `t`, return `True` if `s` is a **subsequence** of `t`.

A subsequence means every character of `s` appears in `t` in the **same relative order** — but not necessarily at consecutive positions. Characters in `t` that don't belong to `s` can be freely skipped.

```
s = "ace",  t = "abcde"  →  True   (a at t[0], c at t[2], e at t[4] — order preserved)
s = "aec",  t = "abcde"  →  False  (e appears at t[4], but c appears at t[2] — order violated)
s = "",     t = "abc"    →  True   (empty string is always a subsequence of anything)
s = "abc",  t = ""       →  False  (non-empty s cannot match inside an empty t)
```

---

## Intuition

Imagine `t` as a long river and `s` as a treasure map with a sequence of landmarks you need to visit in order. You paddle down the river from left to right — you can't go back upstream. Each time you reach a landmark that matches the next one on your map, you check it off. If you check off every landmark before reaching the end of the river, the journey was valid.

That's exactly the structure here. You have two positions to track:
- **Where you are in `t`** — always moving forward, skipping anything that doesn't match
- **How far you've matched in `s`** — only advances when the current character of `t` matches the current target in `s`

This is a simultaneous traversal problem because you can't answer the question by scanning `s` alone or `t` alone. You need to walk both at the same time: `t`'s pointer tells you "what character of `t` am I looking at right now?" and `s`'s pointer tells you "which character of `s` am I currently trying to match?"

If `s`'s pointer reaches the end of `s`, all characters were matched in order — return `True`. If `t`'s pointer reaches the end of `t` first, `s` still has unmatched characters — return `False`.

---

## Key Observations

1. **`t`'s pointer always advances.** You scan every character of `t` exactly once, whether or not it matches.
2. **`s`'s pointer only advances on a match.** This enforces the ordering constraint: you can only check off a character once you actually find it at or after the current position in `t`.
3. **No backtracking.** Once you move past a position in `t`, you never revisit it. This is what gives the O(N + M) time complexity.
4. **Order matters, gaps don't.** `s = "ace"` succeeds even though positions 1 and 3 (`b` and `d`) are skipped. But `s = "aec"` fails because `e` cannot appear before `c` in the subsequence.

---

## Approach

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
  Start(["index1 = 0, index2 = 0"])
  Check{"index1 < len(s)<br/>AND index2 < len(t)?"}
  Match{"s[index1] == t[index2]?"}
  AdvBoth["index1 += 1<br/>index2 += 1"]
  AdvTwo["index2 += 1"]
  Done{"index1 == len(s)?"}
  RetTrue(["return True"])
  RetFalse(["return False"])

  Start --> Check
  Check -->|"yes"| Match
  Check -->|"no"| Done
  Match -->|"yes — found target char"| AdvBoth --> Check
  Match -->|"no — skip t[index2]"| AdvTwo --> Check
  Done -->|"yes — all of s matched"| RetTrue
  Done -->|"no — t ran out first"| RetFalse
```

<p align="center"><strong>Simultaneous traversal — <code>index2</code> advances every step; <code>index1</code> only advances when a match is found. The loop exits when either string is exhausted.</strong></p>

**Step-by-step logic:**

1. Start both pointers at position 0.
2. Each iteration: if `s[index1] == t[index2]`, the current target character in `s` was found — advance both pointers.
3. If no match, `t[index2]` is not the character we need right now — advance only `index2` to check the next character in `t`.
4. When the loop exits (one of the strings is exhausted), check if `index1 == len(s)`. If yes, every character in `s` was matched in order — `True`. Otherwise, `s` still has unmatched characters — `False`.

---

## Solution

```python,editable
class Solution:
    def is_subsequence(self, s: str, t: str) -> bool:
        # Points at the next character in s we need to find inside t
        index1 = 0
        # Points at the current character in t we are examining
        index2 = 0

        # Run while both strings still have unexamined characters
        while index1 < len(s) and index2 < len(t):
            if s[index1] == t[index2]:
                # Found the current target — advance s's pointer to the next target
                index1 += 1
            # Always advance t's pointer: we examine every character of t exactly once
            index2 += 1

        # If index1 reached the end of s, every character was matched in order
        # If index1 < len(s), t ran out before all of s was matched
        return index1 == len(s)


sol = Solution()
print(sol.is_subsequence("ace", "abcde"))  # True
print(sol.is_subsequence("aec", "abcde"))  # False
print(sol.is_subsequence("", "abc"))       # True  — empty is always a subsequence
print(sol.is_subsequence("abc", ""))       # False — non-empty s can't fit in empty t
print(sol.is_subsequence("abc", "abc"))    # True  — s equals t, still a valid subsequence
```

---

## Trace

<details>
<summary><strong>Trace — s = "ace", t = "abcde"</strong></summary>

```
index1 = 0,  index2 = 0

Step 1 │ index1=0 ('a'), index2=0 ('a') │ 'a'=='a' match   │ index1=1, index2=1
Step 2 │ index1=1 ('c'), index2=1 ('b') │ 'c'≠'b' no match │ index1=1, index2=2
Step 3 │ index1=1 ('c'), index2=2 ('c') │ 'c'=='c' match   │ index1=2, index2=3
Step 4 │ index1=2 ('e'), index2=3 ('d') │ 'e'≠'d' no match │ index1=2, index2=4
Step 5 │ index1=2 ('e'), index2=4 ('e') │ 'e'=='e' match   │ index1=3, index2=5
Loop exits: index1=3 == len(s)=3

Return: True ✓

Note: index2 advanced on every step; index1 only advanced on steps 1, 3, and 5.
The three skipped characters ('b', 'd') in t were irrelevant to the match.
```

</details>

<details>
<summary><strong>Trace — s = "aec", t = "abcde"  (failure case)</strong></summary>

```
index1 = 0,  index2 = 0

Step 1 │ index1=0 ('a'), index2=0 ('a') │ match   │ index1=1, index2=1
Step 2 │ index1=1 ('e'), index2=1 ('b') │ no match│ index1=1, index2=2
Step 3 │ index1=1 ('e'), index2=2 ('c') │ no match│ index1=1, index2=3
Step 4 │ index1=1 ('e'), index2=3 ('d') │ no match│ index1=1, index2=4
Step 5 │ index1=1 ('e'), index2=4 ('e') │ match   │ index1=2, index2=5
Loop exits: index2=5 == len(t)=5

Return: index1 == len(s) → 2 == 3 → False ✓

Note: 'e' was found successfully, but now index2 has run off the end of t.
s[2]='c' was never matched — and it can't be, because 'c' in t was already
passed at index2=2, before 'e' was found. The ordering is violated.
```

</details>

---

## Complexity

| | Time | Space |
|---|---|---|
| **Subsequence checker** | O(N + M) | O(1) |

**Time:** In the worst case (no match, or a match only at the very end), `index2` scans all of `t` (M steps) and `index1` scans all of `s` (N steps). Total steps: at most N + M.

**Space:** Only two integer pointers — no auxiliary data structures needed.

---

## Edge Cases

| Case | Example | Expected | Reasoning |
|---|---|---|---|
| Empty `s` | `s=""`, `t="abc"` | `True` | index1 starts at 0 == len(s), loop never runs, returns True immediately |
| Empty `t` | `s="a"`, `t=""` | `False` | Loop never runs, index1=0 ≠ len(s)=1 → False |
| Both empty | `s=""`, `t=""` | `True` | index1=0 == len(s)=0 → True |
| `s` longer than `t` | `s="abcde"`, `t="abc"` | `False` | t exhausts before all of s is matched |
| `s` equals `t` | `s="abc"`, `t="abc"` | `True` | Every character matches at the same position |
| All characters same | `s="aaa"`, `t="aaaa"` | `True` | Three matches found before t is exhausted |
| Single character miss | `s="z"`, `t="abcde"` | `False` | 'z' never appears in t; t exhausts with index1=0 |

---

## Key Takeaway

Use simultaneous traversal when one string's pointer always advances and the other only advances on a match — the answer is whether the conditional pointer exhausts its sequence first. Remember: `index2` (for `t`) is the engine that drives the loop; `index1` (for `s`) is the progress meter.

***

# Merge Sorted Arrays

## The Problem

Given two integer arrays `arr1` and `arr2`, both sorted in non-decreasing order, and two integers `m` and `n` representing the number of valid elements in each array, merge `arr2` into `arr1` **in-place** so that `arr1` holds all `m + n` elements in sorted order.

`arr1` is pre-allocated to length `m + n` — the last `n` slots are filled with zeros as placeholders.

```
Input:  arr1 = [1, 2, 3, 0, 0], m = 3, arr2 = [4, 5], n = 2
Output: [1, 2, 3, 4, 5]

Input:  arr1 = [1, 2, 5, 0, 0], m = 3, arr2 = [3, 4], n = 2
Output: [1, 2, 3, 4, 5]

Input:  arr1 = [1], m = 1, arr2 = [], n = 0
Output: [1]
```

---

## What Makes Merging In-Place Tricky?

Your first instinct is to merge from the front: compare `arr1[0]` and `arr2[0]`, place the smaller one at position 0, then move forward. Clean logic — but there's a fatal problem.

`arr1` is the destination *and* a source. The moment you write into `arr1[0]`, you destroy the element that was already there. You'd have to shift everything one position to the right to make room first — and that's O(N) work per insert, O(N²) total.

```d2
bad: "Front-to-back: destroys arr1[0] before reading it" {
  grid-columns: 5
  grid-gap: 0
  a0: "1" {style.fill: "#fecaca"; style.stroke: "#dc2626"}
  a1: "2"
  a2: "3"
  a3: "0"
  a4: "0"
}

bad_arrow: "write here ✗ overwrites!" {shape: oval; style.fill: "#fecaca"; style.stroke: "#dc2626"}
bad_arrow -> bad.a0

good: "Back-to-front: writes into free zeros, never destroys unread data" {
  grid-columns: 5
  grid-gap: 0
  b0: "1"
  b1: "2"
  b2: "3"
  b3: "0"
  b4: "0" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
}

good_arrow: "write here ✓ safe (free slot)" {shape: oval; style.fill: "#dcfce7"; style.stroke: "#16a34a"}
good_arrow -> good.b4
```

<p align="center"><strong>Writing from the front overwrites unread data. Writing from the back fills the pre-allocated zero slots — already free, never destructive.</strong></p>

The fix is to flip the direction entirely. The last `n` positions of `arr1` are zeros — free space nobody has touched. The largest element belongs there. Fill from the back, largest-first. The write pointer never catches up to the read pointers until every element has been consumed.

---

## Applying the Diagnostic Questions

| Question | Answer |
|---|---|
| **Q1.** Does the problem involve two sequences that must be compared or processed together? | **Yes** — elements from `arr1` and `arr2` must compete at every step to determine placement order |
| **Q2.** Does advancing in one sequence depend on a comparison between the two? | **Yes** — whichever array supplies the larger element has its pointer decremented; the other stays |
| **Q3.** Is each pointer's advance condition simple and deterministic at every step? | **Yes** — a single `>` comparison at each step, no sorting or preprocessing needed |

### Q1 — Why "elements from both arrays must compete at every step"?

**Mental model:** Think of the merge as a competition. At every position (from back to front), two candidates show up — `arr1[i1]` and `arr2[i2]`. The winner takes the current slot and steps aside; the loser stays for the next round.

**Why you can't process each array separately:** If you placed all of `arr2` first, then all of `arr1`, you'd lose the sorted order that lets you merge in O(M + N). The sorted property only helps you when you're comparing one element from each array simultaneously — comparing an `arr1` element only against other `arr1` elements tells you nothing about where it lands relative to `arr2`.

**What breaks with a single pointer:** If you used one pointer scanning `arr1` for the right slot to insert each element of `arr2`, you'd need an inner loop — O(N) work per `arr2` element, O(N × M) total. Two simultaneous pointers reduce this to one comparison per element.

### Q2 — Why "whichever supplies the larger element gets decremented"?

**Mental model:** Think of the two pointers as two fingers pointing at the current candidates. At each step, you pick the larger of the two, write it to the current back slot, and pull that finger one position closer to the front. The other finger freezes — it might win the next round.

**Concrete check with `arr1=[1,2,5]`, `arr2=[3,4]`, writing from position 4 down:**
- `i1=2 (5)` vs `i2=1 (4)`: 5 wins → write 5 to slot 4, decrement `i1`
- `i1=1 (2)` vs `i2=1 (4)`: 4 wins → write 4 to slot 3, decrement `i2`
- `i1=1 (2)` vs `i2=0 (3)`: 3 wins → write 3 to slot 2, decrement `i2`
- `i2` exhausted → `arr1[0..1] = [1, 2]` are already in place

**What breaks if you always decrement both:** You'd skip elements. If `arr1[i1] = 5` and `arr2[i2] = 4`, decrementing `i2` means `arr2[i2]` (which is 4) never gets placed — it gets skipped without being written anywhere.

### Q3 — Why "a single comparison is enough at every step"?

**Mental model:** Both arrays are already sorted, so the current candidates `arr1[i1]` and `arr2[i2]` are the maximum of their respective remaining elements. You don't need to look further — the largest overall element is always one of these two.

**Why O(M + N) is achievable:** Each element is examined at most once (as a candidate) and written once (when it wins). With M elements in `arr1` and N in `arr2`, that's exactly M + N operations — no lookahead, no backtracking.

**What would break this:** If the arrays weren't sorted, you couldn't pick the global maximum by only looking at `arr1[i1]` and `arr2[i2]`. You'd need to scan the rest of each array — pushing complexity to O(M × N).

---

## The Backward Fill Strategy (Visualised)

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
    subgraph S0["Start:  arr1=[1,2,5,_,_]  arr2=[3,4]   i1=2, i2=1, i3=4"]
        direction LR
        A0["1"] --- A1["2"] --- A2["5"] --- A3["_"] --- A4["_"]
        B0["3"] --- B1["4"]
    end
    subgraph S1["Step 1: 5 > 4 → write 5 to slot 4   i1=1, i3=3"]
        direction LR
        C0["1"] --- C1["2"] --- C2["5"] --- C3["_"] --- C4["5"]
        D0["3"] --- D1["4"]
    end
    subgraph S2["Step 2: 2 < 4 → write 4 to slot 3   i2=0, i3=2"]
        direction LR
        E0["1"] --- E1["2"] --- E2["5"] --- E3["4"] --- E4["5"]
        F0["3"] --- F1["4"]
    end
    subgraph S3["Step 3: 2 < 3 → write 3 to slot 2   i2=-1, i3=1"]
        direction LR
        G0["1"] --- G1["2"] --- G2["3"] --- G3["4"] --- G4["5"]
        H0["3"] --- H1["4"]
    end
    subgraph S4["Done: i2 exhausted  →  arr1[0..1]=[1,2] already in place ✓"]
        direction LR
        I0["1"] --- I1["2"] --- I2["3"] --- I3["4"] --- I4["5"]
    end
    S0 -->|"arr1[i1]=5 > arr2[i2]=4"| S1
    S1 -->|"arr1[i1]=2 < arr2[i2]=4"| S2
    S2 -->|"arr1[i1]=2 < arr2[i2]=3"| S3
    S3 -->|"i2 = -1, loop exits"| S4
```

<p align="center"><strong>Three-pointer backward fill — <code>i1</code> and <code>i2</code> compete for each slot; <code>i3</code> always fills the next free position from the back. No element is ever overwritten before being read.</strong></p>

**The three pointers:**
- `i1 = m - 1` — last valid element of `arr1`
- `i2 = n - 1` — last element of `arr2`
- `i3 = m + n - 1` — current write position (starts at the very back)

**At each step:** Compare `arr1[i1]` and `arr2[i2]`. The larger one claims slot `i3`. Decrement its source pointer and decrement `i3`.

**After the loop:** If `arr2` still has elements (`i2 >= 0`), copy them straight into `arr1` — they're all smaller than everything already placed, so no comparison needed. If `arr1` still has elements, they're already sitting in the right positions — no action needed.

---

## The Solution

```python,editable
from typing import List

class Solution:
    def merge_sorted_arrays(
        self, arr1: List[int], m: int, arr2: List[int], n: int
    ) -> None:
        i1 = m - 1      # Last valid element in arr1 (positions m..m+n-1 are zeros)
        i2 = n - 1      # Last element in arr2
        i3 = m + n - 1  # Next write slot — starts at the very back of arr1

        # Fill from the back: at each step, the larger of the two candidates claims slot i3
        while i1 >= 0 and i2 >= 0:
            if arr1[i1] > arr2[i2]:
                arr1[i3] = arr1[i1]  # arr1's candidate wins — move it to the write slot
                i1 -= 1              # arr1's read pointer steps one position left
            else:
                arr1[i3] = arr2[i2]  # arr2's candidate wins (also handles ties — either is correct)
                i2 -= 1              # arr2's read pointer steps one position left
            i3 -= 1                  # Write slot moves left regardless of which candidate won

        # If arr2 still has elements, they are all smaller than anything already placed.
        # Copy them directly — no comparison needed.
        # If arr1 still has elements (i1 >= 0), they are already in position — do nothing.
        while i2 >= 0:
            arr1[i3] = arr2[i2]
            i2 -= 1
            i3 -= 1


sol = Solution()

arr1 = [1, 2, 3, 0, 0]
sol.merge_sorted_arrays(arr1, 3, [4, 5], 2)
print(arr1)  # [1, 2, 3, 4, 5]

arr1 = [1, 2, 5, 0, 0]
sol.merge_sorted_arrays(arr1, 3, [3, 4], 2)
print(arr1)  # [1, 2, 3, 4, 5]

arr1 = [1]
sol.merge_sorted_arrays(arr1, 1, [], 0)
print(arr1)  # [1]

arr1 = [0]
sol.merge_sorted_arrays(arr1, 0, [1], 1)
print(arr1)  # [1]
```

<details>
<summary><strong>Trace — arr1 = [1, 2, 5, 0, 0], m = 3, arr2 = [3, 4], n = 2</strong></summary>

```
i1 = 2,  i2 = 1,  i3 = 4

Step 1 │ i1=2 (arr1[2]=5), i2=1 (arr2[1]=4) │ 5 > 4 → arr1[4]=5, i1=1 │ arr1=[1,2,5,0,5]  i3=3
Step 2 │ i1=1 (arr1[1]=2), i2=1 (arr2[1]=4) │ 2 < 4 → arr1[3]=4, i2=0 │ arr1=[1,2,5,4,5]  i3=2
Step 3 │ i1=1 (arr1[1]=2), i2=0 (arr2[0]=3) │ 2 < 3 → arr1[2]=3, i2=-1│ arr1=[1,2,3,4,5]  i3=1

Loop exits: i2 = -1

No leftover arr2 elements. arr1[0..1] = [1, 2] already in correct positions.

Result: [1, 2, 3, 4, 5] ✓

Note: the write pointer i3 always wrote into a position at or ahead of where
it started — it never caught up to i1, so no element was overwritten before being read.
```

</details>

<details>
<summary><strong>Trace — arr1 = [3, 4, 0, 0], m = 2, arr2 = [1, 2], n = 2  (arr1 exhausts first, leftover-copy runs)</strong></summary>

```
i1 = 1,  i2 = 1,  i3 = 3

Step 1 │ i1=1 (arr1[1]=4), i2=1 (arr2[1]=2) │ 4 > 2 → arr1[3]=4, i1=0 │ arr1=[3,4,0,4]  i3=2
Step 2 │ i1=0 (arr1[0]=3), i2=1 (arr2[1]=2) │ 3 > 2 → arr1[2]=3, i1=-1│ arr1=[3,4,3,4]  i3=1

Loop exits: i1 = -1

Leftover arr2: i2=1
  copy arr2[1]=2 → arr1[1]=2, i2=0, i3=0
  copy arr2[0]=1 → arr1[0]=1, i2=-1

Result: [1, 2, 3, 4] ✓

Note: the leftover-copy pass handles arr2 elements that are all smaller
than anything already placed — no comparison needed, just copy in order.
```

</details>

---

## Complexity Analysis

| | Complexity | Reason |
|---|---|---|
| **Time** | O(M + N) | Each element is read once (by `i1` or `i2`) and written once (by `i3`) — M + N operations total |
| **Space** | O(1) | Only three integer pointers; the pre-allocated zeros in `arr1` serve as the output buffer |

---

## Edge Cases

| Case | Example | Expected | Reasoning |
|---|---|---|---|
| `arr2` is empty | `arr1=[1]`, `m=1`, `arr2=[]`, `n=0` | `[1]` | `i2=-1` immediately; main loop never runs, `arr1` unchanged |
| `arr1` has no valid elements | `arr1=[0]`, `m=0`, `arr2=[1]`, `n=1` | `[1]` | `i1=-1` immediately; main loop skipped; leftover-copy runs once |
| All `arr2` larger than `arr1` | `arr1=[1,2,0,0]`, `arr2=[3,4]` | `[1,2,3,4]` | `arr2` wins every comparison; `arr1` elements stay untouched at the front |
| All `arr2` smaller than `arr1` | `arr1=[3,4,0,0]`, `arr2=[1,2]` | `[1,2,3,4]` | `arr1` wins every comparison; leftover-copy places both `arr2` elements |
| Arrays perfectly interleave | `arr1=[1,3,0,0]`, `arr2=[2,4]` | `[1,2,3,4]` | Each comparison alternates winner between `i1` and `i2` |
| Tie (equal elements) | `arr1=[2,3,0]`, `arr2=[2]` | `[2,2,3]` | `else` branch fires on ties, placing `arr2[i2]` first — both orderings are valid for equal elements |

---

## Final Takeaway

Merge from the back when the destination array has pre-allocated empty space at the end — it lets the write pointer fill free slots without ever stomping on unread values. The three-pointer setup (`i1` reads `arr1`, `i2` reads `arr2`, `i3` writes into `arr1`) is simultaneous traversal running in reverse: two read pointers compete to supply the largest element, one write pointer claims the result. Always handle the leftover `arr2` copy pass — leftover `arr1` elements are already in place and need no action.

***

# Unique Intersections

## The Problem

Given two integer arrays `arr1` and `arr2`, return an array containing all elements that appear in **both** arrays. Each element in the result must appear **only once**, regardless of how many times it appears in the inputs.

```
arr1 = [1, 2, 2, 3, 4],  arr2 = [2, 2, 3, 5]  →  [2, 3]
arr1 = [1, 2, 3],         arr2 = [4, 5, 6]      →  []
arr1 = [1, 1, 1],         arr2 = [1, 1]          →  [1]
arr1 = [1, 2, 3, 4, 5],   arr2 = [1, 3, 5, 7]   →  [1, 3, 5]
```

---

## Examples

**Example 1**
```
Input:  arr1 = [1, 2, 2, 3, 4],  arr2 = [2, 2, 3, 5]
Output: [2, 3]
Explanation: 2 and 3 appear in both arrays. Even though 2 appears twice in both,
             it appears only once in the result.
```

**Example 2**
```
Input:  arr1 = [1, 3, 5],  arr2 = [2, 4, 6]
Output: []
Explanation: No value appears in both arrays.
```

**Example 3**
```
Input:  arr1 = [2, 2, 2],  arr2 = [2, 2]
Output: [2]
Explanation: 2 is common, but unique intersections means it appears once.
```

---

## Intuition

The brute force way is to check every element of `arr1` against every element of `arr2` — that's O(N × M). But if both arrays are sorted, you can do something much smarter: walk both simultaneously.

Think of it like merging, but instead of taking elements from either side, you're looking for **moments where both sides match**. When `arr1[i] == arr2[j]`, you've found a common element — record it and advance both pointers. When `arr1[i] < arr2[j]`, the element in `arr1` is too small to find a match on the right, so skip it. When `arr1[i] > arr2[j]`, the element in `arr2` is too small — skip it.

The **uniqueness** constraint adds one extra rule: after recording a match, if the next elements on either side are duplicates of what you just recorded, skip them. You only ever record a value the first time you encounter it.

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
  Sort["Sort arr1 and arr2"]
  Init(["i = 0, j = 0, result = []"])
  Check{"i < len(arr1)<br/>AND j < len(arr2)?"}
  Cmp{"arr1[i] vs arr2[j]"}
  Match["Record arr1[i] if not duplicate<br/>i += 1,  j += 1"]
  AdvI["i += 1<br/>(arr1[i] too small)"]
  AdvJ["j += 1<br/>(arr2[j] too small)"]
  Done(["return result"])

  Sort --> Init --> Check
  Check -->|"yes"| Cmp
  Cmp -->|"equal"| Match --> Check
  Cmp -->|"arr1[i] < arr2[j]"| AdvI --> Check
  Cmp -->|"arr1[i] > arr2[j]"| AdvJ --> Check
  Check -->|"no"| Done
```

<p align="center"><strong>Unique Intersections — sort both, then walk with two pointers. On a match, record only if the value is new. On a mismatch, advance the smaller pointer.</strong></p>

---

## Brute Force: Nested Loops, O(N × M)

```python,editable
from typing import List

def unique_intersections_brute(arr1: List[int], arr2: List[int]) -> List[int]:
    # Use a set to avoid recording duplicates in the result
    seen = set()
    result = []

    # For every element in arr1, scan all of arr2 for a match
    for x in arr1:
        for y in arr2:
            if x == y and x not in seen:
                result.append(x)
                seen.add(x)
                break  # No need to keep scanning arr2 for this x

    return result

print(unique_intersections_brute([1, 2, 2, 3, 4], [2, 2, 3, 5]))  # [2, 3]
```

Works, but rescans `arr2` for every element in `arr1` — O(N × M) and easy to get wrong with the duplicate-tracking logic.

---

## Solution

```python,editable
from typing import List

class Solution:
    def unique_intersections(self, arr1: List[int], arr2: List[int]) -> List[int]:
        # Sort both arrays to enable simultaneous traversal
        arr1.sort()
        arr2.sort()

        result = []
        # Initialize pointers at the start of each array
        i = 0
        j = 0

        # Main loop: run while both arrays have unprocessed elements
        while i < len(arr1) and j < len(arr2):
            if arr1[i] == arr2[j]:
                # Common element found — record only if it is not a duplicate of the last result entry
                if not result or result[-1] != arr1[i]:
                    result.append(arr1[i])
                # Advance both pointers past this match
                i += 1
                j += 1
            elif arr1[i] < arr2[j]:
                # arr1's element is smaller — it can't match anything in arr2 at or before j
                i += 1
            else:
                # arr2's element is smaller — it can't match anything in arr1 at or before i
                j += 1

        return result


sol = Solution()
print(sol.unique_intersections([1, 2, 2, 3, 4], [2, 2, 3, 5]))    # [2, 3]
print(sol.unique_intersections([1, 3, 5], [2, 4, 6]))              # []
print(sol.unique_intersections([2, 2, 2], [2, 2]))                 # [2]
print(sol.unique_intersections([1, 2, 3, 4, 5], [1, 3, 5, 7]))    # [1, 3, 5]
print(sol.unique_intersections([], [1, 2, 3]))                     # []
```

---

## Dry Run — Example 1

`arr1 = [1, 2, 2, 3, 4]`, `arr2 = [2, 2, 3, 5]` (both already sorted)

<details>
<summary><strong>Trace — arr1 = [1, 2, 2, 3, 4],  arr2 = [2, 2, 3, 5]</strong></summary>

```
i=0, j=0, result=[]

Step 1 │ arr1[0]=1, arr2[0]=2 │ 1 < 2 → advance i          │ i=1, j=0
Step 2 │ arr1[1]=2, arr2[0]=2 │ 2 == 2 → result empty → record 2 → i=2, j=1  │ result=[2]
Step 3 │ arr1[2]=2, arr2[1]=2 │ 2 == 2 → result[-1]==2 → skip (duplicate)    │ i=3, j=2
Step 4 │ arr1[3]=3, arr2[2]=3 │ 3 == 3 → result[-1]=2 ≠ 3 → record 3 → i=4, j=3  │ result=[2,3]
Step 5 │ arr1[4]=4, arr2[3]=5 │ 4 < 5 → advance i          │ i=5, j=3

i=5 == len(arr1)=5 → loop exits

Result: [2, 3] ✓

Note: step 3 found a second (2,2) match but the duplicate check suppressed it.
The sorted order of both arrays means once a match is recorded, all subsequent
duplicates of that value appear consecutively and are caught immediately.
```

</details>

---

## Why Sort First?

Without sorting, you can't use the directional "advance the smaller" rule — you don't know which pointer to move when there's no match. The sort gives you the guarantee that:

- If `arr1[i] < arr2[j]`, no element of `arr2` at positions `0..j-1` equals `arr1[i]` (already passed), and no element at positions `j..end` is smaller than `arr2[j]` (sorted). So `arr1[i]` can never match — safely skip it.
- The symmetric argument applies for `arr1[i] > arr2[j]`.

After sorting, the advance condition is always decisive. Without sorting, you'd need an inner scan — and that's O(N × M) again.

---

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(N log N + M log M) | Two sorts dominate; the traversal itself is O(N + M) |
| **Space** | O(k) | k = number of unique common elements in the result; O(1) extra working space |

If both arrays arrive pre-sorted, the time is O(N + M).

---

## Edge Cases

| Scenario | Input | Output | Note |
|---|---|---|---|
| No common elements | `[1,3,5]`, `[2,4,6]` | `[]` | Pointers never match; one runs out first |
| All elements match | `[1,2,3]`, `[1,2,3]` | `[1,2,3]` | Every step is a match |
| One array empty | `[]`, `[1,2,3]` | `[]` | Loop never runs |
| All duplicates | `[2,2,2]`, `[2,2]` | `[2]` | Duplicate check fires after first match |
| Single common element | `[1,5,9]`, `[3,5,7]` | `[5]` | One match in the middle |

---

## Key Takeaway

Unique Intersections = merge pattern + match-only recording + duplicate suppression. Sort both arrays once, then use a single simultaneous pass. The `result[-1] != arr1[i]` guard is the whole difference between this problem and Repeated Intersections — one line is all it takes to enforce uniqueness when the array is sorted.

***

# Repeated Intersections

## The Problem

Given two integer arrays `arr1` and `arr2`, return an array containing all elements that appear in **both** arrays, **including duplicates**. An element that appears `p` times in `arr1` and `q` times in `arr2` should appear `min(p, q)` times in the result.

```
arr1 = [1, 2, 2, 3],  arr2 = [2, 2, 3, 3]  →  [2, 2, 3]
arr1 = [1, 2, 3],     arr2 = [4, 5, 6]      →  []
arr1 = [2, 2, 2],     arr2 = [2, 2]          →  [2, 2]
arr1 = [1, 2, 3],     arr2 = [1, 2, 3]       →  [1, 2, 3]
```

---

## Examples

**Example 1**
```
Input:  arr1 = [1, 2, 2, 3],  arr2 = [2, 2, 3, 3]
Output: [2, 2, 3]
Explanation: 2 appears twice in both → 2 appears twice in result.
             3 appears once in arr1, twice in arr2 → min(1,2)=1 → once in result.
```

**Example 2**
```
Input:  arr1 = [2, 2, 2],  arr2 = [2, 2]
Output: [2, 2]
Explanation: 2 appears 3 times in arr1, 2 times in arr2 → min(3,2)=2 appearances.
```

**Example 3**
```
Input:  arr1 = [1, 3, 5],  arr2 = [2, 4, 6]
Output: []
Explanation: No common values exist.
```

---

## Intuition

This is nearly identical to Unique Intersections — but with one critical difference: every matching pair is recorded, not just the first one.

On a sorted array, when `arr1[i] == arr2[j]`, both pointers are sitting on the same value. That's one instance of a common element. Record it and advance both. If the next positions also match, that's another shared instance — record again. The `min(p, q)` rule falls out naturally: once the shorter side runs out of copies of a value, the pointers stop matching and move on.

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
  Sort["Sort arr1 and arr2"]
  Init(["i = 0, j = 0, result = []"])
  Check{"i < len(arr1)<br/>AND j < len(arr2)?"}
  Cmp{"arr1[i] vs arr2[j]"}
  Match["result.append(arr1[i])<br/>i += 1,  j += 1"]
  AdvI["i += 1"]
  AdvJ["j += 1"]
  Done(["return result"])

  Sort --> Init --> Check
  Check -->|"yes"| Cmp
  Cmp -->|"equal — record every match"| Match --> Check
  Cmp -->|"arr1[i] < arr2[j]"| AdvI --> Check
  Cmp -->|"arr1[i] > arr2[j]"| AdvJ --> Check
  Check -->|"no"| Done
```

<p align="center"><strong>Repeated Intersections — identical to Unique Intersections but every match is recorded unconditionally. The min(p, q) rule emerges naturally from both pointers advancing on each match.</strong></p>

---

## Solution

```python,editable
from typing import List

class Solution:
    def repeated_intersections(self, arr1: List[int], arr2: List[int]) -> List[int]:
        # Sort both arrays to enable simultaneous traversal
        arr1.sort()
        arr2.sort()

        result = []
        # Initialize pointers at the start of each array
        i = 0
        j = 0

        # Main loop: run while both arrays have unprocessed elements
        while i < len(arr1) and j < len(arr2):
            if arr1[i] == arr2[j]:
                # Common element found — record every match, duplicates included
                result.append(arr1[i])
                # Advance both pointers to look for the next shared element
                i += 1
                j += 1
            elif arr1[i] < arr2[j]:
                # arr1's element is smaller — no match possible at this position
                i += 1
            else:
                # arr2's element is smaller — no match possible at this position
                j += 1

        return result


sol = Solution()
print(sol.repeated_intersections([1, 2, 2, 3], [2, 2, 3, 3]))    # [2, 2, 3]
print(sol.repeated_intersections([2, 2, 2], [2, 2]))              # [2, 2]
print(sol.repeated_intersections([1, 3, 5], [2, 4, 6]))           # []
print(sol.repeated_intersections([1, 2, 3], [1, 2, 3]))           # [1, 2, 3]
print(sol.repeated_intersections([], [1, 2]))                     # []
```

---

## Dry Run — Example 1

`arr1 = [1, 2, 2, 3]`, `arr2 = [2, 2, 3, 3]` (both already sorted)

<details>
<summary><strong>Trace — arr1 = [1, 2, 2, 3],  arr2 = [2, 2, 3, 3]</strong></summary>

```
i=0, j=0, result=[]

Step 1 │ arr1[0]=1, arr2[0]=2 │ 1 < 2 → advance i                │ i=1, j=0
Step 2 │ arr1[1]=2, arr2[0]=2 │ 2 == 2 → record 2                │ i=2, j=1,  result=[2]
Step 3 │ arr1[2]=2, arr2[1]=2 │ 2 == 2 → record 2 again          │ i=3, j=2,  result=[2,2]
Step 4 │ arr1[3]=3, arr2[2]=3 │ 3 == 3 → record 3                │ i=4, j=3,  result=[2,2,3]

i=4 == len(arr1)=4 → loop exits

Result: [2, 2, 3] ✓

Compare with Unique Intersections: in step 3, Unique would have checked
result[-1]==2 and skipped. Repeated does not check — it records unconditionally.
That single difference is the entire distinction between the two problems.
```

</details>

---

## Why min(p, q) Falls Out Naturally

You don't need to count occurrences of each value. The simultaneous pointer movement handles it automatically:

- Each match consumes one copy from `arr1` (i advances) and one copy from `arr2` (j advances).
- The side with fewer copies runs out of them first. When it does, `arr1[i] ≠ arr2[j]` again, and the match streak ends.
- The number of consecutive matches is exactly `min(p, q)` — the count of the shorter side.

For `arr1 = [2, 2, 2]` and `arr2 = [2, 2]`:
- Match at i=0, j=0 → record, i=1, j=1
- Match at i=1, j=1 → record, i=2, j=2
- j=2 == len(arr2) → loop exits. Two matches recorded = min(3, 2) = 2 ✓

---

## Unique vs Repeated — The One-Line Difference

| | Unique Intersections | Repeated Intersections |
|---|---|---|
| On match | `if not result or result[-1] != arr1[i]: result.append(...)` | `result.append(arr1[i])` unconditionally |
| Duplicate handling | Skip duplicate matches | Record every match |
| Result for `[2,2]` ∩ `[2,2,2]` | `[2]` | `[2, 2]` |
| Use case | Set intersection (no duplicates) | Multiset intersection (with duplicates) |

The only structural difference is the guard condition on the append. Remove it, and Unique Intersections becomes Repeated Intersections.

---

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(N log N + M log M) | Two sorts dominate; traversal is O(N + M) |
| **Space** | O(k) | k = total number of matches = sum of min(count_in_arr1, count_in_arr2) across all values |

---

## Edge Cases

| Scenario | Input | Output | Note |
|---|---|---|---|
| No overlap | `[1,3,5]`, `[2,4,6]` | `[]` | No matches ever |
| All elements match | `[1,2,3]`, `[1,2,3]` | `[1,2,3]` | Every step is a match |
| One array empty | `[]`, `[1,2,3]` | `[]` | Loop never runs |
| One array is a subset | `[2,3]`, `[1,2,3,4]` | `[2,3]` | Every element of the smaller array matches |
| All duplicates | `[3,3,3]`, `[3,3]` | `[3,3]` | min(3,2)=2 matches |

---

## Key Takeaway

Repeated Intersections is Unique Intersections without the duplicate guard — one line removed, and the semantics shift from set intersection to multiset intersection. The `min(p, q)` count falls out naturally from two pointers advancing together: each match consumes one copy from each side, and the smaller side dictates how many total matches occur.
