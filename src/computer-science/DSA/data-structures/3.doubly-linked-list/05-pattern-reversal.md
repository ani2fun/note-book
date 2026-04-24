# 5. Pattern: Reversal

## Table of contents

1. [Understanding the reversal pattern](#understanding-the-reversal-pattern)
2. [Identifying direct aplication](#identifying-direct-application)
3. [Reverse a list](#reverse-a-list)
4. [Reverse first K nodes](#reverse-first-k-nodes)
5. [Reverse last K nodes](#reverse-last-k-nodes)
6. [Reverse the given segment](#reverse-the-given-segment)

***

# Understanding the reversal pattern

Many doubly linked list problems require us to reverse the entire list or a part of it. For some problems, we may have to perform a reversal many times along with other more complex operations. While we can reverse the list using loops in multiple passes, it is not the best way to do it, as the code is complicated and error-prone. Just like the singly linked list, the most concise and efficient way to reverse a doubly linked list is to use a single-pass in-place reversal algorithm, which is a very simple four-line algorithm.

The reversal pattern is a classification of linked list problems that can be solved using the linked list reversal algorithm.

// Diagram: Reverse the segment of doubly inked list between start and end.

In this course, we will learn more about the linked list reversal algorithm and how to identify a problem as a reversal pattern problem.

## Reversing the entire list

Reversing the entire linked list is a special case of the generic reversal algorithm to reverse a segment between`start`and`end`. We first look at this special case as it has a much simpler implementation and is used in most linked list problems that require a reversal. Consider we are given a doubly linked list denoted by`head`and need to reverse it completely.

// Diagram: Reverse the entire list.

We initialize a reference two references `newHead` and`current` and with `null` and the`head`of the list respectively and traverse the list from head to tail using`current`. In each iteration, we swap the and `prev` section of the `current` node and move it forward by one step. We save the reference of the tail node in `newHead` when we reach it as it will be the head of the reversed list. At the end of all iterations, the entire list will be reversed and `newHead` will be the head of the reversed list.

// Diagram: Reverse the entire linked list

## Algorithm

The algorithm below summarizes the reversal of the entire doubly linked list in-place.

> **Algorithm**
>
> -   **Step 1:** Initialize \`newHead\` with \`null\` and \`current\` with \`head\`.
> -   **Step 2:** Iterate until \`current\` hits \`null\` and in each iteration do the following
>     -   **Step 2.1:** Swap \`current.next\` and \`current.prev\`
>     -   **Step 2.2:** Set \`newHead\` to \`current\` if \`current.next\` is \`null\`
>     -   **Step 2.3:** Set \`current\` to \`current.prev\` to move to next node
> -   **Step 3:** Return \`newHead\`

## Implementation

The code implementation to reverse the entire list is given below.

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

void reverse(ListNode *start, ListNode *end)
{
    // If the start and end nodes are the same, no reversal needed
    if (start == end)
    {
        return;
    }

    // Initialize leftBound and rightBound
    ListNode *leftBound = start->prev; // start can never be null
    ListNode *rightBound = end->next // end can never be null

    // Initialize current
    ListNode *current = start;

    // 1. Swap next and prev sections of nodes
    while (current != rightBound)
    {
        // Save the previous node
        swap(current->prev, current->next);
        current = current->prev;
    }

// Diagram: // 2. Update boundary nodes

    // Correctly connect new tail of the segment to parent list
    start->next = rightBound;
    if (rightBound) {
        rightBound->prev = start;
    }

    // Correctly connect new head of the segment to parent list
    end->prev = leftBound;
    if (leftBound) {
        leftBound->next = end;
    }
    return;
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

// Diagram: public class Reverse {

    public ListNode reverse(ListNode head) {
        // If the head is null or if it's the only node in the list, return the head as it is
        if (head == null || (head.next == null)) {
            return head;
        }

        // Reference to track the current node
        ListNode current = head;
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

function reverse(head: ListNode | null): ListNode | null {
    // If the head is null or if it's the only node in the list, return the head as it is
    if (!head || (!head.next)) {
        return head;
    }

    // Reference to track the current node
    let current: ListNode | null = head;

    // Reference to hold the new head of the reversed list
    let newHead: ListNode | null = null;

    while (current !== null) {
        // Swap the previous and next pointers
        let temp: ListNode | null = current.prev;
        current.prev = current.next;
        current.next = temp;

        // Move the current reference to the next node (which is now the previous node)
        if (current.prev === null) {
            // If the previous node is now null, the current node is the new head
            newHead = current;
        }

        current = current.prev; // Move to the next node (previously "next")
    }

    // Return the new head, which was the last node in the original list
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

function reverse(head) {
    // If the head is null or if it's the only node in the list, return the head as it is
    if (!head || (!head.next)) {
        return head;
    }

    // Reference to track the current node
    let current = head;

    // Reference to hold the new head of the reversed list
    let newHead = null;

    while (current !== null) {
        // Swap the previous and next pointers
        let temp = current.prev;
        current.prev = current.next;
        current.next = temp;

        // Move the current reference to the next node (which is now the previous node)
        if (current.prev === null) {
            // If the previous node is now null, the current node is the new head
            newHead = current;
        }

        current = current.prev; // Move to the next node (previously "next")
    }

    // Return the new head, which was the last node in the original list
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

def reverse_a_linked_list(head: Optional[ListNode]) -> Optional[ListNode]:
    # If the head is null or if it's the only node in the list, return the head as it is
    if not head or (not head.next):
        return head

    # Reference to track the current node
    current = head

    # Reference to hold the reversed head
    new_head = None

    while current is not None:
        # Swap the previous and next pointers of the current node
        current.prev, current.next = current.next, current.prev

        # Move the current reference to the next node, which is now the previous node
        if current.prev is None:
            new_head = current

// Diagram: current = current.prev

    # Return the new head, which was the last node in the original list
    return new_head
```

## Complexity Analysis

We only traverse the linked list between the `start` and `end` to reverse the segment. In the worst case `start` and `end` maybe the beginning and the end of the list, so we will have to traverse the entire list, which takes linear **O(N)** time. In the best case, however, `start` and `end` maybe the same node, and we won't traverse at all, leading to constant **O(1)** time.

Since we only create a few temporary variables and no new data structures while reversing the list, the space complexity is constant **O(1)** in any case.

> **Best Case** - start and end are the same node.
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case** - start and end are the head and tail of the list.
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

## Reversing a segment

Reversing a segment between two nodes is the generic case of the reversal algorithm. Consider we are given a doubly linked list and references of two nodes `start` and `end` and we need to reverse the segment (including `start` and `end`).

For this example, the two references can never be `null` and will always point to some node in the list such that `start` comes before `end` when traversing the list in the forward direction from `head`.

// Diagram: Reverse the linked list between start and end.

We create two references `leftBound` and `rightBound` and initialize them with the node before `start` and after `end` respectively. As we will see later, these references will be used to correctly connect the ends of the reversed segment back to the parent list.

// Diagram: Iniitalize two references leftBound and rightBound to simplify implementation.

The reversal algorithm can be broken down into two steps as given below.

### 1\. Swap next and prev sections of nodes

We initialize a `current` reference with `start` and traverse the list until we hit `rightBound`. In each iteration, we swap the and `prev` section of the `current` node. 

// Diagram: Reverse the linked list between start and end

### 2\. Connect the reversed segment to the parent list

At the end of all iterations, the segment between `start` and `end` will be reversed, but its connection with the parent list will be incorrect.  The resulting list after all iterations is given below. We will have to connect `leftBound` with `end` (the start of the reversed list and `rightBound` with `start` (the end of the reversed list). 

// Diagram: The reversed segment is incorrectly connected to the parent list.

We then set the section of `start` to  `rightBOund` and the `prev` section of the `rightBound` node to `start` to connect the tail of the reversed segment correctly with the parent list.

// Diagram: Connect the tail of reversed segment with parent list

Similarly, we set the section of the `leftBound` node to `end` and the `prev` section of `end` to  `leftBound` to connect the head of the reversed segment correctly with the parent list.

// Diagram: Connect the head of reversed segment with parent list

## Algorithm

The algorithm given below summarizes the doubly linked list reversal algorithm.

> **Algorithm**
>
> -   **Step 1:** Check if the segment has less than two nodes. In that case, the reversed segment is the same as the original.
> -   **Step 2:** Initialize \`leftBound\` and \`rightBound\` with the node before \`start\` and after \`end\` respectively after doing null checks.
> -   **Step 3:** Initialize \`current\` with \`start\` and iterate until \`current\` hits \`rightBound\` and in each iteration do the following
>     -   **Step 3.1:** Swap \`current.next\` and \`current.prev\`
>     -   **Step 3.2:** Set \`current\` to \`current.prev\` to move to next node
> -   **Step 4:** Connect the tail of the reversed segment to \`rigthBound\` but setting \`start.next\` to \`rightBound\` and \`rightBound.prev\` to \`start\` after doing null checks.
> -   **Step 5:** Connect the head of the reversed segment to \`leftBound\` but setting \`leftBound.next\` to \`end\` and \`end.prev\` to \`leftBound\` after doing null checks.

## Implementation

Given below is the code implementation to reverse a linked list between `start` and `end`.

C++

```cpp

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

// Diagram: public class Reverse {

    public ListNode reverse(ListNode head) {
        // If the head is null or if it's the only node in the list, return the head as it is
        if (head == null || (head.next == null)) {
            return head;
        }

        // Reference to track the current node
        ListNode current = head;

        // Reference to hold the reversed head
        ListNode newHead = null;

        while (current != null) {
            // Swap the previous and next pointers
            ListNode temp = current.prev;
            current.prev = current.next;
            current.next = temp;

            // If the previous node is now null, the current node is the new head
            if (current.prev == null) {
                newHead = current;
            }

            // Move the current reference to the next node, which is now the previous node
            current = current.prev;
        }

        // Return the new head, which was the last node in the original list
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

// Diagram: class ReverseALinkedList {

        public void reverse(ListNode start, ListNode end) {
        // If the start and end nodes are the same, no reversal needed
        if (start == end) {
            return;
        }

        // Initialize leftBound and rightBound
        ListNode leftBound = start.prev; // start can never be null
        ListNode rightBound = end.next // end can never be null
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

function reverse(start: ListNode | null, end: ListNode | null): void {
    // If the start and end nodes are the same, no reversal needed
    if (start === end) {
        return;
    }

    // Initialize leftBound and rightBound
    let leftBound: ListNode | null = start.prev; // start can never be null
    let rightBound: ListNode | null = end.next // end can never be null

    // Initialize current
    let current: ListNode | null = start;

    // 1. Swap next and prev sections of nodes until reaching the rightBound
    while (current !== rightBound) {
        // Swap the prev and next pointers
        let temp: ListNode | null = current?.prev || null;
        current.prev = current.next;
        current.next = temp;

        // Move current to the next node, which is now stored in prev
        current = current.prev;
    }

// Diagram: // 2. Update boundary nodes

    // Correctly connect the new tail of the segment (start) to the parent list
    if (start) {
        start.next = rightBound;
    }
    if (rightBound) {
        rightBound.prev = start;
    }

    // Correctly connect the new head of the segment (end) to the parent list
    end.prev = leftBound;
    if (leftBound) {
        leftBound.next = end;
    }

    return;
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

function reverse(start, end) {
    // If the start and end nodes are the same, no reversal needed
    if (start === end) {
        return;
    }

    // Initialize leftBound and rightBound
    let leftBound = start.prev; // start can never be null
    let rightBound = end.next // end can never be null

    // Initialize current
    let current = start;

    // 1. Swap next and prev sections of nodes until reaching the rightBound
    while (current !== rightBound) {
        // Swap the prev and next pointers
        let temp = current?.prev || null;
        current.prev = current.next;
        current.next = temp;

        // Move current to the next node, which is now stored in prev
        current = current.prev;
    }

// Diagram: // 2. Update boundary nodes

    // Correctly connect the new tail of the segment (start) to the parent list
    if (start) {
        start.next = rightBound;
    }
    if (rightBound) {
        rightBound.prev = start;
    }

    // Correctly connect the new head of the segment (end) to the parent list
    end.prev = leftBound;
    if (leftBound) {
        leftBound.next = end;
    }

    return;
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

def reverse(start: Optional[ListNode], end: Optional[ListNode]) -> None:
    # If the start and end nodes are the same, no reversal needed
    if start == end:
        return

    # Initialize leftBound and rightBound
    left_bound = start.prev # start can never be null
    right_bound = end.next  # end can never be null

    # Initialize current pointer
    current = start

    # 1. Swap next and prev pointers of nodes until the rightBound
    while current != right_bound:
        # Swap prev and next for the current node
        current.prev, current.next = current.next, current.prev
        # Move to the previous node (which is now in the next pointer due to swap)
        current = current.prev

    # 2. Update boundary nodes

    # Correctly connect the new tail (start) of the reversed segment to the parent list
    start.next = right_bound
    if right_bound:
        right_bound.prev = start

    # Correctly connect the new head (end) of the reversed segment to the parent list
    end.prev = left_bound
    if left_bound:
        left_bound.next = end
```

## Complexity Analysis

We only traverse the linked list between the `start` and `end` to reverse the segment. In the worst case `start` and `end` maybe the beginning and the end of the list, so we will have to traverse the entire list, which takes linear **O(N)** time. In the best case, however, `start` and `end` maybe the same node, and we won't traverse at all, leading to constant **O(1)** time.

Since we only create a few temporary variables and no new data structures while reversing the list, the space complexity is constant **O(1)** in any case.

> **Best Case** - start and end are the same node.
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case** - start and end are the head and tail of the list.
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

## Applications

Many linked problems may be classified as reversal pattern problems. Some may be solved by directly applying the reversal algorithm, while others may comprise one or more subproblems that can be solved using the reversal algorithm. We further classify the reversal pattern problems as follows.

> -   Direct application
> -   Subproblems

Later in the course, we will examine techniques for identifying all categories of the reversal pattern problems.

***

# Identifying direct application

The linked list reversal algorithm can only be directly applied to specific problems that fall under the reversal pattern. These are generally **easy** problems where we must revere the entire list of a part of it to solve. If the problem statement or its solution follows the generic template below, it can be solved by using the linked list reversal algorithm directly.

**Template**: Given a doubly linked and two nodes `start` and `end`, reverse the linked list between these two nodes.

## Example

To better understand the problems that can be solved by directly applying the linked list reversal algorithm, let's consider the following problem and see how we can identify it as a direct application.

> **Problem statement:** Given a doubly linked list, reverse it in place

// Diagram: Reverse the given lined list in place.

### Linked list reversal algorithm

The problem description fits the template for the direct application of the reversal pattern we learned earlier.

**Template**:

Given a linked and two nodes `start` (`head`of the list) and `end` (tail of the list) reverse the linked list between these two nodes.

The complete reversal of a doubly linked list is a special case of the reversal algorithm that we learned earlier. We initialize a `current` pointer with the `head` of the list and traverse the list until we hit null. In each iteration, we swap the `prev` and sections of the `current` node. As we traverse, we store the reference of the tail node in a reference variable `newHead` as this will be the head of the reversed list, and return it when the traversal completes.

// Diagram: Reverse the entire linked list

The implementation of the reversal algorithm to reverse the entire list is given as follows.

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

ListNode *reverse(ListNode *head) {
    // If the head is null or if it's the only node in the list, return the head as it is
    if (!head || (!head->next)) {
        return head;
    }

    // Reference to track the current node
    ListNode *current = head;

    // Reference to hold the reversed head
    ListNode *newHead = nullptr;

    while (current != nullptr) {
        // Save the previous node
        swap(current->prev, current->next);
        // Move the current reference to the next node, which is now the previous node
        if (!current->prev)
            newHead = current;

        current = current->prev;
    }

    // Return the new head, which was the last node in the original list
    return newHead;
}
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

// Diagram: public class Reverse {

    public ListNode reverse(ListNode head) {
        // If the head is null or if it's the only node in the list, return the head as it is
        if (head == null || (head.next == null)) {
            return head;
        }

        // Reference to track the current node
        ListNode current = head;

        // Reference to hold the reversed head
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

function reverse(head: ListNode | null): ListNode | null {
    // If the head is null or if it's the only node in the list, return the head as it is
    if (!head || (!head.next)) {
        return head;
    }

    // Reference to track the current node
    let current: ListNode | null = head;

    // Reference to hold the new head of the reversed list
    let newHead: ListNode | null = null;

    while (current !== null) {
        // Swap the previous and next pointers
        let temp: ListNode | null = current.prev;
        current.prev = current.next;
        current.next = temp;

        // Move the current reference to the next node (which is now the previous node)
        if (current.prev === null) {
            // If the previous node is now null, the current node is the new head
            newHead = current;
        }

        current = current.prev; // Move to the next node (previously "next")
    }

    // Return the new head, which was the last node in the original list
    return newHead;
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

function reverse(head) {
    // If the head is null or if it's the only node in the list, return the head as it is
    if (!head || (!head.next)) {
        return head;
    }

    // Reference to track the current node
    let current = head;

    // Reference to hold the new head of the reversed list
    let newHead = null;

    while (current !== null) {
        // Swap the previous and next pointers
        let temp = current.prev;
        current.prev = current.next;
        current.next = temp;

        // Move the current reference to the next node (which is now the previous node)
        if (current.prev === null) {
            // If the previous node is now null, the current node is the new head
            newHead = current;
        }

        current = current.prev; // Move to the next node (previously "next")
    }

    // Return the new head, which was the last node in the original list
    return newHead;
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

def reverse_a_linked_list(head: Optional[ListNode]) -> Optional[ListNode]:
    # If the head is null or if it's the only node in the list, return the head as it is
    if not head or (not head.next):
        return head

    # Reference to track the current node
    current = head

    # Reference to hold the reversed head
    new_head = None

    while current is not None:
        # Swap the previous and next pointers of the current node
        current.prev, current.next = current.next, current.prev

        # Move the current reference to the next node, which is now the previous node
        if current.prev is None:
            new_head = current

// Diagram: current = current.prev

    # Return the new head, which was the last node in the original list
    return new_head
```

## Example Problems

Most problems that fall under this category are**easy**problems; a list of a few is given below.

> -   **[Reverse a list](https://www.codeintuition.io/courses/doubly-linked-list/Muhc0AVoUoXcHb8hLYOpY)**
> -   **[Reverse first K nodes](https://www.codeintuition.io/courses/doubly-linked-list/ke2NmhffRLh2bh5ci3S2u)**
> -   **[Reverse last K nodes](https://www.codeintuition.io/courses/doubly-linked-list/Lvrm8OfZ8QVeCtwMSHV8y)**
> -   **[Reverse the given segment](https://www.codeintuition.io/courses/doubly-linked-list/q-LCiTxWfGw5WfTq-vOgg)**

We will now solve these problems to understand the direct application of this pattern better.

***

# Reverse a list

## Problem Statement

Given the **head** of a doubly linked list, write a function to reverse the list and return the head of the reversed list.

// Diagram: You need to reverse the list in place and return a new list that is reversed

### Example

> -   **Input:** head = \[5, 7, 3, 10, 3\]
> -   **Output:** \[3, 10, 3, 7, 5\]

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
    ListNode *reverseAList(ListNode *head) {

        // If the head is null or if it's the only node in the list,
        // return the head as it is
        if (head == nullptr ||
            (head->prev == nullptr && head->next == nullptr)) {
            return head;
        }

        // Pointer to track the current node
        ListNode *current = head;

        // Pointer to track the previous node
        ListNode *previous = nullptr;

        while (current != nullptr) {

            // Save the address of next node
            ListNode *next = current->next;

            // Swap the previous and next nodes pointers of the current
            // node
            swap(current->prev, current->next);

            // Store the previous node in the previous pointer
            previous = current;

            // Move the current pointer to the next node
            current = next;
        }

        // Return the new head, which is stored in the previous pointer
        return previous;
    }
};
```

***

# Reverse first K nodes

## Problem Statement

Given the **head** of a doubly linked list and a non-negative integer **k**, write a function to reverse the first k nodes of the list and return the head of the reversed list.

You need to reverse the list in place.

### Example

> -   **Input:** head = \[5, 7, 3, 10, 3\], k = 2
> -   **Output:** \[7, 5, 3, 10, 3\]

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
    ListNode *reverseFirstKNodes(ListNode *head, int k) {

        // if K is less than or equal to 0, return the original head
        if (k <= 0) {
            return head;
        }

        // Initialize pointers current and previous
        ListNode *current = head;
        ListNode *previous = nullptr;
        int count = 0;

        while (current != nullptr && count < k) {

            // Save the address of next node
            ListNode *next = current->next;

            // Swap the previous and next nodes pointers of the current
            // node
            swap(current->prev, current->next);

            // Move previous to hold current node
            previous = current;

            // Move current ahead
            current = next;

            // Increment count
            count++;
        }

        // Connect the reversed sublist with the remaining part
        if (head) {
            head->next = current;
        }

        // Update prev of the next node to point back to new tail
        if (current) {
            current->prev = head;
        }

        // Mark the previous pointer of the new head to nullptr
        if (previous) {
            previous->prev = nullptr;
        }

        return previous;
    }
};
```

***

# Reverse last K nodes

## Problem Statement

Given the **head** of a doubly linked list and a non-negative integer **k**, write a function to reverse the last k nodes of the list and return the head of the reversed list.

You need to reverse the list in place.

### Example

> -   **Input:** head = \[5, 7, 3, 10, 3\], k = 2
> -   **Output:** \[5, 7, 3, 3, 10\]

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
    int lengthOfList(ListNode *head) {
        int length = 0;

        // Traverse the list and increment the length until the end
        while (head) {
            length++;
            head = head->next;
        }

        // Return the length
        return length;
    }

    ListNode *reverseAList(ListNode *head) {

        // Pointer to track the current node
        ListNode *current = head;

        // Pointer to track the previous node
        ListNode *previous = nullptr;

        while (current != nullptr) {

            // Save the address of next node
            ListNode *next = current->next;

            // Swap the previous and next nodes pointers of the current
            // node
            swap(current->prev, current->next);

            // Store the previous node in the previous pointer
            previous = current;

            // Move the current pointer to the next node
            current = next;
        }

        // Return the new head, which is stored in the previous pointer
        return previous;
    }

    ListNode *reverseLastKNodes(ListNode *head, int k) {

        // if K is less than or equal to 0, return the original head
        if (k <= 0) {
            return head;
        }

        // Find the length of the list
        int length = lengthOfList(head);

        // If k is greater than or equal to length, reverse the entire
        // list
        if (k >= length) {
            return reverseAList(head);
        }

        // Find the (length - k)th node after which the reversal should
        // occur
        ListNode *current = head;
        for (int i = 1; i < length - k; i++) {
            current = current->next;
        }

        // Disconnect the last k nodes from the main list
        if (current->next) {
            current->next->prev = nullptr;
        }

        // Reverse the last k nodes
        ListNode *lastKReverseHead = reverseAList(current->next);

        // Connect the (length - k)th node to the new head
        current->next = lastKReverseHead;

        // Connect the new head of the reversed list to the
        // (length - k)th node
        if (lastKReverseHead) {
            lastKReverseHead->prev = current;
        }

        return head;
    }
};
```

***

# Reverse the given segment

## Problem Statement

Given the **head** of a doubly linked list and two integers **left** and **right** where **left <= right**. Write a function to reverse the list nodes from the position left to the right and return the head of the reversed list.

### Example 1

> -   **Input:** head = \[5, 7, 3, 10, 6\], left = 2, right = 4
> -   **Output:** \[5, 10, 3, 7, 6\]
> -   **Explanation:** After reversing the sublist from the second node to the fourth node, the list becomes \[5, 10, 3, 7, 6\].

### Example 2

> -   **Input:** head = \[5\], left = 1, right = 1
> -   **Output:** \[5\]
> -   **Explanation:** After reversing the first node of the list, the list becomes \[5\].

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
    ListNode *getNodeAtPosition(ListNode *head, int position) {
        ListNode *current = head;
        for (int i = 1; i < position; ++i) {
            current = current->next;
        }
        return current;
    }

    void reverse(ListNode *start, ListNode *end) {

        // If the start is null or start is the end, there's nothing to
        // reverse
        if (start == nullptr || start == end) {
            return;
        }

        // Pointers to keep track of the bounds
        ListNode *leftBound = start->prev;
        ListNode *rightBound = end->next;
        ListNode *current = start;
        ListNode *previous = leftBound;

        // Reverse nodes until the right boundary
        while (current != rightBound) {

            // Save the address of next node
            ListNode *next = current->next;

            // Swap the previous and next nodes pointers of the current
            // node
            swap(current->prev, current->next);

            // Store the previous node in the previous pointer
            previous = current;

            // Move the current pointer to the next node
            current = next;
        }

        // Adjust connections with the new boundaries
        start->next = rightBound;
        if (rightBound != nullptr) {
            rightBound->prev = start;
        }

        end->prev = leftBound;
        if (leftBound != nullptr) {
            leftBound->next = end;
        }
    }

    ListNode *reverseTheGivenSegment(
        ListNode *head,
        int left,
        int right
    ) {

        // Handle cases where reversal is not needed
        if (head == nullptr || head->next == nullptr || left == right) {
            return head;
        }

        // Get the node at the 'left' position
        ListNode *start = getNodeAtPosition(head, left);

        // Get the node at the 'right' position
        ListNode *end = getNodeAtPosition(head, right);

        // Reverse the segment between start and end
        reverse(start, end);

        // Return the new head if the reversal included the head node
        return left == 1 ? end : head;
    }
};
```
