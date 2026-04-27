# Recursive searching in binary search trees

## Table of Contents

1. [Understanding recursive search](#understanding-recursive-search)
2. [Implement recursive search](#understanding-recursive-search)
3. [Understanding recursive minimum search](#understanding-recursive-minimum-search)
4. [Recursively find minimum](#recursively-find-minimum)
5. [Understanding recursive maximum search](#understanding-recursive-maximum-search)
6. [Recursively find maximum](#recursively-find-maximum)
7. [Understanding recursive lower bound search](#understanding-recursive-lower-bound-search)
8. [Recursively find lower bound](#recursively-find-lower-bound)
9. [Understanding recursive upper bound search](#understanding-recursive-upper-bound-search)
10. [Recursively find upper bound](#recursively-find-upper-bound)

***

# Understanding recursive search

Searching for a value in a binary search tree can be implemented by piggybacking on any of the binary tree traversal algorithms. However, if we observe the special property of a binary search tree (given below), we can quickly develop an exponentially faster algorithm. 

> -   All nodes in a node's `left` subtree are `less in value` than the node's value.
> -   All nodes in a node's `right` subtree are `greater in value` than the node's value.

## Algorithm

Let us look at a binary search tree with a value we want to search for to see how to use its unique property to speed up our simple traversal search algorithm. The search operation in a binary search tree can be implemented as a simple recursive algorithm that discards either the left or right subtree at every point until it finds the value to be searched or reaches the end of the tree.

// Diagram: Recursive equation to search a value in a binary search tree

Let's look at an example to understand it better.

// Diagram: Searching for a value in a binary search tree

> **Algorithm**
>
> -   **Step 1:** If the `current` node is `null`, return it (base case).
> -   **Step 2:** If the `current` node's value equals the `target`, return it.
> -   **Step 3:** Else, if the `current` node's value exceeds the `target`, recursively call the search operation on the `left` subtree.
> -   **Step 4:** Else, if the `current` node's value is less than the `target`, recursively call the search operation on the `right` subtree.

## Implementation

We implement the recursive equation using a recursive function to search for a value in a binary search tree.

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
    TreeNode *recursiveSearch(TreeNode *root, int target) {

        // If the root is nullptr, the tree is empty, and we can't find
        // the target
        if (root == nullptr) {
            return nullptr;
        }

        // If the root's value matches the target we are looking for,
        // we found the node
        if (root->val == target) {
            return root;
        }

        // If the target is less than the current root's value, search in
        // the left subtree
        else if (target < root->val) {
            return recursiveSearch(root->left, target);
        }

        // If the target is greater than the current root's value, search
        // in the right subtree
        else {
            return recursiveSearch(root->right, target);
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
    public TreeNode recursiveSearch(TreeNode root, int target) {

        // If the root is null, the tree is empty, and we can't find
        // the target
        if (root == null) {
            return null;
        }

        // If the root's value matches the target we are looking for,
        // we found the node
        if (root.val == target) {
            return root;
        }

        // If the target is less than the current root's value, search in
        // the left subtree
        else if (target < root.val) {
            return recursiveSearch(root.left, target);
        }

        // If the target is greater than the current root's value, search
        // in the right subtree
        else {
            return recursiveSearch(root.right, target);
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
    recursiveSearch(
        root: TreeNode | null,
        target: number
    ): TreeNode | null {

        // If the root is null, the tree is empty, and we can't find
        // the target
        if (!root) {
            return null;
        }

        // If the root's value matches the target we are looking for,
        // we found the node
        if (root.val === target) {
            return root;
        }

        // If the target is less than the current root's value, search in
        // the left subtree
        if (target < root.val) {
            return this.recursiveSearch(root.left, target);
        }

        // If the target is greater than the current root's value, search
        // in the right subtree
        return this.recursiveSearch(root.right, target);
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
    recursiveSearch(root, target) {

        // If the root is null, the tree is empty, and we can't find
        // the target
        if (!root) {
            return null;
        }

        // If the root's value matches the target we are looking for,
        // we found the node
        if (root.val === target) {
            return root;
        }

        // If the target is less than the current root's value, search in
        // the left subtree
        if (target < root.val) {
            return this.recursiveSearch(root.left, target);
        }

        // If the target is greater than the current root's value, search
        // in the right subtree
        return this.recursiveSearch(root.right, target);
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
    def recursive_search(
        self, root: Optional[TreeNode], target: int
    ) -> Optional[TreeNode]:

        # If the root is null, the tree is empty, and we can't find
        # the target
        if root is None:
            return None

        # If the root's value matches the target we are looking for,
        # we found the node
        if root.val == target:
            return root

        # If the target is less than the current root's value, search in
        # the left subtree
        if target < root.val:
            return self.recursive_search(root.left, target)

        # If the target is greater than the current root's value, search
        # in the right subtree
        return self.recursive_search(root.right, target)
```

**What happens if the node is not found in the tree?**

If the node is not found in the tree, the recursive function will keep on going until it reaches a leaf node, after which it will hit the base case of recursion where the root == `null` and recursion will stop and unwind.

**What will be the last leaf node that we hit?**The last leaf node that the search algorithm hits will be either the node with the largest value, which is just smaller than the given value or the node with the smallest value, larger than the given value.

## Complexity Analysis

The algorithm we follow when searching for a value in a binary search tree only traverses the tree from top to bottom and, at every level, goes only in one direction, either left or right. And so, we process **only one root to leaf path** when searching for a value in a binary search tree. In the worst case, this root-to-leaf path could be the longest.

// Diagram: Worst case time complexity

We are not using any extra space apart from the recursion call stack, which will depend on the tree's height.

> **Best Case** - The binary search tree is height-balanced
>
> -   Space Complexity - **O(logN)**
> -   Time Complexity - **O(logN)**
>
> **Worst Case** - The binary search tree is skewed to the left or right
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Recursive search

## Problem Statement

Given the **root** of a binary search tree and a **target** value, write a function to return the node with the given value. If there is no such node return `null`.

You must do this **recursively**.

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
    TreeNode *recursiveSearch(TreeNode *root, int target) {

        // If the root is nullptr, the tree is empty, and we can't find
        // the target
        if (root == nullptr) {
            return nullptr;
        }

        // If the root's value matches the target we are looking for,
        // we found the node
        if (root->val == target) {
            return root;
        }

        // If the target is less than the current root's value, search in
        // the left subtree
        else if (target < root->val) {
            return recursiveSearch(root->left, target);
        }

        // If the target is greater than the current root's value, search
        // in the right subtree
        else {
            return recursiveSearch(root->right, target);
        }
    }
};
```

***

# Understanding recursive minimum search

Finding the minimum value in a binary search tree recursively is quite simple. We must traverse to the first node of the tree's inorder sequence. 

## Algorithm

Let us look at the recursive algorithm to quickly find the minimum value in a binary search tree. A simple recursive equation can summarise the search process we followed above.

// Diagram: Recursive equation to search the minimum value in a binary search tree

Let's look at an example to understand it better.

// Diagram: Searching for the minimum value in a binary search tree

The recursive equation above can be summarised using the following algorithm.

> **Algorithm**
>
> -   **Step 1:** If the `current` node is `null`, return it (base case).
> -   **Step 2:** If the `current` node does not have a `left` subtree return the node.
> -   **Step 3:** Else, if the `current` node has a `left` subtree, recursively call the search operation on the `left` subtree.

## Implementation

We implement the recursive equation using a recursive function to get the minimum value in the tree.

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
    TreeNode *recursivelyFindMinimum(TreeNode *root) {

        // Base case: If the root is null (empty tree or leaf node)
        // return nullptr
        if (root == nullptr) {
            return nullptr;
        }

        // If the left child of the current node is null, then this node
        // is the minimum value node. Return the current node, which is
        // the minimum value node
        if (root->left == nullptr) {
            return root;
        }

        // If the left child is not null, recursively traverse to the
        // left subtree as the minimum value node will be in the left
        // subtree
        else {
            return recursivelyFindMinimum(root->left);
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
    public TreeNode recursivelyFindMinimum(TreeNode root) {

        // Base case: If the root is null (empty tree or leaf node)
        // return null
        if (root == null) {
            return null;
        }

        // If the left child of the current node is null, then this node
        // is the minimum value node. Return the current node, which is
        // the minimum value node
        if (root.left == null) {
            return root;
        }

        // If the left child is not null, recursively traverse to the
        // left subtree as the minimum value node will be in the left
        // subtree
        else {
            return recursivelyFindMinimum(root.left);
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
    recursivelyFindMinimum(root: TreeNode | null): TreeNode | null {

        // Base case: If the root is null (empty tree or leaf node)
        // return null
        if (!root) {
            return null;
        }

        // If the left child of the current node is null, then this node
        // is the minimum value node. Return the current node, which is
        // the minimum value node
        if (!root.left) {
            return root;
        }

        // If the left child is not null, recursively traverse to the
        // left subtree as the minimum value node will be in the left
        // subtree
        return this.recursivelyFindMinimum(root.left);
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
    recursivelyFindMinimum(root) {

        // Base case: If the root is null (empty tree or leaf node)
        // return null
        if (!root) {
            return null;
        }

        // If the left child of the current node is null, then this node
        // is the minimum value node. Return the current node, which is
        // the minimum value node
        if (!root.left) {
            return root;
        }

        // If the left child is not null, recursively traverse to the
        // left subtree as the minimum value node will be in the left
        // subtree
        return this.recursivelyFindMinimum(root.left);
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

// Diagram: from typing import Optional, List, Any

class Solution:
    def recursively_find_minimum(
        self, root: Optional[TreeNode]
    ) -> Optional[TreeNode]:

        # Base case: If the root is null (empty tree or leaf node)
        # return None
        if root is None:
            return None

        # If the left child of the current node is null, then this node
        # is the minimum value node. Return the current node, which is
        # the minimum value node
        if root.left is None:
            return root

        # If the left child is not None, recursively traverse to the
        # left subtree as the minimum value node will be in the left
        # subtree
        return self.recursively_find_minimum(root.left)
```

## Complexity Analysis

The algorithm we follow moves continuously to the left, starting from the root node. So, we process only one root-to-leaf path when searching for the minimum value in a binary search tree. In the worst case, this path could be the longest**.**

// Diagram: Worst case time complexity

We are not using any extra space apart from the recursion call stack, which will depend on the tree's height.

> **Best Case** - The binary search tree is skewed to the right
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Average Case** - The binary search tree is height-balanced
>
> -   Space Complexity - **O(logN)**
> -   Time Complexity - **O(logN)**
>
> **Worst Case** - The binary search tree is skewed to the left.
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Recursively find minimum

## Problem Statement

Given the **root** of a binary search tree, write a function to return the node with the minimum value in it.

You must do this **recursively**. 

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
    TreeNode *recursivelyFindMinimum(TreeNode *root) {

        // Base case: If the root is null (empty tree or leaf node)
        // return nullptr
        if (root == nullptr) {
            return nullptr;
        }

        // If the left child of the current node is null, then this node
        // is the minimum value node. Return the current node, which is
        // the minimum value node
        if (root->left == nullptr) {
            return root;
        }

        // If the left child is not null, recursively traverse to the
        // left subtree as the minimum value node will be in the left
        // subtree
        else {
            return recursivelyFindMinimum(root->left);
        }
    }
};
```

***

# Understanding recursive maximum search

Finding the maximum value in a binary search tree recursively is similar to finding the minimum. We must traverse to the tree's first node's **RNL** sequence. 

## Algorithm

Let us look at the recursive algorithm to find the maximum value in a binary search tree quickly. A simple recursive equation can summarise the search process we followed above.

// Diagram: Recursive equation to search the maximum value in a binary search tree

Let's look at an example to understand it better.

// Diagram: Searching for the maximum value in a binary search tree

The recursive equation above can be summarised using the following algorithm.

> **Algorithm**
>
> -   **Step 1:** If the `current` node is `null`, return it (base case).
> -   **Step 2:** If the `current` node does not have a `right` subtree return the node.
> -   **Step 3:** Else, if the `current` node has a `right` subtree, recursively call the search operation on the `right` subtree.

## Implementation

We implement the recursive equation using a recursive function to get the maximum value in the tree.

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
    TreeNode *recursivelyFindMaximum(TreeNode *root) {

        // Base case: If the root is null (empty tree or leaf node)
        // return nullptr.
        if (root == nullptr) {
            return nullptr;
        }

        // If the right child of the current node is null, then this node
        // is the maximum value node. Return the current node, which is
        // the maximum value node.
        if (root->right == nullptr) {
            return root;
        }

        // If the right child is not null, recursively traverse to the
        // right subtree as the maximum value node will be in the right
        // subtree.
        else {
            return recursivelyFindMaximum(root->right);
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
    public TreeNode recursivelyFindMaximum(TreeNode root) {

        // Base case: If the root is null (empty tree or leaf node)
        // return null.
        if (root == null) {
            return null;
        }

        // If the right child of the current node is null, then this node
        // is the maximum value node. Return the current node, which is
        // the maximum value node.
        if (root.right == null) {
            return root;
        }

        // If the right child is not null, recursively traverse to the
        // right subtree as the maximum value node will be in the right
        // subtree.
        else {
            return recursivelyFindMaximum(root.right);
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
    recursivelyFindMaximum(root: TreeNode | null): TreeNode | null {

        // Base case: If the root is null (empty tree or leaf node)
        // return null.
        if (!root) {
            return null;
        }

        // If the right child of the current node is null, then this node
        // is the maximum value node. Return the current node, which is
        // the maximum value node.
        if (!root.right) {
            return root;
        }

        // If the right child is not null, recursively traverse to the
        // right subtree as the maximum value node will be in the right
        // subtree.
        return this.recursivelyFindMaximum(root.right);
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
    recursivelyFindMaximum(root) {

        // Base case: If the root is null (empty tree or leaf node)
        // return null.
        if (!root) {
            return null;
        }

        // If the right child of the current node is null, then this node
        // is the maximum value node. Return the current node, which is
        // the maximum value node.
        if (!root.right) {
            return root;
        }

        // If the right child is not null, recursively traverse to the
        // right subtree as the maximum value node will be in the right
        // subtree.
        return this.recursivelyFindMaximum(root.right);
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

// Diagram: from typing import Optional, List, Any

class Solution:
    def recursively_find_maximum(
        self, root: Optional[TreeNode]
    ) -> Optional[TreeNode]:

        # Base case: If the root is null (empty tree or leaf node)
        # return None.
        if root is None:
            return None

        # If the right child of the current node is null, then this node
        # is the maximum value node. Return the current node, which is
        # the maximum value node.
        if root.right is None:
            return root

        # If the right child is not None, recursively traverse to the
        # right subtree as the maximum value node will be in the right
        # subtree.
        return self.recursively_find_maximum(root.right)
```

## Complexity Analysis

The algorithm we follow moves continuously to the right, starting from the root node. So, we process only one root-to-leaf path when searching for the minimum value in a binary search tree. In the worst case, this path could be the longest**.**

// Diagram: Worst case time complexity

We are not using any extra space apart from the recursion call stack, which will depend on the tree's height.

> **Best Case** - The binary search tree is skewed to the left
>
> -   Space Complexity - **O(logN)**
> -   Time Complexity - **O(logN)**
>
> **Average Case** - The binary search tree is height-balanced
>
> -   Space Complexity - **O(logN)**
> -   Time Complexity - **O(logN)**
>
> **Worst Case** - The binary search tree is skewed to the right
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Recursively find maximum

## Problem Statement

Given the **root** of a binary search tree, write a function to return the maximum value in it.

You must do this **recursively**.

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
    TreeNode *recursivelyFindMaximum(TreeNode *root) {

        // Base case: If the root is null (empty tree or leaf node)
        // return nullptr.
        if (root == nullptr) {
            return nullptr;
        }

        // If the right child of the current node is null, then this node
        // is the maximum value node. Return the current node, which is
        // the maximum value node.
        if (root->right == nullptr) {
            return root;
        }

        // If the right child is not null, recursively traverse to the
        // right subtree as the maximum value node will be in the right
        // subtree.
        else {
            return recursivelyFindMaximum(root->right);
        }
    }
};
```

***

# Understanding recursive lower bound search

Finding the lower bound of a value in a binary search tree can be implemented by piggybacking on any of the binary tree traversal algorithms. It is very similar to searching for a value, so we can exploit the special property of a binary search tree to devise an exponentially faster algorithm. Let us look at the cases we need to consider

## Algorithm

We follow the same path as the search by slightly modifying the search algorithm to find the first element greater than or equal to the given value. To search for the lower bound, we keep track of the most recent value we have seen so far that is **greater than or equal to** the given value. We will have our answer in that variable when hitting a leaf node. Let us look at the possible cases we need to consider.

### 1\. The value is present in the tree

In this case, the given value is the lower bound, and we will reach it during the search.

// Diagram: The given value is the lower bound when it is present in the tree

### 2\. The value is not present in the tree

When we try to search for the value, we will hit a leaf node. On hitting the leaf node, the lower bound in the variable storing the most recently seen value will be greater than the given value. Let us look at a few examples to understand this case better.

#### 2.1 The lower bound is a leaf node

In this case, the leaf node will have the smallest value greater than the given value, which will be the lower bound of the given value.

// Diagram: Find the lower bound of 54 in the given binary search tree

#### 2.2 The lower bound is an internal node

In this case, the leaf node's value will be smaller than the given value, so its parent will be the lower bound of the given value.

// Diagram: Find the lower bound of 63 in the given binary search tree

The idea can be summarized as a recursive algorithm having a simple recursive equation. We create a global variable called `loweBoundNode` to maintain state throughout recursion. It will store the most recent node seen so far whose value is greater than or equal to the given value. All different function calls will have access to the same copy of `loweBoundNode` which they can update. We follow the same path as search down the tree and update the `lowerBoundNode` variable when needed.

// Diagram: Recursive equation to search for the lower bound for the given value

The recursive search for the lower bound of a given value in a binary search tree can be summarised using the following algorithm.

> **Algorithm**
>
> -   **Step 1:** If the `current` node is `null`, return (base case).
> -   **Step 2:** If the `current` node's value exceeds the `target`, update the `lowerBoundNode` and recursively call the search operation on the `left` subtree.
> -   **Step 3:** Else, if the `current` node's value equals the `target`, update the `lowerBoundNode` and return.
> -   **Step 4:** Else, if the `current` node's value is less than the `target`, recursively call the search operation on the `right` subtree.

## Implementation

The recursive equation above can be summarised using the following algorithm.

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

    // Global variable to store the lower bound node found during the
    // traversal
    TreeNode *lowerBoundNode = nullptr;

// Diagram: void helper(TreeNode root, int target) {

        // Base case: If the current node is null, return
        if (!root) {
            return;
        }

        // If the target is less than the value in the current node,
        // update the lower bound node to the current node and
        // continue searching in the left subtree
        if (target < root->val) {
            lowerBoundNode = root;
            helper(root->left, target);
        }

        // If the target is equal to the value in the current node,
        // update the lower bound node to the current node and return,
        // as there is no need to search further in this case.
        else if (root->val == target) {
            lowerBoundNode = root;
            return;
        }

        // If the target is greater than the value in the current node,
        // continue searching in the right subtree
        else {
            helper(root->right, target);
        }

// Diagram: TreeNode recursivelyFindLowerBound(TreeNode root, int target) {

        // Initialize the lower bound node to null
        lowerBoundNode = nullptr;

        // Find the lower bound node in the binary search tree
        helper(root, target);

        // Return the lower bound node found during the search
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

    // Global variable to store the lower bound node found during the
    // traversal
    TreeNode lowerBoundNode = null;

// Diagram: void helper(TreeNode root, int target) {

        // Base case: If the current node is null, return
        if (root == null) {
            return;
        }

        // If the target is less than the value in the current node,
        // update the lower bound node to the current node and
        // continue searching in the left subtree
        if (target < root.val) {
            lowerBoundNode = root;
            helper(root.left, target);
        }

        // If the target is equal to the value in the current node,
        // update the lower bound node to the current node and return,
        // as there is no need to search further in this case.
        else if (root.val == target) {
            lowerBoundNode = root;
            return;
        }

        // If the target is greater than the value in the current node,
        // continue searching in the right subtree
        else {
            helper(root.right, target);
        }

// Diagram: TreeNode recursivelyFindLowerBound(TreeNode root, int target) {

        // Initialize the lower bound node to null
        lowerBoundNode = null;

        // Find the lower bound node in the binary search tree
        helper(root, target);

        // Return the lower bound node found during the search
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

// Diagram: export class Solution {

    // Global variable to store the lower bound node found during the
    // traversal
    lowerBoundNode: TreeNode | null = null;

// Diagram: helper(root: TreeNode | null, target: number): void {

        // Base case: If the current node is null, return
        if (!root) {
            return;
        }

        // If the target is less than the value in the current node,
        // update the lower bound node to the current node and
        // continue searching in the left subtree
        if (target < root.val) {
            this.lowerBoundNode = root;
            this.helper(root.left, target);
        }

        // If the target is equal to the value in the current node,
        // update the lower bound node to the current node and return,
        // as there is no need to search further in this case.
        else if (root.val === target) {
            this.lowerBoundNode = root;
            return;
        }

        // If the target is greater than the value in the current node,
        // continue searching in the right subtree
        else {
            this.helper(root.right, target);
        }

    recursivelyFindLowerBound(
        root: TreeNode | null,
        target: number
    ): TreeNode | null {

        // Initialize the lower bound node to null
        this.lowerBoundNode = null;

        // Find the lower bound node in the binary search tree
        this.helper(root, target);

        // Return the lower bound node found during the search
        return this.lowerBoundNode;
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

// Diagram: export class Solution {

    // Global variable to store the lower bound node found during the
    // traversal
    lowerBoundNode = null;

// Diagram: helper(root, target) {

        // Base case: If the current node is null, return
        if (!root) {
            return;
        }

        // If the target is less than the value in the current node,
        // update the lower bound node to the current node and
        // continue searching in the left subtree
        if (target < root.val) {
            this.lowerBoundNode = root;
            this.helper(root.left, target);
        }

        // If the target is equal to the value in the current node,
        // update the lower bound node to the current node and return,
        // as there is no need to search further in this case.
        else if (root.val === target) {
            this.lowerBoundNode = root;
            return;
        }

        // If the target is greater than the value in the current node,
        // continue searching in the right subtree
        else {
            this.helper(root.right, target);
        }

// Diagram: recursivelyFindLowerBound(root, target) {

        // Initialize the lower bound node to null
        this.lowerBoundNode = null;

        // Find the lower bound node in the binary search tree
        this.helper(root, target);

        // Return the lower bound node found during the search
        return this.lowerBoundNode;
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

    # Global variable to store the lower bound node found during the
    # traversal
    lowerBoundNode: Optional[TreeNode] = None

    def helper(self, root: Optional[TreeNode], target: int) -> None:

        # Base case: If the current node is null, return
        if root is None:
            return

        # If the target is less than the value in the current node,
        # update the lower bound node to the current node and
        # continue searching in the left subtree
        if target < root.val:
            self.lowerBoundNode = root
            self.helper(root.left, target)

        # If the target is equal to the value in the current node,
        # update the lower bound node to the current node and return,
        # as there is no need to search further in this case.
        elif root.val == target:
            self.lowerBoundNode = root
            return

        # If the target is greater than the value in the current node,
        # continue searching in the right subtree
        else:
            self.helper(root.right, target)

    def recursively_find_lower_bound(
        self, root: Optional[TreeNode], target: int
    ) -> Optional[TreeNode]:

        # Initialize the lower bound node to null
        self.lowerBoundNode = None

        # Find the lower bound node in the binary search tree
        self.helper(root, target)

        # Return the lower bound node found during the search
        return self.lowerBoundNode
```

## Complexity Analysis

We are using a modified version of the search algorithm, so we process only one root-to-leaf path when searching for the lower bound of a given value in a binary search tree. In the worst case, this root-to-leaf path could be the longest.

// Diagram: Worst case time complexity

We are not using any extra space apart from the recursion call stack, which will depend on the tree's height.

> **Best Case** - The binary search tree is height-balanced
>
> -   Space Complexity - **O(logN)**
> -   Time Complexity - **O(logN)**
>
> **Worst Case** - The binary search tree is skewed to the left or right
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Recursively find lower bound

## Problem Statement

Fundamental

Given the **root** of a binary search tree and a **target**, write a function to return the node in the tree that is the lower bound for the given target. Return `null` if no node has the lower bound for the given target. You must do this **recursively**.

Lower bound returns the first element **≥** target.

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

    // Global variable to store the lower bound node found during the
    // traversal
    TreeNode *lowerBoundNode = nullptr;

    void helper(TreeNode *root, int target) {

        // Base case: If the current node is null, return
        if (!root) {
            return;
        }

        // If the target is less than the value in the current node,
        // update the lower bound node to the current node and
        // continue searching in the left subtree
        if (target < root->val) {
            lowerBoundNode = root;
            helper(root->left, target);
        }

        // If the target is equal to the value in the current node,
        // update the lower bound node to the current node and return,
        // as there is no need to search further in this case.
        else if (root->val == target) {
            lowerBoundNode = root;
            return;
        }

        // If the target is greater than the value in the current node,
        // continue searching in the right subtree
        else {
            helper(root->right, target);
        }
    }

    TreeNode *recursivelyFindLowerBound(TreeNode *root, int target) {

        // Initialize the lower bound node to null
        lowerBoundNode = nullptr;

        // Find the lower bound node in the binary search tree
        helper(root, target);

        // Return the lower bound node found during the search
        return lowerBoundNode;
    }
};
```

***

# Understanding recursive upper bound search

Finding the upper bound of a value in a binary search tree can be implemented by piggybacking on any of the binary tree traversal algorithms. It is very similar to searching for the value, so we can exploit the special property of a binary search tree to devise an exponentially faster algorithm. Let us look at the cases we need to consider

## Algorithm

To find the smallest element greater than the given value, we follow an algorithm similar to search. We create a variable that stores the smallest value greater than the given value seen so far. Starting from the root, we check if the value at the node is less than or equal to the given value, and we go to the right child. If the value at the node is greater than the given value, we compare it with the value stored in our variable and update it if needed. We will have our answer in that variable when hitting a leaf node. Let us look at some examples to understand this better.

// Diagram: Upper bound of 54 in the given binary search tree

The above idea can be summarized as a recursive algorithm with a simple recursive equation. We create a global variable called to maintain state across recursion. It will store the node's reference with the smallest value greater than the given value. All different function calls will have access to the same copy of `upperBoundNode` which they can update. We follow a similar path as searching down the tree and updating the `upperBoundNode` variable where needed.

// Diagram: Recursive equation to search for the lower bound for the given value

The recursive search for the upper bound of a given value in a binary search tree can be summarised as the following algorithm.

> **Algorithm**
>
> -   **Step 1:** If the `current` node is `null`, return (base case).
> -   **Step 2:** If the `current` node's value exceeds the `target`, update the `upperBoundNode` and recursively call the search operation on the `left` subtree.
> -   **Step 3:** Else, if the `current` node's value is less than the `target`, recursively call the search operation on the `right` subtree.

## Implementation

The recursive equation above can be summarised as the following algorithm.

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

    // Global variable to store the upper bound node found during the
    // traversal
    TreeNode *upperBoundNode = nullptr;

// Diagram: void helper(TreeNode root, int target) {

        // Base case: If the current node is null, return
        if (!root) {
            return;
        }

        // If the target is less than the value in the current node,
        // update the upper bound node to the current node and
        // continue searching in the left subtree
        if (target < root->val) {
            upperBoundNode = root;
            helper(root->left, target);

        }

        // If the target is greater than or equal to the value in the
        // current node, continue searching in the right subtree
        else {
            helper(root->right, target);
        }

// Diagram: TreeNode recursivelyFindUpperBound(TreeNode root, int target) {

        // Initialize the upper bound node to null
        upperBoundNode = nullptr;

        // Find the upper bound in the binary search tree
        helper(root, target);

        // Return the upper bound node found during the search
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

    // Global variable to store the upper bound node found during the
    // traversal
    TreeNode upperBoundNode = null;

// Diagram: void helper(TreeNode root, int target) {

        // Base case: If the current node is null, return
        if (root == null) {
            return;
        }

        // If the target is less than the value in the current node,
        // update the upper bound node to the current node and
        // continue searching in the left subtree
        if (target < root.val) {
            upperBoundNode = root;
            helper(root.left, target);
        }

        // If the target is greater than or equal to the value in the
        // current node, continue searching in the right subtree
        else {
            helper(root.right, target);
        }

// Diagram: TreeNode recursivelyFindUpperBound(TreeNode root, int target) {

        // Initialize the upper bound node to null
        upperBoundNode = null;

        // Find the upper bound in the binary search tree
        helper(root, target);

        // Return the upper bound node found during the search
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

// Diagram: export class Solution {

    // Global variable to store the upper bound node found during the
    // traversal
    upperBoundNode: TreeNode | null = null;

// Diagram: helper(root: TreeNode | null, target: number): void {

        // Base case: If the current node is null, return
        if (!root) {
            return;
        }

        // If the target is less than the value in the current node,
        // update the upper bound node to the current node and
        // continue searching in the left subtree
        if (target < root.val) {
            this.upperBoundNode = root;
            this.helper(root.left, target);
        }

        // If the target is greater than or equal to the value in the
        // current node, continue searching in the right subtree
        else {
            this.helper(root.right, target);
        }

    recursivelyFindUpperBound(
        root: TreeNode | null,
        target: number
    ): TreeNode | null {

        // Initialize the upper bound node to null
        this.upperBoundNode = null;

        // Find the upper bound in the binary search tree
        this.helper(root, target);

        // Return the upper bound node found during the search
        return this.upperBoundNode;
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

// Diagram: export class Solution {

    // Global variable to store the upper bound node found during the
    // traversal
    upperBoundNode = null;

// Diagram: helper(root, target) {

        // Base case: If the current node is null, return
        if (!root) {
            return;
        }

        // If the target is less than the value in the current node,
        // update the upper bound node to the current node and
        // continue searching in the left subtree
        if (target < root.val) {
            this.upperBoundNode = root;
            this.helper(root.left, target);
        }

        // If the target is greater than or equal to the value in the
        // current node, continue searching in the right subtree
        else {
            this.helper(root.right, target);
        }

// Diagram: recursivelyFindUpperBound(root, target) {

        // Initialize the upper bound node to null
        this.upperBoundNode = null;

        // Find the upper bound in the binary search tree
        this.helper(root, target);

        // Return the upper bound node found during the search
        return this.upperBoundNode;
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

    # Global variable to store the upper bound node found during the
    # traversal
    upperBoundNode: Optional[TreeNode] = None

    def helper(self, root: Optional[TreeNode], target: int) -> None:

        # Base case: If the current node is null, return
        if root is None:
            return

        # If the target is less than the value in the current node,
        # update the upper bound node to the current node and
        # continue searching in the left subtree
        if target < root.val:
            self.upperBoundNode = root
            self.helper(root.left, target)

        # If the target is greater than or equal to the value in the current node,
        # continue searching in the right subtree
        else:
            self.helper(root.right, target)

    def recursively_find_upper_bound(
        self, root: Optional[TreeNode], target: int
    ) -> Optional[TreeNode]:

        # Initialize the upper bound node to null
        self.upperBoundNode = None

        # Find the upper bound in the binary search tree
        self.helper(root, target)

        # Return the upper bound node found during the search
        return self.upperBoundNode
```

## Complexity Analysis

We are using a modified version of the search algorithm, so we process only one root-to-leaf path when searching for the upper bound of a given value in a binary search tree. In the worst case, this root-to-leaf path could be the longest.

// Diagram: Worst case time complexity

We are not using any extra space apart from the recursion call stack, which will depend on the tree's height.

> **Best Case** - The binary search tree is height-balanced
>
> -   Space Complexity - **O(logN)**
> -   Time Complexity - **O(logN)**
>
> **Worst Case** - The binary search tree is skewed to the left or right
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Recursively find upper bound

## Problem Statement

Fundamental

Given the **root** of a binary search tree and a **target**, write a function to find and return the node in the tree that is the upper bound for the given target. Return `null` if no node has the upper bound for the given target. You must do this **recursively**.

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

    // Global variable to store the upper bound node found during the
    // traversal
    TreeNode *upperBoundNode = nullptr;

    void helper(TreeNode *root, int target) {

        // Base case: If the current node is null, return
        if (!root) {
            return;
        }

        // If the target is less than the value in the current node,
        // update the upper bound node to the current node and
        // continue searching in the left subtree
        if (target < root->val) {
            upperBoundNode = root;
            helper(root->left, target);

        }

        // If the target is greater than or equal to the value in the
        // current node, continue searching in the right subtree
        else {
            helper(root->right, target);
        }
    }

    TreeNode *recursivelyFindUpperBound(TreeNode *root, int target) {

        // Initialize the upper bound node to null
        upperBoundNode = nullptr;

        // Find the upper bound in the binary search tree
        helper(root, target);

        // Return the upper bound node found during the search
        return upperBoundNode;
    }
};
```
