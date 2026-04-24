# 5. Evaluating expressions using stack

## Table of contents

1. [Understanding the evaluation of postfix expressions](#understanding-the-evaluation-of-postfix-expressions)
2. [Evaluate a postfix expression](#evaluate-a-postfix-expression)
3. [Understanding the evaluation of prefix expressions](#understanding-the-evaluation-of-prefix-expressions)
4. [Evaluate a prefix expression](#evaluate-a-prefix-expression)
5. [Evaluate an infix expression](#evaluate-an-infix-expression)

***

# Understanding the evaluation of postfix expressions

The postfix notation, its structure, and evaluation may seem strange and difficult to grasp initially. This is because we, as humans, are used to the infix notation. However, computers can easily understand these expressions as evaluating them only requires traversal from left to right, no back-and-forth jumping, and complex precedence rules.

Consider we are given the postfix notation of a mathematical expression as a string given below, where every operand is a single-digit number.

// Diagram: Postfix expression with only single digit numbers as a string.

To evaluate a postfix notation, we create a stack `stack` to keep track of all the operands. We then traverse the string from start to end and, in each iteration, check if the current character is a digit or an operator. If the character is a digit, we push it to the top of the stack. If not, we pop two items from the top of the stack and use them as operands for the current operation. We then store the result at the top of the stack to be used as an operand for a subsequent iteration and continue the traversal.

This process is repeated in each iteration until the string traversal is complete. At the end of all iterations, the stack only has one item, which is the output of the complete evaluation of the expression.

It is important to note that when traversing the string from left to right, the most recent item in the stack is the rightmost item seen so far. And so, the first item popped from the stack is the **second** operand, and the second item popped is the **first** operand. This is because the order of writing the operands is always left to right regardless of infix, prefix, or postfix notation.

// Diagram: Evaluating a postfix expression using stack

## Algorithm

The algorithm given below outlines the evaluation of a postfix notation using a stack.

> **Algorithm**
>
> -   **Step 1:** Create a stack \`stack\` to keep track of the most recent operands
> -   **Step 2:** Iterate in the sequence from start to end, and in each iteration, do the following:
>     -   **Step 2.1:** If the current item is an operand, push it to the \`stack\`
>     -   **Step 2.2:** Otherwise, if the current item is an operator, do the following:
>         -   **Step 2.2.1:** Pop two items(\`operand2\` and \`operand1\`) from the \`stack\` and use them as operands for the current operator
>         -   **Step 2.2.2:** Push the result to the top of the \`stack\`
> -   **Step 3:** Return the item at the top of the \`stack\`

## Implementation

The implementation of evaluating a postfix notation of a mathematical expression using a stack is given below.

C++

```cpp
#include <cmath>
#include <stack>
using namespace std;

class Solution {
public:

    // Function to perform arithmetic operations
    float performOperation(
        float operand1,
        float operand2,
        char operation
    ) {
        switch (operation) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand1 - operand2;
        case '*':
            return operand1 * operand2;
        case '/':
            return operand1 / operand2;
        default:
            return 0;
        }

// Diagram: float evaluateAPostfixExpression(string postfix) {

        // Stack to store operands
        stack<float> stack;

        // Iterate through each character in the prefix expression
        for (char ch : postfix) {

            // If the character is an operand (a digit)
            if (isdigit(ch)) {

                // Convert it to an integer and push it onto the stack
                stack.push(ch - '0');
            }

            // If the character is an operator (an arithmetic symbol)
            // perform the operation on the top two operands in the stack
            // and push the result back onto the stack
            else {

                // Get the top operand from the stack
                float operand2 = stack.top();
                stack.pop();

                // Get the second top operand from the stack
                float operand1 = stack.top();
                stack.pop();

                // Apply the arithmetic operation and push the result
                // back to the stack
                stack.push(performOperation(operand1, operand2, ch));
            }

        // Return the final result
        return stack.top();
    }
};
```

Java

```java
import java.util.*;

// Diagram: class Solution {

    // Function to perform arithmetic operations
    public float performOperation(
        float operand1,
        float operand2,
        char operation
    ) {
        switch (operation) {
            case '+':
                return operand1 + operand2;
            case '-':
                return operand1 - operand2;
            case '*':
                return operand1 * operand2;
            case '/':
                return operand1 / operand2;
            default:
                return 0;
        }

// Diagram: public float evaluateAPostfixExpression(String postfix) {

        // Stack to store operands
        Stack<Float> stack = new Stack<>();

        // Iterate through each character in the postfix expression
        for (char ch : postfix.toCharArray()) {

            // If the character is an operand (a digit)
            if (Character.isDigit(ch)) {

                // Convert it to a float and push it onto the stack
                stack.push((float) (ch - '0'));
            }

            // If the character is an operator (an arithmetic symbol)
            // perform the operation on the top two operands in the stack
            // and push the result back onto the stack
            else {

                // Get the top operand from the stack
                float operand2 = stack.pop();

                // Get the second top operand from the stack
                float operand1 = stack.pop();

                // Apply the arithmetic operation and push the result
                // back to the stack
                stack.push(performOperation(operand1, operand2, ch));
            }

        // Return the final result
        return stack.peek();
    }
```

Typescript

```typescript
export class Solution {

    // Function to perform arithmetic operations
    performOperation(
        operand1: number,
        operand2: number,
        operation: string
    ): number {
        switch (operation) {
            case "+":
                return operand1 + operand2;
            case "-":
                return operand1 - operand2;
            case "*":
                return operand1 * operand2;
            case "/":
                return operand1 / operand2;
            default:
                return 0;
        }

// Diagram: evaluateAPostfixExpression(postfix: string): number {

        // Stack to store operands
        const stack: number[] = [];

        // Iterate through each character in the postfix expression
        for (const ch of postfix) {

            // If the character is an operand (a digit)
            if (/\d/.test(ch)) {

                // Convert it to a number and push it onto the stack
                stack.push(Number(ch));
            }

            // If the character is an operator (an arithmetic symbol)
            // perform the operation on the top two operands in the stack
            // and push the result back onto the stack
            else {

                // Get the top operand from the stack
                const operand2: number = stack.pop() || 0;

                // Get the second top operand from the stack
                const operand1: number = stack.pop() || 0;

                // Apply the arithmetic operation and push the result
                // back to the stack
                stack.push(
                    this.performOperation(operand1, operand2, ch)
                );
            }

        // Return the final result
        return stack.pop()!;
    }
```

Javascript

```javascript
export class Solution {

    // Function to perform arithmetic operations
    performOperation(operand1, operand2, operation) {
        switch (operation) {
            case "+":
                return operand1 + operand2;
            case "-":
                return operand1 - operand2;
            case "*":
                return operand1 * operand2;
            case "/":
                return operand1 / operand2;
            default:
                return 0;
        }

// Diagram: evaluateAPostfixExpression(postfix) {

        // Stack to store operands
        const stack = [];

        // Iterate through each character in the postfix expression
        for (const ch of postfix) {

            // If the character is an operand (a digit)
            if (/\d/.test(ch)) {

                // Convert it to a number and push it onto the stack
                stack.push(Number(ch));
            }

            // If the character is an operator (an arithmetic symbol)
            // perform the operation on the top two operands in the stack
            // and push the result back onto the stack
            else {

                // Get the top operand from the stack
                const operand2 = stack.pop() || 0;

                // Get the second top operand from the stack
                const operand1 = stack.pop() || 0;

                // Apply the arithmetic operation and push the result
                // back to the stack
                stack.push(
                    this.performOperation(operand1, operand2, ch)
                );
            }

        // Return the final result
        return stack.pop();
    }
```

Python

```python
from typing import List

class Solution:

    # Function to perform arithmetic operations
    def perform_operation(
        self, operand1: float, operand2: float, operation: str
    ) -> float:
        if operation == "+":
            return operand1 + operand2
        elif operation == "-":
            return operand1 - operand2
        elif operation == "*":
            return operand1 * operand2
        elif operation == "/":
            return operand1 / operand2
        else:
            return 0

    def evaluate_a_postfix_expression(self, postfix: str) -> float:

        # Stack to store operands
        stack: List[float] = []

        # Iterate through each character in the postfix expression
        for ch in postfix:

            # If the character is an operand (a digit)
            if ch.isdigit():

                # Convert it to a float and push it onto the stack
                stack.append(float(ch))

            # If the character is an operator (an arithmetic symbol)
            # perform the operation on the top two operands in the stack
            # and push the result back onto the stack
            else:

                # Get the top operand from the stack
                operand2 = stack.pop()

                # Get the second top operand from the stack
                operand1 = stack.pop()

                # Apply the arithmetic operation and push the result back
                # to the stack
                stack.append(
                    self.perform_operation(operand1, operand2, ch)
                )

        # Return the final result
        return stack[-1]
```

## Complexity Analysis

The algorithm's time and space complexity is easy to understand. We traverse the sequence from the end to the start once, in any case. We push every digit once to the stack, and after each evaluation, we push the result to the stack. So, the total number of push operations is the sum of the number of operands and operators, which is equal to the length of this string **N**. We also pop two items from the stack every time we encounter an operator, so the number of pop operations is twice the number of operators in the string, which cannot be greater than **N**. And so the overall time complexity in any case is linear **O(N)**.

We copy all operands to the stack as we traverse the string from right to left, so the stack's maximum size is the total number of operands in the string. Since every operator has at least one operand associated with it, the total number of operands will always be bounded by N and so the space complexity is linear **O(N)** in any case.

> **Best Case -**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**
>
> **Worst Case -**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Evaluate a postfix expression

## Problem Statement

Given a string **postfix** representing the postfix notation of an expression, write a function to evaluate this expression and return the result. Assume that the postfix expression contains only single-digit numeric operands without any whitespace.

> -   **Postfix expression:** The expression of the form **a b op**. When an operator is followed for every pair of operands.

### Example

> -   **Input:** postfix = 231\*+9-
> -   **Output:** -4.000
> -   **Explanation:** Above is the result obtained after evaluating the postfix expression.

## Solution

```cpp
#include <cmath>
#include <stack>

using namespace std;

class Solution {
public:

    // Function to perform arithmetic operations
    float performOperation(
        float operand1,
        float operand2,
        char operation
    ) {
        switch (operation) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand1 - operand2;
        case '*':
            return operand1 * operand2;
        case '/':
            return operand1 / operand2;
        default:
            return 0;
        }
    }

    float evaluateAPostfixExpression(string postfix) {

        // Stack to store operands
        stack<float> stack;

        // Iterate through each character in the prefix expression
        for (char ch : postfix) {

            // If the character is an operand (a digit)
            if (isdigit(ch)) {

                // Convert it to an integer and push it onto the stack
                stack.push(ch - '0');
            }

            // If the character is an operator (an arithmetic symbol)
            // perform the operation on the top two operands in the stack
            // and push the result back onto the stack
            else {

                // Get the top operand from the stack
                float operand2 = stack.top();
                stack.pop();

                // Get the second top operand from the stack
                float operand1 = stack.top();
                stack.pop();

                // Apply the arithmetic operation and push the result
                // back to the stack
                stack.push(performOperation(operand1, operand2, ch));
            }
        }

        // Return the final result
        return stack.top();
    }
};
```

***

# Understanding the evaluation of prefix expressions

Evaluation of the prefix notation of a mathematical expression is very similar to the postfix notation. Since the placement of operators and operands in the notation implicitly enforces precedence, we traverse the sequence and incrementally evaluate results as we see the operands. The only difference between evaluation postfix and prefix notation is that for evaluating a prefix notation we traverse the sequence in reverse from end to start.

Consider we are given the prefix notation of a mathematical expression as a string given below, where every operand is a single-digit number.

// Diagram: Prefix expression with only single digit numbers as a string.

To evaluate a prefix notation, we create a stack `stack` to keep track of all the operands. We then traverse the string from right to left and, in each iteration, check if the current character is a digit or an operator. If the character is a digit, we push it to the top of the stack. If not, we pop two items from the top of the stack and use them as operands for the current operation. We then store the result at the top of the stack to be used as an operand for a subsequent iteration and continue the traversal to the left.

This process is repeated in each iteration until the string traversal is complete. At the end of all iterations, the stack only has one item, which is the output of the complete evaluation of the expression.

It is important to note that when traversing the string from right to left, the most recent item in the stack is the leftmost item seen so far. And so, the first item popped from the stack is the **first** operand, and the second item popped is the **second** operand. This is because the order of writing the operands is always left to right regardless of infix, prefix, or postfix notation.

// Diagram: Evaluating a prefix expression using stack

## Algorithm

The algorithm given below outlines the evaluation of a prefix notation using a stack.

> **Algorithm**
>
> -   **Step 1:** Create a stack \`stack\` to keep track of the most recent operands
> -   **Step 2:** Iterate in the sequence in reverse, from end to start, and in each iteration, do the following:
>     -   **Step 2.1:** If the current item is an operand, push it to the \`stack\`
>     -   **Step 2.2:** Otherwise, if the current item is an operator, do the following:
>         -   **Step 2.2.1:** Pop two items(\`operand1\` and \`operand2\`) from the \`stack\` and use them as operands for the current operator
>         -   **Step 2.2.2:** Push the result to the top of the \`stack\`
> -   **Step 3:** Return the item at the top of the \`stack\`

## Implementation

The implementation of evaluating a prefix notation of a mathematical expression using a stack is given below.

C++

```cpp
#include <algorithm>
#include <cmath>
#include <stack>

// Diagram: using namespace std;

class Solution {
public:

    // Function to perform arithmetic operations
    float performOperation(
        float operand1,
        float operand2,
        char operation
    ) {
        switch (operation) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand1 - operand2;
        case '*':
            return operand1 * operand2;
        case '/':
            return operand1 / operand2;
        default:
            return 0;
        }

// Diagram: float evaluateAPrefixExpression(string prefix) {

        // Initialize an empty stack to store operands
        stack<float> stack;

        // Reverse the prefix expression
        string reversedPrefix(prefix.rbegin(), prefix.rend());

        // Iterate through each character in the reversed prefix
        // expression
        for (char ch : reversedPrefix) {

            // If the character is an operand (a digit)
            if (isdigit(ch)) {

                // Convert it to an integer and push it onto the stack
                stack.push(ch - '0');
            }

            // If the character is an operator (an arithmetic symbol)
            // perform the operation on the top two operands in the stack
            // and push the result back onto the stack
            else {

                // Pop the top element from the stack as the first
                // operand
                float operand1 = stack.top();
                stack.pop();

                // Pop the top element from the stack as the second
                // operand
                float operand2 = stack.top();
                stack.pop();

                // Apply the arithmetic operation and push the result
                // back to the stack
                stack.push(performOperation(operand1, operand2, ch));
            }

        // Return the final result
        return stack.top();
    }
};
```

Java

```java
import java.util.*;

// Diagram: class Solution {

    // Function to perform arithmetic operations
    public float performOperation(
        float operand1,
        float operand2,
        char operation
    ) {
        switch (operation) {
            case '+':
                return operand1 + operand2;
            case '-':
                return operand1 - operand2;
            case '*':
                return operand1 * operand2;
            case '/':
                return operand1 / operand2;
            default:
                return 0;
        }

// Diagram: public float evaluateAPrefixExpression(String prefix) {

        // Initialize an empty stack to store operands
        Stack<Float> stack = new Stack<>();

        // Reverse the prefix expression
        String reversedPrefix = new StringBuilder(prefix)
            .reverse()
            .toString();

        // Iterate through each character in the reversed prefix
        // expression
        for (char ch : reversedPrefix.toCharArray()) {

            // If the character is an operand (a digit)
            if (Character.isDigit(ch)) {

                // Convert it to a float and push it onto the stack
                stack.push((float) (ch - '0'));
            }

            // If the character is an operator (an arithmetic symbol)
            // perform the operation on the top two operands in the stack
            // and push the result back onto the stack
            else {

                // Pop the top element from the stack as the first
                // operand
                float operand1 = stack.pop();

                // Pop the top element from the stack as the second
                // operand
                float operand2 = stack.pop();

                // Apply the arithmetic operation and push the result
                // back to the stack
                stack.push(performOperation(operand1, operand2, ch));
            }

        // Return the final result
        return stack.pop();
    }
```

Typescript

```typescript
export class Solution {

    // Function to perform arithmetic operations
    performOperation(
        operand1: number,
        operand2: number,
        operation: string
    ): number {
        switch (operation) {
            case "+":
                return operand1 + operand2;
            case "-":
                return operand1 - operand2;
            case "*":
                return operand1 * operand2;
            case "/":
                return operand1 / operand2;
            default:
                return 0;
        }

// Diagram: evaluateAPrefixExpression(prefix: string): number {

        // Initialize an empty stack to store operands
        const stack: number[] = [];

        // Reverse the prefix expression
        const reversedPrefix: string = prefix
            .split("")
            .reverse()
            .join("");

        // Iterate through each character in the reversed prefix
        // expression
        for (const ch of reversedPrefix) {

            // If the character is an operand (a digit)
            if (/\d/.test(ch)) {

                // Convert it to a number and push it onto the stack
                stack.push(Number(ch));
            }

            // If the character is an operator (an arithmetic symbol)
            // perform the operation on the top two operands in the stack
            // and push the result back onto the stack
            else {

                // Pop the top element from the stack as the first
                // operand
                const operand1: number = stack.pop() || 0;

                // Pop the top element from the stack as the second
                // operand
                const operand2: number = stack.pop() || 0;

                // Apply the arithmetic operation and push the result
                // back to the stack
                stack.push(
                    this.performOperation(operand1, operand2, ch)
                );
            }

        // Return the final result
        return stack.pop()!;
    }
```

Javascript

```javascript
export class Solution {

    // Function to perform arithmetic operations
    performOperation(operand1, operand2, operation) {
        switch (operation) {
            case "+":
                return operand1 + operand2;
            case "-":
                return operand1 - operand2;
            case "*":
                return operand1 * operand2;
            case "/":
                return operand1 / operand2;
            default:
                return 0;
        }

// Diagram: evaluateAPrefixExpression(prefix) {

        // Initialize an empty stack to store operands
        const stack = [];

        // Reverse the prefix expression
        const reversedPrefix = prefix.split("").reverse().join("");

        // Iterate through each character in the reversed prefix
        // expression
        for (const ch of reversedPrefix) {

            // If the character is an operand (a digit)
            if (/\d/.test(ch)) {

                // Convert it to a number and push it onto the stack
                stack.push(Number(ch));
            }

            // If the character is an operator (an arithmetic symbol)
            // perform the operation on the top two operands in the stack
            // and push the result back onto the stack
            else {

                // Pop the top element from the stack as the first
                // operand
                const operand1 = stack.pop() || 0;

                // Pop the top element from the stack as the second
                // operand
                const operand2 = stack.pop() || 0;

                // Apply the arithmetic operation and push the result
                // back to the stack
                stack.push(
                    this.performOperation(operand1, operand2, ch)
                );
            }

        // Return the final result
        return stack.pop();
    }
```

Python

```python
from typing import List

class Solution:

    # Function to perform arithmetic operations
    def perform_operation(
        self, operand1: float, operand2: float, operation: str
    ) -> float:
        if operation == "+":
            return operand1 + operand2
        elif operation == "-":
            return operand1 - operand2
        elif operation == "*":
            return operand1 * operand2
        elif operation == "/":
            return operand1 / operand2
        else:
            return 0

    def evaluate_a_prefix_expression(self, prefix: str) -> float:

        # Initialize an empty stack to store operands
        stack: List[float] = []

        # Reverse the prefix expression
        reversed_prefix = prefix[::-1]

        # Iterate through each character in the reversed prefix
        # expression
        for ch in reversed_prefix:

            # If the character is an operand (a digit)
            if ch.isdigit():

                # Convert it to a float and push it onto the stack
                stack.append(float(ch))

            # If the character is an operator (an arithmetic symbol)
            # perform the operation on the top two operands in the stack
            # and push the result back onto the stack
            else:

                # Pop the top element from the stack as the first operand
                operand1 = stack.pop()

                # Pop the top element from the stack as the second
                # operand
                operand2 = stack.pop()

                # Apply the arithmetic operation and push the result back
                # to the stack
                stack.append(
                    self.perform_operation(operand1, operand2, ch)
                )

        # Return the final result
        return stack.pop()
```

## Complexity Analysis

The algorithm's time and space complexity is easy to understand. We traverse the sequence from the end to the start once, in any case. We push every digit once to the stack, and after each evaluation, we push the result to the stack. So, the total number of push operations is the sum of the number of operands and operators, which is equal to the length of this string **N**. We also pop two items from the stack every time we encounter an operator, so the number of pop operations is twice the number of operators in the string, which cannot be greater than **N**. And so the overall time complexity in any case is linear **O(N)**.

We copy all operands to the stack as we traverse the string from right to left, so the stack's maximum size is the total number of operands in the string. Since every operator has at least one operand associated with it, the total number of operands will always be bounded by N and so the space complexity is linear **O(N)** in any case.

> **Best Case -**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**
>
> **Worst Case -**
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

***

# Evaluate a prefix expression

## Problem Statement

Given a string **prefix** representing the prefix notation of an expression, write a function to evaluate this expression and return the result. Assume that the prefix expression contains only single-digit numeric operands without any whitespace.

> -   **Prefix expression:** The expression of the form **op a b**. When an operator is placed before every pair of operands.

### Example

> -   **Input:** prefix = -+8/632
> -   **Output:** 8.000
> -   **Explanation:** Above is the result obtained after evaluating the prefix expression.

## Solution

```cpp
#include <algorithm>
#include <cmath>
#include <stack>

using namespace std;

class Solution {
public:

    // Function to perform arithmetic operations
    float performOperation(
        float operand1,
        float operand2,
        char operation
    ) {
        switch (operation) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand1 - operand2;
        case '*':
            return operand1 * operand2;
        case '/':
            return operand1 / operand2;
        default:
            return 0;
        }
    }

    float evaluateAPrefixExpression(string prefix) {

        // Initialize an empty stack to store operands
        stack<float> stack;

        // Reverse the prefix expression
        string reversedPrefix(prefix.rbegin(), prefix.rend());

        // Iterate through each character in the reversed prefix
        // expression
        for (char ch : reversedPrefix) {

            // If the character is an operand (a digit)
            if (isdigit(ch)) {

                // Convert it to an integer and push it onto the stack
                stack.push(ch - '0');
            }

            // If the character is an operator (an arithmetic symbol)
            // perform the operation on the top two operands in the stack
            // and push the result back onto the stack
            else {

                // Pop the top element from the stack as the first
                // operand
                float operand1 = stack.top();
                stack.pop();

                // Pop the top element from the stack as the second
                // operand
                float operand2 = stack.top();
                stack.pop();

                // Apply the arithmetic operation and push the result
                // back to the stack
                stack.push(performOperation(operand1, operand2, ch));
            }
        }

        // Return the final result
        return stack.top();
    }
};
```

***

# Evaluate an infix expression

## Problem Statement

Given a string **infix** representing the infix notation of an expression, write a function to evaluate this expression and return the result.  Assume that the infix expression contains only single-digit numeric operands without any whitespace.

> -   **Infix expression:** The expression of the form **a op b**. When an operator is in between every pair of operands.

### Example

> -   **Input:** infix = (1+2)\*(3/4)
> -   **Output:** 2.250
> -   **Explanation:** Above is the result obtained after evaluating the infix expression.

## Solution

```cpp
#include <algorithm>
#include <climits>
#include <cmath>
#include <stack>

using namespace std;

class Solution {
public:

    // Function to check if the character is an operator
    bool isOperator(char ch) { return (!isalpha(ch) && !isdigit(ch)); }

    // Function to get the priority of operators
    int getPrecedence(char op) {

        // Assign precedence values to different operators
        if (op == '^') {
            return 3;
        } else if (op == '*' || op == '/') {
            return 2;
        } else if (op == '+' || op == '-') {
            return 1;
        }

        // Default value for unknown operators
        return -1;
    }

    // Function to convert infix expression to postfix expression
    string convertInfixToPostfix(string infix) {

        // Stack to hold operators and parentheses
        stack<char> stack;

        // Final postfix expression
        string postfix;

        for (char ch : infix) {

            // If the character is not an operator or parentheses,
            // add it to the postfix string
            if (!isOperator(ch) && ch != '(' && ch != ')') {
                postfix += ch;
            }

            // If the character is an opening parentheses, push it
            // onto the stack
            else if (ch == '(') {
                stack.push(ch);
            }

            // If the character is a closing parentheses, pop
            // operators from the stack and add them to the postfix
            // string until an opening parentheses is encountered
            else if (ch == ')') {
                while (!stack.empty() && stack.top() != '(') {
                    postfix += stack.top();
                    stack.pop();
                }

                // Remove the opening parentheses from the stack
                if (!stack.empty() && stack.top() == '(') {
                    stack.pop();
                }
            }

            // If the character is an operator, compare its
            // precedence with the top of the stack and add higher or
            // equal precedence operators to the postfix string
            else {
                while (!stack.empty() &&
                       getPrecedence(ch) <= getPrecedence(stack.top())) {
                    if (stack.top() != '(') {
                        postfix += stack.top();
                    }
                    stack.pop();
                }

                // Push the current operator onto the stack
                stack.push(ch);
            }
        }

        // Pop any remaining operators from the stack and add them to the
        // postfix string
        while (!stack.empty()) {
            postfix += stack.top();
            stack.pop();
        }

        return postfix;
    }

    // Function to perform arithmetic operations
    float performOperation(
        float operand1,
        float operand2,
        char operation
    ) {
        switch (operation) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand1 - operand2;
        case '*':
            return operand1 * operand2;
        case '/':
            return operand1 / operand2;
        default:
            return 0;
        }
    }

    // Function to evaluate a postfix expression
    float evaluateAPostfixExpression(string postfix) {

        // Stack to store operands
        stack<float> stack;

        // Iterate through each character in the prefix expression
        for (char ch : postfix) {

            // If the character is an operand (a digit)
            if (isdigit(ch)) {

                // Convert it to an integer and push it onto the stack
                stack.push(ch - '0');
            }

            // If the character is an operator (an arithmetic symbol)
            // perform the operation on the top two operands in the stack
            // and push the result back onto the stack
            else {

                // Pop the top element from the stack as the second
                // operand
                float operand2 = stack.top();
                stack.pop();

                // Pop the top element from the stack as the first
                // operand
                float operand1 = stack.top();
                stack.pop();

                // Apply the arithmetic operation and push the result
                // back to the stack
                stack.push(performOperation(operand1, operand2, ch));
            }
        }

        // Return the final result
        return stack.top();
    }

    float evaluateAnInfixExpression(string infix) {

        // Convert the infix expression to postfix notation
        string postfix = convertInfixToPostfix(infix);

        // Evaluate the postfix expression and return the result
        return evaluateAPostfixExpression(postfix);
    }
};
```
