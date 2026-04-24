# 2. Traversal in doubly linked lists

## Table of contents

1. [Understanding traversal](#understanding-traversal)
2. [Node expedition](#node-expedition)
3. [Node expedition II](#node-expedition-ii)
4. [Node search](#node-search)

***

# Understanding traversal

Traversal is the most fundamental operation on a doubly linked list and is the same as in a singly linked list. The extra information about the previous node that every node in a doubly linked list stores gives a doubly linked list the ability to traverse in two directions.

## Forward Traversal

Forward traversal is moving from the **head** to the **tail** node in the doubly linked list. It is implemented in the same way as in a singly linked list. We use a variable that holds a reference to a node in the linked list as the loop control variable, and every time we want to move forward we assign the reference of the node in the linked list to this variable. We can get the reference of the node by looking at the node pointed by the pointer of the current node.

// Diagram: Forward traversal using the next pointer

// Diagram: Given below is the code implementation of forward traversal in a doubly linked list traversal using

C++

```cpp

// for loop
for(Node* current = head; current != NULL; current = current->next);

// while loop
Node *current = head;
while(current != nullptr) {
	current = current->next;
}
```

Java

```java

// for loop
for(Node current = head; current != null; current = current.next);

// while loop
Node current = head;
while(current != null) {
	current = current.next;
}
```

Typescript

```typescript

// for loop
for(let current: Node | null = head; current != null; current = current.next);

// while loop
let current: Node | null = head;
while(current != null) {
	current = current.next;
}
```

Javascript

```javascript

// for loop
for(let current = head; current != null; current = current.next);

// while loop
let current = head;
while(current != null) {
	current = current.next;
}
```

Python

```python

# while loop
current = head;
while current is not None:
	current = current.next;
```

## Reverse Traversal

Unlike a singly linked list, we can also traverse a doubly linked list in the reverse direction from the **tail** node to the **head** node, thanks to the  pointer in every node that stores the reference to the previous node. Like forward traversal, we use a variable referencing a node as the loop control variable. We initialize it with the address of the **tail** node and follow the reference stored in the  pointer in every iteration until we reach the **head** node, whose  pointer is `null`

// Diagram: Reverse traversal using the previous pointer

// Diagram: Given below is the code implementation of reverse traversal in a doubly linked list traversal using

C++

```cpp

// for loop
for(Node* current = head; current != NULL; current = current->next);

// while loop
Node *current = head;
while(current != nullptr) {
	current = current->next;
}
```

Java

```java

// for loop
for(Node current = head; current != null; current = current.next);

// while loop
Node current = head;
while(current != null) {
	current = current.next;
}
```

Typescript

```typescript

// for loop
for(let current: Node | null = head; current != null; current = current.next);

// while loop
let current: Node | null = head;
while(current != null) {
	current = current.next;
}
```

Javascript

```javascript

// for loop
for(let current = head; current != null; current = current.next);

// while loop
let current = head;
while(current != null) {
	current = current.next;
}
```

Python

```python

# while loop
current = head;
while current is not None:
	current = current.next;
```

Later in this course, we will learn more about how to piggyback on this generic forward and reverse traversal logic to do various things as we traverse a doubly linked list.

***

# Node expedition

## Problem Statement

Given the **head** of a doubly linked list, write a function to print a comma (`,`) separated list of all the values from the start to the end.

In TypeScript and JavaScript, use **process.stdout.write** instead of **console.log**, since console.log automatically appends a newline character to the output, which may cause the judge to fail the submission.

### Example

> -   **Input:** head = \[5, 7, 3, 10\]
> -   **Output:** 5, 7, 3, 10

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
    void nodeExpedition(ListNode *head) {

        // Start from the head of the linked list
        ListNode *current = head;

        // Iterate until the current node is not null
        while (current != nullptr) {

            // Print the value of the current node
            cout << current->val;

            // If there is a next node, print a comma after the value
            if (current->next != nullptr) {
                cout << ", ";
            }

            // Move to the next node
            current = current->next;
        }
    }
};
```

***

# Node expedition II

## Problem Statement

Given the **tail** of a doubly linked list, write a function to print a comma (`,`) separated list of all the values from the start to the end.

In TypeScript and JavaScript, use **process.stdout.write** instead of **console.log**, since console.log automatically appends a newline character to the output, which may cause the judge to fail the submission.

### Example

> -   **Input:** head = \[5, 7, 3, 10\]
> -   **Output:** 10, 3, 7, 5

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
    void nodeExpeditionII(ListNode *tail) {

        // Start from the tail of the linked list
        ListNode *current = tail;

        // Traverse the linked list backwards starting from the current
        // node
        while (current != nullptr) {

            // Print the value of the current node
            cout << current->val;

            // Check if the current node has a previous node
            if (current->prev != nullptr) {

                // If a previous node exists, print a comma and space
                cout << ", ";
            }

            // Move to the previous node
            current = current->prev;
        }
    }
};
```

***

# Node search

## Problem Statement

Given the **tail** of a doubly linked list and a **data** value, write a function to return the first node containing the given data. If no such node is found, return `null`.

### Example 1

> -   **Input:** head = \[5, 7, 3, 10\], data = 3
> -   **Output:** 3

### Example 2

> -   **Input:** head = \[5, 7, 6, 10\], data = 3
> -   **Output:** null

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
    ListNode *nodeSearch(ListNode *tail, int data) {

        // Start from the tail of the linked list
        ListNode *current = tail;

        // Traverse the linked list backwards starting from the current
        // node
        while (current != nullptr) {

            // If a matching node is found, return the pointer to
            // that node
            if (current->val == data) {
                return current;
            }

            // Move to the previous node in the linked list
            current = current->prev;
        }

        // If the loop finishes without finding a matching node, return
        // nullptr
        return nullptr;
    }
};
```

***

# Node search
