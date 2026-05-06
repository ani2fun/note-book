# Pseudocode Reference

Every lesson in this section opens with a **🧠 Pseudocode** tab — the algorithm stripped of any specific language's syntax, so you can see the *shape* of the solution before the noise of `public static void`s and `fmt.Println`s.

This page is the one-stop reference for the conventions that tab uses. Bookmark it; come back any time a symbol surprises you.

---

## Why a Pseudocode Tab?

When you meet a new pattern — sliding window, two pointers, dynamic programming, etc. — what you really want first is the *idea*. The Python tab is the canonical implementation; the Java/C/Go tabs are ports for muscle memory in those languages. The Pseudocode tab sits in front of all of them so the algorithm is the first thing you read, not buried under a language's ceremony.

Read it like English with a few math symbols. If a shorthand isn't clear, switch to Python — that tab is always the source of truth.

---

## Reading Rules

Two arrows appear in the pseudocode. They look similar but mean different things — keep them straight and the rest of the notation falls into place.

> **`←` is assignment.** Read `x ← y` as "x becomes y". Never confuse it with comparison; equality is `=`, inequality is `≠`.
>
> **`→` is the function arrow** from set theory, used **only inside type signatures**. Read `K → V` as "from K to V" (or "maps K to V"). It declares a relationship between types — it is *not* a transformation, an assignment, or a flow direction.

The function arrow is how academia writes the type of a map/dictionary: a hash map whose keys are of type `K` and values are of type `V` is written `Map: K → V`. The form is identical to declaring a mathematical function `f: ℝ → ℝ` — same arrow, same meaning.

---

## Quick Reference

| Concept | Symbol / Form | Example |
|---|---|---|
| Assignment ("becomes") | `←` | `count ← 0` |
| Equality / inequality | `=`, `≠` | `if i ≠ n − 1:` |
| Ordering | `<`, `>`, `≤`, `≥` | `while left ≤ right:` |
| Boolean ops | `AND`, `OR`, `NOT`, `XOR` | `if found AND NOT visited:` |
| Bitwise ops | `bitwise AND/OR/XOR/NOT`, `shifted left by`, `shifted right by` | `mask ← 1 shifted left by (k − 1)` |
| Function header | `function camelCase(args):` | `function twoSum(nums, target):` |
| If / else | `if cond: ... else: ... end if` | shown below |
| For loop (range) | `for i from 0 to n − 1:` | `for i from 0 to length(nums) − 1:` |
| For loop (collection) | `for x in collection:` | `for c in word:` |
| While loop | `while cond:` | `while left < right:` |
| Return | `return value` | `return []` |
| Empty single-type container | `empty list / set / stack / queue` | `stack ← empty stack` |
| Empty Map (typed) | `empty Map: K → V` | `seen ← empty Map: Number → Index` |
| Map lookup / write | `m[k]`, `m[k] ← v` | `seen[nums[i]] ← i` |
| Membership | `is in` / `is not in` | `if complement is in seen:` |
| Length | `length(x)` | `length(nums)` |
| Indexing | `x[i]` | `nums[i]` |
| Comments | `# explanation` | `# this leaf is done either way` |

**Indentation:** 4 spaces. The pseudocode block visually mirrors the Python tab so your eyes can flip between them without re-orienting.

**Map type signatures:** when a hash map is created, *always* declare the signature as `Map: K → V`. `K` and `V` are role names (capitalized), e.g. `Number`, `Index`, `String`, `Frequency`. The signature replaces the need for any "this maps X to Y" comment — the declaration carries that information directly. Single-type containers (`list`, `set`, `stack`, `queue`) don't need a signature; their element type is usually obvious from context.

**Comments:** write them only when the *why* is non-obvious — a hidden invariant, a subtle ordering, a non-trivial algebraic step. Don't restate what the code already says. If a line needs a comment to explain *what* it does, the line is probably not pseudocode-clean — rename a variable or extract a helper instead.

---

## Worked Example

The pseudocode tab below is the algorithm for **Two-Sum** — given an array `nums` and a `target`, return the indices of two numbers that add up to the target. Click between the tabs to see how each layer of detail compares.

<div class="lang-tabs">

```pseudocode
function twoSum(nums, target):
    seen ← empty Map: Number → Index
    for i from 0 to length(nums) − 1:
        complement ← target − nums[i]
        if complement is in seen:
            return [seen[complement], i]
        seen[nums[i]] ← i
    return []
```

```python,editable
def two_sum(nums, target):
    seen = {}                       # value -> index
    for i, x in enumerate(nums):
        complement = target - x
        if complement in seen:
            return [seen[complement], i]
        seen[x] = i
    return []


if __name__ == "__main__":
    print(two_sum([2, 7, 11, 15], 9))   # [0, 1]
    print(two_sum([3, 2, 4], 6))        # [1, 2]
```

</div>

Notice how the pseudocode skips imports, the `if __name__ == "__main__"` driver, and the two test calls. Those exist to make Python *runnable* — they are not part of the algorithm. The pseudocode keeps only the steps a person would describe out loud at a whiteboard.

---

## What Pseudocode Skips

The 🧠 tab is intentionally minimal. It does **not** include:

- `import` / `using` / `#include` lines
- Class wrappers (`class Solution`, `public class …`)
- Test drivers (`if __name__ == "__main__"`, `main()`, `fun main()`)
- I/O statements (`print`, `println`, `console.log`) unless the algorithm itself produces output
- Language-specific generic syntax like `Map<Integer, Integer>`, `HashMap<K,V>`, or `dict[int, int]` — the academic `Map: K → V` form replaces all of them.
- Memory management, error handling, or boundary plumbing that's identical across implementations

If you want any of these, switch to the Python tab.

---

## When in Doubt, Read Python

The Python tab is the canonical implementation for every lesson. Pseudocode trades runnability for clarity — when a shorthand is ambiguous, the Python tab settles it. Treat the 🧠 tab as the **mental model** and the 🐍 tab as the **specification**.
