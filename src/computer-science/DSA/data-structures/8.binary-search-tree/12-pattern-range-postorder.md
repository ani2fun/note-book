# Pattern: Range postorder

## Table of Contents

1. [Understanding the range postorder pattern](#understanding-the-range-postorder-pattern)
2. [Identifying the range postorder pattern](#identifying-the-range-postorder-pattern)
3. [Range summation](#range-summation)
4. [Range diameter](#range-diameter)
5. [Range leaves](#range-leaves)
6. [Range exclusive trim](#range-exclusive-trim)

***

# Understanding the range postorder pattern

A binary search tree follows the binary search property where all nodes in the left subtree of a node are smaller than it, while all nodes in the right subtree are greater than it. This property allows for the efficient searching of values in the tree. However, some binary search tree problems require us to find and process not just a single node but all nodes whose value lies in a specified range. Some problems go a step further and may require aggregating these processed values over some function into a single value. Such problems can be efficiently solved using the range postorder technique.

The range postorder pattern is a classification of problems that can be solved using the range postorder technique.

In this lesson, we will learn more about using the range postorder technique to solve binary search tree problems and how to identify a problem as a range postorder pattern problem.

## The range postorder technique

Consider we are given a binary search tree, and a range of values denoted by `low` and `high`, and we need to process all the nodes with values within this range using the aggregated value of the function `f` over all nodes in their left and right subtree that also lie within the range.

Another way to look at the problem is to imagine that we have a transformed tree that only has nodes within the specified range and that we need to process every node in this transformed tree using the aggregated value of a function `f` over all nodes in its left and right subtrees.

Consider the example below where we are given a binary search tree of characters where `low = c`  and `high = h`.

// Diagram: All nodes within the given range make up a transformed tree.

The diagram below shows for all nodes in the range, the aggregated values of nodes that they need to be processed with. The other way to look at it is to map it to the transformed tree, where every node is processed with the aggregated value of all nodes in its left and right subtrees. The leaf nodes are processed with a default value.

// Diagram: aggregates of node to use

We can solve the problem without creating a transformed tree by simply combining the binary search and postorder traversal algorithms.

The idea is quite simple: we start from the root node and pass the range `low` and `high`, and check if the current node lies within that range. If the value of the current node is less than `low`, it means its left subtree, including itself, is outside the range and does not need to be processed. Similarly, if the value of the current node is greater than `high`, it means its right subtree, including itself, is outside the range and does not need to be processed.

However, if the current has a value between `low` and `high`, it means it needs to be processed using aggregates from its left and right subtrees. And so, we recursively traverse the left and right subtrees of the node and apply the same logic to get the aggregated value of all nodes that lie within the range from the left and right subtrees, respectively, and store them in local variables `left` and `right`. We use the aggregates from the left and right subtrees to process the node.

Finally, we aggregate `left` and `right` to using function `f` to get the aggregated value of all nodes in the subtree starting at the current node that lie within `low` and `high` and return it to the parent node. If the parent node also lies within the range, it gets aggregated values from both its left and right subtrees and aggregates them similarly using the function `f` before passing it to its parent. If the parent node does not lie within the range, the passed value from its child is forwarded to its parent as is.

This way, in the end, all nodes in the tree that lie within `low` and `high` are processed using the aggregated value of `f` over all nodes within the range from their left and right subtrees, and the aggregate for the tree is returned to the calling function.

// Diagram: Process nodes within a range with aggregated value of f over nodes within range in its subtrees

## Algorithm

The generic algorithm given below uses a mix of binary search and postorder traversal algorithm to process all nodes in the specified range using aggregated values of nodes within the range from their left and right subtrees over the function `f`.

> **processRange(node, low, high)**
>
> -   **Step 1:** If this is a \`null\` node, return a default value.
> -   **Step 2:** If \`node.val\` is less than low, return the result of \`processRange(node.right, low, high)
> -   **Step 3:** If \`node.val\` is greater than high, return the result of \`processRange(node.left, low, high)
> -   **Step 5:** \`left\` = Call \`processRange(node.left, low, high)\`
> -   **Step 6:** \`right\` = Call \`processRange(node.right, low, high)\`
> -   **Step 7:** Use the aggregates \`left\` and \`right\` to process this node
> -   **Step 8:** Return \`f(left, right)\`

## Implementation

The implementation of the range postorder technique is given below. The `processRange` function process all nodes in the specified range using the aggregated value of the function `f` over all nodes within the range in their left and right subtrees

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
       int processRange(TreeNode *node, int low, int high) {

           if (!node) {
               // Return a default value if this is a null node;
               return 0;
           }

          if (node->val < low) {
               // If the current node's value is less than low, discard the left subtree
               // and return the result from the right subtree
               return processRange(node->right, low, high);
           } else if (node->val > high) {
               // If the current node's value is greater than high, discard the right subtree
               // and return the result from the left subtree
               return processRange(node->left, low, high);
           }

// Diagram: // Process the node using the values from left and right subtrees

          // If the current node's value is within range
          // find the aggregated values from left and right subtrees
          int left = processRange(node->left, low, high);
          int right = processRange(node->right, low, high);

          // Process the node using the aggregates from the left and right subtrees
          // ... Your code goes here
          // ...

          // Return the agregated value of :
          // 1. aggregate from the left subtree
          // 2. aggregate from the right subtrees
          // 3. the current node's value
          return f(left, right, node->val);

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

// Diagram: public class Solution {

// Diagram: public int processRange(TreeNode node, int low, int high) {

        if (node == null) {
            // Return a default value if this is a null node;
            return 0;
        }

        if (node.val < low) {
            // If the current node's value is less than low, discard the left subtree
            // and return the result from the right subtree
            return processRange(node.right, low, high);
        } else if (node.val > high) {
            // If the current node's value is greater than high, discard the right subtree
            // and return the result from the left subtree
            return processRange(node.left, low, high);
        }

// Diagram: // Process the node using the values from left and right subtrees

        // If the current node's value is within range
        // find the aggregated values from left and right subtrees
        int left = processRange(node.left, low, high);
        int right = processRange(node.right, low, high);

        // Process the node using the aggregates from the left and right subtrees
        // ... Your code goes here
        // ...

        // Return the aggregated value of:
        // 1. aggregate from the left subtree
        // 2. aggregate from the right subtree
        // 3. the current node's value
        return f(left, right, node.val);
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
  processRange(node: TreeNode | null, low: number, high: number): number {

    if (!node) {
      // Return a default value if this is a null node;
      return 0;
    }

    if (node.val < low) {
      // If the current node's value is less than low, discard the left subtree
      // and return the result from the right subtree
      return this.processRange(node.right, low, high);
    } else if (node.val > high) {
      // If the current node's value is greater than high, discard the right subtree
      // and return the result from the left subtree
      return this.processRange(node.left, low, high);
    }

// Diagram: // Process the node using the values from left and right subtrees

    // If the current node's value is within range
    // find the aggregated values from left and right subtrees
    const left = this.processRange(node.left, low, high);
    const right = this.processRange(node.right, low, high);

    // Process the node using the aggregates from the left and right subtrees
    // ... Your code goes here
    // ...

    // Return the aggregated value of :
    // 1. aggregate from the left subtree
    // 2. aggregate from the right subtrees
    // 3. the current node's value
    return f(left, right, node.val);
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
  processRange(node, low, high) {

    if (!node) {
      // Return a default value if this is a null node;
      return 0;
    }

    if (node.val < low) {
      // If the current node's value is less than low, discard the left subtree
      // and return the result from the right subtree
      return this.processRange(node.right, low, high);
    } else if (node.val > high) {
      // If the current node's value is greater than high, discard the right subtree
      // and return the result from the left subtree
      return this.processRange(node.left, low, high);
    }

// Diagram: // Process the node using the values from left and right subtrees

    // If the current node's value is within range
    // find the aggregated values from left and right subtrees
    const left = this.processRange(node.left, low, high);
    const right = this.processRange(node.right, low, high);

    // Process the node using the aggregates from the left and right subtrees
    // ... Your code goes here
    // ...

    // Return the aggregated value of :
    // 1. aggregate from the left subtree
    // 2. aggregate from the right subtrees
    // 3. the current node's value
    return f(left, right, node.val);
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
    def processRange(self, node: Optional[TreeNode], low: int, high: int) -> int:

        if not node:
            # Return a default value if this is a null node;
            return 0

        if node.val < low:
            # If the current node's value is less than low, discard the left subtree
            # and return the result from the right subtree
            return self.processRange(node.right, low, high)
        elif node.val > high:
            # If the current node's value is greater than high, discard the right subtree
            # and return the result from the left subtree
            return self.processRange(node.left, low, high)

        # Process the node using the values from left and right subtrees

        # If the current node's value is within range
        # find the aggregated values from left and right subtrees
        left = self.processRange(node.left, low, high)
        right = self.processRange(node.right, low, high)

        # Process the node using the aggregates from the left and right subtrees
        # ... Your code goes here
        # ...

        # Return the aggregated value of:
        # 1. aggregate from the left subtree
        # 2. aggregate from the right subtree
        # 3. the current node's value
        return f(left, right, node.val)
```

## Complexity Analysis

We follow the search path in the binary tree, but instead of looking for a single value, we look for an entire range. On finding a node within the range, we recursively traverse both its left and right subtrees. However, in any case, we discard all the nodes that don't lie within the range and only process the nodes with values within the range. Therefore, the algorithm's time complexity depends on the number of nodes in the tree whose value lies within the specified range. 

If the function `g` is a constant **O(1)** time operation, in the worst case, if all nodes in the tree lie within the range, we traverse all nodes in the tree, which will take linear **O(N)** time. In the best case, only one node lies within the range, so the time complexity will be the same as that of the search algorithm, which depends on the shape of the tree. If the tree is height balanced, it will take **O(log(N))** time; otherwise, it may take linear **O(N)** time if it is a degenerate tree and the node within the range is a leaf node.

The space complexity of inorder traversal depends on the maximum size of the function call stack, which can be linear **O(N)** in the worst case and **O(log(N))** in the best case. However, each stack frame also creates its own copy of local variables, but each of them only makes a constant contribution to the size of the frame, so the overall space complexity is the same as the space required for the stack frames.

> **Best Case:** Balanced tree with only one node in the range
>
> -   Space Complexity - **O(log(N))**
> -   Time Complexity - **O(log(N))**
>
> **Worst Case:** All nodes in the range or a degenerate tree with only a leaf node in the range
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Identifying the range postorder pattern

The range binary postorder technique can solve some special types of binary search tree problems. These are generally **medium** problems in which we are given a range and need to process every node in the tree within that range. In most problems, to process a node, we need the aggregated values of some function `f` over all the nodes in its left and right subtree that also lie within the given range. The technique is a mix of binary search and the postorder technique

If the problem statement or its solution follows the generic template below, it can be solved by applying the range postorder technique.

**Template:**

Given a binary search tree and a range, process every node within the range using the aggregated value of a function `f` over nodes in its left and right subtrees that also lie within the given range.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the range postorder technique.

> **Problem statement:** Given a binary search tree, and a range represented by \`low\` and \`high\`. To all nodes in the tree that lie within the range, add the value of all descendant nodes that also lie within the range.

// Diagram: Add to all nodes within the given range the sum of all descendent within the same range.

## The range postorder technique

The problem description fits the generic template for the range postorder pattern we learned earlier.

**Template:**

Given a binary search tree and a range (`low` and `high`), process every node within the range using the aggregated value of a function `f` (sum) over nodes in its left and right subtrees that also lie within the given range.

We start from the root node and pass the range `low` and `high`, where each node returns to its parent the sum of all nodes in its subtree that lie within `low` and `high`.

As we enter a node, we check if it lies within the range. If it is a `null` reference, we return 0 to the parent. Otherwise, if the node's value is less than `low`, it means its left subtree, including itself, is outside the range and does not need to be updated. Similarly, if the node's value is greater than `high`, it means its right subtree, including itself, is outside the range and does not need to be updated.

However, if the current has a value between `low` and `high`, it means it needs to be updated by adding the sum of all nodes within the range in its left and right subtrees. And so, we recursively traverse the left and right subtrees of the node and store the return values in local variables `left` and `right`. We then update the node by adding `left` and `right` to the current node's value.

Finally, we return the updated value of the node, which is also the sum of all nodes in the subtree rooted at this node that lie within the given range, to the parent node. If the parent node also lies within the range, it also gets values from both its left and right subtrees and updates its value similarly before returning the sum to its parent. Otherwise, it simply returns the value it receives from its child to its parent.

This way, at the end of the top-level recursive call, all nodes in the tree that lie within the range `low` and `high` are updated, and the calling function receives the sum of all those nodes.

// Diagram: Add to all nodes within the given range the sum of all descendants within the same range

The implementation of the range postorder traversal technique to solve the problem is given below.

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
    int rangeSummationHelper(TreeNode *root, int low, int high) {

        // Base Case : if root is null return null
        if (root == nullptr) {
            return 0;
        }

        // If the node's value is less than the lower bound,
        // discard the left subtree and move to the right subtree
        if (root->val < low) {
            return rangeSummationHelper(root->right, low, high);
        }

        // If the node's value is greater than the upper bound,
        // discard the right subtree and move to the left subtree
        if (root->val > high) {
            return rangeSummationHelper(root->left, low, high);
        }

        // If the node's value is within the range [low, high],
        // recursively compute the sum of valid left and right subtrees
        int leftSum = rangeSummationHelper(root->left, low, high);
        int rightSum = rangeSummationHelper(root->right, low, high);

        // Add sum of in-range descendants to the current node's value
        root->val += leftSum + rightSum;

        // Return the updated value of the current node
        // (which now includes valid descendants)
        return root->val;
    }

    void rangeSummation(TreeNode *root, int low, int high) {
        rangeSummationHelper(root, low, high);
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
    public int rangeSummationHelper(TreeNode root, int low, int high) {

        // Base Case : if root is null return 0
        if (root == null) {
            return 0;
        }

        // If the node's value is less than the lower bound,
        // discard the left subtree and move to the right subtree
        if (root.val < low) {
            return rangeSummationHelper(root.right, low, high);
        }

        // If the node's value is greater than the upper bound,
        // discard the right subtree and move to the left subtree
        if (root.val > high) {
            return rangeSummationHelper(root.left, low, high);
        }

        // If the node's value is within the range [low, high],
        // recursively compute the sum of valid left and right subtrees
        int leftSum = rangeSummationHelper(root.left, low, high);
        int rightSum = rangeSummationHelper(root.right, low, high);

        // Add sum of in-range descendants to the current node's value
        root.val += leftSum + rightSum;

        // Return the updated value of the current node
        // (which now includes valid descendants)
        return root.val;
    }

    public void rangeSummation(TreeNode root, int low, int high) {
        rangeSummationHelper(root, low, high);
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
    rangeSummationHelper(
        root: TreeNode | null,
        low: number,
        high: number
    ): number {

        // Base Case : if root is null return 0
        if (!root) {
            return 0;
        }

        // If the node's value is less than the lower bound,
        // discard the left subtree and move to the right subtree
        if (root.val < low) {
            return this.rangeSummationHelper(root.right, low, high);
        }

        // If the node's value is greater than the upper bound,
        // discard the right subtree and move to the left subtree
        if (root.val > high) {
            return this.rangeSummationHelper(root.left, low, high);
        }

        // If the node's value is within the range [low, high],
        // recursively compute the sum of valid left and right subtrees
        const leftSum = this.rangeSummationHelper(root.left, low, high);
        const rightSum = this.rangeSummationHelper(
            root.right,
            low,
            high
        );

        // Add sum of in-range descendants to the current node's value
        root.val += leftSum + rightSum;

        // Return the updated value of the current node
        // (which now includes valid descendants)
        return root.val;
    }

    rangeSummation(
        root: TreeNode | null,
        low: number,
        high: number
    ): void {
        this.rangeSummationHelper(root, low, high);
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
    rangeSummationHelper(root, low, high) {

        // Base Case : if root is null return 0
        if (!root) {
            return 0;
        }

        // If the node's value is less than the lower bound,
        // discard the left subtree and move to the right subtree
        if (root.val < low) {
            return this.rangeSummationHelper(root.right, low, high);
        }

        // If the node's value is greater than the upper bound,
        // discard the right subtree and move to the left subtree
        if (root.val > high) {
            return this.rangeSummationHelper(root.left, low, high);
        }

        // If the node's value is within the range [low, high],
        // recursively compute the sum of valid left and right subtrees
        const leftSum = this.rangeSummationHelper(root.left, low, high);
        const rightSum = this.rangeSummationHelper(
            root.right,
            low,
            high
        );

        // Add sum of in-range descendants to the current node's value
        root.val += leftSum + rightSum;

        // Return the updated value of the current node
        // (which now includes valid descendants)
        return root.val;
    }

    rangeSummation(root, low, high) {
        this.rangeSummationHelper(root, low, high);
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
    def range_summation_helper(
        self, root: Optional[TreeNode], low: int, high: int
    ) -> int:

        # Base Case : if root is null return 0
        if root is None:
            return 0

        # If the node's value is less than the lower bound,
        # discard the left subtree and move to the right subtree
        if root.val < low:
            return self.range_summation_helper(root.right, low, high)

        # If the node's value is greater than the upper bound,
        # discard the right subtree and move to the left subtree
        if root.val > high:
            return self.range_summation_helper(root.left, low, high)

        # If the node's value is within the range [low, high],
        # recursively compute the sum of valid left and right subtrees
        left_sum = self.range_summation_helper(root.left, low, high)
        right_sum = self.range_summation_helper(root.right, low, high)

        # Add sum of in-range descendants to the current node's value
        root.val += left_sum + right_sum

        # Return the updated value of the current node
        # (which now includes valid descendants)
        return root.val

    def range_summation(
        self, root: Optional[TreeNode], low: int, high: int
    ) -> None:
        self.range_summation_helper(root, low, high)
```

The range postorder technique can solve this problem in linear time and a single pass using a very small and concise recursive implementation.

## Example problems

Most problems that fall under this category are**medium**problems; a list of a few is given below.

> -   **[Range summation](https://www.codeintuition.io/courses/binary-search-tree/CA72mnsXeJqKTxXM-Wv6S)**
> -   **[Range diameter](https://www.codeintuition.io/courses/binary-search-tree/l80uGC-uzQiwBvRCzldjq)**
> -   **[Range leaves](https://www.codeintuition.io/courses/binary-search-tree/P6QRd9i95RQyT5oKM2ghX)**
> -   **[Range exclusive trim](https://www.codeintuition.io/courses/binary-search-tree/7nzLLkASbZX-t6YPYBlNO)**

We will now solve these problems to understand the range postorder technique better.

***

# Range summation

## Problem Statement

Given the **root** of a binary search tree and a range represented by **low** and **high**, write a function to update each node within this range by adding the values of all its descendant nodes that also lie within the same range.

It is guaranteed that if a node’s value is outside `[low, high]`, all nodes in its left and right subtrees are also out of range.

### Example 1

> -   **Input:** root = \[4, 2, 5, 1, 3, null, 6\], low = 2, high = 5
> -   **Output:** \[14, 5, 5, 1, 3, null, 6\]
> -   **Explanation:** The updated tree is shown in the diagram above.

### Example 2

> -   **Input:** root = \[5, 1, 8, null, null, 6, 9\], low = 6, high = 9
> -   **Output:** \[5, 1, 23, null, null, 6, 9\]
> -   **Explanation:** The updated tree is shown in the diagram above.

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
    int rangeSummationHelper(TreeNode *root, int low, int high) {

        // Base Case : if root is null return null
        if (root == nullptr) {
            return 0;
        }

        // If the node's value is less than the lower bound,
        // discard the left subtree and move to the right subtree
        if (root->val < low) {
            return rangeSummationHelper(root->right, low, high);
        }

        // If the node's value is greater than the upper bound,
        // discard the right subtree and move to the left subtree
        if (root->val > high) {
            return rangeSummationHelper(root->left, low, high);
        }

        // If the node's value is within the range [low, high],
        // recursively compute the sum of valid left and right subtrees
        int leftSum = rangeSummationHelper(root->left, low, high);
        int rightSum = rangeSummationHelper(root->right, low, high);

        // Add sum of in-range descendants to the current node's value
        root->val += leftSum + rightSum;

        // Return the updated value of the current node
        // (which now includes valid descendants)
        return root->val;
    }

    void rangeSummation(TreeNode *root, int low, int high) {
        rangeSummationHelper(root, low, high);
    }
};
```

***

# Range diameter

## Problem Statement

Given the **root** of a binary search tree and a range represented by **low** and **high**, write a function to find and return the diameter of the largest subtree in which every node’s value lies within the inclusive range `[low, high]`.

It is guaranteed that if a node’s value is outside `[low, high]`, all nodes in its left and right subtrees are also out of range.

The diameter of a binary tree is the longest distance between any two nodes in the tree, whether or not they pass through the root. The distance here is defined by the number of edges in the path.

### Example 1

> -   **Input:** root = \[4, 2, 5, 1, 3, null, 6\], low = 2, high = 5
> -   **Output:** 3
> -   **Explanation:** The diameter of the subtree is shown in the diagram.

### Example 2

> -   **Input:** root = \[5, 1, 8, null, null, 6, 9\], low = 6, high = 9
> -   **Output:** 2
> -   **Explanation:** The diameter of the subtree is shown in the diagram.

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

    // Global variable to calculate the diameter of the tree
    int diameter = 0;

    int rangeDiameterHelper(TreeNode *root, int low, int high) {

        // Base Case : if root is null return null
        if (root == nullptr) {
            return 0;
        }

        // If the node's value is less than the lower bound,
        // discard the left subtree and move to the right subtree
        if (root->val < low) {
            return rangeDiameterHelper(root->right, low, high);
        }

        // If the node's value is greater than the upper bound,
        // discard the right subtree and move to the left subtree
        if (root->val > high) {
            return rangeDiameterHelper(root->left, low, high);
        }

        // Calculate the height of the left and right subtrees
        // recursively
        int leftHeight = rangeDiameterHelper(root->left, low, high);
        int rightHeight = rangeDiameterHelper(root->right, low, high);

        // Update the diameter if the sum of the left and right subtree
        // heights is greater
        diameter = max(diameter, leftHeight + rightHeight);

        // Return the height of the current subtree
        // (maximum height of left or right subtree + 1)
        return max(leftHeight, rightHeight) + 1;
    }

    int rangeDiameter(TreeNode *root, int low, int high) {

        // Call the helper function to calculate the height of the tree
        // in the range [low, high] and update the diameter
        rangeDiameterHelper(root, low, high);

        return diameter;
    }
};
```

***

# Range leaves

## Problem Statement

Given the **root** of a binary search tree and a range represented by **low** and **high**, write a function to update each non-leaf node whose value lies within the range with the number of leaf nodes in its subtree whose values also lie within the same range.

It is guaranteed that if a node’s value is outside `[low, high]`, all nodes in its left and right subtrees are also out of range.

### Example 1

> -   **Input:** root = \[4, 2, 5, 1, 3, null, 6\], low = 2, high = 5
> -   **Output:** \[1, 1, 0, 1, 3, null, 6\]
> -   **Explanation:** Once all non-leaf nodes within the specified range have been updated to reflect the count of leaf nodes in their subtrees that also lie within the range, the resulting tree is as illustrated above.

### Example 2

> -   **Input:** root = \[5, 1, 8, null, null, 6, 9\], low = 6, high = 9
> -   **Output:** \[5, 1, 2, null, null, 6, 9\]
> -   **Explanation:** Once all non-leaf nodes within the specified range have been updated to reflect the count of leaf nodes in their subtrees that also lie within the range, the resulting tree is as illustrated above.

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
    int rangeLeavesHelper(TreeNode *root, int low, int high) {

        // Base Case : if root is null return 0
        if (root == nullptr) {
            return 0;
        }

        // If the node's value is less than the lower bound,
        // discard the left subtree and move to the right subtree
        if (root->val < low) {
            return rangeLeavesHelper(root->right, low, high);
        }

        // If the node's value is greater than the upper bound,
        // discard the right subtree and move to the left subtree
        if (root->val > high) {
            return rangeLeavesHelper(root->left, low, high);
        }

        // If it's a leaf node, return 1
        if (!root->left && !root->right) {

            // Return 1 since it's a leaf node
            return 1;
        }

        // If the node's value is within the range [low, high],
        // recursively trim its left and right subtrees
        int leftLeaves = rangeLeavesHelper(root->left, low, high);
        int rightLeaves = rangeLeavesHelper(root->right, low, high);

        // Update the current node's value with the count of leaves in
        // its subtrees
        root->val = leftLeaves + rightLeaves;

        // Return the total count of leaves in the current subtree
        return root->val;
    }

    void rangeLeaves(TreeNode *root, int low, int high) {

        // Call the helper function to calculate the count of leaves
        // in the range [low, high] and update the node values
        rangeLeavesHelper(root, low, high);
    }
};
```

***

# Range leaves

***

# Range exclusive trim

## Problem Statement

Given the **root** of a binary search tree and two values, **low** and **high**, write a function to trim this binary search tree so that it only contains nodes whose values lie in the inclusive range of `[low, high]`.

The relative structure of the remaining nodes should remain the same, meaning that if a node has a descendant in the original tree, then that descendant should stay in the trimmed tree.

### Example 1

> -   **Input:** root = \[4, 2, 5, 1, 3, null, 6\], low = 2, high = 5
> -   **Output:** \[4, 2, 5, null, 3\]
> -   **Explanation:** The trimmed tree is shown in the above diagram.

### Example 2

> -   **Input:** root = \[5, 1, 8, null, null, 6, 9\], low = 6, high = 9
> -   **Output:** \[8, 6, 9\]
> -   **Explanation:** The trimmed tree is shown in the above diagram.

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
    TreeNode *rangeExclusiveTrim(TreeNode *root, int low, int high) {

        // Base Case : if root is null return null
        if (root == nullptr) {
            return nullptr;
        }

        // If the node's value is less than the lower bound,
        // discard the left subtree and trim the right subtree
        if (root->val < low) {
            return rangeExclusiveTrim(root->right, low, high);
        }

        // If the node's value is greater than the upper bound,
        // discard the right subtree and trim the left subtree
        if (root->val > high) {
            return rangeExclusiveTrim(root->left, low, high);
        }

        // If the node's value is within the range [low, high],
        // recursively trim its left and right subtrees
        root->left = rangeExclusiveTrim(root->left, low, high);
        root->right = rangeExclusiveTrim(root->right, low, high);

        // Return the trimmed root
        return root;
    }
};
```
