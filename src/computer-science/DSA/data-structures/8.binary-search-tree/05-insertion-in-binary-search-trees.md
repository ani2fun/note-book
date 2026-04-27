# Insertion in binary search trees

## Table of Contents

1. [Understanding recursive insertion](#understanding-recursive-insertion)
2. [Recursively insert a node](#understanding-recursive-insertion)
3. [Understanding iterative insertion](#understanding-iterative-insertion)
4. [Iteratively insert a node](#understanding-iterative-insertion)

***

# Understanding recursive insertion

Inserting a node with the given value in a binary search tree can be implemented by piggybacking on the search algorithm we learned earlier. We use the search algorithm to search for the **insertion position** and then create and attach a new node.

## Algorithm

The algorithm to insert a node in a binary search tree is very similar to the search algorithm we learned earlier. Insertion of a node into a binary search tree is a two-step process:

> -   **Step 1:** Search for the position of insertion
> -   **Step 2:** Insert the node at the insertion position

**How do you find the position of insertion?**

To find the insertion position of a given value in the binary search tree, we will **assume** that the tree already has the given value and try to search for it. When we follow our search algorithm, we will arrive at a node with no way ahead. This is precisely where we have to perform the insertion to ensure that the tree remains a binary search tree after insertion.

Let us look at an example of finding the insertion position using the search algorithm and inserting a value in a binary search tree.

// Diagram: Inserting a node with the given value in a binary search tree

The insert operation in a binary search tree can be implemented as a straightforward recursive algorithm that first searches for the insertion position by going either to the left or right subtree at every point until it reaches the final position. A new node is created with the value inserted and connected to the tree.

// Diagram: Recursive equation to insert a value in a binary search tree

The recursive insertion of a node with the given value in a binary search tree can be summarised as the following algorithm.

> **Algorithm**
>
> -   **Step 1:** If the `current` node is `null`, create a new node and return it (base case).
> -   **Step 2:** If the `current` node's value exceeds the new value, recursively call the insert operation on the `left` subtree and store its result in the `left` child.
> -   **Step 3:** Else, if the `current` node's value is less than the new value, recursively call the insert operation on the `right` subtree and store its result in the `right` child.
> -   **Step 4:** Return the `current` node when the recursion exits.

## Implementation

We implement the recursive equation as functions to implement the insert algorithm.

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
    TreeNode *recursiveInsertion(TreeNode *root, int data) {

        // If the root is null, it means the tree is empty,
        // so create a new node and return it as the new root
        if (root == nullptr) {
            return new TreeNode(data);
        }

        // If the data is less than the value of the current root node,
        // it should be inserted in the left subtree of the current root
        if (data < root->val) {
            root->left = recursiveInsertion(root->left, data);
        }

        // If the data is greater than or equal to the value of the
        // current root node, it should be inserted in the right subtree
        // of the current root
        else {
            root->right = recursiveInsertion(root->right, data);
        }

        // Return the root of the tree after insertion
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

class Solution {
    public TreeNode recursiveInsertion(TreeNode root, int data) {

        // If the root is null, it means the tree is empty,
        // so create a new node and return it as the new root
        if (root == null) {
            return new TreeNode(data);
        }

        // If the data is less than the value of the current root node,
        // it should be inserted in the left subtree of the current root
        if (data < root.val) {
            root.left = recursiveInsertion(root.left, data);
        }

        // If the data is greater than or equal to the value of the
        // current root node,it should be inserted in the right subtree
        // of the current root
        else {
            root.right = recursiveInsertion(root.right, data);
        }

        // Return the root of the tree after insertion
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
    recursiveInsertion(root: TreeNode | null, data: number): TreeNode {

        // If the root is null, it means the tree is empty,
        // so create a new node and return it as the new root
        if (root === null) {
            return new TreeNode(data);
        }

        // If the data is less than the value of the current root node,
        // it should be inserted in the left subtree of the current root
        if (data < root.val) {
            root.left = this.recursiveInsertion(root.left, data);
        }

        // If the data is greater than or equal to the value of the
        // current root node,it should be inserted in the right subtree
        // of the current root
        else {
            root.right = this.recursiveInsertion(root.right, data);
        }

        // Return the root of the tree after insertion
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
    recursiveInsertion(root, data) {

        // If the root is null, it means the tree is empty,
        // so create a new node and return it as the new root
        if (root === null) {
            return new TreeNode(data);
        }

        // If the data is less than the value of the current root node,
        // it should be inserted in the left subtree of the current root
        if (data < root.val) {
            root.left = this.recursiveInsertion(root.left, data);
        }

        // If the data is greater than or equal to the value of the
        // current root node,it should be inserted in the right subtree
        // of the current root
        else {
            root.right = this.recursiveInsertion(root.right, data);
        }

        // Return the root of the tree after insertion
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
    def recursive_insertion(
        self, root: Optional[TreeNode], data: int
    ) -> Optional[TreeNode]:

        # If the root is None, it means the tree is empty,
        # so create a new node and return it as the new root
        if root is None:
            return TreeNode(data)

        # If the data is less than the value of the current root node,
        # it should be inserted in the left subtree of the current root
        if data < root.val:
            root.left = self.recursive_insertion(root.left, data)

        # If the data is greater than or equal to the value of the
        # current root node,it should be inserted in the right subtree
        # of the current root
        else:
            root.right = self.recursive_insertion(root.right, data)

        # Return the root of the tree after insertion
        return root
```

## Complexity Analysis

The algorithm for inserting a value in a binary search tree follows the same path as the search. It traverses the tree from top to bottom and, at every level, goes only in one direction, either left or right. And so, we process **only one root-to-leaf path** when inserting a value in a binary search tree. In the worst case, this root-to-leaf path could be the longest.

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

# Recursive insertion

## Problem Statement

Fundamental

Given the **root** of a binary search tree and a **data** value, write a function to insert a new node with the given valueand return the root of the updated tree.

You must do this **recursively**.

### Example 1

> -   **Input:** root = \[5, 4, 6, 2, null, null, 7\], data = 10
> -   **Output:** \[5, 4, 6, 2, null, null, 7, null, null, null, 10\]
> -   **Explanation:** The new node is inserted as the right child of the node with the value 7.

### Example 2

> -   **Input:** root = \[10, 8, 14, 5, null, 12, 17\], data = 9
> -   **Output:** \[10, 8, 14, 5, 9, 12, 17\]
> -   **Explanation:** The new node is inserted as the right child of the node with the value 8.

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
    TreeNode *recursiveInsertion(TreeNode *root, int data) {

        // If the root is null, it means the tree is empty,
        // so create a new node and return it as the new root
        if (root == nullptr) {
            return new TreeNode(data);
        }

        // If the data is less than the value of the current root node,
        // it should be inserted in the left subtree of the current root
        if (data < root->val) {
            root->left = recursiveInsertion(root->left, data);
        }

        // If the data is greater than or equal to the value of the
        // current root node, it should be inserted in the right subtree
        // of the current root
        else {
            root->right = recursiveInsertion(root->right, data);
        }

        // Return the root of the tree after insertion
        return root;
    }
};
```

***

# Understanding iterative insertion

We can insert a given value in a binary search tree iteratively, like the search algorithm. Since we only move from top to bottom in the tree and do not backtrack, we can replace the recursive function calls with loops to get an iterative algorithm.

## Algorithm

The idea is simple. We know that insertion is a two-step process. In the first step, we search for the insertion position and then insert the node in the second step. We need to convert the first step to its iterative form to get an iterative algorithm. Once we find the insertion position, we create a new node and return its reference to the caller.

// Diagram: Inserting a value in a binary search tree

The iterative insertion of a node with the given value in a binary search tree can be summarised as the following algorithm.

> **Algorithm**
>
> -   **Step 1:** Store the reference of the root node in a new variable called `current`.
> -   **Step 2:** While `current` is not `null`, do the following:
>     -   **Step 2.1:** If the `current` node's value exceeds the new value, do the following:
>         -   **Step 2.1.1**: If the `current` node's `left` child is `null`, insert data as the `left` child. Otherwise, move to the `left` child and continue searching.
>     -   **Step 2.2:** Else, if the `current` node's value is less than or equal to the new value, do the following:
>         -   **Step 2.2.1:** If the `current` node's `right` child is `null`, insert data as the right child. Otherwise, move to the `right` child and continue searching.
> -   **Step 3:** Return the tree's `root` after the successful insertion.

## Implementation

We implement the iterative insert algorithm using a simple while loop.

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
    TreeNode *iterativeInsertion(TreeNode *root, int data) {

        // If the root is null, create a new node with data and make it
        // the root
        if (!root) {
            return new TreeNode(data);
        }

        // Initialize a pointer current to traverse the tree starting
        // from the root
        TreeNode *current = root;

        // Traverse the tree until we find the appropriate position to
        // insert the data
        while (current) {

            // If the data is less than the current node's value, move to
            // the left subtree
            if (data < current->val) {

                // If the left child of the current node is null, insert
                // data as the left child. Otherwise, move to the left
                // child and continue searching
                if (!current->left) {
                    current->left = new TreeNode(data);
                    return root;
                }

                // Move to the left child
                else {
                    current = current->left;
                }

            // If data is greater than or equal to the current node's
            // valueIf the right child of the current node is null,
            // insert data as the right child. Otherwise, move to the
            // right child and continue searching.
            else {
                if (!current->right) {
                    current->right = new TreeNode(data);
                    return root;
                }

                // Move to the right child
                else {
                    current = current->right;
                }

        // Return the root of the tree after all insertions
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

// Diagram: TreeNode iterativeInsertion(TreeNode root, int data) {

        // If the root is null, create a new node with data and make it
        // the root
        if (root == null) {
            return new TreeNode(data);
        }

        // Initialize a pointer current to traverse the tree starting
        // from the root
        TreeNode current = root;

        // Traverse the tree until we find the appropriate position to
        // insert the data
        while (current != null) {

            // If the data is less than the current node's value, move to
            // the left subtree
            if (data < current.val) {

                // If the left child of the current node is null, insert
                // data as the left child. Otherwise, move to the left
                // child and continue searching
                if (current.left == null) {
                    current.left = new TreeNode(data);
                    return root;
                }

                // Move to the left child
                else {
                    current = current.left;
                }

            // If data is greater than or equal to the current node's
            // valueIf the right child of the current node is null,
            // insert data as the right child. Otherwise, move to the
            // right child and continue searching.
            else {
                if (current.right == null) {
                    current.right = new TreeNode(data);
                    return root;
                }

                // Move to the right child
                else {
                    current = current.right;
                }

        // Return the root of the tree after all insertions
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
    iterativeInsertion(root: TreeNode | null, data: number): TreeNode {

        // If the root is null, create a new node with data and make it
        // the root
        if (!root) {
            return new TreeNode(data);
        }

        // Initialize a pointer current to traverse the tree starting
        // from the root
        let current: TreeNode = root;

        // Traverse the tree until we find the appropriate position to
        // insert the data
        while (current) {

            // If the data is less than the current node's value, move to
            // the left subtree
            if (data < current.val) {

                // If the left child of the current node is null, insert
                // data as the left child. Otherwise, move to the left
                // child and continue searching
                if (!current.left) {
                    current.left = new TreeNode(data);
                    return root;
                }

                // Move to the left child
                else {
                    current = current.left;
                }

            // If data is greater than or equal to the current node's
            // valueIf the right child of the current node is null,
            // insert data as the right child. Otherwise, move to the
            // right child and continue searching.
            else {
                if (!current.right) {
                    current.right = new TreeNode(data);
                    return root;
                }

                // Move to the right child
                else {
                    current = current.right;
                }

        // Return the root of the tree after all insertions
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
    iterativeInsertion(root, data) {

        // If the root is null, create a new node with data and make it
        // the root
        if (!root) {
            return new TreeNode(data);
        }

        // Initialize a pointer current to traverse the tree starting
        // from the root
        let current = root;

        // Traverse the tree until we find the appropriate position to
        // insert the data
        while (current) {

            // If the data is less than the current node's value, move to
            // the left subtree
            if (data < current.val) {

                // If the left child of the current node is null, insert
                // data as the left child. Otherwise, move to the left
                // child and continue searching
                if (!current.left) {
                    current.left = new TreeNode(data);
                    return root;
                }

                // Move to the left child
                else {
                    current = current.left;
                }

            // If data is greater than or equal to the current node's
            // valueIf the right child of the current node is null,
            // insert data as the right child. Otherwise, move to the
            // right child and continue searching.
            else {
                if (!current.right) {
                    current.right = new TreeNode(data);
                    return root;
                }

                // Move to the right child
                else {
                    current = current.right;
                }

        // Return the root of the tree after all insertions
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
    def iterative_insertion(
        self, root: Optional[TreeNode], data: int
    ) -> Optional[TreeNode]:

        # If the root is None, create a new node with data and make it
        # the root
        if root is None:
            return TreeNode(data)

        # Initialize a pointer current to traverse the tree starting
        # from the root
        current = root

        # Traverse the tree until we find the appropriate position to
        # insert the data
        while current:

            # If the data is less than the current node's value, move to
            # the left subtree
            if data < current.val:

                # If the left child of the current node is None, insert
                # data as the left child. Otherwise, move to the left
                # child and continue searching
                if current.left is None:
                    current.left = TreeNode(data)
                    return root

                # Move to the left child
                else:
                    current = current.left

            # If data is greater than or equal to the current node's
            # valueIf the right child of the current node is None,
            # insert data as the right child. Otherwise, move to the
            # right child and continue searching.
            else:
                if current.right is None:
                    current.right = TreeNode(data)
                    return root

                # Move to the right child
                else:
                    current = current.right

        # Return the root of the tree after all insertions
        return root
```

## Complexity Analysis

The algorithm for inserting a value in a binary search tree follows precisely the same path as the search. It traverses the tree from top to bottom and, at every level, goes only in one direction, either left or right. And so, we process **only one root-to-leaf path** when inserting a value in a binary search tree. In the worst case, this root-to-leaf path could be the longest.

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

# Iterative insertion

## Problem Statement

Given the **root** of a binary search tree and a **data** value, write a function to insert a new node with the given value and return the root of the updated tree.

You must do this **iteratively**.

### Example 1

> -   **Input:** root = \[5, 4, 6, 2, null, null, 7\], data = 10
> -   **Output:** \[5, 4, 6, 2, null, null, 7, null, null, null, 10\]
> -   **Explanation:** The new node is inserted at as the right child of the node with the value 7.

### Example 2

> -   **Input:** root = \[10, 8, 14, 5, null, 12, 17\], data = 9
> -   **Output:** \[10, 8, 14, 5, 9, 12, 17\]
> -   **Explanation:** The new node is inserted as the right child of the node with the value 8.

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
    TreeNode *iterativeInsertion(TreeNode *root, int data) {

        // If the root is null, create a new node with data and make it
        // the root
        if (!root) {
            return new TreeNode(data);
        }

        // Initialize a pointer current to traverse the tree starting
        // from the root
        TreeNode *current = root;

        // Traverse the tree until we find the appropriate position to
        // insert the data
        while (current) {

            // If the data is less than the current node's value, move to
            // the left subtree
            if (data < current->val) {

                // If the left child of the current node is null, insert
                // data as the left child. Otherwise, move to the left
                // child and continue searching
                if (!current->left) {
                    current->left = new TreeNode(data);
                    return root;
                }

                // Move to the left child
                else {
                    current = current->left;
                }

            }

            // If data is greater than or equal to the current node's
            // valueIf the right child of the current node is null,
            // insert data as the right child. Otherwise, move to the
            // right child and continue searching.
            else {
                if (!current->right) {
                    current->right = new TreeNode(data);
                    return root;
                }

                // Move to the right child
                else {
                    current = current->right;
                }
            }
        }

        // Return the root of the tree after all insertions
        return root;
    }
};
```
