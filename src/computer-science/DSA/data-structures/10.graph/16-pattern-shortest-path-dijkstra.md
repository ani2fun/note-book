# 16. Pattern: Shortest path (Dijkstra)

This lesson teaches you the **Dijkstra-pattern** — the recipe for any "minimum cost / weighted shortest path" problem on graphs with non-negative edge weights. It's the upgrade from BFS that handles arbitrary edge costs.

## Table of contents

1. [When BFS isn't enough — and Dijkstra is](#when-bfs-isnt-enough--and-dijkstra-is)
2. [The Dijkstra-pattern template](#the-dijkstra-pattern-template)
3. [Identifying the pattern](#identifying-the-pattern)
4. [Problem: Minimum cost path](#problem-minimum-cost-path)
5. [Problem: Cheapest flights with K stops](#problem-cheapest-flights-with-k-stops)
6. [Problem: Minimum travel time](#problem-minimum-travel-time)

***

# When BFS Isn't Enough — and Dijkstra Is

BFS gives you the shortest path in *number of hops*. Dijkstra gives you the shortest path in *cumulative weight*. The difference is whether each edge counts as 1 or as a varying real cost.

A grid where every cell is 1 step? BFS. A grid where each cell has a different toll cost? Dijkstra.

```d2
direction: right

bfs: "BFS — fewest hops" {
  grid-rows: 1
  grid-columns: 1
  grid-gap: 0
  l: |md
    Every step costs 1.

    First time you reach a node = shortest distance (in hops).

    FIFO queue is enough.
  |
}

dij: "Dijkstra — minimum cumulative weight" {
  grid-rows: 1
  grid-columns: 1
  grid-gap: 0
  l: |md
    Steps have varying cost.

    First time you POP a node from a min-heap = shortest weighted distance.

    Min-heap (priority queue) is required.
  |
}
```

<p align="center"><strong>The two siblings. Same shape — repeatedly visit the "closest" unvisited node — but "closest" means depth in BFS and weighted-distance in Dijkstra.</strong></p>

The Dijkstra pattern shows up wherever:

- **Tolls / fees / costs** vary across edges.
- **Travel times** change per route.
- **Resource consumption** differs by transition.
- **Reliability scores** stack.

The constraint: **all edge weights must be ≥ 0**. Negative weights break Dijkstra (we covered why in lesson 8) — for those, you'd reach for Bellman-Ford.

> *Before reading on — for a graph with weights 1, 1, 1, 1, would Dijkstra and BFS produce the same answer? What about for weights 1, 2, 3, 4?*

For uniform weights, yes — Dijkstra degenerates to BFS, just slower (log-factor heap overhead). For varying weights, BFS would give the wrong answer in cumulative cost — it'd return the path with fewest edges, not lowest cost. Dijkstra is the right tool the moment any weight varies.

***

# The Dijkstra-Pattern Template

The skeleton:

```
dijkstra(graph, source):
    distance = [∞] * N
    distance[source] = 0
    heap = min-heap of (distance, node) pairs, seeded with (0, source)
    while heap not empty:
        (d, node) = heappop(heap)
        if d > distance[node]: continue            # stale entry
        for each (neighbour, weight) in graph[node]:
            new_dist = d + weight
            if new_dist < distance[neighbour]:
                distance[neighbour] = new_dist
                heappush(heap, (new_dist, neighbour))
    return distance
```

Key elements that *every* Dijkstra-pattern problem will share:

1. **Min-heap keyed by cumulative cost.** First out = node with lowest known cost so far.
2. **Distance array, initialised to infinity.** Final values = answers.
3. **Lazy stale-entry skip.** Updates push new entries instead of decreasing keys; stale ones are filtered by `if d > distance[node]: continue`.
4. **Weight-aware relaxation.** `if d + weight < distance[neighbour]` is the line that does the real work.

For grid-flavoured Dijkstra (most interview problems), the graph is implicit — neighbours come from a direction array, not an adjacency list.

***

# Identifying the Pattern

The signal-words:

- *"Minimum cost / time / distance / fuel / weight / total"*
- *"Shortest path"* with **edge weights**
- *"Cheapest flight"*, *"fastest route"*, *"least toll"*
- *"Minimise [some additive quantity]"* on a graph or grid

If the problem is unweighted (or all weights equal), use BFS. If the graph has negative weights, use Bellman-Ford. Otherwise: **Dijkstra**.

***

# Problem: Minimum Cost Path

## The Problem

Grid where each cell is the cost to step on it. Find the minimum total cost from `(0, 0)` to `(N-1, M-1)`, where you can move in 4 cardinal directions.

```
Input:  grid = [[9, 4, 9, 9],
                [6, 7, 6, 4],
                [8, 3, 3, 7],
                [7, 4, 9, 10]]
Output: 43
```

## Pattern Mapping

The grid is a graph where each cell is a node and each move is an edge. Edge weight from cell `A` to cell `B` is the cost of cell `B` (the cell you're stepping onto). The starting cell's cost is also added — that's the seed.

Standard Dijkstra from `(0, 0)`. Return `distance[N-1][M-1]`.

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List
import heapq

DIRS = [(-1, 0), (0, 1), (1, 0), (0, -1)]
INF = float('inf')

class Solution:
    def minimum_cost_path(self, grid: List[List[int]]) -> int:
        if not grid or not grid[0]:
            return 0
        rows, cols = len(grid), len(grid[0])
        # min_cost[r][c] = lowest known cost from (0,0) to (r,c).
        min_cost = [[INF] * cols for _ in range(rows)]
        min_cost[0][0] = grid[0][0]
        heap = [(grid[0][0], 0, 0)]               # (cost, row, col)

        while heap:
            cost, r, c = heapq.heappop(heap)
            if cost > min_cost[r][c]:
                continue                           # stale
            if r == rows - 1 and c == cols - 1:
                return cost
            for dr, dc in DIRS:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    new_cost = cost + grid[nr][nc]
                    if new_cost < min_cost[nr][nc]:
                        min_cost[nr][nc] = new_cost
                        heapq.heappush(heap, (new_cost, nr, nc))
        return min_cost[rows - 1][cols - 1]


grid = [[9, 4, 9, 9], [6, 7, 6, 4], [8, 3, 3, 7], [7, 4, 9, 10]]
print(Solution().minimum_cost_path(grid))    # 43
```

```java,editable
import java.util.*;

public class Main {
    static class Solution {
        static final int[][] DIRS = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};

        public int minimumCostPath(int[][] grid) {
            int rows = grid.length, cols = grid[0].length;
            int[][] minCost = new int[rows][cols];
            for (int[] row : minCost) Arrays.fill(row, Integer.MAX_VALUE);
            minCost[0][0] = grid[0][0];
            // Min-heap on first element (cost).
            PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
            pq.offer(new int[]{grid[0][0], 0, 0});
            while (!pq.isEmpty()) {
                int[] cur = pq.poll();
                int cost = cur[0], r = cur[1], c = cur[2];
                if (cost > minCost[r][c]) continue;
                if (r == rows - 1 && c == cols - 1) return cost;
                for (int[] d : DIRS) {
                    int nr = r + d[0], nc = c + d[1];
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        int nc2 = cost + grid[nr][nc];
                        if (nc2 < minCost[nr][nc]) {
                            minCost[nr][nc] = nc2;
                            pq.offer(new int[]{nc2, nr, nc});
                        }
                    }
                }
            }
            return minCost[rows - 1][cols - 1];
        }
    }

    public static void main(String[] args) {
        int[][] grid = {{9, 4, 9, 9}, {6, 7, 6, 4}, {8, 3, 3, 7}, {7, 4, 9, 10}};
        System.out.println(new Solution().minimumCostPath(grid));
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

static const int DIRS[4][2] = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};

typedef struct { int cost, r, c; } Entry;
typedef struct { Entry* data; int size; int capacity; } Heap;

static void heap_push(Heap* h, Entry e) {
    if (h->size == h->capacity) {
        h->capacity = h->capacity ? h->capacity * 2 : 16;
        h->data = realloc(h->data, h->capacity * sizeof(Entry));
    }
    int i = h->size++;
    h->data[i] = e;
    while (i > 0) {
        int p = (i - 1) / 2;
        if (h->data[p].cost <= h->data[i].cost) break;
        Entry t = h->data[p]; h->data[p] = h->data[i]; h->data[i] = t;
        i = p;
    }
}
static Entry heap_pop(Heap* h) {
    Entry top = h->data[0];
    h->data[0] = h->data[--h->size];
    int i = 0;
    while (1) {
        int l = i*2+1, r = i*2+2, best = i;
        if (l < h->size && h->data[l].cost < h->data[best].cost) best = l;
        if (r < h->size && h->data[r].cost < h->data[best].cost) best = r;
        if (best == i) break;
        Entry t = h->data[i]; h->data[i] = h->data[best]; h->data[best] = t;
        i = best;
    }
    return top;
}

int minimum_cost_path(int** grid, int rows, int cols) {
    int** min_cost = malloc(rows * sizeof(int*));
    for (int i = 0; i < rows; i++) {
        min_cost[i] = malloc(cols * sizeof(int));
        for (int j = 0; j < cols; j++) min_cost[i][j] = INT_MAX;
    }
    min_cost[0][0] = grid[0][0];
    Heap h = {0};
    heap_push(&h, (Entry){grid[0][0], 0, 0});
    int result = INT_MAX;
    while (h.size > 0) {
        Entry cur = heap_pop(&h);
        if (cur.cost > min_cost[cur.r][cur.c]) continue;
        if (cur.r == rows - 1 && cur.c == cols - 1) { result = cur.cost; break; }
        for (int d = 0; d < 4; d++) {
            int nr = cur.r + DIRS[d][0], nc = cur.c + DIRS[d][1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                int new_cost = cur.cost + grid[nr][nc];
                if (new_cost < min_cost[nr][nc]) {
                    min_cost[nr][nc] = new_cost;
                    heap_push(&h, (Entry){new_cost, nr, nc});
                }
            }
        }
    }
    free(h.data);
    for (int i = 0; i < rows; i++) free(min_cost[i]);
    free(min_cost);
    return result;
}

int main() {
    int data[4][4] = {{9, 4, 9, 9}, {6, 7, 6, 4}, {8, 3, 3, 7}, {7, 4, 9, 10}};
    int* grid[4];
    for (int i = 0; i < 4; i++) grid[i] = data[i];
    printf("%d\n", minimum_cost_path(grid, 4, 4));
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <queue>
#include <climits>

class Solution {
    static constexpr int DIRS[4][2] = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};
public:
    int minimumCostPath(std::vector<std::vector<int>>& grid) {
        int rows = grid.size(), cols = grid[0].size();
        std::vector<std::vector<int>> minCost(rows, std::vector<int>(cols, INT_MAX));
        minCost[0][0] = grid[0][0];
        std::priority_queue<std::tuple<int, int, int>,
                            std::vector<std::tuple<int, int, int>>,
                            std::greater<>> pq;
        pq.push({grid[0][0], 0, 0});
        while (!pq.empty()) {
            auto [cost, r, c] = pq.top(); pq.pop();
            if (cost > minCost[r][c]) continue;
            if (r == rows - 1 && c == cols - 1) return cost;
            for (auto& d : DIRS) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    int nc2 = cost + grid[nr][nc];
                    if (nc2 < minCost[nr][nc]) {
                        minCost[nr][nc] = nc2;
                        pq.push({nc2, nr, nc});
                    }
                }
            }
        }
        return minCost[rows - 1][cols - 1];
    }
};

int main() {
    std::vector<std::vector<int>> grid = {{9, 4, 9, 9}, {6, 7, 6, 4}, {8, 3, 3, 7}, {7, 4, 9, 10}};
    std::cout << Solution().minimumCostPath(grid) << "\n";
}
```

```scala,editable
import scala.collection.mutable

object Main extends App {
  val DIRS = Array((-1, 0), (0, 1), (1, 0), (0, -1))

  class Solution {
    def minimumCostPath(grid: Array[Array[Int]]): Int = {
      val rows = grid.length; val cols = grid(0).length
      val minCost = Array.fill(rows, cols)(Int.MaxValue)
      minCost(0)(0) = grid(0)(0)
      val pq = mutable.PriorityQueue.empty[(Int, Int, Int)](
        Ordering.by[(Int, Int, Int), Int](_._1).reverse)
      pq.enqueue((grid(0)(0), 0, 0))
      while (pq.nonEmpty) {
        val (cost, r, c) = pq.dequeue()
        if (cost <= minCost(r)(c)) {
          if (r == rows - 1 && c == cols - 1) return cost
          for ((dr, dc) <- DIRS) {
            val nr = r + dr; val nc = c + dc
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              val newCost = cost + grid(nr)(nc)
              if (newCost < minCost(nr)(nc)) {
                minCost(nr)(nc) = newCost
                pq.enqueue((newCost, nr, nc))
              }
            }
          }
        }
      }
      minCost(rows - 1)(cols - 1)
    }
  }

  val grid = Array(Array(9, 4, 9, 9), Array(6, 7, 6, 4), Array(8, 3, 3, 7), Array(7, 4, 9, 10))
  println(new Solution().minimumCostPath(grid))
}
```

```javascript,editable
class MinHeap {
    constructor() { this.h = []; }
    push(x) { this.h.push(x); this._up(this.h.length - 1); }
    pop() {
        const top = this.h[0]; const last = this.h.pop();
        if (this.h.length) { this.h[0] = last; this._down(0); }
        return top;
    }
    get size() { return this.h.length; }
    _up(i) { while (i > 0) {
        const p = (i - 1) >> 1;
        if (this.h[p][0] <= this.h[i][0]) break;
        [this.h[p], this.h[i]] = [this.h[i], this.h[p]]; i = p;
    }}
    _down(i) {
        while (true) {
            const l = i*2+1, r = i*2+2; let best = i;
            if (l < this.h.length && this.h[l][0] < this.h[best][0]) best = l;
            if (r < this.h.length && this.h[r][0] < this.h[best][0]) best = r;
            if (best === i) break;
            [this.h[i], this.h[best]] = [this.h[best], this.h[i]]; i = best;
        }
    }
}

const DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]];

class Solution {
    minimumCostPath(grid) {
        const rows = grid.length, cols = grid[0].length;
        const minCost = Array.from({length: rows}, () => Array(cols).fill(Infinity));
        minCost[0][0] = grid[0][0];
        const heap = new MinHeap();
        heap.push([grid[0][0], 0, 0]);
        while (heap.size) {
            const [cost, r, c] = heap.pop();
            if (cost > minCost[r][c]) continue;
            if (r === rows - 1 && c === cols - 1) return cost;
            for (const [dr, dc] of DIRS) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    const newCost = cost + grid[nr][nc];
                    if (newCost < minCost[nr][nc]) {
                        minCost[nr][nc] = newCost;
                        heap.push([newCost, nr, nc]);
                    }
                }
            }
        }
        return minCost[rows - 1][cols - 1];
    }
}

const grid = [[9, 4, 9, 9], [6, 7, 6, 4], [8, 3, 3, 7], [7, 4, 9, 10]];
console.log(new Solution().minimumCostPath(grid));
```

```typescript,editable
class MinHeap<T extends [number, ...any[]]> {
    private h: T[] = [];
    push(x: T) { this.h.push(x); this._up(this.h.length - 1); }
    pop(): T {
        const top = this.h[0]; const last = this.h.pop()!;
        if (this.h.length) { this.h[0] = last; this._down(0); }
        return top;
    }
    get size() { return this.h.length; }
    private _up(i: number) { while (i > 0) {
        const p = (i - 1) >> 1;
        if (this.h[p][0] <= this.h[i][0]) break;
        [this.h[p], this.h[i]] = [this.h[i], this.h[p]]; i = p;
    }}
    private _down(i: number) {
        while (true) {
            const l = i*2+1, r = i*2+2; let best = i;
            if (l < this.h.length && this.h[l][0] < this.h[best][0]) best = l;
            if (r < this.h.length && this.h[r][0] < this.h[best][0]) best = r;
            if (best === i) break;
            [this.h[i], this.h[best]] = [this.h[best], this.h[i]]; i = best;
        }
    }
}

const DIRS: [number, number][] = [[-1, 0], [0, 1], [1, 0], [0, -1]];

class Solution {
    minimumCostPath(grid: number[][]): number {
        const rows = grid.length, cols = grid[0].length;
        const minCost = Array.from({length: rows}, () => Array(cols).fill(Infinity));
        minCost[0][0] = grid[0][0];
        const heap = new MinHeap<[number, number, number]>();
        heap.push([grid[0][0], 0, 0]);
        while (heap.size) {
            const [cost, r, c] = heap.pop();
            if (cost > minCost[r][c]) continue;
            if (r === rows - 1 && c === cols - 1) return cost;
            for (const [dr, dc] of DIRS) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    const newCost = cost + grid[nr][nc];
                    if (newCost < minCost[nr][nc]) {
                        minCost[nr][nc] = newCost;
                        heap.push([newCost, nr, nc]);
                    }
                }
            }
        }
        return minCost[rows - 1][cols - 1];
    }
}

const grid: number[][] = [[9, 4, 9, 9], [6, 7, 6, 4], [8, 3, 3, 7], [7, 4, 9, 10]];
console.log(new Solution().minimumCostPath(grid));
```

```go,editable
package main

import (
    "container/heap"
    "fmt"
    "math"
)

var DIRS_MCP = [4][2]int{{-1, 0}, {0, 1}, {1, 0}, {0, -1}}

type ItemMCP struct{ cost, r, c int }
type PQMCP []ItemMCP

func (p PQMCP) Len() int            { return len(p) }
func (p PQMCP) Less(i, j int) bool  { return p[i].cost < p[j].cost }
func (p PQMCP) Swap(i, j int)       { p[i], p[j] = p[j], p[i] }
func (p *PQMCP) Push(x interface{}) { *p = append(*p, x.(ItemMCP)) }
func (p *PQMCP) Pop() interface{}   { old := *p; n := len(old); x := old[n-1]; *p = old[:n-1]; return x }

func minimumCostPath(grid [][]int) int {
    rows, cols := len(grid), len(grid[0])
    minCost := make([][]int, rows)
    for i := range minCost {
        minCost[i] = make([]int, cols)
        for j := range minCost[i] {
            minCost[i][j] = math.MaxInt32
        }
    }
    minCost[0][0] = grid[0][0]
    pq := &PQMCP{{grid[0][0], 0, 0}}
    heap.Init(pq)
    for pq.Len() > 0 {
        cur := heap.Pop(pq).(ItemMCP)
        if cur.cost > minCost[cur.r][cur.c] { continue }
        if cur.r == rows-1 && cur.c == cols-1 { return cur.cost }
        for _, d := range DIRS_MCP {
            nr, nc := cur.r+d[0], cur.c+d[1]
            if nr >= 0 && nr < rows && nc >= 0 && nc < cols {
                newCost := cur.cost + grid[nr][nc]
                if newCost < minCost[nr][nc] {
                    minCost[nr][nc] = newCost
                    heap.Push(pq, ItemMCP{newCost, nr, nc})
                }
            }
        }
    }
    return minCost[rows-1][cols-1]
}

func main() {
    grid := [][]int{{9, 4, 9, 9}, {6, 7, 6, 4}, {8, 3, 3, 7}, {7, 4, 9, 10}}
    fmt.Println(minimumCostPath(grid))
}
```

```kotlin,editable
import java.util.PriorityQueue

val DIRS_MCP = arrayOf(intArrayOf(-1, 0), intArrayOf(0, 1), intArrayOf(1, 0), intArrayOf(0, -1))

class Solution {
    fun minimumCostPath(grid: Array<IntArray>): Int {
        val rows = grid.size; val cols = grid[0].size
        val minCost = Array(rows) { IntArray(cols) { Int.MAX_VALUE } }
        minCost[0][0] = grid[0][0]
        val pq = PriorityQueue<IntArray>(compareBy { it[0] })
        pq.offer(intArrayOf(grid[0][0], 0, 0))
        while (pq.isNotEmpty()) {
            val (cost, r, c) = pq.poll()
            if (cost > minCost[r][c]) continue
            if (r == rows - 1 && c == cols - 1) return cost
            for (d in DIRS_MCP) {
                val nr = r + d[0]; val nc = c + d[1]
                if (nr in 0 until rows && nc in 0 until cols) {
                    val newCost = cost + grid[nr][nc]
                    if (newCost < minCost[nr][nc]) {
                        minCost[nr][nc] = newCost
                        pq.offer(intArrayOf(newCost, nr, nc))
                    }
                }
            }
        }
        return minCost[rows - 1][cols - 1]
    }
}

fun main() {
    val grid = arrayOf(intArrayOf(9, 4, 9, 9), intArrayOf(6, 7, 6, 4),
                       intArrayOf(8, 3, 3, 7), intArrayOf(7, 4, 9, 10))
    println(Solution().minimumCostPath(grid))
}
```

```rust,editable
use std::collections::BinaryHeap;
use std::cmp::Reverse;

const DIRS: [(i32, i32); 4] = [(-1, 0), (0, 1), (1, 0), (0, -1)];

fn minimum_cost_path(grid: &[Vec<i32>]) -> i32 {
    let rows = grid.len(); let cols = grid[0].len();
    let mut min_cost = vec![vec![i32::MAX; cols]; rows];
    min_cost[0][0] = grid[0][0];
    let mut heap: BinaryHeap<Reverse<(i32, usize, usize)>> = BinaryHeap::new();
    heap.push(Reverse((grid[0][0], 0, 0)));
    while let Some(Reverse((cost, r, c))) = heap.pop() {
        if cost > min_cost[r][c] { continue; }
        if r == rows - 1 && c == cols - 1 { return cost; }
        for (dr, dc) in DIRS {
            let nr = r as i32 + dr; let nc = c as i32 + dc;
            if nr >= 0 && (nr as usize) < rows && nc >= 0 && (nc as usize) < cols {
                let (nr, nc) = (nr as usize, nc as usize);
                let new_cost = cost + grid[nr][nc];
                if new_cost < min_cost[nr][nc] {
                    min_cost[nr][nc] = new_cost;
                    heap.push(Reverse((new_cost, nr, nc)));
                }
            }
        }
    }
    min_cost[rows - 1][cols - 1]
}

fn main() {
    let grid = vec![vec![9, 4, 9, 9], vec![6, 7, 6, 4], vec![8, 3, 3, 7], vec![7, 4, 9, 10]];
    println!("{}", minimum_cost_path(&grid));
}
```

</div>

***

# Problem: Cheapest Flights With K Stops

## The Problem

Given a list of one-way flights (`from`, `to`, `cost`), source city, destination, and `K` (max stops allowed), find the minimum-cost flight path. Return -1 if impossible.

```
Input:  flights = [[[1,2],[3,1]], [[4,4]], [[4,1]], [[2,2],[4,5]], []]
        source = 0, destination = 4, K = 2
Output: 4 (path 0 → 3 → 2 → 4 with 2 stops)
```

## Pattern Mapping — Dijkstra With State

The crucial twist: you can't use the standard Dijkstra distance array, because two paths to the same city might have different stop counts — and the "fewer stops" path might still be useful even if it costs more.

**Solution: 2D distance array.** Track `min_cost[city][flights_taken]` instead of `min_cost[city]`. Every queue entry carries `(cost, city, flights_used)` — flights = the number of edges taken so far.

This is the **stateful Dijkstra** variant — the same pattern, but you augment the node with a state dimension that affects which transitions are valid.

> *Before reading on — why doesn't the standard 1D Dijkstra work here? What can go wrong?*

The standard Dijkstra finalises a city's distance the first time it's popped. But here, "first popped" might mean "popped after using K+1 flights" — useless because we've exceeded the budget. A 1D Dijkstra would close off the destination too early. The 2D state (cost + stops) lets us discover *paths within budget* even if they're longer.

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List
import heapq

INF = float('inf')

class Solution:
    def cheapest_flights(self,
                         flights: List[List[List[int]]],
                         source: int, destination: int, k: int) -> int:
        n = len(flights)
        # min_cost[city][flights_used] — flights from 0 to k+1.
        # k stops = up to k+1 flights (e.g. k=1 → 0->1->2 has 1 stop and 2 flights).
        min_cost = [[INF] * (k + 2) for _ in range(n)]
        min_cost[source][0] = 0
        heap = [(0, source, 0)]                  # (cost, city, flights)

        while heap:
            cost, city, flights_used = heapq.heappop(heap)
            if city == destination:
                return cost
            if flights_used > k + 1 or cost > min_cost[city][flights_used]:
                continue
            for next_city, weight in flights[city]:
                new_cost = cost + weight
                next_used = flights_used + 1
                if next_used <= k + 1 and new_cost < min_cost[next_city][next_used]:
                    min_cost[next_city][next_used] = new_cost
                    heapq.heappush(heap, (new_cost, next_city, next_used))
        return -1


flights = [[[1, 2], [3, 1]], [[4, 4]], [[4, 1]], [[2, 2], [4, 5]], []]
print(Solution().cheapest_flights(flights, 0, 4, 2))   # 4
```

```java,editable
import java.util.*;

public class Main {
    static class Solution {
        public int cheapestFlights(List<List<int[]>> flights, int source, int destination, int K) {
            int n = flights.size();
            int[][] minCost = new int[n][K + 2];
            for (int[] row : minCost) Arrays.fill(row, Integer.MAX_VALUE);
            minCost[source][0] = 0;
            PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
            pq.offer(new int[]{0, source, 0});
            while (!pq.isEmpty()) {
                int[] cur = pq.poll();
                int cost = cur[0], city = cur[1], used = cur[2];
                if (city == destination) return cost;
                if (used > K + 1 || cost > minCost[city][used]) continue;
                for (int[] f : flights.get(city)) {
                    int newCity = f[0], weight = f[1];
                    int newCost = cost + weight, nextUsed = used + 1;
                    if (nextUsed <= K + 1 && newCost < minCost[newCity][nextUsed]) {
                        minCost[newCity][nextUsed] = newCost;
                        pq.offer(new int[]{newCost, newCity, nextUsed});
                    }
                }
            }
            return -1;
        }
    }

    public static void main(String[] args) {
        var flights = List.of(
            List.of(new int[]{1, 2}, new int[]{3, 1}),
            List.of(new int[]{4, 4}),
            List.of(new int[]{4, 1}),
            List.of(new int[]{2, 2}, new int[]{4, 5}),
            List.<int[]>of());
        System.out.println(new Solution().cheapestFlights(flights, 0, 4, 2));
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

typedef struct { int to, cost; } Flight;
typedef struct { Flight* data; int size; } AdjList;

typedef struct { int cost, city, used; } Entry;
typedef struct { Entry* data; int size; int capacity; } Heap;

static void heap_push(Heap* h, Entry e) {
    if (h->size == h->capacity) {
        h->capacity = h->capacity ? h->capacity * 2 : 16;
        h->data = realloc(h->data, h->capacity * sizeof(Entry));
    }
    int i = h->size++;
    h->data[i] = e;
    while (i > 0) {
        int p = (i - 1) / 2;
        if (h->data[p].cost <= h->data[i].cost) break;
        Entry t = h->data[p]; h->data[p] = h->data[i]; h->data[i] = t;
        i = p;
    }
}
static Entry heap_pop(Heap* h) {
    Entry top = h->data[0];
    h->data[0] = h->data[--h->size];
    int i = 0;
    while (1) {
        int l = i*2+1, r = i*2+2, best = i;
        if (l < h->size && h->data[l].cost < h->data[best].cost) best = l;
        if (r < h->size && h->data[r].cost < h->data[best].cost) best = r;
        if (best == i) break;
        Entry t = h->data[i]; h->data[i] = h->data[best]; h->data[best] = t;
        i = best;
    }
    return top;
}

int cheapest_flights(AdjList* flights, int n, int source, int destination, int K) {
    int** min_cost = malloc(n * sizeof(int*));
    for (int i = 0; i < n; i++) {
        min_cost[i] = malloc((K + 2) * sizeof(int));
        for (int j = 0; j < K + 2; j++) min_cost[i][j] = INT_MAX;
    }
    min_cost[source][0] = 0;
    Heap h = {0};
    heap_push(&h, (Entry){0, source, 0});
    int answer = -1;
    while (h.size > 0) {
        Entry cur = heap_pop(&h);
        if (cur.city == destination) { answer = cur.cost; break; }
        if (cur.used > K + 1 || cur.cost > min_cost[cur.city][cur.used]) continue;
        for (int i = 0; i < flights[cur.city].size; i++) {
            Flight f = flights[cur.city].data[i];
            int new_cost = cur.cost + f.cost, next_used = cur.used + 1;
            if (next_used <= K + 1 && new_cost < min_cost[f.to][next_used]) {
                min_cost[f.to][next_used] = new_cost;
                heap_push(&h, (Entry){new_cost, f.to, next_used});
            }
        }
    }
    free(h.data);
    for (int i = 0; i < n; i++) free(min_cost[i]);
    free(min_cost);
    return answer;
}

int main() {
    Flight f0[] = {{1, 2}, {3, 1}}, f1[] = {{4, 4}}, f2[] = {{4, 1}};
    Flight f3[] = {{2, 2}, {4, 5}};
    AdjList flights[] = {{f0, 2}, {f1, 1}, {f2, 1}, {f3, 2}, {NULL, 0}};
    printf("%d\n", cheapest_flights(flights, 5, 0, 4, 2));
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <queue>
#include <climits>

class Solution {
public:
    int cheapestFlights(std::vector<std::vector<std::pair<int, int>>>& flights,
                        int source, int destination, int K) {
        int n = flights.size();
        std::vector<std::vector<int>> minCost(n, std::vector<int>(K + 2, INT_MAX));
        minCost[source][0] = 0;
        std::priority_queue<std::tuple<int, int, int>,
                            std::vector<std::tuple<int, int, int>>,
                            std::greater<>> pq;
        pq.push({0, source, 0});
        while (!pq.empty()) {
            auto [cost, city, used] = pq.top(); pq.pop();
            if (city == destination) return cost;
            if (used > K + 1 || cost > minCost[city][used]) continue;
            for (auto& [nc, w] : flights[city]) {
                int newCost = cost + w, nextUsed = used + 1;
                if (nextUsed <= K + 1 && newCost < minCost[nc][nextUsed]) {
                    minCost[nc][nextUsed] = newCost;
                    pq.push({newCost, nc, nextUsed});
                }
            }
        }
        return -1;
    }
};

int main() {
    std::vector<std::vector<std::pair<int, int>>> flights = {
        {{1, 2}, {3, 1}}, {{4, 4}}, {{4, 1}}, {{2, 2}, {4, 5}}, {}};
    std::cout << Solution().cheapestFlights(flights, 0, 4, 2) << "\n";
}
```

```scala,editable
import scala.collection.mutable

object Main extends App {
  class Solution {
    def cheapestFlights(flights: Array[Array[(Int, Int)]], source: Int, destination: Int, K: Int): Int = {
      val n = flights.length
      val minCost = Array.fill(n, K + 2)(Int.MaxValue)
      minCost(source)(0) = 0
      val pq = mutable.PriorityQueue.empty[(Int, Int, Int)](
        Ordering.by[(Int, Int, Int), Int](_._1).reverse)
      pq.enqueue((0, source, 0))
      while (pq.nonEmpty) {
        val (cost, city, used) = pq.dequeue()
        if (city == destination) return cost
        if (used <= K + 1 && cost <= minCost(city)(used)) {
          for ((nc, w) <- flights(city)) {
            val newCost = cost + w; val nextUsed = used + 1
            if (nextUsed <= K + 1 && newCost < minCost(nc)(nextUsed)) {
              minCost(nc)(nextUsed) = newCost
              pq.enqueue((newCost, nc, nextUsed))
            }
          }
        }
      }
      -1
    }
  }

  val flights = Array(
    Array((1, 2), (3, 1)), Array((4, 4)), Array((4, 1)),
    Array((2, 2), (4, 5)), Array.empty[(Int, Int)])
  println(new Solution().cheapestFlights(flights, 0, 4, 2))
}
```

```javascript,editable
class MinHeap {
    constructor() { this.h = []; }
    push(x) { this.h.push(x); this._up(this.h.length - 1); }
    pop() {
        const top = this.h[0]; const last = this.h.pop();
        if (this.h.length) { this.h[0] = last; this._down(0); }
        return top;
    }
    get size() { return this.h.length; }
    _up(i) { while (i > 0) {
        const p = (i - 1) >> 1;
        if (this.h[p][0] <= this.h[i][0]) break;
        [this.h[p], this.h[i]] = [this.h[i], this.h[p]]; i = p;
    }}
    _down(i) {
        while (true) {
            const l = i*2+1, r = i*2+2; let best = i;
            if (l < this.h.length && this.h[l][0] < this.h[best][0]) best = l;
            if (r < this.h.length && this.h[r][0] < this.h[best][0]) best = r;
            if (best === i) break;
            [this.h[i], this.h[best]] = [this.h[best], this.h[i]]; i = best;
        }
    }
}

class Solution {
    cheapestFlights(flights, source, destination, K) {
        const n = flights.length;
        const minCost = Array.from({length: n}, () => Array(K + 2).fill(Infinity));
        minCost[source][0] = 0;
        const heap = new MinHeap();
        heap.push([0, source, 0]);
        while (heap.size) {
            const [cost, city, used] = heap.pop();
            if (city === destination) return cost;
            if (used > K + 1 || cost > minCost[city][used]) continue;
            for (const [nc, w] of flights[city]) {
                const newCost = cost + w, nextUsed = used + 1;
                if (nextUsed <= K + 1 && newCost < minCost[nc][nextUsed]) {
                    minCost[nc][nextUsed] = newCost;
                    heap.push([newCost, nc, nextUsed]);
                }
            }
        }
        return -1;
    }
}

const flights = [[[1, 2], [3, 1]], [[4, 4]], [[4, 1]], [[2, 2], [4, 5]], []];
console.log(new Solution().cheapestFlights(flights, 0, 4, 2));
```

```typescript,editable
class MinHeap<T extends [number, ...any[]]> {
    private h: T[] = [];
    push(x: T) { this.h.push(x); this._up(this.h.length - 1); }
    pop(): T {
        const top = this.h[0]; const last = this.h.pop()!;
        if (this.h.length) { this.h[0] = last; this._down(0); }
        return top;
    }
    get size() { return this.h.length; }
    private _up(i: number) { while (i > 0) {
        const p = (i - 1) >> 1;
        if (this.h[p][0] <= this.h[i][0]) break;
        [this.h[p], this.h[i]] = [this.h[i], this.h[p]]; i = p;
    }}
    private _down(i: number) {
        while (true) {
            const l = i*2+1, r = i*2+2; let best = i;
            if (l < this.h.length && this.h[l][0] < this.h[best][0]) best = l;
            if (r < this.h.length && this.h[r][0] < this.h[best][0]) best = r;
            if (best === i) break;
            [this.h[i], this.h[best]] = [this.h[best], this.h[i]]; i = best;
        }
    }
}

class Solution {
    cheapestFlights(flights: [number, number][][], source: number, destination: number, K: number): number {
        const n = flights.length;
        const minCost = Array.from({length: n}, () => Array(K + 2).fill(Infinity));
        minCost[source][0] = 0;
        const heap = new MinHeap<[number, number, number]>();
        heap.push([0, source, 0]);
        while (heap.size) {
            const [cost, city, used] = heap.pop();
            if (city === destination) return cost;
            if (used > K + 1 || cost > minCost[city][used]) continue;
            for (const [nc, w] of flights[city]) {
                const newCost = cost + w, nextUsed = used + 1;
                if (nextUsed <= K + 1 && newCost < minCost[nc][nextUsed]) {
                    minCost[nc][nextUsed] = newCost;
                    heap.push([newCost, nc, nextUsed]);
                }
            }
        }
        return -1;
    }
}

const flights: [number, number][][] = [[[1, 2], [3, 1]], [[4, 4]], [[4, 1]], [[2, 2], [4, 5]], []];
console.log(new Solution().cheapestFlights(flights, 0, 4, 2));
```

```go,editable
package main

import (
    "container/heap"
    "fmt"
    "math"
)

type ItemCF struct{ cost, city, used int }
type PQCF []ItemCF

func (p PQCF) Len() int            { return len(p) }
func (p PQCF) Less(i, j int) bool  { return p[i].cost < p[j].cost }
func (p PQCF) Swap(i, j int)       { p[i], p[j] = p[j], p[i] }
func (p *PQCF) Push(x interface{}) { *p = append(*p, x.(ItemCF)) }
func (p *PQCF) Pop() interface{}   { old := *p; n := len(old); x := old[n-1]; *p = old[:n-1]; return x }

func cheapestFlights(flights [][][2]int, source, destination, K int) int {
    n := len(flights)
    minCost := make([][]int, n)
    for i := range minCost {
        minCost[i] = make([]int, K+2)
        for j := range minCost[i] {
            minCost[i][j] = math.MaxInt32
        }
    }
    minCost[source][0] = 0
    pq := &PQCF{{0, source, 0}}
    heap.Init(pq)
    for pq.Len() > 0 {
        cur := heap.Pop(pq).(ItemCF)
        if cur.city == destination { return cur.cost }
        if cur.used > K+1 || cur.cost > minCost[cur.city][cur.used] { continue }
        for _, f := range flights[cur.city] {
            newCost := cur.cost + f[1]
            nextUsed := cur.used + 1
            if nextUsed <= K+1 && newCost < minCost[f[0]][nextUsed] {
                minCost[f[0]][nextUsed] = newCost
                heap.Push(pq, ItemCF{newCost, f[0], nextUsed})
            }
        }
    }
    return -1
}

func main() {
    flights := [][][2]int{{{1, 2}, {3, 1}}, {{4, 4}}, {{4, 1}}, {{2, 2}, {4, 5}}, {}}
    fmt.Println(cheapestFlights(flights, 0, 4, 2))
}
```

```kotlin,editable
import java.util.PriorityQueue

class Solution {
    fun cheapestFlights(flights: List<List<IntArray>>, source: Int, destination: Int, K: Int): Int {
        val n = flights.size
        val minCost = Array(n) { IntArray(K + 2) { Int.MAX_VALUE } }
        minCost[source][0] = 0
        val pq = PriorityQueue<IntArray>(compareBy { it[0] })
        pq.offer(intArrayOf(0, source, 0))
        while (pq.isNotEmpty()) {
            val (cost, city, used) = pq.poll()
            if (city == destination) return cost
            if (used > K + 1 || cost > minCost[city][used]) continue
            for (f in flights[city]) {
                val newCost = cost + f[1]; val nextUsed = used + 1
                if (nextUsed <= K + 1 && newCost < minCost[f[0]][nextUsed]) {
                    minCost[f[0]][nextUsed] = newCost
                    pq.offer(intArrayOf(newCost, f[0], nextUsed))
                }
            }
        }
        return -1
    }
}

fun main() {
    val flights = listOf(
        listOf(intArrayOf(1, 2), intArrayOf(3, 1)),
        listOf(intArrayOf(4, 4)),
        listOf(intArrayOf(4, 1)),
        listOf(intArrayOf(2, 2), intArrayOf(4, 5)),
        listOf())
    println(Solution().cheapestFlights(flights, 0, 4, 2))
}
```

```rust,editable
use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn cheapest_flights(flights: &Vec<Vec<(usize, i32)>>, source: usize, destination: usize, k: usize) -> i32 {
    let n = flights.len();
    let mut min_cost = vec![vec![i32::MAX; k + 2]; n];
    min_cost[source][0] = 0;
    let mut heap: BinaryHeap<Reverse<(i32, usize, usize)>> = BinaryHeap::new();
    heap.push(Reverse((0, source, 0)));
    while let Some(Reverse((cost, city, used))) = heap.pop() {
        if city == destination { return cost; }
        if used > k + 1 || cost > min_cost[city][used] { continue; }
        for &(nc, w) in &flights[city] {
            let new_cost = cost + w; let next_used = used + 1;
            if next_used <= k + 1 && new_cost < min_cost[nc][next_used] {
                min_cost[nc][next_used] = new_cost;
                heap.push(Reverse((new_cost, nc, next_used)));
            }
        }
    }
    -1
}

fn main() {
    let flights: Vec<Vec<(usize, i32)>> = vec![
        vec![(1, 2), (3, 1)], vec![(4, 4)], vec![(4, 1)],
        vec![(2, 2), (4, 5)], vec![]];
    println!("{}", cheapest_flights(&flights, 0, 4, 2));
}
```

</div>

***

# Problem: Minimum Travel Time

## The Problem

A network of routes with travel times. From `source` to `destination`, find the minimum *total time*. Twist:

> If you arrive at a city at an **odd** time, you must wait 1 extra unit before continuing.
> If you arrive at an **even** time, you can continue immediately.

```
Input:  graph = [[[1, 1], [2, 4]], [[2, 2], [3, 2]], [[3, 1]], []]
        source = 0, destination = 3
Output: 4
```

## Pattern Mapping

A standard Dijkstra computes arrival times. The twist: when we relax an edge, we don't just add the edge weight — we also **add 1 if our current arrival time is odd**.

This is **Dijkstra with a wait-time tweak** — the relaxation rule becomes:

```
wait = 1 if cur_time is odd else 0
arrival_time_at_neighbour = cur_time + wait + edge_weight
```

That tiny addition handles the parity rule cleanly within the standard pattern.

## The Solution

<div class="lang-tabs">

```python,editable
from typing import List
import heapq

INF = float('inf')

class Solution:
    def minimum_travel_time(self,
                            routes: List[List[List[int]]],
                            source: int,
                            destination: int) -> int:
        n = len(routes)
        min_arrival = [INF] * n
        min_arrival[source] = 0
        heap = [(0, source)]
        while heap:
            time, city = heapq.heappop(heap)
            if city == destination:
                return time
            if time > min_arrival[city]:
                continue
            # Wait 1 unit if we arrived at an odd time.
            wait = 1 if time % 2 == 1 else 0
            for next_city, travel in routes[city]:
                new_time = time + wait + travel
                if new_time < min_arrival[next_city]:
                    min_arrival[next_city] = new_time
                    heapq.heappush(heap, (new_time, next_city))
        return -1


graph = [[[1, 1], [2, 4]], [[2, 2], [3, 2]], [[3, 1]], []]
print(Solution().minimum_travel_time(graph, 0, 3))  # 4
```

```java,editable
import java.util.*;

public class Main {
    static class Solution {
        public int minimumTravelTime(List<List<int[]>> routes, int source, int destination) {
            int n = routes.size();
            int[] minArrival = new int[n];
            Arrays.fill(minArrival, Integer.MAX_VALUE);
            minArrival[source] = 0;
            PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
            pq.offer(new int[]{0, source});
            while (!pq.isEmpty()) {
                int[] cur = pq.poll();
                int time = cur[0], city = cur[1];
                if (city == destination) return time;
                if (time > minArrival[city]) continue;
                int wait = (time % 2 == 1) ? 1 : 0;
                for (int[] r : routes.get(city)) {
                    int next = r[0], travel = r[1];
                    int newTime = time + wait + travel;
                    if (newTime < minArrival[next]) {
                        minArrival[next] = newTime;
                        pq.offer(new int[]{newTime, next});
                    }
                }
            }
            return -1;
        }
    }

    public static void main(String[] args) {
        var graph = List.of(
            List.of(new int[]{1, 1}, new int[]{2, 4}),
            List.of(new int[]{2, 2}, new int[]{3, 2}),
            List.of(new int[]{3, 1}),
            List.<int[]>of());
        System.out.println(new Solution().minimumTravelTime(graph, 0, 3));
    }
}
```

```c,editable
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

typedef struct { int to, time; } Route;
typedef struct { Route* data; int size; } AdjList;

typedef struct { int time, city; } Entry;
typedef struct { Entry* data; int size, capacity; } Heap;

static void heap_push(Heap* h, Entry e) {
    if (h->size == h->capacity) {
        h->capacity = h->capacity ? h->capacity * 2 : 16;
        h->data = realloc(h->data, h->capacity * sizeof(Entry));
    }
    int i = h->size++;
    h->data[i] = e;
    while (i > 0) {
        int p = (i - 1) / 2;
        if (h->data[p].time <= h->data[i].time) break;
        Entry t = h->data[p]; h->data[p] = h->data[i]; h->data[i] = t;
        i = p;
    }
}
static Entry heap_pop(Heap* h) {
    Entry top = h->data[0];
    h->data[0] = h->data[--h->size];
    int i = 0;
    while (1) {
        int l = i*2+1, r = i*2+2, best = i;
        if (l < h->size && h->data[l].time < h->data[best].time) best = l;
        if (r < h->size && h->data[r].time < h->data[best].time) best = r;
        if (best == i) break;
        Entry t = h->data[i]; h->data[i] = h->data[best]; h->data[best] = t;
        i = best;
    }
    return top;
}

int minimum_travel_time(AdjList* routes, int n, int source, int destination) {
    int* min_arrival = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) min_arrival[i] = INT_MAX;
    min_arrival[source] = 0;
    Heap h = {0};
    heap_push(&h, (Entry){0, source});
    int answer = -1;
    while (h.size > 0) {
        Entry cur = heap_pop(&h);
        if (cur.city == destination) { answer = cur.time; break; }
        if (cur.time > min_arrival[cur.city]) continue;
        int wait = cur.time % 2 == 1 ? 1 : 0;
        for (int i = 0; i < routes[cur.city].size; i++) {
            Route r = routes[cur.city].data[i];
            int new_time = cur.time + wait + r.time;
            if (new_time < min_arrival[r.to]) {
                min_arrival[r.to] = new_time;
                heap_push(&h, (Entry){new_time, r.to});
            }
        }
    }
    free(h.data); free(min_arrival);
    return answer;
}

int main() {
    Route r0[] = {{1, 1}, {2, 4}};
    Route r1[] = {{2, 2}, {3, 2}};
    Route r2[] = {{3, 1}};
    AdjList routes[] = {{r0, 2}, {r1, 2}, {r2, 1}, {NULL, 0}};
    printf("%d\n", minimum_travel_time(routes, 4, 0, 3));
    return 0;
}
```

```cpp,editable
#include <iostream>
#include <vector>
#include <queue>
#include <climits>

class Solution {
public:
    int minimumTravelTime(std::vector<std::vector<std::pair<int, int>>>& routes,
                          int source, int destination) {
        int n = routes.size();
        std::vector<int> minArrival(n, INT_MAX);
        minArrival[source] = 0;
        std::priority_queue<std::pair<int, int>,
                            std::vector<std::pair<int, int>>,
                            std::greater<>> pq;
        pq.push({0, source});
        while (!pq.empty()) {
            auto [time, city] = pq.top(); pq.pop();
            if (city == destination) return time;
            if (time > minArrival[city]) continue;
            int wait = time % 2 == 1 ? 1 : 0;
            for (auto& [next, travel] : routes[city]) {
                int newTime = time + wait + travel;
                if (newTime < minArrival[next]) {
                    minArrival[next] = newTime;
                    pq.push({newTime, next});
                }
            }
        }
        return -1;
    }
};

int main() {
    std::vector<std::vector<std::pair<int, int>>> graph = {
        {{1, 1}, {2, 4}}, {{2, 2}, {3, 2}}, {{3, 1}}, {}};
    std::cout << Solution().minimumTravelTime(graph, 0, 3) << "\n";
}
```

```scala,editable
import scala.collection.mutable

object Main extends App {
  class Solution {
    def minimumTravelTime(routes: Array[Array[(Int, Int)]], source: Int, destination: Int): Int = {
      val n = routes.length
      val minArrival = Array.fill(n)(Int.MaxValue)
      minArrival(source) = 0
      val pq = mutable.PriorityQueue.empty[(Int, Int)](Ordering.by[(Int, Int), Int](_._1).reverse)
      pq.enqueue((0, source))
      while (pq.nonEmpty) {
        val (time, city) = pq.dequeue()
        if (city == destination) return time
        if (time <= minArrival(city)) {
          val wait = if (time % 2 == 1) 1 else 0
          for ((next, travel) <- routes(city)) {
            val newTime = time + wait + travel
            if (newTime < minArrival(next)) {
              minArrival(next) = newTime
              pq.enqueue((newTime, next))
            }
          }
        }
      }
      -1
    }
  }

  val graph = Array(
    Array((1, 1), (2, 4)), Array((2, 2), (3, 2)), Array((3, 1)), Array.empty[(Int, Int)])
  println(new Solution().minimumTravelTime(graph, 0, 3))
}
```

```javascript,editable
class Solution {
    minimumTravelTime(routes, source, destination) {
        const n = routes.length;
        const minArrival = Array(n).fill(Infinity);
        minArrival[source] = 0;
        // Tiny inline min-heap.
        const h = [[0, source]];
        const up = (i) => { while (i > 0) {
            const p = (i - 1) >> 1;
            if (h[p][0] <= h[i][0]) break;
            [h[p], h[i]] = [h[i], h[p]]; i = p;
        }};
        const down = (i) => { while (true) {
            const l = i*2+1, r = i*2+2; let best = i;
            if (l < h.length && h[l][0] < h[best][0]) best = l;
            if (r < h.length && h[r][0] < h[best][0]) best = r;
            if (best === i) break;
            [h[i], h[best]] = [h[best], h[i]]; i = best;
        }};
        const pop = () => {
            const t = h[0]; const last = h.pop();
            if (h.length) { h[0] = last; down(0); }
            return t;
        };
        const push = (x) => { h.push(x); up(h.length - 1); };
        while (h.length) {
            const [time, city] = pop();
            if (city === destination) return time;
            if (time > minArrival[city]) continue;
            const wait = time % 2 === 1 ? 1 : 0;
            for (const [next, travel] of routes[city]) {
                const newTime = time + wait + travel;
                if (newTime < minArrival[next]) {
                    minArrival[next] = newTime;
                    push([newTime, next]);
                }
            }
        }
        return -1;
    }
}

const graph = [[[1, 1], [2, 4]], [[2, 2], [3, 2]], [[3, 1]], []];
console.log(new Solution().minimumTravelTime(graph, 0, 3));
```

```typescript,editable
class Solution {
    minimumTravelTime(routes: [number, number][][], source: number, destination: number): number {
        const n = routes.length;
        const minArrival: number[] = Array(n).fill(Infinity);
        minArrival[source] = 0;
        const h: [number, number][] = [[0, source]];
        const up = (i: number) => { while (i > 0) {
            const p = (i - 1) >> 1;
            if (h[p][0] <= h[i][0]) break;
            [h[p], h[i]] = [h[i], h[p]]; i = p;
        }};
        const down = (i: number) => { while (true) {
            const l = i*2+1, r = i*2+2; let best = i;
            if (l < h.length && h[l][0] < h[best][0]) best = l;
            if (r < h.length && h[r][0] < h[best][0]) best = r;
            if (best === i) break;
            [h[i], h[best]] = [h[best], h[i]]; i = best;
        }};
        const pop = (): [number, number] => {
            const t = h[0]; const last = h.pop()!;
            if (h.length) { h[0] = last; down(0); }
            return t;
        };
        const push = (x: [number, number]) => { h.push(x); up(h.length - 1); };
        while (h.length) {
            const [time, city] = pop();
            if (city === destination) return time;
            if (time > minArrival[city]) continue;
            const wait = time % 2 === 1 ? 1 : 0;
            for (const [next, travel] of routes[city]) {
                const newTime = time + wait + travel;
                if (newTime < minArrival[next]) {
                    minArrival[next] = newTime;
                    push([newTime, next]);
                }
            }
        }
        return -1;
    }
}

const graph: [number, number][][] = [[[1, 1], [2, 4]], [[2, 2], [3, 2]], [[3, 1]], []];
console.log(new Solution().minimumTravelTime(graph, 0, 3));
```

```go,editable
package main

import (
    "container/heap"
    "fmt"
    "math"
)

type ItemMTT struct{ time, city int }
type PQMTT []ItemMTT

func (p PQMTT) Len() int            { return len(p) }
func (p PQMTT) Less(i, j int) bool  { return p[i].time < p[j].time }
func (p PQMTT) Swap(i, j int)       { p[i], p[j] = p[j], p[i] }
func (p *PQMTT) Push(x interface{}) { *p = append(*p, x.(ItemMTT)) }
func (p *PQMTT) Pop() interface{}   { old := *p; n := len(old); x := old[n-1]; *p = old[:n-1]; return x }

func minimumTravelTime(routes [][][2]int, source, destination int) int {
    n := len(routes)
    minArrival := make([]int, n)
    for i := range minArrival { minArrival[i] = math.MaxInt32 }
    minArrival[source] = 0
    pq := &PQMTT{{0, source}}
    heap.Init(pq)
    for pq.Len() > 0 {
        cur := heap.Pop(pq).(ItemMTT)
        if cur.city == destination { return cur.time }
        if cur.time > minArrival[cur.city] { continue }
        wait := 0
        if cur.time % 2 == 1 { wait = 1 }
        for _, r := range routes[cur.city] {
            newTime := cur.time + wait + r[1]
            if newTime < minArrival[r[0]] {
                minArrival[r[0]] = newTime
                heap.Push(pq, ItemMTT{newTime, r[0]})
            }
        }
    }
    return -1
}

func main() {
    graph := [][][2]int{{{1, 1}, {2, 4}}, {{2, 2}, {3, 2}}, {{3, 1}}, {}}
    fmt.Println(minimumTravelTime(graph, 0, 3))
}
```

```kotlin,editable
import java.util.PriorityQueue

class Solution {
    fun minimumTravelTime(routes: List<List<IntArray>>, source: Int, destination: Int): Int {
        val n = routes.size
        val minArrival = IntArray(n) { Int.MAX_VALUE }
        minArrival[source] = 0
        val pq = PriorityQueue<IntArray>(compareBy { it[0] })
        pq.offer(intArrayOf(0, source))
        while (pq.isNotEmpty()) {
            val (time, city) = pq.poll()
            if (city == destination) return time
            if (time > minArrival[city]) continue
            val wait = if (time % 2 == 1) 1 else 0
            for (r in routes[city]) {
                val newTime = time + wait + r[1]
                if (newTime < minArrival[r[0]]) {
                    minArrival[r[0]] = newTime
                    pq.offer(intArrayOf(newTime, r[0]))
                }
            }
        }
        return -1
    }
}

fun main() {
    val graph = listOf(
        listOf(intArrayOf(1, 1), intArrayOf(2, 4)),
        listOf(intArrayOf(2, 2), intArrayOf(3, 2)),
        listOf(intArrayOf(3, 1)),
        listOf())
    println(Solution().minimumTravelTime(graph, 0, 3))
}
```

```rust,editable
use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn minimum_travel_time(routes: &Vec<Vec<(usize, i32)>>, source: usize, destination: usize) -> i32 {
    let n = routes.len();
    let mut min_arrival = vec![i32::MAX; n];
    min_arrival[source] = 0;
    let mut heap: BinaryHeap<Reverse<(i32, usize)>> = BinaryHeap::new();
    heap.push(Reverse((0, source)));
    while let Some(Reverse((time, city))) = heap.pop() {
        if city == destination { return time; }
        if time > min_arrival[city] { continue; }
        let wait = if time % 2 == 1 { 1 } else { 0 };
        for &(next, travel) in &routes[city] {
            let new_time = time + wait + travel;
            if new_time < min_arrival[next] {
                min_arrival[next] = new_time;
                heap.push(Reverse((new_time, next)));
            }
        }
    }
    -1
}

fn main() {
    let graph: Vec<Vec<(usize, i32)>> = vec![
        vec![(1, 1), (2, 4)], vec![(2, 2), (3, 2)], vec![(3, 1)], vec![]];
    println!("{}", minimum_travel_time(&graph, 0, 3));
}
```

</div>

## Complexity Analysis

| Problem | Time | Space |
|---|---|---|
| Minimum cost path | O((R × C) log(R × C)) | O(R × C) |
| Cheapest flights with K stops | O((N × (K+2)) log(N × (K+2))) | O(N × (K+2)) |
| Minimum travel time | O((N + E) log N) | O(N) |

Adding state dimensions multiplies the search space by the size of the state — so the cheapest-flights problem with K stops is K times slower than vanilla Dijkstra. The trade-off is worth it: a stateful Dijkstra handles a much richer family of constraints than the unstateful one.

---

## Final Takeaway

Dijkstra is **the** weighted shortest-path tool, and the *pattern* extends naturally to stateful problems by augmenting nodes with extra dimensions (stops, parity, fuel left, …). The four-step recipe — *priority queue keyed by cost, distance array, lazy stale-skip, weight-aware relaxation* — handles essentially every "minimum cumulative cost" problem you'll meet, with or without state.

The full progression of shortest-path tools you now have:

| Tool | When |
|---|---|
| **BFS** | Unweighted graph; "minimum hops" |
| **Dijkstra** | Non-negative weights; "minimum cost" |
| **Bellman-Ford** | Negative weights allowed; detects negative cycles |
| **Floyd-Warshall** | All-pairs shortest path |

You've now completed the **graph chapter**. Together with the data-structure foundations (arrays, linked lists, hash tables, stacks, queues, trees) and the algorithmic patterns covered here (DFS, components, two-colour, BFS-shortest-path, Dijkstra), you have the toolkit to solve essentially every graph-shaped problem you'll meet — interview, real-world, or research.

> **Transfer challenge.** A real GPS routing system has to consider *real-time traffic* — edge weights change throughout the day. Sketch (don't implement) how you'd extend the Dijkstra pattern to handle "the cost of edge `u → v` depends on the time you arrive at `u`."

<details>
<summary><strong>Sketch</strong></summary>

This is **time-dependent Dijkstra**. Each edge weight is a function `w(u, v, t)` of arrival time `t` at `u`. When relaxing, compute `new_time = t + w(u, v, t)`. Push `(new_time, v)`. The classical Dijkstra invariant still holds *if* the cost function is non-decreasing in time (no time-travel arbitrage) — known as the *FIFO property*. Real GPS systems use this exact pattern with traffic predictions for `w`.

When the FIFO property fails (e.g. carpool lanes become free at certain times), you'd switch to label-correcting algorithms — closer to Bellman-Ford. The pattern stretches; the underlying logic is the same.

</details>
