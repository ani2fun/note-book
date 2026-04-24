# Introduction to binary search trees

## Table of Contents

1. [Understanding a binary search tree](#understanding-a-binary-search-tree)
2. [Structure of a binary search tree](#structure-of-a-binary-search-tree)
3. [Characteristics of a binary search tree](#characteristics-of-a-binary-search-tree)
4. [Implementation of binary search trees](#implementation-of-binary-search-trees)

***

# Understanding a binary search tree

A binary search tree is a data structure that utilizes the two-dimensional structure of binary trees by exploiting the fact that we can impose some conditions on who gets to be the left and right child of a node. The nodes in a binary search tree follow a particular order, making it extremely efficient.

// Diagram: Representation of a binary search tree

The special ordering that nodes in a binary search tree follow makes insertion, deletion, and searching extremely fast compared to a generic binary tree.

***

# Structure of a binary search tree

A binary search tree is a special type of binary tree that follows the binary search property.

> For every node **N** in the binary search tree :
>
> -   All the values stored in the **left subtree** of \`N\` are **less than** the value stored in **N**
> -   All the values stored in the **right subtree** of **N** are **greater than** the value stored in **N**

// Diagram: Binary Search Property

Almost all the operations on a binary search tree we will learn later in this course leverage this property to get **blazingly fast** runtimes.

// Diagram: All binary search trees are binary trees but not all binary trees are binary search trees

## Example

Let's examine a simple binary search tree example to understand its appearance.

// Diagram: Example of a binary search tree

As you can see in the example tree above, it is a binary search tree because for every node in the tree, all values in the left subtree are less than the value at the node, and all the values in the right subtree are greater than it.

***

# Characteristics of a binary search tree

As we learned earlier, binary search trees are just binary trees that follow the binary search property. As a result, binary search trees have some unique characteristics. Let us look at some of the unique properties of a binary search tree.

## Minimum

We know that in a binary search tree, for any given node, all the values in its left subtree are less than the value at the given node. This logic makes it easy to see where the **minimum** value in a binary search tree would reside. 

// Diagram: The first node in inorder traversal of a binary search tree has the minimum value in the tree

// Diagram: Minimum value in a binary search tree

## Maximum

Just like the left subtree, we know that in a binary search tree, for any given node, all the values in its right subtree are greater than the value at the given node. This logic makes it easy to see where the **maximum** value in a binary search tree would reside. 

// Diagram: The first node in the reverse inorder traversal of a binary search tree has the minimum value in the tree

// Diagram: Maximum value in a binary search tree

## Inorder traversal

The inorder traversal of a binary search tree will always be a list of sorted values. This is because, in a binary search tree, the nodes are structured so that for every node, the left subtree < node < right subtree. If we follow the inorder traversal that is left, center, and right, we are guaranteed to get a list of sorted values.

// Diagram: Inorder traversal of a binary search tree gives a reverse sorted array

## Reverse inorder traversal

Just like the inorder traversal of a binary search always results in a sorted list, if we follow the reverse inorder traversal, which is right, center, and left, we can get a list in reverse sorted order (descending order).

// Diagram: Reverse inorder traversal of a binary search tree gives a reverse sorted array

***

# Implementation of binary search trees

Since a binary search tree is just one that follows some special properties, its structure is the same as any other binary tree. We know that a binary tree can be represented using arrays and linked structures, so a binary search tree can also be represented using any of those.

However, binary search trees are more commonly represented and stored as linked data structures rather than arrays.

**Why are binary search trees stored and represented as linked structures?**

Binary search trees are typically represented and stored as linked structures because we rarely need to go upwards in a binary search tree during any operation. Representing and storing binary search trees as a linked data structure allows us to dynamically increase or decrease the size.

Every node stores a value and the addresses of the left and right children. When linked together, multiple nodes form the binary search tree, just like generic binary trees.

// Diagram: Representation of a binary search tree is the same as a binary tree
