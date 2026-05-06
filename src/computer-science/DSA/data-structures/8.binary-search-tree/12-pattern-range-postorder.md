# 12. Pattern: Range Postorder

## The Hook

The previous two patterns let the BST silently sort the values for you, then walked the *whole* tree to compute things over the sorted sequence. They run in O(n) and visit every node — which is fine when the answer truly depends on every node, but **wasteful** the moment the question only cares about a *range*.

"Sum every node whose value is between 5 and 12." "Find the deepest path through nodes valued in [200, 500]." "Trim away everything outside [a, b] and return the resulting tree." If you walk every node you're doing too much work — *and the BST property tells you which subtrees you can skip entirely*. A node with value `v < low` puts its **whole left subtree** out of range. A node with `v > high` puts its **whole right subtree** out of range. We can prune.

This is the **Range Postorder** pattern: a postorder walk (left → right → process) augmented with two pruning rules from the BST property. It runs in O(out-of-range subtrees pruned + nodes touched) — usually much faster than O(n) — and it's the canonical pattern for any *range-bounded BST problem*: range sum, range diameter, range leaf count, range trim.

---

## Table of Contents

1. [Understanding the range postorder pattern](#understanding-the-range-postorder-pattern)
2. [Identifying the range postorder pattern](#identifying-the-range-postorder-pattern)
3. [Range summation](#range-summation)
4. [Range diameter](#range-diameter)
5. [Range leaves](#range-leaves)
6. [Range exclusive trim](#range-exclusive-trim)

***

# Understanding the range postorder pattern

The pattern combines two ideas you already know:

1. **Postorder traversal** (left → right → process the node) — used whenever a node's result depends on already-computed results from its subtrees. Sums, heights, diameters, leaf counts all fit this shape.
2. **BST search-style pruning** — a node's value tells us *which* subtree might contain in-range descendants, and discards the other.

Put them together: at every node, **first check the BST pruning rule**; only descend into both subtrees if the node itself is in range; combine subtree results in postorder fashion.

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
    A["processRange(node, low, high)"] --> B{"node == null?"}
    B -->|Yes| C["return default"]
    B -->|No| D{"node.val ?= [low, high]"}
    D -->|"&lt; low"| E["Skip whole left subtree<br/>recurse right only"]
    D -->|"&gt; high"| F["Skip whole right subtree<br/>recurse left only"]
    D -->|"in range"| G["recurse left + recurse right<br/>combine results via f"]
    style E fill:#fde68a,stroke:#d97706
    style F fill:#fde68a,stroke:#d97706
    style G fill:#bbf7d0,stroke:#16a34a
```

<p align="center"><strong>The decision diamond at every node. Out-of-range nodes prune one subtree entirely; in-range nodes recurse both ways and combine.</strong></p>

The pruning is what makes the pattern fast. If your range is narrow and your tree is balanced, you might touch only **O(log n + k)** nodes (path to range + size of range), not O(n).

## Why "postorder"?

Because the work happens *after* the children's results come back. The recursive calls to `processRange(left)` and `processRange(right)` produce aggregates; the parent combines them into its own aggregate before returning to *its* parent. Sum, max-depth, leaf count — these are all postorder reductions.

## Algorithm

> **processRange(node, low, high):**
>
> - **Step 1:** If `node` is `null`, return the default value.
> - **Step 2:** If `node.val < low`, return `processRange(node.right, low, high)` — entire left subtree is out of range.
> - **Step 3:** If `node.val > high`, return `processRange(node.left, low, high)` — entire right subtree is out of range.
> - **Step 4:** Else (`low ≤ node.val ≤ high`):
>   - `left = processRange(node.left, low, high)`
>   - `right = processRange(node.right, low, high)`
>   - Process this node (possibly mutating it) using `left` and `right`.
>   - Return `f(left, right, node)`.

## Generic template

<div class="lang-tabs">

```pseudocode
function processRange(node, low, high):
    if node is null: return 0
    if node.val < low:                           # BST prune: entire left is out of range
        return processRange(node.right, low, high)
    if node.val > high:                          # BST prune: entire right is out of range
        return processRange(node.left, low, high)
    # Both children may contribute — collect their results first (postorder)
    left  ← processRange(node.left,  low, high)
    right ← processRange(node.right, low, high)
    return f(left, right, node.val)              # combine children + this node
```

```python,editable
class Solution:
    def process_range(self, node, low, high):
        # Default contribution of an empty subtree.
        if node is None:
            return 0
        # BST prune: node too small → entire left subtree is < low.
        if node.val < low:
            return self.process_range(node.right, low, high)
        # BST prune: node too large → entire right subtree is > high.
        if node.val > high:
            return self.process_range(node.left, low, high)
        # In range: combine results from both children in postorder fashion.
        left  = self.process_range(node.left,  low, high)
        right = self.process_range(node.right, low, high)
        # Hook for whatever the specific problem needs (mutate node, etc.)
        # ...
        return self.f(left, right, node.val)
```

```java,editable
class Solution {
    int f(int left, int right, int val) { return left + right + val; }

    public int processRange(TreeNode node, int low, int high) {
        if (node == null) return 0;                                                                                // empty
        if (node.val < low)  return processRange(node.right, low, high);                                           // prune left
        if (node.val > high) return processRange(node.left,  low, high);                                           // prune right
        int left  = processRange(node.left,  low, high);
        int right = processRange(node.right, low, high);
        return f(left, right, node.val);                                                                            // postorder combine
    }
}
```

```c,editable
static int f(int left, int right, int val) { return left + right + val; }

int processRange(struct TreeNode *node, int low, int high) {
    if (node == NULL)        return 0;                                                                              // empty
    if (node->val < low)     return processRange(node->right, low, high);                                            // prune left
    if (node->val > high)    return processRange(node->left,  low, high);                                            // prune right
    int left  = processRange(node->left,  low, high);
    int right = processRange(node->right, low, high);
    return f(left, right, node->val);                                                                                // combine
}
```

```cpp,editable
class Solution {
public:
    int f(int left, int right, int val) { return left + right + val; }

    int processRange(TreeNode *node, int low, int high) {
        if (!node)              return 0;                                                                              // empty
        if (node->val < low)    return processRange(node->right, low, high);                                            // prune left
        if (node->val > high)   return processRange(node->left,  low, high);                                            // prune right
        int left  = processRange(node->left,  low, high);
        int right = processRange(node->right, low, high);
        return f(left, right, node->val);                                                                                // combine
    }
};
```

```scala,editable
object Solution {
  private def f(left: Int, right: Int, v: Int): Int = left + right + v

  def processRange(node: TreeNode, low: Int, high: Int): Int = {
    if (node == null)           return 0                                                                                  // empty
    if (node.value < low)       return processRange(node.right, low, high)                                                // prune left
    if (node.value > high)      return processRange(node.left,  low, high)                                                // prune right
    val left  = processRange(node.left,  low, high)
    val right = processRange(node.right, low, high)
    f(left, right, node.value)                                                                                            // combine
  }
}
```

```typescript,editable
class Solution {
  f(left: number, right: number, v: number): number { return left + right + v; }

  processRange(node: TreeNode | null, low: number, high: number): number {
    if (node === null)        return 0;                                                                                      // empty
    if (node.val < low)       return this.processRange(node.right, low, high);                                                // prune left
    if (node.val > high)      return this.processRange(node.left,  low, high);                                                // prune right
    const left  = this.processRange(node.left,  low, high);
    const right = this.processRange(node.right, low, high);
    return this.f(left, right, node.val);                                                                                    // combine
  }
}
```

```go,editable
func f(left, right, val int) int { return left + right + val }

func processRange(node *TreeNode, low, high int) int {
    if node == nil       { return 0 }                                                                                          // empty
    if node.Val < low    { return processRange(node.Right, low, high) }                                                        // prune left
    if node.Val > high   { return processRange(node.Left,  low, high) }                                                        // prune right
    left  := processRange(node.Left,  low, high)
    right := processRange(node.Right, low, high)
    return f(left, right, node.Val)                                                                                            // combine
}
```

```rust,editable
use std::rc::Rc;
use std::cell::RefCell;
type Tree = Option<Rc<RefCell<TreeNode>>>;

impl Solution {
    fn f(left: i32, right: i32, v: i32) -> i32 { left + right + v }

    pub fn process_range(node: Tree, low: i32, high: i32) -> i32 {
        match node {
            None => 0,
            Some(n) => {
                let v = n.borrow().val;
                if v < low  { return Self::process_range(n.borrow().right.clone(), low, high); }                                  // prune left
                if v > high { return Self::process_range(n.borrow().left.clone(),  low, high); }                                  // prune right
                let left  = Self::process_range(n.borrow().left.clone(),  low, high);
                let right = Self::process_range(n.borrow().right.clone(), low, high);
                Self::f(left, right, v)                                                                                            // combine
            }
        }
    }
}
```

</div>

## Complexity

| Aspect | Time | Space |
|---|---|---|
| Worst case (range = whole tree) | O(n) | O(h) |
| Typical case (narrow range) | O(h + k) | O(h) |

`k` is the number of in-range nodes. The worst case occurs when every node is in range (no pruning happens, full traversal). The typical case happens when the range covers a small fraction of the tree — pruning slashes the work to "path to range + range size".

***

# Identifying the range postorder pattern

Look for these signals:

- The problem mentions a **range `[low, high]`** of values.
- The result is some **aggregate** (sum, count, height/diameter, structural transformation) over nodes inside that range.
- A node's contribution depends on its in-range descendants — i.e. the recursion is naturally postorder.
- The problem says (or strongly implies) that **out-of-range nodes have only out-of-range descendants on one side** — exactly what the BST property guarantees.

If your sketched recursion looks like *"compute something at this node from results in its subtrees, but only consider in-range nodes"*, range postorder fits.

***

# Range summation

## Problem Statement

Given the **root** of a BST and a range `[low, high]`, update each in-range node's value by adding the values of all its descendants that are also in range. Return nothing — the tree is mutated in place.

> Guarantee: a node *outside* the range never has any in-range descendants on either side. (This follows from BST structure, but the problem states it explicitly so the pruning is safe.)

### Example 1

> - **Input:** `root = [4, 2, 5, 1, 3, null, 6]`, `low = 2`, `high = 5`
> - **Output:** `[14, 5, 5, 1, 3, null, 6]`

### Example 2

> - **Input:** `root = [5, 1, 8, null, null, 6, 9]`, `low = 6`, `high = 9`
> - **Output:** `[5, 1, 23, null, null, 6, 9]`

## The Strategy

Every in-range node accumulates `leftSum + rightSum + originalVal` and writes that back into `node.val`. The recursion returns the same total to its parent so parents can do the same.

## The Solution

<div class="lang-tabs">

```pseudocode
function rangeSummation(root, low, high):
    if root is null: return 0
    if root.val < low: return rangeSummation(root.right, low, high)  # prune left
    if root.val > high: return rangeSummation(root.left, low, high)  # prune right
    leftSum  ← rangeSummation(root.left,  low, high)
    rightSum ← rangeSummation(root.right, low, high)
    root.val ← root.val + leftSum + rightSum  # overwrite with subtree total
    return root.val
```

```python,editable
class Solution:
    def range_summation_helper(self, root, low, high):
        if root is None:
            return 0                                # empty subtree contributes nothing
        if root.val < low:
            return self.range_summation_helper(root.right, low, high)   # whole left subtree out of range
        if root.val > high:
            return self.range_summation_helper(root.left, low, high)    # whole right subtree out of range
        # In range: gather sums from both children.
        left_sum  = self.range_summation_helper(root.left,  low, high)
        right_sum = self.range_summation_helper(root.right, low, high)
        # Mutate this node to include the in-range descendants' sum.
        root.val += left_sum + right_sum
        return root.val                              # report the new total to the parent

    def range_summation(self, root, low, high):
        self.range_summation_helper(root, low, high)
```

```java,editable
class Solution {
    public int rangeSummationHelper(TreeNode root, int low, int high) {
        if (root == null) return 0;                                                                                                 // empty
        if (root.val < low)  return rangeSummationHelper(root.right, low, high);                                                    // prune left
        if (root.val > high) return rangeSummationHelper(root.left,  low, high);                                                    // prune right
        int leftSum  = rangeSummationHelper(root.left,  low, high);
        int rightSum = rangeSummationHelper(root.right, low, high);
        root.val += leftSum + rightSum;                                                                                              // mutate
        return root.val;                                                                                                             // return new total
    }

    public void rangeSummation(TreeNode root, int low, int high) {
        rangeSummationHelper(root, low, high);
    }
}
```

```c,editable
int rangeSummationHelper(struct TreeNode *root, int low, int high) {
    if (root == NULL)         return 0;                                                                                                // empty
    if (root->val < low)      return rangeSummationHelper(root->right, low, high);                                                     // prune left
    if (root->val > high)     return rangeSummationHelper(root->left,  low, high);                                                     // prune right
    int leftSum  = rangeSummationHelper(root->left,  low, high);
    int rightSum = rangeSummationHelper(root->right, low, high);
    root->val += leftSum + rightSum;                                                                                                   // mutate
    return root->val;
}

void rangeSummation(struct TreeNode *root, int low, int high) {
    rangeSummationHelper(root, low, high);
}
```

```cpp,editable
class Solution {
public:
    int rangeSummationHelper(TreeNode *root, int low, int high) {
        if (!root)              return 0;                                                                                                // empty
        if (root->val < low)    return rangeSummationHelper(root->right, low, high);                                                     // prune left
        if (root->val > high)   return rangeSummationHelper(root->left,  low, high);                                                     // prune right
        int leftSum  = rangeSummationHelper(root->left,  low, high);
        int rightSum = rangeSummationHelper(root->right, low, high);
        root->val += leftSum + rightSum;                                                                                                  // mutate
        return root->val;
    }

    void rangeSummation(TreeNode *root, int low, int high) {
        rangeSummationHelper(root, low, high);
    }
};
```

```scala,editable
object Solution {
  def rangeSummationHelper(root: TreeNode, low: Int, high: Int): Int = {
    if (root == null)           return 0
    if (root.value < low)       return rangeSummationHelper(root.right, low, high)
    if (root.value > high)      return rangeSummationHelper(root.left,  low, high)
    val leftSum  = rangeSummationHelper(root.left,  low, high)
    val rightSum = rangeSummationHelper(root.right, low, high)
    root.value += leftSum + rightSum
    root.value
  }

  def rangeSummation(root: TreeNode, low: Int, high: Int): Unit = {
    rangeSummationHelper(root, low, high)
  }
}
```

```typescript,editable
class Solution {
  rangeSummationHelper(root: TreeNode | null, low: number, high: number): number {
    if (root === null)        return 0;
    if (root.val < low)       return this.rangeSummationHelper(root.right, low, high);
    if (root.val > high)      return this.rangeSummationHelper(root.left,  low, high);
    const leftSum  = this.rangeSummationHelper(root.left,  low, high);
    const rightSum = this.rangeSummationHelper(root.right, low, high);
    root.val += leftSum + rightSum;
    return root.val;
  }

  rangeSummation(root: TreeNode | null, low: number, high: number): void {
    this.rangeSummationHelper(root, low, high);
  }
}
```

```go,editable
func rangeSummationHelper(root *TreeNode, low, high int) int {
    if root == nil       { return 0 }
    if root.Val < low    { return rangeSummationHelper(root.Right, low, high) }
    if root.Val > high   { return rangeSummationHelper(root.Left,  low, high) }
    leftSum  := rangeSummationHelper(root.Left,  low, high)
    rightSum := rangeSummationHelper(root.Right, low, high)
    root.Val += leftSum + rightSum
    return root.Val
}

func rangeSummation(root *TreeNode, low, high int) {
    rangeSummationHelper(root, low, high)
}
```

```rust,editable
use std::rc::Rc;
use std::cell::RefCell;
type Tree = Option<Rc<RefCell<TreeNode>>>;

impl Solution {
    pub fn range_summation(root: Tree, low: i32, high: i32) {
        Self::helper(root, low, high);
    }

    fn helper(root: Tree, low: i32, high: i32) -> i32 {
        match root {
            None => 0,
            Some(n) => {
                let v = n.borrow().val;
                if v < low  { return Self::helper(n.borrow().right.clone(), low, high); }
                if v > high { return Self::helper(n.borrow().left.clone(),  low, high); }
                let left_sum  = Self::helper(n.borrow().left.clone(),  low, high);
                let right_sum = Self::helper(n.borrow().right.clone(), low, high);
                n.borrow_mut().val = v + left_sum + right_sum;
                n.borrow().val
            }
        }
    }
}
```

</div>

***

# Range diameter

## Problem Statement

Given the **root** of a BST and a range `[low, high]`, return the **diameter** of the largest subtree in which every node's value lies in `[low, high]`. The diameter of a tree is the longest path (counted in edges) between any two of its nodes.

### Example 1

> - **Input:** `root = [4, 2, 5, 1, 3, null, 6]`, `low = 2`, `high = 5`
> - **Output:** `3`

### Example 2

> - **Input:** `root = [5, 1, 8, null, null, 6, 9]`, `low = 6`, `high = 9`
> - **Output:** `2`

## The Strategy

Standard "diameter of a binary tree" algorithm: at every node, recursively compute the *height* of each subtree, and update a global `diameter` candidate as `leftHeight + rightHeight`. Return `max(leftHeight, rightHeight) + 1` to the parent.

The only addition for this problem: **prune out-of-range nodes** the same way we did for sums. A subtree rooted outside the range contributes height `0` and is invisible to the diameter calculation.

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
    R((4))
    A((2))
    B((5))
    C((1))
    D((3))
    E((6))
    R --> A
    R --> B
    A --> C
    A --> D
    B --> X([" "])
    B --> E
    OUT["Range [2, 5] → drop 6, 1. Largest in-range subtree: 4-2-3 → diameter = 3 edges"]
    style C fill:#fecaca,stroke:#ef4444
    style E fill:#fecaca,stroke:#ef4444
    style X fill:none,stroke:none,color:transparent
    style OUT fill:#bbf7d0,stroke:#16a34a
```

<p align="center"><strong>Range <code>[2, 5]</code> excludes <code>1</code> and <code>6</code>. The longest path through in-range nodes is <code>3 → 2 → 4 → 5</code>, diameter <code>3</code>.</strong></p>

## The Solution

<div class="lang-tabs">

```pseudocode
diameter ← 0

function rangeDiameter(root, low, high):   # returns height of in-range subtree
    if root is null: return 0
    if root.val < low: return rangeDiameter(root.right, low, high)  # prune left
    if root.val > high: return rangeDiameter(root.left, low, high)  # prune right
    leftH  ← rangeDiameter(root.left,  low, high)
    rightH ← rangeDiameter(root.right, low, high)
    diameter ← max(diameter, leftH + rightH)   # path through this node
    return max(leftH, rightH) + 1              # height of this subtree
```

```python,editable
class Solution:
    def __init__(self):
        self.diameter = 0

    def range_diameter_helper(self, root, low, high):
        if root is None:
            return 0
        if root.val < low:
            return self.range_diameter_helper(root.right, low, high)    # prune left
        if root.val > high:
            return self.range_diameter_helper(root.left, low, high)     # prune right
        # In range: collect heights of both children.
        left_h  = self.range_diameter_helper(root.left,  low, high)
        right_h = self.range_diameter_helper(root.right, low, high)
        # Diameter through this node = path going down-left + path going down-right.
        self.diameter = max(self.diameter, left_h + right_h)
        # Height contributed by this node: 1 + tallest child.
        return max(left_h, right_h) + 1

    def range_diameter(self, root, low, high):
        self.diameter = 0
        self.range_diameter_helper(root, low, high)
        return self.diameter
```

```java,editable
class Solution {
    private int diameter = 0;

    private int rangeDiameterHelper(TreeNode root, int low, int high) {
        if (root == null) return 0;
        if (root.val < low)  return rangeDiameterHelper(root.right, low, high);                                                          // prune left
        if (root.val > high) return rangeDiameterHelper(root.left,  low, high);                                                          // prune right
        int leftH  = rangeDiameterHelper(root.left,  low, high);
        int rightH = rangeDiameterHelper(root.right, low, high);
        diameter = Math.max(diameter, leftH + rightH);                                                                                    // candidate
        return Math.max(leftH, rightH) + 1;                                                                                                // height
    }

    public int rangeDiameter(TreeNode root, int low, int high) {
        diameter = 0;
        rangeDiameterHelper(root, low, high);
        return diameter;
    }
}
```

```c,editable
static int diameter_;

static int helper(struct TreeNode *root, int low, int high) {
    if (root == NULL)     return 0;
    if (root->val < low)  return helper(root->right, low, high);
    if (root->val > high) return helper(root->left,  low, high);
    int leftH  = helper(root->left,  low, high);
    int rightH = helper(root->right, low, high);
    if (leftH + rightH > diameter_) diameter_ = leftH + rightH;
    return (leftH > rightH ? leftH : rightH) + 1;
}

int rangeDiameter(struct TreeNode *root, int low, int high) {
    diameter_ = 0;
    helper(root, low, high);
    return diameter_;
}
```

```cpp,editable
class Solution {
public:
    int diameter = 0;

    int rangeDiameterHelper(TreeNode *root, int low, int high) {
        if (!root)              return 0;
        if (root->val < low)    return rangeDiameterHelper(root->right, low, high);
        if (root->val > high)   return rangeDiameterHelper(root->left,  low, high);
        int leftH  = rangeDiameterHelper(root->left,  low, high);
        int rightH = rangeDiameterHelper(root->right, low, high);
        diameter = std::max(diameter, leftH + rightH);
        return std::max(leftH, rightH) + 1;
    }

    int rangeDiameter(TreeNode *root, int low, int high) {
        diameter = 0;
        rangeDiameterHelper(root, low, high);
        return diameter;
    }
};
```

```scala,editable
class Solution {
  private var diameter: Int = 0

  private def helper(root: TreeNode, low: Int, high: Int): Int = {
    if (root == null)           return 0
    if (root.value < low)       return helper(root.right, low, high)
    if (root.value > high)      return helper(root.left,  low, high)
    val leftH  = helper(root.left,  low, high)
    val rightH = helper(root.right, low, high)
    diameter = math.max(diameter, leftH + rightH)
    math.max(leftH, rightH) + 1
  }

  def rangeDiameter(root: TreeNode, low: Int, high: Int): Int = {
    diameter = 0
    helper(root, low, high)
    diameter
  }
}
```

```typescript,editable
class Solution {
  diameter = 0;

  rangeDiameterHelper(root: TreeNode | null, low: number, high: number): number {
    if (root === null)         return 0;
    if (root.val < low)        return this.rangeDiameterHelper(root.right, low, high);
    if (root.val > high)       return this.rangeDiameterHelper(root.left,  low, high);
    const leftH  = this.rangeDiameterHelper(root.left,  low, high);
    const rightH = this.rangeDiameterHelper(root.right, low, high);
    this.diameter = Math.max(this.diameter, leftH + rightH);
    return Math.max(leftH, rightH) + 1;
  }

  rangeDiameter(root: TreeNode | null, low: number, high: number): number {
    this.diameter = 0;
    this.rangeDiameterHelper(root, low, high);
    return this.diameter;
  }
}
```

```go,editable
type rangeDiamState struct{ diameter int }

func (s *rangeDiamState) helper(root *TreeNode, low, high int) int {
    if root == nil       { return 0 }
    if root.Val < low    { return s.helper(root.Right, low, high) }
    if root.Val > high   { return s.helper(root.Left,  low, high) }
    leftH  := s.helper(root.Left,  low, high)
    rightH := s.helper(root.Right, low, high)
    if leftH + rightH > s.diameter { s.diameter = leftH + rightH }
    if leftH > rightH { return leftH + 1 }
    return rightH + 1
}

func rangeDiameter(root *TreeNode, low, high int) int {
    s := &rangeDiamState{}
    s.helper(root, low, high)
    return s.diameter
}
```

```rust,editable
use std::rc::Rc;
use std::cell::RefCell;
type Tree = Option<Rc<RefCell<TreeNode>>>;

impl Solution {
    pub fn range_diameter(root: Tree, low: i32, high: i32) -> i32 {
        let mut diameter = 0i32;
        Self::helper(root, low, high, &mut diameter);
        diameter
    }

    fn helper(root: Tree, low: i32, high: i32, diameter: &mut i32) -> i32 {
        match root {
            None => 0,
            Some(n) => {
                let v = n.borrow().val;
                if v < low  { return Self::helper(n.borrow().right.clone(), low, high, diameter); }
                if v > high { return Self::helper(n.borrow().left.clone(),  low, high, diameter); }
                let left_h  = Self::helper(n.borrow().left.clone(),  low, high, diameter);
                let right_h = Self::helper(n.borrow().right.clone(), low, high, diameter);
                if left_h + right_h > *diameter { *diameter = left_h + right_h; }
                left_h.max(right_h) + 1
            }
        }
    }
}
```

</div>

***

# Range leaves

## Problem Statement

Given the **root** of a BST and a range `[low, high]`, replace the value of each *non-leaf* in-range node with the count of in-range leaves in its subtree.

> A *leaf* here is a node whose subtree contains no in-range descendants — typically an actual leaf in the original tree.

### Example 1

> - **Input:** `root = [4, 2, 5, 1, 3, null, 6]`, `low = 2`, `high = 5`
> - **Output:** `[1, 1, 0, 1, 3, null, 6]`

### Example 2

> - **Input:** `root = [5, 1, 8, null, null, 6, 9]`, `low = 6`, `high = 9`
> - **Output:** `[5, 1, 2, null, null, 6, 9]`

## The Strategy

Same skeleton as range summation, but instead of returning the sum of in-range descendants, return the *count of in-range leaves*. A leaf returns `1`; an internal in-range node returns `leftLeaves + rightLeaves` and overwrites its own value with that count.

## The Solution

<div class="lang-tabs">

```pseudocode
function rangeLeaves(root, low, high):   # returns count of in-range leaves below
    if root is null: return 0
    if root.val < low: return rangeLeaves(root.right, low, high)  # prune left
    if root.val > high: return rangeLeaves(root.left, low, high)  # prune right
    if root.left is null AND root.right is null:
        return 1                          # in-range leaf
    leftLeaves  ← rangeLeaves(root.left,  low, high)
    rightLeaves ← rangeLeaves(root.right, low, high)
    root.val ← leftLeaves + rightLeaves  # overwrite internal node with leaf count
    return root.val
```

```python,editable
class Solution:
    def range_leaves_helper(self, root, low, high):
        if root is None:
            return 0
        if root.val < low:
            return self.range_leaves_helper(root.right, low, high)             # prune left
        if root.val > high:
            return self.range_leaves_helper(root.left, low, high)              # prune right
        # In range; check leaf-ness AFTER pruning, because the original tree's
        # leaves stay leaves regardless of range.
        if root.left is None and root.right is None:
            return 1                                                           # this is an in-range leaf
        left_leaves  = self.range_leaves_helper(root.left,  low, high)
        right_leaves = self.range_leaves_helper(root.right, low, high)
        # Internal in-range node: overwrite with count of in-range leaves below.
        root.val = left_leaves + right_leaves
        return root.val

    def range_leaves(self, root, low, high):
        self.range_leaves_helper(root, low, high)
```

```java,editable
class Solution {
    public int rangeLeavesHelper(TreeNode root, int low, int high) {
        if (root == null) return 0;
        if (root.val < low)  return rangeLeavesHelper(root.right, low, high);
        if (root.val > high) return rangeLeavesHelper(root.left,  low, high);
        if (root.left == null && root.right == null) return 1;                                                                              // leaf
        int leftLeaves  = rangeLeavesHelper(root.left,  low, high);
        int rightLeaves = rangeLeavesHelper(root.right, low, high);
        root.val = leftLeaves + rightLeaves;                                                                                                 // mutate
        return root.val;
    }

    public void rangeLeaves(TreeNode root, int low, int high) {
        rangeLeavesHelper(root, low, high);
    }
}
```

```c,editable
int rangeLeavesHelper(struct TreeNode *root, int low, int high) {
    if (root == NULL)     return 0;
    if (root->val < low)  return rangeLeavesHelper(root->right, low, high);
    if (root->val > high) return rangeLeavesHelper(root->left,  low, high);
    if (!root->left && !root->right) return 1;                                                                                                // leaf
    int leftLeaves  = rangeLeavesHelper(root->left,  low, high);
    int rightLeaves = rangeLeavesHelper(root->right, low, high);
    root->val = leftLeaves + rightLeaves;
    return root->val;
}

void rangeLeaves(struct TreeNode *root, int low, int high) {
    rangeLeavesHelper(root, low, high);
}
```

```cpp,editable
class Solution {
public:
    int rangeLeavesHelper(TreeNode *root, int low, int high) {
        if (!root)              return 0;
        if (root->val < low)    return rangeLeavesHelper(root->right, low, high);
        if (root->val > high)   return rangeLeavesHelper(root->left,  low, high);
        if (!root->left && !root->right) return 1;                                                                                              // leaf
        int leftLeaves  = rangeLeavesHelper(root->left,  low, high);
        int rightLeaves = rangeLeavesHelper(root->right, low, high);
        root->val = leftLeaves + rightLeaves;
        return root->val;
    }

    void rangeLeaves(TreeNode *root, int low, int high) {
        rangeLeavesHelper(root, low, high);
    }
};
```

```scala,editable
object Solution {
  def rangeLeavesHelper(root: TreeNode, low: Int, high: Int): Int = {
    if (root == null)           return 0
    if (root.value < low)       return rangeLeavesHelper(root.right, low, high)
    if (root.value > high)      return rangeLeavesHelper(root.left,  low, high)
    if (root.left == null && root.right == null) return 1                                                                                          // leaf
    val leftLeaves  = rangeLeavesHelper(root.left,  low, high)
    val rightLeaves = rangeLeavesHelper(root.right, low, high)
    root.value = leftLeaves + rightLeaves
    root.value
  }

  def rangeLeaves(root: TreeNode, low: Int, high: Int): Unit = {
    rangeLeavesHelper(root, low, high)
  }
}
```

```typescript,editable
class Solution {
  rangeLeavesHelper(root: TreeNode | null, low: number, high: number): number {
    if (root === null)         return 0;
    if (root.val < low)        return this.rangeLeavesHelper(root.right, low, high);
    if (root.val > high)       return this.rangeLeavesHelper(root.left,  low, high);
    if (root.left === null && root.right === null) return 1;                                                                                         // leaf
    const leftLeaves  = this.rangeLeavesHelper(root.left,  low, high);
    const rightLeaves = this.rangeLeavesHelper(root.right, low, high);
    root.val = leftLeaves + rightLeaves;
    return root.val;
  }

  rangeLeaves(root: TreeNode | null, low: number, high: number): void {
    this.rangeLeavesHelper(root, low, high);
  }
}
```

```go,editable
func rangeLeavesHelper(root *TreeNode, low, high int) int {
    if root == nil       { return 0 }
    if root.Val < low    { return rangeLeavesHelper(root.Right, low, high) }
    if root.Val > high   { return rangeLeavesHelper(root.Left,  low, high) }
    if root.Left == nil && root.Right == nil { return 1 }                                                                                              // leaf
    leftLeaves  := rangeLeavesHelper(root.Left,  low, high)
    rightLeaves := rangeLeavesHelper(root.Right, low, high)
    root.Val = leftLeaves + rightLeaves
    return root.Val
}

func rangeLeaves(root *TreeNode, low, high int) {
    rangeLeavesHelper(root, low, high)
}
```

```rust,editable
use std::rc::Rc;
use std::cell::RefCell;
type Tree = Option<Rc<RefCell<TreeNode>>>;

impl Solution {
    pub fn range_leaves(root: Tree, low: i32, high: i32) {
        Self::helper(root, low, high);
    }

    fn helper(root: Tree, low: i32, high: i32) -> i32 {
        match root {
            None => 0,
            Some(n) => {
                let v = n.borrow().val;
                if v < low  { return Self::helper(n.borrow().right.clone(), low, high); }
                if v > high { return Self::helper(n.borrow().left.clone(),  low, high); }
                let (left_clone, right_clone) = (n.borrow().left.clone(), n.borrow().right.clone());
                if left_clone.is_none() && right_clone.is_none() { return 1; }
                let lc = Self::helper(left_clone,  low, high);
                let rc = Self::helper(right_clone, low, high);
                n.borrow_mut().val = lc + rc;
                n.borrow().val
            }
        }
    }
}
```

</div>

***

# Range exclusive trim

## Problem Statement

Given the **root** of a BST and two values `low` and `high`, return a new BST that contains *only* the nodes whose values lie in `[low, high]`. The relative structure must be preserved — if `A` was a descendant of `B` in the original and both survive the trim, `A` must remain a descendant of `B` in the result.

### Example 1

> - **Input:** `root = [4, 2, 5, 1, 3, null, 6]`, `low = 2`, `high = 5`
> - **Output:** `[4, 2, 5, null, 3]`

### Example 2

> - **Input:** `root = [5, 1, 8, null, null, 6, 9]`, `low = 6`, `high = 9`
> - **Output:** `[8, 6, 9]`

## The Strategy

The same pruning rules drive a *structural rewrite*:

- If `node.val < low`, the entire left subtree is out of range; we **don't recurse left** at all. Return the trim of the right subtree as our replacement.
- If `node.val > high`, mirror — return the trim of the left subtree.
- Otherwise (`node.val` in range), the node survives. Trim both children recursively and re-attach.

The `return` value is the new root of *this* subtree after trimming, which the caller wires back into its own children pointers — exactly the same shape as the recursive insertion idiom we used in lesson 5.

## The Solution

<div class="lang-tabs">

```pseudocode
function rangeExclusiveTrim(root, low, high):
    if root is null: return null
    if root.val < low:                              # node + left subtree all out of range
        return rangeExclusiveTrim(root.right, low, high)
    if root.val > high:                             # node + right subtree all out of range
        return rangeExclusiveTrim(root.left, low, high)
    # In range — keep this node, but trim its children
    root.left  ← rangeExclusiveTrim(root.left,  low, high)
    root.right ← rangeExclusiveTrim(root.right, low, high)
    return root
```

```python,editable
class Solution:
    def range_exclusive_trim(self, root, low, high):
        if root is None:
            return None
        # Node too small → drop it AND its whole left subtree; return the trimmed right.
        if root.val < low:
            return self.range_exclusive_trim(root.right, low, high)
        # Node too large → drop it AND its whole right subtree; return the trimmed left.
        if root.val > high:
            return self.range_exclusive_trim(root.left, low, high)
        # In range: keep the node, trim both children, re-attach the results.
        root.left  = self.range_exclusive_trim(root.left,  low, high)
        root.right = self.range_exclusive_trim(root.right, low, high)
        return root
```

```java,editable
class Solution {
    public TreeNode rangeExclusiveTrim(TreeNode root, int low, int high) {
        if (root == null) return null;
        if (root.val < low)  return rangeExclusiveTrim(root.right, low, high);                                                                                // drop node + left subtree
        if (root.val > high) return rangeExclusiveTrim(root.left,  low, high);                                                                                // drop node + right subtree
        root.left  = rangeExclusiveTrim(root.left,  low, high);                                                                                                // trim and re-attach
        root.right = rangeExclusiveTrim(root.right, low, high);
        return root;
    }
}
```

```c,editable
struct TreeNode *rangeExclusiveTrim(struct TreeNode *root, int low, int high) {
    if (root == NULL)     return NULL;
    if (root->val < low)  return rangeExclusiveTrim(root->right, low, high);
    if (root->val > high) return rangeExclusiveTrim(root->left,  low, high);
    root->left  = rangeExclusiveTrim(root->left,  low, high);
    root->right = rangeExclusiveTrim(root->right, low, high);
    return root;
}
```

```cpp,editable
class Solution {
public:
    TreeNode *rangeExclusiveTrim(TreeNode *root, int low, int high) {
        if (!root)              return nullptr;
        if (root->val < low)    return rangeExclusiveTrim(root->right, low, high);
        if (root->val > high)   return rangeExclusiveTrim(root->left,  low, high);
        root->left  = rangeExclusiveTrim(root->left,  low, high);
        root->right = rangeExclusiveTrim(root->right, low, high);
        return root;
    }
};
```

```scala,editable
object Solution {
  def rangeExclusiveTrim(root: TreeNode, low: Int, high: Int): TreeNode = {
    if (root == null)           return null
    if (root.value < low)       return rangeExclusiveTrim(root.right, low, high)
    if (root.value > high)      return rangeExclusiveTrim(root.left,  low, high)
    root.left  = rangeExclusiveTrim(root.left,  low, high)
    root.right = rangeExclusiveTrim(root.right, low, high)
    root
  }
}
```

```typescript,editable
function rangeExclusiveTrim(root: TreeNode | null, low: number, high: number): TreeNode | null {
  if (root === null)        return null;
  if (root.val < low)       return rangeExclusiveTrim(root.right, low, high);
  if (root.val > high)      return rangeExclusiveTrim(root.left,  low, high);
  root.left  = rangeExclusiveTrim(root.left,  low, high);
  root.right = rangeExclusiveTrim(root.right, low, high);
  return root;
}
```

```go,editable
func rangeExclusiveTrim(root *TreeNode, low, high int) *TreeNode {
    if root == nil       { return nil }
    if root.Val < low    { return rangeExclusiveTrim(root.Right, low, high) }
    if root.Val > high   { return rangeExclusiveTrim(root.Left,  low, high) }
    root.Left  = rangeExclusiveTrim(root.Left,  low, high)
    root.Right = rangeExclusiveTrim(root.Right, low, high)
    return root
}
```

```rust,editable
use std::rc::Rc;
use std::cell::RefCell;
type Tree = Option<Rc<RefCell<TreeNode>>>;

impl Solution {
    pub fn range_exclusive_trim(root: Tree, low: i32, high: i32) -> Tree {
        match root {
            None => None,
            Some(n) => {
                let v = n.borrow().val;
                if v < low {
                    let r = n.borrow().right.clone();
                    return Self::range_exclusive_trim(r, low, high);
                }
                if v > high {
                    let l = n.borrow().left.clone();
                    return Self::range_exclusive_trim(l, low, high);
                }
                let l = n.borrow().left.clone();
                let r = n.borrow().right.clone();
                n.borrow_mut().left  = Self::range_exclusive_trim(l, low, high);
                n.borrow_mut().right = Self::range_exclusive_trim(r, low, high);
                Some(n)
            }
        }
    }
}
```

</div>

<details>
<summary><strong>Trace — root = [4, 2, 5, 1, 3, null, 6], range = [2, 5]</strong></summary>

```
trim(4, [2,5]) │ 4 in range → trim(2), trim(5), keep 4
trim(2, [2,5]) │ 2 in range → trim(1), trim(3), keep 2
trim(1, [2,5]) │ 1 < 2  → drop 1 (and its subtree); return trim(null) = null
trim(3, [2,5]) │ 3 in range → trim(null), trim(null) → keep 3 as leaf
trim(5, [2,5]) │ 5 in range → trim(null), trim(6), keep 5
trim(6, [2,5]) │ 6 > 5  → drop 6; return trim(null) = null
After all trims: [4, 2, 5, null, 3, null, null] ≡ [4, 2, 5, null, 3] ✓
```

</details>

***

## Final Takeaway

Range Postorder = postorder + BST pruning. Whenever a problem asks for an aggregate (sum, count, height, structural rewrite) over the nodes of a BST whose values fall in a range, this is the right tool. The pruning rules collapse out-of-range subtrees in O(1) — not by walking them — and the postorder structure cleanly reduces children's results into a parent's.

Three patterns to keep:

1. **The "two prunes + recurse" structure** is universal for range-bounded BST problems. Once you internalise it, range sum / range count / range diameter / range trim all collapse to a 4-line skeleton with one problem-specific reduction.
2. **Postorder is for "value depends on what's below me"** — diameter, sum, count of leaves, validity checks like "subtree is BST", segment-tree-style queries. Whenever the parent's answer is computed *from* the children's, you're in postorder territory.
3. **Returning the trimmed subtree to the parent** is the same idiom we used for insertion (lesson 5) and deletion (lesson 6): every recursive call returns a pointer to the (possibly modified) subtree, and the caller wires it into its own pointer field.

The next lesson swaps **one descent** for **two pointers** — running a forward iterator and a reverse iterator simultaneously across the BST's sorted sequence. That single move unlocks the classic "two values that sum to target" family of problems on a tree, in O(n) time and O(h) space.
