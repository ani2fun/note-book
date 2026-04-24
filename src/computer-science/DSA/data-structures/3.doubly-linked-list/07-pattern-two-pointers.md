# 7. Pattern: Two pointers

## Table of contents

1. [Understanding the two pointer pattern](#understanding-the-two-pointer-pattern)
2. [Identifying the two pointer pattern](#identifying-the-two-pointer-pattern)
3. [Palindrome number](#palindrome-number)
4. [Two sum](#two-sum)
5. [Duplicate aware two sum](#duplicate-aware-two-sum)
6. [Approximate three sum](#approximate-three-sum)

***

# Understanding the two pointer pattern

To perform any operation on the data items in a singly linked list, we must traverse it from head to tail and find those items. A doubly linked list, however, can be traversed in two directions, i.e., either from head to tail or tail to head, and depending on the problem, we may choose one direction over the other.

However, some problems require us to traverse the linked list in both directions simultaneously. While this is impossible with singly linked lists, we can simultaneously traverse in both directions in a doubly linked list using the two-pointer technique. The two-pointer traversal technique allows us to solve certain problems in linear time and single-pass, which would otherwise require inefficient nested loops.

The two-pointer pattern is a classification of problems that can be solved using the two-pointer traversal technique.

// Diagram: Two pointer traversal is used to traverse in both directions simultaneously.

In this course, we will learn more about the two-pointer technique and how to identify a problem as a two-pointer pattern problem.

## Two pointer technique

The two-pointer technique uses two references, `left` and `right` initialized with the `head` and `tail` of the doubly linked list, respectively. We traverse in both directions by following the and `prev` sections of nodes while iterating using `left` and `right`, respectively, until they meet in the middle or `left` goes beyond `right`. As we traverse the linked list, we perform the operations on the node held in `left` and `right` to solve the problem. At the end of each iteration, we hop as many nodes as dictated by the problem to close the gap `left` and `right`.

// Diagram: The two pointer traversal technique using left and right

## Algorithm

The algorithm given below outlines the generic two-pointer traversal technique.

> -   **Step 1:** Initialize two references, \`left\` and \`right,\` to the \`head \`and \`tail\` of the doubly linked list.
> -   **Step 2:** Loop while \`left\` != \`right\` and \`left.prev\` != \`right\` do the following
>     -   **Step 2.1:** Do some operations on nodes held in \`left\` and \`right\` as dictated by the problem
>     -   **Step 2.2:** Decide if \`left\` should move forward and set \`left\` to \`left.next\` as many times as needed
>     -   **Step 2.3:** Decide if \`right\` should move forward and set \`right\` to \`right.prev\` as many times as needed

## Implementation

Given below is the generic code implementation of the two-pointer technique on a doubly linked list using variables `left` and `right` references.

C++

```cpp
/**
 * Definition for doubly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *prev;
 *     ListNode *next;
 *     ListNode() : val(0), prev(nullptr), next(nullptr) {}
 *     ListNode(int val) : val(val), prev(nullptr), next(nullptr) {}
 * };
 */

void twoPointer(ListNode *head, ListNode *tail)
{
  // If the head and tail are the same or adjacent, nothing needs to be done
  if (!head || !tail || head == tail || head.next)
  {
    return
  }

  // Initialize left and right references
  ListNode *left = head;
  ListNode *right = tail;

  while(left != right && left.prev != right) {
    /*
    Perform the operation on left and right
    */

    // Adjust pointers based on conditions
    if (shouldMoveLeft)
    {
      left = left.next
    }

    if (shouldMoveRight)
    {
      right = right.prev
    }
  return;
}
```

Java

```java

/**
 * Definition for doubly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode prev;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

// Diagram: class ReverseALinkedList {

        public void twoPointer(ListNode head, ListNode tail) {
        // If the head and tail are the same or adjacent, nothing needs to be done
        if (head == null || tail == null || head == tail || head.next == tail) {
            return;
        }

        // Initialize left and right references
        ListNode left = head;
        ListNode right = tail;
```

Typescript

```typescript

/**
 * Definition for doubly-linked list.
 * class ListNode {
 *     val: number
 *     prev: ListNode | null
 *     next: ListNode | null
 *     constructor(
 *         val?: number,
 *         prev?: ListNode | null,
 *         next?: ListNode | null
 *     ) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.prev = (prev===undefined ? null : prev)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function twoPointer(head: ListNode | null, tail: ListNode | null): void {
    // If the head and tail are the same or adjacent, nothing needs to be done
    if (!head || !tail || head === tail || head.next === tail) {
        return;
    }

    // Initialize left and right references
    let left: ListNode | null = head;
    let right: ListNode | null = tail;

    while (left !== right && left?.prev !== right) {
        /*
        Perform the operation on left and right
        */

        // Adjust pointers based on conditions
        if (shouldMoveLeft) {
            left = left?.next || null;
        }

        if (shouldMoveRight) {
            right = right?.prev || null;
        }
```

Javascript

```javascript

/**
 * Definition for doubly-linked list.
 * function ListNode(val, prev, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.prev = (prev===undefined ? null : prev)
 *     this.next = (next===undefined ? null : next)
 * }
 */

function twoPointer(head, tail) {
    // If the head and tail are the same or adjacent, nothing needs to be done
    if (!head || !tail || head === tail || head.next === tail) {
        return;
    }

    // Initialize left and right references
    let left = head;
    let right = tail;

    while (left !== right && left?.prev !== right) {
        /*
        Perform the operation on left and right
        */

        // Adjust pointers based on conditions
        if (shouldMoveLeft) {
            left = left?.next || null;
        }

        if (shouldMoveRight) {
            right = right?.prev || null;
        }
```

Python

```python

"""
Definition for doubly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None
"""

def two_pointer(head: Optional[ListNode], tail: Optional[ListNode]) -> None:
    # If the head and tail are the same or adjacent, nothing needs to be done
    if not head or not tail or head == tail or head.next == tail:
        return

    # Initialize left and right references
    left = head
    right = tail

    while left != right and left.prev != right:
        '''
        Perform the operation on left and right.
        You can include your specific logic here.
        '''

        # Adjust pointers based on conditions
        if should_move_left:  # You should define this condition according to your logic
            left = left.next

        if should_move_right:  # You should define this condition according to your logic
            right = right.prev

    return
```

## Complexity Analysis

The algorithm's time and space complexity is easy to understand. The two references simultaneously traverse the doubly linked list from both directions and meet in the middle, logically equivalent to a full array traversal. So, the time complexity is linear **O(N)** in any case where **N** is the size of the linked list.

Since we do not create any new data structure, the space complexity in any case is constant **O(1)**. 

> **Best Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**
>
> **Worst Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**

***

# Identifying the two pointer pattern

Almost all two-pointer array problems can be formulated as doubly linked list problems and solved similarly using the two-pointer technique. These are generally **medium** or **hard** problems, as implementing the two-pointer solution for a doubly linked list is more cumbersome as we must deal with pointers and do null checks. 

If the problem statement or its solution follows the generic template below, it can be solved by using the two-pointer technique.

**Template:**Given a doubly linked list, perform some operations on two nodes `left` and `right` and where `left` starts at `x` and `right` starts at `y` such that `x < y` and with each iteration `left` and `right` come closer to each other by some steps.

## Example

To better understand the problems that can be solved using the two-pointer technique, let's consider the following problem and see how we can identify it as a two-pointer pattern problem.

> **Problem statement:** We are given the \`head\` and \`tail\` of a doubly linked list where each node holds an integer value and an integer value \`target\`. The values in the nodes are sorted in non-decreasing order from head to tail. We must return true if two nodes exist in the list whose sum equals \`target\`.

Consider the given doubly linked list and target sum 13; two nodes exist in the list with the given sum.

// Diagram: Find two nodes with the given sum in the doubly linked list.

### Two pointer solution

The two-sum problem for an array can be solved using the two-pointer technique after sorting it. The proof of the solution's correctness is explained in more detail in the two-pointer section of the array. We can apply the same principle here, as the values in the linked lists' nodes are already sorted.

We can simultaneously traverse from `head` and `tail` and calculate the sum in each iteration. We control how much to traverse in any direction depending on the sum. The solution fits the template description of the two-pointer pattern.

**Template:**Given a doubly linked list, perform some operations on two nodes `left` and `right` and where `left` starts at `head` and `right` starts at `tail` and with each iteration `left` and `right` come closer to each other by one step.

We initialize two references `left` and `right` with the `head` and `tail` and traverse the list simultaneously in both directions using the two-pointer traversal technique. We calculate the sum of values at `left` and `right` in each iteration. If the sum is less than `target`, we move `left` forward; otherwise, if the sum is greater than the `target`, we move `right` backward. If at any point, the sum is equal to `target` we return true.

// Diagram: Fina a pair with the given sum

The implementation of two-pointer solution is given as follows.

C++

```cpp
/**
 * Definition for doubly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *prev;
 *     ListNode *next;
 *     ListNode() : val(0), prev(nullptr), next(nullptr) {}
 *     ListNode(int val) : val(val), prev(nullptr), next(nullptr) {}
 * };
 */

// Diagram: using namespace std;

class Solution {
public:
    vector<vector<int>> twoSum(
        ListNode *head,
        ListNode *tail,
        int target
    ) {

        // Check if the list is empty or has only one element
        if (head == nullptr || head->next == nullptr) {

            // Return an empty vector since there are no pairs to be
            // found
            return {};
        }

        // Store the pairs of values that sum up to the target
        vector<vector<int>> result;
        ListNode *left = head;
        ListNode *right = tail;

        // Iterate until either left or right becomes null or left's
        // value becomes greater than right's value
        while (left && right && left->val < right->val) {
            if (left->val + right->val == target) {

                // If the sum of left and right values is equal to the
                // target Add the pair to the result vector
                result.push_back(vector<int>{left->val, right->val});

                // Move left to the next node
                left = left->next;

                // Move right to the previous node
                right = right->prev;
            }

            // If the sum of left and right values is less than the
            // target Move left to the next node
            else if (left->val + right->val < target) {
                left = left->next;
            }

            // If the sum of left and right values is greater than
            // the target Move right to the previous node
            else {
                right = right->prev;
            }

        // Return the vector containing pairs of values that sum up to
        // the target
        return result;
    }
};
```

Java

```java
import java.util.*;

/**
 * Definition for doubly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode prev;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 * };
 */

class Solution {
    public List<List<Integer>> twoSum(
        ListNode head,
        ListNode tail,
        int target
    ) {

        // Check if the list is empty or has only one element
        if (head == null || head.next == null) {
```

Typescript

```typescript
/**
 * Definition for doubly-linked list.
 * class ListNode {
 *     val: number
 *     prev: ListNode | null
 *     next: ListNode | null
 *     constructor(
 *         val?: number,
 *         prev?: ListNode | null,
 *         next?: ListNode | null
 *     ) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.prev = (prev===undefined ? null : prev)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

export class Solution {
    twoSum(
        head: ListNode | null,
        tail: ListNode | null,
        target: number
    ): number[][] {

        // Check if the list is empty or has only one element
        if (!head || !head.next) {

            // Return an empty array since there are no pairs to be found
            return [];
        }

        // Store the pairs of values that sum up to the target
        const result: number[][] = [];
        let left: ListNode | null = head;
        let right: ListNode | null = tail;

        // Iterate until either left or right becomes null or left's
        // value becomes greater than right's value
        while (left && right && left.val < right.val) {
            if (left.val + right.val === target) {

                // If the sum of left and right values is equal to the
                // target Add the pair to the result array
                result.push([left.val, right.val]);

                // Move left to the next node
                left = left.next;

                // Move right to the previous node
                right = right.prev;
            }

            // If the sum of left and right values is less than the
            // target Move left to the next node
            else if (left.val + right.val < target) {
                left = left.next;
            }

            // If the sum of left and right values is greater than
            // the target Move right to the previous node
            else {
                right = right.prev;
            }

        // Return the array containing pairs of values that sum up to the
        // target
        return result;
    }
```

Javascript

```javascript
/**
 * Definition for doubly-linked list.
 * function ListNode(val, prev, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.prev = (prev===undefined ? null : prev)
 *     this.next = (next===undefined ? null : next)
 * }
 */

export class Solution {
    twoSum(head, tail, target) {

        // Check if the list is empty or has only one element
        if (!head || !head.next) {

            // Return an empty array since there are no pairs to be found
            return [];
        }

        // Store the pairs of values that sum up to the target
        const result = [];
        let left = head;
        let right = tail;

        // Iterate until either left or right becomes null or left's
        // value becomes greater than right's value
        while (left && right && left.val < right.val) {
            if (left.val + right.val === target) {

                // If the sum of left and right values is equal to the
                // target Add the pair to the result array
                result.push([left.val, right.val]);

                // Move left to the next node
                left = left.next;

                // Move right to the previous node
                right = right.prev;
            }

            // If the sum of left and right values is less than the
            // target Move left to the next node
            else if (left.val + right.val < target) {
                left = left.next;
            }

            // If the sum of left and right values is greater than
            // the target Move right to the previous node
            else {
                right = right.prev;
            }

        // Return the array containing pairs of values that sum up to the
        // target
        return result;
    }
```

Python

```python
"""
Definition for doubly-linked list.
class ListNode:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None
"""

// Diagram: from typing import Optional, List

class Solution:
    def two_sum(
        self,
        head: Optional[ListNode],
        tail: Optional[ListNode],
        target: int,
    ) -> List[List[int]]:

        # Check if the list is empty or has only one element
        if not head or not head.next:

            # Return an empty list since there are no pairs to be found
            return []

        # Store the pairs of values that sum up to the target
        result: List[List[int]] = []
        left: Optional[ListNode] = head
        right: Optional[ListNode] = tail

        # Iterate until either left or right becomes None or left's value
        # becomes greater than right's value
        while left and right and left.val < right.val:
            if left.val + right.val == target:

                # If the sum of left and right values is equal to the target
                # Add the pair to the result list
                result.append([left.val, right.val])

                # Move left to the next node
                left = left.next

                # Move right to the previous node
                right = right.prev

            # If the sum of left and right values is less than the target
            # Move left to the next node
            elif left.val + right.val < target:
                left = left.next

            # If the sum of left and right values is greater than the target
            # Move right to the previous node
            else:
                right = right.prev

        # Return the list containing pairs of values that sum up to the
        # target
        return result
```

As the code above demonstrates, using the two-pointer technique, we can solve the problem in a single pass without using any extra space.

## Example problems

Most problems that fall under this category are **easy** problems; a list of a few is given below.

> -   **[Palindrome number](https://www.codeintuition.io/courses/doubly-linked-list/bVV3iADELjwn6kK4uVJNd)**
> -   **[Two sum](https://www.codeintuition.io/courses/doubly-linked-list/MXlFNPzPB5uiDz-rToqwK)**
> -   **[Duplicate aware two sum](https://www.codeintuition.io/courses/doubly-linked-list/lglVMWgaR7rkUQV_ziJ4s)**
> -   **[Approximate three sum](https://www.codeintuition.io/courses/doubly-linked-list/xQLS3qHOU-zDxdqfs4Aiy)**

We will now solve these problems to understand the two-pointer technique better.

***

# Palindrome number

## Problem Statement

Given the **head** and **tail** of a sorted doubly linked list, write a function that returns `true` if the list represents a palindrome number or `false` otherwise. 

A palindrome number is an integer that remains the same when its digits are reversed. In other words, if you write the number from left to right or right to left, the sequence of digits is identical.

### Example 1

> -   **Input:** head = \[1, 2, 3, 2, 1\]
> -   **Output:** true
> -   **Explanation:** The number represented by the doubly linked list is a palindrome number.

### Example 2

> -   **Input:** head = \[6, 6, 6\]
> -   **Output:** true
> -   **Explanation:** The number represented by the doubly linked list is a palindrome number.

### Example 3

> -   **Input:** head = \[1, 2, 3, 4, 5\]
> -   **Output:** false
> -   **Explanation:** The number represented by the doubly linked list is not a palindrome number.

## Solution

```cpp
/**
 * Definition for doubly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *prev;
 *     ListNode *next;
 *     ListNode() : val(0), prev(nullptr), next(nullptr) {}
 *     ListNode(int val) : val(val), prev(nullptr), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    bool palindromeNumber(ListNode *head, ListNode *tail) {

        // Empty list or single element is a palindrome
        if (!head || head == tail) {
            return true;
        }

        ListNode *left = head;
        ListNode *right = tail;

        while (left && right && left != right && left->prev != right) {

            // If values don't match, its not a palindrome
            if (left->val != right->val) {
                return false;
            }

            // Move the left pointer to the right
            left = left->next;

            // Move the right pointer to the left
            right = right->prev;
        }

        // If all values matched, it's a palindrome
        return true;
    }
};
```

***

# Two sum

## Problem Statement

Given the **head** and **tail** of a sorted doubly linked list along with an integer **target**, write a function to return all the pairs that sum up to the given target. You must do this without using any extra space. 

You can assume that the input will not have duplicates.

### Example 1

> -   **Input:** head = \[1, 2, 3, 4, 5\], target = 6
> -   **Output:** \[\[1, 5\], \[2, 4\]\]
> -   **Explanation:** The above pairs all sum up to the given target.

### Example 2

> -   **Input:** head = \[1, 2, 3, 4, 5\], target = 10
> -   **Output:** \[\]
> -   **Explanation:** No pair sum up to the target value. Therefore, we return an empty list.

### Example 3

> -   **Input:** head = \[1, 2, 3, 4, 5\], target = 9
> -   **Output:** \[\[4, 5\]\]
> -   **Explanation:** The above pairs all sum up to the given target.

## Solution

```cpp
/**
 * Definition for doubly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *prev;
 *     ListNode *next;
 *     ListNode() : val(0), prev(nullptr), next(nullptr) {}
 *     ListNode(int val) : val(val), prev(nullptr), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    vector<vector<int>> twoSum(
        ListNode *head,
        ListNode *tail,
        int target
    ) {

        // Check if the list is empty or has only one element
        if (head == nullptr || head->next == nullptr) {

            // Return an empty vector since there are no pairs to be
            // found
            return {};
        }

        // Store the pairs of values that sum up to the target
        vector<vector<int>> result;
        ListNode *left = head;
        ListNode *right = tail;

        // Iterate until either left or right becomes null or left's
        // value becomes greater than right's value
        while (left && right && left->val < right->val) {
            if (left->val + right->val == target) {

                // If the sum of left and right values is equal to the
                // target Add the pair to the result vector
                result.push_back(vector<int>{left->val, right->val});

                // Move left to the next node
                left = left->next;

                // Move right to the previous node
                right = right->prev;
            }

            // If the sum of left and right values is less than the
            // target Move left to the next node
            else if (left->val + right->val < target) {
                left = left->next;
            }

            // If the sum of left and right values is greater than
            // the target Move right to the previous node
            else {
                right = right->prev;
            }
        }

        // Return the vector containing pairs of values that sum up to
        // the target
        return result;
    }
};
```

***

# Two sum

***

# Duplicate aware two sum

## Problem Statement

Given the **head** and **tail** node of a doubly linked list sorted in non-decreasing order and an integer target, write a function to check if two numbers in the list sum up to the target. If such pairs exist, return all of them, if not return an empty array. You can return the answer in **any order**.

You must not return the same pair more than once i.e. all pairs should be unique.

### Example 1

> -   **Input:** head = \[1, 2, 2, 3, 4, 5\], target = 6
> -   **Output:** \[\[1, 5\], \[2, 4\]\]
> -   **Explanation:** The numbers 1 and 5, as well as the numbers 2 and 4, sum up to make the target 6.

### Example 2

> -   **Input:** head = \[1, 2, 2, 2, 2\], target = 3
> -   **Output:** \[\[1, 2\]\]
> -   **Explanation:** The numbers 1 and 2 sum up to 3.

### Example 3

> -   **Input:** head = \[2\], target = 2
> -   **Output:** \[\]
> -   **Explanation:** No pair sum up to 2.

## Solution

```cpp
/**
 * Definition for doubly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *prev;
 *     ListNode *next;
 *     ListNode() : val(0), prev(nullptr), next(nullptr) {}
 *     ListNode(int val) : val(val), prev(nullptr), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    ListNode *skipDuplicatesLeft(ListNode *left, ListNode *right) {
        while (left && left->next && left != right &&
               left->val == left->next->val) {
            left = left->next;
        }

        // Return the pointer to the next unique element
        return left->next;
    }

    ListNode *skipDuplicatesRight(ListNode *left, ListNode *right) {
        while (right && right->prev && left != right &&
               right->val == right->prev->val) {
            right = right->prev;
        }

        // Return the pointer to  the next unique element
        return right->prev;
    }

    vector<vector<int>> duplicateAwareTwoSum(
        ListNode *head,
        ListNode *tail,
        int target
    ) {

        // Check if the list is empty or has only one element
        if (head == nullptr || head->next == nullptr) {

            // Return an empty vector since there are no pairs to be
            // found
            return {};
        }

        // Store the pairs of values that sum up to the target
        vector<vector<int>> result;
        ListNode *left = head;
        ListNode *right = tail;

        // Use a while loop to traverse the array using the two pointers
        while (left && right && left != right && left->val <= right->val
        ) {
            int sum = left->val + right->val;

            // If the sum matches the target, add the pair to the
            // result list
            if (sum == target) {
                result.push_back({left->val, right->val});

                // Move the left pointer to the next unique element to
                // avoid duplicates
                left = skipDuplicatesLeft(left, right);

                // Move the right pointer to the previous unique element
                // to avoid duplicates
                right = skipDuplicatesRight(left, right);
            }

            // Move the left pointer to increase the sum
            else if (sum < target) {
                left = left->next;
            }

            // Move the right pointer to decrease the sum
            else {
                right = right->prev;
            }
        }

        return result;
    }
};
```

***

# Approximate three sum

## Problem Statement

Given the **head** of a doubly linked list sorted in non-decreasing order and an integer **target**, write a function to find three integers inthelist such that the sum is closest to the target. You must return the sum of the three integers.

You may assume that each input would have exactly one solution.

### Example 1

> -   **Input:** head = \[2, 7, 11, 15\], target = 3
> -   **Output:** 20
> -   **Explanation:** 2 + 7 + 11 = 20 is the sum of three numbers that is closest to the target.

### Example 2

> -   **Input:** head = \[-4, -1, 1, 2\], target = 1
> -   **Output:** 2
> -   **Explanation:** -1 + 2 + 1 = 2 is the sum of three numbers that is closest to the target.

### Example 3

> -   **Input:** head = \[0, 0, 0\], target = 1
> -   **Output:** 0
> -   **Explanation:** 0 + 0 + 0 = 0 is the sum of three numbers that is closest to the target.

## Solution

```cpp
#include <climits>

/**
 * Definition for doubly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *prev;
 *     ListNode *next;
 *     ListNode() : val(0), prev(nullptr), next(nullptr) {}
 *     ListNode(int val) : val(val), prev(nullptr), next(nullptr) {}
 * };
 */

using namespace std;

class Solution {
public:
    int closestTwoSum(ListNode *indexNode, ListNode *tail, int target) {
        ListNode *left = indexNode->next;
        ListNode *right = tail;
        int closestSum = INT_MAX;

        // Use a while loop to traverse the array using the two pointers
        while (left && right && left != right && left->prev != right) {

            // Compute the sum of the three numbers
            int sum = indexNode->val + left->val + right->val;

            // Update closestSum if necessary
            if (abs(sum - target) < abs(closestSum - target)) {
                closestSum = sum;
            }

            // If the sum equals target, return the sum
            if (sum == target) {
                return sum;
            }

            // Move the left pointer to increase the sum
            else if (sum < target) {
                left = left->next;
            }

            // Move the right pointer to decrease the sum
            else {
                right = right->prev;
            }
        }

        return closestSum;
    }

    int approximateThreeSum(ListNode *head, ListNode *tail, int target) {

        // Initialize closestSum to a large value
        int closestSum = INT_MAX;
        ListNode *currentNode = head;

        // Traverse each node in the list and calculate the closest
        // two-sum
        while (currentNode && currentNode->next) {
            int currentSum = closestTwoSum(currentNode, tail, target);

            // Update closestSum if a closer sum is found
            if (abs(currentSum - target) < abs(closestSum - target)) {
                closestSum = currentSum;
            }

            currentNode = currentNode->next;
        }

        return closestSum;
    }
};
```
