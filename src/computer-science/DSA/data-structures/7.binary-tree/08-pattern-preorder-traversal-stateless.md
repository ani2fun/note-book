# Pattern: Preorder traversal (Stateless)

## Table of Contents

1. [Understanding the stateless preorder traversal pattern](#understanding-the-stateless-preorder-traversal-pattern)
2. [Identifying the stateless preorder traversal pattern](#identifying-the-stateless-preorder-traversal-pattern)
3. [Sum of path](#sum-of-path)
4. [Depth assignment](#depth-assignment)
5. [Concatenated path](#concatenated-path)
6. [Increasing path](#increasing-path)

***

# Understanding the stateless preorder traversal pattern

Preorder traversal follows the node-left-right processing sequence, where we process a node as we enter it and repeat the process recursively for both its left and right subtree. Because a node is processed before its left and right subtrees, the preorder traversal is ideal for solving problems where data must be processed and passed down from parent to child nodes. The child nodes then process the data they receive from their parent and pass it down to their children.

There are two ways to pass data between nodes. One requires maintaining some shared state, while the other is completely stateless. The choice between these options depends on the problem. The stateless preorder traversal is the regular preorder traversal technique that passes data from child nodes to the parent node instead of sharing a single copy between nodes.

The stateless preorder traversal pattern is a classification of problems that can be solved using the stateless preorder traversal technique.

// Diagram: The order of processing of nodes in preorder traversal

In this lesson, we will learn more about using the stateless preorder traversal technique to solve binary tree problems and how to identify a problem as a preorder pattern problem.

## The stateless preorder traversal technique

Consider we are given a binary tree, and to process a node, we need the aggregated value of a function `f` over all nodes in the path from the root node to the given node.

// Diagram: Process every node using the aggregated value of function f over nodes in the path from the root node to itself.

The stateless execution is intuitive and easy to understand as it only uses the basic preorder traversal. We start the preorder traversal from the root node and pass a variable `aggregate` to each node, starting with a default value at the root node. The variable `aggregate` holds the aggregated value of the function `f` over the nodes in the path from the root to the current node. 

As we enter a node, we use the value of `aggregate` passed down from the parent to process this node. Finally, we add the contribution of the current node to `aggregate` using the function `f` and pass this updated value to the left and right children to continue the preorder traversal. This way, every node gets the aggregated value of the function `f` over all the nodes in the path from the root node to itself for processing.

// Diagram: Process a child node using the aggregated value passed down from the parent.

Also, since every node has its own copy of `aggregate`, the value passed to both its left and right subtrees will be unaffected by the modifications to `aggregate` done in any of those subtrees, as both of them will modify their copy. At the end of the traversal, each node will be processed using the aggregated value of the function `f` over all nodes in the path from the root node to that node.

// Diagram: Process nodes with the aggregated value of f over the root to node path

## Algorithm

The generic algorithm given below uses preorder traversal to process every node by using the aggregated value of a function `f` over all nodes in the path from the root node to the node.

> **Algorithm**
>
> **preorder(node, aggregate)**
>
> -   **Step 1:** If this is a \`null\` node return
> -   **Step 2:** Use the value of \`aggregate\` to process this node
> -   **Step 3:** Use the function \`f\` to add the contribution of \`node.val\` to \`aggregate\`
> -   **Step 4:** Call \`preorder(node.left, aggregate)\`
> -   **Step 5:** Call \`preorder(node.right, aggregate)\`

## Implementation

The implementation of the stateless preorder traversal technique is given below. The preorder function is separate from the calling function as we need to pass the initial aggregated value to the root node. All nodes, in this case, have their own copy of `aggregate`, which they use, update, and pass on to their children.

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
    void callingFunction(TreeNode* root) {
        // Traverse the binary tree in preorder and apply the function
        preorder(root, 0);
    }
    void preorder(TreeNode *node, int aggregate) {

        if (!node) {
            // Return if this is a null node;
            return;
        }

        // Process the node with left and right values
        // Replace this with actual implementation
        // .

        // Add contribution of current node
        aggregate = f(aggregate, node->val);

        // Pass the new aggregated value down
        preorder(node->left, aggregate);
        preorder(node->right, aggregate);

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
    public void callingFunction(TreeNode root) {
        // Traverse the binary tree in preorder and apply the function
        preorder(root, 0);
    }

    private void preorder(TreeNode node, int aggregate) {
        if (node == null) {
            // Return if this is a null node;
            return;
        }

        // Process the node with left and right values
        // Replace this with actual implementation
        // .

        // Add contribution of current node
        aggregate = f(aggregate, node.val);

        // Pass the new aggregated value down
        preorder(node.left, aggregate);
        preorder(node.right, aggregate);
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
  callingFunction(root: TreeNode | null): void {
    // Traverse the binary tree in preorder and apply the function
    this.preorder(root, 0);
  }

  private preorder(node: TreeNode | null, aggregate: number): void {
    if (!node) {
      // Return if this is a null node;
      return;
    }

    // Process the node with left and right values
    // Replace this with actual implementation
    // .

    // Add contribution of current node
    aggregate = this.f(aggregate, node.val);

    // Pass the new aggregated value down
    this.preorder(node.left, aggregate);
    this.preorder(node.right, aggregate);
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
  callingFunction(root) {
    // Traverse the binary tree in preorder and apply the function
    this.preorder(root, 0);
  }

  preorder(node, aggregate) {
    if (!node) {
      // Return if this is a null node;
      return;
    }

    // Process the node with left and right values
    // Replace this with actual implementation
    // .

    // Add contribution of current node
    aggregate = this.f(aggregate, node.val);

    // Pass the new aggregated value down
    this.preorder(node.left, aggregate);
    this.preorder(node.right, aggregate);
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
    def calling_function(self, root: Optional[TreeNode]) -> None:
        # Start traversal with an initial aggregate value of 0
        self.preorder(root, 0)

    def preorder(self, node: Optional[TreeNode], aggregate: int) -> None:
        if not node:
            # Return if this is a null node;
            return

        # Process the node with left and right values
        # Replace this with actual implementation
        # .

        # Add contribution of the current node
        aggregate = self.f(aggregate, node.val)

        # Pass the new aggregated value down
        self.preorder(node.left, aggregate)
        self.preorder(node.right, aggregate)
```

## Complexity Analysis

It is quite easy to figure out the time and space complexity of the solution. We traverse the entire tree using the preorder traversal that takes linear **O(N)** time and apply the function `f` on every node. And so, the overall time complexity depends on the time complexity of the function `f`. Considering it is a constant time **O(1)** operation, the overall time complexity is linear **O(N)** in any case.

The space complexity of preorder traversal depends on the maximum size of the function call stack, which can be linear **O(N)** if the tree is a degenerate binary tree where every node only has one child and **O(log(N))** if it is a complete binary tree. However, each stack frame also creates its own copy of local variables, but each of them only makes a constant contribution to the size of the frame, so the overall space complexity is the same as the space required for the stack frames.

> **Best Case:** Complete binary tree
>
> -   Space Complexity - **O(log(N))**
> -   Time Complexity - **O(N)**
>
> **Worst Case:** Degenerate binary tree
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Identifying the stateless preorder traversal pattern

The stateless preorder traversal can solve most binary tree problems where data needs to be passed down from parent nodes to child nodes for processing. These are generally **easy** or **medium** problems where we need to process every node using the aggregated value of some function `f` over all the nodes in the path from the root node to itself. The stateless implementation can only solve problems where no state (common) information is shared between all nodes, and each node has access to only its copy of local variables.

If the problem statement or its solution follows the generic template below, it can be solved by applying the stateless preorder traversal technique.

**Template:**Given a binary tree, process every node using the aggregated value of a function `f` over all nodes in the path from the root node to itself. No state information must be shared between nodes.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the stateless preorder traversal technique.

> **Problem statement:** Given a binary tree, add to every node in the tree the sum of all nodes before it in the path from the root node to itself.

// Diagram: Update every node with sum of all nodes before itself in the path from root to itself

## The stateless preorder traversal technique

The problem description fits the generic template from the stateless preorder traversal pattern we learned earlier.

**Template:**Given a binary tree, process every node using the aggregated value of a function `f` (sum) over all nodes in the path from the root node to itself. No state information must be shared between nodes.

We can solve this problem by using preorder traversal, by passing a variable `pathSum` that holds the sum of all nodes in the path from the root node to itself to the child nodes. We start the preorder traversal from the root node, where we pass 0 as the value for the `pathSum`. We create a local variable `newPathSum` and initialize it with the sum of `pathSum` and the value of the node. We then update the node with `newPathSum` and continue the preorder traversal, passing the `newPathSum` as `pathSum` to the child nodes.

This way, at the end of the preorder traversal, all nodes in the tree will be updated to hold the sum of all nodes before them in the path from the root node to themselves in the original tree.

// Diagram: Update every node with sum of all nodes before itself in the path from root to itself

The implementation of the stateless preorder traversal technique to solve the problem is given below.

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
    void sumOfPathHelper(TreeNode *root, int pathSum) {

        // Base case: if the current node is null, do nothing
        if (!root) {
            return;
        }

        // Calculate the new path sum by adding the current node's value
        int newPathSum = pathSum + root->val;

        // Update the current node's value to the new path sum
        root->val = newPathSum;

        // Recursively process the left and right children,
        // passing the updated path sum
        sumOfPathHelper(root->left, newPathSum);
        sumOfPathHelper(root->right, newPathSum);
    }

    void sumOfPath(TreeNode *root) {
        sumOfPathHelper(root, 0);
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
    public void sumOfPathHelper(TreeNode root, int pathSum) {

        // Base case: if the current node is null, do nothing
        if (root == null) {
            return;
        }

        // Calculate the new path sum by adding the current node's value
        int newPathSum = pathSum + root.val;

        // Update the current node's value to the new path sum
        root.val = newPathSum;

        // Recursively process the left and right children,
        // passing the updated path sum
        sumOfPathHelper(root.left, newPathSum);
        sumOfPathHelper(root.right, newPathSum);
    }

    public void sumOfPath(TreeNode root) {
        sumOfPathHelper(root, 0);
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
    sumOfPathHelper(root: TreeNode | null, pathSum: number): void {

        // Base case: if the current node is null, do nothing
        if (!root) {
            return;
        }

        // Calculate the new path sum by adding the current node's value
        const newPathSum = pathSum + root.val;

        // Update the current node's value to the new path sum
        root.val = newPathSum;

        // Recursively process the left and right children,
        // passing the updated path sum
        this.sumOfPathHelper(root.left, newPathSum);
        this.sumOfPathHelper(root.right, newPathSum);
    }

    sumOfPath(root: TreeNode | null): void {
        this.sumOfPathHelper(root, 0);
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
    sumOfPathHelper(root, pathSum) {

        // Base case: if the current node is null, do nothing
        if (!root) {
            return;
        }

        // Calculate the new path sum by adding the current node's value
        const newPathSum = pathSum + root.val;

        // Update the current node's value to the new path sum
        root.val = newPathSum;

        // Recursively process the left and right children,
        // passing the updated path sum
        this.sumOfPathHelper(root.left, newPathSum);
        this.sumOfPathHelper(root.right, newPathSum);
    }

    sumOfPath(root) {
        this.sumOfPathHelper(root, 0);
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
    def sum_of_path_helper(
        self, root: Optional[TreeNode], path_sum: int
    ) -> None:

        # Base case: if the current node is null, do nothing
        if root is None:
            return

        # Calculate the new path sum by adding the current node's value
        new_path_sum = path_sum + root.val

        # Update the current node's value to the new path sum
        root.val = new_path_sum

        # Recursively process the left and right children,
        # passing the updated path sum
        self.sum_of_path_helper(root.left, new_path_sum)
        self.sum_of_path_helper(root.right, new_path_sum)

    def sum_of_path(self, root: Optional[TreeNode]) -> None:
        self.sum_of_path_helper(root, 0)
```

The stateless preorder traversal can solve this problem in linear time and a single pass using a very small and concise recursive implementation.

## Example problems

Most problems that fall under this category are**easy**problems; a list of a few is given below.

> -   **[Sum of path](https://www.codeintuition.io/courses/binary-tree/gzqv3wSNB0fLtGUaHqIGq)**
> -   **[Depth assignment](https://www.codeintuition.io/courses/binary-tree/SYMkRw47nIVGc_nN-lv-2)**
> -   **[Concatenated path](https://www.codeintuition.io/courses/binary-tree/XBd1aDau-eOHbdhWluy9v)**
> -   **[Increasing path](https://www.codeintuition.io/courses/binary-tree/d7z7A1mA-eYBJXuX_EmLE)**

We will now solve these problems to understand the stateless preorder traversal technique better.

***

# Sum of path

## Problem Statement

Given the **root** of a binary tree, update each node's value by adding the sum of all node values on the path from the root to that node.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** \[1, 3, 4, 7, null, null, 11\]
> -   **Explanation:** After adding to each node the sum of all node values along the path from the root to that node, we get the updated tree shown above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\]
> -   **Output:** \[1, 9, 5, null, null, 7, 12\]
> -   **Explanation:** After adding to each node the sum of all node values along the path from the root to that node, we get the updated tree shown above.

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
    void sumOfPathHelper(TreeNode *root, int pathSum) {

        // Base case: if the current node is null, do nothing
        if (!root) {
            return;
        }

        // Calculate the new path sum by adding the current node's value
        int newPathSum = pathSum + root->val;

        // Update the current node's value to the new path sum
        root->val = newPathSum;

        // Recursively process the left and right children,
        // passing the updated path sum
        sumOfPathHelper(root->left, newPathSum);
        sumOfPathHelper(root->right, newPathSum);
    }

    void sumOfPath(TreeNode *root) { 
        sumOfPathHelper(root, 0); 
    }
};
```

***

# Sum of path

***

# Depth assignment

## Problem Statement

Given the **root** of a binary tree, update each node's value to its depth.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** \[0, 1, 1, 2, null, null, 2\]
> -   **Explanation:** After updating each node's value to its depth, we get the tree shown above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\]
> -   **Output:** \[0, 1, 1, null, null, 2, 2\]
> -   **Explanation:** After updating each node's value to its depth, we get the tree shown above.

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
    void depthAssignmentHelper(TreeNode *root, int depth) {

        // Base case: if the current node is null, do nothing
        if (!root) {
            return;
        }

        // Update current node's value with its depth
        root->val = depth;

        // Recursively process the left and right children,
        // increasing the depth by 1
        depthAssignmentHelper(root->left, depth + 1);
        depthAssignmentHelper(root->right, depth + 1);
    }

    void depthAssignment(TreeNode *root) {
        depthAssignmentHelper(root, 0);
    }
};
```

***

# Concatenated path

## Problem Statement

Given the **root** of a binary tree, update each node’s value to the integer represented by concatenating all digits from the root to that node.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** \[1, 12, 13, 124, null, null, 137\]
> -   **Explanation:** After updating each node's value to the integer represented by concatenating all digits from the root to that node, we get the tree shown above.

### Example 2

> -   **Input:** root = \[1, 10, 20, null, null, 211, 7\]
> -   **Output:** \[1, 110, 120, null, null, 120211, 1207\]
> -   **Explanation:** After updating each node's value to the integer represented by concatenating all digits from the root to that node, we get the tree shown above.

## Solution

```cpp
#include <cmath>

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
    int countDigits(int num) {

        // Handle the case when num is 0
        if (num == 0) {
            return 1;
        }

        // Count the number of digits in num
        int digits = 0;
        while (num > 0) {
            num /= 10;
            digits++;
        }

        // Return the total count of digits
        return digits;
    }

    void concatenatedPathHelper(TreeNode *root, int pathVal) {

        // Base case: if the current node is null, do nothing
        if (!root) {
            return;
        }

        // Shift pathVal by digitCount digits to the left, then
        // add current node value
        int digitCount = countDigits(root->val);

        // Update current node's value
        root->val = pathVal * (pow(10, digitCount)) + root->val;

        // Recursively process the left and right children,
        // passing updated path value
        concatenatedPathHelper(root->left, root->val);
        concatenatedPathHelper(root->right, root->val);
    }

    void concatenatedPath(TreeNode *root) {
        concatenatedPathHelper(root, 0);
    }
};
```

***

# Increasing path

## Problem Statement

Given the **root** of a binary tree, update each node’s value to `1` if the values along the path from the root to that node are strictly increasing, and to `0` otherwise.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** \[1, 1, 1, 1, null, null, 1\]
> -   **Explanation:** After updating each node according to the condition above, we get the tree shown above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\]
> -   **Output:** \[1, 1, 1, null, null, 0, 1\]
> -   **Explanation:** After updating each node according to the condition above, we get the tree shown above.

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
    void increasingPath(TreeNode *root) {

    }
};
```
