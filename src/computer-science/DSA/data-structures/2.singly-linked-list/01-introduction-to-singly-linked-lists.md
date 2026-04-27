# 1. Introduction to Singly Linked Lists

## The Hook

Imagine you're keeping a guest list for a dinner party. You grab a notepad with exactly ten lines — the perfect size. Then a friend calls: *"Can I bring two more?"* Now you're ripping the page out, starting over, and copying every name by hand. Later someone cancels and you rewrite the whole list again. This is how **arrays** feel every time you insert or delete in the middle.

What if instead of rigid lines on a page, each guest held a slip of paper with a single instruction: *"the next person is Alice, who lives at 42 Park Street."* Add a guest? Hand them a slip, update one instruction. Remove a guest? Redirect the slip before them. No copying. No rewriting. That's a **linked list** — and once you see the difference, you'll understand why every stack, queue, graph, hash table, and tree you'll ever implement owes something to this idea.

The linked list is the most important data structure you'll ever learn. Everything else builds on it. Let's see why.

---

## Table of contents

1. [Understanding the problem](#understanding-the-problem)
2. [Exploring a possible solution](#exploring-a-possible-solution)
3. [Defining a node in singly linked list](#defining-a-node-in-singly-linked-list)
4. [Structure of a singly linked list](#structure-of-a-singly-linked-list)
5. [Overview of supported operations](#overview-of-supported-operations)
6. [Boundary node](#boundary-node)

***

# Understanding the problem

To better understand a linked list, let us first look at some common problems programmers face when designing software systems. When writing a program, we often need a collection of data items that can be accessed sequentially. E.g., a collection of names of all the students in a class. It is common for people to think this is not such a complex problem. What's so hard with it? We can use an **array** to store this data where the size of the array is equal to the number of students.

```d2
arr: array {
  grid-columns: 4
  grid-gap: 0
  a0: |md
    **Alice**

    `[0]`
  |
  a1: |md
    **Bob**

    `[1]`
  |
  a2: |md
    **Carol**

    `[2]`
  |
  a3: |md
    **David**

    `[3]`
  |
}
```

<p align="center"><strong>An array of size 4 storing student names at contiguous indices.</strong></p>

This is an easy way to store data, but what if a new student joins the class? In this case, we will have to increase the size of the array by one, which is **not** possible. Well, we can solve this problem by creating a new array of a larger size, copying all the data from the previous array, and then adding the new student to it. However, this will be quite inefficient in terms of space and time complexity.

```d2
before: "Original array (size = 4)" {
  grid-columns: 4
  grid-gap: 0
  a0: Alice
  a1: Bob
  a2: Carol
  a3: David
}

after: "New array (size = 5) — copy all + append" {
  grid-columns: 5
  grid-gap: 0
  a0: Alice
  a1: Bob
  a2: Carol
  a3: David
  a4: Eve {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
}

before -> after: "allocate new array,\ncopy 4 elements,\nadd Eve"
```

<p align="center"><strong>Adding a new student requires allocating a brand-new array and copying every existing element — O(n) time and O(n) extra space.</strong></p>

Now, let's consider another scenario. What if a student leaves the class? We can use the same process again. This time, we create a new array of smaller size and copy all the data items except the one we want to delete.

```d2
before: "Original array (size = 4)" {
  grid-columns: 4
  grid-gap: 0
  a0: Alice
  a1: Bob {style.fill: "#fee2e2"; style.stroke: "#dc2626"}
  a2: Carol
  a3: David
}

after: "New array (size = 3) — skip Bob" {
  grid-columns: 3
  grid-gap: 0
  a0: Alice
  a1: Carol
  a2: David
}

before -> after: "allocate smaller array,\ncopy all except Bob"
```

<p align="center"><strong>Deleting a student requires another full copy into a smaller array — the same O(n) cost applies for every insertion or deletion.</strong></p>

The examples we looked at above inserted or deleted data from the **ends** of a sequential collection. What if we had to insert or delete data items from somewhere in the **middle**?

## Limitations of arrays

Even though we can solve the problem using an array, it is inefficient if we have to insert and delete data items frequently. The solution above performs poorly.

> 1.  **Space complexity O(N):** Initializing a new array to add or remove a single data element would waste a lot of memory when we need just one extra block.
> 2.  **Time complexity O(N):** Our algorithm is relatively slow since we try to traverse the entire array and copy the elements to the new array whenever we want to add or remove an item.

An array has other fundamental problems that make it a bad choice for problems like these. For example, we cannot insert or delete data items **in place** in an array.

```d2
mem: "Contiguous memory — each cell is fixed in place" {
  grid-columns: 4
  grid-gap: 0
  c0: |md
    **Alice**

    `addr 100`
  |
  c1: |md
    **Bob**

    `addr 104`
  |
  c2: |md
    **Carol**

    `addr 108`
  |
  c3: |md
    **David**

    `addr 112`
  |
}

ins: "Insert 'Zara'\nbetween Bob & Carol?" {
  shape: oval
  style.fill: "#fde68a"
  style.stroke: "#d97706"
}
ins -> mem.c2: "No free slot!\nMust shift Carol & David\nor reallocate everything"
```

<p align="center"><strong>Arrays occupy a contiguous block of memory — there is no physical gap between elements to insert into, so every in-place insertion forces a cascade of element shifts.</strong></p>

> The fundamental challenges of using an array are:
>
> -   **Fixed size:** Arrays have a fixed size defined at their creation and cannot be changed later.
> -   **Insertion and Deletion:** Data items in an array reside in contiguous memory blocks. Since an array has a fixed size, we cannot insert or delete data items; we can only overwrite them.

What if we had a magical data structure that could solve the above problem most efficiently?

***

# Exploring a possible solution

Now that we know arrays' limitations and the situations where those limitations lead to sub-optimal solutions, we can start to think about a data structure that can be used efficiently in such situations. A singly linked list is designed precisely for situations like this.

## Linked list

A linked list is a linear and dynamic data structure that stores data sequentially at random memory locations. Instead of storing all the data items in a contiguous block of memory like arrays, a linked list stores them at random locations in memory. Whenever a new item is to be added, a new memory block is dynamically created to store this new value, which is then added to the chain of already existing items, effectively extending the **linked list**.

```d2
direction: right
n1: {
  val: Alice
  next
}
n2: {
  val: Bob
  next
}
n3: {
  val: Carol
  next
}
n4: {
  val: David
  next: "null"
}
n1.next -> n2.val
n2.next -> n3.val
n3.next -> n4.val
```

<p align="center"><strong>Abstract representation of a singly linked list — each node holds a value and a pointer to the next node; the last node points to null.</strong></p>

## Linked lists vs arrays

A linked list guarantees the insertion and deletion of items from the **start** and **end** of the list in **O(1)** space and **O(1)** time. It also guarantees the insertion and deletion of any data item **without** using any extra space. You can imagine it as a dynamic sequential container whose size can be increased or decreased at will.

```d2
insert: "Insert at head — O(1)" {
  direction: right
  i0: {
    val: Zara
    next
    style.fill: "#dcfce7"
    style.stroke: "#16a34a"
  }
  i1: {
    val: Alice
    next
  }
  i2: {
    val: Bob
    next: "null"
  }
  i0.next -> i1.val: "point to old head"
  i1.next -> i2.val
}

delete: "Delete head — O(1)" {
  direction: right
  d1: {
    val: Alice
    next
    style.fill: "#fee2e2"
    style.stroke: "#dc2626"
  }
  d2: {
    val: Bob
    next
  }
  d3: {
    val: Carol
    next: "null"
  }
  d1.next -> d2.val: "advance head"
  d2.next -> d3.val
}
```

<p align="center"><strong>Insertion and deletion at the head of a linked list are O(1) — no copying, no shifting, just pointer updates.</strong></p>

Let us look at an example of insertion in a singly linked list to understand this better.

```d2
before: "Before insertion" {
  direction: right
  a1: Alice
  a2: Bob
  a3: Carol
  a4: David
  a1 -> a2 -> a3 -> a4
}

after: "Insert 'Zara' after 'Bob'" {
  direction: right
  b1: Alice
  b2: Bob
  new: Zara {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  b3: Carol
  b4: David
  b1 -> b2 -> new -> b3 -> b4
}

before -> after: "1. Create new node\n2. new.next = Bob.next\n3. Bob.next = new"
```

<p align="center"><strong>Inserting 'Zara' after 'Bob' — redirect two pointers; no shifting, no copying, O(1) once the insertion point is known.</strong></p>

## Advantages

A single linked list has a few advantages over traditional arrays, which are listed below.

> -   **Dynamic size:** The size of a linked list is not fixed. Adding or removing items can increase or decrease at will during runtime.
> -   **Efficient performance:** Insertion and deletion of the first node is an **O(1)** operation.

## Limitations

Singly linked lists are not the solution to all our problems. They are very efficient for specific use cases but also have some limitations.

> -   **Extra space:** A little extra memory is required to store an item in a linked list compared to an array. The extra space is used to store the information of the next item in the sequence.
> -   **Traversal:** Traversal in a linked list is more time-consuming than an array since random access using an index is not possible. To access an item at position **n**, one must traverse all the items before it.

A linked list is the most basic but also the most important data structure. Almost all the other data structures build upon the concepts of a linked list, so if there is one data structure that you absolutely must master, it's the linked list.

***

# Defining a node in singly linked list

A **node** is the fundamental building block of a linked list. It holds the actual data item and information of the next node. Multiple nodes, when chained together, make up a single linked list. All the operations on a linked list are performed by manipulating individual nodes and their links. Inserting, deleting, or updating data items in a list are all performed using the list's nodes.

## Structure of a node

A singly linked list node has two sections.

> -   **val:** The actual data item a node holds. This could be of any type.
> -   **next:** This is a reference to the next node in the list

```d2
direction: right
node: "A single node" {
  grid-columns: 2
  grid-gap: 0
  val: |md
    **val**

    (data)
  |
  next: |md
    **next**

    (pointer)
  |
}
n2: "next node..."
nullnode: "null — if tail" {shape: oval}
node.next -> n2: "points to"
node.next -> nullnode: "or"
```

<p align="center"><strong>A singly linked list node stores two fields: <code>val</code> (the data) and <code>next</code> (the address of the following node, or <code>null</code> if it is the last).</strong></p>

## Implementing a node

To define a node in code, we create a Node class that encapsulates the information a singly linked list node must have: **data** and a reference to the next node. Our class should also have a constructor to initialize the values in nodes at the time of its creation. We can pass in a data value stored in the node and the reference to the next node. We are responsible for linking it to any other node when we see fit.

<div class="lang-tabs">

```python,editable
class ListNode:
    def __init__(self, val=0, next=None):
        self.val  = val   # The data this node holds
        self.next = next  # Reference to the next node; None if this is the tail

# Usage
node1 = ListNode(5)
node2 = ListNode(7)
node1.next = node2  # Link node1 → node2
print(node1.val, "->", node2.val)  # 5 -> 7
```

```java,editable
public class Main {
    static class ListNode {
        int val;
        ListNode next;

        ListNode() {}                          // Default: val=0, next=null
        ListNode(int val) { this.val = val; }  // next stays null until linked
    }

    public static void main(String[] args) {
        ListNode node1 = new ListNode(5);
        ListNode node2 = new ListNode(7);
        node1.next = node2;  // Link node1 → node2
        System.out.println(node1.val + " -> " + node2.val);  // 5 -> 7
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>

typedef struct ListNode {
    int val;
    struct ListNode *next;  // Pointer to the next node; NULL if tail
} ListNode;

ListNode* newNode(int val) {
    ListNode *node = (ListNode*)malloc(sizeof(ListNode));
    node->val  = val;
    node->next = NULL;  // Newly created nodes start disconnected
    return node;
}

int main() {
    ListNode *node1 = newNode(5);
    ListNode *node2 = newNode(7);
    node1->next = node2;  // Link node1 → node2
    printf("%d -> %d\n", node1->val, node2->val);  // 5 -> 7
    free(node1);
    free(node2);
    return 0;
}
```

```cpp,editable
#include <iostream>

struct ListNode {
    int val;
    ListNode *next;
    ListNode()          : val(0),   next(nullptr) {}  // Default constructor
    ListNode(int val)   : val(val), next(nullptr) {}  // next stays null until linked
};

int main() {
    ListNode *node1 = new ListNode(5);
    ListNode *node2 = new ListNode(7);
    node1->next = node2;  // Link node1 → node2
    std::cout << node1->val << " -> " << node2->val << "\n";  // 5 -> 7
    delete node1;
    delete node2;
}
```

```scala,editable
class ListNode(var v: Int = 0, var next: ListNode = null)

object Main extends App {
  val node1 = new ListNode(5)
  val node2 = new ListNode(7)
  node1.next = node2  // Link node1 → node2
  println(s"${node1.v} -> ${node2.v}")  // 5 -> 7
}
```

```javascript,editable
class ListNode {
    constructor(val = 0, next = null) {
        this.val  = val;   // The data this node holds
        this.next = next;  // Reference to the next node; null if tail
    }
}

const node1 = new ListNode(5);
const node2 = new ListNode(7);
node1.next = node2;  // Link node1 → node2
console.log(node1.val + " -> " + node2.val);  // 5 -> 7
```

```typescript,editable
class ListNode {
    val:  number;
    next: ListNode | null;

    constructor(val: number = 0, next: ListNode | null = null) {
        this.val  = val;
        this.next = next;
    }
}

const node1 = new ListNode(5);
const node2 = new ListNode(7);
node1.next = node2;  // Link node1 → node2
console.log(`${node1.val} -> ${node2.val}`);  // 5 -> 7
```

```go,editable
package main

import "fmt"

type ListNode struct {
    Val  int
    Next *ListNode  // Pointer to the next node; nil if tail
}

func main() {
    node1 := &ListNode{Val: 5}
    node2 := &ListNode{Val: 7}
    node1.Next = node2  // Link node1 → node2
    fmt.Printf("%d -> %d\n", node1.Val, node2.Val)  // 5 -> 7
}
```

```kotlin,editable
class ListNode(var `val`: Int = 0, var next: ListNode? = null)

fun main() {
    val node1 = ListNode(5)
    val node2 = ListNode(7)
    node1.next = node2  // Link node1 → node2
    println("${node1.`val`} -> ${node2.`val`}")  // 5 -> 7
}
```

```rust,editable
#[derive(Debug)]
struct ListNode {
    val:  i32,
    next: Option<Box<ListNode>>,  // Box gives heap allocation; Option handles null
}

impl ListNode {
    fn new(val: i32) -> Self {
        ListNode { val, next: None }  // Starts disconnected
    }
}

fn main() {
    let mut node1 = ListNode::new(5);
    let     node2 = ListNode::new(7);
    node1.next = Some(Box::new(node2));  // Link node1 → node2
    println!("{} -> {}", node1.val, node1.next.as_ref().unwrap().val);  // 5 -> 7
}
```

</div>

***

# Structure of a singly linked list

A linked list is just a chain of nodes. Below is how these nodes chain together to form a singly linked list.

```d2
direction: right
n1: {
  val: 5
  next
}
n2: {
  val: 7
  next
}
n3: {
  val: 3
  next
}
n4: {
  val: 9
  next: "null"
}
n1.next -> n2.val
n2.next -> n3.val
n3.next -> n4.val
```

<p align="center"><strong>Logical representation — nodes appear sequential left to right, each pointing to the next, with the tail pointing to null.</strong></p>

When represented logically in a diagram, these nodes might look sequential (left to right, one after the other), but in reality, they are scattered all around in memory at random locations, and the only way to access a node is by using its address in memory.

```d2
direction: right
n1: |md
  `addr 0x1A4`

  **val: 5**

  `next: 0x3F2`
|
n2: |md
  `addr 0x3F2`

  **val: 7**

  `next: 0x0B8`
|
n3: |md
  `addr 0x0B8`

  **val: 3**

  `next: 0x2C1`
|
n4: |md
  `addr 0x2C1`

  **val: 9**

  `next: null`
|
n1 -> n2: "jump to 0x3F2" {style.stroke-dash: 3}
n2 -> n3: "jump to 0x0B8" {style.stroke-dash: 3}
n3 -> n4: "jump to 0x2C1" {style.stroke-dash: 3}
```

<p align="center"><strong>Physical memory — the four nodes are scattered at unrelated addresses; each node stores the address of the next one so the chain can be followed.</strong></p>

## Head Node

The first node of a linked list is also called the **head** node. As we know, a node in the linked list can only be accessed using its memory reference. This reference, however, is stored in the node before it in the logical representation, and this is true for every node except the first node, as it does not have any previous node. This is why, to access a linked list, we should always have the reference to the head node stored somewhere.

```d2
direction: right
head: head { shape: oval }
n1: {
  val: 5
  next
}
n2: {
  val: 7
  next
}
n3: {
  val: 3
  next: "null"
}
head -> n1.val: "entry point"
n1.next -> n2.val
n2.next -> n3.val
```

<p align="center"><strong>The <code>head</code> pointer is the only entry point to the list — without it, all nodes become unreachable.</strong></p>

## Tail Node

The last node of a linked list is called a **tail** node. Just like the first node does not have any node before it, the last node does not have any node after it. You may wonder what is stored in the pointer of the tail node. The pointer of the tail node stores a reference to `null`, which means nothing. As we will see later, this also helps us determine the end of the linked list.

```d2
direction: right
n1: {
  val: 5
  next
}
n2: {
  val: 7
  next
}
n3: {
  val: 3
  next
  style.fill: "#fef9c3"
  style.stroke: "#d97706"
}
tail: "null — end of list" { shape: oval }
n1.next -> n2.val
n2.next -> n3.val
n3.next -> tail
```

<p align="center"><strong>The tail node's <code>next</code> pointer holds <code>null</code>, signalling the end of the list — traversal stops here.</strong></p>

***

# Overview of supported operations

Now that we know what an individual node of a singly linked list looks like and how these individual nodes link up together to create a singly linked list, we can dive a bit deeper and understand the different operations that can be performed on it.

Every data structure is essentially used to store, retrieve, and manipulate data efficiently. Users can perform these functionalities through a set of operations on the data structure. On a high level, there are three basic types of operations on any data structure.

> -   Traversal
> -   Insertion
> -   Deletion

All other complex operations can be implemented by mixing or piggybacking these fundamental operations. Let's examine some operations we can perform on a singly linked list.

```d2
ops: "Operations on a singly linked list" {
  grid-columns: 2
  grid-gap: 24
  t: |md
    **Traversal**

    Visit each node once

    `O(n)`
  |
  i: |md
    **Insertion**

    At head / tail / position

    `O(1) head · O(n) middle`
  |
  d: |md
    **Deletion**

    By value / position

    `O(1) head · O(n) middle`
  |
  s: |md
    **Search**

    Find node by value

    `O(n)`
  |
}
```

<p align="center"><strong>The four fundamental operations on a singly linked list — traversal and search are always O(n); head insertion and deletion are O(1).</strong></p>

Don't worry if you don't understand all of these operations yet. We will explore them in more detail later in the course. Each of these operations is built from a combination of basic ones, and once you've mastered the fundamentals, the intuition behind the more complex operations will become clear.

***

# Boundary Node

A first problem to check that the two ideas you just met — **the `head` pointer** and **the tail's `next == null`** — have actually clicked. No traversal allowed. Two comparisons. Done.

## The Problem

> Given the **head** of a singly linked list and a reference to a **random** node in the same list, return:
>
> - `first` — the node is the head.
> - `last` — the node is the tail (its `next` is null).
> - `both` — it is simultaneously the head and the tail (list of size 1).
> - `none` — it is somewhere in the middle.
>
> **Constraint:** you must answer in **O(1)** — no walking the list. The list contains no duplicates.

```
Input:  head = [5, 7, 3, 10], node = 5
Output: first

Input:  head = [5, 7, 3, 10], node = 10
Output: last

Input:  head = [5], node = 5
Output: both

Input:  head = [5, 7, 3, 10], node = 3
Output: none
```

---

## What Makes a Node a "Boundary"?

A linked list has exactly two structural landmarks: the **head** (entry point, nothing points *to* it) and the **tail** (exit point, nothing points *from* it — its `next` is `null`). Every other node is interior — reachable through its predecessor and pointing to a successor. The entire problem reduces to answering **two yes/no questions** about the given node:

- *Is this node the one the head reference points to?*
- *Is this node's `next` pointer null?*

```d2
direction: right
head: head { shape: oval }
n1: {
  val: 5
  next
  style.fill: "#dbeafe"
  style.stroke: "#3b82f6"
}
n2: {
  val: 7
  next
}
n3: {
  val: 3
  next
}
n4: {
  val: 10
  next: "null"
  style.fill: "#fef9c3"
  style.stroke: "#d97706"
}
head -> n1.val
n1.next -> n2.val
n2.next -> n3.val
n3.next -> n4.val

q1: "Q1: node == head?" {shape: oval}
q2: "Q2: node.next == null?" {shape: oval}
q1 -> n1: "" {style.stroke-dash: 3}
q2 -> n4: "" {style.stroke-dash: 3}
```

<p align="center"><strong>Two questions identify the four cases. The head answers yes to Q1 only, the tail to Q2 only, a single-node list to both, and every interior node to neither.</strong></p>

The truth table writes itself:

| `isHead` | `isTail` | Return |
|---|---|---|
| true | true | `both` |
| true | false | `first` |
| false | true | `last` |
| false | false | `none` |

> *Before reading the solution — why can we do this in O(1) instead of O(N)? What property of the given node lets us check "is this the tail?" without walking to the end?*

Because the tail is the *only* node whose `next` is `null`. The given node itself carries that information — we don't have to find the tail, we just ask "is your `next` null?" and believe the answer. That's the whole trick, and it's a preview of a powerful lesson: **a linked list node is a self-describing object**. Most questions about a single node can be answered locally, without traversal.

---

## The Solution

<div class="lang-tabs">

```python,editable
class ListNode:
    def __init__(self, val=0, next=None):
        self.val  = val
        self.next = next

class Solution:
    def boundary_node(self, head: ListNode, node: ListNode) -> str:
        if not head or not node:
            return "none"

        is_head = (node is head)            # True if node is the first node
        is_tail = (node.next is None)       # True if node has no successor

        if is_head and is_tail:
            return "both"   # Single-element list
        if is_head:
            return "first"
        if is_tail:
            return "last"
        return "none"

# --- test ---
def build(vals):
    dummy = ListNode(0)
    cur = dummy
    nodes = []
    for v in vals:
        cur.next = ListNode(v)
        cur = cur.next
        nodes.append(cur)
    return dummy.next, nodes

head, nodes = build([5, 7, 3, 10])
print(Solution().boundary_node(head, nodes[0]))  # first
print(Solution().boundary_node(head, nodes[3]))  # last
print(Solution().boundary_node(head, nodes[2]))  # none
```

```java,editable
public class Main {
    static class ListNode {
        int val; ListNode next;
        ListNode(int v) { val = v; }
    }

    static String boundaryNode(ListNode head, ListNode node) {
        if (head == null || node == null) return "none";

        boolean isHead = (node == head);       // Identity comparison — same object
        boolean isTail = (node.next == null);  // No successor means tail

        if (isHead && isTail) return "both";
        if (isHead)           return "first";
        if (isTail)           return "last";
        return "none";
    }

    public static void main(String[] args) {
        ListNode n1 = new ListNode(5), n2 = new ListNode(7),
                 n3 = new ListNode(3), n4 = new ListNode(10);
        n1.next = n2; n2.next = n3; n3.next = n4;

        System.out.println(boundaryNode(n1, n1));  // first
        System.out.println(boundaryNode(n1, n4));  // last
        System.out.println(boundaryNode(n1, n3));  // none
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct ListNode { int val; struct ListNode *next; } ListNode;

ListNode* newNode(int v) {
    ListNode *n = malloc(sizeof(ListNode));
    n->val = v; n->next = NULL;
    return n;
}

const char* boundaryNode(ListNode *head, ListNode *node) {
    if (!head || !node) return "none";

    int isHead = (node == head);        /* pointer equality — same address */
    int isTail = (node->next == NULL);  /* no successor → tail */

    if (isHead && isTail) return "both";
    if (isHead)           return "first";
    if (isTail)           return "last";
    return "none";
}

int main() {
    ListNode *n1 = newNode(5), *n2 = newNode(7),
             *n3 = newNode(3), *n4 = newNode(10);
    n1->next = n2; n2->next = n3; n3->next = n4;

    printf("%s\n", boundaryNode(n1, n1));  /* first */
    printf("%s\n", boundaryNode(n1, n4));  /* last  */
    printf("%s\n", boundaryNode(n1, n3));  /* none  */
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <string>
using namespace std;

struct ListNode {
    int val; ListNode *next;
    ListNode(int v) : val(v), next(nullptr) {}
};

string boundaryNode(ListNode *head, ListNode *node) {
    if (!head || !node) return "none";

    bool isHead = (node == head);        // Pointer equality — same address
    bool isTail = (node->next == nullptr); // No successor → tail

    if (isHead && isTail) return "both";
    if (isHead)           return "first";
    if (isTail)           return "last";
    return "none";
}

int main() {
    auto *n1 = new ListNode(5), *n2 = new ListNode(7),
         *n3 = new ListNode(3), *n4 = new ListNode(10);
    n1->next = n2; n2->next = n3; n3->next = n4;

    cout << boundaryNode(n1, n1) << "\n";  // first
    cout << boundaryNode(n1, n4) << "\n";  // last
    cout << boundaryNode(n1, n3) << "\n";  // none
}
```

```scala,editable
class ListNode(var v: Int, var next: ListNode = null)

object Main extends App {
  def boundaryNode(head: ListNode, node: ListNode): String = {
    if (head == null || node == null) return "none"

    val isHead = node eq head         // Reference equality
    val isTail = node.next == null    // No successor → tail

    if (isHead && isTail) "both"
    else if (isHead)      "first"
    else if (isTail)      "last"
    else                  "none"
  }

  val n1 = new ListNode(5); val n2 = new ListNode(7)
  val n3 = new ListNode(3); val n4 = new ListNode(10)
  n1.next = n2; n2.next = n3; n3.next = n4

  println(boundaryNode(n1, n1))  // first
  println(boundaryNode(n1, n4))  // last
  println(boundaryNode(n1, n3))  // none
}
```

```javascript,editable
class ListNode {
    constructor(val, next = null) { this.val = val; this.next = next; }
}

function boundaryNode(head, node) {
    if (!head || !node) return "none";

    const isHead = node === head;        // Strict reference equality
    const isTail = node.next === null;   // No successor → tail

    if (isHead && isTail) return "both";
    if (isHead)           return "first";
    if (isTail)           return "last";
    return "none";
}

const n1 = new ListNode(5), n2 = new ListNode(7),
      n3 = new ListNode(3), n4 = new ListNode(10);
n1.next = n2; n2.next = n3; n3.next = n4;

console.log(boundaryNode(n1, n1));  // first
console.log(boundaryNode(n1, n4));  // last
console.log(boundaryNode(n1, n3));  // none
```

```typescript,editable
class ListNode {
    val: number; next: ListNode | null;
    constructor(val: number, next: ListNode | null = null) {
        this.val = val; this.next = next;
    }
}

function boundaryNode(head: ListNode | null, node: ListNode | null): string {
    if (!head || !node) return "none";

    const isHead = node === head;       // Reference equality
    const isTail = node.next === null;  // No successor → tail

    if (isHead && isTail) return "both";
    if (isHead)           return "first";
    if (isTail)           return "last";
    return "none";
}

const n1 = new ListNode(5), n2 = new ListNode(7),
      n3 = new ListNode(3), n4 = new ListNode(10);
n1.next = n2; n2.next = n3; n3.next = n4;

console.log(boundaryNode(n1, n1));  // first
console.log(boundaryNode(n1, n4));  // last
console.log(boundaryNode(n1, n3));  // none
```

```go,editable
package main

import "fmt"

type ListNode struct { Val int; Next *ListNode }

func boundaryNode(head, node *ListNode) string {
    if head == nil || node == nil { return "none" }

    isHead := node == head        // Pointer equality
    isTail := node.Next == nil    // No successor → tail

    if isHead && isTail { return "both" }
    if isHead           { return "first" }
    if isTail           { return "last" }
    return "none"
}

func main() {
    n1 := &ListNode{Val: 5}; n2 := &ListNode{Val: 7}
    n3 := &ListNode{Val: 3}; n4 := &ListNode{Val: 10}
    n1.Next = n2; n2.Next = n3; n3.Next = n4

    fmt.Println(boundaryNode(n1, n1))  // first
    fmt.Println(boundaryNode(n1, n4))  // last
    fmt.Println(boundaryNode(n1, n3))  // none
}
```

```kotlin,editable
class ListNode(var `val`: Int, var next: ListNode? = null)

fun boundaryNode(head: ListNode?, node: ListNode?): String {
    if (head == null || node == null) return "none"

    val isHead = node === head        // Reference equality
    val isTail = node.next == null    // No successor → tail

    return when {
        isHead && isTail -> "both"
        isHead           -> "first"
        isTail           -> "last"
        else             -> "none"
    }
}

fun main() {
    val n1 = ListNode(5); val n2 = ListNode(7)
    val n3 = ListNode(3); val n4 = ListNode(10)
    n1.next = n2; n2.next = n3; n3.next = n4

    println(boundaryNode(n1, n1))  // first
    println(boundaryNode(n1, n4))  // last
    println(boundaryNode(n1, n3))  // none
}
```

```rust,editable
#[derive(Debug)]
struct ListNode { val: i32, next: Option<Box<ListNode>> }

impl ListNode {
    fn new(val: i32) -> Self { ListNode { val, next: None } }
}

// In Rust we check boundary by value position rather than pointer identity
// since Box moves ownership. We check if val matches head or tail value.
fn boundary_node(head: &ListNode, target_val: i32) -> &'static str {
    let is_head = head.val == target_val;

    // Walk to find the tail and check if target is the last node
    let mut cur = head;
    while let Some(ref next) = cur.next { cur = next; }
    let is_tail = cur.val == target_val;

    match (is_head, is_tail) {
        (true, true)  => "both",
        (true, false) => "first",
        (false, true) => "last",
        _             => "none",
    }
}

fn main() {
    let mut n1 = ListNode::new(5);
    let mut n2 = ListNode::new(7);
    let mut n3 = ListNode::new(3);
    let     n4 = ListNode::new(10);
    n3.next = Some(Box::new(n4));
    n2.next = Some(Box::new(n3));
    n1.next = Some(Box::new(n2));

    println!("{}", boundary_node(&n1, 5));   // first
    println!("{}", boundary_node(&n1, 10));  // last
    println!("{}", boundary_node(&n1, 3));   // none
}
```

</div>

<details>
<summary><strong>Trace — head = [5, 7, 3, 10], node = the node holding 10</strong></summary>

```
isHead = (node == head)   →  node holds 10, head holds 5   →  false
isTail = (node.next == null) →  10's next is null            →  true

Decision table:
  isHead=false, isTail=true  →  "last" ✓
```

</details>

<details>
<summary><strong>Trace — head = [5], node = the only node</strong></summary>

```
isHead = (node == head)   →  both reference the same object  →  true
isTail = (node.next == null) →  its next is null            →  true

Decision table:
  isHead=true, isTail=true  →  "both" ✓

A single-node list is simultaneously the head AND the tail — the "both" branch
exists specifically for this case.
```

</details>

---

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(1) | Two constant-time comparisons — no loop, no traversal |
| **Space** | O(1) | Two booleans; no auxiliary structures |

The entire point of the problem is to prove the O(1) bound. Any solution that walks the list (to, say, find the tail by counting) already misses the lesson.

---

## Edge Cases

| Case | Example | Expected | Reasoning |
|---|---|---|---|
| `head == null` | empty list | `none` | No list → nothing is a boundary |
| `node == null` | caller passed nothing | `none` | Nothing to classify |
| Single-node list, node is it | `[5]`, node=5 | `both` | Head and tail coincide |
| Node is the head | `[5, 7, 3]`, node=5 | `first` | Only Q1 fires |
| Node is the tail | `[5, 7, 3]`, node=3 | `last` | Only Q2 fires |
| Interior node | `[5, 7, 3]`, node=7 | `none` | Neither Q1 nor Q2 fires |
| Two-node list, node is middle | impossible | — | In a 2-node list there is no middle — every node is a boundary |

---

## Final Takeaway

Every linked-list problem you'll ever solve starts with one of two questions: *"is this the head?"* or *"does this node have a successor?"* You just wrote the answer to both. Memorise the pattern — **`node == head`** is pointer identity, **`node.next == null`** is tail detection — because these two checks will reappear in every insertion, deletion, reversal, and traversal problem to come. Notice something deeper: we didn't actually need the *value* stored in the node. Linked-list problems are almost always about **structure**, not data.

> **Transfer Challenge:** Extend the function to return the node's **position** in the list — `0` for head, `-1` for tail, `-2` if it's both, or a positive index for interior nodes. Now you *are* allowed to traverse. What's the minimum number of traversals needed? One or two?
>
> <details><summary><strong>Solution hint</strong></summary>
>
> One pass suffices. Walk from the head, incrementing an index counter. When you hit the target node, remember its index and whether it was the head (index 0) — but keep walking to see if it's also the tail (its `next` was null when you hit it). Return `-2` if index was 0 and it was the tail, `0` if index was 0 and there's more list after it, `-1` if it was the tail but not the head, otherwise the positive index.
>
> </details>
