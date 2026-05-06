# 11. Pattern: Merge

## The Hook

Lesson 10 taught you how to tear a list apart. This one teaches you how to sew lists back together — and between these two primitives you have the core of **merge sort**, the reason lists are the perfect target for divide-and-conquer sorting.

Merging two sorted lists into one sorted list is the "merge" in "merge sort". The naive plan: copy both lists into an array, run array merge, build a new list from the result. O(n) extra memory, two copies, three passes. You can do better. Walk both lists with two pointers, at every step take the smaller head and splice it onto the output, advance that pointer, repeat. **O(n + m) time, O(1) extra memory, original nodes re-used**. The entire merge is a ten-line loop around a dummy head.

The same skeleton generalises: alternate-fuse, k-way merge (with a heap), add-two-numbers-as-lists, merge-and-deduplicate. Every variant differs in exactly one place — the **selector function** that picks which input contributes the next node. Master the skeleton once and you'll hand-code every merge variant without referring to a textbook ever again.

---

## Table of contents

1. [Understanding the merge pattern](#understanding-the-merge-pattern)
2. [Identifying the merge pattern](#identifying-the-merge-pattern)
3. [Alternate node fusion](#alternate-node-fusion)
4. [Merge sorted lists](#merge-sorted-lists)
5. [Merge sorted lists II](#merge-sorted-lists-ii)
6. [List addition](#list-addition)

***

# Understanding the merge pattern

Like splitting a linked list into multiple lists, many linked list problems require merging multiple linked lists into one based on the outcome of some function. Also, in most cases, we must merge the lists by moving around the original nodes instead of creating copies. The linked list merging technique traverses multiple lists simultaneously and merges them in a single pass.

The merge pattern is a classification of problems that can be solved using the linked list merging technique.

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
    subgraph INPUTS["k input lists"]
        direction TB
        A["List A: 1 → 4 → 7"]
        B["List B: 2 → 5"]
        C["List C: 3 → 6"]
    end
    F{"merge function f<br/>(picks next node)"}
    OUT["Merged: 1 → 2 → 3 → 4 → 5 → 6 → 7"]
    INPUTS --> F --> OUT
```

<p align="center"><strong>The merge pattern — multiple input lists flow through a selector <code>f</code> that picks "who goes next" and appends to a single output. The selector is where each merge variant differs; the splicing skeleton is universal.</strong></p>

## Linked list merging technique

We will learn the merge technique for two lists, but it can be easily extended to merge `k` lists. Consider that we are given two singly linked lists denoted by `headA` and `headB`, and we have to merge them into a single list based on the output of some function `f`. Given any two nodes, one from each list, the function `f` decides which node goes before the other node in the merged list.

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
    A["List A: 1 → 4 → 7"]
    B["List B: 2 → 3 → 5"]
    F{"f: pick smaller<br/>of A.head, B.head"}
    OUT["Merged (sorted): 1 → 2 → 3 → 4 → 5 → 7"]
    A --> F
    B --> F
    F --> OUT
```

<p align="center"><strong>Swap out <code>f</code> and you change the problem entirely. "Pick the smaller head" → sorted-list merge. "Alternate A, B, A, B" → interleave. "Pick by summed digit" → list-addition. Same template, different selector.</strong></p>

The merge technique uses a dummy node to simplify the merging algorithm. We create a `dummy` node and a reference variable `tail` which we initialize with it. We create two references `currentA` and `currentB` and initialize them with `headA` and `headB` which we use to traverse the respective lists. We then simultaneously traverse both lists using these references and, in each iteration, apply the function `f` on nodes held in `currentA` and `currentB` to decide which node should be added to the merged list. We use the `tail` reference to easily add the node at the end of the merged list, update `tail`, and move ahead either `currentA` or `currentB` accordingly.

If either `currentA` or `currentB` hits `null`, it means we have traversed one of the lists completely, and we terminate the iterations. At this point, we identify the list that is not completely traversed and add the remaining nodes at the end of the merged lists to completely merge both lists. Consider the example below where the function `f` is a simple function that alternates (round robin) between both lists to select the node that goes to the merged list.

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
    INIT["dummy = new ListNode()<br/>tail = dummy"]
    LOOP["while any input list is non-empty:<br/>1. winner = f(current_heads)<br/>2. tail.next = winner<br/>3. tail = winner<br/>4. advance the chosen input's head"]
    DRAIN["Append any remaining non-empty input list<br/>(at most one will still have nodes)"]
    RET(["return dummy.next"])
    INIT --> LOOP --> DRAIN --> RET
```

<p align="center"><strong>The universal merge skeleton. A dummy head turns "is this the first output?" into a non-question. Each iteration, the selector <code>f</code> picks a winner, splices it, advances the input, and repeats. The drain step stitches on any leftover suffix when one input runs dry first.</strong></p>

Finally, we delete the dummy node and return the reference of the node after it as the real head of the merged list.

## Algorithm

The algorithm given below summarizes the linked list merge technique for two lists. It can be easily extended for `k` lists.

> **Algorithm**
>
> -   **Step 1:** Create a `dummy` node and initialize a `tail` reference with it.
> -   **Step 2:** Create two references `currentA` and `currentB` and initialize them with `headA` and `headB` respectively.
> -   **Step 3:** Loop while `currentA` != `null` and `currentB` != `null` and do the following:
>     -   **Step 3.1:** Apply the function `f` to the node held in `currentA` and `currentB` to decide which node to add to the merged list.
>     -   **Step 3.2:** If `currentA` has to be added, add it to the end of the merged list by updating `tail` and moving `currentA` ahead.
>     -   **Step 3.3:** If `currentB` has to be added, add it to the end of the merged list by updating `tail` and moving `currentB` ahead.
>     -   **Step 4:** If `currentA` != `null` attach the remaining list to the merged list using `tail`
>     -   **Step 5:** If `currentB` != `null` attach the remaining list to the merged list using `tail`
>     -   **Step 6:** Delete the `dummy` node and return the next node as real head of merged list.

## Implementation

Given below is the generic code implementation to merge two lists into a single list based on the outcome of a function `f`.

<div class="lang-tabs">

```pseudocode
# Generic merge template. `pickA` decides which side wins each step.
function mergeLists(headA, headB, pickA):
    dummy ← new ListNode; tail ← dummy
    curA ← headA; curB ← headB
    while curA is not null AND curB is not null:
        if pickA(curA, curB):
            tail.next ← curA; curA ← curA.next
        else:
            tail.next ← curB; curB ← curB.next
        tail ← tail.next
    tail.next ← curA if curA is not null else curB        # splice the leftover suffix in O(1)
    return dummy.next
```

```python,editable
from typing import Callable, Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_lists(head_a: Optional[ListNode], head_b: Optional[ListNode],
                pick_a: Callable[[ListNode, ListNode], bool]) -> Optional[ListNode]:
    # Dummy + tail — eliminates the "first output" special case
    dummy = ListNode()
    tail  = dummy

    cur_a, cur_b = head_a, head_b
    while cur_a is not None and cur_b is not None:
        if pick_a(cur_a, cur_b):            # selector decides the winner
            tail.next = cur_a
            cur_a     = cur_a.next
        else:
            tail.next = cur_b
            cur_b     = cur_b.next
        tail = tail.next                    # advance tail onto the winner

    # Drain — at most one of these is non-empty; splice its suffix in O(1)
    tail.next = cur_a if cur_a is not None else cur_b
    return dummy.next
```

```java,editable
import java.util.function.BiPredicate;

class Solution {
    public ListNode mergeLists(ListNode headA, ListNode headB, BiPredicate<ListNode, ListNode> pickA) {
        ListNode dummy = new ListNode();
        ListNode tail  = dummy;

        ListNode cA = headA, cB = headB;
        while (cA != null && cB != null) {
            if (pickA.test(cA, cB)) { tail.next = cA; cA = cA.next; }
            else                    { tail.next = cB; cB = cB.next; }
            tail = tail.next;
        }
        tail.next = (cA != null) ? cA : cB;
        return dummy.next;
    }
}
```

```c,editable
typedef struct ListNode { int val; struct ListNode *next; } ListNode;

ListNode* mergeLists(ListNode *headA, ListNode *headB, int (*pickA)(ListNode*, ListNode*)) {
    ListNode dummy = {0, NULL};
    ListNode *tail = &dummy;

    ListNode *cA = headA, *cB = headB;
    while (cA != NULL && cB != NULL) {
        if (pickA(cA, cB)) { tail->next = cA; cA = cA->next; }
        else                { tail->next = cB; cB = cB->next; }
        tail = tail->next;
    }
    tail->next = (cA != NULL) ? cA : cB;
    return dummy.next;
}
```

```cpp,editable
#include <functional>

class Solution {
public:
    ListNode* mergeLists(ListNode *headA, ListNode *headB,
                        std::function<bool(ListNode*, ListNode*)> pickA) {
        ListNode dummy(0);
        ListNode *tail = &dummy;

        ListNode *cA = headA, *cB = headB;
        while (cA != nullptr && cB != nullptr) {
            if (pickA(cA, cB)) { tail->next = cA; cA = cA->next; }
            else                { tail->next = cB; cB = cB->next; }
            tail = tail->next;
        }
        tail->next = (cA != nullptr) ? cA : cB;
        return dummy.next;
    }
};
```

```scala,editable
object Solution {
  def mergeLists(headA: ListNode, headB: ListNode, pickA: (ListNode, ListNode) => Boolean): ListNode = {
    val dummy = new ListNode(0)
    var tail: ListNode = dummy

    var cA = headA; var cB = headB
    while (cA != null && cB != null) {
      if (pickA(cA, cB)) { tail.next = cA; cA = cA.next }
      else                { tail.next = cB; cB = cB.next }
      tail = tail.next
    }
    tail.next = if (cA != null) cA else cB
    dummy.next
  }
}
```

```typescript,editable
function mergeLists(headA: ListNode | null, headB: ListNode | null,
                   pickA: (a: ListNode, b: ListNode) => boolean): ListNode | null {
    const dummy = new ListNode(0);
    let tail: ListNode = dummy;

    let cA: ListNode | null = headA, cB: ListNode | null = headB;
    while (cA !== null && cB !== null) {
        if (pickA(cA, cB)) { tail.next = cA; cA = cA.next; }
        else                { tail.next = cB; cB = cB.next; }
        tail = tail.next!;
    }
    tail.next = (cA !== null) ? cA : cB;
    return dummy.next;
}
```

```go,editable
type ListNode struct {
    Val  int
    Next *ListNode
}

func mergeLists(headA, headB *ListNode, pickA func(*ListNode, *ListNode) bool) *ListNode {
    dummy := &ListNode{}
    tail  := dummy

    cA, cB := headA, headB
    for cA != nil && cB != nil {
        if pickA(cA, cB) { tail.Next = cA; cA = cA.Next } else { tail.Next = cB; cB = cB.Next }
        tail = tail.Next
    }
    if cA != nil { tail.Next = cA } else { tail.Next = cB }
    return dummy.Next
}
```

```rust,editable
struct ListNode {
    val:  i32,
    next: Option<Box<ListNode>>,
}

// Idiomatic Rust: the selector takes references for comparison; ownership
// of each node is transferred to the output as it wins.
fn merge_lists(
    mut head_a: Option<Box<ListNode>>,
    mut head_b: Option<Box<ListNode>>,
    pick_a: impl Fn(&ListNode, &ListNode) -> bool,
) -> Option<Box<ListNode>> {
    let mut dummy = Box::new(ListNode { val: 0, next: None });
    {
        let mut tail: &mut Box<ListNode> = &mut dummy;
        while head_a.is_some() && head_b.is_some() {
            let take_a = pick_a(head_a.as_deref().unwrap(), head_b.as_deref().unwrap());
            let node = if take_a {
                let mut n = head_a.take().unwrap();
                head_a = n.next.take();
                n
            } else {
                let mut n = head_b.take().unwrap();
                head_b = n.next.take();
                n
            };
            tail.next = Some(node);
            tail = tail.next.as_mut().unwrap();
        }
        // Drain — at most one is non-empty
        tail.next = head_a.or(head_b);
    }
    dummy.next.take()
}
```

</div>

## Complexity Analysis

The runtime and space complexity for merging two lists are pretty easy to understand. We traverse both lists together until either one is traversed completely. In the worst case, we may have to traverse both lists completely, with a linear runtime complexity of **O(N + M)**,where **N** and **M** are the lengths of the two linked lists. In the best case, one list may be empty, and we merge the other by updating references in constant time so the runtime complexity would be constant **O(1)**.

We only create a dummy node and update references to merge the lists, so the space complexity is constant, O(1), in any case.

> **Best Case:** One list is empty
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case:** Both lists completely traversed
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N+M)**

***

# Identifying the merge pattern

The linked list merge technique can only be applied to some specific problems. These are generally easy or medium problems where we merge multiple lists into a single list based on the outcome of some function `f`.  Sometimes, there may be more than one way to solve such problems; however, using the merge technique often has the cleanest and most straightforward solution. If the problem statement or its solution follows the generic template below, it can be solved by applying the merge technique.

**Template:**

Given `k` linked lists, merge them into a single list based on the outcome of some function `f`.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the merge technique.

> **Problem statement:** Given two singly linked lists, merge them by splicing alternate nodes from both lists together. The merged list should start with the first node of the first list.

```d2
direction: right

before: Two input lists {
  a: List A {
    direction: right
    a1: "1"
    a2: "3"
    a3: "5"
    a1 -> a2
    a2 -> a3
  }
  b: List B {
    direction: right
    b1: "2"
    b2: "4"
    b3: "6"
    b1 -> b2
    b2 -> b3
  }
}

after: "Spliced (sorted merge)" {
  direction: right
  c1: "1"
  c2: "2"
  c3: "3"
  c4: "4"
  c5: "5"
  c6: "6"
  c1 -> c2
  c2 -> c3
  c3 -> c4
  c4 -> c5
  c5 -> c6
}

before -> after
```

<p align="center"><strong>Merging splices the original nodes — no new nodes allocated. The six nodes above are the same six objects before and after; only their <code>.next</code> pointers have been rewired into a single chain.</strong></p>

### Merge technique solution

We need to merge two lists to create a merged list; this fits the generic template from the merge pattern we learned earlier.

**Template:**

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
    subgraph INPUTS["Two lists + alternate selector"]
        direction LR
        A1["A: 1 → 3 → 5 → 7"]
        B1["B: 2 → 4"]
    end
    F["f alternates A, B, A, B, ..."]
    OUT["Merged: 1 → 2 → 3 → 4 → 5 → 7"]
    INPUTS --> F --> OUT
    NOTE["when B runs out, remaining A nodes are appended"]
    OUT -.-> NOTE
```

<p align="center"><strong>Alternate-node fusion — selector <code>f</code> flips a boolean each step. When one list runs out, the other's remaining suffix is appended whole.</strong></p>

We use the merge technique by creating a `dummy` node and `tail` reference for the merged list and iterating both lists using two references `currentA` and `currentB`. We also create a boolean variable `mergeFirst` to decide if the node from the first list should be added to the merged list and initialize it to `true`. In each iteration, we flip the value of `mergeFirst` to choose a node from the other list in subsequent iterations.

At the end of all iterations we check if either of the lists is not completely traversed and attach any remaining nodes to the end of the merged list. Finally, we delete the dummy node and return the real head of the merged list.

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
    T1["Tick 1: take A.head (1) → out: [1]<br/>A: 3 → 5 → 7, B: 2 → 4"]
    T2["Tick 2: take B.head (2) → out: [1, 2]<br/>A: 3 → 5 → 7, B: 4"]
    T3["Tick 3: take A.head (3) → out: [1, 2, 3]<br/>A: 5 → 7, B: 4"]
    T4["Tick 4: take B.head (4) → out: [1, 2, 3, 4]<br/>A: 5 → 7, B: empty"]
    T5["Tick 5: B empty → drain A → out: [1, 2, 3, 4, 5, 7]"]
    T1 --> T2 --> T3 --> T4 --> T5
```

<p align="center"><strong>Trace — alternate merge of A = [1, 3, 5, 7] and B = [2, 4]. The boolean flip drives the selector; when one list empties, the drain step appends the other's suffix in one splice.</strong></p>

The implementation of the merge list solution is given as follows.

<div class="lang-tabs">

```pseudocode
function mergeAlternateNodes(headA, headB):
    dummy ← new ListNode; tail ← dummy
    cA ← headA; cB ← headB
    takeFromA ← true
    while cA is not null AND cB is not null:
        if takeFromA: tail.next ← cA; cA ← cA.next
        else:         tail.next ← cB; cB ← cB.next
        tail ← tail.next
        takeFromA ← NOT takeFromA
    tail.next ← cA if cA is not null else cB
    return dummy.next
```

```python,editable
from typing import Optional

class Solution:
    def merge_alternate_nodes(self, head_a: Optional[ListNode], head_b: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode()
        tail  = dummy
        cA, cB = head_a, head_b
        take_from_a = True                      # boolean flips each iteration
        while cA is not None and cB is not None:
            if take_from_a:
                tail.next = cA; cA = cA.next
            else:
                tail.next = cB; cB = cB.next
            tail        = tail.next
            take_from_a = not take_from_a
        tail.next = cA if cA is not None else cB
        return dummy.next
```

```java,editable
class Solution {
    public ListNode mergeAlternateNodes(ListNode headA, ListNode headB) {
        ListNode dummy = new ListNode(), tail = dummy;
        ListNode cA = headA, cB = headB;
        boolean takeFromA = true;
        while (cA != null && cB != null) {
            if (takeFromA) { tail.next = cA; cA = cA.next; }
            else            { tail.next = cB; cB = cB.next; }
            tail       = tail.next;
            takeFromA  = !takeFromA;
        }
        tail.next = (cA != null) ? cA : cB;
        return dummy.next;
    }
}
```

```c,editable
ListNode* mergeAlternateNodes(ListNode *headA, ListNode *headB) {
    ListNode dummy = {0, NULL};
    ListNode *tail = &dummy;
    ListNode *cA = headA, *cB = headB;
    int takeFromA = 1;
    while (cA != NULL && cB != NULL) {
        if (takeFromA) { tail->next = cA; cA = cA->next; }
        else            { tail->next = cB; cB = cB->next; }
        tail      = tail->next;
        takeFromA = !takeFromA;
    }
    tail->next = (cA != NULL) ? cA : cB;
    return dummy.next;
}
```

```cpp,editable
class Solution {
public:
    ListNode* mergeAlternateNodes(ListNode *headA, ListNode *headB) {
        ListNode dummy(0);
        ListNode *tail = &dummy;
        ListNode *cA = headA, *cB = headB;
        bool takeFromA = true;
        while (cA != nullptr && cB != nullptr) {
            if (takeFromA) { tail->next = cA; cA = cA->next; }
            else            { tail->next = cB; cB = cB->next; }
            tail      = tail->next;
            takeFromA = !takeFromA;
        }
        tail->next = (cA != nullptr) ? cA : cB;
        return dummy.next;
    }
};
```

```scala,editable
object Solution {
  def mergeAlternateNodes(headA: ListNode, headB: ListNode): ListNode = {
    val dummy = new ListNode(0)
    var tail: ListNode = dummy
    var cA = headA; var cB = headB
    var takeFromA = true
    while (cA != null && cB != null) {
      if (takeFromA) { tail.next = cA; cA = cA.next }
      else            { tail.next = cB; cB = cB.next }
      tail      = tail.next
      takeFromA = !takeFromA
    }
    tail.next = if (cA != null) cA else cB
    dummy.next
  }
}
```

```typescript,editable
function mergeAlternateNodes(headA: ListNode | null, headB: ListNode | null): ListNode | null {
    const dummy = new ListNode(0);
    let tail: ListNode = dummy;
    let cA: ListNode | null = headA, cB: ListNode | null = headB;
    let takeFromA = true;
    while (cA !== null && cB !== null) {
        if (takeFromA) { tail.next = cA; cA = cA.next; }
        else            { tail.next = cB; cB = cB.next; }
        tail      = tail.next!;
        takeFromA = !takeFromA;
    }
    tail.next = (cA !== null) ? cA : cB;
    return dummy.next;
}
```

```go,editable
func mergeAlternateNodes(headA, headB *ListNode) *ListNode {
    dummy := &ListNode{}
    tail  := dummy
    cA, cB := headA, headB
    takeFromA := true
    for cA != nil && cB != nil {
        if takeFromA { tail.Next = cA; cA = cA.Next } else { tail.Next = cB; cB = cB.Next }
        tail      = tail.Next
        takeFromA = !takeFromA
    }
    if cA != nil { tail.Next = cA } else { tail.Next = cB }
    return dummy.Next
}
```

```rust,editable
fn merge_alternate_nodes(
    mut head_a: Option<Box<ListNode>>,
    mut head_b: Option<Box<ListNode>>,
) -> Option<Box<ListNode>> {
    let mut dummy = Box::new(ListNode { val: 0, next: None });
    {
        let mut tail: &mut Box<ListNode> = &mut dummy;
        let mut take_from_a = true;
        while head_a.is_some() && head_b.is_some() {
            let node = if take_from_a {
                let mut n = head_a.take().unwrap();
                head_a = n.next.take();
                n
            } else {
                let mut n = head_b.take().unwrap();
                head_b = n.next.take();
                n
            };
            tail.next = Some(node);
            tail = tail.next.as_mut().unwrap();
            take_from_a = !take_from_a;
        }
        tail.next = head_a.or(head_b);
    }
    dummy.next.take()
}
```

</div>

The above implementation uses the template code of the merge technique to merge two lists into a single list in a single pass.

## Example problems

Most problems that fall under this category are **easy** or **medium** problems where we need to merge two lists. Most of the time, it is easy to identify problems that can be solved using the merge technique. A list of a few such problems is given below.

> -   **[Alternate node fusion](#alternate-node-fusion)**
> -   **[Merge sorted lists](#merge-sorted-lists)**
> -   **[Merge sorted lists II](#merge-sorted-lists-ii)**
> -   **[List addition](#list-addition)**

We will now solve these problems to understand the merge technique better.

***

# Alternate node fusion

## Problem Statement

Given the heads of two linked lists, **headA** and **headB**, write a function to merge the two lists into one by splicing together the alternate nodes of each list and return the head of the merged list.

You should take the first node of the first list (with the head as headA) as the first node of the result list. If there are no more nodes left in any one of the lists, append the remaining nodes from the other list to the end of the result in the same order as they appear.

### Example 1

> -   **Input:** headA = \[1, 2, 3\], headB = \[4, 5, 6\]
> -   **Output:** \[1, 4, 2, 5, 3, 6\]
> -   **Explanation:** After merging the alternate nodes of the two lists starting from the first list, we get \[1, 4, 2, 5, 3, 6\].

### Example 2

> -   **Input:** headA = \[1, 2, 3, 4, 5\], headB = \[6, 7\]
> -   **Output:** \[1, 6, 2, 7, 3, 4, 5\]
> -   **Explanation:** After merging the alternate nodes of the two lists starting from the first list, we get \[1, 6, 2, 7, 3, 4, 5\]. Since the second list is smaller than the first node, we merge the remaining nodes, i.e., 3, 4, 5, at the end of the result list.

## Solution

<div class="lang-tabs">

```pseudocode
function mergeAlternateNodes(headA, headB):
    dummy ← new ListNode; tail ← dummy
    cA ← headA; cB ← headB
    takeFromA ← true
    while cA is not null AND cB is not null:
        if takeFromA: tail.next ← cA; cA ← cA.next
        else:         tail.next ← cB; cB ← cB.next
        tail ← tail.next
        takeFromA ← NOT takeFromA
    tail.next ← cA if cA is not null else cB
    return dummy.next
```

```python,editable
from typing import Optional

class Solution:
    def merge_alternate_nodes(self, head_a: Optional[ListNode], head_b: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode()
        tail  = dummy
        cA, cB = head_a, head_b
        take_from_a = True                      # boolean flips each iteration
        while cA is not None and cB is not None:
            if take_from_a:
                tail.next = cA; cA = cA.next
            else:
                tail.next = cB; cB = cB.next
            tail        = tail.next
            take_from_a = not take_from_a
        tail.next = cA if cA is not None else cB
        return dummy.next
```

```java,editable
class Solution {
    public ListNode mergeAlternateNodes(ListNode headA, ListNode headB) {
        ListNode dummy = new ListNode(), tail = dummy;
        ListNode cA = headA, cB = headB;
        boolean takeFromA = true;
        while (cA != null && cB != null) {
            if (takeFromA) { tail.next = cA; cA = cA.next; }
            else            { tail.next = cB; cB = cB.next; }
            tail       = tail.next;
            takeFromA  = !takeFromA;
        }
        tail.next = (cA != null) ? cA : cB;
        return dummy.next;
    }
}
```

```c,editable
ListNode* mergeAlternateNodes(ListNode *headA, ListNode *headB) {
    ListNode dummy = {0, NULL};
    ListNode *tail = &dummy;
    ListNode *cA = headA, *cB = headB;
    int takeFromA = 1;
    while (cA != NULL && cB != NULL) {
        if (takeFromA) { tail->next = cA; cA = cA->next; }
        else            { tail->next = cB; cB = cB->next; }
        tail      = tail->next;
        takeFromA = !takeFromA;
    }
    tail->next = (cA != NULL) ? cA : cB;
    return dummy.next;
}
```

```cpp,editable
class Solution {
public:
    ListNode* mergeAlternateNodes(ListNode *headA, ListNode *headB) {
        ListNode dummy(0);
        ListNode *tail = &dummy;
        ListNode *cA = headA, *cB = headB;
        bool takeFromA = true;
        while (cA != nullptr && cB != nullptr) {
            if (takeFromA) { tail->next = cA; cA = cA->next; }
            else            { tail->next = cB; cB = cB->next; }
            tail      = tail->next;
            takeFromA = !takeFromA;
        }
        tail->next = (cA != nullptr) ? cA : cB;
        return dummy.next;
    }
};
```

```scala,editable
object Solution {
  def mergeAlternateNodes(headA: ListNode, headB: ListNode): ListNode = {
    val dummy = new ListNode(0)
    var tail: ListNode = dummy
    var cA = headA; var cB = headB
    var takeFromA = true
    while (cA != null && cB != null) {
      if (takeFromA) { tail.next = cA; cA = cA.next }
      else            { tail.next = cB; cB = cB.next }
      tail      = tail.next
      takeFromA = !takeFromA
    }
    tail.next = if (cA != null) cA else cB
    dummy.next
  }
}
```

```typescript,editable
function mergeAlternateNodes(headA: ListNode | null, headB: ListNode | null): ListNode | null {
    const dummy = new ListNode(0);
    let tail: ListNode = dummy;
    let cA: ListNode | null = headA, cB: ListNode | null = headB;
    let takeFromA = true;
    while (cA !== null && cB !== null) {
        if (takeFromA) { tail.next = cA; cA = cA.next; }
        else            { tail.next = cB; cB = cB.next; }
        tail      = tail.next!;
        takeFromA = !takeFromA;
    }
    tail.next = (cA !== null) ? cA : cB;
    return dummy.next;
}
```

```go,editable
func mergeAlternateNodes(headA, headB *ListNode) *ListNode {
    dummy := &ListNode{}
    tail  := dummy
    cA, cB := headA, headB
    takeFromA := true
    for cA != nil && cB != nil {
        if takeFromA { tail.Next = cA; cA = cA.Next } else { tail.Next = cB; cB = cB.Next }
        tail      = tail.Next
        takeFromA = !takeFromA
    }
    if cA != nil { tail.Next = cA } else { tail.Next = cB }
    return dummy.Next
}
```

```rust,editable
fn merge_alternate_nodes(
    mut head_a: Option<Box<ListNode>>,
    mut head_b: Option<Box<ListNode>>,
) -> Option<Box<ListNode>> {
    let mut dummy = Box::new(ListNode { val: 0, next: None });
    {
        let mut tail: &mut Box<ListNode> = &mut dummy;
        let mut take_from_a = true;
        while head_a.is_some() && head_b.is_some() {
            let node = if take_from_a {
                let mut n = head_a.take().unwrap();
                head_a = n.next.take();
                n
            } else {
                let mut n = head_b.take().unwrap();
                head_b = n.next.take();
                n
            };
            tail.next = Some(node);
            tail = tail.next.as_mut().unwrap();
            take_from_a = !take_from_a;
        }
        tail.next = head_a.or(head_b);
    }
    dummy.next.take()
}
```

</div>

***

# Merge sorted lists

## Problem Statement

Given the heads of two sorted linked lists **headA** and **headB**, write a function to merge the two lists into one sorted list by splicing together the nodes of each list and return the head of the merged linked list.

### Example 1

> -   **Input:** headA = \[1, 2, 4\], headB = \[1, 3, 4\]
> -   **Output:** \[1, 1, 2, 3, 4, 4\]
> -   **Explanation:** After merging the list in sorted order, the resulting list will be \[1, 1, 2, 3, 4, 4\].

### Example 2

> -   **Input:** headA = \[1, 2, 3, 8, 9\], headB = \[6, 7\]
> -   **Output:** \[1, 2, 3, 6, 7, 8, 9\]
> -   **Explanation:** After merging the list in sorted order, the resulting list will be \[1, 2, 3, 6, 7, 8, 9\].

### Example 3

> -   **Input:** headA = \[1, 3, 5, 6, 7\], headB = \[2, 4\]
> -   **Output:** \[1, 2, 3, 4, 5, 6, 7\]
> -   **Explanation:** After merging the list in sorted order, the resulting list will be \[1, 2, 3, 4, 5, 6, 7\].

## Solution

<div class="lang-tabs">

```pseudocode
# Merge two ASCENDING-sorted lists. Pick the smaller head each step.
function mergeSortedLists(headA, headB):
    dummy ← new ListNode; tail ← dummy
    cA ← headA; cB ← headB
    while cA is not null AND cB is not null:
        if cA.val ≤ cB.val:
            tail.next ← cA; cA ← cA.next
        else:
            tail.next ← cB; cB ← cB.next
        tail ← tail.next
    tail.next ← cA if cA is not null else cB
    return dummy.next
```

```python,editable
from typing import Optional

class Solution:
    def merge_sorted_lists(self, head_a: Optional[ListNode], head_b: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode()
        tail  = dummy
        cA, cB = head_a, head_b
        while cA is not None and cB is not None:
            if cA.val <= cB.val:
                tail.next = cA; cA = cA.next
            else:
                tail.next = cB; cB = cB.next
            tail = tail.next
        tail.next = cA if cA is not None else cB
        return dummy.next
```

```java,editable
class Solution {
    public ListNode mergeSortedLists(ListNode headA, ListNode headB) {
        ListNode dummy = new ListNode(), tail = dummy;
        ListNode cA = headA, cB = headB;
        while (cA != null && cB != null) {
            if (cA.val <= cB.val) { tail.next = cA; cA = cA.next; }
            else                   { tail.next = cB; cB = cB.next; }
            tail = tail.next;
        }
        tail.next = (cA != null) ? cA : cB;
        return dummy.next;
    }
}
```

```c,editable
ListNode* mergeSortedLists(ListNode *headA, ListNode *headB) {
    ListNode dummy = {0, NULL};
    ListNode *tail = &dummy;
    ListNode *cA = headA, *cB = headB;
    while (cA != NULL && cB != NULL) {
        if (cA->val <= cB->val) { tail->next = cA; cA = cA->next; }
        else                     { tail->next = cB; cB = cB->next; }
        tail = tail->next;
    }
    tail->next = (cA != NULL) ? cA : cB;
    return dummy.next;
}
```

```cpp,editable
class Solution {
public:
    ListNode* mergeSortedLists(ListNode *headA, ListNode *headB) {
        ListNode dummy(0);
        ListNode *tail = &dummy;
        ListNode *cA = headA, *cB = headB;
        while (cA != nullptr && cB != nullptr) {
            if (cA->val <= cB->val) { tail->next = cA; cA = cA->next; }
            else                     { tail->next = cB; cB = cB->next; }
            tail = tail->next;
        }
        tail->next = (cA != nullptr) ? cA : cB;
        return dummy.next;
    }
};
```

```scala,editable
object Solution {
  def mergeSortedLists(headA: ListNode, headB: ListNode): ListNode = {
    val dummy = new ListNode(0)
    var tail: ListNode = dummy
    var cA = headA; var cB = headB
    while (cA != null && cB != null) {
      if (cA.v <= cB.v) { tail.next = cA; cA = cA.next }
      else               { tail.next = cB; cB = cB.next }
      tail = tail.next
    }
    tail.next = if (cA != null) cA else cB
    dummy.next
  }
}
```

```typescript,editable
function mergeSortedLists(headA: ListNode | null, headB: ListNode | null): ListNode | null {
    const dummy = new ListNode(0);
    let tail: ListNode = dummy;
    let cA: ListNode | null = headA, cB: ListNode | null = headB;
    while (cA !== null && cB !== null) {
        if (cA.val <= cB.val) { tail.next = cA; cA = cA.next; }
        else                   { tail.next = cB; cB = cB.next; }
        tail = tail.next!;
    }
    tail.next = (cA !== null) ? cA : cB;
    return dummy.next;
}
```

```go,editable
func mergeSortedLists(headA, headB *ListNode) *ListNode {
    dummy := &ListNode{}
    tail  := dummy
    cA, cB := headA, headB
    for cA != nil && cB != nil {
        if cA.Val <= cB.Val { tail.Next = cA; cA = cA.Next } else { tail.Next = cB; cB = cB.Next }
        tail = tail.Next
    }
    if cA != nil { tail.Next = cA } else { tail.Next = cB }
    return dummy.Next
}
```

```rust,editable
fn merge_sorted_lists(
    mut head_a: Option<Box<ListNode>>,
    mut head_b: Option<Box<ListNode>>,
) -> Option<Box<ListNode>> {
    let mut dummy = Box::new(ListNode { val: 0, next: None });
    {
        let mut tail: &mut Box<ListNode> = &mut dummy;
        while head_a.is_some() && head_b.is_some() {
            let take_a = head_a.as_deref().unwrap().val <= head_b.as_deref().unwrap().val;
            let node = if take_a {
                let mut n = head_a.take().unwrap();
                head_a = n.next.take();
                n
            } else {
                let mut n = head_b.take().unwrap();
                head_b = n.next.take();
                n
            };
            tail.next = Some(node);
            tail = tail.next.as_mut().unwrap();
        }
        tail.next = head_a.or(head_b);
    }
    dummy.next.take()
}
```

</div>

***

# Merge sorted lists II

## Problem Statement

Given the heads of two sorted linked lists, **headA** and **headB**, write a function to merge the two lists into one sorted list by splicing together the nodes of each list in **descending** **order** and return the head of the merged linked list.

### Example 1

> -   **Input:** headA = \[1, 2, 4\], headB = \[1, 3, 4\]
> -   **Output:** \[4, 4, 3, 2, 1, 1\]
> -   **Explanation:** After merging the lists in descending order, the resulting list will be \[4, 4, 3, 2, 1, 1\].

### Example 2

> -   **Input:** headA = \[1, 2, 3, 8, 9\], headB = \[6, 7\]
> -   **Output:** \[9, 8, 7, 6, 3, 2, 1\]
> -   **Explanation:** After merging the lists in descending order, the resulting list will be \[9, 8, 7, 6, 3, 2, 1\].

### Example 3

> -   **Input:** headA = \[1, 3, 5, 6, 7\], headB = \[2, 4\]
> -   **Output:** \[7, 6, 5, 4, 3, 2, 1\]
> -   **Explanation:** After merging the lists in descending order, the resulting list will be \[7, 6, 5, 4, 3, 2, 1\].

## Solution

<div class="lang-tabs">

```pseudocode
# Merge two DESCENDING-sorted lists into a descending result. Reverse both → ascending lists,
# then pick the LARGER head each step.
function reverse(head):
    prev ← null; cur ← head
    while cur is not null:
        nxt ← cur.next
        cur.next ← prev
        prev ← cur; cur ← nxt
    return prev

function mergeSortedListsII(headA, headB):
    a ← reverse(headA); b ← reverse(headB)
    dummy ← new ListNode; tail ← dummy
    while a is not null AND b is not null:
        if a.val ≥ b.val:
            tail.next ← a; a ← a.next
        else:
            tail.next ← b; b ← b.next
        tail ← tail.next
    tail.next ← a if a is not null else b
    return dummy.next
```

```python,editable
from typing import Optional

class Solution:
    def _reverse(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev, cur = None, head
        while cur is not None:
            nxt = cur.next
            cur.next = prev
            prev, cur = cur, nxt
        return prev

    def merge_sorted_lists_ii(self, head_a: Optional[ListNode], head_b: Optional[ListNode]) -> Optional[ListNode]:
        # Reverse both inputs so they become descending, then pick the larger head each tick
        a, b = self._reverse(head_a), self._reverse(head_b)
        dummy = ListNode()
        tail  = dummy
        while a is not None and b is not None:
            if a.val >= b.val:
                tail.next = a; a = a.next
            else:
                tail.next = b; b = b.next
            tail = tail.next
        tail.next = a if a is not None else b
        return dummy.next
```

```java,editable
class Solution {
    private ListNode reverse(ListNode head) {
        ListNode prev = null, cur = head;
        while (cur != null) { ListNode nxt = cur.next; cur.next = prev; prev = cur; cur = nxt; }
        return prev;
    }

    public ListNode mergeSortedListsII(ListNode headA, ListNode headB) {
        ListNode a = reverse(headA), b = reverse(headB);
        ListNode dummy = new ListNode(), tail = dummy;
        while (a != null && b != null) {
            if (a.val >= b.val) { tail.next = a; a = a.next; }
            else                 { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = (a != null) ? a : b;
        return dummy.next;
    }
}
```

```c,editable
static ListNode* rev_list(ListNode *h) {
    ListNode *prev = NULL, *cur = h;
    while (cur) { ListNode *nxt = cur->next; cur->next = prev; prev = cur; cur = nxt; }
    return prev;
}

ListNode* mergeSortedListsII(ListNode *headA, ListNode *headB) {
    ListNode *a = rev_list(headA), *b = rev_list(headB);
    ListNode dummy = {0, NULL};
    ListNode *tail = &dummy;
    while (a != NULL && b != NULL) {
        if (a->val >= b->val) { tail->next = a; a = a->next; }
        else                   { tail->next = b; b = b->next; }
        tail = tail->next;
    }
    tail->next = (a != NULL) ? a : b;
    return dummy.next;
}
```

```cpp,editable
class Solution {
    ListNode* reverse(ListNode *h) {
        ListNode *prev = nullptr, *cur = h;
        while (cur) { ListNode *nxt = cur->next; cur->next = prev; prev = cur; cur = nxt; }
        return prev;
    }
public:
    ListNode* mergeSortedListsII(ListNode *headA, ListNode *headB) {
        ListNode *a = reverse(headA), *b = reverse(headB);
        ListNode dummy(0); ListNode *tail = &dummy;
        while (a != nullptr && b != nullptr) {
            if (a->val >= b->val) { tail->next = a; a = a->next; }
            else                   { tail->next = b; b = b->next; }
            tail = tail->next;
        }
        tail->next = (a != nullptr) ? a : b;
        return dummy.next;
    }
};
```

```scala,editable
object Solution {
  private def rev(h: ListNode): ListNode = {
    var prev: ListNode = null; var cur = h
    while (cur != null) { val nxt = cur.next; cur.next = prev; prev = cur; cur = nxt }
    prev
  }

  def mergeSortedListsII(headA: ListNode, headB: ListNode): ListNode = {
    var a = rev(headA); var b = rev(headB)
    val dummy = new ListNode(0); var tail: ListNode = dummy
    while (a != null && b != null) {
      if (a.v >= b.v) { tail.next = a; a = a.next }
      else             { tail.next = b; b = b.next }
      tail = tail.next
    }
    tail.next = if (a != null) a else b
    dummy.next
  }
}
```

```typescript,editable
function mergeSortedListsII(headA: ListNode | null, headB: ListNode | null): ListNode | null {
    const reverse = (h: ListNode | null): ListNode | null => {
        let prev: ListNode | null = null, cur = h;
        while (cur !== null) { const nxt: ListNode | null = cur.next; cur.next = prev; prev = cur; cur = nxt; }
        return prev;
    };
    let a: ListNode | null = reverse(headA), b: ListNode | null = reverse(headB);
    const dummy = new ListNode(0);
    let tail: ListNode = dummy;
    while (a !== null && b !== null) {
        if (a.val >= b.val) { tail.next = a; a = a.next; }
        else                 { tail.next = b; b = b.next; }
        tail = tail.next!;
    }
    tail.next = (a !== null) ? a : b;
    return dummy.next;
}
```

```go,editable
func mergeSortedListsII(headA, headB *ListNode) *ListNode {
    rev := func(h *ListNode) *ListNode {
        var prev *ListNode = nil
        cur := h
        for cur != nil { nxt := cur.Next; cur.Next = prev; prev = cur; cur = nxt }
        return prev
    }
    a, b := rev(headA), rev(headB)
    dummy := &ListNode{}
    tail  := dummy
    for a != nil && b != nil {
        if a.Val >= b.Val { tail.Next = a; a = a.Next } else { tail.Next = b; b = b.Next }
        tail = tail.Next
    }
    if a != nil { tail.Next = a } else { tail.Next = b }
    return dummy.Next
}
```

```rust,editable
fn merge_sorted_lists_ii(
    head_a: Option<Box<ListNode>>,
    head_b: Option<Box<ListNode>>,
) -> Option<Box<ListNode>> {
    fn reverse(mut head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        let mut prev: Option<Box<ListNode>> = None;
        while let Some(mut node) = head {
            head = node.next.take();
            node.next = prev;
            prev = Some(node);
        }
        prev
    }

    let mut a = reverse(head_a);
    let mut b = reverse(head_b);

    let mut dummy = Box::new(ListNode { val: 0, next: None });
    {
        let mut tail: &mut Box<ListNode> = &mut dummy;
        while a.is_some() && b.is_some() {
            let take_a = a.as_deref().unwrap().val >= b.as_deref().unwrap().val;
            let node = if take_a {
                let mut n = a.take().unwrap();
                a = n.next.take();
                n
            } else {
                let mut n = b.take().unwrap();
                b = n.next.take();
                n
            };
            tail.next = Some(node);
            tail = tail.next.as_mut().unwrap();
        }
        tail.next = a.or(b);
    }
    dummy.next.take()
}
```

</div>

***

# List addition

## Problem Statement

Given **heads** of two non-empty singly linked lists **headA** and **headB**, representing two non-negative integers where the value in every node represents a single digit. The numbers stored in the lists are in reverse order. Write a function to return the head of a new list that contains the sum of the two given lists.

### Example 1

> -   **Input:** headA = \[2, 4, 3\], headB = \[5, 6, 4\]
> -   **Output:** \[7, 0, 8\]
> -   **Explanation:** Adding 342 to 465 gives 807. Therefore, the output list will be \[7, 0, 8\].

### Example 2

> -   **Input:** headA = \[9, 8, 7\], headB = \[4, 3, 7\]
> -   **Output:** \[3, 2, 5, 1\]
> -   **Explanation:** Adding 789 to 734 gives 1523. Therefore, the output list will be \[3, 2, 5, 1\].

### Example 3

> -   **Input:** headA = \[0\], headB = \[0\]
> -   **Output:** \[0\]
> -   **Explanation:** Adding 0 to 0 gives 0. Therefore, the output list will be \[0\].

## Solution

<div class="lang-tabs">

```pseudocode
# Add two numbers stored as linked lists (least-significant digit first). Carry-propagating loop.
# Loop stops only when BOTH inputs are exhausted AND there's no pending carry.
function listAddition(headA, headB):
    dummy ← new ListNode; tail ← dummy
    cA ← headA; cB ← headB
    carry ← 0
    while cA is not null OR cB is not null OR carry > 0:
        s ← carry
        if cA is not null: s ← s + cA.val; cA ← cA.next
        if cB is not null: s ← s + cB.val; cB ← cB.next
        carry ← s ÷ 10
        tail.next ← new ListNode(s mod 10)
        tail ← tail.next
    return dummy.next
```

```python,editable
from typing import Optional

class Solution:
    def list_addition(self, head_a: Optional[ListNode], head_b: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode()
        tail  = dummy
        cA, cB = head_a, head_b
        carry = 0
        # The loop stops only when BOTH inputs are exhausted AND there's no pending carry
        while cA is not None or cB is not None or carry > 0:
            s = carry
            if cA is not None: s += cA.val; cA = cA.next
            if cB is not None: s += cB.val; cB = cB.next
            carry     = s // 10
            tail.next = ListNode(s % 10)
            tail      = tail.next
        return dummy.next
```

```java,editable
class Solution {
    public ListNode listAddition(ListNode headA, ListNode headB) {
        ListNode dummy = new ListNode(), tail = dummy;
        ListNode cA = headA, cB = headB;
        int carry = 0;
        while (cA != null || cB != null || carry > 0) {
            int s = carry;
            if (cA != null) { s += cA.val; cA = cA.next; }
            if (cB != null) { s += cB.val; cB = cB.next; }
            carry     = s / 10;
            tail.next = new ListNode(s % 10);
            tail      = tail.next;
        }
        return dummy.next;
    }
}
```

```c,editable
ListNode* listAddition(ListNode *headA, ListNode *headB) {
    ListNode dummy = {0, NULL};
    ListNode *tail = &dummy;
    int carry = 0;
    while (headA != NULL || headB != NULL || carry > 0) {
        int s = carry;
        if (headA != NULL) { s += headA->val; headA = headA->next; }
        if (headB != NULL) { s += headB->val; headB = headB->next; }
        carry     = s / 10;
        ListNode *n = (ListNode*)malloc(sizeof(ListNode));
        n->val = s % 10; n->next = NULL;
        tail->next = n;
        tail       = n;
    }
    return dummy.next;
}
```

```cpp,editable
class Solution {
public:
    ListNode* listAddition(ListNode *headA, ListNode *headB) {
        ListNode dummy(0);
        ListNode *tail = &dummy;
        int carry = 0;
        while (headA != nullptr || headB != nullptr || carry > 0) {
            int s = carry;
            if (headA != nullptr) { s += headA->val; headA = headA->next; }
            if (headB != nullptr) { s += headB->val; headB = headB->next; }
            carry      = s / 10;
            tail->next = new ListNode(s % 10);
            tail       = tail->next;
        }
        return dummy.next;
    }
};
```

```scala,editable
object Solution {
  def listAddition(headA: ListNode, headB: ListNode): ListNode = {
    val dummy = new ListNode(0)
    var tail: ListNode = dummy
    var a = headA; var b = headB
    var carry = 0
    while (a != null || b != null || carry > 0) {
      var s = carry
      if (a != null) { s += a.v; a = a.next }
      if (b != null) { s += b.v; b = b.next }
      carry = s / 10
      tail.next = new ListNode(s % 10)
      tail = tail.next
    }
    dummy.next
  }
}
```

```typescript,editable
function listAddition(headA: ListNode | null, headB: ListNode | null): ListNode | null {
    const dummy = new ListNode(0);
    let tail: ListNode = dummy;
    let cA: ListNode | null = headA, cB: ListNode | null = headB, carry = 0;
    while (cA !== null || cB !== null || carry > 0) {
        let s = carry;
        if (cA !== null) { s += cA.val; cA = cA.next; }
        if (cB !== null) { s += cB.val; cB = cB.next; }
        carry     = Math.floor(s / 10);
        tail.next = new ListNode(s % 10);
        tail      = tail.next!;
    }
    return dummy.next;
}
```

```go,editable
func listAddition(headA, headB *ListNode) *ListNode {
    dummy := &ListNode{}
    tail  := dummy
    cA, cB := headA, headB
    carry := 0
    for cA != nil || cB != nil || carry > 0 {
        s := carry
        if cA != nil { s += cA.Val; cA = cA.Next }
        if cB != nil { s += cB.Val; cB = cB.Next }
        carry     = s / 10
        tail.Next = &ListNode{Val: s % 10}
        tail      = tail.Next
    }
    return dummy.Next
}
```

```rust,editable
fn list_addition(
    mut head_a: Option<Box<ListNode>>,
    mut head_b: Option<Box<ListNode>>,
) -> Option<Box<ListNode>> {
    let mut dummy = Box::new(ListNode { val: 0, next: None });
    {
        let mut tail: &mut Box<ListNode> = &mut dummy;
        let mut carry = 0;
        while head_a.is_some() || head_b.is_some() || carry > 0 {
            let mut s = carry;
            if let Some(mut n) = head_a { s += n.val; head_a = n.next.take(); }
            if let Some(mut n) = head_b { s += n.val; head_b = n.next.take(); }
            carry = s / 10;
            tail.next = Some(Box::new(ListNode { val: s % 10, next: None }));
            tail = tail.next.as_mut().unwrap();
        }
    }
    dummy.next.take()
}
```

</div>

***

## Final Takeaway

Merge is the dual of split. Where split routed nodes from one list into `k` outputs by a classifier, merge routes nodes from `k` inputs into one output by a selector. The template:

```
dummy = ListNode()
tail  = dummy
while any_input_non_empty():
    winner = select_next(current_heads)   # <-- the only problem-specific line
    tail.next = winner
    tail      = winner
    advance_head_of(winner)
drain_any_remaining_input(tail)
return dummy.next
```

Four insights worth burning in:

| Insight | Why it matters |
|---|---|
| Dummy head + tail pointer | Same trick as the split pattern. No "first node" special case; every iteration is a uniform three-line splice. |
| The selector is the whole problem | `pick smaller head` → sorted merge. `alternate A, B, A, B` → interleave. `pick by digit sum` → list addition. `pick min via heap` → k-way merge. Swap out the selector; skeleton stays. |
| Drain the leftover suffix in O(1) | When one input empties first, the other input's remaining nodes are already correctly linked — just splice the whole suffix in one pointer assignment. Don't loop through it node-by-node. |
| Merge is O(n + m) because every node is visited exactly once | No comparisons are wasted. Every node moves from its input to the output in a single pointer update. Total work is proportional to total size. |

When you next see "merge two sorted", "interleave", "combine k lists", "add as numbers", "zip lists together" — reach for the dummy-head-plus-selector template first. Then just write the one-line selector.

> **Transfer Challenge:** You need to merge **k sorted linked lists** into one sorted output. Naïve pairwise merge is O(nk) where n is total length. Can you do better?
>
> <details><summary><strong>Solution hint</strong></summary>
>
> Replace the simple "pick smaller of two heads" selector with a <strong>min-heap of size k</strong> holding the current head of each input. Each extraction is O(log k); there are n extractions total. O(n log k) overall — a dramatic win for k > 2. This is the linked-list version of <em>k-way merge sort</em>, and it's the standard technique used by database query engines to merge sorted runs from disk.
>
> </details>
