# 4. Deletion in doubly linked lists

## Table of contents

1. [Understanding deletion of first node](#understanding-deletion-of-first-node)
2. [Delete first node](#delete-first-node)
3. [Understanding deletion of last node](#understanding-deletion-of-last-node)
4. [Delete last node](#delete-last-node)
5. [Understanding deletion by given data](#understanding-deletion-by-given-data)
6. [Delete node with given data](#delete-node-with-given-data)
7. [Delete nodes with given data](#delete-nodes-with-given-data)
8. [Understanding deletion after a given node](#understanding-deletion-after-the-given-node)
9. [Delete node after the given node](#delete-node-after-the-given-node)
10. [Understanding deletion before a given node](#understanding-deletion-before-a-given-node)
11. [Delete node before the given node](#delete-node-before-the-given-node)
12. [Understanding deletion of the given node](#understanding-deletion-of-the-given-node)
13. [Delete the given node](#delete-the-given-node)
14. [Understanding deletion at a given distance](#understanding-deletion-at-a-given-distance)
15. [Delete node at given distance](#delete-node-at-given-distance)

***

# Understanding deletion of first node

Deleting the first node is similar to **inserting at the beginning** and is also one of the simplest deletion operations. We need to consider two cases.

## 1\. The list is empty

When the list is empty, meaning it contains no elements, any attempt to delete a node is unnecessary because there are no nodes in the list. Since there is nothing to remove, the list remains unchanged. We can return the existing **head**, as the list is empty, and no node needs to be deleted.

// Diagram: The list is empty and X > 0

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 2. The list has only one node

Deleting the first node involves storing the reference to the current **head** in a temporary variable, updating the **head** to the next node in the list (which would be `null` in this case), and then deleting the old **head** node.

// Diagram: The list has only one node

> **Algorithm**
>
> -   **Step 1:** Delete the head node to free up memory.
> -   **Step 2:** Return \`null\` as the list is now empty.

## 3\. The list has more than one node

When removing the first node, we update the **head** to hold the reference of the second node in the list. We also set the pointer of the second node to `null` and then delete the first node. However, before updating the **head**, it's important to use a temporary variable to store the reference of the current head node so that we can delete it later.

// Diagram: The list has more than one node

> **Algorithm**
>
> -   **Step 1:** Create a temporary pointer to store the current head node.
> -   **Step 2:** Move the head pointer to the next node.
> -   **Step 3:** Set the \`previous\` pointer of the new head node to \`null\`.
> -   **Step 4:** Delete the original head node to free up memory.
> -   **Step 5:** Return the new head node.

## Implementation

When implementing the logic for deleting the first node operation, we consider both possible cases and write the code for each in conditional blocks.

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
    ListNode *deleteFirstNode(ListNode *head) {

        // Check if the list is empty (no nodes)
        if (head == nullptr) {

            // If the list is empty, there is nothing to delete, so
            // return nullptr
            return nullptr;
        }

        // Check if there is only one node in the list
        if (head->next == nullptr) {

            // Delete the single node
            delete head;

            // After deletion, the list becomes empty, so return nullptr
            return nullptr;
        }

        // If there are multiple nodes in the list
        // Store the first node in a temporary pointer
        ListNode *nodeToBeDeleted = head;

        // Update the head to point to the second node
        head = head->next;

        // Update the previous pointer of the new head to nullptr
        head->prev = nullptr;

        // Delete the first node
        delete nodeToBeDeleted;

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
    public ListNode deleteFirstNode(ListNode head) {

        // Check if the list is empty (no nodes)
        if (head == null) {

            // If the list is empty, there is nothing to delete, so
            // return null
            return null;
        }

        // Check if there is only one node in the list
        if (head.next == null) {

            // Delete the single node
            head = null;

            // After deletion, the list becomes empty, so return null
            return null;
        }

        // If there are multiple nodes in the list
        // Store the first node in a temporary pointer
        ListNode nodeToBeDeleted = head;

        // Update the head to point to the second node
        head = head.next;

        // Update the previous pointer of the new head to null
        head.prev = null;

        // Delete the first node
        nodeToBeDeleted = null;

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
    deleteFirstNode(head: ListNode | null): ListNode | null {

        // Check if the list is empty (no nodes)
        if (head === null) {

            // If the list is empty, there is nothing to delete, so
            // return null
            return null;
        }

        // Check if there is only one node in the list
        if (head.next === null) {

            // Delete the single node
            head = null;

            // After deletion, the list becomes empty, so return null
            return null;
        }

        // If there are multiple nodes in the list
        // Store the first node in a temporary pointer
        let nodeToBeDeleted: ListNode | null = head;

        // Update the head to point to the second node
        head = head.next;

        // Update the previous pointer of the new head to null
        head.prev = null;

        // Delete the first node
        nodeToBeDeleted = null;

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
    deleteFirstNode(head) {

        // Check if the list is empty (no nodes)
        if (head === null) {

            // If the list is empty, there is nothing to delete, so
            // return null
            return null;
        }

        // Check if there is only one node in the list
        if (head.next === null) {

            // Delete the single node
            head = null;

            // After deletion, the list becomes empty, so return null
            return null;
        }

        // If there are multiple nodes in the list
        // Store the first node in a temporary pointer
        let nodeToBeDeleted = head;

        // Update the head to point to the second node
        head = head.next;

        // Update the previous pointer of the new head to null
        head.prev = null;

        // Delete the first node
        nodeToBeDeleted = null;

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
    def delete_first_node(
        self, head: Optional[ListNode]
    ) -> Optional[ListNode]:

        # Check if the list is empty (no nodes)
        if head is None:

            # If the list is empty, there is nothing to delete, so return
            # None
            return None

        # Check if there is only one node in the list
        if head.next is None:

            # Delete the single node
            del head

            # After deletion, the list becomes empty, so return None
            return None

        # If there are multiple nodes in the list
        # Store the first node in a temporary pointer
        nodeToBeDeleted = head

        # Update the head to point to the second node
        head = head.next

        # Update the previous pointer of the new head to None
        if head:
            head.prev = None

        # Delete the first node
        del nodeToBeDeleted

        # Return the updated head of the list
        return head
```

## Complexity analysis

Looking at the logic, it is straightforward to understand the complexity of this operation in terms of time and space. In any case, we delete the first node and change the value of the head. Since we already have access to the **head** node, this operation will take constant time and space.

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

# Delete first node

## Problem Statement

Given the **head** of a doubly linked list, write a function to delete the first node from this list and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\]
> -   **Output:** \[7, 3, 10\]

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
    ListNode *deleteFirstNode(ListNode *head) {

        // Check if the list is empty (no nodes)
        if (head == nullptr) {

            // If the list is empty, there is nothing to delete, so
            // return nullptr
            return nullptr;
        }

        // Check if there is only one node in the list
        if (head->next == nullptr) {

            // Delete the single node
            delete head;

            // After deletion, the list becomes empty, so return nullptr
            return nullptr;
        }

        // If there are multiple nodes in the list
        // Store the first node in a temporary pointer
        ListNode *nodeToBeDeleted = head;

        // Update the head to point to the second node
        head = head->next;

        // Update the previous pointer of the new head to nullptr
        head->prev = nullptr;

        // Delete the first node
        delete nodeToBeDeleted;

        // Return the updated head of the list
        return head;
    }
};
```

***

# Understanding deletion of last node

Deleting the last node in a doubly linked list is similar to **deleting the first node**. This is because we can access both the tail node and the previous pointer in each node. Let's go through all the cases we need to consider.

## 1\. The list is empty

When the list is empty, meaning it contains no elements, any attempt to delete a node is unnecessary because there are no nodes in the list. Since there is nothing to remove, the list remains unchanged. We can return the existing **tail**, as the list is empty, and no node needs to be deleted.

// Diagram: The list is empty

> **Algorithm**
>
> -   **Step 1:** Return the original tail node.

## 2\. The list has only one node

Deleting the last node in a linked list is the same as deleting the first node if there's only one node. The process involves storing the reference to the current **tail** in a temporary variable, updating the **tail** to the previous node in the list (which would be `null` in this case), and then deleting the old **tail** node.

// Diagram: The list has only one node

> **Algorithm**
>
> -   **Step 1:** Delete the tail node to free up memory.
> -   **Step 2:** Return \`null\` as the list is now empty.

## 3\. The list has more than one node

When removing the last node, we update the **tail** to hold the reference of the second last node in the list. We also set the  pointer of the second last node to `null` and then delete the last node. However, before updating the **tail**, it's important to use a temporary variable to store the reference of the current tail node so that we can delete it later.

// Diagram: The list has more than one node

> **Algorithm**
>
> -   **Step 1:** Create a temporary pointer to store the current tail node.
> -   **Step 2:** Move the tail pointer to the previous node.
> -   **Step 3:** Set the \`next\` pointer of the new tail node to \`null\`.
> -   **Step 4:** Delete the original head node to free up memory.
> -   **Step 5:** Return the new tail node.

## Implementation

When implementing the logic for deleting the last node operation, we consider all the possible cases and subcases and write the code for each in conditional blocks.

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
    ListNode *deleteLastNode(ListNode *tail) {

        // If the list is empty, there is nothing to delete, so return
        // nullptr
        if (tail == nullptr) {
            return nullptr;
        }

        // Check if there is only one node in the list
        if (tail->prev == nullptr) {

            // Delete the single node
            delete tail;

            // After deletion, the list becomes empty, so return nullptr
            return nullptr;
        }

        // If there are multiple nodes in the list
        // Store the last node (tail) in a temporary pointer
        ListNode *nodeToBeDeleted = tail;

        // Update the tail to point to the second-to-last node
        tail = tail->prev;

        // Update the next pointer of the new tail to nullptr
        tail->next = nullptr;

        // Delete the last node
        delete nodeToBeDeleted;

        // Return the updated tail of the list
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
    public ListNode deleteLastNode(ListNode tail) {

        // If the list is empty, there is nothing to delete, so return
        // null
        if (tail == null) {
            return null;
        }

        // Check if there is only one node in the list
        if (tail.prev == null) {

            // Delete the single node
            tail = null;

            // After deletion, the list becomes empty, so return null
            return null;
        }

        // If there are multiple nodes in the list
        // Store the last node (tail) in a temporary pointer
        ListNode nodeToBeDeleted = tail;

        // Update the tail to point to the second-to-last node
        tail = tail.prev;

        // Update the next pointer of the new tail to null
        tail.next = null;

        // Delete the last node
        nodeToBeDeleted = null;

        // Return the updated tail of the list
        return tail;
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
    deleteLastNode(tail: ListNode | null): ListNode | null {

        // If the list is empty, there is nothing to delete, so return
        // null
        if (tail === null) {
            return null;
        }

        // Check if there is only one node in the list
        if (tail.prev === null) {

            // Delete the single node
            tail = null;

            // After deletion, the list becomes empty, so return null
            return null;
        }

        // If there are multiple nodes in the list
        // Store the last node (tail) in a temporary pointer
        let nodeToBeDeleted: ListNode | null = tail;

        // Update the tail to point to the second-to-last node
        tail = tail.prev;

        // Update the next pointer of the new tail to null
        tail.next = null;

        // Delete the last node
        nodeToBeDeleted = null;

        // Return the updated tail of the list
        return tail;
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
    deleteLastNode(tail) {

        // If the list is empty, there is nothing to delete, so return
        // null
        if (tail === null) {
            return null;
        }

        // Check if there is only one node in the list
        if (tail.prev === null) {

            // Delete the single node
            tail = null;

            // After deletion, the list becomes empty, so return null
            return null;
        }

        // If there are multiple nodes in the list
        // Store the last node (tail) in a temporary pointer
        let nodeToBeDeleted = tail;

        // Update the tail to point to the second-to-last node
        tail = tail.prev;

        // Update the next pointer of the new tail to null
        tail.next = null;

        // Delete the last node
        nodeToBeDeleted = null;

        // Return the updated tail of the list
        return tail;
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
    def delete_last_node(
        self, tail: Optional[ListNode]
    ) -> Optional[ListNode]:

        # If the list is empty, there is nothing to delete, so return
        # null
        if tail is None:
            return None

        # Check if there is only one node in the list
        if tail.prev is None:

            # Delete the single node
            tail = None

            # After deletion, the list becomes empty, so return None
            return None

        # If there are multiple nodes in the list
        # Store the last node (tail) in a temporary pointer
        node_to_be_deleted: ListNode = tail

        # Update the tail to point to the second-to-last node
        tail = tail.prev

        # Update the next pointer of the new tail to None
        if tail:
            tail.next = None

        # Delete the last node
        del node_to_be_deleted

        # Return the updated tail of the list
        return tail
```

## Complexity analysis

Looking at the logic, it is straightforward to understand the complexity of this operation in terms of time and space. In any case, we delete the first node and change the value of the head. Since we already have access to the **tail** node, this operation will take constant time and space.

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

# Delete last node

## Problem Statement

Given the **tail** of a doubly linked list, write a function to delete the last node from this linked list and return the tail of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\]
> -   **Output:** \[5, 7, 3\]

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
    ListNode *deleteLastNode(ListNode *tail) {

        // If the list is empty, there is nothing to delete, so return
        // nullptr
        if (tail == nullptr) {
            return nullptr;
        }

        // Check if there is only one node in the list
        if (tail->prev == nullptr) {

            // Delete the single node
            delete tail;

            // After deletion, the list becomes empty, so return nullptr
            return nullptr;
        }

        // If there are multiple nodes in the list
        // Store the last node (tail) in a temporary pointer
        ListNode *nodeToBeDeleted = tail;

        // Update the tail to point to the second-to-last node
        tail = tail->prev;

        // Update the next pointer of the new tail to nullptr
        tail->next = nullptr;

        // Delete the last node
        delete nodeToBeDeleted;

        // Return the updated tail of the list
        return tail;
    }
};
```

***

# Understanding deletion by given data

Just like in a singly linked list, deleting a node with a given data in a doubly linked list can be done by using the search operation. Instead of returning the data after finding it, we delete it during this operation. Let’s explore the possible scenarios to consider when deleting a node with the given data.

## 1\. The list is empty

When the list is empty, meaning it contains no elements, any attempt to delete a node is unnecessary because there are no nodes in the list. Since there is nothing to remove, the list remains unchanged. We can return the existing **head**, as the list is empty, and no node needs to be deleted.

// Diagram: The list is empty

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 2\. The first node is deleted

If the data matches the first node, this case becomes the same as **deleting the first node**. We update the **head** to store the reference to the second node and delete the old head.

// Diagram: The first node is deleted

> **Algorithm**
>
> -   **Step 1:** Create a temporary pointer to store the current head node.
> -   **Step 2:** Move the head pointer to the next node.
> -   **Step 3:** Set the \`previous\` pointer of the new head node to \`null\`.
> -   **Step 4:** Delete the original head node to free up memory.
> -   **Step 5:** Return the new head node.

## 3\. The node to be deleted is not the first node

We need access to the node one step before it to delete a node that is not the first node of the linked list. This information can be obtained from the node's pointer. Deleting a node from within the list involves a four-step process.

// Diagram: The node to be deleted is not the first node

> **Algorithm**
>
> -   **Step 1:** Traverse the list, keeping track of \`current\` node until reaching the given node.
> -   **Step 2:** Set the \`next\` pointer of the node before the \`current\` node to hold the reference of the node after the \`current\` node.
> -   **Step 3:** Set the \`previous\` pointer of the node after the \`current\` node to hold the reference of the node before the \`current\` node.
> -   **Step 4:** Delete the \`current\` node to free up memory.
> -   **Step 5:** Return the original head node.

## 4\. The node to be deleted could not be found 

If the data provided does not match the data of any node in the linked list, then such a node does not exist in the list, so we return the existing **head**.

// Diagram: The node to be deleted is not the first node

> **Algorithm**
>
> -   **Step 1:** Traverse the list, keeping track of \`current\` node until reaching the given node.
> -   **Step 2:** Return the original head node.

## Implementation

When implementing the logic for deleting a node with a given data operation, we consider all the possible cases and write the code for each in conditional blocks.

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
    ListNode *deleteNodeWithGivenData(ListNode *head, int data) {

        // If the list is empty, there is nothing to delete, so return
        // nullptr
        if (head == nullptr) {
            return nullptr;
        }

        // If the first node's value matches the target data, delete the
        // first node
        if (head->val == data) {

            // Store the current head in a separate variable to be
            // deleted later
            ListNode *nodeToBeDeleted = head;

            // Move the head to the next node in the list
            head = head->next;

            // If the new head exists, update its previous pointer to be
            // nullptr, as it is now the first node
            if (head != nullptr) {
                head->prev = nullptr;
            }

            // Delete the node with the target data
            delete nodeToBeDeleted;

            // Return the new head of the list
            return head;
        }

        // Pointer to the current node, starting from the head
        ListNode *current = head->next;

        // If the target data is not in the first node, search for it in
        // the rest of the list
        while (current != nullptr && current->val != data) {

            // Continue traversing the list until the target data is
            // found or the end of the list is reached
            current = current->next;
        }

        // If the target data is not found in the list, return the head
        if (current == nullptr) {
            return head;
        }

        // If the target data is found, remove the node from the list
        current->prev->next = current->next;

        // If the next node exists, update its previous pointer to skip
        // the deleted node
        if (current->next) {
            current->next->prev = current->prev;
        }

        // Delete the node with the target data
        delete current;

        // Return the head of the list, with the target data node removed
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
    public ListNode deleteNodeWithGivenData(ListNode head, int data) {

        // If the list is empty, there is nothing to delete, so return
        // null
        if (head == null) {
            return null;
        }

        // If the first node's value matches the target data, delete the
        // first node
        if (head.val == data) {

            // Store the current head in a separate variable to be
            // deleted later
            ListNode nodeToBeDeleted = head;

            // Move the head to the next node in the list
            head = head.next;

            // If the new head exists, update its previous pointer to be
            // null, as it is now the first node
            if (head != null) {
                head.prev = null;
            }

            // Delete the node with the target data by dereferencing it
            nodeToBeDeleted = null;

            // Return the new head of the list
            return head;
        }

        // Pointer to the current node, starting from the second node
        ListNode current = head.next;

        // If the target data is not in the first node, search for it in
        // the rest of the list
        while (current != null && current.val != data) {

            // Continue traversing the list until the target data is
            // found or the end of the list is reached
            current = current.next;
        }

        // If the target data is not found in the list, return the head
        if (current == null) {
            return head;
        }

        // If the target data is found, remove the node from the list
        current.prev.next = current.next;

        // If the next node exists, update its previous pointer to skip
        // the deleted node
        if (current.next != null) {
            current.next.prev = current.prev;
        }

        // Delete the node with the target data by dereferencing it
        current = null;

        // Return the head of the list, with the target data node removed
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
    deleteNodeWithGivenData(
        head: ListNode | null,
        data: number
    ): ListNode | null {

        // If the list is empty, there is nothing to delete, so return
        // null
        if (head === null) {
            return null;
        }

        // If the first node's value matches the target data, delete the
        // first node
        if (head.val === data) {

            // Store the current head in a separate variable to be
            // deleted later
            let nodeToBeDeleted = head;

            // Move the head to the next node in the list
            head = head.next;

            // If the new head exists, update its previous pointer to be
            // null, as it is now the first node
            if (head !== null) {
                head.prev = null;
            }

            // Dereference nodeToBeDeleted for garbage collection
            nodeToBeDeleted = null;

            // Return the new head of the list
            return head;
        }

        // Pointer to the current node, starting from the second node
        let current = head.next;

        // If the target data is not in the first node, search for it in
        // the rest of the list
        while (current !== null && current.val !== data) {

            // Continue traversing the list until the target data is
            // found or the end of the list is reached
            current = current.next;
        }

        // If the target data is not found in the list, return the head
        if (current === null) {
            return head;
        }

        // If the target data is found, remove the node from the list
        current.prev!.next = current.next;

        // If the next node exists, update its previous pointer to skip
        // the deleted node
        if (current.next !== null) {
            current.next.prev = current.prev;
        }

        // Dereference current for garbage collection
        current = null;

        // Return the head of the list, with the target data node removed
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
    deleteNodeWithGivenData(head, data) {

        // If the list is empty, there is nothing to delete, so return
        // null
        if (head === null) {
            return null;
        }

        // If the first node's value matches the target data, delete the
        // first node
        if (head.val === data) {

            // Store the current head in a separate variable to be
            // deleted later
            let nodeToBeDeleted = head;

            // Move the head to the next node in the list
            head = head.next;

            // If the new head exists, update its previous pointer to be
            // null, as it is now the first node
            if (head !== null) {
                head.prev = null;
            }

            // Delete the node with the target data
            nodeToBeDeleted = null;

            // Return the new head of the list
            return head;
        }

        // Pointer to the current node, starting from the second node
        let current = head.next;

        // If the target data is not in the first node, search for it in
        // the rest of the list
        while (current !== null && current.val !== data) {

            // Continue traversing the list until the target data is
            // found or the end of the list is reached
            current = current.next;
        }

        // If the target data is not found in the list, return the head
        if (current === null) {
            return head;
        }

        // If the target data is found, remove the node from the list
        current.prev.next = current.next;

        // If the next node exists, update its previous pointer to skip
        // the deleted node
        if (current.next !== null) {
            current.next.prev = current.prev;
        }

        // Delete the node with the target data
        current = null;

        // Return the head of the list, with the target data node removed
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
    def delete_node_with_given_data(
        self, head: Optional[ListNode], data: int
    ) -> Optional[ListNode]:

        # If the list is empty, there is nothing to delete, so return
        # None
        if head is None:
            return None

        # If the first node's value matches the target data, delete the
        # first node
        if head.val == data:

            # Store the current head in a separate variable to be deleted
            # later
            node_to_be_deleted = head

            # Move the head to the next node in the list
            head = head.next

            # If the new head exists, update its previous pointer to be
            # None, as it is now the first node
            if head is not None:
                head.prev = None

            # Dereference node_to_be_deleted for garbage collection
            node_to_be_deleted = None

            # Return the new head of the list
            return head

        # Pointer to the current node, starting from the second node
        current = head.next

        # If the target data is not in the first node, search for it in
        # the rest of the list
        while current is not None and current.val != data:

            # Continue traversing the list until the target data is found
            # or the end of the list is reached
            current = current.next

        # If the target data is not found in the list, return the head
        if current is None:
            return head

        # If the target data is found, remove the node from the list
        current.prev.next = current.next

        # If the next node exists, update its previous pointer to skip
        # the deleted node
        if current.next is not None:
            current.next.prev = current.prev

        # Dereference current for garbage collection
        current = None

        # Return the head of the list, with the target data node removed
        return head
```

## Complexity Analysis

Similar to singly linked list, the time complexity of deleting a node with the given data depends on the position of the node in the linked list. Since the list must be traversed to locate the node containing the specified data, the number of operations varies based on where the node is found.

### Best case

The best case occurs when the given data matches the first node. In this case, the function must delete the first node of the list. This process takes **constant** time, regardless of the linked list's size.

// Diagram: Best case: Delete the head node

### Worst case

On the other hand, the worst case occurs when the given data matches the last node. In this case, the function must delete the last node of the list. This process takes linear time proportional to the length of the linked list, i.e., **O(N)**.

// Diagram: Worst case: Delete the tail node

In a doubly-linked list, we can traverse the list in either direction to find a specific node. If we traverse from the **tail** node to the **head** node (in the reverse direction), deleting the first node becomes the worst-case scenario instead of deleting the last node. In the current implementation, we are traversing from the **head** node to the **tail** node, so the worst-case scenario is deleting the last node.

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

Given the **head** of a doubly linked list and a **data** value, write a function to delete the first node with the given data from the list and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\], data = 3
> -   **Output:** \[5, 7, 10\]

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
    ListNode *deleteNodeWithGivenData(ListNode *head, int data) {

        // If the list is empty, there is nothing to delete, so return
        // nullptr
        if (head == nullptr) {
            return nullptr;
        }

        // If the first node's value matches the target data, delete the
        // first node
        if (head->val == data) {

            // Store the current head in a separate variable to be
            // deleted later
            ListNode *nodeToBeDeleted = head;

            // Move the head to the next node in the list
            head = head->next;

            // If the new head exists, update its previous pointer to be
            // nullptr, as it is now the first node
            if (head != nullptr) {
                head->prev = nullptr;
            }

            // Delete the node with the target data
            delete nodeToBeDeleted;

            // Return the new head of the list
            return head;
        }

        // Pointer to the current node, starting from the head
        ListNode *current = head->next;

        // If the target data is not in the first node, search for it in
        // the rest of the list
        while (current != nullptr && current->val != data) {

            // Continue traversing the list until the target data is
            // found or the end of the list is reached
            current = current->next;
        }

        // If the target data is not found in the list, return the head
        if (current == nullptr) {
            return head;
        }

        // If the target data is found, remove the node from the list
        current->prev->next = current->next;

        // If the next node exists, update its previous pointer to skip
        // the deleted node
        if (current->next) {
            current->next->prev = current->prev;
        }

        // Delete the node with the target data
        delete current;

        // Return the head of the list, with the target data node removed
        return head;
    }
};
```

***

# Delete nodes with given data

## Problem Statement

Given the **head** of a doubly linked list and a **data** value, write a function to delete **all** the nodes with the given data from the list and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10, 3\], data = 3
> -   **Output:** \[5, 7, 10\]

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
    ListNode *deleteNodesWithGivenData(ListNode *head, int data) {

        // Check if the head is nullptr (empty list)
        if (head == nullptr) {
            return nullptr;
        }

        // Delete nodes with the given data at the beginning of the list
        while (head != nullptr && head->val == data) {

            // Store the node to delete
            ListNode *nodeToDelete = head;

            // Move the head pointer to the next node
            head = head->next;

            // Update the previous pointer of the new head
            if (head != nullptr) {
                head->prev = nullptr;
            }

            // Delete the node
            delete nodeToDelete;
        }

        // If the list is empty after deleting nodes at the beginning
        if (head == nullptr) {
            return nullptr;
        }

        // Iterate through the rest of the list to delete nodes with the
        // given data
        ListNode *previous = head;
        ListNode *current = head->next;

        while (current != nullptr) {

            // Delete nodes with the given data
            while (current != nullptr && current->val == data) {
                ListNode *nodeToDelete = current;
                current = current->next;
                delete nodeToDelete;
            }

            // Update the previous pointer to skip the deleted nodes
            previous->next = current;
            if (current != nullptr) {
                current->prev = previous;
            }

            // Move the previous and current pointers forward
            previous = current;
            if (current != nullptr) {
                current = current->next;
            }
        }

        // Return the modified head of the list
        return head;
    }
};
```

***

# Understanding deletion after the given node

This case remains more or less the same as its counterpart in a singly linked list. Here, as an extra step, we also need to update the pointer after the deletion operation, but we have already done it for other operations, so you must be familiar with it by now. Let's examine all the cases we need to consider.

## 1\. The list is empty

If the list is empty and contains no elements, we cannot find the given node because it does not exist within the list. Deleting the node after the given node is not possible because there is no reference point within the list to perform the deletion. In this case, we can return the existing **head**, as the list is empty, and no node needs to be deleted.

// Diagram: The list is empty

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 2\. The given node is the last node

When the given node is the last node in the list, attempting to delete a node after it becomes an invalid operation. This is because, by definition, the last node has no successor, i.e., no node following it in the sequence. We can return the **head** because no other operation needs to be done.

// Diagram: The given node is the last node

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 3\. The given node is not the last node

To delete a node after a given node, we can update the  pointer of the given node to skip over the node that needs to be deleted. Then, we can remove the node that we want to delete. However, since it is a doubly linked list, we must also update the pointers of the nodes involved.

// Diagram: The given node is not the last node

> **Algorithm**
>
> -   **Step 1:** Create a temporary pointer to store the node's reference after the \`given\` node.
> -   **Step 2:** Set the \`given\` node's \`next\` pointer to hold the reference of the node stored in the \`next\` pointer of the node after the \`given\` node.
> -   **Step 3:** Set the \`previous\` pointer of the node after the \`given\` node to hold the reference of the \`given\` node.
> -   **Step 4:** Delete the node after the given node to free up memory.
> -   **Step 5:** Return the original head node.

## Implementation

When implementing the logic for deleting a node after a given node operation, we consider all the possible cases and write the code for each in conditional blocks.

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

        // Check if the node to be deleted is not the last node in the
        // list
        if (nodeToBeDeleted->next != nullptr) {

            // Point the previous node of the node to be deleted to given
            // node
            nodeToBeDeleted->next->prev = node;
        }

        // Delete the node after given node
        delete nodeToBeDeleted;

        // Return the original head.
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

        // Check if the node to be deleted is not the last node in the
        // list
        if (nodeToBeDeleted.next != null) {

            // Point the previous node of the node to be deleted to the
            // given node
            nodeToBeDeleted.next.prev = node;
        }

        // Dereference nodeToBeDeleted to allow garbage collection
        nodeToBeDeleted = null;

        // Return the original head.
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
        let nodeToBeDeleted = node.next;

        // Link the current node (node) to the node after the one being
        // deleted.
        node.next = nodeToBeDeleted.next;

        // Check if the node to be deleted is not the last node in the
        // list
        if (nodeToBeDeleted.next !== null) {

            // Point the previous node of the node to be deleted to the
            // given node
            nodeToBeDeleted.next.prev = node;
        }

        // Dereference nodeToBeDeleted for garbage collection
        nodeToBeDeleted = null;

        // Return the original head.
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
        let nodeToBeDeleted = node.next;

        // Link the current node (node) to the node after the one being
        // deleted.
        node.next = nodeToBeDeleted.next;

        // Check if the node to be deleted is not the last node in the
        // list
        if (nodeToBeDeleted.next !== null) {

            // Point the previous node of the node to be deleted to the
            // given node
            nodeToBeDeleted.next.prev = node;
        }

        // Dereference nodeToBeDeleted for garbage collection
        nodeToBeDeleted = null;

        // Return the original head.
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
        node_to_be_deleted = node.next

        # Link the current node (node) to the node after the one being
        # deleted.
        node.next = node_to_be_deleted.next

        # Check if the node to be deleted is not the last node in the
        # list
        if node_to_be_deleted.next is not None:

            # Point the previous node of the node to be deleted to the
            # given node
            node_to_be_deleted.next.prev = node

        # Dereference node_to_be_deleted for garbage collection
        node_to_be_deleted = None

        # Return the original head.
        return head
```

## Complexity Analysis

We need to make some pointer manipulations to delete the node. Therefore, the time complexity is constant. Similarly, we don't create any new nodes in all cases, so the space complexity is also constant, i.e., **O(1)**.

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

Given the **head** of a doubly linked list and a **random** **node** in a linked list, write a function to delete the node after the given node and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\], node = 7
> -   **Output:** \[5, 7, 10\]

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

        // Check if the node to be deleted is not the last node in the
        // list
        if (nodeToBeDeleted->next != nullptr) {

            // Point the previous node of the node to be deleted to given
            // node
            nodeToBeDeleted->next->prev = node;
        }

        // Delete the node after given node
        delete nodeToBeDeleted;

        // Return the original head.
        return head;
    }
};
```

***

# Understanding deletion before a given node

Deleting a node before the given node is an operation that gives a doubly linked list a significant advantage over a singly linked list. In a singly linked list, the implementation of this operation is complicated as it requires keeping a `previousToPrevious` reference variable to delete the node before a given node.

However, in a doubly linked list, we can access the nodes in the reverse direction using the pointer stored in every node, making the entire operation much simpler. Let's examine all the possible cases for deleting a node before the given node in a doubly linked list.

## 1\. The list is empty

If the list is empty and contains no elements, we cannot find the given node because it does not exist within the list. Deleting the node after the given node is not possible because there is no reference point within the list to perform the deletion. In this case, we can return the existing **head**, as the list is empty, and no node needs to be deleted.

// Diagram: The list is empty

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 2\. The given node is the first node

When the given node is the first node in the list, attempting to delete a node before it becomes an invalid operation. This is because, by definition, the first node has no predecessor, i.e., no node preceding it in the sequence. We can return the **head** because no other operation needs to be done.

// Diagram: The given node is the first node

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 3\. The given node is the second node

This is a unique situation because removing the node before the second node essentially means deleting the linked list's head node. As learned earlier, this scenario is identical to **deleting the first node**. We need to update the head to store the reference to the second node and then delete the old head.

// Diagram: The list has more than one node

> **Algorithm**
>
> -   **Step 1:** Create a temporary pointer to store the current head node.
> -   **Step 2:** Move the head pointer to the next node.
> -   **Step 3:** Set the \`previous\` pointer of the new head node to \`null\`.
> -   **Step 4:** Delete the original head node to free up memory.
> -   **Step 5:** Return the new head node.

## 4\. The given node is any other node

Deleting a node before a given node is similar to **deleting the given node**. The only difference is that the node to be deleted is the one before the given node. This process involves four steps.

// Diagram: The given node is any other node

> **Algorithm**
>
> -   **Step 1:** Create a temporary pointer to store the reference of the node before the \`given\` node.
> -   **Step 2:** Set the given node's \`previous\` pointer to hold the reference of the node before the node to be deleted.
> -   **Step 3:** Set \`next\` pointer of the node before the to-be-deleted node to hold the reference of the \`given\` node.
> -   **Step 4:** Delete the node before the \`given\` node to free up memory.
> -   **Step 5:** Return the original head node.

## Implementation

When implementing the logic for deleting the node before the given node, we consider all the possible cases and write the code for each in conditional blocks. 

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

            // Update the new head's previous pointer to null
            head->prev = nullptr;

            // Delete the node before the given node
            delete nodeToBeDeleted;
            return head;
        }

        // If the node before the given node is not the head,
        // update the pointers of the neighboring nodes and delete the
        // node before the given node

        // Get the node before the given node
        ListNode *nodeToBeDeleted = node->prev;

        // Update the previous pointer of the given node
        node->prev = nodeToBeDeleted->prev;
        if (nodeToBeDeleted->prev != nullptr) {

            // Update the next pointer of the node before the given node
            nodeToBeDeleted->prev->next = node;
        }

        // Delete the node before the given node
        delete nodeToBeDeleted;

        // Return the head of the updated linked list
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

            // Update the new head's previous pointer to null
            head.prev = null;

            // Dereference for garbage collection
            nodeToBeDeleted = null;
            return head;
        }

        // If the node before the given node is not the head,
        // update the pointers of the neighboring nodes and delete the
        // node before the given node

        // Get the node before the given node
        ListNode nodeToBeDeleted = node.prev;

        // Update the previous pointer of the given node
        node.prev = nodeToBeDeleted.prev;
        if (nodeToBeDeleted.prev != null) {

            // Update the next pointer of the node before the given node
            nodeToBeDeleted.prev.next = node;
        }

        // Dereference for garbage collection
        nodeToBeDeleted = null;

        // Return the head of the updated linked list
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
            let nodeToBeDeleted: ListNode | null = head;
            head = head.next;

            // Update the new head's previous pointer to null
            head.prev = null;

            // Dereference for garbage collection
            nodeToBeDeleted = null;
            return head;
        }

        // Get the node before the given node
        let nodeToBeDeleted: ListNode | null = node.prev;

        // Update the previous pointer of the given node
        node.prev = nodeToBeDeleted.prev;
        if (nodeToBeDeleted.prev !== null) {

            // Update the next pointer of the node before the given node
            nodeToBeDeleted.prev.next = node;
        }

        // Dereference for garbage collection
        nodeToBeDeleted = null;

        // Return the head of the updated linked list
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

            // Update the new head's previous pointer to null
            head.prev = null;

            // Dereference  for garbage collection
            nodeToBeDeleted = null;
            return head;
        }

        // Get the node before the given node
        let nodeToBeDeleted = node.prev;

        // Update the previous pointer of the given node
        node.prev = nodeToBeDeleted.prev;
        if (nodeToBeDeleted.prev !== null) {

            // Update the next pointer of the node before the given node
            nodeToBeDeleted.prev.next = node;
        }

        // Dereference for garbage collection
        nodeToBeDeleted = null;

        // Return the head of the updated linked list
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

            # Update the new head's previous pointer to None
            head.prev = None

            # Dereference for garbage collection
            node_to_be_deleted = None
            return head

        # Get the node before the given node
        node_to_be_deleted = node.prev

        # Update the previous pointer of the given node
        node.prev = node_to_be_deleted.prev
        if node_to_be_deleted.prev is not None:

            # Update the next pointer of the node before the given node
            node_to_be_deleted.prev.next = node

        # Dereference for garbage collection
        node_to_be_deleted = None

        # Return the head of the updated linked list
        return head
```

## Complexity Analysis

Similar to singly linked list, the time complexity of deleting a node before a given node depends on the position of the target node in the linked list. Since the list must be traversed to locate the node and its predecessor, the number of operations varies based on where the deletion occurs.

### Best case

The best case occurs when the given node is the second node of the list. In this case, the function must delete the first node of the list. This process takes**constant**time, regardless of the linked list's size.

// Diagram: Best case: Delete the head node

### Worst case

On the other hand, the worst case occurs when the given data matches the last node. In this case, the function must delete the second last node of the list. This process takes linear time proportional to the length of the linked list, i.e.,**O(N)**.

// Diagram: Worst case: Delete the tail node

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

# Delete node before the given node

## Problem Statement

Given the **head** of a doubly linked list and a **random node** in the list, write a function to delete the node before the given node and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\], node = 3
> -   **Output:** \[5, 3, 10\]

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

            // Update the new head's previous pointer to null
            head->prev = nullptr;

            // Delete the node before the given node
            delete nodeToBeDeleted;
            return head;
        }

        // If the node before the given node is not the head,
        // update the pointers of the neighbouring nodes and delete the
        // node before the given node

        // Get the node before the given node
        ListNode *nodeToBeDeleted = node->prev;

        // Update the previous pointer of the given node
        node->prev = nodeToBeDeleted->prev;
        if (nodeToBeDeleted->prev != nullptr) {

            // Update the next pointer of the node before the given node
            nodeToBeDeleted->prev->next = node;
        }

        // Delete the node before the given node
        delete nodeToBeDeleted;

        // Return the head of the updated linked list
        return head;
    }
};
```

***

# Understanding deletion of the given node

This is another scenario where a doubly linked list outperforms a singly linked list. The presence of a pointer in each node eliminates the need to traverse the list to locate the node immediately preceding the one that needs to be deleted. Let's examine all the potential cases we need to consider.

## 1\. The list is empty

If the list is empty and contains no elements, we cannot find the given node because it does not exist within the list. Therefore, deleting the given node is not possible because there is no reference point within the list to perform the deletion. In this case, we can return the existing **head**, as the list is empty, and no node needs to be deleted.

// Diagram: The list is empty

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 2\. The first node is deleted

If the given node matches the first node, this case becomes the same as **deleting the first node**. We update the head to store the reference to the second node and delete the old head.

// Diagram: The first node is deleted

> **Algorithm**
>
> -   **Step 1:** Create a temporary pointer to store the current head node.
> -   **Step 2:** Move the head pointer to the next node.
> -   **Step 3:** Set the \`previous\` pointer of the new head node to \`null\`.
> -   **Step 4:** Delete the original head node to free up memory.
> -   **Step 5:** Return the new head node.

## 3\. The node to be deleted is not the first node

This case is super easy as it is very similar to**deleting the node with given data** but even easier as we do not need to traverse the linked list to find the node to be deleted. We already have the node to be deleted and need to update some references in the linked list to delete it. Deletion of a given node from between the list is a 3-step process.

// Diagram: The node to be deleted is not the first node

> **Algorithm**
>
> -   **Step 1:** Set the \`next\` pointer of the node before the \`given\` node to hold the reference of the node after the \`given\` node.
> -   **Step 2:** Set the \`previous\` pointer of the node after the \`given\` node to hold the reference of the node before the \`given\` node.
> -   **Step 3:** Delete the \`given\` node to free up memory.
> -   **Step 4:** Return the original head node.

## Implementation

When implementing the logic for deleting a node with a given data operation, we consider all the possible cases and write the code for each in conditional blocks.

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
    ListNode *deleteTheGivenNode(ListNode *head, ListNode *node) {

        // If the list is empty or the given node is null, there's
        // nothing to do
        if (head == nullptr || node == nullptr) {
            return head;
        }

        // If the node to be deleted is the head node
        if (node == head) {
            head = head->next;

            // If there is a new head, update its previous pointer to
            // null
            if (head != nullptr) {
                head->prev = nullptr;
            }

            // Delete the given node
            delete node;
            return head;
        }

        // If the node to be deleted is not the head node
        // Update the previous node's next pointer to skip the given node
        node->prev->next = node->next;

        // If the node to be deleted is not the last node in the list
        // Update the next node's previous pointer to skip the given node
        if (node->next) {
            node->next->prev = node->prev;
        }

        // Delete the given node
        delete node;

        // Return the original head of the list
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
    public ListNode deleteTheGivenNode(ListNode head, ListNode node) {

        // If the list is empty or the given node is null, there's
        // nothing to do
        if (head == null || node == null) {
            return head;
        }

        // If the node to be deleted is the head node
        if (node == head) {
            head = head.next;

            // If there is a new head, update its previous pointer to
            // null
            if (head != null) {
                head.prev = null;
            }

            // Dereference the node for garbage collection
            node = null;
            return head;
        }

        // If the node to be deleted is not the head node
        // Update the previous node's next pointer to skip the given node
        node.prev.next = node.next;

        // If the node to be deleted is not the last node in the list
        // Update the next node's previous pointer to skip the given node
        if (node.next != null) {
            node.next.prev = node.prev;
        }

        // Dereference the node for garbage collection
        node = null;

        // Return the original head of the list
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
    deleteTheGivenNode(
        head: ListNode | null,
        node: ListNode | null
    ): ListNode | null {

        // If the list is empty or the given node is null, there's
        // nothing to do
        if (head === null || node === null) {
            return head;
        }

        // If the node to be deleted is the head node
        if (node === head) {
            head = head.next;

            // If there is a new head, update its previous pointer to
            // null
            if (head != null) {
                head.prev = null;
            }

            // Dereference the node for garbage collection
            node = null;
            return head;
        }

        // If the node to be deleted is not the head node
        // Update the previous node's next pointer to skip the given node
        node.prev!.next = node.next;

        // If the node to be deleted is not the last node in the list
        // Update the next node's previous pointer to skip the given node
        if (node.next !== null) {
            node.next.prev = node.prev;
        }

        // Dereference for garbage collection
        node = null;

        // Return the original head of the list
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
    deleteTheGivenNode(head, node) {

        // If the list is empty or the given node is null, there's
        // nothing to do
        if (head === null || node === null) {
            return head;
        }

        // If the node to be deleted is the head node
        if (node === head) {
            head = head.next;

            // If there is a new head, update its previous pointer to
            // null
            if (head != null) {
                head.prev = null;
            }

            // Dereference the node for garbage collection
            node = null;
            return head;
        }

        // If the node to be deleted is not the head node
        // Update the previous node's next pointer to skip the given node
        node.prev.next = node.next;

        // If the node to be deleted is not the last node in the list
        // Update the next node's previous pointer to skip the given node
        if (node.next !== null) {
            node.next.prev = node.prev;
        }

        // Dereference the node for garbage collection
        node = null;

        // Return the original head of the list
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
    def delete_the_given_node(
        self, head: Optional[ListNode], node: Optional[ListNode]
    ) -> Optional[ListNode]:

        # If the list is empty or the given node is None, there's nothing
        # to do
        if head is None or node is None:
            return head

        # If the node to be deleted is the head node
        if node == head:
            head = head.next

            # If there is a new head, update its previous pointer to null
            if head is not None:
                head.prev = None

            # Dereference the node for garbage collection
            node = None
            return head

        # If the node to be deleted is not the head node
        # Update the previous node's next pointer to skip the given node
        if node.prev is not None:
            node.prev.next = node.next

        # If the node to be deleted is not the last node in the list
        # Update the next node's previous pointer to skip the given node
        if node.next is not None:
            node.next.prev = node.prev

        # Dereference node for garbage collection
        node = None

        # Return the original head of the list
        return head
```

## Complexity Analysis

The function shows a significant improvement in worst-case complexity. In a singly linked list, a similar operation would take **O(N)** time in the worst case, as we need to traverse the entire list to get the previous node. However, in a doubly-linked list, having access to any node also gives us access to the node before it through its previous section, eliminating the need to traverse the entire list and reducing the worst-case time complexity to **O(1)**.

// Diagram: All cases: Delete the given node

Since no new nodes are created, the space complexity remains constant.

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

# Delete the given node

## Problem Statement

Given the **head** of a doubly linked list and a **random node** in that linked list, write a function to delete that node from the list and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\], node = 7
> -   **Output:** \[5, 3, 10\]

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
    ListNode *deleteTheGivenNode(ListNode *head, ListNode *node) {

        // If the list is empty or the given node is null, there's
        // nothing to do
        if (head == nullptr || node == nullptr) {
            return head;
        }

        // If the node to be deleted is the head node
        if (node == head) {
            head = head->next;

            // If there is a new head, update its previous pointer to
            // null
            if (head != nullptr) {
                head->prev = nullptr;
            }

            // Delete the given node
            delete node;
            return head;
        }

        // If the node to be deleted is not the head node
        // Update the previous node's next pointer to skip the given node
        node->prev->next = node->next;

        // If the node to be deleted is not the last node in the list
        // Update the next node's previous pointer to skip the given node
        if (node->next) {
            node->next->prev = node->prev;
        }

        // Delete the given node
        delete node;

        // Return the original head of the list
        return head;
    }
};
```

***

# Understanding deletion at a given distance

In this final deletion form, we are incorporating the concepts we previously studied in the context of a singly linked list. The aim is to create a logical and comprehensive approach encompassing various scenarios. Although the process is similar to a singly linked list, keeping track of the previous node in each case requires additional effort. We will examine all the potential scenarios that need to be considered.

## 1\. The list is empty

When the list is empty, meaning it contains no elements, any attempt to delete a node is unnecessary because there are no nodes in the list. Since there is nothing to remove, the list remains unchanged. We can return the existing **head**, as the list is empty, and no node needs to be deleted.

// Diagram: The list is empty

> **Algorithm**
>
> -   **Step 1:** Return the original head node.

## 2\. X = 0

In this scenario, we must delete the head node, i.e., **deleting the first node** in the linked list. We should update the **head** to point to the second node in the linked list and set the pointer of the second node to `null`. After completing these steps, we can then delete the original head node.

// Diagram: The list has more than one node

> **Algorithm**
>
> -   **Step 1:** Create a temporary pointer to store the current head node.
> -   **Step 2:** Move the head pointer to the next node.
> -   **Step 3:** Set the \`previous\` pointer of the new head node to \`null\`.
> -   **Step 4:** Delete the original head node to free up memory.
> -   **Step 5:** Return the new head node.

## 3\. X < size of the list

In a doubly linked list, each node has a pointer, so we can move `X` steps using the current reference variable to reach the node that needs to be deleted. After that, the process is the same as **deleting a node with given data**. We need to adjust the pointers of the nodes that come before and after the current node and then delete the current node.

// Diagram: X < size of the list

> **Algorithm**
>
> -   **Step 1:** Traverse the distance X while keeping track of the \`current\` node.
> -   **Step 2:** Set the \`next\` pointer of the node before the \`current\` node to hold the reference of the node after the \`current\` node.
> -   **Step 3:** Set the \`previous\` pointer of the node after the \`current\` node to hold the reference of the node before the \`current\` node.
> -   **Step 4:** Delete the \`current\` node to free up memory.
> -   **Step 5:** Return the original head node.

## 4\. X >= the size of the linked list

This indicates an invalid query. For example, we cannot delete the 10th node in a list of size 3. We will return the existing **head** node.

**What about the case when X == size of the linked list?**

This is also an invalid case. To clarify, let's consider a list of size 5. In this scenario, the potential values of `X` could range from 0 to 4, meaning `[0, 4]`. Therefore, an input 5 would be invalid. It's important to note that X represents the distance from the head node, not the node's position.

// Diagram: X >= size of the linked list

> **Algorithm**
>
> -   **Step 1:** Traverse the distance X while keeping track of the \`current\` node.
> -   **Step 2:** Return the original head node.

## Implementation

When implementing the logic for deleting nodes at a distance, we consider all the possible cases and write the code for each in conditional blocks.

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
    ListNode *deleteNodeAtGivenDistance(ListNode *head, int X) {

        // Check if the list is empty. If so, there's nothing to delete,
        // so return nullptr.
        if (head == nullptr) {
            return nullptr;
        }

        // If X is 0, we need to delete the first node
        if (X == 0) {

            // Store the node to be deleted in a temporary pointer
            ListNode *nodeToBeDeleted = head;

            // Move the head to the next node, removing the first node
            head = head->next;

            // Update the new head's prev pointer
            if (head != nullptr) {
                head->prev = nullptr;
            }

            // Delete the node that was previously the head
            delete nodeToBeDeleted;

            // Return the new head
            return head;
        }

        // Initialize a current pointer to traverse the list
        ListNode *current = head;

        // Initialize a counter to keep track of the distance from the
        // head
        int counter = 0;

        // Traverse the list until either the end is reached or the
        // desired distance X is reached
        while (current != nullptr && counter < X) {
            current = current->next;
            counter++;
        }

        // If the end of the list is reached before reaching the desired
        // distance X, there is no node to delete, so we return the
        // original head.
        if (current == nullptr) {
            return head;
        }

        // If the desired node is found at the given distance X,
        // update the previous node's next pointer to skip the current
        // node
        if (current->prev != nullptr) {
            current->prev->next = current->next;
        }

        // Update the next node's previous pointer to skip the current
        // node
        if (current->next != nullptr) {
            current->next->prev = current->prev;
        }

        // Delete the current node as it is no longer part of the list
        delete current;

        // Return the original head of the list
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
    public ListNode deleteNodeAtGivenDistance(ListNode head, int X) {

        // Check if the list is empty. If so, there's nothing to delete,
        // so return null.
        if (head == null) {
            return null;
        }

        // If X is 0, we need to delete the first node
        if (X == 0) {

            // Store the node to be deleted in a temporary pointer
            ListNode nodeToBeDeleted = head;

            // Move the head to the next node, removing the first node
            head = head.next;

            // Update the new head's prev pointer
            if (head != null) {
                head.prev = null;
            }

            // Delete the node that was previously the head
            nodeToBeDeleted = null;

            // Return the new head
            return head;
        }

        // Initialize a current pointer to traverse the list
        ListNode current = head;

        // Initialize a counter to keep track of the distance from the
        // head
        int counter = 0;

        // Traverse the list until either the end is reached or the
        // desired distance X is reached
        while (current != null && counter < X) {
            current = current.next;
            counter++;
        }

        // If the end of the list is reached before reaching the desired
        // distance X, there is no node to delete, so we return the
        // original head.
        if (current == null) {
            return head;
        }

        // If the desired node is found at the given distance X,
        // update the previous node's next pointer to skip the current
        // node
        if (current.prev != null) {
            current.prev.next = current.next;
        }

        // Update the next node's previous pointer to skip the current
        // node
        if (current.next != null) {
            current.next.prev = current.prev;
        }

        // Delete the current node as it is no longer part of the list
        current = null;

        // Return the original head of the list
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
    deleteNodeAtGivenDistance(
        head: ListNode | null,
        X: number
    ): ListNode | null {

        // Check if the list is empty. If so, there's nothing to delete,
        // so return null.
        if (head === null) {
            return null;
        }

        // If X is 0, we need to delete the first node
        if (X === 0) {

            // Store the node to be deleted in a temporary pointer
            let nodeToBeDeleted: ListNode | null = head;

            // Move the head to the next node, removing the first node
            head = head.next;

            // Update the new head's prev pointer
            if (head !== null) {
                head.prev = null;
            }

            // Delete the node that was previously the head
            nodeToBeDeleted = null;

            // Return the new head
            return head;
        }

        // Initialize a current pointer to traverse the list
        let current: ListNode | null = head;

        // Initialize a counter to keep track of the distance from the
        // head
        let counter: number = 0;

        // Traverse the list until either the end is reached or the
        // desired distance X is reached
        while (current !== null && counter < X) {
            current = current.next;
            counter++;
        }

        // If the end of the list is reached before reaching the desired
        // distance X, there is no node to delete, so we return the
        // original head.
        if (current === null) {
            return head;
        }

        // If the desired node is found at the given distance X,
        // update the previous node's next pointer to skip the current
        // node
        if (current.prev !== null) {
            current.prev.next = current.next;
        }

        // Update the next node's previous pointer to skip the current
        // node
        if (current.next !== null) {
            current.next.prev = current.prev;
        }

        // Delete the current node as it is no longer part of the list
        current = null;

        // Return the original head of the list
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
    deleteNodeAtGivenDistance(head, X) {

        // Check if the list is empty. If so, there's nothing to delete,
        // so return null.
        if (head === null) {
            return null;
        }

        // If X is 0, we need to delete the first node
        if (X === 0) {

            // Store the node to be deleted in a temporary pointer
            let nodeToBeDeleted = head;

            // Move the head to the next node, removing the first node
            head = head.next;

            // Update the new head's prev pointer
            if (head !== null) {
                head.prev = null;
            }

            // Delete the node that was previously the head
            nodeToBeDeleted = null;

            // Return the new head
            return head;
        }

        // Initialize a current pointer to traverse the list
        let current = head;

        // Initialize a counter to keep track of the distance from the
        // head
        let counter = 0;

        // Traverse the list until either the end is reached or the
        // desired distance X is reached
        while (current !== null && counter < X) {
            current = current.next;
            counter++;
        }

        // If the end of the list is reached before reaching the desired
        // distance X, there is no node to delete, so we return the
        // original head.
        if (current === null) {
            return head;
        }

        // If the desired node is found at the given distance X,
        // update the previous node's next pointer to skip the current
        // node
        if (current.prev !== null) {
            current.prev.next = current.next;
        }

        // Update the next node's previous pointer to skip the current
        // node
        if (current.next !== null) {
            current.next.prev = current.prev;
        }

        // Delete the current node as it is no longer part of the list
        current = null;

        // Return the original head of the list
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
    def delete_node_at_given_distance(
        self, head: Optional[ListNode], x: int
    ) -> Optional[ListNode]:

        # Check if the list is empty. If so, there's nothing to delete,
        # so return None.
        if head is None:
            return None

        # If x is 0, we need to delete the first node
        if x == 0:

            # Store the node to be deleted in a temporary pointer
            node_to_be_deleted: ListNode = head

            # Move the head to the next node, removing the first node
            head = head.next

            # Update the new head's prev pointer
            if head is not None:
                head.prev = None

            # Delete the node that was previously the head
            del node_to_be_deleted

            # Return the new head
            return head

        # Initialize a current pointer to traverse the list
        current: Optional[ListNode] = head

        # Initialize a counter to keep track of the distance from the
        # head
        counter: int = 0

        # Traverse the list until either the end is reached or the
        # desired distance x is reached
        while current is not None and counter < x:
            current = current.next
            counter += 1

        # If the end of the list is reached before reaching the desired
        # distance x, there is no node to delete, so we return the
        # original head.
        if current is None:
            return head

        # If the desired node is found at the given distance x,
        # update the previous node's next pointer to skip the current
        # node
        if current.prev is not None:
            current.prev.next = current.next

        # Update the next node's previous pointer to skip the current
        # node
        if current.next is not None:
            current.next.prev = current.prev

        # Delete the current node as it is no longer part of the list
        del current

        # Return the original head of the list
        return head
```

## Complexity Analysis

Similar to single linked list, the time complexity of deleting a node at a given distance `X` depends on the value of `X` and the size of the linked list. Since the list must be traversed up to the specified distance to locate the node, the number of operations varies based on how far the node is from the beginning.

### Best case

The best case occurs when `X` is equal to 0. In this case, the function must delete the first node of the list. This process takes **constant** time, regardless of the linked list's size.

// Diagram: Best case: Delete the first node

### Worst case

On the other hand, the worst case occurs when `X` is one less than the size of the list. In this case, the function must delete the last node of the list. This process takes linear time proportional to the length of the linked list, i.e., **O(N)**.

// Diagram: Best case: Delete the last node

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

Given the **head** of a doubly linked list and distance **X**, write a function to delete the node at a distance **X** from the start of the linked list and return the head of the updated list.

### Example

> -   **Input:** head = \[5, 7, 3, 10\], X = 1
> -   **Output:** \[5, 3, 10\]

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
    ListNode *deleteNodeAtGivenDistance(ListNode *head, int X) {

        // Check if the list is empty. If so, there's nothing to delete,
        // so return nullptr.
        if (head == nullptr) {
            return nullptr;
        }

        // If X is 0, we need to delete the first node
        if (X == 0) {

            // Store the node to be deleted in a temporary pointer
            ListNode *nodeToBeDeleted = head;

            // Move the head to the next node, removing the first node
            head = head->next;

            // Update the new head's prev pointer
            if (head != nullptr) {
                head->prev = nullptr;
            }

            // Delete the node that was previously the head
            delete nodeToBeDeleted;

            // Return the new head
            return head;
        }

        // Initialize a current pointer to traverse the list
        ListNode *current = head;

        // Initialize a counter to keep track of the distance from the
        // head
        int counter = 0;

        // Traverse the list until either the end is reached or the
        // desired distance X is reached
        while (current != nullptr && counter < X) {
            current = current->next;
            counter++;
        }

        // If the end of the list is reached before reaching the desired
        // distance X, there is no node to delete, so we return the
        // original head.
        if (current == nullptr) {
            return head;
        }

        // If the desired node is found at the given distance X,
        // update the previous node's next pointer to skip the current
        // node
        if (current->prev != nullptr) {
            current->prev->next = current->next;
        }

        // Update the next node's previous pointer to skip the current
        // node
        if (current->next != nullptr) {
            current->next->prev = current->prev;
        }

        // Delete the current node as it is no longer part of the list
        delete current;

        // Return the original head of the list
        return head;
    }
};
```
