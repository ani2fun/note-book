# Pattern: Postorder traversal (Stateful)

## Table of Contents

1. [Understanding the stateful postorder traversal pattern](#understanding-the-stateful-postorder-traversal-pattern)
2. [Identifying the stateful postorder traversal pattern](#identifying-the-stateful-postorder-traversal-pattern)
3. [Diameter of tree](#diameter-of-tree)
4. [Descendants sum count](#descendants-sum-count)
5. [Distribute coins](#distribute-coins)
6. [Most frequent subtree sum](#most-frequent-subtree-sum)
7. [Longest monotonic path](#longest-monotonic-path)
8. [Monotonic subtree count](#monotonic-subtree-count)
9. [Path sum count](#path-sum-count)

***

# Understanding the stateful postorder traversal pattern

The stateless postorder traversal can only share data between nodes by passing a copy of processed values up from the child nodes to the parent node. However, there are some problems where, to process a node, we may also need to read or update some state variables that can be accessed from all nodes. The stateful postorder traversal is ideal for solving such problems, as the same copy data is shared between all nodes throughout the traversal, which can be read or updated when returned values from the left and right subtrees are aggregated in a node.

The stateful postorder traversal pattern is a classification of problems that can be solved using the stateful postorder traversal technique.

// Diagram: The order of processing of nodes in postorder traversal

In this lesson, we will learn more about using the stateful postorder traversal technique to solve binary tree problems and how to identify a problem as a postorder pattern problem.

## The stateful postorder traversal technique

Consider we are given a binary tree, and to process a node, we need the aggregated value of a function `f` over all the nodes in its subtree, and also update a state variable `state` that is shared between all the nodes using the aggregated value and a function `g`.

// Diagram: Update using and

We only need to do a slight modification to the postorder traversal technique. We can either pass the state variables as references to the postorder function call or create global variables in the enclosing scope so that they are shared across all nodes. For this example, we will pass the state variables as a reference.

We create a variable `state` in the calling function and initialize it with some default value. We then start the postorder traversal from the root node and pass the variable `state` as a reference. When processing a node, we store the values returned by the left and right subtrees in local variables `left` and `right` and aggregate them with the contribution of the current node using the function `f` in another local variable `aggregate`. We then update the value of the variable `state` using `aggregate` and function `g` and pass back the aggregated value `aggregate` to the parent node.

This way, at the end of postorder traversal, every node in the tree is processed with the aggregated value of the function `f` over all nodes in its subtree, and the state variable `state` is updated with each processed value. Also, the aggregated value of the function `f` over all nodes in the tree is returned from the postorder call since the top-level node is the root node.

// Diagram: Stateful postorder traversal using function f and g

### Algorithm

The generic algorithm given below uses postorder traversal to process every node by using the aggregated value of a function `f` over all nodes in its subtree while also updating the state variable `state` every time.

The state variable is passed as a reference in this example, but for cases when that is not possible, the state variables can be created as globals in the enclosing  scope.

> **Algorithm**
>
> -   **Step 1:** Create a state variable \`state\` and initialize it to a default value
> -   **Step 2:** Call \`postorder(root, state)\`
>
> **postorder(node, \[ref\] state)**
>
> -   **Step 1:** If this is a \`null\` node, return a default value
> -   **Step 2:** \`left\` = Call \`postorder(node.left, state)\`
> -   **Step 3:** \`right\` = Call \`postorder(node.right, state)\`
> -   **Step 4:** Aggregate all values together: \`aggregate = \`f(left, right, node.val)\`
> -   **Step 5:** \`state\` = \`g(state, aggregate)\`
> -   **Step 5:** Return \`aggregate\`

### Implementation

The implementation of the stateful postorder traversal technique is given below. We create the state variables (`state` in this case) in the calling function and pass them to the postorder function call as a reference. However, every node has its own copy of the local variables `left`, `right` and `aggregate` that are unaffected by execution in other nodes.

For languages where we cannot pass the state variables as references, we create them as global variables in the enclosing scope to share them between all nodes.

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
    int callingFunction(TreeNode* root) {

        // Initialize state variable with a default value
        int state = 0;

        // Traverse the binary tree in postorder passing state variable as reference
        postorder(root, state);

    }
    int postorder(TreeNode *node, int& state) {

        if (!node) {
            // Return if this is a null node;
            return 0;
        }

        // Pass the new aggregated value down
        int left = postorder(node->left);
        int right = postorder(node->right);

        // Process the node with left and right values
        // Replace this with actual implementation
        // .

        // Add contribution of current node
        int aggregate = f(left, right, node->val);

        // Update the state variable
        state = g(state, aggregate);

        // Pass back the aggregated value to the parent node
        return aggregate;

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
    // Class variable to maintain shared state across all nodes
    private int state = 0;

    public void callingFunction(TreeNode root) {
        // Initialize state variable with a default value
        state = 0;

        // Traverse the binary tree in postorder, updating state variable
        postorder(root);
    }

    private int postorder(TreeNode node) {
        if (node == null) {
            // Return if this is a null node;
            return 0;
        }

        // Pass the new aggregated value down
        int left = postorder(node.left);
        int right = postorder(node.right);

        // Process the node with left and right values
        // Replace this with actual implementation
        // .

        // Add contribution of the current node
        int aggregate = f(left, right, node.val);

        // Update the shared state variable
        state = g(state, aggregate);

        // Pass back the aggregated value to the parent node
        return aggregate;
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
  private state: number = 0; // Class-level variable to be shared across all nodes

  callingFunction(root: TreeNode | null): void {
    // Initialize state variable with a default value
    this.state = 0;

    // Traverse the binary tree in postorder passing state as a class-level variable
    this.postorder(root);
  }

  private postorder(node: TreeNode | null): number {
    if (!node) {
      // Return if this is a null node;
      return 0;
    }

    // Pass the new aggregated value down
    const left = this.postorder(node.left);
    const right = this.postorder(node.right);

    // Process the node with left and right values
    // Replace this with actual implementation
    // .

    // Add contribution of current node
    const aggregate = this.f(left, right, node.val);

    // Update the state variable
    this.state = this.g(this.state, aggregate);

    // Pass back the aggregated value to the parent node
    return aggregate;
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
  state = 0; // Class-level variable to be shared across all nodes

  callingFunction(root) {
    // Initialize state variable with a default value
    this.state = 0;

    // Traverse the binary tree in postorder passing state as a class-level variable
    this.postorder(root);
  }

  postorder(node) {
    if (!node) {
      // Return if this is a null node;
      return 0;
    }

    // Pass the new aggregated value down
    const left = this.postorder(node.left);
    const right = this.postorder(node.right);

    // Process the node with left and right values
    // Replace this with actual implementation
    // .

    // Add contribution of current node
    const aggregate = this.f(left, right, node.val);

    // Update the state variable
    this.state = this.g(this.state, aggregate);

    // Pass back the aggregated value to the parent node
    return aggregate;
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
    def __init__(self):
        # Initialize state variable as a class-level attribute
        self.state = 0

    def calling_function(self, root: Optional[TreeNode]) -> None:
        # Reset state before traversal
        self.state = 0

        # Traverse the binary tree in postorder
        self.postorder(root)

    def postorder(self, node: Optional[TreeNode]) -> int:
        if not node:
            # Return if this is a null node;
            return 0

        # Pass the new aggregated value down
        left = self.postorder(node.left)
        right = self.postorder(node.right)

        # Process the node with left and right values
        # Replace this with actual implementation
        # .

        # Add contribution of current node
        aggregate = self.f(left, right, node.val)

        # Update the state variable
        self.state = self.g(self.state, aggregate)

        # Pass back the aggregated value to the parent node
        return aggregate
```

### Complexity Analysis

It is quite easy to figure out the time and space complexity of the solution. We traverse the entire tree using the postorder traversal that takes linear **O(N)** time and apply the function `f` on every node. And so, the overall time complexity depends on the time complexity of the function `f`. Considering it is a constant time **O(1)** operation, the overall time complexity is linear **O(N)** in any case.

The space complexity of postorder traversal depends on the maximum size of the function call stack, which can be linear **O(N)** if the tree is a degenerate binary tree where every node only has one child and **O(log(N))** if it is a height-balanced binary tree. There is only one shared copy of state variables, which only makes a constant contribution to the entire run, so we can ignore it. Each stack frame also creates its copy of local variables, but each of them only makes a constant contribution to the size of the frame, so the overall space complexity is the same as the space required for the stack frames.

> **Best Case:** Height balanced binary tree
>
> -   Space Complexity - **O(log(N))**
> -   Time Complexity - **O(N)**
>
> **Worst Case:** Degenerate tree
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Identifying the stateful postorder traversal pattern

The stateful postorder traversal technique is very versatile and can solve a wide variety of binary tree problems. These are generally **easy** or **medium** problems where we need to process every node using an aggregated value of some function `f`  applied to its left and right subtrees, and also update some state variable shared between all nodes with the aggregated value as we traverse. A combination of the aggregated value at the root and the state variables is generally the solution to these problems.

If the problem statement or its solution follows the generic template below, it can be solved by applying the stateful postorder traversal technique.

**Template:**Given a binary tree, process every node using the aggregated value of a function `f` applied to its left and right subtrees. The processing of a leaf node or a `null` reference should be trivial, meaning it should have a known solution.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the stateful postorder traversal technique.

> **Problem statement:** Given the root of a binary tree, write a function to calculate and return the diameter of this tree
>
> The diameter of a binary tree is the longest distance between any two nodes in the tree, whether or not they pass through the root. The distance here is defined by the number of edges in the path.

// Diagram: Find the diameter of a binary tree.

### The stateful postorder traversal technique

The diameter of a tree is the length of the longest leaf-to-leaf path in the tree. And so, if for every node, we find the length of the longest leaf-to-leaf path passing through it, the diameter will be the maximum among these values. Let's consider the example below to understand this better.

// Diagram: The longest leaf-to-leaf path passing through every node in the binary tree.

As we will see shortly, we can compute the length of the longest leaf-to-leaf path passing through a node if we know the heights of its left and right subtrees. The height of a node in a binary tree is the number of edges from the node to the most distant leaf node in its subtree. The height of a node can be recursively computed by getting the maximum between the height of the node's left and right subtrees and adding one to it. Consider the following example where we have the height of every node in the binary tree from the example.

// Diagram: The height of a node is the max of height of its left and right subtree plus 1

It is easy to see now that the length of the longest leaf-to-leaf path passing through a node is just the sum of the heights of the left and right subtrees.

// Diagram: The length of the longest leaf-to-leaf path passing through a node is the sum of the heights of its left and right subtrees.

Consider the following example where we have the length of the longest leaf-to-leaf path passing through every node in the binary tree from the example.

// Diagram: The length of the longest leaf-to-leaf path passing through a node is the sum of the heights of its left and right subtrees.

This means if every node passes to its parent the height of the subtree starting at itself the parent can use the values it receives from its left and right child nodes to calculate its height as well as the length of the longest leaf-to-leaf path passing through it which can potentially be the diameter of the entire tree. The height of a `null` reference is 0, which makes the height of the leaf node to be 1.

This fits the generic template from the stateful postorder traversal pattern we learned earlier.

**Template:**Given a binary tree, process every node using the aggregated value of a function `f` (max height) over all the node-to-leaf paths in the subtree starting at that node while updating some shared state (`diameter`) variables. The processing of a leaf or `null` node should be trivial, meaning it should have a known solution (0 for `null` node).

We initialize a state variable `diameter` with 0 in the calling function and start the postorder traversal from the root node, passing it as a reference. For languages where passing by reference is not supported, the variable can be created as a global variable in the enclosing scope.

To understand how postorder traversal solves this problem better, we must look at it as a bottom-up execution. The postorder traversal from the root node recursively traverses to the left until it reaches a leaf node for which both the left and right subtrees are `null` references. Hitting a `null` reference is the base case for this recursive execution, where we return 0  back up to the leaf node as the height of the `null` node is 0.

The zero values received from the left and right `null` references are then used to process the leaf node by adding them together to get the length of the longest leaf-to-leaf path passing through the leaf node and updating the shared variable `diameter` if the calculated value is greater. Finally, the height of the leaf node is calculated by taking the maximum of the height of the left and right subtrees and adding one to it, which is then passed back up to the parent. The parent node gets the height value from both the left and right subtrees and repeats the same process to calculate the length of the longest leaf-to-leaf path passing through it, updating `diameter` if needed and calculating and passing back up the height of the current node.

// Diagram: Every node uses the height of its left and right subtrees to calculate its height and the longest leaf-to-leaf path passing through it.

This way, at every node, we calculate and compare the longest leaf-to-leaf pass going through it with every other leaf-to-leaf path seen so far (`diameter`). At the end of the postorder traversal, the value returned to the calling function from the root node will be the height of the binary tree, which we don't care about but `diameter` will have the longest leaf-to-leaf path in the tree, which is the diameter of the tree.

It is important to note that when moving from bottom to top, the value passed back up to the parent is the height of a subtree, which is only used to calculate a derived value (longest leaf-to-leaf path) that is a potential solution. So, the final value returned from the postorder call is not the solution, but the shared variable `diameter` that holds the maximum of these derived values.

// Diagram: Find the diameter of the binary tree

The implementation of the stateful postorder traversal technique to solve the problem is given below.

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

    // Global variable to calculate the diameter of the tree
    int diameter = 0;
    int heightOfBinaryTree(TreeNode *root) {
        if (!root) {
            return 0;
        }

        // Calculate the height of the left and right subtrees
        // recursively
        int leftHeight = heightOfBinaryTree(root->left);
        int rightHeight = heightOfBinaryTree(root->right);

        // Update the diameter if the sum of the left and right subtree
        // heights is greater
        diameter = max(diameter, leftHeight + rightHeight);

        // Return the height of the current subtree
        // (maximum height of left or right subtree + 1)
        return max(leftHeight, rightHeight) + 1;
    }

// Diagram: int diameterOfTree(TreeNode root) {

        // Call the helper function to calculate the height of the tree
        // and update the diameter
        heightOfBinaryTree(root);

        return diameter;
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

    // Global variable to calculate the diameter of the tree
    private int diameter = 0;

    private int heightOfBinaryTree(TreeNode root) {
        if (root == null) {
            return 0;
        }

        // Calculate the height of the left and right subtrees
        // recursively
        int leftHeight = heightOfBinaryTree(root.left);
        int rightHeight = heightOfBinaryTree(root.right);

        // Update the diameter if the sum of the left and right subtree
        // heights is greater
        diameter = Math.max(diameter, leftHeight + rightHeight);

        // Return the height of the current subtree
        // (maximum height of left or right subtree + 1)
        return Math.max(leftHeight, rightHeight) + 1;
    }

// Diagram: public int diameterOfTree(TreeNode root) {

        // Call the helper function to calculate the height of the tree
        // and update the diameter
        heightOfBinaryTree(root);

        return diameter;
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

    // Global variable to calculate the diameter of the tree
    diameter: number = 0;

    heightOfBinaryTree(root: TreeNode | null): number {
        if (!root) {
            return 0;
        }

        // Calculate the height of the left and right subtrees
        // recursively
        const leftHeight = this.heightOfBinaryTree(root.left);
        const rightHeight = this.heightOfBinaryTree(root.right);

        // Update the diameter if the sum of the left and right subtree
        // heights is greater
        this.diameter = Math.max(
            this.diameter,
            leftHeight + rightHeight
        );

        // Return the height of the current subtree
        // (maximum height of left or right subtree + 1)
        return Math.max(leftHeight, rightHeight) + 1;
    }

// Diagram: diameterOfTree(root: TreeNode | null): number {

        // Call the helper function to calculate the height of the tree
        // and update the diameter
        this.heightOfBinaryTree(root);

        return this.diameter;
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

    // Global variable to calculate the diameter of the tree
    diameter = 0;

    heightOfBinaryTree(root) {
        if (!root) {
            return 0;
        }

        // Calculate the height of the left and right subtrees
        // recursively
        let leftHeight = this.heightOfBinaryTree(root.left);
        let rightHeight = this.heightOfBinaryTree(root.right);

        // Update the diameter if the sum of the left and right subtree
        // heights is greater
        this.diameter = Math.max(
            this.diameter,
            leftHeight + rightHeight
        );

        // Return the height of the current subtree
        // (maximum height of left or right subtree + 1)
        return Math.max(leftHeight, rightHeight) + 1;
    }

// Diagram: diameterOfTree(root) {

        // Call the helper function to calculate the height of the tree
        // and update the diameter
        this.heightOfBinaryTree(root);

        return this.diameter;
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
    def __init__(self):

        # Global variable to calculate the diameter of the tree
        self.diameter: int = 0

    def height_of_binary_tree(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0

        # Calculate the height of the left and right subtrees recursively
        left_height = self.height_of_binary_tree(root.left)
        right_height = self.height_of_binary_tree(root.right)

        # Update the diameter if the sum of the left and right subtree
        # heights is greater
        self.diameter = max(self.diameter, left_height + right_height)

        # Return the height of the current subtree
        # (maximum height of left or right subtree + 1)
        return max(left_height, right_height) + 1

    def diameter_of_tree(self, root: Optional[TreeNode]) -> int:

        # Call the helper function to calculate the height of the tree
        # and update the diameter
        self.height_of_binary_tree(root)

        return self.diameter
```

The stateful postorder traversal can solve this problem in linear time and a single pass using a very small and concise recursive implementation.

## Example problems

Most problems that fall under this category are**easy**problems; a list of a few is given below.

> -   **[Diameter of tree](https://www.codeintuition.io/courses/binary-tree/7D8VO_D2WFnGmlT79LtgS)**
> -   **[Descendants sum count](https://www.codeintuition.io/courses/binary-tree/S5Y6lSa1lt4BCUZvax1oG)**
> -   **[Distribute coins](https://www.codeintuition.io/courses/binary-tree/EuGerHj4zNCQdgmrr9vyj)**
> -   **[Most frequent subtree sum](https://www.codeintuition.io/courses/binary-tree/ncT-fWMEeb7ABVZkjDTm2)**
> -   **[Longest monotonic path](https://www.codeintuition.io/courses/binary-tree/4_trmpij9BcM0n8FshxtK)**
> -   **[Monotonic subtree count](https://www.codeintuition.io/courses/binary-tree/Sf3T-qYepqF81QX_Ndmtf)**
> -   **[Path sum count](https://www.codeintuition.io/courses/binary-tree/wi9NlYyXoH_1CPoQGSPu4)**

We will now solve these problems to understand the stateful postorder traversal technique better.

***

# Diameter of tree

## Problem Statement

Given the **root** of a binary tree, write a function to calculate and return the **diameter** of this tree.

The diameter of a binary tree is the longest distance between any two nodes in the tree, whether or not they pass through the root. The distance here is defined by the number of edges in the path.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** 4
> -   **Explanation:** The diameter of the above tree is shown in the diagram.

### Example 2

> -   **Input:** root = \[1, 8, 4, 9, null, 2, 7\]
> -   **Output:** 4
> -   **Explanation:** The diameter of the above tree is shown in the diagram.

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

    // Global variable to calculate the diameter of the tree
    int diameter = 0;

    int heightOfBinaryTree(TreeNode *root) {
        if (!root) {
            return 0;
        }

        // Calculate the height of the left and right subtrees
        // recursively
        int leftHeight = heightOfBinaryTree(root->left);
        int rightHeight = heightOfBinaryTree(root->right);

        // Update the diameter if the sum of the left and right subtree
        // heights is greater
        diameter = max(diameter, leftHeight + rightHeight);

        // Return the height of the current subtree
        // (maximum height of left or right subtree + 1)
        return max(leftHeight, rightHeight) + 1;
    }

    int diameterOfTree(TreeNode *root) {

        // Call the helper function to calculate the height of the tree
        // and update the diameter
        heightOfBinaryTree(root);

        return diameter;
    }
};
```

***

# Descendants sum count

## Problem Statement

Given the **root** of a binary tree, write a function to find and return the number of nodes in the tree where the value of the node is equal to the sum of the values of its descendants. 

Descendants of node **x** are all the nodes that lie in the subtree where **x** is the root node. The sum is considered `0` if the node has no descendants.

### Example 1

> -   **Input:** root = \[21, 7, 3, 5, 2, null, 4\]
> -   **Output:** 2
> -   **Explanation:** The root node and node with value 7 are the only two nodes whose value is equal to the sum of its descendants.

### Example 2

> -   **Input:** root = \[5, 7, 3, 1, 2, null, 3\]
> -   **Output:** 1
> -   **Explanation:** The node with value 3 at level 2 is the only one whose value is equal to the sum of its descendants.

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
    int count = 0;

    int computeSum(TreeNode *root) {

        // Base case: If the current node is NULL, return 0
        if (!root) {
            return 0;
        }

        // Recursively compute the sum of the left and right subtrees
        int leftSum = computeSum(root->left);
        int rightSum = computeSum(root->right);

        // If the value of the current node is equal to the sum of its
        // descendants, increment the count
        if (root->val == leftSum + rightSum) {
            count++;
        }

        // Return the sum of the current subtree, including the value
        // of the current node
        return leftSum + rightSum + root->val;
    }

    int descendantsSumCount(TreeNode *root) {

        // Call the computeSum function to count the number of nodes
        // satisfying the given condition
        computeSum(root);
        return count;
    }
};
```

***

# Distribute coins

## Problem Statement

Given the **root** of a binary tree with **n** nodes, each node of the tree has a `node.val` amount of coins. There are a total of **n** coins throughout the tree. We can move by choosing two adjacent nodes and moving one coin from one node to another. A move can be made from parent to child or child to parent. Write a function to return the minimum number of moves required to make every node have exactly one coin.

### Example 1

> -   **Input:** root = \[1, 2, 0\]
> -   **Output:** 2
> -   **Explanation:** In the first move, we move the coin from the root node to the right child, and in the second move, we move one coin from the left child to the root.

### Example 2

> -   **Input:** root = \[0, 3, 0\]
> -   **Output:** 3
> -   **Explanation:** In the first move, we move a coin from the left node to the root node; in the second move, we move the coin in the root node to the right child, and in the third move, we move a coin from the left node to the root.

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

    // Declare moves as a global variable outside the Solution class
    int moves = 0;

    int balanceCoins(TreeNode *root) {

        // base case: return 0 if the node is null
        if (!root) {
            return 0;
        }

        // recursively calculate the excess values for the left and
        // right subtrees
        int leftExcess = balanceCoins(root->left);
        int rightExcess = balanceCoins(root->right);

        // calculate the excess value for the current node
        int excess = leftExcess + rightExcess + root->val - 1;

        // add the absolute value of excess values for left and right
        // subtrees to the total moves
        moves += abs(leftExcess) + abs(rightExcess);
        return excess;
    }

    int distributeCoins(TreeNode *root) {

        // call balanceCoins function to calculate the excess values and
        // update the global moves variable
        balanceCoins(root);

        // return the total moves required
        return moves;
    }
};
```

***

# Most frequent subtree sum

## Problem Statement

Given the **root** of a binary tree, write a function that finds and returns the most frequent subtree sum in this tree. If there is more than one such sum, return the values of all of them in **any order**.

The subtree sum of a node is the total sum of all the values in its subtree, including its own value.

### Example 1

> -   **Input:** root = \[1, 2, 3\]
> -   **Output:** \[6, 2, 3\]
> -   **Explanation:** All the subtree sums have a frequency of 1.

### Example 2

> -   **Input:** root = \[3, 8, 2, 1, null, 1, 6\]
> -   **Output:** \[1, 9\]
> -   **Explanation:** The subtree sums of 1 and 9 have a frequency of 2, which is the highest.

## Solution

```cpp
#include <unordered_map>

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

    // Stores frequency of each subtree sum
    unordered_map<int, int> freq;

    // Tracks the highest frequency
    int maxFreq = 0;

    int computeSubtreeSum(TreeNode *root) {

        // Base case: return 0 for null nodes
        if (!root) {
            return 0;
        }

        // Compute subtree sum recursively (postorder)
        int leftSum = computeSubtreeSum(root->left);
        int rightSum = computeSubtreeSum(root->right);
        int subtreeSum = root->val + leftSum + rightSum;

        // Update frequency map
        freq[subtreeSum]++;

        // Track max frequency
        maxFreq = max(maxFreq, freq[subtreeSum]);

        return subtreeSum;
    }

    vector<int> mostFrequentSubtreeSum(TreeNode *root) {

        // Handle empty tree case
        if (!root) {
            return {};
        }

        computeSubtreeSum(root);

        // Collect all subtree sums with max frequency
        vector<int> result;
        for (auto &[sum, count] : freq) {
            if (count == maxFreq) {
                result.push_back(sum);
            }
        }

        return result;
    }
};
```

***

# Longest monotonic path

## Problem Statement

Given the **root** of a binary tree, write a function that finds and returns the longest monotonic path. The path does not have to go through the root and can be any path in the tree.

 A monotonic path is a path where all the nodes' values are the same.

### Example 1

> -   **Input:** root = \[1, 2, 5, 7, null, null, 3\]
> -   **Output:** 0
> -   **Explanation:** The given tree does not have any monotonic path.

### Example 2

> -   **Input:** root = \[3, 8, 1, 8, null, 1, 1\]
> -   **Output:** 2
> -   **Explanation:** The tree has two monotonic paths, as shown in the diagram above, and the longest one has a length of 2.

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

    // Global variable to keep track of max length
    int maxLength = 0;

    int longestMonotonicPathHelper(TreeNode *root) {
        if (!root) {
            return 0;
        }

        // Recursively calculate the longest univalued path in the left
        // subtree
        int leftLength = longestMonotonicPathHelper(root->left);

        // Recursively calculate the longest univalued path in the right
        // subtree
        int rightLength = longestMonotonicPathHelper(root->right);

        int leftArrow = 0;
        int rightArrow = 0;

        // If the left child exists and has the same value as the current
        // node, extend the path to the left
        if (root->left && root->left->val == root->val) {
            leftArrow = leftLength + 1;
        }

        // If the right child exists and has the same value as the
        // current node, extend the path to the right
        if (root->right && root->right->val == root->val) {
            rightArrow = rightLength + 1;
        }

        // Update the maxLength if the combined path length is greater
        maxLength = max(maxLength, leftArrow + rightArrow);

        // Return the longest univalued path from the current node
        return max(leftArrow, rightArrow);
    }

    int longestMonotonicPath(TreeNode *root) {
        longestMonotonicPathHelper(root);
        return maxLength;
    }
};
```

***

# Monotonic subtree count

## Problem Statement

Given the **root** of a binary tree, write a function that finds and returns the number of monotonic subtrees in this tree.

A monotonic subtree is a subtree in the tree where all the nodes have the same value.

### Example 1

> -   **Input:** root = \[1, 1, 5, 1, null, null, 5\]
> -   **Output:** 4
> -   **Explanation:** The tree has four monotonic subtrees. Two of these are leaf nodes with values 1 and 5, while the other two are subtrees \[1, 1, null\] and \[5, null, 5\].

### Example 2

> -   **Input:** root = \[3, 8, 1, 8, null, 1, 1\]
> -   **Output:** 5
> -   **Explanation:** The tree has five monotonic subtrees. Three of these are leaf nodes with values 8, 1 and 1, while the other two are subtrees \[8, 8, null\] and \[1, 1, 1\].

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

    // To store the number of monotonic subtrees
    int subtreeCount = 0;

    bool isMonotonicSubtree(TreeNode *root) {

        // An empty node is trivially monotonic
        if (!root) {
            return true;
        }

        // Check if the left child is monotonic
        bool leftMonotonic = isMonotonicSubtree(root->left);

        // Check if the right child is monotonic
        bool rightMonotonic = isMonotonicSubtree(root->right);

        // If either left or right subtree is not monotonic, return false
        if (!leftMonotonic || !rightMonotonic) {
            return false;
        }

        // If the left child exists and does not have the same value,
        // return false
        if (root->left && root->left->val != root->val) {
            return false;
        }

        // If the right child exists and does not have the same value,
        // return false
        if (root->right && root->right->val != root->val) {
            return false;
        }

        // This node and its children form a monotonic subtree
        subtreeCount++;
        return true;
    }

    int monotonicSubtreeCount(TreeNode *root) {
        isMonotonicSubtree(root);
        return subtreeCount;
    }
};
```

***

# Path sum count

## Problem Statement

Given the **root** of a binary tree and a **target**, write a function to find and return the number of paths in the tree where the sum of the nodes in the path is equal to the target. 

The path does not need to go through the root. It can be any path within the tree. However, the path must follow a top-to-bottom direction (moving only from parent to child) and cannot change direction (i.e., no U-shaped paths).

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\], target = 11
> -   **Output:** 1
> -   **Explanation:** The given tree contains a single path that sums to 11, as shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\], targetSum = 11
> -   **Output:** 1
> -   **Explanation:** The given tree contains a single path that sums to 11, as shown in the diagram above.

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

    // Create a map to store the count of prefix sums encountered
    // so far
    unordered_map<int, int> prefixSumCount;

    int findPaths(TreeNode *root, int target, int pathSum) {

        // Base case: If the node is nullptr, we've reached the end of a
        // path, so return 0.
        if (root == nullptr) {
            return 0;
        }

        // Calculate the current sum by adding the value of the
        // current node to the previous sum.
        pathSum += root->val;

        // Check if there is a prefix sum (pathSum - target) in the
        // prefixSumCount map. If such a prefix sum exists, it means
        // there is a subpath with the target sum ending at the current
        // node. Increment the count of such subpaths.
        int numPaths = prefixSumCount[pathSum - target];

        // Add the current sum to the prefixSumCount map to keep track of
        // it. This is to be used by future nodes in the recursive
        // traversal.
        prefixSumCount[pathSum]++;

        // Recursively traverse the left and right subtrees, updating the
        // current sum and counting the subpaths.
        numPaths += findPaths(root->left, target, pathSum);
        numPaths += findPaths(root->right, target, pathSum);

        // Backtrack by removing the current sum from the prefix sum
        // count map.This is to ensure that the prefix sum count is
        // accurate for future nodes.
        prefixSumCount[pathSum]--;

        // Return the total number of subpaths with the target sum found
        // so far.
        return numPaths;
    }

    int pathSumCount(TreeNode *root, int target) {

        // Add initial prefix sum of 0
        prefixSumCount[0] = 1;

        // Start the recursive traversal from the root node with an
        // initial sum of 0
        return findPaths(root, target, 0);
    }
};
```
