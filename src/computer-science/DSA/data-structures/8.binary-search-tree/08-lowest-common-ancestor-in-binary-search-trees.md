# Lowest common ancestor in binary search trees

## Table of Contents

1. [Understanding the lowest common ancestor](#understanding-the-lowest-common-ancestor)
2. [Lowest common ancestor](#lowest-common-ancestor)

***

# Understanding the lowest common ancestor

The lowest common ancestor of two nodes in a binary tree is the lowest node from the root, with both nodes as its descendants. Either of those nodes can also be the lowest common ancestor for itself and the other node. Consider the following examples of the lowest common ancestors for a pair of nodes in a binary tree.

// Diagram: The lowest common ancestor of two nodes in a generic binary tree.

The generic algorithm to find the lowest common ancestor of two nodes in a binary tree uses a slightly modified version of the postorder traversal. However we can use a drastically faster algorithm to find the lowest common ancestor for a binary search tree.

## Algorithm

The binary search tree follows the special binary search property which means the value of all the nodes in the left subtree of a node is smaller than it and the value of all the nodes in the right subtree is greater.

// Diagram: The binary search property of a binary search tree.

Consider we are given a binary search tree and references to two nodes `nodeA` and `nodeB` and we need to find the lowest common ancestor of these nodes in the tree. 

// Diagram: Find the lowest common ancestor of two nodes, nodeA and nodeB, in a binary search tree.

In a binary tree, the lowest common ancestor can either be one of the nodes themselves or a third node such that one of `nodeA` or `nodeB` is in its left subtree while the other is in its right subtree. For a binary search tree, however, this third node must be a node that has a value between the values of `nodeA` and `nodeB`. Given below are all the possible scenarios.

// Diagram: All possible scenarios for finding the lowest common ancestor of two nodes, nodeA and nodeB, in a binary search tree.

Conversely, if we search for the first node that has a value between the values of `nodeA` and `nodeB` (including them), it must be their lowest common ancestor. This transforms the problem into a search problem where we need to find the first node from the top with a value between the values of `nodeA` and `nodeB`. For this node, the smaller of `nodeA` or `nodeB` will be in the left subtree, and the other node will be in the right subtree.

// Diagram: The lowest common ancestor is the first node from the top with a value between the two nodes, nodeA and nodeB.

The search operation in a binary search tree can be implemented as a simple recursive algorithm that discards either the left or right subtree at every point until it finds a node with a value between the two nodes or reaches the end of the tree.

// Diagram: Recursive equation to find the lowest common ancestor of nodeA and nodeB in a binary search tree.

Let's look at an example to understand it better.

// Diagram: Find the lowest common ancestor of the given nodes

> **Algorithm**
>
> **lowestCommonAncestor(node, nodeA, nodeB):**
>
> -   **Step 1:** If \`node\` == \`null\` or \`node\` == \`nodeA\` or \`node\` == \`nodeB\`, return \`node\`
> -   **Step 2:** If \`node.val\` > \`nodeA.val\` and \`node.val\` > \`nodeB.val\`:
>     -   **Step 2.1:** Return the value returned by \`lowestCommonAncestor(root.left, nodeA, nodeB)\`
> -   **Step 3:** If \`node.val\` < \`nodeA.val\` and \`node.val\` < \`nodeB.val\`:
>     -   **Step 3.1:** Return the value returned by \`lowestCommonAncestor(root.right, nodeA, nodeB)\`
> -   **Step 4:** return \`node\`

## Implementation

We implement the recursive equation using a recursive function to search for a node with a value between the values of `nodeA` and `nodeB` in a binary search tree.

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

class Solution {
public:
    TreeNode *lowestCommonAncestor(
        TreeNode *root,
        TreeNode *nodeA,
        TreeNode *nodeB
    ) {

        // If the root is null or one of the nodes is the root, return
        // the root
        if (root == nullptr || root == nodeA || root == nodeB) {
            return root;
        }

        // If both nodes are in the left subtree, recursively search in
        // the left subtree
        if (root->val > nodeA->val && root->val > nodeB->val) {
            return lowestCommonAncestor(root->left, nodeA, nodeB);
        }

        // If both nodes are in the right subtree, recursively search in
        // the right subtree
        if (root->val < nodeA->val && root->val < nodeB->val) {
            return lowestCommonAncestor(root->right, nodeA, nodeB);
        }

        // If one node is in the left subtree and the other is in the
        // right subtree, return the root
        return root;
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

class Solution {
    public TreeNode lowestCommonAncestor(
        TreeNode root,
        TreeNode nodeA,
        TreeNode nodeB
    ) {

        // If the root is null or one of the nodes is the root, return
        // the root
        if (root == null || root == nodeA || root == nodeB) {
            return root;
        }

        // If both nodes are in the left subtree, recursively search in
        // the left subtree
        if (root.val > nodeA.val && root.val > nodeB.val) {
            return lowestCommonAncestor(root.left, nodeA, nodeB);
        }

        // If both nodes are in the right subtree, recursively search in
        // the right subtree
        if (root.val < nodeA.val && root.val < nodeB.val) {
            return lowestCommonAncestor(root.right, nodeA, nodeB);
        }

        // If one node is in the left subtree and the other is in the
        // right subtree, return the root
        return root;
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
    lowestCommonAncestor(
        root: TreeNode | null,
        nodeA: TreeNode | null,
        nodeB: TreeNode | null
    ): TreeNode | null {

        // If the root is null or one of the nodes is the root, return
        // the root
        if (root === null || root === nodeA || root === nodeB) {
            return root;
        }

        // If both nodes are in the left subtree, recursively search in
        // the left subtree
        if (root.val > nodeA.val && root.val > nodeB.val) {
            return this.lowestCommonAncestor(root.left, nodeA, nodeB);
        }

        // If both nodes are in the right subtree, recursively search in
        // the right subtree
        if (root.val < nodeA.val && root.val < nodeB.val) {
            return this.lowestCommonAncestor(root.right, nodeA, nodeB);
        }

        // If one node is in the left subtree and the other is in the
        // right subtree, return the root
        return root;
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
    lowestCommonAncestor(root, nodeA, nodeB) {

        // If the root is null or one of the nodes is the root, return
        // the root
        if (root === null || root === nodeA || root === nodeB) {
            return root;
        }

        // If both nodes are in the left subtree, recursively search in
        // the left subtree
        if (root.val > nodeA.val && root.val > nodeB.val) {
            return this.lowestCommonAncestor(root.left, nodeA, nodeB);
        }

        // If both nodes are in the right subtree, recursively search in
        // the right subtree
        if (root.val < nodeA.val && root.val < nodeB.val) {
            return this.lowestCommonAncestor(root.right, nodeA, nodeB);
        }

        // If one node is in the left subtree and the other is in the
        // right subtree, return the root
        return root;
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

class Solution:
    def lowest_common_ancestor(
        self,
        root: Optional[TreeNode],
        node_a: Optional[TreeNode],
        node_b: Optional[TreeNode],
    ) -> Optional[TreeNode]:

        # If the root is None or one of the nodes is the root, return
        # the root
        if root is None or root == node_a or root == node_b:
            return root

        if node_a is not None and node_b is not None:

            # If both nodes are in the left subtree, recursively search
            # in the left subtree
            if root.val > node_a.val and root.val > node_b.val:
                return self.lowest_common_ancestor(
                    root.left, node_a, node_b
                )

            # If both nodes are in the right subtree, recursively search
            # in the right subtree
            if root.val < node_a.val and root.val < node_b.val:
                return self.lowest_common_ancestor(
                    root.right, node_a, node_b
                )

        # If one node is in the left subtree and the other is in the
        # right subtree, return the root
        return root
```

## Complexity Analysis

The time and space complexity of the lowest common ancestor finding technique is quite easy to understand. We follow the same path as the search algorithm, discarding either the left or the right subtree as we traverse down from the root node, and so the time complexity is the same as the search algorithm, which is **O(log(N))** in the best case when tree is height balanced and linear **O(N)** in the worst case when the tree is degenerate.

The space complexity depends on the maximum size of the function call stack, which can be linear **O(N)** if the tree is a degenerate binary tree and **O(log(N))** if it is height balanced.

> **Best Case:** Height balanced binary search tree
>
> -   Space Complexity - **O(log(N))**
> -   Time Complexity - **O(log(N))**
>
> **Worst Case:** Degenerate binary search tree
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Lowest common ancestor

## Problem Statement

Given the **root** of a binary tree and two random nodes, **nodeA** and **nodeB**, write a function to find and return the node that is the lowest common ancestor of nodeA and nodeB. If one of the nodes does not exist, return the other node. If there is no lowest common ancestor, return `null` instead.

The lowest common ancestor is defined between two nodes, nodeA and nodeB, as the lowest node in the tree that has both nodeA and nodeB as descendants (where we allow a node to be a descendant of itself).

### Example 1

> -   **Input:** root = \[4, 2, 5, 1, null, null, 7\], nodeA = 1, nodeB = 7
> -   **Output:** 4
> -   **Explanation:** The lowest common ancestor of the nodes with the given value is the node with the value 4.

### Example 2

> -   **Input:** root = \[5, 1, 8, null, null, 6, 9\], nodeA = 6, nodeB = 9
> -   **Output:** 8
> -   **Explanation:** The lowest common ancestor of the nodes with the given value is the node with the value 8.

## Solution

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

using namespace std;

class Solution {
public:
    TreeNode *lowestCommonAncestor(
        TreeNode *root,
        TreeNode *nodeA,
        TreeNode *nodeB
    ) {

        // If the root is null or one of the nodes is the root, return
        // the root
        if (root == nullptr || root == nodeA || root == nodeB) {
            return root;
        }

        // If both nodes are in the left subtree, recursively search in
        // the left subtree
        if (root->val > nodeA->val && root->val > nodeB->val) {
            return lowestCommonAncestor(root->left, nodeA, nodeB);
        }

        // If both nodes are in the right subtree, recursively search in
        // the right subtree
        if (root->val < nodeA->val && root->val < nodeB->val) {
            return lowestCommonAncestor(root->right, nodeA, nodeB);
        }

        // If one node is in the left subtree and the other is in the
        // right subtree, return the root
        return root;
    }
};
```
