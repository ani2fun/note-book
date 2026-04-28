# 5. Insertion in Binary Search Trees

## The Hook

So far, we've only *read* from a BST — search, min, max, lower bound, upper bound. The tree was a fixed object we descended into. Now we make it **alive**: every insertion has to slot a new value into the tree *while preserving* the binary search property at every node it touches.

Here's the beautiful part: insertion is *almost free*. We've already done the hard work in lessons 3 and 4. Searching for a value that *isn't* there walks all the way down to a `null` leaf — and **that is the exact slot the new node belongs in**. So insertion = search + one pointer assignment.

This lesson covers the recursive and iterative versions. Both run in O(h), both touch a single root-to-leaf path, and both let us turn a static structure into a dynamic one.

---

## Table of Contents

1. [Understanding recursive insertion](#understanding-recursive-insertion)
2. [Recursive insertion](#recursive-insertion)
3. [Understanding iterative insertion](#understanding-iterative-insertion)
4. [Iterative insertion](#iterative-insertion)

***

# Understanding recursive insertion

To insert a value `v` into a BST, do the following thought experiment: *pretend* `v` is already in the tree, and search for it. Where does the search end? At a `null` child of some node — the *only* place `v` could legally live without breaking the BST rule. That's where you create the new node.

> Insertion = search + create new node at the slot where the search runs out.

## Algorithm

The recursive version is a two-step process expressed as a single function:

> **Algorithm**
>
> - **Step 1:** If the `current` node is `null`, create a new node with the given value and return it.
> - **Step 2:** If the new value is less than `current.val`, recurse on the **left** subtree, then store the result back into `current.left`.
> - **Step 3:** Else recurse on the **right** subtree, store the result back into `current.right`.
> - **Step 4:** Return `current`.

The "store the result back" step is the key trick: every recursive call returns *the (possibly new) subtree*, and the parent uses that return value to update its child pointer. When we hit the null slot, we return a freshly allocated node — and the parent's `current.left = ...` (or `.right = ...`) wires it in.

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
    A["insert(node, v)"] --> B{"node == null?"}
    B -->|Yes| C["return new TreeNode(v)"]
    B -->|No| D{"v &lt; node.val?"}
    D -->|Yes| E["node.left = insert(node.left, v)"]
    D -->|No| F["node.right = insert(node.right, v)"]
    E --> G["return node"]
    F --> G
    style C fill:#bbf7d0,stroke:#16a34a
```

<p align="center"><strong>The recursive insertion equation. The base case <em>creates</em> the new node; every other case wires the returned subtree back into the parent.</strong></p>

## A worked example

Insert `25` into the tree below.

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
    subgraph Before["Before insert(25)"]
        R1((50))
        A1((30))
        B1((70))
        C1((20))
        D1((40))
        R1 --> A1
        R1 --> B1
        A1 --> C1
        A1 --> D1
    end
    subgraph After["After insert(25)"]
        R2((50))
        A2((30))
        B2((70))
        C2((20))
        D2((40))
        E2((25))
        R2 --> A2
        R2 --> B2
        A2 --> C2
        A2 --> D2
        C2 --> E2
        style E2 fill:#bbf7d0,stroke:#16a34a
    end
```

<p align="center"><strong>Walk: <code>50</code> (25 &lt; 50, go left) → <code>30</code> (25 &lt; 30, go left) → <code>20</code> (25 &gt; 20, go right) → <code>null</code>. Allocate <code>25</code> as the right child of <code>20</code>.</strong></p>

The path the search would have taken — `50, 30, 20` — and the side it tried to step into — *right of 20* — together specify the exact insertion slot.

## Complexity

| Case | Time | Space |
|---|---|---|
| Best (balanced) | O(log n) | O(log n) |
| Worst (skewed) | O(n) | O(n) |

The space cost is the recursion stack along the descent path.

***

# Recursive insertion

## Problem Statement

Given the **root** of a binary search tree and a **data** value, insert a new node with the given value and return the root of the updated tree.

You must do this **recursively**.

### Example 1

> - **Input:** `root = [5, 4, 6, 2, null, null, 7]`, `data = 10`
> - **Output:** `[5, 4, 6, 2, null, null, 7, null, null, null, 10]`
> - **Explanation:** Walk: 5 (10 > 5, right) → 6 (10 > 6, right) → 7 (10 > 7, right) → null. Insert 10 as right child of 7.

### Example 2

> - **Input:** `root = [10, 8, 14, 5, null, 12, 17]`, `data = 9`
> - **Output:** `[10, 8, 14, 5, 9, 12, 17]`
> - **Explanation:** Walk: 10 (9 < 10, left) → 8 (9 > 8, right) → null. Insert 9 as right child of 8.

## The Solution

<div class="lang-tabs">

```python,editable
class Solution:
    def recursive_insertion(self, root, data):
        # Base case: empty slot — this is where data belongs.
        if root is None:
            return TreeNode(data)
        # BST rule: smaller values live in the left subtree.
        if data < root.val:
            root.left = self.recursive_insertion(root.left, data)
        else:
            # Equal-or-greater goes right. (Many libraries reject duplicates instead;
            # this version permits them by sending equality to the right subtree.)
            root.right = self.recursive_insertion(root.right, data)
        # Return the (possibly unchanged) subtree so the parent can re-attach it.
        return root
```

```java,editable
class Solution {
    public TreeNode recursiveInsertion(TreeNode root, int data) {
        if (root == null) return new TreeNode(data);                            // empty slot
        if (data < root.val)
            root.left  = recursiveInsertion(root.left,  data);                  // BST rule: left
        else
            root.right = recursiveInsertion(root.right, data);                  //          right
        return root;                                                            // re-attach
    }
}
```

```c,editable
#include <stdlib.h>

struct TreeNode *recursiveInsertion(struct TreeNode *root, int data) {
    if (root == NULL) {                                                         // empty slot
        struct TreeNode *node = malloc(sizeof(*node));
        node->val = data; node->left = node->right = NULL;
        return node;
    }
    if (data < root->val)
        root->left  = recursiveInsertion(root->left,  data);                    // BST rule: left
    else
        root->right = recursiveInsertion(root->right, data);                    //          right
    return root;                                                                // re-attach
}
```

```cpp,editable
class Solution {
public:
    TreeNode *recursiveInsertion(TreeNode *root, int data) {
        if (root == nullptr) return new TreeNode(data);                          // empty slot
        if (data < root->val)
            root->left  = recursiveInsertion(root->left,  data);                 // BST rule: left
        else
            root->right = recursiveInsertion(root->right, data);                 //          right
        return root;                                                             // re-attach
    }
};
```

```scala,editable
object Solution {
  def recursiveInsertion(root: TreeNode, data: Int): TreeNode = {
    if (root == null) new TreeNode(data)                                          // empty slot
    else {
      if (data < root.value) root.left  = recursiveInsertion(root.left,  data)    // BST rule: left
      else                   root.right = recursiveInsertion(root.right, data)    //          right
      root                                                                        // re-attach
    }
  }
}
```

```javascript,editable
function recursiveInsertion(root, data) {
  if (root === null) return new TreeNode(data);                                    // empty slot
  if (data < root.val)
    root.left  = recursiveInsertion(root.left,  data);                             // BST rule: left
  else
    root.right = recursiveInsertion(root.right, data);                             //          right
  return root;                                                                     // re-attach
}
```

```typescript,editable
function recursiveInsertion(root: TreeNode | null, data: number): TreeNode {
  if (root === null) return new TreeNode(data);                                    // empty slot
  if (data < root.val)
    root.left  = recursiveInsertion(root.left,  data);                             // BST rule: left
  else
    root.right = recursiveInsertion(root.right, data);                             //          right
  return root;                                                                     // re-attach
}
```

```go,editable
func recursiveInsertion(root *TreeNode, data int) *TreeNode {
    if root == nil {                                                                // empty slot
        return &TreeNode{Val: data}
    }
    if data < root.Val {
        root.Left  = recursiveInsertion(root.Left,  data)                          // BST rule: left
    } else {
        root.Right = recursiveInsertion(root.Right, data)                          //          right
    }
    return root                                                                    // re-attach
}
```

```kotlin,editable
class Solution {
    fun recursiveInsertion(root: TreeNode?, data: Int): TreeNode {
        if (root == null) return TreeNode(data)                                       // empty slot
        if (data < root.`val`)
            root.left  = recursiveInsertion(root.left,  data)                          // BST rule: left
        else
            root.right = recursiveInsertion(root.right, data)                          //          right
        return root                                                                    // re-attach
    }
}
```

```rust,editable
use std::rc::Rc;
use std::cell::RefCell;
type Tree = Option<Rc<RefCell<TreeNode>>>;

impl Solution {
    pub fn recursive_insertion(root: Tree, data: i32) -> Tree {
        match root {
            None => Some(Rc::new(RefCell::new(TreeNode::new(data)))),                   // empty slot
            Some(node) => {
                {
                    let mut n = node.borrow_mut();
                    if data < n.val {
                        n.left  = Self::recursive_insertion(n.left.take(),  data);       // BST rule: left
                    } else {
                        n.right = Self::recursive_insertion(n.right.take(), data);       //          right
                    }
                }
                Some(node)                                                                // re-attach
            }
        }
    }
}
```

</div>

***

# Understanding iterative insertion

The iterative version is the same descent, but instead of letting recursion remember the parent pointer, we keep a `current` pointer and look one step ahead before descending.

## Algorithm

> **Algorithm**
>
> - **Step 1:** If `root` is `null`, create and return a new node — done.
> - **Step 2:** Let `current = root`.
> - **Step 3:** Loop:
>   - If `data < current.val`:
>     - If `current.left == null`, set `current.left = new TreeNode(data)`, return root.
>     - Else `current = current.left`.
>   - Else:
>     - If `current.right == null`, set `current.right = new TreeNode(data)`, return root.
>     - Else `current = current.right`.
> - **Step 4:** Return `root`.

The trick is checking the *child* before stepping into it. If the child is `null`, that's the slot — attach the new node and return. Otherwise, descend.

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
    A["root == null?"] -->|Yes| B["return new TreeNode(data)"]
    A -->|No| C["current = root"]
    C --> D{"data &lt; current.val?"}
    D -->|Yes| E{"current.left == null?"}
    E -->|Yes| F["current.left = new TreeNode(data)<br/>return root"]
    E -->|No| G["current = current.left"]
    G --> D
    D -->|No| H{"current.right == null?"}
    H -->|Yes| I["current.right = new TreeNode(data)<br/>return root"]
    H -->|No| J["current = current.right"]
    J --> D
    style B fill:#bbf7d0,stroke:#16a34a
    style F fill:#bbf7d0,stroke:#16a34a
    style I fill:#bbf7d0,stroke:#16a34a
```

<p align="center"><strong>Iterative insertion descends until it finds a null child. The new node attaches to the current node directly — no extra memory beyond a single pointer.</strong></p>

## Complexity

| Case | Time | Space |
|---|---|---|
| Best (balanced) | O(log n) | **O(1)** |
| Worst (skewed) | O(n) | **O(1)** |

Same time as recursive, but constant extra space — no call stack to worry about.

***

# Iterative insertion

## Problem Statement

Given the **root** of a binary search tree and a **data** value, insert a new node with the given value and return the root of the updated tree.

You must do this **iteratively**.

### Example 1

> - **Input:** `root = [5, 4, 6, 2, null, null, 7]`, `data = 10`
> - **Output:** `[5, 4, 6, 2, null, null, 7, null, null, null, 10]`

### Example 2

> - **Input:** `root = [10, 8, 14, 5, null, 12, 17]`, `data = 9`
> - **Output:** `[10, 8, 14, 5, 9, 12, 17]`

## The Solution

<div class="lang-tabs">

```python,editable
class Solution:
    def iterative_insertion(self, root, data):
        # Empty tree → the new node becomes the root.
        if root is None:
            return TreeNode(data)

        current = root
        while True:
            # Descend in the BST direction; check the child *before* stepping in.
            if data < current.val:
                if current.left is None:
                    # Found an empty slot on the left — wire the new node in.
                    current.left = TreeNode(data)
                    return root
                current = current.left            # otherwise descend left
            else:
                if current.right is None:
                    # Empty slot on the right — wire it in.
                    current.right = TreeNode(data)
                    return root
                current = current.right           # otherwise descend right
```

```java,editable
class Solution {
    public TreeNode iterativeInsertion(TreeNode root, int data) {
        if (root == null) return new TreeNode(data);                                // empty tree
        TreeNode current = root;
        while (true) {
            if (data < current.val) {                                               // go left
                if (current.left == null) {                                         // empty slot
                    current.left = new TreeNode(data);
                    return root;
                }
                current = current.left;                                             // descend left
            } else {                                                                // go right
                if (current.right == null) {                                        // empty slot
                    current.right = new TreeNode(data);
                    return root;
                }
                current = current.right;                                            // descend right
            }
        }
    }
}
```

```c,editable
#include <stdlib.h>

static struct TreeNode *make_node(int v) {
    struct TreeNode *node = malloc(sizeof(*node));
    node->val = v; node->left = node->right = NULL;
    return node;
}

struct TreeNode *iterativeInsertion(struct TreeNode *root, int data) {
    if (root == NULL) return make_node(data);                                        // empty tree
    struct TreeNode *current = root;
    for (;;) {
        if (data < current->val) {                                                   // go left
            if (current->left == NULL) {                                             // empty slot
                current->left = make_node(data);
                return root;
            }
            current = current->left;                                                 // descend left
        } else {                                                                     // go right
            if (current->right == NULL) {                                            // empty slot
                current->right = make_node(data);
                return root;
            }
            current = current->right;                                                // descend right
        }
    }
}
```

```cpp,editable
class Solution {
public:
    TreeNode *iterativeInsertion(TreeNode *root, int data) {
        if (root == nullptr) return new TreeNode(data);                                // empty tree
        TreeNode *current = root;
        while (true) {
            if (data < current->val) {                                                 // go left
                if (current->left == nullptr) {                                        // empty slot
                    current->left = new TreeNode(data);
                    return root;
                }
                current = current->left;                                               // descend left
            } else {                                                                   // go right
                if (current->right == nullptr) {                                       // empty slot
                    current->right = new TreeNode(data);
                    return root;
                }
                current = current->right;                                              // descend right
            }
        }
    }
};
```

```scala,editable
object Solution {
  def iterativeInsertion(root: TreeNode, data: Int): TreeNode = {
    if (root == null) return new TreeNode(data)                                          // empty tree
    var current = root
    while (true) {
      if (data < current.value) {                                                        // go left
        if (current.left == null) {                                                      // empty slot
          current.left = new TreeNode(data)
          return root
        }
        current = current.left                                                           // descend left
      } else {                                                                           // go right
        if (current.right == null) {                                                     // empty slot
          current.right = new TreeNode(data)
          return root
        }
        current = current.right                                                          // descend right
      }
    }
    root  // unreachable; appeases the compiler
  }
}
```

```javascript,editable
function iterativeInsertion(root, data) {
  if (root === null) return new TreeNode(data);                                            // empty tree
  let current = root;
  while (true) {
    if (data < current.val) {                                                              // go left
      if (current.left === null) {                                                         // empty slot
        current.left = new TreeNode(data);
        return root;
      }
      current = current.left;                                                              // descend left
    } else {                                                                               // go right
      if (current.right === null) {                                                        // empty slot
        current.right = new TreeNode(data);
        return root;
      }
      current = current.right;                                                             // descend right
    }
  }
}
```

```typescript,editable
function iterativeInsertion(root: TreeNode | null, data: number): TreeNode {
  if (root === null) return new TreeNode(data);                                              // empty tree
  let current: TreeNode = root;
  while (true) {
    if (data < current.val) {                                                                // go left
      if (current.left === null) {                                                           // empty slot
        current.left = new TreeNode(data);
        return root;
      }
      current = current.left;                                                                // descend left
    } else {                                                                                 // go right
      if (current.right === null) {                                                          // empty slot
        current.right = new TreeNode(data);
        return root;
      }
      current = current.right;                                                               // descend right
    }
  }
}
```

```go,editable
func iterativeInsertion(root *TreeNode, data int) *TreeNode {
    if root == nil { return &TreeNode{Val: data} }                                              // empty tree
    current := root
    for {
        if data < current.Val {                                                                  // go left
            if current.Left == nil {                                                             // empty slot
                current.Left = &TreeNode{Val: data}
                return root
            }
            current = current.Left                                                               // descend left
        } else {                                                                                 // go right
            if current.Right == nil {                                                            // empty slot
                current.Right = &TreeNode{Val: data}
                return root
            }
            current = current.Right                                                              // descend right
        }
    }
}
```

```kotlin,editable
class Solution {
    fun iterativeInsertion(root: TreeNode?, data: Int): TreeNode {
        if (root == null) return TreeNode(data)                                                    // empty tree
        var current = root
        while (true) {
            if (data < current.`val`) {                                                            // go left
                if (current.left == null) {                                                        // empty slot
                    current.left = TreeNode(data)
                    return root
                }
                current = current.left!!                                                           // descend left
            } else {                                                                               // go right
                if (current.right == null) {                                                       // empty slot
                    current.right = TreeNode(data)
                    return root
                }
                current = current.right!!                                                          // descend right
            }
        }
    }
}
```

```rust,editable
use std::rc::Rc;
use std::cell::RefCell;
type Tree = Option<Rc<RefCell<TreeNode>>>;

impl Solution {
    pub fn iterative_insertion(root: Tree, data: i32) -> Tree {
        if root.is_none() {                                                                        // empty tree
            return Some(Rc::new(RefCell::new(TreeNode::new(data))));
        }
        let mut current = root.clone();
        loop {
            let cur = current.clone().unwrap();
            let mut n = cur.borrow_mut();
            if data < n.val {                                                                      // go left
                if n.left.is_none() {                                                              // empty slot
                    n.left = Some(Rc::new(RefCell::new(TreeNode::new(data))));
                    return root;
                }
                current = n.left.clone();                                                          // descend left
            } else {                                                                               // go right
                if n.right.is_none() {                                                             // empty slot
                    n.right = Some(Rc::new(RefCell::new(TreeNode::new(data))));
                    return root;
                }
                current = n.right.clone();                                                         // descend right
            }
        }
    }
}
```

</div>

<details>
<summary><strong>Trace — root = [50, 30, 70, 20, 40], data = 25</strong></summary>

```
Step 1 │ current = 50 │ 25 < 50  → check current.left (30) → not null → current = 30
Step 2 │ current = 30 │ 25 < 30  → check current.left (20) → not null → current = 20
Step 3 │ current = 20 │ 25 ≥ 20  → check current.right (null) → SLOT FOUND
        attach: 20.right = new TreeNode(25)
Result: tree now has 25 as the right child of 20 ✓
```

</details>

***

## Final Takeaway

Insertion in a BST is just **search that doesn't fail** — instead of returning `null` when the descent walks off the tree, we *create a node* and wire it into the parent's child pointer. Single root-to-leaf path. O(h) time. The recursive version returns the (possibly new) subtree at every level so the parent can re-attach it; the iterative version peeks at the child before descending so it can attach in-place.

Two patterns worth keeping:

1. **Search that creates on miss** — the same shape powers insert in tries, hash chains, and even disk B-trees.
2. **"Return the subtree, parent re-attaches"** — a recursion idiom you'll use again in deletion (next lesson) and in tree-reshaping problems generally.

Two non-obvious points to remember:

- **Insertion order matters.** Inserting the same set of values in different orders gives different tree shapes — *and* different heights. Sorted input → skewed disaster. Random input → roughly balanced. We'll quantify this in the next lesson on construction.
- **Duplicates have no canonical home.** Some libraries reject them, some send them right (this lesson), some send them left, some allow multi-sets. Whichever rule you pick, *be consistent* — every operation (insert, delete, search) must agree.

Now that we can grow a BST, the next reasonable question is: how do we *shrink* it? Removing a value is much trickier than adding one — especially when the doomed node has two children. That's the next lesson.
