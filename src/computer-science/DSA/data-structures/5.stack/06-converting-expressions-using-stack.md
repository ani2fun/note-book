# 6. Converting expressions using stack

## Table of contents

1. [Understanding postfix to prefix conversion](#understanding-postfix-to-prefix-conversion)
2. [Convert postfix to prefix](#convert-postfix-to-prefix)
3. [Understanding postfix to infix conversion](#understanding-postfix-to-infix-conversion)
4. [Convert postfix to infix](#convert-postfix-to-infix)
5. [Understanding prefix to postfix conversion](#understanding-prefix-to-postfix-conversion)
6. [Convert prefix to postfix](#convert-prefix-to-postfix)
7. [Understanding prefix to infix conversion](#understanding-prefix-to-infix-conversion)
8. [Convert prefix to infix](#convert-prefix-to-infix)
9. [Understanding infix to postfix conversion](#understanding-infix-to-postfix-conversion)
10. [Convert infix to postfix](#convert-infix-to-postfix)
11. [Understanding infix to prefix conversion](#understanding-infix-to-prefix-conversion)
12. [Convert infix to prefix](#convert-infix-to-prefix)

***

# Understanding postfix to prefix conversion

Both the prefix and postfix notation may seem just the opposite of each other but it is important to note that simply reversing the postfix notation does not convert it to the prefix notation. This is because certain operators like division and modulo operators also follow associativity rules, meaning that the relative order of operands affects the results. Moreover, nested expressions, where the evaluated result of a sub-expression is used as an operand for evaluating the remaining expression, rely on the correct order of operators and operands. Consider the example below

// Diagram: An example of a postfix expression.

Now, consider reversing the postfix expression in an attempt to generate the prefix expression. This will generate an incorrect prefix notation that does not evaluate the same as the original postfix notation. This is because, in the postfix notation, an operator must follow its operands, and simply reversing does not consider this pairing and associativity of the operator.

// Diagram: Reversing the postfix notation does not result in the correct prefix expression.

To correctly convert a postfix notation to a prefix notation, we need to ensure that the operators are placed **before** the operands while maintaining the original evaluation order. It is important to note that since, for nested expression, evaluated results of subexpressions are treated as operands, we also need to keep track of subexpressions and decide when to use them as operands.

We can use a stack to group operands together and create a prefix expression when we see an operator. The LIFO order of stack ensures we group the current operator with the most recent previous operands, which may be subexpressions themselves. Consider we are given a string s denoting the postfix notation of an expression and we need to convert it to prefix notation.

// Diagram: Convert an expression in postfix notation to prefix notation

To convert a postfix notation to a prefix notation, we create a stack `stack` to hold string values that we will use to build the prefix expression incrementally. We iterate in the string from start to end and in each iteration, check if the current character is an operator or operand. If it is an operand, we push it to the top of the stack. If not, we extract two operands from the top of the stack and construct a prefix expression by concatenating the operands and the current operator such that the operator is before the operands. We then push this expression to the top of the stack to be used as an operand in later iterations.

It is important to note that because the stack follows the LIFO order, the first pop operation on the stack gives us the second operand, while the second pop operation gives us the first operand.

At the end of all iterations, the top of the stack has the equivalent prefix notation.

// Diagram: Convert an expression in postfix notation to prefix notation

## Algorithm

The algorithm given below outlines the conversion of an expression in postfix notation to prefix using a stack.

> **Algorithm**
>
> -   **Step 1:** Create a stack \`stack\` to incrementally build the prefix expressions
> -   **Step 2:** Iterate in the string from start to end, and in each iteration, do the following:
>     -   **Step 2.1:** If the current item is an operand, push it to the top of the \`stack\`
>     -   **Step 2.2:** Otherwise, if it is an operator, do the following
>         -   **Step 2.2.1:** Pop \`operand2\` and \`operand1\` respectively from the top of the \`stack\` and use the operator to create a prefix expression
>         -   **Step 2.2.2:** Push the result to the \`stack\`
> -   **Step 3:** Return the top of the \`stack\` as the prefix string.

## Implementation

The implementation of converting an expression in postfix notation to prefix notation using a stack is given below.

C++

```cpp
#include <stack>

// Diagram: using namespace std;

class Solution {
public:

    // Function to check if a character is an operator
    bool isOperator(char ch) { return (!isalpha(ch) && !isdigit(ch)); }

    string convertPostfixToPrefix(string postfix) {
        stack<string> stack;
        int length = postfix.size();

// Diagram: for (int i = 0; i < length; i++) {

            // If the character is an operator, pop the top two
            // elements from the stack
            if (isOperator(postfix[i])) {

                // Pop the top element from the stack as the second
                // operand
                string operand2 = stack.top();
                stack.pop();

                // Pop the top element from the stack as the first
                // operand
                string operand1 = stack.top();
                stack.pop();

                // Construct the prefix expression by placing the
                // operator before the operands
                string expr = postfix[i] + operand1 + operand2;
                stack.push(expr);
            }

            // If the character is not an operator, push it to the
            // stack as a single-character string
            else {
                stack.push(string(1, postfix[i]));
            }

        // The final element in the stack will be the prefix expression
        return stack.top();
    }
};
```

Java

```java
import java.util.*;

// Diagram: class Solution {

    // Function to check if a character is an operator
    public boolean isOperator(char ch) {
        return (!Character.isLetter(ch) && !Character.isDigit(ch));
    }

    public String convertPostfixToPrefix(String postfix) {
        Stack<String> stack = new Stack<>();
        int length = postfix.length();

// Diagram: for (int i = 0; i < length; i++) {

            // If the character is an operator, pop the top two
            // elements from the stack
            if (isOperator(postfix.charAt(i))) {

                // Pop the top element from the stack as the second
                // operand
                String operand2 = stack.pop();

                // Pop the top element from the stack as the first
                // operand
                String operand1 = stack.pop();

                // Construct the prefix expression by placing the
                // operator before the operands
                String expr = postfix.charAt(i) + operand1 + operand2;
                stack.push(expr);
            }

            // If the character is not an operator, push it to the
            // stack as a single-character string
            else {
                stack.push(String.valueOf(postfix.charAt(i)));
            }

        // The final element in the stack will be the prefix expression
        return stack.pop();
    }
```

Typescript

```typescript
export class Solution {

    // Function to check if a character is an operator
    isOperator(ch: string): boolean {
        return !ch.match(/[a-zA-Z]/) && !ch.match(/[0-9]/);
    }

    convertPostfixToPrefix(postfix: string): string {
        const stack: string[] = [];
        const length = postfix.length;

// Diagram: for (let i = 0; i < length; i++) {

            // If the character is an operator, pop the top two
            // elements from the stack
            if (this.isOperator(postfix[i])) {

                // Pop the top element from the stack as the second
                // operand
                const operand2 = stack.pop();

                // Pop the top element from the stack as the first
                // operand
                const operand1 = stack.pop();

                // Construct the prefix expression by placing the
                // operator before the operands
                const expr = postfix[i] + operand1 + operand2;
                stack.push(expr);
            }

            // If the character is not an operator, push it to the
            // stack as a single-character string
            else {
                stack.push(postfix[i]);
            }

        // The final element in the stack will be the prefix expression
        return stack.pop() || "";
    }
```

Javascript

```javascript
export class Solution {

    // Function to check if a character is an operator
    isOperator(ch) {
        return !ch.match(/[a-zA-Z]/) && !ch.match(/[0-9]/);
    }

    convertPostfixToPrefix(postfix) {
        const stack = [];
        const length = postfix.length;

// Diagram: for (let i = 0; i < length; i++) {

            // If the character is an operator, pop the top two
            // elements from the stack
            if (this.isOperator(postfix[i])) {

                // Pop the top element from the stack as the second
                // operand
                const operand2 = stack.pop();

                // Pop the top element from the stack as the first
                // operand
                const operand1 = stack.pop();

                // Construct the prefix expression by placing the
                // operator before the operands
                const expr = postfix[i] + operand1 + operand2;
                stack.push(expr);
            }

            // If the character is not an operator, push it to the
            // stack as a single-character string
            else {
                stack.push(postfix[i]);
            }

        // The final element in the stack will be the prefix expression
        return stack.pop() || "";
    }
```

Python

```python
from typing import List

class Solution:

    # Function to check if a character is an operator
    def is_operator(self, ch: str) -> bool:
        return not ch.isalpha() and not ch.isdigit()

    def convert_postfix_to_prefix(self, postfix: str):
        stack: List[str] = []
        length: int = len(postfix)

        for i in range(length):

            # If the character is an operator, pop the top two
            # elements from the stack
            if self.is_operator(postfix[i]):

                # Pop the top element from the stack as the second
                # operand
                operand2 = stack.pop()

                # Pop the top element from the stack as the first
                # operand
                operand1 = stack.pop()

                # Construct the prefix expression by placing the operator
                # before the operands
                expr = postfix[i] + operand1 + operand2
                stack.append(expr)

            # If the character is not an operator, push it to the
            # stack as a single-character string
            else:
                stack.append(postfix[i])

        # The final element in the stack will be the prefix expression
        return stack.pop()
```

## Complexity Analysis

The algorithm's time and space complexity is easy to understand. We traverse the sequence from start to end once and do a series of push, pop, and concatenate operations. A postfix expression of size **N** with **X** operands cannot have more than **X-1** operators such that **X + X - 1 = N**.

Every time we find an operand, we push it to the stack. In contrast, every time we find an operator, we perform two pop operations to get the two operands and a concatenate operation to create the expression. Since push and pop are constant time **O(1)** operations and every character is concatenated exactly once in the result(prefix) string, the overall time complexity is linear **O(N)**.

The stack holds partially converted prefix expressions that are eventually concatenated with operators in the prefix format to get bigger expressions. This process continues until the stack's top has the fully converted prefix notation, which is also when the stack has the maximum size, i.e., linear **O(N)**.

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

# Convert postfix to prefix

## Problem Statement

Given a string **postfix** representing the postfix notation of an expression, write a function to convert this expression to a **prefix** notation.

> -   **Postfix expression:** The expression of the form **a b op**. When an operator is followed for every pair of operands.
> -   **Prefix expression:** The expression of the form **op a b**. When an operator is placed before every pair of operands.

### Example

> -   **Input:** postfix = 783/-52/6-\*
> -   **Output:** \*-7/83-/526
> -   **Explanation:** Above is the prefix notation of the given postfix notation.

## Solution

```cpp
#include <stack>

using namespace std;

class Solution {
public:

    // Function to check if a character is an operator
    bool isOperator(char ch) { return (!isalpha(ch) && !isdigit(ch)); }

    string convertPostfixToPrefix(string postfix) {
        stack<string> stack;
        int length = postfix.size();

        for (int i = 0; i < length; i++) {

            // If the character is an operator, pop the top two
            // elements from the stack
            if (isOperator(postfix[i])) {

                // Pop the top element from the stack as the second
                // operand
                string operand2 = stack.top();
                stack.pop();

                // Pop the top element from the stack as the first
                // operand
                string operand1 = stack.top();
                stack.pop();

                // Construct the prefix expression by placing the
                // operator before the operands
                string expr = postfix[i] + operand1 + operand2;
                stack.push(expr);
            }

            // If the character is not an operator, push it to the
            // stack as a single-character string
            else {
                stack.push(string(1, postfix[i]));
            }
        }

        // The final element in the stack will be the prefix expression
        return stack.top();
    }
};
```

***

# Understanding postfix to infix conversion

Postfix expressions may seem very different from the infix expressions we are used to, but these two notations can be converted back and forth into each other. To convert a postfix expression into an infix, we need to traverse through the expression and place the operator between the operands for all operand pairs. As we will see shortly, this process creates small infix expressions from the initial operators and operands that then serve as operands themselves to form bigger infix expressions. At the end of the process, the entire postfix expression is converted into an infix expression.

To convert a postfix expression to an infix expression, we follow the same idea as its evaluation with only a slight difference. On finding an operator, instead of evaluating the results using the most recent operands, we create an infix expression from the operator and operands and save it on a stack as the operand in a subsequent iteration.

Consider we are given the postfix notation of a mathematical expression as a string given below, where every operand is a single-digit number.

// Diagram: Postfix expression with only single digit numbers as a string.

To evaluate a postfix notation, we create a stack `stack` to keep track of all the operands. We then traverse the string from start to end and, in each iteration, check if the current character is a digit or an operator. If the character is a digit, we push it to the top of the stack. If not, we pop two items from the top of the stack and use them as operands for the current operation to create an infix expression, also adding parentheses at both ends. We then store the expression at the top of the stack as an operand to be used in a subsequent iteration and continue the traversal.

This process is repeated in each iteration until the string traversal is complete. At the end of all iterations, the top of the stack has the infix expression.

It is important to note that when traversing the string from left to right, the most recent item in the stack is the rightmost item seen so far. And so, the first item popped from the stack is the **second** operand, and the second item popped is the **first** operand. This is because the order of writing the operands is always left to right regardless of infix, prefix, or postfix notation.

// Diagram: Convert a postfix expression to infix

## Algorithm

The algorithm given below outlines the conversion of a postfix expression to infix using a stack.

> **Algorithm**
>
> -   **Step 1:** Create a stack \`stack\` to keep track of the most recent operands
> -   **Step 2:** Iterate in the sequence from start to end, and in each iteration, do the following:
>     -   **Step 2.1:** If the current item is an operand, push it to the \`stack\`
>     -   **Step 2.2:** Otherwise, if the current item is an operator, do the following:
>         -   **Step 2.2.1:** Pop two items(\`operand2\` and \`operand1\`) from the \`stack\` and use them as operands for the current operator
>         -   **Step 2.2.2:** Create an infix expression from the operator and operands and push the result to the top of the \`stack\`
> -   **Step 3:** Return the item at the top of the \`stack\`

## Implementation

The implementation of converting an expression in postfix notation to infix notation using a stack is given below.

C++

```cpp
#include <stack>

// Diagram: using namespace std;

class Solution {
public:

    // Function to check if a character is an operator
    bool isOperator(char ch) { return (!isalpha(ch) && !isdigit(ch)); }

    string convertPostfixToInfix(string postfix) {
        stack<string> stack;
        int length = postfix.size();

// Diagram: for (int i = 0; i < length; i++) {

            // If the character is an operator, pop the top two elements
            // from the stack and construct the infix expression by
            // placing the operands and operator within parentheses
            if (isOperator(postfix[i])) {

                // Pop the top element from the stack as the second
                // operand
                string operand2 = stack.top();
                stack.pop();

                // Pop the top element from the stack as the first
                // operand
                string operand1 = stack.top();
                stack.pop();

                // Construct the infix expression by placing the operands
                // and operator within parentheses
                string expr =
                    "(" + operand1 + postfix[i] + operand2 + ")";
                stack.push(expr);
            }

            // If the character is not an operator, push it to the
            // stack as a single-character string
            else {
                stack.push(string(1, postfix[i]));
            }

        // The final element in the stack will be the infix expression
        return stack.top();
    }
};
```

Java

```java
import java.util.*;

// Diagram: class Solution {

    // Function to check if a character is an operator
    public boolean isOperator(char ch) {
        return (!Character.isLetter(ch) && !Character.isDigit(ch));
    }

    public String convertPostfixToInfix(String postfix) {
        Stack<String> stack = new Stack<>();
        int length = postfix.length();

// Diagram: for (int i = 0; i < length; i++) {

            // If the character is an operator, pop the top two elements
            // from the stack and construct the infix expression by
            // placing the operands and operator within parentheses
            if (isOperator(postfix.charAt(i))) {

                // Pop the top element from the stack as the second
                // operand
                String operand2 = stack.pop();

                // Pop the top element from the stack as the first
                // operand
                String operand1 = stack.pop();

                // Construct the infix expression by placing the operands
                // and operator within parentheses
                String expr =
                    "(" + operand1 + postfix.charAt(i) + operand2 + ")";
                stack.push(expr);
            }

            // If the character is not an operator, push it to the
            // stack as a single-character string
            else {
                stack.push(String.valueOf(postfix.charAt(i)));
            }

        // The final element in the stack will be the infix expression
        return stack.pop();
    }
```

Typescript

```typescript
#include <stack>
```

Javascript

```javascript
export class Solution {

    // Function to check if a character is an operator
    isOperator(ch) {
        return !ch.match(/[a-zA-Z]/) && !ch.match(/[0-9]/);
    }

    convertPostfixToInfix(postfix) {
        const stack = [];
        const length = postfix.length;

// Diagram: for (let i = 0; i < length; i++) {

            // If the character is an operator, pop the top two elements
            // from the stack and construct the infix expression by
            // placing the operands and operator within parentheses
            if (this.isOperator(postfix[i])) {

                // Pop the top element from the stack as the second
                // operand
                const operand2 = stack.pop();

                // Pop the top element from the stack as the first
                // operand
                const operand1 = stack.pop();

                // Construct the infix expression by placing the operands
                // and operator within parentheses
                const expr = `(${operand1}${postfix[i]}${operand2})`;
                stack.push(expr);
            }

            // If the character is not an operator, push it to the
            // stack as a single-character string
            else {
                stack.push(postfix[i]);
            }

        // The final element in the stack will be the infix expression
        return stack.pop() || "";
    }
```

Python

```python
from typing import List

class Solution:

    # Function to check if a character is an operator
    def is_operator(self, ch: str) -> bool:
        return not ch.isalpha() and not ch.isdigit()

    def convert_postfix_to_infix(self, postfix: str) -> str:
        stack: List[str] = []
        length: int = len(postfix)

        for i in range(length):

            # If the character is an operator, pop the top two elements
            # from the stack and construct the infix expression by
            # placing the operands and operator within parentheses
            if self.is_operator(postfix[i]):

                # Pop the top element from the stack as the second operand
                operand2 = stack.pop()

                # Pop the top element from the stack as the first operand
                operand1 = stack.pop()

                # Construct the infix expression by placing the operands
                # and operator within parentheses
                expr: str = "(" + operand1 + postfix[i] + operand2 + ")"
                stack.append(expr)

            # If the character is not an operator, push it to the
            # stack as a single-character string
            else:
                stack.append(postfix[i])

        # The final element in the stack will be the infix expression
        return stack.pop()
```

## Complexity Analysis

The algorithm's time and space complexity is easy to understand. We traverse the sequence from the start to the end once and do a series of push and pop operations. We push every digit once to the stack, and when finding an operator, we push a partial infix expression once to the stack. So, the total number of push operations is equal to the length of expression **N**. We also pop two items from the stack every time we encounter an operator, and since for an expression of length N, there cannot be more than **N/2** operators, the number of pop operations is N. All push and pop operations are constant **O(1),** leading to a total contribution of **O(N)**.

On encountering an operator, we concatenate two operands (strings) to create an infix expression. Since all concatenations effectively merge smaller infix expressions into the final result, every character is only concatenated once in the result string. ultimately lead to the find infix expression. Accounting for two parentheses for every operand to total single character concatenate operations are  **N + 2\*N/2 = 2N**. Considering adding a character at the end of the string is constant **O(1)**, the overall time complexity is linear **O(N)**.

We copy all operands to the stack as we traverse the string from right to left. As we combine operands to create infix expressions and store them on a stack, the size of each stack frame increases. However, concatenating all the strings from all the stack frames in the end results in the infix expression itself, and so the total size of all strings, including parentheses, is bounded by **O(N)**.

Hence the space complexity is also linear **O(N)** in any case.

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

# Convert postfix to infix

## Problem Statement

Given a string **postfix** representing the postfix notation of an expression, write a function to convert this expression to an **infix** notation.

> -   **Postfix expression:** The expression of the form **a b op**. When an operator is followed for every pair of operands.
> -   **Infix expression:** The expression of the form **a op b**. When an operator is in between every pair of operands.

### Example

> -   **Input:** postfix = 5647^9-326\*+^\*+2-
> -   **Output:** ((5+(6\*(((4^7)-9)^(3+(2\*6)))))-2)
> -   **Explanation:** Above is the infix notation of the given postfix notation.

## Solution

```cpp
#include <stack>

using namespace std;

class Solution {
public:

    // Function to check if a character is an operator
    bool isOperator(char ch) { return (!isalpha(ch) && !isdigit(ch)); }

    string convertPostfixToInfix(string postfix) {
        stack<string> stack;
        int length = postfix.size();

        for (int i = 0; i < length; i++) {

            // If the character is an operator, pop the top two elements
            // from the stack and construct the infix expression by
            // placing the operands and operator within parentheses
            if (isOperator(postfix[i])) {

                // Pop the top element from the stack as the second
                // operand
                string operand2 = stack.top();
                stack.pop();

                // Pop the top element from the stack as the first
                // operand
                string operand1 = stack.top();
                stack.pop();

                // Construct the infix expression by placing the operands
                // and operator within parentheses
                string expr =
                    "(" + operand1 + postfix[i] + operand2 + ")";
                stack.push(expr);
            }

            // If the character is not an operator, push it to the
            // stack as a single-character string
            else {
                stack.push(string(1, postfix[i]));
            }
        }

        // The final element in the stack will be the infix expression
        return stack.top();
    }
};
```

***

# Understanding prefix to postfix conversion

Just as reversing the postfix notation of an expression does not result in its prefix notation, reversing the prefix notation does not convert it to the postfix notation. This is because reversing the string does not respect the associativity of operators and their pairing with operands. Moreover, nested expressions, where the evaluated result of a sub-expression is used as an operand for evaluating the remaining expression, rely on the correct order of operators and operands. Consider the example below

// Diagram: An example of a prefix expression.

Now, consider reversing the prefix expression in an attempt to generate the postfix expression. This will generate an incorrect postfix notation that does not evaluate the same as the original prefix notation. This is because, in the prefix notation, an operator must precede its operands, and simply reversing does not consider this pairing and associativity of the operator.

// Diagram: Reversing the prefix notation does not result in the correct postfix expression.

To correctly convert a prefix notation to a postfix notation, we need to ensure that the operators are placed **after** the operands while maintaining the original evaluation order. It is important to note that since, for nested expression, evaluated results of subexpressions are treated as operands, we also need to keep track of subexpressions and decide when to use them as operands.

We can use a stack to group operands together and create a postfix expression when we see an operator. The LIFO order of stack ensures we group the current operator with the most recent previous operands, which may be subexpressions themselves. Consider we are given a string `s` denoting the prefix notation of an expression and we need to convert it to postfix notation. 

// Diagram: Convert an expression in prefix notation to postfix notation

To convert a prefix notation to a prefix notation, we create a stack `stack` to hold string values that we will use to build the postfix expression incrementally. We iterate in the string in reverse, from end to start and in each iteration, check if the current character is an operator or operand. If it is an operand, we push it to the top of the stack. If not, we extract two operands from the top of the stack and construct a postfix expression by concatenating the operands and the current operator such that the operator is after the operands. We then push this expression to the top of the stack to be used as an operand in later iterations.

It is important to note that because the stack follows the LIFO order and because we iterate in reverse, the first pop operation on the stack gives us the first operand, while the second pop operation gives us the second operand.

At the end of all iterations, the top of the stack has the equivalent postfix notation.

// Diagram: Convert an expression in prefix notation to postfix notation

## Algorithm

The algorithm given below outlines the conversion of an expression in prefix notation to postfix using a stack.

> **Algorithm**
>
> -   **Step 1:** Create a stack \`stack\` to incrementally build the postfix expressions
> -   **Step 2:** Iterate in the string in reverse from end to start, and in each iteration, do the following:
>     -   **Step 2.1:** If the current item is an operand, push it to the top of the \`stack\`
>     -   **Step 2.2:** Otherwise, if it is an operator, do the following
>         -   **Step 2.2.1:** Pop \`operand1\` and \`operand2\` respectively from the top of the \`stack\` and use the operator to create a postfix expression
>         -   **Step 2.2.2:** Push the result to the \`stack\`
> -   **Step 3:** Return the top of the \`stack\` as the postfix string.

## Implementation

The implementation of converting an expression in prefix notation to postfix notation using a stack is given below.

## Complexity Analysis

The algorithm's time and space complexity is easy to understand. We traverse the sequence in reverse from end to start once and do a series of push, pop, and concatenate operations. A prefix expression of size **N** with **X** operands cannot have more than **X-1** operators such that **X + X - 1 = N**.

Every time we find an operand, we push it to the stack. In contrast, every time we find an operator, we perform two pop operations to get the two operands and a concatenate operation to create the expression. Since push and pop are constant time **O(1)** operations and every character is concatenated exactly once in the result (postfix) string, the overall time complexity is linear **O(N)**.

The stack holds partially converted postfix expressions that are eventually concatenated with operators in the postfix format to get bigger expressions. This process continues until the stack's top has the fully converted postfix notation, which is also when the stack has the maximum size, i.e., linear **O(N)**.

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

# Convert prefix to postfix

## Problem Statement

Given a string **prefix** representing the prefix notation of an expression, write a function to convert this expression to a **postifx** notation.

> -   **Prefix expression:** The expression of the form **op a b**. When an operator is placed before every pair of operands.
> -   **Postfix expression:** The expression of the form **a b op**. When an operator is followed for every pair of operands.

### Example

> -   **Input:** pre = \*-7/83-/526
> -   **Output:** 783/-52/6-\*
> -   **Explanation:** Above is the postfix notation of the given prefix notation.

## Solution

```cpp
#include <stack>

using namespace std;

class Solution {
public:

    // Function to check if a character is an operator
    bool isOperator(char ch) { return (!isalpha(ch) && !isdigit(ch)); }

    string convertPrefixToPostfix(string prefix) {
        stack<string> stack;
        int length = prefix.size();

        for (int i = length - 1; i >= 0; i--) {

            // If the character is an operator, pop the top two
            // elements from the stack
            if (isOperator(prefix[i])) {

                // Pop the top element from the stack as the first
                // operand
                string operand1 = stack.top();
                stack.pop();

                // Pop the top element from the stack as the second
                // operand
                string operand2 = stack.top();
                stack.pop();

                // Construct the postfix expression by placing the
                // operands followed by the operator
                string expr = operand1 + operand2 + prefix[i];
                stack.push(expr);
            }

            // If the character is not an operator, push it to the
            // stack as a single-character string
            else {
                stack.push(string(1, prefix[i]));
            }
        }

        // The final element in the stack will be the postfix expression
        return stack.top();
    }
};
```

***

# Understanding prefix to infix conversion

Prefix expressions may seem very different from the infix expressions we are used to, but these two notations can be converted back and forth into each other. To convert a prefix expression into an infix, we need to traverse through the expression and place the operator between the operands for all operand pairs. As we will see shortly, this process creates small infix expressions from the initial operators and operands that then serve as operands themselves to form bigger infix expressions. At the end of the process, the entire prefix expression is converted into an infix expression.

To convert a prefix expression to an infix expression, we follow the same idea as its evaluation with only a slight difference. On finding an operator, instead of evaluating the results using the most recent operands, we create an infix expression from the operator and operands and save it on a stack as the operand in a subsequent iteration.

Consider we are given the prefix notation of a mathematical expression as a string given below, where every operand is a single-digit number.

// Diagram: Prefix expression with only single digit numbers as a string.

To evaluate a prefix notation, we create a stack `stack` to keep track of all the operands. We then traverse the string in reverse from end to start and, in each iteration, check if the current character is a digit or an operator. If the character is a digit, we push it to the top of the stack. If not, we pop two items from the top of the stack and use them as operands for the current operation to create an infix expression, also adding parentheses at both ends. We then store the expression at the top of the stack as an operand to be used in a subsequent iteration and continue the traversal.

This process is repeated in each iteration until the string traversal is complete. At the end of all iterations, the top of the stack has the infix expression.

It is important to note that when traversing the string from right to left, the most recent item in the stack is the leftmost item seen so far. And so, the first item popped from the stack is the **first** operand, and the second item popped is the **second** operand. This is because the order of writing the operands is always left to right regardless of infix, prefix, or postfix notation.

// Diagram: Convert a prefix expression to infix

## Algorithm

The algorithm given below outlines the conversion of a prefix expression to infix using a stack.

> **Algorithm**
>
> -   **Step 1:** Create a stack \`stack\` to keep track of the most recent operands
> -   **Step 2:** Iterate in the sequence in reverse from end to start, and in each iteration, do the following:
>     -   **Step 2.1:** If the current item is an operand, push it to the \`stack\`
>     -   **Step 2.2:** Otherwise, if the current item is an operator, do the following:
>         -   **Step 2.2.1:** Pop two items(\`operand1\` and \`operand2\`) from the \`stack\` and use them as operands for the current operator
>         -   **Step 2.2.2:** Create an infix expression from the operator and operands and push the result to the top of the \`stack\`
> -   **Step 3:** Return the item at the top of the \`stack\`

## Implementation

The implementation of converting an expression in prefix notation to infix notation using a stack is given below.

C++

```cpp
#include <stack>

// Diagram: using namespace std;

class Solution {
public:

    // Function to check if a character is an operator
    bool isOperator(char ch) { return (!isalpha(ch) && !isdigit(ch)); }

    string convertPrefixToInfix(string prefix) {
        stack<string> stack;
        int length = prefix.size();

// Diagram: for (int i = length - 1; i >= 0; i--) {

            // If the character is an operator, pop the top two
            // elements from the stack and construct the infix expression
            // by placing the operator in between the operands
            if (isOperator(prefix[i])) {

                // Pop the top element from the stack as the first
                // operand
                string operand1 = stack.top();
                stack.pop();

                // Pop the top element from the stack as the second
                // operand
                string operand2 = stack.top();
                stack.pop();

                // Construct the infix expression by placing the operator
                // in between the operands
                string expr =
                    "(" + operand1 + prefix[i] + operand2 + ")";
                stack.push(expr);
            }

            // If the character is not an operator, push it to the
            // stack as a single-character string
            else {
                stack.push(string(1, prefix[i]));
            }

        // The final element in the stack will be the infix expression
        return stack.top();
    }
};
```

Java

```java
import java.util.*;

// Diagram: class Solution {

    // Function to check if a character is an operator
    public boolean isOperator(char ch) {
        return !Character.isLetter(ch) && !Character.isDigit(ch);
    }

    public String convertPrefixToInfix(String prefix) {
        Stack<String> stack = new Stack<>();
        int length = prefix.length();

// Diagram: for (int i = length - 1; i >= 0; i--) {

            // If the character is an operator, pop the top two
            // elements from the stack and construct the infix expression
            // by placing the operator in between the operands
            if (isOperator(prefix.charAt(i))) {

                // Pop the top element from the stack as the first
                // operand
                String operand1 = stack.pop();

                // Pop the top element from the stack as the second
                // operand
                String operand2 = stack.pop();

                // Construct the infix expression by placing the operator
                // in between the operands
                String expr =
                    "(" + operand1 + prefix.charAt(i) + operand2 + ")";
                stack.push(expr);
            }

            // If the character is not an operator, push it to the
            // stack as a single-character string
            else {
                stack.push(String.valueOf(prefix.charAt(i)));
            }

        // The final element in the stack will be the infix expression
        return stack.pop();
    }
```

Typescript

```typescript
export class Solution {

    // Function to check if a character is an operator
    isOperator(ch: string): boolean {
        return !ch.match(/[a-zA-Z]/) && !ch.match(/[0-9]/);
    }

    convertPrefixToInfix(prefix: string): string {
        const stack: string[] = [];
        const length: number = prefix.length;

// Diagram: for (let i = length - 1; i >= 0; i--) {

            // If the character is an operator, pop the top two
            // elements from the stack and construct the infix expression
            // by placing the operator in between the operands
            if (this.isOperator(prefix[i])) {

                // Pop the top element from the stack as the first
                // operand
                const operand1: string = stack.pop() || "";

                // Pop the top element from the stack as the second
                // operand
                const operand2: string = stack.pop() || "";

                // Construct the infix expression by placing the operator
                // in between the operands
                const expr: string = `(${operand1}${prefix[i]}${operand2})`;
                stack.push(expr);
            }

            // If the character is not an operator, push it to the
            // stack as a single-character string
            else {
                stack.push(prefix[i]);
            }

        // The final element in the stack will be the infix expression
        return stack.pop() || "";
    }
```

Javascript

```javascript
export class Solution {

    // Function to check if a character is an operator
    isOperator(ch) {
        return !ch.match(/[a-zA-Z]/) && !ch.match(/[0-9]/);
    }

    convertPrefixToInfix(prefix) {
        const stack = [];
        const length = prefix.length;

// Diagram: for (let i = length - 1; i >= 0; i--) {

            // If the character is an operator, pop the top two
            // elements from the stack and construct the infix expression
            // by placing the operator in between the operands
            if (this.isOperator(prefix[i])) {

                // Pop the top element from the stack as the first
                // operand
                const operand1 = stack.pop() || "";

                // Pop the top element from the stack as the second
                // operand
                const operand2 = stack.pop() || "";

                // Construct the infix expression by placing the operator
                // in between the operands
                const expr = `(${operand1}${prefix[i]}${operand2})`;
                stack.push(expr);
            }

            // If the character is not an operator, push it to the
            // stack as a single-character string
            else {
                stack.push(prefix[i]);
            }

        // The final element in the stack will be the infix expression
        return stack.pop() || "";
    }
```

Python

```python
from typing import List

class Solution:

    # Function to check if a character is an operator
    def is_operator(self, ch: str) -> bool:
        return not ch.isalpha() and not ch.isdigit()

    def convert_prefix_to_infix(self, prefix: str) -> str:
        stack: List[str] = []
        length: int = len(prefix)

        for i in range(length - 1, -1, -1):

            # If the character is an operator, pop the top two
            # elements from the stack and construct the infix expression
            # by placing the operator in between the operands
            if self.is_operator(prefix[i]):

                # Pop the top element from the stack as the first
                # operand
                operand1 = stack.pop()

                # Pop the top element from the stack as the second
                # operand
                operand2 = stack.pop()

                # Construct the infix expression by placing the operator
                # in between the operands
                expr = "(" + operand1 + prefix[i] + operand2 + ")"
                stack.append(expr)

            # If the character is not an operator, push it to the
            # stack as a single-character string
            else:
                stack.append(prefix[i])

        # The final element in the stack will be the infix expression
        return stack.pop()
```

## Complexity Analysis

The algorithm's time and space complexity is easy to understand. We traverse the sequence from the start to the end once and do a series of push and pop operations. We push every digit once to the stack, and when finding an operator, we push a partial infix expression once to the stack. So, the total number of push operations is equal to the length of expression **N**. We also pop two items from the stack every time we encounter an operator, and since for an expression of length N, there cannot be more than **N/2** operators, the number of pop operations is N. All push and pop operations are constant **O(1),** leading to a total contribution of **O(N)**.

On encountering an operator, we concatenate two operands (strings) to create an infix expression. Since all concatenations effectively merge smaller infix expressions into the final result, every character is only concatenated once in the result string. ultimately lead to the find infix expression. Accounting for two parentheses for every operand to total single character concatenate operations are  **N + 2\*N/2 = 2N**. Considering adding a character at the end of the string is constant **O(1)**, the overall time complexity is linear **O(N)**.

We copy all operands to the stack as we traverse the string from right to left. As we combine operands to create infix expressions and store them on a stack, the size of each stack frame increases. However, concatenating all the strings from all the stack frames in the end results in the infix expression itself, and so the total size of all strings, including parentheses, is bounded by **O(N)**.

Hence the space complexity is also linear **O(N)** in any case.

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

# Convert prefix to infix

## Problem Statement

Given a string **prefix** representing the prefix notation of an expression, write a function to convert this expression to an **infix** notation.

> -   **Prefix expression:** The expression of the form **op a b**. When an operator is placed before every pair of operands.
> -   **Infix expression:** The expression of the form **a op b**. When an operator is in between every pair of operands.

### Example

> -   **Input:** prefix = \*-7/83-/526
> -   **Output:** ((7-(8/3))\*((5/2)-6))
> -   **Explanation:** Above is the infix notation of the given prefix notation.

## Solution

```cpp
#include <stack>

using namespace std;

class Solution {
public:

    // Function to check if a character is an operator
    bool isOperator(char ch) { return (!isalpha(ch) && !isdigit(ch)); }

    string convertPrefixToInfix(string prefix) {
        stack<string> stack;
        int length = prefix.size();

        for (int i = length - 1; i >= 0; i--) {

            // If the character is an operator, pop the top two
            // elements from the stack and construct the infix expression
            // by placing the operator in between the operands
            if (isOperator(prefix[i])) {

                // Pop the top element from the stack as the first
                // operand
                string operand1 = stack.top();
                stack.pop();

                // Pop the top element from the stack as the second
                // operand
                string operand2 = stack.top();
                stack.pop();

                // Construct the infix expression by placing the operator
                // in between the operands
                string expr =
                    "(" + operand1 + prefix[i] + operand2 + ")";
                stack.push(expr);
            }

            // If the character is not an operator, push it to the
            // stack as a single-character string
            else {
                stack.push(string(1, prefix[i]));
            }
        }

        // The final element in the stack will be the infix expression
        return stack.top();
    }
};
```

***

# Understanding infix to postfix conversion

Any expression written in the postfix notation can be easily parsed and evaluated by a computer as opposed to the infix notation. However, for us humans, writing postfix expressions is very difficult and error-prone as we are not used to it. However, we can convert an expression written in the infix notation to postfix using the infix to postfix conversion algorithm.

To keep things simple, consider the example of an infix notation without parentheses given below.

// Diagram: Convert the infix notation to postfix.

We use a stack and operator precedence rules to convert an infix notation to postfix. We will learn more about the proof of correctness of this technique later in this lesson.

To convert the expression to postfix, we create a stack `stack` to hold all operators seen so far in the increasing order of precedence. We also create an empty string `postfix` to hold the postfix notation. We then iterate in the infix string from start to end and, in each iteration, check if the current character is an operator or an operand. If it is an operand, we append it to the `postfix` string. Otherwise, we check the precedence value of the current operator.

If it is greater than the precedence of the operator at the top of the `stack` we push it to the top of the stack. Otherwise, we repeatedly pop items from the stack and append them to the `postfix` string until the precedence of the operator at the top of the `stack` becomes less than the current operator or the stack becomes empty and finally push the current operator to the stack.

At the end of the traversal, we repeatedly pop all operators from the `stack` and append them to the `postfix` string until the stack becomes empty. The `postfix` string will then have the postfix notation of the given string.

Convert the infix notation to postfix.

Now let's consider the generic case where the infix string may have opening and closing parentheses `()`. Consider the example below.

// Diagram: Convert the infix notation to postfix.

The only change now is that we also check for opening or closing parentheses as we traverse the infix notation string. If we find an opening parenthesis, we push it to the `stack` and exclude it from subsequent comparison with other operators. However, when we find closing parenthesis, we repeatedly pop all operands from the `stack` and append them to the `postfix` string until we find the corresponding opening parenthesis and finally pop it from the `stack`. We then continue the traversal of the infix string and follow the same steps as before.

Convert the infix notation to postfix.

The presence of parentheses essentially forces appending the conversion of subexpression between them to the `postfix` string instead of clubbing it with the remaining expression. This makes sure that the subexpression is evaluated independently when evaluating the converted postfix string and only its result is used as an operand in the remaining expression.

## Proof of correctness

Consider we have an expression with operands `A, B, C .. Z` and operators `op1, op2 .. opn` such that for any operator `opi` the precedence order is `opi-1 < opi < opi+1` for all `1 < i < n`.

Given below is an example expression written in both the infix and postfix notation and the order of evaluation. 

It is important to note that the order of operands is exactly the same in both infix and postfix expressions, and only the placement of operators changes such that both notations are evaluated in the same order. The infix notation is evaluated in the decreasing order of precedence of operators. In contrast, the postfix notation is evaluated from left to right, so the operator that comes first is evaluated first.

// Diagram: Infix and postfix notation for an example expression.

We will incrementally prove the correctness of the conversion algorithm, starting from a special case and then moving on to more general cases. In each step, we will see how the algorithm handles the corresponding case, and these cases cover all possible scenarios.

### Special case

Consider we have an expression in infix notation where all operators are arranged in the **increasing** order of their precedence from **left to right**.

// Diagram: An infix expression with operators arranged in the increasing order of precedence from left to right.

Evaluating by the precedence order of operators, this expression will be evaluated from right to left, starting from the last operator. 

// Diagram: The order of evaluation of an infix expression with operators is arranged in increasing order of precedence from left to right.

Since a postfix expression is evaluated **left to right** in the order of finding the operators, we can get an equivalent postfix notation by simply arranging all operators at the end of all operands in the **decreasing** order of precedence. This way, when we evaluate the postfix notation, we follow exactly the same evaluation order as the infix notation.

// Diagram: The equivalent postfix expression and its order of evaluation.

### General case

Now, consider we extend the infix expression to add an operator and operand in the end such that the operator has a precedence value between the values of existing operators.

// Diagram: Ann infix expression where the relative order of operators is random.

In this case, this new operation will be evaluated for the infix expression after all higher precedence operations have been evaluated but before the lower precedence operations.

// Diagram: The order of evaluation for the given infix expression.

And so, for this new operator, one operand will be the evaluated results of subexpression with higher precedence operators (say `X`), and the other operand will be from the still unevaluated subexpression.

// Diagram: Equivalent infix notation when treating the subexpression as an operand X.

To get an equivalent postfix expression, we can treat the postfix notation of the subexpression with all higher precedence operators as one big operand (`X`) and take the other operand from the unevaluated infix expression. We then use the same process of appending operators in decreasing order of precedence as before to convert the string to postfix notation.

// Diagram: Equivalent postfix expression when treating a subexpression as an operand X.

The idea behind the conversion is quite simple: we traverse the infix notation from left to right and copy the operands as is to the `postfix` string while maintaining a list of operators seen so far in the **increasing** order of their precedence. Whenever we see an operator with a precedence **lower** than the maximum in the list, we append all the operators with higher precedence to the `postfix` string in decreasing order.

The act of appending an operator to the `postfix` string effectively converts the previous segment in the infix string to postfix. Since we append all operators with higher precedence to the `postfix` string on hitting an operator with lower precedence, we guarantee that the subexpression containing the higher precedence operator is always evaluated first, and its results are used as operand for the lower precedence operators.

// Diagram: Appending operators to the postfix string results in the conversion of some subexpression to postfix.

### Converting parantheses

Now, let's consider the final and most generic cases where we also have parentheses in the infix notation. Parentheses in the infix notation dictate the precedence of an entire subexpression over the rest. Consider the example of the same infix notation, but this time with parentheses.

// Diagram: Ann infix expression with parentheses.

In this case, the order of evaluation is dictated by the innermost parentheses and so we first evaluate results for the parentheses and then use the evaluated result as an operand for evaluating the remaining expression.

// Diagram: The order of evaluation of an infix expression with parentheses.

To get an equivalent postfix notation, we treat the entire subexpression within a parenthesis as an operand. It doesn't matter if it the subexpression includes operators with lower precedence relative to the remaining expression.

// Diagram: Equivalent postfix expression when treating the subexpression within parentheses as an operand X.

To account for that, we keep track of the opening and closing parentheses in our algorithm. When we see an opening parenthesis, we add it to the list of operators and continue with the same logic as before. When hitting the corresponding closing parentheses, we append all operands in the list until the opening parentheses to the postfix string. Appending the operators ensures that the subexpression between the parentheses is entirely converted to postfix and can be treated as an operand for subsequent iterations.

// Diagram: a closing parenthesis to ensure the correct segment is converted first

As we can see from the explanations above, converting infix notation to postfix only requires maintaining a list of operators in increasing order of precedence and appending them to the result string at the right time. Since we only add values higher than the current maximum to the list and extract values in decreasing order of value, we always add and extract value from one end of the list, so we can use a stack to maintain a sorted order of operators.

// Diagram: We can use a stack to store values in increasing order if we only need to remove values in decreasing order.

## Algorithm

The algorithm given below outlines the conversion of an expression in infix notation to postfix using a stack.

> **Algorithm**
>
> -   **Step 1:** Create a stack \`stack\` to keep track of operators in increasing order of precedence and a string \`postfix\` to hold the converted string
> -   **Step 2:** Iterate in the string from start to end, and in each iteration, do the following:
>     -   **Step 2.1:** If the current item is an operand, append it to the \`postfix\` string
>     -   **Step 2.2:** Otherwise, if it is an opening parenthesis, push it to the top of the \`stack\`
>     -   **Step 2.3:** Otherwise, if it is a closing parenthesis, do the following:
>         -   **Step 2.3.1:** Pop all operators from the \`stack\` until we find an opening parenthesis and append them to the \`postfix\` string.
>         -   **Step 2.3.2:** Pop the opening parenthesis from the \`stack\`
>     -   **Step 2.4:** Otherwise, if it is an operator, do the following:
>         -   **Step 2.4.1:** Pop operators from the \`stack\` and append them to the \`postfix\` string until the precedence of the operator and the top becomes less than the current operator or \`stack\` becomes empty.
>         -   **Step 2.4.2:** Push the current operator to the \`stack\`.
>     -   **Step 2.5:** Pop all opeators from the \`stack\` and append them to the \`postfix\` string until \`stack\` becomes empty.
> -   **Step 3:** Return the \`postfix\` string

## Implementation

The implementation of converting an expression in infix notation to postfix notation using a stack is given below.

C++

```cpp
#include <climits>
#include <stack>

// Diagram: using namespace std;

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

// Diagram: string convertInfixToPostfix(string infix) {

        // Stack to hold operators and parentheses
        stack<char> stack;

        // Final postfix expression
        string postfix;

// Diagram: for (char ch : infix) {

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

        // Pop any remaining operators from the stack and add them to the
        // postfix string
        while (!stack.empty()) {
            postfix += stack.top();
            stack.pop();
        }

        return postfix;
    }
};
```

Java

```java
import java.util.*;

// Diagram: class Solution {

    // Function to check if the character is an operator
    public boolean isOperator(char ch) {
        return (!Character.isLetter(ch) && !Character.isDigit(ch));
    }

    // Function to get the priority of operators
    public int getPrecedence(char operator) {

        // Assign precedence values to different operators
        if (operator == '^') {
            return 3;
        } else if (operator == '*' || operator == '/') {
            return 2;
        } else if (operator == '+' || operator == '-') {
            return 1;
        }

        // Default value for unknown operators
        return -1;
    }

// Diagram: public String convertInfixToPostfix(String infix) {

        // Stack to hold operators and parentheses
        Stack<Character> stack = new Stack<>();

        // Final postfix expression
        StringBuilder postfix = new StringBuilder();

// Diagram: for (char ch : infix.toCharArray()) {

            // If the character is not an operator or parentheses,
            // add it to the postfix string
            if (!isOperator(ch) && ch != '(' && ch != ')') {
                postfix.append(ch);
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
                while (!stack.empty() && stack.peek() != '(') {
                    postfix.append(stack.peek());
                    stack.pop();
                }

                // Remove the opening parentheses from the stack
                if (!stack.empty() && stack.peek() == '(') {
                    stack.pop();
                }

            // If the character is an operator, compare its
            // precedence with the top of the stack and add higher or
            // equal precedence operators to the postfix string
            else {
                while (
                    !stack.empty() &&
                    getPrecedence(ch) <= getPrecedence(stack.peek())
                ) {
                    if (stack.peek() != '(') {
                        postfix.append(stack.peek());
                    }
                    stack.pop();
                }

                // Push the current operator onto the stack
                stack.push(ch);
            }

        // Pop any remaining operators from the stack and add them to the
        // postfix string
        while (!stack.empty()) {
            postfix.append(stack.peek());
            stack.pop();
        }

        return postfix.toString();
    }
```

Typescript

```typescript
export class Solution {

    // Function to check if the character is an operator
    isOperator(ch: string): boolean {
        return !ch.match(/[a-zA-Z]/) && !ch.match(/[0-9]/);
    }

    // Function to get the priority of operators
    getPrecedence(operator: string): number {

        // Assign precedence values to different operators
        if (operator === "^") {
            return 3;
        } else if (operator === "*" || operator === "/") {
            return 2;
        } else if (operator === "+" || operator === "-") {
            return 1;
        }

        // Default value for unknown operators
        return -1;
    }

// Diagram: convertInfixToPostfix(infix: string): string {

        // Stack to hold operators and parentheses
        const stack: string[] = [];

        // Final postfix expression
        let postfix: string = "";

// Diagram: for (const ch of infix) {

            // If the character is not an operator or parentheses,
            // add it to the postfix string
            if (!this.isOperator(ch) && ch !== "(" && ch !== ")") {
                postfix += ch;
            }

            // If the character is an opening parentheses, push it
            // onto the stack
            else if (ch === "(") {
                stack.push(ch);
            }

            // If the character is a closing parentheses, pop
            // operators from the stack and add them to the postfix
            // string until an opening parentheses is encountered
            else if (ch === ")") {
                while (
                    stack.length > 0 &&
                    stack[stack.length - 1] !== "("
                ) {
                    postfix += stack.pop()!;
                }

                // Remove the opening parentheses from the stack
                if (
                    stack.length > 0 &&
                    stack[stack.length - 1] === "("
                ) {
                    stack.pop();
                }

            // If the character is an operator, compare its
            // precedence with the top of the stack and add higher or
            // equal precedence operators to the postfix string
            else {
                while (
                    stack.length > 0 &&
                    this.getPrecedence(ch) <=
                        this.getPrecedence(stack[stack.length - 1])
                ) {
                    if (stack[stack.length - 1] !== "(") {
                        postfix += stack.pop()!;
                    }

                // Push the current operator onto the stack
                stack.push(ch);
            }

        // Pop any remaining operators from the stack and add them to the
        // postfix string
        while (stack.length > 0) {
            postfix += stack.pop()!;
        }

        return postfix;
    }
```

Javascript

```javascript
export class Solution {

    // Function to check if the character is an operator
    isOperator(ch) {
        return !ch.match(/[a-zA-Z]/) && !ch.match(/[0-9]/);
    }

    // Function to get the priority of operators
    getPrecedence(operator) {

        // Assign precedence values to different operators
        if (operator === "^") {
            return 3;
        } else if (operator === "*" || operator === "/") {
            return 2;
        } else if (operator === "+" || operator === "-") {
            return 1;
        }

        // Default value for unknown operators
        return -1;
    }

// Diagram: convertInfixToPostfix(infix) {

        // Stack to hold operators and parentheses
        const stack = [];

        // Final postfix expression
        let postfix = "";

// Diagram: for (const ch of infix) {

            // If the character is not an operator or parentheses,
            // add it to the postfix string
            if (!this.isOperator(ch) && ch !== "(" && ch !== ")") {
                postfix += ch;
            }

            // If the character is an opening parentheses, push it
            // onto the stack
            else if (ch === "(") {
                stack.push(ch);
            }

            // If the character is a closing parentheses, pop
            // operators from the stack and add them to the postfix
            // string until an opening parentheses is encountered
            else if (ch === ")") {
                while (
                    stack.length > 0 &&
                    stack[stack.length - 1] !== "("
                ) {
                    postfix += stack.pop();
                }

                // Remove the opening parentheses from the stack
                if (
                    stack.length > 0 &&
                    stack[stack.length - 1] === "("
                ) {
                    stack.pop();
                }

            // If the character is an operator, compare its
            // precedence with the top of the stack and add higher or
            // equal precedence operators to the postfix string
            else {
                while (
                    stack.length > 0 &&
                    this.getPrecedence(ch) <=
                        this.getPrecedence(stack[stack.length - 1])
                ) {
                    if (stack[stack.length - 1] !== "(") {
                        postfix += stack.pop();
                    }

                // Push the current operator onto the stack
                stack.push(ch);
            }

        // Pop any remaining operators from the stack and add them to the
        // postfix string
        while (stack.length > 0) {
            postfix += stack.pop();
        }

        return postfix;
    }
```

Python

```python
from typing import List

class Solution:

    # Function to check if the character is an operator
    def is_operator(self, ch: str) -> bool:
        return not ch.isalpha() and not ch.isdigit()

    # Function to get the priority of operators
    def get_precedence(self, operator: str) -> int:

        # Assign precedence values to different operators
        if operator == "^":
            return 3
        elif operator in ["*", "/"]:
            return 2
        elif operator in ["+", "-"]:
            return 1

        # Default value for unknown operators
        return -1

    def convert_infix_to_postfix(self, infix: str) -> str:

        # Stack to hold operators and parentheses
        stack: List[str] = []

        # Final postfix expression
        postfix: str = ""

        for ch in infix:

            # If the character is not an operator or parentheses, add
            # it to the postfix string
            if not self.is_operator(ch) and ch != "(" and ch != ")":
                postfix += ch

            # If the character is an opening parentheses, push it
            # onto the stack
            elif ch == "(":
                stack.append(ch)

            # If the character is a closing parentheses, pop operators from the stack
            # and add them to the postfix string until an opening
            # parentheses is encountered
            elif ch == ")":
                while stack and stack[-1] != "(":
                    postfix += stack.pop()

                # Remove the opening parentheses from the stack
                if stack and stack[-1] == "(":
                    stack.pop()

            # If the character is an operator, compare its precedence with the top of the stack
            # and add higher or equal precedence operators to the
            # postfix string
            else:
                while stack and self.get_precedence(
                    ch
                ) <= self.get_precedence(stack[-1]):
                    if stack[-1] != "(":
                        postfix += stack.pop()

                # Push the current operator onto the stack
                stack.append(ch)

        # Pop any remaining operators from the stack and add them to the
        # postfix string
        while stack:
            postfix += stack.pop()

        return postfix
```

## Complexity Analysis

The algorithm's time and space complexity is easy to understand. We traverse the sequence from the start to the end once and do a series of push and pop operations. An infix expression with **X** operands cannot have more than **X/2** operators, and every operator can have only one set of opening and closing parentheses, meaning a maximum of **2\*X/2 = X** parentheses characters. This would mean the maximum size of the infix string **N = 2\*X + X/2 + X/2 = 3\*X**

Every operator is pushed and popped exactly once to and from the stack, totaling to **2\*X/2 = X = N/3** operations. We also append all characters except parentheses in the infix string to the postfix string, which would total **X/2 + X/2 = N/3** in the worst case. Since push and pop to and from the stack and appending to the end of a string are constant time operations, the overall time complexity, in any case, is linear **O(N/3 + N/3) ~ O(N)**.

We copy all operators to the stack as we traverse the string and copy every character except parentheses to the postfix string. Since only the operators and operands are copied over to the postfix string, the maximum size of the postfix string would be **X/2 + X/2 = X = N/3**, leading to a linear **O(N/3) ~ O(N)** space complexity in any case.

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

# Convert infix to postfix

## Problem Statement

Given a string **infix** representing the infix notation of an expression, write a function to convert this expression to a **postfix** notation.

> -   **Infix expression:** The expression of the form **a op b**. When an operator is in between every pair of operands.
> -   **Postfix expression:** The expression of the form **a b op**. When an operator is followed for every pair of operands.

### Example

> -   **Input:** infix = 5+6\*(4^7-9)^(3+2\*6)-2
> -   **Output:** 5647^9-326\*+^\*+2-
> -   **Explanation:** Above is the postfix notation of the given infix notation.

## Solution

```cpp
#include <climits>
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
};
```

***

# Understanding infix to prefix conversion

Any expression written in the prefix notation can be easily parsed and evaluated by a computer as opposed to the infix notation. However, for us humans, writing prefix expressions is very difficult and error-prone as we are not used to it. However, we can convert an expression written in the infix notation to a prefix using the infix-to-prefix conversion algorithm.

To keep things simple, consider the example of an infix notation without parentheses given below.

// Diagram: Convert the infix notation to prefix.

We use a stack and operator precedence rules to convert an infix notation to prefix. We will learn more about the proof of correctness of this technique later in this lesson.

To convert the expression to prefix, we create a stack `stack` to hold all operators seen so far in the increasing order of precedence. We also create an empty string `prefix` to hold the prefix notation. We then iterate in the infix string in reverse, i.e., from end to start, and, in each iteration, check if the current character is an operator or an operand. If it is an operand, we append it to the `prefix` string. Otherwise, we check the precedence value of the current operator.

If it is greater than the precedence of the operator at the top of the `stack` we push it to the top of the stack. Otherwise, we repeatedly pop items from the stack and append them to the `prefix` string until the precedence of the operator at the top of the `stack` becomes less than the current operator or the stack becomes empty and finally push the current operator to the stack. At the end of the traversal, we repeatedly pop all operators from the `stack` and append them to the `prefix` string until the stack becomes empty.

At the end of all iterations the`prefix` string will have the prefix notation in **reverse**, and so will reverse it to get the correct prefix notation.

Note that ideally we should be **prepending** characters to the prefix string instead of **appending** them as we are moving from right to left in the infix string. However, since in most programming languages, appending to the end of a string is a constant time operation while preceding is not, we chose to append, which will create a prefix string in **reverse**.

The example below illustrates the algorithm and how the actual string we get is the reverse of the correct order.

// Diagram: Convert the infix notation to prefix

Now let's consider the generic case where the infix string may have opening and closing parentheses `()`. Consider the example below.

// Diagram: Convert the infix notation to prefix.

The only change now is that we also check for opening or closing parentheses as we traverse the infix notation string. If we find a closing parenthesis, we push it to the `stack` and exclude it from subsequent comparison with other operators. However, when we find an opening parenthesis, we repeatedly pop all operands from the `stack` and append them to the `prefix` string until we find the corresponding closing parentheses and finally pop it from the `stack`. We then continue the traversal of the infix string and follow the same steps as before.

// Diagram: Convert the infix notation to prefix

The presence of parentheses essentially forces appending the conversion of subexpression between them to the `prefix` string instead of clubbing it with the remaining expression. This makes sure that the subexpression is evaluated independently when evaluating the converted prefix string and only its result is used as an operand in the remaining expression.

## Proof of correctness

Consider we have an expression with operands `A, B, C .. Z` and operators `op1, op2 .. opn` such that for any operator `opi` the precedence order is `opi-1 < opi < opi+1` for all `1 < i < n`.

Given below is an example expression written in both the infix and prefix notation and the order of evaluation. 

It is important to note that the order of operands is exactly the same in both infix and prefix expressions, and only the placement of operators changes such that both notations are evaluated in the same order. The infix notation is evaluated in the decreasing order of precedence of operators. In contrast, the prefix notation is evaluated from right to left, so the operator that comes first from right is evaluated first.

// Diagram: Infix and prefix notation for an example expression.

We will incrementally prove the correctness of the conversion algorithm, starting from a special case and then moving on to more general cases. In each step, we will see how the algorithm handles the corresponding case, and these cases cover all possible scenarios.

### Special case

Consider we have an expression in infix notation where all operators are arranged in the **increasing** order of their precedence from **right to left**.

// Diagram: An infix expression with operators arranged in the increasing order of precedence from right to left.

Evaluating by the precedence order of operators, this expression will be evaluated from left to right, starting from the first operator. 

// Diagram: The order of evaluation of an infix expression with operators is arranged in increasing order of precedence from right to left.

Since a prefix expression is evaluated from **right to left** in the order of finding the operators, we can get an equivalent prefix notation by simply arranging all operators at the beginning of all operands in the **decreasing** order of precedence from right to left. This way, when we evaluate the prefix notation, we follow exactly the same evaluation order as the infix notation.

// Diagram: The equivalent prefix expression and its order of evaluation.

### General case

Now, consider we extend the infix expression to add an operator and operand in the beginning such that the operator has a precedence value in between the values of existing operators.

// Diagram: Ann infix expression where the relative order of operators is random.

In this case, this new operation will be evaluated for the infix expression after all higher precedence operations have been evaluated but before the lower precedence operations.

// Diagram: The order of evaluation for the given infix expression.

And so, for this new operator, one operand will be the evaluated results of subexpression with higher precedence operators (say `X`), and the other operand will be from the still unevaluated subexpression.

// Diagram: Equivalent infix notation when treating the subexpression as an operand X.

To get an equivalent prefix expression, we can treat the prefix notation of the subexpression with all higher precedence operators as one big operand (`X`) and take the other operand from the unevaluated infix expression. We then use the same process of appending operators in decreasing order of precedence from right to left as before to convert the string to prefix notation.

// Diagram: Equivalent prefix expression when treating a subexpression as an operand X.

The idea behind the conversion is quite simple: we traverse the infix notation from right to left copy the operands as is to the `prefix` string while maintaining a list of operators seen so far in the **increasing** order of their precedence. Whenever we see an operator with a precedence **lower** than the maximum in the list, we append all the operators with higher precedence to the `prefix` string in decreasing order.

The act of appending an operator to the `prefix` string effectively converts the previous segment in the infix string to prefix. Since we append all operators with higher precedence to the `prefix` string on hitting an operator with lower precedence, we guarantee that the subexpression containing the higher precedence operator is always evaluated first, and its results are used as operands for the lower precedence operators.

// Diagram: Appending operators to the prefix string results in the conversion of some subexpression to prefix.

### Converting parantheses

Now, let's consider the final and most generic cases where we also have parentheses in the infix notation. Parentheses in the infix notation dictate the precedence of an entire subexpression over the rest. Consider the example of the same infix notation, but this time with parentheses.

// Diagram: Ann infix expression with parentheses.

In this case, the order of evaluation is dictated by the innermost parentheses and so we first evaluate results for the parentheses and then use the evaluated result as an operand for evaluating the remaining expression.

// Diagram: The order of evaluation of an infix expression with parentheses.

To get an equivalent prefix notation, we treat the entire subexpression within a parenthesis as an operand. It doesn't matter if it the subexpression includes operators with lower precedence relative to the remaining expression.

// Diagram: Equivalent prefix expression when treating the subexpression within parentheses as an operand X.

To account for that, we keep track of the opening and closing parentheses in our algorithm. While traversing from right to left in the infix string, when we see a closing parenthesis, we add it to the list of operators and continue with the same logic as before. When hitting the corresponding opening parentheses, we append all operands in the list until the opening parentheses to the prefix string. Appending the operators ensures that the subexpression between the parentheses is entirely converted to prefix and can be treated as an operand for subsequent iterations.

// Diagram: an opening parenthesis to ensure the correct segment is converted first

As we can see from the explanations above, converting infix notation to prefix only requires maintaining a list of operators in increasing order of precedence and appending them to the result string at the right time. Since we only add values higher than the current maximum to the list and extract values in decreasing order of value, we always add and extract value from one end of the list, so we can use a stack to maintain a sorted order of operators.

// Diagram: We can use a stack to store values in increasing order if we only need to remove values in decreasing order.

## Algorithm

The algorithm given below outlines the conversion of an expression in infix notation to prefix using a stack.

> **Algorithm**
>
> -   **Step 1:** Create a stack \`stack\` to keep track of operators in increasing order of precedence and a string \`prefix\` to hold the converted string
> -   **Step 2:** Iterate in the string from end to start, and in each iteration, do the following:
>     -   **Step 2.1:** If the current item is an operand, append it to the \`prefix\` string
>     -   **Step 2.2:** Otherwise, if it is a closing parenthesis, push it to the top of the \`stack\`
>     -   **Step 2.3:** Otherwise, if it is an opening parenthesis, do the following:
>         -   **Step 2.3.1:** Pop all operators from the \`stack\` until we find a closing parenthesis and append them to the \`prefix\` string.
>         -   **Step 2.3.2:** Pop the closing parenthesis from the \`stack\`
>     -   **Step 2.4:** Otherwise, if it is an operator, do the following:
>         -   **Step 2.4.1:** Pop operators from the \`stack\` and append them to the \`prefix\` string until the precedence of the operator and the top becomes less than the current operator or \`stack\` becomes empty.
>         -   **Step 2.4.2:** Push the current operator to the \`stack\`.
>     -   **Step 2.5:** Pop all opeators from the \`stack\` and append them to the \`prefix\` string until \`stack\` becomes empty.
> -   **Step 3:** Reverse the \`prefix\` string
> -   **Step 4:** Return the \`prefix\` string

## Implementation

The implementation of converting an expression in infix notation to prefix notation using a stack is given below.

C++

```cpp
#include <climits>
#include <stack>

// Diagram: using namespace std;

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

// Diagram: string convertInfixToPrefix(string infix) {

        // Stack to hold operators and parentheses
        stack<char> stack;

        // Final prefix expression
        string prefix;
        string reversedInfix = infix;

        // Reverse the infix string for easier processing
        reverse(reversedInfix.begin(), reversedInfix.end());

// Diagram: for (char ch : reversedInfix) {

            // If the character is not an operator or parentheses,
            // add it to the prefix string
            if (!isOperator(ch) && ch != ')' && ch != '(') {
                prefix += ch;
            }

            // If the character is a closing parentheses, push it
            // onto the stack
            else if (ch == ')') {
                stack.push(ch);
            }

            // If the character is an opening parentheses, pop
            // operators from the stack and add them to the prefix
            // string until a closing parentheses is encountered
            else if (ch == '(') {
                while (!stack.empty() && stack.top() != ')') {
                    prefix += stack.top();
                    stack.pop();
                }

                // Remove the closing parentheses from the stack
                if (!stack.empty() && stack.top() == ')') {
                    stack.pop();
                }

            // If the character is an operator, compare its
            // precedence with the top of the stack and add higher
            // precedence operators to the prefix string
            else {

                while (!stack.empty() &&
                       getPrecedence(ch) < getPrecedence(stack.top()) &&
                       stack.top() != ')') {
                    prefix += stack.top();
                    stack.pop();
                }

                // Push the current operator onto the stack
                stack.push(ch);
            }

        // Pop any remaining operators from the stack and add them to the
        // prefix string
        while (!stack.empty()) {
            prefix += stack.top();
            stack.pop();
        }

        // Reverse the prefix string to get the final result
        reverse(prefix.begin(), prefix.end());
        return prefix;
    }
};
```

Java

```java
import java.util.*;

// Diagram: class Solution {

    // Function to check if the character is an operator
    public boolean isOperator(char ch) {
        return (!Character.isLetter(ch) && !Character.isDigit(ch));
    }

    // Function to get the priority of operators
    public int getPrecedence(char operator) {

        // Assign precedence values to different operators
        if (operator == '^') {
            return 3;
        } else if (operator == '*' || operator == '/') {
            return 2;
        } else if (operator == '+' || operator == '-') {
            return 1;
        }

        // Default value for unknown operators
        return -1;
    }

// Diagram: public String convertInfixToPrefix(String infix) {

        // Stack to hold operators and parentheses
        Stack<Character> stack = new Stack<>();

        // Final prefix expression
        StringBuilder prefix = new StringBuilder();
        String reversedInfix = new StringBuilder(infix)
            .reverse()
            .toString();

// Diagram: // Reverse the infix string for easier processing

// Diagram: for (char ch : reversedInfix.toCharArray()) {

            // If the character is not an operator or parentheses,
            // add it to the prefix string
            if (!isOperator(ch) && ch != ')' && ch != '(') {
                prefix.append(ch);
            }

            // If the character is a closing parentheses, push it
            // onto the stack
            else if (ch == ')') {
                stack.push(ch);
            }

            // If the character is an opening parentheses, pop
            // operators from the stack and add them to the prefix
            // string until a closing parentheses is encountered
            else if (ch == '(') {
                while (!stack.empty() && stack.peek() != ')') {
                    prefix.append(stack.peek());
                    stack.pop();
                }

                // Remove the closing parentheses from the stack
                if (!stack.empty() && stack.peek() == ')') {
                    stack.pop();
                }

            // If the character is an operator, compare its
            // precedence with the top of the stack and add higher
            // precedence operators to the prefix string
            else {
                while (
                    !stack.empty() &&
                    getPrecedence(ch) < getPrecedence(stack.peek()) &&
                    stack.peek() != ')'
                ) {
                    prefix.append(stack.peek());
                    stack.pop();
                }

                // Push the current operator onto the stack
                stack.push(ch);
            }

        // Pop any remaining operators from the stack and add them to the
        // prefix string
        while (!stack.empty()) {
            prefix.append(stack.peek());
            stack.pop();
        }

        // Reverse the prefix string to get the final result
        return prefix.reverse().toString();
    }
```

Typescript

```typescript
export class Solution {

    // Function to check if the character is an operator
    isOperator(ch: string): boolean {
        return !ch.match(/[a-zA-Z]/) && !ch.match(/[0-9]/);
    }

    // Function to get the priority of operators
    getPrecedence(operator: string): number {

        // Assign precedence values to different operators
        if (operator === "^") {
            return 3;
        } else if (operator === "*" || operator === "/") {
            return 2;
        } else if (operator === "+" || operator === "-") {
            return 1;
        }

        // Default value for unknown operators
        return -1;
    }

// Diagram: convertInfixToPrefix(infix: string): string {

        // Stack to hold operators and parentheses
        const stack: string[] = [];

        // Final prefix expression
        let prefix = "";

        // Reverse the infix string for easier processing
        const reversedInfix = infix.split("").reverse().join("");

// Diagram: for (const ch of reversedInfix) {

            // If the character is not an operator or parentheses,
            // add it to the prefix string
            if (!this.isOperator(ch) && ch !== ")" && ch !== "(") {
                prefix += ch;
            }

            // If the character is a closing parentheses, push it
            // onto the stack
            else if (ch === ")") {
                stack.push(ch);
            }

            // If the character is an opening parentheses, pop
            // operators from the stack and add them to the prefix
            // string until a closing parentheses is encountered
            else if (ch === "(") {
                while (stack.length && stack[stack.length - 1] !== ")") {
                    prefix += stack.pop()!;
                }

                // Remove the closing parentheses from the stack
                if (
                    stack.length > 0 &&
                    stack[stack.length - 1] === ")"
                ) {
                    stack.pop();
                }

            // If the character is an operator, compare its
            // precedence with the top of the stack and add higher
            // precedence operators to the prefix string
            else {
                while (
                    stack.length &&
                    this.getPrecedence(ch) <
                        this.getPrecedence(stack[stack.length - 1]) &&
                    stack[stack.length - 1] !== ")"
                ) {
                    prefix += stack.pop()!;
                }

                // Push the current operator onto the stack
                stack.push(ch);
            }

        // Pop any remaining operators from the stack and add them to the
        // prefix string
        while (stack.length) {
            prefix += stack.pop()!;
        }

        // Reverse the prefix string to get the final result
        return prefix.split("").reverse().join("");
    }
```

Javascript

```javascript
export class Solution {

    // Function to check if the character is an operator
    isOperator(ch) {
        return !ch.match(/[a-zA-Z]/) && !ch.match(/[0-9]/);
    }

    // Function to get the priority of operators
    getPrecedence(operator) {

        // Assign precedence values to different operators
        if (operator === "^") {
            return 3;
        } else if (operator === "*" || operator === "/") {
            return 2;
        } else if (operator === "+" || operator === "-") {
            return 1;
        }

        // Default value for unknown operators
        return -1;
    }

// Diagram: convertInfixToPrefix(infix) {

        // Stack to hold operators and parentheses
        const stack = [];

        // Final prefix expression
        let prefix = "";

        // Reverse the infix string for easier processing
        const reversedInfix = infix.split("").reverse().join("");

// Diagram: for (const ch of reversedInfix) {

            // If the character is not an operator or parentheses,
            // add it to the prefix string
            if (!this.isOperator(ch) && ch !== ")" && ch !== "(") {
                prefix += ch;
            }

            // If the character is a closing parentheses, push it
            // onto the stack
            else if (ch === ")") {
                stack.push(ch);
            }

            // If the character is an opening parentheses, pop
            // operators from the stack and add them to the prefix
            // string until a closing parentheses is encountered
            else if (ch === "(") {
                while (stack.length && stack[stack.length - 1] !== ")") {
                    prefix += stack.pop();
                }

                // Remove the closing parentheses from the stack
                if (
                    stack.length > 0 &&
                    stack[stack.length - 1] === ")"
                ) {
                    stack.pop();
                }

            // If the character is an operator, compare its
            // precedence with the top of the stack and add higher
            // precedence operators to the prefix string
            else {
                while (
                    stack.length &&
                    this.getPrecedence(ch) <
                        this.getPrecedence(stack[stack.length - 1]) &&
                    stack[stack.length - 1] !== ")"
                ) {
                    prefix += stack.pop();
                }

                // Push the current operator onto the stack
                stack.push(ch);
            }

        // Pop any remaining operators from the stack and add them to the
        // prefix string
        while (stack.length) {
            prefix += stack.pop();
        }

        // Reverse the prefix string to get the final result
        return prefix.split("").reverse().join("");
    }
```

Python

```python
from typing import List

class Solution:

    # Function to check if the character is an operator
    def is_operator(self, ch: str) -> bool:
        return not ch.isalpha() and not ch.isdigit()

    # Function to get the priority of operators
    def get_precedence(self, operator: str) -> int:

        # Assign precedence values to different operators
        if operator == "^":
            return 3
        elif operator in ["*", "/"]:
            return 2
        elif operator in ["+", "-"]:
            return 1

        # Default value for unknown operators
        return -1

    def convert_infix_to_prefix(self, infix: str) -> str:

        # Stack to hold operators and parentheses
        stack: List[str] = []

        # Final prefix expression
        prefix: str = ""

        # Reverse the infix string for easier processing
        reversed_infix: str = infix[::-1]

        for ch in reversed_infix:

            # If the character is not an operator or parentheses, add
            # it to the prefix string
            if not self.is_operator(ch) and ch != ")" and ch != "(":
                prefix += ch

            # If the character is a closing parentheses, push it onto
            # the stack
            elif ch == ")":
                stack.append(ch)

            # If the character is an opening parentheses, pop operators from the stack
            # and add them to the prefix string until a closing
            # parentheses is encountered
            elif ch == "(":
                while stack and stack[-1] != ")":
                    prefix += stack.pop()

                # Remove the closing parentheses from the stack
                if stack and stack[-1] == ")":
                    stack.pop()

            # If the character is an operator, compare its precedence with the top of the stack
            # and add higher precedence operators to the prefix
            # string
            else:
                while (
                    stack
                    and self.get_precedence(ch)
                    < self.get_precedence(stack[-1])
                    and stack[-1] != ")"
                ):
                    prefix += stack.pop()

                # Push the current operator onto the stack
                stack.append(ch)

        # Pop any remaining operators from the stack and add them to the
        # prefix string
        while stack:
            prefix += stack.pop()

        # Reverse the prefix string to get the final result
        return prefix[::-1]
```

## Complexity Analysis

The algorithm's time and space complexity is easy to understand. We traverse the sequence from the end to start once and do a series of push and pop operations. An infix expression with **X** operands cannot have more than **X/2** operators, and every operator can have only one set of opening and closing parentheses, meaning a maximum of **2\*X/2 = X** parentheses characters. This would mean the maximum size of the infix string **N = 2\*X + X/2 + X/2 = 3\*X**

Every operator is pushed and popped exactly once to and from the stack, totaling to **2\*X/2 = X = N/3** operations. We also append all characters except parentheses in the infix string to the prefix string, which would total **X/2 + X/2 = N/3** in the worst case. Since push and pop to and from the stack and appending to the end of a string are constant time operations, the overall time complexity, in any case, is linear **O(N/3 + N/3) ~ O(N)**.

We copy all operators to the stack as we traverse the string and copy every character except parentheses to the prefix string. Since only the operators and operands are copied over to the prefix string, the maximum size of the prefix string would be **X/2 + X/2 = X = N/3**, leading to a linear **O(N/3) ~ O(N)** space complexity in any case.

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

# Convert infix to prefix

## Problem Statement

Given a string **infix** representing the infix notation of an expression, write a function to convert this expression to a **prefix** notation.

> -   **Infix expression:** The expression of the form **a op b**. When an operator is in between every pair of operands.
> -   **Prefix expression:** The expression of the form **op a b**. When an operator is placed before every pair of operands.

### Example

> -   **Input:** infix = (7-8/3)\*(5/2-6)
> -   **Output:** \*-7/83-/526
> -   **Explanation:** Above is the prefix notation of the given infix notation.

## Solution

```cpp
#include <climits>
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

    string convertInfixToPrefix(string infix) {

        // Stack to hold operators and parentheses
        stack<char> stack;

        // Final prefix expression
        string prefix;
        string reversedInfix = infix;

        // Reverse the infix string for easier processing
        reverse(reversedInfix.begin(), reversedInfix.end());

        for (char ch : reversedInfix) {

            // If the character is not an operator or parentheses,
            // add it to the prefix string
            if (!isOperator(ch) && ch != ')' && ch != '(') {
                prefix += ch;
            }

            // If the character is a closing parentheses, push it
            // onto the stack
            else if (ch == ')') {
                stack.push(ch);
            }

            // If the character is an opening parentheses, pop
            // operators from the stack and add them to the prefix
            // string until a closing parentheses is encountered
            else if (ch == '(') {
                while (!stack.empty() && stack.top() != ')') {
                    prefix += stack.top();
                    stack.pop();
                }

                // Remove the closing parentheses from the stack
                if (!stack.empty() && stack.top() == ')') {
                    stack.pop();
                }
            }

            // If the character is an operator, compare its
            // precedence with the top of the stack and add higher
            // precedence operators to the prefix string
            else {

                while (!stack.empty() &&
                       getPrecedence(ch) < getPrecedence(stack.top()) &&
                       stack.top() != ')') {
                    prefix += stack.top();
                    stack.pop();
                }

                // Push the current operator onto the stack
                stack.push(ch);
            }
        }

        // Pop any remaining operators from the stack and add them to the
        // prefix string
        while (!stack.empty()) {
            prefix += stack.top();
            stack.pop();
        }

        // Reverse the prefix string to get the final result
        reverse(prefix.begin(), prefix.end());
        return prefix;
    }
};
```
