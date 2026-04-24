# Overview of backtracking

Simply put, backtracking is an algorithmic technique for solving problems by building a solution incrementally, one piece at a time. It identifies potential solutions by validating every result against a fixed set of constraints. Backtracking is a **brute-force** approach to finding the desired solution by trying all possible options.

Backtracking suggests that if the current result is unsuitable, **backtrack** and try other solutions using the same technique. As we will learn later, backtracking very heavily relies on recursion. When exploring the solutions, a bounding function is applied so that the algorithm can check if the solution built so far satisfies the constraints. If it does, it continues searching. If it doesn’t, the branch will be eliminated, and the algorithm will return to the previous level.

// Diagram: Abstract representation of backtracking

## Phone unlocking problem

Let us try to understand backtracking through a real example. Imagine that you just got a new phone for yourself and set a 4-digit numeric password for its lock screen before going for a nap. You wake up and forget the password that you set. How will you unlock your phone now?

// Diagram: To keep the problem simple, lets limit the digits to only 0 and 1

// Diagram: Find your 4 digit password made of only 0s and 1s

## Exploring a possible solution

// Diagram: There are two observations to make here -

> -   It is just a 4-digit number; every digit can only be 0 or 1. This means there is only a **finite** number of possible passwords.
> -   You can validate if the password is correct by entering it into the phone and seeing if it unlocks.

The two observations above are the necessary and complete conditions for a backtracking solution. It is easy to imagine how we can find the password now. We just need to list all possible 4-digit numbers made up of only 0s and 1s and try them out.

### Make a choice

We start by building the first potential solution to our problem. Starting with the first digit, we incrementally move ahead to build the 4-digit number by **appending** either a `0` or `1`.

// Diagram: Build a potential solution by filling some values

### Check for validity

Once we create our first 4-digit number, we **validate** it by entering it as the phone password. If the phone unlocks, this is the correct password, and we have our solution. Otherwise, it means some other number is the password.

// Diagram: Validate the the result

### Backtrack and try alternatives

If the first result we calculated is not the solution to our problem, we take a **step back** and make a **different choice** this time to get a new result. Once we have the brand new result, we validate it again.

// Diagram: Go back one step and update the 0 to 1

### Repeat until a solution is found

We keep **repeating** this process of going **one step back** and updating our choice to generate all possible 4-digit numbers made up of only `0s` and `1s` and enter them into the phone. It is guaranteed that one of them will be the correct password.

// Diagram: Make choices to incrementally build a solution and backtrack on reaching the end

***

# Key components of backtracking

Now that we have a basic understanding of backtracking, let's explore it in greater detail by examining the key components of a backtracking solution. We will discuss the three conditions a problem must satisfy to be suitable for backtracking and see how these conditions collectively give rise to a state space tree, which forms the backbone of the solution process.

## Finite set of outcomes

Backtracking is a brute-force technique that validates each outcome as a potential solution. A problem with a backtracking solution should be deterministic and have a **finite set** of potential outcomes. 

// Diagram: A problem should have a finite set out outcomes

## Solution validation

Backtracking is almost always a brute-force solution. We generate all the possible outcomes for a problem and validate each to decide on a solution subset. A problem with a backtracking solution should have a validation algorithm/function to determine if an outcome is a solution.

// Diagram: A validation function validates if an outcome is a solution or not

## Recursive structure

A backtracking solution incrementally builds results by starting from a problem and making choices at every step to lead to a solution. If the choices lead to a wrong result, one needs to take one step back at a time and make different choices that lead to a different outcome.

To accomplish this, the implementation should always be **aware** of all the choices made, starting from the initial problem state to the current state, and be able to take a step back and try a different path if the choices do not lead to a solution. A recursive implementation can easily accomplish this.

> -   Every function call can be considered as **making** a choice
> -   The function call stack **remembers** all the choices
> -   At the end of a function call, control goes **one step back** to the calling function, where we can make a different choice by calling the function again with different inputs.

// Diagram: Recursive structure of the sample problem

## State space tree

Processing a backtracking solution generates a state-space **tree**. Every backtracking solution starts from a problem state and tries to reach one or more solution states by making choices. If the choices do not lead to a solution state, we backtrack and make different choices.

A space state tree is a tree that represents all the possible states (solution or non-solution), starting from the root as the initial state (problem state) to the leaf as a terminal state (potential solution state). The intermediate states can be either fulfilling or defying. A fulfilling state can lead to a solution, while a defying state cannot. We decide if a state is fulfilling or defying using an algorithm/function specific to the problem. Not all backtracking problems have to define states in their state space tree.

A backtracking solution explores the tree starting from the root, moving through fulfilling states, and backtracking whenever a defying state or dead end is encountered. Upon reaching a terminal state, the solution is validated, and the algorithm backtracks to explore alternative paths until all possible solutions are found.

// Diagram: A generic state space tree

Continuing our example of finding the four-digit phone password, let's examine the state space tree for the problem.

// Diagram: State space tree for the mobile phone password example

As shown in the diagram above, the state space tree represents all the choices we make from the problem state and how they lead to potential solution states. The state space tree for the mobile phone password example has no defying state.

***

# Implementing backtracking algorithms

Backtracking solutions are implemented using recursive function calls. We use these recursive function calls to move from one state to another, starting from the initial problem state. Each function call from a state signifies a choice that leads to another state. This process continues until we reach a terminal state where we decide if our decisions make up a proper solution using some validation function/algorithm.

In case we reach a state that is not a solution, the function call ends and returns the control to the caller, which is also the state from where we moved to the next state. At this point, we can move to a new state, continue the process, or backtrack even further.

## Implementation

Let us continue the mobile phone password example and see how recursive function calls can be used to implement the backtracking solution.

C++

```cpp
#include <iostream>

// Diagram: using namespace std;

const string password = "0101"
void crackPassword(string state) {
    if (state.length() == 4 && state == password) {
        std::cout << "Password cracked";
    }

    if (state.length() == 4) {
        return;
    }

    for (int i = 0; i <= 1; i++) {
        string newState = state + (char)('0' + i);
        crackPassword(newState);
    }

int main() {
    crackPassword("");
}
```

Java

```java
public class CrackPassword {
    private static final String PASSWORD = "0101";

    public static void crackPassword(String state) {
        if (state.length() == 4 && state.equals(PASSWORD)) {
            System.out.println("Password cracked");
        }

        if (state.length() == 4) {
            return;
        }

        for (int i = 0; i <= 1; i++) {
            String newState = state + (char)('0' + i);
            crackPassword(newState);
        }

    public static void main(String[] args) {
        crackPassword("");
    }
```

Typescript

```typescript
const PASSWORD: string = "0101";

function crackPassword(state: string): void {
    if (state.length === 4 && state === PASSWORD) {
        console.log("Password cracked");
    }

    if (state.length === 4) {
        return;
    }

    for (let i = 0; i <= 1; i++) {
        const newState: string = state + String.fromCharCode('0'.charCodeAt(0) + i);
        crackPassword(newState);
    }

crackPassword("");
```

Javascript

```javascript
const PASSWORD = "0101";

function crackPassword(state) {
    if (state.length === 4 && state === PASSWORD) {
        console.log("Password cracked");
    }

    if (state.length === 4) {
        return;
    }

    for (let i = 0; i <= 1; i++) {
        const newState = state + String.fromCharCode('0'.charCodeAt(0) + i);
        crackPassword(newState);
    }

crackPassword("");
```

Python

```python
PASSWORD = "0101"

def crack_password(state):
    if len(state) == 4 and state == PASSWORD:
        print("Password cracked")

    if len(state) == 4:
        return

    for i in range(2):
        new_state = state + chr(ord('0') + i)
        crack_password(new_state)

crack_password("")
```

## Complexity Analysis

Since the password is only made up of `0s` and `1s`, there are just two choices to choose from at every index in the password string. If the password is of length **N**, a total of **2^N** unique passwords can be created. Since we do not create any data structure of variable other than the one that holds the password string, the space complexity is **O(N)**

> **Worst Case:** The password is the last generated outcome
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(2^N)**
>
> **Best Case:** The password is the first generated outcome
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**
