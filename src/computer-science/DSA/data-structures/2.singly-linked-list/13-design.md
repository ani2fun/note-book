# 13. Design a Singly Linked List

## The Hook

Every language you'll ever use ships with a linked-list library — Java's `LinkedList`, C++'s `std::list`, Python's `collections.deque`. You've used them. You've never built one. This is the lesson where you stop being a consumer and start being the engineer who understands why `list.addFirst(x)` is O(1) but `list.get(99)` is not.

You've already met every primitive you need — node definition (lesson 1), traversal (lesson 2), insertion (lesson 3), deletion (lesson 4). This lesson ties them together into a single class that exposes a complete public API: `prepend`, `append`, `insert`, `remove`, `search`, `size`, `empty`. Writing this from scratch forces you to confront **every design trade-off** you've been meeting one at a time: cached size vs computed size, head-only vs head + tail, bounds semantics, null safety. The implementation is short; the *choices* are what matter.

---

## The Problem

> Implement a `SinglyLinkedList` class that supports:
>
> - `SinglyLinkedList()` — initialize an empty list.
> - `size()` — return the current number of elements.
> - `empty()` — return `true` iff the list has no elements.
> - `prepend(val)` — insert a node with value `val` at the beginning.
> - `append(val)` — insert a node with value `val` at the end.
> - `insert(position, val)` — insert a node with value `val` at 0-indexed `position`. If `position ≤ 0`, prepend. If `position` exceeds the current list length, append to the end.
> - `remove(val)` — remove the **first** node whose value matches `val`. Return `true` on success, `false` if not found.
> - `search(val)` — return `true` iff some node's value equals `val`.

```
Input:
  ops  = [SinglyLinkedList, prepend, prepend, append, size, search, insert, remove, empty]
  args = [[],                [2],     [3],     [1],    [],   [5],    [1, 8], [2],    []]

Output:
  [null, null, null, null, 3, false, null, true, false]

Step-by-step:
  SinglyLinkedList()    → list = []
  prepend(2)            → list = [2]
  prepend(3)            → list = [3, 2]
  append(1)             → list = [3, 2, 1]
  size()                → 3
  search(5)             → false
  insert(1, 8)          → list = [3, 8, 2, 1]
  remove(2)             → list = [3, 8, 1],  returns true
  empty()               → false
```

---

## What Does "Design a Linked List" Really Ask?

"Design" is the keyword that separates this from the operation-specific lessons. You're not implementing *one* operation — you're deciding **what state the class keeps** so that all seven operations can run efficiently and coexist correctly.

Two design decisions shape every linked-list class you'll ever write:

1. **Do we cache `size` on the object, or recompute it every call?**  
   *Cached* — `size()` is O(1), but every insert and delete must increment/decrement a counter. Mismatched book-keeping (forgetting to decrement on a failed delete, double-counting on re-entrant inserts) is a classic silent bug.  
   *Recomputed* — `size()` costs O(n). No counter to maintain. Simpler but slower for size-heavy workloads.

2. **Do we keep a `tail` pointer, or walk to find the tail?**  
   *Cached `tail`* — `append` becomes O(1). But every operation that might change the tail (head deletion that empties the list, removal of the last node, insert at position = size) must remember to update it.  
   *No `tail`* — `append` is O(n) but there's one less invariant to maintain.

```d2
direction: right
h: head {shape: oval}
n1: "3"
n2: "8"
n3: "2"
n4: "1"
t: "tail (optional)" {shape: oval; style.stroke-dash: 3}
s: "currentSize: 4" {shape: rectangle; style.fill: "#ede9fe"; style.stroke: "#3b82f6"}
h -> n1
n1 -> n2
n2 -> n3
n3 -> n4
t -> n4: "" {style.stroke-dash: 3}
```

<p align="center"><strong>The <code>SinglyLinkedList</code> object owns three pieces of state — <code>head</code> (always), <code>currentSize</code> (usually cached), and <code>tail</code> (sometimes cached). The trade-offs are the whole design.</strong></p>

For this lesson we take the **cached-size, no-tail** design — it matches what the reference expects and highlights the O(n) cost of `append` as a teachable weakness. In the transfer challenge at the end, you'll add a tail pointer and see the change in operation costs.

---

## Applying the Diagnostic Questions

| Question | Answer |
|---|---|
| **Q1.** Why do we need the `empty()` predicate when we could just check `size() == 0`? | **Clarity & cheapness** — `empty()` is an O(1) head-null check; readable at call sites. |
| **Q2.** Why track `currentSize` at all? | **O(1) `size()` queries** — recomputing via traversal costs O(n) per call. |
| **Q3.** Why does `insert(pos, val)` with `pos ≤ 0` reduce to `prepend`? | **Negative / zero positions map to "before the head"** — a single degenerate case handled once. |
| **Q4.** Why does `remove(val)` need a special case for the head? | **The head has no predecessor** — the generic "find predecessor, splice" logic can't apply. |

### Q1 — Why a dedicated `empty()` method?

**Mental model:** `empty()` is about *existence*, `size()` is about *count*. Clients frequently want "is there anything here?" and not "how many?". Giving each question its own method makes call sites read clearly.

**Concrete numbers:** `empty()` is one pointer comparison against `null` — roughly 1 nanosecond. `size() == 0` costs the same *if* `size` is cached, but in designs where it isn't, the latter is O(n). Defining both decouples API ergonomics from implementation choices.

**What breaks otherwise:** omitting `empty()` forces every caller to write `list.size() == 0`, which both obscures intent and couples the caller to the costs of `size()`. Seemingly innocent until the day you switch to a recomputed-size design.

### Q2 — Why cache `currentSize`?

**Mental model:** `size()` is called **far more often** than insertions and deletions in typical workloads (think: "while size > 0, pop and process"). Optimising the common case is worth paying a small bookkeeping price on the rare case.

**Concrete numbers:** one increment on `prepend`, `append`, `insert`; one decrement on successful `remove`. Six extra lines of code total. In exchange, `size()` drops from O(n) to O(1).

**What breaks otherwise:** if `remove` forgets to decrement on success, `size()` drifts upward and stays wrong forever. This is why the counter updates live *inside* the methods, next to the pointer mutations — not in a wrapper.

### Q3 — Why does `pos ≤ 0` collapse to `prepend`?

**Mental model:** inserting at position `0` puts the new node at the head. Any negative position is nonsense, but rather than throw, the standard convention is to clamp it to the nearest legal value — `0` — and prepend. "Before the start" means "at the start".

**Concrete numbers:** `insert(0, 8)` → prepend. `insert(-5, 8)` → prepend. `insert(1, 8)` on a 5-node list → splice at position 1. `insert(100, 8)` on a 5-node list → walk to the tail and append (loop terminates at `current.next == null`).

**What breaks otherwise:** throwing on negative positions punishes defensive callers. Clamping makes the API Robinson-friendly. The clamp-at-zero pattern is the same one you meet in `array.slice(-1)` — negative indices have conventions, not errors.

### Q4 — Why the head special case in `remove`?

**Mental model:** every other node in the list has a predecessor whose `.next` pointer we can redirect. The head has nothing pointing at it — except the list's own `head` field. So removing the head means updating the list object, not splicing a pointer elsewhere.

**Concrete numbers:** for `[3, 8, 1]` with target `val = 3`, the splice-by-predecessor logic would need a "fake predecessor" to redirect. It's cleaner to just check `head.val == val` up front and do `head = head.next`.

**What breaks otherwise:** without the head special case, attempting `remove` on the head either crashes with a null-deref (there's no predecessor to follow) or requires contortions like a dummy sentinel. Treating the head as its own case is the conventional, readable answer.

---

## The Operation Map (Visualised)

```d2
fast: "O(1) operations" {
  style.fill: "#dcfce7"
  style.stroke: "#16a34a"
  grid-columns: 3
  grid-gap: 12
  a1: "size()"
  a2: "empty()"
  a3: "prepend(val)"
}

slow: "O(n) operations" {
  style.fill: "#fee2e2"
  style.stroke: "#dc2626"
  grid-columns: 2
  grid-gap: 12
  b1: "append(val)"
  b2: "insert(pos, val) (worst case)"
  b3: "remove(val) (worst case)"
  b4: "search(val) (worst case)"
}
```

<p align="center"><strong>The cost map. Three operations are O(1) because they touch only <code>head</code> and <code>currentSize</code>. The other four require traversal. Caching a <code>tail</code> pointer would move <code>append</code> into the fast column.</strong></p>

---

## The Solution

<div class="lang-tabs">

```python,editable
class ListNode:
    def __init__(self, val=0, nxt=None):
        self.val = val
        self.next = nxt

class SinglyLinkedList:
    def __init__(self):
        self.head = None      # pointer to the first node; None when the list is empty
        self.current_size = 0 # cached so size() can answer in O(1)

    def empty(self) -> bool:
        # Existence check — single null comparison, O(1)
        return self.head is None

    def size(self) -> int:
        # Cached counter — kept in sync by every mutator below
        return self.current_size

    def prepend(self, val: int) -> None:
        # Head-insertion: new node points to old head, becomes new head; classic O(1)
        self.head = ListNode(val, self.head)
        self.current_size += 1

    def append(self, val: int) -> None:
        node = ListNode(val)
        if self.empty():
            # No head yet — the new node IS the head
            self.head = node
        else:
            # Walk to the tail (last node's next is None) and splice on
            cur = self.head
            while cur.next is not None:
                cur = cur.next
            cur.next = node
        self.current_size += 1

    def insert(self, position: int, val: int) -> None:
        # Clamp-at-zero: negative positions treated as "before the head"
        if position <= 0:
            self.prepend(val)
            return
        if self.empty():
            # No list to insert into and position > 0 → no-op per contract
            return

        # Walk to the PREDECESSOR of the target position (or stop at the tail)
        cur = self.head
        idx = 0
        while cur.next is not None and idx < position - 1:
            cur = cur.next
            idx += 1

        # Splice: new node inherits cur.next, cur now points at new node
        cur.next = ListNode(val, cur.next)
        self.current_size += 1

    def remove(self, val: int) -> bool:
        if self.empty():
            return False

        # Head special case: nothing points AT head except self.head itself
        if self.head.val == val:
            self.head = self.head.next
            self.current_size -= 1
            return True

        # Generic case: find the PREDECESSOR of the victim, then splice
        cur = self.head
        while cur.next is not None:
            if cur.next.val == val:
                cur.next = cur.next.next   # unlink — GC reclaims the victim
                self.current_size -= 1
                return True
            cur = cur.next

        # Walked the whole list without finding val
        return False

    def search(self, val: int) -> bool:
        # Linear scan; O(n) worst case, O(1) best case (val is at head)
        cur = self.head
        while cur is not None:
            if cur.val == val:
                return True
            cur = cur.next
        return False


# --- driver ---
lst = SinglyLinkedList()
lst.prepend(2)
lst.prepend(3)
lst.append(1)
print(lst.size())        # 3
print(lst.search(5))     # False
lst.insert(1, 8)         # list = [3, 8, 2, 1]
print(lst.remove(2))     # True
print(lst.empty())       # False
```

```java,editable
class SinglyLinkedList {
    private static class Node {
        int val; Node next;
        Node(int v) { val = v; }
    }

    private Node head;
    private int  currentSize;

    public SinglyLinkedList() {
        head = null;
        currentSize = 0;
    }

    public boolean empty() { return head == null; }
    public int size()      { return currentSize; }

    public void prepend(int val) {
        Node n = new Node(val);
        n.next = head;
        head = n;
        currentSize++;
    }

    public void append(int val) {
        Node n = new Node(val);
        if (empty()) {
            head = n;
        } else {
            Node cur = head;
            while (cur.next != null) cur = cur.next;   // walk to the tail
            cur.next = n;
        }
        currentSize++;
    }

    public void insert(int position, int val) {
        if (position <= 0) { prepend(val); return; }
        if (empty()) return;

        Node cur = head;
        int  idx = 0;
        while (cur.next != null && idx < position - 1) {
            cur = cur.next;
            idx++;
        }
        Node n = new Node(val);
        n.next = cur.next;   // new node inherits cur's old successor
        cur.next = n;        // cur now points at the new node
        currentSize++;
    }

    public boolean remove(int val) {
        if (empty()) return false;
        if (head.val == val) {
            head = head.next;           // head special case — no predecessor
            currentSize--;
            return true;
        }
        Node cur = head;
        while (cur.next != null) {
            if (cur.next.val == val) {
                cur.next = cur.next.next;   // splice out victim
                currentSize--;
                return true;
            }
            cur = cur.next;
        }
        return false;
    }

    public boolean search(int val) {
        for (Node cur = head; cur != null; cur = cur.next)
            if (cur.val == val) return true;
        return false;
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct Node {
    int val;
    struct Node *next;
} Node;

typedef struct {
    Node *head;
    int   currentSize;
} SinglyLinkedList;

SinglyLinkedList* sll_create(void) {
    SinglyLinkedList *l = malloc(sizeof(SinglyLinkedList));
    l->head = NULL;
    l->currentSize = 0;
    return l;
}

bool sll_empty(SinglyLinkedList *l) { return l->head == NULL; }
int  sll_size (SinglyLinkedList *l) { return l->currentSize; }

static Node* node_new(int v) {
    Node *n = malloc(sizeof(Node));
    n->val = v; n->next = NULL;
    return n;
}

void sll_prepend(SinglyLinkedList *l, int val) {
    Node *n = node_new(val);
    n->next = l->head;
    l->head = n;
    l->currentSize++;
}

void sll_append(SinglyLinkedList *l, int val) {
    Node *n = node_new(val);
    if (sll_empty(l)) { l->head = n; }
    else {
        Node *cur = l->head;
        while (cur->next) cur = cur->next;   /* walk to tail */
        cur->next = n;
    }
    l->currentSize++;
}

void sll_insert(SinglyLinkedList *l, int position, int val) {
    if (position <= 0) { sll_prepend(l, val); return; }
    if (sll_empty(l)) return;

    Node *cur = l->head;
    int   idx = 0;
    while (cur->next && idx < position - 1) { cur = cur->next; idx++; }

    Node *n = node_new(val);
    n->next = cur->next;
    cur->next = n;
    l->currentSize++;
}

bool sll_remove(SinglyLinkedList *l, int val) {
    if (sll_empty(l)) return false;
    if (l->head->val == val) {
        Node *tmp = l->head; l->head = l->head->next; free(tmp);
        l->currentSize--;
        return true;
    }
    Node *cur = l->head;
    while (cur->next) {
        if (cur->next->val == val) {
            Node *tmp = cur->next;
            cur->next = cur->next->next;
            free(tmp);
            l->currentSize--;
            return true;
        }
        cur = cur->next;
    }
    return false;
}

bool sll_search(SinglyLinkedList *l, int val) {
    for (Node *cur = l->head; cur; cur = cur->next)
        if (cur->val == val) return true;
    return false;
}
```

```cpp,editable
#include <iostream>

class SinglyLinkedList {
    struct Node { int val; Node *next; Node(int v) : val(v), next(nullptr) {} };

    Node *head;
    int   currentSize;

public:
    SinglyLinkedList() : head(nullptr), currentSize(0) {}

    ~SinglyLinkedList() {
        while (head) { Node *t = head; head = head->next; delete t; }
    }

    bool empty() { return head == nullptr; }
    int  size()  { return currentSize; }

    void prepend(int val) {
        Node *n = new Node(val);
        n->next = head;
        head = n;
        currentSize++;
    }

    void append(int val) {
        Node *n = new Node(val);
        if (empty()) head = n;
        else {
            Node *cur = head;
            while (cur->next) cur = cur->next;   // walk to tail
            cur->next = n;
        }
        currentSize++;
    }

    void insert(int position, int val) {
        if (position <= 0) { prepend(val); return; }
        if (empty()) return;

        Node *cur = head;
        int idx = 0;
        while (cur->next && idx < position - 1) { cur = cur->next; idx++; }

        Node *n = new Node(val);
        n->next = cur->next;
        cur->next = n;
        currentSize++;
    }

    bool remove(int val) {
        if (empty()) return false;
        if (head->val == val) {
            Node *tmp = head; head = head->next; delete tmp;
            currentSize--;
            return true;
        }
        Node *cur = head;
        while (cur->next) {
            if (cur->next->val == val) {
                Node *tmp = cur->next;
                cur->next = cur->next->next;
                delete tmp;
                currentSize--;
                return true;
            }
            cur = cur->next;
        }
        return false;
    }

    bool search(int val) {
        for (Node *cur = head; cur; cur = cur->next)
            if (cur->val == val) return true;
        return false;
    }
};
```

```scala,editable
class SinglyLinkedList {
  private class Node(var v: Int, var next: Node = null)

  private var head: Node = null
  private var currentSize: Int = 0

  def empty(): Boolean = head == null
  def size(): Int = currentSize

  def prepend(v: Int): Unit = {
    val n = new Node(v, head)
    head = n
    currentSize += 1
  }

  def append(v: Int): Unit = {
    val n = new Node(v)
    if (empty()) head = n
    else {
      var cur = head
      while (cur.next != null) cur = cur.next    // walk to tail
      cur.next = n
    }
    currentSize += 1
  }

  def insert(position: Int, v: Int): Unit = {
    if (position <= 0) { prepend(v); return }
    if (empty()) return

    var cur = head; var idx = 0
    while (cur.next != null && idx < position - 1) { cur = cur.next; idx += 1 }

    val n = new Node(v, cur.next)
    cur.next = n
    currentSize += 1
  }

  def remove(v: Int): Boolean = {
    if (empty()) return false
    if (head.v == v) { head = head.next; currentSize -= 1; return true }

    var cur = head
    while (cur.next != null) {
      if (cur.next.v == v) {
        cur.next = cur.next.next
        currentSize -= 1
        return true
      }
      cur = cur.next
    }
    false
  }

  def search(v: Int): Boolean = {
    var cur = head
    while (cur != null) {
      if (cur.v == v) return true
      cur = cur.next
    }
    false
  }
}
```

```javascript,editable
class Node {
    constructor(val, next = null) { this.val = val; this.next = next; }
}

class SinglyLinkedList {
    constructor() {
        this.head = null;
        this.currentSize = 0;
    }

    empty() { return this.head === null; }
    size()  { return this.currentSize; }

    prepend(val) {
        this.head = new Node(val, this.head);
        this.currentSize++;
    }

    append(val) {
        const n = new Node(val);
        if (this.empty()) { this.head = n; }
        else {
            let cur = this.head;
            while (cur.next !== null) cur = cur.next;   // walk to tail
            cur.next = n;
        }
        this.currentSize++;
    }

    insert(position, val) {
        if (position <= 0) { this.prepend(val); return; }
        if (this.empty())   return;

        let cur = this.head, idx = 0;
        while (cur.next !== null && idx < position - 1) { cur = cur.next; idx++; }

        cur.next = new Node(val, cur.next);
        this.currentSize++;
    }

    remove(val) {
        if (this.empty()) return false;
        if (this.head.val === val) {
            this.head = this.head.next;   // head special case
            this.currentSize--;
            return true;
        }
        let cur = this.head;
        while (cur.next !== null) {
            if (cur.next.val === val) {
                cur.next = cur.next.next;
                this.currentSize--;
                return true;
            }
            cur = cur.next;
        }
        return false;
    }

    search(val) {
        for (let cur = this.head; cur !== null; cur = cur.next)
            if (cur.val === val) return true;
        return false;
    }
}

// driver
const lst = new SinglyLinkedList();
lst.prepend(2); lst.prepend(3); lst.append(1);
console.log(lst.size());    // 3
console.log(lst.search(5)); // false
lst.insert(1, 8);
console.log(lst.remove(2)); // true
console.log(lst.empty());   // false
```

```typescript,editable
class Node {
    val:  number;
    next: Node | null;
    constructor(val: number, next: Node | null = null) { this.val = val; this.next = next; }
}

class SinglyLinkedList {
    private head: Node | null = null;
    private currentSize: number = 0;

    empty(): boolean { return this.head === null; }
    size():  number  { return this.currentSize; }

    prepend(val: number): void {
        this.head = new Node(val, this.head);
        this.currentSize++;
    }

    append(val: number): void {
        const n = new Node(val);
        if (this.empty()) { this.head = n; }
        else {
            let cur: Node = this.head!;
            while (cur.next !== null) cur = cur.next;
            cur.next = n;
        }
        this.currentSize++;
    }

    insert(position: number, val: number): void {
        if (position <= 0) { this.prepend(val); return; }
        if (this.empty())   return;

        let cur: Node = this.head!, idx = 0;
        while (cur.next !== null && idx < position - 1) { cur = cur.next; idx++; }

        cur.next = new Node(val, cur.next);
        this.currentSize++;
    }

    remove(val: number): boolean {
        if (this.empty()) return false;
        if (this.head!.val === val) {
            this.head = this.head!.next;
            this.currentSize--;
            return true;
        }
        let cur: Node = this.head!;
        while (cur.next !== null) {
            if (cur.next.val === val) {
                cur.next = cur.next.next;
                this.currentSize--;
                return true;
            }
            cur = cur.next;
        }
        return false;
    }

    search(val: number): boolean {
        for (let cur = this.head; cur !== null; cur = cur.next)
            if (cur.val === val) return true;
        return false;
    }
}
```

```go,editable
package main

import "fmt"

type node struct {
    val  int
    next *node
}

type SinglyLinkedList struct {
    head        *node
    currentSize int
}

func (l *SinglyLinkedList) Empty() bool { return l.head == nil }
func (l *SinglyLinkedList) Size()  int  { return l.currentSize }

func (l *SinglyLinkedList) Prepend(val int) {
    l.head = &node{val: val, next: l.head}
    l.currentSize++
}

func (l *SinglyLinkedList) Append(val int) {
    n := &node{val: val}
    if l.Empty() {
        l.head = n
    } else {
        cur := l.head
        for cur.next != nil {   // walk to tail
            cur = cur.next
        }
        cur.next = n
    }
    l.currentSize++
}

func (l *SinglyLinkedList) Insert(position, val int) {
    if position <= 0 { l.Prepend(val); return }
    if l.Empty()     { return }

    cur, idx := l.head, 0
    for cur.next != nil && idx < position-1 {
        cur = cur.next
        idx++
    }
    cur.next = &node{val: val, next: cur.next}
    l.currentSize++
}

func (l *SinglyLinkedList) Remove(val int) bool {
    if l.Empty() { return false }
    if l.head.val == val {
        l.head = l.head.next
        l.currentSize--
        return true
    }
    cur := l.head
    for cur.next != nil {
        if cur.next.val == val {
            cur.next = cur.next.next
            l.currentSize--
            return true
        }
        cur = cur.next
    }
    return false
}

func (l *SinglyLinkedList) Search(val int) bool {
    for cur := l.head; cur != nil; cur = cur.next {
        if cur.val == val { return true }
    }
    return false
}

func main() {
    l := &SinglyLinkedList{}
    l.Prepend(2); l.Prepend(3); l.Append(1)
    fmt.Println(l.Size())      // 3
    fmt.Println(l.Search(5))   // false
    l.Insert(1, 8)
    fmt.Println(l.Remove(2))   // true
    fmt.Println(l.Empty())     // false
}
```

```kotlin,editable
class SinglyLinkedList {
    private class Node(var v: Int, var next: Node? = null)

    private var head: Node? = null
    private var currentSize: Int = 0

    fun empty(): Boolean = head == null
    fun size():  Int     = currentSize

    fun prepend(v: Int) {
        head = Node(v, head)
        currentSize++
    }

    fun append(v: Int) {
        val n = Node(v)
        if (empty()) { head = n }
        else {
            var cur = head
            while (cur!!.next != null) cur = cur.next
            cur.next = n
        }
        currentSize++
    }

    fun insert(position: Int, v: Int) {
        if (position <= 0) { prepend(v); return }
        if (empty())       return

        var cur = head; var idx = 0
        while (cur!!.next != null && idx < position - 1) { cur = cur.next; idx++ }

        cur.next = Node(v, cur.next)
        currentSize++
    }

    fun remove(v: Int): Boolean {
        if (empty()) return false
        if (head!!.v == v) {
            head = head!!.next
            currentSize--
            return true
        }
        var cur = head
        while (cur!!.next != null) {
            if (cur.next!!.v == v) {
                cur.next = cur.next!!.next
                currentSize--
                return true
            }
            cur = cur.next
        }
        return false
    }

    fun search(v: Int): Boolean {
        var cur = head
        while (cur != null) {
            if (cur.v == v) return true
            cur = cur.next
        }
        return false
    }
}
```

```rust,editable
pub struct SinglyLinkedList {
    head: Option<Box<Node>>,
    current_size: usize,
}

struct Node {
    val:  i32,
    next: Option<Box<Node>>,
}

impl SinglyLinkedList {
    pub fn new() -> Self {
        SinglyLinkedList { head: None, current_size: 0 }
    }

    pub fn empty(&self) -> bool { self.head.is_none() }
    pub fn size(&self)  -> usize { self.current_size }

    pub fn prepend(&mut self, val: i32) {
        let n = Box::new(Node { val, next: self.head.take() });
        self.head = Some(n);
        self.current_size += 1;
    }

    pub fn append(&mut self, val: i32) {
        // Walk to the tail's `next` slot (which is None) and drop a new Box there
        let mut cur = &mut self.head;
        while let Some(ref mut node) = *cur {
            if node.next.is_none() { break; }
            cur = &mut node.next;
        }
        match cur {
            None        => *cur = Some(Box::new(Node { val, next: None })),
            Some(node)  => node.next = Some(Box::new(Node { val, next: None })),
        }
        self.current_size += 1;
    }

    pub fn insert(&mut self, position: isize, val: i32) {
        if position <= 0 { self.prepend(val); return; }
        if self.head.is_none() { return; }

        let pos = position as usize;
        let mut cur = self.head.as_mut().unwrap();
        let mut idx = 0;
        while cur.next.is_some() && idx < pos - 1 {
            cur = cur.next.as_mut().unwrap();
            idx += 1;
        }
        let new_node = Box::new(Node { val, next: cur.next.take() });
        cur.next = Some(new_node);
        self.current_size += 1;
    }

    pub fn remove(&mut self, val: i32) -> bool {
        if self.head.is_none() { return false; }
        if self.head.as_ref().unwrap().val == val {
            self.head = self.head.take().unwrap().next;
            self.current_size -= 1;
            return true;
        }
        let mut cur = self.head.as_mut().unwrap();
        while cur.next.is_some() {
            if cur.next.as_ref().unwrap().val == val {
                let victim = cur.next.take().unwrap();
                cur.next = victim.next;
                self.current_size -= 1;
                return true;
            }
            cur = cur.next.as_mut().unwrap();
        }
        false
    }

    pub fn search(&self, val: i32) -> bool {
        let mut cur = &self.head;
        while let Some(node) = cur {
            if node.val == val { return true; }
            cur = &node.next;
        }
        false
    }
}

fn main() {
    let mut l = SinglyLinkedList::new();
    l.prepend(2); l.prepend(3); l.append(1);
    println!("{}", l.size());          // 3
    println!("{}", l.search(5));       // false
    l.insert(1, 8);
    println!("{}", l.remove(2));       // true
    println!("{}", l.empty());         // false
}
```

</div>

<details>
<summary><strong>Trace — the canonical example sequence</strong></summary>

```
Op                         | Internal state              | Return
----------------------------|-----------------------------|--------
SinglyLinkedList()          | head=null, size=0           | —
prepend(2)                  | head → 2;           size=1  | null
prepend(3)                  | head → 3 → 2;       size=2  | null
append(1)                   | head → 3 → 2 → 1;   size=3  | null
size()                      | (unchanged)                 | 3
search(5)                   | scan; no match              | false
insert(1, 8)                | head → 3 → 8 → 2 → 1; size=4 | null
                              ↑ walk to predecessor of pos 1 (which is node 3)
                              ↑ then splice: node 3's next becomes new node,
                                new node's next becomes old node 2
remove(2)                   | head → 3 → 8 → 1;   size=3  | true
                              ↑ find predecessor of node 2 (node 8)
                              ↑ splice: node 8's next = node 1
empty()                     | head is not null            | false
```

</details>

---

## Complexity Analysis

| Operation | Time | Space | Notes |
|---|---|---|---|
| `SinglyLinkedList()` | O(1) | O(1) | trivial init |
| `empty()` | O(1) | O(1) | single null check |
| `size()` | O(1) | O(1) | cached counter |
| `prepend(val)` | O(1) | O(1) | two pointer updates + alloc |
| `append(val)` | **O(n)** | O(1) | walks to the tail — no tail cache |
| `insert(pos, val)` | **O(n)** worst case, O(1) at head | O(1) | walk cost bounded by `min(pos, n)` |
| `remove(val)` | **O(n)** worst case, O(1) at head | O(1) | find predecessor, splice |
| `search(val)` | **O(n)** worst case, O(1) at head | O(1) | linear scan |

The "**all O(n)**" row is the cost of the **no-tail** design. Caching a `tail` pointer drops `append` to O(1) but requires `tail` updates on every insert/delete that might change the last node.

---

## Edge Cases

| Case | Example | Expected behaviour |
|---|---|---|
| Operations on a fresh list | `list.size()`, `list.empty()`, `list.search(5)`, `list.remove(5)` | `0`, `true`, `false`, `false` |
| Prepend to empty | `prepend(2)` on `[]` | `[2]`, size → 1 |
| Append to empty | `append(2)` on `[]` | `[2]`, size → 1 (head becomes the new node) |
| Insert at position 0 | `insert(0, 9)` | equivalent to `prepend(9)` |
| Insert at negative position | `insert(-5, 9)` | clamps to `prepend(9)` |
| Insert past the end | `insert(100, 9)` on `[1, 2, 3]` | loop stops at tail; appends to end → `[1, 2, 3, 9]` |
| Remove the only node | `remove(5)` on `[5]` | `head` becomes `null`, size → 0, returns `true` |
| Remove non-existent value | `remove(99)` on `[1, 2, 3]` | list unchanged, returns `false` |
| Duplicate values, remove first | `remove(2)` on `[1, 2, 2, 3]` | removes the **first** 2 → `[1, 2, 3]` |

---

## Final Takeaway

You just built the linked list. Every operation from lessons 1–4 is here, wired together into a single class with a cohesive API. Two lessons are worth taking away:

1. **The class's state IS the design.** `head`, `currentSize`, and (optionally) `tail` are three fields that encode three trade-offs. Every design decision you make — cache this, recompute that, reject this, clamp that — lives in those fields and the invariants you maintain on them.
2. **The head is always special.** Every linked-list operation has a "the head case" because the head has no predecessor. Internalise this and you stop being surprised by it. Better: read *any* linked-list library code you find and you'll see the same pattern — head is always its own branch.

When you next see "design a …" for stacks, queues, graphs, trees — reach for the same pattern. **Identify the minimum state. Write down the invariants. Code the operations around those invariants.** The rest is mechanical.

> **Transfer Challenge:** Extend this class by caching a `tail` pointer so that `append` runs in O(1). Which existing operations now need to update `tail`, and which are unchanged? What's the **minimum set** of lines you must change?
>
> <details><summary><strong>Answer</strong></summary>
>
> Operations that must update <code>tail</code>:<br>
> - <code>append</code> — <code>tail.next = n; tail = n</code> in the non-empty case; <code>head = tail = n</code> in the empty case. Now O(1).<br>
> - <code>prepend</code> — only when the list was empty: <code>tail = new_head</code>. Otherwise unchanged.<br>
> - <code>insert</code> — if <code>position</code> reaches the end of the list, the newly inserted node becomes the tail. Check: if <code>cur == tail</code> before splicing, update <code>tail = n</code> after.<br>
> - <code>remove</code> — if the removed node was the tail, update <code>tail</code> to its predecessor. Note: singly linked lists can't find the predecessor in O(1), so tail-removal ironically costs O(n) even with a tail cache. This is the case where doubly linked lists win.<br>
> <br>
> Unchanged: <code>size</code>, <code>empty</code>, <code>search</code>.<br>
> <br>
> The net effect: append becomes O(1), but tail-removal stays O(n). For strict queue-like usage (append + prepend + remove from head), this is the best you can do with a singly linked list. For O(1) on both ends, you need doubly linked (the next chapter).
>
> </details>
