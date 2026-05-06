# 11. Pattern: Postorder Traversal (Stateful)

## The Hook

The previous lesson handled problems where each subtree returned **one** number to its parent and the parent combined the two children's numbers into a new one. That worked for height, sum, and similar single-value rollups. But there's a class of problems where the recursion needs to compute **two** things at once: a value to *return* to the parent (the "feed-up" answer) and a value to *track globally* (the "best-so-far" answer).

The classic example is **diameter of a binary tree** — the longest path between any two nodes. At every node, the diameter could either:
- *Pass through* this node (length = leftHeight + rightHeight), or
- Live *entirely within* one of the subtrees (length = whatever the subtree's diameter was).

So each call needs to *return* its own height (so the parent can compute its diameter), and *update a global maximum* with the best diameter seen so far. One value flows up the recursion; the other accumulates as a side effect. Two channels, one traversal.

This is the **stateful postorder pattern**. Same postorder traversal as the previous lesson, but augmented with a *shared mutable* (a global counter, a hash map, a tuple of running stats) that each call updates as the recursion bubbles up. The state is *not* pushed and popped per node — it monotonically grows or refines as we go. That's the structural difference from stateful *preorder* (lesson 9): preorder mutates and undoes; postorder mutates and accumulates.

This pattern unlocks a wide range of problems: tree diameter, longest mono-value paths, "count subtrees with property X", "distribute coins along edges", "find subtree sums with the highest frequency", and dozens of similar "two answers per node" problems. This lesson walks through the seven canonical examples, each with implementations in 10 languages.

---

## Table of contents

1. [The stateful postorder pattern](#the-stateful-postorder-pattern)
2. [How to recognise it](#how-to-recognise-it)
3. [Problem 1 — Diameter of tree](#problem-1--diameter-of-tree)
4. [Problem 2 — Descendants sum count](#problem-2--descendants-sum-count)
5. [Problem 3 — Distribute coins](#problem-3--distribute-coins)
6. [Problem 4 — Most frequent subtree sum](#problem-4--most-frequent-subtree-sum)
7. [Problem 5 — Longest monotonic path](#problem-5--longest-monotonic-path)
8. [Problem 6 — Monotonic subtree count](#problem-6--monotonic-subtree-count)
9. [Problem 7 — Path sum count](#problem-7--path-sum-count)

***

# The stateful postorder pattern

```text
recurse(node):
  if node is null: return baseCase
  leftAnswer  = recurse(node.left)
  rightAnswer = recurse(node.right)

  # ★ side-channel update: refine global state using leftAnswer, rightAnswer, node
  globalState = update(globalState, leftAnswer, rightAnswer, node)

  return feedUp(leftAnswer, rightAnswer, node)
```

Two distinct things happen at each node:

1. **Side-channel update** — refine a global accumulator using the children's results and the current node. This is what your *answer* is built from.
2. **Feed-up** — return some value to the parent. This is what enables the *next* level up to do its own update.

The genius of the pattern is that the value returned to the parent and the value tracked globally **don't have to be the same**. In the diameter problem, the function returns *height* (so the parent can extend the path through it), but it tracks *diameter* (the global best). One traversal, two answers.

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
    R(("(1)<br/>height returned: 3<br/>diameter tracked: 4"))
    A(("(2)<br/>height: 2"))
    B(("(3)<br/>height: 2"))
    C(("(4)<br/>height: 1"))
    D(("(7)<br/>height: 1"))
    R --> A
    R --> B
    A --> C
    B --> D
    style R fill:#fef9c3,stroke:#f59e0b
```

<p align="center"><strong>Stateful postorder for diameter — each call returns its <em>height</em> to the parent (so the parent can compute its own); separately, each call updates a global <em>maxDiameter</em> with <code>leftHeight + rightHeight</code>. Two answers per call, one traversal.</strong></p>

> **Why is the global state safe to share?** Because postorder updates are *monotone* — typically a `max` or `min` or a counter `+= 1`. Order of updates doesn't matter, and there's no need for "undo" because no later subtree's result can invalidate an earlier one's. This is the structural difference from stateful preorder (lesson 9), where state had to be pushed and popped to keep sibling subtrees from polluting each other.

## Generic pattern in 10 languages

The template — diameter of a tree, since it's the canonical example.

<div class="lang-tabs">

```pseudocode
function diameter(root):
    best ← 0                            # global state updated during traversal
    function height(node):
        if node = null: return 0
        l ← height(node.left)
        r ← height(node.right)
        best ← max(best, l + r)         # diameter through this node = left height + right height
        return 1 + max(l, r)            # height returned to parent
    height(root)
    return best
```

```python,editable
from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right

def diameter(root: Optional[TreeNode]) -> int:
    best = [0]                                      # global state (in a list to mutate from inner fn)
    def height(node):
        if node is None: return 0
        l = height(node.left); r = height(node.right)
        best[0] = max(best[0], l + r)               # update global state (diameter)
        return 1 + max(l, r)                        # return height to parent
    height(root)
    return best[0]
```

```java,editable
static int best;
static int height(TreeNode n) {
    if (n == null) return 0;
    int l = height(n.left), r = height(n.right);
    best = Math.max(best, l + r);                   // update global state
    return 1 + Math.max(l, r);                      // return height
}
public static int diameter(TreeNode root) {
    best = 0;
    height(root);
    return best;
}
```

```c,editable
static int g_best;
int height(TreeNode *n) {
    if (!n) return 0;
    int l = height(n->left), r = height(n->right);
    if (l + r > g_best) g_best = l + r;
    return 1 + (l > r ? l : r);
}
int diameter(TreeNode *root) { g_best = 0; height(root); return g_best; }
```

```cpp,editable
int g_best;
int height(TreeNode *n) {
    if (!n) return 0;
    int l = height(n->left), r = height(n->right);
    g_best = std::max(g_best, l + r);
    return 1 + std::max(l, r);
}
int diameter(TreeNode *root) { g_best = 0; height(root); return g_best; }
```

```scala,editable
def diameter(root: TreeNode): Int = {
  var best = 0
  def height(n: TreeNode): Int = {
    if (n == null) return 0
    val l = height(n.left); val r = height(n.right)
    best = math.max(best, l + r)
    1 + math.max(l, r)
  }
  height(root); best
}
```

```typescript,editable
function diameter(root: TreeNode | null): number {
    let best = 0;
    function height(n: TreeNode | null): number {
        if (!n) return 0;
        const l = height(n.left), r = height(n.right);
        best = Math.max(best, l + r);
        return 1 + Math.max(l, r);
    }
    height(root); return best;
}
```

```go,editable
func diameter(root *TreeNode) int {
    best := 0
    var height func(*TreeNode) int
    height = func(n *TreeNode) int {
        if n == nil { return 0 }
        l, r := height(n.Left), height(n.Right)
        if l + r > best { best = l + r }
        if l > r { return 1 + l }
        return 1 + r
    }
    height(root)
    return best
}
```

```rust,editable
fn dia_height(node: &Option<Box<TreeNode>>, best: &mut i32) -> i32 {
    match node {
        None => 0,
        Some(n) => {
            let l = dia_height(&n.left,  best);
            let r = dia_height(&n.right, best);
            *best = std::cmp::max(*best, l + r);
            1 + std::cmp::max(l, r)
        }
    }
}
pub fn diameter(root: &Option<Box<TreeNode>>) -> i32 {
    let mut best = 0;
    dia_height(root, &mut best);
    best
}
```

</div>

***

# How to recognise it

The pattern fits when:

- The answer at each node depends on **both children's results** (postorder), *and*
- The "best result anywhere in the tree" might differ from "the result feeding up to my parent". The two are *related* but not the *same* number.

Concrete cues:

- *"Find the longest / largest / maximum X in the tree"* — track the global best.
- *"Count nodes / subtrees / paths satisfying property Y"* — track a global counter.
- *"The path can start and end anywhere"* — definitely "track best while feeding height up".
- *"Compute X for every subtree, then find the most-frequent / largest / smallest"* — track globals across all subtree computations.

Anti-pattern: if a single returned value suffices (like simple sum-of-leaves or height), use the *stateless* postorder. If you really only need information from above (no global), use the preorder patterns instead.

***

# Problem 1 — Diameter of tree

> The diameter is the longest *path* (in edges) between any two nodes. The path may pass through any node — not necessarily the root.

Already covered in the generic skeleton above. Each call returns *height* (number of nodes downward); each call updates `best = max(best, leftHeight + rightHeight)` (path edges through this node). Final answer is the global `best`.

The implementation is exactly the generic template. The lesson here is *what to choose* as the feed-up vs the global, not how to type the code.

***

# Problem 2 — Descendants sum count

> Count nodes whose value equals the sum of *all* values in their subtree below them (not including themselves).

Each subtree returns its sum (so the parent can compute its own); along the way, each call updates a global counter if `node.val == leftSum + rightSum`.

## Solution

<div class="lang-tabs">

```pseudocode
function descendantsSumCount(root):
    count ← 0
    function sum_(n):
        if n = null: return 0
        l ← sum_(n.left); r ← sum_(n.right)
        if n.val = l + r: count ← count + 1   # node equals sum of its descendants
        return n.val + l + r
    sum_(root)
    return count
```

```python,editable
def descendants_sum_count(root):
    count = [0]
    def sum_(n):
        if n is None: return 0
        l = sum_(n.left); r = sum_(n.right)
        if n.val == l + r: count[0] += 1
        return n.val + l + r
    sum_(root)
    return count[0]
```

```java,editable
static int dscCount;
static int dscSum(TreeNode n) {
    if (n == null) return 0;
    int l = dscSum(n.left), r = dscSum(n.right);
    if (n.val == l + r) dscCount++;
    return n.val + l + r;
}
public static int descendantsSumCount(TreeNode root) {
    dscCount = 0;
    dscSum(root);
    return dscCount;
}
```

```c,editable
static int g_dsc_count;
int dsc_sum(TreeNode *n) {
    if (!n) return 0;
    int l = dsc_sum(n->left), r = dsc_sum(n->right);
    if (n->val == l + r) g_dsc_count++;
    return n->val + l + r;
}
int descendants_sum_count(TreeNode *root) { g_dsc_count = 0; dsc_sum(root); return g_dsc_count; }
```

```cpp,editable
int g_count;
int dscSum(TreeNode *n) {
    if (!n) return 0;
    int l = dscSum(n->left), r = dscSum(n->right);
    if (n->val == l + r) g_count++;
    return n->val + l + r;
}
int descendantsSumCount(TreeNode *root) { g_count = 0; dscSum(root); return g_count; }
```

```scala,editable
def descendantsSumCount(root: TreeNode): Int = {
  var count = 0
  def go(n: TreeNode): Int = {
    if (n == null) return 0
    val l = go(n.left); val r = go(n.right)
    if (n.value == l + r) count += 1
    n.value + l + r
  }
  go(root); count
}
```

```typescript,editable
function descendantsSumCount(root: TreeNode | null): number {
    let count = 0;
    function go(n: TreeNode | null): number {
        if (!n) return 0;
        const l = go(n.left), r = go(n.right);
        if (n.val === l + r) count++;
        return n.val + l + r;
    }
    go(root); return count;
}
```

```go,editable
func descendantsSumCount(root *TreeNode) int {
    count := 0
    var go_ func(*TreeNode) int
    go_ = func(n *TreeNode) int {
        if n == nil { return 0 }
        l, r := go_(n.Left), go_(n.Right)
        if n.Val == l + r { count++ }
        return n.Val + l + r
    }
    go_(root); return count
}
```

```rust,editable
fn dsc_go(node: &Option<Box<TreeNode>>, count: &mut i32) -> i32 {
    match node {
        None => 0,
        Some(n) => {
            let l = dsc_go(&n.left,  count);
            let r = dsc_go(&n.right, count);
            if n.val == l + r { *count += 1; }
            n.val + l + r
        }
    }
}
pub fn descendants_sum_count(root: &Option<Box<TreeNode>>) -> i32 {
    let mut count = 0;
    dsc_go(root, &mut count);
    count
}
```

</div>

***

# Problem 3 — Distribute coins

> Each node has `node.val` coins. Total coins equal total nodes. A move is moving 1 coin between two adjacent nodes. Return the minimum number of moves so every node ends with exactly 1 coin.

The trick: at every node, define *excess* = `(coins received from below) + node.val - 1`. If excess > 0, that many coins must flow *up* to the parent. If excess < 0, that many coins must flow *down* from the parent. Either way, the *absolute value* of excess equals the number of coin moves on the *edge to the parent*.

So sum `|leftExcess|` and `|rightExcess|` at every node — that's the total moves through this node's two outgoing edges to its children.

## Solution

<div class="lang-tabs">

```pseudocode
function distributeCoins(root):
    moves ← 0
    function excess(n):
        if n = null: return 0
        l ← excess(n.left); r ← excess(n.right)
        moves ← moves + |l| + |r|   # each unit of excess flowing through an edge costs 1 move
        return l + r + n.val − 1    # excess at this node (positive = surplus, negative = deficit)
    excess(root)
    return moves
```

```python,editable
def distribute_coins(root):
    moves = [0]
    def excess(n):
        if n is None: return 0
        l = excess(n.left); r = excess(n.right)
        moves[0] += abs(l) + abs(r)
        return l + r + n.val - 1
    excess(root)
    return moves[0]
```

```java,editable
static int g_moves;
static int excess(TreeNode n) {
    if (n == null) return 0;
    int l = excess(n.left), r = excess(n.right);
    g_moves += Math.abs(l) + Math.abs(r);
    return l + r + n.val - 1;
}
public static int distributeCoins(TreeNode root) {
    g_moves = 0; excess(root); return g_moves;
}
```

```c,editable
static int g_moves;
int excess(TreeNode *n) {
    if (!n) return 0;
    int l = excess(n->left), r = excess(n->right);
    g_moves += (l < 0 ? -l : l) + (r < 0 ? -r : r);
    return l + r + n->val - 1;
}
int distribute_coins(TreeNode *root) { g_moves = 0; excess(root); return g_moves; }
```

```cpp,editable
int g_moves;
int excess(TreeNode *n) {
    if (!n) return 0;
    int l = excess(n->left), r = excess(n->right);
    g_moves += std::abs(l) + std::abs(r);
    return l + r + n->val - 1;
}
int distributeCoins(TreeNode *root) { g_moves = 0; excess(root); return g_moves; }
```

```scala,editable
def distributeCoins(root: TreeNode): Int = {
  var moves = 0
  def excess(n: TreeNode): Int = {
    if (n == null) return 0
    val l = excess(n.left); val r = excess(n.right)
    moves += math.abs(l) + math.abs(r)
    l + r + n.value - 1
  }
  excess(root); moves
}
```

```typescript,editable
function distributeCoins(root: TreeNode | null): number {
    let moves = 0;
    function excess(n: TreeNode | null): number {
        if (!n) return 0;
        const l = excess(n.left), r = excess(n.right);
        moves += Math.abs(l) + Math.abs(r);
        return l + r + n.val - 1;
    }
    excess(root); return moves;
}
```

```go,editable
func distributeCoins(root *TreeNode) int {
    moves := 0
    abs := func(x int) int { if x < 0 { return -x }; return x }
    var excess func(*TreeNode) int
    excess = func(n *TreeNode) int {
        if n == nil { return 0 }
        l, r := excess(n.Left), excess(n.Right)
        moves += abs(l) + abs(r)
        return l + r + n.Val - 1
    }
    excess(root)
    return moves
}
```

```rust,editable
fn dc_excess(node: &Option<Box<TreeNode>>, moves: &mut i32) -> i32 {
    match node {
        None => 0,
        Some(n) => {
            let l = dc_excess(&n.left,  moves);
            let r = dc_excess(&n.right, moves);
            *moves += l.abs() + r.abs();
            l + r + n.val - 1
        }
    }
}
pub fn distribute_coins(root: &Option<Box<TreeNode>>) -> i32 {
    let mut moves = 0;
    dc_excess(root, &mut moves);
    moves
}
```

</div>

***

# Problem 4 — Most frequent subtree sum

> The "subtree sum" of a node is the sum of values in its subtree. Return all subtree sums whose frequency in the tree is highest.

Each call returns its subtree sum (so the parent can compute its own); along the way, increment a frequency map and update a `maxFreq` tracker. After the recursion, scan the frequency map for entries equal to `maxFreq`.

## Solution

<div class="lang-tabs">

```pseudocode
function mostFrequentSubtreeSum(root):
    if root = null: return empty list
    freq  ← empty Map: sum → count
    maxF  ← 0
    function go(n):
        if n = null: return 0
        s ← n.val + go(n.left) + go(n.right)
        freq[s] ← freq[s] + 1
        if freq[s] > maxF: maxF ← freq[s]
        return s
    go(root)
    return all keys k in freq where freq[k] = maxF
```

```python,editable
def most_frequent_subtree_sum(root):
    if root is None: return []
    freq = {}
    max_f = [0]
    def go(n):
        if n is None: return 0
        s = n.val + go(n.left) + go(n.right)
        freq[s] = freq.get(s, 0) + 1
        if freq[s] > max_f[0]: max_f[0] = freq[s]
        return s
    go(root)
    return [k for k, v in freq.items() if v == max_f[0]]
```

```java,editable
static Map<Integer, Integer> g_freq;
static int g_maxFreq;
static int subSum(TreeNode n) {
    if (n == null) return 0;
    int s = n.val + subSum(n.left) + subSum(n.right);
    int c = g_freq.merge(s, 1, Integer::sum);
    if (c > g_maxFreq) g_maxFreq = c;
    return s;
}
public static List<Integer> mostFrequentSubtreeSum(TreeNode root) {
    g_freq = new HashMap<>(); g_maxFreq = 0;
    if (root == null) return new ArrayList<>();
    subSum(root);
    List<Integer> out = new ArrayList<>();
    for (Map.Entry<Integer, Integer> e : g_freq.entrySet())
        if (e.getValue() == g_maxFreq) out.add(e.getKey());
    return out;
}
```

```c,editable
// (omitted for brevity — C lacks a hash map in stdlib; implement an open-addressing
//  hash with the same algorithm)
```

```cpp,editable
#include <unordered_map>
std::unordered_map<int,int> g_freq; int g_maxFreq;
int subSum(TreeNode *n) {
    if (!n) return 0;
    int s = n->val + subSum(n->left) + subSum(n->right);
    int c = ++g_freq[s];
    if (c > g_maxFreq) g_maxFreq = c;
    return s;
}
std::vector<int> mostFrequentSubtreeSum(TreeNode *root) {
    g_freq.clear(); g_maxFreq = 0;
    if (!root) return {};
    subSum(root);
    std::vector<int> out;
    for (auto& [k, v] : g_freq) if (v == g_maxFreq) out.push_back(k);
    return out;
}
```

```scala,editable
def mostFrequentSubtreeSum(root: TreeNode): List[Int] = {
  if (root == null) return Nil
  val freq = scala.collection.mutable.Map[Int, Int]()
  var maxFreq = 0
  def go(n: TreeNode): Int = {
    if (n == null) return 0
    val s = n.value + go(n.left) + go(n.right)
    freq(s) = freq.getOrElse(s, 0) + 1
    if (freq(s) > maxFreq) maxFreq = freq(s)
    s
  }
  go(root)
  freq.collect { case (k, v) if v == maxFreq => k }.toList
}
```

```typescript,editable
function mostFrequentSubtreeSum(root: TreeNode | null): number[] {
    if (!root) return [];
    const freq = new Map<number, number>(); let maxFreq = 0;
    function go(n: TreeNode | null): number {
        if (!n) return 0;
        const s = n.val + go(n.left) + go(n.right);
        const c = (freq.get(s) || 0) + 1;
        freq.set(s, c);
        if (c > maxFreq) maxFreq = c;
        return s;
    }
    go(root);
    const out: number[] = [];
    for (const [k, v] of freq) if (v === maxFreq) out.push(k);
    return out;
}
```

```go,editable
func mostFrequentSubtreeSum(root *TreeNode) []int {
    if root == nil { return nil }
    freq := map[int]int{}
    maxFreq := 0
    var go_ func(*TreeNode) int
    go_ = func(n *TreeNode) int {
        if n == nil { return 0 }
        s := n.Val + go_(n.Left) + go_(n.Right)
        freq[s]++
        if freq[s] > maxFreq { maxFreq = freq[s] }
        return s
    }
    go_(root)
    var out []int
    for k, v := range freq {
        if v == maxFreq { out = append(out, k) }
    }
    return out
}
```

```rust,editable
use std::collections::HashMap;
fn mfs_go(node: &Option<Box<TreeNode>>, freq: &mut HashMap<i32, i32>, mx: &mut i32) -> i32 {
    match node {
        None => 0,
        Some(n) => {
            let s = n.val + mfs_go(&n.left, freq, mx) + mfs_go(&n.right, freq, mx);
            let c = freq.entry(s).or_insert(0); *c += 1;
            if *c > *mx { *mx = *c; }
            s
        }
    }
}
pub fn most_frequent_subtree_sum(root: &Option<Box<TreeNode>>) -> Vec<i32> {
    if root.is_none() { return Vec::new(); }
    let mut freq = HashMap::new(); let mut mx = 0;
    mfs_go(root, &mut freq, &mut mx);
    freq.iter().filter_map(|(&k, &v)| if v == mx { Some(k) } else { None }).collect()
}
```

</div>

***

# Problem 5 — Longest monotonic path

> A *monotonic* path is one where every node has the same value. Return the longest such path's length (number of edges).

Same shape as diameter, with one twist: the height contribution from a child only counts if the child has the same value as the current node.

## Solution

<div class="lang-tabs">

```pseudocode
function longestMonotonicPath(root):
    best ← 0
    function go(n):
        if n = null: return 0
        l ← go(n.left); r ← go(n.right)
        la ← l + 1 if n.left  ≠ null AND n.left.val  = n.val else 0
        ra ← r + 1 if n.right ≠ null AND n.right.val = n.val else 0
        best ← max(best, la + ra)   # longest path through this node
        return max(la, ra)          # longest arm returned to parent
    go(root)
    return best
```

```python,editable
def longest_monotonic_path(root):
    best = [0]
    def go(n):
        if n is None: return 0
        l = go(n.left); r = go(n.right)
        la = l + 1 if n.left  and n.left.val  == n.val else 0
        ra = r + 1 if n.right and n.right.val == n.val else 0
        best[0] = max(best[0], la + ra)
        return max(la, ra)
    go(root)
    return best[0]
```

```java,editable
static int g_lmpBest;
static int lmp(TreeNode n) {
    if (n == null) return 0;
    int l = lmp(n.left), r = lmp(n.right);
    int la = (n.left  != null && n.left.val  == n.val) ? l + 1 : 0;
    int ra = (n.right != null && n.right.val == n.val) ? r + 1 : 0;
    g_lmpBest = Math.max(g_lmpBest, la + ra);
    return Math.max(la, ra);
}
public static int longestMonotonicPath(TreeNode root) {
    g_lmpBest = 0; lmp(root); return g_lmpBest;
}
```

```c,editable
static int g_lmp_best;
int lmp(TreeNode *n) {
    if (!n) return 0;
    int l = lmp(n->left), r = lmp(n->right);
    int la = (n->left  && n->left->val  == n->val) ? l + 1 : 0;
    int ra = (n->right && n->right->val == n->val) ? r + 1 : 0;
    if (la + ra > g_lmp_best) g_lmp_best = la + ra;
    return la > ra ? la : ra;
}
int longest_monotonic_path(TreeNode *root) { g_lmp_best = 0; lmp(root); return g_lmp_best; }
```

```cpp,editable
int g_best;
int lmp(TreeNode *n) {
    if (!n) return 0;
    int l = lmp(n->left), r = lmp(n->right);
    int la = (n->left  && n->left->val  == n->val) ? l + 1 : 0;
    int ra = (n->right && n->right->val == n->val) ? r + 1 : 0;
    g_best = std::max(g_best, la + ra);
    return std::max(la, ra);
}
int longestMonotonicPath(TreeNode *root) { g_best = 0; lmp(root); return g_best; }
```

```scala,editable
def longestMonotonicPath(root: TreeNode): Int = {
  var best = 0
  def go(n: TreeNode): Int = {
    if (n == null) return 0
    val l = go(n.left); val r = go(n.right)
    val la = if (n.left  != null && n.left.value  == n.value) l + 1 else 0
    val ra = if (n.right != null && n.right.value == n.value) r + 1 else 0
    best = math.max(best, la + ra)
    math.max(la, ra)
  }
  go(root); best
}
```

```typescript,editable
function longestMonotonicPath(root: TreeNode | null): number {
    let best = 0;
    function go(n: TreeNode | null): number {
        if (!n) return 0;
        const l = go(n.left), r = go(n.right);
        const la = (n.left  && n.left.val  === n.val) ? l + 1 : 0;
        const ra = (n.right && n.right.val === n.val) ? r + 1 : 0;
        best = Math.max(best, la + ra);
        return Math.max(la, ra);
    }
    go(root); return best;
}
```

```go,editable
func longestMonotonicPath(root *TreeNode) int {
    best := 0
    var go_ func(*TreeNode) int
    go_ = func(n *TreeNode) int {
        if n == nil { return 0 }
        l, r := go_(n.Left), go_(n.Right)
        la, ra := 0, 0
        if n.Left  != nil && n.Left.Val  == n.Val { la = l + 1 }
        if n.Right != nil && n.Right.Val == n.Val { ra = r + 1 }
        if la + ra > best { best = la + ra }
        if la > ra { return la }
        return ra
    }
    go_(root); return best
}
```

```rust,editable
fn lmp_go(node: &Option<Box<TreeNode>>, best: &mut i32) -> i32 {
    match node {
        None => 0,
        Some(n) => {
            let l = lmp_go(&n.left,  best);
            let r = lmp_go(&n.right, best);
            let la = match &n.left  { Some(c) if c.val == n.val => l + 1, _ => 0 };
            let ra = match &n.right { Some(c) if c.val == n.val => r + 1, _ => 0 };
            *best = std::cmp::max(*best, la + ra);
            std::cmp::max(la, ra)
        }
    }
}
pub fn longest_monotonic_path(root: &Option<Box<TreeNode>>) -> i32 {
    let mut best = 0;
    lmp_go(root, &mut best);
    best
}
```

</div>

***

# Problem 6 — Monotonic subtree count

> Count subtrees that are *entirely* mono-valued — every node in the subtree has the same value.

Each call returns whether *its* subtree is mono-valued; along the way, increment a global counter when it is. A subtree is mono-valued iff: both children's subtrees are mono-valued, *and* both children (if they exist) have the same value as the current node.

## Solution

<div class="lang-tabs">

```pseudocode
function monotonicSubtreeCount(root):
    count ← 0
    function go(n):
        if n = null: return true
        lOk ← go(n.left); rOk ← go(n.right)
        if NOT lOk OR NOT rOk: return false   # subtree already broken
        if n.left  ≠ null AND n.left.val  ≠ n.val: return false
        if n.right ≠ null AND n.right.val ≠ n.val: return false
        count ← count + 1
        return true
    go(root)
    return count
```

```python,editable
def monotonic_subtree_count(root):
    count = [0]
    def go(n):
        if n is None: return True
        l_ok = go(n.left); r_ok = go(n.right)
        if not l_ok or not r_ok: return False
        if n.left  and n.left.val  != n.val: return False
        if n.right and n.right.val != n.val: return False
        count[0] += 1
        return True
    go(root)
    return count[0]
```

```java,editable
static int g_msCount;
static boolean ms(TreeNode n) {
    if (n == null) return true;
    boolean l = ms(n.left), r = ms(n.right);
    if (!l || !r) return false;
    if (n.left  != null && n.left.val  != n.val) return false;
    if (n.right != null && n.right.val != n.val) return false;
    g_msCount++;
    return true;
}
public static int monotonicSubtreeCount(TreeNode root) {
    g_msCount = 0; ms(root); return g_msCount;
}
```

```c,editable
static int g_count;
int ms(TreeNode *n) {
    if (!n) return 1;
    int l = ms(n->left), r = ms(n->right);
    if (!l || !r) return 0;
    if (n->left  && n->left->val  != n->val) return 0;
    if (n->right && n->right->val != n->val) return 0;
    g_count++;
    return 1;
}
int monotonic_subtree_count(TreeNode *root) { g_count = 0; ms(root); return g_count; }
```

```cpp,editable
int g_count;
bool ms(TreeNode *n) {
    if (!n) return true;
    bool l = ms(n->left), r = ms(n->right);
    if (!l || !r) return false;
    if (n->left  && n->left->val  != n->val) return false;
    if (n->right && n->right->val != n->val) return false;
    g_count++;
    return true;
}
int monotonicSubtreeCount(TreeNode *root) { g_count = 0; ms(root); return g_count; }
```

```scala,editable
def monotonicSubtreeCount(root: TreeNode): Int = {
  var count = 0
  def go(n: TreeNode): Boolean = {
    if (n == null) return true
    val lOk = go(n.left); val rOk = go(n.right)
    if (!lOk || !rOk) return false
    if (n.left  != null && n.left.value  != n.value) return false
    if (n.right != null && n.right.value != n.value) return false
    count += 1
    true
  }
  go(root); count
}
```

```typescript,editable
function monotonicSubtreeCount(root: TreeNode | null): number {
    let count = 0;
    function go(n: TreeNode | null): boolean {
        if (!n) return true;
        const lOk = go(n.left), rOk = go(n.right);
        if (!lOk || !rOk) return false;
        if (n.left  && n.left.val  !== n.val) return false;
        if (n.right && n.right.val !== n.val) return false;
        count++; return true;
    }
    go(root); return count;
}
```

```go,editable
func monotonicSubtreeCount(root *TreeNode) int {
    count := 0
    var go_ func(*TreeNode) bool
    go_ = func(n *TreeNode) bool {
        if n == nil { return true }
        lOk, rOk := go_(n.Left), go_(n.Right)
        if !lOk || !rOk { return false }
        if n.Left  != nil && n.Left.Val  != n.Val { return false }
        if n.Right != nil && n.Right.Val != n.Val { return false }
        count++; return true
    }
    go_(root); return count
}
```

```rust,editable
fn ms_go(node: &Option<Box<TreeNode>>, count: &mut i32) -> bool {
    match node {
        None => true,
        Some(n) => {
            let l_ok = ms_go(&n.left,  count);
            let r_ok = ms_go(&n.right, count);
            if !l_ok || !r_ok { return false; }
            if let Some(l) = &n.left  { if l.val != n.val { return false; } }
            if let Some(r) = &n.right { if r.val != n.val { return false; } }
            *count += 1;
            true
        }
    }
}
pub fn monotonic_subtree_count(root: &Option<Box<TreeNode>>) -> i32 {
    let mut count = 0;
    ms_go(root, &mut count);
    count
}
```

</div>

***

# Problem 7 — Path sum count

> Given a `target`, count the number of *downward* paths (parent-to-descendant only) whose values sum to `target`.

This problem is interesting because it combines *both* preorder push-pop *and* postorder accumulation. The classic O(N) trick uses a **prefix-sum hash map**: as you descend, track the running sum from the root; the number of valid paths *ending at the current node* equals `prefixSumCount[currentSum - target]`. As you backtrack (postorder return), undo the prefix-sum count for this node.

This is a hybrid pattern, but it's traditionally taught with the postorder patterns because the *answer accumulates* upward like the others.

## Solution

<div class="lang-tabs">

```pseudocode
function pathSumCount(root, target):
    prefix ← Map: {0 → 1}    # empty prefix has sum 0
    answer ← 0
    function go(n, run):
        if n = null: return
        run ← run + n.val
        answer ← answer + prefix.get(run − target, default 0)   # how many earlier prefixes make a valid subpath
        prefix[run] ← prefix.get(run, 0) + 1
        go(n.left, run); go(n.right, run)
        prefix[run] ← prefix[run] − 1   # undo on backtrack
        if prefix[run] = 0: remove run from prefix
    go(root, 0)
    return answer
```

```python,editable
def path_sum_count(root, target):
    prefix = {0: 1}                              # base: empty prefix has sum 0
    answer = [0]
    def go(n, run):
        if n is None: return
        run += n.val
        answer[0] += prefix.get(run - target, 0)
        prefix[run] = prefix.get(run, 0) + 1
        go(n.left, run); go(n.right, run)
        prefix[run] -= 1
        if prefix[run] == 0: del prefix[run]
    go(root, 0)
    return answer[0]
```

```java,editable
static Map<Integer, Integer> g_prefix;
static int g_answer;
static void psc(TreeNode n, int target, int run) {
    if (n == null) return;
    run += n.val;
    g_answer += g_prefix.getOrDefault(run - target, 0);
    g_prefix.merge(run, 1, Integer::sum);
    psc(n.left, target, run); psc(n.right, target, run);
    if (g_prefix.get(run) == 1) g_prefix.remove(run);
    else g_prefix.merge(run, -1, Integer::sum);
}
public static int pathSumCount(TreeNode root, int target) {
    g_prefix = new HashMap<>(); g_prefix.put(0, 1); g_answer = 0;
    psc(root, target, 0);
    return g_answer;
}
```

```c,editable
// (omitted — needs an int->int hash map; use the same algorithm as above
//  with a bespoke open-addressing table)
```

```cpp,editable
#include <unordered_map>
std::unordered_map<int,int> g_pre; int g_ans;
void psc(TreeNode *n, int target, int run) {
    if (!n) return;
    run += n->val;
    g_ans += g_pre[run - target];
    g_pre[run]++;
    psc(n->left, target, run); psc(n->right, target, run);
    if (--g_pre[run] == 0) g_pre.erase(run);
}
int pathSumCount(TreeNode *root, int target) {
    g_pre.clear(); g_pre[0] = 1; g_ans = 0;
    psc(root, target, 0);
    return g_ans;
}
```

```scala,editable
def pathSumCount(root: TreeNode, target: Int): Int = {
  val prefix = scala.collection.mutable.Map[Int, Int](0 -> 1)
  var answer = 0
  def go(n: TreeNode, run: Int): Unit = {
    if (n == null) return
    val newRun = run + n.value
    answer += prefix.getOrElse(newRun - target, 0)
    prefix(newRun) = prefix.getOrElse(newRun, 0) + 1
    go(n.left,  newRun); go(n.right, newRun)
    val c = prefix(newRun) - 1
    if (c == 0) prefix.remove(newRun) else prefix(newRun) = c
  }
  go(root, 0); answer
}
```

```typescript,editable
function pathSumCount(root: TreeNode | null, target: number): number {
    const prefix = new Map<number, number>([[0, 1]]); let answer = 0;
    function go(n: TreeNode | null, run: number): void {
        if (!n) return;
        run += n.val;
        answer += prefix.get(run - target) || 0;
        prefix.set(run, (prefix.get(run) || 0) + 1);
        go(n.left, run); go(n.right, run);
        const c = (prefix.get(run) || 0) - 1;
        if (c === 0) prefix.delete(run); else prefix.set(run, c);
    }
    go(root, 0); return answer;
}
```

```go,editable
func pathSumCount(root *TreeNode, target int) int {
    prefix := map[int]int{0: 1}
    answer := 0
    var go_ func(*TreeNode, int)
    go_ = func(n *TreeNode, run int) {
        if n == nil { return }
        run += n.Val
        answer += prefix[run - target]
        prefix[run]++
        go_(n.Left, run); go_(n.Right, run)
        prefix[run]--
        if prefix[run] == 0 { delete(prefix, run) }
    }
    go_(root, 0); return answer
}
```

```rust,editable
use std::collections::HashMap;
fn psc_go(node: &Option<Box<TreeNode>>, target: i32, run: i32, prefix: &mut HashMap<i32, i32>, ans: &mut i32) {
    if let Some(n) = node {
        let new_run = run + n.val;
        *ans += *prefix.get(&(new_run - target)).unwrap_or(&0);
        *prefix.entry(new_run).or_insert(0) += 1;
        psc_go(&n.left,  target, new_run, prefix, ans);
        psc_go(&n.right, target, new_run, prefix, ans);
        let c = prefix.get_mut(&new_run).unwrap();
        *c -= 1;
        if *c == 0 { prefix.remove(&new_run); }
    }
}
pub fn path_sum_count(root: &Option<Box<TreeNode>>, target: i32) -> i32 {
    let mut prefix = HashMap::new(); prefix.insert(0, 1);
    let mut answer = 0;
    psc_go(root, target, 0, &mut prefix, &mut answer);
    answer
}
```

</div>

***

## Final Takeaway

Stateful postorder is the most *flexible* of the binary-tree patterns — it absorbs almost every "compute X for every subtree, also track a global Y" question. Three things to walk away with:

1. **Two channels per call.** Decide *what to return to the parent* and *what to update globally*. They're rarely the same number. Diameter returns *height*, tracks *diameter*. Distribute coins returns *excess flow*, tracks *moves*. Most-frequent subtree sum returns *sum*, tracks *frequency map + max frequency*. Recognise the duality and the algorithm writes itself.
2. **Globals are safe in postorder, dangerous in preorder.** In stateful preorder you must push/pop because sibling subtrees would otherwise see each other's state. In stateful postorder the global is *monotonically* updated (max, count, accumulate) and order doesn't matter — no undo needed. This is the structural distinction between the two stateful flavours.
3. **Prefix-sum hashing is a force multiplier.** The path-sum-count problem shows how a *combined* preorder-push-pop + postorder-aggregate + prefix-sum-hash can solve in O(N) what a naive O(N²) per-node "look at every ancestor" would do. The same technique recurs in array problems (subarray sum equals K) — internalise the idea.

> *Coming up — the chapter shifts focus from "compute X over the whole tree" to <strong>root-to-leaf path</strong> problems. Where the postorder patterns thought about subtrees, the next two lessons focus on whole paths from the root down to leaves: counting them, listing them, comparing them. The same backtracking template you saw in stateful preorder reappears, but specialised for the path-as-a-unit framing.*
