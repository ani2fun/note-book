# Deletion in binary search trees

## Table of Contents

1. [Understanding recursive deletion](#understanding-recursive-deletion)
2. [Inorder successor](#inorder-successor)
3. [Recursively delete a node](#understanding-recursive-deletion)
4. [Understanding iterative deletion](#understanding-iterative-deletion)
5. [Iteratively delete a node](#understanding-iterative-deletion)

***

# Understanding recursive deletion

Just like insertion, deleting a node with the given value from a binary search tree can be implemented by piggybacking on the search algorithm we learned earlier. However, unlike insertion, deleting a node from a binary search tree is more complex as we must ensure the tree follows the binary search property after the deletion.

## Algorithm

Deleting a node from a binary search tree is a two-step process.

> -   **Step 1:** Search the node to be deleted
> -   **Step 2:** Delete the node

We search for the node to be deleted using the search algorithm we learned earlier. However, deleting the node once we find it is not straightforward, as there are three different cases we need to consider. Let us look at these cases.

### 1\. Node to be deleted is a leaf node

This is the most straightforward case of deletion. If the node to be deleted is the leaf node, we can search for the node using the search algorithm we learned earlier and delete the node.

A binary search tree retains the binary search property if any leaf node is deleted.

// Diagram: Deleting a value from a binary search tree

### 2\. Node to be deleted has one child

If the node to be deleted only has one child node, we cannot delete it simply as the leaf node. This is because if we delete the node, its descendent subtree will become an orphan (without a parent), and the tree will split into two trees. We do the following to delete a node **N** with only one child, **C**.

> -   **Step 1:** Find the node \`N\` to be deleted.
> -   **Step 2:** Delete node \`N\` and reconnect \`C\` to the parent on \`N\`

// Diagram: Deleting a value from a binary search tree

### 3\. Node to be deleted has two children

If the node to be deleted has **two children**, it makes deleting it a bit more complicated. We cannot just delete the node like a leaf node, nor can we delete the node and connect the child as we have two children. After deleting the node, we must also ensure the tree remains a binary search tree. To delete a node, in this case, we must first find its **inorder successor.**

// Diagram: Inorder Successor

> Inorder successor of a node in a binary tree is the node that would come just after the given node in the inorder traversal of the tree.

The inorder successor of a node with two children will always be in its **right** subtree because the inorder traversal follows the left, center, and right order.

We do the following to delete the value **V** at node **N**, which has two children.

> -   **Step 1:** Find the node \`N\` to be deleted.
> -   **Step 2:** Find the inorder successor \`S\` of node \`N\`.
> -   **Step 3:** Swap of the value \`V\` at node \`N\` and the value stored in node \`S\`.
> -   **Step 4:** Delete value \`V\` from the \`right\` subtree of node \`N\` recursively.

**Why do we delete the value from the right subtree after swapping?**

After swapping, the value to be deleted will move to the position of the original node's inorder successor. Since we know that the inorder successor will always be present in the right subtree of a node, we now try to delete the value from the right subtree of the original node.

// Diagram: Deleting a value from a binary search tree

The recursive deletion of a node with the given value in a binary search tree can be summarised as the following algorithm.

> **Algorithm**
>
> -   **Step 1:** If the \`current\` node is \`null\`, return \`null\` (base case).
> -   **Step 2:** If the \`key\` exceeds the \`current\` node's value, recursively search it in the \`right\` subtree.
> -   **Step 3:** Else, if the \`key\` is smaller than the \`current\` node's value, recursively search it in the \`left\` subtree.
> -   **Step 4:** Else, if the \`key\` matches the \`current\` node's value, do the following:
>     -   **Step 4.1:** If the \`current\` node has no \`left\` child, do the following:
>         -   **Step 4.1.1:** Save the \`right\` child of the \`current\` node in a temporary variable.
>         -   **Step 4.1.2:** Delete the \`current\` node.
>         -   **Step 4.1.3:** Return the \`right\` child to reconnect it with the parent.
>     -   **Step 4.2:** Else, if the \`current\` node has no \`right\` child, do the following:
>         -   **Step 4.2.1:** Save the \`current\` node's \`left\` child in a temporary variable.
>         -   **Step 4.2.2:** Delete the \`current\` node.
>         -   **Step 4.2.3:** Return the \`left\` child to reconnect it with the parent.
>     -   **Step 4.3:** Else, if the \`current\` node has both the \`left\` and \`right\` children, do the following:
>         -   **Step 4.3.1:** Find the in-order successor of the \`current\` node (the smallest node in the right subtree).
>         -   **Step 4.3.2:** Copy the value of the inorder successor to the \`current\` node.
>         -   **Step 4.3.3**: Recursively delete the original inorder successor from the \`right\` subtree.
> -   **Step 5**: Return the binary search tree's updated \`root\` node at the end of recursion.

## Implementation

The algorithm can be implemented using recursive functions and combining all the cases using conditional statements.

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
    TreeNode *inorderSuccessor(TreeNode *root, TreeNode *node) {
        TreeNode *successor = nullptr;

        while (root != nullptr) {
            if (root->val > node->val) {
                successor = root;
                root = root->left;
            } else {
                root = root->right;
            }

        return successor;
    }

// Diagram: TreeNode recursiveDeletion(TreeNode root, int key) {

        // Base case: if the root is null, return nullptr
        if (!root) {
            return nullptr;
        }

        // If the key is greater than the current node's value, search in
        // the right subtree
        if (root->val < key) {
            root->right = recursiveDeletion(root->right, key);
        }

        // If the key is smaller than the current node's value, search in
        // the left subtree
        else if (root->val > key) {
            root->left = recursiveDeletion(root->left, key);

        }

        // If the key matches the current node's value, found the node
        // to delete
        else {

            // Case 1: Node has no left child
            if (!root->left) {

                // Save the right child of the current node
                TreeNode *temp = root->right;

                // Delete the current node
                delete root;

                // Return the right child to reconnect it with the parent
                return temp;
            }

            // Case 2: Node has no right child
            else if (!root->right) {

                // Save the left child of the current node
                TreeNode *temp = root->left;

                // Delete the current node
                delete root;

                // Return the left child to reconnect it with the parent
                return temp;
            }

            // Case 3: Node has both left and right children
            else {

                // Find inorder successor of the node
                TreeNode *successor =
                    inorderSuccessor(root->right, root);

                // Copy successor's value to current node
                root->val = successor->val;

                // Delete successor
                root->right =
                    recursiveDeletion(root->right, successor->val);
            }

        // Return the updated root node of the binary search tree
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
    public TreeNode inorderSuccessor(TreeNode root, TreeNode node) {
        TreeNode successor = null;

        while (root != null) {
            if (root.val > node.val) {
                successor = root;
                root = root.left;
            } else {
                root = root.right;
            }

        return successor;
    }

// Diagram: public TreeNode recursiveDeletion(TreeNode root, int key) {

        // Base case: if the root is null, return null
        if (root == null) {
            return null;
        }

        // If the key is greater than the current node's value, search in
        // the right subtree
        if (root.val < key) {
            root.right = recursiveDeletion(root.right, key);
        }

        // If the key is smaller than the current node's value, search in
        // the left subtree
        else if (root.val > key) {
            root.left = recursiveDeletion(root.left, key);
        }

        // If the key matches the current node's value, found the node
        // to delete
        else {

            // Case 1: Node has no left child
            if (root.left == null) {

                // Save the right child of the current node
                TreeNode temp = root.right;

                // Delete the current node
                root = null;

                // Return the right child to reconnect it with the parent
                return temp;
            }

            // Case 2: Node has no right child
            else if (root.right == null) {

                // Save the left child of the current node
                TreeNode temp = root.left;

                // Delete the current node
                root = null;

                // Return the left child to reconnect it with the parent
                return temp;
            }

            // Case 3: Node has both left and right children
            else {

                // Find inorder successor of the node
                TreeNode successor = inorderSuccessor(root.right, root);

                // Copy successor's value to current node
                root.val = successor.val;

                // Delete successor
                root.right =
                    recursiveDeletion(root.right, successor.val);
            }

        // Return the updated root node of the binary search tree
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
    inorderSuccessor(
        root: TreeNode | null,
        node: TreeNode
    ): TreeNode | null {
        let successor: TreeNode | null = null;

        while (root !== null) {
            if (root.val > node.val) {
                successor = root;
                root = root.left;
            } else {
                root = root.right;
            }

        return successor;
    }

    recursiveDeletion(
        root: TreeNode | null,
        key: number
    ): TreeNode | null {

        // Base case: if the root is null, return null
        if (root === null) {
            return null;
        }

        // If the key is greater than the current node's value, search in
        // the right subtree
        if (root.val < key) {
            root.right = this.recursiveDeletion(root.right, key);
        }

        // If the key is smaller than the current node's value, search in
        // the left subtree
        else if (root.val > key) {
            root.left = this.recursiveDeletion(root.left, key);
        }

        // If the key matches the current node's value, found the node
        // to delete
        else {

            // Case 1: Node has no left child
            if (root.left === null) {

                // Save the right child of the current node
                let temp: TreeNode | null = root.right;

                // Delete the current node
                root = null;

                // Return the right child to reconnect it with the parent
                return temp;
            }

            // Case 2: Node has no right child
            else if (root.right === null) {

                // Save the left child of the current node
                let temp: TreeNode | null = root.left;

                // Delete the current node
                root = null;

                // Return the left child to reconnect it with the parent
                return temp;
            }

            // Case 3: Node has both left and right children
            else {

                // Find inorder successor of the node
                let successor = this.inorderSuccessor(root.right, root)!;

                // Copy successor's value to current node
                root.val = successor.val;

                // Delete successor
                root.right = this.recursiveDeletion(
                    root.right,
                    successor.val
                );
            }

        // Return the updated root node of the binary search tree
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
    inorderSuccessor(root, node) {
        let successor = null;

        while (root !== null) {
            if (root.val > node.val) {
                successor = root;
                root = root.left;
            } else {
                root = root.right;
            }

        return successor;
    }

// Diagram: recursiveDeletion(root, key) {

        // Base case: if the root is null, return null
        if (root === null) {
            return null;
        }

        // If the key is greater than the current node's value, search in
        // the right subtree
        if (root.val < key) {
            root.right = this.recursiveDeletion(root.right, key);
        }

        // If the key is smaller than the current node's value, search in
        // the left subtree
        else if (root.val > key) {
            root.left = this.recursiveDeletion(root.left, key);
        }

        // If the key matches the current node's value, found the node
        // to delete
        else {

            // Case 1: Node has no left child
            if (root.left === null) {
                let temp = root.right;
                root = null;
                return temp;
            }

            // Case 2: Node has no right child
            else if (root.right === null) {
                let temp = root.left;
                root = null;
                return temp;
            }

            // Case 3: Node has both left and right children
            else {
                let successor = this.inorderSuccessor(root.right, root);
                root.val = successor.val;
                root.right = this.recursiveDeletion(
                    root.right,
                    successor.val
                );
            }

        // Return the updated root node of the binary search tree
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
    def inorder_successor(
        self, root: Optional[TreeNode], node: Optional[TreeNode]
    ) -> Optional[TreeNode]:
        successor = None

        while root is not None:
            if root.val > node.val:
                successor = root
                root = root.left
            else:
                root = root.right

// Diagram: return successor

    def recursive_deletion(
        self, root: Optional[TreeNode], key: int
    ) -> Optional[TreeNode]:

        # Base case: if the root is null, return null
        if root is None:
            return None

        # If the key is greater than the current node's value, search in
        # the right subtree
        if key > root.val:
            root.right = self.recursive_deletion(root.right, key)

        # If the key is smaller than the current node's value, search in
        # the left subtree
        elif key < root.val:
            root.left = self.recursive_deletion(root.left, key)

        # If the key matches the current node's value, found the node
        # to delete
        else:

            # Case 1: Node has no left child
            if root.left is None:

                # Save the right child of the current node
                temp = root.right

                # Delete the current node
                root = None

                # Return the right child to reconnect it with the parent
                return temp

            # Case 2: Node has no right child
            elif root.right is None:

                # Save the left child of the current node
                temp = root.left

                # Delete the current node
                root = None

                # Return the left child to reconnect it with the parent
                return temp

            # Case 3: Node has both left and right children
            else:

                # Find inorder successor of the node (smallest value in
                # right subtree)
                successor = self.inorder_successor(root.right, root)

                # Copy successor's value to current node
                root.val = successor.val

                # Delete successor
                root.right = self.recursive_deletion(
                    root.right, successor.val
                )

        # Return the updated root node of the binary search tree
        return root
```

## Complexity Analysis

The algorithm for deleting a value from a binary search tree follows the same path as the search. It traverses the tree from top to bottom and, at every level, goes only in one direction, either left or right. So, we process only one root-to-leaf path when deleting a value in a binary search tree. In the worst case, this root-to-leaf path could be the longest.

// Diagram: Worst case time complexity

We are not using any extra space apart from the recursion call stack, which will depend on the tree's height.

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

# Inorder successor

## Problem Statement

Given the **root** of a binary search tree and a random **node** in the tree, write a function to find and return the inorder successor of the node. If no inorder successor is found, return `null` instead.

 Inorder successor of a node is the node that comes just after the given node in the inorder traversal sequence of the binary tree.

### Example 1

> -   **Input:** root = \[5, 4, 6, 2, null, null, 7\], node = 4
> -   **Output:** 5
> -   **Explanation:** The node with value 5 is the inorder successor of the given node.

### Example 2

> -   **Input:** root = \[10, 8, 14, 5, null, 12, 17\], node = 10
> -   **Output:** 12
> -   **Explanation:** The node with value 12 is the inorder successor of the given node.

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
    TreeNode *inorderSuccessor(TreeNode *root, TreeNode *node) {

        // Initialize the successor as nullptr
        TreeNode *successor = nullptr;

        while (root != nullptr) {

            // If the current node's value is greater than the given
            // node's value
            if (root->val > node->val) {

                // Set the current node as the potential successor
                successor = root;

                // Move to the left subtree since the successor will be
                // in the left subtree
                root = root->left;
            }

            // If the current node's value is less than or equal to the
            // given node's value, move to the right subtree as the
            // successor cannot be in the current node
            else {
                root = root->right;
            }
        }

        // Return the found successor
        return successor;
    }
};
```

***

# Recursive deletion

## Problem Statement

Given the **root** of a binary search tree and an integer value **key**, write a function to delete the node with the given value from the tree and return the modified root of the tree.

You must do this **recursively**.

### Example 1

> -   **Input:** root = \[5, 4, 6, 2, null, null, 7\], key = 6
> -   **Output:** \[5, 4, 7, 2\]

### Example 2

> -   **Input:** root = \[10, 8, 14, 5, null, 12, 17\], key = 14
> -   **Output:** \[10, 8, 17, 5, null, 12\]

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
    TreeNode *inorderSuccessor(TreeNode *root, TreeNode *node) {
        TreeNode *successor = nullptr;

        while (root != nullptr) {
            if (root->val > node->val) {
                successor = root;
                root = root->left;
            } else {
                root = root->right;
            }
        }

        return successor;
    }

    TreeNode *recursiveDeletion(TreeNode *root, int key) {

        // Base case: if the root is null, return nullptr
        if (!root) {
            return nullptr;
        }

        // If the key is greater than the current node's value, search in
        // the right subtree
        if (root->val < key) {
            root->right = recursiveDeletion(root->right, key);
        }

        // If the key is smaller than the current node's value, search in
        // the left subtree
        else if (root->val > key) {
            root->left = recursiveDeletion(root->left, key);

        }

        // If the key matches the current node's value, found the node
        // to delete
        else {

            // Case 1: Node has no left child
            if (!root->left) {

                // Save the right child of the current node
                TreeNode *temp = root->right;

                // Delete the current node
                delete root;

                // Return the right child to reconnect it with the parent
                return temp;
            }

            // Case 2: Node has no right child
            else if (!root->right) {

                // Save the left child of the current node
                TreeNode *temp = root->left;

                // Delete the current node
                delete root;

                // Return the left child to reconnect it with the parent
                return temp;
            }

            // Case 3: Node has both left and right children
            else {

                // Find inorder successor of the node
                TreeNode *successor =
                    inorderSuccessor(root->right, root);

                // Copy successor's value to current node
                root->val = successor->val;

                // Delete successor
                root->right =
                    recursiveDeletion(root->right, successor->val);
            }
        }

        // Return the updated root node of the binary search tree
        return root;
    }
};
```

***

# Understanding iterative deletion

Just like insertion, we can also delete a given value from a binary search tree iteratively. Since we only move from top to bottom in the tree and do not backtrack, we can replace the recursive function calls with loops to get an iterative algorithm.

## Algorithm

The idea is simple. We know that deletion is a two-step process: in the first step, we search for the node to be deleted, and then in the second step, we delete it. We need to convert the first step to its iterative form to get an iterative algorithm. Once we find the node to be deleted, we remove the links to it from its parent. 

To delete a node, we need access to its parent. Unlike in the recursive algorithm, we cannot rely on the recursive call stack to hold the parent's information, so we must keep track of it while traversing iteratively. 

### 1\. Node to be deleted is a leaf node

This is the most straightforward case of deletion. If the node to be deleted is the leaf node, we can search for it using the iterative search algorithm we learned earlier and delete it.

A binary search tree retains the binary search property if any leaf node is deleted.

// Diagram: Deleting a value from a binary search tree

### 2\. Node to be deleted has one child

If the node to be deleted only has one child node, we cannot delete it simply as the leaf node. This is because if we delete the node, its descendent subtree will become an orphan (without a parent), and the tree will split into two trees. We do the following to delete node **N** with only one child, **C**, and parent, **P**.

> -   **Step 1:** Find the node \`N\` to be deleted.
> -   **Step 2:** Delete node \`N\` and reconnect \`C\` to the parent \`P\` of \`N\` as the correct (\`left\` or \`right\`) child.

// Diagram: Two cases to consider when reconnecting nodes to perform deletion of node with given value

// Diagram: Deleting a value from a binary search tree

### 3\. Node to be deleted has two children

If the node to be deleted has two children, it makes deleting the node a bit more difficult. We cannot simply delete the node like a leaf node, nor can we delete the node and connect the child, as we now have two children. We must also ensure the tree remains a binary search tree after deletion. Like the recursive implementation, we find the node's **inorder successor** first.

// Diagram: Inorder Successor

> Inorder successor of a node in a binary tree is the node that would come just after the given node in the inorder traversal of the tree.

There are two important observations to make here.

> -   The inorder successor of a node with two children will always be in its \`right\` subtree. This is because the inorder traversal follows \`left\`, \`center\`, \`right\` order.
> -   The inorder successor node will not have any \`left\` child.

We do the following to delete the value **V** at node **N**, which has two children.

> -   **Step 1:** Find the node \`N\` to be deleted.
> -   **Step 2:** Find the inorder successor \`S\` of node \`N\` iteratively.
> -   **Step 3:** Swap the value \`V\` at node \`N\` and the value stored in node \`S\`.
> -   **Step 4:** Delete value \`V\` from the \`right\` subtree of node \`N\` iteratively.

Step 4 of the above algorithm is a bit tricky to implement. The inorder successor is guaranteed to be in the right subtree. However, it can be either the root node of the right subtree or any other node in the right subtree.

The recursive algorithm stored the parent node in the call stack, implicitly taking care of both cases. However, for the iterative implementation, we need to consider both cases.

// Diagram: Two cases to consider when reconnecting nodes to perform deletion of the inorder successor from the right subtree

Let us look at an example to understand this better. The example below elaborates on case 3.1, where the parent of the inordinate successor and the given node differ.

// Diagram: Deleting a node from a binary search tree that has two children

The iterative deletion of a node with the given value in a binary search tree can be summarised as the following algorithm.

> **Algorithm**
>
> -   **Step 1:** If the \`root\` node is \`null\`, return \`null\`.
> -   **Step 2:** Create variables to store the \`current\` node and it's \`parent\`.
> -   **Step 3:** While \`current\` is not \`null\` and the value in current is not equal to the \`key\`, search for the \`key\` in \`left\` and \`right\` subtrees while keeping track of \`current\` and \`parent\` nodes.
> -   **Step 4:** Return' \`null\` if the \`key\` is not found.
> -   **Step 5:** If the \`current\` node has zero or one child, do the following:
>     -   **Step 5.1:** Connect the \`parent\` node to the \`left\` or \`right\` child (which ever is present).
>     -   **Step 5.2:** Delete the \`current\` node.
> -   **Step 6:** Else, if the \`current\` node has both \`left\` and \`right\` children, do the following:
>     -   **Step 6.1:** Find the in-order successor of the \`current\` node (the smallest node in the \`right\` subtree).
>     -   **Step 6.2:** Copy the value of the inorder successor to the \`current\` node.
>     -   **Step 6.3**: Delete the original inorder successor node.
> -   **Step 7**: Return the binary search tree's updated \`root\` node.

## Implementation

The algorithm can be implemented by using a while loop and combining all the cases using conditional statements.

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
    TreeNode *iterativeDeletion(TreeNode *root, int key) {

        // If the root is null, return null (no node to delete)
        if (root == nullptr) {
            return nullptr;
        }

        TreeNode *parent = nullptr;
        TreeNode *current = root;
        while (current != nullptr && current->val != key) {

            // Keep track of the parent of the current node
            parent = current;

            // Search in the left subtree
            if (key < current->val) {
                current = current->left;
            }

            // Search in the right subtree
            else {
                current = current->right;
            }

        // If the key was not found, return null (no node to delete)
        if (current == nullptr) {
            return nullptr;
        }

        // Case 1: Node has zero or one child.
        if (!current->left || !current->right) {
            TreeNode *newCurrent;

            // Choose the right child if it exists
            if (current->left == nullptr) {
                newCurrent = current->right;
            }

            // Choose the left child if it exists
            else {
                newCurrent = current->left;
            }

            // If the current node is the root, return the new
            // current node.
            if (parent == nullptr) {
                return newCurrent;
            }

            // Reconnect the left child of the parent to the new
            // current node.
            if (current == parent->left) {
                parent->left = newCurrent;
            }

            // Reconnect the tight child of the parent to the new
            // current node.
            else {
                parent->right = newCurrent;
            }

            // Delete the current node
            delete (current);
        }

        // Case 2: Node has both left and right children
        else {

            // Keep track of the parent of the in-order successor
            TreeNode *inParent = current;

            // Find the in-order successor (the smallest node in the
            // right subtree)
            TreeNode *successor = current->right;

// Diagram: while (successor && successor->left) {

                // Traverse to the leftmost node of the right subtree
                inParent = successor;
                successor = successor->left;
            }

            // If the parent of the in-order successor is not the current
            // node
            if (inParent != current) {

                // Reconnect the parent of the in-order successor to its
                // right child
                inParent->left = successor->right;
            }

            // If the in-order successor is the right child of the
            // current node
            else {

                // Reconnect the current node to the right child of the
                // in-order successor
                current->right = successor->right;
            }

            // Copy the value of the in-order successor to the current
            // node
            current->val = successor->val;

            // Delete the in-order successor node
            delete (successor);
        }

        // Return the updated root node of the binary search tree
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
    public TreeNode iterativeDeletion(TreeNode root, int key) {

        // If the root is null, return null (no node to delete)
        if (root == null) {
            return null;
        }

        TreeNode parent = null;
        TreeNode current = root;

// Diagram: while (current != null && current.val != key) {

            // Keep track of the parent of the current node
            parent = current;

            // Search in the left subtree
            if (key < current.val) {
                current = current.left;
            }

            // Search in the right subtree
            else {
                current = current.right;
            }

        // If the key was not found, return null (no node to delete)
        if (current == null) {
            return null;
        }

        // Case 1: Node has zero or one child.
        if (current.left == null || current.right == null) {
            TreeNode newCurrent = null;

            // Choose the right child if it exists
            if (current.left == null) {
                newCurrent = current.right;
            }

            // Choose the left child if it exists
            else {
                newCurrent = current.left;
            }

            // If the current node is the root, return the new current
            // node.
            if (parent == null) {
                return newCurrent;
            }

            // Reconnect the left child of the parent to the new current
            // node.
            if (current == parent.left) {
                parent.left = newCurrent;
            }

            // Reconnect the right child of the parent to the new current
            // node.
            else {
                parent.right = newCurrent;
            }

            // Delete the current node
            current = null;
        }

        // Case 2: Node has both left and right children
        else {

            // Keep track of the parent of the in-order successor
            TreeNode inParent = current;

            // Find the in-order successor (the smallest node in the
            // right subtree)
            TreeNode successor = current.right;

// Diagram: while (successor != null && successor.left != null) {

                // Traverse to the leftmost node of the right subtree
                inParent = successor;
                successor = successor.left;
            }

            // If the parent of the in-order successor is not the current
            // node
            if (inParent != current) {

                // Reconnect the parent of the in-order successor to its
                // right child
                inParent.left = successor.right;
            }

            // If the in-order successor is the right child of the
            // current node
            else {

                // Reconnect the current node to the right child of the
                // in-order successor
                current.right = successor.right;
            }

            // Copy the value of the in-order successor to the current
            // node
            current.val = successor.val;

            // Delete the in-order successor node
            successor = null;
        }

        // Return the updated root node of the binary search tree
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
    iterativeDeletion(
        root: TreeNode | null,
        key: number
    ): TreeNode | null {

        // If the root is null, return null (no node to delete)
        if (root === null) {
            return null;
        }

        let parent: TreeNode | null = null;
        let current: TreeNode | null = root;

// Diagram: while (current !== null && current.val !== key) {

            // Keep track of the parent of the current node
            parent = current;

            // Search in the left subtree
            if (key < current.val) {
                current = current.left;
            }

            // Search in the right subtree
            else {
                current = current.right;
            }

        // If the key was not found, return null (no node to delete)
        if (current === null) {
            return null;
        }

        // Case 1: Node has zero or one child.
        if (current.left === null || current.right === null) {
            let newCurrent: TreeNode | null = null;

            // Choose the right child if it exists
            if (current.left === null) {
                newCurrent = current.right;
            }

            // Choose the left child if it exists
            else {
                newCurrent = current.left;
            }

            // If the current node is the root, return the new current
            // node.
            if (parent === null) {
                return newCurrent;
            }

            // Reconnect the left child of the parent to the new current
            // node.
            if (current === parent.left) {
                parent.left = newCurrent;
            }

            // Reconnect the right child of the parent to the new current
            // node.
            else {
                parent.right = newCurrent;
            }

            // Delete the current node
            current = null;
        }

        // Case 2: Node has both left and right children
        else {

            // Keep track of the parent of the in-order successor
            let inParent: TreeNode | null = current;

            // Find the in-order successor (the smallest node in the
            // right subtree)
            let successor: TreeNode | null = current.right;

// Diagram: while (successor !== null && successor.left !== null) {

                // Traverse to the leftmost node of the right subtree
                inParent = successor;
                successor = successor.left;
            }

            // If the parent of the in-order successor is not the current
            // node
            if (inParent !== current) {

                // Reconnect the parent of the in-order successor to its
                // right child
                inParent.left = successor.right;
            }

            // If the in-order successor is the right child of the
            // current node
            else {

                // Reconnect the current node to the right child of the
                // in-order successor
                current.right = successor.right;
            }

            // Copy the value of the in-order successor to the current
            // node
            current.val = successor.val;

            // Delete the in-order successor node
            successor = null;
        }

        // Return the updated root node of the binary search tree
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
    iterativeDeletion(root, key) {

        // If the root is null, return null (no node to delete)
        if (root === null) {
            return null;
        }

        let parent = null;
        let current = root;

// Diagram: while (current !== null && current.val !== key) {

            // Keep track of the parent of the current node
            parent = current;

            // Search in the left subtree
            if (key < current.val) {
                current = current.left;
            }

            // Search in the right subtree
            else {
                current = current.right;
            }

        // If the key was not found, return null (no node to delete)
        if (current === null) {
            return null;
        }

        // Case 1: Node has zero or one child.
        if (current.left === null || current.right === null) {
            let newCurrent = null;

            // Choose the right child if it exists
            if (current.left === null) {
                newCurrent = current.right;
            }

            // Choose the left child if it exists
            else {
                newCurrent = current.left;
            }

            // If the current node is the root, return the new current
            // node.
            if (parent === null) {
                return newCurrent;
            }

            // Reconnect the left child of the parent to the new current
            // node.
            if (current === parent.left) {
                parent.left = newCurrent;
            }

            // Reconnect the right child of the parent to the new current
            // node.
            else {
                parent.right = newCurrent;
            }

            // Delete the current node
            current = null;
        }

        // Case 2: Node has both left and right children
        else {

            // Keep track of the parent of the in-order successor
            let inParent = current;

            // Find the in-order successor (the smallest node in the
            // right subtree)
            let successor = current.right;

// Diagram: while (successor !== null && successor.left !== null) {

                // Traverse to the leftmost node of the right subtree
                inParent = successor;
                successor = successor.left;
            }

            // If the parent of the in-order successor is not the current
            // node
            if (inParent !== current) {

                // Reconnect the parent of the in-order successor to its
                // right child
                inParent.left = successor.right;
            }

            // If the in-order successor is the right child of the
            // current node
            else {

                // Reconnect the current node to the right child of the
                // in-order successor
                current.right = successor.right;
            }

            // Copy the value of the in-order successor to the current
            // node
            current.val = successor.val;

            // Delete the in-order successor node
            successor = null;
        }

        // Return the updated root node of the binary search tree
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
    def iterative_deletion(
        self, root: Optional[TreeNode], key: int
    ) -> Optional[TreeNode]:

        # If the root is null, return null (no node to delete)
        if root is None:
            return None

        parent = None
        current = root

        while current is not None and current.val != key:

            # Keep track of the parent of the current node
            parent = current

            # Search in the left subtree
            if key < current.val:
                current = current.left

            # Search in the right subtree
            else:
                current = current.right

        # If the key was not found, return null (no node to delete)
        if current is None:
            return None

        # Case 1: Node has zero or one child.
        if current.left is None or current.right is None:
            new_current = None

            # Choose the right child if it exists
            if current.left is None:
                new_current = current.right

            # Choose the left child if it exists
            else:
                new_current = current.left

            # If the current node is the root, return the new current
            # node.
            if parent is None:
                return new_current

            # Reconnect the left child of the parent to the new current
            # node.
            if current == parent.left:
                parent.left = new_current

            # Reconnect the right child of the parent to the new current
            # node.
            else:
                parent.right = new_current

            # Delete the current node
            current = None

        # Case 2: Node has both left and right children
        else:

            # Keep track of the parent of the in-order successor
            in_parent = current

            # Find the in-order successor (the smallest node in the right
            # subtree)
            successor = current.right

            while successor and successor.left:

                # Traverse to the leftmost node of the right subtree
                in_parent = successor
                successor = successor.left

            # If the parent of the in-order successor is not the current
            # node
            if in_parent != current:

                # Reconnect the parent of the in-order successor to its
                # right child
                in_parent.left = successor.right

            # If the in-order successor is the right child of the
            # current node
            else:

                # Reconnect the current node to the right child of the
                # in-order successor
                current.right = successor.right

            # Copy the value of the in-order successor to the current
            # node
            current.val = successor.val

            # Delete the in-order successor node
            successor = None

        # Return the updated root node of the binary search tree
        return root
```

## Complexity Analysis

The algorithm for deleting a value from a binary search tree follows the same path as the search. It traverses the tree from top to bottom and, at every level, goes only in one direction, either left or right. So, we process only one root-to-leaf path when deleting a value in a binary search tree. In the worst case, this root-to-leaf path could be the longest.

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

# Iterative deletion

## Problem Statement

Given the **root** of a binary search tree and an integer value **key**, write a function to delete the node with the given value from the tree and return the modified root of the tree.

You must do this **iteratively**.

### Example 1

> -   **Input:** root = \[5, 4, 6, 2, null, null, 7\], key = 6
> -   **Output:** \[5, 4, 7, 2\]

### Example 2

> -   **Input:** root = \[10, 8, 14, 5, null, 12, 17\], key = 14
> -   **Output:** \[10, 8, 17, 5, null, 12\]

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
    TreeNode *iterativeDeletion(TreeNode *root, int key) {

        // If the root is null, return null (no node to delete)
        if (root == nullptr) {
            return nullptr;
        }

        TreeNode *parent = nullptr;
        TreeNode *current = root;
        while (current != nullptr && current->val != key) {

            // Keep track of the parent of the current node
            parent = current;

            // Search in the left subtree
            if (key < current->val) {
                current = current->left;
            }

            // Search in the right subtree
            else {
                current = current->right;
            }
        }

        // If the key was not found, return null (no node to delete)
        if (current == nullptr) {
            return nullptr;
        }

        // Case 1: Node has zero or one child.
        if (!current->left || !current->right) {
            TreeNode *newCurrent;

            // Choose the right child if it exists
            if (current->left == nullptr) {
                newCurrent = current->right;
            }

            // Choose the left child if it exists
            else {
                newCurrent = current->left;
            }

            // If the current node is the root, return the new
            // current node.
            if (parent == nullptr) {
                return newCurrent;
            }

            // Reconnect the left child of the parent to the new
            // current node.
            if (current == parent->left) {
                parent->left = newCurrent;
            }

            // Reconnect the tight child of the parent to the new
            // current node.
            else {
                parent->right = newCurrent;
            }

            // Delete the current node
            delete (current);
        }

        // Case 2: Node has both left and right children
        else {

            // Keep track of the parent of the in-order successor
            TreeNode *inParent = current;

            // Find the in-order successor (the smallest node in the
            // right subtree)
            TreeNode *successor = current->right;

            while (successor && successor->left) {

                // Traverse to the leftmost node of the right subtree
                inParent = successor;
                successor = successor->left;
            }

            // If the parent of the in-order successor is not the current
            // node
            if (inParent != current) {

                // Reconnect the parent of the in-order successor to its
                // right child
                inParent->left = successor->right;
            }

            // If the in-order successor is the right child of the
            // current node
            else {

                // Reconnect the current node to the right child of the
                // in-order successor
                current->right = successor->right;
            }

            // Copy the value of the in-order successor to the current
            // node
            current->val = successor->val;

            // Delete the in-order successor node
            delete (successor);
        }

        // Return the updated root node of the binary search tree
        return root;
    }
};
```
