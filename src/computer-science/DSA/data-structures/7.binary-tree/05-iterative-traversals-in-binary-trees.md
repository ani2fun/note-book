# Iterative traversals in binary trees

## Table of Contents

1. [Understanding the problem](#understanding-the-problem)
2. [Understanding iterative preorder traversal](#understanding-iterative-preorder-traversal)
3. [Implement iterative preorder traversal](#understanding-iterative-preorder-traversal)
4. [Understanding iterative inorder traversal](#understanding-iterative-inorder-traversal)
5. [Implement iterative inorder traversal](#understanding-iterative-inorder-traversal)
6. [Understanding iterative postorder traversal](#understanding-iterative-postorder-traversal)
7. [Implement iterative postorder traversal](#understanding-iterative-postorder-traversal)
8. [Understanding level order traversal](#understanding-level-order-traversal)
9. [Implement level order traversal](#understanding-level-order-traversal)

***

# Understanding the problem

The recursive tree traversal algorithms we learned earlier in the course are quite easy and can be implemented neatly. However, they all have a major limitation: They rely on recursive function calls, which rely on **stack memory**. 

## Call stack

Let us revisit how function calls work for a computer program. All computer programs have stack memory available to manage function calls. Whenever a function call is made in the program, a stack frame with all the information related to that function (local variables, return address, etc.) is created and pushed on top of the stack. When the function execution finishes and the control returns to the caller, this stack frame is destroyed by a stack pop operation.

// Diagram: Every function call creates a stack frame of its own in the stack memory

## Stack overflow

Recursive function calls repeatedly call the same function until a base case is reached. Consequently, the call stack **grows** linearly with the number of function calls before reaching the base case. The call stack, however, is **limited** in space, so it can only accommodate a certain number of stack frames, after which there is a stack overflow and the program crashes. For all the recursive tree traversal algorithms we learned earlier, it is impossible to traverse the tree recursively if the tree's height exceeds the number of frames the call stack can accommodate.

// Diagram: Too many nested function calls leads to stack overflow

Iterative tree traversal algorithms overcome this limitation by not relying on recursive function calls. The iterative preorder, inorder, and postorder traversal versions don't rely on the call stack and use an explicit stack to simulate the same LIFO behavior. Other traversal algorithms, like level order traversal, do not require a stack. We will learn the iterative traversal algorithms that can be used to traverse a binary tree in more detail.

***

# Understanding iterative preorder traversal

To understand the iterative implementation of preorder traversal, we need to split the whole process into small steps and understand how each step functions. Once we get the intuition behind these individual steps, we can connect them to devise an algorithm for iterative preorder traversal. Let us start by looking at how preorder traversal is done. 

> -   **Step 1:** Visit the node.
> -   **Step 2:** Recursively traverse the node's \`left\` subtree.
> -   **Step 3:** Recursively traverse the node's \`right\` subtree.

## Iterative Steps

This traversal is recursive as the second and third steps of preorder traversal use preorder traversal again. Let us look at this traversal's distinct iterative processes and how we can implement these steps. Once we have implemented these individual steps, we can glue them together to create an iterative algorithm for the entire traversal. Preorder traversal can be broken down into two iterative steps :

> -   **Step 1:** Visit the node and traverse its \`left\` subtree.
> -   **Step 2:** Traverse the node's \`right\` subtree.

## 1\. Visit the node and traverse its left subtree.

The first step of preorder traversal is to visit the current node. The next step is to traverse the left subtree. Following the definition, for a tree rooted at node **R,** we visit the node **R** and then go to its left subtree. We then visit the root node of the left subtree and then go further to its left subtree. This process goes on and on and on until we finally hit a `null`. We stop at `null` because there is nowhere to go beyond that. Let's say this `null` was the **left** child of node **N**

In the recursive implementation of preorder traversal, hitting a `null` is the base case of recursion, and if we hit it, we backtrack to the parent with the help of the function call stack. However, we can't leverage the function call stack in the iterative implementation, so we use our own stack to replicate this behavior.

**What do we store in the stack?**

Before traversing the current node's left subtree, we push its reference to a stack. This stack holds a list of nodes for which we are still traversing the left subtree. The top of the stack holds the address of the **most recent** node for which we are **still visiting the left subtree**.

To visit the node and traverse its left subtree, we initialize a `current` variable and set it to hold the node **R**. Once we are done visiting the node, we push `current` to the stack and set `current` to hold to its left child. We repeat this process until we hit a `null` 

// Diagram: Step 1: Visit the node and traverse its left subtree

> **Algorithm**
>
> -   **Step 1:** While \`current\` is not equal to \`null\`, do the following:
>     -   **Step 1.1:** Visit the \`current\` node.
>     -   **Step 1.2:** Push the \`current\` node to the stack.
>     -   **Step 1.3:** Set the \`current\` pointer to hold the reference of the \`current\` node's \`left\` child.

## 2\. Traverse the node's right subtree

Once we hit a `null` it means that we are done traversing a node's left subtree. The next step is to identify that node and preorder traverse its right subtree.

**How do we identify which node has the left subtree completely visited on hitting `null`?**

The top of the stack holds the reference to the most recent node for which we are still traversing the left subtree. Once we hit a `null`, it means that this node(top of the stack) is the one for which the left subtree has been completely traversed. 

We look at the top of the stack to get the node for which the left subtree has been completely traversed and set `current` to this node to effectively **jump** back to this node. Once we have made the jump, we remove the top of the stack by doing a pop operation. 

**Why do we pop the top of the stack?**

Once we have identified the node for which we just finished traversing the left subtree, we pop it from the top of the stack to ensure that the top always holds the node whose left subtree is being traversed.

Next, we move to the right subtree by setting `current` to the popped node's right child. Then, we repeat the entire process from **Step 1: Visit the node and traverse its left subtree** for the subtree rooted at the node held by `current`.

// Diagram: Step 2: Traverse the node's right subtree

> **Algorithm**
>
> -   **Step 1:** If the stack is not empty, do the following:
>     -   **Step 1.1:** Set the \`current\` pointer to store the reference of the node at the top of the stack.
>     -   **Step 1.2:** Pop the top of the stack.
>     -   **Step 1.3:** Set the \`current\` pointer to hold the reference of the \`current\` node's \`right\` child.

## Algorithm

By combining all the individual steps, we can understand the high-level idea of the iterative preorder traversal algorithm. 

> **Algorithm**
>
> -   **Step 1:** Set the \`current\` pointer to hold the reference of the \`root\` node.
> -   **Step 2:** While \`current\` is not equal to \`null\` or the stack is not empty, do the following:
>     -   **Step 2.1:** While \`current\` is not equal to \`null\`, do the following:
>         -   **Step 2.1.1:** Visit the \`current\` node.
>         -   **Step 2.1.2:** Push the \`current\` node to the stack.
>         -   **Step 2.1.3:** Set the \`current\` pointer to hold the reference of the \`current\` node's \`left\` child.
>     -   **Step 2.2:** Set the \`current\` pointer to store the reference of the node at the top of the stack.
>     -   **Step 2.3:** Pop the top of the stack.
>     -   **Step 2.4:** Set the \`current\` pointer to hold the reference of the \`current\` node's \`right\` child.

**When does the algorithm terminate?**

The algorithm will terminate when we can no longer find a node in the stack. 

## Implementation

The algorithm above can be implemented using a nested while loop.

C++

```cpp
#include <stack>

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
    vector<int> iterativePreorderTraversal(TreeNode *root) {

        // Create a vector to store the result of preorder traversal
        vector<int> result;

        // Create a stack to help traverse the binary tree iteratively
        stack<TreeNode *> stack;

        // Start from the root node
        TreeNode *current = root;

        // Continue traversal until we reach the end of the tree (current
        // is null) and the stack is empty
        while (current || !stack.empty()) {

            // Traverse to the leftmost node and store the node values in
            // the result vector
            while (current) {
                result.push_back(current->val);
                stack.push(current);
                current = current->left;
            }

            // If the current node is null, reached the leftmost leaf or
            // subtree we backtrack to the parent node by popping from
            // the stack and move to its right subtree.
            current = stack.top();
            stack.pop();
            current = current->right;
        }

        // Return the result vector containing the preorder traversal of
        // the binary tree
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
    public List<Integer> iterativePreorderTraversal(TreeNode root) {

        // Create a list to store the result of preorder traversal
        List<Integer> result = new ArrayList<>();

        // Create a stack to help traverse the binary tree iteratively
        Stack<TreeNode> stack = new Stack<>();

        // Start from the root node
        TreeNode current = root;

        // Continue traversal until we reach the end of the tree (current
        // is null) and the stack is empty
        while (current != null || !stack.isEmpty()) {

            // Traverse to the leftmost node and store the node values in
            // the result list
            while (current != null) {
                result.add(current.val);
                stack.push(current);
                current = current.left;
            }

            // If the current node is null, we reached the leftmost leaf
            // or subtree We backtrack to the parent node by popping from
            // the stack and move to its right subtree.
            current = stack.pop();
            current = current.right;
        }

        // Return the result list containing the preorder traversal of
        // the binary tree
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
    iterativePreorderTraversal(root: TreeNode | null): number[] {

        // Create a vector to store the result of preorder traversal
        const result: number[] = [];

        // Create a stack to help traverse the binary tree iteratively
        const stack: (TreeNode | null)[] = [];

        // Start from the root node
        let current: TreeNode | null = root;

        // Continue traversal until we reach the end of the tree (current
        // is null) and the stack is empty
        while (current || stack.length > 0) {

            // Traverse to the leftmost node and store the node values in
            // the result vector
            while (current) {
                result.push(current.val);
                stack.push(current);
                current = current.left;
            }

            // If the current node is null, reached the leftmost leaf or
            // subtree we backtrack to the parent node by popping from
            // the stack and move to its right subtree.
            current = stack.pop()!;
            current = current.right;
        }

        // Return the result vector containing the preorder traversal of
        // the binary tree
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
    iterativePreorderTraversal(root) {

        // Create a vector to store the result of preorder traversal
        const result = [];

        // Create a stack to help traverse the binary tree iteratively
        const stack = [];

        // Start from the root node
        let current = root;

        // Continue traversal until we reach the end of the tree (current
        // is null) and the stack is empty
        while (current || stack.length > 0) {

            // Traverse to the leftmost node and store the node values in
            // the result vector
            while (current) {
                result.push(current.val);
                stack.push(current);
                current = current.left;
            }

            // If the current node is null, reached the leftmost leaf or
            // subtree we backtrack to the parent node by popping from
            // the stack and move to its right subtree.
            current = stack.pop();
            current = current.right;
        }

        // Return the result vector containing the preorder traversal of
        // the binary tree
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

// Diagram: from typing import Optional, List

class Solution:
    def iterative_preorder_traversal(
        self, root: Optional[TreeNode]
    ) -> List[int]:

        # Create a list to store the result of preorder traversal
        result: List[int] = []

        # Create a stack to help traverse the binary tree iteratively
        stack: List[TreeNode] = []

        # Start from the root node
        current: Optional[TreeNode] = root

        # Continue traversal until we reach the end of the tree (current
        # is None) and the stack is empty
        while current or stack:

            # Traverse to the leftmost node and store the node values in
            # the result list
            while current:
                result.append(current.val)
                stack.append(current)
                current = current.left

            # If the current node is None, reached the leftmost leaf or
            # subtree we backtrack to the parent node by popping from the
            # stack and move to its right subtree.
            current = stack.pop()
            current = current.right

        # Return the result list containing the preorder traversal of the
        # binary tree
        return result
```

## Complexity Analysis

Looking at the logic, it is easy to understand that the number of computational operations in the iterative version of preorder traversal is directly proportional to the number of nodes in a tree, as every node is visited only once. Since we are also using a stack to store the addresses of nodes, we have a space complexity that is directly proportional to the length of the tree's longest root-to-leaf path (height).

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

# Iterative preorder traversal

## Problem Statement

Fundamental

Given the **root** of a binary tree, write a function to return an array containing all the nodes in the order in which they would appear in a preorder traversal.

You must do this **iteratively**.

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
#include <stack>

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
    vector<int> iterativePreorderTraversal(TreeNode *root) {

        // Create a vector to store the result of preorder traversal
        vector<int> result;

        // Create a stack to help traverse the binary tree iteratively
        stack<TreeNode *> stack;

        // Start from the root node
        TreeNode *current = root;

        // Continue traversal until we reach the end of the tree (current
        // is null) and the stack is empty
        while (current || !stack.empty()) {

            // Traverse to the leftmost node and store the node values in
            // the result vector
            while (current) {
                result.push_back(current->val);
                stack.push(current);
                current = current->left;
            }

            // If the current node is null, reached the leftmost leaf or
            // subtree we backtrack to the parent node by popping from
            // the stack and move to its right subtree.
            current = stack.top();
            stack.pop();
            current = current->right;
        }

        // Return the result vector containing the preorder traversal of
        // the binary tree
        return result;
    }
};
```

***

# Understanding iterative inorder traversal

Just like the preorder traversal, to understand the iterative implementation of inorder traversal, we need to split the whole process into small steps and understand how each step functions.  Let us start by looking at how inorder traversal is done. 

> -   **Step 1:** Recursively traverse the node's \`left\` subtree.
> -   **Step 2:** Visit the node.
> -   **Step 3:** Recursively traverse the node's \`right\` subtree.

## Iterative Steps

Inorder traversal is recursive, as the first and last steps of traversal use inorder traversal again. Let us now look at the distinct iterative steps this traversal follows and how we can implement these steps. Once we have implemented these individual steps, we can glue them together to create an iterative algorithm for the entire traversal. Inorder traversal can be broken down into three iterative steps :

> -   **Step 1:** Traverse the node's \`left\` subtree.
> -   **Step 2:** Visit the node.
> -   **Step 3:** Traverse the node's \`right\` subtree.

## 1\. Traverse the node's left subtree

The first step of inorder traversal is to visit the left subtree using inorder traversal. Following this definition, for a tree rooted at node **R**, we start from the node **R** and then keep going left until we reach a `null`. We stop at `null` because there is nowhere to go beyond that. Let's say this `null` was the left child of node **N**

In the recursive implementation of inorder traversal, hitting a `null` is the base case of recursion, and if we hit it, we backtrack to the parent with the help of the function call stack. However, we can't leverage the function call stack in the iterative implementation, so we use our own stack to replicate this behavior.

**What do we store in the stack?**

While traversing the left subtree, we push the nodes' references to a stack. The stack holds a list of nodes for which we are still traversing the left subtree, and the top holds the address of the **most recent** node for which we are **still** traversing the left subtree.

To traverse the left subtree, we initialize a `current` variable and set it to hold the node **R**. We push `current` to the stack and set `current` to hold its left child. We repeat this process until we hit a `null`

// Diagram: Step 1: Traverse the node's left subtree

> **Algorithm**
>
> -   **Step 1:** While \`current\` is not equal to \`null\`, do the following:
>     -   **Step 1.1:** Push the \`current\` node to the stack.
>     -   **Step 1.2:** Set the \`current\` pointer to hold the reference of the \`current\` node's \`left\` child.

## 2\. Visit the node

Once we hit a `null` it means that we are done traversing a node's left subtree. The next step is to identify that node and visit it.

**How do we identify which node has the left subtree completely traversed on hitting `null`?**

The top of the stack holds the reference to the most recent node for which we are still traversing the left subtree. Once we hit a `null`, it means that this node(top of the stack) is the one for which the left subtree has been completely traversed. 

We look at the top of the stack to get the node for which the left subtree has been completely traversed and set `current` to this node to effectively **jump** back to this node. Once we have made the jump, we remove the top of the stack.

**Why do we pop the top of the stack?**

Once we have identified the node for which we just finished traversing the left subtree, we pop it from the top of the stack to ensure that the top always holds the node whose left subtree is being traversed.

We then go ahead and visit the node held in `current`.

// Diagram: Step 2: Visit the node

> **Algorithm**
>
> -   **Step 1:** If the stack is not empty, do the following:
>     -   **Step 1.1:** Set the \`current\` pointer to store the reference of the node at the top of the stack.
>     -   **Step 1.2:** Pop the top of the stack.
>     -   **Step 1.3:** Visit the \`current\` node.

## 3\. Traverse the node's right subtree

Once the traversing of the left subtree and the node itself is complete, the next step is to traverse its right subtree. We move to the right subtree by setting `current` to hold its right child. Then, we repeat the entire process from **Step 1: Traverse the node's left subtree** for the subtree rooted at the node held by `current`.

// Diagram: Step 3: Traverse the node's right subtree

> **Algorithm**
>
> -   **Step 1:** Set the \`current\` pointer to hold the reference of the \`current\` node's \`right\` child.
> -   **Step 2:** Go the initial step of traversing the node's \`left\` subtree

## Algorithm

By combining all the individual steps, we can understand the high-level idea of the iterative inorder traversal algorithm. 

> **Algorithm**
>
> -   **Step 1:** Set the \`current\` pointer to hold the reference of the \`root\` node.
> -   **Step 2:** While \`current\` is not equal to \`null\` or the stack is not empty, do the following:
>     -   **Step 2.1:** While \`current\` is not equal to \`null\`, do the following:
>         -   **Step 2.1.1:** Push the \`current\` node to the stack.
>         -   **Step 2.1.2:** Set the \`current\` pointer to hold the reference of the \`current\` node's \`left\` child.
>     -   **Step 2.2:** Set the \`current\` pointer to store the reference of the node at the top of the stack.
>     -   **Step 2.3:** Pop the top of the stack.
>     -   **Step 2.4:** Visit the \`current\` node.
>     -   **Step 2.5:** Set the \`current\` pointer to hold the reference of the \`current\` node's \`right\` child.

**When does the algorithm terminate?**

The algorithm will terminate when we can no longer find a node in the stack. 

## Implementation

The algorithm above can be implemented using a nested while loop.

C++

```cpp
#include <stack>

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
    vector<int> iterativeInorderTraversal(TreeNode *root) {

        // Create a vector to store the result of inorder traversal
        vector<int> result;

        // Create a stack to help traverse the binary tree iteratively
        stack<TreeNode *> stack;

        // Start from the root node
        TreeNode *current = root;

        // Continue traversal until we reach the end of the tree (current
        // is null) and the stack is empty
        while (current || !stack.empty()) {

            // Traverse to the leftmost node and store the node values in
            // the result vector
            while (current) {
                stack.push(current);
                current = current->left;
            }

            // If the current node is null, reached the leftmost leaf or
            // subtree we backtrack to the parent node by popping from
            // the stack, process the current node, and move to its right
            // subtree.
            current = stack.top();
            stack.pop();
            result.push_back(current->val);
            current = current->right;
        }

        // Return the result vector containing the inorder traversal of
        // the binary tree
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
    public List<Integer> iterativeInorderTraversal(TreeNode root) {

        // Create a list to store the result of inorder traversal
        List<Integer> result = new ArrayList<>();

        // Create a stack to help traverse the binary tree iteratively
        Stack<TreeNode> stack = new Stack<>();

        // Start from the root node
        TreeNode current = root;

        // Continue traversal until we reach the end of the tree (current
        // is null) and the stack is empty
        while (current != null || !stack.empty()) {

            // Traverse to the leftmost node and store the node values in
            // the result list
            while (current != null) {
                stack.push(current);
                current = current.left;
            }

            // If the current node is null, we have reached the leftmost
            // leaf or subtree We backtrack to the parent node by popping
            // from the stack, process the current node and move to its
            // right subtree.
            current = stack.pop();
            result.add(current.val);
            current = current.right;
        }

        // Return the result list containing the inorder traversal of the
        // binary tree
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
    iterativeInorderTraversal(root: TreeNode | null): number[] {

        // Create an array to store the result of inorder traversal
        const result: number[] = [];

        // Create a stack to help traverse the binary tree iteratively
        const stack: (TreeNode | null)[] = [];

        // Start from the root node
        let current: TreeNode | null = root;

        // Continue traversal until we reach the end of the tree (current
        // is null) and the stack is empty
        while (current || stack.length > 0) {

            // Traverse to the leftmost node and store the node values in
            // the result array
            while (current) {
                stack.push(current);
                current = current.left;
            }

            // If the current node is null, we have reached the leftmost
            // leaf or subtree We backtrack to the parent node by popping
            // from the stack, process the current node, and move to its
            // right subtree.
            current = stack.pop()!;
            result.push(current.val);
            current = current.right;
        }

        // Return the result array containing the inorder traversal of
        // the binary tree
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
    iterativeInorderTraversal(root) {

        // Create an array to store the result of inorder traversal
        const result = [];

        // Create a stack to help traverse the binary tree iteratively
        const stack = [];

        // Start from the root node
        let current = root;

        // Continue traversal until we reach the end of the tree (current
        // is null) and the stack is empty
        while (current || stack.length > 0) {

            // Traverse to the leftmost node and store the node values in
            // the result array
            while (current) {
                stack.push(current);
                current = current.left;
            }

            // If the current node is null, we have reached the leftmost
            // leaf or subtree We backtrack to the parent node by popping
            // from the stack, process the current node, and move to its
            // right subtree.
            current = stack.pop();
            result.push(current.val);
            current = current.right;
        }

        // Return the result array containing the inorder traversal of
        // the binary tree
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

// Diagram: from typing import Optional, List

class Solution:
    def iterative_inorder_traversal(
        self, root: Optional[TreeNode]
    ) -> List[int]:

        # Create a list to store the result of inorder traversal
        result: List[int] = []

        # Create a stack to help traverse the binary tree iteratively
        stack: List[TreeNode] = []

        # Start from the root node
        current: Optional[TreeNode] = root

        # Continue traversal until we reach the end of the tree (current
        # is None) and the stack is empty
        while current or stack:

            # Traverse to the leftmost node and store the node values in
            # the result list
            while current:
                stack.append(current)
                current = current.left

            # If the current node is None, we have reached the leftmost
            # leaf or subtree. We backtrack to the parent node by popping
            # from the stack, process the current node, and move to its
            # right subtree.
            current = stack.pop()
            result.append(current.val)
            current = current.right

        # Return the result list containing the inorder traversal of the
        # binary tree
        return result
```

## Complexity Analysis

Looking at the logic, it is easy to understand that the number of computational operations in the iterative version of inorder traversal is directly proportional to the number of nodes in a tree, as every node is visited only once. Since we are also using a stack to store the addresses of nodes, we have a space complexity that is directly proportional to the length of the tree's longest root-to-leaf path (height).

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

# Iterative inorder traversal

## Problem Statement

Fundamental

Given the **root** of a binary tree, write a function to return an array containing all the nodes in the order in which they would appear in an inorder traversal.

You must do this **iteratively**.

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
#include <stack>

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
    vector<int> iterativeInorderTraversal(TreeNode *root) {

        // Create a vector to store the result of inorder traversal
        vector<int> result;

        // Create a stack to help traverse the binary tree iteratively
        stack<TreeNode *> stack;

        // Start from the root node
        TreeNode *current = root;

        // Continue traversal until we reach the end of the tree (current
        // is null) and the stack is empty
        while (current || !stack.empty()) {

            // Traverse to the leftmost node and store the node values in
            // the result vector
            while (current) {
                stack.push(current);
                current = current->left;
            }

            // If the current node is null, reached the leftmost leaf or
            // subtree we backtrack to the parent node by popping from
            // the stack, process the current node, and move to its right
            // subtree.
            current = stack.top();
            stack.pop();
            result.push_back(current->val);
            current = current->right;
        }

        // Return the result vector containing the inorder traversal of
        // the binary tree
        return result;
    }
};
```

***

# Understanding iterative postorder traversal

Just like preorder and inorder traversal, to understand the iterative implementation of postorder traversal, we need to split the whole process into small steps and understand how each step functions. Let us start by looking at how postorder traversal is done. 

> **Algorithm**
>
> -   **Step 1:** Recursively traverse the node's \`left\` subtree.
> -   **Step 2:** Recursively traverse the node's \`right\` subtree.
> -   **Step 3:** Visit the node.

## Iterative Steps

Postorder traversal is recursive, as the first and second steps use postorder traversal again. Let us now look at the distinct iterative steps this traversal follows and how we can implement these steps. Once we have implemented these individual steps, we can glue them together to create an iterative algorithm for the entire traversal. Postorder traversal can be broken down into three iterative steps :

> -   **Step 1:** Traverse the node's \`left\` subtree.
> -   **Step 2:** Traverse the node's \`right\` subtree.
> -   **Step 3:** Visit the node.

To create an iterative algorithm, we will first follow these steps sequentially. The complete algorithm will make sense when we combine all these steps and consider the big picture.

## 1\. Traverse the node's left subtree

The first step of postorder traversal is to traverse the left subtree using postorder traversal. Following this definition, for a tree rooted at node **R**, we start from the node **R** and then keep going left until we reach a `null`. We stop at `null` because there is nowhere to go beyond that. Let's say this `null` was the left child of node **N.**

In the recursive implementation of postorder traversal, hitting a `null` is the base case of recursion, and we backtrack to the parent with the help of the function call stack and move to the node's right subtree.

**How is this step different from iterative preorder and inorder traversals?**

It's essential to understand that, unlike preorder and inorder traversal, where the last step involves a recursive function call, in postorder traversal, the last step is to visit the node itself. This means that, unlike preorder and inorder traversal, we need to make a **second stop** at a node to visit it once its left and right subtrees are traversed instead of simply backtracking up. Consequently, there can be two cases when we backtrack to node **N**.

// Diagram: Two possible cases when we backtrack to the node N are

> 1.  If the right subtree of N has not yet been traversed, then we should traverse it (common with preorder and inorder traversals).
> 2.  If the right subtree of N has already been traversed, we should stop here and visit the node (specific to postorder traversal).

In the recursive implementation of postorder traversal, we do not need any extra information to decide between the cases as we place the recursive function calls and code to process the node in the proper sequence in the recursive function. However, we can't leverage the function call stack and this execution sequence in the iterative implementation, so we use our own stack to replicate this behavior.

**What do we store in the stack?**

While traversing the left subtree, we push the reference to the nodes to a stack **two** times. This way, the top of the stack holds the **most recent** node for which the traversal of the right subtree **or** traversing of the node itself is **due**.

**Why do we push the node two times in the stack?**

As we learned earlier, we must make **two stops** at every node in postorder traversal while backtracking up. To make this possible, we need two copies of a node in the stack. As we will learn shortly, the two copies also help us determine whether it is the first or second time we backtracked to this node. We can compare the node just popped from the stack and the top of the stack to determine if it is the first or second time that we are at any node. It will determine if we traverse the node's right subtree or visit the node itself.

To go left, we initialize a `current` variable and set it to hold the node **R**. We push `current` to the stack **two times** and set `current` to hold its left child. We repeat this process until we hit a `null`

// Diagram: Step 1: Traverse the node's left subtree

> **Algorithm**
>
> -   **Step 1:** While \`current\` is not equal to \`null\`, do the following:
>     -   **Step 1.1:** Push the \`current\` node to the stack.
>     -   **Step 1.2:** Push the \`current\` node again to the stack.
>     -   **Step 1.3:** Set the \`current\` pointer to hold the reference of the \`current\` node's \`left\` child.

## 2\. Traverse the node's right subtree

We must traverse a node's right subtree(go right) once we traverse its left subtree. Since `null` is the termination of a tree, hitting a `null` as the left child for a node means that we are done traversing the **left** subtree for that node.

There is one other way we can reach this step without hitting `null`  but we will learn that in **Step 3: Visit the node**. The next step is to identify that node(**N**) and traverse its right subtree.

**How do we identify which node has the left subtree completely traversed?**

At this point, the top of the stack should hold the **most recent** node for which the traversal of the right subtree is **due**.  Once the traversal of the left subtree of a node is finished, we can look at the top of the stack to find the node.

We look at the top of the stack to get the node for which the left subtree has been completely traversed and set `current` to this node to effectively **jump** back to this node and pop the address from the top of the stack.

**We only removed one copy from the stack. What about the second copy?**After traversing the left subtree for a node, we use the first copy of the node to make our first stop. Since this is the first stop when backtracking to this node, following postorder traversal, we start the traversal for the right subtree of the node and pop it from the top of the stack to mark that the traversal of the right subtree is in progress and visiting of the node itself is due. We do not pop the second copy from the top of the stack to make a **second stop** at the node to visit it once the traversal for the right subtree is also finished.

Then, we move to the right subtree by setting `current` to its right child. Then, we repeat the entire process from **Step 1: Traverse the node's left subtree** for the subtree rooted at the node held in `current`.

// Diagram: Step 2: Traverse the node's right subtree

> **Algorithm**
>
> -   **Step 1:** If the stack is not empty, do the following:
>     -   **Step 1.1:** Set the \`current\` pointer to store the reference of the node at the top of the stack.
>     -   **Step 1.2:** Pop the top of the stack.
>     -   **Step 1.3:** If the stack is not empty, and the top of the stack is the same as the \`current\` node, do the following:
>         -   **Step 1.3.1:** Set the \`current\` pointer to hold the reference of the \`current\` node's \`right\` child.
>         -   **Step 1.3.2:** Go to the initial step of traversing the node's \`left\` subtree.

**What if there is no right child?**If there is no right child, it means we are done traversing both the left and right subtree for a node, and we now need to process the node itself. More details on this in **Step 3: Process the node**

## 3\. Visit the node

We reach this step when we hit a `null` as the **right** child of a node. Hitting a `null` as the right child means that the traversal of the right subtree for some node(say N) has finished. Since we are following postorder traversal, the traversal of both the left and right subtree for the node has finished, and we need to process the node itself now. 

**How do we identify which node has both left and right subtree completely traversed?**This is where the second copy of the nodes we pushed in the stack comes into action. At this point, the top of the stack should be the most recent node for which the traversal of the right subtree is in progress and the node's processing is due. We can use the top of the stack to find this node.

Let us continue the traversal for our example tree to understand this better.

// Diagram: The second copy of the node in stack is used to backtrack and stop at the node for the second time

We look at the top of the stack to get the node(N) for which both the left and right subtree have been completely traversed and set `current` to this node to effectively **jump** back to this node and pop it from the top of the stack.

**Why do we pop the node from the stack?**Once we are done processing the node, we will finish the postorder traversal of the subtree at that node. We do not wish to make any further stops at this node, so we pop it from the top of the stack to ensure we do not revisit it.

// Diagram: Step 3: Visit the node

Once the node(N) is processed, we will complete the postorder traversal for the entire subtree at node N. This also means we have completely traversed the **left** subtree of the parent of node N, say P. This is logically equivalent to hitting a `null` as the **left** child of P. The next step is to traverse the right subtree of P, so we repeat the steps from **Step 2: Traverse the node's right subtree**. 

// Diagram: We go to Step 2: Traverse the node's right subtree once the left subtree for a node is traversed

> **Algorithm**
>
> -   **Step 1:** If the stack is not empty, do the following:
>     -   **Step 1.1:** Set the \`current\` pointer to store the reference of the node at the top of the stack.
>     -   **Step 1.2:** Pop the top of the stack.
>     -   **Step 1.3:** If the stack is empty, or the top of the stack is not equal to the \`current\` node, do the following:
>         -   **Step 1.3.1:** Visit the \`current\` node.
>         -   **Step 1.3.2:** Set the \`current\` pointer to \`null\` so that in the next iteration, the algorithm goes to the second step of traversing the node's \`right\` subtree.

## Algorithm

By combining all the individual steps, we can understand the high-level idea of the iterative postorder traversal algorithm. 

> **Algorithm**
>
> -   **Step 1:** Set the \`current\` pointer to hold the reference of the \`root\` node.
> -   **Step 2:** While \`current\` is not equal to \`null\` or the stack is not empty, do the following:
>     -   **Step 2.1:** While \`current\` is not equal to \`null\`, do the following:
>         -   **Step 2.1.1:** Push the \`current\` node to the stack.
>         -   **Step 2.1.2:** Push the \`current\` node again to the stack.
>         -   **Step 2.1.3:** Set the \`current\` pointer to hold the reference of the \`current\` node's \`left\` child.
>     -   **Step 2.2:** Set the \`current\` pointer to store the reference of the node at the top of the stack.
>     -   **Step 2.3:** Pop the top of the stack.
>     -   **Step 2.4:** If the stack is not empty, and the top of the stack is the same as the \`current\` node, do the following:
>         -   **Step 2.4.1:** Set the \`current\` pointer to hold the reference of the \`current\` node's \`right\` child.
>     -   **Step 2.5:** Else, if the stack is empty, or the top of the stack is not equal to the \`current\` node, do the following:
>         -   **Step 2.5.1:** Visit the \`current\` node.
>         -   **Step 2.5.2:** Set the \`current\` pointer to \`null\` so that in the next iteration, the algorithm goes to the second step of traversing the node's \`right\` subtree.

**When does the algorithm terminate?**

The algorithm will terminate when we can no longer find a node in the stack. 

## Implementation

The algorithm above can be implemented using a nested while loop.

C++

```cpp
#include <stack>

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
    vector<int> iterativePostorderTraversal(TreeNode *root) {
        vector<int> result;
        stack<TreeNode *> stack;
        TreeNode *current = root;

        // Iterate until the current node is null and the stack is empty
        while (current || !stack.empty()) {

            // Traverse the left subtree and push nodes twice into the
            // stack
            while (current) {
                stack.push(current);

                // Push the node twice to indicate it's not yet processed
                stack.push(current);
                current = current->left;
            }

            // Retrieve the top node from the stack
            current = stack.top();
            stack.pop();

            // Check if the next node on top of the stack is the same as
            // the current node If yes, it means the right subtree of the
            // current node hasn't been processed yet
            if (!stack.empty() && current == stack.top()) {

                // Move to the right subtree
                current = current->right;
            }

            // Otherwise, the right subtree has been processed and we can
            // add the current node to the result list and set current to
            // null
            else {

                // Add the value of the current node to the result
                result.push_back(current->val);

                // Set current to nullptr to avoid revisiting the node
                current = nullptr;
            }

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
    public List<Integer> iterativePostorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        TreeNode current = root;

        // Iterate until the current node is null and the stack is empty
        while (current != null || !stack.isEmpty()) {

            // Traverse the left subtree and push nodes twice into the
            // stack
            while (current != null) {
                stack.push(current);

                // Push the node twice to indicate it's not yet processed
                stack.push(current);
                current = current.left;
            }

            // Retrieve the top node from the stack
            current = stack.pop();

            // Check if the next node on top of the stack is the same as
            // the current node If yes, it means the right subtree of the
            // current node hasn't been processed yet
            if (!stack.isEmpty() && current == stack.peek()) {

                // Move to the right subtree
                current = current.right;
            }

            // Otherwise, the right subtree has been processed and we can
            // add the current node to the result list and set current to
            // null
            else {

                // Add the value of the current node to the result
                result.add(current.val);

                // Set current to null to avoid revisiting the node
                current = null;
            }

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
    iterativePostorderTraversal(root: TreeNode | null): number[] {
        const result: number[] = [];
        const stack: (TreeNode | null)[] = [];
        let current: TreeNode | null = root;

        // Iterate until the current node is null and the stack is empty
        while (current || stack.length > 0) {

            // Traverse the left subtree and push nodes twice into the
            // stack
            while (current) {
                stack.push(current);

                // Push the node twice to indicate it's not yet processed
                stack.push(current);
                current = current.left;
            }

            // Retrieve the top node from the stack
            current = stack.pop()!;

            // Check if the next node on top of the stack is the same as
            // the current node If yes, it means the right subtree of the
            // current node hasn't been processed yet
            if (
                stack.length > 0 &&
                current === stack[stack.length - 1]
            ) {

                // Move to the right subtree
                current = current.right;
            }

            // Otherwise, the right subtree has been processed and we can
            // add the current node to the result list and set current to
            // null
            else {

                // Add the value of the current node to the result
                result.push(current.val);

                // Set current to null to avoid revisiting the node
                current = null;
            }

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
    iterativePostorderTraversal(root) {
        const result = [];
        const stack = [];
        let current = root;

        // Iterate until the current node is null and the stack is empty
        while (current || stack.length > 0) {

            // Traverse the left subtree and push nodes twice into the
            // stack
            while (current) {
                stack.push(current);

                // Push the node twice to indicate it's not yet processed
                stack.push(current);
                current = current.left;
            }

            // Retrieve the top node from the stack
            current = stack.pop();

            // Check if the next node on top of the stack is the same as
            // the current node If yes, it means the right subtree of the
            // current node hasn't been processed yet
            if (
                stack.length > 0 &&
                current === stack[stack.length - 1]
            ) {

                // Move to the right subtree
                current = current.right;
            }

            // Otherwise, the right subtree has been processed and we can
            // add the current node to the result list and set current to
            // null
            else {

                // Add the value of the current node to the result
                result.push(current.val);

                // Set current to null to avoid revisiting the node
                current = null;
            }
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

// Diagram: from typing import Optional, List

class Solution:
    def iterative_postorder_traversal(
        self, root: Optional[TreeNode]
    ) -> List[int]:
        result: List[int] = []
        stack: List[TreeNode] = []
        current: Optional[TreeNode] = root

        # Iterate until the current node is None and the stack is empty
        while current or stack:

            # Traverse the left subtree and push nodes twice into the
            # stack
            while current:
                stack.append(current)

                # Push the node twice to indicate it's not yet processed
                stack.append(current)
                current = current.left

            # Retrieve the top node from the stack
            current = stack.pop()

            # Check if the next node on top of the stack is the same as
            # the current node. If yes, it means the right subtree of the
            # current node hasn't been processed yet
            if stack and current == stack[-1]:

                # Move to the right subtree
                current = current.right

            # Otherwise, the right subtree has been processed and we can
            # add the current node to the result list and set current to
            # null
            else:

                # Add the value of the current node to the result
                result.append(current.val)

                # Set current to None to avoid revisiting the node
                current = None

        return result
```

## Complexity Analysis

Looking at the logic, it is easy to understand that the number of computational operations in the iterative version of postorder traversal is directly proportional to the number of nodes in a tree, as every node is visited only once. Since we are also using a stack to store the references to nodes, we have a space complexity directly proportional to the length of the tree's longest root-to-leaf path (height).

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

# Iterative postorder traversal

## Problem Statement

Fundamental

Given the **root** of a binary tree, write a function to return an array containing all the nodes in the order in which they would appear in a postorder traversal.

You must do this **iteratively**.

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
#include <stack>

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
    vector<int> iterativePostorderTraversal(TreeNode *root) {
        vector<int> result;
        stack<TreeNode *> stack;
        TreeNode *current = root;

        // Iterate until the current node is null and the stack is empty
        while (current || !stack.empty()) {

            // Traverse the left subtree and push nodes twice into the
            // stack
            while (current) {
                stack.push(current);

                // Push the node twice to indicate it's not yet processed
                stack.push(current);
                current = current->left;
            }

            // Retrieve the top node from the stack
            current = stack.top();
            stack.pop();

            // Check if the next node on top of the stack is the same as
            // the current node If yes, it means the right subtree of the
            // current node hasn't been processed yet
            if (!stack.empty() && current == stack.top()) {

                // Move to the right subtree
                current = current->right;
            }

            // Otherwise, the right subtree has been processed and we can
            // add the current node to the result list and set current to
            // null
            else {

                // Add the value of the current node to the result
                result.push_back(current->val);

                // Set current to nullptr to avoid revisiting the node
                current = nullptr;
            }
        }

        return result;
    }
};
```

***

# Understanding level order traversal

Level order traversal is a way of traversing a tree, where we traverse one level at a time. The nodes in the tree are traversed from top to bottom, from left to right.

// Diagram: Lever Order Traversal

> Level order traversal follows the following order:
>
> 1.  Process level 0
> 2.  Process level 1
> 3.  ...
> 4.  ...

## Example

Level order traversal is straightforward and easy to visualize. To understand it better, let's look at a simple binary tree as an example.

// Diagram: Level Order Traversal Example

## Algorithm

Level order traversal is implemented quite differently than all the other traversals we have seen. It has a non-recursive implementation that uses a `queue` data structure. The traversal is the same as a **Breadth First Search** in a graph that follows exactly the same order.

// Diagram: Level Order Traversal Algorithm

> **Algorithm**
>
> -   **Step 1:** Create a queue and a list of lists called \`levels\` to store all the levels of the tree.
> -   **Step 2:** Add the \`root\` node to the queue.
> -   **Step 3:** While the queue is not empty, do the following:
>     -   **Step 3.1:** Store the queue size (also the size of the current level) in a variable \`levelSize\`.
>     -   **Step 3.2:** Iterate over this level using the \`levelSize\` and do the following:
>         -   **Step 3.2.1:** Pop the first node from the queue and process it.
>         -   **Step 3.2.2:** If the \`left\` child of the popped node is not \`null\`, add it to the queue.
>         -   **Step 3.2.3:** If the \`right\` child of the popped node is not \`null\`, add it to the queue.
>         -   **Step 3.2.4:** Decrement the \`size\` by \`1\`.
>     -   **Step 3.3:** Add the processed level to the \`levels\` list.

## Implementation

C++

```cpp
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

// Diagram: using namespace std;

class Solution {
public:
    vector<vector<int>> levelOrderTraversal(TreeNode *root) {

        // Create a queue to perform level-order traversal
        queue<TreeNode *> queue;

        // Create a vector to store the final result
        vector<vector<int>> levels;

        // If the tree is empty, return an empty result
        if (root == nullptr) {
            return levels;
        }

        // Start the traversal by pushing the root node into the queue
        queue.push(root);

        // Perform level-order traversal using the queue
        while (!queue.empty()) {

            // Get the number of nodes in the current level
            int levelSize = queue.size();

            // Create a vector to store the nodes in the current level
            vector<int> level;

            // Process all nodes in the current level
            for (int i = 0; i < levelSize; i++) {

                // Get the front node from the queue
                TreeNode *node = queue.front();

// Diagram: queue.pop();

                // Add the value of the current node to the level vector
                level.push_back(node->val);

                // Add the left child of the current node to the queue if
                // it exists
                if (node->left) {
                    queue.push(node->left);
                }

                // Add the right child of the current node to the queue
                // if it exists
                if (node->right) {
                    queue.push(node->right);
                }

            // Add the current level vector to the levels vector
            levels.push_back(level);
        }

        // Return the final result after completing the traversal
        return levels;
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
    public List<List<Integer>> levelOrderTraversal(TreeNode root) {

        // Create a queue to perform level-order traversal
        Queue<TreeNode> queue = new LinkedList<>();

        // Create a list to store the final result
        List<List<Integer>> levels = new ArrayList<>();

        // If the tree is empty, return an empty result
        if (root == null) {
            return levels;
        }

        // Start the traversal by adding the root node into the queue
        queue.add(root);

        // Perform level-order traversal using the queue
        while (!queue.isEmpty()) {

            // Get the number of nodes in the current level
            int levelSize = queue.size();

            // Create a list to store the nodes in the current level
            List<Integer> level = new ArrayList<>();

            // Process all nodes in the current level
            for (int i = 0; i < levelSize; i++) {

                // Get the front node from the queue
                TreeNode node = queue.poll();

                // Add the value of the current node to the level list
                level.add(node.val);

                // Add the left child of the current node to the queue if
                // it exists
                if (node.left != null) {
                    queue.add(node.left);
                }

                // Add the right child of the current node to the queue
                // if it exists
                if (node.right != null) {
                    queue.add(node.right);
                }

            // Add the current level list to the levels list
            levels.add(level);
        }

        // Return the final result after completing the traversal
        return levels;
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
    levelOrderTraversal(root: TreeNode | null): number[][] {

        // Create a queue to perform level-order traversal
        const queue: TreeNode[] = [];

        // Create an array to store the final result
        const levels: number[][] = [];

        // If the tree is empty, return an empty result
        if (!root) {
            return levels;
        }

        // Start the traversal by pushing the root node into the queue
        queue.push(root);

        // Perform level-order traversal using the queue
        while (queue.length > 0) {

            // Get the number of nodes in the current level
            const levelSize = queue.length;

            // Create an array to store the nodes in the current level
            const level: number[] = [];

            // Process all nodes in the current level
            for (let i = 0; i < levelSize; i++) {

                // Get the front node from the queue
                const node = queue.shift()!;

                // Add the value of the current node to the level array
                level.push(node.val);

                // Add the left child of the current node to the queue if
                // it exists
                if (node.left) {
                    queue.push(node.left);
                }

                // Add the right child of the current node to the queue
                // if it exists
                if (node.right) {
                    queue.push(node.right);
                }

            // Add the current level array to the levels array
            levels.push(level);
        }

        // Return the final result after completing the traversal
        return levels;
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
    levelOrderTraversal(root) {

        // Create a queue to perform level-order traversal
        const queue = [];

        // Create an array to store the final result
        const levels = [];

        // If the tree is empty, return an empty result
        if (!root) {
            return levels;
        }

        // Start the traversal by pushing the root node into the queue
        queue.push(root);

        // Perform level-order traversal using the queue
        while (queue.length > 0) {

            // Get the number of nodes in the current level
            const levelSize = queue.length;

            // Create an array to store the nodes in the current level
            const level = [];

            // Process all nodes in the current level
            for (let i = 0; i < levelSize; i++) {

                // Get the front node from the queue
                const node = queue.shift();

                // Add the value of the current node to the level array
                level.push(node.val);

                // Add the left child of the current node to the queue if
                // it exists
                if (node.left) {
                    queue.push(node.left);
                }

                // Add the right child of the current node to the queue
                // if it exists
                if (node.right) {
                    queue.push(node.right);
                }

            // Add the current level array to the levels array
            levels.push(level);
        }

        // Return the final result after completing the traversal
        return levels;
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

from queue import Queue
from typing import List, Optional

class Solution:
    def level_order_traversal(
        self, root: Optional[TreeNode]
    ) -> List[List[int]]:

        # Create a queue to perform level-order traversal
        queue = Queue()

        # Create a list to store the final result
        levels = []

        # If the tree is empty, return an empty result
        if not root:
            return levels

        # Start the traversal by pushing the root node into the queue
        queue.put(root)

        # Perform level-order traversal using the queue
        while not queue.empty():

            # Get the number of nodes in the current level
            level_size = queue.qsize()

            # Create a list to store the nodes in the current level
            level = []

            # Process all nodes in the current level
            for _ in range(level_size):

                # Get the front node from the queue
                node = queue.get()

                # Add the value of the current node to the level list
                level.append(node.val)

                # Add the left child of the current node to the queue if
                # it exists
                if node.left:
                    queue.put(node.left)

                # Add the right child of the current node to the queue if
                # it exists
                if node.right:
                    queue.put(node.right)

            # Add the current level list to the levels list
            levels.append(level)

        # Return the final result after completing the traversal
        return levels
```

## Complexity Analysis

Looking at the logic, it is easy to understand that the number of computational operations in level-order traversal is directly proportional to the number of nodes in a tree, as every node is visited only once. Since we also use a queue to store the references to nodes, our space complexity is directly proportional to the maximum number of nodes in a level.

> **Best Case** - H is the height of the tree
>
> -   Space Complexity - **O(2^H)**
> -   Time Complexity - **O(N)**
>
> **Worst Case** - H is the height of the tree
>
> -   Space Complexity - **O(2^H)**
> -   Time Complexity - **O(N)**

***

# Level order traversal

## Problem Statement

Fundamental

Given the **root** of a binary tree, write a function to return an array of arrays containing all the nodes in the order they would appear in a level-order traversal.

Level order traversal of a tree is a traversal of the tree from left to right, level by level.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** \[\[1\], \[2, 3\], \[4, 7\]\]
> -   **Explanation:** This is the level order traversal as per the above diagram.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\]
> -   **Output:** \[\[1\], \[8, 4\], \[2, 7\]\]
> -   **Explanation:** This is the level order traversal as per the above diagram.

## Solution

```cpp
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

class Solution {
public:
    vector<vector<int>> levelOrderTraversal(TreeNode *root) {

        // Create a queue to perform level-order traversal
        queue<TreeNode *> queue;

        // Create a vector to store the final result
        vector<vector<int>> levels;

        // If the tree is empty, return an empty result
        if (root == nullptr) {
            return levels;
        }

        // Start the traversal by pushing the root node into the queue
        queue.push(root);

        // Perform level-order traversal using the queue
        while (!queue.empty()) {

            // Get the number of nodes in the current level
            int levelSize = queue.size();

            // Create a vector to store the nodes in the current level
            vector<int> level;

            // Process all nodes in the current level
            for (int i = 0; i < levelSize; i++) {

                // Get the front node from the queue
                TreeNode *node = queue.front();

                queue.pop();

                // Add the value of the current node to the level vector
                level.push_back(node->val);

                // Add the left child of the current node to the queue if
                // it exists
                if (node->left) {
                    queue.push(node->left);
                }

                // Add the right child of the current node to the queue
                // if it exists
                if (node->right) {
                    queue.push(node->right);
                }
            }

            // Add the current level vector to the levels vector
            levels.push_back(level);
        }

        // Return the final result after completing the traversal
        return levels;
    }
};
```
