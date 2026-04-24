# Introduction to binary trees

## Table of Contents

1. [Understanding a binary tree](#understanding-a-binary-tree)
2. [Key tree terminologies](#key-tree-terminologies)
3. [Types and properties of binary trees](#types-and-properties-of-binary-trees)

***

# Understanding a binary tree

A tree is a **nonlinear** data structure that stores elements **hierarchically**. Every element in a tree is called a **node**, and except the topmost node, each node has a **parent** node and zero or more children nodes. The individual nodes in a tree are connected by edges, which may be unidirectional or bidirectional. A tree can only have edges between a parent and a child node, and therefore, a tree cannot have cycles.

// Diagram: Representation of a tree

The definition of a tree above has many terms like parent, children, etc. We will learn more about these terminologies in this lesson.

A binary tree is one where every node can have **at most** two children.

// Diagram: Representation of a binary tree

***

# Key tree terminologies

The tree is a non-linear (two-dimensional) data structure so that it can be drawn in many more complex ways than sequential data structures, such as arrays and linked lists. Trees may exhibit unique properties depending on their shape, size, and structure. We need special terminologies to identify and express a tree's properties and characteristics correctly. These terminologies make it easier for us to express the different characteristic properties of trees and categorize them together. Some of the most widely used tree terminologies are listed below.

These terminologies are not specific to binary trees but can be used for any tree in general (binary search trees, n-ary trees, etc.).

## Root

The root is the only node in the tree without a parent. It is the topmost node from which we can reach any node in the tree.

## Leaf

The nodes in the tree which do not have any children are called the leaf nodes.

## Internal node

Every non-leaf node in a binary tree is called an internal node.

// Diagram: Internal Nodes

## Degree

The degree of a node is the number of other nodes it is connected to.

// Diagram: Degree of a node

## Sibling

The nodes that are children of the same parent in a tree are called siblings.

// Diagram: Sibling Nodes

## Path

The sequence of nodes and edges from one node to another in a tree is called the **path** between those two nodes. The length of a path is the total number of nodes in that path.

// Diagram: Path between nodes

## Subtree

A subtree of a node `a` in a tree is a tree consisting of one of the child nodes of `a` and all its descendants. Every child node of a node makes up a subtree of that node, so every node can have subtrees equal to the number of its children.

// Diagram: Subtrees example

## Level

Each step from top to bottom in a tree is called a level. The root is at level `0`.

// Diagram: Levels in a tree

## Depth

The node's depth is the number of edges between any given node and the root node.

// Diagram: Depth of a node

## Height

The height of any node is the total number of edges in the **longest** path from that node to a leaf node. The height of all leaves is 0, and the root node's height is also the tree's height. 

// Diagram: Height of a Node

***

# Types and properties of binary trees

Binary trees come in all shapes and sizes. Some binary trees, however, are special as they fulfill some special properties that make them more useful than others in some cases. These special binary trees can be generalized and studied more easily once we categorize them. Let us look at some special binary tree types and their unique properties.

## Full binary tree

A full binary tree is a binary tree in which every node has two or no children. It is also known as a **proper binary tree**.

// Diagram: Full Binary Trees

> Some interesting properties of full binary trees are:
>
> -   Number of leaf nodes = number of internal nodes + 1
> -   Number of nodes = 2 \* (number of internal nodes) + 1
> -   Number of internal nodes = (total number of nodes – 1) / 2
> -   Number of leaves = (total number of nodes + 1) / 2
> -   Total number of nodes = 2 \* (number of leaf nodes) – 1
> -   Number of internal nodes = number of leaf nodes – 1
> -   Maximum number of leaves = 2 ^ height

## Complete binary tree

A complete binary tree has all its levels completely filled except possibly the last level, which is **filled from left to right**.

// Diagram: Complete Binary Tree

## Perfect binary tree

A perfect binary tree is one in which every internal node has **exactly two** child nodes, and **all the leaf nodes are at the same level**.

// Diagram: Perfect Binary Tree

> Some interesting properties of perfect binary trees are:
>
> -   Total number of nodes = 2 ^ (height + 1) – 1
> -   Height = log(n + 1) – 1
> -   Number of leaf nodes = 2 ^ height

## Skew binary tree

A skew binary tree is a binary tree where every internal node has only one child.

// Diagram: Skew Binary Trees
