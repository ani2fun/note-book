# Iterative searching in binary search trees

## Table of Contents

1. [Understanding iterative search](#understanding-iterative-search)
2. [Implement iterative search](#understanding-iterative-search)
3. [Understanding iterative minimum search](#understanding-iterative-minimum-search)
4. [Iteratively find minimum](#iteratively-find-minimum)
5. [Understanding iterative maximum search](#understanding-iterative-maximum-search)
6. [Iteratively find maximum](#iteratively-find-maximum)
7. [Understanding iterative lower bound search](#understanding-iterative-lower-bound-search)
8. [Iteratively find lower bound](#iteratively-find-lower-bound)
9. [Understanding iterative upper bound search](#understanding-iterative-upper-bound-search)
10. [Iteratively find upper bound](#iteratively-find-upper-bound)
11. [Closest value](#closest-value)

***

# Understanding iterative search

Iterative search also exploits the binary search property of a binary search tree and follows the same path as the recursive search algorithm. Since we know the direction we need to go at every step, the search algorithm can also be implemented iteratively using loops.

## Algorithm

Let us look at a binary search tree with a value we want to search to see how to use its unique property to speed up our simple traversal search algorithm.

// Diagram: Searching for a value in a binary search tree

**Don't we need an explicit stack like other iterative implementations of recursive algorithms?**

Unlike other iterative implementations of recursive algorithms where we need an explicit stack to replicate the behavior of the function call stack, we don't need a stack to implement the recursive search algorithm iteratively. Stacks are needed to hold references to tree nodes in the path so that we can **jump** back up in the tree. However, when searching for a value in a binary search tree, we only go in one direction (top to bottom) and never the other way around.

The iterative search operation in a binary search tree can be implemented as a very simple three-line algorithm that discards either the left or right subtree at every point until it finds the value to be searched or reaches the end of the tree.

> **Algorithm**
>
> -   **Step 1:** While `root` is not `null`, do the following:
>     -   **Step 1.1:** If the `root` node's value equals the `target`, return it.
>     -   **Step 1.2:** Else, if the `root` node's value exceeds the `target`, update the root node to hold the reference of its `left` child.
>     -   **Step 1.3:** Else, if the `root` node's value is less than the `target`, update the root node to hold the reference of its `right` child.

## Implementation

The iterative algorithm can be implemented simply using a while loop.

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
    TreeNode *iterativeSearch(TreeNode *root, int target) {

        // Loop until we reach the end of the tree (or find the desired
        // node)
        while (root) {

            // Check if the current node's value matches the target data
            if (root->val == target) {

                // Return the node since we found it
                return root;
            }

            // If the target data is smaller, move to the left subtree
            else if (target < root->val) {
                root = root->left;
            }

            // If the target data is larger, move to the right subtree
            else {
                root = root->right;
            }

        // If the while loop ends without finding the node, return
        // nullptr
        return nullptr;
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
    public TreeNode iterativeSearch(TreeNode root, int target) {

        // Loop until we reach the end of the tree (or find the desired
        // node)
        while (root != null) {

            // Check if the current node's value matches the target data
            if (root.val == target) {

                // Return the node since we found it
                return root;
            }

            // If the target data is smaller, move to the left subtree
            else if (target < root.val) {
                root = root.left;
            }

            // If the target data is larger, move to the right subtree
            else {
                root = root.right;
            }

        // If the while loop ends without finding the node, return null
        return null;
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
    iterativeSearch(
        root: TreeNode | null,
        target: number
    ): TreeNode | null {

        // Loop until we reach the end of the tree (or find the desired
        // node)
        while (root !== null) {

            // Check if the current node's value matches the target data
            if (root.val === target) {

                // Return the node since we found it
                return root;
            }

            // If the target data is smaller, move to the left subtree
            else if (target < root.val) {
                root = root.left;
            }

            // If the target data is larger, move to the right subtree
            else {
                root = root.right;
            }

        // If the while loop ends without finding the node, return null
        return null;
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
    iterativeSearch(root, target) {

        // Loop until we reach the end of the tree (or find the desired
        // node)
        while (root !== null) {

            // Check if the current node's value matches the target data
            if (root.val === target) {

                // Return the node since we found it
                return root;
            }

            // If the target data is smaller, move to the left subtree
            else if (target < root.val) {
                root = root.left;
            }

            // If the target data is larger, move to the right subtree
            else {
                root = root.right;
            }

        // If the while loop ends without finding the node, return null
        return null;
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
    def iterative_search(
        self, root: Optional[TreeNode], target: int
    ) -> Optional[TreeNode]:

        # Loop until we reach the end of the tree (or find the desired
        # node)
        while root:

            # Check if the current node's value matches the target data
            if root.val == target:

                # Return the node since we found it
                return root

            # If the target data is smaller, move to the left subtree
            elif target < root.val:
                root = root.left

            # If the target data is larger, move to the right subtree
            else:
                root = root.right

        # If the while loop ends without finding the node, return None
        return None
```

## Complexity Analysis

The algorithm we follow when searching for a value in a binary search tree only traverses the tree from top to bottom and, at every level, goes only in one direction, either left or right. So, we process only one root-to-leaf path when searching for a value in a binary search tree. In the worst case, this root-to-leaf path could be the longest.

// Diagram: Worst case time complexity

Since we do not use any variables or data structures to store any data, we are not using any extra space.

> **Best Case** - The binary search tree is height-balanced
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(logN)**
>
> **Worst Case** - The binary search tree is skewed to the left or right
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Iterative search

## Problem Statement

Given the **root** of a binary search tree and a **target** value, write a function to return the node with the given value. If there is no such node return `null`.

You must do this **iteratively**.

### Example 1

> -   **Input:** root = \[4, 2, 5, 1, 3, null, 6\], target = 3
> -   **Output:** 3
> -   **Explanation:** The given binary search tree has a node with the value 3.

### Example 2

> -   **Input:** root = \[5, 4, 10, null, null, 9, 11\], target = 20
> -   **Output:** null
> -   **Explanation:** The given binary search tree has no node with the value 20.

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
    TreeNode *iterativeSearch(TreeNode *root, int target) {

        // Loop until we reach the end of the tree (or find the desired
        // node)
        while (root) {

            // Check if the current node's value matches the target data
            if (root->val == target) {

                // Return the node since we found it
                return root;
            }

            // If the target data is smaller, move to the left subtree
            else if (target < root->val) {
                root = root->left;
            }

            // If the target data is larger, move to the right subtree
            else {
                root = root->right;
            }
        }

        // If the while loop ends without finding the node, return
        // nullptr
        return nullptr;
    }
};
```

***

# Understanding iterative minimum search

The iterative algorithm for finding the minimum value is very similar to the recursive algorithm. We replace recursive calls with a loop and keep going left until we reach a leaf node, where the minimum is.

// Diagram: Searching for the minimum value in a binary search tree

> **Algorithm**
>
> -   **Step 1:** While `root` is not `null`, do the following:
>     -   **Step 1.1:** If the `root` node does not have a `left` child, return it.
>     -   **Step 1.2:** Else, if the `root` node has a `left` child, update the `root` node to hold the reference of its `left` child.

## Implementation

The iterative algorithm can be implemented simply using a while loop.

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
    TreeNode *iterativelyFindMinimum(TreeNode *root) {

        // Start from the given root node and iterate until we reach
        // the leftmost node
        while (root) {

            // If the left child of the current node is nullptr, it means
            // we have reached the leftmost node, which contains the
            // minimum value in the binary search tree
            if (root->left == nullptr) {
                return root;
            }

            // If the left child is not nullptr, move to the left child
            // to continue the search for the minimum value.
            else {
                root = root->left;
            }

        // If the tree is empty (root is nullptr), or for some reason,
        // the while loop exits without finding the minimum node, we
        // return the current root
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

// Diagram: class Solution {

// Diagram: TreeNode iterativelyFindMinimum(TreeNode root) {

        // Start from the given root node and iterate until we reach
        // the leftmost node
        while (root != null) {

            // If the left child of the current node is null, it means
            // we have reached the leftmost node, which contains the
            // minimum value in the binary search tree
            if (root.left == null) {
                return root;
            }

            // If the left child is not null, move to the left child
            // to continue the search for the minimum value.
            else {
                root = root.left;
            }

        // If the tree is empty (root is null), or for some reason,
        // the while loop exits without finding the minimum node, we
        // return the current root
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
    iterativelyFindMinimum(root: TreeNode | null): TreeNode | null {

        // Start from the given root node and iterate until we reach
        // the leftmost node
        while (root) {

            // If the left child of the current node is null, it means
            // we have reached the leftmost node, which contains the
            // minimum value in the binary search tree
            if (root.left === null) {
                return root;
            }

            // If the left child is not null, move to the left child
            // to continue the search for the minimum value.
            else {
                root = root.left;
            }

        // If the tree is empty (root is null), or for some reason,
        // the while loop exits without finding the minimum node, we
        // return the current root
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
    iterativelyFindMinimum(root) {

        // Start from the given root node and iterate until we reach
        // the leftmost node
        while (root) {

            // If the left child of the current node is null, it means
            // we have reached the leftmost node, which contains the
            // minimum value in the binary search tree
            if (root.left === null) {
                return root;
            }

            // If the left child is not null, move to the left child
            // to continue the search for the minimum value.
            else {
                root = root.left;
            }

        // If the tree is empty (root is null), or for some reason,
        // the while loop exits without finding the minimum node, we
        // return the current root
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

// Diagram: from typing import Optional

class Solution:
    def iteratively_find_minimum(
        self, root: Optional[TreeNode]
    ) -> Optional[TreeNode]:

        # Start from the given root node and iterate until we reach
        # the leftmost node
        while root:

            # If the left child of the current node is null, it means
            # we have reached the leftmost node, which contains the
            # minimum value in the binary search tree
            if root.left is None:
                return root

            # If the left child is not null, move to the left child
            # to continue the search for the minimum value.
            else:
                root = root.left

        # If the tree is empty (root is null), or for some reason,
        # the while loop exits without finding the minimum node, we
        # return the current root
        return root
```

## Complexity Analysis

The algorithm we follow moves continuously to the left, starting from the root node. So, we process only one root-to-leaf path when searching for the minimum value in a binary search tree. In the worst case, this root-to-leaf path could be the longest.

// Diagram: Worst case time complexity

Since we do not use any variables or data structures to store any data, we are not using any extra space.

> **Best Case** - The binary search tree is height-balanced
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(logN)**
>
> **Worst Case** - The binary search tree is skewed to the left or right
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Iteratively find minimum

## Problem Statement

Given the **root** of a binary search tree, write a function to return the minimum value in it.

You must do this **iteratively**.

### Example 1

> -   **Input:** root = \[4, 2, 5, 1, 3, null, 6\]
> -   **Output:** 1
> -   **Explanation:** The minimum value in the given binary search tree is 1.

### Example 2

> -   **Input:** root = \[5, 4, 10, null, null, 9, 11\]
> -   **Output:** 4
> -   **Explanation:** The minimum value in the given binary search tree is 4.

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
    TreeNode *iterativelyFindMinimum(TreeNode *root) {

        // Start from the given root node and iterate until we reach
        // the leftmost node
        while (root) {

            // If the left child of the current node is nullptr, it means
            // we have reached the leftmost node, which contains the
            // minimum value in the binary search tree
            if (root->left == nullptr) {
                return root;
            }

            // If the left child is not nullptr, move to the left child
            // to continue the search for the minimum value.
            else {
                root = root->left;
            }
        }

        // If the tree is empty (root is nullptr), or for some reason,
        // the while loop exits without finding the minimum node, we
        // return the current root
        return root;
    }
};
```

***

# Understanding iterative maximum search

Finding the maximum value in a binary search tree iteratively is also quite simple since we only need to traverse in one direction, and so we can use a simple loop.

## Algorithm

The iterative algorithm for finding the maximum value is similar to the recursive algorithm. We replace recursive calls with a loop and keep going right until we reach the rightmost node, which is where the maximum is.

// Diagram: Searching for the maximum value in a binary search tree

> **Algorithm**
>
> -   **Step 1:** While `root` is not `null`, do the following:
>     -   **Step 1.1:** If the `root` node does not have a `right` chil,d return it.
>     -   **Step 1.2:** Else, if the `root` node has a `right` child, update the `root` node to hold the reference of its `right` child.

## Implementation

The iterative algorithm can be implemented simply using a while loop.

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
    TreeNode *iterativelyFindMaximum(TreeNode *root) {

        // Start from the given root node and iterate until we reach
        // the rightmost node
        while (root) {

            // If the left child of the current node is nullptr, it means
            // we have reached the rightmost node, which contains the
            // maximum value in the binary search tree
            if (root->right == nullptr) {
                return root;
            }

            // If the right child is not nullptr, move to the right child
            // to continue the search for the maximum value.
            else {
                root = root->right;
            }

        // If the tree is empty (root is nullptr), or for some reason,
        // the while loop exits without finding the maximum node, we
        // return the current root
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

// Diagram: class Solution {

// Diagram: TreeNode iterativelyFindMaximum(TreeNode root) {

        // Start from the given root node and iterate until we reach
        // the rightmost node
        while (root != null) {

            // If the right child of the current node is null, it means
            // we have reached the rightmost node, which contains the
            // maximum value in the binary search tree
            if (root.right == null) {
                return root;
            }

            // If the right child is not null, move to the right child
            // to continue the search for the maximum value.
            else {
                root = root.right;
            }

        // If the tree is empty (root is null), or for some reason,
        // the while loop exits without finding the maximum node, we
        // return the current root
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
    iterativelyFindMaximum(root: TreeNode | null): TreeNode | null {

        // Start from the given root node and iterate until we reach
        // the rightmost node
        while (root) {

            // If the right child of the current node is null, it means
            // we have reached the rightmost node, which contains the
            // maximum value in the binary search tree
            if (root.right === null) {
                return root;
            }

            // If the right child is not null, move to the right child
            // to continue the search for the maximum value.
            else {
                root = root.right;
            }

        // If the tree is empty (root is null), or for some reason,
        // the while loop exits without finding the maximum node, we
        // return the current root
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
    iterativelyFindMaximum(root) {

        // Start from the given root node and iterate until we reach
        // the rightmost node
        while (root) {

            // If the right child of the current node is null, it means
            // we have reached the rightmost node, which contains the
            // maximum value in the binary search tree
            if (root.right === null) {
                return root;
            }

            // If the right child is not null, move to the right child
            // to continue the search for the maximum value.
            else {
                root = root.right;
            }

        // If the tree is empty (root is null), or for some reason,
        // the while loop exits without finding the maximum node, we
        // return the current root
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

// Diagram: from typing import Optional

class Solution:
    def iteratively_find_maximum(
        self, root: Optional[TreeNode]
    ) -> Optional[TreeNode]:

        # Start from the given root node and iterate until we reach
        # the rightmost node
        while root:

            # If the right child of the current node is null, it means
            # we have reached the rightmost node, which contains the
            # maximum value in the binary search tree
            if root.right is None:
                return root

            # If the right child is not null, move to the right child
            # to continue the search for the maximum value.
            else:
                root = root.right

        # If the tree is empty (root is null), or for some reason,
        # the while loop exits without finding the maximum node, we
        # return the current root
        return root
```

## Complexity Analysis

The algorithm we follow moves continuously to the right starting from the root node. So, we process only one root-to-leaf path when searching for the maximum value in a binary search tree. In the worst case, this root-to-leaf path could be the longest.

// Diagram: Worst case time complexity

Since we do not use any variables or data structures to store any data, we are not using any extra space.

> **Best Case** - The binary search tree is height-balanced
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(logN)**
>
> **Worst Case** - The binary search tree is skewed to the left or right
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Iteratively find maximum

## Problem Statement

Given the **root** of a binary search tree, write a function to return the maximum value in it.

You must do this **iteratively**.

### Example 1

> -   **Input:** root = \[4, 2, 5, 1, 3, null, 6\]
> -   **Output:** 6
> -   **Explanation:** The maximum value in the given binary search tree is 6.

### Example 2

> -   **Input:** root = \[5, 4, 10, null, null, 9, 11\]
> -   **Output:** 11
> -   **Explanation:** The maximum value in the given binary search tree is 11.

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
    TreeNode *iterativelyFindMaximum(TreeNode *root) {

        // Start from the given root node and iterate until we reach
        // the rightmost node
        while (root) {

            // If the left child of the current node is nullptr, it means
            // we have reached the rightmost node, which contains the
            // maximum value in the binary search tree
            if (root->right == nullptr) {
                return root;
            }

            // If the right child is not nullptr, move to the right child
            // to continue the search for the maximum value.
            else {
                root = root->right;
            }
        }

        // If the tree is empty (root is nullptr), or for some reason,
        // the while loop exits without finding the maximum node, we
        // return the current root
        return root;
    }
};
```

***

# Understanding iterative lower bound search

Like the search algorithm, we can find the lower bound for a given value in a binary search tree iteratively. Since we only move from top to bottom in the tree and do not backtrack, we can replace the recursive function calls with loops to get an algorithm to find the lower bound of value in a binary search tree iteratively.

## Algorithm

The iterative algorithm for finding the lower bound is similar to the recursive algorithm. We can piggyback on the iterative search algorithm we learned earlier and keep track of the most recent value seen so far that is **greater than or equal** to the given value as we go down the tree along the search path. The cases we may encounter are the same as those for the recursive algorithm.

### 1\. The value is present in the tree

In this case, the given value is the lower bound, and we will reach it during the search.

// Diagram: The given value itself is the lower bound when it is present in the tree

### 2\. The value is not present in the tree

When we try to search for the value, we will hit a leaf node. On hitting the leaf node, the lower bound in the variable storing the most recently seen value will be greater than the given value. Let us look at a few examples to understand this case better.

#### 2.1 The lower bound is a leaf node

In this case, the leaf node will have the smallest value greater than the given value, which will itself be the lower bound of the given value.

// Diagram: Find the lower bound of 54 in the given binary search tree

#### 2.2 The lower bound is an internal node

In this case, the leaf node's value will be smaller than the given value, so its parent will be the lower bound of the given value.

// Diagram: Find the lower bound of 63 in the given binary search tree

The iterative search for the lower bound of a given value in a binary search tree can be summarised as the following algorithm.

> **Algorithm**
>
> -   **Step 1:** While `root` is not `null`, do the following:
>     -   **Step 1.1:** If the `root` node's value exceeds the `target`, update the `lowerBoundNode` and set the `root` node to hold the reference of its `left` child.
>     -   **Step 1.2:** Else, if the `root` node's value equals the `target`, update the `lowerBoundNode` and return.
>     -   **Step 1.3:** Else, if the `root` node's value is less than the `target`, set the `root` node to hold the reference of its `right` child.

## Implementation

The iterative algorithm we saw earlier can be easily implemented using a while loop.

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
    TreeNode *iterativelyFindLowerBound(TreeNode *root, int target) {

        // Initialize a pointer to the lower bound node as nullptr
        TreeNode *lowerBoundNode = nullptr;

        // Traverse the binary search tree iteratively until root becomes
        // nullptr.
        while (root) {

            // If the target is less than the current node's value, move
            // to the left subtree
            if (target < root->val) {

                // Update the lower bound node to the current node as it
                // is the potential lower bound
                lowerBoundNode = root;

                // Move to the left subtree to find a closer lower bound
                root = root->left;
            }

            // If the target is equal to the current node's value, we
            // found an exact match
            else if (root->val == target) {

                // Update the lower bound node to the current node
                // (exact match is also a lower bound)
                lowerBoundNode = root;

                // Return the node as we have found an exact match for
                // the given target
                return lowerBoundNode;
            }

            // If the target is greater than the current node's value,
            // move to the right subtree.
            else {

                // We are not updating the lower bound node in this case
                // as the current node is not a lower bound continue
                // searching in the right subtree to find a closer lower
                // bound
                root = root->right;
            }

        // Return the lower bound node
        return lowerBoundNode;
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

// Diagram: class Solution {

// Diagram: TreeNode iterativelyFindLowerBound(TreeNode root, int target) {

        // Initialize a pointer to the lower bound node as null
        TreeNode lowerBoundNode = null;

        // Traverse the binary search tree iteratively until root becomes
        // null.
        while (root != null) {

            // If the target is less than the current node's value, move
            // to the left subtree
            if (target < root.val) {

                // Update the lower bound node to the current node as it
                // is the potential lower bound
                lowerBoundNode = root;

                // Move to the left subtree to find a closer lower bound
                root = root.left;
            }

            // If the target is equal to the current node's value, we
            // found an exact match
            else if (root.val == target) {

                // Update the lower bound node to the current node
                // (exact match is also a lower bound)
                lowerBoundNode = root;

                // Return the node as we have found an exact match for
                // the given target
                return lowerBoundNode;
            }

            // If the target is greater than the current node's value,
            // move to the right subtree.
            else {

                // We are not updating the lower bound node in this case
                // as the current node is not a lower bound continue
                // searching in the right subtree to find a closer lower
                // bound
                root = root.right;
            }

        // Return the lower bound node
        return lowerBoundNode;
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
    iterativelyFindLowerBound(
        root: TreeNode | null,
        target: number
    ): TreeNode | null {

        // Initialize a pointer to the lower bound node as null
        let lowerBoundNode: TreeNode | null = null;

        // Traverse the binary search tree iteratively until root becomes
        // null.
        while (root) {

            // If the target is less than the current node's value, move
            // to the left subtree
            if (target < root.val) {

                // Update the lower bound node to the current node as it
                // is the potential lower bound
                lowerBoundNode = root;

                // Move to the left subtree to find a closer lower bound
                root = root.left;
            }

            // If the target is equal to the current node's value, we
            // found an exact match
            else if (root.val === target) {

                // Update the lower bound node to the current node
                // (exact match is also a lower bound)
                lowerBoundNode = root;

                // Return the node as we have found an exact match for
                // the given target
                return lowerBoundNode;
            }

            // If the target is greater than the current node's value,
            // move to the right subtree.
            else {

                // We are not updating the lower bound node in this case
                // as the current node is not a lower bound continue
                // searching in the right subtree to find a closer lower
                // bound
                root = root.right;
            }

        // Return the lower bound node
        return lowerBoundNode;
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
    iterativelyFindLowerBound(root, target) {

        // Initialize a pointer to the lower bound node as null
        let lowerBoundNode = null;

        // Traverse the binary search tree iteratively until root becomes
        // null.
        while (root) {

            // If the target is less than the current node's value, move
            // to the left subtree
            if (target < root.val) {

                // Update the lower bound node to the current node as it
                // is the potential lower bound
                lowerBoundNode = root;

                // Move to the left subtree to find a closer lower bound
                root = root.left;
            }

            // If the target is equal to the current node's value, we
            // found an exact match
            else if (root.val === target) {

                // Update the lower bound node to the current node
                // (exact match is also a lower bound)
                lowerBoundNode = root;

                // Return the node as we have found an exact match for
                // the given target
                return lowerBoundNode;
            }

            // If the target is greater than the current node's value,
            // move to the right subtree.
            else {

                // We are not updating the lower bound node in this case
                // as the current node is not a lower bound continue
                // searching in the right subtree to find a closer lower
                // bound
                root = root.right;
            }

        // Return the lower bound node
        return lowerBoundNode;
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
    def iteratively_find_lower_bound(
        self, root: Optional[TreeNode], target: int
    ) -> Optional[TreeNode]:

        # Initialize a pointer to the lower bound node as None
        lower_bound_node = None

        # Traverse the binary search tree iteratively until root becomes
        # None.
        while root:

            # If the target is less than the current node's value, move
            # to the left subtree
            if target < root.val:

                # Update the lower bound node to the current node as it
                # is the potential lower bound
                lower_bound_node = root

                # Move to the left subtree to find a closer lower bound
                root = root.left

            # If the target is equal to the current node's value, we
            # found an exact match
            elif root.val == target:

                # Update the lower bound node to the current node
                # (exact match is also a lower bound)
                lower_bound_node = root

                # Return the node as we have found an exact match for
                # the given target
                return lower_bound_node

            # If the target is greater than the current node's value,
            # move to the right subtree.
            else:

                # We are not updating the lower bound node in this case
                # as the current node is not a lower bound continue
                # searching in the right subtree to find a closer lower
                # bound
                root = root.right

        # Return the lower bound node
        return lower_bound_node
```

## Complexity Analysis

We are using a modified version of the search algorithm, so we process only one root-to-leaf path when searching for the lower bound of a given value in a binary search tree. In the worst case, this root-to-leaf path could be the longest.

// Diagram: Worst case time complexity

Since we do not use any variables or data structures to store any data, we are not using any extra space.

> **Best Case** - The binary search tree is height-balanced
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(logN)**
>
> **Worst Case** - The binary search tree is skewed to the left or right
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Iteratively find lower bound

## Problem Statement

Fundamental

Given the **root** of a binary search tree and a **target**, write a function to return the node in the tree that is the lower bound for the given target. Return `null` if no node has the lower bound for the given target. You must do this **iteratively**.

Lower bound returns the first element **≥** target.

### Example 1

> -   **Input:** root = \[4, 2, 5, 1, 3, null, 6\], target = 3
> -   **Output:** 3
> -   **Explanation:** The lower bound for the given value in the tree is the node with the value 3.

### Example 2

> -   **Input:** root = \[5, 4, 10, null, null, 9, 11\], target = 7
> -   **Output:** 9
> -   **Explanation:** The lower bound for the given value in the tree is the node with the value 9.

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
    TreeNode *iterativelyFindLowerBound(TreeNode *root, int target) {

        // Initialize a pointer to the lower bound node as nullptr
        TreeNode *lowerBoundNode = nullptr;

        // Traverse the binary search tree iteratively until root becomes
        // nullptr.
        while (root) {

            // If the target is less than the current node's value, move
            // to the left subtree
            if (target < root->val) {

                // Update the lower bound node to the current node as it
                // is the potential lower bound
                lowerBoundNode = root;

                // Move to the left subtree to find a closer lower bound
                root = root->left;
            }

            // If the target is equal to the current node's value, we
            // found an exact match
            else if (root->val == target) {

                // Update the lower bound node to the current node
                // (exact match is also a lower bound)
                lowerBoundNode = root;

                // Return the node as we have found an exact match for
                // the given target
                return lowerBoundNode;
            }

            // If the target is greater than the current node's value,
            // move to the right subtree.
            else {

                // We are not updating the lower bound node in this case
                // as the current node is not a lower bound continue
                // searching in the right subtree to find a closer lower
                // bound
                root = root->right;
            }
        }

        // Return the lower bound node
        return lowerBoundNode;
    }
};
```

***

# Understanding iterative upper bound search

Like the lower bound, we can find the upper bound for a given value in a binary search tree iteratively. Since we only move from top to bottom in the tree and do not backtrack, we can replace the recursive function calls with loops to get an algorithm to find the upper bound of value in a binary search tree iteratively.

## Algorithm

The iterative algorithm for finding the upper bound is similar to the recursive algorithm. We can piggyback on the iterative search algorithm we learned earlier and keep track of the most recent value **greater** than the given value as we go down the tree to get the upper bound.

// Diagram: Upper bound of 54 in the given binary search tree

The iterative search for the upper bound of a given value in a binary search tree can be summarised as the following algorithm.

> **Algorithm**
>
> -   **Step 1:** While `root` is not `null`, do the following:
> -   **Step 2:** If the `root` node's value exceeds the `target,` update the `upperBoundNode` set root node to hold the reference of its `left` child.
> -   **Step 3:** Else, if the `root` node's value is less than the target, set the `root` node to hold the value of its `right` child.

## Implementation

The iterative algorithm we saw earlier can be easily implemented using a while loop.

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
    TreeNode *iterativelyFindUpperBound(TreeNode *root, int target) {

        // Initialize a pointer to the upper bound node as nullptr
        TreeNode *upperBoundNode = nullptr;

        // Traverse the binary search tree iteratively until root becomes
        // nullptr
        while (root) {

            // If the target is less than the current node's value, move
            // to the left subtree
            if (target < root->val) {

                // Update the upper bound node to the current node as it
                // is the potential upper bound
                upperBoundNode = root;

                // Move to the left subtree to find a closer upper bound
                root = root->left;
            }

            // If the target is greater than or equal to the current
            // node's value, move to the right subtree
            else {

                // We are not updating the upper bound node in this case
                // as the current node is not an upper bound continue
                // searching in the right subtree to find a closer upper
                // bound.
                root = root->right;
            }

        // Return the lower bound node
        return upperBoundNode;
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

// Diagram: class Solution {

// Diagram: TreeNode iterativelyFindUpperBound(TreeNode root, int target) {

        // Initialize a pointer to the upper bound node as null
        TreeNode upperBoundNode = null;

        // Traverse the binary search tree iteratively until root becomes
        // null
        while (root != null) {

            // If the target is less than the current node's value, move
            // to the left subtree
            if (target < root.val) {

                // Update the upper bound node to the current node as it
                // is the potential upper bound
                upperBoundNode = root;

                // Move to the left subtree to find a closer upper bound
                root = root.left;
            }

            // If the target is greater than or equal to the current
            // node's value, move to the right subtree
            else {

                // We are not updating the upper bound node in this case
                // as the current node is not an upper bound continue
                // searching in the right subtree to find a closer upper
                // bound.
                root = root.right;
            }

        // Return the upper bound node
        return upperBoundNode;
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
    iterativelyFindUpperBound(
        root: TreeNode | null,
        target: number
    ): TreeNode | null {

        // Initialize a pointer to the upper bound node as null
        let upperBoundNode: TreeNode | null = null;

        // Traverse the binary search tree iteratively until root becomes
        // null
        while (root) {

            // If the target is less than the current node's value, move
            // to the left subtree
            if (target < root.val) {

                // Update the upper bound node to the current node as it
                // is the potential upper bound
                upperBoundNode = root;

                // Move to the left subtree to find a closer upper bound
                root = root.left;
            }

            // If the target is greater than or equal to the current
            // node's value, move to the right subtree
            else {

                // We are not updating the upper bound node in this case
                // as the current node is not an upper bound continue
                // searching in the right subtree to find a closer upper
                // bound.
                root = root.right;
            }

        // Return the upper bound node
        return upperBoundNode;
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
    iterativelyFindUpperBound(root, target) {

        // Initialize a pointer to the upper bound node as null
        let upperBoundNode = null;

        // Traverse the binary search tree iteratively until root becomes
        // null
        while (root) {

            // If the target is less than the current node's value, move
            // to the left subtree
            if (target < root.val) {

                // Update the upper bound node to the current node as it
                // is the potential upper bound
                upperBoundNode = root;

                // Move to the left subtree to find a closer upper bound
                root = root.left;
            }

            // If the target is greater than or equal to the current
            // node's value, move to the right subtree
            else {

                // We are not updating the upper bound node in this case
                // as the current node is not an upper bound continue
                // searching in the right subtree to find a closer upper
                // bound.
                root = root.right;
            }

        // Return the upper bound node
        return upperBoundNode;
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
    def iteratively_find_upper_bound(
        self, root: Optional[TreeNode], target: int
    ) -> Optional[TreeNode]:

        # Initialize a pointer to the upper bound node as None
        upper_bound_node = None

        # Traverse the binary search tree iteratively until root becomes
        # None
        while root:

            # If the target is less than the current node's value, move
            # to the left subtree
            if target < root.val:

                # Update the upper bound node to the current node as it
                # is the potential upper bound
                upper_bound_node = root

                # Move to the left subtree to find a closer upper bound
                root = root.left

            # If the target is greater than or equal to the current
            # node's value, move to the right subtree
            else:

                # We are not updating the upper bound node in this case
                # as the current node is not an upper bound continue
                # searching in the right subtree to find a closer upper
                # bound.
                root = root.right

        # Return the upper bound node
        return upper_bound_node
```

## Complexity Analysis

We are using a modified version of the search algorithm, so we process only one root-to-leaf path when searching for the upper bound of a given value in a binary search tree. In the worst case, this root-to-leaf path could be the longest.

// Diagram: Worst case time complexity

Since we do not use any variables or data structures to store any data, we are not using any extra space.

> **Best Case** - The binary search tree is height-balanced
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(logN)**
>
> **Worst Case** - The binary search tree is skewed to the left or right
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Iteratively find upper bound

## Problem Statement

Fundamental

Given the **root** of a binary search tree and a **target**, write a function to find and return the node in the tree that is the upper bound for the given target. Return `null` if no node has the upper bound for the given target. You must do this **iteratively**.

Upper bound returns the first element **\>** target.

### Example 1

> -   **Input:** root = \[4, 2, 5, 1, 3, null, 6\], target = 3
> -   **Output:** 4
> -   **Explanation:** The upper bound for the given value in the tree is the node with the value 4.

### Example 2

> -   **Input:** root = \[5, 4, 10, null, null, 9, 11\], target = 7
> -   **Output:** 9
> -   **Explanation:** The upper bound for the given value in the tree is the node with the value 9.

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
    TreeNode *iterativelyFindUpperBound(TreeNode *root, int target) {

        // Initialize a pointer to the upper bound node as nullptr
        TreeNode *upperBoundNode = nullptr;

        // Traverse the binary search tree iteratively until root becomes
        // nullptr
        while (root) {

            // If the target is less than the current node's value, move
            // to the left subtree
            if (target < root->val) {

                // Update the upper bound node to the current node as it
                // is the potential upper bound
                upperBoundNode = root;

                // Move to the left subtree to find a closer upper bound
                root = root->left;
            }

            // If the target is greater than or equal to the current
            // node's value, move to the right subtree
            else {

                // We are not updating the upper bound node in this case
                // as the current node is not an upper bound continue
                // searching in the right subtree to find a closer upper
                // bound.
                root = root->right;
            }
        }

        // Return the lower bound node
        return upperBoundNode;
    }
};
```

***

# Closest value

## Problem Statement

Given the **root** of a binary search tree and **target** value, write a function to find and return the value in the BST that is closest to the target. You are guaranteed to have only one unique value in the BST closest to the target.

### Example 1

> -   **Input:** root = \[4, 2, 6, 1, null, null, 7\], target = 4.63
> -   **Output:** 4
> -   **Explanation:** The closest value in the tree to 4.63 is 4.

### Example 2

> -   **Input:** root = \[2, 1, 4, null, null, 3, 7\], target = 7.49
> -   **Output:** 7
> -   **Explanation:** The closest value in the tree to 7.49 is 7.

## Solution

```cpp
#include <algorithm>

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
    int closestValue(TreeNode *root, double target) {

        // Start with the root as the closest value
        int closest = root->val;

        while (root) {

            // Update closest if the current node is closer to the target
            if (abs(root->val - target) < abs(closest - target)) {
                closest = root->val;
            }

            // Traverse to the left subtree if the target is smaller
            if (target < root->val) {
                root = root->left;
            }

            // Traverse to the right subtree if the target is larger
            else {
                root = root->right;
            }
        }

        return closest;
    }
};
```
