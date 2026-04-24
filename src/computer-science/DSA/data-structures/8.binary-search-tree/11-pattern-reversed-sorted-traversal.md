# Pattern: Reversed sorted traversal

## Table of Contents

1. [Understanding the reversed sorted traversal pattern](#understanding-the-reversed-sorted-traversal-pattern)
2. [Identifying the reverse sorted traversal pattern](#identifying-the-reverse-sorted-traversal-pattern)
3. [Rank nodes](#rank-nodes)
4. [Kth Largest element](#kth-largest-element)
5. [Enriched sum tree](#enriched-sum-tree)
6. [Multiple replacement](#multiple-replacement)

***

# Understanding the reversed sorted traversal pattern

Some problems require us to traverse the nodes of a binary search tree in the reverse sorted order of their values. The inorder traversal traverses the nodes in the sorted order of the values of the nodes. However, the reverse inorder traversal that follows the right-node-left sequence traverses the nodes in the tree in the sorted order(**descending**) of their values. This is because a binary search tree follows the binary search property where all the nodes in the left subtree of a node have values smaller than it, and all the nodes in the right subtree have values greater than it. And Ssoso, the reverse inorder traversal can be used to traverse the nodes in a binary search tree in the reverse sorted order(**descending**) of its values.

The reverse sorted traversal pattern is a classification of problems that can be solved using the reverse sorted traversal technique.

// Diagram: The reverse inorder traversal traverses the binary search tree in the reverse sorted order (descending) of node values.

In this lesson, we will learn more about using the reverse sorted traversal technique to solve binary search tree problems and how to identify a problem as a reverse sorted traversal pattern problem.

## The reverse sorted traversal technique

Consider we are given a binary search tree, and we need to process every node using the function`f` in the reverse sorted order (**descending**) of values of the nodes. We also need to aggregate all the processed values over a function `g` in the same order.

// Diagram: Process all nodes in the sorted order (ascending) of values using function f and aggregate the processed values using function g.

We know that the reverse inorder traversal of a binary search tree traverses the tree in the reverse sorted order of values. We create a variable `aggregate` in the calling function and initialize it with a default value.

We then start the reverse inorder traversal from the root node of the tree, passing `aggregate` as a reference that recursively traverses to the right until it reaches a node for which the left subtree is a `null` reference. Hitting a `null` reference is the base case for this recursive execution, where we return to the parent node and process it using the function `f` and store the result in a local variable `output`. We then add the contribution of `output` to `aggregate` using the function `g`. The left subtree is then recursively processed in the same way.

This way, in the end, all nodes in the tree are processed using the function `f` in the reverse sorted order (**descending**) of their values, and the processed values aggregated over the function `g` in `aggregate` in the same order.

// Diagram: Process nodes in reverse sorted order using the function f and aggregate them over function g

## Algorithm

The generic algorithm given below uses the reverse inorder traversal to process all the nodes in the tree using the function `f` in the reverse sorted order(**descending**) of their values, and aggregate the processed values over the function `g` in the same order.

> **Algorithm**
>
> -   Step 1: Create a variable \`aggregate\` and initialize it with a default value
> -   Step 2: Call \`reverseInorder(root, aggregate)\`
>
> **reverseInorder(node, \[ref\]aggregate)**
>
> -   **Step 1:** If this is a \`null\` node, return
> -   **Step 2:** Call \`reverseInorder(node.right, aggregate)\`
> -   **Step 3:** \`output\` = \`f(node.val)\`
> -   **Step 4:** Use the function \`g\` to add the contribution of \`output\` to \`aggregate\`
> -   **Step 5:** Call \`reverseInorder(node.left, aggregate)\`
> -   **Step 6:** Return

## Implementation

The implementation of the reverse sorted traversal technique is given below. The `reverseInorder` function processed nodes in the reverse sorted order of their values using the function `f` and aggregates the processed values over the function `g` in the same order.

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
           reverseInorder(root, aggregate);

           // Return the aggregated value
           return aggregate;
       }
       void reverseInorder(TreeNode *node, int& aggregate) {

           if (!node) {
               // Return if this is a null node;
               return;
           }

           // Traverse the right subtree
           reverseInorder(node->right, aggregate);

           // Process the current node
           int output = f(node->val);
           // Add contribution of current node
           aggregate = g(aggregate, node->val);

           // Traverse the left subtree
           reverseInorder(node->left, aggregate);

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

        // Traverse the binary tree in reverseInorder traversal
        reverseInorder(root);

        // Return the aggregated value
        return aggregate;
    }

// Diagram: private void reverseInorder(TreeNode node) {

        if (node == null) {
            // Return if this is a null node;
            return;
        }

        // Traverse the right subtree
        reverseInorder(node.right);

        // Process the current node
        int output = f(node.val);

        // Add contribution of current node
        aggregate = g(aggregate, node.val);

        // Traverse the left subtree
        reverseInorder(node.left);
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

    // Traverse the binary tree in reverseInorder traversal
    this.reverseInorder(root);

    // Return the aggregated value
    return this.aggregate;
  }

  reverseInorder(node: TreeNode | null): void {
    if (!node) {
      // Return if this is a null node
      return;
    }

    // Traverse the right subtree
    this.reverseInorder(node.right);

    // Process the current node
    const output = f(node.val);
    // Add contribution of current node
    this.aggregate = g(this.aggregate, node.val);

    // Traverse the left subtree
    this.reverseInorder(node.left);
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

    // Traverse the binary tree in reverseInorder traversal
    this.reverseInorder(root);

    // Return the aggregated value
    return this.aggregate;
  }

  reverseInorder(node) {
    if (!node) {
      // Return if this is a null node
      return;
    }

    // Traverse the right subtree
    this.reverseInorder(node.right);

    // Process the current node
    const output = f(node.val);
    // Add contribution of current node
    this.aggregate = g(this.aggregate, node.val);

    // Traverse the left subtree
    this.reverseInorder(node.left);
  }
```

Python

```python
/**
```

## Complexity Analysis

It is quite easy to figure out the time and space complexity of the solution. We traverse the entire tree using the reverse inorder traversal that takes linear **O(N)** time, and apply the function `f` and then function `g` on every node. And so, the overall time complexity depends on the time complexity of the function `f` and `g`. Considering both of them are constant time **O(1)** operations, the overall time complexity is linear **O(N)** in any case.

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

# Identifying the reverse sorted traversal pattern

The reverse sorted traversal technique can solve some specific types of binary search tree problems. These are generally **easy** problems where we need to process every node using the function`f` in the reverse sorted order (**descending**) of values of the nodes. We may also need to aggregate all the processed values over a function `g` in the same order. In cases where the same copy of some data must be shared between all nodes, those variables are created in the calling function or the enclosing scope.

If the problem statement or its solution follows the generic template below, it can be solved by applying the sorted traversal technique.

**Template:**

Given a binary search tree, process every node using the function `f` in the reverse sorted (**descending**) order of node values, and aggregate the results over a function `g`.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the reverse sorted traversal technique.

> **Problem statement:** Given a binary search tree, and an integer \`k\`, find the kth largest value in the tree.

// Diagram: Find the kth largest element in a binary search tree

## The reverse sorted traversal technique

The problem description fits the generic template for the reverse sorted traversal pattern we learned earlier.

**Template:**

Given a binary search tree, process every node using the function `f` (count) in the reverse sorted (**descending**) order of node values, and aggregate the results over a function `g` (last value)

We create two variables, `count` and `result` in the enclosing scope, to hold the number of nodes traversed and the value of the kth largest element, and initialize them with 0. These variables are created in the enclosing scope to ensure that the same copy is shared between all the nodes during the inorder traversal.

We then start the reverse inorder traversal from the root node, where each node returns to its parent a boolean value denoting if the kth largest element was found. This way, we can terminate the traversal and rewind when we find the kth largest element.

The reverse inorder traversal recursively traverses to the right subtree of a node until it hits a `null` reference before processing a node. Hitting a `null` reference is the base case of the recursive call, and we return `false` to the parent. The return value from the right subtree is saved in a local variable `found` and checked if it is true. If true, it means the kth largest element was found while traversing the right subtree, and we terminate further traversal by returning true to the parent node.

If `found` is false, we process the current node by incrementing the value of `count` and checking if `count` is equal to `k`. If it is equal to `k`, it means the current node is the kth largest element, and we save its value in `result` and return true to the parent node. If not, it means the kth largest element will be found further ahead in the traversal, and so, we recursively traverse the left subtree and return the value returned by it to the parent node.

This way, the reverse inorder traversal will traverse the tree in the reverse sorted (**descending**) order and terminate and rewind on finding the kth largest element after storing it in `result`.

// Diagram: Find the kth largest element in a binary search tree

The implementation of the reverse sorted traversal technique to solve the problem is given below.

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
    int count;
    int result;

    bool reverseInOrder(TreeNode *root, int k) {
        if (root == nullptr) {
            return false;
        }

        // Traverse the right subtree and save the return value
        bool found = reverseInOrder(root->right, k);

        // Check if the kth largest element was found in the right subtree
        if (found) return true;

        // Increment the count
        count++;

        // If the count matches k, we have found the kth largest element
        if (count == k) {
            result = root->val;
            return true;
        }

        // Traverse the left subtree
        return reverseInOrder(root->left, k);
    }

// Diagram: int kthLargestElement(TreeNode root, int k) {

        // Reset the count and result variables
        // Counter to keep track of the kth element
        count = 0;

        // Variable to store the kth largest element
        result = 0;

        // Perform reverse in-order traversal
        reverseInOrder(root, k);

        return result;
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

    // Counter to keep track of the kth element
    private int count;

    // Variable to store the kth largest element
    private int result;

    public boolean reverseInOrder(TreeNode root, int k) {
        if (root == null) {
            return false;
        }

        // Traverse the right subtree and save the return value
        boolean found = reverseInOrder(root.right, k);

        // Check if the kth largest element was found in the right subtree
        if (found) return true;

        // Increment the count
        count++;

        // If the count matches k, we have found the kth largest element
        if (count == k) {
            result = root.val;
            return true;
        }

        // Traverse the left subtree
        return reverseInOrder(root.left, k);
    }

// Diagram: public int kthLargestElement(TreeNode root, int k) {

        // Reset the count and result variables
        count = 0;
        result = 0;

        // Perform reverse in-order traversal
        reverseInOrder(root, k);

        return result;
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
  // Counter to keep track of the kth element
  private count: number = 0;

  // Variable to store the kth largest element
  private result: number = 0;

  reverseInOrder(root: TreeNode | null, k: number): boolean {
    if (root === null) {
      return false;
    }

    // Traverse the right subtree and save the return value
    const found = this.reverseInOrder(root.right, k);

    // Check if the kth largest element was found in the right subtree
    if (found) return true;

    // Increment the count
    this.count++;

    // If the count matches k, we have found the kth largest element
    if (this.count === k) {
      this.result = root.val;
      return true;
    }

    // Traverse the left subtree
    return this.reverseInOrder(root.left, k);
  }

  kthLargestElement(root: TreeNode | null, k: number): number {
    // Reset the count and result variables
    this.count = 0;
    this.result = 0;

    // Perform reverse in-order traversal
    this.reverseInOrder(root, k);

    return this.result;
  }
```

Javascript

```javascript
/**
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

class Solution:
    def __init__(self) -> None:
        # Counter to keep track of the kth element
        self.count: int = 0

        # Variable to store the kth largest element
        self.result: int = 0

    def reverseInOrder(self, root: Optional[TreeNode], k: int) -> bool:
        if root is None:
            return False

        # Traverse the right subtree and save the return value
        found = self.reverseInOrder(root.right, k)

        # Check if the kth largest element was found in the right subtree
        if found:
            return True

        # Increment the count
        self.count += 1

        # If the count matches k, we have found the kth largest element
        if self.count == k:
            self.result = root.val
            return True

        # Traverse the left subtree
        return self.reverseInOrder(root.left, k)

    def kthLargestElement(self, root: Optional[TreeNode], k: int) -> int:
        # Reset the count and result variables
        self.count = 0
        self.result = 0

        # Perform reverse in-order traversal
        self.reverseInOrder(root, k)

        return self.result
```

The reverse sorted traversal technique can solve this problem in linear time and a single pass using a very small and concise recursive implementation.

## Example problems

Most problems that fall under this category are**easy**problems; a list of a few is given below.

> -   **[Rank nodes](https://www.codeintuition.io/courses/binary-search-tree/zGlNZgMHrRYUxH3gKoge0)**
> -   **[Kth Largest element](https://www.codeintuition.io/courses/binary-search-tree/dpJELPDGc4MpVBNpvbQ4I)**
> -   **[Enriched sum tree](https://www.codeintuition.io/courses/binary-search-tree/B1AO9g0lg6TR4_pSKnUvS)**
> -   **[Multiple replacement](https://www.codeintuition.io/courses/binary-search-tree/U9yqE1JszwfCxoKv2AlXk)**

We will now solve these problems to understand the reverse sorted traversal technique better.

***

# Rank nodes

## Problem Statement

Given the **root** of a binary search tree, write a function that replaces each node’s value with its rank in descending order.

The ranks start with `1`.

### Example 1

> -   **Input:** root = \[4, 2, 5, 1, 3, null, 6\]
> -   **Output:** \[3, 5, 2, 6, 4, null, 1\]
> -   **Explanation:** After ranking all the nodes in the binary search tree, we get the above result.

### Example 2

> -   **Input:** root = \[5, 4, 10, null, null, 9, 11\]
> -   **Output:** \[4, 5, 2, null, null, 3, 1\]
> -   **Explanation:** After ranking all the nodes in the binary search tree, we get the above result.

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

    // Variable to keep track of the running rank of the tree
    int rank = 1;

    void rankNodes(TreeNode *root) {

        // Base case
        if (root == nullptr) {
            return;
        }

        // Recursively process the right subtree
        rankNodes(root->right);

        // Update the current node's value
        root->val = rank;

        // Increment the rank for the next node
        rank++;

        // Recursively process the left subtree
        rankNodes(root->left);
    }
};
```

***

# Rank nodes

***

# Kth Largest element

## Problem Statement

Given the **root** of a binary search tree and an integer value **k**, write a function to find and return the kth largest element in the BST. Return `0` if the value does not exist.

### Example 1

> -   **Input:** root = \[4, 2, 5, 1, 3, null, 6\], k = 3
> -   **Output:** 4
> -   **Explanation:** The 3rd largest element in the node with the value 4.

### Example 2

> -   **Input:** root = \[5, 4, 10, null, null, 9, 11\], k = 2
> -   **Output:** 10
> -   **Explanation:** The 2nd largest element in the node with the value 10.

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

    // Counter to keep track of the kth element
    int count = 0;

    // Variable to store the kth largest element
    int result = 0;

    // Flag to indicate if the kth largest element has been found
    bool found = false;

    void reverseInOrder(TreeNode *root, int k) {

        // If the root is null or the kth largest element is already
        // found, we don't need to traverse further
        if (root == nullptr || found) {
            return;
        }

        // Traverse the right subtree
        reverseInOrder(root->right, k);

        // Increment the count
        count++;

        // If the count matches k, we have found the kth largest element
        if (count == k) {
            result = root->val;
            found = true;
            return;
        }

        // Traverse the left subtree
        reverseInOrder(root->left, k);
    }

    int kthLargestElement(TreeNode *root, int k) {

        // Perform reverse in-order traversal
        reverseInOrder(root, k);

        return result;
    }
};
```

***

# Enriched sum tree

## Problem Statement

Given the **root** of a binary search tree, write a function to convert it to an enriched sum tree.

 An enriched sum tree is a binary tree where the value of every node is the sum of its original value and the values of all the nodes greater than it.

### Example 1

> -   **Input:** root = \[4, 2, 5, 1, 3, null, 6\]
> -   **Output:** \[15, 20, 11, 21, 18, null, 6\]
> -   **Explanation:** The enriched sum tree for the given binary search tree is shown in the diagram above.

### Example 2

> -   **Input:** root = \[5, 4, 10, null, null, 9, 11\]
> -   **Output:** \[35, 39, 21, null, null, 30, 11\]
> -   **Explanation:** The enriched sum tree for the given binary search tree is shown in the diagram above.

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

    // Variable to keep track of the running sum of the tree
    int sum = 0;

    void enrichedSumTree(TreeNode *root) {

        // Base case
        if (root == nullptr) {
            return;
        }

        // Recursively process the right subtree
        enrichedSumTree(root->right);

        // Update the running sum with the current node's value
        sum += root->val;

        // Update the current node's value
        root->val = sum;

        // Recursively process the left subtree
        enrichedSumTree(root->left);
    }
};
```

***

# Multiple replacement

## Problem Statement

Given the **root** of a binary search tree, `0` if its successor’s value is a multiple of its own.

### Example 1

> -   **Input:** root = \[6, 2, 5, 1, 4, null, 10\]
> -   **Output:** \[6, 0, 0, 0, 4, null, 10\]
> -   **Explanation:** After updating all nodes whose successor’s value is a multiple of their own to \`0\`, we obtain the above result.

### Example 2

> -   **Input:** root = \[5, 4, 10, null, null, 9, 11\]
> -   **Output:** \[5, 4, 10, null, null, 9, 11\]
> -   **Explanation:** None of the nodes need to be updated, as none of the successors are multiples of their predecessor nodes.

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

    // Variable to keep track of the value of the
    // previous node
    int prevNodeVal;

    // Flag to check if previous node exists
    bool hasPrevNode = false;

    void multipleReplacement(TreeNode *root) {

        // Base case
        if (root == nullptr) {
            return;
        }

        // Recursively process the right subtree
        multipleReplacement(root->right);

        // Store the original value of the current node
        int originalVal = root->val;

        // If the previous node's value is a multiple of the current
        // node's value, replace the current node's value with 0
        if (hasPrevNode && prevNodeVal != 0 &&
            prevNodeVal % root->val == 0) {
            root->val = 0;
        }

        // Update the previous node to the current node's original value
        prevNodeVal = originalVal;

        // Set the flag to true indicating that previous
        // node exists
        hasPrevNode = true;

        // Recursively process the left subtree
        multipleReplacement(root->left);
    }
};
```
