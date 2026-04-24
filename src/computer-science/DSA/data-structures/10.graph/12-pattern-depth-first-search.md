# Pattern: Depth-first search

## Table of Contents

1. [Understanding the depth-first search pattern](#pattern-depth-first-search)
2. [Identifying the depth-first search pattern](#identifying-the-depth-first-search-pattern)
3. [Source to target paths](#source-to-target-paths)
4. [Target paths](#target-paths)
5. [Hamiltonian paths](#hamiltonian-paths)
6. [Simple cycles](#simple-cycles)

***

# Understanding depth-first search pattern

The depth-first search algorithm starts from a node and explores all the nodes in a branch before backtracking and choosing other paths. It makes arbitrary choices of nodes at each depth until it can no longer make a choice and backtracks to update previous choices. It is a recursive algorithm that keeps track of all nodes in the path using a stack, enabling backtracking. The recursive implementation of the algorithm uses the function call stack to store nodes and any additional context at each step. Many graph problems can be efficiently solved using depth-first search.

The depth-first search pattern is a classification of problems that can be solved using the depth-first search algorithm.

// Diagram: The depth-first search algorithm explores one complete branch at a time.

## The depth-first search algorithm

Let's examine the generic problem that can only be solved efficiently using depth-first search to better understand the pattern. Consider have a graph, a source and destination node, a function `f` and a function `g`. We need to find the aggregated value of the function `f` over nodes in **all** the simple paths from the source node to the destination node. We need to further aggregate those aggregated values into a single value using the function `g`.

// Diagram: Aggregate all paths from source to destination using the functions f and g.

We can use depth-first search to solve the problem by exploring one path at a time, until either reaches a dead end or the destination node. The recursive nature of the algorithm allows us to build a path on the fly and backtrack when necessary.

However, unlike depth-first traversal, which also uses depth-first search, we don't need a `visited` set to keep track of **all** previously visited nodes. We only need to keep track of nodes in the currently explored path, because if we ever reach a previously visited node not in the current path, the resulting path must still be explored, as it will be counted as a unique path to the destination node.

// Diagram: We revisit the same node from different paths, which must be counted as unique.

We initialize two variables `pathAggregate` and `aggregate` to hold aggregated value of nodes in path over function `f` and the final aggregated values of all paths over the function `g` respectively with default values. We also initialise a set `nodesInPath` to hold all nodes in the currently explored path. As we will see later, it will be used to efficiently look up if a node exists in the current path.

// Diagram: Initialize aggregate variables and a set to track the nodes in the current depth-first search path.

We then start the depth-first search from the source node, and since all nodes need to share the same copy of `pathAggregate`, `aggregate`, and `nodesInPath`, we pass them by reference. For languages that do not support passing data by reference, these can also be created in the enclosing scope to make the same copy available across the recursive calls.

As we enter a node, we add it to `nodesInPath` and add its contribution to `pathAggregate` using the function `f`.

// Diagram: Add the node to nodesInPath set and its contribution to pathAggregate on entering the node.

We then check if the current node is the destination node. If it is, we add the contribution of `pathAggregate` to `aggregate` using the function `g`.

// Diagram: Add the contribution of pathAggregate to aggregate using the function g if the current node is the destination node.

On the other hand, if the current node is not the destination node, we iterate over all its neighbours, and for each neighbour not already in `nodesInPath`, recursively call depth-first search on it.

In any case, finally, we remove the contribution of the current node from `pathAggregate` using the inverse of the function `f` and remove it from `nodesInPath` before exiting the node and backtracking to the parent node. This way `pathAggregate` always has the aggregated value of the function `f` over all nodes in the path from the source node to the current node.

// Diagram: Remove the node from nodesInPath set and its contribution from pathAggregate on exit from the node.

At the end of the depth-first search from the source node, `pathAggregate` will have the default value and `aggregate` will have the aggregated value of the function `f` over all paths from source to destination, aggregated over the function `g`. Let's look at the example given below to understand the algorithm better.

Aggregate all paths from node(0) to node(2) using the functions f and g.

## Algorithm

The generic algorithm given below finds the aggregated value of a function`f`over all paths from the source node to the destination node. It further aggregates those values into a single value using the function `g`. 

> **Algorithm**
>
> **dfs(\[ref\] graph, node, destination, \[ref\] nodesInPath, \[ref\] pathAggregate, \[ref\] aggregate)**
>
> -   **Step 1:** Add node to \`nodesInPath\`
> -   **Step 2:** Add contribution of \`node\` to \`pathAggregate\` using the function \`f\`
> -   **Step 3:** if \`node\` is the \`destination\` node do the following:
>     -   **Step 3.1:** Add contribution of \`pathAggregate\` to \`aggregate\` using the function \`g\`
> -   **Step 4:** if \`node\` is not the \`destination\` node do the following:
>     -   **Step 4.1:** Iterate over all the neighbours of \`node\` in a variable \`neighbour\` and do the following
>         -   **Step 4.1.1:** If \`neighbour\` not in \`nodesInPath\` call \`dfs(graph, neighbour, destination, nodesInPath, pathAggregate, aggregate)\`
> -   **Step 5:** Remove \`node\` from \`nodesInPath\`
> -   **Step 6:** Remove the contribution of \`node\` from \`pathAggregate\` using the inverse of function \`f\`
>
> **callingFunction(\[ref\] graph, source, destination)**
>
> -   **Step 1:** Create a variable \`aggregate\` and initialize it with a default value
> -   **Step 2:** Create a variable \`pathAggregate\` and initialize it with a default value
> -   **Step 3:** Create a set \`nodesInPath\`
> -   **Step 4:** Call \`dfs(graph, source, destination, nodesInPath, pathAggregate, aggregate)\`
> -   **Step 5:** Return \`aggregate\`

## Implementation

Consider that we have a graph of size **N**, where the nodes are enumerated from **0** to **N-1**, and we are given the adjacency list of the graph as a two-dimensional list of integers `graph`, where the value is the enumeration of the neighbour node.

We implement a recursive function `dfs` and use a set `nodesInPath` to process all nodes in all paths from the source node to the destination node.

C++

```cpp
#include <vector>
#include <unordered_set>

// Diagram: using namespace std;

class Solution
{
public:
  void dfs(
      vector<vector<int>> &graph,
      int node,
      int destination,
      unordered_set<int> &nodesInPath,
      int &pathAggregate,
      int &aggregate)
  {

    // Add the current node to nodesInPath
    nodesInPath.insert(node);

    // Add the contibution of the current node node pathAggregate
    // using the function f
    pathAggregate = f(node, pathAggregate);

    // If the current node is the destination node, add the contribution
    // of this path to aggregate
    if (node == destination)
    {
      // Add the contibution of pathAggregate to aggregate
      // using the function g
      aggregate = g(pathAggregate, aggregate);
    }
    else
    {
      for (int neighbour : graph[node])
      {
        if (nodesInPath.find(neighbour) == nodesInPath.end())
        {
          // If the neighbour is not in the current path, recursively
          // explore it
          dfs(graph, neighbour, destination, nodesInPath, pathAggregate, aggregate);
        }

    // Remove the current node from nodesInPath before exit
    nodesInPath.erase(node);

    // Remove the contibution of the node to pathAggregate
    // using the inverse of function f before exit
    pathAggregate = fInverse(node, pathAggregate);
  }

  int callingFunction(vector<vector<int>> &graph, int source, int destination)
  {
    // Initilize aggregate to a default value
    int aggregate = 0;

    // Initilize the pathAggregate to a default value
    int pathAggregate = 0;

    // Set to store nodes in the current path
    unordered_set<int> nodesInPath;

    // Perform dfs starting from the source node
    dfs(graph, source, destination, nodesInPath, pathAggregate, aggregate);

    // Return the aggregated value
    return aggregate;
  }
};
```

Java

```java
import java.util.*;

// Diagram: class Solution {

    // Graph must be stored as an instance variable since it's used across methods
    private List<List<Integer>> graph;

    // These are promoted to class-level since Java passes primitives by value
    private int aggregate = 0;
    private int pathAggregate = 0;

    // Perform DFS to explore all paths
    public void dfs(
        int node,
        int destination,
        Set<Integer> nodesInPath
    ) {

        // Add the current node to nodesInPath
        nodesInPath.add(node);

        // Add the contribution of the current node to pathAggregate using function f
        pathAggregate = f(node, pathAggregate);

        // If the current node is the destination node, add the contribution of this path
        if (node == destination) {
            // Add the contribution of pathAggregate to aggregate using function g
            aggregate = g(pathAggregate, aggregate);
        } else {
            for (int neighbour : graph.get(node)) {
                if (!nodesInPath.contains(neighbour)) {
                    // If the neighbour is not in the current path, recursively explore it
                    dfs(neighbour, destination, nodesInPath);
                }

        // Remove the current node from nodesInPath before exit (backtrack)
        nodesInPath.remove(node);

        // Remove the contribution of the node from pathAggregate using inverse of function f
        pathAggregate = fInverse(node, pathAggregate);
    }

    public int callingFunction(List<List<Integer>> graph, int source, int destination) {
        // Set the graph
        this.graph = graph;

        // Initialize aggregate and pathAggregate to default values
        this.aggregate = 0;
        this.pathAggregate = 0;

        // Set to store nodes in the current path
        Set<Integer> nodesInPath = new HashSet<>();

        // Perform DFS starting from the source node
        dfs(source, destination, nodesInPath);

        // Return the aggregated value
        return aggregate;
    }

```

Typescript

```typescript
class Solution {
  // Used to simulate pass-by-reference
  private pathAggregate: number = 0;
  private aggregate: number = 0;

  // Recursive function to explore all paths from node to destination
  dfs(
    graph: number[][],
    node: number,
    destination: number,
    nodesInPath: Set<number>
  ): void {
    // Add the current node to nodesInPath
    nodesInPath.add(node);

    // Add the contribution of the current node to pathAggregate using the function f
    this.pathAggregate = f(node, this.pathAggregate);

    // If the current node is the destination node, add the contribution of this path to aggregate
    if (node === destination) {
      // Add the contribution of pathAggregate to aggregate using the function g
      this.aggregate = g(this.pathAggregate, this.aggregate);
    } else {
      for (const neighbour of graph[node]) {
        if (!nodesInPath.has(neighbour)) {
          // If the neighbour is not in the current path, recursively explore it
          this.dfs(graph, neighbour, destination, nodesInPath);
        }

    // Remove the current node from nodesInPath before exit
    nodesInPath.delete(node);

    // Remove the contribution of the node to pathAggregate using the inverse of function f
    this.pathAggregate = fInverse(node, this.pathAggregate);
  }

  // Entry point
  callingFunction(graph: number[][], source: number, destination: number): number {
    // Initialize aggregate to a default value
    this.aggregate = 0;

    // Initialize pathAggregate to a default value
    this.pathAggregate = 0;

    // Set to store nodes in the current path
    const nodesInPath: Set<number> = new Set();

    // Perform DFS starting from the source node
    this.dfs(graph, source, destination, nodesInPath);

    // Return the aggregated value
    return this.aggregate;
  }
```

Javascript

```javascript
class Solution {
  // Used to simulate pass-by-reference
  pathAggregate = 0;
  aggregate = 0;

  // Recursive function to explore all paths from node to destination
  dfs(
    graph,
    node,
    destination,
    nodesInPath
  ) {
    // Add the current node to nodesInPath
    nodesInPath.add(node);

    // Add the contribution of the current node to pathAggregate using the function f
    this.pathAggregate = f(node, this.pathAggregate);

    // If the current node is the destination node, add the contribution of this path to aggregate
    if (node === destination) {
      // Add the contribution of pathAggregate to aggregate using the function g
      this.aggregate = g(this.pathAggregate, this.aggregate);
    } else {
      for (const neighbour of graph[node]) {
        if (!nodesInPath.has(neighbour)) {
          // If the neighbour is not in the current path, recursively explore it
          this.dfs(graph, neighbour, destination, nodesInPath);
        }

    // Remove the current node from nodesInPath before exit
    nodesInPath.delete(node);

    // Remove the contribution of the node to pathAggregate using the inverse of function f
    this.pathAggregate = fInverse(node, this.pathAggregate);
  }

  // Entry point
  callingFunction(graph, source, destination) {
    // Initialize aggregate to a default value
    this.aggregate = 0;

    // Initialize pathAggregate to a default value
    this.pathAggregate = 0;

    // Set to store nodes in the current path
    const nodesInPath = new Set();

    // Perform DFS starting from the source node
    this.dfs(graph, source, destination, nodesInPath);

    // Return the aggregated value
    return this.aggregate;
  }
```

Python

```python
from typing import List, Set

class Solution:
    def __init__(self):
        # These are used to simulate pass-by-reference
        self.path_aggregate: int = 0
        self.aggregate: int = 0

    def dfs(
        self,
        graph: List[List[int]],
        node: int,
        destination: int,
        nodes_in_path: Set[int],
    ) -> None:

        # Add the current node to nodes_in_path
        nodes_in_path.add(node)

        # Add the contribution of the current node to path_aggregate
        # using the function f
        self.path_aggregate = f(node, self.path_aggregate)

        # If the current node is the destination node, add the contribution
        # of this path to aggregate
        if node == destination:
            # Add the contribution of path_aggregate to aggregate
            # using the function g
            self.aggregate = g(self.path_aggregate, self.aggregate)
        else:
            for neighbour in graph[node]:
                if neighbour not in nodes_in_path:
                    # If the neighbour is not in the current path, recursively
                    # explore it
                    self.dfs(graph, neighbour, destination, nodes_in_path)

        # Remove the current node from nodes_in_path before exit
        nodes_in_path.remove(node)

        # Remove the contribution of the node to path_aggregate
        # using the inverse of function f before exit
        self.path_aggregate = f_inverse(node, self.path_aggregate)

    def calling_function(
        self,
        graph: List[List[int]],
        source: int,
        destination: int
    ) -> int:

        # Initialize aggregates
        self.aggregate = 0
        self.path_aggregate = 0

        # Set to store nodes in the current path
        nodes_in_path: Set[int] = set()

        # Perform DFS starting from the source node
        self.dfs(graph, source, destination, nodes_in_path)

        # Return the aggregated value
        return self.aggregate
```

## Complexity Analysis

Unlike regular depth-first traversal, where we do not revisit a node after marking it visited, when using depth-first search to explore all paths from the source to the destination node, we mark a node **unvisited** from the `nodesInPath` set once it is no longer in the **current** path.

This is because, when exploring all paths from the source node, we may reach the same node from a path that was already marked as visited in some previous path. To ensure that we treat the current path independently of the previous one and explore it fully, we need to mark nodes as unvisited when they are no longer part of the current path. As a consequence, we end up exploring all possible paths in the graph from the source node to any other node.

// Diagram: Every revisit to the same node is from a different path that must be counted.

Consider a graph with **N** nodes and **E** edges, where the average number of edges per node is **e** and the function `f` and `g` are constant **O(1)** time functions.

In the worst case, when we have a complete graph where every node is connected to every other node, we end up exploring (**N-1)!** paths. This is because every possible combination of nodes (including subsets) can make up a path, and there are (**N-1)!** such combinations, leading to (**N-1)!** paths from any node. Since we only perform constant-time functions in each recursive call that builds the path, the worst-case time complexity is **O(N!)**.

In the best case, the graph may be a connected, acyclic, undirected graph (a tree), which means that only one path exists between any two nodes. And so the total number of paths from the source node to any other node is **N**, where **N** is the number of nodes, leading to a linear **O(N)** time complexity.

// Diagram: A tree is the best case for the algorithm.

The space complexity depends on the maximum size of the function call stack, which would be the maximum length of any path. Since the algorithm explores all paths from the source node in any case, the space complexity is bound by the maximum length of a simple path in a graph, which is **N**, leading to a linear **O(N)** space complexity.

> **Best Case:** The graph is a connected, undirected acyclic graph (tree)
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**
>
> **Worst Case:** The graph is a complete graph
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N!)**

***

# Identifying the depth-first search pattern

There are many graph problems that can only be solved efficiently by depth-first search. These are generally **medium** or **hard** problems where we need to process all nodes in a path from a source node to a destination node. In most cases, we need to find the aggregated value of a function `f` over all the nodes in some or all paths from a source node to a destination node. Some problems may even go further and require further aggregating the path aggregates over another function `g`. For most problems, this results in a single value that represents the combined contribution of all paths from the source node to the destination node.

If the problem statement or its solution follows the generic template below, it can be solved using depth-first search.

**Template:**Given a graph, find the aggregated value of a function `f` over some paths from a source node to a destination node. Optionally, further aggregate the path aggregates over a function `g`.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using depth-first search.

> **Problem statement:** Given a directed graph where nodes are enumerated from \`0\` to \`n-1\`, find and return all the paths from node 0 to node \`n-1\`

// Diagram: Find all paths from node(0) to node(2).

## The depth-first search solution

The problem description fits the template for the depth-first search pattern we learned earlier.

**Template:**Given a graph, find the aggregated value of a function `f` (add to list) over some (all) the paths from a source node(0) to a destination node(n-1). Further aggregate the path aggregates over a function `g` (add to list).

We start by creating a two-dimensional list `paths` to hold all the paths from the source to the destination node. We create a list `path` and a set `nodesInPath`to keep track of all the nodes in the current path in the right order, and efficiently look up if a node exists in the current path.

We then start the depth-first search from the source node, passing the lists and set as references. We add a node to `path` list and `nodesInPath` as we enter it and remove it as we exit it. When we reach the destination node, we add the path list, which now holds the nodes in `path` from the source to the destination to the `paths` list. For all other nodes, we recursively visit all its neighbours that are not already in the `nodesInPath` set.

This way, at the end of the depth-first search from the source node, the `paths` will have all the source-to-destination paths.

Find all paths from node(0) to node(2).

The implementation of the depth-first solution to solve the problem is given below.

C++

```cpp
#include <unordered_set>

// Diagram: using namespace std;

class Solution {
public:
    void dfs(
        vector<vector<int>> &graph,
        int node,
        vector<int> &path,
        vector<vector<int>> &paths,
        unordered_set<int> &nodesInPath
    ) {

        // Insert the current node into the set of nodes in the current
        // path to avoid cycles
        nodesInPath.insert(node);

        // Add the current node to the path
        path.push_back(node);

        // If the current node is the destination node, add the current
        // path to the paths list
        if (node == graph.size() - 1) {
            paths.push_back(path);
        }

        // Else, recursively explore all the neighbours of the current
        // node
        else {
            for (int neighbour : graph[node]) {

                // Perform DFS on the neighbour node if it is not already
                // in the current path to avoid cycles
                if (nodesInPath.find(neighbour) == nodesInPath.end()) {
                    dfs(graph, neighbour, path, paths, nodesInPath);
                }

        // Remove the current node from the path as we are done exploring
        // it
        path.pop_back();

        // Remove the current node from the set of nodes in the current
        // path to allow it to be visited again in other paths
        nodesInPath.erase(node);
    }

// Diagram: vector<vector<int>> sourceToTargetPaths(vector<vector<int>> &graph) {

        // Result list to store all the paths
        vector<vector<int>> paths;

        // List to store the current path
        vector<int> path;

        // Set to keep track of nodes in the current path
        unordered_set<int> nodesInPath;

        // Perform DFS starting from node 0
        dfs(graph, 0, path, paths, nodesInPath);

        // Return the list of paths
        return paths;
    }
};
```

Java

```java
import java.util.*;

class Solution {
    public void dfs(
        List<List<Integer>> graph,
        int node,
        List<Integer> path,
        List<List<Integer>> paths,
        Set<Integer> nodesInPath
    ) {

        // Insert the current node into the set of nodes in the current
        // path to avoid cycles
        nodesInPath.add(node);

        // Add the current node to the path
        path.add(node);

        // If the current node is the destination node, add the current
        // path to the paths list
        if (node == graph.size() - 1) {
            paths.add(new ArrayList<>(path));
        }

        // Else, recursively explore all the neighbours of the current
        // node
        else {
            for (int neighbour : graph.get(node)) {

                // Perform DFS on the neighbour node if it is not already
                // in the current path to avoid cycles
                if (!nodesInPath.contains(neighbour)) {
                    dfs(graph, neighbour, path, paths, nodesInPath);
                }

        // Remove the current node from the path as we are done exploring
        // it
        path.remove(path.size() - 1);

        // Remove the current node from the set of nodes in the current
        // path to allow it to be visited again in other paths
        nodesInPath.remove(node);
    }

    public List<List<Integer>> sourceToTargetPaths(
        List<List<Integer>> graph
    ) {

        // Result list to store all the paths
        List<List<Integer>> paths = new ArrayList<>();

        // List to store the current path
        List<Integer> path = new ArrayList<>();

        // Set to keep track of nodes in the current path
        Set<Integer> nodesInPath = new HashSet<>();

        // Perform DFS starting from node 0
        dfs(graph, 0, path, paths, nodesInPath);

        // Return the list of paths
        return paths;
    }
```

Typescript

```typescript
export class Solution {
    dfs(
        graph: number[][],
        node: number,
        path: number[],
        paths: number[][],
        nodesInPath: Set<number>
    ): void {

        // Insert the current node into the set of nodes in the current
        // path to avoid cycles
        nodesInPath.add(node);

        // Add the current node to the path
        path.push(node);

        // If the current node is the destination node, add the current
        // path to the paths list
        if (node === graph.length - 1) {
            paths.push([...path]);
        }

        // Else, recursively explore all the neighbours of the current
        // node
        else {
            for (const neighbour of graph[node]) {

                // Perform DFS on the neighbour node if it is not already
                // in the current path to avoid cycles
                if (!nodesInPath.has(neighbour)) {
                    this.dfs(graph, neighbour, path, paths, nodesInPath);
                }

        // Remove the current node from the path as we are done exploring
        path.pop();

        // Remove the current node from the set of nodes in the current
        // path to allow it to be visited again in other paths
        nodesInPath.delete(node);
    }

// Diagram: sourceToTargetPaths(graph: number[][]): number[][] {

        // Result list to store all the paths
        const paths: number[][] = [];

        // List to store the current path
        const path: number[] = [];

        // Set to keep track of nodes in the current path
        const nodesInPath: Set<number> = new Set();

        // Perform DFS starting from node 0
        this.dfs(graph, 0, path, paths, nodesInPath);

        // Return the list of paths
        return paths;
    }
```

Javascript

```javascript
export class Solution {
    dfs(graph, node, path, paths, nodesInPath) {

        // Insert the current node into the set of nodes in the current
        // path to avoid cycles
        nodesInPath.add(node);

        // Add the current node to the path
        path.push(node);

        // If the current node is the destination node, add the current
        // path to the paths list
        if (node === graph.length - 1) {
            paths.push([...path]);
        }

        // Else, recursively explore all the neighbours of the current
        // node
        else {
            for (const neighbour of graph[node]) {

                // Perform DFS on the neighbour node if it is not already
                // in the current path to avoid cycles
                if (!nodesInPath.has(neighbour)) {
                    this.dfs(graph, neighbour, path, paths, nodesInPath);
                }

        // Remove the current node from the path as we are done exploring
        path.pop();

        // Remove the current node from the set of nodes in the current
        // path to allow it to be visited again in other paths
        nodesInPath.delete(node);
    }

// Diagram: sourceToTargetPaths(graph) {

        // Result list to store all the paths
        const paths = [];

        // List to store the current path
        const path = [];

        // Set to keep track of nodes in the current path
        const nodesInPath = new Set();

        // Perform DFS starting from node 0
        this.dfs(graph, 0, path, paths, nodesInPath);

        // Return the list of paths
        return paths;
    }
```

Python

```python
#include <unordered_set>
```

.

## Example problems

Most problems that fall under this category are**medium** or **hard**problems; a list of a few is given below.

> -   **[Source to target paths](https://www.codeintuition.io/courses/graph/YAQ6SYOEpo45NOYGIxPbJ)**
> -   **[Target paths](https://www.codeintuition.io/courses/graph/EQ7W4YKkuz_B0SwKD3U9C)**
> -   **[Hamiltonian paths](https://www.codeintuition.io/courses/graph/CSkjAX5VBcSN8EZhUGCXu)**
> -   **[Simple cycles](https://www.codeintuition.io/courses/graph/emSEXkb3MdqLuIagVIF9v)**

We will now solve these problems to gain a deeper understanding of the depth-first search pattern.

***

# Source to target paths

## Problem Statement

Given a **directed** **graph** represented as an adjacency list, write a function to find and return all the paths from node `0` to node `n - 1`. You can return the answer in **any order**.

The graph is given as follows: `graph[i]` is a list of all nodes you can visit from node `i` (i.e., there is a directed edge from node `i` to node `graph[i][j]`).

### Example 1

> -   **Input:** graph = \[\[1, 2\], \[4\], \[3, 4\], \[4\], \[0\]\]
> -   **Output:** \[\[0, 1, 4\], \[0, 2, 3, 4\], \[0, 2, 4\]\]
> -   **Explanation:** Above are all the paths from node 0 to node 4.

### Example 2

> -   **Input:** graph = \[\[4\], \[0, 3\], \[0, 4\], \[2, 4\], \[1\]\]
> -   **Output:** \[\[0, 4\]\]
> -   **Explanation:** Above are all the paths from node 0 to node 4.

## Solution

```cpp
#include <unordered_set>

using namespace std;

class Solution {
public:
    void dfs(
        vector<vector<int>> &graph,
        int node,
        vector<int> &path,
        vector<vector<int>> &paths,
        unordered_set<int> &nodesInPath
    ) {

        // Insert the current node into the set of nodes in the current
        // path to avoid cycles
        nodesInPath.insert(node);

        // Add the current node to the path
        path.push_back(node);

        // If the current node is the destination node, add the current
        // path to the paths list
        if (node == graph.size() - 1) {
            paths.push_back(path);
        }

        // Else, recursively explore all the neighbours of the current
        // node
        else {
            for (int neighbour : graph[node]) {

                // Perform DFS on the neighbour node if it is not already
                // in the current path to avoid cycles
                if (nodesInPath.find(neighbour) == nodesInPath.end()) {
                    dfs(graph, neighbour, path, paths, nodesInPath);
                }
            }
        }

        // Remove the current node from the path as we are done exploring
        // it
        path.pop_back();

        // Remove the current node from the set of nodes in the current
        // path to allow it to be visited again in other paths
        nodesInPath.erase(node);
    }

    vector<vector<int>> sourceToTargetPaths(vector<vector<int>> &graph) {

        // Result list to store all the paths
        vector<vector<int>> paths;

        // List to store the current path
        vector<int> path;

        // Set to keep track of nodes in the current path
        unordered_set<int> nodesInPath;

        // Perform DFS starting from node 0
        dfs(graph, 0, path, paths, nodesInPath);

        // Return the list of paths
        return paths;
    }
};
```

***

# Target paths

## Problem Statement

Given a **weighted directed graph** represented as an adjacency list, a **source**, a **destination**, and a **target**, write a function to find all the paths from the source to the destination where the total edge weight equals the target. You can return the answer in **any order**.

The graph is given as follows: `graph[i]` is a list of pairs `[neighbour, weight]`, where each pair indicates a directed edge from node `i` to the node neighbour with the specified weight.

### Example 1

> -   **Input:** graph = \[\[\[1, 2\], \[3, 5\]\], \[\[4, 2\]\], \[\[4, 1\]\], \[\[2, 2\]\], \[\[3, 1\]\]\], source = 0, destination = 3, target = 5
> -   **Output:** \[\[0, 1, 4, 3\], \[0, 3\]\]
> -   **Explanation:** Above are all the paths from the source to the destination where the total edge weight equals the target.

### Example 2

> -   **Input:** graph = \[\[\[4, 2\]\], \[\[3, 3\], \[0, 4\]\], \[\[4, 3\], \[0, 1\]\], \[\[2, 1\], \[4, 4\]\], \[\[1, 5\]\]\], source = 3, destination = 4, target = 4
> -   **Output:** \[\[3, 2, 4\], \[3, 2, 0, 4\], \[3, 4\]\]
> -   **Explanation:** Above are all the paths from the source to the destination where the total edge weight equals the target.

## Solution

```cpp
#include <unordered_set>

using namespace std;

class Solution {
public:
    void dfs(
        vector<vector<pair<int, int>>> &graph,
        int node,
        int destination,
        int currentSum,
        int target,
        vector<int> &path,
        vector<vector<int>> &paths,
        unordered_set<int> &nodesInPath
    ) {

        // Insert the current node into the set of nodes in the current
        // path to avoid revisiting the same node
        nodesInPath.insert(node);

        // Add the current node to the path
        path.push_back(node);

        // If the current node is the destination and the path sum equals
        // the target sum, store the current path
        if (node == destination && currentSum == target) {
            paths.push_back(path);
        }

        // Else, explore all the neighbours of the current node
        else {
            for (auto &edge : graph[node]) {
                int neighbour = edge.first;
                int weight = edge.second;

                // Perform DFS on the neighbour node if it is not already
                // in the current path to avoid cycles
                if (nodesInPath.find(neighbour) == nodesInPath.end()) {

                    // Explore neighbour and add its edge weight to the
                    // current sum
                    dfs(graph,
                        neighbour,
                        destination,
                        currentSum + weight,
                        target,
                        path,
                        paths,
                        nodesInPath);
                }
            }
        }

        // Remove the current node from the path as we are done exploring
        // it
        path.pop_back();

        // Remove the current node from the set of nodes in the current
        // path to allow it to be visited again in other paths
        nodesInPath.erase(node);
    }

    vector<vector<int>> targetPaths(
        vector<vector<pair<int, int>>> &graph,
        int source,
        int destination,
        int target
    ) {

        // Result list to store all the Hamiltonian paths
        vector<vector<int>> paths;

        // List to store the current path being explored
        vector<int> path;

        // Set to keep track of nodes currently in the path
        unordered_set<int> nodesInPath;

        // Perform DFS starting from the source node with an initial sum
        // of 0
        dfs(graph,
            source,
            destination,
            0,
            target,
            path,
            paths,
            nodesInPath);

        // Return the list of valid paths with the given sum
        return paths;
    }
};
```

***

# Target paths

***

# Hamiltonian paths

## Problem Statement

Given a **directed graph** represented as an adjacency list, a **source** and a **destination**, write a function to find and return all the hamiltonian paths from the source to the destination. You can return the answer in **any order**.

The graph is given as follows: `graph[i]` is a list of all nodes you can visit from node `i` (i.e., there is a directed edge from node `i` to node `graph[i][j]`).

A Hamiltonian path is a path in a graph that visits each vertex exactly once without repetition.

### Example 1

> -   **Input:** graph = \[\[1, 2\], \[0, 2, 3\], \[0, 1, 3\], \[1, 2\]\], source = 0, destination = 3
> -   **Output:** \[\[0, 1, 2, 3\], \[0, 2, 1, 3\]\]
> -   **Explanation:** Above are all the hamiltonian paths from the node 0 to node 3.

### Example 2

> -   **Input:** graph = \[\[1\], \[0, 2\], \[1, 3\], \[2\]\], source = 0, destination = 3
> -   **Output:** \[\[0, 1, 2, 3\]\]
> -   **Explanation:** Above are all the hamiltonian paths from the node 0 to node 3.

## Solution

```cpp
#include <unordered_set>

using namespace std;

class Solution {
public:
    void dfs(
        vector<vector<int>> &graph,
        int node,
        int destination,
        vector<int> &path,
        vector<vector<int>> &paths,
        unordered_set<int> &nodesInPath
    ) {

        // Insert the current node into the set of nodes in the current
        // path to avoid revisiting the same node
        nodesInPath.insert(node);

        // Add the current node to the path
        path.push_back(node);

        // If the current node is the destination node and all nodes
        // have been visited, we have found a valid Hamiltonian Path
        if (node == destination && nodesInPath.size() == graph.size()) {
            paths.push_back(path);
        }

        // Else, recursively explore all the neighbours of the current
        // node
        else {
            for (int neighbour : graph[node]) {

                // Perform DFS on the neighbour node if it is not already
                // in the current path to avoid cycles
                if (nodesInPath.find(neighbour) == nodesInPath.end()) {
                    dfs(graph,
                        neighbour,
                        destination,
                        path,
                        paths,
                        nodesInPath);
                }
            }
        }

        // Remove the current node from the path as we are done exploring
        // it
        path.pop_back();

        // Remove the current node from the set of nodes in the current
        // path to allow it to be visited again in other possible paths
        nodesInPath.erase(node);
    }

    vector<vector<int>> hamiltonianPaths(
        vector<vector<int>> &graph,
        int source,
        int destination
    ) {

        // Result list to store all the Hamiltonian paths
        vector<vector<int>> paths;

        // List to store the current path being explored
        vector<int> path;

        // Set to keep track of nodes currently in the path
        unordered_set<int> nodesInPath;

        // Perform DFS starting from the source node
        dfs(graph, source, destination, path, paths, nodesInPath);

        // Return the list of all valid Hamiltonian paths
        return paths;
    }
};
```

***

# Simple cycles

## Problem Statement

Given a **directed graph** represented as an adjacency list, a **source** and a **destination**, write a function to find and return the total number of simple cycles in this graph that start at the source and pass through the destination.

The graph is given as follows: `graph[i]` is a list of all nodes you can visit from node `i` (i.e., there is a directed edge from node `i` to node `graph[i][j]`).

A simple cycle is a path that starts and ends at the same node without repeating any other nodes.

### Example 1

> -   **Input:** graph = \[\[1, 2\], \[0, 2, 3\], \[0, 1, 3\], \[1, 2\]\], source = 0, destination = 3
> -   **Output:** 2
> -   **Explanation:** There are two simple cycles in the graph that start and end at the source node 0 and also include the destination node 3, they are: \[0, 1, 3, 2, 0\] and \[0, 2, 3, 1, 0\].

### Example 2

> -   **Input:** graph = \[\[1\], \[0, 2\], \[1, 3\], \[2\]\], source = 0, destination = 3
> -   **Output:** 0
> -   **Explanation:** There are no simple cycles that start at the source and pass through the destination.

## Solution

```cpp
#include <unordered_set>

using namespace std;

class Solution {
public:

    // Counter to store total simple cycles
    int cycles = 0;

    void dfs(
        vector<vector<int>> &graph,
        int node,
        int source,
        int destination,
        unordered_set<int> &nodesInPath
    ) {

        // Insert the current node into the set of nodes in the current
        // path to detect cycles
        nodesInPath.insert(node);

        // Explore all neighbors of the current node
        for (int neighbor : graph[node]) {

            // Case 1: Neighbor is not visited yet, continue DFS
            if (nodesInPath.find(neighbor) == nodesInPath.end()) {
                dfs(graph, neighbor, source, destination, nodesInPath);
            }

            // Case 2: Neighbor is the starting node and forms a valid
            // cycle Path must have at least 3 nodes and include the
            // destination
            else if (neighbor == source && nodesInPath.size() > 2 &&
                     nodesInPath.find(destination) !=
                         nodesInPath.end()) {
                cycles++;
            }
        }

        // Remove the current node from the current path as we are done
        // exploring it
        nodesInPath.erase(node);
    }

    int simpleCycles(
        vector<vector<int>> &graph,
        int source,
        int destination
    ) {

        // Set to keep track of nodes in the current path
        unordered_set<int> nodesInPath;

        // Perform DFS starting from the source node
        dfs(graph, source, source, destination, nodesInPath);

        // Return total cycles found
        return cycles;
    }
};
```
