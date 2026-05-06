# 18. Practice: Mix Traversals

## The Hook

Eleven patterns into the chapter, you've learned every recursion shape that binary trees need: preorder (stateless and stateful), postorder (stateless and stateful), root-to-leaf (stateless and stateful), level-order (one-dimensional and column-based), LCA, and simultaneous traversal. Each pattern by itself answers a class of problems with one cohesive recipe.

But interview questions and production code rarely fit a single pattern *cleanly*. The interesting problems are usually *compositions* — they take a piece of one pattern, glue it to a piece of another, and ask you to produce a single coherent answer that no individual pattern could give in one pass. The skill at this level isn't memorising more patterns — it's *recognising* which patterns combine, in what order, to solve a question you've never seen before.

This capstone lesson works through one such problem — the **boundary traversal** of a binary tree — to demonstrate the composition mindset. The boundary traversal asks you to walk *anticlockwise around the outside of the tree*, returning the root, then everything on the left edge top-to-bottom, then every leaf left-to-right, then everything on the right edge bottom-to-top. There's no single pattern that does this — but the problem decomposes cleanly into *three* sub-walks, each a tiny variation of patterns you already know. Stitch the three together and you have a single linear-time, single-pass-equivalent algorithm.

This kind of decomposition is what separates "I know binary trees" from "I can solve any binary-tree question I've never seen before". Practice it on this problem and the skill transfers to dozens of other multi-pattern compositions.

---

## Table of contents

1. [Boundary traversal — the problem](#boundary-traversal--the-problem)
2. [Decomposing into three pieces](#decomposing-into-three-pieces)
3. [Solution](#solution)

***

# Boundary traversal — the problem

> Given the root of a binary tree, return the *boundary* of the tree — the values you'd encounter walking anticlockwise around the outside of the tree, starting from the root.
>
> The boundary consists of:
>
> 1. The **root**.
> 2. The **left boundary** — every node on the leftmost path from the root downward, *excluding* leaves (we'll catch them in step 3). The leftmost path is "go left if left child exists, else right" — so it threads down even when the strict left-child runs out.
> 3. All **leaves**, left-to-right.
> 4. The **right boundary** in *reverse* — every node on the rightmost path from the root downward (excluding leaves), then bottom-to-top.

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
    R(("1<br/>(root)"))
    A(("2<br/>(left)"))
    B(("3<br/>(right)"))
    C(("4<br/>(leaf)"))
    D(("7<br/>(leaf)"))
    R --> A
    R --> B
    A --> C
    B --> D
    style R fill:#fef9c3,stroke:#f59e0b
    style A fill:#dbeafe,stroke:#3b82f6
    style B fill:#ede9fe,stroke:#7c3aed
    style C fill:#dcfce7,stroke:#22c55e
    style D fill:#dcfce7,stroke:#22c55e
```

<p align="center"><strong>Example tree — boundary (anticlockwise from root): <strong><code>1 → 2 → 4 → 7 → 3</code></strong>. Yellow root, blue left edge, green leaves left-to-right, purple right edge in reverse.</strong></p>

The challenge is that *the same node should not appear twice*. The root is *not* on the left or right boundary. A leaf that happens to be on the left boundary should be reported in the leaves step, not the left-boundary step. So the four pieces have to be carved out carefully to avoid double-counting.

> *Predict before reading on — for a single-node tree (just the root), what should the boundary be?*
>
> Just the root, `[1]`. The left and right boundaries are empty (no left or right edge to walk); the leaves step would visit the root, but we've already added it. *Edge cases like this are exactly where compositions break*; check that your solution handles single-node, all-left-skew, all-right-skew, and an empty tree correctly.

***

# Decomposing into three pieces

Each piece is a tiny variation of a pattern you've already seen.

## Piece 1 — Left boundary (preorder-style descent, skip leaves)

A modified preorder: visit the node *before* descending, descend left if possible else right, stop when we hit a leaf.

This is essentially the **stateless preorder** pattern (lesson 8) with two tweaks: we don't visit leaves (they'll be picked up by piece 3), and the descent isn't into both children — it's "left if exists, else right".

```text
leftBoundary(node, out):
  if node is null or node is a leaf: return
  out.push(node.val)
  if node.left:  leftBoundary(node.left,  out)
  else:          leftBoundary(node.right, out)
```

## Piece 2 — Leaves (stateless preorder, leaves only)

A standard depth-first walk that emits only at leaves — the **stateless postorder** pattern (lesson 10) specialised to "do work only at leaves".

```text
leaves(node, out):
  if node is null: return
  if node is a leaf: out.push(node.val); return
  leaves(node.left,  out)
  leaves(node.right, out)
```

## Piece 3 — Right boundary in reverse (postorder-style descent)

A modified *post*order: descend right if possible else left, *then* visit on the way back up. By visiting after descending, we naturally produce the right edge in reverse order without needing a separate reversal pass.

```text
rightBoundary(node, out):
  if node is null or node is a leaf: return
  if node.right: rightBoundary(node.right, out)
  else:          rightBoundary(node.left,  out)
  out.push(node.val)             # post-order visit gives reverse order for free
```

## Piece 4 — Stitching it together

```text
boundary(root):
  if root is null: return []
  out = [root.val]
  leftBoundary(root.left, out)         # left edge, top-to-bottom, no leaves
  leaves(root.left,  out)              # leaves of the left subtree
  leaves(root.right, out)              # leaves of the right subtree
  rightBoundary(root.right, out)       # right edge, bottom-to-top
  return out
```

The careful choice of *what to start each piece on* is what avoids double-counting. The root is added explicitly. The left/right boundaries start at `root.left` / `root.right` (so they don't re-add the root). The leaves walk both subtrees in order (so they don't double-count and they appear in left-to-right order).

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
    P1["1. emit root → out=[1]"]
    P2["2. leftBoundary(root.left) → adds non-leaf left-edge nodes
   (preorder-style: visit then descend)"]
    P3["3. leaves(root.left) → adds left-subtree leaves left-to-right
   leaves(root.right) → adds right-subtree leaves left-to-right"]
    P4["4. rightBoundary(root.right) → adds non-leaf right-edge nodes in REVERSE
   (postorder-style: descend then visit)"]
    P1 --> P2 --> P3 --> P4
```

<p align="center"><strong>Four ordered pieces — each is a familiar pattern, specialised to one slice of the perimeter. Together they walk the boundary anticlockwise without revisiting any node.</strong></p>

***

# Solution

A single pass requires four helpers and one driver — about 30 lines per language. Implementations follow.

<div class="lang-tabs">

```pseudocode
function isLeaf(n): return n ≠ null AND n.left = null AND n.right = null

function leftBoundary(n, out):
    if n = null OR isLeaf(n): return
    append n.val to out
    if n.left ≠ null: leftBoundary(n.left,  out)
    else:             leftBoundary(n.right, out)   # hug the edge even when strict left runs out

function leaves(n, out):
    if n = null: return
    if isLeaf(n): append n.val to out; return
    leaves(n.left,  out)
    leaves(n.right, out)

function rightBoundary(n, out):
    if n = null OR isLeaf(n): return
    if n.right ≠ null: rightBoundary(n.right, out)
    else:              rightBoundary(n.left,  out)
    append n.val to out                            # postorder: visit on the way back up (= reverse)

function boundaryTraversal(root):
    if root = null: return empty list
    out ← [root.val]
    leftBoundary (root.left,  out)
    leaves       (root.left,  out)
    leaves       (root.right, out)
    rightBoundary(root.right, out)
    return out
```

```python,editable
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right

def is_leaf(n): return n is not None and n.left is None and n.right is None

def left_boundary(n, out):
    if n is None or is_leaf(n): return
    out.append(n.val)
    if n.left:  left_boundary(n.left,  out)
    else:       left_boundary(n.right, out)

def leaves(n, out):
    if n is None: return
    if is_leaf(n): out.append(n.val); return
    leaves(n.left,  out)
    leaves(n.right, out)

def right_boundary(n, out):
    if n is None or is_leaf(n): return
    if n.right: right_boundary(n.right, out)
    else:       right_boundary(n.left,  out)
    out.append(n.val)                 # postorder: visit on the way back up

def boundary_traversal(root: Optional[TreeNode]) -> List[int]:
    if root is None: return []
    out = [root.val]
    left_boundary (root.left,  out)
    leaves        (root.left,  out)
    leaves        (root.right, out)
    right_boundary(root.right, out)
    return out
```

```java,editable
static boolean isLeaf(TreeNode n) { return n != null && n.left == null && n.right == null; }
static void leftBoundary(TreeNode n, List<Integer> out) {
    if (n == null || isLeaf(n)) return;
    out.add(n.val);
    if (n.left  != null) leftBoundary(n.left,  out);
    else                 leftBoundary(n.right, out);
}
static void leaves(TreeNode n, List<Integer> out) {
    if (n == null) return;
    if (isLeaf(n)) { out.add(n.val); return; }
    leaves(n.left,  out);
    leaves(n.right, out);
}
static void rightBoundary(TreeNode n, List<Integer> out) {
    if (n == null || isLeaf(n)) return;
    if (n.right != null) rightBoundary(n.right, out);
    else                 rightBoundary(n.left,  out);
    out.add(n.val);
}
public static List<Integer> boundaryTraversal(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    if (root == null) return out;
    out.add(root.val);
    leftBoundary (root.left,  out);
    leaves       (root.left,  out);
    leaves       (root.right, out);
    rightBoundary(root.right, out);
    return out;
}
```

```c,editable
int is_leaf(TreeNode *n) { return n && !n->left && !n->right; }

void left_boundary(TreeNode *n, int *out, int *k) {
    if (!n || is_leaf(n)) return;
    out[(*k)++] = n->val;
    if (n->left) left_boundary(n->left,  out, k);
    else         left_boundary(n->right, out, k);
}
void leaves(TreeNode *n, int *out, int *k) {
    if (!n) return;
    if (is_leaf(n)) { out[(*k)++] = n->val; return; }
    leaves(n->left,  out, k);
    leaves(n->right, out, k);
}
void right_boundary(TreeNode *n, int *out, int *k) {
    if (!n || is_leaf(n)) return;
    if (n->right) right_boundary(n->right, out, k);
    else          right_boundary(n->left,  out, k);
    out[(*k)++] = n->val;
}
int* boundary_traversal(TreeNode *root, int *count) {
    static int out[64]; *count = 0;
    if (!root) return out;
    out[(*count)++] = root->val;
    left_boundary (root->left,  out, count);
    leaves        (root->left,  out, count);
    leaves        (root->right, out, count);
    right_boundary(root->right, out, count);
    return out;
}
```

```cpp,editable
bool isLeaf(TreeNode *n) { return n && !n->left && !n->right; }

void leftBoundary(TreeNode *n, std::vector<int>& out) {
    if (!n || isLeaf(n)) return;
    out.push_back(n->val);
    if (n->left) leftBoundary(n->left,  out);
    else         leftBoundary(n->right, out);
}
void leaves(TreeNode *n, std::vector<int>& out) {
    if (!n) return;
    if (isLeaf(n)) { out.push_back(n->val); return; }
    leaves(n->left,  out);
    leaves(n->right, out);
}
void rightBoundary(TreeNode *n, std::vector<int>& out) {
    if (!n || isLeaf(n)) return;
    if (n->right) rightBoundary(n->right, out);
    else          rightBoundary(n->left,  out);
    out.push_back(n->val);
}
std::vector<int> boundaryTraversal(TreeNode *root) {
    std::vector<int> out;
    if (!root) return out;
    out.push_back(root->val);
    leftBoundary (root->left,  out);
    leaves       (root->left,  out);
    leaves       (root->right, out);
    rightBoundary(root->right, out);
    return out;
}
```

```scala,editable
def boundaryTraversal(root: TreeNode): List[Int] = {
  val out = scala.collection.mutable.ListBuffer[Int]()
  def isLeaf(n: TreeNode): Boolean = n != null && n.left == null && n.right == null
  def leftBoundary(n: TreeNode): Unit = {
    if (n == null || isLeaf(n)) return
    out += n.value
    if (n.left  != null) leftBoundary(n.left)
    else                 leftBoundary(n.right)
  }
  def leaves(n: TreeNode): Unit = {
    if (n == null) return
    if (isLeaf(n)) { out += n.value; return }
    leaves(n.left); leaves(n.right)
  }
  def rightBoundary(n: TreeNode): Unit = {
    if (n == null || isLeaf(n)) return
    if (n.right != null) rightBoundary(n.right)
    else                 rightBoundary(n.left)
    out += n.value
  }
  if (root == null) return Nil
  out += root.value
  leftBoundary(root.left)
  leaves(root.left); leaves(root.right)
  rightBoundary(root.right)
  out.toList
}
```

```typescript,editable
function boundaryTraversal(root: TreeNode | null): number[] {
    const out: number[] = [];
    if (!root) return out;
    const isLeaf = (n: TreeNode | null): n is TreeNode => !!n && !n.left && !n.right;
    function leftB(n: TreeNode | null): void {
        if (!n || isLeaf(n)) return;
        out.push(n.val);
        if (n.left) leftB(n.left);
        else        leftB(n.right);
    }
    function leaves(n: TreeNode | null): void {
        if (!n) return;
        if (isLeaf(n)) { out.push(n.val); return; }
        leaves(n.left); leaves(n.right);
    }
    function rightB(n: TreeNode | null): void {
        if (!n || isLeaf(n)) return;
        if (n.right) rightB(n.right);
        else         rightB(n.left);
        out.push(n.val);
    }
    out.push(root.val);
    leftB (root.left);
    leaves(root.left);
    leaves(root.right);
    rightB(root.right);
    return out;
}
```

```go,editable
func boundaryTraversal(root *TreeNode) []int {
    var out []int
    if root == nil { return out }
    isLeaf := func(n *TreeNode) bool { return n != nil && n.Left == nil && n.Right == nil }

    var leftB func(*TreeNode)
    leftB = func(n *TreeNode) {
        if n == nil || isLeaf(n) { return }
        out = append(out, n.Val)
        if n.Left != nil { leftB(n.Left) } else { leftB(n.Right) }
    }
    var leaves func(*TreeNode)
    leaves = func(n *TreeNode) {
        if n == nil { return }
        if isLeaf(n) { out = append(out, n.Val); return }
        leaves(n.Left); leaves(n.Right)
    }
    var rightB func(*TreeNode)
    rightB = func(n *TreeNode) {
        if n == nil || isLeaf(n) { return }
        if n.Right != nil { rightB(n.Right) } else { rightB(n.Left) }
        out = append(out, n.Val)
    }

    out = append(out, root.Val)
    leftB (root.Left)
    leaves(root.Left); leaves(root.Right)
    rightB(root.Right)
    return out
}
```

```rust,editable
fn is_leaf(n: &Box<TreeNode>) -> bool { n.left.is_none() && n.right.is_none() }

fn left_boundary(n: &Option<Box<TreeNode>>, out: &mut Vec<i32>) {
    if let Some(node) = n {
        if is_leaf(node) { return; }
        out.push(node.val);
        if node.left.is_some() { left_boundary(&node.left,  out); }
        else                   { left_boundary(&node.right, out); }
    }
}
fn leaves(n: &Option<Box<TreeNode>>, out: &mut Vec<i32>) {
    if let Some(node) = n {
        if is_leaf(node) { out.push(node.val); return; }
        leaves(&node.left,  out);
        leaves(&node.right, out);
    }
}
fn right_boundary(n: &Option<Box<TreeNode>>, out: &mut Vec<i32>) {
    if let Some(node) = n {
        if is_leaf(node) { return; }
        if node.right.is_some() { right_boundary(&node.right, out); }
        else                    { right_boundary(&node.left,  out); }
        out.push(node.val);
    }
}

pub fn boundary_traversal(root: &Option<Box<TreeNode>>) -> Vec<i32> {
    let mut out = Vec::new();
    if root.is_none() { return out; }
    let r = root.as_ref().unwrap();
    out.push(r.val);
    left_boundary (&r.left,  &mut out);
    leaves        (&r.left,  &mut out);
    leaves        (&r.right, &mut out);
    right_boundary(&r.right, &mut out);
    out
}
```

</div>

## Complexity

> **Time:** O(N) — each node is visited at most twice (once by a boundary helper, possibly once by `leaves`). **Space:** O(h) for recursion stack.

***

## Final Takeaway — and a chapter close

The boundary traversal is *one* problem that needs *three* patterns stitched together. There are dozens of similar problems across the binary-tree interview canon — they all look intimidating until you decompose them into pieces you already know. Three things to walk away with:

1. **Decompose first, code second.** Before writing a line, name the slices of the answer and which pattern each slice fits. Once the decomposition is written down, the implementation is mechanical. *"What slice am I computing? Which pattern?"* — say it out loud for each piece.
2. **Avoid double-counting by careful boundaries.** Every composed solution has overlap risks at the seams. The boundary problem makes you confront this directly: the root, the left-boundary, the leaves, and the right-boundary all have potential overlap with each other, and the cure is to start each helper at the right node (not the root) and exclude the right cases (leaves from boundaries, root from leaves).
3. **The chapter is a toolkit, not a checklist.** Eleven patterns sounds like a lot, but each is a five-line skeleton that you can write from memory once it's internalised. The hard part of "binary-tree interview problems" isn't *knowing* the patterns — it's recognising which one (or which combination) the problem in front of you needs. That recognition only comes with practice, and this lesson's boundary traversal is a good first composition to chew on.

> *Chapter end.* The next chapter (**Binary Search Trees**) builds on everything from this one — every algorithm here generalises naturally to a BST, and the BST's invariant gives us *additional* algorithmic leverage (O(log N) lookups, sorted iteration, predecessor/successor in O(h)) on top of what you've already learned. The patterns from this chapter will carry forward — the next chapter teaches you when the BST shape lets you go faster.
