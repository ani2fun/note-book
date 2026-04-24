# Pattern: Preorder traversal (Stateful)

## Table of Contents

1. [Understanding the stateful preorder traversal pattern](#pattern-preorder-traversal-stateful)
2. [Identifying the stateful preorder traversal pattern](#identifying-the-stateful-preorder-traversal-pattern)
3. [Duplicates in path](#duplicates-in-path)
4. [Second minimum](#second-minimum)
5. [Left view](#left-view)
6. [Right view](#right-view)

***

# Understanding the stateful preorder pattern

Preorder traversal follows the node-left-right processing sequence, where we process a node as we enter it and repeat the process recursively for both its left and right subtree. Because a node is processed before its left and right subtrees, the preorder traversal is ideal for solving problems where data must be processed and passed down from parent to child nodes. The child nodes then process the data they receive from their parent and pass it down to their children.

The stateful preorder pattern is a classification of problems that can be solved using the stateful preorder traversal technique.

// Diagram: The order of processing of nodes in preorder traversal.

In this lesson, we will learn more about using the stateful preorder traversal to solve binary tree problems and how to identify a problem as a preorder pattern problem.

## The stateful preorder traversal technique

Consider we are given a binary tree, and to process a node, we need the aggregated value of a function `f` over all nodes in the path from the root node to the given node. The aggregated value may be big, and passing its copy from parent to child may not be feasible.

// Diagram: Process every node using the aggregated value of function f over nodes in the path from the root node to itself.

The stateful solution to the problem uses a slightly modified implementation of preorder traversal, where the same copy of the aggregated value is shared between all nodes. This requires some post-processing after the preorder traversal for a node has finished.

We create a variable `aggregate` in the calling function and initialize it with a default value to hold the aggregated value of the function `f` over the nodes in the path from the root to the current node. We then start the preorder traversal from the root passing `aggregate` as a reference, and as we enter a node, we use the value of `aggregate` to process this node. Finally, we add the contribution of the current node to `aggregate` using the function `f` and continue the preorder traversal to the left and right subtree.

// Diagram: Process a child node using the aggregated value passed down from the parent.

This way, every node gets the aggregated value of the function `f` over all the nodes in the path from the root node to itself for processing. Once both the left and right subtrees of a node have been processed and we backtrack to a node, we use the inverse of the function `f` to remove the contribution of the node from `aggregate`. This ensures that `aggregate` always only has the contributions of nodes in the path from the root to the current node and not any nodes below it.

In this example, we passed `aggregate` a reference to the preorder function to share it between all nodes, but for cases where the variable cannot be passed as a reference, we can create global variables in the enclosing scope.

// Diagram: Process nodes with the aggregated value of f over the root to node path

## Algorithm

The generic algorithm given below uses preorder traversal to process every node by using the aggregated value of a function `f` over all nodes in the path from the root node to the node.

> **Algorithm**
>
> -   **Step 1:** Create a variable \`aggregate\` and initialize it with a default value
> -   **Step 2:** Call \`preorder(root, aggregate)\`
>
> **preorder(node, \[ref\] aggregate)**
>
> -   **Step 1:** If this is a \`null\` node return
> -   **Step 2:** Use the value of \`aggregate\` to process this node
> -   **Step 3:** Use the function \`f\` to add the contribution of \`node.val\` to \`aggregate\`
> -   **Step 4:** Call \`preorder(node.left, aggregate)\`
> -   **Step 5:** Call \`preorder(node.right, aggregate)\`
> -   **Step 6:** Use the inverse of function \`f\` to remove the contribution of \`node.val\` from \`aggregate\`.

## Implementation

The implementation of the stateful preorder technique is given below. The preorder function is separate from the calling function as we create all the state variables (`aggregate`) in the calling function and pass it to the preorder function by reference, which then uses/updates it to solve the problem. For cases where variables cannot be passed as references, we create global variables in the enclosing class scope. This is done so that all stack frames in the preorder function share the same copy of state variables.

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

        // Initialize aggregate with a default value
        int aggregate = 0;

        // Traverse the binary tree in preorder traversal
        preorder(root, aggregate);

        // Return the aggregated value
        return aggregate;
    }
    void preorder(TreeNode *node, int& aggregate) {

        if (!node) {
            // Return if this is a null node;
            return;
        }

        // Process the node with aggregate value
        // Replace this with actual implementation
        // .

        // Add contribution of current node
        aggregate = f(aggregate, node->val);

        // Continue the preorder traversal
        preorder(node->left, aggregate);
        preorder(node->right, aggregate);

        // Remove the contribution of the current node
        aggregate = fInverse(aggregate, node->val);

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
    // Declare aggregate as a class-level variable
    private int aggregate;

    public int callingFunction(TreeNode root) {
        // Initialize aggregate with a default value
        aggregate = 0;

        // Traverse the binary tree in preorder traversal
        preorder(root);

        // Return the aggregated value
        return aggregate;
    }

    private void preorder(TreeNode node) {
        if (node == null) {
            // Return if this is a null node
            return;
        }

        // Process the node with aggregate value
        // Replace this with actual implementation
        // .

        // Add contribution of current node
        aggregate = f(aggregate, node.val);

        // Continue the preorder traversal
        preorder(node.left);
        preorder(node.right);

        // Remove the contribution of the current node
        aggregate = fInverse(aggregate, node->val);
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
  private aggregate: number = 0; // Class-level variable for aggregate

  callingFunction(root: TreeNode | null): number {
    // Reset aggregate before traversal
    this.aggregate = 0;

    // Traverse the binary tree in preorder traversal
    this.preorder(root);

    // Return the aggregated value
    return aggregate;
  }

  private preorder(node: TreeNode | null): void {
    if (!node) {
      // Return if this is a null node
      return;
    }

    // Process the node with aggregate value
    // Replace this with actual implementation
    // .

    // Add contribution of current node
    this.aggregate = this.f(this.aggregate, node.val);

    // Continue the preorder traversal
    this.preorder(node.left);
    this.preorder(node.right);

    // Remove the contribution of the current node
    this.aggregate = this.fInverse(this.aggregate, node.val);
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
  aggregate = 0; // Class-level variable for aggregate

  callingFunction(root) {
    // Reset aggregate before traversal
    this.aggregate = 0;

    // Traverse the binary tree in preorder traversal
    this.preorder(root);

    // Return the aggregated value
    return aggregate;
  }

  preorder(node) {
    if (!node) {
      // Return if this is a null node
      return;
    }

    // Process the node with aggregate value
    // Replace this with actual implementation
    // .

    // Add contribution of current node
    this.aggregate = this.f(this.aggregate, node.val);

    // Continue the preorder traversal
    this.preorder(node.left);
    this.preorder(node.right);

    // Remove the contribution of the current node
    this.aggregate = this.fInverse(this.aggregate, node.val);
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

class TreeNode:
    def __init__(self, val: int = 0, left: Optional["TreeNode"] = None, right: Optional["TreeNode"] = None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def __init__(self):
        # Initialize aggregate as a class-level variable
        self.aggregate = 0

    def calling_function(self, root: Optional[TreeNode]) -> int:

        # Reset aggregate before traversal
        self.aggregate = 0

        # Traverse the binary tree in preorder traversal
        self.preorder(root)

        # Return the aggregated value
        return aggregate;

    def preorder(self, node: Optional[TreeNode]) -> None:
        if not node:
            # Return if this is a null node;
            return

        # Process the node with aggregate value
        # Replace this with actual implementation
        # .

        # Add contribution of current node
        self.aggregate = self.f(self.aggregate, node.val)

        # Continue the preorder traversal
        self.preorder(node.left)
        self.preorder(node.right)

        # Remove the contribution of the current node
        self.aggregate = self.f_inverse(self.aggregate, node.val)
```

### Complexity Analysis

It is quite easy to figure out the time and space complexity of the solution. We traverse the entire tree using the preorder traversal that takes linear **O(N)** time, and apply the function `f` on every node. And so, the overall time complexity depends on the time complexity of the function `f`. Considering it is a constant time **O(1)** operation, the overall time complexity is linear **O(N)** in any case.

The space complexity of preorder traversal depends on the maximum size of the function call stack, which can be linear **O(N)** if the tree is a degenerate binary tree where every node only has one child and **O(log(N))** if it is a complete binary tree. We only create one extra variable `aggregate` and since all stack frames share that, it only makes a constant contribution.

> **Best Case:** Complete binary tree
>
> -   Space Complexity - **O(log(N))**
> -   Time Complexity - **O(N)**
>
> **Worst Case:** Degenerate binary tree
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Identifying the stateful preorder traversal pattern

The stateful preorder traversal technique can solve a wide variety of binary tree problems. These are generally**easy** or **medium**problems where we need to process every node using the aggregated value of some function `f` over all the nodes in the path from the root node to itself, and also update some state variable shared between all nodes with the aggregated value using some function `g` as we traverse. In most cases, the final values of the state variables at the end of preorder traversal are the solution to such problems.

If the problem statement or its solution follows the generic template below, it can be solved by applying the stateful preorder traversal technique.

**Template:**Given a binary tree, process every node using the aggregated value of a function `f` over all nodes in the path from the root node to itself. The same copy of the aggregated value must be shared between all nodes.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the stateful preorder traversal technique.

> **Problem statement:** Given a binary tree, find the number of nodes in the tree that have at least one other node with the same value in the path from the root node to itself.

// Diagram: Find the number of nodes with duplicates in root to node path

## The stateful preorder traversal technique

We can solve this problem by using preorder traversal if we maintain a hash map that stores the frequency of all values in the path from the root node to any node. While processing any node during the preorder traversal, we can use this frequency map to determine if this node is a duplicate or not.

The problem description fits the generic template from the stateful preorder traversal pattern we learned earlier.

**Template:**Given a binary tree, process every node using the aggregated value of a function `f` (frequency of unique values) over all nodes in the path from the root node to itself. The same copy of the aggregated value(frequency map) must be shared between all nodes.

We create a frequency map `frequency` in the calling function to store the frequency of all values in the path from the root node to any node. We also create another variable `duplicates` to count the number of duplicate nodes in a path and initialize it with 0. We then start the preorder traversal from the root node, passing `frequency` and `duplicates` as a reference so that the same copy is shared between all the nodes. We can create these variables as global variables in the enclosing scope for languages that do not support passing by reference.

To process a node, we check the `frequency` map to check if the node's value was seen before in the path from the root node to itself. If the frequency is greater than 0, it means this node is a duplicate, and we increment the value of `duplicate`. Otherwise, we do nothing.

We then add the contribution of the current node to the `frequency` map by incrementing its frequency by 1 and continue the preorder traversal to the left and right nodes. Before exiting a node, we decrement the node's frequency from the `frequency` map to ensure that the map always contains the frequency of only the nodes in the path from the root node to the current node.

This way, at the end of the preorder traversal, the `frequency` map will be empty, and the variable `duplicates` will have the number of nodes that have duplicates in the path from the root node to themselves.

// Diagram: Find the number of nodes with duplicates in root to node path

The implementation of the stateful preorder traversal technique to solve the problem is given below.

C++

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

// Diagram: using namespace std;

class Solution {
public:

    // Map to track frequency of values in the current root-to-node path
    unordered_map<int, int> frequency;

    // Counter to track how many nodes have duplicates in their path
    int duplicates = 0;

// Diagram: void duplicatesInPathHelper(TreeNode root) {

        // If the root is null, return
        if (root == nullptr) {
            return;
        }

        // Check if the current node's value already exists in the path
        if (frequency.count(root->val)) {

            // If it does, it's a duplicate
            duplicates++;
        }

        // Add the current node's value to the frequency map
        frequency[root->val]++;

        // Recursively traverse the left and right subtrees
        duplicatesInPathHelper(root->left);
        duplicatesInPathHelper(root->right);

        // Backtrack: remove the current node's value from the path
        frequency[root->val]--;

        // If frequency becomes zero, erase the value from the map
        if (frequency[root->val] == 0) {
            frequency.erase(root->val);
        }

// Diagram: int duplicatesInPath(TreeNode root) {

        // If the tree is empty, return 0 as there are no paths
        if (root == nullptr) {
            return 0;
        }

        // Start the helper function from the root
        duplicatesInPathHelper(root);

        // Return the total duplicates found
        return duplicates;
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

// Diagram: class Solution {

    // Map to track frequency of values in the current root-to-node path
    private Map<Integer, Integer> frequency = new HashMap<>();

    // Counter to track how many nodes have duplicates in their path
    private int duplicates = 0;

// Diagram: public void duplicatesInPathHelper(TreeNode root) {

        // If the root is null, return
        if (root == null) {
            return;
        }

        // Check if the current node's value already exists in the path
        if (frequency.containsKey(root.val)) {

            // If it does, it's a duplicate
            duplicates++;
        }

        // Add the current node's value to the frequency map
        frequency.put(root.val, frequency.getOrDefault(root.val, 0) + 1);

        // Recursively traverse the left and right subtrees
        duplicatesInPathHelper(root.left);
        duplicatesInPathHelper(root.right);

        // Backtrack: remove the current node's value from the path
        frequency.put(root.val, frequency.get(root.val) - 1);

        // If frequency becomes zero, erase the value from the map
        if (frequency.get(root.val) == 0) {
            frequency.remove(root.val);
        }

// Diagram: public int duplicatesInPath(TreeNode root) {

        // If the tree is empty, return 0 as there are no paths
        if (root == null) {
            return 0;
        }

        // Start the helper function from the root
        duplicatesInPathHelper(root);

        // Return the total duplicates found
        return duplicates;
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

    // Map to track frequency of values in the current root-to-node path
    frequency: Map<number, number> = new Map();

    // Counter to track how many nodes have duplicates in their path
    duplicates: number = 0;

// Diagram: duplicatesInPathHelper(root: TreeNode | null): void {

        // If the root is null, return
        if (root === null) {
            return;
        }

        // Check if the current node's value already exists in the path
        if (this.frequency.has(root.val)) {

            // If it does, it's a duplicate
            this.duplicates++;
        }

        // Add the current node's value to the frequency map
        this.frequency.set(
            root.val,
            (this.frequency.get(root.val) || 0) + 1
        );

        // Recursively traverse the left and right subtrees
        this.duplicatesInPathHelper(root.left);
        this.duplicatesInPathHelper(root.right);

        // Backtrack: remove the current node's value from the path
        this.frequency.set(root.val, this.frequency.get(root.val)! - 1);

        // If frequency becomes zero, erase the value from the map
        if (this.frequency.get(root.val) === 0) {
            this.frequency.delete(root.val);
        }

// Diagram: duplicatesInPath(root: TreeNode | null): number {

        // If the tree is empty, return 0 as there are no paths
        if (root === null) {
            return 0;
        }

        // Start the helper function from the root
        this.duplicatesInPathHelper(root);

        // Return the total duplicates found
        return this.duplicates;
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

    // Map to track frequency of values in the current root-to-node path
    frequency = new Map();

    // Counter to track how many nodes have duplicates in their path
    duplicates = 0;

// Diagram: duplicatesInPathHelper(root) {

        // If the root is null, return
        if (root === null) {
            return;
        }

        // Check if the current node's value already exists in the path
        if (this.frequency.has(root.val)) {

            // If it does, it's a duplicate
            this.duplicates++;
        }

        // Add the current node's value to the frequency map
        this.frequency.set(
            root.val,
            (this.frequency.get(root.val) || 0) + 1
        );

        // Recursively traverse the left and right subtrees
        this.duplicatesInPathHelper(root.left);
        this.duplicatesInPathHelper(root.right);

        // Backtrack: remove the current node's value from the path
        this.frequency.set(root.val, this.frequency.get(root.val) - 1);

        // If frequency becomes zero, erase the value from the map
        if (this.frequency.get(root.val) === 0) {
            this.frequency.delete(root.val);
        }

// Diagram: duplicatesInPath(root) {

        // If the tree is empty, return 0 as there are no paths
        if (root === null) {
            return 0;
        }

        // Start the helper function from the root
        this.duplicatesInPathHelper(root);

        // Return the total duplicates found
        return this.duplicates;
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

// Diagram: from typing import Optional, Dict

class Solution:
    def __init__(self):

        # Map to track frequency of values in the current root-to-node
        # path
        self.frequency: Dict[int, int] = {}

        # Counter to track how many nodes have duplicates in their path
        self.duplicates: int = 0

    def duplicates_in_path_helper(
        self, root: Optional[TreeNode]
    ) -> None:

        # If the root is null, return
        if root is None:
            return

        # Check if the current node's value already exists in the path
        if root.val in self.frequency:

            # If it does, it's a duplicate
            self.duplicates += 1

        # Add the current node's value to the frequency map
        self.frequency[root.val] = self.frequency.get(root.val, 0) + 1

        # Recursively traverse the left and right subtrees
        self.duplicates_in_path_helper(root.left)
        self.duplicates_in_path_helper(root.right)

        # Backtrack: remove the current node's value from the path
        self.frequency[root.val] -= 1

        # If frequency becomes zero, erase the value from the map
        if self.frequency[root.val] == 0:
            del self.frequency[root.val]

    def duplicates_in_path(self, root: Optional[TreeNode]) -> int:

        # If the tree is empty, return 0 as there are no paths
        if root is None:
            return 0

        # Start the helper function from the root
        self.duplicates_in_path_helper(root)

        # Return the total duplicates found
        return self.duplicates
```

The stateful preorder traversal can solve this problem in linear time and a single pass using a concise recursive implementation.

## Example problems

Most problems that fall under this category are**easy**problems; a list of a few is given below.

> -   **[Duplicates in path](https://www.codeintuition.io/courses/binary-tree/qcVrX0a45Hzs9LFOvKGJC)**
> -   **[Second minimum](https://www.codeintuition.io/courses/binary-tree/TfRLsk3DvvZZ4eLX6_KC2)**
> -   **[Left view](https://www.codeintuition.io/courses/binary-tree/VQ3XEsi4ixZAvArd_50Yf)**
> -   **[Right view](https://www.codeintuition.io/courses/binary-tree/VN5y0nj9hrbaH50Yr7DP3)**

We will now solve these problems to understand the stateful preorder traversal technique better.

***

# Duplicates in path

## Problem Statement

Given the **root** of a binary tree, write a function that returns the number of nodes in the tree where the path from the root to that node contains another node with the same value.

### Example 1

> -   **Input:** root = \[21, 21, 3, 5, 2, null, 3\]
> -   **Output:** 2
> -   **Explanation:** As shown in the diagram above, there are two nodes whose root-to-node paths contain at least one other node with the same value.

### Example 2

> -   **Input:** root = \[5, 7, 3, 1, 2, null, 8\]
> -   **Output:** 0
> -   **Explanation:** There are no nodes whose root-to-node paths contain at least one other node with the same value.

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

    // Map to track frequency of values in the current root-to-node path
    unordered_map<int, int> frequency;

    // Counter to track how many nodes have duplicates in their path
    int duplicates = 0;

    void duplicatesInPathHelper(TreeNode *root) {

        // If the root is null, return
        if (root == nullptr) {
            return;
        }

        // Check if the current node's value already exists in the path
        if (frequency.count(root->val)) {

            // If it does, it's a duplicate
            duplicates++;
        }

        // Add the current node's value to the frequency map
        frequency[root->val]++;

        // Recursively traverse the left and right subtrees
        duplicatesInPathHelper(root->left);
        duplicatesInPathHelper(root->right);

        // Backtrack: remove the current node's value from the path
        frequency[root->val]--;

        // If frequency becomes zero, erase the value from the map
        if (frequency[root->val] == 0) {
            frequency.erase(root->val);
        }
    }

    int duplicatesInPath(TreeNode *root) {

        // If the tree is empty, return 0 as there are no paths
        if (root == nullptr) {
            return 0;
        }

        // Start the helper function from the root
        duplicatesInPathHelper(root);

        // Return the total duplicates found
        return duplicates;
    }
};
```

***

# Second minimum

## Problem Statement

Given the **root** of a binary tree, write a function to find and return the **second minimum value** in the tree. If there is no second minimum value, return `-1`.

### Example 1

> -   **Input:** root = \[1, 2, 5, 7, null, null, 3\]
> -   **Output:** 2
> -   **Explanation:** The second minimum value in the given tree is 2.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 9, 7\]
> -   **Output:** 4
> -   **Explanation:** The second minimum value in the given tree is 4.

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

    // Global variables to store minimum and second minimum values
    int minimum;
    int secondMinimum;

    void findSecondMinimumHelper(TreeNode *root) {

        // Base case: if the root is null, return
        if (root == nullptr) {
            return;
        }

        // Check if the value of the current node is less than the
        // current minimum
        if (root->val < minimum) {

            // Update the second minimum to the previous minimum
            secondMinimum = minimum;

            // Update the minimum to the value of the current node
            minimum = root->val;
        } else if (root->val > minimum && (root->val < secondMinimum || secondMinimum == -1)) {

            // Check if the value of the current node is greater than the
            // current minimum and less than the current second minimum
            // (or second minimum is not yet set) If so, update the
            // second minimum to the value of the current node
            secondMinimum = root->val;
        }

        // Recursively traverse the left and right subtrees
        findSecondMinimumHelper(root->left);
        findSecondMinimumHelper(root->right);
    }

    int findSecondMinimum(TreeNode *root) {

        // Check if the root is null, return -1 as no second minimum
        // exists
        if (root == nullptr) {
            return -1;
        }

        // Initialize the minimum to the value of the root node
        minimum = root->val;

        // Initialize the second minimum to -1, indicating it has not
        // been set yet
        secondMinimum = -1;

        // Call the helper function to find the minimum and second
        // minimum values
        findSecondMinimumHelper(root);

        // Return the second minimum value found
        return secondMinimum;
    }
};
```

***

# Left view

## Problem Statement

Given the **root** of a binary tree, write a function to return a list representing how it would look from top to bottom when viewed from its left side.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7, 9\]
> -   **Output:** \[1, 2, 4, 9\]
> -   **Explanation:** The only nodes visible in the given tree when viewed from the left and top to bottom are shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\]
> -   **Output:** \[1, 8, 2\]
> -   **Explanation:** The only nodes visible in the given tree when viewed from the left and top to bottom are shown in the diagram above.

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

    // Global variable to keep track of the current level during
    // recursion
    int maxLevelReached = 0;

    void lefViewHelper(TreeNode *root, int level, vector<int> &result) {
        if (!root) {
            return;
        }

        // If this is the first node of the current level, add it to
        // result
        if (level == maxLevelReached) {
            result.push_back(root->val);

            // Increment the level after adding the node to result
            maxLevelReached++;
        }

        // Recur for left, then right (ensures leftmost nodes are visited
        // first)
        lefViewHelper(root->left, level + 1, result);
        lefViewHelper(root->right, level + 1, result);
    }

    vector<int> leftView(TreeNode *root) {

        // Stores the left view of the binary tree
        vector<int> result;

        // Find the left view of the binary tree
        lefViewHelper(root, 0, result);

        // Return the left view of the binary tree
        return result;
    }
};
```

***

# Left view

***

# Right view

## Problem Statement

Given the **root** of a binary tree, write a function to return a list representing how it would look from top to bottom when viewed from its right side.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7, 9\]
> -   **Output:** \[1, 3, 7, 9\]
> -   **Explanation:** The only nodes visible in the given tree when viewed from top to bottom from the right side are shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\]
> -   **Output:** \[1, 4, 7\]
> -   **Explanation:** The only nodes visible in the given tree when viewed from top to bottom from the right side are shown in the diagram above.

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

    // Global variable to keep track of the current level during
    // recursion
    int maxLevelReached = 0;

    void rightViewHelper(
        TreeNode *root,
        int level,
        vector<int> &result
    ) {
        if (!root) {
            return;
        }

        // If this is the first node of the current level, add it to
        // result
        if (level == maxLevelReached) {
            result.push_back(root->val);

            // Increment the level after adding the node to result
            maxLevelReached++;
        }

        // Recur for right, then left (ensures rightmost nodes are
        // visited first)
        rightViewHelper(root->right, level + 1, result);
        rightViewHelper(root->left, level + 1, result);
    }

    vector<int> rightView(TreeNode *root) {

        // Stores the right view of the binary tree
        vector<int> result;

        // Find the right view of the binary tree
        rightViewHelper(root, 0, result);

        // Return the right view of the binary tree
        return result;
    }
};
```

***

# Right view
