# Maximum bipartite matching

## Table of Contents

1. [Understanding maximum bipartite matching problem](#understanding-maximum-bipartite-matching-problem)
2. [Understanding the solution to maximum bipartite matching](#understanding-the-solution-to-maximum-bipartite-matching-problem)
3. [Maximum bipartite matching](#maximum-bipartite-matching)
4. [Maximum bipartite matching II](#maximum-bipartite-matching-ii)

***

# Understanding maximum bipartite matching problem

A bipartite graph is a graph whose nodes can be divided into two disjoint sets, L and R, so all edges connect nodes from one set to another. Bipartite graphs arise naturally when we try to model relationships between two different classes of objects, and their structured nature allows us to model many real-life problems using them. They are most commonly used in optimization problems where we want to maximize fixed resource usage among some users.

// Diagram: An example bipartite graph.

Now that we know what a bipartite graph is let's look at some terminologies to help us understand the maximum bipartite matching problem.

## Matching in bipartite graphs

Consider a bipartite graph where nodes are divided into disjoint sets, L and R connected by some edges. A matching in the graph is defined as a subset of edges such that all nodes have **at most** one edge incident on them. Conversely, matching is a subset of edges where no two edges share the same node. A matching in the bipartite graph can leave some nodes with no edges incident on them, but it cannot have more than one edge incident on any node.

Naturally, a bipartite graph can have multiple matching. The number of edges in the matching is also called the cardinality of the matching. Consider a bipartite graph below and all its matching.

// Diagram: All matchings for a bipartite graph along with their cardinality.

A maximum matching in a bipartite graph is a matching with a maximum number of edges. Meaning it is the matching with the maximum cardinality. A bipartite graph can have multiple maximum matchings since there can be multiple matchings with the same cardinality. Consider the example below.

// Diagram: The maximum matchings for a bipartite graph.

The maximum bipartite matching problem is finding the maximum matching in a bipartite graph. It is a very important optimization problem, and many real-life problems can be modeled as maximum bipartite matching.

## Matching applicants and jobs

Consider a fixed number of job applicants and some jobs that they are qualified for, where an applicant may be qualified for more than one job. This relationship can be modeled as a bipartite graph where one set of nodes represents the job applicants, and the other set represents the jobs. We create an edge between the applicant and the jobs they are qualified for.In this case, a maximal matching would assign jobs to qualified employees, ensuring that the maximum number of jobs are assigned considering all the constraints.

// Diagram: A bipartite graph representing qualified applicants and jobs.

## College assignment

Consider an example of many college applicants qualifying to apply to many colleges across the country, and every candidate can choose more than one college as their preference. This relationship can be modeled as a bipartite graph where one set of nodes represents the college applicants, and the other set represents the colleges. We create an edge between the applicant and a college they have listed as their preference. In this case, a maximal matching would assign colleges to applicants, ensuring that the maximum number of students are assigned a college in their preference list.

// Diagram: A bipartite graph representing college applicants and colleges.

## Taxi assignment

Consider a taxi company that operates many taxis throughout the country via an app and customers who call for a cab through it. At any time, many customers may request a taxi. However, based on their location and availability, only some taxis may be available for each customer. The taxi company has to assign taxis to customers so that maximum customers get a taxi.

This problem can be modeled as a bipartite graph, with one set of nodes representing the customers and the other set representing the taxis. We create an edge between a customer and a taxi if that taxi can be assigned to the customer. The maximum matching to the graph in this case would be the maximum number of taxies that can be assigned.

// Diagram: A bipartite graph representing customers and taxis.

Many more real-life problems can be modeled as bipartite graphs where the maximum matching ensures the maximum utilization of a fixed number of resources under some constraints. And so, we need an algorithm to solve the maximum bipartite matching efficiently.

***

# Understanding the solution to maximum bipartite matching problem

The maximum bipartite matching problem can be solved by converting it into a maximum flow problem. To solve the problem, we create the corresponding flow network for the bipartite graph and run an algorithm to find the maximum flow in the flow network. The maximum flow in the flow network is the maximum matching of the bipartite graph. We will prove this later in the course.

Consider a bipartite graph with nodes separated in two disjoint sets, `L` and `R`, with some edges connecting nodes in these sets.

// Diagram: An example bipartite graph.

## Algorithm

The first step in solving the maximum bipartite matching problem is to create the corresponding flow network of the bipartite graph. We define a corresponding flow network for the graph by adding a source and sink node, where the source has a directed edge towards all nodes in the set `L`, edges between nodes in the sets `L` and `R` are converted to directed edges, and all nodes in the set `R` have a directed edge towards the sink. All edges in the flow network are set to have a capacity of 1 unit.

// Diagram: The corresponding flow network of the example bipartite graph.

The next step is to find the maximum flow in the flow network as that will also be the maximum matching of the bipartite graph. We can find the maximum flow using any algorithm; however, in this lesson, we will use the Ford-Fulkerson method that we learnt earlier in the course.

The Ford-Fulkerson method is already explained in an earlier lesson and so we don't repeat it in this section.

The steps below summarize the algorithm to find the maximum bipartite matching using the Ford-Fulkerson method.

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
>
> **maximumBipartiteMatching(\[ref\] graph, \[ref\] left, \[ref\] right)**
>
> -   **Step 1:** Create a two-dimensional list of pairs \`flowGraph\` with the same size as \`graph\`
> -   **Step 2:** Iterate in \`graph\` using a variable \`node\` and do the following:
>     -   **Step 2.1:** Iterate in \`graph\[node\]\` using a variable \`neighbur\` and do the following:
>         -   **Step 2.1.1:** Append a pair \`(neighbour, 1)\` to \`flowGraph\[node\]\`
> -   **Step 3:** Set a variable \`source\` to the size \`flowGraph\` and append an empty list of pairs at the end of \`flowGraph\`
> -   **Step 4:** Iterate in the list \`left\` using a variable \`node\` and do the following:
>     -   **Step 4.1:** Append a pair \`(node, 1)\` to \`flowGraph\[source\]\`
> -   **Step 5:** Set a variable \`sink\` to the size \`flowGraph\` and append an empty list of piars at the end of \`flowGraph\`
> -   **Step 6:** Iterate in the list \`right\` using a variable \`node\` and do the following:
>     -   **Step 6.1:** Append a pair \`(sink, 1)\` to \`flowGraph\[node\]\`
> -   **Step 7:** Set a varible \`maxMatching\` as the return value of call to \`fordFulkersonMethod(\[ref\] flowGraph, source, sink)\`
> -   **Step 8:** Return \`maxMatching\`

## Implementation

Consider that we have a bipartite graph of **N** nodes, where the nodes are enumerated from **0** to **N-1**, and we are given the adjacency list of the graph as a two-dimensional list`graph`. We are also given two lists, `left` and `right`, containing the nodes in the left and right disjoint sets.

We create the corresponding `flowGraph` as a two-dimensional list of pairs where the first item in the pair is the enumeration of the neighbouring node, and the second item is the weight (capacity) of the edge. We then copy all the edges from `graph` in `flowGraph` with a capacity 1. We also create a `source` and a `sink` node in the `flowGraph` and connect them to the respective nodes in the `left` and `right` sets.

We then run the Ford-Fulkerson method on the `flowGraph` to find the maximum flow from the `source` node to the `sink` node and return the result as the maximum matching.

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

// Diagram: int maximumBipartiteMatching(vector<vector<int>> &graph, vector<int>& left, vector<int>& right) {

// Diagram: vector<vector<pair<int, int>>> flowGraph(graph.size());

        // Copy the connections from the input graph
        // to the flow graph with caapacity 1
        for(int node = 0; node < graph.size(); ++node) {
            for(int neighbour = 0; neighbour < graph[node].size(); ++neighbour) {
                flowGraph[node].push_back({graph[node][neighbour], 1});
            }

        // Get the index of the source node that will be added later
        int source = flowGraph.size();
        flowGraph.push_back({}); // Add the source node

        // Connect the source node to all nodes
        // in the left partition with capacity 1
        for (int node : left) {
            flowGraph[source].push_back({node, 1});
        }

        // Get the index of the sink node that will be added later
        int sink = flowGraph.size();
        flowGraph.push_back({}); // Add the sink node

        // Connect all nodes in the right partition
        // to the sink node with capacity 1
        for (int node : right) {
            flowGraph[node].push_back({sink, 1});
        }

        // Call the Ford-Fulkerson maximum flow function to compute the
        // result
        return maximumFlow(flowGraph, source, sink);
    }
};
```

Java

```java
import java.util.*;

// Diagram: class Solution {

    boolean dfs(
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
        for (int neighbour = 0; neighbour < residualGraph.length; ++neighbour) {

            // If the neighbour is not visited and has a positive
            // capacity in the residual graph, recursively call DFS
            if (!visited.contains(neighbour) &&
                residualGraph[node][neighbour] > 0) {

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

    int maximumFlow(
        List<List<int[]>> graph,
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
            for (int[] edge : graph.get(node)) {
                int neighbour = edge[0];
                int capacity = edge[1];
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

// Diagram: int maximumBipartiteMatching(List<List<Integer>> graph, List<Integer> left, List<Integer> right) {

// Diagram: List<List<int[]>> flowGraph = new ArrayList<>();

        for (int i = 0; i < graph.size(); ++i) {
            flowGraph.add(new ArrayList<>());
        }

        // Copy the connections from the input graph
        // to the flow graph with capacity 1
        for (int node = 0; node < graph.size(); ++node) {
            for (int neighbour : graph.get(node)) {
                flowGraph.get(node).add(new int[]{neighbour, 1});
            }

        // Get the index of the source node that will be added later
        int source = flowGraph.size();
        flowGraph.add(new ArrayList<>()); // Add the source node

        // Connect the source node to all nodes
        // in the left partition with capacity 1
        for (int node : left) {
            flowGraph.get(source).add(new int[]{node, 1});
        }

        // Get the index of the sink node that will be added later
        int sink = flowGraph.size();
        flowGraph.add(new ArrayList<>()); // Add the sink node

        // Connect all nodes in the right partition
        // to the sink node with capacity 1
        for (int node : right) {
            flowGraph.get(node).add(new int[]{sink, 1});
        }

        // Call the Ford-Fulkerson maximum flow function to compute the
        // result
        return maximumFlow(flowGraph, source, sink);
    }
```

Typescript

```typescript
type Pair = [number, number];

class Solution {
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
        for (let neighbour = 0; neighbour < residualGraph.length; ++neighbour) {

            // If the neighbour is not visited and has a positive
            // capacity in the residual graph, recursively call DFS
            if (!visited.has(neighbour) && residualGraph[node][neighbour] > 0) {

                // If the DFS call returns true, propagate the result
                // back to the previous call
                if (this.dfs(residualGraph, visited, path, neighbour, sink)) {
                    return true;
                }

        // If no path to the sink is found, remove the current node
        // from the path
        path.pop();

        // If no path to the sink is found from this node, backtrack
        return false;
    }

    maximumFlow(
        graph: Pair[][],
        source: number,
        sink: number
    ): number {

        // Number of nodes in the graph
        const N = graph.length;

        // If the graph is empty, return 0
        if (N === 0) {
            return 0;
        }

        // Create a residual graph and initialize it with the original
        // capacities
        const residualGraph: number[][] = Array.from({ length: N }, () =>
            Array(N).fill(0)
        );

        for (let node = 0; node < N; ++node) {
            for (const [neighbour, capacity] of graph[node]) {
                residualGraph[node][neighbour] = capacity;
            }

        // Initialize the maximum flow
        let maxFlow = 0;

        // Find augmenting paths in the residual graph using
        // Depth-First Search
        while (true) {

            // Create a set to keep track of visited nodes
            const visited = new Set<number>();

            // Vector to store the path from source to sink
            const path: number[] = [];

            // If no more augmenting paths exist, break
            if (!this.dfs(residualGraph, visited, path, source, sink)) {
                break;
            }

            // Find the minimum capacity along the augmenting path
            let pathFlow = Number.MAX_SAFE_INTEGER;
            for (let i = 0; i < path.length - 1; ++i) {
                const u = path[i];
                const v = path[i + 1];
                pathFlow = Math.min(pathFlow, residualGraph[u][v]);
            }

            // Update the residual capacities and reverse edges along the
            // augmenting path
            for (let i = 0; i < path.length - 1; ++i) {
                const u = path[i];
                const v = path[i + 1];
                residualGraph[u][v] -= pathFlow;
                residualGraph[v][u] += pathFlow;
            }

            // Add the path flow to the maximum flow
            maxFlow += pathFlow;
        }

        return maxFlow;
    }

    maximumBipartiteMatching(
        graph: number[][],
        left: number[],
        right: number[]
    ): number {

// Diagram: const flowGraph: Pair[][] = Array.from({ length: graph.length }, () => []);

        // Copy the connections from the input graph
        // to the flow graph with caapacity 1
        for (let node = 0; node < graph.length; ++node) {
            for (let neighbour = 0; neighbour < graph[node].length; ++neighbour) {
                flowGraph[node].push([graph[node][neighbour], 1]);
            }

        // Get the index of the source node that will be added later
        const source = flowGraph.length;
        flowGraph.push([]); // Add the source node

        // Connect the source node to all nodes
        // in the left partition with capacity 1
        for (const node of left) {
            flowGraph[source].push([node, 1]);
        }

        // Get the index of the sink node that will be added later
        const sink = flowGraph.length;
        flowGraph.push([]); // Add the sink node

        // Connect all nodes in the right partition
        // to the sink node with capacity 1
        for (const node of right) {
            flowGraph[node].push([sink, 1]);
        }

        // Call the Ford-Fulkerson maximum flow function to compute the
        // result
        return this.maximumFlow(flowGraph, source, sink);
    }
```

Javascript

```javascript
class Solution {
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
        for (let neighbour = 0; neighbour < residualGraph.length; ++neighbour) {

            // If the neighbour is not visited and has a positive
            // capacity in the residual graph, recursively call DFS
            if (!visited.has(neighbour) && residualGraph[node][neighbour] > 0) {

                // If the DFS call returns true, propagate the result
                // back to the previous call
                if (this.dfs(residualGraph, visited, path, neighbour, sink)) {
                    return true;
                }

        // If no path to the sink is found, remove the current node
        // from the path
        path.pop();

        // If no path to the sink is found from this node, backtrack
        return false;
    }

    maximumFlow(graph, source, sink) {
        // Number of nodes in the graph
        const N = graph.length;

        // If the graph is empty, return 0
        if (N === 0) {
            return 0;
        }

        // Create a residual graph and initialize it with the original
        // capacities
        const residualGraph = Array.from({ length: N }, () =>
            Array(N).fill(0)
        );

        for (let node = 0; node < N; ++node) {
            for (const [neighbour, capacity] of graph[node]) {
                residualGraph[node][neighbour] = capacity;
            }

        // Initialize the maximum flow
        let maxFlow = 0;

        // Find augmenting paths in the residual graph using
        // Depth-First Search
        while (true) {

            // Create a set to keep track of visited nodes
            const visited = new Set();

            // Vector to store the path from source to sink
            const path = [];

            // If no more augmenting paths exist, break
            if (!this.dfs(residualGraph, visited, path, source, sink)) {
                break;
            }

            // Find the minimum capacity along the augmenting path
            let pathFlow = Number.MAX_SAFE_INTEGER;
            for (let i = 0; i < path.length - 1; ++i) {
                const u = path[i];
                const v = path[i + 1];
                pathFlow = Math.min(pathFlow, residualGraph[u][v]);
            }

            // Update the residual capacities and reverse edges along the
            // augmenting path
            for (let i = 0; i < path.length - 1; ++i) {
                const u = path[i];
                const v = path[i + 1];
                residualGraph[u][v] -= pathFlow;
                residualGraph[v][u] += pathFlow;
            }

            // Add the path flow to the maximum flow
            maxFlow += pathFlow;
        }

        return maxFlow;
    }

    maximumBipartiteMatching(graph, left, right) {
        const flowGraph = Array.from({ length: graph.length }, () => []);

        // Copy the connections from the input graph
        // to the flow graph with caapacity 1
        for (let node = 0; node < graph.length; ++node) {
            for (let neighbour = 0; neighbour < graph[node].length; ++neighbour) {
                flowGraph[node].push([graph[node][neighbour], 1]);
            }

        // Get the index of the source node that will be added later
        const source = flowGraph.length;
        flowGraph.push([]); // Add the source node

        // Connect the source node to all nodes
        // in the left partition with capacity 1
        for (const node of left) {
            flowGraph[source].push([node, 1]);
        }

        // Get the index of the sink node that will be added later
        const sink = flowGraph.length;
        flowGraph.push([]); // Add the sink node

        // Connect all nodes in the right partition
        // to the sink node with capacity 1
        for (const node of right) {
            flowGraph[node].push([sink, 1]);
        }

        // Call the Ford-Fulkerson maximum flow function to compute the
        // result
        return this.maximumFlow(flowGraph, source, sink);
    }
```

Python

```python
from typing import Set, Tuple

class Solution:
    def dfs(
        self,
        residual_graph: list[list[int]],
        visited: Set[int],
        path: list[int],
        node: int,
        sink: int
    ) -> bool:

        # Mark the current node as visited in the graph to avoid
        # visiting it again
        visited.add(node)

        # Add the current node to the path
        path.append(node)

        # If the current node is the sink, return true
        if node == sink:
            return True

        # Explore all neighbours of the current node
        for neighbour in range(len(residual_graph)):

            # If the neighbour is not visited and has a positive
            # capacity in the residual graph, recursively call DFS
            if neighbour not in visited and residual_graph[node][neighbour] > 0:

                # If the DFS call returns true, propagate the result
                # back to the previous call
                if self.dfs(residual_graph, visited, path, neighbour, sink):
                    return True

        # If no path to the sink is found, remove the current node
        # from the path
        path.pop()

        # If no path to the sink is found from this node, backtrack
        return False

    def maximum_flow(
        self,
        graph: list[list[Tuple[int, int]]],
        source: int,
        sink: int
    ) -> int:

        # Number of nodes in the graph
        n = len(graph)

        # If the graph is empty, return 0
        if n == 0:
            return 0

        # Create a residual graph and initialize it with the original
        # capacities
        residual_graph = [[0 for _ in range(n)] for _ in range(n)]
        for node in range(n):
            for neighbour, capacity in graph[node]:
                residual_graph[node][neighbour] = capacity

        # Initialize the maximum flow
        max_flow = 0

        # Find augmenting paths in the residual graph using
        # Depth-First Search
        while True:

            # Create a set to keep track of visited nodes
            visited: Set[int] = set()

            # Vector to store the path from source to sink
            path: list[int] = []

            # If no more augmenting paths exist, break
            if not self.dfs(residual_graph, visited, path, source, sink):
                break

            # Find the minimum capacity along the augmenting path
            path_flow = float('inf')
            for i in range(len(path) - 1):
                u = path[i]
                v = path[i + 1]
                path_flow = min(path_flow, residual_graph[u][v])

            # Update the residual capacities and reverse edges along the
            # augmenting path
            for i in range(len(path) - 1):
                u = path[i]
                v = path[i + 1]
                residual_graph[u][v] -= path_flow
                residual_graph[v][u] += path_flow

            # Add the path flow to the maximum flow
            max_flow += path_flow

// Diagram: return maxflow

    def maximum_bipartite_matching(
        self,
        graph: list[list[int]],
        left: list[int],
        right: list[int]
    ) -> int:

// Diagram: flowgraph: list[list[Tuple[int, int]]] = [[] for in range(len(graph))]

        # Copy the connections from the input graph
        # to the flow graph with caapacity 1
        for node in range(len(graph)):
            for neighbour in graph[node]:
                flow_graph[node].append((neighbour, 1))

        # Get the index of the source node that will be added later
        source = len(flow_graph)
        flow_graph.append([])  # Add the source node

        # Connect the source node to all nodes
        # in the left partition with capacity 1
        for node in left:
            flow_graph[source].append((node, 1))

        # Get the index of the sink node that will be added later
        sink = len(flow_graph)
        flow_graph.append([])  # Add the sink node

        # Connect all nodes in the right partition
        # to the sink node with capacity 1
        for node in right:
            flow_graph[node].append((sink, 1))

        # Call the Ford-Fulkerson maximum flow function to compute the
        # result
        return self.maximum_flow(flow_graph, source, sink)
```

## Proof of correctness

We can prove that every matching in a bipartite graph corresponds to an integer-valued flow in its corresponding flow network. This is because for any matching `M`, for all pairs of node (`u`, `v`) that are matched, we can set the `flow(source, u) = flow(u, v) = flow(v, sink) = 1`. For all the other nodes `u'` and `v'` in `L` and `R` that have directed edges between them in the flow network, we can set `flow(s, u') = flow(u', v') = flow(v', t) = 0`. Also, the cardinality of matching equals the flow.

// Diagram: Every matching in a bipartite graph is an integer valued flow in its corresponding flow network.

The converse of this is also true, meaning every integer-valued flow in the corresponding flow network of a bipartite graph can be converted to a matching in the bipartite graph. For any flow `f` in the corresponding flow network, the set `L` and `R`, along with the source and sink node, form a `cut(S, T)` in the flow network such that `S = L U source` and `T = R U sink`.

// Diagram: A cut in the flow network with the source and left nodes on one side and the sink and right nodes on the other side.

From the max-flow min-cut theorem, we know that for flow `f` in a flow network, the net flow from `S` to `T` in any `cut(S, T)` equals the flow `f`. And since all edges between `S` and `T` in the corresponding flow network have unit capacity, the flow `f` is equal to the number of edges carrying the flow between `L` and `R` which equals the cardinality of matching in the corresponding bipartite graph.

// Diagram: Every integer valued flow in the corresponding flow network is a mapping in the bipartite graph.

This proves that for a bipartite graph, the flow in its corresponding flow network is the same as the cardinality of its matching. Hence, the maximum flow in the corresponding flow network is the cardinality of maximum matching in the bipartite graph.

## Complexity analysis

We convert the maximum matching problem to a maximum flow problem and solve it using an algorithm to find the maximum flow. So, the algorithm's runtime and space complexity are the same as those of the maximum flow algorithm used. Since we use the Ford-Fulkerson method with depth-first search, the worst-case runtime complexity is **O(F\*(N + E))** while the best case is **O(N + E)** where **F** is the maximum flow, **N** is the total number of nodes, and **E** is the number of edges in the bipartite graph.

In any case, we create a two-dimensional array of size**NxN**to store the residual graph through all the iterations, and so the space complexity is**O(N^2)**.

The space complexity is also the same as the Ford-Fulkerson method with depth-first search, which is **O(N^2)** for creating the two-dimensional array for storing the residual graph.

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

# Maximum bipartite matching

## Problem Statement

Given an **undirected** **bipartite** **graph**, represented as an adjacency list and two lists, **left** and **right**, containing the nodes of the two disjoint partitions of the graph. Write a function to find and return the maximum matching of this graph.

The graph is given as follows: `graph[i]` is a list of all nodes you can visit from node `i` (i.e., there is a directed edge from node `i` to node `graph[i][j]`).

A matching in this bipartite graph is a set of edges chosen so that no two edges share a vertex. The maximum matching is a matching of the largest possible size, meaning it contains the greatest number of edges such that no two edges conflict by sharing vertices.

### Example 1

> -   **Input:** matrix = \[\[4\], \[5\], \[6\], \[7\], \[0\], \[1\], \[2\], \[3\]\], left = \[0, 1, 2, 3\], right = \[4, 5, 6, 7\]
> -   **Output:** 4
> -   **Explanation:** The maximum matching for the above graph is 4.

### Example 2

> -   **Input:** matrix = \[\[4, 5\], \[5\], \[6\], \[4, 6\], \[0, 3\], \[0, 1\], \[2, 3\], \[\]\], left = \[0, 1, 2, 3\], right = \[4, 5, 6, 7\]
> -   **Output:** 3
> -   **Explanation:** The maximum matching for the above graph is 3.

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

    int maximumBipartiteMatching(
        vector<vector<int>> &graph,
        vector<int> &left,
        vector<int> &right
    ) {

        vector<vector<pair<int, int>>> flowGraph(graph.size());

        // Copy the connections from the input graph to the flow graph
        // with capacity 1
        for (int node = 0; node < graph.size(); ++node) {
            for (int neighbour = 0; neighbour < graph[node].size();
                 ++neighbour) {
                flowGraph[node].push_back({graph[node][neighbour], 1});
            }
        }

        // Get the index of the source node
        int source = flowGraph.size();

        // Add the source node to the flow graph
        flowGraph.push_back({});

        // Connect the source node to all nodes in the left partition
        // with capacity 1
        for (int node : left) {
            flowGraph[source].push_back({node, 1});
        }

        // Get the index of the sink node
        int sink = flowGraph.size();

        // Add the sink node to the flow graph
        flowGraph.push_back({});

        // Connect all nodes in the right partition
        // to the sink node with capacity 1
        for (int node : right) {
            flowGraph[node].push_back({sink, 1});
        }

        // Call the Ford-Fulkerson maximum flow function to compute the
        // result
        return maximumFlow(flowGraph, source, sink);
    }
};
```

***

# Maximum bipartite matching II

## Problem Statement

Given an **NxM** **matrix** filled with values that are either `0`, or `1` where N denotes the number of applicants and M denotes the number of jobs, write a function to find and return the maximum number of applicants who can get a job.

> You must abide by the following constraints:
>
> -   A value of 1 in a cell \`matrix\[i\]\[j\]\` signifies that the applicant \`i\` is interested in the job \`j\`.
> -   Each job can be assigned to **at most one** applicant, and each applicant can be assigned to **at most one** job.

### Example 1

> -   **Input:** matrix = \[\[1, 0\], \[0, 1\]\]
> -   **Output:** 2
> -   **Explanation:** Both the applicants can get a job.

### Example 2

> -   **Input:** graph = \[\[1, 0, 1\], \[0, 1, 0\], \[1, 1, 1\], \[0, 0, 1\]\]
> -   **Output:** 3
> -   **Explanation:** Only 3 applicants out of 4 can get a job.

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

    int maximumBipartiteMatchingII(vector<vector<int>> &matrix) {

        // Number of applicants
        int numApplicants = matrix.size();

        // Number of jobs
        int numJobs = (numApplicants > 0) ? matrix[0].size() : 0;

        // Left set (applicants): [0..numApplicants-1]
        // Right set (jobs): [numApplicants..numApplicants+numJobs-1]
        vector<vector<pair<int, int>>> flowGraph(
            numApplicants + numJobs
        );

        // Connect applicant nodes to job nodes where matrix[i][j] == 1
        for (int applicant = 0; applicant < numApplicants; ++applicant) {
            for (int job = 0; job < numJobs; ++job) {
                if (matrix[applicant][job] == 1) {
                    flowGraph[applicant].push_back(
                        {numApplicants + job, 1}
                    );
                }
            }
        }

        // Get the index of the source node
        int source = flowGraph.size();

        // Add the source node to the flow graph
        flowGraph.push_back({});

        // Connect the source node to each applicant node with capacity 1
        for (int applicant = 0; applicant < numApplicants; ++applicant) {
            flowGraph[source].push_back({applicant, 1});
        }

        // Get the index of the sink node
        int sink = flowGraph.size();

        // Add the sink node to the flow graph
        flowGraph.push_back({});

        // Connect each job node to the sink node with capacity 1
        for (int job = 0; job < numJobs; ++job) {
            flowGraph[numApplicants + job].push_back({sink, 1});
        }

        // Call the Ford-Fulkerson maximum flow function to compute the
        // result
        return maximumFlow(flowGraph, source, sink);
    }
};
```
