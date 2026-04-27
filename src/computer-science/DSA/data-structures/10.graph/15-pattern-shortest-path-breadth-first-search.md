# Pattern: Shortest path (Breadth first search)

## Table of Contents

1. [Identifying breadth-first search](#the-breadth-first-search-solution)
2. [Minimum steps in a grid](#minimum-steps-in-a-grid)
3. [Nearest distance](#nearest-distance)
4. [Shortest word transformation](#shortest-word-transformation)
5. [Minimum steps in a grid II](#minimum-steps-in-a-grid-ii)

***

# Identifying breadth-first search for shortest path

The breadth-first search can solve the shortest path problems for unweighted graphs. These are generally **medium** or **hard** problems where we need to find the shortest distance between any pair of nodes. While there may be other ways to solve such problems, they are usually less efficient and more complicated to implement.

If the problem statement or its solution follows the generic template below, it can be solved by applying the breadth-first search algorithm.

**Template:**

Given an unweighted graph, find the shortest path from a source to some or all other nodes.

## Example

Let's consider the following problem as an example to better understand how to identify and solve shortest path problems using breadth-first search.

> **Problem statement:** Given an NxM grid filled either 0, or 1, where 1 means a cell is walkable and 0 means it is unwalkable. Find the minimum number of steps required to reach the cell (N-1, M-1) from the cell (0, 0) if movement is allowed in the cardinal directions (up, down, left, right). If no such path exists, return -1.

// Diagram: Find the shortest path from (0, 0) to (N-1, M-1) in the given grid.

## The breadth first search solution

The problem description fits the generic template for the shortest path problem using breadth-first search, which we learned earlier.

**Template:**

Given an unweighted graph (grid), find the shortest path from a source (0, 0) to a destination (N-1, M-1).

We can solve this problem by modelling the grid as an unweighted graph and finding the shortest distance between the given two nodes while only considering the nodes with value 1. We start by creating a two-dimensional `visited` array of the same size as the grid and initialise it with `false`. We also create `queue` to hold a tuple of three values: row index, column index and distance, respectively, to use in breadth-first search.

// Diagram: Create a 2D visited array and a queue for breadth-first search.

We then check the value at both coordinates (0, 0) and (N-1, M-1) to ensure they both can be visited. If any of them has a value 0, we return -1 as no path can exist in this case.

// Diagram: Check that both (0, 0) and (N-1, M-1) have non-zero values.

If both cells have a value of 1, we create a tuple (0, 0, 0) with the coordinates of the cell at (0, 0) and a starting distance 0 and push it to the `queue`. We then iterate until `queue` is empty and in each iteration, extract the tuple at the front of the `queue` which denotes the coordinates of the current node and its distance from the cell at (0, 0). We save the current distance in a local variable `currSteps`, and mark the cell visited in the `visited` array using its coordinates. If the coordinates of the current node are (N-1, M-1), we return `currSteps` as the solution to the problem.

Otherwise, we compute the coordinates of all the neighbouring nodes, iterate over them, and in each iteration, check if they are within the bounds of the `grid`, and the cell in `grid` at those coordinates has a value of 1. If the condition holds `true`, we create a tuple with these coordinates and a distance value `currSteps + 1` , and push it to the `queue` before continuing to the next iteration.

This way, we either reach the destination (N-1, M-1) and return the minimum number of steps from source (0, 0) or the breadth-first search ends without ever reaching the destination, in which case, we return -1 to the caller.

Find the shortest path from (0, 0) to (2, 4).

The implementation of the breadth-first search solution to solve the problem is given below.

C++

```cpp
#include <queue>

// Diagram: using namespace std;

struct Cell {
    int row;
    int col;
    int steps;
};

class Solution {
public:
    bool isValidCell(vector<vector<int>> &grid, int row, int col) {
        return row >= 0 && row < grid.size() && col >= 0 &&
               col < grid[0].size() && grid[row][col] == 1;
    }

    int minimumStepsInAGrid(vector<vector<int>> &grid) {
        int rows = grid.size();
        int cols = grid[0].size();

        // Create a visited matrix to keep track of visited cells
        vector<vector<bool>> visited(rows, vector<bool>(cols, false));

        // Create a queue for BFS traversal
        queue<Cell> queue;
        queue.push({0, 0, 0});
        visited[0][0] = true;

        // Define the possible movements: up, right, down, left
        vector<pair<int, int>> directions = {
            {-1, 0}, // up
            {0, 1},  // right
            {1, 0},  // down
            {0, -1}  // left
        };

        while (!queue.empty()) {
            Cell currCell = queue.front();
            queue.pop();

            int currRow = currCell.row;
            int currCol = currCell.col;
            int currSteps = currCell.steps;

            // Check if reached the destination cell
            if (currRow == rows - 1 && currCol == cols - 1) {
                return currSteps;
            }

            // Explore the neighbours
            for (const auto& dir : directions) {
                int newRow = currRow + dir.first;
                int newCol = currCol + dir.second;

                // Check if the new cell is within the grid boundaries
                // and contains 1
                if (isValidCell(grid, newRow, newCol)) {

                    // Check if the new cell has not been visited before
                    if (!visited[newRow][newCol]) {

                        // Add the new cell to the queue
                        queue.push({newRow, newCol, currSteps + 1});

                        // Mark the new cell as visited
                        visited[newRow][newCol] = true;
                    }

        // No path found
        return -1;
    }
};
```

Java

```java
import java.util.*;

// Diagram: class Cell {

    int row;
    int col;
    int steps;

    public Cell(int row, int col, int steps) {
        this.row = row;
        this.col = col;
        this.steps = steps;
    }

class Solution {
    public boolean isValidCell(int[][] grid, int row, int col) {
        return (
            row >= 0 &&
            row < grid.length &&
            col >= 0 &&
            col < grid[0].length &&
            grid[row][col] == 1
        );
    }

    public int minimumStepsInAGrid(int[][] grid) {
        int rows = grid.length;
        int cols = grid[0].length;

        // Create a visited matrix to keep track of visited cells
        boolean[][] visited = new boolean[rows][cols];

        // Create a queue for BFS traversal
        Queue<Cell> queue = new LinkedList<>();
        queue.add(new Cell(0, 0, 0));
        visited[0][0] = true;

        // Define the possible movements: up, right, down, left
        int[][] directions = {
            {-1, 0}, // up
            {0, 1},  // right
            {1, 0},  // down
            {0, -1}  // left
        };

        while (!queue.isEmpty()) {
            Cell currCell = queue.poll();

            int currRow = currCell.row;
            int currCol = currCell.col;
            int currSteps = currCell.steps;

            // Check if reached the destination cell
            if (currRow == rows - 1 && currCol == cols - 1) {
                return currSteps;
            }

            // Explore the neighbours
            for (int[] dir : directions) {
                int newRow = currRow + dir[0];
                int newCol = currCol + dir[1];

                // Check if the new cell is within the grid boundaries
                // and contains 1
                if (isValidCell(grid, newRow, newCol)) {

                    // Check if the new cell has not been visited before
                    if (!visited[newRow][newCol]) {

                        // Add the new cell to the queue
                        queue.add(
                            new Cell(newRow, newCol, currSteps + 1)
                        );

                        // Mark the new cell as visited
                        visited[newRow][newCol] = true;
                    }

        // No path found
        return -1;
    }
```

Typescript

```typescript
class Cell {
    row: number;
    col: number;
    steps: number;

    constructor(row: number, col: number, steps: number) {
        this.row = row;
        this.col = col;
        this.steps = steps;
    }

// Diagram: export class Solution {

    // Check if a cell is within the grid boundaries and contains 1
    private isValidCell(
        grid: number[][],
        row: number,
        col: number
    ): boolean {
        return (
            row >= 0 &&
            row < grid.length &&
            col >= 0 &&
            col < grid[0].length &&
            grid[row][col] === 1
        );
    }

    public minimumStepsInAGrid(grid: number[][]): number {
        const rows = grid.length;
        const cols = grid[0].length;

        // Create a visited matrix to keep track of visited cells
        const visited: boolean[][] = Array.from({ length: rows }, () =>
            Array(cols).fill(false)
        );

        // Create a queue for BFS traversal
        const queue: Cell[] = [];
        queue.push(new Cell(0, 0, 0));
        visited[0][0] = true;

        // Define the possible movements: up, right, down, left
        const directions: number[][] = [
            [-1, 0], // up
            [0, 1],  // right
            [1, 0],  // down
            [0, -1]  // left
        ];

        while (queue.length > 0) {
            const currCell = queue.shift()!;

            const currRow = currCell.row;
            const currCol = currCell.col;
            const currSteps = currCell.steps;

            // Check if reached the destination cell
            if (currRow === rows - 1 && currCol === cols - 1) {
                return currSteps;
            }

            // Explore the neighbours
            for (const [dr, dc] of directions) {
                const newRow = currRow + dr;
                const newCol = currCol + dc;

                // Check if the new cell is within the grid boundaries
                // and contains 1
                if (this.isValidCell(grid, newRow, newCol)) {

                    // Check if the new cell has not been visited before
                    if (!visited[newRow][newCol]) {

                        // Add the new cell to the queue
                        queue.push(
                            new Cell(newRow, newCol, currSteps + 1)
                        );

                        // Mark the new cell as visited
                        visited[newRow][newCol] = true;
                    }

        // No path found
        return -1;
    }
```

Javascript

```javascript
class Cell {
    constructor(row, col, steps) {
        this.row = row;
        this.col = col;
        this.steps = steps;
    }

// Diagram: export class Solution {

    // Check if a cell is within the grid boundaries and contains 1
    isValidCell(grid, row, col) {
        return (
            row >= 0 &&
            row < grid.length &&
            col >= 0 &&
            col < grid[0].length &&
            grid[row][col] === 1
        );
    }

    minimumStepsInAGrid(grid) {
        const rows = grid.length;
        const cols = grid[0].length;

        // Create a visited matrix to keep track of visited cells
        const visited = Array.from({ length: rows }, () =>
            Array(cols).fill(false)
        );

        // Create a queue for BFS traversal
        const queue = [];
        queue.push(new Cell(0, 0, 0));
        visited[0][0] = true;

        // Define the possible movements: up, right, down, left
        const directions = [
            [-1, 0], // up
            [0, 1],  // right
            [1, 0],  // down
            [0, -1]  // left
        ];

        while (queue.length > 0) {
            const currCell = queue.shift();

            const currRow = currCell.row;
            const currCol = currCell.col;
            const currSteps = currCell.steps;

            // Check if reached the destination cell
            if (currRow === rows - 1 && currCol === cols - 1) {
                return currSteps;
            }

            // Explore the neighbours
            for (const [dr, dc] of directions) {
                const newRow = currRow + dr;
                const newCol = currCol + dc;

                // Check if the new cell is within the grid boundaries
                // and contains 1
                if (this.isValidCell(grid, newRow, newCol)) {

                    // Check if the new cell has not been visited before
                    if (!visited[newRow][newCol]) {

                        // Add the new cell to the queue
                        queue.push(
                            new Cell(newRow, newCol, currSteps + 1)
                        );

                        // Mark the new cell as visited
                        visited[newRow][newCol] = true;
                    }

        // No path found
        return -1;
    }
```

Python

```python
from typing import List, Tuple
from queue import Queue

class Cell:
    def __init__(self, row: int, col: int, steps: int):
        self.row = row
        self.col = col
        self.steps = steps

class Solution:
    def is_valid_cell(
        self, grid: List[List[int]], row: int, col: int
    ) -> bool:
        return (
            0 <= row < len(grid)
            and 0 <= col < len(grid[0])
            and grid[row][col] == 1
        )

    def minimum_steps_in_a_grid(self, grid: List[List[int]]) -> int:
        rows = len(grid)
        cols = len(grid[0])
```

Modelling the grid as an unweighted graph and using breadth-first search can solve this problem in **O(NxM)** time with a simple iterative implementation.

## Example problems

Most problems that fall under this category are**medium** or **hard**problems; a list of a few is given below.

> -   **[Minimum steps in a grid](https://www.codeintuition.io/courses/graph/u9b3qxlI8BZH4xiAnGClr)**
> -   **[Nearest distance](https://www.codeintuition.io/courses/graph/wHh6bANWBO81Hu3IecYC8)**
> -   **[Shortest word transformation](https://www.codeintuition.io/courses/graph/sDDkne7vpNxgvlCOHoytF)**
> -   **[Minimum steps in a grid II](https://www.codeintuition.io/courses/graph/9oqyM4Nh3e_lg_5yp5SyP)**

We will now solve these problems to understand the application of breadth-first search for finding the shortest path.

***

# Minimum steps in a grid

## Problem Statement

Given an **NxM** **grid** filled with values of either `0`, or `1`, write a function to find and return the minimum number of steps required to reach the cell `(N-1, M-1)` from the cell `(0, 0)`. If there is no valid path, return `-1` instead.

> -   A value of `1` in a cell means it's walkable.
> -   A value of `0` in a cell means it's a wall and not walkable.

> You must abide by the following constraint:
>
> -   You can only move in the four cardinal directions, i.e., `up`, `right`, `down`, and `left`.

### Example 1

> -   **Input:** grid = \[\[1, 0, 1, 1\], \[1, 1, 1, 1\], \[0, 1, 0, 1\]\]
> -   **Output:** 5
> -   **Explanation:** As we can see from the diagram above, the minimum number of steps required to reach from the cell (0, 0) to the cell (2, 3) is 5.

### Example 2

> -   **Input:** grid = \[\[1, 1, 1, 1\], \[1, 1, 1, 1\], \[1, 1, 0, 1\]\]
> -   **Output:** 5
> -   **Explanation:** As we can see from the diagram above, the minimum number of steps required to reach from the cell (0, 0) to the cell (2, 3) is 5.

## Solution

```cpp
#include <queue>

using namespace std;

struct Cell {
    int row;
    int col;
    int steps;
};

class Solution {
public:
    bool isValidCell(vector<vector<int>> &grid, int row, int col) {
        return row >= 0 && row < grid.size() && col >= 0 &&
               col < grid[0].size() && grid[row][col] == 1;
    }

    int minimumStepsInAGrid(vector<vector<int>> &grid) {
        int rows = grid.size();
        int cols = grid[0].size();

        // Create a visited matrix to keep track of visited cells
        vector<vector<bool>> visited(rows, vector<bool>(cols, false));

        // Create a queue for BFS traversal
        queue<Cell> queue;
        queue.push({0, 0, 0});
        visited[0][0] = true;

        // Define the possible movements: up, right, down, left
        vector<pair<int, int>> directions = {
            {-1, 0}, // up
            {0, 1},  // right
            {1, 0},  // down
            {0, -1}  // left
        };

        while (!queue.empty()) {
            Cell currCell = queue.front();
            queue.pop();

            int currRow = currCell.row;
            int currCol = currCell.col;
            int currSteps = currCell.steps;

            // Check if reached the destination cell
            if (currRow == rows - 1 && currCol == cols - 1) {
                return currSteps;
            }

            // Explore the neighbours
            for (const auto& dir : directions) {
                int newRow = currRow + dir.first;
                int newCol = currCol + dir.second;

                // Check if the new cell is within the grid boundaries
                // and contains 1
                if (isValidCell(grid, newRow, newCol)) {

                    // Check if the new cell has not been visited before
                    if (!visited[newRow][newCol]) {

                        // Add the new cell to the queue
                        queue.push({newRow, newCol, currSteps + 1});

                        // Mark the new cell as visited
                        visited[newRow][newCol] = true;
                    }
                }
            }
        }

        // No path found
        return -1;
    }
};
```

***

# Nearest distance

## Problem Statement

Given an **NxM** **grid** filled with values that are either `0`, or `1`, write a function to find and return the nearest distance of `1` from each cell. 

The distance is calculated as `|row1 - row2| + |col1 - col2|`, where `row1`, `col1` are the row number and column number of the current cell and `row2`, `col2` are the row number and column number of the nearest cell having the value `1`

> You must abide by the following constraint:
>
> -   You can only move in the four cardinal directions, i.e., `up`, `right`, `down`, and `left`.

### Example 1

> -   **Input:** grid = \[\[0, 0, 0, 0\], \[0, 0, 1, 0\], \[0, 0, 0, 0\], \[0, 0, 0, 0\]\]
> -   **Output:** \[\[3, 2, 1, 2\], \[2, 1, 0, 1\], \[3, 2, 1, 2\], \[4, 3, 2, 3\]\]
> -   **Explanation:** Above is the minimum distance of each cell from the nearest 1.

### Example 2

> -   **Input:** grid = \[\[1, 0, 0\], \[0, 1, 0\], \[0, 0, 0\]\]
> -   **Output:** \[\[0, 1, 2\], \[1, 0, 1\], \[2, 1, 2\]\]
> -   **Explanation:** Above is the minimum distance of each cell from the nearest 1.

## Solution

```cpp
#include <climits>
#include <queue>

using namespace std;

struct Cell {
    int row;
    int col;
    int distance;
};

class Solution {
public:
    bool isValidCell(int row, int col, int rows, int cols) {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    }

    vector<vector<int>> nearestDistance(vector<vector<int>> &grid) {
        int rows = grid.size();
        int cols = grid[0].size();

        // Create a result matrix to store the nearest distances
        vector<vector<int>> result(rows, vector<int>(cols, INT_MAX));

        // Create a queue for BFS traversal
        queue<Cell> queue;

        // Enqueue all the cells with value 1 and initialize their
        // distance as 0
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                if (grid[row][col] == 1) {
                    queue.push({row, col, 0});
                    result[row][col] = 0;
                }
            }
        }

        // Define the possible movements: up, right, down, left
        vector<pair<int, int>> directions = {
            {-1, 0}, // up
            {0, 1},  // right
            {1, 0},  // down
            {0, -1}  // left
        };

        while (!queue.empty()) {
            Cell currCell = queue.front();
            queue.pop();

            int currRow = currCell.row;
            int currCol = currCell.col;
            int currDistance = currCell.distance;

            // Explore the neighbours
            for (const auto& dir : directions) {
                int newRow = currRow + dir.first;
                int newCol = currCol + dir.second;

                // Check if the new cell is within the grid boundaries 
                // and has a greater distance than the current distance
                if (isValidCell(newRow, newCol, rows, cols) &&
                    currDistance + 1 < result[newRow][newCol]) {
                    // Update the distance for the new cell
                    result[newRow][newCol] = currDistance + 1;

                    // Add the new cell to the queue
                    queue.push({newRow, newCol, currDistance + 1});
                }
            }
        }

        return result;
    }
};
```

***

# Shortest word transformation

## Problem Statement

Given two words, **source**, **target**, and a dictionary **wordList**, write a function to find and return the number of words in the shortest transformation sequence from source to target, or `0` if no such sequence exists.

A transformation sequence from source to target using a dictionary wordList is a sequence of words `source -> s1 -> s2 -> s3 -> ..... -> target` that follows the rules below.

> You must abide by the following constraints:
>
> -   Every adjacent pair of words differs by a single letter.
> -   Every word involved in the sequence is in the `wordList`. The source does not need to be in the `wordList`.

### Example 1

> -   **Input:** source = hit, target = cog, wordList = \[hot, dot, dog, lot, log, cog\]
> -   **Output:** 5
> -   **Explanation:** The shortest transformation will have 5 words in the sequence to reach to cog from hit, these words are given below: hit -> hot -> dot -> dog -> cog

### Example 2

> -   **Input:** source = hit, target = mad, wordList = \[hot, dot, dog, lot, log, cog\]
> -   **Output:** 0
> -   **Explanation:** The transformation is not possible.

### Example 3

> -   **Input:** source = red, target = tax, wordList = \[tan, apple, banana, blue, rose\]
> -   **Output:** 0
> -   **Explanation:** The transformation is not possible.

## Solution

```cpp
#include <queue>
#include <unordered_set>

using namespace std;

class Solution {
public:
    int shortestWordTransformation(
        string source,
        string target,
        vector<string> &wordList
    ) {

        // Create a set to store the words for efficient lookup
        unordered_set<string> wordSet(wordList.begin(), wordList.end());

        // If the target word is not in the word set, return 0
        if (wordSet.find(target) == wordSet.end()) {
            return 0;
        }

        // Create a queue for BFS traversal
        queue<string> queue;
        queue.push(source);

        // Create a visited set to keep track of visited words
        unordered_set<string> visited;
        visited.insert(source);

        // Starting level is 1 (source word is at level 1)
        int level = 1;

        while (!queue.empty()) {
            int levelSize = queue.size();

            // Traverse all words at the current level
            for (int i = 0; i < levelSize; ++i) {
                string currentWord = queue.front();
                queue.pop();

                // Check if the current word matches the target
                if (currentWord == target) {
                    return level;
                }

                // Generate all possible adjacent words
                for (int j = 0; j < currentWord.length(); ++j) {

                    // Save original character to restore later
                    char originalChar = currentWord[j];
                    for (char ch = 'a'; ch <= 'z'; ++ch) {

                        // Skip if the character is the same as the
                        // original
                        if (ch == originalChar) {
                            continue;
                        }

                        // Change the character at position j
                        currentWord[j] = ch;

                        // Check if the new word is in the word set and
                        // has not been visited
                        if (wordSet.find(currentWord) != wordSet.end() &&
                            visited.find(currentWord) == visited.end()) {
                            queue.push(currentWord);
                            visited.insert(currentWord);
                        }
                    }

                    // Restore the original character to avoid changing
                    // other positions
                    currentWord[j] = originalChar;
                }
            }

            // Increment the level after traversing all words at the
            // current level
            level++;
        }

        // No transformation sequence exists, return 0
        return 0;
    }
};
```

***

# Minimum steps in a grid II

## Problem Statement

Given an **NxM** **grid** filled with values of either `0`, or `1` and a non-negative integer **k**, write a function to find and return the minimum number of steps required to reach the cell `(N-1, M-1)` from the cell `(0, 0)`. If there is no valid path, return `-1` instead.

You can convert at most **k** non-walkable cells to walkable cells.

> -   A value of `1` in a cell means it's walkable.
> -   A value of `0` in a cell means it's a wall and not walkable.

> You must abide by the following constraint:
>
> -   You can only move in the four cardinal directions, i.e., `up`, `right`, `down`, and `left`.

### Example 1

> -   **Input:** grid = \[\[1, 0, 1, 1\], \[0, 1, 1, 1\], \[0, 1, 0, 1\]\], k = 1
> -   **Output:** 5
> -   **Explanation:** As we can see from the diagram above, the minimum number of steps required to reach from the cell (0, 0) to the cell (2, 3) is 5. We need to remove the wall at position (1, 0).

### Example 2

> -   **Input:** grid = \[\[1, 0, 0, 0\], \[0, 0, 0, 0\], \[0, 0, 0, 1\]\], k = 5
> -   **Output:** 5
> -   **Explanation:** As we can see from the diagram above, the minimum number of steps required to reach from the cell (0, 0) to the cell (2, 3) is 5. We need to remove 4 walls.

## Solution

```cpp
#include <queue>

using namespace std;

struct Cell {
    int row;
    int col;
    int steps;
    int wallsLeft;
};

class Solution {
public:
    bool isValidCell(int row, int col, int rows, int cols) {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    }

    int minimumStepsInAGridII(vector<vector<int>> &grid, int k) {
        int rows = grid.size();
        int cols = grid[0].size();

        // Create a visited grid to keep track of visited cells
        vector<vector<vector<bool>>> visited(
            rows, vector<vector<bool>>(cols, vector<bool>(k + 1, false))
        );

        // Create a queue for BFS traversal
        queue<Cell> queue;
        queue.push({0, 0, 0, k});
        visited[0][0][k] = true;

        // Define the possible movements: up, right, down, left
        vector<pair<int, int>> directions = {
            {-1, 0}, // up
            {0, 1},  // right
            {1, 0},  // down
            {0, -1}  // left
        };

        while (!queue.empty()) {
            Cell currCell = queue.front();
            queue.pop();

            int currRow = currCell.row;
            int currCol = currCell.col;
            int currSteps = currCell.steps;
            int currWallsLeft = currCell.wallsLeft;

            // Check if reached the destination
            if (currRow == rows - 1 && currCol == cols - 1) {
                return currSteps;
            }

            // Explore the neighbours
            for (const auto& dir : directions) {
                int newRow = currRow + dir.first;
                int newCol = currCol + dir.second;

                // Check if the new cell is within the grid boundaries
                if (isValidCell(newRow, newCol, rows, cols)) {
                    int newWallsLeft = currWallsLeft;

                    // If the current cell is a wall, try to remove it
                    if (grid[newRow][newCol] == 0) {
                        newWallsLeft--;
                    }

                    // If we have walls left to remove and haven't
                    // visited this state
                    if (newWallsLeft >= 0 &&
                        !visited[newRow][newCol][newWallsLeft]) {

                        // Add the new cell to the queue
                        queue.push(
                            {newRow, newCol, currSteps + 1, newWallsLeft}
                        );

                        // Mark the new cell as visited
                        visited[newRow][newCol][newWallsLeft] = true;
                    }
                }
            }
        }

        // No path found
        return -1;
    }
};
```
