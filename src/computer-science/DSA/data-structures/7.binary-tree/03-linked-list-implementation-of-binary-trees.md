# Linked list implementation of binary trees

## Table of Contents

1. [Introduction to linked list based binary trees](#introduction-to-linked-list-based-binary-trees)
2. [Defining a node in binary tree](#defining-a-node-in-binary-tree)
3. [Structure of a binary tree](#structure-of-a-binary-tree)

***

# Introduction to linked list based binary trees

We now know what a tree data structure looks like on paper and its different types and properties. However, to use this data structure, we need a way to represent it using a programming language in computer memory. This representation needs to be easy to use and complete.

// Diagram: Representation of a binary tree

On closer inspection, we can see a binary tree as a two-dimensional linked list. Instead of just having just one  section, what if the linked list had two sections.

// Diagram: Linked representation of a binary tree

This is exactly what a linked list implementation of a binary tree is. To implement a binary tree, we extend the general idea of a linked list node to two dimensions.

***

# Defining a node in binary tree

Every data structure comprises some fundamental elementary units that connect to make up that data structure. A node is the fundamental building block of a binary tree. Since a binary tree can have only two children, they can be conveniently named **left** and **right** depending on which side of the parent node they fall into when drawn on a 2D surface. 

## Structure of a node

A binary tree node has three sections. It holds references to its two children in its `left` and `right` sections and the data items in the `data` section.

> -   **data** - The actual data item a node holds. This could be of any type.
> -   **left** - The is a reference to the **left** child of this node.
> -   **right** - The is a reference to the **right** child of this node.

// Diagram: Representation of a binary tree node

## Implementing a node

To define a binary tree node in code, we create a class called TreeNode, which encapsulates the information that a binary tree node must hold, that is, **data**, reference to the **left** child node, and reference to the **right** child node. Our class should also have a constructor to initialize the values in nodes at the time of its creation. We can pass in a data value stored in the node and the reference to the left and right children. We are responsible for linking it to any other node when we see fit.

C++

```cpp
// Definition for a binary tree node.
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int val) : val(val), left(nullptr), right(nullptr) {}
};
```

Java

```java
// Definition for a binary tree node.
class TreeNode {
     int val;
     TreeNode left;
     TreeNode right;
     TreeNode() {}
     TreeNode(int val) { this.val = val; }
}
```

Typescript

```typescript
// Definition for a binary tree node.
class TreeNode {
    val: number
    left: TreeNode | null
    right: TreeNode | null
    constructor(
        val?: number,
        left?: TreeNode | null,
        right?: TreeNode | null
    ) {
        this.val = (val===undefined ? 0 : val)
        this.left = (left===undefined ? null : left)
        this.right = (right===undefined ? null : right)
    }
```

Javascript

```javascript

// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}
```

Python

```python

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
```

***

# Structure of a binary tree

Now that we know what individual nodes of a binary tree look like in the linked list implementation, let's examine how they link up to form a binary tree. Multiple nodes link up by referencing child nodes to create the binary tree structure. 

// Diagram: Logical representation of a binary tree

What looks like a tree on paper looks very different in computer memory. This is because a binary tree comprises nodes created at runtime and can be located anywhere in the memory. The tree structure we imagine or draw on paper **logically** represents this linked data structure in memory. Let us look at a binary tree in the computer memory.

// Diagram: Representation of a binary tree in memory

## Root node

The tree's **root** node is the most important as it is this node from where it starts. As we learned earlier, nodes of a binary tree are scattered all around the memory, so a node can only be accessed using its reference in the memory. This reference, however, is stored in the **left** or **right** section of the parent of a node. This is true for every node except the **root** node, as it does not have a parent. We can reach any node in the tree from the root node by following the appropriate path. This is why, to access a tree, we should always have the reference to its root node stored somewhere. 

// Diagram: Root node pointer

## Leaf nodes

A node in the tree that does not have any children is called the **leaf** node. Because they do not have children, a leaf node's **left** and **right** sections are **null**, just like the last node of a singly linked list. Just like a singly linked list, these `null` references help us know when to stop when traversing the tree.
