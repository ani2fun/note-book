# Pattern: Lowest common ancestor

## Table of Contents

1. [Understanding the lowest common ancestor pattern](#understanding-the-lowest-common-ancestor-pattern)
2. [Identifying the lowest common ancestor pattern](#identifying-the-lowest-common-ancestor-pattern)
3. [Lowest Common Ancestor](#lowest-common-ancestor)
4. [Lowest Common Ancestor II](#lowest-common-ancestor-ii)
5. [Random Lowest Common Ancestor](#random-lowest-common-ancestor)
6. [Deepest Lowest common ancestor](#deepest-lowest-common-ancestor)
7. [Distance between nodes](#distance-between-nodes)

***

# Understanding the lowest common ancestor pattern

The lowest common ancestor of two nodes in a binary tree is the lowest node from the root, with both nodes as its descendants. Either of those nodes can also be the lowest common ancestor for itself and the other node. Consider the following examples of the lowest common ancestors for a pair of nodes in a binary tree.

// Diagram: The lowest common ancestor of two nodes in a binary tree.

The same idea can be extended to multiple nodes where the lowest common ancestor for all those nodes is the lowest node from the root such that all the other nodes are its descendants. Any of those nodes can itself be the lowest common ancestor of itself and the other nodes.

// Diagram: The lowest common ancestor of a set of nodes in a binary tree.

Let us look at the generic lowest common ancestor problem to understand it better.

## The lowest common ancestor problem

Consider we are given a binary tree and a list of n nodes, and we need to find the lowest common ancestor of all these nodes.

// Diagram: A binary tree and a set of nodes.

Let us look at all the scenarios and the lowest common ancestor in each case to understand the lowest common ancestor problem better.

### 1\. All the nodes do not exist in the tree

In this case, there is no lowest common ancestor in the tree, as the nodes themselves do not exist.

// Diagram: If all nodes do not exist in the tree, the tree has no lowest common ancestor.

### 2\. Only some of nodes exist in the tree

In this case, the lowest common ancestor of the nodes that exist in the tree is the lowest common ancestor for all nodes.

// Diagram: The lowest common ancestor for the nodes that exist in the tree is the lowest common ancestor of all nodes in the list.

### 3\. All the nodes exists in the tree

In this case, there are two sub-cases we need to consider.

#### 3.1 One of the nodes is the lowest common ancestor

If there is one node in the list such that all the remaining nodes are its descendants, that one node is the lowest common ancestor of all the nodes in the list.

// Diagram: One node from the list is the lowest common ancestor of all the nodes in the list.

#### 3.2 All the nodes are descendants of a node not in the list

In this case, the node in the tree that has a subset of nodes from the list in its left subtree and the remaining nodes from the list in its right subtree is the lowest common ancestor of all the nodes.

// Diagram: The lowest common ancestor is the lowest node in the tree such that all nodes in the list are its descendants.

Many binary tree problems require finding the lowest common ancestor for a list of nodes to either solve the entire problem or a subproblem. We can use the lowest common ancestor finding technique to efficiently solve such problems.

The lowest common ancestor pattern is a classification of problems that can be solved using the lowest common ancestor finding technique.

## The lowest common ancestor finding technique

Consider we are given a binary tree and a list of n nodes, and we need to find the lowest common ancestor of these nodes in the tree.

// Diagram: Find the lowest common ancestor for all nodes in the list in the binary tree.

While there may seem to be many cases to consider for finding the lowest common ancestor for a list of nodes in a binary tree, the actual solution to this problem is quite simple and intuitive. We use a slightly modified version of the postorder traversal where for every node, we return the lowest common ancestor for all nodes that exists in the subtree of that node. This information can be used to effectively resolve all the cases and find the lowest common ancestor in the tree.

We start the postorder traversal from the root of the tree, passing the list of nodes as an argument. If we hit a `null` node, we return a `null` reference to the parent. As we enter any node, we check if the current node matches any node in the list. If it does, it means the current node is the lowest common ancestor for the subset of nodes in the list that exist in the subtree rooted at this node. This subset may have zero or mode nodes from the list, but all of them will be the descendants of the current node.

On the other hand, if the current node does not match with any node in the pair, we continue the postorder traversal to the left and the right subtree, recursively doing the same thing and storing the return values in two variables `leftLCA` and `rightLCA`. We can then use these values to decide if the current node is the lowest common ancestor for a subset of nodes in the list. Let's consider all the possible values of `leftLCA` and `rightLCA` to understand all the cases better.

### 1\. Either leftLCA or rightLCA is null

If one of `leftLCA` or `rightLCA` is `null` for the current node, this means for the subset of nodes from the list that exist in the subtree rooted at the current node, the **non** `null` reference is the lowest common ancestor. We return the **non** `null` reference back to the parent node.

// Diagram: If one of leftLCA or rightLCA is not null, return the non null reference back to the parent

### 2\. Both leftLCA and rightLCA are not null

If both `leftLCA` and `rightLCA` are not `null`, it means a subset of nodes from the list exists in the left subtree, and another subset of nodes exists in the right subtree of the current node. This means that the current node is the lowest common ancestor for all the nodes from both the subsets, and so, we return the reference to the current node back to the parent node.

// Diagram: If both leftLCA and rightLCA are not null, return the reference of the current node back to the parent.

### 3\. Both leftLCA or rightLCA are null

This means that the subtree rooted at the current node does not have any nodes from the list, and so the lowest common ancestor does not exist in it. In this case, we return a `null` reference back to the parent node.

// Diagram: If both leftLCA and rightLCA are null, return null back to the parent.

This way, at the end of postorder traversal for every node, we either return back the parent the lowest common ancestor for a subset of nodes that exists in the subtree rooted at the current node or a `null` reference. A `null` reference means that no node from the list exists in the subtree rooted at that node.

And so, at the end of the postorder, the caller gets the lowest common ancestor for a subset of nodes from the list that exists in the binary tree rooted at the root node, which is the lowest common ancestor we are looking for. Consider the example below to understand the technique better.

// Diagram: Find the lowest common ancestor for a set of nodes

## Algorithm

The algorithm given below does a postorder traversal of a binary tree, taking a reference to a list of nodes and returning the lowest common ancestor of those nodes in the tree.

> **Algorithm**
>
> **lowestCommonAncestor(node, nodes):**
>
> -   **Step 1:** If \`root\` is \`null\`, return \`null\` to the parent node
> -   **Step 2:** If \`root\` is in \`nodes\`, return \`root\` to the parent node
> -   **Step 3:** \`leftLca\` = Call \`lowestCommonAncestor(root.left, nodes)\`
> -   **Step 4:** \`rightLca\` = Call \`lowestCommonAncestor(root.right, nodes)\`
> -   **Step 5:** If both \`leftLca\` and \`rightLca\` is not \`null\`, return \`root\` to the parent node
> -   **Step 6:** If \`leftLca\` is not \`null\` return \`leftLca\` otherwise, return \`rightLca\`

### Implementation

The implementation of the lowest common ancestor finding technique technique is given below. The technique is a slightly modified version of postorder traversal that has a very concise recursive implementation.

C++

```cpp
#include <unordered_set>

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
        unordered_set<TreeNode *> &nodes
    ) {

        // If the root is null, return null
        if (!root) {
            return nullptr;
        }

        // If the current node is part of the nodes list, return it
        if (nodes.count(root)) {
            return root;
        }

        // Recursively search in the left and right subtrees
        TreeNode *leftLCA = lowestCommonAncestor(root->left, nodes);
        TreeNode *rightLCA = lowestCommonAncestor(root->right, nodes);

        // If both subtrees return a non-null value
        // the current node is the lowest common ancestor
        if (leftLCA && rightLCA) {
            return root;
        }

        // If only one subtree returns a non-null value, return that
        // value
        if (leftLCA) {
            return leftLCA;
        }

        return rightLCA;
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

class Solution {
    public TreeNode lowestCommonAncestor(
        TreeNode root,
        Set<TreeNode> nodes
    ) {

        // If the root is null, return null
        if (root == null) {
            return null;
        }

        // If the current node is part of the nodes set, return it
        if (nodes.contains(root)) {
            return root;
        }

        // Recursively search in the left and right subtrees
        TreeNode leftLCA = lowestCommonAncestor(root.left, nodes);
        TreeNode rightLCA = lowestCommonAncestor(root.right, nodes);

        // If both subtrees return a non-null value
        // the current node is the lowest common ancestor
        if (leftLCA != null && rightLCA != null) {
            return root;
        }

        // If only one subtree returns a non-null value, return that
        // value
        if (leftLCA != null) {
            return leftLCA;
        }

        return rightLCA;
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
        nodes: Set<TreeNode>
    ): TreeNode | null {

        // If the root is null, return null
        if (root === null) {
            return null;
        }

        // If the current node is part of the nodes set, return it
        if (nodes.has(root)) {
            return root;
        }

        // Recursively search in the left and right subtrees
        const leftLCA = this.lowestCommonAncestor(root.left, nodes);
        const rightLCA = this.lowestCommonAncestor(root.right, nodes);

        // If both subtrees return a non-null value
        // the current node is the lowest common ancestor
        if (leftLCA !== null && rightLCA !== null) {
            return root;
        }

        // If only one subtree returns a non-null value, return that
        // value
        if (leftLCA !== null) {
            return leftLCA;
        }

        return rightLCA;
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
    lowestCommonAncestor(root, nodes) {

        // If the root is null, return null
        if (root === null) {
            return null;
        }

        // If the current node is part of the nodes set, return it
        if (nodes.has(root)) {
            return root;
        }

        // Recursively search in the left and right subtrees
        const leftLCA = this.lowestCommonAncestor(root.left, nodes);
        const rightLCA = this.lowestCommonAncestor(root.right, nodes);

        // If both subtrees return a non-null value
        // the current node is the lowest common ancestor
        if (leftLCA !== null && rightLCA !== null) {
            return root;
        }

        // If only one subtree returns a non-null value, return that
        // value
        if (leftLCA !== null) {
            return leftLCA;
        }

        return rightLCA;
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
        self, root: Optional[TreeNode], nodes: set
    ) -> Optional[TreeNode]:

        # If the root is null, return null
        if not root:
            return None

        # If the current node is part of the nodes set, return it
        if root in nodes:
            return root

        # Recursively search in the left and right subtrees
        left_lca = self.lowest_common_ancestor(root.left, nodes)
        right_lca = self.lowest_common_ancestor(root.right, nodes)

        # If both subtrees return a non-null value
        # the current node is the lowest common ancestor
        if left_lca and right_lca:
            return root

        # If only one subtree returns a non-null value, return that value
        return left_lca if left_lca else right_lca
```

### Complexity Analysis

The time and space complexity of the lowest common ancestor finding technique is quite easy to understand. We traverse the entire tree using postorder traversal that takes linear **O(N)** time in any case.

The space complexity of the technique is also the same as postorder traversal. It depends on the maximum size of the function call stack, which can be linear **O(N)** if the tree is a degenerate binary tree where every node only has one child and **O(log(N))** if it is a complete binary tree. Each stack frame also creates its own copy of local variables, but each of them only makes a constant contribution to the size of the frame, so the overall space complexity is the same as the space required for the stack frames.

> **Best Case:** Degenerate binary tree
>
> -   Space Complexity - **O(log(N))**
> -   Time Complexity - **O(N)**
>
> **Worst Case:** Complete binary tree
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Identifying the lowest common ancestor pattern

The lowest common ancestor finding technique can only solve certain types of binary tree problems. These are generally easy or medium problems where we need to find the lowest common ancestor for a set of nodes in a tree. Finding the lowest common ancestor may directly solve the problem or only a part of it.

If the problem statement or its solution follows the generic template below, it can be solved using the lowest common ancestor finding technique.

**Template:**

Given a binary tree and a set of nodes, find the lowest common ancestor node.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the lowest common ancestor finding technique.

> **Problem statement:** Given the root of a binary tree and two nodes, find their lowest common ancestor. If one of the nodes doesn't exist, return the other node. If there is no lowest common ancestor, return \`null\` instead.

// Diagram: Find the lowest common ancestor for the given nodes in the binary tree.

## The lowest common ancestor finding technique

The problem description fits the generic template from the lowest common ancestor pattern we learned earlier.

**Template:**

Given a binary tree and a set (two) of nodes, find the lowest common ancestor node.

We start the postorder traversal from the root of the tree, passing the two nodes `nodeA` and `nodeB` as arguments. Every node returns to its parent, the lowest common ancestor of the two nodes in the subtree root at itself.

If we hit a `null` node, we return a `null` reference to the parent. As we enter any node, we check if the current node matches any of the two nodes. If it does, it means the current node is the lowest common ancestor in the subtree rooted at this node. This is because if the subtree does not have the other node, then this node is the lowest common ancestor in the subtree. Otherwise, if the subtree has the other node, it is guaranteed to be a descendent of the current node, making this node the lowest common ancestor.

On the other hand, if the current node does not match with any node in the pair (`nodeA` or `nodeB`), we continue the postorder traversal to the left and the right subtree, recursively applying the same logic and storing the return values in two variables `leftLCA` and `rightLCA`. If both `leftLCA` and `rightLCA` are not null, it means the current node is the lowest common ancestor and we return it to the parent. Otherwise, we check if one of `leftLCA` or `rightLCA` is not `null`. The non `null` value is the lowest common ancestor in this case, and we return it to the parent. If both `leftLCA` and `rghtLCA` are `null`, the subtree rooted at this node does not have any of the two nodes, so we return `null`.

And so, at the end of the postorder, the caller gets the lowest common ancestor for the two nodes in the subtree rooted at the rotor node, which is the entire binary tree itself.

// Diagram: Find the lowest common ancestor for nodes f and e

The implementation of the lowest common ancestor finding technique to solve the problem is given below.

C++

```cpp
#include <unordered_set>

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
        unordered_set<TreeNode *> &nodes
    ) {

        // If the root is null, return null
        if (!root) {
            return nullptr;
        }

        // If the current node is part of the nodes list, return it
        if (nodes.count(root)) {
            return root;
        }

        // Recursively search in the left and right subtrees
        TreeNode *leftLCA = lowestCommonAncestor(root->left, nodes);
        TreeNode *rightLCA = lowestCommonAncestor(root->right, nodes);

        // If both subtrees return a non-null value
        // the current node is the lowest common ancestor
        if (leftLCA && rightLCA) {
            return root;
        }

        // If only one subtree returns a non-null value, return that
        // value
        if (leftLCA) {
            return leftLCA;
        }

        return rightLCA;
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

class Solution {
    public TreeNode lowestCommonAncestor(
        TreeNode root,
        Set<TreeNode> nodes
    ) {

        // If the root is null, return null
        if (root == null) {
            return null;
        }

        // If the current node is part of the nodes set, return it
        if (nodes.contains(root)) {
            return root;
        }

        // Recursively search in the left and right subtrees
        TreeNode leftLCA = lowestCommonAncestor(root.left, nodes);
        TreeNode rightLCA = lowestCommonAncestor(root.right, nodes);

        // If both subtrees return a non-null value
        // the current node is the lowest common ancestor
        if (leftLCA != null && rightLCA != null) {
            return root;
        }

        // If only one subtree returns a non-null value, return that
        // value
        if (leftLCA != null) {
            return leftLCA;
        }

        return rightLCA;
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
        nodes: Set<TreeNode>
    ): TreeNode | null {

        // If the root is null, return null
        if (root === null) {
            return null;
        }

        // If the current node is part of the nodes set, return it
        if (nodes.has(root)) {
            return root;
        }

        // Recursively search in the left and right subtrees
        const leftLCA = this.lowestCommonAncestor(root.left, nodes);
        const rightLCA = this.lowestCommonAncestor(root.right, nodes);

        // If both subtrees return a non-null value
        // the current node is the lowest common ancestor
        if (leftLCA !== null && rightLCA !== null) {
            return root;
        }

        // If only one subtree returns a non-null value, return that
        // value
        if (leftLCA !== null) {
            return leftLCA;
        }

        return rightLCA;
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
    lowestCommonAncestor(root, nodes) {

        // If the root is null, return null
        if (root === null) {
            return null;
        }

        // If the current node is part of the nodes set, return it
        if (nodes.has(root)) {
            return root;
        }

        // Recursively search in the left and right subtrees
        const leftLCA = this.lowestCommonAncestor(root.left, nodes);
        const rightLCA = this.lowestCommonAncestor(root.right, nodes);

        // If both subtrees return a non-null value
        // the current node is the lowest common ancestor
        if (leftLCA !== null && rightLCA !== null) {
            return root;
        }

        // If only one subtree returns a non-null value, return that
        // value
        if (leftLCA !== null) {
            return leftLCA;
        }

        return rightLCA;
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
        self, root: Optional[TreeNode], nodes: set
    ) -> Optional[TreeNode]:

        # If the root is null, return null
        if not root:
            return None

        # If the current node is part of the nodes set, return it
        if root in nodes:
            return root

        # Recursively search in the left and right subtrees
        left_lca = self.lowest_common_ancestor(root.left, nodes)
        right_lca = self.lowest_common_ancestor(root.right, nodes)

        # If both subtrees return a non-null value
        # the current node is the lowest common ancestor
        if left_lca and right_lca:
            return root

        # If only one subtree returns a non-null value, return that value
        return left_lca if left_lca else right_lca
```

The lowest common ancestor finding technique can solve this problem in linear time and a single pass using a very small and concise recursive implementation.

## Example problems

Most problems that fall under this category are**easy** or **medium** problems; a list of a few is given below.

> -   **[Lowest Common Ancestor](https://www.codeintuition.io/courses/binary-tree/23LPmm1m-KZkwIIB1PG97)**
> -   **[Lowest Common Ancestor II](https://www.codeintuition.io/courses/binary-tree/oBKOILQUJckfCPUNwMJXE)**
> -   **[Random Lowest Common Ancestor](https://www.codeintuition.io/courses/binary-tree/phl49_XtJvsuHAHB-3U7C)**
> -   **[Deepest Lowest common ancestor](https://www.codeintuition.io/courses/binary-tree/nnBm4Hi-j9gfPAAnUHCQ_)**
> -   **[Distance between nodes](https://www.codeintuition.io/courses/binary-tree/j1X8mlH7RIoEQ4HQBinPy)**

We will now solve these problems to understand the lowest common ancestor finding technique better.

***

# Lowest Common Ancestor

## Problem Statement

Given the **root** of a binary tree and two random nodes, **nodeA** and **nodeB**, write a function to find and return the node that is the lowest common ancestor of nodeA and nodeB. If one of the nodes does not exist, return the other node. If there is no lowest common ancestor, return `null` instead.

The lowest common ancestor is defined between two nodes, nodeA and nodeB, as the lowest node in the tree that has both nodeA and nodeB as descendants (where we allow a node to be a descendant of itself).

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\], nodeA = 4, nodeB = 7
> -   **Output:** 1
> -   **Explanation:** The lowest common ancestor of the given nodes is the node with the value 1.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\], nodeA = 2, nodeB = 7
> -   **Output:** 4
> -   **Explanation:** The lowest common ancestor of the given nodes is the node with the value 4.

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

        // If the root is null, return null
        if (!root) {
            return nullptr;
        }

        // If the current node is equal to either nodeA or nodeB
        // return the current node
        if (root == nullptr || root == nodeA || root == nodeB) {
            return root;
        }

        // Recursively search in the left and right subtrees
        TreeNode *leftLCA =
            lowestCommonAncestor(root->left, nodeA, nodeB);
        TreeNode *rightLCA =
            lowestCommonAncestor(root->right, nodeA, nodeB);

        // If both subtrees return a non-null value
        // the current node is the lowest common ancestor
        if (leftLCA && rightLCA) {
            return root;
        }

        // If only one subtree returns a non-null value, return that
        // value
        if (leftLCA) {
            return leftLCA;
        }

        return rightLCA;
    }
};
```

***

# Lowest Common Ancestor II

## Problem Statement

Given the **root** of a binary tree and two random nodes, **nodeA** and **nodeB**, write a function to find and return the node that is the lowest common ancestor of nodeA and nodeB. If either nodeA or node B does not exist in the tree, return `null`.

The lowest common ancestor is defined between two nodes, nodeA and nodeB, as the lowest node in the tree that has both nodeA and nodeB as descendants (where we allow a node to be a descendant of itself).

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\], nodeA = 4, nodeB = 7
> -   **Output:** 1
> -   **Explanation:** The lowest common ancestor of the given nodes is the node with the value 1.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\], nodeA = 2, nodeB = 9
> -   **Output:** null
> -   **Explanation:** Node with value 9 does not exist in the tree.

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
    bool nodeExists(TreeNode *root, TreeNode *target) {

        // If the root is null, the target node does not exist
        if (!root) {
            return false;
        }

        // If the current node is the target node, return true
        if (root == target) {
            return true;
        }

        // Recursively search in the left and right subtrees
        bool nodeExistsInLeftSubtree = nodeExists(root->left, target);
        bool nodeExistsInRightSubtree = nodeExists(root->right, target);

        // Return true if the target node exists in either subtree
        return nodeExistsInLeftSubtree || nodeExistsInRightSubtree;
    }

    TreeNode *lowestCommonAncestor(
        TreeNode *root,
        TreeNode *nodeA,
        TreeNode *nodeB
    ) {

        // If the root is null, return null
        if (!root) {
            return nullptr;
        }

        // If the current node is equal to either nodeA or nodeB
        // return the current node
        if (root == nullptr || root == nodeA || root == nodeB) {
            return root;
        }

        // Recursively search in the left and right subtrees
        TreeNode *leftLCA =
            lowestCommonAncestor(root->left, nodeA, nodeB);
        TreeNode *rightLCA =
            lowestCommonAncestor(root->right, nodeA, nodeB);

        // If both subtrees return a non-null value
        // the current node is the lowest common ancestor
        if (leftLCA && rightLCA) {
            return root;
        }

        // If only one subtree returns a non-null value, return that
        // value
        if (leftLCA) {
            return leftLCA;
        }

        return rightLCA;
    }

    TreeNode *lowestCommonAncestorII(
        TreeNode *root,
        TreeNode *nodeA,
        TreeNode *nodeB
    ) {

        // If any input is null, return null
        if (!root || !nodeA || !nodeB) {
            return nullptr;
        }

        // Check if both nodes exist in the tree
        if (!nodeExists(root, nodeA) || !nodeExists(root, nodeB)) {
            return nullptr;
        }

        return lowestCommonAncestor(root, nodeA, nodeB);
    }
};
```

***

# Random Lowest Common Ancestor

## Problem Statement

Given the **root** of a binary tree and a list of **nodes** that contain a bunch of random nodes in this tree, write a function to find and return the node that is the lowest common ancestor of all the nodes in the list. The nodes on the list will be guaranteed to exist in the tree.

The lowest common ancestor is defined for n nodes node1 and node2, node3, .... nodeN as the lowest node in the tree that has all these nodes as descendants (where we allow a node to be a descendant of itself).

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\], nodes = \[2, 4, 7\]
> -   **Output:** 1
> -   **Explanation:** The lowest common ancestor of the given nodes is the node with the value 1.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\], nodes = \[2, 7\]
> -   **Output:** 4
> -   **Explanation:** The lowest common ancestor of the given nodes is the node with the value 4.

## Solution

```cpp
#include <unordered_set>

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
        unordered_set<TreeNode *> &nodes
    ) {

        // If the root is null, return null
        if (!root) {
            return nullptr;
        }

        // If the current node is part of the nodes list, return it
        if (nodes.count(root)) {
            return root;
        }

        // Recursively search in the left and right subtrees
        TreeNode *leftLCA = lowestCommonAncestor(root->left, nodes);
        TreeNode *rightLCA = lowestCommonAncestor(root->right, nodes);

        // If both subtrees return a non-null value
        // the current node is the lowest common ancestor
        if (leftLCA && rightLCA) {
            return root;
        }

        // If only one subtree returns a non-null value, return that
        // value
        if (leftLCA) {
            return leftLCA;
        }

        return rightLCA;
    }

    TreeNode *randomLowestCommonAncestor(
        TreeNode *root,
        vector<TreeNode *> &nodes
    ) {

        // Convert the vector to an unordered set for faster lookup
        unordered_set<TreeNode *> nodeSet(nodes.begin(), nodes.end());

        // Find and return the lowest common ancestor
        return lowestCommonAncestor(root, nodeSet);
    }
};
```

***

# Deepest Lowest common ancestor

## Problem Statement

Given the **root** of a binary tree, write a function to find and return the node that is the lowest common ancestor of the **deepest leaves** of this tree. Return `null` if no lowest common ancestor exists.

The lowest common ancestor is defined between two nodes, nodeA and nodeB, as the lowest node in the tree that has both nodeA and nodeB as descendants (where we allow a node to be a descendant of itself).

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, 6, null, 7\]
> -   **Output:** 1
> -   **Explanation:** The deepest leaves of the tree are nodes with values 4, 6, and 7, and their lowest common ancestor is the node with value 1.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\], nodes = \[2, 7\]
> -   **Output:** 4
> -   **Explanation:** The deepest leaves of the tree are nodes with values 2 and 7, and their lowest common ancestor is the node with value 4.

## Solution

```cpp
#include <unordered_set>

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
    vector<TreeNode *> findDeepestLeaves(TreeNode *root) {

        // Variable to store the deepest leaves the deepest leaves
        vector<TreeNode *> deepestLeaves;

        if (!root) {
            return deepestLeaves;
        }

        queue<TreeNode *> queue;
        queue.push(root);

        // Loop through each level in the tree
        while (!queue.empty()) {

            // Get the size of the current level
            int levelSize = queue.size();

            // Reset deepestLeaves for the current level
            deepestLeaves.clear();

            // Loop through each node in the current level
            for (int i = 0; i < levelSize; ++i) {

                // Get the front node in the queue and remove it
                TreeNode *node = queue.front();
                queue.pop();

                // Add its value to the deepestLeaves
                deepestLeaves.push_back(node);

                // Add the node's children to the queue if they exist
                if (node->left) {
                    queue.push(node->left);
                }

                if (node->right) {
                    queue.push(node->right);
                }
            }
        }

        // The last computed deepestLeaves is for the deepest level
        return deepestLeaves;
    }

    TreeNode *randomLowestCommonAncestor(
        TreeNode *root,
        unordered_set<TreeNode *> &nodes
    ) {

        // If the root is null, return null
        if (!root) {
            return nullptr;
        }

        // If the current node is part of the nodes list, return it
        if (nodes.count(root)) {
            return root;
        }

        // Recursively search in the left and right subtrees
        TreeNode *leftLCA =
            randomLowestCommonAncestor(root->left, nodes);
        TreeNode *rightLCA =
            randomLowestCommonAncestor(root->right, nodes);

        // If both subtrees return a non-null value
        // the current node is the lowest common ancestor
        if (leftLCA && rightLCA) {
            return root;
        }

        // If only one subtree returns a non-null value, return that
        // value
        if (leftLCA) {
            return leftLCA;
        }

        return rightLCA;
    }

    TreeNode *deepestLowestCommonAncestor(TreeNode *root) {
        vector<TreeNode *> deepestLeaves = findDeepestLeaves(root);

        // Convert the vector to an unordered set for faster lookup
        unordered_set<TreeNode *> nodeSet(
            deepestLeaves.begin(), deepestLeaves.end()
        );

        // Find and return the lowest common ancestor
        return randomLowestCommonAncestor(root, nodeSet);
    }
};
```

***

# Distance between nodes

## Problem Statement

Given the **root** of a binary tree and two values, **valA** and **valB**, write a function that calculates and returns the distance between the two nodes with the given values.

The distance here is defined by the number of edges in the path.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\], valA = 4, valB = 7
> -   **Output:** 4
> -   **Explanation:** The distance between the two nodes with the given value is shown in the diagram.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7, null, 9\], valA = 2, valB = 8
> -   **Output:** 3
> -   **Explanation:** The distance between the two nodes with the given value is shown in the diagram.

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

class Solution {
public:
    TreeNode *lowestCommonAncestor(TreeNode *root, int valA, int valB) {

        // If the root is null, return null
        if (!root) {
            return nullptr;
        }

        // If the valie of the current node is equal to either valA or
        // valB return the current node
        if (root == nullptr || root->val == valA || root->val == valB) {
            return root;
        }

        // Recursively search in the left and right subtrees
        TreeNode *leftLCA = lowestCommonAncestor(root->left, valA, valB);
        TreeNode *rightLCA =
            lowestCommonAncestor(root->right, valA, valB);

        // If both subtrees return a non-null value
        // the current node is the lowest common ancestor
        if (leftLCA && rightLCA) {
            return root;
        }

        // If only one subtree returns a non-null value, return that
        // value
        if (leftLCA) {
            return leftLCA;
        }

        return rightLCA;
    }

    int findDepth(TreeNode *root, int val, int depth) {

        // Base case: if the root is null, return -1
        if (!root) {
            return -1;
        }

        // If the current node is the target node, return the depth
        if (root->val == val) {
            return depth;
        }

        int leftDepth = findDepth(root->left, val, depth + 1);

        // If leftDepth is not -1, the target node is in the left subtree
        if (leftDepth != -1) {
            return leftDepth;
        }

        // If leftDepth is -1, search in the right subtree
        return findDepth(root->right, val, depth + 1);
    }

    int distanceBetweenNodes(TreeNode *root, int valA, int valB) {

        // If the root is null, return -1
        if (!root) {
            return -1;
        }

        // Step 1: Find the LCA of valA and valB
        TreeNode *lca = lowestCommonAncestor(root, valA, valB);

        // If either node is missing, return -1
        if (!lca) {
            return -1;
        }

        // Step 2: Find the depths of valA, valB from LCA
        int depthA = findDepth(lca, valA, 0);
        int depthB = findDepth(lca, valB, 0);

        // Step 3: Compute the distance
        return depthA + depthB;
    }
};
```
