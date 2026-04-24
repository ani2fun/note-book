# Pattern: Root to leaf path (Stateful)

## Table of Contents

1. [Understanding the stateful root to leaf path pattern](#understanding-the-stateful-root-to-leaf-path-pattern)
2. [Identifying the stateful root to leaf path pattern](#identifying-the-stateful-root-to-leaf-path-pattern)
3. [Root to leaf paths](#root-to-leaf-paths)
4. [Equal paths](#equal-paths)
5. [Duplicate paths](#duplicate-paths)
6. [Prefix paths](#prefix-paths)

***

# Understanding the stateful root to leaf path pattern

Many binary tree problems require us to find, for all root-to-leaf paths, the aggregated value of a function `f` over some or all nodes in a root-to-leaf path with some problems going even further to find the aggregated value of some other function `g` over all root-to-leaf path aggregates and return a single result. We learned the stateless solution to this problem that doesn't require creating shared variables that all nodes can access during the recursive execution. While the stateless solution can solve many such problems, some problems are easier to solve using the stateful solution.

The stateful root-to-leaf path pattern is a classification of problems that can be solved using the stateful root-to-leaf path technique to find aggregated values over all root-to-leaf paths in a binary tree.

// Diagram: All the root-to-leaf paths of a binary tree.

In this lesson, we will learn more about using the stateful root-to-leaf path technique to solve binary tree problems and how to identify a problem as a root-to-leaf path pattern problem.

## The stateful root to leaf path technique

Consider we are given a binary tree, and we need to find, for each root-to-leaf path, the aggregated value of a function `f` over all nodes in a root-to-leaf path. Once we get the results for all root-to-leaf paths, we need to apply some other function `g` to aggregate values for every path further into a single value.

// Diagram: Aggregate the value of function f over all root-to-leaf paths and further aggregate the root-to-leaf path aggregates over a function g.

The stateful solution to the problem is quite intuitive and easy to understand as it only uses the basic preorder traversal.

We create two variables `pathAggregate` and `aggregate` where `pathAggregate` holds the aggregated value of the function `f` over all the nodes for a **single** root-to-leaf path and `aggregate` holds the aggregated value of the function `g` over the aggregates of all root-to-leaf paths. We initialize these variables with default values, and since both these variables must be shared between all nodes as we traverse the tree, we can either create them as global variables or pass them by reference to the preorder function call.

The idea is quite simple: we do a preorder traversal and use the function `f` to add the contribution of the current node to `pathAggregate` as we enter it and remove its contribution from `pathAggregate` as we exit. This way, when doing a preorder traversal, `pathAggregate` always holds the aggregated value of the function `f` over all nodes in the path from the root to the current node. So, when hitting a leaf node, `pathAggregate` has the aggregated value of `f` over all nodes in the root-to-leaf path for the current leaf.

On hitting a leaf node, we use the function `g` to add the contribution of `pathAggregate` (that has aggregated value for a root-to-leaf path) to `aggregate`. This way, at the end of the preorder traversal, `pathAggregate` would have had the aggregated value of `f` over all the root-to-leaf paths in it once, and `aggregate` will have the aggregated values of the function `g` over all those aggregates.

It is important to note that the same copy of both the variables `pathAggregate` and `aggregate` must be shared between all nodes, so they should either be created as global variables or passed by reference from the caller. 

// Diagram: Aggregate function f over all root to leaf paths and return aggregated value over function g

## Algorithm

The generic algorithm for stateful execution of the root-to-leaf path technique is given below. It applies a function `f` on nodes of all the root-to-leaf paths of a binary tree and then applies a function `g` over all the aggregated values to return a single result. Note that the preorder function is created separately so that the shared values can be created in the calling function and passed to preorder by reference.

> **Algorithm**
>
> -   **Step 1:** Create a variable \`pathAggregate\` and initialize it with a default value to aggregate the output of function \`f\` over a root-to-leaf path.
> -   **Step 2:** Create a variable \`aggregate\` and initialize it with a default value to aggregate the output of function \`g\` over aggregates of all root-to-leaf paths.
> -   **Step 2:** Call \`preorder(root, pathAggregate, aggregate)\` passing \`pathAggregate\` and \`aggregate\` as reference.
> -   **Step 3:** Return \`aggregate\`
>
> **preorder(node, \[ref\] pathAggregate, \[ref\] aggregate)**
>
> -   **Step 1:** If \`node\` is a \`null\` node return
> -   **Step 2:** Add contribution of \`node\` to \`pathAggregate\` using function \`f \`
> -   **Step 3:** If \`node\` is a leaf node:
>     -   **Step 3.1:** Add contribution of \`pathAggregate\` to \`aggregate\` using function \`g\`
>     -   **Step 3.2:** Remove the contribution of \`node\` from \`pathAggregate\` using the inverse of function \`f \`
>     -   **Step 3.3:** Return
> -   **Step 4:** Call \`preorder(node.left, pathAggregate, aggregate)\`
> -   **Step 5:** Call \`preorder(node.right, pathAggregate, aggregate)\`
> -   **Step 6:** Remove the contribution of \`node\` from \`pathAggregate\` using the inverse of function \`f \`

## Implementation

The generic implementation of the stateful execution is given below. The preorder function is separate from the calling function as we create all the state variables (`pathAggregate` and `aggregate`) in the calling function and pass them to the preorder function by reference, which then uses/updates them to solve the problem. This is done so that all stack frames in the preorder function share the same copy of state variables.

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
      int callingFunction(TreeNode *node) {
        // Initialize pathAggregate to a default value
        int pathAggregate = 0;

        // Initialize aggregate to a default value
        int aggregate = 0;

        // Call rootToLeafPath and pass pathAggregate and
        // aggregate as references
        rootToLeafPath(node, pathAggregate, aggregate);

        // aggregate should now have the aggregated value of function
        // g over all root-to-leaf path aggregates (over function f)
        // in the tree
        return aggregate;

      }
      void rootToLeafPath(TreeNode *node, int& pathAggregate, int& aggregate) {
         if (!node) {
            // Return if this is a null node
             return;
         }

         // Add contribution of the current node to the pathAggregate
         // using the funciton f
         pathAggregate = f(pathAggregate, node->val);

         // If it's a leaf node, pathAggregate is the aggregated value
         // of function f over a root-to-leaf path
         if (!node->left && !node->right) {
              // Add contribution of pathAggregate to aggregate
              // using the function g
              g(aggregate, pathAggregate);
              return;
         }

         // Recursively calculate aggregates of function over the
         // root-to-leaf paths in the left and right subtree and update
         // aggregate with it
         rootToLeafPath(node->left, pathAggregate);
         rootToLeafPath(node->right, pathAggregate);

         // Remove the contribution of the current node from pathAggregate
         // using the function fInverse
         pathAggregate = fInverse(pathAggregate, node->val);

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

class Solution {
    // Global variables to share between recursive calls
    private int pathAggregate;
    private int aggregate;

    public int callingFunction(TreeNode node) {
        // Initialize pathAggregate to a default value
        pathAggregate = 0;

        // Initialize aggregate to a default value
        aggregate = 0;

        // Call rootToLeafPath and pass pathAggregate and aggregate
        rootToLeafPath(node);

        // aggregate should now have the aggregated value of function
        // g over all root-to-leaf path aggregates (over function f)
        // in the tree
        return aggregate;
    }

    private void rootToLeafPath(TreeNode node) {
        if (node == null) {
            // Return if this is a null node
            return;
        }

        // Add contribution of the current node to the pathAggregate
        // using the function f
        pathAggregate = f(pathAggregate, node.val);

        // If it's a leaf node, pathAggregate is the aggregated value
        // of function f over a root-to-leaf path
        if (node.left == null && node.right == null) {
            // Add contribution of pathAggregate to aggregate
            // using the function g
            aggregate = g(aggregate, pathAggregate);
            return;
        }

        // Recursively calculate aggregates of function over the
        // root-to-leaf paths in the left and right subtree and update
        // aggregate with it
        rootToLeafPath(node.left);
        rootToLeafPath(node.right);

        // Remove the contribution of the current node from pathAggregate
        // using the function fInverse
        pathAggregate = fInverse(pathAggregate, node.val);
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
  private pathAggregate: number = 0; // Shared across recursive calls
  private aggregate: number = 0; // Shared across recursive calls

  callingFunction(node: TreeNode | null): number {
    // Initialize pathAggregate to a default value
    this.pathAggregate = 0;

    // Initialize aggregate to a default value
    this.aggregate = 0;

    // Call rootToLeafPath
    this.rootToLeafPath(node);

    // aggregate should now have the aggregated value of function
    // g over all root-to-leaf path aggregates (over function f)
    // in the tree
    return this.aggregate;
  }

  private rootToLeafPath(node: TreeNode | null): void {
    if (!node) {
      // Return if this is a null node
      return;
    }

    // Add contribution of the current node to the pathAggregate
    // using the function f
    this.pathAggregate = f(this.pathAggregate, node.val);

    // If it's a leaf node, pathAggregate is the aggregated value
    // of function f over a root-to-leaf path
    if (!node.left && !node.right) {
      // Add contribution of pathAggregate to aggregate
      // using the function g
      this.aggregate = g(this.aggregate, this.pathAggregate);
      return;
    }

    // Recursively calculate aggregates of function over the
    // root-to-leaf paths in the left and right subtree and update
    // aggregate with it
    this.rootToLeafPath(node.left);
    this.rootToLeafPath(node.right);

    // Remove the contribution of the current node from pathAggregate
    // using the function fInverse
    this.pathAggregate = fInverse(this.pathAggregate, node.val);
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
  pathAggregate = 0; // Shared across recursive calls
  aggregate = 0; // Shared across recursive calls

  callingFunction(node) {
    // Initialize pathAggregate to a default value
    this.pathAggregate = 0;

    // Initialize aggregate to a default value
    this.aggregate = 0;

    // Call rootToLeafPath
    this.rootToLeafPath(node);

    // aggregate should now have the aggregated value of function
    // g over all root-to-leaf path aggregates (over function f)
    // in the tree
    return this.aggregate;
  }

  rootToLeafPath(node) {
    if (!node) {
      // Return if this is a null node
      return;
    }

    // Add contribution of the current node to the pathAggregate
    // using the function f
    this.pathAggregate = f(this.pathAggregate, node.val);

    // If it's a leaf node, pathAggregate is the aggregated value
    // of function f over a root-to-leaf path
    if (!node.left && !node.right) {
      // Add contribution of pathAggregate to aggregate
      // using the function g
      this.aggregate = g(this.aggregate, this.pathAggregate);
      return;
    }

    // Recursively calculate aggregates of function over the
    // root-to-leaf paths in the left and right subtree and update
    // aggregate with it
    this.rootToLeafPath(node.left);
    this.rootToLeafPath(node.right);

    // Remove the contribution of the current node from pathAggregate
    // using the function fInverse
    this.pathAggregate = fInverse(this.pathAggregate, node.val);
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
    def __init__(self):
        # Initialize path_aggregate and aggregate as class variables
        self.path_aggregate: int = 0
        self.aggregate: int = 0

    def calling_function(self, node: Optional[TreeNode]) -> int:
        # Initialize path_aggregate to a default value
        self.path_aggregate = 0

        # Initialize aggregate to a default value
        self.aggregate = 0

        # Call root_to_leaf_path and update class variables
        self.root_to_leaf_path(node)

        # self.aggregate now holds the aggregated value over all root-to-leaf paths
        return self.aggregate

    def root_to_leaf_path(self, node: Optional[TreeNode]) -> None:
        if not node:
            # Return if this is a null node
            return

        # Add contribution of the current node to path_aggregate using function f
        self.path_aggregate = f(self.path_aggregate, node.val)

        # If it's a leaf node, path_aggregate is the aggregated value
        # of function f over a root-to-leaf path
        if not node.left and not node.right:
            # Add contribution of path_aggregate to aggregate using function g
            self.aggregate = g(self.aggregate, self.path_aggregate)
            return

        # Recursively calculate aggregates over the root-to-leaf paths
        # in the left and right subtrees
        self.root_to_leaf_path(node.left)
        self.root_to_leaf_path(node.right)

        # Remove the contribution of the current node from pathAggregate
        # using the function fInverse
        self.path_aggregate = fInverse(self.path_aggregate, node.val);
```

## Complexity Analysis

It is quite easy to figure out the time and space complexity of the solution. We traverse the entire tree using the preorder traversal that takes linear **O(N)** time. We apply the function `f` on entering any node and the function `g` on hitting a leaf node. And so, the overall time complexity depends on the `f`, number of leaf node and function `g`. Considering applying the function `f` and `g` are constant time **O(1)** operations, the overall time complexity is linear **O(N)** in any case.

The space complexity of preorder traversal depends on the maximum size of the function call stack, which can be linear **O(N)** if the tree is a degenerate binary tree where every node only has one child and **O(log(N))** if it is a complete binary tree. We only create two extra variables `pathAggregate` and `aggregate` and since all stack frames share them, they only make a constant contribution.

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

# Identifying the stateful root to leaf path pattern

The stateful root-to-leaf path technique can only solve a certain type of binary tree problem. These are generally**easy** or **medium**problems where we need to find the aggregated value of a function `f` over all nodes in every root-to-leaf path. For most problems, we need to further aggregate these aggregated values over another function `g`.

The stateful solution works by maintaining two state variables, one to aggregate the value of nodes in a path over function `f` and the other to aggregate all root-to-leaf path aggregates over function `g`. These two variables are either created in the calling function and passed as references to the recursive traversal function or created in the enclosing scope so that all nodes can access the same copy of these two variables.

The stateful solution is the generic solution to all root-to-leaf path problems in a binary tree and can be used to solve all problems that can be solved using the stateless solution. It is used over the stateless version when the values that need to be passed down and up between the nodes are too big

If the problem statement or its solution follows the generic template below, it can be solved by applying the stateful root-to-leaf path technique.

**Template:**Given a binary tree, find the aggregated value of a function `f` over all root-to-leaf paths and further aggregate these aggregated values over a function `g`.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the stateful root-to-leaf path technique.

> **Problem statement:** Given a binary tree and a target, return a list of lists with all root-to-leaf paths where the sum of nodes in the path is equal to the target.

// Diagram: Find all root-to-leaf paths with a sum of 9.

## The stateful root-to-leaf path technique

The problem description fits the generic template from the stateful root-to-leaf path pattern we learned earlier.

**Template:**

Given a binary tree, find the aggregated value of a function `f` (sum) over all root-to-leaf paths and further aggregate these aggregated values over a function `g` (add to list)

We do a preorder traversal of the binary tree and pass down three variables from every node: the **target value remaining,**  reference to a list `path` that keeps track of all the nodes in the path from the root to the current node and reference to a list of lists `result` that will store all the root-to-leaf paths with a sum equal to the target.

// Diagram: Pass the remaining target and references to the path and result list down from every node.

We start from the root node with `target`, and empty `path` and `result` lists, and as we enter a node, we add the current node to the list `path`. Next, we subtract the node's value from `target` received from the parent and continue the traversal by passing down the updated value to the left and right child nodes. Once the preorder traversal for a node is finished, we remove it from the `path` list before exiting from the node. This way `path` always has the list of nodes from the root node to the current node in that order.

Since `target` is a local variable, every node has its own copy of `target` which is unaffected by the values in other nodes. On the other hand, the same copy of `path` is shared between all nodes, and so the child node is also appended to the same list. This way, on reaching a leaf node, we only need to check if `target` is equal to the value of the leaf node or not to verify if the sum of all nodes in the root-to-leaf path to this leaf is equal to the `target` passed to the root node or not. On reaching a leaf node, if `target` equals the value of the leaf node, we add the list `path` to the `result` list, remove the current node from the `path` list and return back to the parent node. 

This way, at the end of the traversal, `path` will be empty and `result` will have all the root-to-leaf paths where the sum of nodes is equal to the target.

Find all root-to-leaf paths with a sum of 9.

The implementation of the stateful root-to-leaf path technique to solve the problem is given below.

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
    void findPaths(
        TreeNode *root,
        int target,
        vector<int> &path,
        vector<vector<int>> &result
    ) {

        // If the root is null, there is no path, so return false
        if (!root) {
            return;
        }

        // Add the current node to the path
        path.push_back(root->val);

        // If it is a leaf node and the target matches the node value,
        // add the current path to the result
        if (!root->left && !root->right && root->val == target) {
            result.push_back(path);
        }

        // Otherwise, subtract the current node's value from target and
        // continue traversal to left and right subtrees
        target -= root->val;

        // Recursively search in left and right subtrees with updated
        // target
        findPaths(root->left, target, path, result);
        findPaths(root->right, target, path, result);

        // Backtrack by removing the current node from the path
        path.pop_back();
    }

// Diagram: vector<vector<int>> rootToLeafPathII(TreeNode root, int target) {

        // To store all valid paths
        vector<vector<int>> result;

        // To store the current path as we traverse
        vector<int> path;

        // Start the recursive search from the root node
        findPaths(root, target, path, result);

        // Return the list of all valid paths
        return result;
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

The stateful root-to-leaf path technique can solve this problem in linear time and a single pass using a very small and concise recursive implementation.

## Example problems

Most problems that fall under this category are**easy**problems; a list of a few is given below.

> -   **[Root to leaf paths](https://www.codeintuition.io/courses/binary-tree/AeXH6FknJNkFz0Je1Rw5y)**
> -   **[Equal paths](https://www.codeintuition.io/courses/binary-tree/ARsmRsSslpsO-t9Cf7yjG)**
> -   **[Duplicate paths](https://www.codeintuition.io/courses/binary-tree/5jucIlHrd11dkk3v5JbQg)**
> -   **[Prefix paths](https://www.codeintuition.io/courses/binary-tree/nwyeV0lWrNGPK18VhqO9-)**

We will now solve these problems to understand the stateful root-to-leaf path technique better.

***

# Root to leaf paths

## Problem Statement

Given the **root** of a binary tree and a **target**, write a function to find and return all root-to-leaf paths where the sum of nodes in the path is equal to the target.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\], target = 11
> -   **Output:** \[\[1, 3, 7\]\]
> -   **Explanation:** The given tree has a path with sum = 11 as shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 4\], target = 13
> -   **Output:** \[\]
> -   **Explanation:** The given tree has no paths where the sum is 13.

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

    // To store the current path as we traverse
    vector<int> path;

    void rootToLeafPathsHelper(
        TreeNode *root,
        int target,
        vector<vector<int>> &result
    ) {

        // If the root is null, there is no path, so return
        if (!root) {
            return;
        }

        // Add the current node to the path
        path.push_back(root->val);

        // If it is a leaf node and the target matches the node value,
        // add the current path to the result
        if (!root->left && !root->right && root->val == target) {
            result.push_back(path);
        }

        // Otherwise, subtract the current node's value from target and
        // continue traversal to left and right subtrees
        target -= root->val;

        // Recursively search in left and right subtrees with updated
        // target
        rootToLeafPathsHelper(root->left, target, result);
        rootToLeafPathsHelper(root->right, target, result);

        // Backtrack by removing the current node from the path
        path.pop_back();
    }

    vector<vector<int>> rootToLeafPaths(TreeNode *root, int target) {

        // To store all valid paths
        vector<vector<int>> result;

        // Start the recursive search from the root node
        rootToLeafPathsHelper(root, target, result);

        // Return the list of all valid paths
        return result;
    }
};
```

***

# Equal paths

## Problem Statement

Given the **root** of a binary tree, write a function to find and return all root-to-leaf paths that have an equal number of even and odd-valued nodes in them.

### Example 1

> -   **Input:** root = \[1, 2, 4\]
> -   **Output:** \[\[1, 2\], \[1, 4\]\]
> -   **Explanation:** The given tree has two such paths as shown above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 4\]
> -   **Output:** \[\[1, 8\]\]
> -   **Explanation:** The given tree has one such path as shown above.

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

    // To store the current path as we traverse
    vector<int> path;

    void equalPathsHelper(
        TreeNode *root,
        int evenCount,
        int oddCount,
        vector<vector<int>> &result
    ) {

        // If the root is null, there is no path, so return
        if (!root) {
            return;
        }

        // Add the current node to the path
        path.push_back(root->val);

        // If the current node is even, increment even count
        if (root->val % 2 == 0) {
            evenCount++;
        }

        // Else, increment odd count
        else {
            oddCount++;
        }

        // If current node is a leaf, check if even and odd counts are
        // equal
        if (!root->left && !root->right) {

            // If the counts are equal, add the current path to the
            // result
            if (evenCount == oddCount) {
                result.push_back(path);
            }
        }

        // Recursively traverse left and right subtrees
        equalPathsHelper(root->left, evenCount, oddCount, result);
        equalPathsHelper(root->right, evenCount, oddCount, result);

        // Backtrack by removing the current node from the path
        path.pop_back();
    }

    vector<vector<int>> equalPaths(TreeNode *root) {

        // To store all valid paths
        vector<vector<int>> result;

        // Start the recursive search from the root node with initial
        // even and odd counts as 0
        equalPathsHelper(root, 0, 0, result);
        return result;
    }
};
```

***

# Equal paths

***

# Duplicate paths

## Problem Statement

Given the **root** of a binary tree, write a function to find and return all root-to-leaf paths that appear more than once in the tree.

### Example 1

> -   **Input:** root = \[1, 2, 2\]
> -   **Output:** \[\[1, 2\]\]
> -   **Explanation:** The given tree has one such path that appears more than once in the tree, as shown in the above diagram.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 4\]
> -   **Output:** \[\]
> -   **Explanation:** The given tree has no root-to-leaf path that appears more than once.

## Solution

```cpp
#include <sstream>
#include <unordered_map>

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

    // To store the current path as we traverse
    vector<int> path;

    // To store frequency of each root-to-leaf path (serialized as a
    // string)
    unordered_map<string, int> pathCount;

    string serializePath(const vector<int> &path) {
        ostringstream oss;
        for (int i = 0; i < path.size(); i++) {

            // Add comma separator for all but the first element
            if (i > 0) {
                oss << ",";
            }

            // Append the current node value
            oss << path[i];
        }

        // Return the serialized path
        return oss.str();
    }

    void duplicatePathsHelper(
        TreeNode *root,
        vector<vector<int>> &result
    ) {

        // If the root is null, there is no path, so return
        if (!root) {
            return;
        }

        // Add the current node to the path
        path.push_back(root->val);

        // If it's a leaf, serialize and check frequency
        if (!root->left && !root->right) {

            // Serialize current path
            string serializedPath = serializePath(path);

            // Increment frequency count for this path
            pathCount[serializedPath]++;

            // If path occurs exactly twice, record it as duplicate
            if (pathCount[serializedPath] == 2) {
                result.push_back(path);
            }
        }

        // Recursively traverse left and right subtrees
        duplicatePathsHelper(root->left, result);
        duplicatePathsHelper(root->right, result);

        // Backtrack by removing the current node from the path
        path.pop_back();
    }

    vector<vector<int>> duplicatePaths(TreeNode *root) {

        // To store all valid paths
        vector<vector<int>> result;

        // Start the recursive search from the root node
        duplicatePathsHelper(root, result);

        // Return the list of all valid paths
        return result;
    }
};
```

***

# Prefix paths

## Problem Statement

Given the **root** of a binary tree, write a function to find and return all root-to-leaf paths for which the sum of the nodes along the path appears at least once in a subpath within the same path.

A subpath is a path that starts at the root of the tree and ends at any ancestor on that root-to-leaf path (i.e. a prefix of that path).

### Example 1

> -   **Input:** root = \[1, -3, null, null, 3\]
> -   **Output:** \[\[1, -3, 3\]\]
> -   **Explanation:** The given tree contains a root-to-leaf path \[1, -3, 3\] where the sum of all nodes along the path (1 + (-3) + 3 = 1) matches the sum of a subpath within the same path, the subpath consisting of just the root node \[1\].

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 4\]
> -   **Output:** \[\]
> -   **Explanation:** There is no root-to-leaf path in which the sum of any subpath equals the total sum of the entire root-to-leaf path.

## Solution

```cpp
#include <unordered_map>

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

    // To store the current path as we traverse
    vector<int> path;

    // To store prefix sum counts for paths
    unordered_map<int, int> prefixSumCount;

    void prefixPathsHelper(
        TreeNode *root,
        int pathSum,
        vector<vector<int>> &result
    ) {

        // If the root is null, there is no path, so return
        if (!root) {
            return;
        }

        // Add the current node to the path
        path.push_back(root->val);

        // Calculate the current sum by adding the value of the
        // current node to the previous sum.
        pathSum += root->val;

        // Add the current sum to the prefixSumCount map to keep track of
        // it. This is to be used by future nodes in the recursive
        // traversal.
        prefixSumCount[pathSum]++;

        // If it's a leaf node, check if the total sum has occurred
        if (!root->left && !root->right) {

            // Check if total sum already exists as a prefix (excluding
            // last occurrence)
            if (prefixSumCount[pathSum] > 1) {
                result.push_back(path);
            }
        }

        // Recursively traverse left and right subtrees
        prefixPathsHelper(root->left, pathSum, result);
        prefixPathsHelper(root->right, pathSum, result);

        // Backtrack by removing the current sum from the prefix sum
        // count map.This is to ensure that the prefix sum count is
        // accurate for future nodes.
        prefixSumCount[pathSum]--;

        // Backtrack by removing the current node from the path
        path.pop_back();
    }

    vector<vector<int>> prefixPaths(TreeNode *root) {

        // To store all valid paths
        vector<vector<int>> result;

        // Start the recursive search from the root node
        prefixPathsHelper(root, 0, result);

        // Return the list of all valid paths
        return result;
    }
};
```

***

# Prefix paths
