# Traversing a graph

## Table of Contents

1. [Understanding depth first traversal](#understanding-depth-first-traversal)
2. [Implement depth first traversal](#understanding-depth-first-traversal)
3. [Understanding breadth first traversal](#understanding-breadth-first-traversal)
4. [Implement breadth first traversal](#understanding-breadth-first-traversal)

***

# Understanding depth first traversal

Unlike linear data structures, we cannot traverse all nodes in a graph using simple loops. The depth-first traversal is a fundamental traversal algorithm for graph data structures that uses depth-first search to visit all nodes connected to a node. The depth-first search is a **recursive** algorithm that starts from a node and explores one complete branch at a time. As we will see later, the depth-first traversal algorithm makes multiple depth-first searches from different sources to traverse all the nodes in a graph.

// Diagram: Depth first search explores one complete branch at a time.

## Algorithm

The depth-first traversal algorithm utilises the depth-first search algorithm to traverse all nodes connected to a given node. The depth-first search algorithm is quite straightforward as it fully explores one branch before backtracking to other branches. It can be considered a generalisation of the three tree traversal algorithms (preorder, inorder and postorder traversal).

The simple recursive equation given below summarizes the depth-first search algorithm from a source node.

// Diagram: The recursive equation for depth first search algorithm.

Only applying depth-first search from any one node in the graph may not be enough, as it may not cover all the nodes of the graph if the graph is disconnected.

// Diagram: Calling dfs once will not visit all the nodes in a disconnected graph.

And so, the depth-first traversal algorithm performs depth-first search from every unvisited node until all nodes are visited. This way, all the nodes in the graph are traversed, even in disconnected graphs.

// Diagram: Applying depth-first search from all unvisited nodes until no node is unvisited covers the entire graph.

To traverse all the nodes in the graph, we initialize a `visited` set and iterate over all the nodes of the graph. For any node that is not in the `visited` set, we call the depth-first search function on it. The depth-first search function takes as input the current node and the reference to the `visited` set. For languages that do not support passing data by reference, the `visited` set can be created in the global scope to share the same copy between recursive function calls.

As we enter a node, we add the node to the `visited` set to make sure they are not revisited if there are cycles. We then iterate over all the neighbours of the node and recursively call the depth-first search on the unvisited nodes, which in turn recursively performs the same operation. The algorithm backtracks from a node when there are no unvisited neighbours left.

This way, at the end of the top-level call to the depth-first search function, all the nodes connected to the top-level node are visited and added to the `visited` set. We then continue our iteration over the graph nodes in the calling function and repeat the same process for the remaining unvisited nodes. At the end of all iterations, all the nodes of the graph will be visited and added to the `visited` set, completing the depth-first traversal.

The steps below summarize the depth-first traversal algorithm using depth-first search and a `visited` set.

> **Algorithm**
>
> **dfs(node, \[ref\] graph, \[ref\] visited)**
>
> -   **Step 1:** Add `node` to `visited` set
> -   **Step 2:** Iterate over all the neighbours of `node` in a variable `neighbour` and do the following
>     -   **Step 2.1:** If `neighbour` is not in `visited` set call `dfs(neighbour, graph, visited)`
>
> **depthFirstTraversal(\[ref\] graph)**
>
> -   **Step 1:** Create a `visited` set
> -   **Step 2:** Iterate over all the nodes in the graph in a variable `node` and do the following
>     -   **Step 2.1:** If `node` not in `visited` set call `dfs(node, graph, visited)`

Let's examine a sample graph and see how the depth-first traversal algorithm is executed on it.

Depth first traversal in a graph.

## Implementation

Consider that we have a graph of size**N**, where the nodes are enumerated from**0**to**N-1**, and we are given the adjacency listof the graph as a two-dimensional list of integers `graph`, where the value is the enumeration of the neighbour node. 

Given below is the implementation of the depth-first traversal algorithm. We create a recursive `dfs` function that takes as input the current node, a reference to the adjacency list `graph` and a reference to the `visited` set. For languages where passing by reference is not supported, we create the variables in the enclosing scope to make the same copy available in recursive calls.

We create the visited set in the calling function, `depthFirstTraversal`, and iterate over all the nodes in the graph, calling `dfs` on all the unvisited nodes.

C++

```cpp
#include <unordered_set>

// Diagram: using namespace std;

class Solution {
public:
    void dfs(
        vector<vector<int>> &graph,
        int node,
        unordered_set<int> &visited,
        vector<int> &result
    ) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.insert(node);

        // Add the current node to the result list
        result.push_back(node);

        // Traverse all the neighbours of the current node
        for (int neighbour : graph[node]) {

            // If the neighbour is not visited, recursively call the DFS
            // function on the neighbour
            if (visited.find(neighbour) == visited.end()) {
                dfs(graph, neighbour, visited, result);
            }

// Diagram: vector<int> depthFirstTraversal(vector<vector<int>> &graph) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return an empty result
        if (N == 0) {
            return {};
        }

        // Initialize a vector to store the result of the DFS which will
        // contain the nodes visited during the DFS traversal
        vector<int> result;

        // Initialize visited set
        unordered_set<int> visited;

        // Traverse all nodes in the graph
        for (int node = 0; node < N; node++) {

            // If the node is already visited, continue to the next node
            if (visited.find(node) != visited.end()) {
                continue;
            }

            // Perform DFS on this new node to visit all the nodes
            // connected to it.
            dfs(graph, node, visited, result);
        }

        return result;
    }
};
```

Java

```java
#include <unordered_set>

// Diagram: using namespace std;

class Solution {
public:
    void dfs(
        vector<vector<int>> &graph,
        int node,
        unordered_set<int> &visited,
        vector<int> &result
    ) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.insert(node);

        // Add the current node to the result list
        result.push_back(node);

        // Traverse all the neighbours of the current node
        for (int neighbour : graph[node]) {
```

Typescript

```typescript
export class Solution {
    dfs(
        graph: number[][],
        node: number,
        visited: Set<number>,
        result: number[]
    ): void {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.add(node);

        // Add the current node to the result list
        result.push(node);

        // Traverse all the neighbours of the current node
        for (const neighbour of graph[node]) {

            // If the neighbour is not visited, recursively call the DFS
            // function on the neighbour
            if (!visited.has(neighbour)) {
                this.dfs(graph, neighbour, visited, result);
            }

// Diagram: depthFirstTraversal(graph: number[][]): number[] {

        // Number of nodes in the graph
        const N: number = graph.length;

        // If the graph is empty, return an empty result
        if (N === 0) {
            return [];
        }

        // Initialize a list to store the result of the DFS which will
        // contain the nodes visited during the DFS traversal
        const result: number[] = [];

        // Initialize visited set
        const visited: Set<number> = new Set();

        // Perform DFS from the source node
        // Traverse all nodes in the graph
        for (let node = 0; node < N; node++) {

            // If the node is already visited, continue to the next node
            if (visited.has(node)) {
                continue;
            }

            // Perform DFS on this new node to visit all the nodes
            // connected to it.
            this.dfs(graph, node, visited, result);
        }

        return result;
    }
```

Javascript

```javascript
export class Solution {
    dfs(graph, node, visited, result) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.add(node);

        // Add the current node to the result list
        result.push(node);

        // Traverse all the neighbours of the current node
        for (const neighbour of graph[node]) {

            // If the neighbour is not visited, recursively call the DFS
            // function on the neighbour
            if (!visited.has(neighbour)) {
                this.dfs(graph, neighbour, visited, result);
            }

// Diagram: depthFirstTraversal(graph) {

        // Number of nodes in the graph
        const N = graph.length;

        // If the graph is empty, return an empty result
        if (N === 0) {
            return [];
        }

        // Initialize a list to store the result of the DFS which will
        // contain the nodes visited during the DFS traversal
        const result = [];

        // Initialize visited set
        const visited = new Set();

        // Traverse all nodes in the graph
        for (let node = 0; node < N; node++) {

            // If the node is already visited, continue to the next node
            if (visited.has(node)) {
                continue;
            }

            // Perform DFS on this new node to visit all the nodes
            // connected to it.
            this.dfs(graph, node, visited, result);
        }

        return result;
    }
```

Python

```python
from typing import List, Set

class Solution:
    def dfs(
        self,
        graph: List[List[int]],
        node: int,
        visited: Set[int],
        result: List[int],
    ) -> None:

        # Mark the current node as visited
        visited.add(node)

        # Add the current node to the result list
        result.append(node)

        # Traverse all the neighbours of the current node
        for neighbour in graph[node]:

            # If the neighbour is not visited, recursively call the DFS
            # function on the neighbour
            if neighbour not in visited:
                self.dfs(graph, neighbour, visited, result)

    def depth_first_traversal(self, graph: List[List[int]]) -> List[int]:

        # Number of nodes in the graph
        n = len(graph)

        # If the graph is empty, return an empty result
        if n == 0:
            return []

        # Initialize a list to store the result of the DFS which will
        # contain the nodes visited during the DFS traversal
        result: List[int] = []

        # Initialize visited set
        visited: Set[int] = set()

        # Traverse all nodes in the graph
        for node in range(n):

            # If the node is already visited, continue to the next node
            if node in visited:

            # Perform DFS on this new node to visit all the nodes
            # connected to it.
            self.dfs(graph, node, visited, result)

        return result
```

## Complexity Analysis

The runtime complexity of the recursive algorithm should be easy to understand. Since we visit every node and every edge exactly once in the traversal, the time complexity **O(N + E),** where **N** is the total number of nodes and **E** is the total number of edges.Since this algorithm is recursive, the functional call stack's size depends on the recursion depth. In the worst case, the graph would be linear (a straight line), so the recursion would proceed to a depth of **N**, and the space complexity would be **O(N)**. In the best case, it would only go to a depth of 1, and thus the space complexity would be constant, **O(1)**.

// Diagram: The best and the worst case graphs for stack depth

However, in any case, we create a visited set that will house all the nodes of the graph, leading to a space complexity of **O(N)** in all cases.

> **Best Case**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N+E)**
>
> **Worst Case**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N+E)**

***

# Depth first traversal

## Problem Statement

Given a **directed** **graph** represented as an adjacency list and a **source** node, write a function to return a list containing all the nodes in the order in which they would appear in a depth-first traversal starting from the first node.

The graph is given as follows: `graph[i]` is a list of all nodes you can visit from the node `i` (i.e., there is a directed edge from the node `i` to node `graph[i][j]`).

> -   If the graph is disconnected, you must traverse all the nodes in a sequential order. That is, after completing a depth-first traversal on one component, execute it again using the next unvisited node as the source to cover the remaining subgraphs.

### Example 1

> -   **Input:** graph = \[\[1\], \[4\], \[3\], \[0\], \[2, 3\]\]
> -   **Output:** \[0, 1, 4, 2, 3\]
> -   **Explanation:** This represents the depth-first traversal starting from node 0.

### Example 2

> -   **Input:** graph = \[\[4\], \[0, 3\], \[0, 4\], \[2, 4\], \[1\]\]
> -   **Output:** \[0, 4, 1, 3, 2\]
> -   **Explanation:** This represents the depth-first traversal starting from node 0.

## Solution

```cpp
#include <unordered_set>

using namespace std;

class Solution {
public:
    void dfs(
        vector<vector<int>> &graph,
        int node,
        unordered_set<int> &visited,
        vector<int> &result
    ) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.insert(node);

        // Add the current node to the result list
        result.push_back(node);

        // Traverse all the neighbours of the current node
        for (int neighbour : graph[node]) {

            // If the neighbour is not visited, recursively call the DFS
            // function on the neighbour
            if (visited.find(neighbour) == visited.end()) {
                dfs(graph, neighbour, visited, result);
            }
        }
    }

    vector<int> depthFirstTraversal(vector<vector<int>> &graph) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return an empty result
        if (N == 0) {
            return {};
        }

        // Initialize a vector to store the result of the DFS which will
        // contain the nodes visited during the DFS traversal
        vector<int> result;

        // Initialize visited set
        unordered_set<int> visited;

        // Traverse all nodes in the graph
        for (int node = 0; node < N; node++) {

            // If the node is already visited, continue to the next node
            if (visited.find(node) != visited.end()) {
                continue;
            }

            // Perform DFS on this new node to visit all the nodes
            // connected to it.
            dfs(graph, node, visited, result);
        }

        return result;
    }
};
```

***

# Understanding breadth first traversal

The depth-first traversal algorithm that we learned earlier uses the depth-first search algorithm that relies on the function call stack, and may not be the best solution for some graph exploration use cases. The breadth-first traversal is another fundamental graph traversal algorithm that uses breadth-first search to explore all nodes at a fixed distance (depth) before moving to nodes at the next greater distance (depth). It can be visualized as moving outwards from the centre of concentric circles, covering one full circle at a time.

// Diagram: Breadth first search explores all neighbours first.

Just like depth-first search is the generalization of preorder, inorder, and postorder traversals, breadth-first search is the generalization of level traversal. The only difference between the level order traversal of a tree and the breadth-first search of a graph is that we maintain map to keep track of nodes that are already scheduled to visit, as graphs can have cycles.

## Algorithm

The breadth-first traversal algorithm utilises the breadth-first search algorithm to traverse all nodes connected to a given node. The breadth-first search is a simple two-step algorithm in which we maintain a `queue` of nodes to visit and a `visited` set to keep track of nodes **scheduled** for a visit. It can be considered a generalisation of the level order traversal algorithm for trees.

// Diagram: The breadth-first search algorithm uses a queue and a visited set.

Only applying breadth-first search from any one node in the graph may not be enough, as it may not cover all the nodes of the graph if the graph is disconnected.

// Diagram: Calling bfs once will not visit all the nodes in a disconnected graph.

And so, the breadth-first traversal algorithm performs breadth-first search from every unvisited node until all nodes are visited. This way, all the nodes in the graph are traversed, even in disconnected graphs.

// Diagram: Applying breadth-first search from all unvisited nodes until no node is unvisited covers the entire graph.

To traverse all the nodes in the graph, we initialize a `visited` set and iterate over all the nodes of the graph. For any node that is not in the `visited` set, we call the breadth-first search function on it. The breadth-first search function takes as input the current node and the reference to the `visited` set. For languages that do not support passing data by reference, the `visited` set can be created in the global scope to share the same copy between function calls.

The breadth-first search function initializes a local `queue` to schedule visits to nodes.

// Diagram: The breadth-first search initializes a local queue to schedule visits.

We start by adding the source node (passed as input) to the `queue` and iterate while the `queue` is not empty.

// Diagram: Add the source node to the queue to start bfs.

In each iteration, we pop a node from the front of the queue, which is equivalent to visiting it. We then use the `visited` set to find all its neighbours that are **not** scheduled for a visit and push them to the `queue`. Once we add a neighbour to the queue, we also add it to the `visited` set so that we don't add it to the `queue` again from another path.

Since we add all the neighbours of a node to the `queue` **before** visiting them and the queue follows a FIFO (first in, first out order), it is guaranteed that we visit all neighbours of a node before visiting any other node.

This process is repeated until the `queue` is empty, which means that all nodes reachable from the top-level source node have been traversed and added to the `visited` set.

// Diagram: All nodes connected to the source node are visited after the call to bfs.

We then continue our iteration over the graph nodes in the calling function and repeat the same process for the remaining unvisited nodes. At the end of all iterations, all the nodes of the graph will be visited and added to the `visited` set, completing the breadth-first traversal.

The steps below summarize the breadth-first traversal algorithm using breadth-first search and a `visited` set.

> **Algorithm**
>
> **bfs(node, \[ref\] graph, \[ref\] visited)**
>
> -   **Step 1:** Create a `queue` and add the `node` to it.
> -   **Step 2:** Add `node` to the `visited` set
> -   **Step 3:** Iterate while `queue` is not empty and do the following:
>     -   **Step 3.1:** Pop a node from the front of the `queue` in the variable `node`
>     -   **Step 3.2:** Iterate over all the neighbours of `node` in a variable `neighbour` and do the following:
>         -   **Step 3.2.1:** If `neighbour` is not in `visited` set, add `neighbour` to the `queue` and `visited` set
>
> **breadthFirstTraversal(\[ref\] graph)**
>
> -   **Step 1:** Create a `visited` set
> -   **Step 2:** Iterate over all the nodes in the graph in a variable `node` and do the following
>     -   **Step 2.1:** If `node` not in `visited` set call `bfs(node, graph, visited)`

Let's examine a sample graph and see how the breadth-first traversal algorithm is executed on it.

Breadth first search in a graph starting from node 1.

## Implementation

Consider that we have a graph of size **N**, where the nodes are enumerated from **0** to **N-1**, and we are given the adjacency list of the graph as a two-dimensional list of integers `graph`, where the value is the enumeration of the neighbour node.

Given below is the implementation of the breadth-first traversal algorithm. We create a `bfs` function that takes as input the current node, a reference to the adjacency list `graph` and a reference to the `visited` set. For languages where passing by reference is not supported, we create the variables in the enclosing scope. The bfs function creates a local variable `queue` every time it is called to schedule the nodes to visit.

We create the `visited` set in the calling function `breadthFirstTraversal`, and iterate over all the nodes in the graph, calling `bfs` on all the unvisited nodes.

C++

```cpp
#include <queue>
#include <unordered_set>

// Diagram: using namespace std;

class Solution {
public:
    void bfs(
        vector<vector<int>> &graph,
        int source,
        unordered_set<int> &visited,
        vector<int> &result
    ) {

        // Create a queue to perform breadth-first search
        queue<int> queue;

        // Add the source node to the queue
        queue.push(source);

        // Mark the current node as visited
        visited.insert(source);

        // Perform BFS
        while (!queue.empty()) {

            // Get the front node from the queue
            int node = queue.front();
            queue.pop();

            // Add the current node to the result
            result.push_back(node);

            // Visit all the neighbours of the current node
            for (int neighbour : graph[node]) {

                // If the neighbour is not visited, add it to the queue
                if (visited.find(neighbour) == visited.end()) {

                    // Add the neighbour to the queue
                    queue.push(neighbour);

                    // Mark the neighbour node as visited
                    visited.insert(neighbour);
                }

// Diagram: vector<int> breadthFirstTraversal(vector<vector<int>> &graph) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return an empty result
        if (N == 0) {
            return {};
        }

        // Initialize a vector to store the result of the BFS which will
        // contain the nodes visited during the BFS traversal
        vector<int> result;

        // Initialize visited set
        unordered_set<int> visited;

        // Traverse all nodes in the graph
        for (int node = 0; node < N; node++) {

            // If the node is already visited, continue to the next node
            if (visited.find(node) != visited.end()) {
                continue;
            }

            // Perform BFS on this new node to visit all the nodes
            // connected to it.
            bfs(graph, node, visited, result);
        }

        return result;
    }
};
```

Java

```java
import java.util.*;

class Solution {
    public void bfs(
        List<List<Integer>> graph,
        int source,
        Set<Integer> visited,
        List<Integer> result
    ) {

        // Create a queue to perform breadth-first search
        Queue<Integer> queue = new LinkedList<>();

        // Add the source node to the queue
        queue.add(source);

        // Mark the source node as visited
        visited.add(source);

        // Perform BFS
        while (!queue.isEmpty()) {

            // Get the front node from the queue
            int node = queue.poll();

            // Add the current node to the result
            result.add(node);

            // Visit all the neighbours of the current node
            for (int neighbour : graph.get(node)) {

                // If the neighbour is not visited, add it to the queue
                if (!visited.contains(neighbour)) {

                    // Add the neighbour to the queue
                    queue.add(neighbour);

                    // Mark the neighbour node as visited
                    visited.add(neighbour);
                }

    public List<Integer> breadthFirstTraversal(
        List<List<Integer>> graph
    ) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return an empty result
        if (N == 0) {
            return new ArrayList<>();
        }

        // Initialize a list to store the result of the BFS which will
        // contain the nodes visited during the BFS traversal
        List<Integer> result = new ArrayList<>();

        // Initialize visited set
        Set<Integer> visited = new HashSet<>();

        // Traverse all nodes in the graph
        for (int node = 0; node < N; node++) {

            // If the node is already visited, continue to the next node
            if (visited.contains(node)) {
                continue;
            }

            // Perform DFS on this new node to visit all the nodes
            // connected to it.
            bfs(graph, node, visited, result);
        }

        return result;
    }
```

Typescript

```typescript
export class Solution {
    bfs(
        graph: number[][],
        source: number,
        visited: Set<number>,
        result: number[]
    ) {

        // Create a queue to perform breadth-first search
        const queue: number[] = [];

        // Add the source node to the queue
        queue.push(source);

        // Mark the current node as visited
        visited.add(source);

        // Perform BFS
        while (queue.length > 0) {
            const node: number = queue.shift()!;

            // Add the current node to the result
            result.push(node);

            // Visit all the neighbours of the current node
            for (const neighbour of graph[node]) {

                // If the neighbour is not visited, add it to the queue
                if (!visited.has(neighbour)) {

                    // Add the neighbour to the queue
                    queue.push(neighbour);

                    // Mark the neighbour node as visited
                    visited.add(neighbour);
                }

// Diagram: breadthFirstTraversal(graph: number[][]): number[] {

        // Number of nodes in the graph
        const N: number = graph.length;

        // If the graph is empty, return an empty result
        if (N === 0) {
            return [];
        }

        // Initialize a list to store the result of the BFS which will
        // contain the nodes visited during the BFS traversal
        const result: number[] = [];

        // Initialize visited set
        const visited: Set<number> = new Set();

        // Traverse all nodes in the graph
        for (let node = 0; node < N; node++) {

            // If the node is already visited, continue to the next node
            if (visited.has(node)) {
                continue;
            }

            // Perform BFS on this new node to visit all the nodes
            // connected to it.
            this.bfs(graph, node, visited, result);
        }

        return result;
    }
```

Javascript

```javascript
export class Solution {
    bfs(graph, source, visited, result) {

        // Create a queue to perform breadth-first search
        const queue = [];

        // Add the source node to the queue
        queue.push(source);

        // Mark the current node as visited
        visited.add(source);

        // Perform BFS
        while (queue.length > 0) {

            // Get the front node from the queue
            const node = queue.shift();

            // Add the current node to the result
            result.push(node);

            // Visit all the neighbours of the current node
            for (const neighbour of graph[node]) {

                // If the neighbour is not visited, add it to the queue
                if (!visited.has(neighbour)) {

                    // Add the neighbour to the queue
                    queue.push(neighbour);

                    // Mark the neighbour node as visited
                    visited.add(neighbour);
                }

// Diagram: breadthFirstTraversal(graph) {

        // Number of nodes in the graph
        const N = graph.length;

        // If the graph is empty, return an empty result
        if (N === 0) {
            return {};
        }

        // Initialize a list to store the result of the BFS which will
        // contain the nodes visited during the BFS traversal
        const result = [];

        // Initialize visited set
        const visited = new Set();

        // Traverse all nodes in the graph
        for (let node = 0; node < N; node++) {

            // If the node is already visited, continue to the next node
            if (visited.has(node)) {
                continue;
            }

            // Perform BFS on this new node to visit all the nodes
            // connected to it.
            this.bfs(graph, node, visited, result);
        }

        return result;
    }
```

Python

```python
from queue import Queue
from typing import List, Set
from collections import deque

class Solution:
    def bfs(
        self,
        graph: List[List[int]],
        source: int,
        visited: Set[int],
        result: List[int],
    ) -> None:

        # Create a queue to perform breadth-first search
        queue = Queue()

        # Add the source node to the queue
        queue.put(source)

        # Mark the current node as visited
        visited.add(source)

        # Perform BFS from the source node
        while not queue.empty():
            node = queue.get()

            # Add the current node to the result
            result.append(node)

            # Visit all the neighbours of the current node
            for neighbour in graph[node]:

                # If the neighbour is not visited, add it to the queue
                if neighbour not in visited:

                    # Add the neighbour to the queue
                    queue.put(neighbour)

                    # Mark the neighbour node as visited
                    visited.add(neighbour)

    def breadth_first_traversal(
        self, graph: List[List[int]]
    ) -> List[int]:

        # Number of nodes in the graph
        n = len(graph)

        # If the graph is empty, return an empty result
        if n == 0:
            return []

        # Initialize a list to store the result of the BFS which will
        # contain the nodes visited during the BFS traversal
        result: List[int] = []

        # Initialize visited set
        visited: Set[int] = set()

        # Traverse all nodes in the graph
        for node in range(n):

            # If the node is already visited, all the nodes connected to
            # it are also visited
            if node in visited:

            # Perform BFS on this new node to visit all the nodes
            # connected to it.
            self.bfs(graph, node, visited, result)

        return result
```

## Complexity Analysis

In any case, every node in the graph is added to the queue only once, so the outer while loop iterates **N** times, where **N** is the total number of nodes in the graph. We perform constant-time operations for each node and iterate through all its edges. When considering all the nodes in the graph, we get **O(N)** as the sum of all constant operations. Iterating through all the edges for every node accounts for **O(E)** time, where **E** is the total number of edges in the graph. Therefore, the overall runtime complexity of breadth-first search is **O(N+E)** in all cases.

Since we create a queue to enforce the breadth-first order, the maximum size of the queue during runtime impacts the memory required. In the worst case, the graph could be fully connected and only one level deep. This means all the nodes would be added to the queue at once, so the space complexity would be **O(N)**. In the best case, the graph would be disconnected entirely, or each node only has one neighbour, so the maximum size of the queue would be one, and the space complexity would be constant **O(1)**.

// Diagram: The best and the worst case graphs for stack depth

However, in any case, we create a visited set that will house all the nodes of the graph, leading to a space complexity of **O(N)** in all cases.

> **Best Case**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N+E)**
>
> **Worst Case**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N+E)**

***

# Breadth first traversal

## Problem Statement

Given a **directed** **graph** represented as an adjacency list and a **source** node, write a function to return a list containing all the nodes in the order in which they would appear in a breadth-first traversal starting from the first node.

The graph is given as follows: `graph[i]` is a list of all nodes you can visit from the node `i` (i.e., there is a directed edge from the node `i` to node `graph[i][j]`).

> -   If the graph is disconnected, you must traverse all the nodes in a sequential order. That is, after completing a breadth-first traversal on one component, execute it again using the next unvisited node as the source to cover the remaining subgraphs.

### Example 1

> -   **Input:** graph = \[\[1, 2\], \[4\], \[3\], \[0\], \[2, 3\]\]
> -   **Output:** \[0, 1, 2, 4, 3\]
> -   **Explanation:** This represents the breadth-first traversal starting from node 0.

### Example 2

> -   **Input:** graph = \[\[4\], \[0, 3\], \[0, 4\], \[2, 4\], \[1\]\]
> -   **Output:** \[0, 4, 1, 3, 2\]
> -   **Explanation:** This represents the breadth-first traversal starting from node 0.

## Solution

```cpp
#include <queue>
#include <unordered_set>

using namespace std;

class Solution {
public:
    void bfs(
        vector<vector<int>> &graph,
        int source,
        unordered_set<int> &visited,
        vector<int> &result
    ) {

        // Create a queue to perform breadth-first search
        queue<int> queue;

        // Add the source node to the queue
        queue.push(source);

        // Mark the current node as visited
        visited.insert(source);

        // Perform BFS
        while (!queue.empty()) {

            // Get the front node from the queue
            int node = queue.front();
            queue.pop();

            // Add the current node to the result
            result.push_back(node);

            // Visit all the neighbours of the current node
            for (int neighbour : graph[node]) {

                // If the neighbour is not visited, add it to the queue
                if (visited.find(neighbour) == visited.end()) {

                    // Add the neighbour to the queue
                    queue.push(neighbour);

                    // Mark the neighbour node as visited
                    visited.insert(neighbour);
                }
            }
        }
    }

    vector<int> breadthFirstTraversal(vector<vector<int>> &graph) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return an empty result
        if (N == 0) {
            return {};
        }

        // Initialize a vector to store the result of the BFS which will
        // contain the nodes visited during the BFS traversal
        vector<int> result;

        // Initialize visited set
        unordered_set<int> visited;

        // Traverse all nodes in the graph
        for (int node = 0; node < N; node++) {

            // If the node is already visited, continue to the next node
            if (visited.find(node) != visited.end()) {
                continue;
            }

            // Perform BFS on this new node to visit all the nodes
            // connected to it.
            bfs(graph, node, visited, result);
        }

        return result;
    }
};
```
