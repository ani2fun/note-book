# 14. Pattern: Level-Order Traversal

## The Hook

Every pattern in the chapter so far has been **depth-first**. The recursion barrels down one branch all the way to a leaf, then unwinds, then plunges down the next. That's a beautifully recursive shape, and it's what makes preorder, inorder, and postorder all natural fits for the recursive structure of a tree.

But many real questions about trees aren't *vertical* — they're **horizontal**. *"What's the largest value at each level?"* requires you to fan out across all the nodes at depth 0, then all at depth 1, then all at depth 2. *"Is this a complete binary tree?"* requires walking left-to-right across each level, looking for gaps. *"What does the tree look like from the top? from the side?"* requires processing nodes level by level. None of these questions can be answered cleanly by depth-first traversal — you'd have to do all the depth-first work, then group your results by depth as a post-processing step.

The natural fit for these *horizontal* questions is **breadth-first search** — the level-order traversal you saw in lesson 5, powered by a *queue* instead of a stack. The recursion is replaced by an explicit loop: dequeue a node, do something with it, enqueue its children. The FIFO discipline naturally produces level-by-level visit order. Once you augment the loop to track *level boundaries* — a small trick where you record `queue.size()` at the start of each iteration to know how many nodes belong to the current level — you can compute *anything per level*: sums, maxes, lists, leftmost or rightmost nodes, you name it.

This lesson defines the level-boundary template, walks through five canonical problems (per-level sum, deepest-leaves sum, completeness check, zigzag traversal, cousin check), and implements each in 10 languages.

---

## Table of contents

1. [The level-order pattern](#the-level-order-pattern)
2. [How to recognise it](#how-to-recognise-it)
3. [Problem 1 — Level sum](#problem-1--level-sum)
4. [Problem 2 — Deepest leaves sum](#problem-2--deepest-leaves-sum)
5. [Problem 3 — Complete binary tree check](#problem-3--complete-binary-tree-check)
6. [Problem 4 — Zigzag traversal](#problem-4--zigzag-traversal)
7. [Problem 5 — Cousin check](#problem-5--cousin-check)

***

# The level-order pattern

The classic level-order traversal from lesson 5 dequeues *one node at a time*. That visits everything in the right *order* but loses the *level boundaries* — once you've dequeued five nodes, you have no easy way to know which were on level 1 and which on level 2.

The fix is one of the most important small tricks in tree algorithms:

```text
while queue is non-empty:
  levelSize = queue.size()                       # snapshot how many nodes are on the current level
  for i in 0..levelSize:
    n = queue.pop()
    process(n)                                   # all work for THIS level happens here
    if n.left:  queue.push(n.left)               # enqueueing children populates the NEXT level
    if n.right: queue.push(n.right)
  # any per-level summary (sum, max, snapshot) goes here, after the inner loop
```

The genius is the **`levelSize = queue.size()`** snapshot. At the moment the outer loop's body starts, the queue holds exactly the nodes of the current level — *and nothing else*. So `queue.size()` is the number of nodes on this level, and the inner loop processes precisely that many. By the time the inner loop ends, the queue holds exactly the *next* level (because every dequeued node enqueued its children, who all live on the next level). The boundary is preserved without any per-node bookkeeping.

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
    subgraph TREE["the tree"]
        direction TB
        T1((1))
        T2((2))
        T3((3))
        T4((4))
        T5((5))
        T1 --> T2
        T1 --> T3
        T2 --> T4
        T3 --> T5
    end
    subgraph BFS["BFS with level boundaries"]
        S1["q=[1]    levelSize=1
process 1, enqueue 2,3
q=[2,3]"]
        S2["q=[2,3]  levelSize=2
process 2,3, enqueue 4,5
q=[4,5]"]
        S3["q=[4,5]  levelSize=2
process 4,5
q=[]"]
        S1 --> S2 --> S3
    end
    TREE ~~~ BFS
```

<p align="center"><strong>BFS with level boundaries — at each iteration of the outer loop, the queue holds exactly one level. The snapshot <code>levelSize = queue.size()</code> at the top of the loop is the entire trick that keeps levels separate.</strong></p>

> *Predict before reading on — what would happen if you forgot the <code>levelSize</code> snapshot and just kept dequeueing?*
>
> You'd flatten everything into a single global stream and lose the level boundaries — exactly what the basic level-order traversal from lesson 5 produces. Forgetting the snapshot is fine when you only need a flat list. It's catastrophic when you need *per-level* aggregates.

## Generic pattern in 10 languages

The "list each level's values" template — the simplest member of the family.

<div class="lang-tabs">

```python,editable
from collections import deque
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right

def levels(root: Optional[TreeNode]) -> List[List[int]]:
    out: List[List[int]] = []
    if root is None: return out
    q = deque([root])
    while q:
        level_size = len(q)
        level: List[int] = []
        for _ in range(level_size):
            n = q.popleft()
            level.append(n.val)
            if n.left:  q.append(n.left)
            if n.right: q.append(n.right)
        out.append(level)
    return out
```

```java,editable
public static List<List<Integer>> levels(TreeNode root) {
    List<List<Integer>> out = new ArrayList<>();
    if (root == null) return out;
    Queue<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int levelSize = q.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < levelSize; i++) {
            TreeNode n = q.poll();
            level.add(n.val);
            if (n.left  != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        out.add(level);
    }
    return out;
}
```

```c,editable
// Output is allocated dynamically; for brevity we assume a fixed cap.
int** levels(TreeNode *root, int *out_levels, int **out_sizes) {
    static int *out[64]; static int sizes[64]; int level_count = 0;
    if (!root) { *out_levels = 0; *out_sizes = sizes; return out; }
    TreeNode *q[1024]; int head = 0, tail = 0;
    q[tail++] = root;
    while (head < tail) {
        int level_size = tail - head;
        out[level_count] = malloc(sizeof(int) * level_size);
        sizes[level_count] = level_size;
        for (int i = 0; i < level_size; i++) {
            TreeNode *n = q[head++];
            out[level_count][i] = n->val;
            if (n->left)  q[tail++] = n->left;
            if (n->right) q[tail++] = n->right;
        }
        level_count++;
    }
    *out_levels = level_count; *out_sizes = sizes;
    return out;
}
```

```cpp,editable
#include <queue>

std::vector<std::vector<int>> levels(TreeNode *root) {
    std::vector<std::vector<int>> out;
    if (!root) return out;
    std::queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int levelSize = q.size();
        std::vector<int> level;
        for (int i = 0; i < levelSize; i++) {
            TreeNode *n = q.front(); q.pop();
            level.push_back(n->val);
            if (n->left)  q.push(n->left);
            if (n->right) q.push(n->right);
        }
        out.push_back(level);
    }
    return out;
}
```

```scala,editable
def levels(root: TreeNode): List[List[Int]] = {
  val out = scala.collection.mutable.ListBuffer[List[Int]]()
  if (root == null) return Nil
  val q = scala.collection.mutable.Queue[TreeNode](root)
  while (q.nonEmpty) {
    val levelSize = q.size
    val level = scala.collection.mutable.ListBuffer[Int]()
    for (_ <- 0 until levelSize) {
      val n = q.dequeue()
      level += n.value
      if (n.left  != null) q.enqueue(n.left)
      if (n.right != null) q.enqueue(n.right)
    }
    out += level.toList
  }
  out.toList
}
```

```javascript,editable
function levels(root) {
    const out = [];
    if (!root) return out;
    const q = [root];
    while (q.length) {
        const levelSize = q.length;
        const level = [];
        for (let i = 0; i < levelSize; i++) {
            const n = q.shift();
            level.push(n.val);
            if (n.left)  q.push(n.left);
            if (n.right) q.push(n.right);
        }
        out.push(level);
    }
    return out;
}
```

```typescript,editable
function levels(root: TreeNode | null): number[][] {
    const out: number[][] = [];
    if (!root) return out;
    const q: TreeNode[] = [root];
    while (q.length) {
        const levelSize = q.length;
        const level: number[] = [];
        for (let i = 0; i < levelSize; i++) {
            const n = q.shift()!;
            level.push(n.val);
            if (n.left)  q.push(n.left);
            if (n.right) q.push(n.right);
        }
        out.push(level);
    }
    return out;
}
```

```go,editable
func levels(root *TreeNode) [][]int {
    var out [][]int
    if root == nil { return out }
    q := []*TreeNode{root}
    for len(q) > 0 {
        levelSize := len(q)
        level := make([]int, 0, levelSize)
        for i := 0; i < levelSize; i++ {
            n := q[0]; q = q[1:]
            level = append(level, n.Val)
            if n.Left  != nil { q = append(q, n.Left) }
            if n.Right != nil { q = append(q, n.Right) }
        }
        out = append(out, level)
    }
    return out
}
```

```kotlin,editable
fun levels(root: TreeNode?): List<List<Int>> {
    val out = mutableListOf<List<Int>>()
    if (root == null) return out
    val q = ArrayDeque<TreeNode>(); q.addLast(root)
    while (q.isNotEmpty()) {
        val levelSize = q.size
        val level = mutableListOf<Int>()
        repeat(levelSize) {
            val n = q.removeFirst()
            level += n.value
            n.left ?.let { q.addLast(it) }
            n.right?.let { q.addLast(it) }
        }
        out += level
    }
    return out
}
```

```rust,editable
use std::collections::VecDeque;

pub fn levels(root: &Option<Box<TreeNode>>) -> Vec<Vec<i32>> {
    let mut out = Vec::new();
    let mut q: VecDeque<&Box<TreeNode>> = VecDeque::new();
    if let Some(r) = root { q.push_back(r); }
    while !q.is_empty() {
        let level_size = q.len();
        let mut level = Vec::with_capacity(level_size);
        for _ in 0..level_size {
            let n = q.pop_front().unwrap();
            level.push(n.val);
            if let Some(l) = &n.left  { q.push_back(l); }
            if let Some(r) = &n.right { q.push_back(r); }
        }
        out.push(level);
    }
    out
}
```

</div>

## Complexity

> **Time:** O(N). **Space:** O(W) for the queue, where W is the maximum width (worst case ~N/2 on a perfect tree).

***

# How to recognise it

The pattern fits when:

- The answer at any node depends on its **level** (depth from root) — sum per level, max per level, leftmost per level, etc.
- You need to compute something *per level* and the result is a list-of-things-by-level, or
- Structural completeness needs a *left-to-right* sweep across each level (e.g. "is this tree complete?")

Concrete cues:

- *"… per level"* — almost always BFS with the snapshot trick.
- *"deepest / shallowest level …"* — track the *last* (or first) level's data.
- *"complete / perfect / balanced check (with row-major fill)"* — left-to-right sweep checks for gaps.
- *"zigzag / spiral / boustrophedon"* — alternate direction per level.
- *"width / cousins / left view / right view"* — per-level positional questions.

Anti-pattern: if there's no notion of "level" in the question (path sums, subtree sizes, ancestry checks), depth-first patterns will be cleaner.

***

# Problem 1 — Level sum

> Return a list where the *i*-th entry is the sum of all node values at level *i*.

Apply the template directly: at the top of each outer-loop iteration, accumulate `levelSum = 0`; in the inner loop, add each node's value; after the inner loop, append `levelSum` to the output.

## Solution

<div class="lang-tabs">

```python,editable
def level_sum(root):
    out = []
    if root is None: return out
    q = deque([root])
    while q:
        sz = len(q); s = 0
        for _ in range(sz):
            n = q.popleft()
            s += n.val
            if n.left:  q.append(n.left)
            if n.right: q.append(n.right)
        out.append(s)
    return out
```

```java,editable
public static List<Integer> levelSum(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    if (root == null) return out;
    Queue<TreeNode> q = new ArrayDeque<>(); q.offer(root);
    while (!q.isEmpty()) {
        int sz = q.size(), s = 0;
        for (int i = 0; i < sz; i++) {
            TreeNode n = q.poll();
            s += n.val;
            if (n.left  != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        out.add(s);
    }
    return out;
}
```

```c,editable
int* level_sum(TreeNode *root, int *count) {
    static int out[64]; *count = 0;
    if (!root) return out;
    TreeNode *q[1024]; int h = 0, t = 0;
    q[t++] = root;
    while (h < t) {
        int sz = t - h, s = 0;
        for (int i = 0; i < sz; i++) {
            TreeNode *n = q[h++];
            s += n->val;
            if (n->left)  q[t++] = n->left;
            if (n->right) q[t++] = n->right;
        }
        out[(*count)++] = s;
    }
    return out;
}
```

```cpp,editable
std::vector<int> levelSum(TreeNode *root) {
    std::vector<int> out;
    if (!root) return out;
    std::queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        int sz = q.size(), s = 0;
        for (int i = 0; i < sz; i++) {
            TreeNode *n = q.front(); q.pop();
            s += n->val;
            if (n->left)  q.push(n->left);
            if (n->right) q.push(n->right);
        }
        out.push_back(s);
    }
    return out;
}
```

```scala,editable
def levelSum(root: TreeNode): List[Int] = {
  if (root == null) return Nil
  val out = scala.collection.mutable.ListBuffer[Int]()
  val q = scala.collection.mutable.Queue[TreeNode](root)
  while (q.nonEmpty) {
    val sz = q.size; var s = 0
    for (_ <- 0 until sz) {
      val n = q.dequeue()
      s += n.value
      if (n.left  != null) q.enqueue(n.left)
      if (n.right != null) q.enqueue(n.right)
    }
    out += s
  }
  out.toList
}
```

```javascript,editable
function levelSum(root) {
    const out = [];
    if (!root) return out;
    const q = [root];
    while (q.length) {
        let sz = q.length, s = 0;
        for (let i = 0; i < sz; i++) {
            const n = q.shift();
            s += n.val;
            if (n.left)  q.push(n.left);
            if (n.right) q.push(n.right);
        }
        out.push(s);
    }
    return out;
}
```

```typescript,editable
function levelSum(root: TreeNode | null): number[] {
    const out: number[] = [];
    if (!root) return out;
    const q: TreeNode[] = [root];
    while (q.length) {
        let sz = q.length, s = 0;
        for (let i = 0; i < sz; i++) {
            const n = q.shift()!;
            s += n.val;
            if (n.left)  q.push(n.left);
            if (n.right) q.push(n.right);
        }
        out.push(s);
    }
    return out;
}
```

```go,editable
func levelSum(root *TreeNode) []int {
    var out []int
    if root == nil { return out }
    q := []*TreeNode{root}
    for len(q) > 0 {
        sz := len(q); s := 0
        for i := 0; i < sz; i++ {
            n := q[0]; q = q[1:]
            s += n.Val
            if n.Left  != nil { q = append(q, n.Left) }
            if n.Right != nil { q = append(q, n.Right) }
        }
        out = append(out, s)
    }
    return out
}
```

```kotlin,editable
fun levelSum(root: TreeNode?): List<Int> {
    if (root == null) return emptyList()
    val out = mutableListOf<Int>()
    val q = ArrayDeque<TreeNode>(); q.addLast(root)
    while (q.isNotEmpty()) {
        val sz = q.size; var s = 0
        repeat(sz) {
            val n = q.removeFirst()
            s += n.value
            n.left ?.let { q.addLast(it) }
            n.right?.let { q.addLast(it) }
        }
        out += s
    }
    return out
}
```

```rust,editable
pub fn level_sum(root: &Option<Box<TreeNode>>) -> Vec<i32> {
    let mut out = Vec::new();
    let mut q: VecDeque<&Box<TreeNode>> = VecDeque::new();
    if let Some(r) = root { q.push_back(r); }
    while !q.is_empty() {
        let sz = q.len(); let mut s = 0;
        for _ in 0..sz {
            let n = q.pop_front().unwrap();
            s += n.val;
            if let Some(l) = &n.left  { q.push_back(l); }
            if let Some(r) = &n.right { q.push_back(r); }
        }
        out.push(s);
    }
    out
}
```

</div>

***

# Problem 2 — Deepest leaves sum

> Return the sum of the values of the leaves on the deepest level of the tree.

Same shape as level-sum, but instead of recording every level we just *overwrite* a single `levelSum` variable each iteration. After the loop ends, `levelSum` holds the sum of the deepest level. (Note: every node on the deepest level is a leaf.)

## Solution

<div class="lang-tabs">

```python,editable
def deepest_leaves_sum(root):
    if root is None: return 0
    q = deque([root]); s = 0
    while q:
        s = 0
        for _ in range(len(q)):
            n = q.popleft()
            s += n.val
            if n.left:  q.append(n.left)
            if n.right: q.append(n.right)
    return s
```

```java,editable
public static int deepestLeavesSum(TreeNode root) {
    if (root == null) return 0;
    Queue<TreeNode> q = new ArrayDeque<>(); q.offer(root);
    int s = 0;
    while (!q.isEmpty()) {
        int sz = q.size(); s = 0;
        for (int i = 0; i < sz; i++) {
            TreeNode n = q.poll();
            s += n.val;
            if (n.left  != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
    }
    return s;
}
```

```c,editable
int deepest_leaves_sum(TreeNode *root) {
    if (!root) return 0;
    TreeNode *q[1024]; int h = 0, t = 0; q[t++] = root;
    int s = 0;
    while (h < t) {
        int sz = t - h; s = 0;
        for (int i = 0; i < sz; i++) {
            TreeNode *n = q[h++];
            s += n->val;
            if (n->left)  q[t++] = n->left;
            if (n->right) q[t++] = n->right;
        }
    }
    return s;
}
```

```cpp,editable
int deepestLeavesSum(TreeNode *root) {
    if (!root) return 0;
    std::queue<TreeNode*> q; q.push(root);
    int s = 0;
    while (!q.empty()) {
        int sz = q.size(); s = 0;
        for (int i = 0; i < sz; i++) {
            TreeNode *n = q.front(); q.pop();
            s += n->val;
            if (n->left)  q.push(n->left);
            if (n->right) q.push(n->right);
        }
    }
    return s;
}
```

```scala,editable
def deepestLeavesSum(root: TreeNode): Int = {
  if (root == null) return 0
  val q = scala.collection.mutable.Queue[TreeNode](root); var s = 0
  while (q.nonEmpty) {
    val sz = q.size; s = 0
    for (_ <- 0 until sz) {
      val n = q.dequeue()
      s += n.value
      if (n.left  != null) q.enqueue(n.left)
      if (n.right != null) q.enqueue(n.right)
    }
  }
  s
}
```

```javascript,editable
function deepestLeavesSum(root) {
    if (!root) return 0;
    const q = [root]; let s = 0;
    while (q.length) {
        const sz = q.length; s = 0;
        for (let i = 0; i < sz; i++) {
            const n = q.shift();
            s += n.val;
            if (n.left)  q.push(n.left);
            if (n.right) q.push(n.right);
        }
    }
    return s;
}
```

```typescript,editable
function deepestLeavesSum(root: TreeNode | null): number {
    if (!root) return 0;
    const q: TreeNode[] = [root]; let s = 0;
    while (q.length) {
        const sz = q.length; s = 0;
        for (let i = 0; i < sz; i++) {
            const n = q.shift()!;
            s += n.val;
            if (n.left)  q.push(n.left);
            if (n.right) q.push(n.right);
        }
    }
    return s;
}
```

```go,editable
func deepestLeavesSum(root *TreeNode) int {
    if root == nil { return 0 }
    q := []*TreeNode{root}; s := 0
    for len(q) > 0 {
        sz := len(q); s = 0
        for i := 0; i < sz; i++ {
            n := q[0]; q = q[1:]
            s += n.Val
            if n.Left  != nil { q = append(q, n.Left) }
            if n.Right != nil { q = append(q, n.Right) }
        }
    }
    return s
}
```

```kotlin,editable
fun deepestLeavesSum(root: TreeNode?): Int {
    if (root == null) return 0
    val q = ArrayDeque<TreeNode>(); q.addLast(root); var s = 0
    while (q.isNotEmpty()) {
        val sz = q.size; s = 0
        repeat(sz) {
            val n = q.removeFirst()
            s += n.value
            n.left ?.let { q.addLast(it) }
            n.right?.let { q.addLast(it) }
        }
    }
    return s
}
```

```rust,editable
pub fn deepest_leaves_sum(root: &Option<Box<TreeNode>>) -> i32 {
    if root.is_none() { return 0; }
    let mut q: VecDeque<&Box<TreeNode>> = VecDeque::new();
    q.push_back(root.as_ref().unwrap());
    let mut s = 0;
    while !q.is_empty() {
        let sz = q.len(); s = 0;
        for _ in 0..sz {
            let n = q.pop_front().unwrap();
            s += n.val;
            if let Some(l) = &n.left  { q.push_back(l); }
            if let Some(r) = &n.right { q.push_back(r); }
        }
    }
    s
}
```

</div>

***

# Problem 3 — Complete binary tree check

> Return `true` iff the tree is *complete* — every level full except possibly the last, which is filled left-to-right with no gaps.

Trick: do a level-order traversal that **enqueues `null` children too** (don't skip them). Walk the queue; the moment you see a `null`, set a flag; if you ever see a *non-null* node *after* the flag is set, the tree is not complete (gap detected). If you finish without that happening, it's complete.

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
    subgraph BAD["NOT complete — gap then a node"]
        direction TB
        B1((1)) --> B2((2))
        B1 --> B3((3))
        B2 -.- BN[null]
        B3 --> B5((5))
        style BN fill:#fee2e2,stroke:#ef4444
        style B5 fill:#fee2e2,stroke:#ef4444
    end
    subgraph GOOD["complete — all nulls cluster on the right end"]
        direction TB
        G1((1)) --> G2((2))
        G1 --> G3((3))
        G2 --> G4((4))
        G2 -.- GN[null]
        G3 -.- GN2[null]
        G3 -.- GN3[null]
        style GN fill:#fee2e2,stroke:#ef4444
        style GN2 fill:#fee2e2,stroke:#ef4444
        style GN3 fill:#fee2e2,stroke:#ef4444
    end
```

<p align="center"><strong>Completeness check — enqueue every child including nulls. Walk the resulting queue; once you've seen a null, no real node may follow. The left tree fails because node 5 follows a null.</strong></p>

## Solution

<div class="lang-tabs">

```python,editable
def is_complete(root):
    if root is None: return True
    q = deque([root]); seen_null = False
    while q:
        n = q.popleft()
        if n is None:
            seen_null = True
        else:
            if seen_null: return False
            q.append(n.left); q.append(n.right)
    return True
```

```java,editable
public static boolean isComplete(TreeNode root) {
    if (root == null) return true;
    Deque<TreeNode> q = new ArrayDeque<>();
    // ArrayDeque can't store null; use LinkedList for null support, OR use a sentinel.
    Queue<TreeNode> qq = new java.util.LinkedList<>();
    qq.offer(root);
    boolean seenNull = false;
    while (!qq.isEmpty()) {
        TreeNode n = qq.poll();
        if (n == null) seenNull = true;
        else {
            if (seenNull) return false;
            qq.offer(n.left); qq.offer(n.right);
        }
    }
    return true;
}
```

```c,editable
int is_complete(TreeNode *root) {
    if (!root) return 1;
    TreeNode *q[1024]; int h = 0, t = 0;
    q[t++] = root;
    int seen_null = 0;
    while (h < t) {
        TreeNode *n = q[h++];
        if (!n) seen_null = 1;
        else {
            if (seen_null) return 0;
            q[t++] = n->left; q[t++] = n->right;
        }
    }
    return 1;
}
```

```cpp,editable
bool isComplete(TreeNode *root) {
    if (!root) return true;
    std::queue<TreeNode*> q; q.push(root);
    bool seenNull = false;
    while (!q.empty()) {
        TreeNode *n = q.front(); q.pop();
        if (!n) seenNull = true;
        else {
            if (seenNull) return false;
            q.push(n->left); q.push(n->right);
        }
    }
    return true;
}
```

```scala,editable
def isComplete(root: TreeNode): Boolean = {
  if (root == null) return true
  val q = scala.collection.mutable.Queue[TreeNode](root)
  var seenNull = false
  while (q.nonEmpty) {
    val n = q.dequeue()
    if (n == null) seenNull = true
    else {
      if (seenNull) return false
      q.enqueue(n.left); q.enqueue(n.right)
    }
  }
  true
}
```

```javascript,editable
function isComplete(root) {
    if (!root) return true;
    const q = [root]; let seenNull = false;
    while (q.length) {
        const n = q.shift();
        if (n === null) seenNull = true;
        else {
            if (seenNull) return false;
            q.push(n.left); q.push(n.right);
        }
    }
    return true;
}
```

```typescript,editable
function isComplete(root: TreeNode | null): boolean {
    if (!root) return true;
    const q: (TreeNode | null)[] = [root]; let seenNull = false;
    while (q.length) {
        const n = q.shift();
        if (n === null) seenNull = true;
        else {
            if (seenNull) return false;
            q.push(n!.left); q.push(n!.right);
        }
    }
    return true;
}
```

```go,editable
func isComplete(root *TreeNode) bool {
    if root == nil { return true }
    q := []*TreeNode{root}
    seenNull := false
    for len(q) > 0 {
        n := q[0]; q = q[1:]
        if n == nil { seenNull = true; continue }
        if seenNull { return false }
        q = append(q, n.Left, n.Right)
    }
    return true
}
```

```kotlin,editable
fun isComplete(root: TreeNode?): Boolean {
    if (root == null) return true
    val q = ArrayDeque<TreeNode?>(); q.addLast(root)
    var seenNull = false
    while (q.isNotEmpty()) {
        val n = q.removeFirst()
        if (n == null) seenNull = true
        else {
            if (seenNull) return false
            q.addLast(n.left); q.addLast(n.right)
        }
    }
    return true
}
```

```rust,editable
pub fn is_complete(root: &Option<Box<TreeNode>>) -> bool {
    if root.is_none() { return true; }
    let mut q: VecDeque<Option<&Box<TreeNode>>> = VecDeque::new();
    q.push_back(root.as_ref());
    let mut seen_null = false;
    while let Some(n) = q.pop_front() {
        match n {
            None => seen_null = true,
            Some(node) => {
                if seen_null { return false; }
                q.push_back(node.left.as_ref());
                q.push_back(node.right.as_ref());
            }
        }
    }
    true
}
```

</div>

***

# Problem 4 — Zigzag traversal

> Return the level-order traversal where the *direction* alternates per level: level 0 left-to-right, level 1 right-to-left, level 2 left-to-right, …

Same template, but pre-allocate the level array and *write into it from either end* depending on a `reverse` boolean that flips each iteration. Avoids per-level reversal at the cost of one extra index.

## Solution

<div class="lang-tabs">

```python,editable
def zigzag_traversal(root):
    out = []
    if root is None: return out
    q = deque([root]); reverse = False
    while q:
        sz = len(q)
        level = [0] * sz
        for i in range(sz):
            n = q.popleft()
            level[sz - 1 - i if reverse else i] = n.val
            if n.left:  q.append(n.left)
            if n.right: q.append(n.right)
        out.append(level)
        reverse = not reverse
    return out
```

```java,editable
public static List<List<Integer>> zigzagTraversal(TreeNode root) {
    List<List<Integer>> out = new ArrayList<>();
    if (root == null) return out;
    Queue<TreeNode> q = new ArrayDeque<>(); q.offer(root);
    boolean reverse = false;
    while (!q.isEmpty()) {
        int sz = q.size();
        Integer[] level = new Integer[sz];
        for (int i = 0; i < sz; i++) {
            TreeNode n = q.poll();
            level[reverse ? sz - 1 - i : i] = n.val;
            if (n.left  != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        out.add(Arrays.asList(level));
        reverse = !reverse;
    }
    return out;
}
```

```c,editable
// (omitted — output is a 2D array; algorithm same as above)
```

```cpp,editable
std::vector<std::vector<int>> zigzagTraversal(TreeNode *root) {
    std::vector<std::vector<int>> out;
    if (!root) return out;
    std::queue<TreeNode*> q; q.push(root);
    bool reverse = false;
    while (!q.empty()) {
        int sz = q.size();
        std::vector<int> level(sz);
        for (int i = 0; i < sz; i++) {
            TreeNode *n = q.front(); q.pop();
            level[reverse ? sz - 1 - i : i] = n->val;
            if (n->left)  q.push(n->left);
            if (n->right) q.push(n->right);
        }
        out.push_back(level);
        reverse = !reverse;
    }
    return out;
}
```

```scala,editable
def zigzagTraversal(root: TreeNode): List[List[Int]] = {
  val out = scala.collection.mutable.ListBuffer[List[Int]]()
  if (root == null) return Nil
  val q = scala.collection.mutable.Queue[TreeNode](root)
  var reverse = false
  while (q.nonEmpty) {
    val sz = q.size
    val level = Array.ofDim[Int](sz)
    for (i <- 0 until sz) {
      val n = q.dequeue()
      level(if (reverse) sz - 1 - i else i) = n.value
      if (n.left  != null) q.enqueue(n.left)
      if (n.right != null) q.enqueue(n.right)
    }
    out += level.toList
    reverse = !reverse
  }
  out.toList
}
```

```javascript,editable
function zigzagTraversal(root) {
    const out = [];
    if (!root) return out;
    const q = [root]; let reverse = false;
    while (q.length) {
        const sz = q.length;
        const level = new Array(sz);
        for (let i = 0; i < sz; i++) {
            const n = q.shift();
            level[reverse ? sz - 1 - i : i] = n.val;
            if (n.left)  q.push(n.left);
            if (n.right) q.push(n.right);
        }
        out.push(level);
        reverse = !reverse;
    }
    return out;
}
```

```typescript,editable
function zigzagTraversal(root: TreeNode | null): number[][] {
    const out: number[][] = [];
    if (!root) return out;
    const q: TreeNode[] = [root]; let reverse = false;
    while (q.length) {
        const sz = q.length;
        const level: number[] = new Array(sz);
        for (let i = 0; i < sz; i++) {
            const n = q.shift()!;
            level[reverse ? sz - 1 - i : i] = n.val;
            if (n.left)  q.push(n.left);
            if (n.right) q.push(n.right);
        }
        out.push(level);
        reverse = !reverse;
    }
    return out;
}
```

```go,editable
func zigzagTraversal(root *TreeNode) [][]int {
    var out [][]int
    if root == nil { return out }
    q := []*TreeNode{root}; reverse := false
    for len(q) > 0 {
        sz := len(q)
        level := make([]int, sz)
        for i := 0; i < sz; i++ {
            n := q[0]; q = q[1:]
            idx := i
            if reverse { idx = sz - 1 - i }
            level[idx] = n.Val
            if n.Left  != nil { q = append(q, n.Left) }
            if n.Right != nil { q = append(q, n.Right) }
        }
        out = append(out, level)
        reverse = !reverse
    }
    return out
}
```

```kotlin,editable
fun zigzagTraversal(root: TreeNode?): List<List<Int>> {
    if (root == null) return emptyList()
    val out = mutableListOf<List<Int>>()
    val q = ArrayDeque<TreeNode>(); q.addLast(root)
    var reverse = false
    while (q.isNotEmpty()) {
        val sz = q.size
        val level = IntArray(sz)
        for (i in 0 until sz) {
            val n = q.removeFirst()
            level[if (reverse) sz - 1 - i else i] = n.value
            n.left ?.let { q.addLast(it) }
            n.right?.let { q.addLast(it) }
        }
        out += level.toList()
        reverse = !reverse
    }
    return out
}
```

```rust,editable
pub fn zigzag_traversal(root: &Option<Box<TreeNode>>) -> Vec<Vec<i32>> {
    let mut out = Vec::new();
    if root.is_none() { return out; }
    let mut q: VecDeque<&Box<TreeNode>> = VecDeque::new();
    q.push_back(root.as_ref().unwrap());
    let mut reverse = false;
    while !q.is_empty() {
        let sz = q.len();
        let mut level = vec![0; sz];
        for i in 0..sz {
            let n = q.pop_front().unwrap();
            let idx = if reverse { sz - 1 - i } else { i };
            level[idx] = n.val;
            if let Some(l) = &n.left  { q.push_back(l); }
            if let Some(r) = &n.right { q.push_back(r); }
        }
        out.push(level);
        reverse = !reverse;
    }
    out
}
```

</div>

***

# Problem 5 — Cousin check

> Two nodes are *cousins* if they're at the same depth and have *different* parents. Given two values `valA` and `valB`, return `true` iff their nodes are cousins.

Augment the BFS so each enqueued item carries *both* the node and its parent. As we walk a level, look for the two target values; if both are found on the same level *and* they have different parents, return `true`. If only one is found on a level, they're not at the same depth, return `false`.

## Solution

<div class="lang-tabs">

```python,editable
def cousin_check(root, val_a, val_b):
    if root is None: return False
    q = deque([(root, None)])
    while q:
        sz = len(q); pa, pb = None, None
        for _ in range(sz):
            n, p = q.popleft()
            if n.val == val_a: pa = p
            if n.val == val_b: pb = p
            if n.left:  q.append((n.left,  n))
            if n.right: q.append((n.right, n))
        if pa and pb: return pa is not pb
        if pa or  pb: return False
    return False
```

```java,editable
static class NP { TreeNode n, p; NP(TreeNode n, TreeNode p){ this.n=n; this.p=p; } }
public static boolean cousinCheck(TreeNode root, int valA, int valB) {
    if (root == null) return false;
    Queue<NP> q = new ArrayDeque<>(); q.offer(new NP(root, null));
    while (!q.isEmpty()) {
        int sz = q.size();
        TreeNode pa = null, pb = null;
        for (int i = 0; i < sz; i++) {
            NP cur = q.poll();
            if (cur.n.val == valA) pa = cur.p;
            if (cur.n.val == valB) pb = cur.p;
            if (cur.n.left  != null) q.offer(new NP(cur.n.left,  cur.n));
            if (cur.n.right != null) q.offer(new NP(cur.n.right, cur.n));
        }
        if (pa != null && pb != null) return pa != pb;
        if (pa != null || pb != null) return false;
    }
    return false;
}
```

```c,editable
typedef struct { TreeNode *n; TreeNode *p; } NP;
int cousin_check(TreeNode *root, int valA, int valB) {
    if (!root) return 0;
    NP q[1024]; int h = 0, t = 0;
    q[t++] = (NP){root, NULL};
    while (h < t) {
        int sz = t - h;
        TreeNode *pa = NULL, *pb = NULL;
        for (int i = 0; i < sz; i++) {
            NP cur = q[h++];
            if (cur.n->val == valA) pa = cur.p;
            if (cur.n->val == valB) pb = cur.p;
            if (cur.n->left)  q[t++] = (NP){cur.n->left,  cur.n};
            if (cur.n->right) q[t++] = (NP){cur.n->right, cur.n};
        }
        if (pa && pb) return pa != pb;
        if (pa || pb) return 0;
    }
    return 0;
}
```

```cpp,editable
struct NP { TreeNode *n, *p; };
bool cousinCheck(TreeNode *root, int valA, int valB) {
    if (!root) return false;
    std::queue<NP> q; q.push({root, nullptr});
    while (!q.empty()) {
        int sz = q.size();
        TreeNode *pa = nullptr, *pb = nullptr;
        for (int i = 0; i < sz; i++) {
            NP cur = q.front(); q.pop();
            if (cur.n->val == valA) pa = cur.p;
            if (cur.n->val == valB) pb = cur.p;
            if (cur.n->left)  q.push({cur.n->left,  cur.n});
            if (cur.n->right) q.push({cur.n->right, cur.n});
        }
        if (pa && pb) return pa != pb;
        if (pa || pb) return false;
    }
    return false;
}
```

```scala,editable
def cousinCheck(root: TreeNode, valA: Int, valB: Int): Boolean = {
  if (root == null) return false
  case class NP(n: TreeNode, p: TreeNode)
  val q = scala.collection.mutable.Queue[NP](NP(root, null))
  while (q.nonEmpty) {
    val sz = q.size
    var pa: TreeNode = null; var pb: TreeNode = null
    for (_ <- 0 until sz) {
      val cur = q.dequeue()
      if (cur.n.value == valA) pa = cur.p
      if (cur.n.value == valB) pb = cur.p
      if (cur.n.left  != null) q.enqueue(NP(cur.n.left,  cur.n))
      if (cur.n.right != null) q.enqueue(NP(cur.n.right, cur.n))
    }
    if (pa != null && pb != null) return pa ne pb
    if (pa != null || pb != null) return false
  }
  false
}
```

```javascript,editable
function cousinCheck(root, valA, valB) {
    if (!root) return false;
    const q = [[root, null]];
    while (q.length) {
        const sz = q.length;
        let pa = null, pb = null;
        for (let i = 0; i < sz; i++) {
            const [n, p] = q.shift();
            if (n.val === valA) pa = p;
            if (n.val === valB) pb = p;
            if (n.left)  q.push([n.left,  n]);
            if (n.right) q.push([n.right, n]);
        }
        if (pa && pb) return pa !== pb;
        if (pa || pb) return false;
    }
    return false;
}
```

```typescript,editable
function cousinCheck(root: TreeNode | null, valA: number, valB: number): boolean {
    if (!root) return false;
    type NP = [TreeNode, TreeNode | null];
    const q: NP[] = [[root, null]];
    while (q.length) {
        const sz = q.length;
        let pa: TreeNode | null = null, pb: TreeNode | null = null;
        for (let i = 0; i < sz; i++) {
            const [n, p] = q.shift()!;
            if (n.val === valA) pa = p;
            if (n.val === valB) pb = p;
            if (n.left)  q.push([n.left,  n]);
            if (n.right) q.push([n.right, n]);
        }
        if (pa && pb) return pa !== pb;
        if (pa || pb) return false;
    }
    return false;
}
```

```go,editable
func cousinCheck(root *TreeNode, valA, valB int) bool {
    if root == nil { return false }
    type NP struct { n, p *TreeNode }
    q := []NP{{root, nil}}
    for len(q) > 0 {
        sz := len(q)
        var pa, pb *TreeNode
        for i := 0; i < sz; i++ {
            cur := q[0]; q = q[1:]
            if cur.n.Val == valA { pa = cur.p }
            if cur.n.Val == valB { pb = cur.p }
            if cur.n.Left  != nil { q = append(q, NP{cur.n.Left,  cur.n}) }
            if cur.n.Right != nil { q = append(q, NP{cur.n.Right, cur.n}) }
        }
        if pa != nil && pb != nil { return pa != pb }
        if pa != nil || pb != nil { return false }
    }
    return false
}
```

```kotlin,editable
fun cousinCheck(root: TreeNode?, valA: Int, valB: Int): Boolean {
    if (root == null) return false
    data class NP(val n: TreeNode, val p: TreeNode?)
    val q = ArrayDeque<NP>(); q.addLast(NP(root, null))
    while (q.isNotEmpty()) {
        val sz = q.size
        var pa: TreeNode? = null; var pb: TreeNode? = null
        repeat(sz) {
            val cur = q.removeFirst()
            if (cur.n.value == valA) pa = cur.p
            if (cur.n.value == valB) pb = cur.p
            cur.n.left ?.let { q.addLast(NP(it, cur.n)) }
            cur.n.right?.let { q.addLast(NP(it, cur.n)) }
        }
        if (pa != null && pb != null) return pa !== pb
        if (pa != null || pb != null) return false
    }
    return false
}
```

```rust,editable
// Cousin check is awkward in safe Rust because tracking `parent` references
// needs Rc<RefCell<...>> or unsafe pointers; the algorithm shape mirrors the
// other languages. Sketch using raw pointers:
pub fn cousin_check(root: &Option<Box<TreeNode>>, val_a: i32, val_b: i32) -> bool {
    if root.is_none() { return false; }
    let mut q: VecDeque<(*const TreeNode, *const TreeNode)> = VecDeque::new();
    q.push_back((root.as_ref().unwrap().as_ref() as *const _, std::ptr::null()));
    while !q.is_empty() {
        let sz = q.len();
        let mut pa: *const TreeNode = std::ptr::null();
        let mut pb: *const TreeNode = std::ptr::null();
        for _ in 0..sz {
            let (np, pp) = q.pop_front().unwrap();
            unsafe {
                if (*np).val == val_a { pa = pp; }
                if (*np).val == val_b { pb = pp; }
                if let Some(l) = &(*np).left  { q.push_back((l.as_ref() as *const _, np)); }
                if let Some(r) = &(*np).right { q.push_back((r.as_ref() as *const _, np)); }
            }
        }
        if !pa.is_null() && !pb.is_null() { return pa != pb; }
        if !pa.is_null() || !pb.is_null() { return false; }
    }
    false
}
```

</div>

***

## Final Takeaway

Level-order is your hammer for any *horizontal* question about a tree. Three things to walk away with:

1. **`levelSize = queue.size()` is the entire trick.** That single snapshot at the top of each outer-loop iteration is what separates "flat BFS" from "BFS with level boundaries". Once it's muscle memory, every per-level question becomes mechanical.
2. **Enqueue children, not always non-null.** For most problems (sum, max, list per level) you skip null children. For *completeness* checks you enqueue them deliberately so you can spot gaps. The choice depends on the question.
3. **Augment the queue when you need parents.** The cousin-check trick — enqueueing `(node, parent)` pairs — generalises: any per-node side-info you need (depth, column, path-from-root, sibling) can travel alongside the node. Don't try to retrofit it; bake it into the queue's element type.

> *Coming up — the next lesson takes level-order to <strong>two dimensions</strong>. Instead of grouping nodes by their <em>level</em>, we'll group by their <em>horizontal column</em> — yielding the tree's "top view", "bottom view", and "vertical traversal". Same BFS engine, an extra coordinate per queue entry.*
