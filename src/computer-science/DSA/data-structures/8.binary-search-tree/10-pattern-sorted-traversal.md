# Pattern: Sorted traversal

## Table of Contents

1. [Understanding the sorted traversal pattern](#understanding-the-sorted-traversal-pattern)
2. [Identifying the sorted traversal pattern](#identifying-the-sorted-traversal-pattern)
3. [Lowest absolute variance](#lowest-absolute-variance)
4. [BST validator](#bst-validator)
5. [BST to sorted array](#bst-to-sorted-array)
6. [BST to DLL](#bst-to-dll)

***

# Understanding the sorted traversal pattern

Some problems require us to traverse the nodes of a binary search tree in the sorted order of their values. Different traversal algorithms like preorder, postorder, etc., traverse the nodes of the tree following different sequences. However, the inorder traversal that follows the left-node-right sequence traverses the nodes in the tree in the sorted order(**ascending**) of their values. This is because a binary search tree follows the binary search property where all the nodes in the left subtree of a node have values smaller than it, and all the nodes in the right subtree have values greater than it. And so the inorder traversal can be used to traverse the nodes in a binary search tree in the sorted order(**ascending**) of its values.

The sorted traversal pattern is a classification of problems that can be solved using the sorted traversal technique.

// Diagram: The inorder traversal traverses the binary search tree in the sorted order (ascending) of node values.

In this lesson, we will learn more about using the sorted traversal technique to solve binary search tree problems and how to identify a problem as a sorted traversal pattern problem.

## The sorted traversal technique

Consider we are given a binary search tree, and we need to process every node using the function`f` in the sorted order (**ascending**) of values of the nodes. We also need to aggregate all the processed values over a function `g` in the same order.

// Diagram: Process all nodes in the sorted order (ascending) of values using function f and aggregate the processed values using function g.

We do an inorder traversal of the binary search tree as it traverses the tree in the sorted order of values. To share the same copy of the variable that will hold the final aggregated value between all nodes, we create a variable `aggregate` in the calling function and initialize it with a default value. For languages that do not support passing variables by reference, this variable can be created in the enclosing scope.

We then start the inorder traversal from the root node of the tree, passing `aggregate` as a reference that recursively traverses to the left until it reaches a node for which the left subtree is a `null` reference. Hitting a `null` reference is the base case for this recursive execution, where we return to the parent node and process it using the function `f` and store the result in a local variable `output`. We then add the contribution of `output` to `aggregate` using the function `g`. The right subtree is then recursively processed in the same way.

This way, in the end, all nodes in the tree are processed using the function `f` in the sorted order (**ascending**) of their values, and the processed values aggregated over the function `g` in `aggregate` in the same order.

// Diagram: Process nodes in sorted order using the function f and aggregate them over function g

## Algorithm

The generic algorithm given below uses the inorder traversal to process all the nodes in the tree using the function `f` in the sorted order(**ascending**) of their values, and aggregate the processed values over the function `g` in the same order.

> **Algorithm**
>
> -   Step 1: Create a variable `aggregate` and initialize it with a default value
> -   Step 2: Call `inorder(root, aggregate)`
>
> **inorder(node, \[ref\]aggregate)**
>
> -   **Step 1:** If this is a `null` node, return
> -   **Step 2:** Call `inorder(node.left, aggregate)`
> -   **Step 3:** `output` = `f(node.val)`
> -   **Step 4:** Use the function `g` to add the contribution of `output` to `aggregate`
> -   **Step 5:** Call `inorder(node.right, aggregate)`
> -   **Step 6:** Return

## Implementation

The implementation of the sorted traversal technique is given below. The `inorder` function processed nodes in the sorted order of their values using the function `f` and aggregates the processed values over the function `g` in the same order.

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
      int callingFunction(TreeNode* root) {

          // Initialize aggregate with a default value
          int aggregate = 0;

          // Traverse the binary tree in preorder traversal
          inorder(root, aggregate);

          // Return the aggregated value
          return aggregate;
      }
      void inorder(TreeNode *node, int& aggregate) {

          if (!node) {
              // Return if this is a null node;
              return;
          }

          // Traverse the left subtree
          inorder(node->left, aggregate);

          // Process the current node
          int output = f(node->val);
          // Add contribution of current node
          aggregate = g(aggregate, node->val);

          // Traverse the right subtree
          inorder(node->right, aggregate);

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

    // Declare aggregate as a class-level variable since Java does not support pass-by-reference
    private int aggregate = 0;

// Diagram: public int callingFunction(TreeNode root) {

        // Initialize aggregate with a default value
        aggregate = 0;

        // Traverse the binary tree in inorder traversal
        inorder(root);

        // Return the aggregated value
        return aggregate;
    }

// Diagram: private void inorder(TreeNode node) {

        if (node == null) {
            // Return if this is a null node;
            return;
        }

        // Traverse the left subtree
        inorder(node.left);

        // Process the current node
        int output = f(node.val);

        // Add contribution of current node
        aggregate = g(aggregate, node.val);

        // Traverse the right subtree
        inorder(node.right);
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
  private aggregate: number = 0;

  callingFunction(root: TreeNode | null): number {
    // Initialize aggregate with a default value
    this.aggregate = 0;

    // Traverse the binary tree in inorder traversal
    this.inorder(root);

    // Return the aggregated value
    return this.aggregate;
  }

  inorder(node: TreeNode | null): void {
    if (!node) {
      // Return if this is a null node
      return;
    }

    // Traverse the left subtree
    this.inorder(node.left);

    // Process the current node
    const output = f(node.val);
    // Add contribution of current node
    this.aggregate = g(this.aggregate, node.val);

    // Traverse the right subtree
    this.inorder(node.right);
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

class Solution {
  aggregate = 0;

  callingFunction(root) {
    // Initialize aggregate with a default value
    this.aggregate = 0;

    // Traverse the binary tree in inorder traversal
    this.inorder(root);

    // Return the aggregated value
    return this.aggregate;
  }

  inorder(node) {
    if (!node) {
      // Return if this is a null node
      return;
    }

    // Traverse the left subtree
    this.inorder(node.left);

    // Process the current node
    const output = f(node.val);
    // Add contribution of current node
    this.aggregate = g(this.aggregate, node.val);

    // Traverse the right subtree
    this.inorder(node.right);
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
        # Class-level variable to hold the aggregate value
        self.aggregate: int = 0

    def callingFunction(self, root: Optional[TreeNode]) -> int:

        # Initialize aggregate with a default value
        self.aggregate = 0

        # Traverse the binary tree in inorder traversal
        self.inorder(root)

        # Return the aggregated value
        return self.aggregate

    def inorder(self, node: Optional[TreeNode]) -> None:

        if not node:
            # Return if this is a null node
            return

        # Traverse the left subtree
        self.inorder(node.left)

        # Process the current node
        output = f(node.val)
        # Add contribution of current node
        self.aggregate = g(self.aggregate, node.val)

        # Traverse the right subtree
        self.inorder(node.right)
```

## Complexity Analysis

It is quite easy to figure out the time and space complexity of the solution. We traverse the entire tree using the inorder traversal that takes linear **O(N)** time, and apply the function `f` and then function `g` on every node. And so, the overall time complexity depends on the time complexity of the function `f` and `g`. Considering both of them are constant time **O(1)** operations, the overall time complexity is linear **O(N)** in any case.

The space complexity of inorder traversal depends on the maximum size of the function call stack, which can be linear **O(N)** if the tree is a degenerate binary tree where every node only has one child and **O(log(N))** if it is a complete binary tree. However, each stack frame also creates its own copy of local variables, but each of them only makes a constant contribution to the size of the frame, so the overall space complexity is the same as the space required for the stack frames.

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

# Identifying the sorted traversal pattern

The sorted traversal technique can solve some specific types of binary search tree problems. These are generally **easy** problems where we need to process every node using the function`f` in the sorted order (**ascending**) of values of the nodes. We may also need to aggregate all the processed values over a function `g` in the same order. In cases where the same copy of some data must be shared between all nodes, those variables are created in the calling function or the enclosing scope.

If the problem statement or its solution follows the generic template below, it can be solved by applying the sorted traversal technique.

**Template:**

Given a binary search tree, process every node using the function `f` in the sorted (**ascending**) order of node values, and aggregate the results over a function `g`.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the sorted traversal technique.

> **Problem statement:** Given a binary search tree, find the minimum absolute difference between the values of any two different nodes in the tree.

// Diagram: Find the minimum absolute difference between two nodes

## The sorted traversal technique

If we arrange all the nodes in the binary search tree in the sorted(ascending) order of node values, say `v1, v2, v3 ... vn`. The sorted nature of these values guarantees that `|vi+1 - vi| < |vj - vi|` such that `1 < i <n` and `i+1 < j <= n` . 

Conversely, this means that differences between non-consecutive items will always be greater than the difference between some consecutive items. And so, we can ignore the difference between non-consecutive values and only consider the difference between consecutive values when node values are arranged in sorted (**ascending**) order.

// Diagram: We can ignore the difference between non-consecutive items when they are arranged in the sorted order of values.

Since we are given a binary search tree, the inorder traversal of the tree results in traversal of nodes in the sorted (**ascending**) order of its values.

// Diagram: The inorder traversal of a binary search tree traverses the nodes in the sorted order of values.

The solution fits the generic template for the sorted traversal pattern we learned earlier.

**Template:**

Given a binary search tree, process every node using the function `f` (difference from previous node) in the sorted (**ascending**) order of node values, and aggregate the results over a function `g` (minimum)

We create two variables, `minDiff` and `prevNode` in the enclosing scope to hold the minimum absolute difference and the previous node during the inorder traversal, and initialize them with `infinite` and `null` respectively. These variables are created in the enclosing scope to ensure that the same copy is shared between all the nodes during the inorder traversal.

We then start the inorder traversal from the root node that traverses the tree in the sorted order(ascending) of values. To process a node, if `prevNode` is not `null`, we take the absolute difference between the value of the current node and the node in `prevNode`. If the difference is less than `minDiff`, we update `minDiff` to this value, otherwise we do nothing. We then update `prevNode` to hold the current node before moving to the right subtree recursively.

This way, at the end of inorder traversal, we would have compared the absolute difference between all consecutive nodes in sorted order (ascending) of values and `minDiff` will have the minimum absolute difference between any two nodes in the tree.

// Diagram: Find the minimum absolute difference between two nodes

The implementation of the sorted traversal technique to solve the problem is given below.

C++

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

// Diagram: using namespace std;

class Solution {
public:
    int minDiff = INT_MAX;
    TreeNode *prevNode = nullptr;

    void inorder(TreeNode *root) {
        if (root == nullptr) {
            return;
        }

        // Traverse left subtree
        inorder(root->left);

        // Check the difference with the previous node
        if (prevNode != nullptr) {
            minDiff = min(minDiff, root->val - prevNode->val);
        }

        // Update the previous node
        prevNode = root;

        // Traverse right subtree
        inorder(root->right);
    }

// Diagram: int lowestAbsoluteVariance(TreeNode root) {

        // Perform in-order traversal
        inorder(root);

        return minDiff;
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

    // Initialize minDiff to a large value
    private int minDiff = Integer.MAX_VALUE;
    private TreeNode prevNode = null;

    private void inorder(TreeNode root) {
        if (root == null) {
            return;
        }

        // Traverse left subtree
        inorder(root.left);

        // Check the difference with the previous node
        if (prevNode != null) {
            minDiff = Math.min(minDiff, root.val - prevNode.val);
        }

        // Update the previous node
        prevNode = root;

        // Traverse right subtree
        inorder(root.right);
    }

// Diagram: public int lowestAbsoluteVariance(TreeNode root) {

        // Perform in-order traversal
        inorder(root);

        return minDiff;
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
    minDiff: number = Number.MAX_SAFE_INTEGER;
    prevNode: TreeNode | null = null;

    inorder(root: TreeNode | null): void {
        if (root === null) {
            return;
        }

        // Traverse left subtree
        this.inorder(root.left);

        // Check the difference with the previous node
        if (this.prevNode !== null) {
            this.minDiff = Math.min(
                this.minDiff,
                root.val - this.prevNode.val
            );
        }

        // Update the previous node
        this.prevNode = root;

        // Traverse right subtree
        this.inorder(root.right);
    }

// Diagram: lowestAbsoluteVariance(root: TreeNode | null): number {

        // Perform in-order traversal
        this.inorder(root);

        return this.minDiff;
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
    minDiff = Number.MAX_SAFE_INTEGER;
    prevNode = null;

    inorder(root) {
        if (root === null) {
            return;
        }

        // Traverse left subtree
        this.inorder(root.left);

        // Check the difference with the previous node
        if (this.prevNode !== null) {
            this.minDiff = Math.min(
                this.minDiff,
                root.val - this.prevNode.val
            );
        }

        // Update the previous node
        this.prevNode = root;

        // Traverse right subtree
        this.inorder(root.right);
    }

// Diagram: lowestAbsoluteVariance(root) {

        // Perform in-order traversal
        this.inorder(root);

        return this.minDiff;
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

        # Initialize min_diff to a large value
        self.min_diff = float("inf")
        self.prev_node = None

    def inorder(self, root: Optional[TreeNode]):
        if root is None:
            return

        # Traverse left subtree
        self.inorder(root.left)

        # Check the difference with the previous node
        if self.prev_node is not None:
            self.min_diff = min(
                self.min_diff, root.val - self.prev_node.val
            )

        # Update the previous node
        self.prev_node = root

        # Traverse right subtree
        self.inorder(root.right)

    def lowest_absolute_variance(self, root: Optional[TreeNode]) -> int:

        # Perform in-order traversal
        self.inorder(root)

        return self.min_diff
```

The sorted traversal technique can solve this problem in linear time and a single pass using a very small and concise recursive implementation.

## Example problems

Most problems that fall under this category are**easy**problems; a list of a few is given below.

> -   **[Lowest absolute variance](https://www.codeintuition.io/courses/binary-search-tree/2LY5j7WB9RVdsoZrGKCnT)**
> -   **[BST validator](https://www.codeintuition.io/courses/binary-search-tree/m6rGRHwW1i6agm77i-YYS)**
> -   **[BST to sorted array](https://www.codeintuition.io/courses/binary-search-tree/DLCg4iQEB0byNEdtOyGXJ)**
> -   **[BST to DLL](https://www.codeintuition.io/courses/binary-search-tree/neR3xSa5MmaNouF5lOM2F)**

We will now solve these problems to understand the sorted traversal technique better.

***

# Lowest absolute variance

## Problem Statement

Given the **root** of a binary search tree, write a function to find and return the lowest absolute variance between the values of any two different nodes in the tree.

Lowest absolute variance between two values is the minimum absolute difference between them.

### Example 1

> -   **Input:** root = \[5, 4, 8, 2, null, null, 10\]
> -   **Output:** 1
> -   **Explanation:** The lowest absolute variance is 1, which is between the nodes with values 4 and 5.

### Example 2

> -   **Input:** root = \[10, 8, 14, 5, null, 12, 17\], key = 14
> -   **Output:** 2
> -   **Explanation:** The lowest absolute variance is 2, which is between the nodes with values 8 and 10, and also nodes 14 and 12.

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

    // Variable to keep track of the minimum difference
    int minDiff = INT_MAX;

    // Reference to keep track of the previous node
    TreeNode *prevNode = nullptr;

    void inorder(TreeNode *root) {
        if (root == nullptr) {
            return;
        }

        // Traverse left subtree
        inorder(root->left);

        // Check the difference with the previous node
        if (prevNode != nullptr) {
            minDiff = min(minDiff, root->val - prevNode->val);
        }

        // Update the previous node
        prevNode = root;

        // Traverse right subtree
        inorder(root->right);
    }

    int lowestAbsoluteVariance(TreeNode *root) {

        // Perform in-order traversal
        inorder(root);

        // Return the minimum difference found
        return minDiff;
    }
};
```

***

# BST validator

## Problem Statement

Given the **root** of a binary search tree, write a function that returns `true` if the given tree is a binary search tree and `false` otherwise. A valid binary search tree has the following properties:

> -   Every node has a key, and no two nodes have the same key.
> -   The left subtree of a node contains only nodes with keys less than the node's key.
> -   The right subtree of a node contains only nodes with keys greater than the node's key.
> -   The left and right subtrees must also be binary search trees.

### Example 1

> -   **Input:** root = \[4, 2, 5, 1, 3, null, 6\]
> -   **Output:** true
> -   **Explanation:** The given tree is a binary search tree as it follows all its properties.

### Example 2

> -   **Input:** root = \[9, 5, 12, 4, null, null, 11\]
> -   **Output:** false
> -   **Explanation:** The given tree is not a binary search tree as node 11 is smaller than parent 12 but is still the right child of the node with value 12 instead of being the left child.

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

    // Variable to keep track of the validity of the BST
    bool isValid = true;

    // Reference to keep track of the previous node
    TreeNode *prevNode = nullptr;

    void inorder(TreeNode *root) {
        if (!root || !isValid) {
            return;
        }

        // Traverse left subtree
        inorder(root->left);

        // Current node must be greater than the prevNodeious one in
        // inorder
        if (prevNode && root->val <= prevNode->val) {
            isValid = false;
            return;
        }

        // Update prevNodeious node
        prevNode = root;

        // Traverse right subtree
        inorder(root->right);
    }

    bool bstValidator(TreeNode *root) {

        // Perform in-order traversal
        inorder(root);

        // Return the validity of the BST
        return isValid;
    }
};
```

***

# BST to sorted array

## Problem Statement

Given the **root** binary search tree, write a function to return a sorted array made up of the values of the given binary tree.

### Example 1

> -   **Input:** root = \[4, 2, 5, 1, 3, null, 6\]
> -   **Output:** \[1, 2, 3, 4, 5, 6\]
> -   **Explanation:** The constructed array is shown in the diagram above.

### Example 2

> -   **Input:** root = \[9, 5, 10, 4, null, null, 11\]
> -   **Output:** \[4, 5, 9, 10, 11\]
> -   **Explanation:** The constructed array is shown in the diagram above.

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
    void inorder(TreeNode *root, vector<int> &result) {

        // Base case: If the node is nullptr, return
        if (root == nullptr) {
            return;
        }

        // Recursively traverse the left subtree
        inorder(root->left, result);

        // Visit the current node and add its value to the result vector
        result.push_back(root->val);

        // Recursively traverse the right subtree
        inorder(root->right, result);
    }

    vector<int> bstToSortedArray(TreeNode *root) {
        vector<int> result;

        // Call the helper function to perform inorder traversal
        inorder(root, result);

        // Return the result vector containing inorder traversal elements
        return result;
    }
};
```

***

# BST to DLL

***

# BST to sorted DLL

## Problem Statement

Given the **root** binary search tree, write a function to convert it in place to a sorted doubly linked list and return the head of this linked list.

### Example 1

> -   **Input:** root = \[4, 2, 5, 1, 3, null, 6\]
> -   **Output:** \[1, 2, 3, 4, 5, 6\]
> -   **Explanation:** The converted doubly linked list is shown in the diagram above.

### Example 2

> -   **Input:** root = \[9, 5, 10, 4, null, null, 11\]
> -   **Output:** \[4, 5, 9, 10, 11\]
> -   **Explanation:** The converted doubly linked list is shown in the diagram above.

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

    // Pointer to keep track of the head of the doubly linked list
    TreeNode *head = nullptr;

    // Pointer to the keep track of the tail of the doubly linked list
    TreeNode *tail = nullptr;

    void inorder(TreeNode *root) {

        // Base case: If the node is nullptr, return
        if (root == nullptr) {
            return;
        }

        // Recursively traverse the left subtree
        inorder(root->left);

        // If there is a tail, link it with the current root
        if (tail) {

            // Link the right (next) pointer of the tail to the current
            // root
            tail->right = root;

            // Link the left (previous) pointer of the current root to
            // the tail
            root->left = tail;
        }

        // If there is no tail, this is the first node being processed
        else {

            // Set the head to the current root
            head = root;

            // Set the left (previous) pointer of the head to nullptr
            root->left = nullptr;
        }

        // Update the tail to the current root
        tail = root;

        // Recursively traverse the right subtree
        inorder(root->right);
    }

    TreeNode *bstToSortedDll(TreeNode *root) {

        // If the tree is empty, return nullptr
        if (root == nullptr) {
            return nullptr;
        }

        // Call the helper function to perform inorder traversal
        inorder(root);

        // Ensure the right (next) pointer of the tail is null
        tail->right = nullptr;

        // Return the head of the doubly linked list
        return head;
    }
};
```
