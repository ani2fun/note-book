# Pattern: Root to leaf path (Stateless)

## Table of Contents

1. [Understanding the stateless root to leaf path pattern](#understanding-the-stateless-root-to-leaf-path-pattern)
2. [Identifying the stateless root to leaf path pattern](#identifying-the-stateless-root-to-leaf-path-pattern)
3. [Root to leaf path](#root-to-leaf-path)
4. [Binary summation of tree](#binary-summation-of-tree)
5. [Even path](#even-path)
6. [Odd count](#odd-count)

***

# Understanding the stateless root to leaf path pattern

A root-to-leaf path in a binary tree is a path made up of nodes starting from the root node and ending at a leaf node, and there are as many root-to-leaf paths in a binary tree as there are leaves. Many binary tree problems require us to find, for all root-to-leaf paths, the aggregated value of a function `f` over some or all nodes in a root-to-leaf path. Some problems go even further to find the aggregated value of some other function `g` over all aggregated values of all the root-to-leaf paths and return a single result.

There are two ways to solve this problem: one requires some shared state to be maintained, while the other is completely stateless. The choice between these options depends on the function `f`and`g`and the complexity of the problem. Depending on the functions `f`and`g`, the problem can be solved using the stateless root-to-leaf path technique.

The stateless root-to-leaf path pattern is a classification of problems that can be solved using the stateless root-to-leaf path technique to find aggregated values over all root-to-leaf paths in a binary tree.

// Diagram: All the root-to-leaf paths of a binary tree.

In this lesson, we will learn more about using the stateless root-to-leaf path technique to solve binary tree problems and how to identify a problem as a root-to-leaf path pattern problem.

## The stateless root to leaf path technique

Consider we are given a binary tree, and we need to find, for each root-to-leaf path, the aggregated value of a function `f` over all nodes in a root-to-leaf path. Once we get the results for all root-to-leaf paths, we need to apply some other function `g` to aggregate values for every path further into a single value.

// Diagram: Aggregate the value of function f over all root-to-leaf paths and further aggregate the root-to-leaf path aggregates over a function g.

The stateless solution to the problem uses a mix of preorder and postorder traversal where the function `f` is incrementally aggregated over a path by passing the incremental aggregates down the tree, and the aggregated value of a path over function `g` is passed up from the leaf nodes, and every other node combines the aggregates for both its subtrees before passing it back.

// Diagram: Aggregate function f by passing incremental results down to leaves and aggregate root-to-leaf paths by passing results up from leaves

We perform the preorder traversal and pass a variable `pathAggregate` down to every node, starting with a default value for the root node. We then apply the function `f` to add the contribution of the current node to `pathAggregate` and pass this updated value further down in the preorder traversal. And so, for a node, the variable `pathAggregate` denotes the aggregated value of the function `f` over all the nodes in the path traversed so far (root to the current node). On reaching a leaf node, the `pathAggregate` now holds the aggregated value of `f` over the root-to-leaf path to this leaf.

// Diagram: The aggregate of a root-to-leaf path over function f is finally computed at the leaf nodes.

In every leaf node, the value of `pathAggregate` is aggregated using the function `g` with a default value if needed and passed back **up** to the parent node. In case we hit a `null` reference, we return a default value.

The parent node receives these values from both its left and right subtrees which are stored in local variables `left` and `right` respectively. These variables denote the aggregated value of function g over all root-to-leaf paths passing through the left and right subtrees, respectively. The parent node aggregates them using the function `g` before passing it back up to its parent. This way, every node returns to its parent the aggregated value of the function `g` over the aggregates of all root-to-leaf paths passing through them.

// Diagram: All the root-to-leaf path aggregates are passed up from the leaves and aggregated on the way.

And so, at the end of the traversal, the value returned from the root node is the aggregated value of the function `g` over the aggregates (using the function `f`) of all root-to-leaf paths.

It is important to note that we pass the aggregated value of the function `f` **down** the tree and the aggregated value of the function `g` **up** the tree. This way, both these values are local to every stack frame, and we don't need to keep any global or shared variables.

// Diagram: Aggregate function f over all root to leaf paths and return aggregated value over function g

## Algorithm

The generic algorithm for stateless execution of the root-to-leaf path technique is given below. It applies a function `f` on nodes of all the root-to-leaf paths of a binary tree and then applies a function `g` over all the aggregated values to return a single result. Note that the preorder function is created separately so that the initial value of aggregate can be passed to it. The final result is returned from the the preorder function when the execution ends.

> **Algorithm**
>
> -   **Step 1:** Return \`rootToLeafPath(root, defaultValue)\`
>
> **rootToLeafPath(node, pathAggregate)**
>
> -   **Step 1:** If \`node\` is a \`null\` node, return \`defaultValue\`
> -   **Step 2:** Add contribution of \`node\` to \`pathAggregate\` using function \`f \`
> -   **Step 3:** If \`node\` is a leaf node, return the output of \`g(pathAggregate, default)\`
> -   **Step 4:** Calculate \`left\` = \`rootToLeafPath(node.left, pathAggregate)\`
> -   **Step 5:** Calculate \`right\` = \`rootToLeafPath(node.right, pathAggregate)\`
> -   **Step 6:** Return the output of \`g(left, right)\`

## Implementation

The generic implementation of the stateless execution is given below. The preorder function is separate from the calling function as we need to pass an initial value of aggregate to the preorder function which may be different for each problem.

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
     int rootToLeafPath(TreeNode *node, int pathAggregate) {
         if (!node) {
            // Return a default value if this is a null node
            return 0;
         }

         // Add contribution of the current node to the pathAggregate
         // using the funciton f
         pathAggregate = f(pathAggregate, node->val);

         // If it's a leaf node, pathAggregate is the aggregated value
         // of function f over a root-to-leaf path
         if (!node->left && !node->right) {
              // Return the aggregated value of pathAggregate
              // over function g with a default value dictated by the
              // problem
              return g(pathAggregate, 0);
         }

         // Pass the updated pathAggregate to recursively find the
         // aggregated value of all root-to-leaf path aggregates passing
         // through the left and right subtrees
         int left = rootToLeafPath(node->left, pathAggregate);
         int right = rootToLeafPath(node->right, pathAggregate);

         // Aggregate the left and right aggregates using function g
         // This is the aggregated value of all root-to-leaf path aggregates
         // passing through this node
         return g(leftSum, rightSum);
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
    public int rootToLeafPath(TreeNode node, int pathAggregate) {
        if (node == null) {
            // Return a default value if this is a null node
            return 0;
        }

        // Add contribution of the current node to the pathAggregate
        // using the function f
        pathAggregate = f(pathAggregate, node.val);

        // If it's a leaf node, pathAggregate is the aggregated value
        // of function f over a root-to-leaf path
        if (node.left == null && node.right == null) {
            // Return the aggregated value of pathAggregate
            // over function g with a default value dictated by the problem
            return g(pathAggregate, 0);
        }

        // Pass the updated pathAggregate to recursively find the
        // aggregated value of all root-to-leaf path aggregates passing
        // through the left and right subtrees
        int leftSum = rootToLeafPath(node.left, pathAggregate);
        int rightSum = rootToLeafPath(node.right, pathAggregate);

        // Aggregate the left and right aggregates using function g
        // This is the aggregated value of all root-to-leaf path aggregates
        // passing through this node
        return g(leftSum, rightSum);
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
  rootToLeafPath(node: TreeNode | null, pathAggregate: number): number {
    if (!node) {
      // Return a default value if this is a null node
      return 0;
    }

    // Add contribution of the current node to the pathAggregate
    // using the function f
    pathAggregate = f(pathAggregate, node.val);

    // If it's a leaf node, pathAggregate is the aggregated value
    // of function f over a root-to-leaf path
    if (!node.left && !node.right) {
      // Return the aggregated value of pathAggregate
      // over function g with a default value dictated by the problem
      return g(pathAggregate, 0);
    }

    // Pass the updated pathAggregate to recursively find the
    // aggregated value of all root-to-leaf path aggregates passing
    // through the left and right subtrees
    let leftSum = this.rootToLeafPath(node.left, pathAggregate);
    let rightSum = this.rootToLeafPath(node.right, pathAggregate);

    // Aggregate the left and right aggregates using function g
    // This is the aggregated value of all root-to-leaf path aggregates
    // passing through this node
    return g(leftSum, rightSum);
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
  rootToLeafPath(node, pathAggregate) {
    if (!node) {
      // Return a default value if this is a null node
      return 0;
    }

    // Add contribution of the current node to the pathAggregate
    // using the function f
    pathAggregate = f(pathAggregate, node.val);

    // If it's a leaf node, pathAggregate is the aggregated value
    // of function f over a root-to-leaf path
    if (!node.left && !node.right) {
      // Return the aggregated value of pathAggregate
      // over function g with a default value dictated by the problem
      return g(pathAggregate, 0);
    }

    // Pass the updated pathAggregate to recursively find the
    // aggregated value of all root-to-leaf path aggregates passing
    // through the left and right subtrees
    let leftSum = this.rootToLeafPath(node.left, pathAggregate);
    let rightSum = this.rootToLeafPath(node.right, pathAggregate);

    // Aggregate the left and right aggregates using function g
    // This is the aggregated value of all root-to-leaf path aggregates
    // passing through this node
    return g(leftSum, rightSum);
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
    def root_to_leaf_path(self, node: Optional[TreeNode], path_aggregate: int) -> int:
        if not node:
            # Return a default value if this is a null node
            return 0

        # Add contribution of the current node to path_aggregate using function f
        path_aggregate = f(path_aggregate, node.val)

        # If it's a leaf node, path_aggregate is the aggregated value
        # of function f over a root-to-leaf path
        if not node.left and not node.right:
            # Return the aggregated value of path_aggregate over function g
            # with a default value dictated by the problem
            return g(path_aggregate, 0)

        # Pass the updated path_aggregate to recursively find the
        # aggregated value of all root-to-leaf path aggregates passing
        # through the left and right subtrees
        left_sum: int = self.root_to_leaf_path(node.left, path_aggregate)
        right_sum: int = self.root_to_leaf_path(node.right, path_aggregate)

        # Aggregate the left and right aggregates using function g
        # This is the aggregated value of all root-to-leaf path aggregates
        # passing through this node
        return g(left_sum, right_sum)
```

## Complexity Analysis

For the stateless execution, we traverse the entire tree using the preorder traversal that takes linear **O(N)** time. We apply the function `f` on entering any node and the function `g` on hitting a leaf node. And so, the overall time complexity depends on the `f`, number of leaf node and function `g`. Considering applying the function `f` and `g` are constant time **O(1)** operations, the overall time complexity is linear **O(N)** in any case.

The space complexity of preorder traversal depends on the maximum size of the function call stack, which can be linear **O(N)** if the tree is a degenerate tree where every node only has one child and **O(log(N))** if it is a complete binary tree. However, we also create extra stack variables like `pathAggregate` ,  `left`, `right` and the return value for each node. Since every stack frame only has a constant number of extra variables, the preorder traversal still dictates the space complexity.

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

# Identifying the stateless root to leaf path pattern

The stateless root-to-leaf path technique can only solve a certain type of binary tree problem. These are generally**easy** or **medium**problems where we need to find the aggregated value of a function `f` over all nodes in every root-to-leaf path. For most problems, we need to further aggregate these aggregated values over another function `g`.

The stateless solution works by incrementally aggregating values over function `f` by passing the aggregated value of a path down from the parent to child nodes, computing the root-to-leaf aggregate on reaching a leaf node, and returning and merging all root-to-leaf path aggregates using the function `g` on the way up.

If the problem statement or its solution follows the generic template below, it can be solved by applying the stateless root-to-leaf path technique.

**Template:**Given a binary tree, find the aggregated value of a function `f` over all root-to-leaf paths and further aggregate these aggregated values over a function `g`.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the stateless root-to-leaf path technique.

> **Problem statement:** Given a binary tree and a target, find if there is any root-to-leaf path for which the sum of nodes in the path is equal to the target.

// Diagram: Find if the tree has any root-to-leaf path with sum 9

## The stateless root-to-leaf path technique

The problem description fits the generic template from the stateless root-to-leaf path pattern we learned earlier.

**Template:**

Given a binary tree, find the aggregated value of function `f` (sum) over all root-to-leaf paths and further aggregate these aggregated values over a function `g` (Does sum equals target?).

We do a preorder traversal starting from the root node and pass a value `pathSum` (0 for the root node) to every node that denotes the sum of all nodes in the path from the root node to the current node. Every node can add its value to the `pathSum` it receives from its parent and pass it down to its children. This way, on reaching the leaf node`pathSum` will be the sum of all nodes in the root-to-leaf path to the current leaf. However, to verify if it is equal to `target` or not, we also need to pass the `target` down along with the `pathSum`.

// Diagram: Pass pathSum and target down from every node and compare pathSum to target at the leaf node.

While this is correct, in this solution, we must pass down two variables from every node. We can simplify this further by passing down the **target value remaining** instead of the sum of all nodes in the path from the root node to the parent node. We start from the root node with`target`, and as we enter a node, we subtract the node's value from `target` received from the parent and pass down the updated value to the child node. Since `target` is a local variable, every node has its own copy of `target` which is unaffected by the values in other nodes. This way, on reaching a leaf node, we only need to check if `target` is equal to the value of the leaf node or not to verify if the sum of all nodes in the root-to-leaf path to this leaf is equal to the `target` passed to the root node or not.

// Diagram: Pass the target remaining down from every node and check if it is equal to the value of the leaf node on reaching it

On reaching a leaf node, if `target` equals the value of the leaf node, it means the sum of all nodes in the root-to-leaf path to the current leaf is equal to the `target` passed to the root node. We return `true` back to the parent node in this case; otherwise, we return `false`. The parent node gets these values from both the left and right subtrees and stores them in local variables `leftPathExists` and `rightPathExists` which denotes if a root-to-leaf path with sum equal to `target` passed to the root node exists in the left and right subtrees.

If any of `leftPathExists` or `rightPathExists` is true, it means there is a root-to-leaf path going through the current node where the sum of all nodes is equal to `target` passed to the root node, and so we return `true` back to its parent; otherwise, we return `false`.

This way, at the end of the traversal, the root node returns either `true` or `false` denoting the existence of a root-to-leaf path where the sum of all nodes is equal to `target`.

// Diagram: Find if the tree has any root to leaf path with sum 9

The implementation of the stateless root-to-leaf path technique to solve the problem is given below.

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
    bool rootToLeafPath(TreeNode *root, int target) {

        // If the root is null, there is no path, so return false
        if (!root) {
            return false;
        }

        // If it's a leaf node, check if the current sum equals the
        // target sum
        if (!root->left && !root->right) {
            return root->val == target;
        }

        // Otherwise, subtract the current node's value from target and
        // continue DFS on left and right subtrees
        target -= root->val;

        // Check if there is a path with the remaining sum in the left or
        // right subtree
        bool leftPathExists = rootToLeafPath(root->left, target);
        bool rightPathExists = rootToLeafPath(root->right, target);

        return leftPathExists || rightPathExists;
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
    public boolean rootToLeafPath(TreeNode root, int target) {

        // If the root is null, there is no path, so return false
        if (root == null) {
            return false;
        }

        // If it's a leaf node, check if the current sum equals the
        // target sum
        if (root.left == null && root.right == null) {
            return root.val == target;
        }

        // Otherwise, subtract the current node's value from target and
        // continue DFS on left and right subtrees
        target -= root.val;

        // Check if there is a path with the remaining sum in the left or
        // right subtree
        boolean leftPathExists = rootToLeafPath(root.left, target);
        boolean rightPathExists = rootToLeafPath(root.right, target);

        return leftPathExists || rightPathExists;
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
    rootToLeafPath(root: TreeNode | null, target: number): boolean {

        // If the root is null, there is no path, so return false
        if (root === null) {
            return false;
        }

        // If it's a leaf node, check if the current sum equals the
        // target sum
        if (root.left === null && root.right === null) {
            return root.val === target;
        }

        // Otherwise, subtract the current node's value from target and
        // continue DFS on left and right subtrees
        target -= root.val;

        // Check if there is a path with the remaining sum in the left or
        // right subtree
        const leftPathExists = this.rootToLeafPath(root.left, target);
        const rightPathExists = this.rootToLeafPath(root.right, target);

        return leftPathExists || rightPathExists;
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
    rootToLeafPath(root, target) {

        // If the root is null, there is no path, so return false
        if (root === null) {
            return false;
        }

        // If it's a leaf node, check if the current sum equals the
        // target sum
        if (root.left === null && root.right === null) {
            return root.val === target;
        }

        // Otherwise, subtract the current node's value from target and
        // continue DFS on left and right subtrees
        target -= root.val;

        // Check if there is a path with the remaining sum in the left or
        // right subtree
        const leftPathExists = this.rootToLeafPath(root.left, target);
        const rightPathExists = this.rootToLeafPath(root.right, target);

        return leftPathExists || rightPathExists;
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
    def root_to_leaf_path(
        self, root: Optional[TreeNode], target: int
    ) -> bool:

        # If the root is null, there is no path, so return false
        if root is None:
            return False

        # If it's a leaf node, check if the current sum equals the target
        # sum
        if root.left is None and root.right is None:
            return root.val == target

        # Otherwise, subtract the current node's value from target and
        # continue DFS on left and right subtrees
        target -= root.val

        # Check if there is a path with the remaining sum in the left or
        # right subtree
        left_path_exists = self.root_to_leaf_path(root.left, target)
        right_path_exists = self.root_to_leaf_path(root.right, target)

        return left_path_exists or right_path_exists
```

The stateless root-to-leaf path technique can solve this problem in linear time and a single pass using a very small and concise recursive implementation.

## Example problems

Most problems that fall under this category are**easy**problems; a list of a few is given below.

> -   **[Root to leaf path](https://www.codeintuition.io/courses/binary-tree/IckowtD69rO9P0aniL50f)**
> -   **[Binary summation of tree](https://www.codeintuition.io/courses/binary-tree/nwe92HqLC7bef7PxDTfY-)**
> -   **[Even path](https://www.codeintuition.io/courses/binary-tree/ogd3wlw28tBX5upbj1IeS)**
> -   **[Odd count](https://www.codeintuition.io/courses/binary-tree/3sqCjRSiKeubpwhkDULom)**

We will now solve these problems to understand the stateless root-to-leaf path technique better.

***

# Root to leaf path

## Problem Statement

Given the **root** of a binary tree and a **target**, write a function that returns `true` if there exists at least one root-to-leaf path for which the sum of nodes in the path is equal to the target. Otherwise, return `false`.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\], target = 11
> -   **Output:** true
> -   **Explanation:** The given tree has a root-to-leaf path with sum = 11 as shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\], target = 20
> -   **Output:** false
> -   **Explanation:** The given tree does not have any root-to-leaf path with sum = 20 as shown in the diagram above.

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
    bool rootToLeafPath(TreeNode *root, int target) {

        // If the root is null, there is no path, so return false
        if (!root) {
            return false;
        }

        // If it's a leaf node, check if the current sum equals the
        // target sum
        if (!root->left && !root->right) {
            return root->val == target;
        }

        // Otherwise, subtract the current node's value from target and
        // continue DFS on left and right subtrees
        target -= root->val;

        // Check if there is a path with the remaining sum in the left or
        // right subtree
        bool leftPathExists = rootToLeafPath(root->left, target);
        bool rightPathExists = rootToLeafPath(root->right, target);

        return leftPathExists || rightPathExists;
    }
};
```

***

# Binary summation of tree

## Problem Statement

Given the **root** of a binary tree where the value of each node is either `0` or `1`. Each root-to-leaf path represents a binary number starting with the most significant bit. Write a function to calculate and return the sum of all the numbers formed after converting the root-to-leaf paths to decimal numbers.

### Example 1

> -   **Input:** root = \[1, 0, 1, 1, null, null, 1\]
> -   **Output:** 12
> -   **Explanation:** The sum of the two root-to-leaf paths is 5(101) + 7(111) = 12.

### Example 2

> -   **Input:** root = \[0, 1, 0, null, null, 1, 0\]
> -   **Output:** 2
> -   **Explanation:** The sum of the three root-to-leaf paths is 1(01) + 1(001) + 0(000) = 2.

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
    int binarySummationOfTreeHelper(TreeNode *root, int currentSum) {
        if (!root) {
            return 0;
        }

        // Update the current sum by shifting left and adding current
        // node's value
        currentSum = (currentSum << 1) | root->val;

        // If it's a leaf node, return the current sum
        if (!root->left && !root->right) {
            return currentSum;
        }

        // Recursively sum up the left and right subtrees
        int leftSum =
            binarySummationOfTreeHelper(root->left, currentSum);
        int rightSum =
            binarySummationOfTreeHelper(root->right, currentSum);

        // Return the total sum from both left and right subtrees
        return leftSum + rightSum;
    }

    int binarySummationOfTree(TreeNode *root) {

        // Start binarySummationOfTreeHelper with currentSum = 0
        return binarySummationOfTreeHelper(root, 0);
    }
};
```

***

# Even path

## Problem Statement

Given the **root** of a binary tree, write a function that returns `true` if there exists at least one root-to-leaf path in which all node values are even. Otherwise, return `false`.

### Example 1

> -   **Input:** root = \[2, 4, 6, 8, null, null, 9\]
> -   **Output:** true
> -   **Explanation:** The given tree has a root-to-leaf path where all node values are even, as shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\]
> -   **Output:** false
> -   **Explanation:** The given tree has no root-to-leaf path where all node values are even.

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
    bool evenPathHelper(TreeNode *root, int evenSoFar) {

        // Base case: if the current node is null, return false
        if (!root) {
            return false;
        }

        // Update current path status: 1 if path so far is all even and
        // current node is even
        int currentStatus = evenSoFar && (root->val % 2 == 0);

        // If this is a leaf, check if current path is valid
        if (!root->left && !root->right) {
            return currentStatus == 1;
        }

        // Check left and right subtrees for valid paths
        bool leftPath = evenPathHelper(root->left, currentStatus);
        bool rightPath = evenPathHelper(root->right, currentStatus);

        return leftPath || rightPath;
    }

    bool evenPath(TreeNode *root) {
        if (!root) {
            return false;
        }

        // Root path is valid if root is even
        return evenPathHelper(root, 1);
    }
};
```

***

# Even path

***

# Odd count

## Problem Statement

Given the **root** of a binary tree, write a function to find and return the number of root-to-leaf paths that have an odd number of nodes in the path.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** 2
> -   **Explanation:** There are two root-to-leaf paths with an odd number of nodes, as shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\]
> -   **Output:** 2
> -   **Explanation:** There are two root-to-leaf paths with an odd number of nodes, as shown in the diagram above.

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
    int oddCountHelper(TreeNode *root, int pathLen) {

        // Base case: if the current node is null, return 0
        if (!root) {
            return 0;
        }

        // Include current node in path length
        pathLen++;

        // If this is a leaf, check if path length is odd
        if (!root->left && !root->right) {

            // Return 1 if path length is odd
            if (pathLen % 2 == 1) {
                return 1;
            }

            // Return 0 if path length is even
            else {
                return 0;
            }
        }

        // Recurse separately into left and right subtrees
        int leftCount = oddCountHelper(root->left, pathLen);
        int rightCount = oddCountHelper(root->right, pathLen);

        // Return total count of odd-length paths from both subtrees
        return leftCount + rightCount;
    }

    int oddCount(TreeNode *root) {

        // Start oddCountHelper with pathLen = 0
        return oddCountHelper(root, 0);
    }
};
```

***

# Odd count
