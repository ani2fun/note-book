# 3. Adjacency list representation

This lesson covers the **adjacency list** — the representation that fits the way most graphs in the real world actually look. By the end you'll know exactly why this is the default choice for graph problems, and you'll be able to convert freely between matrix and list whenever the problem demands it.

## Table of contents

1. [The matrix's blind spot](#the-matrixs-blind-spot)
2. [Structure of an adjacency list](#structure-of-an-adjacency-list)
3. [Implementation](#implementation)
4. [Storing weighted edges](#storing-weighted-edges)
5. [Storing data on nodes](#storing-data-on-nodes)
6. [Complexity analysis](#complexity-analysis)
7. [Problem: Clone an adjacency list](#problem-clone-an-adjacency-list)
8. [Problem: Adjacency list → adjacency matrix](#problem-adjacency-list--adjacency-matrix)
9. [Problem: Adjacency matrix → adjacency list](#problem-adjacency-matrix--adjacency-list)

***

# The Matrix's Blind Spot

The adjacency matrix has one fatal flaw: it pays for **every edge that *could* exist**, even when most of them don't. A graph of 10 000 nodes with 20 000 edges still costs `10 000² = 100 million` cells — 99.98% of which are wasted.

Real graphs are mostly **sparse**. Your phone contacts: a few hundred people, each connected to a few dozen others — not to every other person on Earth. Wikipedia: millions of articles, each linking to maybe 50 others — not to every article. The road network of a country: thousands of intersections, each connected to 2-5 neighbours — not to every other intersection.

For graphs like these, asking the matrix to allocate a row of `N` cells per node is criminal. Most of those rows will be 99% empty. We need a representation that **scales with the edges that actually exist**, not with the edges that *could* exist.

> *Before reading on — flip the matrix's view. Instead of "what cells does every node need?", ask "what does each node know about its own edges?". What's the smallest possible answer?*

The smallest possible answer is: each node knows **the list of its neighbours**. Nothing more. If node 0 has 3 neighbours, store 3 IDs. If node 1 has 50 neighbours, store 50 IDs. Pay only for what exists.

That single shift gives us the adjacency list.

***

# Structure of an Adjacency List

Take the same 5-node graph from the matrix lesson.

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#64748b"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart LR
    A((A)) --- B((B))
    A --- C((C))
    B --- C
    B --- D((D))
    C --- E((E))
    D --- E
```

<p align="center"><strong>The same example graph from the previous lesson — 5 nodes, 6 edges, undirected.</strong></p>

Instead of asking *"between every pair, is there an edge?"* we now ask *"for each node, who are its neighbours?"*. Walk through the graph node by node:

| Node | Direct neighbours |
|---|---|
| 0 (A) | 1, 2 |
| 1 (B) | 0, 2, 3 |
| 2 (C) | 0, 1, 4 |
| 3 (D) | 1, 4 |
| 4 (E) | 2, 3 |

Each row is a small list. Some short, some longer. **Nothing wasted.**

---

## Step 1 — Enumerate the Nodes

The same enumeration trick from the matrix lesson: assign every node an integer `0` to `N-1`. We need this so the *outer* container can be a flat array indexed by node ID.

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#64748b"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart LR
    A(("A<br/>0")) --- B(("B<br/>1"))
    A --- C(("C<br/>2"))
    B --- C
    B --- D(("D<br/>3"))
    C --- E(("E<br/>4"))
    D --- E
```

<p align="center"><strong>Each node carries a unique integer ID. Same enumeration as for the matrix — the integer drives the indexing.</strong></p>

---

## Step 2 — Build a List of Lists

Create an outer array of size `N`. At index `i` store the list of integers — the IDs of node `i`'s neighbours.

```d2
direction: right

outer: "Outer array (one slot per node)" {
  grid-rows: 5
  grid-columns: 1
  grid-gap: 0
  o0: |md
    **0 (A)** → [1, 2]
  |
  o1: |md
    **1 (B)** → [0, 2, 3]
  |
  o2: |md
    **2 (C)** → [0, 1, 4]
  |
  o3: |md
    **3 (D)** → [1, 4]
  |
  o4: |md
    **4 (E)** → [2, 3]
  |
}
```

<p align="center"><strong>The adjacency list. The outer array indexes by node ID. Each cell holds the inner list of that node's neighbours.</strong></p>

The total number of integers stored across all inner lists is **`2 × E`** for an undirected graph (each edge contributes its two endpoints to two different lists) and **`E`** for a directed graph. Compare this to the matrix's unconditional `N²`. For a sparse graph that's a massive win.

---

## How It Lives in Memory

The outer container is a fixed-size array of N slots. Each slot holds a *reference* to a dynamically-sized inner array (a `vector` / `ArrayList` / `list`). The inner arrays live elsewhere in the heap and grow on demand.

```d2
direction: right

outer: "Outer array (size N)" {
  grid-rows: 5
  grid-columns: 1
  grid-gap: 0
  o0: "0 →"
  o1: "1 →"
  o2: "2 →"
  o3: "3 →"
  o4: "4 →"
}

inner0: "Inner list for 0" {
  grid-rows: 1
  grid-columns: 2
  grid-gap: 0
  c0: "1"
  c1: "2"
}

inner1: "Inner list for 1" {
  grid-rows: 1
  grid-columns: 3
  grid-gap: 0
  c0: "0"
  c1: "2"
  c2: "3"
}

inner2: "Inner list for 2" {
  grid-rows: 1
  grid-columns: 3
  grid-gap: 0
  c0: "0"
  c1: "1"
  c2: "4"
}

inner3: "Inner list for 3" {
  grid-rows: 1
  grid-columns: 2
  grid-gap: 0
  c0: "1"
  c1: "4"
}

inner4: "Inner list for 4" {
  grid-rows: 1
  grid-columns: 2
  grid-gap: 0
  c0: "2"
  c1: "3"
}

outer.o0 -> inner0
outer.o1 -> inner1
outer.o2 -> inner2
outer.o3 -> inner3
outer.o4 -> inner4
```

<p align="center"><strong>Outer array indexes by node; each slot points to a separately-allocated inner array of neighbours. Inner arrays size themselves to the actual degree of each node.</strong></p>

Why dynamic arrays for the inner lists rather than linked lists? Two reasons:

1. **Random access** — to scan a node's neighbours quickly, contiguous memory wins (the CPU prefetcher loves it).
2. **Locality of reference** — `vector` / `ArrayList` keeps neighbours adjacent in cache, while linked-list nodes scatter across the heap and incur a cache miss per pointer follow.

Linked-list-based adjacency lists do exist in textbooks but are essentially never the right choice in modern code. Default to dynamic arrays.

So how do we build this in a single pass over the edge list?

***

# Implementation

The function `createGraph` takes the node count `N` and the edge list, and returns the list of lists.

Two steps:

1. Allocate an outer array of `N` empty inner lists.
2. For each edge `(u, v)`, append `v` to `adj[u]` and `u` to `adj[v]` (the second line is the "undirected" half).

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#64748b"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart LR
    Input["Input:<br/>nodes = 5<br/>edges = [[0,1],[0,2],<br/>[1,2],[1,3],[2,4],[3,4]]"] --> Init["Allocate outer array<br/>of N empty lists"]
    Init --> Loop["For each edge (u,v):<br/>adj[u].append(v)<br/>adj[v].append(u)"]
    Loop --> Out["Return adjacency list"]
```

<p align="center"><strong>Two-step build. Each edge appends one entry to each of its two endpoint's lists.</strong></p>

<div class="lang-tabs">

```python,editable
from typing import List

def create_graph(nodes: int, edges: List[List[int]]) -> List[List[int]]:
    # IMPORTANT: write [[] for _ in range(nodes)], NOT [[]] * nodes.
    # The latter creates n references to the SAME inner list — appending
    # to one row mutates every row.
    adj: List[List[int]] = [[] for _ in range(nodes)]

    for u, v in edges:
        # Append v to u's list AND u to v's list — the edge is undirected.
        adj[u].append(v)
        adj[v].append(u)
    return adj


edges = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4]]
adj = create_graph(5, edges)
for i, neighbours in enumerate(adj):
    print(f"{i}: {neighbours}")
```

```java,editable
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static List<List<Integer>> createGraph(int nodes, int[][] edges) {
        // Outer list pre-sized; each slot holds an empty ArrayList ready to grow.
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < nodes; i++) adj.add(new ArrayList<>());

        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);
        }
        return adj;
    }

    public static void main(String[] args) {
        int[][] edges = {{0, 1}, {0, 2}, {1, 2}, {1, 3}, {2, 4}, {3, 4}};
        List<List<Integer>> adj = createGraph(5, edges);
        for (int i = 0; i < adj.size(); i++) System.out.println(i + ": " + adj.get(i));
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>

// A growable array of neighbours per node — capacity doubles when full.
typedef struct {
    int* data;
    int  size;
    int  capacity;
} Vec;

static void vec_push(Vec* v, int x) {
    if (v->size == v->capacity) {
        // Double capacity to keep amortised append O(1).
        v->capacity = v->capacity == 0 ? 4 : v->capacity * 2;
        v->data = realloc(v->data, v->capacity * sizeof(int));
    }
    v->data[v->size++] = x;
}

Vec* create_graph(int nodes, int edges[][2], int edge_count) {
    Vec* adj = calloc(nodes, sizeof(Vec));  // calloc → all fields zero, including data=NULL.

    for (int i = 0; i < edge_count; i++) {
        vec_push(&adj[edges[i][0]], edges[i][1]);
        vec_push(&adj[edges[i][1]], edges[i][0]);
    }
    return adj;
}

int main() {
    int edges[][2] = {{0,1},{0,2},{1,2},{1,3},{2,4},{3,4}};
    Vec* adj = create_graph(5, edges, 6);

    for (int i = 0; i < 5; i++) {
        printf("%d: ", i);
        for (int j = 0; j < adj[i].size; j++) printf("%d ", adj[i].data[j]);
        printf("\n");
        free(adj[i].data);
    }
    free(adj);
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

std::vector<std::vector<int>> createGraph(int nodes, std::vector<std::vector<int>>& edges) {
    // Outer vector is pre-sized; inner vectors start empty and grow on demand.
    std::vector<std::vector<int>> adj(nodes);

    for (auto& e : edges) {
        adj[e[0]].push_back(e[1]);
        adj[e[1]].push_back(e[0]);
    }
    return adj;
}

int main() {
    std::vector<std::vector<int>> edges = {{0,1},{0,2},{1,2},{1,3},{2,4},{3,4}};
    auto adj = createGraph(5, edges);
    for (int i = 0; i < (int)adj.size(); i++) {
        std::cout << i << ": ";
        for (int v : adj[i]) std::cout << v << " ";
        std::cout << "\n";
    }
}
```

```scala,editable
import scala.collection.mutable.ArrayBuffer

object Main extends App {
  def createGraph(nodes: Int, edges: Array[Array[Int]]): Array[ArrayBuffer[Int]] = {
    // Array.fill builds N independent ArrayBuffers — no aliasing.
    val adj = Array.fill(nodes)(ArrayBuffer.empty[Int])

    for (e <- edges) {
      adj(e(0)).append(e(1))
      adj(e(1)).append(e(0))
    }
    adj
  }

  val edges = Array(Array(0,1), Array(0,2), Array(1,2), Array(1,3), Array(2,4), Array(3,4))
  val adj = createGraph(5, edges)
  adj.zipWithIndex.foreach { case (n, i) => println(s"$i: ${n.mkString(", ")}") }
}
```

```javascript,editable
function createGraph(nodes, edges) {
    // Same trap as Python: do NOT use Array(n).fill([]) — every slot would
    // point to the same array. Use a factory.
    const adj = Array.from({length: nodes}, () => []);

    for (const [u, v] of edges) {
        adj[u].push(v);
        adj[v].push(u);
    }
    return adj;
}

const edges = [[0,1],[0,2],[1,2],[1,3],[2,4],[3,4]];
const adj = createGraph(5, edges);
adj.forEach((neighbours, i) => console.log(`${i}: ${neighbours.join(", ")}`));
```

```typescript,editable
function createGraph(nodes: number, edges: number[][]): number[][] {
    const adj: number[][] = Array.from({length: nodes}, () => []);

    for (const [u, v] of edges) {
        adj[u].push(v);
        adj[v].push(u);
    }
    return adj;
}

const edges: number[][] = [[0,1],[0,2],[1,2],[1,3],[2,4],[3,4]];
const adj = createGraph(5, edges);
adj.forEach((neighbours, i) => console.log(`${i}: ${neighbours.join(", ")}`));
```

```go,editable
package main

import "fmt"

func createGraph(nodes int, edges [][2]int) [][]int {
    // Slice of slices; inner slices start nil (Go append works on nil slices).
    adj := make([][]int, nodes)
    for _, e := range edges {
        adj[e[0]] = append(adj[e[0]], e[1])
        adj[e[1]] = append(adj[e[1]], e[0])
    }
    return adj
}

func main() {
    edges := [][2]int{{0,1},{0,2},{1,2},{1,3},{2,4},{3,4}}
    adj := createGraph(5, edges)
    for i, n := range adj {
        fmt.Printf("%d: %v\n", i, n)
    }
}
```

```kotlin,editable
fun createGraph(nodes: Int, edges: Array<IntArray>): Array<MutableList<Int>> {
    // Array(n) {...} builds N independent MutableLists.
    val adj = Array(nodes) { mutableListOf<Int>() }

    for (e in edges) {
        adj[e[0]].add(e[1])
        adj[e[1]].add(e[0])
    }
    return adj
}

fun main() {
    val edges = arrayOf(intArrayOf(0,1), intArrayOf(0,2), intArrayOf(1,2),
                        intArrayOf(1,3), intArrayOf(2,4), intArrayOf(3,4))
    val adj = createGraph(5, edges)
    adj.forEachIndexed { i, n -> println("$i: $n") }
}
```

```rust,editable
fn create_graph(nodes: usize, edges: &[[usize; 2]]) -> Vec<Vec<usize>> {
    // vec![Vec::new(); n] uses Clone — safe here because Vec::new() is empty.
    let mut adj: Vec<Vec<usize>> = vec![Vec::new(); nodes];

    for e in edges {
        adj[e[0]].push(e[1]);
        adj[e[1]].push(e[0]);
    }
    adj
}

fn main() {
    let edges = [[0,1],[0,2],[1,2],[1,3],[2,4],[3,4]];
    let adj = create_graph(5, &edges);
    for (i, n) in adj.iter().enumerate() {
        println!("{}: {:?}", i, n);
    }
}
```

</div>

The Python and JavaScript implementations both contain a tiny but vicious gotcha worth calling out again: `[[]] * nodes` and `Array(n).fill([])` *both* create `n` references to **the same** inner list, so every `append` ends up landing in every row at once. Always build the inner lists with a factory (`[[] for _ in range(n)]` or `Array.from({length: n}, () => [])`).

> *Before reading on — for a directed graph, what's the one-line change to the implementation?*

Drop the second `append` line — only `adj[u].append(v)`. The asymmetry of the resulting list is the asymmetry of the directed edges.

***

# Storing Weighted Edges

For weighted graphs the inner lists need to hold **two pieces of information per neighbour**: the neighbour ID *and* the edge weight. Three idiomatic ways to do this:

1. **Pair / tuple** — `[(neighbour, weight), ...]`. Dead simple, works in every language.
2. **Two parallel lists** — `neighbours = [...]`, `weights = [...]`. Tighter cache layout, ugly to use.
3. **Edge struct** — `{to: int, weight: int}`. Most readable, slightly more memory.

We'll use the pair form here because it's the most universal.

```d2
direction: right

list: "Weighted adjacency list" {
  grid-rows: 5
  grid-columns: 1
  grid-gap: 0
  o0: |md
    **0 (A)** → [(1, 5), (2, 2)]
  |
  o1: |md
    **1 (B)** → [(0, 5), (2, 1), (3, 7)]
  |
  o2: |md
    **2 (C)** → [(0, 2), (1, 1), (4, 4)]
  |
  o3: |md
    **3 (D)** → [(1, 7), (4, 3)]
  |
  o4: |md
    **4 (E)** → [(2, 4), (3, 3)]
  |
}
```

<p align="center"><strong>Each inner list now stores <code>(neighbour, weight)</code> pairs. The graph structure is unchanged; we've simply enriched what every neighbour entry carries.</strong></p>

<div class="lang-tabs">

```python,editable
from typing import List, Tuple

def create_weighted_graph(nodes: int, edges: List[List[int]]) -> List[List[Tuple[int, int]]]:
    adj: List[List[Tuple[int, int]]] = [[] for _ in range(nodes)]

    for u, v, w in edges:
        # Each edge is (u, v, w). Append the pair (other_endpoint, weight) to both lists.
        adj[u].append((v, w))
        adj[v].append((u, w))
    return adj


edges = [[0,1,5],[0,2,2],[1,2,1],[1,3,7],[2,4,4],[3,4,3]]
adj = create_weighted_graph(5, edges)
for i, n in enumerate(adj):
    print(f"{i}: {n}")
```

```java,editable
import java.util.ArrayList;
import java.util.List;

public class Main {
    // (neighbour, weight) — int[2] is the lightest pair representation in Java.
    public static List<List<int[]>> createWeightedGraph(int nodes, int[][] edges) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < nodes; i++) adj.add(new ArrayList<>());

        for (int[] e : edges) {
            adj.get(e[0]).add(new int[]{e[1], e[2]});
            adj.get(e[1]).add(new int[]{e[0], e[2]});
        }
        return adj;
    }

    public static void main(String[] args) {
        int[][] edges = {{0,1,5},{0,2,2},{1,2,1},{1,3,7},{2,4,4},{3,4,3}};
        var adj = createWeightedGraph(5, edges);
        for (int i = 0; i < adj.size(); i++) {
            System.out.print(i + ": ");
            for (int[] p : adj.get(i)) System.out.print("(" + p[0] + "," + p[1] + ") ");
            System.out.println();
        }
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>

typedef struct { int to; int weight; } Edge;
typedef struct { Edge* data; int size; int capacity; } Vec;

static void vec_push(Vec* v, Edge e) {
    if (v->size == v->capacity) {
        v->capacity = v->capacity == 0 ? 4 : v->capacity * 2;
        v->data = realloc(v->data, v->capacity * sizeof(Edge));
    }
    v->data[v->size++] = e;
}

Vec* create_weighted_graph(int nodes, int edges[][3], int edge_count) {
    Vec* adj = calloc(nodes, sizeof(Vec));
    for (int i = 0; i < edge_count; i++) {
        Edge a = { edges[i][1], edges[i][2] };
        Edge b = { edges[i][0], edges[i][2] };
        vec_push(&adj[edges[i][0]], a);
        vec_push(&adj[edges[i][1]], b);
    }
    return adj;
}

int main() {
    int edges[][3] = {{0,1,5},{0,2,2},{1,2,1},{1,3,7},{2,4,4},{3,4,3}};
    Vec* adj = create_weighted_graph(5, edges, 6);
    for (int i = 0; i < 5; i++) {
        printf("%d: ", i);
        for (int j = 0; j < adj[i].size; j++)
            printf("(%d,%d) ", adj[i].data[j].to, adj[i].data[j].weight);
        printf("\n");
        free(adj[i].data);
    }
    free(adj);
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <utility>

using Edge = std::pair<int, int>;  // (to, weight)

std::vector<std::vector<Edge>> createWeightedGraph(int nodes, std::vector<std::vector<int>>& edges) {
    std::vector<std::vector<Edge>> adj(nodes);
    for (auto& e : edges) {
        adj[e[0]].emplace_back(e[1], e[2]);
        adj[e[1]].emplace_back(e[0], e[2]);
    }
    return adj;
}

int main() {
    std::vector<std::vector<int>> edges = {{0,1,5},{0,2,2},{1,2,1},{1,3,7},{2,4,4},{3,4,3}};
    auto adj = createWeightedGraph(5, edges);
    for (int i = 0; i < (int)adj.size(); i++) {
        std::cout << i << ": ";
        for (auto& [v, w] : adj[i]) std::cout << "(" << v << "," << w << ") ";
        std::cout << "\n";
    }
}
```

```scala,editable
import scala.collection.mutable.ArrayBuffer

object Main extends App {
  def createWeightedGraph(nodes: Int, edges: Array[Array[Int]]): Array[ArrayBuffer[(Int, Int)]] = {
    val adj = Array.fill(nodes)(ArrayBuffer.empty[(Int, Int)])
    for (e <- edges) {
      adj(e(0)).append((e(1), e(2)))
      adj(e(1)).append((e(0), e(2)))
    }
    adj
  }

  val edges = Array(Array(0,1,5), Array(0,2,2), Array(1,2,1),
                    Array(1,3,7), Array(2,4,4), Array(3,4,3))
  val adj = createWeightedGraph(5, edges)
  adj.zipWithIndex.foreach { case (n, i) => println(s"$i: ${n.mkString(", ")}") }
}
```

```javascript,editable
function createWeightedGraph(nodes, edges) {
    const adj = Array.from({length: nodes}, () => []);
    for (const [u, v, w] of edges) {
        adj[u].push([v, w]);
        adj[v].push([u, w]);
    }
    return adj;
}

const edges = [[0,1,5],[0,2,2],[1,2,1],[1,3,7],[2,4,4],[3,4,3]];
const adj = createWeightedGraph(5, edges);
adj.forEach((n, i) => console.log(`${i}: ${JSON.stringify(n)}`));
```

```typescript,editable
type Edge = [number, number];   // [to, weight]

function createWeightedGraph(nodes: number, edges: number[][]): Edge[][] {
    const adj: Edge[][] = Array.from({length: nodes}, () => []);
    for (const [u, v, w] of edges) {
        adj[u].push([v, w]);
        adj[v].push([u, w]);
    }
    return adj;
}

const edges: number[][] = [[0,1,5],[0,2,2],[1,2,1],[1,3,7],[2,4,4],[3,4,3]];
const adj = createWeightedGraph(5, edges);
adj.forEach((n, i) => console.log(`${i}: ${JSON.stringify(n)}`));
```

```go,editable
package main

import "fmt"

type Edge struct{ To, Weight int }

func createWeightedGraph(nodes int, edges [][3]int) [][]Edge {
    adj := make([][]Edge, nodes)
    for _, e := range edges {
        adj[e[0]] = append(adj[e[0]], Edge{e[1], e[2]})
        adj[e[1]] = append(adj[e[1]], Edge{e[0], e[2]})
    }
    return adj
}

func main() {
    edges := [][3]int{{0,1,5},{0,2,2},{1,2,1},{1,3,7},{2,4,4},{3,4,3}}
    adj := createWeightedGraph(5, edges)
    for i, n := range adj {
        fmt.Printf("%d: %v\n", i, n)
    }
}
```

```kotlin,editable
data class Edge(val to: Int, val weight: Int)

fun createWeightedGraph(nodes: Int, edges: Array<IntArray>): Array<MutableList<Edge>> {
    val adj = Array(nodes) { mutableListOf<Edge>() }
    for (e in edges) {
        adj[e[0]].add(Edge(e[1], e[2]))
        adj[e[1]].add(Edge(e[0], e[2]))
    }
    return adj
}

fun main() {
    val edges = arrayOf(intArrayOf(0,1,5), intArrayOf(0,2,2), intArrayOf(1,2,1),
                        intArrayOf(1,3,7), intArrayOf(2,4,4), intArrayOf(3,4,3))
    val adj = createWeightedGraph(5, edges)
    adj.forEachIndexed { i, n -> println("$i: $n") }
}
```

```rust,editable
#[derive(Debug, Clone)]
struct Edge { to: usize, weight: i32 }

fn create_weighted_graph(nodes: usize, edges: &[[i32; 3]]) -> Vec<Vec<Edge>> {
    let mut adj: Vec<Vec<Edge>> = vec![Vec::new(); nodes];
    for e in edges {
        let (u, v, w) = (e[0] as usize, e[1] as usize, e[2]);
        adj[u].push(Edge { to: v, weight: w });
        adj[v].push(Edge { to: u, weight: w });
    }
    adj
}

fn main() {
    let edges = [[0,1,5],[0,2,2],[1,2,1],[1,3,7],[2,4,4],[3,4,3]];
    let adj = create_weighted_graph(5, &edges);
    for (i, n) in adj.iter().enumerate() {
        println!("{}: {:?}", i, n);
    }
}
```

</div>

The change is purely about *what each list element holds*. The outer indexing strategy and the build loop are unchanged.

***

# Storing Data on Nodes

Two approaches, both common and useful:

1. **Parallel array** — same as the matrix version: a 1D array `nodeData[i]` of size `N`, indexed in lockstep with the adjacency list. Quick, no extra type, easy to share with code written against just the IDs.
2. **Custom node type** — wrap each node's data and adjacency list inside a single object/struct, then store a flat array of those objects. More OOP-flavoured, friendlier when the per-node payload grows.

```d2
direction: right

approach1: "Approach 1: parallel arrays" {
  grid-rows: 1
  grid-columns: 2
  grid-gap: 16
  data: |md
    **node_data[]**

    [Bangalore, Tokyo, Paris, NYC, London]
  |
  adj: |md
    **adj[]**

    [[(1,5),(2,2)], [(0,5),(2,1),(3,7)], …]
  |
}

approach2: "Approach 2: nodes as objects" {
  grid-rows: 1
  grid-columns: 1
  grid-gap: 0
  obj: |md
    **nodes[]** = list of `Node {data, adj}`

    nodes[0] = Node("Bangalore", [(1,5),(2,2)])

    nodes[1] = Node("Tokyo",     [(0,5),(2,1),(3,7)])

    …
  |
}
```

<p align="center"><strong>Two equivalent ways to attach per-node data. Both store the same information; the choice is about ergonomics.</strong></p>

Here's the **node-as-object** approach in all 10 languages — it's the more general one because it scales naturally as the per-node payload grows.

<div class="lang-tabs">

```python,editable
from dataclasses import dataclass, field
from typing import List, Tuple

@dataclass
class Node:
    data: str
    # default_factory ensures every Node gets its OWN empty list — without it,
    # all nodes would share one default list (a Python class-level footgun).
    adj: List[Tuple[int, int]] = field(default_factory=list)

def create_graph(node_data: List[str], edges: List[List[int]]) -> List[Node]:
    nodes = [Node(d) for d in node_data]
    for u, v, w in edges:
        nodes[u].adj.append((v, w))
        nodes[v].adj.append((u, w))
    return nodes


cities = ["Bangalore", "Tokyo", "Paris", "NYC", "London"]
edges  = [[0,1,5],[0,2,2],[1,2,1],[1,3,7],[2,4,4],[3,4,3]]
graph = create_graph(cities, edges)
for i, n in enumerate(graph):
    print(f"{i} ({n.data}): {n.adj}")
```

```java,editable
import java.util.ArrayList;
import java.util.List;

public class Main {
    static class Node {
        String data;
        List<int[]> adj = new ArrayList<>();   // (to, weight)
        Node(String d) { data = d; }
    }

    public static List<Node> createGraph(String[] nodeData, int[][] edges) {
        List<Node> nodes = new ArrayList<>();
        for (String d : nodeData) nodes.add(new Node(d));

        for (int[] e : edges) {
            nodes.get(e[0]).adj.add(new int[]{e[1], e[2]});
            nodes.get(e[1]).adj.add(new int[]{e[0], e[2]});
        }
        return nodes;
    }

    public static void main(String[] args) {
        String[] cities = {"Bangalore", "Tokyo", "Paris", "NYC", "London"};
        int[][] edges = {{0,1,5},{0,2,2},{1,2,1},{1,3,7},{2,4,4},{3,4,3}};
        List<Node> g = createGraph(cities, edges);
        for (int i = 0; i < g.size(); i++) {
            System.out.print(i + " (" + g.get(i).data + "): ");
            for (int[] p : g.get(i).adj) System.out.print("(" + p[0] + "," + p[1] + ") ");
            System.out.println();
        }
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { int to; int weight; } Edge;
typedef struct { Edge* data; int size; int capacity; } Vec;

typedef struct {
    char* data;
    Vec   adj;
} Node;

static void vec_push(Vec* v, Edge e) {
    if (v->size == v->capacity) {
        v->capacity = v->capacity == 0 ? 4 : v->capacity * 2;
        v->data = realloc(v->data, v->capacity * sizeof(Edge));
    }
    v->data[v->size++] = e;
}

Node* create_graph(const char* names[], int n, int edges[][3], int edge_count) {
    Node* nodes = calloc(n, sizeof(Node));
    for (int i = 0; i < n; i++) nodes[i].data = strdup(names[i]);

    for (int i = 0; i < edge_count; i++) {
        Edge a = { edges[i][1], edges[i][2] };
        Edge b = { edges[i][0], edges[i][2] };
        vec_push(&nodes[edges[i][0]].adj, a);
        vec_push(&nodes[edges[i][1]].adj, b);
    }
    return nodes;
}

int main() {
    const char* names[] = {"Bangalore", "Tokyo", "Paris", "NYC", "London"};
    int edges[][3] = {{0,1,5},{0,2,2},{1,2,1},{1,3,7},{2,4,4},{3,4,3}};
    Node* g = create_graph(names, 5, edges, 6);

    for (int i = 0; i < 5; i++) {
        printf("%d (%s): ", i, g[i].data);
        for (int j = 0; j < g[i].adj.size; j++)
            printf("(%d,%d) ", g[i].adj.data[j].to, g[i].adj.data[j].weight);
        printf("\n");
        free(g[i].data); free(g[i].adj.data);
    }
    free(g);
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <string>
#include <utility>

struct Node {
    std::string data;
    std::vector<std::pair<int, int>> adj;   // (to, weight)
    Node(std::string d) : data(std::move(d)) {}
};

std::vector<Node> createGraph(const std::vector<std::string>& nodeData,
                              const std::vector<std::vector<int>>& edges) {
    std::vector<Node> nodes;
    nodes.reserve(nodeData.size());
    for (auto& d : nodeData) nodes.emplace_back(d);

    for (auto& e : edges) {
        nodes[e[0]].adj.emplace_back(e[1], e[2]);
        nodes[e[1]].adj.emplace_back(e[0], e[2]);
    }
    return nodes;
}

int main() {
    std::vector<std::string> cities = {"Bangalore", "Tokyo", "Paris", "NYC", "London"};
    std::vector<std::vector<int>> edges = {{0,1,5},{0,2,2},{1,2,1},{1,3,7},{2,4,4},{3,4,3}};
    auto g = createGraph(cities, edges);
    for (int i = 0; i < (int)g.size(); i++) {
        std::cout << i << " (" << g[i].data << "): ";
        for (auto& [v, w] : g[i].adj) std::cout << "(" << v << "," << w << ") ";
        std::cout << "\n";
    }
}
```

```scala,editable
import scala.collection.mutable.ArrayBuffer

object Main extends App {
  case class Node(data: String, adj: ArrayBuffer[(Int, Int)] = ArrayBuffer.empty)

  def createGraph(nodeData: Array[String], edges: Array[Array[Int]]): Array[Node] = {
    val nodes = nodeData.map(d => Node(d))
    for (e <- edges) {
      nodes(e(0)).adj.append((e(1), e(2)))
      nodes(e(1)).adj.append((e(0), e(2)))
    }
    nodes
  }

  val cities = Array("Bangalore", "Tokyo", "Paris", "NYC", "London")
  val edges = Array(Array(0,1,5), Array(0,2,2), Array(1,2,1),
                    Array(1,3,7), Array(2,4,4), Array(3,4,3))
  val g = createGraph(cities, edges)
  g.zipWithIndex.foreach { case (n, i) => println(s"$i (${n.data}): ${n.adj.mkString(", ")}") }
}
```

```javascript,editable
class Node {
    constructor(data) { this.data = data; this.adj = []; }
}

function createGraph(nodeData, edges) {
    const nodes = nodeData.map(d => new Node(d));
    for (const [u, v, w] of edges) {
        nodes[u].adj.push([v, w]);
        nodes[v].adj.push([u, w]);
    }
    return nodes;
}

const cities = ["Bangalore", "Tokyo", "Paris", "NYC", "London"];
const edges  = [[0,1,5],[0,2,2],[1,2,1],[1,3,7],[2,4,4],[3,4,3]];
const g = createGraph(cities, edges);
g.forEach((n, i) => console.log(`${i} (${n.data}): ${JSON.stringify(n.adj)}`));
```

```typescript,editable
class Node {
    data: string;
    adj: [number, number][] = [];
    constructor(data: string) { this.data = data; }
}

function createGraph(nodeData: string[], edges: number[][]): Node[] {
    const nodes = nodeData.map(d => new Node(d));
    for (const [u, v, w] of edges) {
        nodes[u].adj.push([v, w]);
        nodes[v].adj.push([u, w]);
    }
    return nodes;
}

const cities: string[] = ["Bangalore", "Tokyo", "Paris", "NYC", "London"];
const edges: number[][]  = [[0,1,5],[0,2,2],[1,2,1],[1,3,7],[2,4,4],[3,4,3]];
const g = createGraph(cities, edges);
g.forEach((n, i) => console.log(`${i} (${n.data}): ${JSON.stringify(n.adj)}`));
```

```go,editable
package main

import "fmt"

type Edge struct{ To, Weight int }
type Node struct {
    Data string
    Adj  []Edge
}

func createGraph(nodeData []string, edges [][3]int) []Node {
    nodes := make([]Node, len(nodeData))
    for i, d := range nodeData {
        nodes[i] = Node{Data: d}
    }
    for _, e := range edges {
        nodes[e[0]].Adj = append(nodes[e[0]].Adj, Edge{e[1], e[2]})
        nodes[e[1]].Adj = append(nodes[e[1]].Adj, Edge{e[0], e[2]})
    }
    return nodes
}

func main() {
    cities := []string{"Bangalore", "Tokyo", "Paris", "NYC", "London"}
    edges := [][3]int{{0,1,5},{0,2,2},{1,2,1},{1,3,7},{2,4,4},{3,4,3}}
    g := createGraph(cities, edges)
    for i, n := range g {
        fmt.Printf("%d (%s): %v\n", i, n.Data, n.Adj)
    }
}
```

```kotlin,editable
data class Edge(val to: Int, val weight: Int)
data class Node(val data: String, val adj: MutableList<Edge> = mutableListOf())

fun createGraph(nodeData: Array<String>, edges: Array<IntArray>): Array<Node> {
    val nodes = Array(nodeData.size) { Node(nodeData[it]) }
    for (e in edges) {
        nodes[e[0]].adj.add(Edge(e[1], e[2]))
        nodes[e[1]].adj.add(Edge(e[0], e[2]))
    }
    return nodes
}

fun main() {
    val cities = arrayOf("Bangalore", "Tokyo", "Paris", "NYC", "London")
    val edges = arrayOf(intArrayOf(0,1,5), intArrayOf(0,2,2), intArrayOf(1,2,1),
                        intArrayOf(1,3,7), intArrayOf(2,4,4), intArrayOf(3,4,3))
    val g = createGraph(cities, edges)
    g.forEachIndexed { i, n -> println("$i (${n.data}): ${n.adj}") }
}
```

```rust,editable
#[derive(Debug, Clone)]
struct Edge { to: usize, weight: i32 }

#[derive(Debug)]
struct Node {
    data: String,
    adj: Vec<Edge>,
}

fn create_graph(node_data: Vec<String>, edges: &[[i32; 3]]) -> Vec<Node> {
    let mut nodes: Vec<Node> = node_data.into_iter()
        .map(|d| Node { data: d, adj: Vec::new() })
        .collect();

    for e in edges {
        let (u, v, w) = (e[0] as usize, e[1] as usize, e[2]);
        nodes[u].adj.push(Edge { to: v, weight: w });
        nodes[v].adj.push(Edge { to: u, weight: w });
    }
    nodes
}

fn main() {
    let cities = vec!["Bangalore", "Tokyo", "Paris", "NYC", "London"]
        .into_iter().map(String::from).collect();
    let edges = [[0,1,5],[0,2,2],[1,2,1],[1,3,7],[2,4,4],[3,4,3]];
    let g = create_graph(cities, &edges);
    for (i, n) in g.iter().enumerate() {
        println!("{} ({}): {:?}", i, n.data, n.adj);
    }
}
```

</div>

Both approaches encode the same information. The choice is mostly stylistic — whichever you find clearer, use that. Many real codebases mix the two: a `Graph` class internally holds a parallel array and exposes a `node(i)` method that returns a struct view.

***

# Complexity Analysis

| Operation | Adjacency list | Adjacency matrix | Winner |
|---|---|---|---|
| **Build** | O(N + E) | O(N² + E) | List (when E ≪ N²) |
| **Check edge `(i, j)`** | O(degree(i)) | O(1) | Matrix |
| **Get all neighbours of `i`** | O(degree(i)) | O(N) | List (when degree(i) ≪ N) |
| **Add an edge** | O(1) amortised | O(1) | Tie |
| **Remove an edge** | O(degree(i)) | O(1) | Matrix |
| **Add a node** | O(1) amortised | O(N²) | List |
| **Space** | O(N + E) | O(N²) | List (when sparse) |

The trade-off is sharp: **the matrix wins on per-edge operations; the list wins on per-node operations and on memory for sparse graphs.**

For the typical real-world graph — sparse, frequently traversed by walking neighbours, occasionally added to — the list wins. That's why the list is the default in every algorithm we'll meet from here on, and the matrix is reserved for special cases.

> **Why is "Get all neighbours" so important?** Almost every graph algorithm — BFS, DFS, Dijkstra, you name it — has a hot inner step that reads "for each neighbour of the current node, do something". With the list, this is a tight `for n in adj[i]` loop. With the matrix, it's a full row scan that re-checks `N - degree(i)` cells the algorithm doesn't care about. On a graph with a million sparse nodes, that's the difference between a fast algorithm and an unusable one.

Now that you can build either representation, three classic problems test that you actually understand them.

***

# Problem: Clone an Adjacency List

## The Problem

Given the adjacency list of a directed graph, return a deep clone — a new list independent of the original such that mutating one does not affect the other.

```
Input:  adjList = [[1, 3], [4], [4], [2], [3]]
Output: A new list with the same contents [[1, 3], [4], [4], [2], [3]]

Input:  adjList = [[4], [0, 3], [0, 4], [2, 4], [1]]
Output: A new list with the same contents [[4], [0, 3], [0, 4], [2, 4], [1]]
```

## What "Deep Clone" Means

A **shallow copy** of a list-of-lists copies only the outer container — the inner lists are still shared references. Mutating `clone[0]` would mutate `original[0]` too. A **deep clone** allocates a brand-new outer container *and* a brand-new inner list for each node, then copies the integer IDs across.

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#64748b"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart LR
    subgraph S["Shallow"]
      direction TB
      OS["original<br/>[ →, →, → ]"] --> IS["inner lists"]
      CS["clone (shallow)<br/>[ →, →, → ]"] --> IS
    end
    subgraph D["Deep"]
      direction TB
      OD["original<br/>[ →, →, → ]"] --> ID["inner lists"]
      CD["clone (deep)<br/>[ →', →', →' ]"] --> ID2["fresh inner lists<br/>(same contents)"]
    end
```

<p align="center"><strong>Shallow vs deep. Shallow shares the inner lists; mutating one container mutates both. Deep gives the clone its own inner lists.</strong></p>

For a list of integer IDs, "deep" only needs to go one level — the integers themselves are immutable in every language we care about. (If the inner lists held mutable objects, deep cloning would have to recurse further.)

## The Strategy

Two nested loops:

1. Allocate the outer list of `N` empty inner lists.
2. For each node `i`, copy every neighbour ID from `original[i]` into `clone[i]`.

That's literally it. No clever insight — just don't share references.

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List
from copy import deepcopy

def clone_adjacency_list(adj_list: List[List[int]]) -> List[List[int]]:
    n = len(adj_list)
    # Build a fresh outer list with a fresh inner list per node.
    cloned = [[] for _ in range(n)]
    for i in range(n):
        for v in adj_list[i]:
            cloned[i].append(v)
    return cloned


# Idiomatic shortcut: copy.deepcopy(adj_list) does this for you in one line.
# We write it explicitly above to make the steps visible.

adj_list = [[1, 3], [4], [4], [2], [3]]
print(clone_adjacency_list(adj_list))
```

```java,editable
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static List<List<Integer>> cloneAdjacencyList(List<List<Integer>> adjList) {
        int n = adjList.size();
        List<List<Integer>> cloned = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            // new ArrayList<>(adjList.get(i)) makes a fresh inner list and copies in the values.
            cloned.add(new ArrayList<>(adjList.get(i)));
        }
        return cloned;
    }

    public static void main(String[] args) {
        List<List<Integer>> adj = List.of(
            List.of(1, 3), List.of(4), List.of(4), List.of(2), List.of(3));
        System.out.println(cloneAdjacencyList(adj));
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { int* data; int size; int capacity; } Vec;

Vec* clone_adjacency_list(Vec* adj, int n) {
    Vec* cloned = calloc(n, sizeof(Vec));
    for (int i = 0; i < n; i++) {
        cloned[i].size = adj[i].size;
        cloned[i].capacity = adj[i].size;
        cloned[i].data = malloc(adj[i].size * sizeof(int));
        // memcpy is the fastest way to duplicate the integer array.
        memcpy(cloned[i].data, adj[i].data, adj[i].size * sizeof(int));
    }
    return cloned;
}

int main() {
    int data[][2] = {{1,3},{4,-1},{4,-1},{2,-1},{3,-1}};
    int sizes[] = {2, 1, 1, 1, 1};
    Vec adj[5];
    for (int i = 0; i < 5; i++) {
        adj[i].data = malloc(sizes[i] * sizeof(int));
        adj[i].size = sizes[i];
        adj[i].capacity = sizes[i];
        for (int j = 0; j < sizes[i]; j++) adj[i].data[j] = data[i][j];
    }

    Vec* cloned = clone_adjacency_list(adj, 5);
    for (int i = 0; i < 5; i++) {
        printf("%d: ", i);
        for (int j = 0; j < cloned[i].size; j++) printf("%d ", cloned[i].data[j]);
        printf("\n");
        free(adj[i].data); free(cloned[i].data);
    }
    free(cloned);
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

std::vector<std::vector<int>> cloneAdjacencyList(std::vector<std::vector<int>>& adjList) {
    // The vector copy constructor recursively copies the inner vectors — already a deep copy.
    std::vector<std::vector<int>> cloned = adjList;
    return cloned;
}

int main() {
    std::vector<std::vector<int>> adj = {{1, 3}, {4}, {4}, {2}, {3}};
    auto c = cloneAdjacencyList(adj);
    for (auto& row : c) { for (int v : row) std::cout << v << " "; std::cout << "\n"; }
}
```

```scala,editable
import scala.collection.mutable.ArrayBuffer

object Main extends App {
  def cloneAdjacencyList(adj: Array[ArrayBuffer[Int]]): Array[ArrayBuffer[Int]] = {
    // .map(_.clone()) builds fresh inner buffers with the same elements.
    adj.map(_.clone())
  }

  val adj = Array(ArrayBuffer(1, 3), ArrayBuffer(4), ArrayBuffer(4), ArrayBuffer(2), ArrayBuffer(3))
  val c = cloneAdjacencyList(adj)
  c.foreach(r => println(r.mkString(" ")))
}
```

```javascript,editable
function cloneAdjacencyList(adjList) {
    // [...row] spreads each inner array into a brand-new array — fresh allocation, same values.
    return adjList.map(row => [...row]);
}

const adj = [[1, 3], [4], [4], [2], [3]];
console.log(cloneAdjacencyList(adj));
```

```typescript,editable
function cloneAdjacencyList(adjList: number[][]): number[][] {
    return adjList.map(row => [...row]);
}

const adj: number[][] = [[1, 3], [4], [4], [2], [3]];
console.log(cloneAdjacencyList(adj));
```

```go,editable
package main

import "fmt"

func cloneAdjacencyList(adj [][]int) [][]int {
    cloned := make([][]int, len(adj))
    for i, row := range adj {
        cloned[i] = make([]int, len(row))
        // Built-in copy is the canonical way to duplicate a slice in Go.
        copy(cloned[i], row)
    }
    return cloned
}

func main() {
    adj := [][]int{{1, 3}, {4}, {4}, {2}, {3}}
    fmt.Println(cloneAdjacencyList(adj))
}
```

```kotlin,editable
fun cloneAdjacencyList(adj: List<List<Int>>): List<MutableList<Int>> {
    // toMutableList() makes a fresh MutableList per row.
    return adj.map { it.toMutableList() }
}

fun main() {
    val adj = listOf(listOf(1, 3), listOf(4), listOf(4), listOf(2), listOf(3))
    println(cloneAdjacencyList(adj))
}
```

```rust,editable
fn clone_adjacency_list(adj: &[Vec<i32>]) -> Vec<Vec<i32>> {
    // Vec implements Clone — calling .to_vec() on each row produces a deep copy.
    adj.iter().map(|row| row.clone()).collect()
}

fn main() {
    let adj: Vec<Vec<i32>> = vec![vec![1, 3], vec![4], vec![4], vec![2], vec![3]];
    println!("{:?}", clone_adjacency_list(&adj));
}
```

</div>

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(N + E) | Visit every node and every neighbour entry once |
| **Space** | O(N + E) | The cloned list is the same size as the original |

***

# Problem: Adjacency List → Adjacency Matrix

## The Problem

Given the adjacency list of a directed graph, build the equivalent N×N adjacency matrix where `adj[i][j] = 1` if and only if there's an edge from `i` to `j`.

```
Input:  adjList = [[1, 3], [4], [4], [2], [3]]
Output: [[0,1,0,1,0],[0,0,0,0,1],[0,0,0,0,1],[0,0,1,0,0],[0,0,0,1,0]]

Input:  adjList = [[4], [0, 3], [0, 4], [2, 4], [1]]
Output: [[0,0,0,0,1],[1,0,0,1,0],[1,0,0,0,1],[0,0,1,0,1],[0,1,0,0,0]]
```

## The Strategy

Allocate an `N×N` zero matrix. Then for each list entry `j` in `adj[i]`, set `matrix[i][j] = 1`. That's it — **no symmetric assignment**, because the input is directed.

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#64748b"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart LR
    L["adj[i] = [n1, n2, n3, ...]"] --> M["matrix[i][n1] = 1<br/>matrix[i][n2] = 1<br/>matrix[i][n3] = 1<br/>..."]
```

<p align="center"><strong>One row of the input list directly populates one row of the output matrix.</strong></p>

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

def adj_list_to_matrix(adj_list: List[List[int]]) -> List[List[int]]:
    n = len(adj_list)
    matrix = [[0] * n for _ in range(n)]

    for i, neighbours in enumerate(adj_list):
        for j in neighbours:
            # Directed: only mark the (from → to) cell, NOT the reverse.
            matrix[i][j] = 1
    return matrix


adj_list = [[1, 3], [4], [4], [2], [3]]
for row in adj_list_to_matrix(adj_list):
    print(row)
```

```java,editable
import java.util.Arrays;
import java.util.List;

public class Main {
    public static int[][] adjListToMatrix(List<List<Integer>> adjList) {
        int n = adjList.size();
        int[][] matrix = new int[n][n];   // Java default-fills int[] with zero.

        for (int i = 0; i < n; i++) {
            for (int j : adjList.get(i)) {
                matrix[i][j] = 1;
            }
        }
        return matrix;
    }

    public static void main(String[] args) {
        List<List<Integer>> adj = List.of(
            List.of(1, 3), List.of(4), List.of(4), List.of(2), List.of(3));
        for (int[] row : adjListToMatrix(adj)) System.out.println(Arrays.toString(row));
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>

typedef struct { int* data; int size; } Vec;

int** adj_list_to_matrix(Vec* adj, int n) {
    int** m = malloc(n * sizeof(int*));
    for (int i = 0; i < n; i++) m[i] = calloc(n, sizeof(int));

    for (int i = 0; i < n; i++)
        for (int j = 0; j < adj[i].size; j++)
            m[i][adj[i].data[j]] = 1;
    return m;
}

int main() {
    int data0[] = {1, 3}, data1[] = {4}, data2[] = {4}, data3[] = {2}, data4[] = {3};
    Vec adj[] = {{data0, 2}, {data1, 1}, {data2, 1}, {data3, 1}, {data4, 1}};
    int** m = adj_list_to_matrix(adj, 5);
    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < 5; j++) printf("%d ", m[i][j]);
        printf("\n");
        free(m[i]);
    }
    free(m);
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

std::vector<std::vector<int>> adjListToMatrix(std::vector<std::vector<int>>& adjList) {
    int n = (int)adjList.size();
    std::vector<std::vector<int>> matrix(n, std::vector<int>(n, 0));

    for (int i = 0; i < n; i++)
        for (int j : adjList[i]) matrix[i][j] = 1;
    return matrix;
}

int main() {
    std::vector<std::vector<int>> adj = {{1, 3}, {4}, {4}, {2}, {3}};
    auto m = adjListToMatrix(adj);
    for (auto& r : m) { for (int v : r) std::cout << v << " "; std::cout << "\n"; }
}
```

```scala,editable
import scala.collection.mutable.ArrayBuffer

object Main extends App {
  def adjListToMatrix(adjList: Array[ArrayBuffer[Int]]): Array[Array[Int]] = {
    val n = adjList.length
    val m = Array.ofDim[Int](n, n)
    for (i <- 0 until n; j <- adjList(i)) m(i)(j) = 1
    m
  }

  val adj = Array(ArrayBuffer(1, 3), ArrayBuffer(4), ArrayBuffer(4), ArrayBuffer(2), ArrayBuffer(3))
  adjListToMatrix(adj).foreach(r => println(r.mkString(" ")))
}
```

```javascript,editable
function adjListToMatrix(adjList) {
    const n = adjList.length;
    const matrix = Array.from({length: n}, () => Array(n).fill(0));

    for (let i = 0; i < n; i++)
        for (const j of adjList[i]) matrix[i][j] = 1;
    return matrix;
}

const adj = [[1, 3], [4], [4], [2], [3]];
adjListToMatrix(adj).forEach(r => console.log(r.join(" ")));
```

```typescript,editable
function adjListToMatrix(adjList: number[][]): number[][] {
    const n = adjList.length;
    const matrix: number[][] = Array.from({length: n}, () => Array(n).fill(0));

    for (let i = 0; i < n; i++)
        for (const j of adjList[i]) matrix[i][j] = 1;
    return matrix;
}

const adj: number[][] = [[1, 3], [4], [4], [2], [3]];
adjListToMatrix(adj).forEach(r => console.log(r.join(" ")));
```

```go,editable
package main

import "fmt"

func adjListToMatrix(adjList [][]int) [][]int {
    n := len(adjList)
    m := make([][]int, n)
    for i := range m {
        m[i] = make([]int, n)
    }
    for i := 0; i < n; i++ {
        for _, j := range adjList[i] {
            m[i][j] = 1
        }
    }
    return m
}

func main() {
    adj := [][]int{{1, 3}, {4}, {4}, {2}, {3}}
    for _, r := range adjListToMatrix(adj) {
        fmt.Println(r)
    }
}
```

```kotlin,editable
fun adjListToMatrix(adjList: List<List<Int>>): Array<IntArray> {
    val n = adjList.size
    val m = Array(n) { IntArray(n) }
    for (i in 0 until n) for (j in adjList[i]) m[i][j] = 1
    return m
}

fun main() {
    val adj = listOf(listOf(1, 3), listOf(4), listOf(4), listOf(2), listOf(3))
    adjListToMatrix(adj).forEach { println(it.toList()) }
}
```

```rust,editable
fn adj_list_to_matrix(adj_list: &[Vec<usize>]) -> Vec<Vec<i32>> {
    let n = adj_list.len();
    let mut matrix = vec![vec![0; n]; n];

    for (i, row) in adj_list.iter().enumerate() {
        for &j in row {
            matrix[i][j] = 1;
        }
    }
    matrix
}

fn main() {
    let adj = vec![vec![1, 3], vec![4], vec![4], vec![2], vec![3]];
    for r in adj_list_to_matrix(&adj) {
        println!("{:?}", r);
    }
}
```

</div>

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(N² + E) | The matrix allocation costs O(N²); marking each edge is O(1) and there are E of them |
| **Space** | O(N²) | The output matrix dominates |

***

# Problem: Adjacency Matrix → Adjacency List

## The Problem

The reverse direction — given a directed graph as an N×N matrix, return its adjacency list.

```
Input:  matrix = [[0,1,0,1,0],[0,0,0,0,1],[0,0,0,0,1],[0,0,1,0,0],[0,0,0,1,0]]
Output: [[1, 3], [4], [4], [2], [3]]

Input:  matrix = [[0,0,0,0,1],[1,0,0,1,0],[1,0,0,0,1],[0,0,1,0,1],[0,1,0,0,0]]
Output: [[4], [0, 3], [0, 4], [2, 4], [1]]
```

## The Strategy

Walk the matrix row by row. For each cell that's `1`, append the column index to the row's adjacency list.

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#dbeafe"
    primaryBorderColor: "#3b82f6"
    primaryTextColor: "#1e3a5f"
    lineColor: "#64748b"
    secondaryColor: "#ede9fe"
    tertiaryColor: "#fef9c3"
---
flowchart LR
    M["matrix[i] = [m0, m1, m2, ...]"] --> L["adj[i] = indices where mj == 1"]
```

<p align="center"><strong>For each row, the adjacency list is just the indices where the cell is 1.</strong></p>

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List

def matrix_to_adj_list(matrix: List[List[int]]) -> List[List[int]]:
    n = len(matrix)
    adj_list: List[List[int]] = [[] for _ in range(n)]

    for i in range(n):
        for j in range(n):
            # The cell value 1 means "edge from i to j exists".
            if matrix[i][j] == 1:
                adj_list[i].append(j)
    return adj_list


matrix = [[0,1,0,1,0],[0,0,0,0,1],[0,0,0,0,1],[0,0,1,0,0],[0,0,0,1,0]]
print(matrix_to_adj_list(matrix))
```

```java,editable
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static List<List<Integer>> matrixToAdjList(int[][] matrix) {
        int n = matrix.length;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());

        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (matrix[i][j] == 1) adj.get(i).add(j);
        return adj;
    }

    public static void main(String[] args) {
        int[][] matrix = {{0,1,0,1,0},{0,0,0,0,1},{0,0,0,0,1},{0,0,1,0,0},{0,0,0,1,0}};
        System.out.println(matrixToAdjList(matrix));
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>

typedef struct { int* data; int size; int capacity; } Vec;

static void vec_push(Vec* v, int x) {
    if (v->size == v->capacity) {
        v->capacity = v->capacity == 0 ? 4 : v->capacity * 2;
        v->data = realloc(v->data, v->capacity * sizeof(int));
    }
    v->data[v->size++] = x;
}

Vec* matrix_to_adj_list(int** matrix, int n) {
    Vec* adj = calloc(n, sizeof(Vec));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            if (matrix[i][j] == 1) vec_push(&adj[i], j);
    return adj;
}

int main() {
    int data[5][5] = {{0,1,0,1,0},{0,0,0,0,1},{0,0,0,0,1},{0,0,1,0,0},{0,0,0,1,0}};
    int* m[5];
    for (int i = 0; i < 5; i++) m[i] = data[i];

    Vec* adj = matrix_to_adj_list(m, 5);
    for (int i = 0; i < 5; i++) {
        printf("%d: ", i);
        for (int j = 0; j < adj[i].size; j++) printf("%d ", adj[i].data[j]);
        printf("\n");
        free(adj[i].data);
    }
    free(adj);
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>

std::vector<std::vector<int>> matrixToAdjList(std::vector<std::vector<int>>& matrix) {
    int n = (int)matrix.size();
    std::vector<std::vector<int>> adj(n);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            if (matrix[i][j] == 1) adj[i].push_back(j);
    return adj;
}

int main() {
    std::vector<std::vector<int>> matrix = {{0,1,0,1,0},{0,0,0,0,1},{0,0,0,0,1},{0,0,1,0,0},{0,0,0,1,0}};
    auto adj = matrixToAdjList(matrix);
    for (int i = 0; i < (int)adj.size(); i++) {
        std::cout << i << ": ";
        for (int v : adj[i]) std::cout << v << " ";
        std::cout << "\n";
    }
}
```

```scala,editable
import scala.collection.mutable.ArrayBuffer

object Main extends App {
  def matrixToAdjList(matrix: Array[Array[Int]]): Array[ArrayBuffer[Int]] = {
    val n = matrix.length
    val adj = Array.fill(n)(ArrayBuffer.empty[Int])
    for (i <- 0 until n; j <- 0 until n if matrix(i)(j) == 1) adj(i).append(j)
    adj
  }

  val matrix = Array(Array(0,1,0,1,0), Array(0,0,0,0,1), Array(0,0,0,0,1),
                     Array(0,0,1,0,0), Array(0,0,0,1,0))
  matrixToAdjList(matrix).zipWithIndex.foreach { case (r, i) => println(s"$i: ${r.mkString(" ")}") }
}
```

```javascript,editable
function matrixToAdjList(matrix) {
    const n = matrix.length;
    const adj = Array.from({length: n}, () => []);
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
            if (matrix[i][j] === 1) adj[i].push(j);
    return adj;
}

const matrix = [[0,1,0,1,0],[0,0,0,0,1],[0,0,0,0,1],[0,0,1,0,0],[0,0,0,1,0]];
console.log(matrixToAdjList(matrix));
```

```typescript,editable
function matrixToAdjList(matrix: number[][]): number[][] {
    const n = matrix.length;
    const adj: number[][] = Array.from({length: n}, () => []);
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
            if (matrix[i][j] === 1) adj[i].push(j);
    return adj;
}

const matrix: number[][] = [[0,1,0,1,0],[0,0,0,0,1],[0,0,0,0,1],[0,0,1,0,0],[0,0,0,1,0]];
console.log(matrixToAdjList(matrix));
```

```go,editable
package main

import "fmt"

func matrixToAdjList(matrix [][]int) [][]int {
    n := len(matrix)
    adj := make([][]int, n)
    for i := 0; i < n; i++ {
        for j := 0; j < n; j++ {
            if matrix[i][j] == 1 {
                adj[i] = append(adj[i], j)
            }
        }
    }
    return adj
}

func main() {
    matrix := [][]int{
        {0,1,0,1,0}, {0,0,0,0,1}, {0,0,0,0,1}, {0,0,1,0,0}, {0,0,0,1,0}}
    fmt.Println(matrixToAdjList(matrix))
}
```

```kotlin,editable
fun matrixToAdjList(matrix: Array<IntArray>): List<MutableList<Int>> {
    val n = matrix.size
    val adj = List(n) { mutableListOf<Int>() }
    for (i in 0 until n)
        for (j in 0 until n)
            if (matrix[i][j] == 1) adj[i].add(j)
    return adj
}

fun main() {
    val matrix = arrayOf(
        intArrayOf(0,1,0,1,0), intArrayOf(0,0,0,0,1), intArrayOf(0,0,0,0,1),
        intArrayOf(0,0,1,0,0), intArrayOf(0,0,0,1,0))
    println(matrixToAdjList(matrix))
}
```

```rust,editable
fn matrix_to_adj_list(matrix: &[Vec<i32>]) -> Vec<Vec<usize>> {
    let n = matrix.len();
    let mut adj: Vec<Vec<usize>> = vec![Vec::new(); n];
    for i in 0..n {
        for j in 0..n {
            if matrix[i][j] == 1 {
                adj[i].push(j);
            }
        }
    }
    adj
}

fn main() {
    let matrix = vec![
        vec![0,1,0,1,0], vec![0,0,0,0,1], vec![0,0,0,0,1],
        vec![0,0,1,0,0], vec![0,0,0,1,0]];
    println!("{:?}", matrix_to_adj_list(&matrix));
}
```

</div>

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(N²) | Every cell of the input matrix is examined once |
| **Space** | O(N + E) | The output adjacency list holds N empty lists plus E entries total |

The matrix→list conversion is **strictly upper-bound by O(N²)** even when the graph is sparse — you can't avoid scanning every cell because there's no way to know in advance which cells are 1. This is the matrix's last word in the trade-off: even reading it takes quadratic time.

---

## Final Takeaway

The adjacency list is the default for almost every graph problem you'll meet from here on. It uses memory proportional to actual edges, makes "iterate over my neighbours" a tight inner loop, and adapts to weighted graphs and per-node data with minor tweaks.

You now know how to build it from scratch, how to enrich it with weights and node objects, and how to translate freely between list and matrix forms. Every algorithm in the rest of this chapter — BFS, DFS, Dijkstra, topological sort — will assume an adjacency list as input. With the build code burned in, the algorithm code is all that's left.

But what we've built is just **storage**. We haven't yet made the graph *do* anything. The very next step is the most fundamental graph operation of all: visiting every node, in some sensible order, exactly once. That's traversal — the next lesson.

> **Transfer challenge.** A social network has 500 million users with an average of 200 friends each. Estimate the memory usage in megabytes for storing the friend graph as (a) an adjacency matrix of bits, (b) an adjacency list of 4-byte ints. Which one fits on a single server, and which one needs a distributed system? *(Numbers in the answer block.)*

<details>
<summary><strong>Solution</strong></summary>

- Matrix of bits: `(5×10⁸)² / 8` bytes ≈ **3.1 × 10¹⁶ bytes ≈ 31 petabytes**. Definitely distributed.
- List of 4-byte ints: `5 × 10⁸ × 200 × 4 × 2` (the ×2 is for undirected) ≈ **800 GB**. Tight on a single server but feasible; comfortably distributed across a small cluster.

The factor between them is **~40 000×** — a perfect demonstration of why sparse graphs need adjacency lists.

</details>
