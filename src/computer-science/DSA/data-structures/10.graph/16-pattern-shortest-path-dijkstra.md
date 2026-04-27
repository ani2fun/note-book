# Pattern: Shortest path (Dijkstra)

## Table of Contents

1. [Identifying Dijkstra's algorithm for shortest path](#identifying-dijkstras-algorithm-for-shortest-path)
2. [Minimum cost path](#minimum-cost-path)
3. [Cheapest flights](#cheapest-flights)
4. [Minimum travel time](#minimum-travel-time)
5. [Teleporter grid](#teleporter-grid)

***

# Identifying Dijkstra's algorithm for shortest path

Dijkstra's algorithm can solve the shortest path problems for weighted graphs with **non-negative** weights. These are generally **medium** or **hard** problems where we need to find the shortest distance between any pair of nodes in a weighted graph. While we may be able to solve the problem using other shortest path algorithms like Bellman-Ford, they are usually less efficient for these specific problems.

If the problem statement or its solution follows the generic template below, it can be solved by applying Dijkstra's algorithm.

**Template:**

Given a weighted graph with non-negative weights, find the shortest path from a source to some or all other nodes.

## Example

Let's consider the following problem as an example to better understand how to identify and solve shortest path problems using breadth-first search.

> **Problem statement:** Given an NxM grid filled with integer costs in each cell, such that stepping on cell incurs the cost stored in it. Find the minimum cost path from the cell (0, 0) to the cell (N-1, M-1) if movement is allowed in the cardinal directions (up, down, left, right).

// Diagram: Find the minimum cost path from (0, 0) to (N-1, M-1).

## The Dijkstra's algorithm solution

The problem description fits the generic template for the shortest path problem using dijkstra's algorithm, which we learned earlier.

**Template:**

Given a weighted graph with non-negative weights (grid), find the shortest path from a source (0, 0) to some (N-1, M-1) or all other nodes.

We can solve this problem by modelling the grid as a weighted graph and finding the shortest distance (cost) from the source node to all other nodes. We can stop the execution when we reach the destination node and return the minimum cost.

We start by creating a two-dimensional `visited` array of the same size as the grid and initialise it with `false`. We also create another two-dimensional array `minCost` to hold the minimum cost to reach every cell from the source node, and initialize it with `infinite` value for all cells.

// Diagram: Create a visited grid and a minCost grid to store the visited cells and the minimum cost path to a cell known so far, respectively.

We then create a minimum priority queue `queue` to store a tuple of values (cost, row index, column index), which keeps the entry with the minimum cost value at the top. We will use this queue to visit nodes using Dijkstra's algorithm.

// Diagram: Create a minimum priority queue to store the (cost, row, col) tuple.

We start by setting the cost value for the source node  `minCost[0][0]` to the value in `grid[0][0]` as and marking the cell visited in the `visited` array. We then create a tuple `(grid[0][0], 0, 0)` and add it the `queue` to begin Dijkstra's algorithm. The reason we start with a `grid[0][0]` and not 0 is because it takes a cost of `grid[0][0]` to enter the start coordinate (0, 0).

// Diagram: Add the tuple ( grid\[0\]\[0\], 0, 0 ) the the queue.

We then iterate until `queue` is empty, and in each iteration, we pop the tuple at the top of the queue and use local variables `cost`, `currRow` and `currCol` to store the cost, row and column value for the current cell. We then iterate to find the coordinates of neighbouring cells in all four directions in `newRow` and `newCol`.

// Diagram: Get the coordinates of the neighbours of the current cell.

For cells that are within the boundary of the grid, we calculate the cost to reach them from the neighbouring cell as `newCost = cost + grid[newRow][newCol]`. We then check if `newCost` is less than `minCost[newRow][newCol]` which is the currently known minimum distance to the neighbouring cell. If it is, we set `minCost[newRow][newCol]` to `newCost`, mark the cell visited and add the tuple for the neighbour `(newCost, newRow, newCol)` to `queue`.

At any time, if the tuple extracted from `queue` is for the destination node (N-1, M-1) we terminate further execution and return `cost` as the minimum cost from the source (0, 0).

Find the minimum cost path from (0, 0) to (2, 2).

The implementation of Dijkstra's algorithm solution to solve the problem is given below.

C++

```cpp
#include <climits>
#include <queue>

// Diagram: using namespace std;

// Structure to represent a Cell in the graph
struct Cell {
    int row;
    int col;
    int cost;
};

// Comparator function for the priority queue to create a min-heap
struct CompareMinHeap {
    bool operator()(const Cell &a, const Cell &b) const {
        return a.cost > b.cost;
    }
};

class Solution {
public:
    bool isValidCell(int row, int col, int rows, int cols) {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    }

    int minimumCostPath(vector<vector<int>> &grid) {
        int rows = grid.size();
        if (rows == 0) {
            return 0;
        }

// Diagram: int cols = grid[0].size();

        // Create a matrix to store the minimum cost to reach each cell
        vector<vector<int>> minCost(rows, vector<int>(cols, INT_MAX));

        // Create a priority queue (min-heap) to store the cells with
        // their costs
        priority_queue<Cell, vector<Cell>, CompareMinHeap> pq;

        // Assign the minimum cost of the starting point
        minCost[0][0] = grid[0][0];

        // Enqueue starting cell and the cost to move on it
        pq.push({0, 0, grid[0][0]});

        // Define the possible movements: up, right, down, left
        vector<pair<int, int>> directions = {
            {-1, 0}, // up
            {0, 1},  // right
            {1, 0},  // down
            {0, -1}  // left
        };

// Diagram: while (!pq.empty()) {

            Cell currCell = pq.top();
            pq.pop();

            int currRow = currCell.row;
            int currCol = currCell.col;
            int cost = currCell.cost;

            // Explore the neighbours
            for (const auto& dir : directions) {
                int newRow = currRow + dir.first;
                int newCol = currCol + dir.second;

                // Check if the new cell is within the grid
                if (isValidCell(newRow, newCol, rows, cols)) {
                    int newCost = cost + grid[newRow][newCol];

                    // If a shorter path is found, update the minimum
                    // cost and add the new cell to the priority queue
                    if (newCost < minCost[newRow][newCol]) {

                        // Update the minimum cost for the new cell
                        minCost[newRow][newCol] = newCost;

                        // Add the new cell to the priority queue
                        pq.push({newRow, newCol, newCost});
                    }

        // Return the minimum cost to reach the bottom right cell
        return minCost[rows - 1][cols - 1];
    }
};
```

Java

```java
import java.util.*;

// Structure to represent a Cell in the graph
class Cell {

    int row;
    int col;
    int cost;

    Cell(int row, int col, int cost) {
        this.row = row;
        this.col = col;
        this.cost = cost;
    }

// Comparator function for the priority queue to create a min-heap
class CompareMinHeap implements Comparator<Cell> {
    public int compare(Cell a, Cell b) {

        // Min-heap based on cost
        return Integer.compare(a.cost, b.cost);
    }

// Diagram: class Solution {

    boolean isValidCell(int row, int col, int rows, int cols) {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    }

    public int minimumCostPath(int[][] grid) {
        int rows = grid.length;
        if (rows == 0) {
            return 0;
        }

// Diagram: int cols = grid[0].length;

        // Create a matrix to store the minimum cost to reach each cell
        int[][] minCost = new int[rows][cols];
        for (int[] row : minCost) {
            java.util.Arrays.fill(row, Integer.MAX_VALUE);
        }

        // Create a priority queue (min-heap) to store the cells with
        // their costs
        PriorityQueue<Cell> pq = new PriorityQueue<>(
            new CompareMinHeap()
        );

        // Assign the minimum cost of the starting point
        minCost[0][0] = grid[0][0];

        // Enqueue starting cell and the cost to move on it
        pq.add(new Cell(0, 0, grid[0][0]));

        // Define the possible movements: up, right, down, left
        int[][] directions = {
            {-1, 0}, // up
            {0, 1},  // right
            {1, 0},  // down
            {0, -1}  // left
        };

        while (!pq.isEmpty()) {
            Cell currCell = pq.poll();
            int currRow = currCell.row;
            int currCol = currCell.col;
            int cost = currCell.cost;

            // Explore the neighbours
            for (int[] dir : directions) {
                int newRow = currRow + dir[0];
                int newCol = currCol + dir[1];

                // Check if the new cell is within the grid
                if (isValidCell(newRow, newCol, rows, cols)) {
                    int newCost = cost + grid[newRow][newCol];

                    // If a shorter path is found, update the minimum
                    // cost and add the new cell to the priority queue
                    if (newCost < minCost[newRow][newCol]) {

                        // Update the minimum cost for the new cell
                        minCost[newRow][newCol] = newCost;

                        // Add the new cell to the priority queue
                        pq.add(new Cell(newRow, newCol, newCost));
                    }

        // Return the minimum cost to reach the bottom right cell
        return minCost[rows - 1][cols - 1];
    }
```

Typescript

```typescript
import { PriorityQueue } from "datastructures-js";

// Structure to represent a Cell in the graph
class Cell {
    row: number;
    col: number;
    cost: number;

    constructor(row: number, col: number, cost: number) {
        this.row = row;
        this.col = col;
        this.cost = cost;
    }

// Diagram: function compareMinHeap(a: Cell, b: Cell): number {

    // Min-heap based on cost
    return a.cost - b.cost;
}

export class Solution {
    isValidCell(
        row: number,
        col: number,
        rows: number,
        cols: number
    ): boolean {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    }

    minimumCostPath(grid: number[][]): number {
        const rows = grid.length;
        if (rows === 0) {
            return 0;
        }

// Diagram: const cols = grid[0].length;

        // Create a matrix to store the minimum cost to reach each cell
        const minCost: number[][] = Array.from({ length: rows }, () =>
            Array(cols).fill(Number.MAX_VALUE)
        );

        // Create a priority queue (min-heap) to store the cells with
        // their costs
        const pq = new PriorityQueue<Cell>(compareMinHeap);

        // Assign the minimum cost of the starting point
        minCost[0][0] = grid[0][0];

        // Enqueue starting cell and the cost to move on it
        pq.enqueue(new Cell(0, 0, grid[0][0]));

        // Define the possible movements: up, right, down, left
        const directions: number[][] = [
            [-1, 0], // up
            [0, 1],  // right
            [1, 0],  // down
            [0, -1]  // left
        ];

        while (!pq.isEmpty()) {
            const currCell = pq.dequeue()!;
            const currRow = currCell.row;
            const currCol = currCell.col;
            const cost = currCell.cost;

            // Explore the neighbours
            for (const [dr, dc] of directions) {
                const newRow = currRow + dr;
                const newCol = currCol + dc;

                // Check if the new cell is within the grid
                if (this.isValidCell(newRow, newCol, rows, cols)) {
                    const newCost = cost + grid[newRow][newCol];

                    // If a shorter path is found, update the minimum
                    // cost and add the new cell to the priority queue
                    if (newCost < minCost[newRow][newCol]) {

                        // Update the minimum cost for the new cell
                        minCost[newRow][newCol] = newCost;

                        // Add the new cell to the priority queue
                        pq.enqueue(new Cell(newRow, newCol, newCost));
                    }

        // Return the minimum cost to reach the bottom right cell
        return minCost[rows - 1][cols - 1];
    }
```

Javascript

```javascript
import { PriorityQueue } from "datastructures-js";

// Structure to represent a Cell in the graph
class Cell {
    constructor(row, col, cost) {
        this.row = row;
        this.col = col;
        this.cost = cost;
    }

// Diagram: function compareMinHeap(a, b) {

    // Min-heap based on cost
    return a.cost - b.cost;
}

export class Solution {
    isValidCell(row, col, rows, cols) {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    }

    minimumCostPath(grid) {
        const rows = grid.length;
        if (rows === 0) {
            return 0;
        }

// Diagram: const cols = grid[0].length;

        // Create a matrix to store the minimum cost to reach each cell
        const minCost = Array.from({ length: rows }, () =>
            Array(cols).fill(Number.MAX_VALUE)
        );

        // Create a priority queue (min-heap) to store the cells with
        // their costs
        const pq = new PriorityQueue(compareMinHeap);

        // Assign the minimum cost of the starting point
        minCost[0][0] = grid[0][0];

        // Enqueue starting cell and the cost to move on it
        pq.enqueue(new Cell(0, 0, grid[0][0]));

        // Define the possible movements: up, right, down, left
        const directions = [
            [-1, 0], // up
            [0, 1],  // right
            [1, 0],  // down
            [0, -1]  // left
        ];

        while (!pq.isEmpty()) {
            const currCell = pq.dequeue();
            const currRow = currCell.row;
            const currCol = currCell.col;
            const cost = currCell.cost;

            // Explore the neighbours
            for (const [dr, dc] of directions) {
                const newRow = currRow + dr;
                const newCol = currCol + dc;

                // Check if the new cell is within the grid
                if (this.isValidCell(newRow, newCol, rows, cols)) {
                    const newCost = cost + grid[newRow][newCol];

                    // If a shorter path is found, update the minimum
                    // cost and add the new cell to the priority queue
                    if (newCost < minCost[newRow][newCol]) {

                        // Update the minimum cost for the new cell
                        minCost[newRow][newCol] = newCost;

                        // Add the new cell to the priority queue
                        pq.enqueue(new Cell(newRow, newCol, newCost));
                    }

        // Return the minimum cost to reach the bottom right cell
        return minCost[rows - 1][cols - 1];
    }
```

Python

```python
import heapq
from typing import List, Tuple

# Structure to represent a Cell in the graph
class Cell:
    def __init__(self, row: int, col: int, cost: int):
        self.row = row
        self.col = col
        self.cost = cost

    # Comparator function for the priority queue to create a min-heap
    def __lt__(self, other):
        return self.cost < other.cost

class Solution:
    def is_valid_cell(
        self, row: int, col: int, rows: int, cols: int
    ) -> bool:
        return row >= 0 and row < rows and col >= 0 and col < cols

    def minimum_cost_path(self, grid: List[List[int]]) -> int:
        rows = len(grid)
        if rows == 0:
```

Modelling the grid as a weighted graph and using Dijkstra's algorithm search can solve this problem in **O(NxMxlog(NxM))** time with a simple iterative implementation.

## Example problems

Most problems that fall under this category are**medium** or **hard**problems; a list of a few is given below.

> -   **[Minimum cost path](https://www.codeintuition.io/courses/graph/WyqQO1jwL-ozX3UoJOBWU)**
> -   **[Cheapest flights](https://www.codeintuition.io/courses/graph/XcZT_wTDfjjgWn9xTMFuk)**
> -   **[Minimum travel time](https://www.codeintuition.io/courses/graph/Zih4sFy1Ij7mwEsvVgCTe)**
> -   **[Teleporter grid](https://www.codeintuition.io/courses/graph/YjnlHZqjO-GMPrhCMgT8l)**

We will now solve these problems to understand the application of Dijkstra's algorithm for finding the shortest path.

***

# Minimum cost path

## Problem Statement

Given an **NxM** **grid** filled with each cell containing an integer cost to pass through, write a function to find and return the minimum cost to reach the cell `(N-1, M-1)` from the cell `(0, 0)`. 

> You must abide by the following constraint:
>
> -   You can only move in the four cardinal directions, i.e., `up`, `right`, `down`, and `left`.

### Example 1

> -   **Input:** grid = \[\[9, 4, 9, 9\], \[6, 7, 6, 4\], \[8, 3, 3, 7\], \[7, 4, 9, 10\]\]
> -   **Output:** 43
> -   **Explanation:** The minimum cost path is shown in the above diagram.

### Example 2

> -   **Input:** grid = \[\[9, 4, 9, 9\], \[1, 7, 6, 4\], \[1, 3, 3, 7\], \[1, 2, 2, 10\]\]
> -   **Output:** 26
> -   **Explanation:** The minimum cost path is shown in the above diagram.

## Solution

```cpp
#include <climits>
#include <queue>

using namespace std;

// Structure to represent a Cell in the graph
struct Cell {
    int row;
    int col;
    int cost;
};

// Comparator function for the priority queue to create a min-heap
struct CompareMinHeap {
    bool operator()(const Cell &a, const Cell &b) const {
        return a.cost > b.cost;
    }
};

class Solution {
public:
    bool isValidCell(int row, int col, int rows, int cols) {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    }

    int minimumCostPath(vector<vector<int>> &grid) {
        int rows = grid.size();
        if (rows == 0) {
            return 0;
        }

        int cols = grid[0].size();

        // Create a matrix to store the minimum cost to reach each cell
        vector<vector<int>> minCost(rows, vector<int>(cols, INT_MAX));

        // Create a priority queue (min-heap) to store the cells with
        // their costs
        priority_queue<Cell, vector<Cell>, CompareMinHeap> pq;

        // Assign the minimum cost of the starting point
        minCost[0][0] = grid[0][0];

        // Enqueue starting cell and the cost to move on it
        pq.push({0, 0, grid[0][0]});

        // Define the possible movements: up, right, down, left
        vector<pair<int, int>> directions = {
            {-1, 0}, // up
            {0, 1},  // right
            {1, 0},  // down
            {0, -1}  // left
        };

        while (!pq.empty()) {

            Cell currCell = pq.top();
            pq.pop();

            int currRow = currCell.row;
            int currCol = currCell.col;
            int cost = currCell.cost;

            // Explore the neighbours
            for (const auto& dir : directions) {
                int newRow = currRow + dir.first;
                int newCol = currCol + dir.second;

                // Check if the new cell is within the grid
                if (isValidCell(newRow, newCol, rows, cols)) {
                    int newCost = cost + grid[newRow][newCol];

                    // If a shorter path is found, update the minimum
                    // cost and add the new cell to the priority queue
                    if (newCost < minCost[newRow][newCol]) {

                        // Update the minimum cost for the new cell
                        minCost[newRow][newCol] = newCost;

                        // Add the new cell to the priority queue
                        pq.push({newRow, newCol, newCost});
                    }
                }
            }
        }

        // Return the minimum cost to reach the bottom right cell
        return minCost[rows - 1][cols - 1];
    }
};
```

***

# Cheapest flights

## Problem Statement

Given a list of **flights** represented as an adjacency list, a **source** city, a **destination** city, and a positive integer `**K**` denoting the maximum number of stops allowed, write a function to find and return the minimum cost to travel from the source to the destination using at most `K` stops. If no such path exists, return `-1`.

The flights are given as follows: `flights[i]` is a list of pairs `[city, cost]`, where each pair represents a flight from city `i` to the other city with the specified cost.

### Example 1

> -   **Input:** graph = \[\[\[1, 2\], \[3, 1\]\], \[\[4, 4\]\], \[\[4, 1\]\], \[\[2, 2\], \[4, 5\]\], \[\]\], source = 0, destination = 4, K = 2
> -   **Output:** 4
> -   **Explanation:** Although there are other paths with one stop, the minimum-cost path uses two stops: \[0, 3, 2, 4\], with a total cost of 4.

### Example 2

> -   **Input:** graph = \[\[\[4, 2\]\], \[\[3, 3\], \[0, 4\]\], \[\[4, 3\], \[0, 1\]\], \[\[2, 1\], \[4, 4\]\], \[\[1, 5\]\]\], source = 3, destination = 0, K = 2
> -   **Output:** 2
> -   **Explanation:** Although there are other paths with two stops, the minimum-cost path uses one stop: \[3, 2, 0\], with a total cost of 2.

## Solution

```cpp
#include <climits>
#include <queue>

using namespace std;

// Structure to represent the state of a stop
struct Stop {
    int city;
    int cost;
    int flights;
};

// Comparator function for the priority queue to create a min-heap
struct CompareMinHeap {
    bool operator()(const Stop &a, const Stop &b) const {
        return a.cost > b.cost;
    }
};

class Solution {
public:
    int cheapestFlights(
        vector<vector<pair<int, int>>> &flights,
        int source,
        int destination,
        int K
    ) {
        int nodes = flights.size();
        if (nodes == 0) {
            return -1;
        }

        // 2D minCost: nodes x (K + 2) (flights from 0 to K + 1).
        // To store the minimum cost to reach each node by taking the
        // given number of flights
        vector<vector<int>> minCost(nodes, vector<int>(K + 2, INT_MAX));

        // Create a priority queue (min-heap) to store the stops with
        // their costs
        priority_queue<Stop, vector<Stop>, CompareMinHeap> pq;

        // Assign the minimum cost of the starting point, need 0 flights
        // to reach source
        minCost[source][0] = 0;

        // Enqueue starting stop and the cost to move on it
        pq.push({source, 0, 0});

        while (!pq.empty()) {

            Stop currStop = pq.top();
            pq.pop();

            int currCity = currStop.city;
            int currCost = currStop.cost;
            int currFlights = currStop.flights;

            // If we reached the destination, return the cost. We check
            // for K + 1 as we can have as for K stops between source and
            // destination we need K + 1 flights. For example if K = 1,
            // we can have a path like 0 -> 1 -> 2 which has 1 stop but 2
            // flights.
            if (currCity == destination && currFlights <= K + 1) {
                return currCost;
            }

            // If the cost is greater than the recorded minimum cost,
            // skip processing
            if (currCost > minCost[currCity][currFlights]) {
                continue;
            }

            // Can only take up to K + 1 flights
            if (currFlights < K + 1) {
                for (auto &flight : flights[currCity]) {
                    int newCity = flight.first;
                    int newCost = currCost + flight.second;
                    if (newCost < minCost[newCity][currFlights + 1]) {
                        minCost[newCity][currFlights + 1] = newCost;
                        pq.push({newCity, newCost, currFlights + 1});
                    }
                }
            }
        }

        // If the destination is unreachable, return -1
        return -1;
    }
};
```

***

# Minimum travel time

## Problem Statement

Given a list of **routes** represented as an adjacency list, a **source** city and a **destination** city, write a function to find the minimum time to travel from the start to the destination city.

The routes are given as follows: `routes[i]` is a list of pairs `[city, time]`, where each pair represents the travel from city `i` to the other city, taking the specified amount of time.

> You must abide by the following constraint:
>
> -   If you arrive at a city at an odd time, you must wait `1` extra unit of time before you can continue travelling.
> -   If you arrive at an even time, you can continue immediately.

### Example 1

> -   **Input:** graph = \[\[\[1, 1\], \[2, 4\]\], \[\[2, 2\], \[3, 2\]\], \[\[3, 1\]\], \[\]\], source = 0, destination = 3
> -   **Output:** 4
> -   **Explanation:** The shortest path is \[0, 1, 3\]. Travel 0→1 takes 1 unit, arrive at odd time 1, wait 1 unit, then 1→3 takes 2 units, giving a total time of 4.

### Example 2

> -   **Input:** graph = \[\[\[1, 1\], \[2, 2\]\], \[\[3, 2\]\], \[\[3, 1\]\], \[\]\], source = 0, destination = 3
> -   **Output:** 3
> -   **Explanation:** The shortest path is \[0, 2, 3\]. Travel 0→2 takes 2 unit, arrive at even time 2 so no waiting, then 2→3 takes 1 units, giving a total time of 3.

## Solution

```cpp
#include <climits>
#include <queue>

using namespace std;

// Structure to represent the state of a travel
struct TravelState {
    int city;
    int time;
};

// Comparator function for the priority queue to create a min-heap
struct CompareMinHeap {
    bool operator()(const TravelState &a, const TravelState &b) const {
        return a.time > b.time;
    }
};

class Solution {
public:
    int minimumTravelTime(
        vector<vector<pair<int, int>>> &routes,
        int source,
        int destination
    ) {
        int cities = routes.size();
        if (cities == 0) {
            return -1;
        }

        // Create a list to store the minimum arrival time at each city
        vector<int> minArrivalTime(cities, INT_MAX);

        // Create a priority queue (min-heap) to store the stops with
        // their costs
        priority_queue<TravelState, vector<TravelState>, CompareMinHeap>
            pq;

        // Assign the minimum arrival time of the starting point with 0
        minArrivalTime[source] = 0;

        // Enqueue starting city and the time to reach it
        pq.push({source, 0});

        while (!pq.empty()) {

            TravelState currTravelState = pq.top();
            pq.pop();

            int currCity = currTravelState.city;
            int currTime = currTravelState.time;

            // If we reached the destination, return the time
            if (currCity == destination) {
                return currTime;
            }

            // If the time is greater than the recorded minimum time,
            // skip processing
            if (currTime > minArrivalTime[currCity]) {
                continue;
            }

            for (auto &[nextCity, roadTime] : routes[currCity]) {

                // If you arrive at an odd time, wait 1 unit for a red
                // light.
                int waitingTime = 0;
                if (currTime % 2 == 1) {
                    waitingTime = 1;
                }

                int arrivalTime = currTime + waitingTime + roadTime;
                if (arrivalTime < minArrivalTime[nextCity]) {
                    minArrivalTime[nextCity] = arrivalTime;
                    pq.push({nextCity, arrivalTime});
                }
            }
        }

        // If the destination is unreachable, return -1
        return -1;
    }
};
```

***

# Teleporter grid

## Problem Statement

Given an **NxM** **grid**, a **source** cell `(r1, c1)`, and a **destination** cell `(r2, c2)`, write a function to find and return the minimum cost to reach from the source to the destination. 

> -   The cost to move from a cell to its adjacent cell is `1`.
> -   A value of `0` in a cell means the call cannot be visited.
> -   A value of `1` in a cell means the cell can be visited.
> -   A value greater than `1` in a cell is a teleporter cell. All cells with the same number represent linked teleporters. Moving into a teleporter costs `1`, and you may instantly teleport to any other teleporter with the same ID at a cost of `1`.
> -   Each teleporter may be used at most once during the path.

> You must abide by the following constraint:
>
> -   You can only move in the four cardinal directions, i.e., `up`, `right`, `down`, and `left`.

### Example 1

> -   **Input:** grid = \[\[1, 5, 0, 2\], \[0, 1, 1, 0\], \[2, 0, 1, 1\], \[1, 5, 5, 1\]\], source = \[0, 0\], destination = \[3, 3\]
> -   **Output:** 3
> -   **Explanation:** In the diagram, the minimum-cost path uses teleporter 5: starting at (0,0), moving to (0,1), teleporting to (3,2), and then moving to the destination (3,3), for a total cost of 3.

### Example 2

> -   **Input:** grid = \[\[1, 5, 0, 5\], \[0, 1, 1, 2\], \[2, 0, 1, 0\], \[1, 3, 3, 2\]\], source = \[0, 0\], destination = \[3, 3\]
> -   **Output:** 5
> -   **Explanation:** In the diagram, the minimum-cost path uses teleporters 5 and 2: starting at (0,0), moving to (0,1), teleporting to (3,0), then moving to (1,3) and teleporting to the destination (3,3), for a total cost of 5.

## Solution

```cpp
#include <climits>
#include <queue>
#include <unordered_map>

using namespace std;

// Structure to represent a Cell in the graph
struct Cell {
    int row;
    int col;
    int cost;
    int teleporterUsed;
};

// Comparator function for the priority queue to create a min-heap
struct CompareMinHeap {
    bool operator()(const Cell &a, const Cell &b) const {
        return a.cost > b.cost;
    }
};

class Solution {
public:
    bool isValidCell(vector<vector<int>> &grid, int row, int col) {
        return row >= 0 && row < grid.size() && col >= 0 &&
               col < grid[0].size() && grid[row][col] != 0;
    }

    unordered_map<int, vector<pair<int, int>>> buildTeleporterMap(
        vector<vector<int>> &grid
    ) {
        unordered_map<int, vector<pair<int, int>>> teleporters;
        for (int row = 0; row < grid.size(); row++) {
            for (int col = 0; col < grid[row].size(); col++) {
                if (grid[row][col] > 1) {
                    teleporters[grid[row][col]].push_back({row, col});
                }
            }
        }

        return teleporters;
    }

    int teleporterGrid(
        vector<vector<int>> &grid,
        pair<int, int> source,
        pair<int, int> destination
    ) {
        int rows = grid.size();
        if (rows == 0) {
            return -1;
        }

        int cols = grid[0].size();

        // 3D minCost: rows x cols x 2 (teleporter usage state)
        vector<vector<vector<int>>> minCost(
            rows, vector<vector<int>>(cols, vector<int>(2, INT_MAX))
        );

        // Build teleporter map for quick access to teleporter pairs
        unordered_map<int, vector<pair<int, int>>> teleporters =
            buildTeleporterMap(grid);

        // Create a priority queue (min-heap) to store the cells with
        // their costs
        priority_queue<Cell, vector<Cell>, CompareMinHeap> pq;

        // Assign the minimum cost of the starting point with teleporter
        // unused
        minCost[source.first][source.second][0] = 0;

        // Enqueue starting cell and the cost to move on it
        pq.push({source.first, source.second, 0, 0});

        // Define the possible movements: up, right, down, left
        vector<pair<int, int>> directions = {
            {-1, 0}, // up
            {0, 1},  // right
            {1, 0},  // down
            {0, -1}  // left
        };

        while (!pq.empty()) {

            Cell currCell = pq.top();
            pq.pop();

            int currRow = currCell.row;
            int currCol = currCell.col;
            int cost = currCell.cost;
            int teleporterUsed = currCell.teleporterUsed;

            // If we reached the destination, return the cost
            if (currRow == destination.first &&
                currCol == destination.second) {
                return cost;
            }

            // If the cost is greater than the recorded minimum cost,
            // skip processing
            if (cost > minCost[currRow][currCol][teleporterUsed]) {
                continue;
            }

            // Explore the neighbours
            for (const auto &dir : directions) {
                int newRow = currRow + dir.first;
                int newCol = currCol + dir.second;

                // Check if the new cell is within the grid
                if (isValidCell(grid, newRow, newCol)) {

                    // Cost to move to an adjacent cell is always 1
                    int newCost = cost + 1;

                    // If a shorter path is found, update the minimum
                    // cost and add the new cell to the priority queue
                    if (newCost <
                        minCost[newRow][newCol][teleporterUsed]) {

                        // Update the minimum cost for the new cell
                        minCost[newRow][newCol][teleporterUsed] =
                            newCost;

                        // Add the new cell to the priority queue
                        pq.push(
                            {newRow, newCol, newCost, teleporterUsed}
                        );
                    }
                }
            }

            // Add teleporter usage if on a teleporter cell and
            // teleporter not used yet
            if (grid[currRow][currCol] > 1 && teleporterUsed == 0) {
                int teleporterID = grid[currRow][currCol];
                for (auto &[newRow, newCol] :
                     teleporters[teleporterID]) {

                    // Skip the current cell
                    if (newRow == currRow && newCol == currCol) {
                        continue;
                    }

                    // Teleportation cost is 1 (same as moving to
                    // adjacent cell)
                    int newCost = cost + 1;

                    // If a shorter path is found using the teleporter,
                    // update the minimum cost and add the new cell to
                    // the priority queue
                    if (newCost < minCost[newRow][newCol][1]) {
                        minCost[newRow][newCol][1] = newCost;
                        pq.push({newRow, newCol, newCost, 1});
                    }
                }
            }
        }

        // If the destination is unreachable, return -1
        return -1;
    }
};
```
