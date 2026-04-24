# Adjacency matrix representation

## Table of Contents

1. [Structure of an adjacency matrix](#structure-of-an-adjacency-matrix)
2. [Implementation of adjacency matrix](#implementation-of-adjacency-matrix)
3. [Enhanced implementation techniques](#enhanced-implementation-techniques)

***

# Structure of an adjacency matrix

Now that we know the logical representation of a graph and how it stores many relationships between data, we can look at how it can be implemented in computer memory as a data structure. An adjacency matrix is the simplest way to implement a graph in any language. Consider the following graph as an example.

// Diagram: An example graph

If we look at the graph as a set of edges connecting different nodes, the easiest way to implement it in memory is to store all its edges. If we map the relationship of one node with **all** other nodes in a matrix, we can store the graph as a matrix.

However, to do so, we need some way to identify each node uniquely. The easiest and recommended way to do that is to **enumerate** all nodes in the graph. We assign unique values between 0 and N-1 to all nodes, where N is the total number of nodes.

// Diagram: Enumerate the nodes in the graph

We can then create an NxN matrix to store relationships between all those nodes. This matrix is called the **adjacency matrix**, which is a boolean matrix in its simplest form. For any given pair of nodes, say `i, j` it stores `true` in the cell `i, j` if there is an edge between them or `false` otherwise.

// Diagram: Adjacency matrix representation of a graph

An adjacency matrix is usually used to implement an undirected, unweighted graph, meaning it cannot store edge weights and direction. We will learn more about the enhanced adjacency matrix, which can store all kinds of graphs, but the most basic version only stores boolean true or false.

## Representation in memory

The logical representation of a graph looks like a complicated interconnected web of nodes. However, implementing it using an adjacency matrix is stored in memory as a two-dimensional boolean array.

// Diagram: Adjacency matrix layout in memory

Now that we know an adjacency matrix, we will learn more about creating a graph using one later in the course.

***

# Implementation of adjacency matrix

To create a graph data structure, we need data items and the relationship between them. We need the total number of nodes and a list of edges to implement an adjacency matrix. This information is usually available as data from the problem statement or the use case. Let's consider the following graph as an example to learn how to implement a graph using an adjacency matrix. 

// Diagram: An example graph

## Implementation

To implement the graph, we create a function that takes the total number of nodes and a list of edges as input. We then create a boolean `NxN` matrix where `N` is the total number of nodes, and it is initialized with all false values. We then iterate over the list of edges and the cell `i, j` to true if there is an edge between node numbers `i` and `j`.

C++

```cpp
vector<vector<bool>> createGraph(int nodes, vector<vector<int>>& edges)
{
    // Create adjacency matrix
    vector<vector<bool>> adj(nodes, vector<bool>(n, false));

    for (auto edge: edges)
    {
        // Update cells both ways for undirected graphs
        adj[edge[0]][edge[1]] = true;
        adj[edge[1]][edge[0]] = true;
    }

    return adj;
}
```

Java

```java
public boolean[][] createGraph(int nodes, int[][] edges)
{
    // Create adjacency matrix
    boolean[][] adj = new bool[nodes][nodes];

    for(int i=0; i<adj.length; i++)
    {
        for(int j=0; j< adj[i].length; j++)
        {
            adj[i][j] = false;
        }

    for (int[] edge: edges)
    {
        // Update cells both ways for undirected graphs
        adj[edge[0]][edge[1]] = true;
        adj[edge[1]][edge[0]] = true;
    }

    return adj;
}
```

Typescript

```typescript
createGraph(nodes: number, int[][] edges) : boolean[][]
{
    // Create adjacency matrix
    let adj: boolean[][] = Array(nodes).fill().map(() => Array(nodes).fill(false));

    for (let edge: boolean[] of edges)
    {
        // Update cells both ways for undirected graphs
        adj[edge[0]][edge[1]] = true;
        adj[edge[1]][edge[0]] = true;
    }

    return adj;
}
```

Javascript

```javascript
createGraph(nodes, edges)
{
    // Create adjacency matrix
    let adj = Array(nodes).fill().map(() => Array(nodes).fill(false));

    for (let edge of edges)
    {
        // Update cells both ways for undirected graphs
        adj[edge[0]][edge[1]] = true;
        adj[edge[1]][edge[0]] = true;
    }

    return adj;
}
```

Python

```python
def create_graph(nodes, edges)
    # Create adjacency matrix
    adj = [[False] * nodes] * nodes

    for edge in edges:
        # Update cells both ways for undirected graphs
        adj[edge[0]][edge[1]] = True;
        adj[edge[1]][edge[0]] = True;

    return adj
```

## Complexity Analysis

To create the matrix, we iterate over the list of all edges and update the cell. Updating the boolean value is a constant-time operation, but the iteration takes linear time, so the time complexity is **O(E)**, where E is the total number of edges in the graph.

The matrix has NXN sie, where N is the number of nodes, so the space complexity is **O(N^2)**.

> **Best Case**
>
> -   Space Complexity - **O(N^2)**
> -   Time Complexity - **O(E)**
>
> **Worst Case**
>
> -   Space Complexity - **O(N^2)**
> -   Time Complexity - **O(E)**

***

# Enhanced implementation techniques

An adjacency matrix is an easy and effective way to implement a graph in memory. However, it is not the best way to do it. Some graphs cannot be implemented using the basic boolean matrix implementation.

> Adjacency matrix implementation cannot store:
>
> -   Weighted edges
> -   Data value at nodes

// Diagram: Adjacency matrix cannot store graphs with edge weights and node data

An adjacency matrix only stores the relationship between nodes and nothing about the node. Also, it only stores the **existence** of an edge between two nodes, so it cannot store any additional edge data, such as weights. Let us look at how to modify the implementation to store this data.

## Store weighted edges

To implement a weighted graph, we can modify the adjacency matrix to hold numerical values instead of boolean `true` and `false`. We initialize the matrix with a **sentinel value** (a value that can never be a valid weight value). We store the weight in the cell `i, j` if there is a weighted edge between nodes enumerated `i` and `j`. This way, we can assert the existence of an edge between nodes if the cell holds any value other than the sentinel value and the value is the weight of the edge itself.

// Diagram: Storing weighted edges in adjacency matrix

The implementation is only very slightly different from the boolean adjacency matrix. We create a function that takes the total number of nodes and a list of edges as input. We then create a numerical `NxN` matrix where `N` is the total number of nodes, and it is initialized with all sentinel values. We then iterate over the list of edges and set the cell `i, j` to the weight of the edge between the node numbers `i` and `j`.

C++

```cpp
/*
 * Function to create graph
 * nodes[in]: A list node data
 * edges[in]: A list of weighted edges. An edge is a list storing
 * source node, destination node and weight respectively
 *
 * retuns: Adjacency matrix
*/
vector<vector<bool>> createGraph(vector<int>& nodes, vector<vector<int>>& edges)
{
    // Create adjacency matrix, sentinal is -1
    vector<vector<int>> adj(nodes.size(), vector<int>(nodes.size(), -1));

    for (auto edge: edges)
    {
        // Update cells both ways for undirected graph
        adj[edge[0]][edge[1]] = edge[2];
        adj[edge[1]][edge[0]] = edge[2];
    }

    return adj;
}
```

Java

```java
/*
 * Function to create graph
 * nodes: The number of nodes in the graph
 * edges[in]: A list of edges. An edge is a list storing
 * the two nodes it connects.
 *
 * retuns: Adjacency matrix
 */
public boolean[][] createGraph(int nodes, int[][] edges)
{
    // Create adjacency matrix, sentinel is -1
    boolean[][] adj = new bool[nodes][nodes];

    for(int i=0; i<adj.length; i++)
    {
        for(int j=0; j< adj[i].length; j++)
        {
            adj[i][j] = -1;
        }

    for (int[] edge: edges)
    {
        // Update cells both ways for undirected graphs
        adj[edge[0]][edge[1]] = edge[2];
        adj[edge[1]][edge[0]] = edge[2];

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
 * the two nodes it connects.
 *
 * retuns: Adjacency matrix
 */
createGraph(nodes: number, edges: number[][]) : boolean[][]
{
    // Create adjacency matrix, sentinel is -1
    let adj: boolean[][] = Array(nodes).fill().map(() => Array(nodes).fill(-1));

    for (let edge: boolean[] of edges)
    {
        // Update cells both ways for undirected graphs
        adj[edge[0]][edge[1]] = edge[2];
        adj[edge[1]][edge[0]] = edge[2];
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
 * the two nodes it connects.
 *
 * retuns: Adjacency matrix
 */
createGraph(nodes, edges)
{
    // Create adjacency matrix, sentinel is -1
    let adj = Array(nodes).fill().map(() => Array(nodes).fill(-1));

    for (let edge of edges)
    {
        // Update cells both ways for undirected graphs
        adj[edge[0]][edge[1]] = edge[2];
        adj[edge[1]][edge[0]] = edge[2];
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
 * the two nodes it connects.
 *
 * retuns: Adjacency matrix
"""
def create_graph(nodes, edges):
    # Create adjacency matrix, sentinel is -1
    adj = [[-1] * nodes] * nodes

    for edge in edges:
        # Update cells both ways for undirected graphs
        adj[edge[0]][edge[1]] = edge[2];
        adj[edge[1]][edge[0]] = edge[2];

    return adj
```

## Store data at nodes

To implement a graph that also holds some data at the node, we need to create another array to hold that data. Since the nodes of the graphs are enumerated from 0 to N-1, we can create a single array of size N and use the enumeration of a node as its index in the array to store data. We can also define a custom datatype if the data to be stored is complex.

// Diagram: Storing node data and edge data in adjacency matrix and array

The implementation uses an array to store the node data for each node. Since the nodes are enumerated from 0 to N-1, the data at an index `i` in the array is the data for the node `i`. When creating the graph, we take this array as an additional input along with the list of edges. We then create a numerical `NxN` matrix where `N` is the total number of nodes, and it is initialized with all sentinel values. We then iterate over the list of edges and set the cell `i, j` to the weight of the edge between the node numbers `i` and `j`.

C++

```cpp
/*
 * Function to create graph
 * nodes[in]: A list node data
 * edges[in]: A list of weighted edges. An edge is a list storing
 * source node, destination node and weight respectively
 *
 * retuns: Adjacency matrix
*/
vector<vector<bool>> createGraph(vector<int>& nodes, vector<vector<int>>& edges)
{
    // Create adjacency matrix, sentinal is -1
    vector<vector<int>> adj(nodes.size(), vector<int>(nodes.size(), -1));

    for (auto edge: edges)
    {
        // Update cells both ways for undirected graph
        adj[edge[0]][edge[1]] = edge[2];
        adj[edge[1]][edge[0]] = edge[2];
    }

    return adj;
}
```

Java

```java
/*
 * Function to create graph
 * nodes: The number of nodes in the graph
 * edges[in]: A list of edges. An edge is a list storing
 * the two nodes it connects.
 *
 * retuns: Adjacency matrix
 */
public boolean[][] createGraph(int nodes, int[][] edges)
{
    // Create adjacency matrix, sentinel is -1
    boolean[][] adj = new bool[nodes][nodes];

    for(int i=0; i<adj.length; i++)
    {
        for(int j=0; j< adj[i].length; j++)
        {
            adj[i][j] = -1;
        }

    for (int[] edge: edges)
    {
        // Update cells both ways for undirected graphs
        adj[edge[0]][edge[1]] = edge[2];
        adj[edge[1]][edge[0]] = edge[2];

    }

    return adj;
}
```

Typescript

```typescript
/*
 * Function to create graph
 * nodes[in]: A list node data
 * edges[in]: A list of weighted edges. An edge is a list storing
 * the nodes it connects and weight respectively
 *
 * retuns: Adjacency matrix
*/
createGraph(nodes: number[], edges: number[][]) : boolean[][]
{
    // Create adjacency matrix, sentinel is -1
    let adj: boolean[][] = Array(nodes.length).fill().map(() => Array(nodes.length).fill(-1));

    for (let edge: boolean[] of edges)
    {
        // Update cells both ways for undirected graphs
        adj[edge[0]][edge[1]] = edge[2];
        adj[edge[1]][edge[0]] = edge[2];
    }

    return adj;
}
```

Javascript

```javascript
/*
 * Function to create graph
 * nodes[in]: A list node data
 * edges[in]: A list of weighted edges. An edge is a list storing
 * the nodes it connects and weight respectively
 *
 * retuns: Adjacency matrix
*/
createGraph(nodes, edges)
{
    // Create adjacency matrix, sentinel is -1
    let adj = Array(nodes.length).fill().map(() => Array(nodes.length).fill(-1));

    for (let edge of edges)
    {
        // Update cells both ways for undirected graphs
        adj[edge[0]][edge[1]] = edge[2];
        adj[edge[1]][edge[0]] = edge[2];
    }

    return adj;
}
```

Python

```python
"""
 * Function to create graph
 * nodes[in]: A list node data
 * edges[in]: A list of weighted edges. An edge is a list storing
 * the nodes it connects and weight respectively
 *
 * retuns: Adjacency matrix
"""
def create_graph(nodes, edges):
    # Create adjacency matrix, sentinel is -1
    adj = [[-1] * len(nodes)] * len(nodes)

    for edge in edges:
        # Update cells both ways for undirected graphs
        adj[edge[0]][edge[1]] = edge[2];
        adj[edge[1]][edge[0]] = edge[2];

    return adj
```
