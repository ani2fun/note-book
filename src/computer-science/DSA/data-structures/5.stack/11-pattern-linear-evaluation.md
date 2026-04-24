# 11. Pattern: Linear evaluation

## Table of contents

1. [Understanding the linear evaluation pattern](#identifying-the-linear-evaluation-pattern)
2. [Identifying the linear evaluation pattern](#identifying-the-linear-evaluation-pattern)
3. [Canonicalise path](#canonicalise-path)
4. [Bracketed reversal](#bracketed-reversal)
5. [String expansion](#string-expansion)
6. [Formula parsing](#formula-parsing)

***

# Understanding the evaluation pattern

There are some problems where we are given a sequence of data, and we need to evaluate it based on some rules. When dealing with such sequences, the evaluation may require storing contextual information and deferring evaluation until certain triggers are hit. In most cases, to evaluate the sequence, we must move through the sequence, keeping track of several data items and performing some operation on some of these data items on hitting a trigger. The triggers may themselves be of different types, each with its own set of rules for evaluation. Each evaluation may either add, remove, or update data items from the sequence and subsequent triggers operate on the previously evaluated results.

An example of a sequence with data and triggers is given below.

// Diagram: A sequence with data and triggers,

The evaluation technique uses the LIFO property of a stack to solve such problems by storing data items in the stack, maintaining the most to least recent order, and incrementally evaluating the results using this data when certain triggers are hit.

The evaluation pattern is a classification of problems that can be solved using the linear evaluation technique using a stack.

## The linear evaluation technique

To understand the linear evaluation technique, consider we are given a sequence of data represented by numbers`1, 2, 3, 4 ... N`. The sequence also contains various triggers denoted by `T1, T2, T3 ... TN` interleaved with the data. Each trigger type `Ti` may have specific rules that govern the evaluation of some data items before it. To evaluate a sequence, we traverse it from start to end, and when hitting a trigger, we apply its evaluation rules, which may either remove, add, or update the data items in the sequence traversed so far. We continue the traversal and the evaluated sequence becomes the input for the next trigger.

// Diagram: Evaluate a linear sequence of data with triggers

To evaluate the sequence, we create a stack`stack`to hold all the data items in LIFO order and iterate through the sequence. In each iteration, we check whether the current item is a data item or a trigger. If it is a data item, we push it to the top of the stack. Otherwise, if it is a trigger, we use the specific rule for that trigger to evaluate the remaining sequence in the stack, which may either add, update, or remove items from the stack.

At the end of all iterations, the stack will have the final evaluated result.

// Diagram: Evaluate a linear sequence of data with triggers

Note that we only learned the generic evaluation technique in this lesson. However, actual problems may also requiring maintaining some state variables that may be used in tandem with the data in the stack to evaluate the sequence.

## Algorithm

The algorithm below outlines the generic linear evaluation technique using a stack.

> **Algorithm**
>
> -   **Step 1:** Create a stack \`stack\` to hold all data items
> -   **Step 2:** Iterate in the sequence from start to end, and in each iteration, do the following:
>     -   **Step 2.1:** If the current item is a data item, push it to the top of the \`stack\`
>     -   **Step 2.2:** If the current item is a trigger, evaluate the sequence in the stack using the rules for this trigger
> -   **Step 3:** The evaluated result is in the stack.

## Implementation

Given below is the generic code implementation to evaluate a linear sequence with data and triggers using a stack.

C++

```cpp
vector<string> linearEvaluation(vector<string> &arr)
{
    // Create a stack to store data items
    stack<string> stack;

    // Iterate through each item in the input sequence
    for (auto& item: arr ) {
        if (isDataItem(item)) {
            // Push the data item to the stack
            stack.push(item);
        } else {
            // If this is a trigger, use specific rules for
            // this trigger to evalute results sotred in stack

            // This may add, update or remove multiple data items
            // in the stack
            evaluateTrigger(item, stack);
        }
    // The data items remaining in the stack
    // from bottom to top make up the evaluated sequence
    vector<string> result;

    while(!stack.empty()) {
      result.push_back(stack.top());
      stack.pop();
    }

    // Since popping from stack produces data in LIFO order
    // appending to result creates evaluated results in reverse
    // so we reverse it to get the correct bottom to top order of stack
    reverse(result.begin(), result.end());

    return result;
}
```

Java

```java
public class LinearEvaluator {

    public List<String> linearEvaluation(List<String> arr) {
        // Create a stack to store data items
        Stack<String> stack = new Stack<>();

        // Iterate through each item in the input sequence
        for (String item : arr) {
            if (isDataItem(item)) {
                // Push the data item to the stack
                stack.push(item);
            } else {
                // If this is a trigger, use specific rules for
                // this trigger to evaluate results stored in stack

                // This may add, update or remove multiple data items
                // in the stack
                evaluateTrigger(item, stack);
            }

        // The data items remaining in the stack
        // from bottom to top make up the evaluated sequence
        List<String> result = new ArrayList<>();
        while (!stack.isEmpty()) {
            result.add(stack.pop());
        }

        // Since popping from stack produces data in LIFO order
        // appending to result creates evaluated results in reverse
        // so we reverse it to get the correct bottom to top order of stack
        Collections.reverse(result);

        return result;
    }
```

Typescript

```typescript
vector<string> linearEvaluation(vector<string> &arr)
```

Javascript

```javascript
function linearEvaluation(arr) {
  // Create a stack to store data items
  const stack = [];

  // Iterate through each item in the input sequence
  for (const item of arr) {
    if (isDataItem(item)) {
      // Push the data item to the stack
      stack.push(item);
    } else {
      // If this is a trigger, use specific rules for
      // this trigger to evaluate results stored in stack

      // This may add, update, or remove multiple data items
      // in the stack
      evaluateTrigger(item, stack);
    }

  // The data items remaining in the stack
  // from bottom to top make up the evaluated sequence
  const result = [];
  while (stack.length > 0) {
    result.push(stack.pop());
  }

  // Since popping from stack produces data in LIFO order
  // appending to result creates evaluated results in reverse
  // so we reverse it to get the correct bottom-to-top order of stack
  result.reverse();

  return result;
}
```

Python

```python
vector<string> linearEvaluation(vector<string> &arr)
```

## Complexity Analysis

The algorithm's time and space complexity depends on the problem. However, in most cases, we traverse the sequence from start to end once in any case, and in each iteration, we either push the current item to the stack or pop a few items from the stack for evaluation. Since each data item is pushed exactly once onto the stack and may be popped at most once for evaluation, the worst-case time complexity for these operations is linear **O(N)**, considering the evaluation itself is a constant time **O(1)** operation. In any case, we need to traverse the entire sequence to evaluate the result, so the time complexity in any case is linear **O(N)**.

We create a stack to hold the data items, and in the worst case, if the sequence does not have any triggers, the stack will have all the items of the sequence, leading to a linear **O(N)** space complexity. In the best case, there may be no data items and only triggers in the sequence, so the stack will be empty all the time, leading to a constant **O(1)** space complexity.

> **Best Case -** Only triggers in the sequence
>
> -   Space Complexity - **O(1)**
> -   Time Complexity - **O(N)**
>
> **Worst Case -** Only data items in the sequence
>
> -   Space Complexity - **O(N)**
> -   Time Complexity - **O(N)**

Later in the course, we will examine techniques for identifying problems that can be solved using the linear evaluation technique and walk through an example to better understand it.

***

# Identifying the linear evaluation pattern

The linear evaluation technique we learned earlier can only solve certain types of sequence evaluation problems. These are generally easy or medium problems where we are given a sequence of data items and triggers and certain rules dictating how to evaluate results when we hit a trigger. The sequence must not have any form of nesting, and triggers should always only use data either exclusively before or after them.

If the problem statement or its solution follows the generic template below, it can be solved by using the linear evaluation technique using a stack.

**Template:** 

Given a sequence of data items and triggers without any nesting and a set of evaluation rules on hitting a trigger, evaluate the sequence.

## Exaxmple

Let's consider the following problem as an example to better understand how to identify and solve a problem using the linear evaluation technique.

> **Problem statement:** Given a string \`path\` that contains the absolute path (starting with a /) to a directory in UNIX style. Write a function to simplify the path to make it a canonical path.
>
> The following rules govern the simplification:
>
> -   . (dot) refers to the current directory
> -   .. (double-dot) refers to the directory up a level
> -   // (multiple slashes) is treated as a single slash
> -   All other items are treated as directories

// Diagram: Simplify the linux path

## The linear evaluation technique

We are given a sequence of data and the following triggers, which have specific rules for evaluation that adhere to the Linux path syntax.

1.  1`/` - Means we are jumping to a subdirectory so we can ignore it as we don't need any evaluation
2.  2`.` - This means the current directory and so we can ignore it as we don't need any evaluation
3.  3`..` - This means the previous directory meaning we need to remove the previous directory from the path to get the evaluated result

The problem description fits the template for the linear evaluation pattern, as given below.

**Template:** 

Given a sequence of data items and triggers without any nesting and a set of evaluation rules on hitting a trigger, evaluate the sequence.

We create a stack `stack` of strings to hold all the data items in LIFO order as we iterate through the sequence. It is important to note that we are **not** given an array of strings with data items and triggers separated but a string of characters. And so, we also need to parse the data items and triggers as we traverse the sequence before adding them to the stack.

We traverse the string from start to end and, in each iteration, parse the entire word until the next `/` in a variable dir. We then check if the current word is a data item or a trigger. If it is a data item, we push it to the top of the stack. Otherwise, if it is a trigger, we apply the rules defined above to evaluate data items from the stack. The rules are as follows:

1.  1`/` - We ignore this trigger
2.  2`.` - We ignore this trigger
3.  3`..` - We pop an item from the top of the stack

At the end of all iterations, the stack will have the simplified Linux path with all directory names in the correct order from bottom to top.

// Diagram: Simplify the linux path

We create a string `result` to construct the simplified path from the evaluated result. If the stack is empty, we set `result` to `/` to indicate the root directory. Otherwise, we pop items from the top of the stack until it is empty and **prepend** them to `result` with a `/` for separating directories to get the simplified path in `result`.

Note that we **prepend** data items to the string instead of appending. This is because we want data in the order of insertion in the stack (from bottom to top), but popping data from the stack produces data in LIFO order, which is the reverse order of insertion.

// Diagram: Simplify the linux path

The implementation of the linear evaluation technique is given below.

C++

```cpp
#include <sstream>
#include <stack>

// Diagram: using namespace std;

class Solution {
public:
    string canonicalisePath(string path) {
        stack<string> stack;
        stringstream ss(path);
        string token;

        // Split the path by '/'
        while (getline(ss, token, '/')) {

            // Skip empty or current directory ('.') components
            if (token == "" || token == ".") {
                continue;
            }

            // Push the valid directory name onto the stack
            else if (token != "..") {
                stack.push(token);
            }

            // Go up one directory if the current directory is '..' and
            // the stack is not empty
            else if (!stack.empty()) {
                stack.pop();
            }

        // If the stack is empty, return "/"
        if (stack.empty()) {
            return "/";
        }

        // Construct the simplified path by popping the stack
        string result = "";
        while (!stack.empty()) {

            // Prepend the directory name to the result
            result = "/" + stack.top() + result;
            stack.pop();
        }

        return result;
    }
};
```

Java

```java
#include <sstream>
```

Typescript

```typescript
export class Solution {
    canonicalisePath(path: string): string {

        // Stack to store valid directory names
        const stack: string[] = [];

        // Split the path by '/' and iterate over components
        for (const token of path.split("/")) {

            // Skip empty or current directory ('.') components
            if (token === "" || token === ".") {
                continue;
            }

            // Push the valid directory name onto the stack
            else if (token !== "..") {
                stack.push(token);
            }

            // Go up one directory if the current directory is '..' and
            // the stack is not empty
            else if (stack.length > 0) {
                stack.pop();
            }

        // If the stack is empty, return "/"
        if (stack.length === 0) {
            return "/";
        }

        // Construct the simplified path by joining stack elements
        return "/" + stack.join("/");
    }
```

Javascript

```javascript
#include <sstream>
```

Python

```python
from typing import List

class Solution:
    def canonicalise_path(self, path: str) -> str:

        # Stack to store valid directory names
        stack: List[str] = []

        # Split the path by '/' and iterate over components
        for token in path.split('/'):

            # Skip empty or current directory ('.') components
            if token == "" or token == ".":

            # Push the valid directory name onto the stack
            elif token != "..":
                stack.append(token)

            # Go up one directory if the current directory is '..' and
            # the stack is not empty
            elif stack:
                stack.pop()

        # If the stack is empty, return "/"
        if not stack:
            return "/"

        # Construct the simplified path by joining stack elements
        return "/" + "/".join(stack)
```

The sequence validation technique solves the problem in a single pass and linear**O(N)**time.

## Example problems

Most problems in this category are **easy** or **medium**; a list of a few is given below.

> -   **[Canonicalise path](https://www.codeintuition.io/courses/stack/WsTielQEJ1AnEq-zb31AC)**
> -   **[Bracketed reversal](https://www.codeintuition.io/courses/stack/el4HjKWYsIDL1o7r4BadI)**
> -   **[String expansion](https://www.codeintuition.io/courses/stack/PATNY86Ee5N1DGdt41znJ)**
> -   **[Formula parsing](https://www.codeintuition.io/courses/stack/EhQOCTCTCDkCclszb41H7)**

We will now solve these problems to understand the linear evaluation technique better.

***

# Canonicalise path

## Problem Statement

Given a string **path** that contains the absolutepath (starting with a `/`) to a directory in UNIX style. Write a function to simplify the path to make it a canonical path. Below are the rules for this simplification:

> -   **.** (dot) refers to the current directory
> -   **..** (double-dot) refers to the directory up a level
> -   **//** (multiple slashes) is treated as a single slash
> -   All other items are treated as directories

The simplified path must follow the rules below:

> -   The path must begin with a single slash **/**.
> -   Directories within the path must separated by a single slash **/**.
> -   The path must not end with a slash **/**, unless it's the root directory.
> -   The path must not have any **.** or **..** used to denote current or parent directories.

### Example 1

> -   **Input:** s = /a/b/../c
> -   **Output:** /a/c
> -   **Explanation:** Above is the simplified UNIX path.

### Example 2

> -   **Input:** s = /a/./../c
> -   **Output:** /c
> -   **Explanation:** Above is the simplified UNIX path.

### Example 3

> -   **Input:** s = /a//b/c/../
> -   **Output:** /a/b
> -   **Explanation:** Above is the simplified UNIX path.

## Solution

```cpp
#include <sstream>
#include <stack>

using namespace std;

class Solution {
public:
    string canonicalisePath(string path) {
        stack<string> stack;
        stringstream ss(path);
        string token;

        // Split the path by '/'
        while (getline(ss, token, '/')) {

            // Skip empty or current directory ('.') components
            if (token == "" || token == ".") {
                continue;
            }

            // Push the valid directory name onto the stack
            else if (token != "..") {
                stack.push(token);
            }

            // Go up one directory if the current directory is '..' and
            // the stack is not empty
            else if (!stack.empty()) {
                stack.pop();
            }
        }

        // If the stack is empty, return "/"
        if (stack.empty()) {
            return "/";
        }

        // Construct the simplified path by popping the stack
        string result;
        while (!stack.empty()) {

            // Prepend the directory name to the result
            result = "/" + stack.top() + result;
            stack.pop();
        }

        return result;
    }
};
```

***

# Bracketed Reversal

## Problem Statement

Given a string **s** consisting of lowercase and uppercase letters, square brackets `[` and`]`, write a function to reverse the substrings inside each pair of brackets and return the updated string.

### Example 1

> -   **Input:** s = a\[bcd\]e
> -   **Output:** adcbe
> -   **Explanation:** Above is the string after reversing the substring in the square brackets.

### Example 2

> -   **Input:** s = abcd\[ef\[gh\]i\]j
> -   **Output:** abcdihgfej
> -   **Explanation:** Above is the string after reversing the substring in the square brackets.

### Example 3

> -   **Input:** s = abcdefghij
> -   **Output:** abcdefghij
> -   **Explanation:** There are no square brackets, so there is nothing to reverse.

## Solution

```cpp
#include <stack>

using namespace std;

class Solution {
public:
    string bracketedReversal(string s) {

        // Stack to store characters and decoded parts
        stack<string> stack;

        for (int i = 0; i < s.length(); i++) {

            // If the character is '[' or a letter, push it as a string
            if (s[i] == '[' || isalpha(s[i])) {
                stack.push(string(1, s[i]));
            }

            // If the character is ']', it indicates the end of a
            // bracketed section
            else {

                // Variable to store the substring inside the brackets
                string reversedStr = "";

                // Pop elements from the stack until we reach '['
                while (!stack.empty() && stack.top() != "[") {

                    // Build substring in reversed order
                    reversedStr += stack.top();

                    // Remove the top element from the stack
                    stack.pop();
                }

                // Remove the '[' from the stack
                if (!stack.empty()) {
                    stack.pop();
                }

                // Push the reversed substring back onto the stack
                stack.push(reversedStr);
            }
        }

        // Collect the final result by popping from the stack
        string result;
        while (!stack.empty()) {

            // Prepend the elements to the result string
            result = stack.top() + result;

            // Remove the element from the stack
            stack.pop();
        }

        // Return the final decoded string
        return result;
    }
};
```

***

# String expansion

## Problem Statement

// Diagram: Given an encoded string s, write a function to return its decoded form. The encoding rule is defined below

The encoding is called **k-encoding**. For a given encoding **k\[sting\]**, the string inside the square bracket is concatenated to itself **k** times.

### Example 1

> -   **Input:** s = 2\[ab3\[c\]\]
> -   **Output:** abcccabccc
> -   **Explanation:** Above is the decoded string.

### Example 2

> -   **Input:** s = 3\[a\]2\[bc\]
> -   **Output:** aaabcbc
> -   **Explanation:** Above is the decoded string.

### Example 3

> -   **Input:** s = 2\[abc\]3\[cd\]ef
> -   **Output:** abcabccdcdcdef
> -   **Explanation:** Above is the decoded string.

## Solution

```cpp
#include <stack>

using namespace std;

class Solution {
public:
    string stringExpansion(string s) {

        // Stack to store characters, numbers, and decoded parts
        stack<string> stack;

        for (int i = 0; i < s.length(); i++) {

            // If the current character is a digit, extract the full
            // number
            if (isdigit(s[i])) {
                int start = i;

                // Extract the full number (handles multi-digit numbers)
                while (i < s.length() && isdigit(s[i])) {
                    i++;
                }

                // Push the number as a string to the stack
                stack.push(s.substr(start, i - start));

                // Adjust index because loop will increment i
                i--;
            }

            // If the character is '[' or a letter, push it to the stack
            else if (s[i] == '[' || isalpha(s[i])) {

                // Push characters and '[' directly to the stack
                stack.push(string(1, s[i]));
            }

            // If the character is ']', it indicates the end of an
            // encoded section
            else if (s[i] == ']') {

                // Variable to store the decoded part inside the brackets
                string decodedStr = "";

                // Pop characters from the stack until we reach '['
                while (!stack.empty() && stack.top() != "[") {

                    // Prepend the characters to decodedStr
                    decodedStr = stack.top() + decodedStr;
                    stack.pop();
                }

                // Remove the '[' from the stack
                stack.pop();

                // Get the repeat count (the number just before '[')
                int repeatCount = stoi(stack.top());

                // Remove the repeat count from the stack
                stack.pop();

                // Expand the string by repeating it 'repeatCount' times
                string expandedStr = "";
                while (repeatCount--) {

                    // Append the decoded string repeatedly
                    expandedStr += decodedStr;
                }

                // Push the expanded string back to the stack
                stack.push(expandedStr);
            }
        }

        // Collect the final result by popping from the stack
        string result;
        while (!stack.empty()) {

            // Prepend the elements to the result string
            result = stack.top() + result;

            // Remove the element from the stack
            stack.pop();
        }

        // Return the final decoded string
        return result;
    }
};
```

***

# Formula parsing

## Problem Statement

You are given a valid chemical **formula** as a string. The formula consists of:

> -   **Atoms**: Each atom is represented by a single uppercase letter \`A–Z\`.
> -   **Numbers**: A positive integer may follow an atom or a group of atoms inside parentheses. This number indicates how many times the atom or group repeats. If no number follows, the count is considered 1.
> -   **Parentheses**: Parentheses can be nested and may be followed by a number, which multiplies the counts of all atoms inside that group.

You can assume the following about the input:

> -   All atoms in the input are represented by a single uppercase character. For example, there will be no atoms like \`Na\` or \`Cl\`.
> -   Each atom appears at most once in the input string, i.e. there are no repeated atoms.

Write a function to parse the formula and return a string representing the total count of each atom in the formula. The output must be in the format below.

> -   Output the result as a space-separated string.
> -   Each atom should be written as \`ATOM:COUNT\`.
> -   Atoms must appear in the order of their first appearance in the formula.

### Example 1

> -   **Input:** formula = (HO)2
> -   **Output:** H:2 O:2
> -   **Explanation:** Above represents the parsed formula, showing each atom and its count in the format demonstrated above.

### Example 2

> -   **Input:** formula = H(N(KO)2)3
> -   **Output:** H:1 N:3 K:6 O:6
> -   **Explanation:** Above represents the parsed formula, showing each atom and its count in the format demonstrated above.

### Example 3

> -   **Input:** formula = KH
> -   **Output:** K:1 H:1
> -   **Explanation:** Above represents the parsed formula, showing each atom and its count in the format demonstrated above.

## Solution

```cpp
#include <stack>

using namespace std;

// Define a structure to hold atom information
struct Atom {
    char name;
    int count;
};

class Solution {
public:
    string formulaParsing(string formula) {

        // Stack to store atoms, counts, and group markers
        stack<Atom> stack;

        for (int i = 0; i < formula.length(); i++) {

            // If the current character is '(', push it to mark the start
            // of a group
            if (formula[i] == '(') {
                stack.push(Atom{'(', -1});
            }

            // If the current character is ')', process the group
            else if (formula[i] == ')') {

                // Move past ')', check for multiplier
                i++;

                // Read multiplier (if any)
                int multiplier = 0;
                while (i < formula.length() && isdigit(formula[i])) {
                    multiplier = multiplier * 10 + (formula[i] - '0');
                    i++;
                }

                // If no multiplier, default to 1
                if (multiplier == 0) {
                    multiplier = 1;
                }

                // adjust index because for loop will increment
                i--;

                // Collect atoms in the group
                vector<Atom> group;
                while (!stack.empty() && stack.top().name != '(') {
                    group.push_back(stack.top());
                    stack.pop();
                }

                // Remove the '(' from the stack
                if (!stack.empty() && stack.top().name == '(') {
                    stack.pop();
                }

                // Multiply counts and push back
                for (int j = group.size() - 1; j >= 0; j--) {
                    Atom atom = group[j];
                    stack.push(Atom{atom.name, atom.count * multiplier});
                }
            }

            // If the character is an uppercase atom
            else if (isupper(formula[i])) {

                char atomName = formula[i++];

                // Read count (if any)
                int count = 0;
                while (i < formula.length() && isdigit(formula[i])) {
                    count = count * 10 + (formula[i] - '0');
                    i++;
                }

                // If no count, default to 1
                if (count == 0) {
                    count = 1;
                }

                // adjust index because for loop will increment
                i--;

                // Push atom with count as string
                stack.push(Atom{atomName, count});
            }
        }

        // Collect the final result from the stack
        string result;
        while (!stack.empty()) {
            Atom atom = stack.top();
            result = string(1, atom.name) + ":" + to_string(atom.count) +
                     " " + result;
            stack.pop();
        }

        // Remove trailing space
        if (!result.empty()) {
            result.pop_back();
        }

        return result;
    }
};
```
