# Understanding the unconditional enumeration pattern

Many real-world problems may have multiple solutions, and to solve them, we may need to find and collect all the solutions. Backtracking is the ultimate brute-force technique to solve any problem that starts from an initial state, explores the entire problem space, and builds a solution incrementally. Unconditional enumeration is the most fundamental backtracking technique, which starts from an initial problem state, explores the entire problem space by making a independent set of choices from every state and collects the solution states and backtracks to make different choices.

It is important to note that any choice we make at a step is **independent** of any earlier choices; hence, we call this process **unconditional** enumeration.

The unconditional enumeration pattern is the classification of problems that can be solved using the unconditional enumeration backtracking technique.

The state space tree for unconditional enumeration is given below.

// Diagram: The state space tree for unconditional enumeration.

In this course, we will learn more about the unconditional-enumeration technique and how to identify a problem as an unconditional-enumeration pattern problem.

## Unconditional enumeration

In unconditional enumeration, we begin with an initial problem state defined by some state variables. At every step, we can make one of many **independent** choices to reduce the size of the problem and move to another state. This process of making choices at every step is repeated recursively until we reach a solution state. As we make these choices and move from one state to another, we incrementally build the solution in some state variable.

Consider the state space tree below, where we have an initial problem state and `k` choices that we can make at each step. The depth of the problem space is denoted by `n`, which is the number of choices we must make to reach a solution state. At every step, making a different choice may lead to completely different solution states in the end. We recursively make a series of choices until we reach a solution state, then backtrack to update our choices. In this way, we visit every solution state exactly once.

// Diagram: The state space tree for unconditional enumeration of depth n where we can make k choices at every step.

We maintain a shared container as we explore the problem space, and add a solution state to it when we reach it. This way, when the entire problem space is explored, the container contains an enumeration of all solution states.

// Diagram: A series of independent choices starting from a problem state, leading to a solution state.

We create a state variable `state` to record the outcome of choices we make to reach a solution state, starting from the initial state, using some function `f`. At each step, we check if the current step is a solution state. If it is a solution, we add it to an`enumerations`container.

The goal of the unconditional enumeration problem is to find**all** the solution states that can be reached by making any valid set of choices from the initial state. As we will see later, we also usually have functions `fInverse` and`gInverse`to remove the contribution of the **last** choice made from `state` and `control` respectively. We use them to undo previous choices and make new, different choices when we have no further choices left to move on from a step.

In this example, we enumerate the outcomes of a series of choices that lead from the problem state to a solution state using the function `f`; we could similarly enumerate and store all solution states instead.

Start from the initial problem state and add all the solution states to the enumerations list.

### The unconditional enumeration problem

Consider an example where the problem space is represented by an integer `n` , and we start from the initial problem state with some default values of the `state` variable. We can make multiple choices, denoted by an integer `choice` at every step, to reduce the problem space, and we update the `state` variable with those choices as we make them. The goal is to find **all** solution states and the sequence of choices that lead to them, starting from the initial problem state.

We have the following functions that we can use.

-   `getChoices ( n )` - Takes as an input the current problem space `n` and returns a list of choices we can make.
-   `makeChoice (state, choice)` - Takes as input the state variable `state` and a `choice` from the list of available choices and adds the contribution of `choice` to `state`.
-   `revertLastChoiceFromState (state)` - Takes as input the variable `state` and reverts the contribution of the last choice that was made from it.
-   `getReducedProblemSpace (n, choice)` - Takes as input the current problem space `n` and the `choice` we decide to make, and returns a value denoting the reduced problem space.
-   `isSolutionState (n)` - Takes as input the current problem space `n` and returns true if it is a solution.

Note how the `getChoices` function only depends on the current problem space and is independent of any previously made choices.

Note that this is the generic unconditional enumeration problem. Most of these functions and their definitions are very problem-specific.

We will only learn about the generic unconditional enumeration problem and its solution in this lesson. All the more specific cases of this problem can be solved using slightly modified, easier implementations of the generic solution.

### The unconditional enumeration technique

To solve this problem, we create a recursive function `unconditionalEnumeration` that takes as input the integer `n` denoting the problem space, a reference to the state variable `state` ,and a reference to a list `enumerations` to store all the solution states.

We initialize `state` to a default value and `enumerations` to an empty list in the calling function and pass them as reference arguments to the function `unconditionalEnumeration` along with the input `n`.

As we enter the function, we check if the current state is a solution state case using `isSolutionState`. If the current state is a solution state, we add the current value of  `state` to the list `enumerations` and return to the caller.

If the current state is not a solution state, we use the function `getReducedInput` to get the next input for the reduced problem space in a variable `reducedInput`. Next, we use the function `getChoices` to get a list of all the choices we can make to reduce the problem space. We then iterate through the list of all choices and in each iteration, simulate making that choice by adding its contribution to `state` using `makeChoice`. We then recursively call the same function with `reducedInput` and the updated `state`. The same process is repeated recursively after the function call until it reaches a solution state.

When the recursive call ends, we revert the last choice made using `revertLastChoice` on `state` and continue the iteration to make the next choice.

Since we call `revertLastChoice` after returning from **every** recursive call, it is guaranteed that the choice made before making the same recursive call is the one that is reverted.

This way, we simulate making a choice at every step until we reach a solution state, aggregate the consequences of all those choices in `state`, and add the final value of `state` (outcome) to the `enumerations`. We also undo the choices in the same order as they are made, as we backtrack to make different choices the next time in the same way.

When all the recursive calls end, control is passed back to the caller of `unconditionalEnumeration`, the `enumerations` list has the list of all outcomes from all choices, and the variable `state` is reverted to the default value with which it was initialized.

Consider the example below, where we start from an initial problem state and enumerate all solutions using recursive function calls.

Enumerate all solutions starting from an initial problem state.

## Algorithm

The algorithm given below outlines the generic unconditional-enumeration technique, making use of the functions `getReducedInput`, `getChoices`, `makeChoice`, `revertLastChoice`, and `isSolutionState`. All these functions and their implementations are problem-dependent.

We also create a calling function that initializes the state variables `state` and `enumerations` and passes them by reference to the top-level recursive call.

> **unconditionalEnumeration(n, \[ref\] state, \[ref\] enumerations)**
>
> -   **Step 1:** Call `isSolutionState(n, state)` to check if it is a solution state.
>     -   **Step 1.1:** If true, add `state` to `enumerations`
>     -   **Step 1.2:** Return to the caller
> -   **Step 2:** Set `choices` = Call `getChoices(n)` to get all choices available at this step.
> -   **Step 3:** Iterate over `choices` using a variable `choice` and do the following:
>     -   **Step 3.1:** Call `makeChoice(state, choice)` to add the contribution of `choice` to the `state` variable
>     -   **Step 3.2:** Set `reducedProblemSpace` = Call `getReducedProblemSpace(n, choice)` to obtain the reduced problem space for the next recursive call
>     -   **Step 3.3:** Call `unconditionalEnumeration(reducedProblemSpace, state, enumerations)`
>     -   **Step 3.4:** Call `revertLastChoiceFromState(state)` to revert the contribution of the last choice from the state variable
> -   **Step 4:** Return to the caller
>
> **callingFunction(n)**
>
> -   **Step 1:** Create a variable `state` and initialize it to a default value
> -   **Step 3:** Create an empty list `enumerations`
> -   **Step 4:** Call `unconditionalEnumeration(n, state, enumerations)`
> -   **Step 5:** Return `enumerations`

## Implementation

To implement the unconditional enumeration technique, we create a calling function that initialises the state variables `state` and `enumerations` and makes the top-level recursive calls. For languages that do not support passing values by recursion, we can create the state variables in the enclosing scope to share them across recursive calls.

Given below is a generic implementation of unconditional enumeration, with the functions `isSolutionState`, `getChoices` and `getReducedProblemSpace` having some stub implementation.

C++

```cpp
#include <vector>
using namespace std;

class Solution
{
public:
  void unconditionalEnumeration(
      int n,
      vector<int> &state,
      vector<vector<int>> &enumerations)
  {
    // Check if the current size of the problem space along with the state variable
    // represents a solution state
    if (isSolutionState(n, state))
    {
      // The state contains the aggregation of all choices made so far
      // and therefore represents a complete solution
      enumerations.push_back(state);
      return;
    }

    // Get all possible choices that can be made for the current input n
    vector<int> choices = getChoices(n);

    // Iterate through each available choice
    for (int choice : choices)
    {
      // Update the state variable by applying the current choice
      makeChoice(state, choice);

      // Reduce the problem space based on the current choice
      int reducedProblemSpace = getReducedProblemSpace(n, choice);

      // Recur on the reduced problem space
      unconditionalEnumeration(reducedProblemSpace, state, enumerations);

      // Revert the contribution of the last choice from state (backtracking)
      revertLastChoiceFromState(state);
    }

private:
  // Returns true if the current size of the problem space corresponds
  // to a solution state
  bool isSolutionState(int n, const vector<int> &state)
  {
    // Simple stub:
    // either the problem space is exhausted
    // or the state reached a fixed size
    return n == 0 || state.size() == 3;
  }

  // Generates all possible choices that can be made for the current input n
  vector<int> getChoices(int n)
  {
    int maxChoice = n;

    // Simple stub choices that clearly depend on n
    vector<int> choices;
    if (n >= 1)
      choices.push_back(1);
    if (n >= 2)
      choices.push_back(2);

    return choices;
  }

  // Updates the state variable by adding the contribution of the given choice
  void makeChoice(vector<int> &state, int choice)
  {
    state.push_back(choice);
  }

  // Reverts the contribution of the most recent choice from the state variable
  void revertLastChoiceFromState(vector<int> &state)
  {
    if (!state.empty())
      state.pop_back();
  }

  // Returns the reduced problem space for the next recursive call
  // based on the current input n and the choice
  int getReducedProblemSpace(int n, const int choice)
  {
    return n - choice;
  }
};
```

Java

```java
import java.util.ArrayList;
import java.util.List;

// Diagram: class Solution {

    public void unconditionalEnumeration(
            int n,
            List<Integer> state,
            List<List<Integer>> enumerations
    ) {
        // Check if the current size of the problem space along with the state variable
        // represents a solution state
        if (isSolutionState(n, state)) {
            // The state contains the aggregation of all choices made so far
            // and therefore represents a complete solution
            enumerations.add(new ArrayList<>(state));
            return;
        }

        // Get all possible choices that can be made for the current input n
        List<Integer> choices = getChoices(n);

        // Iterate through each available choice
        for (int choice : choices) {
            // Update the state variable by applying the current choice
            makeChoice(state, choice);

            // Reduce the problem space based on the current choice
            int reducedProblemSpace = getReducedProblemSpace(n, choice);

            // Recur on the reduced problem space
            unconditionalEnumeration(reducedProblemSpace, state, enumerations);

            // Revert the contribution of the last choice from state (backtracking)
            revertLastChoiceFromState(state);
        }

    // Returns true if the current size of the problem space corresponds
    // to a solution state
    private boolean isSolutionState(int n, List<Integer> state) {
        // Simple stub:
        // either the problem space is exhausted
        // or the state reached a fixed size
        return n == 0 || state.size() == 3;
    }

    // Generates all possible choices that can be made for the current input n
    private List<Integer> getChoices(int n) {
        // Simple stub choices that clearly depend on n
        List<Integer> choices = new ArrayList<>();
        if (n >= 1) choices.add(1);
        if (n >= 2) choices.add(2);
        return choices;
    }

    // Updates the state variable by adding the contribution of the given choice
    private void makeChoice(List<Integer> state, int choice) {
        state.add(choice);
    }

    // Reverts the contribution of the most recent choice from the state variable
    private void revertLastChoiceFromState(List<Integer> state) {
        if (!state.isEmpty()) {
            state.remove(state.size() - 1);
        }

    // Returns the reduced problem space for the next recursive call
    // based on the current input n and the choice
    private int getReducedProblemSpace(int n, int choice) {
        return n - choice;
    }

```

Typescript

```typescript
class Solution {
  unconditionalEnumeration(
    n: number,
    state: number[],
    enumerations: number[][]
  ): void {
    // Check if the current size of the problem space along with the state variable
    // represents a solution state
    if (this.isSolutionState(n, state)) {
      // The state contains the aggregation of all choices made so far
      // and therefore represents a complete solution
      enumerations.push([...state]);
      return;
    }

    // Get all possible choices that can be made for the current input n
    const choices: number[] = this.getChoices(n);

    // Iterate through each available choice
    for (const choice of choices) {
      // Update the state variable by applying the current choice
      this.makeChoice(state, choice);

      // Reduce the problem space based on the current choice
      const reducedProblemSpace = this.getReducedProblemSpace(n, choice);

      // Recur on the reduced problem space
      this.unconditionalEnumeration(reducedProblemSpace, state, enumerations);

      // Revert the contribution of the last choice from state (backtracking)
      this.revertLastChoiceFromState(state);
    }

  // Returns true if the current size of the problem space corresponds
  // to a solution state
  private isSolutionState(n: number, state: number[]): boolean {
    // Simple stub:
    // either the problem space is exhausted
    // or the state reached a fixed size
    return n === 0 || state.length === 3;
  }

  // Generates all possible choices that can be made for the current input n
  private getChoices(n: number): number[] {
    const choices: number[] = [];

    // Simple stub choices that clearly depend on n
    if (n >= 1) choices.push(1);
    if (n >= 2) choices.push(2);

    return choices;
  }

  // Updates the state variable by adding the contribution of the given choice
  private makeChoice(state: number[], choice: number): void {
    state.push(choice);
  }

  // Reverts the contribution of the most recent choice from the state variable
  private revertLastChoiceFromState(state: number[]): void {
    if (state.length > 0) state.pop();
  }

  // Returns the reduced problem space for the next recursive call
  // based on the current input n and the choice
  private getReducedProblemSpace(n: number, choice: number): number {
    return n - choice;
  }
```

Javascript

```javascript
class Solution {
  unconditionalEnumeration(
    n,
    state,
    enumerations
  ) {
    // Check if the current size of the problem space along with the state variable
    // represents a solution state
    if (this.isSolutionState(n, state)) {
      // The state contains the aggregation of all choices made so far
      // and therefore represents a complete solution
      enumerations.push([...state]);
      return;
    }

    // Get all possible choices that can be made for the current input n
    const choices = this.getChoices(n);

    // Iterate through each available choice
    for (const choice of choices) {
      // Update the state variable by applying the current choice
      this.makeChoice(state, choice);

      // Reduce the problem space based on the current choice
      const reducedProblemSpace = this.getReducedProblemSpace(n, choice);

      // Recur on the reduced problem space
      this.unconditionalEnumeration(reducedProblemSpace, state, enumerations);

      // Revert the contribution of the last choice from state (backtracking)
      this.revertLastChoiceFromState(state);
    }

  // Returns true if the current size of the problem space corresponds
  // to a solution state
  isSolutionState(n, state) {
    // Simple stub:
    // either the problem space is exhausted
    // or the state reached a fixed size
    return n === 0 || state.length === 3;
  }

  // Generates all possible choices that can be made for the current input n
  getChoices(n) {
    const choices = [];

    // Simple stub choices that clearly depend on n
    if (n >= 1) choices.push(1);
    if (n >= 2) choices.push(2);

    return choices;
  }

  // Updates the state variable by adding the contribution of the given choice
  makeChoice(state, choice) {
    state.push(choice);
  }

  // Reverts the contribution of the most recent choice from the state variable
  revertLastChoiceFromState(state) {
    if (state.length > 0) {
      state.pop();
    }

  // Returns the reduced problem space for the next recursive call
  // based on the current input n and the choice
  getReducedProblemSpace(n, choice) {
    return n - choice;
  }
```

Python

```python
from typing import List

class Solution:
    def unconditional_enumeration(
        self,
        n: int,
        state: List[int],
        enumerations: List[List[int]]
    ) -> None:
        # Check if the current size of the problem space along with the state variable
        # represents a solution state
        if self.is_solution_state(n, state):
            # The state contains the aggregation of all choices made so far
            # and therefore represents a complete solution
            enumerations.append(state.copy())
            return

        # Get all possible choices that can be made for the current input n
        choices: List[int] = self.get_choices(n)

        # Iterate through each available choice
        for choice in choices:
            # Update the state variable by applying the current choice
            self.make_choice(state, choice)

            # Reduce the problem space based on the current choice
            reduced_problem_space: int = self.get_reduced_problem_space(n, choice)

            # Recur on the reduced problem space
            self.unconditional_enumeration(reduced_problem_space, state, enumerations)

            # Revert the contribution of the last choice from state (backtracking)
            self.revert_last_choice_from_state(state)

    # Returns true if the current size of the problem space corresponds
    # to a solution state
    def is_solution_state(self, n: int, state: List[int]) -> bool:
        # Simple stub:
        # either the problem space is exhausted
        # or the state reached a fixed size
        return n == 0 or len(state) == 3

    # Generates all possible choices that can be made for the current input n
    def get_choices(self, n: int) -> List[int]:
        max_choice = n

        # Simple stub choices that clearly depend on n
        choices: List[int] = []
        if n >= 1:
            choices.append(1)
        if n >= 2:
            choices.append(2)

// Diagram: return choices

    # Updates the state variable by adding the contribution of the given choice
    def make_choice(self, state: List[int], choice: int) -> None:
        state.append(choice)

    # Reverts the contribution of the most recent choice from the state variable
    def revert_last_choice_from_state(self, state: List[int]) -> None:
        if state:
            state.pop()

    # Returns the reduced problem space for the next recursive call
    # based on the current input n and the choice
    def get_reduced_problem_space(self, n: int, choice: int) -> int:
        return n - choice
```

## Complexity Analysis

The unconditional enumeration technique uses multiple recursion at every step as it simulates making all available choices. Hence, it has an exponential time complexity that depends on the depth of recursion and the branching factor.

If we assume that the functions functions `isSolutionState`, `getReducedProblemSpace`, `getChoices`, `makeChoice`, `updatecontrol`, `revertLastChoiceFromState`, and `revertLastChoiceFromControl` all take constant **O(1)** time, and the input **N** is reduced linearly in every step, the depth of recursion will also be linear **O(N)**.

// Diagram: If the input is reduced linearly at each step, the depth of recursion is the same as the size of the input N.

For unconditional enumeration, the number of choices at every step is generally dynamic and dependent on the previously made choices. If we assume that there are total of `k` choices to choose from at every step, and every solution state is at a depth **N**, the overall time complexity in the worst case would be **O(N^k)**.

Since we need to explore the entire problem space to find all the solution states, the time complexity would be **O(N^k)** in any case.

// Diagram: If we can make k choices at every step, it leads to an exponential complexity when searching for all solution states.

Assuming that the variable `state` takes constant **O(1)** space at all times, since we add it to the `enumerations` list when a series of choices leads us to a solution state, the final size of the list will be equal to the number of ways we can reach a solution state. If no solution state exists, the list will always be empty, but recursive calls to depth **N** will take **O(N)** space for all local variables.

In the worst case, all terminal states can be solution states, and so the size of the `enumeration` list will be **O(N^k)**. Since we only create constant **O(1)** sized local variables in every recursive call and the depth of recursion is **O(N)**, the space complexity in the worst case would be **O(N + N^k) ~ O(N^k)**.

> **Best Case:** No solution state exists
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N^k)**
>
> **Worst Case:** All terminal states are solution states
>
> -   Space Complexity - **O(N^k)**
> -   Time Complexity - **O(N^k)**

***

# Identifying the unconditional enumeration pattern

Unconditional enumeration is a fundamental backtracking technique used to generate all solution states to a problem. Most problems that can be solved using this technique are easy or medium problems, where we are given an initial problem state and we recursively make choices to reduce the problem space, ultimately leading to solution states. By systematically exploring these states, unconditional enumeration ensures that all valid solutions are considered. Most problems where we can make a fixed set of choices that are independent of any previously made choice can be solved using the unconditional enumeration technique.

If the problem statement or its solution follows the generic template below, it can be solved using unconditional enumeration.

**Template:**Given an initial problem state, enumerate all the solution states that can be reached from it by making a fixed set of independent choices at each step.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using unconditional enumeration.

> **Problem statement:** Given an integer array `arr` containing unique elements, write a function that returns all possible subsets (the power set) of the elements in arr. The solution set must not contain duplicate subsets. You can return the subsets in any order.

// Diagram: Find all unique subsets of the items in the array.

## The unconditional enumeration solution

By closely observing the problem, we can identify a brute-force approach to building all subsets. We start with an empty set (the initial problem state) and iterate over the array. In each iteration, we have two choices: either select the number at that index and add it to our set, or ignore it and proceed to the next index.

// Diagram: For every item in the array, we can either choose it to add to the subset or not choose it.

It is clear from the above what the initial problem state (empty set) is, and the choices we have to reduce the problem space incrementally build the solution. The solution to the problem fits the template description for the unconditional enumeration pattern we learned earlier.

**Template:**Given an initial problem state (empty set), enumerate all the solution states (all subsets) that can be reached from it by making a fixed set of independent choices (add a number to the set or ignore it) at each step.

We create a recursive function `findSubsets` that takes as input the array `arr`, the current index we are at in the array `index`, reference to a list `currentSet` that holds current set that is made from our choices, and reference to a 2D list `subsets` that will hold all the subsets (solution states). The recursive function `findSubsets` recursively explores the entire problem space, starting from the given `index` in the array `arr`, and adds all the subsets to the `subsets` list.

It is important to note that the variables `index` and `currentSet` collectively define the state in the state space tree that we explore.

We initialize the `currentSet` and `subsets` lists in the calling function as empty lists and pass them by reference to the `findSubsets` function along with the input array `arr` and starting with `index` 0 that makes up the initial problem state.

As we enter the findSubsets function, we check if we have finished making choices for all the items in the array by checking if `index == size` of `arr`. If yes, it means no more choices can be made, and we are at a solution state where `currentSet` is the subset built based on our choices. We add `currentSet` to `subsets` and return to the caller.

If we are not at a solution state, we have two choices to make. We can either ignore the item and `arr[index]` or add it to `currentSet`. We make the first choice by recursively calling findSubsets on `index+1` without modifying `currentSet`. When this recursive call ends, we make the second choice by adding `arr[index]` to `currentSet` and again calling `findSubsets` recursively. When this recursive call ends, we revert our choice by popping the last item from the `currentSet` list and returning to the caller.

This way, at every step, make two choices and update and revert the `currentSet` list accordingly and adding `currentSet` to the `subsets` list when we have made a series of choices for all items in the array (solution state). At the end of all recursive calls, the `subsets` list will have all power set (all subsets) of the array in the calling function.

Consider the example execution below for an array of only two items.

Find all unique subsets of the items in the array.

The implementation of the unconditional enumeration solution to solve the problem is given below.

C++

```cpp
using namespace std;

class Solution {
public:
    void findSubsets(
        vector<int> &arr,
        int index,
        vector<int> &currentSet,
        vector<vector<int>> &subsets
    ) {

        if(index == arr.size()) {
            // Add the current subset to the subsets
            subsets.push_back(currentSet);
            return;
        }

            // Choice 1. Ignore the current element from the subset
            // Recur with the next element
            findSubsets(arr, index + 1, currentSet, subsets);

// Diagram: // Backrtack for the next choice

            // Choice 2. Include the current element in the subset
            currentSet.push_back(arr[index]);
            // Recur with the next element
            findSubsets(arr, index + 1, currentSet, subsets);

            // Undo the previous choice before moving to next element
            currentSet.pop_back();
    }

// Diagram: vector<vector<int>> uniqueSubsets(vector<int> &arr) {

        // Vector to store the subsets
        vector<vector<int>> subsets;

        // Temporary vector to store the current subset
        vector<int> currentSet;

        // Start the recursive search from index 0
        findSubsets(arr, 0, currentSet, subsets);

        // Return the vector containing all subsets
        return subsets;
    }
};
```

Java

```java
import java.util.ArrayList;
import java.util.List;

// Diagram: class Solution {

    void findSubsets(
        List<Integer> arr,
        int index,
        List<Integer> currentSet,
        List<List<Integer>> subsets
    ) {

        if (index == arr.size()) {
            // Add the current subset to the subsets
            subsets.add(new ArrayList<>(currentSet));
            return;
        }

        // Choice 1. Ignore the current element from the subset
        // Recur with the next element
        findSubsets(arr, index + 1, currentSet, subsets);

// Diagram: // findSubsets for the next choice

        // Choice 2. Include the current element in the subset
        currentSet.add(arr.get(index));
        // Recur with the next element
        findSubsets(arr, index + 1, currentSet, subsets);

        // Undo the previous choice before moving to next element
        currentSet.remove(currentSet.size() - 1);
    }

// Diagram: List<List<Integer>> uniqueSubsets(List<Integer> arr) {

        // Vector to store the subsets
        List<List<Integer>> subsets = new ArrayList<>();

        // Temporary vector to store the current subset
        List<Integer> currentSet = new ArrayList<>();

        // Start the recursive search from index 0
        findSubsets(arr, 0, currentSet, subsets);

        // Return the vector containing all subsets
        return subsets;
    }
```

Typescript

```typescript
class Solution {
  findSubsets(
    arr: number[],
    index: number,
    currentSet: number[],
    subsets: number[][]
  ): void {

    if (index === arr.length) {
      // Add the current subset to the subsets
      subsets.push([...currentSet]);
      return;
    }

    // Choice 1. Ignore the current element from the subset
    // Recur with the next element
    this.findSubsets(arr, index + 1, currentSet, subsets);

// Diagram: // Backrtack for the next choice

    // Choice 2. Include the current element in the subset
    currentSet.push(arr[index]);
    // Recur with the next element
    this.findSubsets(arr, index + 1, currentSet, subsets);

    // Undo the previous choice before moving to next element
    currentSet.pop();
  }

  uniqueSubsets(arr: number[]): number[][] {
    // Vector to store the subsets
    const subsets: number[][] = [];

    // Temporary vector to store the current subset
    const currentSet: number[] = [];

    // Start the recursive search from index 0
    this.findSubsets(arr, 0, currentSet, subsets);

    // Return the vector containing all subsets
    return subsets;
  }
```

Javascript

```javascript
class Solution {
  findSubsets(
    arr,
    index,
    currentSet,
    subsets
  ) {

    if (index === arr.length) {
      // Add the current subset to the subsets
      subsets.push([...currentSet]);
      return;
    }

    // Choice 1. Ignore the current element from the subset
    // Recur with the next element
    this.findSubsets(arr, index + 1, currentSet, subsets);

// Diagram: // Backrtack for the next choice

    // Choice 2. Include the current element in the subset
    currentSet.push(arr[index]);
    // Recur with the next element
    this.findSubsets(arr, index + 1, currentSet, subsets);

    // Undo the previous choice before moving to next element
    currentSet.pop();
  }

// Diagram: uniqueSubsets(arr) {

    // Vector to store the subsets
    const subsets = [];

    // Temporary vector to store the current subset
    const currentSet = [];

    // Start the recursive search from index 0
    this.findSubsets(arr, 0, currentSet, subsets);

    // Return the vector containing all subsets
    return subsets;
  }
```

Python

```python
from typing import List

class Solution:
    def find_subsets(
        self,
        arr: List[int],
        index: int,
        current_set: List[int],
        subsets: List[List[int]]
    ) -> None:

        if index == len(arr):
            # Add the current subset to the subsets
            subsets.append(current_set.copy())
            return

        # Choice 1. Ignore the current element from the subset
        # Recur with the next element
        self.find_subsets(arr, index + 1, current_set, subsets)

        # find_subsets for the next choice

        # Choice 2. Include the current element in the subset
        current_set.append(arr[index])
        # Recur with the next element
        self.find_subsets(arr, index + 1, current_set, subsets)

        # Undo the previous choice before moving to next element
        current_set.pop()

    def unique_subsets(self, arr: List[int]) -> List[List[int]]:
        # Vector to store the subsets
        subsets: List[List[int]] = []

        # Temporary vector to store the current subset
        current_set: List[int] = []

        # Start the recursive search from index 0
        self.find_subsets(arr, 0, current_set, subsets)

        # Return the vector containing all subsets
        return subsets
```

.

## Example problems

Most problems that fall under this category are**easy**or**medium**problems; a list of a few is given below.

> -   **[Unique subsets](https://www.codeintuition.io/courses/backtracking/Ay1v4Se4C70fEpzrhyxOx)**
> -   **[Number sequence](https://www.codeintuition.io/courses/backtracking/b6KNxc-nHELQzUrZ1t_gT)**
> -   **[Phone combinations](https://www.codeintuition.io/courses/backtracking/6CnDCrcxNm3TktPwVWrvN)**
> -   **[Case transformations](https://www.codeintuition.io/courses/backtracking/JkLgJH7l765_QdNMGqfIY)**

We will now solve these problems to gain a deeper understanding of the unconditional enumeration pattern.

***

# Unique subsets

## Problem Statement

Given an integer array **arr** containing unique elements, write a function that returns all possible subsets (the power set) of the elements in arr. The solution set must not contain duplicate subsets. You can return the subsets in **any order**.

### Example 1

> -   **Input:** arr = \[1, 2, 3\]
> -   **Output:** \[\[\], \[1\], \[2\], \[1, 2\], \[3\], \[1, 3\], \[2, 3\], \[1, 2, 3\]\]
> -   **Explanation:** Above is the list of all the subsets for \[1, 2, 3\].

### Example 2

> -   **Input:** arr = \[1\]
> -   **Output:** \[\[\], \[1\]\]
> -   **Explanation:** Above is the list of all the subsets for \[1\].

### Example 3

> -   **Input:** arr = \[\]
> -   **Output:** \[\[\]\]
> -   **Explanation:** Above is the list of all the subsets for \[\].

## Solution

```cpp
using namespace std;

class Solution {
public:
    void generateSubsets(
        vector<int> &arr,
        int index,
        vector<int> &currentSubset,
        vector<vector<int>> &subsets
    ) {

        // If all elements have been considered (solution state)
        if (index == arr.size()) {

            // Every state is a valid subset -> add directly
            subsets.push_back(currentSubset);

            // Return to explore other possibilities
            return;
        }

        // Choices for each element:
        // 1. true -> Include the current element in subset
        // 2. false -> Do not include the current element in subset
        for (bool includeCurrent : {true, false}) {

            // Include the current element in the subset
            if (includeCurrent) {

                // Include the current element in the subset (make a
                // choice)
                currentSubset.push_back(arr[index]);

                // Recur for the next index in the array including the
                // current element
                generateSubsets(arr, index + 1, currentSubset, subsets);

                // Backtrack by removing the last element (revert the
                // choice)
                currentSubset.pop_back();

            }

            // Do not include the current element in the subset
            else {

                // Recur for the next index in the array without
                // including the current element
                generateSubsets(arr, index + 1, currentSubset, subsets);
            }
        }
    }

    vector<vector<int>> uniqueSubsets(vector<int> &arr) {

        // Vector to store the subsets
        vector<vector<int>> subsets;

        // Temporary vector to store the current subset
        vector<int> currentSubset;

        // Start backtracking from index 0
        generateSubsets(arr, 0, currentSubset, subsets);

        // Return the vector containing all subsets
        return subsets;
    }
};
```

***

# Case transformations

## Problem Statement

Given a string **s**, write a function that returns a list of all possible strings that can be created by transforming each letter in s individually to be either lowercase or uppercase. The output may be returned in **any order**.

### Example 1

> -   **Input:** s = a1b2
> -   **Output:** \[a1b2, a1B2, A1b2, A1B2\]
> -   **Explanation:** Above is the list with all possible strings.

### Example 2

> -   **Input:** s = 3z4
> -   **Output:** \[3Z4, 3z4\]
> -   **Explanation:** Above is the list with all possible strings.

### Example 3

> -   **Input:** s = a
> -   **Output:** \[a, A\]
> -   **Explanation:** Above is the list with all possible strings.

## Solution

```cpp
using namespace std;

class Solution {
public:
    char toggleCase(char c) {

        // If the character is in lowercase, return the uppercase version
        if (islower(c)) {
            return toupper(c);
        }

        // Otherwise, if the character is in uppercase, return the
        // lowercase version
        else {
            return tolower(c);
        }
    }

    void generateTransformations(
        const string &s,
        int index,
        string &currentTransformation,
        vector<string> &transformations
    ) {

        // If index reaches the end of the string, store the current
        // transformation (solution state)
        if (index == s.length()) {

            // Add the current transformation to the result
            transformations.push_back(currentTransformation);

            // Return to continue exploring other possibilities
            return;
        }

        // Choices for each element:
        // 1. true -> Toggle the case of the current character
        // 2. false -> Do not toggle the case of the current character
        for (bool toggleCurrent : {true, false}) {

            // Toggle the case of the current character if it is an
            // alphabet
            if (toggleCurrent && isalpha(s[index])) {

                // Make choice: toggle the case and append to
                // currentTransformation
                currentTransformation.push_back(toggleCase(s[index]));

                // Recur with next index
                generateTransformations(
                    s, index + 1, currentTransformation, transformations
                );

                // Unmake choice: remove the last character
                currentTransformation.pop_back();

            } else if (!toggleCurrent) {

                // Make choice: keep original character
                currentTransformation.push_back(s[index]);

                // Recur with next index
                generateTransformations(
                    s, index + 1, currentTransformation, transformations
                );

                // Unmake choice: remove the last character
                currentTransformation.pop_back();
            }
        }
    }

    vector<string> caseTransformations(const string &s) {

        // Vector to store the transformations
        vector<string> transformations;

        // Working string for backtracking
        string currentTransformation;

        // Start the unconditional enumeration process from index 0
        generateTransformations(
            s, 0, currentTransformation, transformations
        );

        // Return the vector containing all transformations
        return transformations;
    }
};
```

***

# Number sequence

## Problem Statement

Given two non-negative integers **n** and **k**, write a function that returns all possible sequences of length n, where each element is an integer in the range `[1, k]`. You can return the sequences in **any order**.

### Example 1

> -   **Input:** n = 2, k = 2
> -   **Output:** \[\[1, 1\], \[1, 2\], \[2, 1\], \[2, 2\]\]
> -   **Explanation:** Above are all the sequences when n = 2 and k = 2.

### Example 2

> -   **Input:** n = 3, k = 1
> -   **Output:** \[\[1, 1, 1\]\]
> -   **Explanation:** Above are all the sequences when n = 3 and k = 1.

### Example 3

> -   **Input:** n = 1, k = 4
> -   **Output:** \[\[1\], \[2\], \[3\], \[4\]\]
> -   **Explanation:** Above are all the sequences when n = 1 and k = 4.

## Solution

```cpp
using namespace std;

class Solution {
public:
    void generateSequence(
        int n,
        int k,
        int index,
        vector<int> &currentSequence,
        vector<vector<int>> &sequences
    ) {

        // If the current sequence has reached length n (solution state)
        if (index == n) {

            // Add the complete sequence to the result
            sequences.push_back(currentSequence);

            // Return to continue exploring other possibilities
            return;
        }

        // Get all possible choices for the current position
        // (numbers 1..k)
        for (int choice = 1; choice <= k; choice++) {

            // Add current number to the current sequence (make choice)
            currentSequence.push_back(choice);

            // Recurse to fill the next position in the sequence
            generateSequence(
                n, k, index + 1, currentSequence, sequences
            );

            // Backtrack by removing the last added number (revert
            // choice)
            currentSequence.pop_back();
        }
    }

    vector<vector<int>> numberSequence(int n, int k) {

        // Stores all generated sequences (solution states)
        vector<vector<int>> sequences;

        // Stores the current sequence being built (state)
        vector<int> currentSequence;

        // Generate all sequences using backtracking
        generateSequence(n, k, 0, currentSequence, sequences);

        // Return the vector containing all sequences
        return sequences;
    }
};
```

***

# Phone combinations

## Problem Statement

Given a string **digits** consisting of numbers from `2` to `9`, write a function to generate and return a list of all possible letter combinations that the numbers could represent. The mapping of each number to its corresponding letters (just like on the telephone buttons) is provided below. You can return the answer in **any order**.

// Diagram: Note - the digit 1 does not map to any letter

// Diagram: Number to letter mapping

### Example 1

> -   **Input:** digits = 46
> -   **Output:** \[gm, gn, go, hm, hn, ho, im, in, io\]
> -   **Explanation:** Above is the list of letter combinations that could be generated with 46.

### Example 2

> -   **Input:** digits = 28
> -   **Output:** \[at, au, av, bt, bu, bv, ct, cu, cv\]
> -   **Explanation:** Above is the list of letter combinations that could be generated with 28.

### Example 3

> -   **Input:** digits = 2
> -   **Output:** \[a, b, c\]
> -   **Explanation:** Above is the list of letter combinations that could be generated with 2.

## Solution

```cpp
using namespace std;

class Solution {
public:

    // Mapping of digits to their corresponding letters (telephone button
    // mapping)
    vector<string> phoneMapping = {
        "",
        "",
        "abc",
        "def",
        "ghi",
        "jkl",
        "mno",
        "pqrs",
        "tuv",
        "wxyz"
    };

    void generateCombinations(
        const string &digits,
        int index,
        string &currentCombination,
        vector<string> &combinations
    ) {

        // If the current combination has reached the length of digits,
        // add it to combinations (solution state)
        if (index == digits.length()) {

            // Add the current combination to the result
            combinations.push_back(currentCombination);

            // Return to continue exploring other possibilities
            return;
        }

        // Get the current digit to process
        char digit = digits[index];

        // Get the corresponding string of letters for the current digit
        string letters = phoneMapping[digit - '0'];

        // Try every letter corresponding to the current digit (all
        // choices)
        for (char letter : letters) {

            // Add the letter to the current combination (make choice)
            currentCombination.push_back(letter);

            // Recur with the next digit (reduced input -> index + 1)
            generateCombinations(
                digits, index + 1, currentCombination, combinations
            );

            // Remove the last letter to backtrack (revert choice)
            currentCombination.pop_back();
        }
    }

    vector<string> phoneCombinations(string digits) {

        // If the input digits are empty, return an empty result
        if (digits.empty()) {
            return {};
        }

        // Vector to store the combinations
        vector<string> combinations;

        // Temporary string to store the current combination (state)
        string currentCombination;

        // Start the unconditional enumeration process from index 0
        generateCombinations(
            digits, 0, currentCombination, combinations
        );

        // Return the vector containing all combinations
        return combinations;
    }
};
```
