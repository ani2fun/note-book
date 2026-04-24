# 6. Pattern: Reversal (Subproblem)

## Table of contents

1. [Identifying reversal subproblem](#identifying-reversal-subproblem)
2. [Pairwise swap](#pairwise-swap)
3. [Reverse K-segments](#reverse-k-segments)
4. [Reverse increasing groups](#reverse-increasing-groups)
5. [Reverse alternate segments](#reverse-alternate-segments)

***

# Identifying reversal subproblem

Some problems may consist of smaller subproblems that can be solved using the reversal technique. Solving these subproblems may either partially or fully solve the original problem. These are usually **medium** or **hard** problems, as breaking down a problem into subproblems may not be obvious and may require some critical observation. These problems are also implementation-heavy, meaning the solution code is often big and complex, which makes it error-prone.

Asking yourself the following questions will help you determine whether a problem is a reversal subproblem pattern problem or not.

**Ask yourself questions:**

Q1. Can the problem or solution be broken down into smaller subproblems?

Q2. Can any subproblem be solved by reversing a part of the linked list?

## Example

Let's consider an example problem and see how to break it down into smaller subproblems that can be solved using the reversal algorithm to understand it better.

> **Problem statement:** Given a doubly linked list, reverse the list in groups of K in-place. If the last group in the list does not have K nodes, don't reverse it.

Consider the following example with`k = 3`for a linked list of size 7.

// Diagram: Reverse the given linked list in groups of k.

## Linked list reversal solution

Let's ask ourselves the questions we listed above to identify if we can reduce this problem to the two-pointer pattern problem.

**Template:**

Q1. Can the problem or solution be broken down into smaller subproblems?

A1. Yes, we can break down the solution as a combination `length / k` reversal operations, where `length` is the length of the linked list.

Q2. Can any subproblem be solved by reversing a part of the linked list?

A2. Yes, all subproblems except finding the length can be solved by reversing a part of the linked list.

The critical observation here is that reversing a group of size `k` is the same as reversing a part of the linked list between start and end. We traverse the linked list `k` nodes at a time and reverse each group as we go. We initialize a variable `groups` with the number of k-groups (`length / k`) to reverse. The number of k groups will always be a whole number, so we truncate the fractional part on division. We use the variable groups to iterate, and in each iteration, we reverse a k-group.

// Diagram: Calculate the length and the number of groups to reverse.

We initialize `start` and `end` with the `head` node and iterate `k-1` times using `end` to find the corresponding end for the first k-group. We then reverse the list between `start` and `end` using the reversal algorithm we learned earlier.

// Diagram: Reverse the first group between start and end using the reversal algorithm.

The reversed head of the first group will be the new head of the linked list, and so after the first reversal, we initialize a reference `newHead` with `end` as the new head of the doubly linked list.

// Diagram: The reversed head of the first group is the new head of the linked list.

Once the segment is reversed, the `start` for the next iteration will be the node after `start` , and so we update `start` to `start.next` and repeat the process. 

// Diagram: The node after the current start is the start of the next group

This process is repeated until all k-groups are reversed. The complete execution of the linked list reversal solution is given below.

// Diagram: Reverse the doubly linked list in groups of K

The linked list reversal algorithm can solve all the subproblems (reversals) of the given problem. The implementation of the reversal algorithm solution is given below. We create two helper functions to find the length of a linked list and reverse the list between `start` and `end` to keep the implementation simple and modular.

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
    int findLength(ListNode *head) {
        int length = 0;
        while (head != nullptr) {
            length++;
            head = head->next;
        }
        return length;
    }

    ListNode *getNodeAtPosition(ListNode *head, int position) {
        ListNode *current = head;
        for (int i = 1; i < position; ++i) {
            current = current->next;
        }
        return current;
    }

    void reverse(ListNode *start, ListNode *end) {
        if (start == nullptr || start == end) {
            return;
        }

        ListNode *leftBound = start->prev;
        ListNode *rightBound = end->next;
        ListNode *current = start;
        ListNode *previous = leftBound;

        while (current != rightBound) {
            ListNode *next = current->next;
            swap(current->prev, current->next);
            previous = current;
            current = next;
        }

        start->next = rightBound;
        if (rightBound != nullptr) {
            rightBound->prev = start;
        }

        end->prev = leftBound;
        if (leftBound != nullptr) {
            leftBound->next = end;
        }

// Diagram: ListNode reverseKSegments(ListNode head, int k) {

        // If the list is empty, has only one node, or k is 1, no need to
        // reverse segments
        if (head == nullptr || head->next == nullptr || k == 1) {
            return head;
        }

        // Start of the current segment to be reversed
        ListNode *start = head;

        // Find the total number of segments in the linked list
        int totalSegments = findLength(head) / k;

        // Loop through the list to reverse every k-length segment
        for (int i = 0; i < totalSegments; i++) {

            // Get the end node of the current segment
            ListNode *end = getNodeAtPosition(start, k);

            // Reverse the segment
            reverse(start, end);

            // Check if the existing head needs to be updated.
            if (end->prev == nullptr) {

                // If previous pointer of the end node (which become
                // start after the swap) is null, it means we're at the
                // first segment. So, we need to update the head to the
                // new head node
                head = end;
            }

            // Move start to the next segment
            start = start->next;
        }

        // Return the head of the modified list
        return head;
    }
};
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

class Solution {
    public int findLength(ListNode head) {
        int length = 0;
        while (head != null) {
            length++;
            head = head.next;
        }
        return length;
    }

    public ListNode getNodeAtPosition(ListNode head, int position) {
        ListNode current = head;
        for (int i = 1; i < position; i++) {
            current = current.next;
        }
        return current;
    }

    public void reverse(ListNode start, ListNode end) {
        if (start == null || start == end) {
            return;
        }

        ListNode leftBound = start.prev;
        ListNode rightBound = end.next;
        ListNode current = start;
        ListNode previous = leftBound;

        while (current != rightBound) {
            ListNode next = current.next;

            ListNode temp = current.prev;
            current.prev = current.next;
            current.next = temp;

            previous = current;
            current = next;
        }

        start.next = rightBound;
        if (rightBound != null) {
            rightBound.prev = start;
        }

        end.prev = leftBound;
        if (leftBound != null) {
            leftBound.next = end;
        }

// Diagram: public ListNode reverseKSegments(ListNode head, int k) {

        // If the list is empty, has only one node, or k is 1, no need to
        // reverse segments
        if (head == null || head.next == null || k == 1) {
            return head;
        }

        // Start of the current segment to be reversed
        ListNode start = head;

        // Find the total number of segments in the linked list
        int totalSegments = findLength(head) / k;

        // Loop through the list to reverse every k-length segment
        for (int i = 0; i < totalSegments; i++) {

            // Get the end node of the current segment
            ListNode end = getNodeAtPosition(start, k);

            // Reverse the segment
            reverse(start, end);

            // Check if the existing head needs to be updated.
            if (end.prev == null) {

                // If previous pointer of the end node (which becomes
                // start after the swap) is null, it means we're at the
                // first segment. So, we need to update the head to the
                // new head node
                head = end;
            }

            // Move start to the next segment
            start = start.next;
        }

        // Return the head of the modified list
        return head;
    }
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
    findLength(head: ListNode | null): number {
        let length = 0;
        while (head !== null) {
            length++;
            head = head.next;
        }
        return length;
    }

    getNodeAtPosition(
        head: ListNode | null,
        position: number
    ): ListNode | null {
        let current = head;
        for (let i = 1; i < position; ++i) {
            if (current === null) break;
            current = current.next;
        }
        return current;
    }

    reverse(start: ListNode | null, end: ListNode | null): void {
        if (start === null || start === end) {
            return;
        }

        let leftBound: ListNode | null = start.prev;
        let rightBound: ListNode | null = end!.next;
        let current: ListNode | null = start;
        let previous: ListNode | null = leftBound;

        while (current !== rightBound) {
            const next: ListNode | null = current.next;
            [current.prev, current.next] = [current.next, current.prev];
            previous = current;
            current = next;
        }

        start.next = rightBound;
        if (rightBound) {
            rightBound.prev = start;
        }

        end!.prev = leftBound;
        if (leftBound) {
            leftBound.next = end;
        }

// Diagram: reverseKSegments(head: ListNode | null, k: number): ListNode | null {

        // If the list is empty, has only one node, or k is 1, no need to
        // reverse segments
        if (head === null || head.next === null || k === 1) {
            return head;
        }

        // Start of the current segment to be reversed
        let start = head;

        // Find the total number of segments in the linked list
        let totalSegments = Math.floor(this.findLength(head) / k);

        // Loop through the list to reverse every k-length segment
        for (let i = 0; i < totalSegments; i++) {

            // Get the end node of the current segment
            let end = this.getNodeAtPosition(start, k);

            // Reverse the segment
            this.reverse(start, end);

            // Check if the existing head needs to be updated.
            if (end !== null && end.prev === null) {

                // If previous pointer of the end node (which becomes
                // start after the swap) is null, it means we're at the
                // first segment. So, we need to update the head to the
                // new head node
                head = end;
            }

            // Move start to the next segment
            start = start.next;
        }

        // Return the head of the modified list
        return head;
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
    findLength(head) {
        let length = 0;
        while (head !== null) {
            length++;
            head = head.next;
        }
        return length;
    }

    getNodeAtPosition(head, position) {
        let current = head;
        for (let i = 1; i < position; ++i) {
            if (current === null) break;
            current = current.next;
        }
        return current;
    }

    reverse(start, end) {
        if (start === null || start === end) {
            return;
        }

        let leftBound = start.prev;
        let rightBound = end.next;
        let current = start;
        let previous = leftBound;

        while (current !== rightBound) {
            let next = current.next;
            [current.prev, current.next] = [current.next, current.prev];
            previous = current;
            current = next;
        }

        start.next = rightBound;
        if (rightBound) {
            rightBound.prev = start;
        }

        end.prev = leftBound;
        if (leftBound) {
            leftBound.next = end;
        }

// Diagram: reverseKSegments(head, k) {

        // If the list is empty, has only one node, or k is 1, no need to
        // reverse segments
        if (head === null || head.next === null || k === 1) {
            return head;
        }

        // Start of the current segment to be reversed
        let start = head;

        // Find the total number of segments in the linked list
        let totalSegments = Math.floor(this.findLength(head) / k);

        // Loop through the list to reverse every k-length segment
        for (let i = 0; i < totalSegments; i++) {

            // Get the end node of the current segment
            let end = this.getNodeAtPosition(start, k);

            // Reverse the segment
            this.reverse(start, end);

            // Check if the existing head needs to be updated.
            if (end !== null && end.prev === null) {

                // If previous pointer of the end node (which becomes
                // start after the swap) is null, it means we're at the
                // first segment. So, we need to update the head to the
                // new head node
                head = end;
            }

            // Move start to the next segment
            start = start.next;
        }

        // Return the head of the modified list
        return head;
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

// Diagram: from typing import Optional

class Solution:
    def find_length(self, head: Optional[ListNode]) -> int:
        length = 0
        while head is not None:
            length += 1
            head = head.next
        return length

    def get_node_at_position(
        self, head: Optional[ListNode], position: int
    ) -> Optional[ListNode]:
        current = head
        for _ in range(1, position):
            if current is None:
                break
            current = current.next
        return current

    def reverse(
        self, start: Optional[ListNode], end: Optional[ListNode]
    ) -> None:
        if start is None or start == end:
            return

        left_bound = start.prev
        right_bound = end.next if end else None
        current = start
        previous = left_bound

        while current != right_bound:
            next_node = current.next
            current.prev, current.next = current.next, current.prev
            previous = current
            current = next_node

        if start:
            start.next = right_bound
        if right_bound:
            right_bound.prev = start

        if end:
            end.prev = left_bound
        if left_bound:
            left_bound.next = end

    def reverse_k_segments(
        self, head: Optional[ListNode], k: int
    ) -> Optional[ListNode]:

        # If the list is empty, has only one node, or k is 1, no need to
        # reverse segments
        if head is None or head.next is None or k == 1:
            return head

        # Start of the current segment to be reversed
        start = head

        # Find the total number of segments in the linked list
        total_segments = self.find_length(head) // k

        # Loop through the list to reverse every k-length segment
        for _ in range(total_segments):

            # Get the end node of the current segment
            end = self.get_node_at_position(start, k)

            # Reverse the segment
            self.reverse(start, end)

            # Check if the existing head needs to be updated.
            if end and end.prev is None:

                # If previous pointer of the end node (which becomes start
                # after the swap) is null, it means we're at the first
                # segment. So, we need to update the head to the new head
                # node
                head = end

            # Move start to the next segment
            start = start.next

        # Return the head of the modified list
        return head
```

The process above summarizes how we can identify a problem that can be broken down into smaller subproblems solvable by the reversal algorithm.

## Example problems

Most problems in this category are **medium** or **hard** problems, as subproblems may not be directly identifiable. Also, the implementation may be complex and require creating different functions, which can be error-prone. Below is a list of problems that fall under the reversal subproblem pattern.

> -   **[Pairwise swap](https://www.codeintuition.io/courses/doubly-linked-list/LloccimoAdOaA5jCVh3LA)**
> -   **[Reverse K-segments](https://www.codeintuition.io/courses/doubly-linked-list/MqIdyjaACWE6lCWQPkbor)**
> -   **[Reverse increasing groups](https://www.codeintuition.io/courses/doubly-linked-list/Bxh830bVxO2vpqteZxgi0)**
> -   **[Reverse alternate segments](https://www.codeintuition.io/courses/doubly-linked-list/6SUHrVVt18Q5cc7NOuJPp)**

We will now solve these problems to get a better understanding of breaking down a problem into subproblems solvable by the reversal algorithm.

***

# Pairwise swap

## Problem Statement

Given the **head** of a doubly linked list, write a function to **swap every two adjacent nodes** of this list and return the head of the reordered list.

The problem needs to be solved without modifying the values in the list's nodes. The nodes should be reordered by updating links

### Example

> -   **Input:** head = \[1, 2, 3, 4\]
> -   **Output:** \[2, 1, 4, 3\]
> -   **Explanation:** After swapping in pair, i.e. (1, 2) => (2, 1) and (3, 4) => (4, 3) the list becomes \[2, 1, 4, 3\].

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
    void reverse(ListNode *start, ListNode *end) {
        if (start == nullptr || start == end) {
            return;
        }

        ListNode *leftBound = start->prev;
        ListNode *rightBound = end->next;
        ListNode *current = start;
        ListNode *previous = leftBound;

        while (current != rightBound) {
            ListNode *next = current->next;
            swap(current->prev, current->next);
            previous = current;
            current = next;
        }

        start->next = rightBound;
        if (rightBound != nullptr) {
            rightBound->prev = start;
        }

        end->prev = leftBound;
        if (leftBound != nullptr) {
            leftBound->next = end;
        }
    }

    ListNode *pairwiseSwap(ListNode *head) {

        // If the list is empty or has only one element, no reversal
        // needed.
        if (head == nullptr || head->next == nullptr) {
            return head;
        }

        // Start of the current pair to be reversed
        ListNode *start = head;

        // Loop while there are pairs to be swapped
        while (start != nullptr && start->next != nullptr) {

            // Get the end node of the current pair
            ListNode *end = start->next;

            // Reverse the pair
            reverse(start, end);

            // Check if the existing head needs to be updated.
            if (end->prev == nullptr) {

                // If previous pointer of the end node (which become
                // start after the swap) is null, it means we're at the
                // first pair. So, we need to update the head to the new
                // head node
                head = end;
            }

            // Move start to the next pair
            start = start->next;
        }

        // Return the head of the modified list
        return head;
    }
};
```

***

# Reverse K-segments

## Problem Statement

Given the **head** of a doubly linked list and a positive integer **k**, write a function to reverse the list in groups of k and return the head of the reversed list.

If, at the end, the length of the remaining list is less than k, do not reverse that part of the list.

### Example 1

> -   **Input:** head = \[5, 7, 3, 10, 6, 8\], k = 3
> -   **Output:** \[3, 7, 5, 8, 6, 10\]
> -   **Explanation:** Since the value of k is 3, we reverse every three nodes from the start.

### Example 2

> -   **Input:** head = \[5, 7, 3, 10, 6\], k = 2
> -   **Output:** \[7, 5, 10, 3, 6\]
> -   **Explanation:** Since the value of k is 2, we reverse every two nodes from the start. At the end, one node remains, it is left as it is.

### Example 3

> -   **Input:** head = \[5, 7, 3, 10, 6\], k = 8
> -   **Output:** \[5, 7, 3, 10, 6\]
> -   **Explanation:** Since the value of k is 8, we cannot reverse any part of the list as the size of the entire list is 6, which is less than 8.

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
    int findLength(ListNode *head) {
        int length = 0;
        while (head != nullptr) {
            length++;
            head = head->next;
        }
        return length;
    }

    ListNode *getNodeAtPosition(ListNode *head, int position) {
        ListNode *current = head;
        for (int i = 1; i < position; ++i) {
            current = current->next;
        }
        return current;
    }

    void reverse(ListNode *start, ListNode *end) {
        if (start == nullptr || start == end) {
            return;
        }

        ListNode *leftBound = start->prev;
        ListNode *rightBound = end->next;
        ListNode *current = start;
        ListNode *previous = leftBound;

        while (current != rightBound) {
            ListNode *next = current->next;
            swap(current->prev, current->next);
            previous = current;
            current = next;
        }

        start->next = rightBound;
        if (rightBound != nullptr) {
            rightBound->prev = start;
        }

        end->prev = leftBound;
        if (leftBound != nullptr) {
            leftBound->next = end;
        }
    }

    ListNode *reverseKSegments(ListNode *head, int k) {

        // If the list is empty, has only one node, or k is 1, no need to
        // reverse segments
        if (head == nullptr || head->next == nullptr || k == 1) {
            return head;
        }

        // Start of the current segment to be reversed
        ListNode *start = head;

        // Find the total number of segments in the linked list
        int totalSegments = findLength(head) / k;

        // Loop through the list to reverse every k-length segment
        for (int i = 0; i < totalSegments; i++) {

            // Get the end node of the current segment
            ListNode *end = getNodeAtPosition(start, k);

            // Reverse the segment
            reverse(start, end);

            // Check if the existing head needs to be updated.
            if (end->prev == nullptr) {

                // If previous pointer of the end node (which become
                // start after the swap) is null, it means we're at the
                // first segment. So, we need to update the head to the
                // new head node
                head = end;
            }

            // Move start to the next segment
            start = start->next;
        }

        // Return the head of the modified list
        return head;
    }
};
```

***

# Reverse increasing groups

## Problem Statement

Given the **head** of a doubly linked list, write a function to reverse the list in groups of increasing size. The first group has size `1`, the next group size `2`, then `3`, and so on. Return the head of the reversed list.

If, at the end, the length of the remaining list is less than the required group size, do not reverse that part of the list.

### Example 1

> -   **Input:** head = \[5, 7, 3, 10, 6, 8\]
> -   **Output:** \[5, 3, 7, 8, 6, 10\]
> -   **Explanation:** We get the above list by reversing the first three groups of sizes 1, 2 and 3, respectively.

### Example 2

> -   **Input:** head = \[5, 7, 3, 10, 6\]
> -   **Output:** \[5, 3, 7, 10, 6\]
> -   **Explanation:** We get the above list b reversing the first two groups of sizes 1 and 2. Since the remaining nodes are fewer than the next group size (3), they remain unreversed.

### Example 3

> -   **Input:** head = \[5\]
> -   **Output:** \[5\]
> -   **Explanation:** We get the above list by reversing the first group of size 1.

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
    int findLength(ListNode *head) {
        int length = 0;
        while (head != nullptr) {
            length++;
            head = head->next;
        }
        return length;
    }

    ListNode *getNodeAtPosition(ListNode *head, int position) {
        ListNode *current = head;
        for (int i = 1; i < position; ++i) {
            current = current->next;
        }
        return current;
    }

    void reverse(ListNode *start, ListNode *end) {
        if (start == nullptr || start == end) {
            return;
        }

        ListNode *leftBound = start->prev;
        ListNode *rightBound = end->next;
        ListNode *current = start;
        ListNode *previous = leftBound;

        while (current != rightBound) {
            ListNode *next = current->next;
            swap(current->prev, current->next);
            previous = current;
            current = next;
        }

        start->next = rightBound;
        if (rightBound != nullptr) {
            rightBound->prev = start;
        }

        end->prev = leftBound;
        if (leftBound != nullptr) {
            leftBound->next = end;
        }
    }

    ListNode *reverseIncreasingGroups(ListNode *head) {

        // If the list is empty or has only one node, no need to
        // reverse segments
        if (head == nullptr || head->next == nullptr) {
            return head;
        }

        // Start of the current segment to be reversed
        ListNode *start = head;

        // Find the length of the linked list
        int length = findLength(head);

        // Start with a group size of 1
        int groupSize = 1;

        // Loop through the list to reverse segments of increasing size
        while (length >= groupSize) {

            // Get the end node of the current segment
            ListNode *end = getNodeAtPosition(start, groupSize);

            // Reverse the segment
            reverse(start, end);

            // Check if the existing head needs to be updated.
            if (end->prev == nullptr) {

                // If previous pointer of the end node (which become
                // start after the swap) is null, it means we're at the
                // first segment. So, we need to update the head to the
                // new head node
                head = end;
            }

            // Move start to the next segment
            start = start->next;

            // Decrement the remaining length by the size of the current
            // group
            length -= groupSize;

            // increment groupSize for the next segment
            groupSize++;
        }

        // Return the head of the modified list
        return head;
    }
};
```

***

# Reverse alternate segments

## Problem Statement

Given the **head** of a doubly linked list and a positive integer **k**, write a function to reverse alternate k nodes in the list and return the head of the reversed list.

If, at the end, the length of the remaining list is less than k, do not reverse that part of the list.

### Example 1

> -   **Input:** head = \[5, 7, 3, 10, 6, 8\], k = 2
> -   **Output:** \[7, 5, 3, 10, 8, 6\]
> -   **Explanation:** Since the value of k is 2, we reverse every alternate two nodes from the start, i.e., we reverse the first two nodes, skip the next two, and repeat the same pattern till the end of the list.

### Example 2

> -   **Input:** head = \[5, 7, 3, 10, 6\], k = 3
> -   **Output:** \[3, 7, 5, 10, 6\]
> -   **Explanation:** Since the value of k is 3, we reverse every three nodes from the start, i.e., we reverse the first three nodes, skip the next three, and repeat the same pattern till the end of the list.

### Example 3

> -   **Input:** head = \[5, 7, 3, 10, 6\], k = 8
> -   **Output:** \[5, 7, 3, 10, 6\]
> -   **Explanation:** Since the value of k is 8, we cannot reverse any part of the list as the size of the entire list is 6, which is less than 8.

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
    int findLength(ListNode *head) {
        int length = 0;
        while (head != nullptr) {
            length++;
            head = head->next;
        }
        return length;
    }

    ListNode *getNodeAtPosition(ListNode *head, int position) {
        ListNode *current = head;
        for (int i = 1; i < position; ++i) {
            current = current->next;
        }
        return current;
    }

    void reverse(ListNode *start, ListNode *end) {
        if (start == nullptr || start == end) {
            return;
        }

        ListNode *leftBound = start->prev;
        ListNode *rightBound = end->next;
        ListNode *current = start;
        ListNode *previous = leftBound;

        while (current != rightBound) {
            ListNode *next = current->next;
            swap(current->prev, current->next);
            previous = current;
            current = next;
        }

        start->next = rightBound;
        if (rightBound != nullptr) {
            rightBound->prev = start;
        }

        end->prev = leftBound;
        if (leftBound != nullptr) {
            leftBound->next = end;
        }
    }

    ListNode *reverseAlternateSegments(ListNode *head, int k) {

        // If the list is empty, has only one node, or k is 1, no need to
        // reverse segments
        if (head == nullptr || head->next == nullptr || k == 1) {
            return head;
        }

        // Flag to determine whether to reverse the current segment.
        bool shouldReverse = true;

        // Start of the current segment to be reversed
        ListNode *start = head;

        // Find the total number of segments in the linked list
        int totalSegments = findLength(head) / k;

        // Loop through the list to reverse every k-length segment
        for (int i = 0; i < totalSegments; i++) {

            // Get the end node of the current segment
            ListNode *end = getNodeAtPosition(start, k);

            // Reverse the current segment if the flag is set.
            if (shouldReverse) {

                // Reverse the segment
                reverse(start, end);

                // If previous pointer of the end node (which become
                // start after the swap) is null, it means we're at
                // the first segment. So, we need to update the head
                // to the new head node
                if (end->prev == nullptr) {
                    head = end;
                }

            }

            // Otherwise skip reversing this segment, move start to the
            // end of the segment.
            else {
                start = end;
            }

            // Move start to the next segment
            start = start->next;

            // Toggle the flag for the next segment
            shouldReverse = !shouldReverse;
        }

        // Return the head of the modified list
        return head;
    }
};
```
