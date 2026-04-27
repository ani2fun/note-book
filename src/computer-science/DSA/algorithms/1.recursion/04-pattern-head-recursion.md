# Understanding head recursion

Head recursion is when a recursive function calls itself at the beginning of the code block, just after checking for base cases. Since the function is called at the beginning, all deeper recursive calls (till the base case) are finished before its processing begins. The result of each step is often processed using the results from the recursive steps below it, and so head recursion is used in cases where the solution has to be built from **bottom to top**.

The head recursion pattern is the classification of problems that can be solved using head recursion.

// Diagram: The solution is built from bottom to top during stack unwinding in head recursion.

## Head recursion

Head recursion is when the recursive function call is placed at the top (head) of the code block, just after checking the base case. As a consequence, every step in the series of recursive calls makes another recursive call before any processing starts, and this process is repeated until it hits the base case.

Consider we have a recursive function `f` that takes an input `n` from the caller. In its implementation, it uses a function `h` that reduces the input `n` for the next recursive call and a function `g` that processes the result from the recursive call to get the solution for the call to `f`. This makes the general recursive equation for multiple recursion the following form:

// Diagram: The general recursive equation for head recursion.

The pseudocode for the general recursive equation above is as follows.

// Diagram: The pseudocode for the general equation for head recursion.

Note that no processing for the function `f` is done before making any recursive calls. The recursive calls continue until we reach the base case, where a known solution is passed back to the calling function, and the stack unwinds.

// Diagram: The recursive calls are made at the beginning of the function and continue until reaching the base case.

At every step during the stack unwinding, the function processes the value it received from the call below it and adds its contribution to it before passing it back to its caller. This process is repeated until the top-level recursive call unwinds and passes the final result to its calling function.

Head recursion aggregates data bottom to top from the base case up to the top-level recursive call as the function call stack unwinds

// Diagram: The result from the recursive call is used to get the solution of every step during stack unwinding.

For head recursion, the data can be passed down from the caller to the called function and back up in many different ways, the choice of which depends on the problem, programming language and ease of implementation.

## Passing data down

Since a recursive function call is at the top of the function code block, no processing is done before making the recursive calls. As a consequence, no local data is passed down from an instance of a function call to any steps below it. Only the data passed as arguments from the top-level recursive call is passed down all the way to the base case.

For low-level programming languages like C++, the arguments are always passed by copy. This incurs a copy overhead every time a recursive function is called and can be less performant when passing container-type data structures like arrays, lists, trees, etc.

// Diagram: In low-level programming languages, data passed as arguments is passed as a copy.

A way to prevent this is to pass the output of the function `h` as a reference to the recursive call. This way, the same copy of data is shared between the caller and the called function, and no expensive copy operation takes place.

For high-level programming languages like Java, JavaScript or Python, this is the default behaviour as most data types are always passed by reference.

// Diagram: Argument data passed to the recursive function can be passed by reference to prevent unnecessary copies.

## Passing data up

The data can be passed up from the called function to the calling function either by returning a copy of its local variable or by updating a reference passed down by the caller. Both ways have their pros and cons, and the choice depends on the problem, programming language and the ease of implementation.

For head recursion, data is usually always passed back as a return value. For low-level programming languages like C++, values are always returned by copy, which incurs a copy overhead every time a recursive function ends and can be less performant when passing container-type data structures like arrays, lists, trees, etc.

// Diagram: In low-level programming languages, data is returned to the caller by copy.

For high-level programming languages like Java, JavaScript and Python, all local data is also created on the heap memory and only references to it are local. And so, when a value is returned, the calling function stores the reference to the same object in its local variable.

// Diagram: In high-level programming languages, data is returned by reference.

To avoid unnecessary copy operations in low-level programming languages when non-primitive datatypes are involved, we can create a single copy of the data of the return type `solution` in the caller of the top-level recursive function and pass it down as a reference argument. Then, the recursive function doesn't need to return a value; it can update the data held in the reference when a solution is found. Since the same copy is shared across all function calls, the caller can access the solution from its recursive call. This way, there is always a single copy of  `solution`, which is updated in the base case with the final result.

In high-level programming languages like Java, JavaScript and Python, arguments are usually always passed by reference, and so, this is the default behaviour if `solution` is created in the caller of the top-level recursive function.

// Diagram: The solution can be passed by reference as an argument to the recursive calls, which updates it at every step on its way back.

There is no one right or wrong way to pass data up and down in head recursion, and the choice depends on the problem and the programming language used. The performance of these operations varies across different programming languages, depending on the number of copies made of the arguments and returned data.

In most cases of head recursion, data is usually passed down as arguments and results are passed back up as a return value. This means that all data is passed up and down as copies for C++ and as references for high-level programming languages (non-primitive data types). So, we will only look at this pattern in the algorithm and implementation section.

## Algorithm

The steps given below summarise the implementation for the generic head recursive function, where data is passed down as arguments and the result is passed back up to the calling function as a return value.

> **headRecursion(n)**
>
> -   **Step 1:** If `input` is the base case, return the base case solution
> -   **Step 2:** Find the input for the next step `input` using the function `h` and `n`
> -   **Step 3:** Set `result` = `headRecursion (input)`
> -   **Step 4:** Find the `solution` using `result`, `n` and the function `g`
> -   **Step 5:** Return `solution`

## Implementation

Given below is the implementation for the generic equation for head recursion, where data is passed down as arguments and results are returned from the function. Here, the functions `h` and `g` is problem-dependent, defining the input is reduced for the next step and how the outcome from the reduced input is used to compute the solution for the given input.

C++

```cpp
using namespace std;

class Solution {
public:
    int headRecursion(int n) {

        // Base case: If n is less than or equal to 0, we have reached
        // the end of recursion
        if (n <= 0) {
            return 0; // Solution for the base case
        }

        // Use the function h to reduce the input
        // for the next step
        int input = h(n);

        // Recursive call with the reduced input
        // at the begining of the function
        int result = headRecursion(input);

        // Use the function g to compute the solution
        // for this call using the result from the recursive call
        // and the input to this call
        int solution = g(result, n);

        // Return the solution for the current input
        return solution;
    }
private:
    // Placeholder for g - use the result from recursive call
    // and the current input to compute the solution
    int g(int input, int n) {
        // Implement your logic here
        return input + n; // Example implementation
    }

    // Placeholder for h - get the input for the next step
    // the output
    int h(int input) {
        // Implement your logic here
        return input - 1; // Example implementation
    }
};
```

Java

```java
class Solution {

// Diagram: public int headRecursion(int n) {

        // Base case: If n is less than or equal to 0, we have reached
        // the end of recursion
        if (n <= 0) {
            return 0; // Solution for the base case
        }

        // Use the function h to reduce the input
        // for the next step
        int input = h(n);

        // Recursive call with the reduced input
        // at the begining of the function
        int result = headRecursion(input);

        // Use the function g to compute the solution
        // for this call using the result from the recursive call
        // and the input to this call
        int solution = g(result, n);

        // Return the solution for the current input
        return solution;
    }

    // Placeholder for g - use the result from recursive call
    // and the current input to compute the solution
    private int g(int input, int n) {
        // Implement your logic here
        return input + n; // Example implementation
    }

    // Placeholder for h - get the input for the next step
    // the output
    private int h(int input) {
        // Implement your logic here
        return input - 1; // Example implementation
    }
```

Typescript

```typescript
class Solution {
    headRecursion(n: number): number {

        // Base case: If n is less than or equal to 0, we have reached
        // the end of recursion
        if (n <= 0) {
            return 0; // Solution for the base case
        }

        // Use the function h to reduce the input
        // for the next step
        const input = this.h(n);

        // Recursive call with the reduced input
        // at the begining of the function
        const result = this.headRecursion(input);

        // Use the function g to compute the solution
        // for this call using the result from the recursive call
        // and the input to this call
        const solution = this.g(result, n);

        // Return the solution for the current input
        return solution;
    }

    // Placeholder for g - use the result from recursive call
    // and the current input to compute the solution
    private g(input: number, n: number): number {
        // Implement your logic here
        return input + n; // Example implementation
    }

    // Placeholder for h - get the input for the next step
    // the output
    private h(input: number): number {
        // Implement your logic here
        return input - 1; // Example implementation
    }
```

Javascript

```javascript
class Solution {
    headRecursion(n) {

        // Base case: If n is less than or equal to 0, we have reached
        // the end of recursion
        if (n <= 0) {
            return 0; // Solution for the base case
        }

        // Use the function h to reduce the input
        // for the next step
        let input = this.h(n);

        // Recursive call with the reduced input
        // at the begining of the function
        let result = this.headRecursion(input);

        // Use the function g to compute the solution
        // for this call using the result from the recursive call
        // and the input to this call
        let solution = this.g(result, n);

        // Return the solution for the current input
        return solution;
    }

    // Placeholder for g - use the result from recursive call
    // and the current input to compute the solution
    g(input, n) {
        // Implement your logic here
        return input + n; // Example implementation
    }

    // Placeholder for h - get the input for the next step
    // the output
    h(input) {
        // Implement your logic here
        return input - 1; // Example implementation
    }
```

Python

```python
class Solution:
    def head_recursion(self, n: int) -> int:

        # Base case: If n is less than or equal to 0, we have reached
        # the end of recursion
        if n <= 0:
            return 0  # Solution for the base case

        # Use the function h to reduce the input
        # for the next step
        input_value: int = self.h(n)

        # Recursive call with the reduced input
        # at the beginning of the function
        result: int = self.head_recursion(input_value)

        # Use the function g to compute the solution
        # for this call using the result from the recursive call
        # and the input to this call
        solution: int = self.g(result, n)

        # Return the solution for the current input
        return solution

    def g(self, input_value: int, n: int) -> int:
        # Placeholder for g - use the result from recursive call
        # and the current input to compute the solution
        return input_value + n  # Example implementation

    def h(self, input_value: int) -> int:
        # Placeholder for h - get the input for the next step
        # Implement your logic here
        return input_value - 1  # Example implementation
```

## Complexity Analysis

The time complexity of the algorithm depends on the recursive equation, the functions `g` and `h` and the time taken to copy the return value. Assuming that the function calls itself recursively only once, where every call linearly increases or decreases the input, converging to the base case, and the functions `g` and `h` take constant **O(1)** time. 

Also, if we assume that the data passed is passed up and down for low-level programming languages as copy and the copy operation takes constant **O(1)** time or all data is passed up and down as references, the time complexity of the algorithm will be **O(N)**, where **N** is the number of recursive function calls.

For low-level languages like C++, if container-type data structures like arrays, trees, etc, are passed up or down as copies, it adds linear time complexity **O(M)** where **M** is the size of the container. This results in an overall time complexity of **O(N\*M)** in any case.

Since the function call stack goes up to a depth of **N** if there are **N** recursive calls, and every instance of the function call makes only a constant number of local variables, the space complexity is also linear **O(N)**,in any case.

We will learn more about non-linear recursion later in the course which may also be head recursion but have exponential time complexity.

> **Best Case**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**
>
> **Worst Case**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Identifying head recursion

Head recursion is the most basic form of recursion and is relatively easy to understand and identify. Most problems that are solved by head recursion are **easy** problems where we need to know the solution to smaller sub-problems before we can start processing the solution to larger problems. The actual processing of results generally happens during the stack unwinding phase in a bottom-to-top order.

Most recursive problems that allow deferring any processing until we have the results of smaller sub-problems can be solved with head recursion.

It is important to note that most problems that can be solved using head recursion can also be solved either iteratively or using other forms of recursion.

If the recursive equation for a problem fits in the template of the generic head recursive equation, it can be solved by head recursion.

// Diagram: The general recursive equation for head recursion.

## Example

Let's consider the following problem as an example to better understand how to identify and solve a problem using head recursion.

> **Problem statement:** Given a number, find the sum of all its digits recursively.

// Diagram: Find the sum of all digits.

## Head recursion

The first step to solve any problem recursively is to identify a recursive equation to solve the problem. It is quite easy to deduce a recursive equation for this problem.

// Diagram: The recursive equation from the problem.

The recursive equation fits the template for a generic head-recursive equation, and thus it can be solved using head recursion.

// Diagram: The recursive equation for the problem fits the template for head recursion.

In each step, the function removes the last digit from the input number and recursively calls itself with the remaining number to get the sum of the digits of the remaining number. The base case occurs when the input is reduced to 0 and no more digits can be removed; in this case, we return 0 as the sum to the caller.

Once we hit the base case, the stack unwinds and returns the base case solution (0) to the calling function, which then adds the digit it extracted to the returned sum and returns the result to its caller. This process is repeated, and the sum of all digits is finally returned to the top-level caller.

The implementation of the head-recursive solution to solve the problem is given below.

C++

```cpp
using namespace std;

class Solution {
public:
    int sumOfDigits(int N) {

        // Base case: If N is 0, we have reached
        // the end of recursion
        if (N == 0) {
            return 0;
        }

        // Recursive call with the remaining number without
        // the last digit
        int remainingSum = sumOfDigits(N / 10);

        // Combine results with the last digit
        return remainingSum + N % 10;
    }
};
```

Java

```java
class Solution {
    public int sumOfDigits(int N) {

        // Base case: If N is 0, we have reached
        // the end of recursion
        if (N == 0) {
            return 0;
        }

        // Recursive call with the remaining number without
        // the last digit
        int remainingSum = sumOfDigits(N / 10);

        // Combine results with the last digit
        return remainingSum + (N % 10);
    }
```

Typescript

```typescript
export class Solution {
    sumOfDigits(N: number): number {

        // Base case: If N is 0, we have reached
        // the end of recursion
        if (N === 0) {
            return 0;
        }

        // Recursive call with the remaining number without
        // the last digit
        const remainingSum = this.sumOfDigits(Math.floor(N / 10));

        // Combine results with the last digit
        return remainingSum + (N % 10);
    }
```

Javascript

```javascript
export class Solution {
    sumOfDigits(N) {

        // Base case: If N is 0, we have reached
        // the end of recursion
        if (N === 0) {
            return 0;
        }

        // Recursive call with the remaining number without
        // the last digit
        const remainingSum = this.sumOfDigits(Math.floor(N / 10));

        // Combine results with the last digit
        return remainingSum + (N % 10);
    }
```

Python

```python
class Solution:
    def sum_of_digits(self, n: int) -> int:

        # Base case: If n is 0, we have reached
        # the end of recursion
        if n == 0:
            return 0

        # Recursive call with the remaining number without
        # the last digit
        remaining_sum = self.sum_of_digits(n // 10)

        # Combine results with the last digit
        return remaining_sum + n % 10
```

The head-recursive solution can solve this problem in linear time using a concise recursive implementation.

## Example problems

Most problems that fall under this category are**easy**problems; a list of a few is given below.

> -   **[Forward sequence](https://www.codeintuition.io/courses/recursion/iQZVBX68RblqORN5m4VR1)**
> -   **[Calculate factorial](https://www.codeintuition.io/courses/recursion/ngLiy7xAykAsqS4W6ci_7)**
> -   **[Sum of digits](https://www.codeintuition.io/courses/recursion/oiI4KVZJ5IiQ7QoJLipgi)**
> -   **[Reverse a queue](https://www.codeintuition.io/courses/recursion/HjaQYnCoxjqOkIvUb9vcW)**

We will now solve these problems to gain a better understanding of head recursion.

***

# Forward sequence

## Problem Statement

Given a positive number **N**, write a function to return a list of numbers from 1 to N.

You must do this **recursively**.

### Example

> -   **Input:** n = 5
> -   **Output:** \[1, 2, 3, 4, 5\]

## Solution

```cpp
using namespace std;

class Solution {
public:
    void helper(int N, vector<int> &result) {

        // Base case: If N is less than or equal to 0, we have reached
        // the end of recursion
        if (N <= 0) {

            // Exit the function, as there are no more numbers to add
            return;
        }

        // Recursive call to the helper function with N-1, to move
        // towards the base case
        helper(N - 1, result);

        // After the recursive call returns, the result vector contains
        // numbers from 1 to N-1 Now, we add the current number N to the
        // result vector to complete the sequence
        result.push_back(N);
    }

    vector<int> forwardSequence(int N) {

        // Initialize an empty vector to store the result
        vector<int> result;

        // Call the helper function to populate the result vector with
        // numbers from 1 to N
        helper(N, result);

        // Return the generated vector containing numbers from 1 to N
        return result;
    }
};
```

***

# Calculate factorial

## Problem Statement

Given a non negative integer **N**, write a function to return the factorial of N.

The factorial of a positive integer N is the product of all positive integers less than or equal to N.

You must do this **recursively**.

### Example 1

> -   **Input:** N = 7
> -   **Output:** 5040
> -   **Explanation:** 7 \* 6 \* 5 \* 4 \* 3 \* 2 \* 1 = 5040

### Example 2

> -   **Input:** N = 5
> -   **Output:** 120
> -   **Explanation:** 5 \* 4 \* 3 \* 2 \* 1 = 120

### Example 3

> -   **Input:** N = 0
> -   **Output:** 1
> -   **Explanation:** Factorial of 0 is 1

## Solution

```cpp
using namespace std;

class Solution {
public:
    int factorial(int N) {

        // Base case: If N is 0, the factorial is 1
        if (N == 0) {
            return 1;
        }

        // Recursive call to calculate factorial of (N - 1)
        int factorialOfNMinus1 = factorial(N - 1);

        // Multiply N with the factorial of (N - 1)
        return N * factorialOfNMinus1;
    }
};
```

***

# Sum of digits

## Problem Statement

Given a non-negative integer **N**, write a function to find and return the sum of all the digits in this integer.

You must do this **recursively**.

### Example 1

> -   **Input:** N = 523
> -   **Output:** 10
> -   **Explanation:** 5 + 2 + 3 = 10

### Example 2

> -   **Input:** N = 1005
> -   **Output:** 6
> -   **Explanation:** 1 + 0 + 0 + 5 = 6

### Example 3

> -   **Input:** N = 0
> -   **Output:** 0
> -   **Explanation:** The sum is 0

## Solution

```cpp
using namespace std;

class Solution {
public:
    int sumOfDigits(int N) {

        // Base case: If N is 0, we have reached
        // the end of recursion
        if (N == 0) {
            return 0;
        }

        // Recursive call with the remaining number without
        // the last digit
        int remainingSum = sumOfDigits(N / 10);

        // Combine results with the last digit
        return remainingSum + N % 10;
    }
};
```

***

# Reverse a queue

## Problem Statement

Given a queue **q**, write a function to reverse the contents of this stack. You do not need to return a new reversed queue but reverse the contents of the input queue itself.

You must do this **recursively**.

### Example

> -   **Input:** q = \[1, 2, 3, 4, 5, 6, 7\]
> -   **Output:** \[7, 6, 5, 4, 3, 2, 1\]
> -   **Explanation:** Above is reversed queue.

## Solution

```cpp
using namespace std;

class Solution {
public:
    void reverseAQueue(queue<int> &q) {

        // Base case: Queue is empty or has only one element
        if (q.empty() || q.size() == 1) {
            return;
        }

        // Dequeue the front element
        int frontElement = q.front();
        q.pop();

        // Reverse the remaining queue
        reverseAQueue(q);

        // Enqueue the front element to the rear
        q.push(frontElement);
    }
};
```
