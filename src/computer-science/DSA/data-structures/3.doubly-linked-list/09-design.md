# 9. Design

## The Hook

You've spent eight lessons learning the *parts*. Now we put them together. By the end of this single section you'll have a working **`DoublyLinkedList` class** — the same kind of object that lives behind Python's `collections.deque`, Java's `LinkedList`, every LRU cache in production, every undo stack, every browser history list. The eight operations below aren't separate ideas anymore — they're recombinations of three primitives you already own: **traversal, insertion, deletion**.

The interesting question isn't "can I implement this?" — by now you can. The interesting question is "how do I keep the bookkeeping correct under every edge case?" Every method below has at least one boundary condition where the wrong update silently corrupts the chain. The discipline is the same as in lessons 03 and 04: **save before clobber, mirror every link, update size last**.

---

## Table of contents

1. [Design a doubly linked list](#design-a-doubly-linked-list)

***

# Design a doubly linked list

## The Problem

Given the skeleton of a **`DoublyLinkedList`** class, complete this class by implementing all the doubly linked list operations below.

> -   **`DoublyLinkedList()`** — initialises the `DoublyLinkedList` object.
> -   **`size()`** — returns the current size of the list.
> -   **`empty()`** — returns `true` if the list is empty and `false` if it is not.
> -   **`prepend(val)`** — inserts a node with the given value at the beginning of the list.
> -   **`append(val)`** — inserts a node with the given value at the end of the list.
> -   **`insert(position, val)`** — inserts a node with the given value at the given position in the list. Positions are indexed from 0, meaning the first node is at position 0.
> -   **`remove(val)`** — removes the first node whose value matches the given value. Returns `true` if the node was removed; otherwise, returns `false`.
> -   **`search(val)`** — returns `true` if a node with the given value exists in the linked list; returns `false` otherwise.

> The input should adhere to the following rules:
>
> 1. The input contains two arrays of the same size.
> 2. The first array contains the list of operations; the second contains the corresponding operands for those operations.
> 3. The first index in the first array contains `DoublyLinkedList`, and the first index in the second array contains an empty array. This initialises the `DoublyLinkedList`.
> 4. For each index in the first array containing **prepend**, **append**, **remove**, or **search**, the corresponding index in the second array contains the value to insert / remove / search.
> 5. For each index containing the **insert** operation, the corresponding second-array index contains a pair `[position, val]`.
> 6. For **size** or **empty**, the corresponding second-array index contains an empty array.

```
Input:  [DoublyLinkedList, prepend, prepend, append, size, search, insert, remove, empty]
        [[],               [2],     [3],     [1],    [],   [5],    [1, 8], [2],    []]
Output: [null, null, null, null, 3, false, null, true, false]

Trace:
  list = new DoublyLinkedList()  → []
  list.prepend(2)                → [2]
  list.prepend(3)                → [3, 2]
  list.append(1)                 → [3, 2, 1]
  list.size()                    → 3
  list.search(5)                 → false
  list.insert(1, 8)              → [3, 8, 2, 1]
  list.remove(2)                 → [3, 8, 1], returns true
  list.empty()                   → false
```

---

## The Architecture

Every method below is a thin wrapper around the primitives we already know. Three pieces of internal state hold the entire structure together:

```d2
direction: right

dll: "DoublyLinkedList instance" {
  h: |md
    **head**

    first node or null
  |
  t: |md
    **tail**

    last node or null
  |
  s: |md
    **size**

    int counter
  |
}

n1: "val: 3"
n2: "val: 8"
n3: "val: 2"
n4: "val: 1"

n1 <-> n2
n2 <-> n3
n3 <-> n4

dll.h -> n1
dll.t -> n4
```

<p align="center"><strong>Three fields are enough to support every operation in O(1) at the boundaries — <code>head</code> and <code>tail</code> for endpoint access, <code>size</code> for instant <code>size()</code> / <code>empty()</code> queries.</strong></p>

> *Why store `size` explicitly when we could count nodes on demand? — try answering this in your head before reading on.*
>
> Counting nodes is O(N). If callers ask for `size()` thousands of times (which they typically do, in checks like `if list.size() < threshold`), the linear cost dominates. We pay one integer increment/decrement per mutating operation and turn `size()` into O(1). **This is the classic time/space trade — pay 4 bytes once, save O(N) every read.**

The five mutating methods (`prepend`, `append`, `insert`, `remove`) each follow the same template:

```
1. Validate / handle empty-list case
2. Allocate new node OR locate target node
3. Update affected pointers (forward + backward — mirror!)
4. Update head/tail references if the boundary moved
5. Increment / decrement size
6. Return the contractual value
```

Stick to that order — particularly **size last** — and the bookkeeping never drifts.

---

## The Solution

The implementation below mirrors the algorithms from lessons 02-04 (traversal, insertion, deletion). Notice how `prepend`, `append`, and `insert` re-use each other when the position lands at a boundary, and how `remove` distinguishes the head/tail/middle cases the same way deletion-by-data did in lesson 04.

<div class="lang-tabs">

```python,editable
class DoublyLinkedList:
    def __init__(self):
        self.head = None              # First node, or None if empty
        self.tail = None              # Last node, or None if empty
        self._size = 0                # O(1) length — incremented per insert, decremented per remove

    def empty(self) -> bool:
        return self.head is None      # head == None ⇔ list is empty

    def size(self) -> int:
        return self._size             # No counting — value is maintained on every mutation

    def prepend(self, val: int) -> None:
        new_node = ListNode(val)
        if self.empty():              # Boundary: empty list — new node is both head and tail
            self.head = new_node
            self.tail = new_node
        else:                          # Non-empty: new node becomes head, mirror old head's prev
            new_node.next = self.head
            self.head.prev = new_node
            self.head = new_node
        self._size += 1                # Maintain O(1) size invariant

    def append(self, val: int) -> None:
        new_node = ListNode(val)
        if self.empty():              # Boundary: empty list
            self.head = new_node
            self.tail = new_node
        else:                          # Non-empty: new node becomes tail
            new_node.prev = self.tail
            self.tail.next = new_node
            self.tail = new_node
        self._size += 1

    def insert(self, position: int, val: int) -> None:
        if position <= 0:              # Clamp: out-of-range left → prepend
            self.prepend(val)
            return
        if position >= self._size:    # Clamp: out-of-range right → append
            self.append(val)
            return
        # General case — splice between current.prev and current
        new_node = ListNode(val)
        current  = self.head
        idx      = 0
        while current is not None and idx < position:   # Walk to the node currently at `position`
            current = current.next
            idx    += 1
        # current.prev is guaranteed non-None here because position > 0 was clamped above
        new_node.prev      = current.prev
        new_node.next      = current
        current.prev.next  = new_node                   # Predecessor's forward link
        current.prev       = new_node                   # Mirror — current's back link
        self._size += 1

    def remove(self, val: int) -> bool:
        if self.empty():
            return False
        current = self.head
        while current is not None:
            if current.val == val:
                # Three sub-cases — head / tail / middle
                if current is self.head:
                    self.head = current.next
                    if self.head is not None:
                        self.head.prev = None             # New head has no predecessor
                    else:
                        self.tail = None                  # List became empty — clear tail too
                elif current is self.tail:
                    self.tail = current.prev
                    self.tail.next = None                 # New tail has no successor
                else:
                    current.prev.next = current.next      # Splice predecessor → successor
                    current.next.prev = current.prev      # Mirror back-link
                self._size -= 1
                return True
            current = current.next                        # Linear scan continues
        return False                                      # Value not present

    def search(self, val: int) -> bool:
        current = self.head
        while current is not None:
            if current.val == val:
                return True
            current = current.next
        return False
```

```java,editable
class DoublyLinkedList {
    ListNode head;
    ListNode tail;
    int currentSize;

    public DoublyLinkedList() {
        head = null;
        tail = null;
        currentSize = 0;
    }

    public boolean empty() { return head == null; }
    public int size()      { return currentSize; }

    public void prepend(int val) {
        ListNode newNode = new ListNode(val);
        if (empty()) {                            // Empty: new node is both head and tail
            head = newNode;
            tail = newNode;
        } else {                                  // Non-empty: insert before current head
            newNode.next = head;
            head.prev    = newNode;
            head         = newNode;
        }
        currentSize++;
    }

    public void append(int val) {
        ListNode newNode = new ListNode(val);
        if (empty()) {
            head = newNode;
            tail = newNode;
        } else {
            newNode.prev = tail;
            tail.next    = newNode;
            tail         = newNode;
        }
        currentSize++;
    }

    public void insert(int position, int val) {
        if (position <= 0)             { prepend(val); return; }
        if (position >= currentSize)   { append(val);  return; }
        ListNode newNode = new ListNode(val);
        ListNode current = head;
        int idx = 0;
        while (current != null && idx < position) {
            current = current.next;
            idx++;
        }
        newNode.prev      = current.prev;
        newNode.next      = current;
        current.prev.next = newNode;
        current.prev      = newNode;
        currentSize++;
    }

    public boolean remove(int val) {
        if (empty()) return false;
        ListNode current = head;
        while (current != null) {
            if (current.val == val) {
                if (current == head) {
                    head = current.next;
                    if (head != null) head.prev = null;
                    else               tail     = null;
                } else if (current == tail) {
                    tail        = current.prev;
                    tail.next   = null;
                } else {
                    current.prev.next = current.next;
                    current.next.prev = current.prev;
                }
                currentSize--;
                return true;
            }
            current = current.next;
        }
        return false;
    }

    public boolean search(int val) {
        ListNode current = head;
        while (current != null) {
            if (current.val == val) return true;
            current = current.next;
        }
        return false;
    }
}
```

```c,editable
typedef struct DoublyLinkedList {
    ListNode *head;
    ListNode *tail;
    int       currentSize;
} DoublyLinkedList;

DoublyLinkedList* createDLL(void) {
    DoublyLinkedList *dll = (DoublyLinkedList*)malloc(sizeof(DoublyLinkedList));
    dll->head = NULL; dll->tail = NULL; dll->currentSize = 0;
    return dll;
}

int  dll_empty(DoublyLinkedList *l) { return l->head == NULL; }
int  dll_size (DoublyLinkedList *l) { return l->currentSize; }

void dll_prepend(DoublyLinkedList *l, int val) {
    ListNode *n = newListNode(val);
    if (dll_empty(l)) { l->head = n; l->tail = n; }
    else              { n->next = l->head; l->head->prev = n; l->head = n; }
    l->currentSize++;
}

void dll_append(DoublyLinkedList *l, int val) {
    ListNode *n = newListNode(val);
    if (dll_empty(l)) { l->head = n; l->tail = n; }
    else              { n->prev = l->tail; l->tail->next = n; l->tail = n; }
    l->currentSize++;
}

void dll_insert(DoublyLinkedList *l, int position, int val) {
    if (position <= 0)              { dll_prepend(l, val); return; }
    if (position >= l->currentSize) { dll_append (l, val); return; }
    ListNode *n = newListNode(val);
    ListNode *current = l->head;
    int idx = 0;
    while (current != NULL && idx < position) { current = current->next; idx++; }
    n->prev            = current->prev;
    n->next            = current;
    current->prev->next = n;
    current->prev      = n;
    l->currentSize++;
}

int dll_remove(DoublyLinkedList *l, int val) {
    if (dll_empty(l)) return 0;
    ListNode *current = l->head;
    while (current != NULL) {
        if (current->val == val) {
            if (current == l->head) {
                l->head = current->next;
                if (l->head != NULL) l->head->prev = NULL;
                else                 l->tail       = NULL;
            } else if (current == l->tail) {
                l->tail        = current->prev;
                l->tail->next  = NULL;
            } else {
                current->prev->next = current->next;
                current->next->prev = current->prev;
            }
            free(current);
            l->currentSize--;
            return 1;
        }
        current = current->next;
    }
    return 0;
}

int dll_search(DoublyLinkedList *l, int val) {
    ListNode *current = l->head;
    while (current != NULL) {
        if (current->val == val) return 1;
        current = current->next;
    }
    return 0;
}
```

```cpp,editable
class DoublyLinkedList {
public:
    ListNode *head;
    ListNode *tail;
    int currentSize;

    DoublyLinkedList() : head(nullptr), tail(nullptr), currentSize(0) {}

    bool empty() { return head == nullptr; }
    int  size()  { return currentSize; }

    void prepend(int val) {
        ListNode *newNode = new ListNode(val);
        if (empty()) {
            head = newNode;
            tail = newNode;
        } else {
            newNode->next = head;
            head->prev    = newNode;
            head          = newNode;
        }
        currentSize++;
    }

    void append(int val) {
        ListNode *newNode = new ListNode(val);
        if (empty()) {
            head = newNode;
            tail = newNode;
        } else {
            newNode->prev = tail;
            tail->next    = newNode;
            tail          = newNode;
        }
        currentSize++;
    }

    void insert(int position, int val) {
        if (position <= 0)             { prepend(val); return; }
        if (position >= currentSize)   { append(val);  return; }
        ListNode *newNode = new ListNode(val);
        ListNode *current = head;
        int idx = 0;
        while (current && idx < position) { current = current->next; idx++; }
        newNode->prev      = current->prev;
        newNode->next      = current;
        current->prev->next = newNode;
        current->prev      = newNode;
        currentSize++;
    }

    bool remove(int val) {
        if (empty()) return false;
        ListNode *current = head;
        while (current) {
            if (current->val == val) {
                if (current == head) {
                    head = current->next;
                    if (head) head->prev = nullptr;
                    else      tail       = nullptr;
                } else if (current == tail) {
                    tail        = current->prev;
                    tail->next  = nullptr;
                } else {
                    current->prev->next = current->next;
                    current->next->prev = current->prev;
                }
                delete current;
                currentSize--;
                return true;
            }
            current = current->next;
        }
        return false;
    }

    bool search(int val) {
        ListNode *current = head;
        while (current) {
            if (current->val == val) return true;
            current = current->next;
        }
        return false;
    }
};
```

```scala,editable
class DoublyLinkedList {
  var head: ListNode = null
  var tail: ListNode = null
  var currentSize: Int = 0

  def empty(): Boolean = head == null
  def size():  Int     = currentSize

  def prepend(v: Int): Unit = {
    val n = new ListNode(v)
    if (empty()) { head = n; tail = n }
    else         { n.next = head; head.prev = n; head = n }
    currentSize += 1
  }

  def append(v: Int): Unit = {
    val n = new ListNode(v)
    if (empty()) { head = n; tail = n }
    else         { n.prev = tail; tail.next = n; tail = n }
    currentSize += 1
  }

  def insert(position: Int, v: Int): Unit = {
    if (position <= 0)             { prepend(v); return }
    if (position >= currentSize)   { append (v); return }
    val n = new ListNode(v)
    var current = head
    var idx = 0
    while (current != null && idx < position) { current = current.next; idx += 1 }
    n.prev            = current.prev
    n.next            = current
    current.prev.next = n
    current.prev      = n
    currentSize += 1
  }

  def remove(v: Int): Boolean = {
    if (empty()) return false
    var current = head
    while (current != null) {
      if (current.v == v) {
        if (current eq head) {
          head = current.next
          if (head != null) head.prev = null
          else              tail      = null
        } else if (current eq tail) {
          tail       = current.prev
          tail.next  = null
        } else {
          current.prev.next = current.next
          current.next.prev = current.prev
        }
        currentSize -= 1
        return true
      }
      current = current.next
    }
    false
  }

  def search(v: Int): Boolean = {
    var current = head
    while (current != null) {
      if (current.v == v) return true
      current = current.next
    }
    false
  }
}
```

```javascript,editable
class DoublyLinkedList {
    constructor() {
        this.head        = null;
        this.tail        = null;
        this.currentSize = 0;
    }

    empty() { return this.head === null; }
    size()  { return this.currentSize; }

    prepend(val) {
        const n = new ListNode(val);
        if (this.empty()) {
            this.head = n;
            this.tail = n;
        } else {
            n.next         = this.head;
            this.head.prev = n;
            this.head      = n;
        }
        this.currentSize++;
    }

    append(val) {
        const n = new ListNode(val);
        if (this.empty()) {
            this.head = n;
            this.tail = n;
        } else {
            n.prev         = this.tail;
            this.tail.next = n;
            this.tail      = n;
        }
        this.currentSize++;
    }

    insert(position, val) {
        if (position <= 0)                  { this.prepend(val); return; }
        if (position >= this.currentSize)   { this.append(val);  return; }
        const n = new ListNode(val);
        let current = this.head;
        let idx     = 0;
        while (current !== null && idx < position) { current = current.next; idx++; }
        n.prev              = current.prev;
        n.next              = current;
        current.prev.next   = n;
        current.prev        = n;
        this.currentSize++;
    }

    remove(val) {
        if (this.empty()) return false;
        let current = this.head;
        while (current !== null) {
            if (current.val === val) {
                if (current === this.head) {
                    this.head = current.next;
                    if (this.head !== null) this.head.prev = null;
                    else                    this.tail      = null;
                } else if (current === this.tail) {
                    this.tail       = current.prev;
                    this.tail.next  = null;
                } else {
                    current.prev.next = current.next;
                    current.next.prev = current.prev;
                }
                this.currentSize--;
                return true;
            }
            current = current.next;
        }
        return false;
    }

    search(val) {
        let current = this.head;
        while (current !== null) {
            if (current.val === val) return true;
            current = current.next;
        }
        return false;
    }
}
```

```typescript,editable
class DoublyLinkedList {
    head: ListNode | null = null;
    tail: ListNode | null = null;
    currentSize: number = 0;

    empty(): boolean { return this.head === null; }
    size():  number  { return this.currentSize; }

    prepend(val: number): void {
        const n = new ListNode(val);
        if (this.empty()) {
            this.head = n;
            this.tail = n;
        } else {
            n.next             = this.head;
            (this.head as ListNode).prev = n;
            this.head          = n;
        }
        this.currentSize++;
    }

    append(val: number): void {
        const n = new ListNode(val);
        if (this.empty()) {
            this.head = n;
            this.tail = n;
        } else {
            n.prev             = this.tail;
            (this.tail as ListNode).next = n;
            this.tail          = n;
        }
        this.currentSize++;
    }

    insert(position: number, val: number): void {
        if (position <= 0)                   { this.prepend(val); return; }
        if (position >= this.currentSize)    { this.append(val);  return; }
        const n = new ListNode(val);
        let current: ListNode | null = this.head;
        let idx = 0;
        while (current !== null && idx < position) { current = current.next; idx++; }
        const c = current as ListNode;
        n.prev               = c.prev;
        n.next               = c;
        (c.prev as ListNode).next = n;
        c.prev               = n;
        this.currentSize++;
    }

    remove(val: number): boolean {
        if (this.empty()) return false;
        let current: ListNode | null = this.head;
        while (current !== null) {
            if (current.val === val) {
                if (current === this.head) {
                    this.head = current.next;
                    if (this.head !== null) this.head.prev = null;
                    else                    this.tail      = null;
                } else if (current === this.tail) {
                    this.tail       = current.prev;
                    if (this.tail !== null) this.tail.next = null;
                } else {
                    (current.prev as ListNode).next = current.next;
                    (current.next as ListNode).prev = current.prev;
                }
                this.currentSize--;
                return true;
            }
            current = current.next;
        }
        return false;
    }

    search(val: number): boolean {
        let current: ListNode | null = this.head;
        while (current !== null) {
            if (current.val === val) return true;
            current = current.next;
        }
        return false;
    }
}
```

```go,editable
type DoublyLinkedList struct {
    head, tail  *ListNode
    currentSize int
}

func NewDLL() *DoublyLinkedList { return &DoublyLinkedList{} }

func (l *DoublyLinkedList) Empty() bool { return l.head == nil }
func (l *DoublyLinkedList) Size()  int  { return l.currentSize }

func (l *DoublyLinkedList) Prepend(val int) {
    n := &ListNode{Val: val}
    if l.Empty() {
        l.head = n; l.tail = n
    } else {
        n.Next      = l.head
        l.head.Prev = n
        l.head      = n
    }
    l.currentSize++
}

func (l *DoublyLinkedList) Append(val int) {
    n := &ListNode{Val: val}
    if l.Empty() {
        l.head = n; l.tail = n
    } else {
        n.Prev      = l.tail
        l.tail.Next = n
        l.tail      = n
    }
    l.currentSize++
}

func (l *DoublyLinkedList) Insert(position, val int) {
    if position <= 0              { l.Prepend(val); return }
    if position >= l.currentSize  { l.Append(val);  return }
    n := &ListNode{Val: val}
    current := l.head
    idx := 0
    for current != nil && idx < position {
        current = current.Next
        idx++
    }
    n.Prev            = current.Prev
    n.Next            = current
    current.Prev.Next = n
    current.Prev      = n
    l.currentSize++
}

func (l *DoublyLinkedList) Remove(val int) bool {
    if l.Empty() { return false }
    current := l.head
    for current != nil {
        if current.Val == val {
            if current == l.head {
                l.head = current.Next
                if l.head != nil { l.head.Prev = nil } else { l.tail = nil }
            } else if current == l.tail {
                l.tail      = current.Prev
                l.tail.Next = nil
            } else {
                current.Prev.Next = current.Next
                current.Next.Prev = current.Prev
            }
            l.currentSize--
            return true
        }
        current = current.Next
    }
    return false
}

func (l *DoublyLinkedList) Search(val int) bool {
    current := l.head
    for current != nil {
        if current.Val == val { return true }
        current = current.Next
    }
    return false
}
```

```kotlin,editable
class DoublyLinkedList {
    var head: ListNode? = null
    var tail: ListNode? = null
    var currentSize: Int = 0

    fun empty(): Boolean = head == null
    fun size():  Int     = currentSize

    fun prepend(v: Int) {
        val n = ListNode(v)
        if (empty()) { head = n; tail = n }
        else {
            n.next     = head
            head!!.prev = n
            head       = n
        }
        currentSize++
    }

    fun append(v: Int) {
        val n = ListNode(v)
        if (empty()) { head = n; tail = n }
        else {
            n.prev      = tail
            tail!!.next = n
            tail        = n
        }
        currentSize++
    }

    fun insert(position: Int, v: Int) {
        if (position <= 0)             { prepend(v); return }
        if (position >= currentSize)   { append(v);  return }
        val n = ListNode(v)
        var current = head
        var idx = 0
        while (current != null && idx < position) { current = current.next; idx++ }
        n.prev               = current!!.prev
        n.next               = current
        current.prev!!.next  = n
        current.prev         = n
        currentSize++
    }

    fun remove(v: Int): Boolean {
        if (empty()) return false
        var current = head
        while (current != null) {
            if (current.`val` == v) {
                when {
                    current === head -> {
                        head = current.next
                        if (head != null) head!!.prev = null
                        else              tail       = null
                    }
                    current === tail -> {
                        tail        = current.prev
                        tail!!.next = null
                    }
                    else -> {
                        current.prev!!.next = current.next
                        current.next!!.prev = current.prev
                    }
                }
                currentSize--
                return true
            }
            current = current.next
        }
        return false
    }

    fun search(v: Int): Boolean {
        var current = head
        while (current != null) {
            if (current.`val` == v) return true
            current = current.next
        }
        return false
    }
}
```

```rust,editable
// A safe, fully working bidirectional DLL in Rust uses Rc<RefCell<...>> for
// shared interior mutability. The skeleton below shows the canonical shape;
// it's longer than the other languages because Rust forces us to be explicit
// about every shared/mutable boundary.
//
// use std::cell::RefCell;
// use std::rc::{Rc, Weak};
//
// type Link  = Option<Rc<RefCell<Node>>>;     // strong reference (next)
// type WLink = Option<Weak<RefCell<Node>>>;   // weak reference   (prev — avoid cycles)
//
// struct Node { val: i32, next: Link, prev: WLink }
// pub struct DoublyLinkedList { head: Link, tail: Link, size: usize }
//
// impl DoublyLinkedList {
//     pub fn new() -> Self { Self { head: None, tail: None, size: 0 } }
//     pub fn empty(&self) -> bool { self.head.is_none() }
//     pub fn size(&self)  -> usize { self.size }
//     // prepend / append / insert / remove / search follow the same
//     // pointer-update template, with `borrow_mut()` calls wherever a
//     // node's prev/next is mutated.
// }
//
// In production code most teams reach for `std::collections::LinkedList`
// or a dedicated crate (e.g. `linked-hash-map`) rather than rolling their
// own — Rust's safety story is at its weakest precisely on cyclic
// structures, and this lesson's purpose is to teach the algorithm, not
// to fight the borrow checker.
```

</div>

<details>
<summary><strong>Trace — operations from the example input</strong></summary>

```
Op                            │ list state         │ size │ return
──────────────────────────────┼────────────────────┼──────┼────────
new DoublyLinkedList()        │ []                 │ 0    │ —
prepend(2)                    │ [2]                │ 1    │ —
prepend(3)                    │ [3, 2]             │ 2    │ —
append(1)                     │ [3, 2, 1]          │ 3    │ —
size()                        │ [3, 2, 1]          │ 3    │ 3
search(5)                     │ [3, 2, 1]          │ 3    │ false
insert(1, 8)                  │ [3, 8, 2, 1]       │ 4    │ —      (clamp not triggered, walk to idx 1, splice before)
remove(2)                     │ [3, 8, 1]          │ 3    │ true   (target is interior — middle case)
empty()                       │ [3, 8, 1]          │ 3    │ false
```

Notice how `insert(1, 8)` walks to the node currently at position 1 (the `2`), then splices the new `8` before it — exactly the "insert before the given node" primitive from lesson 03, with the target located by index instead of reference. And `remove(2)` follows the "delete by value" primitive from lesson 04, hitting the middle-node branch.

</details>

---

## Complexity Analysis

| Operation | Time | Space | Why |
|---|---|---|---|
| `empty()` | **O(1)** | **O(1)** | One null check on `head`. |
| `size()` | **O(1)** | **O(1)** | Maintained counter — no traversal needed. |
| `prepend(val)` | **O(1)** | **O(1)** | Three pointer updates plus one allocation. |
| `append(val)` | **O(1)** | **O(1)** | Three pointer updates plus one allocation. The `tail` reference is what keeps this constant — without it, append would require a full forward walk. |
| `insert(pos, val)` | **O(N)** worst, **O(1)** at endpoints | **O(1)** | Endpoint clamps short-circuit to `prepend`/`append`. Otherwise walk to position `pos` then splice — splice itself is O(1), the walk is O(pos). |
| `remove(val)` | **O(N)** | **O(1)** | Linear scan to find the value. The deletion itself is O(1) once the target is located, thanks to the `prev` pointer. |
| `search(val)` | **O(N)** | **O(1)** | Linear scan from head; returns on first match. |

> *The headline number above is **O(1) `append`**. In a singly linked list without a tail reference, `append` is O(N) — you have to walk to the end every single time. By spending 8 bytes (one pointer) on a `tail` reference, we make every append a constant-time operation. That trade is **the** reason `collections.deque`, every LRU cache, and every undo-stack implementation reach for a doubly linked list rather than a singly linked one.*

## Edge Cases

| Case | Example | Expected | Reasoning |
|---|---|---|---|
| `prepend` into empty list | `[].prepend(5)` | `[5]`, head == tail == new node | The empty branch wires head and tail together so a one-element list still satisfies the invariants. |
| `append` into empty list | `[].append(5)` | `[5]`, head == tail == new node | Same single-node invariant — both endpoint references must be set, not just one. |
| `insert(0, val)` on non-empty list | `[3,2].insert(0, 9)` | `[9,3,2]` | `position <= 0` clamp routes to `prepend` — no off-by-one in the walk loop. |
| `insert(size, val)` on non-empty list | `[3,2].insert(2, 9)` | `[3,2,9]` | `position >= currentSize` clamp routes to `append` — preventing a walk that would land on `null`. |
| `insert(-1, val)` | `[3,2].insert(-1, 9)` | `[9,3,2]` | Negative positions clamp left, never crash. |
| `remove` from single-node list | `[5].remove(5)` | `[]`, returns `true`, head == tail == null | The head branch sets `tail = null` when the list becomes empty — without that line, subsequent `append` calls would dereference a stale tail. |
| `remove` of head from multi-node list | `[3,2,1].remove(3)` | `[2,1]`, new head's prev == null | Critical: clearing the new head's `prev` is what keeps reverse traversal honest. |
| `remove` of tail from multi-node list | `[3,2,1].remove(1)` | `[3,2]`, new tail's next == null | Symmetric to the head case — clear the new tail's `next`. |
| `remove` of value not present | `[3,2,1].remove(7)` | `[3,2,1]`, returns `false` | Loop falls off, no mutation, size unchanged. |
| `search` in empty list | `[].search(5)` | `false` | Loop never enters; falls through to `false`. |

---

## Where This Class Lives in the Real World

The `DoublyLinkedList` you just built is the literal foundation of:

- **Python's `collections.deque`** — uses a DLL with block allocation for cache-friendliness, supports O(1) push/pop on both ends.
- **Java's `java.util.LinkedList`** — implements both `List` and `Deque` interfaces using a DLL identical in spirit to what's above.
- **LRU caches** — pair this DLL with a hash map: the map gives O(1) lookup, the DLL gives O(1) move-to-front and O(1) eviction. We'll build this in the next section. (Hash table → doubly linked list is one of the most-asked system design patterns in interviews.)
- **Browser history** — back/forward buttons walk a DLL of pages.
- **Editor undo/redo** — every keystroke pushes a node; redo walks `next`, undo walks `prev`.
- **Music/video players** — previous/next track on a playlist is `current.prev` / `current.next`.

Whenever you see "constant-time insertion and removal at known positions, with bidirectional iteration" in a system design question, the answer almost always starts with a doubly linked list.

---

## Final Takeaway

You started this section staring at empty stub files for nine lessons. Now you have a complete working implementation of the data structure — and more importantly, you understand *why each pointer is where it is*. Every method above is a recombination of three primitives: **walk, wire, unwire**. The discipline that ties them together is the same one we drilled in lessons 03 and 04 — **save before clobber, mirror every link, update size last**.

> **The Design Checklist** — every method that mutates a doubly linked list answers the same six questions:
>
> 1. **Empty-list case** — does my code handle `head == null`?
> 2. **Single-node case** — when the list shrinks to or grows from one node, are head AND tail both set/cleared?
> 3. **Boundary mutations** — when the head or tail itself moves, are both references updated?
> 4. **Mirror updates** — for every `a.next = b`, is there a matching `b.prev = a`?
> 5. **Size invariant** — does the counter increment/decrement exactly once per mutation?
> 6. **Return contract** — does the method return what its signature promises (the new head, a boolean, void)?
>
> Answer all six on paper before you compile, and the implementation will be right on the first try.

> **Transfer challenge:** Extend this `DoublyLinkedList` with a method `removeLast()` that removes and returns the value at the tail in **O(1)**. Then use the extended class to build an `LRUCache` (combining a `DoublyLinkedList` with a hash map): `get(key)` and `put(key, val)` both run in O(1), and when the cache exceeds its capacity, the least-recently-used entry — at the *tail* of the list — is evicted in O(1) using your new `removeLast()`.
>
> <details>
> <summary>Solution sketch</summary>
>
> `removeLast()` is a near-copy of `remove()` specialised to the tail: capture `tail.val`, set `tail = tail.prev`, set `tail.next = null` (or both head/tail to null if the list emptied), decrement size, return the captured value.
>
> For the LRU cache: keep a `HashMap<key, Node>` so `get` looks up the node in O(1). On `get`, splice the node out of the DLL and re-insert it at the head (the "most-recently-used" end). On `put`, if the key exists update + move-to-head, otherwise prepend a new node and (if size > capacity) call `removeLast()` and remove that key from the map. Both operations are O(1) because the hash map locates the node and the DLL's `prev` pointer makes splicing O(1).
>
> </details>

You now own the doubly linked list. The next section in your DSA journey is the **hash table** — and you've already met its most powerful sidekick. Whenever someone says "I need O(1) average lookup *and* ordered access," your answer is now reflexive: **DLL + hash map**. The two are stronger together than either is alone.
