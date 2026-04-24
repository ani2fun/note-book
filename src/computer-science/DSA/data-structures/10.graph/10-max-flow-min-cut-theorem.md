# Max-flow Min-cut theorem

## Table of Contents

1. [Understanding the maximum flow problem](#understanding-the-maximum-flow-problem)
2. [Understanding the max flow min cut theorem](#understanding-the-max-flow-min-cut-theorem)
3. [Understanding the Ford-Fulkerson method](#understanding-the-ford-fulkerson-method)
4. [Understanding reverse edges in Ford-Fulkerson method](#understanding-reverse-edges-in-ford-fulkerson-method)
5. [Find maximum flow](#find-maximum-flow)

***

# Understanding the maximum flow problem

The max flow problem is another common class of problems that can be modeled as a graph. The goal is to find the maximum flow through a flow network, a directed graph in which each edge has a capacity and receives flow. The amount of flow in the edge is capped by its capacity. The flow network has two special nodes, the source and the sink, where the flow starts and terminates. For all nodes except the source and the sink, there is a **conservation of flow**, which means the amount of flow going into a node should be the same as the flow coming out of it. The following example shows a simple flow network with the source and sink nodes and the capacity of edges.

// Diagram: A flow network with source and sink nodes and the capacity of edges.

The goal of the maximum flow problem is to find the maximum flow that can go through the network from the source node to the sink node. To better understand why this is such an important problem, let's look at real-life examples that can be modeled as flow networks.

## Road network

Consider a road network in a city that has a lot of traffic. The government wants to increase the capacity of this network and decongest the traffic by adding more roads. However, before starting the work, they need to know the maximum traffic that could pass through the network after the work is finished. This problem can be modeled as a flow network where nodes denote existing roads' start and end points, and the edges denote roads. The capacity of an edge is the maximum traffic that can flow through the road. The source and the sink for the network would be the entry and exit of traffic into the road network.

// Diagram: Traffic on a road network can be modeled as a flow network, and the maximum flow represents the network's capacity.

They can choose the one that meets their expectations by comparing the maximum flow between different proposed options.

## Hot water network

Consider a construction company that has to build a network to supply hot water to a new development from a central heat station. The water is heated at the heat station and supplied to houses to keep them warm. The cold water is circulated back to the heat station for reheating. Such a system may involve multiple segments with different capacities depending on the size of the houses. However, they need to ensure the network has enough capacity to meet the demand from all houses in winter.

Such a system can also be modeled as a flow network, where the source and the sink nodes are different ends of the heat station. The nodes in the network denote houses and the edges denote the pipes between them. The maximum water that can flow through a pipe is the capacity of that edge. 

// Diagram: A heating network's network of pipes can be modeled as a flow network, and the maximum flow represents the network's capacity.

The company can compare the maximum flow between different proposed options and choose the one that meets their expectations.

## Logistic network

Consider a logistics company that transports goods from a manufacturing plant to a warehouse in another city. The warehouse and the final destination have intermediate cities connected via a road network. The company operates only a fixed number of trucks between a pair of cities, and there is no warehousing capacity in any intermediate city. The manufacturing plant needs to know the maximum amount of goods to be delivered to the warehouse daily and set their manufacturing output accordingly.This problem can also be modeled as a flow network where the factory is the source node and the warehouse is the sink node. The intermediate cities are the other nodes in the network, and the carrying capacity of trucks between cities is the capacity of edges in the graph.

// Diagram: The logistic network can be modeled as a flow network, and the maximum flow is the maximum deliverable capacity.

Finding the maximum flow in the resulting flow network allows the manufacturing company to control the out and prevent wastage.

Many more real-life problems can be modeled as flow networks, and solving them requires finding the maximum flow in the network. The examples above are small networks, but flow networks could also span hundreds of thousands of nodes, so we need an efficient algorithm to solve them.

***

# Understanding the max-flow min-cut theorem

Now that we know what flow networks are and the maximum flow problem, we can explore the fundamental theorem and its solution. The max-flow min-cut theorem states that for any flow network, the maximum flow from the source to the sink is the minimum sum of weights of edges that, if removed, will completely disconnect the source and sink. Consider the flow network given below; we will use it as an example to prove the max-flow min-cut theorem.

// Diagram: A flow network with a source and sink where edge weight is the maximum capacity of the edge.

Before we dive deeper into this theorem, we need to know some terminologies used to to prove its correctness.

## Residual graph

In a flow network with some flow f from the source to the sink node, the capacity of all edges with flow is reduced. The remaining capacity of such edges is called their residual capacity. A graph representing the flow network with the residual capacity of its edges is called a residual graph.

A residual graph also has reverse edges between nodes with some flow in them, and the residual capacity of these reverse edges is the total flow in the forward edge. We will learn later why these reverse edges are so crucial when we learn how to find the maximum flow in a flow network.

// Diagram: The residual graph for a flow network with some flow.

## Augmenting path

In a flow network with some flow `f` from the source to the sink node; an augmenting path is a simple path from the source node to the sink node in the residual graph. The maximum flow that can be augmented through an augmenting path is the minimum residual capacity of all its edges. And so, if we augment flow `fp` through an augmenting path, the total flow in the network becomes `f + fp`. 

// Diagram: A flow network can have many augmenting paths.

## Cut

A cut of the flow network denoted by `cut(S, T)`, partitions the graph's nodes into two disjoint sets, `S`, and `T`, such that the set `S` contains the source node and the set `T` contains the sink node.

// Diagram: A cut divides the flow network into two disjoint sets, S and T.

A flow network can have many cuts. All the cuts for the flow network from our example above are given below.

// Diagram: A flow network can have many cuts

### Capacity of a cut

The capacity of a cut `capacity(S, T)` is the sum of the capacity of all edges from nodes in the set `S` to nodes is set `T` in the `cut(S, T)` of a flow network.

// Diagram: The capacity of a cut is the sum of the capacity of edges from nodes in set S to nodes in set T.

The flow network in the example above has three cuts, the capacity of which is given below.

// Diagram: The capacity of a cut is the sum of capacity of edges from nodes in set S to nodes in set T.

The max-flow min-cut theorem states that the maximum flow in the network `fmax` equals the minimum `cut(S, T)`, and the residual graph for the network has no augmenting paths.

## Proof of correctness

Consider a flow network with some flow `f` flowing from the source node to the sink node. Since nodes do not store flow, for all nodes except the source and the sink, the sum of all incoming flow must equal the sum of outgoing flow. For the source and the sink node, the sum of all outgoing flow from the source should equal the sum of all incoming flow to the sink. This preserves the conservation of flow.

// Diagram: The net flow for all nodes except source and sink should be 0

For a flow network with a flow `f`, for **every** `cut(S, T)`, the net outgoing flow from set `S` should be equal to `f`. This is because, as per above, the net flow for all nodes in `S` except the source is always 0, and the net flow from the source node is `f`.  Hence, the net flow from set `S` should be `f` for the conservation of flow to hold. Also, the flow `f` can not exceed `capacity(S, T).` This proves that for a flow `f` in the flow network, **every** `cut(S, T)` has a flow f, and f cannot exceed the capacity of **any** `cut(S, T)`.

// Diagram: The net flow across any set is equal to the total flow in the network.

Since the above is true for **any** flow value for **every** `cut(S, T)`, it also holds for the maximum flow in the network, i.e., the maximum flow fmax cannot be greater than any `cut(S, T)` of the network. Conversely, the maximum flow `fmax` is bounded by the **minimum** `cut(S, T)`.

// Diagram: The maximum flow in the graph in the network is bounded by the capacity of minimum cut.

The max-flow min-cut theorem states that the maximum flow in the network `fmax` equals the minimum `cut(S, T)`, and the residual graph for the network has no augmenting paths.

This theorem can be proved in two parts. The first is that a flow network whose residual graph does not have any augmenting paths has the maximum flow. We can prove this by contradiction. Consider `fmax` is the maximum flow in the network that has an augmenting path in its residual graph. In that case, we can augment more flow in the augmenting path and increase the flow in the network, which contradicts `fmax` being the maximum flow.

// Diagram: A flow network with maximum flow.

The second part is that the flow in a network with no augmenting paths in its residual graph equals the capacity of some `cut(S, T)`. Consider a network with the maximum flow `fmax` such that it has no augmenting paths in its residual graph. We create two sets, `S` and `T`, such that all nodes with a path from the source with nonzero residual capacity belong to `S`, and the remaining belong to `T`.

// Diagram: The residual graph of a flow network with maximum flow and no augmenting path can pe separated into two sets.

The source node trivially belongs to `S`, and since the residual graph has no augmenting paths, the sink node belongs to `T`. Based on the condition above, the remaining nodes can be assigned to `S` or `T`. This makes the set `S` and `T` a `cut(S, T)` of the flow network.

// Diagram: The two sets represent a cut of the flow network.

Now, for any pair of nodes `u` and `v` belonging to sets `S` and `T`, respectively, if there is an edge from `u` to `v` in the flow network, it shouldn't have any residual capacity, meaning flow from node `u` to `v` should be equal to the capacity of the edge from `u` to `v`. This is because if it has any residual capacity, there would be a path from source to node `v` in the residual graph with non-zero residual capacity, meaning `v` should belong to the set `S` in the first place. If we sum up the flow from all such node pairs, the total flow will be equal to the `capacity(S, T)` which is also the total outward from set `S`.

// Diagram: The flow in each edge from nodes in set S to set T should equal the edge's capacity.

Similarly, if there is an edge from the node `v` to node `u` in the flow network, the flow on that edge should be 0. This is because if there is some flow from the node `v` to node `u` in the network, it would mean there is a reverse edge with some residual capacity from the node `u` to node `v` in the residual graph. This would mean that there is a path with nonzero residual capacity from the source node to the node `v` in the residual graph, and node `v` should belong to the set `S`.

// Diagram: The flow in each edge from nodes in set T to set S should be 0.

Summing it all up, this means there is no flow from the set `T` to set `S`, and so the net from the set `S` to `T` **equals** `capacity(S, T)`. And since all flow in a flow network is bounded by the capacity of the minimum cut, this means that the `cut(S, T)` is the minimum cut flow equals the `capacity(S, T)` of the minimum cut.

// Diagram: The maximum flow in a network is equal to the capacity of the minimum cut.

The two parts above together prove the max-flow min-cut theorem, which states that a flow network with no augmenting path has the maximum flow, which is equal to the capacity of the minimum cut. As we will learn later in this course, the max-flow min-cut theorem has many applications in graph theory.

***

# Understanding the Ford-Fulkerson method

The Ford-Fulkerson method uses the max-flow min-cut theorem to solve the maximum flow problem for flow networks. It is called a method because some parts of its protocol do not specify implementation. A method is a more general algorithm where individual steps can be implemented differently. For the Ford-Fulkerson method to work, a graph should have at least one source and sink node, where the maximum flow must be calculated from the source to the sink. Consider the flow network below, where values in edges denote their maximum capacity.

// Diagram: A flow network with source and sink where edge weight denotes the capacity of an edge.

## Algorithm

The Ford-Fulkerson method starts by initialising a variable `maxFlow` to 0 and repeatedly tries to find an augmenting path in the residual graph. If an augmenting path is found, it gets the minimum capacity of the edges in the augmenting path in a variable `pathFlow` and adds it to `maxFlow`. It then simulates the flow (`pathFlow`) through the augmenting path in the residual graph to generate a new residual graph for the next iteration. This process is repeated until an augmenting path can no longer be found, at which point the value in `maxFlow` denotes the maximum possible flow in the graph.

To better understand the algorithm, let's examine the first two iterations in the method using the following graph.

// Diagram: A flow network with source and sink where edge weight denotes the capacity of an edge.

We start the method by initializing a variable `maxFlow` which keeps track of the maximum flow in the graph. Then, we initialize the first residual graph `residualGraph` and set the capacity of all edges equal to the capacity of the edges in the input graph.

// Diagram: The residual graph at the start of the Ford-Fulkerson method.

We then start from the source node and try to find a path to the sink node where all the edges have non-zero residual capacity (augmenting path). Ford Fulerkson's method does not specify the algorithm for finding the path. We will use a depth-first search to illustrate this example.

It is important to note that multiple augmenting paths could be present in the graph, but a depth-first search will choose the first one it finds.

// Diagram: There could be multiple augmented paths present in the graph.

Consider that we chose the augmenting path `1` from the example. Once we choose a path, we find the maximum flow that can pass through it, which is the minimum of the residual capacities of its edges in a variable `pathFlow`.

// Diagram: The maximum flow through the augmenting path is the minimum residual capacity of its edges.

Once we find the maximum flow possible through the augmenting path (`pathFlow`), we simulate the flow by reducing `pathFlow` from the residual capacity of all edges in the augmenting path, and add it to `maxFlow`.

// Diagram: Reduce pathFlow from the residual capacity of all edges in the augmenting path and add it to maxFlow.

We also add **reverse edges** along the augmenting path with the same capacity as the simulated flow (`pathFlow`) in the `residualGraph`. These reverse edges can be used in an augmenting path in some later iteration and allow for reorienting the flow in the graph. Simulating flow in a reverse edge means reducing the same flow from the real edge between the corresponding nodes. We will learn more about reverse edges and why they are crucial later in this course.

// Diagram: Add reverse edges in the augmenting path with the capacity pathFlow.

Once we have added reverse edges, we get a new residual graph that can be used for the next iteration.

// Diagram: We get the new residual graph for the next iteration.

In the next iteration, once again, we try to find an augmenting path in the `residualGraph`. We perform a depth-first search to find paths from the source to the sink with some residual capacity; this time, also exploring paths via the reverse edges. Note that just like before, there may be other augmenting paths, but we chose any one of them.

// Diagram: Find an augmenting path in the residual graph.

Once we find an augmenting path in the residual graph, we again find the maximum flow that can pass through it, which is the minimum of the residual capacities of its edges and store it in the variable `pathFlow`.

// Diagram: The maximum flow through the augmenting path is the minimum residual capacity of its edges.

We then simulate the flow by reducing `pathFlow` from the residual capacity of all edges in the augmenting path, and add it to `maxFlow`.

// Diagram: Flow through reverse edges signifies reduced flow from previous paths.

We also add **reverse edges** along the augmenting path with the same capacity as the simulated flow (`pathFlow`) in the `residualGraph`.

// Diagram: Add reverse edges with the same capacity as pathFlow.

Once we have added reverse edges, we get a new residual graph that can be used for the next iteration.

// Diagram: We get the new residual graph for the next iteration.

We repeat the same steps to find an augmenting path in `residualGraph` and simulate flow in it until an augmented path can no longer be found. When an augmenting path can no longer be found, the value of `maxFlow` will be the maximum possible flow in the graph.

The steps below summarize the Ford-Fulkerson's method using a residual graph implemented as an adjacency matrix.

> **Algorithm**
>
> **dfs(\[ref\] residualGraph, \[re\] visited, \[ref\] path, node, sink)**
>
> -   **Step 1:** Add \`node\` to \`visited\` set
> -   **Step 2:** Append \`node\` to \`path\`
> -   **Step 3:** if \`node\` is \`sink\` return \`true\`
> -   **Step 4:** Iterate over all the neighbours of \`node\` in a variable \`neighbour\` and do the following
>     -   **Step 4.1:** If \`neighbour\` not in \`visited\` and \`residualGraph\[node\]\[neighbour\]\` > 0 do the following:
>         -   **Step 4.1.1:** If the call to \`dfs(residualGraph, visited, path, neighbour, sink)\` returns \`true\`, return \`true\`
> -   **Step 5:** Pop the \`node\` from the end of \`path\`
> -   **Step 6:** Return \`false\`
>
> **fordFulkersonMethod(\[ref\] graph, source, sink)**
>
> -   **Step 1:** Create a two-dimensional array \`residualGraph\` to hold the adjacency matrix of the residual graph
> -   **Step 2:** Initialize \`residualGraph\` with the weights between nodes in \`graph\`
> -   **Step 3:** Initialize a variable \`maxFlow\` to 0
> -   **Step 4:** Iterate while call to \`dfs(residualGraph, visited, path, source, sink)\` returns true:
>     -   **Step 4.1:** Initilize a variable \`pathFlow\` to \`infinite\`
>     -   **Step 4.2:** Iterate in \`path\` taking two items at a time in variables \`u\` and \`v\` and for each do the following:
>         -   **Step 4.2.1:** Set \`pathFlow\` to \`min(pathFlow, residualGraph\[u\]\[v\])\`
>     -   **Step 4.3:** Iterate in \`path\` taking two items at a time in variables \`u\` and \`v\` and for each do the following:
>         -   **Step 4.3.1:** Reduce \`pathFlow\` from \`residualGraph\[u\]\[v\]\`
>         -   **Step 4.3.2:** Add \`pathFlow\` to \`residualGraph\[v\]\[u\]\`
>     -   **Step 4.4:** Add \`pathFlow\` to \`maxFlow\`
> -   **Step 5:** Return \`maxFlow\`

## Implementation

Consider that we have a graph of **N** nodes, where the nodes are enumerated from**0**to**N-1**, and we are given the adjacency listof the graph as a two-dimensional list of pairs `graph`, where the first item in the pair is the enumeration of the neighbouring node and the second item is the weight (capacity) of the edge.

We implement the residual graph as an adjacency matrix by creating a two-dimensional array `residualGraph` and initialize it by setting the capacity of edges between nodes to the same as the input `graph`.

The reason we store it as an adjacency matrix and not a list is that it simplifies the addition of forward and reverse edges and manipulating weights.

We create a `dfs` function that finds an augmenting path in the `residualGraph` and returns a boolean `true` or `false` and is call it repeatedly until it returns `false`. In each iteration, we pass it an empty `visited` set and an empty `path` list, and it tries to find an augmenting path in the `residualGraph`.

If it finds a path, the nodes in the path are added in the correct order to the `path` , list which is then used to find the maximum possible flow that can be simulated through it in `pathFlow`.

The `residualGraph` is then updated by simulating `pathFlow` through it, `pathFlow` is added to `maxFlow` and all variables (`pathFlow`, `visited`, `path`) are reset for the next iteration. At the end of all iterations, we get the maximum flow in `maxFlow`.

C++

```cpp
#include <climits>
#include <unordered_set>

// Diagram: using namespace std;

class Solution {
public:
    bool dfs(
        vector<vector<int>> &residualGraph,
        unordered_set<int> &visited,
        vector<int> &path,
        int node,
        int sink
    ) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.insert(node);

        // Add the current node to the path
        path.push_back(node);

        // If the current node is the sink, return true
        if (node == sink) {
            return true;
        }

        // Explore all neighbours of the current node
        for (int neighbour = 0; neighbour < residualGraph.size();
             ++neighbour) {

            // If the neighbour is not visited and has a positive
            // capacity in the residual graph, recursively call DFS
            if (visited.find(neighbour) == visited.end() &&
                residualGraph[node][neighbour] > 0) {

                // If the DFS call returns true, propagate the result
                // back to the previous call
                if (dfs(residualGraph, visited, path, neighbour, sink)) {
                    return true;
                }

        // If no path to the sink is found, remove the current node
        // from the path
        path.pop_back();

        // If no path to the sink is found from this node, backtrack
        return false;
    }

    int maximumFlow(
        vector<vector<pair<int, int>>> &graph,
        int source,
        int sink
    ) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return 0
        if (N == 0) {
            return 0;
        }

        // Create a residual graph and initialize it with the original
        // capacities
        vector<vector<int>> residualGraph(N, vector<int>(N, 0));
        for (int node = 0; node < N; ++node) {
            for (auto &[neighbour, capacity] : graph[node])
                residualGraph[node][neighbour] = capacity;
        }

        // Initialize the maximum flow
        int maxFlow = 0;

        // Find augmenting paths in the residual graph using
        // Depth-First Search
        while (true) {

            // Create a set to keep track of visited nodes
            unordered_set<int> visited;

            // Vector to store the path from source to sink
            vector<int> path;

            // If no more augmenting paths exist, break
            if (!dfs(residualGraph, visited, path, source, sink)) {
                break;
            }

            // Find the minimum capacity along the augmenting path
            int pathFlow = INT_MAX;
            for (int i = 0; i < path.size() - 1; ++i) {
                int u = path[i];
                int v = path[i + 1];
                pathFlow = min(pathFlow, residualGraph[u][v]);
            }

            // Update the residual capacities and reverse edges along the
            // augmenting path
            for (int i = 0; i < path.size() - 1; ++i) {
                int u = path[i];
                int v = path[i + 1];
                residualGraph[u][v] -= pathFlow;
                residualGraph[v][u] += pathFlow;
            }

            // Add the path flow to the maximum flow
            maxFlow += pathFlow;
        }

        return maxFlow;
    }
};
```

Java

```java
import java.util.*;

class Solution {
    public boolean dfs(
        int[][] residualGraph,
        Set<Integer> visited,
        List<Integer> path,
        int node,
        int sink
    ) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.add(node);

        // Add the current node to the path
        path.add(node);

        // If the current node is the sink, return true
        if (node == sink) {
            return true;
        }

        // Explore all neighbours of the current node
        for (
            int neighbour = 0;
            neighbour < residualGraph.length;
            ++neighbour
        ) {

            // If the neighbour is not visited and has a positive
            // capacity in the residual graph, recursively call DFS
            if (
                !visited.contains(neighbour) &&
                residualGraph[node][neighbour] > 0
            ) {

                // If the DFS call returns true, propagate the result
                // back to the previous call
                if (dfs(residualGraph, visited, path, neighbour, sink)) {
                    return true;
                }

        // If no path to the sink is found, remove the current node
        // from the path
        path.remove(path.size() - 1);

        // If no path to the sink is found from this node, backtrack
        return false;
    }

    public int maximumFlow(
        List<List<List<Integer>>> graph,
        int source,
        int sink
    ) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return 0
        if (N == 0) {
            return 0;
        }

        // Create a residual graph and initialize it with the original
        // capacities
        int[][] residualGraph = new int[N][N];
        for (int node = 0; node < N; ++node) {
            for (List<Integer> edge : graph.get(node)) {
                int neighbour = edge.get(0);
                int capacity = edge.get(1);
                residualGraph[node][neighbour] = capacity;
            }

        // Initialize the maximum flow
        int maxFlow = 0;

        // Find augmenting paths in the residual graph using
        // Depth-First Search
        while (true) {

            // Create a set to keep track of visited nodes
            Set<Integer> visited = new HashSet<>();

            // Vector to store the path from source to sink
            List<Integer> path = new ArrayList<>();

            // If no more augmenting paths exist, break
            if (!dfs(residualGraph, visited, path, source, sink)) {
                break;
            }

            // Find the minimum capacity along the augmenting path
            int pathFlow = Integer.MAX_VALUE;
            for (int i = 0; i < path.size() - 1; ++i) {
                int u = path.get(i);
                int v = path.get(i + 1);
                pathFlow = Math.min(pathFlow, residualGraph[u][v]);
            }

            // Update the residual capacities and reverse edges along the
            // augmenting path
            for (int i = 0; i < path.size() - 1; ++i) {
                int u = path.get(i);
                int v = path.get(i + 1);
                residualGraph[u][v] -= pathFlow;
                residualGraph[v][u] += pathFlow;
            }

            // Add the path flow to the maximum flow
            maxFlow += pathFlow;
        }

        return maxFlow;
    }
```

Typescript

```typescript
export class Solution {
    dfs(
        residualGraph: number[][],
        visited: Set<number>,
        path: number[],
        node: number,
        sink: number
    ): boolean {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.add(node);

        // Add the current node to the path
        path.push(node);

        // If the current node is the sink, return true
        if (node === sink) {
            return true;
        }

        // Explore all neighbours of the current node
        for (
```

Javascript

```javascript
export class Solution {
    dfs(residualGraph, visited, path, node, sink) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.add(node);

        // Add the current node to the path
        path.push(node);

        // If the current node is the sink, return true
        if (node === sink) {
            return true;
        }

        // Explore all neighbours of the current node
        for (
            let neighbour = 0;
            neighbour < residualGraph.length;
            ++neighbour
        ) {

            // If the neighbour is not visited and has a positive
```

Python

```python
import sys
from typing import List, Tuple, Set

class Solution:
    def dfs(
        self,
        residual_graph: List[List[int]],
        visited: Set[int],
        path: List[int],
        node: int,
        sink: int,
    ) -> bool:

        # Mark the current node as visited in the graph to avoid
        # visiting it again
        visited.add(node)

        # Add the current node to the path
        path.append(node)

        # If the current node is the sink, return true
        if node == sink:
            return True
```

## Proof of Correctness

Ford-Fulkerson's method uses the max-flow min-cut theorem, which states that the flow in a flow network that does not have any augmenting path in the residual graph is the maximum flow. We repeatedly simulate flow in the graph until we can no longer find an augmenting path, and so, the total flow simulated in the end is the maximum flow.

## Complexity Analysis

The runtime and space complexity of the Ford-Fulkerson method depend heavily on the algorithm used to find the augmented path. We only do constant time **O(1)** operations after finding an augmented path, and so, if we use depth-first or breadth-first search, each such iteration takes **O(N+E)** time, where **N** is the number of nodes and **E** is the number of edges in the graph. In the worst case, each iteration will only increase the flow by one, so if the maximum flow in a graph is **F**, the worst-case runtime complexity is **O(F\*(N+E))**. In the best case, we may find the max flow in the first iteration, so the best-case time complexity is **O(N+E)**.

In any case, we create a two-dimensional array of size **NxN** to store the residual graph through all the iterations, and so the space complexity is **O(N^2)**.

> **Best Case**
>
> -   Space Complexity - **O(N^2)**
> -   Time Complexity - **O(N+E)**
>
> **Worst Case**
>
> -   Space Complexity - **O(N^2)**
> -   Time Complexity - **O(F\*(N+E))**

***

# Understanding reverse edges in Ford-Fulkerson method

The Ford-Fulkerson method to find the maximum flow in a graph makes use of reverse edges when simulating flow in the graph. The reverse edges are crucial as they allow reducing already simulated flow in some edges if more total flow can be simulated in the graph as a result. Let's look at an example to understand it better. Given below is a flow graph and the maximum flow that can flow through it.

// Diagram: A flow network and the maximum flow through it.

In every iteration of the Ford-Fulkerson method, we try to find an augmenting path in the residual graph. It is important to note that while there may be multiple augmenting paths, we choose the first one we find. We call this path `p1`.

// Diagram: We chose one of many augmenting paths and call it p1.

This is a greedy approach as we may end up choosing a path that does not maximise the flow in the graph. To simulate the flow, we find the minimum capacity of all edges in the path and reduce it from the capacity of all edges. In our example, this results in the edge between node `a` and  node `b` having 0 capacity, which blocks us from utilising the remaining edges that can carry more flow from source to sink.

// Diagram: Simulate flow in the residual graph by reducing the minimum capacity in the augmenting path from all edges in the path.

Also, it is important to note that the resulting graph is **not** the residual graph for the next iteration yet. A residual graph, by definition, is a graph where the edges denote the remaining capacity of an edge in the corresponding flow network. 

However, since the edges in the previous augmenting path are now carrying some flow, the flow in those edges can also be reduced to create capacity in reverse. To account for that, every time we reduce the capacity of a real edge to simulate flow, we must also add a reverse edge with the same capacity. This gives us the residual graph for the next iteration.

// Diagram: Add reverse edges with the same capacity as simulated flow to get the residual graph for the next iteration.

Now, in the next iteration, when we find another augmenting path again, say we chose the path that goes through the reverse edge. We call the path `p2`.

// Diagram: The augmenting path for the next iteration has a reverse edge.

We simulate the flow again in the augmenting path, the same way, by reducing the minimum capacity from the capacity of all edges.

// Diagram: Simulate flow in the residual graph by reducing the minimum capacity in the augmenting path from all edges in the path.

Note, however, that the flow simulated in reverse edges means reducing the active flow of the real edge between the nodes by the same amount. Since a reverse edge is only added when we simulate flow in a real edge, it is guaranteed that every reverse edge will have a corresponding real edge with the simulated flow in it equal to or greater than the capacity of the reverse edge

// Diagram: Flow in a reverse edge means reduced flow in the corresponding real edge.

Note that the reduced flow between node `a` and `b` does not affect the total flow simulated in the graph. This is because the reduced flow is simply reoriented to a different path. The flow that was going from node `a` to node `b` through `p1` is now redirected to the sink following the segment of `p2` outwards from node `a`. Similarly, the flow that was earlier received by node `b` from node `a` through `p1` is compensated by the flow simulated in `p2` .

This effectively rebalances the flow between both paths to reach the optimal solution for the entire graph.

// Diagram: Reorienting the flow between the paths p1 and p2.

Without the reverse edges, the augmenting path finding algorithm only looks for the remaining capacity of edges to find a path. However, with reverse edges, it can also look for paths that may exist if the flow in some edges is reduced. The reduced flow is compensated by reorienting the incoming flow from the old and new paths, having a net zero effect on the total flow currently simulated. This way, a previous incorrect decision does not block the algorithm from finding an optimal solution it can rectify decisions in the next iterations.

***

# Find maximum flow

## Problem Statement

Given a **weighted** **directed graph** represented as an adjacency list, and two nodes, **source** and **sink**, write a function to find the maximum flow between the source and sink nodes in the graph using the capacities of the edges.

The graph is given as follows: `graph[i]` is a list of pairs `[neighbour, capacity]`, where each pair indicates a directed edge from node `i` to the node neighbour with the specified capacity.

In a flow network, every edge has a flow capacity, and the maximum flow of a path can't exceed the flow capacity of an edge in the path.

### Example 1

> -   **Input:** graph = \[\[\[1,1\]\], \[\[4,5\]\], \[\[1,2\]\], \[\[1,3\]\], \[\]\], source = 0, sink = 4
> -   **Output:** 1
> -   **Explanation:** Only 1 unit can flow from the network 0->1->4.

### Example 2

> -   **Input:** graph = \[\[\[1, 8\], \[2, 10\]\], \[\], \[\[3, 3\]\], \[\[1, 2\]\]\], source = 0, sink = 1
> -   **Output:** 10
> -   **Explanation:** A total of 10 units can flow from the network, 8 units through the nodes 0->1 and 2 units through nodes 0->2->3->1.

## Solution

```cpp
#include <climits>
#include <unordered_set>

using namespace std;

class Solution {
public:
    bool dfs(
        vector<vector<int>> &residualGraph,
        unordered_set<int> &visited,
        vector<int> &path,
        int node,
        int sink
    ) {

        // Mark the current node as visited in the graph to avoid
        // visiting it again
        visited.insert(node);

        // Add the current node to the path
        path.push_back(node);

        // If the current node is the sink, return true
        if (node == sink) {
            return true;
        }

        // Explore all neighbours of the current node
        for (int neighbour = 0; neighbour < residualGraph.size();
             ++neighbour) {

            // If the neighbour is not visited and has a positive
            // capacity in the residual graph, recursively call DFS
            if (visited.find(neighbour) == visited.end() &&
                residualGraph[node][neighbour] > 0) {

                // If the DFS call returns true, propagate the result
                // back to the previous call
                if (dfs(residualGraph, visited, path, neighbour, sink)) {
                    return true;
                }
            }
        }

        // If no path to the sink is found, remove the current node
        // from the path
        path.pop_back();

        // If no path to the sink is found from this node, backtrack
        return false;
    }

    int maximumFlow(
        vector<vector<pair<int, int>>> &graph,
        int source,
        int sink
    ) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return 0
        if (N == 0) {
            return 0;
        }

        // Create a residual graph and initialize it with the original
        // capacities
        vector<vector<int>> residualGraph(N, vector<int>(N, 0));
        for (int node = 0; node < N; ++node) {
            for (auto &[neighbour, capacity] : graph[node])
                residualGraph[node][neighbour] = capacity;
        }

        // Initialize the maximum flow
        int maxFlow = 0;

        // Find augmenting paths in the residual graph using
        // Depth-First Search
        while (true) {

            // Create a set to keep track of visited nodes
            unordered_set<int> visited;

            // Vector to store the path from source to sink
            vector<int> path;

            // If no more augmenting paths exist, break
            if (!dfs(residualGraph, visited, path, source, sink)) {
                break;
            }

            // Find the minimum capacity along the augmenting path
            int pathFlow = INT_MAX;
            for (int i = 0; i < path.size() - 1; ++i) {
                int u = path[i];
                int v = path[i + 1];
                pathFlow = min(pathFlow, residualGraph[u][v]);
            }

            // Update the residual capacities and reverse edges along the
            // augmenting path
            for (int i = 0; i < path.size() - 1; ++i) {
                int u = path[i];
                int v = path[i + 1];
                residualGraph[u][v] -= pathFlow;
                residualGraph[v][u] += pathFlow;
            }

            // Add the path flow to the maximum flow
            maxFlow += pathFlow;
        }

        return maxFlow;
    }
};
```
