# Introduction to graphs

## Table of Contents

1. [Understanding the problem](#understanding-the-problem)
2. [Exploring a possible solution](#exploring-a-possible-solution)
3. [Graph terminologies](#graph-terminologies)
4. [Types of graphs](#types-of-grahs)

***

# Understanding the problem

To better understand graphs, we must consider some of the challenges programmers face when designing software systems. A data structure is primarily used to store and retrieve data efficiently. All linear data structures store data **sequentially**, like arrays, linked lists, stacks, and queues. On the other hand, tree data structures, like binary trees and heaps, store data **hierarchically**. 

When designing solutions to complex problems, we often need some way to model the **relationship** between multiple data items. While a tree can model parent-child relationships, it cannot model many-to-many relationships.

## Travel booking problem

For example, we are looking to create a travel booking website that will show flight connections between cities. To accomplish this, we need to tackle two specific problems, which are outlined below. Let's review these problems to understand the limitations of existing data structures.

### Finding the minimum hops between cities 

When users enter their current city and the city they want to travel to, we want to provide them with the smallest number of hops to their destination.

// Diagram: We have data as list of flight connections between cities

Storing this data in a tree is impossible as there could be cycles, and a tree, by definition, is acyclic. One way to model this data is to store these connections in multiple lists, where each list has two nodes representing the two cities, and the link between them represents the flight connection.

// Diagram: Storing raw airline data as linked list

While we can store data this way, answering user queries would need a complicated algorithm and be inefficient.

### Finding maximum number of flights for a given budget

Now, let's consider another scenario. Consider that we also have airfare for travel between each city, and we want to extend our offering and provide the user with the maximum number of flights they can take for a given amount of money from a source city. The destination doesn't matter; we only want to provide the user with the **maximum** number of flights they can take.

// Diagram: How do we store airline data with airfare?

It must be obvious that none of the linear or hierarchical data structures can easily model this problem. So, how do we efficiently model and store this data?

***

# Exploring a possible solution

Now that we know that linear data structures cannot efficiently store many-to-many relationships, let's look at a data structure designed to solve this problem efficiently. A graph is a non-linear data structure comprising one or more nodes connected via links called edges. Each connection between nodes represents the relationship between the nodes. A graph data structure stores and manipulates many-to-many relationships between data.

// Diagram: Logical representation of a graph

Each edge in the graph can hold data, often called the edge's weight. Depending on what the graph represents, the weight could be anything.

// Diagram: Edges in a graph can hold weights

## Travel booking problem

Continuing our earlier example, we can use a graph to model the airfare data for our travel booking website. Each node could be a city, and we could add edges between cities with direct flights. Further to our example, we can assign weight to these edges, representing the airfare between the respective cities.

// Diagram: Logical representation of airline data with a graph

A graph representation of cities and airfare is much more intuitive and easy to understand. Adding new cities or new flight connections is also quite simple, as we only need to add a node and connect it to nodes that can be reached via direct flights.

### Finidng minimum hops between cities

To find the minimum number of hops between two cities, we can start from the source city and trace all paths leading to the destination city while counting hops. We can then return the path with the minimum number of hops to the user.

// Diagram: Find the minimum number of hops between two cities

### Finding optimal number of fights for a given budget

To solve this query, we need to add airfare as a weight to the edges of our graph and trace all paths from the source city while counting the hops and adding airfare along the way. The point where we exhaust our money is when we return and trace a different path. This way, we will have a list of all the paths we can take from the source city for the given money and the number of hops needed for each path. Ultimately, we return the path with the maximum hops to the user.

// Diagram: Find the maximum flights a user can take from City A for 600

A graph is a powerful data structure that can solve such problems at scale. What we did intuitively while answering the user queries earlier was a dry run of the most commonly used graph traversal algorithms. There are many types of graphs and many associated terminologies. Later in this course, we will learn more about implementing a graph in computer memory and the most commonly used graph algorithms.

***

# Graph Terminologies

A graph is an advanced non-linear (two-dimensional) data structure, and that is why it can be drawn in so many more complex ways than sequential data structures, such as arrays and linked lists. We need special terminologies to correctly identify and express these different graphs without drawing diagrams. These terminologies make it easier for us to express the different types of graphs more formally. Some of the most widely used graph terminologies are listed below.

## Vertex

A node in a graph is also called a vertex. The node primarily holds the data and the references to all the adjacent nodes.

// Diagram: Vertex in a graph

## Edge

An edge in a graph is the link connecting any two nodes. An edge can either be directed or undirected. A directed edge represents a one-way connection between two nodes. It can be traversed only in one direction and not vice versa. An undirected edge, on the other hand, represents a two-way connection between two nodes that can be traversed in both directions. A graph can have both directed and undirected edges.

// Diagram: A directed and undirected edge in a graph

## Degree

The degree of a vertex is the number of edges that are incident to the vertex.

// Diagram: The degree of a vertex

## Inderee and outdegree

The indegree and outdegree are most commonly used for graphs with all directed edges. The indegree is the total number of incoming edges incident on a vertex, while the outdegree is the total number of outgoing edges from a vertex.

// Diagram: Indegree and outdegree of a vertex

## Path

A path in a graph is a sequence of edges that joins a sequence of distinct vertices. In simpler terms, a path is a way to reach a destination node from a source node by following a sequence of edges, where all edges and vertices crossed by those edges are distinct.

// Diagram: A path between two nodes A and B

As we will learn later in the course, these graph terminologies help us define complex graphs without diagrams and different types/categories of graphs.

***

# Types of grahs

A graph is a fairly advanced data structure used to model complex relationships. Its logical representation may seem like a simple network of nodes and edges, but the underlying data it represents gives this structure meaning. Graphs can be drawn in many ways, but some broad categories of graphs are most commonly used. These categories of graphs can model a large subset of all possible data relationships. This section will learn more about these types of graphs and some of their use cases.

All the types mentioned are not mutually exclusive. This means a graph can simultaneously be of many of the following types.

## Undirected graph

An undirected graph is where all the edges in the graph are undirected. Undirected graphs represent relationships between data items that hold both ways, like the distance between cities, the social connection between people, etc.

// Diagram: An undirected graph has bidirectional relationship

## Directed graph

A directed (graph, also called a **digraph**) is one where all edges in the graph are directed (unidirectional) edges. Directed graphs arise naturally, modeling interdependent data. For example, modeling a project schedule where some tasks can only be started when other tasks are completed. In this case, an outward edge from a node means that this task must be completed before the task represented by the node where this edge terminates.

// Diagram: A directed graph representing dependencies of tasks on each other

## Weighted graph

A weighted graph is a graph in which the edges are assigned a numerical value called weight. Depending on the graph's representation, the weight quantifies the connection/relationship between two nodes, such as distance, cost, time, etc.

// Diagram: A weighted graph has a numerical value associated with every edge

## Connected and disconnected graph

A connected graph is a graph where there is a path between any two vertices. This means that any vertex in the graph can be reached from any other vertex. A disconnected graph, on the other hand, is a graph with at least one pair of vertices with no path connecting them.

// Diagram: A connected and disconnected graph

## Cyclic graph

A cycle in a graph is defined as a path that begins and ends at the same vertex without crossing any vertex twice. A cyclic graph is a graph that has at least one cycle.

// Diagram: A cyclic graph is one that a cycle

## Directed acyclic graph

A directed acyclic graph (DAG) is a graph that does not have cycles. It can represent hierarchical relationships while still providing the flexibility of a graph. A DAG arises naturally when modeling interrelated hierarchical data like database schemas or UML diagrams or representing scientific and biological data relationships like evolution, family trees, scheduling, etc.

A DAG may look like a tree at first glance, but it is NOT a tree. Unlike trees, a node in a DAG can have multiple parents.

// Diagram: A directed acyclic graph representing animal relationship

## Bipartite graph

A bipartite graph is a special type where the vertices can be separated into two disjoint sets. All the edges in the graph connect a vertex in one set to a vertex in another. There is no edge between vertices of the same set. Bipartite graphs are very common and arise naturally when modeling relationships that match data from two sets. For example, assigning a group of football players (1 set) to a group of football clubs (1 set).

// Diagram: A bipartite graph representing assignment of football players to teams

There are many more types of graphs, and they are much more advanced and not very commonly used, so they are out of the scope of this course. Now that we know these different types of graphs, we will learn more about their use cases and special algorithms that help harvest information represented in these graphs.
