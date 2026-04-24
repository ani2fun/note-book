# Iterators in a binary search trees

## Table of Contents

1. [Understanding iterators in binary search trees](#understanding-iterators-in-binary-search-trees)
2. [Understanding the forward BST iterator](#understanding-the-forward-bst-iterator)
3. [Design a forward BST iterator](#design-a-forward-bst-iterator)
4. [Understanding the reverse BST iterator](#understanding-the-reverse-bst-iterator)
5. [Design a reverse BST iterator](#design-a-reverse-bst-iterator)

***

# Understanding iterators in binary search trees

A binary search tree follows the special binary search property, which means the value of all the nodes in the left subtree of a node is smaller than it and the value of all the nodes in the right subtree is greater. Consequently, the inorder traversal that follows the left-node-right sequence traverses the tree in the sorted order(**ascending**) of values, while the reverse inorder traversal that follows the right-node-left sequence traverses the tree in the reverse sorted(**descending**) order.

// Diagram: The inorder traversal traverses the nodes in the sorted order, while the reverse-sorted order traverses them in the reverse-sorted order.

Consider that we have a binary search tree and must traverse all its nodes in the sorted(`ascending`) order of values. However, we don't want to traverse the entire tree at once, but move to the next node on demand, i.e. only when needed. The recursive or iterative inorder traversal traverses the entire tree all at once, and we cannot stop and resume the traversal from where we left off.

// Diagram: Recursive traversal traverses the entire tree at once

An iterator is an abstraction over the underlying data structure that allows lazily traversing it only one item at a time and only moves to the next item when explicitly requested by calling its `next()` function. Internally, it may maintain some state to quickly move to the next item when requested without traversing the entire data structure at once. This allows traversing the items of a data structure on demand instead of the whole and is generally more memory efficient.

// Diagram: An iterator traverses the nodes of a tree on demans via the next() function

An iterator implements the iterator interface, which defines the functions available to the caller of an iterator to traverse the underlying data structure. Below is a simple iterator interface that we will use in this course.

C++

```cpp
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

// Diagram: using namespace std;

class BSTIterator {
public:
    BSTIterator(TreeNode *root) {

    }

    bool hasNext() {
        // Is there a next item?
    }

    TreeNode* next() {
        // Return the next node
    }
};
```

Java

```java
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *      int val;
 *      TreeNode left;
 *      TreeNode right;
 *      TreeNode() {}
 *      TreeNode(int val) { this.val = val; }
 * }
 */

class BSTIterator {
    public BSTIterator(TreeNode root) {

    }

    public boolean hasNext() {
        // Is there a next item?
    }

    public TreeNode next() {
        // Return the next node
    }
```

Typescript

```typescript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(
 *         val?: number,
 *         left?: TreeNode | null,
 *         right?: TreeNode | null
 *     ) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

export class BSTIterator {
    constructor(root: TreeNode | null) {

    }

    hasNext(): boolean {
        // Is there a next item?
    }

    next(): TreeNode {
        // Return the next node
    }
```

Javascript

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

export class BSTIterator {
    constructor(root) {

    }

    hasNext() {
        // Is there a next item?
    }

    next() {
        // Return the next node
    }
```

Python

```python
"""
Definition for a binary tree node.
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
"""

class BSTIterator:
    def __init__(self, root: Optional[TreeNode]) -> None:
        pass

    def has_next(self) -> bool:
        # Is there a next item?
        pass

    def next(self) -> TreeNode:
        # Return the next node
        pass
```

***

# Understanding the forward BST iterator

For a binary search tree, the forward iterator traverses the nodes of a tree on demand in the inorder sequence. This allows traversing the tree in the sorted order(**ascending**) of values, one node at a time, moving to the next node only when explicitly requested.

We can modify the iterative inorder traversal algorithm by separating the traversal to the left and right subtrees to devise an algorithm for the forward iterator. The iterator class has the stack from the iterative traversal as a data member `stack`. Upon creating the iterator, we repeatedly move to the **left** of each node starting from the root node and add all the nodes to the stack until we hit a `null` reference. At this point, the node at the top of the stack is the first node from the inorder traversal.

// Diagram: Initializing a forward iterator repeatedly pushes left nodes to a stack

To get the next item of the inorder traversal, we extract the node at the top of the stack and repeat the same process for its **right** child, i.e repeatedly move to the **left** of each node starting from the **right** child and add them to the stack until we hit a `null` reference. At this point, the node at the top of the stack will be the next item in the inorder traversal.

// Diagram: After getting the top of the stack, all left nodes are repeatedly pushed to the stack starting from the right child

The same process can be repeated to get the next and further nodes in the inorder traversal, and so is the algorithm for the `next()` function of the forward iterator.

// Diagram: Working of a forward iterator

## Algorithm

The algorithm for the implementation of a forward iterator of a binary search tree is given below.

> **ForwardBstIterator**
>
> **constructor(root):**
>
> -   **Step 1:** Initialize a stack \`stack\` to hold references of tree nodes as a member variable
> -   **Step 2:** Call \`pushAllLeft(root)\`
>
> **pushAllLeft(node):**
>
> -   **Step 1:** Repeat the following steps while \`node\` is not a \`null\` reference:
>     -   **Step 1.1:** Push \`node\` onto the \`stack\`
>     -   **Step 1.2:** Set \`node\` to \`node.left\`
>
> **hasNext():**
>
> -   **Step 1:** Return \`true\` if \`stack\` is not empty otherwise return \`false\`
>
> **next():**
>
> -   **Step 1:** If there are no more elements in the stack
>     -   **Step 1.1:** Return \`null\`
> -   **Step 2:** Initialize a local variable \`node\` with the node at the top of the \`stack\`
> -   **Step 3:** Pop the item at the top of \`stack\`
> -   **Step 4:** Call \`pushAllLeft(node.right)\`
> -   **Step 5:** Return \`node\`

## Implementation

The implementation of a forward iterator of a binary search tree is quite simple. We implement the generic iterator interface and add the stack as a data member of the class. The `next()` function gets the item from the top of the stack and, before returning the node to the caller, repeatedly pushes all the left nodes starting from its right child to correctly update the stack for the next call to `next()`.

C++

```cpp
#include <stack>

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

// Diagram: using namespace std;

class ForwardBstIterator {
public:

    // Create a stack to store tree nodes
    stack<TreeNode *> stack;

// Diagram: ForwardBstIterator(TreeNode root) {

        // Push all left child nodes of the root onto the stack
        pushAllLeft(root);
    }

    // Helper function to push all left child nodes of the current node
    // onto the stack
    void pushAllLeft(TreeNode *node) {
        while (node != nullptr) {

            // Push the node onto the stack
            stack.push(node);

            // Move to the left child
            node = node->left;
        }

// Diagram: bool hasNext() {

        // If the stack is not empty, there are more elements
        return !stack.empty();
    }

// Diagram: TreeNode next() {

        // If there are no more nodes to visit in the BST, return null
        // to indicate that next() has no valid node to return.
        if (!hasNext()) {
            return nullptr;
        }

        // Get the top node from the stack
        TreeNode *node = stack.top();

        // Remove the top node from the stack
        stack.pop();

        // Push all left child nodes of the right subtree onto the stack
        pushAllLeft(node->right);

        // Return the current node
        return node;
    }
};
```

Java

```java
import java.util.*;

/**
 * Definition for a binary tree node.
 * class TreeNode {
 *      int val;
 *      TreeNode left;
 *      TreeNode right;
 *      TreeNode() {}
 *      TreeNode(int val) { this.val = val; }
 * }
 */

// Diagram: class ForwardBstIterator {

    // Create a stack to store tree nodes
    Stack<TreeNode> stack;

    public ForwardBstIterator(TreeNode root) {
        stack = new Stack<>();

        // Push all left child nodes of the root onto the stack
        pushAllLeft(root);
    }

    // Helper function to push all left child nodes of the current node
    // onto the stack
    public void pushAllLeft(TreeNode node) {
        while (node != null) {

            // Push the node onto the stack
            stack.push(node);

            // Move to the left child
            node = node.left;
        }

// Diagram: public boolean hasNext() {

        // If the stack is not empty, there are more elements
        return !stack.empty();
    }

// Diagram: public TreeNode next() {

        // If there are no more nodes to visit in the BST, return null
        // to indicate that next() has no valid node to return.
        if (!hasNext()) {
            return null;
        }

        // Get the top node from the stack
        TreeNode node = stack.pop();

        // Push all left child nodes of the right subtree onto the stack
        pushAllLeft(node.right);

        // Return the current node
        return node;
    }
```

Typescript

```typescript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(
 *         val?: number,
 *         left?: TreeNode | null,
 *         right?: TreeNode | null
 *     ) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

// Diagram: export class ForwardBstIterator {

    // Create a stack to store tree nodes
    stack: (TreeNode | null)[];

    constructor(root: TreeNode | null) {
        this.stack = [];
        this.pushAllLeft(root);
    }

    // Helper function to push all left child nodes of the current node
    // onto the stack
    pushAllLeft(node: TreeNode | null): void {
        while (node !== null) {

            // Push the node onto the stack
            this.stack.push(node);

            // Move to the left child
            node = node.left;
        }

// Diagram: hasNext(): boolean {

        // If the stack is not empty, there are more elements
        return this.stack.length > 0;
    }

// Diagram: next(): TreeNode | null {

        // If there are no more nodes to visit in the BST, return null
        // to indicate that next() has no valid node to return.
        if (!this.hasNext()) {
            return null;
        }

        // Get the top node from the stack
        const node = this.stack.pop()!;

        // Push all left child nodes of the right subtree onto the stack
        this.pushAllLeft(node.right);

        // Return the current node
        return node;
    }
```

Javascript

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

// Diagram: export class ForwardBstIterator {

    // Create a stack to store tree nodes
    stack;

    constructor(root) {
        this.stack = [];
        this.pushAllLeft(root);
    }

    // Helper function to push all left child nodes of the current node
    // onto the stack
    pushAllLeft(node) {
        while (node !== null) {

            // Push the node onto the stack
            this.stack.push(node);

            // Move to the left child
            node = node.left;
        }

    hasNext() {

        // If the stack is not empty, there are more elements
        return this.stack.length > 0;
    }

    next() {

        // If there are no more nodes to visit in the BST, return null
        // to indicate that next() has no valid node to return.
        if (!this.hasNext()) {
            return null;
        }

        // Get the top node from the stack
        const node = this.stack.pop();

        // Push all left child nodes of the right subtree onto the stack
        this.pushAllLeft(node.right);

        // Return the current node
        return node;
    }
```

Python

```python
"""
Definition for a binary tree node.
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
"""

// Diagram: from typing import Optional, List

class ForwardBstIterator:
    def __init__(self, root: Optional[TreeNode]):

        # Create a stack to store tree nodes
        self.stack: List[TreeNode] = []
        self.push_all_left(root)

    # Helper function to push all left child nodes of the current node
    # onto the stack
    def push_all_left(self, node: Optional[TreeNode]) -> None:
        while node:

            # Push the node onto the stack
            self.stack.append(node)

            # Move to the left child
            node = node.left

    def has_next(self) -> bool:

        # If the stack is not empty, there are more elements
        return bool(self.stack)

    def next(self) -> Optional[TreeNode]:

        # If there are no more nodes to visit in the BST, return null
        # to indicate that next() has no valid node to return.
        if not self.has_next():
            return None

        # Get the top node from the stack
        node = self.stack.pop()

        # Push all left child nodes of the right subtree onto the stack
        self.push_all_left(node.right)

        # Return the current node
        return node
```

## Complexity Analysis

The forward iterator traverses the entire binary search tree one node at a time and on demand. The `next()` function may take anywhere between constant **O(1)** to **O(h)** time where **h** is the height of the tree, depending on how many nodes need to be pushed into the stack before returning the top of the stack. However, since `next()` can only be called up to **N** times, where **N** is the number of nodes and every node is only visited twice, once when inserting it into the stack and next when popping it from the top of the stack, calling `next()` **N** times results in **O(2\*N) ~ O(N)** time. And so, the amortized time complexity of `next()` is constant **O(1)**.

We only keep all the nodes in the path from the root node to the node coming up next in the traversal in the stack. And so, the maximum size of the stack is the size of the longest root-to-node path in the tree, which is its height. In the best case, the tree is height balanced and so the space complexity is **O(log(N))** and in the worst case the tree may be a degenerate tree leading to a linear **O(N)** space complexity.

> **Best Case** - The binary search tree is height-balanced
>
> -   Space Complexity - **O(logN)**
> -   Time Complexity of \`next()\` - **Amortized O(1)**
>
> **Worst Case** - The binary search tree is degenerate
>
> -   Space Complexity - **O(N)**
> -   Time Complexity of \`next()\` - **Amortized O(1)**

***

# Design a forward BST iterator

## Problem Statement

Given the skeleton of a **ForwardBstIterator class** that helps iterate through the nodes of a binary search tree in a specific order (in-order traversal), complete this class by implementing all the operations below.

> -   **ForwardBstIterator(TreeNode root)** - Initializes a new instance of the ForwardBstIterator class using the provided root of the BST as an argument to the constructor.
> -   **hasNext()** - This method verifies whether a node exists to the right of the iterator's current position during traversal, returning true if one is found and false otherwise.
> -   **next()** - This method shifts the iterator's pointer to the right and returns the node at the new pointer location.

### Example

> The input should adhere to the following rules:
>
> 1.  The input should contain two arrays of the same size.
> 2.  The first array should contain the list of operations, while the second should contain the corresponding operands for those operations.
> 3.  The first index in the first array should contain **ForwardBstIterator**, and the first index in the second array should contain the root of a binary tree, which this iterator will traverse. This is used to initialise the ForwardBstIterator.
> 4.  For each index in the first array that contains **hasNext**, or operations, the corresponding index in the second array should contain an empty array.
>
> **Example:**
>
> -   **Input:** \[ForwardBstIterator, next, next, hasNext, next, hasNext, next, hasNext, next, hasNext\] \[\[7, 3, 15, null, null, 9, 20\], \[\], \[\], \[\], \[\], \[\], \[\], \[\], \[\], \[\]\]
>
> -   **Output:** \[null, 3, 7, true, 9, true, 15, true, 20, false\]
>
> **Explanation:**
>
> **Operation:** ForwardBstIterator forwardBstIterator = new ForwardBstIterator(\[7, 3, 15, null, null, 9, 20\]) **Result:** Initializes a \`ForwardBstIterator\` for the given BST
>
> **Operation:** forwardBstIterator.next() **Result:** Returns \`3\`
>
> **Operation:** forwardBstIterator.next() **Result:** Returns \`7\`
>
> **Operation:** forwardBstIterator.hasNext() **Result:** Returns \`true\`
>
> **Operation:** forwardBstIterator.next() **Result:** Returns \`9\`
>
> **Operation:** forwardBstIterator.hasNext() **Result:** Returns \`true\`
>
> **Operation:** forwardBstIterator.next() **Result:** Returns \`15\`
>
> **Operation:** forwardBstIterator.hasNext() **Result:** Returns \`true\`
>
> **Operation:** forwardBstIterator.next() **Result:** Returns \`20\`
>
> **Operation:** forwardBstIterator.hasNext() **Result:** Returns \`false\`

## Solution

```cpp
#include <stack>

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

class ForwardBstIterator {
public:

    // Create a stack to store tree nodes
    stack<TreeNode *> stack;

    ForwardBstIterator(TreeNode *root) {

        // Push all left child nodes of the root onto the stack
        pushAllLeft(root);
    }

    // Helper function to push all left child nodes of the current node
    // onto the stack
    void pushAllLeft(TreeNode *node) {
        while (node != nullptr) {

            // Push the node onto the stack
            stack.push(node);

            // Move to the left child
            node = node->left;
        }
    }

    bool hasNext() {

        // If the stack is not empty, there are more elements
        return !stack.empty();
    }

    TreeNode *next() {

        // If there are no more nodes to visit in the BST, return null
        // to indicate that next() has no valid node to return.
        if (!hasNext()) {
            return nullptr;
        }

        // Get the top node from the stack
        TreeNode *node = stack.top();

        // Remove the top node from the stack
        stack.pop();

        // Push all left child nodes of the right subtree onto the stack
        pushAllLeft(node->right);

        // Return the current node
        return node;
    }
};
```

***

# Understanding the reverse BST iterator

For a binary search tree, the reverse iterator traverses the nodes of a tree on demand in the reverse inorder sequence. This allows traversing the tree in the reverse sorted order(**descending**) of values, one node at a time, moving to the next node only when explicitly requested.

The algorithm for a reverse iterator is very similar to a forward iterator, as we only need to flip the order of traversal. The iterator class has the stack from the iterative traversal as a data member `stack`. Upon creating the iterator, we repeatedly move to the **right** of each node starting from the root node and add all the nodes to the stack until we hit a `null` reference. At this point, the node at the top of the stack is the first node from the reverse inorder traversal.

// Diagram: Initializing a reverse iterator repeatedly pushes right nodes to a stack

To get the next item of the reverse inorder traversal, we extract the node at the top of the stack and repeat the same process for its **left** child, i.e repeatedly move to the **right** of each node starting from the **left** child and add them to the stack until we hit a `null` reference. At this point, the node at the top of the stack will be the next item in the reverse inorder traversal.

// Diagram: After getting the top of the stack, all right nodes are repeatedly pushed to the stack starting from the left child

The same process can be repeated to get the next and further nodes in the reverse inorder traversal, and so is the algorithm for the `next()` function of the forward iterator.

// Diagram: Working of a reverse iterator

## Algorithm

The algorithm for the implementation of a reverse iterator of a binary search tree is given below.

> **ReverseBstIterator**
>
> **constructor(root):**
>
> -   **Step 1:** Initialize a stack \`stack\` to hold references of tree nodes as a member variable
> -   **Step 2:** Call \`pushAllRight(root)\`
>
> **pushAllRight(node):**
>
> -   **Step 1:** Repeat the following steps while \`node\` is not a \`null\` reference:
>     -   **Step 1.1:** Push \`node\` onto the \`stack\`
>     -   **Step 1.2:** Set \`node\` to \`node.right\`
>
> **hasNext():**
>
> -   **Step 1:** Return \`true\` if \`stack\` is not empty otherwise return \`false\`
>
> **next():**
>
> -   **Step 1:** If there are no more elements in the stack
>     -   **Step 1.1:** Return \`null\`
> -   **Step 2:** Initialize a local variable \`node\` with the node at the top of the \`stack\`
> -   **Step 3:** Pop the item at the top of \`stack\`
> -   **Step 4:** Call \`pushAllRight(node.left)\`
> -   **Step 5:** Return \`node\`

## Implementation

The implementation of a reverse iterator of a binary search tree is quite simple. We implement the generic iterator interface and add the stack as a data member of the class. The `next()` function gets the item from the top of the stack and, before returning the node to the caller, repeatedly pushes all the right nodes starting from its left child to correctly update the stack for the next call to `next()`.

C++

```cpp
#include <stack>

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

// Diagram: using namespace std;

class ReverseBstIterator {
public:

    // Create a stack to store tree nodes
    stack<TreeNode *> stack;

// Diagram: ReverseBstIterator(TreeNode root) {

        // Push all right child nodes of the root onto the stack
        pushAllRight(root);
    }

    // Helper function to push all right child nodes of the current node
    // onto the stack
    void pushAllRight(TreeNode *node) {
        while (node != nullptr) {

            // Push the node onto the stack
            stack.push(node);

            // Move to the right child
            node = node->right;
        }

// Diagram: bool hasNext() {

        // If the stack is not empty, there are more elements
        return !stack.empty();
    }

// Diagram: TreeNode next() {

        // If there are no more nodes to visit in the BST, return null
        // to indicate that next() has no valid node to return.
        if (!hasNext()) {
            return nullptr;
        }

        // Get the top node from the stack
        TreeNode *node = stack.top();

        // Remove the top node from the stack
        stack.pop();

        // Push all left child nodes of the left subtree onto the stack
        pushAllRight(node->left);

        // Return the current node
        return node;
    }
};
```

Java

```java
import java.util.*;

/**
 * Definition for a binary tree node.
 * class TreeNode {
 *      int val;
 *      TreeNode left;
 *      TreeNode right;
 *      TreeNode() {}
 *      TreeNode(int val) { this.val = val; }
 * }
 */

// Diagram: class ReverseBstIterator {

    // Create a stack to store tree nodes
    Stack<TreeNode> stack;

    public ReverseBstIterator(TreeNode root) {
        stack = new Stack<>();

        // Push all right child nodes of the root onto the stack
        pushAllRight(root);
    }

    // Helper function to push all right child nodes of the current node
    // onto the stack
    public void pushAllRight(TreeNode node) {
        while (node != null) {

            // Push the node onto the stack
            stack.push(node);

            // Move to the right child
            node = node.right;
        }

// Diagram: public boolean hasNext() {

        // If the stack is not empty, there are more elements
        return !stack.empty();
    }

// Diagram: public TreeNode next() {

        // If there are no more nodes to visit in the BST, return null
        // to indicate that next() has no valid node to return.
        if (!hasNext()) {
            return null;
        }

        // Get the top node from the stack
        TreeNode node = stack.pop();

        // Push all left child nodes of the left subtree onto the stack
        pushAllRight(node.left);

        // Return the current node
        return node;
    }
```

Typescript

```typescript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(
 *         val?: number,
 *         left?: TreeNode | null,
 *         right?: TreeNode | null
 *     ) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

// Diagram: export class ReverseBstIterator {

    // Create a stack to store tree nodes
    stack: (TreeNode | null)[];

    constructor(root: TreeNode | null) {
        this.stack = [];
        this.pushAllRight(root);
    }

    // Helper function to push all right child nodes of the current node
    // onto the stack
    pushAllRight(node: TreeNode | null): void {
        while (node !== null) {

            // Push the node onto the stack
            this.stack.push(node);

            // Move to the right child
            node = node.right;
        }

// Diagram: hasNext(): boolean {

        // If the stack is not empty, there are more elements
        return this.stack.length > 0;
    }

// Diagram: next(): TreeNode | null {

        // If there are no more nodes to visit in the BST, return null
        // to indicate that next() has no valid node to return.
        if (!this.hasNext()) {
            return null;
        }

        // Get the top node from the stack
        const node = this.stack.pop()!;

        // Push all left child nodes of the left subtree onto the stack
        this.pushAllRight(node.left);

        // Return the current node
        return node;
    }
```

Javascript

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

// Diagram: export class ReverseBstIterator {

    // Create a stack to store tree nodes
    stack;

    constructor(root) {
        this.stack = [];
        this.pushAllRight(root);
    }

    // Helper function to push all right child nodes of the current node
    // onto the stack
    pushAllRight(node) {
        while (node !== null) {

            // Push the node onto the stack
            this.stack.push(node);

            // Move to the right child
            node = node.right;
        }

    hasNext() {

        // If the stack is not empty, there are more elements
        return this.stack.length > 0;
    }

    next() {

        // If there are no more nodes to visit in the BST, return null
        // to indicate that next() has no valid node to return.
        if (!this.hasNext()) {
            return null;
        }

        // Get the top node from the stack
        const node = this.stack.pop();

        // Push all left child nodes of the left subtree onto the stack
        this.pushAllRight(node.left);

        // Return the current node
        return node;
    }
```

Python

```python
"""
Definition for a binary tree node.
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
"""

// Diagram: from typing import Optional, List

class ReverseBstIterator:
    def __init__(self, root: Optional[TreeNode]):

        # Create a stack to store tree nodes
        self.stack: List[TreeNode] = []
        self.push_all_right(root)

    # Helper function to push all right child nodes of the current node
    # onto the stack
    def push_all_right(self, node: Optional[TreeNode]) -> None:
        while node:

            # Push the node onto the stack
            self.stack.append(node)

            # Move to the right child
            node = node.right

    def has_next(self) -> bool:

        # If the stack is not empty, there are more elements
        return bool(self.stack)

    def next(self) -> Optional[TreeNode]:

        # If there are no more nodes to visit in the BST, return null
        # to indicate that next() has no valid node to return.
        if not self.has_next():
            return None

        # Get the top node from the stack
        node = self.stack.pop()

        # Push all left child nodes of the left subtree onto the stack
        self.push_all_right(node.left)

        # Return the current node
        return node
```

## Complexity Analysis

The reverse iterator traverses the entire binary search tree one node at a time and on demand. The `next()` function may take anywhere between constant **O(1)** to **O(h)** time where **h** is the height of the tree, depending on how many nodes need to be pushed into the stack before returning the top of the stack. However, since `next()` can only be called up to **N** times, where **N** is the number of nodes and every node is only visited twice, once when inserting it into the stack and next when popping it from the top of the stack, calling `next()` **N** times results in **O(2\*N) ~ O(N)** time. And so, the amortized time complexity of `next()` is constant **O(1)**.

We only keep all the nodes in the path from the root node to the node coming up next in the traversal in the stack. And so, the maximum size of the stack is the size of the longest root-to-node path in the tree, which is its height. In the best case, the tree is height balanced and so the space complexity is **O(log(N))** and in the worst case the tree may be a degenerate tree leading to a linear **O(N)** space complexity.

> **Best Case** - The binary search tree is height-balanced
>
> -   Space Complexity - **O(logN)**
> -   Time Complexity of \`next()\` - **Amortized O(1)**
>
> **Worst Case** - The binary search tree is degenerate
>
> -   Space Complexity - **O(N)**
> -   Time Complexity of \`next()\` - **Amortized O(1)**

***

# Design a reverse BST iterator

## Problem Statement

Given the skeleton of a **ReverseBstIterator class** that helps iterate through the nodes of a binary search tree in a specific order (reverse in-order traversal), complete this class by implementing all the operations below.

> -   **ReverseBstIterator(TreeNode root)** - Initializes a new instance of the ReverseBstIterator class using the provided root of the BST as an argument to the constructor.
> -   **hasNext()** - This method verifies whether a node exists to the left of the iterator's current position during traversal, returning true if one is found and false otherwise.
> -   **next()** - This method shifts the iterator's pointer to the left and returns the node at the new pointer location.

### Example

> The input should adhere to the following rules:
>
> 1.  The input should contain two arrays of the same size.
> 2.  The first array should contain the list of operations, while the second should contain the corresponding operands for those operations.
> 3.  The first index in the first array should contain **ReverseBstIterator**, and the first index in the second array should contain the root of a binary tree, which this iterator will traverse. This is used to initialise the ReverseBstIterator.
> 4.  For each index in the first array that contains **hasNext**, or operations, the corresponding index in the second array should contain an empty array.
>
> **Example:**
>
> -   **Input:** \[ReverseBstIterator, next, next, hasNext, next, hasNext, next, hasNext, next, hasNext\] \[\[7, 3, 15, null, null, 9, 20\], \[\], \[\], \[\], \[\], \[\], \[\], \[\], \[\], \[\]\]
>
> -   **Output:** \[null, 20, 15, true, 9, true, 7, true, 3, false\]
>
> **Explanation:**
>
> **Operation:** ReverseBstIterator reverseBstIterator = new ReverseBstIterator(\[7, 3, 15, null, null, 9, 20\]) **Result:** Initializes a \`ReverseBstIterator\` for the given BST
>
> **Operation:** reverseBstIterator.next() **Result:** Returns \`20\`
>
> **Operation:** reverseBstIterator.next() **Result:** Returns \`15\`
>
> **Operation:** reverseBstIterator.hasNext() **Result:** Returns \`true\`
>
> **Operation:** reverseBstIterator.next() **Result:** Returns \`9\`
>
> **Operation:** reverseBstIterator.hasNext() **Result:** Returns \`true\`
>
> **Operation:** reverseBstIterator.next() **Result:** Returns \`7\`
>
> **Operation:** reverseBstIterator.hasNext() **Result:** Returns \`true\`
>
> **Operation:** reverseBstIterator.next() **Result:** Returns \`3\`
>
> **Operation:** reverseBstIterator.hasNext() **Result:** Returns \`false\`

## Solution

```cpp
#include <stack>

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

class ReverseBstIterator {
public:

    // Create a stack to store tree nodes
    stack<TreeNode *> stack;

    ReverseBstIterator(TreeNode *root) {

        // Push all right child nodes of the root onto the stack
        pushAllRight(root);
    }

    // Helper function to push all right child nodes of the current node
    // onto the stack
    void pushAllRight(TreeNode *node) {
        while (node != nullptr) {

            // Push the node onto the stack
            stack.push(node);

            // Move to the right child
            node = node->right;
        }
    }

    bool hasNext() {

        // If the stack is not empty, there are more elements
        return !stack.empty();
    }

    TreeNode *next() {

        // If there are no more nodes to visit in the BST, return null
        // to indicate that next() has no valid node to return.
        if (!hasNext()) {
            return nullptr;
        }

        // Get the top node from the stack
        TreeNode *node = stack.top();

        // Remove the top node from the stack
        stack.pop();

        // Push all left child nodes of the left subtree onto the stack
        pushAllRight(node->left);

        // Return the current node
        return node;
    }
};
```
