# Pattern: Connected components

## Table of Contents

1. [Understanding the connected component pattern](#understanding-the-connected-component-pattern)
2. [Identifying the connected component pattern](#identifying-the-connected-component-pattern)
3. [Find connected components](#connected-components)
4. [Sum of minimums](#sum-of-minimums)
5. [Island count](#island-count)
6. [Size of largest island](#size-of-largest-island)

***

# Understanding the connected component pattern

A connected component in a graph is a subgraph where there is a path between every pair of nodes. Connected components are usually used in the context of undirected graphs only. Directed graphs have more complex connectivity due to unidirectional edges, and such subgraphs where there is a path between every pair of nodes are called strongly connected components. We will only learn about connected components in undirected graphs in this lesson. Some graph problems require us to find all and process all the connected components and the nodes in them in an undirected graph. We can solve such problems efficiently using the connected component technique.

The connected component pattern is a classification of problems on undirected graphs that can be solved using the connected component technique.

// Diagram: An undirected graph with three connected components.

## The connected component technique.

To understand the technique to find and process all connected components, let's look at the generic problem it tries to solve. Consider that we are given a graph and we need to aggregate the value of a function `f` over all the nodes of all the connected components. We need to further aggregate the aggregated value of each connected component over a function `g`. Consider the following graph as an example.

// Diagram: Aggregate values in connected components using functions f and g.

We can find and traverse all the connected components and find the aggregated value using both depth-first and breadth-first traversal. We will use depth-first traversal in this case as it has a simple recursive implementation.

The idea is quite simple: we simply run a depth-first traversal from every unvisited node and aggregate the values in the nodes over the function `f` in a variable as we go. Once the depth-first traversal is complete, it will have visited all nodes in the same connected component as the source node, and the aggregate variable will have the aggregated value of the function `f` over all the nodes. We repeat the process on all unvisited nodes and aggregate their values over the function `g`.

We start by creating a `visited` set to keep track of the nodes that have been visited and a variable `aggregate` initialized with a default value to store the final aggregated value. We then iterate through the list of nodes and for each node, check if it is already visited. If it is visited, we ignore it and proceed to the next node. Otherwise, we initialize a variable `componentAggregate` with a default value and start depth-first traversal from the node to traverse all nodes that are in the same connected component and aggregate their value over the function `f`.

// Diagram: Create a visited set and initialize a variable aggregate to a default value.

The depth-first traversal function accepts the identifier of the current node, the identifier of the parent node, the `componentAggregate` and the `visited` set as arguments, where `componentAggregate` and `visited` are passed by reference. We pass the parent node to filter out the parent node from the neighbours, as undirected edges can be traversed both ways. Since the first node where the depth-first traversal starts does not have a parent, we pass a sentinel value that will never be a node identifier as the parent.

We pass `componentAggregate` and `visited` by reference so that all recursive function calls share the same copy. For languages that do not support passing data by reference, these variables can be created in the enclosing scope to make them global for all function calls.

As we enter a node, we add it to the `visited` set and add its contribution to `componentAggregate` using the function `f`. We then iterate through all the unvisited neighbours and recursively traverse them.

This way, when the top-level call to depth-first traversal ends in the calling function, all nodes in the connected component of the initial node are visited and their contribution added to componentAggregate. We then add the contribution of `componentAggregate` to `aggregate` using the function `g`. We then continue the iteration, reset `componentAggregate` and repeat the process for the next unvisited node. At the end of all iterations, `aggregate` will have the aggregated value of the function `g` over all aggregates from all connected components.

The steps given below summarize the connected component algorithm in an undirected graph.

> **Algorithm**
>
> **dfs(node, parent, \[ref\] componentAggregate, \[ref\] graph, \[ref\] visited)**
>
> -   **Step 1:** Add \`node\` to \`visited\`
> -   **Step 2:** Add the contribution of \`node\` to \`componentAggregate\` using the function \`f\`
> -   **Step 3:** Iterate in all the neighbours of \`node\` in \`neighbour\` and do the following:
>     -   **Step 3.1:** If \`neighbour\` is not \`parent\` and not in \`visited\`
>         -   **Step 3.1.1:** Call \`dfs(neighbour, node, componentAggregate, graph, visited)\`
>
> **callingFunction(\[ref\] graph)**
>
> -   **Step 1:** Create a \`visited\` set
> -   **Step 2:** Initialize \`aggregate\` with a default value
> -   **Step 3:** Iterate in all the nodes of the graph using \`node\` and do the following:
>     -   **Step 3.1:** If \`node\` is not in \`visited\`, do the following:
>         -   **Step 3.1.1:** Initialize \`componentAggregate\` with a default value
>         -   **Step 3.1.2:** Call \`dfs(node, -1, componentAggregate, graph, visited)\`
>         -   **Step 3.1.3:** Add contribution of \`componentAggregate\` to \`aggregate\` using the function \`g\`\`
> -   **Step 3:** Return \`aggregate\`

Let's look at an example to better understand the algorithm.

Aggregate values in connected components using functions f and g.

## Implementation

Consider that we have a graph of size **N**, where the nodes are enumerated from **0** to **N-1**, and we are given the adjacency list `graph` as a list of pairs of integers, where the first value in the pair is the value of the node and the second value is the enumeration of the neighbouring node.

To implement the algorithm, we create a `dfs` function to traverse a connected component. We create the `visited` set and `aggregate` in the calling function, and iterate over all the nodes. For any unvisited node, we initialize a variable componentAggregate with a default value and call `dfs` passing `componentAggregate`, `visited` and `graph` by reference. For languages that do not support passing data by reference, we can create the variables in the enclosing scope to make them global for all recursive function calls.

C++

```cpp
#include <unordered_set>

// Diagram: using namespace std;

class Solution {
public:
    void dfs(
        int node,
        int parent,
        int& componentAggregate,
        vector<vector<pair<int, int>>> &graph,
        unordered_set<int> &visited
    ) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.insert(node);

        // Add contribution of current node to componentAggregate using the function f
        componentAggregate = f(componentAggregate, node);

        // Recursively visit all the unvisited adjacent nodes
        for (int neighbour : graph[node]) {

            // If the neighbour node is not visited, visit it recursively
            if (neighbour != parent && visited.find(neighbour) == visited.end()) {
                dfs(neighbour, node, componentAggregate, graph, visited);
            }

// Diagram: int connectedComponents(vector<vector<pair<int, int>> &graph) {

        // Set to keep track of visited nodes
        unordered_set<int> visited;

        // Iniitialize aggregate to a default value
        int aggregate = 0;

        // Perform DFS on each unvisited node
        for (int node = 0; node < graph.size(); node++) {
            if (visited.find(node) == visited.end()) {
                // Initialize componentAggregate to a default value
                int componentAggregate = 0;
                // Perform DFS to traverse all nodes in the connected component
                // of this node
                dfs(node, -1, componentAggregate, graph, visited);

                // Add contribution of componentAggregate to aggregate using the function g
                aggregate = g(aggregate, componentAggregate);
            }

        // Return the final aggregate value
        return aggregate;
    }
};
```

Java

```java
import java.util.*;

// Diagram: class Solution {

    // Aggregate for a single component
    private int componentAggregate;

    void dfs(
        int node,
        int parent,
        List<List<Integer>> graph,
        Set<Integer> visited
    ) {
        // Mark the current node as visited in the graph to avoid visiting it again
        visited.add(node);

        // Add contribution of current node to componentAggregate using the function f
        componentAggregate = f(componentAggregate, node);

        // Recursively visit all the unvisited adjacent nodes
        for (int neighbour : graph.get(node)) {
            // If the neighbour node is not visited, visit it recursively
            if (neighbour != parent && !visited.contains(neighbour)) {
                dfs(neighbour, node, graph, visited);
            }

        return;
    }

// Diagram: public int connectedComponents(List<List<Integer>> graph) {

        // Set to keep track of visited nodes
        Set<Integer> visited = new HashSet<>();

        // Initialize aggregate to a default value
        int aggregate = 0;

        // Perform DFS on each unvisited node
        for (int node = 0; node < graph.size(); node++) {
            if (!visited.contains(node)) {
                // Initialize componentAggregate to a default value
                componentAggregate = 0;

                // Perform DFS to traverse all nodes in the connected component
                dfs(node, -1, graph, visited);

                // Add contribution of componentAggregate to aggregate using the function g
                aggregate = g(aggregate, componentAggregate);
            }

        // Return the final aggregate value
        return aggregate;
    }
```

Typescript

```typescript
#include <unordered_set>
```

Javascript

```javascript
class Solution {
  // Aggregate for a single component
  componentAggregate = 0;

  // Depth-first traversal of the graph
  dfs(
    node,
    parent,
    graph,
    visited
  ) {
    // Mark the current node as visited in the graph to avoid visiting it again
    visited.add(node);

    // Add contribution of current node to componentAggregate using the function f
    this.componentAggregate = f(this.componentAggregate, node);

    // Recursively visit all the unvisited adjacent nodes
    for (const [neighbour, _] of graph[node]) {
      // If the neighbour node is not visited, visit it recursively
      if (neighbour !== parent && !visited.has(neighbour)) {
        this.dfs(neighbour, node, graph, visited);
      }

  connectedComponents(graph) {
    // Set to keep track of visited nodes
    const visited = new Set();

    // Initialize aggregate to a default value
    let aggregate = 0;

    // Perform DFS on each unvisited node
    for (let node = 0; node < graph.length; node++) {
      if (!visited.has(node)) {
        // Initialize componentAggregate to a default value
        this.componentAggregate = 0;

        // Perform DFS to traverse all nodes in the connected component
        // of this node
        this.dfs(node, -1, graph, visited);

        // Add contribution of componentAggregate to aggregate using the function g
        aggregate = g(aggregate, this.componentAggregate);
      }

    // Return the final aggregate value
    return aggregate;
  }
```

Python

```python
from typing import List, Set, Tuple

class Solution:
    def __init__(self):
        # Aggregate for a single component
        self.component_aggregate: int = 0

    def dfs(
        self,
        node: int,
        parent: int,
        graph: List[List[Tuple[int, int]]],
        visited: Set[int]
    ) -> None:

        # Mark the current node as visited in the graph to avoid
        # visiting it again
        visited.add(node)

        # Add contribution of current node to componentAggregate using the function f
        self.component_aggregate = f(self.component_aggregate, node)

        # Recursively visit all the unvisited adjacent nodes
        for neighbour, _ in graph[node]:
            # If the neighbour node is not visited, visit it recursively
            if neighbour != parent and neighbour not in visited:
                self.dfs(neighbour, parent=node, graph=graph, visited=visited)

    def connected_components(self, graph: List[List[Tuple[int, int]]]) -> int:
        # Set to keep track of visited nodes
        visited: Set[int] = set()

        # Iniitialize aggregate to a default value
        aggregate = 0

        # Perform DFS on each unvisited node
        for node in range(len(graph)):
            if node not in visited:
                # Initialize componentAggregate to a default value
                self.component_aggregate = 0
                # Perform DFS to traverse all nodes in the connected component
                # of this node
                self.dfs(node, parent=-1, graph=graph, visited=visited)

                # Add contribution of componentAggregate to aggregate using the function g
                aggregate = g(aggregate, self.component_aggregate)

        # Return the final aggregate value
        return aggregate
```

## Complexity Analysis

We use the depth-first traversal algorithm to traverse all the nodes in the graph. If the functions `f` and `g` are constant **O(1)** operations, the algorithm has the same worst and best case time and space complexity as depth-first traversal. The runtime complexity is **O(N + E)**, and the space complexity is **O(N)**, where **N** represents the number of nodes and **E** denotes the total number of edges in the graph. 

> **Best Case:**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N+E)**
>
> **Worst Case:**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N+E)**

***

# Identifying the connected component pattern

Many graph problems require finding and processing some or all the connected components of a graph. These are generally **medium** or **hard** problems where we are given an undirected graph and need to find the aggregated value of some function `f` over all the nodes in all the connected components. Some problems may even go further and require aggregating all the component-level aggregates over another function `g`. Either depth-first or breadth-first traversal can traverse all connected components to solve such problems efficiently.

If the problem statement or its solution follows the generic template below, it can be solved by traversing all the connected components.

**Template:**Given a graph, find the aggregated value of a function `f` over all the nodes in all connected components. Optionally aggregate the component level aggregates over a function `g`.

## Example

Let's consider the following problem as an example to better understand how to solve connected component problems using depth-first traversal.

> **Problem statement:** Given an undirected graph where nodes have either a positive or zero value. A positive value indicates that the node can be visited, while a zero value indicates that it cannot be visited. A connected component is a subgraph made up of positive-valued nodes only, such that a path exists between any pair of nodes. Return a two-dimensional list of all nodes in all connected components of the graph.

// Diagram: Collect all the nodes in all connected components in a 2D list.

## Finding connected components

Since the zero-valued nodes cannot be visited, an edge leading to a zero-valued node can be considered non-existent. This makes an otherwise connected graph disconnected. To find all the connected components and nodes in them, we traverse the entire connected component of all unvisited nodes and add the nodes we visit to a list. We then add the lists generated from each connected component to the solution list.

// Diagram: The zero valued nodes create boundaries that disconnect the otherwise connected subgraph.

The problem description fits the generic template for the connected component pattern we learned earlier.

**Template:**Given a graph, find the aggregated value of a function `f` (add to list) over all the nodes in all connected components (positive value only connected nodes). Optionally aggregate the component-level aggregates (lists) over a function `g` (add to list)

We start by creating a `visited` set to keep track of the nodes that have been visited and a 2D list `components` to store all the connected components. We then iterate through the list of nodes and for each unvisited node that can be visited (has a positive value), create a list `component` to store all the nodes in its connected component. We then start depth-first traversal from that node and populate the `component` list. Once the depth-first traversal completes, we add the `component` list to the `components` list.

The depth-first search function accepts the `component` list and `visited` set as references to update their values during recursive traversal. As we enter a node, we add it to the `visited` set and the `component` list. We then iterate through all the unvisited neighbours that have positive values and recursively traverse them.

When the top-level call to depth-first traversal ends in the calling function, all nodes in the connected component of the initial node are visited and added to the `component` list which we then append to the `components` list. We then continue the iteration, reset the `component` list and repeat the process for the next unvisited node with a positive value. At the end of all iterations, the `components` list will have all the connected components of the graph as lists of nodes.

Collect all the nodes in all connected components in a 2D list.

The implementation of depth-first search to solve the problem is given below.

C++

```cpp
#include <unordered_set>

// Diagram: using namespace std;

class Solution {
public:
    void dfs(
        vector<vector<int>> &graph,
        int node,
        vector<int> &values,
        unordered_set<int> &visited,
        vector<int> &component
    ) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.insert(node);

        // Add the current node to the component list
        component.push_back(node);

         // Traverse all the neighbours of the current node
        for (int neighbour : graph[node]) {
            // If the neighbour is not visited and has a positive value,
            // recursively visit it
            if (visited.find(neighbour) == visited.end() && values[neighbour] != 0) {
                // Recursively visit all the nodes in the connected component
                dfs(graph, neighbour, values, visited, component);
            }

    vector<vector<int>> findConnectedComponents(
        vector<vector<int>> &graph,
        vector<int> &values
    ) {

        // Number of nodes in the graph
        int N = graph.size();

        // Initialize visited set
        unordered_set<int> visited;

        // Initialize a vector to store the connected components
        vector<vector<int>> components;

        // Iterate through all nodes in the graph
        for (int node = 0; node < N; node++) {
            // Start DFS only if node is unvisited and has a positive
            // value, visiting all nodes in the connected component
            // and adding them to the components list
            if (values[node] > 0 && visited.find(node) == visited.end()) {

                // Create a new component to store the nodes in the
                // connected component
                vector<int> component;

                // Start DFS from the current node and find all nodes
                // in the connected component
                dfs(graph, node, values, visited, component);

                // Add the found component to the components list
                components.push_back(component);
            }

        // Return the list of connected components
        return components;
    }
};
```

Java

```java
#include <unordered_set>
```

Typescript

```typescript
export class Solution {
    dfs(
        graph: number[][],
        node: number,
        values: number[],
        visited: Set<number>,
        component: number[]
    ): void {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.add(node);

        // Add the current node to the component list
        component.push(node);

        // Traverse all the neighbours of the current node
        for (const neighbour of graph[node]) {
            // If the neighbour is not visited and has a positive value,
            // recursively visit it
            if (!visited.has(neighbour) && values[neighbour] !== 0) {
                // Recursively visit all the nodes in the connected component
                this.dfs(graph, neighbour, values, visited, component);
            }

    findConnectedComponents(
        graph: number[][],
        values: number[]
    ): number[][] {

        // Number of nodes in the graph
        const N = graph.length;

        // Initialize visited set
        const visited = new Set<number>();

        // Initialize a vector to store the connected components
        const components: number[][] = [];

        // Iterate through all nodes in the graph
        for (let node = 0; node < N; node++) {
            // Start DFS only if node is unvisited and has a positive
            // value, visiting all nodes in the connected component
            // and adding them to the components list
            if (values[node] > 0 && !visited.has(node)) {

                // Create a new component to store the nodes in the
                // connected component
                const component: number[] = [];

                // Start DFS from the current node and find all nodes
                // in the connected component
                this.dfs(graph, node, values, visited, component);

                // Add the found component to the components list
                components.push(component);
            }

        // Return the list of connected components
        return components;
    }
```

Javascript

```javascript
export class Solution {
    dfs(graph, node, values, visited, component) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.add(node);

        // Add the current node to the component list
        component.push(node);

        // Traverse all the neighbours of the current node
        for (const neighbour of graph[node]) {
            // If the neighbour is not visited and has a positive value,
            // recursively visit it
            if (!visited.has(neighbour) && values[neighbour] !== 0) {
                // Recursively visit all the nodes in the connected component
                this.dfs(graph, neighbour, values, visited, component);
            }

// Diagram: findConnectedComponents(graph, values) {

        // Number of nodes in the graph
        const N = graph.length;

        // Initialize visited set
        const visited = new Set();

        // Initialize a vector to store the connected components
        const components = [];

        // Iterate through all nodes in the graph
        for (let node = 0; node < N; node++) {
            // Start DFS only if node is unvisited and has a positive
            // value, visiting all nodes in the connected component
            // and adding them to the components list
            if (values[node] > 0 && !visited.has(node)) {

                // Create a new component to store the nodes in the
                // connected component
                const component = [];

                // Start DFS from the current node and find all nodes
                // in the connected component
                this.dfs(graph, node, values, visited, component);

                // Add the found component to the components list
                components.push(component);
            }

        // Return the list of connected components
        return components;
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
        values: List[int],
        visited: Set[int],
        component: List[int]
    ) -> None:

        # Mark the current node as visited in the graph to avoid
        # visiting it again
        visited.add(node)

        # Add the current node to the component list
        component.append(node)

        # Traverse all the neighbours of the current node
        for neighbour in graph[node]:
            # If the neighbour is not visited and has a positive value,
            # recursively visit it
            if neighbour not in visited and values[neighbour] != 0:
                # Recursively visit all the nodes in the connected component
                self.dfs(graph, neighbour, values, visited, component)

    def find_connected_components(
        self,
        graph: List[List[int]],
        values: List[int]
    ) -> List[List[int]]:

        # Number of nodes in the graph
        n = len(graph)

        # Initialize visited set
        visited: Set[int] = set()

        # Initialize a vector to store the connected components
        components: List[List[int]] = []

        # Iterate through all nodes in the graph
        for node in range(n):
            # Start DFS only if node is unvisited and has a positive
            # value, visiting all nodes in the connected component
            # and adding them to the components list
            if values[node] > 0 and node not in visited:

                # Create a new component to store the nodes in the
                # connected component
                component: List[int] = []

                # Start DFS from the current node and find all nodes
                # in the connected component
                self.dfs(graph, node, values, visited, component)

                # Add the found component to the components list
                components.append(component)

        # Return the list of connected components
        return components
```

Depth-first traversal to find the connected components can solve the problem in **O(N+E)** time, where **N** is the number of nodes and **E** is the number of edges.

## Example problems

Most problems that fall under this category are **medium** or**hard**problems; a list of a few is given below.

> -   **[Find connected components](https://www.codeintuition.io/courses/graph/r-hypxidEdhQpa-YR8nEf)**
> -   **[Sum of minimums](https://www.codeintuition.io/courses/graph/Ze-8eP2NzJRlup0ygUE4G)**
> -   **[Island count](https://www.codeintuition.io/courses/graph/Q_OhyAUkXjXlaEVpLJe2W)**
> -   **[Size of largest island](https://www.codeintuition.io/courses/graph/IWbi2EbaG3iy7jd5-2FCm)**

***

# Connected components

## Problem Statement

Given an **undirected** **graph** represented as an adjacency list, and an array **values** where `values[i]` represents the value of the node `i`, write a function to find and return a list of connected components, where each component is represented as a list of visitable nodes.

The graph is given as follows: `graph[i]` is a list of all nodes you can visit from the node `i` (i.e., there is a directed edge from the node `i` to node `graph[i][j]`).

> -   A node is considered **visitable** if its corresponding value in the array is greater than zero. Nodes with a value of zero should be treated as **unvisitable**.

### Example 1

> -   **Input:** graph = \[\[1\], \[0, 2\], \[1, 3\], \[2, 4\], \[3, 5\], \[4, 6\], \[5\]\], values = \[1, 0, 1, 0, 1, 0, 1\]
> -   **Output:** \[\[0\], \[2\], \[4\], \[6\]\]
> -   **Explanation:** As we can see from the diagram above, there are four connected components in the graph.

### Example 2

> -   **Input:** graph = \[\[1\], \[0\], \[\], \[4\], \[3\]\], values = \[1, 1, 1, 1, 1\]
> -   **Output:** \[\[0, 1\], \[2\], \[3, 4\]\]
> -   **Explanation:** As we can see from the diagram above, there are three connected components in the graph.

## Solution

```cpp
#include <unordered_set>

using namespace std;

class Solution {
public:
    void dfs(
        vector<vector<int>> &graph,
        int node,
        vector<int> &values,
        unordered_set<int> &visited,
        vector<int> &component
    ) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.insert(node);

        // Add the current node to the component list
        component.push_back(node);

        // Traverse all the neighbours of the current node
        for (int neighbour : graph[node]) {

            // If the neighbour is not visited and has a positive value,
            // recursively visit it
            if (visited.find(neighbour) == visited.end() &&
                values[neighbour] != 0) {

                // Recursively visit all the nodes in the connected
                // component
                dfs(graph, neighbour, values, visited, component);
            }
        }
    }

    vector<vector<int>> connectedComponents(
        vector<vector<int>> &graph,
        vector<int> &values
    ) {

        // Number of nodes in the graph
        int N = graph.size();

        // Initialize visited set
        unordered_set<int> visited;

        // Initialize a vector to store the connected components
        vector<vector<int>> components;

        // Iterate through all nodes in the graph
        for (int node = 0; node < N; node++) {

            // Start DFS only if node is unvisited and has a positive
            // value, visiting all nodes in the connected component
            // and adding them to the components list
            if (values[node] > 0 &&
                visited.find(node) == visited.end()) {

                // Create a new component to store the nodes in the
                // connected component
                vector<int> component;

                // Start DFS from the current node and find all nodes
                // in the connected component
                dfs(graph, node, values, visited, component);

                // Add the found component to the components list
                components.push_back(component);
            }
        }

        // Return the list of connected components
        return components;
    }
};
```

***

# Sum of minimums

## Problem Statement

Given an **undirected** **graph** represented as an adjacency list, and an array **values** where `values[i]` represents the value of the node `i`, write a function to find and return the sum of the minimum values in all the connected components of the graph

The graph is given as follows: `graph[i]` is a list of all nodes you can visit from the node `i` (i.e., there is a directed edge from the node `i` to node `graph[i][j]`).

### Example 1

> -   **Input:** graph = \[\[1\], \[0, 4\], \[3\], \[2\], \[1\]\], values = \[2, 5, 1, 6, 7\]
> -   **Output:** 3
> -   **Explanation:** As we can see from the diagram above, there are two connected components in the graph, and the minimum values in them are 1 and 2.

### Example 2

> -   **Input:** graph = \[\[1\], \[0\], \[\], \[4\], \[3\]\], values = \[2, 5, 1, 6, 7\]
> -   **Output:** 9
> -   **Explanation:** As we can see from the diagram above, there are three connected components in the graph, and the minimum values in them are 2, 1, and 6.

## Solution

```cpp
#include <algorithm>
#include <unordered_set>
using namespace std;

class Solution {
public:
    int dfs(
        vector<vector<int>> &graph,
        int node,
        unordered_set<int> &visited,
        vector<int> &values
    ) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.insert(node);

        // Make this as the minimum value so far
        int minimumSoFar = values[node];

        // Traverse all the neighbours of the current node
        for (int neighbour : graph[node]) {

            // If the neighbour is not visited, recursively call the DFS
            // function on the neighbour
            if (visited.find(neighbour) == visited.end()) {

                // Get the minimum value from all the connected nodes
                int minVal = dfs(graph, neighbour, visited, values);

                // Update minimumSoFar if there was another node smaller
                // than it
                minimumSoFar = min(minimumSoFar, minVal);
            }
        }

        // Return the minimum value for this component
        return minimumSoFar;
    }

    int sumOfMinimums(vector<vector<int>> &graph, vector<int> &values) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return 0
        if (N == 0) {
            return 0;
        }

        // Initialize visited set
        unordered_set<int> visited;

        // Initialise the minimum sum to 0
        int minSum = 0;

        // Traverse all nodes in the graph
        for (int node = 0; node < N; node++) {

            // If the node is already visited, continue to the next node
            if (visited.find(node) != visited.end()) {
                continue;
            }

            // Perform DFS on this new node to visit all the nodes
            // connected to it and get the minimum value in it.
            int minVal = dfs(graph, node, visited, values);

            // Add the minVal to the minSum variable
            minSum += minVal;
        }

        // Return the size of minSum
        return minSum;
    }
};
```

***

# Island count

## Problem Statement

Given a **grid** filled with values of either `0`, or `1`, write a function to find and return the number of islands in this grid. 

> -   A value of \`1\` in a cell means the land.
> -   A value of \`0\` in a cell means water.

An island is either surrounded by water or the boundary of a grid and is formed by connecting adjacent lands horizontally, vertically, or diagonally, i.e., in all eight directions.

> You must abide by the following constraint:
>
> -   You can move in all eight directions: the four cardinal directions — \`up\`, \`right\`, \`down\`, and \`left\` — and the four diagonal directions — \`up-right\`, \`down-right\`, \`down-left\`, and \`up-left\`.

### Example 1

> -   **Input:** grid = \[\[1, 1, 0, 0\], \[0, 0, 1, 1\], \[1, 0, 1, 1\], \[1, 0, 0, 0\]\]
> -   **Output:** 2
> -   **Explanation:** As we can see from the diagram above there are two islands.

### Example 2

> -   **Input:** grid = \[\[1, 1, 0, 0\], \[0, 1, 1, 1\], \[1, 0, 1, 1\], \[1, 0, 0, 0\]\]
> -   **Output:** 1
> -   **Explanation:** As we can see from the diagram above there is one island.

## Solution

```cpp
using namespace std;

class Solution {
public:
    bool isValidCell(vector<vector<int>> &grid, int row, int col) {

        // Check if a cell is valid and belongs to a region of 1's, also
        // check that the cell is not water
        return row >= 0 && row < grid.size() && col >= 0 &&
               col < grid[0].size() && grid[row][col] == 1;
    }

    void dfs(
        vector<vector<int>> &grid,
        int row,
        int col,
        vector<vector<bool>> &visited
    ) {

        // Mark the current cell as visited
        visited[row][col] = true;

        // Define the possible movements: all 8 directions (up, right, 
        // down, left, and diagonals)
        vector<pair<int, int>> directions = {
            {-1,  0}, // Top
            {-1,  1}, // Top-right
            {0,  1},  // Right
            {1,  1},  // Bottom-right
            {1,  0},  // Bottom
            {1, -1},  // Bottom-left
            {0, -1},  // Left
            {-1, -1}  // Top-left
        };

        // Check all 8 neighbouring cells
        for (const auto& dir : directions) {
            int newRow = row + dir.first;
            int newCol = col + dir.second;

            // If the neighbour is not visited, recursively call the DFS
            // function on the neighbour
            if (isValidCell(grid, newRow, newCol) &&
                !visited[newRow][newCol]) {
                dfs(grid, newRow, newCol, visited);
            }
        }
    }

    int islandCount(vector<vector<int>> &grid) {
        int rows = grid.size();

        // Check if the grid is empty
        if (rows == 0) {
            return 0;
        }

        int cols = grid[0].size();

        // Initialise the island count to 0
        int islands = 0;

        // Initialize visited array
        vector<vector<bool>> visited(rows, vector<bool>(cols, false));

        // Traverse each cell of the grid
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {

                // If the cell is a water cell or it's already visited,
                // all the cells connected to it are also visited
                if (grid[row][col] == 0 || visited[row][col]) {
                    continue;
                }

                // Found a new land cell
                islands++;

                // Perform DFS on this new cell to visit all the cells
                // connected to it.
                dfs(grid, row, col, visited);
            }
        }

        // Return the number of islands
        return islands;
    }
};
```

***

# Island count

***

# Size of largest island

## Problem Statement

Given a **grid** filled with values of either `0`, or `1`, write a function to find and return the size of the largest island in this grid. 

> -   A value of \`1\` in a cell means the land.
> -   A value of \`0\` in a cell means water.

An island is either surrounded by water or the boundary of a grid and is formed by connecting adjacent lands horizontally, vertically, or diagonally, i.e., in all eight directions.

> You must abide by the following constraint:
>
> -   You can move in all eight directions: the four cardinal directions — \`up\`, \`right\`, \`down\`, and \`left\` — and the four diagonal directions — \`up-right\`, \`down-right\`, \`down-left\`, and \`up-left\`.

### Example 1

> -   **Input:** grid = \[\[1, 1, 0, 0\], \[0, 0, 1, 1\], \[1, 0, 1, 1\], \[1, 0, 0, 0\]\]
> -   **Output:** 6
> -   **Explanation:** As we can see from the diagram the largest island has an area of 6.

### Example 2

> -   **Input:** grid = \[\[1, 1, 0, 0\], \[0, 1, 1, 1\], \[1, 0, 1, 1\], \[1, 0, 0, 0\]\]
> -   **Output:** 9
> -   **Explanation:** As we can see from the diagram the largest island has an area of 9.

## Solution

```cpp
#include <algorithm>

using namespace std;

class Solution {
public:
    bool isValidCell(vector<vector<int>> &grid, int row, int col) {

        // Check if a cell is valid and belongs to a region of 1's, also
        // check that the cell is not water
        return row >= 0 && row < grid.size() && col >= 0 &&
               col < grid[0].size() && grid[row][col] == 1;
    }

    int dfs(
        vector<vector<int>> &grid,
        int row,
        int col,
        vector<vector<bool>> &visited
    ) {

        // Mark the current cell as visited
        visited[row][col] = true;

        // Define the possible movements: all 8 directions (up, right, 
        // down, left, and diagonals)
        vector<pair<int, int>> directions = {
            {-1,  0}, // Top
            {-1,  1}, // Top-right
            {0,  1},  // Right
            {1,  1},  // Bottom-right
            {1,  0},  // Bottom
            {1, -1},  // Bottom-left
            {0, -1},  // Left
            {-1, -1}  // Top-left
        };

        // Initialize the size of the region
        int size = 1;

        // Check all 8 neighbouring cells
        for (const auto& dir : directions) {
            int newRow = row + dir.first;
            int newCol = col + dir.second;

            // If the neighbour is not visited, recursively call the DFS
            // function on the neighbour
            if (isValidCell(grid, newRow, newCol) &&
                !visited[newRow][newCol]) {
                size += dfs(grid, newRow, newCol, visited);
            }
        }

        return size;
    }

    int sizeOfLargestIsland(vector<vector<int>> &grid) {
        int rows = grid.size();

        // Check if the grid is empty
        if (rows == 0) {
            return 0;
        }

        int cols = grid[0].size();

        // Initialise the largest island size to 0
        int largestIslandSize = 0;

        // Initialize visited array
        vector<vector<bool>> visited(rows, vector<bool>(cols, false));

        // Traverse each cell of the grid
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {

                // If the cell is a water cell or it's already visited,
                // all the cells connected to it are also visited
                if (grid[row][col] == 0 || visited[row][col]) {
                    continue;
                }

                // Perform DFS on this new cell to visit all the cells
                // connected to it and get the size of this island.
                int islandSize = dfs(grid, row, col, visited);

                // Update the size of the largest island
                largestIslandSize = max(largestIslandSize, islandSize);
            }
        }

        // Return the size of the largest island
        return largestIslandSize;
    }
};
```
