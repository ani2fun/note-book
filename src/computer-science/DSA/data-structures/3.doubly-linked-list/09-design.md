# 9. Design

## Table of contents

1. [Design a doubly linked list](#design-a-doubly-linked-list)

***

# Design a doubly linked list

## Problem Statement

Given the skeleton of a **DoublyLinkedList class**, complete this class by implementing all the doubly linked list operations below. 

> -   **DoublyLinkedList()** - Initializes the DoublyLinkedList object.
> -   **size()** - Returns the current size of the list
> -   **empty()** - Returns \`true\` if the list is empty and \`false\` if it is not.
> -   **prepend(int val)** - Inserts a node with the given value at the beginning of the list.
> -   **append(int val)** - Inserts a node with the given value at the end of the list.
> -   **insert(int position, int val)** - Inserts a node with the given value at the given position in the list. Positions are indexed from 0, meaning the first node is at position 0.
> -   **remove(int val)** - Removes the first node whose value matches the given value. Returns \`true\` if the node was removed; otherwise, returns \`false\`.
> -   **search(int val)** - Returns \`true\` if a node with the given value exists in the linked list; returns \`false\` otherwise.

> The input should adhere to the following rules:
>
> 1.  The input should contain two arrays of the same size.
> 2.  The first array should contain the list of operations, while the second should contain the corresponding operands for those operations.
> 3.  The first index in the first array should contain **DoublyLinkedList**, and the first index in the second array should contain an empty array. This is used for initialising the DoublyLinkedList.
> 4.  For each index in the first array that contains **prepend**, **append**, **remove**, or **search** operations, the corresponding index in the second array should contain the value that needs to be inserted, removed, or searched, respectively.
> 5.  For each index in the first array that contains the **insert** operation, the corresponding index in the second array should contain a pair (position, val) that specifies the position at which the given value should be inserted.
> 6.  For each index in the first array that contains **size** or **empty** operations, the corresponding index in the second array should contain an empty array.
>
> **Example:**
>
> -   **Input:** \[DoublyLinkedList, prepend, prepend, append, size, search, insert, remove, empty\] \[\[\], \[2\], \[3\], \[1\], \[\], \[5\], \[1, 8\], \[2\], \[\]\]
>
> -   **Output:** \[null, null, null, null, 3, false, null, true, false\]
>
> **Explanation:**
>
> **Operation:** DoublyLinkedList list = new DoublyLinkedList() **Result:** Initializes an empty \`DoublyLinkedList\`
>
> **Operation:** list.prepend(2) **Result:** \`list = \[2\]\`
>
> **Operation:** list.prepend(3) **Result:** \`list = \[3, 2\]\`
>
> **Operation:** list.append(1) **Result:** \`list = \[3, 2, 1\]\`
>
> **Operation:** list.size() **Result:** Returns \`3\`
>
> **Operation:** list.search(5) **Result:** Returns \`false\`
>
> **Operation:** list.insert(1, 8) **Result:** \`list = \[3, 8, 2, 1\]\`
>
> **Operation:** list.remove(2) **Result:** \`list = \[3, 8, 1\]\`, returns \`true\`
>
> **Operation:** list.empty() **Result:** Returns \`false\`

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

class DoublyLinkedList {
public:

    // Pointer to the front node of the list
    ListNode *head;

    // Pointer to the last node of the list
    ListNode *tail;

    // Current number of elements in the list
    int currentSize;

    DoublyLinkedList() : head(nullptr), tail(nullptr), currentSize(0) {}

    bool empty() { return head == nullptr; }

    int size() { return currentSize; }

    void prepend(int val) {
        ListNode *newNode = new ListNode(val);

        // If the list is empty, set the new node as both head and
        // tail
        if (empty()) {
            head = newNode;
            tail = newNode;
        }

        // Set the new node as the head and adjust pointers
        else {
            newNode->next = head;
            head->prev = newNode;
            head = newNode;
        }

        currentSize++;
    }

    void append(int val) {
        ListNode *newNode = new ListNode(val);

        // If the list is empty, set the new node as both head and
        // tail
        if (empty()) {
            head = newNode;
            tail = newNode;
        }

        // Otherwise, set the new node as the tail and adjust pointers
        else {
            newNode->prev = tail;
            tail->next = newNode;
            tail = newNode;
        }

        currentSize++;
    }

    void insert(int position, int val) {

        // If the position is less than or equal to 0, prepend the
        // new node
        if (position <= 0) {
            prepend(val);
            return;
        }

        // If the position is greater than or equal to the current
        // size, append the new node
        if (position >= currentSize) {
            append(val);
            return;
        }

        ListNode *newNode = new ListNode(val);

        ListNode *current = head;
        int currentPosition = 0;

        // Traverse the list to reach the desired position
        while (current && currentPosition < position) {
            current = current->next;
            currentPosition++;
        }

        // Insert the new node at the desired position and adjust
        // pointers
        newNode->prev = current->prev;
        newNode->next = current;
        current->prev->next = newNode;
        current->prev = newNode;

        currentSize++;
    }

    bool remove(int val) {

        // If the list is empty, no removal is possible
        if (empty()) {
            return false;
        }

        ListNode *current = head;
        while (current) {
            if (current->val == val) {

                // If the node to remove is the head, update the head
                // pointer
                if (current == head) {
                    head = current->next;

                    // If the list is not empty, update the prev pointer
                    if (head) {
                        head->prev = nullptr;
                    }

                    // If the list becomes empty, update the tail
                    // pointer
                    else {
                        tail = nullptr;
                    }
                }

                // If the node to remove is the tail, update the tail
                // pointer
                else if (current == tail) {
                    tail = current->prev;
                    tail->next = nullptr;
                }

                // Otherwise, remove the node by adjusting the prev and
                // next pointers of adjacent nodes
                else {
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

            // If the val is found, return true
            if (current->val == val) {
                return true;
            }
            current = current->next;
        }

        // If the val is not found, return false
        return false;
    }
};
```
