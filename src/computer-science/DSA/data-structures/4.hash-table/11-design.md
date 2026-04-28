# 11. Design

## The Hook

Up until now, every problem in this section had a single hash table doing the work. But some problems demand more — they need the hash table to **collaborate** with another data structure, the way a quarterback collaborates with a receiver. Get the pairing right, and operations that look impossible — `O(1)` random retrieval *and* `O(1)` deletion in the same set, `O(1)` get *and* `O(1)` LRU-eviction in the same cache — become routine. Get the pairing wrong, and you trade O(1) for O(N) on every other call.

This lesson is two **boss-fight design problems** that interviewers love and production systems live by:

- **LRU Cache** — `get` and `put` in O(1), with automatic eviction of the least-recently-used entry when capacity is exceeded. Powers every page cache, browser cache, and CDN you've ever used.
- **RandomisedSet** — `insert`, `remove`, *and* `getRandom` in O(1). Powers fair shuffles, A/B test bucketers, and game-state samplers.

Both problems share the same trick: **a hash map gives you O(1) lookup; a second structure (linked list / array) gives you O(1) ordering or random-access.** Together they give you the impossible.

---

## Table of contents

1. [Design an LRU cache](#design-an-lru-cache)
2. [Design a RandomisedSet](#design-a-randomisedset)

***

# Design an LRU cache

## Problem Statement

Implement an LRU (Least-Recently-Used) cache:

> -   **`LRUCache(int capacity)`** — Initialise the cache with the given capacity.
> -   **`get(int key)`** — Return the value if the key exists, else `-1`. Accessing a key marks it as the most recently used.
> -   **`put(int key, int value)`** — Insert or update the mapping. If inserting causes the size to exceed `capacity`, evict the least recently used key.

```d2
cons: Constraints {
  c1: "No built-in LRU libraries"
  c2: "get and put must each run in amortised O(1)"
}
```

<p align="center"><strong>Constraints — both operations have to be amortised O(1). The naïve "scan a list for the LRU element" is O(N) per put and breaks the contract.</strong></p>

> **Example:**
>
> -   **Input:** `[LRUCache, put, put, get, put, get, get]`, `[[2], [1, 10], [2, 20], [1], [3, 30], [1], [2]]`
>
> -   **Output:** `[null, null, null, 10, null, 10, -1]`
>
> | Operation | Cache state (most-recent first) | Result |
> |---|---|---|
> | `LRUCache(2)` | `[]` | `null` |
> | `put(1, 10)` | `[(1,10)]` | `null` |
> | `put(2, 20)` | `[(2,20), (1,10)]` | `null` |
> | `get(1)` | `[(1,10), (2,20)]` (1 promoted to front) | `10` |
> | `put(3, 30)` | `[(3,30), (1,10)]` (2 evicted as LRU) | `null` |
> | `get(1)` | `[(1,10), (3,30)]` | `10` |
> | `get(2)` | unchanged (2 was evicted) | `-1` |

## Approach

The two requirements pull in opposite directions:
- **O(1) get/put by key** demands a **hash map**.
- **O(1) "find the least-recently-used element" + O(1) "promote an element to most-recently-used"** demands an **ordered** structure where insertion at the front and deletion of any node are both O(1).

The classic answer: **doubly-linked list + hash map**. The list stores the entries in MRU-to-LRU order: front of list = most recently used, back of list = least recently used. The hash map stores `key → pointer to that key's node`. Both structures hold the *same* nodes (the list owns them; the map references them).

```d2
direction: right

map: hash map {
  m1: "1 -> *"
  m2: "3 -> *"
}

list: "doubly-linked list (front = MRU, back = LRU)" {
  direction: right
  h: "[head]"
  n1: "(1, 10)"
  n3: "(3, 30)"
  t: "[tail]"
  h -> n1
  n1 -> n3
  n3 -> n1
  n3 -> t
}

map.m1 -> list.n1 {style.stroke-dash: 3}
map.m2 -> list.n3 {style.stroke-dash: 3}
```

<p align="center"><strong>The LRU cache as a hash-map-plus-doubly-linked-list — the map gives O(1) lookup of any key's node; the list keeps the recency order with O(1) splice. Both structures point to the <em>same</em> nodes.</strong></p>

The four operations needed:

1. **`get(key)`** — look up the node via the map; *splice it to the front* of the list; return its value.
2. **`put(key, value)` — key exists** — look up node; update value; splice to front.
3. **`put(key, value)` — key new, capacity OK** — create node; insert at front; add to map.
4. **`put(key, value)` — key new, capacity exceeded** — remove the *back* node from the list; remove its key from the map; then insert as in case 3.

Every step above is O(1). The doubly-linked list is essential — a singly-linked list would make "remove arbitrary node by reference" O(N) (you'd need the predecessor).

## Solution

<div class="lang-tabs">

```python,editable
class _Node:
    __slots__ = ('key', 'val', 'prev', 'next')
    def __init__(self, key, val):
        self.key, self.val, self.prev, self.next = key, val, None, None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.map = {}                            # key → node
        self.head = _Node(0, 0)                  # sentinel front
        self.tail = _Node(0, 0)                  # sentinel back
        self.head.next, self.tail.prev = self.tail, self.head

    def _remove(self, node):
        # Unlink node from the list (it must currently be in the list)
        node.prev.next, node.next.prev = node.next, node.prev

    def _add_front(self, node):
        # Insert node just after head (most-recently-used end)
        node.prev, node.next = self.head, self.head.next
        self.head.next.prev, self.head.next = node, node

    def get(self, key: int) -> int:
        if key not in self.map: return -1
        node = self.map[key]
        self._remove(node); self._add_front(node)   # promote to MRU
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.map:
            node = self.map[key]
            node.val = value
            self._remove(node); self._add_front(node)
            return
        if len(self.map) == self.capacity:
            lru = self.tail.prev          # least-recently-used = back of list
            self._remove(lru); del self.map[lru.key]
        node = _Node(key, value)
        self._add_front(node); self.map[key] = node

# Boss-fight demo
c = LRUCache(2)
c.put(1, 10); c.put(2, 20)
print(c.get(1))     # 10  (1 promoted)
c.put(3, 30)        # evicts 2
print(c.get(1))     # 10
print(c.get(2))     # -1
```

```java,editable
import java.util.*;

public class Main {
    static class Node {
        int key, val; Node prev, next;
        Node(int key, int val) { this.key = key; this.val = val; }
    }

    static class LRUCache {
        private final int                 capacity;
        private final Map<Integer, Node>  map = new HashMap<>();
        private final Node                head = new Node(0, 0);   // sentinels
        private final Node                tail = new Node(0, 0);

        LRUCache(int capacity) {
            this.capacity = capacity;
            head.next = tail; tail.prev = head;
        }
        private void remove(Node n) {
            n.prev.next = n.next; n.next.prev = n.prev;
        }
        private void addFront(Node n) {
            n.prev = head; n.next = head.next;
            head.next.prev = n; head.next = n;
        }

        int get(int key) {
            Node n = map.get(key);
            if (n == null) return -1;
            remove(n); addFront(n);
            return n.val;
        }
        void put(int key, int value) {
            Node n = map.get(key);
            if (n != null) { n.val = value; remove(n); addFront(n); return; }
            if (map.size() == capacity) {
                Node lru = tail.prev;
                remove(lru); map.remove(lru.key);
            }
            Node fresh = new Node(key, value);
            addFront(fresh); map.put(key, fresh);
        }
    }

    public static void main(String[] args) {
        LRUCache c = new LRUCache(2);
        c.put(1, 10); c.put(2, 20);
        System.out.println(c.get(1));   // 10
        c.put(3, 30);
        System.out.println(c.get(1));   // 10
        System.out.println(c.get(2));   // -1
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int key, val;
    struct Node *prev, *next;
} Node;

#define CAP 1024
typedef struct { int key; Node *node; int used; } Slot;

typedef struct {
    int capacity, size;
    Node head, tail;
    Slot map[CAP];
} LRUCache;

unsigned hash_int(int k) { return (unsigned)k * 2654435761u; }

LRUCache* lru_create(int capacity) {
    LRUCache *c = calloc(1, sizeof(LRUCache));
    c->capacity = capacity;
    c->head.next = &c->tail; c->tail.prev = &c->head;
    return c;
}
void lru_remove_list(Node *n) { n->prev->next = n->next; n->next->prev = n->prev; }
void lru_add_front(LRUCache *c, Node *n) {
    n->prev = &c->head; n->next = c->head.next;
    c->head.next->prev = n; c->head.next = n;
}
Node* map_get(LRUCache *c, int key) {
    unsigned i = hash_int(key) & (CAP - 1);
    while (c->map[i].used) {
        if (c->map[i].key == key) return c->map[i].node;
        i = (i + 1) & (CAP - 1);
    }
    return NULL;
}
void map_put(LRUCache *c, int key, Node *n) {
    unsigned i = hash_int(key) & (CAP - 1);
    while (c->map[i].used && c->map[i].key != key) i = (i + 1) & (CAP - 1);
    c->map[i].used = 1; c->map[i].key = key; c->map[i].node = n;
}
void map_del(LRUCache *c, int key) {
    unsigned i = hash_int(key) & (CAP - 1);
    while (c->map[i].used) {
        if (c->map[i].key == key) { c->map[i].used = 0; return; }
        i = (i + 1) & (CAP - 1);
    }
}

int lru_get(LRUCache *c, int key) {
    Node *n = map_get(c, key); if (!n) return -1;
    lru_remove_list(n); lru_add_front(c, n);
    return n->val;
}
void lru_put(LRUCache *c, int key, int val) {
    Node *n = map_get(c, key);
    if (n) { n->val = val; lru_remove_list(n); lru_add_front(c, n); return; }
    if (c->size == c->capacity) {
        Node *lru = c->tail.prev;
        lru_remove_list(lru); map_del(c, lru->key); free(lru); c->size--;
    }
    Node *fresh = malloc(sizeof(Node));
    fresh->key = key; fresh->val = val;
    lru_add_front(c, fresh); map_put(c, key, fresh); c->size++;
}

int main() {
    LRUCache *c = lru_create(2);
    lru_put(c, 1, 10); lru_put(c, 2, 20);
    printf("%d\n", lru_get(c, 1));   // 10
    lru_put(c, 3, 30);
    printf("%d\n", lru_get(c, 1));   // 10
    printf("%d\n", lru_get(c, 2));   // -1
}
```

```cpp,editable
#include <iostream>
#include <list>
#include <unordered_map>

class LRUCache {
    int                                                  capacity;
    std::list<std::pair<int, int>>                       lst;          // (key, val), front = MRU
    std::unordered_map<int, std::list<std::pair<int,int>>::iterator> map;
public:
    LRUCache(int cap) : capacity(cap) {}

    int get(int key) {
        auto it = map.find(key);
        if (it == map.end()) return -1;
        // splice the node to the front in O(1) — preserves the iterator!
        lst.splice(lst.begin(), lst, it->second);
        return it->second->second;
    }
    void put(int key, int value) {
        auto it = map.find(key);
        if (it != map.end()) {
            it->second->second = value;
            lst.splice(lst.begin(), lst, it->second);
            return;
        }
        if ((int)map.size() == capacity) {
            map.erase(lst.back().first);
            lst.pop_back();
        }
        lst.push_front({key, value});
        map[key] = lst.begin();
    }
};

int main() {
    LRUCache c(2);
    c.put(1, 10); c.put(2, 20);
    std::cout << c.get(1) << "\n";
    c.put(3, 30);
    std::cout << c.get(1) << " " << c.get(2) << "\n";
}
```

```scala,editable
import scala.collection.mutable

class LRUCache(capacity: Int) {
  // LinkedHashMap preserves insertion order; we re-insert on every access.
  private val map = mutable.LinkedHashMap[Int, Int]()

  def get(key: Int): Int = {
    map.remove(key) match {
      case Some(v) => map.put(key, v); v
      case None    => -1
    }
  }
  def put(key: Int, value: Int): Unit = {
    map.remove(key)             // re-insertion bumps recency
    if (map.size == capacity) map.remove(map.head._1)
    map.put(key, value)
  }
}

object Main extends App {
  val c = new LRUCache(2)
  c.put(1, 10); c.put(2, 20)
  println(c.get(1))   // 10
  c.put(3, 30)
  println(c.get(1))   // 10
  println(c.get(2))   // -1
}
```

```javascript,editable
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        // JS Map preserves insertion order — we use that for recency.
        this.map = new Map();
    }
    get(key) {
        if (!this.map.has(key)) return -1;
        const v = this.map.get(key);
        // Re-insert to bump recency to the most-recent end.
        this.map.delete(key); this.map.set(key, v);
        return v;
    }
    put(key, value) {
        if (this.map.has(key)) this.map.delete(key);
        else if (this.map.size === this.capacity)
            this.map.delete(this.map.keys().next().value);   // evict oldest
        this.map.set(key, value);
    }
}

const c = new LRUCache(2);
c.put(1, 10); c.put(2, 20);
console.log(c.get(1));   // 10
c.put(3, 30);
console.log(c.get(1));   // 10
console.log(c.get(2));   // -1
```

```typescript,editable
class LRUCache {
    private capacity: number;
    private map: Map<number, number> = new Map();
    constructor(capacity: number) { this.capacity = capacity; }

    get(key: number): number {
        if (!this.map.has(key)) return -1;
        const v = this.map.get(key)!;
        this.map.delete(key); this.map.set(key, v);
        return v;
    }
    put(key: number, value: number): void {
        if (this.map.has(key)) this.map.delete(key);
        else if (this.map.size === this.capacity)
            this.map.delete(this.map.keys().next().value);
        this.map.set(key, value);
    }
}

const c = new LRUCache(2);
c.put(1, 10); c.put(2, 20);
console.log(c.get(1));
c.put(3, 30);
console.log(c.get(1), c.get(2));
```

```go,editable
package main

import (
    "container/list"
    "fmt"
)

type entry struct{ key, val int }

type LRUCache struct {
    capacity int
    list     *list.List
    items    map[int]*list.Element
}

func NewLRU(capacity int) *LRUCache {
    return &LRUCache{capacity, list.New(), make(map[int]*list.Element)}
}
func (c *LRUCache) Get(key int) int {
    if e, ok := c.items[key]; ok {
        c.list.MoveToFront(e)         // bump recency
        return e.Value.(entry).val
    }
    return -1
}
func (c *LRUCache) Put(key, val int) {
    if e, ok := c.items[key]; ok {
        e.Value = entry{key, val}; c.list.MoveToFront(e); return
    }
    if c.list.Len() == c.capacity {
        oldest := c.list.Back()
        delete(c.items, oldest.Value.(entry).key); c.list.Remove(oldest)
    }
    e := c.list.PushFront(entry{key, val}); c.items[key] = e
}

func main() {
    c := NewLRU(2)
    c.Put(1, 10); c.Put(2, 20)
    fmt.Println(c.Get(1))    // 10
    c.Put(3, 30)
    fmt.Println(c.Get(1), c.Get(2))   // 10 -1
}
```

```kotlin,editable
class LRUCache(private val capacity: Int) {
    // accessOrder = true makes LinkedHashMap a near-LRU on its own.
    private val map = object : LinkedHashMap<Int, Int>(capacity, 0.75f, true) {
        override fun removeEldestEntry(eldest: MutableMap.MutableEntry<Int, Int>) =
            size > capacity
    }
    fun get(key: Int): Int = map[key] ?: -1
    fun put(key: Int, value: Int) { map[key] = value }
}

fun main() {
    val c = LRUCache(2)
    c.put(1, 10); c.put(2, 20)
    println(c.get(1))   // 10
    c.put(3, 30)
    println(c.get(1))   // 10
    println(c.get(2))   // -1
}
```

```rust,editable
use std::collections::HashMap;

// Lightweight doubly-linked list using indices into an arena.
struct Node { key: i32, val: i32, prev: usize, next: usize }
const NIL: usize = usize::MAX;

pub struct LRUCache {
    capacity: usize,
    nodes:    Vec<Node>,
    free:     Vec<usize>,
    head:     usize,    // index of MRU
    tail:     usize,    // index of LRU
    map:      HashMap<i32, usize>,
}

impl LRUCache {
    pub fn new(capacity: usize) -> Self {
        LRUCache { capacity, nodes: Vec::new(), free: Vec::new(),
                   head: NIL, tail: NIL, map: HashMap::new() }
    }
    fn unlink(&mut self, idx: usize) {
        let (p, n) = (self.nodes[idx].prev, self.nodes[idx].next);
        if p != NIL { self.nodes[p].next = n; } else { self.head = n; }
        if n != NIL { self.nodes[n].prev = p; } else { self.tail = p; }
    }
    fn push_front(&mut self, idx: usize) {
        self.nodes[idx].prev = NIL;
        self.nodes[idx].next = self.head;
        if self.head != NIL { self.nodes[self.head].prev = idx; }
        self.head = idx;
        if self.tail == NIL { self.tail = idx; }
    }
    fn alloc(&mut self, key: i32, val: i32) -> usize {
        let n = Node { key, val, prev: NIL, next: NIL };
        if let Some(i) = self.free.pop() { self.nodes[i] = n; i }
        else { self.nodes.push(n); self.nodes.len() - 1 }
    }

    pub fn get(&mut self, key: i32) -> i32 {
        if let Some(&idx) = self.map.get(&key) {
            self.unlink(idx); self.push_front(idx);
            return self.nodes[idx].val;
        }
        -1
    }
    pub fn put(&mut self, key: i32, value: i32) {
        if let Some(&idx) = self.map.get(&key) {
            self.nodes[idx].val = value;
            self.unlink(idx); self.push_front(idx);
            return;
        }
        if self.map.len() == self.capacity {
            let lru = self.tail; let k = self.nodes[lru].key;
            self.unlink(lru); self.map.remove(&k); self.free.push(lru);
        }
        let idx = self.alloc(key, value);
        self.push_front(idx); self.map.insert(key, idx);
    }
}

fn main() {
    let mut c = LRUCache::new(2);
    c.put(1, 10); c.put(2, 20);
    println!("{}", c.get(1));    // 10
    c.put(3, 30);
    println!("{}", c.get(1));    // 10
    println!("{}", c.get(2));    // -1
}
```

</div>

> **Why a *doubly* linked list (not singly)?**
>
> The crucial operation is `remove(node)` — given a reference to a node, splice it out of the list in O(1). With a singly linked list, you'd need the *predecessor* to fix its `next` pointer; that's another O(N) walk to find. The `prev` pointer makes both ends of the splice O(1), and that's the whole reason this design hits its O(1) targets.

***

# Design a RandomisedSet

## Problem Statement

Implement a set that supports `insert`, `remove`, and `getRandom` — **all in O(1)** amortised.

> -   **`RandomisedSet()`** — Initialise an empty set.
> -   **`insert(int val)`** — Insert if not present. Return `true` if added, `false` otherwise.
> -   **`remove(int val)`** — Remove if present. Return `true` if removed, `false` otherwise.
> -   **`getRandom()`** — Return a uniformly random element. The set is guaranteed non-empty when called.

> **Example:**
>
> -   **Input:** `[RandomisedSet, insert, insert, insert, remove, getRandom]`, `[[], [2], [4], [6], [2], []]`
>
> -   **Output:** `[null, true, true, true, true, 4 or 6]`

## Approach

Three operations all in O(1) — easy to do **two of three**, hard to do **three of three**:

- A hash set gives O(1) insert and remove (by value), but `getRandom` is **not** O(1) — there's no direct random index into a hash table.
- A dynamic array gives O(1) `getRandom` (just `arr[rand() % size]`), and O(1) append, but `remove(val)` is O(N) — we'd have to scan to find the value's index.

The composite trick: **dynamic array + hash map**, where the array stores the values and the map stores `value → index in the array`. Now:

- **`insert(val)`** — push to the end of the array; record `val → array.length − 1` in the map.
- **`getRandom()`** — return `array[random index]`. Trivially O(1).
- **`remove(val)`** — the clever one. Look up `val`'s index in the map. **Swap it with the last element of the array.** Pop the array. Update the map: the swapped element now has the popped element's old index. Delete `val` from the map.

That swap-with-last is what avoids the O(N) shift. The only constraint: ordering inside the array doesn't matter — perfect for a *set* (which is order-agnostic by definition).

```d2
direction: right

before: "before remove(2)" {
  a1: "arr: [2, 4, 6]"
  m1: "map: {2->0, 4->1, 6->2}"
}

swap: "swap arr[0] with arr[last]" {
  a2: "arr: [6, 4, 2]" {style.fill: "#fef9c3"; style.stroke: "#d97706"}
  m2: "map: {2->0, 4->1, 6->0}" {style.fill: "#fef9c3"; style.stroke: "#d97706"}
}

after: "pop array tail; delete 2 from map" {
  a3: "arr: [6, 4]" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
  m3: "map: {4->1, 6->0}" {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
}

before -> swap -> after
```

<p align="center"><strong>RandomisedSet remove — swap target with tail (O(1)), pop tail (O(1)), update the swapped element's index in the map (O(1)). The set's contents are correct; the order changed, but the set didn't care about order anyway.</strong></p>

## Solution

<div class="lang-tabs">

```python,editable
import random

class RandomisedSet:
    def __init__(self):
        self.values = []          # contiguous array of values
        self.index  = {}          # value → its index in `values`

    def insert(self, val: int) -> bool:
        if val in self.index: return False
        self.index[val] = len(self.values)
        self.values.append(val)
        return True

    def remove(self, val: int) -> bool:
        if val not in self.index: return False
        # Swap val's slot with the last element to avoid an O(N) shift.
        i = self.index[val]
        last = self.values[-1]
        self.values[i] = last; self.index[last] = i
        self.values.pop()
        del self.index[val]
        return True

    def getRandom(self) -> int:
        return self.values[random.randrange(len(self.values))]

# Boss-fight demo
s = RandomisedSet()
print(s.insert(2), s.insert(4), s.insert(6))   # True True True
print(s.remove(2))                              # True
print(s.getRandom() in (4, 6))                  # True
```

```java,editable
import java.util.*;

public class Main {
    static class RandomisedSet {
        private final List<Integer>          values = new ArrayList<>();
        private final Map<Integer, Integer>  index  = new HashMap<>();
        private final Random                 rnd    = new Random();

        boolean insert(int val) {
            if (index.containsKey(val)) return false;
            index.put(val, values.size()); values.add(val);
            return true;
        }
        boolean remove(int val) {
            Integer i = index.get(val);
            if (i == null) return false;
            int last = values.get(values.size() - 1);
            values.set(i, last); index.put(last, i);
            values.remove(values.size() - 1); index.remove(val);
            return true;
        }
        int getRandom() { return values.get(rnd.nextInt(values.size())); }
    }

    public static void main(String[] args) {
        RandomisedSet s = new RandomisedSet();
        System.out.println(s.insert(2));
        System.out.println(s.insert(4));
        System.out.println(s.insert(6));
        System.out.println(s.remove(2));
        int r = s.getRandom();
        System.out.println(r == 4 || r == 6);
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <time.h>

#define CAP 4096

typedef struct { int key, val_index; int used; } Slot;

typedef struct {
    int *values; int n_values, cap;
    Slot map[CAP];
} RandomisedSet;

unsigned hash_int(int k) { return (unsigned)k * 2654435761u; }

int map_find(RandomisedSet *s, int key) {
    unsigned i = hash_int(key) & (CAP - 1);
    while (s->map[i].used) {
        if (s->map[i].key == key) return (int)i;
        i = (i + 1) & (CAP - 1);
    }
    return -1;
}
void map_set(RandomisedSet *s, int key, int idx) {
    unsigned i = hash_int(key) & (CAP - 1);
    while (s->map[i].used && s->map[i].key != key) i = (i + 1) & (CAP - 1);
    s->map[i].used = 1; s->map[i].key = key; s->map[i].val_index = idx;
}
void map_del(RandomisedSet *s, int key) {
    unsigned i = hash_int(key) & (CAP - 1);
    while (s->map[i].used) {
        if (s->map[i].key == key) { s->map[i].used = 0; return; }
        i = (i + 1) & (CAP - 1);
    }
}

RandomisedSet* rs_new(void) {
    RandomisedSet *s = calloc(1, sizeof(*s));
    s->cap = 16; s->values = malloc(sizeof(int) * s->cap);
    return s;
}
bool rs_insert(RandomisedSet *s, int val) {
    if (map_find(s, val) != -1) return false;
    if (s->n_values == s->cap) { s->cap *= 2; s->values = realloc(s->values, sizeof(int) * s->cap); }
    map_set(s, val, s->n_values);
    s->values[s->n_values++] = val;
    return true;
}
bool rs_remove(RandomisedSet *s, int val) {
    int slot = map_find(s, val); if (slot == -1) return false;
    int i = s->map[slot].val_index;
    int last = s->values[s->n_values - 1];
    s->values[i] = last; map_set(s, last, i);
    s->n_values--; map_del(s, val);
    return true;
}
int rs_get_random(RandomisedSet *s) { return s->values[rand() % s->n_values]; }

int main() {
    srand((unsigned)time(NULL));
    RandomisedSet *s = rs_new();
    printf("%d %d %d\n", rs_insert(s, 2), rs_insert(s, 4), rs_insert(s, 6));
    printf("%d\n", rs_remove(s, 2));
    int r = rs_get_random(s);
    printf("%d (4 or 6)\n", r);
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <unordered_map>
#include <cstdlib>

class RandomisedSet {
    std::vector<int>             values;
    std::unordered_map<int, int> index;          // value → position in `values`
public:
    bool insert(int val) {
        if (index.count(val)) return false;
        index[val] = (int)values.size(); values.push_back(val);
        return true;
    }
    bool remove(int val) {
        auto it = index.find(val); if (it == index.end()) return false;
        int i = it->second; int last = values.back();
        values[i] = last; index[last] = i;
        values.pop_back(); index.erase(val);
        return true;
    }
    int getRandom() { return values[std::rand() % values.size()]; }
};

int main() {
    RandomisedSet s;
    std::cout << s.insert(2) << " " << s.insert(4) << " " << s.insert(6) << "\n";
    std::cout << s.remove(2) << "\n";
    int r = s.getRandom();
    std::cout << r << " (4 or 6)\n";
}
```

```scala,editable
import scala.collection.mutable
import scala.util.Random

class RandomisedSet {
  private val values = mutable.ArrayBuffer[Int]()
  private val index  = mutable.Map[Int, Int]()

  def insert(v: Int): Boolean = {
    if (index.contains(v)) false
    else { index(v) = values.length; values += v; true }
  }
  def remove(v: Int): Boolean = index.get(v) match {
    case None => false
    case Some(i) =>
      val last = values.last
      values(i) = last; index(last) = i
      values.trimEnd(1); index -= v
      true
  }
  def getRandom(): Int = values(Random.nextInt(values.length))
}

object Main extends App {
  val s = new RandomisedSet
  println(s.insert(2)); println(s.insert(4)); println(s.insert(6))
  println(s.remove(2))
  val r = s.getRandom()
  println(s"$r (4 or 6)")
}
```

```javascript,editable
class RandomisedSet {
    constructor() {
        this.values = [];
        this.index  = new Map();
    }
    insert(val) {
        if (this.index.has(val)) return false;
        this.index.set(val, this.values.length);
        this.values.push(val);
        return true;
    }
    remove(val) {
        if (!this.index.has(val)) return false;
        const i = this.index.get(val);
        const last = this.values[this.values.length - 1];
        this.values[i] = last; this.index.set(last, i);
        this.values.pop(); this.index.delete(val);
        return true;
    }
    getRandom() {
        return this.values[Math.floor(Math.random() * this.values.length)];
    }
}

const s = new RandomisedSet();
console.log(s.insert(2), s.insert(4), s.insert(6));
console.log(s.remove(2));
console.log(s.getRandom());
```

```typescript,editable
class RandomisedSet {
    private values: number[] = [];
    private index:  Map<number, number> = new Map();

    insert(val: number): boolean {
        if (this.index.has(val)) return false;
        this.index.set(val, this.values.length);
        this.values.push(val);
        return true;
    }
    remove(val: number): boolean {
        if (!this.index.has(val)) return false;
        const i = this.index.get(val)!;
        const last = this.values[this.values.length - 1];
        this.values[i] = last; this.index.set(last, i);
        this.values.pop(); this.index.delete(val);
        return true;
    }
    getRandom(): number {
        return this.values[Math.floor(Math.random() * this.values.length)];
    }
}

const s = new RandomisedSet();
console.log(s.insert(2), s.insert(4), s.insert(6));
console.log(s.remove(2));
console.log(s.getRandom());
```

```go,editable
package main

import (
    "fmt"
    "math/rand"
)

type RandomisedSet struct {
    values []int
    index  map[int]int
}

func NewRandomisedSet() *RandomisedSet {
    return &RandomisedSet{values: []int{}, index: map[int]int{}}
}
func (s *RandomisedSet) Insert(val int) bool {
    if _, ok := s.index[val]; ok { return false }
    s.index[val] = len(s.values); s.values = append(s.values, val)
    return true
}
func (s *RandomisedSet) Remove(val int) bool {
    i, ok := s.index[val]; if !ok { return false }
    last := s.values[len(s.values)-1]
    s.values[i] = last; s.index[last] = i
    s.values = s.values[:len(s.values)-1]
    delete(s.index, val)
    return true
}
func (s *RandomisedSet) GetRandom() int {
    return s.values[rand.Intn(len(s.values))]
}

func main() {
    s := NewRandomisedSet()
    fmt.Println(s.Insert(2), s.Insert(4), s.Insert(6))
    fmt.Println(s.Remove(2))
    fmt.Println(s.GetRandom())
}
```

```kotlin,editable
import kotlin.random.Random

class RandomisedSet {
    private val values = mutableListOf<Int>()
    private val index  = HashMap<Int, Int>()

    fun insert(v: Int): Boolean {
        if (v in index) return false
        index[v] = values.size; values.add(v); return true
    }
    fun remove(v: Int): Boolean {
        val i = index[v] ?: return false
        val last = values.last()
        values[i] = last; index[last] = i
        values.removeAt(values.size - 1); index.remove(v)
        return true
    }
    fun getRandom(): Int = values[Random.nextInt(values.size)]
}

fun main() {
    val s = RandomisedSet()
    println(s.insert(2)); println(s.insert(4)); println(s.insert(6))
    println(s.remove(2))
    val r = s.getRandom()
    println("$r (4 or 6)")
}
```

```rust,editable
use std::collections::HashMap;
use std::time::{SystemTime, UNIX_EPOCH};

pub struct RandomisedSet {
    values: Vec<i32>,
    index:  HashMap<i32, usize>,
    seed:   u64,
}

impl RandomisedSet {
    pub fn new() -> Self {
        let seed = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos() as u64;
        RandomisedSet { values: Vec::new(), index: HashMap::new(), seed }
    }
    pub fn insert(&mut self, val: i32) -> bool {
        if self.index.contains_key(&val) { return false; }
        self.index.insert(val, self.values.len());
        self.values.push(val);
        true
    }
    pub fn remove(&mut self, val: i32) -> bool {
        match self.index.remove(&val) {
            None => false,
            Some(i) => {
                let last = *self.values.last().unwrap();
                self.values[i] = last;
                if last != val { self.index.insert(last, i); }
                self.values.pop();
                true
            }
        }
    }
    pub fn get_random(&mut self) -> i32 {
        // xorshift PRNG — adequate for non-cryptographic randomness
        self.seed ^= self.seed << 13;
        self.seed ^= self.seed >> 7;
        self.seed ^= self.seed << 17;
        self.values[(self.seed as usize) % self.values.len()]
    }
}

fn main() {
    let mut s = RandomisedSet::new();
    println!("{} {} {}", s.insert(2), s.insert(4), s.insert(6));
    println!("{}", s.remove(2));
    println!("{}", s.get_random());
}
```

</div>

> **Why does the swap-with-last trick work?**
>
> The set's contract is *unordered* — `{2, 4, 6}` and `{6, 4}` are equivalent, regardless of internal layout. So when we remove `2`, we don't actually need to preserve `[2, 4, 6] → [4, 6]`. We can rearrange to `[6, 4]` (swap-with-last) and still have a valid representation of the set `{4, 6}`. The hash map's `index` field is the secret that makes this safe — we only have to update *one* entry (the swapped value's new position), not shift N entries.
>
> If the set were *ordered*, this trick would fail and we'd be back to O(N). The unordered nature of a set is precisely what enables O(1) deletion here.

***

## Final Takeaway

You've now seen the full hash-table toolkit assembled, and the design lesson tied it off with two architectural patterns that recur in production code everywhere:

1. **Hash map + doubly-linked list** — for problems that need O(1) lookup *and* an O(1) recency / priority order. Caches, schedulers, deque-with-fast-key-access. The map points to nodes; the list owns them.
2. **Hash map + dynamic array** — for problems that need O(1) lookup *and* O(1) random access by position. The array stores values; the map stores indices. Swap-with-last gives O(1) deletion as long as order doesn't matter.

The deeper lesson is **composability**. A hash table on its own gives O(1) for *one* dimension of access (by key). To get O(1) on *another* dimension (recency, position, frequency, age), pair it with a structure that's specialised for that dimension and have the two collaborate via shared node references or shared indices.

Once you see this composition pattern, it shows up everywhere: LinkedHashMap, OrderedDict, LFU caches, expiring caches, priority queues with `decrease-key`, indexed priority queues, in-memory write-ahead logs, every implementation of database `INDEX` you'll ever read source for.

> **The complete arc** — eleven lessons, one section, one data structure:
>
> | Lesson | What you got | Why it mattered |
> |---|---|---|
> | 1 — Introduction | Hash function, internal array, collisions | Foundation |
> | 2 — Separate chaining | One family of collision resolution | Easy + memory-flexible |
> | 3 — Linear probing | Cache-friendly probing | Cache locality matters |
> | 4 — Quadratic probing | Cluster-shattering probing | Cures primary clustering |
> | 5 — Double hashing | Per-key probe rhythm | Cures secondary clustering |
> | 6 — Counting | Multiset summary in one pass | The starter pattern |
> | 7 — Key generation | Canonical-form grouping | Equivalence classes for free |
> | 8 — Fixed sliding window | Moving multiset summary | O(N·K) → O(N) |
> | 9 — Variable sliding window | Flex-the-window trick | Longest/shortest with property |
> | 10 — Prefix sum | Subarray-sum-as-difference | Negatives, exact targets |
> | 11 — Design | Composing hash with list/array | Production data structures |
>
> You came in knowing a hash map was a `dict`. You leave knowing it's the universal adapter that turns "search again and again" into "calculate where, look once". Carry the toolkit. The interview problems and the systems code will both come for it.
