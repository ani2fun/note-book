# Single source shortest path

## Table of Contents

1. [Understanding single source shortest path problem](#understanding-single-source-shortest-path-problem)
2. [Understanding Dijkstra's algorithm](#understanding-dijkstras-algorithm)
3. [Implementing Dijkstra's algorithm](#implementing-dijkstras-algorithm)
4. [Implement Dijkstra’s algorithm](#implement-dijkstras-algorithm)
5. [Understanding negative weight edges](#understanding-negative-weight-edges)
6. [Understanding the Bellman-Ford algorithm](#understanding-the-bellman-ford-algorithm)
7. [Implement Bellman-Ford algorithm](#implement-bellman-ford-algorithm)

***

# Understanding single source shortest path problem

The single source shortest path problem is the most common problem that can be modeled as a graph. To understand the problem better, let's look at an example of how we face it and why we require an efficient solution.

## Emergency Services

Consider a fire breaking out in a house, and the residents called the emergency services. The emergency services would need to quickly locate the closest fire station that is not busy with something else. For this, they need to know the shortest distance from the house under fire to **all** the stations. This is because the closest one may be busy, so they would have to fall back to the second closest one, which may also be busy. And so, they would need the shortest distance to all the fire stations so that they can call the one that is closest and not busy.

This problem can be modeled as a graph, with the source node representing the house and all the fire stations representing other nodes. Its solution involves finding the shortest path from the source node to all the other nodes in the graph.

// Diagram: A graph representing a house and the distance to all fire stations.

Consider navigation and map applications that provide a route from your current location to any destination you want to visit. For example, if you search for restaurants, you get the shortest path to all the nearby restaurants. The application needs to know not just the closest restaurant but all the second closest and others to present you with other options if you don't like one.

This problem can be modeled as a graph in which your location is the source node, and all the other nodes are points of interest connected by weighted edges representing the distance between two nodes. The solution involves finding the shortest path from the source node to all the other nodes in the graph.

// Diagram: A graph representing your location and the distance to all points of interest.

Note that distance does not have to be geographical. When a problem is modeled as a graph, the nodes and edges are abstract concepts that denote data and its relationships. Different problems can have different meanings of distance.

## Shortest path with breadth first search

Let's consider a simplified case of emergency services example where the distance between all nodes is the same. This would result in the following graph.

// Diagram: A graph with all edges having equal weight

For a graph like the one above, where all the edges have the same weight, a node at depth from the source will be at a greater distance, and it is easy to see how the breadth-first search from the source node can give the shortest path to all other nodes.

The breadth-first search visits the nodes in the order of their depth from the source. This is because, in BFS, we add all neighbors at depth `D` to the queue before adding neighbors at depth `D+1`, and the FIFO order of the queue guarantees that the front of the queue always has the smallest depth of any unvisited node.

We can start the breadth-first search from the source node and keep track of the depth as we traverse. The first time we visit a node, we are guaranteed to arrive at it through the shortest path, so we assign it a distance equal to the current depth. Since we keep track of visited nodes, we will not update the distance if we arrive at it at subsequent times.

// Diagram: Breadth first search from source finds the shortest path in unweighted graphs

Now, let's consider a real-world scenario in which the graph edges have different weights, with the weight of an edge representing the distance between two nodes. For such graphs, nodes at greater depths can have a smaller distance (sum of weights) from the source. Consider the given example below.

// Diagram: Nodes at greater depth from the source can have a smaller distance from it.

The graph above is a very simplified representation of the situation. The road networks can be much more complicated, and the area considered may also span cities.

To efficiently solve the single-source shortest path problem from graphs with different edge weights, we need a special algorithm that visits nodes in the order of distance instead of their depth.

***

# Understanding Dijkstra's algorithm

Dijkstra's algorithm is a single-source shortest path finding algorithm that can solve this problem for graphs with **non-negative** edge weights. It is a generalized form of breadth-first search, using the same idea but generalizing the order of visiting nodes. The breadth-first search algorithm determines the order of nodes to visit based on their **depth** from the source node, whereas Dijkstra's algorithm does the same based on the **distance** from the source node.

The depth of a node is the minimum number of edges between itself and the source, whereas the distance is the minimum sum of edge weights between itself and the source. For an unweighted graph or a graph where all edge weights are the same, depth and distance mean the same thing and as we will see later, Dijkstra's algorithm will visit them in the same order as the breadth-first search 

// Diagram: Definition of distance for unweighted and weighted graphs

## Algorithm

To generalise the BFS algorithm into Dijkstra's algorithm, we use a **sorted set**, which is a binary search tree-based data structure, instead of a regular queue to always maintain a sorted list of nodes to visit. Instead of just the nodes, we add a pair consisting of the node and its currently known minimum distance from the source to the set, allowing us to access the pair with the minimum distance value easily.

To keep track of the shortest distance, we create a `distance` map and initialize it with 0 for the source node and `infinite` for all other nodes.

// Diagram: We create a distance map to store the currently known shortest distance of all nodes from the source node.

We then create a sorted set `set` of distance, node pairs, and add all the distance node pairs from the `distance` map to the `set`. The set is first sorted by the first item in the pair, which is the currently known distance from the source node, and then by the node identifier itself. Since the `set` is sorted this way, the node with the shortest distance from the source is always at the beginning of the `set`.

// Diagram: We use a sorted set instead of a regular queue and add a pair to it.

We then iterate until the `set` is empty and, in each iteration, extract the distance node pair from the beginning of the `set`. The distance value for the extracted node `node` is its shortest distance from the source node, as we will see shortly in the proof of correctness.

We then iterate over all the neighbours of the extracted node `node` in a variable `neighbour` and calculate their distance from the source via `node` as `distance[node] + weight(node, neighbour)`. If the newly calculated distance for `neighbour` is smaller than the stored value in the `distance` map, we update the `distance` map and `set`.

Since `set` is always sorted, the distance node pair with the smallest distance makes its way to the beginning of the `set` after the update.

// Diagram: We calculate the distance of all neighbours of the extracted node on a path going through it.

We repeat these steps until `set` is empty. Since we obtain the shortest distance of a node in each iteration, by the end of all iterations, we will have the shortest distance for all nodes in the `distance` map.

> **Algorithm**
>
> -   Step 1: Create a map \`distance\` and initialize it with \`infinite\` for every node and 0 for the source node.
> -   Step 2: Create a sorted set \`set\` to hold a pair of (distance, node) and add all the (distance, node) pairs from the \`distance\` map to it.
> -   Step 3: Iterate until the \`set\` is empty and do the following:
>     -   Step 3.1: Get the (distance, node) pair with the smallest distance from the front of the \`set\`. The distance value of this \`node\` is its shortest distance from the source.
>     -   Step 3.2: For all neighbours of this node, calculate their distance via the extracted node as \`distance\[node\]\` + \`edge weight\` to the neighbour. If this value is less than \`distance\[neighbour\]\`, then update the \`distance\` map and corresponding (distance, node) pair in \`set\` with the new value.

Let's examine a weighted graph example to see how Dijkstra's algorithm finds the shortest distance from a given source to all nodes in the graph.

Dijkstra's algorithm to find the shortest path from the source node 0.

We can see how BFS can now be considered a particular case of Dijkstra's algorithm, where all edges' weights are the same. In that case, a node's distance from the source becomes the same as its depth, and Dijkstra's algorithm follows the BFS order.

## Implemntation

In this course, we will not learn how to implement the original form of Dijkstra's algorithm.

Although Dijkstra's algorithm is relatively straightforward, its implementation in its original form requires in-place updates in a sorted set to update distance values. The standard libraries in most programming languages do not provide this functionality in their implementations, so we need to use a binary search tree-based data structure to search, delete, and then insert to perform an update. This is not the most efficient way to implement Dijkstra's algorithm.

Later in the course, we will learn a slightly modified form of Dijkstra's algorithm and its implementation, which is used in most places instead of the original algorithm, as it has a more efficient implementation.

## Proof of correctness

We can prove Dijkstra's algorithm by induction. Consider the actual shortest path for any node `n` is `d[n]` and its distance value when extracted from the set is `distance[n]`.

// Diagram: Induction hypothesis

Every time we extract a node from the set, its distance value is the shortest distance from the source. Conversely, a node with a shorter distance from the source is extracted earlier.

Let's assume the induction hypothesis is true for `i` iterations of the while loop, and we extract the node `u` in the `i+1` iteration.  Now, consider that the shortest path `d[u]` from the source node to the node `u`  has some intermediate node `x` connected to `u` with a non-negative weight `w`. We can calculate the shortest distance for the node `u` as `d[u] = d[x] + w`. And since `d[x] < d[u]`, according to our induction hypothesis, we must have extracted node `x` from the queue earlier and updated the `distance[u]` for its neighbour `u` to `d[u]`. The node `x` will be extracted before the node `u` even if `w` is 0 as Dijkstra's algorithm moves outwards from the source and would reach the node `u` only via node `x`.

// Diagram: The shortest path for node u has node x and weight w.

This proves that if Dijkstra's algorithm holds true for `i` iterations, it also holds true for the `i+1` iteration. And since we know it is valid for the first iteration (the source node itself), it is proved by induction that it is valid for all successive iterations.

## Complexity Analysis

Consider a graph with **N** nodes and **E** edges, where the average number of edges per node is **e**. In the original algorithm, we perform three major operations.

> -   Add all the nodes to a sorted set.
> -   In each iteration of the outer while loop, we extract the minimum distance pair from the sorted set.
> -   For each extracted node, we iterate over all its neighbours and potentially modify the distance value of neighbours in the sorted set.

We can calculate the runtime complexity by adding the contributions of these individual steps. In any case, we insert and extract minimum exactly **N** times, and since both these operations are **O(log(N))**, their total contribution is **O(N\*log(N))**.

In the worst case, the newly calculated distance value may be smaller than the previous value every time. So, in each iteration of the outer while loop, we update distances in the sorted set **e** times. Since the outer while loop has exactly **N** iterations, this results in  **N\*e = E** updates in the set. Since each in-place update in the set is **O(log(N))**, the total contribution from updates is **O(E\*log(N))**. And so, the worst-case time complexity is **O ((N + E)\*log(N))**.

In the best case, the first distance we calculate for a node may be its shortest distance, so we only update the set once for each node, which results in a total of **N** updates leading to **O(N\*log(N))** time. And so, the best case time complexity is **O(N\*log(N) + N\*log(N)) = O (N\*log(N))**.

We create a distance map and a sorted set, the size of which is **N** in any case, and so the space complexity in any case is **O(N)**.

> **Best Case:** Shortest distance for each node found in the first attempt
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N\*log(N))**
>
> **Worst Case:** Shortest distance for each node found in the last
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O((N+E)\*log(N))**

***

# Implementing Dijkstra's algorithm

The implementation of the original form of Dijkstra's algorithm is quite complicated and not very efficient. This is because it relies on updating values in place in a sorted set, which requires searching, deleting and then reinserting the value. A more efficient implementation of Dijkstra's algorithm uses a priority queue and adds the distance node pairs to it during the graph exploration. 

In this lesson, we will learn a slightly modified version of Dijkstra's algorithm, which is easier to implement and is the most widely used version.

The modified algorithm is synonymous with the original algorithm and is used in all places where Dijkstra's algorithm is used.

## Algorithm

We start by creating a `distance` map to keep track of the shortest distance for every node from the source node, and initialize it with 0 for the source node and`infinite`for all other nodes.

// Diagram: We create a distance map to store the currently known shortest distance of all nodes from the source node.

We then create a minimum priority queue `queue` to hold distance, node pairs, and add only the distance node pair for the source node. A pair is compared against another pair by comparing its first value. If the first value for both pairs is the same, the second value is compared to decide the ordering. The minimum priority queue `queue` keeps the pair with the smallest distance value at the top.

// Diagram: We use a minimum priority queue instead of a sorted set and only add the distance node pair for the soruce node.

We then iterate until the `queue`is empty and, in each iteration, extract the (distance, node) pair from the top of the minimum priority queue `queue`. The distance value for the extracted node`node` is its shortest distance from the source node, as we will see shortly in the proof of correctness. We then iterate over all the neighbours of the extracted node`node` in a variable`neighbour`and calculate their distance from the source via`node`as`distanceToNeighbour = distance[node] + weight(node, neighbour)`. If `distanceToNeighbour` is smaller than the distance value for the neighbour node stored in the`distance`map, we update the `distance`map and add a pair `(distanceToNeighbour, neighbour)` to the priority queue.

Since the minimum priority queue `queue` always keeps the smallest pair at the top, the (distance, node) pair with the smallest distance will always be at the top of the `queue`. We repeat these steps until `queue` is empty. Since we obtain the shortest distance of a node in each iteration, by the end of all iterations, we will have the shortest distance for all nodes in the`distance`map.

> **Algorithm**
>
> -   Step 1: Create a map \`distance\` and initialize it with \`inf\` for every node and 0 for the source node.
> -   Step 2: Create a minimum priority queue \`queue\` to hold (distance, node) pairs and **olny** the (distance, node) pair for the source node to it.
> -   Step 3: Iterate until the queue is empty and do the following:
>     -   Step 3.1: Pop the (distance, node) pair from the top of the \`queue\` and initialize a variable \`node\` with its node value
>     -   Step 3.2: Iterate in all the neighbours of \`node\` in a variable \`neighbuor\` and do the following:
>         -   Step 3.2.1: \`distanceToNeighbour\` = \`distance\[node\]\` + edge weight from \`node\` to \`neighbour\`
>         -   Step 3.2.2: If \`distanceToNeighbour\` < \`distance\[neighbour\]\`, set \`distance\[neighbour\]\` to \`distanceToNeighbour\` and push the pair (\`distanceToNeighbour\`, \`neighbour\`) to the \`queue\`

Let's examine a weighted graph example to see how the modified Dijkstra's algorithm finds the shortest distance from a given source to all nodes in the graph.

Dijkstra's algorithm to find the shortest path from the source node 0.

## Proof of correctness

Note that in the original form of Dijkstra's algorithm, we only update the distance value of a node in the sorted set when the newly calculated distance for a neighbour is **smaller** than what is stored in the `distance` map. This means all our modifications in the sorted set always reduce the distance value of a pair.

// Diagram: In the original form of Dijkstra's algorithm, modifications in the sorted set always reduce the distance value.

We can create an equivalent logic using a minimum priority queue instead of a sorted set. Since every modification only reduces the distance value, instead of modifying pairs in place in a sorted set, adding a new (distance, node) pair to the minimum priority queue guarantees this new pair will be accessed before the old one. This way, the order in which the (distance, node) pair gets extracted and their distance values will still be the same as in the sorted set. The only side effect is that the queue will also have old (dead) pairs, which will be extracted at a later time in the iteration.

// Diagram: New distance node pairs are always extracted before the dead pairs.

However, since the first extracted (distance, node) pair from the queue is guaranteed to have the shortest distance from the source, subsequent dead pairs for the same node will not update the `distance` map as the distance in them will always be greater.

Since the modified version also visits the nodes in the same order as the original algorithm and calculates distances similarly, it is logically equivalent to the original algorithm. So, the same proof of correctness also applies to it.

## Implementation

Consider that we have a graph of size **N**, where the nodes are enumerated from **0** to **N-1**, and we are given the adjacency list `adj` of the graph as a two-dimensional list of pairs where the first value of the pair is the enumeration of the neighbouring node, and the second value is the weight of the edge. Since nodes can be identified by their enumeration, which runs from **0** to **N-1** instead of creating a `distance` map, we can create a `distance` array and use the node enumerations as indices to store and retrieve values from it. Given below is the implementation of the modified Dijkstra's algorithm that uses the library implementation of a minimum priority queue.

C++

```cpp
#include <climits>
#include <queue>

// Diagram: using namespace std;

class Solution {
public:
    vector<int> dijikstrasAlgorithm(
        vector<vector<pair<int, int>>> &graph,
        int source
    ) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return an empty vector
        if (N == 0) {
            return {};
        }

        // Create a vector to store the shortest distances from the
        // source vertex
        vector<int> distance(N, INT_MAX);

        // Create a priority queue (min-heap) to store the nodes with
        // their weights
        priority_queue<pair<int, int>, vector<pair<int, int>>> pq;

        // Set the distance of the source vertex to 0 and add it to the
        // min-heap
        distance[source] = 0;

        // Enqueue starting node to the queue
        pq.push({0, source});

// Diagram: while (!pq.empty()) {

            // Get the vertex with the smallest distance from the
            // min-heap
            int node = pq.top().second;
            pq.pop();

            // Visit all adjacent vertices of the current vertex
            for (auto &[neighbour, weight] : graph[node]) {

                // If a shorter path is found, update the distance and
                // add the neighbour to the min-heap
                if (distance[node] != INT_MAX &&
                    distance[node] + weight < distance[neighbour]) {

                    // Update the distance of the neighbour
                    distance[neighbour] = distance[node] + weight;

                    // Add the neighbour to the min-heap
                    pq.push({distance[neighbour], neighbour});
                }

        // Put -1 for all destinations that are not reachable by the
        // source node
        for (int i = 0; i < distance.size(); i++) {
            if (distance[i] == INT_MAX) {
                distance[i] = -1;
            }

        // Return the computed distances
        return distance;
    }
};
```

Java

```java
import java.util.*;

// Comparator class for the priority queue to create a min-heap
// based on weight
class CompareMinHeap implements Comparator<List<Integer>> {
    public int compare(List<Integer> a, List<Integer> b) {

        // Min-heap based on weight
        return Integer.compare(a.get(0), b.get(0));
    }

class Solution {
    public int[] dijikstrasAlgorithm(
        List<List<List<Integer>>> graph,
        int source
    ) {

        // Number of vertices in the graph
        int N = graph.size();

        // If the graph is empty, return an empty vector
        if (N == 0) {
            return new int[0];
        }

        // Create an array to store the shortest distances from the
        // source vertex
        int[] distance = new int[N];
        for (int i = 0; i < N; i++) {
            distance[i] = Integer.MAX_VALUE;
        }

        // Create a priority queue (min-heap) to store the nodes with
        // their weights
        PriorityQueue<List<Integer>> pq = new PriorityQueue<>(
            new CompareMinHeap()
        );

        // Set the distance of the source vertex to 0 and add it to the
        // min-heap
        distance[source] = 0;

        // Enqueue starting node to the queue
        pq.add(List.of(0, source));

// Diagram: while (!pq.isEmpty()) {

            // Get the vertex with the smallest distance from the
            // min-heap and remove it
            int node = pq.poll().get(1);

            // Visit all adjacent vertices of the current vertex
            for (List<Integer> edge : graph.get(node)) {
                int neighbour = edge.get(0);
                int weight = edge.get(1);

                // If a shorter path is found, update the distance and
                // add the neighbour to the min-heap
                if (
                    distance[node] != Integer.MAX_VALUE &&
                    distance[node] + weight < distance[neighbour]
                ) {

                    // Update the distance of the neighbour
                    distance[neighbour] = distance[node] + weight;

                    // Add the neighbour to the min-heap
                    pq.add(List.of(distance[neighbour], neighbour));
                }

        // Put -1 for all destinations that are not reachable by the
        // source node
        for (int i = 0; i < distance.length; i++) {
            if (distance[i] == Integer.MAX_VALUE) {
                distance[i] = -1;
            }

        return distance;
    }
```

Typescript

```typescript
import { PriorityQueue } from "datastructures-js";

function compareMinHeap(
    a: [number, number],
    b: [number, number]
): number {

    // In min heap, the smallest number should come first
    return a[0] - b[0];
}

export class Solution {
    dijikstrasAlgorithm(graph: number[][][], source: number): number[] {

        // Number of vertices in the graph
        // Number of nodes in the graph
        const N = graph.length;

        // If the graph is empty, return an empty vector
        if (N == 0) {
            return [];
        }

        // Create an array to store the shortest distances from the
        // source vertex
        const distance: number[] = Array(N).fill(
            Number.MAX_SAFE_INTEGER
        );

        // Create a priority queue (min-heap) using PriorityQueue from
        // the datastructure.js library
        const pq: PriorityQueue<[number, number]> = new PriorityQueue<
            [number, number]
        >(compareMinHeap);

        // Set the distance of the source vertex to 0 and add it to the
        // min-heap
        distance[source] = 0;

        // Enqueue starting node to the queue
        pq.enqueue([0, source]);

// Diagram: while (!pq.isEmpty()) {

            // Get the vertex with the smallest distance from the
            // min-heap and remove it
            const [dist, node] = pq.dequeue()!;

            // Visit all adjacent vertices of the current vertex
            for (const [neighbour, weight] of graph[node]) {

                // If a shorter path is found, update the distance and
                // add the neighbour to the min-heap
                if (
                    distance[node] !== Number.MAX_SAFE_INTEGER &&
                    distance[node] + weight < distance[neighbour]
                ) {

                    // Update the distance of the neighbour
                    distance[neighbour] = distance[node] + weight;

                    // Add the neighbour to the min-heap
                    pq.enqueue([distance[neighbour], neighbour]);
                }

        // Put -1 for all destinations that are not reachable by the
        // source node
        for (let i = 0; i < distance.length; i++) {
            if (distance[i] === Number.MAX_SAFE_INTEGER) {
                distance[i] = -1;
            }

        // Return the computed distances
        return distance;
    }
```

Javascript

```javascript
import { PriorityQueue } from "datastructures-js";

// Diagram: function compareMinHeap(a, b) {

    // In min heap, the smallest number should come first
    return a[0] - b[0];
}

export class Solution {
    dijikstrasAlgorithm(graph, source) {

        // Number of vertices in the graph
        // Number of nodes in the graph
        const N = graph.length;

        // If the graph is empty, return an empty vector
        if (N == 0) {
            return [];
        }

        // Create an array to store the shortest distances from the
        // source vertex
        const distance = Array(N).fill(Number.MAX_SAFE_INTEGER);

        // Create a priority queue (min-heap) using PriorityQueue from
        // the datastructures-js library
        const pq = new PriorityQueue(compareMinHeap);

        // Set the distance of the source vertex to 0 and add it to the
        // min-heap
        distance[source] = 0;

        // Enqueue starting node to the queue
        pq.enqueue([0, source]);

// Diagram: while (!pq.isEmpty()) {

            // Get the vertex with the smallest distance from the
            // min-heap and remove it
            const [dist, node] = pq.dequeue();

            // Visit all adjacent vertices of the current vertex
            for (const [neighbour, weight] of graph[node]) {

                // If a shorter path is found, update the distance and
                // add the neighbour to the min-heap
                if (
                    distance[node] !== Number.MAX_SAFE_INTEGER &&
                    distance[node] + weight < distance[neighbour]
                ) {

                    // Update the distance of the neighbour
                    distance[neighbour] = distance[node] + weight;

                    // Add the neighbour to the min-heap
                    pq.enqueue([distance[neighbour], neighbour]);
                }

        // Put -1 for all destinations that are not reachable by the
        // source node
        for (let i = 0; i < distance.length; i++) {
            if (distance[i] === Number.MAX_SAFE_INTEGER) {
                distance[i] = -1;
            }

        // Return the computed distances
        return distance;
    }
```

Python

```python
import heapq
from typing import List, Tuple

class Solution:
    def dijikstras_algorithm(
        self, graph: List[List[Tuple[int, int]]], source: int
    ) -> List[int]:

        # Number of vertices in the graph
        N = len(graph)

        # If the graph is empty, return an empty list
        if N == 0:
            return []

        # Create a list to store the shortest distances from the source
        # vertex
        distance = [float("inf")] * N

        # Create a min heap using PriorityQueue and customize the
        # comparator
        pq = []

        # Enqueue starting node to the queue
        heapq.heapify(pq)

        # Set the distance of the source vertex to 0 and add it to the
        # min heap
        distance[source] = 0
        heapq.heappush(pq, (0, source))

        while pq:

            # Get the vertex with the smallest distance from the min-heap
            # and remove it
            node = heapq.heappop(pq)[1]

            # Visit all adjacent vertices of the current vertex
            for neighbour, weight in graph[node]:

                # If a shorter path is found, update the distance and add
                # the neighbour to the priority queue
                if (
                    distance[node] != float("inf")
                    and distance[node] + weight < distance[neighbour]
                ):

                    # Update the distance of the neighbour
                    distance[neighbour] = distance[node] + weight

                    # Add the neighbour to the min-heap
                    heapq.heappush(pq, (distance[neighbour], neighbour))

        # Put -1 for all destinations that are not reachable from the
        # source
        for i in range(len(distance)):
            if distance[i] == float("inf"):
                distance[i] = -1

        return distance
```

## Complexity Analysis

Consider a graph with **N** nodes and **E** edges, where the average number of edges per node is **e**. In the modified algorithm, we perform three major operations.

1.  1Extract the minimum from a minimum priority queue.
2.  2For each extracted node, we iterate over all its neighbours, and in each iteration, calculate distance via the extracted node and potentially insert new (distance, node) pairs into the queue.

In the worst case, the newly calculated distance value may be smaller than the previous value every time. So, in each iteration of the outer while loop, we insert into the priority queue **e** times. Since we will have the shortest distance for all nodes after **N** iterations of the outer while loop, the calculated distances after that will never be smaller than before. Hence, there will be no inserts into the priority queue after **N** iterations. This means there will be a total of  **N\*e = E** insert operations in the priority queue, leading to a maximum queue size of **E**. Each insert in the priority queue will be **O(log(E))**, and the total contribution from all inserts will be **O(E\*log(E))**. Also, we will extract minimum **E** times, where each extraction is **O(log(E))**, so the total contribution from extracting minimum is **O(E\*log(E))**. This leads to the worst-case time complexity of **O (E\*log(E))**.

In the best case, the first distance we calculate for a node may be its smallest distance, which we add to the priority queue. Since subsequent distances will be greater, they will not be added to the queue, meaning every node will be added exactly once. This results in a total of **N** insert operations and N extractions, leading to a time complexity of **O(2\*N\*log(N)) ~ O(N\*log(N))**.

We create a distance map of size **N** in any case. However, the priority queue has sizes **E** and **N** for the worst and best cases. This leads to a worst-case space complexity of **O(E)** and a best-case of **O(N)**.

> **Best Case:** Shortest distance for each node found in the first attempt
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N\*log(N))**
>
> **Worst Case:** Shortest distance for each node found in the last attempt
>
> -   Space Complexity - **O(E)**
> -   Time Complexity - **O(E\*log(E))**

***

# Implementing Dijkstra's algorithm

***

# Dijikstra’s algorithm

## Problem Statement

Given a **weighted** **directed graph** represented as an adjacency list, and a **source** node, write a function to find the shortest path from the source to all other nodes in the graph using **Dijkstra's algorithm**. 

The graph is given as follows: `graph[i]` is a list of pairs `[neighbour, weight]`, where each pair indicates a directed edge from node `i` to the node neighbour with the specified weight.

> You must abide by the following constraints:
>
> -   If a node is not reachable from the source, mark that node's distance as \`-1\`.
> -   You can assume that the graph has no edges with negative weight.

### Example 1

> -   **Input:** graph = \[\[\[1, 2\], \[3, 5\]\], \[\[4, 6\]\], \[\[4, 1\]\], \[\[2, 2\]\], \[\[3, 7\]\]\], source = 0
> -   **Output:** \[0, 2, 7, 5, 8\]
> -   **Explanation:** Above is the shortest path array of all nodes from the source.

### Example 2

> -   **Input:** graph = \[\[\[4, 2\]\], \[\[3, 3\], \[0, 4\]\], \[\[4, 4\], \[0, 1\]\], \[\[2, 1\], \[4, 2\]\], \[\[1, 5\]\]\], source = 1
> -   **Output:** \[4, 0, 4, 3, 5\]
> -   **Explanation:** Above is the shortest path array of all nodes from the source.

## Solution

```cpp
#include <climits>
#include <queue>

using namespace std;

class Solution {
public:
    vector<int> dijikstrasAlgorithm(
        vector<vector<pair<int, int>>> &graph,
        int source
    ) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return an empty vector
        if (N == 0) {
            return {};
        }

        // Create a vector to store the shortest distances from the
        // source vertex
        vector<int> distance(N, INT_MAX);

        // Create a priority queue (min-heap) to store the nodes with
        // their weights
        priority_queue<pair<int, int>, vector<pair<int, int>>> pq;

        // Set the distance of the source vertex to 0 and add it to the
        // min-heap
        distance[source] = 0;

        // Enqueue starting node to the queue
        pq.push({0, source});

        while (!pq.empty()) {

            // Get the vertex with the smallest distance from the
            // min-heap
            int node = pq.top().second;
            pq.pop();

            // Visit all adjacent vertices of the current vertex
            for (auto &[neighbour, weight] : graph[node]) {

                // If a shorter path is found, update the distance and
                // add the neighbour to the min-heap
                if (distance[node] != INT_MAX &&
                    distance[node] + weight < distance[neighbour]) {

                    // Update the distance of the neighbour
                    distance[neighbour] = distance[node] + weight;

                    // Add the neighbour to the min-heap
                    pq.push({distance[neighbour], neighbour});
                }
            }
        }

        // Put -1 for all destinations that are not reachable by the
        // source node
        for (int i = 0; i < distance.size(); i++) {
            if (distance[i] == INT_MAX) {
                distance[i] = -1;
            }
        }

        // Return the computed distances
        return distance;
    }
};
```

***

# Implement Dijkstra’s algorithm

***

# Understanding negative weight edges

So far, all the examples we considered for computing the single source shortest path were graphs with positive edge weights. However, many problems modeled as graphs may also have negative edge weights. To better understand these cases, let's look at a few real-world examples of such problems and how we can compute the single source shortest path for them.

## Stages of chemical reaction

Complex chemical reactions often involve multiple stages where the transition from one stage to another requires a certain amount of energy.  When modeling the reactions as a graph, the nodes represent the stages, and the edge weights represent the amount of energy consumed. However, certain transitions may also release energy instead of consuming it, and those edges carry a negative weight as a consequence.

We often require multiple end products, denoted by different stages, but we start with the same starting product denoted by the source stage. The goal is to find the minimum energy needed to produce all the output. This problem boils down to knowing the shortest path from the source to all other nodes in the graph where edges can have negative weight.

// Diagram: The stages of chemical reactions and the energy required are modeled as a graph.

## Energy Grid Management

Consider a large electricity generation company that owns and operates multiple grids in a country. They generate electricity in one place and transfer it throughout the country via a network of grids in different regions. The cost of transferring energy from one grid to another in a different area is quite complex. It depends on weather, temperature, government subsidies, supply, demand, and energy prices in other regions. It is often possible that the transfer cost between two regions is negative, meaning it is profitable to send electricity via that route. The company will want to know the cheapest path to send electricity from the source to all other grids to minimize their operational costs.

This problem can be modeled as a graph, where the source node is the point of energy production, and all other nodes represent grids in different regions connected by edges that denote the cost of transfer between these regions. The shortest path from the source to the nodes in the graph is the cheapest cost of energy transfer from the source to that region.

// Diagram: Energy grids and transfer costs between them are modeled as a graph.

Note that most problems modeled as graphs with negative edges are often directed graphs.

## Shortest path with Dijkastra's algorithm

We know Dijkstra's algorithm only works on graphs with non-negative edge weights. To understand why Dijkstra's algorithm fails on graphs with negative edges, let's consider the graph above, modelling the stages of a chemical reaction and compute the shortest path from the source using Dijkstra's algorithm. In Dijkstra's algorithm, we start from the source and visit nodes in the increasing order of their distance from the source, and once we extract a node from the sorted set, we assign its distance value as the shortest distance to that node.

Since we only update distance values for nodes that are **in** the sorted set, if we reach a node that has already been extracted from the sorted set via a path that initially seemed longer but is overall smaller due to a large negative weight, we can no longer update its distance in the distance map. In graphs with negative-weight edges, the distance value for a node can decrease **later** in the iteration due to a negative weight in a path that seemed bigger initially. Consider the example below where Dikastr's algorithm finds the incorrect shortest path.

// Diagram: A large negative weight can result in an overall shorter path that is ignored by Dijkastra's algorithm.

Based on the above, we can conclude that Dijkastra's algorithm cannot solve single-source shortest path problems for graphs with negative edge weights. To solve this problem efficiently, we need a special algorithm that overcomes assumptions in Dijkastra's algorithm.

***

# Understanding the Bellman-Ford algorithm

The Bellman-Ford algorithm is a single-source shortest path-finding algorithm that can solve this problem for graphs with negative edge weights. Dijkastra's algorithm fails on graphs with negative edge weights because it assumes the first time we reach a node will always be via the shortest path. This assumption is valid for graphs with non-negative edge weights but not for those with negative edge weights. The Bellman-Ford algorithm overcomes this by calculating the shortest path for each node incrementally over multiple iterations and considering every path from the source to that node.

// Diagram: Belman-ford algorithm accounts for all paths to a node.

## Algorithm

The Bellman-Ford algorithm finds the shortest distance from the source to all nodes by starting from a base condition and relaxing the distance values of all nodes until it is no longer possible.

We start by creating a `distance` map to store the currently known shortest distance of a node and initialize it to `infinite` for each node and 0 for the source node, which acts as the base condition for the algorithm.  We then iterate through all the edges of the graph and, for each edge, check if it reduces the distance value of its destination node. For example, for an edge from node `u` to node `v` having a weight `w`, we check if `distance[u] + w < distance[v]` and update the `distance` map if the new distance is less than what was stored. This process is called **relaxing the edge** from the node `u` to node `v`.

// Diagram: An edge is relaxed by recalculating the distance from the source to the destination node.

After relaxing all the graph's edges, the `distance` map may have been modified for a few nodes. Consider that the node `u` is adjacent to nodes `a`, `b` and `c` while node `v` had nodes `x`, `y` and `z` as adjacent nodes. The distance value of nodes `a`, `b` and `c` may have been reduced, which could reduce the distance for the node `u`. Similarly, since the distance of the node `v` might have been reduced, which could reduce the distance value of the nodes `x`, `y`, and `z`.

// Diagram: Reduced distance values for nodes should be propagated to adjacent nodes.

So, some edges in the graph must be relaxed again to propagate the updates in the previous iteration to adjacent nodes. Since it is difficult to keep track of all the nodes that might be affected by a previous relaxation, we relax all the edges in the graph. This may result in the same situation again and hence, the process has to be repeated until the `distance` map is no longer updated, which can be a stopping condition for the algorithm.

However, if a graph has negative weight cycles, the iterations to relax the distances will repeat indefinitely, and we will never reach the stopping condition. This is because the distance values for some nodes in the cycle will be updated in each iteration.

// Diagram: A negative edge cycle will lead to an indefinite reduction of distance values for nodes in the cycle.

The Bellman-Ford algorithm provides a stopping condition to detect a negative weight cycle in the graph. It is guaranteed to find the shortest path between the source and all nodes after **N-1** repetitions, where **N** is the number of nodes in the graph. If the number of repetitions exceeds this, we have a negative weight cycle, and Bellman-Ford can terminate. We will learn the proof of correctness for this later in the course.

> **Algorithm**
>
> -   Step 1: Create a \`distance\` map and initialize it to 0 for the source node and \`infinite\` for all other nodes.
> -   Step 2: Iterate \`N-1\` times where \`N\` is the number of nodes and, in each iteration, do the following:
>     -   Step 2.1: Iterate over all the edges (u, v) in the graph and do the following:
>         -   Step 2.1.1: Update \`distance\[v\]\` if \`distance\[u\]\` + weight of edge from \`u\` to \`v\` < \`distance\[v\]\`
>     -   Step 2.2: To check for negative weight cycle, iterate over all the edges (u, v) in the graph once and do the following:
>         -   Step 2.2.1: If \`distance\[u\]\` + weight of edge from \`u\` to \`v\` < distance\[v\], terminate as graph has negative weight cycle
> -   Step 3: The distance map now has the shortest distance of all nodes from the source.

Let's examine a **directed** graph that has some negative-weight edges and see how the Bellman-Ford algorithm finds the shortest distance from a given source to all nodes. Note that this is a directed graph, and the same algorithm can be used for an undirected graph as well.

Bellman Ford's algorithm to find the shortest path from the source node 0.

## Implementation

Consider that we have a graph of size **N**, where the nodes are enumerated from **0** to **N-1**, and we are given the adjacency list `adj` of the graph as a two-dimensional list of pairs where the first value of the pair is the enumeration of the neighbouring node, and the second value is the weight of the edge. Since nodes can be identified by their enumeration, which runs from **0** to **N-1** instead of creating a `distance` map, we can create a `distance` array and use the node enumerations as indices to store and retrieve values from it.

The implementation of the Bellman-Ford algorithm is very simple, as it only involves two nested iterations. We create a numeric `distance` array and initialize it to 0 for the source and infinite for all other nodes. We create nested loops to iterate **N-1** times over all the edges where **N** is the number of nodes. In each iteration, we check if the distance value for a node can be relaxed. At the end of all the iterations, we try once again to relax the distance values by iterating over all the edges to check for a negative cycle.

C++

```cpp
#include <climits>

// Diagram: using namespace std;

class Solution {
public:
    vector<int> belmanFordAlgorithm(
        vector<vector<pair<int, int>>> &graph,
        int source
    ) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return an empty vector
        if (N == 0) {
            return {};
        }

        // Initialize distance array
        vector<int> distance(N, INT_MAX);

        // Distance from the source to itself is 0
        distance[source] = 0;

        // Relax graph N-1 times
        for (int i = 0; i < N - 1; i++) {
            for (int node = 0; node < N; node++) {

                // Visit all adjacent vertices of the current vertex
                for (auto &[neighbour, weight] : graph[node]) {

                    // Relax the edge if a shorter path is found
                    if (distance[node] != INT_MAX &&
                        distance[node] + weight < distance[neighbour]) {
                        distance[neighbour] = distance[node] + weight;
                    }

        // Check for negative cycles
        for (int node = 0; node < N; node++) {
            for (auto &[neighbour, weight] : graph[node]) {

                // Relax the edge if a shorter path is found
                if (distance[node] != INT_MAX &&
                    distance[node] + weight < distance[neighbour]) {

                    // Return an empty distance array to indicate a
                    // negative cycle
                    return vector<int>(N, -1);
                }

        // Put -1 for all neighbours that are not reachable by the
        // source node
        for (int i = 0; i < distance.size(); i++) {
            if (distance[i] == INT_MAX) {
                distance[i] = -1;
            }

        // Return the computed distances
        return distance;
    }
};
```

Java

```java
import java.util.*;

class Solution {
    public int[] belmanFordAlgorithm(
        List<List<List<Integer>>> graph,
        int source
    ) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return an empty vector
        if (N == 0) {
            return new int[0];
        }

        // Initialize distance array
        int[] distance = new int[N];
        Arrays.fill(distance, Integer.MAX_VALUE);

        // Distance from the source to itself is 0
        distance[source] = 0;

        // Relax graph N-1 times
        for (int i = 0; i < N - 1; i++) {
            for (int node = 0; node < N; node++) {

                // Visit all adjacent vertices of the current vertex
                for (List<Integer> edge : graph.get(node)) {

                    // Extract the neighbour
                    int neighbour = edge.get(0);

                    // Extract the weight of the edge
                    int weight = edge.get(1);

                    // Relax the edge if a shorter path is found
                    if (
                        distance[node] != Integer.MAX_VALUE &&
                        distance[node] + weight < distance[neighbour]
                    ) {
                        distance[neighbour] = distance[node] + weight;
                    }

        // Check for negative cycles
        for (int node = 0; node < N; node++) {
            for (List<Integer> edge : graph.get(node)) {

                // Extract the neighbour
                int neighbour = edge.get(0);

                // Extract the weight of the edge
                int weight = edge.get(1);

                // Relax the edge if a shorter path is found
                if (
                    distance[node] != Integer.MAX_VALUE &&
                    distance[node] + weight < distance[neighbour]
                ) {

                    // Return an empty distance array to indicate a
                    // negative cycle
                    Arrays.fill(distance, -1);
                    return distance;
                }

        // Put -1 for all neighbours that are not reachable by the
        // source node
        for (int i = 0; i < distance.length; i++) {
            if (distance[i] == Integer.MAX_VALUE) {
                distance[i] = -1;
            }

        // Return the computed distances
        return distance;
    }
```

Typescript

```typescript
export class Solution {
    belmanFordAlgorithm(graph: number[][][], source: number): number[] {

        // Number of nodes in the graph
        const N = graph.length;

        // If the graph is empty, return an empty vector
        if (N === 0) {
            return [];
        }

        // Initialize distance array
        const distance: number[] = new Array(N).fill(
            Number.MAX_SAFE_INTEGER
        );

        // Distance from the source to itself is 0
        distance[source] = 0;

        // Relax graph N-1 times
        for (let i = 0; i < N - 1; i++) {
            for (let node = 0; node < N; node++) {

                // Visit all adjacent vertices of the current vertex
                for (const [neighbour, weight] of graph[node]) {

                    // Relax the edge if a shorter path is found
                    if (
                        distance[node] !== Number.MAX_SAFE_INTEGER &&
                        distance[node] + weight < distance[neighbour]
                    ) {
                        distance[neighbour] = distance[node] + weight;
                    }

        // Check for negative cycles
        for (let node = 0; node < N; node++) {
            for (const [neighbour, weight] of graph[node]) {

                // Relax the edge if a shorter path is found
                if (
                    distance[node] !== Number.MAX_SAFE_INTEGER &&
                    distance[node] + weight < distance[neighbour]
                ) {

                    // Return an empty distance array to indicate a
                    // negative cycle
                    return new Array(N).fill(-1);
                }

        // Put -1 for all neighbours that are not reachable by the
        // source node
        for (let i = 0; i < distance.length; i++) {
            if (distance[i] === Number.MAX_SAFE_INTEGER) {
                distance[i] = -1;
            }

        // Return the computed distances
        return distance;
    }
```

Javascript

```javascript
export class Solution {
    belmanFordAlgorithm(graph, source) {

        // Number of nodes in the graph
        const N = graph.length;

        // If the graph is empty, return an empty vector
        if (N === 0) {
            return [];
        }

        // Initialize distance array
        const distance = new Array(N).fill(Number.MAX_SAFE_INTEGER);

        // Distance from the source to itself is 0
        distance[source] = 0;

        // Relax graph N-1 times
        for (let i = 0; i < N - 1; i++) {
            for (let node = 0; node < N; node++) {

                // Visit all adjacent vertices of the current vertex
                for (const [neighbour, weight] of graph[node]) {

                    // Relax the edge if a shorter path is found
                    if (
                        distance[node] !== Number.MAX_SAFE_INTEGER &&
                        distance[node] + weight < distance[neighbour]
                    ) {
                        distance[neighbour] = distance[node] + weight;
                    }

        // Check for negative cycles
        for (let node = 0; node < N; node++) {
            for (const [neighbour, weight] of graph[node]) {

                // Relax the edge if a shorter path is found
                if (
                    distance[node] !== Number.MAX_SAFE_INTEGER &&
                    distance[node] + weight < distance[neighbour]
                ) {

                    // Return an empty distance array to indicate a
                    // negative cycle
                    return new Array(N).fill(-1);
                }

        // Put -1 for all neighbours that are not reachable by the
        // source node
        for (let i = 0; i < distance.length; i++) {
            if (distance[i] === Number.MAX_SAFE_INTEGER) {
                distance[i] = -1;
            }

        // Return the computed distances
        return distance;
    }
```

Python

```python
from typing import List, Tuple

class Solution:
    def belman_ford_algorithm(
        self, graph: List[List[Tuple[int, int]]], source: int
    ) -> List[int]:

        # Number of nodes in the graph
        n = len(graph)

        # If the graph is empty, return an empty vector
        if n == 0:
            return []

        # Initialize distance array
        distance: List[int] = [float("inf")] * n

        # Distance from the source to itself is 0
        distance[source] = 0

        # Relax graph n-1 times
        for i in range(n - 1):
            for node in range(n):

                # Visit all adjacent vertices of the current vertex
                for neighbour, weight in graph[node]:

                    # Extract the neighbour
                    # Extract the weight of the edge

                    # Relax the edge if a shorter path is found
                    if (
                        distance[node] != float("inf")
                        and distance[node] + weight < distance[neighbour]
                    ):
                        distance[neighbour] = distance[node] + weight

        # Check for negative cycles
        for node in range(n):
            for neighbour, weight in graph[node]:

                # Extract the neighbour
                # Extract the weight of the edge

                # Relax the edge if a shorter path is found
                if (
                    distance[node] != float("inf")
                    and distance[node] + weight < distance[neighbour]
                ):

                    # Return an empty distance array to indicate a negative
                    # cycle
                    return [-1] * n

        # Put -1 for all neighbours that are not reachable by the
        # source node
        for i in range(len(distance)):
            if distance[i] == float("inf"):
                distance[i] = -1

        # Return the computed distances
        return distance
```

## Proof of correctness

We can prove the Bellman-Ford algorithm in two ways. The intuitive way is to see the shortest path for all nodes as a tree where each iteration of Bellman-Ford moves one level down from the source. However, the formal proof reformulates the algorithm using dynamic programming. Let us look at these proofs to better understand the Bellman-Ford algorithm's correctness. 

### Intuitive proof

The shortest path for every node in the graph has a finite number of edges originating from the source node and terming at the node itself with some intermediate nodes in between. The shortest path between any two nodes `u` and `v` will be denoted by`d(u, v)`in the explanation below. For any intermediate node `i` in the shortest from the source node `s` to node `v`, it can be proved that `d(s, v) = d(s, i) + d(i, v)`. This means that the shortest path between any two nodes is the sum of the shortest path between the intermediate nodes in that path.

// Diagram: The shortest path between two nodes is the sum of the shortest path between intermediate nodes.

We can prove the above by contradiction as any path from node `s` to node `v` via node `i` cannot be shorter than `d(s, i) + d(i, v)`. So, if there exists a shorter path from node `s` to node `v` then node `i` cannot be an intermediate node which contradicts our assumptions and hence proves the above statement.

Now, let's see how repeated relaxation of all edges in the graph in Bellman-Ford algorithm eventually finds the shortest path from the source node to all other nodes in the graph. Consider a node `v` in the graph such that its shortest path from the source has exactly `e` edges and some intermediate nodes `a`, `b` and `u` among other nodes, as shown below.

// Diagram: My Awesome Creation

In the first iteration of the Bellman-Ford algorithm, when we relax all edges of the graph, we relax the edge between the source and the node `a`. Since node `a` is the **first** node in the shortest path to the node `v`, the edge from source to node `a` is the shortest path to the node `a`.

// Diagram: We will get the shortest distance to node a after the first iterations of relaxing all edges.

In the next iteration, when we relax all edges in the graph, we are guaranteed to get the shortest path to the node `b`. This is because we already have the shortest path to the node `a` from the previous iteration and relaxing the edge between nodes `a` and `b` gives us the shortest path to the node `b`.

Similarly, the `eth` iteration will give us the shortest path to the node `v` that is `e` edges away.

// Diagram: We will get the shortest distance to node v after e iterations of relaxing all edges.

To extend this to all nodes in the graph, if we only consider the edges in the graph that are in the shortest path of at least one node, we will get a tree with the source node as the root. Another way to look at this tree is like the overlap of nodes and edges when putting the shortest path of all the nodes together. We can call this tree the **shortest path tree**.

// Diagram: The shortest path tree is created by overlapping the shortest path to all nodes.

Every iteration of the Bellman-Ford algorithm finds the shortest distance for all nodes in the next level. This means the `ith` iteration finds the shortest distance for all nodes at level `i`.

// Diagram: We get the shortest distance to nodes at successive depths with each iteration of the Bllman-Ford algorithm.

Since a graph with N nodes cannot have more than N-1 edges between any two nodes, the maximum depth of the shortest path tree is N-1. Hence, iterating N-1 times guarantees the shortest path to all nodes in the graph.

### Formal proof

For a more formal proof of correctness, we can reformulate the Bellman-Ford algorithm using dynamic programming and prove its correctness by induction. Let's assume a function `d(i, v)` that gives us the shortest distance from the source node to the node `v` with **at most** `i` edges between them. We can compute the value of this function if we know the solution for `d(i-1, *)` where `*` is all the nodes in the graph using the recursive equation below.

// Diagram: The recursive equation for Bellman-Ford algorithm.

Since we already know the value of `d(0, *)`  (where `*` is all the nodes in the graph) for all the nodes in the graph, it serves as the base case, and we can build `d(1, *)` , `d(2, *)` all the way to `d(n-1, *)`. In each iteration we are ultimately iterating over **all the edges** and relaxing distance values for nodes if the new distance to the node is smaller. The Bellman-Ford algorithm does exactly this and computes the values of `d(i, *)`  in the `ith` repetition in the `distance` map.

And since a graph with **N** nodes cannot have more than **N-1** edges between any two nodes, the value of `d(n-1, v)` is the shortest path from the source node node `v`. At the end of the `n-1th` iteration, the `distance` map has the value of `d(n-1, *)`  for all nodes.

## Complexity Analysis

The runtime complexity of the Bellman-Ford algorithm is quite easy to understand. We use a nested loop to iterate over all the edges **N-1** times, where **N** is the number of nodes in the graph. In each iteration, we only do constant-time **O(1)** operations to check if the distance value can be relaxed. If **E** is the total number of edges in the graph, the runtime complexity is **O(E\*N)** in any case.

Since we create a distance map of size **N** to compute the distance values for each node, the extra space needed in any case is **O(N)**.

> **Best Case**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(E\*N)**
>
> **Worst Case**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(E\*N)**

***

# Implement Bellman-Ford algorithm

***

# Belman ford algorithm

## Problem Statement

Given a weighted directed graph represented as an adjacency list, and a source node, write a function to find the shortest path from the source to all other nodes in the graph using the Bellman-Ford algorithm. 

The graph is given as follows: `graph[i]` is a list of pairs `[neighbour, weight]`, where each pair indicates a directed edge from node `i` to the node neighbour with the specified weight.

> You must abide by the following constraints:
>
> -   If a node is not reachable from the source, mark that node's distance as \`-1\`.
> -   If the graph contains a negative cycle, return an array filled with \`-1\`.
> -   A negative cycle is a cycle whose edges are such that the sum of their weights is a negative value.

### Example 1

> -   **Input:** graph = \[\[\[1, 2\], \[3, 5\]\], \[\[4, 6\]\], \[\[4, 1\]\], \[\[2, 2\]\], \[\[3, 7\]\]\], source = 0
> -   **Output:** \[0, 2, 7, 5, 8\]
> -   **Explanation:** Above is the shortest path array of all nodes from the source.

### Example 2

> -   **Input:** graph = \[\[\[4, 2\]\], \[\[3, 3\], \[0, 4\]\], \[\[4, 4\], \[0, 1\]\], \[\[2, 1\], \[4, 2\]\], \[\[1, 5\]\]\], source = 1
> -   **Output:** \[4, 0, 4, 3, 5\]
> -   **Explanation:** Above is the shortest path array of all nodes from the source.

## Solution

```cpp
#include <climits>

using namespace std;

class Solution {
public:
    vector<int> belmanFordAlgorithm(
        vector<vector<pair<int, int>>> &graph,
        int source
    ) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return an empty vector
        if (N == 0) {
            return {};
        }

        // Initialize distance array
        vector<int> distance(N, INT_MAX);

        // Distance from the source to itself is 0
        distance[source] = 0;

        // Relax graph N-1 times
        for (int i = 0; i < N - 1; i++) {
            for (int node = 0; node < N; node++) {

                // Visit all adjacent vertices of the current vertex
                for (auto &[neighbour, weight] : graph[node]) {

                    // Relax the edge if a shorter path is found
                    if (distance[node] != INT_MAX &&
                        distance[node] + weight < distance[neighbour]) {
                        distance[neighbour] = distance[node] + weight;
                    }
                }
            }
        }

        // Check for negative cycles
        for (int node = 0; node < N; node++) {
            for (auto &[neighbour, weight] : graph[node]) {

                // Relax the edge if a shorter path is found
                if (distance[node] != INT_MAX &&
                    distance[node] + weight < distance[neighbour]) {

                    // Return an empty distance array to indicate a
                    // negative cycle
                    return vector<int>(N, -1);
                }
            }
        }

        // Put -1 for all neighbours that are not reachable by the
        // source node
        for (int i = 0; i < distance.size(); i++) {
            if (distance[i] == INT_MAX) {
                distance[i] = -1;
            }
        }

        // Return the computed distances
        return distance;
    }
};
```
