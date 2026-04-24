# Cycle detection

## Table of Contents

1. [Understanding cycle detection in an undirected graph](#understanding-cycle-detection-in-an-undirected-graph)
2. [Detect cycle in an undirected graph](#detect-cycle-in-an-undirected-graph)
3. [Understanding cycle detection in a directed graph](#understanding-cycle-detection-in-a-directed-graph)
4. [Detect cycle in a directed graph](#detect-cycle-in-a-directed-graph)

***

# Understanding cycle detection in an undirected graph

Graphs are composed of nodes connected via edges and are not restricted by any specific topology. Unlike a tree, which is a specialised graph as it is acyclic, a general graph can have cycles. A cycle in a graph is a path that starts and ends at the same node, has no repeated edges, and has at least three nodes. In this lesson, we will look at cycles in undirected graphs and learn the algorithm that can be used to detect such cycles.

// Diagram: A cycle in an undirected graph.

## Algorithm

Detecting a cycle in an undirected graph is quite simple. We can piggyback on any traversal algorithm, like depth-first or breadth-first traversal, while keeping track of visited nodes. If we ever revisit a node during traversal, it means a cycle exists in the graph. We will learn more about the proof of correctness later in the lesson. In this explanation, we will use depth-first traversal to detect a cycle, as it is a simpler, more concise implementation.

We begin by creating a `visited` set to keep track of the nodes that have been visited. We then iterate through the list of nodes and for each node, check if it is already visited. If it is visited, we ignore it and proceed to the next node; otherwise, we perform a depth-first traversal from the node to detect if it is part of any cycle using a cycle detection function.

The reason we iterate through all the nodes is that the graph may be disconnected, and therefore, a depth-first traversal from a node may not visit all the nodes in the graph.

// Diagram: The graph can either be fully connected or disconnected.

The cycle detection function is a slightly modified depth-first traversal algorithm that exits as soon as it detects a cycle. It accepts the identifier of the current node, the identifier of the parent node and the `visited` set as arguments, where the `visited` set is passed by reference. We pass the parent node to filter out the parent node from the neighbours, as undirected edges can be traversed both ways. Since the first node where the depth-first traversal starts does not have a parent, we pass a sentinel value that will never be a node identifier as the parent.

We pass the `visited` set by reference so that all recursive function calls share the same copy of the `visited` set. For languages that do not support passing data by reference, the visited set can be created in the enclosing scope to make it global for all function calls. The function returns a boolean value indicating the existence of a cycle.

// Diagram: An undirected edge can be traversed both ways, and we need to filter out the parent node from the list of neighbours during traversal.

As we enter a node, we add it to the `visited` set. We then iterate through all the neighbours of the node and in each iteration, check if the neighbour is already added to the `visited` set. If yes, it means the neighbour has already been visited, which means there is a cycle in the graph, and we return `true` to the parent node. We will learn more about the proof of correctness later in the lesson.

// Diagram: In the depth-first traversal, if we encounter a non-parent neighbour that is already visited, it means there is a cycle.

Otherwise, we recursively call the cycle detection function (dfs) on the neighbour. If the recursive call to any neighbour returns `true`, we return the `true` value to the parent node without checking any other neighbour, as we have already confirmed the presence of a cycle. The parent node does the same, and the recursive calls all unwind to the top-level.

// Diagram: Return the parent on detecting a cycle without visiting other neighbours.

On the other hand, if no call to the cycle detection function returns a `true` value, all the iterations finish. In this case, we return `false` to the parent at the end of all iterations, indicating this node is not a part of any cycle.

This way, when the top-level call to the cycle detection function (dfs) ends in the calling function, the caller gets a boolean value indicating if a cycle containing the source node exists in the graph. If it does, we return `true` to the caller, ending the algorithm; otherwise, we continue the iteration and repeat the process for the next unvisited node. If at the end of all iterations, we don't get a `true` value even once, we return `false`, confirming there is no cycle in the graph.

The steps given below summarize the cycle detection algorithm in an undirected graph.

> **Algorithm**
>
> **hasCycle(node, parent, \[ref\] graph, \[ref\] visited)**
>
> -   **Step 1:** Add \`node\` to \`visited\`
> -   **Step 2:** Iterate in all the neighbours of \`node\` in \`neighbour\` and do the following:
>     -   **Step 2.1:** If \`neighbour\` is not in \`visited\`
>         -   **Step 2.1.1:** Call \`hasCycle(neighbour, node, graph, visited)\` and if its return value is \`true\`, return \`true\` to the parent
>     -   **Step 2.2:** If \`neighbour\` is not \`parent\`, return \`true\` to the parent
> -   **Step 3:** Return \`false\`
>
> **callingFunction(\[ref\] graph)**
>
> -   **Step 1:** Create a \`visited\` set
> -   **Step 2:** Iterate in all the nodes of the graph using \`node\` and do the following:
>     -   **Step 2.1:** If \`node\` is not in \`visited\`, call \`hasCycle(node, -1, graph, visited)\` and return \`true\` if it returns \`true\`
> -   **Step 3:** Return \`false\`

Let's look at an example to better understand the cycle detection algorithm in an undirected graph.

// Diagram: Depth first traversal to detect cycle in undirected graph

## Proof of correctness

It is quite easy to prove the correctness of the algorithm. We can prove that for an undirected graph, the only case in which we will encounter a visited node during traversal is when the visited node is a part of the current path (node in function call stack) as traced by the depth-first traversal.

We can prove this by contradiction. Consider a case where we encounter a visited node during the traversal that is not part of the currently traced path. Say we started the traversal from node `a` and are currently at node `x` that has a neighbour node `v` that is already visited.

// Diagram: An arrangement where the neighbour is already visited.

Since node `v` has already been visited; it must have been traversed earlier. This can be either at some earlier point in the current traversal or some other earlier traversal. If it was traversed in the current traversal, it should be in the current path from `a` to `x` and hence lead to a cycle.

// Diagram: If node v was marked visited in the current traversal, it must be in the current path.

If not, then it must be from an earlier traversal. However, since node `x` is a neighbour of `v`, that earlier traversal should also have traversed node x and all the other nodes in the path from `a` to `x` and marked them as visited. This contradicts our assumption and proves such a case is not possible.

// Diagram: If node v was marked visited in some previous traversal node x must also be marked from that traversal.

Conversely, this proves that for an undirected graph, we can only encounter a visited node during traversal if there exists a cycle in the graph.

## Implementation

Consider that we have a graph of size **N**, where the nodes are enumerated from **0** to **N-1**, and we are given the adjacency list `graph` as a list of integers, where the value is the enumeration of the neighbouring node.

To implement the algorithm, we create a `hasCycle` function that is a slightly modified version of depth-first traversal. We create the `visited` set in the calling function and pass it by reference to the `hasCycle` function for all unvisited nodes. For languages that do not support passing data by reference, we can create the set in the enclosing scope to make it global for all recursive function calls.

C++

```cpp
#include <unordered_set>

// Diagram: using namespace std;

class Solution {
public:
    bool hasCycle(
        vector<vector<int>> &graph,
        int node,
        int parent,
        unordered_set<int> &visited
    ) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.insert(node);

        // Recursively visit all the adjacent nodes
        for (int neighbour : graph[node]) {

            // If the neighbour node is not visited, visit it recursively
            if (visited.find(neighbour) == visited.end()) {
                if (hasCycle(graph, neighbour, node, visited)) {
                    return true;
                }

            // If the neighbour node is already visited and is not the
            // parent node, a cycle is detected
            else if (neighbour != parent) {
                return true;
            }

        // No cycle detected
        return false;
    }

// Diagram: bool detectCycleInUndirectedGraph(vector<vector<int>> &graph) {

        // Set to keep track of visited nodes
        unordered_set<int> visited;

        // Perform DFS on each unvisited node
        for (int node = 0; node < graph.size(); node++) {
            if (visited.find(node) == visited.end()) {
                if (hasCycle(graph, node, -1, visited)) {
                    return true;
                }

        return false;
    }
};
```

Java

```java
import java.util.*;

class Solution {
    public boolean hasCycle(
        List<List<Integer>> graph,
        int node,
        int parent,
        Set<Integer> visited
    ) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.add(node);

        // Recursively visit all the adjacent nodes
        for (int neighbour : graph.get(node)) {

            // If the neighbour node is not visited, visit it recursively
            if (!visited.contains(neighbour)) {
                if (hasCycle(graph, neighbour, node, visited)) {
                    return true;
                }

            // If the neighbour node is already visited and is not the
            // parent node, a cycle is detected
            else if (neighbour != parent) {
                return true;
            }

        // No cycle detected
        return false;
    }

    public boolean detectCycleInUndirectedGraph(
        List<List<Integer>> graph
    ) {

        // Set to keep track of visited nodes
        Set<Integer> visited = new HashSet<>();

        // Perform DFS on each unvisited node
        for (int node = 0; node < graph.size(); node++) {
            if (!visited.contains(node)) {
                if (hasCycle(graph, node, -1, visited)) {
                    return true;
                }

        return false;
    }
```

Typescript

```typescript
export class Solution {
    hasCycle(
        graph: number[][],
        node: number,
        parent: number,
        visited: Set<number>
    ): boolean {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.add(node);

        // Recursively visit all the adjacent nodes
        for (const neighbour of graph[node]) {

            // If the neighbour node is not visited, visit it recursively
            if (!visited.has(neighbour)) {
                if (this.hasCycle(graph, neighbour, node, visited)) {
                    return true;
                }

            // If the neighbour node is already visited and is not the
            // parent node, a cycle is detected
            else if (neighbour !== parent) {
                return true;
            }

        // No cycle detected
        return false;
    }

// Diagram: detectCycleInUndirectedGraph(graph: number[][]): boolean {

        // Set to keep track of visited nodes
        const visited = new Set<number>();

        // Perform DFS on each unvisited node
        for (let node = 0; node < graph.length; node++) {
            if (!visited.has(node)) {
                if (this.hasCycle(graph, node, -1, visited)) {
                    return true;
                }

        return false;
    }
```

Javascript

```javascript
export class Solution {
    hasCycle(graph, node, parent, visited) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.add(node);

        // Recursively visit all the adjacent nodes
        for (const neighbour of graph[node]) {

            // If the neighbour node is not visited, visit it recursively
            if (!visited.has(neighbour)) {
                if (this.hasCycle(graph, neighbour, node, visited)) {
                    return true;
                }

            // If the neighbour node is already visited and is not the
            // parent node, a cycle is detected
            else if (neighbour !== parent) {
                return true;
            }

        // No cycle detected
        return false;
    }

// Diagram: detectCycleInUndirectedGraph(graph) {

        // Set to keep track of visited nodes
        const visited = new Set();

        // Perform DFS on each unvisited node
        for (let node = 0; node < graph.length; node++) {
            if (!visited.has(node)) {
                if (this.hasCycle(graph, node, -1, visited)) {
                    return true;
                }

        return false;
    }
```

Python

```python
from typing import List, Set

class Solution:
    def has_cycle(
        self,
        graph: List[List[int]],
        node: int,
        parent: int,
        visited: Set[int],
    ) -> bool:

        # Mark the current node as visited in the graph to avoid
        # visiting it again
        visited.add(node)

        # Recursively visit all the adjacent nodes
        for neighbour in graph[node]:

            # If the neighbour node is not visited, visit it recursively
            if neighbour not in visited:
                if self.has_cycle(graph, neighbour, node, visited):
                    return True

            # If the neighbour node is already visited and is not the
            # parent node, a cycle is detected
            elif neighbour != parent:
                return True

        # No cycle detected
        return False

    def detect_cycle_in_undirected_graph(
        self, graph: List[List[int]]
    ) -> bool:

        # Set to keep track of visited nodes
        visited = set()

        # Perform DFS on each unvisited node
        for node in range(len(graph)):
            if node not in visited:
                if self.has_cycle(graph, node, -1, visited):
                    return True

        return False
```

## Complexity Analysis

The cycle detection algorithm for directed graphs utilises the depth-first traversal algorithm to visit every node exactly once in the worst case, resulting in the same worst-case time and space complexity of **O(N + E)** and **O(N)** respectively, where **N** represents the number of nodes and **E** denotes the total number of edges in the graph. The worst case is when the graph does not have any cycles, as it can only be confirmed by traversing the entire graph.

// Diagram: The worst case is when the graph does not have any cycles.

However, since we abort further traversal and return `true` upon detecting any cycle in the graph, the best-case time complexity is **O(1)** when the cycle consists of only three nodes and we detect it on our first exploration path. Since this also means only three nodes are added to the `visited` set, the best case space complexity is also constant **O(1)**.

// Diagram: The best case is when the cycle has only three nodes and is detected in the first exploration path.

> **Best Case:** A three-node cycle is detected in the first path
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case:** The graph does not have any cycle
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N+E)**

***

# Detect cycle in an undirected graph

## Problem Statement

Given an **undirected** **graph** represented as an adjacency list, write a function that returns `true` if there is a cycle in the graph and `false` otherwise.

The graph is given as follows: `graph[i]` is a list of all nodes you can visit from node `i` (i.e., there is a directed edge from node `i` to node `graph[i][j]`).

### Example 1

> -   **Input:** graph = \[\[1, 2\], \[0, 4\], \[0, 3\], \[2, 4\], \[1, 3\]\]
> -   **Output:** true
> -   **Explanation:** A cycle exists in the graph.

### Example 2

> -   **Input:** graph = \[\[1\], \[0, 2\], \[1\]\]
> -   **Output:** false
> -   **Explanation:** There are no cycles in the graph.

## Solution

```cpp
#include <unordered_set>

using namespace std;

class Solution {
public:
    bool hasCycle(
        vector<vector<int>> &graph,
        int node,
        int parent,
        unordered_set<int> &visited
    ) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.insert(node);

        // Recursively visit all the adjacent nodes
        for (int neighbour : graph[node]) {

            // If the neighbour node is not visited, visit it recursively
            if (visited.find(neighbour) == visited.end()) {
                if (hasCycle(graph, neighbour, node, visited)) {
                    return true;
                }
            }

            // If the neighbour node is already visited and is not the
            // parent node, a cycle is detected
            else if (neighbour != parent) {
                return true;
            }
        }

        // No cycle detected
        return false;
    }

    bool detectCycleInUndirectedGraph(vector<vector<int>> &graph) {

        // Set to keep track of visited nodes
        unordered_set<int> visited;

        // Perform DFS on each unvisited node
        for (int node = 0; node < graph.size(); node++) {
            if (visited.find(node) == visited.end()) {
                if (hasCycle(graph, node, -1, visited)) {
                    return true;
                }
            }
        }

        return false;
    }
};
```

***

# Understanding cycle detection in a directed graph

A directed graph is one where all edges can only be traversed in one direction. Similar to an undirected graph, a cycle in a directed graph is a path that starts and ends at the same node, has no repeated edges, and has at least three nodes. Unlike undirected graphs, revisiting an already visited node is not sufficient to confirm the existence of a cycle. In this lesson, we will look at cycles in directed graphs and learn the algorithm that can be used to detect such cycles.

// Diagram: A cycle in a directed graph.

## Algorithm

Detecting a cycle in a directed graph is very similar to that in an undirected graph, but there are some notable differences. In an undirected graph, revisiting a previously visited node while traversing the graph is sufficient to confirm the existence of a cycle. However, in a directed graph, the revisited node must be part of the currently traced path from the source node. If the revisited node is not in the currently traced path, we can ignore it and continue with the traversal. We will learn more about the proof of correctness later in the course.

// Diagram: A cycle exists if a neighbour is previously visited in the traced path.

Unlike cycle detection in an undirected graph, where any traversal algorithm can be used, for a directed graph, we can only use depth-first traversal, which keeps track of all nodes in the currently traced path in the function call stack. 

We begin by creating two sets `visited` and `nodesInPath` to keep track of the nodes that have been visited and the nodes in the currently traced path from the source, respectively. We then iterate through the list of nodes and for each node, check if it is already visited. If it is visited, we ignore it and proceed to the next node; otherwise, we perform a depth-first search from the node to detect if it is part of any cycle using a cycle detection function.

The reason we iterate through all the nodes is that a directed graph may not be fully connected. Depending on the node we we start the traversal, we may only be able to cover a part of the graph.

// Diagram: We must run depth-first traversal from every unvisited node to cover the entire graph.

The cycle detection function is a slightly modified depth-first traversal algorithm that exits as soon as it detects a cycle. It accepts the identifier of the current node, the `visited` set and the `nodesInPath` set as arguments, where both sets are passed by reference.

We pass both sets by reference so that all recursive function calls share the same copy of the sets. For languages that do not support passing data by reference, the sets can be created in the enclosing scope to make them global for all function calls. The function returns a boolean value indicating the existence of a cycle.

As we enter a node, we add it to both the `visited` and `nodesInPath` set to mark it as visited and record it as being the currently traced path from the source, respectively.

// Diagram: We maintain the nodesInPath set to track all nodes in the path.

We then iterate through all the neighbours of the node and in each iteration, check if the neighbour is already added to the `nodesInPath` set. If yes, it means there is a cycle in the graph, and we return `true` to the parent node. Otherwise, we check if the neighbour is already added to the `visited` set. If so, it means it was already visited via another path, and we can skip it.

// Diagram: If a neighbour of the current node exists in the nodesInPath set, it means there is a cycle.

If none of these conditions hold, we recursively call the cycle detection function (dfs) on the neighbour. If the recursive call to any neighbour returns `true`, we return the `true` value to the parent node without checking any other neighbour, as we have already confirmed the presence of a cycle. All iterations finish if a `true` value is not returned in any iteration. In this case, we remove the current node from `nodesInPath` set and return `false` to the parent, indicating this node is not a part of any cycle.

// Diagram: Return to the parent on detecting a cycle without visiting other neighbours.

This way, when the top-level call to the cycle detection function (dfs) ends in the calling function, the caller gets a boolean value indicating if a cycle containing the source node exists in the graph. If it does, we return `true` to the caller, ending the algorithm; otherwise, we continue the iteration and repeat the process for the next unvisited node. If at the end of all iterations, we don't get a `true` value even once, we return `false`, confirming there is no cycle in the graph.

The steps given below summarize the cycle detection algorithm in a directed graph.

> **Algorithm**
>
> **hasCycle(node, \[ref\] graph, \[ref\] nodesInPath, \[ref\] visited)**
>
> -   **Step 1:** Add \`node\` to \`visited\`
> -   **Step 2:** Add \`node\` to \`nodesInPath\`
> -   **Step 3:** Iterate in all the neighbours of \`node\` in \`neighbour\` and do the following:
>     -   **Step 3.1:** If \`neighbour\` is not in \`visited\`
>         -   **Step 3.1.1:** Call \`hasCycle(neighbour, node, graph, nodesInPath, visited)\` and if its return value is \`true\`, return \`true\` to the parent
>     -   **Step 3.2:** If \`neighbour\` is in \`nodesInPath\`, return \`true\` to the parent
> -   **Step 4:** Remove \`node\` from \`nodesInPath\`
> -   **Step 5:** Return \`false\`
>
> **callingFunction(\[ref\] graph)**
>
> -   **Step 1:** Create a \`visited\` set
> -   **Step 2:** Create a \`nodesInPath\` set
> -   **Step 3:** Iterate in all the nodes of the graph using \`node\` and do the following:
>     -   **Step 2.1:** If \`node\` is not in \`visited\`, call \`hasCycle(node, graph, nodesInPath, visited)\` and return \`true\` if it returns \`true\`
> -   **Step 3:** Return \`false\`

Let's look at an example to better understand the cycle detection algorithm in a directed graph.

Depth first traversal to detect cycle in a directed graph.

## Proof of correctness

It can also be proved that, unlike in an undirected graph, encountering a previously visited node is a necessary but not sufficient condition for the existence of a cycle. This is because a previously visited node that is **not** in the `nodesInPath` set, is guaranteed not to have any edge to any node in the currently traced path. This can be proved by contradiction. Consider we have a traced path from `a, b, ... n`, and we are currently at node `n` that has an edge to an already visited node `v`.

// Diagram: Having a previously visited node is a necessary but not sufficient condition for a cycle.

For there to be a cycle, node `v` must have an edge to any node say `i` in the path `a, b ... n`. However, if it had such an edge, all the nodes from `i ... n` must already be visited, which contradicts our assumption. And hence, encountering an already visited node is not sufficient to prove the existence of a cycle. Since the node is already visited, all forward paths from that node must also be visited, and so we can skip traversing the node again. 

On the other hand, if a node is already visited and also in the current path traced by depth-first traversal from the source, it guarantees the existence of a cycle. A cycle in a directed graph is, by definition, a path that begins and ends at the same node.

And so, encountering a previously visited node that is also in the currently traced path is the necessary and sufficient condition for the existence of a cycle in a directed graph. Our algorithm keeps track of all the nodes in the path traced by the depth-first traversal in `nodesInPath` set and uses them to detect cycles.

## Implementation

Consider that we have a graph of size **N**, where the nodes are enumerated from **0** to **N-1**, and we are given the adjacency list `graph` as a list of integers, where the value is the enumeration of the neighbouring node.

To implement the algorithm, we create a `hasCycle` function that is a slightly modified version of depth-first traversal. We create the `visited` and `ndoesInPath` sets in the calling function and pass them by reference to the `hasCycle` function for all unvisited nodes. For languages that do not support passing data by reference, we can create the sets in the enclosing scope to make them global for all recursive function calls.

C++

```cpp
#include <unordered_set>

// Diagram: using namespace std;

class Solution {
public:
    bool hasCycle(
        vector<vector<int>> &graph,
        int node,
        unordered_set<int> &visited,
        unordered_set<int> &nodesInPath
    ) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.insert(node);

        // Insert the current node into the set of nodes in the current
        // path to detect cycles
        nodesInPath.insert(node);

        // Recursively visit all the adjacent nodes
        for (int neighbour : graph[node]) {

            // If the neighbour node is not visited, visit it recursively
            if (visited.find(neighbour) == visited.end()) {
                if (hasCycle(graph, neighbour, visited, nodesInPath)) {
                    return true;
                }

            // If the neighbour node is already visited and present in
            // the current path, a cycle is detected
            else if (nodesInPath.find(neighbour) != nodesInPath.end()) {
                return true;
            }

        // Remove the current node from the current path as we are done
        // exploring it
        nodesInPath.erase(node);

        // No cycle detected
        return false;
    }

// Diagram: bool detectCycleInDirectedGraph(vector<vector<int>> &graph) {

        // Set to keep track of visited nodes
        unordered_set<int> visited;

        // Set to keep track of nodes in the current path
        unordered_set<int> nodesInPath;

        // Perform DFS on each unvisited node
        for (int node = 0; node < graph.size(); node++) {
            if (visited.find(node) == visited.end()) {
                if (hasCycle(graph, node, visited, nodesInPath)) {
                    return true;
                }

        return false;
    }
};
```

Java

```java
import java.util.*;

class Solution {
    public boolean hasCycle(
        List<List<Integer>> graph,
        int node,
        Set<Integer> visited,
        Set<Integer> nodesInPath
    ) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.add(node);

        // Insert the current node into the set of nodes in the current
        // path to detect cycles
        nodesInPath.add(node);

        // Recursively visit all the adjacent nodes
        for (int neighbour : graph.get(node)) {

            // If the neighbour node is not visited, visit it recursively
            if (!visited.contains(neighbour)) {
                if (hasCycle(graph, neighbour, visited, nodesInPath)) {
                    return true;
                }

            // If the neighbour node is already visited and present in
            // the current path, a cycle is detected
            else if (nodesInPath.contains(neighbour)) {
                return true;
            }

        // Remove the current node from the current path as we are done
        // exploring it
        nodesInPath.remove(node);

        // No cycle detected
        return false;
    }

    public boolean detectCycleInDirectedGraph(
        List<List<Integer>> graph
    ) {

        // Set to keep track of visited nodes
        Set<Integer> visited = new HashSet<>();

        // Set to keep track of nodes in the current path
        Set<Integer> nodesInPath = new HashSet<>();

        // Perform DFS on each unvisited node
        for (int node = 0; node < graph.size(); node++) {
            if (!visited.contains(node)) {
                if (hasCycle(graph, node, visited, nodesInPath)) {
                    return true;
                }

        return false;
    }
```

Typescript

```typescript
export class Solution {
    hasCycle(
        graph: number[][],
        node: number,
        visited: Set<number>,
        nodesInPath: Set<number>
    ): boolean {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.add(node);

        // Insert the current node into the set of nodes in the current
        // path to detect cycles
        nodesInPath.add(node);

        // Recursively visit all the adjacent nodes
        for (const neighbour of graph[node]) {

            // If the neighbour node is not visited, visit it recursively
            if (!visited.has(neighbour)) {
                if (
                    this.hasCycle(graph, neighbour, visited, nodesInPath)
                ) {
                    return true;
                }

            // If the neighbour node is already visited and present in
            // the current path, a cycle is detected
            else if (nodesInPath.has(neighbour)) {
                return true;
            }

        // Remove the current node from the current path as we are done
        // exploring it
        nodesInPath.delete(node);

        // No cycle detected
        return false;
    }

// Diagram: detectCycleInDirectedGraph(graph: number[][]): boolean {

        // Set to keep track of visited nodes
        const visited = new Set<number>();

        // Set to keep track of nodes in the current path
        const nodesInPath = new Set<number>();

        // Perform DFS on each unvisited node
        for (let node = 0; node < graph.length; node++) {
            if (!visited.has(node)) {
                if (this.hasCycle(graph, node, visited, nodesInPath)) {
                    return true;
                }

        return false;
    }
```

Javascript

```javascript
export class Solution {
    hasCycle(graph, node, visited, nodesInPath) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.add(node);

        // Insert the current node into the set of nodes in the current
        // path to detect cycles
        nodesInPath.add(node);

        // Recursively visit all the adjacent nodes
        for (const neighbour of graph[node]) {

            // If the neighbour node is not visited, visit it recursively
            if (!visited.has(neighbour)) {
                if (
                    this.hasCycle(graph, neighbour, visited, nodesInPath)
                ) {
                    return true;
                }

            // If the neighbour node is already visited and present in
            // the current path, a cycle is detected
            else if (nodesInPath.has(neighbour)) {
                return true;
            }

        // Remove the current node from the current path as we are done
        // exploring it
        nodesInPath.delete(node);

        // No cycle detected
        return false;
    }

// Diagram: detectCycleInDirectedGraph(graph) {

        // Set to keep track of visited nodes
        const visited = new Set();

        // Set to keep track of nodes in the current path
        const nodesInPath = new Set();

        // Perform DFS on each unvisited node
        for (let node = 0; node < graph.length; node++) {
            if (!visited.has(node)) {
                if (this.hasCycle(graph, node, visited, nodesInPath)) {
                    return true;
                }

        return false;
    }
```

Python

```python
from typing import List, Set

class Solution:
    def has_cycle(
        self,
        graph: List[List[int]],
        node: int,
        visited: Set[int],
        nodes_in_path: Set[int],
    ) -> bool:

        # Mark the current node as visited in the graph to avoid
        # visiting it again
        visited.add(node)

        # Insert the current node into the set of nodes in the current
        # path to detect cycles
        nodes_in_path.add(node)

        # Recursively visit all the adjacent nodes
        for neighbour in graph[node]:

            # If the neighbour node is not visited, visit it recursively
            if neighbour not in visited:
                if self.has_cycle(
                    graph, neighbour, visited, nodes_in_path
                ):
                    return True

            # If the neighbour node is already visited and present in
            # the current path, a cycle is detected
            elif neighbour in nodes_in_path:
                return True

        # Remove the current node from the current path as we are done
        # exploring it
        nodes_in_path.remove(node)

        # No cycle detected
        return False

    def detect_cycle_in_directed_graph(
        self, graph: List[List[int]]
    ) -> bool:

        # Set to keep track of visited nodes
        visited: Set[int] = set()

        # Set to keep track of nodes in the current path
        nodes_in_path: Set[int] = set()

        # Perform DFS on each unvisited node
        for node in range(len(graph)):
            if node not in visited:
                if self.has_cycle(graph, node, visited, nodes_in_path):
                    return True

        return False
```

## Complexity Analysis

The cycle detection algorithm for directed graphs utilises the depth-first traversal algorithm to visit every node exactly once in the worst case, resulting in the same worst-case time and space complexity of **O(N + E)**, where **N** represents the number of nodes and **E** denotes the total number of edges in the graph. The worst case is when the graph does not have any cycles, as it can only be confirmed by traversing the entire graph.

// Diagram: The worst case is when the graph does not have any cycles.

However, since we abort further traversal and return `true` upon detecting any cycle in the graph, the best-case time complexity is **O(1)** when the cycle consists of only three nodes and we detect it on our first exploration path. Since this also means only three nodes are added to the `visited` and `nodesInPath` sets, the best case space complexity is also constant **O(1)**.

// Diagram: The best case is when the cycle has only three nodes and is detected in the first exploration path.

> **Best Case:** A three-node cycle is detected in the first path
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case:** The graph does not have any cycle
>
> -   Space Complexity - **O(N+E)**
> -   Time Complexity - **O(N+E)**

***

# Detect cycle in a directed graph

## Problem Statement

Given a **directed** **graph** represented as an adjacency list, write a function that returns `true` if there is a cycle in the graph and `false` otherwise.

The graph is given as follows: `graph[i]` is a list of all nodes you can visit from node `i` (i.e., there is a directed edge from node `i` to node `graph[i][j]`).

### Example 1

> -   **Input:** graph = \[\[1, 2\], \[4\], \[3\], \[0\], \[2, 3\]\]
> -   **Output:** true
> -   **Explanation:** There are multiple cycles in the graph.

### Example 2

> -   **Input:** graph = \[\[4\], \[5\], \[3\], \[5\], \[1\], \[\]\]
> -   **Output:** false
> -   **Explanation:** There are no cycles in the graph.

## Solution

```cpp
#include <unordered_set>

using namespace std;

class Solution {
public:
    bool hasCycle(
        vector<vector<int>> &graph,
        int node,
        unordered_set<int> &visited,
        unordered_set<int> &nodesInPath
    ) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.insert(node);

        // Insert the current node into the set of nodes in the current
        // path to detect cycles
        nodesInPath.insert(node);

        // Recursively visit all the adjacent nodes
        for (int neighbour : graph[node]) {

            // If the neighbour node is not visited, visit it recursively
            if (visited.find(neighbour) == visited.end()) {
                if (hasCycle(graph, neighbour, visited, nodesInPath)) {
                    return true;
                }
            }

            // If the neighbour node is already visited and present in
            // the current path, a cycle is detected
            else if (nodesInPath.find(neighbour) != nodesInPath.end()) {
                return true;
            }
        }

        // Remove the current node from the current path as we are done
        // exploring it
        nodesInPath.erase(node);

        // No cycle detected
        return false;
    }

    bool detectCycleInDirectedGraph(vector<vector<int>> &graph) {

        // Set to keep track of visited nodes
        unordered_set<int> visited;

        // Set to keep track of nodes in the current path
        unordered_set<int> nodesInPath;

        // Perform DFS on each unvisited node
        for (int node = 0; node < graph.size(); node++) {
            if (visited.find(node) == visited.end()) {
                if (hasCycle(graph, node, visited, nodesInPath)) {
                    return true;
                }
            }
        }

        return false;
    }
};
```
