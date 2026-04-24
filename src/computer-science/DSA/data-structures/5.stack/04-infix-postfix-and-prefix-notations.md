# 4. Infix, Postfix and Prefix notations

## Table of contents

1. [Understanding the infix notation](#understanding-the-infix-notation)
2. [Understanding the postfix notation](#understanding-the-postfix-notation)
3. [Understanding the prefix notation](#understanding-the-prefix-notation)

***

# Understanding the infix notation

Computers were originally invented to speed up mathematical calculations that would take humans ages. Mathematical grammar has evolved over a period of time, and just like any programming language, it follows a well-defined syntax. The style of writing mathematical expression we humans are used to is called the **infix notation**. It is characterized by the placement of operation **between** its operands.

// Diagram: The infix notation places the operator between the operands.

Consider the following examples of mathematical expressions written in the infix notation.

// Diagram: Some examples of infix notation.

The infix notation seems very intuitive and easy to understand for us humans; however, parsing evaluation and expression written in this notation is quite a challenge for computer systems.

## Challenges with the infix notation

Let's consider how a computer evaluates a mathematical expression to understand the problem better. Most CPUs at the root level only do one mathematical operation, such as addition, subtraction, etc., at a time. Since all these are binary operations, they only take two input values at a time.

Consider the example of a mathematical expression where we must add two numbers. A CPU takes these two numbers as its input, performs the addition, and generates the result.

// Diagram: A CPU adds two numbers in a single operation.

Let's consider a mathematical expression where we must add multiple numbers. When there are multiple operands, the CPU, just like humans, performs the calculations in multiple steps. It takes the first two operands, performs the operation, and stores the result in a temporary store. The next step uses the previously stored result as one operand and the next operand from the expression to perform the next operation. This process is repeated until all the the entire expression is evaluated.

Consider the example of a mathematical expression where we must add five numbers.

// Diagram: Evaluating an expression with only one type of operand

To evaluate expressions that only have one type of operation (addition in the above example), we follow the associativity rule of the operation (left to right in the above example) and accumulate results. However, most mathematical expressions we deal with have more than one type of operation, which may have different precedence order. The precedence order of the most commonly used mathematical operators is given below.

// Diagram: Operator precedence table

An expression must be evaluated in the correct order of precedence of its operations to get the correct results. Consider the following mathematical expression with different types of operations. To evaluate it correctly, the evaluation order of operation should follow the operator precedence rule, which means, in this case, we must start the evaluation from the middle and not the left.

// Diagram: Evaluating an expression with mixed type of operands

Such an evaluation is quite easy for humans because we can easily jump back and forth in the expression, solve parts of expressions first, save contextual information in our brain, and iteratively evaluate each operation in the order of precedence until the entire expression is evaluated.

However, formulating this entire process as an algorithm for a CPU that only performs one binary operation at a time is very difficult. We would first need to parse the entire expression, identify all operations and their precedence, solve individual operations in the correct order, save the intermediate results, and repeat this process multiple times. All this becomes even more difficult when we add parentheses to this mix that can create an arbitrary level of nesting.

Consider the following expression and its evaluation order when we throw parentheses in the mix.

// Diagram: Evaluating an expression in infix notation requires jumping back and forth and evaluating partial results.

As we will learn later in the course, to solve this problem, we use completely different ways of denoting mathematical expressions called the prefix and postfix notations.

***

# Understanding the postfix notation

All mathematical expressions that humans work with and intuitively understand are infix notations, which are hard for a computer to parse and evaluate. A Polish mathematician named Jan Lukasiewicz suggested two alternative notations to write mathematical expressions, the postfix and prefix notations, which are also known as the reverse Polish notation and the Polish notation, respectively. We will look at the postfix notation in this lesson and learn about the prefix notation later in the course.

The idea behind the postfix notation is quite simple: instead of writing operations between the operands, the operation is written **after** the operand. Hence, the name postfix notation is also known as the reverse Polish notation.

// Diagram: The postfix notation places the operator after the operands.

## Examples

Let's look at a couple of examples to understand the postfix notation bette. Given below are a few mathematical expressions represented in the infix notation and their corresponding prefix and postfix notations.

// Diagram: Examples of postfix notation

## How does postfix notation work

In the infix notation, parentheses dictate the order in which operations are performed, and all operators follow specific precedence rules. The postfix notation, on the other hand, can be evaluated by traversing the expression sequentially from start to end. Consider the following infix expression with multiple parentheses and mixed operators of different precedence and its equivalent postfix expression.

// Diagram: The postfix notation of a complex infix expression.

To evaluate the postfix notation, we start from the leftmost item and keep moving to the right until we encounter an operator. We then use the required number of operands from the most recently seen operands to evaluate the operation, store the result, and keep moving right. This left-to-right evaluation implicitly enforces precedence, i.e., the operator operand pair that comes first is evaluated first. Hence, the postfix notation also eliminates the need for parentheses and operator precedence rules.

We can see how, traversing from left to right, we can easily evaluate the postfix expression without any complexity by performing operations as we find the operands. 

// Diagram: Evaluating a postfix expression

The evaluation order of the expression is given below.

// Diagram: Evaluation order of the postfix expression.

We will learn more about how to evaluate expressions in postfix notation using a stack and how to convert from infix notation to postfix notation later in the course.

***

# Understanding the prefix notation

Now that we know the infix and postfix notations, it should be quite easy to understand the prefix notation. It is an alternative notation to write the mathematical expression where the operator is written **before** the operands. It is also called the Polish notation.

It is important to note that even though the prefix notation looks just the reverse of the postfix notation, simply reversing postfix notation will not result in the prefix notation. We will learn more about this and how to convert postfix to prefix later in the course.

// Diagram: The prefix notation places the operator before the operands.

## Examples

Let's look at a couple of examples to understand the prefix notation better. Given below are a few mathematical expressions represented in the infix notation and their corresponding prefix notations.

// Diagram: Examples of prefix notation

## How does prefix notation work

The prefix notation is evaluated very similarly to the postfix notation, the only difference being that we evaluate the expression in reverse from end to start. Consider the following infix expression with multiple parentheses and mixed operators of different precedence and its equivalent prefix expression.

// Diagram: The prefix notation of a complex infix expression.

We start from the rightmost item and move to the left until we encounter any operator. We then use the required number of operands from the most recently seen operands to evaluate the operation, store the result, and keep moving left. This right-to-left evaluation implicitly enforces precedence, i.e., the operator operand pair that comes first is evaluated first. Hence, the prefix notation eliminates the need for parentheses and operator precedence rules.

We can see how, traversing from right to left, we can easily evaluate the prefix expression without any complexity by performing operations as we find the operands. 

// Diagram: Evaluating a prefix expression

The evaluation order of the expression is given below.

// Diagram: Evaluation order of the prefix expression.

We will learn more about how to evaluate expressions in prefix notation using a stack and how to convert from infix notation to prefix notation later in the course.
