# Pattern: Two colouring

## Table of Contents

1. [Understanding the two coloring pattern](#pattern-two-colouring)
2. [Identifying the two coloring pattern](#pattern-two-colouring)
3. [Two colourable](#two-colourable)
4. [Dislike pairs](#dislike-pairs)
5. [Colour repair](#colour-repair)
6. [Group colourable](#group-colourable)

***

# Understanding the two colouring pattern

Graph colouring is the assignment of labels to elements of a graph where the assignment is subject to certain constraints. Vertex colouring is a subset of graph colouring problems where the nodes of the graph must be coloured such that no two adjacent nodes have the same colour. The two-colouring, as the name suggests, is a vertex colouring problem where we only have two colours, and we need to determine if colours can be assigned to the nodes of the graph such that adjacent nodes have different colours. 

In this course, we will only learn about solving the two-colouring problem for an **undirected** graph. All references to a graph in this lesson mean an undirected graph. Two-colouring a directed graph is a hard problem beyond the scope of this course.

The two colouring pattern is a classification of two-colouring problem on a graph that can be solved using the two-colouring technique.

// Diagram: A two-colourable undirected graph.

In this lesson, we will learn more about using graph traversal algorithms to solve the two-colouring problem in an undirected graph, and how to identify a problem as a two-colouring pattern problem.

## Equivalence of two-colourable and bipartite graphs

It is important to note that every graph that is two-colourable can be rearranged as a bipartite graph. This is because we can arrange the nodes of the same colour in a set, creating two disjoint sets. Since no two adjacent nodes in a two-colourable graph can have the same colour, in the rearranged graph, there will be no edge between nodes of the same set, making it a bipartite graph.

// Diagram: Every two-colourable graph is a bipartite graph

// Diagram: Every two-colourable graph is a bipartite graph.

The converse of this is also true, meaning every bipartite graph is two-colourable. This is because we can assign two different colours to the nodes in the two disjoint sets, and no two adjacent nodes will have the same colour, making it two colourable.

Every bipartite graph is two-colourable.

// Diagram: Every bipartite graph is two-colourable.

## The two colouring technique

Consider we are given a graph and we need to find if its nodes can be coloured in such a way that no adjacent nodes have the same colour, where we can only use two colours.

// Diagram: Check if the graph is two-colourale or not.

We can solve the problem using any graph traversal algorithm, but we will use depth-first traversal in this explanation as it has a simple recursive implementation.

We start by creating a `colour` map to store the colour of each node, where we store 1 for the first colour and -1 for the second colour. We use 1 and -1 as colours as we can easily flip between them using a negation (-) sign. The map is initially empty, and as we will see later, it also serves the purpose of the `visited` set, so we don't need to create it separately.

// Diagram: Create a map to store colour of each node as 1 or -1.

We then iterate through all the nodes of the graph, and in each iteration, check if the node exists in the `colour` map. If it does, we skip it as it is already visited; otherwise, we call the `colourGraph` function on it, passing the `colour` map and `colourValue` 1.

// Diagram: Iterate through all nodes and check if a node is uncoloured.

The `colourGraph` function is a slightly modified implementation of depth-first traversal that exits if it two adjacent nodes have the same colour. It takes as arguments the current node, `colour` map, and `colourValue` for the current node, where the `colour` map is passed by reference to share the same copy across recursive stack frames. The function returns a boolean value indicating if the connected component of the passed node can be two-coloured or not.

We pass `colour` map by reference so that all recursive function calls share the same copy. For languages that do not support passing data by reference, it can be created in the enclosing scope to make it global for all function calls.

As we enter the node, we set the colour of the current node to `colourValue` in the `colour` map. We then iterate over all the neighbours of the node and check if they are already marked coloured in the `colour` map. If a neighbour is marked coloured with the same colour as in `colourValue`, we terminate and return a `false` value to the parent, as this means the graph cannot be two-coloured. Otherwise, if it is a different colour, we skip the node.

// Diagram: Return false to the parent if a neighbour is marked with the same colour.

If the node is not marked coloured in the `colour` map, we recursively call `colourGraph` on it and pass the negation of `colourValue` (`-colourValue`) as its colour. This process is repeated for all uncoloured neighbours, and if any call to `colourGraph` returns `false`, we terminate further execution and return `false` to the parent, which does the same. If all iterations finish and no call to `colourGraph` on the neighbours returns `false`, we return a `true` value to the parent indicating the connected component of the current node is two-colourable.

// Diagram: Colour all the uncoloured neighbours with the other colour.

This way, at the end of top-level call to `colourGraph`, we get a boolean value indicating if the connected component of the top-level node can be two-coloured or not. If we get a true value, we continue the iteration in the `colour` map and repeat the process for the next uncoloured node. If we receive a `false` value for any call to `colourGraph` we terminate further execution and return `false`, declaring the graph as non two-colourable. Otherwise, if all iterations finish, it means all connected components of the graph are two-colourable. So we return a `true` value indicating the graph is two-colourable, where the `colour` map has colours assigned to each node.

The steps given below summarize the solution to the two-colouring problem in a graph.

> **Algorithm**
>
> **colourGraph(node, \[ref\] graph, \[ref\] colour, colourValue)**
>
> -   **Step 1:** Set \`colour\[node\]\` to \`colourValue\`
> -   **Step 2:** Iterate in all the neighbours of \`node\` in \`neighbour\` and do the following:
>     -   **Step 2.1:** If \`neighbour\` is in \`colour\` and \`colour\[neighbour\]\` is \`colourValue\`, return \`false\` to the parent
>     -   **Step 2.2:** Else if \`neighbour\` is not in \`colour\`:
>         -   **Step 2.2.1:** Call \`colourGraph(neighbour, graph, colour, -colourValue)\` and if its return value is \`false\`, return \`false\` to the parent
> -   **Step 3:** Return \`true\`
>
> **isTwoColourable(\[ref\] graph)**
>
> -   **Step 1:** Create a \`colour\` map
> -   **Step 2:** Iterate in all the nodes of the graph using \`node\` and do the following:
>     -   **Step 2.1:** If \`node\` is not in the \`colour\` map, call \`colourGraph(node, graph, colour, -1)\` and return \`false\` if it returns \`false\`
> -   **Step 3:** Return \`true\`

Let's look at an example to better understand the algorithm.

Check if a graph is two-colourable or not.

## Proof of correctness

It is quite easy to prove that any traversal algorithm that assigns alternate colours to adjacent nodes can determine if a graph is two-colourable or not. We will use depth-first traversal to prove this, but the same can be done with any other traversal algorithm.

Consider a graph that is two-colourable. It is important to note that there can be two solution states for such a graph. The only difference between these states is that the colour of the corresponding nodes in both solutions is flipped.

// Diagram: The two states of a two-colourable graph.

If we start a depth-first traversal from any node and pick any of the two colours, we essentially start from that node in one of the two solution states. Since we use alternate colours for the neighbour node, we eventually colour the entire graph exactly like in the corresponding solution state. To understand this better, consider that we start from node 0 in the following example.

// Diagram: Starting from any node and any colour leads to one of the two final states.

Only graphs that have an odd-length cycle are not two-colourable. This is because if we start from any node in the cycle, choosing any of the two colours, we will eventually reach the same node with a different colour after assigning alternate colours to adjacent nodes in the path.

// Diagram: Odd-length cycles are not two-colourable.

The depth-first traversal, assigning alternate colours to adjacent nodes, will eventually reach a node in the cycle with a colour value and ultimately return to the same node again with a different colour. Since we terminate the traversal when such a condition is met, the algorithm always correctly identifies a graph that is not two-colourable.

Since the algorithm can correctly detect both a two-colourable graph and one that is not two-colourable, it is proven that it is correct in all cases.

## Implementation

Consider that we have a graph of size **N**, where the nodes are enumerated from **0** to **N-1**, and we are given the adjacency list `graph` as a list of integers where the value is the enumeration of the neighbouring node.

To implement the algorithm, we create a `colourGraph` function to traverse a connected component of the graph using depth-first search. We create `colours` map in the calling function `isTwoColourable`, and iterate over all the nodes. For any uncoloured node, we call `colourGraph` passing and `colour` map and `graph` by reference and an initial `colourValue` of 1. For languages that do not support passing data by reference, we can create the variables in the enclosing scope to make them global for all recursive function calls.

C++

```cpp
#include <unordered_map>

// Diagram: using namespace std;

class Solution {
public:
    bool colourGraph(
        vector<vector<int>> &graph,
        int node,
        unordered_map<int, int> &colour,
        int colourValue
    ) {

        // Colour the node with colourValue
        colour[node] = colourValue;

        // Traverse all the neighbours of the current node
        for (int neighbour : graph[node]) {

            // If the neighbour is coloured with the same colour
            // return false
            if (colour.find(neighbour) != colour.end() &&
                colour[neighbour] == colourValue) {
                return false;
            }

            // If the neighbour is not coloured, colour it with the
            // opposite colour and recursively call the function on the
            // neighbour
            else if (colour.find(neighbour) == colour.end()) {

                // If the neighbour is not coloured, colour it with the
                // opposite colour
                if (!colourGraph(
                        graph, neighbour, colour, 1 - colourValue
                    )) {

                    // If the colouring fails, return false
                    // (i.e., if a neighbour has the same colour)
                    return false;
                }

        return true;
    }

// Diagram: bool isTwoColourable(vector<vector<int>> &graph) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return false
        if (N == 0) {
            return false;
        }

        // Create a map to store the colour of each node
        unordered_map<int, int> colour;

        // Traverse all nodes in the graph
        for (int node = 0; node < graph.size(); node++) {

            // If a node is not coloured, start colouring its
            // connected component recursively starting with colour 1
            if (colour.find(node) == colour.end()) {

                // If the colouring fails, return false
                // (i.e., if a neighbour has the same colour)
                if (!colourGraph(graph, node, colour, 1)) {
                    return false;
                }

        // If all nodes are coloured successfully, return true
        return true;
    }
};
```

Java

```java
#include <unordered_map>

// Diagram: using namespace std;

class Solution {
public:
    bool colourGraph(
        vector<vector<int>> &graph,
        int node,
        unordered_map<int, int> &colour,
        int colourValue
    ) {

        // Colour the node with colourValue
        colour[node] = colourValue;

        // Traverse all the neighbours of the current node
        for (int neighbour : graph[node]) {

            // If the neighbour is coloured with the same colour
            // return false
            if (colour.find(neighbour) != colour.end() &&
                colour[neighbour] == colourValue) {
```

Typescript

```typescript
#include <unordered_map>
```

Javascript

```javascript
export class Solution {
    colourGraph(graph, node, colour, colourValue) {

        // Colour the node with colourValue
        colour.set(node, colourValue);

        // Traverse all the neighbours of the current node
        for (const neighbour of graph[node]) {

            // If the neighbour is coloured with the same colour
            // return false
            if (
                colour.has(neighbour) &&
                colour.get(neighbour) === colourValue
            ) {
                return false;
            }

            // If the neighbour is not coloured, colour it with the
            // opposite colour and recursively call the function on the
            // neighbour
            else if (!colour.has(neighbour)) {

                // If the neighbour is not coloured, colour it with the
                // opposite colour
                if (
                    !this.colourGraph(
                        graph,
                        neighbour,
                        colour,
                        1 - colourValue
                    )
                ) {

                    // If the colouring fails, return false
                    // (i.e., if a neighbour has the same colour)
                    return false;
                }

        return true;
    }

// Diagram: isTwoColourable(graph) {

        // Number of nodes in the graph
        const N = graph.length;

        // If the graph is empty, return false
        if (N === 0) {
            return false;
        }

        // Create a map to store the colour of each node
        const colour = new Map();

        // Traverse all nodes in the graph
        for (let node = 0; node < graph.length; node++) {

            // If a node is not coloured, start colouring its
            // connected component recursively starting with colour 1
            if (!colour.has(node)) {

                // If the colouring fails, return false
                // (i.e., if a neighbour has the same colour)
                if (!this.colourGraph(graph, node, colour, 1)) {
                    return false;
                }

        // If all nodes are coloured successfully, return true
        return true;
    }
```

Python

```python
#include <unordered_map>
```

## Complexity Analysis

The two-colouring algorithm utilises the depth-first traversal algorithm to visit every node exactly once in the worst case, resulting in the same worst-case time and space complexity of **O(N + E)** and **O(N)** respectively, where **N** represents the number of nodes and **E** denotes the total number of edges in the graph. The worst case is when the graph is two-colourable, as it can only be confirmed by traversing the entire graph.

// Diagram: The worst case is when the graph is two-colourable.

However, since we abort further traversal and return `false` upon detecting two adjacent nodes with the same colour, the best-case time complexity is **O(1)** when we find a cycle of three nodes and detect it on our first exploration path. Since this also means only three nodes are added to `colour` set, the best case space complexity is also constant **O(1)**.

// Diagram: The best case is when we detect a three-node cycle in the first exploration path.

> **Best Case:** A three-node cycle is detected in the first path.
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case:** The graph is two-colourable.
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N+E)**

***

# Identifying the two colouring pattern

Many graph problems may look completely unrelated at first, but can be reduced to the two-colouring problem. These are generally **medium** problems where we need to find if a graph is two-colourable or not. Since bipartite graphs are equivalent to two-colourable graphs, checking a graph for being bipartite is the same as checking it for two-colourability. In some cases, we may need to make some critical observations to reduce the problem to the two-colouring problem and prove that the solution to the two-colouring problem also solves the original problem. 

If the problem statement or its solution follows the generic template below, it can be solved using the two-colouring technique.

**Template:**Given a graph, find if it is two-colourable or not. Conversely, find if the graph is bipartite or not.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem by reducing it to the two-colouring problem.

> **Problem Statement:** Given a group of people numbered from 0 to N and a list of pairs that represent pairs that dislike each other. Find if these people can be divided into two sets such that no pair in the same set dislike each other.

// Diagram: Can people who dislike each other be separated into two groups?

## Two-colouring reduction

Observing the problem closely, it is easy to see that the group of people can be modelled as nodes of a graph, where an edge between nodes means that the pair dislikes each other. The goal of the problem is to determine if it is possible to split the people (nodes) into two groups such that no two people (nodes) in a group dislike each other (i.e., they don't have an edge between them). This is equivalent to checking if the modelled graph is bipartite, which is equivalent to checking if it is two-colourable.

The solution to the problem fits the generic template for the two-colouring pattern.

**Template:**Given a graph, find if it is two-colourable or not. Conversely, find if the graph is bipartite or not.

We start by creating a graph from the given dislike pairs. We create a two-dimensional list `graph` of size N and then iterate over the dislike pairs. In each iteration, we use the enumerations in the dislike pair to add an edge in `graph`.

// Diagram: Create a graph using dislike pairs as edges.

We then create a `colour` map to store the colour of each node, where we store 1 for the first colour and -1 for the second colour.  We then iterate through all the nodes of the graph and call the `colourGraph` function for all uncoloured nodes. The colourGraph function takes the current node, `colour` map, and `colourValue` as arguments, where the `colour` map is passed by reference. It returns a boolean value indicating if the connected component of the passed node can be two-coloured or not.

As we enter a node, we set its colour to `colourValue` in the `colour` map, and iterate over all its neighbours. In each iteration, we check if the neighbour is already coloured with the same colour as `colourValue`. If yes, it means the connected component we are exploring is not two-colourable, and we terminate and return `false` to the parent. Otherwise, if it is uncoloured, we recursively call `colourGraph` on it and pass the negation of `colourValue` (`-colourValue`) as its colour.  If a call to `colourGraph` for any neighbour returns `false`, we terminate further execution and return `false` to the parent, who does the same. At the end of all iterations over the neighbours, we return a `true` value to the parent indicating that the connected component of the current node is two-colourable. 

This way, at the end of the top-level call to `colourGraph`, we get a boolean value indicating if the connected component of the top-level node is two-colourable or not. We terminate the algorithm and return `false` on receiving a false value; otherwise, we call `colourGraph` on the next uncoloured node. At the end of all iterations, we return a `true` value indicating the graph is two-colourable and hence bipartite.

Find if the graph is bipartite.

The implementation of the two-colouring technique to solve the problem is given below.

C++

```cpp
#include <unordered_map>

// Diagram: using namespace std;

class Solution {
public:
    bool colourGraph(
        vector<vector<int>> &graph,
        int node,
        unordered_map<int, int> &colour,
        int colourValue
    ) {

        // Colour the node with colourValue
        colour[node] = colourValue;

        // Traverse all the neighbours of the current node
        for (int neighbour : graph[node]) {

            // If the neighbour is not coloured, colour it with the
            // opposite colour and recursively call the function on the
            // neighbour
            if (colour.find(neighbour) == colour.end()) {

                // If the neighbour is not coloured, colour it with the
                // opposite colour
                if (!colourGraph(
                        graph, neighbour, colour, 1 - colourValue
                    )) {

                    // If the colouring fails, return false
                    // (i.e., if a neighbour has the same colour)
                    return false;
                }

            // Else If the neighbour is coloured with the same colour
            // return false
            else if (colour[neighbour] == colourValue) {
                return false;
            }

        return true;
    }

// Diagram: bool dislikePairs(int N, vector<pair<int, int>> &dislikes) {

        // If the number of people is 0 return false
        if (N == 0) {
            return false;
        }

        // Create an adjacency list for the graph
        vector<vector<int>> graph(N);

        // Add edges to the graph nodes by updating
        // the adjacency list
        for (const auto &dislike : dislikes) {
            graph[dislike.first].push_back(dislike.second);
            graph[dislike.second].push_back(dislike.first);
        }

        // Create a map to store the colour of each node
        unordered_map<int, int> colour;

        // Traverse all nodes in the graph
        for (int node = 0; node < graph.size(); node++) {

            // If a node is not coloured, start coloring its
            // connected component recursively starting with colour 1
            if (colour.find(node) == colour.end()) {

                // If the colouring fails, return false
                // (i.e., if a neighbour has the same colour)
                if (!colourGraph(graph, node, colour, 1)) {
                    return false;
                }

        // If all nodes are coloured successfully, return true
        return true;
    }
};
```

Java

```java
import java.util.*;

class Solution {
    private boolean colourGraph(
        List<List<Integer>> graph,
        int node,
        Map<Integer, Integer> colour,
        int colourValue
    ) {

        // Colour the node with colourValue
        colour.put(node, colourValue);

        // Traverse all the neighbours of the current node
        for (int neighbour : graph.get(node)) {

            // If the neighbour is not coloured, colour it with the
            // opposite colour and recursively call the function on the
            // neighbour
            if (!colour.containsKey(neighbour)) {

                // If the neighbour is not coloured, colour it with the
                // opposite colour
                if (
                    !colourGraph(
                        graph,
                        neighbour,
                        colour,
                        1 - colourValue
                    )
                ) {

                    // If the colouring fails, return false
                    // (i.e., if a neighbour has the same colour)
                    return false;
                }

            // Else if the neighbour is coloured with the same colour
            // return false
            else if (colour.get(neighbour) == colourValue) {
                return false;
            }

        return true;
    }

// Diagram: public boolean dislikePairs(int N, List<List<Integer>> dislikes) {

        // If the number of people is 0 return false
        if (N == 0) {
            return false;
        }

        // Create an adjacency list for the graph
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < N; i++) {
            graph.add(new ArrayList<>());
        }

        // Add edges to the graph nodes by updating the adjacency list
        for (List<Integer> dislike : dislikes) {
            graph.get(dislike.get(0)).add(dislike.get(1));
            graph.get(dislike.get(1)).add(dislike.get(0));
        }

        // Create a map to store the colour of each node
        Map<Integer, Integer> colour = new HashMap<>();

        // Traverse all nodes in the graph
        for (int node = 0; node < graph.size(); node++) {

            // If a node is not coloured, start coloring its
            // connected component recursively starting with colour 1
            if (!colour.containsKey(node)) {

                // If the colouring fails, return false
                // (i.e., if a neighbour has the same colour)
                if (!colourGraph(graph, node, colour, 1)) {
                    return false;
                }

        // If all nodes are coloured successfully, return true
        return true;
    }
```

Typescript

```typescript
export class Solution {
    colourGraph(
        graph: number[][],
        node: number,
        colour: Map<number, number>,
        colourValue: number
    ): boolean {

        // Colour the node with colourValue
        colour.set(node, colourValue);

        // Traverse all the neighbours of the current node
        for (const neighbour of graph[node]) {

            // If the neighbour is not coloured, colour it with the
            // opposite colour and recursively call the function on the
            // neighbour
            if (!colour.has(neighbour)) {

                // If the neighbour is not coloured, colour it with the
                // opposite colour
                if (
                    !this.colourGraph(
                        graph,
                        neighbour,
                        colour,
                        1 - colourValue
                    )
                ) {

                    // If the colouring fails, return false
                    // (i.e., if a neighbour has the same colour)
                    return false;
                }

            // Else If the neighbour is coloured with the same colour
            // return false
            else if (colour.get(neighbour) === colourValue) {
                return false;
            }

        return true;
    }

// Diagram: dislikePairs(N: number, dislikes: number[][]): boolean {

        // If the number of people is 0 return false
        if (N == 0) {
            return false;
        }

        // Create an adjacency list for the graph
        const graph: number[][] = Array.from({ length: N }, () => []);

        // Add edges to the graph nodes by updating the adjacency list
        for (const [u, v] of dislikes) {
            graph[u].push(v);
            graph[v].push(u);
        }

        // Create a map to store the colour of each node
        const colour: Map<number, number> = new Map();

// Diagram: for (let node = 0; node < graph.length; node++) {

            // If a node is not coloured, start coloring its
            // connected component recursively starting with colour 1
            if (!colour.has(node)) {

                // If the colouring fails, return false
                // (i.e., if a neighbour has the same colour)
                if (!this.colourGraph(graph, node, colour, 1)) {
                    return false;
                }

        // If all nodes are coloured successfully, return true
        return true;
    }
```

Javascript

```javascript
export class Solution {
    colourGraph(graph, node, colour, colourValue) {

        // Colour the node with colourValue
        colour.set(node, colourValue);

        // Traverse all the neighbours of the current node
        for (const neighbour of graph[node]) {

            // If the neighbour is not coloured, colour it with the
            // opposite colour and recursively call the function on the
            // neighbour
            if (!colour.has(neighbour)) {

                // If the neighbour is not coloured, colour it with the
                // opposite colour
                if (
                    !this.colourGraph(
                        graph,
                        neighbour,
                        colour,
                        1 - colourValue
                    )
                ) {

                    // If the colouring fails, return false
                    // (i.e., if a neighbour has the same colour)
                    return false;
                }

            // Else If the neighbour is coloured with the same colour
            // return false
            else if (colour.get(neighbour) === colourValue) {
                return false;
            }

        return true;
    }

// Diagram: dislikePairs(N, dislikes) {

        // If the number of people is 0 return false
        if (N == 0) {
            return false;
        }

        // Create an adjacency list for the graph
        const graph = Array.from({ length: N }, () => []);

        // Add edges to the graph nodes by updating the adjacency list
        for (const [u, v] of dislikes) {
            graph[u].push(v);
            graph[v].push(u);
        }

        // Create a map to store the colour of each node
        const colour = new Map();

        // Traverse all nodes in the graph
        for (let node = 0; node < graph.length; node++) {

            // If a node is not coloured, start coloring its
            // connected component recursively starting with colour 1
            if (!colour.has(node)) {

                // If the colouring fails, return false
                // (i.e., if a neighbour has the same colour)
                if (!this.colourGraph(graph, node, colour, 1)) {
                    return false;
                }

        // If all nodes are coloured successfully, return true
        return true;
    }
```

Python

```python
from typing import List, Dict

class Solution:
    def colour_graph(
        self,
        graph: List[List[int]],
        node: int,
        colour: Dict[int, int],
        colour_value: int,
    ) -> bool:

        # Colour the node with colourValue
        colour[node] = colour_value

        # Traverse all the neighbours of the current node
        for neighbour in graph[node]:

            # If the neighbour is not coloured, colour it with the
            # opposite colour and recursively call the function on the
            # neighbour
            if neighbour not in colour:

                # If the neighbour is not coloured, colour it with the
                # opposite colour
                if not self.colour_graph(
                    graph, neighbour, colour, 1 - colour_value
                ):

                    # If the colouring fails, return false
                    # (i.e., if a neighbour has the same colour)
                    return False

            # Else if the neighbour is coloured with the same colour
            # return false
            elif colour[neighbour] == colour_value:
                return False

        return True

    def dislike_pairs(self, n: int, dislikes: List[List[int]]) -> bool:

        # If the number of people is 0 return false
        if n == 0:
            return False

        # Create an adjacency list for the graph
        graph: List[List[int]] = [[] for _ in range(n)]

        # Add edges to the graph nodes by updating
        # the adjacency list
        for dislike in dislikes:
            graph[dislike[0]].append(dislike[1])
            graph[dislike[1]].append(dislike[0])

        # Create a map to store the colour of each node
        colour: Dict[int, int] = {}

        for node in range(len(graph)):

            # If a node is not coloured, start coloring its
            # connected component recursively starting with colour 1
            if node not in colour:

                # If the colouring fails, return false
                # (i.e., if a neighbour has the same colour)
                if not self.colour_graph(graph, node, colour, 1):
                    return False

        # If all nodes are coloured successfully, return true
        return True
```

The two-colouring technique can solve this problem in linear time and a single pass using a concise recursive implementation.

## Example problems

Most problems that fall under this category are**medium**problems; a list of a few is given below.

> -   **[Two colourable](https://www.codeintuition.io/courses/graph/AwEzAoVhKEs0pakLFP_2A)**
> -   **[Dislike pairs](https://www.codeintuition.io/courses/graph/zhHnB4AHN8wrkQXOH2qtR)**
> -   **[Colour repair](https://www.codeintuition.io/courses/graph/wY_mxngQqzdu2-ejV7t00)**
> -   **[Group colourable](https://www.codeintuition.io/courses/graph/kyRHVbg58S8IrwA4EPMBo)**

We will now solve these problems to understand the two-colouring technique better.

***

# Two colourable

## Problem Statement

Given an **undirected** **graph** represented as an adjacency list, write a function that returns `true` if the graph can be coloured with **two** colours and `false` otherwise.

The graph is given as follows: `graph[i]` is a list of all nodes you can visit from node `i` (i.e., there is a directed edge from node `i` to node `graph[i][j]`).

> You must abide by the following constraint:
>
> -   You must colour the graph such that no two adjacent vertices of the graph are colored with the same colour.

### Example 1

> -   **Input:** graph = \[\[1, 3\], \[0, 2\], \[1, 3\], \[0, 2\]\]
> -   **Output:** true
> -   **Explanation:** We can colour the graph with two colours.

### Example 2

> -   **Input:** graph = \[\[1, 2\], \[0, 2\], \[0, 1\]\]
> -   **Output:** false
> -   **Explanation:** We cannot colour the graph with two colour.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    bool colourGraph(
        vector<vector<int>> &graph,
        int node,
        unordered_map<int, int> &colour,
        int colourValue
    ) {

        // Colour the node with colourValue
        colour[node] = colourValue;

        // Traverse all the neighbours of the current node
        for (int neighbour : graph[node]) {

            // If the neighbour is not coloured, colour it with the
            // opposite colour and recursively call the function on the
            // neighbour
            if (colour.find(neighbour) == colour.end()) {

                // If the neighbour is not coloured, colour it with the
                // opposite colour
                if (!colourGraph(
                        graph, neighbour, colour, 1 - colourValue
                    )) {

                    // If the colouring fails, return false
                    // (i.e., if a neighbour has the same colour)
                    return false;
                }
            }

            // Else If the neighbour is coloured with the same colour
            // return false
            else if (colour[neighbour] == colourValue) {
                return false;
            }
        }

        return true;
    }

    bool isTwoColourable(vector<vector<int>> &graph) {

        // Number of nodes in the graph
        int N = graph.size();

        // If the graph is empty, return false
        if (N == 0) {
            return false;
        }

        // Create a map to store the colour of each node
        unordered_map<int, int> colour;

        // Traverse all nodes in the graph
        for (int node = 0; node < graph.size(); node++) {

            // If a node is not coloured, start colouring its
            // connected component recursively starting with colour 1
            if (colour.find(node) == colour.end()) {

                // If the colouring fails, return false
                // (i.e., if a neighbour has the same colour)
                if (!colourGraph(graph, node, colour, 1)) {
                    return false;
                }
            }
        }

        // If all nodes are coloured successfully, return true
        return true;
    }
};
```

***

# Dislike pairs

## Problem Statement

Given the integer **N** and a list **dislikes** where `dislikes[i] = (A, B)` indicates that the person labelled `A` does not like the person labelled `B`, write a function that returns `true` if these people can be divided into two sets such that no pair in the same set dislikes each other, and return `false` otherwise.

### Example 1

> -   **Input:** N = 4, dislikes = \[\[1, 3\], \[0, 2\], \[1, 3\], \[0, 2\]\]
> -   **Output:** true
> -   **Explanation:** We can divide the people into two sets \[0, 2\] and \[1, 3\].

### Example 2

> -   **Input:** N = 3, dislikes = \[\[0, 1\], \[1, 2\], \[2, 0\]\]
> -   **Output:** false
> -   **Explanation:** We cannot divide the people into two sets.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    bool colourGraph(
        vector<vector<int>> &graph,
        int node,
        unordered_map<int, int> &colour,
        int colourValue
    ) {

        // Colour the node with colourValue
        colour[node] = colourValue;

        // Traverse all the neighbours of the current node
        for (int neighbour : graph[node]) {

            // If the neighbour is not coloured, colour it with the
            // opposite colour and recursively call the function on the
            // neighbour
            if (colour.find(neighbour) == colour.end()) {

                // If the neighbour is not coloured, colour it with the
                // opposite colour
                if (!colourGraph(
                        graph, neighbour, colour, 1 - colourValue
                    )) {

                    // If the colouring fails, return false
                    // (i.e., if a neighbour has the same colour)
                    return false;
                }
            }

            // Else If the neighbour is coloured with the same colour
            // return false
            else if (colour[neighbour] == colourValue) {
                return false;
            }
        }

        return true;
    }

    bool dislikePairs(int N, vector<pair<int, int>> &dislikes) {

        // If the number of people is 0 return false
        if (N == 0) {
            return false;
        }

        // Create an adjacency list for the graph
        vector<vector<int>> graph(N);

        // Add edges to the graph nodes by updating
        // the adjacency list
        for (const auto &dislike : dislikes) {
            graph[dislike.first].push_back(dislike.second);
            graph[dislike.second].push_back(dislike.first);
        }

        // Create a map to store the colour of each node
        unordered_map<int, int> colour;

        // Traverse all nodes in the graph
        for (int node = 0; node < graph.size(); node++) {

            // If a node is not coloured, start coloring its
            // connected component recursively starting with colour 1
            if (colour.find(node) == colour.end()) {

                // If the colouring fails, return false
                // (i.e., if a neighbour has the same colour)
                if (!colourGraph(graph, node, colour, 1)) {
                    return false;
                }
            }
        }

        // If all nodes are coloured successfully, return true
        return true;
    }
};
```

***

# Colour repair

## Problem Statement

Given an **undirected** **graph** represented as an adjacency list, write a function that returns `true` if the graph can be coloured with **two** colours `alse` otherwise.

The graph is given as follows: `graph[i]` is a list of all nodes you can visit from node `i` (i.e., there is a directed edge from node `i` to node `graph[i][j]`).

> You must abide by the following constraint:
>
> -   You must colour the graph such that no two adjacent vertices of the graph are colored with the same colour.
> -   You can remove at most one bidirectional edge from the graph.

### Example 1

> -   **Input:** graph = \[\[1, 3\], \[0, 2, 3\], \[1, 3\], \[0, 1, 2\]\]
> -   **Output:** true
> -   **Explanation:** We can colour the graph with two colours by removing the bidirectional edge between nodes 1 and 3.

### Example 2

> -   **Input:** graph = \[\[1, 2, 3\], \[0, 2\], \[0, 1\], \[0\]\]
> -   **Output:** true
> -   **Explanation:** We can colour the graph with two colours by removing the bidirectional edge between nodes 0 and 2.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    bool colourGraph(
        vector<vector<int>> &graph,
        int node,
        unordered_map<int, int> &colour,
        int colourValue,
        vector<pair<int, int>> &conflicts
    ) {

        // Colour the node with colourValue
        colour[node] = colourValue;

        // Traverse all the neighbours of the current node
        for (int neighbour : graph[node]) {

            // If the neighbour is not coloured, colour it with the
            // opposite colour
            if (colour.find(neighbour) == colour.end()) {
                if (!colourGraph(
                        graph,
                        neighbour,
                        colour,
                        1 - colourValue,
                        conflicts
                    )) {
                    return false;
                }
            }

            // Else if the neighbour is coloured with the same colour,
            // record the conflict
            else if (colour[neighbour] == colourValue) {
                conflicts.push_back({node, neighbour});
            }
        }

        return true;
    }

    bool colourRepair(vector<vector<int>> &graph) {
        int N = graph.size();

        // If the graph is empty, return false
        if (N == 0) {
            return false;
        }

        // Create a map to store the colour of each node
        unordered_map<int, int> colour;

        // Vector to store all edges that cause conflicts (same-coloured
        // endpoints)
        vector<pair<int, int>> conflicts;

        // Traverse all nodes in the graph
        for (int node = 0; node < N; node++) {

            // If a node is not coloured, start colouring its connected
            // component recursively
            if (colour.find(node) == colour.end()) {
                colourGraph(graph, node, colour, 0, conflicts);
            }
        }

        // The graph can be made bipartite if there is at most one
        // conflict edge. Divide by 2 to account for double counting
        // of edges in an undirected graph
        return conflicts.size() / 2 <= 1;
    }
};
```

***

# Group colourable

## Problem Statement

Given an **undirected** **graph** represented as an adjacency list and a list of **groups**, write a function that returns `true` if the graph can be colored with **two** colours and `false` otherwise.

The graph is given as follows: `graph[i]` is a list of all nodes you can visit from node `i` (i.e., there is a directed edge from node `i` to node `graph[i][j]`).

> You must abide by the following constraint:
>
> -   You must colour the graph such that no two adjacent vertices of the graph are colored with the same colour.
> -   All the nodes in a given group should be coloured with the same colour.

### Example 1

> -   **Input:** graph = \[\[1, 3\], \[0, 2\], \[1, 3\], \[0, 2\]\], groups = \[\[0, 2\], \[1, 3\]\]
> -   **Output:** true
> -   **Explanation:** We can colour the graph with two colours while ensuring that all nodes in a given group are coloured with the same colour.

### Example 2

> -   **Input:** graph = \[\[1, 3\], \[0, 2\], \[1, 3\], \[0, 2\]\], groups = \[\[0, 1\], \[2, 3\]\]
> -   **Output:** false
> -   **Explanation:** We cannot colour the graph with two colours while ensuring that all nodes in a given group are coloured with the same colour.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    bool colorGroup(
        int node,
        unordered_map<int, int> &colour,
        int colourValue,
        unordered_map<int, vector<int>> &groupMap
    ) {

        // If node belongs to a group, assign the same colour to all
        // nodes in the group
        if (groupMap.find(node) != groupMap.end()) {

            // Traverse all nodes in the group and assign them the same
            // colour
            for (int groupNode : groupMap[node]) {

                // If the group node is not coloured, colour it with the
                // same colour as the current node
                if (colour.find(groupNode) == colour.end()) {
                    colour[groupNode] = colourValue;
                }

                // If the group node is coloured with a different
                // colour, return false
                else if (colour[groupNode] != colourValue) {
                    return false;
                }
            }
        }

        // If all group nodes are coloured successfully,
        return true;
    }

    bool colourGraph(
        vector<vector<int>> &graph,
        int node,
        unordered_map<int, int> &colour,
        int colourValue,
        unordered_map<int, vector<int>> &groupMap
    ) {

        // Colour the node with colourValue
        colour[node] = colourValue;

        // If node belongs to a group, assign the same colour to all
        // nodes in the group, if it fails return false
        if (!colorGroup(node, colour, colourValue, groupMap)) {
            return false;
        }

        // Traverse all the neighbours of the current node
        for (int neighbour : graph[node]) {

            // If the neighbour is not coloured, colour it with the
            // opposite colour and recursively call the function on the
            // neighbour
            if (colour.find(neighbour) == colour.end()) {

                // If the neighbour is not coloured, colour it with the
                // opposite colour
                if (!colourGraph(
                        graph,
                        neighbour,
                        colour,
                        1 - colourValue,
                        groupMap
                    )) {

                    // If the colouring fails, return false
                    // (i.e., if a neighbour has the same colour)
                    return false;
                }
            }

            // Else if the neighbour is coloured with the same colour
            // return false
            else if (colour[neighbour] == colourValue) {
                return false;
            }
        }

        return true;
    }

    bool groupColourable(
        vector<vector<int>> &graph,
        vector<vector<int>> &groups
    ) {
        int N = graph.size();

        // If the graph is empty, return false
        if (N == 0) {
            return false;
        }

        // Create a map to store the colour of each node
        unordered_map<int, int> colour;

        // Map each node to all nodes in its group
        unordered_map<int, vector<int>> groupMap;
        for (auto &group : groups) {
            for (int node : group) {
                groupMap[node] = group;
            }
        }

        // Traverse all nodes in the graph
        for (int node = 0; node < graph.size(); node++) {

            // If a node is not coloured, start colouring its
            // connected component recursively starting with colour 1
            if (colour.find(node) == colour.end()) {

                // If the colouring fails, return false
                // (i.e., if a neighbour has the same colour)
                if (!colourGraph(graph, node, colour, 1, groupMap)) {
                    return false;
                }
            }
        }

        // If all nodes are coloured successfully, return true
        return true;
    }
};
```
