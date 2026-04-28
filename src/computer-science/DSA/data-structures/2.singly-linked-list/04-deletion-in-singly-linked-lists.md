# 4. Deletion in Singly Linked Lists

## The Hook

Deletion is the mirror image of insertion — and it has the same twist. An array's `del arr[0]` silently shifts every remaining element one slot left: 999,999 memory writes to remove a single byte. On a linked list, the same operation is **one pointer update**. The list gets shorter by snipping a single link; the rest of the chain stays exactly where it is in memory.

But singly-linked deletion has a cruel subtlety: to snip a link, you need the node **before** the victim — its `.next` is what you'll redirect. And a singly linked node cannot look backward. So for every "delete X" problem, the question collapses to: **how fast can we find the predecessor?** Head deletion? Instant — there is no predecessor, we just advance `head`. Middle deletion? Walk until `cur.next == victim`. Tail deletion? Walk the entire list. Every variant in this lesson is a different answer to the same predecessor-hunt question.

Seven variations follow. They all reduce to a two-line splice: **`prev.next = victim.next; free(victim)`**. Master the splice once, and every deletion problem you see — interview, production, embedded — solves itself.

---

## Table of contents

1. [Understanding deletion of first node](#understanding-deletion-of-first-node)
2. [Delete first node](#delete-first-node)
3. [Understanding deletion of last node](#understanding-deletion-of-last-node)
4. [Delete last node](#delete-last-node)
5. [Understanding deletion by given data](#understanding-deletion-by-given-data)
6. [Delete node with given data](#delete-node-with-given-data)
7. [Delete nodes with given data](#delete-nodes-with-given-data)
8. [Understanding deletion after a given node](#understanding-deletion-after-a-given-node)
9. [Delete node after the given node](#delete-node-after-the-given-node)
10. [Understanding deletion before a given node](#understanding-deletion-before-a-given-node)
11. [Delete node before the given node](#delete-node-before-the-given-node)
12. [Understanding deletion of the given node](#understanding-deletion-of-the-given-node)
13. [Delete the given node](#delete-the-given-node)
14. [Understanding deletion at a given distance](#understanding-deletion-at-a-given-distance)
15. [Delete node at given distance](#delete-node-at-given-distance)

***

# Understanding deletion of first node

Similar to insertion, deletion is one of the most common operations in a linked list. Deleting the first node of a singly linked list is similar to **inserting a node at the beginning**. We need to consider two cases.

## 1\. The list is empty

When the list is empty, any attempt to delete a node is unnecessary because there are no nodes in the list. The list remains unchanged. We return the existing **head** — which is already `null`.

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 2\. The list is not empty

Update **head** to hold the reference of the next node (the second node), effectively unlinking the first node. In GC languages (Java, Python, JS), the old head is automatically collected. In C/C++, we explicitly free/delete it.

```d2
direction: right

before: "Before — list = [5, 7, 3, 10]" {
  direction: right
  h: head {shape: oval}
  n1: {
    value: 5
    next
    style.fill: "#fde68a"
    style.stroke: "#d97706"
  }
  n2: {
    value: 7
    next
  }
  n3: {
    value: 3
    next
  }
  n4: {
    value: 10
    next: "null"
  }
  h -> n1.value
  n1.next -> n2.value
  n2.next -> n3.value
  n3.next -> n4.value
}

after: "After — head advanced to second node" {
  direction: right
  h: head {shape: oval}
  n2: {
    value: 7
    next
  }
  n3: {
    value: 3
    next
  }
  n4: {
    value: 10
    next: "null"
  }
  h -> n2.value
  n2.next -> n3.value
  n3.next -> n4.value
}

before -> after: "head = head.next; free old head"
```

<p align="center"><strong>Case 2 — non-empty list: advance head to the second node; the first node is unlinked and freed.</strong></p>

> **Algorithm**
>
> -   **Step 1:** Store the current head in a temporary pointer.
> -   **Step 2:** Move the head pointer to the next node.
> -   **Step 3:** Free/delete the old head node.
> -   **Step 4:** Return the new head node.

**What if there is only one node?** No special logic needed. The single node's `next` is `null`, so after `head = head.next`, head becomes `null` — correctly representing an empty list.

## Implementation

<div class="lang-tabs">

```python,editable
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val; self.next = next

class Solution:
    def delete_first_node(self, head):
        if head is None:
            return None       # Empty list — nothing to delete
        return head.next      # Advance head; GC reclaims the old head node

n4=ListNode(10); n3=ListNode(3,n4); n2=ListNode(7,n3); n1=ListNode(5,n2)
head = Solution().delete_first_node(n1)
vals=[]; cur=head
while cur: vals.append(cur.val); cur=cur.next
print(vals)  # [7, 3, 10]
```

```java,editable
public class Main {
    static class ListNode { int val; ListNode next; ListNode(int v){val=v;} }

    static ListNode deleteFirstNode(ListNode head) {
        if (head == null) return null;  // Empty list — nothing to delete
        return head.next;  // Advance head; GC reclaims the old head node
    }

    public static void main(String[] args) {
        ListNode n1=new ListNode(5),n2=new ListNode(7),
                 n3=new ListNode(3),n4=new ListNode(10);
        n1.next=n2; n2.next=n3; n3.next=n4;
        ListNode head = deleteFirstNode(n1);
        for (ListNode c=head;c!=null;c=c.next) System.out.print(c.val+" ");
        // 7 3 10
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>

typedef struct ListNode { int val; struct ListNode *next; } ListNode;
ListNode* newNode(int v){ ListNode*n=malloc(sizeof*n); n->val=v; n->next=NULL; return n; }

ListNode* deleteFirstNode(ListNode *head) {
    if (!head) return NULL;       /* Empty list — nothing to delete */
    ListNode *old = head;
    head = head->next;            /* Advance head to second node */
    free(old);                    /* Free the unlinked node to avoid memory leak */
    return head;
}

int main() {
    ListNode *n1=newNode(5),*n2=newNode(7),*n3=newNode(3),*n4=newNode(10);
    n1->next=n2; n2->next=n3; n3->next=n4;
    ListNode *head = deleteFirstNode(n1);
    for (ListNode *c=head;c;c=c->next) printf("%d ",c->val);  /* 7 3 10 */
    return 0;
}
```

```cpp,editable
#include <iostream>
using namespace std;

struct ListNode { int val; ListNode *next; ListNode(int v):val(v),next(nullptr){} };

class Solution {
public:
    ListNode *deleteFirstNode(ListNode *head) {
        if (head == nullptr) return nullptr;  // Empty list — nothing to delete
        ListNode *old = head;
        head = head->next;   // Advance head to second node
        delete old;          // Free the unlinked node to avoid memory leak
        return head;
    }
};

int main() {
    auto *n1=new ListNode(5),*n2=new ListNode(7),
         *n3=new ListNode(3),*n4=new ListNode(10);
    n1->next=n2; n2->next=n3; n3->next=n4;
    auto *head = Solution().deleteFirstNode(n1);
    for (auto *c=head;c;c=c->next) cout<<c->val<<" ";  // 7 3 10
}
```

```scala,editable
class ListNode(var v: Int, var next: ListNode = null)

object Main extends App {
  def deleteFirstNode(head: ListNode): ListNode = {
    if (head == null) return null  // Empty list — nothing to delete
    head.next                      // Advance head; GC reclaims the old node
  }

  val n4=new ListNode(10); val n3=new ListNode(3,n4)
  val n2=new ListNode(7,n3); val n1=new ListNode(5,n2)
  var head = deleteFirstNode(n1)
  while (head!=null) { print(s"${head.v} "); head=head.next }  // 7 3 10
}
```

```javascript,editable
class ListNode { constructor(val,next=null){this.val=val;this.next=next;} }

function deleteFirstNode(head) {
    if (!head) return null;  // Empty list — nothing to delete
    return head.next;        // Advance head; GC reclaims the old node
}

const n4=new ListNode(10),n3=new ListNode(3,n4),
      n2=new ListNode(7,n3),n1=new ListNode(5,n2);
let head = deleteFirstNode(n1);
const vals=[]; for(let c=head;c;c=c.next) vals.push(c.val);
console.log(vals);  // [7, 3, 10]
```

```typescript,editable
class ListNode { constructor(public val:number, public next:ListNode|null=null){} }

function deleteFirstNode(head: ListNode|null): ListNode|null {
    if (!head) return null;  // Empty list — nothing to delete
    return head.next;        // Advance head; GC reclaims the old node
}

const n4=new ListNode(10),n3=new ListNode(3,n4),
      n2=new ListNode(7,n3),n1=new ListNode(5,n2);
let head: ListNode|null = deleteFirstNode(n1);
const vals:number[]=[]; for(let c=head;c;c=c.next) vals.push(c.val);
console.log(vals);  // [7, 3, 10]
```

```go,editable
package main

import "fmt"

type ListNode struct { Val int; Next *ListNode }

func deleteFirstNode(head *ListNode) *ListNode {
    if head == nil { return nil }  // Empty list — nothing to delete
    return head.Next               // Advance head; GC reclaims the old node
}

func main() {
    n4:=&ListNode{Val:10}; n3:=&ListNode{Val:3,Next:n4}
    n2:=&ListNode{Val:7,Next:n3}; n1:=&ListNode{Val:5,Next:n2}
    head := deleteFirstNode(n1)
    for c:=head;c!=nil;c=c.Next { fmt.Print(c.Val," ") }  // 7 3 10
}
```

```kotlin,editable
class ListNode(var `val`: Int, var next: ListNode? = null)

fun deleteFirstNode(head: ListNode?): ListNode? {
    if (head == null) return null  // Empty list — nothing to delete
    return head.next               // Advance head; GC reclaims the old node
}

fun main() {
    val n4=ListNode(10); val n3=ListNode(3,n4)
    val n2=ListNode(7,n3); val n1=ListNode(5,n2)
    var head: ListNode? = deleteFirstNode(n1)
    while (head!=null) { print("${head.`val`} "); head=head.next }  // 7 3 10
}
```

```rust,editable
#[derive(Debug)]
struct ListNode { val: i32, next: Option<Box<ListNode>> }

fn delete_first_node(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    match head {
        None => None,          // Empty list — nothing to delete
        Some(h) => h.next,     // Return the tail; Box drop frees the old head node
    }
}

fn main() {
    let list = Some(Box::new(ListNode { val: 5, next:
        Some(Box::new(ListNode { val: 7, next:
        Some(Box::new(ListNode { val: 3, next:
        Some(Box::new(ListNode { val: 10, next: None }))}))}))}));
    let head = delete_first_node(list);
    let mut cur = &head;
    while let Some(n) = cur { print!("{} ", n.val); cur = &n.next; }  // 7 3 10
}
```

</div>

## Complexity Analysis

In any case, we only change the head pointer and free one node — no traversal required.

> **Best Case / Worst Case**
>
> -   Space Complexity — **O(1)**
> -   Time Complexity — **O(1)**

***

# Delete first node

## Problem Statement

Given the **head** of a singly linked list, write a function to delete the first node from this list and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\]
> -   **Output:** \[7, 3, 10\]

## Solution

<div class="lang-tabs">

```python,editable
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def delete_first_node(head):
    # If the list is empty, nothing to delete
    if head is None:
        return None

    # Move head forward — the old head becomes unreachable and gets GC'd
    head = head.next
    return head

# --- driver ---
def build(vals):
    dummy = ListNode(0)
    cur = dummy
    for v in vals:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

head = build([5, 7, 3, 10])
head = delete_first_node(head)
print(to_list(head))  # [7, 3, 10]
```

```java,editable
public class Main {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int v) { val = v; }
        ListNode(int v, ListNode n) { val = v; next = n; }
    }

    static ListNode deleteFirstNode(ListNode head) {
        // If the list is empty, nothing to delete
        if (head == null) return null;

        // Advance head — the old head becomes eligible for GC
        head = head.next;
        return head;
    }

    static ListNode build(int[] vals) {
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;
        for (int v : vals) { cur.next = new ListNode(v); cur = cur.next; }
        return dummy.next;
    }

    static String toStr(ListNode head) {
        StringBuilder sb = new StringBuilder("[");
        while (head != null) {
            sb.append(head.val);
            if (head.next != null) sb.append(", ");
            head = head.next;
        }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        ListNode head = build(new int[]{5, 7, 3, 10});
        head = deleteFirstNode(head);
        System.out.println(toStr(head)); // [7, 3, 10]
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>

typedef struct ListNode {
    int val;
    struct ListNode *next;
} ListNode;

ListNode* newNode(int v) {
    ListNode *n = malloc(sizeof(ListNode));
    n->val = v;
    n->next = NULL;
    return n;
}

ListNode* deleteFirstNode(ListNode *head) {
    // If the list is empty, nothing to delete
    if (head == NULL) return NULL;

    ListNode *nodeToBeDeleted = head;
    // Advance head before freeing, so we don't read freed memory
    head = head->next;
    free(nodeToBeDeleted);
    return head;
}

ListNode* build(int *vals, int n) {
    ListNode dummy = {0, NULL};
    ListNode *cur = &dummy;
    for (int i = 0; i < n; i++) { cur->next = newNode(vals[i]); cur = cur->next; }
    return dummy.next;
}

void printList(ListNode *head) {
    printf("[");
    while (head) { printf("%d", head->val); if (head->next) printf(", "); head = head->next; }
    printf("]\n");
}

int main() {
    int vals[] = {5, 7, 3, 10};
    ListNode *head = build(vals, 4);
    head = deleteFirstNode(head);
    printList(head); // [7, 3, 10]
    return 0;
}
```

```cpp,editable
#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int v) : val(v), next(nullptr) {}
};

ListNode* deleteFirstNode(ListNode *head) {
    // If the list is empty, nothing to delete
    if (head == nullptr) return nullptr;

    ListNode *nodeToBeDeleted = head;
    // Advance head before deleting so we don't dereference freed memory
    head = head->next;
    delete nodeToBeDeleted;
    return head;
}

ListNode* build(initializer_list<int> vals) {
    ListNode dummy(0); ListNode *cur = &dummy;
    for (int v : vals) { cur->next = new ListNode(v); cur = cur->next; }
    return dummy.next;
}

void printList(ListNode *head) {
    cout << "[";
    while (head) { cout << head->val; if (head->next) cout << ", "; head = head->next; }
    cout << "]\n";
}

int main() {
    ListNode *head = build({5, 7, 3, 10});
    head = deleteFirstNode(head);
    printList(head); // [7, 3, 10]
    return 0;
}
```

```scala,editable
class ListNode(var v: Int, var next: ListNode = null)

object Main extends App {
  def deleteFirstNode(head: ListNode): ListNode = {
    // If the list is empty, nothing to delete
    if (head == null) return null
    // Advance head — the old head becomes unreachable and gets GC'd
    head.next
  }

  def build(vals: Int*): ListNode = {
    val dummy = new ListNode(0)
    var cur = dummy
    for (v <- vals) { cur.next = new ListNode(v); cur = cur.next }
    dummy.next
  }

  def toStr(head: ListNode): String = {
    val sb = new StringBuilder("[")
    var cur = head
    while (cur != null) {
      sb.append(cur.v)
      if (cur.next != null) sb.append(", ")
      cur = cur.next
    }
    sb.append("]").toString
  }

  val head = deleteFirstNode(build(5, 7, 3, 10))
  println(toStr(head)) // [7, 3, 10]
}
```

```javascript,editable
class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}

function deleteFirstNode(head) {
  // If the list is empty, nothing to delete
  if (head === null) return null;
  // Advance head — old head is GC'd automatically
  return head.next;
}

function build(vals) {
  const dummy = new ListNode(0);
  let cur = dummy;
  for (const v of vals) { cur.next = new ListNode(v); cur = cur.next; }
  return dummy.next;
}

function toArr(head) {
  const res = [];
  while (head) { res.push(head.val); head = head.next; }
  return res;
}

let head = build([5, 7, 3, 10]);
head = deleteFirstNode(head);
console.log(toArr(head)); // [7, 3, 10]
```

```typescript,editable
class ListNode {
  constructor(public val: number, public next: ListNode | null = null) {}
}

function deleteFirstNode(head: ListNode | null): ListNode | null {
  // If the list is empty, nothing to delete
  if (head === null) return null;
  // Advance head — old head is GC'd automatically
  return head.next;
}

function build(vals: number[]): ListNode | null {
  const dummy = new ListNode(0);
  let cur: ListNode = dummy;
  for (const v of vals) { cur.next = new ListNode(v); cur = cur.next; }
  return dummy.next;
}

function toArr(head: ListNode | null): number[] {
  const res: number[] = [];
  while (head) { res.push(head.val); head = head.next; }
  return res;
}

let head = build([5, 7, 3, 10]);
head = deleteFirstNode(head);
console.log(toArr(head)); // [7, 3, 10]
```

```go,editable
package main

import "fmt"

type ListNode struct {
	Val  int
	Next *ListNode
}

func deleteFirstNode(head *ListNode) *ListNode {
	// If the list is empty, nothing to delete
	if head == nil {
		return nil
	}
	// Advance head — Go's GC reclaims the old head automatically
	return head.Next
}

func build(vals []int) *ListNode {
	dummy := &ListNode{}
	cur := dummy
	for _, v := range vals {
		cur.Next = &ListNode{Val: v}
		cur = cur.Next
	}
	return dummy.Next
}

func toSlice(head *ListNode) []int {
	var res []int
	for head != nil {
		res = append(res, head.Val)
		head = head.Next
	}
	return res
}

func main() {
	head := build([]int{5, 7, 3, 10})
	head = deleteFirstNode(head)
	fmt.Println(toSlice(head)) // [7 3 10]
}
```

```kotlin,editable
class ListNode(var `val`: Int, var next: ListNode? = null)

fun deleteFirstNode(head: ListNode?): ListNode? {
    // If the list is empty, nothing to delete
    if (head == null) return null
    // Advance head — old head is GC'd automatically
    return head.next
}

fun build(vararg vals: Int): ListNode? {
    val dummy = ListNode(0)
    var cur = dummy
    for (v in vals) { cur.next = ListNode(v); cur = cur.next!! }
    return dummy.next
}

fun toList(head: ListNode?): List<Int> {
    val res = mutableListOf<Int>()
    var cur = head
    while (cur != null) { res.add(cur.`val`); cur = cur.next }
    return res
}

fun main() {
    val head = deleteFirstNode(build(5, 7, 3, 10))
    println(toList(head)) // [7, 3, 10]
}
```

```rust,editable
#[derive(Debug)]
struct ListNode {
    val: i32,
    next: Option<Box<ListNode>>,
}

impl ListNode {
    fn new(val: i32) -> Self {
        ListNode { val, next: None }
    }
}

fn delete_first_node(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    // If the list is empty, nothing to delete
    match head {
        None => None,
        // Return the rest of the list — the head Box is dropped automatically
        Some(node) => node.next,
    }
}

fn build(vals: &[i32]) -> Option<Box<ListNode>> {
    let mut head = None;
    for &v in vals.iter().rev() {
        let mut node = Box::new(ListNode::new(v));
        node.next = head;
        head = Some(node);
    }
    head
}

fn to_vec(mut head: &Option<Box<ListNode>>) -> Vec<i32> {
    let mut res = vec![];
    while let Some(node) = head { res.push(node.val); head = &node.next; }
    res
}

fn main() {
    let head = build(&[5, 7, 3, 10]);
    let head = delete_first_node(head);
    println!("{:?}", to_vec(&head)); // [7, 3, 10]
}
```

</div>

***

# Understanding deletion of last node

We must access the second last node to delete the last node from a linked list. Then, we can update the pointer of this second last node to `null` and delete the last node. This process involves traversing the linked list and keeping track of the previous node (similar to inserting a node at the end). Let's go through the specific cases we need to consider.

## 1\. The list is empty

When the list is empty, meaning it contains no elements, any attempt to delete a node is unnecessary because there are no nodes in the list. Since there is nothing to remove, the list remains unchanged. We can return the existing **head**, as the list is empty, and no node needs to be deleted.

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 2\. The list has only one node

Deleting the last node is the same as deleting the first node when only one node is in the list. We follow the same steps in both cases, such as deleting the first/last node. This involves deleting the head node and returning null.

> **Algorithm**
>
> -   **Step 1:** Delete the head node to free up memory.
> -   **Step 2:** Return `null` as the list is now empty.

## 3\. The list has more than one node

In this scenario, we need to update the pointer of the second last node in the list to hold `null` and then delete the last node. We need access to the list's last and second last nodes to accomplish this. We will traverse the list from the beginning while keeping track of the **current** and  nodes. This way, when we reach the last node, we will have access to the second last node. Thereafter, we can update the pointer of the second last node to `null`, or more intuitively, to the next of the last node, which should already be `null`, and then delete the last node.

```d2
direction: right

before: "Before — walk with current + previous" {
  direction: right
  h: head {shape: oval}
  n1: {
    value: 5
    next
  }
  n2: {
    value: 7
    next
  }
  n3: {
    value: 3
    next
  }
  n4: {
    value: 10
    next: "null"
    style.fill: "#fde68a"
    style.stroke: "#d97706"
  }
  prev: previous {shape: oval; style.stroke-dash: 3}
  cur: current {shape: oval; style.stroke-dash: 3}
  h -> n1.value
  n1.next -> n2.value
  n2.next -> n3.value
  n3.next -> n4.value
  prev -> n3.value: "" {style.stroke-dash: 3}
  cur -> n4.value: "" {style.stroke-dash: 3}
}

after: "After — previous.next = null; free current" {
  direction: right
  h: head {shape: oval}
  n1: {
    value: 5
    next
  }
  n2: {
    value: 7
    next
  }
  n3: {
    value: 3
    next: "null"
    style.fill: "#dcfce7"
    style.stroke: "#16a34a"
  }
  h -> n1.value
  n1.next -> n2.value
  n2.next -> n3.value
}

before -> after: "unlink tail"
```

<p align="center"><strong>To delete the tail we keep two pointers, <code>previous</code> and <code>current</code>, so when <code>current</code> reaches the tail, <code>previous</code> is one step behind — ready to have its <code>next</code> set to <code>null</code>.</strong></p>

> **Algorithm**
>
> -   **Step 1:** Traverse the list while keeping track of the `current` and `previous` nodes until reaching the last node.
> -   **Step 2:** Set the `next` pointer of the `previous` node to `null`.
> -   **Step 3:** Delete the last node to free up memory.
> -   **Step 4:** Return the original head node.

## Implementation

When implementing the logic for deleting the last node operation, we consider all the possible cases and subcases and write the code for each in conditional blocks.

C++

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    ListNode *deleteLastNode(ListNode *head) {

        // If the list is empty, there's nothing to delete
        if (head == nullptr) {
            return nullptr;
        }

        // If there's only one node in the list, delete it and return
        // nullptr
        if (head->next == nullptr) {
            delete head;
            return nullptr;
        }

        // current node being iterated
        ListNode *current = head;

        // previous node
        ListNode *previous = nullptr;

        // Traverse the list until the last node is reached
        while (current != nullptr && current->next != nullptr) {

            // Move the previous pointer to the current node
            previous = current;

            // Move the current pointer to the next node
            current = current->next;
        }

        // At this point, current is pointing to the last node and
        // previous is pointing to the second-to-last node Update the
        // next pointer of the second-to-last node to skip the last node
        previous->next = current->next;

        // Delete the last node
        delete current;

        // Return the updated head of the list
        return head;
    }
};
```

Java

```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

class Solution {
    public ListNode deleteLastNode(ListNode head) {

        // If the list is empty, there's nothing to delete
        if (head == null) {
            return null;
        }

        // If there's only one node in the list, delete it and return
        // nullptr
        if (head.next == null) {
            head = null;
            return null;
        }

        // current node being iterated
        ListNode current = head;

        // previous node
        ListNode previous = null;

        // Traverse the list until the last node is reached
        while (current != null && current.next != null) {

            // Move the previous pointer to the current node
            previous = current;

            // Move the current pointer to the next node
            current = current.next;
        }

        // At this point, current is pointing to the last node and
        // previous is pointing to the second-to-last node Update the
        // next pointer of the second-to-last node to skip the last node
        previous.next = current.next;

        // Delete the last node
        current = null;

        // Return the updated head of the list
        return head;
    }
```

Typescript

```typescript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

export class Solution {
    deleteLastNode(head: ListNode | null): ListNode | null {

        // If the list is empty, there's nothing to delete
        if (head == null) {
            return null;
        }

        // If there's only one node in the list, delete it and return
        // nullptr
        if (head.next == null) {
            head = null;
            return null;
        }

        // current node being iterated
        let current: ListNode | null = head;

        // previous node
        let previous: ListNode | null = null;

        // Traverse the list until the last node is reached
        while (current !== null && current.next !== null) {

            // Move the previous pointer to the current node
            previous = current;

            // Move the current pointer to the next node
            current = current.next;
        }

        // At this point, current is pointing to the last node and
        // previous is pointing to the second-to-last node Update the
        // next pointer of the second-to-last node to skip the last node
        previous.next = current?.next || null;

        // Delete the last node
        current = null;

        // Return the updated head of the list
        return head;
    }
```

Javascript

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

export class Solution {
    deleteLastNode(head) {

        // If the list is empty, there's nothing to delete
        if (head == null) {
            return null;
        }

        // If there's only one node in the list, delete it and return
        // nullptr
        if (head.next == null) {
            head = null;
            return null;
        }

        // current node being iterated
        let current = head;

        // previous node
        let previous = null;

        // Traverse the list until the last node is reached
        while (current !== null && current.next !== null) {

            // Move the previous pointer to the current node
            previous = current;

            // Move the current pointer to the next node
            current = current.next;
        }

        // At this point, current is pointing to the last node and
        // previous is pointing to the second-to-last node Update the
        // next pointer of the second-to-last node to skip the last node
        previous.next = current?.next || null;

        // Delete the last node
        current = null;

        // Return the updated head of the list
        return head;
    }
```

Python

```python
"""
Definition for singly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None
"""

from typing import Optional

class Solution:
    def delete_last_node(
        self, head: Optional[ListNode]
    ) -> Optional[ListNode]:

        # If the list is empty, there's nothing to delete
        if head is None:
            return None

        # If there's only one node in the list, delete it and return
        # None
        if head.next is None:
            head = None
            return None

        # current node being iterated
        current: Optional[ListNode] = head

        # previous node
        previous: Optional[ListNode] = None

        # Traverse the list until the last node is reached
        while current is not None and current.next is not None:

            # Move the previous pointer to the current node
            previous = current

            # Move the current pointer to the next node
            current = current.next

        # At this point, current is pointing to the last node and
        # previous is pointing to the second-to-last node Update the
        # next pointer of the second-to-last node to skip the last node
        if previous and current:
            previous.next = current.next

        # Delete the last node
        current = None

        # Return the updated head of the list
        return head
```

## Complexity Analysis

The time complexity of the above function depends on the number of nodes in the linked list. Since we must traverse the entire list to reach the end, its time complexity is **O(N)**, where **N** is the number of nodes in the list.

The function's space complexity is **O(1)** because it only creates a single new node and does not use any additional data structures.

> **Best Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**
>
> **Worst Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Delete last node

## Problem Statement

Given the **head** of a singly linked list, write a function to delete the last node from this linked list and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\]
> -   **Output:** \[5, 7, 3\]

## Solution

<div class="lang-tabs">

```python,editable
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def delete_last_node(head):
    # Empty list — nothing to delete
    if head is None:
        return None

    # Single node — deleting it empties the list
    if head.next is None:
        return None

    current = head
    previous = None

    # Walk until current is the last node; previous trails one step behind
    while current.next is not None:
        previous = current
        current = current.next

    # Unlink the last node — GC reclaims it
    previous.next = None
    return head

# --- driver ---
def build(vals):
    dummy = ListNode(0)
    cur = dummy
    for v in vals:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next

def to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

head = build([5, 7, 3, 10])
head = delete_last_node(head)
print(to_list(head))  # [5, 7, 3]
```

```java,editable
public class Main {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int v) { val = v; }
        ListNode(int v, ListNode n) { val = v; next = n; }
    }

    static ListNode deleteLastNode(ListNode head) {
        // Empty list — nothing to delete
        if (head == null) return null;

        // Single node — deleting it empties the list
        if (head.next == null) return null;

        ListNode current = head;
        ListNode previous = null;

        // Walk until current is the last node
        while (current.next != null) {
            previous = current;
            current = current.next;
        }

        // Unlink the last node — GC reclaims it
        previous.next = null;
        return head;
    }

    static ListNode build(int[] vals) {
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;
        for (int v : vals) { cur.next = new ListNode(v); cur = cur.next; }
        return dummy.next;
    }

    static String toStr(ListNode head) {
        StringBuilder sb = new StringBuilder("[");
        while (head != null) {
            sb.append(head.val);
            if (head.next != null) sb.append(", ");
            head = head.next;
        }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        ListNode head = build(new int[]{5, 7, 3, 10});
        head = deleteLastNode(head);
        System.out.println(toStr(head)); // [5, 7, 3]
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>

typedef struct ListNode {
    int val;
    struct ListNode *next;
} ListNode;

ListNode* newNode(int v) {
    ListNode *n = malloc(sizeof(ListNode));
    n->val = v; n->next = NULL;
    return n;
}

ListNode* deleteLastNode(ListNode *head) {
    // Empty list — nothing to delete
    if (head == NULL) return NULL;

    // Single node — deleting it empties the list
    if (head->next == NULL) { free(head); return NULL; }

    ListNode *current = head;
    ListNode *previous = NULL;

    // Walk until current is the last node
    while (current->next != NULL) {
        previous = current;
        current = current->next;
    }

    // Unlink and free the last node
    previous->next = NULL;
    free(current);
    return head;
}

ListNode* build(int *vals, int n) {
    ListNode dummy = {0, NULL}; ListNode *cur = &dummy;
    for (int i = 0; i < n; i++) { cur->next = newNode(vals[i]); cur = cur->next; }
    return dummy.next;
}

void printList(ListNode *head) {
    printf("[");
    while (head) { printf("%d", head->val); if (head->next) printf(", "); head = head->next; }
    printf("]\n");
}

int main() {
    int vals[] = {5, 7, 3, 10};
    ListNode *head = build(vals, 4);
    head = deleteLastNode(head);
    printList(head); // [5, 7, 3]
    return 0;
}
```

```cpp,editable
#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int v) : val(v), next(nullptr) {}
};

ListNode* deleteLastNode(ListNode *head) {
    // Empty list — nothing to delete
    if (head == nullptr) return nullptr;

    // Single node — deleting it empties the list
    if (head->next == nullptr) { delete head; return nullptr; }

    ListNode *current = head;
    ListNode *previous = nullptr;

    // Walk until current is the last node; previous trails one step behind
    while (current != nullptr && current->next != nullptr) {
        previous = current;
        current = current->next;
    }

    // Unlink and free the last node
    previous->next = current->next; // current->next is nullptr here
    delete current;
    return head;
}

ListNode* build(initializer_list<int> vals) {
    ListNode dummy(0); ListNode *cur = &dummy;
    for (int v : vals) { cur->next = new ListNode(v); cur = cur->next; }
    return dummy.next;
}

void printList(ListNode *head) {
    cout << "[";
    while (head) { cout << head->val; if (head->next) cout << ", "; head = head->next; }
    cout << "]\n";
}

int main() {
    ListNode *head = build({5, 7, 3, 10});
    head = deleteLastNode(head);
    printList(head); // [5, 7, 3]
    return 0;
}
```

```scala,editable
class ListNode(var v: Int, var next: ListNode = null)

object Main extends App {
  def deleteLastNode(head: ListNode): ListNode = {
    // Empty list — nothing to delete
    if (head == null) return null

    // Single node — deleting it empties the list
    if (head.next == null) return null

    var current = head
    var previous: ListNode = null

    // Walk until current is the last node
    while (current.next != null) {
      previous = current
      current = current.next
    }

    // Unlink the last node — GC reclaims it
    previous.next = null
    head
  }

  def build(vals: Int*): ListNode = {
    val dummy = new ListNode(0)
    var cur = dummy
    for (v <- vals) { cur.next = new ListNode(v); cur = cur.next }
    dummy.next
  }

  def toStr(head: ListNode): String = {
    val sb = new StringBuilder("[")
    var cur = head
    while (cur != null) { sb.append(cur.v); if (cur.next != null) sb.append(", "); cur = cur.next }
    sb.append("]").toString
  }

  println(toStr(deleteLastNode(build(5, 7, 3, 10)))) // [5, 7, 3]
}
```

```javascript,editable
class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}

function deleteLastNode(head) {
  // Empty list — nothing to delete
  if (head === null) return null;

  // Single node — deleting it empties the list
  if (head.next === null) return null;

  let current = head;
  let previous = null;

  // Walk until current is the last node
  while (current.next !== null) {
    previous = current;
    current = current.next;
  }

  // Unlink the last node — GC reclaims it
  previous.next = null;
  return head;
}

function build(vals) {
  const dummy = new ListNode(0); let cur = dummy;
  for (const v of vals) { cur.next = new ListNode(v); cur = cur.next; }
  return dummy.next;
}

function toArr(head) {
  const res = []; while (head) { res.push(head.val); head = head.next; } return res;
}

let head = build([5, 7, 3, 10]);
head = deleteLastNode(head);
console.log(toArr(head)); // [5, 7, 3]
```

```typescript,editable
class ListNode {
  constructor(public val: number, public next: ListNode | null = null) {}
}

function deleteLastNode(head: ListNode | null): ListNode | null {
  // Empty list — nothing to delete
  if (head === null) return null;

  // Single node — deleting it empties the list
  if (head.next === null) return null;

  let current: ListNode = head;
  let previous: ListNode | null = null;

  // Walk until current is the last node
  while (current.next !== null) {
    previous = current;
    current = current.next;
  }

  // Unlink the last node — GC reclaims it
  previous!.next = null;
  return head;
}

function build(vals: number[]): ListNode | null {
  const dummy = new ListNode(0); let cur: ListNode = dummy;
  for (const v of vals) { cur.next = new ListNode(v); cur = cur.next; }
  return dummy.next;
}

function toArr(head: ListNode | null): number[] {
  const res: number[] = []; while (head) { res.push(head.val); head = head.next; } return res;
}

let head = build([5, 7, 3, 10]);
head = deleteLastNode(head);
console.log(toArr(head)); // [5, 7, 3]
```

```go,editable
package main

import "fmt"

type ListNode struct {
	Val  int
	Next *ListNode
}

func deleteLastNode(head *ListNode) *ListNode {
	// Empty list — nothing to delete
	if head == nil {
		return nil
	}

	// Single node — deleting it empties the list
	if head.Next == nil {
		return nil
	}

	current := head
	var previous *ListNode

	// Walk until current is the last node
	for current.Next != nil {
		previous = current
		current = current.Next
	}

	// Unlink the last node — Go's GC reclaims it
	previous.Next = nil
	return head
}

func build(vals []int) *ListNode {
	dummy := &ListNode{}
	cur := dummy
	for _, v := range vals { cur.Next = &ListNode{Val: v}; cur = cur.Next }
	return dummy.Next
}

func toSlice(head *ListNode) []int {
	var res []int
	for head != nil { res = append(res, head.Val); head = head.Next }
	return res
}

func main() {
	head := build([]int{5, 7, 3, 10})
	head = deleteLastNode(head)
	fmt.Println(toSlice(head)) // [5 7 3]
}
```

```kotlin,editable
class ListNode(var `val`: Int, var next: ListNode? = null)

fun deleteLastNode(head: ListNode?): ListNode? {
    // Empty list — nothing to delete
    if (head == null) return null

    // Single node — deleting it empties the list
    if (head.next == null) return null

    var current: ListNode = head
    var previous: ListNode? = null

    // Walk until current is the last node
    while (current.next != null) {
        previous = current
        current = current.next!!
    }

    // Unlink the last node — GC reclaims it
    previous?.next = null
    return head
}

fun build(vararg vals: Int): ListNode? {
    val dummy = ListNode(0); var cur = dummy
    for (v in vals) { cur.next = ListNode(v); cur = cur.next!! }
    return dummy.next
}

fun toList(head: ListNode?): List<Int> {
    val res = mutableListOf<Int>(); var cur = head
    while (cur != null) { res.add(cur.`val`); cur = cur.next }
    return res
}

fun main() {
    val head = deleteLastNode(build(5, 7, 3, 10))
    println(toList(head)) // [5, 7, 3]
}
```

```rust,editable
#[derive(Debug)]
struct ListNode {
    val: i32,
    next: Option<Box<ListNode>>,
}

impl ListNode {
    fn new(val: i32) -> Self { ListNode { val, next: None } }
}

fn delete_last_node(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    // Empty list — nothing to delete
    let mut head = head?;

    // Single node — deleting it empties the list
    if head.next.is_none() {
        return None;
    }

    // Walk to the second-to-last node using a mutable reference chain
    let mut current = &mut *head;
    while current.next.as_ref().map_or(false, |n| n.next.is_some()) {
        current = current.next.as_mut().unwrap();
    }
    // Drop the last node by setting next to None
    current.next = None;
    Some(head)
}

fn build(vals: &[i32]) -> Option<Box<ListNode>> {
    let mut head = None;
    for &v in vals.iter().rev() {
        let mut node = Box::new(ListNode::new(v));
        node.next = head;
        head = Some(node);
    }
    head
}

fn to_vec(mut head: &Option<Box<ListNode>>) -> Vec<i32> {
    let mut res = vec![];
    while let Some(node) = head { res.push(node.val); head = &node.next; }
    res
}

fn main() {
    let head = build(&[5, 7, 3, 10]);
    let head = delete_last_node(head);
    println!("{:?}", to_vec(&head)); // [5, 7, 3]
}
```

</div>

***

# Understanding deletion by given data

Deleting a node with the given data in a singly linked list can be implemented by piggybacking on the search operation. Instead of returning the data after finding it, we delete it in this operation. Let’s consider the possible cases when deleting a node with the given data.

## 1\. The list is empty

When the list is empty, meaning it contains no elements, any attempt to delete a node is unnecessary because there are no nodes in the list. Since there is nothing to remove, the list remains unchanged. We can return the existing **head**, as the list is empty, and no node needs to be deleted.

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 2\. The first node is deleted

If the data matches the first node, this case becomes the same as **deleting the first node**. We update the **head** to store the reference to the second node and delete the old head.

```d2
direction: right

before: "Before — target is the head" {
  direction: right
  h: head {shape: oval}
  n1: {
    value: "5 (target)"
    next
    style.fill: "#fde68a"
    style.stroke: "#d97706"
  }
  n2: {
    value: 7
    next
  }
  n3: {
    value: 3
    next: "null"
  }
  h -> n1.value
  n1.next -> n2.value
  n2.next -> n3.value
}

after: "After — head advances one step" {
  direction: right
  h: head {shape: oval}
  n2: {
    value: 7
    next
  }
  n3: {
    value: 3
    next: "null"
  }
  h -> n2.value
  n2.next -> n3.value
}

before -> after: "head = head.next"
```

<p align="center"><strong>Deleting the head is a single pointer update — move <code>head</code> forward and the old head becomes unreachable (garbage-collected or freed).</strong></p>

> **Algorithm**
>
> -   **Step 1:** Create a temporary pointer to store the current head node.
> -   **Step 2:** Move the head pointer to the next node.
> -   **Step 3:** Delete the original head node to free up memory.
> -   **Step 4:** Return the new head node.

## 3\. The node to be deleted is not the first node

To delete a node that is not the first node of the linked list, we need access to the node 1 step before the one to be deleted. We will traverse the list from the beginning while keeping track of the **current** and nodes. This way, when we reach the node with the given data, we will have access to its previous node, which we need to update.Deleting the given node involves a three-step process.

```d2
direction: right

before: "Before — walk with prev + current" {
  direction: right
  h: head {shape: oval}
  n1: {
    value: 5
    next
  }
  n2: {
    value: "7 (target)"
    next
    style.fill: "#fde68a"
    style.stroke: "#d97706"
  }
  n3: {
    value: 3
    next
  }
  n4: {
    value: 10
    next: "null"
  }
  prev: prev {shape: oval; style.stroke-dash: 3}
  cur: current {shape: oval; style.stroke-dash: 3}
  h -> n1.value
  n1.next -> n2.value
  n2.next -> n3.value
  n3.next -> n4.value
  prev -> n1.value: "" {style.stroke-dash: 3}
  cur -> n2.value: "" {style.stroke-dash: 3}
}

after: "After — splice out current" {
  direction: right
  h: head {shape: oval}
  n1: {
    value: 5
    next
  }
  n3: {
    value: 3
    next
  }
  n4: {
    value: 10
    next: "null"
  }
  h -> n1.value
  n1.next -> n3.value
  n3.next -> n4.value
}

before -> after: "prev.next = current.next; free current"
```

<p align="center"><strong>To delete an interior node, we need its predecessor. A two-pointer walk (<code>prev</code> + <code>current</code>) gives us both — then <code>prev.next = current.next</code> unlinks the target in O(1).</strong></p>

> **Algorithm**
>
> -   **Step 1:** Traverse the list, keeping track of `current` and `previous` nodes until reaching the `given` node.
> -   **Step 2:** Set the `previous` node's `next` pointer to hold the node's reference stored in the `next` pointer of the `current` node.
> -   **Step 3:** Delete the `current` node to free up memory.
> -   **Step 4:** Return the original head node.

## 4\. The node to be deleted could not be found

If the data provided does not match the data of any node in the linked list, then such a node does not exist in the list, so we return the existing **head**.

```d2
direction: right
h: head {shape: oval}
n1: {
  value: 5
  next
}
n2: {
  value: 7
  next
}
n3: {
  value: 3
  next
}
n4: {
  value: 10
  next: "null"
}
target: "target = 99 (not found)" {shape: oval; style.fill: "#fee2e2"; style.stroke: "#dc2626"}
result: "return head unchanged" {shape: oval}
h -> n1.value
n1.next -> n2.value
n2.next -> n3.value
n3.next -> n4.value
target -> result: "" {style.stroke-dash: 3}
n4.next -> result: "" {style.stroke-dash: 3}
```

<p align="center"><strong>If we reach the tail without finding the target, the list contains no node with that value — return the head unchanged.</strong></p>

> **Algorithm**
>
> -   **Step 1:** Traverse the list, keeping track of `current` and `previous` nodes until reaching the `given` node.
> -   **Step 2:** Return the original head node.

## Implementation

When implementing the logic for deleting a node with a given data operation, we consider all the possible cases and write the code for each in conditional blocks.

C++

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    ListNode *deleteNodeWithGivenData(ListNode *head, int data) {

        // If the list is empty, return nullptr
        if (head == nullptr)
            return nullptr;

        // If the head node contains the given data
        if (head->val == data) {

            // Create a temporary pointer to the head node
            ListNode *nodeToBeDeleted = head;

            // Update the head pointer to the next node
            head = head->next;

            // Delete the previous head node
            delete nodeToBeDeleted;

            // Return the updated head pointer
            return head;
        }

        // Pointer to the current node, starting from the head
        ListNode *current = head;

        // Pointer to the previous node, initially nullptr
        ListNode *previous = nullptr;

        // If the target data is not in the first node, search for it in
        // the rest of the list
        while (current != nullptr && current->val != data) {

            // Move the previous pointer to the current node
            previous = current;

            // Move the current pointer to the next node
            current = current->next;
        }

        // If the given data is not found, return the original head
        // pointer
        if (current == nullptr) {
            return head;
        }

        // Update the next pointer of the previous node to skip the
        // current node
        previous->next = current->next;

        // Delete the node with the given data
        delete current;

        // Return the head of the list, with the target data node removed
        return head;
    }
};
```

Java

```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

class Solution {
    public ListNode deleteNodeWithGivenData(ListNode head, int data) {

        // If the list is empty, return null
        if (head == null) return null;

        // If the head node contains the given data
        if (head.val == data) {

            // Create a temporary pointer to the head node
            ListNode nodeToBeDeleted = head;

            // Update the head pointer to the next node
            head = head.next;

            // Delete the previous head node
            nodeToBeDeleted = null;

            // Return the updated head pointer
            return head;
        }

        // Pointer to the current node, starting from the head
        ListNode current = head;

        // Pointer to the previous node, initially null
        ListNode previous = null;

        // If the target data is not in the first node, search for it in
        // the rest of the list
        while (current != null && current.val != data) {

            // Move the previous pointer to the current node
            previous = current;

            // Move the current pointer to the next node
            current = current.next;
        }

        // If the given data is not found, return the original head
        // pointer
        if (current == null) {
            return head;
        }

        // Update the next pointer of the previous node to skip the
        // current node
        previous.next = current.next;

        // Delete the node with the given data
        current = null;

        // Return the head of the list, with the target data node removed
        return head;
    }
```

Typescript

```typescript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

export class Solution {
    deleteNodeWithGivenData(
        head: ListNode | null,
        data: number
    ): ListNode | null {

        // If the list is empty, return null
        if (head === null) {
            return null;
        }

        // If the head node contains the given data
        if (head.val === data) {

            // Create a temporary pointer to the head node
            let nodeToBeDeleted: ListNode | null = head;

            // Update the head pointer to the next node
            head = head.next;

            // Delete the previous head node
            nodeToBeDeleted = null;

            // Return the updated head pointer
            return head;
        }

        // Pointer to the current node, starting from the head
        let current: ListNode | null = head;

        // Pointer to the previous node, initially null
        let previous: ListNode | null = null;

        // If the target data is not in the first node, search for it in
        // the rest of the list
        while (current !== null && current.val !== data) {

            // Move the previous pointer to the current node
            previous = current;

            // Move the current pointer to the next node
            current = current.next;
        }

        // If the given data is not found, return the original head
        // pointer
        if (current === null) {
            return head;
        }

        // Update the next pointer of the previous node to skip the
        // current node
        if (previous !== null) {
            previous.next = current.next;
        }

        // Delete the node with the given data
        current = null;

        // Return the head of the list, with the target data node removed
        return head;
    }
```

Javascript

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

export class Solution {
    deleteNodeWithGivenData(head, data) {

        // If the list is empty, return null
        if (head === null) {
            return null;
        }

        // If the head node contains the given data
        if (head.val === data) {

            // Create a temporary pointer to the head node
            let nodeToBeDeleted = head;

            // Update the head pointer to the next node
            head = head.next;

            // Delete the previous head node
            nodeToBeDeleted = null;

            // Return the updated head pointer
            return head;
        }

        // Pointer to the current node, starting from the head
        let current = head;

        // Pointer to the previous node, initially null
        let previous = null;

        // If the target data is not in the first node, search for it in
        // the rest of the list
        while (current !== null && current.val !== data) {

            // Move the previous pointer to the current node
            previous = current;

            // Move the current pointer to the next node
            current = current.next;
        }

        // If the given data is not found, return the original head
        // pointer
        if (current === null) {
            return head;
        }

        // Update the next pointer of the previous node to skip the
        // current node
        if (previous !== null) {
            previous.next = current.next;
        }

        // Delete the node with the given data
        current = null;

        // Return the head of the list, with the target data node removed
        return head;
    }
```

Python

```python
"""
Definition for singly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None
"""

from typing import Optional

class Solution:
    def delete_node_with_given_data(
        self, head: Optional[ListNode], data: int
    ) -> Optional[ListNode]:

        # If the list is empty, return None
        if head is None:
            return None

        # If the head node contains the given data
        if head.val == data:

            # Create a temporary pointer to the head node
            node_to_be_deleted: ListNode = head

            # Update the head pointer to the next node
            head = head.next

            # Delete the previous head node
            del node_to_be_deleted

            # Return the updated head pointer
            return head

        # Pointer to the current node, starting from the head
        current: Optional[ListNode] = head

        # Pointer to the previous node, initially None
        previous: Optional[ListNode] = None

        # If the target data is not in the first node, search for it in
        # the rest of the list
        while current is not None and current.val != data:

            # Move the previous pointer to the current node
            previous = current

            # Move the current pointer to the next node
            current = current.next

        # If the given data is not found, return the original head
        # pointer
        if current is None:
            return head

        # Update the next pointer of the previous node to skip the
        # current node
        if previous and current:
            previous.next = current.next

        # Delete the node with the given data
        del current

        # Return the head of the list, with the target data node removed
        return head
```

## Complexity Analysis

The time complexity of deleting a node with the given data depends on the position of the node in the linked list. Since the list must be traversed to locate the node containing the specified data, the number of operations varies based on where the node is found.

### Best case

The best case occurs when the given data matches the first node. In this case, the function must delete the first node of the list. This process takes **constant** time, regardless of the linked list's size.

```d2
direction: right
h: head {shape: oval}
n1: {
  value: target
  next
  style.fill: "#fde68a"
  style.stroke: "#d97706"
}
n2: {
  value: "·"
  next
}
n3: {
  value: "·"
  next
}
n4: {
  value: "·"
  next: "null"
}
cost: |md
  **1 comparison**

  **1 pointer update**

  `O(1)`
| {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
h -> n1.value
n1.next -> n2.value
n2.next -> n3.value
n3.next -> n4.value
n1.value -> cost: "" {style.stroke-dash: 3}
```

<p align="center"><strong>Best case — target is the head. No walking needed; single pointer update. <strong>O(1)</strong>.</strong></p>

### Worst case

On the other hand, the worst case occurs when the given data matches the last node. In this case, the function must delete the last node of the list. This process takes linear time proportional to the length of the linked list, i.e., **O(N)**.

```d2
direction: right
h: head {shape: oval}
n1: {
  value: "·"
  next
}
n2: {
  value: "·"
  next
}
n3: {
  value: "·"
  next
}
n4: {
  value: "target (tail)"
  next: "null"
  style.fill: "#fde68a"
  style.stroke: "#d97706"
}
cost: |md
  **n−1 hops to reach predecessor**

  **1 pointer update**

  `O(n)`
| {style.fill: "#fee2e2"; style.stroke: "#dc2626"}
h -> n1.value
n1.next -> n2.value
n2.next -> n3.value
n3.next -> n4.value
n4.value -> cost: "" {style.stroke-dash: 3}
```

<p align="center"><strong>Worst case — target is the tail. We must walk the entire list to reach its predecessor. <strong>O(n)</strong>.</strong></p>

The function's space complexity is constant, as it only creates a few variables that take up a fixed amount of space regardless of the size of the linked list.

> **Best Case** - The node with given data is the first node
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case** - The node with the given data is the last node
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Delete node with given data

## Problem Statement

Given the **head** of a singly linked list and a **data** value, write a function to delete the first node with the given data from the list and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\], data = 3
> -   **Output:** \[5, 7, 10\]

## Solution

<div class="lang-tabs">

```python,editable
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def delete_node_with_given_data(head, data):
    # Empty list — nothing to delete
    if head is None:
        return None

    # Head itself matches — move head forward and GC reclaims the old head
    if head.val == data:
        return head.next

    current = head
    previous = None

    # Search for the first node whose value equals data
    while current is not None and current.val != data:
        previous = current
        current = current.next

    # Data not found — return list unchanged
    if current is None:
        return head

    # Bypass the matched node — GC reclaims it
    previous.next = current.next
    return head

# --- driver ---
def build(vals):
    dummy = ListNode(0)
    cur = dummy
    for v in vals:
        cur.next = ListNode(v); cur = cur.next
    return dummy.next

def to_list(head):
    res = []
    while head: res.append(head.val); head = head.next
    return res

head = build([5, 7, 3, 10])
head = delete_node_with_given_data(head, 3)
print(to_list(head))  # [5, 7, 10]
```

```java,editable
public class Main {
    static class ListNode {
        int val; ListNode next;
        ListNode(int v) { val = v; }
        ListNode(int v, ListNode n) { val = v; next = n; }
    }

    static ListNode deleteNodeWithGivenData(ListNode head, int data) {
        // Empty list — nothing to delete
        if (head == null) return null;

        // Head itself matches — move head forward; GC reclaims old head
        if (head.val == data) return head.next;

        ListNode current = head;
        ListNode previous = null;

        // Search for the first node whose value equals data
        while (current != null && current.val != data) {
            previous = current;
            current = current.next;
        }

        // Data not found — return list unchanged
        if (current == null) return head;

        // Bypass the matched node
        previous.next = current.next;
        return head;
    }

    static ListNode build(int[] vals) {
        ListNode dummy = new ListNode(0); ListNode cur = dummy;
        for (int v : vals) { cur.next = new ListNode(v); cur = cur.next; }
        return dummy.next;
    }

    static String toStr(ListNode head) {
        StringBuilder sb = new StringBuilder("[");
        while (head != null) { sb.append(head.val); if (head.next != null) sb.append(", "); head = head.next; }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        ListNode head = build(new int[]{5, 7, 3, 10});
        head = deleteNodeWithGivenData(head, 3);
        System.out.println(toStr(head)); // [5, 7, 10]
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>

typedef struct ListNode { int val; struct ListNode *next; } ListNode;

ListNode* newNode(int v) {
    ListNode *n = malloc(sizeof(ListNode)); n->val = v; n->next = NULL; return n;
}

ListNode* deleteNodeWithGivenData(ListNode *head, int data) {
    // Empty list — nothing to delete
    if (head == NULL) return NULL;

    // Head itself matches — free it and return next
    if (head->val == data) {
        ListNode *next = head->next; free(head); return next;
    }

    ListNode *current = head;
    ListNode *previous = NULL;

    // Search for the first node whose value equals data
    while (current != NULL && current->val != data) {
        previous = current;
        current = current->next;
    }

    // Data not found — return list unchanged
    if (current == NULL) return head;

    // Bypass and free the matched node
    previous->next = current->next;
    free(current);
    return head;
}

ListNode* build(int *vals, int n) {
    ListNode dummy = {0, NULL}; ListNode *cur = &dummy;
    for (int i = 0; i < n; i++) { cur->next = newNode(vals[i]); cur = cur->next; }
    return dummy.next;
}

void printList(ListNode *head) {
    printf("[");
    while (head) { printf("%d", head->val); if (head->next) printf(", "); head = head->next; }
    printf("]\n");
}

int main() {
    int vals[] = {5, 7, 3, 10};
    ListNode *head = build(vals, 4);
    head = deleteNodeWithGivenData(head, 3);
    printList(head); // [5, 7, 10]
    return 0;
}
```

```cpp,editable
#include <iostream>
using namespace std;

struct ListNode {
    int val; ListNode *next;
    ListNode(int v) : val(v), next(nullptr) {}
};

ListNode* deleteNodeWithGivenData(ListNode *head, int data) {
    // Empty list — nothing to delete
    if (head == nullptr) return nullptr;

    // Head itself matches — delete it and return the next node as new head
    if (head->val == data) {
        ListNode *nodeToBeDeleted = head;
        head = head->next;
        delete nodeToBeDeleted;
        return head;
    }

    ListNode *current = head;
    ListNode *previous = nullptr;

    // Search for the first node whose value equals data
    while (current != nullptr && current->val != data) {
        previous = current;
        current = current->next;
    }

    // Data not found — return list unchanged
    if (current == nullptr) return head;

    // Bypass and delete the matched node
    previous->next = current->next;
    delete current;
    return head;
}

ListNode* build(initializer_list<int> vals) {
    ListNode dummy(0); ListNode *cur = &dummy;
    for (int v : vals) { cur->next = new ListNode(v); cur = cur->next; }
    return dummy.next;
}

void printList(ListNode *head) {
    cout << "[";
    while (head) { cout << head->val; if (head->next) cout << ", "; head = head->next; }
    cout << "]\n";
}

int main() {
    ListNode *head = build({5, 7, 3, 10});
    head = deleteNodeWithGivenData(head, 3);
    printList(head); // [5, 7, 10]
    return 0;
}
```

```scala,editable
class ListNode(var v: Int, var next: ListNode = null)

object Main extends App {
  def deleteNodeWithGivenData(head: ListNode, data: Int): ListNode = {
    // Empty list — nothing to delete
    if (head == null) return null

    // Head itself matches — advance past it; GC reclaims old head
    if (head.v == data) return head.next

    var current = head
    var previous: ListNode = null

    // Search for the first node whose value equals data
    while (current != null && current.v != data) {
      previous = current
      current = current.next
    }

    // Data not found — return list unchanged
    if (current == null) return head

    // Bypass the matched node
    previous.next = current.next
    head
  }

  def build(vals: Int*): ListNode = {
    val dummy = new ListNode(0); var cur = dummy
    for (v <- vals) { cur.next = new ListNode(v); cur = cur.next }
    dummy.next
  }

  def toStr(head: ListNode): String = {
    val sb = new StringBuilder("["); var cur = head
    while (cur != null) { sb.append(cur.v); if (cur.next != null) sb.append(", "); cur = cur.next }
    sb.append("]").toString
  }

  println(toStr(deleteNodeWithGivenData(build(5, 7, 3, 10), 3))) // [5, 7, 10]
}
```

```javascript,editable
class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}

function deleteNodeWithGivenData(head, data) {
  // Empty list — nothing to delete
  if (head === null) return null;

  // Head itself matches — return next; GC reclaims old head
  if (head.val === data) return head.next;

  let current = head;
  let previous = null;

  // Search for the first node whose value equals data
  while (current !== null && current.val !== data) {
    previous = current;
    current = current.next;
  }

  // Data not found — return list unchanged
  if (current === null) return head;

  // Bypass the matched node
  previous.next = current.next;
  return head;
}

function build(vals) {
  const dummy = new ListNode(0); let cur = dummy;
  for (const v of vals) { cur.next = new ListNode(v); cur = cur.next; }
  return dummy.next;
}

function toArr(head) {
  const res = []; while (head) { res.push(head.val); head = head.next; } return res;
}

let head = build([5, 7, 3, 10]);
head = deleteNodeWithGivenData(head, 3);
console.log(toArr(head)); // [5, 7, 10]
```

```typescript,editable
class ListNode {
  constructor(public val: number, public next: ListNode | null = null) {}
}

function deleteNodeWithGivenData(head: ListNode | null, data: number): ListNode | null {
  // Empty list — nothing to delete
  if (head === null) return null;

  // Head itself matches — return next; GC reclaims old head
  if (head.val === data) return head.next;

  let current: ListNode | null = head;
  let previous: ListNode | null = null;

  // Search for the first node whose value equals data
  while (current !== null && current.val !== data) {
    previous = current;
    current = current.next;
  }

  // Data not found — return list unchanged
  if (current === null) return head;

  // Bypass the matched node
  previous!.next = current.next;
  return head;
}

function build(vals: number[]): ListNode | null {
  const dummy = new ListNode(0); let cur: ListNode = dummy;
  for (const v of vals) { cur.next = new ListNode(v); cur = cur.next; }
  return dummy.next;
}

function toArr(head: ListNode | null): number[] {
  const res: number[] = []; while (head) { res.push(head.val); head = head.next; } return res;
}

let head = build([5, 7, 3, 10]);
head = deleteNodeWithGivenData(head, 3);
console.log(toArr(head)); // [5, 7, 10]
```

```go,editable
package main

import "fmt"

type ListNode struct {
	Val  int
	Next *ListNode
}

func deleteNodeWithGivenData(head *ListNode, data int) *ListNode {
	// Empty list — nothing to delete
	if head == nil {
		return nil
	}

	// Head itself matches — return next; GC reclaims old head
	if head.Val == data {
		return head.Next
	}

	current := head
	var previous *ListNode

	// Search for the first node whose value equals data
	for current != nil && current.Val != data {
		previous = current
		current = current.Next
	}

	// Data not found — return list unchanged
	if current == nil {
		return head
	}

	// Bypass the matched node
	previous.Next = current.Next
	return head
}

func build(vals []int) *ListNode {
	dummy := &ListNode{}; cur := dummy
	for _, v := range vals { cur.Next = &ListNode{Val: v}; cur = cur.Next }
	return dummy.Next
}

func toSlice(head *ListNode) []int {
	var res []int
	for head != nil { res = append(res, head.Val); head = head.Next }
	return res
}

func main() {
	head := build([]int{5, 7, 3, 10})
	head = deleteNodeWithGivenData(head, 3)
	fmt.Println(toSlice(head)) // [5 7 10]
}
```

```kotlin,editable
class ListNode(var `val`: Int, var next: ListNode? = null)

fun deleteNodeWithGivenData(head: ListNode?, data: Int): ListNode? {
    // Empty list — nothing to delete
    if (head == null) return null

    // Head itself matches — return next; GC reclaims old head
    if (head.`val` == data) return head.next

    var current: ListNode? = head
    var previous: ListNode? = null

    // Search for the first node whose value equals data
    while (current != null && current.`val` != data) {
        previous = current
        current = current.next
    }

    // Data not found — return list unchanged
    if (current == null) return head

    // Bypass the matched node
    previous?.next = current.next
    return head
}

fun build(vararg vals: Int): ListNode? {
    val dummy = ListNode(0); var cur = dummy
    for (v in vals) { cur.next = ListNode(v); cur = cur.next!! }
    return dummy.next
}

fun toList(head: ListNode?): List<Int> {
    val res = mutableListOf<Int>(); var cur = head
    while (cur != null) { res.add(cur.`val`); cur = cur.next }
    return res
}

fun main() {
    val head = deleteNodeWithGivenData(build(5, 7, 3, 10), 3)
    println(toList(head)) // [5, 7, 10]
}
```

```rust,editable
#[derive(Debug)]
struct ListNode {
    val: i32,
    next: Option<Box<ListNode>>,
}

impl ListNode {
    fn new(val: i32) -> Self { ListNode { val, next: None } }
}

fn delete_node_with_given_data(head: Option<Box<ListNode>>, data: i32) -> Option<Box<ListNode>> {
    let mut head = head?;

    // Head itself matches — drop it and return the rest
    if head.val == data {
        return head.next;
    }

    // Walk with a mutable reference so we can splice out the match in place
    let mut current = &mut *head;
    while current.next.as_ref().map_or(false, |n| n.val != data) {
        current = current.next.as_mut().unwrap();
    }

    // If next node matches, bypass it; the Box is dropped here
    if current.next.as_ref().map_or(false, |n| n.val == data) {
        let next_next = current.next.as_mut().unwrap().next.take();
        current.next = next_next;
    }

    Some(head)
}

fn build(vals: &[i32]) -> Option<Box<ListNode>> {
    let mut head = None;
    for &v in vals.iter().rev() {
        let mut node = Box::new(ListNode::new(v)); node.next = head; head = Some(node);
    }
    head
}

fn to_vec(mut head: &Option<Box<ListNode>>) -> Vec<i32> {
    let mut res = vec![];
    while let Some(node) = head { res.push(node.val); head = &node.next; }
    res
}

fn main() {
    let head = build(&[5, 7, 3, 10]);
    let head = delete_node_with_given_data(head, 3);
    println!("{:?}", to_vec(&head)); // [5, 7, 10]
}
```

</div>

***

# Delete nodes with given data

## Problem Statement

Given the **head** of a singly linked list and a **data** value, write a function to delete **all** the nodes with the given data from the list and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10, 3, 12\], data = 3
> -   **Output:** \[5, 7, 10, 12\]

## Solution

<div class="lang-tabs">

```python,editable
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def delete_nodes_with_given_data(head, data):
    # Strip matching nodes from the front so head always points to a keeper
    while head is not None and head.val == data:
        head = head.next

    # List was all-matches — now empty
    if head is None:
        return None

    previous = head
    current = head.next

    while current is not None:
        # Skip over any consecutive run of matching nodes
        while current is not None and current.val == data:
            current = current.next

        # Reconnect previous to the first non-matching node (or None)
        previous.next = current
        previous = current

        # Advance only when current is still valid
        if current is not None:
            current = current.next

    return head

# --- driver ---
def build(vals):
    dummy = ListNode(0); cur = dummy
    for v in vals: cur.next = ListNode(v); cur = cur.next
    return dummy.next

def to_list(head):
    res = []
    while head: res.append(head.val); head = head.next
    return res

head = build([5, 7, 3, 10, 3, 12])
head = delete_nodes_with_given_data(head, 3)
print(to_list(head))  # [5, 7, 10, 12]
```

```java,editable
public class Main {
    static class ListNode {
        int val; ListNode next;
        ListNode(int v) { val = v; }
        ListNode(int v, ListNode n) { val = v; next = n; }
    }

    static ListNode deleteNodesWithGivenData(ListNode head, int data) {
        // Strip matching nodes from the front
        while (head != null && head.val == data) head = head.next;

        // All nodes were matches — list is now empty
        if (head == null) return null;

        ListNode previous = head;
        ListNode current = head.next;

        while (current != null) {
            // Skip over a consecutive run of matching nodes
            while (current != null && current.val == data) current = current.next;

            // Reconnect and advance
            previous.next = current;
            previous = current;
            if (current != null) current = current.next;
        }

        return head;
    }

    static ListNode build(int[] vals) {
        ListNode dummy = new ListNode(0); ListNode cur = dummy;
        for (int v : vals) { cur.next = new ListNode(v); cur = cur.next; }
        return dummy.next;
    }

    static String toStr(ListNode head) {
        StringBuilder sb = new StringBuilder("[");
        while (head != null) { sb.append(head.val); if (head.next != null) sb.append(", "); head = head.next; }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        ListNode head = build(new int[]{5, 7, 3, 10, 3, 12});
        head = deleteNodesWithGivenData(head, 3);
        System.out.println(toStr(head)); // [5, 7, 10, 12]
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>

typedef struct ListNode { int val; struct ListNode *next; } ListNode;

ListNode* newNode(int v) {
    ListNode *n = malloc(sizeof(ListNode)); n->val = v; n->next = NULL; return n;
}

ListNode* deleteNodesWithGivenData(ListNode *head, int data) {
    // Strip matching nodes from the front and free them
    while (head != NULL && head->val == data) {
        ListNode *tmp = head; head = head->next; free(tmp);
    }
    if (head == NULL) return NULL;

    ListNode *previous = head;
    ListNode *current = head->next;

    while (current != NULL) {
        // Free and skip consecutive matching nodes
        while (current != NULL && current->val == data) {
            ListNode *tmp = current; current = current->next; free(tmp);
        }
        previous->next = current;
        previous = current;
        if (current != NULL) current = current->next;
    }

    return head;
}

ListNode* build(int *vals, int n) {
    ListNode dummy = {0, NULL}; ListNode *cur = &dummy;
    for (int i = 0; i < n; i++) { cur->next = newNode(vals[i]); cur = cur->next; }
    return dummy.next;
}

void printList(ListNode *head) {
    printf("[");
    while (head) { printf("%d", head->val); if (head->next) printf(", "); head = head->next; }
    printf("]\n");
}

int main() {
    int vals[] = {5, 7, 3, 10, 3, 12};
    ListNode *head = build(vals, 6);
    head = deleteNodesWithGivenData(head, 3);
    printList(head); // [5, 7, 10, 12]
    return 0;
}
```

```cpp,editable
#include <iostream>
using namespace std;

struct ListNode {
    int val; ListNode *next;
    ListNode(int v) : val(v), next(nullptr) {}
};

ListNode* deleteNodesWithGivenData(ListNode *head, int data) {
    // Strip matching nodes from the front and delete them
    while (head != nullptr && head->val == data) {
        ListNode *nodeToBeDeleted = head;
        head = head->next;
        delete nodeToBeDeleted;
    }
    if (head == nullptr) return nullptr;

    ListNode *previous = head;
    ListNode *current = head->next;

    while (current != nullptr) {
        // Delete and skip consecutive matching nodes
        while (current != nullptr && current->val == data) {
            ListNode *nodeToBeDeleted = current;
            current = current->next;
            delete nodeToBeDeleted;
        }
        previous->next = current;
        previous = current;
        if (current != nullptr) current = current->next;
    }

    return head;
}

ListNode* build(initializer_list<int> vals) {
    ListNode dummy(0); ListNode *cur = &dummy;
    for (int v : vals) { cur->next = new ListNode(v); cur = cur->next; }
    return dummy.next;
}

void printList(ListNode *head) {
    cout << "[";
    while (head) { cout << head->val; if (head->next) cout << ", "; head = head->next; }
    cout << "]\n";
}

int main() {
    ListNode *head = build({5, 7, 3, 10, 3, 12});
    head = deleteNodesWithGivenData(head, 3);
    printList(head); // [5, 7, 10, 12]
    return 0;
}
```

```scala,editable
class ListNode(var v: Int, var next: ListNode = null)

object Main extends App {
  def deleteNodesWithGivenData(head: ListNode, data: Int): ListNode = {
    // Strip matching nodes from the front
    var h = head
    while (h != null && h.v == data) h = h.next
    if (h == null) return null

    var previous = h
    var current = h.next

    while (current != null) {
      // Skip consecutive matching nodes
      while (current != null && current.v == data) current = current.next
      previous.next = current
      previous = current
      if (current != null) current = current.next
    }
    h
  }

  def build(vals: Int*): ListNode = {
    val dummy = new ListNode(0); var cur = dummy
    for (v <- vals) { cur.next = new ListNode(v); cur = cur.next }
    dummy.next
  }

  def toStr(head: ListNode): String = {
    val sb = new StringBuilder("["); var cur = head
    while (cur != null) { sb.append(cur.v); if (cur.next != null) sb.append(", "); cur = cur.next }
    sb.append("]").toString
  }

  println(toStr(deleteNodesWithGivenData(build(5, 7, 3, 10, 3, 12), 3))) // [5, 7, 10, 12]
}
```

```javascript,editable
class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}

function deleteNodesWithGivenData(head, data) {
  // Strip matching nodes from the front
  while (head !== null && head.val === data) head = head.next;
  if (head === null) return null;

  let previous = head;
  let current = head.next;

  while (current !== null) {
    // Skip consecutive matching nodes
    while (current !== null && current.val === data) current = current.next;
    previous.next = current;
    previous = current;
    if (current !== null) current = current.next;
  }

  return head;
}

function build(vals) {
  const dummy = new ListNode(0); let cur = dummy;
  for (const v of vals) { cur.next = new ListNode(v); cur = cur.next; }
  return dummy.next;
}

function toArr(head) {
  const res = []; while (head) { res.push(head.val); head = head.next; } return res;
}

let head = build([5, 7, 3, 10, 3, 12]);
head = deleteNodesWithGivenData(head, 3);
console.log(toArr(head)); // [5, 7, 10, 12]
```

```typescript,editable
class ListNode {
  constructor(public val: number, public next: ListNode | null = null) {}
}

function deleteNodesWithGivenData(head: ListNode | null, data: number): ListNode | null {
  // Strip matching nodes from the front
  while (head !== null && head.val === data) head = head.next;
  if (head === null) return null;

  let previous: ListNode = head;
  let current: ListNode | null = head.next;

  while (current !== null) {
    // Skip consecutive matching nodes
    while (current !== null && current.val === data) current = current.next;
    previous.next = current;
    previous = current!;
    if (current !== null) current = current.next;
  }

  return head;
}

function build(vals: number[]): ListNode | null {
  const dummy = new ListNode(0); let cur: ListNode = dummy;
  for (const v of vals) { cur.next = new ListNode(v); cur = cur.next; }
  return dummy.next;
}

function toArr(head: ListNode | null): number[] {
  const res: number[] = []; while (head) { res.push(head.val); head = head.next; } return res;
}

let head = build([5, 7, 3, 10, 3, 12]);
head = deleteNodesWithGivenData(head, 3);
console.log(toArr(head)); // [5, 7, 10, 12]
```

```go,editable
package main

import "fmt"

type ListNode struct {
	Val  int
	Next *ListNode
}

func deleteNodesWithGivenData(head *ListNode, data int) *ListNode {
	// Strip matching nodes from the front
	for head != nil && head.Val == data {
		head = head.Next
	}
	if head == nil {
		return nil
	}

	previous := head
	current := head.Next

	for current != nil {
		// Skip consecutive matching nodes
		for current != nil && current.Val == data {
			current = current.Next
		}
		previous.Next = current
		previous = current
		if current != nil {
			current = current.Next
		}
	}

	return head
}

func build(vals []int) *ListNode {
	dummy := &ListNode{}; cur := dummy
	for _, v := range vals { cur.Next = &ListNode{Val: v}; cur = cur.Next }
	return dummy.Next
}

func toSlice(head *ListNode) []int {
	var res []int
	for head != nil { res = append(res, head.Val); head = head.Next }
	return res
}

func main() {
	head := build([]int{5, 7, 3, 10, 3, 12})
	head = deleteNodesWithGivenData(head, 3)
	fmt.Println(toSlice(head)) // [5 7 10 12]
}
```

```kotlin,editable
class ListNode(var `val`: Int, var next: ListNode? = null)

fun deleteNodesWithGivenData(head: ListNode?, data: Int): ListNode? {
    // Strip matching nodes from the front
    var h = head
    while (h != null && h.`val` == data) h = h.next
    if (h == null) return null

    var previous: ListNode = h
    var current: ListNode? = h.next

    while (current != null) {
        // Skip consecutive matching nodes
        while (current != null && current.`val` == data) current = current.next
        previous.next = current
        previous = current ?: previous
        if (current != null) current = current.next
    }

    return h
}

fun build(vararg vals: Int): ListNode? {
    val dummy = ListNode(0); var cur = dummy
    for (v in vals) { cur.next = ListNode(v); cur = cur.next!! }
    return dummy.next
}

fun toList(head: ListNode?): List<Int> {
    val res = mutableListOf<Int>(); var cur = head
    while (cur != null) { res.add(cur.`val`); cur = cur.next }
    return res
}

fun main() {
    val head = deleteNodesWithGivenData(build(5, 7, 3, 10, 3, 12), 3)
    println(toList(head)) // [5, 7, 10, 12]
}
```

```rust,editable
#[derive(Debug)]
struct ListNode {
    val: i32,
    next: Option<Box<ListNode>>,
}

impl ListNode {
    fn new(val: i32) -> Self { ListNode { val, next: None } }
}

fn delete_nodes_with_given_data(mut head: Option<Box<ListNode>>, data: i32) -> Option<Box<ListNode>> {
    // Strip matching nodes from the front — each dropped Box frees itself
    while head.as_ref().map_or(false, |n| n.val == data) {
        head = head.unwrap().next;
    }
    let mut head = head?;

    // Walk the rest, splicing out any run of matching nodes
    let mut current = &mut *head;
    loop {
        // Advance past matching nodes in next position
        while current.next.as_ref().map_or(false, |n| n.val == data) {
            let next_next = current.next.as_mut().unwrap().next.take();
            current.next = next_next;
        }
        match current.next {
            None => break,
            Some(ref mut next_node) => {
                // Safe: we just confirmed next is not a match
                current = next_node;
            }
        }
    }

    Some(head)
}

fn build(vals: &[i32]) -> Option<Box<ListNode>> {
    let mut head = None;
    for &v in vals.iter().rev() {
        let mut node = Box::new(ListNode::new(v)); node.next = head; head = Some(node);
    }
    head
}

fn to_vec(mut head: &Option<Box<ListNode>>) -> Vec<i32> {
    let mut res = vec![];
    while let Some(node) = head { res.push(node.val); head = &node.next; }
    res
}

fn main() {
    let head = build(&[5, 7, 3, 10, 3, 12]);
    let head = delete_nodes_with_given_data(head, 3);
    println!("{:?}", to_vec(&head)); // [5, 7, 10, 12]
}
```

</div>

***

# Understanding deletion after a given node

When deleting a node, we require access to the node one step before the node to be deleted to manipulate its pointer. If we already have the previous node, the deletion process becomes straightforward. This is what makes this deletion operation the simplest of all delete operations. Let's examine all the cases we need to consider.

## 1\. The list is empty

If the list is empty and contains no elements, we cannot find the given node because it does not exist within the list. Deleting the node after the given node is not possible because there is no reference point within the list to perform the deletion. In this case, we can return the existing **head**, as the list is empty, and no node needs to be deleted.

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 2\. The given node is the last node

When the given node is the last node in the list, attempting to delete a node after it becomes an invalid operation. This is because, by definition, the last node has no successor, i.e., no node following it in the sequence. We can return the **head** because no other operation needs to be done.

```d2
direction: right
h: head {shape: oval}
n1: {
  value: 5
  next
}
n2: {
  value: 7
  next
}
n3: {
  value: "3 (given, next: null)"
  next: "null"
  style.fill: "#fde68a"
  style.stroke: "#d97706"
}
result: "return head unchanged" {shape: oval}
h -> n1.value
n1.next -> n2.value
n2.next -> n3.value
n3.value -> result: "no successor to delete" {style.stroke-dash: 3}
```

<p align="center"><strong>If the given node is the tail, there is no "node after it" to delete — return the list unchanged.</strong></p>

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 3\. The given node is not the last node

To delete a node after a given node, we can update the pointer of the given node to skip over the node that needs to be deleted. Then, we can remove the node that we want to delete.

```d2
direction: right

before: "Before — delete the node after 'given'" {
  direction: right
  h: head {shape: oval}
  n1: {
    value: 5
    next
  }
  n2: {
    value: "7 (given)"
    next
  }
  n3: {
    value: "3 (victim)"
    next
    style.fill: "#fde68a"
    style.stroke: "#d97706"
  }
  n4: {
    value: 10
    next: "null"
  }
  h -> n1.value
  n1.next -> n2.value
  n2.next -> n3.value
  n3.next -> n4.value
}

after: "After — given.next = victim.next" {
  direction: right
  h: head {shape: oval}
  n1: {
    value: 5
    next
  }
  n2: {
    value: "7 (given)"
    next
  }
  n4: {
    value: 10
    next: "null"
  }
  h -> n1.value
  n1.next -> n2.value
  n2.next -> n4.value
}

before -> after: "one pointer hop"
```

<p align="center"><strong>Deleting the node after a given node is O(1) — we already have the predecessor (the given node itself). Just redirect <code>given.next</code> past the victim.</strong></p>

> **Algorithm:**
>
> -   **Step 1:** Create a temporary pointer to store the reference of the node after the `given` node.
> -   **Step 2:** Set the `next` pointer of the `given` node to hold the node's reference stored in the `next` pointer of the node after the `given` node.
> -   **Step 3:** Delete the node after the given node to free up memory.
> -   **Step 4:** Return the original head node.

## Implementation

When implementing the logic for deleting a node after a given node operation, we consider all the possible cases and write the code for each in conditional blocks.

C++

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    ListNode *deleteNodeAfterTheGivenNode(
        ListNode *head,
        ListNode *node
    ) {

        // If the list is empty, there's nothing to delete, so return
        // nullptr.
        if (head == nullptr) {
            return nullptr;
        }

        // If the given node is nullptr or it is the last node in the
        // list, there's no node to delete, so return the original head.
        if (node == nullptr || node->next == nullptr) {
            return head;
        }

        // Store the next node in a temporary variable.
        ListNode *nodeToBeDeleted = node->next;

        // Link the current node (node) to the node after the one being
        // deleted.
        node->next = nodeToBeDeleted->next;

        // Delete the node that was after the given node.
        delete nodeToBeDeleted;

        // Return the original head.
        return head;
    }
};
```

Java

```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

class Solution {
    public ListNode deleteNodeAfterTheGivenNode(
        ListNode head,
        ListNode node
    ) {

        // If the list is empty, there's nothing to delete, so return
        // null.
        if (head == null) {
            return null;
        }

        // If the given node is null or it is the last node in the list,
        // there's no node to delete, so return the original head.
        if (node == null || node.next == null) {
            return head;
        }

        // Store the next node in a temporary variable.
        ListNode nodeToBeDeleted = node.next;

        // Link the current node (node) to the node after the one being
        // deleted.
        node.next = nodeToBeDeleted.next;

        // Delete the node that was after the given node.
        nodeToBeDeleted = null;

        // Return the original head.
        return head;
    }
```

Typescript

```typescript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

export class Solution {
    deleteNodeAfterTheGivenNode(
        head: ListNode | null,
        node: ListNode | null
    ): ListNode | null {

        // If the list is empty, there's nothing to delete, so return
        // null.
        if (head === null) {
            return null;
        }

        // If the given node is null or it is the last node in the list,
        // there's no node to delete, so return the original head.
        if (node === null || node.next === null) {
            return head;
        }

        // Store the next node in a temporary variable.
        const nodeToBeDeleted = node.next;

        // Link the current node (node) to the node after the one being
        // deleted.
        node.next = nodeToBeDeleted.next;

        // Delete the node that was after the given node.
        nodeToBeDeleted.next = null;

        // Return the original head.
        return head;
    }
```

Javascript

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

export class Solution {
    deleteNodeAfterTheGivenNode(head, node) {

        // If the list is empty, there's nothing to delete, so return
        // null.
        if (head === null) {
            return null;
        }

        // If the given node is null or it is the last node in the list,
        // there's no node to delete, so return the original head.
        if (node === null || node.next === null) {
            return head;
        }

        // Store the next node in a temporary variable.
        const nodeToBeDeleted = node.next;

        // Link the current node (node) to the node after the one being
        // deleted.
        node.next = nodeToBeDeleted.next;

        // Delete the node that was after the given node.
        nodeToBeDeleted.next = null;

        // Return the original head.
        return head;
    }
```

Python

```python
"""
Definition for singly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None
"""

from typing import Optional

class Solution:
    def delete_node_after_the_given_node(
        self, head: Optional[ListNode], node: Optional[ListNode]
    ) -> Optional[ListNode]:

        # If the list is empty, there's nothing to delete, so return
        # None.
        if head is None:
            return None

        # If the given node is None or it is the last node in the list,
        # there's no node to delete, so return the original head.
        if node is None or node.next is None:
            return head

        # Store the next node in a temporary variable.
        node_to_be_deleted: ListNode = node.next

        # Link the current node (node) to the node after the one being
        # deleted.
        node.next = node_to_be_deleted.next

        # Delete the node that was after the given node.
        del node_to_be_deleted

        # Return the original head.
        return head
```

**Does the order of operations matter here?**It is important to emphasize the order of these assignment and deletion operations. We must ensure we do not access a node after it is deleted, so deletion should be the last step. An incorrect sequence of operations can lead to a program crash, and such errors are hard to debug.

## Complexity Analysis

We need to make some pointer manipulations to delete the node. Therefore, the time complexity is constant. Similarly, we don't create any new nodes in all cases, so the space complexity is also constant, i.e., **O(1)**.

> **Best Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**

***

# Delete node after the given node

## Problem Statement

Given the **head** of a singly linked list and a **random** **node** in a linked list, write a function to delete the node after the given node and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\], node = 7
> -   **Output:** \[5, 7, 10\]

## Solution

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    ListNode *deleteNodeAfterTheGivenNode(
        ListNode *head,
        ListNode *node
    ) {

        // If the list is empty, there's nothing to delete, so return
        // nullptr.
        if (head == nullptr) {
            return nullptr;
        }

        // If the given node is nullptr or it is the last node in the
        // list, there's no node to delete, so return the original head.
        if (node == nullptr || node->next == nullptr) {
            return head;
        }

        // Store the next node in a temporary variable.
        ListNode *nodeToBeDeleted = node->next;

        // Link the current node (node) to the node after the one being
        // deleted.
        node->next = nodeToBeDeleted->next;

        // Delete the node that was after the given node.
        delete nodeToBeDeleted;

        // Return the original head.
        return head;
    }
};
```

***

# Understanding deletion before a given node

Deleting the node before the given node is similar to **inserting before the given node**. We need access to the node before the one that has to be deleted. Keeping this in mind, let's try to understand the different cases we must consider before coming up with a general solution.

## 1\. The list is empty

If the list is empty and contains no elements, we cannot find the given node because it does not exist within the list. Deleting the node after the given node is not possible because there is no reference point within the list to perform the deletion. In this case, we can return the existing **head**, as the list is empty, and no node needs to be deleted.

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 2\. The given node is the first node

When the given node is the first node in the list, attempting to delete a node before it becomes an invalid operation. This is because, by definition, the first node has no predecessor, i.e., no node preceding it in the sequence. We can return the **head** because no other operation needs to be done.

```d2
direction: right
h: head {shape: oval}
n1: {
  value: "5 (given)"
  next
  style.fill: "#fde68a"
  style.stroke: "#d97706"
}
n2: {
  value: 7
  next
}
n3: {
  value: 3
  next: "null"
}
result: "return head unchanged" {shape: oval}
h -> n1.value
n1.next -> n2.value
n2.next -> n3.value
n1.value -> result: "no predecessor to delete" {style.stroke-dash: 3}
```

<p align="center"><strong>If the given node is the head, there is no "node before it" to delete — return the list unchanged.</strong></p>

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 3\. The given node is the second node

This is a unique situation because removing the node before the second node essentially means deleting the linked list's head node. As learned earlier, this scenario is identical to **deleting the first node**. We need to update the head to store the reference to the second node and then delete the old head.

```d2
direction: right

before: "Before — 'given' is the second node" {
  direction: right
  h: head {shape: oval}
  n1: {
    value: "5 (victim)"
    next
    style.fill: "#fde68a"
    style.stroke: "#d97706"
  }
  n2: {
    value: "7 (given)"
    next
  }
  n3: {
    value: 3
    next: "null"
  }
  h -> n1.value
  n1.next -> n2.value
  n2.next -> n3.value
}

after: "After — head advances past the victim" {
  direction: right
  h: head {shape: oval}
  n2: {
    value: "7 (given)"
    next
  }
  n3: {
    value: 3
    next: "null"
  }
  h -> n2.value
  n2.next -> n3.value
}

before -> after: "head = head.next"
```

<p align="center"><strong>When <code>given</code> is the second node, the node before it is the head. This special case collapses to "delete the head" — handled in one pointer update.</strong></p>

> **Algorithm**
>
> -   **Step 1:** Create a temporary pointer to store the current head node.
> -   **Step 2:** Move the head pointer to the next node.
> -   **Step 3:** Delete the original head node to free up memory.
> -   **Step 4:** Return the new head node.

## 4\. The given node is any other node

To delete the node before a given node, we need to access the node two steps before the given node. We traverse the linked list while keeping track of the **current**,  and **previousToPrevious** nodes. As soon as we reach the given node, we update the pointer of the **previousToPrevious** node to hold the reference to the current node and then delete the node.

```d2
direction: right

before: "Before — walk with prev + current" {
  direction: right
  h: head {shape: oval}
  n1: {
    value: 5
    next
  }
  n2: {
    value: "7 (target)"
    next
    style.fill: "#fde68a"
    style.stroke: "#d97706"
  }
  n3: {
    value: 3
    next
  }
  n4: {
    value: 10
    next: "null"
  }
  prev: prev {shape: oval; style.stroke-dash: 3}
  cur: current {shape: oval; style.stroke-dash: 3}
  h -> n1.value
  n1.next -> n2.value
  n2.next -> n3.value
  n3.next -> n4.value
  prev -> n1.value: "" {style.stroke-dash: 3}
  cur -> n2.value: "" {style.stroke-dash: 3}
}

after: "After — splice out current" {
  direction: right
  h: head {shape: oval}
  n1: {
    value: 5
    next
  }
  n3: {
    value: 3
    next
  }
  n4: {
    value: 10
    next: "null"
  }
  h -> n1.value
  n1.next -> n3.value
  n3.next -> n4.value
}

before -> after: "prev.next = current.next; free current"
```

<p align="center"><strong>To delete an interior node, we need its predecessor. A two-pointer walk (<code>prev</code> + <code>current</code>) gives us both — then <code>prev.next = current.next</code> unlinks the target in O(1).</strong></p>

> **Algorithm**
>
> -   **Step 1:** Traverse the list, keeping track of `current`, `previous` and `previousToPrevious` nodes until reaching the given node.
> -   **Step 2:** Set the `previousToPrevious` node's `next` pointer to hold the reference of the `current` node.
> -   **Step 3:** Delete the `previous` node to free up memory.
> -   **Step 4:** Return the original head node.

## Implementation

When implementing the logic for deleting the node before the given node, we consider all the possible cases and write the code for each in conditional blocks. 

C++

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    ListNode *deleteNodeBeforeTheGivenNode(
        ListNode *head,
        ListNode *node
    ) {

        // If the head or the given node is nullptr, there is nothing to
        // delete Return the existing head
        if (head == nullptr || node == nullptr) {
            return head;
        }

        // If the given node is the head node, we cannot delete the node
        // before it
        if (node == head) {
            return head;
        }

        // If the node to delete is the immediate next node of the head
        // Update the head to point to the next node, delete the original
        // head, and return the updated head
        if (head->next != nullptr && head->next == node) {
            ListNode *nodeToBeDeleted = head;
            head = head->next;
            delete nodeToBeDeleted;
            return head;
        }

        // Initialize variables for traversal
        // current node being examined
        ListNode *current = head->next;

        // Node preceding the current node
        ListNode *previous = head;

        // Node preceding the previous node
        ListNode *previousToprevious = nullptr;

        // Traverse the linked list until we find the node or reach the
        // end.
        while (current != nullptr && current != node) {
            previousToprevious = previous;
            previous = current;
            current = current->next;
        }

        // If the node to delete was not found, return the head as is.
        if (current == nullptr) {
            return head;
        }

        // Connect the previous node to the current node, bypassing the
        // node to delete.
        previousToprevious->next = current;
        delete previous;

        return head;
    }
};
```

Java

```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

class Solution {
    public ListNode deleteNodeBeforeTheGivenNode(
        ListNode head,
        ListNode node
    ) {

        // If the head or the given node is null, there is nothing to
        // delete Return the existing head
        if (head == null || node == null) {
            return head;
        }

        // If the given node is the head node, we cannot delete the node
        // before it
        if (node == head) {
            return head;
        }

        // If the node to delete is the immediate next node of the head
        // Update the head to point to the next node, delete the original
        // head, and return the updated head
        if (head.next != null && head.next == node) {
            ListNode nodeToBeDeleted = head;
            head = head.next;

            // Dereference for garbage collection
            nodeToBeDeleted = null;
            return head;
        }

        // Initialize variables for traversal
        // current node being examined
        ListNode current = head.next;

        // Node preceding the current node
        ListNode previous = head;

        // Node preceding the previous node
        ListNode previousToprevious = null;

        // Traverse the linked list until we find the node or reach the
        // end.
        while (current != null && current != node) {
            previousToprevious = previous;
            previous = current;
            current = current.next;
        }

        // If the node to delete was not found, return the head as is.
        if (current == null) {
            return head;
        }

        // Connect the previous node to the current node, bypassing the
        // node to delete.
        previousToprevious.next = current;

        // Dereference for garbage collection
        previous = null;

        return head;
    }
```

Typescript

```typescript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

export class Solution {
    deleteNodeBeforeTheGivenNode(
        head: ListNode | null,
        node: ListNode | null
    ): ListNode | null {

        // If the head or the given node is null, there is nothing to
        // delete Return the existing head
        if (head === null || node === null) {
            return head;
        }

        // If the given node is the head node, we cannot delete the node
        // before it
        if (node === head) {
            return head;
        }

        // If the node to delete is the immediate next node of the head
        // Update the head to point to the next node, delete the original
        // head, and return the updated head
        if (head.next !== null && head.next === node) {
            let nodeToBeDeleted = head;
            head = head.next;

            // Dereference for garbage collection
            nodeToBeDeleted = null;
            return head;
        }

        // Initialize variables for traversal
        // current node being examined
        let current: ListNode | null = head.next;

        // Node preceding the current node
        let previous: ListNode | null = head;

        // Node preceding the previous node
        let previousToprevious: ListNode | null = null;

        // Traverse the linked list until we find the node or reach the
        // end.
        while (current !== null && current !== node) {
            previousToprevious = previous;
            previous = current;
            current = current.next;
        }

        // If the node to delete was not found, return the head as is.
        if (current === null) {
            return head;
        }

        // Connect the previous node to the current node, bypassing the
        // node to delete.
        previousToprevious.next = current;

        // Dereference for garbage collection
        previous = null;

        return head;
    }
```

Javascript

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

export class Solution {
    deleteNodeBeforeTheGivenNode(head, node) {

        // If the head or the given node is null, there is nothing to
        // delete Return the existing head
        if (head === null || node === null) {
            return head;
        }

        // If the given node is the head node, we cannot delete the node
        // before it
        if (node === head) {
            return head;
        }

        // If the node to delete is the immediate next node of the head
        // Update the head to point to the next node, delete the original
        // head, and return the updated head
        if (head.next !== null && head.next === node) {
            let nodeToBeDeleted = head;
            head = head.next;

            // Dereference for garbage collection
            nodeToBeDeleted = null;
            return head;
        }

        // Initialize variables for traversal
        // current node being examined
        let current = head.next;

        // Node preceding the current node
        let previous = head;

        // Node preceding the previous node
        let previousToprevious = null;

        // Traverse the linked list until we find the node or reach the
        // end.
        while (current !== null && current !== node) {
            previousToprevious = previous;
            previous = current;
            current = current.next;
        }

        // If the node to delete was not found, return the head as is.
        if (current === null) {
            return head;
        }

        // Connect the previous node to the current node, bypassing the
        // node to delete.
        previousToprevious.next = current;

        // Dereference for garbage collection
        previous = null;

        return head;
    }
```

Python

```python
"""
Definition for singly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None
"""

from typing import Optional

class Solution:
    def delete_node_before_the_given_node(
        self, head: Optional[ListNode], node: Optional[ListNode]
    ) -> Optional[ListNode]:

        # If the head or the given node is None, there is nothing to delete
        # Return the existing head
        if head is None or node is None:
            return head

        # If the given node is the head node, we cannot delete the node
        # before it
        if node == head:
            return head

        # If the node to delete is the immediate next node of the head
        # Update the head to point to the next node, delete the original
        # head, and return the updated head
        if head.next is not None and head.next == node:
            node_to_be_deleted = head
            head = head.next
            node_to_be_deleted = (

                # Dereference for garbage collection
                None
            )
            return head

        # Initialize variables for traversal
        # current node being examined
        current = head.next

        # Node preceding the current node
        previous = head

        # Node preceding the previous node
        previous_toprevious = None

        # Traverse the linked list until we find the node or reach the
        # end.
        while current is not None and current != node:
            previous_toprevious = previous
            previous = current
            current = current.next

        # If the node to delete was not found, return the head as is.
        if current is None:
            return head

        # Connect the previous node to the current node, bypassing the
        # node to delete.
        previous_toprevious.next = current

        # Dereference for garbage collection
        previous = None

        return head
```

## Complexity Analysis

The time complexity of deleting a node before a given node depends on the position of the target node in the linked list. Since the list must be traversed to locate the node and its predecessor, the number of operations varies based on where the deletion occurs.

### Best case

The best case occurs when the given node is the second node of the list. In this case, the function must delete the first node of the list. This process takes **constant** time, regardless of the linked list's size.

```d2
direction: right
h: head {shape: oval}
n1: {
  value: target
  next
  style.fill: "#fde68a"
  style.stroke: "#d97706"
}
n2: {
  value: "·"
  next
}
n3: {
  value: "·"
  next
}
n4: {
  value: "·"
  next: "null"
}
cost: |md
  **1 comparison**

  **1 pointer update**

  `O(1)`
| {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
h -> n1.value
n1.next -> n2.value
n2.next -> n3.value
n3.next -> n4.value
n1.value -> cost: "" {style.stroke-dash: 3}
```

<p align="center"><strong>Best case — target is the head. No walking needed; single pointer update. <strong>O(1)</strong>.</strong></p>

### Worst case

On the other hand, the worst case occurs when the given data matches the last node. In this case, the function must delete the second last node of the list. This process takes linear time proportional to the length of the linked list, i.e., **O(N)**.

```d2
direction: right
h: head {shape: oval}
n1: {
  value: "·"
  next
}
n2: {
  value: "·"
  next
}
n3: {
  value: "·"
  next
}
n4: {
  value: "target (tail)"
  next: "null"
  style.fill: "#fde68a"
  style.stroke: "#d97706"
}
cost: |md
  **n−1 hops to reach predecessor**

  **1 pointer update**

  `O(n)`
| {style.fill: "#fee2e2"; style.stroke: "#dc2626"}
h -> n1.value
n1.next -> n2.value
n2.next -> n3.value
n3.next -> n4.value
n4.value -> cost: "" {style.stroke-dash: 3}
```

<p align="center"><strong>Worst case — target is the tail. We must walk the entire list to reach its predecessor. <strong>O(n)</strong>.</strong></p>

The function's space complexity is constant, as it only creates a few variables that take up a fixed amount of space regardless of the size of the linked list.

> **Best Case** - The given node is the second node in the list.
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case** - The given node is the last node in the list.
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Delete node before the given node

## Problem Statement

Given the **head** of a singly linked list and a **random node** in the list, write a function to delete the node before the given node and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\], node = 3
> -   **Output:** \[5, 3, 10\]

## Solution

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    ListNode *deleteNodeBeforeTheGivenNode(
        ListNode *head,
        ListNode *node
    ) {

        // If the head or the given node is nullptr, there is nothing to
        // delete Return the existing head
        if (head == nullptr || node == nullptr) {
            return head;
        }

        // If the given node is the head node, we cannot delete the node
        // before it
        if (node == head) {
            return head;
        }

        // If the node to delete is the immediate next node of the head
        // Update the head to point to the next node, delete the original
        // head, and return the updated head
        if (head->next != nullptr && head->next == node) {
            ListNode *nodeToBeDeleted = head;
            head = head->next;
            delete nodeToBeDeleted;
            return head;
        }

        // Initialize variables for traversal
        // current node being examined
        ListNode *current = head->next;

        // Node preceding the current node
        ListNode *previous = head;

        // Node preceding the previous node
        ListNode *previousToprevious = nullptr;

        // Traverse the linked list until we find the node or reach the
        // end.
        while (current != nullptr && current != node) {
            previousToprevious = previous;
            previous = current;
            current = current->next;
        }

        // If the node to delete was not found, return the head as is.
        if (current == nullptr) {
            return head;
        }

        // Connect the previous node to the current node, bypassing the
        // node to delete.
        previousToprevious->next = current;
        delete previous;

        return head;
    }
};
```

***

# Understanding deletion of the given node

Deleting the given node is identical to **deleting the node with the given data**. The only difference is that instead of seeking the node with the specified data value, we will search for the node that matches the given node. Let's examine the various scenarios we need to consider.

## 1\. The list is empty

If the list is empty and contains no elements, we cannot find the given node because it does not exist within the list. Therefore, deleting the given node is not possible because there is no reference point within the list to perform the deletion. In this case, we can return the existing **head**, as the list is empty, and no node needs to be deleted.

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 2\. The first node is deleted

If the given node matches the first node, this case becomes the same as **deleting the first node**. We update the **head** to store the reference to the second node and delete the old head.

```d2
direction: right

before: "Before — target is the head" {
  direction: right
  h: head {shape: oval}
  n1: {
    value: "5 (target)"
    next
    style.fill: "#fde68a"
    style.stroke: "#d97706"
  }
  n2: {
    value: 7
    next
  }
  n3: {
    value: 3
    next: "null"
  }
  h -> n1.value
  n1.next -> n2.value
  n2.next -> n3.value
}

after: "After — head advances one step" {
  direction: right
  h: head {shape: oval}
  n2: {
    value: 7
    next
  }
  n3: {
    value: 3
    next: "null"
  }
  h -> n2.value
  n2.next -> n3.value
}

before -> after: "head = head.next"
```

<p align="center"><strong>Deleting the head is a single pointer update — move <code>head</code> forward and the old head becomes unreachable (garbage-collected or freed).</strong></p>

> **Algorithm**
>
> -   **Step 1:** Create a temporary pointer to store the current head node.
> -   **Step 2:** Move the head pointer to the next node.
> -   **Step 3:** Delete the original head node to free up memory.
> -   **Step 4:** Return the new head node.

## 3\. The node to be deleted is not the first node

To delete a node that is not the first node of the linked list, we need access to the node 1 step before the one to be deleted. We will traverse the list from the beginning while keeping track of the **current** and nodes. This way, when we reach the given node, we will have access to its previous node, which we need to update. Deleting the given node involves a three step process.

```d2
direction: right

before: "Before — walk with prev + current" {
  direction: right
  h: head {shape: oval}
  n1: {
    value: 5
    next
  }
  n2: {
    value: "7 (target)"
    next
    style.fill: "#fde68a"
    style.stroke: "#d97706"
  }
  n3: {
    value: 3
    next
  }
  n4: {
    value: 10
    next: "null"
  }
  prev: prev {shape: oval; style.stroke-dash: 3}
  cur: current {shape: oval; style.stroke-dash: 3}
  h -> n1.value
  n1.next -> n2.value
  n2.next -> n3.value
  n3.next -> n4.value
  prev -> n1.value: "" {style.stroke-dash: 3}
  cur -> n2.value: "" {style.stroke-dash: 3}
}

after: "After — splice out current" {
  direction: right
  h: head {shape: oval}
  n1: {
    value: 5
    next
  }
  n3: {
    value: 3
    next
  }
  n4: {
    value: 10
    next: "null"
  }
  h -> n1.value
  n1.next -> n3.value
  n3.next -> n4.value
}

before -> after: "prev.next = current.next; free current"
```

<p align="center"><strong>To delete an interior node, we need its predecessor. A two-pointer walk (<code>prev</code> + <code>current</code>) gives us both — then <code>prev.next = current.next</code> unlinks the target in O(1).</strong></p>

> **Algorithm**
>
> -   **Step 1:** Traverse the list, keeping track of `current` and `previous` nodes until reaching the given node.
> -   **Step 2:** Set the `previous` node's `next` pointer to hold the node's reference stored in the `next` pointer of the `current` node.
> -   **Step 3:** Delete the `current` node to free up memory.
> -   **Step 4:** Return the original head node.

## Implementation

When implementing the logic to delete the given node, we consider all the possible cases and subcases and write the code for each in conditional blocks.

C++

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    ListNode *deleteTheGivenNode(ListNode *head, ListNode *node) {

        // Check if either the head or the given node is null
        if (head == nullptr || node == nullptr) {
            return head;
        }

        // The given node is the head node
        if (node == head) {

            // Update the head to the next node
            head = head->next;

            // Delete the given node
            delete node;

            // Return the updated head
            return head;
        }

        // Pointer to traverse the list
        ListNode *current = head;

        // Pointer to track the previous node
        ListNode *previous = nullptr;

        // Traverse the list until the current node matches the given
        // node
        while (current != nullptr && current != node) {

            // Update the previous node
            previous = current;

            // Move to the next node
            current = current->next;
        }

        // If the current node becomes null, the given node was not found
        // in the list
        if (current == nullptr) {

            // Return the original head
            return head;
        }

        // Update the previous node's next pointer to skip the current
        // node
        previous->next = current->next;

        // Delete the current node
        delete current;

        // Return the head of the modified list
        return head;
    }
};
```

Java

```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

class Solution {
    public ListNode deleteTheGivenNode(ListNode head, ListNode node) {

        // Check if either the head or the given node is null
        if (head == null || node == null) {
            return head;
        }

        // The given node is the head node
        if (node == head) {

            // Update the head to the next node
            head = head.next;

            // Delete the given node
            node = null;

            // Return the updated head
            return head;
        }

        // Pointer to traverse the list
        ListNode current = head;

        // Pointer to track the previous node
        ListNode previous = null;

        // Traverse the list until the current node matches the given
        // node
        while (current != null && current != node) {

            // Update the previous node
            previous = current;

            // Move to the next node
            current = current.next;
        }

        // If the current node becomes null, the given node was not found
        // in the list
        if (current == null) {

            // Return the original head
            return head;
        }

        // Update the previous node's next pointer to skip the current
        // node
        previous.next = current.next;

        // Delete the current node
        current = null;

        // Return the head of the modified list
        return head;
    }
```

Typescript

```typescript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

export class Solution {
    deleteTheGivenNode(
        head: ListNode | null,
        node: ListNode | null
    ): ListNode | null {

        // Check if either the head or the given node is null
        if (head === null || node === null) {
            return head;
        }

        // The given node is the head node
        if (node === head) {

            // Update the head to the next node
            head = head.next;

            // Delete the given node
            node = null;

            // Return the updated head
            return head;
        }

        // Pointer to traverse the list
        let current: ListNode | null = head;

        // Pointer to track the previous node
        let previous: ListNode | null = null;

        // Traverse the list until the current node matches the given
        // node
        while (current !== null && current !== node) {

            // Update the previous node
            previous = current;

            // Move to the next node
            current = current.next;
        }

        // If the current node becomes null, the given node was not found
        // in the list
        if (current === null) {

            // Return the original head
            return head;
        }

        // Update the previous node's next pointer to skip the current
        // node
        if (previous !== null) {
            previous.next = current.next;
        }

        // Delete the current node
        current = null;

        // Return the head of the modified list
        return head;
    }
```

Javascript

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

export class Solution {
    deleteTheGivenNode(head, node) {

        // Check if either the head or the given node is null
        if (head === null || node === null) {
            return head;
        }

        // The given node is the head node
        if (node === head) {

            // Update the head to the next node
            head = head.next;

            // Delete the given node
            node = null;

            // Return the updated head
            return head;
        }

        // Pointer to traverse the list
        let current = head;

        // Pointer to track the previous node
        let previous = null;

        // Traverse the list until the current node matches the given
        // node
        while (current !== null && current !== node) {

            // Update the previous node
            previous = current;

            // Move to the next node
            current = current.next;
        }

        // If the current node becomes null, the given node was not found
        // in the list
        if (current === null) {

            // Return the original head
            return head;
        }

        // Update the previous node's next pointer to skip the current
        // node
        if (previous !== null) {
            previous.next = current.next;
        }

        // Delete the current node
        current = null;

        // Return the head of the modified list
        return head;
    }
```

Python

```python
"""
Definition for singly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None
"""

from typing import Optional, List, Any

class Solution:
    def delete_the_given_node(
        self, head: Optional[ListNode], node: Optional[ListNode]
    ) -> Optional[ListNode]:

        # Check if either the head or the given node is None
        if head is None or node is None:
            return head

        # The given node is the head node
        if node == head:

            # Update the head to the next node
            head = head.next

            # Delete the given node
            del node

            # Return the updated head
            return head

        # Pointer to traverse the list
        current: Optional[ListNode] = head

        # Pointer to track the previous node
        previous: Optional[ListNode] = None

        # Traverse the list until the current node matches the given node
        while current is not None and current != node:

            # Update the previous node
            previous = current

            # Move to the next node
            current = current.next

        # If the current node becomes None, the given node was not found
        # in the list
        if current is None:

            # Return the original head
            return head

        # Update the previous node's next pointer to skip the current
        # node
        if previous and current:
            previous.next = current.next

        # Delete the current node
        del current

        # Return the head of the modified list
        return head
```

## Complexity Analysis

The time complexity of deleting a given node depends on its position in the linked list. As the node must be located through traversal before removal, the number of operations varies based on where the node appears in the list.

### Best case

The best case occurs when the given node is the first node. In this case, the function must delete the first node of the list. This process takes **constant** time, regardless of the linked list's size.

```d2
direction: right
h: head {shape: oval}
n1: {
  value: target
  next
  style.fill: "#fde68a"
  style.stroke: "#d97706"
}
n2: {
  value: "·"
  next
}
n3: {
  value: "·"
  next
}
n4: {
  value: "·"
  next: "null"
}
cost: |md
  **1 comparison**

  **1 pointer update**

  `O(1)`
| {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
h -> n1.value
n1.next -> n2.value
n2.next -> n3.value
n3.next -> n4.value
n1.value -> cost: "" {style.stroke-dash: 3}
```

<p align="center"><strong>Best case — target is the head. No walking needed; single pointer update. <strong>O(1)</strong>.</strong></p>

### Worst case

On the other hand, the worst case occurs when the given node is the last node. In this case, the function must delete the last node of the list. This process takes linear time proportional to the length of the linked list, i.e., **O(N)**.

```d2
direction: right
h: head {shape: oval}
n1: {
  value: "·"
  next
}
n2: {
  value: "·"
  next
}
n3: {
  value: "·"
  next
}
n4: {
  value: "target (tail)"
  next: "null"
  style.fill: "#fde68a"
  style.stroke: "#d97706"
}
cost: |md
  **n−1 hops to reach predecessor**

  **1 pointer update**

  `O(n)`
| {style.fill: "#fee2e2"; style.stroke: "#dc2626"}
h -> n1.value
n1.next -> n2.value
n2.next -> n3.value
n3.next -> n4.value
n4.value -> cost: "" {style.stroke-dash: 3}
```

<p align="center"><strong>Worst case — target is the tail. We must walk the entire list to reach its predecessor. <strong>O(n)</strong>.</strong></p>

The function's space complexity is constant, as it only creates a few variables that take up a fixed amount of space regardless of the size of the linked list.

> **Best Case** - The given node is the first node.
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case** - The given node is the last node.
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Delete the given node

## Problem Statement

Given the **head** of a singly linked list and a **random node** in that linked list, write a function to delete that node from the list and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\], node = 7
> -   **Output:** \[5, 3, 10\]

## Solution

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    ListNode *deleteTheGivenNode(ListNode *head, ListNode *node) {

        // Check if either the head or the given node is null
        if (head == nullptr || node == nullptr) {
            return head;
        }

        // The given node is the head node
        if (node == head) {

            // Update the head to the next node
            head = head->next;

            // Delete the given node
            delete node;

            // Return the updated head
            return head;
        }

        // Pointer to traverse the list
        ListNode *current = head;

        // Pointer to track the previous node
        ListNode *previous = nullptr;

        // Traverse the list until the current node matches the given
        // node
        while (current != nullptr && current != node) {

            // Update the previous node
            previous = current;

            // Move to the next node
            current = current->next;
        }

        // If the current node becomes null, the given node was not found
        // in the list
        if (current == nullptr) {

            // Return the original head
            return head;
        }

        // Update the previous node's next pointer to skip the current
        // node
        previous->next = current->next;

        // Delete the current node
        delete current;

        // Return the head of the modified list
        return head;
    }
};
```

***

# Understanding deletion at a given distance

Deleting a node at a distance `X` is similar to **inserting a node at a given distance**. Just like inserting at a distance `X` We can solve this problem without keeping track of the previous node while traversing. However, we must consider a few special cases, so let’s examine them.

## 1\. The list is empty

When the list is empty, meaning it contains no elements, any attempt to delete a node is unnecessary because there are no nodes in the list. Since there is nothing to remove, the list remains unchanged. We can return the existing **head**, as the list is empty, and no node needs to be deleted.

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 2\. X = 0

When X equals 0, we need to **delete the first node**. We have previously covered this concept. We should update the head to store the reference to the second node and then delete the old head.

X = 0

> **Algorithm**
>
> -   **Step 1:** Create a temporary pointer to store the current head node.
> -   **Step 2:** Move the head pointer to the next node.
> -   **Step 3:** Delete the original head node to free up memory.
> -   **Step 4:** Return the new head node.

## 3\. X < size of the list

When we need to delete a specific node from a list, we should traverse the list until we reach the node just before the one we want to delete. Keep track of the current node and traverse `X-1` steps instead of `X`. At the end of the loop, we will reach the node one step before the node that needs to be deleted. Then, the problem becomes **deleting a node after a given node**, where the given node is the node one step before the node that has to be deleted. Update the reference in the given node's pointer to point to the node after the one that has to be deleted. Once the connections have been updated, safely delete the next node.

```d2
direction: right

before: "X = 2 within a list of size 5" {
  direction: right
  h: head {shape: oval}
  n0: {
    value: "5 [0]"
    next
  }
  n1: {
    value: "7 [1]"
    next
  }
  n2: {
    value: "3 [2 — victim]"
    next
    style.fill: "#fde68a"
    style.stroke: "#d97706"
  }
  n3: {
    value: "10 [3]"
    next
  }
  n4: {
    value: "4 [4]"
    next: "null"
  }
  h -> n0.value
  n0.next -> n1.value
  n1.next -> n2.value
  n2.next -> n3.value
  n3.next -> n4.value
}

after: "After — node at index 2 unlinked" {
  direction: right
  h: head {shape: oval}
  n0: {
    value: 5
    next
  }
  n1: {
    value: 7
    next
  }
  n3: {
    value: 10
    next
  }
  n4: {
    value: 4
    next: "null"
  }
  h -> n0.value
  n0.next -> n1.value
  n1.next -> n3.value
  n3.next -> n4.value
}

before -> after: "walk X−1 hops to predecessor; prev.next = prev.next.next"
```

<p align="center"><strong>When <code>X</code> is within bounds, walk <code>X−1</code> steps to reach the predecessor and splice out its successor.</strong></p>

> **Algorithm**
>
> -   **Step 1:** Traverse the distance X - 1 while keeping track of the `current` node.
> -   **Step 2:** Set the `next` pointer of the `current` node to hold the node's reference stored in the `next` pointer of the node to be deleted.
> -   **Step 3:** Delete the node after the `current` node to free up memory.
> -   **Step 4:** Return the original head node.

## 4\. X >= the size of the list

This indicates an invalid query. For example, we cannot delete the 10th node in a list of size 3. We will return the existing **head** node.

**What about the case when X == size of the linked list?**

This is also an invalid case. To clarify, let's consider a list of size 5. In this scenario, the potential values of `X` could range from 0 to 4, meaning `[0, 4]`. Therefore, an input 5 would be invalid. It's important to note that X represents the distance from the head node, not the node's position.

```d2
direction: right
h: head {shape: oval}
n0: {
  value: "5 [0]"
  next
}
n1: {
  value: "7 [1]"
  next
}
n2: {
  value: "3 [2]"
  next: "null"
}
x: "X = 5 (out of range)" {shape: oval; style.fill: "#fee2e2"; style.stroke: "#dc2626"}
result: "return head unchanged" {shape: oval}
h -> n0.value
n0.next -> n1.value
n1.next -> n2.value
x -> result: "walk falls off" {style.stroke-dash: 3}
n2.next -> result: "" {style.stroke-dash: 3}
```

<p align="center"><strong>When <code>X</code> is ≥ list size, there is no node at that index — return the list unchanged without modifying anything.</strong></p>

> **Algorithm**
>
> -   **Step 1:** Traverse the distance X - 1 while keeping track of the `current` node.
> -   **Step 2:** Return the original head node.

## Implementation

When implementing the logic for deleting nodes at a distance, we consider all the possible cases and write the code for each in conditional blocks.

C++

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    ListNode *deleteNodeAtGivenDistance(ListNode *head, int X) {

        // If the head is nullptr (empty list), return nullptr
        if (head == nullptr) {
            return nullptr;
        }

        // If X is 0, delete the head node
        if (X == 0) {
            ListNode *nodeToBeDeleted = head;

            // Update the head to the next node
            head = head->next;

            // Delete the original head node
            delete nodeToBeDeleted;

            // Return the updated head
            return head;
        }

        int counter = 0;
        ListNode *current = head;

        // Traverse to the node at position X - 1
        while (current != nullptr && counter < X - 1) {

            // Move to the next node
            current = current->next;

            // Increment the counter
            counter++;
        }

        // If the node at position X - 1 is null or the next node is
        // null, return the head
        if (current == nullptr || current->next == nullptr) {
            return head;
        }

        // Store the node to be deleted
        ListNode *nodeToBeDeleted = current->next;

        // Update the next pointer of current node
        current->next = current->next->next;

        // Delete the node at position X
        delete nodeToBeDeleted;

        // Return the head
        return head;
    }
};
```

Java

```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

class Solution {
    public ListNode deleteNodeAtGivenDistance(ListNode head, int X) {

        // If the head is null (empty list), return null
        if (head == null) {
            return null;
        }

        // If X is 0, delete the head node
        if (X == 0) {
            ListNode nodeToBeDeleted = head;

            // Update the head to the next node
            head = head.next;

            // Delete the original head node
            nodeToBeDeleted = null;

            // Return the updated head
            return head;
        }

        int counter = 0;
        ListNode current = head;

        // Traverse to the node at position X - 1
        while (current != null && counter < X - 1) {

            // Move to the next node
            current = current.next;

            // Increment the counter
            counter++;
        }

        // If the node at position X - 1 is null or the next node is
        // null, return the head
        if (current == null || current.next == null) {
            return head;
        }

        // Store the node to be deleted
        ListNode nodeToBeDeleted = current.next;

        // Update the next pointer of current node
        current.next = current.next.next;

        // Delete the node at position X
        nodeToBeDeleted = null;

        // Return the head
        return head;
    }
```

Typescript

```typescript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

export class Solution {
    deleteNodeAtGivenDistance(
        head: ListNode | null,
        X: number
    ): ListNode | null {

        // If the head is null (empty list), return null
        if (head === null) {
            return null;
        }

        // If X is 0, delete the head node
        if (X === 0) {
            const nodeToBeDeleted: ListNode = head;

            // Update the head to the next node
            head = head.next;

            // Delete the original head node
            nodeToBeDeleted.next = null;

            // Return the updated head
            return head;
        }

        let counter = 0;
        let current: ListNode | null = head;

        // Traverse to the node at position X - 1
        while (current !== null && counter < X - 1) {

            // Move to the next node
            current = current.next;

            // Increment the counter
            counter++;
        }

        // If the node at position X - 1 is null or the next node is
        // null, return the head
        if (current === null || current.next === null) {
            return head;
        }

        // Store the node to be deleted
        const nodeToBeDeleted: ListNode = current.next;

        // Update the next pointer of current node
        current.next = current.next.next;

        // Delete the node at position X
        nodeToBeDeleted.next = null;

        // Return the head
        return head;
    }
```

Javascript

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

export class Solution {
    deleteNodeAtGivenDistance(head, X) {

        // If the head is null (empty list), return null
        if (head === null) {
            return null;
        }

        // If X is 0, delete the head node
        if (X === 0) {
            const nodeToBeDeleted = head;

            // Update the head to the next node
            head = head.next;

            // Delete the original head node
            nodeToBeDeleted.next = null;

            // Return the updated head
            return head;
        }
        let counter = 0;
        let current = head;

        // Traverse to the node at position X - 1
        while (current !== null && counter < X - 1) {

            // Move to the next node
            current = current.next;

            // Increment the counter
            counter++;
        }

        // If the node at position X - 1 is null or the next node is
        // null, return the head
        if (current === null || current.next === null) {
            return head;
        }

        // Store the node to be deleted
        const nodeToBeDeleted = current.next;

        // Update the next pointer of current node
        current.next = current.next.next;

        // Delete the node at position X
        nodeToBeDeleted.next = null;

        // Return the head
        return head;
    }
```

Python

```python
"""
Definition for singly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None
"""

from typing import Optional

class Solution:
    def delete_node_at_given_distance(
        self, head: Optional[ListNode], x: int
    ) -> Optional[ListNode]:

        # If the head is None (empty list), return None
        if head is None:
            return None

        # If x is 0, delete the head node
        if x == 0:
            node_to_be_deleted: ListNode = head

            # Update the head to the next node
            head = head.next

            # Delete the original head node
            del node_to_be_deleted

            # Return the updated head
            return head

        counter: int = 0
        current: Optional[ListNode] = head

        # Traverse to the node at position x - 1
        while current is not None and counter < x - 1:

            # Move to the next node
            current = current.next

            # Increment the counter
            counter += 1

        # If the node at position x - 1 is None or the next node is None,
        # return the head
        if current is None or current.next is None:
            return head

        # Store the node to be deleted
        node_to_be_deleted = current.next

        # Update the next pointer of the current node
        current.next = current.next.next

        # Delete the node at position x
        del node_to_be_deleted

        # Return the head
        return head
```

## Complexity Analysis

The time complexity of deleting a node at a given distance `X` depends on the value of `X` and the size of the linked list. Since the list must be traversed up to the specified distance to locate the node, the number of operations varies based on how far the node is from the beginning.

### Best case

The best case occurs when `X` is equal to 0. In this case, the function must delete the first node of the list. This process takes **constant** time, regardless of the linked list's size.

```d2
direction: right
h: head {shape: oval}
n1: {
  value: "X=0 (victim)"
  next
  style.fill: "#fde68a"
  style.stroke: "#d97706"
}
n2: {
  value: "·"
  next
}
n3: {
  value: "·"
  next
}
n4: {
  value: "·"
  next: "null"
}
cost: |md
  **0 walking hops**

  **1 pointer update**

  `O(1)`
| {style.fill: "#dcfce7"; style.stroke: "#16a34a"}
h -> n1.value
n1.next -> n2.value
n2.next -> n3.value
n3.next -> n4.value
n1.value -> cost: "" {style.stroke-dash: 3}
```

<p align="center"><strong>Best case — <code>X = 0</code>, victim is the head. No traversal; constant time.</strong></p>

### Worst case

On the other hand, the worst case occurs when `X` is one less than the size of the list. In this case, the function must delete the last node of the list. This process takes linear time proportional to the length of the linked list, i.e., **O(N)**.

```d2
direction: right
h: head {shape: oval}
n1: {
  value: "·"
  next
}
n2: {
  value: "·"
  next
}
n3: {
  value: "·"
  next
}
n4: {
  value: "X=n−1 (victim — tail)"
  next: "null"
  style.fill: "#fde68a"
  style.stroke: "#d97706"
}
cost: |md
  **n−1 walking hops**

  **1 pointer update**

  `O(n)`
| {style.fill: "#fee2e2"; style.stroke: "#dc2626"}
h -> n1.value
n1.next -> n2.value
n2.next -> n3.value
n3.next -> n4.value
n4.value -> cost: "" {style.stroke-dash: 3}
```

<p align="center"><strong>Worst case — <code>X = n − 1</code>, victim is the tail. Full walk to reach its predecessor. Linear time.</strong></p>

The function's space complexity is constant, as it only creates a few variables that take up a fixed amount of space regardless of the size of the linked list.

> **Best Case** - When X = 0
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case** - When X = length of the list - 1
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Delete node at given distance

## Problem Statement

Given the **head** of a singly linked list and distance **X**, write a function to delete the node at a distance **X** from the start of the linked list and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\], X = 1
> -   **Output:** \[5, 3, 10\]

## Solution

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int val) : val(val), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    ListNode *deleteNodeAtGivenDistance(ListNode *head, int X) {

        // If the head is nullptr (empty list), return nullptr
        if (head == nullptr) {
            return nullptr;
        }

        // If X is 0, delete the head node
        if (X == 0) {
            ListNode *nodeToBeDeleted = head;

            // Update the head to the next node
            head = head->next;

            // Delete the original head node
            delete nodeToBeDeleted;

            // Return the updated head
            return head;
        }

        int counter = 0;
        ListNode *current = head;

        // Traverse to the node at position X - 1
        while (current != nullptr && counter < X - 1) {

            // Move to the next node
            current = current->next;

            // Increment the counter
            counter++;
        }

        // If the node at position X - 1 is null or the next node is
        // null, return the head
        if (current == nullptr || current->next == nullptr) {
            return head;
        }

        // Store the node to be deleted
        ListNode *nodeToBeDeleted = current->next;

        // Update the next pointer of current node
        current->next = current->next->next;

        // Delete the node at position X
        delete nodeToBeDeleted;

        // Return the head
        return head;
    }
};
```

***

## Final Takeaway

Seven deletion variants, one predecessor-hunt pattern:

| Variant | Hunt cost | Splice cost | Total |
|---|---|---|---|
| First node | 0 hops (head is given) | O(1) | **O(1)** |
| Last node | n−1 hops (walk to find predecessor) | O(1) | **O(n)** |
| By given data | 0 to n hops (first match) | O(1) | **O(n) worst** |
| After given node | 0 hops (given is the predecessor) | O(1) | **O(1)** |
| Before given node | 0 to n hops (find predecessor of given) | O(1) | **O(n) worst** |
| The given node itself | 0 to n hops (find predecessor of given) | O(1) | **O(n) worst** |
| At distance X | X hops | O(1) | **O(X)** |

Every row splices with the same two lines — `prev.next = victim.next; free(victim)`. The cost is always in the *hunt*, never in the *splice*. Two insights to internalise:

1. **Predecessor is the currency.** A singly linked list node cannot look backward. Every deletion problem is ultimately a "find the predecessor" problem, and the predecessor's location determines the cost.
2. **`prev` + `current` walk is the workhorse.** Keeping two pointers, one step apart, is the canonical pattern. When `current` meets the victim, `prev` is already pointing at it — ready for the splice.

This is why doubly linked lists feel magical: every node already has a `prev` pointer, so predecessor lookup drops to O(1) everywhere. For the cost of one extra pointer per node, every deletion in this lesson becomes constant time.

> **Transfer Challenge:** Your list has 1 million nodes and you receive a sequence of 1 million `delete-by-value` operations. Naïve per-call cost is O(n); total is O(n²) = 10¹² operations. Can you preprocess the list once to bring the total to O(n) or better?
>
> <details><summary><strong>Answer</strong></summary>
>
> Yes — use a hash map. One O(n) pass builds `value → (node, predecessor)` entries. Each subsequent deletion is now O(1): look up the pair, splice, update the map. Total: O(n) preprocess + O(n) deletes = **O(n)**. The catch: when you splice out a node, update the map entry for its successor (its predecessor just changed) — still O(1) per op.
>
> </details>
