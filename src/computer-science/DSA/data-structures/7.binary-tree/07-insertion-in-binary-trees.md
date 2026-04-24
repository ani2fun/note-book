# Insertion in binary trees

## Table of Contents

1. [Understanding insertion at root](#understanding-insertion-at-root)
2. [Insert at root](#insert-at-root)
3. [Understanding recursive insertion of a leaf](#understanding-recursive-insertion-of-a-leaf)
4. [Recursively insert a leaf](#recursively-insert-a-leaf-node)
5. [Understanding iterative insertion of a leaf](#understanding-iterative-insertion-of-a-leaf)
6. [Iteratively insert a leaf](#iteratively-insert-a-leaf-node)
7. [Understanding insertion of a child](#understanding-insertion-of-a-child)
8. [Insert a child](#insert-a-child)
9. [Understanding insertion of a parent](#understanding-insertion-of-a-parent)
10. [Insert a parent](#insert-a-parent)

***

# Understanding insertion at root

Insert at root is an operation where we insert a new node with the given value at the root of a given binary tree. The operation is simple as it does not involve any tree traversal and adds links to the existing tree. There are two cases to consider.

## 1\. The tree is empty

If the given tree is empty, we can create a new node with the given value, which becomes the tree itself.

// Diagram: Insert at root in an empty tree

> **Algorithm**
>
> -   **Step 1**: Create a new node with the given data.
> -   **Step 2**: Return the new node, as this is the new \`root\`.

## 2\. The tree is not empty

If the tree is not empty, we create a new node and link the existing tree as its left or right subtree. Deciding whether the old tree should be the left or right child of the newly created node is subjective.

// Diagram: Inserting at root in a non empty binary tree

> **Algorithm**
>
> -   **Step 1**: Create a new node with the given data.
> -   **Step 2**: Set the new node's \`left\`(or \`right\`) pointer to hold the reference of the existing \`root\`.
> -   **Step 3**: Return the new node, as this is the new \`root\`.

## Implementation

Both cases of this operation can be implemented as a simple three-line function.

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
    TreeNode *insertRoot(TreeNode *root, int data) {

        // Create a new node with the given data value
        TreeNode *newRoot = new TreeNode(data);

        // Set the current root as the left child of the new node
        newRoot->left = root;

        // Return the new root
        return newRoot;
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
    public TreeNode insertRoot(TreeNode root, int data) {

        // Create a new node with the given data value
        TreeNode newRoot = new TreeNode(data);

        // Set the current root as the left child of the new node
        newRoot.left = root;

        // Return the new root
        return newRoot;
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
    insertRoot(root: TreeNode | null, data: number): TreeNode | null {

        // Create a new node with the given data value
        const newRoot = new TreeNode(data);

        // Set the current root as the left child of the new node
        newRoot.left = root;

        // Return the new root
        return newRoot;
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
    insertRoot(root, data) {

        // Create a new node with the given data value
        const newRoot = new TreeNode(data);

        // Set the current root as the left child of the new node
        newRoot.left = root;

        // Return the new root
        return newRoot;
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
    def insert_root(
        self, root: Optional[TreeNode], data: int
    ) -> Optional[TreeNode]:

        # Create a new node with the given data value
        new_root = TreeNode(data)

        # Set the current root as the left child of the new node
        new_root.left = root

        # Return the new root
        return new_root
```

## Complexity Analysis

Since we are just creating one extra tree node and doing just setting one pointer in the newly created node, both the runtime and space complexity is constant.

> **Best Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**

***

# Insert at root

## Problem Statement

Fundamental

Given the **root** of a binary tree and a **data** value, write a function to insert a new node with the data value as the root of this binary tree and return the root of the updated tree.

The existing tree should be designated as the left subtree of the new root.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7, 9\], data = 5
> -   **Output:** \[5, 1, null, 2, 3, 4, null, null, 7, 9\]
> -   **Explanation:** The node is inserted as the root, and the existing tree is designated as the left subtree.

### Example 2

> -   **Input:** tree = \[1, 8, 4, null, 6\], data = 10
> -   **Output:** \[10, 1, null, 8, 4, null, 6\]
> -   **Explanation:** The node is inserted as the root, and the existing tree is designated as the left subtree.

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
    TreeNode *insertRoot(TreeNode *root, int data) {

        // Create a new node with the given data value
        TreeNode *newRoot = new TreeNode(data);

        // Set the current root as the left child of the new node
        newRoot->left = root;

        // Return the new root
        return newRoot;
    }
};
```

***

# Understanding recursive insertion of a leaf

A new node can be easily inserted in the binary tree as a leaf node by recursively going down the tree from top to bottom. The insert process can be summarised in three simple steps, which are given below.

> -   **Step 1:** Traverse the tree and find the first node that does **not** have a \`left\` or \`right\` subtree.
> -   **Step 2:** Create a new node with the given data and link it to the node found in step 1.

## Algorithm

To insert a new node as a leaf node, we first need to decide which node in the given tree would be the parent of the newly inserted node. To do this, we have to traverse the tree and identify the first node that does not have either a left child, a right child, or both. This node can act as the parent of our newly inserted node. We can use any traversal algorithms we have learned so far to find this node.

In this example, we will traverse the tree in **one direction**. This will allow us to reach a leaf node or a node with a free left or right spot.

**What traversal algorithm should be used?**

The goal is to insert a new node as a leaf in the tree so we can use **any** tree traversal algorithm. We only need to reach a node that does not have either a left or right child, and then we can insert our new node as its child, making it a leaf node.

// Diagram: Recursive insert a new node with data 9 as the leaf node

> **Algorithm**
>
> -   **Step 1:** Look for a free spot from the \`root\` node.
> -   **Step 2:** If the \`root\` node is \`null\`, create a new node with the given data and return it.
> -   **Step 3:** Else, if the \`root\` node does not have a \`left\` subtree, create and insert the new node as the \`left\` child of the \`root\` and return the \`root\`.
> -   **Step 4:** Else, if the \`root\` node does not have a \`right\` subtree, create and insert the new node as the \`right\` child of the \`root\` and return the \`root\`.
> -   **Step 5:** Else, recursively call **Step 1** with the \`left/right\` subtree.
>
> **Note :** We can choose any direction, \`left\` or \`right\`, but it should be consistent throughout the traversal

## Implementation

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
    TreeNode *recursivelyInsertALeaf(TreeNode *root, int value) {

        // If the tree is empty, create a new node and return it
        // as the root
        if (!root) {
            return new TreeNode(value);
        }

        // Recursively insert into the left subtree
        if (!root->left) {
            root->left = new TreeNode(value);
        }

        // Recursively insert into the right subtree
        else if (!root->right) {
            root->right = new TreeNode(value);
        }

        // If both left and right subtrees are not nullptr
        // recursively try inserting into the left subtree
        else {
            recursivelyInsertALeaf(root->left, value);
        }

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
    public TreeNode recursivelyInsertALeaf(TreeNode root, int value) {

        // If the tree is empty, create a new node and return it
        // as the root
        if (root == null) {
            return new TreeNode(value);
        }

        // Recursively insert into the left subtree
        if (root.left == null) {
            root.left = new TreeNode(value);
        }

        // Recursively insert into the right subtree
        else if (root.right == null) {
            root.right = new TreeNode(value);
        }

        // If both left and right subtrees are not null,
        // recursively try inserting into the left subtree
        else {
            recursivelyInsertALeaf(root.left, value);
        }

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
    recursivelyInsertALeaf(
        root: TreeNode | null,
        value: number
    ): TreeNode {

        // If the tree is empty, create a new node and return it
        // as the root
        if (!root) {
            return new TreeNode(value);
        }

        // Recursively insert into the left subtree
        if (!root.left) {
            root.left = new TreeNode(value);
        }

        // Recursively insert into the right subtree
        else if (!root.right) {
            root.right = new TreeNode(value);
        }

        // If both left and right subtrees are not null,
        // recursively try inserting into the left subtree
        else {
            this.recursivelyInsertALeaf(root.left, value);
        }

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
    recursivelyInsertALeaf(root, value) {

        // If the tree is empty, create a new node and return it
        // as the root
        if (!root) {
            return new TreeNode(value);
        }

        // Recursively insert into the left subtree
        if (!root.left) {
            root.left = new TreeNode(value);
        }

        // Recursively insert into the right subtree
        else if (!root.right) {
            root.right = new TreeNode(value);
        }

        // If both left and right subtrees are not null,
        // recursively try inserting into the left subtree
        else {
            this.recursivelyInsertALeaf(root.left, value);
        }

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
    def recursively_insert_a_leaf(
        self, root: Optional[TreeNode], value: int
    ) -> Optional[TreeNode]:

        # If the tree is empty, create a new node and return it
        # as the root
        if root is None:
            return TreeNode(value)

        # Recursively insert into the left subtree
        if root.left is None:
            root.left = TreeNode(value)

        # Recursively insert into the right subtree
        elif root.right is None:
            root.right = TreeNode(value)

        # If both left and right subtrees are not None,
        # recursively try inserting into the left subtree
        else:
            self.recursively_insert_a_leaf(root.left, value)

        return root
```

**Why only go in one direction when a node has both left and right subtrees?**

Let's assume we are at a node X with both left and right subtrees. In that case, we will hit the final `else` statement and go down in one direction (left in this case). We are guaranteed to find either a leaf node or a node without a left or right node. This is the reason we do not traverse in the other direction when we recurse back to node X.

## Complexity Analysis

The insert leaf algorithm traverses the tree until it finds a suitable parent node, so the runtime and space complexity will depend on the traversal algorithm used and how soon we find the parent node. We don't use any extra space apart from the call stack, so the space used is **O(h),** where h is the tree's height. However, the worst case occurs when the tree is skewed, resulting in a tree with a height of N.

However, the runtime complexity depends on the tree's shape and the direction we choose to go if a node has both the left and right subtree. The recursive algorithm will have a linear runtime complexity, such as the trees and directions below.

// Diagram: Worst Case Runtime Complexity

> **Best Case** - The root node can act as a parent node
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case** - Unbalanced tree skewed in the direction of traversal
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Recursively insert a leaf node

## Problem Statement

Fundamental

Given the **root** of a binary tree and a **data** value, write a function to insert a new node at the first available leaf position in the tree with the specified data value and return the updated root of the tree. The first available position refers to the first (empty child) encountered when traversing the tree from left to right.

You must do this **recursively**.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7, 9\], data = 5
> -   **Output:** \[1, 2, 3, 4, 5, null, 7, 9\]
> -   **Explanation:** A new leaf node with value 5 is inserted at the first available leaf position in the tree.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, 6\], data = 10
> -   **Output:** \[1, 8, 4, 10, 6\]
> -   **Explanation:** A new leaf node with value 10 is inserted at the first available leaf position in the tree.

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
    TreeNode *recursivelyInsertALeaf(TreeNode *root, int data) {

        // If the tree is empty, create a new node and return it
        // as the root
        if (!root) {
            return new TreeNode(data);
        }

        // Recursively insert into the left subtree
        if (!root->left) {
            root->left = new TreeNode(data);
        }

        // Recursively insert into the right subtree
        else if (!root->right) {
            root->right = new TreeNode(data);
        }

        // If both left and right subtrees are not nullptr
        // recursively try inserting into the left subtree
        else {
            recursivelyInsertALeaf(root->left, data);
        }

        return root;
    }
};
```

***

# Understanding iterative insertion of a leaf

As we learned earlier, the recursive traversal algorithm performs poorly for some binary tree structures because of the choice of moving only in one direction. There is another way to insert a leaf node that will perform better in those cases. We can use the iterative level order traversal to insert a leaf node.

## Algorithm

The algorithm is still the same. We move in the tree using the **level order traversal** algorithm. This way, we only move to the next level once we have checked all the nodes for the current level.

// Diagram: Iterative insert a new node with value 9 as the leaf node

> **Algorithm**
>
> -   **Step 1:** Add the \`root\` node to the traversal queue.
> -   **Step 2:** While the queue is not empty, do the following:
>     -   **Step 2.1:** Pop the first node from the queue.
>     -   **Step 2.2:** If the \`left\` child of the popped node is \`null\`, insert the new node as its left child and return the \`root\` node.
>     -   **Step 2.3:** Else, if the \`left\` child of the popped node is not \`null\`, add it to the queue.
>     -   **Step 2.4:** If the \`right\` child of the popped node is \`null\`, insert the new node as its right child and return the \`root\` node.
>     -   **Step 2.5:** Else, if the \`right\` child of the popped node is not \`null\`, add it to the queue.
> -   **Step 3:** Return the \`root\` node.

## Implementation

We can piggyback on the level order traversal implementation we learned earlier to search for the parent node and perform the insertion.

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
    TreeNode *iterativelyInsertALeaf(TreeNode *root, int data) {

        // If the tree is empty, create a new node and return it
        if (!root) {
            return new TreeNode(data);
        }

        // Use a queue to perform level-order traversal
        queue<TreeNode *> queue;
        queue.push(root);

        while (!queue.empty()) {
            TreeNode *node = queue.front();
            queue.pop();

            // Check if the left child is null, if so, insert the new
            // node here
            if (!node->left) {
                node->left = new TreeNode(data);
                return root;
            } else {
                queue.push(node->left);
            }

            // Check if the right child is null, if so, insert the new
            // node here
            if (!node->right) {
                node->right = new TreeNode(data);
                return root;
            } else {
                queue.push(node->right);
            }

        return root;
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

class Solution {
    public TreeNode iterativelyInsertALeaf(TreeNode root, int data) {

        // If the tree is empty, create a new node and return it
        if (root == null) {
            return new TreeNode(data);
        }

        // Use a queue to perform level-order traversal
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);

        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();

            // Check if the left child is null, if so, insert the new
            // node here
            if (node.left == null) {
                node.left = new TreeNode(data);
                return root;
            } else {
                queue.add(node.left);
            }

            // Check if the right child is null, if so, insert the new
            // node here
            if (node.right == null) {
                node.right = new TreeNode(data);
                return root;
            } else {
                queue.add(node.right);
            }

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
    iterativelyInsertALeaf(
        root: TreeNode | null,
        data: number
    ): TreeNode {

        // If the tree is empty, create a new node and return it
        if (!root) {
            return new TreeNode(data);
        }

        // Use a queue to perform level-order traversal
        let queue: TreeNode[] = [root];

        while (queue.length > 0) {
            let node = queue.shift()!;

            // Check if the left child is null, if so, insert the new
            // node here
            if (!node.left) {
                node.left = new TreeNode(data);
                return root;
            } else {
                queue.push(node.left);
            }

            // Check if the right child is null, if so, insert the new
            // node here
            if (!node.right) {
                node.right = new TreeNode(data);
                return root;
            } else {
                queue.push(node.right);
            }

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
    iterativelyInsertALeaf(root, data) {

        // If the tree is empty, create a new node and return it
        if (!root) {
            return new TreeNode(data);
        }

        // Use a queue to perform level-order traversal
        let queue = [root];

        while (queue.length > 0) {
            let node = queue.shift();

            // Check if the left child is null, if so, insert the new
            // node here
            if (!node.left) {
                node.left = new TreeNode(data);
                return root;
            } else {
                queue.push(node.left);
            }

            // Check if the right child is null, if so, insert the new
            // node here
            if (!node.right) {
                node.right = new TreeNode(data);
                return root;
            } else {
                queue.push(node.right);
            }

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

from typing import Optional
from queue import Queue

class Solution:
    def iteratively_insert_a_leaf(
        self, root: Optional[TreeNode], data: int
    ) -> Optional[TreeNode]:

        # If the tree is empty, create a new node and return it
        if root is None:
            return TreeNode(data)

        # Use a queue to perform level-order traversal
        queue = Queue()
        queue.put(root)

        while not queue.empty():
            node = queue.get()

            # Check if the left child is null, if so, insert the new node
            # here
            if node.left is None:
                node.left = TreeNode(data)
                return root
            else:
                queue.put(node.left)

            # Check if the right child is null, if so, insert the new
            # node here
            if node.right is None:
                node.right = TreeNode(data)
                return root
            else:
                queue.put(node.right)

        return root
```

## Complexity Analysis

The iterative level order traversal algorithm uses a queue, so the extra space is linear. Even though this implementation performs better in cases where the recursive algorithm performed worse, it performs worse where it performed best. This is because the entire tree would need to be traversed for a perfect binary tree to find the spot where this new node will be inserted.

The space complexity is directly proportional to the maximum number of nodes in a level, which is **2^H**.

> **Best Case** - The root node can act as a parent node
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case** - Perfect Binary Tree
>
> -   Space Complexity - **O(2^H)**
> -   Time Complexity - **O(N)**

***

# Iteratively insert a leaf node

## Problem Statement

Fundamental

Given the **root** of a binary tree and a **data** value, write a function to insert a new node at the first available leaf position in the tree with the specified data value and return the updated root of the tree. The first available position refers to the first  (empty child) encountered when traversing the tree from left to right.

You must do this **iteratively**.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7, 9\], data = 5
> -   **Output:** \[1, 2, 3, 4, 5, null, 7, 9\]
> -   **Explanation:** A new leaf node with value 5 is inserted in the tree's first available leaf position.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, 6\], data = 10
> -   **Output:** \[1, 8, 4, 10, 6\]
> -   **Explanation:** A new leaf node with value 10 is inserted in the tree's first available leaf position.

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
    TreeNode *iterativelyInsertALeaf(TreeNode *root, int data) {

        // If the tree is empty, create a new node and return it
        if (!root) {
            return new TreeNode(data);
        }

        // Use a queue to perform level-order traversal
        queue<TreeNode *> queue;
        queue.push(root);

        while (!queue.empty()) {
            TreeNode *node = queue.front();
            queue.pop();

            // Check if the left child is null, if so, insert the new
            // node here
            if (!node->left) {
                node->left = new TreeNode(data);
                return root;
            } else {
                queue.push(node->left);
            }

            // Check if the right child is null, if so, insert the new
            // node here
            if (!node->right) {
                node->right = new TreeNode(data);
                return root;
            } else {
                queue.push(node->right);
            }
        }

        return root;
    }
};
```

***

# Understanding insertion of a child

Inserting a child is an operation in which we insert a new node with the given data as the child of a node with the given value in a binary tree. The operation is not as straightforward as inserting at the root and involves two major steps.

> -   **Step 1**: Search for the node with the given value.
> -   **Step 2**: Create and insert the new node.

## Step 1: Search for the node with the given value

The first step in inserting a new node as the child of a node with the given value in a binary tree is to find the node, after which the newly created node will be inserted. We can traverse the binary tree to find this node using any traversal operations we have learned.

// Diagram: Step 1: Search for the node with the given value

In case the node with the given value is not found, the operation ends here and no new data is inserted.

> **Algorithm**
>
> -   **Step 1:** Check if the \`current\` node is the node with the given value.
> -   **Step 2:** Search the \`left\` subtree of the \`current\` node by recursively performing a preorder traversal.
> -   **Step 3:** Search the \`right\` subtree of the \`current\` node by recursively performing a preorder traversal.

## Step 2: Create and insert the new node

Once we find the node with the given value, the next step is to create a new node and insert it in the tree as the child node of the node we just found. We create a new node with the given data and add it as the left or right child of the node we found, ensuring that we relink the old child of the node. Deciding if the newly created node should be the left or right child is subjective.

// Diagram: Step 2: Create and insert the new node

> **Algorithm**
>
> -   **Step 1:** Create a new node with the given data.
> -   **Step 2:** Set the \`left\` pointer of the new node to hold the node's reference stored in the \`left\` pointer of the node with the given value.
> -   **Step 3:** Set the \`left\` pointer of the node with the given value to hold the reference of the new node.

## Algorithm

Combining the above two steps, we can create the algorithm to insert data as the child of a node with the given value in a binary search tree.

> **Algorithm**
>
> -   **Step 1:** If the \`current\` node is the node with the given value, do the following:
>     -   **Step 1.1:** Create a new node with the given data.
>     -   **Step 1.2:** Set the \`left\` pointer of the new node to hold the node's reference stored in the \`left\` pointer of the node with the given value.
>     -   **Step 1.3:** Set the \`left\` pointer of the node with the given value to hold the reference of the new node.
>     -   **Step 1.4:** Return the \`current\` node.
> -   **Step 2:** Go to \`Step 1\` with the \`left\` subtree.
> -   **Step 3:** Go to \`Step 1\` with the \`right\` subtree.
> -   **Step 4:** Return the \`current\` node after both the left and right subtrees are traversed.

## Implementation

The algorithm above can be implemented using any traversal algorithm. In the implementation below, we use **preorder traversal** to search for the node and insert a new node as its **left** child.

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
    TreeNode *insertChild(TreeNode *root, int parent, int data) {

        // If the root is null, there's nothing to do, return null
        if (!root) {
            return root;
        }

        // Search for the parent node in the tree
        if (root->val == parent) {

            // If the parent is found, insert the new node as the left
            // child
            TreeNode *newNode = new TreeNode(data);

            // Attach the existing left child to the new node
            newNode->left = root->left;

            // Set the new node as the left child of the parent
            root->left = newNode;

            // Return the root (no change to the root itself)
            return root;
        }

        // Recurse for the left and right subtrees
        root->left = insertChild(root->left, parent, data);
        root->right = insertChild(root->right, parent, data);

        // Return the root of the tree
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
    public TreeNode insertChild(TreeNode root, int parent, int data) {

        // If the root is null, there's nothing to do, return null
        if (root == null) {
            return root;
        }

        // Search for the parent node in the tree
        if (root.val == parent) {

            // If the parent is found, insert the new node as the left
            // child
            TreeNode newNode = new TreeNode(data);

            // Attach the existing left child to the new node
            newNode.left = root.left;

            // Set the new node as the left child of the parent
            root.left = newNode;

            // Return the root (no change to the root itself)
            return root;
        }

        // Recurse for the left and right subtrees
        root.left = insertChild(root.left, parent, data);
        root.right = insertChild(root.right, parent, data);

        // Return the root of the tree
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
    insertChild(
        root: TreeNode | null,
        parent: number,
        data: number
    ): TreeNode | null {

        // If the root is null, there's nothing to do, return null
        if (!root) {
            return root;
        }

        // Search for the parent node in the tree
        if (root.val === parent) {

            // If the parent is found, insert the new node as the left
            // child
            const newNode = new TreeNode(data);

            // Attach the existing left child to the new node
            newNode.left = root.left;

            // Set the new node as the left child of the parent
            root.left = newNode;

            // Return the root (no change to the root itself)
            return root;
        }

        // Recurse for the left and right subtrees
        root.left = this.insertChild(root.left, parent, data);
        root.right = this.insertChild(root.right, parent, data);

        // Return the root of the tree
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
    insertChild(root, parent, data) {

        // If the root is null, there's nothing to do, return null
        if (!root) {
            return root;
        }

        // Search for the parent node in the tree
        if (root.val === parent) {

            // If the parent is found, insert the new node as the left
            // child
            const newNode = new TreeNode(data);

            // Attach the existing left child to the new node
            newNode.left = root.left;

            // Set the new node as the left child of the parent
            root.left = newNode;

            // Return the root (no change to the root itself)
            return root;
        }

        // Recurse for the left and right subtrees
        root.left = this.insertChild(root.left, parent, data);
        root.right = this.insertChild(root.right, parent, data);

        // Return the root of the tree
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
    def insert_child(
        self, root: Optional[TreeNode], parent: int, data: int
    ) -> Optional[TreeNode]:

        # If the root is null, there's nothing to do, return null
        if not root:
            return root

        # Search for the parent node in the tree
        if root.val == parent:

            # If the parent is found, insert the new node as the left
            # child
            new_node = TreeNode(data)

            # Attach the existing left child to the new node
            new_node.left = root.left

            # Set the new node as the left child of the parent
            root.left = new_node

            # Return the root (no change to the root itself)
            return root

        # Recurse for the left and right subtrees
        root.left = self.insert_child(root.left, parent, data)
        root.right = self.insert_child(root.right, parent, data)

        # Return the root of the tree
        return root
```

## Complexity Analysis

The above algorithm traverses the binary tree to search for a value, so the runtime complexity depends on the traversal algorithm used. In the worst case, however, the entire tree might have to be traversed, so the runtime complexity is linear. We don't use any extra space apart from the call stack, so the space used is **O(h),** where h is the tree's height. However, the worst case occurs when the tree is skewed, and the parent node is not found. This would result in traversing a tree with a height of N.

> **Best Case** - Insert a child of the root node
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case** - Node with the given value is not found, and the tree is skewed.
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Insert a child

## Problem Statement

Fundamental

Given the **root** of a binary tree and two integer values, **parent** and **data**, write a function to insert a new node with the value data as the left child of the node with the value parent. The function should return the updated root of the tree. If no node with the value parent exists in the tree, return the original tree without any insertion.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7, 9\], parent = 3, data = 5
> -   **Output:** \[1, 2, 3, 4, null, 5, 7, 9\]
> -   **Explanation:** The node is inserted as the left child of the node with the given value, as shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, 6\], parent = 10, data = 20
> -   **Output:** \[1, 8, 4, null, 6\]
> -   **Explanation:** There is no node in the tree with the value 10.

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
    TreeNode *insertChild(TreeNode *root, int parent, int data) {

        // If the root is null, there's nothing to do, return null
        if (!root) {
            return root;
        }

        // Search for the parent node in the tree
        if (root->val == parent) {

            // If the parent is found, insert the new node as the left
            // child
            TreeNode *newNode = new TreeNode(data);

            // Attach the existing left child to the new node
            newNode->left = root->left;

            // Set the new node as the left child of the parent
            root->left = newNode;

            // Return the root (no change to the root itself)
            return root;
        }

        // Recurse for the left and right subtrees
        root->left = insertChild(root->left, parent, data);
        root->right = insertChild(root->right, parent, data);

        // Return the root of the tree
        return root;
    }
};
```

***

# Understanding insertion of a parent

Inserting a parent is an operation where we have to insert a new node with the given data as the parent of a node with the given value in a binary tree. Inserting a node as a parent is more complex than inserting it as a child. This is because, unlike when inserting the node as a child, in this case, we have first to search for the parent of the node with the given value to get the insertion position. This is not straightforward, and we will have to consider two cases.

## 1\. Insert a parent of the root node

In this case, since we have to insert a node as the parent of the root node, we are essentially changing the tree's root node. Also, since the root node has no parent, we cannot use our generic algorithm to search for the parent of a node with the given value, so we will have to deal with this edge case separately. 

// Diagram: Insert node as the parent of root node

> **Algorithm**
>
> -   **Step 1**: Create a new node with the given data.
> -   **Step 2**: Set the new node's \`left\`(or \`right\`) pointer to hold the reference of the existing \`root\`.
> -   **Step 3**: Return the new node, as this is the new \`root\`.

## 2\. Insert a parent of a non root node

This is the generic case of inserting a parent. Inserting a node as a parent of a node with the given value in a binary tree involves two major steps.

> **Algorithm**
>
> -   **Step 1**: Search the parent of the node with the given value.
> -   **Step 2**: Create and insert the new node.

### Step 1: Search the parent of the node with the given value

The first step is to find the node, **after** which the newly created node will be inserted. This node would be the **node's parent,** whose valueis given. So, instead of searching for the node with the given value, **we search for a node whose left or right child has the given value**. We can traverse the binary tree to find this node using any traversal operations we have learned so far.

// Diagram: The parent of the node with the given value is the node after which the insertion has to be done

We can piggyback on any of the traversal algorithms we have learned and modify them to look for children's values at every step. This way, we can get the node's address, after which we need to do the insertion.

// Diagram: Step 1: Search the parent of the node with the given value

> **Algorithm**
>
> -   **Step 1:** Check if the \`current\` node's \`left\` or \`right\` child is the node with the given value.
> -   **Step 2:** Search the \`left\` subtree of the \`current\` node by recursively performing a preorder traversal.
> -   **Step 3:** Search the \`right\` subtree of the \`current\` node by recursively performing a preorder traversal.

### Step 2: Create and insert the new node

Once we find the node **after** which we have to do the insertion (let's say X), the next step is to create a new node and insert it in the tree as the child node of X. However, we need to make sure that we add it as the correct (left or right) child of X to ensure that the newly inserted node is also the parent of the node whose value we were originally given. If the original node is the left child of its parent, we insert the newly created node as the left child. Otherwise, it is the right child. Also, we need to reconnect any broken links to ensure the tree is not split in two.

// Diagram: Step 2: Create and insert the new node

> **Algorithm**
>
> -   **Step 1:** If the \`left\` node of the \`current\` node is the node with the given value, do the following:
>     -   **Step 1.1:** Create a new node with the given data.
>     -   **Step 1.2:** Set the \`left\` pointer of the new node to hold the node's reference stored in the \`left\` pointer of the node with the given value.
>     -   **Step 1.3:** Set the \`left\` pointer of the node with the given value to hold the reference of the new node.
> -   **Step 2:** Else, if the \`right\` node of the \`current\` node is the node with the given value, do the following:
>     -   **Step 2.1:** Create a new node with the given data.
>     -   **Step 2.2:** Set the \`right\` pointer of the new node to hold the node's reference stored in the \`right\` pointer of the node with the given value. This will establish the correct reference for the new node.
>     -   **Step 2.3:** Set the \`right\` pointer of the node with the given value to hold the reference of the new node.

## Implementation

We need to implement both the cases we examined earlier.The algorithm above can be implemented using any traversal algorithm. In the implementation below, we use**preorder traversal**to search for the node and insert a new node as its parent.

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
    TreeNode *insertParent(TreeNode *root, int child, int data) {

        // If root is null, return null (base case)
        if (!root) {
            return nullptr;
        }

        // If root itself is the child, new node becomes the root
        if (root->val == child) {
            TreeNode *newNode = new TreeNode(data);
            newNode->left = root;
            return newNode;
        }

        // Check if the left child matches the child
        if (root->left && root->left->val == child) {
            TreeNode *newNode = new TreeNode(data);

            // Set existing left child as new node's left child
            newNode->left = root->left;

            // Update parent's left child to new node
            root->left = newNode;
            return root;
        }

        // Check if the right child matches the child
        if (root->right && root->right->val == child) {
            TreeNode *newNode = new TreeNode(data);

            // Set existing right child as new node's right child
            newNode->right = root->right;

            // Update parent's right child to new node
            root->right = newNode;
            return root;
        }

        // Recurse for the left and right subtrees
        root->left = insertParent(root->left, child, data);
        root->right = insertParent(root->right, child, data);

        // Return the root of the tree
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
    public TreeNode insertParent(TreeNode root, int child, int data) {

        // If root is null, return null (base case)
        if (root == null) {
            return null;
        }

        // If root itself is the child, new node becomes the root
        if (root.val == child) {
            TreeNode newNode = new TreeNode(data);
            newNode.left = root;
            return newNode;
        }

        // Check if the left child matches the child
        if (root.left != null && root.left.val == child) {
            TreeNode newNode = new TreeNode(data);

            // Set existing left child as new node's left child
            newNode.left = root.left;

            // Update parent's left child to new node
            root.left = newNode;
            return root;
        }

        // Check if the right child matches the child
        if (root.right != null && root.right.val == child) {
            TreeNode newNode = new TreeNode(data);

            // Set existing right child as new node's right child
            newNode.right = root.right;

            // Update parent's right child to new node
            root.right = newNode;
            return root;
        }

        // Recurse for the left and right subtrees
        root.left = insertParent(root.left, child, data);
        root.right = insertParent(root.right, child, data);

        // Return the root of the tree
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
    insertParent(
        root: TreeNode | null,
        child: number,
        data: number
    ): TreeNode | null {

        // If root is null, return null (base case)
        if (!root) {
            return null;
        }

        // If root itself is the child, new node becomes the root
        if (root.val === child) {
            const newNode = new TreeNode(data);
            newNode.left = root;
            return newNode;
        }

        // Check if the left child matches the child
        if (root.left && root.left.val === child) {
            const newNode = new TreeNode(data);

            // Set existing left child as new node's left child
            newNode.left = root.left;

            // Update parent's left child to new node
            root.left = newNode;
            return root;
        }

        // Check if the right child matches the child
        if (root.right && root.right.val === child) {
            const newNode = new TreeNode(data);

            // Set existing right child as new node's right child
            newNode.right = root.right;

            // Update parent's right child to new node
            root.right = newNode;
            return root;
        }

        // Recurse for the left and right subtrees
        root.left = this.insertParent(root.left, child, data);
        root.right = this.insertParent(root.right, child, data);

        // Return the root of the tree
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
    insertParent(root, child, data) {

        // If root is null, return null (base case)
        if (!root) {
            return null;
        }

        // If root itself is the child, new node becomes the root
        if (root.val === child) {
            const newNode = new TreeNode(data);
            newNode.left = root;
            return newNode;
        }

        // Check if the left child matches the child
        if (root.left && root.left.val === child) {
            const newNode = new TreeNode(data);

            // Set existing left child as new node's left child
            newNode.left = root.left;

            // Update parent's left child to new node
            root.left = newNode;
            return root;
        }

        // Check if the right child matches the child
        if (root.right && root.right.val === child) {
            const newNode = new TreeNode(data);

            // Set existing right child as new node's right child
            newNode.right = root.right;

            // Update parent's right child to new node
            root.right = newNode;
            return root;
        }

        // Recurse for the left and right subtrees
        root.left = this.insertParent(root.left, child, data);
        root.right = this.insertParent(root.right, child, data);

        // Return the root of the tree
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
    def insert_parent(
        self, root: Optional[TreeNode], child: int, data: int
    ) -> Optional[TreeNode]:

        # If root is null, return null (base case)
        if root is None:
            return None

        # If root itself is the child, new node becomes the root
        if root.val == child:
            new_node = TreeNode(data)
            new_node.left = root
            return new_node

        # Check if the left child matches the child
        if root.left and root.left.val == child:
            new_node = TreeNode(data)

            # Set existing left child as new node's left child
            new_node.left = root.left

            # Update parent's left child to new node
            root.left = new_node
            return root

        # Check if the right child matches the child
        if root.right and root.right.val == child:
            new_node = TreeNode(data)

            # Set existing right child as new node's right child
            new_node.right = root.right

            # Update parent's right child to new node
            root.right = new_node
            return root

        # Recurse for the left and right subtrees
        root.left = self.insert_parent(root.left, child, data)
        root.right = self.insert_parent(root.right, child, data)

        # Return the root of the tree
        return root
```

## Complexity Analysis

The above algorithm traverses the binary tree to search for a value, so the runtime complexity depends on the traversal algorithm used. In the worst case, however, the entire tree might have to be traversed, so the runtime complexity is linear. We don't use any extra space apart from the call stack, so the space used is **O(h),** where h is the tree's height. However, the worst case occurs when the tree is skewed, and the child node is not found. This would result in traversing a tree with a height of N.

> **Best Case** - Insert a parent of the root node
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case** - Node with the given value is not found, and the tree is skewed
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Insert a Parent

## Problem Statement

Fundamental

Given the **root** of a binary tree and two integer values, **child** and **data**, write a function to insert a new node with the value data as the parent of the node with the value child. The function should return the updated root of the tree. If no node with the value child exists in the tree, return the original tree without any insertion.

The child should become the left child of the new parent if it was the left child of the old parent and the right child if it was the right child of the old parent.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7, 9\], child = 7, data = 5
> -   **Output:** \[1, 2, 3, 4, null, null, 5, 9, null, null, 7\]
> -   **Explanation:** The node is inserted as the new parent of the child, with the child becoming the right child, as it was the right child of the old parent.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, 6\], child = 10, data = 20
> -   **Output:** \[1, 8, 4, null, 6\]
> -   **Explanation:** There is no node in the tree with the value 10.

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
    TreeNode *insertParent(TreeNode *root, int child, int data) {

        // If root is null, return null (base case)
        if (!root) {
            return nullptr;
        }

        // If root itself is the child, new node becomes the root
        if (root->val == child) {
            TreeNode *newNode = new TreeNode(data);
            newNode->left = root;
            return newNode;
        }

        // Check if the left child matches the child
        if (root->left && root->left->val == child) {
            TreeNode *newNode = new TreeNode(data);

            // Set existing left child as new node's left child
            newNode->left = root->left;

            // Update parent's left child to new node
            root->left = newNode;
            return root;
        }

        // Check if the right child matches the child
        if (root->right && root->right->val == child) {
            TreeNode *newNode = new TreeNode(data);

            // Set existing right child as new node's right child
            newNode->right = root->right;

            // Update parent's right child to new node
            root->right = newNode;
            return root;
        }

        // Recurse for the left and right subtrees
        root->left = insertParent(root->left, child, data);
        root->right = insertParent(root->right, child, data);

        // Return the root of the tree
        return root;
    }
};
```
