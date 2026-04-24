# 8. Pattern: Reorder

## Table of contents

1. [Understanding the reorder pattern](#understanding-the-reorder-pattern)
2. [Identifying the reorder pattern](#identifying-the-reorder-pattern)
3. [Relocate node](#relocate-node)
4. [Parity order](#parity-order)
5. [Value partition](#value-partition)
6. [Shuffle list](#shuffle-list)

***

# Understanding the reorder pattern

Some linked list problems require us to reorder the nodes of the given list in place based on some conditions. In most cases, this requires first splitting the list based on the outcome of some function `f1` and then merging back the split list together either by using another function `f2` or simply concatenating them. These are generally **medium** difficulty problems that require either the split or merge technique we learned earlier or both. Many such problems may also require using other techniques, such as the reversal or fast and slow pointer technique.

// Diagram: The reorder pattern is a classification of problems that require reordering the nodes of a linked list in place

// Diagram: Reordering nodes in a linked list is a combination of splitting and merging.

## Reordering technique

Consider that we are given a doubly linked list whose nodes must be reordered. The problem almost always has a split function `f1`, that we use to split the list into multiple lists using the split technique. The split technique for a doubly linked list is exactly the same as for a singly linked list, with only one extra step to connect the `prev` section of nodes as we move them.

Consider the example execution below, where we use the function `f1` to split the list into two lists such that nodes with odd indices go to one list and those with even indices go to the other list.

// Diagram: Split the list in two using function f1

In most cases, concatenating these split lists to merge them is sufficient, but sometimes, we may also have a function `f2` that must be used to merge the lists. We use the merge technique to merge them to solve the problem. The merge technique for a doubly linked list is exactly the same as for a singly linked list, with only one extra step to connect the `prev` section of nodes as we move them.

Consider the example execution below, where we use the function `f2` that merges alternate nodes to merge back the split lists starting with the second list, effectively reordering the nodes.

// Diagram: Merge split lists using function f2

The reordering technique is simply a combination of the split and merge techniques used in tandem to reorder nodes in the given list.

## Algorithm

The algorithm given below summarizes the reorder technique for **two** lists. It can be easily extended for `k` lists.

> **Algorithm**
>
> -   **Step 1:** Use the split technique to split the list in **two** using the function \`f1\`
> -   **Step 2:** Use the merge technique to merge the **two** lists using the function \`f2\`.
> -   **Step 3:** Return the head of the merged list.

## Implementation

Given below is the generic code implementation to split a list in **two** using the function `f1` and then merge them using the function `f2`. The implementation is the same as for a singly linked list, with only one extra step in each section to connect the `prev` section of nodes as we move them.

C++

```cpp

/**
 * Definition for doubly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *prev;
 *     ListNode *next;
 *     ListNode() : val(0), prev(nullptr), next(nullptr) {}
 *     ListNode(int val) : val(val), prev(nullptr), next(nullptr) {}
 * };
 */

ListNode* reorderNodes(ListNode* head) {
    // Create dummy nodes and tail references
    // for the two split lists
    ListNode *dummyA = new ListNode(0);
    ListNode *tailA = dummyA;

    ListNode *dummyB = new ListNode(0);
    ListNode *tailB = dummyB;

    // Create current reference to iterate through the list
    ListNode* current = head;

    while (current != nullptr) {
        // Use the function `f1` to decide which list this node should go to
        bool splitFirst = f1(current);

        if (splitFirst) {
            // `current` node goes to the first split list
            tailA->next = current;
            tailA = tailA->next; // Move tailA forward
        } else {
            // `current` node goes to the second split list
            tailB->next = current;
            tailB = tailB->next; // Move tailB forward
        }

        // Move to the next node in the original list
        current = current->next;
    }

    // Ensure the two split lists end properly
    tailA->next = nullptr;
    tailB->next = nullptr;

    // Move ahead dummy nodes of split lists to hold the real head
    ListNode* currentA = dummyA->next;
    ListNode* currentB = dummyB->next;

    // Delete dummy nodes to avoid memory leaks
    delete dummyA;
    delete dummyB;

    // Create dummy node and tail reference for the merged list
    ListNode *dummy = new ListNode(0);
    ListNode *tail = dummy;

    while (currentA != nullptr && currentB != nullptr) {
        // Use the function `f2` to determine which node to merge
        bool mergeA = f2(currentA, currentB);

        if (mergeA) {
            tail->next = currentA; // Merge node from currentA
            currentA = currentA->next; // Move currentA forward
        } else {
            tail->next = currentB; // Merge node from currentB
            currentB = currentB->next; // Move currentB forward
        }

        // Move tail forward to the merged node
        tail = tail->next;
    }

    // If currentA is not completely traversed, attach remaining nodes
    if (currentA != nullptr) {
        tail->next = currentA;
    }

    // If currentB is not completely traversed, attach remaining nodes
    if (currentB != nullptr) {
        tail->next = currentB;
    }

    // Capture the merged list's head
    ListNode* newHead = dummy->next;
    // Delete dummy node to avoid memory leaks
    delete dummy;

    return newHead;
}
```

Java

```java

/**
 * Definition for doubly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode prev;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

class ReorderNodes {
    // Function to reorder nodes based on conditions defined by f1 and f2
    public ListNode reorderNodes(ListNode head) {

        // Create dummy nodes and tail references for the two split lists
        ListNode dummyA = new ListNode(0);
        ListNode tailA = dummyA;

        ListNode dummyB = new ListNode(0);
        ListNode tailB = dummyB;

        // Create current reference to iterate through the list
        ListNode current = head;

        while (current != null) {
            // Use the function `f1` to decide which list this node should go to
            boolean splitFirst = f1(current);

            if (splitFirst) {
                // `current` node goes to the first split list
                tailA.next = current;
                current.prev = tailA;
                tailA = tailA.next; // Move tailA forward
            } else {
                // `current` node goes to the second split list
                tailB.next = current;
                current.prev = tailB;
                tailB = tailB.next; // Move tailB forward
            }

            // Move to the next node in the original list
            current = current.next;
        }

        // Ensure the two split lists end properly
        tailA.next = null;
        tailB.next = null;

        // Move ahead dummy nodes of split lists to hold the real head
        ListNode currentA = dummyA.next;
        ListNode currentB = dummyB.next;

        // Set prev pointer of head of both list to null
        if (currentA != null) currentA.prev = null;
        if (currentB != null) currentB.prev = null;

        // Create dummy node and tail reference for the merged list
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        while (currentA != null && currentB != null) {
            // Use the function `f2` to determine which node to merge
            boolean mergeA = f2(currentA, currentB);

            if (mergeA) {
                tail.next = currentA;     // Merge node from currentA
                currentA.prev = tail;     // Connect the prev section to tail
                currentA = currentA.next; // Move currentA forward
            } else {
                tail.next = currentB;     // Merge node from currentB
                currentB.prev = tail;     // Connect the prev section to tail
                currentB = currentB.next; // Move currentB forward
            }

            // Move tail forward to the merged node
            tail = tail.next;
        }

        // If currentA is not completely traversed, attach remaining nodes
        if (currentA != null) {
            tail.next = currentA;
            currentA.prev = tail;
        }

        // If currentB is not completely traversed, attach remaining nodes
        if (currentB != null) {
            tail.next = currentB;
            currentB.prev = tail;
        }

        // Capture the merged list's head
        ListNode newHead = dummy.next;
        if (newHead != null) newHead.prev = null;

        return newHead;
    }
```

Typescript

```typescript
/**
 * Definition for doubly-linked list.
 * class ListNode {
 *     val: number
 *     prev: ListNode | null
 *     next: ListNode | null
 *     constructor(
 *         val?: number,
 *         prev?: ListNode | null,
 *         next?: ListNode | null
 *     ) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.prev = (prev===undefined ? null : prev)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function f1(node: ListNode): boolean {
    // Implement your logic here
    return true; // Placeholder
}

function f2(nodeA: ListNode, nodeB: ListNode): boolean {
    // Implement your logic here
    return true; // Placeholder
}

function reorderNodes(head: ListNode | null): ListNode | null {
    // Create dummy nodes and tail references for the two split lists
    let dummyA: ListNode = new ListNode(0);
    let tailA: ListNode = dummyA;

    let dummyB: ListNode = new ListNode(0);
    let tailB: ListNode = dummyB;

    // Create current reference to iterate through the list
    let current: ListNode | null = head;

    while (current !== null) {
        // Use the function `f1` to decide which list this node should go to
        let splitFirst: boolean = f1(current);

        if (splitFirst) {
            // `current` node goes to the first split list
            tailA.next = current;
            current.prev = tailA;
            tailA = tailA.next; // Move tailA forward
        } else {
            // `current` node goes to the second split list
            tailB.next = current;
            current.prev = tailB;
            tailB = tailB.next; // Move tailB forward
        }

        // Move to the next node in the original list
        current = current.next;
    }

    // Ensure the two split lists end properly
    tailA.next = null;
    tailB.next = null;

    // Move ahead dummy nodes of split lists to hold the real head
    let currentA: ListNode | null = dummyA.next;
    let currentB: ListNode | null = dummyB.next;

    // Set prev pointer of head of both lists to null
    if (currentA) currentA.prev = null;
    if (currentB) currentB.prev = null;

    // Create dummy node and tail reference for the merged list
    let dummy: ListNode = new ListNode(0);
    let tail: ListNode = dummy;

    // Merge the two lists based on the logic from `f2`
    while (currentA !== null && currentB !== null) {
        let mergeA: boolean = f2(currentA, currentB);

        if (mergeA) {
            tail.next = currentA;     // Merge node from currentA
            currentA.prev = tail;     // Connect the prev section to tail
            currentA = currentA.next; // Move currentA forward
        } else {
            tail.next = currentB;     // Merge node from currentB
            currentB.prev = tail;     // Connect the prev section to tail
            currentB = currentB.next; // Move currentB forward
        }

        // Move tail forward to the merged node
        tail = tail.next!;
    }

    // If currentA is not completely traversed, attach remaining nodes
    if (currentA !== null) {
        tail.next = currentA;
        currentA.prev = tail;
    }

    // If currentB is not completely traversed, attach remaining nodes
    if (currentB !== null) {
        tail.next = currentB;
        currentB.prev = tail;
    }

    // Capture the merged list's head
    let newHead: ListNode | null = dummy.next;
    if (newHead) newHead.prev = null;

    return newHead;
}
```

Javascript

```javascript
/**
 * Definition for doubly-linked list.
 * function ListNode(val, prev, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.prev = (prev===undefined ? null : prev)
 *     this.next = (next===undefined ? null : next)
 * }
 */

function reorderNodes(head) {
    // Create dummy nodes and tail references for the two split lists
    let dummyA = new ListNode(0);
    let tailA = dummyA;

    let dummyB = new ListNode(0);
    let tailB = dummyB;

    // Create current reference to iterate through the list
    let current = head;

    while (current !== null) {
        // Use the function `f1` to decide which list this node should go to
        let splitFirst = f1(current);

        if (splitFirst) {
            // `current` node goes to the first split list
            tailA.next = current;
            current.prev = tailA;
            tailA = tailA.next; // Move tailA forward
        } else {
            // `current` node goes to the second split list
            tailB.next = current;
            current.prev = tailB;
            tailB = tailB.next; // Move tailB forward
        }

        // Move to the next node in the original list
        current = current.next;
    }

    // Ensure the two split lists end properly
    tailA.next = null;
    tailB.next = null;

    // Move ahead dummy nodes of split lists to hold the real head
    let currentA = dummyA.next;
    let currentB = dummyB.next;

    // Set prev pointer of head of both lists to null
    if (currentA) currentA.prev = null;
    if (currentB) currentB.prev = null;

    // Create dummy node and tail reference for the merged list
    let dummy = new ListNode(0);
    let tail = dummy;

    // Merge the two lists based on the logic from `f2`
    while (currentA !== null && currentB !== null) {
        let mergeA = f2(currentA, currentB);

        if (mergeA) {
            tail.next = currentA;     // Merge node from currentA
            currentA.prev = tail;     // Connect the prev section to tail
            currentA = currentA.next; // Move currentA forward
        } else {
            tail.next = currentB;     // Merge node from currentB
            currentB.prev = tail;     // Connect the prev section to tail
            currentB = currentB.next; // Move currentB forward
        }

        // Move tail forward to the merged node
        tail = tail.next;
    }

    // If currentA is not completely traversed, attach remaining nodes
    if (currentA !== null) {
        tail.next = currentA;
        currentA.prev = tail;
    }

    // If currentB is not completely traversed, attach remaining nodes
    if (currentB !== null) {
        tail.next = currentB;
        currentB.prev = tail;
    }

    // Capture the merged list's head
    let newHead = dummy.next;
    if (newHead) newHead.prev = null;

    return newHead;
}
```

Python

```python

"""
Definition for doubly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None
"""

def reorder_nodes(head: Optional[ListNode], f1, f2) -> Optional[ListNode]:
    # Create dummy nodes and tail references for the two split lists
    dummyA = ListNode(0)
    tailA = dummyA

    dummyB = ListNode(0)
    tailB = dummyB

    # Create current reference to iterate through the list
    current = head

    while current is not None:
        # Use the function `f1` to decide which list this node should go to
        split_first = f1(current)

        if split_first:
            # `current` node goes to the first split list
            tailA.next = current
            current.prev = tailA
            tailA = tailA.next  # Move tailA forward
        else:
            # `current` node goes to the second split list
            tailB.next = current
            current.prev = tailB
            tailB = tailB.next  # Move tailB forward

        # Move to the next node in the original list
        current = current.next

    # Ensure the two split lists end properly
    tailA.next = None
    tailB.next = None

    # Move ahead dummy nodes of split lists to hold the real head
    currentA = dummyA.next
    currentB = dummyB.next

    # Set prev pointer of head of both lists to None
    if currentA:
        currentA.prev = None
    if currentB:
        currentB.prev = None

    # Create dummy node and tail reference for the merged list
    dummy = ListNode(0)
    tail = dummy

    while currentA is not None and currentB is not None:
        # Use the function `f2` to determine which node to merge
        merge_A = f2(currentA, currentB)

        if merge_A:
            tail.next = currentA  # Merge node from currentA
            currentA.prev = tail  # Connect the prev section to tail
            currentA = currentA.next  # Move currentA forward
        else:
            tail.next = currentB  # Merge node from currentB
            currentB.prev = tail  # Connect the prev section to tail
            currentB = currentB.next  # Move currentB forward

        # Move tail forward to the merged node
        tail = tail.next

    # If currentA is not completely traversed, attach remaining nodes
    if currentA is not None:
        tail.next = currentA
        currentA.prev = tail

    # If currentB is not completely traversed, attach remaining nodes
    if currentB is not None:
        tail.next = currentB
        currentB.prev = tail

    # Capture the merged list's head
    new_head = dummy.next
    if new_head:
        new_head.prev = None

    return new_head
```

## Complexity Analysis

The runtime and space complexity for the reorder technique that splits the list into **two** lists is pretty easy to understand. We traverse the entire list to split it that has a linear **O(N)** runtime complexity. If we only need to concatenate the split lists to merge them, it takes constant **O(1)** time; otherwise, we may need to traverse both split lists completely in the worst case, which has a linear, total **O(N)** runtime complexity. We traverse the entire list to split it in any case, and so the runtime complexity in any case is **O(N)**.

When we reorder a list by splitting it into two, we only create two dummy nodes and update references, so the space complexity is constant, **O(1)**, in any case.

> **Best Case:**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**
>
> **Worst Case:**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Identifying the reorder pattern

The linked list problems that require reordering in place in the list are the only problems that can be solved using the reorder technique. These are generally **medium** problems where we split the list using some function and then merge them back together using another function. Many such problems also have smaller subproblems that require other techniques like reversal or fast and slow pointers to find the middle. If the problem statement or its solution follows the generic template below, it can be solved by applying the split list technique.

**Template:**

Given a linked list, reorder its nodes.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the reorder technique.

> **Problem statement:** Given a doubly linked list and a value \`x\`, reorder its nodes so all nodes greater than \`x\` come before the nodes greater than or equal to \`x\`, keeping the relative order between nodes in both parts the same.

### Reorder technique solution

We need to reorder the nodes in the given list, and this fits the generic template from the reorder pattern we learned earlier.

**Template:**

Given a linked list, reorder its nodes.

To reorder the nodes, we use the split technique to split the given linked list into two such that the first split list has all nodes with values greater than `x`, and the second split list has all the nodes with values less than or equal to `x`.  We create two dummy nodes `dummyA`,  `dummyB` and tail references `tailA` and `tailB` and initialize them with the respective dummy nodes. We initialize a `current` reference with the head of the list and iterate the list from start to end.

In each iteration, we compare the value of `current` node to `x` and append the node to the correct split list. We then move ahead and repeat the process for the next iteration until we have split the entire list into two.

// Diagram: Split the list into two lists

We don't need to use the merge technique to merge the lists, as we can concatenate them in this case. We use the tail and dummy references from the split technique to concatenate them by updating references.

// Diagram: Merge split lists by concatenating them

The implementation of the solution using the reorder technique is given as follows.

C++

```cpp
/**
 * Definition for doubly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *prev;
 *     ListNode *next;
 *     ListNode() : val(0), prev(nullptr), next(nullptr) {}
 *     ListNode(int val) : val(val), prev(nullptr), next(nullptr) {}
 * };
 */

// Diagram: using namespace std;

class Solution {
public:
    vector<ListNode *> splitListByValue(ListNode *head, int X) {

        // Create dummy nodes to initialize the heads of two separate
        // lists. List for nodes with values less than X.
        ListNode *lessDummy = new ListNode(0);
        ListNode *lessTail = lessDummy;

        // List for nodes with values greater than or equal to X.
        ListNode *greaterDummy = new ListNode(0);
        ListNode *greaterTail = greaterDummy;

        // Start traversing the original list from the head.
        ListNode *current = head;

        // Traverse and split nodes based on the value of X.
        while (current != nullptr) {

            // If the value of the current node is less than X, it should
            // be appended to the list for nodes < X.
            if (current->val < X) {

                // Append current node to list for nodes < X.
                lessTail->next = current;

                // Set the previous pointer of the current node to
                // lessTail
                current->prev = lessTail;

                // Move lessTail to the newly added node.
                lessTail = lessTail->next;
            }

            // Otherwise, the value of the current node is greater than
            // or equal to X, and it should be appended to the list for
            // nodes >= X.
            else {

                // Append current node to list for nodes >= X.
                greaterTail->next = current;

                // Set the previous pointer of the current node to
                // greaterTail
                current->prev = greaterTail;

                // Move greaterTail to the newly added node.
                greaterTail = greaterTail->next;
            }

            // Proceed to the next node in the original list.
            current = current->next;
        }

        // Terminate the odd list from the beginning and end
        if (lessDummy->next != nullptr) {
            lessDummy->next->prev = nullptr;
        }
        lessTail->next = nullptr;

        // Terminate the even list from the beginning and end
        if (greaterDummy->next != nullptr) {
            greaterDummy->next->prev = nullptr;
        }
        greaterTail->next = nullptr;

        // Return heads of both lists, excluding dummy nodes.
        return {lessDummy->next, greaterDummy->next};
    }

    ListNode *mergeLessAndGreaterLists(
        ListNode *lessHead,
        ListNode *greaterHead
    ) {

        // If the first list (lessHead) is empty, return greaterHead as
        // the concatenated list.
        if (lessHead == nullptr) {
            return greaterHead;
        }

        // If the second list (greaterHead) is empty, return lessHead as
        // the concatenated list.
        if (greaterHead == nullptr) {
            return lessHead;
        }

        // Find the end of the first list (lessHead) to append
        // greaterHead.
        ListNode *current = lessHead;
        while (current != nullptr && current->next != nullptr) {
            current = current->next;
        }

        // Append greaterHead to the end of lessHead.
        current->next = greaterHead;

        // Set the previous pointer of the greaterTail node to current
        greaterHead->prev = current;

        return lessHead;
    }

// Diagram: ListNode valuePartition(ListNode head, int X) {

        // Return the head if the list is empty or has only one node.
        if (head == nullptr || head->next == nullptr) {
            return head;
        }

        // Split the original list into two lists: nodes < X and nodes >=
        // X.
        vector<ListNode *> heads = splitListByValue(head, X);

        // Head of list with nodes < X.
        ListNode *lessHead = heads[0];

        // Head of list with nodes >= X.
        ListNode *greaterHead = heads[1];

        // Merge both lists and return the head of the combined list.
        return mergeLessAndGreaterLists(lessHead, greaterHead);
    }
};
```

Java

```java
import java.util.*;

/**
 * Definition for doubly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode prev;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

class Solution {
    public List<ListNode> splitListByValue(ListNode head, int X) {

        // Create dummy nodes to initialize the heads of two separate
        // lists. List for nodes with values less than X.
        ListNode lessDummy = new ListNode(0);
        ListNode lessTail = lessDummy;

        // List for nodes with values greater than or equal to X.
        ListNode greaterDummy = new ListNode(0);
        ListNode greaterTail = greaterDummy;

        // Start traversing the original list from the head.
        ListNode current = head;

        // Traverse and split nodes based on the value of X.
        while (current != null) {

            // If the value of the current node is less than X, it should
            // be appended to the list for nodes < X.
            if (current.val < X) {

                // Append current node to list for nodes < X.
                lessTail.next = current;

                // Set the previous pointer of the current node to
                // lessTail
                current.prev = lessTail;

                // Move lessTail to the newly added node.
                lessTail = lessTail.next;
            }

            // Otherwise, the value of the current node is greater than
            // or equal to X, and it should be appended to the list for
            // nodes >= X.
            else {

                // Append current node to list for nodes >= X.
                greaterTail.next = current;

                // Set the previous pointer of the current node to
                // greaterTail
                current.prev = greaterTail;

                // Move greaterTail to the newly added node.
                greaterTail = greaterTail.next;
            }

            // Proceed to the next node in the original list.
            current = current.next;
        }

        // Terminate the odd list from the beginning and end
        if (lessDummy.next != null) {
            lessDummy.next.prev = null;
        }
        lessTail.next = null;

        // Terminate the even list from the beginning and end
        if (greaterDummy.next != null) {
            greaterDummy.next.prev = null;
        }
        greaterTail.next = null;

        // Return heads of both lists, excluding dummy nodes.
        return Arrays.asList(lessDummy.next, greaterDummy.next);
    }

    public ListNode mergeLessAndGreaterLists(
        ListNode lessHead,
        ListNode greaterHead
    ) {

        // If the first list (lessHead) is empty, return greaterHead as
        // the concatenated list.
        if (lessHead == null) {
            return greaterHead;
        }

        // If the second list (greaterHead) is empty, return lessHead as
        // the concatenated list.
        if (greaterHead == null) {
            return lessHead;
        }

        // Find the end of the first list (lessHead) to append
        // greaterHead.
        ListNode current = lessHead;
        while (current != null && current.next != null) {
            current = current.next;
        }

        // Append greaterHead to the end of lessHead.
        current.next = greaterHead;

        // Set the previous pointer of the greaterTail node to current
        greaterHead.prev = current;

        return lessHead;
    }

// Diagram: public ListNode valuePartition(ListNode head, int X) {

        // Return the head if the list is empty or has only one node.
        if (head == null || head.next == null) {
            return head;
        }

        // Split the original list into two lists: nodes < X and nodes >=
        // X.
        List<ListNode> heads = splitListByValue(head, X);

        // Head of list with nodes < X.
        ListNode lessHead = heads.get(0);

        // Head of list with nodes >= X.
        ListNode greaterHead = heads.get(1);

        // Merge both lists and return the head of the combined list.
        return mergeLessAndGreaterLists(lessHead, greaterHead);
    }
```

Typescript

```typescript
/**
 * Definition for doubly-linked list.
 * class ListNode {
 *     val: number
 *     prev: ListNode | null
 *     next: ListNode | null
 *     constructor(
 *         val?: number,
 *         prev?: ListNode | null,
 *         next?: ListNode | null
 *     ) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.prev = (prev===undefined ? null : prev)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

export class Solution {
    splitListByValue(head: ListNode | null, X: number): ListNode[] {

        // Create dummy nodes to initialize the heads of two separate
        // lists. List for nodes with values less than X.
        let lessDummy = new ListNode(0);
        let lessTail = lessDummy;

        // List for nodes with values greater than or equal to X.
        let greaterDummy = new ListNode(0);
        let greaterTail = greaterDummy;

        // Start traversing the original list from the head.
        let current = head;

        // Traverse and split nodes based on the value of X.
        while (current !== null) {

            // If the value of the current node is less than X, it should
            // be appended to the list for nodes < X.
            if (current.val < X) {

                // Append current node to list for nodes < X.
                lessTail.next = current;

                // Set the previous pointer of the current node to
                // lessTail
                current.prev = lessTail;

                // Move lessTail to the newly added node.
                lessTail = lessTail.next;
            }

            // Otherwise, the value of the current node is greater than
            // or equal to X, and it should be appended to the list for
            // nodes >= X.
            else {

                // Append current node to list for nodes >= X.
                greaterTail.next = current;

                // Set the previous pointer of the current node to
                // greaterTail
                current.prev = greaterTail;

                // Move greaterTail to the newly added node.
                greaterTail = greaterTail.next;
            }

            // Proceed to the next node in the original list.
            current = current.next;
        }

        // Terminate the odd list from the beginning and end
        if (lessDummy.next != null) {
            lessDummy.next.prev = null;
        }
        lessTail.next = null;

        // Terminate the even list from the beginning and end
        if (greaterDummy.next != null) {
            greaterDummy.next.prev = null;
        }
        greaterTail.next = null;

        // Return heads of both lists, excluding dummy nodes.
        return [lessDummy.next, greaterDummy.next];
    }

    mergeLessAndGreaterLists(
        lessHead: ListNode | null,
        greaterHead: ListNode | null
    ): ListNode | null {

        // If the first list (lessHead) is empty, return greaterHead as
        // the concatenated list.
        if (lessHead === null) {
            return greaterHead;
        }

        // If the second list (greaterHead) is empty, return lessHead as
        // the concatenated list.
        if (greaterHead === null) {
            return lessHead;
        }

        // Find the end of the first list (lessHead) to append
        // greaterHead.
        let current = lessHead;
        while (current !== null && current.next !== null) {
            current = current.next;
        }

        // Append greaterHead to the end of lessHead.
        current.next = greaterHead;

        // Set the previous pointer of the greaterTail node to current
        greaterHead.prev = current;

        return lessHead;
    }

// Diagram: valuePartition(head: ListNode | null, X: number): ListNode | null {

        // Return the head if the list is empty or has only one node.
        if (head === null || head.next === null) {
            return head;
        }

        // Split the original list into two lists: nodes < X and nodes >=
        // X.
        let heads = this.splitListByValue(head, X);

        // Head of list with nodes < X.
        let lessHead = heads[0];

        // Head of list with nodes >= X.
        let greaterHead = heads[1];

        // Merge both lists and return the head of the combined list.
        return this.mergeLessAndGreaterLists(lessHead, greaterHead);
    }
```

Javascript

```javascript
/**
 * Definition for doubly-linked list.
 * function ListNode(val, prev, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.prev = (prev===undefined ? null : prev)
 *     this.next = (next===undefined ? null : next)
 * }
 */

export class Solution {
    splitListByValue(head, X) {

        // Create dummy nodes to initialize the heads of two separate
        // lists. List for nodes with values less than X.
        let lessDummy = new ListNode(0);
        let lessTail = lessDummy;

        // List for nodes with values greater than or equal to X.
        let greaterDummy = new ListNode(0);
        let greaterTail = greaterDummy;

        // Start traversing the original list from the head.
        let current = head;

        // Traverse and split nodes based on the value of X.
        while (current !== null) {

            // If the value of the current node is less than X, it should
            // be appended to the list for nodes < X.
            if (current.val < X) {

                // Append current node to list for nodes < X.
                lessTail.next = current;

                // Set the previous pointer of the current node to
                // lessTail
                current.prev = lessTail;

                // Move lessTail to the newly added node.
                lessTail = lessTail.next;
            }

            // Otherwise, the value of the current node is greater than
            // or equal to X, and it should be appended to the list for
            // nodes >= X.
            else {

                // Append current node to list for nodes >= X.
                greaterTail.next = current;

                // Set the previous pointer of the current node to
                // greaterTail
                current.prev = greaterTail;

                // Move greaterTail to the newly added node.
                greaterTail = greaterTail.next;
            }

            // Proceed to the next node in the original list.
            current = current.next;
        }

        // Terminate the odd list from the beginning and end
        if (lessDummy.next != null) {
            lessDummy.next.prev = null;
        }
        lessTail.next = null;

        // Terminate the even list from the beginning and end
        if (greaterDummy.next != null) {
            greaterDummy.next.prev = null;
        }
        greaterTail.next = null;

        // Return heads of both lists, excluding dummy nodes.
        return [lessDummy.next, greaterDummy.next];
    }

// Diagram: mergeLessAndGreaterLists(lessHead, greaterHead) {

        // If the first list (lessHead) is empty, return greaterHead as
        // the concatenated list.
        if (lessHead === null) {
            return greaterHead;
        }

        // If the second list (greaterHead) is empty, return lessHead as
        // the concatenated list.
        if (greaterHead === null) {
            return lessHead;
        }

        // Find the end of the first list (lessHead) to append
        // greaterHead.
        let current = lessHead;
        while (current !== null && current.next !== null) {
            current = current.next;
        }

        // Append greaterHead to the end of lessHead.
        current.next = greaterHead;

        // Set the previous pointer of the greaterTail node to current
        greaterHead.prev = current;

        return lessHead;
    }

// Diagram: valuePartition(head, X) {

        // Return the head if the list is empty or has only one node.
        if (head === null || head.next === null) {
            return head;
        }

        // Split the original list into two lists: nodes < X and nodes >=
        // X.
        const [lessHead, greaterHead] = this.splitListByValue(head, X);

        // Merge both lists and return the head of the combined list.
        return this.mergeLessAndGreaterLists(lessHead, greaterHead);
    }
```

Python

```python
"""
Definition for doubly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None
"""

// Diagram: from typing import Optional

class Solution:
    def split_list_by_value(
        self, head: Optional[ListNode], X: int
    ) -> list:

        # Create dummy nodes to initialize the heads of two separate lists.
        # List for nodes with values less than X.
        less_dummy = ListNode(0)
        less_tail = less_dummy

        # List for nodes with values greater than or equal to X.
        greater_dummy = ListNode(0)
        greater_tail = greater_dummy

        # Start traversing the original list from the head.
        current = head

        # Traverse and split nodes based on the value of X.
        while current:

            # If the value of the current node is less than X, it should
            # be appended to the list for nodes < X.
            if current.val < X:

                # Append current node to list for nodes < X.
                less_tail.next = current

                # Set the previous pointer of the current node to
                # less_tail
                current.prev = less_tail

                # Move less_tail to the newly added node.
                less_tail = less_tail.next

            # Otherwise, the value of the current node is greater than
            # or equal to X, and it should be appended to the list for
            # nodes >= X.
            else:

                # Append current node to list for nodes >= X.
                greater_tail.next = current

                # Set the previous pointer of the current node to
                # greater_tail
                current.prev = greater_tail

                # Move greater_tail to the newly added node.
                greater_tail = greater_tail.next

            # Proceed to the next node in the original list.
            current = current.next

        # Terminate the odd list from the beginning and end
        if less_dummy.next is not None:
            less_dummy.next.prev = None
        less_tail.next = None

        # Terminate the even list from the beginning and end
        if greater_dummy.next is not None:
            greater_dummy.next.prev = None
        greater_tail.next = None

        # Return heads of both lists, excluding dummy nodes.
        return [less_dummy.next, greater_dummy.next]

    def merge_less_and_greater_lists(
        self,
        less_head: Optional[ListNode],
        greater_head: Optional[ListNode],
    ) -> Optional[ListNode]:

        # If the first list (less_head) is empty, return greater_head as
        # the concatenated list.
        if less_head is None:
            return greater_head

        # If the second list (greater_head) is empty, return less_head as
        # the concatenated list.
        if greater_head is None:
            return less_head

        # Find the end of the first list (less_head) to append
        # greater_head.
        current = less_head
        while current and current.next:
            current = current.next

        # Append greater_head to the end of less_head.
        current.next = greater_head

        # Set the previous pointer of the greater_tail node to current
        greater_head.prev = current

// Diagram: return lesshead

    def value_partition(
        self, head: Optional[ListNode], X: int
    ) -> Optional[ListNode]:

        # Return the head if the list is empty or has only one node.
        if head is None or head.next is None:
            return head

        # Split the original list into two lists: nodes < X and nodes >=
        # X.
        heads = self.split_list_by_value(head, X)

        # Head of list with nodes < X.
        less_head = heads[0]

        # Head of list with nodes >= X.
        greater_head = heads[1]

        # Merge both lists and return the head of the combined list.
        return self.merge_less_and_greater_lists(less_head, greater_head)
```

The above implementation uses the split list technique to split the list into two lists and merge them together by concatenating them.

## Example problems

Most problems that fall under this category are**medium**problems and can be solved by splitting and then contacting the split list. Sometimes, using the merge technique may be required for merging the split using some function, and often, other techniques like reversal or fast and slow pointer techniques may be needed to solve some subproblems. A list of a few problems is given below.

> -   **[Relocate node](https://www.codeintuition.io/courses/doubly-linked-list/Iyg36jeWViatZO_Q2w3ge)**
> -   **[Parity order](https://www.codeintuition.io/courses/doubly-linked-list/jlvpNSWUKRJThq6HKI1_H)**
> -   **[Value partition](https://www.codeintuition.io/courses/doubly-linked-list/sKHcaBMvtdwBr48bD_7Ck)**
> -   **[Shuffle list](https://www.codeintuition.io/courses/doubly-linked-list/YNry5kVCX7k0WahSEcDUy)**

We will now solve these problems to understand the reorder technique better.

***

# Relocate node

## Problem Statement

Given the **head** of a doubly linked list, write a function to move the last node of the list to the start and return the head of the reordered list.

### Example 1

> -   **Input:** head = \[5, 7, 3, 10, 6, 8\]
> -   **Output:** \[8, 5, 7, 3, 10, 6\]
> -   **Explanation:** The last node with the value 8 is moved to the start of the list.

### Example 2

> -   **Input:** head = \[5, 7\]
> -   **Output:** \[7, 5\]
> -   **Explanation:** The last node with the value 7 is moved to the start of the list.

### Example 3

> -   **Input:** head = \[5\]
> -   **Output:** \[5\]
> -   **Explanation:** There is nothing to move as the list only has one node, which is both the first and the last node at the same time.

## Solution

```cpp
/**
 * Definition for doubly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *prev;
 *     ListNode *next;
 *     ListNode() : val(0), prev(nullptr), next(nullptr) {}
 *     ListNode(int val) : val(val), prev(nullptr), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    vector<ListNode *> splitLastNode(ListNode *head) {

        ListNode *current = head;
        ListNode *previous = nullptr;

        // Traverse the list until the last node is reached
        while (current->next != nullptr) {

            // Keep track of the previous node
            previous = current;

            // Move to the next node
            current = current->next;
        }

        // Disconnect the last node
        if (previous) {
            previous->next = nullptr;
        }

        // Update last node's prev pointer
        if (current) {
            current->prev = nullptr;
        }

        // Return {head of remaining list, last node}
        return {head, current};
    }

    ListNode *mergeLastNode(ListNode *lastNode, ListNode *firstNode) {

        // If there is no last node, return the first node
        if (!lastNode) {
            return firstNode;
        }

        // Connect the last node to the first node
        lastNode->next = firstNode;

        // Update the first node's prev pointer
        if (firstNode) {
            firstNode->prev = lastNode;
        }

        return lastNode;
    }

    ListNode *relocateNode(ListNode *head) {

        // If the list is empty or contains only one node, no need to
        // modify it
        if (!head || !head->next) {
            return head;
        }

        // Split the last node from the list
        vector<ListNode *> heads = splitLastNode(head);
        ListNode *firstNode = heads[0];
        ListNode *lastNode = heads[1];

        // Merge the last node at the front
        return mergeLastNode(lastNode, firstNode);
    }
};
```

***

# Parity order

## Problem Statement

Given the **head** of a doubly linked list, write a function to group all the nodes that appear on odd indices together, followed by the nodes that appear on even indices, and return the head of the reordered list.  

The indices start with `1`.

### Example 1

> -   **Input:** head = \[2, 1, 3, 4, 8\]
> -   **Output:** \[2, 3, 8, 1, 4\]
> -   **Explanation:** After grouping the nodes at odd indices followed by even indices, the list becomes \[2, 3, 8, 1, 4\].

### Example 2

> -   **Input:** head = \[\]
> -   **Output:** \[\]
> -   **Explanation:** Since the input list is empty, the output list will also be empty.

## Solution

```cpp
/**
 * Definition for doubly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *prev;
 *     ListNode *next;
 *     ListNode() : val(0), prev(nullptr), next(nullptr) {}
 *     ListNode(int val) : val(val), prev(nullptr), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    vector<ListNode *> splitByParity(ListNode *head) {

        // Initialize head and tail references for the two split lists
        ListNode *oddDummy = new ListNode(0);
        ListNode *oddTail = oddDummy;

        ListNode *evenDummy = new ListNode(0);
        ListNode *evenTail = evenDummy;

        // Create current reference to iterate through the list
        ListNode *current = head;

        // To track alternate positions
        int counter = 1;

        // Iterate through the list and split nodes into two lists
        while (current != nullptr) {

            // If the counter is odd then the node goes to the odd list
            if (counter % 2 == 1) {

                // `current` node goes to the odd split list
                oddTail->next = current;

                // Set the previous pointer of the current node to
                // oddTail
                current->prev = oddTail;

                // Move oddTail forward
                oddTail = oddTail->next;
            }

            // Otherwise, the node goes to the even list
            else {

                // `current` node goes to the even split list
                evenTail->next = current;

                // Set the previous pointer of the current node to
                // evenTail
                current->prev = evenTail;

                // Move evenTail forward
                evenTail = evenTail->next;
            }

            // Move to the next node in the original list
            current = current->next;
            counter++;
        }

        // Terminate the odd list from the beginning and end
        if (oddDummy->next != nullptr) {
            oddDummy->next->prev = nullptr;
        }
        oddTail->next = nullptr;

        // Terminate the odd list from the beginning and end
        if (evenDummy->next != nullptr) {
            evenDummy->next->prev = nullptr;
        }
        evenTail->next = nullptr;

        return {oddDummy->next, evenDummy->next};
    }

    ListNode *mergeOddAndEvenLists(
        ListNode *oddHead,
        ListNode *evenHead
    ) {

        // If the odd list is empty return the even list
        if (oddHead == nullptr) {
            return evenHead;
        }

        // If the even list is empty return the odd list
        if (evenHead == nullptr) {
            return evenHead;
        }

        // Traverse to the end of the odd list
        ListNode *current = oddHead;
        while (current != nullptr && current->next != nullptr) {
            current = current->next;
        }

        // Connect the even list at the end of the odd list
        current->next = evenHead;

        // Set the previous pointer of the evenHead node to current
        evenHead->prev = current;

        return oddHead;
    }

    ListNode *parityOrder(ListNode *head) {

        // If the list is empty or contains only one node, no splitting
        // is necessary
        if (head == nullptr || head->next == nullptr) {
            return head;
        }

        // Split the list odd and even lists
        vector<ListNode *> heads = splitByParity(head);
        ListNode *oddHead = heads[0];
        ListNode *evenHead = heads[1];

        // Append the  even list at the end of the odd list and
        // return the head of the merged list
        return mergeOddAndEvenLists(oddHead, evenHead);
    }
};
```

***

# Parity order

***

# Value partition

## Problem Statement

Given the **head** of a doubly linked list and a value **X**, write a function to partition the list such that all nodes less than X come before nodes greater than or equal to X and return the head of the reordered list. The original relative order of the nodes in each of the two partitions should be preserved.

### Example 1

> -   **Input:** head = \[1, 4, 3, 2, 5, 2\], X = 3
> -   **Output:** \[1, 2, 2, 4, 3, 5\]
> -   **Explanation:** Nodes with values 1, 2, and 2 are less than 3. Therefore, they will be placed before the nodes with values greater than or equal to 3.

### Example 2

> -   **Input:** head = \[2, 1\], X = 2
> -   **Output:** \[1, 2\]
> -   **Explanation:** Node with value 1 is less than 2. Therefore, it will be placed before the nodes with values greater than or equal to 2.

## Solution

```cpp
/**
 * Definition for doubly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *prev;
 *     ListNode *next;
 *     ListNode() : val(0), prev(nullptr), next(nullptr) {}
 *     ListNode(int val) : val(val), prev(nullptr), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    vector<ListNode *> splitListByValue(ListNode *head, int X) {

        // Create dummy nodes to initialize the heads of two separate
        // lists. List for nodes with values less than X.
        ListNode *lessDummy = new ListNode(0);
        ListNode *lessTail = lessDummy;

        // List for nodes with values greater than or equal to X.
        ListNode *greaterDummy = new ListNode(0);
        ListNode *greaterTail = greaterDummy;

        // Start traversing the original list from the head.
        ListNode *current = head;

        // Traverse and split nodes based on the value of X.
        while (current != nullptr) {

            // If the value of the current node is less than X, it should
            // be appended to the list for nodes < X.
            if (current->val < X) {

                // Append current node to list for nodes < X.
                lessTail->next = current;

                // Set the previous pointer of the current node to
                // lessTail
                current->prev = lessTail;

                // Move lessTail to the newly added node.
                lessTail = lessTail->next;
            }

            // Otherwise, the value of the current node is greater than
            // or equal to X, and it should be appended to the list for
            // nodes >= X.
            else {

                // Append current node to list for nodes >= X.
                greaterTail->next = current;

                // Set the previous pointer of the current node to
                // greaterTail
                current->prev = greaterTail;

                // Move greaterTail to the newly added node.
                greaterTail = greaterTail->next;
            }

            // Proceed to the next node in the original list.
            current = current->next;
        }

        // Terminate the odd list from the beginning and end
        if (lessDummy->next != nullptr) {
            lessDummy->next->prev = nullptr;
        }
        lessTail->next = nullptr;

        // Terminate the even list from the beginning and end
        if (greaterDummy->next != nullptr) {
            greaterDummy->next->prev = nullptr;
        }
        greaterTail->next = nullptr;

        // Return heads of both lists, excluding dummy nodes.
        return {lessDummy->next, greaterDummy->next};
    }

    ListNode *mergeLessAndGreaterLists(
        ListNode *lessHead,
        ListNode *greaterHead
    ) {

        // If the first list (lessHead) is empty, return greaterHead as
        // the concatenated list.
        if (lessHead == nullptr) {
            return greaterHead;
        }

        // If the second list (greaterHead) is empty, return lessHead as
        // the concatenated list.
        if (greaterHead == nullptr) {
            return lessHead;
        }

        // Find the end of the first list (lessHead) to append
        // greaterHead.
        ListNode *current = lessHead;
        while (current != nullptr && current->next != nullptr) {
            current = current->next;
        }

        // Append greaterHead to the end of lessHead.
        current->next = greaterHead;

        // Set the previous pointer of the greaterTail node to current
        greaterHead->prev = current;

        return lessHead;
    }

    ListNode *valuePartition(ListNode *head, int X) {

        // Return the head if the list is empty or has only one node.
        if (head == nullptr || head->next == nullptr) {
            return head;
        }

        // Split the original list into two lists: nodes < X and nodes >=
        // X.
        vector<ListNode *> heads = splitListByValue(head, X);

        // Head of list with nodes < X.
        ListNode *lessHead = heads[0];

        // Head of list with nodes >= X.
        ListNode *greaterHead = heads[1];

        // Merge both lists and return the head of the combined list.
        return mergeLessAndGreaterLists(lessHead, greaterHead);
    }
};
```

***

# Shuffle list

## Problem Statement

Given the **head** of a doubly linked list that can be represented as **L0 -> L1 -> … -> Ln - 1 -> Ln**. Reorder the list **in place** to match the following format: 

**L0 -> Ln -> L1 -> Ln - 1 -> L2 -> Ln - 2 -> …**

### Example 1

> -   **Input:** head = \[1, 2, 3, 4\]
> -   **Output:** \[1, 4, 2, 3\]
> -   **Explanation:** After reordering, the list becomes \[1, 4, 2, 3\].

### Example 2

> -   **Input:** head = \[1, 2, 3, 4, 5\]
> -   **Output:** \[1, 5, 2, 4, 3\]
> -   **Explanation:** After reordering, the list becomes \[1, 5, 2, 4, 3\].

## Solution

```cpp
/**
 * Definition for doubly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *prev;
 *     ListNode *next;
 *     ListNode() : val(0), prev(nullptr), next(nullptr) {}
 *     ListNode(int val) : val(val), prev(nullptr), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    ListNode *reverse(ListNode *head) {
        ListNode *current = head;
        ListNode *previous = nullptr;

        while (current != nullptr) {
            ListNode *next = current->next;
            swap(current->prev, current->next);
            previous = current;
            current = next;
        }

        return previous;
    }

    vector<ListNode *> splitListInHalf(ListNode *head) {

        // Initialize slow and fast pointers to find the middle of the
        // list
        ListNode *slow = head, *fast = head;

        // Move slow by one and fast by two nodes until fast reaches the
        // end
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
        }

        ListNode *secondHalf;

        // Split for even length list
        if (fast == nullptr) {
            secondHalf = slow;
            slow->prev->next = nullptr;
            slow->prev = nullptr;
        }

        // Split for odd length list
        else {
            secondHalf = slow->next;
            slow->next->prev = nullptr;
            slow->next = nullptr;
        }

        return {head, secondHalf};
    }

    ListNode *mergeAlternateNodes(
        ListNode *firstHalf,
        ListNode *secondHalf
    ) {

        // Create a dummy node to form the merged list
        ListNode *dummy = new ListNode(0);
        ListNode *tail = dummy;

        // Boolean to switch between nodes from each list
        int mergeFirst = true;

        // Alternate between the nodes of each list
        while (firstHalf != nullptr && secondHalf != nullptr) {
            if (mergeFirst) {
                tail->next = firstHalf;
                firstHalf->prev = tail;
                firstHalf = firstHalf->next;
                tail = tail->next;
            } else {
                tail->next = secondHalf;
                secondHalf->prev = tail;
                secondHalf = secondHalf->next;
                tail = tail->next;
            }

            mergeFirst = !mergeFirst;
        }

        // Append any remaining nodes from firstHalf or secondHalf
        if (firstHalf != nullptr) {
            tail->next = firstHalf;
            firstHalf->prev = tail;
        } else if (secondHalf != nullptr) {
            tail->next = secondHalf;
            secondHalf->prev = tail;
        }

        // Disconnect the dummy node from the merged list
        dummy->next->prev = nullptr;
        return dummy->next;
    }

    void shuffleList(ListNode *head) {

        // No need to reorder if the list is empty or has only one
        // element
        if (head == nullptr || head->next == nullptr) {
            return;
        }

        // Split the list in two halves
        vector<ListNode *> heads = splitListInHalf(head);
        ListNode *firstHalf = heads[0];
        ListNode *secondHalf = heads[1];

        // Reverse the second half of the list
        ListNode *reversedSecondHalf = reverse(secondHalf);

        // Alternatively merge the first list and the reversed second
        // list
        mergeAlternateNodes(firstHalf, reversedSecondHalf);
    }
};
```

***

# Shuffle list
