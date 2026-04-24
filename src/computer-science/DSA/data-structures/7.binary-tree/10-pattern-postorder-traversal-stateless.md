# Pattern: Postorder traversal (Stateless)

## Table of Contents

1. [Understanding the stateless postorder traversal pattern](#understanding-the-stateless-postorder-traversal-pattern)
2. [Identifying the stateless postorder traversal pattern](#identifying-the-stateless-postorder-traversal-pattern)
3. [Sum of leaves](#sum-of-leaves)
4. [Height of binary tree](#height-of-binary-tree)
5. [Maximum path sum](#maximum-path-sum)
6. [Full binary tree](#full-binary-tree)
7. [Perfect binary tree](#perfect-binary-tree)
8. [Collect leaves](#collect-leaves)

***

# Understanding the stateless postorder traversal pattern

The postorder traversal follows the left-right-node processing sequence, where a node is processed after processing both its left and right subtrees recursively. Because a node is processed **after** its left and right subtrees, the postorder traversal is ideal for solving problems where data must be processed and **passed up** from child nodes to the parent node. This makes postorder traversal the ideal solution for solving binary tree problems that require a **bottom-up** processing. Every node processes values passed from its children and passes the result to its parent.

There are two ways to pass data between nodes. One requires maintaining some shared state, while the other is completely stateless. The choice between these options depends on the problem. The stateless postorder traversal is the regular postorder traversal technique that passes data from child nodes to the parent node instead of sharing a single copy between nodes.

The stateless postorder traversal pattern is a classification of problems that can be solved using the stateless postorder traversal technique.

// Diagram: The order of processing of nodes in postorder traversal

In this lesson, we will learn more about using the stateless postorder traversal technique to solve binary tree problems and how to identify a problem as a postorder pattern problem.

## The stateless postorder traversal technique

The stateless postorder traversal technique is quite simple and easy to understand. Consider we are given a binary tree, and to process a node, we need the aggregated value of a function `f` over its left and right subtrees.

// Diagram: Process a node using the aggregated value of function f over its left and right subtrees.

The postorder traversal technique can easily solve this problem. The idea is quite simple: we start the postorder traversal from the root node of the tree that recursively traverses the left and right subtrees of every node before backtracking back to a node. We use this traversal order to pass the aggregated value of the function `f` over all nodes in the subtree of a node back up to its parent.

// Diagram: Process a parent node using the aggregated value passed up from its children.

To understand the technique better, we must look at it as a bottom-up execution. The postorder traversal from the root node recursively traverses to the left until it reaches a leaf node for which both the left and right subtrees are `null` references. Hitting a `null` reference is the base case for this recursive execution where we return some default value back up to the leaf node.

The default values received from the left and right `null` references are then used to process the leaf node. Finally, the default values it received from its left and right `null` references and its own contribution are aggregated using the function `f`. This aggregated value is then passed back up to the parent node, which gets a similar value from its right subtree. The same steps are then repeated for the parent node, where it is processed using the values it received from its left and right subtrees and finally aggregated along with its own contribution using the function `f` and passing it back up to its parent.

We create three local variables, `left`, `right`, and `aggregate`, for each node to store the values returned by the left and right subtree and the aggregated value for the subtree of the current node. The value of `aggregate` is then returned back to the parent from every node.

This way, at the end of postorder traversal, every node in the tree is processed with an aggregated value of function `f` over its left and right subtrees, and the aggregated value of `f` over all nodes in the tree is returned from the postorder call since the top-level node is the root node.

// Diagram: Process every node with the aggregated value of f over its left and right subtrees

## Algorithm

The generic algorithm given below uses postorder traversal to process every node using the aggregated value of a function `f` over its left and right subtrees.

> **postorder(node)**
>
> -   **Step 1:** If this is a \`null\` node, return a default value
> -   **Step 2:** \`left\` = Call \`postorder(node.left)\`
> -   **Step 3:** \`right\` = Call \`postorder(node.right)\`
> -   **Step 4:** Aggregate all values together: \`aggregate = \`f(left, right, node.val)\`
> -   **Step 5:** Return \`aggregate\`

## Implementation

The implementation of the postorder traversal technique is given below. The postorder function is completely stateless, as every node has its own copy of local variables `left`, `right` and `aggregate` that are unaffected by execution in other nodes.

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
    int postorder(TreeNode *node) {

        if (!node) {
            // Return some default value if this is a null reference;
            return 0;
        }

        // Pass the new aggregated value down
        int left = postorder(node->left);
        int right = postorder(node->right);

        // Process the node with left and right values
        // Replace this with actual implementation
        // .

        // Add contribution of current node
        int aggregate = f(left, right, node->val);

        // Pass back the aggregated value to the parent node
        return aggregate;

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
    public int postorder(TreeNode node) {
        if (node == null) {
            // Return some default value if this is a null reference;
            return 0;
        }

        // Pass the new aggregated value down
        int left = postorder(node.left);
        int right = postorder(node.right);

        // Process the node with left and right values
        // Replace this with actual implementation
        // .

        // Add contribution of current node
        int aggregate = f(left, right, node.val);

        // Pass back the aggregated value to the parent node
        return aggregate;
    }

    // Example placeholder function f for aggregation
    private int f(int left, int right, int nodeValue) {
        // Replace with actual aggregation logic
        return left + right + nodeValue; // Example: summing up values
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
  postorder(node: TreeNode | null): number {
    if (!node) {
      // Return some default value if this is a null reference;
      return 0;
    }

    // Pass the new aggregated value down
    const left = this.postorder(node.left);
    const right = this.postorder(node.right);

    // Process the node with left and right values
    // Replace this with actual implementation
    // .

    // Add contribution of current node
    const aggregate = this.f(left, right, node.val);

    // Pass back the aggregated value to the parent node
    return aggregate;
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
  postorder(node) {
    if (!node) {
      // Return some default value if this is a null reference;
      return 0;
    }

    // Pass the new aggregated value down
    const left = this.postorder(node.left);
    const right = this.postorder(node.right);

    // Process the node with left and right values
    // Replace this with actual implementation
    // .

    // Add contribution of current node
    const aggregate = this.f(left, right, node.val);

    // Pass back the aggregated value to the parent node
    return aggregate;
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
    def postorder(self, node: Optional[TreeNode]) -> int:
        if not node:
            # Return some default value if this is a null reference;
            return 0

        # Pass the new aggregated value down
        left = self.postorder(node.left)
        right = self.postorder(node.right)

        # Process the node with left and right values
        # Replace this with actual implementation
        # .

        # Add contribution of current node
        aggregate = self.f(left, right, node.val)

        # Pass back the aggregated value to the parent node
        return aggregate
```

## Complexity Analysis

It is quite easy to figure out the time and space complexity of the solution. We traverse the entire tree using the postorder traversal that takes linear **O(N)** time and apply the function `f` on every node. And so, the overall time complexity depends on the time complexity of the function `f`. Considering it is a constant time **O(1)** operation, the overall time complexity is linear **O(N)** in any case.

The space complexity of postorder traversal depends on the maximum size of the function call stack, which can be linear **O(N)** if the tree is a degenerate binary tree where every node only has one child and **O(log(N))** if it is a complete binary tree. However, each stack frame also creates its own copy of local variables, but each of them only makes a constant contribution to the size of the frame, so the overall space complexity is the same as the space required for the stack frames.

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

# Identifying the stateless postorder traversal pattern

The postorder traversal technique is very versatile and can solve a wide variety of binary tree problems. These are generally **easy** or **medium** problems where we need to process every node using the aggregated value of some function `f` over its left and right subtrees. Also, the stateless implementation can only solve problems where no state (common) information is shared between all nodes, and each node has access to only its copy of local variables. 

If the problem statement or its solution follows the generic template below, it can be solved by applying the stateless postorder traversal technique.

**Template:**Given a binary tree, process every node using the aggregated value of a function `f` over its left and right subtrees. The processing of a leaf or null node should be trivial, meaning it should have a known solution, and no state information must be shared between nodes.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the stateless postorder traversal technique.

> **Problem statement:** Given the root of a binary tree, write a function to calculate and return the sum of all its leaf nodes

// Diagram: Find the sum of all leaves of a binary tree

### The postorder traversal technique

The problem description fits the generic template from the stateless postorder traversal pattern we learned earlier.

**Template:**Given a binary tree, process every node using the aggregated value of a function `f` (sum of leaves) over its left and right subtrees. The processing of a leaf or null node should be trivial, meaning it should have a known solution, and no state information must be shared between nodes.

We can solve this problem by using postorder traversal, where every node returns to its parent, the sum of all the leaf nodes in its subtree.  For a `null` reference, the sum of all leaves in its subtree is 0, while for a leaf node, the sum of all leaf nodes in its subtree is its own value. Hence, hitting a `null` reference or a leaf node are two base cases for the postorder traversal, where we return a 0 value or the value of the leaf node, respectively, to the parent. All the other nodes can calculate the sum of all leaves in their subtree by adding the values they receive from their left and right children. 

This way, at the end of postorder traversal, the caller receives the sum of all leaf nodes in the subtree rooted at the root node, which is the entire binary tree itself.

// Diagram: Find the sum of all leaves of a binary tree

The implementation of the stateless postorder traversal technique to solve the problem is given below.

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
    int sumOfLeaves(TreeNode *root) {

        // Base case: if the tree is empty
        if (!root) {
            return 0;
        }

        // If it's a leaf node, return its value
        if (!root->left && !root->right) {
            return root->val;
        }

        // Recursively sum up leaf nodes in left and right subtrees
        int leftSum = sumOfLeaves(root->left);
        int rightSum = sumOfLeaves(root->right);

        // Return the sum of leaf nodes in left and right subtrees
        return leftSum + rightSum;
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
    public int sumOfLeaves(TreeNode root) {

        // Base case: if the tree is empty
        if (root == null) {
            return 0;
        }

        // If it's a leaf node, return its value
        if (root.left == null && root.right == null) {
            return root.val;
        }

        // Recursively sum up leaf nodes in left and right subtrees
        int leftSum = sumOfLeaves(root.left);
        int rightSum = sumOfLeaves(root.right);

        // Return the sum of leaf nodes in left and right subtrees
        return leftSum + rightSum;
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
    sumOfLeaves(root: TreeNode | null): number {

        // Base case: if the tree is empty
        if (!root) {
            return 0;
        }

        // If it's a leaf node, return its value
        if (!root.left && !root.right) {
            return root.val;
        }

        // Recursively sum up leaf nodes in left and right subtrees
        const leftSum = this.sumOfLeaves(root.left);
        const rightSum = this.sumOfLeaves(root.right);

        // Return the sum of leaf nodes in left and right subtrees
        return leftSum + rightSum;
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
    sumOfLeaves(root) {

        // Base case: if the tree is empty
        if (!root) {
            return 0;
        }

        // If it's a leaf node, return its value
        if (!root.left && !root.right) {
            return root.val;
        }

        // Recursively sum up leaf nodes in left and right subtrees
        const leftSum = this.sumOfLeaves(root.left);
        const rightSum = this.sumOfLeaves(root.right);

        // Return the sum of leaf nodes in left and right subtrees
        return leftSum + rightSum;
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

// Diagram: from typing import List, Optional

class Solution:
    def sum_of_leaves(self, root: Optional[TreeNode]) -> int:

        # Base case: if the tree is empty
        if not root:
            return 0

        # If it's a leaf node, return its value
        if not root.left and not root.right:
            return root.val

        # Recursively sum up leaf nodes in left and right subtrees
        left_sum = self.sum_of_leaves(root.left)
        right_sum = self.sum_of_leaves(root.right)

        # Return the sum of leaf nodes in left and right subtrees
        return left_sum + right_sum
```

The stateless postorder traversal can solve this problem in linear time and a single pass using a very small and concise recursive implementation.

## Example problems

Most problems that fall under this category are**easy**problems; a list of a few is given below.

> -   **[Sum of leaves](https://www.codeintuition.io/courses/binary-tree/QHxIbEyUDSpAdwnh4cLUe)**
> -   **[Height of binary tree](https://www.codeintuition.io/courses/binary-tree/GXFycvfMF94E4A14c4kdA)**
> -   **[Maximum path sum](https://www.codeintuition.io/courses/binary-tree/CcYCZ_L78G0WUZuAl79GI)**
> -   **[Full binary tree](https://www.codeintuition.io/courses/binary-tree/3hGrmGdmfToloxwvwOnW2)**
> -   **[Perfect binary tree](https://www.codeintuition.io/courses/binary-tree/zR72stwj9vKOH5MyCVooC)**
> -   **[Collect leaves](https://www.codeintuition.io/courses/binary-tree/o9xBIUwXA7q8D4kRWOlwE)**

We will now solve these problems to understand the stateless postorder traversal technique better.

***

# Sum of leaves

## Problem Statement

Given the **root** of a binary tree, write a function to calculate and return the sum of all its leaf nodes.

### Example 1

> -   **Input:** root = \[1, 2, 5, 7, null, null, 3\]
> -   **Output:** 10
> -   **Explanation:** The sum of leaves of the given binary trees is 7 + 3 = 10.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 9, 7\]
> -   **Output:** 24
> -   **Explanation:** The sum of leaves in the given binary tree is 8 + 9 + 7 = 24.

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
    int sumOfLeaves(TreeNode *root) {

        // Base case: if the tree is empty
        if (!root) {
            return 0;
        }

        // If it's a leaf node, return its value
        if (!root->left && !root->right) {
            return root->val;
        }

        // Recursively sum up leaf nodes in left and right subtrees
        int leftSum = sumOfLeaves(root->left);
        int rightSum = sumOfLeaves(root->right);

        // Return the sum of leaf nodes in left and right subtrees
        return leftSum + rightSum;
    }
};
```

***

# Height of binary tree

## Problem Statement

Given the **root** of a binary tree, write a function to find and return the height of this binary tree.

A binary height is the number of nodes along the longest path from the root node down to the farthest leaf node.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** 3
> -   **Explanation:** The height of the given tree is 3 as shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\]
> -   **Output:** 3
> -   **Explanation:** The height of the given tree is 3 as shown in the diagram above.

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
    int heightOfBinaryTree(TreeNode *root) {

        // Empty tree has height 0
        if (root == nullptr) {
            return 0;
        }

        // Recursively calculate the height of the left and right
        // subtrees
        int leftHeight = heightOfBinaryTree(root->left);
        int rightHeight = heightOfBinaryTree(root->right);

        // Return the maximum height among the left and right subtrees
        // plus 1 for the current node
        return max(leftHeight, rightHeight) + 1;
    }
};
```

***

# Maximum path sum

## Problem Statement

Given the **root** of a binary tree, write a function to calculate and return the maximum sum of all the **root to leaf** paths.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** 11
> -   **Explanation:** The given tree has a maximum root to leaf path sum = 11 as shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\]
> -   **Output:** 12
> -   **Explanation:** The given tree has a maximum root to leaf path sum = 12 as shown in the diagram above.

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
    int maximumPathSum(TreeNode *root) {

        // Empty tree
        if (root == nullptr) {
            return 0;
        }

        // Recursive calls to calculate the maximum sum of left and
        // right subtrees
        int leftSum = maximumPathSum(root->left);
        int rightSum = maximumPathSum(root->right);

        // Return the maximum sum of root-to-leaf paths
        return root->val + max(leftSum, rightSum);
    }
};
```

***

# Full binary tree

## Problem Statement

Given the **root** of a binary tree, write a function that returns `true` if it is a full binary tree and `false` otherwise.

A full Binary tree is a binary tree in which every node has two or no children. It is also known as a **proper** binary tree.

### Example 1

> -   **Input:** root = \[1, 2, 3, null, null, 2\]
> -   **Output:** false
> -   **Explanation:** The given binary tree is not a full binary tree as shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 3, 5\]
> -   **Output:** true
> -   **Explanation:** The given binary tree is a full binary tree as shown in the diagram above.

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
    bool fullBinaryTree(TreeNode *root) {

        // An empty tree is a full binary tree
        if (!root) {
            return true;
        }

        // A node with no children is a full binary tree
        if (!root->left && !root->right) {
            return true;
        }

        // A node with only one child is not a full binary tree
        if (!root->left || !root->right) {
            return false;
        }

        // Check if the left and right subtrees are also full binary
        // trees
        bool isLeftSubtreeFull = fullBinaryTree(root->left);
        bool isRightSubtreeFull = fullBinaryTree(root->right);

        // Return true if both subtrees are full binary trees
        return isLeftSubtreeFull && isRightSubtreeFull;
    }
};
```

***

# Perfect binary tree

## Problem Statement

Given the **root** of a binary tree, write a function that returns `true` if it is a perfect binary tree and `false` otherwise.

A perfect binary tree is a special binary tree in which all the leaf nodes are at the same depth, and all non-leaf nodes have two children.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** false
> -   **Explanation:** The given binary tree is not a perfect binary tree as shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, 3, 5, 2, 7\]
> -   **Output:** true
> -   **Explanation:** The given binary tree is a perfect binary tree as shown in the diagram above.

## Solution

```cpp
#include <math.h>

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
    int findDepth(TreeNode *root) {
        int depth = 0;
        while (root) {
            depth++;
            root = root->left;
        }
        return depth;
    }

    bool isPerfectBinaryTree(TreeNode *root, int depth, int level) {

        // An empty tree is a perfect binary tree
        if (!root) {
            return true;
        }

        // If it is a leaf node, check if it is at the correct depth
        if (!root->left && !root->right) {
            return depth == level + 1;
        }

        // If an internal node has only one child, it's not a perfect
        // binary tree
        if (!root->left || !root->right) {
            return false;
        }

        // Recursively check the left and right subtrees
        bool isLeftSubtreePerfect =
            isPerfectBinaryTree(root->left, depth, level + 1);
        bool isRightSubtreePerfect =
            isPerfectBinaryTree(root->right, depth, level + 1);

        // Return true if both subtrees are perfect
        return isLeftSubtreePerfect && isRightSubtreePerfect;
    }

    bool perfectBinaryTree(TreeNode *root) {

        // An empty tree is a perfect binary tree
        if (!root) {
            return true;
        }

        // Find the depth of the leftmost leaf
        int depth = findDepth(root);

        // Check if the tree is perfect
        return isPerfectBinaryTree(root, depth, 0);
    }
};
```

***

# Collect leaves

## Problem Statement

Given the **root** of a binary tree, write a function to return a list of lists containing the leaves of this binary tree. The leaves must be collected in the following order.

> -   Collect all the leaves of the binary tree from left to right.
> -   Remove all the leaves of this binary tree.
> -   Repeat the above process until the tree is empty.

### Example 1

> -   **Input:** root = \[1, 2, 1, 7, null, null, 1\]
> -   **Output:** \[\[7, 1\], \[2, 1\], \[1\]\]
> -   **Explanation:** The collection of leaves is shown in the above diagram.

### Example 2

> -   **Input:** root = \[1, 6, 5, null, null, 2, 7\]
> -   **Output:** \[\[6, 2, 7\], \[5\], \[1\]\]
> -   **Explanation:** The collection of leaves is shown in the above diagram.

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
    int findHeight(TreeNode *root, vector<vector<int>> &result) {

        // If root is nullptr, return -1.
        if (root == nullptr) {
            return -1;
        }

        // Recursively find the height of the left and right subtrees.
        int leftHeight = findHeight(root->left, result);
        int rightHeight = findHeight(root->right, result);

        // Calculate the height of the current node.
        int height = max(leftHeight, rightHeight) + 1;

        // If the result vector's size is less than or equal to the
        // height of the node, add a new empty vector to the result
        // vector.
        if (result.size() <= height) {
            result.push_back(vector<int>());
        }

        // Add the current node's value to the vector at the current
        // node's height.
        result[height].push_back(root->val);

        // Return the height of the current node.
        return height;
    }

    vector<vector<int>> collectLeaves(TreeNode *root) {

        // Vector of vectors to store leaf nodes at each height.
        vector<vector<int>> result;

        // Find the height of the tree and collect leaf nodes.
        findHeight(root, result);

        // Return result vector.
        return result;
    }
};
```
