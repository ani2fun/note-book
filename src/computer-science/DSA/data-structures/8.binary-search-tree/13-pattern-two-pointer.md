# Pattern: Two pointer

## Table of Contents

1. [Understanding the two pointer pattern](#understanding-the-two-pointer-pattern)
2. [Identifying the two pointer pattern](#identifying-the-two-pointer-pattern)
3. [Two sum on BST](#two-sum-on-bst)
4. [Multiple tree](#multiple-tree)
5. [Median in BST](#median-in-bst)
6. [BST pair sum](#bst-pair-sum)

***

# Understanding the two pointer pattern

The inorder and reverse inorder traversal on a binary search tree results in traversal in the sorted and reverse sorted order. And so, a binary search tree can be used to store values in sorted or reverse-sorted order, which would otherwise have to be stored in an array. Unlike arrays, a binary search tree can be dynamically updated to add more values and searching for the node with a given value is also very efficient. This makes a binary search tree the ideal choice for storing values that need to be accessed in sorted order. 

However, some problems require us to traverse the stored values in both sorted and reverse-sorted order simultaneously. For certain problems, we can use the two-pointer traversal technique to traverse the nodes of a binary search tree simultaneously in sorted and reverse-sorted order. It allows us to solve problems in linear time and single-pass, which would otherwise require inefficient nested loops or complicated recursive functions.

The two-pointer pattern is a classification of problems that can be solved using the two-pointer traversal technique.

// Diagram: Two pointer traversal is used to traverse a binary search tree in sorted and reverse-sorted order simultaneously.

In this course, we will learn more about the two-pointer technique on a binary search tree and how to identify a problem as a two-pointer pattern problem.

## Two pointer technique

Consider that we are given a binary search tree and a function `f`, and we need to traverse the tree simultaneously in the sorted and reverse-sorted order until we meet in the middle or some other terminating condition is reached. In each iteration, the output of the function `f` on two nodes from both directions determines if we should move ahead in the forward or reverse direction.

// Diagram: Traverse simultaneously in the sorted and reverse sorted order and process nodes.

The two-pointer technique on a binary search tree uses the forward and reverse iterators we learned earlier to abstract away the algorithm to traverse the binary search tree on demand. We create a forward iterator `left` and a reverse iterator `right` to traverse the tree on demand in the sorted(ascending) and reverse sorted (descending) order of values. We store the nodes pointed to by these iterators in two reference variables `leftNode` and `rightNode` and iterate using these iterators until some terminating condition is reached. In each iteration, we process `leftNode` and `rightNode` and use the function `f` to determine if we should move ahead with the forward or reverse iterator.

Consider the example below, where we terminate when the value of the node in `leftNode` exceeds the value of the node in `rightNode`. We move both the left and right pointers alternatively in this case.

// Diagram: Traverse the tree simultaneously in sorted and reverse sorted order

## Algorithm

The algorithm given below outlines the generic two-pointer traversal technique on a binary search tree using a forward and reverse iterator. It terminates when both the pointers meet in the middle.

> -   **Step 1:** Initialize \`left\` with a forward iterator and \`leftNode\` with \`left.next()\`
> -   **Step 2:** Initialize \`right\` with a reverse iterator and \`rightNode\` with \`right.next()\`
> -   **Step 3:** Loop while \`leftNode.val\` < \`rightNode.val\` and do the following
>     -   **Step 3.1:** Process \`leftNode\` and \`rightNode\`
>     -   **Step 3.2:** If \`f(leftNode)\` set \`leftNode\` = \`left.next()\`
>     -   **Step 3.3:** If \`f(rightNode)\` set \`rightNode\` = \`right.next()\`

## Implementation

To implement the two-pointer traversal, we need to implement the forward and reverse iterators we learned earlier. Given below is the generic code implementation of the two-pointer technique on a binary search tree using forward and reverse iterators. It terminates when both the pointers meet in the middle.

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
    stack<TreeNode *> stack;

    ForwardBstIterator(TreeNode *root) {
        pushAllLeft(root);
    }

    void pushAllLeft(TreeNode *node) {
        while (node != nullptr) {
            stack.push(node);
            node = node->left;
        }

    bool hasNext() {
        return !stack.empty();
    }

    TreeNode *next() {
        if (!hasNext()) {
            return nullptr;
        }

        TreeNode *node = stack.top();
        stack.pop();
        pushAllLeft(node->right);
        return node;
    }
};

class ReverseBstIterator {
public:
    stack<TreeNode *> stack;

    ReverseBstIterator(TreeNode *root) {
        pushAllRight(root);
    }

    void pushAllRight(TreeNode *node) {
        while (node != nullptr) {
            stack.push(node);
            node = node->right;
        }

    bool hasNext() {
        return !stack.empty();
    }

    TreeNode *next() {
        if (!hasNext()) {
            return nullptr;
        }

        TreeNode *node = stack.top();
        stack.pop();
        pushAllRight(node->left);
        return node;
    }
};

class Solution {
public:
    void twoPointer(TreeNode *root, int target) {
        if (!root) {
            return;
        }

        // Initialize the left and right iterators
        ForwardBstIterator *leftIterator = new ForwardBstIterator(root);
        ReverseBstIterator *rightIterator = new ReverseBstIterator(root);

        TreeNode *leftNode = leftIterator->next();
        TreeNode *rightNode = rightIterator->next();

// Diagram: while (leftNode != rightNode) {

            // Check if both pointer meet in the middle
            // or cross each other. This is the terminating condition
            if (!leftNode || !rightNode || (leftNode.val >= rightNode.val)) {
                return;
            }

            // Process the nodes in leftNode and rightNode
            // Processing logic goes here
            // ........

            // Check if we need to move the left pointer
            if (f(leftNode)) {
                leftNode = leftIterator->next();
            }

            // Check if we need to move the right pointer
            if (f(rightNode)) {
                rightNode = rightIterator->next();
            }

        return;
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

// Diagram: Stack<TreeNode> stack;

    public ForwardBstIterator(TreeNode root) {
        stack = new Stack<>();
        pushAllLeft(root);
    }

    public void pushAllLeft(TreeNode node) {
        while (node != null) {
            stack.push(node);
            node = node.left;
        }

    public boolean hasNext() {
        return !stack.empty();
    }

    public TreeNode next() {
        if (!hasNext()) {
            return null;
        }

        TreeNode node = stack.pop();
        pushAllLeft(node.right);
        return node;
    }

// Diagram: class ReverseBstIterator {

// Diagram: Stack<TreeNode> stack;

    public ReverseBstIterator(TreeNode root) {
        stack = new Stack<>();
        pushAllRight(root);
    }

    public void pushAllRight(TreeNode node) {
        while (node != null) {
            stack.push(node);
            node = node.right;
        }

    public boolean hasNext() {
        return !stack.empty();
    }

    public TreeNode next() {
        if (!hasNext()) {
            return null;
        }

        TreeNode node = stack.pop();
        pushAllRight(node.left);
        return node;
    }

// Diagram: class Solution {

    public void twoPointer(TreeNode root, int target) {
        if (root == null) {
            return;
        }

        // Initialize the left and right iterators
        ForwardBstIterator leftIterator = new ForwardBstIterator(root);
        ReverseBstIterator rightIterator = new ReverseBstIterator(root);

        TreeNode leftNode = leftIterator.next();
        TreeNode rightNode = rightIterator.next();

// Diagram: while (leftNode != rightNode) {

            // Check if both pointers meet in the middle
            // or cross each other. This is the terminating condition
            if (!leftNode || !rightNode || (leftNode.val >= rightNode.val)) {
                return;
            }

            // Process the nodes in leftNode and rightNode
            // Processing logic goes here
            // ........

            // Check if we need to move the left pointer
            if (f(leftNode)) {
                leftNode = leftIterator.next();
            }

            // Check if we need to move the right pointer
            if (f(rightNode)) {
                rightNode = rightIterator.next();
            }

        return;
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

class ForwardBstIterator {
    stack: (TreeNode | null)[];

    constructor(root: TreeNode | null) {
        this.stack = [];
        this.pushAllLeft(root);
    }

    pushAllLeft(node: TreeNode | null): void {
        while (node !== null) {
            this.stack.push(node);
            node = node.left;
        }

    hasNext(): boolean {
        return this.stack.length > 0;
    }

    next(): TreeNode | null {
        if (!this.hasNext()) {
            return null;
        }

        const node = this.stack.pop()!;
        this.pushAllLeft(node.right);
        return node;
    }

class ReverseBstIterator {
    stack: (TreeNode | null)[];

    constructor(root: TreeNode | null) {
        this.stack = [];
        this.pushAllRight(root);
    }

    pushAllRight(node: TreeNode | null): void {
        while (node !== null) {
            this.stack.push(node);
            node = node.right;
        }

    hasNext(): boolean {
        return this.stack.length > 0;
    }

    next(): TreeNode | null {
        if (!this.hasNext()) {
            return null;
        }

        const node = this.stack.pop()!;
        this.pushAllRight(node.left);
        return node;
    }

export class Solution {
    twoPointer(root: TreeNode | null, target: number): void {
        if (!root) {
            return;
        }

        // Initialize the left and right iterators
        const leftIterator = new ForwardBstIterator(root);
        const rightIterator = new ReverseBstIterator(root);

        let leftNode = leftIterator.next();
        let rightNode = rightIterator.next();

// Diagram: while (leftNode !== rightNode) {

            // Check if both pointer meet in the middle
            // or cross each other. This is the terminating condition
            if (!leftNode || !rightNode || leftNode.val >= rightNode.val) {
                return;
            }

            // Process the nodes in leftNode and rightNode
            // Processing logic goes here
            // ........

            // Check if we need to move the left pointer
            if (f(leftNode)) {
                leftNode = leftIterator.next();
            }

            // Check if we need to move the right pointer
            if (f(rightNode)) {
                rightNode = rightIterator.next();
            }

        return;
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

class ForwardBstIterator {
    stack;

    constructor(root) {
        this.stack = [];
        this.pushAllLeft(root);
    }

    pushAllLeft(node) {
        while (node !== null) {
            this.stack.push(node);
            node = node.left;
        }

    hasNext() {
        return this.stack.length > 0;
    }

    next() {
        if (!this.hasNext()) {
            return null;
        }

        const node = this.stack.pop();
        this.pushAllLeft(node.right);
        return node;
    }

class ReverseBstIterator {
    stack;

    constructor(root) {
        this.stack = [];
        this.pushAllRight(root);
    }

    pushAllRight(node) {
        while (node !== null) {
            this.stack.push(node);
            node = node.right;
        }

    hasNext() {
        return this.stack.length > 0;
    }

    next() {
        if (!this.hasNext()) {
            return null;
        }

        const node = this.stack.pop();
        this.pushAllRight(node.left);
        return node;
    }

export class Solution {
    twoPointer(root, target) {
        if (!root) {
            return;
        }

        // Initialize the left and right iterators
        const leftIterator = new ForwardBstIterator(root);
        const rightIterator = new ReverseBstIterator(root);

        let leftNode = leftIterator.next();
        let rightNode = rightIterator.next();

// Diagram: while (leftNode !== rightNode) {

            // Check if both pointer meet in the middle
            // or cross each other. This is the terminating condition
            if (!leftNode || !rightNode || leftNode.val >= rightNode.val) {
                return;
            }

            // Process the nodes in leftNode and rightNode
            // Processing logic goes here
            // ........

            // Check if we need to move the left pointer
            if (f(leftNode)) {
                leftNode = leftIterator.next();
            }

            // Check if we need to move the right pointer
            if (f(rightNode)) {
                rightNode = rightIterator.next();
            }

        return;
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

// Diagram: from typing import Optional, List, Any

class ForwardBstIterator:
    def __init__(self, root: Optional[TreeNode]):
        self.stack: List[TreeNode] = []
        self.push_all_left(root)

    def push_all_left(self, node: Optional[TreeNode]) -> None:
        while node:
            self.stack.append(node)
            node = node.left

    def has_next(self) -> bool:
        return bool(self.stack)

    def next(self) -> Optional[TreeNode]:
        if not self.has_next():
            return None

        node = self.stack.pop()
        self.push_all_left(node.right)
        return node

class ReverseBstIterator:
    def __init__(self, root: Optional[TreeNode]):
        self.stack: List[TreeNode] = []
        self.push_all_right(root)

    def push_all_right(self, node: Optional[TreeNode]) -> None:
        while node:
            self.stack.append(node)
            node = node.right

    def has_next(self) -> bool:
        return bool(self.stack)

    def next(self) -> Optional[TreeNode]:
        if not self.has_next():
            return None

        node = self.stack.pop()
        self.push_all_right(node.left)
        return node

class Solution:
    def twoPointer(self, root: Optional[TreeNode], target: int) -> None:
        if not root:
            return

        # Initialize the left and right iterators
        left_iterator = ForwardBstIterator(root)
        right_iterator = ReverseBstIterator(root)

        left_node = left_iterator.next()
        right_node = right_iterator.next()

        while left_node != right_node:

            # Check if both pointers meet in the middle
            # or cross each other. This is the terminating condition
            if not left_node or node right_node or left_node.val >= right_node.val:
                return

            # Process the nodes in left_node and right_node
            # Processing logic goes here
            # ........

            # Check if we need to move the left pointer
            if f(left_node):
                left_node = left_iterator.next()

            # Check if we need to move the right pointer
            if f(right_node):
                right_node = right_iterator.next()

        return
```

## Complexity Analysis

It is quite easy to figure out the time and space complexity of the two-pointer technique. We traverse the entire tree using the forward and reverse iterators that do an inorder and reverse inorder traversal, respectively. We terminate when these two pointers meet in the middle, so each node is traversed exactly once, either by the forward or reverse iterator. And so the time complexity is linear **O(N)** in any case.

The space complexity of inorder traversal and reverse inorder traversal using iterators depends on the maximum size of the stack in those iterators, which can be linear **O(N)** if the tree is a degenerate binary tree and **O(log(N))** if it is a height-balanced binary search tree.

> **Best Case:** Height balanced binary search tree
>
> -   Space Complexity - **O(log(N))**
> -   Time Complexity - **O(N)**
>
> **Worst Case:** Degenerate binary search tree
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Identifying the two pointer pattern

The two-pointer technique can solve some specific types of binary search tree problems. These are generally easy or medium problems in which we need to traverse the nodes in a binary search tree in the sorted and reverse-sorted order simultaneously until some terminating condition is reached. We may also have a function `f` that determines whether we should move ahead in the forward and/or reverse direction. If the problem statement or its solution follows the generic template below, it can be solved by applying the sorted traversal technique.

**Template:**

Given a binary search tree, traverse the nodes simultaneously in the sorted and reverse sorted order until some terminating condition is reached. Process the nodes in each iteration, and based on the output of some function `f`, move ahead in the forward and/or reverse direction. 

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the two-pointer technique.

> **Problem statement:** Given a binary search tree and a \`target\`, find if there is a pair of nodes with a sum equal to \`target\`.

// Diagram: Find the pair of nodes with the given sum in the binary search tree.

## Traverse and search

We can solve the problem by doing a recursive inorder traversal of the binary search tree to traverse the nodes in the sorted order. For each node, we subtract the value of the node from `target` to compute the value of the other pair. We then search the binary search tree for a node with that value, and if such a node exists, we return true as we have found the pair. If the traversal completes without finding such a pair, we return false.

// Diagram: Find the pair with the sum 13

The implementation of the traverse and search technique is given below.

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
    stack<TreeNode *> stack;

    ForwardBstIterator(TreeNode *root) {
        pushAllLeft(root);
    }

    void pushAllLeft(TreeNode *node) {
        while (node != nullptr) {
            stack.push(node);
            node = node->left;
        }

    bool hasNext() {
        return !stack.empty();
    }

    TreeNode *next() {
        if (!hasNext()) {
            return nullptr;
        }

        TreeNode *node = stack.top();
        stack.pop();
        pushAllLeft(node->right);
        return node;
    }
};

class ReverseBstIterator {
public:
    stack<TreeNode *> stack;

    ReverseBstIterator(TreeNode *root) {
        pushAllRight(root);
    }

    void pushAllRight(TreeNode *node) {
        while (node != nullptr) {
            stack.push(node);
            node = node->right;
        }

    bool hasNext() {
        return !stack.empty();
    }

    TreeNode *next() {
        if (!hasNext()) {
            return nullptr;
        }

        TreeNode *node = stack.top();
        stack.pop();
        pushAllRight(node->left);
        return node;
    }
};

class Solution {
public:
    bool twoSumOnBST(TreeNode *root, int target) {
        if (!root) {
            return false;
        }

        // Initialize the left and right iterators
        ForwardBstIterator *leftIterator = new ForwardBstIterator(root);
        ReverseBstIterator *rightIterator = new ReverseBstIterator(root);

        TreeNode *leftNode = leftIterator->next();
        TreeNode *rightNode = rightIterator->next();

// Diagram: while (leftNode != rightNode) {

            // Check if the sum of the two nodes equals k
            if (leftNode->val + rightNode->val == target) {
                return true;
            }

            // If the sum is less than target, move the left pointer
            // to the right
            else if (leftNode->val + rightNode->val < target) {
                leftNode = leftIterator->next();
            }

            // If the sum is greater than target, move the right pointer
            // to the left
            else {
                rightNode = rightIterator->next();
            }

        // No pair found
        return false;
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

// Diagram: class Solution {

// Diagram: TreeNode search(TreeNode node, int target) {

        // Return this node if it is null or has the target value
        if (node == null || node.val == target) {
            return node;
        }

        // Search the left subtree if the node is greater than the target
        if (node.val > target) {
            return search(node.left, target);
        }
        // Search the right subtree if the node is less than the target
        else {
            return search(node.right, target);
        }

// Diagram: boolean inorder(TreeNode node, TreeNode root, int target) {

        // Return false if this is a null reference
        if (node == null) {
            return false;
        }

        // Check if any node of the pair is found in the left subtree
        boolean left = inorder(node.left, root, target);

        // Return true if one node of the pair is found in the left subtree
        if (left) {
            return true;
        }

        // Check if the current node can be paired with some other node of BST
        TreeNode otherNode = search(root, target - node.val);

        // If we found the other node and it is different from the current node, return true
        if (otherNode != null && otherNode != node) {
            return true;
        }

        // Check if any node of the pair is found in the right subtree
        boolean right = inorder(node.right, root, target);

        // Return true if one node of the pair is found in the right subtree
        if (right) {
            return true;
        }

        // Return false if no pair can be made with a node in the subtree of current node
        return false;
    }

    public boolean twoSumOnBST(TreeNode root, int target) {
        if (root == null) {
            return false;
        }

        // Check if the tree has at least two nodes
        if (root.left == null && root.right == null) {
            return false;
        }

        // Use inorder traversal to find the pair
        return inorder(root, root, target);
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

export class Solution {
  search(node: TreeNode | null, target: number): TreeNode | null {

    // Return this node if it is null of has the target value
    if (!node || node.val === target) {
      return node;
    }

    // Search the left subtree if the node is greater than the target
    if (node.val > target) {
      return this.search(node.left, target);
    }
    // Search the right subtree if the node is less than the target
    else {
      return this.search(node.right, target);
    }

// Diagram: inorder(node: TreeNode | null, root: TreeNode, target: number): boolean {

    // Return false if this is a null reference
    if (!node) {
      return false;
    }

    // Check if the any node of the pair is found in the left subtree
    const left = this.inorder(node.left, root, target);

    // Return true if one node of the pair is found in the left subtree
    if (left) {
      return true;
    }

    // Check if the current node can be paired with some other node of BST
    const otherNode = this.search(root, target - node.val);

    // If we found the other node and it is different from the current node, return true
    if (otherNode && otherNode !== node) {
      return true;
    }

    // Check if the any node of the pair is found in the left subtree
    const right = this.inorder(node.right, root, target);

    // Return true if one node of the pair is found in the left subtree
    if (right) {
      return true;
    }
    // Return false if no pair can be made with a ndoe in the subtree of current node
    return false;
  }

  twoSumOnBST(root: TreeNode | null, target: number): boolean {
    if (!root) {
      return false;
    }

    // Check if the tree has at least two nodes
    if (!root.left && !root.right) {
      return false;
    }

    // Use inorder traversal to find the pair
    return this.inorder(root, root, target);
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

export class Solution {
  search(node, target) {

    // Return this node if it is null or has the target value
    if (!node || node.val === target) {
      return node;
    }

    // Search the left subtree if the node is greater than the target
    if (node.val > target) {
      return this.search(node.left, target);
    }
    // Search the right subtree if the node is less than the target
    else {
      return this.search(node.right, target);
    }

// Diagram: inorder(node, root, target) {

    // Return false if this is a null reference
    if (!node) {
      return false;
    }

    // Check if the any node of the pair is found in the left subtree
    const left = this.inorder(node.left, root, target);

    // Return true if one node of the pair is found in the left subtree
    if (left) {
      return true;
    }

    // Check if the current node can be paired with some other node of BST
    const otherNode = this.search(root, target - node.val);

    // If we found the other node and it is different from the current node, return true
    if (otherNode && otherNode !== node) {
      return true;
    }

    // Check if the any node of the pair is found in the left subtree
    const right = this.inorder(node.right, root, target);

    // Return true if one node of the pair is found in the left subtree
    if (right) {
      return true;
    }

    // Return false if no pair can be made with a node in the subtree of current node
    return false;
  }

  twoSumOnBST(root, target) {
    if (!root) {
      return false;
    }

    // Check if the tree has at least two nodes
    if (!root.left && !root.right) {
      return false;
    }

    // Use inorder traversal to find the pair
    return this.inorder(root, root, target);
  }
```

Python

```python
#include <stack>
```

While the implementation of this solution is simple, it solves the problem in **O(Nlog(N))** time, as for every node in the tree, we need to search for its corresponding pair to make the target sum.

## The two pointer technique

The two-sum problem, where the values are stored in an array, can be solved by sorting the array values and traversing from both directions, moving the pointers depending on the sum of the two values. The two-pointer pattern in the array course explains a detailed proof of correctness for this solution, so we will not go into details of the proof in this lesson.

We can similarly traverse the binary search tree in the sorted and reverse-sorted direction using the two-pointer technique. And so, the solution fits the generic template for the two-pointer pattern we learned earlier.

**Template:**

Given a binary search tree, traverse the nodes simultaneously in the sorted and reverse sorted order until they meet in the middle. Process the nodes (add them) in each iteration, and based on the output of some function `f` (sum < target) move ahead in the forward and/or reverse direction. 

We create a forward iterator `left` and a reverse iterator `right` to traverse the tree on demand in the sorted(ascending) and reverse sorted (descending) order of values. We store the nodes pointed to by these iterators in two reference variables `leftNode` and `rightNode` and iterate using these iterators until the value of `leftNode` exceeds the value of `rightNode`. In each iteration, we add the values of `leftNode` and `rightNode` in a variable `sum` and compare it with `target`. If `sum` is equal to the `target`, it means the pair `leftNode` and `rightNode` is what we were looking for, and so we return true.

If the sum is less than the `target`, we call `next()` on `left` to move ahead in the sorted direction. Otherwise, we call `next()` on `right` to move ahead in the reverse-sorted direction. If we reach the terminating condition, it means no pair exists with a sum equal to `target`, and so we return false.

// Diagram: Find the pair with the sum 13

The implementation of the two-pointer solution is given below.

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
    stack<TreeNode *> stack;

    ForwardBstIterator(TreeNode *root) {
        pushAllLeft(root);
    }

    void pushAllLeft(TreeNode *node) {
        while (node != nullptr) {
            stack.push(node);
            node = node->left;
        }

    bool hasNext() {
        return !stack.empty();
    }

    TreeNode *next() {
        if (!hasNext()) {
            return nullptr;
        }

        TreeNode *node = stack.top();
        stack.pop();
        pushAllLeft(node->right);
        return node;
    }
};

class ReverseBstIterator {
public:
    stack<TreeNode *> stack;

    ReverseBstIterator(TreeNode *root) {
        pushAllRight(root);
    }

    void pushAllRight(TreeNode *node) {
        while (node != nullptr) {
            stack.push(node);
            node = node->right;
        }

    bool hasNext() {
        return !stack.empty();
    }

    TreeNode *next() {
        if (!hasNext()) {
            return nullptr;
        }

        TreeNode *node = stack.top();
        stack.pop();
        pushAllRight(node->left);
        return node;
    }
};

class Solution {
public:
    bool twoSumOnBST(TreeNode *root, int target) {
        if (!root) {
            return false;
        }

        // Initialize the left and right iterators
        ForwardBstIterator *leftIterator = new ForwardBstIterator(root);
        ReverseBstIterator *rightIterator = new ReverseBstIterator(root);

        TreeNode *leftNode = leftIterator->next();
        TreeNode *rightNode = rightIterator->next();

// Diagram: while (leftNode != rightNode) {

            // Check if the sum of the two nodes equals k
            if (leftNode->val + rightNode->val == target) {
                return true;
            }

            // If the sum is less than target, move the left pointer
            // to the right
            else if (leftNode->val + rightNode->val < target) {
                leftNode = leftIterator->next();
            }

            // If the sum is greater than target, move the right pointer
            // to the left
            else {
                rightNode = rightIterator->next();
            }

        // No pair found
        return false;
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

// Diagram: class Solution {

// Diagram: TreeNode search(TreeNode node, int target) {

        // Return this node if it is null or has the target value
        if (node == null || node.val == target) {
            return node;
        }

        // Search the left subtree if the node is greater than the target
        if (node.val > target) {
            return search(node.left, target);
        }
        // Search the right subtree if the node is less than the target
        else {
            return search(node.right, target);
        }

// Diagram: boolean inorder(TreeNode node, TreeNode root, int target) {

        // Return false if this is a null reference
        if (node == null) {
            return false;
        }

        // Check if any node of the pair is found in the left subtree
        boolean left = inorder(node.left, root, target);

        // Return true if one node of the pair is found in the left subtree
        if (left) {
            return true;
        }

        // Check if the current node can be paired with some other node of BST
        TreeNode otherNode = search(root, target - node.val);

        // If we found the other node and it is different from the current node, return true
        if (otherNode != null && otherNode != node) {
            return true;
        }

        // Check if any node of the pair is found in the right subtree
        boolean right = inorder(node.right, root, target);

        // Return true if one node of the pair is found in the right subtree
        if (right) {
            return true;
        }

        // Return false if no pair can be made with a node in the subtree of current node
        return false;
    }

    public boolean twoSumOnBST(TreeNode root, int target) {
        if (root == null) {
            return false;
        }

        // Check if the tree has at least two nodes
        if (root.left == null && root.right == null) {
            return false;
        }

        // Use inorder traversal to find the pair
        return inorder(root, root, target);
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

class ForwardBstIterator {
    stack: (TreeNode | null)[];

    constructor(root: TreeNode | null) {
        this.stack = [];
        this.pushAllLeft(root);
    }

    pushAllLeft(node: TreeNode | null): void {
        while (node !== null) {
            this.stack.push(node);
            node = node.left;
        }

    hasNext(): boolean {
        return this.stack.length > 0;
    }

    next(): TreeNode | null {
        if (!this.hasNext()) {
            return null;
        }

        const node = this.stack.pop()!;
        this.pushAllLeft(node.right);
        return node;
    }

class ReverseBstIterator {
    stack: (TreeNode | null)[];

    constructor(root: TreeNode | null) {
        this.stack = [];
        this.pushAllRight(root);
    }

    pushAllRight(node: TreeNode | null): void {
        while (node !== null) {
            this.stack.push(node);
            node = node.right;
        }

    hasNext(): boolean {
        return this.stack.length > 0;
    }

    next(): TreeNode | null {
        if (!this.hasNext()) {
            return null;
        }

        const node = this.stack.pop()!;
        this.pushAllRight(node.left);
        return node;
    }

export class Solution {
    twoSumOnBST(root: TreeNode | null, target: number): boolean {
        if (!root) {
            return false;
        }

        // Initialize the left and right iterators
        const leftIterator: ForwardBstIterator = new ForwardBstIterator(
            root
        );
        const rightIterator: ReverseBstIterator = new ReverseBstIterator(
            root
        );

        let leftNode = leftIterator.next();
        let rightNode = rightIterator.next();

// Diagram: while (leftNode !== rightNode) {

            // Check if the sum of the two nodes equals the target
            if (leftNode.val + rightNode.val === target) {
                return true;
            }

            // If the sum is less than target, move the left pointer
            // to the right
            else if (leftNode.val + rightNode.val < target) {
                leftNode = leftIterator.next();
            }

            // If the sum is greater than target, move the right pointer
            // to the left
            else {
                rightNode = rightIterator.next();
            }

        // No pair found
        return false;
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

class ForwardBstIterator {
    stack;

    constructor(root) {
        this.stack = [];
        this.pushAllLeft(root);
    }

    pushAllLeft(node) {
        while (node !== null) {
            this.stack.push(node);
            node = node.left;
        }

    hasNext() {
        return this.stack.length > 0;
    }

    next() {
        if (!this.hasNext()) {
            return null;
        }

        const node = this.stack.pop();
        this.pushAllLeft(node.right);
        return node;
    }

class ReverseBstIterator {
    stack;

    constructor(root) {
        this.stack = [];
        this.pushAllRight(root);
    }

    pushAllRight(node) {
        while (node !== null) {
            this.stack.push(node);
            node = node.right;
        }

    hasNext() {
        return this.stack.length > 0;
    }

    next() {
        if (!this.hasNext()) {
            return null;
        }

        const node = this.stack.pop();
        this.pushAllRight(node.left);
        return node;
    }

export class Solution {
    twoSumOnBST(root, target) {
        if (!root) {
            return false;
        }

        // Initialize the left and right iterators
        const leftIterator = new ForwardBstIterator(root);
        const rightIterator = new ReverseBstIterator(root);

        let leftNode = leftIterator.next();
        let rightNode = rightIterator.next();

// Diagram: while (leftNode !== rightNode) {

            // Check if the sum of the two nodes equals the target
            if (leftNode.val + rightNode.val === target) {
                return true;
            }

            // If the sum is less than target, move the left pointer
            // to the right
            else if (leftNode.val + rightNode.val < target) {
                leftNode = leftIterator.next();
            }

            // If the sum is greater than target, move the right pointer
            // to the left
            else {
                rightNode = rightIterator.next();
            }

        // No pair found
        return false;
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

// Diagram: from typing import Optional, List, Any

class ForwardBstIterator:
    def __init__(self, root: Optional[TreeNode]):
        self.stack: List[TreeNode] = []
        self.push_all_left(root)

    def push_all_left(self, node: Optional[TreeNode]) -> None:
        while node:
            self.stack.append(node)
            node = node.left

    def has_next(self) -> bool:
        return bool(self.stack)

    def next(self) -> Optional[TreeNode]:
        if not self.has_next():
            return None

        node = self.stack.pop()
        self.push_all_left(node.right)
        return node

class ReverseBstIterator:
    def __init__(self, root: Optional[TreeNode]):
        self.stack: List[TreeNode] = []
        self.push_all_right(root)

    def push_all_right(self, node: Optional[TreeNode]) -> None:
        while node:
            self.stack.append(node)
            node = node.right

    def has_next(self) -> bool:
        return bool(self.stack)

    def next(self) -> Optional[TreeNode]:
        if not self.has_next():
            return None

        node = self.stack.pop()
        self.push_all_right(node.left)
        return node

class Solution:
    def two_sum_on_bst(
        self, root: Optional[TreeNode], target: int
    ) -> bool:
        if not root:
            return False

        # Initialize the left and right iterators
        left_iterator: ForwardBstIterator = ForwardBstIterator(root)
        right_iterator: ReverseBstIterator = ReverseBstIterator(root)

        left_node: Optional[TreeNode] = left_iterator.next()
        right_node: Optional[TreeNode] = right_iterator.next()

        while left_node != right_node:

            # Check if the sum of the two nodes equals the target
            if left_node.val + right_node.val == target:
                return True

            # If the sum is less than target, move the left pointer
            # to the right
            elif left_node.val + right_node.val < target:
                left_node = left_iterator.next()

            # If the sum is greater than target, move the right pointer
            # to the left
            else:
                right_node = right_iterator.next()

        # No pair found
        return False
```

While the two-pointer has a more complicated implementation than the traverse and search technique, it solves the problem in linear **O(N)** time and a single pass.

## Example problems

Most problems in this category are **easy** or **medium** problems; a list of a few is given below.

> -   **[Two sum on BST](https://www.codeintuition.io/courses/binary-search-tree/CFD9R3mNQNz9fs_qMkTPB)**
> -   **[Multiple tree](https://www.codeintuition.io/courses/binary-search-tree/3hsOnZI2ETpJw0qyUtdLc)**
> -   **[Median in BST](https://www.codeintuition.io/courses/binary-search-tree/TM2keAMOC8UnzAB8IxYU4)**
> -   **[BST pair sum](https://www.codeintuition.io/courses/binary-search-tree/3duWe0guUFCtJOMIDTxVg)**

We will now solve these problems to understand the two-pointer technique better.

***

# Two sum on BST

## Problem Statement

Given the **root** of a binary search tree and an integer value **target**, write a function that returns `true` if a pair of nodes in this tree exists that sum up to the target. Return `false` if no such pair exists.

### Example 1

> -   **Input:** root = \[4, 2, 6, 1, null, null, 7\], target = 9
> -   **Output:** true
> -   **Explanation:** The nodes with values 2 and 7 sum up to 9.

### Example 2

> -   **Input:** root = \[2, 1, 4, null, null, 3, 7\], target = 16
> -   **Output:** false
> -   **Explanation:** There is no pair of nodes in the tree whose values sum up to 16.

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
    stack<TreeNode *> stack;

    ForwardBstIterator(TreeNode *root) {
        pushAllLeft(root);
    }

    void pushAllLeft(TreeNode *node) {
        while (node != nullptr) {
            stack.push(node);
            node = node->left;
        }
    }

    bool hasNext() {
        return !stack.empty();
    }

    TreeNode *next() {
        if (!hasNext()) {
            return nullptr;
        }

        TreeNode *node = stack.top();
        stack.pop();
        pushAllLeft(node->right);
        return node;
    }
};

class ReverseBstIterator {
public:
    stack<TreeNode *> stack;

    ReverseBstIterator(TreeNode *root) {
        pushAllRight(root);
    }

    void pushAllRight(TreeNode *node) {
        while (node != nullptr) {
            stack.push(node);
            node = node->right;
        }
    }

    bool hasNext() {
        return !stack.empty();
    }

    TreeNode *next() {
        if (!hasNext()) {
            return nullptr;
        }

        TreeNode *node = stack.top();
        stack.pop();
        pushAllRight(node->left);
        return node;
    }
};

class Solution {
public:
    bool twoSumOnBST(TreeNode *root, int target) {
        if (!root) {
            return false;
        }

        // Initialize the left and right iterators
        ForwardBstIterator leftIterator(root);
        ReverseBstIterator rightIterator(root);

        TreeNode *leftNode = leftIterator.next();
        TreeNode *rightNode = rightIterator.next();

        while (leftNode && rightNode && leftNode->val < rightNode->val) {

            // Check if the sum of the two nodes equals k
            if (leftNode->val + rightNode->val == target) {
                return true;
            }

            // If the sum is less than target, move the left pointer
            // to the right
            else if (leftNode->val + rightNode->val < target) {
                leftNode = leftIterator.next();
            }

            // If the sum is greater than target, move the right pointer
            // to the left
            else {
                rightNode = rightIterator.next();
            }
        }

        // No pair found
        return false;
    }
};
```

***

# Multiple tree

## Problem Statement

Given the **root** of a binary search tree, write a function that returns `true` if, for every pair of nodes formed by taking one node from the start and one from the end of the in-order traversal, the node from the end is a multiple of the node from the start. Return `false` otherwise.

### Example 1

> -   **Input:** root = \[4, 2, 6, 1, null, null, 7\]
> -   **Output:** true
> -   **Explanation:** For every pair of nodes from the start and end of an in-order traversal, the end node is a multiple of the start node.

### Example 2

> -   **Input:** root = \[2, 1, 5, null, null, 3, 7\]
> -   **Output:** false
> -   **Explanation:** The second node from the end (5) is not a multiple of the second node from the start (2).

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
    stack<TreeNode *> stack;

    ForwardBstIterator(TreeNode *root) {
        pushAllLeft(root);
    }

    void pushAllLeft(TreeNode *node) {
        while (node != nullptr) {
            stack.push(node);
            node = node->left;
        }
    }

    bool hasNext() {
        return !stack.empty();
    }

    TreeNode *next() {
        if (!hasNext()) {
            return nullptr;
        }

        TreeNode *node = stack.top();
        stack.pop();
        pushAllLeft(node->right);
        return node;
    }
};

class ReverseBstIterator {
public:
    stack<TreeNode *> stack;

    ReverseBstIterator(TreeNode *root) {
        pushAllRight(root);
    }

    void pushAllRight(TreeNode *node) {
        while (node != nullptr) {
            stack.push(node);
            node = node->right;
        }
    }

    bool hasNext() {
        return !stack.empty();
    }

    TreeNode *next() {
        if (!hasNext()) {
            return nullptr;
        }

        TreeNode *node = stack.top();
        stack.pop();
        pushAllRight(node->left);
        return node;
    }
};

class Solution {
public:
    bool multipleTree(TreeNode *root) {
        if (!root) {
            return false;
        }

        // Initialize the left and right iterators
        ForwardBstIterator leftIterator(root);
        ReverseBstIterator rightIterator(root);

        TreeNode *leftNode = leftIterator.next();
        TreeNode *rightNode = rightIterator.next();

        while (leftNode && rightNode && leftNode->val < rightNode->val) {

            // Check if the right node's value is a multiple of the left
            // node's value
            if (rightNode->val % leftNode->val != 0) {
                return false;
            }

            // Move to the left node to the next node in in-order
            leftNode = leftIterator.next();

            // Move the right node to the next node in reverse in-order
            rightNode = rightIterator.next();
        }

        // If all pairs satisfy the condition, return true
        return true;
    }
};
```

***

# Median in BST

## Problem Statement

Given the **root** of a binary search tree, write a function to find and return the median value of this tree. The value should be rounded down to the nearest integer.

The median in a binary search tree is the middle value when the nodes are arranged in sorted order. If the number of nodes is odd, it's the middle node, and if even, it’s the average of the two middle nodes.

### Example 1

> -   **Input:** root = \[5, 4, 6, 2, null, null, 7\]
> -   **Output:** 5
> -   **Explanation:** Since there is an odd number of nodes, the median is 5, which is the middle node of the binary search tree.

### Example 2

> -   **Input:** root = \[10, 8, 14, 5, null, 13, 17\]
> -   **Output:** 11
> -   **Explanation:** Since there is an even number of nodes, the median is the average of the two middle nodes: (10 + 13) / 2 = 11.5, which rounds down to 11.

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
    stack<TreeNode *> stack;

    ForwardBstIterator(TreeNode *root) {
        pushAllLeft(root);
    }

    void pushAllLeft(TreeNode *node) {
        while (node != nullptr) {
            stack.push(node);
            node = node->left;
        }
    }

    bool hasNext() {
        return !stack.empty();
    }

    TreeNode *next() {
        if (!hasNext()) {
            return nullptr;
        }

        TreeNode *node = stack.top();
        stack.pop();
        pushAllLeft(node->right);
        return node;
    }
};

class ReverseBstIterator {
public:
    stack<TreeNode *> stack;

    ReverseBstIterator(TreeNode *root) {
        pushAllRight(root);
    }

    void pushAllRight(TreeNode *node) {
        while (node != nullptr) {
            stack.push(node);
            node = node->right;
        }
    }

    bool hasNext() {
        return !stack.empty();
    }

    TreeNode *next() {
        if (!hasNext()) {
            return nullptr;
        }

        TreeNode *node = stack.top();
        stack.pop();
        pushAllRight(node->left);
        return node;
    }
};

class Solution {
public:
    int medianInBst(TreeNode *root) {
        if (!root) {
            return -1;
        }

        // Initialize the left and right iterators
        ForwardBstIterator leftIterator(root);
        ReverseBstIterator rightIterator(root);

        TreeNode *leftNode = leftIterator.next();
        TreeNode *rightNode = rightIterator.next();

        // Variable to store the median value
        int median = -1;

        while (leftNode && rightNode && leftNode->val < rightNode->val) {

            // Update the median with the average of the two nodes, if
            // the tree has an even number of nodes, the median will be
            // the average of the two middle nodes before exiting the
            // loop
            median = (leftNode->val + rightNode->val) / 2;

            // Move to the left node to the next node in in-order
            leftNode = leftIterator.next();

            // Move the right node to the next node in reverse in-order
            rightNode = rightIterator.next();
        }

        // If both iterators meet at the same node, it means the tree has
        // an odd number of nodes
        if (leftNode == rightNode) {
            return leftNode->val;
        }

        // If the tree has an even number of nodes, return the last
        // computed median
        return median;
    }
};
```

***

# BST pair sum

***

# BST pair sum

## Problem Statement

Given the **roots** of two binary search trees, **rootA** and **rootB**, and an integer value **target**, write a function that returns `true` if a pair of nodes (one node from each tree) exists that sum up to the target. Return `false` if no such pair exists.

### Example 1

> -   **Input:** rootA = \[4, 2, 6, 1, null, null, 7\], rootB = \[2, 1, 4, null, null, 3, 8\], target = 15
> -   **Output:** true
> -   **Explanation:** The node with value 7 from the first tree and the node with value 8 from the second tree sum up to 15.

### Example 2

> -   **Input:** rootA = \[4, 2, 6, 1, null, null, 7\], rootB = \[2, 1, 4, null, null, 3, 8\], target = 35
> -   **Output:** false
> -   **Explanation:** A sum of 35 cannot be made using the above trees.

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
    stack<TreeNode *> stack;

    ForwardBstIterator(TreeNode *root) {
        pushAllLeft(root);
    }

    void pushAllLeft(TreeNode *node) {
        while (node != nullptr) {
            stack.push(node);
            node = node->left;
        }
    }

    bool hasNext() {
        return !stack.empty(); 
    }

    TreeNode *next() {
        if (!hasNext()) {
            return nullptr;
        }

        TreeNode *node = stack.top();
        stack.pop();
        pushAllLeft(node->right);
        return node;
    }
};

class ReverseBstIterator {
public:
    stack<TreeNode *> stack;

    ReverseBstIterator(TreeNode *root) {
        pushAllRight(root); 
    }

    void pushAllRight(TreeNode *node) {
        while (node != nullptr) {
            stack.push(node);
            node = node->right;
        }
    }

    bool hasNext() {
        return !stack.empty();
    }

    TreeNode *next() {
        if (!hasNext()) {
            return nullptr;
        }

        TreeNode *node = stack.top();
        stack.pop();
        pushAllRight(node->left);
        return node;
    }
};

class Solution {
public:
    bool bstPairSum(TreeNode *rootA, TreeNode *rootB, int target) {
        if (!rootA || !rootB) {
            return false;
        }

        // Initialize the left and right iterators
        ForwardBstIterator leftIterator(rootA);
        ReverseBstIterator rightIterator(rootB);

        TreeNode *leftNode = leftIterator.next();
        TreeNode *rightNode = rightIterator.next();

        while (leftNode && rightNode) {

            // Check if the sum of the two nodes equals k
            if (leftNode->val + rightNode->val == target) {
                return true;
            }

            // If the sum is less than target, move the left pointer
            // to the right
            else if (leftNode->val + rightNode->val < target) {
                leftNode = leftIterator.next();
            }

            // If the sum is greater than target, move the right pointer
            // to the left
            else {
                rightNode = rightIterator.next();
            }
        }

        // No pair found
        return false;
    }
};
```
