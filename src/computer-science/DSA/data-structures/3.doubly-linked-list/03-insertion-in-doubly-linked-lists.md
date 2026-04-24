# 3. Insertion in doubly linked lists

## Table of contents

1. [Understanding insertion at beginning](#understanding-insertion-at-beginning)
2. [Insert at beginning](#insert-at-beginning)
3. [Understanding insertion at end](#understanding-insertion-at-end)
4. [Insert at end](#insert-at-end)
5. [Understanding insertion after the given node](#understanding-insertion-after-the-given-node)
6. [Insert after the given node](#insert-after-the-given-node)
7. [Understanding insertion before a given node](#understanding-insertion-before-the-given-node)
8. [Insert before the given node](#insert-before-the-given-node)
9. [Understanding insertion at a given distance](#understanding-insertion-at-a-given-distance)
10. [Insert at given distance](#insert-at-given-distance)

***

# Understanding insertion at beginning

Inserting a node at the beginning of a doubly linked list is similar to inserting a node at the beginning of a singly linked list. The main difference is that a doubly linked list has two references stored in a node, and we need to keep track of both references. Let's examine the scenarios we need to take into account.

## 1\. The list is empty

In this scenario, if the linked list is empty, the **head** will be `null`. We need to initialize the **head** node of the linked list and ensure that the and pointers of this newly created **head** node are `null`, as this node is also the **tail** node of the list.

// Diagram: The list is empty

> **Algorithm**
>
> -   **Step 1:** Create a new node with the given data.
> -   **Step 2:** Set this new node's \`next\` pointer to \`null\` since it's the only node.
> -   **Step 3:** Set this new node's \`previous\` pointer to \`null\` since it's the only node.
> -   **Step 4:** Return the new node, as this node is also the head node.

## 2\. The list is not empty

In this scenario, the linked list already contains some data, so the **head** is not `null`, rather, it is the first node of the linked list. To insert a new node at the beginning of the list, create a new node and update its pointer to hold the reference to the old **head**. Additionally, update the pointer of the original **head** node to point to the newly created node to maintain the bidirectional property. Finally, ensure that the pointer of the newly created node is `null`, as it is the end of the linked list in the reverse direction.

// Diagram: The list is not empty

> **Algorithm**
>
> -   **Step 1:** Create a new node with the given data.
> -   **Step 2:** Set the \`next\` pointer of the new node to the current head, as the new node the will be the new head.
> -   **Step 3:** Set the new node's \`previous\` pointer to \`null\` since it's the new head node.
> -   **Step 4:** Set the \`previous\` pointer of current head to the new node to restore the bidirectional link.
> -   **Step 5:** Return the new node, as this is the new head.

## Implementation

When implementing the logic for insert at the beginning operation, we consider both possible cases and write the code for each in conditional blocks.

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
    ListNode *insertAtBeginning(ListNode *head, int data) {

        // Create a new node with the given data.
        ListNode *newNode = new ListNode(data);

        // Check if the list is empty
        if (head == nullptr) {

            // Set the next pointer to nullptr since it's the only node
            newNode->next = nullptr;
            newNode->prev = nullptr;

            // Return the newNode as this is the new head
            return newNode;
        }

        // Set the next pointer of the new node to the current head
        newNode->next = head;

        // Set the prev pointer of the new node to nullptr since it will
        // be the new head
        newNode->prev = nullptr;

        // Set the prev pointer of the current head to the new node
        head->prev = newNode;

        // Return the new node as the new head of the list
        return newNode;
    }
};
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

class Solution {
    public ListNode insertAtBeginning(ListNode head, int data) {

        // Create a new node with the given data
        ListNode newNode = new ListNode(data);

        // Check if the list is empty
        if (head == null) {

            // Set the next pointer to null since it's the only node
            newNode.next = null;
            newNode.prev = null;

            // Return the newNode as this is the new head
            return newNode;
        }

        // Set the next pointer of the new node to the current head
        newNode.next = head;

        // Set the prev pointer of the new node to null since it will be
        // the new head
        newNode.prev = null;

        // Set the prev pointer of the current head to the new node
        head.prev = newNode;

        // Return the new node as the new head of the list
        return newNode;
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
    insertAtBeginning(
        head: ListNode | null,
        data: number
    ): ListNode | null {

        // Create a new node with the given data
        const newNode = new ListNode(data);

        // Check if the list is empty
        if (head === null) {

            // Set the next pointer to null since it's the only node
            newNode.next = null;
            newNode.prev = null;

            // Return the newNode as this is the new head
            return newNode;
        }

        // Set the next pointer of the new node to the current head
        newNode.next = head;

        // Set the prev pointer of the new node to null since it will be
        // the new head
        newNode.prev = null;

        // Set the prev pointer of the current head to the new node
        head.prev = newNode;

        // Return the new node as the new head of the list
        return newNode;
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
    insertAtBeginning(head, data) {

        // Create a new node with the given data
        const newNode = new ListNode(data);

        // Check if the list is empty
        if (head === null) {

            // Set the next pointer to null since it's the only node
            newNode.next = null;
            newNode.prev = null;

            // Return the newNode as this is the new head
            return newNode;
        }

        // Set the next pointer of the new node to the current head
        newNode.next = head;

        // Set the prev pointer of the new node to null since it will be
        // the new head
        newNode.prev = null;

        // Set the prev pointer of the current head to the new node
        head.prev = newNode;

        // Return the new node as the new head of the list
        return newNode;
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
    def insert_at_beginning(
        self, head: Optional[ListNode], data: int
    ) -> Optional[ListNode]:

        # Create a new node with the given data
        new_node: ListNode = ListNode(data)

        # Check if the list is empty
        if head is None:

            # Set the next pointer to None since it's the only node
            new_node.next = None
            new_node.prev = None

            # Return the new_node as this is the new head
            return new_node

        # Set the next pointer of the new node to the current head
        new_node.next = head

        # Set the prev pointer of the new node to None since it will be
        # the new head
        new_node.prev = None

        # Set the prev pointer of the current head to the new node
        head.prev = new_node

        # Return the new node as the new head of the list
        return new_node
```

## Complexity Analysis

The time complexity of the above function does not depend on the list size. For all cases, we always need to insert the node at the start of the list, which takes constant time.

// Diagram: All cases: Insert before the head node

The space complexity of the function is also**O(1)**because it only creates a single new node and does not use any additional data structures.

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

# Insert at beginning

## Problem Statement

Given the **head** of a doubly linked list and a **data** value, write a function to insert a new node with the given data value at the beginning of the linked list and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\], data = 6
> -   **Output:** \[6, 5, 7, 3, 10\]

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
    ListNode *insertAtBeginning(ListNode *head, int data) {

        // Create a new node with the given data.
        ListNode *newNode = new ListNode(data);

        // Check if the list is empty
        if (head == nullptr) {

            // Set the next pointer to nullptr since it's the only node
            newNode->next = nullptr;
            newNode->prev = nullptr;

            // Return the newNode as this is the new head
            return newNode;
        }

        // Set the next pointer of the new node to the current head
        newNode->next = head;

        // Set the prev pointer of the new node to nullptr since it will
        // be the new head
        newNode->prev = nullptr;

        // Set the prev pointer of the current head to the new node
        head->prev = newNode;

        // Return the new node as the new head of the list
        return newNode;
    }
};
```

***

# Understanding insertion at end

When inserting at the end of a doubly linked list, we must access the linked list's tail node. Fortunately, we have direct access to the list's tail node in a doubly linked list. This makes insertion at the end quite similar to insertion at the beginning. There are two cases to consider when inserting at the end of a doubly linked list.

## 1\. The list is empty

In this scenario, if the linked list is empty, the **head** will be `null`. We need to initialize the **head** node of the linked list and ensure that the and pointers of this newly created **head** node are `null`, as this node is also the **tail** node of the list.

// Diagram: The list is empty

> **Algorithm**
>
> -   **Step 1:** Create a new node with the given data.
> -   **Step 2:** Set this new node's \`next\` pointer to \`null\` since it's the only node.
> -   **Step 3:** Set this new node's \`previous\` pointer to \`null\` since it's the only node.
> -   **Step 4:** Return the new node, as this node is also the tail node.

## 2\. The list is not empty

In this scenario, the linked list already contains some data, so the **tail** is not `null`, rather, it is the last node of the linked list. To insert a new node at the end of the list, create a new node and update its `prev` pointer to hold the reference to the old **tail**. Also, ensure that the  pointer of the newly created node is `null`, as it is now the last node of the linked list. Finally, update the  pointer of the original **tail** node to point to the newly created node to maintain the bidirectional property. 

// Diagram: The list is not empty

> **Algorithm**
>
> -   **Step 1:** Create a new node with the given data.
> -   **Step 2:** Set the current tail's \`next\` pointer to hold the reference of the new node.
> -   **Step 3:** Set the new node's \`previous\` pointer to hold the reference of the current tail.
> -   **Step 4:** Set the new node's \`next\` pointer to \`null\`.
> -   **Step 5:** Return the new node, as this is the new tail.

## Implementation

When implementing the logic for insert at the beginning operation, we consider both possible cases and write the code for each in conditional blocks.

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
    ListNode *insertAtEnd(ListNode *tail, int data) {

        // Create a new node with the given data
        ListNode *newNode = new ListNode(data);

        // Check if the list is empty
        if (tail == nullptr) {

            // Set the next and prev pointer of the new node to null
            newNode->next = nullptr;
            newNode->prev = nullptr;

            // Return the newNode as this is the new tail
            return newNode;
        }

        // Set the next pointer of the tail to the new node
        tail->next = newNode;

        // Set the previous pointer of the new node to the current tail
        newNode->prev = tail;

        // Set the next pointer of the new node to null since it will be
        // the new tail
        newNode->next = nullptr;

        // Return the new node as the new tail of the list
        return tail;
    }
};
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

class Solution {
    public ListNode insertAtEnd(ListNode tail, int data) {

        // Create a new node with the given data
        ListNode newNode = new ListNode(data);

        // Check if the list is empty
        if (tail == null) {

            // Set the next and prev pointer of the new node to null
            newNode.next = null;
            newNode.prev = null;

            // Return the newNode as this is the new tail
            return newNode;
        }

        // Set the next pointer of the tail to the new node
        tail.next = newNode;

        // Set the previous pointer of the new node to the current tail
        newNode.prev = tail;

        // Set the next pointer of the new node to null since it will be
        // the new tail
        newNode.next = null;

        // Return the new node as the new tail of the list
        return newNode;
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
    insertAtEnd(tail: ListNode | null, data: number): ListNode {

        // Create a new node with the given data
        const newNode = new ListNode(data);

        // Check if the list is empty
        if (tail === null) {

            // Set the next and prev pointer of the new node to null
            newNode.next = null;
            newNode.prev = null;

            // Return the newNode as this is the new tail
            return newNode;
        }

        // Set the next pointer of the tail to the new node
        tail.next = newNode;

        // Set the previous pointer of the new node to the current tail
        newNode.prev = tail;

        // Set the next pointer of the new node to null since it will be
        // the new tail
        newNode.next = null;

        // Return the new node as the new tail of the list
        return newNode;
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
    insertAtEnd(tail, data) {

        // Create a new node with the given data
        const newNode = new ListNode(data);

        // Check if the list is empty
        if (tail === null) {

            // Set the next and prev pointer of the new node to null
            newNode.next = null;
            newNode.prev = null;

            // Return the newNode as this is the new tail
            return newNode;
        }

        // Set the next pointer of the tail to the new node
        tail.next = newNode;

        // Set the previous pointer of the new node to the current tail
        newNode.prev = tail;

        // Set the next pointer of the new node to null since it will be
        // the new tail
        newNode.next = null;

        // Return the new node as the new tail of the list
        return newNode;
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
    def insert_at_end(
        self, tail: Optional[ListNode], data: int
    ) -> Optional[ListNode]:

        # Create a new node with the given data
        new_node: ListNode = ListNode(data)

        # Check if the list is empty
        if tail is None:

            # Set the next and prev pointer of the new node to None
            new_node.next = None
            new_node.prev = None

            # Return the newNode as this is the new tail
            return new_node

        # Set the next pointer of the tail to the new node
        tail.next = new_node

        # Set the previous pointer of the new node to the current tail
        new_node.prev = tail

        # Set the next pointer of the new node to None since it will be
        # the new tail
        new_node.next = None

        # Return the new node as the new tail of the list
        return new_node
```

## Complexity Analysis

The time complexity of the above function does not depend on the list size. For all cases, we always need to insert the node at the end of the list, which takes constant time.

// Diagram: All cases: Insert after the tail node

The space complexity of the function is also**O(1)**because it only creates a single new node and does not use any additional data structures.

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

# Insert at end

## Problem Statement

Given the **tail** of a doubly linked list and a **data** value, write a function to insert a new node with the given data value at the end of the linked list and return the tail of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\], data = 6
> -   **Output:** \[5, 7, 3, 10, 6\]

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
    ListNode *insertAtEnd(ListNode *tail, int data) {

        // Create a new node with the given data
        ListNode *newNode = new ListNode(data);

        // Check if the list is empty
        if (tail == nullptr) {

            // Set the next and prev pointer of the new node to null
            newNode->next = nullptr;
            newNode->prev = nullptr;

            // Return the newNode as this is the new tail
            return newNode;
        }

        // Set the next pointer of the tail to the new node
        tail->next = newNode;

        // Set the previous pointer of the new node to the current tail
        newNode->prev = tail;

        // Set the next pointer of the new node to null since it will be
        // the new tail
        newNode->next = nullptr;

        // Return the new node as the new tail of the list
        return tail;
    }
};
```

***

# Understanding insertion after the given node

Inserting a node after the given node is a simple operation. It is similar to inserting after the given node in a singly linked list. For a doubly linked list, we need to update the pointer of the newly created node to maintain the bidirectional structure. Let’s examine the two cases that we need to consider.

## 1\. The list is empty

If the list is empty and contains no elements, we cannot find the given node because it does not exist within the list. Inserting a new node after the given node is not possible because there is no reference point within the list to perform the insertion. In such a case, the method would return without making any changes.

// Diagram: The list is empty

> **Algorithm**
>
> -   **Step 1:** Return from the function.

## 2\. The list is not empty

Since the new node will be inserted between two existing nodes, we must ensure that we properly set up the  and pointers of these nodes. Inserting after a given node is a 5-step process.

// Diagram: The list is not empty

> **Algorithm**
>
> -   **Step 1:** Create a new node with the given data.
> -   **Step 2:** Set the new node's \`next\` pointer to hold the node's reference stored in the \`next\` pointer of the \`given\` node.
> -   **Step 3:** Set the new node's \`previous\` pointer to hold the reference of the \`given\` node.
> -   **Step 4:** Set the \`given\` node's \`next\` pointer to hold the reference of the new node.
> -   **Step 5:** Set the \`previous\` pointer of the node after the \`given\` node to hold the the reference of the \`given\` node.

## Implementation

We will be given the node, **after** which we will perform the insertion. When implementing the logic for the operation, we consider both possible cases and write the code for each in conditional blocks.

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
    void insertAfterTheGivenNode(ListNode *node, int data) {

        // Check if the given node is valid (not null)
        if (node == nullptr) {

            // If the node is null, we cannot insert after it, so return.
            return;
        }

        // Create a new node with the given data
        ListNode *newNode = new ListNode(data);

        // Link the new node to the next node in the list
        newNode->next = node->next;

        // Link the new node to the current node as its previous node
        newNode->prev = node;

        // Link the current node to the new node, effectively inserting
        // the new node after it
        node->next = newNode;

        // If the new node has a valid next node, update its previous
        // node to point back to the new node
        if (newNode->next != nullptr) {
            newNode->next->prev = newNode;
        }
};
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

class Solution {
    public void insertAfterTheGivenNode(ListNode node, int data) {

        // Check if the given node is valid (not null)
        if (node == null) {

            // If the node is null, we cannot insert after it, so return.
            return;
        }

        // Create a new node with the given data
        ListNode newNode = new ListNode(data);

        // Link the new node to the next node in the list
        newNode.next = node.next;

        // Link the new node to the current node as its previous node
        newNode.prev = node;

        // Link the current node to the new node, effectively inserting
        // the new node after it
        node.next = newNode;

        // If the new node has a valid next node, update its previous
        // node to point back to the new node
        if (newNode.next != null) {
            newNode.next.prev = newNode;
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
    insertAfterTheGivenNode(node: ListNode | null, data: number): void {

        // Check if the given node is valid (not null)
        if (node === null) {

            // If the node is null, we cannot insert after it, so return.
            return;
        }

        // Create a new node with the given data
        const newNode: ListNode = new ListNode(data);

        // Link the new node to the next node in the list
        newNode.next = node.next;

        // Link the new node to the current node as its previous node
        newNode.prev = node;

        // Link the current node to the new node, effectively inserting
        // the new node after it
        node.next = newNode;

        // If the new node has a valid next node, update its previous
        // node to point back to the new node
        if (newNode.next !== null) {
            newNode.next.prev = newNode;
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
    insertAfterTheGivenNode(node, data) {

        // Check if the given node is valid (not null)
        if (node === null) {

            // If the node is null, we cannot insert after it, so return.
            return;
        }

        // Create a new node with the given data
        const newNode = new ListNode(data);

        // Link the new node to the next node in the list
        newNode.next = node.next;

        // Link the new node to the current node as its previous node
        newNode.prev = node;

        // Link the current node to the new node, effectively inserting
        // the new node after it
        node.next = newNode;

        // If the new node has a valid next node, update its previous
        // node to point back to the new node
        if (newNode.next !== null) {
            newNode.next.prev = newNode;
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
    def insert_after_the_given_node(
        self, node: Optional[ListNode], data: int
    ) -> None:

        # Check if the given node is valid (not None)
        if node is None:

            # If the node is None, we cannot insert after it, so return.
            return

        # Create a new node with the given data
        new_node: ListNode = ListNode(data)

        # Link the new node to the next node in the list
        new_node.next = node.next

        # Link the new node to the current node as its previous node
        new_node.prev = node

        # Link the current node to the new node, effectively inserting
        # the new node after it
        node.next = new_node

        # If the new node has a valid next node, update its previous node
        # to point back to the new node
        if new_node.next is not None:
            new_node.next.prev = new_node
```

## Complexity Analysis

The time complexity of the above function is not affected by the length of the linked list because it only involves inserting a new node after the given node. The function performs the following steps: creating a new node and updating the and pointers of a few nodes. Since these operations take constant time, the function's time complexity is **O(1)**.

// Diagram: All cases: Insert after the given node

The function's space complexity is **O(1)** because it only creates a single new node and does not use any additional data structures.

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

# Insert after the given node

## Problem Statement

Given a reference to a **random node** in a doubly linked list and a **data** value, write a function to insert a new node with the given data value after the given node.

### Example

> -   **Input:** head = \[5, 7, 3, 10\], node = 7, data = 6
> -   **Output:** \[5, 7, 6, 3, 10\]

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
    void insertAfterTheGivenNode(ListNode *node, int data) {

        // Check if the given node is valid (not null)
        if (node == nullptr) {

            // If the node is null, we cannot insert after it, so return.
            return;
        }

        // Create a new node with the given data
        ListNode *newNode = new ListNode(data);

        // Link the new node to the next node in the list
        newNode->next = node->next;

        // Link the new node to the current node as its previous node
        newNode->prev = node;

        // Link the current node to the new node, effectively inserting
        // the new node after it
        node->next = newNode;

        // If the new node has a valid next node, update its previous
        // node to point back to the new node
        if (newNode->next != nullptr) {
            newNode->next->prev = newNode;
        }
    }
};
```

***

# Understanding insertion before the given node

In linked lists, it is important to access the node before the one being inserted or deleted. In a singly linked list, finding the node before the given one requires traversing the entire list. However, in a doubly linked list, the node before the given one can be accessed directly using the pointer stored in each node, simplifying the operation. Let's examine the three cases we need to consider.

## 1\. The list is empty

If the list is empty and contains no elements, we cannot find the given node because it does not exist within the list. Inserting a new node after the given node is not possible because there is no reference point within the list to perform the insertion. In such a case, we can return the **head** node that was provided as it is.

// Diagram: The list is empty

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 2\. The given node is the first node

This is similar to **inserting at the beginning**, which we learned earlier. To determine if the given node is the first node, we can compare it to the **head** node. If both nodes are the same, then the given node is the **head** node.

// Diagram: The given node is the first node

> **Algorithm**
>
> -   **Step 1:** Create a new node with the given data.
> -   **Step 2:** Set the \`next\` pointer of the new node to the current head, as the new node the will be the new head.
> -   **Step 3:** Set the new node's \`previous\` pointer to \`null\` since it's the new head node.
> -   **Step 4:** Set the \`previous\` pointer of current head to the new node to restore the bidirectional link.
> -   **Step 5:** Return the new node, as this is the new head.

## 3. The given node is not the first node

In this scenario, we employ a reference manipulation similar to the one used for **inserting after a given node**. However, this time we use the pointer instead of the one. The process of inserting before a given node involves five steps.

// Diagram: The given node is not the first node

> **Algorithm**
>
> -   **Step 1:** Create a new node with the \`given\` data.
> -   **Step 2:** Set the new node's \`next\` pointer to hold the reference of the \`given\` node.
> -   **Step 3:** Set the new node's \`previous\` pointer to hold the reference of the node before the \`given\` node.
> -   **Step 4:** Set the \`next\` pointer of the node before the given node to hold the the reference of the new node.
> -   **Step 5:** Set the \`given\` node's \`previous\` pointer to hold the reference of the new node.
> -   **Step 6:** Return the original head node.

## Implementation

We will be given the node, **before** which we will perform the insertion. When implementing the logic for the operation, we consider both possible cases and write the code for each in conditional blocks.

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
    ListNode *insertBeforeTheGivenNode(
        ListNode *head,
        ListNode *node,
        int data
    ) {

        // Check if the head or the node to insert before is nullptr
        if (head == nullptr || node == nullptr) {
            return head;
        }

        // Create a new node with the provided data
        ListNode *newNode = new ListNode(data);

        // Check if the node to insert before is the head of the list.
        if (node == head) {

            // Set the next pointer of the new node to the current head
            newNode->next = head;

            // Set the prev pointer of the new node to nullptr since it
            // will be the new head
            newNode->prev = nullptr;

            // Set the prev pointer of the current head to the new node
            head->prev = newNode;

            // Return the newNode as this is the new head
            return newNode;
        }

        // Update the pointers of the new node to connect it with the
        // list. The next node of the new node is the node given
        newNode->next = node;

        // The previous node of the new node is the prev node of the
        // given node
        newNode->prev = node->prev;

        // Update the next pointer of the previous node of the node to
        // point to the new node.
        if (newNode->prev) {
            newNode->prev->next = newNode;
        }

        // Update the prev pointer of the node to point back to the new
        // node
        node->prev = newNode;

        // Return the updated head of the list
        return head;
    }
};
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

class Solution {
    public ListNode insertBeforeTheGivenNode(
        ListNode head,
        ListNode node,
        int data
    ) {

        // Check if the head or the node to insert before is null
        if (head == null || node == null) {
            return head;
        }

        // Create a new node with the provided data
        ListNode newNode = new ListNode(data);

        // Check if the node to insert before is the head of the list.
        if (node == head) {

            // Set the next pointer of the new node to the current head
            newNode.next = head;

            // Set the prev pointer of the new node to null since it will
            // be the new head
            newNode.prev = null;

            // Set the prev pointer of the current head to the new node
            head.prev = newNode;

            // Return the newNode as this is the new head
            return newNode;
        }

        // Update the pointers of the new node to connect it with the
        // list. The next node of the new node is the node given
        newNode.next = node;

        // The previous node of the new node is the prev node of the
        // given node
        newNode.prev = node.prev;

        // Update the next pointer of the previous node of the node to
        // point to the new node.
        if (newNode.prev != null) {
            newNode.prev.next = newNode;
        }

        // Update the prev pointer of the node to point back to the new
        // node
        node.prev = newNode;

        // Return the updated head of the list
        return head;
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
    insertBeforeTheGivenNode(
        head: ListNode | null,
        node: ListNode | null,
        data: number
    ): ListNode | null {

        // Check if the head or the node to insert before is null
        if (head === null || node === null) {
            return head;
        }

        // Create a new node with the provided data
        const newNode = new ListNode(data);

        // Check if the node to insert before is the head of the list.
        if (node === head) {

            // Set the next pointer of the new node to the current head
            newNode.next = head;

            // Set the prev pointer of the new node to null since it will
            // be the new head
            newNode.prev = null;

            // Set the prev pointer of the current head to the new node
            head.prev = newNode;

            // Return the newNode as this is the new head
            return newNode;
        }

        // Update the pointers of the new node to connect it with the
        // list. The next node of the new node is the node given
        newNode.next = node;

        // The previous node of the new node is the prev node of the
        // given node
        newNode.prev = node.prev;

        // Update the next pointer of the previous node of the node to
        // point to the new node.
        if (newNode.prev) {
            newNode.prev.next = newNode;
        }

        // Update the prev pointer of the node to point back to the new
        // node
        node.prev = newNode;

        // Return the updated head of the list
        return head;
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
    insertBeforeTheGivenNode(head, node, data) {

        // Check if the head or the node to insert before is null
        if (head === null || node === null) {
            return head;
        }

        // Create a new node with the provided data
        const newNode = new ListNode(data);

        // Check if the node to insert before is the head of the list.
        if (node === head) {

            // Set the next pointer of the new node to the current head
            newNode.next = head;

            // Set the prev pointer of the new node to null since it will
            // be the new head
            newNode.prev = null;

            // Set the prev pointer of the current head to the new node
            head.prev = newNode;

            // Return the newNode as this is the new head
            return newNode;
        }

        // Update the pointers of the new node to connect it with the
        // list. The next node of the new node is the node given
        newNode.next = node;

        // The previous node of the new node is the prev node of the
        // given node
        newNode.prev = node.prev;

        // Update the next pointer of the previous node of the node to
        // point to the new node.
        if (newNode.prev) {
            newNode.prev.next = newNode;
        }

        // Update the prev pointer of the node to point back to the new
        // node
        node.prev = newNode;

        // Return the updated head of the list
        return head;
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
    def insert_before_the_given_node(
        self,
        head: Optional[ListNode],
        node: Optional[ListNode],
        data: int,
    ) -> Optional[ListNode]:

        # Check if the head or the node to insert before is null
        if head is None or node is None:
            return head

        # Create a new node with the provided data
        new_node = ListNode(data)

        # Check if the node to insert before is the head of the list.
        if node == head:

            # Set the next pointer of the new node to the current head
            new_node.next = head

            # Set the prev pointer of the new node to None since it will
            # be the new head
            new_node.prev = None

            # Set the prev pointer of the current head to the new node
            head.prev = new_node

            # Return the newNode as this is the new head
            return new_node

        # Update the pointers of the new node to connect it with the list.
        # The next node of the new node is the node given
        new_node.next = node

        # The previous node of the new node is the prev node of the given
        # node
        new_node.prev = node.prev

        # Update the next pointer of the previous node of the node to
        # point to the new node.
        if new_node.prev:
            new_node.prev.next = new_node

        # Update the prev pointer of the node to point back to the new
        # node
        node.prev = new_node

        # Return the updated head of the list
        return head
```

## Complexity Analysis

The time complexity has significantly improved compared to this insertion operation's singly linked list version. We no longer need to traverse the entire list to find the node one step before the given node. With a doubly linked list, the time complexity is **O(1)** for inserting anywhere in the list if we have a reference to the node before which we want to insert.

// Diagram: All cases: Insert before the given node

This is the main advantage of the doubly linked list. Since we are only creating a single node, the extra space needed for this operation is constant. Hence, the space complexity is **O(1)**.

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

# Insert before the given node

## Problem Statement

Given the **head** of a doubly linked list, a reference to a **random node** in that linked list, and a **data** value, write a function to insert a new node with the given data before the given node and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\], node = 7, data = 6
> -   **Output:** \[5, 6, 7, 3, 10\]

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
    ListNode *insertBeforeTheGivenNode(
        ListNode *head,
        ListNode *node,
        int data
    ) {

        // Check if the head or the node to insert before is nullptr
        if (head == nullptr || node == nullptr) {
            return head;
        }

        // Create a new node with the provided data
        ListNode *newNode = new ListNode(data);

        // Check if the node to insert before is the head of the list.
        if (node == head) {

            // Set the next pointer of the new node to the current head
            newNode->next = head;

            // Set the prev pointer of the new node to nullptr since it
            // will be the new head
            newNode->prev = nullptr;

            // Set the prev pointer of the current head to the new node
            head->prev = newNode;

            // Return the newNode as this is the new head
            return newNode;
        }

        // Update the pointers of the new node to connect it with the
        // list. The next node of the new node is the node given
        newNode->next = node;

        // The previous node of the new node is the prev node of the
        // given node
        newNode->prev = node->prev;

        // Update the next pointer of the previous node of the node to
        // point to the new node.
        if (newNode->prev) {
            newNode->prev->next = newNode;
        }

        // Update the prev pointer of the node to point back to the new
        // node
        node->prev = newNode;

        // Return the updated head of the list
        return head;
    }
};
```

***

# Understanding insertion at a given distance

We have learned how to perform this operation on a singly linked list. However, a doubly linked list does not offer any specific advantage in this case because we don’t know the exact address of the node where we want to insert the new node, so we will have to traverse the list anyway. On the downside, it adds some extra complexity as now we also need to update the pointer of some nodes. Let’s look at all the cases we need to consider.

## 1\. If the list is empty and X > 0

Attempting to insert a node at a position greater than 0 in an empty list is an invalid operation. In an empty list, no nodes are present, so the only valid position for insertion would be at position 0, making the new node the head of the list. However, when X is greater than 0, no corresponding position is available for insertion because the list lacks any elements. Therefore, we will return the existing **head**.

// Diagram: The list is empty and X > 0

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 2\. X = 0

This means simply inserting a node at the beginning of a list, as we covered previously. 

X = 0

> **Algorithm**
>
> -   **Step 1:** Create a new node with the given data.
> -   **Step 2:** Set the \`next\` pointer of the new node to the current head, as the new node the will be the new head.
> -   **Step 3:** Set the new node's \`previous\` pointer to \`null\` since it's the new head node.
> -   **Step 4:** Set the \`previous\` pointer of current head to the new node to restore the bidirectional link.
> -   **Step 5:** Return the new node, as this is the new head.

## 3\. X <= size of the list

If the list is not empty, we need to traverse it while keeping a counter variable with the initial value of 0. Moving through the linked list, we increment this counter by 1 to keep track of the current index. We continue traversing the list until the counter has a value of `X-1`, which lands us at the node just **before** where we want to insert the new node. Now, the problem essentially comes down to **inserting before the given node**, which we have learned earlier.

// Diagram: X <= size of the list

> **Algorithm**
>
> -   **Step 1:** Create a new node with the given data.
> -   **Step 2:** Traverse the distance X - 1 while keeping track of the \`current\` node.
> -   **Step 3:** Set the new node's \`next\` pointer to hold the node's reference stored in the \`next\` pointer of the \`current\` node.
> -   **Step 4:** Set the new node's \`previous\` pointer to hold the reference of the \`current\` node.
> -   **Step 5:** Set the \`current\` node's \`next\` pointer to hold the reference of the new node.
> -   **Step 6:** Set the \`previous\` pointer of the node after the \`current\` node to hold the reference of the new node.
> -   **Step 7:** Return the original head node.

## 4\. X > size of the list

If the value of `X` It is greater than the list's size, indicating an invalid case. For example, if we want to insert a node at position 5 in a list with only three items, we will return the existing **head**.

// Diagram: X > size of the list

> **Algorithm**
>
> -   **Step 1:** Create a new node with the given data.
> -   **Step 2:** Traverse the distance X - 1 while keeping track of the \`current\` node.
> -   **Step 3:** Return the original head node.

## Implementation

When implementing the logic for insert at a distance `X` operation, we keep all the possible cases in mind and write the code for each in conditional blocks.

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
    ListNode *insertAtGivenDistance(ListNode *head, int X, int data) {

        // If the list is empty, head is nullptr and X is greater than 0,
        // it's not possible to insert the new node, so return nullptr.
        if (head == nullptr && X > 0) {
            return nullptr;
        }

        // Create a new node with the given data.
        ListNode *newNode = new ListNode(data);

        // If X is 0, insert the new node at the beginning of the list.
        if (X == 0) {

            // Set the next pointer of the new node to the current head
            newNode->next = head;

            // Set the prev pointer of the new node to nullptr since it
            // will be the new head
            newNode->prev = nullptr;
            if (head != nullptr) {

                // Set the prev pointer of the current head to the new
                // node
                head->prev = newNode;
            }

            // Return the new node as the new head of the list
            return newNode;
        }

        // Traverse the list to find the node at position X-1.
        ListNode *current = head;

        // Counter to track the number of nodes traversed
        int counter = 0;

// Diagram: while (current != nullptr && counter < X - 1) {

            // Move to the next node
            current = current->next;

            // Increment the counter
            counter++;
        }

        // If the list is shorter than X-1, it's not possible to insert
        // the new node, so return head.
        if (current == nullptr) {
            return head;
        }

        // Insert the new node after the node at position X-1.
        newNode->next = current->next;
        newNode->prev = current;
        current->next = newNode;
        if (newNode->next != nullptr) {
            newNode->next->prev = newNode;
        }

        // Return the updated head of the list
        return head;
    }
};
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

class Solution {
    public ListNode insertAtGivenDistance(
        ListNode head,
        int X,
        int data
    ) {

        // If the list is empty, head is null, and X is greater than 0,
        // it's not possible to insert the new node, so return null.
        if (head == null && X > 0) {
            return null;
        }

        // Create a new node with the given data.
        ListNode newNode = new ListNode(data);

        // If X is 0, insert the new node at the beginning of the list.
        if (X == 0) {

            // Set the next pointer of the new node to the current head
            newNode.next = head;

            // Set the prev pointer of the new node to null since it will
            // be the new head
            newNode.prev = null;
            if (head != null) {

                // Set the prev pointer of the current head to the new
                // node
                head.prev = newNode;
            }

            // Return the new node as the new head of the list
            return newNode;
        }

        // Traverse the list to find the node at position X-1.
        ListNode current = head;

        // Counter to track the number of nodes traversed
        int counter = 0;

// Diagram: while (current != null && counter < X - 1) {

            // Move to the next node
            current = current.next;

            // Increment the counter
            counter++;
        }

        // If the list is shorter than X-1, it's not possible to insert
        // the new node, so return head.
        if (current == null) {
            return head;
        }

        // Insert the new node after the node at position X-1.
        newNode.next = current.next;
        newNode.prev = current;
        current.next = newNode;
        if (newNode.next != null) {
            newNode.next.prev = newNode;
        }

        // Return the updated head of the list
        return head;
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
    insertAtGivenDistance(
        head: ListNode | null,
        X: number,
        data: number
    ): ListNode | null {

        // If the list is empty, head is null, and X is greater than 0,
        // it's not possible to insert the new node, so return null.
        if (head === null && X > 0) {
            return null;
        }

        // Create a new node with the given data.
        const newNode: ListNode = new ListNode(data);

        // If X is 0, insert the new node at the beginning of the list.
        if (X === 0) {

            // Set the next pointer of the new node to the current head
            newNode.next = head;

            // Set the prev pointer of the new node to null since it will
            // be the new head
            newNode.prev = null;
            if (head !== null) {

                // Set the prev pointer of the current head to the new
                // node
                head.prev = newNode;
            }

            // Return the new node as the new head of the list
            return newNode;
        }

        // Traverse the list to find the node at position X-1.
        let current = head;

        // Counter to track the number of nodes traversed
        let counter = 0;

// Diagram: while (current !== null && counter < X - 1) {

            // Move to the next node
            current = current.next;

            // Increment the counter
            counter++;
        }

        // If the list is shorter than X-1, it's not possible to insert
        // the new node, so return head.
        if (current === null) {
            return head;
        }

        // Insert the new node after the node at position X-1.
        newNode.next = current.next;
        newNode.prev = current;
        current.next = newNode;
        if (newNode.next !== null) {
            newNode.next.prev = newNode;
        }

        // Return the updated head of the list
        return head;
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
    insertAtGivenDistance(head, X, data) {

        // If the list is empty, head is null, and X is greater than 0,
        // it's not possible to insert the new node, so return null.
        if (head === null && X > 0) {
            return null;
        }

        // Create a new node with the given data.
        const newNode = new ListNode(data);

        // If X is 0, insert the new node at the beginning of the list.
        if (X === 0) {

            // Set the next pointer of the new node to the current head
            newNode.next = head;

            // Set the prev pointer of the new node to null since it will
            // be the new head
            newNode.prev = null;
            if (head !== null) {

                // Set the prev pointer of the current head to the new
                // node
                head.prev = newNode;
            }

            // Return the new node as the new head of the list
            return newNode;
        }

        // Traverse the list to find the node at position X-1.
        let current = head;

        // Counter to track the number of nodes traversed
        let counter = 0;

// Diagram: while (current !== null && counter < X - 1) {

            // Move to the next node
            current = current.next;

            // Increment the counter
            counter++;
        }

        // If the list is shorter than X-1, it's not possible to insert
        // the new node, so return head.
        if (current === null) {
            return head;
        }

        // Insert the new node after the node at position X-1.
        newNode.next = current.next;
        newNode.prev = current;
        current.next = newNode;
        if (newNode.next !== null) {
            newNode.next.prev = newNode;
        }

        // Return the updated head of the list
        return head;
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
    def insert_at_given_distance(
        self, head: Optional[ListNode], X: int, data: int
    ) -> Optional[ListNode]:

        # If the list is empty, head is None, and X is greater than 0,
        # it's not possible to insert the new node, so return None.
        if head is None and X > 0:
            return None

        # Create a new node with the given data.
        new_node = ListNode(data)

        # If X is 0, insert the new node at the beginning of the list.
        if X == 0:

            # Set the next pointer of the new node to the current head
            new_node.next = head

            # Set the prev pointer of the new node to None since it will
            # be the new head
            new_node.prev = None
            if head is not None:

                # Set the prev pointer of the current head to the new
                # node
                head.prev = new_node

            # Return the new node as the new head of the list
            return new_node

        # Traverse the list to find the node at position X-1.
        current = head

        # Counter to track the number of nodes traversed
        counter = 0

        while current is not None and counter < X - 1:

            # Move to the next node
            current = current.next

            # Increment the counter
            counter += 1

        # If the list is shorter than X-1, it's not possible to insert
        # the new node, so return head.
        if current is None:
            return head

        # Insert the new node after the node at position X-1.
        new_node.next = current.next
        new_node.prev = current
        current.next = new_node
        if new_node.next is not None:
            new_node.next.prev = new_node

        # Return the updated head of the list
        return head
```

## Complexity Analysis

Similarly to singly linked list, the time complexity of the insertion operation depends on the position at which the new node is inserted. Because linked lists do not support direct access to arbitrary positions, traversal may be required before insertion. The following cases describe the algorithm’s performance under different conditions.

### Best case

The best case occurs when `X` is equal to 0. In this case, the function must insert a node at the beginning of the list. This process takes **constant** time, regardless of the linked list's size.

// Diagram: Best case: Insert before the head node

### Worst case

On the other hand, the worst case occurs when X is equal to the length of the linked list. In this case, the function needs to insert the node at the end of the list, which takes linear time proportional to the length of the linked list, i.e., **O(N)**.

// Diagram: Worst case: Insert after the tail node

The function's space complexity is constant, as it only creates a few variables that take up a fixed amount of space regardless of the size of the linked list.

> **Best Case** - X = 0
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case** - X = length of the list
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Insert at given distance

## Problem Statement

Given the **head** of a doubly linked list, a distance **X**, and a **data** value, write a function to insert a new node with the given data value at a distance X from the start of the linked list and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\], X = 1, data = 6
> -   **Output:** \[5, 6, 7, 3, 10\]

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
    ListNode *insertAtGivenDistance(ListNode *head, int X, int data) {

        // If the list is empty, head is nullptr and X is greater than 0,
        // it's not possible to insert the new node, so return nullptr.
        if (head == nullptr && X > 0) {
            return nullptr;
        }

        // Create a new node with the given data.
        ListNode *newNode = new ListNode(data);

        // If X is 0, insert the new node at the beginning of the list.
        if (X == 0) {

            // Set the next pointer of the new node to the current head
            newNode->next = head;

            // Set the prev pointer of the new node to nullptr since it
            // will be the new head
            newNode->prev = nullptr;
            if (head != nullptr) {

                // Set the prev pointer of the current head to the new
                // node
                head->prev = newNode;
            }

            // Return the new node as the new head of the list
            return newNode;
        }

        // Traverse the list to find the node at position X-1.
        ListNode *current = head;

        // Counter to track the number of nodes traversed
        int counter = 0;

        while (current != nullptr && counter < X - 1) {

            // Move to the next node
            current = current->next;

            // Increment the counter
            counter++;
        }

        // If the list is shorter than X-1, it's not possible to insert
        // the new node, so return head.
        if (current == nullptr) {
            return head;
        }

        // Insert the new node after the node at position X-1.
        newNode->next = current->next;
        newNode->prev = current;
        current->next = newNode;
        if (newNode->next != nullptr) {
            newNode->next->prev = newNode;
        }

        // Return the updated head of the list
        return head;
    }
};
```
