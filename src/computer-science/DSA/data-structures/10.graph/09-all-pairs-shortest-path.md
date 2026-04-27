# All pairs shortest path

## Table of Contents

1. [Understanding all-pair shortest path problem](#understanding-all-pair-shortest-path-problem)
2. [Understanding Floyd-Warshall algorithm](#understanding-the-floyd-warshall-algorithm)
3. [Implement Floyd-Warshall algorithm](#implement-floyd-warshall-algorithm)

***

# Understanding all-pair shortest path problem

The all-pair shortest path problem is the natural extension of the single source shortest path problem and is also a very common problem that can be modeled as a graph. To understand the problem better, let's look at an example of how we face it and how we require an efficient solution.

## Logistics Services

Consider a large e-commerce company with multiple warehouses storing the goods it sells. Delivering goods from a warehouse depletes its inventory, and the company has to ensure items are restocked. The inventory is often rebalanced by moving items from one warehouse to another. However, to save logistics costs, the company would want to move items from the nearest warehouse with excess stock.This problem can be modeled as a graph in which each node represents a warehouse and an edge represents the transportation link between them, where the weight of the edges is the transport cost.

// Diagram: A graph representing the warehouses and transport costs between them.

Since it is unknown which inventory will go out of stock or which will have excess stock, we need to know the shortest path between all pairs of inventories. The problem then boils down to finding the shortest path between all pairs of nodes in the graph.

## Social Network Analysis

Users on a social media network can have other users as friends, family, or acquaintances on the network. Social media companies often offer suggestions and recommendations for adding new friends to make it easy for people to discover real-life connections.

This problem can be modeled as a graph where nodes represent users connected via an edge if those users are on the network. The weight of the edge can denote the strength of their relationships based on real-life connections like friends, family, colleagues, or acquaintances. The shortest path between any two nodes can be used as a parameter to suggest new connections to users.

// Diagram: A graph representing connected users on a social media network.

## Shortest path with Dijkastra's algorithm

We can use Dijkastra's algorithm to find the shortest path from a single source node to all the other nodes in the graph. Running the algorithm for each node as the source will give us the shortest path between all pairs of nodes. Since we run Dijkastra's algorithm **N** times where **N** is the number of nodes and **E** is the number of edges in the graph, the time complexity would be **O (N\*E\*logN)**. In the worst case, if the graph is a complete graph, the number of edges E ~ N^2 and and so time complexity will be O(N^3 \* logN).

// Diagram: Running Dijkastra's algorithm for each node as the source can solve the all-pair shortest path problem.

While this is one effective way to solve the all-pair shortest path problem, it would not work for graphs with negative weight edges.

## Shortest path with Bellman-Ford algorithm

We can use the Bellman-Ford algorithm to find the shortest path from a source node to all the other nodes in a graph with negative edge weights. Running the algorithm for each node as the source will give us the shortest path between all pairs of nodes. Since we run the Bellman-Ford algorithm **N** times where **N** is the number of nodes and **E** is the number of edges in the graph, the time complexity would be **O (N\*N\*E)**.

// Diagram: Running the Bellman-Ford algorithm for each node as the source can solve the all-pair shortest path problem.

Running the Bellman-Ford algorithm multiple times may seem an effective solution, but in the worst case (complete graphs), a graph can have N\*(N-1), where N is the number of nodes. This results in the worst-case time complexity of **O (N\*N\*N\*N) = O(N^4)**.

Consider a large, complete graph representing points of interest in a country. It may have hundreds of thousands of nodes, and the solution above would not perform very well. We need a faster and more efficient algorithm to solve the all-pair shortest path problem for large-scale graphs.

***

# Understanding the Floyd-Warshall algorithm

The Floyd-Warshall algorithm efficiently solves the all-pairs shortest path problem for directed and undirected graphs. It can work with negative edges, but cannot detect negative weight cycles like Bellman-Ford. As we will see later, it is much more efficient than running Bellman-Ford for each node and has a much simpler implementation than Dijkstra's algorithm. And so, it is the preferred algorithm for solving the all-pair shortest path problem in most graphs.

## Algorithm

The idea behind the Floyd-Warshall algorithm is quite simple. Consider two nodes, `s`, and `t`, in the graph representing the source and destination nodes, respectively. The shortest path between these nodes can have 0 more intermediate nodes. For each such pair of nodes in the graph, the Floyd-Warshall algorithm iterates over all the nodes in the graph and for each node, checks if it exists as an intermediate node in the shortest path between the pair. 

// Diagram: The shortest path between the source and target node may have 0 or more intermediate nodes.

We create a two-dimensional distance map where `distance[s][t]` stores the **current** shortest path between the nodes `s` and `t`. We initialize the map with 0 for the same pair of nodes (where `s` and `t` are the same), the weight of the edge if an edge connects the pair and `infinite` for all the other pairs. This is our base case, where the `distance` map stores the shortest distance between all pairs of nodes if there are 0 intermediate nodes.

Now, we iterate over the list of nodes in the graph, where in the `ith` iteration we consider all nodes from 0 to `i` as intermediate nodes for all pairs of nodes in the graph. In each iteration, we check for every pair of nodes `s` and `t`, if adding the node `i` as an intermediary node reduces the **currently** known shortest distance between them. We do this by checking if `distance[s][i] + distance[i][t] < distance[s][t]`. If the distance is reduced, we update the `distance` map for the node pair `s` and `t`  to the smaller value, signifying that the **currently** known shortest path has the node `i` in it; otherwise, we move to the next pair.

Once we have checked this for all the pairs in the graph, we can move to the next node, `i+1`, and repeat the same process. Once we finish checking all the nodes, it is guaranteed that the `distance` map will have the shortest path between all pairs of nodes in the graph. We will learn the proof of correctness for this later in the course.

> **Algorithm**
>
> -   **Step 1**: Create a 2D `distance` map and initialize it with 0 for the same node pair, edge weights for node pairs with edges between them, and `infinite` for all other node pairs.
> -   **Step 2**: Iterate over all the nodes using the variable `i` representing the intermediate node:
>     -   **Step 2.1**: Iterate over all the nodes using the variable `s` representing the source node:
>         -   **Step 2.1.1**: Iterate over all the nodes using the variable `t` representing the target node
>             -   **Step 2.1.1.1**: if `distance\[s\]\[i\] + distance\[i\]\[t\]` < `distance\[s\]\[t\]` update `distance\[s\]\[t\]` with this new minimum value
> -   **Step 3**: The `distance` map now has the shortest distance between all the pairs of nodes

Let's examine a graph with a negative weight and see how the Floyd-Warshall algorithm finds the shortest distance between all pairs of nodes in the graph.

Floyd Warshall's algorithm to find all-pairs shortest path.

## Implemntation

Consider that we have a graph of size **N**, where the nodes are enumerated from **0** to **N-1**, and we are given the adjacency list `adj` of the graph as a two-dimensional list of pairs where the first value of the pair is the enumeration of the neighbouring node, and the second value is the weight of the edge. Since nodes can be identified by their enumeration, which runs from **0** to **N-1** instead of creating a `distance` map, we can create a `distance` array and use the node enumerations as indices to store and retrieve values from it.

Implementing the Floyd-Warshall algorithm is simple, as it only involves three nested iterations. We create a 2D `distance` array and initialize it to 0 for the same node pairs, edge weights for nodes that have edges between them, and infinite for all other nodes. We then iterate over all nodes in the graph in a loop that selects the intermediate node to check. We create a nested loop inside the outer loop to compute all possible pairs in the graph and check if the intermediate node can be added to that pair.

C++

```cpp
using namespace std;

class Solution {
public:
    vector<vector<int>> floydWarshallAlgorithm(
        vector<vector<pair<int, int>>> &graph
    ) {

        // Build adjacency distance from adjacency list
        int N = graph.size();
        vector<vector<int>> distance(N, vector<int>(N, -1));

        // Initialize distance with weights from graph
        for (int node = 0; node < N; node++) {

            // distance to self is zero
            distance[node][node] = 0;

            // Iterate through all edges from the node and set the
            // distance to the destination node as the weight of the edge
            for (auto &[neighbour, weight] : graph[node]) {
                distance[node][neighbour] = weight;
            }

        // Iterate over all the nodes as intermediate nodes
        for (int k = 0; k < N; k++) {

            // Iterate over all the nodes as source nodes
            for (int i = 0; i < N; i++) {

                // Iterate over all the nodes as destination nodes
                for (int j = 0; j < N; j++) {

                    // If k is an intermediate node that exisits between
                    // i and j
                    if (distance[i][k] != -1 && distance[k][j] != -1) {

                        // Check if this intermediate node provides a
                        // shorter path between i and j
                        if (distance[i][j] == -1 ||
                            distance[i][j] >
                                distance[i][k] + distance[k][j]) {

                            // Update the shortest path between i and j
                            distance[i][j] =
                                distance[i][k] + distance[k][j];
                        }

        return distance;
    }
};
```

Java

```java
using namespace std;

class Solution {
public:
    vector<vector<int>> floydWarshallAlgorithm(
        vector<vector<pair<int, int>>> &graph
    ) {

        // Build adjacency distance from adjacency list
        int N = graph.size();
        vector<vector<int>> distance(N, vector<int>(N, -1));

        // Initialize distance with weights from graph
        for (int node = 0; node < N; node++) {

            // distance to self is zero
            distance[node][node] = 0;

            // Iterate through all edges from the node and set the
            // distance to the destination node as the weight of the edge
            for (auto &[neighbour, weight] : graph[node]) {
                distance[node][neighbour] = weight;
            }
```

Typescript

```typescript
export class Solution {
    floydWarshallAlgorithm(graph: number[][][]): number[][] {

        // Build adjacency distance from adjacency list
        // Number of nodes in the graph
        const N = graph.length;
        const distance: number[][] = Array.from({ length: N }, () =>
            Array(N).fill(-1)
        );

        // Initialize distance with weights from graph
        for (let node = 0; node < N; node++) {

            // distance to self is zero
            distance[node][node] = 0;

            // Iterate through all edges from the node and set the
            // distance to the destination node as the weight of the edge
            for (const [neighbour, weight] of graph[node]) {
                distance[node][neighbour] = weight;
            }

        // Iterate over all the nodes as intermediate nodes
        for (let k = 0; k < N; k++) {

            // Iterate over all the nodes as source nodes
            for (let i = 0; i < N; i++) {

                // Iterate over all the nodes as neighbour nodes
                for (let j = 0; j < N; j++) {

                    // If k is an intermediate node that exisits between
                    // i and j
                    if (distance[i][k] !== -1 && distance[k][j] !== -1) {

                        // Check if this intermediate node provides a
                        // shorter path between i and j
                        if (
                            distance[i][j] === -1 ||
                            distance[i][j] >
                                distance[i][k] + distance[k][j]
                        ) {

                            // Update the shortest path between i and j
                            distance[i][j] =
                                distance[i][k] + distance[k][j];
                        }

        return distance;
    }
```

Javascript

```javascript
export class Solution {
    floydWarshallAlgorithm(graph) {

        // Build adjacency distance from adjacency list
        // Number of nodes in the graph
        const N = graph.length;
        const distance = Array.from({ length: N }, () =>
            Array(N).fill(-1)
        );

        // Initialize distance with weights from graph
        for (let node = 0; node < N; node++) {

            // distance to self is zero
            distance[node][node] = 0;

            // Iterate through all edges from the node and set the
            // distance to the destination node as the weight of the edge
            for (const [neighbour, weight] of graph[node]) {
                distance[node][neighbour] = weight;
            }

        // Iterate over all the nodes as intermediate nodes
        for (let k = 0; k < N; k++) {

            // Iterate over all the nodes as source nodes
            for (let i = 0; i < N; i++) {

                // Iterate over all the nodes as neighbour nodes
                for (let j = 0; j < N; j++) {

                    // If k is an intermediate node that exisits between
                    // i and j
                    if (distance[i][k] !== -1 && distance[k][j] !== -1) {

                        // Check if this intermediate node provides a
                        // shorter path between i and j
                        if (
                            distance[i][j] === -1 ||
                            distance[i][j] >
                                distance[i][k] + distance[k][j]
                        ) {

                            // Update the shortest path between i and j
                            distance[i][j] =
                                distance[i][k] + distance[k][j];
                        }

        return distance;
    }
```

Python

```python
from typing import List, Tuple

class Solution:
    def floyd_warshall_algorithm(
        self, graph: List[List[Tuple[int, int]]]
    ) -> List[List[int]]:

        # Build adjacency distance from adjacency list
        n: int = len(graph)
        distance: List[List[int]] = [[-1] * n for _ in range(n)]

        # Initialize distance with weights from graph
        for node in range(n):

            # distance to self is zero
            distance[node][node] = 0

            # Iterate through all edges from node i and set the distance
            # to the neighbour node as the weight of the edge
            for neighbour, weight in graph[node]:
                distance[node][neighbour] = weight

        # Iterate over all the nodes as intermediate nodes
        for k in range(n):

            # Iterate over all the nodes as source nodes
            for i in range(n):

                # Iterate over all the nodes as neighbour nodes
                for j in range(n):

                    # If k is an intermediate node that exisits between
                    # i and j
                    if distance[i][k] != -1 and distance[k][j] != -1:

                        # Check if this intermediate node provides a
                        # shorter path between i and j
                        if (
                            distance[i][j] == -1
                            or distance[i][j]
                            > distance[i][k] + distance[k][j]
                        ):

                            # Update the shortest path between i and j
                            distance[i][j] = (
                                distance[i][k] + distance[k][j]
                            )

        return distance
```

## Proof of correctness

Like the Bellman-Ford algorithm, the Floyd-Warshall algorithm also uses dynamic programming to compute the shortest path between all pairs of nodes in the graph. Before we dive deeper to prove the correctness of the algorithm, there is an important observation to note. Consider a generic graph and two nodes `s` and `t` where `x1`, `x2`, `x3` .. `xn` are intermediate nodes in the shortest path between them.

The shortest path between `s` and `t` is the sum of the shortest paths between the intermediate nodes `s` and `x1`, `x1` and `x2` so on till `xn` and `t`. This can be proven by contradiction as any path between `s` and `t` that has `x1`, `x2` ..... `xn` as intermediate nodes cannot be greater than the sum of the shortest path between intermediate nodes. And so, if the shortest path between `s` to `t` is shorter than the sum; it cannot have all `x1`, `x2` .... `xn` as intermediate nodes, which contradicts our assumption. This proves that the shortest path between any two nodes is the sum of the shortest paths between intermediate nodes in that path.

// Diagram: The shortest distance between two nodes is the sum of the shortest distance distance between intermediate nodes in the shortest path.

We have proved that the shortest path between two nodes in a graph equals the sum of the shortest paths between the intermediate nodes in that path.

Consider now we have a graph and the function `d(s,t,k)` that gives us the shortest path between nodes `s` and `t` where only the nodes `0, 1, .. k` are allowed as intermediary nodes. We can compute the value of this function using the results from a smaller subproblem using the recursive equation below. We can check if going through the node `k` reduces the currently known shortest between nodes `s` and `t`.

// Diagram: The recursive relation for the Floyd-Warhsall algorithm.

If the graph has **N** nodes, the value of `d(s,t,N-1)` is the shortest path between the nodes `s` and `t` in the graph. The Floyd-Warshall algorithm executes the above recursive equation iteratively by starting from the base case and building the 2D `distance` map from bottom to top. The `ith` iteration in the outermost loop of the Floyd-Warshall algorithm computes the values of `d(*, *, i)` for all pairs of nodes in the graph. Since we only need results from the `i-1`th iteration to calculate the values of the `ith` iteration, we create a 2D `distance` map to store the results for all pairs of nodes. The values from the previous iteration are used to compute the results for the current iteration and then overwritten in the same place to be used by the next iteration.

Since the Floyd-Warshal algorithm iterates **N** times (0 to N-1), the `distance` map contains the shortest path between all pairs in the graph.

## Complexity Analysis

The Floyd-Warshall algorithm's runtime complexity is quite easy to understand. We use three nested loops, each iterating **N** times, where N is the number of nodes in the graph. We only do constant-time **O(1)** operations in each iteration to check if the distance value can be updated. Thus, the runtime complexity is **O(N^3****)** in any case.

Since we create a 2D map of size **NxN** to store the shortest distance value between each pair, the extra space needed in any case is **O(N^2)**.

> **Best Case**
>
> -   Space Complexity - **O(N^2)**
> -   Time Complexity - **O(N^3)**
>
> **Worst Case**
>
> -   Space Complexity - **O(N^2)**
> -   Time Complexity - **O(N^3)**

***

# Implement Floyd-Warshall algorithm

***

# Flyod warshall’s algorithm

## Problem Statement

Given a **weighted directed graph** represented as an adjacency list, write a function that returns a 2D matrix `distance` such that `distance[i][j]` represents the shortest path between nodes `i` and `j`.

The graph is given as follows: `graph[i]` is a list of pairs `[neighbour, weight]`, where each pair indicates a directed edge from node `i` to the node neighbour with the specified weight.

> You must abide by the following constraints:
>
> -   If a node `i` is not reachable from the node `j`, mark `distance\[i\]\[j\]` as `-1`.
> -   You can assume that the graph has no edges with negative weight.

### Example 1

> -   **Input:** graph = \[\[\[1, 2\], \[3, 5\]\], \[\[4, 6\]\], \[\[4, 1\]\], \[\[2, 2\]\], \[\[3, 7\]\]\]
> -   **Output:** \[\[0, 2, 7, 5, 8\], \[-1, 0, 15, 13, 6\], \[-1, -1, 0, 8, 1\], \[-1, -1, 2, 0, 3\], \[-1, -1, 9, 7, 0\]\]
> -   **Explanation:** Above is the shortest path between all nodes in the graph.

### Example 2

> -   **Input:** graph = \[\[\[4, 2\]\], \[\[3, 3\], \[0, 4\]\], \[\[4, 4\], \[0, 1\]\], \[\[2, 1\], \[4, 2\]\], \[\[1, 5\]\]\]
> -   **Output:** \[\[0, 7, 11, 10, 2\], \[4, 0, 4, 3, 5\], \[1, 8, 0, 11, 3\], \[2, 7, 1, 0, 2\], \[9, 5, 9, 8, 0\]\]
> -   **Explanation:** Above is the shortest path between all nodes in the graph.

## Solution

```cpp
using namespace std;

class Solution {
public:
    vector<vector<int>> floydWarshallAlgorithm(
        vector<vector<pair<int, int>>> &graph
    ) {

        // Build adjacency distance from adjacency list
        int N = graph.size();
        vector<vector<int>> distance(N, vector<int>(N, -1));

        // Initialize distance with weights from graph
        for (int node = 0; node < N; node++) {

            // distance to self is zero
            distance[node][node] = 0;

            // Iterate through all edges from the node and set the
            // distance to the destination node as the weight of the edge
            for (auto &[neighbour, weight] : graph[node]) {
                distance[node][neighbour] = weight;
            }
        }

        // Iterate over all the nodes as intermediate nodes
        for (int k = 0; k < N; k++) {

            // Iterate over all the nodes as source nodes
            for (int i = 0; i < N; i++) {

                // Iterate over all the nodes as destination nodes
                for (int j = 0; j < N; j++) {

                    // If k is an intermediate node that exisits between
                    // i and j
                    if (distance[i][k] != -1 && distance[k][j] != -1) {

                        // Check if this intermediate node provides a
                        // shorter path between i and j
                        if (distance[i][j] == -1 ||
                            distance[i][j] >
                                distance[i][k] + distance[k][j]) {

                            // Update the shortest path between i and j
                            distance[i][j] =
                                distance[i][k] + distance[k][j];
                        }
                    }
                }
            }
        }

        return distance;
    }
};
```
