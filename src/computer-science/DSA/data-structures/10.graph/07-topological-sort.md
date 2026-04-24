# Topological sort

## Table of Contents

1. [Understanding topological sort](#understanding-topological-sort)
2. [Understanding the topological sort algorithm](#understanding-the-topological-sort-algorithm)
3. [Implement topological sort](#topological-sort)
4. [Implement topological sort II](#topological-sort-ii)

***

# Understanding topological sort

A graph can be used to model various problems involving relationships between entities and solve them efficiently. Often, when modelling problems using a graph, we end up with a directed graph that does not contain any cycles (a directed acyclic graph). Since these graphs are directed and don't have any cycles, we can define a linear ordering of their nodes such that each node appears before all the other nodes connected to it directly or indirectly via out-edges. Such an ordering is called the topological sort or topological ordering of the graph.

It is important to note that there can be more than one correct topological ordering of a graph.

// Diagram: The topological ordering of a directed acyclic graph.

Let's look at a few examples to better understand the types of problems that are modelled using a directed-acyclic graph and what the topological ordering for them represents.

## Package managers

Package managers (like npm, pip, apt, cargo, etc.) are responsible for installing software libraries and tools that a project depends on. However, many packages rely on other packages to be installed and initialized properly. If the dependencies are not installed in the correct order, it could lead to failures. All the directed and indirect dependencies of a project make up a dependency graph, which is a directed acyclic graph.

// Diagram: A directed acyclic graph representing the dependency of packages.

To ensure that every package has its dependencies installed before we attempt to install it, we must install the packages in the topological order of the dependency graph.

// Diagram: A topological order for the directed acyclic graph represents the order of installation of packages.

## Task Scheduling

Workflow engines like Apache Airflow, Prefect, Luigi, Argo, etc are software that help create automations for large workflows. The user of this software defines what a task is supposed to do and the tasks that need to be executed before it. These softwares model the tasks as a directed acyclic graph.

// Diagram: A directed acyclic graph representing tasks in a workflow management software.

To ensure that every task is run only after all its prerequisite tasks have finished, the tasks are executed in the topological order of the directed acyclic graph.

// Diagram: A topological order for the directed acyclic graph represents the order of execution of tasks.

## Build systems

When compiling a large project, not all files can be compiled at once. Some files may depend on other files by importing some functions or classes from them. We can model all the files in the project as a large dependency graph where a node represents a file and the edges between them represent the dependency of one file on the other.

// Diagram: A directed acyclic graph representing the compile time dependencies of files.

The topological order of the nodes in the dependency graph represents the order in which files can be compiled making sure all dependencies of a file are compiled before compiling it.

// Diagram: A topological order for the directed acyclic graph represents the order of compilation of files.

Later in the course, we will learn the topological sorting algorithm to find a topological order of nodes in a directed acyclic graph.

***

# Understanding the topological sort algorithm

The topological sort algorithm sorts the nodes of a graph in a topological order. For the algorithm to work, the graph should be a directed acyclic graph, as no topological order exists for a cyclic graph. Moreover, there can be many topological orders for a directed acyclic graph, and all of them can be correct. In this lesson, we will learn about the depth-first search-based algorithm used to find a topological order.

// Diagram: A directed acyclic graph can have multiple correct topological orderings.

## Algorithm

The topological sort algorithm is really simple to understand as it is only a series of depth-first searches. Every depth-first search discovers a section of the topological order of the entire graph. These individual sections are stitched together to get the topological order of the whole graph. We will learn more about the proof of correctness of the algorithm later in the lesson.

This topological sort algorithm only works for directed **acyclic** graphs and returns a topological order of nodes. There can be many correct topological orders for a graph and this graph only returns one of those.

Consider we have the following graph, and we need to find the topological order of nodes for it.

// Diagram: Find a topological order of nodes for the graph.

We start by creating a `visited` set to perform depth-first search in the graph and a `result` list that will store the nodes of the graph in topological order.

// Diagram: Create a visited set and a result list.

We iterate through the list of nodes and, for each unvisited node, perform a depth-first search from it to visit all nodes reachable from it. We add a node to the `visited` set as we enter it and append it to the `result` list just before exiting. Once the depth-first search from a node ends, we continue the iterations to repeat the process for all the remaining unvisited nodes.

This way, at the end of the traversal, all nodes will be added to the `visited` set, and the `result` list will have the **reverse** topological order of the nodes. We finally reverse the `result` list to get the topological order of nodes in the graph. We will learn more about the proof of correctness of this algorithm later in the lesson.

The steps given below summarize the topological sort algorithm for a graph.

> **Algorithm**
>
> **dfs(node, \[ref\] graph, \[ref\] visited, \[ref\] result)**
>
> -   **Step 1:** Add \`node\` to \`visited\` set
> -   **Step 2:** Iterate over all the neighbours of \`node\` in a variable \`neighbour\` and do the following
>     -   **Step 2.1:** If \`neighbour\` not in \`visited\` set call \`dfs(neighbour, graph, visited, result)\`
> -   **Step 3:** Add \`node\` to \`result\` list
>
> **topologicalSort(\[ref\] graph)**
>
> -   **Step 1:** Create a \`visited\` set
> -   **Step 2:** Create a \`visitedresult\` list
> -   **Step 3:** Iterate over all the nodes in the graph in a variable \`node\` and do the following
>     -   **Step 3.1:** If \`node\` not in \`visited\` set call \`dfs(node, graph, visited, result)\`
> -   **Step 4:** Reverse the \`result\` list
> -   **Step 5:** Return \`result\`

Let's examine the execution of the topological sort algorithm on a directed acyclic graph to understand the it better.

Find a topological order of nodes for the graph.

## Proof of correctness

It is very easy to prove the correctness of the depth-first search algorithm for finding a topological ordering. Consider we have a directed acyclic graph, and any generic node `b` in the graph, such that nodes `a1, a2, ..., an` are connected to it via in-edges and nodes `c1, c2, ..., cn` are connected to it via out-edges.

// Diagram: A generic node in the graph has some out-edges and in-edges.

Now, consider that we start depth-first search from any node `a1`, adding nodes to a `result` list at the time of **exit** from a node. It is guaranteed that node `a1` will appear after node `b`, which will appear **after** the nodes `c1, c2, ..., cn`.  This is because the depth-first search will only exit a node after all its outward edges are fully explored. This means that all nodes connected to a node directly or indirectly via the out-edges will already have been added to the `result` list before exiting the parent node. Note that the order generated in the result list is precisely the reverse of the topological order of nodes. Conversely, applying depth-first search from a node and adding nodes to a list on exit generates the reverse topological order of nodes reachable from it.

**Lemma 1**Applying depth-first search from a node and adding nodes to a list on exit generates the reverse topological order of nodes reachable from it.

// Diagram: Adding nodes to a list on exit generates reverse topological order.

Now, consider that we had run a depth-first search from the node `b` before running it from the node `a1`. In this case, the `result` list would already have the reverse topological order of nodes reachable from node `b` when we start depth-first search from node `a1`. Since depth-first search ignores visited nodes, it would not revisit the node `b` and only add the node `a1` to the `result` list on exit from it, which would still appear after the node `b`, maintaining the reverse topological order. Conversely, the order of applying depth-first search does not matter.

**Lemma 2**The order of applying depth-first search does not matter.

// Diagram: The order of applying depth-first search does not matter, as the final list will still have nodes in reverse topological order.

Combining **Lemma1** and **Lemma2** from above proves that running depth-first search from unvisited nodes in any order, skipping the visited nodes and adding the nodes to a list at the time of exit generates the **reverse** topological order for all nodes of the graph. Therefore, reversing the final list yields the topological order of all nodes in the graph. This proves the correctness of the topological sort algorithm we learned earlier.

## Implementation

Consider that we have a directed acyclic graph of size**N**, where the nodes are enumerated from**0**to**N-1**, and we are given the adjacency listof the graph as a two-dimensional list `graph`. Given below is the implementation of the topological sort algorithm to find the topological ordering of nodes in a list `result`.

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

        // Recursively visit all the adjacent nodes
        for (int neighbour : graph[node]) {

            // If the neighbour node is not visited, visit it recursively
            if (visited.find(neighbour) == visited.end()) {
                dfs(graph, neighbour, visited, result);
            }

        // Push the current node to the result after all its neighbours
        // have been visited
        result.push_back(node);
    }

// Diagram: vector<int> topologicalSort(vector<vector<int>> &graph) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return an empty vector
        if (N == 0) {
            return {};
        }

        // Set to keep track of visited nodes
        unordered_set<int> visited;

        // Keep track of the topological sort ordering
        vector<int> result;

        // Perform DFS on each unvisited node
        for (int node = 0; node < graph.size(); node++) {
            if (visited.find(node) == visited.end()) {

                // If a node is not visited, start DFS on it to visit all
                // the nodes connected to it.
                dfs(graph, node, visited, result);
            }

        // Reverse the result to get the topological order
        reverse(result.begin(), result.end());
        return result;
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
        Set<Integer> visited,
        List<Integer> result
    ) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.add(node);

        // Recursively visit all the adjacent nodes
        for (int neighbour : graph.get(node)) {

            // If the neighbour node is not visited, visit it recursively
            if (!visited.contains(neighbour)) {
                dfs(graph, neighbour, visited, result);
            }

        // Push the current node to the result after all its neighbours
        // have been visited
        result.add(node);
    }

// Diagram: public List<Integer> topologicalSort(List<List<Integer>> graph) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return an empty list
        if (N == 0) {
            return new ArrayList<>();
        }

        // Set to keep track of visited nodes
        Set<Integer> visited = new HashSet<>();

        // Keep track of the topological sort ordering
        List<Integer> result = new ArrayList<>();

        // Perform DFS on each unvisited node
        for (int node = 0; node < N; node++) {
            if (!visited.contains(node)) {

                // If a node is not visited, start DFS on it to visit all
                // the nodes connected to it.
                dfs(graph, node, visited, result);
            }

        // Reverse the result to get the topological sort in correct
        // order
        Collections.reverse(result);
        return result;
    }
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

        // Recursively visit all the adjacent nodes
        for (const neighbour of graph[node]) {

            // If the neighbour node is not visited, visit it recursively
            if (!visited.has(neighbour)) {
                this.dfs(graph, neighbour, visited, result);
            }

        // Push the current node to the result after all its neighbours
        // have been visited
        result.push(node);
    }

// Diagram: topologicalSort(graph: number[][]): number[] {

        // Number of nodes in the graph
        const N = graph.length;

        // If the graph is empty, return an empty vector
        if (N === 0) {
            return [];
        }

        // Set to keep track of visited nodes
        const visited = new Set<number>();

        // Keep track of the topological sort ordering
        const result: number[] = [];

        // Perform DFS on each unvisited node
        for (let node = 0; node < N; node++) {
            if (!visited.has(node)) {

                // If a node is not visited, start DFS on it to visit all
                // the nodes connected to it.
                this.dfs(graph, node, visited, result);
            }

        // Reverse the result to get the topological sort in correct
        // order
        result.reverse();
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

        // Recursively visit all the adjacent nodes
        for (const neighbour of graph[node]) {

            // If the neighbour node is not visited, visit it recursively
            if (!visited.has(neighbour)) {
                this.dfs(graph, neighbour, visited, result);
            }

        // Push the current node to the result after all its neighbours
        // have been visited
        result.push(node);
    }

// Diagram: topologicalSort(graph) {

        // Number of nodes in the graph
        const N = graph.length;

        // If the graph is empty, return an empty list
        if (N === 0) {
            return [];
        }

        // Set to keep track of visited nodes
        const visited = new Set();

        // Keep track of the topological sort ordering
        const result = [];

        // Perform DFS on each unvisited node
        for (let node = 0; node < N; node++) {
            if (!visited.has(node)) {

                // If a node is not visited, start DFS on it to visit all
                // the nodes connected to it.
                this.dfs(graph, node, visited, result);
            }

        // Reverse the result to get the topological sort in correct
        // order
        result.reverse();
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

        # Mark the current node as visited in the graph to avoid
        # visiting it again
        visited.add(node)

        # Recursively visit all the adjacent nodes
        for neighbour in graph[node]:

            # If the neighbour node is not visited, visit it recursively
            if neighbour not in visited:
                self.dfs(graph, neighbour, visited, result)

        # Push the current node to the result after all its neighbours
        # have been visited
        result.append(node)

    def topological_sort(self, graph: List[List[int]]) -> List[int]:

        # Number of nodes in the graph
        N = len(graph)

        # If the graph is empty, return an empty vector
        if N == 0:
            return []

        # Set to keep track of visited nodes
        visited: Set[int] = set()

        # Keep track of the topological sort ordering
        result: List[int] = []

        # Perform DFS on each unvisited node
        for node in range(N):
            if node not in visited:

                # If a node is not visited, start DFS on it to visit all
                # the nodes connected to it.
                self.dfs(graph, node, visited, result)

        # Reverse the result to get the topological sort in correct
        # order
        result.reverse()
        return result
```

## Complexity Analysis

The runtime complexity of the algorithm is really easy to understand. We run multiple depth-first searches to get the topological order of the graph, where each execution only covers a section of the graph. And so, the runtime complexity of the algorithm is the same as that of depth-first traversal of the graph, which is **O(N+E)** in any case.

We create an array to hold the topological order of the graph and a visited set to track the visited nodes, both of which hold **N** nodes, resulting in a space complexity of **O(N)**.

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

# Topological sort

## Problem Statement

Given a **directed acyclic** **graph** represented as an adjacency list, write a function to find and return the topological sort of this graph.

The graph is given as follows: `graph[i]` is a list of all nodes you can visit from the node `i` (i.e., there is a directed edge from the node `i` to node `graph[i][j]`).

Topological sort is a linear ordering of the vertices in a Directed Acyclic Graph (DAG). For every directed edge from node `u` to node `v`, node `u` appears before node `v` in the ordering. If the graph contains cycles, topological sort is not possible.

### Example 1

> -   **Input:** graph = \[\[1\], \[\], \[3\], \[\], \[1\]\]
> -   **Output:** \[4, 2, 3, 0, 1\]
> -   **Explanation:** Above is the topological sort of the graph.

### Example 2

> -   **Input:** graph = \[\[\], \[4\], \[0, 1, 3\], \[\], \[\]\]
> -   **Output:** \[2, 3, 1, 4, 0\]
> -   **Explanation:** Above is the topological sort of the graph.

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

        // Recursively visit all the adjacent nodes
        for (int neighbour : graph[node]) {

            // If the neighbour node is not visited, visit it recursively
            if (visited.find(neighbour) == visited.end()) {
                dfs(graph, neighbour, visited, result);
            }
        }

        // Push the current node to the result after all its neighbours
        // have been visited
        result.push_back(node);
    }

    vector<int> topologicalSort(vector<vector<int>> &graph) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return an empty vector
        if (N == 0) {
            return {};
        }

        // Set to keep track of visited nodes
        unordered_set<int> visited;

        // Keep track of the topological sort ordering
        vector<int> result;

        // Perform DFS on each unvisited node
        for (int node = 0; node < graph.size(); node++) {
            if (visited.find(node) == visited.end()) {

                // If a node is not visited, start DFS on it to visit all
                // the nodes connected to it.
                dfs(graph, node, visited, result);
            }
        }

        // Reverse the result to get the topological order
        reverse(result.begin(), result.end());
        return result;
    }
};
```

***

# Topological sort II

## Problem Statement

Given a **directed** **graph** represented as an adjacency list, write a function to find and return the topological sort of this graph. If a topological sort is not possible, return an empty array.

The graph is given as follows: `graph[i]` is a list of all nodes you can visit from the node `i` (i.e., there is a directed edge from the node `i` to node `graph[i][j]`).

Topological sort is a linear ordering of the vertices in a Directed Acyclic Graph (DAG). For every directed edge from node `u` to node `v`, node `u` appears before node `v` in the ordering. If the graph contains cycles, topological sort is not possible.

### Example 1

> -   **Input:** graph = \[\[1\], \[\], \[3\], \[\], \[1\]\]
> -   **Output:** \[4, 2, 3, 0, 1\]
> -   **Explanation:** Above is the topological sort of the graph.

### Example 2

> -   **Input:** graph = \[\[1\], \[2\], \[0, 3\], \[\], \[1\]\]
> -   **Output:** \[\]
> -   **Explanation:** A topological sort of the above graph is not possible because it contains a cycle.

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
        unordered_set<int> &nodesInPath,
        vector<int> &result
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
                if (hasCycle(
                        graph, neighbour, visited, nodesInPath, result
                    )) {
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

        // Push the current node to the result after all its neighbours
        // have been visited
        result.push_back(node);

        // No cycle detected
        return false;
    }

    vector<int> topologicalSortII(vector<vector<int>> &graph) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return an empty vector
        if (N == 0) {
            return {};
        }

        // Set to keep track of visited nodes
        unordered_set<int> visited;

        // Set to keep track of nodes in the current path
        unordered_set<int> nodesInPath;

        // Keep track of the topological sort ordering
        vector<int> result;

        // Perform DFS on each unvisited node
        for (int node = 0; node < graph.size(); node++) {
            if (visited.find(node) == visited.end()) {

                // If a cycle is detected, topological sort is not
                // possible
                if (hasCycle(
                        graph, node, visited, nodesInPath, result
                    )) {
                    return {};
                }
            }
        }

        // Reverse the result to get the topological order
        reverse(result.begin(), result.end());
        return result;
    }
};
```
