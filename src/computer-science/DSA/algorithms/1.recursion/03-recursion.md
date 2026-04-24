# Understanding the problem

Now that we know the basics of memory layout, stack frames, and how nested function calls work, we will dive deeper into recursion in this module. Recursion is fundamental to many optimization problems and high-level concepts like memoization and dynamic programming. Understanding recursion is the first step to understanding dynamic programming and divide-and-conquer algorithms.

Simply put, recursion can be defined as solving a problem by solving a smaller version of the same problem or defining a problem in terms of itself. It is not always obvious if a problem can be solved using recursion at first sight. Let's take a real-world example to understand recursion better.

## ATM queue problem

Imagine standing in a very long queue at an ATM, and you want to know your position. The queue is pretty big, and you are quite lazy, so you don't want to move out of line, so you count all the people individually.

// Diagram: Queue in front of the ATM

Let's understand how we can use recursion to find a solution to this problem.

***

# Exploring a possible solution

There are two observations to make for the example problem we saw earlier.

> -   The **first** person in the queue knows their position.
> -   You could get your position by adding 1 to the position of the person **ahead** of you.

The two observations above are sufficient conditions for a recursive solution. It is not very difficult to imagine how someone standing in the queue can recursively get their position. They need to ask the person standing ahead of them the same question (about their position) and add 1. Let us examine the entire process between asking and getting the answer.

## Asking questions

To find out their current position in the queue, a person will ask the person ahead of them for their position. To answer this question, the person standing ahead will ask the same question to the person standing ahead of them. This process of asking questions will continue and finally **stop** at the **first** person in the queue. 

// Diagram: Asking question to the person in front

## Reaching the first person

The first person in the queue has no one in front of them and knows this answer for themselves.

// Diagram: Hitting the first person

## Adding answers

Once the second person learns the person's position ahead of them, they add 1 to it to get their position in the queue and relay back this answer to the third person. The third person in the queue does the same thing and relays the answer to the fourth person. This process continues until it reaches us and we get the answer to our question. To get our position, we add 1 to the answer we got from the person ahead of us.

// Diagram: Adding answers of question

Next, we will see how to formalize the three steps above into a recursion mathematical construct.

***

# Key components of recursion

Now that we have a basic idea of how recursion works, let's dive deeper into its more formal mathematical definition. We will look at the two conditions the problem must satisfy in order to have a recursive solution.

## Recursive structure

A problem is said to have a recursive structure if it can be broken down into smaller subproblems, solutions to which can be used to solve the bigger problem. These subproblems should be the same as the original problem but on a smaller subset of inputs. Continuing our previous example of the atm queue, a person can know their position by solving the same problem for the person ahead of them.

// Diagram: Recursive structure of the sample problem

## Base case

For a given problem, the base case is the smallest instance of the problem whose answer is already known. The base case is also called the terminating condition or the endpoint of recursion. Continuing our previous example of the atm queue, if the person standing at the front of the queue had the same problem (wanted to know their position in the queue), they would already know the answer. This makes their problem the base case as it is the smallest instance of the bigger problem, and the solution to this problem is already known.

// Diagram: The first person in the queue is the base case for the example problem

## Recursive relation

Recursion is just the execution of a recursive relation. A recursive relation is the mathematical representation of recursion.

// Diagram: Recursive Relation

> A recursive relation is a relation that can be represented in its own terms and has a base case whose value is already known. It is also known as a recursive equation or recursive formula.

Looking at the recursive relation for a problem, we can easily model it into a computer program. This is what makes recursive relations so useful. The first step of solving a problem is to find the recursive relation and the base case. Let us look at what a generic recursive relation looks like.

// Diagram: A generic recursive relation

Here `F(n)`  is the solution to a problem with input `n` and `G` is a function that is used to calculate the solution using the result of `F(n-1)`. Continuing our example of people standing in the atm queue, let us look at how the recursive relation to the problem looks.

// Diagram: Recursive relation for people standing in queue

Finding the recursive relation is the core to solving any problem that can be solved using recursion. Once we have the recursive relation, it is easy to implement in code.

## Recursion tree

As the name suggests, a recursion tree is a tree that is used to visualize recursion and measure the time complexity of the recursive relation. A recursive tree can also be viewed as an instrument to visualize the function calls made to the same function with smaller inputs and, finally, the base case. The leaf nodes of the recursion tree represent the base case of the problem. 

Let's examine the recursive relation from our previous example of an atm queue and see how recursive function calls can be visualized through a recursion tree. 

// Diagram: Recursion tree for finding the position of 5th person in queue

**Why is it called a tree when it is just a straight line?**The atm queue example we used has a simple recursive relation. Hence, the recursion tree has no branches. Other more complex recursive relations branch out more and look like trees, as we will learn later in this course.

Drawing a recursion tree of a recursive relation is the fastest and easiest way to understand how the recursive relation is processed in recursive function calls when implemented in code.

***

# Implementing recursive algorithms

As you might have already guessed, recursion is implemented via nested function calls, as we learned earlier in this course. However, a recursive function calls itself instead of calling some other function. Now that we know about stack frames and stack memory, it is easy to visualize how these recursive function calls work under the hood.

Continuing our atm queue example, let us look at how a recursive function can implement the recursive relation.

C++

```cpp
#include <iostream>

int findPosition(int n) {
    // Base case
    if (n == 1) {
        return 1;
    }

    return 1 + findPosition(n - 1);
}

int main() {
    std:: cout << findPosition(4) << std::endl;
}
```

Java

```java
class Solution {
    int findPosition(int n) {
        // Base case
        if (n == 1) {
            return 1;
        }

        return 1 + findPosition(n - 1);
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.findPosition(4));
    }
```

Typescript

```typescript
class Solution {
  findPosition(n: number): number {
    // Base case
    if (n === 1) {
      return 1;
    }

    return 1 + this.findPosition(n - 1);
  }

// Example usage
const sol = new Solution();
console.log(sol.findPosition(4));
```

Javascript

```javascript
class Solution {
  findPosition(n) {
    // Base case
    if (n === 1) {
      return 1;
    }

    return 1 + this.findPosition(n - 1);
  }

// Example usage
const sol = new Solution();
console.log(sol.findPosition(4));
```

Python

```python
class Solution:
    def findPosition(self, n: int) -> int:
        # Base case
        if n == 1:
            return 1

// Diagram: return 1 + self.findPosition(n - 1)

if __name__ == "__main__":
    sol = Solution()
    print(sol.findPosition(4))
```

The recursive function call in the code above works in three steps to return the result.

> 1.  Function Calls
> 2.  Base Case
> 3.  Stack Unwinding

Let us look at these three steps for the code above when the recursive function is called with the value **4**.

## Function calls

The recursive solution starts with the first function call, also called the **top level** function call, which is made to get the results for an input. This function call creates a stack frame in the process's stack memory and, during its execution, calls the same function again with different inputs.

Though these two functions are exactly the same, for the process executing it, every function call is different and it creates a new stack frame for this second call to the same function.

// Diagram: Function calls

These two functions have their own **copy** of all the local variables. During its execution, this second function call invokes the same function again with a different input, and, as before, a new stack frame is created for this call. This process continues until the base case is reached.

## Base case

The process of repeatedly calling the same function and creating new stack frames for each call in the stack memory finally stops when the recursive function is called with the base case. We already know the answer to the base case, so there are no more subsequent function calls, and some value is returned from the function. As this final function call returns the value to the caller, the stack frame associated with it is also deleted from the process's stack memory.

// Diagram: findPosition(1)

It is quite easy to see that if there was no base case, the recursive function calls would go on and on forever and would cause the program to crash due to stack overflow

## Stack unwinding

The return of execution from the base cases starts **stack unwinding**. The stack frame associated with the function call that called the base case can now compute the result for itself and return it to the function that, in turn, called it. Once it returns the results, the stack frame associated with this instance of the function call will also be deleted. This process will go on and on until the execution reaches the **top level** function call, where we get back the result to our **original** input. 

// Diagram: Stack unwinding

Stack unwinding not only manages memory efficiently but also highlights the power of recursion in breaking down complex problems into manageable steps, allowing programs to solve them systematically.
