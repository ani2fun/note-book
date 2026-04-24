# Traversing a grid

## Table of Contents

1. [Understanding traversal on grid](#understanding-traversal-on-a-grid)
2. [Understanding depth first traversal on a grid](#understanding-depth-first-traversal-on-a-grid)
3. [Implement depth first traversal on a grid](#understanding-depth-first-traversal-on-a-grid)
4. [Understanding breadth first traversal on a grid](#understanding-breadth-first-traversal-on-a-grid)
5. [Implement breadth first traversal on a grid](#understanding-breadth-first-traversal-on-a-grid)

***

# Understanding traversal on a grid

A graph is a set of nodes connected by edges, while a grid is a two-dimensional matrix of values that is often encountered in many software development and mathematical problems. Many grid-based problems can be solved effectively by modelling the grid as a graph.

// Diagram: A graph and a grid.

Consider we have a two-dimensional matrix (grid) where every cell has some value and one can move from any cell to all its adjacent cells (typically in the four cardinal directions: up, down, left, and right).

We only consider four directions in this case, but there could also be cases which include diagonals, making a total of 8 directions.

// Diagram: A grid where movement is allowed in four cardinal directions.

This grid can be modelled as a graph where every cell represents a node that is connected to all other nodes in all the allowed directions. The value in the cell may represent the data associated with the node or some **sentinel** value that carries some special meaning (e.g., indicating obstacles, boundaries, etc). The unique identifier in the resulting graph is the coordinate (row, col) pair for the corresponding cell in the grid.

// Diagram: A grid modelled as a graph with sentinel values in cells.

## Traversal in a grid

A grid modelled as a graph can be used as a graph without creating any adjacency list or matrix. This is because every node in the modelled graph is identified using its coordinate in the grid. Since every node is connected to adjacent nodes in all cardinal directions, we can easily calculate the coordinates of all the neighbours for any node.

// Diagram: We can calculate the coordinates of all neighbouring nodes in a grid for traversal.

Once a grid is modelled as a graph, all graph algorithms, including the depth-first and breadth-first traversal, can be applied to it. In the lesson, we will learn more about how to implement depth-first and breadth-first traversal on a grid. However, all graph algorithms that we learn later in the course can also be applied to it in the same way.

***

# Understanding depth first traversal on a grid

The depth-first algorithm on a grid is the same as for any other graph. We start from a node and recursively traverse all the unvisited neighbour nodes until no unvisited node remains in any paths originating at the start node. To fully traverse disconnected graphs, however, we need to iterate over all the nodes and run depth-first search from any unvisited node.

Depth-first search on a grid uses coordinates (row, col) to uniquely identify a node and **compute** the identifiers (coordinates) of adjacent nodes, instead of reading them from an adjacency list. In this explanation, we will use the term **cell** and **node** interchangeably, as every node is uniquely identified by the coordinates (row, col) of its cell in the grid.

// Diagram: Computing the coordinates of neighbouring cells in all four directions.

## Algorithm

To understand depth-first search on a grid, let's consider a grid where a value of 1 indicates that the cell should be explored, while a value of 0 indicates it should not be explored. We can model this grid as a graph that has a mix of nodes, where some can be visited while others cannot. Since some cells also have 0 values, the resulting graph can potentially be disconnected, meaning there may not be a path between every pair of nodes. Therefore, we may need to run a depth-first search multiple times from different nodes.

// Diagram: A grid that has 0s and 1s where 1 means a cell can be visited while 0 means it cannot be visited.

We start by creating a two-dimensional `visited` array of the same size as the grid and initialise it with false.

// Diagram: We create a visited array of the same size as the grid and initialize it with false.

We then iterate in the `visited` array and in each iteration, check if the current cell (node) is marked `false` and the grid has value 1 at that coordinate. If the condition holds `true`, we start depth-first search from that cell by passing its coordinate (row, col) and references to the `grid` and `visited` array to the recursive depth-first search function. If not, it means the node is either already visited or cannot be visited.

// Diagram: Visit the cells that are unvisited and have a value 1 in grid.

We pass `grid` and `visited` array as references to ensure that every recursive stack frame shares the same copy of this data. For languages that do not support passing data by reference, we can create them in the enclosing scope to make them global for recursive function calls.

As we enter a node, we mark it visited in the `visited` array using its coordinates (row, col). We then compute the coordinates of all its neighbouring nodes, iterate over those coordinates and in each iteration, check if the coordinate is within the bounds of the grid, not marked visited in the `visited` array, and has a value of 1. If the condition holds true, we visit it by recursively calling depth-first search and passing the computed coordinates(row, col) this time.

// Diagram: Only the neighbours that are within the bounds of the grid and have a value of 1 can be visited.

The recursive call will stop and backtrack when all reachable neighbours of a node are marked visited. This way, at the end of the top-level call to the depth-first search function, all nodes that can be reached from the first node will be marked visited. We then continue iteration in the `visited` array and repeat the process for all the nodes that have a value of 1 and have not yet been marked as visited. This way, at the end of all iterations, all nodes that can be visited will be visited.

The algorithm below summarises the depth-first search on such a grid.

> **Algorithm**
>
> **dfs(row, col, \[ref\] grid, \[ref\] visited)**
>
> -   **Step 1:** Set \`visited\[row\]\[col\]\` to \`true\`
> -   **Step 2:** Compute coordinates in all four (up, right, bottom, top) in \`(newRow, newCol)\` and for each, do the following:
>     -   **Step 2.1:** If \`(newRow, newCol)\` is within the bounds of \`grid\` and \`grid\[newRow\]\[newCol\]\` is \`1\` and \`visited\[newRow\]\[newCol\]\` is \`false\`, do the following
>         -   **Step 2.1.1:** Call \`dfs(newRow, newCol, grid, visited)\`
>
> **callingFunction(\[ref\] grid)**
>
> -   **Step 1:** Create a \`visited\` array of the same size as \`grid\` and initialize it to \`false\`
> -   **Step 2:** Iterate in \`grid\` using \`row\` and \`col\` and do the following for each cell:
>     -   **Step 2.1:** If \`grid\[row\]\[col\]\` is \`1\` and \`visited\[row\]\[col\]\` is \`false\`, call \`dfs(row, col, grid, visited)\`

Depth first search on a grid.

## Implementation

To implement depth-first search on a grid, we create a recursive function `dfs`, that takes as arguments: the reference to the `visited` array and the coordinates (row, col) of a cell to identify a node uniquely. We create the `visited` array in the calling function to pass it by reference to `dfs`. For languages that don't support passing data by reference, we create it in the enclosing scope.

We create and use a temporary array `dir` to easily compute the coordinates of all potential neighbours.

C++

```cpp
using namespace std;

class Solution {
public:
    bool isValidCell(vector<vector<int>> &grid, int row, int col) {

        // Check if a cell is valid and belongs to a region of 1's, also
        // check that the cell is not water
        return row >= 0 && row < grid.size() && col >= 0 &&
               col < grid[0].size() && grid[row][col] == 1;
    }

    void dfs(
        vector<vector<int>> &grid,
        int row,
        int col,
        vector<vector<bool>> &visited,
        vector<pair<int, int>> &result
    ) {

        // Mark the current cell as visited
        visited[row][col] = true;

        // Add the current cell to the result
        result.push_back({row, col});

        // Define the possible movements: up, right, down, left
        vector<pair<int, int>> directions = {
            {-1, 0}, // up
            {0, 1},  // right
            {1, 0},  // down
            {0, -1}  // left
        };

        for (const auto &dir : directions) {
            int newRow = row + dir.first;
            int newCol = col + dir.second;

            // If the neighbour is not visited, recursively call the DFS
            // function on the neighbour
            if (isValidCell(grid, newRow, newCol) &&
                !visited[newRow][newCol]) {
                dfs(grid, newRow, newCol, visited, result);
            }

    vector<pair<int, int>> depthFirstTraversalOnAGrid(
        vector<vector<int>> &grid
    ) {
        int rows = grid.size();

        // If the grid is empty, return an empty result
        if (rows == 0) {
            return {};
        }

// Diagram: int cols = grid[0].size();

        // Initialize a vector to store the result of the DFS
        // which will contain the coordinates of the cells visited
        // during the DFS traversal
        vector<pair<int, int>> result;

        // Initialize visited array
        vector<vector<bool>> visited(rows, vector<bool>(cols, false));

        // Traverse each cell of the grid
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {

                // If the cells is not visitable or is already visited,
                // continue to the next cell
                if (grid[row][col] == 0 || visited[row][col]) {
                    continue;
                }

                // Perform DFS on this new cell to visit all the cells
                // connected to it.
                dfs(grid, row, col, visited, result);
            }

        return result;
    }
};
```

Java

```java
import java.util.*;

class Solution {
    public boolean isValidCell(int[][] grid, int row, int col) {

        // Check if a cell is valid and belongs to a region of 1's, also
        // check that the cell is not water
        return (
            row >= 0 &&
            row < grid.length &&
            col >= 0 &&
            col < grid[0].length &&
            grid[row][col] == 1
        );
    }

    public void dfs(
        int[][] grid,
        int row,
        int col,
        boolean[][] visited,
        List<List<Integer>> result
    ) {

        // Mark the current cell as visited
        visited[row][col] = true;

        // Add the current cell to the result
        result.add(List.of(row, col));

        // Define the possible movements: up, right, down, left
        int[][] directions = {
            {-1, 0}, // up
            {0, 1},  // right
            {1, 0},  // down
            {0, -1}  // left
        };

        for (int[] dir : directions) {
            int newRow = row + dir[0];
            int newCol = col + dir[1];

            // If the neighbour is not visited, recursively call the DFS
            // function on the neighbour
            if (
                isValidCell(grid, newRow, newCol) &&
                !visited[newRow][newCol]
            ) {
                dfs(grid, newRow, newCol, visited, result);
            }

    public List<List<Integer>> depthFirstTraversalOnAGrid(int[][] grid) {
        int rows = grid.length;

        // If the grid is empty, return an empty result
        if (rows == 0) {
            return new ArrayList<>();
        }

// Diagram: int cols = grid[0].length;

        // Initialize a list to store the result of the DFS
        // which will contain the coordinates of the cells visited
        // during the DFS traversal
        List<List<Integer>> result = new ArrayList<>();

        // Initialize visited array
        boolean[][] visited = new boolean[rows][cols];

        // Traverse each cell of the grid
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {

                // If the cells is not visitable or is already visited,
                // continue to the next cell
                if (grid[row][col] == 0 || visited[row][col]) {
                    continue;
                }

                // Perform DFS on this new cell to visit all the cells
                // connected to it.
                dfs(grid, row, col, visited, result);
            }

        return result;
    }
```

Typescript

```typescript
using namespace std;
```

Javascript

```javascript
export class Solution {
    isValidCell(grid, row, col) {

        // Check if a cell is valid and belongs to a region of 1's, also
        // check that the cell is not water
        return (
            row >= 0 &&
            row < grid.length &&
            col >= 0 &&
            col < grid[0].length &&
            grid[row][col] === 1
        );
    }

// Diagram: dfs(grid, row, col, visited, result) {

        // Mark the current cell as visited
        visited[row][col] = true;

        // Add the current cell to the result
        result.push([row, col]);

        // Define the possible movements: all 8 directions (up, right,
        // down, left, and diagonals)
        const directions = [
            [-1, 0], // up
            [0, 1],  // right
            [1, 0],  // down
            [0, -1]  // left
        ];

        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;

            // If the neighbour is not visited, recursively call the DFS
            // function on the neighbour
            if (
                this.isValidCell(grid, newRow, newCol) &&
                !visited[newRow][newCol]
            ) {
                this.dfs(grid, newRow, newCol, visited, result);
            }

    depthFirstTraversalOnAGrid(grid) {
        const rows = grid.length;

        // If the grid is empty, return an empty result
        if (rows === 0) {
            return [];
        }

// Diagram: const cols = grid[0].length;

        // Initialize a list to store the result of the DFS
        // which will contain the coordinates of the cells visited
        // during the DFS traversal
        const result = [];

        // Initialize visited array
        const visited = Array.from({ length: rows }, () =>
            Array(cols).fill(false)
        );

        // Traverse each cell of the grid
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {

                // If the cells is not visitable or is already visited,
                // continue to the next cell
                if (grid[row][col] === 0 || visited[row][col]) {
                    continue;
                }

                // Perform DFS on this new cell to visit all the cells
                // connected to it.
                this.dfs(grid, row, col, visited, result);
            }

        return result;
    }
```

Python

```python
from typing import List, Tuple

class Solution:
    def is_valid_cell(
        self, grid: List[List[int]], row: int, col: int
    ) -> bool:

        # Check if a cell is valid and belongs to a region of 1's, also
        # check that the cell is not water
        return (
            row >= 0
            and row < len(grid)
            and col >= 0
            and col < len(grid[0])
            and grid[row][col] == 1
        )

    def dfs(
        self,
        grid: List[List[int]],
        row: int,
        col: int,
        visited: List[List[bool]],
        result: List[Tuple[int, int]],
    ) -> None:

        # Mark the current cell as visited
        visited[row][col] = True

        # Add the current cell to the result
        result.append((row, col))

        # Define the possible movements: all 8 directions (up, right,
        # down, left, and diagonals)
        directions: List[Tuple[int, int]] = [
            (-1, 0),  # up
            (0, 1),   # right
            (1, 0),   # down
            (0, -1)   # left
        ]

        for dr, dc in directions:
            new_row = row + dr
            new_col = col + dc

            # If the neighbour is not visited, recursively call the DFS
            # function on the neighbour
            if (
                self.is_valid_cell(grid, new_row, new_col)
                and not visited[new_row][new_col]
            ):
                self.dfs(grid, new_row, new_col, visited, result)

    def depth_first_traversal_on_a_grid(
        self, grid: List[List[int]]
    ) -> List[Tuple[int, int]]:
        rows = len(grid)

        # If the grid is empty, return an empty result
        if rows == 0:
            return []

// Diagram: cols = len(grid[0])

        # Initialize a list to store the result of the DFS
        # which will contain the coordinates of the cells visited
        # during the DFS traversal
        result: List[Tuple[int, int]] = []

        # Initialize visited array
        visited = [[False] * cols for _ in range(rows)]

        # Traverse each cell of the grid
        for row in range(rows):
            for col in range(cols):

                # If the cells is not visitable or is already visited,
                # continue to the next cell
                if grid[row][col] == 0 or visited[row][col]:

                # Perform DFS on this new cell to visit all the cells
                # connected to it.
                self.dfs(grid, row, col, visited, result)

        return result
```

## Complexity Analysis

For full traversal of a graph, the runtime complexity of depth-first search is **O(N+E)** in any case, where **N** is the number of nodes and **E** is the number of edges in a graph.

A grid with **R** rows and **C** columns is modelled as an undirected graph with **R x C** nodes. The total number of edges in such a graph would also be of the order of R x C, resulting in a runtime complexity of **O(RxC)**.

Depending on the path traced during the execution of depth-first search, the maximum depth of the recursive call stack can be **R x C**, resulting in **O(RxC)** space if the path traced follows this pattern.

// Diagram: Worst case path leading to a recursive stack size of R x C.

Moreover, we create a visited array of the same size as the grid in any case, and so the space complexity is **O(RxC)** in any case.

> **Best Case**
>
> -   Space Complexity - **O(R x C)**
> -   Time Complexity - **O(R x C)**
>
> **Worst Case**
>
> -   Space Complexity - **O(R x C)**
> -   Time Complexity - **O(R x C)**

***

# Depth first traversal on a grid

## Problem Statement

Fundamental

Given a **grid** filled with values of either `0`, or `1`, write a function to return a list of coordinate pairs `(row, col)` in the order in which they would appear in a depth-first search traversal starting from the cell `(0, 0)`.

> -   A value of \`1\` in a cell means the cell can be visited.
> -   A value of \`0\` in a cell means the call cannot be visited.

> You must abide by the following constraint:
>
> -   You can only move in the four cardinal directions, i.e., \`up\`, \`right\`, \`down\`, and \`left\`.
> -   When exploring neighbouring cells, you must follow this exact order: \`up\` → \`right\` → \`down\` → \`left\`.

### Example 1

> -   **Input:** grid = \[\[1, 1, 0, 0\], \[0, 0, 1, 1\], \[1, 0, 1, 1\], \[1, 0, 0, 0\]\]
> -   **Output:** \[\[0, 0\], \[0, 1\], \[1, 2\], \[1, 3\], \[2, 3\], \[2, 2\], \[2, 0\], \[3, 0\]\]
> -   **Explanation:** This represents the depth-first search traversal starting from the cell (0, 0).

### Example 2

> -   **Input:** grid = \[\[1, 0, 0, 1\], \[0, 0, 0, 0\], \[1, 1, 1, 1\], \[0, 0, 0, 1\]\]
> -   **Output:** \[\[0, 0\], \[0, 3\], \[2, 0\], \[2, 1\], \[2, 2\], \[2, 3\], \[3, 3\]\]
> -   **Explanation:** This represents the depth-first search traversal starting from the cell (0, 0).

## Solution

```cpp
using namespace std;

class Solution {
public:
    bool isValidCell(vector<vector<int>> &grid, int row, int col) {

        // Check if a cell is valid and belongs to a region of 1's, also
        // check that the cell is not water
        return row >= 0 && row < grid.size() && col >= 0 &&
               col < grid[0].size() && grid[row][col] == 1;
    }

    void dfs(
        vector<vector<int>> &grid,
        int row,
        int col,
        vector<vector<bool>> &visited,
        vector<pair<int, int>> &result
    ) {

        // Mark the current cell as visited
        visited[row][col] = true;

        // Add the current cell to the result
        result.push_back({row, col});

        // Define the possible movements: up, right, down, left
        vector<pair<int, int>> directions = {
            {-1, 0}, // up
            {0, 1},  // right
            {1, 0},  // down
            {0, -1}  // left
        };

        for (const auto &dir : directions) {
            int newRow = row + dir.first;
            int newCol = col + dir.second;

            // If the neighbour is not visited, recursively call the DFS
            // function on the neighbour
            if (isValidCell(grid, newRow, newCol) &&
                !visited[newRow][newCol]) {
                dfs(grid, newRow, newCol, visited, result);
            }
        }
    }

    vector<pair<int, int>> depthFirstTraversalOnAGrid(
        vector<vector<int>> &grid
    ) {
        int rows = grid.size();

        // If the grid is empty, return an empty result
        if (rows == 0) {
            return {};
        }

        int cols = grid[0].size();

        // Initialize a vector to store the result of the DFS
        // which will contain the coordinates of the cells visited
        // during the DFS traversal
        vector<pair<int, int>> result;

        // Initialize visited array
        vector<vector<bool>> visited(rows, vector<bool>(cols, false));

        // Traverse each cell of the grid
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {

                // If the cells is not visitable or is already visited,
                // continue to the next cell
                if (grid[row][col] == 0 || visited[row][col]) {
                    continue;
                }

                // Perform DFS on this new cell to visit all the cells
                // connected to it.
                dfs(grid, row, col, visited, result);
            }
        }

        return result;
    }
};
```

***

# Understanding breadth first traversal on a grid

The breadth-first algorithm on a grid is the same as for any other graph. We start from a node and all its unvisited neighbours to a queue to schedule their visit later. We then pick the node at the front of the queue and repeat the process until the queue is empty. However, to fully traverse disconnected graphs, we need to iterate over all the nodes and run breadth-first search from any unvisited node.

Breadth-first search on a grid uses coordinates (row, col) to uniquely identify a node and **compute** the identifiers (coordinates) of adjacent nodes, instead of reading them from an adjacency list. In this explanation, we will use the term **cell** and **node** interchangeably, as every node is uniquely identified by the coordinates (row, col) of its cell in the grid.

// Diagram: Computing the coordinates of neighbouring cells in all four directions.

## Algorithm

To understand breadth-first search on a grid, let's consider a grid where a value of 1 indicates that the cell should be explored, while a value of 0 indicates it should not be explored. We can model this grid as a graph that has a mix of nodes, where some can be visited while others cannot. Since some cells also have 0 values, the resulting graph can potentially be disconnected, meaning there may not be a path between every pair of nodes. Therefore, we may need to run a breadth-first search multiple times from different nodes.

// Diagram: A grid that has 0s and 1s where 1 means a cell can be visited while 0 means it cannot be visited.

We start by creating a two-dimensional `visited` array of the same size as the grid and initialise it with false.

// Diagram: We create a visited array of the same size as the grid and initialize it with false.

We also create `queue` top hold pair of integers (coordinates of a node).

// Diagram: We create a queue to hold the coordinates of the cells for breadth-first search.

We then iterate in the `visited` array and in each iteration, check if the current cell (node) is marked `false` and the grid has a value 1 at that coordinate. If the condition holds `true`, we start breadth-first search from that cell by adding its coordinates (row, col) to the `queue`. If not, it means the node is either already visited or cannot be visited.

// Diagram: Start bfs from cells that are unvisited and have a value 1 in grid by adding them to queue.

To start the breadth-first search, we iterate until `queue` is empty and in each iteration, extract the pair at the front of the `queue`. The pair denotes the coordinate of the current node, and we mark it as visited in the `visited` array. We then compute the coordinates of all its neighbouring nodes, iterate over those coordinates and in each iteration, check if the coordinate is within the bounds of the grid and has a value of 1. If it is within bounds, not marked as visited, and has a value of 1, we add the coordinate to the `queue` and continue to the next iteration.

// Diagram: Only the neighbours that are within the bounds of the grid and have a value of 1 can be visited.

This way we traverse the `grid` in breadth-frst order, starting from the start node. At the end of all iterations, all nodes reachable from the first node will have been visited. We then continue iteration in the `visited` array and repeat the process for all the nodes that have a value of 1 and have not yet been marked as visited. This way, at the end of all iterations, all nodes that can be visited will be visited.

The algorithm below summarises the breadth-first search on such a grid.

> **Algorithm**
>
> **bfs(row, col, \[ref\] grid, \[ref\] visited)**
>
> -   **Step 1:** Create a queue \`q\` to hold coordinates
> -   **Step 2:** Add the pair \`(row, col)\` to \`q\`
> -   **Step 3:** Iterate while \`q\` is not empty and do the following:
>     -   **Step 3.1:** Pop the coordinate at the front of \`q\` as \`(currentRow, currentCol)\`
>     -   **Step 3.2:** Set \`visited\[currentRow\]\[currentCol\]\` to \`true\`
>     -   **Step 3.3:** Compute coordinates in all four (up, right, bottom, top) in \`(newRow, newCol)\` and for each, do the following:
>         -   **Step 3.3.1:** If \`(newRow, newCol)\` is within the bounds of \`grid\` and \`grid\[newRow\]\[newCol\]\` is \`1\` and \`visited\[newRow\]\[newCol\]\` is \`false\`, do the following:
>             -   **Step 3.3.1.1:** Add \`(newRow, newCol)\` to \`q\`
>             -   **Step 3.3.1.2:** Set \`visited\[newRow\]\[newCol\]\` to \`true\`
>
> **callingFunction(\[ref\] grid)**
>
> -   **Step 1:** Create a \`visited\` array of the same size as \`grid\` and initialize it to \`false\`
> -   **Step 2:** Iterate in \`grid\` using \`row\` and \`col\` and do the following for each cell:
>     -   **Step 2.1:** If \`grid\[row\]\[col\]\` is \`1\` and \`visited\[row\]\[col\]\` is \`false\`, call \`bfs(row, col, grid, visited)\`

Let's examine an example to understand how the breadth-first search works on such a grid.

Breadth first traversal on a grid.

## Implementation

To implement breadth-first search on a grid, we create a function `bfs`, that takes as arguments: the reference to the `visited` array and the coordinates (row, col) of a cell to identify a node uniquely. We create the `visited` array in the calling function to pass it by reference to `bfs`. For languages that don't support passing data by reference, we create it in the enclosing scope.

We create and use a temporary array `dir` to easily compute the coordinates of all potential neighbours.

C++

```cpp
#include <queue>

// Diagram: using namespace std;

class Solution {
public:
    bool isValidCell(vector<vector<int>> &grid, int row, int col) {

        // Check if a cell is valid and belongs to a region of 1's, also
        // check that the cell is not water
        return row >= 0 && row < grid.size() && col >= 0 &&
               col < grid[0].size() && grid[row][col] == 1;
    }

    void bfs(
        vector<vector<int>> &grid,
        int row,
        int col,
        vector<vector<bool>> &visited,
        vector<pair<int, int>> &result
    ) {

        // Create a queue to perform breadth-first search
        queue<pair<int, int>> queue;

        // Add the current cell to the queue
        queue.push({row, col});

        // Mark the current cell as visited
        visited[row][col] = true;

        // Define the possible movements: up, right, down, left
        vector<pair<int, int>> directions = {
            {-1, 0}, // up
            {0, 1},  // right
            {1, 0},  // down
            {0, -1}  // left
        };

        // Perform BFS
        while (!queue.empty()) {

            // Get the front cell from the queue
            auto [currRow, currCol] = queue.front();
            queue.pop();

            // Add the current cell to the result
            result.push_back({currRow, currCol});

            for (const auto &dir : directions) {
                int newRow = currRow + dir.first;
                int newCol = currCol + dir.second;

                // If the neighbour is not visited, add it to the queue
                if (isValidCell(grid, newRow, newCol) &&
                    !visited[newRow][newCol]) {

                    // Add the new cell to the queue
                    queue.push({newRow, newCol});

                    // Mark the new cell as visited
                    visited[newRow][newCol] = true;
                }

    vector<pair<int, int>> breadthFirstTraversalOnAGrid(
        vector<vector<int>> &grid
    ) {
        int rows = grid.size();

        // Check if the grid is empty
        if (rows == 0) {
            return {};
        }

// Diagram: int cols = grid[0].size();

        // Initialize a vector to store the result of the BFS
        // which will contain the coordinates of the cells visited
        // during the BFS traversal
        vector<pair<int, int>> result;

        // Initialize visited array
        vector<vector<bool>> visited(rows, vector<bool>(cols, false));

        // Traverse each cell of the grid
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {

                // If the cells is not visitable or is already visited,
                // continue to the next cell
                if (grid[row][col] == 0 || visited[row][col]) {
                    continue;
                }

                // Perform BFS on this new cell to visit all the cells
                // connected to it.
                bfs(grid, row, col, visited, result);
            }

        return result;
    }
};
```

Java

```java
import java.util.*;

class Solution {
    public boolean isValidCell(int[][] grid, int row, int col) {

        // Check if a cell is valid and belongs to a region of 1's, also
        // check that the cell is not water
        return (
            row >= 0 &&
            row < grid.length &&
            col >= 0 &&
            col < grid[0].length &&
            grid[row][col] == 1
        );
    }

    public void bfs(
        int[][] grid,
        int row,
        int col,
        boolean[][] visited,
        List<List<Integer>> result
    ) {

        // Create a queue to perform breadth-first search
        Queue<int[]> queue = new LinkedList<>();

        // Add the current cell to the queue
        queue.add(new int[] { row, col });

        // Mark the current cell as visited
        visited[row][col] = true;

        // Define the possible movements: up, right, down, left
        int[][] directions = {
            {-1, 0}, // up
            {0, 1},  // right
            {1, 0},  // down
            {0, -1}  // left
        };

        // Perform BFS
        while (!queue.isEmpty()) {

            // Get the front cell from the queue
            int[] current = queue.poll();
            row = current[0];
            col = current[1];

            // Add the current cell to the result
            result.add(List.of(row, col));

            // Explore all possible movements
            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                // If the neighbour is not visited, add it to the queue
                if (
                    isValidCell(grid, newRow, newCol) &&
                    !visited[newRow][newCol]
                ) {

                    // Add the new cell to the queue
                    queue.add(new int[] { newRow, newCol });

                    // Mark the new cell as visited
                    visited[newRow][newCol] = true;
                }

    public List<List<Integer>> breadthFirstTraversalOnAGrid(
        int[][] grid
    ) {
        int rows = grid.length;

        // Check if the grid is empty
        if (rows == 0) {
            return new ArrayList<>();
        }

// Diagram: int cols = grid[0].length;

        // Initialize a vector to store the result of the BFS
        // which will contain the coordinates of the cells visited
        // during the BFS traversal
        List<List<Integer>> result = new ArrayList<>();

        // Initialize visited array
        boolean[][] visited = new boolean[rows][cols];

        // Traverse each cell of the grid
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {

                // If the cells is not visitable or is already visited,
                // continue to the next cell
                if (grid[row][col] == 0 || visited[row][col]) {
                    continue;
                }

                // Perform BFS on this new cell to visit all the cells
                // connected to it.
                bfs(grid, row, col, visited, result);
            }

        return result;
    }
```

Typescript

```typescript
export class Solution {
    isValidCell(grid: number[][], row: number, col: number): boolean {

        // Check if a cell is valid and belongs to a region of 1's, also
        // check that the cell is not water
        return (
            row >= 0 &&
            row < grid.length &&
            col >= 0 &&
            col < grid[0].length &&
            grid[row][col] === 1
        );
    }

    bfs(
        grid: number[][],
        row: number,
        col: number,
        visited: boolean[][],
        result: number[][]
    ): void {

        // Create a queue to perform breadth-first search
        const queue: [number, number][] = [];

        // Add the current cell to the queue
        queue.push([row, col]);

        // Mark the current cell as visited
        visited[row][col] = true;

        // Define the possible movements: all 8 directions (up, right,
        // down, left, and diagonals)
        const directions: number[][] = [
            [-1, 0], // up
            [0, 1],  // right
            [1, 0],  // down
            [0, -1]  // left
        ];

        // Perform BFS
        while (queue.length > 0) {

            // Get the front cell from the queue
            const [currRow, currCol] = queue.shift()!;

            // Add the current cell to the result
            result.push([currRow, currCol]);

            for (const [dr, dc] of directions) {
                const newRow = currRow + dr;
                const newCol = currCol + dc;

                // If the neighbour is not visited, add it to the queue
                if (
                    this.isValidCell(grid, newRow, newCol) &&
                    !visited[newRow][newCol]
                ) {

                    // Add the new cell to the result
                    queue.push([newRow, newCol]);

                    // Mark the new cell as visited
                    visited[newRow][newCol] = true;
                }

    breadthFirstTraversalOnAGrid(grid: number[][]): number[][] {
        const rows = grid.length;

        // Check if the grid is empty
        if (rows === 0) {
            return [];
        }

// Diagram: const cols = grid[0].length;

        // Initialize a vector to store the result of the BFS
        // which will contain the coordinates of the cells visited
        // during the BFS traversal
        const result: number[][] = [];

        // Initialize visited array
        const visited: boolean[][] = Array.from({ length: rows }, () =>
            Array(cols).fill(false)
        );

        // Traverse each cell of the grid
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {

                // If the cells is not visitable or is already visited,
                // continue to the next cell
                if (grid[row][col] === 0 || visited[row][col]) {
                    continue;
                }

                // Perform BFS on this new cell to visit all the cells
                // connected to it.
                this.bfs(grid, row, col, visited, result);
            }

        return result;
    }
```

Javascript

```javascript
export class Solution {
    isValidCell(grid, row, col) {

        // Check if a cell is valid and belongs to a region of 1's, also
        // check that the cell is not water
        return (
            row >= 0 &&
            row < grid.length &&
            col >= 0 &&
            col < grid[0].length &&
            grid[row][col] === 1
        );
    }

// Diagram: bfs(grid, row, col, visited, result) {

        // Create a queue to perform breadth-first search
        const queue = [];

        // Add the current cell to the queue
        queue.push([row, col]);

        // Mark the current cell as visited
        visited[row][col] = true;

        // Define the possible movements: all 8 directions (up, right,
        // down, left, and diagonals)
        const directions = [
            [-1, 0], // up
            [0, 1],  // right
            [1, 0],  // down
            [0, -1]  // left
        ];

        // Perform BFS
        while (queue.length > 0) {

            // Get the front cell from the queue
            const [currRow, currCol] = queue.shift();

            // Add the current cell to the result
            result.push([currRow, currCol]);

            for (const [dr, dc] of directions) {
                const newRow = currRow + dr;
                const newCol = currCol + dc;

                // If the neighbour is not visited, add it to the queue
                if (
                    this.isValidCell(grid, newRow, newCol) &&
                    !visited[newRow][newCol]
                ) {

                    // Add the new cell to the result
                    queue.push([newRow, newCol]);

                    // Mark the new cell as visited
                    visited[newRow][newCol] = true;
                }

    breadthFirstTraversalOnAGrid(grid) {
        const rows = grid.length;

        // Check if the grid is empty
        if (rows === 0) {
            return [];
        }

// Diagram: const cols = grid[0].length;

        // Initialize a vector to store the result of the BFS
        // which will contain the coordinates of the cells visited
        // during the BFS traversal
        const result = [];

        // Initialize visited array
        const visited = Array.from({ length: rows }, () =>
            Array(cols).fill(false)
        );

        // Traverse each cell of the grid
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {

                // If the cells is not visitable or is already visited,
                // continue to the next cell
                if (grid[row][col] === 0 || visited[row][col]) {
                    continue;
                }

                // Perform BFS on this new cell to visit all the cells
                // connected to it.
                this.bfs(grid, row, col, visited, result);
            }

        return result;
    }
```

Python

```python
from typing import List, Tuple
from queue import Queue

class Solution:
    def is_valid_cell(
        self, grid: List[List[int]], row: int, col: int
    ) -> bool:

        # Check if a cell is valid and belongs to a region of 1's, also
        # check that the cell is not water
        return (
            row >= 0
            and row < len(grid)
            and col >= 0
            and col < len(grid[0])
            and grid[row][col] == 1
        )

    def bfs(
        self,
        grid: List[List[int]],
        row: int,
        col: int,
        visited: List[List[bool]],
        result: List[Tuple[int, int]],
    ) -> None:

        # Create a queue to perform breadth-first search
        queue: Queue[Tuple[int, int]] = Queue()

        # Add the current cell to the queue
        queue.put((row, col))

        # Mark the current cell as visited
        visited[row][col] = True

        # Define the possible movements: up, down, left, right
        directions: List[Tuple[int, int]] = [
            (-1, 0),  # up
            (0, 1),   # right
            (1, 0),   # down
            (0, -1)   # left
        ]

        while not queue.empty():

            # Get the front cell from the queue
            curr_row, curr_col = queue.get()

            # Add the current cell to the result
            result.append((curr_row, curr_col))

            for dr, dc in directions:
                new_row = curr_row + dr
                new_col = curr_col + dc

                # If the neighbour is not visited, add it to the queue
                if (
                    self.is_valid_cell(grid, new_row, new_col)
                    and not visited[new_row][new_col]
                ):

                    # Add the new cell to the result
                    queue.put((new_row, new_col))

                    # Mark the new cell as visited
                    visited[new_row][new_col] = True

    def breadth_first_traversal_on_a_grid(
        self, grid: List[List[int]]
    ) -> List[Tuple[int, int]]:
        rows = len(grid)

        # Check if the grid is empty
        if rows == 0:
            return []

// Diagram: cols = len(grid[0])

        # Initialize a vector to store the result of the BFS
        # which will contain the coordinates of the cells visited
        # during the BFS traversal
        result: List[Tuple[int, int]] = []

        # Initialize visited array
        visited = [[False] * cols for _ in range(rows)]

        # Traverse each cell of the grid
        for row in range(rows):
            for col in range(cols):

                # If the cells is not visitable or is already visited,
                # continue to the next cell
                if grid[row][col] == 0 or visited[row][col]:

                # Perform BFS on this new cell to visit all the cells
                # connected to it.
                self.bfs(grid, row, col, visited, result)

        return result
```

## Complexity Analysis

For full traversal of a graph, the runtime complexity of breadth-first search is **O(N+E)** in any case, where **N** is the number of nodes and **E** is the number of edges in a graph.

A grid with **R** rows and **C** columns is modelled as an undirected graph with **R x C** nodes. The total number of edges in such a graph would also be of the order of R x C, resulting in a runtime complexity of **O(RxC)**. Since we create a visited array of the same size as the grid in any case, the space complexity is **O(RxC)** in any case.

> **Best Case**
>
> -   Space Complexity - **O(R x C)**
> -   Time Complexity - **O(R x C)**
>
> **Worst Case**
>
> -   Space Complexity - **O(R x C)**
> -   Time Complexity - **O(R x C)**

***

# Breadth first traversal on a grid

## Problem Statement

Fundamental

Given a **grid** filled with values of either `0`, or `1`, write a function to return a list of coordinate pairs `(row, col)` in the order in which they would appear in a breadth-first search traversal starting from the cell `(0, 0)`.

> -   A value of \`1\` in a cell means the cell can be visited.
> -   A value of \`0\` in a cell means the call cannot be visited.

> You must abide by the following constraint:
>
> -   You can only move in the four cardinal directions, i.e., \`up\`, \`right\`, \`down\`, and \`left\`.
> -   When exploring neighbouring cells, you must follow this exact order: \`up\` → \`right\` → \`down\` → \`left\`.

### Example 1

> -   **Input:** grid = \[\[1, 1, 0, 0\], \[0, 0, 1, 1\], \[1, 0, 1, 1\], \[1, 0, 0, 0\]\]
> -   **Output:** \[\[0, 0\], \[0, 1\], \[1, 2\], \[1, 3\], \[2, 2\], \[2, 3\], \[2, 0\], \[3, 0\]\]
> -   **Explanation:** This represents the depth-first search traversal starting from the cell (0, 0).

### Example 2

> -   **Input:** grid = \[\[1, 0, 0, 1\], \[0, 0, 0, 0\], \[1, 1, 1, 1\], \[0, 0, 0, 1\]\]
> -   **Output:** \[\[0, 0\], \[0, 3\], \[2, 0\], \[2, 1\], \[2, 2\], \[2, 3\], \[3, 3\]\]
> -   **Explanation:** This represents the depth-first search traversal starting from the cell (0, 0).

## Solution

```cpp
#include <queue>

using namespace std;

class Solution {
public:
    bool isValidCell(vector<vector<int>> &grid, int row, int col) {

        // Check if a cell is valid and belongs to a region of 1's, also
        // check that the cell is not water
        return row >= 0 && row < grid.size() && col >= 0 &&
               col < grid[0].size() && grid[row][col] == 1;
    }

    void bfs(
        vector<vector<int>> &grid,
        int row,
        int col,
        vector<vector<bool>> &visited,
        vector<pair<int, int>> &result
    ) {

        // Create a queue to perform breadth-first search
        queue<pair<int, int>> queue;

        // Add the current cell to the queue
        queue.push({row, col});

        // Mark the current cell as visited
        visited[row][col] = true;

        // Define the possible movements: up, right, down, left
        vector<pair<int, int>> directions = {
            {-1, 0}, // up
            {0, 1},  // right
            {1, 0},  // down
            {0, -1}  // left
        };

        // Perform BFS
        while (!queue.empty()) {

            // Get the front cell from the queue
            auto [currRow, currCol] = queue.front();
            queue.pop();

            // Add the current cell to the result
            result.push_back({currRow, currCol});

            for (const auto &dir : directions) {
                int newRow = currRow + dir.first;
                int newCol = currCol + dir.second;

                // If the neighbour is not visited, add it to the queue
                if (isValidCell(grid, newRow, newCol) &&
                    !visited[newRow][newCol]) {

                    // Add the new cell to the queue
                    queue.push({newRow, newCol});

                    // Mark the new cell as visited
                    visited[newRow][newCol] = true;
                }
            }
        }
    }

    vector<pair<int, int>> breadthFirstTraversalOnAGrid(
        vector<vector<int>> &grid
    ) {
        int rows = grid.size();

        // Check if the grid is empty
        if (rows == 0) {
            return {};
        }

        int cols = grid[0].size();

        // Initialize a vector to store the result of the BFS
        // which will contain the coordinates of the cells visited
        // during the BFS traversal
        vector<pair<int, int>> result;

        // Initialize visited array
        vector<vector<bool>> visited(rows, vector<bool>(cols, false));

        // Traverse each cell of the grid
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {

                // If the cells is not visitable or is already visited,
                // continue to the next cell
                if (grid[row][col] == 0 || visited[row][col]) {
                    continue;
                }

                // Perform BFS on this new cell to visit all the cells
                // connected to it.
                bfs(grid, row, col, visited, result);
            }
        }

        return result;
    }
};
```
