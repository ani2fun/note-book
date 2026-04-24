# Pattern: Level order traversal

## Table of Contents

1. [Understanding the level order traversal pattern](#understanding-the-level-order-traversal-pattern)
2. [Identifying the level order traversal pattern](#identifying-the-level-order-traversal-pattern)
3. [Level sum](#level-sum)
4. [Deepest leaves sum](#deepest-leaves-sum)
5. [Complete binary tree](#complete-binary-tree)
6. [Zigzag traversal](#zigzag-traversal)
7. [Cousin check](#cousin-check)

***

# Understanding the level order traversal pattern

The level order traversal starts from the top of the binary tree and processes all nodes from left to right in a level before doing the same for the subsequent level. Because all nodes of a level are processed before moving on to the next level, the level order traversal is ideal for solving problems where we need to apply some function on all nodes of a level, one level at a time. Moreover, since nodes at a level are processed from left to right, we also solve problems where the processing of subsequent nodes at a level depends on the processing of previous nodes at the same level.

The level order traversal pattern is a classification of problems that can be solved using the level order traversal technique.

// Diagram: The order of processing of nodes in level order traversal.

## The level order traversal technique

Consider we are given a binary tree, and for all levels in the tree, we need the aggregated value of a function `f` over all nodes in a level. The aggregates for each level are further aggregated using some function `g` to return a single value.

// Diagram: Aggregate all nodes in a level over function f and return the aggregated value over function g

The level order traversal technique can easily solve this problem. We create a `queue` to hold tree nodes for level order traversal and initialize a variable `aggregate` that will store the aggregated value of aggregates of all levels with some default value.

We start the traversal by adding the root node and iterating until `queue` is empty. At the beginning of each iteration, all nodes in the queue belong to the same level, and the size of the queue is the number of nodes at that level. We create a variable `levelSize` to store the current size of the queue and initialize a variable `levelAggregate` with a default value. We then iterate `levelSize` times, and in each iteration, pop an item from the front of `queue`, add its contribution to `levelAggregate` using the function `f` , and then add both its left and right children to the end of `queue`. This way, at the end of this internal iteration, `levelAggregate` will have the aggregated value of `f` over all the nodes of the level and `queue` will have all nodes of the next level. We then add the contribution of `levelAggregate` to `aggregate` using the function `g`. This process is repeated until `queue` becomes empty and level order traversal is finished.

At the end of all iterations, `levelAggregate` will have held the aggregated value of the function `f` over all nodes of each level and `aggregate` will have the aggregated value of all such aggregates over the function `g`.

// Diagram: Aggregate all nodes in a level over function f and return the aggregated value over function g

## Algorithm

The generic algorithm given below uses the level order traversal to find the aggregated value of a function `f` over all nodes in a level for all levels. All these aggregates are then aggregated into a single value using the function `g`.

> **Algorithm**
>
> -   **Step 1:** Create a variable \`aggregate\` to store the aggregated value of level aggregates
> -   **Step 2:** Create a \`queue\` for level order traversal and push the root node to it
> -   **Step 3:** Iterate while the \`queue\` is not empty and do the following:
>     -   **Step 3.1:** Initialize a variable \`levelSize\` with the size of the queue
>     -   **Step 3.2:** Initialize a variable \`levelAggregate\` with a default value
>     -   **Step 3.4:** Iterate \`levelSize\` times and do the following:
>         -   **Step 3.4.1:** Pop a \`node\` from the queue
>         -   **Step 3.4.2:** Add the contribution of \`node\` to \`levelAggregate\` using the function \`f\`
>         -   **Step 3.4.3:** Push the left child of \`node\` to \`queue\` if it exists
>         -   **Step 3.4.4:** Push the right child of \`node\` to \`queue\` if it exists
>     -   **Step 3.5:** Add the contribution of \`levelAggregate\` to \`aggregate\` using the function \`g\`
> -   **Step 4:** Return \`aggregate\`

### Implementation

The implementation of the level order traversal technique is given below. The level order traversal uses a queue and nested loops where the outer loop iterates until the queue is empty, and the inner loop iterates over all nodes of a level.

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

// Diagram: int levelOrder(TreeNode root) {

    // Initialize aggregate with a default value
    int aggregate = 0;

    // Create a queue for level order traversal
    // and add the root node to it
    queue<TreeNode *> queue;
    queue.push(root);

    // Loop through each level in the tree
    while (!queue.empty()) {

        // Get the size of the current level
        int levelSize = queue.size();

        // Initialize levelAggregate to a default value
        int levelAggregate = 0;

        // Loop through each node in the current level
        for (int i = 0; i < levelSize; i++) {

            // Get the node from the front of the queue and pop
            // it from the queue
            TreeNode *node = queue.front();
            queue.pop();

            // Add the contribution of the current node
            // to levelAggregate using the function f
            levelAggregate = f(aggreate, node->val);

            // Add the node's children to the queue if they exist
            if (node->left) {
                queue.push(node->left);
            }

            if (node->right) {
                queue.push(node->right);
            }

        // Add the contribution of the levelAggregate for the
        // current level to aggregate using the function g
        aggregate = g(aggregate, levelAggregate);
    }

    return aggregate;
}
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

// Diagram: class LevelOrder {

    public int levelOrder(TreeNode root) {
        // Initialize aggregate with a default value
        int aggregate = 0;

        // Create a queue for level order traversal
        // and add the root node to it
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);

        // Loop through each level in the tree
        while (!queue.isEmpty()) {

            // Get the size of the current level
            int levelSize = queue.size();

            // Initialize levelAggregate to a default value
            int levelAggregate = 0;

            // Loop through each node in the current level
            for (int i = 0; i < levelSize; i++) {

                // Get the node from the front of the queue and remove it
                TreeNode node = queue.poll();

                // Add the contribution of the current node
                // to levelAggregate using the function f
                levelAggregate = f(levelAggregate, node.val);

                // Add the node's children to the queue if they exist
                if (node.left != null) {
                    queue.add(node.left);
                }

                if (node.right != null) {
                    queue.add(node.right);
                }

            // Add the contribution of the levelAggregate for the
            // current level to aggregate using the function g
            aggregate = g(aggregate, levelAggregate);
        }

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
  levelOrder(root: TreeNode | null): number {
    if (!root) {
      return 0; // Return a default value if the root is null
    }

    // Initialize aggregate with a default value
    let aggregate = 0;

    // Create a queue for level order traversal
    // and add the root node to it
    const queue: TreeNode[] = [];
    queue.push(root);

    // Loop through each level in the tree
    while (queue.length > 0) {
      // Get the size of the current level
      const levelSize = queue.length;

      // Initialize levelAggregate to a default value
      let levelAggregate = 0;

      // Loop through each node in the current level
      for (let i = 0; i < levelSize; i++) {
        // Get the node from the front of the queue and remove it
        const node = queue.shift()!;

        // Add the contribution of the current node
        // to levelAggregate using the function f
        levelAggregate = f(levelAggregate, node.val);

        // Add the node's children to the queue if they exist
        if (node.left) {
          queue.push(node.left);
        }
        if (node.right) {
          queue.push(node.right);
        }

      // Add the contribution of the levelAggregate for the
      // current level to aggregate using the function g
      aggregate = g(aggregate, levelAggregate);
    }

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
  levelOrder(root) {
    if (!root) {
      return 0; // Return a default value if the root is null
    }

    // Initialize aggregate with a default value
    let aggregate = 0;

    // Create a queue for level order traversal
    // and add the root node to it
    const queue = [];
    queue.push(root);

    // Loop through each level in the tree
    while (queue.length > 0) {
      // Get the size of the current level
      const levelSize = queue.length;

      // Initialize levelAggregate to a default value
      let levelAggregate = 0;

      // Loop through each node in the current level
      for (let i = 0; i < levelSize; i++) {
        // Get the node from the front of the queue and remove it
        const node = queue.shift();

        // Add the contribution of the current node
        // to levelAggregate using the function f
        levelAggregate = f(levelAggregate, node.val);

        // Add the node's children to the queue if they exist
        if (node.left) {
          queue.push(node.left);
        }
        if (node.right) {
          queue.push(node.right);
        }

      // Add the contribution of the levelAggregate for the
      // current level to aggregate using the function g
      aggregate = g(aggregate, levelAggregate);
    }

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
    def levelOrder(root: Optional[TreeNode]) -> int:
        # Initialize aggregate with a default value
        aggregate: int = 0

        # Create a queue for level order traversal
        # and add the root node to it
        queue: deque[TreeNode] = deque()

        if root:
            queue.append(root)

        # Loop through each level in the tree
        while queue:

            # Get the size of the current level
            level_size: int = len(queue)

            # Initialize level_aggregate to a default value
            level_aggregate: int = 0

            # Loop through each node in the current level
            for _ in range(level_size):

                # Get the node from the front of the queue and remove it
                node: TreeNode = queue.popleft()

                # Add the contribution of the current node
                # to level_aggregate using the function f
                level_aggregate = f(level_aggregate, node.val)

                # Add the node's children to the queue if they exist
                if node.left:
                    queue.append(node.left)

                if node.right:
                    queue.append(node.right)

            # Add the contribution of the level_aggregate for the
            # current level to aggregate using the function g
            aggregate = g(aggregate, level_aggregate)

        return aggregate
```

### Complexity Analysis

The time and space complexity of the level order traversal technique is quite easy to understand. We traverse the entire tree using the level order traversal that takes linear **O(N)** time and apply the function `f` on every node. And so, the overall time complexity depends on the time complexity of the function `f`. Considering it is a constant time **O(1)** operation, the overall time complexity is linear **O(N)** in any case.

The space complexity of level order traversal depends on the maximum size of the queue, which will be equal to the maximum number of nodes in a level. For a perfect binary tree with **N** nodes, the last level can have **N/2** nodes, and so the worst-case space complexity is linear **O(N)** if the tree is a perfect binary tree. However, in the best case, if we have a degenerate tree, every level only has one node, and so the space complexity is constant **O(1)**. We also create a fixed number of local variables, but each of them only makes a constant contribution to the size, so the overall space complexity is the same as the space required by the queue.

> **Best Case:** Degenerate binary tree
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**
>
> **Worst Case:** Perfect binary tree
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Identifying the level order traversal pattern

The level order traversal can only solve some specific types of binary tree problems. These are generally easy or medium problems where we need to find the aggregate value of some function `f` over all nodes in a level for all levels in the tree. Some problems may require further aggregating the aggregates for each level into a single value using some other function `g`. In some cases, we may also need to maintain some shared state information throughout the traversal, which can be easily done by creating local variables before starting the traversal, as level order traversal is fully iterative and not recursive.

If the problem statement or its solution follows the generic template below, it can be solved using the level order traversal technique.

**Template:**

Given a binary tree, find the aggregate value of a function `f` over all nodes in a level for all the levels in the tree. Further aggregate the aggregates for all the levels into a single value using a function `g`. The processing of a node may require some shared state variables.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using the level order traversal technique.

> **Problem statement:** Given a binary tree, return a list containing the sum of all nodes at each level from top to bottom.

// Diagram: Return the level wise sum of nodes in a binary tree.

## The level order traversal technique

The problem statement fits the template description for the level order traversal pattern that we learned earlier.

**Template:**

Given a binary tree, find the aggregate value of a function `f` (sum) over all nodes in a level for all the levels in the tree. Further, aggregate the aggregates for all the levels into a single value using a function `g` (add to a list).

We create a queue for the level order traversal and a list `levelSums` to store the sum of each level. We then push the root node to `queue` and iterate while the queue is not empty to start the traversal. In each iteration, we store the size of the queue in a variable `levelSize` and initialize a variable `sum` with 0 to aggregate the sum of this level. We then iterate `levelSize` times and, in each iteration, pop a node from the front of the queue and add its value to `sum`. We then push the left and right child nodes of this node to `queue` if they exist. At the end of the inner iterations, we append `sum` to the `levelSums` list.

This way, at the end of level order traversal, the `levelSums` list will have the sum of all nodes in a level for all levels in the binary tree.

// Diagram: Return a list of level-wise sum of nodes of a binary tree

The implementation of the level order traversal technique is given below. Instead of creating the levelSum list in the function, we receive it as a reference from the caller. This does not make any difference to the remaining implementation, as the scope of the `levelSum` variable is still the same, and it is accessible to all nodes when processing them.

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
    vector<int> levelSum(TreeNode *root) {
        vector<int> levelSums;
        if (!root) {
            return levelSums;
        }

        queue<TreeNode *> queue;
        queue.push(root);

        // Loop through each level in the tree
        while (!queue.empty()) {

            // Get the size of the current level
            int levelSize = queue.size();
            int levelSum = 0;

            // Loop through each node in the current level
            for (int i = 0; i < levelSize; i++) {
                TreeNode *node = queue.front();
                queue.pop();

                // Add the node's value to the current level sum
                levelSum += node->val;

                // Add the node's children to the queue if they exist
                if (node->left) {
                    queue.push(node->left);
                }

                if (node->right) {
                    queue.push(node->right);
                }

            // Add the current level sum to the levelSums vector
            levelSums.push_back(levelSum);
        }

        return levelSums;
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
    public List<Integer> levelSum(TreeNode root) {
        List<Integer> levelSums = new ArrayList<>();
        if (root == null) {
            return levelSums;
        }

        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);

        // Loop through each level in the tree
        while (!queue.isEmpty()) {

            // Get the size of the current level
            int levelSize = queue.size();
            int levelSum = 0;

            // Loop through each node in the current level
            for (int i = 0; i < levelSize; i++) {

                // Get the front node in the queue and remove it
                TreeNode node = queue.poll();

                // Add the node's value to the current level sum
                levelSum += node.val;

                // Add the node's children to the queue if they exist
                if (node.left != null) {
                    queue.add(node.left);
                }

                if (node.right != null) {
                    queue.add(node.right);
                }

            // Add the current level sum to the levelSums list
            levelSums.add(levelSum);
        }

        return levelSums;
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
    levelSum(root: TreeNode | null): number[] {
        const levelSums: number[] = [];
        if (!root) {
            return levelSums;
        }

// Diagram: const queue: TreeNode[] = [root];

        // Loop through each level in the tree
        while (queue.length > 0) {

            // Get the size of the current level
            const levelSize = queue.length;
            let levelSum = 0;

            // Loop through each node in the current level
            for (let i = 0; i < levelSize; i++) {

                // Get the front node in the queue and remove it
                const node = queue.shift()!;

                // Add the node's value to the current level sum
                levelSum += node.val;

                // Add the node's children to the queue if they exist
                if (node.left) {
                    queue.push(node.left);
                }

                if (node.right) {
                    queue.push(node.right);
                }

            // Add the current level sum to the levelSums array
            levelSums.push(levelSum);
        }

        return levelSums;
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
    levelSum(root) {
        const levelSums = [];
        if (!root) {
            return levelSums;
        }

// Diagram: const queue = [root];

        // Loop through each level in the tree
        while (queue.length > 0) {

            // Get the size of the current level
            const levelSize = queue.length;
            let levelSum = 0;

            // Loop through each node in the current level
            for (let i = 0; i < levelSize; i++) {

                // Get the front node in the queue and remove it
                const node = queue.shift();

                // Add the node's value to the current level sum
                levelSum += node.val;

                // Add the node's children to the queue if they exist
                if (node.left) {
                    queue.push(node.left);
                }

                if (node.right) {
                    queue.push(node.right);
                }

            // Add the current level sum to the levelSums array
            levelSums.push(levelSum);
        }

        return levelSums;
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
    def level_sum(self, root: Optional[TreeNode]) -> List[int]:
        level_sums: List[int] = []
        if not root:
            return level_sums

        queue = Queue()
        queue.put(root)

        # Loop through each level in the tree
        while not queue.empty():

            # Get the size of the current level
            level_size = queue.qsize()
            level_sum = 0

            # Loop through each node in the current level
            for _ in range(level_size):

                # Get the front node in the queue and remove it
                node = queue.get()

                # Add the node's value to the current level sum
                level_sum += node.val

                # Add the node's children to the queue if they exist
                if node.left:
                    queue.put(node.left)

                if node.right:
                    queue.put(node.right)

            # Add the current level sum to the level_sums list
            level_sums.append(level_sum)

        return level_sums
```

## Example problems

Most problems that fall under this category are**medium**problems. A list of a few is given below.

> -   **[Level sum](https://www.codeintuition.io/courses/binary-tree/9fL3An4CoPeH5uygVkUQh)**
> -   **[Deepest leaves sum](https://www.codeintuition.io/courses/binary-tree/0WFuKutxXjHP8wXGFO9VO)**
> -   **[Complete binary tree](https://www.codeintuition.io/courses/binary-tree/jv2oyC9UyvGM7IiXn-E8j)**
> -   **[Zigzag traversal](https://www.codeintuition.io/courses/binary-tree/Rf5y4h0H5prvgmDUU27SF)**
> -   **[Cousin check](https://www.codeintuition.io/courses/binary-tree/mFim0xWeWp8b9jhB5XPuy)**

We will now solve these problems to understand the stateful root-to-leaf path technique better.

***

# Level sum

## Problem Statement

Given the **root** of a binary tree, write a function to return a list containing the **sum** of all nodes at each level from top to bottom.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** \[1, 5, 11\]
> -   **Explanation:** The sum of all nodes in the first, second, and third levels is 1, 5, and 11 respectively.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\]
> -   **Output:** \[1, 12, 9\]
> -   **Explanation:** The sum of all nodes in the first, second, and third levels is 1, 12, and 9 respectively.

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
    vector<int> levelSum(TreeNode *root) {
        vector<int> levelSums;
        if (!root) {
            return levelSums;
        }

        queue<TreeNode *> queue;
        queue.push(root);

        // Loop through each level in the tree
        while (!queue.empty()) {

            // Get the size of the current level
            int levelSize = queue.size();
            int levelSum = 0;

            // Loop through each node in the current level
            for (int i = 0; i < levelSize; i++) {
                TreeNode *node = queue.front();
                queue.pop();

                // Add the node's value to the current level sum
                levelSum += node->val;

                // Add the node's children to the queue if they exist
                if (node->left) {
                    queue.push(node->left);
                }

                if (node->right) {
                    queue.push(node->right);
                }
            }

            // Add the current level sum to the levelSums vector
            levelSums.push_back(levelSum);
        }

        return levelSums;
    }
};
```

***

# Level sum

***

# Deepest leaves sum

## Problem Statement

Given the **root** of a binary tree, write a function to find and return the sum of the deepest leaves of this tree.

### Example 1

> -   **Input:** root = \[1, 2, 1, 7, null, null, 1\]
> -   **Output:** 8
> -   **Explanation:** The deepest level is level 3 which contains where the sum of leaves nodes is 8.

### Example 2

> -   **Input:** root = \[1, 6, 5, null, null, 2, 7\]
> -   **Output:** 9
> -   **Explanation:** The deepest level is level 3 which contains where the sum of leaves nodes is 9.

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
    int deepestLeavesSum(TreeNode *root) {

        // If the tree is empty, return 0
        if (!root) {
            return 0;
        }

        queue<TreeNode *> queue;
        queue.push(root);

        // Variable to store the levelSum of the deepest leaves
        int levelSum = 0;

        // Loop through each level in the tree
        while (!queue.empty()) {

            // Get the size of the current level
            int levelSize = queue.size();

            // Reset levelSum for the current level
            levelSum = 0;

            // Loop through each node in the current level
            for (int i = 0; i < levelSize; ++i) {

                // Get the front node in the queue and remove it
                TreeNode *node = queue.front();
                queue.pop();

                // Add its value to the levelSum
                levelSum += node->val;

                // Add the node's children to the queue if they exist
                if (node->left) {
                    queue.push(node->left);
                }

                if (node->right) {
                    queue.push(node->right);
                }
            }
        }

        // The last computed levelSum is for the deepest level
        return levelSum;
    }
};
```

***

# Complete binary tree

## Problem Statement

Given the **root** of a binary tree, write a function that returns `true` if it is a complete binary tree and `false` otherwise.

A complete binary tree is a binary tree in which all the levels are completely filled except possibly the lowest one, which is filled from the left.

### Example 1

> -   **Input:** root = \[1, 2, 3, null, null, 2, 7\]
> -   **Output:** false
> -   **Explanation:** The given binary tree is not a complete binary tree, as shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, 3, 5\]
> -   **Output:** true
> -   **Explanation:** The given binary tree is a complete binary tree, as shown in the diagram above.

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
    bool completeBinaryTree(TreeNode *root) {

        // Create a queue to perform level order traversal
        queue<TreeNode *> queue;

        // Start the traversal by pushing the root node into the queue
        queue.push(root);

        // Flag to check if we've encountered a null node
        bool foundNull = false;

        // Perform level-order traversal using the queue
        while (!queue.empty()) {

            // Get the number of nodes in the current level
            int levelSize = queue.size();

            // Process all nodes in the current level
            for (int i = 0; i < levelSize; i++) {

                // Get the front node from the queue
                TreeNode *node = queue.front();
                queue.pop();

                // If the node is NULL, set the flag to true
                if (!node) {
                    foundNull = true;
                    continue;
                }

                // If we found a NULL node before, but now there's a
                // non-null node -> Not complete
                if (foundNull) {
                    return false;
                }

                // Push left and right children to the queue
                // (even if they are NULL)
                queue.push(node->left);
                queue.push(node->right);
            }
        }

        // If traversal completes without issue, tree is complete
        return true;
    }
};
```

***

# Zigzag traversal

## Problem Statement

Given the **root** of a binary tree, write a function to return all its nodes as in a zigzag traversal.

A zigzag traversal is a level-order traversal starting from the root node where the direction of traversal is flipped at every level. The initial direction is left to right.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\]
> -   **Output:** \[\[1\], \[3, 2\], \[4, 7\]\]
> -   **Explanation:** The zigzag traversal of the given tree is shown in the diagram above.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7\]
> -   **Output:** \[\[1\], \[4, 8\], \[2, 7\]\]
> -   **Explanation:** The zigzag traversal of the given tree is shown in the diagram above.

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
    vector<vector<int>> zigzagTraversal(TreeNode *root) {
        vector<vector<int>> zigzagLevels;
        if (!root) {
            return zigzagLevels;
        }

        queue<TreeNode *> queue;
        queue.push(root);

        // Flag to indicate the direction of traversal
        bool reverse = false;

        // Loop through each level in the tree
        while (!queue.empty()) {

            // Get the size of the current level
            int levelSize = queue.size();

            // Initialize the vector to store the nodes in the current
            // level. The size of the vector is equal to the number of
            // nodes in the current level.
            vector<int> level(levelSize);

            // Loop through each node in the current level
            for (int i = 0; i < levelSize; i++) {
                TreeNode *node = queue.front();
                queue.pop();

                // Fill level vector based on the direction of traversal
                if (reverse) {
                    level[levelSize - i - 1] = node->val;

                } else {
                    level[i] = node->val;
                }

                // Add the node's children to the queue if they exist
                if (node->left) {
                    queue.push(node->left);
                }

                if (node->right) {
                    queue.push(node->right);
                }
            }

            // Add the current level vector to the levels vector
            zigzagLevels.push_back(level);

            // Flip the direction for the next level
            reverse = !reverse;
        }

        return zigzagLevels;
    }
};
```

***

# Cousin check

## Problem Statement

Given the **root** of a binary tree and two values **valA** and **valB**, write a function that returns `true` if the two nodes with the given values are **cousins** in this tree.

Two nodes of a binary tree are cousins if they have the same depth with different parents.

### Example 1

> -   **Input:** root = \[1, 2, 3, 4, null, null, 7\], valA = 4, valB = 7
> -   **Output:** true
> -   **Explanation:** The nodes with the given value are cousins as they are at the same depth but have different parents.

### Example 2

> -   **Input:** root = \[1, 8, 4, null, null, 2, 7, null, 9\], valA = 2, valB = 8
> -   **Output:** false
> -   **Explanation:** The nodes with the given value are not cousins as they are on different depths.

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

// Define a struct to store the node and its parent
struct NodeInfo {
    TreeNode *node;
    TreeNode *parent;
};

class Solution {
public:
    bool cousinCheck(TreeNode *root, int valA, int valB) {
        if (!root) {
            return false;
        }

        // Use a queue to store the nodes and their parents
        queue<NodeInfo> queue;
        queue.push(NodeInfo{root, nullptr});

        // Loop through each level in the tree
        while (!queue.empty()) {

            // Get the size of the current level
            int levelSize = queue.size();

            // Initialize the parent nodes for A and B
            TreeNode *parentA = nullptr;
            TreeNode *parentB = nullptr;

            // Loop through each node in the current level
            for (int i = 0; i < levelSize; ++i) {

                // Get the node and the parent node for the first node
                // in the queue
                NodeInfo current = queue.front();
                TreeNode *node = current.node;
                TreeNode *parent = current.parent;
                queue.pop();

                // Check and assign parents for A and B
                if (node->val == valA) {
                    parentA = parent;
                }

                if (node->val == valB) {
                    parentB = parent;
                }

                // Add the node's children to the queue if they exist
                if (node->left) {
                    queue.push(NodeInfo{node->left, node});
                }

                if (node->right) {
                    queue.push(NodeInfo{node->right, node});
                }
            }

            // If both nodes found at the same level
            if (parentA && parentB) {
                return parentA != parentB;
            }

            // If only one is found, return false (not same depth)
            if (parentA || parentB) {
                return false;
            }
        }

        // If neither node is found, return false
        return false;
    }
};
```

***

# Cousin check
