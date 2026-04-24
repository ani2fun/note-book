# Pattern: Simultaneous traversal

## Table of Contents

1. [Understanding the simultaneous traversal pattern](#understanding-the-simultaneous-traversal-pattern)
2. [Identifying the simultaneous traversal pattern](#identifying-the-simultaneous-traversal-pattern)
3. [Identical trees](#identical-trees)
4. [Symmetry detection](#symmetry-detection)
5. [Subtree detection](#subtree-detection)
6. [Merge trees](#merge-trees)

***

# Understanding the simultaneous traversal pattern

We traverse a binary tree to search for and perform operations on its nodes. However, there are cases where we may need to operate on nodes from two binary trees at once. This requires us to traverse both the binary trees simultaneously and apply some function `f` on corresponding nodes in both the trees. Both these trees may or may not have the same structure, and the decision to traverse further in any of them depends on the outcome of the function `f`. The simultaneous tree traversal technique can be used to traverse both the trees at once using a single recursive function.

The simultaneous traversal pattern is a classification of problems that can be solved using the simultaneous tree traversal technique.

// Diagram: The simultaneous traversal technique traverses two trees simultaneously.

## The simultaneous tree traversal technique

Consider we are given two binary trees that do not have the same structure and a function `f`. We need to apply the function `f` over corresponding nodes in both the tree and return the aggregated value of the results over another function `g`. If we put both the trees one over the other, the corresponding nodes are the ones which overlap. Since both trees can have different structures, the nodes that don't have a corresponding node should be ignored.

// Diagram: Find the aggregated value of function f over all corresponding nodes aggregated over function g

We can use the simultaneous tree traversal technique to solve the problem. We recursively traverse both the trees starting from their root nodes following a mix of preorder and postorder traversal, where we process a node twice, once when we enter it and again before we exit it and return a value back to the caller. From every pair of corresponding nodes, we return the aggregated value of the function `f` over all the corresponding nodes in its subtree aggregated over function `g`.

As we enter a pair of corresponding nodes, we check if both the nodes are `null`. If they both are `null`, it means we don't need to apply the function `f` and can simply return a default value. If only one node is `null` it means the other node and all nodes in its subtree do not have a corresponding node and should be ignored. So, we also return a default value in this case.

If both the nodes are not `null`, we apply the function `f` on both nodes and store the result in a local variable `result`. We then simultaneously continue the traversal to the left and right subtrees of both trees and store their return values in two variables `left` and `right`. Finally, we use the function `g` to aggregate all three values `result`, `left` and `right` and return it to the caller.

This way, at the end of traversal, the top-level recursive call for simultaneous traversal of both trees will return the value of the function `f` over all the corresponding nodes in both the trees aggregated over the function `g`.

// Diagram: Find the aggregated value of function f over all corresponding nodes aggregated over function g

## Algorithm

The generic algorithm given below uses a mix of preorder and postorder traversal to simultaneously traverse two trees, apply some function `f` on all corresponding nodes and return the aggregated value of results over a function `g`.

> **Algorithm**
>
> **simultaneousTraversal(nodeA, nodeB)**
>
> -   **Step 1:** If both \`nodeA\` and \`nodeB\` are \`null\`, return a default value
> -   **Step 2:** If any one of \`nodeA\` or \`nodeB\` is \`null\`, return a default value
> -   **Step 3:** \`result\` = \`f(nodeA, nodeB)\`
> -   **Step 4:** \`leftResult\` = Call \`simultaneousTraversal(nodeA.left, nodeB.left)\`
> -   **Step 5:** \`rightResult\` = Call \`simultaneousTraversal(nodeA.right, nodeB.right)\`
> -   **Step 5:** Return \`g(result, leftResult, rightResult)\`

## Implementation

The implementation of the simultaneous traversal technique is given below. The entire traversal is completely stateless, as every node has its own copy of local variables `result`, `leftResult` and `rightResult` that are unaffected by execution in other nodes.

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
    int simultaneousTraversal(TreeNode *nodeA, TreeNode *nodeB) {

        // If both trees are empty, return a default value
        if (!nodeA && !nodeB) {
            return 0; // Default value for this example
        }

        // If a node does not have a corresponding node, return a default value
        if (!nodeA || !nodeB) {
            return 0; // Default value for this example
        }

    // Apply the function f on corresponding nodes
    int result = f(nodeA->val, nodeB->val);

        // Recursively check that the left and right subtrees are identical
        int leftResult = simultaneousTraversal(nodeA->left, nodeB->left);
        bool rightReult = simultaneousTraversal(nodeA->right, nodeB->right);

        // Return the aggregated value of all results over function g
        return g(leftResult, rightReult, result)
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

// Diagram: public int simultaneousTraversal(TreeNode nodeA, TreeNode nodeB) {

        // If both trees are empty, return a default value
        if (nodeA == null && nodeB == null) {
            return 0; // Default value for this example
        }

        // If a node does not have a corresponding node, return a default value
        if (nodeA == null || nodeB == null) {
            return 0; // Default value for this example
        }

        // Apply the function f on corresponding nodes
        int result = f(nodeA.val, nodeB.val);

        // Recursively check that the left and right subtrees are identical
        int leftResult = simultaneousTraversal(nodeA.left, nodeB.left);
        int rightResult = simultaneousTraversal(nodeA.right, nodeB.right);

        // Return the aggregated value of all results over function g
        return g(leftResult, rightResult, result);
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
  simultaneousTraversal(nodeA: TreeNode | null, nodeB: TreeNode | null): number {
    // If both trees are empty, return a default value
    if (!nodeA && !nodeB) {
      return 0; // Default value for this example
    }

    // If a node does not have a corresponding node, return a default value
    if (!nodeA || !nodeB) {
      return 0; // Default value for this example
    }

    // Apply the function f on corresponding nodes
    let result = f(nodeA.val, nodeB.val);

    // Recursively check the left and right subtrees
    let leftResult = simultaneousTraversal(nodeA.left, nodeB.left);
    let rightResult = simultaneousTraversal(nodeA.right, nodeB.right);

    // Return the aggregated value of all results over function g
    return g(leftResult, rightResult, result);
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
  simultaneousTraversal(nodeA, nodeB) {
    // If both trees are empty, return a default value
    if (!nodeA && !nodeB) {
      return 0; // Default value for this example
    }

    // If a node does not have a corresponding node, return a default value
    if (!nodeA || !nodeB) {
      return 0; // Default value for this example
    }

    // Apply the function f on corresponding nodes
    let result = f(nodeA.val, nodeB.val);

    // Recursively check the left and right subtrees
    let leftResult = simultaneousTraversal(nodeA.left, nodeB.left);
    let rightResult = simultaneousTraversal(nodeA.right, nodeB.right);

    // Return the aggregated value of all results over function g
    return g(leftResult, rightResult, result);
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
    def simultaneousTraversal(self, nodeA: Optional[TreeNode], nodeB: Optional[TreeNode]) -> int:

        # If both trees are empty, return a default value
        if not nodeA and not nodeB:
            return 0  # Default value for this example

        # If a node does not have a corresponding node, return a default value
        if not nodeA or not nodeB:
            return 0  # Default value for this example

        # Apply the function f on corresponding nodes
        result: int = f(nodeA.val, nodeB.val)

        # Recursively check the left and right subtrees
        left_result: int = self.simultaneousTraversal(nodeA.left, nodeB.left)
        right_result: int = self.simultaneousTraversal(nodeA.right, nodeB.right)

        # Return the aggregated value of all results over function g
        return g(left_result, right_result, result)
```

## Complexity Analysis

It is quite easy to figure out the time and space complexity of the solution. We traverse all the nodes from both trees with a corresponding node. In the worst case, when both the trees completely overlap, meaning every node has a corresponding node, we have to traverse the entire tree, which takes linear **O(N)** time where **N** is the number of nodes in any one tree. In the best case, there may be no overlap except the root node, so all the nodes except the root node are skipped, leading to a constant **O(1)** time complexity.

The space complexity of the traversal depends on the maximum size of the function call stack, which can be linear **O(N)** if the trees completely overlap and are both degenerate trees. In the best case, where there is no overlap, only one stack frame for the root node is created, leading to a constant **O(1)** space complexity.

Each stack frame also creates its own copy of local variables, but each of them only makes a constant contribution to the size of the frame, so the overall space complexity is the same as the space required for the stack frames. 

> **Best Case:** No overlap between trees
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case:** Completely overlapping degenerate binary trees
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Identifying the simultaneous traversal pattern

The simultaneous traversal technique can only solve certain types of binary tree problems. These are generally easy or medium problems where we are given two binary trees and a function `f`, and we need to apply the function `f` over all the corresponding nodes in the two trees. The function `f` may also update the structure of the tree. Some problems may require further aggregating these values of another function `g`. The problem defines the definition of what constitutes corresponding nodes. Generally, two nodes in two trees are said to be corresponding nodes when they overlap if the trees are placed on top of each other.

If the problem statement or its solution follows the generic template below, it can be solved by applying the simultaneous traversal technique.

**Template:**

Given two binary trees, apply the function `f` on the corresponding nodes in the trees and aggregate the values over a function `g`.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the simultaneous traversal technique.

> **Problem statement:** Given two binary trees, find if they are identical and false otherwise. Two trees are identical if they are structurally identical and the corresponding nodes have the sam e values.

// Diagram: Find if two binary trees are identical

## The simultaneous tree traversal technique

The problem description fits the generic template from the simultaneous traversal pattern we learned earlier.

**Template:**

Given two binary trees, apply the function `f` (equality check) on the corresponding nodes in the trees and aggregate the values over a function `g` (logical AND of all inputs)

We recursively traverse both the trees starting from the root node following a mix of preorder and postorder traversal, where we process a node twice, once when we enter it and again before we exit it and return a value back to the caller From every pair of corresponding nodes, we return a boolean value indicating whether the subtree rooted at both nodes is identical or not.

As we enter a pair of corresponding nodes, we check if both the nodes are `null`. If they both are `null`, it means the subtree is structurally identical, so we return `true` to the caller. If only one node is `null` it means one corresponding node has a subtree and the other does not and so we return `false`. 

If both the nodes are not `null`, we check if the values of the corresponding nodes are the same; if they are not the same, we return `false`. On the other hand, if they are the same, we recursively traverse their left and right subtrees and store the return values in `leftIdentical` and `rightIdentical`. Finally, we return true back to the caller if both `leftIdentical` and `rightIdentical` are true. Otherwise, we return `false`.

This way, at the end of traversal, the top-level recursive call for simultaneous traversal of both trees will return a boolean value indicating if the trees are identical or not.

// Diagram: Find if two binary trees are identical

The implementation of the simultaneous traversal technique to solve the problem is given below.

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
    bool identicalTrees(TreeNode *rootA, TreeNode *rootB) {

        // If both trees are empty, they are identical
        if (!rootA && !rootB) {
            return true;
        }

        // If only one tree is empty, they are not identical
        if (!rootA || !rootB) {
            return false;
        }

        // If the values of the current nodes are different, they are not
        // identical
        if (rootA->val != rootB->val) {
            return false;
        }

        // Recursively check the left and right subtrees are identical
        bool leftSubtreesAreIdentical =
            identicalTrees(rootA->left, rootB->left);
        bool rightSubtreesAreIdentical =
            identicalTrees(rootA->right, rootB->right);

        // Return true if both subtrees are identical
        return leftSubtreesAreIdentical && rightSubtreesAreIdentical;
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
    public boolean identicalTrees(TreeNode rootA, TreeNode rootB) {

        // If both trees are empty, they are identical
        if (rootA == null && rootB == null) {
            return true;
        }

        // If only one tree is empty, they are not identical
        if (rootA == null || rootB == null) {
            return false;
        }

        // If the values of the current nodes are different, they are not
        // identical
        if (rootA.val != rootB.val) {
            return false;
        }

        // Recursively check the left and right subtrees are identical
        boolean leftSubtreesAreIdentical = identicalTrees(
            rootA.left,
            rootB.left
        );
        boolean rightSubtreesAreIdentical = identicalTrees(
            rootA.right,
            rootB.right
        );

        // Return true if both subtrees are identical
        return leftSubtreesAreIdentical && rightSubtreesAreIdentical;
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
    identicalTrees(
        rootA: TreeNode | null,
        rootB: TreeNode | null
    ): boolean {

        // If both trees are empty, they are identical
        if (!rootA && !rootB) {
            return true;
        }

        // If only one tree is empty, they are not identical
        if (!rootA || !rootB) {
            return false;
        }

        // If the values of the current nodes are different, they are not
        // identical
        if (rootA.val !== rootB.val) {
            return false;
        }

        // Recursively check the left and right subtrees are identical
        const leftSubtreesAreIdentical = this.identicalTrees(
            rootA.left,
            rootB.left
        );
        const rightSubtreesAreIdentical = this.identicalTrees(
            rootA.right,
            rootB.right
        );

        // Return true if both subtrees are identical
        return leftSubtreesAreIdentical && rightSubtreesAreIdentical;
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
    identicalTrees(rootA, rootB) {

        // If both trees are empty, they are identical
        if (!rootA && !rootB) {
            return true;
        }

        // If only one tree is empty, they are not identical
        if (!rootA || !rootB) {
            return false;
        }

        // If the values of the current nodes are different, they are not
        // identical
        if (rootA.val !== rootB.val) {
            return false;
        }

        // Recursively check the left and right subtrees are identical
        const leftSubtreesAreIdentical = this.identicalTrees(
            rootA.left,
            rootB.left
        );
        const rightSubtreesAreIdentical = this.identicalTrees(
            rootA.right,
            rootB.right
        );

        // Return true if both subtrees are identical
        return leftSubtreesAreIdentical && rightSubtreesAreIdentical;
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

// Diagram: from typing import Optional

class Solution:
    def identical_trees(
        self, root_a: Optional[TreeNode], root_b: Optional[TreeNode]
    ) -> bool:

        # If both trees are empty, they are identical
        if not root_a and not root_b:
            return True

        # If only one tree is empty, they are not identical
        if not root_a or not root_b:
            return False

        # If the values of the current nodes are different, they are not
        # identical
        if root_a.val != root_b.val:
            return False

        # Recursively check if the left and right subtrees are identical
        left_subtrees_are_identical = self.identical_trees(
            root_a.left, root_b.left
        )
        right_subtrees_are_identical = self.identical_trees(
            root_a.right, root_b.right
        )

        # Return True if both subtrees are identical
        return (
            left_subtrees_are_identical and right_subtrees_are_identical
        )
```

The simultaneous traversal can solve this problem in linear time and a single pass using a very small and concise recursive implementation.

## Example problems

Most problems that fall under this category are**easy**problems; a list of a few is given below.

> -   **[Identical trees](https://www.codeintuition.io/courses/binary-tree/QNPqJOr1KU4-t6EJxOjT4)**
> -   **[Symmetry detection](https://www.codeintuition.io/courses/binary-tree/jPieNCJZxekDUAyzuXacr)**
> -   **[Subtree detection](https://www.codeintuition.io/courses/binary-tree/73TW763zTrxFxMOk10yDE)**
> -   **[Merge trees](https://www.codeintuition.io/courses/binary-tree/07Wsv3tNRWlOIn42f_lub)**

We will now solve these problems to understand the simultaneous traversal technique better.

***

# Identical trees

## Problem Statement

Given the **roots** of two binary trees, **rootA** and **rootB**, write a function that returns `true` if they are identical and `false` otherwise. 

Two trees are considered identical if they are structurally identical, and the corresponding nodes have the same value.

### Example 1

> -   **Input:** rootA = \[1, 2, 3, 4, null, null, 7\], rootB = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** true
> -   **Explanation:** The two trees are identical.

### Example 2

> -   **Input:** rootA = \[1, 8, 4, null, null, 2, 7\], rootB = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** false
> -   **Explanation:** The two trees are not the identical.

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
    bool identicalTrees(TreeNode *rootA, TreeNode *rootB) {

        // If both trees are empty, they are identical
        if (!rootA && !rootB) {
            return true;
        }

        // If only one tree is empty, they are not identical
        if (!rootA || !rootB) {
            return false;
        }

        // If the values of the current nodes are different, they are not
        // identical
        if (rootA->val != rootB->val) {
            return false;
        }

        // Recursively check the left and right subtrees are identical
        bool leftSubtreesAreIdentical =
            identicalTrees(rootA->left, rootB->left);
        bool rightSubtreesAreIdentical =
            identicalTrees(rootA->right, rootB->right);

        // Return true if both subtrees are identical
        return leftSubtreesAreIdentical && rightSubtreesAreIdentical;
    }
};
```

***

# Symmetry detection

## Problem Statement

Given the **root** of a binary tree, write a function that returns `true` if it is a symmetric tree and `false` otherwise.

A tree is symmetric if it is a mirror image of itself.

### Example 1

> -   **Input:** root = \[1, 2, 2, 4, null, null, 4\]
> -   **Output:** true
> -   **Explanation:** The tree is a symmetric tree as per the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\]
> -   **Output:** false
> -   **Explanation:** The tree is not a symmetric tree as per the diagram above.

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
    bool isMirror(TreeNode *left, TreeNode *right) {

        // If both trees are empty, they are considered mirror images
        if (!left && !right) {
            return true;
        }

        // If only one tree is empty, they are not mirror images
        if (!left || !right) {
            return false;
        }

        // If the values of the current nodes are different, they are not
        // mirror images
        if (left->val != right->val) {
            return false;
        }

        // Recursively check if the left subtree of the left tree is the
        // mirror image of the right subtree of the right tree and vice
        // versa
        bool leftAndRightSubtreeAreMirrors =
            isMirror(left->left, right->right);
        bool rightAndLeftSubtreeAreMirrors =
            isMirror(left->right, right->left);

        // Return true if both subtrees are mirror images
        return leftAndRightSubtreeAreMirrors &&
               rightAndLeftSubtreeAreMirrors;
    }

    bool symmetryDetection(TreeNode *root) {

        // If the tree is empty, it is considered symmetric
        if (root == nullptr) {
            return true;
        }

        // Check if the left and right subtrees are mirror images
        return isMirror(root->left, root->right);
    }
};
```

***

# Subtree detection

## Problem Statement

Given the **roots** of two binary trees, **rootA** and **rootB**, write a function that returns `true` if the second tree is a subtree of the first one and `false` otherwise.

### Example 1

> -   **Input:** rootA = \[1, 8, 5, 4, 2, 3, 9\], rootB = \[5, 3, 9\]
> -   **Output:** true
> -   **Explanation:** The second tree is a subtree of the first one, as per the diagram above.

### Example 2

> -   **Input:** rootA = \[1, 8, 4, null, null, 2, 7\], rootB = \[1, 8, 4\]
> -   **Output:** false
> -   **Explanation:** The second tree is not a subtree of the first one, as per the diagram above.

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
    bool identicalTrees(TreeNode *rootA, TreeNode *rootB) {

        // If both trees are empty, they are identical
        if (!rootA && !rootB) {
            return true;
        }

        // If only one tree is empty, they are not identical
        if (!rootA || !rootB) {
            return false;
        }

        // If the values of the current nodes are different, they are not
        // identical
        if (rootA->val != rootB->val) {
            return false;
        }

        // Recursively check the left and right subtrees are identical
        bool leftSubtreesAreIdentical =
            identicalTrees(rootA->left, rootB->left);
        bool rightSubtreesAreIdentical =
            identicalTrees(rootA->right, rootB->right);

        // Return true if both subtrees are identical
        return leftSubtreesAreIdentical && rightSubtreesAreIdentical;
    }

    bool subtreeDetection(TreeNode *rootA, TreeNode *rootB) {

        // If the main tree is empty, rootB cannot be a subtree
        if (!rootA) {
            return false;
        }

        // If the trees are identical, rootB is a subtree
        if (identicalTrees(rootA, rootB)) {
            return true;
        }

        // Recursively check if rootB is a subtree of the left or right
        // subtree
        bool isASubtreeOfLeftSubtree =
            subtreeDetection(rootA->left, rootB);
        bool isASubtreeOfRightSubtree =
            subtreeDetection(rootA->right, rootB);

        // Return true if rootB is a subtree of the left or right subtree
        return isASubtreeOfLeftSubtree || isASubtreeOfRightSubtree;
    }
};
```

***

# Merge trees

## Problem Statement

Given the **roots** of two binary trees, **rootA** and **rootB**, write a function that merges the two trees and returns the root of the new tree. To imagine this, suppose you have two binary trees, and when you overlay one of them onto the other, some nodes of both trees overlap while others do not. Using the rules below, you must merge the two trees into a new binary tree.

> -   If two nodes overlap in the two given trees, then add their values to form a new value for the merged node.
> -   If one node is not null and the other is null, the non-null node will be considered a node of the new tree.

### Example 1

> -   **Input:** rootA = \[1, 2, 3, 4, null, 5, 6\], rootB = \[7, 8, 9, 10, 11, null, 12\]
> -   **Output:** \[8, 10, 12, 14, 11, 5, 18\]
> -   **Explanation:** Following the merging rules, we will get a merged tree, as shown in the diagram.

### Example 2

> -   **Input:** rootA = \[1, 8, 4, null, null, 2, 7\], rootB = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** \[2, 10, 7, 4, null, 2, 14\]
> -   **Explanation:** Following the merging rules, we will get a merged tree, as shown in the diagram.

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
    TreeNode *mergeTrees(TreeNode *rootA, TreeNode *rootB) {

        // If either of the trees is nullptr, return the other tree
        if (!rootA) {
            return rootB;
        }

        if (!rootB) {
            return rootA;
        }

        // Create a new node with the sum of values from rootA and rootB
        TreeNode *mergedNode = new TreeNode(rootA->val + rootB->val);

        // Recursively merge the left subtrees of rootA and rootB
        mergedNode->left = mergeTrees(rootA->left, rootB->left);

        // Recursively merge the right subtrees of rootA and rootB
        mergedNode->right = mergeTrees(rootA->right, rootB->right);

        // Return the merged tree
        return mergedNode;
    }
};
```

***

# Merge trees
