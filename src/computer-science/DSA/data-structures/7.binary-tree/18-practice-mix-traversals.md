# Practice: Mix traversals

## Table of Contents

1. [Boundary traversal](#boundary-traversal)

***

# Boundary traversal

## Problem Statement

Given the **root** of a binary tree, write a function to find and return a list containing the boundary of this tree. 

The boundary is defined by the traversal if we begin from the root node and make an anticlockwise circle around the tree.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** \[1, 2, 4, 7, 3\]
> -   **Explanation:** The boundary (anticlockwise) of the given tree is shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\]
> -   **Output:** \[1, 8, 2, 7, 4\]
> -   **Explanation:** The boundary (anticlockwise) of the given tree is shown in the diagram above.

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

    // Helper function to get the left boundary
    void leftBoundary(TreeNode *node, vector<int> &leftBd) {

        // If the current node is null or is a leaf node, return
        if (!node || (!node->left && !node->right)) {
            return;
        }

        // Add the current node's value to the left boundary vector
        leftBd.push_back(node->val);

        // Traverse the left subtree if it exists, otherwise traverse the
        // right subtree
        if (node->left) {
            leftBoundary(node->left, leftBd);
        } else {
            leftBoundary(node->right, leftBd);
        }
    }

    // Helper function to get the right boundary
    void rightBoundary(TreeNode *node, vector<int> &rightBd) {

        // If the current node is null or is a leaf node, return
        if (!node || (!node->left && !node->right)) {
            return;
        }

        // Traverse the right subtree if it exists, otherwise traverse
        // the left subtree
        if (node->right) {
            rightBoundary(node->right, rightBd);
        } else {
            rightBoundary(node->left, rightBd);
        }

        // Add the current node's value to the right boundary vector
        rightBd.push_back(node->val);
    }

    // Helper function to get the leaf nodes
    void leafNodes(TreeNode *node, vector<int> &leaves) {

        // If the current node is null, return
        if (!node) {
            return;
        }

        // If the current node is a leaf node, add its value to the
        // leaves vector
        if (!node->left && !node->right) {
            leaves.push_back(node->val);
            return;
        }

        // Traverse the left and right subtrees
        leafNodes(node->left, leaves);
        leafNodes(node->right, leaves);
    }

    // Define the main function to find the boundary of a binary tree
    vector<int> boundaryTraversal(TreeNode *root) {

        // Create a vector to store the boundary nodes
        vector<int> boundary;

        // If the root is empty, return an empty vector
        if (!root) {
            return boundary;
        }

        // Add the root value to the boundary
        boundary.push_back(root->val);

        // Add the left boundary nodes
        leftBoundary(root->left, boundary);

        // Add the leaf nodes from the left subtree and the right subtree
        leafNodes(root->left, boundary);
        leafNodes(root->right, boundary);

        // Add the right boundary nodes (in reverse order)
        rightBoundary(root->right, boundary);

        return boundary;
    }
};
```
