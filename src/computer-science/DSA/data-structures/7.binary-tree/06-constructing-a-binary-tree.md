# Constructing a binary tree

## Table of Contents

1. [Challenges in construction from preorder traversal](#challenges-in-construction-from-preorder-traversal)
2. [Challenges in construction from inorder traversal](#challenges-in-construction-from-inorder-traversal)
3. [Challenges in construction from postorder traversal](#challenges-in-construction-from-postorder-traversal)
4. [Understanding construction using preorder and inorder traversal](#understanding-construction-using-preorder-and-inorder-traversal)
5. [Construct tree using preorder and inorder traversal](#understanding-construction-using-preorder-and-inorder-traversal)
6. [Understanding construction using postorder and inorder traversal](#understanding-construction-using-postorder-and-inorder-traversal)
7. [Construct tree using postorder and inorder traversal](#understanding-construction-using-postorder-and-inorder-traversal)

***

# Challenges in construction from preorder traversal

Let us determine if we can uniquely serialize and deserialize a tree using its preorder traversal sequence. We will start with a simple tree and try to serialize it into its preorder traversal sequence. Then, we will try to reconstruct the **same** tree using the preorder sequence.

// Diagram: Example Tree

## Serialization

To serialize the tree, we write down its preorder traversal sequence.

// Diagram: Serialization using preorder traversal sequence

## Deserialization

When deserializing, we need to only look at the preorder traversal sequence and reconstruct the same tree we serialized earlier.

// Diagram: Deserialize preorder traversal sequence

Reconstructing a tree by looking only at the preorder traversal sequence consists of the following steps.

> 1.  The first element in the preorder traversal array is the root node.
> 2.  The next element in the preorder traversal array can be either:
>     -   The left node of the root if the root has a left subtree.
>     -   The right node of the root if the root does not have a left subtree.

// Diagram: Ambiguity when constructing the tree using only preorder traversal

Because deciding whether the next element in the preorder traversal sequence is the left node or the right node is ambiguous, the sequence can generate multiple tree representations depending on the decision between left and right made at each step. This means that preorder traversal cannot be used to deserialize a tree uniquely.

***

# Challenges in construction from inorder traversal

Let us determine if we can uniquely serialize and deserialize a tree using its inorder traversal sequence. We will start with a simple tree, try to serialize it into its inorder traversal sequence, and then try reconstructing the **same** tree using the inorder sequence.

// Diagram: Example Tree

## Serialization

To serialize the tree, we write down its inorder traversal sequence.

// Diagram: Serialization using inorder traversal sequence

## Deserialization

When deserializing, we need to only look at the inorder traversal sequence and reconstruct the same tree we serialized earlier.

// Diagram: Deserialize inorder traversal sequence

Constructing a tree just by looking at its inorder traversal sequence is impossible. This is because, unlike preorder and postorder traversal sequences, we cannot look at the inorder traversal sequence and find the root node. The root node can be anywhere in the sequence.

// Diagram: Ambiguity when constructing tree using only inorder traversal

Because deciding the root node in the in-order traversal sequence is ambiguous, it can generate multiple different tree representations depending on what node we select as the root node at every step. This means that inorder traversal cannot be used to deserialize a tree uniquely.

***

# Challenges in construction from postorder traversal

Let us determine if we can uniquely serialize and deserialize a tree using its postorder traversal sequence. We will start with a simple tree, try to serialize it into its postorder traversal sequence, and then try reconstructing the **same** tree using the postorder sequence.

// Diagram: Example Tree

## Serialization

To serialize the tree, we write down its postorder traversal sequence.

// Diagram: Serialization using postorder traversal sequence

## Deserialization

When deserializing, we need to only look at the postorder traversal sequence and reconstruct the same tree we serialized earlier.

// Diagram: Deserialize postorder traversal sequence

The reconstruction process of a tree by looking only at the postorder traversal sequence looks something like the steps below.

> 1.  The last element in the postorder traversal sequence is the root node.
> 2.  The second last element in the postorder traversal sequence can be either:
>     -   The right node of the root if the root has a right subtree.
>     -   The left node of the root if the root does not have a right subtree.

// Diagram: Ambiguity when constructing the tree using only postorder traversal

Because of the ambiguity in deciding if the next element in the postorder traversal sequence is the left node or the right node, the postorder traversal sequence can generate multiple tree representations depending on the decision between left and right made at each step. This means that postorder traversal alone cannot be used to deserialize a tree uniquely.

***

# Understanding construction using preorder and inorder traversal

If given both the preorder and inorder traversal sequence of a binary tree, we can construct the tree. We use both sequences in tandem to construct the tree and resolve any ambiguity incrementally.

// Diagram: Tree constructed from inorder and preorder traversal

We follow a very simple idea to construct the binary tree from a given preorder and inorder traversal.

> -   **Step 1:** We know the first element in the preorder traversal sequence is the root node, so we use it to construct the \`root\` node.
> -   **Step 2:** Find the location of the \`root\` node in the inorder traversal sequence.
> -   **Step 3:** If the \`root\` node in the inorder traversal sequence has elements to its left, it indicates the presence of a \`left\` subtree. In this case, the next element in the preorder sequence is the \`left\` child, which is a clear and straightforward condition.
> -   **Step 4:** If the \`root\` node in the inorder traversal sequence does not have elements to its left but elements to its right, the root node does not have a left subtree, so the next element in the preorder sequence is the \`right\` child.
> -   **Step 5:** If the \`root\` node in the inorder traversal sequence does not have elements to its left and right, we are done creating the tree.

// Diagram: Tree construction logic and the starting point

We use the same idea while iterating over the preorder traversal sequence to construct the entire tree recursively.

## Algorithm

To implement the idea, we move the preorder traversal array from start to end and construct a binary tree in **a preorder fashion**. Constructing a tree in a preorder fashion means we first construct the current node, followed by the left and right subtree of the current node recursively. We use the given inorder traversal array to resolve ambiguity at every step and decide if the next node is the left and right subtree or if we are done constructing the entire subtree from the current node and must return the node.

// Diagram: Algorithm to construct tree from inorder and preorder traversal

> **Algorithm**
>
> -   **Step 1:** Set the global variable \`preInd\` = \`0\`
> -   **Step 2:** Recursively start constructing the tree for the range \`\[0, inorder.length - 1\]\`.
>     -   **Step 2.1:** Return \`null\` if the \`inStart > inEnd\` means it is a \`null\` node.
>     -   **Step 2.2:** Create a node with the value \`preorder\[preInd\]\`.
>     -   **Step 2.3:** Find the \`index\` of value \`preorder\[preInd\]\` in the inorder array from \`inStart\` to \`inEnd\`. The current node's left and right subtree in the inorder array are in the range \`\[inStart, index - 1\]\` and \`\[index + 1, inEnd\]\`, respectively.
>     -   **Step 2.4:** Increment \`preInd\` by \`1\`.
>     -   **Step 2.5:** Recursively construct the left subtree using the range \`\[inStart, index - 1\]\`
>     -   **Step 2.6:** Recursively construct the right subtree using the range \`\[index + 1, inEnd\]\`
>     -   **Step 2.7:** Return the node created in \`Step 2.2\`.

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

    // Global variable to keep track of the current index in the preorder
    // traversal
    int preInd = 0;

    // Helper function to find the index of a given value in the inorder
    // traversal
    int findIndex(vector<int> &inorder, int start, int end, int val) {
        for (int i = start; i <= end; i++) {
            if (inorder[i] == val)
                return i;
        }

        // If the value is not found in the inorder array, return the
        // start index
        return start;
    }

    TreeNode *buildTree(
        vector<int> &inorder,
        int inStart,
        int inEnd,
        vector<int> &preorder
    ) {

        // Base case: if the inorder range is empty, return nullptr to
        // indicate an empty subtree
        if (inStart > inEnd)
            return nullptr;

        // Create a new node using the current value from the preorder
        // traversal
        TreeNode *currentNode = new TreeNode(preorder[preInd]);

        // Find the index of the current value in the inorder traversal
        int index = findIndex(inorder, inStart, inEnd, preorder[preInd]);

        // Move to the next value in the preorder traversal
        preInd++;

        // Recursively construct the left and right subtrees using the
        // appropriate ranges of the inorder and preorder traversals
        currentNode->left =
            buildTree(inorder, inStart, index - 1, preorder);
        currentNode->right =
            buildTree(inorder, index + 1, inEnd, preorder);

        // Return the current node, which is the root of the constructed
        // subtree
        return currentNode;
    }

    TreeNode *preorderAndInorderReconstruction(
        vector<int> &preorder,
        vector<int> &inorder
    ) {

        // Call the recursive buildTree function with the entire ranges
        // of inorder and preorder traversals
        return buildTree(inorder, 0, inorder.size() - 1, preorder);
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

    // Global variable to keep track of the current index in the preorder
    // traversal
    int preInd = 0;

    // Helper function to find the index of a given value in the inorder
    // traversal
    int findIndex(int[] inorder, int start, int end, int val) {
        for (int i = start; i <= end; i++) {
            if (inorder[i] == val) return i;
        }

        // If the value is not found in the inorder array, return the
        // start index
        return start;
    }

    TreeNode buildTree(
        int[] inorder,
        int inStart,
        int inEnd,
        int[] preorder
    ) {

        // Base case: if the inorder range is empty, return null to
        // indicate an empty subtree
        if (inStart > inEnd) return null;

        // Create a new node using the current value from the preorder
        // traversal
        TreeNode currentNode = new TreeNode(preorder[preInd]);

        // Find the index of the current value in the inorder traversal
        int index = findIndex(inorder, inStart, inEnd, preorder[preInd]);

        // Move to the next value in the preorder traversal
        preInd++;

        // Recursively construct the left and right subtrees using the
        // appropriate ranges of the inorder and preorder traversals
        currentNode.left =
            buildTree(inorder, inStart, index - 1, preorder);
        currentNode.right =
            buildTree(inorder, index + 1, inEnd, preorder);

        // Return the current node, which is the root of the constructed
        // subtree
        return currentNode;
    }

    public TreeNode preorderAndInorderReconstruction(
        int[] preorder,
        int[] inorder
    ) {

        // Call the recursive buildTree function with the entire ranges
        // of inorder and preorder traversals
        return buildTree(inorder, 0, inorder.length - 1, preorder);
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

    // Global variable to keep track of the current index in the preorder
    // traversal
    preInd: number = 0;

    // Helper function to find the index of a given value in the inorder
    // traversal
    findIndex(
        inorder: number[],
        start: number,
        end: number,
        val: number
    ): number {
        for (let i = start; i <= end; i++) {
            if (inorder[i] === val) {
                return i;
            }

        // If the value is not found in the inorder array, return the
        // start index
        return start;
    }

    buildTree(
        inorder: number[],
        inStart: number,
        inEnd: number,
        preorder: number[]
    ): TreeNode | null {

        // Base case: if the inorder range is empty, return null to
        // indicate an empty subtree
        if (inStart > inEnd) {
            return null;
        }

        // Create a new node using the current value from the preorder
        // traversal
        const currentNode = new TreeNode(preorder[this.preInd]);

        // Find the index of the current value in the inorder traversal
        const index = this.findIndex(
            inorder,
            inStart,
            inEnd,
            preorder[this.preInd]
        );

        // Move to the next value in the preorder traversal
        this.preInd++;

        // Recursively construct the left and right subtrees using the
        // appropriate ranges of the inorder and preorder traversals
        currentNode.left = this.buildTree(
            inorder,
            inStart,
            index - 1,
            preorder
        );
        currentNode.right = this.buildTree(
            inorder,
            index + 1,
            inEnd,
            preorder
        );

        // Return the current node, which is the root of the constructed
        // subtree
        return currentNode;
    }

    preorderAndInorderReconstruction(
        preorder: number[],
        inorder: number[]
    ): TreeNode | null {

        // Call the recursive buildTree function with the entire ranges
        // of inorder and preorder traversals
        return this.buildTree(inorder, 0, inorder.length - 1, preorder);
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

    // Global variable to keep track of the current index in the preorder
    // traversal
    preInd = 0;

    // Helper function to find the index of a given value in the inorder
    // traversal
    findIndex(inorder, start, end, val) {
        for (let i = start; i <= end; i++) {
            if (inorder[i] === val) {
                return i;
            }

        // If the value is not found in the inorder array, return the
        // start index
        return start;
    }

// Diagram: buildTree(inorder, inStart, inEnd, preorder) {

        // Base case: if the inorder range is empty, return null to
        // indicate an empty subtree
        if (inStart > inEnd) {
            return null;
        }

        // Create a new node using the current value from the preorder
        // traversal
        const currentNode = new TreeNode(preorder[this.preInd]);

        // Find the index of the current value in the inorder traversal
        const index = this.findIndex(
            inorder,
            inStart,
            inEnd,
            preorder[this.preInd]
        );

        // Move to the next value in the preorder traversal
        this.preInd++;

        // Recursively construct the left and right subtrees using the
        // appropriate ranges of the inorder and preorder traversals
        currentNode.left = this.buildTree(
            inorder,
            inStart,
            index - 1,
            preorder
        );
        currentNode.right = this.buildTree(
            inorder,
            index + 1,
            inEnd,
            preorder
        );

        // Return the current node, which is the root of the constructed
        // subtree
        return currentNode;
    }

// Diagram: preorderAndInorderReconstruction(preorder, inorder) {

        // Call the recursive buildTree function with the entire ranges
        // of inorder and preorder traversals
        return this.buildTree(inorder, 0, inorder.length - 1, preorder);
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

// Diagram: from typing import Optional, List, Any

class Solution:
    def __init__(self):

        # Global variable to keep track of the current index in the
        # preorder traversal
        self.pre_ind: int = 0

    # Helper function to find the index of a given value in the inorder
    # traversal
    def find_index(
        self, inorder: List[int], start: int, end: int, val: int
    ) -> int:
        for i in range(start, end + 1):
            if inorder[i] == val:
                return i

        # If the value is not found in the inorder array, return the
        # start index
        return start

    def build_tree(
        self,
        inorder: List[int],
        in_start: int,
        in_end: int,
        preorder: List[int],
    ) -> Optional[TreeNode]:

        # Base case: if the inorder range is empty, return None to
        # indicate an empty subtree
        if in_start > in_end:
            return None

        # Create a new node using the current value from the preorder
        # traversal
        current_node: TreeNode = TreeNode(preorder[self.pre_ind])

        # Find the index of the current value in the inorder traversal
        index = self.find_index(
            inorder, in_start, in_end, preorder[self.pre_ind]
        )

        # Move to the next value in the preorder traversal
        self.pre_ind += 1

        # Recursively construct the left and right subtrees using the appropriate ranges
        # of the inorder and preorder traversals
        current_node.left = self.build_tree(
            inorder, in_start, index - 1, preorder
        )
        current_node.right = self.build_tree(
            inorder, index + 1, in_end, preorder
        )

        # Return the current node, which is the root of the constructed
        # subtree
        return current_node

    def preorder_and_inorder_reconstruction(
        self, preorder: List[int], inorder: List[int]
    ) -> Optional[TreeNode]:

        # Call the recursive build_tree function with the entire ranges
        # of inorder and preorder traversals
        return self.build_tree(inorder, 0, len(inorder) - 1, preorder)
```

## Complexity Analysis

We can see from the algorithm and its implementation that we are just iterating over the preorder traversal sequence from start to end and recursively building the tree. Therefore, the runtime complexity grows linearly with the number of nodes. Since we are constructing a tree, the extra space complexity is also linear.

> **Best Case**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**
>
> **Worst Case**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Preorder and inorder reconstruction

## Problem Statement

Fundamental

Given the **preorder** and **inorder** traversal sequence of a binary tree, write a function to reconstruct and return the **root** of the binary tree.

### Example 1

> -   **Input:** preorder = \[1, 2, 4, 3, 7, 9\], inorder = \[4, 2, 1, 3, 9, 7\]
> -   **Output:** \[1, 2, 3, 4, null, null, 7, null, null, 9\]
> -   **Explanation:** The tree is shown in the diagram above.

### Example 2

> -   **Input:** preorder = \[1, 8, 6, 4\], inorder = \[8, 6, 1, 4\]
> -   **Output:** \[1, 8, 4, null, 6\]
> -   **Explanation:** The tree is shown in the diagram above.

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

    // Global variable to keep track of the current index in the preorder
    // traversal
    int preInd = 0;

    // Helper function to find the index of a given value in the inorder
    // traversal
    int findIndex(vector<int> &inorder, int start, int end, int val) {
        for (int i = start; i <= end; i++) {
            if (inorder[i] == val) {
                return i;
            }
        }

        // If the value is not found in the inorder array, return the
        // start index
        return start;
    }

    TreeNode *buildTree(
        vector<int> &inorder,
        int inStart,
        int inEnd,
        vector<int> &preorder
    ) {

        // Base case: if the inorder range is empty, return nullptr to
        // indicate an empty subtree
        if (inStart > inEnd) {
            return nullptr;
        }

        // Create a new node using the current value from the preorder
        // traversal
        TreeNode *currentNode = new TreeNode(preorder[preInd]);

        // Find the index of the current value in the inorder traversal
        int index = findIndex(inorder, inStart, inEnd, preorder[preInd]);

        // Move to the next value in the preorder traversal
        preInd++;

        // Recursively construct the left and right subtrees using the
        // appropriate ranges of the inorder and preorder traversals
        currentNode->left =
            buildTree(inorder, inStart, index - 1, preorder);
        currentNode->right =
            buildTree(inorder, index + 1, inEnd, preorder);

        // Return the current node, which is the root of the constructed
        // subtree
        return currentNode;
    }

    TreeNode *preorderAndInorderReconstruction(
        vector<int> &preorder,
        vector<int> &inorder
    ) {

        // Call the recursive buildTree function with the entire ranges
        // of inorder and preorder traversals
        return buildTree(inorder, 0, inorder.size() - 1, preorder);
    }
};
```

***

# Understanding construction using postorder and inorder traversal

Just like with preorder and inorder construction, we can construct a binary tree if both its postorder and inorder traversal sequence are given. We use both sequences in tandem to construct the tree and resolve any ambiguity incrementally.

// Diagram: Tree constructed from inorder and postorder traversal

Constructing a binary tree from a given postorder and inorder traversal is very similar to constructing a binary tree from preorder and inorder traversal.

> -   **Step 1:** In constructing a binary tree, we identify the last element in the postorder traversal sequence, the \`root \`node.
> -   **Step 2:** Find the location of the \`root\` node in the inorder traversal sequence.
> -   **Step 3:** If the \`root\` node in the inorder traversal sequence has elements to its right, the root node has a \`right\` subtree, so the second last element in the postorder sequence is the \`right\` child.
> -   **Step 4:** If the \`root\` node in the inorder traversal sequence does not have elements to its right but elements to its left, the root node does not have a \`right\` subtree, so the second last element in the postorder sequence is the \`left\` child.
> -   **Step 5:** If the \`root\` node in the inorder traversal sequence does not have elements to its right and left, we are done creating the tree.

// Diagram: Tree construction logic and the starting point

We use the same idea while iterating over the postorder traversal sequence in reverse order to construct the entire tree recursively.

## Algorithm

The implementation is straightforward. We move the postorder traversal array in the reverse order and construct a binary tree in an **NRL** fashion. Constructing a tree in an NRL fashion means we first construct the current **node**, followed by the **right** and **left** subtree of the current node recursively. We use the given inorder traversal array to resolve ambiguity at every step and decide if the next node is the right subtree, the left subtree, or if we are done with the entire subtree from the current node and must return the node.

// Diagram: Algorithm to construct tree from inorder and postorder traversal

> **Algorithm**
>
> -   **Step 1:** Set the global variable \`postInd\` = \`postOrder.length - 1\`
> -   **Step 2:** Recursively start constructing the tree for the range \`\[0, inorder.length - 1\]\`.
>     -   **Step 2.1:** Return \`null\` if the \`inStart > inEnd\` means it is a \`null\` node.
>     -   **Step 2.2:** Create a node with the value \`postorder\[postInd\]\`.
>     -   **Step 2.3:** Find the \`index\` of value \`postorder\[postInd\]\` in the inorder array from \`inStart\` to \`inEnd\`. The current node's right and left subtree in the inorder array are in the range \`\[index + 1, inEnd\]\` and \`\[inStart, index - 1\]\`, respectively.
>     -   **Step 2.4:** Decrement \`postInd\` by \`1\`.
>     -   **Step 2.5:** Recursively construct the right subtree using the range \`\[index + 1, inEnd\]\`
>     -   **Step 2.6:** Recursively construct the left subtree using the range \`\[inStart, index - 1\]\`
>     -   **Step 2.7:** Return the node created in \`Step 2.2\`.

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

    // Global variable to keep track of the index in the postorder
    // traversal
    int postInd;

    // Helper function to find the index of a given value in the inorder
    // traversal
    int findIndex(vector<int> &inorder, int start, int end, int val) {
        for (int i = start; i <= end; i++) {
            if (inorder[i] == val)
                return i;
        }

        // If the value is not found in the inorder array, return the
        // start index
        return start;
    }

    TreeNode *buildTree(
        vector<int> &inorder,
        int inStart,
        int inEnd,
        vector<int> &postorder
    ) {

        // Base case: If the current inorder range is empty, return
        // nullptr
        if (inStart > inEnd)
            return nullptr;

        // Create a new node with the current postorder element
        TreeNode *currentNode = new TreeNode(postorder[postInd]);

        // Find the index of this element in inorder
        int index =
            findIndex(inorder, inStart, inEnd, postorder[postInd]);

        // Move to the next postorder element
        postInd--;

        // Recursively build the right subtree with elements after the
        // current index in inorder
        currentNode->right =
            buildTree(inorder, index + 1, inEnd, postorder);

        // Recursively build the left subtree with elements before the
        // current index in inorder
        currentNode->left =
            buildTree(inorder, inStart, index - 1, postorder);

        // Return the current node with its left and right subtrees
        // constructed
        return currentNode;
    }

    TreeNode *postorderAndInorderReconstruction(
        vector<int> &postorder,
        vector<int> &inorder
    ) {

        // Initialize the postInd to the last index of the postorder
        // traversal.
        postInd = postorder.size() - 1;

        // Call the helper function with the full range of inorder
        // traversal.
        return buildTree(inorder, 0, inorder.size() - 1, postorder);
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

    // Global variable to keep track of the index in the postorder
    // traversal
    public int postInd;

    // Helper function to find the index of a given value in the inorder
    // traversal
    public int findIndex(int[] inorder, int start, int end, int val) {
        for (int i = start; i <= end; i++) {
            if (inorder[i] == val) return i;
        }

        // If the value is not found in the inorder array, return the
        // start index
        return start;
    }

    public TreeNode buildTree(
        int[] inorder,
        int inStart,
        int inEnd,
        int[] postorder
    ) {

        // Base case: If the current inorder range is empty, return null
        if (inStart > inEnd) return null;

        // Create a new node with the current postorder element
        TreeNode currentNode = new TreeNode(postorder[postInd]);

        // Find the index of this element in inorder
        int index = findIndex(
            inorder,
            inStart,
            inEnd,
            postorder[postInd]
        );

        // Move to the next postorder element
        postInd--;

        // Recursively build the right subtree with elements after the
        // current index in inorder
        currentNode.right =
            buildTree(inorder, index + 1, inEnd, postorder);

        // Recursively build the left subtree with elements before the
        // current index in inorder
        currentNode.left =
            buildTree(inorder, inStart, index - 1, postorder);

        // Return the current node with its left and right subtrees
        // constructed
        return currentNode;
    }

    public TreeNode postorderAndInorderReconstruction(
        int[] postorder,
        int[] inorder
    ) {

        // Initialize the postInd to the last index of the postorder
        // traversal.
        postInd = postorder.length - 1;

        // Call the helper function with the full range of inorder
        // traversal.
        return buildTree(inorder, 0, inorder.length - 1, postorder);
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

    // Global variable to keep track of the index in the postorder
    // traversal
    postInd: number = 0;

    // Helper function to find the index of a given value in the inorder
    // traversal
    findIndex(
        inorder: number[],
        start: number,
        end: number,
        val: number
    ): number {
        for (let i = start; i <= end; i++) {
            if (inorder[i] === val) return i;
        }

        // If the value is not found in the inorder array, return the
        // start index
        return start;
    }

    buildTree(
        inorder: number[],
        inStart: number,
        inEnd: number,
        postorder: number[]
    ): TreeNode | null {

        // Base case: If the current inorder range is empty, return null
        if (inStart > inEnd) return null;

        // Create a new node with the current postorder element
        const currentNode: TreeNode = new TreeNode(
            postorder[this.postInd]
        );

        // Find the index of this element in inorder
        const index: number = this.findIndex(
            inorder,
            inStart,
            inEnd,
            postorder[this.postInd]
        );

        // Move to the next postorder element
        this.postInd--;

        // Recursively build the right subtree with elements after the
        // current index in inorder
        currentNode.right = this.buildTree(
            inorder,
            index + 1,
            inEnd,
            postorder
        );

        // Recursively build the left subtree with elements before the
        // current index in inorder
        currentNode.left = this.buildTree(
            inorder,
            inStart,
            index - 1,
            postorder
        );

        // Return the current node with its left and right subtrees
        // constructed
        return currentNode;
    }

    postorderAndInorderReconstruction(
        postorder: number[],
        inorder: number[]
    ): TreeNode | null {

        // Initialize the postInd to the last index of the postorder
        // traversal.
        this.postInd = postorder.length - 1;

        // Call the helper function with the full range of inorder
        // traversal.
        return this.buildTree(inorder, 0, inorder.length - 1, postorder);
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

    // Global variable to keep track of the index in the postorder
    // traversal
    postInd = 0;

    // Helper function to find the index of a given value in the inorder
    // traversal
    findIndex(inorder, start, end, val) {
        for (let i = start; i <= end; i++) {
            if (inorder[i] === val) return i;
        }

        // If the value is not found in the inorder array, return the
        // start index
        return start;
    }

// Diagram: buildTree(inorder, inStart, inEnd, postorder) {

        // Base case: If the current inorder range is empty, return null
        if (inStart > inEnd) return null;

        // Create a new node with the current postorder element
        const currentNode = new TreeNode(postorder[this.postInd]);

        // Find the index of this element in inorder
        const index = this.findIndex(
            inorder,
            inStart,
            inEnd,
            postorder[this.postInd]
        );

        // Move to the next postorder element
        this.postInd--;

        // Recursively build the right subtree with elements after the
        // current index in inorder
        currentNode.right = this.buildTree(
            inorder,
            index + 1,
            inEnd,
            postorder
        );

        // Recursively build the left subtree with elements before the
        // current index in inorder
        currentNode.left = this.buildTree(
            inorder,
            inStart,
            index - 1,
            postorder
        );

        // Return the current node with its left and right subtrees
        // constructed
        return currentNode;
    }

// Diagram: postorderAndInorderReconstruction(postorder, inorder) {

        // Initialize the postInd to the last index of the postorder
        // traversal.
        this.postInd = postorder.length - 1;

        // Call the helper function with the full range of inorder
        // traversal.
        return this.buildTree(inorder, 0, inorder.length - 1, postorder);
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

        # Global variable to keep track of the index in the postorder
        # traversal
        self.post_ind: int = 0

    def find_index(
        self, inorder: List[int], start: int, end: int, val: int
    ) -> int:

        # Helper function to find the index of a given value in the
        # inorder traversal
        for i in range(start, end + 1):
            if inorder[i] == val:
                return i

        # If the value is not found in the inorder array, return the
        # start index
        return start

    def build_tree(
        self,
        inorder: List[int],
        in_start: int,
        in_end: int,
        postorder: List[int],
    ) -> Optional[TreeNode]:

        # Base case: If the current inorder range is empty, return None
        if in_start > in_end:
            return None

        # Create a new node with the current postorder element
        current_node: TreeNode = TreeNode(postorder[self.post_ind])

        # Find the index of this element in inorder
        index = self.find_index(
            inorder, in_start, in_end, postorder[self.post_ind]
        )

        # Move to the next postorder element
        self.post_ind -= 1

        # Recursively build the right subtree with elements after the
        # current index in inorder
        current_node.right = self.build_tree(
            inorder, index + 1, in_end, postorder
        )

        # Recursively build the left subtree with elements before the
        # current index in inorder
        current_node.left = self.build_tree(
            inorder, in_start, index - 1, postorder
        )

        # Return the current node with its left and right subtrees
        # constructed
        return current_node

    def postorder_and_inorder_reconstruction(
        self, postorder: List[int], inorder: List[int]
    ) -> Optional[TreeNode]:

        # Initialize the post_ind to the last index of the postorder
        # traversal.
        self.post_ind = len(postorder) - 1

        # Call the helper function with the full range of inorder
        # traversal.
        return self.build_tree(inorder, 0, len(inorder) - 1, postorder)
```

## Complexity Analysis

We can see from the algorithm and its implementation that we are just iterating over the postorder traversal sequence from end to start and recursively building the tree. Therefore, the runtime complexity grows linearly with the number of nodes. Since we are constructing a tree, the extra space complexity is also linear.

> **Best Case**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**
>
> **Worst Case**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Postorder and inorder reconstruction

## Problem Statement

Fundamental

Given the **postorder** and **inorder** traversal sequence of a binary tree, write a function to reconstruct and return the **root** of the binary tree.

### Example 1

> -   **Input:** preorder = \[4, 2, 9, 7, 3, 1\], inorder = \[4, 2, 1, 3, 9, 7\]
> -   **Output:** \[1, 2, 3, 4, null, null, 7, null, null, 9\]
> -   **Explanation:** The tree is shown in the diagram above.

### Example 2

> -   **Input:** preorder = \[6, 8, 4, 1\], inorder = \[8, 6, 1, 4\]
> -   **Output:** \[1, 8, 4, null, 6\]
> -   **Explanation:** The tree is shown in the diagram above.

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

    // Global variable to keep track of the index in the postorder
    // traversal
    int postInd;

    // Helper function to find the index of a given value in the inorder
    // traversal
    int findIndex(vector<int> &inorder, int start, int end, int val) {
        for (int i = start; i <= end; i++) {
            if (inorder[i] == val) {
                return i;
            }
        }

        // If the value is not found in the inorder array, return the
        // start index
        return start;
    }

    TreeNode *buildTree(
        vector<int> &inorder,
        int inStart,
        int inEnd,
        vector<int> &postorder
    ) {

        // Base case: If the current inorder range is empty, return
        // nullptr
        if (inStart > inEnd) {
            return nullptr;
        }

        // Create a new node with the current postorder element
        TreeNode *currentNode = new TreeNode(postorder[postInd]);

        // Find the index of this element in inorder
        int index =
            findIndex(inorder, inStart, inEnd, postorder[postInd]);

        // Move to the next postorder element
        postInd--;

        // Recursively build the right subtree with elements after the
        // current index in inorder
        currentNode->right =
            buildTree(inorder, index + 1, inEnd, postorder);

        // Recursively build the left subtree with elements before the
        // current index in inorder
        currentNode->left =
            buildTree(inorder, inStart, index - 1, postorder);

        // Return the current node with its left and right subtrees
        // constructed
        return currentNode;
    }

    TreeNode *postorderAndInorderReconstruction(
        vector<int> &postorder,
        vector<int> &inorder
    ) {

        // Initialize the postInd to the last index of the postorder
        // traversal.
        postInd = postorder.size() - 1;

        // Call the helper function with the full range of inorder
        // traversal.
        return buildTree(inorder, 0, inorder.size() - 1, postorder);
    }
};
```
