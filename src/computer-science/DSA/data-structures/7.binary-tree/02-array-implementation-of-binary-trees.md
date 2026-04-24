# Array implementation of binary trees

## Table of Contents

1. [Introduction to array based binary trees](#introduction-to-array-based-binary-trees)
2. [Defining a node in binary tree](#defining-a-node-in-binary-tree)
3. [Structure of a binary tree](#structure-of-a-binary-tree)
4. [Understanding a generic binary tree](#understanding-a-generic-binary-tree)

***

# Introduction to array based binary trees

Let us look at a **complete binary tree**. We can see a pattern if we try to **enumerate** the nodes of a complete binary tree, starting from the root and going top to bottom, left to right.

// Diagram: Enumerating nodes of a complete binary tree

> We can see that for any node n:
>
> -   The left child = (2 \* n) + 1
> -   The right child = (2 \* n) + 2

This pattern is a special property of a complete binary tree.

We can use the enumeration of a complete binary tree to represent a binary tree in an array. The enumeration of a node can be used as an index in an array that stores the value of a given node.

// Diagram: Array implementation of a binary tree

Later in this course, we will learn how to implement any binary tree using arrays and how to move around between nodes without pointers and references using pure mathematics.

***

# Defining a node in binary tree

The array implementation of a binary tree is based on individual nodes making up the entire tree. These individual nodes, however, don't have **left** and **right** sections to hold references like nodes in a linked list. As we will see later in the course, the array implementation of a tree relies on simple math and the properties of a full binary tree to figure out the left and right child of a node.

## Structure of a node

In the array implementation, the data stored in the node is the node itself. It does not need left and right sections, as moving around in the array implementation of a binary tree is accomplished using simple math, as we will learn later.

// Diagram: Binary tree node

## Implementing a node

Since the binary tree node in the array implementation is the data itself, a class is not needed to implement it. 

C++

```cpp
// datatype of the data stored in the node
// is the datatype of the node as well
datatype node;
```

Java

```java
// datatype of the data stored in the node
// is the datatype of the node as well
datatype node;
```

Typescript

```typescript
// datatype of the data stored in the node
// is the datatype of the node as well
const node: datatype = {};
```

Javascript

```javascript
// datatype of the data stored in the node
// is the datatype of the node as well
node = {};
```

Python

```python
# datatype of the data stored in the node
# is the datatype of the node as well
node: datatype = {};
```

***

# Structure of a binary tree

Now that we know how individual nodes of a binary tree look in the array implementation, let us look at how they link up together to form a binary tree. Multiple nodes link up together to create the binary tree structure. When implemented as an array, the node's enumeration in its tree representation is used as an index in the array where the data associated with that node is stored. 

// Diagram: Individual nodes arranged sequentially in an array

What looks like a tree on paper looks very different when implemented as an array in the computer memory. The resulting binary tree looks like a regular array of nodes in the memory. Let us look at what a binary tree implemented as an array looks like in the computer memory.

// Diagram: Binary tree array implementation in computer memory

## Root node

Unlike when implementing a binary tree using linked lists, we don't need to store the reference to the root node when the binary tree is implemented using an array. This is because the first node of the array will always be the root node as the node has the enumeration 0.

## Moving down

Unlike a binary tree implemented using a linked list, a binary tree implemented as an array does not have **left** and **right** sections to help move from a parent node to the child node. However, there is a relationship between the enumeration of a node in the tree and the index of the array in which it is stored. Using this enumeration and the special properties of a **complete** binary tree, we can move from a parent node to a child node using simple mathematics.

> For a node at index n:
>
> -   Index of left child = (2 \* n) + 1
> -   Index of right child = (2 \* n) + 2

// Diagram: Moving around in the tree

## Moving up

There is a special benefit of implementing a binary tree using arrays. The linked list implementation of a binary tree uses **unidirectional** references. This is why we can only move from a parent node to a child node by following these references and not vice versa. In the array representation, however, since arrays provide **random access** capabilities, we can move up the tree from a child node to a parent node if we know the index of the parent node. The index of the parent node can be easily calculated from the index of a child node.

// Diagram: This method relies on integer division that truncates the fractional part of the result. Eg - 5 / 2 = 2

> For a node at index n:
>
> -   Index of parent node = (n - 1) / 2

// Diagram: Moving around in the tree

## Leaf nodes

Unlike when implementing a binary tree using linked lists, a binary tree, when implemented using arrays, does not make use of `null` to identify leaf nodes. In the array implementation, nodes do not store any information about their children. However, the index of the node in the array is used to identify whether a given node is a leaf node or not.

If the index of the left and right child of a node in the array is out of bounds of the array, it means that the given node does not have a left and a right child and hence is a leaf node.

***

# Understanding a generic binary tree

Now that we know how **complete binary trees** are implemented using arrays, let's try to understand how we can **extend** the same idea to any generic binary tree. Generic binary trees cannot be implemented using an array as easily as complete binary trees. This is because the implementation relies on some structural properties of a complete binary tree. Let us look at the problem we face when implementing a generic binary tree using arrays and how we can overcome it.

## Understanding the problem

The problem here is pretty clear. To implement a binary tree using an array and be able to move around easily, the tree should follow some structural characteristic properties. The properties are given below.

> When the nodes of the tree are enumerated:
>
> -   For any node **n**, the **left** child should be enumerated as **(2 \* n ) + 1**
> -   For any node **n**, the **right** child should be enumerated as **(2 \* n ) + 2**

However, only **complete binary trees** have this property. This means it is not possible to implement non-complete binary trees using arrays.

// Diagram: Non Complete Binary Trees

## Exploring a possible solution

The fix to this problem, however, is straightforward. We can first convert any given tree into a complete binary tree by filling in the empty spaces with **dummy** nodes. These dummy nodes hold a **garbage** value that helps us identify them as dummy nodes. This way, a non-complete binary tree is first converted to a complete binary tree, which is then enumerated and implemented as an array.

// Diagram: Implementing generic binary trees using arrays

**Do we have to modify the original tree by adding dummy nodes?**

We do **not** have to modify the original tree. You can think of it as implementing the original tree in the **skeleton** of the closest complete binary tree. In that skeleton, we mark the dummy nodes to clarify that they are not in the original tree. We also modify all our algorithms that traverse or operate on the tree to ignore the dummy nodes completely. We use these dummy nodes to ensure our mathematical equations to hop around the tree still work as before.

## Limitations

The limitations of implementing a non-complete binary tree using arrays should be pretty clear now. Dummy nodes do not store any data but still use the same amount of memory as any other node in the array implementation. Depending on the structure of the tree we are trying to implement, this extra wasted space maybe even more than the size of the actual tree.

// Diagram: More dummy nodes than real nodes in array implementation

Even with these limitations, the array implementation of a binary tree is quite handy when we know the number of nodes in a binary tree in advance. We can create an array of appropriate sizes and fill it with values in the correct places. In this course, however, we will focus only on the linked list representation of a binary tree as it is the most widely used one.
