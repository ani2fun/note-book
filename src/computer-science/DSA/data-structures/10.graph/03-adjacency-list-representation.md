# Adjacency list representation

## Table of Contents

1. [Structure of adjacency list](#structure-of-adjacency-list)
2. [Implementation of adjacency list](#implementation-of-adjacency-list)
3. [Enhanced implementation techniques](#enhanced-implementation-techniques)
4. [Clone adjacency list](#clone-adjacency-list)
5. [Adjacency list to adjacency matrix](#adjacency-list-to-adjacency-matrix)
6. [Adjacency matrix to adjacency list](#adjacency-matrix-to-adjacency-list)

***

# Structure of adjacency list

Now that we know the limitations of the adjacency matrix implementation, let's look at another way of implementing graphs that overcome those limitations. Consider the following graph as an example. 

// Diagram: An example graph

Instead of looking at the graph as a set of edges connecting the nodes, if we look at the graph as a set of nodes connected, we can implement the graph from the point of view of nodes. For every node, we can store all the nodes directly connected to it by an edge in a list, also called the **adjacency list**. This way, the entire graph can be implemented as a list of adjacency lists.

However, just like the adjacency matrix implementation, we need to **enumerate** all nodes in the graph to identify each node uniquely. We assign unique values between 0 and N-1 to all nodes, where N is the total number of nodes.

// Diagram: Enumerate the nodes in the graph

We can then create a two-dimensional list with the outer list of size N, where N is the number of nodes. The item `i` in the list is the adjacency list for the ith node in the graph.

// Diagram: Adjacency list representation of a graph

The adjacency list implementation is a clean and concise way of implementing a graph. It only takes as much memory as the graph needs, and new nodes can easily be added.

## Representation in memory

Unlike the adjacency matrix implementation, where the size of the matrix is known at the time of creation, in the adjacency list implementation, only the size of the outer list is known. The adjacency list grows when we create the graph, so it is implemented as either a dynamic array or a linked list. The outer list can be dynamic if nodes must be added or removed from the graph. For this reason, the structure of memory depends very much on its implementation.

In most graph implementations, however, dynamic arrays are used instead of linked lists as they provide random access in the adjacency list and benefit from the locality of reference.

// Diagram: Adjacency list layout in memory implemented using dynamic arrays

Now that we know what an adjacency list is, we will learn more about how to create and perform various operations on a graph implemented using one later in the course.

***

# Implementation of adjacency list

To create a graph data structure, we need data items and the relationship between them. Just like the adjacency matrix implementation, we need the total number of nodes and a list of edges to implement an adjacency list. This information is usually available as data from the problem statement or the use case. Let's consider the following graph as an example to learn how to implement a graph using an adjacency list. 

// Diagram: An example graph

## Implementation

To implement the graph, we create a function that takes the total number of nodes and a list of edges as input. Each edge in the list has two values, the source node and destination nodes respectively. We then create a two-dimensional dynamic list, where each list stores all the neighbors of a node. We then iterate over the list of edges and add the nodes as neighbors in their respective adjacency lists.

C++

```cpp
vector<vector<int>> createGraph(int nodes, vector<vector<int>>& edges)
{
    // Create a list of adjacency lists
    vector<vector<int>> adj(nodes);

    for (auto edge: edges)
    {
        // Add nodeB (edge[1]) to adjacency list of nodeA (edge[0])
        adj[edge[0]].push_back(edge[1]);

        // Add nodeA (edge[0]) to adjacency list of nodeB (edge[1])
        adj[edge[1]].push_back(edge[0]);
    }

    return adj;
}
```

Java

```java
public List<List<Integer>> createGraph(int nodes, int[][] edges)
{
    // Create adjacency matrix
    List<List<Integer>> adjList = new ArrayList<List<Integer>>();

    for(int i=0; i<nodes; i++)
    {
        adjList.add(new ArrayList<Integer>());
    }

    for (int[] edge: edges)
    {
        // Add nodeB (edge[1]) to adjacency list of nodeA (edge[0])
        adj[edge[0]].add(edge[1]);

        // Add nodeA (edge[0]) to adjacency list of nodeB (edge[1])
        adj[edge[1]].add(edge[0]);
    }

    return adj;
}
```

Typescript

```typescript
createGraph(nodes: number, int[][] edges) : boolean[][]
{
    // Create adjacency matrix
    let adj: number[][] = Array(nodes).fill().map(() => []);

    for (let edge: boolean[] of edges)
    {
        // Add nodeB (edge[1]) to adjacency list of nodeA (edge[0])
        adj[edge[0]].push(edge[1]);

        // Add nodeA (edge[0]) to adjacency list of nodeB (edge[1])
        adj[edge[1]].push(edge[0]);
    }

    return adj;
}
```

Javascript

```javascript
createGraph(nodes, edges)
{
    // Create adjacency matrix
    let adj = Array(nodes).fill().map(() => []);

    for (let edge of edges)
    {
        // Add nodeB (edge[1]) to adjacency list of nodeA (edge[0])
        adj[edge[0]].push(edge[1]);

        // Add nodeA (edge[0]) to adjacency list of nodeB (edge[1])
        adj[edge[1]].push(edge[0]);
    }

    return adj;
}
```

Python

```python
def create_graph(nodes, edges)
    # Create adjacency matrix
    adj = [[]] * nodes

    for edge in edges:
        # Add nodeB (edge[1]) to adjacency list of nodeA (edge[0])
        adj[edge[0]].append(edge[1]);

        # Add nodeA (edge[0]) to adjacency list of nodeB (edge[1])
        adj[edge[1]].append(edge[0]);

    return adj
```

## Complexity Analysis

To create the matrix, we iterate over the list of all edges and update the cell. Updating the boolean value is a constant-time operation, but the iteration takes linear time, so the time complexity is **O(E)**, where E is the total number of edges in the graph.

The combined total size of the adjacency list for all nodes would be **2\*E** for an undirected graph or **E** for a directed graph and so, the space complexity is **O(E)**.

> **Best Case**
>
> -   Space Complexity - **O(E)**
> -   Time Complexity - **O(E)**
>
> **Worst Case**
>
> -   Space Complexity - **O(N^2)**
> -   Time Complexity - **O(E)**

***

# Enhanced implementation techniques

An adjacency list is an easy and effective way to implement a graph in memory. However, just like adjacency matrices, some more complicated use cases cannot be implemented with the most basic implementation of adjacency lists.

> Adjacency list implementation cannot store:
>
> -   Weighted edges
> -   Data value at nodes

// Diagram: Adjacency matrix cannot store graphs with edge weights and node data

The basic implementation of an adjacency list only stores the relationship between nodes and nothing about the node. Also, it only stores the **existence** of an edge between two nodes, so it cannot store any additional edge data, such as weights. Let us look at how to modify the implementation to store this data.

## Store weighted edges

We can modify the adjacency list to store a pair of values instead of a single value to implement a weighted graph. We can then choose the first value in the pair to represent the weight of the edge, while the other could be the destination node for this edge. There are other ways we can store weights as well but this is the simplest way to do it.

// Diagram: Storing weighted edges in adjacency matrix

The implementation is slightly different from the basic implementation of the adjacency list. We create a function that takes the total number of nodes and a list of edges as input. Each edge in the list is represented by three values: source node, destination node, and weight, respectively. We then create a two-dimensional dynamic list, where each internal list stores the destination node and the edge weight respectively. We then iterate over the list of edges and add edge weight and neighbor nodes in their respective adjacency lists.

C++

```cpp
/*
 * Function to create graph
 * nodeData: A list of node data
 * edges[in]: A list of edges. An edge is a list storing
 * the two nodes it connects and the weight.
 *
 * retuns: graph as array of nodes
 */
vector<Node> createGraph(vector<int> nodeData, vector<vector<int>>& edges)
{
    // Create an array of nodes
    vector<Node> nodes;

    // Fill in the node data
    for(auto data: nodeData)
        nodes.push_back(Node(data));

    for (auto edge: edges)
    {
        // Add nodeB (edge[1]) and edge weight (edge[2])
        // to adjacency list of nodeA (edge[0])
        nodes[edge[0]].adj.push_back(make_pair(edge[1], edge[2]));

        // Add nodeA (edge[0]) and edge weight (edge[2])
        // to adjacency list of nodeB (edge[1])
        nodes[edge[1]].adj.push_back(make_pair(edge[0], edge[2]));
    }

    return nodes;
}
```

Java

```java
/*
 * Function to create graph
 * nodes: The number of nodes in the graph
 * edges[in]: A list of edges. An edge is a list storing
 * the two nodes it connects and the weight.
 *
 * retuns: Adjacency list
 */
public List<List<List<Integer>> createGraph(int nodes, int[][] edges)
{
    // Create adjacency list
    List<List<List<Integer>>> adjList = new Array<List<List<Integer>>>();

    for(int i=0; i<nodes; i++)
    {
        adjList.add(new ArrayList<List<Integer>>());
    }

    for (int[] edge: edges)
    {
        // Add nodeB (edge[1]) and edge weight (edge[2])
        // to adjacency list of nodeA (edge[0])
        List<Integer> pair1 = new ArrayList<Integer>();
        pair1.add(edge[1], edge[2]);
        adj[edge[0]].add(pair1);

        // Add nodeA (edge[0]) and edge weight (edge[2])
        // to adjacency list of nodeB (edge[1])
        List<Integer> pair2 = new ArrayList<Integer>();
        pair2.add(edge[0], edge[2]);
        // Add nodeA (edge[0]) to adjacency list of nodeB (edge[1])
        adj[edge[1]].add(pair2);
    }

    return adj;
}
```

Typescript

```typescript
/*
 * Function to create graph
 * nodes: The number of nodes in the graph
 * edges[in]: A list of edges. An edge is a list storing
 * the two nodes it connects and the weight.
 *
 * retuns: Adjacency list
 */
createGraph(nodes: number, edges: number[][]) : boolean[][][]
{
    // Create adjacency matrix
    let adj: number[][][] = Array(nodes).fill().map(() => []);

    for (let edge: boolean[] of edges)
    {
        // Add nodeB (edge[1]) and edge weight (edge[2])
        // to adjacency list of nodeA (edge[0])
        adj[edge[0]].push([edge[1], edge[2]]);

        // Add nodeA (edge[0]) and edge weight (edge[2])
        // to adjacency list of nodeB (edge[1])
        adj[edge[1]].push([edge[0], edge[2]]);
    }

    return adj;
}
```

Javascript

```javascript
/*
 * Function to create graph
 * nodes: The number of nodes in the graph
 * edges[in]: A list of edges. An edge is a list storing
 * the two nodes it connects and the weight.
 *
 * retuns: Adjacency list
 */
createGraph(nodes, edges)
{
    // Create adjacency matrix
    let adj = Array(nodes).fill().map(() => []);

    for (let edge of edges)
    {
        // Add nodeB (edge[1]) and edge weight (edge[2])
        // to adjacency list of nodeA (edge[0])
        adj[edge[0]].push([edge[1], edge[2]]);

        // Add nodeA (edge[0]) and edge weight (edge[2])
        // to adjacency list of nodeB (edge[1])
        adj[edge[1]].push([edge[0], edge[2]]);
    }

    return adj;
}
```

Python

```python
"""
 * Function to create graph
 * nodes: The number of nodes in the graph
 * edges[in]: A list of edges. An edge is a list storing
 * the two nodes it connects and the weight.
 *
 * retuns: Adjacency list
"""
def create_graph(nodes, edges)
    # Create adjacency matrix
    adj = [[]] * nodes

    for edge in edges:
        # Add nodeB (edge[1]) and edge weight (edge[2])
        # to adjacency list of nodeA (edge[0])
        adj[edge[0]].append((edge[1], edge[2]));

        # Add nodeA (edge[0]) and edge weight (edge[2])
        # to adjacency list of nodeB (edge[1])
        adj[edge[1]].append((edge[0], edge[2]));

    return adj
```

## Store data at nodes

To implement a graph that also holds some data at the node, we can create another array to hold that data. Since the nodes of the graphs are enumerated from 0 to N-1, we can create a single array of size N and use the enumeration of a node as its index in the array to store data.

// Diagram: Storing node data and edge data in adjacency matrix and array

Since, unlike the adjacency matrix implementation, the data of the edges stays with the node in the adjacency list implementation, another way of implementing a graph with data at nodes is to create a new data type for the node. This new datatype can encapsulate the node data along with the adjacency lists, and the graph can then be represented as an array of these nodes.

// Diagram: The node data and the adjacency list for a node can be encapsulated in a new datatype

// Diagram: To create a new node type, we can encapsulate the node data and adjacency list in a class

C++

```cpp
/*
 * Function to create graph
 * nodeData: A list of node data
 * edges[in]: A list of edges. An edge is a list storing
 * the two nodes it connects and the weight.
 *
 * retuns: graph as array of nodes
 */
vector<Node> createGraph(vector<int> nodeData, vector<vector<int>>& edges)
{
    // Create an array of nodes
    vector<Node> nodes;

    // Fill in the node data
    for(auto data: nodeData)
        nodes.push_back(Node(data));

    for (auto edge: edges)
    {
        // Add nodeB (edge[1]) and edge weight (edge[2])
        // to adjacency list of nodeA (edge[0])
        nodes[edge[0]].adj.push_back(make_pair(edge[1], edge[2]));

        // Add nodeA (edge[0]) and edge weight (edge[2])
        // to adjacency list of nodeB (edge[1])
        nodes[edge[1]].adj.push_back(make_pair(edge[0], edge[2]));
    }

    return nodes;
}
```

Java

```java
/*
 * Function to create graph
 * nodes: The number of nodes in the graph
 * edges[in]: A list of edges. An edge is a list storing
 * the two nodes it connects and the weight.
 *
 * retuns: Adjacency list
 */
public List<List<List<Integer>> createGraph(int nodes, int[][] edges)
{
    // Create adjacency list
    List<List<List<Integer>>> adjList = new Array<List<List<Integer>>>();

    for(int i=0; i<nodes; i++)
    {
        adjList.add(new ArrayList<List<Integer>>());
    }

    for (int[] edge: edges)
    {
        // Add nodeB (edge[1]) and edge weight (edge[2])
        // to adjacency list of nodeA (edge[0])
        List<Integer> pair1 = new ArrayList<Integer>();
        pair1.add(edge[1], edge[2]);
        adj[edge[0]].add(pair1);

        // Add nodeA (edge[0]) and edge weight (edge[2])
        // to adjacency list of nodeB (edge[1])
        List<Integer> pair2 = new ArrayList<Integer>();
        pair2.add(edge[0], edge[2]);
        // Add nodeA (edge[0]) to adjacency list of nodeB (edge[1])
        adj[edge[1]].add(pair2);
    }

    return adj;
}
```

Typescript

```typescript
/*
 * Function to create graph
 * nodes: The number of nodes in the graph
 * edges[in]: A list of edges. An edge is a list storing
 * the two nodes it connects and the weight.
 *
 * retuns: Adjacency list
 */
createGraph(nodes: number, edges: number[][]) : boolean[][][]
{
    // Create adjacency matrix
    let adj: number[][][] = Array(nodes).fill().map(() => []);

    for (let edge: boolean[] of edges)
    {
        // Add nodeB (edge[1]) and edge weight (edge[2])
        // to adjacency list of nodeA (edge[0])
        adj[edge[0]].push([edge[1], edge[2]]);

        // Add nodeA (edge[0]) and edge weight (edge[2])
        // to adjacency list of nodeB (edge[1])
        adj[edge[1]].push([edge[0], edge[2]]);
    }

    return adj;
}
```

Javascript

```javascript
/*
 * Function to create graph
 * nodes: The number of nodes in the graph
 * edges[in]: A list of edges. An edge is a list storing
 * the two nodes it connects and the weight.
 *
 * retuns: Adjacency list
 */
createGraph(nodes, edges)
{
    // Create adjacency matrix
    let adj = Array(nodes).fill().map(() => []);

    for (let edge of edges)
    {
        // Add nodeB (edge[1]) and edge weight (edge[2])
        // to adjacency list of nodeA (edge[0])
        adj[edge[0]].push([edge[1], edge[2]]);

        // Add nodeA (edge[0]) and edge weight (edge[2])
        // to adjacency list of nodeB (edge[1])
        adj[edge[1]].push([edge[0], edge[2]]);
    }

    return adj;
}
```

Python

```python
"""
 * Function to create graph
 * nodes: The number of nodes in the graph
 * edges[in]: A list of edges. An edge is a list storing
 * the two nodes it connects and the weight.
 *
 * retuns: Adjacency list
"""
def create_graph(nodes, edges)
    # Create adjacency matrix
    adj = [[]] * nodes

    for edge in edges:
        # Add nodeB (edge[1]) and edge weight (edge[2])
        # to adjacency list of nodeA (edge[0])
        adj[edge[0]].append((edge[1], edge[2]));

        # Add nodeA (edge[0]) and edge weight (edge[2])
        # to adjacency list of nodeB (edge[1])
        adj[edge[1]].append((edge[0], edge[2]));

    return adj
```

The graph can then be implemented as an array of such nodes where the index `i` represents the node enumerated `i` in the logical representation of the graph. This is a better way of implementing graphs with node data, as it allows for extending the node data with more data if needed.

// Diagram: Graph implemented as an array of graph nodes

The implementation uses an array to store all the node objects together. Since the nodes are enumerated from 0 to N-1, the data at an index `i` in the array is the node `i`. When creating the graph, we take the array containing the node data as an additional input, along with the list of edges. We then create a dynamic list to hold the new node datatype and iterate over the array containing the node data to create and initialize graph nodes with the respective data. We then iterate over the list of edges and add neighbors and edge weights to the adjacency list of the source and destination nodes.

C++

```cpp
/*
 * Function to create graph
 * nodeData: A list of node data
 * edges[in]: A list of edges. An edge is a list storing
 * the two nodes it connects and the weight.
 *
 * retuns: graph as array of nodes
 */
vector<Node> createGraph(vector<int> nodeData, vector<vector<int>>& edges)
{
    // Create an array of nodes
    vector<Node> nodes;

    // Fill in the node data
    for(auto data: nodeData)
        nodes.push_back(Node(data));

    for (auto edge: edges)
    {
        // Add nodeB (edge[1]) and edge weight (edge[2])
        // to adjacency list of nodeA (edge[0])
        nodes[edge[0]].adj.push_back(make_pair(edge[1], edge[2]));

        // Add nodeA (edge[0]) and edge weight (edge[2])
        // to adjacency list of nodeB (edge[1])
        nodes[edge[1]].adj.push_back(make_pair(edge[0], edge[2]));
    }

    return nodes;
}
```

Java

```java
/*
 * Function to create graph
 * nodes: The number of nodes in the graph
 * edges[in]: A list of edges. An edge is a list storing
 * the two nodes it connects and the weight.
 *
 * retuns: Adjacency list
 */
public List<List<List<Integer>> createGraph(int nodes, int[][] edges)
{
    // Create adjacency list
    List<List<List<Integer>>> adjList = new Array<List<List<Integer>>>();

    for(int i=0; i<nodes; i++)
    {
        adjList.add(new ArrayList<List<Integer>>());
    }

    for (int[] edge: edges)
    {
        // Add nodeB (edge[1]) and edge weight (edge[2])
        // to adjacency list of nodeA (edge[0])
        List<Integer> pair1 = new ArrayList<Integer>();
        pair1.add(edge[1], edge[2]);
        adj[edge[0]].add(pair1);

        // Add nodeA (edge[0]) and edge weight (edge[2])
        // to adjacency list of nodeB (edge[1])
        List<Integer> pair2 = new ArrayList<Integer>();
        pair2.add(edge[0], edge[2]);
        // Add nodeA (edge[0]) to adjacency list of nodeB (edge[1])
        adj[edge[1]].add(pair2);
    }

    return adj;
}
```

Typescript

```typescript
/*
 * Function to create graph
 * nodeData: A list of node data
 * edges[in]: A list of edges. An edge is a list storing
 * the two nodes it connects and the weight.
 *
 * retuns: graph as array of nodes
 */
createGraph(nodeData: number[], edges: number[][]) : boolean[][][]
{
    // Create adjacency matrix
    let nodes: Node[] = []

    // Fill in the node data
    for (let data: number of nodeData)
        nodes.push(new Node(data));

    for (let edge: boolean[] of edges)
    {
        // Add nodeB (edge[1]) and edge weight (edge[2])
        // to adjacency list of nodeA (edge[0])
        nodes[edge[0]].adj.push([edge[1], edge[2]]);

        // Add nodeA (edge[0]) and edge weight (edge[2])
        // to adjacency list of nodeB (edge[1])
        nodes[edge[1]].adj.push([edge[0], edge[2]]);
    }

    return adj;
}
```

Javascript

```javascript
/*
 * Function to create graph
 * nodeData: A list of node data
 * edges[in]: A list of edges. An edge is a list storing
 * the two nodes it connects and the weight.
 *
 * retuns: graph as array of nodes
 */
createGraph(nodeData, edges)
{
    let nodes = []

    // Fill in the node data
    for (let data of nodeData)
        nodes.push(new Node(data));

    for (let edge of edges)
    {
        // Add nodeB (edge[1]) and edge weight (edge[2])
        // to adjacency list of nodeA (edge[0])
        nodes[edge[0]].adj.push([edge[1], edge[2]]);

        // Add nodeA (edge[0]) and edge weight (edge[2])
        // to adjacency list of nodeB (edge[1])
        nodes[edge[1]].adj.push([edge[0], edge[2]]);
    }

    return adj;
}
```

Python

```python
"""
 * Function to create graph
 * nodeData: A list of node data
 * edges[in]: A list of edges. An edge is a list storing
 * the two nodes it connects and the weight.
 *
 * retuns: graph as array of nodes
"""
def create_graph(nodeData, edges)
    # Create adjacency matrix
    nodes = []

    # Fill in the node data
    for data in nodeData:
        nodes.append(Node(data))

    for edge in edges:
        # Add nodeB (edge[1]) and edge weight (edge[2])
        # to adjacency list of nodeA (edge[0])
        nodes[edge[0]].adj.append((edge[1], edge[2]));

        # Add nodeA (edge[0]) and edge weight (edge[2])
        # to adjacency list of nodeB (edge[1])
        nodes[edge[1]].adj.append((edge[0], edge[2]));

    return nodes
```

These different implementations ultimately implement the same logical structure in the memory in different ways. The implementation to be used is generally chosen based on the problem and use case that the underlying graph solves.

***

# Clone adjacency list

## Problem Statement

Given the **adjacency list** of a directed graph, write a function to clone this list and return a new list.

### Example 1

> -   **Input:** ajdList = \[\[1, 3\], \[4\], \[4\], \[2\], \[3\]\]
> -   **Output:** \[\[1, 3\], \[4\], \[4\], \[2\], \[3\]\]
> -   **Explanation:** Above is the cloned adj list.

### Example 2

> -   **Input:** ajdList = \[\[4\], \[0, 3\], \[0, 4\], \[2, 4\], \[1\]\]
> -   **Output:** \[\[4\], \[0, 3\], \[0, 4\], \[2, 4\], \[1\]\]
> -   **Explanation:** Above is the cloned adj list.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<vector<int>> cloneAdjacencyList(vector<vector<int>> &adjList
    ) {
        int n = adjList.size();

        // Create a new adjacency list for the cloned adjList
        vector<vector<int>> clonedList(n);

        // Copy each node's neighbours from the original adjList to the
        // cloned adjList
        for (int i = 0; i < n; i++) {

            // Iterate over the neighbours of node i in the original
            // adjList
            for (int j = 0; j < adjList[i].size(); j++) {

                // Add the neighbour to the cloned adjList
                clonedList[i].push_back(adjList[i][j]);
            }
        }

        // Return the cloned adjList
        return clonedList;
    }
};
```

***

# Adjacency list to adjacency matrix

## Problem Statement

Given the **adjacency list** of a directed graph, write a function to convert it to an adjacency matrix.

### Example 1

> -   **Input:** ajdList = \[\[1, 3\], \[4\], \[4\], \[2\], \[3\]\]
> -   **Output:** \[\[0, 1, 0, 1, 0\], \[0, 0, 0, 0, 1\], \[0, 0, 0, 0, 1\], \[0, 0, 1, 0, 0\], \[0, 0, 0, 1, 0\]\]
> -   **Explanation:** Above is the adjacency matrix of the graph derived from the adjacency list.

### Example 2

> -   **Input:** ajdList = \[\[4\], \[0, 3\], \[0, 4\], \[2, 4\], \[1\]\]
> -   **Output:** \[\[0, 0, 0, 0, 1\], \[1, 0, 0, 1, 0\], \[1, 0, 0, 0, 1\], \[0, 0, 1, 0, 1\], \[0, 1, 0, 0, 0\]\]
> -   **Explanation:** Above is the adjacency matrix of the graph derived from the adjacency list.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<vector<int>> adjacencyListToAdjacencyMatrix(
        vector<vector<int>> &adjList
    ) {
        int n = adjList.size();

        // Initialize adjacency matrix with 0s
        vector<vector<int>> adjMatrix(n, vector<int>(n, 0));

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < adjList[i].size(); j++) {
                int neighbour = adjList[i][j];

                // Mark the corresponding cell in the matrix as 1
                adjMatrix[i][neighbour] = 1;
            }
        }

        return adjMatrix;
    }
};
```

***

# Adjacency matrix to adjacency list

## Problem Statement

Given the **adjacency matrix** of a directed graph, write a function to convert it to an adjacency list.

### Example 1

> -   **Input:** adjMatrix = \[\[0, 1, 0, 1, 0\], \[0, 0, 0, 0, 1\], \[0, 0, 0, 0, 1\], \[0, 0, 1, 0, 0\], \[0, 0, 0, 1, 0\]\]
> -   **Output:** \[\[1, 3\], \[4\], \[4\], \[2\], \[3\]\]
> -   **Explanation:** Above is the adjacency list of the graph derived from the adjacency matrix.

### Example 2

> -   **Input:** ajdList = \[\[0, 0, 0, 0, 1\], \[1, 0, 0, 1, 0\], \[1, 0, 0, 0, 1\], \[0, 0, 1, 0, 1\], \[0, 1, 0, 0, 0\]\]
> -   **Output:** \[\[4\], \[0, 3\], \[0, 4\], \[2, 4\], \[1\]\]
> -   **Explanation:** Above is the adjacency list of the graph derived from the adjacency matrix.

## Solution

```cpp
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<vector<int>> adjacencyMatrixToAdjacencyList(
        vector<vector<int>> &adjMatrix
    ) {
        int n = adjMatrix.size();
        vector<vector<int>> adjList(n);

        // Traverse the adjacency matrix
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {

                // If an edge exists between nodes i and j
                if (adjMatrix[i][j] == 1) {

                    // Add node j to the adjacency list of node i
                    adjList[i].push_back(j);
                }
            }
        }

        return adjList;
    }
};
```
