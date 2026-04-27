# Understanding the conditional enumeration pattern

Conditional enumeration is another fundamental backtracking technique that explores the entire problem space using backtracking and collects all the solutions. However, unlike unconditional enumeration, in which choices at each step are independent of previous choices, in conditional enumeration, the set of choices at each step depends on the choices made in previous steps. To enumerate all solutions, we start from an initial state and, at each step, choose from a set of available choices to move to another state, eventually exploring the entire problem space.

It is essential to note that any choice we make at a step is **dependent** on the choices we made earlier, and hence we call this process **conditional** enumeration.

The conditional enumeration pattern is the classification of problems that can be solved using the conditional enumeration backtracking technique.

// Diagram: The state space tree for conditional enumeration.

In this course, we will learn more about the conditional-enumeration technique and how to identify a problem as a conditional-enumeration pattern problem.

## Conditional enumeration

In conditional enumeration, we begin with an initial problem state defined by some state variables. At every step, we can make one of many **dependent** choices to reduce the size of the problem and move to another state. This process of making choices at every step is repeated recursively until we reach a solution state. As we make these choices and move from one state to another, we incrementally build the solution in some state variable.

Consider the state space tree below, where we have an initial problem state and `k` dependent choices that we can make at each step. The depth of the problem space is denoted by `n`, which is the maximum number of choices we must make to reach a solution state. At every step, making a different choice may lead to completely different solution states in the end. We recursively make a series of choices until we reach a solution state, then backtrack to update our choices. In this way, we visit every solution state exactly once.

Note that every step can have a different number of choices, and those choices depend on the previously made choices. We only show `k` choices in the state space tree below to make it simpler and easier to understand.

// Diagram: The state space tree for conditional enumeration of depth n where we can make dependent choices at every step.

We maintain a shared container as we explore the problem space, and add a solution state to it when we reach it. This way, when the entire problem space is explored, the container contains an enumeration of all solution states.

// Diagram: A series of dependent choices starting from a problem state, leading to a solution state.

We create a state variable `state` to record the outcome of choices we make to reach a solution state, starting from the initial state, using some function `f`. At each step, we check if the current step is a solution state. If it is a solution, we add it to an`enumerations`container.

We also create another variable`control`that captures the effect of the previously made choices on subsequent choices using some function`g`. It is used at every step to determine the available choices to move to the next step. This way, each step accounts for the choices made in previous steps when computing the set of choices it can make to proceed.

The goal of the conditional enumeration problem is to find**all** the solution states that can be reached by making any valid set of choices from the initial state. As we will see later, we also usually have functions `fInverse` and`gInverse`to remove the contribution of the **last** choice made from `state` and `control` respectively. We use them to undo previous choices and make new, different choices when we have no further choices left to move on from a step.

In this example, we enumerate the outcomes of a series of choices that lead from the problem state to a solution state using the function `f`; we could similarly enumerate and store all solution states instead.

Start from the initial problem state and add all the solution states to the enumerations list.

### The conditional enumeration problem

Consider an example where the problem space is represented by an integer `n` , and we start from the initial problem state with some default values of the `state` and `control` variables. We can make multiple choices, denoted by an integer `choice` at every step, to reduce the problem space, and we update the `state` variable with those choices as we make them. The goal is to find **all** solution states and the sequence of choices that lead to them, starting from the initial problem state.

We have the following functions that we can use.

-   `getChoices ( control, n )` - Takes as an input the `control` variable and the current problem space `n` and returns a list of choices we can make.
-   `makeChoice (state, choice)` - Takes as input the state variable `state` and a `choice` from the list of available choices and adds the contribution of `choice` to `state`.
-   `updateControl (control, choice)` - Takes as input the current problem space `n`, reference to the variable `control` and the `choice` we decide to make and adds the contribution of `choice` to `control`.
-   `revertLastChoiceFromState (state)` - Takes as input the variable `state` and reverts the contribution of the last choice that was made from it.
-   `revertLastChoiceFromControl (control)` - Takes as input the variable `control` and reverts the contribution of the last choice that was made from it.
-   `getReducedProblemSpace (n, choice)` - Takes as input the current problem space `n` and the `choice` we decide to make, and returns a value denoting the reduced problem space.
-   `isSolutionState (n)` - Takes as input the current problem space `n` and returns true if it is a solution.

Note how the `getChoices` function depend not only on the current problem space, but also on the `control` variable that accounts for the previously made choices.

Note that this is the generic conditional enumeration problem. Most of these functions and their definitions are very problem-specific. For example, in some problems, the `control` variable may be a primitive type and need not be shared across recursive calls; we can use local copies. In that case, the `updateControl` function would return a new copy of the updated control variable instead of updating the shared copy, and there would be no `revertLastChoiceFromControl` function.

We will only learn about the generic conditional enumeration problem and its solution in this lesson. All the more specific cases of this problem can be solved using slightly modified, easier implementations of the generic solution.

### The conditional enumeration technique

To solve this problem, we create a recursive function `conditionalEnumeration` that takes as input the integer `n` denoting the problem space, a reference to the state variable `state`, a `control` variable accounting for the previously made choices, and a reference to a list `enumerations` to store all the solution states.

We initialize `state` and `control` to default values and `enumerations` to an empty list in the calling function and pass them as reference arguments to the function `conditionalEnumeration` along with the input `n`.

As we enter the function, we check if the current step is a solution state using `isSolutionState`. If the current step is a solution state, we add the current value of  `state` to the list `enumerations` and return to the caller.

If the current state is not a solution state, we use the function `getReducedProblemSpace` to get the next input for the reduced problem space in a variable `reducedProblemSpace`. Next, we use the function `getChoices` passing it the variables `n` and `control` to get a list of all the choices we can make to reduce the problem space. We then iterate through the list of all choices, and in each iteration, simulate making that choice by adding its contribution to `state` using `makeChoice` and updating the `control` variable using the `updateControl` function that accounts for this choice.

We then recursively call the same function with `reducedProblemSpace`, the updated `state` and the updated `control`. The same process is repeated recursively until it reaches a solution state, where we add the current value of `state` to the `enumerations` list. When a recursive call ends and control goes back to the caller, we revert the last choice made using `revertLastChoiceFromState` and `revertLastChoiceFromControl` on `state` and `control` variables respectively, and continue the iteration to make the next choice in exactly the same way.

Since we call `revertLastChoiceFromState` and `revertLstChoiceFromControl` after returning from **every** recursive call, it is guaranteed that the choice made before making a recursive call is the one that is reverted after returning from it.

This way, we simulate making a choice at every step until we reach a solution state, aggregate the consequences of all those choices in `state`, and add the final value of `state` (outcome) to the `enumerations` list. We also undo the choices in the same order they were made, so that backtracking to make different choices next time works the same way.

When all the recursive calls end, control is passed back to the caller of `conditionalEnumeration`, the `enumerations` list has the list of all outcomes from all choices, and the variables `state` and `control` are reverted to the default value with which they were initialized.

Consider the example below, where we start from an initial problem state and enumerate all solutions using recursive function calls.

Enumerate all solutions starting from an initial problem state.

## Algorithm

The algorithm given below outlines the generic conditional-enumeration technique, making use of the functions `getReducedProblemSpace`, `getChoices`, `makeChoice`, `updateControl`, `revertLastChoiceFromState`, `revertLastChoiceFromControl` and `isSolutionState`. All these functions and their implementations are problem-dependent.

All these functions and their implementations are highly problem-dependent, but the overall structure of the algorithm remains the same.

We also create a calling function that initializes the state variables `state`, `control` and `enumerations` with default values. It then passes them as a reference to the top-level recursive call. 

> **conditionalEnumeration(n, \[ref\] control, \[ref\] state, \[ref\] enumerations)**
>
> -   **Step 1:** Call `isSolutionState(n, state)` to check if it is a solution state.
>     -   **Step 1.1:** If `true`, add `state` to `enumerations`
>     -   **Step 1.2:** Return to the caller
> -   **Step 2:** Set `choices` = Call `getChoices(n, control)` to get all choices available at this step.
> -   **Step 3:** Iterate over `choices` using a variable `choice` and do the following:
>     -   **Step 3.1:** Call `makeChoice(state, choice)` to add the contribution of `choice` to the `state` variable
>     -   **Step 3.2:** Call `updateControl(n, control, choice)` to update the control variable based on the current choice and input `n`
>     -   **Step 3.3:** Set `reducedProblemSpace` = Call `getReducedProblemSpace(n, choice)` to obtain the reduced problem space for the next recursive call
>     -   **Step 3.4:** Call `conditionalEnumeration(reducedProblemSpace, control, state, enumerations)`
>     -   **Step 3.5:** Call `revertLastChoiceFromControl(control)` to revert the contribution of the last choice from the control variable
>     -   **Step 3.6:** Call `revertLastChoiceFromState(state)` to revert the contribution of the last choice from the state variable
> -   **Step 4:** Return to the caller
>
> **callingFunction(n)**
>
> -   **Step 1:** Create a variable `state` and initialize it to a default value
> -   **Step 2:** Create a variable `control` and initialize it to a default value
> -   **Step 3:** Create an empty list `enumerations`
> -   **Step 4:** Call `conditionalEnumeration(n, control, state, enumerations)`
> -   **Step 5:** Return `enumerations`

## Implementation

To implement the conditional enumeration technique, we create a calling function that initialises the state variables `state` and `enumerations`, the control variable `control`, and makes the top-level recursive calls. For languages that do not support passing values by reference, we can create the state variables in the enclosing scope to share them across recursive calls.

Given below is a generic implementation of conditional enumeration, with the functions `isSolutionState`, `getChoices` and `getReducedProblemSpace` having some stub implementation.

C++

```cpp
#include <vector>
using namespace std;

class Solution
{
public:
  void conditionalEnumeration(
      int n,
      vector<int> &control,
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
    // using the control variable
    vector<int> choices = getChoices(n, control);

    // Iterate through each available choice
    for (int choice : choices)
    {
      // Update the state variable by applying the current choice
      makeChoice(state, choice);

      // Update the control variable based on the current choice and n
      updateControl(n, control, choice);

      // Reduce the problem space based on the current choice
      int reducedProblemSpace = getReducedProblemSpace(n, choice);

      // Recur on the reduced problem space
      conditionalEnumeration(reducedProblemSpace, control, state, enumerations);

      // Revert the contribution of the last choice from control (backtracking)
      revertLastChoiceFromControl(control);

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
  // using the control variable
  vector<int> getChoices(int n, const vector<int> &control)
  {
    int maxChoice = n;

    // Control restricts the available choices
    if (!control.empty())
      maxChoice = min(maxChoice, control.back());

    // Simple stub choices that clearly depend on n and control
    vector<int> choices;
    if (maxChoice >= 1) choices.push_back(1);
    if (maxChoice >= 2) choices.push_back(2);

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

  // Updates the control variable based on the given choice and input n
  void updateControl(int n, vector<int> &control, int choice)
  {
    // Simple stub:
    // record a value derived from n and choice
    control.push_back(n - choice);
  }

  // Reverts the contribution of the most recent choice from the control variable
  void revertLastChoiceFromControl(vector<int> &control)
  {
    if (!control.empty())
      control.pop_back();
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

    public void conditionalEnumeration(
        int n,
        List<Integer> control,
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
        // using the control variable
        List<Integer> choices = getChoices(n, control);

        // Iterate through each available choice
        for (int choice : choices) {
            // Update the state variable by applying the current choice
            makeChoice(state, choice);

            // Update the control variable based on the current choice and n
            updateControl(n, control, choice);

            // Reduce the problem space based on the current choice
            int reducedProblemSpace = getReducedProblemSpace(n, choice);

            // Recur on the reduced problem space
            conditionalEnumeration(reducedProblemSpace, control, state, enumerations);

            // Revert the contribution of the last choice from control (backtracking)
            revertLastChoiceFromControl(control);

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
    // using the control variable
    private List<Integer> getChoices(int n, List<Integer> control) {
        int maxChoice = n;

        // Control restricts the available choices
        if (!control.isEmpty()) {
            maxChoice = Math.min(maxChoice, control.get(control.size() - 1));
        }

        // Simple stub choices that clearly depend on n and control
        List<Integer> choices = new ArrayList<>();
        if (maxChoice >= 1) choices.add(1);
        if (maxChoice >= 2) choices.add(2);

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

    // Updates the control variable based on the given choice and input n
    private void updateControl(int n, List<Integer> control, int choice) {
        // Simple stub:
        // record a value derived from n and choice
        control.add(n - choice);
    }

    // Reverts the contribution of the most recent choice from the control variable
    private void revertLastChoiceFromControl(List<Integer> control) {
        if (!control.isEmpty()) {
            control.remove(control.size() - 1);
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
  conditionalEnumeration(
    n: number,
    control: number[],
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
    // using the control variable
    const choices: number[] = this.getChoices(n, control);

    // Iterate through each available choice
    for (const choice of choices) {
      // Update the state variable by applying the current choice
      this.makeChoice(state, choice);

      // Update the control variable based on the current choice and n
      this.updateControl(n, control, choice);

      // Reduce the problem space based on the current choice
      const reducedProblemSpace = this.getReducedProblemSpace(n, choice);

      // Recur on the reduced problem space
      this.conditionalEnumeration(
        reducedProblemSpace,
        control,
        state,
        enumerations
      );

      // Revert the contribution of the last choice from control (backtracking)
      this.revertLastChoiceFromControl(control);

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
  // using the control variable
  private getChoices(n: number, control: number[]): number[] {
    let maxChoice = n;

    // Control restricts the available choices
    if (control.length > 0) {
      maxChoice = Math.min(maxChoice, control[control.length - 1]);
    }

    // Simple stub choices that clearly depend on n and control
    const choices: number[] = [];
    if (maxChoice >= 1) choices.push(1);
    if (maxChoice >= 2) choices.push(2);

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

  // Updates the control variable based on the given choice and input n
  private updateControl(n: number, control: number[], choice: number): void {
    // Simple stub:
    // record a value derived from n and choice
    control.push(n - choice);
  }

  // Reverts the contribution of the most recent choice from the control variable
  private revertLastChoiceFromControl(control: number[]): void {
    if (control.length > 0) control.pop();
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
  conditionalEnumeration(
    n,
    control,
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
    // using the control variable
    const choices = this.getChoices(n, control);

    // Iterate through each available choice
    for (const choice of choices) {
      // Update the state variable by applying the current choice
      this.makeChoice(state, choice);

      // Update the control variable based on the current choice and n
      this.updateControl(n, control, choice);

      // Reduce the problem space based on the current choice
      const reducedProblemSpace = this.getReducedProblemSpace(n, choice);

      // Recur on the reduced problem space
      this.conditionalEnumeration(
        reducedProblemSpace,
        control,
        state,
        enumerations
      );

      // Revert the contribution of the last choice from control (backtracking)
      this.revertLastChoiceFromControl(control);

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
  // using the control variable
  getChoices(n, control) {
    let maxChoice = n;

    // Control restricts the available choices
    if (control.length > 0) {
      maxChoice = Math.min(maxChoice, control[control.length - 1]);
    }

    // Simple stub choices that clearly depend on n and control
    const choices = [];
    if (maxChoice >= 1) choices.push(1);
    if (maxChoice >= 2) choices.push(2);

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

  // Updates the control variable based on the given choice and input n
  updateControl(n, control, choice) {
    // Simple stub:
    // record a value derived from n and choice
    control.push(n - choice);
  }

  // Reverts the contribution of the most recent choice from the control variable
  revertLastChoiceFromControl(control) {
    if (control.length > 0) {
      control.pop();
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
    def conditional_enumeration(
        self,
        n: int,
        control: List[int],
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
        # using the control variable
        choices: List[int] = self.get_choices(n, control)

        # Iterate through each available choice
        for choice in choices:
            # Update the state variable by applying the current choice
            self.make_choice(state, choice)

            # Update the control variable based on the current choice and n
            self.update_control(n, control, choice)

            # Reduce the problem space based on the current choice
            reduced_problem_space: int = self.get_reduced_problem_space(n, choice)

            # Recur on the reduced problem space
            self.conditional_enumeration(
                reduced_problem_space,
                control,
                state,
                enumerations
            )

            # Revert the contribution of the last choice from control (backtracking)
            self.revert_last_choice_from_control(control)

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
    # using the control variable
    def get_choices(self, n: int, control: List[int]) -> List[int]:
        max_choice: int = n

        # Control restricts the available choices
        if control:
            max_choice = min(max_choice, control[-1])

        # Simple stub choices that clearly depend on n and control
        choices: List[int] = []
        if max_choice >= 1:
            choices.append(1)
        if max_choice >= 2:
            choices.append(2)

// Diagram: return choices

    # Updates the state variable by adding the contribution of the given choice
    def make_choice(self, state: List[int], choice: int) -> None:
        state.append(choice)

    # Reverts the contribution of the most recent choice from the state variable
    def revert_last_choice_from_state(self, state: List[int]) -> None:
        if state:
            state.pop()

    # Updates the control variable based on the given choice and input n
    def update_control(self, n: int, control: List[int], choice: int) -> None:
        # Simple stub:
        # record a value derived from n and choice
        control.append(n - choice)

    # Reverts the contribution of the most recent choice from the control variable
    def revert_last_choice_from_control(self, control: List[int]) -> None:
        if control:
            control.pop()

    # Returns the reduced problem space for the next recursive call
    # based on the current input n and the choice
    def get_reduced_problem_space(self, n: int, choice: int) -> int:
        return n - choice
```

## Complexity Analysis

The conditional enumeration technique uses multiple recursion at every step as it simulates making all available choices. Hence, it has an exponential time complexity that depends on the depth of recursion and the branching factor.

If we assume that the functions functions `isSolutionState`, `getReducedProblemSpace`, `getChoices`, `makeChoice`, `updatecontrol`, `revertLastChoiceFromState`, and `revertLastChoiceFromControl` all take constant **O(1)** time, and the input **N** is reduced linearly in every step, the depth of recursion will also be linear **O(N)**.

// Diagram: If the input is reduced linearly at each step, the depth of recursion is the same as the size of the input N.

For conditional enumeration, the number of choices at every step is generally dynamic and dependent on the previously made choices. If we assume that there are total of `k` choices to choose from at every step, and every solution state is at a depth **N**, the overall time complexity in the worst case would be **O(N^k)**.

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

# Identifying the conditional enumeration pattern

Conditional enumeration is another foundational backtracking technique to solve problems where we need to find all the solution states. It is versatile and can model more complicated problems as it accounts for previously made choices when deciding the choices for any step. Most problems that can be solved using this technique are easy to medium problems, where we are given an initial problem state and can make multiple choices to reduce the problem space and transition to other states.

Most problems where we can make a set of choices that are dependent on previously made choices can be solved using the conditional enumeration technique.

If the problem statement or its solution follows the generic template below, it can be solved using conditional enumeration.

**Template:**Given an initial problem state, enumerate all the solution states that can be reached from it by making a dynamic set of choices at each step that depend on previously made choices.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using conditional enumeration.

> **Problem statement:** Given a positive integer `n`, write a function to generate and return a list of all possible combinations of well-formed parentheses with `n` pairs. You can return the output in any order.

// Diagram: Find all well-formed parentheses strings with n pairs of parentheses.

## The conditional enumeration solution

Closely observing the problem, we can identify the brute force way of building the parentheses strings. We start with an empty string (the initial problem state), and we have only one choice: to put an open parenthesis.

Next time, however, we have two choices: either to add another open parenthesis or a closing parenthesis to close the previous one. This process is repeated until we reach a solution state where we have placed all `n` pairs of parentheses (`n` opening and `n` closing parentheses) in the string. We then backtrack and update our choices to enumerate all valid strings that can be created with n pairs of parentheses.

It is important to note that choices at the current step (open or closing parentheses) depend on the previously made choices (number of unclosed parentheses)

// Diagram: The state space tree for the problem where n = 2.

It is clear from the above what the initial problem state (empty string) is, and the choices we have to reduce the problem space and incrementally build the solution. The choice we make at every step depends on the outcome of the choices made in the previous steps (the number of unclosed parentheses). The solution to the problem fits the template description for the conditional enumeration pattern we learned earlier.

**Template:**Given an initial problem state (empty string), enumerate all the solution states (valid parentheses strings) that can be reached from it by making a dynamic set of choices at each step that depend on previously made choices (number of unclosed parentheses).

We create a recursive function `backtrack` that takes as input the number of parentheses pairs allowed `n`, the number of open parentheses added `open`, the number of closing parentheses added `close`, a reference to a string `currentCombination` to incrementally build the solution string and a reference to a list `solution` to hold all the solution states. The recursive function `backtrack` recursively explores the entire problem space, starting with 0 open and closed parentheses and an empty `currentCombination` string and adds all the valid parentheses strings with `n` pairs of parentheses to the `solution`.

It is important to note that the variables `open` and `close` collectively define the control variable and the variable `currentCombination` defines the state in the state space tree that we explore.

We initialize the `currentCombination` to an empty string and the `solution` list to an empty list in the calling function, and pass them by reference to the `backtrack` function along with `n`, 0 for `open` and 0 for `close`. This makes up the initial problem state.

As we enter the `backtrack` function, we check if we have finished making all the choices by checking the size of `currentCombination`. If its size is `2 * n`, it means we have added `n` pairs of parentheses, and this is a solution state. We add `currentCombination` to the `solution` list and return to the caller. If we are not at a solution state, we can make one or both choices based on the values of the `open` and `close` variables.

1.  1If `open < n` we can make a choice of adding an opening parenthesis to `currentCombination`.
2.  2If `close < open` we can make a choice of closing an previously open parenthesis by adding a closing parenthesis to `currentCombination`.

In both cases, after making the choice by updating `currentCombination`, we recursively call `backtrack` passing an incremented value of `open` or `close`, depending on the choice. When the recursive call ends, we pop the last character from `currentCombination` to make the next choice and do the same after it ends.

This way, at every step, make choices based on the previously made choices and update and revert the `currentCombination` accordingly, add it to the `solution` list when we reach a solution state. At the end of all recursive calls, the `solution` list will have all the valid parentheses strings with `n` pairs of parentheses in the calling function.

Consider the execution below to generate all valid parentheses strings for `n = 2`.

Find all well formed parentheses with n(2) pairs.

The implementation of the conditional enumeration solution to solve the problem is given below.

C++

```cpp
using namespace std;

class Solution {
public:
    void backtrack(
        int n,
        int open,
        int close,
        string &currentCombination,
        vector<string> &solution
    ) {

        // Base case: If the current combination has used all n pairs of
        // parentheses, add it to the solution
        if (currentCombination.size() == 2 * n) {

            // Store the valid combination
            solution.push_back(currentCombination);
            return;
        }

        // If we can add an open parenthesis, do so and recurse
        if (open < n) {

            // Add an open parenthesis
            currentCombination.push_back('(');

            // Recurse with updated open count
            backtrack(n, open + 1, close, currentCombination, solution);

            // Backtrack (remove the last added parenthesis)
            currentCombination.pop_back();
        }

        // If we can add a close parenthesis, do so and recurse
        if (close < open) {

            // Add a close parenthesis
            currentCombination.push_back(')');

            // Recurse with updated close count
            backtrack(n, open, close + 1, currentCombination, solution);

            // Backtrack (remove the last added parenthesis)
            currentCombination.pop_back();
        }

// Diagram: vector<string> generateParentheses(int n) {

        // Vector to store all valid combinations
        vector<string> solution;

        // String to build the current combination of parentheses
        string currentCombination;

        // Start backtracking with 0 open and 0 close parentheses
        backtrack(n, 0, 0, currentCombination, solution);

        // Return the list of all valid parentheses combinations
        return solution;
    }
};
```

Java

```java
import java.util.*;

class Solution {
    public void backtrack(
        int n,
        int open,
        int close,
        StringBuilder currentCombination,
        List<String> solution
    ) {

        // Base case: If the current combination has used all n pairs of
        // parentheses, add it to the solution
        if (currentCombination.length() == 2 * n) {

            // Store the valid combination
            solution.add(currentCombination.toString());
            return;
        }

        // If we can add an open parenthesis, do so and recurse
        if (open < n) {

            // Add an open parenthesis
            currentCombination.append('(');

            // Recurse with updated open count
            backtrack(n, open + 1, close, currentCombination, solution);

            // Backtrack (remove the last added parenthesis)
            currentCombination.deleteCharAt(
                currentCombination.length() - 1
            );
        }

        // If we can add a close parenthesis, do so and recurse
        if (close < open) {

            // Add a close parenthesis
            currentCombination.append(')');

            // Recurse with updated close count
            backtrack(n, open, close + 1, currentCombination, solution);

            // Backtrack (remove the last added parenthesis)
            currentCombination.deleteCharAt(
                currentCombination.length() - 1
            );
        }

// Diagram: public List<String> generateParentheses(int n) {

        // List to store all valid combinations
        List<String> solution = new ArrayList<>();

        // StringBuilder to build the current combination of parentheses
        StringBuilder currentCombination = new StringBuilder();

        // Start backtracking with 0 open and 0 close parentheses
        backtrack(n, 0, 0, currentCombination, solution);

        // Return the list of all valid parentheses combinations
        return solution;
    }
```

Typescript

```typescript
export class Solution {
    backtrack(
        n: number,
        open: number,
        close: number,
        currentCombination: string[],
        solution: string[]
    ): void {

        // Base case: If the current combination has used all n pairs of
        // parentheses, add it to the solution
        if (currentCombination.length === 2 * n) {

            // Store the valid combination
            solution.push(currentCombination.join(""));
            return;
        }

        // If we can add an open parenthesis, do so and recurse
        if (open < n) {

            // Add an open parenthesis
            currentCombination.push("(");

            // Recurse with updated open count
            this.backtrack(
                n,
                open + 1,
                close,
                currentCombination,
                solution
            );

            // Backtrack (remove the last added parenthesis)
            currentCombination.pop();
        }

        // If we can add a close parenthesis, do so and recurse
        if (close < open) {

            // Add a close parenthesis
            currentCombination.push(")");

            // Recurse with updated close count
            this.backtrack(
                n,
                open,
                close + 1,
                currentCombination,
                solution
            );

            // Backtrack (remove the last added parenthesis)
            currentCombination.pop();
        }

// Diagram: generateParentheses(n: number): string[] {

        // Array to store all valid combinations
        const solution: string[] = [];

        // Temporary array to store the current combination of
        // parentheses
        const currentCombination: string[] = [];

        // Start backtracking with 0 open and 0 close parentheses
        this.backtrack(n, 0, 0, currentCombination, solution);

        // Return the array of all valid parentheses combinations
        return solution;
    }
```

Javascript

```javascript
export class Solution {
    backtrack(n, open, close, currentCombination, solution) {

        // Base case: If the current combination has used all n pairs of
        // parentheses, add it to the solution
        if (currentCombination.length === 2 * n) {

            // Store the valid combination
            solution.push(currentCombination.join(""));
            return;
        }

        // If we can add an open parenthesis, do so and recurse
        if (open < n) {

            // Add an open parenthesis
            currentCombination.push("(");

            // Recurse with updated open count
            this.backtrack(
                n,
                open + 1,
                close,
                currentCombination,
                solution
            );

            // Backtrack (remove the last added parenthesis)
            currentCombination.pop();
        }

        // If we can add a close parenthesis, do so and recurse
        if (close < open) {

            // Add a close parenthesis
            currentCombination.push(")");

            // Recurse with updated close count
            this.backtrack(
                n,
                open,
                close + 1,
                currentCombination,
                solution
            );

            // Backtrack (remove the last added parenthesis)
            currentCombination.pop();
        }

// Diagram: generateParentheses(n) {

        // Array to store all valid combinations
        const solution = [];

        // Temporary array to store the current combination of
        // parentheses
        const currentCombination = [];

        // Start backtracking with 0 open and 0 close parentheses
        this.backtrack(n, 0, 0, currentCombination, solution);

        // Return the array of all valid parentheses combinations
        return solution;
    }
```

Python

```python
from typing import List

class Solution:
    def backtrack(
        self,
        n: int,
        open: int,
        close: int,
        current_combination: List[str],
        solution: List[str],
    ) -> None:

        # Base case: If the current combination has used all n pairs of
        # parentheses, add it to the solution
        if len(current_combination) == 2 * n:
            solution.append("".join(current_combination))
            return

        # If we can add an open parenthesis, do so and recurse
        if open < n:

            # Add an open parenthesis
            current_combination.append("(")

            # Recurse with updated open count
            self.backtrack(
                n, open + 1, close, current_combination, solution
            )

            # Backtrack (remove the last added parenthesis)
            current_combination.pop()

        # If we can add a close parenthesis, do so and recurse
        if close < open:

            # Add a close parenthesis
            current_combination.append(")")

            # Recurse with updated close count
            self.backtrack(
                n, open, close + 1, current_combination, solution
            )

            # Backtrack (remove the last added parenthesis)
            current_combination.pop()

    def generate_parentheses(self, n: int) -> List[str]:

        # List to store all valid combinations
        solution = []

        # Temporary list to store the current combination of parentheses
        current_combination = []

        # Start backtracking with 0 open and 0 close parentheses
        self.backtrack(n, 0, 0, current_combination, solution)

        # Return the list of all valid parentheses combinations
        return solution
```

.

## Example problems

Most problems that fall under this category are**medium**or **hard**problems; a list of a few is given below.

> -   **[String permutations](https://www.codeintuition.io/courses/backtracking/5_fmXxS8tuCRVuwe5Rker)**
> -   **[Target sum combinations](https://www.codeintuition.io/courses/backtracking/cSpk4BcXCiyL89PTOFCyM)**
> -   **[Generate parentheses](https://www.codeintuition.io/courses/backtracking/-xhgaEmiz9mw4lW6l_CFC)**
> -   **[Generate IP addresses](https://www.codeintuition.io/courses/backtracking/sBQbNSN0kLWVCOqmnUC4j)**

We will now solve these problems to gain a deeper understanding of the conditional enumeration pattern.

***

# Generate parentheses

## Problem Statement

Given a positive integer **n**, write a function to generate and return a list of all possible combinations of well-formed parentheses with n pairs. You can return the output in **any order**.

### Example 1

> -   **Input:** n = 2
> -   **Output:** \[(()), ()()\]
> -   **Explanation:** Above is the list of all well-formed parentheses that can be formed for n = 2.

### Example 2

> -   **Input:** n = 1
> -   **Output:** \[()\]
> -   **Explanation:** Above is the list of all well-formed parentheses that can be formed for n = 1.

### Example 3

> -   **Input:** n = 0
> -   **Output:** \[\]
> -   **Explanation:** No parentheses can be formed for n = 0.

## Solution

```cpp
using namespace std;

class Solution {
public:
    string getChoices(int n, int open, int close) {

        string choices = "";

        // Can add an open parenthesis if we haven't used all n
        if (open < n) {
            choices += '(';
        }

        // Can add a close parenthesis if we have more opens than closes
        if (close < open) {
            choices += ')';
        }

        return choices;
    }

    void generateCombinations(
        int n,
        int open,
        int close,
        string &currentCombination,
        vector<string> &combinations
    ) {

        // If the current combination has used all n pairs of parentheses
        // (solution state)
        if (currentCombination.size() == 2 * n) {

            // Store the valid combination
            combinations.push_back(currentCombination);

            // Return to continue exploring other possibilities
            return;
        }

        // Get all valid choices for the current position
        string choices = getChoices(n, open, close);

        // Loop through all valid choices
        for (char choice : choices) {

            // Add the chosen bracket to the current combination (make
            // choice)
            currentCombination.push_back(choice);

            // If the choice is an opening bracket, recur by increasing
            // open count
            if (choice == '(') {
                generateCombinations(
                    n, open + 1, close, currentCombination, combinations
                );
            }

            // Else if the choice is a closing bracket, recur by
            // increasing close count
            else {
                generateCombinations(
                    n, open, close + 1, currentCombination, combinations
                );
            }

            // Backtrack by removing the last added bracket (revert
            // choice)
            currentCombination.pop_back();
        }
    }

    vector<string> generateParentheses(int n) {

        // Vector to store all valid combinations
        vector<string> combinations;

        // String to build the current combination of parentheses (state)
        string currentCombination;

        // Start the unconditional enumeration process with 0 open and 0
        // close
        generateCombinations(n, 0, 0, currentCombination, combinations);

        // Return the list of all valid parentheses combinations
        return combinations;
    }
};
```

***

# Target sum combinations

## Problem Statement

Given an array **arr** that contains distinct integers and an integer **target**, write a function to return a list of all unique combinations of the numbers in arr that add up to the target. You can return the list of combinations in **any order**.

You may use the same number from arr as many times as necessary to reach the target sum. Two combinations are considered unique if the frequency of at least one of the chosen numbers differs. 

### Example 1

> -   **Input:** arr = \[2, 3, 5\], target = 8
> -   **Output:** \[\[2, 2, 2, 2\], \[2, 3, 3\], \[3, 5\]\]
> -   **Explanation:** Above is the list of all the combinations for arr = \[2, 3, 5\] and target = 8.

### Example 2

> -   **Input:** arr = \[2, 3, 6, 7\], target = 7
> -   **Output:** \[\[2, 2, 3\], \[7\]\]
> -   **Explanation:** Above is the list of all the combinations for arr = \[2, 3, 6, 7\] and target = 7.

### Example 3

> -   **Input:** arr = \[1, 2, 3\], target = 4
> -   **Output:** \[\[1, 1, 1, 1\], \[1, 1, 2\], \[1, 3\], \[2, 2\]\]
> -   **Explanation:** Above is the list of all the combinations for arr = \[1, 2, 3\] and target = 4.

## Solution

```cpp
#include <algorithm>

using namespace std;

class Solution {
public:
    void generateCombinations(
        vector<int> &arr,
        int target,
        int index,
        vector<int> &currentCombination,
        vector<vector<int>> &combinations
    ) {

        // If the current combination adds up to the target, store it
        // (solution state)
        if (target == 0) {

            // Store the current combination
            combinations.push_back(currentCombination);

            // Return to continue exploring other possibilities
            return;
        }

        // Loop through all possible choices starting from 'index' index
        for (int i = index; i < arr.size(); i++) {

            // Skip numbers greater than the remaining target
            if (arr[i] > target) {
                continue;
            }

            // Include the current number in the combination (make
            // choice)
            currentCombination.push_back(arr[i]);

            // Recurse with updated target
            // Note: 'i' is passed to allow reuse of the same number
            generateCombinations(
                arr, target - arr[i], i, currentCombination, combinations
            );

            // Backtrack by removing the last added number (revert
            // choice)
            currentCombination.pop_back();
        }
    }

    vector<vector<int>> targetSumCombinations(
        vector<int> &arr,
        int target
    ) {

        // Sort the array to ensure combinations are generated in
        // ascending order
        sort(arr.begin(), arr.end());

        // Vector to store all valid combinations (solution states)
        vector<vector<int>> combinations;

        // Temporary vector to store the current combination (state)
        vector<int> currentCombination;

        // Start the conditional enumeration (backtracking) process from
        // index 0
        generateCombinations(
            arr, target, 0, currentCombination, combinations
        );

        // Return the list of all valid target sum combinations
        return combinations;
    }
};
```

***

# Generate IP addresses

## Problem Statement

Given a string **s** which consists only of digits, write a function to find and return a list of all possible valid IP addresses that can be formed by adding dots into the string. You can return the answer in **any order**.

Each IP address must have exactly four integers separated by single dots and each integer must be between `0` and `255` (inclusive). The IP address must not contain any leading zeros. This means that, for example, `0.1.2.201` is valid, but `00.1.2.201` is not.

### Example 1

> -   **Input:** s = 25525512235
> -   **Output:** \[255.255.12.235, 255.255.122.35\]
> -   **Explanation:** Above is the list of all valid IP addresses that can be formed.

### Example 2

> -   **Input:** s = 025511135
> -   **Output:** \[0.255.11.135, 0.255.111.35\]
> -   **Explanation:** Above is the list of all valid IP addresses that can be formed.

### Example 3

> -   **Input:** s = 789
> -   **Output:** \[\]
> -   **Explanation:** No valid IP address can be formed for the above string.

## Solution

```cpp
#include <algorithm>

using namespace std;

class Solution {
public:

    // Join the four parts of the IP address into a single string
    string join(const vector<string> &parts) {
        return parts[0] + "." + parts[1] + "." + parts[2] + "." +
               parts[3];
    }

    // Check if a part of the IP address is valid
    bool isValidPart(const string &part) {

        // Leading zeros are invalid unless the part is exactly "0"
        if (part.size() > 1 && part[0] == '0') {
            return false;
        }

        // Convert part to integer and check range
        int value = stoi(part);

        // Valid if in the range 0-255
        return value >= 0 && value <= 255;
    }

    // Get all valid segments starting from index
    vector<string> getSegments(const string &s, int index) {

        vector<string> segments;

        // Loop through possible substring lengths (1 to 3)
        for (int len = 1; len <= 3; ++len) {

            // Ensure we do not exceed the bounds of the string
            if (index + len > s.size()) {
                break;
            }

            // Extract the substring for the current segment
            string part = s.substr(index, len);

            // Only include valid segments
            if (isValidPart(part)) {
                segments.push_back(part);
            }
        }

        return segments;
    }

    void generateCombinations(
        const string &s,
        int index,
        vector<string> &currentSegments,
        vector<string> &ipAddresses
    ) {

        // If the current state has 4 segments, check for solution
        if (currentSegments.size() == 4) {

            // If all characters in the string are used, store the
            // solution
            if (index == s.size()) {
                ipAddresses.push_back(join(currentSegments));
            }

            // Return to continue exploring other possibilities
            return;
        }

        // Get all valid segments (choices) starting at this index
        vector<string> segments = getSegments(s, index);

        // Loop through all valid choices
        for (const string &segment : segments) {

            // Include the current part in the state (make choice)
            currentSegments.push_back(segment);

            // Recurse with updated control (next starting index)
            generateCombinations(
                s, index + segment.size(), currentSegments, ipAddresses
            );

            // Backtrack by removing the last added part (revert choice)
            currentSegments.pop_back();
        }
    }

    vector<string> generateIPAddresses(const string &s) {

        // Vector to store all valid IP addresses (solution states)
        vector<string> ipAddresses;

        // Temporary vector to store the current IP segments (state)
        vector<string> currentSegments;

        // Start the unconditional enumeration (backtracking) process
        // from index 0
        generateCombinations(s, 0, currentSegments, ipAddresses);

        // Return the list of all valid IP addresses
        return ipAddresses;
    }
};
```

***

# String permutations

## Problem Statement

Given a string **s**, write a function to return a list containing all the permutations of the string. You can return the list in **any order**.

It is guaranteed that the length of the input string will not exceed more than five characters.

## Example 1

## Example 2

> -   **Input:** s = abc
> -   **Output:** \[abc, acb, bac, bca, cab, cba\]
> -   **Explanation:** These are all the permutations of the string.

## Solution

```cpp
using namespace std;

class Solution {
public:
    void generatePermutations(
        string &state,
        int index,
        vector<string> &result
    ) {

        // If index reaches the end of the string, we have found a
        // permutation (solution state)
        if (index == state.length()) {

            // Add the current permutation (string) to the result vector
            result.push_back(state);

            // Return to continue exploring other possibilities
            return;
        }

        // Loop through the characters starting from the current index
        // to generate permutations (dynamic choices)
        for (int i = index; i < state.length(); i++) {

            // Swap the characters at the current index and i to create a
            // new permutation (make choice)
            swap(state[index], state[i]);

            // Recursively call generate for the remaining characters
            // (reduced input -> index + 1)
            generatePermutations(state, index + 1, result);

            // Swap back the characters to revert to the original string
            // (revert choice)
            swap(state[index], state[i]);
        }
    }

    vector<string> stringPermutations(string s) {

        // Vector to store the permutations
        vector<string> result;

        // Start the conditional enumeration process from index 0
        generatePermutations(s, 0, result);

        // Return the vector containing all permutations
        return result;
    }
};
```
