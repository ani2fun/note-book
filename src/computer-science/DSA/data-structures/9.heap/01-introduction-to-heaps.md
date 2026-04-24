# Introduction to heaps

## Table of Contents

1. [Understanding the problem](#understanding-the-problem)
2. [Exploring a possible solution](#exploring-a-possible-solution)
3. [Understanding a heap](#understanding-a-heap)
4. [Types of heaps](#types-of-heaps)
5. [Overview of supported operations](#overview-of-supported-operations)
6. [Tree heap validator](#tree-heap-validator)

***

# Understanding the problem

To better understand a heap, let us look at some interesting problems programmers face when designing software systems. When writing a program, we often need a data store that is smart enough to remember the smallest or largest data items stored in it at all times. Inserting new data items and retrieving the new minimum or maximum should be very efficient.

For example, consider a hospital emergency ward with only a few doctors but multiple patients. Each patient is assigned a number to determine their priority, depending on how critical their situation is. Whenever a doctor becomes available, the patient with the highest priority is picked up from the room, and the doctor is assigned to them.

// Diagram: Patients assigned priorities to see a fixed number of doctors

One way to implement such a data store would be to use a linked list in which each node stores the patient's name and priority.

// Diagram: Storing priorities in linked list

This is an easy way to store data, but what if a new patient comes in? In this case, we can add the new patient to the head of the linked list, which is a constant-time operation.

// Diagram: A new priority data can be added at the head of the linked list

Now let's consider another scenario. What if a doctor becomes available, and we must extract the patient with the highest priority? We can perform a linear scan to find the highest-priority patient and delete that node from the linked list.

// Diagram: Traverse the entire linked list to find the highest priority data

This will solve the problem at hand. However, the most frequent operation (finding the max and extracting it) involves doing a linear scan of the entire list, which is inefficient if there are many patients. What if we scale this example to include country-wide emergency services like 911, where priorities may be assigned to hundreds of thousands of cases?

## Limitations of a linked list

Even though we can solve the problem at hand using a linked list, it is inefficient if we have to find or extract maximum priority items frequently. The solution above performs poorly.

> 1.  **Extra space:** Implementing the data store as a linked list uses extra space for the next and previous pointers of the node
> 2.  **Performance:** The algorithm to find and extract the min/max performs poorly as it involves a linear scan of all items.

What if we had a magical data structure that could efficiently solve the above problem at scale?

***

# Exploring a possible solution

Now that we know that storing priorities in a linked list has limitations and results in sub-optimal solutions, we can look at a data structure explicitly designed to solve this problem. A priority queue is a data structure designed to keep track of the maximum or minimum of a continuously changing dataset.

## What is a priority queue?

A priority queue is a specialized data structure that stores data items with associated priorities. Like a regular queue, data can only be added at the end and extracted from the front.

Unlike a regular queue, which serves data in the FIFO (first in, first out) order, a priority queue always serves the highest priority data first. If two data items have the same priority, it serves them in a FIFO order.

// Diagram: The logical representation of a priority queue

## Real life example

To better understand how a priority queue works, let's revisit the doctor-patient problem from before. Imagine many patients are coming to a hospital with a limited number of doctors. Each incoming patient is assigned a number that represents their priority, and when the next doctor becomes available, they are assigned to the patient with the highest priority.

We can easily solve this problem using a priority queue. When a new patient comes in, we push them into the priority queue and their associated priority. When a doctor becomes available, we extract the patient at the front of the queue and assign the doctor to them. The priority queue guarantees that the patient with the highest priority will be at the front of the queue at the time of extraction.

// Diagram: Patients assigned priorities to see a fixed number of doctors using a priority queue

A priority queue is a powerful data structure that can solve such problems at scale. It is an abstract data type and can be implemented in many ways, including sorted arrays, self-balancing search trees, etc. Every implementation has its advantages and disadvantages. We will learn about its implementation using heap later in the course.

***

# Understanding a heap

One of the most common priority queue implementations uses a special type of tree called a heap. It is just a tree that follows a special **heap property**. It can be implemented using a binary tree or an N-ary tree, but we will only learn its binary tree implementation. A heap implemented using a binary tree is also called a **binary heap,** and its heap property is as follows. 

> -   The tree is a complete binary tree.
> -   It follows the heap ordering property

## Complete binary tree

A complete binary tree is one in which all the levels are filled except possibly the last level, with all the nodes as left as possible. The logical representation of a heap is given below.

// Diagram: A complete binary tree

## Heap ordering property

The heap ordering property makes the insertion and extraction of the highest-priority data items from a regular binary tree so efficient. It is a condition enforced on all nodes of the binary tree for it to qualify as a heap. Every node in the tree should follow the condition given below.

> A node has higher priority than both its children

// Diagram: The heap ordering property

***

# Types of Heaps

Priority is a subjective term but can be generally classified as numeric values. In some cases, having a lower value means having a higher priority (like ranks), while in others, having a higher value may mean having a higher priority (like scores). Depending on what classifies as a high priority, a heap can be categorized into two types.

> -   Max heap
> -   Min heap

### Max heap

A max heap follows the max heap ordering property, which states that the value of any given node should be **greater** than the value of all its children. The root node of the tree has the maximum value.

// Diagram: Example of a max heap

### Min Heap

A min heap is a tree that follows the min heap ordering property, which states that the value of any given node should be **less** than the value of all its children. The root node of the tree has the minimum value.

// Diagram: Example of a min heap

***

# Overview of supported operations

Now that we know what a heap is and how it keeps track of the highest-priority data item, we can dive a bit deeper and understand the different operations that can be performed on it. Every data structure has its special powers, and for a heap, it is ultra-fast insertion and extraction of the highest-priority data item. The primary operations on a heap and their high-level workings are given below.

## Insert

The insert operation is one of the primary operations on a heap and is used to insert a data item and its associated priority. A new node with the given priority is created and added to the tree. If the new data item has the highest priority in the dataset, it makes its way to the root of the tree at the end of the operation.

// Diagram: Insert 53 in the given max heap

## Delete

The delete operation is another primary operation on a heap and is used to delete an item from the heap. The node with the given data is searched and deleted from the tree. The tree is then recalibrated, and nodes are rearranged to ensure that the tree still follows the heap property. If the highest priority data item (root) is deleted, the data item with the next highest priority makes its way to the root (top) of the tree.

// Diagram: Delete 20 from the given max heap

## Peek

The peek operation only looks at the highest-priority data item from the heap and returns its value. Unlike extract, it does not remove it from the heap, so it is a read-only operation that leaves the heap unmodified.

// Diagram: Peek the top value in the given max heap

## Extract

The extract operation extracts the highest-priority data item from the heap. This operation removes the root node of the tree and returns its value. The data item with the next highest priority moves to the root(top) of the tree and the end of this operation.

// Diagram: Extract the top value from the given max heap

## Construct

In most cases, a heap starts empty and grows as more data items are added. In some cases, however, we might need to create a heap from an existing dataset. Constructing a heap from a given dataset is a slightly more efficient way than inserting data only into an empty heap.

// Diagram: Construct a heap from the given sequence of data

We will learn more about all these operations and others when we learn their implementation using arrays and linked lists later in the course.

***

# Tree heap validator

## Problem Statement

Given the **root** of a binary tree,write a function that returns `true` if the tree represents a valid min heap and returns `false` otherwise.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, 5, 6, 7\]
> -   **Output:** true
> -   **Explanation:** The above tree represents a valid min heap.

### Example 2

> -   **Input:** arr = \[1, 4, 3, 2, 5, 6, 7\]
> -   **Output:** false
> -   **Explanation:** The above tree does not represent a valid min heap.

## Solution

```cpp
#include <climits>

/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int val) : val(val), left(nullptr), right(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    bool isValidHeap(TreeNode *root, int parentVal) {

        // Base case: if the current root is nullptr, it's a valid
        // heap root
        if (root == nullptr) {
            return true;
        }

        // Check if the current root violates the min-heap property
        if (root->val < parentVal) {
            return false;
        }

        // Recursively check the left and right subtrees
        bool isLeftSubtreeValid = isValidHeap(root->left, root->val);
        bool isRightSubtreeValid = isValidHeap(root->right, root->val);

        // Return true only if both subtrees are valid heaps
        return isLeftSubtreeValid && isRightSubtreeValid;
    }

    bool treeHeapValidator(TreeNode *root) {

        // Check if the root is nullptr (empty tree), which is considered
        // a valid min-heap
        if (root == nullptr) {
            return true;
        }

        // Start the depth-first search (DFS) from the root with an
        // initial parent value of negative infinity
        return isValidHeap(root, INT_MIN);
    }
};
```
