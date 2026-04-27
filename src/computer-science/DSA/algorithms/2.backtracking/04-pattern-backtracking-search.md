# Understanding the search pattern

Backtracking is the ultimate brute-force search technique for exploring the entire problem space and finding solution states. In some cases, there may be many solution states, but we only need to find one. We start from an initial problem state and, at each step, choose from a set of available choices to move to another state, eventually exploring the entire problem space. Every time we move to a new state, we determine its validity and if it is a solution state by validating it against some constraints. As soon as we reach a solution state, we halt further exploration and return it as the solution to the problem.

It is essential to note that any choice we make at a step may be either independent or dependent on the choices we made earlier.

The search pattern is the classification of problems that can be solved using backtracking to search for solution states in a problem space.

// Diagram: The state-space tree for the backtracking search problem.

In this course, we will learn more about the backtracking search technique and how to identify a problem as a backtracking search pattern problem.

## Searching using backtracking

Consider the state space tree below, where we have an initial problem state and `k` dependent choices that we can make at each step. The depth of the problem space is denoted by `n`, which is the maximum number of choices we must make to reach a solution state.

At every step, making a different choice may lead to completely different solution states in the end. We recursively make a series of choices until we reach a solution state. Once we reach a solution state, we terminate the search and return it as the solution, and so, we don't need to explore the entire problem space.

Note that each step may have a different number of choices, and those choices may be independent or dependent on previously made choices. We only show `k` choices in the state space tree below to make it simpler and easier to understand.

// Diagram: Initial state

We create a state variable `state` to record the outcome of choices we make to reach a solution state, starting from the initial state, using some function `f`. At each step, we check if the current step is a solution state. If it is a solution state, we store the `state` variable in a `solution` container and terminate further search.

We also create another variable `control` that captures the effect of the previously made choices on subsequent choices using some function `g`. It is used at every step to determine the available choices to move to the next step. This way, each step accounts for the choices made in previous steps when computing the set of choices it can make to proceed.

Search for a solution state starting from a problem state.

The goal of the search problem is to find **any** solution state that can be reached by making any valid set of choices from the initial state. In the above example, we did not have to backtrack as we reached the solution state 

As we will see later, we also usually have functions `fInverse` and `gInverse` to remove the contribution of the **last** choice made from `state` and `control` respectively. We use them to undo previous choices and make new, different choices when we have no further choices left to move on from a step.

In this example, we collect the series of choices that lead from the problem state to a solution state using the function `f`; we could similarly collect and store the solution state instead.

We backtrack and undo previously made choices using fInverse and gInverse if we reach a dead end.

It is important to note that some series of choices may reach a solution state earlier than others, and so the order of making the choices matters in most cases. The goal of the search problem is to find any solution state, and so we terminate further exploration when we find a solution state.

// Diagram: The order of making choices matters at all levels, as some series of choices may reach a solution state earlier than others.

### The search problem

Consider an example where the problem space is represented by an integer `n` , and we start from the initial problem state with some default values of the `state` and `control` variables. We can make multiple choices, denoted by an integer `choice` at every step, to reduce the problem space, and we update the `state` variable with those choices as we make them. The goal is to find **any** solution state and the sequence of choices that lead to it, starting from the initial problem state.

We have the following functions that we can use.

-   `getChoices ( control, n )` - Takes as an input the `control` variable and the current problem space `n` and returns a list of choices we can make.
-   `makeChoice (state, choice)` - Takes as input the state variable `state` and a `choice` from the list of available choices and adds the contribution of `choice` to `state`.
-   `updateControl (control, choice)` - Takes as input the current problem space `n`, reference to the variable `control` and the `choice` we decide to make and adds the contribution of `choice` to `control`.
-   `revertLastChoiceFromState (state)` - Takes as input the variable `state` and reverts the contribution of the last choice that was made from it.
-   `revertLastChoiceFromControl (control)` - Takes as input the variable `control` and reverts the contribution of the last choice that was made from it.
-   `getReducedProblemSpace (n, choice)` - Takes as input the current problem space `n` and the `choice` we decide to make, and returns a value denoting the reduced problem space.
-   `isSolutionState (n)` - Takes as input the current problem space `n` and returns true if it is a solution.

Note how the `getChoices` function depend not only on the current problem space, but also on the `control` variable that accounts for the previously made choices.

Note that this is the generic search problem. Most of these functions and their definitions are very problem-specific. For example, in some problems, the `control` variable may be a primitive type and need not be shared across recursive calls; we can use local copies. In that case, the `updateControl` function would return a new copy of the updated control variable instead of updating the shared copy, and there would be no `revertLastChoiceFromControl` function.

We will only learn about the generic search problem and its solution in this lesson. All the more specific cases of this problem can be solved using slightly modified, easier implementations of the generic solution.

### The search technique

To solve this problem, we create a recursive function `search` that takes as input the integer `n` denoting the problem space, a reference to the state variable `state`, a `control` variable accounting for the previously made choices, and a reference to a variable `solution` to the solution state. We initialize `state` and `control` to default values and `solution` to a sentinel value in the calling function and pass them as reference arguments to the function `search` along with the input `n`.

As we enter the function, we check if the current step is a solution state using `isSolutionState`. If the current step is a solution state, we set the value of `solution` to `state` and return to the caller.

If the current state is not a solution state, we use the function `getChoices` passing it the variables `n` and `control` to get a list of all the choices we can make to reduce the problem space. We then iterate through the list of all choices, using a variable `choice`, and in each iteration, simulate making that choice by adding its contribution to `state` using `makeChoice` and updating the `control` variable using the `updateControl` function that accounts for this choice. We then use the function `getReducedProblemSpace` passing it `n` and the `choice` to get the reduced problem space in a variable `reducedProblemSpace`. 

We then recursively call the `search` function with `reducedProblemSpace`, the updated `state` and the updated `control`. The same process is repeated recursively until it reaches a solution state, where we set the current value of `state` to `solution`. When a recursive call ends and control goes back to the caller, we revert the last choice made using `revertLastChoiceFromState` and `revertLastChoiceFromControl` on `state` and `control` variables respectively. We then check if the `solution` still has the sentinel value it was initialised with. 

If yes, it means we have not found the solution, and so, we continue the iteration to make the next choice in exactly the same way. On the other hand, if `solution` does not have the sentinel value, it means a solution state was found, and we should terminate further search. In this case, we return to the caller.

Since we call `revertLastChoiceFromState` and `revertLstChoiceFromControl` after returning from **every** recursive call, it is guaranteed that the choice made before making a recursive call is the one that is reverted after returning from it.

This way, we simulate making a choice at every step until we reach a solution state, aggregate the consequences of all those choices in `state`, and add the final value of `state` (outcome) to `solution`. We also undo the choices in the same order they were made, so that backtracking to make different choices next time works the same way.

When all the recursive calls end, control is passed back to the caller of `search`, the solution variable holds the solution to the problem if it exists; otherwise, it holds the sentinel value it was initialized with.

Consider the example below, where we start from an initial problem state and search for a solution state using recursive function calls.

// Diagram: Search for a solution state starting from an initial state

## Algorithm

The algorithm given below outlines the generic search technique, making use of the functions `reduceInput`, `getChoices`, `makeChoice`, `updateControl`, `revertLastChoiceFromState`, `revertLastChoiceFromControl` and `isSolutionState`. All these functions and their implementations are problem-dependent.

All these functions and their implementations are highly problem-dependent, but the overall structure of the algorithm remains the same.

We also create a calling function that initializes the variables `state`, `control`, `choices`, and `solution` with default and sentinel values, and makes the top-level recursive call.

> **search(n, \[ref\] control, \[ref\] state, \[ref\] solution)**
>
> -   **Step 1:** Call `isSolutionState(n, state)` to check if it is a solution state.
>     -   **Step 1.1:** If true, set `solution` = `state`
>     -   **Step 1.2:** Return to the caller
> -   **Step 2:** Set `choices` = Call `getChoices(n, control)` to get all choices available at this step.
> -   **Step 3:** Iterate over `choices` using a variable `choice` and do the following:
>     -   **Step 3.1:** Call `makeChoice(state, choice)` to add the contribution of `choice` to the `state` variable
>     -   **Step 3.2:** Call `updateControl(n, control, choice)` to update the control variable based on the current choice and input `n`
>     -   **Step 3.3:** Set `reducedProblemSpace` = Call `getReducedProblemSpace(n, choice)` to obtain the reduced problem space for the next recursive call
>     -   **Step 3.4:** Call `search(reducedProblemSpace, control, state, solution)`
>     -   **Step 3.5:** Call `revertLastChoiceFromControl(control)` to revert the contribution of the last choice from the control variable
>     -   **Step 3.6:** Call `revertLastChoiceFromState(state)` to revert the contribution of the last choice from the state variable
>     -   **Step 3.7:** If `solution` does not have the sentinel value, return to the caller, otherwise go to the next steps
> -   **Step 4:** Return to the caller
>
> **callingFunction(n)**
>
> -   **Step 1:** Create a variable `state` and initialize it to a default value
> -   **Step 2:** Create a variable `control` and initialize it to a default value
> -   **Step 3:** Create a variable `solution` and initialize it with some sentinel value
> -   **Step 4:** Call `search(n, control, state, solution)`
> -   **Step 5:** Return `solution`

## Implementation

To implement the search technique using backtracking, we create a calling function that initialises the variables `state`, `control`, `choices`, and `solution` and makes the top-level recursive calls. For languages that do not support passing values by reference, we can create the state variables in the enclosing scope to share them across recursive calls.

Given below is a generic implementation of the backtracking search technique, with the functions `isSolutionState`, `getChoices` and `getReducedProblemSpace` having some stub implementation.

// Diagram: Loading code editor

## Complexity Analysis

The search technique using backtracking uses multiple recursion at every step as it simulates making all available choices. Hence, it has an exponential time complexity that depends on the depth of recursion and the branching factor.

If we assume that the functions functions `isSolutionState`, `getReducedProblemSpace`, `getChoices`, `makeChoice`, `updatecontrol`, `revertLastChoiceFromState`, and `revertLastChoiceFromControl` all take constant **O(1)** time, and the input **N** is reduced linearly in every step, the depth of recursion will also be linear **O(N)**.

// Diagram: If the input is reduced linearly at each step, the depth of recursion is the same as the size of the input N.

In the worst case, however, there may be no solution states. In that case, the entire state space tree will be traversed, making all possible choices starting from the problem state and all intermediary states. For the generic search problem, the number of choices at every step is generally dynamic and dependent on the previously made choices. If we assume that there are total of `k` choices to choose from at every step, and every solution state is at a depth **N**, the overall time complexity would be **O(N^k)**.

// Diagram: Depth of recursion

Since we only need to find a single solution state for the problem and not enumerate all the solution states, the algorithm terminates further search once it reaches a solution state. Also, since solution states can exist at different depths in the state space tree, in the best case, the first choice from the initial state may lead to a solution state. And so, the best-case time complexity is **O(1)**.

// Diagram: In the best cases, a solution state may be found by making the first choice.

Assuming that the variable `state` takes constant **O(1)** space at all times, since we only create constant **O(1)** sized local variables in every recursive call. In the best case, if we find the solution state as the first choice from the initial state, the total space needed will be constant **O(1)**. However, in the worst case, if no solution state exists, the depth of recursion will be **O(N)**, leading to a space complexity of **O(N)**.

> **Best Case:** We reach a solution state by making the first choice.
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(1)**
>
> **Worst Case:** No solution state exists.
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N^k)**

***

# Identifying the backtracking search pattern

Backtracking is a powerful technique that emulates brute-force solutions to solve a wide range of problems. Most problems that can be solved using the backtracking search technique are medium or hard problems for which no other optimised solutions exist. We define an initial problem state and make a set of choices to explore the entire problem space and search for a solution. We terminate the search and return the solution state along with the path from the initial problem state as soon as a solution is found.

If the problem statement or its solution follows the generic template below, it can be solved using backtracking search.

**Template:**Given an initial problem state, find **any** solution state that can be reached from it by making a set of choices at each step. Optionally, find the sequence of choices that leads to the solution state from the initial problem state.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using backtracking search.

> **Problem statement:** Given a 2D integer maze of size `N \* M` with walkable space denoted by `0` and obstacles denoted by `1`. Find if a rat can reach the cell (N-1, M-1) if it is placed at `(0, 0)`. The rat can move in four directions
>
> 1.  Up - U
> 2.  Down - D
> 3.  Left - L
> 4.  Right - R
>
> If the rat can reach `(N-1, M-1)`, also return a string denoting the path it must take.

// Diagram: Find the path from (0,0) to (2, 2).

## The backtracking search solution

Closely observing the problem, we can identify the brute force way to find a path from `(0, 0)` to `(N-1, M-1)` . We start from `(0, 0)` and depending on the `maze` and the placement of 0s and 1s, we have two choices: either to move down `D` or right `R`.

Every time we move to a new cell, depending on our current location, the placement of 0s and 1s in the `maze` and the path we traced from (0, 0), we may have multiple choices:

-   We can go up `U`
-   We can go down `D`
-   We can go right `R`
-   We can go left `L`

// Diagram: We can make 4 choices at each step.

This process is repeated recursively until we have no more choices left, which is when we backtrack and update our choices. If during exploration we ever reach `(N-1, M-1)` ,we terminate further execution as we found a solution.

Throughout the traversal, we can keep track of the choices (directions we move) we make in a string that serves as the path to the solution when we reach the solution state.

It is important to note that choices at every step depend on the previously made choices (we cannot go back in the direction we came from)

// Diagram: Recursively make all available choices at each step to find a solution state.

It is clear from the above what the initial problem state (rat at `(0, 0)`) is, and the choices we can make to reduce the problem space and find a solution state. We also need to keep track of the choices we make at each step to get the path from the initial problem state `(0, 0)` to the solution state `(N-1, M-1)`. The problem description and the solution fit the template description for the backtracking search pattern we learned earlier.

**Template:**Given an initial problem state (rat at `(0, 0)`), find any solution state (rat at `(N-1, M-1)`) that can be reached from it by making a set of choices (`U`, `D`, `L`, `R`) at each step. Optionally, also find the path from the initial problem state to the solution state.

We create a recursive function `search` that takes as input the `maze`, the current coordinates of the rat `row` and `col` and a reference to a string `currentPath` that keeps track of the choices we make from the initial problem state `(0, 0)` to reach the current state `(row, col)`. The function `search` recursively makes all the possible choices and explores all paths, starting from `(0, 0)` and searches for a path to `(N-1, M-1)`.

In the calling function, we initialize two strings `currentPath` and `solution` to empty strings that will hold the path as we make choices, starting from the initial problem state and the path leading to the solution state when it is found, respectively. We then pass the `maze`, `currentPath` and `solution` result as references to the `search` function along with the starting coordinates (0, 0) as `row` and `column`. This makes up the initial problem state.

As we enter the `search` function, we check if a solution has already been found by checking the `solution` string. If it is not an empty string, it means a solution has been found, and we terminate further execution by returning to the caller.

If a solution has not been found yet, we check if the current state is a solution state by checking if `(row, column)` is `(N-1, M-1)`. We can get the values of `M` and `N` from the 2D array `maze`. If we are at a solution state, we set `solution` to `currentPath` and terminate further execution by returning to the caller.

If a solution has not been found and the current state is not a solution state, we can move ahead in four directions, `U`, `D`, `L` and `R`, if the corresponding cell in the respective direction is within the bounds of the `maze` and has a value of 0. However, before making any choice, we set the current cell in the `maze` to a sentinel value (-1) to mark it as visited, to ensure we don't revisit it in circles. 

Setting a sentinel value of -1 in the current cell in `maze` before making any choice prevents us from moving to this cell again from any other subsequent cell in the path by marking the current cell invalid (non 0). This is how the variable `maze` not only keeps track of the current state of the problem space in the state space tree but also acts as a `control` variable that determines choices at each step, accounting for the previously made choices.

We then loop over these four choices and, in each iteration, validate the cell in each direction. If it is a valid cell, we simulate moving in that direction by appending that direction to `currentPath` and making a recursive call to `search` with updated `(row, column)` values. When the recursive call ends, we pop the last character from `currentPath` to revert the last choice. We then check if the `solution` is empty. If yes, it means no solution has been found, and we continue iterating to make the next choices. Otherwise, we break out of the loop as a solution has been found, and we can terminate further search. This way, we choose to move in one direction at each step, then backtrack and update those choices to eventually move in all directions from every step.

At the end of all recursive calls, in the calling function, we check if the `solution` is empty. If it is empty, no solution state was found, so no solution exists. Otherwise, the result string represents the path from `(0, 0)` to `(N-1, M-1)`, which is the solution to the problem.

Find the path to (2, 2).

The implementation of the backtracking search solution to solve the problem is given below.

C++

```cpp
using namespace std;

class Solution {
public:

    // Direction list: (direction char, row change, col change)
    vector<tuple<char, int, int>> choices = {
        {'D',  1,  0},
        {'R',  0,  1},
        {'U', -1,  0},
        {'L',  0, -1}
    };

    void search(
        vector<vector<int>> &maze,
        int rows,
        int cols,
        int row,
        int col,
        string& currentPath,
        string& solution
    ) {

        // If we reached the destination (bottom-right corner of the
        // maze), update the solution with the current path and return
        if (row == rows - 1 && col == cols - 1) {
            solution = currentPath;
            return;
        }

        // Store the value of the current cell to mark it as visited
        int cellValue = maze[row][col];

        // Update the control variable by marking
        // the current cell as visited, to avoid revisiting it.
        // Since the update is same for all choices, we do it before making
        // any choice
        maze[row][col] = -1;

        // Explore all possible choices
        for (const auto& [dir, dx, dy] : choices) {
            int newRow = row + dx;
            int newCol = col + dy;

            if (newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols &&
                maze[newRow][newCol] == 0) {

                // Add the direction to path to make the choice
                currentPath += dir;

                // Recursively find a solution in the reduced problem space
                search(
                    maze,
                    rows,
                    cols,
                    newRow,
                    newCol,
                    currentPath,
                    solution
                );

                // Undo previously made choices
                currentPath.pop_back();

                // Terminate further search if a solution has been found
                if (!solution.empty()) {
                    maze[row][col] = cellValue;
                    break;
                }

        // Mark the current cell as unvisited to allow other paths to
        // explore it
        maze[row][col] = cellValue;

        // Return to explore other paths from previous recursive calls
        return;
    }

    string ratInAMaze(vector<vector<int>> &maze) {
        if (maze.empty() || maze[0].empty() || maze[0][0] == 1) {
            return "";
        }
        int rows = maze.size();
        int cols = maze[0].size();

        string currentPath = "";
        string solution = "";
        // Call the search function with initial position (0, 0) and
        // an empty path
        backtrack(maze, rows, cols, 0, 0, currentPath, solution);

        // Return the final path found, if any
        return solution;
    }
};
```

Java

```java
import java.util.ArrayList;
import java.util.List;

// Diagram: class Solution {

    // Create the shared variables in class scope
    String solution = "";
    StringBuilder currentPath = new StringBuilder();

    // Direction list: (direction char, row change, col change)
    // Each entry is: {direction, dx, dy}
    int[][] choices = {
            {'D',  1,  0},
            {'R',  0,  1},
            {'U', -1,  0},
            {'L',  0, -1}
    };

    void search(
            List<List<Integer>> maze,
            int rows,
            int cols,
            int row,
            int col
    ) {

        // If we reached the destination (bottom-right corner of the
        // maze), update the solution with the current path and return
        if (row == rows - 1 && col == cols - 1) {
            solution = currentPath.toString();
            return;
        }

        // Store the value of the current cell to mark it as visited
        int cellValue = maze.get(row).get(col);

        // Update the control variable by marking
        // the current cell as visited, to avoid revisiting it.
        // Since the update is same for all choices, we do it before making
        // any choice
        maze.get(row).set(col, -1);

        // Explore all possible choices
        for (int[] choice : choices) {
            char dir = (char) choice[0];
            int dx = choice[1];
            int dy = choice[2];

            int newRow = row + dx;
            int newCol = col + dy;

            if (newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols &&
                maze.get(newRow).get(newCol) == 0) {

                // Add the direction to path to make the choice
                currentPath.append(dir);

                // Recursively find a solution in the reduced problem space
                search(
                        maze,
                        rows,
                        cols,
                        newRow,
                        newCol
                );

                // Undo previously made choices
                currentPath.deleteCharAt(currentPath.length() - 1);

                // Terminate further search if a solution has been found
                if (!solution.isEmpty()) {
                    maze.get(row).set(col, cellValue);
                    break;
                }

        // Mark the current cell as unvisited to allow other paths to
        // explore it
        maze.get(row).set(col, cellValue);

        // Return to explore other paths from previous recursive calls
        return;
    }

    String ratInAMaze(List<List<Integer>> maze) {
        if (maze.isEmpty() || maze.get(0).isEmpty() || maze.get(0).get(0) == 1) {
            return "";
        }

        int rows = maze.size();
        int cols = maze.get(0).size();

        // Call the search function with initial position (0, 0) and
        // an empty path
        search(maze, rows, cols, 0, 0);

        // Return the final path found, if any
        return solution;
    }
```

Typescript

```typescript
class Solution {

  // Create the shared variables in class scope
  solution: string = "";
  currentPath: string = "";

  // Direction list: (direction char, row change, col change)
  choices: Array<[string, number, number]> = [
    ['D',  1,  0],
    ['R',  0,  1],
    ['U', -1,  0],
    ['L',  0, -1]
  ];

  search(
    maze: number[][],
    rows: number,
    cols: number,
    row: number,
    col: number
  ): void {

    // If we reached the destination (bottom-right corner of the
    // maze), update the solution with the current path and return
    if (row === rows - 1 && col === cols - 1) {
      this.solution = this.currentPath;
      return;
    }

    // Store the value of the current cell to mark it as visited
    const cellValue = maze[row][col];

    // Update the control variable by marking
    // the current cell as visited, to avoid revisiting it.
    // Since the update is same for all choices, we do it before making
    // any choice
    maze[row][col] = -1;

    // Explore all possible choices
    for (const [dir, dx, dy] of this.choices) {
      const newRow = row + dx;
      const newCol = col + dy;

      if (
        newRow >= 0 && newRow < rows &&
        newCol >= 0 && newCol < cols &&
        maze[newRow][newCol] === 0
      ) {

        // Add the direction to path to make the choice
        this.currentPath += dir;

        // Recursively find a solution in the reduced problem space
        this.search(
          maze,
          rows,
          cols,
          newRow,
          newCol
        );

        // Undo previously made choices
        this.currentPath = this.currentPath.slice(0, -1);

        // Terminate further search if a solution has been found
        if (this.solution.length > 0) {
          maze[row][col] = cellValue;
          break;
        }

    // Mark the current cell as unvisited to allow other paths to
    // explore it
    maze[row][col] = cellValue;

    // Return to explore other paths from previous recursive calls
    return;
  }

  ratInAMaze(maze: number[][]): string {
    if (maze.length === 0 || maze[0].length === 0 || maze[0][0] === 1) {
      return "";
    }

    const rows = maze.length;
    const cols = maze[0].length;

    // Call the search function with initial position (0, 0) and
    // an empty path
    this.search(maze, rows, cols, 0, 0);

    // Return the final path found, if any
    return this.solution;
  }
```

Javascript

```javascript
class Solution {

  // Create the shared variables in class scope
  solution = "";
  currentPath = "";

  // Direction list: (direction char, row change, col change)
  choices = [
    ['D',  1,  0],
    ['R',  0,  1],
    ['U', -1,  0],
    ['L',  0, -1]
  ];

  search(
    maze,
    rows,
    cols,
    row,
    col
  ) {

    // If we reached the destination (bottom-right corner of the
    // maze), update the solution with the current path and return
    if (row === rows - 1 && col === cols - 1) {
      this.solution = this.currentPath;
      return;
    }

    // Store the value of the current cell to mark it as visited
    const cellValue = maze[row][col];

    // Update the control variable by marking
    // the current cell as visited, to avoid revisiting it.
    // Since the update is same for all choices, we do it before making
    // any choice
    maze[row][col] = -1;

    // Explore all possible choices
    for (const [dir, dx, dy] of this.choices) {
      const newRow = row + dx;
      const newCol = col + dy;

      if (
        newRow >= 0 && newRow < rows &&
        newCol >= 0 && newCol < cols &&
        maze[newRow][newCol] === 0
      ) {

        // Add the direction to path to make the choice
        this.currentPath += dir;

        // Recursively find a solution in the reduced problem space
        this.search(
          maze,
          rows,
          cols,
          newRow,
          newCol
        );

        // Undo previously made choices
        this.currentPath = this.currentPath.slice(0, -1);

        // Terminate further search if a solution has been found
        if (this.solution.length > 0) {
          maze[row][col] = cellValue;
          break;
        }

    // Mark the current cell as unvisited to allow other paths to
    // explore it
    maze[row][col] = cellValue;

    // Return to explore other paths from previous recursive calls
    return;
  }

  ratInAMaze(maze) {
    if (!maze.length || !maze[0].length || maze[0][0] === 1) {
      return "";
    }

    const rows = maze.length;
    const cols = maze[0].length;

    // Call the search function with initial position (0, 0) and
    // an empty path
    this.search(maze, rows, cols, 0, 0);

    // Return the final path found, if any
    return this.solution;
  }
```

Python

```python
from typing import List, Tuple

class Solution:
    def __init__(self) -> None:
        # Create shared variables as instance variables
        # to share them across recursive calls
        self.solution: str = ""
        self.current_path: str = ""

        # Direction list: (direction char, row change, col change)
        self.choices: List[Tuple[str, int, int]] = [
            ('D',  1,  0),
            ('R',  0,  1),
            ('U', -1,  0),
            ('L',  0, -1)
        ]

    def search(
        self,
        maze: List[List[int]],
        rows: int,
        cols: int,
        row: int,
        col: int
    ) -> None:

        # If we reached the destination (bottom-right corner of the
        # maze), update the solution with the current path and return
        if row == rows - 1 and col == cols - 1:
            self.solution = self.current_path
            return

        # Store the value of the current cell to mark it as visited
        cell_value = maze[row][col]

        # Update the control variable by marking
        # the current cell as visited, to avoid revisiting it.
        # Since the update is same for all choices, we do it before making
        # any choice
        maze[row][col] = -1

        # Explore all possible choices
        for direction, dx, dy in self.choices:
            new_row = row + dx
            new_col = col + dy

            if (
                new_row >= 0 and new_row < rows and
                new_col >= 0 and new_col < cols and
                maze[new_row][new_col] == 0
            ):

                # Add the direction to path to make the choice
                self.current_path += direction

                # Recursively find a solution in the reduced problem space
                self.search(
                    maze,
                    rows,
                    cols,
                    new_row,
                    new_col
                )

                # Undo previously made choices
                self.current_path = self.current_path[:-1]

                # Terminate further search if a solution has been found
                if self.solution:
                    maze[row][col] = cell_value
                    break

        # Mark the current cell as unvisited to allow other paths to
        # explore it
        maze[row][col] = cell_value

        # Return to explore other paths from previous recursive calls
        return

    def rat_in_a_maze(self, maze: List[List[int]]) -> str:
        if not maze or not maze[0] or maze[0][0] == 1:
            return ""

        rows = len(maze)
        cols = len(maze[0])

        # Call the search function with initial position (0, 0) and
        # an empty path
        self.search(maze, rows, cols, 0, 0)

        # Return the final path found, if any
        return self.solution
```

.

## Example problems

Most problems that fall under this category are**medium**or **hard**problems; a list of a few is given below.

> -   **[Rat in a maze](https://www.codeintuition.io/courses/backtracking/G6WH8mkrcEVLpChdh2UZX)**
> -   **[Word quest](https://www.codeintuition.io/courses/backtracking/Jx2geD7obrIkWRMpKvooM)**
> -   **[Solve N queens](https://www.codeintuition.io/courses/backtracking/aOHZJV039vJZ88YrHpFmq)**
> -   **[Solve sudoku](https://www.codeintuition.io/courses/backtracking/x1cupNE3e76txSET4y8Iy)**

We will now solve these problems to gain a deeper understanding of the backtracking search pattern.

***

# Rat in a maze

## Problem Statement

Given a 2D integer **maze** of size **N** \* **M**with walkable space denoted by `0` and obstacles denoted by `1`. A rat is placed at index `(0, 0)`, and a function is written to find and return a string containing the path the rat can take to reach the destination at coordinates `(N - 1, M - 1)`. As multiple correct answers can exist, the judge will output `true` if your function returns one of the correct paths. Otherwise, it will output `false`.

The rat can move in the four directions given below. If there is no such path, return an empty string.

> -   U (up)
> -   D (down)
> -   L (left)
> -   R (right)

## Example

> -   **Input:** maze = \[\[0, 1, 1, 1\], \[0, 0, 1, 0\], \[0, 0, 1, 1\], \[1, 0, 0, 0\]\]
> -   **Output:** true
> -   **Explanation:** You can follow the path DDRDRR to reach the destination. There is also another path, DRDDRR, which is a valid answer.

## Solution

```cpp
#include <tuple>

using namespace std;

class Solution {
public:

    // Direction list: (direction char, row change, col change)
    vector<tuple<char, int, int>> choices = {
        {'D',  1,  0},
        {'R',  0,  1},
        {'U', -1,  0},
        {'L',  0, -1}
    };

    // Check if a cell is valid for movement
    bool isValid(
        vector<vector<int>> &maze,
        int rows,
        int cols,
        int row,
        int col
    ) {
        return row >= 0 && row < rows && col >= 0 && col < cols &&
               maze[row][col] == 0;
    }

    bool search(
        vector<vector<int>> &maze,
        int rows,
        int cols,
        int row,
        int col,
        string &path
    ) {

        // If we reached the destination (bottom-right corner of the
        // maze),
        if (row == rows - 1 && col == cols - 1) {

            // Valid path is now already stored in path
            return true;
        }

        // Store the value of the current cell to mark it as visited
        int cellValue = maze[row][col];

        // Mark the current cell as visited to avoid revisiting it
        maze[row][col] = -1;

        // Loop through all possible choices (directions)
        for (const auto &choice : choices) {
            char dir;
            int dx, dy;
            tie(dir, dx, dy) = choice;

            int newRow = row + dx;
            int newCol = col + dy;

            // Check if the new position can be visited
            if (isValid(maze, rows, cols, newRow, newCol)) {

                // Make choice: append direction to current path
                path.push_back(dir);

                // Recurse to explore further from the new cell
                if (search(maze, rows, cols, newRow, newCol, path)) {

                    // Unmake choice: mark the current cell as unvisited
                    maze[row][col] = cellValue;

                    // If a valid path is found, return true
                    return true;
                }

                // Unmake choice: remove the last added direction
                path.pop_back();
            }
        }

        // Unmake choice: mark the current cell as unvisited
        maze[row][col] = cellValue;

        // No path found from this cell, return false
        return false;
    }

    string ratInAMaze(vector<vector<int>> &maze) {
        if (maze.empty() || maze[0].empty() || maze[0][0] != 0) {
            return "";
        }

        int rows = maze.size();
        int cols = maze[0].size();

        // Current path (state)
        string path = "";

        // Start backtracking from the top-left corner (0,0)
        search(maze, rows, cols, 0, 0, path);

        // Return the found path
        return path;
    }
};
```

***

# Word quest

## Problem Statement

Given a 2D array **board** containing alphabets of the English language and a string called **word**. Write a function to check whether the word exists on the board. Return `true` if the word exists, or else return `false`. 

A word can be made from letters in cells next to each other, either up and down or left and right. The same letter cannot be used twice.

### Example

> -   **Input:** board = \[\[A, B, C, E\], \[S, F, C, S\], \[A, D, E, E\]\], word = ABCCED
> -   **Output:** true
> -   **Explanation:** The word exists on the board.

## Solution

```cpp
#include <tuple>

using namespace std;

class Solution {
public:

    // Directions list: (row change, col change)
    vector<tuple<int, int>> choices = {
        { 1,  0}, // Down
        {-1,  0}, // Up
        { 0,  1}, // Right
        { 0, -1}  // Left
    };

    // Check if moving to (row,col) is valid for the current character
    bool isValidMove(
        vector<vector<string>> &board,
        int row,
        int col,
        char target
    ) {

        // Check boundaries
        if (row < 0 || col < 0 || row >= board.size() ||
            col >= board[0].size()) {
            return false;
        }

        // Check if the cell matches the target character
        return board[row][col] == string(1, target);
    }

    // Recursive backtracking function
    bool searchWord(
        vector<vector<string>> &board,
        string &word,
        int index,
        int row,
        int col
    ) {

        // Base case: entire word matched (solution state)
        if (index == word.length()) {
            return true;
        }

        // Make choice: mark current cell as visited
        string originalChar = board[row][col];
        board[row][col] = "#";

        // Explore all possible choices
        for (auto &[dx, dy] : choices) {
            int newRow = row + dx;
            int newCol = col + dy;

            // Only recurse if this move is valid
            if (isValidMove(board, newRow, newCol, word[index])) {

                // Recurse to next character in word
                if (searchWord(board, word, index + 1, newRow, newCol)) {

                    // Unmake choice: restore original character
                    board[row][col] = originalChar;

                    // Early return: solution found
                    return true;
                }
            }
        }

        // Unmake choice: restore the original character to allow other
        // paths
        board[row][col] = originalChar;

        // Return false if word not found along this path
        return false;
    }

    bool wordQuest(vector<vector<string>> &board, string word) {
        int rows = board.size();
        int cols = board[0].size();

        // Start backtracking search from every cell on the board
        for (int row = 0; row < rows; ++row) {
            for (int col = 0; col < cols; ++col) {

                // Only start if the first character matches
                if (board[row][col] == string(1, word[0])) {

                    // Start recursive backtracking
                    if (searchWord(board, word, 1, row, col)) {
                        return true;
                    }
                }
            }
        }

        // No path leads to the word
        return false;
    }
};
```

***

# Solve N queens

## Problem Statement

Given a positive integer **n**, Write a function to find and return all possible distinct solutions of the n queen puzzle. Each solution should show a unique configuration of the queens' placement on the chessboard, where the letter `Q` represents a queen and `.` represents an empty space. You can return the answer in **any order**.

The n-queens puzzle involves placing **n** queens on an **n x n** chessboard so that no two queens can attack each other.

### Example

> -   **Input:** n = 4
> -   **Output:** \[\[.Q.., ...Q, Q..., ..Q.\], \[..Q., Q..., ...Q, .Q..\]\]
> -   **Explanation:** There exist two distinct solutions to the 4-queens puzzle, as shown above.

## Solution

```cpp
#include <algorithm>

using namespace std;

class Solution {
public:

    // Helper function to check if a queen can be safely placed at (row,
    // col)
    bool canPlaceQueen(vector<int> &queenPositions, int row, int col) {
        for (int i = 0; i < row; i++) {

            // Check for column conflict: no other queen should be in the
            // same column Check for diagonal conflict: no other queen
            // should be in the same diagonal
            if (queenPositions[i] == col ||
                row - i == abs(col - queenPositions[i])) {
                return false;
            }
        }
        return true;
    }

    // Helper function to convert the current state vector into a board
    // representation
    vector<string> makeSolution(vector<int> &queenPositions, int n) {

        // Create an n x n board initialized with '.'
        vector<string> board(n, string(n, '.'));

        // Place queens on the board based on the state vector
        for (int i = 0; i < n; i++) {
            board[i][queenPositions[i]] = 'Q';
        }

        // Return the board representation
        return board;
    }

    void searchSolutions(
        vector<int> &queenPositions,
        int row,
        int n,
        vector<vector<string>> &solutions
    ) {

        // Check if all queens have been successfully placed
        if (row == n) {

            // Current state represents a valid solution, convert it to
            // board format and store
            solutions.push_back(makeSolution(queenPositions, n));

            // Stop searching further as we found a valid solution
            return;
        }

        // Loop through each column in the current row to try placing a
        // queen (all choices)
        for (int col = 0; col < n; col++) {

            // Check if placing a queen at (row, col) is safe
            if (canPlaceQueen(queenPositions, row, col)) {

                // Place the queen in the current row at column col (make
                // choice)
                queenPositions[row] = col;

                // Recursively try to place queens in the next row
                searchSolutions(queenPositions, row + 1, n, solutions);

                // Remove the queen from the current row to backtrack and
                // try the next column (revert choice)
                queenPositions[row] = -1;
            }
        }
    }

    vector<vector<string>> solveNQueens(int n) {

        // Vector to store all valid board configurations (solution
        // states)
        vector<vector<string>> solutions;

        // State vector: queenPositions[i] stores the column index of the
        // queen placed in row i
        vector<int> queenPositions(n, -1);

        // Start the search process from the first row (row 0)
        searchSolutions(queenPositions, 0, n, solutions);

        // Return all valid solutions found
        return solutions;
    }
};
```

***

# Solve sudoku

## Problem Statement

Given a `9X9` 2D array **board** representing a partially filled Sudoku puzzle, write a function to return the solution for the puzzle by filling the empty cells. A valid solution to the Sudoku puzzle must abide by the following rules:

> -   Each digit from `1` to `9` must appear exactly once in each row.
> -   Each digit from `1` to `9` must appear exactly once in each column.
> -   Each digit from `1` to `9` must appear exactly once in each of the `9` `3x3` sub-boxes of the grid.

Note that in the input puzzle, the character `X` represents an empty cell.

### Example

> -   **Input:** board = \[\[5, 3, X, X, 7, X, X, X, X\], \[6, X, X, 1, 9, 5, X, X, X\], \[X, 9, 8, X, X, X, X, 6, X\], \[8, X, X, X, 6, X, X, X, 3\], \[4, X, X, 8, X, 3, X, X, 1\], \[7, X, X, X, 2, X, X, X, 6\], \[X, 6, X, X, X, X, 2, 8, X\], \[X, X, X, 4, 1, 9, X, X, 5\], \[X, X, X, X, 8, X, X, 7, 9\]\]
> -   **Output:** \[\[5, 3, 4, 6, 7, 8, 9, 1, 2\], \[6, 7, 2, 1, 9, 5, 3, 4, 8\], \[1, 9, 8, 3, 4, 2, 5, 6, 7\], \[8, 5, 9, 7, 6, 1, 4, 2, 3\], \[4, 2, 6, 8, 5, 3, 7, 9, 1\], \[7, 1, 3, 9, 2, 4, 8, 5, 6\], \[9, 6, 1, 5, 3, 7, 2, 8, 4\], \[2, 8, 7, 4, 1, 9, 6, 3, 5\], \[3, 4, 5, 2, 8, 6, 1, 7, 9\]\]
> -   **Explanation:** Above is the only valid solution for this puzzle.

## Solution

```cpp
using namespace std;

class Solution {
public:

    // Checks if placing 'num' in the specified row is valid
    bool isValidRow(vector<vector<string>> &board, int row, string num) {
        for (int col = 0; col < 9; col++) {
            if (board[row][col] == num) {
                return false;
            }
        }
        return true;
    }

    // Checks if placing 'num' in the specified column is valid
    bool isValidCol(vector<vector<string>> &board, int col, string num) {
        for (int row = 0; row < 9; row++) {
            if (board[row][col] == num) {
                return false;
            }
        }
        return true;
    }

    // Checks if placing 'num' in the 3x3 sub-grid containing (row, col)
    // is valid
    bool isValidSubGrid(
        vector<vector<string>> &board,
        int row,
        int col,
        string num
    ) {
        int startRow = (row / 3) * 3;
        int startCol = (col / 3) * 3;
        for (int r = startRow; r < startRow + 3; r++) {
            for (int c = startCol; c < startCol + 3; c++) {
                if (board[r][c] == num)
                    return false;
            }
        }
        return true;
    }

    // Checks if placing 'num' at (row, col) is valid in all respects
    bool isValidPlacement(
        vector<vector<string>> &board,
        int row,
        int col,
        string num
    ) {

        // Check row, column, and sub-grid constraints
        return isValidRow(board, row, num) &&
               isValidCol(board, col, num) &&
               isValidSubGrid(board, row, col, num);
    }

    // Recursive search function to fill the Sudoku board
    bool searchSolution(vector<vector<string>> &board) {

        // Iterate through each cell of the board
        for (int row = 0; row < 9; row++) {
            for (int col = 0; col < 9; col++) {

                // Only attempt to fill empty cells
                if (board[row][col] == "X") {

                    // Try all digits from "1" to "9" in this cell
                    for (string num = "1"; num <= "9"; num[0]++) {

                        // Check if placing the number is valid (solution
                        // state possible)
                        if (isValidPlacement(board, row, col, num)) {

                            // Place the number in the cell (make choice)
                            board[row][col] = num;

                            // Recursively attempt to fill the rest of
                            // the board
                            if (searchSolution(board)) {

                                // If successful, propagate success back
                                return true;
                            }

                            // If it did not lead to a solution, remove
                            // the number (revert choice)
                            board[row][col] = "X";
                        }
                    }

                    // If no valid number can be placed in this cell,
                    // backtrack
                    return false;
                }
            }
        }

        // If all cells are filled successfully, the board is solved
        return true;
    }

    void solveSudoku(vector<vector<string>> &board) {

        // Start the search process to fill the board
        searchSolution(board);
    }
};
```
