# Array implementation of heaps

## Table of Contents

1. [Structure of array based heap](#structure-of-array-based-heap)
2. [Inserting an item in the heap](#inserting-an-item-in-the-heap)
3. [Deleting an item from the heap](#deleting-an-item-from-the-heap)
4. [Peeking the top item in the heap](#peeking-the-top-item-in-the-heap)
5. [Extracting the top item from the heap](#extracting-the-top-item-from-the-heap)
6. [Constructing a heap](#constructing-a-heap)
7. [Min heap to max heap](#min-heap-to-max-heap)
8. [Max heap to min heap](#max-heap-to-min-heap)

***

# Structure of array based heap

Now that we know that a heap is a complete binary tree, it is easy to understand how it is implemented using an array. We can easily identify a pattern if we enumerate the nodes of a complete binary tree starting with 0 at the root. We can see that for any given node, the enumeration for its child nodes and parent can easily be calculated using simple maths.

// Diagram: Enumeration of nodes in a complete binary tree

> For any given node at the given \`index\` :
>
> -   **Parent** = (\`index\` - \`1\`) / \`2\`
> -   **Left child** = (\`2\` \* \`index\`) + \`1\`
> -   **Right child** = (\`2\` \* \`index\`) + \`2\`

We can use the enumeration of a complete binary tree to implement the tree in an array. The enumeration of a node can be used as an index in an array that stores the value of the respective node.

// Diagram: The enumeration of nodes is used as index in array to store a complete binary tree

## Structure of a node

Since the heap is just a complete binary tree, the node only stores the data in the array implementation and has no left or right pointers. Simple multiplication and division can be used to move from a parent node to a child and vice versa. 

// Diagram: A heap node is just a datatype for an array element

## Structure in memory

What looks like a tree on paper looks very different when implemented as an array in the computer memory. The array implementation of a heap is just a simple array stored in a contiguous segment of memory.

// Diagram: Array implementation of a heap in computer memory

Now that we know how a heap is implemented using an array, we can dive deeper into the operations it supports and their implementation. Using an array to implement a heap makes implementing all supported operations easier, as we will learn later in the course.

***

# Inserting an item in the heap

The insert operation is a primary operation on a heap used to insert a value. The implementation is encapsulated in the insert function, which inserts a new node in the binary tree and ensures the resulting tree still follows the max-heap property. Let us look at the algorithm and implementation of the insert operation on a max heap implemented as an array.

## Algorithm

The algorithm for inserting a new value in a heap is quite simple. Since the heap is a complete binary tree, we insert a new node at the first available free spot. When implemented in an array, this free spot is the index after the last element of the heap in the array.

The newly inserted node might violate the heap property in the resulting tree, so we recalibrate the tree to enforce the heap property. To do this, we traverse **upwards** from the newly inserted node and compare the current node with its parent at each iteration. If the value at the child node is larger than the parent, we swap the nodes. The traversal stops when we reach the root node, or the current node is no longer larger than its parent.

This way, at the end of the insert operation, the resulting binary tree still follows the heap property and remains a heap.

// Diagram: Insert a new node (18) in the given max heap

> **Algorithm**
>
> -   **Step 1:** Insert the new element at the end of the array
> -   **Step 2:** Traverse upwards in the tree from the node, moving the larger value up to enforce max heap property.

## Up Heapify

The insertion algorithm inserts a new node at the end of the heap and re-enforces the heap property going **upwards** from that node. This process is also sometimes called **up-heapify**. It is generally applied when a new node is inserted, or the value of a node changes, and the subtree rooted at the new/updated node still follows the heap property. There may be a possibility that nodes above it may now violate the heap property, and so this information has to be propagated upwards.

// Diagram: The up heapify operation

## Implementation

The array implementation uses a fixed-sized array, so we perform capacity checks before inserting the new node into the tree. If there is enough room to add a new node, we add it at the end and iteratively traverse up the tree to move the larger value upwards to re-enforce the heap property.

C++

```cpp
using namespace std;

class MaxHeap {
public:
    vector<int> heap;

    // Helper function to restore heap property upwards (used in insert)
    void upHeapify(int index) {
        int parent = (index - 1) / 2;
        while (index > 0 && heap[parent] < heap[index]) {
            swap(heap[index], heap[parent]);
            index = parent;
            parent = (index - 1) / 2;
        }

// Diagram: void insert(int val) {

        // Insert the new value at the end of the heap
        heap.push_back(val);

        // Get the index of the new value
        int index = heap.size() - 1;

        // Restore the max heap property by comparing with parent nodes
        upHeapify(index);
    }
};
```

Java

```java
import java.util.*;

class MaxHeap {
    List<Integer> heap;

    public MaxHeap() {
        heap = new ArrayList<>();
    }

    private void swap(int i, int j) {
        int temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }

    // Helper function to restore heap property upwards (used in insert)
    private void upHeapify(int index) {
        int parent = (index - 1) / 2;
        while (index > 0 && heap.get(parent) < heap.get(index)) {
            swap(index, parent);
            index = parent;
            parent = (index - 1) / 2;
        }

// Diagram: public void insert(int val) {

        // Insert the new value at the end of the heap
        heap.add(val);

        // Get the index of the new value
        int index = heap.size() - 1;

        // Restore the max heap property by comparing with parent nodes
        upHeapify(index);
    }
```

Typescript

```typescript
export class MaxHeap {
    heap: number[];

    constructor() {
        this.heap = [];
    }

    swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    // Helper function to restore heap property upwards (used in insert)
    upHeapify(index: number): void {
        let parent = Math.floor((index - 1) / 2);
        while (index > 0 && this.heap[parent] < this.heap[index]) {
            this.swap(index, parent);
            index = parent;
            parent = Math.floor((index - 1) / 2);
        }

// Diagram: insert(val: number): void {

        // Insert the new value at the end of the heap
        this.heap.push(val);

        // Get the index of the new value
        let index = this.heap.length - 1;

        // Restore the max heap property by comparing with parent nodes
        this.upHeapify(index);
    }
```

Javascript

```javascript
export class MaxHeap {
    constructor() {
        this.heap = [];
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    // Helper function to restore heap property upwards (used in insert)
    upHeapify(index) {
        let parent = Math.floor((index - 1) / 2);
        while (index > 0 && this.heap[parent] < this.heap[index]) {
            this.swap(index, parent);
            index = parent;
            parent = Math.floor((index - 1) / 2);
        }

// Diagram: insert(val) {

        // Insert the new value at the end of the heap
        this.heap.push(val);

        // Restore the max heap property by comparing with parent nodes
        this.upHeapify(this.heap.length - 1);
    }
```

Python

```python
from typing import List

class MaxHeap:
    def __init__(self) -> None:
        self.heap: List[int] = []

    # Helper function to restore heap property upwards (used in insert)
    def up_heapify(self, index: int) -> None:
        parent = (index - 1) // 2
        while index > 0 and self.heap[parent] < self.heap[index]:
            self.heap[parent], self.heap[index] = self.heap[index], self.heap[parent]
            index, parent = parent, (parent - 1) // 2

    def insert(self, val: int) -> None:

        # Insert the new value at the end of the heap
        self.heap.append(val)

        # Get the index of the new value
        index = len(self.heap) - 1

        # Restore the max heap property by comparing with parent nodes
        self.up_heapify(index)
```

## Complexity analysis

The insert operation updates the value at an index in the internal array, a constant-time operation. However, after that, it traverses the binary tree upwards. In the best case, the newly inserted node might have a value smaller than its parent, so we won't need to traverse upwards, and the best-case time complexity would be **constant O(1)**.

In the worst case, however, the newly created node might have the largest value in the tree, so we would have to traverse upwards to the root node. Since the height of a complete binary tree is log(N), the time complexity in this case would be**O(log(N))**.

// Diagram: Best and worst case for insertion in a heap

To insert a new value, we do not create a new data structure that depends on the size of stored data or input. We only create a fixed number of temporary variables, so the space complexity is **constant O(1)**.

> **Best Case:** The given value is smaller than its first parent
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case:** The given value greater than the current maximum value in the tree
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(log(N))**

***

# Deleting an item from the heap

The delete operation is another primary operation on a heap and is used to delete a given node (by address) from the tree. The implementation is encapsulated in the delete function, which deletes the given node in the binary tree and ensures the resulting tree still follows the max-heap property. Let us look at the algorithm and implementation of the delete operation on a max heap implemented as an array.

## Algorithm

The algorithm for deleting a new value in a heap is quite similar to insert. However, we cannot delete a non-leaf node, which would break the tree. To overcome this, we swap the value at the given node with the last node in the binary tree. Since the last node is a leaf node, we can easily delete it.

Swapping the value from the last node to the given node might violate the heap property in the resulting tree, so we need to recalibrate it to enforce the heap property. To do this, we traverse **downwards** from the given node (that now has the swapped value) and, at each iteration, compare the current node with its children. If the value of any child node is larger than the parent, we swap the nodes and continue traversal in that direction. The traversal stops when we reach a leaf node, or the current node is larger than its children.

This way, at the end of the delete operation, the resulting binary tree still follows the heap property and remains a heap.

// Diagram: Delete the given node (15) from the heap

> **Algorithm**
>
> -   **Step 1:** Swap the value at the given node with the last node in the tree.
> -   **Step 2:** Delete the last node.
> -   **Step 3:** Traverse downwards in the tree from the given node, moving the smaller value down to enforce the max heap property.

## Down Heapify

The deletion algorithm updates the value of the root node of the heap and re-enforces the heap property going **downwards** from the root. This process is also sometimes called **down-heapify** and is generally applied in cases when the value of a node changes, which may cause the subtree rooted at that node to violate the heap property. Unlike up-heapify, down-heapify is applied when the nodes above the updated node still follow the heap property. Still, there may be a possibility that the nodes below it now violate the heap property, and so new information has to be propagated downwards.

// Diagram: The down heapify operation

## Implementation

We perform bounds checks to ensure the given node exists in the heap. If the given node is within the segment in the array that holds the heap, we swap the value in the given node with the last node in the tree and then delete the last node. Next, we iteratively traverse the tree to move the smaller value downwards to re-enforce the heap property.

C++

```cpp
using namespace std;

class MaxHeap {
public:
    vector<int> heap;

    // Helper function to restore heap property upwards (used in insert)
    void upHeapify(int index) {
        int parent = (index - 1) / 2;
        while (index > 0 && heap[parent] < heap[index]) {
            swap(heap[index], heap[parent]);
            index = parent;
            parent = (index - 1) / 2;
        }

    // Helper function to maintain the max heap property downwards
    void downHeapify(int index) {
        int largest = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        // Find the largest among the node and its left child
        if (left < heap.size() && heap[left] > heap[largest]) {
            largest = left;
        }

        // Find the largest among the node and its right child
        if (right < heap.size() && heap[right] > heap[largest]) {
            largest = right;
        }

        // If the largest is not the current node, swap and continue
        // heapify
        if (largest != index) {
            swap(heap[index], heap[largest]);
            downHeapify(largest);
        }

// Diagram: void insert(int val) {

        // Insert the new value at the end of the heap
        heap.push_back(val);

        // Get the index of the new value
        int index = heap.size() - 1;

        // Restore the max heap property by comparing with parent nodes
        upHeapify(index);
    }

// Diagram: void remove(int index) {

        // Replace the value with the largest possible value and heapify
        heap[index] = heap.back();

        // Remove the last node
        heap.pop_back();

        // Restore the max heap property
        downHeapify(index);
    }
};
```

Java

```java
import java.util.*;

class MaxHeap {
    List<Integer> heap;

    public MaxHeap() {
        heap = new ArrayList<>();
    }

    private void swap(int i, int j) {
        int temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }

    // Helper function to restore heap property upwards (used in insert)
    private void upHeapify(int index) {
        int parent = (index - 1) / 2;
        while (index > 0 && heap.get(parent) < heap.get(index)) {
            swap(index, parent);
            index = parent;
            parent = (index - 1) / 2;
        }

    // Helper function to maintain the max heap property downwards
    private void downHeapify(int index) {
        int largest = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        // Find the largest among the node and its left child
        if (left < heap.size() && heap.get(left) > heap.get(largest)) {
            largest = left;
        }

        // Find the largest among the node and its right child
        if (right < heap.size() && heap.get(right) > heap.get(largest)) {
            largest = right;
        }

        // If the largest is not the current node, swap and continue
        // heapify
        if (largest != index) {
            swap(index, largest);
            downHeapify(largest);
        }

// Diagram: public void insert(int val) {

        // Insert the new value at the end of the heap
        heap.add(val);

        // Get the index of the new value
        int index = heap.size() - 1;

        // Restore the max heap property by comparing with parent nodes
        upHeapify(index);
    }

// Diagram: public void remove(int index) {

        // Replace the value with the largest possible value and heapify
        heap.set(index, heap.get(heap.size() - 1));

        // Remove the last node
        heap.remove(heap.size() - 1);

        // Restore the max heap property
        downHeapify(index);
    }
```

Typescript

```typescript
export class MaxHeap {
    heap: number[];

    constructor() {
        this.heap = [];
    }

    swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    // Helper function to restore heap property upwards (used in insert)
    upHeapify(index: number): void {
        let parent = Math.floor((index - 1) / 2);
        while (index > 0 && this.heap[parent] < this.heap[index]) {
            this.swap(index, parent);
            index = parent;
            parent = Math.floor((index - 1) / 2);
        }

    // Helper function to maintain the max heap property downwards
    downHeapify(index: number): void {
        let largest = index;
        let left = 2 * index + 1;
        let right = 2 * index + 2;

        // Find the largest among the node and its left child
        if (
            left < this.heap.length &&
            this.heap[left] > this.heap[largest]
        ) {
            largest = left;
        }

        // Find the largest among the node and its right child
        if (
            right < this.heap.length &&
            this.heap[right] > this.heap[largest]
        ) {
            largest = right;
        }

        // If the largest is not the current node, swap and continue
        // heapify
        if (largest !== index) {
            this.swap(index, largest);
            this.downHeapify(largest);
        }

// Diagram: insert(val: number): void {

        // Insert the new value at the end of the heap
        this.heap.push(val);

        // Get the index of the new value
        let index = this.heap.length - 1;

        // Restore the max heap property by comparing with parent nodes
        this.upHeapify(index);
    }

// Diagram: remove(index: number): void {

        // Replace the value with the largest possible value and heapify
        this.heap[index] = this.heap[this.heap.length - 1];

        // Remove the last node
        this.heap.pop();

        // Restore the max heap property
        this.downHeapify(index);
    }
```

Javascript

```javascript
export class MaxHeap {
    constructor() {
        this.heap = [];
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    // Helper function to restore heap property upwards (used in insert)
    upHeapify(index) {
        let parent = Math.floor((index - 1) / 2);
        while (index > 0 && this.heap[parent] < this.heap[index]) {
            this.swap(index, parent);
            index = parent;
            parent = Math.floor((index - 1) / 2);
        }

    // Helper function to maintain the max heap property downwards
    downHeapify(index) {
        let largest = index;
        let left = 2 * index + 1;
        let right = 2 * index + 2;

        // Find the largest among the node and its left child
        if (
            left < this.heap.length &&
            this.heap[left] > this.heap[largest]
        ) {
            largest = left;
        }

        // Find the largest among the node and its right child
        if (
            right < this.heap.length &&
            this.heap[right] > this.heap[largest]
        ) {
            largest = right;
        }

        // If the largest is not the current node, swap and continue
        // heapify
        if (largest !== index) {
            this.swap(index, largest);
            this.downHeapify(largest);
        }

// Diagram: insert(val) {

        // Insert the new value at the end of the heap
        this.heap.push(val);

        // Restore the max heap property by comparing with parent nodes
        this.upHeapify(this.heap.length - 1);
    }

// Diagram: remove(index) {

        // Replace the value with the largest possible value and heapify
        this.heap[index] = this.heap.pop();

        // Restore the max heap property
        this.downHeapify(index);
    }
```

Python

```python
from typing import List

class MaxHeap:
    def __init__(self) -> None:
        self.heap: List[int] = []

    # Helper function to restore heap property upwards (used in insert)
    def up_heapify(self, index: int) -> None:
        parent = (index - 1) // 2
        while index > 0 and self.heap[parent] < self.heap[index]:
            self.heap[parent], self.heap[index] = self.heap[index], self.heap[parent]
            index, parent = parent, (parent - 1) // 2

    # Helper function to maintain the max heap property downwards
    def down_heapify(self, index: int) -> None:
        largest = index
        left, right = 2 * index + 1, 2 * index + 2

        # Find the largest among the node and its left child
        if left < len(self.heap) and self.heap[left] > self.heap[largest]:
            largest = left

        # Find the largest among the node and its right child
        if right < len(self.heap) and self.heap[right] > self.heap[largest]:
            largest = right

        # If the largest is not the current node, swap and continue heapify
        if largest != index:
            self.heap[index], self.heap[largest] = self.heap[largest], self.heap[index]
            self.down_heapify(largest)

    def insert(self, val: int) -> None:

        # Insert the new value at the end of the heap
        self.heap.append(val)

        # Get the index of the new value
        index = len(self.heap) - 1

        # Restore the max heap property by comparing with parent nodes
        self.up_heapify(index)

    def remove(self, index: int) -> None:

        # Replace the value with the largest possible value and heapify
        self.heap[index] = self.heap[-1]

        # Remove the last node
        self.heap.pop()

        # Restore the max heap property
        self.down_heapify(index)
```

## Complexity analysis

The delete operation swaps the values at two indices and decrements the size to perform a soft deletion, a constant-time operation. However, after that, it traverses the binary tree downwards. In the best case, the given node might be a leaf node, or the swapped value might be larger than the children of the given nodes. In any of these cases, we won't need to traverse upwards, so deletion would be a **constant O(1)** operation.

In the worst case, however, the given node might be the root node, and the swapped value might be the smallest in the heap. In this case, we would have to traverse downwards from the root to a leaf node. Since the height of a complete binary tree is log(N), the time complexity in this case would be**O(log(N))**.

// Diagram: Best and worst case for deletion in a heap

To delete a new value, we do not create any new data structure that depends on the size of stored data or input. We only create a fixed number of temporary variables, so the space complexity, in any case, is **constant O(1)**.

> **Best Case** - Delete the value at a leaf node
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case** - Delete the value at root node
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(log(N))**

***

# Peeking the top item in the heap

The peek operation gets the maximum value from a max heap. The implementation is encapsulated in the peek function that copies the root node's value in the binary tree to the passed reference. Let us look at the algorithm and implementation of the peek operation on a max heap implemented as an array.

## Algorithm

The algorithm for getting the maximum value in a max-heap is very simple. We return the value stored at the root node of the tree. Since we do not modify the tree, the resulting binary tree still follows the heap property and remains a heap.

// Diagram: Get the maximum value in the max heap

> **Algorithm**
>
> -   **Step 1:** Return the value stored in the root node of the tree.

## Implementation

We perform size checks to ensure the root node exists in the heap. If the heap has a non-zero number of data items, we copy the value at the root to the passed reference.

C++

```cpp
using namespace std;

class MaxHeap {
public:
    vector<int> heap;

    // Helper function to restore heap property upwards (used in insert)
    void upHeapify(int index) {
        int parent = (index - 1) / 2;
        while (index > 0 && heap[parent] < heap[index]) {
            swap(heap[index], heap[parent]);
            index = parent;
            parent = (index - 1) / 2;
        }

    // Helper function to maintain the max heap property downwards
    void downHeapify(int index) {
        int largest = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        // Find the largest among the node and its left child
        if (left < heap.size() && heap[left] > heap[largest]) {
            largest = left;
        }

        // Find the largest among the node and its right child
        if (right < heap.size() && heap[right] > heap[largest]) {
            largest = right;
        }

        // If the largest is not the current node, swap and continue
        // heapify
        if (largest != index) {
            swap(heap[index], heap[largest]);
            downHeapify(largest);
        }

// Diagram: void insert(int val) {

        // Insert the new value at the end of the heap
        heap.push_back(val);

        // Get the index of the new value
        int index = heap.size() - 1;

        // Restore the max heap property by comparing with parent nodes
        upHeapify(index);
    }

// Diagram: void remove(int index) {

        // Replace the value with the largest possible value and heapify
        heap[index] = heap.back();

        // Remove the last node
        heap.pop_back();

        // Restore the max heap property
        downHeapify(index);
    }

    int getMax() {
        if (heap.empty()) {
            return -1;
        }

        // Return the root node
        return heap[0];
    }
};
```

Java

```java
using namespace std;

class MaxHeap {
public:
    vector<int> heap;

    // Helper function to restore heap property upwards (used in insert)
    void upHeapify(int index) {
        int parent = (index - 1) / 2;
        while (index > 0 && heap[parent] < heap[index]) {
            swap(heap[index], heap[parent]);
            index = parent;
            parent = (index - 1) / 2;
        }

    // Helper function to maintain the max heap property downwards
    void downHeapify(int index) {
        int largest = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        // Find the largest among the node and its left child
```

Typescript

```typescript
export class MaxHeap {
    heap: number[];

    constructor() {
        this.heap = [];
    }

    swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    // Helper function to restore heap property upwards (used in insert)
    upHeapify(index: number): void {
        let parent = Math.floor((index - 1) / 2);
        while (index > 0 && this.heap[parent] < this.heap[index]) {
            this.swap(index, parent);
            index = parent;
            parent = Math.floor((index - 1) / 2);
        }

    // Helper function to maintain the max heap property downwards
    downHeapify(index: number): void {
        let largest = index;
        let left = 2 * index + 1;
        let right = 2 * index + 2;

        // Find the largest among the node and its left child
        if (
            left < this.heap.length &&
            this.heap[left] > this.heap[largest]
        ) {
            largest = left;
        }

        // Find the largest among the node and its right child
        if (
            right < this.heap.length &&
            this.heap[right] > this.heap[largest]
        ) {
            largest = right;
        }

        // If the largest is not the current node, swap and continue
        // heapify
        if (largest !== index) {
            this.swap(index, largest);
            this.downHeapify(largest);
        }

// Diagram: insert(val: number): void {

        // Insert the new value at the end of the heap
        this.heap.push(val);

        // Get the index of the new value
        let index = this.heap.length - 1;

        // Restore the max heap property by comparing with parent nodes
        this.upHeapify(index);
    }

// Diagram: remove(index: number): void {

        // Replace the value with the largest possible value and heapify
        this.heap[index] = this.heap[this.heap.length - 1];

        // Remove the last node
        this.heap.pop();

        // Restore the max heap property
        this.downHeapify(index);
    }

    getMax(): number {
        if (this.heap.length === 0) {
            return -1;
        }

        // Return the root node
        return this.heap[0];
    }
```

Javascript

```javascript
export class MaxHeap {
    constructor() {
        this.heap = [];
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    // Helper function to restore heap property upwards (used in insert)
    upHeapify(index) {
        let parent = Math.floor((index - 1) / 2);
        while (index > 0 && this.heap[parent] < this.heap[index]) {
            this.swap(index, parent);
            index = parent;
            parent = Math.floor((index - 1) / 2);
        }

    // Helper function to maintain the max heap property downwards
    downHeapify(index) {
        let largest = index;
        let left = 2 * index + 1;
        let right = 2 * index + 2;

        // Find the largest among the node and its left child
        if (
            left < this.heap.length &&
            this.heap[left] > this.heap[largest]
        ) {
            largest = left;
        }

        // Find the largest among the node and its right child
        if (
            right < this.heap.length &&
            this.heap[right] > this.heap[largest]
        ) {
            largest = right;
        }

        // If the largest is not the current node, swap and continue
        // heapify
        if (largest !== index) {
            this.swap(index, largest);
            this.downHeapify(largest);
        }

// Diagram: insert(val) {

        // Insert the new value at the end of the heap
        this.heap.push(val);

        // Restore the max heap property by comparing with parent nodes
        this.upHeapify(this.heap.length - 1);
    }

// Diagram: remove(index) {

        // Replace the value with the largest possible value and heapify
        this.heap[index] = this.heap.pop();

        // Restore the max heap property
        this.downHeapify(index);
    }

    getMax() {
        return this.heap.length === 0 ? -1 : this.heap[0];
    }
```

Python

```python
from typing import List

class MaxHeap:
    def __init__(self) -> None:
        self.heap: List[int] = []

    # Helper function to restore heap property upwards (used in insert)
    def up_heapify(self, index: int) -> None:
        parent = (index - 1) // 2
        while index > 0 and self.heap[parent] < self.heap[index]:
            self.heap[parent], self.heap[index] = self.heap[index], self.heap[parent]
            index, parent = parent, (parent - 1) // 2

    # Helper function to maintain the max heap property downwards
    def down_heapify(self, index: int) -> None:
        largest = index
        left, right = 2 * index + 1, 2 * index + 2

        # Find the largest among the node and its left child
        if left < len(self.heap) and self.heap[left] > self.heap[largest]:
            largest = left

        # Find the largest among the node and its right child
        if right < len(self.heap) and self.heap[right] > self.heap[largest]:
            largest = right

        # If the largest is not the current node, swap and continue heapify
        if largest != index:
            self.heap[index], self.heap[largest] = self.heap[largest], self.heap[index]
            self.down_heapify(largest)

    def insert(self, val: int) -> None:

        # Insert the new value at the end of the heap
        self.heap.append(val)

        # Get the index of the new value
        index = len(self.heap) - 1

        # Restore the max heap property by comparing with parent nodes
        self.up_heapify(index)

    def remove(self, index: int) -> None:

        # Replace the value with the largest possible value and heapify
        self.heap[index] = self.heap[-1]

        # Remove the last node
        self.heap.pop()

        # Restore the max heap property
        self.down_heapify(index)

    def get_max(self) -> int:
        if not self.heap:
            return -1

        # Return the root node
        return self.heap[0]
```

## Complexity analysis

The peek operation only copies the value at the root node, so the best and worst-case time complexity is **constant O(1)**.

We do not create any new data structure that depends on the size of stored data or input and only create a fixed number of temporary variables, so the space complexity is **constant O(1)** in any case.

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

# Extracting the top item from the heap

The extract operation extracts the maximum value from a max heap. Unlike the peek operation, it also deletes the node with the maximum value from the heap. The implementation is encapsulated in the extract function that deletes the root node in the binary tree and returns its value while ensuring that the resulting binary tree is still a heap. Let us look at the algorithm and implementation of the extract operation on a max heap implemented as an array.

## Algorithm

The algorithm for extracting the maximum value in a max-heap is very simple. It combines peek and delete operations. We copy the value at the tree's root node to return it later and then delete the root node using the delete operation. The delete operation ensures that the resulting binary tree still follows the heap property and remains a heap.

// Diagram: Delete the given node (15) from the heap

> **Algorithm**
>
> -   **Step 1:** Copy the value of the root node in the given reference
> -   **Step 2:** Delete the root node

## Implementation

We perform size checks to ensure the root node exists in the heap. If the heap has a non-zero number of data items, we copy the value at the root and delete it using the delete function implemented earlier. 

C++

```cpp
using namespace std;

class MaxHeap {
public:
    vector<int> heap;

    // Helper function to restore heap property upwards (used in insert)
    void upHeapify(int index) {
        int parent = (index - 1) / 2;
        while (index > 0 && heap[parent] < heap[index]) {
            swap(heap[index], heap[parent]);
            index = parent;
            parent = (index - 1) / 2;
        }

    // Helper function to maintain the max heap property downwards
    void downHeapify(int index) {
        int largest = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        // Find the largest among the node and its left child
        if (left < heap.size() && heap[left] > heap[largest]) {
            largest = left;
        }

        // Find the largest among the node and its right child
        if (right < heap.size() && heap[right] > heap[largest]) {
            largest = right;
        }

        // If the largest is not the current node, swap and continue
        // heapify
        if (largest != index) {
            swap(heap[index], heap[largest]);
            downHeapify(largest);
        }

// Diagram: void insert(int val) {

        // Insert the new value at the end of the heap
        heap.push_back(val);

        // Get the index of the new value
        int index = heap.size() - 1;

        // Restore the max heap property by comparing with parent nodes
        upHeapify(index);
    }

// Diagram: void remove(int index) {

        // Replace the value with the largest possible value and heapify
        heap[index] = heap.back();

        // Remove the last node
        heap.pop_back();

        // Restore the max heap property
        downHeapify(index);
    }

    int getMax() {
        if (heap.empty()) {
            return -1;
        }

        // Return the root node
        return heap[0];
    }

    int extractMax() {
        if (heap.empty()) {
            return -1;
        }

        // Extract the root node
        int root = heap[0];

        // Delete the root node
        remove(0);

        // Return the extracted root node
        return root;
    }
};
```

Java

```java
import java.util.*;

class MaxHeap {
    List<Integer> heap;

    public MaxHeap() {
        heap = new ArrayList<>();
    }

    private void swap(int i, int j) {
        int temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }

    // Helper function to restore heap property upwards (used in insert)
    private void upHeapify(int index) {
        int parent = (index - 1) / 2;
        while (index > 0 && heap.get(parent) < heap.get(index)) {
            swap(index, parent);
            index = parent;
            parent = (index - 1) / 2;
        }

    // Helper function to maintain the max heap property downwards
    private void downHeapify(int index) {
        int largest = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        // Find the largest among the node and its left child
        if (left < heap.size() && heap.get(left) > heap.get(largest)) {
            largest = left;
        }

        // Find the largest among the node and its right child
        if (right < heap.size() && heap.get(right) > heap.get(largest)) {
            largest = right;
        }

        // If the largest is not the current node, swap and continue
        // heapify
        if (largest != index) {
            swap(index, largest);
            downHeapify(largest);
        }

// Diagram: public void insert(int val) {

        // Insert the new value at the end of the heap
        heap.add(val);

        // Get the index of the new value
        int index = heap.size() - 1;

        // Restore the max heap property by comparing with parent nodes
        upHeapify(index);
    }

// Diagram: public void remove(int index) {

        // Replace the value with the largest possible value and heapify
        heap.set(index, heap.get(heap.size() - 1));

        // Remove the last node
        heap.remove(heap.size() - 1);

        // Restore the max heap property
        downHeapify(index);
    }

    public int getMax() {
        if (heap.isEmpty()) {
            return -1;
        }

        // Return the root node
        return heap.get(0);
    }

    public int extractMax() {
        if (heap.isEmpty()) {
            return -1;
        }

        // Extract the root node
        int root = heap.get(0);

        // Delete the root node
        remove(0);

        // Return the extracted root node
        return root;
    }
```

Typescript

```typescript
export class MaxHeap {
    heap: number[];

    constructor() {
        this.heap = [];
    }

    swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    // Helper function to restore heap property upwards (used in insert)
    upHeapify(index: number): void {
        let parent = Math.floor((index - 1) / 2);
        while (index > 0 && this.heap[parent] < this.heap[index]) {
            this.swap(index, parent);
            index = parent;
            parent = Math.floor((index - 1) / 2);
        }

    // Helper function to maintain the max heap property downwards
    downHeapify(index: number): void {
        let largest = index;
        let left = 2 * index + 1;
        let right = 2 * index + 2;

        // Find the largest among the node and its left child
        if (
            left < this.heap.length &&
            this.heap[left] > this.heap[largest]
        ) {
            largest = left;
        }

        // Find the largest among the node and its right child
        if (
            right < this.heap.length &&
            this.heap[right] > this.heap[largest]
        ) {
            largest = right;
        }

        // If the largest is not the current node, swap and continue
        // heapify
        if (largest !== index) {
            this.swap(index, largest);
            this.downHeapify(largest);
        }

// Diagram: insert(val: number): void {

        // Insert the new value at the end of the heap
        this.heap.push(val);

        // Get the index of the new value
        let index = this.heap.length - 1;

        // Restore the max heap property by comparing with parent nodes
        this.upHeapify(index);
    }

// Diagram: remove(index: number): void {

        // Replace the value with the largest possible value and heapify
        this.heap[index] = this.heap[this.heap.length - 1];

        // Remove the last node
        this.heap.pop();

        // Restore the max heap property
        this.downHeapify(index);
    }

    getMax(): number {
        if (this.heap.length === 0) {
            return -1;
        }

        // Return the root node
        return this.heap[0];
    }

    extractMax(): number {
        if (this.heap.length === 0) {
            return -1;
        }

        // Extract the root node
        let root = this.heap[0];

        // Delete the root node
        this.remove(0);

        // Return the extracted root node
        return root;
    }
```

Javascript

```javascript
export class MaxHeap {
    constructor() {
        this.heap = [];
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    // Helper function to restore heap property upwards (used in insert)
    upHeapify(index) {
        let parent = Math.floor((index - 1) / 2);
        while (index > 0 && this.heap[parent] < this.heap[index]) {
            this.swap(index, parent);
            index = parent;
            parent = Math.floor((index - 1) / 2);
        }

    // Helper function to maintain the max heap property downwards
    downHeapify(index) {
        let largest = index;
        let left = 2 * index + 1;
        let right = 2 * index + 2;

        // Find the largest among the node and its left child
        if (
            left < this.heap.length &&
            this.heap[left] > this.heap[largest]
        ) {
            largest = left;
        }

        // Find the largest among the node and its right child
        if (
            right < this.heap.length &&
            this.heap[right] > this.heap[largest]
        ) {
            largest = right;
        }

        // If the largest is not the current node, swap and continue
        // heapify
        if (largest !== index) {
            this.swap(index, largest);
            this.downHeapify(largest);
        }

// Diagram: insert(val) {

        // Insert the new value at the end of the heap
        this.heap.push(val);

        // Restore the max heap property by comparing with parent nodes
        this.upHeapify(this.heap.length - 1);
    }

// Diagram: remove(index) {

        // Replace the value with the largest possible value and heapify
        this.heap[index] = this.heap.pop();

        // Restore the max heap property
        this.downHeapify(index);
    }

    getMax() {
        return this.heap.length === 0 ? -1 : this.heap[0];
    }

    extractMax() {
        if (this.heap.length === 0) return -1;

        // Extract the root node
        let root = this.heap[0];

        // Delete the root node
        this.remove(0);

        // Return the extracted root node
        return root;
    }
```

Python

```python
from typing import List

class MaxHeap:
    def __init__(self) -> None:
        self.heap: List[int] = []

    # Helper function to restore heap property upwards (used in insert)
    def up_heapify(self, index: int) -> None:
        parent = (index - 1) // 2
        while index > 0 and self.heap[parent] < self.heap[index]:
            self.heap[parent], self.heap[index] = self.heap[index], self.heap[parent]
            index, parent = parent, (parent - 1) // 2

    # Helper function to maintain the max heap property downwards
    def down_heapify(self, index: int) -> None:
        largest = index
        left, right = 2 * index + 1, 2 * index + 2

        # Find the largest among the node and its left child
        if left < len(self.heap) and self.heap[left] > self.heap[largest]:
            largest = left

        # Find the largest among the node and its right child
        if right < len(self.heap) and self.heap[right] > self.heap[largest]:
            largest = right

        # If the largest is not the current node, swap and continue heapify
        if largest != index:
            self.heap[index], self.heap[largest] = self.heap[largest], self.heap[index]
            self.down_heapify(largest)

    def insert(self, val: int) -> None:

        # Insert the new value at the end of the heap
        self.heap.append(val)

        # Get the index of the new value
        index = len(self.heap) - 1

        # Restore the max heap property by comparing with parent nodes
        self.up_heapify(index)

    def remove(self, index: int) -> None:

        # Replace the value with the largest possible value and heapify
        self.heap[index] = self.heap[-1]

        # Remove the last node
        self.heap.pop()

        # Restore the max heap property
        self.down_heapify(index)

    def get_max(self) -> int:
        if not self.heap:
            return -1

        # Return the root node
        return self.heap[0]

    def extract_max(self) -> int:
        if not self.heap:
            return -1

        # Extract the root node
        root = self.heap[0]

        # Delete the root node
        self.remove(0)

        # Return the extracted root node
        return root
```

## Complexity analysis

The extract operation is just a combination of peek and delete operations. The peek operation has a constant time complexity in any case. So, the best and worst-case time complexity for the extract operation will be determined by the delete operation. Since we always delete the root node, which is the worst case for the delete operation, the extract operation in any case has a time complexity of **O(log(N))**

// Diagram: The root node is always deleted

We do not create any new data structure that depends on the size of stored data or input and only create a fixed number of temporary variables, so the space complexity is constant **O(1)** in any case.

> **Best Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(log(N))**
>
> **Worst Case**
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(log(N))**

***

# Constructing a heap

The construct operation constructs a max heap from the given list of data items. The implementation is encapsulated in the construct function, which relies on the special properties of a complete binary tree and repeatedly applies the heapify function on the input list to convert it into a heap. Let us look at the algorithm and implementation of the construct operation on a max heap implemented as an array.

## Algorithm

The algorithm for constructing a heap from a given list relies on a special property and a complete binary tree. The array representation of a complete binary tree is just its level-order traversal. Putting this the other way around, we can visualize any sequence of data items as a complete binary tree.

// Diagram: An list of data can be visualized as a complete binary tree

Now the problem boils down to converting the complete binary tree to a heap. Since it is a complete binary tree, it already follows one of the requirements to be called a heap. The other requirement is that the value at any node should be greater than its children. To enforce this second requirement, we can traverse from the last node to the root node and, at each iteration, run a down heapify operation to make sure the current node is greater than both its children.

Since we are traversing from the last (lowest) node to the first (highest) node, we can be sure that when we reach any node, its subtrees are already converted to heaps. So we only need to run down heapify once to ensure the subtree rooted at the current node is also a heap. At the end of the traversal, the tree rooted at the root node (entire tree) is converted to a heap.

// Diagram: Convert the given sequence of data items into a max heap (starting from leaf nodes)

An important observation can make this entire algorithm twice as fast. We know that the leaf nodes do not have any children, so they fully comply with the heap property. Running down heapify for leaf nodes is a no-op and can be skipped. The traversal should start from the first non-leaf node in the tree. We can use the special property of a complete binary tree to find the index of the last non-leaf node easily.

// Diagram: Convert the given sequence of data items into a max heap (starting from non-leaf nodes)

> **Algorithm**
>
> -   **Step 1:** Begin traversing the array in reverse order, starting from the middle and moving towards the beginning.
>     -   **Step 1.1:** For each index, perform the downheapify operation on the value at that position.

## Implementation

We perform size checks to ensure the root node exists in the heap. If the heap has a non-zero number of data items, we copy the value at the root and delete it using the delete function implemented earlier. 

C++

```cpp
#include <algorithm>

// Diagram: using namespace std;

class MaxHeap {
public:
    vector<int> heap;

    // Helper function to maintain the max heap property downwards
    void downHeapify(int index) {
        int largest = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        // Find the largest among the node and its left child
        if (left < heap.size() && heap[left] > heap[largest]) {
            largest = left;
        }

        // Find the largest among the node and its right child
        if (right < heap.size() && heap[right] > heap[largest]) {
            largest = right;
        }

        // If the largest is not the current node, swap and continue
        // heapify
        if (largest != index) {
            swap(heap[index], heap[largest]);
            downHeapify(largest);
        }

    void construct(vector<int> &arr) {
        int n = arr.size();

        // Start from the last non-leaf node and perform downHeapify
        for (int i = n / 2 - 1; i >= 0; i--) {
            downHeapify(arr, n, i);
        }
};
```

Java

```java
import java.util.*;

class MaxHeap {
    List<Integer> heap;

    public MaxHeap() {
        heap = new ArrayList<>();
    }

    // Helper function to maintain the max heap property downwards
    private downHeapify(int index) {
        int largest = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        // Find the largest among the node and its left child
        if (left < heap.size() && heap[left] > heap[largest]) {
            largest = left;
        }

        // Find the largest among the node and its right child
        if (right < heap.size() && heap[right] > heap[largest]) {
            largest = right;
        }

        // If the largest is not the current node, swap and continue
        // heapify
        if (largest != index) {
            swap(heap[index], heap[largest]);
            downHeapify(largest);
        }

    public void construct(int[] arr) {
        int n = arr.length;

        // Start from the last non-leaf node and perform max-heapify
        for (int i = (n / 2) - 1; i >= 0; i--) {
            downHeapify(arr, n, i);
        }
```

Typescript

```typescript
export class MaxHeap {
    heap: number[];

    constructor() {
        this.heap = [];
    }

    swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    // Helper function to maintain the max heap property downwards
    downHeapify(index: number): void {
        let largest = index;
        let left = 2 * index + 1;
        let right = 2 * index + 2;

        // Find the largest among the node and its left child
        if (
            left < this.heap.length &&
            this.heap[left] > this.heap[largest]
        ) {
            largest = left;
        }

        // Find the largest among the node and its right child
        if (
            right < this.heap.length &&
            this.heap[right] > this.heap[largest]
        ) {
            largest = right;
        }

        // If the largest is not the current node, swap and continue
        // heapify
        if (largest !== index) {
            this.swap(index, largest);
            this.downHeapify(largest);
        }

    construct(arr: number[]): void {
        const n = arr.length;

        // Start from the last non-leaf node and perform max-heapify
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.downHeapify(arr, n, i);
        }
```

Javascript

```javascript
export class MaxHeap {
    constructor() {
        this.heap = [];
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    // Helper function to maintain the max heap property downwards
    downHeapify(index) {
        let largest = index;
        let left = 2 * index + 1;
        let right = 2 * index + 2;

        // Find the largest among the node and its left child
        if (
            left < this.heap.length &&
            this.heap[left] > this.heap[largest]
        ) {
            largest = left;
        }

        // Find the largest among the node and its right child
        if (
            right < this.heap.length &&
            this.heap[right] > this.heap[largest]
        ) {
            largest = right;
        }

        // If the largest is not the current node, swap and continue
        // heapify
        if (largest !== index) {
            this.swap(index, largest);
            this.downHeapify(largest);
        }

    construct(arr) {
        const n = arr.length;

        // Start from the last non-leaf node and perform max-heapify
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.downHeapify(arr, n, i);
        }
```

Python

```python
from typing import List

class MaxHeap:
    def __init__(self) -> None:
        self.heap: List[int] = []

    # Helper function to maintain the max heap property downwards
    def down_heapify(self, index: int) -> None:
        largest = index
        left, right = 2 * index + 1, 2 * index + 2

        # Find the largest among the node and its left child
        if left < len(self.heap) and self.heap[left] > self.heap[largest]:
            largest = left

        # Find the largest among the node and its right child
        if right < len(self.heap) and self.heap[right] > self.heap[largest]:
            largest = right

        # If the largest is not the current node, swap and continue heapify
        if largest != index:
            self.heap[index], self.heap[largest] = self.heap[largest], self.heap[index]
            self.down_heapify(largest)

    def min_heap_to_max_heap(self, arr: List[int]) -> None:
        n = len(arr)

        # Start from the last non-leaf node and perform max-heapify
        for i in range(n // 2 - 1, -1, -1):
            self.down_heapify(arr, n, i)
```

## Complexity analysis

The construct operation is just a sum of N heapify operations where N is the number of data items in the given sequence. The worst-case time complexity of the heapify operation is **log(N)**, where N is the number of nodes in the subtree where heapify is applied. However, the construction algorithm does not apply the heapify function on a fixed-sized tree. Since it starts from the lowest level in the tree, the operation is applied to an increasingly larger tree starting from 0.

Let's look at the diagram below to understand the worst-case time complexity better. It represents the relationship between the height of a subtree, the number of nodes at that height, and the number of swap operations that need to be applied in the worst-case if a down heapify operation is applied at that subtree.

// Diagram: Relationship between height, number of nodes and number of swap operations in a heap

> For a heap of height \`h\` that has \`N\` number of nodes:
>
> -   Number of nodes at height j = **2^(h-j)**
> -   Maximum possible swap operations on running down heapify for a node at height j = **j**

In the worst case, the given array will have a complete binary tree where every level is full, and a down heapify operation from each node traverses the tree to the leaf. We can use the equations above to calculate the number of swap operations executed in the worst case when constructing a heap starting from the first non leaf node.

// Diagram: Total number of swap operations when building a heap

From the calculation above, it can be proved that the worst-case time complexity for the algorithm to construct a heap from the given list of data items is **linear O(N)**. In the best case, we won't need to do any swaps, but we still need to traverse half (n/2) array, so the best-case time complexity is **linear O(N).**

If we convert the given sequence to a heap in place, we don't need any extra space, so the space complexity is **constant O(1)**. However, if we do not modify the input sequence and instead create a separate copy that holds the heap, the space complexity would be O(N),where N is the number of data items in the input sequence.

For this operation, we will consider creating a heap in place in the given sequence, and hence the space complexity in any case would be constant **O(1)**

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

# Min heap to max heap

## Problem Statement

Given an array **arr** that is the array representation of a min heap, write a function to convert it to a max heap in place.

// Diagram: You must do this in amortised linear time

### Example 1

> -   **Input:** arr = \[-2, 1, 5, 9, 4, 6, 7\]
> -   **Output:** \[9, 4, 7, 1, -2, 6, 5\]
> -   **Explanation:** The above shows the conversion from min heap to max heap.

### Example 2

> -   **Input:** arr = \[3, 5\]
> -   **Output:** \[5, 3\]
> -   **Explanation:** The above shows the conversion from min heap to max heap.

## Solution

```cpp
#include <algorithm>

using namespace std;

class Solution {
public:
    void maxHeapify(vector<int> &arr, int n, int index) {

        // Initialize the current node as the largest
        int largest = index;

        // Calculate the left child index
        int left = 2 * index + 1;

        // Calculate the right child index
        int right = 2 * index + 2;

        // Compare the current node with its left child
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        // Compare the current node with its right child
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        // If the largest is not the current node, swap the values and
        // recursively max-heapify the affected child
        if (largest != index) {
            swap(arr[index], arr[largest]);
            maxHeapify(arr, n, largest);
        }
    }

    void minHeapToMaxHeap(vector<int> &arr) {
        int n = arr.size();

        // Start from the last non-leaf node and perform max-heapify
        for (int i = n / 2 - 1; i >= 0; i--) {
            maxHeapify(arr, n, i);
        }
    }
};
```

***

# Max heap to min heap

## Problem Statement

Given an array **arr** that is the array representation of a max heap, write a function to convert it to a min heap in place.

// Diagram: You must do this in amortised linear time

### Example 1

> -   **Input:** arr = \[9, 4, 7, 1, -2, 6, 5\]
> -   **Output:** \[-2, 1, 5, 9, 4, 6, 7\]
> -   **Explanation:** The above shows the conversion from max heap to min heap.

### Example 2

> -   **Input:** arr = \[5, 3\]
> -   **Output:** \[3, 5\]
> -   **Explanation:** The above shows the conversion from max heap to min heap.

## Solution

```cpp
using namespace std;

class Solution {
public:
    void minHeapify(vector<int> &arr, int n, int index) {

        // Initialize the current node as the smallest
        int smallest = index;

        // Calculate the left child index
        int left = 2 * index + 1;

        // Calculate the right child index
        int right = 2 * index + 2;

        // Compare the current node with its left child
        if (left < n && arr[left] < arr[smallest]) {
            smallest = left;
        }

        // Compare the current node with its right child
        if (right < n && arr[right] < arr[smallest]) {
            smallest = right;
        }

        // If the smallest is not the current node, swap the values and
        // recursively min-heapify the affected child
        if (smallest != index) {
            swap(arr[index], arr[smallest]);
            minHeapify(arr, n, smallest);
        }
    }

    void maxHeapToMinHeap(vector<int> &arr) {
        int n = arr.size();

        // Start from the last non-leaf node and perform min-heapify
        for (int i = (n / 2) - 1; i >= 0; i--) {
            minHeapify(arr, n, i);
        }
    }
};
```
