# 1. Introduction to doubly linked lists

## Table of contents

1. [Understanding the problem](#understanding-the-problem)
2. [Exploring a possible solution](#exploring-a-possible-solution)
3. [Defining a node in doubly linked list](#defining-a-node-in-doubly-linked-list)
4. [Structure of a doubly linked list](#structure-of-a-doubly-linked-list)
5. [Overview of supported operations](#overview-of-supported-operations)

***

# Understanding the problem

Despite the many amazing benefits that singly linked lists offer, they still have limitations. To better understand doubly linked lists, let us look at common problems programmers face when using singly linked lists.

Let's revisit our example from the singly linked list course. In that course, we collected the names of all the students in a class and used a singly linked list to represent that information. 

// Diagram: Names of students in the class represented as a singly linked list

Consider a scenario where Neha leaves the class and transfers to another school. Even if we have the node storing Neha's information, deleting it is still not easy. To delete a node in a singly linked list, we need access to the node **1 step before** the node that has to be deleted. It is this node whose  pointer has to be updated to remove the given node. This operation, however, has a worst-case time complexity of **O(N)**, as we might have to traverse the entire list to get access to the node **1 step before** the given node. This is not efficient when we have very large lists.

// Diagram: The node to be deleted is not the first node

Now, consider a case where we have a new student, Anmol, join the class, and we want to insert a node storing her information before Hari. Just like deletion, even if we have access to the node storing Hari's information, we still need to traverse the entire list to access the node **1 step before** the given node, as this node's  pointer has to be updated. Again, this operation has a worst-case time complexity of **O(N)** as we might have to traverse the entire list, which is inefficient.

// Diagram: Need to traverse the list to find the node right before the one to insert

## Limitations of singly linked lists

Even though we can solve the problem using a singly linked list, it is not the best solution. This is because singly linked lists have some serious limitations. Some basic operations are inefficient, as we might need to traverse the entire list to implement them.

// Diagram: Limitations of singly linked lists

> The following operations have poor performance in singly linked lists:
>
> -   Insert at end
> -   Insert before a given node
> -   Delete the last node
> -   Delete the given node
> -   Delete node before a given node

What if we had a data structure that could solve the above problem most efficiently?

***

# Exploring a possible solution

Now that we know the limitations of singly linked lists and the situations where those limitations lead to sub-optimal solutions, we can start to consider a data structure that can be used efficiently in such situations.

## Doubly linked list

A doubly linked list is a bidirectional linear and dynamic data structure that stores data sequentially at random memory locations. Instead of storing just information about the node in the list, a doubly linked list node also stores information about the node, making it a powerful bidirectional extension of a singly linked list.

// Diagram: Abstract representation of a doubly linked list

## Advantages

If the address of the node is given, a doubly linked list guarantees the insertion and deletion of items in `O(1)` space and `O(1)` time. Since it is also bidirectional, it can be traversed in both directions from the **head** node to the **tail** node and similarly from the **tail** node to the **head** node.

// Diagram: Insertion and deletion before the given node do not require traversal

To understand this better, let us look at an example of deletion in a doubly linked list.

// Diagram: Delete the given node in singly linked list

More formally, a doubly linked list has a few advantages over a singly linked list, which are listed below.

> -   **Traversal:** A doubly linked list is bidirectional and can be traversed in both directions.
> -   **Efficient Insertion:** Insertion of a node next to a given node is much more efficient than a singly linked list.
> -   **Efficient Deletion:** Deletion of a node next to a given node is much more efficient than deleting a single node in a singly linked list.

## Limitations

Doubly linked lists are very efficient for certain use cases but also have some limitations.

> -   **Extra memory:** Compared to a singly linked list, a doubly linked list uses extra memory to store the information of the previous node in the sequence.
> -   **More complicated:** Because a doubly linked list stores extra information in every node, the programmer must ensure it is always correct and up to date.

***

# Defining a node in doubly linked list

Like singly linked lists, a **node** in a doubly linked list is its fundamental building block. Multiple nodes, when chained together, make up a doubly linked list. All operations performed on the list nodes, be they inserting, deleting, or updating data items, are performed on the list nodes.

## Structure of a node

The node of a doubly linked list is a simple yet highly effective extension of the node of a singly linked list. It just has an extra pointer called   in every node that stores the reference to the node **before** it in the list. This way, we can move **forward** and **backward** from any node, and operations involving reference manipulation become much easier. A doubly linked list node has three sections

> -   **data:** The actual data item a node holds. This could be of any type.
> -   **previous:** The is a reference to the previous node in the list
> -   **next:** The is a reference to the next node in the list

// Diagram: Representation of a doubly linked list node

## Implementing a node

As we already learned, the node of a doubly linked list is just an extension of a singly linked list node. We can implement a doubly linked list node by adding a new pointer to the implementation of a singly linked list node.

C++

```cpp

struct Node {
	int data;
	Node *next;
	Node *previous;

	Node (int data, Node* next = nullptr, Node* previous = nullptr)
	: data(data), next(next), previous(previous)
	{
	}
```

Java

```java

class ListNode {
	int val;
	ListNode prev;
	ListNode next;
	ListNode() {}
	ListNode(int val) { this.val = val; }
};
```

Typescript

```typescript

class ListNode {
    val: number
    prev: ListNode | null
    next: ListNode | null
    constructor(
        val?: number,
        prev?: ListNode | null,
        next?: ListNode | null
        ) {
            this.val = (val===undefined ? 0 : val)
            this.prev = (prev===undefined ? null : prev)
            this.next = (next===undefined ? null : next)
    }
```

Javascript

```javascript

class ListNode {
    constructor(val, prev,next)
    {
        this.val = (val===undefined ? 0 : val)
        this.prev = (prev===undefined ? null : prev)
        this.next = (next===undefined ? null : next)
    }
```

Python

```python

class ListNode:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None
```

***

# Structure of a doubly linked list

Like a singly linked list, a doubly linked list is a chain of nodes. Below is how these nodes chain together to form a doubly linked list.

// Diagram: A chain of nodes make up a doubly linked list

When represented logically in a diagram, these nodes might look sequential (left to right, one after the other), but in reality, they are scattered all around in memory at random locations, and the only way to access a node is by using its address in memory.

// Diagram: Doubly linked list in memory

## Head node

Similar to a singly linked list, the first node of a doubly linked list is also called its **head**.The only difference between a singly and doubly linked list arises from the fact that a doubly linked node also has a  pointer just like . The pointer of the **head** node of a doubly-linked list is `null` just like the  pointer of the **tail** node in a singly linked list. This informs us that this is the last node traversing the list from **tail** to **head**. A representation of a doubly linked list in memory is given below.

// Diagram: Head of a doubly linked list

## Tail node

Similar to a singly linked list, the **last** node of a doubly linked list is also called its **tail.** However, unlike a singly linked list, we can traverse a doubly linked list from the last node to the first node. For this to happen, however, we must always reference the **tail** node of a doubly-linked list just like we always have a reference to its **head**.

// Diagram: Tail of a doubly linked list

***

# Overview of supported operations

Now that we know what an individual node of a doubly-linked list looks like and how these individual nodes link up together to create a doubly-linked list, we can dive deeper and understand the different operations performed on this type of linked list. Just like a singly linked list, we can broadly classify all doubly linked list operations into three categories:

> -   Traversal
> -   Insertion
> -   Deletion

All other complex operations can be implemented by combining or piggybacking on these fundamental operations. Let's examine how these basic operations combine to create more complex actions.

// Diagram: Some operations on a doubly linked list

Don’t worry if you don’t understand all of these operations yet. We will explore them in more detail later in the course. Each of these operations is built from a combination of basic ones, and once you’ve mastered the fundamentals, the intuition behind the more complex operations will become clear.
