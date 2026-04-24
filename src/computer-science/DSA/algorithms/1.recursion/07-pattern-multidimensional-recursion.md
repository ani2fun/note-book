# Understanding multidimensional recursion

Multidimensional recursion is a special case of recursion where the recursive function operates on an input that is defined by multiple dimensions, rather than just a single dimension. Unlike simple recursion, where the problem is reduced linearly with each recursive call, multidimensional recursion often explores an n-dimensional space simultaneously, reducing the input in one or more dimensions simultaneously.

The multidimensional recursion pattern is the classification of problems that can be solved using multidimensional recursion

// Diagram: Multidimensional recursion is when there is a multidimensional input to every recursive call.

## Multidimensional recursion

A multidimensional recursion can be seen as a more generalised form of recursion that starts from a starting state and explores multiple other states. A state is a complete description of the current situation in the recursive process that allows the function to continue solving the problem without any additional information.

A state is defined by a set of unique values that are unrelated to each other. The number of values required to define the state uniquely is called the dimension of the state. A state is often visualised as a circle with the values of each dimension inside it as given below.

// Diagram: The visualisation of a state with n dimensions.

For example, in a two-dimensional space, the combination of coordinates `x` and `y` defines a unique point. The point can be considered a state, and the variables `x` and `y` are its dimensions. Similarly, a three-dimensional space has three dimensions `x`, `y` and `z` that define a unique state in it.

// Diagram: Examples of two-dimensional and three-dimensional states.

In multidimensional recursion, we are often given a start state defined by some fixed values of all dimensions, and we explore all the states accessible from the starting state that reduce the problem spaces under some constraints until we hit a base condition. Unlike regular single-dimensional recursion, there can be multiple base cases in multidimensional recursion.

In most multidimensional recursive problems, no aggregate data is passed down, as is the case with the general multi-recursive and tail-recursive functions, and so we will not take it into consideration when looking at the general form of a multidimensional recursive equation.

Consider we have a recursive function `f` that takes a `n` dimensional input `d1, d2, d3 . . . , dn`  and where a set `E(d1, d2, d3 . . ., dn)` contains **multiple** lists of the form `s1, s2, s3, . . , sn` defining the shifts in each dimension allowed from that step. We also have a function `G` that aggregates the results from all recursive calls made from a step and does some processing to compute the final results for a step.

It is important to note that most multidimensional recursive equations have multiple recursive calls in each step.

This makes the general recursive equation for multidimensional recursion of the following form:

// Diagram: The general recursive equation for multidimensional recursion.

The pseudocode for the general recursive equation above looks like the following. At each step in the recursive process, we initialize a `solution` variable with a default value and iterate over the list of allowed shifts in `S ( d1 , d2 , . . . , dn )` . In each iteration, we add the shifts `s1 , s2 , . . . , sn` to the inputs `d1 , d2 , d3 , . . . , dn` to get the inputs for the next state to explore. A recursive call is then made using the computed input values for each dimension.

// Diagram: The pseudocode for the general equation for multidimensional recursion.

Since multidimensional recursion can potentially make multiple recursive calls in each step, its recursive path also traces a recursion tree where the root node is the starting state and all the other nodes are either intermediate states or base case states. It 

It is important to note that the recursion tree may not be perfect or symmetric, as, depending on the starting value of each dimension, some paths may reach the base case earlier than the others.

// Diagram: recursive call

Also, sometimes different paths may lead to the same state, leading to the same problem being solved multiple times through different paths in the recursion tree. This forms the basis of a dynamic programming technique called **memoisation** which is out of the scope of this course.

// Diagram: Multidimensional recursion can revisit the same states from different paths and solve the same subproblem multiple times.

Upon reaching the base case, a known solution is passed back to the calling function, and the stack unwinds. The calling function receives data from multiple recursive calls and aggregates them in `solution` using the function `G`. This aggregated result is then passed back to the caller, which does the same for all its recursive calls. This process is repeated until the top-level recursive call unwinds and passes the final result to its calling function.

It is important to note that for multidimensional recursion there can be many base cases depending on the problem.

// Diagram: Results from all recursive calls are aggregated and processed before sending the result to the caller at each step.

The data can be passed down from the caller to the called function and back up in many different ways, the choice of which depends on the problem, programming language and ease of implementation.

## Passing data down

For multidimensional recursion, the input is the values of all the dimensions that are passed as function arguments. These arguments are almost always primitive data types like integers or characters. Also, the input values for every step are computed at the step before it in the recursive process.

For both low-level and high-level programming languages, primitive data types are always passed by copy. And so, locally computed inputs for the next recursive call are copied when passed as arguments to the recursive function. Since all data copied is of primitive types, the copy overhead is not significant enough to consider.

// Diagram: In most programming languages, primitive data types passed as arguments are passed as a copy.

## Passing data up

The data can be passed up from the called function to the calling function either by returning a copy of its local variable, a reference to its local variable or by updating a reference passed down by the caller. All these ways have their pros and cons, and the choice depends on the problem, programming language and the ease of implementation.

For multidimensional recursion, data is usually always passed back as a return value. For low-level programming languages like C++, values are always returned by copy, which incurs a copy overhead every time a recursive function ends and can be less performant when passing container-type data structures like arrays, lists, trees, etc.

// Diagram: The data is returned as a copy in low-level programming languages.

For high-level programming languages like Java, JavaScript and Python, all local data is also created on the heap memory and only references to it are local. And so, when a non-primitive type value is returned, the calling function stores the reference to the same data in its local variable.

// Diagram: The data is returned as a reference for high-level programming languages.

To avoid unnecessary copy operations in low-level programming languages when non-primitive datatypes are involved, we can create a single copy of the data of the return type `solution` in the caller of the top-level recursive function and pass it down as a reference. Then, the recursive function doesn't need to return a value; it can update the data held in the reference when a solution is found (generally in the base case).

This method is usually used when the caller does not need to aggregate results generated by its recursive calls.

Since the same copy of `solution` is shared across all function calls, the caller can access the updates made by its recursive calls. This way, there is always a single copy of  `solution`, which can be updated by any node in the recursive tree when a solution is found.

In high-level programming languages like Java, JavaScript and Python, arguments are usually always passed by reference, and so, this is the default behaviour if `solution` is created in the caller of the top-level recursive function.

// Diagram: A single copy of data can be shared between all function calls to pass back data to the caller.

There is no one right or wrong way to pass data up and down in multiple recursions, and the choice depends on the problem and the programming language used. The performance of these operations varies across different programming languages, depending on the number of copies made of the arguments and returned data.

In most cases of multidimensional recursion, arguments to the function are passed down by copy, and the solution is usually passed back up as a return value. So, we will only look at this pattern in the algorithm and implementation section.

## Identifying base cases

Identifying a base case in single-variable recursive equations is quite simple. It might not always be very obvious for multidimensional recursive equations, but it is almost always guaranteed to have **multiple base cases**. The diagram below shows the most common base cases for single and two-dimensional recursive equations.

The base case for a recursive equation depends on the problem. The diagram below is just the most **common** base cases and is not guaranteed to be true for all problems

// Diagram: Most common of base cases for one dimensional and two dimensional recursive relations

## Algorithm

The steps given below summarise the implementation for the generic multidimensional recursive function with `n` dimensions, where the `solution` is passed back up to the calling function as a return value. The shift values in every step are dependent on the problem. To demonstrate its use, we use a function `S` that takes the current inputs and returns a list of shift values for a step.

> **multiDimensionalRecursion(d1, d2, . . ., dn)**
>
> -   **Step 1:** If \`d1, d2, . . ., dn\` is the base case, return known solution
> -   **Step 2:** Initialize \`solution\` to a default value
> -   **Step 3:** \`shifts\` = Call \`S(d1, d2, . . ., dn)\`
> -   **Step 4:** Iterate in the list \`shifts\` using a variable \`i\` and do the following:
>     -   **Step 4.1:** \`result\` = Call \`multipleRecursion(d1 + shifts\[i\]\[0\], d2 + shifts\[i\]\[1\], . . . , dn + shifts\[i\]\[n-1\])\`
>     -   **Step 4.2:** Add the contribution of \`result\` in \`solution\` using the function \`G\`
> -   **Step 4:** Return \`solution\`

## Implementation

Given below is the implementation for the generic multidimensional recursive equation with three dimensions. We use a function `S` to get the list of shift values for each state that we then use to make recursive calls. If we reach a base case, we use the function `B` to get the solution for that base case. The function `G` adds the contribution of the returned `result` to the `solution`, which is finally returned to the caller when the function ends. For this example, we will define a base case as one where the value of any dimension is less than or equal to zero.

C++

```cpp
class Solution
{
public:
  int multidimensionalRecursion(int d1, int d2, int d3)
  {
    // If any of the inputs are less than or equal to 0,
    // we have reached the base case
    if (d1 <= 0 || d2 <= 0 || d3 <= 0)
    {
      // Return the base case solution for these values
      return B(d1, d2, d3);
    }

// Diagram: int solution = 0; // Initialize solutio to a default value

    // Get the list of shift values for the current inputs
    vector<vector<int>> shifts = S(d1, d2, d3);

    for (const auto &shift : shifts)
    {
      // Compute new inputs by applying the shift and
      // recursively call the function with with new inputs
      int result = multidimensionalRecursion(d1 + shift[0], d2 + shift[1], d3 + shift[2]);

      // Combine the result with the current solution
      int solution = G(d1, d2, d3, solution, result);
    }
    return solution; // Return the final solution
  }

private:
  // Placeholder for B - to return the base case solution
  // for the given inputs
  int B(int d1, int d2, int d3)
  {
    // Implement your logic here
    return 0;
  }
  // Placeholder for E - to return the list of shift values
  //  for every dimension given the input
  vector<vector<int>> S(int d1, int d2, int d3)
  {
    // Implement your logic here
    return {{1, 0, 1}, {-1, 0, 1}}
  }

  // Placeholder for G - use the inputs, existing solution,
  //  and result from the recursive call to compute the new solution
  int G(int d1, int d2, int d3, int solution, int result)
  {
    // Implement your logic here
    return 0;
  }
};
```

Java

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

// Diagram: class Solution {

    public int multidimensionalRecursion(int d1, int d2, int d3) {
        // If any of the inputs are less than or equal to 0,
        // we have reached the base case
        if (d1 <= 0 || d2 <= 0 || d3 <= 0) {
            // Return the base case solution for these values
            return B(d1, d2, d3);
        }

// Diagram: int solution = 0; // Initialize solution to a default value

        // Get the list of shift values for the current inputs
        List<List<Integer>> shifts = S(d1, d2, d3);

        for (List<Integer> shift : shifts) {
            // Compute new inputs by applying the shift and
            // recursively call the function with new inputs
            int result = multidimensionalRecursion(
                d1 + shift.get(0),
                d2 + shift.get(1),
                d3 + shift.get(2)
            );

            // Combine the result with the current solution
            solution = G(d1, d2, d3, solution, result);
        }

        return solution; // Return the final solution
    }

    // Placeholder for B - to return the base case solution
    // for the given inputs
    private int B(int d1, int d2, int d3) {
        // Implement your logic here
        return 0;
    }

    // Placeholder for S - to return the list of shift values
    // for every dimension given the input
    private List<List<Integer>> S(int d1, int d2, int d3) {
        // Example implementation
        return Arrays.asList(
            Arrays.asList(1, 0, 1),
            Arrays.asList(-1, 0, 1)
        );
    }

    // Placeholder for G - use the inputs, existing solution,
    // and result from the recursive call to compute the new solution
    private int G(int d1, int d2, int d3, int solution, int result) {
        // Implement your logic here
        return 0;
    }
```

Typescript

```typescript
class Solution {
  multidimensionalRecursion(d1: number, d2: number, d3: number): number {
    // If any of the inputs are less than or equal to 0,
    // we have reached the base case
    if (d1 <= 0 || d2 <= 0 || d3 <= 0) {
      // Return the base case solution for these values
      return this.B(d1, d2, d3);
    }

// Diagram: let solution = 0; // Initialize solution to a default value

    // Get the list of shift values for the current inputs
    const shifts: number[][] = this.S(d1, d2, d3);

    for (const shift of shifts) {
      // Compute new inputs by applying the shift and
      // recursively call the function with new inputs
      const result = this.multidimensionalRecursion(
        d1 + shift[0],
        d2 + shift[1],
        d3 + shift[2]
      );

      // Combine the result with the current solution
      solution = this.G(d1, d2, d3, solution, result);
    }

    return solution; // Return the final solution
  }

  // Placeholder for B - to return the base case solution
  // for the given inputs
  private B(d1: number, d2: number, d3: number): number {
    // Implement your logic here
    return 0;
  }

  // Placeholder for S - to return the list of shift values
  // for every dimension given the input
  private S(d1: number, d2: number, d3: number): number[][] {
    // Implement your logic here
    return [
      [1, 0, 1],
      [-1, 0, 1],
    ];
  }

  // Placeholder for G - use the inputs, existing solution,
  // and result from the recursive call to compute the new solution
  private G(
    d1: number,
    d2: number,
    d3: number,
    solution: number,
    result: number
  ): number {
    // Implement your logic here
    return 0;
  }
```

Javascript

```javascript
class Solution {
  multidimensionalRecursion(d1, d2, d3) {
    // If any of the inputs are less than or equal to 0,
    // we have reached the base case
    if (d1 <= 0 || d2 <= 0 || d3 <= 0) {
      // Return the base case solution for these values
      return this.B(d1, d2, d3);
    }

// Diagram: let solution = 0; // Initialize solution to a default value

    // Get the list of shift values for the current inputs
    const shifts = this.S(d1, d2, d3);

    for (const shift of shifts) {
      // Compute new inputs by applying the shift and
      // recursively call the function with new inputs
      const result = this.multidimensionalRecursion(
        d1 + shift[0],
        d2 + shift[1],
        d3 + shift[2]
      );

      // Combine the result with the current solution
      solution = this.G(d1, d2, d3, solution, result);
    }

    return solution; // Return the final solution
  }

  // Placeholder for B - to return the base case solution
  // for the given inputs
  B(d1, d2, d3) {
    // Implement your logic here
    return 0;
  }

  // Placeholder for S - to return the list of shift values
  // for every dimension given the input
  S(d1, d2, d3) {
    // Implement your logic here
    return [
      [1, 0, 1],
      [-1, 0, 1],
    ];
  }

  // Placeholder for G - use the inputs, existing solution,
  // and result from the recursive call to compute the new solution
  G(d1, d2, d3, solution, result) {
    // Implement your logic here
    return 0;
  }
```

Python

```python
from typing import List

class Solution:
    def multidimensionalRecursion(self, d1: int, d2: int, d3: int) -> int:
        # If any of the inputs are less than or equal to 0,
        # we have reached the base case
        if d1 <= 0 or d2 <= 0 or d3 <= 0:
            # Return the base case solution for these values
            return self.B(d1, d2, d3)

// Diagram: solution = 0 # Initialize solution to a default value

        # Get the list of shift values for the current inputs
        shifts: List[List[int]] = self.S(d1, d2, d3)

        for shift in shifts:
            # Compute new inputs by applying the shift and
            # recursively call the function with new inputs
            result = self.multidimensionalRecursion(
                d1 + shift[0],
                d2 + shift[1],
                d3 + shift[2]
            )

            # Combine the result with the current solution
            solution = self.G(d1, d2, d3, solution, result)

// Diagram: return solution # Return the final solution

    # Placeholder for B - to return the base case solution
    # for the given inputs
    def B(self, d1: int, d2: int, d3: int) -> int:
        # Implement your logic here
        return 0

    # Placeholder for S - to return the list of shift values
    # for every dimension given the input
    def S(self, d1: int, d2: int, d3: int) -> List[List[int]]:
        # Implement your logic here
        return [[1, 0, 1], [-1, 0, 1]]

    # Placeholder for G - use the inputs, existing solution,
    # and result from the recursive call to compute the new solution
    def G(self, d1: int, d2: int, d3: int, solution: int, result: int) -> int:
        # Implement your logic here
        return 0
```

## Complexity Analysis

The time complexity for a multidimensional recursive algorithm depends on many things. It depends on the recursive equation, the number of dimensions `n`, the range of values along each dimension of the problem space, the function `G` and the branching factor at every step.

Note that most problems that can be solved by multidimensional recursion can be optimised with dynamic programming. In this course, we only focus on the brute-force multidimensional technique.

For the worst case, we assume that every dimension has **N** possible values in the problem space. In that case, the recursion starts with the maximum values for all **n** dimensions, and every recursive call linearly decreases **only one** dimension of the input, finally converging at a base case where all dimensions have their minimum values. We also assume that every step in the recursion makes **exactly** `k` recursive calls, passing data up and down takes constant **O(1)** timeand the function `G` takes constant **O(1)** time.

In this case, the maximum depth of the recursion tree would be **O (n\*N)**.

// Diagram: The maximum depth of recursion is n N.

Since we assumed a branching factor of `k` at every step, the worst-case time complexity would be exponential **O(k ^ (n\*N))**.

// Diagram: The maximum recursion depth is nN and the total number of recursive calls is k^(nN)

For low-level languages like C++, if container-type data structures like arrays, trees, etc, are passed up or down as copies, it adds linear time complexity **O(M)** where **M** is the size of the container. This results in a worst-case time complexity of **O(M\*k^(n\*N))**.

Since the function call stack goes up to a depth of **n\*N**, and every instance of the function call makes only a constant number of local variables, the space complexity is also linear **O(n\*N)**, in any case.

The best case for a multidimensional function is very problem-dependent and hard to compute generically. And so, we will not go into the details of the best-case time and space complexity for this generic multidimensional recursive equation.

> **Worst Case**
>
> -   Space Complexity - **O(n\*N)**
> -   Time Complexity - **O(k^(n\*N))**

***

# Identifying multidimensional recursion

Multiple recursion is the most generic form of recursion that explores an n-dimensional problem space and can solve a wide variety of problems. Most problems that are solved by multidimensional recursion are medium or hard problems that have multiple independent variables defining a problem state. The recursive equation reduces the problem space, ultimately leading to a base case with a known solution. Most multidimensional recursive problems build the solution during the stack unwinding phases in a bottom-to-top order.

Most recursive problems where the solution depends on exploring and combining results across multiple dimensions or states can be solved using multidimensional recursion.

It is important to note that most problems that can be solved using dultidimensional recursion can be optimized with dynamic programming.

If the recursive equation for a problem fits in the template of the generic multidimensional recursive equation, it can be solved using multidimensional recursion.

// Diagram: The general recursive equation for multidimensional recursion.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using multidimensional recursion.

> **Problem statement:** Given \`N\` and \`K\`, recursively find the value of **N choose K**
>
> In mathematics, the binomial coefficient of \`N\` from \`K\` is the number of ways of selecting \`K\` elements out of a set of \`N\` elements, which is also called **N choose K**.

// Diagram: Find the value of N choose K for N = 5 and K = 3.

## Multidimensional recursion

It can be proven mathematically that **N choose K** can be calculated recursively using the following formula. The proof of this recursive equation is out of the scope of this course and so will not be discussed

// Diagram: Mathematical equation to calculate N choose K

It is important to note that the problem has **more than one base case**. This is because there is only one way to choose **N** items from **N** and only one way to choose zero items from **N** items.

// Diagram: Recursive relation for binomial coefficients

This leads to the following recursive equation for the problem.

// Diagram: The recursive equation from the problem.

The recursive equation fits the template for a generic multidimensional recursive equation, and thus, it can be solved using multidimensional recursion. 

// Diagram: The recursive equation for the problem fits the template for multidimensional recursion.

We create a recursive function that takes as input`N`and `K`. In each function, we check if we hit a base case and return the base value (1) if it is true. Otherwise, we make two recursive calls with the inputs `( N - 1 , K - 1 )` and `( N - 1 , K )` respectively, and add the results.

The two recursive calls create a recursion tree where every call reduces the input in one or both dimensions until it reaches a base case. On hitting a base case, a known value is returned, and the solution is built from bottom to top as the recursion stack unwinds.

Consider the following example of the recursive execution where `N = 5` and `K = 3`.

// Diagram: Processing of recursive relation for 5 choose 3

Given below is the recursion tree for the same example where `N = 5` and `K = 3`.

// Diagram: Recursion tree for 5 choose 3

The implementation of the multidimensional recursive solution to solve the problem is given below.

C++

```cpp
using namespace std;

class Solution {
public:
    int binomialCoefficient(int N, int K) {

        // Base cases: If N equals K or K is 0, then C(N, K) is 1.
        if (N == K || K == 0) {
            return 1;
        }

        // Recursive step:
        // C(N, K) = C(N - 1, K - 1) + C(N - 1, K)
        // Recursively calculate C(N - 1, K - 1) for choosing K elements
        // from N-1 elements, and C(N - 1, K) for choosing K elements
        // from N-1 elements.
        return binomialCoefficient(N - 1, K - 1) +
               binomialCoefficient(N - 1, K);
    }
};
```

Java

```java
class Solution {
    public int binomialCoefficient(int N, int K) {

        // Base cases: If N equals K or K is 0, then C(N, K) is 1.
        if (N == K || K == 0) {
            return 1;
        }

        // Recursive step:
        // C(N, K) = C(N - 1, K - 1) + C(N - 1, K)
        // Recursively calculate C(N - 1, K - 1) for choosing K elements
        // from N-1 elements, and C(N - 1, K) for choosing K elements
        // from N-1 elements.
        return (
            binomialCoefficient(N - 1, K - 1) +
            binomialCoefficient(N - 1, K)
        );
    }
```

Typescript

```typescript
export class Solution {
    binomialCoefficient(N: number, K: number): number {

        // Base cases: If N equals K or K is 0, then C(N, K) is 1.
        if (N === K || K === 0) {
            return 1;
        }

        // Recursive step:
        // C(N, K) = C(N - 1, K - 1) + C(N - 1, K)
        // Recursively calculate C(N - 1, K - 1) for choosing K elements
        // from N-1 elements, and C(N - 1, K) for choosing K elements
        // from N-1 elements.
        return (
            this.binomialCoefficient(N - 1, K - 1) +
            this.binomialCoefficient(N - 1, K)
        );
    }
```

Javascript

```javascript
export class Solution {
    binomialCoefficient(N, K) {

        // Base cases: If N equals K or K is 0, then C(N, K) is 1.
        if (N === K || K === 0) {
            return 1;
        }

        // Recursive step:
        // C(N, K) = C(N - 1, K - 1) + C(N - 1, K)
        // Recursively calculate C(N - 1, K - 1) for choosing K elements
        // from N-1 elements, and C(N - 1, K) for choosing K elements
        // from N-1 elements.
        return (
            this.binomialCoefficient(N - 1, K - 1) +
            this.binomialCoefficient(N - 1, K)
        );
    }
```

Python

```python
class Solution:
    def binomial_coefficient(self, n: int, k: int) -> int:

        # Base cases: If n equals k or k is 0, then C(n, k) is 1.
        if n == k or k == 0:
            return 1

        # Recursive step:
        # C(n, k) = C(n - 1, k - 1) + C(n - 1, k)
        # Recursively calculate C(n - 1, k - 1) for choosing k elements
        # from n-1 elements, and C(n - 1, k) for choosing k elements from
        # n-1 elements.
        return self.binomial_coefficient(
            n - 1, k - 1
        ) + self.binomial_coefficient(n - 1, k)
```

Multidimensional recursion can solve this problem using a concise recursive implementation.

## Example problems

Most problems that fall under this category are **medium**problems; a list of a few is given below.

> -   **[Binomial coefficient](https://www.codeintuition.io/courses/recursion/z24pNska2eWOHK1M6kSBa)**
> -   **[Lattice paths](https://www.codeintuition.io/courses/recursion/lhYFpqwcwrarVFfw7wfZg)**
> -   **[Ackerman function](https://www.codeintuition.io/courses/recursion/JYJielMoq4_ttu0pf9jsH)**
> -   **[Egg dropping](https://www.codeintuition.io/courses/recursion/qEXs1iRdxBpFFtTsiScz4)**

We will now solve these problems to gain a better understanding of multidimensional recursion.

***

# Binomial coefficient

## Problem Statement

Given two positive integers **N** and **K**, write a function to find and return the binomial coefficient of N from K.

In mathematics, the binomial coefficient of **N** from **K** is the number of ways to select K elements from a set of N elements.

// Diagram: Formula to calculate binomial coefficient

You must do this **recursively**.

### Example 1

> -   **Input:** N = 5, K = 3
> -   **Output:** 10
> -   **Explanation:** 5! / 3! \* (5 - 3)! = 10.

### Example 2

> -   **Input:** N = 10, K = 4
> -   **Output:** 210
> -   **Explanation:** 10! / 4! \* (10 - 4)! = 210.

### Example 3

> -   **Input:** N = 0, K = 0
> -   **Output:** 1
> -   **Explanation:** 0! / 0! \* (0 - 0)! = 1.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int binomialCoefficient(int N, int K) {

        // Base cases: If N equals K or K is 0, then C(N, K) is 1.
        if (N == K || K == 0) {
            return 1;
        }

        // Recursive step:
        // C(N, K) = C(N - 1, K - 1) + C(N - 1, K)
        // Recursively calculate C(N - 1, K - 1) for choosing K elements
        // from N-1 elements, and C(N - 1, K) for choosing K elements
        // from N-1 elements.
        return binomialCoefficient(N - 1, K - 1) +
               binomialCoefficient(N - 1, K);
    }
};
```

***

# Lattice paths

## Problem Statement

Given two positive integers **rows** and **cols** of a grid, write a function to return the total number of ways you can reach the bottom-right corner of the grid starting from the top-left corner.

You can only move either **right** or **down** at any step.

You must do this **recursively**.

### Example 1

> -   **Input:** rows = 2, cols = 2
> -   **Output:** 6
> -   **Explanation:** There are 6 ways to reach the bottom right grid.

### Example 2

> -   **Input:** rows = 3, cols = 3
> -   **Output:** 20
> -   **Explanation:** There are 20 ways to reach the bottom right grid.

### Example 3

> -   **Input:** rows = 0, cols = 0
> -   **Output:** 1
> -   **Explanation:** We are already at the bottom right corner of the grid.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int latticePaths(int rows, int cols) {

        // Base case: If either rows or cols is 0, there is only
        // one unique path (all the way down or all the way right)
        if (rows == 0 || cols == 0) {
            return 1;
        }

        // Recursive case: The number of unique paths to the bottom-right
        // corner is the sum of the unique paths from the cell directly
        // above and the cell directly to the left
        return latticePaths(rows - 1, cols) +
               latticePaths(rows, cols - 1);
    }
};
```

***

# Ackerman function

## Problem Statement

Given two non-negative integers **M** and **N**, write a function to find and return the Ackermann value using this.

You must do this **recursively**.

// Diagram: Formula for ackerman function

### Example 1

> -   **Input:** M = 2, N = 2
> -   **Output:** 7
> -   **Explanation:** The output using the above relation would be 7.

### Example 2

> -   **Input:** M = 1, N = 1
> -   **Output:** 3
> -   **Explanation:** The output using the above relation would be 3.

### Example 3

> -   **Input:** M = 0, N = 0
> -   **Output:** 1
> -   **Explanation:** The output using the above relation would be 1.

## Solution

```cpp
using namespace std;

class Solution {
public:
    int ackerman(int M, int N) {

        // Base case: If M is 0, return N + 1
        if (M == 0) {
            return N + 1;
        }

        // If M is greater than 0 and N is 0, make a recursive call
        // with M - 1 and 1 as arguments
        if (M > 0 && N == 0) {
            return ackerman(M - 1, 1);
        }

        // If both M and N are greater than 0, make a recursive call
        // with M - 1 and the result of ackerman(M, N - 1) as arguments
        if (M > 0 && N > 0) {
            return ackerman(M - 1, ackerman(M, N - 1));
        }

        // If none of the above conditions are met, return 0
        return 0;
    }
};
```

***

# Egg dropping

## Problem Statement

Given two non-negative integer **eggs** and **floors**, write a function to find and return the minimum number of attempts required in the worst case to find the highest floor from which an egg can be dropped without breaking.

You must do this **recursively**.

### Example 1

> -   **Input:** eggs = 4, floor = 2
> -   **Output:** 2
> -   **Explanation:** With 4 eggs and 2 floors, the worst-case scenario requires 2 drops: you drop first from floor 1, and if the egg doesn't break, drop from floor 2. This guarantees finding the highest safe floor in at most 2 drops.

### Example 2

> -   **Input:** eggs = 2, floor = 1
> -   **Output:** 1
> -   **Explanation:** There is only one floor, so you need at most 1 drop to determine whether the egg breaks or not.

### Example 3

> -   **Input:** eggs = 1, floor = 1
> -   **Output:** 1
> -   **Explanation:** There is only one floor, so you need at most 1 drop to determine whether the egg breaks or not.

## Solution

```cpp
#include <climits>

using namespace std;

class Solution {
public:
    int eggDrop(int eggs, int floors) {

        // Base case: If there are no floors, no trials are needed.
        if (floors == 0) {
            return 0;
        }

        // Base case: If there is one floor, one trial is needed.
        if (floors == 1) {
            return 1;
        }

        // Base case: If there is only one egg, we have to do a linear
        // search
        if (eggs == 1) {
            return floors;
        }

        // Initialize minimum number of drops to a large value
        int minDrops = INT_MAX;

        // Try dropping from each floor
        for (int floor = 1; floor <= floors; floor++) {

            // if the egg breaks
            int eggBreaks = eggDrop(eggs - 1, floor - 1);

            // if the egg survives
            int eggSurvives = eggDrop(eggs, floors - floor);

            // The worst-case scenario is the maximum of the two cases
            int worstCase = max(eggBreaks, eggSurvives);

            // Update the minimum number of drops needed
            minDrops = min(minDrops, worstCase + 1);
        }

        return minDrops;
    }
};
```
