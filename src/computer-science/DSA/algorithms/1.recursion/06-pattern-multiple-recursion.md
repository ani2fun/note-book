# Understanding multiple recursion

Multiple recursion is when a recursive function calls itself multiple times during its execution. Unlike simple recursion, where the problem space is reduced linearly with every recursive call, multiple recursion branches out into more than one subproblem during the execution of a single function call. The results from some or all of these branches must be considered when calculating the outcome for each step. 

// Diagram: The multiple recursion pattern is the classification of problems that can be solved using multiple recursion

// Diagram: Multiple recursion is when the recursive function calls itself many times.

## Multiple recursion

A multiple-recursive function makes more than one recursive function call during its execution, branching off to many subproblems. The recursive function call can be placed either at the top (head recursion) or the end (tail recursion) of the code block. However, in most cases, it is placed in the middle of the code block.

// Diagram: In multiple recursion, the recursive calls are usually made after some initial processing.

Since the recursive function calls are generally made in the middle of the function code block, some processing in the function is already done before making the recursive calls. And so, this processed data is often passed down to the recursive function as the `aggregate` argument. The data received from all the recursive calls is aggregated and further processed before returning the solution to its caller.

Note that not all multiple recursive functions may pass down an aggregate.

// Diagram: Multiple recursive functions may often pass down results of processing in previous steps as an aggregate to the next steps.

Consider we have a recursive function that takes an input `n` and `aggregate` value from the caller, where every step makes `k` recursive calls. We have functions `h1 , h2 , . . . , hk` that break down the input for each of the successive recursive calls and functions `g1 , g2 , . . . , gk` that use the aggregate value passed down from the caller to create the aggregate value for the corresponding recursive call. We also have a function `G` that aggregates the results from all recursive calls and does some processing to compute the final results for a step.

The number of recursive calls made at each step is called the branching factor of the recursion. It does not have to be the same for every step. In this example, we use `k` to denote the branching factor and assume every step makes `k` recursive calls to keep things simple.

Note that not all multiple-recursive functions carry the processed data as an aggregate. The generic equation below still applies; however, the aggregate term is optional and varies depending on the problem.

This makes the general recursive equation for multiple recursion of the following form:

// Diagram: The general recursive equation for multiple recursion.

The pseudocode for the general recursive equation above looks like the following. Some preprocessing is done in each step using the input `n` and the passed `aggregate` before making a recursive call, and the outcome of all recursive calls is aggregated and further processed to generate a solution for that step. In the pseudocode given below, the function `G` is used to incrementally aggregate the results returned from recursive calls.

// Diagram: The pseudocode for the general equation for multiple recursion.

Note that as the problem space is broken down into smaller subproblems in every function call, tracing these recursive calls results in a tree-like layout being created, often called the **recursion tree**. It is important to note that the recursion tree grows exponentially with the depth of recursion, as every function call branches out into multiple recursive calls until it hits the base case.

// Diagram: The recursion tree for multiple recursion.

Also, sometimes multiple subproblems may overlap, leading to the same problem being solved multiple times through different paths in the recursion tree. This happens when the function `h` that reduces the input returns the same values for different inputs.

Multiple recursion forms the foundation of more advanced techniques like backtracking, divide and conquer and dynamic programming.

Given below is an example where the function `h` returns the same value for the 1st and 3rd call and the 5th and kth call, respectively.

// Diagram: gi ( i , aggregate , n)

Upon reaching the base case, a known solution is passed back to the calling function, and the stack unwinds. The calling function receives data from multiple recursive calls and generally aggregates them together using the function `G`. This aggregated result is then passed back to the caller, which does the same for all its recursive calls. This process is repeated until the top-level recursive call unwinds and passes the final result to its calling function.

// Diagram: Results from all recursive calls are aggregated and processed before sending the result to the caller at each step.

The data can be passed down from the caller to the called function and back up in many different ways, the choice of which depends on the problem, programming language and ease of implementation.

## Passing data down

Since the recursive function calls are generally made in the middle of the function code block, some processing in the function is already done before making the recursive calls. And so, this processed data is passed down to the recursive function as the `aggregate` argument. All intermediate steps in the recursive calls use the passed `aggregate` along with the input to compute a new aggregate value for their `ith` recursive calls. The base case is where the `aggregate` value is generally used to calculate the result.

For cases where the functions `g` **does** **not update** the passed `aggregate` value, but instead, returns an updated value that should be passed down, we can store it in a local variable `newAggregate` and pass it down as `aggregate` in the recursive call. The same variable can be overwritten for successive recursive calls and passed down as the `aggregate` for all the recursive calls.

For low-level programming languages like C++, the arguments are always passed by copy. And so, locally created `newAggregate` is copied when passed as arguments to the recursive function call. This incurs a copy overhead every time a recursive call is made and can be less performant when `aggregate` is a container-type data structure like arrays, lists, trees, etc.

// Diagram: Argument data is passed by copy in low-level programming languages.

In low-level programming languages, to avoid expensive copies being made every time `newAggregate` is passed down to the caller, we can pass it as a reference to the caller. Since the recursive calls are made sequentially in every step, we can **reuse** the variable `newAggregate` to store the updated value of `aggregate` computed by `g` for the `ith` recursive call for `1 <= i <= k`. This way, every step holds a reference to `newAggregate` that was created in its caller which it can use in its call to function `g` as `aggregate` reducing the number of copies being created.

In high-level programming languages like Java, JavaScript and Python, arguments are usually always passed by reference, and so, this is the default behaviour if a local variable `newAggregate` is created at every step.

// Diagram: Local data created in a function call can be passed by reference to the next recursive calls.

Another case is where the function `g` **updates** the passed `aggregate` value instead of returning an updated copy. In these cases, if there also exist inverse functions `g'` that can remove the contribution of `g` from `aggregate` at every step, we can often create and share a single copy of aggregate between all the steps.

The single copy is created in the caller of the top-level recursive function and passed down as a reference when making the first recursive function call. Every step in the recursive tree, in its `ith` iteration uses the function `g` to add its contribution to `aggregate` and passes it down in its `ith` recursive call as reference. When the called function returns to the caller, the caller uses `g'` to remove the contribution of `g` from `aggregate` to restore it to its original state (as received from the caller) to be used in the next iteration.

The general pseudocode to pass down data this way is given below.

// Diagram: The pseudocode for a general multiple recursive function where the passed aggregate is updated.

This way, the same copy of `aggregate` can be shared by all the steps in the recursive function.

In high-level programming languages like Java, JavaScript and Python, arguments are usually always passed by reference, and so, this is the default behaviour if `aggregate` is created in the caller of the top-level recursive function.

// Diagram: Every step in the recursive call updates the aggregate before making the ith recursive call and reverts the update after the call finishes.

## Passing data up

The data can be passed up from the called function to the calling function either by returning a copy of its local variable, a reference to its local variable or by updating a reference passed down by the caller. All these ways have their pros and cons, and the choice depends on the problem, programming language and the ease of implementation.

For multiple recursion, data is usually always passed back as a return value. For low-level programming languages like C++, values are always returned by copy, which incurs a copy overhead every time a recursive function ends and can be less performant when passing container-type data structures like arrays, lists, trees, etc.

// Diagram: The data is returned as a copy in low-level programming languages.

For high-level programming languages like Java, JavaScript and Python, all local data is also created on the heap memory and only references to it are local. And so, when a non-primitive type value is returned, the calling function stores the reference to the same data in its local variable.

// Diagram: The data is returned as a reference for high-level programming languages.

To avoid unnecessary copy operations in low-level programming languages when non-primitive datatypes are involved, we can create a single copy of the data of the return type `solution` in the caller of the top-level recursive function and pass it down as a reference. Then, the recursive function doesn't need to return a value; it can update the data held in the reference when a solution is found (generally in the base case).

This method is usually used when the caller does not need to aggregate results generated by all its recursive calls.

Since the same copy of `solution` is shared across all function calls, the caller can access the updates made by its recursive calls. This way, there is always a single copy of  `solution`, which can be updated by any node in the recursive tree when a solution is found.

In high-level programming languages like Java, JavaScript and Python, arguments are usually always passed by reference, and so, this is the default behaviour if `solution` is created in the caller of the top-level recursive function.

// Diagram: A single copy of data can be shared between all function calls to pass back data to the caller.

There is no one right or wrong way to pass data up and down in multiple recursions, and the choice depends on the problem and the programming language used. The performance of these operations varies across different programming languages, depending on the number of copies made of the arguments and returned data.

In most cases of multiple recursion `aggregate` is usually a container type data structure that is passed by reference. Each step updates it in place and passes it down to the recursive call. Once a recursive call finishes, `aggregate` is reset to the original state as received from the caller. The solution is usually passed back up as a return value. So, we will only look at this pattern in the algorithm and implementation section.

## Algorithm

The steps given below summarise the implementation for the generic multiple-recursive function, where `aggregate` is passed by reference and updated in each step before passing it down as a reference, and `solution` is passed back up to the calling function as a return value. Note that we reset `aggregate` in each iteration after making the recursive call using the function `` g` ``.

// Diagram: Note that the value of k is dependent on the problem and may be different for each recursive call

> **multipleRecursion(input, \[ref\] aggregate)**
>
> -   **Step 1:** If \`input\` is the base case, return known solution
> -   **Step 2:** Initialize \`solution\` to a default value
> -   **Step 2:** Iterate \`k\` times using the variableand do the following:
>     -   **Step 2.1:** Calculate the \`newInput\` for this iteration using the function \`h\`
>     -   **Step 2.2:** Update \`aggregate\` using the function \`g\`
>     -   **Step 2.3:** \`result\` = Call \`multipleRecursion(newInput, aggregate)\`
>     -   **Step 2.4:** Add the contribution of \`result\` in \`solution\` using the function \`G\`
>     -   **Step 2.5:** Reset aggregate to original state by using \`g\` \`
> -   **Step 4:** Return \`solution\`

## Implementation

Given below is the implementation for the generic multiple-recursive equation using multiple recursion, where the `aggregate` is a list that is passed down by reference. The function `g` updates `aggregate` in each iteration of each step before making the recursive call. Once the recursive call finishes, we use the function `gInverse` to remove the previous updates from `aggregate` to pass it to the recursive call in the next iteration.  The `result` from the recursive calls are aggregated into `solution` using the function `G` which is then returned to the caller when the function ends.

C++

```cpp
class Solution
{
public:
  int multipleRecursion(int N, vector<int> &aggregate)
  {

    // Base case: If N is less than or equal to 0, we have reached
    // the end of recursion
    if (N <= 0)
    {

      // Exit the function, as there are no more numbers to add
      return 0; // Solution for the base case
    }

    // Number of recursive calls to make at each level
    // This is dependent on the proble
    int k = 3;

// Diagram: int solution = 0; // Initialize solutio to a default value

    for (int i = 0; i < k; i++)
    {
      // Compute new input based on i, N, and aggregate
      int newInput = h(i, N, aggregate);

      // Add the current iteration's contribution to the aggregate
      g(i, N, aggregate);

      // Recursive call with new values
      int result = multipleRecursion(newInput, aggregate);

      // Combine the result with the current solution
      solution = G(N, solution, result);

      // Restore aggregate if necessary
      gInverse(i, N, aggregate);
    }
    return solution; // Return the final solution
  }

private:
  // Placeholder for h - use the iteration, input and aggregate
  //  to compute the new input
  int h(int iteration, int input, int aggregate)
  {
    // Implement your logic here
    return 0;
  }
  // Placeholder for g - use the iteration, input and aggregate
  //  to update aggregate
  void g(int iteration, int input, int aggregate)
  {
    // Implement your logic here
  }

  // Placeholder for gInverse - use the iteration, input and aggregate
  // to revert the updates made by g
  void gInverse(int iteration, int input, int aggregate)
  {
    // Implement your logic here
  }
  // Placeholder for G - use the input, existing solution,
  //  and result from the recursive call to compute the new solution
  int G(int input, int solution, int result)
  {
    // Implement your logic here
    return 0;
  }
};
```

Java

```java
import java.util.List;

// Diagram: class Solution {

// Diagram: public int multipleRecursion(int N, List<Integer> aggregate) {

        // Base case: If N is less than or equal to 0, we have reached
        // the end of recursion
        if (N <= 0) {

            // Exit the function, as there are no more numbers to add
            return 0; // Solution for the base case
        }

        // Number of recursive calls to make at each level
        // This is dependent on the problem
        int k = 3;

// Diagram: int solution = 0; // Initialize solution to a default value

        for (int i = 0; i < k; i++) {
            // Compute new input based on i, N, and aggregate
            int newInput = h(i, N, aggregate);

            // Add the current iteration's contribution to the aggregate
            g(i, N, aggregate);

            // Recursive call with new values
            int result = multipleRecursion(newInput, aggregate);

            // Combine the result with the current solution
            solution = G(N, solution, result);

            // Restore aggregate if necessary
            gInverse(i, N, aggregate);
        }
        return solution; // Return the final solution
    }

    // Placeholder for h - use the iteration, input and aggregate
    // to compute the new input
    private int h(int iteration, int input, List<Integer> aggregate) {
        // Implement your logic here
        return 0;
    }

    // Placeholder for g - use the iteration, input and aggregate
    // to update aggregate
    private void g(int iteration, int input, List<Integer> aggregate) {
        // Implement your logic here
    }

    // Placeholder for gInverse - use the iteration, input and aggregate
    // to revert the updates made by g
    private void gInverse(int iteration, int input, List<Integer> aggregate) {
        // Implement your logic here
    }

    // Placeholder for G - use the input, existing solution,
    // and result from the recursive call to compute the new solution
    private int G(int input, int solution, int result) {
        // Implement your logic here
        return 0;
    }
```

Typescript

```typescript
class Solution {
  multipleRecursion(N: number, aggregate: number[]): number {
    // Base case: If N is less than or equal to 0, we have reached
    // the end of recursion
    if (N <= 0) {
      // Exit the function, as there are no more numbers to add
      return 0; // Solution for the base case
    }

    // Number of recursive calls to make at each level
    // This is dependent on the problem
    const k = 3;

// Diagram: let solution = 0; // Initialize solution to a default value

    for (let i = 0; i < k; i++) {
      // Compute new input based on i, N, and aggregate
      const newInput = this.h(i, N, aggregate);

      // Add the current iteration's contribution to the aggregate
      this.g(i, N, aggregate);

      // Recursive call with new values
      const result = this.multipleRecursion(newInput, aggregate);

      // Combine the result with the current solution
      solution = this.G(N, solution, result);

      // Restore aggregate if necessary
      this.gInverse(i, N, aggregate);
    }
    return solution; // Return the final solution
  }

  // Placeholder for h - use the iteration, input and aggregate
  // to compute the new input
  private h(iteration: number, input: number, aggregate: number[]): number {
    // Implement your logic here
    return 0;
  }

  // Placeholder for g - use the iteration, input and aggregate
  // to update aggregate
  private g(iteration: number, input: number, aggregate: number[]): void {
    // Implement your logic here
  }

  // Placeholder for gInverse - use the iteration, input and aggregate
  // to revert the updates made by g
  private gInverse(iteration: number, input: number, aggregate: number[]): void {
    // Implement your logic here
  }

  // Placeholder for G - use the input, existing solution,
  // and result from the recursive c
```

Javascript

```javascript
class Solution {
  multipleRecursion(N, aggregate) {
    // Base case: If N is less than or equal to 0, we have reached
    // the end of recursion
    if (N <= 0) {
      // Exit the function, as there are no more numbers to add
      return 0; // Solution for the base case
    }

    // Number of recursive calls to make at each level
    // This is dependent on the problem
    const k = 3;

// Diagram: let solution = 0; // Initialize solution to a default value

    for (let i = 0; i < k; i++) {
      // Compute new input based on i, N, and aggregate
      const newInput = this.h(i, N, aggregate);

      // Add the current iteration's contribution to the aggregate
      this.g(i, N, aggregate);

      // Recursive call with new values
      const result = this.multipleRecursion(newInput, aggregate);

      // Combine the result with the current solution
      solution = this.G(N, solution, result);

      // Restore aggregate if necessary
      this.gInverse(i, N, aggregate);
    }
    return solution; // Return the final solution
  }

  // Placeholder for h - use the iteration, input and aggregate
  // to compute the new input
  h(iteration, input, aggregate) {
    // Implement your logic here
    return 0;
  }

  // Placeholder for g - use the iteration, input and aggregate
  // to update aggregate
  g(iteration, input, aggregate) {
    // Implement your logic here
  }

  // Placeholder for gInverse - use the iteration, input and aggregate
  // to revert the updates made by g
  gInverse(iteration, input, aggregate) {
    // Implement your logic here
  }

  // Placeholder for G - use the input, existing solution,
  // and result from the recursive call to compute the new solution
  G(input, solution, result) {
    // Implement your logic here
    return 0;
  }
```

Python

```python
from typing import List

class Solution:
    def multipleRecursion(self, N: int, aggregate: List[int]) -> int:

        # Base case: If N is less than or equal to 0, we have reached
        # the end of recursion
        if N <= 0:
            # Exit the function, as there are no more numbers to add
            return 0  # Solution for the base case

        # Number of recursive calls to make at each level
        # This is dependent on the problem
        k = 3

// Diagram: solution = 0 # Initialize solution to a default value

        for i in range(k):
            # Compute new input based on i, N, and aggregate
            new_input = self.h(i, N, aggregate)

            # Add the current iteration's contribution to the aggregate
            self.g(i, N, aggregate)

            # Recursive call with new values
            result = self.multipleRecursion(new_input, aggregate)

            # Combine the result with the current solution
            solution = self.G(N, solution, result)

            # Restore aggregate if necessary
            self.gInverse(i, N, aggregate)

// Diagram: return solution # Return the final solution

    # Placeholder for h - use the iteration, input and aggregate
    # to compute the new input
    def h(self, iteration: int, input: int, aggregate: List[int]) -> int:
        # Implement your logic here
        pass

    # Placeholder for g - use the iteration, input and aggregate
    # to update aggregate
    def g(self, iteration: int, input: int, aggregate: List[int]) -> None:
        # Implement your logic here
        pass

    # Placeholder for gInverse - use the iteration, input and aggregate
    # to revert the updates made by g
    def gInverse(self, iteration: int, input: int, aggregate: List[int]) -> None:
        # Implement your logic here
        pass

    # Placeholder for G - use the input, existing solution,
    # and result from the recursive call to compute the new solution
    def G(self, input: int, solution: int, result: int) -> int:
        # Implement your logic here
        pass
```

## Complexity Analysis

The time complexity for a multiple-recursive algorithm depends on many things. It depends on the recursive equation, the functions `h`, `g` , and `G` , the branching factor `k` and the time taken to copy the arguments and the return values. Assuming that every step in recursion makes **exactly** `k` recursive calls, where every call **linearly decreases** the input, converging to the base case, and all the functions `h`, `g` , and `G` take constant time. Also, we assume that the data passed is passed up and down for low-level programming languages as copy and the copy operation takes constant **O(1)** time or all data is passed up and down as references.

If with every recursive call from top to bottom, the input **N** is reduced linearly, the maximum depth of recursion will be **N**. The top-level function makes `k` recursive calls, each of which makes `k` recursive calls, and this repeats **N** times, totalling **~** **k^N** recursive calls. Since every recursive call only does constant time operations, the time complexity of the algorithm is **O(k^N)** in any case.

// Diagram: The maximum recursion depth is N and the total number of recursive calls is k^N

For low-level languages like C++, if container-type data structures like arrays, trees, etc, are passed up or down as copies, it adds linear time complexity **O(M)** where **M** is the size of the container. This results in an overall time complexity of **O(M\*k^N)** in any case.

Since the function call stack goes up to a depth of **N**, and every instance of the function call makes only a constant number of local variables, the space complexity is also linear **O(N)**,in any case.

> **Best Case**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(k^N)**
>
> **Worst Case**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(k^N)**

***

# Identifying multiple recursion

Multiple recursion is a very powerful technique that forms the basis of backtracking and dynamic programming and can solve a wide variety of problems. Most problems that are solved by multiple recursion are medium or hard problems, where the problem can be broken down into multiple subproblems at every stage, and the final solution is created by aggregating results from all the subproblems. In some cases, the results of processing data in each step may be passed down to successive recursive calls as state information necessary for further processing. The results in the case of multiple recursion are usually built in the bottom-to-top order.

Most recursive problems where the solution is created by combining results from multiple smaller subproblems that must be explored simultaneously can be solved by multiple recursion.

It is important to note that most problems that can be solved using multiple recursion can be optimized with dynamic programming.

If the recursive equation for a problem fits in the template of the generic multiple recursive equation, it can be solved by multiple recursion.

// Diagram: The general recursive equation for multiple recursion.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using multiple recursion.

> **Problem statement:** Given an integer \`n\` and a set of integers \`steps\` where every integer is less than \`n\`, find the number of ways to climb \`n\` stairs if only steps in the \`steps\` list is allowed.

// Diagram: Find if the given list of digits is palindrome.

## Multiple recursion

Instead of climbing the stairs from bottom to top, if we look at the problem from a different perspective, we can see its recursive nature. The number of ways to climb **down** from the `nth` step to the ground will be equal to the number of ways to climb up from the ground as we can just follow the same steps. The recursive equation for the problem is given below.

// Diagram: The recursive equation from the problem.

Note that no aggregate is passed forward to the recursive calls in this case, as the processed result of any previous step is not needed by any subsequent step. The recursive equation fits the template for a generic multiple-recursive equation **without the aggregate**, and thus it can be solved using multiple recursion. 

// Diagram: The recursive equation for the problem fits the template for multiple recursion.

We create a recursive function that takes as input `n` and the list of allowed step sizes `steps` and returns the number of ways to climb down from the `nth` step. In each function, we initalize a variable `totalWays` to 0 that we will use to aggregate the results from all recursive calls. We then iterate over the `steps` list and in each iteration, subtract the current step from `n`, simulating a climb-down action. The resulting value is the remaining steps that we need to climb down, and we make a recursive call with the remaining steps to get the number of ways to climb down the remaining steps.

The return value from the recursive call in the `ith` iteration is the number of ways we can climb down from the current step if we take the `ith` step in the `steps` list. And so, we add all the return values to `totalWays` to count all the ways to climb down from the current step if we make all the choices in the `steps` array. At the end of all iterations, we return `totalWays` to the caller.

The base case occurs when the function is called with a 0 value, which means we need to find the number of ways to climb down from the 0th step (the ground itself), which is 1. Similarly, if the function is called with a negative value resulting from the subtraction in the caller, the answer should be 0, as there is no way to climb down from the negative step to the ground floor.

The implementation of the multiple-recursive solution to solve the problem is given below.

C++

```cpp
using namespace std;

class Solution {
public:
    int climbStairs(int N, vector<int> &steps) {

        //  Base case: If N is negative, there are no ways to
        // reach the ground
        if (N < 0) {
            return 0;
        }

        // Base case: If N is 0, there is one way to stay
        // at the ground
        if (N == 0) {
            return 1;
        }

        // Variable to store the total number of ways to reach
        // the ground
        int totalWays = 0;

        // Iterate through each possible step
        for (int step : steps) {

            // Recursive call to climbStairs with reduced N
            // Subtract the current step from N and add the
            // result to totalWays
            totalWays += climbStairs(N - step, steps);
        }

        // Return the total number of ways to reach the ground
        return totalWays;
    }
};
```

Java

```java
import java.util.*;

class Solution {
    public int climbStairs(int N, List<Integer> steps) {

        // Base case: If N is negative, there are no ways to
        // reach the ground
        if (N < 0) {
            return 0;
        }

        // Base case: If N is 0, there is one way to stay
        // at the ground
        if (N == 0) {
            return 1;
        }

        // Variable to store the total number of ways to reach
        // the ground
        int totalWays = 0;

        // Iterate through each possible step
        for (int step : steps) {

            // Recursive call to climbStairs with reduced N
            // Subtract the current step from N and add the
            // result to totalWays
            totalWays += climbStairs(N - step, steps);
        }

        // Return the total number of ways to reach the ground
        return totalWays;
    }
```

Typescript

```typescript
export class Solution {
    climbStairs(N: number, steps: number[]): number {

        // Base case: If N is negative, there are no ways to
        // reach the ground
        if (N < 0) {
            return 0;
        }

        // Base case: If N is 0, there is one way to stay
        // at the ground
        if (N === 0) {
            return 1;
        }

        // Variable to store the total number of ways to reach
        // the ground
        let totalWays = 0;

        // Iterate through each possible step
        for (const step of steps) {

            // Recursive call to climbStairs with reduced N
            // Subtract the current step from N and add the
            // result to totalWays
            totalWays += this.climbStairs(N - step, steps);
        }

        // Return the total number of ways to reach the ground
        return totalWays;
    }
```

Javascript

```javascript
class Solution {
    climbStairs(N, steps) {

        // Base case: If N is negative, there are no ways to
        // reach the ground
        if (N < 0) {
            return 0;
        }

        // Base case: If N is 0, there is one way to stay
        // at the ground
        if (N === 0) {
            return 1;
        }

        // Variable to store the total number of ways to reach
        // the ground
        let totalWays = 0;

        // Iterate through each possible step
        for (const step of steps) {

            // Recursive call to climbStairs with reduced N
            // Subtract the current step from N and add the
            // result to totalWays
            totalWays += this.climbStairs(N - step, steps);
        }

        // Return the total number of ways to reach the ground
        return totalWays;
    }
```

Python

```python
from typing import List

class Solution:
    def climb_stairs(self, n: int, steps: List[int]) -> int:

        # Base case: If n is negative, there are no ways to
        # reach the ground
        if n < 0:
            return 0

        # Base case: If n is 0, there is one way to stay
        # at the ground
        if n == 0:
            return 1

        # Variable to store the total number of ways to reach
        # the ground
        total_ways = 0

        # Iterate through each possible step
        for step in steps:

            # Recursive call to climb_stairs with reduced n
            # Subtract the current step from n and add the
            # result to total_ways
            total_ways += self.climb_stairs(n - step, steps)

        # Return the total number of ways to reach the ground
        return total_ways
```

The multiple-recursive solution can solve this problem using a concise recursive implementation.

## Example problems

Most problems that fall under this category are **easy**problems; a list of a few is given below.

> -   **[Fibonacci number](https://www.codeintuition.io/courses/recursion/bFHj-rMHhgF7349vbyI6s)**
> -   **[Zigzag sequence](https://www.codeintuition.io/courses/recursion/-f6UX_lI7gJuPPD7nnty8)**
> -   **[Climb stairs](https://www.codeintuition.io/courses/recursion/ojKyMVqi0nOuFByKhiiX9)**
> -   **[Catalan number](https://www.codeintuition.io/courses/recursion/hL3nerC7aAavgjMsMUlyH)**

We will now solve these problems to gain a better understanding of multiple recursion.

***

# Fibonacci number

## Problem Statement

Given a non-negative integer **N**, write a function to find and return the Nth Fibonacci number. 

The Fibonacci numbers commonly denoted by **F(n)** form the Fibonacci sequence. In this sequence, each number is the sum of the two numbers preceding itself in the sequence. The first two numbers of this sequence are `0` and `1`. 

// Diagram: Recursive equation for Fibonnaci sequence

You must do this **recursively**.

### Example 1

> -   **Input:** N = 3
> -   **Output:** 2
> -   **Explanation:** F(3) = F(2) + F(1) = 1 + 1 = 2.

### Example 2

> -   **Input:** N = 2
> -   **Output:** 1
> -   **Explanation:** F(2) = F(1) + F(0) = 1 + 0 = 1.

### Example 3

> -   **Input:** N = 0
> -   **Output:** 0
> -   **Explanation:** F(0) = 0.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int fibonacci(int N) {

        // Base case: If N is 0, return 0
        if (N == 0) {
            return 0;
        }

        // Base case: If N is 1, return 1
        if (N == 1) {
            return 1;
        }

        // To find the Nth Fibonacci number, we recursively
        // sum the (N-1)th and (N-2)th Fibonacci numbers since Fibonacci
        // series is defined as F(N) = F(N-1) + F(N-2).
        return fibonacci(N - 1) + fibonacci(N - 2);
    }
};
```

***

# Zigzag sequence

## Problem Statement

Given a non-negative integer **N**, write a function to find and return the Nth number in the zigzag sequence. 

A Zigzag Sequence is a sequence of numbers where the terms are alternately **increasing and decreasing**. This means that no three consecutive elements are in strictly increasing or strictly decreasing order. The first three numbers of this sequence are `0`, `1`, and `3`. 

// Diagram: Recursive equation for zigzag sequence

You must do this **recursively**.

### Example 1

> -   **Input:** N = 7
> -   **Output:** 2
> -   **Explanation:** Z(7) = Z(6) - Z(5) + Z(4) = 3 - 2 + 1 = 2.

### Example 2

> -   **Input:** N = 5
> -   **Output:** 2
> -   **Explanation:** Z(5) = Z(4) - Z(3) + Z(2) = 1 - 2 + 3 = 2.

### Example 3

> -   **Input:** N = 0
> -   **Output:** 1
> -   **Explanation:** Z(0) = 1.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int zigZagSequence(int N) {

        // Base case: If N is 0, we return 1 as the first
        // number in the ZigZag sequence
        if (N == 0) {
            return 1;
        }

        // Base case: If N is 1, we return 2 as the second
        // number in the ZigZag sequence
        if (N == 1) {
            return 2;
        }

        // Base case: If N is 2, we return 3 as the third
        // number in the ZigZag sequence
        if (N == 2) {
            return 3;
        }

        // Recursive case: For N greater than 2, we calculate
        // the Nth number in the ZigZag sequence using the
        // recurrence relation
        return zigZagSequence(N - 1) - zigZagSequence(N - 2) +
               zigZagSequence(N - 3);
    }
};
```

***

# Climb stairs

## Problem Statement

Given a non negative integer **N** and an array **steps**,where every integer in the array is less than N, write a function to find and return the total number of ways to climb N stairs if only step sizes in the steps array are allowed.

You must do this **recursively**.

### Example 1

> -   **Input:** N = 3, steps = \[1, 2, 3\]
> -   **Output:** 4
> -   **Explanation:** You can climb the three stairs in four possible ways by taking the following steps: (1, 1, 1), (1, 2), (2, 1), and (3).

### Example 2

> -   **Input:** N = 2, steps = \[2, 5, 6, 8\]
> -   **Output:** 1
> -   **Explanation:** You can climb the two stairs in one possible way by taking the following steps: (2)

### Example 3

> -   **Input:** N = 2, steps = \[8, 3, 6, 5\]
> -   **Output:** 0
> -   **Explanation:** Since every step size in the array is greater than 2, there are zero ways to climb the two-step staircase.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int climbStairs(int N, vector<int> &steps) {

        //  Base case: If N is negative, there are no ways to
        // reach the ground
        if (N < 0) {
            return 0;
        }

        // Base case: If N is 0, there is one way to stay
        // at the ground
        if (N == 0) {
            return 1;
        }

        // Variable to store the total number of ways to reach
        // the ground
        int totalWays = 0;

        // Iterate through each possible step
        for (int step : steps) {

            // Recursive call to climbStairs with reduced N
            // Subtract the current step from N and add the
            // result to totalWays
            totalWays += climbStairs(N - step, steps);
        }

        // Return the total number of ways to reach the ground
        return totalWays;
    }
};
```

***

# Catalan number

## Problem Statement

Given a non-negative integer **N**, write a function to find and return the Nth Catalan number.  

A Catalan Number is a sequence of natural numbers that occur in various combinatorial structures. It represents the number of distinct ways certain recursive patterns can be formed, such as the number of valid sequences of parentheses, different binary search trees, or ways to triangulate a polygon. 

// Diagram: Recursive equation for catalan numbers

You must do this **recursively**.

### Example 1

> -   **Input:** N = 7
> -   **Output:** 429
> -   **Explanation:** C₇ = (C₀ \* C₆) + (C₁ \* C₅) + (C₂ \* C₄) + (C₃ \* C₃) + (C₄ \* C₂) + (C₅ \* C₁) + (C₆ \* C₀) = 429

### Example 2

> -   **Input:** N = 5
> -   **Output:** 42
> -   **Explanation:** C₅ = (C₀ \* C₄) + (C₁ \* C₃) + (C₂ \* C₂) + (C₃ \* C₁) + (C₄ \* C₀) = 42

### Example 3

> -   **Input:** N = 0
> -   **Output:** 1
> -   **Explanation:** C₀ = 1

## Solution

```cpp
using namespace std;

class Solution {
public:
    int catalan(int N) {

        // Base case: The 0th Catalan number is 1
        if (N == 0) {
            return 1;
        }

        int result = 0;

        // Sum over all partitions
        for (int i = 0; i < N; i++) {

            // Recursive call to calculate the Catalan numbers
            // for the left and right subtrees
            result += catalan(i) * catalan(N - 1 - i);
        }

        // Return the Nth Catalan number
        return result;
    }
};
```
