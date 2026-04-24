# Height & balance in binary search trees

## Table of Contents

1. [Understanding the impact of height on performance](#understanding-the-impact-of-height-on-performance)
2. [Understanding the balance of a tree](#height-balance-in-binary-search-trees)
3. [Balance factor](#balance-factor)
4. [Balance of subtree](#balance-of-subtree)
5. [Challenges in implementing complete binary search trees](#challenges-in-implementing-complete-binary-search-trees)
6. [Understanding height balanced binary trees](#understanding-height-balanced-binary-trees)
7. [Height balanced tree](#height-balanced-tree)

***

# Understanding the impact of height on performance

The height of a binary search tree is a **critical** property. So far, all the operations we have seen depend critically on the tree's height. There can be many tree representations for any given tree with N nodes. Not all tree representations are the same, however. To understand better how the height and number of nodes are related, let us look at all possible trees that can be created with just four nodes.

// Diagram: All possible tree structures with 4 nodes

Some tree structures perform better than others regarding basic operations like search, insert, and delete.

## Most performant binary trees

The trees with the least height will perform best. As we can see, all the trees with all their levels filled, except possibly the last ones, are those with the minimum height.

// Diagram: Trees with 4 nodes that have the minimum possible height

## Least performant binary trees

The trees with the greatest height will perform the worst. These trees are all skew trees, where every node increases the tree's height by one.

// Diagram: Tree with 4 nodes with maximum possible height

## Limitation in using height for perforamnce

The worst-case runtime complexity for most binary search tree operations is **O(h)**, where h is the tree's height. Following this statement, all trees with the same height should perform the same. But this is not always true. The big O notation only tells us the bounds of performance and not the actual performance. When we have a large number of nodes, the constant factor that we usually ignore while calculating the big O notation starts to make a difference, so not all trees with the same height perform the same.

Let us look at an example of two trees with the same height and see which performs better.

// Diagram: Average hops to search for a node in two trees of same height

As we can see from the example, the average number of hops needed to search for a node in two trees of the same height might not be equal, so height alone is not the correct metric for judging the performance of binary search trees.

***

# Understanding the impact of balance on performance

Now that we know that not all binary search trees are equal in performance, we can dive deeper and try to understand the metric that can measure how good a binary search tree is performance-wise. This metric is called the balance factor.

// Diagram: Balance factor

> The balance factor for a node is the difference between the height of its left and right subtree.

// Diagram: Balance factor for subtree rooted at node

Let's examine all the possible tree structures that can be created using four nodes and determine the balance factor for each one. 

// Diagram: Trees that have same height can have different balance factors

As we can see from the example, different trees of the same height can have different balance factors. Let's examine two trees of the same height but with different balance factors and see which performs better.

// Diagram: Absolute balance factor

> The absolute value of the balance factor is called the absolute balance factor.

// Diagram: Trees with lower absolute balance factor have better performance

As we can see from the example, a tree with a lower absolute balance factor but the same height performs better than a tree with a higher absolute balance factor.

## Characteristics of optimal binary search trees

The best-performing binary search trees are the ones that have the **minimum** possible height and the **minimum** possible absolute balance factor. A tree is guaranteed to have the minimum possible height if all the nodes in the tree have the minimum possible absolute balance factor. This can be easily proved by creating a tree with five nodes such that every node has the minimum possible absolute balance factor at every step.

// Diagram: Creating binary tree with 5 nodes where absolute balance factor of every node is atmost 1

As we can see from the example above, the restriction for every node to have the minimum possible absolute balance factor forces us to fill all the nodes for a level before inserting a node in the next level. This, in turn, generates a **complete binary tree**, which is the **most optimal** tree structure for N nodes as it is a tree with the minimum possible height and minimum possible absolute balance factor for all nodes.

***

# Balance factor

## Problem Statement

Given the **root** of a binary search tree, write a function to calculate and return its balance factor.

> The balance factor of a binary tree is the difference between the height of the left and right subtree of the root node

### Example 1

> -   **Input:** root = \[4, 2, 6, 1, null, null, 7\]
> -   **Output:** 0
> -   **Explanation:**
>     -   height of left subtree = 2
>     -   height of right subtree = 2
>     -   balance factor = 2 - 2 = 0

### Example 2

> -   **Input:** root = \[2, 1, 4, null, null, 3, 7\]
> -   **Output:** -1
> -   **Explanation:**
>     -   height of left subtree = 1
>     -   height of right subtree = 2
>     -   balance factor = 1 - 2 = -1

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
    int findHeight(TreeNode *root) {

        // Empty tree has height 0
        if (root == nullptr) {
            return 0;
        }

        // Recursively calculate the height of the left and right
        // subtrees
        int leftHeight = findHeight(root->left);
        int rightHeight = findHeight(root->right);

        // Return the maximum height among the left and right subtrees
        // plus 1 for the current node
        return max(leftHeight, rightHeight) + 1;
    }

    int balanceFactor(TreeNode *root) {
        if (root == nullptr) {
            return 0;
        }

        // Calculate the height of the left subtree
        int leftHeight = findHeight(root->left);

        // Calculate the height of the right subtree
        int rightHeight = findHeight(root->right);

        // Calculate the balance factor
        int balanceFactor = leftHeight - rightHeight;

        return balanceFactor;
    }
};
```

***

# Balance of subtree

## Problem Statement

Fundamental

Given the **root** of a binary search tree and the **value** of a node, write a function to find and return the balance factor of the subtree at that node. Return `0` if the node with the given value does not exist.

The balance factor of a subtree is the difference between the height of its left and right subtree.

### Example 1

> -   **Input:** root = \[4, 2, 6, 1, null, null, 7\], value = 2
> -   **Output:** 1
> -   **Explanation:**
>     -   height of left subtree = 1
>     -   height of right subtree = 0
>     -   balance factor = 1 - 0 = 1

### Example 2

> -   **Input:** root = \[2, 1, 4, null, null, 3, 7\], value = 4
> -   **Output:** 0
> -   **Explanation:**
>     -   height of left subtree = 1
>     -   height of right subtree = 1
>     -   balance factor = 1 - 1 = 0

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
    TreeNode *findNode(TreeNode *root, int value) {

        // Base cases: empty tree or node with the given value found
        if (root == nullptr || root->val == value) {
            return root;
        }

        // Recursively search in the left and right subtrees
        TreeNode *leftNode = findNode(root->left, value);
        if (leftNode != nullptr) {
            return leftNode;
        }

        TreeNode *rightNode = findNode(root->right, value);
        return rightNode;
    }

    int findHeight(TreeNode *root) {

        // Empty tree has height 0
        if (root == nullptr) {
            return 0;
        }

        // Recursively calculate the height of the left and right
        // subtrees
        int leftHeight = findHeight(root->left);
        int rightHeight = findHeight(root->right);

        // Return the maximum height among the left and right subtrees
        // plus 1 for the current node
        return max(leftHeight, rightHeight) + 1;
    }

    int balanceOfSubtree(TreeNode *root, int value) {

        // Find the node with the given value
        TreeNode *node = findNode(root, value);
        if (node == nullptr) {
            return 0;
        }

        // Calculate the height of the left and right subtrees
        int leftHeight = findHeight(node->left);
        int rightHeight = findHeight(node->right);

        // Calculate the balance factor
        int balanceFactor = leftHeight - rightHeight;
        return balanceFactor;
    }
};
```

***

# Challenges in implementing complete binary search trees

We know that performance-wise, a complete binary search tree is the most optimal tree structure for any given number of nodes. Let us go ahead and see why we cannot practically use them to implement a balanced binary search tree. 

## Modifications

If we do not have to modify the tree, it will always remain complete and perform best. However, when we try to insert or delete data from the tree, the tree may no longer remain complete, and its performance will degrade.

// Diagram: Insert and delete operations on a complete BST make it non complete

To solve this problem, after each modification, we can apply the two steps below to check its completeness and rebalance it if needed.

### Step 1: Verify the completeness

The verify operation verifies whether the given tree is a complete binary search tree.

// Diagram: Step 1: Verify the completeness

### Step 2: Rebalance the tree

The rebalance operation takes a binary search tree that became unbalanced(non-complete) after an operation and reorganizes it to make it balanced(complete) again. 

// Diagram: Step 2: Rebalance the tree

This way, after every insertion or deletion, we can check if the tree is no longer complete and rebalance it to make it complete again.

## Limitations of rebalancing complete binary search trees

The rebalance operation for a complete binary search tree may look simple. Still, it is very complicated to create a complete tree from a non-complete tree and ensure it follows the binary search property. We might have to move multiple nodes far apart around the tree, and the performance of such an operation will be very bad.

// Diagram: Rebalancing moves around many nodes and is a slow and complex process for complete binary search trees

In the worst case, every insertion and deletion operation with only **O(log(N))** runtime might have a significant **overhead** due to the rebalancing. This defeats using complete binary search trees to implement balanced binary trees. For this reason, complete binary trees are generally **not** used as balanced binary search trees. They perform best, but they cannot be modified without significant overhead.

***

# Understanding height balanced binary trees

Now we know why we cannot use a complete binary tree to implement a balanced binary search tree. Our implementation of a balanced binary tree should have a **weaker** balancing condition for it to be practically useful. We need the tree to always perform well and be **easy** to create, validate, and rebalance. Keeping this in mind, we define a balanced binary tree as the following.

// Diagram: Height Balanced Binary Tree

> A height-balanced binary tree is a tree where, for every node in the tree, the absolute difference between the height of the left and right subtree is at most 1

This definition is less restrictive than the definition of the most optimal binary search tree possible with N nodes (complete tree). It allows the tree to have a height or absolute balance factor that is not the minimum possible for every node. Let us look at a few examples of generic balanced binary search trees.

// Diagram: Some examples of balanced binary trees

## Modifications

Like the complete binary search tree, it may become unbalanced when we insert or delete nodes from a balanced binary tree. However, as we will see later, it is much easier to verify and rebalance it now that we have a weaker balancing condition.

// Diagram: Insert and delete operations on a balanced BST make it unbalanced

To address this issue, following each modification, we can follow the two steps below to check whether the tree is height balanced and rebalance it if it is not.

### Step 1: Verify the balance

The verify operation verifies whether the given tree is a balanced binary search tree. This operation is much simpler than checking whether a binary search tree is complete and can be recursively implemented in **O(logN)** time.

// Diagram: Operation to verify if a tree is a balanced binary search tree

### Step 2: Rebalance the tree

The rebalance operation takes a binary search tree that became unbalanced after an operation and reorganizes it to make it balanced again. This operation is much simpler to implement than a complete binary search tree. Depending on the type of balanced binary search tree, there may be different rebalancing techniques; the most common one is via **rotation**. The rebalance operation on a binary search tree is out of the scope of this course, but for a balanced binary search tree, it can be proved that all rebalance operations will have a worst-case time complexity of **O(logN)**.

// Diagram: Rebalance operation converts an unbalanced binary search tree to a height balanced search tree by doing some rotations

## Complexity analysis

Because the absolute balance factor of every node in a balanced binary tree can be at most 1 in our definition of a balanced binary tree, even the less optimal binary trees (trees that do not have the minimum possible height for the given number of nodes) are considered balanced. However, the tree can be verified and rebalanced efficiently after every modification. In the worst case, the overall time complexity of all operations on such a tree is **O(logN)**.

// Diagram: All operations on a self balancing balanced binary search tree are O(log(N))

> **Best Case**
>
> -   Space Complexity - **O(logN)**
> -   Time Complexity - **O(logN)**
>
> **Worst Case**
>
> -   Space Complexity - **O(logN)**
> -   Time Complexity - **O(logN)**

***

# Height balanced tree

## Problem Statement

Given the **root** of a binary search tree, write a function to check if it is height-balanced. If it is a height-balanced tree, return `true` otherwise, return `false`.

 A height-balanced tree is a tree where the balance factor for every node in the tree is in the range \[-1, 1\] inclusive.

### Example 1

> -   **Input:** root = \[4, 2, 6, 1, null, null, 7\]
> -   **Output:** true
> -   **Explanation:** The given tree is height-balanced as shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, null, 4, 2, 7\]
> -   **Output:** false
> -   **Explanation:** The given tree is not height balanced as shown in the diagram above.

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
    int findHeight(TreeNode *root) {

        // Empty tree has height 0
        if (root == nullptr) {
            return 0;
        }

        // Recursively calculate the height of the left and right
        // subtrees
        int leftHeight = findHeight(root->left);
        int rightHeight = findHeight(root->right);

        // Return the maximum height among the left and right subtrees
        // plus 1 for the current node
        return max(leftHeight, rightHeight) + 1;
    }

    bool heightBalancedTree(TreeNode *root) {

        // Base case: empty tree
        if (root == nullptr) {
            return true;
        }

        int leftHeight = findHeight(root->left);
        int rightHeight = findHeight(root->right);

        if (abs(leftHeight - rightHeight) <= 1) {

            // Check if both left and right subtrees are height-balanced
            return heightBalancedTree(root->left) &&
                   heightBalancedTree(root->right);
        }

        return false;
    }
};
```
