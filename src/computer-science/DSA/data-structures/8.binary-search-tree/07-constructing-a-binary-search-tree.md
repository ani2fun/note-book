# Constructing a binary search tree

## Table of Contents

1. [Understanding construction from a sorted array](#understanding-construction-from-a-sorted-array)
2. [Construct BST from a sorted array](#sorted-array-to-bst)
3. [Understanding construction from an unsorted array](#understanding-construction-from-an-unsorted-array)
4. [Construct BST from an unsorted array](#unsorted-array-to-bst)
5. [Sorted linked list to BST](#sorted-linked-list-to-bst)

***

# Understanding construction from a sorted array

We know that the inorder traversal of a binary search tree generates a sorted sequence. However, reconstructing a **height-balanced** binary search tree from this sorted sequence is also possible. This is only true for a binary search tree because of its special properties.

## Resolving ambiguity

Using just the inorder traversal sequence to reconstruct a generic binary tree is impossible. We cannot identify the root by looking at the inorder traversal sequence. This ambiguity is generally resolved by using either the preorder or postorder traversal sequence in tandem with the inorder sequence, as for them, the position of the root is always at the beginning or the end, respectively. 

// Diagram: Ambiguity in tree construction just from inorder traversal sequence

This means that for reconstructing a binary tree from the inorder traversal sequence, the other sequence(preorder or postorder) is just used to identify the location of the root node for every subtree.

What if there was another way to resolve this ambiguity without using the second traversal sequence(pre or postorder)? In the case of a binary search tree, this can be done by imposing the condition of height balance on the constructed tree. By imposing this condition, we can effectively resolve the ambiguity in root selection, as we will see shortly.

## Construction

To construct a **height balanced** binary search tree from a sorted array, we follow a simple idea. For a binary tree to be height balanced, every node in the tree should typically have a similar number of nodes in its left and right subtrees. To ensure this happens, we make the value at the **middle** of the sorted array the root of the binary tree.

All the values to the left of this value will make up the root's left subtree, and all the values to the right make up the right subtree. This way, both the left and right subtree of the root will have a similar number of nodes. We construct the left and the right subtree in the same way by applying the same logic recursively. As evident from above, imposing the condition of height balance effectively resolves the ambiguity in selecting the root node for every subtree.

// Diagram: Resolving ambiguity while constructing the binary search tree

## Algorithm

We can implement the idea by piggybacking on any of the recursive tree traversal algorithms and constructing the tree along the way. In the algorithm below, we use the preorder traversal algorithm, where we first construct the root node, followed by its left and right subtrees. However, at every point in traversal, we need to know exactly where the subtree rooted at the current node lies in the given sorted array. To accomplish this, we use two pointers `st` and `en` to keep track of the range in the array that holds the current subtree. To understand the algorithm better, let's look at the following example.

// Diagram: Construct a balanced binary search tree from a sorted array

We can summarise the algorithm as the following recursive equation.

// Diagram: Recursive equation to construct a balanced binary search tree from a sorted array

> **Algorithm**
>
> -   **Step 1:** If the \`start\` index is greater than the \`end\` index, there are no elements in this subarray. In this case, return \`null\` to indicate an empty subtree (base case).
> -   **Step 2:** Calculate the \`middle\` index of the current subarray.
> -   **Step 3:** Create a new node with the element's value at the array's \`middle\` index.
> -   **Step 4:** Recursively build this new node's \`left\` subtree using the elements to the left of the \`middle\` index.
> -   **Step 5:** Recursively build this new node's \`right\` subtree using the elements to the right of the \`middle\` index.
> -   **Step 6:** Return the new node at the end of recursion.

## Implementation

A simple recursive function can implement the algorithm in a few lines.

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
    TreeNode *buildTree(vector<int> &arr, int st, int en) {

        // Base case: If the start index is greater than
        // the end index,there are no elements in this subarray
        // In this case, return nullptr to indicate an empty subtree
        if (st > en) {
            return nullptr;
        }

        // Calculate the middle index of the current subarray
        int mid = (st + en) / 2;

        // Create a new TreeNode using the value at the middle index
        TreeNode *node = new TreeNode(arr[mid]);

        // Recursively build the left subtree using the elements to the
        // left of the middle index
        node->left = buildTree(arr, st, mid - 1);

        // Recursively build the right subtree using the elements to the
        // right of the middle index
        node->right = buildTree(arr, mid + 1, en);

        // Return the root of the constructed binary search tree
        return node;
    }

// Diagram: TreeNode sortedArrayToBST(vector<int> &arr) {

        // Call the buildTree function with the start index as 0 and the
        // end index as the last index of the array
        return buildTree(arr, 0, arr.size() - 1);
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
    public TreeNode buildTree(int[] arr, int st, int en) {

        // Base case: If the start index is greater than
        // the end index, there are no elements in this subarray
        // In this case, return null to indicate an empty subtree
        if (st > en) {
            return null;
        }

        // Calculate the middle index of the current subarray
        int mid = (st + en) / 2;

        // Create a new TreeNode using the value at the middle index
        TreeNode node = new TreeNode(arr[mid]);

        // Recursively build the left subtree using the elements to the
        // left of the middle index
        node.left = buildTree(arr, st, mid - 1);

        // Recursively build the right subtree using the elements to the
        // right of the middle index
        node.right = buildTree(arr, mid + 1, en);

        // Return the root of the constructed binary search tree
        return node;
    }

// Diagram: public TreeNode sortedArrayToBST(int[] arr) {

        // Call the buildTree function with the start index as 0 and the
        // end index as the last index of the array
        return buildTree(arr, 0, arr.length - 1);
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
    buildTree(arr: number[], st: number, en: number): TreeNode | null {

        // Base case: If the start index is greater than
        // the end index, there are no elements in this subarray
        // In this case, return null to indicate an empty subtree
        if (st > en) {
            return null;
        }

        // Calculate the middle index of the current subarray
        const mid: number = Math.floor((st + en) / 2);

        // Create a new TreeNode using the value at the middle index
        const node: TreeNode = new TreeNode(arr[mid]);

        // Recursively build the left subtree using the elements to the
        // left of the middle index
        node.left = this.buildTree(arr, st, mid - 1);

        // Recursively build the right subtree using the elements to the
        // right of the middle index
        node.right = this.buildTree(arr, mid + 1, en);

        // Return the root of the constructed binary search tree
        return node;
    }

// Diagram: sortedArrayToBST(arr: number[]): TreeNode | null {

        // Call the buildTree function with the start index as 0 and the
        // end index as the last index of the array
        return this.buildTree(arr, 0, arr.length - 1);
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
    buildTree(arr, st, en) {

        // Base case: If the start index is greater than
        // the end index, there are no elements in this subarray
        // In this case, return null to indicate an empty subtree
        if (st > en) {
            return null;
        }

        // Calculate the middle index of the current subarray
        const mid = Math.floor((st + en) / 2);

        // Create a new TreeNode using the value at the middle index
        const node = new TreeNode(arr[mid]);

        // Recursively build the left subtree using the elements to the
        // left of the middle index
        node.left = this.buildTree(arr, st, mid - 1);

        // Recursively build the right subtree using the elements to the
        // right of the middle index
        node.right = this.buildTree(arr, mid + 1, en);

        // Return the root of the constructed binary search tree
        return node;
    }
    sortedArrayToBST(arr) {

        // Call the buildTree function with the start index as 0 and the
        // end index as the last index of the array
        return this.buildTree(arr, 0, arr.length - 1);
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
    def build_tree(
        self, arr: List[int], st: int, en: int
    ) -> Optional[TreeNode]:

        # Base case: If the start index is greater than
        # the end index, there are no elements in this subarray
        # In this case, return None to indicate an empty subtree
        if st > en:
            return None

        # Calculate the middle index of the current subarray.
        mid: int = (st + en) // 2

        # Create a new TreeNode using the value at the middle index.
        node: TreeNode = TreeNode(arr[mid])

        # Recursively build the left subtree using the elements to the
        # left of the middle index.
        node.left = self.build_tree(arr, st, mid - 1)

        # Recursively build the right subtree using the elements to the
        # right of the middle index.
        node.right = self.build_tree(arr, mid + 1, en)

        # Return the root of the constructed binary search tree.
        return node

    def sorted_array_to_bst(self, arr: List[int]) -> Optional[TreeNode]:

        # Call the buildTree function with the start index as 0 and the
        # end index as the last index of the array.
        return self.build_tree(arr, 0, len(arr) - 1)
```

## Complexity Analysis

The algorithm constructing a balanced binary search tree from a sorted array is just some extra logic on top of recursive preorder traversal. So, the runtime complexity is linear, just like traversal. The space complexity is linear since we also construct an entire tree.

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

# Sorted array to BST

## Problem Statement

Given a sorted array **arr**, write a function to construct a height-balanced binary search tree from it and return the root of the constructed tree.

### Example 1

> -   **Input:** arr = \[1, 2, 3, 4, 5, 6\]
> -   **Output:** \[3, 1, 5, null, 2, 4, 6\]
> -   **Explanation:** The constructed binary search tree is shown in the diagram above.

### Example 2

> -   **Input:** arr = \[4, 5, 9, 10, 11\]
> -   **Output:** \[9, 4, 10, null, 5, null, 11\]
> -   **Explanation:** The constructed binary search tree is shown in the diagram above.

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
    TreeNode *buildTree(vector<int> &arr, int st, int en) {

        // Base case: If the start index is greater than
        // the end index,there are no elements in this subarray
        // In this case, return nullptr to indicate an empty subtree
        if (st > en) {
            return nullptr;
        }

        // Calculate the middle index of the current subarray
        int mid = (st + en) / 2;

        // Create a new TreeNode using the value at the middle index
        TreeNode *node = new TreeNode(arr[mid]);

        // Recursively build the left subtree using the elements to the
        // left of the middle index
        node->left = buildTree(arr, st, mid - 1);

        // Recursively build the right subtree using the elements to the
        // right of the middle index
        node->right = buildTree(arr, mid + 1, en);

        // Return the root of the constructed binary search tree
        return node;
    }

    TreeNode *sortedArrayToBST(vector<int> &arr) {

        // Call the buildTree function with the start index as 0 and the
        // end index as the last index of the array
        return buildTree(arr, 0, arr.size() - 1);
    }
};
```

***

# Understanding construction from an unsorted array

Constructing a binary search tree from an unsorted array of values is easy. It is not always the best method, but it is one of the easiest. 

## Algorithm

To construct a binary search tree from a given sequence, we start with an empty binary tree and insert all the elements in the sequence into it individually.

// Diagram: Insert values one at a time in binary search tree

> **Algorithm**
>
> -   **Step 1:** Initialize the \`root\` of the BST as \`null\` (empty tree).
> -   **Step 2:** Iterate through the elements of the input array, do the following:
>     -   **Step 2.1**: Insert the \`current\` element into the BST rooted at \`root\`.
> -   **Step 3:** Return the \`root\` of the BST, representing the \`root\` of the constructed BST.

## Implementation

The implementation of the algorithm is quite straightforward. We implement an insert function that inserts a value into the given tree and repeatedly calls it for all the elements in the sequence.

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
    TreeNode *insert(TreeNode *root, int data) {

        // If the root is null, create a new node with data and return
        // it as the new root
        if (!root) {
            return new TreeNode(data);
        }

        // If data is less than the current root's value, insert it in
        // the left subtree
        if (data < root->val) {
            root->left = insert(root->left, data);
        }

        // If data is greater than or equal to the current root's value,
        // insert it in the right subtree
        else {
            root->right = insert(root->right, data);
        }

        // Return the updated root of the BST after insertion
        return root;
    }

// Diagram: TreeNode unsortedArrayToBST(vector<int> &arr) {

        // Initialize the root of the BST as nullptr (empty tree)
        TreeNode *root = nullptr;

        // Iterate through the elements of the input array
        for (int i = 0; i < arr.size(); i++)

            // Insert the current element into the BST rooted at root
            root = insert(root, arr[i]);

        // Return the root of the BST, which represents the root of the
        // constructed BST
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
    public TreeNode insert(TreeNode root, int data) {

        // If the root is null, create a new node with data and return it
        // as the new root
        if (root == null) {
            return new TreeNode(data);
        }

        // If data is less than the current root's value, insert it in
        // the left subtree
        if (data < root.val) {
            root.left = insert(root.left, data);
        }

        // If data is greater than or equal to the current root's value,
        // insert it in the right subtree
        else {
            root.right = insert(root.right, data);
        }

        // Return the updated root of the BST after insertion
        return root;
    }

// Diagram: public TreeNode unsortedArrayToBST(int[] arr) {

        // Initialize the root of the BST as null (empty tree)
        TreeNode root = null;

        // Iterate through the elements of the input array
        for (int i = 0; i < arr.length; i++) {

            // Insert the current element into the BST rooted at root
            root = insert(root, arr[i]);
        }

        // Return the root of the BST, which represents the root of the
        // constructed BST
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
    insert(root: TreeNode | null, data: number): TreeNode | null {

        // If the root is null, create a new node with data and return it
        // as the new root
        if (root === null) {
            return new TreeNode(data);
        }

        // If data is less than the current root's value, insert it in
        // the left subtree
        if (data < root.val) {
            root.left = this.insert(root.left, data);
        }

        // If data is greater than or equal to the current root's value,
        // insert it in the right subtree
        else {
            root.right = this.insert(root.right, data);
        }

        // Return the updated root of the BST after insertion
        return root;
    }

// Diagram: unsortedArrayToBST(arr: number[]): TreeNode | null {

        // Initialize the root of the BST as null (empty tree)
        let root: TreeNode | null = null;

        // Iterate through the elements of the input array
        for (let i = 0; i < arr.length; i++) {

            // Insert the current element into the BST rooted at root
            root = this.insert(root, arr[i]);
        }

        // Return the root of the BST, which represents the root of the
        // constructed BST
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
    insert(root, data) {

        // If the root is null, create a new node with data and return it
        // as the new root
        if (root === null) {
            return new TreeNode(data);
        }

        // If data is less than the current root's value, insert it in
        // the left subtree
        if (data < root.val) {
            root.left = this.insert(root.left, data);
        }

        // If data is greater than or equal to the current root's value,
        // insert it in the right subtree
        else {
            root.right = this.insert(root.right, data);
        }

        // Return the updated root of the BST after insertion
        return root;
    }

// Diagram: unsortedArrayToBST(arr) {

        // Initialize the root of the BST as null (empty tree)
        let root = null;

        // Iterate through the elements of the input array
        for (let i = 0; i < arr.length; i++) {

            // Insert the current element into the BST rooted at root
            root = this.insert(root, arr[i]);
        }

        // Return the root of the BST, which represents the root of the
        // constructed BST
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

// Diagram: from typing import Optional, List

class Solution:
    def insert(
        self, root: Optional[TreeNode], data: int
    ) -> Optional[TreeNode]:

        # If the root is null, create a new node with data and return it
        # as the new root
        if not root:
            return TreeNode(data)

        # If data is less than the current root's value, insert it in
        # the left subtree
        if data < root.val:
            root.left = self.insert(root.left, data)

        # If data is greater than or equal to the current root's value,
        # insert it in the right subtree
        else:
            root.right = self.insert(root.right, data)

        # Return the updated root of the BST after insertion
        return root

    def unsorted_array_to_bst(self, arr: list) -> Optional[TreeNode]:

        # Initialize the root of the BST as None (empty tree)
        root = None

        # Iterate through the elements of the input array
        for num in arr:

            # Insert the current element into the BST rooted at root
            root = self.insert(root, num)

        # Return the root of the BST, which represents the root of the
        # constructed BST
        return root
```

## Complexity Analysis

The algorithm for constructing a binary search tree by inserting values sequentially into an empty tree involves traversing the entire sequence once, which has a linear time complexity. However, we also insert a BST for every element in the sequence. Insertion in a BST has a best-case time complexity of **O(log(N))** and a worst-case time complexity of **O(N)**. Let's understand better what the best and the worst cases are.

### Best Case

The best cases will be when every insert in the binary search tree takes **O(logN)** time. This can only happen if the tree is height-balanced at every step in the interaction. Let us look at an example of such a case.

// Diagram: Best case time complexity

Observing the example case above and extrapolating it, we hit the best case when the given sequence represents the level order traversal of a height balanced binary search tree. In such cases, the constructed tree will remain height balanced at all points in the iteration so that every operation will take **O(logN)** time. Since this operation is repeated for all elements in the sequence, the overall runtime complexity will be **O(NlogN)**.

### Worst Case

The worst case is when every insert operation in the binary search tree takes **O(N)** time. This will happen when the tree being constructed is skewed at every point.

// Diagram: Worst case time complexity

We observed the example case and extrapolated it further. When the given sequence is sorted, we hit the worst case. In such cases, the tree constructed will be a skewed tree at all points in the iteration, so the insertion will always take **O(N)** time. Since this operation is repeated for all elements in the sequence, the overall runtime complexity will be **O(N\*N)** \= **O(N2)**.

Since this algorithm also creates an entirely new tree, the space complexity, in any case, is linear **O(N)**.

> **Best Case** : The input sequence is the level order traversal sequence of balanced binary search tree.
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N(log(N))**
>
> **Worst Case** : The input sequence is sorted
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N^2)**

***

# Unsorted array to BST

## Problem Statement

Given an unsorted array **arr**, write a function to construct a binary search tree from it by inserting nodes in the order given in the array and return the root of the constructed tree.

### Example 1

> -   **Input:** arr = \[2, 1, 6, 5, 3, 4\]
> -   **Output:** \[2, 1, 6, null, null, 5, null, 3, null, null, 4\]
> -   **Explanation:** The constructed binary search tree is shown in the diagram above.

### Example 2

> -   **Input:** arr = \[10, 5, 9, 4, 11\]
> -   **Output:** \[10, 5, 11, 4, 9\]
> -   **Explanation:** The constructed binary search tree is shown in the diagram above.

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
    TreeNode *insert(TreeNode *root, int data) {

        // If the root is null, create a new node with data and return
        // it as the new root
        if (!root) {
            return new TreeNode(data);
        }

        // If data is less than the current root's value, insert it in
        // the left subtree
        if (data < root->val) {
            root->left = insert(root->left, data);
        }

        // If data is greater than or equal to the current root's value,
        // insert it in the right subtree
        else {
            root->right = insert(root->right, data);
        }

        // Return the updated root of the BST after insertion
        return root;
    }

    TreeNode *unsortedArrayToBST(vector<int> &arr) {

        // Initialize the root of the BST as nullptr (empty tree)
        TreeNode *root = nullptr;

        // Iterate through the elements of the input array
        for (int i = 0; i < arr.size(); i++)

            // Insert the current element into the BST rooted at root
            root = insert(root, arr[i]);

        // Return the root of the BST, which represents the root of the
        // constructed BST
        return root;
    }
};
```

***

# Sorted linked list to BST

## Problem Statement

Given the **head** of a sorted singly linked list, write a function to construct a height-balanced binary search tree from it and return the root of the constructed tree.

### Example 1

> -   **Input:** head = \[1, 2, 3, 4, 5, 6\]
> -   **Output:** \[4, 2, 6, 1, 3, 5\]
> -   **Explanation:** The constructed binary search tree is shown in the diagram above.

### Example 2

> -   **Input:** head = \[4, 5, 9, 10, 11\]
> -   **Output:** \[9, 5, 11, 4, null, 10\]
> -   **Explanation:** The constructed binary search tree is shown in the diagram above.

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
    ListNode *findMiddleNodeAndSplit(ListNode *head) {

        // Initialize slow pointer to the head of the list
        ListNode *slow = head;

        // Initialize fast pointer to the head of the list
        ListNode *fast = head;

        // Previous pointer
        ListNode *previous = nullptr;

        // Iterate until fast pointer reaches the end of the list
        while (fast != nullptr && fast->next != nullptr) {
            previous = slow;

            // Move slow pointer one step forward
            slow = slow->next;

            // Move fast pointer two steps forward
            fast = fast->next->next;
        }

        // Split the list into two halves
        if (previous != nullptr) {
            previous->next = nullptr;
        }

        // Return the middle node or the second middle node
        // (in case of even number of nodes)
        return slow;
    }

    TreeNode *sortedLinkedListToBST(ListNode *head) {
        if (head == nullptr) {
            return nullptr;
        }

        // Find the middle element of the list
        ListNode *middleNode = findMiddleNodeAndSplit(head);

        // Create a new TreeNode using the value at the middle node
        TreeNode *root = new TreeNode(middleNode->val);

        // Base case when there's only one element in the list
        if (head == middleNode) {
            return root;
        }

        // Recursively build the left subtree using the elements to the
        // left of the middle node
        root->left = sortedLinkedListToBST(head);

        // Recursively build the right subtree using the elements to the
        // right of the middle node
        root->right = sortedLinkedListToBST(middleNode->next);

        // Return the root of the constructed binary search tree
        return root;
    }
};
```
