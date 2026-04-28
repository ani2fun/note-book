# 4. Traversing a graph

This lesson teaches the **two fundamental ways to walk every node of a graph** — depth-first and breadth-first traversal. Together, these two patterns are the foundation of essentially every advanced graph algorithm you'll meet later.

## Table of contents

1. [Why a `for` loop isn't enough](#why-a-for-loop-isnt-enough)
2. [Depth-first traversal — go deep, then back](#depth-first-traversal--go-deep-then-back)
3. [DFS implementation](#dfs-implementation)
4. [Breadth-first traversal — ripple outward](#breadth-first-traversal--ripple-outward)
5. [BFS implementation](#bfs-implementation)
6. [DFS vs BFS — when to choose which](#dfs-vs-bfs--when-to-choose-which)

***

# Why a `for` Loop Isn't Enough

For an array, "visit every element" is a one-line `for` loop. For a tree it's a slightly fancier recursion. For a graph? **Neither works.**

Walk through why a naive `for i in 0..N-1` fails:

- It would visit nodes in their *index order*, ignoring the structure entirely.
- It tells you nothing about which nodes are reachable from which.
- It can't naturally answer "what's connected to node X?" — the question every graph algorithm asks.

Even tree recursion fails on graphs because graphs can have **cycles**. A pure recursive walk on a cyclic graph runs forever — A → B → C → A → B → C → A → … until your call stack explodes.

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
    A((A)) --> B((B))
    B --> C((C))
    C --> A
```

<p align="center"><strong>A 3-node cycle. A naive recursive walk from A visits A, B, C, A, B, C, ... forever. Graphs need a way to remember "I've already been here".</strong></p>

So graph traversal must:

1. Pick **some sensible order** to visit nodes (not just index order).
2. **Remember which nodes are already visited** so cycles don't trap us.
3. Handle **disconnected graphs** — sometimes a single starting node can't reach the whole graph.

Two famous orderings handle (1) cleanly. They share the visited-tracking and disconnected-handling machinery, but disagree on the order. They're called **depth-first** and **breadth-first** traversal — and choosing between them is one of the most common decisions in graph code.

> *Before reading on — picture a 5-node graph and yourself starting at node 0. Without any rules, list the order you'd visit nodes. Now redo it imagining you can only walk one path at a time and must finish each path before starting another. Then redo it imagining you must visit all "1-step neighbours" before any "2-step neighbour". Those last two are DFS and BFS.*

***

# Depth-First Traversal — Go Deep, Then Back

**Depth-first search (DFS)** says: follow one path as deep as possible. When you hit a dead end (or already-visited territory), back up to the last branching point and try a different unexplored path.

Think of a maze. You stand at a fork. You pick a corridor and walk to its end. Stuck or seen-before? Walk back to the fork. Pick the next corridor. Repeat. Eventually every corridor is walked.

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
flowchart TB
    A((A)) --> B((B))
    A --> C((C))
    B --> D((D))
    B --> E((E))
    C --> F((F))
    style A fill:#fde68a,stroke:#d97706
    style B fill:#fde68a,stroke:#d97706
    style D fill:#fde68a,stroke:#d97706
```

<p align="center"><strong>Starting from A, DFS explores A → B → D fully before backing up to B and exploring B → E, then backing up to A and exploring A → C → F. The highlighted subtree is the first complete branch DFS finishes.</strong></p>

DFS naturally maps to **recursion**. The function call stack *is* the trail of branching points you'd retrace in the maze. Every recursive call goes one step deeper; every `return` is the act of "backing up".

---

## The Core Recursive Idea

For one starting node `s`, DFS is two lines:

```
dfs(s):
    mark s visited
    for each neighbour n of s:
        if n not visited:  dfs(n)
```

That's the whole search. Read it twice — it's exactly "I'm here; let me finish exploring everywhere I can reach from here, recursively, before I leave."

But this only finds the **connected component** containing `s`. If the graph has 3 disconnected pieces, calling `dfs(s)` only walks the piece containing `s` — the other two are untouched.

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
    subgraph C1["Reached by dfs(0)"]
      direction LR
      A0((0)) --- A1((1))
      A0 --- A2((2))
    end
    subgraph C2["Untouched"]
      direction LR
      B0((3)) --- B1((4))
    end
    subgraph C3["Untouched"]
      direction LR
      C0((5))
    end
```

<p align="center"><strong>Calling dfs(0) reaches only the leftmost component. Nodes 3, 4 and 5 stay unvisited — DFS from a single source can't cross the disconnect.</strong></p>

The fix is a wrapper that loops over every node and calls `dfs` from each unvisited one:

```
depthFirstTraversal(graph):
    visited = empty set
    for each node v in graph:
        if v not visited:  dfs(v)
```

For a connected graph, the outer loop runs `dfs` exactly once and stops. For a disconnected graph, it runs `dfs` once per component. Either way, every node is visited exactly once.

---

## The Two-Level Algorithm

Step-by-step, in human words:

> **`dfs(node, graph, visited, result)`**
> 1. Mark `node` as visited.
> 2. Append `node` to the result.
> 3. For each `neighbour` in `graph[node]`:
>    - If `neighbour` not visited, recursively call `dfs(neighbour)`.
>
> **`depthFirstTraversal(graph)`**
> 1. Create an empty `visited` set and an empty `result` list.
> 2. For each `node` from 0 to N-1:
>    - If `node` not visited, call `dfs(node, ...)`.
> 3. Return `result`.

> *Before reading on — for the graph below, predict the DFS order starting from node 0. Don't peek at the trace until you've written your guess down.*

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
    N0((0)) --> N1((1))
    N1 --> N4((4))
    N4 --> N2((2))
    N4 --> N3((3))
    N2 --> N3
    N3 --> N0
```

<p align="center"><strong>Test graph for the DFS dry run. Adjacency list: <code>0→[1], 1→[4], 2→[3], 3→[0], 4→[2,3]</code>.</strong></p>

DFS from 0: visit 0, go to 1, go to 4, go to 4's first unvisited neighbour 2, go to 2's first unvisited neighbour 3 (3's only neighbour 0 is already visited so we return), back to 2 (no more), back to 4, try 4's next neighbour 3 (already visited), return. Full order: **0, 1, 4, 2, 3**.

If your guess matched: you've internalised "go deep first". If not, trace it once more on paper before moving on.

***

# DFS Implementation

We assume the graph is given as an adjacency list `graph` where `graph[i]` is the list of neighbours of node `i`. Nodes are integers `0..N-1`.

<div class="lang-tabs">

```python,editable
from typing import List, Set

class Solution:
    def dfs(self,
            graph: List[List[int]],
            node: int,
            visited: Set[int],
            result: List[int]) -> None:
        # 1) mark current node visited BEFORE recursing — prevents revisits if a
        #    cycle leads back here through one of our neighbours.
        visited.add(node)
        # 2) append AFTER marking so that 'visited' and 'result' stay in lock-step.
        result.append(node)

        for neighbour in graph[node]:
            # Skip neighbours we've already covered — without this check, cycles loop forever.
            if neighbour not in visited:
                self.dfs(graph, neighbour, visited, result)

    def depth_first_traversal(self, graph: List[List[int]]) -> List[int]:
        n = len(graph)
        if n == 0:
            return []

        visited: Set[int] = set()
        result: List[int] = []

        # Outer loop handles disconnected graphs — every component gets its own DFS root.
        for node in range(n):
            if node not in visited:
                self.dfs(graph, node, visited, result)
        return result


graph = [[1], [4], [3], [0], [2, 3]]
print(Solution().depth_first_traversal(graph))   # → [0, 1, 4, 2, 3]
```

```java,editable
import java.util.*;

public class Main {
    static class Solution {
        public void dfs(List<List<Integer>> graph, int node,
                        Set<Integer> visited, List<Integer> result) {
            visited.add(node);
            result.add(node);
            for (int neighbour : graph.get(node)) {
                if (!visited.contains(neighbour)) dfs(graph, neighbour, visited, result);
            }
        }

        public List<Integer> depthFirstTraversal(List<List<Integer>> graph) {
            int n = graph.size();
            if (n == 0) return new ArrayList<>();

            Set<Integer> visited = new HashSet<>();
            List<Integer> result = new ArrayList<>();

            // Outer loop seeds DFS for every disconnected component.
            for (int node = 0; node < n; node++) {
                if (!visited.contains(node)) dfs(graph, node, visited, result);
            }
            return result;
        }
    }

    public static void main(String[] args) {
        List<List<Integer>> graph = List.of(
            List.of(1), List.of(4), List.of(3), List.of(0), List.of(2, 3));
        System.out.println(new Solution().depthFirstTraversal(graph));
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct { int* data; int size; } AdjList;

static void dfs(AdjList* graph, int node, bool* visited, int* result, int* idx) {
    visited[node] = true;
    result[(*idx)++] = node;
    for (int i = 0; i < graph[node].size; i++) {
        int neighbour = graph[node].data[i];
        if (!visited[neighbour]) dfs(graph, neighbour, visited, result, idx);
    }
}

void depth_first_traversal(AdjList* graph, int n, int* result, int* result_size) {
    bool* visited = calloc(n, sizeof(bool));
    int idx = 0;
    for (int node = 0; node < n; node++) {
        if (!visited[node]) dfs(graph, node, visited, result, &idx);
    }
    *result_size = idx;
    free(visited);
}

int main() {
    int n0[] = {1}, n1[] = {4}, n2[] = {3}, n3[] = {0}, n4[] = {2, 3};
    AdjList g[] = {{n0, 1}, {n1, 1}, {n2, 1}, {n3, 1}, {n4, 2}};
    int result[5], size;
    depth_first_traversal(g, 5, result, &size);
    for (int i = 0; i < size; i++) printf("%d ", result[i]);
    printf("\n");
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <unordered_set>

class Solution {
public:
    void dfs(std::vector<std::vector<int>>& graph, int node,
             std::unordered_set<int>& visited, std::vector<int>& result) {
        visited.insert(node);
        result.push_back(node);
        for (int neighbour : graph[node]) {
            if (visited.find(neighbour) == visited.end())
                dfs(graph, neighbour, visited, result);
        }
    }

    std::vector<int> depthFirstTraversal(std::vector<std::vector<int>>& graph) {
        int n = (int)graph.size();
        if (n == 0) return {};
        std::vector<int> result;
        std::unordered_set<int> visited;
        for (int node = 0; node < n; node++) {
            if (visited.find(node) == visited.end()) dfs(graph, node, visited, result);
        }
        return result;
    }
};

int main() {
    std::vector<std::vector<int>> graph = {{1}, {4}, {3}, {0}, {2, 3}};
    auto out = Solution().depthFirstTraversal(graph);
    for (int v : out) std::cout << v << " ";
    std::cout << "\n";
}
```

```scala,editable
import scala.collection.mutable.{ArrayBuffer, HashSet}

object Main extends App {
  class Solution {
    def dfs(graph: Array[Array[Int]], node: Int,
            visited: HashSet[Int], result: ArrayBuffer[Int]): Unit = {
      visited.add(node)
      result.append(node)
      for (neighbour <- graph(node) if !visited.contains(neighbour))
        dfs(graph, neighbour, visited, result)
    }

    def depthFirstTraversal(graph: Array[Array[Int]]): ArrayBuffer[Int] = {
      val n = graph.length
      val visited = HashSet.empty[Int]
      val result = ArrayBuffer.empty[Int]
      for (node <- 0 until n if !visited.contains(node))
        dfs(graph, node, visited, result)
      result
    }
  }

  val graph = Array(Array(1), Array(4), Array(3), Array(0), Array(2, 3))
  println(new Solution().depthFirstTraversal(graph).mkString(", "))
}
```

```javascript,editable
class Solution {
    dfs(graph, node, visited, result) {
        visited.add(node);
        result.push(node);
        for (const neighbour of graph[node]) {
            if (!visited.has(neighbour)) this.dfs(graph, neighbour, visited, result);
        }
    }

    depthFirstTraversal(graph) {
        const n = graph.length;
        if (n === 0) return [];
        const visited = new Set();
        const result = [];
        for (let node = 0; node < n; node++) {
            if (!visited.has(node)) this.dfs(graph, node, visited, result);
        }
        return result;
    }
}

const graph = [[1], [4], [3], [0], [2, 3]];
console.log(new Solution().depthFirstTraversal(graph));
```

```typescript,editable
class Solution {
    dfs(graph: number[][], node: number, visited: Set<number>, result: number[]): void {
        visited.add(node);
        result.push(node);
        for (const neighbour of graph[node]) {
            if (!visited.has(neighbour)) this.dfs(graph, neighbour, visited, result);
        }
    }

    depthFirstTraversal(graph: number[][]): number[] {
        const n = graph.length;
        if (n === 0) return [];
        const visited = new Set<number>();
        const result: number[] = [];
        for (let node = 0; node < n; node++) {
            if (!visited.has(node)) this.dfs(graph, node, visited, result);
        }
        return result;
    }
}

const graph: number[][] = [[1], [4], [3], [0], [2, 3]];
console.log(new Solution().depthFirstTraversal(graph));
```

```go,editable
package main

import "fmt"

func dfs(graph [][]int, node int, visited []bool, result *[]int) {
    visited[node] = true
    *result = append(*result, node)
    for _, neighbour := range graph[node] {
        if !visited[neighbour] {
            dfs(graph, neighbour, visited, result)
        }
    }
}

func depthFirstTraversal(graph [][]int) []int {
    n := len(graph)
    if n == 0 {
        return nil
    }
    visited := make([]bool, n)
    result := []int{}
    for node := 0; node < n; node++ {
        if !visited[node] {
            dfs(graph, node, visited, &result)
        }
    }
    return result
}

func main() {
    graph := [][]int{{1}, {4}, {3}, {0}, {2, 3}}
    fmt.Println(depthFirstTraversal(graph))
}
```

```kotlin,editable
class Solution {
    fun dfs(graph: List<List<Int>>, node: Int,
            visited: MutableSet<Int>, result: MutableList<Int>) {
        visited.add(node)
        result.add(node)
        for (neighbour in graph[node]) {
            if (neighbour !in visited) dfs(graph, neighbour, visited, result)
        }
    }

    fun depthFirstTraversal(graph: List<List<Int>>): List<Int> {
        val n = graph.size
        if (n == 0) return emptyList()
        val visited = mutableSetOf<Int>()
        val result = mutableListOf<Int>()
        for (node in 0 until n) {
            if (node !in visited) dfs(graph, node, visited, result)
        }
        return result
    }
}

fun main() {
    val graph = listOf(listOf(1), listOf(4), listOf(3), listOf(0), listOf(2, 3))
    println(Solution().depthFirstTraversal(graph))
}
```

```rust,editable
fn dfs(graph: &[Vec<usize>], node: usize, visited: &mut Vec<bool>, result: &mut Vec<usize>) {
    visited[node] = true;
    result.push(node);
    for &neighbour in &graph[node] {
        if !visited[neighbour] {
            dfs(graph, neighbour, visited, result);
        }
    }
}

fn depth_first_traversal(graph: &[Vec<usize>]) -> Vec<usize> {
    let n = graph.len();
    let mut visited = vec![false; n];
    let mut result = Vec::new();
    for node in 0..n {
        if !visited[node] {
            dfs(graph, node, &mut visited, &mut result);
        }
    }
    result
}

fn main() {
    let graph: Vec<Vec<usize>> = vec![vec![1], vec![4], vec![3], vec![0], vec![2, 3]];
    println!("{:?}", depth_first_traversal(&graph));
}
```

</div>

<details>
<summary><strong>Trace — graph = [[1], [4], [3], [0], [2, 3]]</strong></summary>

```
Step │ Stack (top = current)        │ Action                         │ visited       │ result
─────┼──────────────────────────────┼────────────────────────────────┼───────────────┼────────
1    │ dfs(0)                       │ enter 0, visited += 0          │ {0}           │ [0]
2    │ dfs(0) → dfs(1)              │ enter 1, visited += 1          │ {0,1}         │ [0,1]
3    │ dfs(0) → dfs(1) → dfs(4)     │ enter 4, visited += 4          │ {0,1,4}       │ [0,1,4]
4    │ → → dfs(4) → dfs(2)          │ enter 2, visited += 2          │ {0,1,2,4}     │ [0,1,4,2]
5    │ → → → dfs(2) → dfs(3)        │ enter 3, visited += 3          │ {0,1,2,3,4}   │ [0,1,4,2,3]
6    │ → → → dfs(3) checks 0        │ 0 visited; return              │               │
7    │ pop back to dfs(2)           │ no more neighbours; return     │               │
8    │ pop back to dfs(4)           │ next neighbour 3 already visited; return       │
9    │ pop back to dfs(1) → dfs(0)  │ no unvisited neighbours; return                │
10   │ outer loop: 1,2,3,4 visited  │ done                           │               │
Result: [0, 1, 4, 2, 3] ✓
```

</details>

---

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(N + E) | Each node is marked visited once; each edge is examined once when its endpoint is processed |
| **Space** | O(N) | The `visited` set stores up to N entries; the recursion stack depth is at most N for a long chain |

The recursion stack depth varies: on a linear path (0 → 1 → 2 → ... → N-1) the stack reaches N frames; on a star (everyone connected directly to a hub) the stack is at most 2 frames. The worst case is the long-chain shape, so we report O(N).

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
    subgraph Best["Best case — flat star, depth ≈ 2"]
      H((0))
      A((1))
      B((2))
      C((3))
      D((4))
      H --- A
      H --- B
      H --- C
      H --- D
    end
    subgraph Worst["Worst case — linear chain, depth = N"]
      direction LR
      W0((0)) --- W1((1)) --- W2((2)) --- W3((3)) --- W4((4))
    end
```

<p align="center"><strong>The recursion-depth extremes. A balanced graph sits between the two — but the algorithmic bound has to assume the worst.</strong></p>

For graphs deeper than a few thousand nodes, default recursion can blow the call stack. The fix is to convert DFS to an explicit-stack iterative form — same algorithm, your own stack instead of the call stack. We'll use that form in problems where deep graphs are expected.

DFS is wonderful when you want to *exhaustively explore one path at a time* — looking for cycles, finding any path, doing topological sort. But what if you want the **shortest** path? DFS doesn't give you that — it might find one path, but not necessarily the shortest. For shortest-path problems, you need a different ordering: **breadth-first**.

***

# Breadth-First Traversal — Ripple Outward

**Breadth-first search (BFS)** says: visit every node at distance 1 before any node at distance 2; every node at distance 2 before any node at distance 3; and so on.

Picture a stone dropped in a pond. Concentric ripples expand outward. Every point at radius 1 is reached together; then every point at radius 2; then radius 3. BFS is that — applied to graph nodes instead of water molecules.

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
flowchart TB
    A(("A<br/>(d=0)")) --> B(("B<br/>(d=1)"))
    A --> C(("C<br/>(d=1)"))
    B --> D(("D<br/>(d=2)"))
    B --> E(("E<br/>(d=2)"))
    C --> F(("F<br/>(d=2)"))
```

<p align="center"><strong>BFS from A. The label <code>d</code> is the distance (in hops) from the source. BFS visits all <code>d=1</code> nodes before any <code>d=2</code> node.</strong></p>

BFS is exactly tree level-order traversal generalised to graphs. The only difference is the visited set — without it, cycles would let nodes appear at multiple "levels" and re-enter the queue forever.

---

## The Mechanism — A Queue

DFS uses recursion (= the implicit call stack — last-in-first-out). BFS uses an **explicit queue** — first-in-first-out. The queue's order *is* the wavefront of the ripple.

```
bfs(source):
    queue = [source]
    mark source visited
    while queue not empty:
        node = queue.pop_front()
        for each neighbour n of node:
            if n not visited:
                mark n visited
                queue.push_back(n)
```

The queue starts with the source. We pop the front node, examine its neighbours, and **push every unvisited neighbour to the back**. Because pushes go to the back and pops come from the front, by the time we get to depth-2 nodes, every depth-1 node has already been popped.

> **Why mark visited at push, not pop?** If you marked at pop, a node could be pushed multiple times by different parents before it's first popped — bloating the queue and risking duplicate work. Marking at push guarantees each node enters the queue exactly once. This is the single most common BFS bug — write it on a sticky note.

Just like DFS, a single BFS only walks one connected component. The wrapper looping over every node solves that:

```
breadthFirstTraversal(graph):
    visited = empty set
    for each node v in graph:
        if v not visited:  bfs(v)
```

---

## The Two-Level Algorithm

Step-by-step:

> **`bfs(source, graph, visited, result)`**
> 1. Create an empty `queue`.
> 2. Add `source` to the queue and mark it visited.
> 3. While queue is not empty:
>    - Pop `node` from front of queue.
>    - Append `node` to result.
>    - For each `neighbour` in `graph[node]`:
>      - If `neighbour` not visited: mark it visited and push to queue.
>
> **`breadthFirstTraversal(graph)`**
> 1. Create empty `visited` set and `result` list.
> 2. For each `node` from 0 to N-1:
>    - If `node` not visited, call `bfs(node, ...)`.
> 3. Return `result`.

> *Before reading on — for the same graph as the DFS dry run, predict the BFS order from node 0.*

DFS gave us **0, 1, 4, 2, 3**. BFS from 0: queue starts `[0]`. Pop 0 → push 1 → queue `[1]`. Pop 1 → push 4 → queue `[4]`. Pop 4 → push 2 (and 3) → queue `[2,3]`. Pop 2 → 3 is already queued so nothing new. Pop 3 → 0 visited. Done. Order: **0, 1, 4, 2, 3**.

For *this* graph, DFS and BFS happen to agree because each node has at most one new neighbour per visit, so depth and breadth produce the same sequence. On a denser graph, they'd diverge sharply.

***

# BFS Implementation

<div class="lang-tabs">

```python,editable
from typing import List, Set
from collections import deque

class Solution:
    def bfs(self,
            graph: List[List[int]],
            source: int,
            visited: Set[int],
            result: List[int]) -> None:
        # deque gives O(1) append/popleft; using a plain list with pop(0) would be O(n).
        queue = deque([source])
        # IMPORTANT: mark visited at PUSH, not POP. Otherwise a node can be pushed
        # multiple times by different parents before it's popped once.
        visited.add(source)

        while queue:
            node = queue.popleft()
            result.append(node)
            for neighbour in graph[node]:
                if neighbour not in visited:
                    visited.add(neighbour)
                    queue.append(neighbour)

    def breadth_first_traversal(self, graph: List[List[int]]) -> List[int]:
        n = len(graph)
        if n == 0:
            return []
        visited: Set[int] = set()
        result: List[int] = []
        for node in range(n):
            if node not in visited:
                self.bfs(graph, node, visited, result)
        return result


graph = [[1], [4], [3], [0], [2, 3]]
print(Solution().breadth_first_traversal(graph))
```

```java,editable
import java.util.*;

public class Main {
    static class Solution {
        public void bfs(List<List<Integer>> graph, int source,
                        Set<Integer> visited, List<Integer> result) {
            Queue<Integer> queue = new ArrayDeque<>();
            queue.add(source);
            visited.add(source);   // mark at push, not pop
            while (!queue.isEmpty()) {
                int node = queue.poll();
                result.add(node);
                for (int neighbour : graph.get(node)) {
                    if (!visited.contains(neighbour)) {
                        visited.add(neighbour);
                        queue.add(neighbour);
                    }
                }
            }
        }

        public List<Integer> breadthFirstTraversal(List<List<Integer>> graph) {
            int n = graph.size();
            if (n == 0) return new ArrayList<>();
            Set<Integer> visited = new HashSet<>();
            List<Integer> result = new ArrayList<>();
            for (int node = 0; node < n; node++) {
                if (!visited.contains(node)) bfs(graph, node, visited, result);
            }
            return result;
        }
    }

    public static void main(String[] args) {
        List<List<Integer>> graph = List.of(
            List.of(1), List.of(4), List.of(3), List.of(0), List.of(2, 3));
        System.out.println(new Solution().breadthFirstTraversal(graph));
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct { int* data; int size; } AdjList;

static void bfs(AdjList* graph, int source, bool* visited, int* result, int* idx, int n) {
    int* queue = malloc(n * sizeof(int));
    int head = 0, tail = 0;
    queue[tail++] = source;
    visited[source] = true;
    while (head < tail) {
        int node = queue[head++];
        result[(*idx)++] = node;
        for (int i = 0; i < graph[node].size; i++) {
            int neighbour = graph[node].data[i];
            if (!visited[neighbour]) {
                visited[neighbour] = true;
                queue[tail++] = neighbour;
            }
        }
    }
    free(queue);
}

void breadth_first_traversal(AdjList* graph, int n, int* result, int* result_size) {
    bool* visited = calloc(n, sizeof(bool));
    int idx = 0;
    for (int node = 0; node < n; node++) {
        if (!visited[node]) bfs(graph, node, visited, result, &idx, n);
    }
    *result_size = idx;
    free(visited);
}

int main() {
    int n0[] = {1}, n1[] = {4}, n2[] = {3}, n3[] = {0}, n4[] = {2, 3};
    AdjList g[] = {{n0, 1}, {n1, 1}, {n2, 1}, {n3, 1}, {n4, 2}};
    int result[5], size;
    breadth_first_traversal(g, 5, result, &size);
    for (int i = 0; i < size; i++) printf("%d ", result[i]);
    printf("\n");
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <queue>
#include <unordered_set>

class Solution {
public:
    void bfs(std::vector<std::vector<int>>& graph, int source,
             std::unordered_set<int>& visited, std::vector<int>& result) {
        std::queue<int> q;
        q.push(source);
        visited.insert(source);
        while (!q.empty()) {
            int node = q.front(); q.pop();
            result.push_back(node);
            for (int n : graph[node]) {
                if (visited.find(n) == visited.end()) {
                    visited.insert(n);
                    q.push(n);
                }
            }
        }
    }

    std::vector<int> breadthFirstTraversal(std::vector<std::vector<int>>& graph) {
        int n = (int)graph.size();
        if (n == 0) return {};
        std::vector<int> result;
        std::unordered_set<int> visited;
        for (int node = 0; node < n; node++) {
            if (visited.find(node) == visited.end()) bfs(graph, node, visited, result);
        }
        return result;
    }
};

int main() {
    std::vector<std::vector<int>> graph = {{1}, {4}, {3}, {0}, {2, 3}};
    auto out = Solution().breadthFirstTraversal(graph);
    for (int v : out) std::cout << v << " ";
    std::cout << "\n";
}
```

```scala,editable
import scala.collection.mutable.{ArrayBuffer, HashSet, Queue}

object Main extends App {
  class Solution {
    def bfs(graph: Array[Array[Int]], source: Int,
            visited: HashSet[Int], result: ArrayBuffer[Int]): Unit = {
      val queue = Queue[Int]()
      queue.enqueue(source)
      visited.add(source)
      while (queue.nonEmpty) {
        val node = queue.dequeue()
        result.append(node)
        for (n <- graph(node) if !visited.contains(n)) {
          visited.add(n)
          queue.enqueue(n)
        }
      }
    }

    def breadthFirstTraversal(graph: Array[Array[Int]]): ArrayBuffer[Int] = {
      val visited = HashSet.empty[Int]
      val result = ArrayBuffer.empty[Int]
      for (node <- graph.indices if !visited.contains(node))
        bfs(graph, node, visited, result)
      result
    }
  }

  val graph = Array(Array(1), Array(4), Array(3), Array(0), Array(2, 3))
  println(new Solution().breadthFirstTraversal(graph).mkString(", "))
}
```

```javascript,editable
class Solution {
    bfs(graph, source, visited, result) {
        const queue = [source];
        visited.add(source);
        let head = 0;       // index-based head avoids O(n) shift on plain array.
        while (head < queue.length) {
            const node = queue[head++];
            result.push(node);
            for (const n of graph[node]) {
                if (!visited.has(n)) {
                    visited.add(n);
                    queue.push(n);
                }
            }
        }
    }

    breadthFirstTraversal(graph) {
        const n = graph.length;
        if (n === 0) return [];
        const visited = new Set();
        const result = [];
        for (let node = 0; node < n; node++) {
            if (!visited.has(node)) this.bfs(graph, node, visited, result);
        }
        return result;
    }
}

const graph = [[1], [4], [3], [0], [2, 3]];
console.log(new Solution().breadthFirstTraversal(graph));
```

```typescript,editable
class Solution {
    bfs(graph: number[][], source: number, visited: Set<number>, result: number[]): void {
        const queue: number[] = [source];
        visited.add(source);
        let head = 0;
        while (head < queue.length) {
            const node = queue[head++];
            result.push(node);
            for (const n of graph[node]) {
                if (!visited.has(n)) {
                    visited.add(n);
                    queue.push(n);
                }
            }
        }
    }

    breadthFirstTraversal(graph: number[][]): number[] {
        const n = graph.length;
        if (n === 0) return [];
        const visited = new Set<number>();
        const result: number[] = [];
        for (let node = 0; node < n; node++) {
            if (!visited.has(node)) this.bfs(graph, node, visited, result);
        }
        return result;
    }
}

const graph: number[][] = [[1], [4], [3], [0], [2, 3]];
console.log(new Solution().breadthFirstTraversal(graph));
```

```go,editable
package main

import "fmt"

func bfs(graph [][]int, source int, visited []bool, result *[]int) {
    queue := []int{source}
    visited[source] = true
    for len(queue) > 0 {
        node := queue[0]
        queue = queue[1:]
        *result = append(*result, node)
        for _, n := range graph[node] {
            if !visited[n] {
                visited[n] = true
                queue = append(queue, n)
            }
        }
    }
}

func breadthFirstTraversal(graph [][]int) []int {
    n := len(graph)
    if n == 0 {
        return nil
    }
    visited := make([]bool, n)
    result := []int{}
    for node := 0; node < n; node++ {
        if !visited[node] {
            bfs(graph, node, visited, &result)
        }
    }
    return result
}

func main() {
    graph := [][]int{{1}, {4}, {3}, {0}, {2, 3}}
    fmt.Println(breadthFirstTraversal(graph))
}
```

```kotlin,editable
import java.util.ArrayDeque

class Solution {
    fun bfs(graph: List<List<Int>>, source: Int,
            visited: MutableSet<Int>, result: MutableList<Int>) {
        val queue = ArrayDeque<Int>()
        queue.add(source)
        visited.add(source)
        while (queue.isNotEmpty()) {
            val node = queue.poll()
            result.add(node)
            for (n in graph[node]) {
                if (n !in visited) {
                    visited.add(n)
                    queue.add(n)
                }
            }
        }
    }

    fun breadthFirstTraversal(graph: List<List<Int>>): List<Int> {
        val n = graph.size
        if (n == 0) return emptyList()
        val visited = mutableSetOf<Int>()
        val result = mutableListOf<Int>()
        for (node in 0 until n) {
            if (node !in visited) bfs(graph, node, visited, result)
        }
        return result
    }
}

fun main() {
    val graph = listOf(listOf(1), listOf(4), listOf(3), listOf(0), listOf(2, 3))
    println(Solution().breadthFirstTraversal(graph))
}
```

```rust,editable
use std::collections::VecDeque;

fn bfs(graph: &[Vec<usize>], source: usize, visited: &mut Vec<bool>, result: &mut Vec<usize>) {
    let mut queue: VecDeque<usize> = VecDeque::new();
    queue.push_back(source);
    visited[source] = true;
    while let Some(node) = queue.pop_front() {
        result.push(node);
        for &n in &graph[node] {
            if !visited[n] {
                visited[n] = true;
                queue.push_back(n);
            }
        }
    }
}

fn breadth_first_traversal(graph: &[Vec<usize>]) -> Vec<usize> {
    let n = graph.len();
    let mut visited = vec![false; n];
    let mut result = Vec::new();
    for node in 0..n {
        if !visited[node] {
            bfs(graph, node, &mut visited, &mut result);
        }
    }
    result
}

fn main() {
    let graph: Vec<Vec<usize>> = vec![vec![1], vec![4], vec![3], vec![0], vec![2, 3]];
    println!("{:?}", breadth_first_traversal(&graph));
}
```

</div>

<details>
<summary><strong>Trace — graph = [[1], [4], [3], [0], [2, 3]] starting from node 0</strong></summary>

```
Step │ Queue        │ Action                                  │ visited       │ result
─────┼──────────────┼─────────────────────────────────────────┼───────────────┼──────────
1    │ [0]          │ push 0; mark 0                          │ {0}           │ []
2    │ [1]          │ pop 0; push 1; mark 1                   │ {0,1}         │ [0]
3    │ [4]          │ pop 1; push 4; mark 4                   │ {0,1,4}       │ [0,1]
4    │ [2,3]        │ pop 4; push 2,3; mark 2,3               │ {0,1,2,3,4}   │ [0,1,4]
5    │ [3]          │ pop 2; 3 already marked → no push       │ {0,1,2,3,4}   │ [0,1,4,2]
6    │ [ ]          │ pop 3; 0 already marked → no push       │ {0,1,2,3,4}   │ [0,1,4,2,3]
Result: [0, 1, 4, 2, 3] ✓
```

</details>

---

## Complexity Analysis

| | Complexity | Reasoning |
|---|---|---|
| **Time** | O(N + E) | Each node enters the queue at most once; each edge is examined exactly once when its endpoint is dequeued |
| **Space** | O(N) | The queue holds at most N entries; visited stores up to N |

Same Big-O as DFS — both visit every node and every edge once. The constant factors and the *order* differ, not the asymptotic cost.

***

# DFS vs BFS — When to Choose Which

The two traversals share their Big-O budget. They differ in three ways that matter at the algorithm-choice stage:

| | DFS | BFS |
|---|---|---|
| Data structure | Recursion (call stack) | Queue (explicit) |
| Order | One path deep, then back | Concentric "rings" outward |
| Memory shape | Stack depth = longest path | Queue width = max ring size |
| Sweet spot | Topology / cycles / paths / "exists a path" | **Shortest path** in unweighted graphs / level-by-level |

```d2
direction: right

decision: "Pick a traversal" {
  q1: |md
    **Need shortest path**

    in unweighted graph?
  |
  q2: |md
    **Need to track levels**

    or distances from start?
  |
  q3: |md
    **Doing topological sort,**

    cycle detection,

    or 'find any path'?
  |
  bfs: |md
    **BFS**

    Use a queue.
  |
  dfs: |md
    **DFS**

    Use recursion.
  |

  q1 -> bfs: yes
  q2 -> bfs: yes
  q3 -> dfs: yes
}
```

<p align="center"><strong>Quick selection guide. The headline rule: shortest-path-on-unweighted ⇒ BFS; everything else, default to DFS.</strong></p>

DFS is also the only sensible choice when the graph is a tree-shaped DAG (e.g. a directory tree or a JSON tree) and you want full traversal in one pass — the call stack handles backtracking naturally.

BFS is the only sensible choice when the question contains the word *"shortest"*, *"minimum hops"*, *"closest"*, or *"level"*. In an unweighted graph, BFS finds the minimum-hop path from the source to any other node "for free" — it's a side effect of the wavefront.

> **Memory trick — "DFS dives, BFS sweeps."** DFS dives down one path; BFS sweeps across every depth.

---

## Final Takeaway

DFS and BFS aren't two algorithms — they're **two perspectives on the same act of visiting every node**. Once both perspectives are second nature, every advanced graph algorithm (Dijkstra, topological sort, bipartite check, cycle detection, shortest path on grids) is a small mutation of one of them.

You now have:
- A mental model for each (deep dive / ripple)
- The two-level structure that handles disconnected graphs
- Implementations in 10 languages
- The selection rule for when to use which

The rest of this chapter weaponises these two patterns. Cycle detection? DFS plus a 3-colour state. Topological sort? DFS plus a "completed" stack. Shortest path on grid? BFS plus directional moves. Once you see the seed pattern, the rest writes itself.

But there's a different kind of graph we haven't talked about yet — one that's all around you in 2D and grows up to 3D, 4D, even higher. **Grids.** They're graphs in disguise, and they have their own quirks. That's the next lesson.

> **Transfer challenge.** You have a 1024-node graph where the longest path is 1023 nodes. You want to traverse it. Your runtime gives you a 1MB call stack. Which traversal do you pick, and why? Could the other one work with a small change?

<details>
<summary><strong>Solution</strong></summary>

DFS recursion with default Python (~1KB per frame) would overflow at depth ~1000. Pick **BFS** — the queue lives on the heap, no stack-depth concern. Alternatively, convert DFS to **iterative DFS** with your own explicit stack on the heap — same algorithm, no recursion, no stack overflow. Most production graph code uses iterative DFS for exactly this reason.

</details>
