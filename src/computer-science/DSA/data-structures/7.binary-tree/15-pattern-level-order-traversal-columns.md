# Pattern: Level order traversal (Columns)

## Table of Contents

1. [Top view](#top-view)
2. [Bottom view](#bottom-view)
3. [Vertical traversal](#vertical-traversal)
4. [Diagonal traversal](#diagonal-traversal)

***

# Top view

## Problem Statement

Given the **root** of a binary tree, write a function to return a list representing how it would look from left to right when viewed from the top.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7, 9\]
> -   **Output:** \[9, 4, 2, 1, 3, 7\]
> -   **Explanation:** The only nodes visible in the given tree when viewed left to right from the top are shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, 6, null, null, null, 2, null, 9\]
> -   **Output:** \[8, 1, 4, 9\]
> -   **Explanation:** The only nodes visible in the given tree when viewed left to right from the top are shown in the diagram above.

## Solution

```cpp
#include <map>
#include <queue>

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

// Define a struct to store the node and its column index
struct NodeInfo {
    TreeNode *node;
    int column;
};

class Solution {
public:
    vector<int> topView(TreeNode *root) {
        vector<int> result;
        if (root == nullptr) {
            return result;
        }

        // Hash table to store columns and its corresponding nodes
        map<int, int> columns;

        // Use a queue to perform a level-order traversal of the tree
        queue<NodeInfo> queue;

        // Push the root node onto the queue with column index 0
        queue.push(NodeInfo{root, 0});

        // Loop through each level in the tree
        while (!queue.empty()) {
            NodeInfo current = queue.front();
            TreeNode *node = current.node;
            int column = current.column;
            queue.pop();

            // Add the current node if it's the first node in the column
            if (columns.find(column) == columns.end()) {
                columns[column] = node->val;
            }

            // Enqueue the left child with column - 1
            if (node->left) {
                queue.push(NodeInfo{node->left, column - 1});
            }

            // Enqueue the right child with column + 1
            if (node->right) {
                queue.push(NodeInfo{node->right, column + 1});
            }
        }

        // Iterate over the columns in the hash table and add them to the
        // result
        for (auto &column : columns) {
            result.push_back(column.second);
        }

        return result;
    }
};
```

***

# Top view

***

# Bottom view

***

# Bottom view

## Problem Statement

Given the **root** of a binary tree, write a function to return a list representing how it would look from left to right when viewed from the bottom.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7, 9\]
> -   **Output:** \[9, 4, 2, 1, 3, 7\]
> -   **Explanation:** The only nodes visible in the given tree when viewed left to right from the bottom are shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, 6, null, null, null, 2, null, 9\]
> -   **Output:** \[8, 6, 2, 9\]
> -   **Explanation:** The only nodes visible in the given tree when viewed left to right from the bottom are shown in the diagram above.

## Solution

```cpp
#include <map>
#include <queue>

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

// Define a struct to store the node and its column index
struct NodeInfo {
    TreeNode *node;
    int column;
};

class Solution {
public:
    vector<int> bottomView(TreeNode *root) {
        vector<int> result;
        if (root == nullptr) {
            return result;
        }

        // Hash table to store columns and its corresponding nodes
        map<int, int> columns;

        // Use a queue to perform a level-order traversal of the tree
        queue<NodeInfo> queue;

        // Push the root node onto the queue with column index 0
        queue.push(NodeInfo{root, 0});

        // Loop through each level in the tree
        while (!queue.empty()) {
            NodeInfo current = queue.front();
            TreeNode *node = current.node;
            int column = current.column;
            queue.pop();

            // Keep on updating the column value for each node, at the
            // end we will have the bottom view of the tree for that
            // column
            columns[column] = node->val;

            // Enqueue the left child with column - 1
            if (node->left) {
                queue.push(NodeInfo{node->left, column - 1});
            }

            // Enqueue the right child with column + 1
            if (node->right) {
                queue.push(NodeInfo{node->right, column + 1});
            }
        }

        // Iterate over the columns in the hash table and add them to the
        // result
        for (auto &column : columns) {
            result.push_back(column.second);
        }

        return result;
    }
};
```

***

# Vertical traversal

## Problem Statement

Given the **root** of a binary tree, write a function to return a list of lists containing its vertical traversal.

> A vertical traversal of a binary tree traverses the tree from top to bottom while taking steps from left to right, starting from the leftmost node.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** \[\[4\], \[2\], \[1\], \[3\], \[7\]\]
> -   **Explanation:** The vertical traversal of the given tree is shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, 6, null, null, 3, 2\]
> -   **Output:** \[\[8, 3\], \[1, 6\], \[4, 2\]\]
> -   **Explanation:** The vertical traversal of the given tree is shown in the diagram above.

## Solution

```cpp
#include <algorithm>
#include <map>
#include <queue>

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

// Define a struct to store the node and its column index
struct NodeInfo {
    TreeNode *node;
    int column;
};

class Solution {
public:
    vector<vector<int>> verticalTraversal(TreeNode *root) {
        vector<vector<int>> result;
        if (root == nullptr) {
            return result;
        }

        // Hash table to store columns and their corresponding nodes
        map<int, vector<int>> columns;

        // Use a queue to perform a level-order traversal of the tree
        queue<NodeInfo> queue;

        // Push the root node onto the queue with column index 0
        queue.push(NodeInfo{root, 0});

        // Loop through each level in the tree
        while (!queue.empty()) {
            NodeInfo current = queue.front();
            TreeNode *node = current.node;
            int column = current.column;
            queue.pop();

            // Add the current node to its corresponding column in the
            // hash table
            columns[column].push_back(node->val);

            // Enqueue the left child with column - 1
            if (node->left) {
                queue.push(NodeInfo{node->left, column - 1});
            }

            // Enqueue the right child with column + 1
            if (node->right) {
                queue.push(NodeInfo{node->right, column + 1});
            }
        }

        // Iterate over the columns in the hash table and add them to the
        // result
        for (auto &column : columns) {
            result.push_back(column.second);
        }

        return result;
    }
};
```

***

# Diagonal traversal

## Problem Statement

Given the **root** of a binary tree, write a function to return a list of lists containing its diagonal traversal.

> A diagonal traversal of a binary tree traverses the tree from top to bottom along diagonals, starting from the top-rightmost node and moving towards the bottom-left. In this traversal, all nodes lying on the same diagonal are processed together before moving to the next diagonal.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** \[\[1, 3, 7\], \[2\], \[4\]\]
> -   **Explanation:** The diagonal traversal of the given tree is shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, 6, null, null, 3, 2\]
> -   **Output:** \[\[1, 4\], \[8, 6, 2\], \[3\]\]
> -   **Explanation:** The diagonal traversal of the given tree is shown in the diagram above.

## Solution

```cpp
#include <algorithm>
#include <map>
#include <queue>

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

// Define a struct to store the node and its diagonal index
struct NodeInfo {
    TreeNode *node;
    int diagonal;
};

class Solution {
public:
    vector<vector<int>> diagonalTraversal(TreeNode *root) {
        vector<vector<int>> result;
        if (root == nullptr) {
            return result;
        }

        // Hash table to store diagonals and their corresponding nodes
        map<int, vector<int>> diagonals;

        // Use a queue to perform a level-order traversal of the tree
        queue<NodeInfo> queue;

        // Push the root node onto the queue with diagonal index 0
        queue.push(NodeInfo{root, 0});

        // Loop through each level in the tree
        while (!queue.empty()) {
            NodeInfo current = queue.front();
            TreeNode *node = current.node;
            int diagonal = current.diagonal;
            queue.pop();

            // Add the current node to its corresponding diagonal in the
            // hash table
            diagonals[diagonal].push_back(node->val);

            // Left child goes to next diagonal (diagonal + 1)
            if (node->left) {
                queue.push(NodeInfo{node->left, diagonal + 1});
            }

            // Right child stays on same diagonal (diagonal)
            if (node->right) {
                queue.push(NodeInfo{node->right, diagonal});
            }
        }

        // Iterate over the diagonals in the hash table and add them to
        // the result
        for (auto &diagonal : diagonals) {
            result.push_back(diagonal.second);
        }

        return result;
    }
};
```
