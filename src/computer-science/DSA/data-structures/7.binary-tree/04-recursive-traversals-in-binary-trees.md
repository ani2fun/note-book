# Recursive traversals in binary trees

## Table of Contents

1. [Understanding the problem](#understanding-the-problem)
2. [Understanding recursive preorder traversal](#understanding-recursive-preorder-traversal)
3. [Implement recursive preorder traversal](#understanding-recursive-preorder-traversal)
4. [Understanding recursive inorder traversal](#understanding-recursive-inorder-traversal)
5. [Implement recursive inorder traversal](#understanding-recursive-inorder-traversal)
6. [Understanding recursive postorder traversal](#understanding-recursive-postorder-traversal)
7. [Implement recursive postorder traversal](#understanding-recursive-postorder-traversal)

***

# Understanding the problem

Traversal for linear data structures is straightforward, as we only have to move in one dimension (either forward or backward). However, A binary tree is a non-linear data structure spread out in two dimensions, so we need to move in both dimensions. This is much more complex than just moving forward or backward.

// Diagram: Two dimensions to move in trees

Because we have two dimensions to worry about in trees, there can be many different ways to traverse a tree.

Any sequence of moving forward, backward, up, and down that eventually visits each node in the tree can be counted as a traversal algorithm. 

However, not all of these algorithms might be easy to implement. Recursion and backtracking are useful when traversing a tree as they give the power to move back and forth based on certain conditions. This is why traversing the entire tree using recursive traversal algorithms is quite easy. In this course, we will learn about a few standard recursive traversal algorithms that follow a set pattern, starting from the root node and traversing the entire tree.

***

# Understanding recursive preorder traversal

Preorder traversal is a fundamental technique for exploring the nodes of a binary tree. In this method, each node is processed in a specific sequence: first, the root node is visited, followed by the left subtree, and then the right subtree.

**In what scenarios is preorder traversal useful?**

Preorder traversal is particularly useful in scenarios where the root node's information must be accessed before inspecting any child node, such as in prefix notation expressions or tree serializations.

## Algorithm

Preorder traversal of a binary tree is a three-step process. First, we visit the node, followed by the left and right subtree. Let's look at an example to understand it better.

// Diagram: Preorder Traversal

 A simple recursive equation can summarise the traversal process.

// Diagram: Recursive equation for preorder traversal

> **Algorithm**
>
> -   **Step 1:** Visit the node.
> -   **Step 2:** Recursively traverse the node's \`left\` subtree.
> -   **Step 3:** Recursively traverse the node's \`right\` subtree.

## Implementation

Preorder traversal has a very simple recursive implementation that follows the same order as described above. We can implement it in a simple 3-line recursive function. 

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
    void preorder(TreeNode *root, vector<int> &result) {

        // Base case: If the current node is nullptr (empty), return.
        if (root == nullptr) {
            return;
        }

        // Step 1: Visit the current node and store its value in result
        result.push_back(root->val);

        // Step 2: Recursively traverse the left subtree
        preorder(root->left, result);

        // Step 3: Recursively traverse the right subtree
        preorder(root->right, result);
    }

// Diagram: vector<int> recursivePreorderTraversal(TreeNode root) {

        // Create an empty vector to store the preorder traversal result.
        vector<int> result;

        // Start the recursive preorder traversal from the 'root' node.
        preorder(root, result);

        // Return the final result containing the preorder traversal of
        // the binary tree.
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

class Solution {
    public void preorder(TreeNode root, List<Integer> result) {

        // Base case: If the current node is null (empty), return.
        if (root == null) {
            return;
        }

        // Step 1: Visit the current node and store its value in the
        // 'result' list
        result.add(root.val);

        // Step 2: Recursively traverse the left subtree
        preorder(root.left, result);

        // Step 3: Recursively traverse the right subtree
        preorder(root.right, result);
    }

// Diagram: public List<Integer> recursivePreorderTraversal(TreeNode root) {

        // Create an empty list to store the preorder traversal result.
        List<Integer> result = new ArrayList<>();

        // Start the recursive preorder traversal from the 'root' node.
        preorder(root, result);

        // Return the final result containing the preorder traversal of
        // the binary tree.
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
    preorder(root: TreeNode | null, result: number[]): void {

        // Base case: If the current node is null (empty), return.
        if (root === null) {
            return;
        }

        // Step 1: Visit the current node and store its value in the
        // 'result' array
        result.push(root.val);

        // Step 2: Recursively traverse the left subtree
        this.preorder(root.left, result);

        // Step 3: Recursively traverse the right subtree
        this.preorder(root.right, result);
    }

// Diagram: recursivePreorderTraversal(root: TreeNode | null): number[] {

        // Create an empty array to store the preorder traversal result.
        const result: number[] = [];

        // Start the recursive preorder traversal from the 'root' node.
        this.preorder(root, result);

        // Return the final result containing the preorder traversal of
        // the binary tree.
        return result;
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
    preorder(root, result) {

        // Base case: If the current node is null (empty), return.
        if (root === null) {
            return;
        }

        // Step 1: Visit the current node and store its value in the
        // 'result' array
        result.push(root.val);

        // Step 2: Recursively traverse the left subtree
        this.preorder(root.left, result);

        // Step 3: Recursively traverse the right subtree
        this.preorder(root.right, result);
    }
    recursivePreorderTraversal(root) {

        // Create an empty array to store the preorder traversal result.
        const result = [];

        // Start the recursive preorder traversal from the 'root' node.
        this.preorder(root, result);

        // Return the final result containing the preorder traversal of
        // the binary tree.
        return result;
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

// Diagram: from typing import List, Optional

class Solution:
    def preorder(
        self, root: Optional[TreeNode], result: List[int]
    ) -> None:

        # Base case: If the current node is None (empty), return.
        if root is None:
            return

        # Step 1: Visit the current node and store its value in the
        # 'result' list
        result.append(root.val)

        # Step 2: Recursively traverse the left subtree
        self.preorder(root.left, result)

        # Step 3: Recursively traverse the right subtree
        self.preorder(root.right, result)

    def recursive_preorder_traversal(
        self, root: Optional[TreeNode]
    ) -> List[int]:

        # Create an empty list to store the preorder traversal result.
        result: List[int] = []

        # Start the recursive preorder traversal from the 'root' node.
        self.preorder(root, result)

        # Return the final result containing the preorder traversal of
        # the binary tree.
        return result
```

## Complexity Analysis

It should be easy to understand the runtime complexity of this recursive preorder traversal implementation. We visit every node only once in the traversal, so the time complexity is always linear.

The algorithm's space complexity is always **O(h)**, where h is the tree's height. This is because the recursive calls add to the call stack, and the maximum depth of the recursive calls is equal to the tree's height. The best case occurs when the tree is balanced, where the height is **logN**. However, the worst case occurs when the tree is skewed, resulting in an **O(N)** space complexity.

> **Best Case** - The binary tree is height-balanced.
>
> -   Space Complexity - **O(logN)**
> -   Time Complexity - **O(N)**
>
> **Worst Case** - The binary tree is skewed to the left or right.
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Recursive preorder traversal

## Problem Statement

Fundamental

Given the **root** of a binary tree, write a function to return an array containing all the nodes in the order in which they would appear in a preorder traversal. 

You must do this **recursively**.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** \[1, 2, 4, 3, 7\]
> -   **Explanation:** This is the preorder traversal as per the above diagram.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\]
> -   **Output:** \[1, 8, 4, 2, 7\]
> -   **Explanation:** This is the preorder traversal as per the above diagram.

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
    void preorder(TreeNode *root, vector<int> &result) {

        // Base case: If the current node is nullptr (empty), return.
        if (root == nullptr) {
            return;
        }

        // Step 1: Visit the current node and store its value in result
        result.push_back(root->val);

        // Step 2: Recursively traverse the left subtree
        preorder(root->left, result);

        // Step 3: Recursively traverse the right subtree
        preorder(root->right, result);
    }

    vector<int> recursivePreorderTraversal(TreeNode *root) {

        // Create an empty vector to store the preorder traversal result.
        vector<int> result;

        // Start the recursive preorder traversal from the 'root' node.
        preorder(root, result);

        // Return the final result containing the preorder traversal of
        // the binary tree.
        return result;
    }
};
```

***

# Understanding recursive inorder traversal

Inorder traversal is another fundamental technique for exploring the nodes of a binary tree. In this method, each node is processed in the given sequence: first, the left subtree is visited, then the root node, and finally, the right subtree.

**In what scenarios is inorder traversal useful?**

Inorder traversal is particularly valuable when dealing with binary search trees (BSTs). It accesses the nodes in ascending order, making it an essential method for sorting and validating the BST property.

## Algorithm

Inorder traversal of a binary tree is a three-step process. First, the left subtree is visited, then the root node, and finally, the right subtree Let's look at an example to understand it better.

// Diagram: Inorder Traversal

 A simple recursive equation can summarise the traversal process.

// Diagram: Recursive equation for inorder traversal

> **Algorithm**
>
> -   **Step 1:** Recursively traverse the node's \`left\` subtree.
> -   **Step 2:** Visit the node.
> -   **Step 3:** Recursively traverse the node's \`right\` subtree.

## Implementation

Inorder traversal has a very simple recursive implementation that follows the same order as described above. We can implement it in a simple 3-line recursive function. 

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
    void inorder(TreeNode *root, vector<int> &result) {

        // Base case: If the current node is nullptr (empty), return.
        if (root == nullptr) {
            return;
        }

        // Step 1: Recursively traverse the left subtree.
        inorder(root->left, result);

        // Step 2: Visit the current node and store its value in
        // 'result'.
        result.push_back(root->val);

        // Step 3: Recursively traverse the right subtree.
        inorder(root->right, result);
    }

// Diagram: vector<int> recursiveInorderTraversal(TreeNode root) {

        // Create an empty vector to store the inorder traversal result.
        vector<int> result;

        // Start the recursive inorder traversal from the 'root' node.
        inorder(root, result);

        // Return the final result containing the inorder traversal of
        // the binary tree.
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

class Solution {
    public void inorder(TreeNode root, List<Integer> result) {

        // Base case: If the current node is null, return.
        if (root == null) {
            return;
        }

        // Step 1: Recursively traverse the left subtree.
        inorder(root.left, result);

        // Step 2: Visit the current node and store its value in
        // 'result'.
        result.add(root.val);

        // Step 3: Recursively traverse the right subtree.
        inorder(root.right, result);
    }

// Diagram: public List<Integer> recursiveInorderTraversal(TreeNode root) {

        // Create an empty list to store the inorder traversal result.
        List<Integer> result = new ArrayList<>();

        // Start the recursive inorder traversal from the 'root' node.
        inorder(root, result);

        // Return the final result containing the inorder traversal of
        // the binary tree.
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
    inorder(root: TreeNode | null, result: number[]): void {

        // Base case: If the current node is null (empty), return.
        if (root === null) {
            return;
        }

        // Step 1: Recursively traverse the left subtree.
        this.inorder(root.left, result);

        // Step 2: Visit the current node and store its value in
        // 'result'.
        result.push(root.val);

        // Step 3: Recursively traverse the right subtree.
        this.inorder(root.right, result);
    }

// Diagram: recursiveInorderTraversal(root: TreeNode | null): number[] {

        // Create an empty array to store the inorder traversal result.
        const result: number[] = [];

        // Start the recursive inorder traversal from the 'root' node.
        this.inorder(root, result);

        // Return the final result containing the inorder traversal of
        // the binary tree.
        return result;
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
    inorder(root, result) {

        // Base case: If the current node is null (empty), return.
        if (root === null) {
            return;
        }

        // Step 1: Recursively traverse the left subtree.
        this.inorder(root.left, result);

        // Step 2: Visit the current node and store its value in
        // 'result'.
        result.push(root.val);

        // Step 3: Recursively traverse the right subtree.
        this.inorder(root.right, result);
    }
    recursiveInorderTraversal(root) {

        // Create an empty array to store the inorder traversal result.
        const result = [];

        // Start the recursive inorder traversal from the 'root' node.
        this.inorder(root, result);

        // Return the final result containing the inorder traversal of
        // the binary tree.
        return result;
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

// Diagram: from typing import List, Optional

class Solution:
    def inorder(
        self, root: Optional[TreeNode], result: List[int]
    ) -> None:

        # Base case: If the current node is None (empty), return.
        if root is None:
            return

        # Step 1: Recursively traverse the left subtree.
        self.inorder(root.left, result)

        # Step 2: Visit the current node and store its value in 'result'.
        result.append(root.val)

        # Step 3: Recursively traverse the right subtree.
        self.inorder(root.right, result)

    def recursive_inorder_traversal(
        self, root: Optional[TreeNode]
    ) -> List[int]:

        # Create an empty list to store the inorder traversal result.
        result: List[int] = []

        # Start the recursive inorder traversal from the 'root' node.
        self.inorder(root, result)

        # Return the final result containing the inorder traversal of the
        # binary tree.
        return result
```

## Complexity Analysis

Like preorder traversal, we visit every node only once in the traversal, so the time complexity is always linear.

The algorithm's space complexity is always **O(h)**, where h is the tree's height. This is because the recursive calls add to the call stack, and the maximum depth of the recursive calls is equal to the tree's height. The best case occurs when the tree is balanced, where the height is **logN**. However, the worst case occurs when the tree is skewed, resulting in an **O(N)** space complexity.

> **Best Case** - The binary tree is height-balanced
>
> -   Space Complexity - **O(logN)**
> -   Time Complexity - **O(N)**
>
> **Worst Case** - The binary tree is skewed to the left or right
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Recursive inorder traversal

## Problem Statement

Fundamental

Given the **root** of a binary tree, write a function to return an array containing all the nodes in the order in which they would appear in an inorder traversal. 

You must do this traversal **recursively**.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** \[4, 2, 1, 3, 7\]
> -   **Explanation:** This is the inorder traversal as per the above diagram.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\]
> -   **Output:** \[8, 1, 2, 4, 7\]
> -   **Explanation:** This is the inorder traversal as per the above diagram.

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

        // Base case: If the current node is nullptr (empty), return.
        if (root == nullptr) {
            return;
        }

        // Step 1: Recursively traverse the left subtree.
        inorder(root->left, result);

        // Step 2: Visit the current node and store its value in
        // 'result'.
        result.push_back(root->val);

        // Step 3: Recursively traverse the right subtree.
        inorder(root->right, result);
    }

    vector<int> recursiveInorderTraversal(TreeNode *root) {

        // Create an empty vector to store the inorder traversal result.
        vector<int> result;

        // Start the recursive inorder traversal from the 'root' node.
        inorder(root, result);

        // Return the final result containing the inorder traversal of
        // the binary tree.
        return result;
    }
};
```

***

# Understanding recursive postorder traversal

Postorder traversal is the last of the three fundamental techniques for exploring the nodes of a binary tree in a specific left-right-root sequence. This method recursively visits the left subtree, the right subtree, and finally, the root node.

**In what scenarios is postoder traversal useful?**

Postorder traversal is particularly useful in scenarios where nodes must be processed after their descendants, such as in tree deletion operations, evaluating expression trees, and in various applications requiring bottom-up processing like calculating the size of subtrees or evaluating postfix expressions.

## Algorithm

Postorder traversal of a binary tree is a three-step process. We visit the left subtree, the right subtree, and finally, the root node. Let's look at an example to understand it better.

// Diagram: Postorder Traversal

 A simple recursive equation can summarise the traversal process.

// Diagram: Recursive equation for postorder traversal

> **Algorithm**
>
> -   **Step 1:** Recursively traverse the node's \`left\` subtree.
> -   **Step 2:** Recursively traverse the node's \`right\` subtree.
> -   **Step 3:** Visit the node.

## Implementation

Like all the other tree traversals we have seen so far, postorder traversal has a very simple recursive implementation following the same order described above. We can implement postorder traversal in a very simple three-line recursive function. 

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
    void postorder(TreeNode *root, vector<int> &result) {

        // Base case: If the current node is nullptr (empty), return.
        if (root == nullptr) {
            return;
        }

        // Step 1: Recursively traverse the left subtree.
        postorder(root->left, result);

        // Step 2: Recursively traverse the right subtree.
        postorder(root->right, result);

        // Step 3: Visit the current node and store its value in
        // 'result'.
        result.push_back(root->val);
    }

// Diagram: vector<int> recursivePostorderTraversal(TreeNode root) {

        // Create an empty vector to store the postorder traversal
        // result.
        vector<int> result;

        // Start the recursive postorder traversal from the 'root' node.
        postorder(root, result);

        // Return the final result containing the postorder traversal of
        // the binary tree.
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

class Solution {
    public void postorder(TreeNode root, List<Integer> result) {

        // Base case: If the current node is null (empty), return.
        if (root == null) {
            return;
        }

        // Step 1: Recursively traverse the left subtree.
        postorder(root.left, result);

        // Step 2: Recursively traverse the right subtree.
        postorder(root.right, result);

        // Step 3: Visit the current node and store its value in
        // 'result'.
        result.add(root.val);
    }

// Diagram: public List<Integer> recursivePostorderTraversal(TreeNode root) {

        // Create an empty list to store the postorder traversal result.
        List<Integer> result = new ArrayList<>();

        // Start the recursive postorder traversal from the 'root' node.
        postorder(root, result);

        // Return the final result containing the postorder traversal of
        // the binary tree.
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
    postorder(root: TreeNode | null, result: number[]): void {

        // Base case: If the current node is null (empty), return.
        if (root === null) {
            return;
        }

        // Step 1: Recursively traverse the left subtree.
        this.postorder(root.left, result);

        // Step 2: Recursively traverse the right subtree.
        this.postorder(root.right, result);

        // Step 3: Visit the current node and store its value in
        // 'result'.
        result.push(root.val);
    }

// Diagram: recursivePostorderTraversal(root: TreeNode | null): number[] {

        // Create an empty array to store the postorder traversal result.
        const result: number[] = [];

        // Start the recursive postorder traversal from the 'root' node.
        this.postorder(root, result);

        // Return the final result containing the postorder traversal of
        // the binary tree.
        return result;
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
    postorder(root, result) {

        // Base case: If the current node is null (empty), return.
        if (root === null) {
            return;
        }

        // Step 1: Recursively traverse the left subtree.
        this.postorder(root.left, result);

        // Step 2: Recursively traverse the right subtree.
        this.postorder(root.right, result);

        // Step 3: Visit the current node and store its value in
        // 'result'.
        result.push(root.val);
    }

// Diagram: recursivePostorderTraversal(root) {

        // Create an empty array to store the postorder traversal result.
        const result = [];

        // Start the recursive postorder traversal from the 'root' node.
        this.postorder(root, result);

        // Return the final result containing the postorder traversal of
        // the binary tree.
        return result;
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

// Diagram: from typing import List, Optional

class Solution:
    def postorder(self, root: Optional[TreeNode], result: List[int]):

        # Base case: If the current node is None (empty), return.
        if root is None:
            return

        # Step 1: Recursively traverse the left subtree.
        self.postorder(root.left, result)

        # Step 2: Recursively traverse the right subtree.
        self.postorder(root.right, result)

        # Step 3: Visit the current node and store its value in 'result'.
        result.append(root.val)

    def recursive_postorder_traversal(
        self, root: Optional[TreeNode]
    ) -> List[int]:

        # Create an empty list to store the postorder traversal result.
        result: List[int] = []

        # Start the recursive postorder traversal from the 'root' node.
        self.postorder(root, result)

        # Return the final result containing the postorder traversal of
        # the binary tree.
        return result
```

## Complexity Analysis

Like preorder and inorder traversals, we visit every node only once in the traversal, so the time complexity is always linear.

The algorithm's space complexity is always **O(h)**, where h is the tree's height. This is because the recursive calls add to the call stack, and the maximum depth of the recursive calls is equal to the tree's height. The best case occurs when the tree is balanced, where the height is **logN**. However, the worst case occurs when the tree is skewed, resulting in an**O(N)**space complexity.

> **Best Case** - The binary tree is height-balanced
>
> -   Space Complexity - **O(logN)**
> -   Time Complexity - **O(N)**
>
> **Worst Case** - The binary tree is skewed to the left or right
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Recursive postorder traversal

## Problem Statement

Fundamental

Given the **root** of a binary tree, write a function to return an array containing all the nodes in the order in which they would appear in a postorder traversal.

 You must do this **recursively**.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** \[4, 2, 7, 3, 1\]
> -   **Explanation:** This is the postorder traversal as per the above diagram.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\]
> -   **Output:** \[8, 2, 7, 4, 1\]
> -   **Explanation:** This is the postorder traversal as per the above diagram.

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
    void postorder(TreeNode *root, vector<int> &result) {

        // Base case: If the current node is nullptr (empty), return.
        if (root == nullptr) {
            return;
        }

        // Step 1: Recursively traverse the left subtree.
        postorder(root->left, result);

        // Step 2: Recursively traverse the right subtree.
        postorder(root->right, result);

        // Step 3: Visit the current node and store its value in
        // 'result'.
        result.push_back(root->val);
    }

    vector<int> recursivePostorderTraversal(TreeNode *root) {

        // Create an empty vector to store the postorder traversal
        // result.
        vector<int> result;

        // Start the recursive postorder traversal from the 'root' node.
        postorder(root, result);

        // Return the final result containing the postorder traversal of
        // the binary tree.
        return result;
    }
};
```
